import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleType } from '../../../types';
import { Box, Share2, Layers, Cpu, CloudLightning, Activity } from 'lucide-react';

export const GenericVisualSim: React.FC<{ activeModule: ModuleType, step: number }> = ({ activeModule, step }) => {
  const icons: any = {
    [ModuleType.DEFI]: <Activity />,
    [ModuleType.ZKP]: <Layers />,
    [ModuleType.GAS]: <CloudLightning />,
    [ModuleType.ORACLES]: <Share2 />,
  };

  const getIcon = () => icons[activeModule] || <Box />;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden p-8">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         {Array.from({ length: 15 }).map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-lab-blue rounded-full"
               animate={{
                 x: [Math.random() * 800, Math.random() * 800],
                 y: [Math.random() * 500, Math.random() * 500],
                 opacity: [0, 1, 0]
               }}
               transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
             />
         ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        <motion.div 
           animate={{ 
             scale: [1, 1.05, 1],
             rotate: [0, 1, -1, 0]
           }}
           transition={{ repeat: Infinity, duration: 8 }}
           className="w-48 h-48 bg-lab-purple/5 border-2 border-lab-purple/20 rounded-[40px] flex items-center justify-center text-lab-purple shadow-[0_0_50px_rgba(124,107,255,0.1)] relative"
        >
          <div className="text-lab-purple scale-[2.5]">{getIcon()}</div>
          
          {/* Orbital Nodes */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-lab-card border border-lab-blue rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10 + i * 2, ease: "linear" }}
              style={{ top: 'calc(50% - 8px)', left: 'calc(50% - 8px)', transformOrigin: `${80 + i * 20}px 50%` }}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
           {Array.from({ length: 4 }).map((_, i) => (
             <motion.div
               key={i}
               animate={step > i ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.2 }}
               className={`p-4 rounded-2xl border ${step > i ? 'border-lab-blue bg-lab-blue/5' : 'border-gray-800'}`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step > i ? 'bg-lab-blue text-black' : 'bg-gray-800 text-gray-500'}`}>
                   {i + 1}
                 </div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">PHASE_{i+1}_SYNC</div>
               </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};
