import React from 'react';
import { Moon, X, Clock, Check, PowerOff } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSecondsRemaining: number | null;
  selectedOptionMinutes: number | null;
  isEndOfTrackActive: boolean;
  onSetTimerMinutes: (minutes: number) => void;
  onSetTimerEndOfTrack: () => void;
  onCancelTimer: () => void;
}

const TIMER_PRESETS = [
  { minutes: 15, label: '15 Minutes', sublabel: 'Quick power nap or wind down' },
  { minutes: 30, label: '30 Minutes', sublabel: 'Standard bedtime drift' },
  { minutes: 60, label: '60 Minutes', sublabel: 'Deep space slumber' }
];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  activeSecondsRemaining,
  selectedOptionMinutes,
  isEndOfTrackActive,
  onSetTimerMinutes,
  onSetTimerEndOfTrack,
  onCancelTimer
}) => {
  if (!isOpen) return null;

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0c0c20] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 select-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">
              Sleep Timer
            </h2>
            <p className="text-xs text-slate-400">
              Playback automatically stops when the stars align
            </p>
          </div>
        </div>

        {/* Active Countdown Status Display */}
        {activeSecondsRemaining !== null && (
          <div className="mb-6 p-4 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400 animate-pulse" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  {isEndOfTrackActive ? 'Stopping at end of track' : 'Timer Active'}
                </p>
                <p className="text-xl font-mono font-extrabold text-white">
                  {formatRemaining(activeSecondsRemaining)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onCancelTimer();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 text-xs font-semibold text-slate-300 transition"
              title="Turn off sleep timer"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Turn Off</span>
            </button>
          </div>
        )}

        {/* Presets List */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Schedule Stop Time
          </p>

          {TIMER_PRESETS.map((preset) => {
            const isSelected = selectedOptionMinutes === preset.minutes && !isEndOfTrackActive;

            return (
              <button
                key={preset.minutes}
                onClick={() => {
                  onSetTimerMinutes(preset.minutes);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition border ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500/50 shadow-sm'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/30">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{preset.sublabel}</p>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                    isSelected
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'border-white/20 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}

          {/* End of Track Option */}
          <button
            onClick={() => {
              onSetTimerEndOfTrack();
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition border ${
              isEndOfTrackActive
                ? 'bg-purple-600/20 border-purple-500/50 shadow-sm'
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  End of Current Track
                </span>
                {isEndOfTrackActive && (
                  <span className="text-[10px] uppercase font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/30">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Finish this track, then silence the cosmos</p>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                isEndOfTrackActive
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'border-white/20 text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span>Smoothly silences playback on expiry</span>
          <span className="font-mono">Shortcuts: T</span>
        </div>
      </div>
    </div>
  );
};
