
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLARITY_DATA } from './TeacherResources';
import { ChevronRight, Lightbulb, XCircle, CheckCircle2 } from 'lucide-react';

export const ClaritySection = () => {
    const [activeClarityCategory, setActiveClarityCategory] = useState<string>(CLARITY_DATA[0].category);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const activeCategory = CLARITY_DATA.find(c => c.category === activeClarityCategory);

    return (
        <motion.div key="clarity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[70vh]">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Lightbulb size={20} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Clarity & Myths</h2>
                </div>
                <p className="text-slate-400 text-lg max-w-2xl">
                    Debunk misconceptions, understand the truth, and build a stronger foundation for your learning journey.
                </p>
            </div>

            {/* Category Tabs - Pill Style */}
            <div className="flex flex-wrap gap-3 mb-10">
                {CLARITY_DATA.map((cat) => (
                    <button
                        key={cat.category}
                        onClick={() => {
                            setActiveClarityCategory(cat.category);
                            setExpandedCard(null);
                        }}
                        className={`group flex items-center gap-2.5 px-5 py-3 text-sm font-bold rounded-full transition-all duration-300 border ${activeClarityCategory === cat.category
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-500/30 scale-105'
                                : 'bg-slate-800/60 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white hover:border-white/20'
                            }`}
                    >
                        <cat.icon size={18} className={activeClarityCategory === cat.category ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                        {cat.category}
                    </button>
                ))}
            </div>

            {/* Active Category Description */}
            <AnimatePresence mode="wait">
                {activeCategory && (
                    <motion.div
                        key={activeCategory.category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-white/5"
                    >
                        <p className="text-slate-300 flex items-center gap-2">
                            <activeCategory.icon size={18} className="text-purple-400" />
                            {activeCategory.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {activeCategory?.topics.map((item, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                            className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border ${expandedCard === idx
                                    ? 'bg-slate-800/80 border-purple-500/50 shadow-xl shadow-purple-500/10'
                                    : 'bg-slate-800/40 border-white/5 hover:border-white/15 hover:bg-slate-800/60'
                                }`}
                        >
                            {/* Myth Section */}
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            <XCircle size={12} /> Myth
                                        </span>
                                    </div>
                                    <ChevronRight
                                        size={18}
                                        className={`text-slate-500 transition-transform duration-300 ${expandedCard === idx ? 'rotate-90 text-purple-400' : 'group-hover:text-white'}`}
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-purple-200 transition-colors">
                                    "{item.myth}"
                                </h3>
                            </div>

                            {/* Truth Section - Expandable */}
                            <AnimatePresence>
                                {expandedCard === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 border-t border-white/5 mt-0">
                                            <div className="pt-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                        <CheckCircle2 size={12} /> Reality
                                                    </span>
                                                </div>
                                                <p className="text-slate-200 leading-relaxed text-sm">
                                                    {item.truth}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer Tip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-white/5 flex items-center gap-4"
            >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Lightbulb size={24} className="text-white" />
                </div>
                <div>
                    <h4 className="font-bold text-white mb-1">Pro Tip</h4>
                    <p className="text-slate-400 text-sm">
                        Click on any card to reveal the truth behind the myth. Understanding these distinctions is key to critical thinking.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};
