
import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SimulationStep } from '../types';

interface ControlBarProps {
  currentStep: SimulationStep;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ 
  currentStep, isPlaying, onTogglePlay, onReset, onNext, onPrev 
}) => {
  return (
    <div className="h-24 px-8 border-t border-white/10 flex items-center justify-between bg-[#0A0E1F]">
      <div className="flex items-center gap-6">
        <button 
          onClick={onReset}
          className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
          title="Reset Simulation"
        >
          <RotateCcw size={20} />
        </button>
        
        <button 
          onClick={onTogglePlay}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          <span className="font-bold text-xs tracking-widest uppercase font-mono">
            {isPlaying ? 'Pause Sim' : 'Play Sim'}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className={`h-1 rounded-full transition-all ${
              currentStep === i + 1 
                ? 'w-10 bg-cyan-400' 
                : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onPrev}
          disabled={currentStep === 1}
          className="p-2 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed rounded transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={onNext}
          disabled={currentStep === 8}
          className="p-2 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed rounded transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
