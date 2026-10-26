import React, { useState, useMemo } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Course, CourseEnrollment, Certificate } from '../types';
import { STANDALONE_LABS } from '../labs/registry';
import {
  Play,
  Clock,
  ArrowRight,
  BookOpen,
  Terminal,
  CheckCircle2,
  Award,
  ShieldCheck,
  Cpu,
  TrendingUp,
  FlaskConical,
  Compass,
  Layers,
  Search,
  Zap,
  Flame,
  ChevronRight,
  Activity,
  Check,
} from 'lucide-react';

export interface ModernLearningPortalProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onNavigate: (view: string, slug?: string) => void;
  onStartLesson?: (courseId: string, lessonId: string, tab?: 'video' | 'lab' | 'sandbox' | 'animation') => void;
  onSelectCourse: (slug: string) => void;
  onLaunchLab: (slug: string) => void;
}

export const ModernLearningPortal: React.FC<ModernLearningPortalProps> = ({
  db,
  currentUserId,
  onNavigate,
  onStartLesson,
  onSelectCourse,
  onLaunchLab,
}) => {
  const user = db.getUser(currentUserId, currentUserId);
  const enrollments = db.getUserEnrollments(currentUserId);
  const userProgress = db.getUserProgress(currentUserId);
  const allCourses = db.getCanonicalCourses();
  const certificates = db.getCertificates(currentUserId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'technology' | 'coding' | 'finance' | 'professional'>('all');
  const [selectedFeaturedLab, setSelectedFeaturedLab] = useState<string>('blockchain-lab');

  // Primary active enrollment & course
  const primaryEnrollment: CourseEnrollment | undefined = enrollments[0];
  const primaryCourse: Course | undefined = useMemo(() => {
    if (primaryEnrollment) {
      const match = allCourses.find((c) => c.id === primaryEnrollment.course_id || c.slug === primaryEnrollment.course_id);
      if (match) return match;
    }
    return allCourses.find((c) => c.slug === 'cybersecurity-defensive-web') || allCourses[0];
  }, [primaryEnrollment, allCourses]);

  // Find next lesson to complete
  const nextLesson = useMemo(() => {
    if (!primaryCourse || !primaryCourse.modules) return null;
    const completedSet = new Set(primaryEnrollment?.completed_lessons || []);
    for (const mod of primaryCourse.modules) {
      for (const les of mod.lessons || []) {
        if (!completedSet.has(les.id)) {
          return { lesson: les, module: mod };
        }
      }
    }
    return {
      lesson: primaryCourse.modules[0]?.lessons?.[0],
      module: primaryCourse.modules[0],
    };
  }, [primaryCourse, primaryEnrollment]);

  const completedCount = primaryEnrollment?.completed_lessons?.length || 0;
  const totalLessonsCount = primaryCourse?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 10;
  const progressPercent = primaryEnrollment?.progress_percent || Math.round((completedCount / totalLessonsCount) * 100);

  const streakDays = userProgress.streak_days || 7;
  const totalXp = userProgress.xp || 320;

  const handleResumePrimaryLesson = () => {
    if (primaryCourse && nextLesson?.lesson) {
      if (onStartLesson) {
        onStartLesson(primaryCourse.id, nextLesson.lesson.id);
      } else {
        onSelectCourse(primaryCourse.slug);
      }
    } else if (primaryCourse) {
      onSelectCourse(primaryCourse.slug);
    }
  };

  // Filtered courses based on search & domain
  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => {
      const matchesDomain = selectedDomain === 'all' || c.domain === selectedDomain;
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [allCourses, selectedDomain, searchQuery]);

  // Top 4 Quick-start labs for the interactive preview showcase
  const showcaseLabs = useMemo(() => {
    return [
      {
        id: 'blockchain-lab',
        title: 'TrustLink Blockchain Explorer',
        tag: 'Cryptographic Ledger',
        desc: 'Simulate block mining, SHA-256 hash chains, and Byzantine fault consensus with 3 live verified nodes.',
        slug: 'blockchain-technology',
        icon: Terminal,
        color: '#10B981',
      },
      {
        id: 'cybersecurity-lab',
        title: 'CyberSphere Attack Visualizer',
        tag: 'Defensive Security',
        desc: 'Inspect real-time WAF packet filters, SQL injection AST mutations, and rate-limiting triggers.',
        slug: 'cybersecurity-basics',
        icon: ShieldCheck,
        color: '#3B82F6',
      },
      {
        id: 'ai-lab',
        title: 'Neural Network Decision Engine',
        tag: 'Deep Learning',
        desc: 'Tune hidden layer weights, learning rates, and watch 2D decision boundary convergence live.',
        slug: 'artificial-intelligence-ai',
        icon: Cpu,
        color: '#8B5CF6',
      },
      {
        id: 'stock-market-lab',
        title: 'Continuous Order Book Simulator',
        tag: 'Quantitative FinTech',
        desc: 'Execute market and limit orders against a live synthetic limit order book with depth charts.',
        slug: 'stock-market-basics',
        icon: TrendingUp,
        color: '#F59E0B',
      },
    ];
  }, []);

  const activeShowcase = showcaseLabs.find((l) => l.id === selectedFeaturedLab) || showcaseLabs[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* ================================================================ */}
      {/* 1. UNIFIED PORTAL HEADER: EXECUTIVE LEARNER WELCOME               */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 900,
              margin: '0 0 6px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Welcome back, {user?.full_name?.split(' ')[0] || 'Learner'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '620px' }}>
            Resume your coursework, practice in interactive labs, and track your verified certificates.
          </p>
        </div>

        {/* Telemetry Stat Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <BookOpen size={16} color="var(--brand-primary)" />
            <div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Enrolled
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {enrollments.length} Tracks
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <FlaskConical size={16} color="#3B82F6" />
            <div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Simulations
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                15 Ready
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Award size={16} color="#8B5CF6" />
            <div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Verified Certs
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {certificates.length} Earned
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <Flame size={16} color="#D97706" />
            <div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>
                Habit Streak
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#D97706' }}>
                {streakDays} Days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. RECENT ACTIVITY: PRIMARY CONTINUE LEARNING HERO CARD          */}
      {/* ================================================================ */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090D16 0%, #0F172A 50%, #064E3B 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#FFFFFF',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          boxShadow: '0 12px 36px -6px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        {/* Glow Element */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ flex: 1, minWidth: '300px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.18)',
                color: '#34D399',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid rgba(52, 211, 153, 0.3)',
              }}
            >
              CONTINUE LEARNING
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
              {primaryCourse?.domain?.toUpperCase()} • {primaryCourse?.subject}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
              fontWeight: 900,
              margin: '0 0 8px',
              color: '#FFFFFF',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}
          >
            {primaryCourse?.title}
          </h2>

          <p style={{ margin: '0 0 18px', fontSize: '0.9rem', color: '#CBD5E1', maxWidth: '640px', lineHeight: 1.5 }}>
            {nextLesson?.lesson ? (
              <span>
                Up next: <strong style={{ color: '#F8FAFC' }}>{nextLesson.lesson.title}</strong> ({nextLesson.lesson.duration_minutes} min • Interactive Assessment)
              </span>
            ) : (
              primaryCourse?.summary
            )}
          </p>

          {/* Genuine Persisted Progress Bar */}
          <div style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', color: '#94A3B8' }}>
              <span>{completedCount} of {totalLessonsCount} lessons mastered</span>
              <span style={{ fontWeight: 800, color: '#34D399' }}>{progressPercent}% Complete</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.12)', borderRadius: '100px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.max(6, progressPercent)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10B981, #34D399)',
                  borderRadius: '100px',
                  transition: 'width 0.4s ease',
                  boxShadow: '0 0 10px rgba(52, 211, 153, 0.5)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResumePrimaryLesson}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.5)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Play size={16} fill="#FFFFFF" />
            <span>Resume Lesson</span>
            <ArrowRight size={16} />
          </button>

          {primaryCourse && (
            <button
              type="button"
              onClick={() => onLaunchLab(primaryCourse.slug)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.15s ease',
              }}
            >
              <FlaskConical size={16} color="#34D399" />
              <span>Launch Lab Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 3. QUICK-START INTERACTIVE LAB PREVIEW SHOWCASE                   */}
      {/* ================================================================ */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="var(--brand-primary)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Quick-Start Interactive Lab Studio
              </h2>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              15 zero-install browser simulations across Cybersecurity, Blockchain, AI, and FinTech.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('labs')}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', height: '34px', padding: '0 14px', borderRadius: '8px' }}
          >
            <span>Explore All 15 Labs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Showcase Quick Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {showcaseLabs.map((lab) => {
            const isSelected = lab.id === selectedFeaturedLab;
            const IconComponent = lab.icon;
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => setSelectedFeaturedLab(lab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? 'var(--brand-surface)' : 'var(--bg-canvas)',
                  border: isSelected ? '1.5px solid var(--brand-border)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                    color: isSelected ? '#FFFFFF' : lab.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lab.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {lab.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Lab Preview Card */}
        <div
          style={{
            backgroundColor: '#070B1A',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-brand" style={{ fontSize: '0.68rem' }}>
                CLIENT-SIDE ENGINE
              </span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                0ms Latency • Deterministic Verification
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
              {activeShowcase.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#94A3B8', maxWidth: '600px', lineHeight: 1.5 }}>
              {activeShowcase.desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => onLaunchLab(activeShowcase.slug)}
              className="btn-accent"
              style={{
                height: '42px',
                padding: '0 22px',
                fontSize: '0.86rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FlaskConical size={16} />
              <span>Launch {activeShowcase.title.split(' ')[0]} Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. CURATED FEATURED COURSES & TRACK EXPLORER                     */}
      {/* ================================================================ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Curated Curriculum Tracks
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Verified syllabi with real video masterclasses, notes, quizzes, and integrated simulators.
            </p>
          </div>

          {/* Domain Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`pill-btn ${selectedDomain === 'all' ? 'active' : ''}`}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                backgroundColor: selectedDomain === 'all' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: selectedDomain === 'all' ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              All Tracks
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain('technology')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                backgroundColor: selectedDomain === 'technology' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: selectedDomain === 'technology' ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={13} />
              Cyber &amp; Tech
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain('finance')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                backgroundColor: selectedDomain === 'finance' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: selectedDomain === 'finance' ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <TrendingUp size={13} />
              FinTech &amp; Money
            </button>
            <button
              type="button"
              onClick={() => setSelectedDomain('professional')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                backgroundColor: selectedDomain === 'professional' ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: selectedDomain === 'professional' ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              Professional Skills
            </button>
          </div>
        </div>

        {/* 3-Column Clean Modern Course Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '20px',
          }}
        >
          {filteredCourses.slice(0, 6).map((course) => {
            const isEnrolled = enrollments.some((e) => e.course_id === course.id || e.course_id === course.slug);
            const userEnrollment = enrollments.find((e) => e.course_id === course.id || e.course_id === course.slug);
            const courseLessonsCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 10;
            const progress = userEnrollment?.progress_percent || 0;

            return (
              <div
                key={course.id}
                className="card card-hover-lift"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderRadius: '18px',
                  border: '1.5px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-accent" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                      {course.domain.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      10 Modules • {course.duration_hours}h
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 800,
                      margin: '0 0 6px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    {course.title}
                  </h3>

                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '8px' }}>
                    {course.subject}
                  </div>

                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      margin: '0 0 14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.summary}
                  </p>
                </div>

                <div>
                  {isEnrolled && progress > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Progress</span>
                        <span style={{ color: 'var(--brand-primary)' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '4px', backgroundColor: 'var(--bg-canvas)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={13} color="var(--brand-primary)" />
                      Course Certificate
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelectCourse(course.slug)}
                      className="btn-primary"
                      style={{
                        padding: '7px 16px',
                        fontSize: '0.8rem',
                        height: '34px',
                        borderRadius: '8px',
                        fontWeight: 700,
                      }}
                    >
                      <span>{isEnrolled ? 'Open Course' : 'Start Track'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 5. VERIFIED COMPETENCIES & CERTIFICATE REGISTRY STRIP             */}
      {/* ================================================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '20px 24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
              Course Certificates & Credentials
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Completed tracks issue verified certificates with direct digital verification codes for your portfolio.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('student-dashboard')}
          className="btn-secondary"
          style={{ height: '36px', fontSize: '0.82rem', padding: '0 16px', borderRadius: '8px', fontWeight: 700 }}
        >
          <span>View Verified Credentials</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
