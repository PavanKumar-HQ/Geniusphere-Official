
import React from 'react';
import { THEME } from '../constants';

interface SimulationStageProps {
  currentStep: number;
  simplifiedMode: boolean;
}

const SimulationStage: React.FC<SimulationStageProps> = ({ currentStep, simplifiedMode }) => {
  const renderStepVisual = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-gray-400 rounded-lg flex items-center justify-center bg-gray-900">
                <span className="text-4xl">🏛️</span>
              </div>
              <div className="absolute -right-12 top-0 flex flex-col space-y-2">
                <span className="text-red-500 font-bold animate-bounce">$ FEE</span>
                <span className="text-red-500 font-bold animate-bounce delay-75">$ FEE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 w-1/4 animate-[move_3s_infinite_linear]"></div>
            </div>
            <p className="text-gray-400 italic">Processing... (Takes 3-5 Business Days)</p>
            <style>{`
              @keyframes move {
                from { transform: translateX(-100%); }
                to { transform: translateX(400%); }
              }
            `}</style>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-cyan-500/30 animate-spin-slow"></div>
              <div className="absolute w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute text-7xl animate-pulse">🪙</div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center h-full space-x-4">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className="w-20 h-20 border-2 border-cyan-400 bg-cyan-900/20 rounded flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(59,240,255,0.3)]">
                  #{i}
                </div>
                {i < 3 && <div className="w-8 h-1 bg-cyan-400/50 shadow-[0_0_10px_rgba(59,240,255,0.2)]"></div>}
              </React.Fragment>
            ))}
            <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded flex items-center justify-center text-gray-600 animate-pulse">
              +
            </div>
          </div>
        );
      case 4:
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_#7C6BFF]"
                style={{
                  top: `${Math.sin(i * 45) * 100 + 150}px`,
                  left: `${Math.cos(i * 45) * 100 + 150}px`
                }}
              />
            ))}
            <div className="w-full h-full opacity-20">
              <svg className="w-full h-full">
                <line x1="150" y1="50" x2="250" y2="150" stroke="#7C6BFF" strokeWidth="1" />
                <line x1="250" y1="150" x2="150" y2="250" stroke="#7C6BFF" strokeWidth="1" />
                <line x1="150" y1="250" x2="50" y2="150" stroke="#7C6BFF" strokeWidth="1" />
                <line x1="50" y1="150" x2="150" y2="50" stroke="#7C6BFF" strokeWidth="1" />
                <line x1="150" y1="50" x2="150" y2="250" stroke="#7C6BFF" strokeWidth="1" />
                <line x1="50" y1="150" x2="250" y2="150" stroke="#7C6BFF" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute text-purple-300 font-bold uppercase tracking-widest text-xs">P2P Network</div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="flex space-x-12">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-green-900/20 border-2 border-green-500 rounded-xl flex items-center justify-center text-3xl mb-2">👁️</div>
                <span className="text-xs text-green-400 font-mono">Public Key</span>
                <span className="text-[10px] text-gray-500 font-mono">1BvBMSEY...</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-red-900/20 border-2 border-red-500 rounded-xl flex items-center justify-center text-3xl mb-2">🔒</div>
                <span className="text-xs text-red-400 font-mono">Private Key</span>
                <span className="text-[10px] text-gray-500 font-mono">••••••••••</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-xs text-center">Think of it like a mailbox: Anyone can send mail (Public), but only you have the key to open it (Private).</p>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-12">
            <div className="flex items-center space-x-20">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-2xl border border-blue-400">👤</div>
              <div className="relative w-32 h-2 bg-gray-800 rounded-full">
                <div className="absolute top-1/2 left-0 w-4 h-4 bg-green-400 rounded-full -translate-y-1/2 animate-[flow_2s_infinite]"></div>
              </div>
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl border border-purple-400">👤</div>
            </div>
            <div className="w-48 p-3 bg-green-900/20 border border-green-500 rounded text-center">
              <div className="text-xs text-green-400 font-bold mb-1">VALIDATING...</div>
              <div className="h-1 bg-green-500/30 w-full rounded">
                 <div className="h-full bg-green-500 w-full animate-pulse"></div>
              </div>
            </div>
            <style>{`
              @keyframes flow {
                0% { left: 0%; opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { left: 100%; opacity: 0; }
              }
            `}</style>
          </div>
        );
      case 7:
        if (simplifiedMode) return <div className="h-full flex items-center justify-center text-gray-500 italic">Advanced Validation Visualization Hidden</div>;
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 border border-purple-500/50 rounded bg-purple-900/10 flex flex-col items-center">
                  <span className="text-xl mb-1">💻</span>
                  <span className="text-[10px] font-mono text-purple-300">Solving...</span>
                  <div className="w-full h-1 bg-purple-900 mt-2">
                    <div className="h-full bg-purple-400 animate-[progress_2s_infinite]" style={{ animationDelay: `${i * 0.5}s` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-yellow-400 font-bold text-sm animate-bounce">🏆 BLOCK REWARD ISSUED</div>
            <style>{`
              @keyframes progress {
                0% { width: 0%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        );
      case 8:
        if (simplifiedMode) return <div className="h-full flex items-center justify-center text-gray-500 italic">Volatility Chart Hidden</div>;
        return (
          <div className="flex flex-col items-center justify-center h-full w-full p-8">
            <div className="w-full h-40 border-l-2 border-b-2 border-gray-600 relative overflow-hidden">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path 
                  d="M0,80 L10,20 L20,90 L30,40 L40,10 L50,60 L60,30 L70,85 L80,15 L90,50 L100,20" 
                  fill="none" 
                  stroke={THEME.risk} 
                  strokeWidth="2"
                  className="animate-[dash_5s_linear_infinite]"
                  style={{ strokeDasharray: '200', strokeDashoffset: '200' }}
                 />
               </svg>
               <div className="absolute top-2 right-2 flex items-center space-x-2 text-red-500">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-xs font-bold">HIGH RISK</span>
               </div>
            </div>
            <div className="mt-4 flex space-x-12">
               <div className="text-green-400 text-xl font-bold">▲ +45%</div>
               <div className="text-red-400 text-xl font-bold">▼ -60%</div>
            </div>
            <style>{`
              @keyframes dash {
                to { strokeDashoffset: 0; }
              }
            `}</style>
          </div>
        );
      case 9:
        return (
          <div className="grid grid-cols-3 gap-6 h-full items-center p-4">
            <div className="flex flex-col items-center p-3 border border-cyan-500/30 rounded">
               <span className="text-3xl mb-2">🌍</span>
               <span className="text-[10px] text-center font-bold">Global Payments</span>
            </div>
            <div className="flex flex-col items-center p-3 border border-cyan-500/30 rounded">
               <span className="text-3xl mb-2">📜</span>
               <span className="text-[10px] text-center font-bold">Smart Contracts</span>
            </div>
            <div className="flex flex-col items-center p-3 border border-cyan-500/30 rounded">
               <span className="text-3xl mb-2">🎨</span>
               <span className="text-[10px] text-center font-bold">Digital Ownership</span>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-red-900/30 border-2 border-red-500 rounded-full flex items-center justify-center text-4xl animate-pulse">⚠️</div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white animate-bounce">SCAM</div>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <p className="text-sm font-bold text-red-400">Lost keys = Lost funds forever</p>
              <p className="text-xs text-gray-400 max-w-xs">There is no "Forgot Password" button in decentralized systems.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full glass rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      {renderStepVisual()}
    </div>
  );
};

export default SimulationStage;
