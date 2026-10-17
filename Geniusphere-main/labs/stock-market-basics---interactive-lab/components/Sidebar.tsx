
import React from 'react';
import { SimulationStep, Topic } from '../types';
import { COLORS } from '../constants';

interface SidebarProps {
  topics: Topic[];
  currentStep: SimulationStep;
  onSelectStep: (step: SimulationStep) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ topics, currentStep, onSelectStep }) => {
  return (
    <aside className="w-full md:w-72 glass-panel p-4 flex flex-col gap-4 z-10">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Market Topics</h2>
      <div className="flex flex-col gap-2">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectStep(topic.id)}
            className={`flex flex-col text-left p-3 rounded-lg transition-all duration-300 group border border-transparent
              ${currentStep === topic.id 
                ? 'bg-cyan-500/10 border-cyan-500/30' 
                : 'hover:bg-slate-800/50 hover:border-slate-700'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${currentStep === topic.id ? 'border-cyan-400 text-cyan-400' : 'border-slate-600 text-slate-500'}`}>
                {topic.id + 1}
              </span>
              <span className={`text-sm font-semibold tracking-wide ${currentStep === topic.id ? 'text-cyan-400' : 'text-slate-300'}`}>
                {topic.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-7 group-hover:text-slate-400 transition-colors">
              {topic.description}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
