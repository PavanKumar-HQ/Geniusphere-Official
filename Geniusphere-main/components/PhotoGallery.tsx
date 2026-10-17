import React, { useState, useEffect, useRef } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Home, Folder, ArrowRight, X } from 'lucide-react';
import { GalleryItem } from '../types';
import { BackgroundEffects } from './BackgroundEffects';

const motion = motionBase as any;

interface PhotoGalleryProps {
  galleryData: GalleryItem[];
  onNavigate: (view: any) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ galleryData, onNavigate }) => {
  const [activeGallery, setActiveGallery] = useState<GalleryItem | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Group data by School Name
  const groupedData = galleryData.reduce((acc, item) => {
    const folderName = item.schoolName || 'Uncategorized';
    if (!acc[folderName]) acc[folderName] = [];
    acc[folderName].push(item);
    return acc;
  }, {} as Record<string, GalleryItem[]>);

  const folders = Object.keys(groupedData);

  useEffect(() => {
    document.body.style.overflow = activeGallery || activeFolder ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeGallery, activeFolder]);

  if (!galleryData || galleryData.length === 0) return null;

  return (
    <>
      <section className="py-24 relative bg-transparent overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-2 block">
              School Map
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Galleries</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mt-4">
              Explore memorable moments from our partner institutions
            </p>
          </motion.div>

          {/* Folder Grid View */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {folders.map((folderName, index) => {
              const items = groupedData[folderName];
              const coverImage = items[0]?.marqueeImageUrl;
              const count = items.length;

              return (
                <motion.div
                  key={folderName}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveFolder(folderName)}
                  className="group cursor-pointer relative"
                >
                  {/* Folder Tab Effect */}
                  <div className="absolute -top-3 left-0 w-32 h-8 bg-slate-800 rounded-t-xl border-t border-l border-r border-white/10 z-0 group-hover:bg-slate-700 transition-colors" />

                  <div className="relative z-10 bg-slate-800 border border-white/10 rounded-xl rounded-tl-none p-4 overflow-hidden group-hover:border-purple-500/50 transition-all shadow-xl hover:shadow-purple-900/20">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4 relative bg-gradient-to-br from-purple-900/40 to-slate-900/40">
                      {coverImage ? (
                        <>
                          <motion.img
                            src={coverImage}
                            alt={folderName}
                            className="w-full h-full object-cover opacity-80"
                            whileHover={{ scale: 1.1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            onError={(e) => {
                              // Hide broken image and show gradient background
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera size={48} className="text-purple-400/30" />
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 z-10">
                        <Camera size={12} /> {count} Events
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Folder size={20} className="text-purple-400" /> {folderName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">View collection</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all text-slate-400">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Category Modal (Level 2: The Events inside a Category) */}
      <AnimatePresence>
        {activeFolder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <BackgroundEffects />
            </div>

            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl relative z-50 pointer-events-auto">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveFolder(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Folder className="text-purple-400" size={24} /> {activeFolder}
                </h2>
              </div>
              <span className="text-sm text-slate-500 hidden md:block">{groupedData[activeFolder]?.length} Events in this folder</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="visible"
              >
                {groupedData[activeFolder].map((item, i) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setActiveGallery(item)}
                    className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-purple-900/30"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-slate-900/40">
                      <motion.img
                        src={item.marqueeImageUrl}
                        alt={item.schoolName}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4">
                        {/* Display Event Category/Name instead of School Name inside the folder view */}
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{item.eventCategory}</h3>
                        <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal (Level 3: The Photos inside an Event) */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-black flex flex-col overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <BackgroundEffects />
            </div>

            <div className="p-6 flex items-center justify-between absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
              <button
                onClick={() => setActiveGallery(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold backdrop-blur-md flex items-center gap-2 border border-white/10 transition-all cursor-pointer relative z-50"
              >
                <ChevronLeft size={18} /> Back to Events
              </button>
              <h3 className="text-white font-bold text-lg hidden md:block">{activeGallery.schoolName}</h3>
            </div>

            <div className="flex-1 overflow-y-auto pt-24 pb-12 px-4 md:px-12 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{activeGallery.schoolName}</h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">{activeGallery.description}</p>
                </div>

                <motion.div
                  className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {activeGallery.detailImageUrls?.map((url, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 50, scale: 0.9 },
                        visible: { opacity: 1, y: 0, scale: 1 }
                      }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      onClick={() => setSelectedImage(url)}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative group rounded-xl overflow-hidden break-inside-avoid shadow-xl bg-white/5 border border-white/5 cursor-pointer backdrop-blur-sm"
                    >
                      <motion.img
                        src={url}
                        alt={`Detail ${idx}`}
                        className="w-full h-auto"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </motion.div>

                {(!activeGallery.detailImageUrls || activeGallery.detailImageUrls.length === 0) && (
                  <div className="text-center py-20 text-slate-500">No photos found.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal (Level 4: Full Screen Image) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[70] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            >
              <X size={24} />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Full screen view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};