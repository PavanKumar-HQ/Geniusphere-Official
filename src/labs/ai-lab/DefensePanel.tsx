import React from 'react';
import { AIModule } from './types';
import { Shield, Info } from './Icons';

interface DefensePanelProps {
  module: AIModule;
  onClose?: () => void;
}

export const DefensePanel: React.FC<DefensePanelProps> = ({ module, onClose }) => {
  return (
    <div
      className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto h-auto md:h-full custom-scrollbar"
      style={{ width: '280px', minWidth: '240px', height: '100%', backgroundColor: '#0B132B', borderLeft: '1px solid #1E293B', padding: '16px 14px', boxSizing: 'border-box' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F1F5F9', margin: 0, letterSpacing: '0.08em' }}>
              Defense Protocols
            </h3>
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
              title="Collapse Defense Protocols"
            >
              Hide
            </button>
          )}
        </div>

        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {module.defense.map((item, i) => (
            <div
              key={i}
              className="group relative p-4 bg-slate-800/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-emerald-500/30 transition-all duration-300"
              style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(51,65,85,0.6)' }}
            >
              <div className="flex items-center gap-3 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', borderRadius: '4px', backgroundColor: 'rgba(16,185,129,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', flexShrink: 0 }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide" style={{ fontSize: '0.74rem', fontWeight: 700, color: '#CBD5E1' }}>
                  Protocol v1.{i + 1}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pl-8" style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0, paddingLeft: '28px', lineHeight: 1.5 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto" style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <div className="p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl relative overflow-hidden" style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
          <div className="flex items-center gap-2 mb-3" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Info className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22D3EE', margin: 0, letterSpacing: '0.06em' }}>
              Did You Know?
            </h4>
          </div>
          <p className="text-xs text-slate-400 italic leading-relaxed" style={{ fontSize: '0.76rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            {module.didYouKnow || "AI security is a rapidly evolving field requiring both technical and ethical guardrails."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#1E293B', border: '1px solid #334155', color: '#CBD5E1', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Download Tech Brief
          </button>
          <div className="flex items-center justify-center gap-2 py-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest" style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.08em' }}>
              Systems Nominal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
