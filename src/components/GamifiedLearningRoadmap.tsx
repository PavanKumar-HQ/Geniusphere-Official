// ====================================================================
// Geniusphere — Stepped 3D Gamified Learning Roadmap & Interactive Lab
// Duolingo-style Isometric Path + Live Interactive Lab Simulation
// Zero UI/UX Friction: The Lab IS the Visualizer
// ====================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Check,
  Lock,
  Flame,
  BookOpen,
  ExternalLink,
  Gift,
  Award,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import {
  NeuralNetworkSvg,
  BlockchainChainLinkSvg,
  IotSensorDialSvg,
  SecurityPipelineSvg,
  CompoundGrowthSvg,
} from './LabSvgVisualizers';
import { MascotSphere } from './MascotSphere';

export interface GamifiedLearningRoadmapProps {
  onLaunchLab: (slug: string) => void;
  onLaunchCourse?: (slug: string) => void;
  onNavigateCatalogue?: () => void;
}

export type LearningTrackId = 'all' | 'ai' | 'security' | 'blockchain' | 'finance';

export interface PathNode {
  id: string;
  unit: number;
  stepNumber: number;
  title: string;
  subtitle: string;
  labSlug: string;
  labKey: 'ai' | 'blockchain' | 'iot' | 'security' | 'finance' | 'cie-audit';
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
  accentBg: string;
  status: 'completed' | 'active' | 'available' | 'locked' | 'chest' | 'trophy';
  xp: number;
  xOffsetPercent: number; // For smooth snake/winding curvature
  mascotTip?: string;
}

export const GamifiedLearningRoadmap: React.FC<GamifiedLearningRoadmapProps> = ({
  onLaunchLab,
  onLaunchCourse,
  onNavigateCatalogue,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<LearningTrackId>('all');
  const [activeNodeId, setActiveNodeId] = useState<string>('node-1');
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(['node-1']);
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [predictionHypothesis, setPredictionHypothesis] = useState<string | null>(null);

  // Animated circuit tick for connector glow
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // -------------------------------------------------------------
  // Live Interactive Lab States (Zero UI/UX friction: Lab IS the visualizer!)
  // -------------------------------------------------------------
  // AI Classifier state
  const [aiKeywordDensity, setAiKeywordDensity] = useState<number>(35);
  const [aiUrgency, setAiUrgency] = useState<number>(65);
  const [aiReputation, setAiReputation] = useState<number>(75);
  const aiScore = Math.round(aiKeywordDensity * 0.45 + aiUrgency * 0.4 - (100 - aiReputation) * 0.15);
  const aiConfidence = Math.max(10, Math.min(99, aiScore));
  const aiLabel: 'Phishing' | 'Suspicious' | 'Legitimate' =
    aiConfidence >= 70 ? 'Phishing' : aiConfidence >= 45 ? 'Suspicious' : 'Legitimate';

  // Blockchain Miner state
  const [blockNonce, setBlockNonce] = useState<number>(142);
  const [blockData] = useState<string>('Tx: Aarav -> DPTS 10 GEN');
  const [blockHash, setBlockHash] = useState<string>('00a4b73f8e12c9d8e7a6b5c4d3e2f1a0');
  const [isMining, setIsMining] = useState<boolean>(false);
  const [isTampered, setIsTampered] = useState<boolean>(false);

  const calculateHash = async (data: string, nonce: number) => {
    const text = `${data}-${nonce}`;
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleMineBlock = async () => {
    setIsMining(true);
    let n = blockNonce;
    for (let i = 0; i < 30; i++) {
      n += 1;
      const h = await calculateHash(blockData, n);
      if (h.startsWith('00') || i === 29) {
        setBlockNonce(n);
        setBlockHash(h);
        setIsMining(false);
        setIsTampered(false);
        break;
      }
    }
  };

  // IoT Telemetry state
  const [iotTemperature, setIotTemperature] = useState<number>(34);
  const iotThreshold = 38;

  // Security Pipeline state
  const [secPayloadType, setSecPayloadType] = useState<'legit' | 'sql_injection' | 'xss'>('legit');
  const [secStrictCsp, setSecStrictCsp] = useState<boolean>(true);

  // FinTech Compounding state
  const finPrincipal = 5000;
  const finMonthly = 200;
  const finRate = 8;

  // -------------------------------------------------------------
  // Path Milestones (Duolingo snake path + Isometric 3D tech nodes)
  // -------------------------------------------------------------
  const nodes: PathNode[] = useMemo(
    () => [
      {
        id: 'node-1',
        unit: 1,
        stepNumber: 1,
        title: 'Neural Classifier Lab',
        subtitle: 'Weight Matrix & Spam Detection',
        labSlug: 'ai-classification-playground',
        labKey: 'ai',
        icon: Brain,
        color: '#2563EB',
        accentBg: 'rgba(37, 99, 235, 0.12)',
        status: activeNodeId === 'node-1' ? 'active' : completedNodeIds.includes('node-1') ? 'completed' : 'available',
        xp: 25,
        xOffsetPercent: 50,
        mascotTip: 'Adjust Keyword Density and Urgency sliders to observe how neural decision boundaries adapt!',
      },
      {
        id: 'node-2',
        unit: 1,
        stepNumber: 2,
        title: 'Cryptographic Hash Lab',
        subtitle: 'SHA-256 Mining & Block Tamper Proof',
        labSlug: 'blockchain-block-builder',
        labKey: 'blockchain',
        icon: Lock,
        color: '#D97706',
        accentBg: 'rgba(217, 119, 6, 0.12)',
        status: activeNodeId === 'node-2' ? 'active' : completedNodeIds.includes('node-2') ? 'completed' : 'available',
        xp: 35,
        xOffsetPercent: 32,
        mascotTip: 'Click "Mine Block" to compute leading zeros or simulate tamper to break the downstream chain.',
      },
      {
        id: 'node-3',
        unit: 1,
        stepNumber: 3,
        title: 'CIE Evidence Checkpoint',
        subtitle: 'Cambridge Rubric Criterion 4.2 Audit',
        labSlug: 'cie-rubric-evidence-lab',
        labKey: 'cie-audit',
        icon: Gift,
        color: '#10B981',
        accentBg: 'rgba(16, 185, 129, 0.14)',
        status: 'chest',
        xp: 50,
        xOffsetPercent: 68,
        mascotTip: 'Treasure unlocked! Cambridge CIE criteria verifies your client-side proof.',
      },
      {
        id: 'node-4',
        unit: 1,
        stepNumber: 4,
        title: 'IoT Sensor Telemetry',
        subtitle: 'Relay Logic & Threshold Triggers',
        labSlug: 'mqtt-iot-telemetry',
        labKey: 'iot',
        icon: Wifi,
        color: '#059669',
        accentBg: 'rgba(5, 150, 105, 0.12)',
        status: activeNodeId === 'node-4' ? 'active' : 'available',
        xp: 30,
        xOffsetPercent: 50,
        mascotTip: 'Slide temperature above 38°C to engage the automatic cooling relay!',
      },
      {
        id: 'node-5',
        unit: 1,
        stepNumber: 5,
        title: 'Cyber Defense Shield',
        subtitle: 'Firewall & SQL Injection Defense',
        labSlug: 'web-defense-pipeline',
        labKey: 'security',
        icon: ShieldCheck,
        color: '#DC2626',
        accentBg: 'rgba(220, 38, 38, 0.12)',
        status: activeNodeId === 'node-5' ? 'active' : 'available',
        xp: 40,
        xOffsetPercent: 34,
        mascotTip: 'Test an SQL injection payload and verify how parameterized queries stop it cold.',
      },
      {
        id: 'node-6',
        unit: 1,
        stepNumber: 6,
        title: 'Unit 1 Mastery Trophy',
        subtitle: 'Comprehensive Capstone Milestone',
        labSlug: 'unit1-mastery-capstone',
        labKey: 'finance',
        icon: Award,
        color: '#F59E0B',
        accentBg: 'rgba(245, 158, 11, 0.15)',
        status: 'trophy',
        xp: 100,
        xOffsetPercent: 65,
        mascotTip: 'Final Capstone! Verify 5 completed evidence proofs to earn your certificate.',
      },
    ],
    [activeNodeId, completedNodeIds]
  );

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  const handleSelectNode = (node: PathNode) => {
    setActiveNodeId(node.id);
    if (!completedNodeIds.includes(node.id)) {
      setCompletedNodeIds((prev) => [...prev, node.id]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
      }}
    >
      {/* ============================================================ */}
      {/* TOP HEADER: UNIT 1 BANNER & HABIT STATS                      */}
      {/* ============================================================ */}
      <div
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: '#FFFFFF',
          padding: '22px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.25rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            1
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9, fontWeight: 800 }}>
              UNIT 1 • INTELLIGENT SYSTEMS & CRYPTOGRAPHY
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              Master Neural Weights, SHA-256 Mining & Sensor Logic
            </div>
          </div>
        </div>

        {/* Goal Selector & Syllabus Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Flame size={15} color="#FBBF24" />
            <span>Daily Goal: 15 min/day</span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onLaunchCourse) onLaunchCourse('artificial-intelligence-applied');
              else if (onNavigateCatalogue) onNavigateCatalogue();
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '100px',
              backgroundColor: '#FFFFFF',
              color: 'var(--brand-primary)',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <BookOpen size={15} />
            <span>Syllabus Guide</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN WORKSPACE: LEFT ROADMAP | RIGHT LIVE LAB     */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 420px) minmax(420px, 1fr)',
          backgroundColor: 'var(--bg-canvas)',
        }}
        className="gamified-path-grid"
      >
        {/* ============================================================ */}
        {/* LEFT COLUMN: STEPPED 3D ISOMETRIC LEARNING PATH              */}
        {/* ============================================================ */}
        <div
          style={{
            padding: '28px 24px',
            backgroundColor: 'var(--bg-canvas)',
            borderRight: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Track Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              backgroundColor: 'var(--bg-surface)',
              padding: '4px',
              borderRadius: '100px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              width: 'fit-content',
              margin: '0 auto',
            }}
          >
            {[
              { id: 'all', label: 'All Units' },
              { id: 'ai', label: 'AI' },
              { id: 'blockchain', label: 'Web3' },
              { id: 'iot', label: 'IoT' },
              { id: 'security', label: 'Security' },
            ].map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setSelectedTrack(track.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '100px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: selectedTrack === track.id ? 'var(--brand-primary)' : 'transparent',
                  color: selectedTrack === track.id ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {track.label}
              </button>
            ))}
          </div>

          {/* DEDICATED MASCOT COMPANION CARD (Zero clipping, always clean) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '12px 16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <MascotSphere pose="happy" size={42} animated={true} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Coach Sphere
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35, fontWeight: 500 }}>
                {activeNode.mascotTip || 'Click any step to activate its interactive mission and observe real-time outcomes.'}
              </p>
            </div>
          </div>

          {/* ROADMAP NODES CONTAINER */}
          <div
            style={{
              position: 'relative',
              padding: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            {/* Smooth SVG Connecting Circuit Line */}
            <svg
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '520px',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <defs>
                <linearGradient id="roadmap-path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#244C3A" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2563EB" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 90 20 Q 30 110, 30 135 T 150 235 T 90 335 T 30 435 T 90 510"
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 90 20 Q 30 110, 30 135 T 150 235 T 90 335 T 30 435 T 90 510"
                fill="none"
                stroke="url(#roadmap-path-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 6"
                strokeDashoffset={-pulseTick * 2}
              />
            </svg>

            {/* Stepped Nodes */}
            {nodes.map((node, index) => {
              const isSelected = activeNode.id === node.id;
              const isCompleted = completedNodeIds.includes(node.id);
              const NodeIcon = node.icon;
              const xShift = (node.xOffsetPercent - 50) * 1.5;

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'relative',
                    zIndex: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transform: `translateX(${xShift}px)`,
                    transition: 'transform 0.25s ease',
                  }}
                >
                  {/* START BADGE on first node */}
                  {index === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#FFFFFF',
                        fontSize: '0.66rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        zIndex: 10,
                      }}
                    >
                      START
                    </div>
                  )}

                  {/* 3D Isometric Tactile Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectNode(node)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: node.status === 'trophy' ? '18px' : '50%',
                      backgroundColor: isSelected ? node.color : isCompleted ? 'var(--brand-primary)' : 'var(--bg-surface)',
                      color: isSelected || isCompleted ? '#FFFFFF' : 'var(--text-primary)',
                      border: isSelected ? '3px solid #FFFFFF' : '2px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected
                        ? `0 6px 0 ${node.color}99, 0 10px 18px rgba(0, 0, 0, 0.16)`
                        : isCompleted
                        ? `0 6px 0 #1b382b, 0 8px 14px rgba(0, 0, 0, 0.1)`
                        : `0 5px 0 var(--border-subtle), 0 6px 12px rgba(0, 0, 0, 0.05)`,
                      transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                      transition: 'all 0.15s ease',
                    }}
                    title={`${node.title} — ${node.subtitle}`}
                  >
                    {isCompleted && !isSelected ? <Check size={26} strokeWidth={2.5} /> : <NodeIcon size={24} />}
                  </button>

                  {/* Clean Node Label Card */}
                  <div
                    style={{
                      marginTop: '8px',
                      textAlign: 'center',
                      maxWidth: '160px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                        lineHeight: 1.25,
                      }}
                    >
                      {node.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      +{node.xp} XP • {node.status === 'completed' ? 'Verified' : 'Interactive'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: ACTIVE MISSION & INTERACTIVE SIMULATION STUDIO */}
        {/* ============================================================ */}
        <div
          style={{
            padding: '28px 32px',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Active Lab Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    backgroundColor: activeNode.accentBg,
                    color: activeNode.color,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '100px',
                    border: `1px solid ${activeNode.color}40`,
                  }}
                >
                  LIVE LAB SIMULATOR
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  100% In-Browser • Zero Cloud Lag
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {activeNode.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {activeNode.subtitle}
              </p>
            </div>

            {/* Launch Full Workspace CTA Button */}
            <button
              type="button"
              onClick={() => onLaunchLab(activeNode.labSlug)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(36, 76, 58, 0.25)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Terminal size={16} />
              <span>Launch Full Lab</span>
              <ExternalLink size={14} />
            </button>
          </div>

          {/* "THINK LIKE A DEVELOPER" PREDICTION CHALLENGE */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-primary)' }}>
                Think Like a Developer • Hypothesis Check
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {activeNode.labKey === 'ai' && 'Prediction: How does high keyword density affect the classifier when urgency is also elevated?'}
              {activeNode.labKey === 'blockchain' && 'Prediction: If you alter transaction data in Block 1, what happens to Block 2’s cryptographic link?'}
              {activeNode.labKey === 'iot' && 'Prediction: When sensor temperature exceeds 38°C, which emergency relay engages?'}
              {activeNode.labKey === 'security' && 'Prediction: Why do parameterized queries prevent SQL injection payloads from executing?'}
              {(activeNode.labKey === 'finance' || activeNode.labKey === 'cie-audit') && 'Prediction: How does compounding frequency accelerate long-term capital formation?'}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Safe Threshold', 'Borderline Risk', 'Critical Alert'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPredictionHypothesis(opt)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: predictionHypothesis === opt ? 'var(--brand-primary)' : 'var(--bg-surface)',
                    color: predictionHypothesis === opt ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
              {predictionHypothesis && (
                <span style={{ fontSize: '0.76rem', color: 'var(--brand-primary)', fontWeight: 700, alignSelf: 'center', marginLeft: '6px' }}>
                  ✓ Hypothesis logged! Test the controls below to verify.
                </span>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* EMBEDDED LIVE LAB VISUALIZER & CONTROLS                     */}
          {/* ============================================================ */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '16px',
              border: '1.5px solid var(--border-subtle)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Mode 1: AI Neural Network Lab */}
            {activeNode.labKey === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <NeuralNetworkSvg
                  keywordDensity={aiKeywordDensity}
                  urgencyScore={aiUrgency}
                  senderReputation={aiReputation}
                  predictedLabel={aiLabel}
                  confidenceScore={aiConfidence}
                />

                {/* Real-Time Outcome Status Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: aiLabel === 'Phishing' ? '#FEF2F2' : aiLabel === 'Suspicious' ? '#FFFBEB' : '#F0FDF4',
                    border: `1px solid ${aiLabel === 'Phishing' ? '#FECACA' : aiLabel === 'Suspicious' ? '#FDE68A' : '#BBF7D0'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color={aiLabel === 'Phishing' ? '#DC2626' : aiLabel === 'Suspicious' ? '#D97706' : '#16A34A'} />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: aiLabel === 'Phishing' ? '#991B1B' : aiLabel === 'Suspicious' ? '#92400E' : '#166534' }}>
                      Model Verdict: {aiLabel.toUpperCase()} ({aiConfidence}% Confidence)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Weight Threshold Check Passed
                  </span>
                </div>

                {/* Interactive Sliders */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                  }}
                >
                  <div style={{ backgroundColor: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Keyword Density</span>
                      <span style={{ color: 'var(--brand-primary)' }}>{aiKeywordDensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={aiKeywordDensity}
                      onChange={(e) => setAiKeywordDensity(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
                    />
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Urgency Score</span>
                      <span style={{ color: '#D97706' }}>{aiUrgency}/100</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={aiUrgency}
                      onChange={(e) => setAiUrgency(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#D97706' }}
                    />
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Sender Reputation</span>
                      <span style={{ color: '#2563EB' }}>{aiReputation}/100</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={aiReputation}
                      onChange={(e) => setAiReputation(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#2563EB' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Blockchain SHA-256 Mining Lab */}
            {activeNode.labKey === 'blockchain' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <BlockchainChainLinkSvg
                  isValid={blockHash.startsWith('00') && !isTampered}
                  prevHashPreview={blockHash.slice(0, 16)}
                />

                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payload: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{blockData}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Hash: <code style={{ color: blockHash.startsWith('00') ? 'var(--brand-primary)' : '#DC2626' }}>{blockHash.slice(0, 24)}...</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleMineBlock}
                      disabled={isMining}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isMining ? 'Mining Nonce...' : 'Mine Nonce'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTampered(!isTampered)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: isTampered ? '#DC2626' : 'var(--bg-canvas)',
                        color: isTampered ? '#FFFFFF' : 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isTampered ? 'Tamper Active!' : 'Simulate Tamper'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: IoT Sensor Telemetry Lab */}
            {activeNode.labKey === 'iot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <IotSensorDialSvg
                  currentTemp={iotTemperature}
                  threshold={iotThreshold}
                  humidity={58}
                />

                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span>Ambient Sensor Temperature</span>
                    <span style={{ color: iotTemperature > iotThreshold ? '#DC2626' : 'var(--brand-primary)' }}>
                      {iotTemperature}°C {iotTemperature > iotThreshold ? '(RELAY TRIPPED)' : '(NORMAL)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    value={iotTemperature}
                    onChange={(e) => setIotTemperature(Number(e.target.value))}
                    style={{ width: '100%', accentColor: iotTemperature > iotThreshold ? '#DC2626' : 'var(--brand-primary)' }}
                  />
                </div>
              </div>
            )}

            {/* Mode 4: Cyber Defense Shield Lab */}
            {activeNode.labKey === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SecurityPipelineSvg
                  paramQueries={true}
                  outputEncoding={true}
                  strictCsp={secStrictCsp}
                />

                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Input Vector: </span>
                    <strong style={{ color: secPayloadType === 'legit' ? 'var(--brand-primary)' : '#DC2626' }}>
                      {secPayloadType === 'legit' ? "username='alice'" : "username='admin' OR 1=1;--"}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setSecPayloadType(secPayloadType === 'legit' ? 'sql_injection' : 'legit')}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: secPayloadType === 'legit' ? 'var(--bg-canvas)' : '#DC2626',
                        color: secPayloadType === 'legit' ? 'var(--text-primary)' : '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {secPayloadType === 'legit' ? 'Inject SQL Payload' : 'Reset Clean Input'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSecStrictCsp(!secStrictCsp)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-canvas)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      CSP: {secStrictCsp ? 'STRICT' : 'PERMISSIVE'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 5: FinTech Compound Growth Lab */}
            {(activeNode.labKey === 'finance' || activeNode.labKey === 'cie-audit') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <CompoundGrowthSvg
                  principal={finPrincipal}
                  monthly={finMonthly}
                  rate={finRate}
                  years={10}
                  currencySymbol="$"
                />

                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>10-Year Verified Horizon</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      ${Math.round(finPrincipal * Math.pow(1 + finRate / 100, 10) + finMonthly * 120 * 1.45).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLaunchLab('fintech-compound-lab')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                  >
                    Open Investment Studio
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* DAILY QUESTS & CAMBRIDGE CIE RUBRIC STRIP                    */}
          {/* ============================================================ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginTop: 'auto',
            }}
          >
            {/* Daily Quest Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Daily Learning Quest
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D97706' }}>+50 XP</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--brand-primary)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Complete 1 Lab Parameter Test
                </span>
              </div>
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', borderRadius: '100px', backgroundColor: 'var(--border-subtle)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
              </div>
            </div>

            {/* Cambridge CIE Competence Rubric Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  PESU CIE Alignment
                </span>
                <span className="badge badge-brand" style={{ fontSize: '0.64rem', padding: '1px 6px' }}>RUBRIC 4.2</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--brand-primary)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Cryptographic Evidence Proof
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Client-side hash chained into tamper-evident audit record.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
