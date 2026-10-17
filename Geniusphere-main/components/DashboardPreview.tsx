import React, { useState, useEffect } from 'react';
import {
    Bell, Lock, User, Video, Image as ImageIcon, Layout, Library, Plus, Trash2,
    BookOpen, CheckCircle, Clock, Save, Edit, X, FileText, MessageCircle, HelpCircle,
    List, Calendar, PieChart, Activity, Users, School, GraduationCap, Play, LogOut, Loader2,
    LayoutGrid, Settings, Search, BarChart3, Megaphone, Trophy, Download, Sparkles, Brain, Shield, Globe, Copy, Menu
} from 'lucide-react';
import { motion as motionBase, AnimatePresence } from 'framer-motion';
// Removed resource imports
import {
    VideoResource, SectorType, GalleryItem, FAQItem, VideoTestimonial, Student,
    EducationalResource, ResourceType, TestimonialCategory, CurriculumItem, PlanStatus, Course, Trainer, Ambassador
} from '../types';
import { ACTION_PLAN_DATA } from '../constants';
import { CourseBuilder } from './CourseBuilder';
import { DailyWisdom } from './DailyWisdom';
import { TeachingHubSection } from './TeachingHubSection';
import { ClaritySection } from './ClaritySection';



const motion = motionBase as any;

interface DashboardPreviewProps {
    videos: VideoResource[];
    setVideos: React.Dispatch<React.SetStateAction<VideoResource[]>>;
    galleryData: GalleryItem[];
    setGalleryData: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
    faqs: FAQItem[];
    setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
    testimonials: VideoTestimonial[];
    setTestimonials: React.Dispatch<React.SetStateAction<VideoTestimonial[]>>;
    trainers: Trainer[];
    setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>;
    resources: EducationalResource[];
    setResources: React.Dispatch<React.SetStateAction<EducationalResource[]>>;
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    ambassadors: Ambassador[];
    setAmbassadors: React.Dispatch<React.SetStateAction<Ambassador[]>>;
    onSwitchMode: () => void;
    mode?: 'admin' | 'teacher';
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
    videos, setVideos, galleryData, setGalleryData, faqs, setFaqs, testimonials, setTestimonials,
    trainers, setTrainers, resources, setResources, courses, setCourses, ambassadors, setAmbassadors, onSwitchMode, mode = 'admin'
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    // Tabs
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'trainers' | 'courses' | 'resources' | 'ambassadors' | 'teaching-hub' | 'awareness' | 'tools'>('overview');
    const [activeSubTab, setActiveSubTab] = useState<'video' | 'blog' | 'ebook' | 'gallery' | 'faqs' | 'reviews'>('video');

    // Realtime Analytics State
    const [statsData, setStatsData] = useState({
        revenue: '$24,500',
        students: '1,234',
        courses: String(courses?.length || 0),
        trainers: String(trainers?.length || 0)
    });

    // Reset tab when mode changes
    useEffect(() => {
        if (mode === 'teacher') {
            setActiveTab('teaching-hub');
        } else {
            setActiveTab('overview');
        }
    }, [mode]);

    // New Feature Data
    const [curriculumItems, setCurriculumItems] = useState<CurriculumItem[]>(ACTION_PLAN_DATA);
    const [newPlanItem, setNewPlanItem] = useState<Partial<CurriculumItem>>({});
    const [showAddPlan, setShowAddPlan] = useState(false);

    // Course Builder Modal
    const [showCourseBuilder, setShowCourseBuilder] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Resource Management
    const [showAddResource, setShowAddResource] = useState(false);
    const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
    const [newResource, setNewResource] = useState<Partial<EducationalResource>>({
        title: '', url: '', type: 'video', category: SectorType.TECHNOLOGY, description: '', author: ''
    });

    // Testimonial Management
    const [showAddTestimonial, setShowAddTestimonial] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState<Partial<VideoTestimonial>>({
        quote: '', author: '', role: '', videoThumbnail: '', videoUrl: '', flagCode: 'USA', category: 'Parent'
    });

    // FAQ Management
    const [showAddFaq, setShowAddFaq] = useState(false);
    const [newFaq, setNewFaq] = useState<Partial<FAQItem>>({ question: '', answer: '' });

    // Gallery Management
    const [showAddGallery, setShowAddGallery] = useState(false);
    const [newGallery, setNewGallery] = useState<Partial<GalleryItem>>({ schoolName: '', description: '', marqueeImageUrl: '' });

    // Trainer State
    const [showAddTrainer, setShowAddTrainer] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState<string | null>(null);
    const [newTrainer, setNewTrainer] = useState<Partial<Trainer>>({
        name: '', title: '', bio: '', imageUrl: '', qualifications: []
    });
    const [newQual, setNewQual] = useState({ title: '', imageUrl: '', certificateUrl: '' });

    // Ambassador State
    const [showAddAmbassador, setShowAddAmbassador] = useState(false);
    const [newAmbassador, setNewAmbassador] = useState<Partial<Ambassador>>({ name: '', college: '', points: 0, rank: 0, avatarUrl: '' });

    // Welcome Popup State
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);

    // Teacher Hub State - Moved to specialized components (TeachingHubSection, ClaritySection)

    const handleLogin = () => {
        const adminPass = "geniusphere1231";
        const teacherPass = "teacher123";

        if (mode === 'admin' && password === adminPass) {
            setIsAuthenticated(true);
            setError("");
        } else if (mode === 'teacher' && password === teacherPass) {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Incorrect password.");
        }
    };

    const handleCourseSave = (newCourse: Course) => {
        if (editingCourse) {
            setCourses(prev => prev.map(c => c.course_id === newCourse.course_id ? newCourse : c));
            setEditingCourse(null);
        } else {
            const courseWithId = {
                ...newCourse,
                course_id: `c_${Date.now()}`,
                level: 'Beginner', // Default
                duration: `${newCourse.modules?.length || 0} Modules`
            } as Course;
            setCourses(prev => [...prev, courseWithId]);
        }
        setShowCourseBuilder(false);
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        setShowCourseBuilder(true);
    };

    // --- Handlers ---
    const handleAddPlanItem = () => {
        if (!newPlanItem.topic) return;
        const newItem: CurriculumItem = {
            id: `plan_${Date.now()}`,
            topic: newPlanItem.topic || 'Untitled Topic',
            course: newPlanItem.course || 'General',
            assignedTo: newPlanItem.assignedTo || 'Unassigned',
            dueDate: newPlanItem.dueDate || new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        setCurriculumItems([...curriculumItems, newItem]);
        setShowAddPlan(false);
        setNewPlanItem({});
    };

    const handleUpdatePlanStatus = (id: string, newStatus: PlanStatus) => {
        setCurriculumItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    const handleAddResource = () => {
        if (!newResource.title || !newResource.url) return;

        if (editingResourceId) {
            setResources(prev => prev.map(r => r.id === editingResourceId ? { ...r, ...newResource } as EducationalResource : r));
            setEditingResourceId(null);
        } else {
            const resource: EducationalResource = {
                id: `res_${Date.now()}`,
                title: newResource.title,
                url: newResource.url,
                type: newResource.type || 'video',
                category: newResource.category || SectorType.TECHNOLOGY,
                description: newResource.description || '',
                author: newResource.author || 'Geniusphere Admin',
                thumbnailUrl: newResource.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500',
                duration: newResource.type === 'video' ? '10:00' : undefined,
                fileSize: newResource.type === 'ebook' ? '2 MB' : undefined,
                date: 'Just now'
            };
            setResources(prev => [resource, ...prev]);
        }
        setShowAddResource(false);
        setNewResource({ title: '', url: '', type: 'video', category: SectorType.TECHNOLOGY, description: '', author: '' });
    };

    const handleEditResource = (res: EducationalResource) => {
        setNewResource(res);
        setEditingResourceId(res.id);
        setShowAddResource(true);
    };

    const handleAddFaq = () => {
        if (!newFaq.question || !newFaq.answer) return;
        setFaqs(prev => [...prev, { question: newFaq.question!, answer: newFaq.answer! }]);
        setShowAddFaq(false);
        setNewFaq({ question: '', answer: '' });
    }

    const handleAddGallery = () => {
        if (!newGallery.schoolName) return;
        const item: GalleryItem = {
            id: `gal_${Date.now()}`,
            schoolName: newGallery.schoolName!,
            description: newGallery.description || '',
            marqueeImageUrl: newGallery.marqueeImageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800',
            detailImageUrls: []
        }
        setGalleryData(prev => [...prev, item]);
        setShowAddGallery(false);
        setNewGallery({ schoolName: '', description: '', marqueeImageUrl: '' });
    }

    const handleAddTrainer = () => {
        if (!newTrainer.name || !newTrainer.title) return;

        const qualifications = [];
        if (newQual.title) {
            qualifications.push({
                title: newQual.title,
                imageUrl: newQual.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400',
                certificateUrl: newQual.certificateUrl
            });
        }

        const trainer: Trainer = {
            id: `tr_${Date.now()}`,
            name: newTrainer.name!,
            title: newTrainer.title!,
            bio: newTrainer.bio || '',
            imageUrl: newTrainer.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
            qualifications: qualifications
        };
        setTrainers(prev => [...prev, trainer]);
        setShowAddTrainer(false);
        setNewTrainer({ name: '', title: '', bio: '', imageUrl: '' });
        setNewQual({ title: '', imageUrl: '', certificateUrl: '' });
    };

    const handleAddAmbassador = () => {
        if (!newAmbassador.name || !newAmbassador.college) return;
        const ambassador: Ambassador = {
            id: `amb_${Date.now()}`,
            name: newAmbassador.name!,
            college: newAmbassador.college!,
            points: newAmbassador.points || 0,
            rank: ambassadors.length + 1,
            avatarUrl: newAmbassador.avatarUrl || 'https://i.pravatar.cc/150'
        };
        // Recalculate ranks after adding
        const updated = [...ambassadors, ambassador].sort((a, b) => b.points - a.points).map((a, i) => ({ ...a, rank: i + 1 }));
        setAmbassadors(updated);
        setShowAddAmbassador(false);
        setNewAmbassador({ name: '', college: '', points: 0, avatarUrl: '' });
    };

    const handleUpdatePoints = (id: string, points: number) => {
        const updated = ambassadors.map(a => a.id === id ? { ...a, points } : a)
            .sort((a, b) => b.points - a.points)
            .map((a, i) => ({ ...a, rank: i + 1 }));
        setAmbassadors(updated);
    };


    // --- LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl text-center"
                >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Lock size={32} className="text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{mode === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}</h2>
                    <p className="text-slate-400 text-sm mb-6">Enter secure access code to manage platform.</p>
                    <input
                        type="password"
                        placeholder="Access Code"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-center mb-4 focus:border-cyan-400 outline-none transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
                    <button onClick={handleLogin} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all">Unlock Console</button>
                </motion.div>
            </div>
        );
    }

    // --- DASHBOARD LAYOUT ---
    return (
        <div className="min-h-screen text-white flex overflow-hidden font-sans relative">
            {/* Glassmorphism Background */}
            <div className="fixed inset-0 z-0 bg-[#0a0e1a]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-950/40 via-[#0a0e1a] to-[#0a0e1a]" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            {/* Course Builder Modal */}
            <AnimatePresence>
                {showCourseBuilder && (
                    <CourseBuilder
                        onClose={() => { setShowCourseBuilder(false); setEditingCourse(null); }}
                        onSave={handleCourseSave}
                        initialData={editingCourse || undefined}
                    />
                )}
            </AnimatePresence>

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white/[0.03] backdrop-blur-2xl border-r border-white/10 flex-col hidden md:flex relative z-10">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img src="/geniusphere-logo.jpg" alt="Geniusphere" className={`w-10 h-10 rounded-xl object-cover shadow-lg ${mode === 'teacher' ? 'shadow-purple-500/40 brightness-110 saturate-150 hue-rotate-15' : 'shadow-blue-500/20'}`} />
                        <span className="font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Geniusphere</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{mode === 'admin' ? 'Admin Console v2.0' : 'Teacher Console v1.0'}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Main Menu</div>

                    {mode === 'admin' ? [
                        { id: 'overview', icon: LayoutGrid, label: 'Dashboard' },
                        { id: 'courses', icon: BookOpen, label: 'Course Catalog' },
                        { id: 'curriculum', icon: List, label: 'Curriculum Plan' },
                        { id: 'trainers', icon: Users, label: 'Trainers' },
                        { id: 'ambassadors', icon: Trophy, label: 'Ambassadors' },
                        { id: 'resources', icon: Library, label: 'Resource Library' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-medium'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    )) : [
                        { id: 'teaching-hub', icon: MessageCircle, label: 'Teaching Hub' },
                        { id: 'awareness', icon: Shield, label: 'Awareness Topics' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 font-medium'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={onSwitchMode} className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm mb-2">
                        <Layout size={16} /> Student View
                    </button>
                    <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors text-sm">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* --- MOBILE SIDEBAR DRAWER --- */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <>
                        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileNavOpen(false)} />
                        <motion.aside
                            initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] border-r border-white/10 flex flex-col md:hidden shadow-2xl shadow-black/80"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img src="/geniusphere-logo.jpg" alt="Geniusphere" className={`w-10 h-10 rounded-xl object-cover shadow-lg ${mode === 'teacher' ? 'shadow-purple-500/40 brightness-110 saturate-150 hue-rotate-15' : 'shadow-blue-500/20'}`} />
                                    <span className="font-bold text-lg text-white">Geniusphere</span>
                                </div>
                                <button onClick={() => setIsMobileNavOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>

                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Main Menu</div>

                                {mode === 'admin' ? [
                                    { id: 'overview', icon: LayoutGrid, label: 'Dashboard' },
                                    { id: 'courses', icon: BookOpen, label: 'Course Catalog' },
                                    { id: 'curriculum', icon: List, label: 'Curriculum Plan' },
                                    { id: 'trainers', icon: Users, label: 'Trainers' },
                                    { id: 'ambassadors', icon: Trophy, label: 'Ambassadors' },
                                    { id: 'resources', icon: Library, label: 'Resource Library' },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id as any); setIsMobileNavOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === item.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 font-medium'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        <span>{item.label}</span>
                                    </button>
                                )) : [
                                    { id: 'teaching-hub', icon: MessageCircle, label: 'Teaching Hub' },
                                    { id: 'awareness', icon: Shield, label: 'Awareness Topics' },
                                    // { id: 'tools', icon: Settings, label: 'Teacher Tools' },
                                ].map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id as any); setIsMobileNavOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === item.id
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 font-medium'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-white/5">
                                <button onClick={onSwitchMode} className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm mb-2">
                                    <Layout size={16} /> Student View
                                </button>
                                <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors text-sm">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            < main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10" >
                {/* Top Header */}
                <header className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-2xl flex items-center justify-between px-6 shrink-0 z-20 relative">
                    <div className="md:hidden flex items-center gap-3">
                        <button onClick={() => setIsMobileNavOpen(true)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Menu size={24} />
                        </button>
                        <img src="/geniusphere-logo.jpg" alt="Geniusphere" className={`w-8 h-8 rounded-lg object-cover ${mode === 'teacher' ? 'brightness-110 saturate-150 hue-rotate-15' : ''}`} />
                    </div>

                    {/* Breadcrumbs or Search */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                        <span className="text-white capitalize">{activeTab}</span>
                        {activeTab === 'resources' && <span>/ {activeSubTab}</span>}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" placeholder="Search..." className="bg-black/20 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white outline-none focus:border-blue-500" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 relative">
                            <Bell size={16} className="text-slate-400" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400"></div>
                    </div>
                </header >

                {/* Content Scroll Area */}
                < div className="flex-1 overflow-y-auto custom-scrollbar p-6" >
                    <AnimatePresence mode="wait">

                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        // Only show Revenue for Admin
                                        ...(mode === 'admin' ? [{ label: 'Total Revenue', value: statsData.revenue, trend: '+12%', color: 'text-green-400', icon: BarChart3 }] : []),
                                        { label: 'Active Students', value: statsData.students, trend: '+5%', color: 'text-blue-400', icon: Users },
                                        { label: 'Courses Active', value: statsData.courses, trend: 'stable', color: 'text-purple-400', icon: BookOpen },
                                        { label: 'Trainers', value: statsData.trainers, trend: 'new', color: 'text-orange-400', icon: GraduationCap },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}><stat.icon size={20} /></div>
                                                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{stat.trend}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                            <p className="text-xs text-slate-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Realtime Analytics Console */}
                                    <div className="lg:col-span-2 p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Activity size={20} className="text-cyan-400" /> Realtime Analytics Console
                                            </h3>
                                            <span className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Live Data
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">System Metrics</label>
                                                    <div className="space-y-3">
                                                        {mode === 'admin' && (
                                                            <div>
                                                                <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Total Revenue</span> <span className="text-green-400">{statsData.revenue}</span></div>
                                                                <input
                                                                    type="text"
                                                                    value={statsData.revenue}
                                                                    onChange={(e) => setStatsData({ ...statsData, revenue: e.target.value })}
                                                                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 focus:bg-slate-800 transition-all outline-none"
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Active Students</span> <span className="text-blue-400">{statsData.students}</span></div>
                                                            <input
                                                                type="text"
                                                                value={statsData.students}
                                                                onChange={(e) => setStatsData({ ...statsData, students: e.target.value })}
                                                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:bg-slate-800 transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block">Content Metrics</label>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Active Courses</span> <span className="text-purple-400">{statsData.courses}</span></div>
                                                            <input
                                                                type="text"
                                                                value={statsData.courses}
                                                                onChange={(e) => setStatsData({ ...statsData, courses: e.target.value })}
                                                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:bg-slate-800 transition-all outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Trainers</span> <span className="text-orange-400">{statsData.trainers}</span></div>
                                                            <input
                                                                type="text"
                                                                value={statsData.trainers}
                                                                onChange={(e) => setStatsData({ ...statsData, trainers: e.target.value })}
                                                                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 focus:bg-slate-800 transition-all outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Affiliate/Referral Mini-Card */}
                                    <div className="p-6 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl border border-purple-500/20 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                                                <Users size={18} /> Affiliate Program
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Earn 10% Credit</h3>
                                            <p className="text-sm text-slate-300 mb-6">Refer a friend and you both get discounts on premium workshops.</p>
                                        </div>

                                        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center justify-between mb-4">
                                            <code className="text-purple-300 font-mono">GENIUS-PAVAN-24</code>
                                            <button className="text-xs bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white px-2 py-1 rounded transition-colors">Copy</button>
                                        </div>

                                        <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20">
                                            Invite Friends
                                        </button>
                                    </div>
                                </div>


                                {/* Motivational Quote Banner - Only for admin mode */}
                                {mode === 'admin' && (
                                    <div className="relative p-8 rounded-3xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-white/5 flex items-center justify-between overflow-hidden">
                                        <div className="relative z-10 max-w-2xl">
                                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Trophy size={16} /> Daily Wisdom</h3>
                                            <p className="text-2xl font-serif italic text-slate-200 leading-relaxed">"The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."</p>
                                            <p className="text-sm text-slate-400 mt-3 font-bold uppercase tracking-widest">— Brian Herbert</p>
                                        </div>
                                        <div className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2">
                                            <Trophy size={180} className="text-indigo-500/10 rotate-12" />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Resume Builder Widget */}
                                    <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/60 transition-colors group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Resume Builder</h3>
                                        <p className="text-sm text-slate-400 mb-4">Auto-generate a CV from your certifications.</p>
                                        <button className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-bold hover:bg-cyan-500 hover:text-white transition-all w-full">Create CV</button>
                                    </div>

                                    {/* Theme/Settings Widget */}
                                    <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/60 transition-colors group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                                            <Settings size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Display Settings</h3>
                                        <p className="text-sm text-slate-400 mb-4">Toggle Dark/Sepia/High-Contrast modes.</p>
                                        <div className="flex gap-2 w-full justify-center">
                                            <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/20 cursor-pointer" title="Dark"></div>
                                            <div className="w-6 h-6 rounded-full bg-[#fdf6e3] border border-white/20 cursor-pointer" title="Sepia"></div>
                                            <div className="w-6 h-6 rounded-full bg-white border border-black cursor-pointer" title="High Contrast"></div>
                                        </div>
                                    </div>

                                    {/* Quick Export */}
                                    <div className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-slate-800/60 transition-colors group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform">
                                            <Download size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Export Data</h3>
                                        <p className="text-sm text-slate-400 mb-4">Download your progress report.</p>
                                        <button className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-bold hover:bg-green-500 hover:text-white transition-all w-full">Download PDF</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Create Course Widget */}
                                    <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-900 to-slate-900 border border-white/10 group cursor-pointer" onClick={() => setShowCourseBuilder(true)}>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-bold text-white mb-2">Create New Course</h2>
                                            <p className="text-blue-200 max-w-md mb-6">Use our AI-powered studio to generate curriculums, quizzes, and simulations in seconds.</p>
                                            <button className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
                                                <Plus size={20} /> Launch Studio
                                            </button>
                                        </div>
                                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-10 translate-y-10">
                                            <BookOpen size={250} />
                                        </div>
                                    </div>

                                    {/* Recent Activity / Tasks */}
                                    <div className="bg-slate-800/40 border border-white/5 rounded-3xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-white">Pending Tasks</h3>
                                            <button className="text-xs text-blue-400 hover:text-white">View All</button>
                                        </div>
                                        <div className="space-y-3">
                                            {curriculumItems.slice(0, 4).map(item => (
                                                <div key={item.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <div className={`w-2 h-2 rounded-full ${item.status === 'Pending' ? 'bg-red-500' : 'bg-green-500'}`} />
                                                    <div className="flex-1 overflow-hidden">
                                                        <div className="text-sm font-medium text-white truncate">{item.topic}</div>
                                                        <div className="text-xs text-slate-500">Due: {item.dueDate}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'courses' && (
                            <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Course Catalog</h2>
                                    <button onClick={() => { setEditingCourse(null); setShowCourseBuilder(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                                        <Plus size={16} /> New Course
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {courses.map(c => (
                                        <div key={c.course_id} className="group p-5 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 hover:border-blue-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-wider">{c.sector}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditCourse(c)} className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white"><Edit size={16} /></button>
                                                    <button onClick={() => setCourses(prev => prev.filter(i => i.course_id !== c.course_id))} className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{c.title}</h3>
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{c.short_description}</p>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><List size={14} /> {c.modules?.length || 0} Modules</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {c.duration}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'trainers' && (
                            <motion.div key="trainers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Trainer Management</h2>
                                    <button onClick={() => setShowAddTrainer(!showAddTrainer)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                                        <Plus size={16} /> Add Trainer
                                    </button>
                                </div>

                                {/* Add Trainer Form */}
                                {showAddTrainer && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-900/60 p-6 rounded-2xl border border-purple-500/30 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Full Name" value={newTrainer.name} onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })} />
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Title" value={newTrainer.title} onChange={e => setNewTrainer({ ...newTrainer, title: e.target.value })} />
                                        <input className="md:col-span-2 bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Image URL" value={newTrainer.imageUrl} onChange={e => setNewTrainer({ ...newTrainer, imageUrl: e.target.value })} />
                                        <textarea className="md:col-span-2 bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Bio" rows={3} value={newTrainer.bio} onChange={e => setNewTrainer({ ...newTrainer, bio: e.target.value })} />

                                        <div className="md:col-span-2 border-t border-white/10 pt-4 mt-2">
                                            <h4 className="text-white text-sm font-bold mb-3">Add Qualification</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Cert Title" value={newQual.title} onChange={e => setNewQual({ ...newQual, title: e.target.value })} />
                                                <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Cert Image URL" value={newQual.imageUrl} onChange={e => setNewQual({ ...newQual, imageUrl: e.target.value })} />
                                                <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Cert Link URL" value={newQual.certificateUrl} onChange={e => setNewQual({ ...newQual, certificateUrl: e.target.value })} />
                                            </div>
                                        </div>

                                        <button onClick={handleAddTrainer} className="bg-purple-600 rounded-xl font-bold text-white md:col-span-2 py-3 mt-2">Save Profile</button>
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    {trainers.map(t => (
                                        <div key={t.id} className="flex items-center gap-4 p-4 bg-slate-800/40 border border-white/5 rounded-2xl hover:bg-slate-800/60 transition-colors">
                                            <img src={t.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" alt={t.name} />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white text-lg">{t.name}</h3>
                                                <p className="text-purple-400 text-sm">{t.title}</p>
                                                <p className="text-slate-400 text-xs mt-1 line-clamp-1">{t.bio}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setTrainers(prev => prev.filter(trainer => trainer.id !== t.id))} className="p-2 text-slate-500 hover:text-red-400 bg-white/5 rounded-lg hover:bg-white/10"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'ambassadors' && (
                            <motion.div key="ambassadors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Ambassador Leaderboard</h2>
                                    <button onClick={() => setShowAddAmbassador(!showAddAmbassador)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                                        <Plus size={16} /> Add Ambassador
                                    </button>
                                </div>

                                {showAddAmbassador && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-900/60 p-6 rounded-2xl border border-yellow-500/30 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Student Name" value={newAmbassador.name} onChange={e => setNewAmbassador({ ...newAmbassador, name: e.target.value })} />
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="College / University" value={newAmbassador.college} onChange={e => setNewAmbassador({ ...newAmbassador, college: e.target.value })} />
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Initial Points" type="number" value={newAmbassador.points} onChange={e => setNewAmbassador({ ...newAmbassador, points: parseInt(e.target.value) || 0 })} />
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Avatar URL (Optional)" value={newAmbassador.avatarUrl} onChange={e => setNewAmbassador({ ...newAmbassador, avatarUrl: e.target.value })} />
                                        <button onClick={handleAddAmbassador} className="bg-yellow-600 rounded-xl font-bold text-white md:col-span-2 py-3">Add to Leaderboard</button>
                                    </motion.div>
                                )}

                                <div className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-bold">
                                            <tr>
                                                <th className="p-4">Rank</th>
                                                <th className="p-4">Student</th>
                                                <th className="p-4">College</th>
                                                <th className="p-4">Points</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {ambassadors.map((amb) => (
                                                <tr key={amb.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${amb.rank === 1 ? 'bg-yellow-500 text-black' :
                                                            amb.rank === 2 ? 'bg-slate-300 text-black' :
                                                                amb.rank === 3 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                                                            }`}>
                                                            {amb.rank}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 flex items-center gap-3">
                                                        <img src={amb.avatarUrl} alt={amb.name} className="w-8 h-8 rounded-full object-cover bg-slate-800" />
                                                        <span className="font-bold text-white">{amb.name}</span>
                                                    </td>
                                                    <td className="p-4 text-slate-400 text-sm">{amb.college}</td>
                                                    <td className="p-4">
                                                        <input
                                                            type="number"
                                                            value={amb.points}
                                                            onChange={(e) => handleUpdatePoints(amb.id, parseInt(e.target.value) || 0)}
                                                            className="bg-black/20 border border-white/10 rounded w-20 px-2 py-1 text-cyan-400 font-mono text-center outline-none focus:border-cyan-400"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => setAmbassadors(prev => prev.filter(a => a.id !== amb.id))} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {ambassadors.length === 0 && <div className="p-8 text-center text-slate-500">No ambassadors yet. Add one to start the leaderboard.</div>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'curriculum' && (
                            <motion.div key="curriculum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Curriculum Roadmap</h2>
                                    <button onClick={() => setShowAddPlan(!showAddPlan)} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                                        <Plus size={16} /> Add Task
                                    </button>
                                </div>

                                {showAddPlan && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-900/60 p-6 rounded-2xl border border-green-500/30 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Topic Name" value={newPlanItem.topic || ''} onChange={e => setNewPlanItem({ ...newPlanItem, topic: e.target.value })} />
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Course/Category" value={newPlanItem.course || ''} onChange={e => setNewPlanItem({ ...newPlanItem, course: e.target.value })} />
                                        <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Assigned To" value={newPlanItem.assignedTo || ''} onChange={e => setNewPlanItem({ ...newPlanItem, assignedTo: e.target.value })} />
                                        <button onClick={handleAddPlanItem} className="bg-green-600 rounded-xl font-bold text-white">Save Task</button>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(['Pending', 'In Progress', 'Completed'] as const).map(status => (
                                        <div key={status} className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 min-h-[400px]">
                                            <div className={`text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2 ${status === 'Pending' ? 'text-red-400' : status === 'In Progress' ? 'text-yellow-400' : 'text-green-400'}`}>
                                                <div className={`w-2 h-2 rounded-full ${status === 'Pending' ? 'bg-red-500' : status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                {status}
                                            </div>
                                            <div className="space-y-3">
                                                {curriculumItems.filter(i => i.status === status).map(item => (
                                                    <div key={item.id} className="p-4 bg-slate-900 rounded-xl border border-white/5 shadow-sm group relative">
                                                        <div className="font-bold text-white text-sm mb-1">{item.topic}</div>
                                                        <div className="text-xs text-slate-500 flex justify-between">
                                                            <span>{item.assignedTo}</span>
                                                            <span>{item.dueDate}</span>
                                                        </div>

                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                            {status !== 'Pending' && <button onClick={() => handleUpdatePlanStatus(item.id, 'Pending')} className="p-1 bg-slate-800 rounded text-red-400 hover:text-white" title="Move to Pending">←</button>}
                                                            {status !== 'Completed' && <button onClick={() => handleUpdatePlanStatus(item.id, 'Completed')} className="p-1 bg-slate-800 rounded text-green-400 hover:text-white" title="Move to Completed">✓</button>}
                                                            {status !== 'In Progress' && <button onClick={() => handleUpdatePlanStatus(item.id, 'In Progress')} className="p-1 bg-slate-800 rounded text-yellow-400 hover:text-white" title="Move to In Progress">→</button>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'teaching-hub' && (
                            <TeachingHubSection />
                        )}

                        {activeTab === 'awareness' && (
                            <motion.div key="awareness" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h2 className="text-2xl font-bold text-white mb-6">Awareness Topics</h2>
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                                            <Shield size={18} className="text-red-400" /> Life & Safety
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {['Personal Safety', 'Emergency Response', 'Cyberbullying'].map((topic, i) => (
                                                <div key={i} className="p-5 bg-red-900/10 border border-red-500/20 rounded-xl hover:bg-red-900/20 transition-colors">
                                                    <h4 className="font-bold text-white mb-2">{topic}</h4>
                                                    <button className="text-xs text-red-400 hover:text-white uppercase font-bold mt-2">View Guide →</button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                                            <Brain size={18} className="text-emerald-400" /> Emotional Well-being
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {['Stress Management', 'Digital Detox', 'Mindfulness'].map((topic, i) => (
                                                <div key={i} className="p-5 bg-emerald-900/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-900/20 transition-colors">
                                                    <h4 className="font-bold text-white mb-2">{topic}</h4>
                                                    <button className="text-xs text-emerald-400 hover:text-white uppercase font-bold mt-2">View Guide →</button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </motion.div>
                        )}


                        {activeTab === 'tools' && (
                            <motion.div key="tools" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h2 className="text-2xl font-bold text-white mb-6">Digital Tool Recommendations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { cat: 'Assessment', tools: ['Kahoot', 'Quizizz', 'Google Forms'] },
                                        { cat: 'Presentation', tools: ['Canva', 'Prezi', 'SlidesAI'] },
                                        { cat: 'Collaboration', tools: ['Miro', 'Notion', 'Padlet'] },
                                        { cat: 'Content Creation', tools: ['Loom', 'Obsidian', 'Audacity'] }
                                    ].map((category, i) => (
                                        <div key={i} className="p-6 bg-slate-800/40 border border-white/5 rounded-2xl">
                                            <h3 className="font-bold text-white mb-4 border-b border-white/5 pb-2">{category.cat}</h3>
                                            <ul className="space-y-2">
                                                {category.tools.map((tool, j) => (
                                                    <li key={j} className="flex items-center gap-2 text-slate-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                        {tool}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                        )}

                        {activeTab === 'resources' && (
                            <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="flex gap-2 mb-6 border-b border-white/5 pb-1">
                                    {['video', 'blog', 'ebook', 'gallery', 'faqs', 'reviews'].map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => setActiveSubTab(sub as any)}
                                            className={`px-4 py-2 text-sm font-bold capitalize transition-colors ${activeSubTab === sub ? 'text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-white'
                                                }`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>

                                {/* --- Resource Content Switcher --- */}
                                {activeSubTab === 'video' || activeSubTab === 'blog' || activeSubTab === 'ebook' ? (
                                    <div>
                                        <div className="flex justify-end mb-4">
                                            <button onClick={() => { setEditingResourceId(null); setNewResource({ title: '', url: '', type: activeSubTab as ResourceType, category: SectorType.TECHNOLOGY, description: '', author: '' }); setShowAddResource(!showAddResource); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                                                <Plus size={16} /> Add {activeSubTab}
                                            </button>
                                        </div>
                                        {showAddResource && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-900/60 p-6 rounded-2xl border border-blue-500/30 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Title" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} />
                                                <input className="bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="URL" value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} />
                                                <input className="md:col-span-2 bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Description" value={newResource.description} onChange={e => setNewResource({ ...newResource, description: e.target.value })} />
                                                <button onClick={handleAddResource} className="bg-blue-600 rounded-xl font-bold text-white md:col-span-2 py-3">Save Resource</button>
                                            </motion.div>
                                        )}
                                        <div className="space-y-2">
                                            {resources.filter(r => r.type === activeSubTab).map(r => (
                                                <div key={r.id} className="flex items-center gap-4 p-4 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-white">{r.title}</div>
                                                        <div className="text-xs text-slate-500">{r.category} • {r.author}</div>
                                                    </div>
                                                    <button onClick={() => setResources(prev => prev.filter(i => i.id !== r.id))} className="text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : activeSubTab === 'faqs' ? (
                                    <div>
                                        <div className="flex justify-end mb-4">
                                            <button onClick={() => setShowAddFaq(!showAddFaq)} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                                                <Plus size={16} /> Add FAQ
                                            </button>
                                        </div>
                                        {showAddFaq && (
                                            <div className="bg-slate-900/60 p-6 rounded-2xl border border-yellow-500/30 mb-6 space-y-3">
                                                <input className="w-full bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Question" value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} />
                                                <textarea className="w-full bg-black/30 border border-white/10 p-3 rounded-xl text-white outline-none" placeholder="Answer" value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} />
                                                <button onClick={handleAddFaq} className="w-full bg-yellow-600 rounded-xl font-bold text-white py-2">Save</button>
                                            </div>
                                        )}
                                        <div className="space-y-3">
                                            {faqs.map((f, i) => (
                                                <div key={i} className="p-4 bg-slate-800/40 border border-white/5 rounded-xl relative group">
                                                    <h4 className="font-bold text-white pr-8">{f.question}</h4>
                                                    <p className="text-sm text-slate-400 mt-1">{f.answer}</p>
                                                    <button onClick={() => setFaqs(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-slate-500">
                                        Feature available in next update.
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div >
            </main >

            {/* Welcome/Daily Wisdom Popup - Only show for student mode */}
            {/* Note: This component is not shown for teacher/admin modes */}
        </div >
    );
};