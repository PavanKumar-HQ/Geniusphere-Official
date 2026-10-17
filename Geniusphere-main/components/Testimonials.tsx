import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const motion = motionBase as any;

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CS Student",
    title: "Transformative",
    content: "Geniusphere taught me how to think like an engineer. The AI modules are lightyears ahead.",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "David Chen",
    role: "Analyst",
    title: "Career-Ready",
    content: "The Finance simulations were incredibly realistic. I walked into my interview with total confidence.",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    gradient: "from-emerald-500 to-green-500"
  },
  {
    name: "Emily Rodriguez",
    role: "Entrepreneur",
    title: "Complete Ecosystem",
    content: "From professional branding to soft skills, this platform covers what traditional education misses.",
    image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Michael Chang",
    role: "DevOps Engineer",
    title: "Best Investment",
    content: "The certification actually meant something to my employer. Highly recommended for serious learners.",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
    gradient: "from-orange-500 to-red-500"
  },
  {
    name: "Jessica Lee",
    role: "Marketing Lead",
    title: "Game Changer",
    content: "I use the communication frameworks I learned here every single day in my meetings.",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
    gradient: "from-pink-500 to-rose-500"
  }
];

export const Testimonials: React.FC = () => {
  // Duplicate for seamless loop
  const MARQUEE_ITEMS = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyanGlow text-glow">Voices</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Real stories from the Geniusphere community. Discover how our platform is shaping careers.
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden group/track">
        {/* Gradient Masks for smooth fade in/out on sides */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-midnight to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-midnight to-transparent z-20 pointer-events-none" />

        <div className="flex gap-6 animate-scroll-slow hover:[animation-play-state:paused] w-max px-6">
          {MARQUEE_ITEMS.map((t, i) => (
            <div
              key={i}
              className="group relative w-[350px] h-[220px] flex-shrink-0 liquid-glass rounded-[2rem] p-6 overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Content Layer */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-1 rounded-full bg-gradient-to-tr ${t.gradient}`}>
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover"
                    />
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <h3 className="text-white font-bold text-base mb-1 group-hover:text-cyanGlow transition-colors line-clamp-1">
                  "{t.title}"
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed flex-grow line-clamp-3">
                  {t.content}
                </p>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-xs">{t.name}</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider">{t.role}</p>
                  </div>
                  <Quote size={16} className="text-white/20 group-hover:text-cyanGlow/50 transition-colors" />
                </div>
              </div>
              
              {/* Subtle Color Tint on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};