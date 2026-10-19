import React, { useState, useMemo, useEffect } from 'react';
import {
  Brain,
  Lock,
  Wifi,
  ShieldCheck,
  Server,
  Terminal,
  TrendingUp,
  DollarSign,
  Building,
  Coins,
  BarChart3,
  Globe2,
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  Compass,
  Award,
  Database,
  Play,
  RotateCcw,
  Zap,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Flame,
  Check,
} from 'lucide-react';
import { Course, CourseModule, Lesson, CourseEnrollment } from '../types';
import { InMemoryDatabase } from '../db/in-memory-db';
import { backendEngine } from '../backend/RealtimeOrchestrator';

export interface CourseSubmoduleLabStudioProps {
  course: Course;
  currentLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
  db: InMemoryDatabase;
  currentUserId: string;
  enrollment: CourseEnrollment;
  onCompleteSubmoduleLab?: (lessonId: string, xp: number) => void;
  onClose?: () => void;
}

type SimulationEngineType =
  | 'ai'
  | 'blockchain'
  | 'iot'
  | 'security'
  | 'cloud'
  | 'fullstack'
  | 'stock'
  | 'compound'
  | 'banking'
  | 'crypto'
  | 'valuation'
  | 'economics'
  | 'communication'
  | 'leadership'
  | 'productivity'
  | 'strategy'
  | 'brand'
  | 'data';

export const CourseSubmoduleLabStudio: React.FC<CourseSubmoduleLabStudioProps> = ({
  course,
  currentLessonId,
  onSelectLesson,
  db,
  currentUserId,
  enrollment,
  onCompleteSubmoduleLab,
  onClose,
}) => {
  // Flatten all lessons across all modules
  const allSubmodules: Lesson[] = useMemo(() => {
    const list: Lesson[] = [];
    course.modules.forEach((mod) => {
      mod.lessons.forEach((les) => {
        list.push(les);
      });
    });
    return list;
  }, [course]);

  // Selected sub-module id
  const [activeSubmoduleId, setActiveSubmoduleId] = useState<string>(
    currentLessonId || (allSubmodules[0]?.id ?? '')
  );

  useEffect(() => {
    if (currentLessonId && currentLessonId !== activeSubmoduleId) {
      setActiveSubmoduleId(currentLessonId);
    }
  }, [currentLessonId]);

  const activeIndex = allSubmodules.findIndex((s) => s.id === activeSubmoduleId);
  const activeSubmodule = allSubmodules[activeIndex] || allSubmodules[0];

  // Hypothesis selection state
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [hasRunExperiment, setHasRunExperiment] = useState(false);
  const [completedSubmoduleIds, setCompletedSubmoduleIds] = useState<string[]>(() => {
    return enrollment.completed_lessons || [];
  });
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  // -------------------------------------------------------------
  // SIMULATION STATE VARIABLES FOR ALL 18 DOMAINS
  // -------------------------------------------------------------
  // 1. AI Perceptron state
  const [aiKeywordDensity, setAiKeywordDensity] = useState(35);
  const [aiUrgencyScore, setAiUrgencyScore] = useState(65);
  const [aiSenderReputation, setAiSenderReputation] = useState(75);

  // 2. Blockchain SHA-256 state
  const [bcNonce, setBcNonce] = useState(4281);
  const [bcBlockData, setBcBlockData] = useState('TX: Alice -> Bob 2.5 BTC');
  const [bcIsTampered, setBcIsTampered] = useState(false);

  // 3. IoT Telemetry state
  const [iotTemp, setIotTemp] = useState(34);
  const [iotVibration, setIotVibration] = useState(2.1);
  const [iotRelayActive, setIotRelayActive] = useState(false);

  // 4. Cyber Defense state
  const [secPayload, setSecPayload] = useState<'legit' | 'sqli' | 'xss'>('legit');
  const [secWafEnabled, setSecWafEnabled] = useState(true);

  // 5. Cloud Microservices state
  const [cloudReplicas, setCloudReplicas] = useState(3);
  const [cloudTrafficRps, setCloudTrafficRps] = useState(450);

  // 6. Fullstack API state
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT'>('GET');
  const [apiCached, setApiCached] = useState(true);

  // 7. Stock Market state
  const [stockVol, setStockVol] = useState(45);
  const [stockSentiment, setStockSentiment] = useState(68);

  // 8. Compound Wealth state
  const [compPrincipal, setCompPrincipal] = useState(5000);
  const [compMonthly, setCompMonthly] = useState(250);
  const [compRate, setCompRate] = useState(8);

  // 9. Banking Clearing state
  const [bankClearMethod, setBankClearMethod] = useState<'ACH' | 'FedNow' | 'Wire'>('FedNow');
  const [bankRiskThreshold, setBankRiskThreshold] = useState(85);

  // 10. Web3 Crypto state
  const [cryptoPoolBalanceA, setCryptoPoolBalanceA] = useState(100);
  const [cryptoPoolBalanceB, setCryptoPoolBalanceB] = useState(250000);

  // 11. Valuation DCF state
  const [dcfWacc, setDcfWacc] = useState(9.5);
  const [dcfGrowthRate, setDcfGrowthRate] = useState(14);

  // 12. Global Economics state
  const [econTariff, setEconTariff] = useState(10);
  const [econInterestRate, setEconInterestRate] = useState(4.5);

  // 13. Negotiation state
  const [negBatna, setNegBatna] = useState(72);
  const [negListeningScore, setNegListeningScore] = useState(84);

  // 14. Leadership Sprint state
  const [leadPsychSafety, setLeadPsychSafety] = useState(88);
  const [leadSprintCapacity, setLeadSprintCapacity] = useState(40);

  // 15. Productivity Flow state
  const [prodFocusBlock, setProdFocusBlock] = useState(50);
  const [prodDistractionRate, setProdDistractionRate] = useState(15);

  // 16. Strategy Moat state
  const [stratSwitchingCosts, setStratSwitchingCosts] = useState(78);
  const [stratNetworkEffects, setStratNetworkEffects] = useState(85);

  // 17. Brand Narrative state
  const [brandAudienceAlignment, setBrandAudienceAlignment] = useState(82);
  const [brandClarityIndex, setBrandClarityIndex] = useState(90);

  // 18. Big Data & SQL state
  const [dataIndexEnabled, setDataIndexEnabled] = useState(true);
  const [dataRowCount, setDataRowCount] = useState(250000);

  // Determine which engine to use based on course domain and slug
  const engineType: SimulationEngineType = useMemo(() => {
    const slug = course.slug.toLowerCase();
    const domain = course.domain.toLowerCase();

    if (slug.includes('ai') || slug.includes('artificial-intelligence') || slug.includes('machine-learning')) return 'ai';
    if (slug.includes('blockchain') || slug.includes('web3')) return 'blockchain';
    if (slug.includes('iot') || slug.includes('smart-systems')) return 'iot';
    if (slug.includes('privacy') || slug.includes('security') || slug.includes('cybersecurity')) return 'security';
    if (slug.includes('cloud') || slug.includes('devops')) return 'cloud';
    if (slug.includes('fullstack') || slug.includes('web-development')) return 'fullstack';
    if (slug.includes('data') || slug.includes('analytics')) return 'data';

    if (slug.includes('stock') || slug.includes('trading') || slug.includes('market')) return 'stock';
    if (slug.includes('fintech') || slug.includes('financial-systems')) return 'banking';
    if (slug.includes('compound') || slug.includes('wealth') || slug.includes('finance-fundamentals')) return 'compound';
    if (slug.includes('banking') || slug.includes('accounts')) return 'banking';
    if (slug.includes('crypto') || slug.includes('tokenomics')) return 'crypto';
    if (slug.includes('valuation') || slug.includes('corporate-finance')) return 'valuation';
    if (slug.includes('economics') || slug.includes('global')) return 'economics';

    if (slug.includes('comm') || slug.includes('negotiation')) return 'communication';
    if (slug.includes('leadership') || slug.includes('agile')) return 'leadership';
    if (slug.includes('productivity') || slug.includes('deep-work')) return 'productivity';
    if (slug.includes('strategy') || slug.includes('strategic')) return 'strategy';
    if (slug.includes('brand') || slug.includes('executive')) return 'brand';

    if (domain === 'technology') return 'ai';
    if (domain === 'finance') return 'stock';
    return 'leadership';
  }, [course]);

  // Derived simulation outputs
  const aiPhishingScore = Math.min(
    99,
    Math.max(1, Math.round((aiKeywordDensity * 0.45 + aiUrgencyScore * 0.45 + (100 - aiSenderReputation) * 0.3) * 0.9))
  );
  const aiConfidence = Math.max(72, 100 - Math.abs(aiPhishingScore - 50));
  const aiVerdict = aiPhishingScore > 65 ? 'PHISHING ALERT' : aiPhishingScore > 40 ? 'SUSPICIOUS' : 'LEGITIMATE';

  const bcHashPreview = useMemo(() => {
    if (bcIsTampered) {
      return '7a8f90... [CHAIN BROKEN - INVALID PREV HASH]';
    }
    return `0000a3f9c2d1b84e7... [Nonce: ${bcNonce}]`;
  }, [bcNonce, bcIsTampered]);

  const iotCoolingOn = iotTemp > 38 || iotRelayActive;

  // Handle completing current submodule lab
  const handleVerifySubmodule = () => {
    const xpReward = 50;
    if (!completedSubmoduleIds.includes(activeSubmodule.id)) {
      setCompletedSubmoduleIds((prev) => [...prev, activeSubmodule.id]);
    }
    setHasRunExperiment(true);

    // Award XP and complete lesson in DB
    db.awardXp(currentUserId, xpReward, `Interactive Lab: ${activeSubmodule.title}`);
    db.completeLesson(currentUserId, course.id, activeSubmodule.id);

    // Trigger realtime notification
    backendEngine.notifications.dispatch(
      currentUserId,
      `🔬 Sub-Module Lab Verified! (+${xpReward} XP)`,
      `Successfully completed simulation benchmark for ${activeSubmodule.title}. Advanced daily streak!`,
      'high',
      'grade',
      'course-detail',
      course.slug,
      'Next Lab'
    );

    setCelebrationToast(`✓ Lab Passed! +${xpReward} XP awarded & streak advanced!`);
    setTimeout(() => setCelebrationToast(null), 4000);

    if (onCompleteSubmoduleLab) {
      onCompleteSubmoduleLab(activeSubmodule.id, xpReward);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        backgroundColor: 'var(--bg-canvas, #F7F6F0)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-subtle, #D6DED2)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
      }}
    >
      {/* Celebration Toast */}
      {celebrationToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#244C3A',
            color: '#FFFFFF',
            padding: '14px 24px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(36, 76, 58, 0.35)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          <Sparkles size={18} color="#A9C86A" />
          <span>{celebrationToast}</span>
        </div>
      )}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '16px',
          borderBottom: '1.5px solid var(--border-subtle, #D6DED2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(36, 76, 58, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary, #244C3A)',
            }}
          >
            <Brain size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--brand-primary, #244C3A)',
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                }}
              >
                SUB-MODULE LAB BENCH
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {completedSubmoduleIds.length} of {allSubmodules.length} Labs Completed
              </span>
            </div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '4px 0 0',
              }}
            >
              {course.title} — Interactive Sub-Module Laboratory
            </h2>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ height: '36px', fontSize: '0.8rem' }}
          >
            Exit Lab Studio
          </button>
        )}
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH: GAMIFIED SNAKE PATH ON LEFT, INTERACTIVE LAB ON RIGHT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 300px) 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ============================================================== */}
        {/* LEFT COLUMN: THE WINDING GAMIFIED SNAKE ROADMAP OF SUBMODULES  */}
        {/* ============================================================== */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #FFFFFF)',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle, #D6DED2)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            maxHeight: '780px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            Course Milestones
          </div>

          {/* SVG Dotted Curved Spine Connector */}
          <svg
            style={{
              position: 'absolute',
              top: '70px',
              left: 0,
              width: '100%',
              height: `${allSubmodules.length * 105}px`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {allSubmodules.map((_, i) => {
              if (i === allSubmodules.length - 1) return null;
              const y1 = 45 + i * 105;
              const y2 = 45 + (i + 1) * 105;
              const x1 = i % 2 === 0 ? 95 : 195;
              const x2 = (i + 1) % 2 === 0 ? 95 : 195;
              const cx1 = x1;
              const cy1 = y1 + 50;
              const cx2 = x2;
              const cy2 = y2 - 50;
              const isPast = completedSubmoduleIds.includes(allSubmodules[i].id);

              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={isPast ? '#43A85B' : '#D6DED2'}
                  strokeWidth="3.5"
                  strokeDasharray={isPast ? 'none' : '6 6'}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Submodule milestone nodes along the snake path */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              width: '100%',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {allSubmodules.map((lesson, idx) => {
              const isCurrent = lesson.id === activeSubmoduleId;
              const isDone = completedSubmoduleIds.includes(lesson.id);
              const xPos = idx % 2 === 0 ? 'flex-start' : 'flex-end';

              return (
                <div
                  key={lesson.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                    width: '100%',
                    padding: idx % 2 === 0 ? '0 0 0 16px' : '0 16px 0 0',
                  }}
                >
                  {/* START pill indicator on first node */}
                  {idx === 0 && (
                    <div
                      style={{
                        padding: '2px 8px',
                        borderRadius: '100px',
                        backgroundColor: '#43A85B',
                        color: '#FFFFFF',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        marginBottom: '4px',
                        alignSelf: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                        marginLeft: idx % 2 === 0 ? '12px' : 0,
                        marginRight: idx % 2 !== 0 ? '12px' : 0,
                      }}
                    >
                      START
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubmoduleId(lesson.id);
                      onSelectLesson(lesson.id);
                    }}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent
                        ? '#244C3A'
                        : isDone
                        ? '#E5F0DF'
                        : '#FFFFFF',
                      border: isCurrent
                        ? '3px solid #00F5A0'
                        : isDone
                        ? '2.5px solid #43A85B'
                        : '2px solid #D6DED2',
                      boxShadow: isCurrent
                        ? '0 0 16px rgba(0,245,160,0.5), 0 4px 12px rgba(36,76,58,0.2)'
                        : '0 2px 6px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCurrent ? '#FFFFFF' : isDone ? '#43A85B' : '#6B786E',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                    title={`Module ${idx + 1}: ${lesson.title}`}
                  >
                    {isDone ? (
                      <Check size={26} strokeWidth={3} />
                    ) : (
                      <span style={{ fontSize: '1rem', fontWeight: 900 }}>
                        {idx + 1}
                      </span>
                    )}

                    {/* Active pulse ring */}
                    {isCurrent && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -6,
                          left: -6,
                          right: -6,
                          bottom: -6,
                          borderRadius: '50%',
                          border: '2px solid #00F5A0',
                          opacity: 0.6,
                          animation: 'pulse-cyan 1.5s infinite',
                        }}
                      />
                    )}
                  </button>

                  {/* Submodule Label and XP pill */}
                  <div
                    style={{
                      textAlign: idx % 2 === 0 ? 'left' : 'right',
                      marginTop: '8px',
                      maxWidth: '170px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: isCurrent ? 800 : 700,
                        color: isCurrent
                          ? '#244C3A'
                          : isDone
                          ? '#43A85B'
                          : 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {lesson.title.replace(/^Video \d+:\s*/, '')}
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                      }}
                    >
                      <Zap size={11} color="#D97706" />
                      <span>+{40 + (idx % 3) * 10} XP • Interactive</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: DEDICATED INTERACTIVE SIMULATOR WORKBENCH        */}
        {/* ============================================================== */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface, #FFFFFF)',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle, #D6DED2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          {/* Submodule Active Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-subtle, #D6DED2)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(36, 76, 58, 0.1)',
                    color: '#244C3A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '100px',
                  }}
                >
                  MODULE {activeIndex + 1} SIMULATION
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Interactive Validation Lab
                </span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {activeSubmodule.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {activeSubmodule.summary}
              </p>
            </div>

            <button
              type="button"
              onClick={handleVerifySubmodule}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: completedSubmoduleIds.includes(activeSubmodule.id)
                  ? '#43A85B'
                  : 'var(--brand-primary, #244C3A)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(36, 76, 58, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                {completedSubmoduleIds.includes(activeSubmodule.id)
                  ? 'Completed (+50 XP)'
                  : 'Verify & Claim +50 XP'}
              </span>
            </button>
          </div>

          {/* THINK LIKE A DEVELOPER • HYPOTHESIS CHECK */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas, #F7F6F0)',
              border: '1.5px solid var(--border-subtle, #D6DED2)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="var(--brand-primary, #244C3A)" />
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--brand-primary, #244C3A)',
                }}
              >
                Think Like a Developer • Hypothesis Check
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {engineType === 'ai' && 'Prediction: How does high keyword density affect classifier weights when urgency score is elevated?'}
              {engineType === 'blockchain' && 'Prediction: If transaction bytes in Block 1 are altered, how does the avalanche effect break Block 2’s link?'}
              {engineType === 'iot' && 'Prediction: When sensor temperature exceeds 38°C, which emergency relay engages to prevent core thermal throttle?'}
              {engineType === 'security' && 'Prediction: Why do parameterized queries prevent SQL injection payloads from hijacking the database parser?'}
              {engineType === 'stock' && 'Prediction: How does sudden high market volatility impact bid/ask order book depth and execution slippage?'}
              {engineType === 'compound' && 'Prediction: How does compounding frequency combined with steady monthly SIP accelerate long-term capital formation?'}
              {engineType === 'banking' && 'Prediction: Why does real-time settlement require instant fraud verification before ledger write consensus?'}
              {engineType === 'cloud' && 'Prediction: When container traffic surges past 400 RPS, how do auto-scaling replica pods rebalance latency?'}
              {(engineType === 'communication' || engineType === 'leadership' || engineType === 'productivity' || engineType === 'strategy' || engineType === 'brand' || engineType === 'valuation' || engineType === 'economics' || engineType === 'crypto' || engineType === 'fullstack' || engineType === 'data') &&
                'Prediction: What parameter threshold marks the critical inflection point in this system model?'}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Safe Threshold', 'Borderline Risk', 'Critical Alert'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setHypothesis(opt)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle, #D6DED2)',
                    backgroundColor: hypothesis === opt ? 'var(--brand-primary, #244C3A)' : '#FFFFFF',
                    color: hypothesis === opt ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
              {hypothesis && (
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--brand-primary, #244C3A)',
                    fontWeight: 700,
                    alignSelf: 'center',
                    marginLeft: '6px',
                  }}
                >
                  ✓ Hypothesis logged! Adjust the live controls below to verify.
                </span>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* LIVE SIMULATION VISUALIZER & CONTROLS                         */}
          {/* ============================================================ */}
          <div
            style={{
              backgroundColor: 'var(--bg-canvas, #F7F6F0)',
              borderRadius: '16px',
              border: '1.5px solid var(--border-subtle, #D6DED2)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Visualizer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#43A85B',
                    boxShadow: '0 0 8px #43A85B',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {engineType === 'ai' && 'NEURAL WEIGHTS & ACTIVATION FLOW'}
                  {engineType === 'blockchain' && 'CRYPTOGRAPHIC MERKLE BLOCK PROOF'}
                  {engineType === 'iot' && 'TELEMETRY SENSOR MATRIX & RELAY'}
                  {engineType === 'security' && 'WAF PACKET INSPECTOR & THREAT FILTER'}
                  {engineType === 'stock' && 'ORDER BOOK DEPTH & VOLATILITY MATRIX'}
                  {engineType === 'compound' && 'COMPOUND ACCUMULATION DYNAMICS'}
                  {engineType === 'cloud' && 'SERVICE MESH & REPLICA HEALTH'}
                  {(engineType === 'banking' || engineType === 'crypto' || engineType === 'valuation' || engineType === 'economics' || engineType === 'communication' || engineType === 'leadership' || engineType === 'productivity' || engineType === 'strategy' || engineType === 'brand' || engineType === 'data' || engineType === 'fullstack') &&
                    'SYSTEM TELEMETRY & DECISION FLOW'}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(67, 168, 91, 0.12)',
                  color: '#26352A',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Model Confidence: {aiConfidence}%
              </div>
            </div>

            {/* DYNAMIC SVG ENGINE RENDERING */}
            {engineType === 'ai' && (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox="0 0 620 220"
                  style={{
                    width: '100%',
                    maxHeight: '260px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle, #D6DED2)',
                  }}
                >
                  {/* Neural Links with animated flowing pulses */}
                  <g stroke="#E8EDE4" strokeWidth="1.5">
                    {/* Layer 1 -> Hidden */}
                    <line x1="120" y1="50" x2="280" y2="40" stroke="#43A85B" strokeOpacity="0.4" strokeWidth={aiKeywordDensity / 30} />
                    <line x1="120" y1="50" x2="280" y2="85" stroke="#43A85B" strokeOpacity="0.3" strokeWidth={aiKeywordDensity / 40} />
                    <line x1="120" y1="50" x2="280" y2="130" stroke="#43A85B" strokeOpacity="0.2" />
                    <line x1="120" y1="50" x2="280" y2="175" stroke="#43A85B" strokeOpacity="0.2" />

                    <line x1="120" y1="110" x2="280" y2="40" stroke="#D97706" strokeOpacity="0.3" />
                    <line x1="120" y1="110" x2="280" y2="85" stroke="#D97706" strokeOpacity="0.5" strokeWidth={aiUrgencyScore / 25} />
                    <line x1="120" y1="110" x2="280" y2="130" stroke="#D97706" strokeOpacity="0.4" />
                    <line x1="120" y1="110" x2="280" y2="175" stroke="#D97706" strokeOpacity="0.3" />

                    <line x1="120" y1="170" x2="280" y2="40" stroke="#2563EB" strokeOpacity="0.2" />
                    <line x1="120" y1="170" x2="280" y2="85" stroke="#2563EB" strokeOpacity="0.3" />
                    <line x1="120" y1="170" x2="280" y2="130" stroke="#2563EB" strokeOpacity="0.5" strokeWidth={aiSenderReputation / 30} />
                    <line x1="120" y1="170" x2="280" y2="175" stroke="#2563EB" strokeOpacity="0.4" />

                    {/* Hidden -> Output */}
                    <line x1="280" y1="40" x2="480" y2="70" stroke="#DC2626" strokeOpacity={aiPhishingScore > 50 ? 0.8 : 0.2} strokeWidth={aiPhishingScore > 50 ? 3 : 1} />
                    <line x1="280" y1="85" x2="480" y2="70" stroke="#DC2626" strokeOpacity={aiPhishingScore > 50 ? 0.7 : 0.2} />
                    <line x1="280" y1="130" x2="480" y2="140" stroke="#43A85B" strokeOpacity={aiPhishingScore <= 50 ? 0.8 : 0.2} strokeWidth={aiPhishingScore <= 50 ? 3 : 1} />
                    <line x1="280" y1="175" x2="480" y2="140" stroke="#43A85B" strokeOpacity={aiPhishingScore <= 50 ? 0.7 : 0.2} />
                  </g>

                  {/* Flowing animated pulse dots along main active lines */}
                  <circle cx="200" cy="45" r="3" fill="#43A85B">
                    <animate attributeName="cx" from="120" to="280" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="cy" from="50" to="40" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="98" r="3" fill="#D97706">
                    <animate attributeName="cx" from="120" to="280" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="cy" from="110" to="85" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="380" cy="105" r="3.5" fill={aiPhishingScore > 50 ? '#DC2626' : '#43A85B'}>
                    <animate attributeName="cx" from="280" to="480" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="cy" from="85" to={aiPhishingScore > 50 ? '70' : '140'} dur="1.2s" repeatCount="indefinite" />
                  </circle>

                  {/* Input Nodes */}
                  <g>
                    {/* Node 1: KW Density */}
                    <circle cx="120" cy="50" r="14" fill="#FFFFFF" stroke="#43A85B" strokeWidth="3" />
                    <text x="120" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#43A85B">x1</text>
                    <text x="35" y="54" fontSize="11" fontWeight="bold" fill="#252C27">KW Density</text>

                    {/* Node 2: Urgency */}
                    <circle cx="120" cy="110" r="14" fill="#FFFFFF" stroke="#D97706" strokeWidth="3" />
                    <text x="120" y="114" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#D97706">x2</text>
                    <text x="30" y="114" fontSize="11" fontWeight="bold" fill="#252C27">Urgency Score</text>

                    {/* Node 3: Domain Rep */}
                    <circle cx="120" cy="170" r="14" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
                    <text x="120" y="174" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2563EB">x3</text>
                    <text x="35" y="174" fontSize="11" fontWeight="bold" fill="#252C27">Domain Rep</text>
                  </g>

                  {/* Hidden Layer Nodes */}
                  <g>
                    {[40, 85, 130, 175].map((y, i) => (
                      <g key={i}>
                        <circle cx="280" cy={y} r="10" fill="#FFFFFF" stroke="#43A85B" strokeWidth="2.5" />
                        <circle cx="280" cy={y} r="4" fill="#43A85B" />
                      </g>
                    ))}
                  </g>

                  {/* Output Nodes */}
                  <g>
                    {/* Phishing */}
                    <circle
                      cx="480"
                      cy="70"
                      r="16"
                      fill={aiPhishingScore > 50 ? '#DC2626' : '#FFFFFF'}
                      stroke="#DC2626"
                      strokeWidth="3"
                    />
                    <text x="480" y="74" textAnchor="middle" fontSize="11" fontWeight="900" fill={aiPhishingScore > 50 ? '#FFFFFF' : '#DC2626'}>
                      P
                    </text>
                    <text x="506" y="74" fontSize="11" fontWeight="bold" fill={aiPhishingScore > 50 ? '#DC2626' : '#6B786E'}>
                      PHISHING
                    </text>

                    {/* Legitimate */}
                    <circle
                      cx="480"
                      cy="140"
                      r="16"
                      fill={aiPhishingScore <= 50 ? '#43A85B' : '#FFFFFF'}
                      stroke="#43A85B"
                      strokeWidth="3"
                    />
                    <text x="480" y="144" textAnchor="middle" fontSize="11" fontWeight="900" fill={aiPhishingScore <= 50 ? '#FFFFFF' : '#43A85B'}>
                      L
                    </text>
                    <text x="506" y="144" fontSize="11" fontWeight="bold" fill={aiPhishingScore <= 50 ? '#43A85B' : '#6B786E'}>
                      LEGITIMATE
                    </text>
                  </g>
                </svg>
              </div>
            )}

            {engineType === 'blockchain' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle, #D6DED2)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F7F6F0', border: '1px solid #D6DED2' }}>
                    <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>BLOCK #1048</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#252C27' }}>Nonce: {bcNonce}</div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#43A85B', wordBreak: 'break-all' }}>
                      Hash: {bcHashPreview}
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F7F6F0', border: '1px solid #D6DED2' }}>
                    <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>BLOCK #1049</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#252C27' }}>Status: {bcIsTampered ? '❌ INVALIDATED' : '✓ VALID CHAIN'}</div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: bcIsTampered ? '#DC2626' : '#2563EB' }}>
                      PrevHash: {bcIsTampered ? 'MISMATCH_DETECTED' : '0000a3f9c2d1b84e7...'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {engineType === 'iot' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle, #D6DED2)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>CORE TEMPERATURE</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: iotTemp > 38 ? '#DC2626' : '#43A85B' }}>
                    {iotTemp}°C
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6B786E' }}>Threshold: 38°C</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>VIBRATION FREQUENCY</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#252C27' }}>
                    {iotVibration} kHz
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6B786E' }}>Normal Range</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>EMERGENCY COOLING RELAY</div>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: iotCoolingOn ? '#43A85B' : '#6B786E',
                      marginTop: '4px',
                    }}
                  >
                    {iotCoolingOn ? '⚡ ENGAGED (ACTIVE)' : 'STANDBY'}
                  </div>
                </div>
              </div>
            )}

            {engineType === 'security' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle, #D6DED2)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#252C27' }}>
                    WAF Packet Filter & SQLi Quarantine
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: secPayload === 'legit' ? '#E5F0DF' : '#FEE2E2',
                      color: secPayload === 'legit' ? '#26352A' : '#991B1B',
                    }}
                  >
                    {secPayload === 'legit' ? 'CLEAN PAYLOAD' : 'MALICIOUS ATTACK BLOCKED'}
                  </span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#252C27', backgroundColor: '#F7F6F0', padding: '10px', borderRadius: '6px' }}>
                  {secPayload === 'legit' && 'GET /api/v1/students?grade=10 HTTP/1.1 -> 200 OK'}
                  {secPayload === 'sqli' && "SELECT * FROM users WHERE user_id = '' OR '1'='1' -- BLOCKED BY WAF"}
                  {secPayload === 'xss' && '<script>alert(document.cookie)</script> -- SANITIZED BY CSP HEADER'}
                </div>
              </div>
            )}

            {engineType === 'stock' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle, #D6DED2)',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700, marginBottom: '4px' }}>
                    ORDER BOOK BIDS (BUY)
                  </div>
                  <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#43A85B', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>100 shares @ $148.50</div>
                    <div>250 shares @ $148.45</div>
                    <div>500 shares @ $148.30</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700, marginBottom: '4px' }}>
                    ORDER BOOK ASKS (SELL)
                  </div>
                  <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#DC2626', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>150 shares @ $148.55</div>
                    <div>300 shares @ $148.60</div>
                    <div>650 shares @ $148.75</div>
                  </div>
                </div>
              </div>
            )}

            {engineType === 'compound' && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle, #D6DED2)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>INITIAL CAPITAL</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#252C27' }}>
                    ${compPrincipal.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>10-YEAR PROJECTION</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#43A85B' }}>
                    ${Math.round(compPrincipal * Math.pow(1 + compRate / 100, 10) + compMonthly * 12 * 10 * 1.4).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#6B786E', fontWeight: 700 }}>20-YEAR PROJECTION</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#244C3A' }}>
                    ${Math.round(compPrincipal * Math.pow(1 + compRate / 100, 20) + compMonthly * 12 * 20 * 2.8).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Model Verdict Status Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: aiPhishingScore > 50 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(67, 168, 91, 0.08)',
                border: `1px solid ${aiPhishingScore > 50 ? '#FECACA' : '#C8E3BF'}`,
                borderRadius: '10px',
                padding: '10px 16px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color={aiPhishingScore > 50 ? '#DC2626' : '#43A85B'} />
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: aiPhishingScore > 50 ? '#991B1B' : '#26352A',
                  }}
                >
                  Model Verdict: {aiVerdict} ({aiPhishingScore}% Risk Score)
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#6B786E', fontWeight: 700 }}>
                Weight Threshold Check Passed • Zero Drift
              </span>
            </div>

            {/* INTERACTIVE CONTROLS & SLIDERS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                paddingTop: '6px',
              }}
            >
              {engineType === 'ai' && (
                <>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Keyword Density</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#43A85B' }}>{aiKeywordDensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiKeywordDensity}
                      onChange={(e) => setAiKeywordDensity(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#43A85B' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Urgency Score</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706' }}>{aiUrgencyScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiUrgencyScore}
                      onChange={(e) => setAiUrgencyScore(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#D97706' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Sender Reputation</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#2563EB' }}>{aiSenderReputation}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiSenderReputation}
                      onChange={(e) => setAiSenderReputation(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#2563EB' }}
                    />
                  </div>
                </>
              )}

              {engineType === 'blockchain' && (
                <>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Mine Block Nonce</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setBcNonce((prev) => prev + 17)}
                      style={{ width: '100%', height: '36px', marginTop: '4px', fontSize: '0.78rem' }}
                    >
                      Increment Nonce (+17)
                    </button>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Simulate Chain Tamper</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setBcIsTampered((prev) => !prev)}
                      style={{
                        width: '100%',
                        height: '36px',
                        marginTop: '4px',
                        fontSize: '0.78rem',
                        backgroundColor: bcIsTampered ? '#FEE2E2' : undefined,
                        color: bcIsTampered ? '#991B1B' : undefined,
                      }}
                    >
                      {bcIsTampered ? 'Restore Valid Chain' : 'Alter Block #1048 TX'}
                    </button>
                  </div>
                </>
              )}

              {engineType === 'iot' && (
                <>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Sensor Temperature</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: iotTemp > 38 ? '#DC2626' : '#43A85B' }}>{iotTemp}°C</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="55"
                      value={iotTemp}
                      onChange={(e) => setIotTemp(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#43A85B' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Manual Relay Override</span>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIotRelayActive((prev) => !prev)}
                      style={{ width: '100%', height: '36px', marginTop: '4px', fontSize: '0.78rem' }}
                    >
                      {iotRelayActive ? 'Disengage Manual Relay' : 'Force Emergency Cooling'}
                    </button>
                  </div>
                </>
              )}

              {engineType === 'security' && (
                <>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Attack Payload</span>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      {(['legit', 'sqli', 'xss'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSecPayload(p)}
                          style={{
                            flex: 1,
                            padding: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #D6DED2',
                            backgroundColor: secPayload === p ? '#244C3A' : '#FFFFFF',
                            color: secPayload === p ? '#FFFFFF' : '#252C27',
                            cursor: 'pointer',
                          }}
                        >
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {engineType === 'compound' && (
                <>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Monthly SIP Deposit</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#244C3A' }}>${compMonthly}/mo</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1500"
                      step="50"
                      value={compMonthly}
                      onChange={(e) => setCompMonthly(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#244C3A' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#252C27' }}>Annual Yield Return</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#43A85B' }}>{compRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="16"
                      value={compRate}
                      onChange={(e) => setCompRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#43A85B' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
