import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Zap, LayoutGrid, Globe, Network } from 'lucide-react';

export const InteropSim: React.FC<{ step: number }> = ({ step }) => {
  const isRouting = step >= 1;
  const isForwarding = step >= 2;
  const isMigrating = step >= 4;
  const isGlobal = step >= 5;

  return (
    <div className="w-full h-full flex items-center justify-center p-8 relative overflow-hidden">
      {/* Central Hub */}
      <div className="relative z-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center gap-2 bg-lab-card ${isRouting ? 'border-lab-blue shadow-[0_0_40px_rgba(59,240,255,0.2)]' : 'border-gray-800'}`}
        >
          <Network size={40} className={isRouting ? 'text-lab-blue' : 'text-gray-700'} />
          <p className="text-[10px] font-bold text-gray-500 uppercase">Hub / Router</p>
        </motion.div>

        {/* Orbiting Chains */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const isActive = isForwarding && (i % 2 === 0);
          return (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-0 h-0"
              style={{ transform: `rotate(${deg}deg) translate(160px)` }}
            >
              <motion.div 
                style={{ transform: `rotate(-${deg}deg)` }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center ${isActive ? 'border-lab-purple bg-lab-purple/10' : 'border-gray-800 bg-gray-900/50'}`}
              >
                <LayoutGrid size={24} className={isActive ? 'text-lab-purple' : 'text-gray-700'} />
                
                {/* Connection Line to Hub */}
                <div className={`absolute top-1/2 left-[-100px] w-[100px] h-0.5 ${isActive ? 'bg-gradient-to-r from-lab-blue to-lab-purple opacity-50' : 'bg-gray-800 opacity-20'}`} style={{ transformOrigin: 'right center' }} />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Packet Animations */}
      {isRouting && (
        <>
          <Packet delay={0} x1={-180} x2={0} y1={-100} y2={0} />
          <Packet delay={1} x1={180} x2={0} y1={100} y2={0} />
          <Packet delay={0.5} x1={-180} x2={0} y1={100} y2={0} />
        </>
      )}

      {isGlobal && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-10 bg-lab-green/10 border border-lab-green p-4 rounded-xl flex items-center gap-3 shadow-2xl"
        >
          <Globe className="text-lab-green" />
          <div className="text-xs">
            <p className="text-lab-green font-bold uppercase tracking-widest">Internet of Blockchains</p>
            <p className="text-gray-400 text-[10px]">Unified communication across disparate networks.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Packet = ({ delay, x1, x2, y1, y2 }: any) => (
  <motion.div
    initial={{ x: x1, y: y1, opacity: 0 }}
    animate={{ x: x2, y: y2, opacity: [0, 1, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, delay }}
    className="absolute w-2 h-2 bg-lab-blue rounded-full shadow-[0_0_10px_rgba(59,240,255,0.8)] z-20"
  />
);
