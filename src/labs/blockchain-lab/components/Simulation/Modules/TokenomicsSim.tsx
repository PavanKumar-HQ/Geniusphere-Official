import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Database, TrendingUp, TrendingDown, RefreshCcw, Layout } from 'lucide-react';

export const TokenomicsSim: React.FC<{ step: number }> = ({ step }) => {
  const isMinting = step === 1;
  const isBurning = step === 2;
  const isUtility = step >= 3;
  const isStaked = step >= 4;
  const isGrowth = step >= 5;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 items-center overflow-hidden">
      <div className="flex w-full max-w-4xl gap-8 flex-1">
        
        {/* Supply Dashboard */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-lab-card p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Supply</span>
                    <TrendingUp size={16} className="text-lab-blue" />
                 </div>
                 <div className="text-3xl font-mono text-white mb-2">
                    {isGrowth ? '21,000,000' : '18,452,901'}
                 </div>
                 <div className="h-1 bg-gray-800 rounded-full">
                    <motion.div 
                      animate={{ width: isGrowth ? '100%' : '75%' }} 
                      className="h-full bg-lab-blue transition-all duration-1000" 
                    />
                 </div>
                 {isMinting && <div className="absolute inset-0 bg-lab-blue/5 animate-pulse" />}
              </div>

              <div className="bg-lab-card p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Token Burned</span>
                    <TrendingDown size={16} className="text-lab-red" />
                 </div>
                 <div className="text-3xl font-mono text-white mb-2">
                    {isBurning ? '502,311' : '420,000'}
                 </div>
                 <div className="h-1 bg-gray-800 rounded-full">
                    <motion.div 
                      animate={{ width: isBurning ? '40%' : '20%' }} 
                      className="h-full bg-lab-red transition-all duration-1000" 
                    />
                 </div>
                 {isBurning && <div className="absolute inset-0 bg-lab-red/5 animate-pulse" />}
              </div>
           </div>

           {/* Economic Cycle Visual */}
           <div className="bg-[#0A0F1E] border border-gray-800 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="w-48 h-48 rounded-full border border-gray-700 border-dashed relative flex items-center justify-center"
              >
                 <div className="absolute top-0 -translate-y-1/2 p-2 bg-lab-card border border-gray-800 rounded-lg"><RefreshCcw size={16} className="text-lab-blue" /></div>
                 <div className="absolute bottom-0 translate-y-1/2 p-2 bg-lab-card border border-gray-800 rounded-lg"><Flame size={16} className="text-lab-red" /></div>
                 
                 <div className="w-24 h-24 bg-lab-purple/10 rounded-full border-2 border-lab-purple flex items-center justify-center">
                    <Layout className="text-lab-purple" size={32} />
                 </div>
              </motion.div>
              <p className="mt-8 text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Economic Feedback Loop</p>
           </div>
        </div>

        {/* Info Sidebar */}
        <div className="w-72 space-y-4">
           <TokenMetric active={isUtility} label="Governance Utility" status="ACTIVE" icon={<Layout size={14} />} />
           <TokenMetric active={isStaked} label="Staking Mechanism" status="LOCKING" icon={<Database size={14} />} />
           <div className="p-5 bg-lab-blue/5 border border-lab-blue/20 rounded-2xl">
              <h4 className="text-[10px] text-lab-blue font-bold uppercase mb-3">Deflationary Pressure</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                 "Burning tokens from the circulating supply creates artificial scarcity, theoretically driving value up if demand remains constant."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const TokenMetric = ({ active, label, status, icon }: any) => (
  <div className={`p-4 rounded-xl border transition-all ${active ? 'border-gray-700 bg-lab-card' : 'border-gray-800 opacity-20'}`}>
     <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-500">{icon}</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
     </div>
     <div className={`font-mono text-xs font-bold ${active ? 'text-lab-green' : 'text-gray-600'}`}>{status}</div>
  </div>
);
