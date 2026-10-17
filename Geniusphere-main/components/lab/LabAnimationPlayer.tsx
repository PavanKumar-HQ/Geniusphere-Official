import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LabModule } from './LabTypes';
import {
    Brain, Database, Server, Wifi, Smartphone, Globe, Shield, Lock,
    Cpu, Cloud, DollarSign, PieChart, TrendingUp, Hash, Layers,
    MessageSquare, Users, User, Smile, Frown, Sparkles, GraduationCap,
    Lightbulb, Megaphone, Heart
} from 'lucide-react';

interface LabAnimationPlayerProps {
    module: LabModule;
    currentStep: number;
    isPlaying: boolean;
}

const Icons: Record<string, React.ElementType> = {
    Brain, Database, Server, Wifi, Smartphone, Globe, Shield, Lock,
    Cpu, Cloud, DollarSign, PieChart, TrendingUp, Hash
};

// --- Sub-Components for Scale and Modularity ---

const ProcessFlowView: React.FC<{ currentStep: number, steps: LabModule['animationSteps'], icon?: string }> = ({ currentStep, steps, icon }) => {
    // Original generic view
    const activeStepData = steps[currentStep];
    const IconComponent = icon && Icons[icon] ? Icons[icon] : Cpu;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="8 8" />
                <motion.line
                    x1="20%" y1="50%" x2="80%" y2="50%"
                    stroke="url(#gradient)" strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: (currentStep + 1) / steps.length }}
                    transition={{ duration: 0.5 }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>

            <div className="relative z-10 flex gap-4 md:gap-12 items-center">
                {/* Previous Step */}
                <AnimatePresence mode="popLayout">
                    {currentStep > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            animate={{ opacity: 0.4, x: 0, scale: 0.8 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="hidden md:flex flex-col items-center"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                                <span className="text-white/50">{currentStep}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Node */}
                <motion.div
                    key={currentStep}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl"
                        />
                        <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl relative overflow-hidden border border-white/20">
                            <div className="text-white">
                                <IconComponent size={32} className="sm:w-12 sm:h-12" />
                            </div>
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Next Step */}
                <div className="hidden md:flex flex-col items-center opacity-40 grayscale">
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center border-dashed">
                        <span className="text-white/30">{currentStep + 2 <= steps.length ? currentStep + 2 : 'End'}</span>
                    </div>
                </div>
            </div>

            {/* Travelling Particle */}
            <motion.div
                className="absolute w-4 h-4 bg-cyan-400 rounded-full blur-[2px] shadow-[0_0_10px_#22d3ee]"
                animate={{ x: ['-20vw', '20vw'], y: [Math.sin(currentStep) * 20, Math.cos(currentStep) * -20] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                style={{ left: '50%', top: '50%' }}
            />
        </div>
    );
}

const NeuralNetworkView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Visualize simple 3-layer net: Input (3 nodes) -> Hidden (4 nodes) -> Output (2 nodes)
    // Step 0: Input Highlight; Step 1: Input->Hidden lines; Step 2: Hidden Highlight; Step 3: Hidden->Output; Step 4: Output

    // Determine active layer based on step (rough mapping)
    const isInputActive = currentStep === 0;
    const isHiddenActive = currentStep >= 1 && currentStep <= 2;
    const isOutputActive = currentStep >= 3;
    const isTraining = currentStep === 4;

    return (
        <div className="flex items-center justify-center gap-12 md:gap-24 h-full w-full px-8">
            {/* Input Layer */}
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={`in-${i}`}
                        animate={{
                            scale: isInputActive ? 1.2 : 1,
                            backgroundColor: isInputActive ? '#22d3ee' : '#1e293b',
                            boxShadow: isInputActive ? '0 0 20px rgba(34, 211, 238, 0.5)' : 'none'
                        }}
                        className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/20 relative z-10"
                    />
                ))}
                <span className="text-xs text-center text-slate-500 font-mono mt-2">INPUT</span>
            </div>

            {/* Connecting Lines Layer 1 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Imagine SVG lines here, simplified for now with CSS or implied */}
            </div>

            {/* Hidden Layer */}
            <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map(i => (
                    <motion.div
                        key={`hid-${i}`}
                        animate={{
                            scale: isHiddenActive ? 1.2 : 1,
                            backgroundColor: isHiddenActive ? '#a855f7' : '#1e293b',
                            boxShadow: isHiddenActive ? '0 0 20px rgba(168, 85, 247, 0.5)' : 'none'
                        }}
                        transition={{ delay: i * 0.1 }}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full border border-white/20 relative z-10"
                    />
                ))}
                <span className="text-xs text-center text-slate-500 font-mono mt-2">HIDDEN</span>
            </div>

            {/* Output Layer */}
            <div className="flex flex-col gap-8">
                {[1, 2].map(i => (
                    <motion.div
                        key={`out-${i}`}
                        animate={{
                            scale: isOutputActive ? 1.2 : 1,
                            backgroundColor: isOutputActive ? (i === 1 ? '#22c55e' : '#1e293b') : '#1e293b', // Highlight "Cat" (i=1) on output
                            boxShadow: isOutputActive && i === 1 ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none'
                        }}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-[10px] md:text-xs font-bold"
                    >
                        {i === 1 ? 'CAT' : 'DOG'}
                    </motion.div>
                ))}
                <span className="text-xs text-center text-slate-500 font-mono mt-2">OUTPUT</span>
            </div>

            {/* Moving Pulses simulating data flow */}
            {currentStep >= 1 && (
                <motion.div
                    className="absolute left-1/4 top-1/2 w-4 h-4 bg-white rounded-full blur-md"
                    animate={{ x: ['0%', '200%'], opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            )}
        </div>
    );
}

const GrowthChartView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Bar chart growing.
    // Step 0: Initial seed
    // Step 1-4: Bars growing taller exponentially

    const bars = [10, 20, 40, 80, 160];
    const activeHeight = bars[Math.min(currentStep, bars.length - 1)];

    return (
        <div className="w-full h-full flex items-end justify-center gap-4 md:gap-8 px-12 pb-12">
            {bars.map((height, idx) => {
                const isActive = idx <= currentStep;
                return (
                    <div key={idx} className="flex flex-col items-center gap-2 w-16">
                        <div className="text-xs text-green-400 font-mono mb-1 opacity-0 transition-opacity duration-300" style={{ opacity: isActive ? 1 : 0 }}>
                            ${height * 10}
                        </div>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{
                                height: isActive ? `${height * 1.5}px` : '4px',
                                backgroundColor: isActive ? '#22c55e' : '#334155'
                            }}
                            className="w-full rounded-t-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                        />
                        <span className="text-xs text-slate-500">Yr {idx + 1}</span>
                    </div>
                )
            })}

            {/* Trend Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                {/* Simplified curve representation */}
                <path d="M 100 250 Q 250 250 400 50" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
            </svg>
        </div>
    );
}

const BudgetPieView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Pie chart slices appearing
    // Step 0: Income (Full Circle)
    // Step 1: Needs (50% slice)
    // Step 2: Wants (30% slice)
    // Step 3: Savings (20% slice)

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-800 relative bg-slate-900 flex items-center justify-center">
                {/* Income Base */}
                <motion.div
                    className="absolute inset-0 rounded-full border-8 border-slate-700 opacity-20"
                />

                {/* Needs Slice (50%) - CSS Conic Gradient approximation for simplicity in react */}
                <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: currentStep >= 1 ? 1 : 0, rotate: 0 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(#ef4444 0% 50%, transparent 50% 100%)', opacity: 0.8 }}
                />

                {/* Wants Slice (30%) */}
                <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: currentStep >= 2 ? 1 : 0, rotate: 180 }} // Start where 50% ends
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(transparent 0%, #3b82f6 0% 30%, transparent 30% 100%)', opacity: 0.8 }}
                />

                {/* Savings Slice (20%) */}
                <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: currentStep >= 3 ? 1 : 0, rotate: 288 }} // Start where 80% ends
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(transparent 0%, #22c55e 0% 20%, transparent 20% 100%)', opacity: 0.8 }}
                />

                {/* Center Label */}
                <div className="z-10 bg-slate-950 p-6 rounded-full border border-white/10 text-center w-32 h-32 flex flex-col items-center justify-center">
                    <DollarSign className="text-green-400 mb-1" />
                    <span className="text-white font-bold text-lg">
                        {currentStep === 0 ? '$100%' : 'Budget'}
                    </span>
                </div>
            </div>

            {/* Labels */}
            {currentStep >= 1 && <div className="absolute left-10 top-1/2 -translate-y-1/2 text-red-400 font-bold">Needs 50%</div>}
            {currentStep >= 2 && <div className="absolute right-20 bottom-20 text-blue-400 font-bold">Wants 30%</div>}
            {currentStep >= 3 && <div className="absolute right-20 top-20 text-green-400 font-bold">Savings 20%</div>}
        </div>
    );
}

const HashingView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Step 0: Input "Hello"
    // Step 1: Enters "Hash Function" Box
    // Step 2: Box Shakes/Processes
    // Step 3: Output "a1b2c3..."
    // Step 4: Change Input -> Hash Changes uniquely

    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-12 md:pt-0 pb-20 md:pb-0">
            {/* Input Document */}
            <motion.div
                animate={{
                    x: currentStep === 1 ? 100 : 0,
                    opacity: currentStep === 1 ? 0 : 1,
                    scale: currentStep === 4 ? [1, 1.1, 1] : 1
                }}
                className={`w-20 h-28 md:w-32 md:h-40 bg-white text-slate-900 p-3 md:p-4 rounded shadow-xl flex flex-col gap-2 ${currentStep === 4 ? 'bg-red-100' : ''}`}
            >
                <div className="w-full h-1.5 md:h-2 bg-slate-300 rounded" />
                <div className="w-2/3 h-1.5 md:h-2 bg-slate-300 rounded" />
                <div className="w-full h-1.5 md:h-2 bg-slate-300 rounded" />
                <div className="mt-auto text-[8px] md:text-xs font-mono font-bold">
                    {currentStep >= 4 ? "DATA: CHG" : "DATA: ORG"}
                </div>
            </motion.div>

            {/* The Hash Function Machine */}
            <div className="relative">
                {currentStep >= 1 && currentStep < 3 && (
                    <motion.div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity }}
                    >
                        <Cpu />
                    </motion.div>
                )}
                <motion.div
                    animate={{
                        rotate: currentStep === 2 ? [0, -5, 5, -5, 5, 0] : 0,
                        scale: currentStep === 2 ? 1.1 : 1
                    }}
                    className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-slate-800 border-2 border-amber-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] z-10 relative"
                >
                    <Hash size={24} className="text-amber-500 sm:w-12 sm:h-12" />
                </motion.div>
            </div>

            {/* Output Hash */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{
                    opacity: currentStep >= 3 ? 1 : 0,
                    x: currentStep >= 3 ? 0 : -50,
                    backgroundColor: currentStep === 4 ? '#7f1d1d' : '#1e293b'
                }}
                className="px-6 py-4 bg-slate-800 rounded-lg border border-white/10 font-mono text-amber-400 text-sm break-all max-w-[200px]"
            >
                {currentStep === 4 ? 'b7e2...99a1' : '3a1f...8c2d'}
            </motion.div>
        </div>
    );
}

const IoTSensorView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Step 0: Env Normal
    // Step 1: Env Hot (Red BG)
    // Step 2: Sensor Detects (Waves)
    // Step 3: Cloud Upload
    // Step 4: Action (Fan spins)

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {/* Background Env */}
            <motion.div
                animate={{ opacity: currentStep >= 1 ? 0.2 : 0 }}
                className="absolute inset-0 bg-red-600 z-0"
            />

            <div className="relative z-10 flex items-center gap-12">
                {/* Sensor Device */}
                <div className="relative">
                    <motion.div
                        animate={{ scale: currentStep === 2 ? [1, 1.5, 1] : 1, opacity: currentStep === 2 ? 1 : 0 }}
                        transition={{ repeat: Infinity }}
                        className="absolute inset-0 bg-blue-500 rounded-full opacity-50 blur-lg"
                    />
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-900 border border-blue-500 rounded-full flex items-center justify-center relative">
                        <Wifi className="text-blue-400 w-8 h-8 sm:w-10 sm:h-10" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <div className="text-center mt-2 text-xs font-mono">SENSOR</div>
                </div>

                {/* Arrow to cloud */}
                {currentStep >= 3 && (
                    <motion.div
                        initial={{ width: 0 }} animate={{ width: 100 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-white w-12 sm:w-[100px]"
                    />
                )}

                {/* Cloud */}
                <motion.div
                    animate={{ y: currentStep >= 3 ? [0, -5, 0] : 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center"
                >
                    <Cloud className={`sm:w-16 sm:h-16 w-8 h-8 ${currentStep >= 3 ? "text-white" : "text-slate-700"}`} />
                    <div className="text-xs font-mono mt-1">云 CLOUD</div>
                </motion.div>
            </div>

            {/* Smart Fan/AC Action */}
            {currentStep >= 4 && (
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute bottom-4 right-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-4"
                >
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <div className="w-8 h-8 border-4 border-t-blue-400 border-transparent rounded-full" />
                    </motion.div>
                    <span className="font-bold text-blue-300">AC ON</span>
                </motion.div>
            )}
        </div>
    );
}

const ConversationView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Step 0: Neutral/Listening
    // Step 1: Speaking (One side)
    // Step 2: Processing (Other side)
    // Step 3: Understanding/Connection (Line connects)
    // Step 4: Resolution (Both active)

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
            <div className="flex items-center justify-between w-full max-w-lg relative z-10">
                {/* Person A (Teacher/Speaker) */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ scale: currentStep === 1 || currentStep === 4 ? 1.1 : 1 }}
                        className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex items-center justify-center bg-slate-800 ${currentStep === 1 || currentStep === 4 ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-slate-600'}`}
                    >
                        <User size={40} className="text-white" />
                    </motion.div>
                    {currentStep === 1 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-12 left-0 bg-white text-slate-900 px-3 py-1 rounded-t-xl rounded-br-xl text-xs font-bold">
                            Speaking...
                        </motion.div>
                    )}
                </div>

                {/* Connection Waves */}
                <div className="flex-1 px-4 flex justify-center items-center relative h-20">
                    {/* Speech Bubbles / Waves */}
                    {currentStep >= 1 && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: currentStep >= 3 ? '100%' : '50%' }}
                            className={`h-2 rounded-full ${currentStep >= 3 ? 'bg-gradient-to-r from-indigo-500 to-emerald-500' : 'bg-indigo-500'}`}
                        />
                    )}
                    {currentStep >= 3 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                            className="absolute -top-6 bg-emerald-500/20 text-emerald-400 p-2 rounded-full border border-emerald-500/50"
                        >
                            <Heart size={20} fill="currentColor" />
                        </motion.div>
                    )}
                </div>

                {/* Person B (Student/Listener) */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ scale: currentStep === 2 || currentStep === 4 ? 1.1 : 1 }}
                        className={`w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex items-center justify-center bg-slate-800 ${currentStep >= 3 || currentStep === 4 ? 'border-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-slate-600'}`}
                    >
                        {currentStep >= 3 ? <Smile size={40} className="text-emerald-400" /> : <User size={40} className="text-slate-400" />}
                    </motion.div>
                    {currentStep === 2 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-12 right-0 bg-slate-700 text-white px-3 py-1 rounded-t-xl rounded-bl-xl text-xs font-bold border border-white/20">
                            Thinking...
                        </motion.div>
                    )}
                </div>
            </div>
            <div className="text-slate-500 font-mono text-xs mt-12 tracking-widest text-center">
                {currentStep === 0 ? "LISTENING MODE" : currentStep === 1 ? "TRANSMISSION" : currentStep === 2 ? "PROCESSING" : currentStep === 3 ? "CONNECTION" : "RESOLUTION"}
            </div>
        </div>
    );
}

const ClassroomView: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    // Step 0: Teacher Focus
    // Step 1: Content Distribution (Particles from teacher to students)
    // Step 2: Student Processing (Students glow)
    // Step 3: Interaction (Lines between students)
    // Step 4: Mastery (All green)

    return (
        <div className="w-full h-full flex flex-col items-center pt-8 pb-16 relative overflow-hidden">
            {/* Teacher */}
            <motion.div
                className="z-20 flex flex-col items-center mb-8 relative"
                animate={{ scale: currentStep === 0 ? 1.1 : 1 }}
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl border border-white/20">
                    <GraduationCap size={32} className="text-white" />
                </div>
                {/* Content Emission */}
                {currentStep === 1 && (
                    <motion.div
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border border-purple-400"
                    />
                )}
            </motion.div>

            {/* Students Grid */}
            <div className="grid grid-cols-3 gap-8 md:gap-16 z-10">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                    // Logic for different states per student to simulate variety
                    const isProcessing = currentStep === 2;
                    const isInteracting = currentStep === 3;
                    const isMastered = currentStep === 4;
                    const delay = i * 0.1;

                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay }}
                            className="relative"
                        >
                            <motion.div
                                animate={{
                                    backgroundColor: isMastered ? '#10b981' : isProcessing ? '#f59e0b' : '#1e293b',
                                    y: isProcessing ? [0, -5, 0] : 0
                                }}
                                transition={{ y: { repeat: Infinity, duration: 1 + (i * 0.2) } }}
                                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"
                            >
                                <User size={20} className={isMastered ? 'text-white' : 'text-slate-400'} />
                            </motion.div>

                            {/* Interaction Lines */}
                            {isInteracting && i % 2 !== 0 && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 60, opacity: 1 }}
                                    className="absolute top-1/2 left-full h-0.5 bg-cyan-400/50"
                                />
                            )}

                            {isMastered && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-white text-green-600 rounded-full p-0.5"
                                >
                                    <Sparkles size={10} />
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Connecting lines from teacher to center */}
            {currentStep >= 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
                    <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
            )}
        </div>
    );
}

// --- Main Component ---

export const LabAnimationPlayer: React.FC<LabAnimationPlayerProps> = ({ module, currentStep, isPlaying }) => {
    const { animationType, animationSteps } = module;
    const itemsRef = React.useRef<any>(null);

    const renderContent = () => {
        switch (animationType) {
            case 'neural_network':
                return <NeuralNetworkView currentStep={currentStep} />;
            case 'growth_chart':
                return <GrowthChartView currentStep={currentStep} />;
            case 'budget_pie':
                return <BudgetPieView currentStep={currentStep} />;
            case 'hashing':
                return <HashingView currentStep={currentStep} />;
            case 'iot_sensor':
                return <IoTSensorView currentStep={currentStep} />;
            case 'conversation':
                return <ConversationView currentStep={currentStep} />;
            case 'classroom':
                return <ClassroomView currentStep={currentStep} />;
            case 'process_flow':
            default:
                return <ProcessFlowView currentStep={currentStep} steps={animationSteps} icon={module.icon} />;
        }
    };

    const activeStepData = animationSteps[currentStep];

    return (
        <div className="relative w-full h-full bg-slate-900/50 flex flex-col overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Main Stage */}
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>

            {/* Text Overlay (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center text-center">
                <motion.div
                    key={currentStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-2"
                >
                    <span className="text-indigo-300 font-mono text-xs uppercase tracking-wider block mb-1">Step {currentStep + 1}</span>
                    <span className="text-white font-bold text-lg md:text-xl shadow-black drop-shadow-md">{activeStepData.label.toUpperCase()}</span>
                </motion.div>
                <motion.p
                    key={`desc-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs md:text-sm text-slate-300 max-w-lg"
                >
                    {activeStepData.microcopy}
                </motion.p>
            </div>
        </div>
    );
};
