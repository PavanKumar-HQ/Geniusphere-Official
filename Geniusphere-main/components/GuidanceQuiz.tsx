import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, X, Sparkles, AlertCircle } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    type: 'single' | 'multiple' | 'input' | 'info';
    options?: string[];
    inputs?: { label: string; key: string; placeholder: string }[];
    explanation?: string; // Why we ask this
    key: string; // Internal key to map answers
}

const QUESTIONS: Question[] = [
    {
        id: 0,
        text: "Let's get to know you",
        type: 'input',
        inputs: [
            { label: "Full Name", key: "name", placeholder: "e.g. Alex Johnson" },
            { label: "Class / Role", key: "role_detail", placeholder: "e.g. 12th Grade, B.Tech CS, etc." },
        ],
        explanation: "We'll personalize your dashboard with this",
        key: 'basic_info'
    },
    {
        id: 1,
        text: "Here is what you can do:",
        type: 'info',
        explanation: "I'll guide you through our powerful features.",
        key: 'platform_tour'
    },
    {
        id: 2,
        text: "Tell us about yourself",
        type: 'single',
        options: ["College Student", "Working Professional", "Entrepreneur", "Lifelong Learner"],
        explanation: "Helps us tailor content to your career stage",
        key: 'profile'
    },
    {
        id: 3,
        text: "Which areas interest you most?",
        type: 'multiple',
        options: [
            "AI & Future Technology",
            "Finance & Wealth Management",
            "Leadership & Soft Skills",
            "Startup & Business Strategy"
        ],
        explanation: "We'll recommend courses based on this",
        key: 'interests'
    },
    {
        id: 4,
        text: "What is your primary goal?",
        type: 'single',
        options: [
            "Land a High-Paying Job",
            "Build a Startup / Business",
            "Manage Personal Wealth",
            "Personal Growth & Upskilling"
        ],
        explanation: "Aligns your learning path to your objective",
        key: 'goal'
    },
    {
        id: 5,
        text: "How would you rate your experience?",
        type: 'single',
        options: ["Complete Beginner", "Have some basics", "Intermediate / Advanced"],
        explanation: "Determines course difficulty level",
        key: 'experience'
    },
    {
        id: 6,
        text: "Weekly time commitment?",
        type: 'single',
        options: ["Less than 2 hours", "2 - 5 hours", "5+ hours"],
        explanation: "Helps us suggest a realistic pace",
        key: 'timeCommitment'
    }
];

interface GuidanceQuizProps {
    onClose: () => void;
    onComplete: (answers: any) => void;
}

export const GuidanceQuiz: React.FC<GuidanceQuizProps> = ({ onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [direction, setDirection] = useState(1);

    const question = QUESTIONS[currentStep];

    const handleSelect = (option: string) => {
        if (question.type === 'single') {
            setAnswers({ ...answers, [question.key]: option });
            // Auto advance for single choice after small delay
            setTimeout(() => handleNext(), 500);
        } else {
            // Multiple choice toggle
            const current = answers[question.key] || [];
            if (current.includes(option)) {
                setAnswers({ ...answers, [question.key]: current.filter((i: string) => i !== option) });
            } else {
                setAnswers({ ...answers, [question.key]: [...current, option] });
            }
        }
    };

    const handleInputChange = (fieldKey: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    const handleNext = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(answers);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

    // Check if answered based on type
    let isAnswered = false;
    if (question.type === 'input') {
        // All inputs must have a value
        isAnswered = question.inputs?.every(input => answers[input.key] && answers[input.key].trim() !== '') || false;
    } else if (question.type === 'info') {
        isAnswered = true;
    } else {
        isAnswered = answers[question.key] && (Array.isArray(answers[question.key]) ? answers[question.key].length > 0 : true);
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl sm:items-center items-end">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 relative overflow-hidden">
                            <img
                                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Astronaut.png"
                                alt="Astra Guide"
                                className="w-8 h-8 sm:w-10 sm:h-10 object-contain hover:scale-110 transition-transform"
                            />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-base sm:text-lg">
                                {answers['name'] ? `Welcome, ${answers['name']}! 👋` : "Hi! I'm Genius."}
                            </h2>
                            <p className="text-[10px] sm:text-xs text-slate-400">
                                {answers['name'] ? "I'm Genius, your personal guide." : "Let's set up your profile together!"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-800 shrink-0">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    />
                </div>

                {/* Scrollable Content */}
                <div className="p-5 sm:p-10 flex-1 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            initial={{ x: direction * 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction * -50, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex-1"
                        >
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">Question {currentStep + 1} of {QUESTIONS.length}</span>
                            <h3 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">{question.text}</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm mb-6 bg-slate-800/50 p-2 rounded-lg inline-flex">
                                <AlertCircle size={14} />
                                {question.explanation}
                            </div>

                            {question.type === 'input' ? (
                                <div className="space-y-4 sm:space-y-6">
                                    {question.inputs?.map((input) => (
                                        <div key={input.key}>
                                            <label className="block text-sm font-bold text-slate-400 mb-2">{input.label}</label>
                                            <input
                                                type="text"
                                                placeholder={input.placeholder}
                                                value={answers[input.key] || ''}
                                                onChange={(e) => handleInputChange(input.key, e.target.value)}
                                                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 sm:p-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm sm:text-base"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : question.type === 'info' ? (
                                <div className="space-y-3">
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex gap-4 items-center hover:bg-slate-800 transition-colors">
                                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-2xl border border-purple-500/20">⚡</div>
                                        <div>
                                            <h4 className="font-bold text-white">Interactive Courses</h4>
                                            <p className="text-xs sm:text-sm text-slate-400">Byte-sized lessons with quizzes & rewards.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex gap-4 items-center hover:bg-slate-800 transition-colors">
                                        <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-2xl border border-cyan-500/20">🧪</div>
                                        <div>
                                            <h4 className="font-bold text-white">Simulation Labs</h4>
                                            <p className="text-xs sm:text-sm text-slate-400">Virtual 3D environments to practice skills.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex gap-4 items-center hover:bg-slate-800 transition-colors">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-2xl border border-green-500/20">🚀</div>
                                        <div>
                                            <h4 className="font-bold text-white">Career Dashboard</h4>
                                            <p className="text-xs sm:text-sm text-slate-400">Track progress, build resume & find jobs.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                                    {question.options?.map((option) => {
                                        const isSelected = Array.isArray(answers[question.key])
                                            ? answers[question.key].includes(option)
                                            : answers[question.key] === option;

                                        return (
                                            <button
                                                key={option}
                                                onClick={() => handleSelect(option)}
                                                className={`p-4 rounded-xl text-left border transition-all relative group ${isSelected
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
                                                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={`font-medium text-sm sm:text-base ${isSelected ? 'font-bold' : ''}`}>{option}</span>
                                                    {isSelected && <div className="bg-white rounded-full p-0.5"><Check size={14} className="text-blue-600" /></div>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-5 sm:p-6 border-t border-white/5 flex justify-between items-center bg-slate-900 shrink-0">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`text-slate-400 hover:text-white transition-colors text-sm font-medium px-2 py-2 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        Back
                    </button>

                    {(question.type === 'info' || question.type === 'multiple' || question.type === 'input' || (question.type === 'single' && isAnswered)) && (
                        <button
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className={`px-6 sm:px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-sm sm:text-base ${isAnswered
                                ? 'bg-white text-black hover:scale-105 shadow-xl'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {question.type === 'info' ? 'Continue' : (currentStep === QUESTIONS.length - 1 ? 'Find My Path' : 'Next')} <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
