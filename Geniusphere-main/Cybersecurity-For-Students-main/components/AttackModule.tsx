import React, { useState, useEffect, useCallback } from 'react';
import type { AttackModuleData, MiniSim, QuizQuestion } from '../types';
import { AnimationPlayer } from './AnimationPlayer';
import { CheckCircleIcon, XCircleIcon } from './icons';
import { textToSpeech } from '../utils/tts';
import { HighlightableText } from './HighlightableText';
import { KEYWORDS } from '../constants';
import { playSound } from '../utils/sounds';

interface AttackModuleProps {
  module: AttackModuleData;
  onComplete: (moduleId: string) => void;
  onBack: () => void;
}

export const AttackModule: React.FC<AttackModuleProps> = ({ module, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDefense, setShowDefense] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [miniSimCompleted, setMiniSimCompleted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isNarrating, setIsNarrating] = useState<Record<number, boolean>>({});
  const [focusAssist, setFocusAssist] = useState(true);
  const [isPausedForFocus, setIsPausedForFocus] = useState(false);

  const defenseStepIndex = module.animationSteps.length - 1;
  const preDefenseStepIndex = defenseStepIndex - 1;

  const totalDuration = module.animationSteps[defenseStepIndex].time;
  const progress = currentStep > preDefenseStepIndex && showDefense
      ? 100
      : (module.animationSteps[currentStep].time / totalDuration) * 100;
      
  const advanceStep = useCallback(() => {
    setCurrentStep(prev => {
      const nextStepIndex = prev + 1;
      if (nextStepIndex > preDefenseStepIndex) {
        setIsPlaying(false);
        return prev;
      }
      
      const nextStep = module.animationSteps[nextStepIndex];
      if (focusAssist && nextStep.focusPoint) {
        setIsPlaying(false);
        setIsPausedForFocus(true);
      }
      
      return nextStepIndex;
    });
  }, [focusAssist, preDefenseStepIndex, module.animationSteps]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(advanceStep, 2000 / speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed, advanceStep]);
  
  useEffect(() => {
    const step = module.animationSteps[currentStep];
    if(step.label.includes('infection') || step.label.includes('damage') || step.label.includes('breach') || step.label.includes('theft') || step.label.includes('overload')) {
        playSound('alert');
    }
    if(step.label.includes('data-flow') || step.label.includes('spread')) {
        playSound('dataflow');
    }
  }, [currentStep, module.animationSteps]);


  const handlePlayPause = () => {
    playSound('click');
    if (currentStep >= preDefenseStepIndex && !showDefense) return;
    if (isPausedForFocus) {
        setIsPausedForFocus(false);
    }
    setIsPlaying(prev => !prev);
  };
  
  const handleContinueFocus = () => {
    playSound('click');
    setIsPausedForFocus(false);
    setIsPlaying(true);
  }

  const handleStep = (direction: number) => {
    playSound('click');
    setIsPlaying(false);
    setIsPausedForFocus(false);
    setCurrentStep(prev => {
        const nextStep = prev + direction;
        if (showDefense) {
            return Math.max(0, Math.min(defenseStepIndex, nextStep));
        }
        return Math.max(0, Math.min(preDefenseStepIndex, nextStep));
    });
  };

  const handleRewind = () => {
    playSound('click');
    setIsPlaying(false);
    setIsPausedForFocus(false);
    setCurrentStep(0);
    setShowDefense(false);
  };
  
  const handleShowDefense = () => {
      playSound('shieldUp');
      setTimeout(() => playSound('success'), 500);
      setShowDefense(true);
      setCurrentStep(defenseStepIndex);
      setIsPlaying(false);
      setIsPausedForFocus(false);
  }

  const handleModuleFinished = () => {
    playSound('success');
    onComplete(module.id);
  }

  const handleNarration = useCallback(async (text: string, index: number) => {
    playSound('click');
    setIsNarrating(prev => ({ ...prev, [index]: true }));
    try {
      await textToSpeech(text);
    } catch (error) {
      console.error("Narration failed:", error);
      alert("Sorry, AI narration is currently unavailable.");
    } finally {
      setIsNarrating(prev => ({ ...prev, [index]: false }));
    }
  }, []);
  
  const isAtPreDefense = currentStep === preDefenseStepIndex;
  const currentFocusPoint = module.animationSteps[currentStep].focusPoint;

  return (
    <div>
      <button onClick={onBack} className="mb-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors">&larr; Back to Attack Library</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Animation */}
        <div className="bg-[#0f111a] p-4 rounded-lg border border-slate-700">
          <AnimationPlayer 
            module={module} 
            currentStep={currentStep} 
            showDefense={showDefense} 
            reducedMotion={reducedMotion} 
            isFocusPaused={isPausedForFocus && !!currentFocusPoint}
            focusPoint={currentFocusPoint}
          />
           <div className="w-full bg-slate-700 rounded-full h-1.5 mt-4">
              <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
           </div>
          <div className="flex items-center justify-center gap-2 md:gap-4 mt-4">
            <button onClick={handleRewind} className="px-3 py-2 bg-slate-600 rounded text-sm md:text-base">Rewind</button>
            <button onClick={() => handleStep(-1)} className="px-3 py-2 bg-slate-600 rounded text-sm md:text-base">&lt; Step</button>
            {isPausedForFocus ? (
                <button onClick={handleContinueFocus} className="px-5 py-2 bg-yellow-500 rounded text-base md:text-lg font-bold animate-pulse">
                  Continue
                </button>
            ) : (
                <button onClick={handlePlayPause} className="px-5 py-2 bg-cyan-600 rounded text-base md:text-lg font-bold" disabled={isAtPreDefense && !showDefense}>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
            )}
            <button onClick={() => handleStep(1)} className="px-3 py-2 bg-slate-600 rounded text-sm md:text-base">Step &gt;</button>
          </div>
           {isAtPreDefense && !showDefense && (
              <div className="text-center mt-4">
                  <button onClick={handleShowDefense} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-lg font-bold animate-pulse">
                      Show Defense
                  </button>
              </div>
           )}
          <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Speed:</span>
                  {[0.5, 1, 1.5].map(rate => (
                    <button key={rate} onClick={() => { playSound('click'); setSpeed(rate); }} className={`px-3 py-1 text-sm rounded ${speed === rate ? 'bg-cyan-500 text-white' : 'bg-slate-600'}`}>{rate}x</button>
                  ))}
              </div>
               <div className="flex items-center gap-2">
                  <label htmlFor="focus-assist" className="text-sm text-slate-400">Focus Assist</label>
                  <input type="checkbox" id="focus-assist" checked={focusAssist} onChange={() => { playSound('click'); setFocusAssist(p => !p); }} className="w-5 h-5 accent-yellow-500" />
              </div>
              <div className="flex items-center gap-2">
                  <label htmlFor="reduced-motion" className="text-sm text-slate-400">Reduced Motion</label>
                  <input type="checkbox" id="reduced-motion" checked={reducedMotion} onChange={() => { playSound('click'); setReducedMotion(p => !p); }} className="w-5 h-5 accent-cyan-500" />
              </div>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-cyan-400">{module.title}</h2>
            <p className="text-slate-400 italic mt-1">{module.kidFriendly}</p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2 text-cyan-400">How it works</h3>
            <ul className="space-y-2">
              {module.animationSteps.map((step, index) => (
                <li key={index} className={`transition-colors duration-300 flex items-center gap-2 ${index === currentStep ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}>
                   <button 
                     onClick={() => handleNarration(step.text, index)} 
                     disabled={isNarrating[index]}
                     className="flex-shrink-0 w-6 h-6 bg-cyan-800/50 rounded-full flex items-center justify-center hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-wait"
                     aria-label={`Narrate step ${index + 1}`}
                   >
                     {isNarrating[index] ? 
                       <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                     }
                   </button>
                  <span className="font-mono">{`[${step.time}s]`}</span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
             <h3 className="font-bold text-lg mb-2 text-green-400">How to stop it</h3>
             <ul className="space-y-2 list-disc list-inside">
                {module.defenses.map(def => (
                  <li key={def.point} className="text-slate-300">
                    <strong className="text-green-300">{def.point}:</strong>{' '}
                    <HighlightableText text={def.description} keywords={KEYWORDS} />
                  </li>
                ))}
             </ul>
          </div>

          <MiniSimSection sim={module.miniSim} onComplete={() => setMiniSimCompleted(true)} />
          <QuizSection quiz={module.quiz} onComplete={() => setQuizCompleted(true)} />
          
          {quizCompleted && miniSimCompleted && (
              <div className="mt-6 text-center p-4 bg-green-900/50 border border-green-500 rounded-lg">
                  <h3 className="text-xl font-bold text-green-300">Module Complete!</h3>
                  <p className="mt-2">You've earned the "{module.badge}" badge. Well done!</p>
                  <button onClick={handleModuleFinished} className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded transition-colors">
                      Finish & Return
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};


const QuizSection: React.FC<{ quiz: QuizQuestion; onComplete: () => void }> = ({ quiz, onComplete }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleAnswer = (option: string) => {
        if(isCorrect !== null) return;
        const correct = option === quiz.correctAnswer;
        playSound(correct ? 'success' : 'alert');
        setSelected(option);
        setIsCorrect(correct);
        if(correct) onComplete();
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2 text-cyan-400">Quick Quiz</h3>
            <p className="mb-4">{quiz.question}</p>
            <div className="space-y-2">
                {quiz.options.map(option => {
                    const isSelected = selected === option;
                    const isTheCorrectAnswer = option === quiz.correctAnswer;
                    let buttonClass = 'bg-slate-700 hover:bg-slate-600';
                    if (isSelected) {
                        buttonClass = isCorrect ? 'bg-green-600' : 'bg-red-600';
                    } else if (isCorrect !== null && isTheCorrectAnswer) {
                        buttonClass = 'bg-green-600';
                    }

                    return <button key={option} onClick={() => handleAnswer(option)} className={`w-full text-left p-3 rounded transition-colors ${buttonClass}`}>{option}</button>
                })}
            </div>
            {isCorrect !== null && (
                 <div className={`mt-4 p-3 rounded-lg flex items-start gap-3 ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                    {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />}
                    <div>
                      <p className="font-bold">{isCorrect ? 'Correct!' : 'Not Quite'}</p>
                      <p className="text-sm text-slate-300">{quiz.explanation}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const MiniSimSection: React.FC<{ sim: MiniSim; onComplete: () => void }> = ({ sim, onComplete }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    
    const handleSelect = (option: {id: string, isCorrect: boolean}) => {
        if(feedback) return;
        playSound(option.isCorrect ? 'success' : 'alert');
        setSelected(option.id);
        setIsCorrect(option.isCorrect);
        setFeedback(option.isCorrect ? sim.feedback.correct : sim.feedback.incorrect);
        if(option.isCorrect) onComplete();
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold text-lg mb-2 text-cyan-400">Mini-Sim</h3>
            <p className="mb-4">{sim.description}</p>
            <div className="space-y-2">
                {sim.options.map(option => {
                     const isSelected = selected === option.id;
                     const isTheCorrectAnswer = option.isCorrect;
                     let buttonClass = 'bg-slate-700 hover:bg-slate-600';
                     if(feedback) {
                         if(isSelected) {
                            buttonClass = isCorrect ? 'bg-green-600' : 'bg-red-600';
                         } else if (isTheCorrectAnswer) {
                            buttonClass = 'bg-green-600'
                         }
                     }
                    return <button key={option.id} onClick={() => handleSelect(option)} className={`w-full text-left p-3 rounded transition-colors ${buttonClass}`}>{option.text}</button>
                })}
            </div>
            {feedback && (
                 <div className={`mt-4 p-3 rounded-lg flex items-start gap-3 ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                    {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />}
                    <p className="text-sm text-slate-300">{feedback}</p>
                </div>
            )}
        </div>
    );
};