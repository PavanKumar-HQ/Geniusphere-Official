
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { OfficeApp } from './types';
import { COLORS, MODULE_CONTENT, BEST_PRACTICES, DID_YOU_KNOW } from './constants';
import {
  FileText,
  BarChart3,
  Presentation,
  Mail,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Zap,
  Info,
  ChevronRight,
  ChevronLeft,
  Globe,
  AlertTriangle,
  Lightbulb,
  Cloud,
  FileSearch,
  Users,
  Menu,
  X
} from 'lucide-react';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

// Animation Helper Component
const TypingText = ({ text, speed = 40, className = "" }: { text: string, speed?: number, className?: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
};

interface OfficeLabProps {
  onClose?: () => void;
  onExit?: () => void;
  initialApp?: OfficeApp;
}

const App: React.FC<OfficeLabProps> = ({ onClose, onExit, initialApp }) => {
  const [currentApp, setCurrentApp] = useState<OfficeApp>(initialApp || OfficeApp.EXCEL);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSimplified, setIsSimplified] = useState(false);
  const [didYouKnowIndex, setDidYouKnowIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(true);

  const handleExit = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (onExit) {
      onExit();
      return;
    }
    window.history.back();
  };

  const moduleData = useMemo(() => MODULE_CONTENT[currentApp] || MODULE_CONTENT[OfficeApp.WORD], [currentApp]);
  const activeStep = useMemo(() => moduleData.steps[currentStep] || moduleData.steps[0], [moduleData, currentStep]);

  // Auto-progression logic
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      const duration = isSimplified ? 8000 : 5000;
      timer = setTimeout(() => {
        if (currentStep < moduleData.steps.length - 1) {
          goToStep(currentStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, currentApp, isSimplified, moduleData]);

  // Rotate "Did You Know"
  useEffect(() => {
    const interval = setInterval(() => {
      setDidYouKnowIndex(prev => (prev + 1) % DID_YOU_KNOW.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const goToStep = (stepIdx: number) => {
    if (stepIdx > currentStep) setDirection('right');
    else setDirection('left');
    setCurrentStep(stepIdx);
  };

  const handleReset = () => {
    setDirection('left');
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const renderSimulation = () => {
    // Increased pb to 72 on desktop, reduced on mobile
    const commonStyles = `w-full h-full min-h-[400px] flex flex-col p-4 md:p-8 pb-4 md:pb-8 transition-all duration-500 ease-out overflow-y-auto custom-scrollbar ${isSimplified ? 'text-xl' : 'text-base'}`;

    switch (currentApp) {
      case OfficeApp.WORD:
        return (
          <div className={`${commonStyles} !pb-32`}>
            {/* Word Window Bar & Ribbon */}
            <div className="bg-[#1E293B] rounded-t-2xl p-3 border border-white/15 border-b-0 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg">
              <div className="flex items-center space-x-3">
                <FileText color={COLORS.WORD} size={24} />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-wide">Project_Report_v1.docx</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-bold">Word Online</span>
                  </div>
                  <span className="text-[11px] text-slate-300">AutoSave: On • OneDrive</span>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-200">
                <span className="font-mono text-slate-300 font-semibold px-2 border-r border-white/10">Aptos 14</span>
                <button className="px-2 py-1 font-bold rounded bg-white/10 text-white hover:bg-white/20">B</button>
                <button className="px-2 py-1 italic rounded text-slate-300 hover:bg-white/10">I</button>
                <button className="px-2 py-1 underline rounded text-slate-300 hover:bg-white/10">U</button>
                <span className="w-px h-4 bg-white/10 mx-1"></span>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-bold text-[11px]">Heading 1</span>
              </div>
            </div>

            {/* Document Page Canvas */}
            <div
              className="bg-[#0B132B] rounded-b-2xl p-6 md:p-8 flex-1 border border-white/15 relative overflow-y-auto flex flex-col min-h-[420px] shadow-2xl"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>

              {/* Document Header */}
              <div className="border-b border-white/10 pb-4">
                <h2
                  style={{
                    color: '#60A5FA',
                    fontWeight: 900,
                    fontSize: isSimplified ? '1.75rem' : '1.4rem',
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  <TypingText text="Executive Summary: Renewable Energy Innovation" speed={20} />
                </h2>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  Prepared by: Global Sustainability Institute • Document Version 1.4
                </p>
              </div>

              {/* Document Body - Always visible and illuminated */}
              <div className="text-slate-200 text-sm md:text-base leading-relaxed space-y-3 font-normal">
                <p>
                  Global transition toward clean energy accelerates as next-generation photovoltaic cells and advanced wind turbine designs yield unprecedented efficiency. This briefing documents quarterly production yields, grid integration metrics, and energy storage economic forecasts.
                </p>
              </div>

              {/* Step 1 & 2: Structured Research Callout */}
              {currentStep >= 1 && (
                <div
                  style={{
                    padding: '16px 20px',
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '100%',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      style={{
                        color: '#93C5FD',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: isSimplified ? '1rem' : '0.85rem',
                        margin: 0,
                      }}
                    >
                      Validated Research Findings
                    </p>
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-400/30">CONFIRMED</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      "Solar power panel conversion efficiency increased by 15.4% YoY",
                      "Distributed wind farm installations reach record coverage in developing regions",
                      "Utility-scale battery storage costs decreased by 40% since 2020"
                    ].map((text, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F1F5F9', fontSize: '0.92rem' }}>
                        <CheckCircle2 size={20} style={{ color: '#38BDF8', flexShrink: 0 }} />
                        <span style={{ color: '#F1F5F9' }}><TypingText text={text} speed={12} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step 2: Real-time Cloud Sync & Document Footer */}
              {currentStep >= 2 && (
                <div className="flex flex-wrap items-center justify-between pt-4 mt-auto border-t border-white/10 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <span>Page 1 of 1</span>
                    <span>•</span>
                    <span>184 words</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">Document Integrity 100%</span>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.5)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                    }}
                  >
                    <Cloud style={{ color: '#4ADE80', flexShrink: 0 }} size={20} />
                    <span style={{ fontWeight: 800, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>
                      All changes saved to cloud
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case OfficeApp.EXCEL:
        return (
          <div className={`${commonStyles} !pb-32`}>
            <div className="flex items-center space-x-3 mb-4 shrink-0">
              <BarChart3 color={COLORS.EXCEL} size={isSimplified ? 36 : 28} />
              <h3 className={`font-bold uppercase tracking-wider ${isSimplified ? 'text-2xl' : 'text-xl'}`} style={{ color: '#FFFFFF' }}>Financial_Forecast.xlsx</h3>
            </div>
            <div className="bg-[#0f172a] rounded-2xl overflow-y-auto border border-white/10 shadow-2xl flex-1 flex flex-col min-h-[300px]">
              <table className="w-full text-left border-collapse font-mono">
                <thead className="bg-white/10 uppercase font-black" style={{ color: '#CBD5E1' }}>
                  <tr>
                    <th className="p-5 border-r border-b border-white/10 text-center w-16">#</th>
                    <th className="p-5 border-r border-b border-white/10">Category</th>
                    <th className="p-5 border-r border-b border-white/10 text-right">Budget</th>
                    <th className="p-5 border-b border-white/10 text-right">Actual</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {[
                    { id: 1, cat: 'Marketing', bud: '$5,000', act: '$4,850' },
                    { id: 2, cat: 'Engineering', bud: '$12,000', act: '$11,200' },
                    { id: 3, cat: 'Operations', bud: '$8,500', act: '$9,100' }
                  ].map((row) => (
                    <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-5 border-r border-white/5 text-center text-gray-500 font-bold">{row.id}</td>
                      <td className="p-5 border-r border-white/5 font-bold">{row.cat}</td>
                      <td className="p-5 border-r border-white/5 text-right">{row.bud}</td>
                      <td className="p-5 text-right">{row.act}</td>
                    </tr>
                  ))}
                  {currentStep >= 1 && (
                    <tr className="bg-green-500/20 text-green-400 font-black border-t-2 border-green-500">
                      <td className="p-5 border-r border-white/5 text-center">Σ</td>
                      <td className="p-5 border-r border-white/5 uppercase">TOTAL EXPENDITURE</td>
                      <td className="p-5 border-r border-white/5 text-right">$25,500</td>
                      <td className="p-5 text-right">
                        <span className="text-green-500 opacity-60 mr-2">=SUM(D2:D4)</span>
                        <TypingText text="$25,150" speed={80} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {currentStep >= 2 && (
              <div className="mt-8 flex-none h-40 flex items-end space-x-6 px-4">
                <div className="flex-1 bg-green-500/20 border border-green-500/50 rounded-t-2xl h-[45%] animate-grow-up"></div>
                <div className="flex-1 bg-green-500/40 border border-green-500/50 rounded-t-2xl h-[85%] animate-grow-up delay-75"></div>
                <div className="flex-1 bg-green-500/60 border border-green-500/50 rounded-t-2xl h-[60%] animate-grow-up delay-150"></div>
              </div>
            )}
          </div>
        );
      case OfficeApp.POWERPOINT:
        return (
          <div className={`${commonStyles} items-center justify-center !pb-32`}>
            <div className={`w-full max-w-3xl aspect-video bg-[#1e293b] rounded-3xl border-4 border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-y-auto md:overflow-hidden transition-all duration-1000 flex flex-col ${currentStep === 2 ? 'scale-110 shadow-orange-500/10' : 'scale-100'}`}>
              <div className="h-3 w-full bg-orange-500"></div>
              <div className="flex-1 flex flex-col p-16 text-center relative justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
                <div className="mb-6">
                  <span className="text-orange-500 font-black tracking-[0.5em] uppercase text-sm border-b-2 border-orange-500 pb-2">Future Tech Expo</span>
                </div>
                <h2 className={`font-black text-white mb-10 tracking-tight leading-none ${isSimplified ? 'text-6xl' : 'text-5xl'}`}>
                  <TypingText text="THE AI REVOLUTION" speed={40} />
                </h2>
                {currentStep >= 1 && (
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    {[
                      { icon: Zap, label: 'Speed' },
                      { icon: Users, label: 'Scale' },
                      { icon: Globe, label: 'Global' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 animate-in zoom-in slide-in-from-bottom-12 duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                        <item.icon size={32} className="text-orange-400 mx-auto mb-3" />
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{item.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case OfficeApp.OUTLOOK:
        return (
          <div className={`${commonStyles} items-center justify-center !pb-32`}>
            <div className="w-full max-w-xl bg-[#1e293b] rounded-3xl border border-purple-500/30 shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col">
              <div className="p-6 bg-purple-900/30 border-b border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail size={22} className="text-purple-400" />
                  <span className="font-black text-sm uppercase text-purple-200 tracking-widest">New Communication</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                </div>
              </div>
              <div className="p-10 space-y-8 flex-1">
                <div className="space-y-4">
                  <div className="flex border-b border-white/5 pb-4 items-center">
                    <span className="text-gray-500 text-xs font-black w-24 uppercase">To:</span>
                    <span className="text-gray-200 text-base font-bold italic">director@innovation-hub.org</span>
                  </div>
                  <div className="flex border-b border-white/5 pb-4 items-center">
                    <span className="text-gray-500 text-xs font-black w-24 uppercase">Subject:</span>
                    <span className="text-gray-200 text-base font-black">
                      {currentStep >= 0 ? <TypingText text="Q4 Performance Review & Strategic Planning" /> : ''}
                    </span>
                  </div>
                </div>
                <div className="min-h-[140px] text-gray-400 text-base italic leading-relaxed">
                  <TypingText text="Dear Director, attached is the comprehensive report detailing our progress over the last quarter. We have surpassed our KPIs by 12%." speed={15} />
                </div>
                {currentStep >= 1 && (
                  <div className="flex items-center p-5 bg-purple-500/10 rounded-2xl border border-purple-500/20 space-x-6 animate-in slide-in-from-left-12 duration-500">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <FileText size={28} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-white uppercase tracking-tighter">Performance_Report.pdf</p>
                      <p className="text-[10px] text-purple-400 font-mono font-bold">SECURE_LINK: cloud.office.live/98x-z2</p>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex justify-end pt-6">
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/50">
                      Deliver Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case OfficeApp.REAL_LIFE:
        return (
          <div className={`${commonStyles} items-center justify-center !pb-32`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl mb-12">
              {[
                { icon: FileText, color: COLORS.WORD, label: 'DRAFT', sub: 'The Idea' },
                { icon: BarChart3, color: COLORS.EXCEL, label: 'ANALYZE', sub: 'The Proof' },
                { icon: Presentation, color: COLORS.POWERPOINT, label: 'PITCH', sub: 'The Story' },
                { icon: Mail, color: COLORS.OUTLOOK, label: 'SEND', sub: 'The Connect' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-6 group animate-in zoom-in duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className={`p-10 rounded-[2.5rem] bg-white/5 border-2 transition-all duration-700 relative overflow-y-auto md:overflow-hidden flex items-center justify-center shadow-2xl group-hover:bg-white/10`} style={{ borderColor: currentStep === 0 ? item.color : 'rgba(255,255,255,0.05)' }}>
                    <item.icon size={56} color={item.color} className="relative z-10 transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: item.color }}></div>
                  </div>
                  <div>
                    <span className="text-white font-black tracking-[0.4em] text-xs uppercase block mb-1">{item.label}</span>
                    <span className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">THE POWER OF INTEGRATION</h2>
              <p className="text-gray-500 text-xl font-medium leading-relaxed italic max-w-2xl mx-auto">"Success in the modern workplace isn't about mastering software; it's about mastering the flow of information across tools."</p>
            </div>
          </div>
        );
      case OfficeApp.MISTAKES:
        return (
          <div className={commonStyles}>
            <div className="flex items-center space-x-3 mb-4 shrink-0">
              <AlertTriangle color={COLORS.WARNING} size={28} />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Mistake Tracker</h3>
            </div>
            {/* Reduced box heights and adjusted grid to avoid overlap */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px] mb-8">
              <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-y-auto md:overflow-hidden group">
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-1 animate-pulse shrink-0">
                  <FileSearch size={32} className="text-red-400" />
                </div>
                <h4 className="text-lg font-black text-red-400 uppercase tracking-[0.2em] shrink-0">The Issue</h4>
                <div className="h-px w-8 bg-red-500/20 shrink-0"></div>
                <p className="text-gray-400 font-medium italic text-sm">
                  {currentStep === 0 && "\"Wait, I have five files named document_final_v2_new.docx. Which one is the real one?\""}
                  {currentStep === 1 && "\"I have 50 slides but they're all just paragraphs. Why is everyone looking at their phones?\""}
                  {currentStep === 2 && "\"My laptop crashed and my project is gone. I've lost two weeks of work!\""}
                </p>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl relative overflow-y-auto md:overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-1 shrink-0">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <h4 className="text-lg font-black text-green-400 uppercase tracking-[0.2em] shrink-0">The Fix</h4>
                <div className="h-px w-8 bg-green-500/20 shrink-0"></div>
                <div className="text-gray-200 font-bold uppercase tracking-widest text-xs">
                  {currentStep === 0 && "Consistent Naming Conventions"}
                  {currentStep === 1 && "Visual Hierarchy & Bullet Points"}
                  {currentStep === 2 && "Auto-Sync & Cloud Integration"}
                </div>
                <p className="text-gray-400 text-xs">
                  {currentStep === 0 && "Use: YYYY-MM-DD_Project_v1.docx"}
                  {currentStep === 1 && "Keep slides simple; images tell stories better."}
                  {currentStep === 2 && "Save to OneDrive; access it from any device."}
                </p>
              </div>
            </div>
          </div>
        );
      case OfficeApp.TIPS:
        return (
          <div className={commonStyles}>
            <div className="flex items-center space-x-3 mb-6 shrink-0">
              <Lightbulb color="#FFD700" size={28} />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Productivity Hacks</h3>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-3xl bg-white/5 rounded-[2.5rem] p-8 border border-white/10 relative overflow-y-auto md:overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-6">
                  <Zap size={48} className="text-yellow-500 opacity-10 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-yellow-500/20">
                      {currentStep === 0 && <Zap size={28} className="text-yellow-400" />}
                      {currentStep === 1 && <FileSearch size={28} className="text-yellow-400" />}
                      {currentStep === 2 && <Users size={28} className="text-yellow-400" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
                        {currentStep === 0 && "Accelerate Your Work"}
                        {currentStep === 1 && "Leverage AI Templates"}
                        {currentStep === 2 && "Team Real-time Sync"}
                      </h4>
                      <p className="text-gray-400 text-base leading-relaxed font-medium">
                        {currentStep === 0 && <span>Stop clicking through menus. Master the "Golden Trio": <strong>Ctrl+S</strong>, <strong>Ctrl+Z</strong>, and <strong>Ctrl+K</strong>.</span>}
                        {currentStep === 1 && <span>Don't build from scratch. Use <strong>Design Ideas</strong> in PPT and <strong>Analyze Data</strong> in Excel to automate.</span>}
                        {currentStep === 2 && <span>Don't email files. Use <strong>Share Links</strong> to edit together in real-time on the same document.</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4 border-t border-white/5">
                    {['Shortcut Mastery', 'Cloud Power', 'Automation'].map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile View - Standardized */}
      <div className="md:hidden">
        <MobileLayout
          title={currentApp}
          description={
            <>
              <p className="font-bold">{activeStep.title}</p>
            </>
          }
          badges={[
            <MobileBadge variant="purple" key="b1">OFFICE_LAB</MobileBadge>,
            <MobileBadge variant="cyan" key="b2">{activeStep.statusText}</MobileBadge>
          ]}
          visualContent={renderSimulation()}
          controls={
            <MobileControlGroup
              onPlay={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              onNext={() => {
                if (currentStep < moduleData.steps.length - 1) goToStep(currentStep + 1);
                else {
                  // Logic to go to next app?
                  const apps = Object.values(OfficeApp);
                  const currIdx = apps.indexOf(currentApp);
                  if (currIdx < apps.length - 1) {
                    setCurrentApp(apps[currIdx + 1]);
                    setCurrentStep(0);
                  }
                }
              }}
              onPrev={() => {
                if (currentStep > 0) goToStep(currentStep - 1);
                else {
                  const apps = Object.values(OfficeApp);
                  const currIdx = apps.indexOf(currentApp);
                  if (currIdx > 0) {
                    setCurrentApp(apps[currIdx - 1]);
                    setCurrentStep(0);
                  }
                }
              }}
              isPlaying={isPlaying}
            />
          }
          infoContent={
            <div>
              <h4 className="font-bold mb-1 uppercase text-xs text-blue-400">Current Instructions</h4>
              <p>{activeStep.description}</p>
            </div>
          }
          onMenuToggle={() => setIsSidebarOpen(true)}
          onExit={handleExit}
        />
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[80] bg-black/95 p-6 animate-in fade-in duration-200 overflow-y-auto">
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Select Application</h2>
            <div className="space-y-3">
              {[
                { id: OfficeApp.WORD, icon: FileText, color: COLORS.WORD },
                { id: OfficeApp.EXCEL, icon: BarChart3, color: COLORS.EXCEL },
                { id: OfficeApp.POWERPOINT, icon: Presentation, color: COLORS.POWERPOINT },
                { id: OfficeApp.OUTLOOK, icon: Mail, color: COLORS.OUTLOOK },
                { id: OfficeApp.REAL_LIFE, icon: Globe, color: '#FFFFFF' },
                { id: OfficeApp.MISTAKES, icon: AlertTriangle, color: COLORS.WARNING },
                { id: OfficeApp.TIPS, icon: Lightbulb, color: '#FFD700' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentApp(item.id);
                    setCurrentStep(0);
                    setIsPlaying(true);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-4 rounded-xl border ${currentApp === item.id ? 'bg-white/10 border-white/30' : 'bg-white/5 border-transparent'}`}
                >
                  <item.icon size={24} style={{ color: item.color }} className="mr-4" />
                  <span className="text-white font-bold">{item.id}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex relative h-full min-h-0 w-full flex-col text-white overflow-y-auto md:overflow-y-auto md:overflow-hidden font-sans">
        {/* Background FX */}
        <div className="absolute inset-0 -z-10 bg-[#070B1A]">
          <div className="absolute inset-0 animated-grid opacity-30"></div>
          <div style={{ position: 'absolute', top: '25%', left: '25%', width: '400px', height: '400px', backgroundColor: 'rgba(37,99,235,0.06)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '400px', height: '400px', backgroundColor: 'rgba(147,51,234,0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
        </div>

        {/* Futuristic Header */}
        <header className="flex-none flex flex-col md:flex-row items-center justify-between px-4 lg:px-8 py-3.5 glass-panel border-b border-white/10 gap-3 md:gap-0">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="w-11 h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(37,99,235,0.4)] transform -rotate-6 hover:rotate-0 transition-all duration-300 cursor-pointer active:scale-90 relative z-50 shrink-0" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="md:hidden text-white" size={24} /> : <Zap className="md:hidden text-white" size={24} fill="white" />}
              <Zap className="hidden md:block text-white" size={24} fill="white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white uppercase italic leading-none">OFFICE_LAB_X</h1>
              <p className="text-[10px] text-blue-400 font-mono tracking-[0.3em] uppercase mt-1.5 font-bold opacity-80">Unified Productivity Simulation</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 lg:space-x-10">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5 font-black">CURRICULUM_V.4</span>
              <span className="text-xs lg:text-sm font-black text-blue-200 tracking-wider">CAREER PREP TRACK</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center space-x-3 bg-white/5 rounded-xl px-4 py-2 border border-white/10 group cursor-default hover:bg-white/10 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_#22c55e]"></div>
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">ENGINE_ONLINE</span>
            </div>
          </div>
        </header>

        {/* Main Core Layout */}
        <main className="flex-1 min-h-0 min-w-0 flex flex-col md:flex-row overflow-hidden p-3 md:p-4 lg:p-6 gap-4 lg:gap-6 w-full">

          {/* Left Side: Topic Navigation */}
          <aside className={`${isSidebarOpen ? 'flex fixed inset-0 z-40 pt-24 pb-6 px-4 bg-[#070B1A]/95 backdrop-blur-xl' : 'hidden'} md:flex w-[230px] lg:w-[250px] shrink-0 glass-panel rounded-3xl flex-col overflow-hidden border border-white/10 transition-all duration-300 min-h-0`}>
            <div className="p-4 lg:p-5 border-b border-white/5 shrink-0">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 opacity-75">System Modules</h2>
              <nav className="space-y-1.5">
                {[
                  { id: OfficeApp.EXCEL, icon: BarChart3, color: COLORS.EXCEL },
                  { id: OfficeApp.WORD, icon: FileText, color: COLORS.WORD },
                  { id: OfficeApp.POWERPOINT, icon: Presentation, color: COLORS.POWERPOINT },
                  { id: OfficeApp.OUTLOOK, icon: Mail, color: COLORS.OUTLOOK },
                  { id: OfficeApp.REAL_LIFE, icon: Globe, color: '#FFFFFF' },
                  { id: OfficeApp.MISTAKES, icon: AlertTriangle, color: COLORS.WARNING },
                  { id: OfficeApp.TIPS, icon: Lightbulb, color: '#FFD700' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentApp(item.id);
                      setCurrentStep(0);
                      setIsPlaying(true);
                      if (isSidebarOpen) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden text-left ${currentApp === item.id
                      ? 'bg-white/15 border border-white/20 translate-x-1'
                      : 'hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    {currentApp === item.id && (
                      <div className="absolute left-0 top-0 w-1 h-full" style={{ backgroundColor: item.color }}></div>
                    )}
                    <item.icon
                      size={18}
                      style={{ color: currentApp === item.id ? item.color : 'rgba(255,255,255,0.4)' }}
                      className="group-hover:scale-115 transition-transform duration-300 shrink-0"
                    />
                    <span className={`text-xs font-bold tracking-wider truncate transition-colors ${currentApp === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {item.id.toUpperCase()}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar min-h-0">
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl p-3.5 border border-white/10 relative overflow-hidden group">
                <div className="flex items-center space-x-2 mb-2">
                  <Info size={14} className="text-blue-400 shrink-0" />
                  <span className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em]">Module_Log</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed italic font-medium group-hover:text-gray-300 transition-colors">
                  "Efficiency is doing things right; Effectiveness is doing the right things."
                </p>
              </div>
            </div>
            <div className="p-4 pt-2 mt-auto shrink-0">
              <button
                onClick={handleExit}
                className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all uppercase text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-1.5"
              >
                <X size={13} /> EXIT SIMULATION
              </button>
            </div>
          </aside>

          {/* Center Side: THE SIMULATOR (SLIDING) */}
          <section className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden relative">
            <div className="flex-1 min-h-0 glass-panel rounded-3xl relative overflow-hidden flex flex-col border border-white/10 shadow-2xl">
              {/* Simulation Header */}
              <div className="h-14 lg:h-16 border-b border-white/10 flex items-center justify-between px-4 lg:px-6 bg-white/5 backdrop-blur-xl relative z-20 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6] animate-pulse"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.3em] font-black">Live_Environment_S0{activeStep.id}</span>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Active: {currentApp}</span>
                  </div>
                </div>

                {/* Step Pips */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => currentStep > 0 && goToStep(currentStep - 1)}
                    disabled={currentStep === 0}
                    className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 disabled:opacity-20 transition-all border border-transparent hover:border-white/10 active:scale-90"
                    title="Previous Step"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex space-x-2">
                    {moduleData.steps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToStep(idx)}
                        className={`h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2.5 bg-white/10 hover:bg-white/20'}`}
                        title={`Step ${idx + 1}`}
                      ></button>
                    ))}
                  </div>
                  <button
                    onClick={() => currentStep < moduleData.steps.length - 1 && goToStep(currentStep + 1)}
                    disabled={currentStep === moduleData.steps.length - 1}
                    className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 disabled:opacity-20 transition-all border border-transparent hover:border-white/10 active:scale-90"
                    title="Next Step"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="flex items-center space-x-2 lg:space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isPlaying
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    }`}
                    title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
                    <span className="hidden sm:inline uppercase text-[9px] tracking-wider">{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/10 transition-all active:scale-90"
                    title="Reset Simulation"
                  >
                    <RotateCcw size={13} />
                  </button>

                  <button
                    onClick={() => setIsSimplified(!isSimplified)}
                    className={`p-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase tracking-wider hidden sm:flex items-center gap-1 ${
                      isSimplified
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                    }`}
                    title="Toggle Simplified / Large Text Mode"
                  >
                    <span>Large Text</span>
                  </button>

                  <div className="text-right flex-col hidden md:flex">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Telemetry</span>
                    <span className="text-[9px] font-black text-green-400 font-mono tracking-wider bg-green-500/10 px-2.5 py-0.5 rounded border border-green-500/20">
                      {activeStep.statusText}
                    </span>
                  </div>
                </div>
              </div>

              {/* SLIDING CONTENT CORE */}
              <div className="flex-1 min-h-0 relative overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-[#0f172a]/20">
                <div
                  key={`${currentApp}-${currentStep}`}
                  className={`w-full h-full animate-in ${direction === 'right' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'} fade-in duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`}
                >
                  {renderSimulation()}
                </div>
              </div>

              {/* Instruction Panel (Explanation) */}
              <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
                <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-4 duration-500 backdrop-blur-3xl pointer-events-auto hover:border-white/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] flex items-center">
                      <span className="w-6 h-0.5 bg-blue-500/60 mr-2"></span>
                      Module Task 0{activeStep.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                        <h3 className="text-[10px] font-black text-white tracking-wider uppercase flex items-center">
                          {activeStep.title}
                        </h3>
                        <Info size={12} className="ml-1.5 text-blue-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInstructionOpen(!isInstructionOpen)}
                        className="text-[10px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10"
                      >
                        {isInstructionOpen ? 'Minimize' : 'Expand'}
                      </button>
                    </div>
                  </div>
                  {isInstructionOpen && (
                    <p className={`font-semibold text-gray-100 leading-snug tracking-tight ${isSimplified ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>
                      <TypingText text={activeStep.description} speed={15} />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Right Side: Knowledge & Control Center */}
          <aside className="hidden xl:flex xl:w-72 2xl:w-80 flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar min-h-0">

            {/* Quick Settings Card */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col space-y-4 shadow-xl shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Adaptive UI</h3>
                  <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Accessibility Mode</p>
                </div>
                <button
                  onClick={() => setIsSimplified(!isSimplified)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-500 flex items-center ${isSimplified ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isSimplified ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Automation</span>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${isPlaying ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                  {isPlaying ? 'ACTIVE' : 'HALTED'}
                </div>
              </div>
            </div>

            {/* Guidelines Knowledge Base */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 flex-1 flex flex-col shadow-xl overflow-hidden min-h-[160px]">
              <div className="flex items-center space-x-3 mb-3 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Guidelines</h3>
              </div>
              <ul className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {BEST_PRACTICES.map((practice, idx) => (
                  <li key={idx} className="flex items-start space-x-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 group-hover:scale-150 transition-all duration-300 shadow-[0_0_6px_#3b82f6]"></div>
                    <span className="text-[11px] font-semibold text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed uppercase tracking-tight">
                      {practice}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facts Card */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 relative overflow-hidden h-32 flex flex-col justify-center shadow-xl group shrink-0">
              <div className="flex items-center space-x-3 mb-2 relative z-10">
                <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
                  <Lightbulb size={16} className="text-yellow-400" />
                </div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Quick Fact</h3>
              </div>
              <div className="relative z-10 h-14 flex items-center">
                <p className="text-[11px] text-blue-200 font-medium leading-relaxed italic animate-in fade-in duration-500" key={didYouKnowIndex}>
                  "{DID_YOU_KNOW[didYouKnowIndex]}"
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 scale-150 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Globe size={100} />
              </div>
            </div>

            {/* Simulation Controller Plate */}
            <div className="glass-panel p-4 rounded-3xl border border-white/10 flex items-center justify-between px-6 bg-blue-600/10 shadow-2xl shrink-0">
              <button
                onClick={handleReset}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group active:scale-90 text-gray-400 hover:text-white"
                title="Reset Simulation"
              >
                <RotateCcw size={18} className="group-hover:rotate-[-180deg] transition-transform duration-1000" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg group ${isPlaying ? 'bg-amber-600 shadow-amber-900/40 text-white' : 'bg-green-600 shadow-green-900/40 text-white'}`}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={22} fill="currentColor" />
                ) : (
                  <Play size={22} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[9px] font-black text-gray-500 uppercase mb-1 tracking-wider">Progress</span>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep.id >= i ? 'bg-blue-400 scale-110 shadow-[0_0_8px_#60a5fa]' : 'bg-white/10'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Global Status Footer */}
        <footer className="h-auto md:h-10 py-4 md:py-0 glass-panel border-t-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 text-[10px] font-mono text-gray-500 uppercase tracking-[0.5em] font-black shrink-0 gap-4 md:gap-0">
          <div className="flex items-center space-x-10">
            <span className="flex items-center"><Zap size={14} className="mr-3 text-blue-500" /> NODE_ID: 771-WORKPLACE</span>
            <span className="text-gray-800">|</span>
            <span className="text-blue-600/60 font-black tracking-[0.5em] flex items-center">
              <CheckCircle2 size={12} className="mr-2" /> CORE_GOAL: JOB_READY
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="opacity-40">FRAME_RENDER: 60FPS</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-green-500/70">SECURE_LINK_ACTIVE</span>
            </div>
          </div>
        </footer>

      </div >
    </>
  );
};

export default App;
