
import React, { useState, useCallback, useEffect } from 'react';
import { SimulationStep } from './types';
import { STEPS, TOPICS, COLORS } from './constants';
import Sidebar from './components/Sidebar';
import SimulationStage from './components/SimulationStage';
import RightPanel from './components/RightPanel';
import Controls from './components/Controls';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<SimulationStep>(SimulationStep.COMPANY_NEEDS_MONEY);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSimplified, setIsSimplified] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < SimulationStep.MYTH_VS_REALITY ? prev + 1 : prev));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > SimulationStep.COMPANY_NEEDS_MONEY ? prev - 1 : prev));
  }, []);

  const resetSim = useCallback(() => {
    setCurrentStep(SimulationStep.COMPANY_NEEDS_MONEY);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    let timer: number;
    if (isPlaying && currentStep < SimulationStep.MYTH_VS_REALITY) {
      timer = window.setTimeout(() => {
        nextStep();
      }, isSimplified ? 6000 : 4000);
    } else if (currentStep === SimulationStep.MYTH_VS_REALITY) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, nextStep, isSimplified]);

  const filteredSteps = isSimplified
    ? [SimulationStep.COMPANY_NEEDS_MONEY, SimulationStep.MARKET_CONNECTS, SimulationStep.LONG_TERM_GROWTH]
    : Object.values(SimulationStep).filter(v => typeof v === 'number') as SimulationStep[];

  const currentTopic = TOPICS.find(t => t.id === currentStep) || TOPICS[0];

  const SidebarContent = () => (
    <div className="h-full bg-[#070B1A]">
      <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-cyan-400 font-bold text-sm">Topics</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
          <X size={20} />
        </button>
      </div>
      <Sidebar
        topics={TOPICS}
        currentStep={currentStep}
        onSelectStep={(step) => {
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
          title={currentTopic.title}
          description={
            <>
              <p>{currentTopic.description}</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono text-cyan-400">
                Step {currentStep + 1} of {isSimplified ? 3 : 8} // {isSimplified ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center text-black text-xs font-bold">S</div>
              <span className="text-sm tracking-tight">STOCK MARKET</span>
            </div>
          }
          badges={[
            <MobileBadge variant="cyan" key="b1">STEP: {currentStep + 1}/{isSimplified ? 3 : 8}</MobileBadge>,
            isPlaying ? <MobileBadge variant="yellow" key="b2">SIMULATION_ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-2">
              <SimulationStage
                step={currentStep}
                isSimplified={isSimplified}
              />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <MobileControlGroup
                onPlay={() => setIsPlaying(!isPlaying)}
                onReset={resetSim}
                onNext={nextStep}
                onPrev={prevStep}
                isPlaying={isPlaying}
              />
              <div className="flex justify-center">
                <button
                  onClick={() => setIsSimplified(!isSimplified)}
                  className="text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-cyan-400 transition-colors"
                >
                  {isSimplified ? 'Enable Full Mode' : 'Switch to Simplified Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-cyan-400">Current Topic</h4>
              <p className="text-sm">{currentTopic.description}</p>
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
      <div className="hidden lg:flex flex-col h-screen w-full bg-[#070B1A] grid-bg overflow-hidden text-slate-200">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-cyan-900/30 glass-panel z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center font-bold text-black">S</div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              STOCK MARKET BASICS LAB
            </h1>
          </div>
          <div className="text-xs uppercase tracking-widest text-cyan-500/60 font-medium">
            Educational Simulation v1.0
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-row overflow-hidden p-4 gap-4">
          {/* Left Sidebar: Topics */}
          <Sidebar
            topics={TOPICS}
            currentStep={currentStep}
            onSelectStep={setCurrentStep}
          />

          {/* Center: Interactive Simulation */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 glass-panel relative overflow-hidden group">
              <div className="absolute inset-0 grid-bg animate-grid pointer-events-none" />
              <SimulationStage
                step={currentStep}
                isSimplified={isSimplified}
              />
            </div>

            {/* Bottom Controls */}
            <Controls
              currentStep={currentStep}
              totalSteps={isSimplified ? 3 : 8}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onReset={resetSim}
              onNext={nextStep}
              onPrev={prevStep}
              isSimplified={isSimplified}
            />
          </div>

          {/* Right Sidebar: Info Panels */}
          <RightPanel
            isSimplified={isSimplified}
            onToggleSimplified={() => setIsSimplified(!isSimplified)}
            currentStep={currentStep}
          />
        </main>

        {/* Footer Info */}
        <footer className="h-8 flex items-center justify-center text-[10px] text-slate-500 uppercase tracking-widest">
          Curriculum for Grades 7-10 • Safe Educational Environment • Non-Commercial
        </footer>
      </div>
    </>
  );
};

export default App;
