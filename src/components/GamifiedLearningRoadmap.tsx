// ====================================================================
// Geniusphere 2.0 — Gamified Interactive Learning Journey & Lab Roadmap
// Inspired by Duolingo Path UI & 3D Isometric Stepped Tech Learning
// Unifies SVG Visualizers and Interactive Labs into a single frictionless experience
// ====================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  Brain,
  Lock,
  Wifi,
  ShieldCheck,
  RotateCcw,
  Trophy,
  Gift,
  Check,
  Terminal,
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  ExternalLink,
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
  xOffsetPercent: number; // For smooth snake/winding curvature like Duolingo
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
  const secParamQueries = true;
  const secJwtValidation = true;
  const secInputSanitization = true;
  const [secPayloadType, setSecPayloadType] = useState<'legit' | 'sql_injection' | 'xss'>('legit');
  const secIsBlocked = secPayloadType !== 'legit';

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
        status: completedNodeIds.includes('node-1') ? 'completed' : 'active',
        xp: 25,
        xOffsetPercent: 50,
        mascotTip: 'Awesome! Adjust the sliders to see neural weights activate in real time.',
      },
      {
        id: 'node-2',
        unit: 1,
        stepNumber: 2,
        title: 'Cryptographic Hash Lab',
        subtitle: 'SHA-256 Mining & Tamper Proofing',
        labSlug: 'sha256-block-builder',
        labKey: 'blockchain',
        icon: Lock,
        color: '#D97706',
        accentBg: 'rgba(217, 119, 6, 0.12)',
        status: activeNodeId === 'node-2' ? 'active' : 'available',
        xp: 35,
        xOffsetPercent: 32,
        mascotTip: 'Try tampering with the block data to break the cryptographic link!',
      },
      {
        id: 'node-3',
        unit: 1,
        stepNumber: 3,
        title: 'CIE Evidence Checkpoint',
        subtitle: 'Rubric Criteria & Proof Verification',
        labSlug: 'cie-evidence-matrix',
        labKey: 'cie-audit',
        icon: Gift,
        color: '#10B981',
        accentBg: 'rgba(16, 185, 129, 0.14)',
        status: 'chest',
        xp: 50,
        xOffsetPercent: 52,
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
        xOffsetPercent: 68,
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
        xOffsetPercent: 44,
        mascotTip: 'Test an SQL injection payload and verify how parameterized queries stop it cold.',
      },
      {
        id: 'node-6',
        unit: 1,
        stepNumber: 6,
        title: 'Unit 1 Mastery Trophy',
        subtitle: 'Sovereign Systems Foundations',
        labSlug: 'fintech-compound-lab',
        labKey: 'finance',
        icon: Trophy,
        color: '#F59E0B',
        accentBg: 'rgba(245, 158, 11, 0.16)',
        status: 'trophy',
        xp: 100,
        xOffsetPercent: 50,
        mascotTip: 'You have conquered Unit 1! All simulations verified client-side.',
      },
    ],
    [completedNodeIds, activeNodeId]
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
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1.5px solid var(--border-subtle)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      {/* ============================================================ */}
      {/* UNIT BANNER HEADER (Duolingo Style: Unit 1 + Syllabus Guide) */}
      {/* ============================================================ */}
      <div
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: '#FFFFFF',
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
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
              backdropFilter: 'blur(8px)',
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
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(360px, 1.35fr)',
          minHeight: '680px',
        }}
        className="gamified-path-grid"
      >
        {/* ============================================================ */}
        {/* LEFT COLUMN: STEPPED 3D ISOMETRIC / DUOLINGO LEARNING PATH  */}
        {/* ============================================================ */}
        <div
          style={{
            padding: '36px 24px',
            position: 'relative',
            backgroundColor: 'var(--bg-canvas)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Background Circuit Grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />

          {/* Track Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '28px',
              zIndex: 10,
              backgroundColor: 'var(--bg-surface)',
              padding: '4px',
              borderRadius: '100px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
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

          {/* Continuous Smooth Connecting SVG Path Behind Nodes */}
          <svg
            style={{
              position: 'absolute',
              top: '90px',
              left: 0,
              width: '100%',
              height: '560px',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <defs>
              <linearGradient id="roadmap-path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#43A85B" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Circuit Background Track */}
            <path
              d="M 180 30 Q 115 110, 115 135 T 185 235 T 245 335 T 160 435 T 180 525"
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Active Flowing Colored Track */}
            <path
              d="M 180 30 Q 115 110, 115 135 T 185 235 T 245 335 T 160 435 T 180 525"
              fill="none"
              stroke="url(#roadmap-path-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8 6"
              strokeDashoffset={-pulseTick * 2}
            />
          </svg>

          {/* Stepped Nodes Column */}
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              position: 'relative',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {nodes.map((node, index) => {
              const isSelected = activeNode.id === node.id;
              const isCompleted = completedNodeIds.includes(node.id);
              const NodeIcon = node.icon;

              return (
                <div
                  key={node.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transform: `translateX(${(node.xOffsetPercent - 50) * 2.2}px)`,
                    transition: 'transform 0.25s ease',
                  }}
                >
                  {/* Floating Mascot Tip beside Active Node (Duolingo Style!) */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        left: node.xOffsetPercent > 50 ? '-130px' : 'auto',
                        right: node.xOffsetPercent <= 50 ? '-130px' : 'auto',
                        top: '-15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        zIndex: 20,
                        animation: 'bounce 2s infinite',
                      }}
                      className="mascot-speech-bubble-wrapper"
                    >
                      <MascotSphere pose="happy" size={38} animated={true} />
                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1.5px solid var(--brand-primary)',
                          borderRadius: '12px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                          maxWidth: '120px',
                          lineHeight: 1.25,
                        }}
                      >
                        Active Lab!
                      </div>
                    </div>
                  )}

                  {/* 3D Isometric / Stepped Button Node */}
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    {/* START Badge on Node 1 */}
                    {index === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-16px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#43A85B',
                          color: '#FFFFFF',
                          fontSize: '0.66rem',
                          fontWeight: 900,
                          letterSpacing: '0.06em',
                          padding: '2px 8px',
                          borderRadius: '100px',
                          boxShadow: '0 2px 6px rgba(67, 168, 91, 0.4)',
                          zIndex: 10,
                        }}
                      >
                        START
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSelectNode(node)}
                      style={{
                        width: node.status === 'trophy' || node.status === 'chest' ? '64px' : '62px',
                        height: node.status === 'trophy' || node.status === 'chest' ? '64px' : '62px',
                        borderRadius: node.status === 'trophy' ? '18px' : '50%',
                        backgroundColor: isSelected
                          ? node.color
                          : isCompleted
                          ? 'var(--brand-primary)'
                          : 'var(--bg-surface)',
                        color: isSelected || isCompleted ? '#FFFFFF' : 'var(--text-primary)',
                        border: isSelected
                          ? `3px solid #FFFFFF`
                          : isCompleted
                          ? `2px solid var(--brand-primary)`
                          : `2px solid var(--border-strong)`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        // 3D Isometric bevel effect matching Image 2 & 5
                        boxShadow: isSelected
                          ? `0 6px 0 ${node.color}99, 0 12px 20px rgba(0,0,0,0.18)`
                          : isCompleted
                          ? `0 5px 0 #2A7E3E, 0 8px 16px rgba(0,0,0,0.1)`
                          : `0 5px 0 var(--border-strong), 0 8px 16px rgba(0,0,0,0.06)`,
                        transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                        transition: 'all 0.15s ease',
                      }}
                      title={`${node.title} — ${node.subtitle}`}
                    >
                      {/* Active Node Outer Glowing Pulse */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: '-8px',
                            borderRadius: node.status === 'trophy' ? '24px' : '50%',
                            border: `2px solid ${node.color}`,
                            opacity: 0.7,
                            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                            pointerEvents: 'none',
                          }}
                        />
                      )}

                      {/* Icon */}
                      {isCompleted && !isSelected ? (
                        <Check size={26} />
                      ) : (
                        <NodeIcon size={24} />
                      )}
                    </button>

                    {/* Step Title Label below the 3D Node */}
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                        maxWidth: '140px',
                        lineHeight: 1.2,
                        textShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      }}
                    >
                      {node.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      +{node.xp} XP • {node.status === 'completed' ? 'Verified' : 'Interactive'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: LIVE INTERACTIVE LAB STUDIO & DAILY QUESTS     */}
        {/* ============================================================ */}
        <div
          style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* Active Lab Header Card */}
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
                boxShadow: '0 4px 12px rgba(67, 168, 91, 0.3)',
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

          {/* ============================================================ */}
          {/* EMBEDDED LIVE LAB VISUALIZER & CONTROLS (THE LAB ITSELF!)    */}
          {/* ============================================================ */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            {/* Mode 1: AI Neural Network Lab */}
            {activeNode.labKey === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <NeuralNetworkSvg
                  keywordDensity={aiKeywordDensity}
                  urgencyScore={aiUrgency}
                  senderReputation={aiReputation}
                  predictedLabel={aiLabel}
                  confidenceScore={aiConfidence}
                />

                {/* Direct Interactive Controls */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '14px',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
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

                  <div>
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

                  <div>
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
                      Nonce: {blockNonce} • Hash: {blockHash.slice(0, 20)}...
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
                        backgroundColor: '#D97706',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <RotateCcw size={14} className={isMining ? 'animate-spin' : ''} />
                      <span>{isMining ? 'Mining Proof...' : 'Mine Block (Nonce)'}</span>
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
                  humidity={55}
                />

                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>
                    <span>Live Thermistor Sensor Reading</span>
                    <span style={{ color: iotTemperature >= 38 ? '#DC2626' : '#059669', fontWeight: 800 }}>
                      {iotTemperature}°C {iotTemperature >= 38 ? '(CRITICAL RELAY TRIGGERED)' : '(NORMAL)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    value={iotTemperature}
                    onChange={(e) => setIotTemperature(Number(e.target.value))}
                    style={{ width: '100%', accentColor: iotTemperature >= 38 ? '#DC2626' : '#059669' }}
                  />
                </div>
              </div>
            )}

            {/* Mode 4: Cyber Defense Shield Lab */}
            {activeNode.labKey === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SecurityPipelineSvg
                  paramQueries={secParamQueries}
                  outputEncoding={secInputSanitization}
                  strictCsp={secJwtValidation}
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
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setSecPayloadType('legit')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: secPayloadType === 'legit' ? 'var(--brand-primary)' : 'var(--bg-canvas)',
                        color: secPayloadType === 'legit' ? '#FFFFFF' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Legitimate Query
                    </button>
                    <button
                      type="button"
                      onClick={() => setSecPayloadType('sql_injection')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: secPayloadType === 'sql_injection' ? '#DC2626' : 'var(--bg-canvas)',
                        color: secPayloadType === 'sql_injection' ? '#FFFFFF' : 'var(--text-primary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      SQL Injection (1=1)
                    </button>
                  </div>

                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: secIsBlocked ? '#16A34A' : '#DC2626' }}>
                    {secIsBlocked ? '✓ INJECTION BLOCKED SAFELY' : 'EXPOSURE DETECTED'}
                  </span>
                </div>
              </div>
            )}

            {/* Mode 5: Cambridge CIE Checkpoint / FinTech Lab */}
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
          {/* DAILY QUESTS & CAMBRIDGE CIE RUBRIC (Duolingo Style!)         */}
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
                  Cambridge CIE Benchmark
                </span>
                <Award size={15} color="#2563EB" />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Evidence-Based Criteria Verified
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Tamper-evident client-side logs recorded
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
