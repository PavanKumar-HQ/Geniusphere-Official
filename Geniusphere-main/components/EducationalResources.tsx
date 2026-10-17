import React, { useState, useEffect } from 'react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
import { Video, FileText, BookOpen, ExternalLink, Download, Play, X, Home, User, CheckCircle, Circle, Trash2, RefreshCcw, Calendar, BarChart2 } from 'lucide-react';
import { EducationalResource, ResourceType, SectorType } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { useModuleProgress } from '../hooks/useModuleProgress';

const motion = motionBase as any;

interface EducationalResourcesProps {
  resources: EducationalResource[];
  onNavigate: (view: any) => void;
  initialTab?: ResourceType;
}

export const EducationalResources: React.FC<EducationalResourcesProps> = ({ resources, onNavigate, initialTab }) => {
  const [activeTab, setActiveTab] = useState<ResourceType>(initialTab || 'video');
  const [selectedCategory, setSelectedCategory] = useState<SectorType | 'All'>('All');
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [playerError, setPlayerError] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Progress Tracking Hook
  const trackableResources = resources.filter(r => r.type === 'video' || r.type === 'blog');
  const {
    completedIds,
    toggleCompletion,
    clearProgress,
    completedCount,
    totalModules,
    progressPercentage,
    xp,
    weeklyReport
  } = useModuleProgress(trackableResources);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const filteredResources = resources.filter(r =>
    r.type === activeTab &&
    (selectedCategory === 'All' || r.category === selectedCategory)
  );

  const handleResourceSelect = (resource: EducationalResource) => {
    setPlayerError(false);
    setSelectedResource(resource);
  };

  const tabs = [
    { id: 'video', label: 'Videos', icon: Video, color: 'text-red-500', bgColor: 'bg-red-500' },
    { id: 'blog', label: 'Blogs', icon: FileText, color: 'text-orange-500', bgColor: 'bg-orange-500' },
  ];

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{line.replace('### ', '')}</h3>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-4">{line.replace('# ', '')}</h1>;
      if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-slate-400 italic my-4 pl-4 border-l-2 border-slate-600">{line.replace(/\*/g, '')}</p>;
      if (line.match(/^\d\./)) return <li key={i} className="text-slate-300 ml-6 list-decimal my-2">{line.replace(/^\d\.\s/, '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-slate-300 leading-relaxed mb-3">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 relative z-10">

      {/* Compact Dashboard Header and Stats Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-end justify-between mb-8">
        {/* Title & Navigation Section */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group shrink-0"
              title="Back to Home"
            >
              <Home size={18} className="text-slate-400 group-hover:text-white" />
            </button>
            <h2 className="text-3xl md:text-4xl font-bold text-white truncate">Educational Resources</h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base max-w-xl pl-1">Curated content to support your learning journey across all mediums.</p>
        </div>

        {/* Stats Bar & Actions */}
        <div className="w-full lg:w-auto flex flex-col items-end gap-2">
          <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 p-3 pr-4 rounded-xl flex items-center gap-4 shadow-xl w-full lg:min-w-[320px]">
            {/* XP Badge */}
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/20 shrink-0">
              <span className="text-base">⚡</span>
              <span className="text-[10px] font-bold text-yellow-500">{xp} XP</span>
            </div>

            {/* Progress Line */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
                <span className="text-slate-400 flex items-center gap-1">Progress</span>
                <span className="text-cyan-400">{completedCount}/{totalModules}</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Report Button */}
            <button
              onClick={() => setIsReportOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg border border-white/10 transition-colors shrink-0"
              title="View Weekly Report"
            >
              <BarChart2 size={18} />
            </button>
          </div>

          <button
            onClick={clearProgress}
            className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/5 mr-1"
          >
            <Trash2 size={10} /> Clear My Data
          </button>
        </div>
      </div>

      {/* Streamlined Controls Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex bg-black/20 p-1 rounded-xl w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ResourceType)}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all w-full md:w-auto ${activeTab === tab.id
                ? `${tab.bgColor} text-white shadow-lg`
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 border-t md:border-t-0 border-white/5 pt-2 md:pt-0 w-full md:w-auto no-scrollbar">
          {(['All', ...Object.values(SectorType)] as const).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${selectedCategory === category
                ? 'bg-white/10 border-white/30 text-white'
                : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredResources.map(resource => {
            const isCompleted = completedIds.includes(resource.id);

            return (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isCompleted ? 0.75 : 1, scale: 1, filter: isCompleted ? 'grayscale(0.5)' : 'none' }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-white/5 transition-all duration-300 
                  ${resource.type === 'video' ? 'hover:border-red-500/30' : resource.type === 'blog' ? 'hover:border-orange-500/30' : 'hover:border-blue-500/30'}
                  ${isCompleted ? 'bg-slate-900/40' : ''}
                `}
              >
                {/* Completion Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompletion(resource.id);
                  }}
                  className={`absolute top-3 left-3 z-30 p-1.5 rounded-full backdrop-blur-md transition-all shadow-lg
                    ${isCompleted
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
                      : 'bg-black/60 text-slate-400 hover:text-white border border-white/10 hover:scale-110'
                    }`}
                  title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                >
                  {isCompleted ? <CheckCircle size={18} className="fill-current" /> : <Circle size={18} />}
                </button>

                {/* Card Thumbnail Area */}
                <div
                  className="relative aspect-video overflow-hidden bg-slate-800 cursor-pointer"
                  onClick={() => handleResourceSelect(resource)}
                >
                  {resource.type === 'video' ? (
                    <>
                      <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="text-white fill-white ml-1" size={20} />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">{resource.duration}</span>
                    </>
                  ) : resource.type === 'blog' ? (
                    <>
                      {resource.thumbnailUrl ? (
                        <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-900/40 to-slate-900" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText size={40} className="text-white/80 drop-shadow-lg group-hover:scale-110 transition-transform" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-slate-900 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <BookOpen size={40} className="text-blue-400 group-hover:scale-110 transition-transform relative z-10" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-20">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md text-white uppercase tracking-wider shadow-lg
                        ${resource.type === 'video' ? 'bg-red-500' : resource.type === 'blog' ? 'bg-orange-500' : 'bg-blue-500'}
                      `}>
                      {resource.type}
                    </span>
                  </div>
                </div>

                <div
                  className="p-5 flex-1 flex flex-col cursor-pointer"
                  onClick={() => handleResourceSelect(resource)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-wider">{resource.category}</span>
                    {isCompleted && <span className="text-[10px] text-green-400 font-bold flex items-center gap-1"><CheckCircle size={10} /> COMPLETED</span>}
                  </div>
                  <h3 className={`font-bold text-base mb-2 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors ${isCompleted ? 'text-slate-400 decoration-slate-600' : 'text-white'}`}>
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mb-4 flex-1">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-3 mt-auto">
                    <span className="flex items-center gap-1"><User size={12} /> {resource.author}</span>
                    {resource.date && <span className="flex items-center gap-1"><Calendar size={12} /> {resource.date}</span>}
                    {resource.fileSize && <span className="flex items-center gap-1"><Download size={12} /> {resource.fileSize}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* UNIFIED RESOURCE MODAL (Video/Blog Reader) */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-800/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-2 rounded-lg ${selectedResource.type === 'video' ? 'bg-red-500/20 text-red-400' :
                    selectedResource.type === 'blog' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {selectedResource.type === 'video' && <Video size={20} />}
                    {selectedResource.type === 'blog' && <FileText size={20} />}
                    {selectedResource.type === 'ebook' && <BookOpen size={20} />}
                  </div>
                  <h3 className="text-xl font-bold text-white truncate">{selectedResource.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      toggleCompletion(selectedResource.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border
                        ${completedIds.includes(selectedResource.id)
                        ? 'bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-600/30'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {completedIds.includes(selectedResource.id) ? <CheckCircle size={18} /> : <Circle size={18} />}
                    <span className="hidden sm:inline">{completedIds.includes(selectedResource.id) ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors font-medium border border-white/10 shrink-0"
                  >
                    <X size={20} /> <span className="hidden sm:inline">Close</span>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto custom-scrollbar p-6">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 mb-8 bg-black">
                  {selectedResource.type === 'video' ? (
                    <div className="aspect-video">
                      <VideoPlayer
                        url={selectedResource.url}
                        playing
                        onError={() => setPlayerError(true)}
                        onEnded={() => {
                          if (!completedIds.includes(selectedResource.id)) {
                            toggleCompletion(selectedResource.id);
                          }
                        }}
                      />
                    </div>
                  ) : selectedResource.type === 'blog' && selectedResource.content ? (
                    <div className="bg-slate-900 p-8 md:p-12">
                      <div className="max-w-3xl mx-auto prose prose-invert prose-lg">
                        {renderContent(selectedResource.content)}
                      </div>
                      <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 text-center">
                        <p className="text-slate-500 text-sm mb-4">Original source: Reddit</p>
                        <a href={selectedResource.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
                          View original thread <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ) : selectedResource.type === 'blog' ? (
                    <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center text-center p-10 relative">
                      {selectedResource.thumbnailUrl && (
                        <div className="absolute inset-0 opacity-20">
                          <img src={selectedResource.thumbnailUrl} className="w-full h-full object-cover blur-sm" alt="" />
                        </div>
                      )}
                      <div className="relative z-10 bg-slate-900/90 p-8 rounded-3xl border border-white/10 max-w-lg">
                        <FileText size={64} className="text-orange-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Read on Source</h2>
                        <a href={selectedResource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg transition-all"
                          onClick={() => {
                            if (!completedIds.includes(selectedResource.id)) {
                              toggleCompletion(selectedResource.id);
                            }
                          }}
                        >
                          Read Now <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center text-center p-10 relative">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-slate-900"></div>
                      <div className="relative z-10 bg-slate-900/90 p-8 rounded-3xl border border-white/10 max-w-lg">
                        <BookOpen size={64} className="text-blue-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Download eBook</h2>
                        <p className="text-slate-400 mb-8">Access the PDF via Google Drive.</p>
                        <a href={selectedResource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg transition-all"
                          onClick={() => {
                            if (!completedIds.includes(selectedResource.id)) {
                              toggleCompletion(selectedResource.id);
                            }
                          }}
                        >
                          Download <Download size={18} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-white font-bold text-lg">About this content</h4>
                    <p className="text-slate-300 text-base leading-relaxed">{selectedResource.description}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 space-y-4">
                    <div className="flex justify-between"><span className="text-slate-500 text-sm">Author</span><span className="text-white text-sm">{selectedResource.author}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 text-sm">Category</span><span className="text-cyan-400 text-sm">{selectedResource.category}</span></div>
                    {selectedResource.date && <div className="flex justify-between"><span className="text-slate-500 text-sm">Date</span><span className="text-white text-sm">{selectedResource.date}</span></div>}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WEEKLY REPORT MODAL */}
      <AnimatePresence>
        {isReportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsReportOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsReportOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <BarChart2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Weekly Report</h3>
                  <p className="text-slate-500 text-xs">Your learning velocity</p>
                </div>
              </div>

              <div className="flex items-end justify-between h-32 gap-2 my-8 px-2 border-b border-white/5 pb-4">
                {weeklyReport.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 relative ${day.count > 0 ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-white/5'}`}
                        style={{ height: `${Math.max(day.count * 15, 4)}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                          {day.count} Modules
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${day.date === new Date().toISOString().split('T')[0] ? 'text-white' : 'text-slate-600'}`}>
                      {day.dayName}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                  <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">Total XP</div>
                  <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                    ⚡ {xp}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                  <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">This Week</div>
                  <div className="text-2xl font-bold text-white flex items-center gap-2">
                    {weeklyReport.reduce((acc, curr) => acc + curr.count, 0)} <span className="text-xs text-slate-500 font-normal">Modules</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};