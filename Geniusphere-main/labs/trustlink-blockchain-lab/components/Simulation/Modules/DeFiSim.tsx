
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRightLeft, Droplets, TrendingUp, DollarSign } from 'lucide-react';

export const DeFiSim: React.FC<{ step: number }> = ({ step }) => {
  const isDeposited = step >= 1;
  const isPoolActive = step >= 2;
  const isSwapping = step === 3;
  const isYielding = step >= 5;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 gap-12 relative overflow-hidden">
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-lab-blue font-bold tracking-[0.3em] uppercase text-xs opacity-70 italic">Liquidity Pool: ETH / USDC</h3>
        
        <div className="flex items-end gap-6 h-64">
          {/* ETH Pool */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-28 h-56 bg-gray-950 border border-gray-800 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:border-lab-blue/60 group-hover:shadow-[0_0_30px_rgba(59,240,255,0.1)]">
              <motion.div 
                animate={{ 
                  height: isSwapping ? '70%' : isDeposited ? '50%' : '10%',
                  opacity: isDeposited ? 1 : 0.2 
                }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-lab-blue/40 to-lab-blue/20 border-t-2 border-lab-blue transition-all duration-1000"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-white font-mono text-sm font-black z-10 group-hover:scale-110 transition-transform">ETH</span>
                {isDeposited && <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Droplets className="text-lab-blue/40" size={16} /></motion.div>}
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-mono font-bold">10.5K ASSETS</span>
          </motion.div>

          {/* Swap Indicator */}
          <div className="h-56 flex items-center">
             <motion.div 
               animate={isSwapping ? { rotate: 180, scale: 1.15 } : { rotate: 0 }}
               whileHover={{ scale: 1.1, backgroundColor: "rgba(59,240,255,0.05)" }}
               className={`p-4 rounded-full border-2 transition-all cursor-pointer shadow-xl ${isSwapping ? 'border-lab-green text-lab-green shadow-[0_0_20px_rgba(0,255,163,0.3)]' : 'border-gray-800 text-gray-600 hover:border-gray-500'}`}
             >
               <ArrowRightLeft size={28} />
             </motion.div>
          </div>

          {/* USDC Pool */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-28 h-56 bg-gray-950 border border-gray-800 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:border-lab-purple/60 group-hover:shadow-[0_0_30px_rgba(124,107,255,0.1)]">
              <motion.div 
                animate={{ 
                  height: isSwapping ? '30%' : isDeposited ? '50%' : '10%',
                  opacity: isDeposited ? 1 : 0.2 
                }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-lab-purple/40 to-lab-purple/20 border-t-2 border-lab-purple transition-all duration-1000"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-white font-mono text-sm font-black z-10 group-hover:scale-110 transition-transform">USDC</span>
                {isDeposited && <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}><Droplets className="text-lab-purple/40" size={16} /></motion.div>}
              </div>
            </div>
            <span className="text-[10px] text-gray-500 font-mono font-bold">2.1M ASSETS</span>
          </motion.div>
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="flex flex-col gap-4 w-72">
        <DeFiMetric active={isPoolActive} label="AMM_ALGORITHM" value="x * y = K" icon={<Activity size={14} />} />
        <DeFiMetric active={isSwapping} label="SLIPPAGE_PROTECTION" value="0.05% IMPACT" icon={<TrendingUp size={14} />} />
        <DeFiMetric active={isYielding} label="YIELD_RESERVE" value="+12.4% APY" icon={<DollarSign size={14} />} color="text-lab-green" />
        
        <AnimatePresence>
          {isYielding && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-lab-green/10 border border-lab-green/30 p-5 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,163,0.1)] backdrop-blur-md"
            >
              <div className="p-2 bg-lab-green/20 rounded-xl text-lab-green">
                <Droplets size={24} />
              </div>
              <div className="text-xs">
                <p className="text-lab-green font-black uppercase tracking-widest text-[10px]">Harvesting Fees</p>
                <p className="text-gray-400 text-[10px] font-medium leading-tight">Liquidity providers earned network rewards.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DeFiMetric = ({ active, label, value, icon, color = "text-white" }: any) => (
  <motion.div 
    whileHover={active ? { x: 8, backgroundColor: "rgba(59,240,255,0.05)" } : {}}
    className={`p-4 rounded-xl border transition-all duration-300 flex flex-col gap-1 ${active ? 'border-gray-700 bg-lab-card/60 shadow-lg' : 'border-gray-800 opacity-20'}`}
  >
    <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest">
      {icon} {label}
    </div>
    <div className={`font-mono text-xs font-bold ${color} tracking-tight`}>{value}</div>
  </motion.div>
);
