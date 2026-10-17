

import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Trainer } from '../types';
import { ExternalLink } from 'lucide-react';

const motion = motionBase as any;

interface TrainerProfileProps {
  trainer: Trainer;
}

export const TrainerProfile: React.FC<TrainerProfileProps> = ({ trainer }) => {
  if (!trainer) return null;

  const { name, title, bio, imageUrl, qualifications } = trainer;

  return (
    <section className="py-24 relative bg-transparent border-y border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">
            Expert Guidance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Instructor</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Trainer Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 flex justify-center"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
              <img
                src={imageUrl}
                alt={name}
                className="relative w-72 h-72 rounded-2xl object-cover border-4 border-slate-800 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Bio and Qualifications */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-3xl font-bold text-white">{name}</h3>
            <p className="text-cyan-400 font-medium mb-4">{title}</p>
            <p className="text-slate-300 leading-relaxed mb-8">{bio}</p>

            <h4 className="text-lg font-semibold text-white mb-4">Qualifications</h4>
            <div className="flex flex-wrap gap-4">
              {qualifications && qualifications.map((q, i) => {
                const Wrapper = q.certificateUrl ? motion.a : motion.div;
                const linkProps = q.certificateUrl ? { href: q.certificateUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

                return (
                  <Wrapper
                    key={i}
                    {...linkProps}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.4 }}
                    className={`group relative flex items-center gap-3 bg-slate-800/70 border border-white/10 p-3 rounded-xl hover:bg-slate-700/90 transition-colors ${q.certificateUrl ? 'cursor-pointer hover:border-cyan-400/50' : ''}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <img src={q.imageUrl} alt={q.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-white">{q.title}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>Verified</span>
                        {q.certificateUrl && <ExternalLink size={12} className="text-cyan-400/70 group-hover:text-cyan-400" />}
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};