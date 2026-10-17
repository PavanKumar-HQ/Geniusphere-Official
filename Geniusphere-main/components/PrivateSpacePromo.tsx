import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Shield, Lock, Zap, ArrowRight } from 'lucide-react';

const motion = motionBase as any;

interface PrivateSpacePromoProps {
  onLaunch: () => void;
}

export const PrivateSpacePromo: React.FC<PrivateSpacePromoProps> = ({ onLaunch }) => {
  return (
    <section className="py-24 relative border-t border-white/5 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
          {/* Header matching screenshot */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">
                Connect & Collaborate
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Digital Universe</span>
              </h2>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="max-w-4xl mx-auto"
          >
             <div className="relative rounded-[2.5rem] p-1 bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl shadow-green-900/20 group cursor-pointer" onClick={onLaunch}>
                <div className="bg-slate-950 rounded-[2.3rem] p-8 md:p-12 relative overflow-hidden transition-colors group-hover:bg-slate-900">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div className="flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <Shield className="text-green-400" size={32} />
                                <h3 className="text-3xl font-bold text-white">Private Study Space</h3>
                            </div>
                            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                                Launch a local-only, ephemeral room for distraction-free study. 
                                Features whiteboard, notes, and AI assistance. Zero server storage.
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-6 text-sm font-mono text-green-500/90">
                                <span className="flex items-center gap-2"><Lock size={14}/> Encrypted</span>
                                <span className="flex items-center gap-2"><Zap size={14}/> Auto-Delete</span>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); onLaunch(); }}
                            className="shrink-0 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center gap-3 group/btn"
                        >
                            Enter Safe Room <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
             </div>
          </motion.div>
       </div>
    </section>
  );
}