
import React from 'react';
import { AIModule } from '../types';
import { Shield, Info } from './Icons';

interface DefensePanelProps {
  module: AIModule;
}

export const DefensePanel: React.FC<DefensePanelProps> = ({ module }) => {
  return (
    <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col gap-8 shrink-0 overflow-y-auto h-auto md:h-full">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Defense Protocols</h3>
        </div>

        <div className="space-y-4">
          {module.defense.map((item, i) => (
            <div
              key={i}
              className="group relative p-4 bg-slate-800/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/0 group-hover:bg-emerald-500 rounded-l-xl transition-all duration-300"></div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                  {i + 1}
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Protocol v1.{i + 1}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pl-8">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Info className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Did You Know?</h4>
          </div>
          <p className="text-xs text-slate-400 italic leading-relaxed">
            {module.didYouKnow || "AI security is a rapidly evolving field requiring both technical and ethical guardrails."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button className="w-full py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors">
            Download Tech Brief
          </button>
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Systems Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
