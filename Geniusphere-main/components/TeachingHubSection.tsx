
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Folder, Copy, ExternalLink, ChevronRight, XCircle, CheckCircle2, Lightbulb, X, Check, AlertCircle, ArrowRight, Beaker } from 'lucide-react';
import { TEACHING_TIPS, TEACHER_PROMPTS, STUDENT_GUIDANCE, CLASSROOM_MANAGEMENT, DIGITAL_TOOLS, ASSESSMENT_STRATEGIES, CLARITY_DATA, INCLUSIVE_TEACHING, STUDENT_MOTIVATION, COMMUNICATION_SKILLS, PROJECT_BASED_LEARNING } from './TeacherResources';
import { UniversalLab } from './lab/UniversalLab';

type SimulationOption = {
    text: string;
    result: 'correct' | 'partial' | 'missed';
    feedback: string;
};

type ResourceItem = {
    title: string;
    category: string;
    description: string;
    icon: React.ComponentType<{ size?: number }>;
    color: string;
    link?: string;
    details?: {
        overview: string;
        keyPoints: string[];
        simulation: {
            title: string;
            scenario: string;
            options: SimulationOption[];
        };
    };
};

const FOLDER_CONFIG = [
    { id: 'pedagogy', title: 'Modern Pedagogy', description: 'Strategies for effective teaching and student engagement.', color: 'blue', data: TEACHING_TIPS },
    { id: 'prompts', title: 'AI Prompt Library', description: 'Curated AI prompts for lesson planning and more.', color: 'purple', data: null },
    { id: 'management', title: 'Classroom Management', description: 'Behavior strategies, transitions, and time management.', color: 'pink', data: CLASSROOM_MANAGEMENT },
    { id: 'tools', title: 'Digital Tools', description: 'Modern EdTech tools to enhance your teaching.', color: 'cyan', data: DIGITAL_TOOLS },
    { id: 'assessment', title: 'Assessment Strategies', description: 'Formative and summative assessment techniques.', color: 'green', data: ASSESSMENT_STRATEGIES },
    { id: 'inclusive', title: 'Inclusive Teaching', description: 'UDL, cultural responsiveness, neurodiversity, and accessibility.', color: 'indigo', data: INCLUSIVE_TEACHING },
    { id: 'motivation', title: 'Student Motivation', description: 'Growth mindset, intrinsic motivation, and goal-setting frameworks.', color: 'rose', data: STUDENT_MOTIVATION },
    { id: 'communication', title: 'Communication Skills', description: 'Active listening, effective feedback, and parent conferences.', color: 'amber', data: COMMUNICATION_SKILLS },
    { id: 'pbl', title: 'Project-Based Learning', description: 'Driving questions, scaffolded autonomy, and authentic assessment.', color: 'teal', data: PROJECT_BASED_LEARNING },
    { id: 'guidance', title: 'Student Guidance & Clarity', description: 'Common confusions, myths, and platform FAQs for students.', color: 'emerald', data: null },
];

const getFolderTitle = (id: string) => FOLDER_CONFIG.find(f => f.id === id)?.title || '';

// Map folder IDs to lab simulation IDs
const FOLDER_LAB_MAP: Record<string, string> = {
    'pedagogy': 'lab_pedagogy',
    'management': 'lab_management',
    'inclusive': 'lab_inclusive',
    'motivation': 'lab_motivation',
    'communication': 'lab_communication',
    'pbl': 'lab_pbl',
    'assessment': 'lab_assessment',
    'tools': 'lab_tools',
};

// Detail Modal Component
const DetailModal = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleOptionClick = (index: number) => {
        setSelectedOption(index);
        setShowFeedback(true);
    };

    const resetSimulation = () => {
        setSelectedOption(null);
        setShowFeedback(false);
    };

    const getResultColor = (result: string) => {
        switch (result) {
            case 'correct': return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
            case 'partial': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            case 'missed': return 'bg-red-500/20 border-red-500/50 text-red-400';
            default: return '';
        }
    };

    const getResultIcon = (result: string) => {
        switch (result) {
            case 'correct': return <Check size={20} />;
            case 'partial': return <AlertCircle size={20} />;
            case 'missed': return <XCircle size={20} />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                            <item.icon size={28} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.category}</p>
                            <h2 className="text-2xl font-bold text-white">{item.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Overview */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Lightbulb size={18} className="text-yellow-400" />
                            Overview
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            {item.details?.overview || item.description}
                        </p>
                    </section>

                    {/* Key Points */}
                    {item.details?.keyPoints && (
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-400" />
                                Key Points
                            </h3>
                            <div className="space-y-3">
                                {item.details.keyPoints.map((point, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-3 p-4 bg-slate-800/50 border border-white/5 rounded-xl"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-emerald-400 text-xs font-bold">{idx + 1}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Interactive Simulation */}
                    {item.details?.simulation && (
                        <section className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <ArrowRight size={18} className="text-purple-400" />
                                {item.details.simulation.title}
                            </h3>
                            <p className="text-slate-300 mb-6 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                <span className="text-purple-400 font-bold">Scenario: </span>
                                {item.details.simulation.scenario}
                            </p>

                            <div className="space-y-3">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">What would you do?</p>
                                {item.details.simulation.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => !showFeedback && handleOptionClick(idx)}
                                        disabled={showFeedback}
                                        className={`w-full p-4 text-left rounded-xl border transition-all ${showFeedback && selectedOption === idx
                                            ? getResultColor(option.result)
                                            : showFeedback
                                                ? 'bg-slate-800/30 border-white/5 text-slate-500'
                                                : 'bg-slate-800/50 border-white/10 text-slate-200 hover:bg-slate-800 hover:border-white/20 cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${showFeedback && selectedOption === idx
                                                ? 'bg-current/20'
                                                : 'bg-white/10'
                                                }`}>
                                                {showFeedback && selectedOption === idx
                                                    ? getResultIcon(option.result)
                                                    : <span className="text-xs font-bold">{String.fromCharCode(65 + idx)}</span>
                                                }
                                            </div>
                                            <span className="text-sm">{option.text}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Feedback */}
                            <AnimatePresence>
                                {showFeedback && selectedOption !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="mt-6 p-5 rounded-xl bg-slate-900/80 border border-white/10"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.details!.simulation.options[selectedOption].result === 'correct' ? 'bg-emerald-500/20 text-emerald-400' :
                                                item.details!.simulation.options[selectedOption].result === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {getResultIcon(item.details!.simulation.options[selectedOption].result)}
                                            </div>
                                            <div>
                                                <p className={`font-bold mb-1 ${item.details!.simulation.options[selectedOption].result === 'correct' ? 'text-emerald-400' :
                                                    item.details!.simulation.options[selectedOption].result === 'partial' ? 'text-yellow-400' :
                                                        'text-red-400'
                                                    }`}>
                                                    {item.details!.simulation.options[selectedOption].result === 'correct' ? 'Excellent Choice!' :
                                                        item.details!.simulation.options[selectedOption].result === 'partial' ? 'Partially Effective' :
                                                            'Not Recommended'}
                                                </p>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    {item.details!.simulation.options[selectedOption].feedback}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={resetSimulation}
                                            className="mt-4 px-4 py-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            Try Again →
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const TeachingHubSection = () => {
    const [activeHubFolder, setActiveHubFolder] = useState<string | null>(null);
    const [activePromptCategory, setActivePromptCategory] = useState<string>(TEACHER_PROMPTS[0].category);
    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
    const [activeGuidanceTab, setActiveGuidanceTab] = useState<'guidance' | 'clarity'>('guidance');
    const [activeClarityCategory, setActiveClarityCategory] = useState<string>(CLARITY_DATA[0].category);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [activeLab, setActiveLab] = useState<string | null>(null);

    // Handle Browser Back Navigation
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const state = event.state;
            // Close Lab if open (and state says so, or just fallback to state source of truth)
            if (state?.lab) {
                setActiveLab(state.lab);
            } else {
                setActiveLab(null);
            }

            // Sync Folder
            if (state?.folder) {
                setActiveHubFolder(state.folder);
            } else {
                setActiveHubFolder(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigateToFolder = (id: string) => {
        window.history.pushState({ folder: id }, '', `#${id}`);
        setActiveHubFolder(id);
    };

    const navigateToLab = (id: string) => {
        // Maintain folder state in history
        window.history.pushState({ folder: activeHubFolder, lab: id }, '', `#lab-${id}`);
        setActiveLab(id);
    };

    const closeLab = () => {
        window.history.back();
        // fallback in case history stack is weird? 
        // Ideally back() triggers popstate which sets activeLab(null)
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleCopyPrompt = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedPrompt(text);
        setTimeout(() => setCopiedPrompt(null), 2000);
    };

    const renderResourceCards = (data: any[]) => (
        <motion.div
            key="resource-cards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {data.map((item: any, i: number) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => item.details ? setSelectedItem(item) : undefined}
                    className={`p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 hover:border-white/10 transition-all group ${item.details ? 'cursor-pointer' : ''}`}
                >
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon size={24} />
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{item.category}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    {item.details && (
                        <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm font-medium">
                            <span>View Details & Simulation</span>
                            <ArrowRight size={14} />
                        </div>
                    )}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Visit Tool <ExternalLink size={14} />
                        </a>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );

    const activeCategory = CLARITY_DATA.find(c => c.category === activeClarityCategory);

    return (
        <motion.div key="teaching-hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {activeHubFolder ? (
                        <>
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-lg transition-all text-slate-300 hover:text-white group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-bold">Back</span>
                            </button>
                            <div className="h-6 w-px bg-white/10 mx-1"></div>
                            {getFolderTitle(activeHubFolder)}
                        </>
                    ) : (
                        'Teaching Enhancement Hub'
                    )}
                </h2>
            </div>

            <AnimatePresence mode="wait">
                {!activeHubFolder && (
                    <motion.div
                        key="folders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {FOLDER_CONFIG.map((folder, i) => (
                            <motion.div
                                key={folder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigateToFolder(folder.id)}
                                className={`group p-6 bg-slate-800/40 border border-white/5 rounded-2xl cursor-pointer hover:bg-slate-800/60 hover:border-${folder.color}-500/30 transition-all`}
                            >
                                <div className={`w-12 h-12 bg-${folder.color}-500/10 rounded-xl flex items-center justify-center text-${folder.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                                    <Folder size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{folder.title}</h3>
                                <p className="text-slate-400 text-sm mb-3">{folder.description}</p>
                                {FOLDER_LAB_MAP[folder.id] && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigateToLab(FOLDER_LAB_MAP[folder.id]); }}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-300 hover:from-purple-600/40 hover:to-blue-600/40 hover:text-white transition-all`}
                                    >
                                        <Beaker size={14} />
                                        Launch Lab
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {activeHubFolder && activeHubFolder !== 'prompts' && activeHubFolder !== 'guidance' && (
                    renderResourceCards(FOLDER_CONFIG.find(f => f.id === activeHubFolder)?.data || [])
                )}

                {activeHubFolder === 'prompts' && (
                    <motion.div
                        key="prompts"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                            {TEACHER_PROMPTS.map((cat) => (
                                <button
                                    key={cat.category}
                                    onClick={() => setActivePromptCategory(cat.category)}
                                    className={`px-4 py-2 text-sm font-bold whitespace-nowrap rounded-lg transition-colors ${activePromptCategory === cat.category
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {TEACHER_PROMPTS.find(c => c.category === activePromptCategory)?.prompts.map((prompt, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex items-start justify-between group hover:border-purple-500/20 transition-colors"
                                >
                                    <p className="text-slate-300 pr-8 font-mono text-sm leading-relaxed">{prompt}</p>
                                    <button
                                        onClick={() => handleCopyPrompt(prompt)}
                                        className="p-2 text-slate-500 hover:text-white bg-black/20 hover:bg-purple-600 rounded-lg transition-all relative shrink-0"
                                        title="Copy Prompt"
                                    >
                                        {copiedPrompt === prompt ? <div className="text-green-400 font-bold text-xs absolute -top-8 right-0 bg-slate-900 px-2 py-1 rounded border border-green-500/30">Copied!</div> : null}
                                        <Copy size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Student Guidance & Clarity Combined Section */}
                {activeHubFolder === 'guidance' && (
                    <motion.div
                        key="guidance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        {/* Sub-tabs for Guidance vs Clarity */}
                        <div className="flex gap-3 mb-8 border-b border-white/10 pb-4">
                            <button
                                onClick={() => setActiveGuidanceTab('guidance')}
                                className={`px-5 py-2.5 text-sm font-bold flex items-center gap-2 rounded-lg transition-all ${activeGuidanceTab === 'guidance'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Lightbulb size={16} />
                                Discussion Points
                            </button>
                            <button
                                onClick={() => setActiveGuidanceTab('clarity')}
                                className={`px-5 py-2.5 text-sm font-bold flex items-center gap-2 rounded-lg transition-all ${activeGuidanceTab === 'clarity'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <CheckCircle2 size={16} />
                                Clarity & Myths
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeGuidanceTab === 'guidance' && (
                                <motion.div
                                    key="guidance-cards"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {STUDENT_GUIDANCE.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors group"
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                                                <item.icon size={24} />
                                            </div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{item.category}</div>
                                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeGuidanceTab === 'clarity' && (
                                <motion.div
                                    key="clarity-section"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Category Pills */}
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {CLARITY_DATA.map((cat) => (
                                            <button
                                                key={cat.category}
                                                onClick={() => {
                                                    setActiveClarityCategory(cat.category);
                                                    setExpandedCard(null);
                                                }}
                                                className={`group flex items-center gap-2.5 px-5 py-3 text-sm font-bold rounded-full transition-all duration-300 border ${activeClarityCategory === cat.category
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/30'
                                                    : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white hover:border-white/20'
                                                    }`}
                                            >
                                                <cat.icon size={18} />
                                                {cat.category}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Category Description */}
                                    {activeCategory && (
                                        <div className="mb-6 p-4 rounded-xl bg-slate-800/40 border border-white/5">
                                            <p className="text-slate-300 text-sm flex items-center gap-2">
                                                <activeCategory.icon size={16} className="text-purple-400" />
                                                {activeCategory.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Myth/Reality Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {activeCategory?.topics.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                                                className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border ${expandedCard === idx
                                                    ? 'bg-slate-800/80 border-purple-500/50 shadow-xl'
                                                    : 'bg-slate-800/40 border-white/5 hover:border-white/15 hover:bg-slate-800/60'
                                                    }`}
                                            >
                                                {/* Myth Section */}
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                            <XCircle size={12} /> Myth
                                                        </span>
                                                        <ChevronRight
                                                            size={18}
                                                            className={`text-slate-500 transition-transform duration-300 ${expandedCard === idx ? 'rotate-90 text-purple-400' : 'group-hover:text-white'}`}
                                                        />
                                                    </div>
                                                    <h3 className="text-base font-bold text-white leading-snug">"{item.myth}"</h3>
                                                </div>

                                                {/* Reality Section - Expandable */}
                                                <AnimatePresence>
                                                    {expandedCard === idx && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-5 pt-0 border-t border-white/5">
                                                                <div className="pt-4">
                                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 w-fit">
                                                                        <CheckCircle2 size={12} /> Reality
                                                                    </span>
                                                                    <p className="text-slate-300 leading-relaxed text-sm">{item.truth}</p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </AnimatePresence>

            {/* Lab Overlay */}
            {activeLab && (
                <UniversalLab simulationId={activeLab} onClose={closeLab} />
            )}
        </motion.div>
    );
};
