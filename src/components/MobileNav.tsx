import React from 'react';
import { PlaySquare, Compass, Radio, Heart, ListMusic } from 'lucide-react';
import { MainView } from './Sidebar';

interface MobileNavProps {
  currentView: MainView;
  onSelectView: (view: MainView) => void;
  onToggleQueue: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onSelectView,
  onToggleQueue
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-[60px] glass-panel z-50 flex items-center justify-around border-t border-white/10 bg-[#080816]/95 backdrop-blur-xl select-none">
      <button
        onClick={() => onSelectView('listen-now')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentView === 'listen-now' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <PlaySquare className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Listen Now</span>
      </button>

      <button
        onClick={() => onSelectView('explore')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentView === 'explore' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Explore</span>
      </button>

      <button
        onClick={() => onSelectView('radio')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentView === 'radio' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Radio className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Radio</span>
      </button>

      <button
        onClick={() => onSelectView('favorites')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          currentView === 'favorites' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Favorites</span>
      </button>

      <button
        onClick={onToggleQueue}
        className="flex flex-col items-center justify-center flex-1 py-1 transition text-slate-400 hover:text-white"
      >
        <ListMusic className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Queue</span>
      </button>
    </nav>
  );
};
