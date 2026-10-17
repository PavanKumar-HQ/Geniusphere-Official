import React from 'react';
import { motion as motionBase } from 'framer-motion';
import { Video, Play } from 'lucide-react';
import { VideoResource } from '../types';

const motion = motionBase as any;

interface VideoMarqueeProps {
  videos: VideoResource[];
  onViewAll: () => void;
}

export const VideoMarquee: React.FC<VideoMarqueeProps> = ({ videos, onViewAll }) => {
  // Duplicate for a seamless loop
  const MARQUEE_ITEMS = [...videos, ...videos];

  return (
    <section className="py-24 relative overflow-hidden">
       {/* Header */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Latest from our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 text-glow">Video Hub</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            A sneak peek into our curated library of visual learning resources.
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden">
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-midnight to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-midnight to-transparent z-20 pointer-events-none" />

        <div className="flex gap-6 animate-scroll-slow hover:[animation-play-state:paused] w-max px-6">
          {MARQUEE_ITEMS.map((video, i) => (
            <div
              key={`${video.id}-${i}`}
              onClick={onViewAll}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onViewAll()}
              role="button"
              tabIndex={0}
              aria-label={`${video.title} - View video library`}
              className="group relative w-[320px] h-[240px] flex-shrink-0 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative h-full">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-md font-bold text-white mb-1 group-hover:text-red-400 transition-colors line-clamp-1">{video.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-1">{video.description}</p>
                </div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                        <Play className="text-white fill-white ml-1" size={20} />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* View All Button */}
      <div className="text-center mt-12">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors backdrop-blur-md flex items-center justify-center gap-2 mx-auto"
        >
            <Video size={18} /> View Full Library
        </motion.button>
      </div>
    </section>
  );
};