import React from 'react';
import { Song } from '../types/music';

interface AmbientBackgroundProps {
  currentSong: Song | null;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ currentSong }) => {
  if (!currentSong) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Dynamic Album Art Blur Layer */}
      <div
        key={`ambient-img-${currentSong.id}`}
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-20 filter blur-[90px] md:blur-[120px] scale-125 transition-all duration-1000 ease-out will-change-transform"
      >
        <img
          src={currentSong.cover}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layered Color Accent Meshes */}
      <div
        key={`ambient-grad-${currentSong.id}`}
        className={`absolute inset-0 bg-gradient-to-br ${currentSong.coverGradient} opacity-25 mix-blend-screen filter blur-[80px] transition-all duration-1000 ease-out`}
      />

      {/* Breathing Cosmic Gradient Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-purple-600/15 filter blur-[100px] animate-cosmic-pulse" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-pink-600/10 filter blur-[120px] animate-cosmic-pulse" />

      {/* Scrim Vignette Mask to guarantee WCAG AA readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050511]/40 via-[#050511]/80 to-[#050511] backdrop-blur-[2px]" />
    </div>
  );
};
