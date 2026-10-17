import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { VideoLesson, StudyResource } from '../types';
import {
  Video,
  BookOpen,
  FileText,
  Search,
  School,
  Briefcase,
  Play,
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ResourcesHubProps {
  db: InMemoryDatabase;
  onNavigate: (view: string, slug?: string) => void;
  currentUserId: string;
}

export const ResourcesHub: React.FC<ResourcesHubProps> = ({ db, onNavigate, currentUserId: _currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'materials' | 'tools'>('videos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);
  const [activeStudyGuide, setActiveStudyGuide] = useState<StudyResource | null>(null);

  const videoLessons = db.getVideoLessons();
  const studyResources = db.getStudyResources();

  // Filter video lessons
  const filteredVideos = videoLessons.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.instructor_name && v.instructor_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter study resources
  const filteredMaterials = studyResources.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDomainLabel = (cat: string) => {
    switch (cat) {
      case 'technology':
        return 'Technology';
      case 'coding':
        return 'Coding & Programming';
      case 'finance':
        return 'Finance';
      case 'professional':
        return 'Professional Skills';
      case 'educator':
        return 'Educator Tools';
      case 'career':
        return 'Career & Portfolio';
      default:
        return 'General';
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'technology':
        return 'badge-brand';
      case 'coding':
        return 'badge-accent';
      case 'finance':
        return 'badge-warning';
      case 'professional':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const userProgress = db.getUserProgress(_currentUserId);
  const totalResources = videoLessons.length + studyResources.length;
  const completedCount = userProgress.completed_lessons.length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner with Gamification XP Widget from Reference Image */}
      <div
        className="card-elevated"
        style={{
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          background: 'linear-gradient(135deg, rgba(11, 15, 25, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
        }}
      >
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '8px', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Educational Resources
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', lineHeight: 1.6 }}>
            Explore our comprehensive library of videos, blogs, and learning materials designed to expand your knowledge.
          </p>
        </div>

        {/* Reference Image XP Widget */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: 'rgba(4, 8, 20, 0.8)',
            border: '1px solid rgba(0, 245, 160, 0.3)',
            minWidth: '220px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00F5A0', fontWeight: 800, fontSize: '0.9rem' }}>
              <Sparkles size={16} />
              <span>{userProgress.xp} XP</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              PROGRESS {completedCount}/{totalResources}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, Math.round((completedCount / totalResources) * 100))}%`,
                height: '100%',
                backgroundColor: 'var(--brand-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Control Bar: Tab Switcher & Search from Reference Image */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Main Tab Switcher (Videos / Blogs & Guides / Tools) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              style={{
                height: '42px',
                padding: '0 20px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'videos' ? '#EF4444' : 'rgba(15, 23, 42, 0.6)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 700,
                border: activeTab === 'videos' ? 'none' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Video size={17} />
              <span>Videos</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              style={{
                height: '42px',
                padding: '0 20px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'materials' ? '#3B82F6' : 'rgba(15, 23, 42, 0.6)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 700,
                border: activeTab === 'materials' ? 'none' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <FileText size={17} />
              <span>Blogs & Guides</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              style={{
                height: '42px',
                padding: '0 20px',
                borderRadius: '8px',
                backgroundColor: activeTab === 'tools' ? 'var(--brand-primary)' : 'rgba(15, 23, 42, 0.6)',
                color: activeTab === 'tools' ? '#040814' : '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 700,
                border: activeTab === 'tools' ? 'none' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Layers size={17} />
              <span>Educator Tools</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '360px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '42px' }}
              aria-label="Search resources"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  minHeight: 'auto',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'technology', label: 'Technology' },
            { id: 'coding', label: 'Coding' },
            { id: 'finance', label: 'Finance' },
            { id: 'professional', label: 'Personal Growth' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                height: '32px',
                padding: '0 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                backgroundColor: selectedCategory === cat.id ? 'var(--brand-primary)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedCategory === cat.id ? '#040814' : 'var(--text-secondary)',
                border: '1px solid ' + (selectedCategory === cat.id ? 'var(--brand-primary)' : 'var(--border-subtle)'),
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: VIDEO LESSONS */}
      {activeTab === 'videos' && (
        <section>
          {filteredVideos.length === 0 ? (
            <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Video size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>No video lessons found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
                Try adjusting your search keywords or switching category filters.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Thumbnail Container */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%',
                      backgroundColor: '#0F172A',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveVideo(video)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(29, 78, 216, 0.9)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-md)',
                        }}
                      >
                        <Play size={24} style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Clock size={12} />
                      <span>{video.duration_minutes} min</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: '1', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${getCategoryBadgeClass(video.category)}`}>
                        {getDomainLabel(video.category)}
                      </span>
                      {video.instructor_name && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {video.instructor_name}
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                      onClick={() => setActiveVideo(video)}
                    >
                      {video.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                      {video.description}
                    </p>

                    <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setActiveVideo(video)}
                        className="btn-primary"
                        style={{ height: '36px', fontSize: '0.82rem', padding: '0 14px' }}
                      >
                        <Play size={14} />
                        <span>Watch Video</span>
                      </button>
                      <a
                        href={video.youtube_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: STUDY MATERIALS & GUIDES */}
      {activeTab === 'materials' && (
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filteredMaterials.map((res) => (
              <div
                key={res.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '24px',
                  borderLeft: '4px solid var(--brand-primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${getCategoryBadgeClass(res.category)}`}>
                    {getDomainLabel(res.category)}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    {res.format} • {res.duration_or_pages}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3 }}>
                  {res.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: '1' }}>
                  {res.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <CheckCircle2 size={14} />
                    <span>Verified Study Content</span>
                  </span>

                  {res.action_type === 'open_tool' && res.target_view ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onNavigate(res.target_view!)}
                      style={{ height: '36px', fontSize: '0.82rem' }}
                    >
                      {res.action_label}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => setActiveStudyGuide(res)}
                      style={{ height: '36px', fontSize: '0.82rem' }}
                    >
                      <BookOpen size={14} />
                      <span>{res.action_label}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: TOOLS & WORKSPACES */}
      {activeTab === 'tools' && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Educator SchoolKit Card */}
          <div className="card-elevated" style={{ padding: '28px', borderTop: '4px solid var(--brand-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent)' }}>
                <School size={24} />
              </div>
              <div>
                <span className="badge badge-accent">FOR TEACHERS & INSTITUTIONS</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
                  Educator SchoolKit
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Complete pedagogical resources for classroom educators: syllabus frameworks across the 4 core domains, lesson plan schedules, DPDP Act minor parental consent guidance, and rubrics.
            </p>
            <button
              type="button"
              className="btn-accent"
              onClick={() => onNavigate('schoolkit')}
              style={{ width: '100%', height: '44px' }}
            >
              <School size={16} />
              <span>Launch Educator SchoolKit</span>
            </button>
          </div>

          {/* Student Resume Builder Card */}
          <div className="card-elevated" style={{ padding: '28px', borderTop: '4px solid var(--brand-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)' }}>
                <Briefcase size={24} />
              </div>
              <div>
                <span className="badge badge-brand">FOR LEARNERS & STUDENTS</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
                  Student Resume Builder
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Turn course completions and practical projects into credible resumes. Export verified credentials and portfolio case studies tailored for internships and college admissions.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigate('resume-builder')}
              style={{ width: '100%', height: '44px' }}
            >
              <Briefcase size={16} />
              <span>Open Resume Builder</span>
            </button>
          </div>
        </section>
      )}

      {/* VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="modal-overlay" onClick={() => setActiveVideo(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '840px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${getCategoryBadgeClass(activeVideo.category)}`}>
                    {getDomainLabel(activeVideo.category)}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Duration: {activeVideo.duration_minutes} minutes
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                  {activeVideo.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  minHeight: 'auto',
                }}
                aria-label="Close Video Player"
              >
                <X size={22} />
              </button>
            </div>

            {/* Responsive Iframe Embed */}
            <div className="video-responsive-wrapper" style={{ marginBottom: '18px' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtube_id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {activeVideo.description}
              </div>
              {activeVideo.instructor_name && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Curated Source: <strong>{activeVideo.instructor_name}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDY GUIDE VIEWER MODAL */}
      {activeStudyGuide && (
        <div className="modal-overlay" onClick={() => setActiveStudyGuide(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '720px', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className={`badge ${getCategoryBadgeClass(activeStudyGuide.category)}`} style={{ marginBottom: '6px' }}>
                  {getDomainLabel(activeStudyGuide.category)} • {activeStudyGuide.format}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                  {activeStudyGuide.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveStudyGuide(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  minHeight: 'auto',
                }}
                aria-label="Close Study Guide"
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '20px', backgroundColor: 'var(--bg-canvas)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '14px' }}>
                {activeStudyGuide.description}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>• Format: <strong>{activeStudyGuide.format} Reference Document</strong></div>
                <div>• Length: <strong>{activeStudyGuide.duration_or_pages}</strong></div>
                <div>• Certification: <strong>Geniusphere Academic Curriculum Verification</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setActiveStudyGuide(null)}
                style={{ height: '38px', fontSize: '0.88rem' }}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  alert(`Opening complete verified document: "${activeStudyGuide.title}"`);
                  setActiveStudyGuide(null);
                }}
                style={{ height: '38px', fontSize: '0.88rem' }}
              >
                Download Reference Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
