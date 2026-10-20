
import React from 'react';
import { ShieldCheck, Info, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface RightPanelProps {
  isSimplified: boolean;
  onToggleSimplified: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isSimplified, onToggleSimplified }) => {
  return (
    <div className="w-full md:w-80 h-full p-6 space-y-6 overflow-y-auto">
      {/* Simplified Mode Toggle */}
      <button 
        onClick={onToggleSimplified}
        className={`w-full group p-4 border rounded-xl flex items-center justify-between transition-all ${
          isSimplified 
            ? 'bg-yellow-500/10 border-yellow-500/40' 
            : 'bg-white/5 border-white/10 grayscale opacity-60'
        }`}
      >
        <div className="flex items-center gap-3">
          <Zap size={18} className={isSimplified ? 'text-yellow-400' : 'text-white'} />
          <span className="text-xs font-bold uppercase font-mono tracking-wider">Simplified</span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${isSimplified ? 'bg-yellow-500' : 'bg-white/10'}`}>
           <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${isSimplified ? 'left-5' : 'left-1'}`} />
        </div>
      </button>

      {/* Defense Protocols */}
      <GlassCard title="Defense Protocols" icon={<ShieldCheck size={16} />}>
        <div className="space-y-4">
          {[
            { title: "Think Before You Post", desc: "Once online, it can stay forever." },
            { title: "Check App Permissions", desc: "Allow only what is necessary." },
            { title: "Use Strong Passwords", desc: "Enable 2FA for all key accounts." },
            { title: "Private Profiles", desc: "Control who can view your personal info." }
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-white uppercase">{item.title}</p>
                <p className="text-[10px] text-white/40 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Did You Know? */}
      <GlassCard title="Did You Know?" icon={<Info size={16} />}>
        <div className="bg-cyan-500/5 p-4 rounded border border-cyan-500/10">
          <p className="text-xs italic text-cyan-200/80 leading-relaxed">
            "Your digital footprint can affect college admissions, jobs, and reputation years later. The internet never truly forgets."
          </p>
        </div>
      </GlassCard>

      {/* Learning Outcome Badge */}
      <div className="p-4 border border-white/5 rounded-xl bg-black/40">
        <h4 className="text-[10px] font-mono text-white/30 uppercase mb-2">Learning Milestone</h4>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold">1</div>
           <p className="text-[10px] text-blue-200">Understand Active vs Passive data collection</p>
        </div>
      </div>
    </div>
  );
};
