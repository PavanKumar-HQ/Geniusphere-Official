
import React, { useState, useEffect } from 'react';
import { STEPS, THEME, MYTHS } from './constants';
import SimulationStage from './components/SimulationStage';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && currentStep < STEPS.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
      }, 5000);
    } else if (currentStep === STEPS.length) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const reset = () => {
    setCurrentStep(1);
    setIsPlaying(false);
  };

  const currentStepData = STEPS[currentStep - 1];

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#070b1d]">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Topic List</h2>
        <button className="md:hidden p-2 text-gray-400" onClick={() => setIsSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>
      <nav className="space-y-1 p-6 flex-1 overflow-y-auto">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => {
              setCurrentStep(step.id);
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-center space-x-3 group ${currentStep === step.id
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-gray-400 hover:bg-gray-800'
              }`}
          >
            <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${currentStep === step.id ? 'bg-cyan-500 text-black' : 'bg-gray-800 group-hover:bg-gray-700'
              }`}>
              {step.id}
            </span>
            <span className="truncate">{step.title}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-800 bg-yellow-900/10">
        <div className="flex items-center space-x-2 text-yellow-500 mb-2">
          <span className="text-xs font-bold">DID YOU KNOW?</span>
        </div>
        <p className="text-[11px] text-yellow-200/70 leading-relaxed italic">
          "Once a transaction is added to a blockchain, it cannot be changed. This is called 'Immutability'."
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View - Standardized Layout */}
      <div className="md:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title={currentStepData.title}
          description={
            <>
              <p>{currentStepData.description}</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono">
                Step {currentStep} of {STEPS.length} // {simplifiedMode ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-black text-xs">C</div>
              <span className="text-sm tracking-tight">CRYPTOCURRENCY</span>
            </div>
          }
          badges={[
            <MobileBadge variant="cyan" key="b1">STEP: {currentStep}/{STEPS.length}</MobileBadge>,
            isPlaying ? <MobileBadge variant="yellow" key="b2">SIMULATION_ACTIVE</MobileBadge> : null,
            currentStepData.status ? <MobileBadge variant="green" key="b3">{currentStepData.status}</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-2">
              <SimulationStage currentStep={currentStep} simplifiedMode={simplifiedMode} />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <MobileControlGroup
                onPlay={isPlaying ? () => setIsPlaying(false) : () => setIsPlaying(true)}
                onReset={reset}
                onNext={nextStep}
                onPrev={prevStep}
                isPlaying={isPlaying}
              />
              <div className="flex justify-center">
                <button
                  onClick={() => setSimplifiedMode(!simplifiedMode)}
                  className="text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-cyan-400 transition-colors"
                >
                  {simplifiedMode ? 'Enable Full Mode' : 'Switch to Simplified Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-cyan-400">Current Step</h4>
              <p className="text-sm">{currentStepData.description}</p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-yellow-400 font-bold mb-1">⚠️ Important</p>
                <p className="text-xs text-gray-400">Crypto is not guaranteed money. Prices are highly volatile.</p>
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

      {/* Desktop View (Only Visible on Medium+ Screens) */}
      <div className="hidden md:flex flex-col h-screen bg-[#050816] text-[#E6E9F0] overflow-hidden select-none">
        {/* Header */}
        <header className="p-4 border-b border-cyan-500/20 flex justify-between items-center bg-[#0a0f23]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center text-black font-bold">C</div>
            <h1 className="text-xl font-bold tracking-tight">CRYPTOCURRENCY <span className="text-cyan-400 text-sm font-normal">— HOW DIGITAL MONEY WORKS</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-900/50 p-1 px-3 rounded-full border border-gray-700">
              <span className="text-[10px] font-bold text-gray-400">SIMPLIFIED MODE</span>
              <button
                onClick={() => setSimplifiedMode(!simplifiedMode)}
                className={`w-10 h-5 rounded-full transition-colors relative ${simplifiedMode ? 'bg-cyan-500' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${simplifiedMode ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
            <div className="text-xs px-2 py-1 bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 rounded uppercase font-bold tracking-widest">
              Educational Lab
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-row overflow-hidden">
          {/* Left Panel: Topics */}
          <aside className="w-72 border-r border-gray-800 overflow-y-auto bg-[#070b1d]">
            <SidebarContent />
          </aside>

          {/* Center Panel: Simulation */}
          <section className="flex-1 flex flex-col p-8 bg-[#050816] relative overflow-y-auto">
            <div className="mb-6 flex justify-between items-end">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold mb-2 text-white">{currentStepData.title}</h2>
                <p className="text-gray-400 leading-relaxed">{currentStepData.description}</p>
              </div>
              {currentStepData.status && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-900/20 border border-green-500/30 rounded animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-[10px] font-mono font-bold text-green-400">{currentStepData.status}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0">
              <SimulationStage currentStep={currentStep} simplifiedMode={simplifiedMode} />
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <div className="flex-1 bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-mono text-gray-500">{currentStep} / {STEPS.length}</span>
            </div>
          </section>

          {/* Right Panel: Safety & Reality */}
          <aside className="w-80 border-l border-gray-800 p-6 overflow-y-auto bg-[#070b1d]">
            <div className="mb-8">
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center">
                <span className="mr-2">⚠️</span> IMPORTANT AWARENESS
              </h2>
              <ul className="space-y-3 text-[13px] text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Crypto is <strong>not guaranteed money</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Prices are <strong>highly volatile</strong></span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span><strong>Scams are common</strong> in digital space</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Losing private keys means <strong>losing access</strong></span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">MYTHS VS FACTS</h2>
              <div className="space-y-4">
                {MYTHS.map((m, i) => (
                  <div key={i} className="bg-gray-900/40 p-3 rounded border border-gray-800">
                    <div className="text-[11px] text-red-400 mb-1 flex items-start">
                      <span className="mr-1">❌</span> {m.myth}
                    </div>
                    <div className="text-[11px] text-green-400 flex items-start">
                      <span className="mr-1">✅</span> {m.fact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 border border-blue-500/20 bg-blue-900/5 rounded">
              <h3 className="text-xs font-bold text-blue-400 mb-2">LEARNING OUTCOME</h3>
              <p className="text-[11px] text-blue-100/60 italic leading-relaxed">
                "Students will develop a responsible digital mindset by understanding crypto as technology, not just a financial asset."
              </p>
            </div>
          </aside>
        </main>

        {/* Footer Controls */}
        <footer className="p-4 bg-[#0a0f23] border-t border-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-2 px-6 py-2 rounded font-bold transition-all ${isPlaying ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-cyan-500 text-black hover:bg-cyan-400'
                }`}
            >
              <span>{isPlaying ? '⏸ PAUSE' : '▶️ PLAY SIM'}</span>
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 border border-gray-700 text-gray-400 rounded hover:bg-gray-800 font-bold transition-colors"
            >
              🔄 RESET
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-30 hover:bg-gray-700"
            >
              PREV
            </button>
            <div className="flex space-x-1 px-4">
              {STEPS.map(s => (
                <div
                  key={s.id}
                  className={`w-2 h-2 rounded-full ${currentStep >= s.id ? 'bg-cyan-500' : 'bg-gray-700'}`}
                ></div>
              ))}
            </div>
            <button
              onClick={nextStep}
              disabled={currentStep === STEPS.length}
              className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-30 hover:bg-gray-700"
            >
              NEXT
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
