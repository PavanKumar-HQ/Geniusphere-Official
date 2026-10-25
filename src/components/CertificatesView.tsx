import React from 'react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Certificate } from '../types';
import { MascotSphere } from './MascotSphere';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Printer,
  BookOpen,
  Calendar,
  Lock,
} from 'lucide-react';

interface CertificatesViewProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onOpenCertificateModal: (cert: Certificate) => void;
  onNavigateCourses: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  db,
  currentUserId,
  onOpenCertificateModal,
  onNavigateCourses,
}) => {
  const user = db.getUser(currentUserId, currentUserId);
  const userCertificates = db.getUserCertificates(currentUserId);

  // Only display genuine user certificates earned through verified course completion
  const certificates: Certificate[] = userCertificates;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Header Banner */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          padding: '24px 32px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '100px',
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={14} color="var(--brand-primary)" />
            <span>Cryptographic Credential Registry</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
            Verified Certificates & Mastery
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
            Each credential issued in Geniusphere includes an immutable SHA-256 integrity hash, verifiable syllabus skills, and high-resolution printable diplomas for academic and career advancement.
          </p>
        </div>

        <MascotSphere
          pose="celebrating"
          size={84}
          speechBubble="Every certificate you earn proves genuine hands-on mastery!"
        />
      </div>

      {/* Honest Empty State or Certificates Grid */}
      {certificates.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Award size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            No Certificates Earned Yet
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6, fontSize: '0.92rem' }}>
            You haven't completed a full curriculum yet. To earn a verifiable credential with an immutable cryptographic SHA-256 integrity hash, complete all 10 video lessons and simulation labs in any course!
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={onNavigateCourses}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
            }}
          >
            Explore Course Curriculum
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {certificates.map((cert) => (
          <div
            key={cert.id}
            className="card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Accent Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: 'var(--brand-primary)',
              }}
            />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--brand-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      Certified Mastery
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {cert.course_title}
                    </h3>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: 'var(--brand-surface)',
                    color: 'var(--brand-primary)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}
                >
                  Grade: {cert.grade}%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  <span>Issued: {cert.issue_date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={14} />
                  <span>ID: {cert.id}</span>
                </div>
              </div>

              {/* Skills badges */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Verified Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cert.skills_acquired.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={11} color="var(--brand-primary)" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* SHA-256 Integrity Hash Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--text-secondary)',
                  wordBreak: 'break-all',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="var(--brand-primary)" />
                  <span>Cryptographic Proof:</span>
                </div>
                {cert.verification_hash}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onOpenCertificateModal(cert)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '100px',
                  padding: '10px 16px',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                }}
              >
                <Printer size={15} />
                <span>View & Print Official Diploma</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Earn More Credentials Callout */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px dashed var(--border-strong)',
          borderRadius: '16px',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Looking to unlock additional verified credentials?
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Complete all modules, passing scores on quizzes, and lab simulations across any of the 40 canonical courses to earn formal certificates.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={onNavigateCourses}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '100px',
            padding: '12px 24px',
            fontWeight: 800,
            fontSize: '0.88rem',
          }}
        >
          <BookOpen size={16} />
          <span>Browse All 40 Courses</span>
        </button>
      </div>
    </div>
  );
};
