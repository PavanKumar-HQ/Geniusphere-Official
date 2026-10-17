import React, { useState, useRef } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import { VideoTestimonial, TestimonialCategory } from '../types';
import { VideoPlayer } from './VideoPlayer';

const motion = motionBase as any;

interface VideoTestimonialsProps {
  items: VideoTestimonial[];
}

const CATEGORIES: (TestimonialCategory | 'All')[] = ['All', 'Parent', 'Student', 'Teacher', 'School'];

const COLOR_MAP: Record<string, { bg: string, border: string, text: string, badge: string, shadow: string }> = {
  Parent: { 
    bg: 'bg-orange-500/5', 
    border: 'border-orange-500/20', 
    text: 'text-orange-400', 
    badge: 'bg-orange-500/20 text-orange-300',
    shadow: 'shadow-orange-500/10'
  },
  Student: { 
    bg: 'bg-green-500/5', 
    border: 'border-green-500/20', 
    text: 'text-green-400', 
    badge: 'bg-green-500/20 text-green-300',
    shadow: 'shadow-green-500/10'
  },
  Teacher: { 
    bg: 'bg-blue-500/5', 
    border: 'border-blue-500/20', 
    text: 'text-blue-400', 
    badge: 'bg-blue-500/20 text-blue-300',
    shadow: 'shadow-blue-500/10'
  },
  School: { 
    bg: 'bg-purple-500/5', 
    border: 'border-purple-500/20', 
    text: 'text-purple-400', 
    badge: 'bg-purple-500/20 text-purple-300',
    shadow: 'shadow-purple-500/10'
  },
};

export const VideoTestimonials: React.FC<VideoTestimonialsProps> = ({ items }) => {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const [activeFilter, setActiveFilter] = useState<TestimonialCategory | 'All'>('All');
  const [playerError, setPlayerError] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(item => activeFilter === 'All' || item.category === activeFilter);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative bg-transparent overflow-hidden">
      {/* CSS for hiding scrollbar but keeping functionality */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-yellow-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Trusted by parents, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">loved by students!</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             Hear from the thousands of families whose lives have been impacted by the Geniusphere method.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 relative z-10">
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                        activeFilter === cat 
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Carousel Section */}
        <div className="relative group/carousel">
             {/* Nav Buttons (Visible on Hover/Desktop) */}
            <div className="hidden md:block absolute top-1/2 -left-4 lg:-left-12 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                <button 
                    onClick={() => scroll('left')} 
                    className="p-3 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-white hover:text-black shadow-xl transition-all backdrop-blur-md"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-12 -translate-y-1/2 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                 <button 
                    onClick={() => scroll('right')} 
                    className="p-3 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-white hover:text-black shadow-xl transition-all backdrop-blur-md"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Scrollable Track */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 hide-scrollbar px-4 md:px-0"
            >
                <AnimatePresence mode="popLayout">
                    {filteredItems.length > 0 ? filteredItems.map((testimonial, idx) => {
                        const theme = COLOR_MAP[testimonial.category] || COLOR_MAP['Parent'];
                        return (
                            <motion.div
                                layout
                                key={testimonial.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`min-w-[300px] md:min-w-[380px] snap-center flex flex-col rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${theme.bg} ${theme.border} ${theme.shadow}`}
                            >
                                {/* Video Thumbnail */}
                                <div 
                                    onClick={() => {
                                        setPlayerError(false);
                                        setActiveVideo(testimonial);
                                    }}
                                    className="relative aspect-video rounded-2xl overflow-hidden mb-6 group/card cursor-pointer border border-white/10 shadow-lg"
                                >
                                    <img 
                                        src={testimonial.videoThumbnail} 
                                        alt="Thumbnail" 
                                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover/card:bg-black/10 transition-colors" />
                                    
                                    {/* Flag Badge */}
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                                        {testimonial.flagCode === 'USA' && <span>🇺🇸 USA</span>}
                                        {testimonial.flagCode === 'UK' && <span>🇬🇧 UK</span>}
                                        {testimonial.flagCode === 'IN' && <span>🇮🇳 IND</span>}
                                    </div>

                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <Play size={20} className="fill-white text-white ml-1" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="mb-6 relative">
                                        <span className="absolute -top-2 -left-2 text-4xl opacity-20 font-serif">"</span>
                                        <p className="text-slate-300 italic text-sm leading-relaxed relative z-10 pl-2">
                                            {testimonial.quote}
                                        </p>
                                    </div>
                                    <div className={`border-t ${theme.border} pt-4 flex items-center justify-between`}>
                                        <div>
                                            <p className="font-bold text-white text-sm">{testimonial.author}</p>
                                            <p className="text-slate-500 text-xs">{testimonial.role}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${theme.badge}`}>
                                            {testimonial.category}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="w-full py-20 text-center">
                            <p className="text-slate-500 italic">No testimonials available for this category yet.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>

       {/* Video Modal */}
       <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pt-20 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            onClick={() => setActiveVideo(null)}
          >
            <div className="w-full max-w-5xl relative" onClick={(e) => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white truncate">{activeVideo.author}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${COLOR_MAP[activeVideo.category]?.badge}`}>
                            {activeVideo.category} Review
                        </span>
                    </div>
                    <button 
                        onClick={() => setActiveVideo(null)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors font-medium border border-white/10"
                    >
                        <X size={20} /> Close
                    </button>
                 </div>
                
                <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                     <VideoPlayer
                        url={activeVideo.videoUrl}
                        playing
                        onError={() => setPlayerError(true)}
                    />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};