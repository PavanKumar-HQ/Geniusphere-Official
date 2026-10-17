
import React, { useState, useCallback, useEffect } from 'react';
import {
  MessageSquare, Users, Clock, Lightbulb,
  Heart, Star, ShieldCheck, Zap,
  Briefcase, Globe, Play, RotateCcw,
  Pause, BarChart3, Info, CheckCircle2,
  XCircle, ChevronRight, GraduationCap,
  Activity, AlertTriangle, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCENARIOS, INITIAL_SCORES, MYTHS_VS_REALITY } from './constants';
import { SkillCategory, Scores, Scenario, Choice } from './types';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

// --- Sub-components ---

const SkillIcon = ({ category, className = "" }: { category: SkillCategory; className?: string }) => {
  switch (category) {
    case SkillCategory.Communication: return <MessageSquare className={`text-[#4DA3FF] ${className}`} />;
    case SkillCategory.Teamwork: return <Users className={`text-[#2AFFA2] ${className}`} />;
    case SkillCategory.TimeManagement: return <Clock className={`text-[#FFA14D] ${className}`} />;
    case SkillCategory.ProblemSolving: return <Lightbulb className={`text-yellow-400 ${className}`} />;
    case SkillCategory.EmotionalIntelligence: return <Heart className={`text-pink-400 ${className}`} />;
    case SkillCategory.Leadership: return <Star className={`text-[#8B7CFF] ${className}`} />;
    case SkillCategory.WorkEthics: return <ShieldCheck className={`text-[#E6E9F0] ${className}`} />;
    case SkillCategory.Adaptability: return <Zap className={`text-cyan-400 ${className}`} />;
    case SkillCategory.Etiquette: return <Briefcase className={`text-blue-300 ${className}`} />;
    case SkillCategory.DigitalProfessionalism: return <Globe className={`text-emerald-300 ${className}`} />;
    default: return null;
  }
};

const Gauge = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-y-auto md:overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 50 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const SimulationVisualizer = ({ type, isCorrect, feedbackActive }: { type: string; isCorrect?: boolean; feedbackActive: boolean }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-y-auto md:overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Activity className="w-64 h-64 text-indigo-500 animate-pulse" />
      </div>

      <AnimatePresence mode="wait">
        {!feedbackActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            {type === 'speaking' && (
              <div className="flex gap-1 items-end h-16">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [10, 40, 20, 50, 15] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                    className="w-2 bg-[#4DA3FF] rounded-full"
                  />
                ))}
              </div>
            )}
            {type === 'clock-stress' && (
              <div className="relative">
                <Clock className="w-20 h-20 text-[#FFA14D] animate-spin-[20s_linear_infinite]" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <AlertTriangle className="text-red-500 w-6 h-6" />
                </motion.div>
              </div>
            )}
            {type === 'project-board' && (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    className="w-12 h-16 bg-slate-700 rounded border border-slate-600"
                  />
                ))}
              </div>
            )}
            {type === 'emotion-indicator' && (
              <div className="flex gap-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Heart className="w-12 h-12 text-pink-500" /></motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}><Target className="w-12 h-12 text-blue-500" /></motion.div>
              </div>
            )}
            <p className="font-mono text-[10px] text-slate-500 tracking-[0.3em] uppercase">Engine Running: {type}</p>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`p-6 rounded-full ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {isCorrect ? (
                <CheckCircle2 className="w-20 h-20 text-green-400" />
              ) : (
                <XCircle className="w-20 h-20 text-red-400" />
              )}
            </div>
            <p className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Positive Synchronization' : 'Behavioral Conflict'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App({ onClose }: { onClose?: () => void }) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ choice: Choice; isCorrect: boolean } | null>(null);
  const [showReport, setShowReport] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  const handleChoice = useCallback((choice: Choice) => {
    if (isPaused) return;

    setLastFeedback({ choice, isCorrect: choice.isCorrect });

    setScores(prev => ({
      confidence: Math.max(0, Math.min(100, prev.confidence + choice.impact.confidence)),
      communication: Math.max(0, Math.min(100, prev.communication + choice.impact.communication)),
      teamwork: Math.max(0, Math.min(100, prev.teamwork + choice.impact.teamwork)),
      responsibility: Math.max(0, Math.min(100, prev.responsibility + choice.impact.responsibility)),
      growth: Math.max(0, Math.min(100, prev.growth + choice.impact.growth)),
    }));
  }, [isPaused]);

  const nextScenario = () => {
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setLastFeedback(null);
    } else {
      setShowReport(true);
    }
  };

  const resetLab = () => {
    setCurrentIdx(0);
    setScores(INITIAL_SCORES);
    setLastFeedback(null);
    setShowReport(false);
    setIsPaused(false);
  };

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
        <MobileLayout
          title="Professional & Soft Skills"
          description={scenario.title}
          badges={[
            <MobileBadge variant="purple" key="b1">SCENARIO {currentIdx + 1}/{SCENARIOS.length}</MobileBadge>,
            !isPaused ? <MobileBadge variant="green" key="b2">ACTIVE</MobileBadge> : null
          ]}
          visualContent={
            <div className="h-full p-4 space-y-4">
              {/* Scores Display */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-xs text-slate-400">Confidence</div>
                  <div className="text-2xl font-bold text-indigo-400">{Math.round(scores.confidence)}%</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-xs text-slate-400">Communication</div>
                  <div className="text-2xl font-bold text-cyan-400">{Math.round(scores.communication)}%</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-xs text-slate-400">Teamwork</div>
                  <div className="text-2xl font-bold text-green-400">{Math.round(scores.teamwork)}%</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-xs text-slate-400">Growth</div>
                  <div className="text-2xl font-bold text-purple-400">{Math.round(scores.growth)}%</div>
                </div>
              </div>

              {/* Scenario */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <h3 className="text-sm font-bold mb-2 text-indigo-400">{scenario.title}</h3>
                <p className="text-sm text-slate-300 mb-3">{scenario.description}</p>

                {/* Choices */}
                <div className="space-y-2">
                  {scenario.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all text-xs"
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          controls={
            <MobileControlGroup
              onPlay={() => setIsPaused(!isPaused)}
              onReset={resetLab}
              onNext={nextScenario}
              onPrev={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              isPlaying={!isPaused}
            />
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-indigo-400">Skill Development</h4>
              <p className="text-sm">Make choices that build professional skills for real-world success.</p>
              {lastFeedback && (
                <div className={`mt-2 p-2 rounded border ${lastFeedback.isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <p className="text-xs">{lastFeedback.choice.feedback}</p>
                </div>
              )}
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={onClose || (() => {
            const referrer = document.referrer;
            const currentOrigin = window.location.origin;
            if (referrer && referrer.startsWith(currentOrigin) && window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/';
            }
          })}
          headerStyle="brand-center"
          headerTitle="SKILLS LAB"
        />

        {/* Sidebar Portal for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 z-[90] shadow-2xl bg-[#0B1220] border-r border-white/10 flex flex-col p-6"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold">Scenarios</h2>
                  <p className="text-xs text-slate-400">Professional skill challenges</p>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {SCENARIOS.map((scen, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIdx(idx);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${currentIdx === idx
                        ? 'bg-indigo-500/20 border border-indigo-500/50'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                        }`}
                    >
                      <div className="text-sm font-bold">{scen.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{scen.category}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setIsSimplifiedMode(!isSimplifiedMode)}
                    className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {isSimplifiedMode ? 'Full Mode' : 'Simplified Mode'}
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex flex-col h-screen bg-gradient-to-br from-[#0B1220] to-[#111827] text-[#E6E9F0] overflow-y-auto md:overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0 z-10 bg-[#0B1220]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <GraduationCap className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PROFESSIONAL & SOFT SKILLS</h1>
              <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Lab: How Success Really Works</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-full border border-slate-700">
              <button
                onClick={() => setIsSimplifiedMode(false)}
                className={`px-3 py-1 rounded-full text-xs transition-colors font-medium ${!isSimplifiedMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Full Analysis
              </button>
              <button
                onClick={() => setIsSimplifiedMode(true)}
                className={`px-3 py-1 rounded-full text-xs transition-colors font-medium ${isSimplifiedMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Simplified
              </button>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-sm font-medium">
              Progress: <span className="text-indigo-400">{Math.round(((currentIdx) / SCENARIOS.length) * 100)}%</span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="flex-1 grid grid-cols-12 overflow-y-auto md:overflow-hidden">

          {/* Left Panel: Skills Library */}
          <aside className="col-span-3 border-r border-slate-800 overflow-y-auto custom-scrollbar p-6 bg-[#0B1220]/50">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Skills Library
            </h2>
            <div className="space-y-3">
              {Object.values(SkillCategory).map((cat) => (
                <motion.div
                  key={cat}
                  layout
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${scenario.category === cat ? 'bg-indigo-600/15 border-indigo-500/50 scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.15)]' : 'bg-slate-800/20 border-transparent opacity-40 hover:opacity-60'}`}
                >
                  <SkillIcon category={cat} className="w-5 h-5" />
                  <span className="text-sm font-medium">{cat}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
              <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Info className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Professional Insight</span>
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">"{scenario.didYouKnow}"</p>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Myths vs Reality</h3>
              {MYTHS_VS_REALITY.map((item, i) => (
                <div key={i} className="text-[11px] space-y-1 p-3 bg-slate-900/50 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                  <p className="text-red-400/60 line-through">❌ {item.myth}</p>
                  <p className="text-green-400 font-medium group-hover:text-green-300">✅ {item.reality}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* Center Panel: Simulations */}
          <section className="col-span-6 overflow-y-auto custom-scrollbar p-8 bg-[#0D1525]/40 relative">
            <AnimatePresence mode="wait">
              {!showReport ? (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase">Module {scenario.id}</span>
                      <span className="text-xs text-slate-500 font-mono tracking-tighter">SIM_ID_{scenario.id.toString().padStart(3, '0')}</span>
                    </div>
                    <div className="flex gap-1">
                      {SCENARIOS.map((_, i) => (
                        <div key={i} className={`h-1 w-4 rounded-full transition-colors ${i <= currentIdx ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mb-4 tracking-tight">{scenario.title}</h2>
                  <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">{scenario.description}</p>

                  {/* Simulation Visualizer */}
                  <div className="aspect-video bg-slate-900/80 rounded-3xl border border-slate-800/50 mb-8 shadow-2xl overflow-y-auto md:overflow-hidden group">
                    <SimulationVisualizer
                      type={scenario.animationType}
                      isCorrect={lastFeedback?.isCorrect}
                      feedbackActive={!!lastFeedback}
                    />

                    {/* Overlay Scanner Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-1/2 w-full animate-scan" style={{ animationDuration: '4s' }} />
                  </div>

                  {/* Choices or Feedback */}
                  <div className="min-h-[250px]">
                    {!lastFeedback ? (
                      <div className="grid grid-cols-1 gap-4">
                        {scenario.choices.map((choice) => (
                          <button
                            key={choice.id}
                            disabled={isPaused}
                            onClick={() => handleChoice(choice)}
                            className="group relative p-6 bg-slate-800/30 hover:bg-indigo-600/10 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl transition-all text-left flex items-start gap-4 disabled:opacity-50"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all">
                              <span className="text-sm font-bold text-slate-300 group-hover:text-white">{choice.id.toUpperCase()}</span>
                            </div>
                            <span className="text-base font-medium pr-8 self-center">{choice.text}</span>
                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-indigo-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className={`p-6 rounded-2xl border ${lastFeedback.isCorrect ? 'bg-green-600/5 border-green-500/20' : 'bg-red-600/5 border-red-500/20'}`}>
                          <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            {lastFeedback.isCorrect ? <CheckCircle2 className="text-green-400 w-5 h-5" /> : <XCircle className="text-red-400 w-5 h-5" />}
                            Feedback Analysis
                          </h4>
                          <p className="text-slate-300 leading-relaxed mb-6">{lastFeedback.choice.feedback}</p>

                          <div className="p-5 bg-[#0B1220] rounded-xl border border-slate-800">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">Fundamental Skill Takeaway</p>
                            <p className="text-sm italic text-slate-200">"{scenario.lesson}"</p>
                          </div>
                        </div>

                        <button
                          onClick={nextScenario}
                          className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                          {currentIdx < SCENARIOS.length - 1 ? 'Continue to Next Scenario' : 'Generate Full Competency Report'}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto text-center py-8"
                >
                  <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl">
                    <BarChart3 className="w-12 h-12 text-white -rotate-12" />
                  </div>
                  <h2 className="text-4xl font-black mb-3 tracking-tight">Competency Report</h2>
                  <p className="text-slate-400 mb-12 max-w-md mx-auto">Your behaviors have been profiled. Based on your decisions, here is your professional readiness score.</p>

                  <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 flex flex-col items-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Readiness Level</p>
                      <div className="text-6xl font-black text-white mb-2">
                        {Math.round((scores.confidence + scores.communication + scores.teamwork + scores.responsibility + scores.growth) / 5)}%
                      </div>
                      <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider">High Potential</div>
                    </div>
                    <div className="p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 text-left">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Core Advantage</p>
                      <div className="flex items-center gap-3 text-2xl font-bold text-indigo-400 mb-2">
                        <Zap className="w-6 h-6" />
                        Growth Mindset
                      </div>
                      <p className="text-xs text-slate-500">You consistently prioritized learning and long-term responsibility over immediate convenience.</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/20 p-8 rounded-3xl border border-slate-800 text-left mb-12">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <Star className="text-yellow-400 w-5 h-5" /> Behavior Summary
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-start gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">Balanced Communication</p>
                          <p className="text-xs text-slate-500">You demonstrate high respect for group dynamics and clear expression of ideas.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">Collaborative Spirit</p>
                          <p className="text-xs text-slate-500">Your tendency to volunteer for tasks and distribute work fairly is a key leadership trait.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={resetLab}
                      className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl hover:shadow-white/10"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset & Retry Lab
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Right Panel: Feedback & Improvement */}
          <aside className="col-span-3 border-l border-slate-800 overflow-y-auto custom-scrollbar p-6 bg-[#0B1220]/50">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Performance
            </h2>

            <div className="space-y-6">
              {!isSimplifiedMode ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <Gauge label="Confidence Score" value={scores.confidence} color="#8B7CFF" />
                  <Gauge label="Communication" value={scores.communication} color="#4DA3FF" />
                  <Gauge label="Teamwork" value={scores.teamwork} color="#2AFFA2" />
                  <Gauge label="Responsibility" value={scores.responsibility} color="#FFA14D" />
                  <Gauge label="Growth Mindset" value={scores.growth} color="#FACC15" />
                </motion.div>
              ) : (
                <div className="p-8 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700/50 text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Story Mode Active</p>
                  <p className="text-xs text-slate-600 leading-relaxed">Focus on the narrative and outcomes. Advanced metrics are being calculated in the background.</p>
                </div>
              )}
            </div>

            <AnimatePresence>
              {lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="mt-10"
                >
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Behavioral Impact</h3>
                  <div className="space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    {Object.entries(lastFeedback.choice.impact).map(([key, val]) => {
                      // Fix: Explicitly cast 'val' to number as Object.entries results in unknown types in some environments.
                      const impactVal = val as number;
                      return impactVal !== 0 && (
                        <div key={key} className="flex justify-between items-center text-xs">
                          <span className="capitalize text-slate-400 font-medium">{key}</span>
                          <div className={`flex items-center gap-1 font-bold ${impactVal > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {impactVal > 0 ? `+${impactVal}` : impactVal}%
                            {impactVal > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 p-5 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-2xl border border-indigo-500/20 shadow-inner">
              <h4 className="text-xs font-bold text-indigo-400 mb-3 uppercase tracking-wider">Module Outcomes</h4>
              <ul className="text-[11px] space-y-2 text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-indigo-500" /> Real-world readiness</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-indigo-500" /> Behavioral awareness</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-indigo-500" /> Growth-centric mindset</li>
              </ul>
            </div>
          </aside>
        </main>

        {/* Bottom Controls */}
        <footer className="px-6 py-4 border-t border-slate-800 bg-[#0B1220] z-10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isPaused ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
            >
              {isPaused ? <><Play className="w-4 h-4 fill-current" /> Resume Lab</> : <><Pause className="w-4 h-4 fill-current" /> Pause Session</>}
            </button>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              {isPaused ? 'Simulation Suspended' : 'System Live • Monitoring Behaviors'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Class 7–10 Optimized
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-white text-slate-900 rounded-xl text-sm font-black transition-all transform hover:scale-105"
            >
              End Lab
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}

// Icons for impact
const TrendingUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
    <polyline points="17 18 23 18 23 12"></polyline>
  </svg>
);
