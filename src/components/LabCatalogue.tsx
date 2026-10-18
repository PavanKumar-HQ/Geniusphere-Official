import React, { useState } from 'react';
import {
  Search,
  Filter,
  Clock,
  ArrowRight,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { MascotSphere } from './MascotSphere';

export interface LabCatalogueProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onSelectLab: (slug: string) => void;
  onNavigateHome: () => void;
  onOpenCodingSandbox?: () => void;
}

export const LabCatalogue: React.FC<LabCatalogueProps> = ({
  db,
  currentUserId,
  onSelectLab,
  onNavigateHome,
  onOpenCodingSandbox,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const labs = db.getLabDefinitions({
    category: selectedCategory,
    interaction_type: selectedType,
    search,
  });

  const allLabs = db.getLabDefinitions();
  const techCount = allLabs.filter((l) => l.category === 'technology').length;
  const finCount = allLabs.filter((l) => l.category === 'finance').length;
  const codeCount = allLabs.filter((l) => l.category === 'coding').length;

  const categories = [
    { id: 'all', label: `All Subjects (${allLabs.length})` },
    { id: 'technology', label: `Technology (${techCount})` },
    { id: 'finance', label: `Finance (${finCount})` },
    { id: 'coding', label: `Coding & Programming (${codeCount})` },
  ];

  const types = [
    { id: 'all', label: 'All Interaction Types' },
    { id: 'simulation', label: 'Simulations' },
    { id: 'sandbox', label: 'Sandboxes' },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-meta)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <button 
              type="button"
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 0, fontWeight: 600, fontSize: 'inherit' }}
            >
              Home
            </button>
            <span>/</span>
            <span>Labs Catalogue</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--brand-surface)', color: 'var(--brand-primary)', fontSize: 'var(--text-meta)', fontWeight: 700, marginBottom: '12px' }}>
            <Terminal size={14} />
            <span>INTERACTIVE LABS & SIMULATIONS</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-page-title)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Explore Interactive Labs
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: 0, maxWidth: '680px' }}>
            Practice hands-on concept simulations, parameter-driven experiments, and isolated code execution sandboxes across approved disciplines.
          </p>
        </div>
        <MascotSphere pose="coding" size={96} speechBubble="Ready to run code in the sandbox?" />
      </div>

      {/* Flagship Multi-Language Coding Sandbox Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #F2F8EF 0%, #FFFFFF 100%)',
          border: '2px solid #43A85B',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(67, 168, 91, 0.12)',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#43A85B',
              color: '#FFFFFF',
              padding: '3px 10px',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Terminal size={12} />
              <span>Flagship Sandbox • Python 3.12 &amp; C Compiler</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#26352A', margin: '0 0 8px 0' }}>
            Multi-Language In-Browser Coding Sandbox
          </h2>
          <p style={{ margin: 0, color: '#4A5B4F', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Directly test and compile <strong>Python</strong> (functions, loops, math, algorithms) and <strong>C Language</strong> (pointers, printf formatting, buffer boundary checks) with live terminal stdout feedback and zero setup.
          </p>
        </div>

        {onOpenCodingSandbox && (
          <button
            type="button"
            onClick={onOpenCodingSandbox}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#43A85B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '100px',
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(67, 168, 91, 0.28)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#38944f')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#43A85B')}
          >
            <span>Launch Python &amp; C Sandbox</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>


      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search labs by concept, algorithm, or objective..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px' }}
            />
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-input"
              style={{ height: '40px', width: 'auto', minWidth: '180px' }}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                height: '34px',
                padding: '0 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: selectedCategory === cat.id ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: 'var(--text-meta)',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? 'var(--brand-primary)' : 'var(--border-subtle)',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid */}
      {labs.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <MascotSphere pose="thinking" size={90} speechBubble="No labs matched this filter!" />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '14px 0 4px' }}>No matching labs found</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>Try clearing your search query or selecting "All Subjects".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {labs.map((lab) => {
            const isCompleted = db.isLabCompleted(currentUserId, lab.id);

            return (
              <div
                key={lab.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  borderTop: isCompleted ? '3px solid var(--success)' : '1px solid var(--border-subtle)',
                }}
                onClick={() => onSelectLab(lab.slug)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-brand" style={{ textTransform: 'capitalize' }}>
                        {lab.category}
                      </span>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                        {lab.interaction_type}
                      </span>
                    </div>

                    {isCompleted && (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 'var(--text-card-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {lab.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {lab.summary}
                  </p>
                </div>

                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-meta)', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{lab.duration_minutes}m</span>
                    </span>
                    <span style={{ textTransform: 'capitalize' }}>
                      {lab.difficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ height: '36px', padding: '0 14px', fontSize: '0.85rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLab(lab.slug);
                    }}
                  >
                    <span>Launch Lab</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
