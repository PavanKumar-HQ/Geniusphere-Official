
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Target, Users, Zap, PieChart, BookOpen, Award, ShieldCheck, FileText } from 'lucide-react';
import { FEATURES } from '../constants';

const motion = motionBase as any;

const iconMap: Record<string, React.FC<any>> = {
  'PieChart': PieChart,
  'BookOpen': BookOpen,
  'Award': Award,
  'ShieldCheck': ShieldCheck,
  'Zap': Zap,
  'Target': Target,
  'Users': Users,
  'FileText': FileText
};

export const WhatIsGeniusphere: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              What really <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyanGlow text-glow">sets us apart</span>
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
              The Geniusphere ecosystem is built on pillars of excellence, designed to help students, professionals, and organizations develop essential skills.
            </p>

            {/* Social Proof Stats Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8 text-sm"
            >
               <div className="flex items-center gap-2">
                   <span className="text-orange-400 font-bold text-2xl">150+</span>
                   <span className="text-slate-300 text-base">students reached</span>
               </div>
               <div className="hidden md:block w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
               <div className="text-slate-300 text-base">
                 Rated <span className="text-yellow-400 font-bold">★ 4.9/5</span> by schools and students
               </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8"
          >
            {FEATURES.map((feature, idx) => {
              const Icon = iconMap[feature.iconName] || Zap;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 rounded-2xl flex flex-row items-start gap-5 hover:bg-white/5 transition-all duration-300"
                >
                  {/* Icon Container with Yellow Theme */}
                  <div className="w-14 h-14 shrink-0 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                    <Icon className="text-yellow-400" size={24} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-softMint font-medium tracking-wide">The result: A smarter, more confident, job-ready learner.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
