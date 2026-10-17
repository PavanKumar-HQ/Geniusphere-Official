
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Lock, Unlock, Award, Cpu, Code2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SmartContractSimProps {
    step?: number; 
}

export const SmartContractSim: React.FC<SmartContractSimProps> = ({ step = 0 }) => {
  const isDeployed = step >= 1;
  const isTriggered = step >= 2;
  const isProcessing = step === 3;
  const isSuccess = step >= 4;
  const isComplete = step >= 5;

  const codeLines = [
    { text: "PRAGMA SOLIDITY ^0.8.0;", color: "text-gray-500" },
    { text: "CONTRACT PAYMENT_GATEWAY {", color: "text-lab-purple" },
    { text: "  FUNCTION EXECUTE(AMOUNT) {", color: "text-lab-blue" },
    { text: "    IF (AMOUNT == 500) {", color: isTriggered ? "text-lab-green font-bold" : "text-white" },
    { text: "      RELEASE_ASSET();", color: isSuccess ? "text-lab-green font-bold" : "text-white" },
    { text: "    }", color: "text-white" },
    { text: "  }", color: "text-lab-blue" },
    { text: "}", color: "text-lab-purple" },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8 gap-12 relative overflow-hidden">
      
      {/* Contract Visual */}
      <motion.div 
        animate={isProcessing ? { 
          scale: [1, 1.02, 1], 
          borderColor: ['#1f2937', '#7C6BFF', '#1f2937'],
          boxShadow: ['0 0 20px rgba(124,107,255,0)', '0 0 40px rgba(124,107,255,0.2)', '0 0 20px rgba(124,107,255,0)']
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`w-80 h-[400px] bg-lab-card border-2 rounded-2xl p-6 relative flex flex-col shadow-2xl transition-colors duration-500 ${isSuccess ? 'border-lab-green/50' : isDeployed ? 'border-lab-purple/50' : 'border-gray-800'}`}
      >
        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <motion.div animate={isDeployed ? { rotate: [0, 10, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 3 }}>
              <FileCode size={18} className="text-lab-purple" />
            </motion.div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Logic_Core_v1.0</span>
          </div>
          {isSuccess ? <Lock size={14} className="text-lab-green" /> : <Unlock size={14} className="text-gray-600" />}
        </div>

        <div className="flex-1 font-mono text-[11px] space-y-1 relative overflow-hidden">
           {codeLines.map((line, i) => (
             <motion.div 
              key={`${i}-${line.text}`}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.05 }}
              className={`${line.color} transition-colors duration-300`}
             >
               {line.text}
             </motion.div>
           ))}
           
           {/* Scanning Line Animation */}
           <AnimatePresence>
             {isProcessing && (
               <motion.div 
                 initial={{ top: "-10%" }}
                 animate={{ top: '110%' }}
                 exit={{ opacity: 0 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lab-blue/60 to-transparent shadow-[0_0_15px_rgba(59,240,255,0.6)] z-20 pointer-events-none"
               />
             )}
           </AnimatePresence>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
           <div className="text-[10px] text-gray-500 uppercase font-bold">Status:</div>
           <motion.div 
            animate={isProcessing ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-500 ${
              isSuccess ? 'bg-lab-green/10 text-lab-green' : 
              isProcessing ? 'bg-lab-blue/10 text-lab-blue' : 
              isDeployed ? 'bg-lab-purple/10 text-lab-purple' : 'bg-gray-800 text-gray-500'
            }`}
           >
             {isSuccess ? 'Executed' : isProcessing ? 'Verifying' : isDeployed ? 'Listening' : 'Idle'}
           </motion.div>
        </div>
      </motion.div>

      {/* Input/Output Side */}
      <div className="flex flex-col gap-6 w-64">
        
        {/* Input Trigger with hover effect */}
        <motion.div 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(59,240,255,0.05)" }}
          className={`p-4 rounded-xl border transition-all duration-500 ${isTriggered ? 'border-lab-blue bg-lab-blue/5' : 'border-gray-800 opacity-40'}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Cpu size={20} className={isTriggered ? 'text-lab-blue' : 'text-gray-600'} />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Input Trigger</span>
          </div>
          <p className="text-sm font-mono text-white">AMOUNT: ₹500</p>
          {isTriggered && (
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: '100%' }} 
              className="h-1 bg-lab-blue mt-2 rounded-full shadow-[0_0_5px_rgba(59,240,255,0.5)]" 
            />
          )}
        </motion.div>

        {/* Action / Result with better entry animation */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ x: 30, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              className="p-4 rounded-xl border border-lab-green bg-lab-green/5 flex flex-col gap-3 shadow-[0_0_30px_rgba(0,255,163,0.15)] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                 <motion.div 
                   animate={{ rotateY: [0, 360] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="p-2 bg-lab-green rounded-lg text-black shadow-[0_0_10px_rgba(0,255,163,0.4)]"
                 >
                    <Award size={20} />
                 </motion.div>
                 <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tighter">Asset Released</h4>
                    <p className="text-[10px] text-lab-green font-mono">ID: 0x_VALID_TOKEN</p>
                 </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">Automated execution complete. Verify proof on-chain.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Information Callout */}
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 group">
           <div className="flex items-center gap-2 text-lab-purple mb-2">
              <Code2 size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Self-Execution</span>
           </div>
           <p className="text-[11px] text-gray-500 leading-relaxed">Unlike traditional contracts, Smart Contracts do not require a lawyer. The network code automatically enforces the rules based on binary logic.</p>
        </div>
      </div>

      {/* Connection Beam - animated particle */}
      {isTriggered && !isSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-[340px] top-1/2 -translate-y-1/2 w-20 h-0.5 bg-gradient-to-r from-lab-blue/40 to-lab-purple/40"
        >
          <motion.div 
            animate={{ x: [-10, 90] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-2 h-2 bg-lab-blue rounded-full -top-1 absolute shadow-[0_0_12px_rgba(59,240,255,1)]"
          />
        </motion.div>
      )}
    </div>
  );
};
