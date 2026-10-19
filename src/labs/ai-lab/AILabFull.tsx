import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SimulationEngine } from './SimulationEngine';
import { DefensePanel } from './DefensePanel';
import { AI_MODULES } from './constants';
import { X } from 'lucide-react';

interface AILabFullProps {
  onExit?: () => void;
}

const AILabFull: React.FC<AILabFullProps> = ({ onExit }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(AI_MODULES[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeModule = AI_MODULES.find(m => m.id === activeModuleId) || AI_MODULES[0];

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setIsSimulating(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#020617',
        color: '#E2E8F0',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scanline grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)',
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
          padding: '12px 24px',
          borderBottom: '1px solid rgba(34,211,238,0.15)',
          background: 'rgba(2,6,23,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
            <circle cx="15" cy="15" r="9" stroke="#22D3EE" strokeWidth="1" opacity="0.8" />
            <circle cx="15" cy="15" r="4" fill="#22D3EE" />
            <circle cx="5" cy="15" r="2" fill="#22D3EE" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 15 15" to="360 15 15" dur="4s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#22D3EE', letterSpacing: '-0.02em' }}>
              Geniusphere AI Lab
            </div>
            <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 600, letterSpacing: '0.05em' }}>
              {activeModule.category.toUpperCase()} • {activeModule.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '100px',
              backgroundColor: isSimulating ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.1)',
              border: isSimulating ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(100,116,139,0.2)',
              color: isSimulating ? '#22C55E' : '#64748B',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {isSimulating ? '● LIVE' : '○ READY'}
          </span>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(34,211,238,0.2)',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'none', // shown only on mobile via CSS
            }}
            className="ai-lab-menu-toggle"
          >
            Modules
          </button>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'transparent',
                color: '#64748B',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              Exit Lab
            </button>
          )}
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            backgroundColor: 'rgba(0,0,0,0.92)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              alignSelf: 'flex-end',
              padding: '8px',
              background: 'none',
              border: 'none',
              color: '#E2E8F0',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <X size={24} />
          </button>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Sidebar
              activeModuleId={activeModuleId}
              onSelectModule={(id) => {
                handleSelectModule(id);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop layout: sidebar + main + defense panel */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Sidebar */}
        <div
          style={{
            width: '260px',
            flexShrink: 0,
            borderRight: '1px solid rgba(34,211,238,0.1)',
            overflowY: 'auto',
            backgroundColor: 'rgba(2,6,23,0.6)',
          }}
        >
          <Sidebar
            activeModuleId={activeModuleId}
            onSelectModule={handleSelectModule}
          />
        </div>

        {/* Main simulation workspace */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <SimulationEngine
            module={activeModule}
            isSimulating={isSimulating}
            onStartSim={() => setIsSimulating(true)}
            onEndSim={() => setIsSimulating(false)}
          />
        </main>

        {/* Right defense info panel */}
        <DefensePanel module={activeModule} />
      </div>
    </div>
  );
};

export default AILabFull;
