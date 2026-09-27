import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Send,
  Clock,
  Sparkles
} from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  playbackTime?: number;
  showToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  song,
  playbackTime = 0,
  showToast
}) => {
  const [includeTimestamp, setIncludeTimestamp] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !song) return null;

  const currentSeconds = Math.floor(playbackTime);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Generate deep link
  const getShareUrl = () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('track', song.id);
      if (includeTimestamp && currentSeconds > 0) {
        url.searchParams.set('t', currentSeconds.toString());
      }
      return url.toString();
    } catch {
      return `${window.location.href}?track=${song.id}`;
    }
  };

  const shareUrl = getShareUrl();
  const shareTitle = `${song.title} - ${song.artist}`;
  const shareText = `Listen to "${song.title}" by ${song.artist} on HMan Music 🎵${
    includeTimestamp && currentSeconds > 0 ? ` (Starting at ${formatTime(currentSeconds)})` : ''
  }`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast('Deep link copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy link. Please copy manually.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        showToast('Shared successfully! ✨');
        onClose();
      } catch (err: unknown) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Social Share URLs
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-600 hover:bg-sky-500 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'X (Twitter)',
      icon: ExternalLink,
      color: 'bg-slate-800 hover:bg-slate-700 text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: ExternalLink,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0c0d1c]/95 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Share Song</h3>
              <p className="text-xs text-slate-400">Deep link directly to this track</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Song Card Preview */}
        <div className="my-5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/10">
            <ArtworkImage
              src={song.cover}
              alt={song.title}
              fallbackGradient={song.coverGradient}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-white truncate">{song.title}</h4>
            <p className="text-xs text-slate-300 truncate">{song.artist}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {song.genre}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {formatTime(song.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamp Option */}
        {currentSeconds > 2 && (
          <label className="flex items-center gap-2.5 mb-4 px-3 py-2 rounded-xl bg-purple-950/30 border border-purple-500/20 cursor-pointer hover:bg-purple-900/20 transition">
            <input
              type="checkbox"
              checked={includeTimestamp}
              onChange={(e) => setIncludeTimestamp(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-white/10 border-white/20 accent-purple-500 cursor-pointer"
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>
                Start at current time: <strong className="font-mono text-purple-300">{formatTime(currentSeconds)}</strong>
              </span>
            </div>
          </label>
        )}

        {/* Deep Link Input & Copy */}
        <div className="space-y-1.5 mb-5">
          <span className="text-xs font-semibold text-slate-300">Deep Link URL</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 transition select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Web Share Button (if supported) */}
        {'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mb-4 py-2.5 px-4 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Open Native Share Sheet (AirDrop, Apps, etc.)</span>
          </button>
        )}

        {/* Quick Social Share Buttons */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Or share directly via
          </span>
          <div className="grid grid-cols-4 gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition ${item.color} group`}
              >
                <item.icon className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
