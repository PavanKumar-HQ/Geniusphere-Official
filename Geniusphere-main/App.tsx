
import React, { useState, useEffect } from 'react';
import { LayoutGrid, User, Menu, X, ShieldCheck, Sparkles, Video, ChevronLeft, Home, Mail, Compass } from 'lucide-react';
import { SectorTiles } from './components/SectorTiles';
import { CourseCard } from './components/CourseCard';
import { ServicesGrid } from './components/ServicesGrid';
import { DashboardPreview } from './components/DashboardPreview';
import { LoadingScreen } from './components/LoadingScreen';
import { LoginFlow } from './components/LoginFlow';
import { WhatIsGeniusphere } from './components/WhatIsGeniusphere';
import { SocialLinks, CommunityEvents } from './components/InstagramGallery';
import { InteractiveLearning } from './components/InteractiveLearning';
import { BackgroundEffects } from './components/BackgroundEffects';
import { TrainerProfile } from './components/TrainerProfile';
import { PhotoGallery } from './components/PhotoGallery';
import { VideoTestimonials } from './components/VideoTestimonials';
import { FAQSection } from './components/FAQSection';
import { EducationalResources } from './components/EducationalResources';
import { ResourcesPreview } from './components/ResourcesPreview';
import { CoursePlayer } from './components/CoursePlayer';
import { LocalCommunitySpace } from './components/LocalCommunitySpace';
import { ContactSection } from './components/ContactSection';
import { InstallPWA } from './components/InstallPWA';
import { GuidanceQuiz } from './components/GuidanceQuiz';
import { Toast } from './components/Toast';
import { SessionManager } from './components/SessionManager';
import { CybersecurityLab } from './components/cybersecurity/CybersecurityLab';
import { StudentInteractiveZone, EasterEggRobot } from './components/GamificationComponents';

import { COURSES, SECTORS, VIDEOS, GALLERY_DATA, FAQS, VIDEO_TESTIMONIALS, TRAINERS_DATA, EDUCATIONAL_RESOURCES, MOCK_AMBASSADORS } from './constants';
import { VideoResource, GalleryItem, FAQItem, VideoTestimonial, Student, EducationalResource, ResourceType, Course, Trainer, Ambassador, LearningMood } from './types';
import { motion as motionBase, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { DailyWisdom } from './components/DailyWisdom';

const motion = motionBase as any;

type View = 'home' | 'courses' | 'services' | 'resources' | 'dashboard' | 'course-player' | 'local-space';
type ViewMode = 'explorer' | 'workspace' | 'teacher';
type AppState = 'loading' | 'login' | 'app';

function App() {
  // Always start with loading screen to show animation and login options
  const [appState, setAppState] = useState<AppState>('loading');

  // Keep view preferences if you want, or reset them too. 
  // For now, I'll reset view to 'home' to ensure a fresh start flow.
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('explorer');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [authorizedDashboardMode, setAuthorizedDashboardMode] = useState<'workspace' | 'teacher'>(() => {
    const savedDashMode = localStorage.getItem('geniusphere_dashboard_mode');
    return (savedDashMode as 'workspace' | 'teacher') || 'workspace';
  });

  // Zen / Zero Pressure Features
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [mood, setMood] = useState<LearningMood>('calm');

  const handleWander = () => {
    const moods = ['video', 'blog', 'courses'];
    const random = moods[Math.floor(Math.random() * moods.length)];
    if (random === 'courses') {
      handleNavigation('courses');
      setToastMessage("Wander Result: Exploring Course Catalog");
    } else {
      handleViewLibrary(random as any);
      setToastMessage(`Wander Result: Exploring ${random === 'video' ? 'Videos' : 'Blogs'}`);
    }
  };
  const [resourceViewTab, setResourceViewTab] = useState<ResourceType>('video');

  // Dynamic Content State
  const [videos, setVideos] = useState<VideoResource[]>(VIDEOS); // Kept for legacy compatibility if needed
  const [resources, setResources] = useState<EducationalResource[]>(EDUCATIONAL_RESOURCES);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(GALLERY_DATA);
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQS);
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>(VIDEO_TESTIMONIALS);
  const [trainers, setTrainers] = useState<Trainer[]>(TRAINERS_DATA);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>(MOCK_AMBASSADORS);

  // Parallax Hooks for Hero Section
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], [0, 300]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('geniusphere_app_state', appState);
  }, [appState]);

  useEffect(() => {
    localStorage.setItem('geniusphere_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('geniusphere_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('geniusphere_dashboard_mode', authorizedDashboardMode);
  }, [authorizedDashboardMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Auto-trigger Guidance Quiz for new users
  useEffect(() => {
    const isCompleted = localStorage.getItem('geniusphere_onboarding_completed_v2');
    if (!isCompleted && appState === 'app') {
      // Small delay to let animations finish
      const timer = setTimeout(() => setShowGuidance(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleLoadingComplete = () => {
    setAppState('login');
  };

  const handleLoginComplete = (mode: ViewMode) => {
    setViewMode(mode);
    setAppState('app');

    // Check if onboarding is complete
    const isCompleted = localStorage.getItem('geniusphere_onboarding_completed');

    if (mode === 'workspace' || mode === 'teacher') {
      setAuthorizedDashboardMode(mode);
      setCurrentView('dashboard');
      // Only show wisdom if they've already onboarded
      if (isCompleted) setShowWelcomePopup(true);
    } else {
      if (!isCompleted) {
        // New User: Show Quiz First, hide Wisdom
        setShowWelcomePopup(false);
        setTimeout(() => setShowGuidance(true), 1000);
      } else {
        // Returning User: Show Wisdom
        setShowWelcomePopup(true);
      }
    }
  };

  // Sync internal navigation with Browser History for Back Button support
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        // Handle deep links or specific states if needed
        if (event.state.sector) setSelectedSector(event.state.sector);
      } else {
        // Fallback or default to home
        const hash = window.location.hash.replace('#', '') as View;
        if (['home', 'courses', 'services', 'resources', 'dashboard', 'course-player', 'local-space'].includes(hash)) {
          setCurrentView(hash);
        } else {
          setCurrentView('home');
        }
      }
    };

    // Initial load check
    const hash = window.location.hash.replace('#', '') as View;
    if (['home', 'courses', 'services', 'resources', 'dashboard', 'course-player', 'local-space'].includes(hash)) {
      setCurrentView(hash);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigation = (view: View, shouldPushState = true) => {
    setCurrentView(view);
    setActiveSimulation(null); // Ensure simulation modal closes on nav
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (shouldPushState) {
      const url = `/#${view}`;
      window.history.pushState({ view }, '', url);
    }
  };

  const handleSectorExplore = (sectorName: string) => {
    setSelectedSector(sectorName);
    // Determine target view
    const targetView: View = 'courses';
    setCurrentView(targetView);
    window.history.pushState({ view: targetView, sector: sectorName }, '', `/#${targetView}`);
  };

  // Updated to accept type for deep linking
  const handleViewLibrary = (type?: ResourceType) => {
    if (type) setResourceViewTab(type);
    handleNavigation('resources');
  }

  // Opens the specific simulation ID (legacy logic)
  const handleStartSim = (courseId: string) => {
    setActiveSimulation(courseId);
  }

  // Opens the Course Player with full module access
  const handleOpenCourse = (course: Course) => {
    setActiveCourse(course);
    handleNavigation('course-player');
  }

  const handleModeChange = () => {
    if (viewMode === 'explorer') {
      // Switch to Teacher
      setViewMode('teacher');
      handleNavigation('dashboard');
      setAuthorizedDashboardMode('teacher');
    } else if (viewMode === 'teacher') {
      // Switch to Admin
      setViewMode('workspace');
      handleNavigation('dashboard');
      setAuthorizedDashboardMode('workspace');
    } else {
      // Switch to Student
      setViewMode('explorer');
      handleNavigation('home');
    }
    setIsMobileMenuOpen(false);
  }

  const filteredCourses = selectedSector === 'All'
    ? courses
    : courses.filter(c => c.sector === selectedSector);

  const Navbar = () => {
    if (isFocusMode) return null;

    return (
      <>
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => handleNavigation('home')}
                >
                  <img
                    src="/geniusphere-logo.jpg"
                    alt="Geniusphere Logo"
                    className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform border border-white/10"
                  />
                  <span className="text-xl font-bold text-white tracking-tight group-hover:text-cyanGlow transition-colors">Geniusphere</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-8">
                {viewMode === 'explorer' && (
                  <>
                    {['home', 'courses', 'services', 'resources'].map((item) => (
                      <button
                        key={item}
                        onClick={() => handleNavigation(item as View)}
                        className={`capitalize text-sm font-medium hover:text-cyanGlow transition-colors ${currentView === item ? 'text-cyanGlow' : 'text-slate-300'}`}
                      >
                        {item}
                      </button>
                    ))}
                    <div className="h-4 w-px bg-white/10"></div>
                  </>
                )}

                <button
                  onClick={handleModeChange}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:border-cyanGlow/30"
                >
                  <div className="flex items-center gap-2">
                    {viewMode === 'explorer' ? <User size={16} className="text-blue-400" /> : <LayoutGrid size={16} className={viewMode === 'teacher' ? "text-purple-400" : "text-emerald-400"} />}
                    <span className="text-xs font-medium text-white">
                      {viewMode === 'explorer'
                        ? 'Student View'
                        : (viewMode === 'teacher' ? 'Teacher Dashboard' : 'Admin Dashboard')}
                    </span>
                  </div>
                </button>
              </div>

              <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </motion.nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="fixed top-20 left-0 right-0 z-40 bg-black/95 border-b border-white/10 px-6 overflow-hidden md:hidden"
            >
              <div className="py-4 space-y-4">
                {viewMode === 'explorer' ? (
                  <>
                    {['home', 'courses', 'services', 'resources'].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          handleNavigation(item as View);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`block w-full text-left capitalize text-sm font-medium hover:text-cyanGlow transition-colors ${currentView === item ? 'text-cyanGlow' : 'text-slate-300'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-slate-500">Admin Menu is Desktop Only</div>
                )}
                <div className="h-px w-full bg-white/10 my-2"></div>
                <button
                  onClick={() => { handleModeChange(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left bg-white/5 p-3 rounded-lg"
                >
                  {viewMode === 'explorer' ? <User size={16} className="text-blue-400" /> : <LayoutGrid size={16} className={viewMode === 'teacher' ? "text-purple-400" : "text-emerald-400"} />}
                  <span className="text-sm font-medium text-white">
                    {viewMode === 'explorer'
                      ? 'Switch to Teacher'
                      : (viewMode === 'teacher' ? 'Switch to Admin' : 'Switch to Student')}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  const Hero = () => (
    <section className="pt-40 pb-32 px-6 relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800/30 border border-white/10 backdrop-blur-md text-blue-300 text-xs font-bold uppercase tracking-widest mb-10 shadow-xl shadow-black/50"
        >
          <ShieldCheck size={14} className="text-cyanGlow" />
          <span>Verified Educational Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
          className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-[1.1] drop-shadow-2xl"
        >
          Unlock Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyanGlow to-softMint text-glow">
            Digital Potential
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-14 leading-relaxed drop-shadow-md"
        >
          Geniusphere is your gateway to future-ready skills. Master AI, Finance, and Professional Development in a verified, immersive ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('courses')}
            className="px-10 py-5 rounded-2xl bg-electric text-white font-bold shadow-2xl shadow-blue-600/30 w-full sm:w-auto flex items-center justify-center gap-3 text-lg"
          >
            Start Learning <Sparkles size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewLibrary('video')}
            className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold w-full sm:w-auto hover:border-white/20 text-lg backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Video size={20} /> Resource Hub
          </motion.button>
        </motion.div>
      </div>
    </section>
  );

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-50 selection:bg-cyanGlow/30 selection:text-white overflow-x-hidden relative">
      {/* GLOBAL BACKGROUND - Z-Index 0 */}
      <BackgroundEffects />

      {appState === 'loading' && (
        <div className="relative z-50">
          <LoadingScreen onComplete={handleLoadingComplete} />
        </div>
      )}

      {appState === 'login' && (
        <div className="relative z-40">
          <LoginFlow onComplete={handleLoginComplete} />
        </div>
      )}

      {appState === 'app' && (
        <div className="relative z-10">
          {/* Show Navbar on all pages except Course Player and Local Space. */}
          {currentView !== 'course-player' && currentView !== 'local-space' && <Navbar />}

          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              {(viewMode === 'workspace' || viewMode === 'teacher') && currentView === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="pt-20"
                >
                  <DashboardPreview
                    videos={videos} setVideos={setVideos}
                    galleryData={galleryData} setGalleryData={setGalleryData}
                    faqs={faqs} setFaqs={setFaqs}
                    testimonials={testimonials} setTestimonials={setTestimonials}
                    trainers={trainers} setTrainers={setTrainers}
                    resources={resources} setResources={setResources}
                    courses={courses} setCourses={setCourses}
                    ambassadors={ambassadors} setAmbassadors={setAmbassadors}
                    onSwitchMode={handleModeChange}
                    mode={viewMode === 'teacher' ? 'teacher' : 'admin'}
                  />
                </motion.div>
              ) : (
                <>
                  {currentView === 'home' && (
                    <motion.div
                      key="home"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Hero mood={mood} />
                      <WhatIsGeniusphere />
                      <SectorTiles onExplore={handleSectorExplore} />
                      <StudentInteractiveZone />
                      <VideoTestimonials items={testimonials} />
                      <ServicesGrid />
                      <ResourcesPreview onViewAll={handleViewLibrary} />
                      <TrainerProfile trainer={trainers[0]} />
                      <PhotoGallery galleryData={galleryData} onNavigate={handleNavigation} />
                      <CommunityEvents ambassadors={ambassadors} />
                      <FAQSection items={faqs} />
                      <SocialLinks />
                      <ContactSection />
                    </motion.div>
                  )}

                  {currentView === 'course-player' && activeCourse && (
                    <motion.div
                      key="course-player"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CoursePlayer course={activeCourse} onExit={() => handleNavigation('courses')} />
                    </motion.div>
                  )}

                  {currentView === 'local-space' && (
                    <motion.div
                      key="local-space"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <LocalCommunitySpace onExit={() => handleNavigation('home')} />
                    </motion.div>
                  )}

                  {currentView === 'courses' && (
                    <motion.div
                      key="courses"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="pt-32 pb-20 container mx-auto px-6"
                    >
                      <button onClick={() => handleNavigation('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10"><ChevronLeft size={16} /></div>
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
                      </button>

                      <div className="mb-12">
                        <h2 className="text-4xl font-bold text-white mb-8">Course Catalog</h2>

                        <div className="flex flex-wrap gap-3 mb-12">
                          {['All', ...SECTORS.map(s => s.name)].map(sector => (
                            <button
                              key={sector}
                              onClick={() => setSelectedSector(sector)}
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedSector === sector
                                ? 'bg-electric border-electric text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                              {sector}
                            </button>
                          ))}
                        </div>

                        <motion.div
                          layout
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                          <AnimatePresence>
                            {filteredCourses.map(course => (
                              <CourseCard
                                key={course.course_id}
                                course={course}
                                onStartSim={handleStartSim}
                                onClick={handleOpenCourse}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {currentView === 'services' && (
                    <motion.div
                      key="services"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="pt-32 pb-20 container mx-auto px-6"
                    >
                      <button onClick={() => handleNavigation('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10"><ChevronLeft size={16} /></div>
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
                      </button>
                      <ServicesGrid />
                    </motion.div>
                  )}

                  {currentView === 'resources' && (
                    <motion.div
                      key="resources"
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <EducationalResources
                        resources={resources}
                        onNavigate={handleNavigation}
                        initialTab={resourceViewTab}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </main>

          {/* Interactive Learning Modal */}
          <AnimatePresence>
            {activeSimulation === 'cyber-lab' ? (
              <motion.div
                key="cyber-lab"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[1000]"
              >
                <CybersecurityLab onClose={() => setActiveSimulation(null)} />
              </motion.div>
            ) : activeSimulation && (
              <InteractiveLearning
                key={activeSimulation}
                simulationId={activeSimulation}
                onClose={() => setActiveSimulation(null)}
                onNavigate={handleNavigation}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showGuidance && viewMode === 'explorer' && (
              <GuidanceQuiz
                onClose={() => {
                  setShowGuidance(false);
                  // Even if they close/skip, let's show them the wisdom card now
                  setTimeout(() => setShowWelcomePopup(true), 500);
                }}
                onComplete={(answers) => {
                  setShowGuidance(false);
                  localStorage.setItem('geniusphere_onboarding_completed_v2', 'true');

                  // Simple Recommendation Logic (No API)
                  const interests = answers.interests || [];
                  let recommendedSector = 'Professional'; // Default

                  if (interests.some((i: string) => i.includes('Finance') || i.includes('money'))) {
                    recommendedSector = 'Finance';
                  } else if (interests.some((i: string) => i.includes('website') || i.includes('Cybersecurity') || i.includes('AI'))) {
                    recommendedSector = 'Technology';
                  }

                  // Apply Recommendation
                  setToastMessage(`Based on your goal to "${answers.goal || 'learn'}", we recommend starting with ${recommendedSector} courses.`);
                  setSelectedSector(recommendedSector);
                  handleNavigation('courses');

                  // Now show the wisdom card
                  setTimeout(() => setShowWelcomePopup(true), 1500);
                }}
              />
            )}
          </AnimatePresence>

          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
          {viewMode === 'explorer' && (
            <DailyWisdom
              isOpen={showWelcomePopup}
              onClose={() => setShowWelcomePopup(false)}
            />
          )}

          {/* ZenHub Removed */}
          <SessionManager
            currentMood={mood}
            onWander={handleWander}
            onExplore={() => handleNavigation('courses')}
          />

          <InstallPWA />
          {/* <AiAssistant /> */}
          <EasterEggRobot />

          {currentView !== 'course-player' && currentView !== 'local-space' && (
            <footer className="bg-black/80 backdrop-blur-md border-t border-white/5 py-16 text-center relative z-10">
              <div className="container mx-auto px-6">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <img
                    src="/images/geniusphere-logo.jpg"
                    alt="Geniusphere Logo"
                    className="w-16 h-16 rounded-xl object-cover border border-white/10"
                  />
                  <span className="text-2xl font-bold text-white">Geniusphere</span>
                </div>

                <div className="mb-8 text-slate-500 text-sm">
                  <a href="mailto:geniusphereofficial@gmail.com" className="hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Mail size={14} /> geniusphereofficial@gmail.com
                  </a>
                </div>

                <p className="text-slate-600 text-sm">
                  © 2025 Geniusphere. Built for the next generation.
                </p>
              </div>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
