
import React from 'react';
import { AI_MODULES } from './constants';
import { Shield, Terminal, AlertTriangle, CheckCircle } from './Icons';
import { ModuleCategory } from './types';

interface SidebarProps {
  activeModuleId: string;
  onSelectModule: (id: string) => void;
  onClose?: () => void;
}

const CategoryIcon = ({ category }: { category: ModuleCategory }) => {
  return (
    <div style={{ width: '16px', height: '16px', minWidth: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {category === ModuleCategory.SECURITY && <Shield className="w-4 h-4 text-cyan-400" />}
      {category === ModuleCategory.ETHICS && <AlertTriangle className="w-4 h-4 text-purple-400" />}
      {category === ModuleCategory.PRIVACY && <CheckCircle className="w-4 h-4 text-emerald-400" />}
      {category !== ModuleCategory.SECURITY && category !== ModuleCategory.ETHICS && category !== ModuleCategory.PRIVACY && (
        <Terminal className="w-4 h-4 text-slate-400" />
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule, onClose }) => {
  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0" style={{ height: '100%', minHeight: 0 }}>
      <div className="p-6 border-b border-slate-800" style={{ padding: '16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center"
              style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#06B6D4', borderRadius: '6px', flexShrink: 0 }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent" style={{ fontSize: '1rem', margin: 0, color: '#FFFFFF' }}>
              Geniusphere
            </h1>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px 8px',
                fontSize: '0.72rem',
                borderRadius: '4px',
              }}
              title="Collapse Modules Sidebar"
            >
              Hide
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold" style={{ fontSize: '0.65rem', color: '#64748B', margin: '2px 0 0', letterSpacing: '0.08em' }}>
          AI Security Lab v2.0
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="px-3 mb-2" style={{ padding: '0 8px', marginBottom: '8px' }}>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest" style={{ fontSize: '0.65rem', color: '#64748B', margin: 0, letterSpacing: '0.08em' }}>Active Modules</p>
        </div>
        <nav className="space-y-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {AI_MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex flex-col gap-1 ${
                activeModuleId === module.id
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: activeModuleId === module.id ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
                backgroundColor: activeModuleId === module.id ? 'rgba(6,182,212,0.1)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CategoryIcon category={module.category} />
                <span className="text-sm font-medium line-clamp-1" style={{ fontSize: '0.82rem', fontWeight: 600, color: activeModuleId === module.id ? '#22D3EE' : '#CBD5E1' }}>
                  {module.title}
                </span>
              </div>
              <span className="text-[10px] ml-6 text-slate-500 font-mono tracking-tighter" style={{ fontSize: '0.65rem', color: '#64748B', marginLeft: '24px' }}>
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
