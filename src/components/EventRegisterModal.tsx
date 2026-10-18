import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface EventRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    category: string;
    description: string;
  } | null;
}

export const EventRegisterModal: React.FC<EventRegisterModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'educator' | 'independent'>('student');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setSubmitted(true);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 38, 28, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#FAF7F2',
          border: '1.5px solid #D5CCC0',
          borderRadius: '16px',
          boxShadow: '0 20px 45px rgba(22, 78, 61, 0.16)',
          overflow: 'hidden',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E8E2D6',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: '#E5F0DF',
                color: '#43A85B',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                border: '1px solid #D5CCC0',
              }}
            >
              {event.category}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#6B7C72' }}>Event Registration</span>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FAFAF4',
              border: '1px solid #E5F0DF',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#E5F0DF',
                  border: '2px solid #43A85B',
                  color: '#43A85B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#26352A', marginBottom: '8px' }}>
                Registration Confirmed!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
                You have been registered for <strong>{event.title}</strong>. A calendar invite and prep materials will be sent to <strong>{email}</strong>.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleResetAndClose}
                style={{ height: '42px', padding: '0 24px', margin: '0 auto' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#26352A', marginBottom: '6px' }}>
                  {event.title}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  {event.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#6B7C72' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#43A85B" />
                    <span>{event.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#43A85B" />
                    <span>Virtual / Live Stream</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#26352A' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Patel"
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #D5CCC0',
                    color: '#26352A',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#26352A' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aarav@student.tech"
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #D5CCC0',
                    color: '#26352A',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#26352A' }}>I am registering as *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'student', label: 'Student' },
                    { id: 'educator', label: 'Educator' },
                    { id: 'independent', label: 'Learner' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: role === r.id ? '#E5F0DF' : '#FFFFFF',
                        border: role === r.id ? '1.5px solid #43A85B' : '1.5px solid #D5CCC0',
                        color: role === r.id ? '#26352A' : '#475569',
                        fontWeight: role === r.id ? 700 : 500,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Confirm Registration</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
