
import React, { useRef, useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Gift, Users, Trophy, Calendar,
    ArrowRight, Code, TrendingUp, Award, ChevronLeft, ChevronRight, Crown, LayoutGrid, X as XIcon, Star
} from 'lucide-react';
import { Ambassador } from '../types';

const motion = motionBase as any;

// Custom SVG Icons for authentic brand representation
const Icons = {
    Instagram: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
        </svg>
    ),
    Discord: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.12,7.46 4.7,9.68C4.7,14.54 7.3,16.79 7.3,16.79C9.1,19 11.88,19.05 11.88,19.05L12.27,18.5C10.5,18.04 8.84,16.5 8.84,16.5C8.84,16.5 9.31,16.8 11.1,17.29C13.1,17.83 15.32,17.42 16.7,16.5C16.7,16.5 15.04,18.04 13.27,18.5L13.66,19.05C13.66,19.05 16.44,19 18.24,16.79C18.24,16.79 20.84,14.54 20.84,9.68C19.42,7.46 17.14,6.36 15.45,6.33L15.27,6.5C15.27,6.5 17.07,7.03 18.1,7.95C18.1,7.95 16.23,6.8 13.55,6.8H12M9.25,11C10.21,11 11,11.89 11,13C11,14.11 10.21,15 9.25,15C8.29,15 7.5,14.11 7.5,13C7.5,11.89 8.29,11 9.25,11M16.25,11C17.21,11 18,11.89 18,13C18,14.11 17.21,15 16.25,15C15.29,15 14.5,14.11 14.5,13C14.5,11.89 15.29,11 16.25,11Z" />
        </svg>
    ),
    X: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Reddit: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,16C9.5,16 7.5,15.1 7.5,14C7.5,13.7 7.7,13.4 8,13.2C8.3,13 8.7,13 9.1,13.1C9.9,13.6 10.9,13.9 12,13.9C13.1,13.9 14.1,13.6 14.9,13.1C15.3,13 15.7,13 16,13.2C16.3,13.4 16.5,13.7 16.5,14C16.5,15.1 14.5,16 12,16M17.5,11.5C16.7,11.5 16,10.8 16,10C16,9.2 16.7,8.5 17.5,8.5C18.3,8.5 19,9.2 19,10C19,10.8 18.3,11.5 17.5,11.5M16.2,6.5L16.7,4.3L18.8,4.8L18.6,5.8C19.7,6.3 20.5,7.3 20.5,8.5C20.5,9.6 19.9,10.5 19,11C19.1,11.3 19.1,11.7 19.1,12C19.1,14.8 15.9,17 12,17C8.1,17 4.9,14.8 4.9,12C4.9,11.7 4.9,11.3 5,11C4.1,10.5 3.5,9.6 3.5,8.5C3.5,7.1 4.6,6 6,6C7,6 7.9,6.6 8.3,7.4C9.3,6.9 10.6,6.6 12,6.5L12.5,6.5L16.2,6.5M6.5,11.5C7.3,11.5 8,10.8 8,10C8,9.2 7.3,8.5 6.5,8.5C5.7,8.5 5,9.2 5,10C5,10.8 5.7,11.5 6.5,11.5Z" />
        </svg>
    ),
    WhatsApp: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M16.53 14.84C16.48 14.76 16.38 14.71 16.13 14.59C15.89 14.47 14.68 13.87 14.46 13.79C14.24 13.71 14.08 13.67 13.91 13.91C13.75 14.15 13.29 14.71 13.14 14.88C13 15.04 12.85 15.06 12.61 14.94C12.36 14.82 11.58 14.56 10.65 13.73C9.93 13.09 9.44 12.3 9.3 12.06C9.16 11.82 9.28 11.69 9.4 11.57C9.51 11.46 9.65 11.28 9.77 11.14C9.9 11 9.95 10.9 10.03 10.74C10.11 10.58 10.06 10.44 10 10.31C9.94 10.18 9.46 9 9.26 8.5C9.06 8.04 8.87 8.1 8.73 8.1H8.33C8.2 8.1 7.97 8.15 7.78 8.36C7.58 8.57 7.03 9.08 7.03 10.13C7.03 11.18 7.8 12.19 7.91 12.34C8.02 12.48 9.45 14.75 11.69 15.68C13.93 16.61 13.93 16.31 14.33 16.27C14.74 16.23 15.63 15.75 15.82 15.22C16 14.69 16 14.23 15.95 14.15C15.89 14.07 15.74 14.03 15.5 13.91" />
        </svg>
    ),
    YouTube: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
    ),
    LinkedIn: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    )
};

const socialPlatforms = [
    { name: 'Instagram', icon: Icons.Instagram, color: 'text-pink-500', hoverClass: 'group-hover:text-pink-500', url: 'https://www.instagram.com/official_geniusphere/' },
    { name: 'Discord', icon: Icons.Discord, color: 'text-indigo-500', hoverClass: 'group-hover:text-indigo-500', url: 'https://discord.gg/ZTXyG692bc' },
    { name: 'X (Twitter)', icon: Icons.X, color: 'text-white', hoverClass: 'group-hover:text-white', url: 'https://x.com' },
    { name: 'Reddit', icon: Icons.Reddit, color: 'text-orange-500', hoverClass: 'group-hover:text-orange-500', url: 'https://www.reddit.com/r/Geniusphere_Hub/' },
    { name: 'WhatsApp', icon: Icons.WhatsApp, color: 'text-green-500', hoverClass: 'group-hover:text-green-500', url: 'https://whatsapp.com/channel/0029VaANnkkDOQIRNCUAfp3o' },
    { name: 'YouTube', icon: Icons.YouTube, color: 'text-red-500', hoverClass: 'group-hover:text-red-500', url: 'https://youtube.com/@geniusphereofficial1231?si=GKq07XBAkJ_I-JQh' },
    { name: 'LinkedIn', icon: Icons.LinkedIn, color: 'text-blue-500', hoverClass: 'group-hover:text-blue-500', url: 'https://www.linkedin.com/in/geniusphere-the-students-startup-9067b12a9/' },
];

const EVENTS = [
    {
        id: 1,
        title: "Global AI Hackathon",
        date: "Oct 15 - Oct 17",
        type: "Tech",
        icon: Code,
        color: "text-blue-400",
        description: "Build the future of GenAI in 48 hours.",
        link: "https://docs.google.com/forms/u/0/?tgif=d"
    },
    {
        id: 2,
        title: "Wall St. Finance Challenge",
        date: "Nov 01",
        type: "Finance",
        icon: TrendingUp,
        color: "text-green-400",
        description: "Simulated trading competition with real prizes.",
        link: "https://docs.google.com/forms/u/0/?tgif=d"
    },
    {
        id: 3,
        title: "Certification Week",
        date: "Nov 20 - Nov 27",
        type: "Career",
        icon: Award,
        color: "text-purple-400",
        description: "Double XP and free certification exams.",
        link: "https://docs.google.com/forms/u/0/?tgif=d"
    }
];

interface CommunityEventsProps {
    ambassadors?: Ambassador[];
}

interface EventCardProps {
    event: typeof EVENTS[0];
    isGrid?: boolean;
    onRegister: (link: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isGrid = false, onRegister }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className={`${isGrid ? 'w-full' : 'min-w-[300px] md:min-w-[350px] snap-center flex-shrink-0'} group bg-slate-800/40 border border-white/10 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors cursor-pointer`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${event.color}`}>
                <event.icon size={24} />
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 border border-white/5">
                {event.type}
            </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Calendar size={12} /> {event.date}
        </div>

        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{event.title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">{event.description}</p>

        <button
            onClick={() => onRegister(event.link)}
            className="w-full py-2 rounded-lg bg-white/5 text-center text-sm font-bold text-slate-300 group-hover:bg-cyan-500 group-hover:text-black transition-all flex items-center justify-center gap-2"
        >
            Register Now <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
        </button>
    </motion.div>
);

// Leaderboard Component
const LeaderboardModal: React.FC<{ isOpen: boolean; onClose: () => void; ambassadors: Ambassador[] }> = ({ isOpen, onClose, ambassadors }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                    <Crown className="text-yellow-400 fill-yellow-400" size={32} />
                                    Top Representatives
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Real-time rankings of our top performing student leaders.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors border border-white/5"
                            >
                                <XIcon size={24} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/50">
                            <div className="space-y-4">
                                {ambassadors.length > 0 ? ambassadors.map((amb, idx) => (
                                    <motion.div
                                        key={amb.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${idx === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' :
                                            idx === 1 ? 'bg-slate-800/40 border-slate-600/30' :
                                                idx === 2 ? 'bg-orange-800/20 border-orange-700/30' :
                                                    'bg-slate-900/40 border-white/5'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-lg ${idx === 0 ? 'bg-yellow-500 text-black' :
                                            idx === 1 ? 'bg-slate-300 text-black' :
                                                idx === 2 ? 'bg-orange-600 text-white' :
                                                    'bg-slate-800 text-slate-500'
                                            }`}>
                                            {idx + 1}
                                        </div>

                                        <div className="relative">
                                            <img src={amb.avatarUrl} alt={amb.name} className="w-12 h-12 rounded-full border-2 border-slate-800 object-cover" />
                                            {idx < 3 && (
                                                <div className="absolute -top-1 -right-1 text-yellow-400">
                                                    <Crown size={14} fill="currentColor" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                                                {amb.name}
                                                {idx < 3 && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                                            </h3>
                                            <p className="text-slate-500 text-xs uppercase tracking-wider">{amb.college}</p>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xl md:text-2xl font-bold font-mono text-cyan-400">{amb.points.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">XP Points</div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20 text-slate-500">
                                        No representatives ranked yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const CommunityEvents: React.FC<CommunityEventsProps> = ({ ambassadors = [] }) => {
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Create a larger set for the carousel loop
    const CAROUSEL_EVENTS = [...EVENTS, ...EVENTS];
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -320 : 320;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Sort ambassadors by rank or points
    const sortedAmbassadors = [...ambassadors].sort((a, b) => a.rank - b.rank).slice(0, 10);

    const handleApply = () => {
        window.open('https://forms.gle/99f2S49BPfwhJCQM8', '_blank');
    };

    const handleRegisterEvent = (link: string) => {
        window.open(link, '_blank');
    };

    return (
        <section className="py-24 relative border-t border-white/5 overflow-hidden">
            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
            <div className="absolute inset-0 -z-10 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_-20%,#000_70%,transparent_110%)]" />

            <div className="container mx-auto px-6">

                {/* Genius Representatives Program (Formerly Campus Ambassador) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    {/* Improved Layout: Glass Card with Side-by-Side Content */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                        {/* Background Blobs */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-14 items-center">

                            {/* Left Column: CTA & Info */}
                            <div className="text-left space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6 shadow-glow-cyan">
                                        <Megaphone size={14} /> Recruitment Open
                                    </div>
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                                        Become a <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Genius Representative</span>
                                    </h3>
                                    <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                                        Join an elite network of student leaders. Promote Geniusphere, organize tech workshops at your campus, and unlock exclusive perks.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button onClick={handleApply} className="px-8 py-4 bg-white text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                                        Apply Now <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => setShowLeaderboard(true)}
                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all group"
                                    >
                                        <Crown size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" /> View Leaderboard
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Benefits Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                                <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors backdrop-blur-md">
                                    <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-4">
                                        <Gift size={24} />
                                    </div>
                                    <h4 className="font-bold text-white text-lg mb-2">Exclusive Rewards</h4>
                                    <p className="text-slate-400 text-sm">Earn branded swag, gadgets, and pro-access for your milestones.</p>
                                </div>
                                <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors backdrop-blur-md sm:translate-y-8">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                                        <Users size={24} />
                                    </div>
                                    <h4 className="font-bold text-white text-lg mb-2">Host Events</h4>
                                    <p className="text-slate-400 text-sm">Get funding and support to host workshops at your college.</p>
                                </div>
                                <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors backdrop-blur-md">
                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-4">
                                        <Trophy size={24} />
                                    </div>
                                    <h4 className="font-bold text-white text-lg mb-2">Recognition</h4>
                                    <p className="text-slate-400 text-sm">Certificate of leadership and recommendation letters.</p>
                                </div>
                                <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors backdrop-blur-md sm:translate-y-8 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="text-center relative z-10">
                                        <div className="text-3xl font-bold text-white mb-1">14+</div>
                                        <div className="text-xs text-cyan-300 uppercase tracking-widest font-bold">Interactive Labs</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Events Carousel / Grid */}
                <div className="relative group/carousel">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-2">Upcoming Events & Hackathons</h3>
                            <p className="text-slate-400">Join competitions, workshops, and exclusive webinars.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAllEvents(!showAllEvents)}
                                className={`px-5 py-2.5 rounded-full border border-white/10 text-xs font-bold transition-all uppercase tracking-wider ${showAllEvents ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
                            >
                                {showAllEvents ? 'Close Grid' : 'View All'}
                            </button>
                            {!showAllEvents && (
                                <>
                                    <button onClick={() => scroll('left')} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors group">
                                        <ChevronLeft size={20} className="text-slate-400 group-hover:text-white" />
                                    </button>
                                    <button onClick={() => scroll('right')} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors group">
                                        <ChevronRight size={20} className="text-slate-400 group-hover:text-white" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {showAllEvents ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {EVENTS.map((event, idx) => (
                                    <EventCard key={`grid-${event.id}`} event={event} isGrid={true} onRegister={handleRegisterEvent} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="carousel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                ref={scrollRef}
                                className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
                            >
                                {CAROUSEL_EVENTS.map((event, idx) => (
                                    <EventCard key={`carousel-${event.id}-${idx}`} event={event} onRegister={handleRegisterEvent} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} ambassadors={sortedAmbassadors} />
        </section>
    );
};

export const SocialLinks: React.FC = () => {
    return (
        <section className="py-24 relative border-t border-white/5 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_-20%,#000_70%,transparent_110%)]" />
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Connect & Collaborate
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Digital Universe</span>
                    </h2>
                </motion.div>

                {/* Social Grid */}
                <div className="flex flex-row flex-wrap items-center justify-center gap-4 md:gap-6">
                    {socialPlatforms.map((platform, i) => (
                        <motion.a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                            whileHover={{ y: -5, scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                            className="group relative flex flex-col items-center justify-center p-4 bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl w-24 h-24 cursor-pointer"
                        >
                            <div className={`mb-2 transition-colors duration-300 ${platform.hoverClass} text-slate-300`}>
                                <platform.icon />
                            </div>
                            <h3 className="text-white font-bold text-xs text-center">{platform.name}</h3>

                            {/* Glow Effect on Hover */}
                            <div
                                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                style={{
                                    boxShadow: `inset 0 0 20px ${platform.color.replace('text-', '').replace('-500', '')}`
                                }}
                            />
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};
