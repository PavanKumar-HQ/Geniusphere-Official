import React from 'react';
import {
  ShieldCheck,
  Users,
  Target,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px' }}>
          <Sparkles size={14} />
          <span>ABOUT GENIUSPHERE</span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            marginBottom: '18px',
            color: 'var(--text-primary)',
          }}
        >
          Practical education grounded in real capability.
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          Geniusphere is an educational technology platform engineered to bridge the gap between traditional academic curricula and the concrete, verifiable capabilities demanded by modern systems engineering, computational logic, financial literacy, and professional workplaces.
        </p>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="card-elevated" style={{ padding: '36px', borderTop: '4px solid var(--brand-primary)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>
          Our Mission & Educational Focus
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
          <p>
            Mainstream schooling often emphasizes theoretical memorization over operational understanding. Students can graduate with high test marks without ever tracing memory allocations, understanding how interest rates dictate inflation, or structuring code that survives hostile inputs.
          </p>
          <p>
            Geniusphere focuses exclusively on four rigorously scoped foundational disciplines:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '8px' }}>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>1. Technology</strong>
              <span>Artificial intelligence, system architecture, IoT, blockchain, cloud infrastructure, and defensive web security.</span>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>2. Finance</strong>
              <span>Money mathematics, macro events, public markets, central banking, fintech payment rails, and asset risk analysis.</span>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>3. Professional Skills</strong>
              <span>Time management, deep focus hygiene, team accountability, asynchronous documentation, and credible identity.</span>
            </div>
            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>4. Coding & Programming</strong>
              <span>Computational logic, variable states, condition branching, iterative loops, web fundamentals, and debugging.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Approach / Pedagogy */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--brand-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent)' }}>
              <Target size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Cognitive Inquiry</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Every lesson provides substantive reading materials and formative quizzes that test understanding of first principles rather than simple rote recall.
          </p>
        </div>

        <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--brand-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Evidence-Backed Proof</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Learners build demonstrable skills backed by real completed modules and verified portfolio artifacts, replacing unsubstantiated resume assertions with concrete proof.
          </p>
        </div>

        <div className="card" style={{ padding: '28px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
              <Users size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Institutional Isolation</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Schools and colleges benefit from cryptographic join codes, multi-tenant database isolation, role-based access control, and complete gradebook visibility.
          </p>
        </div>
      </div>

      {/* Intended Audiences */}
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>
          Who We Serve
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--brand-primary)' }}>
              Independent Learners & Students
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              High school, college, and university students seeking practical competencies in web security, algorithmic reasoning, personal economics, and resume engineering.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--brand-accent)' }}>
              Classroom Educators & Teachers
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Computer science and business studies teachers who require structured curricula, cryptographic join codes, assignment management, and automated gradebooks.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Schools, Colleges & Parents
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Educational administrators overseeing cohort delivery and parents exercising statutory oversight under India's Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Contact Details & Institutional Context */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
            Verified Contact & Operations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>Official Inquiries: <strong>contact@geniusphere.tech</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>Academic Context: Bengaluru, Karnataka, India (PES CIE)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={16} style={{ color: 'var(--brand-primary)' }} />
              <span>Security Incident Reporting: <strong>security@geniusphere.tech</strong></span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
            Privacy, Compliance & Governance
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
            Geniusphere operates in strict adherence to the Digital Personal Data Protection (DPDP) Act 2023, mandating verifiable parental consent for minor learners under age 18.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-success">DPDP Act 2023 Compliant</span>
            <span className="badge badge-brand">Zero Third-Party Advertising</span>
            <span className="badge badge-neutral">Row-Level Security Enforcement</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="card-elevated"
        style={{
          padding: '36px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Explore the Geniusphere Curriculum
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', fontSize: '0.95rem' }}>
          Discover approved courses in technology, programming, finance, and professional development, backed by genuine learning content.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('catalogue')}
            style={{ height: '44px', padding: '0 24px' }}
          >
            <span>Browse Courses</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onNavigate('resources')}
            style={{ height: '44px', padding: '0 20px' }}
          >
            <span>Explore Resources</span>
          </button>
        </div>
      </div>
    </div>
  );
};
