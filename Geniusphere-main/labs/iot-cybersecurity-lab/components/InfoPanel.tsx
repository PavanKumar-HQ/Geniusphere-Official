
import React from 'react';
import { Shield, HelpCircle, BookOpen, AlertTriangle } from 'lucide-react';
import { LabStep } from '../types';
import { STEPS } from '../constants';

interface InfoPanelProps {
  simplifiedMode: boolean;
  setSimplifiedMode: (val: boolean) => void;
  currentStep: LabStep;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ simplifiedMode, setSimplifiedMode, currentStep }) => {
  const stepInfo = STEPS.find(s => s.id === currentStep);

  return (
    <aside className="w-full md:w-80 border-l border-white/10 flex flex-col bg-[#070B1A]/60 backdrop-blur-xl p-6 overflow-y-auto z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
      {/* Dynamic Explanation Area */}
      <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
           <BookOpen className="w-10 h-10 text-[#3BF0FF]" />
        </div>
        <h3 className="text-[10px] font-mono text-[#3BF0FF] uppercase tracking-widest mb-3 flex items-center gap-2">
          <BookOpen className="w-3 h-3" />
          Technical Insight
        </h3>
        <p className="text-sm text-white/90 leading-relaxed font-medium">
          {stepInfo?.insight || "Select a module to learn more about its role in the IoT system."}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="mb-8">
        <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer group hover:bg-white/10 transition-all">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-[#3BF0FF] transition-colors">Simplified Mode</span>
            <span className="text-[10px] text-white/40 font-mono">Slow speed & plain terms</span>
          </div>
          <div 
            className={`w-10 h-5 rounded-full p-1 transition-colors ${simplifiedMode ? 'bg-[#00FFA3]' : 'bg-white/20'}`}
            onClick={() => setSimplifiedMode(!simplifiedMode)}
          >
            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${simplifiedMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </label>
      </div>

      {/* Security Context */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-[#FF4D4D]" />
          <h3 className="text-xs font-mono text-white uppercase tracking-wider">Cybersecurity Checklist</h3>
        </div>
        <div className="space-y-2">
          {[
            'Strong, unique passwords',
            'Latest firmware installed',
            'Hidden Wi-Fi SSID',
            'Encryption enabled (WPA3)',
            'Disabled unused protocols'
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 text-xs text-white/60 p-2 rounded-lg bg-white/5 border border-transparent hover:border-white/10 transition-all">
              <span className="text-[#FF4D4D] font-mono leading-none">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Did You Know */}
      <div className="mt-auto">
        <div className="bg-[#3BF0FF]/5 border border-[#3BF0FF]/20 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#3BF0FF]" />
            <h4 className="text-xs font-bold text-white uppercase">Real-World Fact</h4>
          </div>
          <p className="text-xs text-white/70 leading-relaxed italic">
            "By 2030, there will be over 30 billion IoT devices globally—that's more than 3 devices for every person on Earth!"
          </p>
        </div>
      </div>
    </aside>
  );
};

export default InfoPanel;
