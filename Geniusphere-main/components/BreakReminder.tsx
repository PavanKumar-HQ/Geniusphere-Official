import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, BookOpen, Video, X, Clock } from 'lucide-react';
import { ResourceType } from '../types';

interface BreakReminderProps {
    onNavigate: (type: ResourceType) => void;
}

const REMINDER_INTERVAL = 45 * 60 * 1000; // 45 Minutes

type ReminderType = 'break' | 'blog' | 'video' | 'digital-universe';

export const BreakReminder: React.FC<BreakReminderProps> = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [reminderType, setReminderType] = useState<ReminderType>('break');

    useEffect(() => {
        // Initial setup
        const timer = setInterval(() => {
            triggerReminder();
        }, REMINDER_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    const triggerReminder = () => {
        // Rotate reminders or pick random
        const types: ReminderType[] = ['break', 'blog', 'video', 'digital-universe'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        setReminderType(randomType);
        setIsVisible(true);
    };

    const handleAction = () => {
        setIsVisible(false);
        if (reminderType === 'blog') onNavigate('blog');
        if (reminderType === 'video') onNavigate('video');
        if (reminderType === 'digital-universe') onNavigate('gallery');
    };

    const getContent = () => {
        switch (reminderType) {
            case 'blog':
                return {
                    title: "Brain Break: Read a Blog",
                    text: "Refresh your mind with a quick 2-minute read from our latest articles.",
                    img: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20Reading.png",
                    color: "text-purple-400",
                    btnText: "Go to Blogs"
                };
            case 'video':
                return {
                    title: "Watch Something New",
                    text: "Taking a break? Check out trending videos in the resource hub.",
                    img: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Film%20Projector.png",
                    color: "text-blue-400",
                    btnText: "Watch Videos"
                };
            case 'digital-universe':
                return {
                    title: "Explore Digital Universe",
                    text: "Step into the infinite gallery of student creations and digital art. Amazing things await!",
                    img: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Asia-Australia.png",
                    color: "text-cyan-400",
                    btnText: "Launch Universe"
                };
            default:
                return {
                    title: "Time for a Break!",
                    text: "Hi! I'm Genius 👩‍🚀. You've been studying for 45 minutes. Stretch or check the Digital Universe?",
                    img: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Astronaut.png",
                    color: "text-green-400",
                    btnText: "Thanks Genius!"
                };
        }
    };

    const content = getContent();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className="fixed top-24 right-4 z-[90] max-w-sm w-full"
                >
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 relative overflow-hidden ring-1 ring-white/10">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex gap-4 items-start">
                            <div className="w-16 h-16 shrink-0 relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center p-1 border border-white/10 overflow-visible mt-1">
                                <img src={content.img} alt="Astra Guide" className="w-full h-full object-contain drop-shadow-xl hover:scale-125 transition-transform duration-500 cursor-pointer" />
                            </div>
                            <div>
                                <h3 className={`font-bold text-white mb-1 flex items-center gap-2 ${content.color}`}>
                                    {content.title}
                                </h3>
                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{content.text}</p>

                                <button
                                    onClick={handleAction}
                                    className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-white/5"
                                >
                                    {content.btnText}
                                </button>
                            </div>
                        </div>

                        {/* Progress line to show it's a timed event (opt) */}
                        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-full" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
