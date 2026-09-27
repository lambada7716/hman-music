import { Song } from '../types/music';

interface AudioChannel {
  id: 'channelA' | 'channelB';
  audio: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode;
  song: Song | null;
  isFadingOut: boolean;
  crossfadeTriggered: boolean;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private crossfadeDuration: number = 4; // Default 4 seconds crossfade
  private isCrossfadingActive: boolean = false;

  private activeChannelIndex: 0 | 1 = 0;
  private channels: AudioChannel[] = [];
  private channelsInitialized: boolean = false;

  private onTimeUpdateCallbacks: Set<(time: number) => void> = new Set();
  private onDurationChangeCallbacks: Set<(duration: number) => void> = new Set();
  private onEndedCallbacks: Set<() => void> = new Set();
  private onCrossfadeTriggerCallbacks: Set<() => void> = new Set();
  private onCrossfadeStateCallbacks: Set<(isCrossfading: boolean) => void> = new Set();

  private fallbackTimerId: number | null = null;
  private simulatedFreqBuffer: Uint8Array = new Uint8Array(32);

  constructor() {
    // Attempt to load persisted crossfade preference
    try {
      const saved = localStorage.getItem('hman_crossfade_duration');
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 12) {
          this.crossfadeDuration = parsed;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private initAudioNodes() {
    if (this.channelsInitialized) return;

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio Context initialization warning:', e);
    }

    // Create 2 audio channels for seamless playback and dual-track crossfades
    const channelIds: ('channelA' | 'channelB')[] = ['channelA', 'channelB'];
    this.channels = channelIds.map((id) => {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';

      let gainNode: GainNode;
      let sourceNode: MediaElementAudioSourceNode | null = null;

      if (this.ctx && this.masterGain) {
        gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
        gainNode.connect(this.masterGain);

        try {
          sourceNode = this.ctx.createMediaElementSource(audio);
          sourceNode.connect(gainNode);
        } catch {
          // In case createMediaElementSource is not supported or CORS restricted
          sourceNode = null;
        }
      } else {
        // Fallback mock gain
        gainNode = {
          gain: {
            value: 1,
            setValueAtTime: () => {},
            setTargetAtTime: () => {},
            linearRampToValueAtTime: () => {},
            cancelScheduledValues: () => {},
          },
          connect: () => {},
          disconnect: () => {},
        } as unknown as GainNode;
      }

      const channel: AudioChannel = {
        id,
        audio,
        sourceNode,
        gainNode,
        song: null,
        isFadingOut: false,
        crossfadeTriggered: false,
      };

      this.attachAudioListeners(channel);
      return channel;
    });

    this.channelsInitialized = true;
  }

  private attachAudioListeners(channel: AudioChannel) {
    const audio = channel.audio;

    audio.addEventListener('timeupdate', () => {
      const activeChannel = this.channels[this.activeChannelIndex];
      if (activeChannel === channel && this.isPlaying) {
        const currentTime = audio.currentTime;
        this.notifyTimeUpdate(currentTime);

        const duration = audio.duration || (channel.song ? channel.song.duration : 0);

        // Check for crossfade trigger threshold
        if (
          !channel.crossfadeTriggered &&
          this.crossfadeDuration > 0 &&
          duration > this.crossfadeDuration + 2 &&
          currentTime >= duration - this.crossfadeDuration
        ) {
          channel.crossfadeTriggered = true;
          this.notifyCrossfadeTrigger();
        }
      }
    });

    audio.addEventListener('ended', () => {
      const activeChannel = this.channels[this.activeChannelIndex];
      if (activeChannel === channel) {
        if (!channel.crossfadeTriggered) {
          this.notifyEnded();
        }
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      const activeChannel = this.channels[this.activeChannelIndex];
      if (activeChannel === channel && !isNaN(audio.duration) && audio.duration > 0) {
        this.notifyDurationChange(audio.duration);
      }
    });

    audio.addEventListener('error', (e) => {
      console.warn(`Audio channel [${channel.id}] error:`, e, audio.error);
    });
  }

  // Volume & Mute Controls
  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    // Also set native audio element volume directly
    this.channels.forEach((c) => {
      c.audio.volume = this.isMuted ? 0 : this.volume;
    });
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    this.channels.forEach((c) => {
      c.audio.muted = this.isMuted;
    });
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Crossfade Configuration
  public setCrossfadeDuration(seconds: number) {
    this.crossfadeDuration = Math.max(0, Math.min(12, seconds));
    try {
      localStorage.setItem('hman_crossfade_duration', this.crossfadeDuration.toString());
    } catch {
      // Ignore localStorage errors
    }
  }

  public getCrossfadeDuration(): number {
    return this.crossfadeDuration;
  }

  public getIsCrossfading(): boolean {
    return this.isCrossfadingActive;
  }

  // Playback Control with Real Song Audio
  public async playSong(song: Song, startTime: number = 0, forceCrossfade?: boolean) {
    this.initAudioNodes();

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const shouldCrossfade =
      (forceCrossfade ?? (this.crossfadeDuration > 0)) &&
      this.isPlaying &&
      this.channels.length > 1 &&
      this.crossfadeDuration > 0;

    const fadeDuration = shouldCrossfade ? this.crossfadeDuration : 0;
    const prevChannel = this.channels[this.activeChannelIndex];

    // Select incoming channel
    const nextChannelIndex = (shouldCrossfade ? (this.activeChannelIndex === 0 ? 1 : 0) : this.activeChannelIndex) as 0 | 1;
    const nextChannel = this.channels[nextChannelIndex];

    // 1. Handle outgoing channel if crossfading
    if (shouldCrossfade && prevChannel && prevChannel !== nextChannel && prevChannel.song) {
      prevChannel.isFadingOut = true;
      this.setCrossfadingState(true);

      const now = this.ctx ? this.ctx.currentTime : 0;
      if (this.ctx && prevChannel.gainNode.gain) {
        prevChannel.gainNode.gain.cancelScheduledValues(now);
        prevChannel.gainNode.gain.setValueAtTime(prevChannel.gainNode.gain.value, now);
        prevChannel.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      }

      window.setTimeout(() => {
        prevChannel.audio.pause();
        prevChannel.isFadingOut = false;
        if (this.ctx && prevChannel.gainNode.gain) {
          prevChannel.gainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
        }
        this.setCrossfadingState(false);
      }, fadeDuration * 1000 + 100);
    } else {
      // Stop all previous audio immediately
      this.channels.forEach((c) => {
        if (c !== nextChannel) {
          c.audio.pause();
          c.audio.currentTime = 0;
        }
      });
      this.setCrossfadingState(false);
    }

    // 2. Prepare incoming channel
    this.activeChannelIndex = nextChannelIndex;
    nextChannel.song = song;
    nextChannel.isFadingOut = false;
    nextChannel.crossfadeTriggered = false;

    // Resolve real audio URL
    let audioUrl = song.audioUrl;
    if (!audioUrl) {
      const fetchedUrl = await this.resolveAudioUrlOnTheFly(song);
      if (fetchedUrl) {
        song.audioUrl = fetchedUrl;
        audioUrl = fetchedUrl;
      }
    }

    if (audioUrl) {
      nextChannel.audio.src = audioUrl;
      nextChannel.audio.currentTime = startTime;

      if (shouldCrossfade && this.ctx && nextChannel.gainNode.gain) {
        const now = this.ctx.currentTime;
        nextChannel.gainNode.gain.cancelScheduledValues(now);
        nextChannel.gainNode.gain.setValueAtTime(0.0001, now);
        nextChannel.gainNode.gain.linearRampToValueAtTime(1.0, now + fadeDuration);
      } else if (this.ctx && nextChannel.gainNode.gain) {
        nextChannel.gainNode.gain.setValueAtTime(1.0, this.ctx.currentTime);
      }

      nextChannel.audio.volume = this.isMuted ? 0 : this.volume;

      try {
        await nextChannel.audio.play();
        this.isPlaying = true;
      } catch (err) {
        console.warn('Playback play request was deferred until user interaction:', err);
      }
    } else {
      // If no audio stream is available, track time progression smoothly
      this.isPlaying = true;
      this.startFallbackTimer(song, startTime);
    }
  }

  private startFallbackTimer(song: Song, startTime: number) {
    if (this.fallbackTimerId !== null) {
      clearInterval(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }

    let current = startTime;
    this.fallbackTimerId = window.setInterval(() => {
      if (!this.isPlaying) return;
      current += 0.25;
      this.notifyTimeUpdate(current);
      if (current >= song.duration) {
        this.notifyEnded();
        if (this.fallbackTimerId !== null) {
          clearInterval(this.fallbackTimerId);
          this.fallbackTimerId = null;
        }
      }
    }, 250);
  }

  private async resolveAudioUrlOnTheFly(song: Song): Promise<string | null> {
    try {
      const isIndo =
        song.genre.toLowerCase().includes('indo') ||
        song.id.startsWith('indo') ||
        song.id.startsWith('lawas');
      const cleanArtist = song.artist
        .replace(/ft\..*$/i, '')
        .replace(/&.*$/i, '')
        .trim();
      const term = `${cleanArtist} ${song.title}`;
      const countryParam = isIndo ? '&country=id' : '';

      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=1&media=music${countryParam}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data.results && data.results[0] && data.results[0].previewUrl) {
        return data.results[0].previewUrl;
      }
    } catch {
      // Fallback
    }
    return null;
  }

  public pause() {
    this.isPlaying = false;
    this.setCrossfadingState(false);
    this.channels.forEach((c) => {
      c.audio.pause();
    });
    if (this.fallbackTimerId !== null) {
      clearInterval(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }
  }

  public resume() {
    const channel = this.channels[this.activeChannelIndex];
    if (!channel || !channel.song) return;

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.isPlaying = true;
    if (channel.audio.src) {
      channel.audio.play().catch(() => {});
    } else {
      this.startFallbackTimer(channel.song, channel.audio.currentTime || 0);
    }
  }

  public seek(time: number) {
    const channel = this.channels[this.activeChannelIndex];
    if (!channel || !channel.song) return;

    const clamped = Math.max(0, Math.min(channel.song.duration, time));
    if (channel.audio.src) {
      channel.audio.currentTime = clamped;
    }
    this.notifyTimeUpdate(clamped);
  }

  public stopPlayback() {
    this.isPlaying = false;
    this.setCrossfadingState(false);
    this.channels.forEach((c) => {
      c.audio.pause();
      c.audio.currentTime = 0;
    });
    if (this.fallbackTimerId !== null) {
      clearInterval(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }
  }

  public getPlaybackTime(): number {
    const channel = this.channels[this.activeChannelIndex];
    return channel ? channel.audio.currentTime : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSong(): Song | null {
    const channel = this.channels[this.activeChannelIndex];
    return channel ? channel.song : null;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getFrequencyData(): Uint8Array {
    if (this.analyser && this.isPlaying) {
      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(buffer);
      // Check if actual audio data is passing through
      let sum = 0;
      for (let i = 0; i < 16; i++) {
        sum += buffer[i];
      }
      if (sum > 0) {
        return buffer;
      }
    }

    // If audio is playing but cross-origin media element source is muted by CORS,
    // provide energetic rhythmic pulse for visualizer so it stays alive with the music
    if (this.isPlaying) {
      const time = performance.now() / 1000;
      const count = this.simulatedFreqBuffer.length;
      for (let i = 0; i < count; i++) {
        const wave = Math.sin(time * 6 + i * 0.4) * 0.5 + 0.5;
        const beat = (Math.sin(time * 12) > 0.7 ? 1.0 : 0.4);
        this.simulatedFreqBuffer[i] = Math.floor((wave * 140 + beat * 80) * (this.isMuted ? 0 : this.volume));
      }
      return this.simulatedFreqBuffer;
    }

    return new Uint8Array(32);
  }

  // Event Subscriptions
  public subscribeTimeUpdate(cb: (time: number) => void): () => void {
    this.onTimeUpdateCallbacks.add(cb);
    return () => this.onTimeUpdateCallbacks.delete(cb);
  }

  public subscribeDurationChange(cb: (duration: number) => void): () => void {
    this.onDurationChangeCallbacks.add(cb);
    return () => this.onDurationChangeCallbacks.delete(cb);
  }

  public subscribeEnded(cb: () => void): () => void {
    this.onEndedCallbacks.add(cb);
    return () => this.onEndedCallbacks.delete(cb);
  }

  public subscribeCrossfadeTrigger(cb: () => void): () => void {
    this.onCrossfadeTriggerCallbacks.add(cb);
    return () => this.onCrossfadeTriggerCallbacks.delete(cb);
  }

  public subscribeCrossfadeState(cb: (isCrossfading: boolean) => void): () => void {
    this.onCrossfadeStateCallbacks.add(cb);
    return () => this.onCrossfadeStateCallbacks.delete(cb);
  }

  private notifyTimeUpdate(time: number) {
    this.onTimeUpdateCallbacks.forEach((cb) => cb(time));
  }

  private notifyDurationChange(duration: number) {
    this.onDurationChangeCallbacks.forEach((cb) => cb(duration));
  }

  private notifyEnded() {
    this.onEndedCallbacks.forEach((cb) => cb());
  }

  private notifyCrossfadeTrigger() {
    this.onCrossfadeTriggerCallbacks.forEach((cb) => cb());
  }

  private setCrossfadingState(state: boolean) {
    if (this.isCrossfadingActive !== state) {
      this.isCrossfadingActive = state;
      this.onCrossfadeStateCallbacks.forEach((cb) => cb(state));
    }
  }
}

export const audioEngine = new AudioEngine();
