import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Block } from '../Block';
import { BlockData } from '../../../types';
import { AlertOctagon, RefreshCw, Terminal, Zap, ShieldAlert, Skull, Activity, ShieldX } from 'lucide-react';

export const AttackSim: React.FC = () => {
  const [chain, setChain] = useState<BlockData[]>([
    { id: 1, hash: "abc111", prevHash: "000000", data: "Genesis", status: "verified" },
    { id: 2, hash: "def222", prevHash: "abc111", data: "Tx: User A -> B (₹100)", status: "verified" },
    { id: 3, hash: "ghi333", prevHash: "def222", data: "Tx: User C -> A (₹50)", status: "verified" },
  ]);

  const [attacked, setAttacked] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Network secure.", "[SYSTEM] Watching for intrusions..."]);
  const [threatLevel, setThreatLevel] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (attacked) {
      const interval = setInterval(() => {
        setThreatLevel(prev => Math.min(prev + 5, 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setThreatLevel(0);
    }
  }, [attacked]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const handleTamper = () => {
    if (attacked) return;
    setAttacked(true);

    addLog("WARNING: Unauthorized access to Block #2.");
    addLog("CRITICAL: Hash collision detected.");
    addLog("ALARM: Chain integrity compromised.");

    const newChain = [...chain];
    newChain[1] = {
      ...newChain[1],
      data: "Tx: User A -> HACKER (₹99,999)",
      hash: "FATAL_ERR_09",
      status: "tampered"
    };

    newChain[2] = {
      ...newChain[2],
      status: "tampered"
    };

    setChain(newChain);
  };

  const reset = () => {
    setAttacked(false);
    setLogs(["[SYSTEM] Chain restored.", "[SYSTEM] Network secure."]);
    setChain([
      { id: 1, hash: "abc111", prevHash: "000000", data: "Genesis", status: "verified" },
      { id: 2, hash: "def222", prevHash: "abc111", data: "Tx: User A -> B (₹100)", status: "verified" },
      { id: 3, hash: "ghi333", prevHash: "def222", data: "Tx: User C -> A (₹50)", status: "verified" },
    ]);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Intensified Glitch Overlay */}
      <AnimatePresence>
        {attacked && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: [0, 0.1, 0.05, 0.15, 0] }} exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="absolute inset-0 bg-lab-red pointer-events-none z-0 mix-blend-overlay"
            />
            <motion.div
              initial={{ x: -100 }} animate={{ x: 100 }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute top-1/4 w-full h-px bg-lab-red opacity-20 z-0"
            />
          </>
        )}
      </AnimatePresence>

      {/* Threat Level UI */}
      <div className="absolute top-12 left-12 w-48 space-y-2 z-20">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-gray-500 uppercase">Threat Level</span>
          <span className={`text-xs font-mono font-bold ${attacked ? 'text-lab-red' : 'text-lab-blue'}`}>
            {threatLevel}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <motion.div
            animate={{ width: `${threatLevel}%`, backgroundColor: attacked ? '#FF4D4D' : '#3BF0FF' }}
            className="h-full shadow-[0_0_10px_rgba(255,77,77,0.5)]"
          />
        </div>
      </div>

      {!attacked && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 bg-lab-blue/5 border border-lab-blue/20 text-lab-blue px-6 py-3 rounded-2xl text-[10px] font-bold tracking-[0.2em] flex items-center gap-3 animate-pulse uppercase cursor-default select-none"
        >
          <Activity size={14} className="text-lab-blue" /> Intercept Block #002 to modify data
        </motion.div>
      )}

      {attacked && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 flex flex-col items-center gap-4 z-10"
        >
          <div className="bg-lab-red text-black font-black px-8 py-3 rounded-xl shadow-[0_0_40px_rgba(255,77,77,0.6)] flex items-center gap-3 uppercase tracking-widest text-sm italic">
            <ShieldAlert size={20} className="animate-bounce" />
            CRITICAL SYSTEM ALERT
          </div>
          <div className="flex gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}
              className="bg-black/60 backdrop-blur-md text-lab-red border border-lab-red/50 px-4 py-1.5 rounded-full text-[10px] font-mono flex items-center gap-2"
            >
              <ShieldX size={12} /> NETWORK_REJECTION: ACTIVE
            </motion.div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-12 relative z-10 scale-110">
        {chain.map((block, idx) => (
          <div key={block.id} className="relative">
            <Block
              index={idx}
              block={block}
              onTamper={idx === 1 ? handleTamper : undefined}
              simplified={false}
            />
            <AnimatePresence>
              {attacked && idx > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-4 -right-4 bg-lab-red text-white p-1 rounded-full border border-white/20 z-20 shadow-lg"
                >
                  <Skull size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Security Console Output */}
      <div className="absolute bottom-12 left-12 w-80 bg-black/80 border border-gray-800 rounded-xl p-4 backdrop-blur-md shadow-2xl">
        <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-gray-500" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Security_Kernel</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-lab-red animate-pulse" />
        </div>
        <div className="space-y-1 font-mono text-[10px]">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('WARNING') || log.includes('CRITICAL') || log.includes('ALARM') ? 'text-lab-red font-bold' : 'text-gray-500'}>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {attacked && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="absolute bottom-12 right-12 bg-gray-900/90 hover:bg-lab-blue/10 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all border border-gray-800 hover:border-lab-blue/50 font-bold text-xs uppercase tracking-widest group shadow-2xl"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" /> Rebuild Chain
        </motion.button>
      )}
    </div>
  );
};
