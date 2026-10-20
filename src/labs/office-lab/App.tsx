
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

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentApp, setCurrentApp] = useState<OfficeApp>(OfficeApp.WORD);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSimplified, setIsSimplified] = useState(false);
  const [didYouKnowIndex, setDidYouKnowIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className={commonStyles}>
            <div className="flex items-center space-x-3 mb-4 shrink-0">
              <FileText color={COLORS.WORD} size={isSimplified ? 36 : 28} />
              <h3 className={`font-bold text-white uppercase tracking-wider ${isSimplified ? 'text-2xl' : 'text-xl'}`}>Project_Report_v1.docx</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 flex-1 border border-white/10 relative overflow-y-auto md:overflow-hidden flex flex-col min-h-[300px]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/50"></div>
              {currentStep === 0 && (
                <div className="flex flex-col space-y-6">
                  <div className="h-8 bg-white/10 rounded w-1/2 animate-pulse"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-white/5 rounded w-5/6"></div>
                  </div>
                  <div className="w-[3px] h-10 bg-blue-500 animate-[bounce_1s_infinite] mt-4"></div>
                </div>
              )}
              {currentStep >= 1 && (
                <div className="space-y-8">
                  <h2 className={`font-black text-blue-400 leading-tight ${isSimplified ? 'text-4xl' : 'text-3xl'}`}>
                    <TypingText text="Executive Summary: Renewable Energy" speed={25} />
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                      <p className={`font-black text-blue-300 uppercase mb-4 tracking-widest ${isSimplified ? 'text-lg' : 'text-sm'}`}>Key Research Data</p>
                      <ul className="space-y-4">
                        {[
                          "Solar power efficiency increased by 15.4% YoY",
                          "Wind farm distribution reaches new peaks in Asia",
                          "Battery storage costs decreased by 40% since 2020"
                        ].map((text, i) => (
                          <li key={i} className="flex items-center space-x-4 text-gray-200">
                            <CheckCircle2 size={24} className="text-blue-500 flex-shrink-0" />
                            <span><TypingText text={text} speed={15} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="mt-auto flex justify-end">
                  <div className="flex items-center space-x-3 bg-green-500/20 border border-green-500/50 p-4 rounded-2xl animate-bounce">
                    <Cloud className="text-green-400" size={28} />
                    <span className="font-black text-green-300 uppercase tracking-widest">Saved to Cloud</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case OfficeApp.EXCEL:
        return (
          <div className={commonStyles}>
            <div className="flex items-center space-x-3 mb-4 shrink-0">
              <BarChart3 color={COLORS.EXCEL} size={isSimplified ? 36 : 28} />
              <h3 className={`font-bold text-white uppercase tracking-wider ${isSimplified ? 'text-2xl' : 'text-xl'}`}>Financial_Forecast.xlsx</h3>
            </div>
            <div className="bg-[#0f172a] rounded-2xl overflow-y-auto md:overflow-hidden border border-white/10 shadow-2xl flex-1 flex flex-col min-h-[300px]">
              <table className="w-full text-left border-collapse font-mono">
                <thead className="bg-white/10 text-gray-400 uppercase font-black">
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
          <div className={`${commonStyles} items-center justify-center !pb-4 md:!pb-72`}>
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
          <div className={`${commonStyles} items-center justify-center !pb-4 md:!pb-72`}>
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
          <div className={`${commonStyles} items-center justify-center !pb-4 md:!pb-72`}>
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
          onExit={() => {
            if (onClose) {
              onClose();
              return;
            }
            window.history.back();
          }}
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
      <div className="hidden md:flex relative min-h-screen md:h-screen w-full flex-col text-white overflow-y-auto md:overflow-y-auto md:overflow-hidden font-sans">
        {/* Background FX */}
        <div className="absolute inset-0 -z-10 bg-[#070B1A]">
          <div className="absolute inset-0 animated-grid opacity-30"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#070B1A]/80 to-[#070B1A]"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full"></div>
        </div>

        {/* Futuristic Header */}
        <header className="flex-none flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 glass-panel border-b border-white/5 gap-4 md:gap-0">
          <div className="flex items-center space-x-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transform -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer active:scale-90 relative z-50" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="md:hidden text-white" size={32} /> : <Zap className="md:hidden text-white" size={32} fill="white" />}
              <Zap className="hidden md:block text-white" size={32} fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">OFFICE_LAB_X</h1>
              <p className="text-[11px] text-blue-500 font-mono tracking-[0.4em] uppercase mt-2 font-bold opacity-70">Unified Productivity Simulation</p>
            </div>
          </div>
          <div className="flex items-center space-x-12">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">CURRICULUM_V.4</span>
              <span className="text-sm font-black text-blue-200 tracking-wider">CAREER PREP TRACK</span>
            </div>
            <div className="h-12 w-px bg-white/10"></div>
            <div className="flex items-center space-x-4 bg-white/5 rounded-2xl px-6 py-2.5 border border-white/10 group cursor-default hover:bg-white/10 transition-colors">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]"></div>
              <span className="text-[11px] font-black text-green-400 uppercase tracking-widest">ENGINE_ONLINE</span>
            </div>
          </div>
        </header>

        {/* Main Core Layout */}
        <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-y-auto md:overflow-hidden p-4 md:p-6 gap-6">

          {/* Left Side: Topic Navigation */}
          <aside className={`${isSidebarOpen ? 'flex fixed inset-0 z-40 pt-32 pb-8 px-6 bg-[#070B1A]/95 backdrop-blur-xl' : 'hidden'} md:flex w-[320px] shrink-0 glass-panel rounded-[2.5rem] flex-col overflow-y-auto md:overflow-hidden border border-white/10 transition-all duration-300`}>
            <div className="p-8 border-b border-white/5">
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-8 opacity-60">System Modules</h2>
              <nav className="space-y-3">
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
                    }}
                    className={`w-full flex items-center space-x-5 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-y-auto md:overflow-hidden ${currentApp === item.id
                      ? 'bg-white/15 border border-white/20 translate-x-2'
                      : 'hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    {currentApp === item.id && (
                      <div className="absolute left-0 top-0 w-1.5 h-full" style={{ backgroundColor: item.color }}></div>
                    )}
                    <item.icon
                      size={22}
                      style={{ color: currentApp === item.id ? item.color : 'rgba(255,255,255,0.3)' }}
                      className="group-hover:scale-125 transition-transform duration-300"
                    />
                    <span className={`text-sm font-black tracking-widest transition-colors ${currentApp === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {item.id.toUpperCase()}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl p-6 border border-white/10 relative overflow-y-auto md:overflow-hidden group">
                <div className="flex items-center space-x-3 mb-4">
                  <Info size={18} className="text-blue-400" />
                  <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Module_Log</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed italic font-bold group-hover:text-gray-300 transition-colors">
                  "Efficiency is doing things right; Effectiveness is doing the right things."
                </p>
              </div>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button
                onClick={onClose}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl transition-all uppercase text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2"
              >
                <X size={14} /> EXIT SIMULATION
              </button>
            </div>
          </aside>

          {/* Center Side: THE SIMULATOR (SLIDING) */}
          <section className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden relative min-h-[500px]">
            <div className="flex-1 glass-panel rounded-[3rem] relative overflow-y-auto md:overflow-hidden flex flex-col border border-white/10 shadow-2xl">
              {/* Simulation Header */}
              <div className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-white/5 backdrop-blur-xl relative z-20 shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] font-black">Live_Environment_S0{activeStep.id}</span>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Active App: {currentApp}</span>
                  </div>
                </div>

                {/* Step Pips */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => currentStep > 0 && goToStep(currentStep - 1)}
                    disabled={currentStep === 0}
                    className="p-2.5 hover:bg-white/10 rounded-full text-gray-400 disabled:opacity-10 transition-all border border-transparent hover:border-white/10 active:scale-90"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="flex space-x-3">
                    {moduleData.steps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToStep(idx)}
                        className={`h-2 rounded-full transition-all duration-700 ${idx === currentStep ? 'w-12 bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'w-3 bg-white/10 hover:bg-white/20'}`}
                      ></button>
                    ))}
                  </div>
                  <button
                    onClick={() => currentStep < moduleData.steps.length - 1 && goToStep(currentStep + 1)}
                    disabled={currentStep === moduleData.steps.length - 1}
                    className="p-2.5 hover:bg-white/10 rounded-full text-gray-400 disabled:opacity-10 transition-all border border-transparent hover:border-white/10 active:scale-90"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right flex flex-col">
                    <span className="text-[9px] font-black text-gray-600 uppercase mb-1">Telemetry</span>
                    <span className="text-[10px] font-black text-green-400 font-mono tracking-widest bg-green-500/10 px-4 py-1.5 rounded-xl border border-green-500/20">
                      {activeStep.statusText}
                    </span>
                  </div>
                </div>
              </div>

              {/* SLIDING CONTENT CORE */}
              <div className="flex-1 relative overflow-y-auto md:overflow-hidden bg-gradient-to-b from-transparent to-[#0f172a]/20">
                <div
                  key={`${currentApp}-${currentStep}`}
                  className={`w-full h-full animate-in ${direction === 'right' ? 'slide-in-from-right-12' : 'slide-in-from-left-12'} fade-in duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto md:overflow-hidden`}
                >
                  {renderSimulation()}
                </div>
              </div>

              {/* Instruction Panel (Explanation) */}
              <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none">
                <div className="glass-panel p-8 rounded-[2rem] border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-12 duration-1000 backdrop-blur-3xl pointer-events-auto hover:border-white/40 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] flex items-center">
                      <span className="w-10 h-0.5 bg-blue-500/40 mr-4"></span>
                      Module Task 0{activeStep.id}
                    </span>
                    <div className="flex items-center bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      <h3 className="text-[10px] font-black text-white tracking-widest uppercase flex items-center">
                        {activeStep.title}
                      </h3>
                      <Info size={14} className="ml-2 text-blue-400" />
                    </div>
                  </div>
                  <p className={`font-bold text-gray-100 leading-snug tracking-tight ${isSimplified ? 'text-2xl' : 'text-xl'}`}>
                    <TypingText text={activeStep.description} speed={15} />
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Side: Knowledge & Control Center */}
          <aside className="w-full md:w-full md:w-96 flex flex-col gap-6 shrink-0">

            {/* Quick Settings Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex flex-col space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Adaptive UI</h3>
                  <p className="text-[10px] text-gray-600 mt-2 uppercase font-black tracking-tighter opacity-70">Accessibility Toggle</p>
                </div>
                <button
                  onClick={() => setIsSimplified(!isSimplified)}
                  className={`w-16 h-8 rounded-full p-1.5 transition-all duration-700 flex items-center ${isSimplified ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-2xl transform transition-transform duration-500 ${isSimplified ? 'translate-x-8' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="h-px bg-white/10"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Automation</span>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${isPlaying ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                  {isPlaying ? 'ACTIVE' : 'HALTED'}
                </div>
              </div>
            </div>

            {/* Guidelines Knowledge Base */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 flex-1 flex flex-col shadow-xl overflow-y-auto md:overflow-hidden">
              <div className="flex items-center space-x-4 mb-6 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 size={22} className="text-green-400" />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Guidelines</h3>
              </div>
              <ul className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {BEST_PRACTICES.map((practice, idx) => (
                  <li key={idx} className="flex items-start space-x-5 group animate-in slide-in-from-right-12" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-150 transition-all duration-300 shadow-[0_0_8px_#3b82f6]"></div>
                    <span className="text-[13px] font-bold text-gray-500 group-hover:text-gray-100 transition-colors leading-relaxed cursor-default uppercase tracking-tight">
                      {practice}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facts Card */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 relative overflow-y-auto md:overflow-hidden h-44 flex flex-col justify-center shadow-xl group shrink-0">
              <div className="flex items-center space-x-4 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
                  <Lightbulb size={22} className="text-yellow-400" />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Quick Fact</h3>
              </div>
              <div className="relative z-10 h-16 flex items-center">
                <p className="text-xs text-blue-200 font-bold leading-relaxed italic animate-in fade-in slide-in-from-right-12 duration-1000" key={didYouKnowIndex}>
                  "{DID_YOU_KNOW[didYouKnowIndex]}"
                </p>
              </div>
              <div className="absolute -bottom-16 -right-16 opacity-5 rotate-12 scale-[2] pointer-events-none group-hover:opacity-10 transition-opacity">
                <Globe size={150} />
              </div>
            </div>

            {/* Simulation Controller Plate */}
            <div className="glass-panel p-5 rounded-[3.5rem] border border-white/10 flex items-center justify-between px-10 bg-blue-600/10 shadow-2xl shrink-0">
              <button
                onClick={handleReset}
                className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl transition-all border border-white/10 group active:scale-90"
              >
                <RotateCcw size={24} className="text-gray-500 group-hover:rotate-[-180deg] transition-transform duration-1000" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-6 rounded-[2rem] transition-all transform hover:scale-110 active:scale-90 shadow-[0_20px_40px_rgba(0,0,0,0.4)] group ${isPlaying ? 'bg-orange-600 shadow-orange-900/40' : 'bg-green-600 shadow-green-900/40'}`}
              >
                {isPlaying ? (
                  <Pause size={32} fill="currentColor" className="text-white" />
                ) : (
                  <Play size={32} fill="currentColor" className="ml-1 text-white" />
                )}
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Progress</span>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeStep.id >= i ? 'bg-blue-400 scale-125 shadow-[0_0_10px_#60a5fa]' : 'bg-white/10'}`}
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
