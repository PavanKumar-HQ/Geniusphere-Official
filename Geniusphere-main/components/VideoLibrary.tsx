import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Video, Play, ChevronLeft, X, AlertCircle } from 'lucide-react';
import { VideoResource, SectorType } from '../types';
import { VideoPlayer } from './VideoPlayer';

const motion = motionBase as any;

interface VideoLibraryProps {
  videos: VideoResource[];
  onNavigate?: (view: any) => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ videos, onNavigate }) => {
  const [activeVideo, setActiveVideo] = useState<VideoResource | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SectorType | 'All'>('All');
  const [playerError, setPlayerError] = useState(false);

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const handleNav = (view: string) => {
    setActiveVideo(null);
    if (onNavigate) onNavigate(view);
  }

  const handleVideoSelect = (video: VideoResource) => {
    setPlayerError(false); // Reset error state
    setActiveVideo(video);
  }

  return (
    <>
      <div className="pb-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
            <Video size={32} className="text-red-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Video Library</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore our curated collection of videos covering Technology, Finance, and Professional Development.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(['All', ...Object.values(SectorType)] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedCategory === category
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="visible"
        >
          {filteredVideos.map(video => (
            <motion.div
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleVideoSelect(video)}
              role="button"
              tabIndex={0}
              aria-label={`Watch video: ${video.title}`}
              className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Play className="text-white fill-white ml-1" size={20} />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">{video.duration}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-slate-400 text-xs line-clamp-2">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pt-24 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
            onClick={() => setActiveVideo(null)}
          >
            <div className="w-full max-w-5xl relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white truncate pr-4">{activeVideo.title}</h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors font-medium border border-white/10"
                >
                  <X size={20} /> Close
                </button>
              </div>

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20 border border-white/10"
              >
                <VideoPlayer
                    url={activeVideo.videoUrl}
                    playing
                    onError={() => setPlayerError(true)}
                />
              </motion.div>

              <p className="mt-6 text-slate-400 text-center max-w-3xl mx-auto text-lg leading-relaxed">
                {activeVideo.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};