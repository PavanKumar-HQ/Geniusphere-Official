
import React from 'react';
import { LabStep } from '../types';
import { STEPS } from '../constants';

interface SidebarProps {
  currentStep: LabStep;
  onStepSelect: (step: LabStep) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, onStepSelect }) => {
  return (
    <aside className="w-full md:w-64 border-r border-white/10 flex flex-col bg-[#070B1A]/40 backdrop-blur-md">
      <div className="p-6 border-b border-white/5">
        <h3 className="text-xs font-mono text-[#3BF0FF] uppercase tracking-[0.2em] mb-4">Module Index</h3>
        <nav className="space-y-1">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => onStepSelect(step.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left group
                ${currentStep === step.id 
                  ? 'bg-[#3BF0FF]/15 text-[#3BF0FF] border border-[#3BF0FF]/40 shadow-[0_0_15px_rgba(59,240,255,0.15)] font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'}
              `}
            >
              <div className={`w-2 h-2 rounded-full transition-all
                ${currentStep === step.id ? 'bg-[#3BF0FF] scale-125' : 'bg-slate-500 group-hover:bg-slate-300'}
              `} />
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-[#7C6BFF]/15 border border-[#7C6BFF]/30 rounded-xl p-4">
          <p className="text-[11px] font-mono text-[#C4B5FD] uppercase tracking-wider mb-2 font-bold">Core Formula</p>
          <div className="text-sm font-bold text-white leading-tight">
            Sense → Send <br />
            Process → Act
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
