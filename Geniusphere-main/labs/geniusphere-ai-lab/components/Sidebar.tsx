
import React from 'react';
import { AI_MODULES } from '../constants';
import { Shield, Terminal, AlertTriangle, CheckCircle } from './Icons';
import { ModuleCategory } from '../types';

interface SidebarProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
}

const CategoryIcon = ({ category }: { category: ModuleCategory }) => {
  switch (category) {
    case ModuleCategory.SECURITY: return <Shield className="w-4 h-4 text-cyan-400" />;
    case ModuleCategory.ETHICS: return <AlertTriangle className="w-4 h-4 text-purple-400" />;
    case ModuleCategory.PRIVACY: return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    default: return <Terminal className="w-4 h-4 text-slate-400" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule }) => {
  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Geniusphere
          </h1>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">AI Security Lab v2.0</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active Modules</p>
        </div>
        <nav className="space-y-1">
          {AI_MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex flex-col gap-1 ${
                activeModuleId === module.id
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <CategoryIcon category={module.category} />
                <span className="text-sm font-medium line-clamp-1">{module.title}</span>
              </div>
              <span className="text-[10px] ml-6 text-slate-500 font-mono tracking-tighter">
                {module.category.toUpperCase()}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600"></div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200">Lab Technician</span>
              <span className="text-[10px] text-slate-500">Access Level 4</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </button>
      </div>
    </div>
  );
};
