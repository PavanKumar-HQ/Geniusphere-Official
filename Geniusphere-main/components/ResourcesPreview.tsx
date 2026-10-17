
import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Video, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { ResourceType } from '../types';

const motion = motionBase as any;

interface ResourcesPreviewProps {
  onViewAll: (type: ResourceType) => void;
}

export const ResourcesPreview: React.FC<ResourcesPreviewProps> = ({ onViewAll }) => {
  const tabs = [
    { id: 'video', label: 'Videos', icon: Video, color: 'text-red-500', hoverBorder: 'hover:border-red-500/50', bg: 'hover:bg-red-500/10' },
    { id: 'blog', label: 'Blogs', icon: FileText, color: 'text-orange-500', hoverBorder: 'hover:border-orange-500/50', bg: 'hover:bg-orange-500/10' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Theme Background */}
      <div className="absolute inset-0 bg-slate-900/30 -z-20" />
      <div className="absolute inset-0 iso-grid-bg opacity-70 pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-10 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">
            Knowledge Hub
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 text-glow">Resources</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore our curated library of visual learning resources, community insights, and comprehensive guides.
          </p>
        </motion.div>

        {/* Categories as Big Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tabs.map((tab, idx) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onViewAll(tab.id as ResourceType)}
              className={`group relative glass-card p-10 rounded-3xl cursor-pointer border border-white/10 transition-all duration-300 ${tab.hoverBorder} ${tab.bg}`}
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <tab.icon size={40} className={tab.color} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{tab.label}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 group-hover:text-white transition-colors mt-4">
                <span>View Content</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
