import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleType } from './types';
import { MODULES, EDUCATIONAL_CONTENT } from './constants';
import { SimulationStage } from './components/SimulationStage';
import {
  Play, RotateCcw, Zap, Info, ChevronRight,
  ShieldCheck, BookOpen, X,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen
} from 'lucide-react';

import { Badge } from './components/ui/Badge';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

function App({ onClose, onExit }: { onClose?: () => void; onExit?: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.BASICS);
  const [step, setStep] = useState(0);
  const [simplified, setSimplified] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<ModuleType>>(new Set());

  // Navigation / Panel UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isDesktopInfoOpen, setIsDesktopInfoOpen] = useState(true);

  const content = EDUCATIONAL_CONTENT[activeModule];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && content.maxSteps > 0) {
      interval = setInterval(() => {
        setStep((prev) => {
          if (prev >= content.maxSteps) {
            setIsPlaying(false);
            setCompletedModules(prevSet => new Set(prevSet).add(activeModule));
            return prev;
          }
          return prev + 1;
        });
      }, 2800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeModule, content.maxSteps]);

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const handlePlay = () => {
    if (step >= content.maxSteps) setStep(0);
    setIsPlaying(true);
  };

  const handleExit = () => {
    const exitFn = onClose || onExit;
    if (exitFn) {
      exitFn();
      return;
    }
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;
    if (referrer && referrer.startsWith(currentOrigin) && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-lab-card">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3 text-lab-blue shrink-0">
        <ShieldCheck size={24} />
        <h1 className="font-black tracking-[0.2em] text-lg italic">TRUSTLINK</h1>
        <button className="lg:hidden ml-auto p-1.5 text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Lab Modules</p>
          <span className="text-[10px] text-lab-blue font-mono font-bold">{completedModules.size}/{MODULES.length}</span>
        </div>

        {MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              setActiveModule(mod.id);
              handleReset();
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between group border shrink-0 ${activeModule === mod.id
              ? 'bg-lab-purple/20 text-lab-purple border-lab-purple/50 shadow-[0_0_15px_rgba(124,107,255,0.15)] font-bold'
              : 'hover:bg-gray-800/40 text-gray-400 hover:text-white border-transparent'
              }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {completedModules.has(mod.id) ? (
                <div className="w-2 h-2 rounded-full bg-lab-green shadow-[0_0_8px_rgba(0,255,163,0.5)] shrink-0" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-700 shrink-0" />
              )}
              <span className="truncate tracking-tight">{mod.label}</span>
            </div>
            {activeModule === mod.id && (
              <ChevronRight size={14} className="shrink-0" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800 shrink-0 bg-black/30">
        <div className="bg-gray-900/80 p-3 rounded-xl mb-3 border border-gray-800">
          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><BookOpen size={12} /> Mastery</div>
            <span className="text-lab-blue font-mono font-bold">{Math.round((completedModules.size / MODULES.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedModules.size / MODULES.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-lab-blue to-lab-purple"
            />
          </div>
        </div>
        <button
          onClick={() => {
            setCompletedModules(new Set(MODULES.map(m => m.id)));
          }}
          className="w-full bg-lab-purple/15 hover:bg-lab-purple/25 text-lab-purple hover:text-white py-2.5 rounded-xl text-[10px] transition-all font-black uppercase tracking-[0.15em] border border-lab-purple/30"
        >
          Finalize Certification
        </button>
        <button
          onClick={handleExit}
          className="mt-2 w-full flex items-center justify-center gap-1.5 text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-widest transition-colors py-1.5 hover:bg-red-500/10 rounded-lg"
        >
          <X size={13} /> Exit Lab
        </button>
      </div>
    </div>
  );

  const InfoPanelContent = () => (
    <div className="flex flex-col h-full bg-lab-card">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="text-lab-blue font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={14} /> Knowledge Base
        </h3>
        <button onClick={() => { setIsInfoOpen(false); setIsDesktopInfoOpen(false); }} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="bg-gray-900/70 p-3 rounded-xl border border-gray-800 flex items-center justify-between shrink-0 shadow-lg">
          <div className="flex items-center gap-2 text-lab-blue font-black text-[10px] tracking-widest uppercase">
            <Zap size={14} /> Visual Fidelity
          </div>
          <button
            onClick={() => setSimplified(!simplified)}
            className={`w-11 h-6 rounded-full p-1 transition-all ${simplified ? 'bg-lab-purple' : 'bg-gray-700'}`}
            title="Toggle Visual Complexity"
          >
            <motion.div
              layout
              className="w-4 h-4 bg-white rounded-full shadow-lg"
              animate={{ x: simplified ? 20 : 0 }}
            />
          </button>
        </div>

        <div className="space-y-5">
          <section>
            <h3 className="text-lab-green font-black text-[10px] mb-3 uppercase tracking-[0.25em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-lab-green animate-pulse" /> Concept_Node
            </h3>
            <ul className="space-y-4">
              {content.keyConcepts.map((concept, index) => (
                <motion.li
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  key={index}
                  className="relative pl-3.5 border-l-2 border-lab-green/20 hover:border-lab-green/60 transition-colors"
                >
                  <strong className="text-white block text-xs mb-1 font-black tracking-tight uppercase italic">{concept.title}</strong>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-normal">{concept.description}</p>
                </motion.li>
              ))}
            </ul>
          </section>

          <section className="bg-lab-blue/5 border border-lab-blue/20 p-3.5 rounded-xl relative shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-lab-blue">
              <Info size={14} className="shrink-0" />
              <h4 className="font-black text-[10px] uppercase tracking-[0.25em]">Encrypted_Insight</h4>
            </div>
            <p className="text-xs text-gray-300 italic leading-relaxed font-medium">
              "{content.didYouKnow}"
            </p>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View - Standardized Layout (Vertical Stack) */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title={content.title}
          description={
            <>
              <p>{content.title} Concept</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono">BLOCK_T::PH_{step + 1} // {simplified ? 'LITE' : 'FULL'}</div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-lab-blue font-black italic">
              <ShieldCheck size={20} />
              <span className="text-sm tracking-widest">TRUSTLINK</span>
            </div>
          }
          badges={[
            <MobileBadge variant="purple" key="b1">MOD: {activeModule}</MobileBadge>,
            isPlaying ? <MobileBadge variant="green" key="b2">SIM_ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-2">
              <SimulationStage activeModule={activeModule} step={step} simplified={simplified} />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <MobileControlGroup
                onPlay={isPlaying ? () => setIsPlaying(false) : handlePlay}
                onReset={handleReset}
                onNext={() => {
                  if (step < content.maxSteps) setStep(step + 1);
                }}
                onPrev={() => {
                  if (step > 0) setStep(step - 1);
                }}
                isPlaying={isPlaying}
              />
              <div className="flex justify-center">
                <button onClick={() => setSimplified(!simplified)} className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  {simplified ? 'Enable High Fidelity' : 'Switch to Performance Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-lab-blue">Phase Update</h4>
              <p className="text-sm">{content.steps[Math.min(step, content.steps.length - 1)]}</p>
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={handleExit}
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
                className="fixed left-0 top-0 h-full w-80 z-[90] shadow-2xl"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View (Only Visible on Large Screens) */}
      <div className="hidden lg:flex flex-row h-full min-h-[680px] w-full bg-lab-bg text-lab-text font-sans overflow-hidden">

        {/* Desktop Sidebar */}
        {isDesktopSidebarOpen && (
          <aside className="w-72 flex-col z-20 h-full border-r border-gray-800 shadow-2xl shrink-0 flex transition-all">
            <SidebarContent />
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">

          {/* Header */}
          <header className="px-6 py-4 shrink-0 border-b border-gray-800/80 bg-lab-bg/90 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsDesktopSidebarOpen(prev => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isDesktopSidebarOpen
                      ? 'bg-gray-800/80 text-white border-gray-700'
                      : 'bg-lab-purple/15 text-lab-purple border-lab-purple/30 hover:bg-lab-purple/25'
                  }`}
                  title="Toggle Modules Sidebar"
                >
                  {isDesktopSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
                  <span>Modules ({MODULES.length})</span>
                </button>
                <Badge variant="purple">MOD: {activeModule}</Badge>
                {isPlaying && <Badge variant="green" className="animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.3)]">SIM_ACTIVE</Badge>}
                {completedModules.has(activeModule) && <Badge variant="green" className="border-lab-green/50 hidden sm:inline-flex">MASTERED</Badge>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDesktopInfoOpen(prev => !prev)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isDesktopInfoOpen
                      ? 'bg-gray-800/80 text-white border-gray-700'
                      : 'bg-lab-blue/15 text-lab-blue border-lab-blue/30 hover:bg-lab-blue/25'
                  }`}
                  title="Toggle Knowledge Base"
                >
                  {isDesktopInfoOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
                  <span>Knowledge Base</span>
                </button>
                <button
                  onClick={handleExit}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 transition-all"
                  title="Exit Lab"
                >
                  <X size={14} />
                  <span>Exit Lab</span>
                </button>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight italic leading-tight">
                {content.title.toUpperCase()}
              </h2>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-3xl">
                Comprehensive guide through the technical foundations of decentralized systems.
              </p>
            </div>
          </header>

          {/* Simulation Area */}
          <section className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto min-h-0">

            <div className="flex-1 min-h-[380px] flex flex-col">
              <SimulationStage activeModule={activeModule} step={step} simplified={simplified} />
            </div>

            {/* Controls */}
            <div className="bg-lab-card/90 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 gap-4 shadow-2xl shrink-0 ring-1 ring-white/5">
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-all border border-transparent hover:border-gray-700 active:scale-95"
                  title="Reset Simulation"
                >
                  <RotateCcw size={18} />
                </button>

                {content.maxSteps > 0 && (
                  <button
                    onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                    className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-black text-xs tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-2xl ${isPlaying
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'bg-lab-purple text-white shadow-[0_0_25px_rgba(124,107,255,0.4)] hover:bg-lab-purple/90 border border-white/10'
                      }`}
                  >
                    <Play size={16} fill={isPlaying ? "none" : "currentColor"} />
                    {isPlaying ? 'PAUSE' : 'START'}
                  </button>
                )}
              </div>

              {/* Progress Indicators */}
              {content.maxSteps > 0 && (
                <div className="flex items-center gap-2.5 overflow-x-auto w-auto justify-center py-1">
                  {Array.from({ length: content.maxSteps + 1 }).map((_, s) => (
                    <motion.div
                      key={s}
                      initial={false}
                      animate={{
                        width: s <= step ? 36 : 8,
                        backgroundColor: s <= step ? '#3BF0FF' : '#1f2937',
                        opacity: s <= step ? 1 : 0.5
                      }}
                      className="h-2 rounded-full shadow-lg shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Step Description Box */}
            <div className="bg-[#050814]/90 border border-lab-blue/20 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-2xl shrink-0 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-lab-blue opacity-50" />
              <div className="p-2.5 bg-lab-blue/10 rounded-xl text-lab-blue block shrink-0">
                <Info size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-lab-blue font-black text-[10px] tracking-[0.25em] uppercase opacity-80 italic">Phase Status</h4>
                  <span className="text-[10px] text-gray-500 font-mono font-bold">BLOCK_T::PH_{step + 1}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${activeModule}-${step}`}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="text-white text-base font-semibold tracking-tight leading-snug"
                  >
                    {content.steps[Math.min(step, content.steps.length - 1)]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

          </section>
        </main>

        {/* Desktop Info Panel */}
        {isDesktopInfoOpen && (
          <aside className="w-80 bg-lab-card border-l border-gray-800 backdrop-blur-3xl z-10 h-full flex-col shrink-0 overflow-y-auto custom-scrollbar flex transition-all">
            <InfoPanelContent />
          </aside>
        )}
      </div>

      <style>{`
         .custom-scrollbar::-webkit-scrollbar {
           width: 3px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
           background: transparent;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: #1f2937;
           border-radius: 20px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: #7c6bff;
         }
       `}</style>
    </>
  );
}

export { App as BlockchainLabFull };
export default App;