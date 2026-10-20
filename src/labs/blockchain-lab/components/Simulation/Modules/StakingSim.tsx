import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Coins, CheckCircle, AlertCircle } from 'lucide-react';

export const StakingSim: React.FC<{ step: number }> = ({ step }) => {
  const isLocked = step >= 1;
  const isSelected = step >= 2;
  const isRewarding = step >= 4;
  const isSlashing = step === 5;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-12 relative overflow-hidden">
      <div className="relative w-96 h-96">
        {/* Orbital Path with subtle glow */}
        <div className="absolute inset-0 rounded-full border border-gray-800 border-dashed animate-pulse" />
        
        {/* Central Stake */}
        <motion.div 
          animate={isLocked ? { 
            scale: [1, 1.05, 1],
            boxShadow: ['0 0 20px rgba(124,107,255,0.1)', '0 0 40px rgba(124,107,255,0.3)', '0 0 20px rgba(124,107,255,0.1)']
          } : {}}
          transition={{ repeat: Infinity, duration: 4 }}
          whileHover={{ scale: 1.1 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 cursor-help transition-colors duration-500 ${isLocked ? 'border-lab-purple bg-lab-purple/10' : 'border-gray-800 bg-gray-900'} flex flex-col items-center justify-center gap-2 z-20`}
        >
          <Coins size={32} className={isLocked ? 'text-lab-purple' : 'text-gray-700'} />
          <span className="text-[10px] font-bold text-white uppercase">{isLocked ? '32 ETH LOCKED' : 'EMPTY POOL'}</span>
        </motion.div>

        {/* Validators orbiting */}
        {[0, 90, 180, 270].map((deg, i) => {
          const isActive = isSelected && i === 0;
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20 + i * 2, ease: "linear" }}
              style={{ transformOrigin: '0 0' }}
            >
              <motion.div 
                style={{ transform: `translate(160px, -50%) rotate(-${360}deg)` }}
                whileHover={{ scale: 1.2, zIndex: 30 }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center backdrop-blur-md transition-all duration-500 cursor-pointer ${
                  isActive ? 'border-lab-green bg-lab-green/20 shadow-[0_0_20px_rgba(0,255,163,0.4)]' : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <Shield size={24} className={isActive ? 'text-lab-green' : 'text-gray-600'} />
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-lab-green text-black rounded-full p-1"
                  >
                    <CheckCircle size={12} />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-4">
        <StatusCard active={isLocked} label="STAKE STATUS" value={isLocked ? "SECURED" : "PENDING"} color="text-lab-blue" />
        <StatusCard active={isSelected} label="VALIDATOR ROLE" value={isSelected ? "BLOCK PROPOSER" : "IDLE"} color="text-lab-purple" />
        <StatusCard active={isRewarding} label="NETWORK REWARD" value={isRewarding ? "+0.004 ETH" : "N/A"} color="text-lab-green" />
      </div>

      <AnimatePresence>
        {isSlashing && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            className="absolute bottom-10 bg-lab-red/20 border border-lab-red p-4 rounded-xl flex items-center gap-3 text-lab-red shadow-2xl backdrop-blur-lg"
          >
            <AlertCircle size={24} />
            <div className="text-xs">
              <p className="font-bold uppercase tracking-widest">Slashing Protocol Active</p>
              <p className="opacity-80">Malicious behavior detected. Validator stake burned.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusCard = ({ active, label, value, color }: any) => (
  <motion.div 
    whileHover={active ? { y: -5 } : {}}
    className={`p-4 rounded-xl border w-44 transition-all duration-500 ${active ? 'border-gray-700 bg-lab-card shadow-lg' : 'border-gray-800 opacity-20'}`}
  >
    <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 tracking-widest">{label}</div>
    <div className={`font-mono text-xs font-bold ${color}`}>{value}</div>
  </motion.div>
);
