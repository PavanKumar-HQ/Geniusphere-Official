
import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SimulationStep } from '../types';

interface ControlsProps {
  currentStep: SimulationStep;
  totalSteps: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
  isSimplified: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  currentStep, 
  isPlaying, 
  onPlayToggle, 
  onReset, 
  onNext, 
  onPrev,
  isSimplified
}) => {
  const steps = isSimplified ? [0, 3, 5] : [0, 1, 2, 3, 4, 5, 6, 7];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="h-20 glass-panel flex items-center px-6 justify-between gap-6 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onPlayToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isPlaying ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(59,240,255,0.3)] hover:scale-105'
          }`}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
        </button>
        <button 
          onClick={onReset}
          className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 max-w-md">
        <div className="flex justify-between text-[10px] text-slate-500 font-bold tracking-widest uppercase">
          <span>Simulation Progress</span>
          <span>{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
          {steps.map((s, idx) => (
            <div 
              key={s} 
              className={`h-full flex-1 transition-all duration-500 ${
                s <= currentStep ? 'bg-cyan-500 shadow-[0_0_10px_rgba(59,240,255,0.5)]' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          disabled={currentIndex === 0}
          onClick={onPrev}
          className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          disabled={currentIndex === steps.length - 1}
          onClick={onNext}
          className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-30 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Controls;
