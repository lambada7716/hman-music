import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';
import { Song } from '../types/music';
import { X, Sparkles, Volume2 } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

interface CosmicVisualizerProps {
  song: Song | null;
  isPlaying: boolean;
  onClose: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseAlpha: number;
  hue: number;
}

export const CosmicVisualizer: React.FC<CosmicVisualizerProps> = ({ song, isPlaying, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize stars
    const particleCount = 120;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        hue: Math.random() > 0.5 ? 270 : 320 // Purple to Pink
      });
    }

    const render = () => {
      // Background nebula gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, '#120b29');
      bgGrad.addColorStop(0.5, '#080616');
      bgGrad.addColorStop(1, '#030209');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Get real audio frequencies
      const freqData = audioEngine.getFrequencyData();
      let avgEnergy = 0;
      let bassEnergy = 0;
      for (let i = 0; i < freqData.length; i++) {
        avgEnergy += freqData[i];
        if (i < 4) bassEnergy += freqData[i];
      }
      avgEnergy = avgEnergy / freqData.length;
      bassEnergy = bassEnergy / 4;
      const energyFactor = isPlaying ? 1 + (avgEnergy / 255) * 1.5 : 1;
      const bassPulse = isPlaying ? (bassEnergy / 255) * 40 : 0;

      // Draw central cosmic glow ring
      const centerGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        60 + bassPulse,
        width / 2,
        height / 2,
        240 + bassPulse * 2
      );
      centerGrad.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
      centerGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.12)');
      centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 240 + bassPulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // Render cosmic particles
      particles.forEach((p) => {
        p.x += p.speedX * energyFactor;
        p.y += p.speedY * energyFactor;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulseSize = p.size * (1 + (avgEnergy / 255) * 0.8);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 75%, ${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Circular Frequency Visualizer around center
      const bars = freqData.length;
      const baseRadius = 150 + bassPulse;
      for (let i = 0; i < bars; i++) {
        const val = freqData[i];
        const barHeight = isPlaying ? (val / 255) * 90 : 8;
        const angle = (i / bars) * Math.PI * 2;
        const x1 = width / 2 + Math.cos(angle) * baseRadius;
        const y1 = height / 2 + Math.sin(angle) * baseRadius;
        const x2 = width / 2 + Math.cos(angle) * (baseRadius + barHeight);
        const y2 = height / 2 + Math.sin(angle) * (baseRadius + barHeight);

        const strokeGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        strokeGrad.addColorStop(0, '#8B5CF6');
        strokeGrad.addColorStop(1, '#EC4899');

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black text-white backdrop-blur-3xl animate-in fade-in duration-300">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <Sparkles className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-purple-300">Galaxy Visualizer</h2>
            <p className="text-xs text-slate-400">Harmonic Audio Reactive Canvas</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition hover:scale-105 active:scale-95 text-slate-300 hover:text-white"
          title="Close Visualizer (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Centerpiece Song Info */}
      {song && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.5)] border-2 border-white/20 mb-6 animate-cosmic-pulse">
            <ArtworkImage
              src={song.cover}
              alt={song.title}
              fallbackGradient={song.coverGradient}
              iconSize="lg"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
            {song.title}
          </h1>
          <p className="text-base md:text-lg text-purple-300/90 font-medium mt-1">
            {song.artist}
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-slate-400 font-mono">
            <span>{song.genre}</span>
            <span>·</span>
            <span>{song.audioConfig.bpm} BPM</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Volume2 className="w-3.5 h-3.5" /> Live Synced
            </span>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="relative z-10 p-6 text-center text-xs text-slate-500">
        Press <span className="text-slate-300 font-semibold px-1 py-0.5 bg-white/10 rounded">ESC</span> or click Close to return to player
      </div>
    </div>
  );
};
