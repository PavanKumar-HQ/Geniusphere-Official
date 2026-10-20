
import React, { useMemo } from 'react';
import { ScoreState, Choice } from '../types';

interface FeedbackPanelProps {
  scores: ScoreState;
  lastChoice: Choice | null;
  simplified: boolean;
  history: any[];
  showReport: boolean;
  onCloseReport: () => void;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ scores, lastChoice, simplified, history, showReport, onCloseReport }) => {
  const getProgressColor = (val: number) => {
    if (val < 40) return 'bg-[#FF4D4D]';
    if (val < 70) return 'bg-[#4DA3FF]';
    return 'bg-[#2AFFA2]';
  };

  const scoreItems = [
    { label: 'Clarity', value: scores.clarity, color: '#4DA3FF' },
    { label: 'Listening', value: scores.listening, color: '#2AFFA2' },
    { label: 'Confidence', value: scores.confidence, color: '#8B7CFF' },
    { label: 'Respect', value: scores.respect, color: '#FF4D4D' },
  ];

  const tips = useMemo(() => {
    if (scores.clarity < 60) return "Try using smaller words and shorter sentences.";
    if (scores.listening < 60) return "Pause more. Notice what others are doing while you speak.";
    if (scores.confidence < 60) return "Take deep breaths. Your voice is important!";
    if (scores.respect < 60) return "Consider how your tone affects others' feelings.";
    return "You're doing great! Keep practicing active listening.";
  }, [scores]);

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Metrics Card */}
      <div className="bg-[#1F2937]/50 border border-[#374151] rounded-2xl p-6 backdrop-blur-md shrink-0">
        <h3 className="text-xs font-bold text-[#E6E9F0]/40 uppercase tracking-widest mb-4">Live Performance</h3>
        <div className="space-y-4">
          {scoreItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-[#E6E9F0]/80">{item.label}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
              </div>
              <div className="h-2 w-full bg-[#111827] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full`}
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback/Tips Card */}
      <div className="flex-1 bg-[#1F2937]/50 border border-[#374151] rounded-2xl p-6 backdrop-blur-md overflow-hidden flex flex-col">
        {!simplified ? (
          <>
            <h3 className="text-xs font-bold text-[#E6E9F0]/40 uppercase tracking-widest mb-4">Improvement Tips</h3>
            <div className="flex-1 overflow-y-auto scroll-hide">
              <div className="bg-[#111827]/50 rounded-xl p-4 border-l-4 border-[#8B7CFF] mb-4">
                <p className="text-sm text-[#E6E9F0]/90 leading-relaxed italic">
                  "{tips}"
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#E6E9F0]/30 uppercase tracking-widest">Mistakes to Avoid</p>
                <div className="flex items-center gap-2 text-xs text-[#FF4D4D]/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" />
                  <span>Speaking too fast when nervous</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#FF4D4D]/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" />
                  <span>Interrupting during silences</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#FF4D4D]/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D]" />
                  <span>Vague digital messages</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-4">
             <p className="text-sm text-[#E6E9F0]/40">Simplified mode hides detailed analytics to focus on the story.</p>
          </div>
        )}
      </div>

      {/* Report Modal Placeholder */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-black/40">
           <div className="bg-[#111827] border border-[#374151] w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative">
              <button 
                onClick={onCloseReport}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Communication Report</h2>
                <p className="text-[#E6E9F0]/60">Your journey through the practical lab</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {scoreItems.map(item => (
                  <div key={item.label} className="bg-[#1F2937] p-4 rounded-2xl border border-[#374151] flex flex-col items-center">
                    <span className="text-xs uppercase text-[#E6E9F0]/40 mb-1">{item.label}</span>
                    <span className="text-2xl font-black" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scroll-hide">
                 <h4 className="text-sm font-bold border-b border-[#374151] pb-2">Skill Breakdown</h4>
                 {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                       <span className="text-[#E6E9F0]/60 italic">Scenario {i+1}: {h.choice.lesson}</span>
                       <span className="text-[#2AFFA2] font-bold">Passed</span>
                    </div>
                 ))}
                 {history.length === 0 && <p className="text-center py-8 text-gray-500">No data yet. Complete some scenarios!</p>}
              </div>

              <button 
                onClick={onCloseReport}
                className="w-full mt-8 py-4 bg-[#4DA3FF] text-white font-bold rounded-2xl hover:bg-[#3B8BE0] transition-all"
              >
                CLOSE REPORT
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;
