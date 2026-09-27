import { Song } from '../types/music';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface AudioChannel {
  id: 'channelA' | 'channelB';
  audio: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode | null;
  gainNode: GainNode;
  song: Song | null;
  isFadingOut: boolean;
  crossfadeTriggered: boolean;
  targetDuration: number;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private crossfadeDuration: number = 4;
  private isCrossfadingActive: boolean = false;

  private activeChannelIndex: 0 | 1 = 0;
  private channels: AudioChannel[] = [];
  private channelsInitialized: boolean = false;

  // YouTube Full-Length Audio/Video Engine
  private ytPlayer: any = null;
  private isYtReady: boolean = false;
  private isYtApiLoading: boolean = false;
  private ytPollInterval: number | null = null;
  private activeMode: 'youtube' | 'html5' = 'youtube';
  private currentActiveSong: Song | null = null;
  private pendingSongToPlay: { song: Song; startTime: number } | null = null;
  private isMvVisible: boolean = false;

  private onTimeUpdateCallbacks: Set<(time: number) => void> = new Set();
  private onDurationChangeCallbacks: Set<(duration: number) => void> = new Set();
  private onEndedCallbacks: Set<() => void> = new Set();
  private onCrossfadeTriggerCallbacks: Set<() => void> = new Set();
  private onCrossfadeStateCallbacks: Set<(isCrossfading: boolean) => void> = new Set();
  private onMvStateCallbacks: Set<(visible: boolean) => void> = new Set();

  private fallbackTimerId: number | null = null;
  private simulatedFreqBuffer: Uint8Array = new Uint8Array(32);

  constructor() {
    try {
      const saved = localStorage.getItem('hman_crossfade_duration');
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 12) {
          this.crossfadeDuration = parsed;
        }
      }
    } catch {
      // Ignore
    }

    if (typeof window !== 'undefined') {
      this.initYouTubePlayer();
    }
  }

  // ----------------------------------------------------
  // YouTube Full-Track Audio/Video Player Setup
  // ----------------------------------------------------
  private ensureYouTubeContainer(): HTMLElement {
    let dock = document.getElementById('hman-yt-dock');
    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'hman-yt-dock';
      dock.style.position = 'fixed';
      dock.style.bottom = '96px';
      dock.style.right = '24px';
      dock.style.width = '320px';
      dock.style.height = '180px';
      dock.style.borderRadius = '16px';
      dock.style.overflow = 'hidden';
      dock.style.boxShadow = '0 20px 50px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.15)';
      dock.style.zIndex = '45';
      dock.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      dock.style.display = 'none';
      dock.style.backgroundColor = '#000';

      // Header bar for PiP MV dock
      const header = document.createElement('div');
      header.style.position = 'absolute';
      header.style.top = '0';
      header.style.left = '0';
      header.style.width = '100%';
      header.style.height = '28px';
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.style.padding = '0 8px';
      header.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)';
      header.style.zIndex = '10';

      const title = document.createElement('span');
      title.innerText = 'Official Music Video';
      title.style.color = '#e2e8f0';
      title.style.fontSize = '10px';
      title.style.fontWeight = '600';
      title.style.letterSpacing = '0.05em';
      title.style.fontFamily = 'system-ui, sans-serif';

      const closeBtn = document.createElement('button');
      closeBtn.innerText = '✕';
      closeBtn.style.background = 'none';
      closeBtn.style.border = 'none';
      closeBtn.style.color = '#fff';
      closeBtn.style.fontSize = '12px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.padding = '2px 6px';
      closeBtn.title = 'Minimize video (audio keeps playing)';
      closeBtn.onclick = () => this.setMvVisible(false);

      header.appendChild(title);
      header.appendChild(closeBtn);
      dock.appendChild(header);

      const iframeSlot = document.createElement('div');
      iframeSlot.id = 'hman-yt-slot';
      iframeSlot.style.width = '100%';
      iframeSlot.style.height = '100%';
      dock.appendChild(iframeSlot);

      document.body.appendChild(dock);
    }
    return dock;
  }

  private loadYouTubeApi(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.YT && window.YT.Player) {
      this.isYtReady = true;
      return Promise.resolve();
    }
    if (this.isYtApiLoading) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (this.isYtReady) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    this.isYtApiLoading = true;
    return new Promise((resolve) => {
      const existing = document.getElementById('yt-iframe-api');
      if (!existing) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        this.isYtReady = true;
        this.isYtApiLoading = false;
        resolve();
      };
    });
  }

  private async initYouTubePlayer() {
    if (this.ytPlayer || typeof window === 'undefined') return;
    this.ensureYouTubeContainer();
    await this.loadYouTubeApi();

    try {
      this.ytPlayer = new window.YT.Player('hman-yt-slot', {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
          controls: 1,
          disablekb: 1,
          fs: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            this.isYtReady = true;
            if (this.pendingSongToPlay) {
              const { song, startTime } = this.pendingSongToPlay;
              this.pendingSongToPlay = null;
              this.playWithYouTube(song, startTime);
            }
          },
          onStateChange: (event: any) => {
            // YT states: -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
            if (event.data === 1) {
              this.isPlaying = true;
              const dur = this.ytPlayer.getDuration();
              if (dur > 0) {
                this.notifyDurationChange(dur);
              }
            } else if (event.data === 2) {
              this.isPlaying = false;
            } else if (event.data === 0) {
              // Full song actually ended!
              this.notifyEnded();
            }
          },
          onError: (e: any) => {
            console.warn('YouTube player warning:', e);
            // Fallback to HTML5 audio if YouTube has geographical restrictions
            this.fallbackToHtml5();
          }
        }
      });
    } catch (e) {
      console.warn('YouTube init warning:', e);
    }
  }

  private startYouTubePolling() {
    if (this.ytPollInterval !== null) {
      clearInterval(this.ytPollInterval);
    }
    this.ytPollInterval = window.setInterval(() => {
      if (this.activeMode === 'youtube' && this.ytPlayer && this.isYtReady && this.isPlaying) {
        try {
          const currentTime = this.ytPlayer.getCurrentTime();
          const duration = this.ytPlayer.getDuration();
          if (typeof currentTime === 'number' && !isNaN(currentTime)) {
            this.notifyTimeUpdate(currentTime);

            // Crossfade notification if near full-track ending
            if (
              this.crossfadeDuration > 0 &&
              duration > this.crossfadeDuration + 2 &&
              currentTime >= duration - this.crossfadeDuration
            ) {
              this.notifyCrossfadeTrigger();
            }
          }
        } catch {
          // Ignore polling errors during player buffering
        }
      }
    }, 200);
  }

  public setMvVisible(visible: boolean) {
    this.isMvVisible = visible;
    const dock = document.getElementById('hman-yt-dock');
    if (dock) {
      dock.style.display = visible ? 'block' : 'none';
    }
    this.onMvStateCallbacks.forEach((cb) => cb(visible));
  }

  public toggleMvVisible(): boolean {
    const next = !this.isMvVisible;
    this.setMvVisible(next);
    return next;
  }

  public getIsMvVisible(): boolean {
    return this.isMvVisible;
  }

  public subscribeMvState(cb: (visible: boolean) => void): () => void {
    this.onMvStateCallbacks.add(cb);
    return () => this.onMvStateCallbacks.delete(cb);
  }

  // ----------------------------------------------------
  // HTML5 Web Audio Setup (for Local Uploaded MP3s / Fallback)
  // ----------------------------------------------------
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
          sourceNode = null;
        }
      } else {
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
        targetDuration: 0,
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
      if (activeChannel === channel && this.isPlaying && this.activeMode === 'html5') {
        const rawTime = audio.currentTime;
        const dur = audio.duration || channel.targetDuration;
        this.notifyTimeUpdate(rawTime);

        if (
          !channel.crossfadeTriggered &&
          this.crossfadeDuration > 0 &&
          dur > this.crossfadeDuration + 2 &&
          rawTime >= dur - this.crossfadeDuration
        ) {
          channel.crossfadeTriggered = true;
          this.notifyCrossfadeTrigger();
        }
      }
    });

    audio.addEventListener('ended', () => {
      const activeChannel = this.channels[this.activeChannelIndex];
      if (activeChannel === channel && this.activeMode === 'html5') {
        if (!channel.crossfadeTriggered) {
          this.notifyEnded();
        }
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      const activeChannel = this.channels[this.activeChannelIndex];
      if (activeChannel === channel && this.activeMode === 'html5') {
        if (!isNaN(audio.duration) && audio.duration > 0) {
          channel.targetDuration = audio.duration;
          this.notifyDurationChange(audio.duration);
        }
      }
    });
  }

  // ----------------------------------------------------
  // Playback Control: Full Song Playback
  // ----------------------------------------------------
  public async playSong(song: Song, startTime: number = 0, forceCrossfade?: boolean) {
    this.currentActiveSong = song;

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // 1. If song has YouTube ID, use YouTube Full-Track engine!
    if (song.youtubeId) {
      this.activeMode = 'youtube';
      // Stop all HTML5 audio
      this.channels.forEach((c) => {
        c.audio.pause();
        c.audio.currentTime = 0;
      });

      if (!this.isYtReady || !this.ytPlayer) {
        this.pendingSongToPlay = { song, startTime };
        this.initYouTubePlayer();
      } else {
        this.playWithYouTube(song, startTime);
      }
      return;
    }

    // 2. Otherwise use HTML5 Audio element (e.g. user local uploaded MP3 file)
    this.activeMode = 'html5';
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }

    await this.playWithHtml5(song, startTime, forceCrossfade);
  }

  private playWithYouTube(song: Song, startTime: number = 0) {
    if (!this.ytPlayer || !this.isYtReady) return;

    this.isPlaying = true;
    try {
      this.ytPlayer.loadVideoById({
        videoId: song.youtubeId,
        startSeconds: startTime || 0,
      });
      this.ytPlayer.setVolume(this.isMuted ? 0 : Math.round(this.volume * 100));
      this.ytPlayer.playVideo();
    } catch (e) {
      console.warn('YouTube loadVideoById error:', e);
    }

    this.notifyDurationChange(song.duration);
    this.notifyTimeUpdate(startTime || 0);
    this.startYouTubePolling();
  }

  private async playWithHtml5(song: Song, startTime: number = 0, forceCrossfade?: boolean) {
    this.initAudioNodes();

    const shouldCrossfade =
      (forceCrossfade ?? this.crossfadeDuration > 0) &&
      this.isPlaying &&
      this.channels.length > 1 &&
      this.crossfadeDuration > 0;

    const fadeDuration = shouldCrossfade ? this.crossfadeDuration : 0;
    const prevChannel = this.channels[this.activeChannelIndex];

    const nextChannelIndex = (
      shouldCrossfade ? (this.activeChannelIndex === 0 ? 1 : 0) : this.activeChannelIndex
    ) as 0 | 1;
    const nextChannel = this.channels[nextChannelIndex];

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
      this.channels.forEach((c) => {
        if (c !== nextChannel) {
          c.audio.pause();
          c.audio.currentTime = 0;
        }
      });
      this.setCrossfadingState(false);
    }

    this.activeChannelIndex = nextChannelIndex;
    nextChannel.song = song;
    nextChannel.isFadingOut = false;
    nextChannel.crossfadeTriggered = false;
    nextChannel.targetDuration = song.duration;

    this.notifyDurationChange(song.duration);

    if (song.audioUrl) {
      nextChannel.audio.src = song.audioUrl;
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
        console.warn('HTML5 Playback deferred:', err);
      }
    } else {
      this.isPlaying = true;
      this.startFallbackTimer(song, startTime);
    }
  }

  private fallbackToHtml5() {
    if (this.currentActiveSong && this.currentActiveSong.audioUrl) {
      this.activeMode = 'html5';
      this.playWithHtml5(this.currentActiveSong, 0);
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

  // ----------------------------------------------------
  // Transport Controls: Volume, Seek, Pause, Resume
  // ----------------------------------------------------
  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.channels.forEach((c) => {
      c.audio.volume = this.isMuted ? 0 : this.volume;
    });
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.setVolume(this.isMuted ? 0 : Math.round(this.volume * 100));
      } catch {}
    }
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
    if (this.ytPlayer && this.isYtReady) {
      try {
        if (this.isMuted) {
          this.ytPlayer.mute();
        } else {
          this.ytPlayer.unMute();
          this.ytPlayer.setVolume(Math.round(this.volume * 100));
        }
      } catch {}
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public pause() {
    this.isPlaying = false;
    this.setCrossfadingState(false);
    if (this.activeMode === 'youtube' && this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {}
    }
    this.channels.forEach((c) => {
      c.audio.pause();
    });
    if (this.fallbackTimerId !== null) {
      clearInterval(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }
  }

  public resume() {
    this.isPlaying = true;
    if (this.activeMode === 'youtube' && this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.playVideo();
      } catch {}
    } else {
      const channel = this.channels[this.activeChannelIndex];
      if (channel && channel.audio.src) {
        channel.audio.play().catch(() => {});
      } else if (this.currentActiveSong) {
        this.startFallbackTimer(this.currentActiveSong, this.getPlaybackTime());
      }
    }
  }

  public seek(time: number) {
    if (this.activeMode === 'youtube' && this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.seekTo(time, true);
      } catch {}
    } else {
      const channel = this.channels[this.activeChannelIndex];
      if (channel && channel.audio.src) {
        channel.audio.currentTime = time;
      }
    }
    this.notifyTimeUpdate(time);
  }

  public stopPlayback() {
    this.isPlaying = false;
    this.setCrossfadingState(false);
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.stopVideo();
      } catch {}
    }
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
    if (this.activeMode === 'youtube' && this.ytPlayer && this.isYtReady) {
      try {
        return this.ytPlayer.getCurrentTime() || 0;
      } catch {
        return 0;
      }
    }
    const channel = this.channels[this.activeChannelIndex];
    return channel ? channel.audio.currentTime || 0 : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSong(): Song | null {
    return this.currentActiveSong;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // Frequency Data for Visualizer
  public getFrequencyData(): Uint8Array {
    if (this.activeMode === 'html5' && this.analyser && this.isPlaying) {
      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(buffer);
      let sum = 0;
      for (let i = 0; i < 16; i++) {
        sum += buffer[i];
      }
      if (sum > 0) {
        return buffer;
      }
    }

    // Dynamic rhythm simulation when streaming via YouTube
    if (this.isPlaying && this.currentActiveSong) {
      const time = this.getPlaybackTime();
      const bpm = this.currentActiveSong.audioConfig?.bpm || 110;
      const beatProgress = (time * (bpm / 60)) % 1;
      const beatHit = Math.exp(-beatProgress * 4.5); // Sharp rhythmic beat punch

      for (let i = 0; i < 32; i++) {
        const freqWave = Math.sin(time * 3 + i * 0.4) * 0.5 + 0.5;
        const bassWeight = i < 8 ? 1.4 : i < 16 ? 1.0 : 0.6;
        const val = Math.min(255, Math.floor((beatHit * 140 + freqWave * 90) * bassWeight));
        this.simulatedFreqBuffer[i] = val;
      }
      return this.simulatedFreqBuffer;
    }

    return this.simulatedFreqBuffer.fill(0);
  }

  // Crossfade Duration
  public setCrossfadeDuration(seconds: number) {
    this.crossfadeDuration = Math.max(0, Math.min(12, seconds));
    try {
      localStorage.setItem('hman_crossfade_duration', this.crossfadeDuration.toString());
    } catch {}
  }

  public getCrossfadeDuration(): number {
    return this.crossfadeDuration;
  }

  public getIsCrossfading(): boolean {
    return this.isCrossfadingActive;
  }

  // Subscriptions
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

  private notifyDurationChange(dur: number) {
    this.onDurationChangeCallbacks.forEach((cb) => cb(dur));
  }

  private notifyEnded() {
    this.onEndedCallbacks.forEach((cb) => cb());
  }

  private notifyCrossfadeTrigger() {
    this.onCrossfadeTriggerCallbacks.forEach((cb) => cb());
  }

  private setCrossfadingState(active: boolean) {
    if (this.isCrossfadingActive !== active) {
      this.isCrossfadingActive = active;
      this.onCrossfadeStateCallbacks.forEach((cb) => cb(active));
    }
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
