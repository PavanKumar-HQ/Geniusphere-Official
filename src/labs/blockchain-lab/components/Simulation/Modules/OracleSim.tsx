import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Globe, Share2, ShieldCheck, Database } from 'lucide-react';

export const OracleSim: React.FC<{ step: number }> = ({ step }) => {
  const isRequesting = step >= 1;
  const isQuerying = step >= 2;
  const isVerifying = step >= 3;
  const isFeeding = step >= 5;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 gap-12">
      {/* Real World */}
      <div className="flex flex-col items-center gap-6">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl relative group">
           <Globe size={64} className="text-gray-700 group-hover:text-lab-blue transition-colors" />
           <div className="mt-4 text-center">
             <p className="text-[10px] text-gray-500 font-bold uppercase">Real World</p>
             <p className="text-sm text-white font-mono">BTC Price: $98,421</p>
           </div>
           {isQuerying && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="absolute inset-0 bg-lab-blue/5 rounded-2xl animate-pulse"
             />
           )}
        </div>
      </div>

      {/* Oracle Nodes */}
      <div className="relative h-64 w-32 flex flex-col items-center justify-center">
        <div className="absolute inset-0 border-l border-r border-gray-800 border-dashed" />
        
        <motion.div 
          animate={isVerifying ? { scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 4 }}
          className={`z-10 p-4 rounded-xl border-2 transition-all ${isVerifying ? 'border-lab-purple bg-lab-purple/10 text-lab-purple' : 'border-gray-800 text-gray-700'}`}
        >
          <Share2 size={32} />
        </motion.div>
        <span className="mt-4 text-[10px] font-bold text-gray-500 uppercase">Oracle Node</span>
        
        {/* Data Packet animation */}
        {isRequesting && !isFeeding && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 100, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-0 w-4 h-4 bg-lab-blue rounded-full shadow-[0_0_10px_rgba(59,240,255,0.6)]"
          />
        )}
      </div>

      {/* Blockchain */}
      <div className="flex flex-col items-center gap-6">
        <div className={`p-6 border-2 rounded-2xl transition-all ${isFeeding ? 'border-lab-green bg-lab-green/5' : 'border-gray-800 bg-gray-900/50'}`}>
           <Database size={64} className={isFeeding ? 'text-lab-green' : 'text-gray-700'} />
           <div className="mt-4 text-center">
             <p className="text-[10px] text-gray-500 font-bold uppercase">Smart Contract</p>
             <p className={`text-sm font-mono ${isFeeding ? 'text-lab-green' : 'text-gray-500'}`}>
               {isFeeding ? 'PRICE_UPDATED' : 'WAITING_FOR_DATA'}
             </p>
           </div>
           {isFeeding && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3 bg-lab-green text-black p-1 rounded-full">
               <ShieldCheck size={18} />
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};
