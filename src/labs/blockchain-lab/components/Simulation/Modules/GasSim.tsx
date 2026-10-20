import React from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, Timer, List, TrendingUp, AlertCircle } from 'lucide-react';

export const GasSim: React.FC<{ step: number }> = ({ step }) => {
  const isCongested = step >= 1;
  const isBidding = step >= 2;
  const isMining = step >= 3;
  const isComplete = step >= 5;

  return (
    <div className="w-full h-full flex flex-col p-8 gap-8 items-center overflow-hidden">
      <div className="flex w-full max-w-4xl gap-12 flex-1">
        
        {/* Mempool (Queue) */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
             <h4 className="text-lab-blue text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
               <List size={14} /> Mempool (Pending Tx)
             </h4>
             {isCongested && <span className="text-lab-red text-[10px] font-bold animate-pulse">HIGH CONGESTION</span>}
          </div>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex flex-col gap-2 h-80 overflow-hidden relative">
             {[
               { id: 'tx_a82', gas: 45, color: 'text-lab-green', active: isBidding },
               { id: 'tx_f91', gas: 32, color: 'text-lab-blue', active: true },
               { id: 'tx_c22', gas: 15, color: 'text-gray-500', active: true },
               { id: 'tx_d04', gas: 12, color: 'text-gray-500', active: true },
               { id: 'tx_e55', gas: 8, color: 'text-lab-red', active: true },
             ].map((tx, i) => (
               <motion.div
                 key={tx.id}
                 animate={isMining && i === 0 ? { x: 400, opacity: 0 } : {}}
                 className={`p-3 bg-lab-card border rounded-lg flex items-center justify-between ${tx.active ? 'border-gray-700' : 'border-gray-800 opacity-30'}`}
               >
                 <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${tx.color.replace('text-', 'bg-')}`} />
                   <span className="font-mono text-[10px] text-gray-400">{tx.id}</span>
                 </div>
                 <div className={`font-mono text-[10px] font-bold ${tx.color}`}>
                   {tx.gas} Gwei
                 </div>
               </motion.div>
             ))}
             {isMining && (
               <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-lab-bg to-transparent pointer-events-none" />
             )}
          </div>
        </div>

        {/* Network State */}
        <div className="w-72 flex flex-col gap-6">
           <div className="bg-lab-card p-6 rounded-2xl border border-gray-800">
              <h5 className="text-[10px] text-gray-500 font-bold uppercase mb-4">Base Fee Status</h5>
              <div className="flex items-end gap-2 mb-2">
                 <span className="text-3xl font-bold text-white">28</span>
                 <span className="text-xs text-gray-400 mb-1">Gwei</span>
              </div>
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={isCongested ? { width: '80%', backgroundColor: '#FF4D4D' } : { width: '30%', backgroundColor: '#00FFA3' }}
                  className="h-full transition-all duration-1000"
                />
              </div>
           </div>

           <div className="space-y-4">
              <GasInfo active={isBidding} icon={<TrendingUp size={14} />} label="Max Priority Fee" value="2.5 Gwei" />
              <GasInfo active={isMining} icon={<Timer size={14} />} label="Est. Wait Time" value={isCongested ? "14 mins" : "30 secs"} />
              {isMining && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="bg-lab-blue/10 border border-lab-blue/20 p-4 rounded-xl flex items-center gap-3"
                >
                  <CloudLightning className="text-lab-blue" />
                  <div className="text-xs">
                    <p className="text-lab-blue font-bold uppercase">Mining Block...</p>
                    <p className="text-gray-500 text-[10px]">Priority given to highest gas.</p>
                  </div>
                </motion.div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const GasInfo = ({ active, icon, label, value }: any) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${active ? 'border-gray-700 bg-lab-card/50' : 'border-gray-800 opacity-30'}`}>
     <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
     </div>
     <span className="font-mono text-[10px] text-white font-bold">{value}</span>
  </div>
);
