// ====================================================================
// Geniusphere 2.0 — Real-Time Header Status Indicator & Backend Console Trigger
// ====================================================================

import React, { useEffect, useState } from 'react';
import { backendEngine } from '../backend/RealtimeOrchestrator';
import { InMemoryDatabase } from '../db/in-memory-db';
import { BackendLiveConsoleDrawer } from './BackendLiveConsoleDrawer';

export const RealtimeHeaderStatus: React.FC<{
  currentUserId: string;
  db: InMemoryDatabase;
}> = ({ currentUserId, db }) => {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [rtt, setRtt] = useState<number>(8);
  const [status, setStatus] = useState<'connected' | 'reconnecting' | 'offline'>('connected');

  useEffect(() => {
    const interval = setInterval(() => {
      const telem = backendEngine.getTelemetry();
      setRtt(telem.rtt_ms);
      setStatus(telem.status);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setConsoleOpen(true)}
        style={{
          height: '36px',
          minHeight: '36px',
          maxHeight: '36px',
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '0 10px',
          fontSize: '0.76rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        title={`Geniusphere Sovereign Backend: ${status.toUpperCase()} (${rtt}ms RTT)\nClick to inspect live Database Tables & Telemetry`}
        aria-label="Backend status"
      >
        <span
          style={{
            position: 'relative',
            display: 'flex',
            width: '8px',
            height: '8px',
          }}
        >
          <span
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: status === 'connected' ? 'var(--brand-primary)' : 'var(--error, #EF4444)',
              opacity: 0.75,
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}
          />
          <span
            style={{
              position: 'relative',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: status === 'connected' ? 'var(--brand-primary)' : 'var(--error, #EF4444)',
            }}
          />
        </span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{rtt}ms</span>
      </button>

      <BackendLiveConsoleDrawer
        isOpen={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        db={db}
        currentUserId={currentUserId}
      />
    </>
  );
};
