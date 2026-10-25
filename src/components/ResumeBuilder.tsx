import React, { useState } from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { ResumeProject } from '../types';
import { Award, Download, Plus, CheckCircle2 } from 'lucide-react';
import { MascotSphere } from './MascotSphere';

interface ResumeBuilderProps {
  db: InMemoryDatabase;
  currentUserId: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ db, currentUserId }) => {
  const existingResume = db.getResume(currentUserId);
  const user = db.users.get(currentUserId);

  // Automatically discover verified lab achievements from database submissions
  const verifiedAchievements: string[] = [];
  for (const s of db.submissions.values()) {
    if (s.student_id === currentUserId && s.passed) {
      verifiedAchievements.push(
        `Assessment: Web Application Defense & Architecture (Score: ${s.score}/100 • Integrity Hash: ${s.submission_hash.slice(0, 16)}...)`
      );
    }
  }

  const [fullName, setFullName] = useState(existingResume?.full_name || user?.full_name || '');
  const [email, setEmail] = useState(existingResume?.email || user?.email || '');
  const [headline, setHeadline] = useState(existingResume?.headline || 'High School Technologist & Cyber Defense Student');
  const [summary, setSummary] = useState(
    existingResume?.summary ||
      'Dedicated learner focusing on application security, defensive parameterization, relational data modeling, and practical software engineering.'
  );

  const [skills, setSkills] = useState<string[]>(
    existingResume?.skills || ['SQL Parameterization', 'Prepared Statements', 'Python', 'Relational Databases', 'Git', 'Linux']
  );
  const [newSkill, setNewSkill] = useState('');

  const [projects] = useState<ResumeProject[]>(
    existingResume?.projects || [
      {
        id: 'proj-1',
        title: 'SQL Injection Defense Lab Implementation',
        description: 'Engineered safe positional parameter query templates to defend against auth bypass attacks with automated test verification.',
        technologies: ['SQLite-WASM', 'TypeScript', 'Prepared Statements'],
      },
    ]
  );

  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    db.saveResume(currentUserId, {
      full_name: fullName,
      email,
      headline,
      summary,
      skills,
      projects,
      verified_achievements: verifiedAchievements.length > 0 ? verifiedAchievements : existingResume?.verified_achievements || [],
    });

    setSavedBanner('Resume and verified credentials saved to database.');
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleExportJson = () => {
    const payload = {
      resume: db.getResume(currentUserId),
      verified_by: 'Geniusphere Authoritative Verification Engine',
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geniusphere-resume-${currentUserId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Editor Column */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MascotSphere pose="coding" size={48} animated={true} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="var(--brand-primary)" />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Resume & Portfolio Editor</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0' }}>
                Showcase verified laboratory mastery &amp; code credentials
              </p>
            </div>
          </div>
          <span className="badge badge-brand">ATS-Optimized</span>
        </div>

        {savedBanner && (
          <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem' }}>
            {savedBanner}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>Contact Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>Professional Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>Executive Summary</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontFamily: 'inherit', fontSize: '0.85rem' }}
          />
        </div>

        {/* Skills Tag Input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '4px' }}>Skills & Competencies</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Prepared Statements)..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
            />
            <button type="button" className="btn-secondary" onClick={handleAddSkill} style={{ height: '36px', padding: '0 12px' }}>
              <Plus size={16} /> Add
            </button>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {skills.map((s) => (
              <span key={s} className="badge badge-neutral" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, minHeight: 'auto', marginLeft: '4px', color: 'var(--text-muted)' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="button" className="btn-primary" onClick={handleSave} style={{ flex: 1 }}>
            Save Resume
          </button>
          <button type="button" className="btn-secondary" onClick={handleExportJson} style={{ height: '42px', padding: '0 14px' }}>
            <Download size={16} /> JSON Export
          </button>
        </div>
      </div>

      {/* Live Preview Column */}
      <div className="card-elevated" style={{ backgroundColor: 'var(--bg-surface)', padding: '32px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ borderBottom: '2px solid var(--border-strong)', paddingBottom: '16px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{fullName || 'Your Name'}</h1>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '4px' }}>{headline}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{email} • Verified Geniusphere Student</div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '8px' }}>
            Executive Summary
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{summary}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '8px' }}>
            Technical Competencies
          </h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {skills.map((s) => (
              <span key={s} style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '8px' }}>
            Technical Projects & Evidence
          </h3>
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.title}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '4px' }}>{p.description}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technologies: {p.technologies.join(', ')}</div>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', marginBottom: '8px' }}>
            Verified Geniusphere Credentials
          </h3>
          {verifiedAchievements.length > 0 ? (
            verifiedAchievements.map((ach, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--brand-primary)', padding: '4px 0' }}>
                <CheckCircle2 size={14} color="var(--brand-primary)" />
                <span>{ach}</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Complete interactive labs to earn verified database-backed credentials.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
