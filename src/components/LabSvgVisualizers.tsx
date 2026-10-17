import React from 'react';
import { Shield, Lock, Server, Database, Smartphone, Globe, Check, AlertTriangle, Wind } from 'lucide-react';

// ====================================================================
// 1. NEURAL NETWORK VISUALIZER (Lab T1: AI Classifier)
// ====================================================================
interface NeuralNetworkSvgProps {
  keywordDensity: number;
  urgencyScore: number;
  senderReputation: number;
  predictedLabel: 'Phishing' | 'Suspicious' | 'Legitimate';
  confidenceScore: number;
}

export const NeuralNetworkSvg: React.FC<NeuralNetworkSvgProps> = ({
  keywordDensity,
  urgencyScore,
  senderReputation,
  predictedLabel,
  confidenceScore,
}) => {
  const isPhish = predictedLabel === 'Phishing';
  const isSuspicious = predictedLabel === 'Suspicious';

  const in1Weight = Math.min(1, keywordDensity / 100);
  const in2Weight = Math.min(1, urgencyScore / 100);
  const in3Weight = Math.min(1, (100 - senderReputation) / 100);

  const inputNodes = [
    { label: 'KW Density', val: `${keywordDensity}%`, w: in1Weight, y: 35 },
    { label: 'Urgency', val: `${urgencyScore}`, w: in2Weight, y: 95 },
    { label: 'Domain Rep', val: `${senderReputation}`, w: in3Weight, y: 155 },
  ];

  const hiddenNodes = [
    { y: 30, w: (in1Weight * 0.7 + in2Weight * 0.3) },
    { y: 75, w: (in2Weight * 0.5 + in3Weight * 0.5) },
    { y: 120, w: (in1Weight * 0.4 + in3Weight * 0.6) },
    { y: 165, w: (in2Weight * 0.8 + in1Weight * 0.2) },
  ];

  const outputNodes = [
    { label: 'PHISH', active: isPhish, color: '#B91C1C', y: 65 },
    { label: 'LEGIT', active: !isPhish && !isSuspicious, color: '#15803D', y: 130 },
  ];

  return (
    <div style={{ width: '100%', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
          Interactive Neural Weights & Activation Flow
        </div>
        <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          Confidence: {confidenceScore}%
        </div>
      </div>

      <svg viewBox="0 0 540 195" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Layer 1 to Layer 2 Connections */}
        {inputNodes.map((inNode, i) =>
          hiddenNodes.map((hidNode, j) => {
            const activeWeight = (inNode.w + hidNode.w) / 2;
            return (
              <line
                key={`in-hid-${i}-${j}`}
                x1="90"
                y1={inNode.y}
                x2="260"
                y2={hidNode.y}
                stroke={isPhish ? '#EF4444' : isSuspicious ? '#F59E0B' : '#30B2E7'}
                strokeWidth={Math.max(1, activeWeight * 3)}
                strokeOpacity={Math.max(0.12, activeWeight * 0.65)}
              />
            );
          })
        )}

        {/* Layer 2 to Layer 3 Connections */}
        {hiddenNodes.map((hidNode, i) =>
          outputNodes.map((outNode, j) => (
            <line
              key={`hid-out-${i}-${j}`}
              x1="280"
              y1={hidNode.y}
              x2="450"
              y2={outNode.y}
              stroke={outNode.active ? outNode.color : '#94A3B8'}
              strokeWidth={outNode.active ? 2.5 : 0.8}
              strokeOpacity={outNode.active ? 0.75 : 0.15}
            />
          ))
        )}

        {/* Input Layer Nodes */}
        {inputNodes.map((node, i) => (
          <g key={`in-node-${i}`}>
            <circle cx="80" cy={node.y} r="16" fill="var(--bg-surface)" stroke="var(--brand-primary)" strokeWidth="2.5" />
            <text x="80" y={node.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text-primary)">
              x{i + 1}
            </text>
            <text x="60" y={node.y + 3} textAnchor="end" fontSize="10.5" fontWeight="600" fill="var(--text-secondary)">
              {node.label}
            </text>
          </g>
        ))}

        {/* Hidden Layer Nodes */}
        {hiddenNodes.map((node, j) => (
          <g key={`hid-node-${j}`}>
            <circle
              cx="270"
              cy={node.y}
              r="12"
              fill={isPhish ? 'rgba(239, 68, 68, 0.15)' : 'rgba(48, 178, 231, 0.15)'}
              stroke={isPhish ? '#EF4444' : '#30B2E7'}
              strokeWidth="2"
            />
            <circle cx="270" cy={node.y} r="4" fill={isPhish ? '#EF4444' : '#30B2E7'} />
          </g>
        ))}

        {/* Output Layer Nodes */}
        {outputNodes.map((node, k) => (
          <g key={`out-node-${k}`}>
            <circle
              cx="460"
              cy={node.y}
              r="18"
              fill={node.active ? node.color : 'var(--bg-surface)'}
              stroke={node.color}
              strokeWidth={node.active ? 3 : 1.5}
            />
            <text
              x="460"
              y={node.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={node.active ? '#FFFFFF' : 'var(--text-muted)'}
            >
              {k === 0 ? 'P' : 'L'}
            </text>
            <text x="485" y={node.y + 4} textAnchor="start" fontSize="11" fontWeight="700" fill={node.active ? node.color : 'var(--text-muted)'}>
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ====================================================================
// 2. BLOCKCHAIN INTER-BLOCK CHAIN LINK (Lab T2: Blockchain Builder)
// ====================================================================
interface BlockchainChainLinkProps {
  isValid: boolean;
  prevHashPreview: string;
}

export const BlockchainChainLinkSvg: React.FC<BlockchainChainLinkProps> = ({ isValid, prevHashPreview }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0', gap: '10px' }}>
      <div style={{ flex: 1, height: '2px', backgroundColor: isValid ? 'var(--success-border)' : 'var(--danger-border)' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          backgroundColor: isValid ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `1px solid ${isValid ? 'var(--success-border)' : 'var(--danger-border)'}`,
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
          color: isValid ? 'var(--success)' : 'var(--danger)',
          fontWeight: 700,
        }}
      >
        {isValid ? <Lock size={12} /> : <AlertTriangle size={12} />}
        <span>{isValid ? `✓ Cryptographic Link Verified: ${prevHashPreview}` : `✕ Hash Mismatch: Tampered Chain Link`}</span>
      </div>
      <div style={{ flex: 1, height: '2px', backgroundColor: isValid ? 'var(--success-border)' : 'var(--danger-border)' }} />
    </div>
  );
};

// ====================================================================
// 3. IOT SENSOR DIAL GAUGE & ACTUATOR FAN (Lab T3: IoT Simulator)
// ====================================================================
interface IotSensorDialProps {
  currentTemp: number;
  threshold: number;
  humidity: number;
}

export const IotSensorDialSvg: React.FC<IotSensorDialProps> = ({ currentTemp, threshold, humidity }) => {
  const isAlarm = currentTemp >= threshold;

  // Map 15°C - 50°C to angle range -120deg to +120deg (240 deg total)
  const minTemp = 15;
  const maxTemp = 50;
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, currentTemp));
  const needleAngle = -120 + ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 240;
  const thresholdAngle = -120 + ((threshold - minTemp) / (maxTemp - minTemp)) * 240;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', padding: '16px', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      {/* Gauge Visualizer */}
      <div style={{ textAlign: 'center' }}>
        <svg width="170" height="110" viewBox="0 0 170 110">
          {/* Background Arc */}
          <path d="M 25 95 A 60 60 0 1 1 145 95" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
          {/* Active Color Arc */}
          <path
            d="M 25 95 A 60 60 0 1 1 145 95"
            fill="none"
            stroke={isAlarm ? 'var(--danger)' : '#30B2E7'}
            strokeWidth="12"
            strokeDasharray="210"
            strokeDashoffset={210 - (210 * ((clampedTemp - minTemp) / (maxTemp - minTemp)))}
            strokeLinecap="round"
          />

          {/* Needle */}
          <g transform={`translate(85, 95) rotate(${needleAngle})`}>
            <polygon points="-3,-10 3,-10 1,-54 -1,-54" fill={isAlarm ? 'var(--danger)' : '#172B4D'} />
            <circle cx="0" cy="0" r="7" fill={isAlarm ? 'var(--danger)' : 'var(--brand-primary)'} />
          </g>

          {/* Threshold Tick Mark */}
          <g transform={`translate(85, 95) rotate(${thresholdAngle})`}>
            <line x1="0" y1="-62" x2="0" y2="-72" stroke="#B45309" strokeWidth="2.5" />
          </g>

          <text x="85" y="85" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--text-primary)">
            {currentTemp}°C
          </text>
          <text x="85" y="102" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-muted)">
            Threshold: {threshold}°C
          </text>
        </svg>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '-4px' }}>
          Real-Time Sensor Thermometer
        </div>
      </div>

      {/* Actuator State Visual */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: isAlarm ? 'var(--danger-bg)' : 'var(--bg-surface)',
            border: `2px solid ${isAlarm ? 'var(--danger)' : 'var(--border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Wind
            size={32}
            color={isAlarm ? 'var(--danger)' : 'var(--text-muted)'}
            style={{
              animation: isAlarm ? 'spin 1.2s linear infinite' : 'none',
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isAlarm ? 'var(--danger)' : 'var(--text-primary)' }}>
            {isAlarm ? 'COOLING ACTUATOR ENGAGED' : 'IDLE / AMBIENT'}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Telemetry: {humidity}% RH • MQTT Active
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 4. PRIVACY RADAR EXPOSURE (Lab T4: Digital Privacy Decision)
// ====================================================================
interface PrivacyRadarProps {
  location: boolean;
  contacts: boolean;
  mic: boolean;
  adTracking: boolean;
  exposureScore: number;
}

export const PrivacyRadarSvg: React.FC<PrivacyRadarProps> = ({ location, contacts, mic, adTracking, exposureScore }) => {
  const isSafe = exposureScore <= 25;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', padding: '16px', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <svg width="180" height="180" viewBox="0 0 200 200">
        {/* Radar Concentric Circles */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="30" fill="rgba(21, 128, 61, 0.1)" stroke="var(--success)" strokeWidth="2" />

        {/* Center device */}
        <circle cx="100" cy="100" r="8" fill="var(--brand-primary)" />

        {/* Data Beacons */}
        {/* Location Beacon */}
        <circle
          cx={location ? 165 : 100}
          cy={location ? 55 : 85}
          r="6"
          fill={location ? 'var(--danger)' : 'var(--success)'}
        />
        <text x={location ? 165 : 100} y={location ? 45 : 80} fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--text-secondary)">
          GPS
        </text>

        {/* Contacts Beacon */}
        <circle
          cx={contacts ? 45 : 88}
          cy={contacts ? 70 : 100}
          r="6"
          fill={contacts ? 'var(--danger)' : 'var(--success)'}
        />
        <text x={contacts ? 45 : 88} y={contacts ? 60 : 96} fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--text-secondary)">
          Contacts
        </text>

        {/* Microphone Beacon */}
        <circle
          cx={mic ? 155 : 112}
          cy={mic ? 145 : 105}
          r="6"
          fill={mic ? 'var(--danger)' : 'var(--success)'}
        />
        <text x={mic ? 155 : 112} y={mic ? 160 : 118} fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--text-secondary)">
          Mic
        </text>

        {/* Ad Tracking Beacon */}
        <circle
          cx={adTracking ? 50 : 100}
          cy={adTracking ? 140 : 115}
          r="6"
          fill={adTracking ? 'var(--danger)' : 'var(--success)'}
        />
        <text x={adTracking ? 50 : 100} y={adTracking ? 155 : 126} fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--text-secondary)">
          Ads
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          PERIMETER RADAR ZONES
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <span>Core Zone: Encrypted On-Device Only</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
          <span>Middle Zone: Cloud Service Backups</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
          <span>Outer Perimeter: Ad Networks & Third Parties</span>
        </div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSafe ? 'var(--success)' : 'var(--danger)', marginTop: '4px' }}>
          Status: {isSafe ? '✓ Exposure Safely Minimized' : '⚠ Significant Data Leakage Detected'}
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 5. DEFENSIVE WEB SECURITY PIPELINE (Lab T5: Defensive Security)
// ====================================================================
interface SecurityPipelineProps {
  paramQueries: boolean;
  outputEncoding: boolean;
  strictCsp: boolean;
}

export const SecurityPipelineSvg: React.FC<SecurityPipelineProps> = ({ paramQueries, outputEncoding, strictCsp }) => {
  const isSecure = paramQueries && outputEncoding;

  return (
    <div style={{ padding: '16px', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Defensive Interception Pipeline
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
        {/* Stage 1: Request */}
        <div style={{ padding: '12px 6px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <Smartphone size={20} color="var(--brand-primary)" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>1. Client HTTP</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Untrusted Payload</div>
        </div>

        {/* Stage 2: WAF & CSP */}
        <div style={{ padding: '12px 6px', borderRadius: '8px', backgroundColor: strictCsp ? 'var(--success-bg)' : 'var(--bg-surface)', border: `1px solid ${strictCsp ? 'var(--success-border)' : 'var(--border-subtle)'}` }}>
          <Shield size={20} color={strictCsp ? 'var(--success)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: strictCsp ? 'var(--success)' : 'var(--text-primary)' }}>2. WAF & CSP</div>
          <div style={{ fontSize: '0.68rem', color: strictCsp ? 'var(--success)' : 'var(--text-muted)' }}>{strictCsp ? 'Active Filtering' : 'Bypassed'}</div>
        </div>

        {/* Stage 3: Parameterizer */}
        <div style={{ padding: '12px 6px', borderRadius: '8px', backgroundColor: paramQueries ? 'var(--success-bg)' : 'var(--danger-bg)', border: `1px solid ${paramQueries ? 'var(--success-border)' : 'var(--danger-border)'}` }}>
          <Server size={20} color={paramQueries ? 'var(--success)' : 'var(--danger)'} style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: paramQueries ? 'var(--success)' : 'var(--danger)' }}>3. Prepared Stmt</div>
          <div style={{ fontSize: '0.68rem', color: paramQueries ? 'var(--success)' : 'var(--danger)' }}>{paramQueries ? 'Parameterized' : 'Raw String Concat'}</div>
        </div>

        {/* Stage 4: Database Engine */}
        <div style={{ padding: '12px 6px', borderRadius: '8px', backgroundColor: isSecure ? 'var(--success-bg)' : 'var(--danger-bg)', border: `1px solid ${isSecure ? 'var(--success-border)' : 'var(--danger-border)'}` }}>
          <Database size={20} color={isSecure ? 'var(--success)' : 'var(--danger)'} style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: isSecure ? 'var(--success)' : 'var(--danger)' }}>4. PostgreSQL</div>
          <div style={{ fontSize: '0.68rem', color: isSecure ? 'var(--success)' : 'var(--danger)' }}>{isSecure ? 'Safe Execution' : 'SQL Injection Attack!'}</div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 6. FINANCIAL MARKET PRICE TREND (Lab F1: Market Explorer)
// ====================================================================
interface MarketTrendSvgProps {
  scenario: 'expansion' | 'correction' | 'shock';
  beta: number;
}

export const MarketTrendSvg: React.FC<MarketTrendSvgProps> = ({ scenario, beta }) => {
  const points = scenario === 'expansion'
    ? [30, 42, 48, 62, 58, 75, 84, 98, 115]
    : scenario === 'correction'
    ? [80, 85, 78, 62, 54, 48, 55, 60, 68]
    : [110, 105, 95, 45, 38, 42, 40, 48, 52];

  // Scale with beta
  const scaledPoints = points.map((p) => {
    const baseline = points[0];
    const diff = p - baseline;
    return Math.max(15, Math.min(135, baseline + diff * beta));
  });

  const svgPoints = scaledPoints
    .map((y, idx) => `${idx * 40 + 20},${145 - y}`)
    .join(' ');

  const isPositive = scaledPoints[scaledPoints.length - 1] >= scaledPoints[0];

  return (
    <div style={{ padding: '14px', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          Scenario Price Trajectory (Beta: {beta}x)
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isPositive ? 'var(--success)' : 'var(--danger)' }}>
          {isPositive ? 'Bullish Trend' : 'Bearish Volatility'}
        </div>
      </div>

      <svg viewBox="0 0 360 145" style={{ width: '100%', height: '110px' }}>
        {/* Horizontal grid lines */}
        <line x1="15" y1="35" x2="345" y2="35" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="15" y1="75" x2="345" y2="75" stroke="#E2E8F0" strokeDasharray="3 3" />
        <line x1="15" y1="115" x2="345" y2="115" stroke="#E2E8F0" strokeDasharray="3 3" />

        {/* Trajectory Polyline */}
        <polyline
          fill="none"
          stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
          strokeWidth="3"
          points={svgPoints}
        />

        {/* Milestone Dots */}
        {scaledPoints.map((y, idx) => (
          <circle
            key={idx}
            cx={idx * 40 + 20}
            cy={145 - y}
            r="4"
            fill="var(--bg-surface)"
            stroke={isPositive ? 'var(--success)' : 'var(--danger)'}
            strokeWidth="2.5"
          />
        ))}
      </svg>
    </div>
  );
};

// ====================================================================
// 7. COMPOUND INTEREST GROWTH CURVE (Lab F2: Compound Interest)
// ====================================================================
interface CompoundGrowthSvgProps {
  principal: number;
  monthly: number;
  rate: number;
  years: number;
}

export const CompoundGrowthSvg: React.FC<CompoundGrowthSvgProps> = ({ principal, monthly, rate, years }) => {
  const steps = 5;
  const milestoneYears = Array.from({ length: steps }, (_, i) => Math.round(((i + 1) / steps) * years));

  const data = milestoneYears.map((yr) => {
    const n = 12;
    const r = rate / 100;
    const pPart = principal * Math.pow(1 + r / n, n * yr);
    const mPart = monthly * ((Math.pow(1 + r / n, n * yr) - 1) / (r / n));
    const total = pPart + mPart;
    const deposits = principal + monthly * 12 * yr;
    const interest = total - deposits;
    return { yr, deposits: Math.round(deposits), interest: Math.max(0, Math.round(interest)), total: Math.round(total) };
  });

  const maxVal = Math.max(...data.map(d => d.total), 1);

  return (
    <div style={{ padding: '16px', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Exponential Compounding Breakdown (Years 1 to {years})
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', gap: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
        {data.map((item, idx) => {
          const totalHeightPct = Math.min(100, Math.max(12, (item.total / maxVal) * 100));
          const depositHeightPct = (item.deposits / item.total) * totalHeightPct;
          const interestHeightPct = totalHeightPct - depositHeightPct;

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                ${(item.total / 1000).toFixed(0)}k
              </div>
              <div style={{ width: '80%', display: 'flex', flexDirection: 'column', height: `${totalHeightPct}%` }}>
                <div style={{ height: `${interestHeightPct}%`, backgroundColor: '#FDB913', borderRadius: '4px 4px 0 0' }} title={`Interest: $${item.interest}`} />
                <div style={{ height: `${depositHeightPct}%`, backgroundColor: '#30B2E7', borderRadius: interestHeightPct <= 0 ? '4px 4px 0 0' : 0 }} title={`Deposits: $${item.deposits}`} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Yr {item.yr}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '0.76rem', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#30B2E7' }} />
          <span>Principal / Deposits</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#FDB913' }} />
          <span>Compounded Interest</span>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 8. SETTLEMENT LIFECYCLE NETWORK (Lab F3: Institution Flow)
// ====================================================================
interface SettlementLifecycleProps {
  currentStep: number;
}

export const SettlementLifecycleSvg: React.FC<SettlementLifecycleProps> = ({ currentStep }) => {
  const stations = [
    { name: 'Cardholder POS', icon: Smartphone },
    { name: 'Gateway', icon: Globe },
    { name: 'Card Network', icon: Server },
    { name: 'Issuing Bank', icon: Database },
    { name: 'Merchant Bank', icon: Shield },
  ];

  return (
    <div style={{ padding: '16px', backgroundColor: 'var(--editor-bg)', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '14px' }}>
        ACH / Card Network Settlement Pathway
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
        {/* Background Connecting Bus */}
        <div style={{ position: 'absolute', left: '20px', right: '20px', height: '3px', backgroundColor: '#E2E8F0', zIndex: 0 }} />
        <div
          style={{
            position: 'absolute',
            left: '20px',
            width: `${((currentStep) / (stations.length - 1)) * 88}%`,
            height: '3px',
            backgroundColor: 'var(--brand-primary)',
            transition: 'all 0.3s ease',
            zIndex: 0,
          }}
        />

        {stations.map((st, i) => {
          const isPassed = currentStep > i;
          const isCurrent = currentStep === i;
          const Icon = st.icon;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: isPassed ? 'var(--success)' : isCurrent ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  border: `2px solid ${isPassed ? 'var(--success)' : isCurrent ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  color: isPassed || isCurrent ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isCurrent ? '0 0 12px rgba(48, 178, 231, 0.4)' : 'none',
                }}
              >
                {isPassed ? <Check size={18} /> : <Icon size={17} />}
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? 'var(--brand-primary)' : isPassed ? 'var(--success)' : 'var(--text-secondary)' }}>
                {st.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
