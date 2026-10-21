import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Zap, AlertTriangle, CheckCircle, Terminal, RefreshCw, Play, Square } from 'lucide-react';

interface SimulatePageProps {
  onBack: () => void;
}

interface LogLine {
  id: number;
  time: string;
  src: string;
  dst: string;
  type: 'NORMAL' | 'SUSPICIOUS' | 'ATTACK' | 'BLOCKED';
  message: string;
}

interface Scenario {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  threat: string;
  logs: Omit<LogLine, 'id'>[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'phishing',
    name: 'Phishing Email',
    icon: '📧',
    color: '#FF4D4D',
    description: 'Watch how a phishing email is constructed, sent, and what happens when it reaches an inbox.',
    threat: 'Social Engineering',
    logs: [
      { time: '09:01:02', src: '203.0.113.44', dst: 'user@school.edu', type: 'NORMAL', message: 'SMTP CONNECT — spoofed sender: admin@school.edu' },
      { time: '09:01:03', src: '203.0.113.44', dst: 'user@school.edu', type: 'SUSPICIOUS', message: 'SMTP DATA — Subject: "URGENT: Your account will be DELETED"' },
      { time: '09:01:03', src: '203.0.113.44', dst: 'user@school.edu', type: 'ATTACK', message: 'Embedded hyperlink → bit.ly/xk99zz → redirect to 198.51.100.9 (credential harvester)' },
      { time: '09:01:05', src: 'user@school.edu', dst: '198.51.100.9', type: 'ATTACK', message: 'HTTP GET /login.php — victim clicked malicious link' },
      { time: '09:01:05', src: 'firewall', dst: '198.51.100.9', type: 'BLOCKED', message: '🛡 BLOCKED — Domain reputation: MALICIOUS. Email marked as PHISHING.' },
    ]
  },
  {
    id: 'bruteforce',
    name: 'Brute-Force Login',
    icon: '🔓',
    color: '#FF8C00',
    description: 'See how attackers try thousands of passwords per second to break into accounts.',
    threat: 'Credential Attack',
    logs: [
      { time: '14:22:10', src: '198.51.100.5', dst: 'login.school.com', type: 'NORMAL', message: 'HTTP POST /login — user: admin, pass: password123 — FAIL' },
      { time: '14:22:10', src: '198.51.100.5', dst: 'login.school.com', type: 'SUSPICIOUS', message: 'HTTP POST /login — user: admin, pass: qwerty — FAIL (attempt 2)' },
      { time: '14:22:11', src: '198.51.100.5', dst: 'login.school.com', type: 'SUSPICIOUS', message: 'HTTP POST /login — user: admin, pass: 123456 — FAIL (attempt 47)' },
      { time: '14:22:11', src: '198.51.100.5', dst: 'login.school.com', type: 'ATTACK', message: 'RATE ANOMALY — 200 login attempts in 1 second from single IP' },
      { time: '14:22:12', src: 'WAF', dst: '198.51.100.5', type: 'BLOCKED', message: '🛡 BLOCKED — IP rate-limited. 2FA challenge issued. Admin alerted.' },
    ]
  },
  {
    id: 'ransomware',
    name: 'Ransomware Drop',
    icon: '💀',
    color: '#EF4444',
    description: 'Observe how ransomware infiltrates a system and starts encrypting files.',
    threat: 'Malware / Ransomware',
    logs: [
      { time: '03:15:00', src: '192.168.1.45', dst: 'fileserver', type: 'NORMAL', message: 'SMB CONNECT — user: student01 — accessing \\\\fileserver\\shared' },
      { time: '03:15:01', src: '192.168.1.45', dst: 'fileserver', type: 'SUSPICIOUS', message: 'FILE WRITE — encrypt_me.exe copied to 14 directories simultaneously' },
      { time: '03:15:02', src: '192.168.1.45', dst: 'fileserver', type: 'ATTACK', message: 'PROCESS — encrypt_me.exe RUNNING — AES-256 encryption started on 847 files' },
      { time: '03:15:03', src: '192.168.1.45', dst: 'C2-server', type: 'ATTACK', message: 'HTTPS POST → 203.0.113.99 — encryption key exfiltrated to attacker' },
      { time: '03:15:03', src: 'EDR', dst: '192.168.1.45', type: 'BLOCKED', message: '🛡 BLOCKED — Mass encryption behavior detected. Process killed. Backup restore initiated.' },
    ]
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle',
    icon: '🕵️',
    color: '#A855F7',
    description: 'See how an attacker intercepts traffic between two devices on a network.',
    threat: 'Network Interception',
    logs: [
      { time: '11:08:22', src: '192.168.1.10', dst: 'router', type: 'NORMAL', message: 'ARP — "Who has 192.168.1.1?" — Router responds with MAC: AA:BB:CC:DD:EE:FF' },
      { time: '11:08:22', src: '192.168.1.77', dst: '192.168.1.10', type: 'SUSPICIOUS', message: 'ARP POISON — "192.168.1.1 is at 11:22:33:44:55:66" (attacker MAC — forged)' },
      { time: '11:08:23', src: '192.168.1.10', dst: '192.168.1.77', type: 'ATTACK', message: 'HTTP (plaintext) — FORWARDED to attacker — credentials visible: user=pavan&pass=secret' },
      { time: '11:08:23', src: '192.168.1.77', dst: 'bank.com', type: 'ATTACK', message: 'RELAY — attacker forwards packet to real destination (victim unaware)' },
      { time: '11:08:24', src: 'IDS', dst: '192.168.1.77', type: 'BLOCKED', message: '🛡 BLOCKED — Duplicate ARP MAC detected. HTTPS enforced. Attacker isolated.' },
    ]
  },
  {
    id: 'ddos',
    name: 'DDoS Flood',
    icon: '🌊',
    color: '#06B6D4',
    description: 'Watch thousands of fake requests overwhelm a server until it shuts down.',
    threat: 'Denial of Service',
    logs: [
      { time: '20:00:00', src: '10.0.0.1–255', dst: 'school-website.com', type: 'NORMAL', message: 'HTTP GET / — 50 rps — normal traffic pattern' },
      { time: '20:00:01', src: 'botnet-240k', dst: 'school-website.com', type: 'SUSPICIOUS', message: 'HTTP GET / — 18,000 rps — spike detected across 240,000 IPs (botnet)' },
      { time: '20:00:02', src: 'botnet-240k', dst: 'school-website.com', type: 'ATTACK', message: 'SERVER CPU 100% — memory exhausted — website response time 30s → timeout' },
      { time: '20:00:02', src: 'botnet-240k', dst: 'school-website.com', type: 'ATTACK', message: 'SYN FLOOD — 50,000 half-open TCP connections filling queue' },
      { time: '20:00:03', src: 'CDN/WAF', dst: 'botnet-240k', type: 'BLOCKED', message: '🛡 BLOCKED — CDN rate limits applied. Malicious IPs null-routed. CAPTCHA enabled.' },
    ]
  }
];

const typeColors: Record<LogLine['type'], { bg: string; text: string; dot: string }> = {
  NORMAL:     { bg: 'rgba(100,116,139,0.15)', text: '#94A3B8', dot: '#64748B' },
  SUSPICIOUS: { bg: 'rgba(234,179,8,0.12)',  text: '#FCD34D', dot: '#EAB308' },
  ATTACK:     { bg: 'rgba(239,68,68,0.12)',  text: '#FCA5A5', dot: '#EF4444' },
  BLOCKED:    { bg: 'rgba(16,185,129,0.12)', text: '#6EE7B7', dot: '#10B981' },
};

export const SimulatePage: React.FC<SimulatePageProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<Scenario>(SCENARIOS[0]);
  const [visibleLogs, setVisibleLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef(0);

  const startSim = useCallback(() => {
    setVisibleLogs([]);
    setDone(false);
    setRunning(true);
    counterRef.current = 0;
  }, []);

  const stopSim = useCallback(() => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const selectScenario = useCallback((s: Scenario) => {
    stopSim();
    setSelected(s);
    setVisibleLogs([]);
    setDone(false);
    counterRef.current = 0;
  }, [stopSim]);

  useEffect(() => {
    if (!running) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const idx = counterRef.current;
      if (idx >= selected.logs.length) {
        clearInterval(timerRef.current!);
        setRunning(false);
        setDone(true);
        return;
      }
      const log = selected.logs[idx];
      setVisibleLogs(prev => [...prev, { ...log, id: Date.now() + idx }]);
      counterRef.current += 1;
    }, 900);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, selected]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div style={{ color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px' }}>
      {/* Back button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          onClick={onBack}
          style={{
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
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#06B6D4', margin: 0, letterSpacing: '-0.02em' }}>
          Live Attack Simulator
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>
          Watch real cyber attacks unfold — packet by packet
        </p>
      </div>

      {/* Scenario picker */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => selectScenario(s)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: `1px solid ${selected.id === s.id ? s.color : 'rgba(100,116,139,0.25)'}`,
              backgroundColor: selected.id === s.id ? `${s.color}18` : 'rgba(15,23,42,0.6)',
              color: selected.id === s.id ? s.color : '#94A3B8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{s.icon}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Info bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(15,23,42,0.7)',
          border: `1px solid ${selected.color}30`,
        }}
      >
        <span style={{ fontSize: '2rem' }}>{selected.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '1rem' }}>{selected.name}</div>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '2px' }}>{selected.description}</div>
        </div>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: '100px',
            backgroundColor: `${selected.color}20`,
            border: `1px solid ${selected.color}50`,
            color: selected.color,
            fontSize: '0.72rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {selected.threat}
        </div>
      </div>

      {/* Terminal panel */}
      <div
        style={{
          borderRadius: '14px',
          border: '1px solid rgba(6,182,212,0.2)',
          overflow: 'hidden',
          backgroundColor: '#0A0F1E',
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: '#0F172A',
            borderBottom: '1px solid rgba(6,182,212,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="#06B6D4" />
            <span style={{ color: '#06B6D4', fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600 }}>
              PACKET_CAPTURE.log — {selected.name.toUpperCase().replace(' ', '_')}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={running ? stopSim : startSim}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: running ? 'rgba(239,68,68,0.2)' : 'rgba(6,182,212,0.2)',
                color: running ? '#FCA5A5' : '#06B6D4',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {running ? <><Square size={12} /> Stop</> : <><Play size={12} /> Run Simulation</>}
            </button>
            <button
              onClick={() => { selectScenario(selected); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '7px',
                border: '1px solid rgba(100,116,139,0.3)',
                backgroundColor: 'transparent',
                color: '#64748B',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Log stream */}
        <div
          ref={logRef}
          style={{
            minHeight: '260px',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '14px 16px',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {visibleLogs.length === 0 && !running && (
            <div style={{ color: '#334155', textAlign: 'center', paddingTop: '40px', fontFamily: 'monospace' }}>
              ▶ Press "Run Simulation" to start the packet capture
            </div>
          )}
          {visibleLogs.map(log => {
            const col = typeColors[log.type];
            return (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: col.bg,
                  border: `1px solid ${col.dot}25`,
                  animation: 'fadeInLog 0.3s ease',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.dot, flexShrink: 0, marginTop: '3px' }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', flex: 1 }}>
                  <span style={{ color: '#475569', whiteSpace: 'nowrap' }}>[{log.time}]</span>
                  <span style={{ color: '#7DD3FC', whiteSpace: 'nowrap' }}>{log.src}</span>
                  <span style={{ color: '#475569' }}>→</span>
                  <span style={{ color: '#93C5FD', whiteSpace: 'nowrap' }}>{log.dst}</span>
                  <span style={{ color: col.text, flex: 1 }}>{log.message}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: `${col.dot}25`,
                    color: col.text,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {log.type}
                </span>
              </div>
            );
          })}
          {running && (
            <div style={{ color: '#06B6D4', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>█</span> capturing...
            </div>
          )}
        </div>
      </div>

      {/* Outcome summary */}
      {done && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.35)',
          }}
        >
          <CheckCircle size={22} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#6EE7B7', marginBottom: '4px' }}>Threat Blocked — Simulation Complete</div>
            <div style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.5 }}>
              In real life, security systems (firewalls, antivirus, WAFs, EDRs) detect these patterns and block them automatically — but only if they are properly configured and up-to-date. Your job is to understand these attacks so you recognize them when they happen.
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        {Object.entries(typeColors).map(([type, col]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.dot }} />
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>{type}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInLog { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};