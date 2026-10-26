import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SimulationEngine } from './SimulationEngine';
import { DefensePanel } from './DefensePanel';
import { AI_MODULES } from './constants';
import { X, Layers, Shield } from 'lucide-react';

interface AILabFullProps {
  onExit?: () => void;
  onClose?: () => void;
}

const AILabFull: React.FC<AILabFullProps> = ({ onExit, onClose }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(AI_MODULES[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDefenseOpen, setIsDefenseOpen] = useState(false);

  const activeModule = AI_MODULES.find(m => m.id === activeModuleId) || AI_MODULES[0];

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setIsSimulating(false);
  };

  const handleExit = onExit || onClose;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '680px',
        width: '100%',
        flex: 1,
        backgroundColor: '#0F172A',
        color: '#F1F5F9',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#1E293B',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
            <circle cx="15" cy="15" r="9" stroke="#22D3EE" strokeWidth="1" opacity="0.8" />
            <circle cx="15" cy="15" r="4" fill="#22D3EE" />
            <circle cx="5" cy="15" r="2" fill="#22D3EE" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 15 15" to="360 15 15" dur="4s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#22D3EE', letterSpacing: '-0.02em' }}>
              Geniusphere AI Lab
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
              {activeModule.category.toUpperCase()} • {activeModule.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '100px',
              backgroundColor: isSimulating ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.1)',
              border: isSimulating ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(100,116,139,0.2)',
              color: isSimulating ? '#22C55E' : '#94A3B8',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {isSimulating ? '● LIVE' : '○ READY'}
          </span>

          {/* Clean Integrated Module Selector Dropdown (Replaces confusing second sidebar list) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              aria-label="Select AI Module"
              value={activeModuleId}
              onChange={(e) => handleSelectModule(e.target.value)}
              style={{
                backgroundColor: 'rgba(15,23,42,0.85)',
                color: '#22D3EE',
                border: '1px solid rgba(34,211,238,0.3)',
                borderRadius: '8px',
                padding: '5px 28px 5px 10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              {AI_MODULES.map((m) => (
                <option key={m.id} value={m.id} style={{ backgroundColor: '#0F172A', color: '#E2E8F0' }}>
                  {m.category.toUpperCase()}: {m.title}
                </option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '8px', pointerEvents: 'none', fontSize: '10px', color: '#22D3EE' }}>
              ▼
            </span>
          </div>

          {/* Toggle Defense Protocols Panel */}
          <button
            type="button"
            onClick={() => setIsDefenseOpen(!isDefenseOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: isDefenseOpen ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(148,163,184,0.2)',
              backgroundColor: isDefenseOpen ? 'rgba(16,185,129,0.12)' : 'rgba(15,23,42,0.6)',
              color: isDefenseOpen ? '#34D399' : '#94A3B8',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
            title={isDefenseOpen ? 'Hide Defense Protocols Panel' : 'Show Defense Protocols Panel'}
          >
            <Shield size={13} />
            <span>Defense Protocols</span>
          </button>

          {handleExit && (
            <button
              type="button"
              onClick={handleExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#CBD5E1',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              <X size={13} />
              <span>Exit Lab</span>
            </button>
          )}
        </div>
      </header>

      {/* Main layout: sidebar + simulation workspace + defense panel */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          minHeight: '560px',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Main simulation workspace */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            minWidth: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0F172A',
          }}
        >
          <SimulationEngine
            module={activeModule}
            isSimulating={isSimulating}
            onStartSim={() => setIsSimulating(true)}
            onEndSim={() => setIsSimulating(false)}
          />
        </main>

        {/* Right defense info panel (Collapsible Drawer / Slide-Over) */}
        {isDefenseOpen && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '320px',
              maxWidth: '85vw',
              zIndex: 30,
              borderLeft: '1px solid rgba(16,185,129,0.2)',
              overflowY: 'auto',
              backgroundColor: 'rgba(2,6,23,0.96)',
              backdropFilter: 'blur(16px)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <DefensePanel
              module={activeModule}
              onClose={() => setIsDefenseOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AILabFull;
