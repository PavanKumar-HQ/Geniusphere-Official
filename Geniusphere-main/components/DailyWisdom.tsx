import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

interface DailyWisdomProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DailyWisdom: React.FC<DailyWisdomProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                >
                    <div className="absolute inset-0" onClick={onClose}></div>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#0f111a] border border-indigo-500/30 rounded-3xl max-w-2xl w-full relative overflow-hidden shadow-2xl relative z-10"
                    >
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10"></div>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Trophy size={200} className="text-indigo-400 rotate-12 translate-x-12 -translate-y-12" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 p-8 md:p-12">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy size={20} className="text-indigo-400" />
                                <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Daily Wisdom</span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-serif italic text-slate-100 leading-relaxed mb-8">
                                "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
                            </h3>

                            <div className="flex items-center gap-4">
                                <div className="h-px bg-indigo-500/30 w-12"></div>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Brian Herbert</span>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    Let's Learn
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
