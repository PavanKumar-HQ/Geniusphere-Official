import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowDown, Zap, ShieldCheck } from 'lucide-react';

export const Layer2Sim: React.FC<{ step: number }> = ({ step }) => {
  const isBatching = step >= 1;
  const isProving = step >= 2;
  const isSettling = step >= 3;
  const isFinal = step >= 5;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-12">
      {/* Layer 2 - Scaling Layer */}
      <div className="w-full max-w-2xl bg-lab-blue/5 border border-lab-blue/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-2 left-4 text-[10px] text-lab-blue font-bold uppercase tracking-widest">Execution Layer (Layer 2)</div>
        
        <div className="flex justify-center gap-4 py-8">
           {[1,2,3,4,5,6].map(i => (
             <motion.div
               key={i}
               initial={{ y: 20, opacity: 0 }}
               animate={isBatching ? { y: 0, opacity: 1, x: (3.5 - i) * 10 } : { y: 0, opacity: 0.3 }}
               className="w-10 h-10 bg-lab-blue/20 border border-lab-blue/40 rounded flex items-center justify-center text-[10px] text-lab-blue font-mono"
             >
               Tx{i}
             </motion.div>
           ))}
        </div>
        
        {isProving && (
          <motion.div 
            initial={{ width: 0 }} animate={{ width: '100%' }}
            className="h-1 bg-lab-blue/30 rounded-full mt-2"
          />
        )}
      </div>

      {/* The Funnel / Rollup Mechanism */}
      <div className="flex flex-col items-center -my-4 z-10">
         <motion.div 
            animate={isSettling ? { y: [0, 10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`p-3 rounded-full border-2 ${isSettling ? 'border-lab-purple text-lab-purple shadow-[0_0_20px_rgba(124,107,255,0.4)]' : 'border-gray-800 text-gray-700'}`}
         >
            <Zap size={32} />
         </motion.div>
         <div className="w-0.5 h-12 bg-gradient-to-b from-lab-blue to-lab-purple" />
      </div>

      {/* Layer 1 - Settlement Layer */}
      <div className="w-full max-w-2xl bg-lab-purple/5 border border-lab-purple/20 rounded-2xl p-6 relative">
        <div className="absolute top-2 left-4 text-[10px] text-lab-purple font-bold uppercase tracking-widest">Settlement Layer (Layer 1)</div>
        
        <div className="flex justify-center py-4">
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={isSettling ? { scale: 1, opacity: 1 } : {}}
             className={`w-full max-w-md h-16 border-2 border-dashed rounded-xl flex items-center justify-center gap-4 ${isFinal ? 'border-lab-green bg-lab-green/5' : 'border-lab-purple bg-lab-purple/5'}`}
           >
             {isSettling && (
               <>
                 <ShieldCheck className={isFinal ? 'text-lab-green' : 'text-lab-purple'} />
                 <span className={`font-mono text-sm ${isFinal ? 'text-lab-green' : 'text-lab-purple'}`}>
                   {isFinal ? 'COMPRESSED_BATCH_VERIFIED' : 'WAITING_FOR_PROOF...'}
                 </span>
               </>
             )}
           </motion.div>
        </div>
      </div>
    </div>
  );
};
