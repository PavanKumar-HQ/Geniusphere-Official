import React from 'react';

interface DefendPageProps {
  onBack: () => void;
}

export const DefendPage: React.FC<DefendPageProps> = ({ onBack }) => {
  return (
    <div>
        <div className="flex justify-start mb-6">
            <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors">&larr; Back to Hub</button>
        </div>
        <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-green-400 mb-4">Protection Zone</h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                This area is under construction. Get ready to learn about firewalls, antivirus, and more by using them to stop live attacks!
            </p>
            <div className="p-8 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
                <p className="text-2xl text-slate-500">Interactive Defenses Coming Soon...</p>
            </div>
        </div>
    </div>
  );
};