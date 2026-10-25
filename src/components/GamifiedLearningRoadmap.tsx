// ====================================================================
// Geniusphere — Horizontal Gamified Learning Roadmap & Interactive Lab
// Horizontal Stepped Milestone Path + Live In-Browser Parameter Controls
// Responsive on Desktop & Mobile (Touch-Swipeable Horizontal Track)
// ====================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Brain,
  Wifi,
  ShieldCheck,
  Check,
  Lock,
  Flame,
  BookOpen,
  ExternalLink,
  Gift,
  Award,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MascotSphere } from './MascotSphere';

export interface GamifiedLearningRoadmapProps {
  onLaunchLab: (slug: string) => void;
  onLaunchCourse?: (slug: string) => void;
  onNavigateCatalogue?: () => void;
}

export type LearningTrackId = 'all' | 'ai' | 'security' | 'blockchain' | 'finance';

interface PathNode {
  id: string;
  unit: number;
  stepNumber: number;
  title: string;
  subtitle: string;
  labSlug: string;
  labKey: 'ai' | 'blockchain' | 'iot' | 'security' | 'cie-audit' | 'finance';
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
  accentBg: string;
  status: 'completed' | 'active' | 'available' | 'locked' | 'chest' | 'trophy';
  xp: number;
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

  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Animated circuit tick for connector glow
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // -------------------------------------------------------------
  // Path Milestones (Horizontal Progression Nodes)
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
        mascotTip: 'Click "Mine Block" to compute leading zeros or simulate tamper to break the downstream chain.',
      },
      {
        id: 'node-3',
        unit: 1,
        stepNumber: 3,
        title: 'IoT Sensor Telemetry',
        subtitle: 'Relay Logic & Threshold Triggers',
        labSlug: 'iot-sensor-simulator',
        labKey: 'iot',
        icon: Wifi,
        color: '#059669',
        accentBg: 'rgba(5, 150, 105, 0.12)',
        status: activeNodeId === 'node-3' ? 'active' : completedNodeIds.includes('node-3') ? 'completed' : 'available',
        xp: 30,
        mascotTip: 'Slide temperature above 38°C to engage the automatic cooling relay!',
      },
      {
        id: 'node-4',
        unit: 1,
        stepNumber: 4,
        title: 'Cyber Defense Shield',
        subtitle: 'Firewall & SQL Injection Defense',
        labSlug: 'defensive-web-security-lab',
        labKey: 'security',
        icon: ShieldCheck,
        color: '#DC2626',
        accentBg: 'rgba(220, 38, 38, 0.12)',
        status: activeNodeId === 'node-4' ? 'active' : completedNodeIds.includes('node-4') ? 'completed' : 'available',
        xp: 40,
        mascotTip: 'Test an SQL injection payload and verify how parameterized queries stop it cold.',
      },
      {
        id: 'node-5',
        unit: 1,
        stepNumber: 5,
        title: 'Digital Privacy Decision',
        subtitle: 'Permissions & Data Footprint Audit',
        labSlug: 'digital-privacy-decision-lab',
        labKey: 'cie-audit',
        icon: Gift,
        color: '#10B981',
        accentBg: 'rgba(16, 185, 129, 0.14)',
        status: activeNodeId === 'node-5' ? 'active' : completedNodeIds.includes('node-5') ? 'completed' : 'chest',
        xp: 50,
        mascotTip: 'Audit third-party trackers and permissions to reduce exposure below 25%!',
      },
      {
        id: 'node-6',
        unit: 1,
        stepNumber: 6,
        title: 'Compound Growth Engine',
        subtitle: '50/30/20 Budget & Interest Modeling',
        labSlug: 'compound-interest-calculator',
        labKey: 'finance',
        icon: Award,
        color: '#F59E0B',
        accentBg: 'rgba(245, 158, 11, 0.15)',
        status: activeNodeId === 'node-6' ? 'active' : completedNodeIds.includes('node-6') ? 'completed' : 'trophy',
        xp: 100,
        mascotTip: 'Final Capstone! Verify compound interest growth across multi-year horizons.',
      },
    ],
    [activeNodeId, completedNodeIds]
  );

  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];
  const activeIndex = nodes.findIndex((n) => n.id === activeNodeId);

  const handleSelectNode = (node: PathNode) => {
    setActiveNodeId(node.id);
    if (!completedNodeIds.includes(node.id)) {
      setCompletedNodeIds((prev) => [...prev, node.id]);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollTrackRef.current) {
      const scrollAmount = 240;
      scrollTrackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
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
      {/* 1. TOP HEADER: UNIT 1 BANNER & HABIT STATS                   */}
      {/* ============================================================ */}
      <div
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: '#FFFFFF',
          padding: '20px 24px',
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
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              flexShrink: 0,
            }}
          >
            1
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9, fontWeight: 800 }}>
              UNIT 1 • INTELLIGENT SYSTEMS & CRYPTOGRAPHY
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Master Neural Weights, SHA-256 Mining & Sensor Logic
            </div>
          </div>
        </div>

        {/* Goal Selector & Syllabus Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
              if (onLaunchCourse) onLaunchCourse('artificial-intelligence-ai');
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
      {/* 2. SUB-BAR: TRACK FILTERS & COACH SPHERE COMPANION           */}
      {/* ============================================================ */}
      <div
        style={{
          padding: '14px 24px',
          backgroundColor: 'var(--bg-canvas)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
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
            overflowX: 'auto',
            maxWidth: '100%',
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
                whiteSpace: 'nowrap',
              }}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Coach Sphere Compact Advice Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '100px',
            padding: '5px 14px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
          }}
        >
          <MascotSphere pose="happy" size={26} animated={true} />
          <span style={{ fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
            Coach:
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeNode.mascotTip || 'Select any milestone to test interactive mission parameters.'}
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. HORIZONTAL ROADMAP TRACK (Desktop & Mobile Optimized)     */}
      {/* ============================================================ */}
      <div
        style={{
          position: 'relative',
          padding: '24px 20px',
          backgroundColor: 'var(--bg-canvas)',
          borderBottom: '1.5px solid var(--border-subtle)',
        }}
      >
        {/* Header Label & Scroll Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '0 4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)' }}>
              Interactive Milestone Track
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              (Step {activeIndex + 1} of {nodes.length})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="hidden sm:inline" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: '4px' }}>
              Swipe or use arrows
            </span>
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Track Container */}
        <div
          ref={scrollTrackRef}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '12px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {/* Animated Dotted Learning Path behind nodes (Landscape Layout) */}
          <svg
            style={{
              position: 'absolute',
              top: '58px',
              left: '85px',
              width: `${(nodes.length - 1) * 194}px`,
              height: '8px',
              zIndex: 1,
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <defs>
              <linearGradient id="roadmap-dotted-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#43A85B" />
                <stop offset="35%" stopColor="#2563EB" />
                <stop offset="70%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Inactive base dotted path */}
            <line
              x1="0"
              y1="4"
              x2="100%"
              y2="4"
              stroke="var(--border-subtle, #CBD5E1)"
              strokeWidth="4"
              strokeDasharray="6 7"
              strokeLinecap="round"
            />

            {/* Active completed / animated pulsed dotted path */}
            <line
              x1="0"
              y1="4"
              x2={`${(activeIndex / Math.max(1, nodes.length - 1)) * 100}%`}
              y2="4"
              stroke="url(#roadmap-dotted-gradient)"
              strokeWidth="4.5"
              strokeDasharray="7 7"
              strokeDashoffset={-pulseTick * 2}
              strokeLinecap="round"
              style={{ transition: 'x2 0.35s ease' }}
            />
          </svg>

          {/* Node Items */}
          {nodes.map((node, index) => {
            const isSelected = activeNode.id === node.id;
            const isCompleted = completedNodeIds.includes(node.id);
            const NodeIcon = node.icon;

            return (
              <div
                key={node.id}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '160px',
                  maxWidth: '180px',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectNode(node)}
              >
                {/* Step / Start Badge */}
                <div
                  style={{
                    backgroundColor: index === 0 ? 'var(--brand-primary)' : isSelected ? node.color : 'var(--bg-surface)',
                    color: index === 0 || isSelected ? '#FFFFFF' : 'var(--text-muted)',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {index === 0 ? 'START' : `STEP ${node.stepNumber}`}
                </div>

                {/* 3D Tactile Node Circle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectNode(node);
                  }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: node.status === 'trophy' ? '18px' : '50%',
                    backgroundColor: isSelected ? node.color : isCompleted ? 'var(--brand-primary)' : 'var(--bg-surface)',
                    color: isSelected || isCompleted ? '#FFFFFF' : 'var(--text-primary)',
                    border: isSelected ? '3px solid #FFFFFF' : '2px solid var(--border-subtle)',
                    boxShadow: isSelected
                      ? `0 0 0 4px ${node.color}50, 0 6px 16px rgba(0, 0, 0, 0.2)`
                      : '0 4px 10px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <NodeIcon size={26} color={isSelected || isCompleted ? '#FFFFFF' : node.color} />

                  {/* Completed Checkmark Corner Pill */}
                  {isCompleted && !isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </button>

                {/* Node Card Below Button */}
                <div
                  style={{
                    marginTop: '10px',
                    textAlign: 'center',
                    backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                    border: isSelected ? `1.5px solid ${node.color}40` : '1.5px solid transparent',
                    borderRadius: '12px',
                    padding: '6px 10px',
                    boxShadow: isSelected ? '0 3px 10px rgba(0, 0, 0, 0.05)' : 'none',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: isSelected ? node.color : 'var(--text-primary)',
                      lineHeight: 1.25,
                      marginBottom: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {node.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#D97706' }}>+{node.xp} XP</span>
                    <span>•</span>
                    <span>{isSelected ? 'Active' : isCompleted ? 'Done' : 'Open'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. ACTIVE MILESTONE BAR (Clean, Friction-Free)               */}
      {/* ============================================================ */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px', flex: 1 }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: activeNode.accentBg,
              color: activeNode.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <activeNode.icon size={22} color={activeNode.color} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {activeNode.title}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  backgroundColor: activeNode.accentBg,
                  color: activeNode.color,
                }}
              >
                Step {activeNode.stepNumber}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 800 }}>
                +{activeNode.xp} XP
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {activeNode.subtitle}
            </div>
          </div>
        </div>

        {/* Launch Full Lab Action Button */}
        <button
          type="button"
          onClick={() => onLaunchLab(activeNode.labSlug)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: 'var(--brand-primary)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.86rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(36, 76, 58, 0.25)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
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
          <span>Launch Lab</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};
