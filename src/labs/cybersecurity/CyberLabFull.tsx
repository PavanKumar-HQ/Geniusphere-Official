import React, { useState, useMemo } from 'react';
import { HomePage } from './HomePage';
import { AttackModule } from './AttackModule';
import { CyberGuideChat } from './CyberGuideChat';
import { ATTACK_MODULES } from './constants';
import { IntroWorld } from './IntroWorld';
import { SimulatePage } from './SimulatePage';
import { DefendPage } from './DefendPage';
import { GamesPage } from './GamesPage';
import type { View } from './CyberLabApp';
import { Shield, BookOpen, Zap, Gamepad2, Home } from 'lucide-react';

interface CyberLabFullProps {
  onExit?: () => void;
}

export const CyberLabFull: React.FC<CyberLabFullProps> = ({ onExit }) => {
  const [view, setView] = useState<View>('home');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setView('module');
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => new Set(prev).add(moduleId));
    setSelectedModuleId(null);
    setView('learn');
  };

  const handleNavigate = (newView: View) => {
    setSelectedModuleId(null);
    setView(newView);
  };

  const selectedModule = useMemo(() => {
    return ATTACK_MODULES.find(m => m.id === selectedModuleId) || null;
  }, [selectedModuleId]);

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <IntroWorld onNavigate={handleNavigate} />;
      case 'learn':
        return (
          <HomePage
            modules={ATTACK_MODULES}
            onSelectModule={handleSelectModule}
            completedModules={completedModules}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'simulate':
        return <SimulatePage onBack={() => handleNavigate('home')} />;
      case 'defend':
        return <DefendPage onBack={() => handleNavigate('home')} />;
      case 'games':
        return <GamesPage onBack={() => handleNavigate('home')} />;
      case 'module':
        if (selectedModule) {
          return (
            <AttackModule
              module={selectedModule}
              onComplete={handleModuleComplete}
              onBack={() => handleNavigate('learn')}
            />
          );
        }
        return <IntroWorld onNavigate={handleNavigate} />;
      default:
        return <IntroWorld onNavigate={handleNavigate} />;
    }
  };

  const navItems: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <Home size={16} /> },
    { key: 'learn', label: 'Learn', icon: <BookOpen size={16} /> },
    { key: 'simulate', label: 'Simulate', icon: <Zap size={16} /> },
    { key: 'defend', label: 'Defend', icon: <Shield size={16} /> },
    { key: 'games', label: 'Play', icon: <Gamepad2 size={16} /> },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: '#0B0C10',
        color: '#E2E8F0',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        position: 'relative',
      }}
    >
      {/* Header Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid rgba(6,182,212,0.2)',
          background: 'rgba(11,12,16,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="#06B6D4" strokeWidth="1.5" />
            <path d="M14 7 L18 11 L14 15 L10 11 Z" fill="#06B6D4" opacity="0.8" />
            <path d="M14 13 L18 17 L14 21 L10 17 Z" fill="#FF0080" opacity="0.6" />
            <circle cx="14" cy="14" r="3" fill="#06B6D4" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#06B6D4', letterSpacing: '-0.02em' }}>
            CyberSphere
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>
            JUNIOR LAB
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          {navItems.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavigate(item.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.15s ease',
                backgroundColor: view === item.key ? 'rgba(6,182,212,0.15)' : 'transparent',
                color: view === item.key ? '#06B6D4' : '#94A3B8',
              }}
              onMouseEnter={e => {
                if (view !== item.key) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#E2E8F0';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (view !== item.key) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Progress + Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '0.78rem',
              backgroundColor: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(6,182,212,0.2)',
              padding: '5px 12px',
              borderRadius: '100px',
              color: '#94A3B8',
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#06B6D4' }}>{completedModules.size}</span>
            <span> / {ATTACK_MODULES.length} badges</span>
          </div>
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              style={{
                fontSize: '0.78rem',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'transparent',
                color: '#64748B',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#E2E8F0';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              Exit Lab
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        {renderContent()}
      </main>

      {/* Floating Guide Assistant */}
      <CyberGuideChat />
    </div>
  );
};

export default CyberLabFull;
