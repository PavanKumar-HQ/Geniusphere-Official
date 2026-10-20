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
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E5F0DF',
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
              backgroundColor: '#E5F0DF',
              color: '#26352A',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={14} color="#43A85B" />
            <span>Cryptographic Credential Registry</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#26352A', margin: '0 0 10px 0' }}>
            Verified Certificates & Mastery
          </h1>
          <p style={{ color: '#4A5B4F', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
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
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E5F0DF',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#E5F0DF',
              color: '#43A85B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Award size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#26352A', margin: '0 0 8px' }}>
            No Certificates Earned Yet
          </h2>
          <p style={{ color: '#6B7C70', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6, fontSize: '0.92rem' }}>
            You haven't completed a full curriculum yet. To earn a verifiable credential with an immutable cryptographic SHA-256 integrity hash, complete all 10 video lessons and simulation labs in any course!
          </p>
          <button
            type="button"
            onClick={onNavigateCourses}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              backgroundColor: '#43A85B',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(67, 168, 91, 0.25)',
            }}
          >
            Explore Course Curriculum
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '24px' }}>
          {certificates.map((cert) => (
          <div
            key={cert.id}
            className="card"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5F0DF',
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
            {/* Top Green Accent Bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: '#43A85B',
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
                      backgroundColor: '#E5F0DF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#43A85B',
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#43A85B', textTransform: 'uppercase' }}>
                      Certified Mastery
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#26352A', margin: 0 }}>
                      {cert.course_title}
                    </h3>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: '#E5F0DF',
                    color: '#26352A',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: '100px',
                  }}
                >
                  Grade: {cert.grade}%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#6B7C70', marginBottom: '16px' }}>
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
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8A9D90', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Verified Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cert.skills_acquired.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#F4F7F2',
                        border: '1px solid #E5F0DF',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#26352A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={11} color="#43A85B" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* SHA-256 Integrity Hash Box */}
              <div
                style={{
                  backgroundColor: '#FAFAF4',
                  border: '1px solid #E5F0DF',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  color: '#4A5B4F',
                  wordBreak: 'break-all',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontWeight: 800, color: '#26352A', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="#43A85B" />
                  <span>Cryptographic Proof:</span>
                </div>
                {cert.verification_hash}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => onOpenCertificateModal(cert)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#43A85B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '10px 16px',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(67, 168, 91, 0.25)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#38944f')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#43A85B')}
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
          backgroundColor: '#FFFFFF',
          border: '1.5px dashed #C8E3BF',
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
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#26352A', margin: '0 0 6px 0' }}>
            Looking to unlock additional verified credentials?
          </h3>
          <p style={{ margin: 0, color: '#6A7D70', fontSize: '0.88rem' }}>
            Complete all modules, passing scores on quizzes, and lab simulations across any of the 40 canonical courses to earn formal certificates.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateCourses}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#26352A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '100px',
            padding: '12px 24px',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <BookOpen size={16} />
          <span>Browse All 40 Courses</span>
        </button>
      </div>
    </div>
  );
};
