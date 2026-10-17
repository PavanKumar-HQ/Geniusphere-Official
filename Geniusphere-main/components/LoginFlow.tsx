import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { GraduationCap, Brain, Shield, CheckCircle, ArrowRight, LayoutGrid, User } from 'lucide-react';

const motion = motionBase as any;

interface LoginFlowProps {
  onComplete: (mode: 'explorer' | 'workspace' | 'teacher') => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'login' | 'mode'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'explorer' | 'workspace' | 'teacher' | null>(null);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate network request/loading
    setTimeout(() => {
      setIsLoading(false);
      setStep('mode');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* 
         NOTE: Background is now handled globally in App.tsx by BackgroundEffects.
         We just need a slight tint here for focus.
      */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />

      {/* Floating Background Elements (Interactive) */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 text-blue-500/20 hidden md:block"
      >
        <GraduationCap size={120} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-20 text-neonPurple/20 hidden md:block"
      >
        <Brain size={120} />
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {step === 'login' ? (
            <motion.div
              key="login-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-3xl shadow-2xl shadow-blue-900/20 bg-slate-900/60 border border-white/10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                  <Shield className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Geniusphere</h2>
                <p className="text-slate-400 text-base">Your gateway to next-gen learning.</p>
              </div>

              <div className="space-y-6">
                <p className="text-center text-slate-300 text-sm leading-relaxed">
                  Step into a verified educational ecosystem powered by AI and immersive technology.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-electric text-white font-bold shadow-lg shadow-blue-600/25 hover:shadow-cyanGlow/20 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading ? 'Accessing...' : 'Enter Platform'}
                  {!isLoading && <ArrowRight size={20} />}
                </motion.button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-8 rounded-3xl shadow-2xl shadow-blue-900/20 bg-slate-900/60 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Choose Your Experience</h2>
              <p className="text-slate-400 text-sm text-center mb-8">Select how you want to use Geniusphere.</p>

              <div className="space-y-4">
                {/* Student View */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMode('explorer')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${selectedMode === 'explorer'
                    ? 'bg-blue-500/20 border-cyanGlow ring-1 ring-cyanGlow'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neonPurple to-blue-500 flex items-center justify-center">
                      <LayoutGrid size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Student View</h3>
                      <p className="text-xs text-slate-400">Explore courses and content.</p>
                    </div>
                    {selectedMode === 'explorer' && <CheckCircle className="ml-auto text-cyanGlow" size={20} />}
                  </div>
                </motion.div>

                {/* Teacher Mode */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMode('teacher')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${selectedMode === 'teacher'
                    ? 'bg-purple-500/20 border-purple-400 ring-1 ring-purple-400'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Teacher Mode</h3>
                      <p className="text-xs text-slate-400">Manage classes and students.</p>
                    </div>
                    {selectedMode === 'teacher' && <CheckCircle className="ml-auto text-purple-400" size={20} />}
                  </div>
                </motion.div>

                {/* Admin Dashboard */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMode('workspace')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${selectedMode === 'workspace'
                    ? 'bg-emerald-500/20 border-softMint ring-1 ring-softMint'
                    : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-softMint flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Admin Dashboard</h3>
                      <p className="text-xs text-slate-400">Manage content and analytics.</p>
                    </div>
                    {selectedMode === 'workspace' && <CheckCircle className="ml-auto text-softMint" size={20} />}
                  </div>
                </motion.div>
              </div>

              <motion.button
                disabled={!selectedMode}
                whileHover={selectedMode ? { scale: 1.02 } : {}}
                whileTap={selectedMode ? { scale: 0.98 } : {}}
                onClick={() => selectedMode && onComplete(selectedMode)}
                className={`w-full mt-8 py-3.5 rounded-xl font-bold transition-all ${selectedMode
                  ? 'bg-white text-midnight hover:shadow-lg hover:shadow-white/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
              >
                Launch Platform
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};