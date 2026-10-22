import React, { useState, useCallback } from 'react';
import { LabStep } from './types';
import { STEPS } from './constants';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';
import Controls from './components/Controls';
import SimulationCanvas from './components/SimulationCanvas';
import BackgroundGrid from './components/BackgroundGrid';
import { Hologram3DIoTNode } from './components/Hologram3DIoTNode';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<LabStep>(LabStep.ACTIVATION);
  const [isPaused, setIsPaused] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'network' | 'hologram'>('network');

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
      {/* Mobile-optimized layout */}
      <div className="lg:hidden w-full h-full min-h-0 min-w-0 flex flex-col bg-[#070B1A]">
        {/* Mobile Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#070B1A]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              <Menu size={18} />
            </button>
            <span className="text-sm font-bold text-white tracking-tight">IOT LAB</span>
          </div>

          {/* Mode Switcher for Mobile */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('network')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                viewMode === 'network' ? 'bg-[#3BF0FF] text-[#070B1A]' : 'text-white/60'
              }`}
            >
              2D NET
            </button>
            <button
              type="button"
              onClick={() => setViewMode('hologram')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                viewMode === 'hologram' ? 'bg-[#3BF0FF] text-[#070B1A]' : 'text-white/60'
              }`}
            >
              3D HOLO
            </button>
          </div>

          {onClose && (
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {viewMode === 'hologram' ? (
          <div className="flex-1 overflow-y-auto p-3">
            <Hologram3DIoTNode />
          </div>
        ) : (
          <MobileLayout
            title={currentStepData.title}
            badges={[
              <MobileBadge key="step" variant="cyan">{`STEP ${currentStep}/5`}</MobileBadge>,
              <MobileBadge key="status" variant="green">{currentStepData.statusText || 'IDLE'}</MobileBadge>,
            ]}
            visualContent={
              <SimulationCanvas
                currentStep={currentStep}
                isPaused={isPaused}
                simplifiedMode={simplifiedMode}
              />
            }
            controls={
              <MobileControlGroup
                onPrev={handlePrev}
                onNext={handleNext}
                onReset={handleReset}
                prevDisabled={currentStep === LabStep.ACTIVATION}
                nextDisabled={currentStep === LabStep.SECURITY_DEFENSE}
              />
            }
            infoContent={
              <InfoPanel
                simplifiedMode={simplifiedMode}
                setSimplifiedMode={setSimplifiedMode}
                currentStep={currentStep}
              />
            }
          />
        )}

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
      <div className="hidden lg:flex relative w-full h-full min-w-0 min-h-0 flex-col overflow-hidden bg-[#070B1A] font-sans selection:bg-[#3BF0FF]/30">
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
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('network')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                  viewMode === 'network' ? 'bg-[#3BF0FF] text-[#070B1A]' : 'text-white/60 hover:text-white'
                }`}
              >
                2D NETWORK
              </button>
              <button
                type="button"
                onClick={() => setViewMode('hologram')}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'hologram' ? 'bg-[#3BF0FF] text-[#070B1A]' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
                3D HOLOGRAM NODE
              </button>
            </div>

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
          {viewMode === 'hologram' ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <Hologram3DIoTNode />
            </div>
          ) : (
            <>
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

                {/* Step Timeline Overlay */}
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
            </>
          )}
        </main>

        {/* Footer Controls (Only in network view) */}
        {viewMode === 'network' && (
          <Controls
            currentStep={currentStep}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            onNext={handleNext}
            onPrev={handlePrev}
            onReset={handleReset}
            onStepSelect={setCurrentStep}
          />
        )}
      </div>
    </>
  );
};

export default App;
