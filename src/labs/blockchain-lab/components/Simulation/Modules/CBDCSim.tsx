
import React from 'react';
// Added AnimatePresence to framer-motion imports
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Smartphone, ShieldCheck, UserCheck, DollarSign, ArrowDown } from 'lucide-react';

export const CBDCSim: React.FC<{ step: number }> = ({ step }) => {
  const isIssuing = step >= 1;
  const isKYC = step >= 3;
  const isDistributed = step >= 4;
  const isRetailActive = step >= 5;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-12 relative overflow-hidden">
      {/* Central Bank Tier */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-lab-card border-4 border-lab-blue p-8 rounded-[40px] shadow-[0_0_40px_rgba(59,240,255,0.1)] relative">
           <Landmark size={64} className="text-lab-blue" />
           {isIssuing && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-4 bg-lab-blue text-black p-2 rounded-full font-bold text-[10px]">
               CENTRAL_BANK
             </motion.div>
           )}
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Tier 1: Sovereign Issue</p>
      </div>

      <div className="flex items-center gap-8 z-10">
         <div className="w-0.5 h-12 bg-gradient-to-b from-lab-blue to-lab-purple" />
         {isKYC && (
           <motion.div 
             initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
             className="bg-lab-purple/10 border border-lab-purple text-lab-purple px-4 py-1 rounded-full text-[10px] font-bold flex items-center gap-2"
           >
             <UserCheck size={12} /> IDENTITY_VERIFIED (KYC)
           </motion.div>
         )}
      </div>

      {/* Retail Tier */}
      <div className="flex gap-12">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-3">
             <motion.div 
               animate={isDistributed ? { y: [0, -5, 0] } : {}}
               transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
               className={`w-20 h-32 rounded-2xl border-2 flex flex-col items-center justify-center p-4 relative ${isDistributed ? 'border-lab-green bg-lab-green/5' : 'border-gray-800 opacity-20'}`}
             >
                <Smartphone size={32} className={isDistributed ? 'text-lab-green' : 'text-gray-700'} />
                {isRetailActive && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-2 text-lab-green font-mono text-[10px]"
                  >
                    $250.00
                  </motion.div>
                )}
                {isDistributed && (
                   <motion.div 
                     initial={{ y: -100, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="absolute -top-8 text-lab-green"
                   >
                     <DollarSign size={20} />
                   </motion.div>
                )}
             </motion.div>
             <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">User Account #{i}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isKYC && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="absolute top-1/2 right-20 -translate-y-1/2 w-48 bg-lab-card/50 border border-gray-700 p-4 rounded-xl backdrop-blur-md"
           >
              <div className="flex items-center gap-2 text-lab-blue mb-2">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Compliance Engine</span>
              </div>
              <ul className="space-y-2 text-[9px] text-gray-500">
                <li className="flex justify-between"><span>AML CHECK</span> <span className="text-lab-green">PASSED</span></li>
                <li className="flex justify-between"><span>TAX REPORTING</span> <span className="text-lab-green">ACTIVE</span></li>
                <li className="flex justify-between"><span>PROGRAMMABILITY</span> <span className="text-lab-purple">ENABLED</span></li>
              </ul>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
