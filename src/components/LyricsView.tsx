import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Song } from '../types/music';
import { X, Mic2, SkipForward, ArrowDownCircle, Share2 } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

interface LyricsViewProps {
  song: Song | null;
  currentTime: number;
  onSeek: (time: number) => void;
  onClose: () => void;
  onShare?: () => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({ song, currentTime, onSeek, onClose, onShare }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [showSyncButton, setShowSyncButton] = useState<boolean>(false);

  // Find active lyric index based on current playback time
  const activeIndex = song?.lyrics.reduce((acc, line, idx) => {
    return currentTime >= line.time ? idx : acc;
  }, -1) ?? -1;

  // Function to smoothly center the active lyric line in the viewport
  const scrollToActiveLine = useCallback((smooth: boolean = true) => {
    if (!containerRef.current || !activeLineRef.current) return;
    const container = containerRef.current;
    const line = activeLineRef.current;

    const lineOffsetTop = line.offsetTop;
    const lineHeight = line.offsetHeight;
    const containerHeight = container.clientHeight;
    const targetTop = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2);

    container.scrollTo({
      top: Math.max(0, targetTop),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  // When song starts or activeIndex shifts, auto-scroll to center
  useEffect(() => {
    if (!isUserScrollingRef.current && activeIndex >= 0) {
      scrollToActiveLine(true);
    }
  }, [activeIndex, scrollToActiveLine]);

  // Initial centering when modal opens or track changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToActiveLine(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [song?.id, scrollToActiveLine]);

  // Clean up user scroll timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Detect manual user scroll to avoid fighting the user
  const handleScroll = () => {
    // If the scroll was triggered by user interaction
    if (!isUserScrollingRef.current) {
      isUserScrollingRef.current = true;
      setShowSyncButton(true);
    }

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    // Automatically resume auto-scroll after 4 seconds of idle scrolling
    scrollTimeoutRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
      setShowSyncButton(false);
      scrollToActiveLine(true);
    }, 4000);
  };

  const handleManualSync = () => {
    isUserScrollingRef.current = false;
    setShowSyncButton(false);
    scrollToActiveLine(true);
  };

  if (!song) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#080816]/95 backdrop-blur-3xl text-white overflow-hidden animate-in fade-in duration-300">
      {/* Background Ambient Blur with Album Colors */}
      <div className="absolute inset-0 pointer-events-none opacity-30 filter blur-3xl scale-125 transition-all duration-1000">
        <ArtworkImage
          src={song.cover}
          alt={song.title}
          fallbackGradient={song.coverGradient}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Left Column: Track Info & Artwork */}
      <div className="relative z-10 w-full md:w-5/12 lg:w-4/12 p-6 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 shrink-0 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-purple-400">
            <Mic2 className="w-4 h-4" />
            <span>Synchronized Lyrics</span>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            {onShare && (
              <button
                onClick={onShare}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                title="Share Song"
              >
                <Share2 className="w-4 h-4 text-purple-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="my-auto py-4">
          <div className="w-36 h-36 md:w-60 md:h-60 rounded-3xl overflow-hidden shadow-2xl border border-white/15 mb-6 group transition-transform duration-500 hover:scale-[1.02]">
            <ArtworkImage
              src={song.cover}
              alt={song.title}
              fallbackGradient={song.coverGradient}
              iconSize="lg"
            />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight font-display">
            {song.title}
          </h2>
          <p className="text-base md:text-lg text-purple-300 font-medium mb-1">{song.artist}</p>
          <p className="text-xs text-slate-400 font-mono">{song.album} · {song.year}</p>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <SkipForward className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>Click any line to jump directly to that part</span>
        </div>
      </div>

      {/* Right Column: Centered Scrolling Lyrics with Apple Music Gradient Mask */}
      <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        {/* Desktop Close & Header Controls */}
        <div className="hidden md:flex items-center justify-between p-6 shrink-0 z-20">
          <div className="text-xs text-slate-400 font-medium">
            {song.lyrics?.length ? `${song.lyrics.length} synced lyric lines` : ''}
          </div>
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-white font-medium transition hover:scale-105 active:scale-95"
                title="Share Song Link"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Share</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition hover:scale-105 active:scale-95 text-slate-300 hover:text-white shadow-lg"
              title="Close Lyrics (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating "Sync to Playback" Indicator */}
        {showSyncButton && activeIndex >= 0 && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-3 duration-200">
            <button
              onClick={handleManualSync}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-semibold shadow-xl border border-purple-400/40 backdrop-blur-md transition hover:scale-105 active:scale-95"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Sync to Playing Line</span>
            </button>
          </div>
        )}

        {/* Lyrics scroll container with generous padding to allow top & bottom lines to center */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 md:px-16 py-[42vh] space-y-6 md:space-y-10 scroll-smooth no-scrollbar"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          }}
        >
          {song.lyrics && song.lyrics.length > 0 ? (
            song.lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <p
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => {
                    onSeek(line.time);
                    isUserScrollingRef.current = false;
                    setShowSyncButton(false);
                  }}
                  className={`text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight cursor-pointer select-none transition-all duration-500 ease-out origin-left ${
                    isActive
                      ? 'text-white scale-105 translate-x-2 drop-shadow-[0_0_35px_rgba(216,180,254,0.7)] text-purple-100 opacity-100 filter-none'
                      : isPast
                      ? 'text-white/40 hover:text-white/70 hover:scale-100 opacity-60 filter blur-[0.4px] hover:blur-none'
                      : 'text-white/25 hover:text-white/60 hover:scale-100 opacity-40 filter blur-[0.6px] hover:blur-none'
                  }`}
                >
                  {line.text}
                </p>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <Mic2 className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-lg font-medium">Instrumental or No Lyrics Available</p>
              <p className="text-xs text-slate-500 mt-1">Enjoy the cosmic stellar melodies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
