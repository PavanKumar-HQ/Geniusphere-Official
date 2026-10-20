
import React from 'react';
// Added AnimatePresence to framer-motion imports
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Zap, Boxes, ArrowRight } from 'lucide-react';

export const BridgeSim: React.FC<{ step: number }> = ({ step }) => {
  const isLocked = step >= 1;
  const isVerifying = step >= 2;
  const isRelaying = step >= 3;
  const isMinted = step >= 4;
  const isComplete = step >= 5;

  return (
    <div className="w-full h-full flex items-center justify-between p-12 relative overflow-hidden">
      {/* Background Bridge Cables */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 -z-10" />
      <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gray-900 -translate-y-1/2 -z-10" />
      <div className="absolute bottom-1/3 left-0 w-full h-0.5 bg-gray-900 -translate-y-1/2 -z-10" />

      {/* Chain A */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-lab-blue/10 border border-lab-blue/30 p-8 rounded-3xl relative">
          <Boxes size={48} className="text-lab-blue" />
          <p className="mt-4 text-center text-xs font-bold text-lab-blue tracking-tighter">ETHEREUM (L1)</p>
          
          <AnimatePresence>
            {isLocked && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-2">
                   <Lock className="text-lab-red" size={32} />
                   <span className="text-[10px] text-lab-red font-bold uppercase">Tokens Locked</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Relayer Hub */}
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          animate={isVerifying ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className={`p-4 rounded-full border-2 transition-all ${isRelaying ? 'border-lab-purple text-lab-purple shadow-[0_0_15px_rgba(124,107,255,0.4)]' : 'border-gray-800 text-gray-700'}`}
        >
          <Zap size={32} />
        </motion.div>
        
        {isRelaying && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] text-lab-purple font-mono uppercase font-bold"
          >
            RELAYING_PROOFS...
          </motion.div>
        )}
      </div>

      {/* Chain B */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-lab-green/10 border border-lab-green/30 p-8 rounded-3xl relative">
          <Boxes size={48} className="text-lab-green" />
          <p className="mt-4 text-center text-xs font-bold text-lab-green tracking-tighter">SOLANA (L1)</p>
          
          <AnimatePresence>
            {isMinted && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-lab-green/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-lab-green"
              >
                <div className="flex flex-col items-center gap-2">
                   <Unlock className="text-lab-green" size={32} />
                   <span className="text-[10px] text-lab-green font-bold uppercase text-center px-2">Wrapped Asset Minted</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Flying Token Packet */}
      {isLocked && !isMinted && (
        <motion.div 
          initial={{ x: -200 }}
          animate={{ x: 200 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-2">
            ASSET_MSG <ArrowRight size={10} />
          </div>
        </motion.div>
      )}
    </div>
  );
};
