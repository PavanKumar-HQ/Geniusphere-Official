
import React, { useState, useEffect, useRef } from 'react';
import { AIModule } from '../types';
// Add Shield to the imported icons
import { Play, Terminal, Info, CheckCircle, Shield } from './Icons';

interface SimulationEngineProps {
  module: AIModule;
  isSimulating: boolean;
  onStartSim: () => void;
  onEndSim: () => void;
  minimal?: boolean;
}

export const SimulationEngine: React.FC<SimulationEngineProps> = ({
  module,
  isSimulating,
  onStartSim,
  onEndSim,
  minimal = false
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSimulating) {
      setLogs(['[SYSTEM] INITIALIZING LAB ENVIRONMENT...', `[SCENARIO] ${module.scenario.toUpperCase()}`]);
      setActiveStep(0);

      const interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev < module.flow.length) {
            setLogs(current => [...current, `[PROCESSED] ${module.flow[prev]}`]);
            return prev + 1;
          }
          clearInterval(interval);
          setLogs(current => [...current, '[COMPLETE] SIMULATION SEQUENCE FINISHED.']);
          return prev;
        });
      }, 1500);

      return () => clearInterval(interval);
    } else {
      setLogs([]);
      setActiveStep(0);
    }
  }, [isSimulating, module]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden min-h-[60vh] md:min-h-0">
      {!minimal && <div className="scanline"></div>}

      {/* Header Area */}
      {!minimal && (
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase border border-cyan-500/20">
              Active Laboratory
            </span>
            <span className="text-slate-500 font-mono text-xs">LOC: {module.id.toUpperCase()} // ENV_v4</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{module.title}</h2>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <div className="flex gap-4">
              <div className="mt-1">
                <Info className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-slate-300 text-sm leading-relaxed">{module.scenario}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Lab Console */}
      <div className="flex-1 p-8 pt-4 flex flex-col gap-6 overflow-hidden">

        {/* Visual Lab Space */}
        <div className="flex-1 rounded-2xl bg-black border border-slate-800 overflow-hidden relative group">
          {!isSimulating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 animate-pulse border border-cyan-500/30">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Initialize Simulation</h3>
              <p className="text-slate-500 text-sm mb-8 text-center max-w-md px-6">
                Ready to execute the {module.title} practical. Click play to begin the step-by-step analysis.
              </p>
              <button
                onClick={onStartSim}
                className="group relative px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                EXECUTE SIMULATION
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Animated Background Grids */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px]"></div>
              </div>

              {/* Lab Content */}
              <div className="flex-1 p-6 z-10 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-[10px] font-bold text-red-500 tracking-[0.2em]">LIVE_ANALYSIS_IN_PROGRESS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  {/* Left: Terminal Output */}
                  <div className="bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-xs p-4 flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                      <span className="text-slate-500">TERMINAL_OUTPUT</span>
                      <Terminal className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-cyan-400">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-slate-600">[{i}]</span>
                          <span className={`${log.startsWith('[SYSTEM]') ? 'text-white' : ''}`}>{log}</span>
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </div>

                  {/* Right: Steps Visualization */}
                  <div className="space-y-3 flex flex-col">
                    <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2">Protocol Sequence</div>
                    {module.flow.map((step, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border transition-all duration-500 flex items-center gap-4 ${i < activeStep
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                          : i === activeStep
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-100 animate-pulse'
                            : 'bg-slate-900/50 border-slate-800 text-slate-600'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${i < activeStep
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : i === activeStep
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}>
                          {i < activeStep ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight">{step}</span>
                          <span className="text-[10px] uppercase tracking-wider opacity-60">
                            {i < activeStep ? 'Verified' : i === activeStep ? 'Processing...' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {activeStep === module.flow.length && (
                      <div className="mt-auto p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          Practical Task:
                        </h4>
                        <p className="text-slate-400 text-xs italic">"{module.task}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset Control */}
              {activeStep === module.flow.length && (
                <div className="p-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={onEndSim}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Clear Simulation & Return
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
