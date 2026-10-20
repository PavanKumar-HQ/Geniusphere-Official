
import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { LabStep } from '../types';

interface ControlsProps {
  currentStep: LabStep;
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onStepSelect: (step: LabStep) => void;
}

const Controls: React.FC<ControlsProps> = ({
  currentStep,
  isPaused,
  setIsPaused,
  onNext,
  onPrev,
  onReset,
  onStepSelect
}) => {
  return (
    <footer className="h-24 border-t border-white/10 z-20 backdrop-blur-xl bg-[#070B1A]/90 flex items-center px-8 gap-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      {/* Status Group */}
      <div className="flex items-center gap-6 pr-8 border-r border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${
              isPaused 
                ? 'bg-[#00FFA3]/10 border-[#00FFA3] text-[#00FFA3] hover:bg-[#00FFA3]/20 shadow-[0_0_20px_rgba(0,255,163,0.2)]' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
          </button>
          <button 
            onClick={onReset}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <div className="hidden lg:flex flex-col gap-1">
           <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#3BF0FF]" />
              Simulation_Engine
           </div>
           <div className="text-xs font-bold text-white/80">{isPaused ? 'HALTED_FOR_REVIEW' : 'PROCESSING_REALTIME'}</div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="flex-1 flex items-center gap-4">
        <button 
          onClick={onPrev}
          disabled={currentStep === LabStep.ACTIVATION}
          className="p-3 text-white/20 hover:text-[#3BF0FF] hover:bg-[#3BF0FF]/5 rounded-xl disabled:opacity-5 transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div className="flex-1 flex gap-2 h-2 items-center">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              onClick={() => onStepSelect(s)}
              className={`flex-1 rounded-sm h-full transition-all relative group
                ${s === currentStep 
                  ? 'bg-[#3BF0FF] shadow-[0_0_15px_#3BF0FF] scale-y-150' 
                  : s < currentStep 
                    ? 'bg-[#3BF0FF]/40' 
                    : 'bg-white/10 hover:bg-white/20'}
              `}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-white/10 border border-white/10 px-2 py-1 rounded text-[10px] pointer-events-none font-mono whitespace-nowrap backdrop-blur-md">
                MODULE_0{s}
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={onNext}
          disabled={currentStep === LabStep.SECURITY_DEFENSE}
          className="p-3 text-white/20 hover:text-[#3BF0FF] hover:bg-[#3BF0FF]/5 rounded-xl disabled:opacity-5 transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Action Prompt */}
      <div className="hidden md:block">
        <button 
          onClick={onNext}
          className={`px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl active:scale-95 border-2 ${
            currentStep === LabStep.SECURITY_DEFENSE 
              ? 'bg-transparent border-[#00FFA3] text-[#00FFA3] hover:bg-[#00FFA3]/10' 
              : 'bg-[#3BF0FF] border-[#3BF0FF] text-[#070B1A] hover:brightness-110 shadow-[0_0_30px_rgba(59,240,255,0.3)]'
          }`}
        >
          {currentStep === LabStep.SECURITY_DEFENSE ? 'MISSION COMPLETE' : 'UPGRADE PHASE'}
        </button>
      </div>
    </footer>
  );
};

export default Controls;
