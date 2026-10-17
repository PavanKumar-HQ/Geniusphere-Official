
import React from 'react';

interface RightPanelProps {
  tips: string[];
  didYouKnow: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ tips, didYouKnow }) => {
  return (
    <aside className="w-full md:w-80 border-l border-white/5 bg-black/20 p-6 flex flex-col gap-6 overflow-y-auto z-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-income">💡</span>
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">Money Smart Tips</h3>
        </div>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="glass p-3 rounded-xl border-white/5 flex gap-3 items-start hover:border-income/30 transition-colors">
              <div className="w-1 h-1 rounded-full bg-income mt-2 shrink-0" />
              <p className="text-xs text-white/70 leading-relaxed font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="glass bg-growth/5 border-growth/20 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-growth/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-growth/20 transition-all"></div>
          <div className="flex items-center gap-2 mb-3 relative">
            <span className="text-growth">✨</span>
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-growth font-bold">Did You Know?</h3>
          </div>
          <p className="text-sm italic text-white/80 leading-relaxed relative">
            "{didYouKnow}"
          </p>
        </div>
      </div>
      
      <div className="p-4 border border-dashed border-white/10 rounded-xl text-center">
        <p className="text-[10px] font-mono text-white/30">LAB_SYSTEM_READY</p>
        <p className="text-[10px] font-mono text-white/30 uppercase mt-1">Class 7-10 Educational Version</p>
      </div>
    </aside>
  );
};

export default RightPanel;
