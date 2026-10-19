import React, { useState, useEffect, useMemo } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Activity,
  Eye,
} from 'lucide-react';

export interface ConceptSvgAnimationProps {
  type: string;
  title?: string;
  moduleId?: string;
  lessonId?: string;
  courseTitle?: string;
}

export type VisualizerStyle = 'holographic-hud' | 'botanical-blueprint';

export const ConceptSvgAnimation: React.FC<ConceptSvgAnimationProps> = ({
  type,
  title,
  courseTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(0);
  const [visualStyle, setVisualStyle] = useState<VisualizerStyle>('holographic-hud');

  // Animation step ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 1000);
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Detect which of the 18 courses is active based on courseTitle or type
  const activeCourseKey = useMemo(() => {
    const t = (courseTitle || '').toLowerCase() + ' ' + (type || '').toLowerCase();
    if (t.includes('artificial intelligence') || t.includes('ai') || type === 'neural_network' || type.includes('ai')) return 'ai';
    if (t.includes('blockchain') || type.includes('blockchain')) return 'blockchain';
    if (t.includes('microsoft') || t.includes('office') || type.includes('msoffice') || type.includes('office')) return 'msoffice';
    if (t.includes('cybersecurity') || t.includes('security') || type.includes('cyber') || type.includes('security')) return 'cybersecurity';
    if (t.includes('coding') || t.includes('programming') || type.includes('coding') || type.includes('logic_gates')) return 'coding';
    if (t.includes('iot') || t.includes('internet of things') || type.includes('iot')) return 'iot';
    if (t.includes('privacy') || t.includes('footprint') || type.includes('privacy')) return 'privacy';
    if (t.includes('introduction to finance') || t.includes('finance intro') || type.includes('finance')) return 'finance';
    if (t.includes('stock market') || t.includes('stock') || type.includes('stock')) return 'stock';
    if (t.includes('crypto') || type.includes('crypto')) return 'crypto';
    if (t.includes('fintech') || type.includes('fintech')) return 'fintech';
    if (t.includes('global economy') || t.includes('economy') || t.includes('global events') || type.includes('economy')) return 'economy';
    if (t.includes('banking') || t.includes('account types') || t.includes('institution') || type.includes('banking')) return 'banking';
    if (t.includes('communication') || type.includes('communication')) return 'communication';
    if (t.includes('time management') || t.includes('time') || type.includes('time')) return 'time';
    if (t.includes('soft skills') || t.includes('softskills') || type.includes('soft')) return 'softskills';
    if (t.includes('startup') || t.includes('ideation') || type.includes('startup')) return 'startup';
    if (t.includes('social profile') || t.includes('identity') || type.includes('social')) return 'social';
    return 'blockchain'; // default fallback
  }, [courseTitle, type]);

  // =========================================================================
  // INTERACTIVE STATE FOR THE 18 COURSES
  // =========================================================================

  // 1. AI: Attention Heads & Temperature
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiTokensGenerated, setAiTokensGenerated] = useState(24);
  const [aiSelectedHead, setAiSelectedHead] = useState<number>(1);
  const [isInferencing, setIsInferencing] = useState(false);

  // 2. Blockchain
  const [isHashVerified, setIsHashVerified] = useState(true);
  const [miningNonce, setMiningNonce] = useState(28410);
  const [isMining, setIsMining] = useState(false);

  // Auto-miner effect
  useEffect(() => {
    if (!isMining) return;
    const timer = setInterval(() => {
      setMiningNonce((prev) => {
        const next = prev + 1;
        if (next % 17 === 0) {
          setIsMining(false);
        }
        return next;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [isMining]);

  // 3. Microsoft Office
  const [formulaRecalcCount, setFormulaRecalcCount] = useState(1);
  const [selectedPivotDimension, setSelectedPivotDimension] = useState<'region' | 'quarter' | 'category'>('quarter');
  const [isCloudSynced, setIsCloudSynced] = useState(true);

  // 4. Cybersecurity Basics
  const [activeAttackType, setActiveAttackType] = useState<'none' | 'ddos' | 'sqli' | 'phishing'>('none');
  const [isShieldActive, setIsShieldActive] = useState(true);
  const [threatBlockedCount, setThreatBlockedCount] = useState(42);

  // 5. Coding Basics
  const [instructionPointer, setInstructionPointer] = useState(0);
  const [stackRegisterA, setStackRegisterA] = useState(14);
  const [conditionFlag, setConditionFlag] = useState(true);

  // 6. Internet of Things (IoT)
  const [sensorTemp, setSensorTemp] = useState(24.5);
  const [actuatorRelayOn, setActuatorRelayOn] = useState(true);
  const [mqttPacketsSent, setMqttPacketsSent] = useState(128);

  // 7. Digital Privacy and Footprints
  const [trackingBlockerEnabled, setTrackingBlockerEnabled] = useState(true);
  const [digitalFootprintScore, setDigitalFootprintScore] = useState(92);

  // 8. Introduction to Finance
  const [principal] = useState(10000);
  const [aprRate, setAprRate] = useState(8.5);
  const [compoundYears, setCompoundYears] = useState(5);

  // 9. Stock Market
  const [orderBookSpread] = useState(0.15);
  const [stockPrice, setStockPrice] = useState(142.8);
  const [marketVolatility, setMarketVolatility] = useState<'low' | 'medium' | 'high'>('medium');

  // 10. Cryptocurrency
  const [cryptoUtxoSent, setCryptoUtxoSent] = useState(false);
  const [enclaveLocked, setEnclaveLocked] = useState(true);
  const [gasFeePriority] = useState<'standard' | 'fast'>('fast');

  // 11. Fintech
  const [tokenizedPan, setTokenizedPan] = useState('tok_984a_2910');
  const [upiSettlementStatus, setUpiSettlementStatus] = useState<'IDLE' | 'ROUTING' | 'CLEARED'>('CLEARED');

  // 12. Global Economy
  const [interestRatePolicy, setInterestRatePolicy] = useState(4.25);
  const [tariffShockActive, setTariffShockActive] = useState(false);
  const [globalGdpGrowth] = useState(2.8);

  // 13. Banking and Account Types
  const [bankAccountType, setBankAccountType] = useState<'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT'>('SAVINGS');
  const [bankBalance, setBankBalance] = useState(15400);
  const [interestAccrued, setInterestAccrued] = useState(612);

  // 14. Communication Skills
  const [vocalTone, setVocalTone] = useState<'Empathetic' | 'Assertive' | 'Analytical'>('Empathetic');
  const [activeListeningFilter, setActiveListeningFilter] = useState(true);
  const [resonanceScore] = useState(88);

  // 15. Time Management
  const [pomodoroMinutes] = useState(25);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [activeQuadrant, setActiveQuadrant] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q2');

  // 16. Soft Skills
  const [deEscalationBuffer, setDeEscalationBuffer] = useState(true);
  const [eqRadarValue, setEqRadarValue] = useState(84);
  const [teamSynergyLevel] = useState('High Resonance');

  // 17. Startup Ideation
  const [businessModelStage, setBusinessModelStage] = useState<'Problem' | 'Solution' | 'Product-Market-Fit'>('Solution');
  const [cacLtvRatio] = useState('1 : 3.8');
  const [runwayMonths, setRunwayMonths] = useState(18);

  // 18. Social Profile Development
  const [keywordDensity, setKeywordDensity] = useState(82);
  const [profileReachMultiplier, setProfileReachMultiplier] = useState(3.4);
  const [thoughtLeadershipRank] = useState('Top 5% Voice');

  // Visual Theme Colors
  const isHud = visualStyle === 'holographic-hud';
  const themeBg = isHud ? '#040814' : '#FAFAF4';
  const themeCardBg = isHud ? '#081122' : '#FFFFFF';
  const themeWireframeStroke = isHud ? '#00F0FF' : '#43A85B';
  const themeXrayLaser = isHud ? '#FF3B30' : '#D97706';
  const themeTextPrimary = isHud ? '#E0F7FF' : '#26352A';
  const themeTextSecondary = isHud ? '#7AD4EB' : '#4A5B4F';

  // HUD scanline position
  const scanlineY = 40 + ((step * 5) % 240);

  return (
    <div
      style={{
        backgroundColor: themeCardBg,
        border: `1.5px solid ${isHud ? 'rgba(0, 240, 255, 0.35)' : 'var(--border-subtle)'}`,
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: isHud ? '0 8px 32px rgba(0, 240, 255, 0.12)' : 'var(--shadow-sm)',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Telemetry & Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: isHud ? 'rgba(0, 240, 255, 0.15)' : '#E5F0DF',
              color: isHud ? '#00F0FF' : '#43A85B',
              border: `1px solid ${isHud ? '#00F0FF' : '#C8E3BF'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isHud ? '#00F0FF' : '#43A85B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{isHud ? '⚡ HOLOGRAPHIC X-RAY HUD' : '🌱 BOTANICAL BLUEPRINT'}</span>
              <span>•</span>
              <span>{courseTitle || 'Geniusphere Simulation Engine'}</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: themeTextPrimary, fontFamily: 'var(--font-heading)', margin: '2px 0 0' }}>
              {title || `Interactive Simulation: ${activeCourseKey.toUpperCase()}`}
            </h4>
          </div>
        </div>

        {/* View Controls & Style Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Style Toggle */}
          <button
            type="button"
            onClick={() => setVisualStyle(isHud ? 'botanical-blueprint' : 'holographic-hud')}
            style={{
              height: '32px',
              padding: '0 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: `1px solid ${isHud ? '#00F0FF' : 'var(--border-subtle)'}`,
              backgroundColor: isHud ? 'rgba(0, 240, 255, 0.15)' : 'var(--bg-canvas)',
              color: isHud ? '#00F0FF' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Eye size={13} />
            <span>{isHud ? 'Style: Holographic X-Ray' : 'Style: Blueprint'}</span>
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              height: '32px',
              padding: '0 12px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setIsHashVerified(true);
              setAiTokensGenerated(24);
              setActiveAttackType('none');
              setIsShieldActive(true);
            }}
            style={{
              height: '32px',
              padding: '0 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.76rem',
            }}
            title="Reset Simulation State"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Main SVG Holographic Viewport */}
      <div
        style={{
          width: '100%',
          backgroundColor: themeBg,
          borderRadius: '12px',
          border: `1px solid ${isHud ? 'rgba(0, 240, 255, 0.25)' : 'var(--border-subtle)'}`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
          minHeight: '260px',
          boxShadow: isHud ? 'inset 0 0 40px rgba(0, 240, 255, 0.05)' : 'none',
        }}
      >
        {/* HUD Overlay Elements */}
        {isHud && (
          <>
            <div style={{ position: 'absolute', top: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#00F0FF', opacity: 0.85 }}>
              [HUD.SYS.ACT: 0x98F] • LAT: 44.18°N • ALT: 1420m • X-RAY: ACTIVE
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#38BDF8', opacity: 0.85 }}>
              DIAGNOSTIC CORE: {activeCourseKey.toUpperCase()} // SCAN SPEED: 120 FPS
            </div>
          </>
        )}

        {/* SVG ENGINE WITH DEF FILTERS FOR GLOW & CUTAWAYS */}
        <svg
          viewBox="0 0 680 280"
          style={{ width: '100%', height: 'auto', maxHeight: '280px', userSelect: 'none' }}
        >
          <defs>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <pattern id="hud-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isHud ? 'rgba(0, 240, 255, 0.08)' : 'rgba(38, 53, 42, 0.05)'} strokeWidth="0.8" />
            </pattern>

            <linearGradient id="glass-hull-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isHud ? '#00F0FF' : '#43A85B'} stopOpacity={isHud ? 0.22 : 0.12} />
              <stop offset="100%" stopColor={isHud ? '#005577' : '#183B2B'} stopOpacity={isHud ? 0.05 : 0.02} />
            </linearGradient>

            <linearGradient id="laser-scan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="680" height="280" fill="url(#hud-grid)" />

          {/* Laser Scanline Beam sweeping across viewport */}
          {isPlaying && (
            <line
              x1="0"
              y1={scanlineY}
              x2="680"
              y2={scanlineY}
              stroke="url(#laser-scan-grad)"
              strokeWidth="1.5"
            />
          )}

          {/* 1. ARTIFICIAL INTELLIGENCE (AI) */}
          {activeCourseKey === 'ai' && (
            <g>
              <polygon
                points="120,50 560,50 620,130 560,230 120,230 60,130"
                fill="url(#glass-hull-grad)"
                stroke={themeWireframeStroke}
                strokeWidth="2"
                filter={isHud ? 'url(#neon-glow)' : undefined}
              />
              {[100, 150, 200].map((y, idx) => (
                <g key={`head-${idx}`}>
                  <circle cx="160" cy={y} r="12" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
                  <circle cx="340" cy={y} r="14" fill={isHud ? '#FF9500' : '#43A85B'} />
                  <circle cx="520" cy={y} r="12" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
                  <line x1="172" y1={y} x2="326" y2={y} stroke={themeXrayLaser} strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="354" y1={y} x2="508" y2={y} stroke={themeXrayLaser} strokeWidth="2" />
                </g>
              ))}
              <line x1="160" y1="100" x2="340" y2="200" stroke={themeXrayLaser} strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="160" y1="200" x2="340" y2="100" stroke={themeXrayLaser} strokeWidth="1.5" strokeOpacity="0.7" />
              <rect x="270" y="85" width="140" height="26" rx="6" fill={isHud ? 'rgba(4, 8, 20, 0.85)' : '#FFFFFF'} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="340" y="102" fill={themeTextPrimary} fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                ATTENTION HEAD #{aiSelectedHead}
              </text>
              <text x="340" y="255" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Multi-Head Self-Attention Core • Temp: {aiTemperature} • Generated: {aiTokensGenerated} tokens
              </text>
            </g>
          )}

          {/* 2. BLOCKCHAIN */}
          {activeCourseKey === 'blockchain' && (
            <g>
              <rect x="70" y="60" width="220" height="140" rx="12" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="180" y="90" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                GENESIS BLOCK #0
              </text>
              <rect x="90" y="105" width="180" height="30" rx="6" fill={isHud ? 'rgba(0,0,0,0.5)' : '#E5F0DF'} stroke={isHashVerified ? themeWireframeStroke : '#FF3B30'} strokeWidth="1" />
              <text x="180" y="124" fill={isHashVerified ? (isHud ? '#00F0FF' : '#43A85B') : '#FF3B30'} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                {isHashVerified ? 'HASH: 00000019d668...' : '⚠ TAMPERED HASH'}
              </text>
              <circle cx="180" cy="165" r="16" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <text x="180" y="170" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                {miningNonce}
              </text>
              <line x1="290" y1="130" x2="390" y2="130" stroke={isHashVerified ? themeWireframeStroke : '#FF3B30'} strokeWidth="3" strokeDasharray={isHashVerified ? 'none' : '4 3'} />
              <polygon points="390,130 380,124 380,136" fill={isHashVerified ? themeWireframeStroke : '#FF3B30'} />
              <rect x="390" y="60" width="220" height="140" rx="12" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="500" y="90" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                BLOCK #1 (MINED)
              </text>
              <rect x="410" y="105" width="180" height="30" rx="6" fill={isHud ? 'rgba(0,0,0,0.5)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="500" y="124" fill={isHud ? '#00F0FF' : '#43A85B'} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                PREV: 00000019d668...
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                {isHashVerified ? '✓ Cryptographic SHA-256 Merkle Link Verified' : '⚠ Tamper Invalidation: Pointer Link Severed!'}
              </text>
            </g>
          )}

          {/* 3. MICROSOFT OFFICE */}
          {activeCourseKey === 'msoffice' && (
            <g>
              <rect x="80" y="50" width="520" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                EXCEL / CLOUD MULTI-DIMENSIONAL CALCULATION ENGINE
              </text>
              {[120, 260, 400, 520].map((x, i) => (
                <g key={`cell-${i}`}>
                  <rect x={x - 30} y="100" width="60" height="36" rx="6" fill={isHud ? 'rgba(0, 240, 255, 0.12)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="1.2" />
                  <text x={x} y="122" fill={themeTextPrimary} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                    {['A1', 'B2', 'C3', 'SUM'][i]}
                  </text>
                </g>
              ))}
              <line x1="150" y1="118" x2="230" y2="118" stroke={themeXrayLaser} strokeWidth="2" />
              <line x1="290" y1="118" x2="370" y2="118" stroke={themeXrayLaser} strokeWidth="2" />
              <line x1="430" y1="118" x2="490" y2="118" stroke={themeXrayLaser} strokeWidth="2" />
              <rect x="220" y="160" width="240" height="30" rx="8" fill={isHud ? 'rgba(255, 59, 48, 0.15)' : '#FEF3C7'} stroke={themeXrayLaser} strokeWidth="1.5" />
              <text x="340" y="179" fill={themeXrayLaser} fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                {isCloudSynced ? '✓ Real-Time Delta Synced (365 Cloud)' : 'Syncing Data Pipeline...'}
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Dynamic Formula DAG Evaluator • Recalculations: {formulaRecalcCount} • Pivot: {selectedPivotDimension.toUpperCase()}
              </text>
            </g>
          )}

          {/* 4. CYBERSECURITY BASICS */}
          {activeCourseKey === 'cybersecurity' && (
            <g>
              <polygon
                points="160,50 520,50 600,140 520,220 160,220 80,140"
                fill="url(#glass-hull-grad)"
                stroke={themeWireframeStroke}
                strokeWidth="2"
                filter={isHud ? 'url(#neon-glow)' : undefined}
              />
              <rect x="270" y="90" width="140" height="80" rx="10" fill={isHud ? '#061325' : '#FFFFFF'} stroke={themeWireframeStroke} strokeWidth="2" />
              <text x="340" y="125" fill={themeTextPrimary} fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                SECURE ASSET
              </text>
              <text x="340" y="145" fill={isHud ? '#00F0FF' : '#43A85B'} fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                {threatBlockedCount} Threats Neutralized
              </text>
              {activeAttackType !== 'none' && (
                <g filter={isHud ? 'url(#laser-glow)' : undefined}>
                  <line x1="40" y1="140" x2="220" y2="140" stroke="#FF3B30" strokeWidth="4" strokeDasharray="6 3" />
                  <circle cx="220" cy="140" r="10" fill="#FF3B30" />
                  <text x="130" y="130" fill="#FF3B30" fontSize="10" fontWeight="900" fontFamily="var(--font-mono)">
                    ATTACK: {activeAttackType.toUpperCase()}
                  </text>
                </g>
              )}
              <circle
                cx="340"
                cy="130"
                r="70"
                fill="none"
                stroke={isShieldActive ? themeWireframeStroke : '#FF3B30'}
                strokeWidth={isShieldActive ? 3 : 1.5}
                strokeDasharray="8 4"
                filter={isHud ? 'url(#neon-glow)' : undefined}
              />
              <text x="340" y="248" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                {isShieldActive ? '✓ WAF Defense Active • Zero-Trust Perimeter Enforced' : '⚠ Warning: Shield Bypassed!'}
              </text>
            </g>
          )}

          {/* 5. CODING BASICS */}
          {activeCourseKey === 'coding' && (
            <g>
              <rect x="100" y="50" width="480" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                CENTRAL PROCESSING UNIT • INSTRUCTION PIPELINE
              </text>
              <rect x="130" y="100" width="110" height="45" rx="8" fill={isHud ? 'rgba(255, 59, 48, 0.15)' : '#FEE2E2'} stroke={themeXrayLaser} strokeWidth="1.5" />
              <text x="185" y="120" fill={themeXrayLaser} fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                PROGRAM COUNTER
              </text>
              <text x="185" y="136" fill={themeXrayLaser} fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                PC: 0x{instructionPointer.toString(16).padStart(4, '0').toUpperCase()}
              </text>
              <line x1="240" y1="122" x2="310" y2="122" stroke={themeXrayLaser} strokeWidth="3" />
              <polygon points="310,95 380,95 395,122 380,150 310,150 325,122" fill={isHud ? '#002B3D' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="2" />
              <text x="350" y="126" fill={themeTextPrimary} fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                ALU
              </text>
              <line x1="395" y1="122" x2="440" y2="122" stroke={themeXrayLaser} strokeWidth="3" />
              <rect x="440" y="100" width="110" height="45" rx="8" fill={isHud ? 'rgba(0, 240, 255, 0.15)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="1.5" />
              <text x="495" y="120" fill={themeTextPrimary} fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                ACCUMULATOR
              </text>
              <text x="495" y="136" fill={isHud ? '#00F0FF' : '#43A85B'} fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                REG_A: {stackRegisterA}
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Deterministic Execution • Condition Flag: {conditionFlag ? 'TRUE (BRANCH TAKEN)' : 'FALSE'}
              </text>
            </g>
          )}

          {/* 6. INTERNET OF THINGS (IoT) - CABLE CAR POD HOMAGE */}
          {activeCourseKey === 'iot' && (
            <g>
              <path
                d="M 170,70 L 490,60 C 530,60 550,85 545,120 L 530,190 C 525,210 495,225 460,225 L 200,225 C 165,225 140,210 145,185 L 160,100 C 162,80 180,70 200,70 Z"
                fill="url(#glass-hull-grad)"
                stroke={themeWireframeStroke}
                strokeWidth="2.5"
                filter={isHud ? 'url(#neon-glow)' : undefined}
              />
              <line x1="330" y1="20" x2="330" y2="65" stroke={themeWireframeStroke} strokeWidth="3" />
              <circle cx="330" cy="20" r="6" fill={themeWireframeStroke} />
              <polygon points="190,95 270,95 265,145 185,145" fill="none" stroke={themeWireframeStroke} strokeWidth="1.5" strokeOpacity="0.6" />
              <polygon points="290,95 380,95 380,145 285,145" fill="none" stroke={themeWireframeStroke} strokeWidth="1.5" strokeOpacity="0.6" />
              <polygon points="400,95 480,95 470,145 395,145" fill="none" stroke={themeWireframeStroke} strokeWidth="1.5" strokeOpacity="0.6" />
              <g filter={isHud ? 'url(#laser-glow)' : undefined}>
                <rect x="290" y="145" width="80" height="55" rx="6" fill="#FF3B30" stroke="#FFFFFF" strokeWidth="1" />
                <text x="330" y="172" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                  ARM CORE
                </text>
                <text x="330" y="188" fill="#FFE5E5" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                  {sensorTemp.toFixed(1)}°C
                </text>
                <path d="M 220,170 Q 255,160 290,170" fill="none" stroke="#FF3B30" strokeWidth="2.5" />
                <path d="M 370,170 Q 410,180 440,165" fill="none" stroke="#FF3B30" strokeWidth="2.5" />
                <circle cx="220" cy="170" r="6" fill="#FF8800" />
                <circle cx="440" cy="165" r="6" fill="#FF8800" />
              </g>
              <path d="M 495,100 Q 520,110 495,125" fill="none" stroke={themeWireframeStroke} strokeWidth="2" />
              <path d="M 505,90 Q 540,110 505,135" fill="none" stroke={themeWireframeStroke} strokeWidth="2" strokeDasharray="3 3" />
              <text x="330" y="250" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Aerodynamic Smart Sensor Pod • MQTT Packets: {mqttPacketsSent} • Relay: {actuatorRelayOn ? 'ENGAGED' : 'OFF'}
              </text>
            </g>
          )}

          {/* 7. DIGITAL PRIVACY AND FOOTPRINTS */}
          {activeCourseKey === 'privacy' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                BROWSER PRIVACY ENCLAVE & ZERO-KNOWLEDGE SHIELD
              </text>
              <circle
                cx="340"
                cy="140"
                r="45"
                fill={isHud ? 'rgba(0, 240, 255, 0.15)' : '#E5F0DF'}
                stroke={trackingBlockerEnabled ? themeWireframeStroke : '#FF3B30'}
                strokeWidth="2.5"
              />
              <text x="340" y="145" fill={themeTextPrimary} fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                {digitalFootprintScore}/100
              </text>
              {[150, 190, 490, 530].map((x, i) => (
                <g key={`beacon-${i}`} filter={isHud ? 'url(#laser-glow)' : undefined}>
                  <circle cx={x} cy="140" r="10" fill="#FF3B30" />
                  <line x1={x < 340 ? x + 10 : x - 10} y1="140" x2={x < 340 ? 295 : 385} y2="140" stroke="#FF3B30" strokeWidth="2" strokeDasharray="4 2" />
                </g>
              ))}
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                {trackingBlockerEnabled ? '✓ Fingerprint Interception Active • 0 Data Broker Leaks' : '⚠ Warning: Digital Identity Exposed'}
              </text>
            </g>
          )}

          {/* 8. INTRODUCTION TO FINANCE */}
          {activeCourseKey === 'finance' && (
            <g>
              <rect x="100" y="50" width="480" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                CAPITAL ALLOCATION & EXPONENTIAL COMPOUNDING ENGINE
              </text>
              <circle cx="230" cy="140" r="35" fill="none" stroke={themeXrayLaser} strokeWidth="3" strokeDasharray="6 3" />
              <circle cx="230" cy="140" r="14" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <text x="230" y="144" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
                {aprRate}% APR
              </text>
              <line x1="265" y1="140" x2="380" y2="140" stroke={themeWireframeStroke} strokeWidth="3" />
              <rect x="380" y="110" width="160" height="60" rx="10" fill={isHud ? 'rgba(0, 240, 255, 0.15)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="2" />
              <text x="460" y="132" fill={themeTextPrimary} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                FUTURE VALUE ({compoundYears} YRS)
              </text>
              <text x="460" y="155" fill={isHud ? '#00F0FF' : '#43A85B'} fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                ${Math.round(principal * Math.pow(1 + aprRate / 100, compoundYears)).toLocaleString()}
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Principal: ${principal.toLocaleString()} • Exponential Curve Factor: {(Math.pow(1 + aprRate / 100, compoundYears)).toFixed(2)}x
              </text>
            </g>
          )}

          {/* 9. STOCK MARKET */}
          {activeCourseKey === 'stock' && (
            <g>
              <rect x="80" y="50" width="520" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="78" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                EXCHANGE ORDER BOOK & HIGH-FREQUENCY MATCHING ENGINE
              </text>
              <rect x="120" y="95" width="160" height="90" rx="8" fill={isHud ? 'rgba(67, 168, 91, 0.15)' : '#E5F0DF'} stroke="#43A85B" strokeWidth="1.5" />
              <text x="200" y="115" fill="#43A85B" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                BIDS (BUY DEPTH)
              </text>
              <text x="200" y="135" fill={themeTextPrimary} fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">
                $142.75 • 4,200 Qty
              </text>
              <text x="200" y="155" fill={themeTextPrimary} fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">
                $142.60 • 8,900 Qty
              </text>
              <line x1="280" y1="140" x2="400" y2="140" stroke={themeXrayLaser} strokeWidth="3" filter={isHud ? 'url(#laser-glow)' : undefined} />
              <circle cx="340" cy="140" r="14" fill={themeXrayLaser} />
              <text x="340" y="144" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">
                MATCH
              </text>
              <rect x="400" y="95" width="160" height="90" rx="8" fill={isHud ? 'rgba(255, 59, 48, 0.15)' : '#FEE2E2'} stroke="#FF3B30" strokeWidth="1.5" />
              <text x="480" y="115" fill="#FF3B30" fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                ASKS (SELL DEPTH)
              </text>
              <text x="480" y="135" fill={themeTextPrimary} fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">
                $142.90 • 3,100 Qty
              </text>
              <text x="480" y="155" fill={themeTextPrimary} fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">
                $143.05 • 6,500 Qty
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Last Price: ${stockPrice.toFixed(2)} • Spread: ${orderBookSpread.toFixed(2)} • Volatility: {marketVolatility.toUpperCase()}
              </text>
            </g>
          )}

          {/* 10. CRYPTOCURRENCY */}
          {activeCourseKey === 'crypto' && (
            <g>
              <rect x="100" y="50" width="480" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                SECURE HARDWARE ENCLAVE & SECP256K1 KEY VAULT
              </text>
              <rect x="140" y="100" width="120" height="80" rx="10" fill={isHud ? '#001A2C' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="2" />
              <circle cx="200" cy="130" r="16" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <text x="200" y="134" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">
                PRIV_KEY
              </text>
              <text x="200" y="165" fill={themeTextPrimary} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                {enclaveLocked ? 'ENCLAVE LOCKED' : 'ECDSA SIGNING'}
              </text>
              <line x1="260" y1="140" x2="380" y2="140" stroke={themeXrayLaser} strokeWidth="3" />
              <rect x="380" y="95" width="160" height="40" rx="6" fill={isHud ? 'rgba(0, 240, 255, 0.12)' : '#FFFFFF'} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="460" y="120" fill={themeTextPrimary} fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">
                OUT 0: 1.75 BTC (Recipient)
              </text>
              <rect x="380" y="145" width="160" height="40" rx="6" fill={isHud ? 'rgba(0, 240, 255, 0.12)' : '#FFFFFF'} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="460" y="170" fill={themeTextPrimary} fontSize="9.5" textAnchor="middle" fontFamily="var(--font-mono)">
                OUT 1: 0.24 BTC (Change)
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Asymmetric Cryptography • Gas Priority: {gasFeePriority.toUpperCase()} • Zero-Knowledge Validity
              </text>
            </g>
          )}

          {/* 11. FINTECH */}
          {activeCourseKey === 'fintech' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                TOKENIZED PAYMENT RAILS & INSTANT SETTLEMENT SWITCH
              </text>
              <rect x="130" y="100" width="90" height="75" rx="8" fill={isHud ? '#002B47' : '#FFFFFF'} stroke={themeWireframeStroke} strokeWidth="2" />
              <circle cx="175" cy="130" r="14" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <text x="175" y="134" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">
                NFC TAP
              </text>
              <line x1="220" y1="135" x2="330" y2="135" stroke={themeXrayLaser} strokeWidth="3" strokeDasharray="5 3" />
              <rect x="330" y="100" width="130" height="75" rx="8" fill={isHud ? 'rgba(0, 240, 255, 0.15)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="2" />
              <text x="395" y="125" fill={themeTextPrimary} fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                TOKEN VAULT
              </text>
              <text x="395" y="145" fill={isHud ? '#00F0FF' : '#43A85B'} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                {tokenizedPan}
              </text>
              <line x1="460" y1="135" x2="520" y2="135" stroke={themeWireframeStroke} strokeWidth="3" />
              <circle cx="535" cy="135" r="15" fill="#43A85B" />
              <text x="535" y="139" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">
                ACH/UPI
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Biometric Enclave Authenticated • State: {upiSettlementStatus} • PCI-DSS Level 1 Compliant
              </text>
            </g>
          )}

          {/* 12. GLOBAL ECONOMY */}
          {activeCourseKey === 'economy' && (
            <g>
              <circle cx="340" cy="135" r="80" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <ellipse cx="340" cy="135" rx="80" ry="30" fill="none" stroke={themeWireframeStroke} strokeWidth="1" strokeDasharray="4 2" />
              <ellipse cx="340" cy="135" rx="35" ry="80" fill="none" stroke={themeWireframeStroke} strokeWidth="1" strokeDasharray="4 2" />
              {[280, 400, 340].map((x, i) => (
                <circle key={`hub-${i}`} cx={x} cy={[110, 160, 135][i]} r="8" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              ))}
              <line x1="280" y1="110" x2="340" y2="135" stroke={themeXrayLaser} strokeWidth="2" />
              <line x1="340" y1="135" x2="400" y2="160" stroke={themeXrayLaser} strokeWidth="2" />
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Central Bank Policy Rate: {interestRatePolicy}% • Global GDP Growth: {globalGdpGrowth}% • Tariff Shock: {tariffShockActive ? 'ACTIVE' : 'NOMINAL'}
              </text>
            </g>
          )}

          {/* 13. BANKING AND ACCOUNT TYPES */}
          {activeCourseKey === 'banking' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                INSTITUTIONAL LIQUIDITY VAULT & ACCOUNT SETTLEMENT
              </text>
              <circle cx="210" cy="140" r="35" fill="none" stroke={themeWireframeStroke} strokeWidth="3" />
              <circle cx="210" cy="140" r="14" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <text x="210" y="144" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">
                RESERVE
              </text>
              <line x1="245" y1="140" x2="350" y2="140" stroke={themeXrayLaser} strokeWidth="3" />
              <rect x="350" y="105" width="200" height="70" rx="8" fill={isHud ? 'rgba(0, 240, 255, 0.12)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="1.5" />
              <text x="450" y="125" fill={themeTextPrimary} fontSize="10" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                TIER: {bankAccountType}
              </text>
              <text x="450" y="145" fill={isHud ? '#00F0FF' : '#43A85B'} fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="var(--font-mono)">
                ${bankBalance.toLocaleString()}
              </text>
              <text x="450" y="162" fill={themeTextSecondary} fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)">
                Accrued Interest: +${interestAccrued}
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Fractional Reserve Multiplier: 10x • Real-Time Interbank RTGS Clearance
              </text>
            </g>
          )}

          {/* 14. COMMUNICATION SKILLS */}
          {activeCourseKey === 'communication' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="80" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                ACOUSTIC SPECTRUM & INTERPERSONAL EMPATHY RESONANCE
              </text>
              {[120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520].map((x, i) => {
                const h = 20 + Math.sin(i * 0.8 + step * 0.2) * 35;
                return (
                  <rect
                    key={`wave-${i}`}
                    x={x}
                    y={140 - h / 2}
                    width="12"
                    height={h}
                    rx="4"
                    fill={i % 2 === 0 ? themeWireframeStroke : themeXrayLaser}
                    filter={isHud ? 'url(#laser-glow)' : undefined}
                  />
                );
              })}
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Tone: {vocalTone} • Active Listening: {activeListeningFilter ? 'FILTER ON' : 'RAW'} • Resonance Score: {resonanceScore}%
              </text>
            </g>
          )}

          {/* 15. TIME MANAGEMENT */}
          {activeCourseKey === 'time' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="78" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                4D CHRONOMETER & EISENHOWER PRIORITY MATRIX
              </text>
              <rect x="180" y="95" width="140" height="50" rx="6" fill={activeQuadrant === 'Q1' ? themeXrayLaser : (isHud ? 'rgba(0,0,0,0.4)' : '#FFFFFF')} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="250" y="125" fill={activeQuadrant === 'Q1' ? '#FFFFFF' : themeTextPrimary} fontSize="10" fontWeight="800" textAnchor="middle">
                Q1: URGENT & IMPORTANT
              </text>
              <rect x="340" y="95" width="140" height="50" rx="6" fill={activeQuadrant === 'Q2' ? themeXrayLaser : (isHud ? 'rgba(0,0,0,0.4)' : '#FFFFFF')} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="410" y="125" fill={activeQuadrant === 'Q2' ? '#FFFFFF' : themeTextPrimary} fontSize="10" fontWeight="800" textAnchor="middle">
                Q2: DEEP STRATEGY
              </text>
              <rect x="180" y="150" width="140" height="40" rx="6" fill={activeQuadrant === 'Q3' ? themeXrayLaser : (isHud ? 'rgba(0,0,0,0.4)' : '#FFFFFF')} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="250" y="175" fill={activeQuadrant === 'Q3' ? '#FFFFFF' : themeTextPrimary} fontSize="9" fontWeight="700" textAnchor="middle">
                Q3: DELEGATE
              </text>
              <rect x="340" y="150" width="140" height="40" rx="6" fill={activeQuadrant === 'Q4' ? themeXrayLaser : (isHud ? 'rgba(0,0,0,0.4)' : '#FFFFFF')} stroke={themeWireframeStroke} strokeWidth="1" />
              <text x="410" y="175" fill={activeQuadrant === 'Q4' ? '#FFFFFF' : themeTextPrimary} fontSize="9" fontWeight="700" textAnchor="middle">
                Q4: ELIMINATE
              </text>
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Pomodoro Focus Sprint: {pomodoroMinutes}m • Chronometer Status: {isPomodoroRunning ? 'RUNNING' : 'STANDBY'}
              </text>
            </g>
          )}

          {/* 16. SOFT SKILLS */}
          {activeCourseKey === 'softskills' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="78" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                EMOTIONAL INTELLIGENCE & CONFLICT RESOLUTION NEXUS
              </text>
              <circle cx="340" cy="140" r="50" fill="none" stroke={themeWireframeStroke} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="340" cy="140" r="30" fill="none" stroke={themeWireframeStroke} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="340" cy="140" r="12" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <line
                x1="340"
                y1="140"
                x2={340 + Math.cos(step * 0.15) * 50}
                y2={140 + Math.sin(step * 0.15) * 50}
                stroke={themeXrayLaser}
                strokeWidth="2.5"
              />
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                EQ Quotient: {eqRadarValue}/100 • Buffer: {deEscalationBuffer ? 'ENGAGED' : 'OFF'} • Team Synergy: {teamSynergyLevel}
              </text>
            </g>
          )}

          {/* 17. STARTUP IDEATION */}
          {activeCourseKey === 'startup' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="78" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                LEAN VENTURE CANVAS & PRODUCT-MARKET FIT REACTOR
              </text>
              {['1. PROBLEM DISCOVERY', '2. SOLUTION MVP', '3. PRODUCT-MARKET FIT'].map((label, i) => {
                const x = 120 + i * 160;
                return (
                  <g key={`stage-${i}`}>
                    <rect x={x} y="105" width="130" height="65" rx="8" fill={isHud ? 'rgba(0, 240, 255, 0.12)' : '#FFFFFF'} stroke={themeWireframeStroke} strokeWidth="1.5" />
                    <text x={x + 65} y="128" fill={themeTextPrimary} fontSize="8.5" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                      {label}
                    </text>
                    <circle cx={x + 65} cy="148" r="8" fill={i === 1 ? themeXrayLaser : (isHud ? '#00F0FF' : '#43A85B')} />
                  </g>
                );
              })}
              <line x1="250" y1="138" x2="280" y2="138" stroke={themeXrayLaser} strokeWidth="2" />
              <line x1="410" y1="138" x2="440" y2="138" stroke={themeXrayLaser} strokeWidth="2" />
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Stage: {businessModelStage} • CAC to LTV: {cacLtvRatio} • Capital Runway: {runwayMonths} Months
              </text>
            </g>
          )}

          {/* 18. SOCIAL PROFILE DEVELOPMENT */}
          {activeCourseKey === 'social' && (
            <g>
              <rect x="90" y="50" width="500" height="170" rx="14" fill="url(#glass-hull-grad)" stroke={themeWireframeStroke} strokeWidth="2" filter={isHud ? 'url(#neon-glow)' : undefined} />
              <text x="340" y="78" fill={themeTextPrimary} fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="var(--font-mono)">
                PROFESSIONAL NETWORK GRAPH & ALGORITHMIC BRAND REACH
              </text>
              <circle cx="340" cy="140" r="22" fill={themeXrayLaser} filter={isHud ? 'url(#laser-glow)' : undefined} />
              <text x="340" y="144" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">
                YOU
              </text>
              {[
                { x: 220, y: 110, name: 'RECRUITERS' },
                { x: 220, y: 170, name: 'PEERS' },
                { x: 460, y: 110, name: 'MENTORS' },
                { x: 460, y: 170, name: 'INDUSTRY' },
              ].map((node, i) => (
                <g key={`node-${i}`}>
                  <line x1="340" y1="140" x2={node.x} y2={node.y} stroke={themeWireframeStroke} strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={node.x} cy={node.y} r="14" fill={isHud ? 'rgba(0, 240, 255, 0.2)' : '#E5F0DF'} stroke={themeWireframeStroke} strokeWidth="1.5" />
                  <text x={node.x} y={node.y + 3} fill={themeTextPrimary} fontSize="8" fontWeight="800" textAnchor="middle">
                    {node.name}
                  </text>
                </g>
              ))}
              <text x="340" y="245" fill={themeTextSecondary} fontSize="11" fontWeight="600" textAnchor="middle">
                Keyword Density: {keywordDensity}% • Reach Multiplier: {profileReachMultiplier}x • Standing: {thoughtLeadershipRank}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Controls Bar for Active Course */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {activeCourseKey === 'ai' && (
          <>
            <button
              type="button"
              onClick={() => {
                setIsInferencing(true);
                setAiTokensGenerated((prev) => prev + 12);
                setTimeout(() => setIsInferencing(false), 400);
              }}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              {isInferencing ? 'Running Forward Pass...' : '⚡ Generate Next Tokens'}
            </button>
            <button
              type="button"
              onClick={() => setAiTemperature((prev) => (prev >= 1.0 ? 0.2 : Number((prev + 0.2).toFixed(1))))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Temperature: {aiTemperature} (Toggle)
            </button>
            <button
              type="button"
              onClick={() => setAiSelectedHead((prev) => (prev >= 4 ? 1 : prev + 1))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Switch Attention Head (#{aiSelectedHead})
            </button>
          </>
        )}

        {activeCourseKey === 'blockchain' && (
          <>
            <button
              type="button"
              onClick={() => setIsMining(!isMining)}
              className={isMining ? 'btn-danger' : 'btn-primary'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              {isMining ? 'Stop Mining' : 'Auto-Mine Block'}
            </button>
            <button
              type="button"
              onClick={() => setMiningNonce((prev) => prev + 10)}
              className="btn-secondary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              +10 Nonces
            </button>
            <button
              type="button"
              onClick={() => setIsHashVerified(!isHashVerified)}
              className={isHashVerified ? 'btn-outline' : 'btn-danger'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              {isHashVerified ? 'Simulate Tamper on Block #0' : 'Fix & Re-Verify Chain'}
            </button>
          </>
        )}

        {activeCourseKey === 'msoffice' && (
          <>
            <button
              type="button"
              onClick={() => setFormulaRecalcCount((prev) => prev + 1)}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Recalculate Formula DAG
            </button>
            <button
              type="button"
              onClick={() => setSelectedPivotDimension((prev) => (prev === 'region' ? 'quarter' : prev === 'quarter' ? 'category' : 'region'))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Pivot Dimension: {selectedPivotDimension.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setIsCloudSynced(!isCloudSynced)}
              className="btn-secondary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              {isCloudSynced ? '✓ Cloud Synced' : 'Sync to Cloud'}
            </button>
          </>
        )}

        {activeCourseKey === 'cybersecurity' && (
          <>
            <button
              type="button"
              onClick={() => {
                setActiveAttackType('ddos');
                if (isShieldActive) setThreatBlockedCount((prev) => prev + 1);
              }}
              className="btn-danger"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Simulate DDoS SYN Flood
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveAttackType('sqli');
                if (isShieldActive) setThreatBlockedCount((prev) => prev + 1);
              }}
              className="btn-secondary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Simulate SQL Injection
            </button>
            <button
              type="button"
              onClick={() => setIsShieldActive(!isShieldActive)}
              className={isShieldActive ? 'btn-primary' : 'btn-outline'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              WAF Shield: {isShieldActive ? 'ACTIVE (BLOCKING)' : 'DISABLED'}
            </button>
          </>
        )}

        {activeCourseKey === 'coding' && (
          <>
            <button
              type="button"
              onClick={() => {
                setInstructionPointer((prev) => prev + 4);
                setStackRegisterA((prev) => prev + 1);
              }}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Step Machine Instruction
            </button>
            <button
              type="button"
              onClick={() => setConditionFlag(!conditionFlag)}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Toggle Branch Flag ({conditionFlag ? 'TRUE' : 'FALSE'})
            </button>
            <button
              type="button"
              onClick={() => {
                setInstructionPointer(0);
                setStackRegisterA(14);
              }}
              className="btn-secondary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 10px' }}
            >
              Reset Registers
            </button>
          </>
        )}

        {activeCourseKey === 'iot' && (
          <>
            <button
              type="button"
              onClick={() => setMqttPacketsSent((prev) => prev + 8)}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Send MQTT Telemetry
            </button>
            <button
              type="button"
              onClick={() => setActuatorRelayOn(!actuatorRelayOn)}
              className={actuatorRelayOn ? 'btn-outline' : 'btn-secondary'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Actuator Relay: {actuatorRelayOn ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setSensorTemp((prev) => Number((prev + 1.2).toFixed(1)))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 10px' }}
            >
              +1.2°C Temperature
            </button>
          </>
        )}

        {activeCourseKey === 'privacy' && (
          <>
            <button
              type="button"
              onClick={() => setTrackingBlockerEnabled(!trackingBlockerEnabled)}
              className={trackingBlockerEnabled ? 'btn-primary' : 'btn-danger'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Tracker Shield: {trackingBlockerEnabled ? 'SHIELD ON' : 'DISABLED'}
            </button>
            <button
              type="button"
              onClick={() => {
                setDigitalFootprintScore(98);
              }}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Flush Trackers & Cookies
            </button>
          </>
        )}

        {activeCourseKey === 'finance' && (
          <>
            <button
              type="button"
              onClick={() => setCompoundYears((prev) => (prev >= 20 ? 5 : prev + 5))}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Advance Horizon: +5 Yrs ({compoundYears} Yrs)
            </button>
            <button
              type="button"
              onClick={() => setAprRate((prev) => (prev >= 12 ? 6.0 : Number((prev + 1.5).toFixed(1))))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              APR: {aprRate}% (Cycle)
            </button>
          </>
        )}

        {activeCourseKey === 'stock' && (
          <>
            <button
              type="button"
              onClick={() => setStockPrice((prev) => Number((prev + (Math.random() > 0.5 ? 0.45 : -0.35)).toFixed(2)))}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Execute Market Trade
            </button>
            <button
              type="button"
              onClick={() => setMarketVolatility((prev) => (prev === 'low' ? 'medium' : prev === 'medium' ? 'high' : 'low'))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Volatility: {marketVolatility.toUpperCase()}
            </button>
          </>
        )}

        {activeCourseKey === 'crypto' && (
          <>
            <button
              type="button"
              onClick={() => setCryptoUtxoSent(true)}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              {cryptoUtxoSent ? '✓ UTXO Broadcasted' : 'Sign & Broadcast UTXO'}
            </button>
            <button
              type="button"
              onClick={() => setEnclaveLocked(!enclaveLocked)}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Hardware Enclave: {enclaveLocked ? 'LOCKED' : 'UNLOCKED'}
            </button>
          </>
        )}

        {activeCourseKey === 'fintech' && (
          <>
            <button
              type="button"
              onClick={() => {
                setUpiSettlementStatus('CLEARED');
              }}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Simulate Contactless NFC Tap
            </button>
            <button
              type="button"
              onClick={() => setTokenizedPan(`tok_${Math.random().toString(36).substring(2, 6)}_0918`)}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Rotate Payment Token
            </button>
          </>
        )}

        {activeCourseKey === 'economy' && (
          <>
            <button
              type="button"
              onClick={() => setTariffShockActive(!tariffShockActive)}
              className={tariffShockActive ? 'btn-danger' : 'btn-primary'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Tariff Shock: {tariffShockActive ? 'ENGAGED' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setInterestRatePolicy((prev) => Number((prev === 5.5 ? 2.5 : prev + 0.5).toFixed(2)))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Central Bank Rate: {interestRatePolicy}%
            </button>
          </>
        )}

        {activeCourseKey === 'banking' && (
          <>
            <button
              type="button"
              onClick={() => setBankAccountType((prev) => (prev === 'SAVINGS' ? 'CURRENT' : prev === 'CURRENT' ? 'FIXED_DEPOSIT' : 'SAVINGS'))}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Account Tier: {bankAccountType}
            </button>
            <button
              type="button"
              onClick={() => {
                setBankBalance((prev) => prev + 500);
                setInterestAccrued((prev) => prev + 25);
              }}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Deposit +$500
            </button>
          </>
        )}

        {activeCourseKey === 'communication' && (
          <>
            <button
              type="button"
              onClick={() => setVocalTone((prev) => (prev === 'Empathetic' ? 'Assertive' : prev === 'Assertive' ? 'Analytical' : 'Empathetic'))}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Tone: {vocalTone}
            </button>
            <button
              type="button"
              onClick={() => setActiveListeningFilter(!activeListeningFilter)}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Active Listening: {activeListeningFilter ? 'FILTER ON' : 'OFF'}
            </button>
          </>
        )}

        {activeCourseKey === 'time' && (
          <>
            <button
              type="button"
              onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
              className={isPomodoroRunning ? 'btn-danger' : 'btn-primary'}
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              {isPomodoroRunning ? 'Pause Pomodoro' : 'Start 25m Focus Sprint'}
            </button>
            <button
              type="button"
              onClick={() => setActiveQuadrant((prev) => (prev === 'Q1' ? 'Q2' : prev === 'Q2' ? 'Q3' : prev === 'Q3' ? 'Q4' : 'Q1'))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Quadrant: {activeQuadrant}
            </button>
          </>
        )}

        {activeCourseKey === 'softskills' && (
          <>
            <button
              type="button"
              onClick={() => setDeEscalationBuffer(!deEscalationBuffer)}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              De-Escalation Buffer: {deEscalationBuffer ? 'ENGAGED' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setEqRadarValue((prev) => (prev >= 95 ? 75 : prev + 5))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Boost EQ Score (+5)
            </button>
          </>
        )}

        {activeCourseKey === 'startup' && (
          <>
            <button
              type="button"
              onClick={() => setBusinessModelStage((prev) => (prev === 'Problem' ? 'Solution' : prev === 'Solution' ? 'Product-Market-Fit' : 'Problem'))}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Pivot Stage: {businessModelStage}
            </button>
            <button
              type="button"
              onClick={() => setRunwayMonths((prev) => (prev >= 24 ? 12 : prev + 3))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Runway: {runwayMonths} Mo
            </button>
          </>
        )}

        {activeCourseKey === 'social' && (
          <>
            <button
              type="button"
              onClick={() => setKeywordDensity((prev) => (prev >= 95 ? 70 : prev + 5))}
              className="btn-primary"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 14px' }}
            >
              Optimize SEO Keywords ({keywordDensity}%)
            </button>
            <button
              type="button"
              onClick={() => setProfileReachMultiplier((prev) => Number((prev >= 5.0 ? 2.0 : prev + 0.5).toFixed(1)))}
              className="btn-outline"
              style={{ height: '34px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              Reach: {profileReachMultiplier}x
            </button>
          </>
        )}
      </div>
    </div>
  );
};
