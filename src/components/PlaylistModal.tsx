import React, { useState } from 'react';
import { X, Plus, Music2 } from 'lucide-react';
import { Song } from '../types/music';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  onCreatePlaylist: (title: string, description: string, songIds: string[]) => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  songs,
  onCreatePlaylist
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreatePlaylist(title.trim(), description.trim(), selectedSongIds);
    setTitle('');
    setDescription('');
    setSelectedSongIds([]);
    onClose();
  };

  const toggleSong = (id: string) => {
    setSelectedSongIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d0d22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Plus className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Create Cosmic Playlist</h2>
            <p className="text-xs text-slate-400">Curate your stellar listening experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Playlist Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midnight Andromeda Waves"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="A brief journey into this playlist's vibe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Tracks ({selectedSongIds.length})
              </label>
              <span className="text-xs text-slate-500">Pick to add initially</span>
            </div>
            
            <div className="max-h-44 overflow-y-auto space-y-1 pr-1 rounded-xl border border-white/5 bg-black/20 p-2">
              {songs.map((song) => {
                const isSelected = selectedSongIds.includes(song.id);
                return (
                  <div
                    key={song.id}
                    onClick={() => toggleSong(song.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs ${
                      isSelected
                        ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Music2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="font-medium truncate">{song.title}</span>
                      <span className="text-slate-500 truncate">· {song.artist}</span>
                    </div>
                    <span className="font-mono text-slate-500 text-[10px] shrink-0 pl-2">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-purple-600/20"
            >
              Save Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
