import React from 'react';

interface SimulatePageProps {
  onBack: () => void;
}

export const SimulatePage: React.FC<SimulatePageProps> = ({ onBack }) => {
  return (
    <div>
       <div className="flex justify-start mb-6">
         <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors">&larr; Back to Hub</button>
      </div>
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 mb-4">Cyber Lab</h2>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            This area is under construction. Soon, you'll be able to safely launch and observe simulated cyber attacks in real-time!
        </p>
        <div className="p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
            <p className="text-2xl text-slate-500">Simulation Zone Coming Soon...</p>
        </div>
      </div>
    </div>
  );
};