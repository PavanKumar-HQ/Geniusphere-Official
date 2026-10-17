
import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    HelpCircle,
    Settings,
    Play,
    Pause,
    RotateCcw,
    PieChart,
    CheckCircle2,
    Lock,
    Eye,
    Camera,
    Trash2,
    AlertTriangle,
    // Fix missing imports
    BookOpen,
    Globe,
    User,
    Info
} from 'lucide-react';
import { COLORS, PROFILE_ELEMENTS, SKILL_OPTIONS, MYTHS_VS_REALITY } from './constants';
import { PlatformPurpose, ProfileData, StepStatus } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';

const motion = motionBase as any;

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [simplifiedMode, setSimplifiedMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const [profile, setProfile] = useState<ProfileData>({
        purpose: PlatformPurpose.NONE,
        photo: null,
        bio: '',
        skills: [],
        posts: [],
        interactions: [],
        privacyPrivate: false,
        score: {
            professionalism: 10,
            safety: 10,
            authenticity: 10,
            growthPotential: 10
        }
    });

    const updateScore = (updates: Partial<ProfileData['score']>) => {
        setProfile(prev => ({
            ...prev,
            score: {
                professionalism: Math.min(100, Math.max(0, prev.score.professionalism + (updates.professionalism || 0))),
                safety: Math.min(100, Math.max(0, prev.score.safety + (updates.safety || 0))),
                authenticity: Math.min(100, Math.max(0, prev.score.authenticity + (updates.authenticity || 0))),
                growthPotential: Math.min(100, Math.max(0, prev.score.growthPotential + (updates.growthPotential || 0))),
            }
        }));
    };

    const handleReset = () => {
        setActiveStep(1);
        setProfile({
            purpose: PlatformPurpose.NONE,
            photo: null,
            bio: '',
            skills: [],
            posts: [],
            interactions: [],
            privacyPrivate: false,
            score: {
                professionalism: 10,
                safety: 10,
                authenticity: 10,
                growthPotential: 10
            }
        });
        setFeedback(null);
    };

    const chartData = [
        { name: 'Prof.', value: profile.score.professionalism, color: COLORS.professional },
        { name: 'Safety', value: profile.score.safety, color: COLORS.risky },
        { name: 'Auth.', value: profile.score.authenticity, color: COLORS.creativity },
        { name: 'Growth', value: profile.score.growthPotential, color: COLORS.skills },
    ];

    return (
        <>
            {/* Mobile/Tablet View */}
            <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
                <MobileLayout
                    title="Social Profile Development"
                    description="Building a Responsible Digital Identity"
                    badges={[
                        <MobileBadge variant="blue" key="b1">STEP {activeStep}/10</MobileBadge>,
                        !isPaused ? <MobileBadge variant="green" key="b2">ACTIVE</MobileBadge> : null
                    ]}
                    visualContent={
                        <div className="p-4 space-y-4 pb-20">
                            {/* Score Display (Compact) */}
                            <div className="grid grid-cols-4 gap-2">
                                {chartData.map((item) => (
                                    <div key={item.name} className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 text-center">
                                        <div className="text-[10px] text-slate-400 uppercase truncate">{item.name}</div>
                                        <div className="text-sm font-bold" style={{ color: item.color }}>
                                            {item.value}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Current Step Interactive Content */}
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <h3 className="text-sm font-bold mb-3 text-blue-400">Step {activeStep}: {
                                    activeStep === 1 ? "Purpose" :
                                        activeStep === 2 ? "Photo" :
                                            activeStep === 3 ? "Bio" :
                                                activeStep === 4 ? "Skills" :
                                                    activeStep === 5 ? "Posts" :
                                                        activeStep === 6 ? "Interactions" :
                                                            activeStep === 7 ? "Privacy" :
                                                                activeStep === 8 ? "History" : "Review"
                                }</h3>

                                {activeStep === 1 && (
                                    <div className="space-y-3">
                                        <button onClick={() => { setProfile({ ...profile, purpose: PlatformPurpose.LEARNING }); updateScore({ growthPotential: 20, professionalism: 10 }); setFeedback("Great! Purpose keeps you focused."); setActiveStep(2); }} className="w-full text-left p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20">
                                            <div className="font-bold text-white mb-1">Purpose-based Profile</div>
                                            <div className="text-xs text-white/60">Focus on learning and opportunities.</div>
                                        </button>
                                        <button onClick={() => { setProfile({ ...profile, purpose: PlatformPurpose.NONE }); updateScore({ growthPotential: -5 }); setFeedback("Without a goal, it's risky."); setActiveStep(2); }} className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
                                            <div className="font-bold text-white mb-1">Random Posting</div>
                                            <div className="text-xs text-white/60">Just for fun, no strategy.</div>
                                        </button>
                                    </div>
                                )}

                                {activeStep === 2 && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => { setProfile({ ...profile, photo: 'prof' }); updateScore({ professionalism: 25, authenticity: 10 }); setFeedback("Clear and respectful!"); setActiveStep(3); }} className="flex flex-col items-center p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-2"><User size={30} /></div>
                                            <span className="text-xs font-bold text-green-400">Professional</span>
                                        </button>
                                        <button onClick={() => { setProfile({ ...profile, photo: 'bad' }); updateScore({ professionalism: -15, safety: -10 }); setFeedback("Risky choice."); setActiveStep(3); }} className="flex flex-col items-center p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-2"><ShieldAlert size={30} className="text-red-400" /></div>
                                            <span className="text-xs font-bold text-red-400">Unclear/Risky</span>
                                        </button>
                                    </div>
                                )}

                                {activeStep === 3 && (
                                    <div className="space-y-3">
                                        <button onClick={() => { setProfile({ ...profile, bio: 'Student at Oakwood High...' }); updateScore({ authenticity: 20, growthPotential: 15 }); setFeedback("Honesty builds trust."); setActiveStep(4); }} className="w-full text-left p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                            <div className="font-bold text-sm mb-1">Honest & Positive</div>
                                            <div className="text-xs italic text-white/60">"Student at Oakwood High, passionate about coding..."</div>
                                        </button>
                                        <button onClick={() => { setProfile({ ...profile, bio: 'CEO of 5 companies...' }); updateScore({ authenticity: -20, professionalism: -10 }); setFeedback("Exaggeration hurts reputation."); setActiveStep(4); }} className="w-full text-left p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                                            <div className="font-bold text-sm mb-1">Exaggerated</div>
                                            <div className="text-xs italic text-white/60">"CEO of 5 companies. Professional gamer..."</div>
                                        </button>
                                    </div>
                                )}

                                {activeStep === 4 && (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {SKILL_OPTIONS.map(skill => (
                                                <button key={skill} onClick={() => { if (!profile.skills.includes(skill)) { setProfile({ ...profile, skills: [...profile.skills, skill] }); updateScore({ growthPotential: 5 }); } }} className={`px-3 py-1.5 rounded-full border text-xs font-medium ${profile.skills.includes(skill) ? 'bg-green-500 border-green-500 text-black' : 'border-white/20'}`}>
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                        {profile.skills.length > 0 && (
                                            <button onClick={() => { setFeedback("Great skills selected."); setActiveStep(5); }} className="w-full py-3 bg-blue-500 rounded-xl font-bold text-white text-sm">Continue to Posts</button>
                                        )}
                                    </div>
                                )}

                                {activeStep === 5 && (
                                    <div className="space-y-3">
                                        <button onClick={() => { setProfile({ ...profile, posts: [...profile.posts, 'Shared a resource...'] }); updateScore({ professionalism: 15, growthPotential: 20 }); setFeedback("Educational posts build reputation."); setActiveStep(6); }} className="w-full text-left p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                            <div className="font-bold text-sm mb-1">Educational Post</div>
                                            <div className="text-xs text-white/60">"Just finished a coding challenge..."</div>
                                        </button>
                                        <button onClick={() => { setProfile({ ...profile, posts: [...profile.posts, 'Argument...'] }); updateScore({ professionalism: -15, safety: -10 }); setFeedback("Arguments leave a bad trail."); setActiveStep(6); }} className="w-full text-left p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                                            <div className="font-bold text-sm mb-1">Rude/Oversharing</div>
                                            <div className="text-xs text-white/60">"I can't believe how stupid some people are..."</div>
                                        </button>
                                    </div>
                                )}

                                {activeStep === 6 && (
                                    <div className="space-y-3">
                                        <button onClick={() => { setProfile({ ...profile, interactions: [...profile.interactions, 'Respectful reply'] }); updateScore({ professionalism: 15, authenticity: 10 }); setFeedback("Respect shows character."); setActiveStep(7); }} className="w-full text-left p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                            <div className="font-bold text-sm mb-1">Professional Reply</div>
                                            <div className="text-xs text-white/60">"Thanks for the feedback! Always learning!"</div>
                                        </button>
                                        <button onClick={() => { setProfile({ ...profile, interactions: [...profile.interactions, 'Negative reply'] }); updateScore({ professionalism: -20, safety: -5 }); setFeedback("Hostility drives people away."); setActiveStep(7); }} className="w-full text-left p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                                            <div className="font-bold text-sm mb-1">Hostile Reply</div>
                                            <div className="text-xs text-white/60">"Who asked you? Blocked."</div>
                                        </button>
                                    </div>
                                )}

                                {activeStep === 7 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                                            <div className={profile.privacyPrivate ? 'text-green-400' : 'text-red-400'}>{profile.privacyPrivate ? <Lock /> : <Eye />}</div>
                                            <div>
                                                <div className="font-bold text-sm">{profile.privacyPrivate ? 'Private' : 'Public'}</div>
                                                <div className="text-xs text-slate-400">{profile.privacyPrivate ? 'Only approved' : 'Anyone can see'}</div>
                                            </div>
                                            <button onClick={() => { const newP = !profile.privacyPrivate; setProfile({ ...profile, privacyPrivate: newP }); updateScore({ safety: newP ? 30 : -30 }); setFeedback(newP ? "Private is safer!" : "Public is risky."); }} className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${profile.privacyPrivate ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                                Toggle
                                            </button>
                                        </div>
                                        <button onClick={() => setActiveStep(8)} className="w-full py-3 bg-blue-500 rounded-xl font-bold text-white text-sm">Lock & Continue</button>
                                    </div>
                                )}

                                {activeStep === 8 && (
                                    <div className="space-y-4">
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {profile.posts.length > 0 ? profile.posts.map((post, i) => (
                                                <div key={i} className="p-2 rounded bg-white/5 border border-white/5 text-xs">
                                                    <span className="text-[10px] text-white/30 block">Post #{i + 1}</span>
                                                    {post}
                                                </div>
                                            )) : <div className="text-xs text-white/30 italic">No posts yet.</div>}
                                        </div>
                                        <button onClick={() => setActiveStep(9)} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-white text-sm">View Report</button>
                                    </div>
                                )}

                                {activeStep >= 9 && (
                                    <div className="space-y-4 text-center">
                                        <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                            <CheckCircle2 size={32} className="text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Profile Ready!</h4>
                                            <p className="text-xs text-slate-400 mt-1">You have built a comprehensive digital identity.</p>
                                        </div>
                                        <button onClick={handleReset} className="w-full py-3 bg-slate-700 rounded-xl font-bold text-white text-sm">Start Over</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                    controls={
                        <MobileControlGroup
                            onPlay={() => setIsPaused(!isPaused)}
                            onReset={handleReset}
                            onNext={() => setActiveStep(Math.min(10, activeStep + 1))}
                            onPrev={() => setActiveStep(Math.max(1, activeStep - 1))}
                            isPlaying={!isPaused}
                        />
                    }
                    infoContent={
                        <div>
                            <h4 className="font-bold mb-1 uppercase text-xs text-blue-400">Profile Safety</h4>
                            <p className="text-sm">Build a professional and safe digital presence step by step.</p>
                            {feedback && (
                                <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                                    <p className="text-xs text-blue-300">{feedback}</p>
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
                    headerTitle="SOCIAL PROFILE"
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
                                    <h2 className="text-lg font-bold">Profile Steps</h2>
                                    <p className="text-xs text-slate-400">Build your digital identity</p>
                                </div>

                                <div className="flex-1 space-y-2 overflow-y-auto">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                                        <button
                                            key={step}
                                            onClick={() => {
                                                setActiveStep(step);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-lg transition-all ${activeStep === step
                                                ? 'bg-blue-500/20 border border-blue-500/50'
                                                : 'bg-slate-800/30 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="text-sm font-bold">Step {step}</div>
                                            <div className="text-xs text-slate-400">
                                                {step === 1 && "Platform Purpose"}
                                                {step === 2 && "Profile Photo"}
                                                {step === 3 && "Bio"}
                                                {step === 4 && "Skills"}
                                                {step === 5 && "Privacy"}
                                                {step === 6 && "First Post"}
                                                {step === 7 && "Interactions"}
                                                {step === 8 && "Platform Rules"}
                                                {step === 9 && "Review"}
                                                {step === 10 && "Assessment"}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <button
                                        onClick={() => setSimplifiedMode(!simplifiedMode)}
                                        className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        {simplifiedMode ? 'Full Mode' : 'Simplified Mode'}
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex flex-col h-screen bg-[#0B1220] text-[#E6E9F0] overflow-y-auto md:overflow-hidden">
                {/* Top Header */}
                <header className="p-4 border-b border-white/10 flex justify-between items-center bg-[#111827]/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">SOCIAL PROFILE DEVELOPMENT</h1>
                            <p className="text-xs text-white/50">BUILDING A RESPONSIBLE DIGITAL IDENTITY</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            <span className="text-[10px] font-semibold text-white/40">SIMPLIFIED MODE</span>
                            <button
                                onClick={() => setSimplifiedMode(!simplifiedMode)}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${simplifiedMode ? 'bg-blue-500' : 'bg-white/20'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${simplifiedMode ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Container */}
                <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-y-auto md:overflow-hidden">

                    {/* Left Panel - Profile Elements */}
                    <aside className="w-full md:w-64 border-r border-white/5 bg-[#111827]/50 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Profile Elements</h2>
                        <div className="flex flex-col gap-2">
                            {PROFILE_ELEMENTS.map((el, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${activeStep === i + 1 ? 'bg-white/10 border-white/20 shadow-lg' : 'border-transparent text-white/40 opacity-50'}`}
                                >
                                    <div className={`${activeStep === i + 1 ? 'text-blue-400' : ''}`}>{el.icon}</div>
                                    <span className="text-sm font-medium">{el.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5">
                            <HelpCircle className="text-blue-400 mb-2" size={18} />
                            <p className="text-xs text-white/70 leading-relaxed italic">
                                "Your social profile is your digital first impression. What you post today affects opportunities tomorrow."
                            </p>
                        </div>
                    </aside>

                    {/* Center Simulation */}
                    <section className="flex-1 bg-gradient-to-b from-[#0B1220] to-[#111827] flex flex-col p-8 overflow-y-auto custom-scrollbar relative">

                        <div className="max-w-3xl mx-auto w-full flex-1">
                            <div className="mb-8 flex justify-between items-end">
                                <div>
                                    <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold mb-2 uppercase tracking-tighter">Step {activeStep} of 10</span>
                                    <h3 className="text-3xl font-bold">
                                        {activeStep === 1 && "Choose Your Platform's Purpose"}
                                        {activeStep === 2 && "The First Impression: Profile Photo"}
                                        {activeStep === 3 && "Who Are You? Bio & About"}
                                        {activeStep === 4 && "Showcase Your Growth: Skills"}
                                        {activeStep === 5 && "Digital Footprint: Posting Content"}
                                        {activeStep === 6 && "Social Manners: Comments"}
                                        {activeStep === 7 && "The Shield: Privacy Settings"}
                                        {activeStep === 8 && "History Tracker: Digital Footprint"}
                                        {activeStep === 9 && "The Verdict: Profile Review"}
                                        {activeStep === 10 && "Continuous Improvement"}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Simulation Content area */}
                                <div className="bg-white/5 rounded-3xl border border-white/10 p-8 min-h-[400px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">

                                    {activeStep === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => {
                                                    setProfile({ ...profile, purpose: PlatformPurpose.LEARNING });
                                                    updateScore({ growthPotential: 20, professionalism: 10 });
                                                    setFeedback("Smart move! Having a clear purpose helps you stay focused and professional.");
                                                    setActiveStep(2);
                                                }}
                                                className="group p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                                                    <BookOpen />
                                                </div>
                                                <h4 className="font-bold text-lg mb-2">Purpose-based Profile</h4>
                                                <p className="text-sm text-white/60">Focus on learning, showcasing creativity, or building a network for future opportunities.</p>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setProfile({ ...profile, purpose: PlatformPurpose.NONE });
                                                    updateScore({ growthPotential: -5 });
                                                    setFeedback("Without a goal, it's easy to post things you might regret later.");
                                                    setActiveStep(2);
                                                }}
                                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-white/60 group-hover:scale-110 transition-transform">
                                                    <Globe />
                                                </div>
                                                <h4 className="font-bold text-lg mb-2">Random Posting</h4>
                                                <p className="text-sm text-white/60">Using the platform purely for fun with no specific goal or strategy in mind.</p>
                                            </button>
                                        </div>
                                    )}

                                    {activeStep === 2 && (
                                        <div className="space-y-6">
                                            <p className="text-lg text-white/80">Select a profile photo that represents you best:</p>
                                            <div className="flex flex-wrap gap-8 justify-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <button
                                                        onClick={() => {
                                                            setProfile({ ...profile, photo: 'prof' });
                                                            updateScore({ professionalism: 25, authenticity: 10 });
                                                            setFeedback("Great choice! A clear, respectful image makes you approachable and reliable.");
                                                            setActiveStep(3);
                                                        }}
                                                        className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-green-400 border-4 border-white/20 hover:scale-105 transition-transform flex items-center justify-center relative group"
                                                    >
                                                        <User size={60} className="text-white" />
                                                        <div className="absolute inset-0 rounded-full bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                    <span className="text-sm font-semibold text-green-400 uppercase">Respectful & Clear</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-4">
                                                    <button
                                                        onClick={() => {
                                                            setProfile({ ...profile, photo: 'bad' });
                                                            updateScore({ professionalism: -15, safety: -10 });
                                                            setFeedback("Caution: Unclear or inappropriate photos can send the wrong signal to colleges or employers.");
                                                            setActiveStep(3);
                                                        }}
                                                        className="w-40 h-40 rounded-full bg-gray-800 border-4 border-red-500/30 hover:scale-105 transition-transform flex items-center justify-center relative"
                                                    >
                                                        <ShieldAlert size={60} className="text-red-400" />
                                                        <div className="absolute inset-0 rounded-full bg-red-500/20" />
                                                    </button>
                                                    <span className="text-sm font-semibold text-red-400 uppercase">Unclear/Risky</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 3 && (
                                        <div className="space-y-6">
                                            <p className="text-lg text-white/80">Draft your bio. What story do you want to tell?</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => {
                                                        setProfile({ ...profile, bio: 'Student at Oakwood High, passionate about coding and sustainability. Sharing my learning journey!' });
                                                        updateScore({ authenticity: 20, growthPotential: 15 });
                                                        setFeedback("Authenticity builds trust. This bio is honest and shows you're growing.");
                                                        setActiveStep(4);
                                                    }}
                                                    className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 text-left hover:bg-green-500/20 transition-all"
                                                >
                                                    <h5 className="font-bold mb-2">Option A: Honest & Positive</h5>
                                                    <p className="text-sm italic text-white/70">"Student at Oakwood High, passionate about coding and sustainability. Sharing my learning journey!"</p>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setProfile({ ...profile, bio: 'CEO of 5 companies. Professional gamer. World traveler. Verified only.' });
                                                        updateScore({ authenticity: -20, professionalism: -10 });
                                                        setFeedback("Fake or exaggerated claims can damage your reputation when people find out the truth.");
                                                        setActiveStep(4);
                                                    }}
                                                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-left hover:bg-red-500/20 transition-all"
                                                >
                                                    <h5 className="font-bold mb-2">Option B: Exaggerated Claims</h5>
                                                    <p className="text-sm italic text-white/70">"CEO of 5 companies. Professional gamer. World traveler. Verified only."</p>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 4 && (
                                        <div className="space-y-6">
                                            <p className="text-lg text-white/80">Add tags that represent your real interests and learning:</p>
                                            <div className="flex flex-wrap gap-3">
                                                {SKILL_OPTIONS.map(skill => (
                                                    <button
                                                        key={skill}
                                                        onClick={() => {
                                                            if (!profile.skills.includes(skill)) {
                                                                setProfile({ ...profile, skills: [...profile.skills, skill] });
                                                                updateScore({ growthPotential: 5 });
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${profile.skills.includes(skill) ? 'bg-green-500 border-green-500 text-black' : 'border-white/20 hover:border-white/50'}`}
                                                    >
                                                        {skill}
                                                    </button>
                                                ))}
                                            </div>
                                            {profile.skills.length > 0 && (
                                                <div className="pt-4 border-t border-white/10 flex justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setFeedback("Profiles should reflect your real growth. These tags help others understand your potential.");
                                                            setActiveStep(5);
                                                        }}
                                                        className="px-6 py-2 bg-blue-500 rounded-full font-bold text-white hover:bg-blue-600 transition-colors"
                                                    >
                                                        Next Step
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeStep === 5 && (
                                        <div className="space-y-6">
                                            <p className="text-lg text-white/80">What would you like to post today?</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => {
                                                        setProfile({ ...profile, posts: [...profile.posts, 'Shared a resource on coding for beginners!'] });
                                                        updateScore({ professionalism: 15, growthPotential: 20 });
                                                        setFeedback("Every post leaves a footprint. Educational or creative posts build a great reputation.");
                                                        setActiveStep(6);
                                                    }}
                                                    className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-left hover:bg-blue-500/20 transition-all"
                                                >
                                                    <h5 className="font-bold mb-2">Post A: Educational</h5>
                                                    <p className="text-sm text-white/70">"Just finished a 5-day coding challenge. Here is what I learned about JavaScript functions!"</p>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setProfile({ ...profile, posts: [...profile.posts, 'Argument with a stranger online'] });
                                                        updateScore({ professionalism: -15, safety: -10 });
                                                        setFeedback("Warning: Arguments or harmful content can stay attached to your name forever.");
                                                        setActiveStep(6);
                                                    }}
                                                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-left hover:bg-red-500/20 transition-all"
                                                >
                                                    <h5 className="font-bold mb-2">Post B: Rude/Oversharing</h5>
                                                    <p className="text-sm text-white/70">"I can't believe how stupid some people are. If you don't agree with me, just get off my page!"</p>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 6 && (
                                        <div className="space-y-6">
                                            <p className="text-lg text-white/80">Someone commented: "Nice work, but I think you missed a step in your logic." How do you respond?</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => {
                                                        setProfile({ ...profile, interactions: [...profile.interactions, 'Respectful reply'] });
                                                        updateScore({ professionalism: 15, authenticity: 10 });
                                                        setFeedback("Respectful interaction shows character and emotional intelligence.");
                                                        setActiveStep(7);
                                                    }}
                                                    className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-left hover:bg-blue-500/20 transition-all"
                                                >
                                                    <h5 className="font-bold mb-2">Response A: Professional</h5>
                                                    <p className="text-sm text-white/70">"Thanks for the feedback! You're right, I'll update that part. Always learning!"</p>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setProfile({ ...profile, interactions: [...profile.interactions, 'Negative reply'] });
                                                        updateScore({ professionalism: -20, safety: -5 });
                                                        setFeedback("Trolling or negative behavior creates a hostile digital identity.");
                                                        setActiveStep(7);
                                                    }}
                                                    className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-left hover:bg-red-500/20 transition-all"
                                                >
                                                    <h5 className="font-bold mb-2">Response B: Hostile</h5>
                                                    <p className="text-sm text-white/70">"Who asked you? Go worry about your own posts. Blocked."</p>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 7 && (
                                        <div className="space-y-8 flex flex-col items-center">
                                            <p className="text-lg text-white/80 text-center">Privacy is your primary protection. How will you secure your profile?</p>
                                            <div className="flex items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 w-full max-w-md">
                                                <div className={`p-4 rounded-2xl transition-all duration-500 ${profile.privacyPrivate ? 'bg-green-500 text-black' : 'bg-red-500/20 text-red-500'}`}>
                                                    {profile.privacyPrivate ? <Lock size={32} /> : <Eye size={32} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-xl">{profile.privacyPrivate ? 'Private Account' : 'Public Account'}</h4>
                                                    <p className="text-xs text-white/50">{profile.privacyPrivate ? 'Only approved followers can see posts.' : 'Anyone on the internet can see your details.'}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newPrivacy = !profile.privacyPrivate;
                                                        setProfile({ ...profile, privacyPrivate: newPrivacy });
                                                        if (newPrivacy) {
                                                            updateScore({ safety: 30 });
                                                            setFeedback("Account set to Private. Your personal info is now shielded from the public web! +30 Safety Score.");
                                                        } else {
                                                            updateScore({ safety: -30 });
                                                            setFeedback("Account set to Public. Be careful! Anyone can see your posts and details. -30 Safety Score.");
                                                        }
                                                    }}
                                                    className={`w-14 h-8 rounded-full relative transition-colors ${profile.privacyPrivate ? 'bg-green-500' : 'bg-red-500/40'}`}
                                                >
                                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.privacyPrivate ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setActiveStep(8);
                                                }}
                                                className="px-10 py-3 bg-blue-500 rounded-full font-bold text-white shadow-xl hover:shadow-blue-500/20 transition-all"
                                            >
                                                Lock Settings & Continue
                                            </button>
                                        </div>
                                    )}

                                    {activeStep === 8 && (
                                        <div className="space-y-6">
                                            <p className="text-lg text-white/80">Timeline analysis: Here is what the internet remembers about you.</p>
                                            <div className="space-y-4">
                                                {profile.posts.length > 0 ? profile.posts.map((post, i) => (
                                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-white/30 block mb-1 uppercase">Post Entry #{i + 1}</span>
                                                            <p className="text-sm font-medium">{post}</p>
                                                        </div>
                                                        {post.includes('Argument') || post.includes('rude') ? (
                                                            <div className="flex items-center gap-2 text-red-400">
                                                                <AlertTriangle size={16} />
                                                                <span className="text-[10px] font-bold">NEGATIVE IMPACT</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-green-400">
                                                                <CheckCircle2 size={16} />
                                                                <span className="text-[10px] font-bold">POSITIVE SIGNAL</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )) : <p className="text-center text-white/30 italic py-10">No digital footprint data found yet.</p>}
                                            </div>
                                            <div className="pt-6 flex justify-end">
                                                <button
                                                    onClick={() => setActiveStep(9)}
                                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-white shadow-lg"
                                                >
                                                    View Profile Report
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeStep === 9 && (
                                        <div className="space-y-6 flex flex-col items-center">
                                            <h4 className="text-xl font-bold mb-2">Your Professional Digital Identity Report</h4>
                                            <div className="w-full h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                        <XAxis dataKey="name" stroke="#666" fontSize={12} />
                                                        <YAxis domain={[0, 100]} stroke="#666" fontSize={12} />
                                                        <Tooltip
                                                            contentStyle={{ backgroundColor: '#111827', borderColor: '#333' }}
                                                            itemStyle={{ color: '#fff' }}
                                                        />
                                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                            {chartData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 w-full">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <span className="text-[10px] font-bold text-white/40 block mb-1">STRENGTHS</span>
                                                    <p className="text-sm text-green-400 font-medium">
                                                        {profile.score.professionalism > 60 ? "Highly Professional Presence" : "Growing Reputation"}
                                                    </p>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                    <span className="text-[10px] font-bold text-white/40 block mb-1">AREAS TO IMPROVE</span>
                                                    <p className="text-sm text-red-400 font-medium">
                                                        {profile.score.safety < 50 ? "Privacy Concerns Detected" : "Maintain Consistency"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setActiveStep(10)}
                                                className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors"
                                            >
                                                Next: Improvement Mode
                                            </button>
                                        </div>
                                    )}

                                    {activeStep === 10 && (
                                        <div className="space-y-8 flex flex-col items-center text-center">
                                            <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center animate-bounce">
                                                <CheckCircle2 size={64} />
                                            </div>
                                            <div className="space-y-4 max-w-md">
                                                <h4 className="text-2xl font-bold">Profile Ready!</h4>
                                                <p className="text-white/60">
                                                    You have successfully built a responsible digital identity. Remember, online presence is not static; it grows as you do.
                                                </p>
                                                <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-left">
                                                    <h5 className="font-bold text-blue-400 mb-2">Improvement Tips:</h5>
                                                    <ul className="text-xs text-white/70 space-y-2 list-disc pl-4">
                                                        <li>Regularly review your privacy settings.</li>
                                                        <li>Delete old posts that no longer reflect who you are.</li>
                                                        <li>Follow experts in fields you are interested in.</li>
                                                        <li>Practice "Think Before You Post" every single time.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleReset}
                                                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                                            >
                                                <RotateCcw size={16} />
                                                <span className="text-sm font-bold uppercase tracking-widest">Restart Simulation</span>
                                            </button>
                                        </div>
                                    )}

                                </div>

                                {/* Lesson Card */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Key Lesson</h5>
                                        <p className="text-sm text-white/80 font-medium leading-relaxed">
                                            {activeStep === 1 && "Every platform should have a clear purpose. It keeps your activity intentional."}
                                            {activeStep === 2 && "Your photo creates the first impression. Keep it professional and clear."}
                                            {activeStep === 3 && "Authenticity builds trust. Being yourself is better than being 'perfect'."}
                                            {activeStep === 4 && "Profiles should reflect learning and growth, not just popularity."}
                                            {activeStep === 5 && "Every post leaves a footprint. Think: Would I want a college to see this?"}
                                            {activeStep === 6 && "Online behavior shows character. Respectful interactions are key to branding."}
                                            {activeStep === 7 && "Privacy is protection. You control who sees your digital life."}
                                            {activeStep === 8 && "The internet remembers. Your history is part of your current identity."}
                                            {activeStep === 9 && "Self-awareness is power. Regularly check how you are perceived online."}
                                            {activeStep === 10 && "Profiles can always be improved. Responsibility is a habit, not a goal."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Overlay */}
                        {feedback && (
                            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-lg w-full px-4 animate-in fade-in slide-in-from-bottom-10">
                                <div className="p-4 rounded-2xl bg-[#111827] border border-white/20 shadow-2xl flex items-center justify-between gap-4">
                                    <p className="text-sm font-medium text-white/90">{feedback}</p>
                                    <button
                                        onClick={() => setFeedback(null)}
                                        className="p-1 rounded-lg hover:bg-white/10 text-white/40"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Right Panel - Safety & Guidelines */}
                    <aside className="w-full md:w-80 border-l border-white/5 bg-[#111827]/50 p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar">

                        {/* Status Indicators */}
                        {!simplifiedMode && (
                            <section className="space-y-4">
                                <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <PieChart size={14} /> Safety & Metrics
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-bold text-blue-400 block mb-1">PROFESSIONALISM</span>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-y-auto md:overflow-hidden">
                                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${profile.score.professionalism}%` }} />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-bold text-red-400 block mb-1">SAFETY</span>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-y-auto md:overflow-hidden">
                                            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${profile.score.safety}%` }} />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-bold text-purple-400 block mb-1">AUTHENTICITY</span>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-y-auto md:overflow-hidden">
                                            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${profile.score.authenticity}%` }} />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-[10px] font-bold text-green-400 block mb-1">GROWTH</span>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-y-auto md:overflow-hidden">
                                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${profile.score.growthPotential}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Important Rules */}
                        <section className="space-y-4">
                            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <ShieldAlert size={14} className="text-red-400" /> Important Rules
                            </h2>
                            <ul className="space-y-3">
                                {[
                                    "Never share personal details",
                                    "Avoid harmful trends",
                                    "Think before posting",
                                    "Respect others",
                                    "Balance online & offline life"
                                ].map((rule, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs text-white/70 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Myths vs Reality */}
                        <section className="space-y-4">
                            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <HelpCircle size={14} className="text-blue-400" /> Myths vs Reality
                            </h2>
                            <div className="space-y-3">
                                {MYTHS_VS_REALITY.map((item, i) => (
                                    <div key={i} className="text-[11px] leading-relaxed p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-red-400 line-through opacity-60 mb-1 flex items-center gap-1">
                                            ❌ {item.myth}
                                        </div>
                                        <div className="text-green-400 font-bold flex items-center gap-1">
                                            ✅ {item.reality}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Did you know card */}
                        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                            <h6 className="text-[10px] font-bold text-yellow-500 uppercase mb-2">Did You Know?</h6>
                            <p className="text-xs text-white/70 italic leading-relaxed">
                                “Many colleges and companies check online profiles before offering opportunities.”
                            </p>
                        </div>
                    </aside>
                </main>

                {/* Bottom Controls */}
                <footer className="h-20 border-t border-white/10 bg-[#111827] px-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                            className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            Previous
                        </button>
                        <div className="h-4 w-px bg-white/10" />
                        <button
                            onClick={() => setActiveStep(Math.min(10, activeStep + 1))}
                            className="flex items-center gap-2 bg-blue-500 px-6 py-2 rounded-full font-bold text-white text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Play size={16} />
                            {activeStep === 10 ? 'RESTART' : 'BUILD PROFILE'}
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                        >
                            {isPaused ? <Play size={18} /> : <Pause size={18} />}
                            <span className="text-[10px] font-bold uppercase tracking-widest">{isPaused ? 'Resume' : 'Pause'}</span>
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                        >
                            <RotateCcw size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Reset</span>
                        </button>
                        <div className="h-4 w-px bg-white/10" />
                        <button
                            onClick={() => setActiveStep(9)}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                        >
                            <PieChart size={18} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Report</span>
                        </button>
                        <Settings size={18} className="text-white/40 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </footer>
            </div>
        </>
    );
};

export default App;
