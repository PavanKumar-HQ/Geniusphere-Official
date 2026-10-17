
import React, { useEffect, useState, useRef } from 'react';
import { LabStep } from '../types';
import { 
  Thermometer, Router, Cloud, Fan, Lightbulb, Lock, 
  Camera, Shield, UserX, Sun, Cpu, Zap, Database, Activity,
  Server, Wifi, Signal, Terminal
} from 'lucide-react';

interface SimulationCanvasProps {
  currentStep: LabStep;
  isPaused: boolean;
  simplifiedMode: boolean;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ currentStep, isPaused, simplifiedMode }) => {
  const [temp, setTemp] = useState(24);
  const [light, setLight] = useState(450);
  const [dataPackets, setDataPackets] = useState<{ id: number }[]>([]);
  const packetIdRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTemp((prev) => (prev < 32 ? prev + 0.1 : 32.1));
      setLight((prev) => (Math.random() > 0.5 ? prev + 1 : prev - 1));
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (currentStep < LabStep.DATA_COLLECTION || isPaused) {
      setDataPackets([]);
      return;
    }
    const interval = setInterval(() => {
      packetIdRef.current++;
      setDataPackets(prev => [...prev.slice(-8), { id: packetIdRef.current }]);
    }, simplifiedMode ? 3000 : 1800);
    return () => clearInterval(interval);
  }, [currentStep, isPaused, simplifiedMode]);

  const ModuleBadge = ({ text, color = '#3BF0FF', active = false }: { text: string; color?: string; active?: boolean }) => (
    <div 
      className={`absolute -top-3 left-3 px-2 py-0.5 rounded border text-[8px] font-mono font-bold tracking-widest z-10 transition-all ${
        active ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
      }`}
      style={{ backgroundColor: `${color}${active ? '20' : '05'}`, borderColor: `${color}${active ? '60' : '20'}`, color }}
    >
      {text}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case LabStep.ACTIVATION:
      case LabStep.DATA_COLLECTION:
      case LabStep.CONNECTIVITY:
      case LabStep.CLOUD_PROCESSING:
      case LabStep.AUTOMATION:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-8 pt-20">
            <div className="w-full max-w-5xl flex items-center justify-between gap-4">
              
              {/* SENSOR ARRAY */}
              <div className="flex flex-col gap-10">
                <div className={`relative w-28 h-28 rounded-lg glass-card flex flex-col items-center justify-center border transition-all duration-500
                  ${currentStep >= LabStep.ACTIVATION ? 'border-[#3BF0FF] neon-glow-cyan' : 'border-white/5 opacity-30'}
                  ${currentStep === LabStep.ACTIVATION ? 'bg-[#3BF0FF]/5' : ''}`}
                >
                  <ModuleBadge text="TEMP_DHT11" active={currentStep >= LabStep.ACTIVATION} />
                  <Thermometer className={`w-8 h-8 mb-1 ${currentStep >= LabStep.ACTIVATION ? 'text-[#3BF0FF]' : 'text-white/10'}`} />
                  <span className="text-[10px] font-mono font-bold">{temp.toFixed(1)}°C</span>
                  <div className="absolute -bottom-5 text-[8px] font-mono text-white/40">SENSE_PHASE</div>
                </div>

                <div className={`relative w-28 h-28 rounded-lg glass-card flex flex-col items-center justify-center border transition-all duration-500
                  ${currentStep >= LabStep.DATA_COLLECTION ? 'border-[#3BF0FF] neon-glow-cyan' : 'border-white/5 opacity-30'}
                  ${currentStep === LabStep.DATA_COLLECTION ? 'bg-[#3BF0FF]/5' : ''}`}
                >
                  <ModuleBadge text="LIGHT_LDR" active={currentStep >= LabStep.DATA_COLLECTION} />
                  <Sun className={`w-8 h-8 mb-1 ${currentStep >= LabStep.DATA_COLLECTION ? 'text-[#3BF0FF]' : 'text-white/10'}`} />
                  <span className="text-[10px] font-mono font-bold">{light} LUX</span>
                </div>
              </div>

              {/* DATA FLOW 1 */}
              <div className="flex-1 h-32 relative">
                <svg className="w-full h-full overflow-visible">
                  <path d="M 0 40 Q 50 40, 75 64 T 150 64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M 0 88 Q 50 88, 75 64 T 150 64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                  {currentStep >= LabStep.CONNECTIVITY && !isPaused && dataPackets.map((p, i) => (
                    <circle key={p.id} r="3" fill="#4DA3FF" className="animate-data-flow">
                       <animateMotion dur="2.5s" repeatCount="indefinite" path={i % 2 === 0 ? "M 0 40 Q 50 40, 75 64 T 150 64" : "M 0 88 Q 50 88, 75 64 T 150 64"} />
                    </circle>
                  ))}
                </svg>
              </div>

              {/* CONNECTIVITY HUB */}
              <div className="flex flex-col items-center gap-2">
                <div className={`relative w-32 h-32 rounded-2xl glass-card flex items-center justify-center border transition-all duration-500
                  ${currentStep >= LabStep.CONNECTIVITY ? 'border-[#4DA3FF] bg-[#4DA3FF]/5 shadow-sm' : 'border-white/5 opacity-30'}`}
                >
                  <ModuleBadge text="ESP32_GATEWAY" color="#4DA3FF" active={currentStep >= LabStep.CONNECTIVITY} />
                  <div className="relative">
                    <Wifi className={`w-12 h-12 ${currentStep >= LabStep.CONNECTIVITY ? 'text-[#4DA3FF]' : 'text-white/10'}`} />
                    {currentStep >= LabStep.CONNECTIVITY && <Signal className="absolute -top-3 -right-3 w-5 h-5 text-[#4DA3FF] animate-pulse" />}
                  </div>
                </div>
                <div className="text-[8px] font-mono text-white/40 uppercase">SEND_PHASE</div>
              </div>

              {/* DATA FLOW 2 */}
              <div className="flex-1 h-1 relative">
                <div className="w-full h-px bg-white/5" />
                {currentStep >= LabStep.CONNECTIVITY && !isPaused && dataPackets.map(p => (
                   <div key={p.id} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#7C6BFF] rounded-full animate-data-travel-2" />
                ))}
              </div>

              {/* CLOUD SERVER */}
              <div className="relative flex flex-col items-center gap-2">
                <div className={`relative w-40 h-40 rounded-3xl glass-card flex flex-col items-center justify-center border transition-all duration-700
                  ${currentStep >= LabStep.CLOUD_PROCESSING ? 'border-[#7C6BFF] bg-[#7C6BFF]/5' : 'border-white/5 opacity-30'}`}
                >
                  <ModuleBadge text="REMOTE_CLOUD" color="#7C6BFF" active={currentStep >= LabStep.CLOUD_PROCESSING} />
                  <Cloud className={`w-16 h-16 ${currentStep >= LabStep.CLOUD_PROCESSING ? 'text-[#7C6BFF] animate-bounce' : 'text-white/10'}`} />
                </div>
                <div className="text-[8px] font-mono text-white/40 uppercase">PROCESS_PHASE</div>

                {currentStep >= LabStep.CLOUD_PROCESSING && (
                  <div className="absolute top-1/2 left-[105%] w-48 glass-card border border-[#7C6BFF]/20 p-3 rounded-lg z-20 shadow-xl">
                    <div className="flex items-center gap-2 mb-1 border-b border-white/5 pb-1">
                      <Terminal className="w-3 h-3 text-[#7C6BFF]" />
                      <span className="text-[9px] font-mono uppercase text-[#7C6BFF]">Cloud_Terminal</span>
                    </div>
                    <div className="text-[8px] font-mono text-white/60 leading-tight">
                      {`> IF temperature > 30.0`}<br />
                      {`> STATUS: TRIGGER_FAN_ON`}
                    </div>
                  </div>
                )}
              </div>

              {/* DATA FLOW 3 (Backwards Command) */}
              <div className="flex-1 h-1 relative">
                 <div className="w-full h-px bg-white/5" />
                 {currentStep >= LabStep.AUTOMATION && !isPaused && (
                   <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00FFA3] rounded-sm animate-data-travel-3" />
                 )}
              </div>

              {/* ACTUATOR ARRAY */}
              <div className="flex flex-col gap-10">
                <div className={`relative w-28 h-28 rounded-lg glass-card flex flex-col items-center justify-center border transition-all duration-500
                  ${currentStep >= LabStep.AUTOMATION ? 'border-[#00FFA3] neon-glow-green' : 'border-white/5 opacity-30'}`}
                >
                  <ModuleBadge text="FAN_RELAY" color="#00FFA3" active={currentStep >= LabStep.AUTOMATION} />
                  <div className={`${currentStep >= LabStep.AUTOMATION && temp > 30 ? 'animate-spin' : ''} duration-[400ms]`}>
                    <Fan className={`w-10 h-10 ${currentStep >= LabStep.AUTOMATION ? 'text-[#00FFA3]' : 'text-white/10'}`} />
                  </div>
                  <div className="absolute -bottom-5 text-[8px] font-mono text-white/40">ACT_PHASE</div>
                </div>
                
                <div className={`relative w-28 h-28 rounded-lg glass-card flex flex-col items-center justify-center border transition-all duration-500
                  ${currentStep >= LabStep.AUTOMATION ? 'border-[#00FFA3] opacity-100' : 'border-white/5 opacity-30'}`}
                >
                  <ModuleBadge text="LIGHT_DIMMER" color="#00FFA3" active={currentStep >= LabStep.AUTOMATION} />
                  <Lightbulb className={`w-10 h-10 ${currentStep >= LabStep.AUTOMATION && light < 400 ? 'text-[#FACC15]' : 'text-white/10'}`} />
                </div>
              </div>

            </div>
          </div>
        );

      case LabStep.SMART_HOME:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-8 pt-16">
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">Network Ecosystem Simulation</div>
            <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
               {[
                 { label: 'Bedroom A', icon: Lightbulb, color: '#3BF0FF' },
                 { label: 'Main Lock', icon: Lock, color: '#3BF0FF' },
                 { label: 'Garden Cam', icon: Camera, color: '#3BF0FF' },
                 { label: 'HVAC Sys', icon: Zap, color: '#3BF0FF' }
               ].map((d, i) => (
                 <div key={i} className="glass-card border border-white/5 p-4 rounded-xl flex flex-col items-center group cursor-pointer hover:border-[#3BF0FF]/30 transition-all">
                    <d.icon className="w-8 h-8 mb-2 text-white/20 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-bold text-white/40 group-hover:text-[#3BF0FF]">{d.label}</span>
                 </div>
               ))}
            </div>
            
            <div className="relative">
               <div className="relative w-64 h-[380px] rounded-[40px] glass-card border-4 border-white/5 bg-[#070B1A] p-6 shadow-2xl">
                  <div className="w-16 h-1 bg-white/10 rounded-full mx-auto mb-6" />
                  <div className="space-y-4">
                     <div className="text-center">
                        <h4 className="text-xl font-bold tracking-tight">HomeConnect</h4>
                        <div className="text-[8px] font-mono text-[#3BF0FF]">SECURE_LINK_ACTIVE</div>
                     </div>
                     {[1,2,3].map(i => (
                       <div key={i} className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-[#00FFA3]" />
                             <div className="text-[10px] font-bold">NODE_{i}0x</div>
                          </div>
                          <div className="text-[9px] font-mono text-white/40">ON</div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case LabStep.SECURITY_RISK:
      case LabStep.SECURITY_DEFENSE:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 pt-20">
             <div className="relative w-72 h-72 rounded-[32px] glass-card border-2 flex flex-col items-center justify-center transition-all duration-1000
                ${currentStep === LabStep.SECURITY_RISK ? 'border-[#FF4D4D] bg-[#FF4D4D]/5' : 'border-[#00FFA3] bg-[#00FFA3]/5'}"
             >
                <ModuleBadge text="CORE_IOT_PROCESSOR" color={currentStep === LabStep.SECURITY_RISK ? '#FF4D4D' : '#00FFA3'} active />
                
                {currentStep === LabStep.SECURITY_RISK ? (
                  <div className="flex flex-col items-center">
                    <Cpu className="w-20 h-20 text-[#FF4D4D] mb-4 animate-pulse" />
                    <div className="text-[10px] font-mono font-bold text-[#FF4D4D] border border-[#FF4D4D]/30 px-3 py-1 rounded">THREAT_ACTIVE</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Shield className="w-20 h-20 text-[#00FFA3] mb-4" />
                    <div className="text-[10px] font-mono font-bold text-[#00FFA3] border border-[#00FFA3]/30 px-3 py-1 rounded">SECURED</div>
                  </div>
                )}
             </div>

             {currentStep === LabStep.SECURITY_RISK && (
               <div className="absolute left-16 top-1/2 -translate-y-1/2 animate-in slide-in-from-left-8 duration-500">
                  <div className="glass-card border border-[#FF4D4D]/50 p-4 rounded-xl shadow-2xl">
                     <ModuleBadge text="ATTACK_VECTOR" color="#FF4D4D" active />
                     <UserX className="w-10 h-10 text-[#FF4D4D] mb-2 mx-auto" />
                     <div className="text-[8px] font-mono text-[#FF4D4D]/80">
                        {`> brute_force active`}<br />
                        {`> targeting: PORT_80`}
                     </div>
                  </div>
               </div>
             )}

             <div className="mt-12 w-full max-w-xl grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-lg border border-white/5">
                   <div className="text-[9px] font-mono text-white/40 mb-2 uppercase tracking-widest">Auth_Protocol</div>
                   <div className={`text-xs font-bold ${currentStep === LabStep.SECURITY_DEFENSE ? 'text-[#00FFA3]' : 'text-[#FF4D4D]'}`}>
                      {currentStep === LabStep.SECURITY_DEFENSE ? 'SHA-256_HASH' : 'PLAIN_TEXT'}
                   </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-white/5">
                   <div className="text-[9px] font-mono text-white/40 mb-2 uppercase tracking-widest">Update_State</div>
                   <div className={`text-xs font-bold ${currentStep === LabStep.SECURITY_DEFENSE ? 'text-[#00FFA3]' : 'text-white/20'}`}>
                      {currentStep === LabStep.SECURITY_DEFENSE ? 'v2.1_PATCHED' : 'UNSTABLE'}
                   </div>
                </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-hidden relative">
       <div className="w-full h-full relative z-10">
          {renderStepContent()}
       </div>

       <style>{`
          .animate-spin-slow { animation: spin 15s linear infinite; }
          .animate-data-flow { filter: drop-shadow(0 0 2px currentColor); }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          
          @keyframes travel-2 {
            from { left: 0%; opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            to { left: 100%; opacity: 0; }
          }
          @keyframes travel-3 {
            from { left: 100%; opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            to { left: 0%; opacity: 0; }
          }
          .animate-data-travel-2 { animation: travel-2 2s infinite linear; }
          .animate-data-travel-3 { animation: travel-3 2s infinite linear; }
       `}</style>
    </div>
  );
};

export default SimulationCanvas;
