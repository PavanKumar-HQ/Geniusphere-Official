

import React, { useRef } from 'react';
import { SERVICES } from '../constants';
import { CheckCircle2, Zap, Layers, Trophy, Users, Globe } from 'lucide-react';
import { motion as motionBase, useScroll, useTransform } from 'framer-motion';

const motion = motionBase as any;

// Map generic category to icons for visual variety
const getIcon = (idx: number) => {
  const icons = [Zap, Layers, Users, Trophy, Globe, CheckCircle2];
  return icons[idx % icons.length];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 15 }
  }
};

export const ServicesGrid: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={ref} className="py-32 relative z-10 overflow-hidden">
       {/* Unique Background for Services: Deep Radial Glow with Parallax */}
       <motion.div 
         style={{ y: glowY }}
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" 
       />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-2 block">Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Professional <span className="text-softMint text-glow">Services</span></h2>
            <p className="text-slate-400 max-w-xl text-lg">
              A comprehensive suite of tools and programs designed to accelerate growth for individuals and organizations.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {SERVICES.map((service, idx) => {
            const Icon = getIcon(idx);
            
            return (
              <motion.div 
                key={service.service_id} 
                variants={cardVariants}
                className="group relative glass-card p-8 rounded-[2rem] transition-all duration-500 overflow-hidden"
              >
                {/* Hover Gradient Reveal */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300 shadow-lg shadow-black/10">
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-[10px] bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider backdrop-blur-md">
                      {service.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyanGlow transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-grow group-hover:text-slate-200 transition-colors">
                    {service.description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/10 mt-auto">
                    {service.deliverables.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                        <CheckCircle2 size={14} className="text-softMint shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};