import React from 'react';
import {
  Compass,
  Radio,
  Heart,
  ListMusic,
  Users,
  Plus,
  Orbit,
  PlaySquare,
  Sparkles,
  Bot,
  Film,
  Mic,
  Upload
} from 'lucide-react';
import { Playlist } from '../types/music';

export type MainView = 'listen-now' | 'explore' | 'radio' | 'favorites' | 'playlists' | 'artists';

interface SidebarProps {
  currentView: MainView;
  onSelectView: (view: MainView) => void;
  favoritesCount: number;
  playlists: Playlist[];
  onSelectPlaylist?: (playlist: Playlist) => void;
  onOpenCreatePlaylist: () => void;
  onOpenAiStudio: (tab?: 'chat' | 'video' | 'transcribe') => void;
  onUploadLocalAudio?: (file: File) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  favoritesCount,
  playlists,
  onSelectPlaylist,
  onOpenCreatePlaylist,
  onOpenAiStudio,
  onUploadLocalAudio
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-full glass-panel border-r border-white/10 pt-7 pb-28 z-20 shrink-0 select-none">
      {/* Brand Header */}
      <div
        onClick={() => onSelectView('listen-now')}
        className="px-6 mb-8 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform duration-300">
          <Orbit className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold tracking-tight text-white font-display">
            HMAN
          </span>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-purple-400">
            Galaxy Music
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 space-y-7 no-scrollbar">
        {/* Browse Section */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
            Browse
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onSelectView('listen-now')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  currentView === 'listen-now'
                    ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <PlaySquare className={`w-4 h-4 ${currentView === 'listen-now' ? 'text-purple-400' : ''}`} />
                <span>Listen Now</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('explore')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  currentView === 'explore'
                    ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className={`w-4 h-4 ${currentView === 'explore' ? 'text-purple-400' : ''}`} />
                <span>Explore</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('radio')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  currentView === 'radio'
                    ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Radio className={`w-4 h-4 ${currentView === 'radio' ? 'text-purple-400' : ''}`} />
                <span>Radio Stations</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Cosmo AI Studio Section */}
        <div>
          <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-2.5 px-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Cosmo AI Studio</span>
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onOpenAiStudio('chat')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-purple-200 bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/25 transition group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>Gemini Chatbot</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300">
                  AI
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenAiStudio('video')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                <Film className="w-4 h-4 text-slate-400" />
                <span>Veo 3 Video Gen</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenAiStudio('transcribe')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
              >
                <Mic className="w-4 h-4 text-slate-400" />
                <span>Voice Transcribe</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Library Section */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
            Library
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onSelectView('favorites')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  currentView === 'favorites'
                    ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className={`w-4 h-4 ${currentView === 'favorites' ? 'text-rose-400 fill-rose-400/40' : ''}`} />
                  <span>Favorites</span>
                </div>
                {favoritesCount > 0 && (
                  <span className="text-xs font-mono text-purple-300">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('playlists')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  currentView === 'playlists'
                    ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ListMusic className={`w-4 h-4 ${currentView === 'playlists' ? 'text-purple-400' : ''}`} />
                  <span>Playlists</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {playlists.length}
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectView('artists')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  currentView === 'artists'
                    ? 'bg-purple-600/20 text-white border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className={`w-4 h-4 ${currentView === 'artists' ? 'text-purple-400' : ''}`} />
                <span>Artists</span>
              </button>
            </li>
            <li>
              <label className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer group">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onUploadLocalAudio) {
                      onUploadLocalAudio(file);
                      e.target.value = '';
                    }
                  }}
                />
                <Upload className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="truncate">Upload Lagu Sendiri</span>
                  <span className="text-[10px] text-purple-400/80 font-medium">Bebas durasi (MP3/WAV)</span>
                </div>
              </label>
            </li>
          </ul>
        </div>

        {/* Quick Playlists List */}
        <div>
          <div className="flex items-center justify-between mb-2 px-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Playlists
            </p>
            <button
              onClick={onOpenCreatePlaylist}
              className="p-1 text-slate-400 hover:text-purple-400 transition"
              title="Create new playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="space-y-0.5">
            {playlists.slice(0, 5).map((pl) => (
              <li key={pl.id}>
                <button
                  onClick={() => {
                    onSelectView('playlists');
                    if (onSelectPlaylist) onSelectPlaylist(pl);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition truncate"
                  title={pl.title}
                >
                  {pl.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
