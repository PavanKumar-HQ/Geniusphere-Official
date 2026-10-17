import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import {
    Play, CheckCircle, Lock, Menu, ChevronLeft, Award,
    Download, Clock, AlertCircle, FileText, Youtube, Zap, X
} from 'lucide-react';
import { Course, CourseModule } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { InteractiveLearning } from './InteractiveLearning';
import { CybersecurityLab } from './cybersecurity/CybersecurityLab';
import { UniversalLab } from './lab/UniversalLab';
import { LAB_CONFIGS } from './lab/LabData';

const motion = motionBase as any;

interface CoursePlayerProps {
    course: Course;
    onExit: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onExit }) => {
    // Load initial state from localStorage if available
    const [currentModuleId, setCurrentModuleId] = useState<string>(() => {
        const saved = localStorage.getItem(`geniusphere_last_module_${course.course_id}`);
        return saved || course.modules?.[0]?.id || "";
    });

    const [progress, setProgress] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem(`geniusphere_progress_${course.course_id}`);
        return saved ? JSON.parse(saved) : {};
    });
    const [viewState, setViewState] = useState<'video' | 'quiz' | 'certificate' | 'simulation'>('video');
    const [isVideoCompleted, setIsVideoCompleted] = useState(false);

    // Quiz State
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizScore, setQuizScore] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>((course.quiz?.timeLimit || 30) * 60);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Certificate State
    const [studentName, setStudentName] = useState("");
    const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

    // Reset feedback on module change
    useEffect(() => {
        setFeedback(null);
    }, [currentModuleId]);

    const activeModule = course.modules?.find(m => m.id === currentModuleId);
    const activeModuleIndex = course.modules?.findIndex(m => m.id === currentModuleId) || 0;

    const allModulesWatched = course.modules?.every(m => progress[m.id]);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(`geniusphere_progress_${course.course_id}`, JSON.stringify(progress));
    }, [progress, course.course_id]);

    // Save current module to localStorage whenever it changes (Resume learning)
    useEffect(() => {
        if (currentModuleId) {
            localStorage.setItem(`geniusphere_last_module_${course.course_id}`, currentModuleId);
        }
    }, [currentModuleId, course.course_id]);

    // Reset video completion state when changing modules
    useEffect(() => {
        // If the module is already marked as watched in our persisted progress, 
        // we can consider the video "completed" so the user doesn't have to watch it again.
        if (progress[currentModuleId]) {
            setIsVideoCompleted(true);
        } else {
            setIsVideoCompleted(false);
        }
    }, [currentModuleId, progress]);

    // Quiz Timer
    useEffect(() => {
        let timer: any;
        if (isQuizActive && timeLeft > 0 && quizScore === null) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isQuizActive) {
            handleQuizSubmit(); // Auto submit
        }
        return () => clearInterval(timer);
    }, [isQuizActive, timeLeft, quizScore]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s} `;
    };

    const handleVideoEnded = () => {
        setIsVideoCompleted(true);
    };

    const handleMarkWatched = () => {
        if (!activeModule) return;
        setProgress(prev => ({ ...prev, [activeModule.id]: true }));

        // Auto advance if next exists
        const nextIndex = activeModuleIndex + 1;
        if (course.modules && nextIndex < course.modules.length) {
            setCurrentModuleId(course.modules[nextIndex].id);
        }
    };

    const startQuiz = () => {
        setIsQuizActive(true);
        setTimeLeft((course.quiz?.timeLimit || 30) * 60);
    }

    const handleQuizSubmit = () => {
        if (!course.quiz) return;
        setIsQuizActive(false);
        let correct = 0;
        course.quiz.questions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctIndex) correct++;
        });
        const score = (correct / course.quiz.questions.length) * 100;
        setQuizScore(score);
        if (score >= course.quiz.passThreshold) {
            setTimeout(() => setViewState('certificate'), 2000);
        }
    };

    const handleDownloadCertificate = () => {
        if (!studentName) {
            alert("Please enter your full name for the certificate.");
            return;
        }
        alert(`Generating PDF Certificate for ${studentName}... (Simulated Download)`);
    };

    const renderVideoPlayer = () => {
        const isSimulationModule = activeModuleIndex === (course.modules?.length || 0) - 1 || activeModuleIndex === 10;

        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                            {activeModule && (
                                <VideoPlayer
                                    url={activeModule.videoUrl}
                                    playing={false}
                                    onEnded={handleVideoEnded}
                                />
                            )}
                            {!activeModule && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                    Select a module to begin
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="w-full md:w-auto">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <span className="text-xs font-bold bg-blue-600/20 text-blue-400 px-2 py-1 rounded whitespace-nowrap">Module {activeModuleIndex + 1}</span>
                                    <h2 className="text-xl md:text-2xl font-bold text-white">{activeModule?.title}</h2>
                                </div>
                                <p className="text-slate-400 text-sm md:text-base">{activeModule?.description}</p>
                            </div>
                            <div className="flex flex-col items-stretch md:items-end gap-2 w-full md:w-auto shrink-0">
                                <button
                                    onClick={handleMarkWatched}
                                    disabled={progress[currentModuleId] || !isVideoCompleted}
                                    className={`px - 6 py - 3 rounded - xl font - bold flex items - center gap - 2 transition - all w - full md: w - auto justify - center ${progress[currentModuleId]
                                        ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30'
                                        : isVideoCompleted
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 opacity-50'
                                        } `}
                                    title={!isVideoCompleted && !progress[currentModuleId] ? "Watch full video to unlock" : ""}
                                >
                                    {progress[currentModuleId] ? <><CheckCircle size={20} /> Completed</> : isVideoCompleted ? "Mark as Watched" : <><Lock size={16} /> Locked</>}
                                </button>

                                {/* Persistent Simulation Button */}
                                {course.simulationId && (
                                    <button
                                        onClick={() => setViewState('simulation')}
                                        className="px-6 py-2 rounded-xl font-bold flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all w-full md:w-auto justify-center"
                                    >
                                        <Zap size={16} /> Lab
                                    </button>
                                )}

                                {!isVideoCompleted && !progress[currentModuleId] && (
                                    <span className="text-[10px] text-orange-400 flex items-center justify-center md:justify-end gap-1"><AlertCircle size={10} /> Finish video to continue</span>
                                )}
                            </div>
                        </div>

                        {/* Special Section for Simulation Module */}
                        {isSimulationModule && (
                            <div className={`p-6 rounded-2xl border animate-pulse-slow ${course.simulationId === 'cyber-lab' ? 'bg-gradient-to-r from-red-900/40 to-slate-900/40 border-red-500/30' : 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30'}`}>
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Zap size={20} className={course.simulationId === 'cyber-lab' ? "text-red-400" : "text-yellow-400"} />
                                    {course.simulationId === 'cyber-lab' ? 'Interactive Cyber Lab' : 'Interactive Particle Simulation'}
                                </h3>
                                <p className="text-slate-300 text-sm mb-4">
                                    {course.simulationId === 'cyber-lab'
                                        ? 'Enter the secure environment to practice defense against real-world cyber threats.'
                                        : 'Engage with the practical concepts through our real-time particle simulation lab.'}
                                </p>
                                <button
                                    onClick={() => setViewState('simulation')}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg flex items-center gap-2 hover:scale-105 transform duration-200"
                                >
                                    {course.simulationId === 'cyber-lab' ? 'Enter Lab' : 'Launch Simulation'} <Play size={16} fill="black" />
                                </button>
                            </div>
                        )}

                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-cyan-400" /> Video Notes & Summary</h3>
                            <div className="prose prose-invert max-w-none text-slate-300">
                                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                    {activeModule?.contentMarkdown || "No additional notes for this module."}
                                </div>
                            </div>
                        </div>

                        {/* Feedback Widget */}
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-slate-900/40 rounded-xl border border-white/5 backdrop-blur-sm gap-3 sm:gap-0">
                            <span className="text-sm text-slate-400 font-medium">Was this lesson helpful?</span>
                            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                                <button
                                    onClick={() => setFeedback('like')}
                                    className={`flex-1 sm:flex-none justify-center p-2 px-3 rounded-lg transition-all flex items-center gap-2 text-sm font-bold ${feedback === 'like' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'hover:bg-white/5 text-slate-500 hover:text-white border border-transparent'}`}
                                >
                                    👍 Yes
                                </button>
                                <button
                                    onClick={() => setFeedback('dislike')}
                                    className={`flex-1 sm:flex-none justify-center p-2 px-3 rounded-lg transition-all flex items-center gap-2 text-sm font-bold ${feedback === 'dislike' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'hover:bg-white/5 text-slate-500 hover:text-white border border-transparent'}`}
                                >
                                    👎 No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderQuiz = () => (
        <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar flex justify-center">
            <div className="max-w-2xl w-full space-y-8 pb-10">
                <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-purple-500/10 mb-4">
                        <Award size={32} className="text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Final Certification Exam</h2>
                    <p className="text-slate-400">Score at least {course.quiz?.passThreshold}% to earn your certificate.</p>
                </div>

                {!isQuizActive && quizScore === null ? (
                    <div className="bg-slate-900/60 p-8 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl mb-4">⏱️</div>
                        <h3 className="text-xl font-bold text-white mb-2">Time Limit: {course.quiz?.timeLimit || 30} Minutes</h3>
                        <p className="text-slate-400 mb-6">Once you start, the timer will begin. Good luck!</p>
                        <button
                            onClick={startQuiz}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            Start Exam Now
                        </button>
                    </div>
                ) : (
                    <>
                        {isQuizActive && (
                            <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex justify-between items-center mb-6 shadow-xl">
                                <span className="text-slate-400 font-bold">Exam in Progress</span>
                                <div className={`flex items - center gap - 2 font - mono text - xl font - bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-green-400'} `}>
                                    <Clock size={20} /> {formatTime(timeLeft)}
                                </div>
                            </div>
                        )}

                        {course.quiz?.questions.map((q, idx) => (
                            <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 shadow-sm">
                                <p className="text-white font-semibold mb-4 text-lg">
                                    <span className="text-slate-500 mr-2">{idx + 1}.</span>
                                    {q.text}
                                </p>
                                <div className="space-y-2">
                                    {q.options.map((opt, optIdx) => (
                                        <button
                                            key={optIdx}
                                            disabled={quizScore !== null}
                                            onClick={() => !quizScore && setQuizAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                                            className={`w-full text-left p-4 rounded-xl border transition-all relative ${quizAnswers[idx] === optIdx
                                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                                : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'
                                                } ${quizScore !== null && q.correctIndex === optIdx ? 'bg-green-500/20 border-green-500 !text-green-400' : ''}
                                            ${quizScore !== null && quizAnswers[idx] === optIdx && q.correctIndex !== optIdx ? 'bg-red-500/20 border-red-500 !text-red-400' : ''}`}
                                        >
                                            <span className="font-mono font-bold opacity-50 mr-2">Option {String.fromCharCode(65 + optIdx)}:</span> {opt}
                                            {quizScore !== null && q.correctIndex === optIdx && (
                                                <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {quizScore === null ? (
                            <button
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(quizAnswers).length < (course.quiz?.questions.length || 0)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/20 transition-all text-lg"
                            >
                                Submit Exam
                            </button>
                        ) : (
                            <div className={`p - 8 rounded - 2xl text - center border - 2 ${quizScore >= (course.quiz?.passThreshold || 70) ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'} `}>
                                <h3 className={`text - 3xl font - bold mb - 2 ${quizScore >= (course.quiz?.passThreshold || 70) ? 'text-green-400' : 'text-red-400'} `}>
                                    You Scored {quizScore.toFixed(0)}%
                                </h3>
                                <p className="text-slate-300 mb-6">
                                    {quizScore >= (course.quiz?.passThreshold || 70)
                                        ? "Congratulations! You have passed the exam."
                                        : "You didn't reach the passing threshold. Don't worry, we've analyzed your results."}
                                </p>

                                {/* Adaptive Learning Path */}
                                {quizScore < (course.quiz?.passThreshold || 70) && (
                                    <div className="max-w-md mx-auto bg-slate-800/50 p-4 rounded-xl border border-blue-500/30 mb-6 text-left">
                                        <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm uppercase tracking-wider">
                                            <Zap size={14} /> AI Recommendation
                                        </div>
                                        <p className="text-slate-300 text-sm mb-3">Based on your answers, we recommend reviewing <strong>Module 2: {course.modules?.[1]?.title || "Core Concepts"}</strong> before retaking the exam.</p>
                                        <button
                                            onClick={() => {
                                                setViewState('video');
                                                setCurrentModuleId(course.modules?.[1]?.id || course.modules?.[0]?.id || "");
                                            }}
                                            className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold rounded-lg text-sm border border-blue-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Play size={14} /> Go to Recommended Module
                                        </button>
                                    </div>
                                )}

                                {quizScore < (course.quiz?.passThreshold || 70) && (
                                    <button onClick={() => { setQuizScore(null); setQuizAnswers({}); setIsQuizActive(false); }} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
                                        Retake Exam
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    const renderCertificate = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-y-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border-4 double border-yellow-500 p-8 md:p-12 rounded-xl max-w-3xl w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden my-auto"
            >
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-yellow-500 m-4" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-yellow-500 m-4" />

                <Award size={64} className="text-yellow-400 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Certificate of Completion</h1>
                <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm">Geniusphere Academy Verified</p>

                <p className="text-slate-300 mb-2">This is to certify that</p>

                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter Your Full Name"
                    className="w-full max-w-md mx-auto bg-transparent border-b-2 border-slate-600 text-center text-3xl font-serif text-white focus:border-yellow-500 outline-none placeholder-slate-600 py-2 mb-8"
                />

                <p className="text-slate-300 mb-4">has successfully completed the course</p>

                <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-12 inline-block max-w-xl">
                    {course.title}
                </h2>

                <div className="flex justify-between items-end mt-8 px-4 md:px-12 gap-8">
                    <div className="text-left">
                        <div className="w-32 md:w-48 border-b border-slate-600 mb-2 pb-1 font-['cursive'] text-xl text-white">Geniusphere</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Lead Instructor</div>
                    </div>
                    <div className="w-16 h-16 md:w-24 md:h-24 opacity-80">
                        <img src="/images/geniusphere-seal.jpg" className="w-full h-full object-contain opacity-90" alt="Geniusphere Seal" />
                    </div>
                    <div className="text-right">
                        <div className="w-32 md:w-48 border-b border-slate-600 mb-2 pb-1 text-white">{new Date().toLocaleDateString()}</div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Date Issued</div>
                    </div>
                </div>
            </motion.div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={handleDownloadCertificate}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                    <Download size={18} /> Download PDF
                </button>
                <button
                    onClick={onExit}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full flex items-center gap-2 transition-all"
                >
                    Back to Catalog
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar (Responsive) */}
            {/* Sidebar (Responsive) */}
            <div className={`w-full md:w-96 bg-slate-900 border-r border-white/10 flex flex-col transition-all duration-300 z-50 ${isMobileMenuOpen ? 'h-full absolute inset-0 md:static md:h-auto' : 'h-auto shrink-0 md:h-full'}`}>
                <div className="p-4 md:p-6 border-b border-white/10 bg-slate-950 shrink-0">
                    {/* Top Row: Mobile Navbar / Desktop Back Link */}
                    <div className="flex justify-between items-center md:block">
                        <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider">
                            <ChevronLeft size={16} /> <span className="hidden md:inline">Back to Dashboard</span>
                        </button>

                        {/* Mobile Title (Compact) */}
                        <span className="md:hidden font-bold text-white text-sm truncate mx-4 flex-1 text-center">
                            {course.title}
                        </span>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-white bg-slate-800 rounded-lg hover:bg-slate-700"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Extended Info: Desktop Always / Mobile Open Only */}
                    <div className={`mt-4 md:mt-4 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                        <h1 className="hidden md:block font-bold text-xl leading-tight text-white mb-2">{course.title}</h1>

                        {/* Mobile Full Title (if needed extra context when open, optional, skipping to avoid duplication) */}
                        {isMobileMenuOpen && (
                            <h1 className="md:hidden font-bold text-lg leading-tight text-white mb-2 text-center">{course.title}</h1>
                        )}

                        <div className="flex items-center gap-2 text-xs text-slate-400 md:justify-start justify-center">
                            <Clock size={12} />
                            {course.duration && !course.duration.toLowerCase().includes('modules') && (
                                <>
                                    <span>{course.duration}</span>
                                    <span>•</span>
                                </>
                            )}
                            <span>{course.modules?.length} Modules</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                style={{ width: `${(Object.keys(progress).length / (course.modules?.length || 1)) * 100}% ` }}
                            />
                        </div>
                        <div className="text-right text-xs text-cyan-400 mt-1 font-bold">
                            {Math.round((Object.keys(progress).length / (course.modules?.length || 1)) * 100)}% Complete
                        </div>
                    </div>
                </div>

                {/* Module List & Content */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 ${isMobileMenuOpen ? 'block' : 'hidden md:block'} `}>
                    {course.modules?.map((mod, idx) => (
                        <button
                            key={mod.id}
                            onClick={() => {
                                setViewState('video');
                                setCurrentModuleId(mod.id);
                                setIsMobileMenuOpen(false); // Close menu on selection
                            }}
                            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-all flex gap-3 group relative ${currentModuleId === mod.id ? 'bg-blue-600/10' : ''
                                }`}
                        >
                            {/* Active Indicator Strip */}
                            {currentModuleId === mod.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}

                            <div className="mt-1 shrink-0">
                                {progress[mod.id]
                                    ? (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        >
                                            <CheckCircle size={18} className="text-green-500" />
                                        </motion.div>
                                    )
                                    : <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${currentModuleId === mod.id ? 'border-blue-400' : 'border-slate-600'}`}>
                                        <span className={`text-[10px] font-bold ${currentModuleId === mod.id ? 'text-blue-400' : 'text-slate-500'}`}>{idx + 1}</span>
                                    </div>
                                }
                            </div>
                            <div>
                                <div className={`text-sm font-medium ${currentModuleId === mod.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    {mod.title}
                                </div>
                                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 group-hover:text-slate-500">
                                    <Clock size={10} /> {mod.duration}
                                </div>
                                {(idx === 10 || idx === (course.modules?.length || 0) - 1) && <span className="text-[10px] text-purple-400 mt-1 block">★ Particle Simulation</span>}
                            </div>
                        </button>
                    ))}

                    <button
                        disabled={!allModulesWatched}
                        onClick={() => { setViewState('quiz'); setIsMobileMenuOpen(false); }}
                        className={`w-full text-left p-4 flex gap-3 border-t border-white/10 ${viewState === 'quiz' || viewState === 'certificate' ? 'bg-purple-600/10' : ''
                            } ${!allModulesWatched ? 'opacity-50 cursor-not-allowed bg-slate-950/50' : 'hover:bg-purple-500/5 cursor-pointer bg-slate-950'}`}
                    >
                        {viewState === 'quiz' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />}
                        <div className="mt-1">
                            {allModulesWatched ? <Award size={18} className="text-purple-400" /> : <Lock size={18} className="text-slate-600" />}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Final Certification Exam</div>
                            <div className="text-xs text-slate-500 mt-1">
                                {allModulesWatched ? "Ready to start" : "Unlock by completing all modules"}
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-black flex flex-col h-full overflow-hidden relative">
                {viewState === 'video' && renderVideoPlayer()}
                {viewState === 'quiz' && renderQuiz()}
                {viewState === 'certificate' && renderCertificate()}
                {viewState === 'simulation' && (
                    <div className="fixed inset-0 z-[70] bg-black">
                        {(() => {
                            // 1. Specific legacy Cyber Lab
                            if (course.simulationId === 'cyber-lab') {
                                return <CybersecurityLab onClose={() => setViewState('video')} />;
                            }

                            // 2. Use Universal Lab System via InteractiveLearning (handles both overrides and template)
                            return (
                                <InteractiveLearning
                                    simulationId={course.simulationId || 'default'}
                                    onClose={() => setViewState('video')}
                                    onNavigate={() => { }}
                                />
                            );
                        })()}
                    </div>
                )}
            </div>
        </div >
    );
};