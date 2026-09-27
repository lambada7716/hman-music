import React from 'react';
import { Search, Sparkles, ListMusic, Orbit, Mic, Bot } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeGenreFilter: string;
  onSelectGenreFilter: (genre: string) => void;
  onToggleVisualizer: () => void;
  onToggleQueue: () => void;
  queueCount: number;
  onOpenAiStudio: (tab?: 'chat' | 'video' | 'transcribe') => void;
}

const GENRE_FILTERS = [
  { id: 'all', label: 'All Universes' },
  { id: 'spotify', label: '🟢 Spotify Viral' },
  { id: 'hits', label: 'Global Hits' },
  { id: 'indo', label: 'Pop Indo' },
  { id: 'lawas', label: 'Nostalgia Lawas' },
  { id: 'rock', label: 'Rock Legends' }
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeGenreFilter,
  onSelectGenreFilter,
  onToggleVisualizer,
  onToggleQueue,
  queueCount,
  onOpenAiStudio
}) => {
  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Brand Mark (Zone 1) */}
      <div className="flex items-center gap-2.5 md:hidden shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.5)]">
          <Orbit className="w-4 h-4 text-white" />
        </div>
        <span className="font-extrabold text-base tracking-tight text-white font-display">
          HMAN
        </span>
      </div>

      {/* Search Input with voice mic button */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tracks, artists, or lyrics..."
          className="w-full pl-10 pr-16 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-400 hover:text-white px-1"
            >
              ✕
            </button>
          ) : null}
          <button
            onClick={() => onOpenAiStudio('transcribe')}
            className="p-1 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-white/10 transition"
            title="Voice Search (Transcribe with Gemini)"
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Genre Filter Tabs (Functional interactive tabs conforming to Section 1.A) */}
      <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
        {GENRE_FILTERS.map((filter) => {
          const isActive = activeGenreFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onSelectGenreFilter(filter.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Actions (Cosmo AI, Visualizer & Queue) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onOpenAiStudio('chat')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition hover:scale-105 active:scale-95 shadow-sm"
          title="Cosmo AI Studio (A)"
        >
          <Bot className="w-3.5 h-3.5 text-purple-300" />
          <span className="hidden sm:inline">Cosmo AI</span>
        </button>

        <button
          onClick={onToggleVisualizer}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-semibold transition hover:scale-105 active:scale-95 shadow-sm"
          title="Open Galaxy Visualizer (V)"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
          <span className="hidden sm:inline">Visualizer</span>
        </button>

        <button
          onClick={onToggleQueue}
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          title="Play Queue (Q)"
        >
          <ListMusic className="w-4 h-4" />
          {queueCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-[9px] font-mono font-bold flex items-center justify-center text-white border border-black">
              {queueCount > 9 ? '9+' : queueCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
