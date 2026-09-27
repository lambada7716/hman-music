import React, { useRef, useState } from 'react';
import { Song, Artist } from '../types/music';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Mic2,
  Sparkles,
  ListMusic,
  Moon,
  Blend,
  Share2
} from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';
import { ArtistAvatar } from './ArtistAvatar';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  playbackTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isFavorite: boolean;
  artist: Artist | null;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite: () => void;
  onOpenLyrics: () => void;
  onOpenVisualizer: () => void;
  onToggleQueue: () => void;
  onSelectArtist: (artist: Artist) => void;
  sleepTimerRemaining: number | null;
  onOpenSleepTimer: () => void;
  crossfadeDuration: number;
  onCrossfadeDurationChange: (sec: number) => void;
  isCrossfading?: boolean;
  onShareSong: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentSong,
  isPlaying,
  playbackTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  isFavorite,
  artist,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onOpenLyrics,
  onOpenVisualizer,
  onToggleQueue,
  onSelectArtist,
  sleepTimerRemaining,
  onOpenSleepTimer,
  crossfadeDuration,
  onCrossfadeDurationChange,
  isCrossfading = false,
  onShareSong
}) => {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [hoverSeekPercent, setHoverSeekPercent] = useState<number | null>(null);
  const [isCrossfadePopoverOpen, setIsCrossfadePopoverOpen] = useState(false);

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (playbackTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const targetTime = (clickX / rect.width) * duration;
    onSeek(targetTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    setHoverSeekPercent((hoverX / rect.width) * 100);
  };

  return (
    <footer className="fixed bottom-[60px] md:bottom-0 left-0 w-full h-[76px] md:h-[90px] glass-panel z-40 flex flex-col justify-center px-4 md:px-8 border-t border-white/10 shadow-[0_-15px_35px_rgba(0,0,0,0.6)] select-none">
      {/* Mobile Top Progress Bar Line */}
      <div
        onClick={handleProgressBarClick}
        className="absolute top-0 left-0 w-full h-1 md:hidden bg-white/10 cursor-pointer"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full h-full">
        {/* Left Zone: Now Playing Info & Singer Thumbnail */}
        <div className="flex items-center space-x-3 md:space-x-4 w-1/3 min-w-[160px] md:min-w-[240px]">
          <div
            onClick={onOpenLyrics}
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-lg relative group cursor-pointer shrink-0 border border-white/10"
            title="Open Lyrics & Track View"
          >
            <ArtworkImage
              src={currentSong.cover}
              alt={currentSong.title}
              fallbackGradient={currentSong.coverGradient}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition backdrop-blur-[2px]">
              <Mic2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 max-w-[140px] md:max-w-[220px]">
            <div className="flex items-center gap-2">
              <span
                onClick={onOpenLyrics}
                className="font-bold text-sm md:text-base text-white truncate hover:underline cursor-pointer"
              >
                {currentSong.title}
              </span>
              {isCrossfading && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold animate-pulse shrink-0">
                  Crossfading
                </span>
              )}
              <button
                onClick={onToggleFavorite}
                className={`transition shrink-0 ${
                  isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                }`}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={onShareSong}
                className="transition shrink-0 text-slate-400 hover:text-white hover:scale-110"
                title="Share song (deep link)"
              >
                <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>

            {/* Singer Photo + Name in Player */}
            <div
              onClick={() => artist && onSelectArtist(artist)}
              className="flex items-center gap-1.5 mt-0.5 group cursor-pointer"
              title={`View ${currentSong.artist} profile`}
            >
              <ArtistAvatar
                src={currentSong.artistImage}
                name={currentSong.artist}
                size="xs"
              />
              <span className="text-xs text-slate-400 truncate group-hover:text-purple-300 transition-colors">
                {currentSong.artist}
              </span>
            </div>
          </div>
        </div>

        {/* Center Zone: Controls & Scrubber */}
        <div className="flex flex-col items-center justify-center w-1/3 max-w-[460px]">
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={onToggleShuffle}
              className={`hidden md:block transition hover:scale-110 ${
                isShuffle ? 'text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
              title={isShuffle ? 'Shuffle enabled' : 'Shuffle disabled'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrev}
              className="text-slate-300 hover:text-white hover:scale-110 active:scale-95 transition"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black" />
              ) : (
                <Play className="w-5 h-5 fill-black ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="text-slate-300 hover:text-white hover:scale-110 active:scale-95 transition"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`hidden md:block transition hover:scale-110 ${
                repeatMode !== 'off' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
              title={`Repeat mode: ${repeatMode}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Desktop Progress Bar with Scrubbing */}
          <div className="hidden md:flex items-center space-x-3 w-full mt-2">
            <span className="text-xs text-slate-400 w-10 text-right font-mono font-medium">
              {formatTime(playbackTime)}
            </span>

            <div
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverSeekPercent(null)}
              className="flex-1 h-1.5 hover:h-2.5 bg-white/10 rounded-full cursor-pointer relative group transition-all"
            >
              {hoverSeekPercent !== null && (
                <div
                  className="absolute top-0 left-0 h-full bg-white/20 rounded-full pointer-events-none"
                  style={{ width: `${hoverSeekPercent}%` }}
                />
              )}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.7)]"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <span className="text-xs text-slate-400 w-10 text-left font-mono font-medium">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Zone: Lyrics, Visualizer, Queue & Volume */}
        <div className="hidden md:flex items-center justify-end space-x-4 w-1/3">
          {/* Sleep Timer */}
          <button
            onClick={onOpenSleepTimer}
            className={`flex items-center gap-1.5 transition hover:scale-110 ${
              sleepTimerRemaining !== null
                ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
            title={
              sleepTimerRemaining !== null
                ? `Sleep Timer: ${Math.ceil(sleepTimerRemaining / 60)}m left`
                : 'Sleep Timer (T)'
            }
          >
            <Moon className={`w-4 h-4 ${sleepTimerRemaining !== null ? 'fill-amber-300' : ''}`} />
            {sleepTimerRemaining !== null && (
              <span className="text-[10px] font-mono font-bold tracking-tight">
                {Math.ceil(sleepTimerRemaining / 60)}m
              </span>
            )}
          </button>

          {/* Seamless Crossfade Control */}
          <div className="relative">
            <button
              onClick={() => setIsCrossfadePopoverOpen((prev) => !prev)}
              className={`flex items-center gap-1 transition hover:scale-110 p-1.5 rounded-xl ${
                isCrossfading
                  ? 'text-pink-300 bg-pink-500/20 border border-pink-500/40 animate-pulse shadow-[0_0_12px_rgba(244,114,182,0.4)]'
                  : crossfadeDuration > 0
                  ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={`Crossfade: ${crossfadeDuration > 0 ? `${crossfadeDuration}s` : 'Off'}`}
            >
              <Blend className="w-4 h-4" />
              {crossfadeDuration > 0 && (
                <span className="text-[10px] font-mono font-bold leading-none hidden xl:inline">
                  {crossfadeDuration}s
                </span>
              )}
            </button>

            {/* Crossfade Popover */}
            {isCrossfadePopoverOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCrossfadePopoverOpen(false)}
                />
                <div className="absolute bottom-12 right-0 z-50 w-72 sm:w-80 p-4 rounded-2xl glass-panel bg-[#0d0d24]/95 border border-purple-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
                        <Blend className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Seamless Crossfade</h4>
                        <p className="text-[10px] text-slate-400">Zero silence between songs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = crossfadeDuration > 0 ? 0 : 4;
                        onCrossfadeDurationChange(next);
                      }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition ${
                        crossfadeDuration > 0
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {crossfadeDuration > 0 ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Overlap visual diagram */}
                  <div className="my-3 p-2.5 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-mono">
                      <span className="text-purple-300">Outgoing Track (Fade Out)</span>
                      <span className="text-pink-300">Incoming Track (Fade In)</span>
                    </div>
                    <div className="h-7 w-full flex items-center relative">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
                        <path
                          d="M 0 3 Q 50 3, 100 21"
                          fill="none"
                          stroke="url(#fadeA)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 0 21 Q 50 3, 100 3"
                          fill="none"
                          stroke="url(#fadeB)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="fadeA" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
                          </linearGradient>
                          <linearGradient id="fadeB" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#f472b6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      <span className="text-[11px] font-semibold text-purple-200">
                        {crossfadeDuration > 0 ? `${crossfadeDuration}s Smooth Crossfade` : 'No crossfade (0s)'}
                      </span>
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Overlap Duration</span>
                      <span className="font-mono font-bold text-white">{crossfadeDuration}s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="1"
                      value={crossfadeDuration}
                      onChange={(e) => onCrossfadeDurationChange(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>0s (Cut)</span>
                      <span>6s</span>
                      <span>12s</span>
                    </div>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {[0, 2, 4, 6, 8].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => onCrossfadeDurationChange(sec)}
                        className={`py-1 rounded-lg text-[10px] font-mono font-semibold transition ${
                          crossfadeDuration === sec
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {sec === 0 ? 'Off' : `${sec}s`}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onOpenLyrics}
            className="text-slate-400 hover:text-white transition hover:scale-110"
            title="Lyrics (L)"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenVisualizer}
            className="text-slate-400 hover:text-purple-300 transition hover:scale-110"
            title="Galaxy Visualizer (V)"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleQueue}
            className="text-slate-400 hover:text-white transition hover:scale-110"
            title="Queue (Q)"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Slider */}
          <div className="flex items-center space-x-2 w-28 group">
            <button
              onClick={onToggleMute}
              className="text-slate-400 hover:text-white transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Mobile Right Action: Crossfade & Sleep Timer */}
        <div className="md:hidden flex items-center justify-end shrink-0 pl-1 space-x-1">
          <button
            onClick={() => setIsCrossfadePopoverOpen((prev) => !prev)}
            className={`p-2 rounded-xl transition ${
              isCrossfading
                ? 'text-pink-300 bg-pink-500/20'
                : crossfadeDuration > 0
                ? 'text-purple-300 bg-purple-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
            title={`Crossfade: ${crossfadeDuration > 0 ? `${crossfadeDuration}s` : 'Off'}`}
          >
            <Blend className="w-4 h-4" />
          </button>

          <button
            onClick={onShareSong}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition"
            title="Share Song"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSleepTimer}
            className={`p-2 rounded-xl transition ${
              sleepTimerRemaining !== null
                ? 'text-amber-300 bg-amber-400/15'
                : 'text-slate-400 hover:text-white'
            }`}
            title={
              sleepTimerRemaining !== null
                ? `Sleep Timer: ${Math.ceil(sleepTimerRemaining / 60)}m left`
                : 'Sleep Timer'
            }
          >
            <Moon className={`w-4 h-4 ${sleepTimerRemaining !== null ? 'fill-amber-300' : ''}`} />
          </button>
        </div>
      </div>
    </footer>
  );
};
