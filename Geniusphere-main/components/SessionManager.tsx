import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Moon, Sun, Globe, BookOpen, X } from 'lucide-react';
import { LearningMood } from '../types';

interface SessionManagerProps {
    currentMood: LearningMood;
    onWander?: () => void;
    onExplore?: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ currentMood, onWander, onExplore }) => {
    const [notification, setNotification] = useState<{ title: string, msg: string, icon: any, action?: { label: string, onClick: () => void } } | null>(null);

    const TIPS = [
        "Time to switch context? 🧠",
        "Explore the Digital Universe for a bit? 🌌",
        "How about a quick learning pivot? 🔄",
        "Refresh your mind with something new. ✨"
    ];

    useEffect(() => {
        const startTime = Date.now();

        // Initial "Active" Nudge
        setTimeout(() => {
            setNotification({
                title: "Session Active",
                msg: "We'll nudge you every 30 mins with a wellness tip. 🌿",
                icon: Sun
            });
        }, 3000);

        // Check intervals
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = elapsed / 60000;

            // Every 45 Minutes: Reminder
            if (minutes > 1 && Math.abs(minutes % 45) < 0.2) {
                const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];

                // Toggle between suggesting "Digital Universe" and "Change Learning"
                const suggestUniverse = Math.random() > 0.5;

                setNotification({
                    title: "45 Min Check-in",
                    msg: randomTip,
                    icon: suggestUniverse ? Globe : Sun,
                    action: suggestUniverse
                        ? { label: "See Digital Universe", onClick: () => onWander?.() }
                        : { label: "Change Learning", onClick: () => onExplore?.() }
                });
            }

        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [currentMood]);

    // Auto-hide notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed top-6 right-6 z-[90] flex items-start gap-4 bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl max-w-sm pointer-events-auto pr-8 relative"
                >
                    <div className="p-2 bg-white/5 rounded-full text-slate-300 mt-1">
                        <notification.icon size={20} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-3">
                            <div>
                                <h4 className="font-medium text-white text-sm mb-1">{notification.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">{notification.msg}</p>
                            </div>
                        </div>
                        {notification.action && (
                            <button
                                onClick={() => {
                                    notification.action?.onClick();
                                    setNotification(null);
                                }}
                                className="mt-1 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded-lg transition-colors w-fit"
                            >
                                {notification.action.label}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
