
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Search, 
  Globe, 
  ShoppingBag, 
  MousePointer2,
  Share2,
  Database,
  Smartphone,
  MapPin,
  Shield,
  ShieldAlert,
  Ghost,
  Lock,
  EyeOff,
  Info,
  X,
  Radio,
  Wifi,
  Activity,
  Terminal
} from 'lucide-react';
import { SimulationStep } from '../types';
import { COLORS } from '../constants';

interface SimulationCanvasProps {
  step: SimulationStep;
  isSimplified: boolean;
  isPlaying: boolean;
}

const TRACKER_DETAILS: Record<string, string[]> = {
  'TRACKER_1': ['IP: 192.168.1.45', 'Chrome v122', 'Timezone: EST', 'OS: Windows 11'],
  'TRACKER_2': ['Interest: CyberSec', 'Visited: Amazon', 'Search: "Best VPN"'],
  'TRACKER_3': ['iPhone 15 Pro', 'Verizon NW', 'Battery: 82%', 'Motion: Static']
};

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ step, isSimplified, isPlaying }) => {
  const [selectedTracker, setSelectedTracker] = useState<string | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(true);

  // Reset local state when step changes
  useEffect(() => {
    setSelectedTracker(null);
  }, [step]);

  const speedMultiplier = isSimplified ? 0.5 : 1;

  return (
    <div className="relative w-full h-[500px] border border-white/10 rounded-2xl bg-[#080C1D] overflow-hidden grid-bg flex items-center justify-center">
      <AnimatePresence mode="wait">
        
        {/* Step 1: User Online */}
        {step === SimulationStep.USER_ONLINE && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="relative">
              <User size={80} color={COLORS.userAction} />
              <motion.div 
                animate={{ 
                  scale: isPlaying ? [1, 1.4, 1] : 1, 
                  opacity: isPlaying ? [0.3, 0.1, 0.3] : 0.2 
                }}
                transition={{ duration: 2 / speedMultiplier, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border-4 border-cyan-400"
              />
            </div>
            <div className="flex gap-8">
              {[Search, Globe, ShoppingBag].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: isPlaying ? [0, -15, 0] : 0 }}
                  transition={{ delay: i * 0.2, repeat: Infinity, duration: 3 / speedMultiplier, ease: "easeInOut" }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 shadow-lg"
                >
                  <Icon size={32} color={COLORS.userAction} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Footprints */}
        {step === SimulationStep.FOOTPRINT_CREATED && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            <User size={64} color={COLORS.userAction} className="mb-4" />
            <div className="grid grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isPlaying ? [0.2, 0.6, 0.2] : 0.4, 
                    y: 0,
                    scale: isPlaying ? [1, 1.1, 1] : 1
                  }}
                  transition={{ delay: n * 0.1, duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center bg-white/5 p-2 rounded-lg border border-white/5"
                >
                  <MousePointer2 size={16} color={COLORS.userAction} />
                  <div className="text-[8px] font-mono mt-1 opacity-50">LOG_{n}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Active vs Passive */}
        {step === SimulationStep.ACTIVE_VS_PASSIVE && (
          <motion.div key="step3" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-12 w-full max-w-lg"
          >
            <div className="flex justify-between w-full px-10">
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono text-cyan-400 mb-2 block tracking-widest">Active (Social)</span>
                <Share2 size={40} color={COLORS.userAction} />
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono text-purple-400 mb-2 block tracking-widest">Passive (Hidden)</span>
                <Ghost size={40} color={COLORS.tracking} />
              </div>
            </div>
            <div className="relative w-full h-32 border-b border-white/10 bg-white/5 rounded-t-2xl overflow-hidden">
              {Array.from({ length: isSimplified ? 3 : 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? { 
                    x: i % 2 === 0 ? [-20, 420] : [420, -20], 
                    opacity: [0, 1, 0] 
                  } : { opacity: 0 }}
                  transition={{ duration: 3 / speedMultiplier, repeat: Infinity, delay: i * 0.6 }}
                  className={`absolute w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${i % 2 === 0 ? 'bg-cyan-400 text-cyan-400' : 'bg-purple-500 text-purple-500'}`}
                  style={{ top: `${(i + 1) * 12}%`, left: i % 2 === 0 ? -20 : 420 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Tracking */}
        {step === SimulationStep.DATA_TRACKING && (
          <motion.div key="step4" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center gap-10"
          >
             <div className="flex gap-20 items-center">
                <User size={64} color={COLORS.userAction} />
                <div className="relative h-1 w-32 bg-white/10 rounded-full">
                  <motion.div 
                    animate={isPlaying ? { x: [0, 120] } : { x: 60 }}
                    transition={{ duration: 1.5 / speedMultiplier, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 -top-1.5 absolute bg-purple-500 rounded-full shadow-[0_0_15px_#7C6BFF]"
                  />
                </div>
                <Database size={64} color={COLORS.tracking} />
             </div>
             <div className="flex gap-4">
                {[1, 2, 3].map(i => {
                  const id = `TRACKER_${i}`;
                  return (
                    <motion.button
                      key={id}
                      onClick={() => setSelectedTracker(selectedTracker === id ? null : id)}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(124,107,255,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 border rounded-xl flex items-center gap-2 text-[10px] font-mono transition-all ${
                        selectedTracker === id 
                          ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_20px_rgba(124,107,255,0.5)]' 
                          : 'bg-purple-900/20 border-purple-500/30 text-purple-300'
                      }`}
                    >
                      <Radio size={12} className={selectedTracker === id && isPlaying ? 'animate-pulse' : ''} /> {id}
                    </motion.button>
                  );
                })}
             </div>

             <AnimatePresence>
               {selectedTracker && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 10 }}
                   className="absolute -bottom-32 w-72 bg-[#0C122B]/95 backdrop-blur-xl border border-purple-500/40 p-4 rounded-xl shadow-2xl z-20"
                 >
                   <div className="flex justify-between items-center mb-3">
                     <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-purple-400" />
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                          Packet Extraction
                        </span>
                     </div>
                     <button onClick={() => setSelectedTracker(null)} className="text-white/40 hover:text-white transition-colors">
                       <X size={14} />
                     </button>
                   </div>
                   <div className="space-y-2 bg-black/40 p-2 rounded border border-white/5">
                     {TRACKER_DETAILS[selectedTracker]?.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between font-mono text-[9px]">
                         <span className="text-white/40">[{idx}]</span>
                         <span className="text-purple-100">{item}</span>
                         <Activity size={10} className="text-purple-500/50" />
                       </div>
                     ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}

        {/* Step 5: Permissions */}
        {step === SimulationStep.PERMISSIONS && (
          <motion.div key="step5" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <Smartphone size={140} color={COLORS.userAction} className="opacity-20" />
              
              <AnimatePresence mode="wait">
                {gpsEnabled ? (
                  <motion.div 
                    key="gps-active"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      animate={isPlaying ? { scale: [0.8, 1.8], opacity: [0.6, 0] } : { scale: 1, opacity: 0.3 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-24 h-24 rounded-full border-2 border-cyan-400/50" />
                    </motion.div>
                    <MapPin size={48} color={COLORS.safe} className="relative z-10 drop-shadow-[0_0_12px_rgba(0,255,163,0.6)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="gps-revoked"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative">
                      <MapPin size={48} className="text-white/10" />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: 60 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 bg-red-500 rotate-45 rounded-full shadow-[0_0_15px_red]" 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={() => setGpsEnabled(!gpsEnabled)}
                className={`group relative px-6 py-3 rounded-2xl font-mono text-[11px] border transition-all flex items-center gap-4 shadow-2xl ${
                  gpsEnabled 
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20' 
                    : 'bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20'
                }`}
              >
                <span className="font-bold tracking-widest">{gpsEnabled ? 'GPS: AUTH' : 'GPS: REVOKED'}</span>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${gpsEnabled ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                  <motion.div 
                    animate={{ x: gpsEnabled ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg" 
                  />
                </div>
              </button>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 text-green-400 border border-green-500/20 rounded-full text-[10px] font-mono">
                  <Wifi size={12} className={isPlaying ? "animate-pulse" : ""} /> NETWORK_BEACON
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/5 text-red-400 border border-red-500/20 rounded-full text-[10px] font-mono">
                  <EyeOff size={12} /> CAMERA_SECURE
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 6: Risk */}
        {step === SimulationStep.PRIVACY_RISK && (
          <motion.div key="step6" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 15 / speedMultiplier, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-12 rounded-full border border-dashed border-red-500/40"
              />
              <motion.div
                animate={isPlaying ? { 
                  boxShadow: [`0 0 20px ${COLORS.risk}`, `0 0 80px ${COLORS.risk}66`, `0 0 20px ${COLORS.risk}`],
                  scale: [1, 1.05, 1]
                } : { scale: 1, boxShadow: `0 0 20px ${COLORS.risk}33` }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="relative z-10 rounded-full p-12 border-2 border-red-500 bg-red-950/20"
              >
                <User size={80} color={COLORS.risk} />
                <motion.div 
                  animate={isPlaying ? { y: [-10, 10], opacity: [0, 1, 0] } : { opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-6 -right-6"
                >
                  <EyeOff size={28} className="text-red-400" />
                </motion.div>
              </motion.div>
              <motion.div 
                animate={isPlaying ? { scale: [1, 3], opacity: [0.3, 0] } : { opacity: 0 }}
                transition={{ duration: 3 / speedMultiplier, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-red-500/30"
              />
            </div>
            <div className="mt-20 text-center space-y-2">
              <motion.p 
                animate={isPlaying ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl font-black font-mono tracking-tighter text-red-500 uppercase"
              >
                VULNERABILITY_CRITICAL
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Step 7: Misuse */}
        {step === SimulationStep.DATA_MISUSE && (
          <motion.div key="step7" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-24 items-center"
          >
            <div className="relative opacity-20 flex flex-col items-center">
               <User size={120} color={COLORS.text} />
               <p className="text-[10px] text-center mt-4 font-mono text-white/50 uppercase">Original ID</p>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="relative">
                <User size={120} color={COLORS.risk} />
                <motion.div 
                  className="absolute inset-0"
                  animate={isPlaying ? { 
                    opacity: [0, 1, 0], 
                    x: [-4, 4, -4],
                    skewX: [-5, 5, -5]
                  } : { opacity: 0 }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                >
                  <User size={120} color="#ff0000" className="opacity-60" />
                </motion.div>
              </div>
              <p className="text-[10px] text-center mt-4 font-mono font-bold text-red-500 uppercase">Impersonation Breach</p>
            </div>
          </motion.div>
        )}

        {/* Step 8: Defense */}
        {step === SimulationStep.DEFENSE_ACTIVATION && (
          <motion.div key="step8" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative">
              <User size={90} color={COLORS.safe} />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                className="absolute -inset-16 border-[4px] border-green-400 rounded-full flex items-center justify-center bg-green-400/5 shadow-[0_0_40px_rgba(0,255,163,0.3)]"
              >
                <Shield size={200} color={COLORS.safe} className="opacity-10 absolute" />
              </motion.div>
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 -m-16 pointer-events-none"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#00FFA3]" />
                </motion.div>
              ))}
            </div>
            <div className="mt-24 grid grid-cols-3 gap-6">
              {['2FA_ENABLED', 'VPN_ENCRYPTED', 'GPC_ACTIVE'].map(t => (
                 <div key={t} className="px-5 py-2.5 border border-green-500/30 bg-green-500/10 rounded-xl text-[10px] text-green-300 font-mono font-bold tracking-widest text-center">
                    {t}
                 </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Status */}
      <div className="absolute top-6 left-6 flex gap-3 z-10">
        <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full font-mono text-[10px] flex items-center gap-2 text-white/80">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`} />
          {isPlaying ? 'SIM_LIVE' : 'SIM_PAUSED'}
        </div>
      </div>
      
      {/* Help Overlay */}
      <div className="absolute bottom-6 left-6 text-[10px] text-white/20 font-mono uppercase tracking-widest flex items-center gap-4">
        {!isSimplified && (
          <>
            {step === SimulationStep.DATA_TRACKING && <span>Click trackers to analyze data packets</span>}
            {step === SimulationStep.PERMISSIONS && <span>Toggle GPS to observe sensor feedback</span>}
            {step === SimulationStep.USER_ONLINE && <span>Toggle playback to start simulation</span>}
          </>
        )}
      </div>
    </div>
  );
};
