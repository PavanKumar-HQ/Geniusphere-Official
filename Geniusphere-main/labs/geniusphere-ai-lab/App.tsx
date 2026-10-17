
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SimulationEngine } from './components/SimulationEngine';
import { DefensePanel } from './components/DefensePanel';
import { AI_MODULES } from './constants';
import { AIModule } from './types';
import { Menu, X } from 'lucide-react';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(AI_MODULES[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeModule = AI_MODULES.find(m => m.id === activeModuleId) || AI_MODULES[0];

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setIsSimulating(false);
  };

  return (
    <>
      {/* Mobile View - Standardized Layout */}
      <div className="md:hidden">
        <MobileLayout
          title={activeModule.title}
          description={
            <>
              <p>{activeModule.scenario}</p>
              <div className="mt-2 text-xs opacity-70 italic font-mono text-cyan-400">Protocol Active: v1.1</div>
            </>
          }
          badges={[
            <MobileBadge variant="cyan" key="b1">MODULE: {activeModule.id.toUpperCase()}</MobileBadge>,
            isSimulating ? <MobileBadge variant="yellow" key="b2">&gt; SIMULATION_ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full flex flex-col">
              <SimulationEngine
                module={activeModule}
                isSimulating={isSimulating}
                onStartSim={() => setIsSimulating(true)}
                onEndSim={() => setIsSimulating(false)}
                minimal={true}
              />
            </div>
          }
          controls={
            <MobileControlGroup
              onPlay={() => setIsSimulating(!isSimulating)}
              onReset={() => setIsSimulating(false)}
              onNext={() => {
                const idx = AI_MODULES.findIndex(m => m.id === activeModuleId);
                if (idx < AI_MODULES.length - 1) handleSelectModule(AI_MODULES[idx + 1].id);
              }}
              onPrev={() => {
                const idx = AI_MODULES.findIndex(m => m.id === activeModuleId);
                if (idx > 0) handleSelectModule(AI_MODULES[idx - 1].id);
              }}
              isPlaying={isSimulating}
            />
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-blue-400">Current Task</h4>
              <p>{activeModule.task}</p>
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={onClose || (() => window.history.back())}
        />
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[80] bg-black/90 p-4 animate-in fade-in duration-200 flex flex-col">
            <button onClick={() => setIsSidebarOpen(false)} className="self-end p-2 text-white mb-4"><X size={24} /></button>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                activeModuleId={activeModuleId}
                onSelectModule={(id) => {
                  handleSelectModule(id);
                  setIsSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col md:flex-row min-h-screen md:h-screen w-full bg-slate-950 overflow-y-auto md:overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-white/10 shrink-0 sticky top-0 z-50">
          <h1 className="text-cyan-400 font-bold text-lg">AI Security Lab</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Left Navigation (Responsive Drawer) */}
        <div className={`${isSidebarOpen ? 'fixed inset-0 z-40 bg-slate-950/95 pt-20 px-4' : 'hidden'} md:block md:relative md:bg-transparent md:z-auto md:w-auto md:p-0 h-full overflow-y-auto w-full md:w-64 shrink-0 transition-all duration-300 md:opacity-100`}>
          <Sidebar
            activeModuleId={activeModuleId}
            onSelectModule={(id) => {
              handleSelectModule(id);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Interactive Workspace */}
        <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-y-auto md:overflow-hidden">
          <SimulationEngine
            module={activeModule}
            isSimulating={isSimulating}
            onStartSim={() => setIsSimulating(true)}
            onEndSim={() => setIsSimulating(false)}
          />

          {/* Right Info Panel */}
          <DefensePanel module={activeModule} />
        </main>

        {/* Lab Grid Overlay - Subtle Visual Layer */}
        <div className="fixed inset-0 pointer-events-none z-50 overflow-y-auto md:overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0)_0%,rgba(18,24,38,1)_100%),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:100%_100%,40px_40px,40px_40px]"></div>
        </div>
      </div>
    </>
  );
};

export default App;
