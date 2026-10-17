
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { BookOpen, PieChart, Award, Users, Zap, FileText } from 'lucide-react';
import { FEATURES } from '../constants';

const motion = motionBase as any;

const iconMap: Record<string, React.FC<any>> = {
  'BookOpen': BookOpen,
  'PieChart': PieChart,
  'Award': Award,
  'Users': Users,
  'Zap': Zap,
  'FileText': FileText
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">
            The Geniusphere Advantage
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            What really <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyanGlow">sets us apart</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             The Geniusphere ecosystem is built on four pillars of excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {FEATURES.map((feature, idx) => {
            const Icon = iconMap[feature.iconName] || Zap;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl flex items-start gap-6 group hover:bg-white/5 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                  <Icon size={28} className="text-blue-400 group-hover:text-cyanGlow transition-colors" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
