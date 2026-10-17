
import React from 'react';
import { FinanceModule, ModuleId } from '../types';

interface SidebarProps {
  modules: FinanceModule[];
  activeId: ModuleId;
  onSelect: (id: ModuleId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ modules, activeId, onSelect }) => {
  return (
    <aside className="w-full md:w-72 border-r border-white/5 bg-black/20 overflow-y-auto p-4 flex flex-col gap-2 z-10">
      <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 px-2">Core Modules</div>
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => onSelect(module.id)}
          className={`flex items-center gap-4 p-3 rounded-xl transition-all text-left group
            ${activeId === module.id 
              ? 'bg-growth/20 border border-growth/30 text-white' 
              : 'hover:bg-white/5 text-white/50 border border-transparent hover:border-white/10'
            }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
            ${activeId === module.id ? 'bg-growth text-white' : 'bg-white/5 group-hover:bg-white/10'}
          `}>
            {module.id}
          </div>
          <span className="text-sm font-medium tracking-tight truncate">{module.title.split('. ')[1]}</span>
          {activeId === module.id && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-growth shadow-[0_0_8px_rgba(124,107,255,0.8)]"></div>
          )}
        </button>
      ))}
      <div className="mt-auto p-4 glass rounded-2xl border border-white/5 opacity-50">
        <div className="text-[10px] font-mono mb-2 uppercase tracking-wider">Lab Progress</div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-income transition-all duration-500" 
            style={{ width: `${(activeId / 10) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
