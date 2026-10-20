
import React from 'react';

interface ControlsProps {
  progress: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Controls: React.FC<ControlsProps> = ({ progress, isPaused, onTogglePause, onReset, onNext, onPrev }) => {
  return (
    <div className="glass px-6 py-4 rounded-2xl flex items-center justify-between border-white/10 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onPrev}
          className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
        >
          <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <div className="flex items-center gap-2 mx-2">
          <button 
            onClick={onTogglePause}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isPaused ? 'bg-income text-black shadow-[0_0_15px_rgba(0,255,163,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isPaused ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            )}
          </button>
          
          <button 
            onClick={onReset}
            className="w-12 h-12 rounded-xl glass border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <button 
          onClick={onNext}
          className="w-10 h-10 rounded-xl glass border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors group"
        >
          <svg className="w-4 h-4 text-white/60 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Lab Completion</span>
          <span className="text-[10px] font-mono text-income">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-growth to-income transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,255,163,0.2)]" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Simulation Clock</span>
        <span className="text-lg font-bold font-mono text-white/80 tabular-nums">00:12:44:03</span>
      </div>
    </div>
  );
};

export default Controls;
