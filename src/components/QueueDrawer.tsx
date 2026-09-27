import React from 'react';
import { Song } from '../types/music';
import { X, ListMusic, Play, Trash2, Volume2 } from 'lucide-react';
import { ArtworkImage } from './ArtworkImage';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  currentSong,
  queue,
  isPlaying,
  onPlaySong,
  onRemoveFromQueue,
  onClearQueue
}) => {
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Play Queue</h2>
          <span className="text-xs text-slate-400 font-mono">({queue.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-slate-400 hover:text-rose-400 transition px-2 py-1"
              title="Clear queue"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing */}
        {currentSong && (
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2.5">
              Now Playing
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
                  <ArtworkImage
                    src={currentSong.cover}
                    alt={currentSong.title}
                    fallbackGradient={currentSong.coverGradient}
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Volume2 className="w-4 h-4 text-purple-300 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{currentSong.title}</p>
                  <p className="text-xs text-slate-400 truncate">{currentSong.artist}</p>
                </div>
              </div>
              <span className="text-xs text-purple-300 font-mono shrink-0 pl-2">
                {Math.floor(currentSong.duration / 60)}:
                {(currentSong.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Up Next List */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Next In Queue
            </p>
          </div>

          {queue.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <ListMusic className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Queue is empty</p>
              <p className="text-xs text-slate-600 mt-1">Play or add tracks from the catalog</p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {queue.map((song, idx) => (
                <li
                  key={`${song.id}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition group"
                >
                  <div
                    onClick={() => onPlaySong(song)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
                      <ArtworkImage
                        src={song.cover}
                        alt={song.title}
                        fallbackGradient={song.coverGradient}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition truncate">
                        {song.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {Math.floor(song.duration / 60)}:
                      {(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => onRemoveFromQueue(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
};
