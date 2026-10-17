
import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { ModuleId, SimStatus } from './types';
import { MODULES, SAFETY_RULES, DID_YOU_KNOW, COLORS } from './constants';
import SimulationEngine from './components/SimulationEngine';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X } from 'lucide-react';

const motion = motionBase as any;

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>(ModuleId.WHAT_IS_FINTECH);
  const [simStatus, setSimStatus] = useState<SimStatus>('playing');
  const [simplified, setSimplified] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [didYouKnowIndex, setDidYouKnowIndex] = useState(0);

  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setDidYouKnowIndex(prev => (prev + 1) % DID_YOU_KNOW.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (activeModuleId < MODULES.length) {
      setActiveModuleId(activeModuleId + 1);
      setSimStatus('playing');
    }
  };

  const handlePrev = () => {
    if (activeModuleId > 1) {
      setActiveModuleId(activeModuleId - 1);
      setSimStatus('playing');
    }
  };

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title={activeModule.title}
          description={activeModule.description}
          badges={[
            <MobileBadge variant="cyan" key="b1">FINTECH_DISCOVERY</MobileBadge>,
            simStatus === 'playing' ? <MobileBadge variant="green" key="b2">ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-[400px] w-full p-4">
              <SimulationEngine moduleId={activeModuleId} status={simStatus} simplified={simplified} />
            </div>
          }
          controls={
            <MobileControlGroup
              onPlay={() => setSimStatus(simStatus === 'playing' ? 'paused' : 'playing')}
              onReset={() => setSimStatus('playing')}
              onNext={handleNext}
              onPrev={handlePrev}
              isPlaying={simStatus === 'playing'}
            />
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-cyan-400">Did You Know?</h4>
              <p className="text-sm">{DID_YOU_KNOW[didYouKnowIndex]}</p>
              {SAFETY_RULES.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-bold mb-1 uppercase text-xs text-green-400">Safety Tips</h4>
                  <ul className="text-xs space-y-1">
                    {SAFETY_RULES.slice(0, 3).map((rule, idx) => (
                      <li key={idx} className="text-slate-400">• {rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={() => {
            if (onClose) {
              onClose();
              return;
            }
            const referrer = document.referrer;
            const currentOrigin = window.location.origin;
            if (referrer && referrer.startsWith(currentOrigin) && window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/';
            }
          }}
          headerStyle="brand-center"
          headerTitle="FINTECH"
        />

        {/* Sidebar Portal for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 z-[90] shadow-2xl bg-[#070B1A] border-r border-white/10 flex flex-col p-6"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold">Fintech Modules</h2>
                  <p className="text-xs text-slate-400">Explore digital finance</p>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {MODULES.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        setActiveModuleId(module.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${activeModuleId === module.id
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                        }`}
                      style={{ borderLeftColor: module.color, borderLeftWidth: activeModuleId === module.id ? '3px' : '0' }}
                    >
                      <div className="text-sm font-bold">{module.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{module.description}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setSimplified(!simplified)}
                    className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {simplified ? 'Full Mode' : 'Simplified Mode'}
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex relative flex-row h-screen w-full bg-[#070B1A] overflow-hidden animated-grid p-6 gap-6">
        {/* Secondary slow-moving color glow overlay */}
        <div
          className="color-glow-overlay"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeModule.color}, transparent 70%)`
          }}
        />

        {/* Left Panel: Modules */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4 relative z-10">
          <div className="glass-card p-6 border-blue-500/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              FINTECH LAB
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Digital Finance Explorer</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${activeModuleId === mod.id
                  ? 'bg-white/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${activeModuleId === mod.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                    {mod.id}
                  </span>
                  <span className={`text-sm font-medium ${activeModuleId === mod.id ? 'text-white' : 'text-gray-400'}`}>
                    {mod.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-all uppercase text-xs font-bold tracking-widest flex items-center justify-center gap-2 mt-auto"
          >
            <X size={14} /> Exit Lab
          </button>
        </div>

        {/* Center Panel: Simulation Area */}
        <div className="flex-1 h-full min-w-0 relative z-10">
          <div className="glass-card relative flex flex-col p-8 h-full min-h-[500px] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  {activeModule.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">{activeModule.description}</p>
              </div>
              {activeModule.statusText && (
                <div className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-tight ${activeModule.statusType === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                  activeModule.statusType === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                  ● {activeModule.statusText}
                </div>
              )}
            </div>

            <div className="flex-1">
              <SimulationEngine
                moduleId={activeModuleId}
                status={simStatus}
                simplified={simplified}
              />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setSimStatus(simStatus === 'playing' ? 'paused' : 'playing')}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${simStatus === 'playing' ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-400'
                  }`}
              >
                {simStatus === 'playing' ? '⏸' : '▶️'}
              </button>
              <button
                onClick={() => setSimStatus('reset')}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-all"
              >
                🔄
              </button>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center max-w-md mx-8">
              <button onClick={handlePrev} disabled={activeModuleId === 1} className="text-gray-500 hover:text-white disabled:opacity-30">←</button>
              <div className="flex gap-1 flex-1">
                {MODULES.map((m) => (
                  <div
                    key={m.id}
                    className={`h-1.5 flex-1 rounded-full transition-all ${m.id <= activeModuleId ? 'bg-blue-500' : 'bg-white/10'
                      }`}
                  />
                ))}
              </div>
              <button onClick={handleNext} disabled={activeModuleId === MODULES.length} className="text-gray-500 hover:text-white disabled:opacity-30">→</button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Simplified</span>
              <button
                onClick={() => setSimplified(!simplified)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${simplified ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${simplified ? 'left-7' : 'left-1'
                  }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Rules & Facts */}
        <div className="w-1/4 flex flex-col gap-4 relative z-10">
          <div className="glass-card p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">💡</span>
              <h3 className="font-bold uppercase tracking-widest text-sm">FinTech Safety Rules</h3>
            </div>
            <ul className="space-y-4">
              {SAFETY_RULES.map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-400 leading-relaxed group">
                  <span className="text-blue-500 font-mono font-bold">{idx + 1}.</span>
                  <span className="group-hover:text-white transition-colors">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6 h-40 flex flex-col justify-between border-green-500/20 bg-green-500/[0.02]">
            <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              Did You Know?
            </div>
            <p className="text-sm text-gray-300 leading-snug transition-opacity duration-500" key={didYouKnowIndex}>
              "{DID_YOU_KNOW[didYouKnowIndex]}"
            </p>
          </div>

          <div className="glass-card p-6 bg-blue-500/10 border-blue-500/20">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Learning Goal</h4>
            <div className="text-xs text-gray-400 leading-relaxed">
              Mastering Module {activeModuleId}: {activeModule.title}.
              {activeModuleId === 10 ? " Lab Complete! You are a FinTech Smart User." : " Keep exploring to unlock more skills."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
