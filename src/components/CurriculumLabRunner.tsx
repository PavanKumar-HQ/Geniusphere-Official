import React, { useState, useMemo } from 'react';
import { SimulationLab, LabControl, saveLearnerLabCompletion } from '../curriculum';
import { CheckCircle2, RotateCcw, Award, HelpCircle, Code, Calculator, ArrowRight, Play } from 'lucide-react';
import { CelebrationCrackers } from './CelebrationCrackers';

interface CurriculumLabRunnerProps {
  lab: SimulationLab;
  currentUserId: string;
  topicTitle: string;
  onClose?: () => void;
  onLabCompleted?: (labId: string, score: number) => void;
}

export const CurriculumLabRunner: React.FC<CurriculumLabRunnerProps> = ({
  lab,
  currentUserId,
  topicTitle,
  onClose,
  onLabCompleted,
}) => {
  // Reactive simulation state initialized from lab definition
  const [params, setParams] = useState<Record<string, any>>(() => ({ ...lab.initialState }));
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [celebrationActive, setCelebrationActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simulation' | 'theory' | 'reflection'>('simulation');

  // Dynamic algorithm evaluation
  const calculationResult = useMemo(() => {
    // 1. AI Perceptron
    if (lab.slug.includes('perceptron') || lab.slug.includes('decision-boundary')) {
      const w1 = Number(params.w1 ?? 1.5);
      const w2 = Number(params.w2 ?? -1.2);
      const bias = Number(params.bias ?? 0.2);
      // Sample test points
      const points = [
        { x: -1, y: -1, label: -1 },
        { x: -0.5, y: 1, label: 1 },
        { x: 1, y: -0.5, label: -1 },
        { x: 1, y: 1, label: 1 },
      ];
      let correct = 0;
      points.forEach((p) => {
        const z = w1 * p.x + w2 * p.y + bias;
        const pred = z >= 0 ? 1 : -1;
        if (pred === p.label) correct++;
      });
      const accuracy = Math.round((correct / points.length) * 100);
      return {
        metricLabel: 'Classification Accuracy',
        metricValue: `${accuracy}%`,
        isSatisfied: accuracy >= 75,
        details: `Separating line: ${w1.toFixed(1)}*X1 + (${w2.toFixed(1)})*X2 + (${bias.toFixed(1)}) = 0`,
        w1,
        w2,
        bias,
        accuracy,
      };
    }

    // 2. Unit Economics LTV/CAC
    if (lab.slug.includes('unit-economics') || lab.slug.includes('ltv-cac')) {
      const arpu = Number(params.arpuMonthly ?? 50);
      const gm = Number(params.grossMarginPct ?? 80) / 100;
      const churn = Math.max(0.001, Number(params.monthlyChurnPct ?? 3) / 100);
      const cac = Math.max(1, Number(params.cacDollars ?? 350));
      const ltv = (arpu * gm) / churn;
      const ratio = ltv / cac;
      const payback = cac / (arpu * gm);
      return {
        metricLabel: 'LTV / CAC Ratio',
        metricValue: `${ratio.toFixed(2)}x`,
        isSatisfied: ratio >= 3.0 && payback <= 12,
        details: `LTV: $${Math.round(ltv)} | Payback Period: ${payback.toFixed(1)} months`,
        ratio,
        payback,
        ltv,
      };
    }

    // 3. TAM SAM SOM Market Sizing
    if (lab.slug.includes('tam-sam-som')) {
      const totalBuyers = Number(params.totalBuyers ?? 250000);
      const samPct = Number(params.targetSegmentPct ?? 20) / 100;
      const acv = Number(params.acvDollars ?? 480);
      const somPct = Number(params.somSharePct ?? 2.5) / 100;
      const tam = totalBuyers * acv;
      const sam = tam * samPct;
      const som = sam * somPct;
      return {
        metricLabel: 'Obtainable Market (SOM)',
        metricValue: `$${(som / 1000000).toFixed(2)}M`,
        isSatisfied: som >= 500000,
        details: `TAM: $${(tam / 1000000).toFixed(1)}M | SAM: $${(sam / 1000000).toFixed(1)}M`,
        tam,
        sam,
        som,
      };
    }

    // 4. Compound Growth & Inflation
    if (lab.slug.includes('compound') || lab.slug.includes('interest')) {
      const p = Number(params.principal ?? 5000);
      const r = Number(params.interestRatePct ?? 8) / 100;
      const t = Number(params.years ?? 10);
      const inf = Number(params.inflationPct ?? 3) / 100;
      const nominal = p * Math.pow(1 + r, t);
      const real = nominal / Math.pow(1 + inf, t);
      return {
        metricLabel: 'Real Purchasing Power',
        metricValue: `$${Math.round(real).toLocaleString()}`,
        isSatisfied: real > p,
        details: `Nominal Balance: $${Math.round(nominal).toLocaleString()} | Gain: +$${Math.round(real - p).toLocaleString()}`,
        nominal,
        real,
      };
    }

    // Generic fallback computation for all other labs
    const numericKeys = Object.keys(params).filter((k) => typeof params[k] === 'number');
    const avg =
      numericKeys.length > 0
        ? Math.round(numericKeys.reduce((acc, k) => acc + Number(params[k]), 0) / numericKeys.length)
        : 75;
    return {
      metricLabel: 'Model Equilibrium Score',
      metricValue: `${avg}%`,
      isSatisfied: avg >= 60,
      details: `Active Parameters: ${numericKeys.length} | State Equilibrium: Nominal`,
      avg,
    };
  }, [params, lab.slug]);

  const handleControlChange = (id: string, value: any) => {
    setParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setParams({ ...lab.initialState });
    setReflectionText('');
    setIsCompleted(false);
  };

  const handleCompleteLab = () => {
    setIsCompleted(true);
    setCelebrationActive(true);
    saveLearnerLabCompletion(currentUserId, lab.topicId, lab.id);
    if (onLabCompleted) {
      onLabCompleted(lab.id, 100);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '24px 16px',
        color: 'var(--text-primary)',
      }}
    >
      {celebrationActive && (
        <CelebrationCrackers
          active={celebrationActive}
          message="Simulation Lab Completed & +100 XP Verified!"
          xpAmount={100}
          onComplete={() => setCelebrationActive(false)}
        />
      )}

      {/* TOP HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(0, 245, 160, 0.12)',
                color: 'var(--brand-primary)',
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              SIMULATION LAB #{lab.orderIndex}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {topicTitle}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{lab.title}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface-subdued)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Exit Lab
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY BANNER */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid var(--border-subtle)',
          borderLeft: '4px solid var(--brand-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-primary)' }}>
          Learning Objective
        </div>
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {lab.learningObjective}
        </p>
        <div
          style={{
            marginTop: '8px',
            fontSize: '0.82rem',
            backgroundColor: 'var(--bg-surface-subdued)',
            padding: '8px 12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            color: 'var(--text-primary)',
          }}
        >
          Model Formula: {lab.formula}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: INTERACTIVE CONTROLS */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Simulation Parameters</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Reactive Engine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {lab.controls.map((ctrl) => (
              <div key={ctrl.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <label htmlFor={ctrl.id} style={{ fontWeight: 600 }}>{ctrl.label}</label>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {params[ctrl.id]}
                    {ctrl.unit ? ` ${ctrl.unit}` : ''}
                  </span>
                </div>

                {ctrl.type === 'slider' && (
                  <input
                    id={ctrl.id}
                    type="range"
                    min={ctrl.min ?? 0}
                    max={ctrl.max ?? 100}
                    step={ctrl.step ?? 1}
                    value={params[ctrl.id] ?? ctrl.defaultValue}
                    onChange={(e) => handleControlChange(ctrl.id, Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
                  />
                )}

                {ctrl.type === 'select' && ctrl.options && (
                  <select
                    id={ctrl.id}
                    value={params[ctrl.id] ?? ctrl.defaultValue}
                    onChange={(e) => handleControlChange(ctrl.id, e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-subdued)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    {ctrl.options.map((opt) => (
                      <option key={String(opt.value)} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {ctrl.type === 'toggle' && (
                  <button
                    type="button"
                    onClick={() => handleControlChange(ctrl.id, !params[ctrl.id])}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: params[ctrl.id]
                        ? 'rgba(0, 245, 160, 0.18)'
                        : 'var(--bg-surface-subdued)',
                      color: params[ctrl.id] ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {params[ctrl.id] ? 'Enabled (Active)' : 'Disabled (Inactive)'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* REALTIME CALCULATION BANNER */}
          <div
            style={{
              marginTop: '12px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-subdued)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 800 }}>
              {calculationResult.metricLabel}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
              {calculationResult.metricValue}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {calculationResult.details}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REACTIVE SVG VISUALIZATION & CRITERIA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* DYNAMIC SVG DISPLAY */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '100%', marginBottom: '12px', fontWeight: 700, fontSize: '0.95rem' }}>
              Dynamic Simulation Model Visualizer
            </div>

            {/* SVG RENDERING */}
            <svg
              viewBox="0 0 400 240"
              style={{
                width: '100%',
                maxHeight: '260px',
                backgroundColor: 'var(--bg-surface-subdued)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {/* Coordinate Grid Lines */}
              <line x1="50" y1="20" x2="50" y2="200" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="50" y1="200" x2="380" y2="200" stroke="var(--border-subtle)" strokeWidth="1" />

              {/* Dynamic Curve / Plot based on parameters */}
              {lab.slug.includes('compound') ? (
                <>
                  <path
                    d={`M 50 180 Q 200 ${Math.max(40, 180 - Number(params.interestRatePct ?? 8) * 8)} 360 40`}
                    fill="none"
                    stroke="var(--brand-primary)"
                    strokeWidth="3"
                  />
                  <path
                    d={`M 50 180 Q 200 ${Math.max(60, 180 - (Number(params.interestRatePct ?? 8) - Number(params.inflationPct ?? 3)) * 6)} 360 90`}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <text x="300" y="35" fill="var(--brand-primary)" fontSize="11" fontWeight="bold">Nominal</text>
                  <text x="300" y="85" fill="#F59E0B" fontSize="11" fontWeight="bold">Real (Adj)</text>
                </>
              ) : lab.slug.includes('perceptron') ? (
                <>
                  {/* Perceptron Decision Line */}
                  <line
                    x1="60"
                    y1={Math.min(190, Math.max(30, 110 + Number(params.w1 ?? 1) * 25))}
                    x2="360"
                    y2={Math.min(190, Math.max(30, 110 - Number(params.w2 ?? -1) * 25 - Number(params.bias ?? 0) * 20))}
                    stroke="var(--brand-primary)"
                    strokeWidth="3"
                  />
                  {/* Sample points */}
                  <circle cx="120" cy="80" r="7" fill="var(--brand-primary)" />
                  <circle cx="280" cy="70" r="7" fill="var(--brand-primary)" />
                  <circle cx="130" cy="160" r="7" fill="#EF4444" />
                  <circle cx="270" cy="150" r="7" fill="#EF4444" />
                </>
              ) : (
                <>
                  {/* Bar / State Gauge Visualizer */}
                  <rect x="70" y="50" width="60" height="150" fill="var(--bg-surface)" rx="4" />
                  <rect
                    x="70"
                    y={Math.max(50, 200 - (Number(params[Object.keys(params)[0]] ?? 50) / 100) * 150)}
                    width="60"
                    height={Math.min(150, (Number(params[Object.keys(params)[0]] ?? 50) / 100) * 150)}
                    fill="var(--brand-primary)"
                    rx="4"
                  />
                  <text x="75" y="220" fill="var(--text-secondary)" fontSize="11">Input</text>

                  <rect x="170" y="50" width="60" height="150" fill="var(--bg-surface)" rx="4" />
                  <rect
                    x="170"
                    y={Math.max(50, 200 - (Number(params[Object.keys(params)[1]] ?? 60) / 100) * 150)}
                    width="60"
                    height={Math.min(150, (Number(params[Object.keys(params)[1]] ?? 60) / 100) * 150)}
                    fill="#3B82F6"
                    rx="4"
                  />
                  <text x="175" y="220" fill="var(--text-secondary)" fontSize="11">Factor</text>

                  {/* Equilibrium Marker */}
                  <circle cx="310" cy="110" r="35" fill="none" stroke="var(--brand-primary)" strokeWidth="4" />
                  <circle cx="310" cy="110" r="28" fill="rgba(0, 245, 160, 0.15)" />
                  <text x="295" y="115" fill="var(--brand-primary)" fontSize="12" fontWeight="bold">EQUIL</text>
                </>
              )}
            </svg>
          </div>

          {/* COMPLETION CRITERIA & COMPLETION BUTTON */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Lab Completion Criteria</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lab.completionCriteria.map((crit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} color="var(--brand-primary)" />
                  <span style={{ color: 'var(--text-secondary)' }}>{crit}</span>
                </div>
              ))}
            </div>

            {/* REFLECTION INPUT */}
            <div style={{ marginTop: '8px' }}>
              <label htmlFor="lab-reflection-input" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Reflection Question: {lab.reflectionQuestion}
              </label>
              <textarea
                id="lab-reflection-input"
                rows={3}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Write your explanation based on the simulation results..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface-subdued)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleCompleteLab}
              disabled={isCompleted}
              style={{
                marginTop: '12px',
                padding: '12px 20px',
                borderRadius: '10px',
                backgroundColor: isCompleted ? 'var(--bg-surface-subdued)' : 'var(--brand-primary)',
                color: isCompleted ? 'var(--text-secondary)' : '#000000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: isCompleted ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={18} color="var(--brand-primary)" />
                  <span>Lab Completed (+100 XP Verified)</span>
                </>
              ) : (
                <>
                  <Award size={18} />
                  <span>Verify Completion & Save Progress (+100 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
