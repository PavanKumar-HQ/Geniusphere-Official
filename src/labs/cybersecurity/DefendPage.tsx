import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, Lock, Wifi, Eye, Globe, AlertTriangle, ChevronRight } from 'lucide-react';

interface DefendPageProps {
  onBack: () => void;
}

interface DefenseTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  blocks: string[];
  strength: number; // 1-5
}

interface AttackWave {
  id: string;
  name: string;
  icon: string;
  color: string;
  requiredTools: string[];
  description: string;
}

const TOOLS: DefenseTool[] = [
  {
    id: 'firewall',
    name: 'Firewall',
    icon: <Shield size={22} />,
    color: '#06B6D4',
    description: 'Monitors and controls incoming and outgoing network traffic based on security rules.',
    blocks: ['ddos', 'mitm', 'portscan'],
    strength: 4,
  },
  {
    id: 'antivirus',
    name: 'Antivirus',
    icon: <Eye size={22} />,
    color: '#10B981',
    description: 'Scans files and programs for malicious code and removes or quarantines threats.',
    blocks: ['malware', 'ransomware', 'trojan'],
    strength: 4,
  },
  {
    id: '2fa',
    name: '2FA',
    icon: <Lock size={22} />,
    color: '#A855F7',
    description: 'Two-factor authentication requires a second proof of identity beyond just a password.',
    blocks: ['bruteforce', 'phishing', 'credential'],
    strength: 5,
  },
  {
    id: 'vpn',
    name: 'VPN',
    icon: <Wifi size={22} />,
    color: '#F59E0B',
    description: 'Encrypts your internet connection and hides your IP address from eavesdroppers.',
    blocks: ['mitm', 'sniffing', 'portscan'],
    strength: 3,
  },
  {
    id: 'https',
    name: 'HTTPS',
    icon: <Globe size={22} />,
    color: '#3B82F6',
    description: 'Encrypts data between browser and server so no one can read it in transit.',
    blocks: ['mitm', 'sniffing', 'phishing'],
    strength: 3,
  },
  {
    id: 'updates',
    name: 'Auto Updates',
    icon: <CheckCircle size={22} />,
    color: '#EF4444',
    description: 'Keeps software patched against the latest known vulnerabilities.',
    blocks: ['ransomware', 'trojan', 'exploit'],
    strength: 4,
  },
];

const ATTACK_WAVES: AttackWave[] = [
  {
    id: 'phishing',
    name: 'Phishing Wave',
    icon: '📧',
    color: '#EF4444',
    description: 'Fake emails try to steal your login credentials.',
    requiredTools: ['2fa', 'https'],
  },
  {
    id: 'malware',
    name: 'Malware Drop',
    icon: '🦠',
    color: '#F59E0B',
    description: 'Malicious software tries to corrupt your system files.',
    requiredTools: ['antivirus', 'updates'],
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle',
    icon: '🕵️',
    color: '#A855F7',
    description: 'An attacker intercepts your network traffic.',
    requiredTools: ['vpn', 'https', 'firewall'],
  },
  {
    id: 'ransomware',
    name: 'Ransomware Attack',
    icon: '💀',
    color: '#DC2626',
    description: 'Ransomware tries to encrypt all your files.',
    requiredTools: ['antivirus', 'updates', 'firewall'],
  },
  {
    id: 'bruteforce',
    name: 'Brute-Force Login',
    icon: '🔓',
    color: '#FF8C00',
    description: 'Bot tries thousands of passwords per second.',
    requiredTools: ['2fa', 'firewall'],
  },
];

function calcDefenseScore(active: Set<string>, wave: AttackWave): { blocked: boolean; score: number; missingTools: string[] } {
  const matched = wave.requiredTools.filter(t => active.has(t));
  const missingTools = wave.requiredTools.filter(t => !active.has(t));
  const blocked = matched.length === wave.requiredTools.length;
  const score = Math.round((matched.length / wave.requiredTools.length) * 100);
  return { blocked, score, missingTools };
}

export const DefendPage: React.FC<DefendPageProps> = ({ onBack }) => {
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set());
  const [currentWave, setCurrentWave] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [result, setResult] = useState<{ blocked: boolean; score: number; missingTools: string[] } | null>(null);
  const [completedWaves, setCompletedWaves] = useState<{ wave: AttackWave; blocked: boolean }[]>([]);

  const wave = ATTACK_WAVES[currentWave];

  const toggleTool = (id: string) => {
    if (launched) return;
    setActiveTools(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  };

  const launchAttack = () => {
    const res = calcDefenseScore(activeTools, wave);
    setResult(res);
    setLaunched(true);
  };

  const nextWave = () => {
    setCompletedWaves(prev => [...prev, { wave, blocked: result?.blocked ?? false }]);
    setActiveTools(new Set());
    setResult(null);
    setLaunched(false);
    setCurrentWave(prev => Math.min(prev + 1, ATTACK_WAVES.length - 1));
  };

  const restart = () => {
    setActiveTools(new Set());
    setResult(null);
    setLaunched(false);
    setCurrentWave(0);
    setCompletedWaves([]);
  };

  const allDone = currentWave >= ATTACK_WAVES.length - 1 && launched;
  const blockedCount = completedWaves.filter(w => w.blocked).length + (result?.blocked ? 1 : 0);

  return (
    <div style={{ color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'rgba(30,41,59,0.8)',
          border: '1px solid rgba(100,116,139,0.3)',
          color: '#94A3B8',
          padding: '6px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.82rem',
          fontWeight: 600,
        }}
      >
        ← Back to Hub
      </button>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', margin: 0, letterSpacing: '-0.02em' }}>
          Protection Zone
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
          Choose your defenses, then launch the attack to see if you survive
        </p>
      </div>

      {/* Wave progress */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {ATTACK_WAVES.map((w, i) => {
          const done = completedWaves.find(c => c.wave.id === w.id);
          const isCurrent = i === currentWave;
          return (
            <div
              key={w.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: `1px solid ${isCurrent ? w.color : done ? (done.blocked ? '#10B981' : '#EF4444') : 'rgba(100,116,139,0.25)'}`,
                backgroundColor: isCurrent ? `${w.color}15` : done ? (done.blocked ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : 'transparent',
                color: isCurrent ? w.color : done ? (done.blocked ? '#10B981' : '#EF4444') : '#475569',
              }}
            >
              {w.icon} {w.name.split(' ')[0]}
              {done && (done.blocked ? ' ✓' : ' ✗')}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: Current attack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Attack card */}
          <div
            style={{
              padding: '18px',
              borderRadius: '14px',
              border: `2px solid ${wave.color}50`,
              backgroundColor: `${wave.color}0D`,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>{wave.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: wave.color, fontSize: '1.05rem' }}>{wave.name}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>{wave.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Needs defense against:</span>
              {!launched && wave.requiredTools.map(t => (
                <span
                  key={t}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(100,116,139,0.2)',
                    color: '#94A3B8',
                  }}
                >
                  {t.toUpperCase()}
                </span>
              ))}
              {launched && wave.requiredTools.map(t => {
                const covered = activeTools.has(t);
                return (
                  <span
                    key={t}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: covered ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                      color: covered ? '#10B981' : '#EF4444',
                    }}
                  >
                    {covered ? '✓ ' : '✗ '}{t.toUpperCase()}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Result panel */}
          {result && (
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: result.blocked ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result.blocked ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {result.blocked
                  ? <CheckCircle size={22} color="#10B981" />
                  : <XCircle size={22} color="#EF4444" />}
                <div style={{ fontWeight: 800, color: result.blocked ? '#6EE7B7' : '#FCA5A5', fontSize: '1rem' }}>
                  {result.blocked ? 'Attack Blocked! 🎉' : `Penetrated — ${result.score}% defended`}
                </div>
              </div>
              {!result.blocked && result.missingTools.length > 0 && (
                <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                  You were missing: <strong style={{ color: '#FCD34D' }}>{result.missingTools.map(t => t.toUpperCase()).join(', ')}</strong>
                </div>
              )}
              {!allDone && (
                <button
                  onClick={nextWave}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#1E293B',
                    color: '#E2E8F0',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    alignSelf: 'flex-start',
                  }}
                >
                  Next Wave <ChevronRight size={14} />
                </button>
              )}
              {allDone && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#FCD34D', fontSize: '1rem' }}>
                    Final Score: {blockedCount}/{ATTACK_WAVES.length} attacks blocked
                  </div>
                  <button
                    onClick={restart}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#10B981',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Launch button */}
          {!launched && (
            <button
              onClick={launchAttack}
              disabled={activeTools.size === 0}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTools.size > 0 ? wave.color : 'rgba(100,116,139,0.2)',
                color: activeTools.size > 0 ? '#000' : '#475569',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: activeTools.size > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={16} />
              Launch Attack
            </button>
          )}
        </div>

        {/* Right: Tool picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontWeight: 700, color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Your Defense Arsenal — select tools to activate
          </div>
          {TOOLS.map(tool => {
            const isActive = activeTools.has(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '11px',
                  border: `1px solid ${isActive ? tool.color : 'rgba(100,116,139,0.2)'}`,
                  backgroundColor: isActive ? `${tool.color}15` : 'rgba(15,23,42,0.5)',
                  color: '#E2E8F0',
                  cursor: launched ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  opacity: launched ? 0.85 : 1,
                }}
              >
                <div style={{ color: isActive ? tool.color : '#64748B', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {tool.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isActive ? tool.color : '#CBD5E1' }}>{tool.name}</div>
                  <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}>{tool.description}</div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', gap: '3px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '5px',
                        height: '14px',
                        borderRadius: '2px',
                        backgroundColor: i < tool.strength ? (isActive ? tool.color : '#334155') : 'rgba(100,116,139,0.15)',
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `2px solid ${isActive ? tool.color : 'rgba(100,116,139,0.3)'}`,
                    backgroundColor: isActive ? tool.color : 'transparent',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isActive && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};