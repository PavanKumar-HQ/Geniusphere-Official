
import React, { useState, useEffect, useCallback } from 'react';
import { LabStep } from './types';
import { STEPS } from './constants';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import Controls from './components/Controls';
import SimulationCanvas from './components/SimulationCanvas';
import BackgroundGrid from './components/BackgroundGrid';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<LabStep>(LabStep.ACTIVATION);
  const [isPaused, setIsPaused] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => (prev < LabStep.SECURITY_DEFENSE ? prev + 1 : prev));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => (prev > LabStep.ACTIVATION ? prev - 1 : prev));
  }, []);

  const handleReset = () => {
    setCurrentStep(LabStep.ACTIVATION);
    setIsPaused(false);
  };

  const currentStepData = STEPS.find(s => s.id === currentStep) || STEPS[0];

  const SidebarContent = () => (
    <div className="h-full bg-[#070B1A]">
      <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-[#3BF0FF] font-bold text-sm">IoT Modules</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
          <X size={20} />
        </button>
      </div>
      <Sidebar
        currentStep={currentStep}
        onStepSelect={(step) => {
          setCurrentStep(step);
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
          title={currentStepData.title}
          description={
            <>
              <p>{currentStepData.description}</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono text-[#3BF0FF]">
                Step {currentStep} of {STEPS.length} // {simplifiedMode ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-[#3BF0FF] font-bold">
              <div className="w-6 h-6 rounded bg-[#3BF0FF]/20 border border-[#3BF0FF]/40 flex items-center justify-center">
                <span className="text-[#3BF0FF] font-black text-[8px] tracking-tighter">IoT</span>
              </div>
              <span className="text-sm tracking-tight">IoT SECURITY</span>
            </div>
          }
          badges={[
            <MobileBadge variant="cyan" key="b1">STEP: {currentStep}/{STEPS.length}</MobileBadge>,
            !isPaused ? <MobileBadge variant="green" key="b2">{currentStepData.statusText}</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col relative">
              <SimulationCanvas
                currentStep={currentStep}
                isPaused={isPaused}
                simplifiedMode={simplifiedMode}
              />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <MobileControlGroup
                onPlay={() => setIsPaused(!isPaused)}
                onReset={handleReset}
                onNext={handleNext}
                onPrev={handlePrev}
                isPlaying={!isPaused}
              />
              <div className="flex justify-center">
                <button
                  onClick={() => setSimplifiedMode(!simplifiedMode)}
                  className="text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-[#3BF0FF] transition-colors"
                >
                  {simplifiedMode ? 'Enable Full Mode' : 'Switch to Simplified Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-[#3BF0FF]">Current Step</h4>
              <p className="text-sm">{currentStepData.description}</p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-yellow-400 font-bold mb-1">⚠️ Security Alert</p>
                <p className="text-xs text-gray-400">IoT devices are vulnerable. Always use strong passwords and encryption.</p>
              </div>
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
                className="fixed left-0 top-0 h-full w-80 z-[90] shadow-2xl"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View (Only Visible on Large Screens) */}
      <div className="hidden lg:flex relative w-screen h-screen flex-col overflow-hidden bg-[#070B1A] font-sans selection:bg-[#3BF0FF]/30">
        <BackgroundGrid />

        {/* Top Bar Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 z-20 backdrop-blur-md bg-[#070B1A]/80">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#3BF0FF]/10 border border-[#3BF0FF]/40 flex items-center justify-center shadow-[0_0_15px_rgba(59,240,255,0.1)]">
              <span className="text-[#3BF0FF] font-black text-xs tracking-tighter">IOT_LAB</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase leading-none">
                Internet <span className="text-[#3BF0FF]">of Things</span>
              </h1>
              <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Interactive_Module v2.1</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-mono text-white/40 tracking-widest hidden md:block">
              STATUS: <span className="text-[#00FFA3]">SECURE_TUNNEL_ESTABLISHED</span>
            </div>
            <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-lg text-white/80 text-[10px] font-mono uppercase tracking-widest">
              {currentStepData.statusText || 'SYSTEM_IDLE'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-row overflow-hidden relative z-10">
          <Sidebar
            currentStep={currentStep}
            onStepSelect={setCurrentStep}
          />

          <div className="flex-1 relative flex flex-col">
            <SimulationCanvas
              currentStep={currentStep}
              isPaused={isPaused}
              simplifiedMode={simplifiedMode}
            />

            {/* Step Timeline Overlay - Moved to bottom of canvas to avoid overlapping modules */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-full px-6 z-30">
              <div className="bg-[#0D132C]/90 border border-white/15 p-4 rounded-2xl backdrop-blur-xl shadow-2xl text-center">
                <h2 className="text-[9px] font-mono text-[#3BF0FF] uppercase tracking-[0.4em] mb-1 opacity-70">
                  Step {currentStep}: {currentStepData.title}
                </h2>
                <p className="text-white text-base font-medium tracking-tight">
                  {currentStepData.description}
                </p>
              </div>
            </div>
          </div>

          <InfoPanel
            simplifiedMode={simplifiedMode}
            setSimplifiedMode={setSimplifiedMode}
            currentStep={currentStep}
          />
        </main>

        {/* Footer Controls */}
        <Controls
          currentStep={currentStep}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          onStepSelect={setCurrentStep}
        />
      </div>
    </>
  );
};

export default App;
