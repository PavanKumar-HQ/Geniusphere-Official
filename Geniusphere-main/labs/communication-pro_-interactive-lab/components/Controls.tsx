
import React from 'react';

interface ControlsProps {
  status: 'idle' | 'active' | 'finished';
  onReset: () => void;
  onStart: () => void;
  onViewReport: () => void;
  canViewReport: boolean;
}

const Controls: React.FC<ControlsProps> = ({ status, onReset, onStart, onViewReport, canViewReport }) => {
  return (
    <div className="bg-[#1F2937]/80 border border-[#374151] rounded-2xl px-6 py-4 backdrop-blur-md flex items-center justify-between shadow-lg shadow-black/20">
      <div className="flex gap-4">
        {status === 'idle' ? (
          <button 
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-2 bg-[#4DA3FF] hover:bg-[#3B8BE0] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#4DA3FF]/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            START SCENARIO
          </button>
        ) : (
          <button 
            disabled
            className="flex items-center gap-2 px-6 py-2 bg-[#111827] text-gray-500 font-bold rounded-xl transition-all border border-[#374151] cursor-not-allowed opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            PAUSE
          </button>
        )}
        
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-2 hover:bg-[#374151] text-[#E6E9F0]/60 hover:text-white font-bold rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          RESET
        </button>
      </div>

      <button 
        onClick={onViewReport}
        disabled={!canViewReport}
        className={`flex items-center gap-2 px-6 py-2 font-bold rounded-xl transition-all 
          ${canViewReport 
            ? 'bg-[#8B7CFF] hover:bg-[#7A6AEF] text-white shadow-lg shadow-[#8B7CFF]/20' 
            : 'bg-[#1F2937] text-gray-500 border border-[#374151] cursor-not-allowed opacity-50'
          }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        VIEW COMMUNICATION REPORT
      </button>
    </div>
  );
};

export default Controls;
