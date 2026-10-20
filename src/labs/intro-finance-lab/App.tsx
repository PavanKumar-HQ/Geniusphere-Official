
import React, { useState, useEffect, useCallback } from 'react';
import { ModuleId, SimulationState } from './types';
import { MODULES, COLORS, SMART_TIPS, DID_YOU_KNOW } from './constants';
import Sidebar from './components/Sidebar';
import SimulationArea from './components/SimulationArea';
import RightPanel from './components/RightPanel';
import Controls from './components/Controls';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [state, setState] = useState<SimulationState>({
    currentModuleId: ModuleId.WHAT_IS_MONEY,
    isPaused: false,
    isSimplified: false,
    progress: 10,
  });
  const [simStep, setSimStep] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    let interval: any;
    if (!state.isPaused) {
      interval = setInterval(() => {
        setSimStep(prev => (prev + 1) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [state.isPaused]);

  const handleModuleChange = (id: ModuleId) => {
    setState(prev => ({ ...prev, currentModuleId: id, progress: (id / 10) * 100 }));
    setSimStep(0);
  };

  const handleTogglePause = () => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleReset = () => {
    setSimStep(0);
    setState(prev => ({ ...prev, isPaused: false }));
  };

  const handleToggleSimplified = () => {
    setState(prev => ({ ...prev, isSimplified: !prev.isSimplified }));
  };

  const activeModule = MODULES.find(m => m.id === state.currentModuleId) || MODULES[0];

  const SidebarContent = () => (
    <div className="h-full bg-[#070B1A]">
      <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-[#00FFA3] font-bold text-sm">Finance Modules</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
          <X size={20} />
        </button>
      </div>
      <Sidebar
        modules={MODULES}
        activeId={state.currentModuleId}
        onSelect={(id) => {
          handleModuleChange(id);
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
          title={activeModule.title}
          description={
            <>
              <p>{activeModule.description}</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono text-[#00FFA3]">
                Module {state.currentModuleId} of {MODULES.length} // {state.isSimplified ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-white font-bold">
              <div className="w-6 h-6 bg-[#00FFA3] rounded-lg flex items-center justify-center text-black text-xs font-bold">F</div>
              <span className="text-sm tracking-tight">FINANCE LAB</span>
            </div>
          }
          badges={[
            <MobileBadge variant="green" key="b1">MODULE: {state.currentModuleId}/{MODULES.length}</MobileBadge>,
            !state.isPaused ? <MobileBadge variant="cyan" key="b2">SIMULATION_ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-2">
              <SimulationArea
                moduleId={state.currentModuleId}
                simStep={simStep}
                isSimplified={state.isSimplified}
                moduleData={activeModule}
              />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <MobileControlGroup
                onPlay={handleTogglePause}
                onReset={handleReset}
                onNext={() => state.currentModuleId < 10 && handleModuleChange(state.currentModuleId + 1)}
                onPrev={() => state.currentModuleId > 1 && handleModuleChange(state.currentModuleId - 1)}
                isPlaying={!state.isPaused}
              />
              <div className="flex justify-center">
                <button
                  onClick={handleToggleSimplified}
                  className="text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-[#00FFA3] transition-colors"
                >
                  {state.isSimplified ? 'Enable Full Mode' : 'Switch to Simplified Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-[#00FFA3]">Current Module</h4>
              <p className="text-sm">{activeModule.description}</p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-yellow-400 font-bold mb-1">💡 Did You Know?</p>
                <p className="text-xs text-gray-400">{DID_YOU_KNOW[state.currentModuleId % DID_YOU_KNOW.length]}</p>
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
      <div className="hidden lg:flex h-screen w-full flex-col bg-[#070B1A] relative overflow-hidden grid-bg">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-growth/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-income/5 rounded-full blur-[120px] animate-pulse-slow"></div>

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 glass z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-growth rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              FINANCE LAB: <span className="font-light">MONEY & DECISIONS</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono opacity-50 uppercase">Simplified Mode</span>
              <button
                onClick={handleToggleSimplified}
                className={`w-10 h-5 rounded-full relative transition-colors ${state.isSimplified ? 'bg-income' : 'bg-white/20'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${state.isSimplified ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <div className="text-xs font-mono opacity-70">STUDENT_SESSION: 2024_Q4</div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-row overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar
            modules={MODULES}
            activeId={state.currentModuleId}
            onSelect={handleModuleChange}
          />

          {/* Center Simulation Area */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto relative">
            <SimulationArea
              moduleId={state.currentModuleId}
              simStep={simStep}
              isSimplified={state.isSimplified}
              moduleData={activeModule}
            />

            <div className="mt-auto pt-6">
              <Controls
                progress={state.progress}
                isPaused={state.isPaused}
                onTogglePause={handleTogglePause}
                onReset={handleReset}
                onNext={() => state.currentModuleId < 10 && handleModuleChange(state.currentModuleId + 1)}
                onPrev={() => state.currentModuleId > 1 && handleModuleChange(state.currentModuleId - 1)}
              />
            </div>
          </div>

          {/* Right Info Panel */}
          <RightPanel
            tips={SMART_TIPS}
            didYouKnow={DID_YOU_KNOW[state.currentModuleId % DID_YOU_KNOW.length]}
          />
        </main>
      </div>
    </>
  );
};

export default App;
