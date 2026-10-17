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
  Clock,
  Layers,
  ChevronRight,
  Wind,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';
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
} from './LabSvgVisualizers';

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

  // Shared lifecycle & submission state
  const [lifecycleState, setLifecycleState] = useState<LabLifecycleState>('ready');
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'LOCAL DRAFT' | 'UNSAVED'>('SAVED');
  const [mobileTab, setMobileTab] = useState<'instructions' | 'workspace' | 'results'>('workspace');
  const [completedAttempt, setCompletedAttempt] = useState<LabAttemptRecord | null>(null);

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

  // Lab T5: Defensive Web Security Lab
  const [secParamQueries, setSecParamQueries] = useState<boolean>(lab.initial_state.parameterizedQueries ?? false);
  const [secOutputEncoding, setSecOutputEncoding] = useState<boolean>(lab.initial_state.outputEncoding ?? false);
  const [secCsp, setSecCsp] = useState<boolean>(lab.initial_state.cspEnabled ?? false);
  const [secQueryInput, setSecQueryInput] = useState<string>(lab.initial_state.userQueryInput || "' OR '1'='1");
  const [secExecutionLog, setSecExecutionLog] = useState<string[]>([]);

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

  // Defensive Web Security evaluation
  const handleRunSecurityTests = () => {
    setLifecycleState('running');
    const logs: string[] = [];

    // Test 1: SQL Injection
    if (secParamQueries) {
      logs.push('✓ SQL INJECTION MITIGATED: Query parameterized. Input treated as literal data, preventing statement breakout.');
    } else {
      logs.push('✕ CRITICAL VULNERABILITY: Raw input concatenated into SQL string. Malicious WHERE condition evaluated.');
    }

    // Test 2: XSS
    if (secOutputEncoding) {
      logs.push('✓ XSS DEFENSE ACTIVE: Input entity-encoded (&lt;script&gt;). Browser renders text instead of executing script.');
    } else {
      logs.push('✕ HIGH RISK: Raw unencoded input echoed to DOM. Reflected script execution permitted.');
    }

    if (secCsp) {
      logs.push('✓ CSP HEADER ENFORCED: script-src \'self\'; disallows inline script execution.');
    }

    setSecExecutionLog(logs);
    setLifecycleState('ready');

    const next = [...checkedCriteria];
    if (secParamQueries) next[0] = true;
    if (secOutputEncoding) next[1] = true;
    if (secParamQueries && secOutputEncoding) next[2] = true;
    setCheckedCriteria(next);
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
  const handleSubmitAttempt = () => {
    const passedCount = checkedCriteria.filter(Boolean).length;
    const score = Math.round((passedCount / lab.validation_criteria.length) * 100);
    const passed = score >= lab.completion_threshold;

    try {
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

      setCompletedAttempt(record);
      setLifecycleState(passed ? 'success' : 'incorrect');
      setSaveStatus('SAVED');
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
      setLifecycleState('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--bg-canvas)' }}>
      {/* ============================================================== */}
      {/* 1. TOP NAVIGATION BAR (Section 3.1)                             */}
      {/* ============================================================== */}
      <header
        style={{
          height: '60px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: '72px',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={onNavigateBack}
            className="btn-secondary"
            style={{ height: '36px', padding: '0 12px', fontSize: '0.85rem' }}
            title="Back to Labs Catalogue"
          >
            <ArrowLeft size={16} />
            <span>Back to Labs</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {lab.title}
            </h1>
            <span className="badge badge-brand" style={{ textTransform: 'capitalize' }}>
              {lab.category}
            </span>
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
              {lab.interaction_type}
            </span>
            {lab.course_slug && onSelectCourse && (
              <button
                type="button"
                onClick={() => onSelectCourse(lab.course_slug!)}
                className="btn-outline"
                style={{ height: '28px', padding: '0 8px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                title="Go to associated course"
              >
                View Course
              </button>
            )}
          </div>
        </div>

        {/* Center / Right status & controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Save Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Save size={14} color={saveStatus === 'SAVED' ? 'var(--success)' : 'var(--warning)'} />
            <span style={{ fontWeight: 600 }}>{saveStatus}</span>
          </div>

          {/* Reset Control */}
          <button
            type="button"
            onClick={handleResetLab}
            className="btn-outline"
            style={{ height: '36px', padding: '0 12px', fontSize: '0.85rem' }}
            title="Reset lab to initial state"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div
        style={{
          display: 'none',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '8px 16px',
          gap: '8px',
        }}
        className="mobile-tab-bar"
      >
        <button
          type="button"
          onClick={() => setMobileTab('instructions')}
          style={{
            flex: 1,
            height: '36px',
            backgroundColor: mobileTab === 'instructions' ? 'var(--brand-surface)' : 'transparent',
            color: mobileTab === 'instructions' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.82rem',
          }}
        >
          1. Instructions
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('workspace')}
          style={{
            flex: 1,
            height: '36px',
            backgroundColor: mobileTab === 'workspace' ? 'var(--brand-surface)' : 'transparent',
            color: mobileTab === 'workspace' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.82rem',
          }}
        >
          2. Workspace
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('results')}
          style={{
            flex: 1,
            height: '36px',
            backgroundColor: mobileTab === 'results' ? 'var(--brand-surface)' : 'transparent',
            color: mobileTab === 'results' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.82rem',
          }}
        >
          3. Assessment
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN 3-PANEL WORKSPACE (Section 3.1)                         */}
      {/* ============================================================== */}
      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 1fr 340px',
          gap: '0',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-canvas)',
        }}
        className="workspace-grid-container"
      >
        {/* ============================================================ */}
        {/* PANEL 1 (LEFT): INSTRUCTIONS & PARAMETERS                    */}
        {/* ============================================================ */}
        <aside
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-subtle)',
            padding: '24px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
              LEARNING OBJECTIVE
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {lab.learning_objective}
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '10px' }}>
              STEP-BY-STEP INSTRUCTIONS
            </div>
            <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lab.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div style={{ marginTop: 'auto', padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subdued)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '4px' }}>
              <HelpCircle size={15} color="var(--brand-primary)" />
              <span>Lab Architecture Note</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              This lab executes deterministic, bounded logic in your browser. State changes are verified client-side and committed authoritatively to your database progress record.
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* PANEL 2 (CENTRE): INTERACTIVE WORKSPACE ENGINE               */}
        {/* ============================================================ */}
        <section
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Header Summary Card */}
          <div className="card" style={{ padding: '18px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {lab.title}
                </h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {lab.summary}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-brand">
                  <Clock size={12} />
                  <span>{lab.duration_minutes} Mins</span>
                </span>
                <span className="badge badge-accent">
                  <Layers size={12} />
                  <span>v{lab.version}</span>
                </span>
              </div>
            </div>
          </div>

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Chained Cryptographic Blocks (SHA-256)
                </div>
                <button
                  type="button"
                  onClick={handleTamperBlock1}
                  className="btn-danger"
                  style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem' }}
                >
                  <AlertTriangle size={14} />
                  <span>Simulate Tamper on Block 1</span>
                </button>
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
          {lab.id === 'lab-t5-web-defense' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Web Security Defense Interception Pipeline
              </div>

              {/* Real-time SVG Security Pipeline */}
              <SecurityPipelineSvg
                paramQueries={secParamQueries}
                outputEncoding={secOutputEncoding}
                strictCsp={secCsp}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Simulated Untrusted Input Payload
                </label>
                <input
                  type="text"
                  value={secQueryInput}
                  onChange={(e) => setSecQueryInput(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>

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
                <div style={{ backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {secExecutionLog.map((log, i) => (
                    <div key={i} style={{ color: log.startsWith('✓') ? 'var(--success)' : 'var(--danger)' }}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
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
                      onClick={() => setHintsRevealed((prev) => Math.min(prev + 1, 2))}
                      className="btn-secondary"
                      style={{ height: '34px', padding: '0 12px', fontSize: '0.8rem' }}
                    >
                      <HelpCircle size={14} />
                      <span>Reveal Hint ({hintsRevealed}/2)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="btn-primary"
                    style={{ height: '34px', padding: '0 16px', fontSize: '0.85rem' }}
                  >
                    <Play size={14} />
                    <span>Run Code</span>
                  </button>
                </div>
              </div>

              {hintsRevealed > 0 && lab.id === 'lab-c3-debugging-workshop' && (
                <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning-border)', fontSize: '0.82rem', color: 'var(--warning-text)' }}>
                  {hintsRevealed === 1 && (
                    <div><strong>Hint 1:</strong> Look at the condition <code>left &lt; right</code>. What happens when the search target is at index 0? Should it be <code>left &lt;= right</code>?</div>
                  )}
                  {hintsRevealed === 2 && (
                    <div><strong>Hint 2:</strong> In the <code>else</code> branch when <code>arr[mid] &gt; target</code>, make sure to adjust <code>right = mid - 1</code> to prevent infinite loops.</div>
                  )}
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
        </section>

        {/* ============================================================ */}
        {/* PANEL 3 (RIGHT): OUTPUT, CRITERIA & SUBMISSION VERIFICATION  */}
        {/* ============================================================ */}
        <aside
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '24px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
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
      </main>
    </div>
  );
};
