
import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { TOPICS } from '../constants';
import { SimulationStep } from '../types';

interface SidebarProps {
  currentStep: SimulationStep;
  onTopicClick: (step: SimulationStep) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentStep, onTopicClick }) => {
  return (
    <div className="w-72 h-full flex flex-col border-r border-white/10 p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-cyan-500/20 p-2 rounded-lg">
          <Shield size={24} className="text-cyan-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tighter uppercase font-mono">CYBER_LAB</h1>
          <p className="text-[10px] text-white/40">Select a topic to analyze</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {TOPICS.map((topic, index) => {
          // Adjust logic to match sequential progress or just navigation
          const isActive = currentStep === topic.id;
          return (
            <button
              key={index}
              onClick={() => onTopicClick(topic.id)}
              className={`w-full group text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all border ${
                isActive 
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' 
                  : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <span className="text-xs font-medium font-mono">{topic.label}</span>
              <ChevronRight 
                size={14} 
                className={`transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} 
              />
            </button>
          );
        })}
      </nav>

      <div className="mt-10 pt-6 border-t border-white/10">
        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded text-xs font-mono uppercase transition-colors">
          Exit Lab
        </button>
      </div>
    </div>
  );
};
