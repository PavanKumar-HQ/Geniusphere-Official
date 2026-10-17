
import React, { useRef, useEffect, useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, CheckCircle,
    Activity, Menu, Shield, AlertTriangle, DollarSign,
    TrendingUp, Cpu, BookOpen, Check,
    PieChart, MessageSquare, Send, Brain, Database, Link, Mail,
    Award, Download, User, Smartphone, Globe, Lightbulb, Lock, Thermometer, Calendar, Clock,
    Terminal, RefreshCw, Layers, MousePointer2
} from 'lucide-react';
import { UniversalLab } from './lab/UniversalLab';
import { LAB_CONFIGS } from './lab/LabData';
import { TEACHING_LAB_CONFIGS } from './lab/TeachingLabData';
import { STUDENT_LAB_CONFIGS } from './lab/StudentLabData';
import AiLabApp from '../labs/geniusphere-ai-lab/App';
import BankingLabApp from '../labs/banking-accounts-lab/App';
import CommunicationLabApp from '../labs/communication-pro_-interactive-lab/App';
import ProfessionalSkillsLabApp from '../labs/professional-skills-lab_-how-success-really-works/App';
import SocialProfileLabApp from '../labs/social-profile-development-lab/App';
import FintechLabApp from '../labs/fintech-discovery-lab/App';
import StockMarketLabApp from '../labs/stock-market-basics---interactive-lab/App';
import GlobalEconomyLabApp from '../labs/global-economics-simulation-lab/App';
import CryptoLabApp from '../labs/cryptolab_-how-digital-money-works/App';
import IntroFinanceLabApp from '../labs/introduction-to-finance-lab/App';
import DigitalPrivacyLabApp from '../labs/digital-privacy-&-footprint-lab/App';
import IoTLabApp from '../labs/iot-cybersecurity-lab/App';
import BlockchainLabApp from '../labs/trustlink-blockchain-lab/App';
import MicrosoftOfficeLabApp from '../labs/microsoft-office---real-world-skills-lab/App';
import { X } from 'lucide-react';

const LabWrapper: React.FC<{
    children: React.ReactNode,
    onClose: () => void,
    bg?: string
}> = ({ children, onClose, bg = "bg-slate-950" }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[1001] ${bg} h-screen w-screen overflow-y-auto`}
    >
        <div className="fixed top-4 right-4 z-[999999] pointer-events-auto">
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-3 bg-slate-800 hover:bg-red-600 text-white rounded-full transition-all shadow-2xl active:scale-95 border border-white/10"
                title="Exit Simulation"
            >
                <X size={24} />
            </button>
        </div>
        {children}
    </motion.div>
);

const motion = motionBase as any;

interface InteractiveLearningProps {
    simulationId: string;
    onClose: () => void;
    onNavigate: (view: any) => void;
}

interface Chapter {
    id: string;
    title: string;
    type: 'intro' | 'concept' | 'interactive' | 'quiz' | 'challenge' | 'summary';
    description: string;
    visualContent: React.ReactNode;
    interactiveContent?: React.ReactNode;
    quizData?: {
        question: string;
        options: string[];
        correctIndex: number;
    };
}

interface ModuleData {
    id: string;
    title: string;
    category: 'Tech' | 'Finance' | 'Skills';
    color: string;
    accentColor: string;
    chapters: Chapter[];
}

// --- VISUAL HELPERS ---

const IconVisual = ({ icon: Icon, color = "text-white", size = 80 }: { icon: any, color?: string, size?: number }) => (
    <div className="flex items-center justify-center h-full w-full">
        <motion.div
            animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
                filter: ["drop-shadow(0 0 15px rgba(255,255,255,0.2))", "drop-shadow(0 0 25px rgba(255,255,255,0.4))", "drop-shadow(0 0 15px rgba(255,255,255,0.2))"]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
            <Icon size={size} className={`${color}`} />
        </motion.div>
    </div>
);

// --- PARTICLE NETWORK VISUAL (The "Particle Thing") ---
const ParticleNetwork = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.parentElement?.clientWidth || 300;
        let height = canvas.parentElement?.clientHeight || 300;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number, y: number, vx: number, vy: number, originalX: number, originalY: number }[] = [];
        const count = 70;

        for (let i = 0; i < count; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            particles.push({
                x, y,
                originalX: x, originalY: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', () => { mouseRef.current = { x: -1000, y: -1000 } });

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Background Grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
            for (let y = 0; y < height; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

            particles.forEach((p, i) => {
                // Base movement
                p.x += p.vx;
                p.y += p.vy;

                // Mouse interaction (Repel)
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRange = 100;

                if (dist < repelRange) {
                    const angle = Math.atan2(dy, dx);
                    const force = (repelRange - dist) / repelRange;
                    p.x += Math.cos(angle) * force * 2;
                    p.y += Math.sin(angle) * force * 2;
                }

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = dist < repelRange ? '#22d3ee' : '#60A5FA'; // Cyan when close to mouse
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < count; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(96, 165, 250, ${1 - dist2 / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            width = canvas.parentElement?.clientWidth || 300;
            height = canvas.parentElement?.clientHeight || 300;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 cursor-crosshair" />;
}

const CertificateView: React.FC<{ courseName: string; onClose: () => void }> = ({ courseName, onClose }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full text-center p-8 w-full relative z-10"
    >
        <div className="relative bg-slate-900/90 backdrop-blur-xl border-4 border-double border-yellow-500/50 p-8 md:p-12 rounded-xl max-w-3xl w-full shadow-[0_0_100px_rgba(234,179,8,0.2)] overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-yellow-500 rounded-tl-3xl"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-yellow-500 rounded-tr-3xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-yellow-500 rounded-bl-3xl"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-yellow-500 rounded-br-3xl"></div>

            <motion.div
                initial={{ y: -20, opacity: 0, rotateY: 90 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ delay: 0.2, type: 'spring' }}
            >
                <Award size={100} className="text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wide text-glow">Certificate of Completion</h1>
            <p className="text-slate-400 mb-8 text-sm md:text-lg uppercase tracking-widest font-bold">Geniusphere Academy Verified</p>

            <p className="text-slate-300 mb-2 font-serif italic text-lg">This certifies that the student has successfully mastered</p>

            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 mb-8 py-2">{courseName}</h2>

            <div className="flex justify-between items-end text-slate-500 text-xs md:text-sm mt-12 px-8">
                <div className="text-left">
                    <div className="w-40 border-b border-slate-600 mb-2 pb-1 font-['cursive'] text-2xl text-white/90">Genius AI</div>
                    <div className="uppercase tracking-widest text-[10px] font-bold text-slate-500">Instructor</div>
                </div>
                <div className="w-20 h-20 rounded-full border-2 border-yellow-500/20 flex items-center justify-center bg-yellow-500/5">
                    <Shield size={32} className="text-yellow-500/50" />
                </div>
                <div className="text-right">
                    <div className="w-40 border-b border-slate-600 mb-2 pb-1 text-white/90 text-lg font-mono">{new Date().toLocaleDateString()}</div>
                    <div className="uppercase tracking-widest text-[10px] font-bold text-slate-500">Date Issued</div>
                </div>
            </div>
        </div>

        <div className="flex gap-4 mt-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full font-bold transition-all shadow-xl shadow-blue-500/30">
                <Download size={20} /> Download PDF
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-bold transition-all backdrop-blur-md">
                Return to Lab
            </motion.button>
        </div>
    </motion.div>
);

// --- SIMULATIONS ---

const SimulationStage = ({ title, children, color = "border-blue-500/30" }: { title: string, children?: React.ReactNode, color?: string }) => (
    <div className={`w-full h-full flex flex-col bg-black/60 rounded-xl overflow-hidden border ${color} shadow-2xl relative group`}>
        {/* Terminal Header */}
        <div className="bg-slate-900/80 border-b border-white/5 p-3 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
        </div>

        {/* Content Stage */}
        <div className="flex-1 relative overflow-hidden bg-slate-950 p-4 flex items-center justify-center">
            {/* Scanline Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] pointer-events-none opacity-50" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {children}
            </div>
        </div>
    </div>
);

const SimAiTrain = () => {
    const [status, setStatus] = React.useState<'idle' | 'correct' | 'wrong'>('idle');
    const [accuracy, setAccuracy] = React.useState(15);
    const [imageIdx, setImageIdx] = React.useState(0);

    const images = ["🐶", "🐱", "🐶", "🦊", "🐶"];
    const isDog = [true, false, true, false, true];

    const handleChoice = (choice: boolean) => {
        const correct = choice === isDog[imageIdx];
        setStatus(correct ? 'correct' : 'wrong');
        if (correct) setAccuracy(prev => Math.min(prev + 15, 100));

        setTimeout(() => {
            setStatus('idle');
            if (accuracy < 100) {
                setImageIdx(prev => (prev + 1) % images.length);
            }
        }, 800);
    };

    return (
        <SimulationStage title="Neural Network Trainer v2.4">
            {accuracy === 100 ? (
                <div className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500">
                        <CheckCircle size={40} className="text-green-400" />
                    </motion.div>
                    <h3 className="text-white font-bold text-xl mb-2">Model Trained!</h3>
                    <p className="text-slate-400 text-sm">Accuracy optimized to 100%.</p>
                    <button onClick={() => setAccuracy(15)} className="mt-4 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 mx-auto"><RefreshCw size={12} /> Reset</button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                    {/* Model Status */}
                    <div className="w-full bg-slate-900 rounded-lg p-3 border border-white/10 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-mono">MODEL_ACCURACY</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    animate={{ width: `${accuracy}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-blue-400 font-mono">{accuracy}%</span>
                        </div>
                    </div>

                    {/* Image Card */}
                    <div className={`relative h-48 w-48 flex items-center justify-center bg-slate-800 rounded-2xl shadow-xl border-2 transition-colors duration-300 ${status === 'correct' ? 'border-green-500' : status === 'wrong' ? 'border-red-500' : 'border-white/5'}`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={imageIdx}
                                initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                                transition={{ duration: 0.3 }}
                                className="text-8xl cursor-default select-none"
                            >
                                {status === 'idle' ? images[imageIdx] : (status === 'correct' ? '✅' : '❌')}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <p className="text-white font-mono text-sm">Input: Is this a dog?</p>

                    <div className="flex gap-4 w-full">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleChoice(true)} className="flex-1 bg-green-600/20 border border-green-500/50 hover:bg-green-600 hover:text-white text-green-400 py-3 rounded-xl font-bold transition-all">
                            YES
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleChoice(false)} className="flex-1 bg-red-600/20 border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 py-3 rounded-xl font-bold transition-all">
                            NO
                        </motion.button>
                    </div>
                </div>
            )}
        </SimulationStage>
    );
};

const SimMining = () => {
    const [hashes, setHashes] = React.useState<{ val: string, time: string }[]>([]);
    const [isMining, setIsMining] = React.useState(false);

    const mine = () => {
        setIsMining(true);
        setTimeout(() => {
            const newHash = Array(16).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
            setHashes(prev => [{ val: `0x${newHash}...`, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 6));
            setIsMining(false);
        }, 800);
    }
    return (
        <SimulationStage title="Node Miner Interface" color="border-orange-500/30">
            <div className="w-full h-full flex flex-col p-2">
                <div className="flex justify-between items-center mb-4 p-2 bg-slate-900/50 rounded-lg">
                    <div className="flex gap-2 items-center">
                        <div className={`w-3 h-3 rounded-full ${isMining ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`}></div>
                        <span className="text-xs text-green-400 font-mono">{isMining ? 'HASHING...' : 'NODE_IDLE'}</span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={mine}
                        disabled={isMining}
                        className="px-4 py-2 bg-orange-500 text-black font-bold rounded-lg flex items-center gap-2 shadow-lg hover:bg-orange-400 text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                        <Cpu size={14} /> Execute Hash
                    </motion.button>
                </div>
                <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-xs overflow-hidden border border-white/5 relative">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                    <div className="space-y-2">
                        <AnimatePresence>
                            {hashes.map((h, i) => (
                                <motion.div key={h.val + i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-green-400/80 flex gap-4 border-b border-white/5 pb-1">
                                    <span className="text-slate-600">[{h.time}]</span>
                                    <span>BLOCK_FOUND: {h.val}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {hashes.length === 0 && <div className="text-slate-600 animate-pulse text-center mt-10">Waiting for command...</div>}
                    </div>
                </div>
            </div>
        </SimulationStage>
    )
}

const SimPhishing = () => {
    const [result, setResult] = React.useState<string>("");

    return (
        <SimulationStage title="Phishing Simulation Lab" color="border-red-500/30">
            <div className="flex flex-col items-center justify-center h-full w-full py-4">

                {/* Device Frame */}
                <div className="relative w-[300px] h-[580px] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col ring-2 ring-white/10 select-none">

                    {/* Hardware Buttons */}
                    <div className="absolute top-24 -left-3 w-1.5 h-10 bg-slate-700 rounded-l-md border border-slate-900" /> {/* Volume Up */}
                    <div className="absolute top-36 -left-3 w-1.5 h-10 bg-slate-700 rounded-l-md border border-slate-900" /> {/* Volume Down */}
                    <div className="absolute top-28 -right-3 w-1.5 h-16 bg-slate-700 rounded-r-md border border-slate-900" /> {/* Power */}

                    {/* Notch Area */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-30 flex justify-center pt-1.5">
                        <div className="w-16 h-1 bg-black/40 rounded-full"></div> {/* Speaker Grill */}
                    </div>

                    {/* Status Bar */}
                    <div className="h-8 bg-white flex justify-between items-center px-6 text-[11px] text-black font-bold z-20 pt-2">
                        <span>9:41</span>
                        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-black"></div><div className="w-2.5 h-2.5 rounded-full bg-black"></div></div>
                    </div>

                    {/* Email App Header */}
                    <div className="bg-slate-50 border-b border-gray-200 p-3 flex items-center gap-3 pt-2 relative z-10 shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white text-sm cursor-pointer transition-colors">‹</div>
                        <span className="font-bold text-gray-800 text-base">Inbox (1)</span>
                    </div>

                    {/* Email Content */}
                    <div className="flex-1 bg-white p-5 overflow-y-auto pb-40 no-scrollbar">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-base text-gray-900 leading-tight">Security Alert: Unusual Login</h3>
                                <div className="text-xs text-gray-500 font-medium mt-1 truncate">from: support@secure-bank-verify.co.nz</div>
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold ml-2 mt-1">9:41 AM</div>
                        </div>

                        <div className="bg-orange-50 border border-orange-200/60 p-3 rounded-xl text-xs text-orange-800 mb-5 flex gap-2 items-start leading-snug">
                            <span className="text-base">⚠️</span> <span><strong>External Warning:</strong> This email is from outside your organization. Do not click links unless you are sure.</span>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed mb-6 font-medium">
                            Dear Customer,<br /><br />
                            We have detected multiple invalid login attempts on your account from an unrecognized device (iPhone 15, location: Unknown).<br /><br />
                            For your security, your account will be locked in 24 hours unless you verify your identity.
                        </p>

                        <button className="w-full bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all mb-6">
                            Verify Identity Now
                        </button>

                        <div className="border-t border-gray-100 pt-6 mt-2">
                            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                                Bank Secure Ltd &copy; 2024
                            </p>
                            <p className="text-[9px] text-gray-300 text-center mt-2">
                                Unsubscribe  |  Privacy Policy
                            </p>
                        </div>
                    </div>

                    {/* Actions Overlay (Simulation Controls) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md p-4 border-t border-white/10 z-40 pb-6 rounded-b-[2rem]">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-center text-sm font-bold py-3 rounded-xl border ${result.includes("Correct") ? "bg-green-500/10 border-green-500 text-green-400" : "bg-red-500/10 border-red-500 text-red-500"}`}>
                                    {result}
                                    <button onClick={() => setResult("")} className="block w-full mt-2 text-xs text-slate-500 underline hover:text-white transition-colors">Try Again</button>
                                </motion.div>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setResult("Correct! Urgent threats + weird URL = Phishing.")} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 group">
                                        <AlertTriangle size={18} className="group-hover:scale-110 transition-transform" /> Report Phishing
                                    </button>
                                    <button onClick={() => setResult("Incorrect. Checks: Sender domain & urgency.")} className="flex-1 bg-slate-700/50 hover:bg-slate-700 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 group">
                                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" /> Trust Email
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Home Bar */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-white/20 rounded-full z-50 pointer-events-none"></div>
                </div>
            </div>
        </SimulationStage>
    )
}

const SimStock = () => {
    const [price, setPrice] = React.useState(100);
    const [history, setHistory] = React.useState<number[]>(Array(20).fill(100));
    const [trades, setTrades] = React.useState<{ type: 'buy' | 'sell', price: number }[]>([]);

    React.useEffect(() => {
        const i = setInterval(() => {
            setPrice(p => {
                const change = (Math.random() - 0.5) * 5;
                const newPrice = Math.max(10, p + change);
                setHistory(prev => [...prev.slice(1), newPrice]);
                return newPrice;
            });
        }, 800);
        return () => clearInterval(i);
    }, []);

    // Create simple SVG path from history
    const max = Math.max(...history, 110);
    const min = Math.min(...history, 90);
    const points = history.map((val, i) => {
        const x = (i / (history.length - 1)) * 100;
        const y = 100 - ((val - min) / (max - min)) * 100;
        return `${x},${y}`;
    }).join(' ');

    const handleTrade = (type: 'buy' | 'sell') => {
        setTrades(prev => [{ type, price }, ...prev].slice(0, 3));
    }

    return (
        <SimulationStage title="Market Terminal" color="border-green-500/30">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <div className="text-slate-400 text-xs font-mono mb-1">GNS / USD</div>
                    <div className="text-5xl font-mono font-bold text-white tracking-tighter transition-colors duration-300">${price.toFixed(2)}</div>
                    <div className={`text-sm font-bold mt-2 ${price > 100 ? 'text-green-400' : 'text-red-400'} flex items-center justify-center gap-1`}>
                        {price > 100 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
                        {(price - 100).toFixed(2)}% (24h)
                    </div>
                </div>

                {/* SVG Chart */}
                <div className="h-24 w-full bg-slate-900/50 rounded-lg border border-white/5 mb-6 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                            fill="none"
                            stroke={price > 100 ? "#4ade80" : "#f87171"}
                            strokeWidth="2"
                            points={points}
                            vectorEffect="non-scaling-stroke"
                        />
                        <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={price > 100 ? "#4ade80" : "#f87171"} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={price > 100 ? "#4ade80" : "#f87171"} stopOpacity="0" />
                        </linearGradient>
                        <polygon
                            fill="url(#fillGradient)"
                            points={`0,100 ${points} 100,100`}
                        />
                    </svg>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button onClick={() => handleTrade('buy')} className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors uppercase text-xs tracking-wider">Buy Order</button>
                    <button onClick={() => handleTrade('sell')} className="py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500 transition-colors uppercase text-xs tracking-wider">Sell Order</button>
                </div>

                {/* Trade Log */}
                <div className="text-[10px] space-y-1 font-mono">
                    {trades.map((t, i) => (
                        <div key={i} className="flex justify-between text-slate-500 border-b border-white/5 pb-1">
                            <span className={t.type === 'buy' ? 'text-green-400' : 'text-red-400'}>{t.type.toUpperCase()}</span>
                            <span>@{t.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </SimulationStage>
    )
}

const SimBudget = () => {
    const [needs, setNeeds] = useState(50);
    const [wants, setWants] = useState(30);
    const [savings, setSavings] = useState(20);

    return (
        <SimulationStage title="Budget Allocator" color="border-green-500/30">
            <div className="w-full max-w-md p-2">
                <div className="flex justify-between mb-8 gap-2">
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 flex-1">
                        <div className="text-[10px] text-blue-300 uppercase font-bold">Needs</div>
                        <div className="text-2xl font-bold text-white">{needs}%</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 flex-1">
                        <div className="text-[10px] text-purple-300 uppercase font-bold">Wants</div>
                        <div className="text-2xl font-bold text-white">{wants}%</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30 flex-1">
                        <div className="text-[10px] text-green-300 uppercase font-bold">Savings</div>
                        <div className="text-2xl font-bold text-white">{savings}%</div>
                    </div>
                </div>

                <div className="space-y-6 px-2">
                    <div>
                        <input type="range" min="0" max="100" value={needs} onChange={(e) => setNeeds(parseInt(e.target.value))} className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <input type="range" min="0" max="100" value={wants} onChange={(e) => setWants(parseInt(e.target.value))} className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <input type="range" min="0" max="100" value={savings} onChange={(e) => setSavings(parseInt(e.target.value))} className="w-full accent-green-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div className="p-3 bg-black/40 rounded-lg text-center border border-white/5">
                        <div className="text-slate-400 text-xs mb-1">ALLOCATION TOTAL</div>
                        <div className={`text-xl font-mono font-bold ${needs + wants + savings === 100 ? 'text-green-400' : 'text-red-400'}`}>
                            {needs + wants + savings}%
                        </div>
                    </div>
                </div>
            </div>
        </SimulationStage>
    );
}

const SimCommunication = () => {
    const [chat, setChat] = useState<{ sender: string, text: string }[]>([
        { sender: 'Boss', text: 'Where is the report? It was due yesterday.' }
    ]);
    const [options] = useState([
        { text: "I forgot. I'll do it now.", score: 0, feedback: "Too casual." },
        { text: "Apologies for the delay. I am finalizing it now.", score: 1, feedback: "Professional and actionable." },
        { text: "You didn't remind me.", score: -1, feedback: "Defensive and unprofessional." }
    ]);

    const handleReply = (opt: any) => {
        setChat([...chat, { sender: 'You', text: opt.text }]);
        setTimeout(() => {
            setChat(prev => [...prev, { sender: 'System', text: `Feedback: ${opt.feedback}` }]);
        }, 500);
    }

    return (
        <SimulationStage title="Workplace Messenger" color="border-purple-500/30">
            <div className="w-full h-full flex flex-col bg-slate-900/50">
                <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                    {chat.map((c, i) => (
                        <div key={i} className={`flex ${c.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-xs md:text-sm ${c.sender === 'You' ? 'bg-blue-600 text-white rounded-tr-none' :
                                c.sender === 'System' ? 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/50 w-full text-center' :
                                    'bg-slate-700 text-white rounded-tl-none'
                                }`}>
                                <div className="text-[9px] opacity-60 mb-1 uppercase font-bold">{c.sender}</div>
                                {c.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-slate-950 border-t border-white/5 space-y-2">
                    {chat.length < 3 ? options.map((opt, i) => (
                        <button key={i} onClick={() => handleReply(opt)} className="w-full p-3 text-left text-xs bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-white/5 transition-colors">
                            {opt.text}
                        </button>
                    )) : (
                        <div className="text-center text-xs text-slate-500 py-2">
                            <RefreshCw size={12} className="inline mr-1" /> Simulation Ended
                        </div>
                    )}
                </div>
            </div>
        </SimulationStage>
    )
}

const SimIoT = () => {
    const [devices, setDevices] = useState({ light: false, lock: true, temp: 72 });
    return (
        <SimulationStage title="Smart Home Hub" color="border-cyan-500/30">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm p-2">
                <button onClick={() => setDevices(d => ({ ...d, light: !d.light }))} className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${devices.light ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'bg-slate-900 border-white/10 text-slate-600'}`}>
                    <Lightbulb size={32} className={devices.light ? "fill-yellow-400" : ""} />
                    <span className="text-xs font-bold">LIGHTS</span>
                </button>
                <button onClick={() => setDevices(d => ({ ...d, lock: !d.lock }))} className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${devices.lock ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                    <Lock size={32} />
                    <span className="text-xs font-bold">{devices.lock ? 'SECURE' : 'UNLOCKED'}</span>
                </button>
                <div className="col-span-2 p-4 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase"><Thermometer size={16} className="text-blue-400" /> AC Unit</div>
                    <div className="flex items-center gap-4 bg-black/40 p-1 rounded-lg">
                        <button onClick={() => setDevices(d => ({ ...d, temp: d.temp - 1 }))} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded transition-colors text-white font-bold">-</button>
                        <span className="text-xl font-mono font-bold text-white w-10 text-center">{devices.temp}°</span>
                        <button onClick={() => setDevices(d => ({ ...d, temp: d.temp + 1 }))} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded transition-colors text-white font-bold">+</button>
                    </div>
                </div>
            </div>
        </SimulationStage>
    )
}

const SimTimeMatrix = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: "Email Boss", q: 0 },
        { id: 2, text: "Scroll Reels", q: 0 },
        { id: 3, text: "Plan Project", q: 0 },
        { id: 4, text: "File Taxes", q: 0 }
    ]);
    const move = (id: number, q: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, q } : t));
    }
    const quadrantTitles = ["Urgent & Important", "Not Urgent & Important", "Urgent & Not Important", "Not Urgent & Not Important"];

    return (
        <SimulationStage title="Eisenhower Matrix Board" color="border-indigo-500/30">
            <div className="w-full max-w-lg h-full flex flex-col p-2">
                <div className="grid grid-cols-2 gap-2 flex-1 mb-2">
                    {[1, 2, 3, 4].map((q, i) => (
                        <div key={q} className={`border rounded-lg p-2 relative flex flex-col ${q === 1 ? 'border-red-500/30 bg-red-500/5' :
                            q === 2 ? 'border-blue-500/30 bg-blue-500/5' :
                                q === 3 ? 'border-orange-500/30 bg-orange-500/5' :
                                    'border-slate-500/30 bg-slate-500/5'
                            }`}>
                            <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-2 font-bold opacity-70">{quadrantTitles[i]}</div>
                            <div className="flex-1 space-y-1 overflow-y-auto">
                                {tasks.filter(t => t.q === q).map(t => (
                                    <motion.div layoutId={`t-${t.id}`} key={t.id} className="text-[10px] bg-slate-800 p-1.5 rounded cursor-pointer hover:bg-slate-700 shadow-sm border border-white/5 text-slate-200" onClick={() => move(t.id, (q % 4) + 1)}>
                                        {t.text}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-slate-900 rounded-lg border border-white/10 p-2 min-h-[50px] flex items-center gap-2 overflow-x-auto">
                    <span className="text-[10px] text-slate-500 uppercase font-bold shrink-0">Inbox:</span>
                    {tasks.filter(t => t.q === 0).length === 0 && <span className="text-[10px] text-slate-600 italic">All sorted!</span>}
                    {tasks.filter(t => t.q === 0).map(t => (
                        <motion.button layoutId={`t-${t.id}`} key={t.id} onClick={() => move(t.id, 1)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-full text-[10px] whitespace-nowrap text-white font-bold shadow-lg">
                            {t.text}
                        </motion.button>
                    ))}
                </div>
            </div>
        </SimulationStage>
    )
}

// --- DATA MAPPING ---

const SIMULATION_MAP: Record<string, () => ModuleData> = {
    'sim_ai_neural': () => ({
        id: 'sim_ai_neural',
        title: 'Neural Networks Lab',
        category: 'Tech',
        color: 'bg-blue-500',
        accentColor: 'text-blue-400',
        chapters: [
            {
                id: 'c1',
                title: 'Neural Connections',
                type: 'intro',
                description: 'Welcome to the lab. Here we visualize the invisible. The particle network on the right represents nodes in a neural network. Move your mouse to interact with the connections.',
                visualContent: <div className="w-full h-full bg-slate-950 relative"><ParticleNetwork /></div>
            },
            {
                id: 'c2',
                title: 'Training a Model',
                type: 'interactive',
                description: 'Machine Learning requires human feedback. In this simulation, you act as the "Supervisor". By correctly identifying the images, you adjust the weights of the neural network, increasing its accuracy score.',
                visualContent: <IconVisual icon={Database} color="text-green-400" />,
                interactiveContent: <SimAiTrain />
            },
            {
                id: 'c3',
                title: 'Knowledge Check',
                type: 'quiz',
                description: 'Let\'s verify your understanding of Neural Network fundamentals.',
                visualContent: <IconVisual icon={CheckCircle} color="text-yellow-400" />,
                quizData: {
                    question: "What mechanism allows neural networks to 'learn'?",
                    options: ["Magic Spells", "Data & Feedback Loops", "More Electricity", "Hardcoded If-Statements"],
                    correctIndex: 1
                }
            }
        ]
    }),
    'sim_blockchain_hash': () => ({
        id: 'sim_blockchain_hash',
        title: 'Blockchain Lab',
        category: 'Tech',
        color: 'bg-orange-500',
        accentColor: 'text-orange-400',
        chapters: [
            { id: 'b1', title: 'The Distributed Ledger', type: 'concept', description: 'Imagine a spreadsheet that everyone has a copy of, but no one can delete lines from. That is a blockchain. It provides a trustless system for recording value.', visualContent: <IconVisual icon={Link} color="text-orange-400" /> },
            { id: 'b2', title: 'Mining Operations', type: 'interactive', description: 'Mining involves solving complex mathematical puzzles to validate transactions. Use the terminal to simulate a mining node finding a block hash.', visualContent: <IconVisual icon={Cpu} color="text-red-400" />, interactiveContent: <SimMining /> },
            { id: 'b3', title: 'Security Protocol', type: 'quiz', description: 'Final check on blockchain security.', visualContent: <IconVisual icon={Shield} color="text-yellow-400" />, quizData: { question: "What makes the blockchain immutable?", options: ["Central Authority", "Cryptographic Hashing", "The Internet", "User Passwords"], correctIndex: 1 } }
        ]
    }),
    'sim_cyber_phishing': () => ({
        id: 'sim_cyber_phishing',
        title: 'Cybersecurity Lab',
        category: 'Tech',
        color: 'bg-red-500',
        accentColor: 'text-red-400',
        chapters: [
            { id: 'p1', title: 'Threat Analysis', type: 'concept', description: 'Phishing is the most common entry point for cyber attacks. Hackers use social engineering to trick you into revealing credentials.', visualContent: <IconVisual icon={AlertTriangle} color="text-red-400" /> },
            { id: 'p2', title: 'Inbox Inspector', type: 'interactive', description: 'Analyze the email in the secure viewer. Look for red flags: generic greetings, urgent threats, and mismatched URLs.', visualContent: <IconVisual icon={Mail} color="text-slate-400" />, interactiveContent: <SimPhishing /> },
            { id: 'p3', title: 'Defense Strategy', type: 'quiz', description: 'Final verification.', visualContent: <IconVisual icon={Shield} color="text-green-400" />, quizData: { question: "What is the first thing to check in a suspicious email?", options: ["The Font", "Sender Address & Links", "Color Scheme", "Time Sent"], correctIndex: 1 } }
        ]
    }),
    'sim_market_trade': () => ({
        id: 'sim_market_trade',
        title: 'Trading Floor Sim',
        category: 'Finance',
        color: 'bg-green-500',
        accentColor: 'text-green-400',
        chapters: [
            { id: 'm1', title: 'Market Dynamics', type: 'concept', description: 'Markets are driven by supply and demand. When demand exceeds supply, prices rise. Fear and greed are the primary psychological drivers.', visualContent: <IconVisual icon={TrendingUp} color="text-green-400" /> },
            { id: 'm2', title: 'Live Terminal', type: 'interactive', description: 'Observe the real-time price fluctuation of GNS stock. In a real scenario, you would execute Buy or Sell orders based on technical indicators.', visualContent: <IconVisual icon={DollarSign} color="text-yellow-400" />, interactiveContent: <SimStock /> },
        ]
    }),
    'sim_finance_budget': () => ({
        id: 'sim_finance_budget',
        title: 'Budgeting Lab',
        category: 'Finance',
        color: 'bg-green-600',
        accentColor: 'text-green-400',
        chapters: [
            { id: 'f1', title: 'The 50/30/20 Rule', type: 'concept', description: 'Financial freedom starts with a plan. Divide your income: 50% for Needs, 30% for Wants, and 20% for Savings/Debt.', visualContent: <IconVisual icon={PieChart} color="text-blue-400" /> },
            { id: 'f2', title: 'Allocation Tool', type: 'interactive', description: 'Use the sliders to balance the budget. Try to achieve the perfect 50/30/20 ratio.', visualContent: <IconVisual icon={DollarSign} color="text-green-400" />, interactiveContent: <SimBudget /> }
        ]
    }),
    'sim_soft_comm': () => ({
        id: 'sim_soft_comm',
        title: 'Communication Lab',
        category: 'Skills',
        color: 'bg-purple-500',
        accentColor: 'text-purple-400',
        chapters: [
            { id: 's1', title: 'Tone & Intent', type: 'concept', description: 'In a professional setting, clarity and tone are paramount. Avoid defensive language and focus on solutions.', visualContent: <IconVisual icon={MessageSquare} color="text-purple-400" /> },
            { id: 's2', title: 'Response Simulator', type: 'interactive', description: 'Choose the most professional response to a difficult message from a superior.', visualContent: <IconVisual icon={User} color="text-slate-400" />, interactiveContent: <SimCommunication /> }
        ]
    }),
    'sim_iot_smart': () => ({
        id: 'sim_iot_smart',
        title: 'Smart Home Lab',
        category: 'Tech',
        color: 'bg-cyan-500',
        accentColor: 'text-cyan-400',
        chapters: [
            { id: 'i1', title: 'The Connected World', type: 'concept', description: 'IoT allows physical objects to send and receive data. This creates ecosystems where devices react to your presence and preferences.', visualContent: <IconVisual icon={Globe} color="text-cyan-400" /> },
            { id: 'i2', title: 'Hub Control', type: 'interactive', description: 'Interact with the smart home hub. Toggle lights, locks, and climate control to see instant feedback.', visualContent: <IconVisual icon={Smartphone} color="text-slate-400" />, interactiveContent: <SimIoT /> }
        ]
    }),
    'sim_time_matrix': () => ({
        id: 'sim_time_matrix',
        title: 'Productivity Lab',
        category: 'Skills',
        color: 'bg-indigo-500',
        accentColor: 'text-indigo-400',
        chapters: [
            { id: 't1', title: 'Eisenhower Matrix', type: 'concept', description: 'Not all busy work is productive. Distinguish between Urgent and Important to prioritize effectively.', visualContent: <IconVisual icon={Calendar} color="text-indigo-400" /> },
            { id: 't2', title: 'Priority Sorter', type: 'interactive', description: 'Drag or click tasks to move them into the correct quadrant. Aim for "Important but Not Urgent" for long-term success.', visualContent: <IconVisual icon={Clock} color="text-white" />, interactiveContent: <SimTimeMatrix /> }
        ]
    }),
    // Fallback
    'default': () => ({
        id: 'default',
        title: 'General Lab',
        category: 'Tech',
        color: 'bg-slate-500',
        accentColor: 'text-slate-400',
        chapters: [
            { id: 'd1', title: 'Particle Network', type: 'intro', description: 'Explore the connectivity of the Geniusphere network.', visualContent: <div className="w-full h-full bg-slate-950 relative"><ParticleNetwork /></div> }
        ]
    })
};

const getModule = (id: string) => {
    return SIMULATION_MAP[id] ? SIMULATION_MAP[id]() : SIMULATION_MAP['default']();
};


export const InteractiveLearning: React.FC<InteractiveLearningProps> = ({ simulationId, onClose, onNavigate }) => {
    const [moduleData, setModuleData] = React.useState<ModuleData | null>(null);
    const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
    const [quizAnswer, setQuizAnswer] = React.useState<number | null>(null);

    // Check if this ID exists in the new Lab Ecosystem
    const isNewSystemLab = !!(LAB_CONFIGS[simulationId] || TEACHING_LAB_CONFIGS[simulationId] || STUDENT_LAB_CONFIGS[simulationId]);

    const [isReady, setIsReady] = useState(false);

    // Handle Mobile Back Button interaction
    React.useEffect(() => {
        // Push state to enable back button closing
        if (window.history.state?.labOpen !== true) {
            window.history.pushState({ labOpen: true }, '', window.location.href);
        }

        const handlePopState = (event: PopStateEvent) => {
            // When user hits back, close lab
            onClose();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Unified Loading & Initialization
    React.useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Show loading screen for ALL labs (overrides + universal)
    if (!isReady) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#070B1A] flex items-center justify-center">
                {/* Emergency Exit Button (Available during loading) */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    style={{ zIndex: 10000, pointerEvents: 'auto' }}
                    className="block fixed top-4 right-4 bg-slate-800/50 hover:bg-red-600/50 text-white/50 hover:text-white p-2 rounded-full transition-all border border-white/5 shadow-2xl active:scale-90"
                    title="Cancel Loading"
                    aria-label="Cancel Loading"
                >
                    <X size={20} />
                </button>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity size={32} className="text-cyan-500 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="text-cyan-500 font-black text-xs tracking-[0.5em] uppercase animate-pulse">Initializing_Session</div>
                        <div className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Encryption_Active // v4.3</div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- OVERRIDES FOR SPECIAL HIGH-FIDELITY LABS ---
    // AI Lab Override
    if (simulationId === 'sim_ai_neural') {
        return (
            <LabWrapper onClose={onClose} bg="bg-slate-950">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <AiLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Banking Lab for Finance simulations
    if (simulationId === 'sim_finance_budget') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <BankingLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Communication Lab for Soft Skills
    if (simulationId === 'sim_soft_comm') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#0A0E1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <CommunicationLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Professional Skills Lab
    if (simulationId === 'sim_prof_skills') {
        return (
            <LabWrapper onClose={onClose} bg="bg-gradient-to-br from-[#0B1220] to-[#111827]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <ProfessionalSkillsLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Social Profile Development Lab
    if (simulationId === 'sim_social_profile') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#0B1220]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <SocialProfileLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Fintech Discovery Lab
    if (simulationId === 'sim_fintech') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <FintechLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Stock Market Basics Lab
    if (simulationId === 'sim_stock_market') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <StockMarketLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Global Economics Simulation Lab
    if (simulationId === 'sim_global_economy') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <GlobalEconomyLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Cryptocurrency Deep Dive Lab
    if (simulationId === 'sim_crypto') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#050816]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <CryptoLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Introduction to Finance Lab
    if (simulationId === 'sim_intro_finance') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <IntroFinanceLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Digital Privacy & Footprint Lab
    if (simulationId === 'sim_digital_privacy') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <DigitalPrivacyLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom IoT Cybersecurity Lab
    if (simulationId === 'sim_iot_smart') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <IoTLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // Blockchain Lab Override (TrustLink)
    if (simulationId === 'sim_blockchain_hash') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <BlockchainLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    // SPECIAL OVERRIDE: Use the custom Microsoft Office Real-World Skills Lab
    if (simulationId === 'sim_office') {
        return (
            <LabWrapper onClose={onClose} bg="bg-[#070B1A]">
                <div className="h-full w-full min-w-[320px] md:min-w-0">
                    <MicrosoftOfficeLabApp onClose={onClose} />
                </div>
            </LabWrapper>
        );
    }

    React.useEffect(() => {
        if (!isNewSystemLab) {
            setModuleData(getModule(simulationId));
            setCurrentChapterIndex(0);
            setQuizAnswer(null);
        }
    }, [simulationId, isNewSystemLab]);

    if (isNewSystemLab) {
        return <UniversalLab simulationId={simulationId} onClose={onClose} />;
    }

    if (!moduleData) {
        return null;
    }

    const currentChapter = moduleData.chapters[currentChapterIndex];
    const isCompleted = currentChapterIndex >= moduleData.chapters.length;

    const handleNext = () => {
        if (currentChapterIndex < moduleData.chapters.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
            setQuizAnswer(null);
        } else {
            setCurrentChapterIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
            setQuizAnswer(null);
        }
    };

    const handleQuizSelect = (index: number) => {
        setQuizAnswer(index);
    }

    const isQuizCorrect = currentChapter?.quizData && quizAnswer === currentChapter.quizData.correctIndex;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] pt-4 md:pt-24 bg-slate-950/95 backdrop-blur-3xl flex flex-col"
        >
            {/* Top Bar with Progress */}
            <div className="px-6 pb-6 border-b border-white/5 bg-black/20 shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight">{moduleData.title}</h2>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{moduleData.category} Simulation Lab</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">SESSION_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                </div>

                {/* Progress Segments */}
                <div className="flex gap-1 h-1.5 w-full max-w-xl mx-auto">
                    {moduleData.chapters.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-500 ${i < currentChapterIndex ? moduleData.color :
                                i === currentChapterIndex ? 'bg-white' : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {isCompleted ? (
                        <CertificateView key="certificate" courseName={moduleData.title} onClose={onClose} />
                    ) : currentChapter ? (
                        <motion.div
                            key={currentChapter.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 p-4 lg:p-8 max-w-7xl mx-auto"
                        >
                            {/* LEFT PANEL: Instruction & Context */}
                            <div className="flex flex-col justify-center order-2 lg:order-1 h-full overflow-y-auto custom-scrollbar p-4 lg:pr-8">
                                <div className="mb-6">
                                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 ${moduleData.accentColor}`}>
                                        {currentChapter.type} Phase
                                    </span>
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">{currentChapter.title}</h3>
                                <p className="text-slate-300 text-lg leading-relaxed mb-8">{currentChapter.description}</p>

                                {/* Quiz Section if applicable */}
                                {currentChapter.type === 'quiz' && currentChapter.quizData && (
                                    <div className="space-y-3 w-full">
                                        <p className="font-bold text-white mb-2 font-mono text-sm uppercase text-slate-400">Question Protocol:</p>
                                        <p className="text-xl text-white mb-6 font-semibold">{currentChapter.quizData.question}</p>
                                        {currentChapter.quizData.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleQuizSelect(i)}
                                                className={`w-full p-4 rounded-xl border text-left transition-all font-semibold flex items-center justify-between group ${quizAnswer === i
                                                    ? (i === currentChapter.quizData!.correctIndex
                                                        ? 'border-green-500 bg-green-500/10 text-green-400'
                                                        : 'border-red-500 bg-red-500/10 text-red-400')
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <span>{opt}</span>
                                                {quizAnswer === i && (
                                                    i === currentChapter.quizData!.correctIndex ? <CheckCircle size={20} /> : <AlertTriangle size={20} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Navigation Footer (Universal) */}
                                <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/5 pb-20 lg:pb-0">
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentChapterIndex === 0}
                                        className="px-6 py-3 rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all font-bold text-sm"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={currentChapter.type === 'quiz' && !isQuizCorrect}
                                        className={`flex-1 py-3 rounded-full font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${currentChapter.type === 'quiz' && !isQuizCorrect
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/25'
                                            }`}
                                    >
                                        {currentChapterIndex === moduleData.chapters.length - 1 ? 'Complete Lab' : 'Next Step'} <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT PANEL: The Stage / Visuals */}
                            <div className="order-1 lg:order-2 flex flex-col h-[600px] lg:h-full relative min-h-[600px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl -z-10 blur-2xl" />

                                {/* The Actual Stage Container */}
                                <div className="flex-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
                                    {/* Only render interactive content if present, else render visual content */}
                                    {currentChapter.type === 'interactive' && currentChapter.interactiveContent ? (
                                        <div className="w-full h-full flex items-center justify-center p-4">
                                            {currentChapter.interactiveContent}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center relative p-8">
                                            {/* Background Grid Effect */}
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10" />
                                            {currentChapter.visualContent}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
            <div className="fixed top-4 right-4 z-[999999] pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="p-3 bg-slate-800 hover:bg-red-600 text-white rounded-full transition-all border border-white/10 shadow-2xl active:scale-90"
                    title="Exit Lab"
                    aria-label="Exit Lab"
                >
                    <X size={24} />
                </button>
            </div>
        </motion.div>
    );
};
