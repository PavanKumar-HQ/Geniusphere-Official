
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SimulationCanvas } from './components/SimulationCanvas';
import { RightPanel } from './components/RightPanel';
import { ControlBar } from './components/ControlBar';
import { SimulationStep, LabState } from './types';
import { STEP_CONTENT, COLORS } from './constants';
import { Info, Tag, X, Menu } from 'lucide-react';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [state, setState] = useState<LabState>({
    currentStep: SimulationStep.USER_ONLINE,
    isPlaying: false,
    isSimplified: false
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 8)
    }));
  }, []);

  const handlePrev = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  }, []);

  const handleTogglePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const handleReset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: SimulationStep.USER_ONLINE,
      isPlaying: false
    }));
  }, []);

  const handleTopicClick = useCallback((step: SimulationStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const handleToggleSimplified = useCallback(() => {
    setState(prev => ({ ...prev, isSimplified: !prev.isSimplified }));
  }, []);

  const content = STEP_CONTENT[state.currentStep];

  const SidebarContent = () => (
    <div className="h-full">
      <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-indigo-400 font-bold text-sm">Topics</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
          <X size={20} />
        </button>
      </div>
      <Sidebar
        currentStep={state.currentStep}
        onTopicClick={(step) => {
          handleTopicClick(step);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
      />
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View - Standardized Layout */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title="Digital Privacy"
          description={
            <>
              <p>{content.text.split('.')[0]}.</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono text-indigo-400">
                Step {state.currentStep} of 8 // {state.isSimplified ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <span className="text-sm tracking-tight">DIGITAL PRIVACY</span>
            </div>
          }
          badges={[
            <MobileBadge variant="purple" key="b1">MODULE: PRIVACY</MobileBadge>,
            state.isPlaying ? <MobileBadge variant="cyan" key="b2">SIMULATION_ACTIVE</MobileBadge> : null,
            content.status ? <MobileBadge variant="yellow" key="b3">{content.status}</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-2">
              <SimulationCanvas
                step={state.currentStep}
                isSimplified={state.isSimplified}
                isPlaying={state.isPlaying}
              />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <MobileControlGroup
                onPlay={handleTogglePlay}
                onReset={handleReset}
                onNext={handleNext}
                onPrev={handlePrev}
                isPlaying={state.isPlaying}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleToggleSimplified}
                  className="text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-indigo-400 transition-colors"
                >
                  {state.isSimplified ? 'Enable Full Mode' : 'Switch to Simplified Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold uppercase text-xs text-indigo-300">{content.title}</h4>
                {content.status && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <Tag size={10} /> {content.status}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                {state.isSimplified ? content.text.split('.')[0] + '.' : content.text}
              </p>
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={onClose || (() => window.history.back())}
        />

        {/* Sidebar Portal for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 z-[80]"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 z-[90] shadow-2xl bg-[#070B1A]"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View (Only Visible on Large Screens) */}
      <div className="hidden lg:flex h-screen w-screen flex-col bg-[#070B1A] overflow-hidden select-none">
        <div className="flex-1 flex flex-row overflow-hidden">
          {/* Left Side */}
          <Sidebar
            currentStep={state.currentStep}
            onTopicClick={handleTopicClick}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col p-10 relative overflow-y-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider">Module: Privacy</span>
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">Status: SIMULATION_ACTIVE</span>
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white mb-4">
                {state.currentStep === SimulationStep.DATA_MISUSE || state.currentStep === SimulationStep.PRIVACY_RISK ? (
                  <span className="text-red-500">Digital Privacy</span>
                ) : (
                  'Digital Privacy'
                )}
              </h1>
              <p className="text-lg text-white/50 max-w-2xl border-l-2 border-indigo-500/30 pl-4 py-1 italic">
                Exploring the invisible trail of data you leave behind in the digital world.
              </p>
            </header>

            {/* Simulation Viewport */}
            <section className="flex-1 relative min-h-0 mb-6">
              <SimulationCanvas
                step={state.currentStep}
                isSimplified={state.isSimplified}
                isPlaying={state.isPlaying}
              />
            </section>

            {/* Step Detail Footer (Within Main Area) */}
            <footer className="bg-white/5 border border-white/10 rounded-xl p-6 flex gap-6 items-start">
              <div className="bg-indigo-500/10 p-3 rounded-lg flex-shrink-0">
                <Info className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-sm font-bold font-mono tracking-widest text-indigo-300 uppercase">
                    {content.title}
                  </h2>
                  {content.status && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded">
                      <Tag size={10} /> {content.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  {state.isSimplified ? content.text.split('.')[0] + '.' : content.text}
                </p>
              </div>
            </footer>
          </main>

          {/* Right Side */}
          <RightPanel
            isSimplified={state.isSimplified}
            onToggleSimplified={handleToggleSimplified}
          />
        </div>

        {/* Control Bar */}
        <ControlBar
          currentStep={state.currentStep}
          isPlaying={state.isPlaying}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Decorative Vignette Overlay */}
        <div className="fixed inset-0 pointer-events-none vignette z-50 opacity-40" />
      </div>
    </>
  );
};

export default App;
