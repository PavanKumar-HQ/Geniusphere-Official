
import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Lightbulb, ShieldCheck, Laptop, LineChart, Globe, Rocket, Zap, Brain, Sparkles, GraduationCap } from 'lucide-react';

const motion = motionBase as any;

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const texts = [
    "Initializing Learning Systems...",
    "Calibrating AI Neural Network...",
    "Establishing Secure Connection...",
    "Welcome to Geniusphere."
  ];

  useEffect(() => {
    // Improved progress bar simulation with smoother acceleration
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        // Smoother non-linear progress
        const increment = prev < 50 ? Math.random() * 12 : Math.random() * 6;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 30) setTextIndex(0);
    else if (progress < 60) setTextIndex(1);
    else if (progress < 90) setTextIndex(2);
    else setTextIndex(3);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Enhanced Dynamic Background with Multiple Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-purple-950/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Multiple Rotating Rings with Different Speeds */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none"
      >
        <div className="w-[700px] h-[700px] border-2 border-dashed border-cyan-500/40 rounded-full" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
      >
        <div className="w-[550px] h-[550px] border border-purple-500/30 rounded-full" />
      </motion.div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
      >
        <div className="w-[400px] h-[400px] border border-blue-500/20 rounded-full" />
      </motion.div>

      {/* Enhanced Floating Particles with More Variety */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${i % 3 === 0 ? 'bg-blue-500/40' :
            i % 3 === 1 ? 'bg-purple-500/40' :
              'bg-cyan-500/40'
            }`}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            scale: 0
          }}
          animate={{
            y: [null, Math.random() * -150 - 50],
            x: [null, Math.random() * 100 - 50],
            opacity: [0, 0.9, 0],
            scale: [0, Math.random() * 2.5 + 0.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3
          }}
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Enhanced Central Icon with Glow Effect */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
          {/* Pulsing Glow Layers */}
          <motion.div
            className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"
            animate={{
              scale: [1.2, 1.6, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          {/* Rotating Ring Around Icon */}
          <motion.div
            className="absolute inset-0 border-2 border-dashed border-cyan-400/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Icon with 3D Rotation Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={textIndex}
              initial={{ scale: 0.3, opacity: 0, rotateY: 90 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotateY: 0,
                y: [0, -5, 0]
              }}
              exit={{ scale: 0.3, opacity: 0, rotateY: -90 }}
              transition={{
                duration: 0.5,
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-white drop-shadow-[0_0_25px_rgba(59,130,246,1)]"
            >
              {textIndex === 0 && <Brain size={72} className="text-cyan-400" strokeWidth={1.5} />}
              {textIndex === 1 && <Zap size={72} className="text-blue-400" strokeWidth={1.5} />}
              {textIndex === 2 && <ShieldCheck size={72} className="text-green-400" strokeWidth={1.5} />}
              {textIndex === 3 && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-400 shadow-lg shadow-purple-500/50">
                  <img
                    src="https://i.postimg.cc/wBPJxLpD/Whats-App-Image-2025-01-23-at-19-54-49-0e1e8c5f.jpg"
                    alt="Geniusphere"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sparkles Around Icon */}
          {progress > 80 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 6) * 60,
                    y: Math.sin((i * Math.PI * 2) / 6) * 60,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles size={16} className="text-yellow-400" />
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Enhanced Progress Bar with Glow */}
        <div className="w-full h-2 bg-slate-800/50 rounded-full mb-6 overflow-hidden relative border border-white/10 shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 relative shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.15 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Glow at the end */}
            <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-white/60 to-transparent" />
          </motion.div>
        </div>

        {/* Text with Better Typography */}
        <div className="h-10 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="text-cyan-100 font-mono text-base tracking-wide uppercase text-center font-semibold drop-shadow-lg"
            >
              {texts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Percentage with Animation */}
        <motion.div
          className="mt-3 text-sm text-slate-400 font-mono font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {Math.round(progress)}% COMPLETE
        </motion.div>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Branding */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
          Powered by Geniusphere • Educational Platform
        </p>
      </motion.div>
    </div>
  );
};
