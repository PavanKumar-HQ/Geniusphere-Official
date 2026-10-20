
import React from 'react';
import { Lightbulb, ShieldCheck, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { SimulationStep } from '../types';

interface RightPanelProps {
  isSimplified: boolean;
  onToggleSimplified: () => void;
  currentStep: SimulationStep;
}

const RightPanel: React.FC<RightPanelProps> = ({ isSimplified, onToggleSimplified, currentStep }) => {
  return (
    <aside className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto no-scrollbar z-10">
      {/* Mode Toggle */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lab Mode</h3>
           <button 
             onClick={onToggleSimplified}
             className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
           >
              <span className="text-[10px] font-bold uppercase">{isSimplified ? 'Simplified' : 'Advanced'}</span>
              {isSimplified ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
           </button>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal">
          {isSimplified 
            ? 'Simplified mode focuses on the 3 core pillars of the stock market.' 
            : 'Advanced mode covers the complete 8-step simulation flow.'}
        </p>
      </div>

      {/* Best Practices */}
      <div className="glass-panel p-4 flex-1">
         <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-emerald-400" size={18} />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Market Wisdom</h3>
         </div>
         <ul className="space-y-4">
            {[
              "Invest for long-term goals (5+ years)",
              "Never invest money you can't afford to lose",
              "Learn how a business works before buying",
              "Avoid 'hot tips' and rumors",
              "Discipline matters more than timing"
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                 <span className="text-emerald-500 font-bold">•</span>
                 {text}
              </li>
            ))}
         </ul>
      </div>

      {/* Did You Know? */}
      <div className="glass-panel p-4 bg-indigo-500/5 border-indigo-500/20">
         <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-amber-400" size={18} />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Did You Know?</h3>
         </div>
         <div className="text-xs text-slate-300 leading-relaxed p-3 rounded bg-indigo-500/10 border border-indigo-500/20 italic">
            “Many successful investors focus on long-term ownership, not daily price changes. They treat it like planting a tree, not like betting on a race.”
         </div>
      </div>

      {/* Step Info */}
      <div className="glass-panel p-4 border-slate-700/50">
         <div className="flex items-center gap-2 mb-2">
            <Info className="text-slate-500" size={18} />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Takeaway</h3>
         </div>
         <p className="text-xs text-slate-500 italic">
            Participating in the market means helping businesses create products, jobs, and innovation.
         </p>
      </div>
    </aside>
  );
};

export default RightPanel;
