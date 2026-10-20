
import React from 'react';
/* Added AnimatePresence to framer-motion imports */
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Hash, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { BlockData } from '../../types';

interface BlockProps {
  block: BlockData;
  index: number;
  isTampered?: boolean;
  onTamper?: () => void;
  simplified?: boolean;
}

export const Block: React.FC<BlockProps> = ({ block, index, isTampered, onTamper, simplified }) => {
  const borderColor = block.status === 'tampered' ? 'border-lab-red' :
    block.status === 'verified' ? 'border-lab-green' :
      block.status === 'active' ? 'border-lab-purple' : 'border-lab-blue';

  const glowColor = block.status === 'tampered' ? 'shadow-lab-red/20' :
    block.status === 'verified' ? 'shadow-lab-green/20' :
      block.status === 'active' ? 'shadow-lab-purple/20' : 'shadow-lab-blue/20';

  const textColor = block.status === 'tampered' ? 'text-lab-red' :
    block.status === 'verified' ? 'text-lab-green' : 'text-lab-blue';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.05
      }}
      className={`relative w-64 p-4 rounded-xl border-2 ${borderColor} bg-lab-card/90 backdrop-blur-md shadow-xl ${glowColor} flex flex-col gap-3 cursor-pointer group overflow-hidden`}
      onClick={onTamper}
    >
      {/* Dynamic Scanline Animation - refined opacity */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "200%" }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none z-0"
      />

      {/* Connector Line to Previous - animated width */}
      {index > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 24 }}
          className={`absolute -left-6 top-1/2 h-0.5 z-[-1] ${block.status === 'tampered' ? 'bg-lab-red shadow-[0_0_10px_rgba(255,77,77,0.5)]' : 'bg-gray-600'}`}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-700/50 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-1.5 h-1.5 rounded-full ${block.status === 'verified' ? 'bg-lab-green shadow-[0_0_5px_rgba(0,255,163,0.8)]' : 'bg-lab-purple'}`}
          />
          <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">BLOCK_ID::{block.id.toString().padStart(3, '0')}</span>
        </div>
        <AnimatePresence mode="wait">
          {block.status === 'verified' ? (
            <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Lock size={14} className="text-lab-green" />
            </motion.div>
          ) : block.status === 'tampered' ? (
            <motion.div key="alert" initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -2, 0] }} transition={{ y: { repeat: Infinity, duration: 0.5 } }}>
              <AlertTriangle size={14} className="text-lab-red" />
            </motion.div>
          ) : (
            <motion.div key="unlock" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Unlock size={14} className="text-lab-purple" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Section */}
      <div className="space-y-3 relative z-10">
        <div className="bg-black/40 p-3 rounded-lg border border-gray-800 group-hover:border-gray-600/50 transition-all duration-300">
          <div className="flex justify-between items-center mb-1">
            <label className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Payload_Data</label>
            <div className="text-[8px] text-gray-600 font-mono">UTF-8</div>
          </div>
          <p className={`text-xs font-mono break-all leading-relaxed ${block.status === 'tampered' ? 'text-lab-red font-bold' : 'text-gray-200'}`}>
            {block.data}
          </p>
        </div>

        {!simplified && (
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-black/20 p-2 rounded border border-gray-800/50">
              <label className="text-[8px] uppercase text-gray-500 flex items-center gap-1 font-bold mb-0.5">
                <LinkIcon size={8} /> Previous_Hash
              </label>
              <p className="text-[9px] font-mono text-gray-500 truncate select-none">{block.prevHash}</p>
            </div>

            <div className={`bg-black/20 p-2 rounded border transition-colors duration-500 ${block.status === 'tampered' ? 'border-lab-red/30' : 'border-gray-800/50'}`}>
              <label className={`text-[8px] uppercase flex items-center gap-1 font-bold mb-0.5 ${block.status === 'tampered' ? 'text-lab-red' : 'text-gray-500'}`}>
                <Hash size={8} /> Current_Fingerprint
              </label>
              <p className={`text-[9px] font-mono truncate select-none ${textColor}`}>
                {block.hash}
              </p>
            </div>
          </div>
        )}
      </div>

      {block.status === 'tampered' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0.05, 0.2, 0] }}
          transition={{ repeat: Infinity, duration: 0.15 }}
          className="absolute inset-0 bg-lab-red rounded-xl z-[-1]"
        />
      )}
    </motion.div>
  );
};
