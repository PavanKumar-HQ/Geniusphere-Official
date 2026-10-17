
import React from 'react';
import { Scenario, SkillType } from '../types';

interface SidebarProps {
  scenarios: Scenario[];
  currentIndex: number;
  history: any[];
  onSelectScenario: (idx: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ scenarios, currentIndex, history, onSelectScenario }) => {
  const getSkillColor = (type: SkillType) => {
    switch (type) {
      case SkillType.SPEAKING: return '#4DA3FF';
      case SkillType.LISTENING: return '#2AFFA2';
      case SkillType.BODY_LANGUAGE: return '#8B7CFF';
      case SkillType.TONE: return '#FFD54D';
      case SkillType.QUESTIONS: return '#4DA3FF';
      case SkillType.FEEDBACK: return '#2AFFA2';
      case SkillType.PUBLIC_SPEAKING: return '#8B7CFF';
      case SkillType.DIGITAL: return '#FFD54D';
      case SkillType.CONFLICT: return '#FF4D4D';
      default: return '#E6E9F0';
    }
  };

  return (
    <div className="bg-[#1F2937]/50 border border-[#374151] rounded-2xl h-full flex flex-col p-4 backdrop-blur-md overflow-hidden">
      <h3 className="text-xs font-bold text-[#E6E9F0]/40 uppercase tracking-widest mb-4 px-2">Skill Roadmap</h3>
      <div className="flex-1 overflow-y-auto scroll-hide space-y-2">
        {scenarios.map((s, idx) => {
          const isCompleted = idx < history.length;
          const isActive = idx === currentIndex;
          const isLocked = idx > history.length;
          const color = getSkillColor(s.title);

          return (
            <button
              key={s.id}
              disabled={isLocked}
              onClick={() => onSelectScenario(idx)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left group
                ${isActive ? 'bg-[#374151] ring-1 ring-[#4DA3FF]/50' : 'hover:bg-[#374151]/50'}
                ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div 
                className={`w-2 h-2 rounded-full`}
                style={{ backgroundColor: isLocked ? '#6B7280' : color }}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-[#E6E9F0]/70'}`}>
                  {s.title}
                </p>
                {isActive && (
                  <span className="text-[10px] text-[#4DA3FF] font-medium animate-pulse">CURRENT LESSON</span>
                )}
              </div>
              {isCompleted && (
                <svg className="w-5 h-5 text-[#2AFFA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isLocked && (
                <svg className="w-4 h-4 text-[#E6E9F0]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#374151]">
        <div className="bg-[#111827] rounded-xl p-3">
          <p className="text-[10px] font-bold text-[#E6E9F0]/40 uppercase mb-2">Did You Know?</p>
          <p className="text-xs leading-relaxed italic text-[#E6E9F0]/80">
            "More than half of communication is non-verbal."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
