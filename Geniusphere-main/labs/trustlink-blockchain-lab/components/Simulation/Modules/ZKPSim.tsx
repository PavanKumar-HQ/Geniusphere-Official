import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, UserCheck, ShieldCheck, Key, HelpCircle, Shield, Search, Lock } from 'lucide-react';

export const ZKPSim: React.FC<{ step: number }> = ({ step }) => {
  const isClaiming = step >= 1;
  const isMasking = step >= 2;
  const isProving = step >= 3;
  const isVerified = step >= 5;

  return (
    <div className="w-full h-full flex items-center justify-around p-12 bg-[#050814]/50 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-lab-blue/10 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-lab-blue/5 rounded-full" />
      </div>

      {/* Prover Side */}
      <div className="flex flex-col items-center gap-8 relative z-10">
        <motion.h4 
          animate={isClaiming ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
          className="text-lab-blue text-xs font-bold uppercase tracking-widest"
        >
          The Prover
        </motion.h4>
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`w-48 h-56 bg-lab-card border-2 transition-all duration-500 rounded-3xl flex flex-col items-center justify-center p-6 gap-4 shadow-2xl ${isProving ? 'border-lab-purple bg-lab-purple/5' : 'border-lab-blue'}`}
          >
             <div className="p-4 bg-lab-blue/10 rounded-2xl">
               {isMasking ? <Shield size={32} className="text-lab-purple animate-pulse" /> : <Key className="text-lab-blue" size={32} />}
             </div>
             <div className="text-center w-full">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Secret Statement</p>
                <div className="bg-black/40 p-2 rounded-lg mt-2 overflow-hidden">
                  <motion.p 
                    animate={isMasking ? { filter: 'blur(8px)', opacity: 0.5 } : { filter: 'blur(0px)', opacity: 1 }}
                    className="font-mono text-xs text-white"
                  >
                    VALUE = 42,912
                  </motion.p>
                </div>
             </div>
             {isProving && (
                <div className="flex items-center gap-2 text-[9px] font-bold text-lab-purple uppercase">
                   <Lock size={10} /> Encrypted
                </div>
             )}
          </motion.div>

          {/* Shielding Animation */}
          <AnimatePresence>
            {isProving && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-6 -top-6 bg-lab-purple text-white p-3 rounded-2xl shadow-[0_0_20px_rgba(124,107,255,0.4)] border border-white/20 z-20"
              >
                <ShieldCheck size={24} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Knowledge Pulse */}
          <AnimatePresence>
            {isProving && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 border-2 border-lab-purple rounded-3xl pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The Evidence (Proof Packet) */}
      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="relative h-40 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {isProving && (
               <motion.div
                 key="packet"
                 initial={{ y: -50, opacity: 0 }}
                 animate={{ y: 20, opacity: 1 }}
                 className="bg-lab-purple/10 border border-lab-purple text-lab-purple px-5 py-2.5 rounded-2xl font-mono text-[10px] font-bold shadow-xl backdrop-blur-md flex items-center gap-2"
               >
                 <motion.div 
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-3 h-3 border-2 border-lab-purple border-t-transparent rounded-full"
                 />
                 PROVING_VALIDITY...
               </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-lab-blue via-lab-purple to-lab-green opacity-30" />
        </div>

        <AnimatePresence>
          {isVerified && (
             <motion.div
               initial={{ scale: 0, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-lab-green text-black px-6 py-2 rounded-full text-[11px] font-black tracking-widest shadow-[0_0_30px_rgba(0,255,163,0.4)] uppercase"
             >
               ZERO_KNOWLEDGE_PROOF_VALID
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verifier Side */}
      <div className="flex flex-col items-center gap-8 relative z-10">
        <motion.h4 
          animate={isVerified ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
          className="text-lab-green text-xs font-bold uppercase tracking-widest"
        >
          The Verifier
        </motion.h4>
        <div className="relative">
          <div className={`w-48 h-56 bg-lab-card border-2 rounded-3xl flex flex-col items-center justify-center p-6 gap-4 transition-all duration-700 shadow-2xl relative overflow-hidden ${isVerified ? 'border-lab-green bg-lab-green/5' : 'border-gray-800'}`}>
             
             {/* Tech Scanner Beam */}
             <AnimatePresence>
               {isProving && !isVerified && (
                 <motion.div 
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-x-0 h-1 bg-lab-blue/40 shadow-[0_0_15px_rgba(59,240,255,0.5)] z-20 pointer-events-none"
                 />
               )}
             </AnimatePresence>

             <div className={`p-4 rounded-2xl transition-colors duration-500 ${isVerified ? 'bg-lab-green/10' : 'bg-gray-800/50'}`}>
               {isVerified ? <UserCheck className="text-lab-green" size={48} /> : isProving ? <Search className="text-lab-blue animate-pulse" size={48} /> : <HelpCircle className="text-gray-700" size={48} />}
             </div>
             
             <div className="text-center w-full">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Verification State</p>
                <div className="bg-black/40 p-2 rounded-lg mt-2">
                  <p className={`font-mono text-xs ${isVerified ? 'text-lab-green' : 'text-gray-500'}`}>
                    {isVerified ? "TRUE (AUTHENTIC)" : isProving ? "ANALYZING..." : "AWAITING_CLAIM"}
                  </p>
                </div>
             </div>
             <div className="flex items-center gap-2 mt-2">
               <EyeOff size={14} className="text-gray-600" />
               <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">Zero Leakage</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};
