import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FirewallRule,
  NetworkPacket,
  PacketVerdict,
  RuleAction,
  ProtocolType,
  evaluatePacket,
  getInitialFirewallRules,
  SAMPLE_PACKETS,
  FIREWALL_CHALLENGES,
  FirewallChallenge,
} from '../firewallSimulationEngine';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  Globe,
  Radio,
  Sliders,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';

interface InteractiveFirewallSimulatorProps {
  onChallengeComplete?: (challengeId: string) => void;
}

export const InteractiveFirewallSimulator: React.FC<InteractiveFirewallSimulatorProps> = ({
  onChallengeComplete,
}) => {
  // Firewall State
  const [rules, setRules] = useState<FirewallRule[]>(getInitialFirewallRules);
  const [defaultPolicy, setDefaultPolicy] = useState<RuleAction>('DROP');
  const [verdicts, setVerdicts] = useState<PacketVerdict[]>([]);
  const [isTrafficStreaming, setIsTrafficStreaming] = useState<boolean>(false);
  const [activeChallenge, setActiveChallenge] = useState<FirewallChallenge | null>(null);
  const [challengeResult, setChallengeResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Form state for creating a new rule
  const [newRuleName, setNewRuleName] = useState<string>('Block Port 23');
  const [newRuleProtocol, setNewRuleProtocol] = useState<ProtocolType | 'ANY'>('TCP');
  const [newRuleCidr, setNewRuleCidr] = useState<string>('0.0.0.0/0');
  const [newRulePort, setNewRulePort] = useState<string>('23');
  const [newRuleAction, setNewRuleAction] = useState<RuleAction>('DROP');

  // Traffic generator timer
  const trafficTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const packetCounterRef = useRef<number>(100);

  // Lifecycle cleanup
  useEffect(() => {
    return () => {
      if (trafficTimerRef.current) {
        clearInterval(trafficTimerRef.current);
        trafficTimerRef.current = null;
      }
    };
  }, []);

  // Process a single packet through current rules
  const injectPacket = useCallback(
    (sample: Omit<NetworkPacket, 'id' | 'timestamp'>) => {
      packetCounterRef.current += 1;
      const packet: NetworkPacket = {
        ...sample,
        id: `pkt-${packetCounterRef.current}`,
        timestamp: Date.now(),
      };

      const verdict = evaluatePacket(packet, rules, defaultPolicy);
      setVerdicts((prev) => [verdict, ...prev.slice(0, 49)]); // keep last 50
    },
    [rules, defaultPolicy]
  );

  // Toggle background traffic stream
  useEffect(() => {
    if (isTrafficStreaming) {
      trafficTimerRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * SAMPLE_PACKETS.length);
        injectPacket(SAMPLE_PACKETS[randomIndex]);
      }, 1400);
    } else {
      if (trafficTimerRef.current) {
        clearInterval(trafficTimerRef.current);
        trafficTimerRef.current = null;
      }
    }

    return () => {
      if (trafficTimerRef.current) {
        clearInterval(trafficTimerRef.current);
        trafficTimerRef.current = null;
      }
    };
  }, [isTrafficStreaming, injectPacket]);

  // Rule operations
  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleMoveRule = (index: number, direction: 'UP' | 'DOWN') => {
    setRules((prev) => {
      const targetIndex = direction === 'UP' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const parsedPort =
      newRulePort.trim().toUpperCase() === 'ANY'
        ? 'ANY'
        : parseInt(newRulePort, 10);

    const newRule: FirewallRule = {
      id: `rule-${Date.now().toString().slice(-4)}`,
      name: newRuleName.trim(),
      protocol: newRuleProtocol,
      sourceCidr: newRuleCidr.trim() || '0.0.0.0/0',
      destPort: isNaN(parsedPort as number) ? 'ANY' : parsedPort,
      action: newRuleAction,
      enabled: true,
    };

    setRules((prev) => [newRule, ...prev]);
    setNewRuleName('');
  };

  const handleResetToDefaults = () => {
    setRules(getInitialFirewallRules());
    setDefaultPolicy('DROP');
    setVerdicts([]);
    setIsTrafficStreaming(false);
    setChallengeResult(null);
  };

  // Run challenge verification
  const handleVerifyChallenge = () => {
    if (!activeChallenge) return;

    const testVerdicts: PacketVerdict[] = activeChallenge.testPackets.map((pkt) =>
      evaluatePacket(pkt, rules, defaultPolicy)
    );

    const passed = activeChallenge.verifySuccess(testVerdicts, rules, defaultPolicy);

    if (passed) {
      setChallengeResult({
        success: true,
        message: `Mission Accomplished! All verification packets were correctly filtered according to defensive criteria.`,
      });
      if (onChallengeComplete) {
        onChallengeComplete(activeChallenge.id);
      }
    } else {
      setChallengeResult({
        success: false,
        message: `Defense Verification Failed. Some test packets violated policy constraints. Check rule order or default action!`,
      });
    }
  };

  // Metrics
  const totalPackets = verdicts.length;
  const allowedCount = verdicts.filter((v) => v.action === 'ALLOW').length;
  const droppedCount = verdicts.filter((v) => v.action === 'DROP' || v.action === 'REJECT').length;
  const dropRate = totalPackets > 0 ? Math.round((droppedCount / totalPackets) * 100) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        color: '#E2E8F0',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
      }}
    >
      {/* Top Banner / Mode Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(15,23,42,0.8) 100%)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: 'rgba(6,182,212,0.2)',
              color: '#22D3EE',
              display: 'flex',
            }}
          >
            <Shield size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC' }}>
              Stateful Network Firewall & Packet Filter Lab
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94A3B8' }}>
              Inspect incoming packets, configure ordered ACL rules, block malicious payloads, and observe real cause-and-effect verdicts.
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsTrafficStreaming((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: isTrafficStreaming ? '1px solid #22C55E' : '1px solid rgba(148,163,184,0.3)',
              backgroundColor: isTrafficStreaming ? 'rgba(34,197,94,0.2)' : 'rgba(30,41,59,0.7)',
              color: isTrafficStreaming ? '#4ADE80' : '#E2E8F0',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {isTrafficStreaming ? <Pause size={14} /> : <Play size={14} />}
            {isTrafficStreaming ? 'Stream Active' : 'Start Live Stream'}
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(148,163,184,0.3)',
              backgroundColor: 'rgba(30,41,59,0.7)',
              color: '#94A3B8',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            Reset Rules
          </button>
        </div>
      </div>

      {/* Network Topology Visualizer */}
      <div
        style={{
          background: '#070B1A',
          border: '1px solid #1E293B',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.08em' }}>
            NETWORK ARCHITECTURE & PACKET FLOW
          </span>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <span style={{ color: '#94A3B8' }}>Total: <b style={{ color: '#F8FAFC' }}>{totalPackets}</b></span>
            <span style={{ color: '#4ADE80' }}>Allowed: <b>{allowedCount}</b></span>
            <span style={{ color: '#F87171' }}>Blocked: <b>{droppedCount}</b> ({dropRate}%)</span>
          </div>
        </div>

        {/* 3-Node Topology Pipeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0',
          }}
        >
          {/* Node 1: Untrusted External Internet */}
          <div
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#38BDF8', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
              <Globe size={28} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>External Internet</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Untrusted Ingress (0.0.0.0/0)</div>
          </div>

          {/* Node 2: Stateful Firewall Gateway */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(2,132,199,0.2)',
            }}
          >
            <div style={{ color: '#38BDF8', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
              <ShieldCheck size={32} />
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#38BDF8' }}>Stateful Firewall Node</div>
            <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '4px' }}>
              Default Policy: <b style={{ color: defaultPolicy === 'ALLOW' ? '#4ADE80' : '#F87171' }}>{defaultPolicy}</b>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{rules.filter((r) => r.enabled).length} Active Rules (First Match)</div>
          </div>

          {/* Node 3: Protected Intranet / Target Host */}
          <div
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#34D399', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
              <Server size={28} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#34D399' }}>Protected Host</div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>IP: 10.0.0.10 (App & DB Core)</div>
          </div>
        </div>

        {/* Quick Sample Packet Injectors */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #1E293B' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>Inject Test Packet:</span>
          {SAMPLE_PACKETS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => injectPacket(sample)}
              style={{
                fontSize: '0.7rem',
                padding: '4px 8px',
                borderRadius: '6px',
                border: sample.isMalicious ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(34,197,94,0.4)',
                backgroundColor: sample.isMalicious ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                color: sample.isMalicious ? '#FCA5A5' : '#86EFAC',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {sample.protocol}:{sample.destPort} ({sample.isMalicious ? 'Attack' : 'Legit'})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Rules Manager vs Challenge & Verdict Log */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Left Column: Firewall Rules Management */}
        <div
          style={{
            background: '#070B1A',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38BDF8' }}>
              FIREWALL ACCESS CONTROL LIST (ACL)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Default Policy:</span>
              <select
                aria-label="Default Firewall Policy"
                value={defaultPolicy}
                onChange={(e) => setDefaultPolicy(e.target.value as RuleAction)}
                style={{
                  background: '#0F172A',
                  border: '1px solid #334155',
                  color: defaultPolicy === 'ALLOW' ? '#4ADE80' : '#F87171',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <option value="DROP">DROP (Default Deny)</option>
                <option value="ALLOW">ALLOW (Open)</option>
                <option value="REJECT">REJECT (ICMP Unreachable)</option>
              </select>
            </div>
          </div>

          {/* Rules List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                style={{
                  background: rule.enabled ? 'rgba(15,23,42,0.9)' : 'rgba(15,23,42,0.4)',
                  border: rule.enabled ? '1px solid #334155' : '1px solid #1E293B',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  opacity: rule.enabled ? 1 : 0.6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: '#64748B',
                      width: '18px',
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <input
                    type="checkbox"
                    aria-label={`Toggle rule ${rule.name}`}
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                    style={{ cursor: 'pointer', accentColor: '#0284C7' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F1F5F9', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {rule.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#94A3B8' }}>
                      {rule.protocol} • Port {rule.destPort} • CIDR {rule.sourceCidr}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: rule.action === 'ALLOW' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: rule.action === 'ALLOW' ? '#4ADE80' : '#F87171',
                      border: rule.action === 'ALLOW' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)',
                    }}
                  >
                    {rule.action}
                  </span>

                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveRule(idx, 'UP')}
                    aria-label="Move rule up in priority"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: idx === 0 ? '#334155' : '#94A3B8',
                      cursor: idx === 0 ? 'default' : 'pointer',
                      padding: '2px',
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={idx === rules.length - 1}
                    onClick={() => handleMoveRule(idx, 'DOWN')}
                    aria-label="Move rule down in priority"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: idx === rules.length - 1 ? '#334155' : '#94A3B8',
                      cursor: idx === rules.length - 1 ? 'default' : 'pointer',
                      padding: '2px',
                    }}
                  >
                    <ArrowDown size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    aria-label={`Delete rule ${rule.name}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Rule Form */}
          <form
            onSubmit={handleAddRule}
            style={{
              background: '#0B1021',
              border: '1px solid #1E293B',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38BDF8' }}>
              Add Custom Filter Rule:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="Rule Label (e.g. Block Port 23)"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                style={{
                  gridColumn: '1 / -1',
                  background: '#070B1A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              />
              <select
                aria-label="Filter Protocol"
                value={newRuleProtocol}
                onChange={(e) => setNewRuleProtocol(e.target.value as any)}
                style={{
                  background: '#070B1A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
                <option value="ANY">ANY Protocol</option>
              </select>

              <select
                aria-label="Filter Action"
                value={newRuleAction}
                onChange={(e) => setNewRuleAction(e.target.value as RuleAction)}
                style={{
                  background: '#070B1A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              >
                <option value="DROP">DROP</option>
                <option value="ALLOW">ALLOW</option>
                <option value="REJECT">REJECT</option>
              </select>

              <input
                type="text"
                placeholder="Source CIDR (0.0.0.0/0)"
                value={newRuleCidr}
                onChange={(e) => setNewRuleCidr(e.target.value)}
                style={{
                  background: '#070B1A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              />

              <input
                type="text"
                placeholder="Dest Port (e.g. 23 or ANY)"
                value={newRulePort}
                onChange={(e) => setNewRulePort(e.target.value)}
                style={{
                  background: '#070B1A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: '#0284C7',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              <Plus size={14} /> Add Rule to Top
            </button>
          </form>
        </div>

        {/* Right Column: Defensive Challenges & Live Verdict Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Challenge Selector Card */}
          <div
            style={{
              background: '#070B1A',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
              <Award size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>DEFENSIVE CHALLENGE MISSIONS</span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {FIREWALL_CHALLENGES.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setActiveChallenge(ch);
                    setChallengeResult(null);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: activeChallenge?.id === ch.id ? '1px solid #F59E0B' : '1px solid #334155',
                    backgroundColor: activeChallenge?.id === ch.id ? 'rgba(245,158,11,0.2)' : 'rgba(15,23,42,0.6)',
                    color: activeChallenge?.id === ch.id ? '#FDE68A' : '#94A3B8',
                  }}
                >
                  {ch.title.split(':')[0]}
                </button>
              ))}
            </div>

            {activeChallenge && (
              <div
                style={{
                  background: 'rgba(15,23,42,0.7)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#FCD34D' }}>
                  {activeChallenge.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                  {activeChallenge.objective}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontStyle: 'italic' }}>
                  💡 Hint: {activeChallenge.hint}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyChallenge}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '4px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#D97706',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  Run Defensive Verification
                </button>

                {challengeResult && (
                  <div
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: challengeResult.success ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      border: challengeResult.success ? '1px solid #22C55E' : '1px solid #EF4444',
                      color: challengeResult.success ? '#4ADE80' : '#FCA5A5',
                    }}
                  >
                    {challengeResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    <span>{challengeResult.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Packet Verdict Log */}
          <div
            style={{
              background: '#070B1A',
              border: '1px solid #1E293B',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38BDF8' }}>
                REAL-TIME PACKET VERDICT INSPECTOR
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                Latest {verdicts.length} packets
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                maxHeight: '260px',
                overflowY: 'auto',
                fontFamily: 'monospace',
              }}
            >
              {verdicts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '0.75rem' }}>
                  No packet activity yet. Click "Start Live Stream" or inject a test packet above!
                </div>
              ) : (
                verdicts.map((v) => (
                  <div
                    key={v.packet.id}
                    style={{
                      background: 'rgba(15,23,42,0.7)',
                      borderLeft: `4px solid ${v.action === 'ALLOW' ? '#22C55E' : '#EF4444'}`,
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#F1F5F9', fontWeight: 700 }}>
                        {v.packet.sourceIp} → :{v.packet.destPort} ({v.packet.protocol})
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          backgroundColor: v.action === 'ALLOW' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                          color: v.action === 'ALLOW' ? '#4ADE80' : '#F87171',
                        }}
                      >
                        {v.action}
                      </span>
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.65rem' }}>
                      {v.packet.payloadDescription}
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.62rem' }}>
                      {v.reason}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
