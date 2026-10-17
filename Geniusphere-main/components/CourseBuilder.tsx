
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import {
    Brain, Video, FileText, CheckCircle, Plus, Trash2,
    Wand2, Save, X, Settings, List, PlayCircle, Youtube, Clock
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Course, CourseModule, QuizConfig } from '../types';

const motion = motionBase as any;

interface CourseBuilderProps {
    onClose: () => void;
    onSave: (course: Course) => void;
    initialData?: Course;
}

const steps = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'curriculum', label: 'Curriculum (10 Modules)', icon: Video },
    { id: 'exam', label: 'Exam (30 Qs)', icon: CheckCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
];

export const CourseBuilder: React.FC<CourseBuilderProps> = ({ onClose, onSave, initialData }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const [courseData, setCourseData] = useState<Partial<Course>>(initialData || {
        title: "",
        sector: undefined,
        short_description: "",
        long_description: "",
        modules: [],
        quiz: { passThreshold: 70, timeLimit: 30, questions: [] },
        status: 'active'
    });

    const apiKey = process.env.API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    // --- AI GENERATION LOGIC ---
    const generateCurriculum = async () => {
        if (!courseData.title) return;
        setIsAiGenerating(true);
        try {
            // Updated Prompt to simulate transcription and include simulation/particle references
            const prompt = `
                You are an expert curriculum designer and video summarizer. Create a comprehensive video course curriculum for "${courseData.title}".
                
                REQUIREMENTS:
                1. Generate EXACTLY 10 distinct learning modules.
                2. For each module, assume there is a YouTube video associated with it.
                3. **Transcription & Summarization**: "contentMarkdown" must act as a structured summary of the video content. 
                   - Include "## Video Transcript Summary" as a header.
                   - Include bullet points of key concepts.
                   - Include a "### Practical Application / Simulation" section that suggests how this concept relates to a hands-on lab or particle simulation.
                4. For the final module (Module 10), explicitly mention "Final Review & Interactive Particle Simulation" in the title.
                
                Return ONLY valid JSON in this array format:
                [ 
                  { "title": "...", "description": "...", "duration": "10:00", "contentMarkdown": "..." },
                  ... (10 items total)
                ]
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            let text = response.text || "[]";

            // Robust JSON extraction
            const jsonStart = text.indexOf('[');
            const jsonEnd = text.lastIndexOf(']');

            if (jsonStart !== -1 && jsonEnd !== -1) {
                text = text.substring(jsonStart, jsonEnd + 1);
            }

            const modulesRaw = JSON.parse(text);

            // Map to CourseModule type and ensure we have 10
            const newModules: CourseModule[] = modulesRaw.map((m: any, i: number) => ({
                id: `mod_${Date.now()}_${i}`,
                title: m.title || `Module ${i + 1}`,
                description: m.description || "Learn the fundamentals.",
                // Use a valid default video so the player works immediately
                videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg',
                duration: m.duration || "10:00",
                contentMarkdown: m.contentMarkdown || `## Video Transcript Summary\n\n**Key Topic:** ${m.title}\n\n*   Concept 1 explained...\n*   Concept 2 explained...\n\n### Practical Application / Simulation\nExplore the particle dynamics of this concept in the interactive lab.`
            }));

            const finalModules = newModules.slice(0, 10);

            setCourseData(prev => ({ ...prev, modules: finalModules }));
        } catch (e) {
            console.error("AI Gen Error", e);
            alert("Failed to generate content. Please check API Key and try again.");
        } finally {
            setIsAiGenerating(false);
        }
    };

    const generateQuiz = async () => {
        if (!courseData.title) return;
        setIsAiGenerating(true);
        try {
            const prompt = `
                Create a final certification exam for the course "${courseData.title}".
                
                REQUIREMENTS:
                1. Generate exactly 30 multiple-choice questions.
                2. Questions should test understanding of the video summaries generated previously.
                3. Include questions about practical applications (simulations/particles).
                4. Cover a range of difficulty levels (Easy, Medium, Hard).
                
                Return ONLY valid JSON in this format:
                [ 
                  { "text": "Question text?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0 },
                  ... (30 items total)
                ]
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            let text = response.text || "[]";
            const jsonStart = text.indexOf('[');
            const jsonEnd = text.lastIndexOf(']');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                text = text.substring(jsonStart, jsonEnd + 1);
            }

            const questionsRaw = JSON.parse(text);
            const newQuestions = questionsRaw.map((q: any, i: number) => ({
                id: `q_${Date.now()}_${i}`,
                ...q
            }));

            setCourseData(prev => ({ ...prev, quiz: { ...prev.quiz!, questions: newQuestions } }));
        } catch (e) {
            console.error("AI Quiz Error", e);
            alert("Failed to generate exam. Please check API Key.");
        } finally {
            setIsAiGenerating(false);
        }
    };

    const renderDetails = () => (
        <div className="space-y-4">
            <div>
                <label className="text-slate-400 text-sm">Course Title</label>
                <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 outline-none"
                    value={courseData.title}
                    onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                    placeholder="e.g. Advanced Robotics"
                />
            </div>
            <div>
                <label className="text-slate-400 text-sm">Short Description</label>
                <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 outline-none"
                    value={courseData.short_description}
                    onChange={e => setCourseData({ ...courseData, short_description: e.target.value })}
                    placeholder="One sentence overview..."
                />
            </div>
            <div>
                <label className="text-slate-400 text-sm">Full Description</label>
                <textarea
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-400 outline-none h-32"
                    value={courseData.long_description}
                    onChange={e => setCourseData({ ...courseData, long_description: e.target.value })}
                    placeholder="Detailed breakdown of the course..."
                />
            </div>
        </div>
    );

    const renderCurriculum = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-white/10">
                <div>
                    <h3 className="text-white font-bold flex items-center gap-2"><Brain size={18} className="text-purple-400" /> AI Auto-Curator</h3>
                    <p className="text-xs text-slate-400">Generates 10 modules, summarising video content & adding particle simulation notes.</p>
                </div>
                <button
                    onClick={generateCurriculum}
                    disabled={isAiGenerating || !courseData.title}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 disabled:opacity-50"
                >
                    {isAiGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Wand2 size={16} />}
                    Generate from Topic
                </button>
            </div>

            <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                {courseData.modules?.length === 0 && (
                    <div className="text-center text-slate-500 py-10">
                        <p>No modules yet. Click "Generate" to create simulated transcripts.</p>
                    </div>
                )}

                {courseData.modules?.map((mod, idx) => (
                    <div key={mod.id} className="p-4 bg-slate-900/40 border border-white/10 rounded-xl group hover:border-cyan-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2 py-1 rounded">{idx + 1}</span>
                                <input
                                    className="bg-transparent font-bold text-white outline-none w-full"
                                    value={mod.title}
                                    onChange={(e) => {
                                        const newMods = [...(courseData.modules || [])];
                                        newMods[idx].title = e.target.value;
                                        setCourseData({ ...courseData, modules: newMods });
                                    }}
                                />
                            </div>
                            <button onClick={() => {
                                const newMods = [...(courseData.modules || [])];
                                newMods.splice(idx, 1);
                                setCourseData({ ...courseData, modules: newMods });
                            }} className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                        </div>

                        {/* URL Input */}
                        <div className="ml-10 mb-3 flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                            <Youtube size={14} className="text-red-500" />
                            <input
                                className="bg-transparent text-xs text-blue-400 flex-1 outline-none font-mono"
                                value={mod.videoUrl}
                                onChange={(e) => {
                                    const newMods = [...(courseData.modules || [])];
                                    newMods[idx].videoUrl = e.target.value;
                                    setCourseData({ ...courseData, modules: newMods });
                                }}
                                placeholder="Paste YouTube URL here"
                            />
                            <input
                                className="bg-transparent text-xs text-slate-600 border-l border-white/10 pl-2 w-16 outline-none"
                                value={mod.duration}
                                onChange={(e) => {
                                    const newMods = [...(courseData.modules || [])];
                                    newMods[idx].duration = e.target.value;
                                    setCourseData({ ...courseData, modules: newMods });
                                }}
                            />
                        </div>

                        {/* Transcript/Notes Area */}
                        <div className="ml-10">
                            <p className="text-xs text-slate-500 mb-1">Generated Notes / Transcript Summary:</p>
                            <textarea
                                className="w-full bg-black/20 text-sm text-slate-400 p-2 rounded border border-white/5 outline-none resize-y min-h-[80px]"
                                value={mod.contentMarkdown}
                                onChange={(e) => {
                                    const newMods = [...(courseData.modules || [])];
                                    newMods[idx].contentMarkdown = e.target.value;
                                    setCourseData({ ...courseData, modules: newMods });
                                }}
                            />
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => {
                        const newMod: CourseModule = {
                            id: `new_${Date.now()}`,
                            title: "New Module",
                            description: "Description",
                            videoUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
                            duration: "05:00",
                            contentMarkdown: "## Video Transcript Summary\n..."
                        };
                        setCourseData({ ...courseData, modules: [...(courseData.modules || []), newMod] });
                    }}
                    className="w-full py-3 border border-dashed border-white/10 rounded-xl text-slate-500 hover:text-white hover:border-white/30 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} /> Add Module Manually
                </button>
            </div>
        </div>
    );

    const renderExam = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-white/10">
                <div>
                    <h3 className="text-white font-bold flex items-center gap-2"><CheckCircle size={18} className="text-green-400" /> Exam Builder</h3>
                    <p className="text-xs text-slate-400">Current Questions: {courseData.quiz?.questions.length || 0} / 30</p>
                </div>
                <button
                    onClick={generateQuiz}
                    disabled={isAiGenerating || !courseData.title}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {isAiGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Wand2 size={16} />}
                    Generate 30 Questions
                </button>
            </div>

            {/* Timer Config */}
            <div className="p-4 bg-slate-900/40 border border-white/10 rounded-xl flex items-center gap-4">
                <Clock size={18} className="text-yellow-400" />
                <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-1">Exam Time Limit (Minutes)</label>
                    <input
                        type="number"
                        className="bg-black/40 border border-white/10 rounded p-2 text-white w-24 outline-none focus:border-yellow-400"
                        value={courseData.quiz?.timeLimit || 30}
                        onChange={e => setCourseData({ ...courseData, quiz: { ...courseData.quiz!, timeLimit: parseInt(e.target.value) } })}
                    />
                </div>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar pr-2">
                {courseData.quiz?.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 bg-slate-900/40 border border-white/10 rounded-xl">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500">Q{idx + 1}</span>
                            <button onClick={() => {
                                const newQs = [...(courseData.quiz?.questions || [])];
                                newQs.splice(idx, 1);
                                setCourseData({ ...courseData, quiz: { ...courseData.quiz!, questions: newQs } });
                            }} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                        <textarea
                            className="w-full bg-transparent font-bold text-white mb-3 border-b border-transparent focus:border-white/20 outline-none resize-none"
                            value={q.text}
                            rows={2}
                            onChange={(e) => {
                                const newQs = [...(courseData.quiz?.questions || [])];
                                newQs[idx].text = e.target.value;
                                setCourseData({ ...courseData, quiz: { ...courseData.quiz!, questions: newQs } });
                            }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                                <div key={optIdx} onClick={() => {
                                    const newQs = [...(courseData.quiz?.questions || [])];
                                    newQs[idx].correctIndex = optIdx;
                                    setCourseData({ ...courseData, quiz: { ...courseData.quiz!, questions: newQs } });
                                }} className={`p-2 rounded text-sm cursor-pointer border flex items-center justify-between ${q.correctIndex === optIdx ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-black/30 border-white/5 text-slate-400'}`}>
                                    <input
                                        value={opt}
                                        onChange={(e) => {
                                            const newQs = [...(courseData.quiz?.questions || [])];
                                            newQs[idx].options[optIdx] = e.target.value;
                                            setCourseData({ ...courseData, quiz: { ...courseData.quiz!, questions: newQs } });
                                        }}
                                        className="bg-transparent outline-none w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {q.correctIndex === optIdx && <CheckCircle size={12} />}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="p-4 bg-slate-900/40 border border-white/10 rounded-xl">
                <h4 className="text-white font-bold mb-4">Certification Settings</h4>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500">Pass Threshold (%)</label>
                        <input
                            type="number"
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white mt-1"
                            value={courseData.quiz?.passThreshold}
                            onChange={e => setCourseData({ ...courseData, quiz: { ...courseData.quiz!, passThreshold: parseInt(e.target.value) } })}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500">Authority Name on Cert</label>
                        <input
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white mt-1"
                            placeholder="Geniusphere Academy"
                            value={courseData.certificateTemplate?.authorityName || "Geniusphere Academy"}
                            onChange={e => setCourseData({ ...courseData, certificateTemplate: { authorityName: e.target.value } })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/30">
                    <div>
                        <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Course' : 'Course Creator Studio'}</h2>
                        <p className="text-xs text-slate-500">AI-Powered Transcript Summarization & Quiz Gen.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 border-r-0 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 p-2 md:p-4 space-y-0 md:space-y-2 flex md:block overflow-x-auto md:overflow-visible gap-2 md:gap-0 shrink-0 custom-scrollbar">
                        {steps.map((step, idx) => (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(idx)}
                                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${currentStep === idx
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <step.icon size={18} />
                                <span className="flex-1 text-left">{step.label}</span>
                                {idx === 1 && courseData.modules?.length ? <span className="text-[10px] bg-slate-800 px-1.5 rounded">{courseData.modules.length}</span> : null}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gradient-to-br from-slate-900 to-black">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {currentStep === 0 && renderDetails()}
                                {currentStep === 1 && renderCurriculum()}
                                {currentStep === 2 && renderExam()}
                                {currentStep === 3 && renderSettings()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-slate-800/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-slate-400 font-bold hover:text-white">Cancel</button>
                    <button
                        onClick={() => onSave(courseData as Course)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Save size={18} /> {initialData ? 'Update Course' : 'Publish Course'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
