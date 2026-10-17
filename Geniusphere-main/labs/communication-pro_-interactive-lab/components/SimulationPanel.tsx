
import React from 'react';
import { Scenario, Choice } from '../types';

interface SimulationPanelProps {
  scenario: Scenario;
  status: 'idle' | 'active' | 'finished';
  onChoice: (choice: Choice) => void;
  lastChoice: Choice | null;
  onNext: () => void;
  onStart: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ scenario, status, onChoice, lastChoice, onNext, onStart }) => {
  if (status === 'idle') {
    return (
      <div className="bg-[#1F2937]/30 border border-[#374151] rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center backdrop-blur-sm">
        <div className="w-24 h-24 bg-[#4DA3FF]/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <svg className="w-12 h-12 text-[#4DA3FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Ready to level up your communication?</h2>
        <p className="text-[#E6E9F0]/60 mb-8 max-w-md">
          Dive into 9 interactive scenarios designed to build your confidence, listening skills, and clarity.
        </p>
        <button 
          onClick={onStart}
          className="px-8 py-4 bg-[#4DA3FF] hover:bg-[#3B8BE0] text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-[#4DA3FF]/20"
        >
          START PRACTICAL LAB
        </button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="bg-[#1F2937]/30 border border-[#374151] rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center backdrop-blur-sm">
        <div className="w-24 h-24 bg-[#2AFFA2]/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-[#2AFFA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4">Lab Complete!</h2>
        <p className="text-[#E6E9F0]/60 mb-8 max-w-md">
          You've navigated through all the real-life communication challenges. View your detailed report on the right.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1F2937]/30 border border-[#374151] rounded-2xl h-full flex flex-col p-6 backdrop-blur-sm overflow-hidden relative">
      {/* Animation Area */}
      <div className="flex-1 flex flex-col items-center justify-center mb-6 relative">
        <div className="w-full h-48 bg-[#111827]/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-[#4DA3FF]/20 rounded-full animate-ping"></div>
            </div>
          </div>
          
          {/* Visual Placeholder for Character Animations */}
          <div className="z-10 flex gap-12 items-end">
            {/* Student Character */}
            <div className="flex flex-col items-center">
               <div className={`w-16 h-24 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-3xl relative transition-all duration-500 ${lastChoice ? 'scale-105' : 'scale-100'}`}>
                  <div className="absolute -top-12 left-2 w-12 h-12 bg-[#F3E5AB] rounded-full border-2 border-gray-400">
                    <div className="absolute top-4 left-2 w-2 h-1 bg-gray-800 rounded-full"></div>
                    <div className="absolute top-4 right-2 w-2 h-1 bg-gray-800 rounded-full"></div>
                    <div className={`absolute bottom-2 left-4 w-4 h-2 bg-gray-800 rounded-full transition-all duration-300 ${lastChoice ? 'h-1' : 'h-2'}`}></div>
                  </div>
               </div>
               <span className="mt-2 text-[10px] font-bold text-[#4DA3FF]">YOU</span>
            </div>

            {/* Listener Character */}
            <div className="flex flex-col items-center">
               <div className={`w-16 h-24 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-3xl relative transition-all duration-500 ${lastChoice ? 'scale-110' : 'scale-100'}`}>
                  <div className="absolute -top-12 left-2 w-12 h-12 bg-[#DDBB99] rounded-full border-2 border-gray-400">
                    <div className="absolute top-4 left-2 w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className="absolute top-4 right-2 w-2 h-2 bg-gray-800 rounded-full"></div>
                    <div className={`absolute bottom-2 left-4 w-4 h-1 bg-gray-800 rounded-full transition-all duration-300`}></div>
                  </div>
               </div>
               <span className="mt-2 text-[10px] font-bold text-[#E6E9F0]/40">LISTENER</span>
            </div>
          </div>

          {/* Dialogue Bubbles */}
          {!lastChoice ? (
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs max-w-[200px]">
              {scenario.description}
            </div>
          ) : (
            <div className="absolute top-4 right-4 bg-[#4DA3FF]/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#4DA3FF]/30 text-xs text-[#4DA3FF] max-w-[200px] animate-bounce">
              {lastChoice.feedback}
            </div>
          )}
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-[#111827]/80 rounded-2xl p-6 border border-[#374151]">
        {!lastChoice ? (
          <>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#4DA3FF]/20 rounded-md flex items-center justify-center text-[#4DA3FF] text-sm">Q</span>
              {scenario.prompt}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenario.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice)}
                  className="p-4 bg-[#1F2937] hover:bg-[#374151] border border-[#374151] hover:border-[#4DA3FF] rounded-xl text-left transition-all duration-200 hover:-translate-y-1 active:translate-y-0 flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full border border-gray-500 mt-0.5 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {choice.id.slice(-1).toUpperCase()}
                  </div>
                  <span className="text-sm text-[#E6E9F0]/80 leading-snug">{choice.text}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="text-xs font-bold text-[#4DA3FF] uppercase tracking-widest mb-2">Lesson Learned</div>
            <p className="text-xl font-bold mb-6 italic">"{lastChoice.lesson}"</p>
            <button
              onClick={onNext}
              className="px-8 py-3 bg-[#4DA3FF] hover:bg-[#3B8BE0] text-white font-bold rounded-xl transition-all flex items-center gap-2"
            >
              Continue to Next Lesson
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPanel;
