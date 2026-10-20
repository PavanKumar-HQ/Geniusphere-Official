
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SCENARIOS } from './constants';
import { Scenario, ScoreState, Choice } from './types';
import Sidebar from './components/Sidebar';
import SimulationPanel from './components/SimulationPanel';
import FeedbackPanel from './components/FeedbackPanel';
import Controls from './components/Controls';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scores, setScores] = useState<ScoreState>({
    clarity: 50,
    listening: 50,
    confidence: 50,
    respect: 50
  });
  const [history, setHistory] = useState<{ scenarioId: number, choice: Choice }[]>([]);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'active' | 'finished'>('idle');
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentScenario = SCENARIOS[currentScenarioIndex];

  const handleChoice = useCallback((choice: Choice) => {
    setLastChoice(choice);
    setScores(prev => ({
      clarity: Math.min(100, Math.max(0, prev.clarity + choice.impact.clarity)),
      listening: Math.min(100, Math.max(0, prev.listening + choice.impact.listening)),
      confidence: Math.min(100, Math.max(0, prev.confidence + choice.impact.confidence)),
      respect: Math.min(100, Math.max(0, prev.respect + choice.impact.respect))
    }));
    setHistory(prev => [...prev, { scenarioId: currentScenario.id, choice }]);
  }, [currentScenario.id]);

  const handleNext = useCallback(() => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setLastChoice(null);
    } else {
      setSimulationStatus('finished');
      setShowReport(true);
    }
  }, [currentScenarioIndex]);

  const handleReset = useCallback(() => {
    setCurrentScenarioIndex(0);
    setScores({ clarity: 50, listening: 50, confidence: 50, respect: 50 });
    setHistory([]);
    setSimulationStatus('idle');
    setLastChoice(null);
    setShowReport(false);
  }, []);

  const handleStart = () => {
    setSimulationStatus('active');
  };

  const SidebarContent = () => (
    <div className="h-full bg-[#070B1A]">
      <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-[#4DA3FF] font-bold text-sm">Scenarios</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
          <X size={20} />
        </button>
      </div>
      <Sidebar
        scenarios={SCENARIOS}
        currentIndex={currentScenarioIndex}
        history={history}
        onSelectScenario={(idx) => {
          if (idx <= history.length) setCurrentScenarioIndex(idx);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }}
      />
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title={currentScenario.title}
          description={
            <>
              <p>{currentScenario.description}</p>
              <div className="mt-2 text-[10px] opacity-70 italic font-mono text-[#4DA3FF]">
                Scenario {currentScenarioIndex + 1} of {SCENARIOS.length} // {isSimplifiedMode ? 'SIMPLIFIED' : 'FULL'}
              </div>
            </>
          }
          headerStyle="brand-center"
          headerTitle={
            <div className="flex items-center gap-2 text-[#4DA3FF] font-bold">
              <div className="w-6 h-6 bg-[#4DA3FF] rounded-lg flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-sm tracking-tight">COMMUNICATION</span>
            </div>
          }
          badges={[
            <MobileBadge variant="cyan" key="b1">SCENARIO: {currentScenarioIndex + 1}/{SCENARIOS.length}</MobileBadge>,
            simulationStatus === 'active' ? <MobileBadge variant="green" key="b2">ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col p-2">
              <SimulationPanel
                scenario={currentScenario}
                status={simulationStatus}
                onChoice={handleChoice}
                lastChoice={lastChoice}
                onNext={handleNext}
                onStart={handleStart}
              />
            </div>
          }
          controls={
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-2">
                <button
                  onClick={handleStart}
                  disabled={simulationStatus === 'active'}
                  className="flex-1 py-3 bg-[#4DA3FF] hover:bg-[#3B92E6] disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                >
                  {simulationStatus === 'idle' ? 'START' : 'ACTIVE'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                >
                  RESET
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setIsSimplifiedMode(!isSimplifiedMode)}
                  className="text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-[#4DA3FF] transition-colors"
                >
                  {isSimplifiedMode ? 'Enable Full Mode' : 'Switch to Simplified Mode'}
                </button>
              </div>
            </div>
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-[#4DA3FF]">Your Skills</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Clarity:</span>
                  <span className="font-bold">{scores.clarity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Listening:</span>
                  <span className="font-bold">{scores.listening}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-bold">{scores.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Respect:</span>
                  <span className="font-bold">{scores.respect}%</span>
                </div>
              </div>
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={onClose || (() => window.history.back())}
        />

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

      {/* Desktop View */}
      <div className="hidden lg:flex flex-col h-screen w-full relative z-10 p-6 overflow-hidden">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4DA3FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#4DA3FF]/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">COMMUNICATION SKILLS LAB</h1>
              <p className="text-sm text-[#E6E9F0]/60">Express Clearly & Confidently</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-xs font-medium text-[#E6E9F0]/60">SIMPLIFIED MODE</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSimplifiedMode}
                  onChange={() => setIsSimplifiedMode(!isSimplifiedMode)}
                />
                <div className={`block w-10 h-5 rounded-full transition ${isSimplifiedMode ? 'bg-[#4DA3FF]' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition transform ${isSimplifiedMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
          </div>
        </header>

        <div className="flex-1 flex flex-row gap-6 min-h-0">
          <div className="w-1/4 h-full">
            <Sidebar
              scenarios={SCENARIOS}
              currentIndex={currentScenarioIndex}
              history={history}
              onSelectScenario={(idx) => {
                if (idx <= history.length) setCurrentScenarioIndex(idx);
              }}
            />
          </div>

          <div className="w-2/4 h-full">
            <SimulationPanel
              scenario={currentScenario}
              status={simulationStatus}
              onChoice={handleChoice}
              lastChoice={lastChoice}
              onNext={handleNext}
              onStart={handleStart}
            />
          </div>

          <div className="w-1/4 h-full">
            <FeedbackPanel
              scores={scores}
              lastChoice={lastChoice}
              simplified={isSimplifiedMode}
              history={history}
              showReport={showReport}
              onCloseReport={() => setShowReport(false)}
            />
          </div>
        </div>

        <div className="mt-6">
          <Controls
            status={simulationStatus}
            onReset={handleReset}
            onStart={handleStart}
            onViewReport={() => setShowReport(true)}
            canViewReport={simulationStatus === 'finished'}
          />
        </div>
      </div>
    </>
  );
};

export default App;
