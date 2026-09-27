import { Song } from '../types/music';

interface TrackChannel {
  id: string;
  song: Song;
  playbackTime: number;
  gainNode: GainNode;
  timerId: number | null;
  activeNodes: (OscillatorNode | AudioNode)[];
  isFadingOut: boolean;
  stepCount: number;
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

  private currentChannel: TrackChannel | null = null;
  private fadingChannels: TrackChannel[] = [];

  private onTimeUpdateCallbacks: Set<(time: number) => void> = new Set();
  private onEndedCallbacks: Set<() => void> = new Set();
  private onCrossfadeTriggerCallbacks: Set<() => void> = new Set();
  private onCrossfadeStateCallbacks: Set<(isCrossfading: boolean) => void> = new Set();

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

  private initContext() {
    if (!this.ctx) {
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
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Will safely resume upon next user gesture
      });
    }
  }

  // Volume & Mute Controls
  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
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

  // Playback Control with Seamless Crossfade
  public playSong(song: Song, startTime: number = 0, forceCrossfade?: boolean) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const shouldCrossfade =
      (forceCrossfade ?? (this.crossfadeDuration > 0)) &&
      this.isPlaying &&
      this.currentChannel !== null &&
      this.crossfadeDuration > 0;

    const effectiveFadeTime = shouldCrossfade ? this.crossfadeDuration : 0;

    // 1. If currently playing a track and crossfade is enabled, fade out the outgoing channel
    if (this.currentChannel && shouldCrossfade) {
      const outgoing = this.currentChannel;
      outgoing.isFadingOut = true;

      // Smoothly ramp outgoing channel gain down to zero
      outgoing.gainNode.gain.cancelScheduledValues(now);
      outgoing.gainNode.gain.setValueAtTime(outgoing.gainNode.gain.value, now);
      outgoing.gainNode.gain.linearRampToValueAtTime(0.0001, now + effectiveFadeTime);

      this.fadingChannels.push(outgoing);
      this.setCrossfadingState(true);

      // Schedule teardown of outgoing channel after crossfade completes
      window.setTimeout(() => {
        this.teardownChannel(outgoing);
        this.fadingChannels = this.fadingChannels.filter((c) => c.id !== outgoing.id);
        if (this.fadingChannels.length === 0) {
          this.setCrossfadingState(false);
        }
      }, effectiveFadeTime * 1000 + 100);
    } else {
      // Immediate clean stop of any existing channels if not crossfading
      this.stopAllChannels();
      this.setCrossfadingState(false);
    }

    // 2. Create the incoming channel
    const incomingGain = ctx.createGain();
    if (shouldCrossfade) {
      // Start silent and smoothly ramp up
      incomingGain.gain.setValueAtTime(0.0001, now);
      incomingGain.gain.linearRampToValueAtTime(1.0, now + effectiveFadeTime);
    } else {
      incomingGain.gain.setValueAtTime(1.0, now);
    }
    incomingGain.connect(this.masterGain);

    const newChannel: TrackChannel = {
      id: `channel-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      song,
      playbackTime: startTime,
      gainNode: incomingGain,
      timerId: null,
      activeNodes: [],
      isFadingOut: false,
      stepCount: Math.floor(startTime * 4),
      crossfadeTriggered: false,
    };

    this.currentChannel = newChannel;
    this.isPlaying = true;

    // Start playback & note scheduling on this channel
    this.startChannelScheduler(newChannel);
  }

  public pause() {
    this.isPlaying = false;
    this.setCrossfadingState(false);

    if (this.currentChannel) {
      this.pauseChannel(this.currentChannel);
    }

    this.fadingChannels.forEach((c) => this.teardownChannel(c));
    this.fadingChannels = [];
  }

  public resume() {
    if (!this.currentChannel) return;
    this.initContext();
    this.isPlaying = true;
    this.startChannelScheduler(this.currentChannel);
  }

  public seek(time: number) {
    if (!this.currentChannel) return;
    const clamped = Math.max(0, Math.min(this.currentChannel.song.duration, time));
    this.currentChannel.playbackTime = clamped;
    this.currentChannel.stepCount = Math.floor(clamped * 4);

    // Reset crossfade trigger if user seeks backward before the crossfade threshold
    if (clamped < this.currentChannel.song.duration - this.crossfadeDuration - 1) {
      this.currentChannel.crossfadeTriggered = false;
    }

    this.killChannelActiveNodes(this.currentChannel);
    this.notifyTimeUpdate(clamped);
  }

  public stopPlayback() {
    this.isPlaying = false;
    this.setCrossfadingState(false);
    this.stopAllChannels();
  }

  public getPlaybackTime(): number {
    return this.currentChannel ? this.currentChannel.playbackTime : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSong(): Song | null {
    return this.currentChannel ? this.currentChannel.song : null;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getFrequencyData(): Uint8Array<ArrayBuffer> {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const buffer = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buffer);
    return buffer;
  }

  // Event Subscriptions
  public subscribeTimeUpdate(cb: (time: number) => void): () => void {
    this.onTimeUpdateCallbacks.add(cb);
    return () => this.onTimeUpdateCallbacks.delete(cb);
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

  // Channel Scheduling & Note Synthesizer
  private startChannelScheduler(channel: TrackChannel) {
    if (channel.timerId !== null) {
      clearInterval(channel.timerId);
      channel.timerId = null;
    }

    let lastTick = performance.now();

    channel.timerId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const now = performance.now();
      const delta = (now - lastTick) / 1000;
      lastTick = now;

      channel.playbackTime += delta;

      // Only the primary currentChannel reports UI time updates
      if (this.currentChannel === channel) {
        this.notifyTimeUpdate(channel.playbackTime);
      }

      // Check if auto-crossfade should be triggered before track finishes
      if (
        this.currentChannel === channel &&
        !channel.crossfadeTriggered &&
        this.crossfadeDuration > 0 &&
        channel.playbackTime >= channel.song.duration - this.crossfadeDuration
      ) {
        channel.crossfadeTriggered = true;
        this.notifyCrossfadeTrigger();
      }

      // Track reached natural finish
      if (channel.playbackTime >= channel.song.duration) {
        if (this.currentChannel === channel) {
          // If no crossfade was triggered (e.g. crossfadeDuration is 0), notify ended
          if (!channel.crossfadeTriggered) {
            this.notifyEnded();
          }
        }
        this.teardownChannel(channel);
        return;
      }

      // Synthesize note steps based on song BPM
      const beatDuration = 60 / channel.song.audioConfig.bpm;
      const sixteenth = beatDuration / 4;
      const currentStep = Math.floor(channel.playbackTime / sixteenth);

      if (currentStep > channel.stepCount) {
        channel.stepCount = currentStep;
        this.playSynthesizedStep(channel, currentStep);
      }
    }, 40);
  }

  private playSynthesizedStep(channel: TrackChannel, step: number) {
    if (!this.ctx || !channel.gainNode) return;

    const { chords, bassNotes, style } = channel.song.audioConfig;
    const chordIndex = Math.floor(step / 16) % chords.length;
    const currentChord = chords[chordIndex] || [220, 277.18, 329.63];
    const currentBass = bassNotes[chordIndex] || 55;

    const ctx = this.ctx;
    const time = ctx.currentTime;
    const targetGain = channel.gainNode;

    // 1. Kick drum pulse on quarter beats (every 4 sixteenths)
    if (step % 4 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(style === 'rock' ? 120 : 90, time);
      osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

      osc.connect(gain);
      gain.connect(targetGain);

      osc.start(time);
      osc.stop(time + 0.17);
      channel.activeNodes.push(osc, gain);
    }

    // 2. Snare / Clapper on beats 2 and 4 (step 4, 12, etc.)
    if (step % 8 === 4) {
      const node = ctx.createBufferSource();
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      node.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, time);
      filter.Q.setValueAtTime(1.5, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      node.connect(filter);
      filter.connect(gain);
      gain.connect(targetGain);

      node.start(time);
      node.stop(time + 0.13);
      channel.activeNodes.push(node, filter, gain);
    }

    // 3. Bass line
    if (step % 2 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = style === 'synthwave' ? 'sawtooth' : style === 'rock' ? 'square' : 'triangle';

      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(style === 'synthwave' ? 450 : 250, time);

      bassOsc.frequency.setValueAtTime(currentBass, time);

      bassGain.gain.setValueAtTime(0.18, time);
      bassGain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(targetGain);

      bassOsc.start(time);
      bassOsc.stop(time + 0.23);
      channel.activeNodes.push(bassOsc, bassFilter, bassGain);
    }

    // 4. Melodic Arpeggio or Pad chords
    const noteIndex = step % currentChord.length;
    const noteFreq = currentChord[noteIndex];

    const chordOsc = ctx.createOscillator();
    const chordGain = ctx.createGain();

    if (style === 'rock' || style === 'synthwave') {
      chordOsc.type = 'sawtooth';
    } else if (style === 'acoustic') {
      chordOsc.type = 'triangle';
    } else {
      chordOsc.type = 'sine';
    }

    chordOsc.frequency.setValueAtTime(noteFreq, time);
    chordGain.gain.setValueAtTime(0.07, time);
    chordGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(style === 'rock' ? 2200 : 1200, time);

    chordOsc.connect(filter);
    filter.connect(chordGain);
    chordGain.connect(targetGain);

    chordOsc.start(time);
    chordOsc.stop(time + 0.36);
    channel.activeNodes.push(chordOsc, filter, chordGain);

    // Prune stopped nodes from channel.activeNodes periodically
    if (channel.activeNodes.length > 50) {
      channel.activeNodes = channel.activeNodes.slice(-20);
    }
  }

  private pauseChannel(channel: TrackChannel) {
    if (channel.timerId !== null) {
      clearInterval(channel.timerId);
      channel.timerId = null;
    }
    this.killChannelActiveNodes(channel);
  }

  private teardownChannel(channel: TrackChannel) {
    if (channel.timerId !== null) {
      clearInterval(channel.timerId);
      channel.timerId = null;
    }
    this.killChannelActiveNodes(channel);
    try {
      channel.gainNode.disconnect();
    } catch {
      // Ignore disconnect errors
    }
  }

  private killChannelActiveNodes(channel: TrackChannel) {
    channel.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignore already stopped/disconnected nodes
      }
    });
    channel.activeNodes = [];
  }

  private stopAllChannels() {
    if (this.currentChannel) {
      this.teardownChannel(this.currentChannel);
      this.currentChannel = null;
    }
    this.fadingChannels.forEach((c) => this.teardownChannel(c));
    this.fadingChannels = [];
  }
}

export const audioEngine = new AudioEngine();
