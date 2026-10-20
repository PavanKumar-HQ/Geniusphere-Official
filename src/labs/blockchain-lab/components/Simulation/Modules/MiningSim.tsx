import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pickaxe, Cpu, Zap, Hash } from 'lucide-react';

export const MiningSim: React.FC<{ step: number }> = ({ step }) => {
  const [nonce, setNonce] = useState(0);
  const isMining = step === 3;
  const isFound = step >= 4;

  useEffect(() => {
    let interval: any;
    if (isMining) {
      interval = setInterval(() => {
        setNonce(prev => prev + Math.floor(Math.random() * 1000));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isMining]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-8">
      <div className="flex items-center gap-12">
        <motion.div 
          animate={isMining ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className={`p-6 rounded-2xl border-2 ${isFound ? 'border-lab-green shadow-lab-green/20' : 'border-lab-purple shadow-lab-purple/20'} bg-lab-card flex flex-col items-center gap-4`}
        >
          <Pickaxe size={48} className={isFound ? 'text-lab-green' : 'text-lab-purple'} />
          <div className="text-center font-mono">
            <div className="text-xs text-gray-500 uppercase">Difficulty: 0000</div>
            <div className={`text-xl font-bold ${isFound ? 'text-lab-green' : 'text-white'}`}>
              {isFound ? 'TARGET_MET' : 'FINDING_NONCE'}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 w-64">
          <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Nonce</label>
            <div className="font-mono text-xl text-lab-blue tracking-wider">
              {nonce.toLocaleString()}
            </div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
            <label className="text-[10px] text-gray-500 uppercase block mb-1">Hash Output</label>
            <div className="font-mono text-xs text-gray-400 break-all leading-relaxed">
              {isFound ? '0000' : 'A4F2'}{Math.random().toString(36).substring(7).toUpperCase()}...
            </div>
          </div>
        </div>
      </div>

      {isFound && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="flex items-center gap-2 bg-lab-green/10 border border-lab-green px-6 py-2 rounded-full text-lab-green font-bold text-sm"
        >
          <Zap size={16} fill="currentColor" /> BLOCK REWARD: 6.25 BTC UNLOCKED
        </motion.div>
      )}
    </div>
  );
};
