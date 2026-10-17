import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Activity, MessageCircle, Star, Sparkles, X, ArrowRight, Brain, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VIDEOS } from '../constants';
import { SectorType } from '../types';

// --- Daily Challenge Component ---
export const DailyChallengeWidget: React.FC = () => {
    const [completed, setCompleted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    // Challenges list with categories
    const challenges = [
        {
            title: "Micro-Learner",
            task: "Watch 1 Finance Video today",
            xp: 50,
            category: SectorType.FINANCE
        },
        {
            title: "Tech Explorer",
            task: "Discover a new AI Tool",
            xp: 60,
            category: SectorType.TECHNOLOGY
        },
        {
            title: "Skill Builder",
            task: "Learn a Professional Soft Skill",
            xp: 55,
            category: SectorType.PROFESSIONAL
        }
    ];

    const currentChallenge = challenges[currentIndex];

    // Rotate challenge every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!completed && !videoUrl) { // Stop rotating if user is interacting/completed or watching video
                setCurrentIndex((prev) => (prev + 1) % challenges.length);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [completed, videoUrl]);

    const handleComplete = () => {
        if (completed) return;
        setCompleted(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#06b6d4', '#8b5cf6']
        });

        // Open random relevant video
        const relevantVideos = VIDEOS.filter(v => v.category === currentChallenge.category);
        if (relevantVideos.length > 0) {
            const randomVideo = relevantVideos[Math.floor(Math.random() * relevantVideos.length)];
            // Convert plain youtube URL to embed URL if needed
            let embedUrl = randomVideo.videoUrl;
            if (embedUrl.includes('watch?v=')) {
                embedUrl = embedUrl.replace('watch?v=', 'embed/');
            }
            setVideoUrl(embedUrl);
        }
    };

    return (
        <>
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-6 min-h-[200px] flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity">
                    <Trophy size={48} className="text-indigo-400 rotate-12" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">Daily Quest</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1"><ClockWidget /></span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{currentChallenge.title}</h3>
                        <p className="text-slate-400 text-sm">{currentChallenge.task}</p>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${completed
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 hover:scale-[1.02]'
                        }`}
                >
                    {completed ? (
                        <><CheckCircle size={18} /> Completed (+{currentChallenge.xp} XP)</>
                    ) : (
                        <>Complete Challenge</>
                    )}
                </button>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {videoUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setVideoUrl(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-400" /> Learning Module
                                </h3>
                                <button onClick={() => setVideoUrl(null)} className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="aspect-video bg-black">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={videoUrl}
                                    title="Quest Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const ClockWidget = () => {
    const [time, setTime] = useState("12h 00m");
    // Just a static visual for now to imply countdown
    return <span>Resets in 12h</span>;
};

// --- Facts Marquee Component ---
export const FactsMarqueeWidget: React.FC = () => {
    const facts = [
        // Tech Facts (10)
        "The first domain name ever registered was Symbolics.com. 🌐",
        "Python is the most popular language for Data Science. 🐍",
        "The first computer bug was a real moth found in a relay. 🦋",
        "90% of the world's data was created in the last two years. 💾",
        "The average person unlocks their phone 150 times a day. 📱",
        "Quantum computers can solve problems in seconds that take supercomputers years. ⚛️",
        "The first webcam was invented to check a coffee pot. ☕",
        "More people have mobile phones than toilets worldwide. 🌍",
        "Cybersecurity jobs are growing by 30% annually. 🔐",
        "AI can now diagnose some diseases better than doctors. 🤖",

        // Finance Facts (8)
        "Compound interest is the 8th wonder of the world. 📈",
        "The 'Bull Market' means prices are rising; 'Bear Market' means falling. 🐂",
        "Diversification is the only free lunch in investing. 🥗",
        "The first credit card was introduced by Diners Club in 1950. 💳",
        "Bitcoin's creator, Satoshi Nakamoto, remains anonymous. 🕵️‍♂️",
        "Inflation erodes the purchasing power of money over time. 💸",
        "The rule of 72 estimates time to double your money. ⏳",
        "Warren Buffett bought his first stock at age 11. 🧒",

        // Professional Skills Facts (8)
        "Emotional Intelligence (EQ) is often more important than IQ for leaders. 🧠",
        "Active listening is the most underrated communication skill. 👂",
        "85% of job success comes from soft skills, not just technical ones. 🤝",
        "Networking is about farming relationships, not hunting deals. 🌱",
        "Adaptability is the top skill sought by employers in 2024. 🦎",
        "Public speaking is the number one fear for most people. 🎤",
        "Time management is actually energy management. ⚡",
        "Critical thinking allows you to analyze facts to form a judgment. 🧩"
    ];

    return (
        <div className="rounded-2xl bg-slate-800/40 border border-white/5 p-6 hover:bg-slate-800/60 transition-colors flex flex-col justify-center overflow-hidden relative group">
            <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="px-2 py-1 rounded bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} /> Tech & Finance Facts
                </span>
            </div>

            <div className="relative w-full overflow-hidden mask-linear-fade h-48 flex items-center">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-slate-900/0 md:from-slate-900/0 z-10" />
                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-900/0 md:from-slate-900/0 z-10" />

                <div
                    className="flex flex-col gap-3 animate-marquee will-change-transform"
                >
                    {/* Render fewer items to reduce DOM weight, but enough for a smooth loop */}
                    {[...facts, ...facts].map((fact, i) => (
                        <div key={i} className="p-3 bg-slate-800 border border-white/10 rounded-xl shadow-lg flex items-center gap-3 hover:bg-slate-700/50 transition-colors group/fact transform-gpu">
                            <span className="w-2 h-2 shrink-0 rounded-full bg-pink-500 group-hover/fact:scale-125 transition-transform" />
                            <span className="text-slate-200 text-sm font-medium leading-relaxed">{fact}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .mask-linear-fade {
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }
                
                @keyframes marquee {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }

                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                
                .will-change-transform {
                    will-change: transform;
                }

                /* Pause on hover for better UX and performance when reading */
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

// --- Trivia Component ---
export const QuickTriviaWidget: React.FC = () => {
    const [step, setStep] = useState<'question' | 'success' | 'fail'>('question');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const questions = [
        // --- Technology ---
        {
            q: "What does 'HTTP' stand for?",
            options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Process"],
            correct: 0
        },
        {
            q: "Which coding language is known for web styling?",
            options: ["Python", "CSS", "Java"],
            correct: 1
        },
        {
            q: "What is 'Phishing' in cybersecurity?",
            options: ["Fishing game", "A cyber attack via email", "Installing software"],
            correct: 1
        },
        {
            q: "Which component is the 'brain' of a computer?",
            options: ["Hard Drive", "RAM", "CPU"],
            correct: 2
        },
        {
            q: "What is a 'Blockchain'?",
            options: ["A metal chain", "A decentralized digital ledger", "A type of firewall"],
            correct: 1
        },

        // --- Finance ---
        {
            q: "What does 'ROI' stand for?",
            options: ["Rate of Inflation", "Return on Investment", "Risk of Investment"],
            correct: 1
        },
        {
            q: "What is the 'Rule of 72' used for?",
            options: ["Calculating inflation", "Estimating time to double money", "Retirement age"],
            correct: 1
        },
        {
            q: "Which is generally considered a low-risk investment?",
            options: ["Government Bonds", "Cryptocurrency", "Startups"],
            correct: 0
        },
        {
            q: "What is a 'Dividend'?",
            options: ["A tax payment", "A share of company profits", "A bank fee"],
            correct: 1
        },
        {
            q: "What happens during 'Inflation'?",
            options: ["Prices rise, money buys less", "Prices fall, money buys more", "Prices stay the same"],
            correct: 0
        },

        // --- Professional Skills ---
        {
            q: "What is the 'Pomodoro Technique'?",
            options: ["A cooking method", "A time management method", "A leadership style"],
            correct: 1
        },
        {
            q: "What does 'EQ' stand for?",
            options: ["Emotional Quotient", "Efficiency Quotient", "Energy Quality"],
            correct: 0
        },
        {
            q: "What is 'Active Listening'?",
            options: ["Listening while running", "Interrupting frequently", "Fully concentrating on the speaker"],
            correct: 2
        },
        {
            q: "What does the 'S' in SMART goals stand for?",
            options: ["Simple", "Specific", "Super"],
            correct: 1
        },
        {
            q: "Which skill is best for resolving conflict?",
            options: ["Empathy", "Aggression", "Ignoring it"],
            correct: 0
        }
    ];

    const currentTrivia = questions[currentQuestionIndex];

    const nextQuestion = () => {
        setStep('question');
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    };

    // Auto-advance if no attempt is made within 20 seconds
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'question') {
            timer = setTimeout(() => {
                nextQuestion();
            }, 20000);
        }
        return () => clearTimeout(timer);
    }, [currentQuestionIndex, step]);


    const handleAnswer = (idx: number) => {
        const isCorrect = idx === currentTrivia.correct;
        setStep(isCorrect ? 'success' : 'fail');

        if (isCorrect) {
            confetti({
                particleCount: 50,
                spread: 50,
                origin: { x: 0.7, y: 0.6 },
                colors: ['#10b981', '#34d399']
            });
        }

        // Auto-advance after 3 seconds for BOTH success and fail
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    };

    return (
        <div className="relative rounded-2xl bg-slate-800/40 border border-white/5 p-6 hover:bg-slate-800/60 transition-colors min-h-[220px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={64} />
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">Brain Teaser</span>
            </div>

            <AnimatePresence mode="wait">
                {step === 'question' && (
                    <motion.div
                        key={`q-${currentQuestionIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <p className="text-white font-bold mb-4 h-12 flex items-center">{currentTrivia.q}</p>
                        <div className="space-y-2">
                            {currentTrivia.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors border border-white/5 hover:border-emerald-500/30"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="s"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-black">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-green-400 mb-1">Correct!</h3>
                        <p className="text-slate-400 text-xs">+10 Knowledge Points</p>
                    </motion.div>
                )}

                {step === 'fail' && (
                    <motion.div
                        key="f"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
                            <X size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-red-400 mb-2">Oops!</h3>
                        <p className="text-slate-400 text-xs">Better luck next time!</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Daily Word Widget ---
export const DailyWordWidget: React.FC = () => {
    // List of words to cycle through
    const words = [
        { word: "Arbitrage", definition: "Buying in one market and simultaneously selling in another to profit from price differences.", type: "Finance" },
        { word: "Latency", definition: "The time delay between an action and its effect (crucial in gaming and trading).", type: "Tech" },
        { word: "Equity", definition: "Ownership interest in a company, usually in the form of stock.", type: "Finance" },
        { word: "Algorithm", definition: "A step-by-step set of operations to perform a calculation or solve a problem.", type: "Tech" },
        { word: "Networking", definition: "The process of interacting with others to exchange information and develop professional contacts.", type: "Professional" },
        { word: "Bull Market", definition: "A financial market of a group of securities in which prices are rising or are expected to rise.", type: "Finance" },
        { word: "Encryption", definition: "The process of converting information or data into a code, especially to prevent unauthorized access.", type: "Tech" },
        { word: "Empathy", definition: "The ability to understand and share the feelings of another.", type: "Professional" },
        { word: "Liquidity", definition: "How easily an asset can be converted into cash without affecting its market price.", type: "Finance" },
        { word: "API", definition: "Application Programming Interface - a set of functions allowing applications to access data and interact with external software components.", type: "Tech" }
    ];

    // Select a word based on the date to make it "Daily" but repetitive/cycling
    const dailyWord = React.useMemo(() => {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        return words[dayOfYear % words.length];
    }, []);

    return (
        <div className="rounded-2xl bg-slate-800/40 border border-white/5 p-6 hover:bg-slate-800/60 transition-colors flex flex-col justify-between min-h-[220px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={80} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1
                        ${dailyWord.type === 'Finance' ? 'bg-green-500/20 text-green-300' :
                            dailyWord.type === 'Tech' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-purple-500/20 text-purple-300'}`}>
                        <Sparkles size={12} /> Word of the Day
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{dailyWord.word}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    {dailyWord.definition}
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 relative z-10">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>{dailyWord.type}</span>
            </div>
        </div>
    );
};

// --- Easter Egg Robot ---
export const EasterEggRobot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Fun facts array
    const facts = [
        "Did you know? The first computer bug was an actual moth!",
        "Coding is just writing instructions for a rock to think!",
        "AI can't taste pizza... yet.",
        "Python is named after Monty Python, not the snake!",
        "The cloud is just someone else's computer."
    ];

    const [fact, setFact] = useState(facts[0]);

    const handleClick = () => {
        setFact(facts[Math.floor(Math.random() * facts.length)]);
        setIsOpen(true);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-16 left-0 w-64 p-4 bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-xl shadow-cyan-900/40 mb-2"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Curiosity Bot</span>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-slate-500 hover:text-white"><X size={14} /></button>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            {fact}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
                className="w-12 h-12 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-600/30 transition-colors"
                title="Click me for a fact!"
            >
                <Sparkles size={24} />
            </motion.button>
        </div>
    );
};

// --- Main Container for Dashboard Usage ---
export const StudentInteractiveZone: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-2 block">
                        Fun Zone
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Knowledge</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DailyChallengeWidget />
                    <FactsMarqueeWidget />
                    <QuickTriviaWidget />
                    <DailyWordWidget />
                </div>
            </div>
        </section>
    );
};
