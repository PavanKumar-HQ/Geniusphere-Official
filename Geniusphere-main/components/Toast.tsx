import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface ToastProps {
    message: string | null;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className="fixed top-24 left-0 right-0 z-[110] flex justify-center px-4 pointer-events-none"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 p-4 md:p-6 rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto flex items-start gap-4 relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-400" />

                        <div className="p-2 bg-blue-500/20 rounded-full shrink-0">
                            <Sparkles size={24} className="text-blue-400" />
                        </div>

                        <div className="flex-1 pt-1">
                            <h3 className="font-bold text-white text-lg mb-1">Recommendation Ready!</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
