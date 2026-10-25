import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Brain,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Lock,
  Wifi,
  ExternalLink,
} from 'lucide-react';

export interface NotebookKnowledgeGraphAnimationProps {
  onLaunchSoftware?: () => void;
  onSelectDomain?: (domain: string) => void;
}

interface SourceNode {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
  bgLight: string;
  borderColor: string;
  y: number; // relative SVG percentage
  targets: string[];
  simulationPreview: {
    title: string;
    metrics: string;
    snippet: string;
  };
}

interface MiddleNode {
  id: string;
  label: string;
  y: number;
  color: string;
}

interface TargetNode {
  id: string;
  label: string;
  category: 'lab' | 'sandbox' | 'audit';
  categoryLabel: string;
  y: number;
  color: string;
}

export const NotebookKnowledgeGraphAnimation: React.FC<NotebookKnowledgeGraphAnimationProps> = ({
  onLaunchSoftware,
  onSelectDomain,
}) => {
  const [activeSourceId, setActiveSourceId] = useState<string>('ai');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animationTick, setAnimationTick] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Source Domains (Left Column)
  const sources: SourceNode[] = useMemo(
    () => [
      {
        id: 'ai',
        label: 'AI & Prompt Engineering',
        shortLabel: 'AI & ML',
        icon: Brain,
        color: '#2563EB', // vibrant blue like NotebookLM
        bgLight: 'rgba(37, 99, 235, 0.08)',
        borderColor: 'rgba(37, 99, 235, 0.3)',
        y: 18,
        targets: ['lab-ai', 'sand-python', 'audit-cie'],
        simulationPreview: {
          title: 'Neural Network Weight Classification',
          metrics: 'Decision Boundary: 94.2% Confidence • Safe',
          snippet: 'classify(keywordDensity: 15, urgency: 20) -> Legitimate',
        },
      },
      {
        id: 'blockchain',
        label: 'Blockchain & Web3',
        shortLabel: 'Web3 Ledger',
        icon: Lock,
        color: '#D97706', // amber
        bgLight: 'rgba(217, 119, 6, 0.08)',
        borderColor: 'rgba(217, 119, 6, 0.3)',
        y: 34,
        targets: ['lab-chain', 'sand-js', 'audit-cie'],
        simulationPreview: {
          title: 'Cryptographic SHA-256 Block Mining',
          metrics: 'Nonce: 142 • Hash: 00a4b73f8... • Chain Valid',
          snippet: 'mineBlock(targetZeros: 2) -> Verified Link Sealed',
        },
      },
      {
        id: 'iot',
        label: 'IoT & Smart Sensors',
        shortLabel: 'IoT Telemetry',
        icon: Wifi,
        color: '#059669', // emerald
        bgLight: 'rgba(5, 150, 105, 0.08)',
        borderColor: 'rgba(5, 150, 105, 0.3)',
        y: 50,
        targets: ['lab-iot', 'sand-c', 'audit-cie'],
        simulationPreview: {
          title: 'Sensor Event State Machine',
          metrics: 'Temp: 39°C • Trigger: Relay Active (Fan ON)',
          snippet: 'emitTelemetry({ topic: "env/temp", value: 39 })',
        },
      },
      {
        id: 'finance',
        label: 'FinTech & Capital Markets',
        shortLabel: 'Markets & Algo',
        icon: TrendingUp,
        color: '#4F46E5', // indigo
        bgLight: 'rgba(79, 70, 229, 0.08)',
        borderColor: 'rgba(79, 70, 229, 0.3)',
        y: 66,
        targets: ['lab-market', 'sand-sql', 'audit-cie'],
        simulationPreview: {
          title: 'High-Frequency Order Book Matcher',
          metrics: 'Spread: $0.02 • Match: 150 shares @ $42.50',
          snippet: 'matchOrders(bid: 42.50, ask: 42.52) -> Executed',
        },
      },
      {
        id: 'cybersecurity',
        label: 'Cyber Defense & Privacy',
        shortLabel: 'Cyber Defense',
        icon: ShieldCheck,
        color: '#DC2626', // rose / crimson
        bgLight: 'rgba(220, 38, 38, 0.08)',
        borderColor: 'rgba(220, 38, 38, 0.3)',
        y: 82,
        targets: ['lab-privacy', 'sand-c', 'audit-cie'],
        simulationPreview: {
          title: 'Zero-Knowledge Privacy Exposure Radar',
          metrics: 'Exposure Score: 18% (Safe) • Third-Party Blocked',
          snippet: 'revokePermissions(["mic", "location", "tracking"])',
        },
      },
    ],
    []
  );

  // Middle Synthesis Layer (Nodes where knowledge converges)
  const middleNodes: MiddleNode[] = useMemo(
    () => [
      { id: 'synth-engine', label: 'Simulation Engine', y: 30, color: '#2563EB' },
      { id: 'synth-runtime', label: 'Deterministic Runtime', y: 50, color: '#059669' },
      { id: 'synth-eval', label: 'Objective Evaluator', y: 70, color: '#4F46E5' },
    ],
    []
  );

  // Target Outputs (Right Column)
  const targets: TargetNode[] = useMemo(
    () => [
      { id: 'lab-ai', label: 'AI Classification Lab', category: 'lab', categoryLabel: 'Interactive Lab', y: 14, color: '#2563EB' },
      { id: 'lab-chain', label: 'SHA-256 Block Builder', category: 'lab', categoryLabel: 'Interactive Lab', y: 24, color: '#D97706' },
      { id: 'lab-iot', label: 'MQTT Telemetry Simulator', category: 'lab', categoryLabel: 'Interactive Lab', y: 34, color: '#059669' },
      { id: 'lab-market', label: 'Order-Book Explorer', category: 'lab', categoryLabel: 'Interactive Lab', y: 44, color: '#4F46E5' },
      { id: 'lab-privacy', label: 'Digital Footprint Shield', category: 'lab', categoryLabel: 'Interactive Lab', y: 54, color: '#DC2626' },
      { id: 'sand-python', label: 'Python Algorithm Sandbox', category: 'sandbox', categoryLabel: 'Code Sandbox', y: 64, color: '#0284C7' },
      { id: 'sand-c', label: 'C Memory & Pointers', category: 'sandbox', categoryLabel: 'Code Sandbox', y: 74, color: '#0D9488' },
      { id: 'sand-sql', label: 'SQL Relational Queries', category: 'sandbox', categoryLabel: 'Code Sandbox', y: 84, color: '#6366F1' },
      { id: 'audit-cie', label: 'CIE Verifiable Portfolio', category: 'audit', categoryLabel: 'Credential', y: 94, color: '#43A85B' },
    ],
    []
  );

  // Auto-cycle through domains every 4.5 seconds when not paused by user
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSourceId((prev) => {
        const idx = sources.findIndex((s) => s.id === prev);
        const nextIdx = (idx + 1) % sources.length;
        return sources[nextIdx].id;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, sources]);

  // Smooth continuous animation ticker for light pulses along curves
  useEffect(() => {
    let animId: number;
    const updateTick = () => {
      setAnimationTick((t) => (t + 1) % 1000);
      animId = requestAnimationFrame(updateTick);
    };
    animId = requestAnimationFrame(updateTick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const activeSource = useMemo(
    () => sources.find((s) => s.id === activeSourceId) || sources[0],
    [activeSourceId, sources]
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      {/* 3D FLOATING PERSPECTIVE STAGE (NotebookLM Aesthetic) */}
      <div
        style={{
          width: '100%',
          maxWidth: '1180px',
          borderRadius: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 60px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '30%',
            right: '30%',
            height: '220px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.12), transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Top Control Bar with Pill Tags & Play/Pause */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* Left: Source Indicator Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: activeSource.bgLight,
                border: `1px solid ${activeSource.borderColor}`,
                fontSize: '0.78rem',
                fontWeight: 700,
                color: activeSource.color,
                letterSpacing: '0.02em',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: activeSource.color,
                  boxShadow: `0 0 8px ${activeSource.color}`,
                }}
              />
              SYNTHESIS ACTIVE: {activeSource.shortLabel.toUpperCase()}
            </span>

            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                display: 'none',
              }}
              className="desktop-only-inline"
            >
              12 Canonical Courses • 14 Simulators • Deterministic Runtime
            </span>
          </div>

          {/* Right: Controls & Try Geniusphere CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '100px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-canvas)',
                color: 'var(--text-primary)',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={isAutoPlaying ? 'Pause automatic domain cycling' : 'Resume automatic domain cycling'}
            >
              {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isAutoPlaying ? 'Auto-Flow ON' : 'Paused'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSourceId('ai');
                setIsAutoPlaying(true);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '100px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-canvas)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Reset Animation"
            >
              <RotateCcw size={13} />
            </button>

            {onLaunchSoftware && (
              <button
                type="button"
                onClick={onLaunchSoftware}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Launch in App</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN INTERACTIVE KNOWLEDGE TREE CANVAS (NotebookLM Styled)   */}
        {/* ============================================================ */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '460px',
            backgroundColor: 'var(--bg-canvas)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Background Grid Pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />

          {/* SVG Connector Layer */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <defs>
              {/* Linear Gradients for flowing connectors */}
              <linearGradient id="flow-active-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="flow-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="flow-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>

              {/* Glowing Dot Filter */}
              <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Render Bezier Curves from Sources to Middle Synthesis Nodes */}
            {sources.map((src) => {
              const isActive = src.id === activeSourceId;
              const sourceX = 220; // right edge of source pills
              const sourceY = (src.y / 100) * 460;

              return middleNodes.map((mid) => {
                const midX = 540; // center of middle synthesis hub
                const midY = (mid.y / 100) * 460;

                // Bezier control points for smooth natural curve
                const cp1x = sourceX + (midX - sourceX) * 0.45;
                const cp1y = sourceY;
                const cp2x = sourceX + (midX - sourceX) * 0.55;
                const cp2y = midY;

                const pathData = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY}`;

                // Calculate travelling particle position along the active curve
                const pulseOffset = (animationTick * 1.8) % 100;

                return (
                  <g key={`sm-${src.id}-${mid.id}`}>
                    {/* Inactive or baseline subtle path */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isActive ? src.color : 'var(--border-subtle)'}
                      strokeWidth={isActive ? 2.5 : 1}
                      strokeOpacity={isActive ? 0.75 : 0.25}
                      strokeDasharray={isActive ? 'none' : '4,4'}
                      style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                    />

                    {/* Flowing Animated Particle along Active Curve */}
                    {isActive && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth={3.5}
                        strokeDasharray="12, 140"
                        strokeDashoffset={-pulseOffset * 1.5}
                        strokeLinecap="round"
                        filter="url(#glow-dot)"
                      />
                    )}
                  </g>
                );
              });
            })}

            {/* Render Bezier Curves from Middle Synthesis Nodes to Output Targets */}
            {middleNodes.map((mid) => {
              const midX = 640; // right edge of middle synthesis card
              const midY = (mid.y / 100) * 460;

              return targets.map((tgt) => {
                const isTargetActive = activeSource.targets.includes(tgt.id);
                const targetX = 860; // left edge of target pills
                const targetY = (tgt.y / 100) * 460;

                const cp1x = midX + (targetX - midX) * 0.45;
                const cp1y = midY;
                const cp2x = midX + (targetX - midX) * 0.55;
                const cp2y = targetY;

                const pathData = `M ${midX} ${midY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
                const pulseOffset = ((animationTick * 2 + 50) % 100);

                return (
                  <g key={`mt-${mid.id}-${tgt.id}`}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isTargetActive ? tgt.color : 'var(--border-subtle)'}
                      strokeWidth={isTargetActive ? 2.5 : 1}
                      strokeOpacity={isTargetActive ? 0.8 : 0.2}
                      strokeDasharray={isTargetActive ? 'none' : '4,4'}
                      style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                    />

                    {isTargetActive && (
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#60A5FA"
                        strokeWidth={3}
                        strokeDasharray="10, 120"
                        strokeDashoffset={-pulseOffset * 1.4}
                        strokeLinecap="round"
                        filter="url(#glow-dot)"
                      />
                    )}

                    {/* Bright Glowing Blue Junction Dot (Iconic NotebookLM visual) */}
                    {isTargetActive && (
                      <circle
                        cx={targetX}
                        cy={targetY}
                        r={4.5}
                        fill={tgt.color}
                        filter="url(#glow-dot)"
                      />
                    )}
                  </g>
                );
              });
            })}
          </svg>

          {/* ============================================================ */}
          {/* HTML LAYER: INTERACTIVE NODES & FLOATING CARDS               */}
          {/* ============================================================ */}

          {/* COLUMN 1: SOURCES / CANONICAL CURRICULUM (Left) */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              bottom: '20px',
              width: '196px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 3,
            }}
          >
            {sources.map((src) => {
              const isActive = src.id === activeSourceId;
              const IconComp = src.icon;

              return (
                <div
                  key={src.id}
                  onClick={() => {
                    setActiveSourceId(src.id);
                    setIsAutoPlaying(false);
                    if (onSelectDomain) onSelectDomain(src.id);
                  }}
                  onMouseEnter={() => setHoveredNode(src.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'var(--bg-surface)' : 'rgba(255, 255, 255, 0.75)',
                    border: `1.5px solid ${isActive ? src.color : 'var(--border-subtle)'}`,
                    boxShadow: isActive
                      ? `0 4px 16px ${src.bgLight}, 0 0 0 1px ${src.borderColor}`
                      : '0 2px 6px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transform: isActive ? 'translateX(4px)' : hoveredNode === src.id ? 'translateX(2px)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  title={`Select ${src.label}`}
                >
                  {/* Checked Badge indicator matching NotebookLM */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      backgroundColor: isActive ? src.color : 'var(--bg-surface-subdued)',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <IconComp size={12} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isActive ? src.color : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {src.shortLabel}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                      {src.targets.length} Verified Modules
                    </div>
                  </div>

                  {/* Right connection pin dot */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? src.color : 'var(--border-subtle)',
                      boxShadow: isActive ? `0 0 8px ${src.color}` : 'none',
                      flexShrink: 0,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* COLUMN 2: MIDDLE SYNTHESIS HUB (Center) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '52%',
              transform: 'translate(-50%, -50%)',
              width: '220px',
              zIndex: 3,
            }}
          >
            <div
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid var(--border-subtle)',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'center',
              }}
            >
              {/* Central Glowing Icon */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-canvas)',
                  border: `1.5px solid ${activeSource.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: activeSource.color,
                  boxShadow: `0 0 20px ${activeSource.bgLight}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <Cpu size={22} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  Geniusphere Engine
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Deterministic Client Runtime
                </div>
              </div>

              {/* Status Pill */}
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: '100px',
                  backgroundColor: activeSource.bgLight,
                  color: activeSource.color,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: activeSource.color,
                  }}
                />
                100% In-Browser • Zero Lag
              </div>
            </div>
          </div>

          {/* COLUMN 3: TARGET OUTPUTS / SKILLS & ARTIFACTS (Right) */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              bottom: '16px',
              width: '230px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 3,
            }}
          >
            {targets.map((tgt) => {
              const isTargetActive = activeSource.targets.includes(tgt.id);

              return (
                <div
                  key={tgt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    backgroundColor: isTargetActive ? 'var(--bg-surface)' : 'rgba(255, 255, 255, 0.6)',
                    border: `1.5px solid ${isTargetActive ? tgt.color : 'var(--border-subtle)'}`,
                    boxShadow: isTargetActive
                      ? `0 2px 10px rgba(0,0,0,0.06), 0 0 0 1px ${tgt.color}20`
                      : 'none',
                    opacity: isTargetActive ? 1 : 0.45,
                    transform: isTargetActive ? 'translateX(-4px)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {/* Left Connection Pin Dot (Glows when active) */}
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: isTargetActive ? tgt.color : 'var(--border-subtle)',
                      boxShadow: isTargetActive ? `0 0 8px ${tgt.color}` : 'none',
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: isTargetActive ? 700 : 500,
                        color: isTargetActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {tgt.label}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isTargetActive ? `${tgt.color}15` : 'var(--bg-canvas)',
                      color: isTargetActive ? tgt.color : 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    {tgt.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM ACTIVE SIMULATION PREVIEW (Matching Screenshot 1)    */}
        {/* ============================================================ */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Live Code / Telemetry Snippet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: activeSource.color,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 16px ${activeSource.color}60`,
                flexShrink: 0,
              }}
            >
              <Play size={16} fill="currentColor" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeSource.simulationPreview.title}
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {activeSource.simulationPreview.metrics}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          {onLaunchSoftware && (
            <button
              type="button"
              onClick={onLaunchSoftware}
              style={{
                padding: '8px 18px',
                borderRadius: '100px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.28)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Explore {activeSource.shortLabel} Lab</span>
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
