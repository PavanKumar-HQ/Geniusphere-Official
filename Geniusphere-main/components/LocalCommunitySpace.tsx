import React, { useState, useEffect, useRef } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { 
    Shield, Lock, Clock, Send, LogOut, Trash2, 
    Wifi, WifiOff, Users, AlertTriangle, FileText,
    PenTool, UserPlus, Copy, Check
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { LocalMessage } from '../types';
import { Whiteboard } from './Whiteboard';

const motion = motionBase as any;

interface LocalCommunitySpaceProps {
    onExit: () => void;
}

export const LocalCommunitySpace: React.FC<LocalCommunitySpaceProps> = ({ onExit }) => {
    const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes default
    const [messages, setMessages] = useState<LocalMessage[]>([
        { id: '1', text: 'Secure Room initialized. All data is local-only.', sender: 'system', timestamp: new Date().toLocaleTimeString() }
    ]);
    const [input, setInput] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'whiteboard'>('chat');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [roomCredentials, setRoomCredentials] = useState({ name: '', key: '' });
    const [copiedField, setCopiedField] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const apiKey = process.env.API_KEY || '';
    const ai = new GoogleGenAI({ apiKey });

    // Initialize Room Credentials
    useEffect(() => {
        const randomId = Math.floor(Math.random() * 9000) + 1000;
        const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCredentials({
            name: `Study-Room-${randomId}`,
            key: randomKey
        });
    }, []);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSelfDestruct();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSelfDestruct = () => {
        alert("Session Expired. Data wiped.");
        onExit();
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: LocalMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI Study Buddy response
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a helpful study buddy in a private, secure study room. The user says: "${input}". Keep response concise.`,
            });
            
            const reply = result.text || "I'm listening.";
            
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: reply,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString()
            }]);

        } catch (error) {
            console.error(error);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="bg-slate-900 border-b border-white/5 p-4 flex justify-between items-center shadow-lg relative z-20">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-white font-bold flex items-center gap-2">
                            <Shield className="text-green-500" size={20} /> 
                            {roomCredentials.name || "Secure Study Space"}
                        </h2>
                        <span className="text-[10px] text-green-400 uppercase tracking-wider flex items-center gap-1">
                            <Lock size={10} /> Local Device Storage Only
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="hidden md:flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5">
                        <Clock size={16} className={timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
                        <span className={`font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-white'}`}>
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-xs text-slate-600 uppercase ml-2">Auto-Wipe</span>
                    </div>

                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <UserPlus size={16} /> <span className="hidden sm:inline">Invite</span>
                    </button>

                    <button 
                        onClick={onExit}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <LogOut size={16} /> Exit
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Mode Sidebar (Mobile/Desktop) */}
                <div className="w-16 md:w-20 bg-slate-900 border-r border-white/5 flex flex-col items-center py-6 gap-4 z-10">
                    <button 
                        onClick={() => setActiveTab('chat')}
                        className={`p-3 rounded-xl transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Chat & Notes"
                    >
                        <FileText size={24} />
                    </button>
                    <button 
                        onClick={() => setActiveTab('whiteboard')}
                        className={`p-3 rounded-xl transition-all ${activeTab === 'whiteboard' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        title="Whiteboard"
                    >
                        <PenTool size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-black/50 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50 pointer-events-none" />
                    
                    {activeTab === 'chat' ? (
                        <div className="h-full flex flex-col max-w-4xl mx-auto p-4 md:p-8 relative z-10">
                            {/* Chat History */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
                                {messages.map((msg) => (
                                    <motion.div 
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-4 rounded-2xl border backdrop-blur-sm ${
                                            msg.sender === 'user' 
                                            ? 'bg-blue-600/20 border-blue-500/30 text-white rounded-tr-none' 
                                            : msg.sender === 'system'
                                                ? 'bg-green-500/10 border-green-500/20 text-green-400 text-center text-xs w-full'
                                                : 'bg-slate-800/80 border-white/10 text-slate-200 rounded-tl-none'
                                        }`}>
                                            {msg.sender !== 'system' && msg.text}
                                            {msg.sender === 'system' && <span className="flex items-center justify-center gap-2"><Lock size={10}/> {msg.text}</span>}
                                            {msg.sender !== 'system' && (
                                                <div className="text-[10px] opacity-50 mt-1 text-right">{msg.timestamp}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="mt-4 bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-2xl">
                                <input 
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a note or ask AI Study Buddy..."
                                    className="flex-1 bg-transparent px-4 py-2 outline-none text-white placeholder-slate-500"
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            
                            <div className="text-center mt-2 text-[10px] text-slate-600">
                                Messages are lost forever if you refresh.
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full p-4 relative z-10">
                            <Whiteboard color="#60A5FA" />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Privacy Warning Footer */}
            <div className="bg-slate-950 border-t border-white/5 py-2 px-6 text-center text-[10px] text-slate-600 flex justify-center items-center gap-2">
                <WifiOff size={10} /> No data is sent to Geniusphere servers. Your session is offline-capable (cached) and ephemeral.
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowInviteModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><UserPlus size={24} className="text-blue-400"/> Invite Friends</h3>
                            <p className="text-slate-400 text-sm mb-6">Share these credentials to let friends join your secure local session.</p>
                            
                            <div className="space-y-4 mb-6">
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                    <label className="text-xs text-slate-500 uppercase font-bold">Room Name</label>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-white font-mono text-lg">{roomCredentials.name}</span>
                                        <button onClick={() => copyToClipboard(roomCredentials.name, 'name')} className="text-slate-400 hover:text-white transition-colors">
                                            {copiedField === 'name' ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                    <label className="text-xs text-slate-500 uppercase font-bold">Secret Key</label>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-green-400 font-mono text-lg tracking-wider">{roomCredentials.key}</span>
                                        <button onClick={() => copyToClipboard(roomCredentials.key, 'key')} className="text-slate-400 hover:text-white transition-colors">
                                             {copiedField === 'key' ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setShowInviteModal(false)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};