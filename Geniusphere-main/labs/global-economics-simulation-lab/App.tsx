
import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { EventType, SimulationState } from './types';
import { SIMULATION_STEPS, GLOBAL_EVENTS } from './constants';
import { LeftPanel, RightPanel } from './components/Panels';
import GlobeVisualizer from './components/GlobeVisualizer';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

const motion = motionBase as any;

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [state, setState] = useState<SimulationState>({
    currentStep: 1,
    selectedEvent: EventType.WAR,
    isPlaying: false,
    isSimplified: false,
    progress: 0,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentStepData = SIMULATION_STEPS[state.currentStep - 1];
  const selectedEventData = GLOBAL_EVENTS[state.selectedEvent];

  useEffect(() => {
    let interval: any;
    if (state.isPlaying && state.currentStep < SIMULATION_STEPS.length) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
        }));
      }, 5000); // 5 seconds per step for better reading and animation viewing
    } else if (state.currentStep === SIMULATION_STEPS.length) {
      setState(prev => ({ ...prev, isPlaying: false }));
    }
    return () => clearInterval(interval);
  }, [state.isPlaying, state.currentStep]);

  const togglePlayback = () => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  const resetSimulation = () => setState(prev => ({ ...prev, currentStep: 1, isPlaying: false }));
  const handleStepChange = (step: number) => setState(prev => ({ ...prev, currentStep: step, isPlaying: false }));
  const handleEventSelect = (type: EventType) => setState(prev => ({ ...prev, selectedEvent: type, currentStep: 1 }));
  const toggleSimplified = () => setState(prev => ({ ...prev, isSimplified: !prev.isSimplified }));

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title="Global Economy Lab"
          description={currentStepData.title}
          badges={[
            <MobileBadge variant="blue" key="b1">STEP {state.currentStep}/{SIMULATION_STEPS.length}</MobileBadge>,
            state.isPlaying ? <MobileBadge variant="green" key="b2">SIMULATING</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full p-4">
              <GlobeVisualizer
                event={selectedEventData}
                step={currentStepData}
                isPlaying={state.isPlaying}
                simplified={state.isSimplified}
              />
            </div>
          }
          controls={
            <MobileControlGroup
              onPlay={togglePlayback}
              onReset={resetSimulation}
              onNext={() => handleStepChange(Math.min(SIMULATION_STEPS.length, state.currentStep + 1))}
              onPrev={() => handleStepChange(Math.max(1, state.currentStep - 1))}
              isPlaying={state.isPlaying}
            />
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-blue-400">Current Event</h4>
              <p className="text-sm mb-2">{selectedEventData.label}</p>
              <p className="text-xs text-slate-400">{currentStepData.description}</p>
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={onClose || (() => {
            const referrer = document.referrer;
            const currentOrigin = window.location.origin;
            if (referrer && referrer.startsWith(currentOrigin) && window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/';
            }
          })}
          headerStyle="brand-center"
          headerTitle="GLOBAL ECONOMY"
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
                  <h2 className="text-lg font-bold">Global Events</h2>
                  <p className="text-xs text-slate-400">Select an economic scenario</p>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {Object.entries(GLOBAL_EVENTS).map(([key, event]) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleEventSelect(key as EventType);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${state.selectedEvent === key
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                        }`}
                    >
                      <div className="text-sm font-bold">{event.label}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{event.description}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => toggleSimplified()}
                    className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {state.isSimplified ? 'Full Mode' : 'Simplified Mode'}
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex h-screen w-screen flex-col bg-[#070B1A] text-[#E6E9F0] overflow-y-auto md:overflow-hidden select-none">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-[#1E293B] bg-[#0A0F24]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#4DA3FF] to-[#2AFFA2] rounded-lg flex items-center justify-center font-bold text-[#070B1A]">
              GL
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">GLOBAL ECONOMY LAB</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Educational Simulation Lab</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Simplified View</span>
              <button
                onClick={toggleSimplified}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${state.isSimplified ? 'bg-[#2AFFA2]' : 'bg-[#1E293B]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${state.isSimplified ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="px-4 py-2 bg-[#1E293B]/50 rounded-md border border-[#334155] text-xs font-bold text-[#4DA3FF] mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${state.isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              {state.isPlaying ? 'SIMULATION_RUNNING' : 'SYSTEM_READY'}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-y-auto md:overflow-hidden">
          {/* Left Panel - Control Event Selection */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <LeftPanel selectedEvent={state.selectedEvent} onSelectEvent={handleEventSelect} />
          </aside>

          {/* Center Simulation - The Globe and Animations */}
          <section className="flex-1 relative flex flex-col bg-[radial-gradient(circle_at_center,_#0A1128_0%,_#070B1A_100%)]">
            <div className="flex-1 relative">
              <GlobeVisualizer
                currentStep={state.currentStep}
                selectedEvent={selectedEventData}
                isSimplified={state.isSimplified}
              />

              {/* Step Content Overlay */}
              <div className="absolute top-8 left-8 right-8 pointer-events-none flex justify-center">
                <div className="bg-[#0A0F24]/90 border border-[#1E293B] p-6 rounded-2xl backdrop-blur-xl shadow-2xl max-w-2xl w-full pointer-events-auto transform transition-all duration-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] text-[#4DA3FF] font-bold tracking-[0.25em] uppercase">STEP {state.currentStep} of 10</div>
                    {currentStepData.status && (
                      <div
                        className="px-2 py-0.5 rounded text-[9px] font-black mono uppercase tracking-wider"
                        style={{ backgroundColor: `${currentStepData.statusColor}33`, color: currentStepData.statusColor, border: `1px solid ${currentStepData.statusColor}66` }}
                      >
                        {currentStepData.status}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-black mb-3 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {currentStepData.title}
                  </h2>
                  <p className="text-base text-gray-300 leading-relaxed font-medium italic border-l-2 border-[#4DA3FF] pl-4">
                    "{currentStepData.description}"
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline & Controls */}
            <footer className="h-28 bg-[#0A0F24]/95 border-t border-[#1E293B] p-4 flex flex-col justify-center px-12 backdrop-blur-md">
              <div className="flex items-center gap-8 mb-5">
                <button
                  onClick={togglePlayback}
                  className={`w-14 h-14 flex items-center justify-center rounded-full transition-all active:scale-95 shadow-lg ${state.isPlaying ? 'bg-[#FF4D4D] text-white ring-4 ring-red-500/20' : 'bg-[#4DA3FF] text-[#070B1A] ring-4 ring-blue-500/20'}`}
                >
                  {state.isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>

                <button onClick={resetSimulation} className="p-3 bg-[#1E293B] rounded-xl text-gray-400 hover:text-white hover:bg-[#334155] transition-all active:rotate-180">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>

                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                    <span>Initial Connection</span>
                    <span className={state.currentStep === 10 ? 'text-[#2AFFA2]' : ''}>Long-Term Recovery</span>
                  </div>
                  <div className="h-4 w-full bg-[#1E293B] rounded-full relative overflow-y-auto md:overflow-hidden group">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4DA3FF] to-[#2AFFA2] transition-all duration-700 ease-out"
                      style={{ width: `${(state.currentStep / SIMULATION_STEPS.length) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={state.currentStep}
                      onChange={(e) => handleStepChange(parseInt(e.target.value))}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 h-1.5">
                {SIMULATION_STEPS.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    className={`flex-1 rounded-full cursor-pointer transition-all duration-300 ${state.currentStep >= step.id ? (step.id === 10 ? 'bg-[#2AFFA2]' : 'bg-[#4DA3FF]') : 'bg-[#1E293B] hover:bg-[#334155]'}`}
                  />
                ))}
              </div>
            </footer>
          </section>

          {/* Right Panel - Context & Impact */}
          <aside className="w-full md:w-80 flex-shrink-0">
            <RightPanel selectedEvent={selectedEventData} currentStep={state.currentStep} />
          </aside>
        </main>
      </div>
    </>
  );
};

export default App;
