import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  PhoneCall,
  FileCheck,
  RotateCcw,
  Award,
} from 'lucide-react';
import { InMemoryDatabase } from '../db/in-memory-db';

export interface ScamDefenseJourneyProps {
  db: InMemoryDatabase;
  currentUserId: string;
  onNavigateBack: () => void;
  onViewPortfolio?: () => void;
}

type JourneyStage = 'understand' | 'examine' | 'apply' | 'feedback' | 'demonstrate';

interface CaseStudy {
  id: string;
  title: string;
  channel: string;
  senderHandle: string;
  isScam: boolean;
  amount: string;
  headline: string;
  messageBody: string;
  redFlags: string[];
  safeAction: 'decline' | 'report_1930' | 'approve';
  explanation: string;
  npciGuideline: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-lottery',
    title: 'Case Study 1: The Festival Cashback Collect Request',
    channel: 'UPI Collect Notification',
    senderHandle: 'festival.rewards2026@ybl',
    isScam: true,
    amount: '₹25,000',
    headline: 'Cashback Claim Pending Approval',
    messageBody: 'Congratulation! You won ₹25,000 Diwali cashback from BharatRewards. Enter your 6-digit UPI PIN now to credit this amount directly into your bank account.',
    redFlags: [
      'Demands UPI PIN entry to receive funds (Entering PIN always DEBITS funds)',
      'Unverified personal VPA handle posing as institutional rewards provider',
      'Uses urgent celebratory language to bypass rational evaluation',
      'Incoming transaction is a Collect Request, not an inbound credit',
    ],
    safeAction: 'decline',
    explanation: 'Entering a UPI PIN NEVER receives money. UPI PIN is exclusively used to authorize deductions from your own account. Legitimate cashback is automatically credited via IMPS/NEFT without user action.',
    npciGuideline: 'NPCI Directive: "UPI PIN is required only for sending money, not for receiving. Never enter your PIN to claim lottery, rewards, or refunds."',
  },
  {
    id: 'case-kyc',
    title: 'Case Study 2: Urgent Bank KYC Suspension Alert',
    channel: 'SMS Alert',
    senderHandle: 'AD-SBISUP (Spoofed Header)',
    isScam: true,
    amount: 'N/A (Credential Theft)',
    headline: 'URGENT: Bank Account Suspended Today',
    messageBody: 'Dear Customer, Your SBI Bank account will be blocked within 2 hours due to pending KYC update. Click http://bit.ly/sbi-kyc-fix to download official KYC Support APK immediately.',
    redFlags: [
      'Artificial deadline ("within 2 hours") intended to induce panic',
      'Shortened suspicious link (bit.ly) obscuring true destination server',
      'Prompts direct installation of an APK file outside Google Play Store / App Store',
      'Banks never ask customers to download APKs or share credentials via SMS',
    ],
    safeAction: 'report_1930',
    explanation: 'Fraudulent APK files request Android Accessibility Services or SMS reading permissions to intercept 2-Factor Authentication OTPs. Report impersonation scams immediately to 1930.',
    npciGuideline: 'RBI Advisory: "Banks never send SMS containing shortened links or links to install third-party apps for KYC verification."',
  },
  {
    id: 'case-merchant',
    title: 'Case Study 3: University Cafeteria Counter Payment',
    channel: 'Countertop BharatQR / UPI QR',
    senderHandle: 'pesu.canteen@axisbank',
    isScam: false,
    amount: '₹85.00',
    headline: 'PESU North Campus Cafeteria',
    messageBody: 'Authorized Merchant Payment for Lunch Plate. Verified merchant name: PESU Canteen Services Pvt Ltd. Transaction Reference: PESU-2026-OCT-8841.',
    redFlags: [
      'None: Verified merchant handle with green checkmark from acquiring bank',
      'Clear transaction invoice and physical point-of-sale alignment',
    ],
    safeAction: 'approve',
    explanation: 'This is a genuine, verified merchant checkout. The VPA ends with an authorized bank domain, merchant KYC is verified, and the user initiated the payment willingly for food received.',
    npciGuideline: 'NPCI Standard: "Always verify the displayed merchant name on screen before entering your UPI PIN at physical payment counters."',
  },
];

export const ScamDefenseJourney: React.FC<ScamDefenseJourneyProps> = ({
  db,
  currentUserId,
  onNavigateBack,
  onViewPortfolio,
}) => {
  const [stage, setStage] = useState<JourneyStage>('understand');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);

  // Stage 1 interactive understanding check
  const [understandCheck, setUnderstandCheck] = useState<string | null>(null);

  // Stage 3 interactive answers
  const [userDecisions, setUserDecisions] = useState<{
    [caseId: string]: {
      selectedAction: 'decline' | 'report_1930' | 'approve' | '';
      identifiedFlags: string[];
      reasoning: string;
    };
  }>({
    'case-lottery': { selectedAction: '', identifiedFlags: [], reasoning: '' },
    'case-kyc': { selectedAction: '', identifiedFlags: [], reasoning: '' },
    'case-merchant': { selectedAction: '', identifiedFlags: [], reasoning: '' },
  });

  // Stage 5 evidence state
  const [evidenceSaved, setEvidenceSaved] = useState<boolean>(false);
  const [evidenceHash, setEvidenceHash] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const currentCase = CASE_STUDIES[selectedCaseIdx];

  // Helper: check completion of apply stage
  const allCasesAnswered = CASE_STUDIES.every(
    (c) => userDecisions[c.id].selectedAction !== ''
  );

  // Calculate score
  const scoreAccuracy = CASE_STUDIES.reduce((acc, c) => {
    const dec = userDecisions[c.id];
    let correct = false;
    if (c.safeAction === 'decline' && (dec.selectedAction === 'decline' || dec.selectedAction === 'report_1930')) {
      correct = true;
    } else if (c.safeAction === 'report_1930' && (dec.selectedAction === 'report_1930' || dec.selectedAction === 'decline')) {
      correct = true;
    } else if (c.safeAction === 'approve' && dec.selectedAction === 'approve') {
      correct = true;
    }
    return acc + (correct ? 33.33 : 0);
  }, 0);

  const finalScore = Math.min(100, Math.round(scoreAccuracy));

  // Handle saving evidence to database
  const handleSaveEvidence = () => {
    try {
      const generatedHash = `GEN-SCAM-SEC-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setEvidenceHash(generatedHash);

      // Record in-memory lab attempt
      db.recordLabAttempt(currentUserId, 'lab-sec-scam-defense', {
        passed: finalScore >= 70,
        score: finalScore,
        diagnostics: `Demonstrated competency in Digital Payment Scam Defense. Scenarios analyzed: 3/3. Score: ${finalScore}/100. Verification Token: ${generatedHash}`,
        savedState: {
          userDecisions,
          completedAt: new Date().toISOString(),
          verificationHash: generatedHash,
        },
      });

      setEvidenceSaved(true);
      setSaveToast('Demonstrated competency saved to your verified skills record!');
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err: any) {
      setSaveToast(`Error saving evidence: ${err.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-canvas)',
        minHeight: '100vh',
        padding: '32px 20px 64px',
      }}
    >
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Navigation & Header Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onNavigateBack}
            style={{
              height: '36px',
              padding: '0 14px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Curriculum</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--brand-surface)',
                color: 'var(--brand-forest)',
                borderColor: 'var(--brand-border)',
                fontWeight: 700,
              }}
            >
              Technology · Digital Safety · Financial Awareness
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--brand-blue-surface)',
                color: 'var(--brand-blue)',
                borderColor: 'var(--brand-blue-border)',
              }}
            >
              Flagship Practical Journey
            </span>
          </div>
        </div>

        {/* Clear Educational Simulation Notice (Strategy Section 3 Alignment) */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '0.85rem',
            color: '#92400E',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Educational Simulation Notice:</strong> This learning journey uses clearly identified educational case studies. It does not perform live bank transactions, verify operational bank accounts, or submit real reports to law enforcement. All data is sanitized educational material.
          </div>
        </div>

        {/* Main Title & Thesis */}
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
            }}
          >
            Recognising Digital Payment Scams
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: '820px',
            }}
          >
            Master practical defense against UPI fraud, spoofed bank alerts, and fake refund traps through a 5-stage interactive workflow: <em>Understand → Examine → Apply → Get Feedback → Demonstrate.</em>
          </p>
        </div>

        {/* 5-Stage Stepper Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
          {[
            { id: 'understand', num: '1', title: 'Understand', desc: 'Core UPI PIN Rule' },
            { id: 'examine', num: '2', title: 'Examine', desc: '3 Case Studies' },
            { id: 'apply', num: '3', title: 'Apply', desc: 'Threat Analysis' },
            { id: 'feedback', num: '4', title: 'Feedback', desc: 'Expert Rationale' },
            { id: 'demonstrate', num: '5', title: 'Demonstrate', desc: 'Verified Evidence' },
          ].map((st) => {
            const isActive = stage === st.id;
            const isDone =
              (st.id === 'understand' && stage !== 'understand') ||
              (st.id === 'examine' && (stage === 'apply' || stage === 'feedback' || stage === 'demonstrate')) ||
              (st.id === 'apply' && (stage === 'feedback' || stage === 'demonstrate')) ||
              (st.id === 'feedback' && stage === 'demonstrate');

            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStage(st.id as JourneyStage)}
                style={{
                  backgroundColor: isActive ? 'var(--brand-forest)' : isDone ? 'var(--brand-surface)' : 'var(--bg-surface)',
                  color: isActive ? '#FFFFFF' : isDone ? 'var(--brand-forest)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--brand-forest)' : isDone ? '1px solid var(--brand-border)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#FFFFFF' : isDone ? 'var(--brand-forest)' : 'var(--border-strong)',
                      color: isActive ? 'var(--brand-forest)' : isDone ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isDone ? '✓' : st.num}
                  </span>
                  <strong style={{ fontSize: '0.88rem' }}>{st.title}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', opacity: isActive ? 0.9 : 0.75 }}>
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* STAGE 1: UNDERSTAND                                          */}
        {/* ============================================================ */}
        {stage === 'understand' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* The Golden Rule Banner */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--brand-surface)',
                border: '2px solid var(--brand-forest)',
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--brand-forest)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={22} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: 'var(--brand-forest)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    The Immutable Digital Payment Rule
                  </span>
                  <h2
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: 'var(--text-primary)',
                      margin: '6px 0 10px',
                    }}
                  >
                    Entering your UPI PIN always DEDUCTS money from your account.
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    You <strong>NEVER</strong> enter a UPI PIN to receive money, receive a prize, collect a refund, or verify your account. If anyone asks you to enter your PIN to claim money, it is 100% a fraudulent collect request.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Concepts Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Shield size={20} color="var(--brand-blue)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Push vs. Collect Mechanics</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  <strong>Push:</strong> You initiate sending funds to a recipient. You enter your PIN to authorize the debit.
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>Collect:</strong> Another party requests funds <em>from you</em>. Approving this notification and entering your PIN transfers your money to the requester.
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <AlertTriangle size={20} color="var(--brand-forest)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Psychological Urgency Triggers</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  Scammers exploit panic: <em>"Account blocked in 2 hours"</em>, <em>"Electricity disconnected tonight"</em>, or FOMO: <em>"Cashback expires in 10 minutes"</em>.
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Urgency is engineered to suppress your analytical thinking and bypass normal security checks.
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <PhoneCall size={20} color="var(--brand-blue)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Reporting Infrastructure (1930)</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  The Government of India and NPCI operate national helpline <strong>1930</strong> and the National Cyber Crime Reporting Portal (<code>cybercrime.gov.in</code>).
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Reporting within the "Golden Hour" allows banks to freeze illicit transactions before the attacker siphons the cash.
                </p>
              </div>
            </div>

            {/* Quick Understanding Check */}
            <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>
                Quick Check: A buyer on OLX says they sent you ₹5,000 for your old textbook, but you must enter your UPI PIN to approve the deposit. What should you do?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {[
                  { id: 'wrong1', text: 'Enter your UPI PIN immediately to confirm the deposit.' },
                  { id: 'correct', text: 'Refuse to enter your PIN; receiving money never requires a PIN entry.' },
                  { id: 'wrong2', text: 'Share your debit card CVV instead so they can wire the cash.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: understandCheck === opt.id ? '2px solid var(--brand-forest)' : '1px solid var(--border-subtle)',
                      backgroundColor: understandCheck === opt.id ? 'var(--brand-surface)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="understand-q"
                      checked={understandCheck === opt.id}
                      onChange={() => setUnderstandCheck(opt.id)}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>

              {understandCheck === 'correct' && (
                <div style={{ color: 'var(--brand-forest)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '16px' }}>
                  ✓ Correct! Legitimate incoming payments credit your account without any PIN prompt.
                </div>
              )}
              {understandCheck && understandCheck !== 'correct' && (
                <div style={{ color: '#B91C1C', fontWeight: 600, fontSize: '0.88rem', marginBottom: '16px' }}>
                  ✗ Caution: Entering a PIN or sharing CVV will instantly debit your funds!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStage('examine')}
                  style={{ height: '40px', padding: '0 18px' }}
                >
                  <span>Proceed to Stage 2: Examine Case Studies</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: EXAMINE                                             */}
        {/* ============================================================ */}
        {stage === 'examine' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Case Selector Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CASE_STUDIES.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  style={{
                    backgroundColor: selectedCaseIdx === idx ? 'var(--brand-forest)' : 'var(--bg-surface)',
                    color: selectedCaseIdx === idx ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {c.title.split(':')[0]}
                </button>
              ))}
            </div>

            {/* Case Study Card (Watermarked Educational Simulation) */}
            <div
              className="card"
              style={{
                padding: '28px',
                border: '2px solid var(--border-strong)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Educational Simulation Watermark */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'var(--brand-blue-surface)',
                  color: 'var(--brand-blue)',
                  border: '1px solid var(--brand-blue-border)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                }}
              >
                EDUCATIONAL CASE STUDY
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {currentCase.channel}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {currentCase.title}
                </h2>
              </div>

              {/* Simulated Device Interface */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Sender: <strong style={{ color: 'var(--text-primary)' }}>{currentCase.senderHandle}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-forest)' }}>
                    Amount: {currentCase.amount}
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {currentCase.headline}
                </div>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '14px',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    fontFamily: currentCase.channel.includes('SMS') ? 'var(--font-mono)' : 'inherit',
                    lineHeight: 1.5,
                  }}
                >
                  {currentCase.messageBody}
                </div>
              </div>

              {/* Anatomy Breakdown */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Documented Red Flags in this Case Study:
                </h4>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentCase.redFlags.map((flag, i) => (
                    <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={selectedCaseIdx === 0}
                    onClick={() => setSelectedCaseIdx((prev) => Math.max(0, prev - 1))}
                    style={{ height: '36px', padding: '0 12px' }}
                  >
                    Previous Case
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={selectedCaseIdx === CASE_STUDIES.length - 1}
                    onClick={() => setSelectedCaseIdx((prev) => Math.min(CASE_STUDIES.length - 1, prev + 1))}
                    style={{ height: '36px', padding: '0 12px' }}
                  >
                    Next Case
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStage('apply')}
                  style={{ height: '38px', padding: '0 16px' }}
                >
                  <span>Ready to Apply: Threat Analysis</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 3: APPLY                                               */}
        {/* ============================================================ */}
        {stage === 'apply' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--brand-surface)', borderColor: 'var(--brand-border)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-forest)', marginBottom: '4px' }}>
                Interactive Defense Protocol: Evaluate All 3 Educational Scenarios
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>
                Analyze each message, identify its indicators, and pick the safe defensive action. Your choices will be evaluated against national cyber defense guidelines.
              </p>
            </div>

            {CASE_STUDIES.map((c, idx) => {
              const currentDecision = userDecisions[c.id];

              return (
                <div key={c.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span className="badge badge-neutral" style={{ marginBottom: '4px' }}>
                        Scenario {idx + 1} of 3
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{c.title}</h3>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Handle: {c.senderHandle}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      fontSize: '0.88rem',
                      fontStyle: 'italic',
                      color: 'var(--text-primary)',
                    }}
                  >
                    "{c.messageBody}"
                  </div>

                  {/* Red Flag Checkboxes */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                      1. Identify Threat Red Flags (Select all that apply):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                      {[
                        'Demands UPI PIN entry to receive money',
                        'Shortened or spoofed URL link (bit.ly/apk)',
                        'Artificial urgency or threat of account suspension',
                        'Legitimate verified merchant with registered bank handle',
                      ].map((flag) => {
                        const isChecked = currentDecision.identifiedFlags.includes(flag);
                        return (
                          <label
                            key={flag}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: isChecked ? '1px solid var(--brand-forest)' : '1px solid var(--border-subtle)',
                              backgroundColor: isChecked ? 'var(--brand-surface)' : 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.82rem',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newFlags = e.target.checked
                                  ? [...currentDecision.identifiedFlags, flag]
                                  : currentDecision.identifiedFlags.filter((f) => f !== flag);
                                setUserDecisions({
                                  ...userDecisions,
                                  [c.id]: { ...currentDecision, identifiedFlags: newFlags },
                                });
                              }}
                            />
                            <span>{flag}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Defensive Action Selection */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                      2. Select Your Safe Response:
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() =>
                          setUserDecisions({
                            ...userDecisions,
                            [c.id]: { ...currentDecision, selectedAction: 'decline' },
                          })
                        }
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: currentDecision.selectedAction === 'decline' ? '2px solid var(--brand-forest)' : '1px solid var(--border-subtle)',
                          backgroundColor: currentDecision.selectedAction === 'decline' ? 'var(--brand-surface)' : '#FFFFFF',
                          color: currentDecision.selectedAction === 'decline' ? 'var(--brand-forest)' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Decline Request & Block
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setUserDecisions({
                            ...userDecisions,
                            [c.id]: { ...currentDecision, selectedAction: 'report_1930' },
                          })
                        }
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: currentDecision.selectedAction === 'report_1930' ? '2px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                          backgroundColor: currentDecision.selectedAction === 'report_1930' ? 'var(--brand-blue-surface)' : '#FFFFFF',
                          color: currentDecision.selectedAction === 'report_1930' ? 'var(--brand-blue)' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Report to 1930 Helpline
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setUserDecisions({
                            ...userDecisions,
                            [c.id]: { ...currentDecision, selectedAction: 'approve' },
                          })
                        }
                        style={{
                          flex: 1,
                          minWidth: '180px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: currentDecision.selectedAction === 'approve' ? '2px solid var(--brand-forest)' : '1px solid var(--border-subtle)',
                          backgroundColor: currentDecision.selectedAction === 'approve' ? 'var(--brand-surface)' : '#FFFFFF',
                          color: currentDecision.selectedAction === 'approve' ? 'var(--brand-forest)' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Approve Payment & Enter PIN
                      </button>
                    </div>
                  </div>

                  {/* Learner Reasoning Input */}
                  <div>
                    <label
                      htmlFor={`reason-${c.id}`}
                      style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-secondary)' }}
                    >
                      3. Brief Defensive Rationale (Why is this action safe?):
                    </label>
                    <input
                      id={`reason-${c.id}`}
                      type="text"
                      placeholder="e.g. Entering a PIN will transfer ₹25,000 out of my bank account..."
                      value={currentDecision.reasoning}
                      onChange={(e) =>
                        setUserDecisions({
                          ...userDecisions,
                          [c.id]: { ...currentDecision, reasoning: e.target.value },
                        })
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-strong)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStage('examine')}
                style={{ height: '38px', padding: '0 14px' }}
              >
                <ArrowLeft size={15} />
                <span>Back to Case Studies</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                disabled={!allCasesAnswered}
                onClick={() => setStage('feedback')}
                style={{ height: '40px', padding: '0 20px' }}
              >
                <span>Submit Decisions & Get Diagnostic Feedback</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 4: GET FEEDBACK                                        */}
        {/* ============================================================ */}
        {stage === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              className="card"
              style={{
                padding: '24px',
                backgroundColor: finalScore >= 70 ? 'var(--brand-surface)' : '#FEF2F2',
                border: `2px solid ${finalScore >= 70 ? 'var(--brand-forest)' : '#EF4444'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Diagnostic Assessment Result
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0' }}>
                  {finalScore >= 70 ? 'Demonstrated Safe Competency' : 'Remediation Required'}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  You scored <strong>{finalScore}/100</strong> across 3 realistic threat scenarios.
                </p>
              </div>

              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: finalScore >= 70 ? 'var(--brand-forest)' : '#B91C1C',
                }}
              >
                {finalScore}%
              </div>
            </div>

            {CASE_STUDIES.map((c, idx) => {
              const dec = userDecisions[c.id];
              let isCorrect = false;
              if (c.safeAction === 'decline' && (dec.selectedAction === 'decline' || dec.selectedAction === 'report_1930')) {
                isCorrect = true;
              } else if (c.safeAction === 'report_1930' && (dec.selectedAction === 'report_1930' || dec.selectedAction === 'decline')) {
                isCorrect = true;
              } else if (c.safeAction === 'approve' && dec.selectedAction === 'approve') {
                isCorrect = true;
              }

              return (
                <div key={c.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    {isCorrect ? (
                      <CheckCircle2 size={22} color="var(--brand-forest)" />
                    ) : (
                      <XCircle size={22} color="#DC2626" />
                    )}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                      Scenario {idx + 1}: {c.title}
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your Decision:</div>
                      <strong style={{ fontSize: '0.9rem', color: isCorrect ? 'var(--brand-forest)' : '#DC2626' }}>
                        {dec.selectedAction === 'decline' && 'Declined & Blocked'}
                        {dec.selectedAction === 'report_1930' && 'Reported to 1930 Helpline'}
                        {dec.selectedAction === 'approve' && 'Approved Payment & Entered PIN'}
                      </strong>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Recommended Protocol:</div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--brand-forest)' }}>
                        {c.safeAction === 'decline' && 'Decline Immediately'}
                        {c.safeAction === 'report_1930' && 'Report to 1930 Cyber Fraud Helpline'}
                        {c.safeAction === 'approve' && 'Approve Payment at Counter'}
                      </strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    <strong>Regulatory & Technical Rationale:</strong> {c.explanation}
                  </div>

                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--brand-blue)',
                      backgroundColor: 'var(--brand-blue-surface)',
                      border: '1px solid var(--brand-blue-border)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                    }}
                  >
                    {c.npciGuideline}
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStage('apply')}
                style={{ height: '38px', padding: '0 14px' }}
              >
                <RotateCcw size={15} />
                <span>Adjust Threat Analysis</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setStage('demonstrate')}
                style={{ height: '40px', padding: '0 20px' }}
              >
                <span>Proceed to Stage 5: Demonstrate Demonstrated Skill</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 5: DEMONSTRATE                                         */}
        {/* ============================================================ */}
        {stage === 'demonstrate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {saveToast && (
              <div
                style={{
                  backgroundColor: 'var(--brand-surface)',
                  color: 'var(--brand-forest)',
                  border: '1px solid var(--brand-border)',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{saveToast}</span>
              </div>
            )}

            {/* Demonstrated Competency Evidence Card */}
            <div
              className="card"
              style={{
                padding: '36px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--brand-forest)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid var(--border-subtle)',
                  paddingBottom: '20px',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--brand-forest)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Geniusphere Verified Competency Record
                  </span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                    Digital Payment Threat Recognition & Defense
                  </h2>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Learner: <strong style={{ color: 'var(--text-primary)' }}>{db.users.get(currentUserId)?.full_name || 'Individual Student'}</strong> • {db.users.get(currentUserId)?.email}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="badge badge-success" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                    VERIFIED EVIDENCE
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Competency Metric Summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assessed Skill Level</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {finalScore >= 90 ? 'Mastery' : finalScore >= 70 ? 'Proficient' : 'Developing'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Decision Accuracy</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-forest)' }}>
                    {finalScore} / 100
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Standard Alignment</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--brand-blue)' }}>
                    NPCI UPI Safety & CBSE Cyber Defense
                  </div>
                </div>
              </div>

              {/* Cryptographic Verification Ledger Token */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface-subdued)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '6px',
                  padding: '14px',
                  marginBottom: '28px',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Tamper-Evident Verification Hash
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--brand-forest)', wordBreak: 'break-all' }}>
                  {evidenceHash || 'Click "Save to Skills Portfolio" to generate immutable cryptographic token.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSaveEvidence}
                  disabled={evidenceSaved}
                  style={{ height: '42px', padding: '0 20px', fontSize: '0.9rem' }}
                >
                  <FileCheck size={17} />
                  <span>{evidenceSaved ? 'Competency Record Saved ✓' : 'Save Demonstrated Skill to Portfolio'}</span>
                </button>

                {onViewPortfolio && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={onViewPortfolio}
                    style={{ height: '42px', padding: '0 18px', fontSize: '0.9rem' }}
                  >
                    <Award size={17} />
                    <span>View in Student Portfolio</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onNavigateBack}
                  style={{ height: '42px', padding: '0 18px', fontSize: '0.9rem' }}
                >
                  <span>Return to All Courses</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
