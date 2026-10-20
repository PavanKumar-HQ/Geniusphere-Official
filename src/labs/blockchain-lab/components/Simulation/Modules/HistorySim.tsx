
import React from 'react';
// Added AnimatePresence to framer-motion imports
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, CircleDollarSign, Landmark, Monitor, Bitcoin, ArrowRight } from 'lucide-react';

export const HistorySim: React.FC<{ step: number }> = ({ step }) => {
  const stages = [
    { label: "Barter", icon: <Handshake size={32} />, year: "-10,000 BC", desc: "Peer-to-peer exchange of goods." },
    { label: "Commodity", icon: <CircleDollarSign size={32} />, year: "600 BC", desc: "Gold, silver, and precious metals." },
    { label: "Fiat", icon: <Landmark size={32} />, year: "1694 AD", desc: "Government-backed paper currency." },
    { label: "Digital", icon: <Monitor size={32} />, year: "1990 AD", desc: "Bank databases and credit cards." },
    { label: "Crypto", icon: <Bitcoin size={48} />, year: "2009 AD", desc: "Programmable, decentralized value." },
  ];

  const currentIdx = Math.min(step, stages.length - 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="relative w-full max-w-4xl h-80 flex items-center justify-between">
         {/* Timeline Line */}
         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 -z-10" />
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }}
           className="absolute top-1/2 left-0 h-1 bg-lab-blue -translate-y-1/2 -z-10 transition-all duration-1000 shadow-[0_0_15px_rgba(59,240,255,0.4)]"
         />

         {stages.map((stage, i) => {
           const isActive = i === currentIdx;
           const isPassed = i < currentIdx;
           
           return (
             <div key={i} className="flex flex-col items-center gap-4 relative">
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isActive ? '#0F1629' : isPassed ? '#070B1A' : '#070B1A',
                    borderColor: isActive ? '#3BF0FF' : isPassed ? '#3BF0FF' : '#1f2937'
                  }}
                  className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors relative z-10 shadow-xl`}
                >
                   <div className={isActive ? 'text-lab-blue' : isPassed ? 'text-lab-blue/50' : 'text-gray-700'}>
                     {stage.icon}
                   </div>
                   
                   {isActive && (
                     <motion.div 
                        layoutId="active-glow"
                        className="absolute inset-0 rounded-full bg-lab-blue/10 animate-pulse"
                     />
                   )}
                </motion.div>
                
                <div className="text-center absolute top-24 w-32 left-1/2 -translate-x-1/2">
                   <p className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-gray-600'}`}>{stage.label}</p>
                   <p className="text-[9px] font-mono text-gray-500">{stage.year}</p>
                </div>
             </div>
           );
         })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="mt-20 max-w-lg bg-lab-card/50 border border-gray-800 p-6 rounded-2xl text-center backdrop-blur-md"
        >
          <h3 className="text-xl font-bold text-white mb-2">{stages[currentIdx].label} System</h3>
          <p className="text-gray-400 text-sm leading-relaxed italic">
            "{stages[currentIdx].desc}"
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
