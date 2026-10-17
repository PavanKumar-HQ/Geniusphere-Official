import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Lock, Zap, AlertTriangle, Terminal,
    ChevronRight, ChevronLeft, Play, Pause, RefreshCw,
    CheckCircle, XCircle, Info, Hash, Menu, X
} from 'lucide-react';
import { ATTACK_MODULES } from '../../cybersecurity_constants';
import { AnimationPlayer } from './AnimationPlayer';
import type { AttackModuleData } from '../../cybersecurity_types';

interface CybersecurityLabProps {
    onClose: () => void;
}

export const CybersecurityLab: React.FC<CybersecurityLabProps> = ({ onClose }) => {
    const [selectedModuleId, setSelectedModuleId] = useState<string>(ATTACK_MODULES[0].id);
    const [currentStep, setCurrentStep] = useState(0);
    const [showDefense, setShowDefense] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Derived state
    const currentModule = ATTACK_MODULES.find(m => m.id === selectedModuleId) || ATTACK_MODULES[0];
    const totalSteps = currentModule.animationSteps.length;

    // Reset state when module changes
    useEffect(() => {
        setCurrentStep(0);
        setShowDefense(false);
        setIsPlaying(false);
    }, [selectedModuleId]);

    // Animation timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                if (currentStep < totalSteps - 1) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    if (!showDefense) {
                        setShowDefense(true);
                    } else {
                        setIsPlaying(false);
                    }
                }
            }, 3000); // 3 seconds per step
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, totalSteps, showDefense]);

    // Handlers
    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowDefense(true);
        }
    };

    const handlePrev = () => {
        if (showDefense) {
            setShowDefense(false);
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setShowDefense(false);
    }

    return (
        <div className="fixed inset-0 z-[1000] bg-slate-950 text-white overflow-hidden flex flex-col md:flex-row">
            {/* Global Exit Button - Standardized with other high-fidelity labs */}
            <div className="fixed top-4 right-4 z-[999999] pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-3 bg-slate-800 hover:bg-red-600 text-white rounded-full transition-all shadow-2xl active:scale-95 border border-white/10"
                    title="Exit Lab"
                    aria-label="Exit Lab"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Sidebar - Module List */}
            {/* Mobile: Drawer overlay */}
            <div className={`
                fixed inset-0 z-50 bg-slate-900 transition-transform duration-300 md:relative md:translate-x-0 md:w-80 md:border-r md:border-white/10 md:flex md:flex-col md:h-full md:z-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                                <Shield className="text-red-500 w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold font-mono tracking-tighter">CYBER_LAB</h2>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">Select a threat to analyze</p>
                    </div>
                    {/* Close Sidebar Button (Mobile) */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {ATTACK_MODULES.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => {
                                setSelectedModuleId(module.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden ${selectedModuleId === module.id
                                ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                : 'bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-white/10'
                                }`}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <span className={`text-sm font-bold font-mono ${selectedModuleId === module.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    {module.title}
                                </span>
                                {selectedModuleId === module.id && <ChevronRight size={16} className="text-indigo-400" />}
                            </div>
                            {selectedModuleId === module.id && (
                                <motion.div
                                    layoutId="active-glow"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button onClick={onClose} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm">
                        Exit Lab
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">

                {/* Header */}
                <div className="p-4 md:p-10 pb-0">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                            {/* Mobile Top Row: Back Button + Menu Toggle */}
                            <div className="flex items-center justify-between w-full sm:w-auto">
                                <button
                                    onClick={onClose}
                                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white flex items-center gap-2"
                                >
                                    <ChevronLeft size={24} />
                                    <span className="text-sm font-bold">Exit</span>
                                </button>

                                <button
                                    className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-white/10"
                                    onClick={() => setIsSidebarOpen(true)}
                                >
                                    <Menu size={20} />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">MODULE: {currentModule.id.toUpperCase()}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 font-mono flex items-center gap-1">
                                    <Terminal size={10} /> SIMULATION_ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{currentModule.title}</h1>
                    <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed border-l-2 border-indigo-500 pl-4">
                        {currentModule.simpleDefinition}
                    </p>
                </div>

                {/* Animation Stage */}
                <div className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-8 min-h-0">

                    {/* Player Container */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="relative w-full aspect-video bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden group">
                            {/* Scanlines Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20" />

                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono">
                                    <div className={`w-2 h-2 rounded-full ${showDefense ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'}`}></div>
                                    <span className={showDefense ? 'text-green-400' : 'text-red-400'}>
                                        {showDefense ? 'DEFENSE_ACTIVE' : 'ATTACK_IN_PROGRESS'}
                                    </span>
                                </div>
                            </div>

                            <AnimationPlayer
                                module={currentModule}
                                currentStep={currentStep}
                                showDefense={showDefense}
                                reducedMotion={false}
                                isFocusPaused={!isPlaying}
                                focusPoint={currentModule.animationSteps[currentStep]?.focusPoint}
                            />
                        </div>

                        {/* Controls */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <button onClick={handleReset} className="p-3 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors bg-white/5 sm:bg-transparent">
                                    <RefreshCw size={20} />
                                </button>
                                <button onClick={togglePlay} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                    {isPlaying ? 'PAUSE' : 'PLAY SIM'}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 w-full justify-between sm:justify-end">
                                {/* Step Indicators - Hidden on very small screens if crowded */}
                                <div className="hidden sm:flex items-center gap-1 flex-1 justify-center px-4">
                                    {currentModule.animationSteps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep
                                                ? 'w-8 bg-indigo-500 shadow-[0_0_10px_#6366f1]'
                                                : idx < currentStep
                                                    ? 'w-2 bg-indigo-500/40'
                                                    : 'w-2 bg-slate-700'
                                                }`}
                                        />
                                    ))}
                                    <div className={`h-1.5 rounded-full transition-all duration-300 ${showDefense ? 'w-8 bg-green-500 shadow-[0_0_10px_#22c55e]' : 'w-2 bg-slate-700'}`} />
                                </div>

                                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                    <button onClick={handlePrev} disabled={currentStep === 0 && !showDefense} className="p-3 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30 bg-white/5 sm:bg-transparent">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={handleNext} disabled={showDefense} className="p-3 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-30 bg-white/5 sm:bg-transparent">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Current Step Description */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={showDefense ? 'defense' : currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-slate-900/80 border border-white/10 p-4 rounded-xl"
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 bg-black/20 p-2 rounded-lg h-fit ${showDefense ? 'text-green-400 border border-green-500/20' : 'text-indigo-400 border border-indigo-500/20'}`}>
                                        {showDefense ? <CheckCircle size={20} /> : <Info size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold font-mono mb-1 uppercase tracking-wider ${showDefense ? 'text-green-400' : 'text-indigo-400'}`}>
                                            {showDefense ? 'Defense Strategy' : `Step ${currentStep + 1}: ${currentModule.animationSteps[currentStep]?.label}`}
                                        </h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {showDefense
                                                ? currentModule.animationSteps[currentModule.animationSteps.length - 1].text
                                                : currentModule.animationSteps[currentStep]?.text}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Info Side Panel */}
                    <div className="w-full lg:w-80 flex flex-col gap-4">

                        {/* Kid Friendly Explanation */}
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-5 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Zap size={80} />
                            </div>
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Zap size={16} className="text-yellow-400" /> Simplified
                            </h3>
                            <p className="text-slate-300 text-sm italic">"{currentModule.kidFriendly}"</p>
                        </div>

                        {/* Defensive Measures */}
                        <div className="bg-slate-900/50 border border-green-500/20 p-5 rounded-xl">
                            <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider font-mono">
                                <Lock size={16} className="text-green-500" /> Defense Protocols
                            </h3>
                            <ul className="space-y-3">
                                {currentModule.defenses.map((defense, i) => (
                                    <li key={i} className="flex gap-3 text-sm group">
                                        <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 group-hover:shadow-[0_0_8px_#22c55e] transition-shadow shrink-0" />
                                        <div>
                                            <strong className="text-slate-200 block text-xs uppercase tracking-wide mb-0.5">{defense.point}</strong>
                                            <span className="text-slate-400 text-xs">{defense.description}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fun Fact */}
                        <div className="bg-slate-900/50 border border-white/5 p-5 rounded-xl">
                            <h3 className="text-slate-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
                                <Hash size={14} /> Did You Know?
                            </h3>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                {currentModule.funFact}
                            </p>
                        </div>

                        <div className="mt-auto bg-slate-950/50 border border-white/5 p-4 rounded-xl text-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Completion Badge</div>
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 border-2 border-white/10">
                                <Shield className="text-white" size={32} />
                            </div>
                            <div className="mt-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 text-sm">{currentModule.badge}</div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};
