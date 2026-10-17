
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Block } from '../Block';
import { BlockData } from '../../../types';
import { ArrowRight, CheckCircle, Database, Server, Share2, Activity, Zap } from 'lucide-react';

interface BasicsSimProps {
  step: number;
  simplified: boolean;
}

export const BasicsSim: React.FC<BasicsSimProps> = ({ step, simplified }) => {
  const [blocks, setBlocks] = useState<BlockData[]>([
    { id: 1, hash: "000a1b2...", prevHash: "0000000...", data: "Genesis Block", status: "verified" }
  ]);

  useEffect(() => {
    if (step === 0) {
        setBlocks([{ id: 1, hash: "000a1b2...", prevHash: "0000000...", data: "Genesis Block", status: "verified" }]);
    }
  }, [step]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
        {/* Tech Ambient Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
           {Array.from({ length: 15 }).map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-px h-16 bg-lab-blue"
               animate={{
                 y: [-100, 600],
                 opacity: [0, 0.8, 0]
               }}
               transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
               style={{ left: `${Math.random() * 100}%`, top: '-50px' }}
             />
           ))}
        </div>

        {/* Chain Container */}
        <motion.div 
          animate={{ x: step >= 2 ? -180 : 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="flex items-center gap-12 relative z-10"
        >
           <Block index={0} block={blocks[0]} simplified={simplified} />
           
           {/* Step 1: Transaction Arrival - better visual */}
           <AnimatePresence>
             {step === 1 && (
               <motion.div
                 initial={{ x: -250, opacity: 0, scale: 0.5 }}
                 animate={{ x: -80, opacity: 1, scale: 1 }}
                 exit={{ x: 50, opacity: 0, scale: 0.8 }}
                 className="absolute left-full top-1/2 -translate-y-1/2 flex items-center gap-4"
               >
                 <motion.div 
                   animate={{ opacity: [0.2, 0.8, 0.2] }} 
                   transition={{ repeat: Infinity, duration: 1 }}
                   className="h-0.5 w-16 bg-gradient-to-r from-lab-blue to-transparent border-t border-dashed border-lab-blue" 
                 />
                 <div className="bg-lab-blue text-black px-5 py-3 rounded-xl font-mono text-[11px] font-black shadow-[0_0_30px_rgba(59,240,255,0.5)] flex items-center gap-3 italic border border-white/20">
                    <Zap size={14} className="animate-pulse" />
                    <span>BROADCASTING_TX::₹100</span>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Step 2+: New Block Formed */}
           <AnimatePresence>
             {step >= 2 && (
                <motion.div
                    initial={{ scale: 0.7, opacity: 0, x: 100 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="relative"
                >
                    <Block 
                        index={1} 
                        block={{
                            id: 2, 
                            hash: step >= 3 ? "0009c8d..." : "CALC_HASH...", 
                            prevHash: "000a1b2...", 
                            data: "Tx: User A -> User B (₹100)", 
                            status: step >= 6 ? "verified" : "active"
                        }} 
                        simplified={simplified}
                    />
                    
                    {/* Hashing Visual Overlay */}
                    <AnimatePresence>
                      {step === 3 && (
                          <motion.div 
                              key="hashing-overlay"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-lab-purple/20 border-2 border-lab-purple rounded-xl flex flex-col items-center justify-center backdrop-blur-[3px] z-20 shadow-[0_0_30px_rgba(124,107,255,0.3)]"
                          >
                              <div className="flex flex-col items-center gap-3">
                                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                                   <Share2 className="text-lab-purple" size={40} />
                                 </motion.div>
                                 <span className="text-lab-purple font-mono text-[10px] font-black tracking-[0.3em] animate-pulse">GENERATING_HASH_ID</span>
                              </div>
                          </motion.div>
                      )}
                    </AnimatePresence>
                </motion.div>
             )}
           </AnimatePresence>
        </motion.div>

        {/* Global Node Consensus Layer */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div 
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="absolute bottom-10 left-0 right-0 flex justify-center gap-16 z-20"
            >
              {[1, 2, 3].map((n, i) => (
                <div key={n} className="relative group">
                   <motion.div
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ 
                       opacity: 1, 
                       scale: step >= 5 ? 1.05 : 1,
                       borderColor: step >= 5 ? '#00FFA3' : '#1E293B'
                     }}
                     whileHover={{ y: -5, scale: 1.1 }}
                     transition={{ delay: i * 0.1, type: "spring" }}
                     className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-700 backdrop-blur-md ${step >= 5 ? 'bg-lab-green/10 shadow-[0_0_25px_rgba(0,255,163,0.3)]' : 'bg-lab-card/60'}`}
                   >
                     <div className={`p-3 rounded-xl transition-colors duration-500 ${step >= 5 ? 'text-lab-green' : 'text-lab-blue'}`}>
                       {step >= 5 ? <CheckCircle size={32} /> : <Server size={32} />}
                     </div>
                     <span className={`text-[9px] font-black tracking-[0.2em] uppercase transition-colors ${step >= 5 ? 'text-lab-green' : 'text-gray-500'}`}>NODE_00{n}</span>
                     
                     {/* Verification Transmission Beam */}
                     {step === 5 && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 60, opacity: 1 }}
                         className="absolute -top-14 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-t from-lab-green to-transparent"
                       />
                     )}
                   </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Verified Status Banner */}
        <AnimatePresence>
          {step >= 6 && (
               <motion.div
               initial={{ opacity: 0, y: -40, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               className="absolute top-10 flex flex-col items-center gap-2 z-20"
             >
               <div className="bg-lab-green text-black px-10 py-3 rounded-full font-black text-xs tracking-[0.4em] shadow-[0_0_50px_rgba(0,255,163,0.6)] border-2 border-white/20 italic">
                  IMMUTABLE_BLOCK_VERIFIED
               </div>
               <motion.div 
                 animate={{ opacity: [0.4, 1, 0.4] }} 
                 className="text-[10px] text-lab-green font-mono font-bold tracking-widest"
               >
                 NET_CONSENSUS: 100% (3/3 NODES)
               </motion.div>
             </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};
