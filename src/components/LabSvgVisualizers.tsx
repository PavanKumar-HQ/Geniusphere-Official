import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  Server,
  Database,
  Smartphone,
  Globe,
  Check,
  AlertTriangle,
  Wind,
  TrendingUp,
  TrendingDown,
  DollarSign,
  User,
  GraduationCap,
  Wifi,
  Smile,
} from 'lucide-react';

// ====================================================================
// 1. NEURAL NETWORK VISUALIZER (Lab T1: AI Classifier)
// Enhanced with signal pulse flows and dynamic layer representations
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
    { label: 'KW Density', val: `${keywordDensity}%`, w: in1Weight, y: 36, color: '#43A85B' },
    { label: 'Urgency Score', val: `${urgencyScore}/100`, w: in2Weight, y: 95, color: '#D97706' },
    { label: 'Domain Rep', val: `${senderReputation}/100`, w: in3Weight, y: 154, color: '#2563EB' },
  ];

  const hiddenNodes = [
    { y: 32, w: in1Weight * 0.7 + in2Weight * 0.3 },
    { y: 74, w: in2Weight * 0.5 + in3Weight * 0.5 },
    { y: 116, w: in1Weight * 0.4 + in3Weight * 0.6 },
    { y: 158, w: in2Weight * 0.8 + in1Weight * 0.2 },
  ];

  const outputNodes = [
    { label: 'PHISHING', active: isPhish, color: '#DC2626', bg: '#FEE2E2', y: 65, code: 'P' },
    { label: 'LEGITIMATE', active: !isPhish && !isSuspicious, color: '#16A34A', bg: '#DCFCE7', y: 125, code: 'L' },
  ];

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#43A85B' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em' }}>
            Neural Weights & Activation Flow
          </span>
        </div>
        <div
          style={{
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            backgroundColor: '#F4F8F1',
            padding: '3px 10px',
            borderRadius: '100px',
            color: '#3B6843',
            fontWeight: 700,
            border: '1px solid #E0ECD8',
          }}
        >
          Model Confidence: {confidenceScore}%
        </div>
      </div>

      <svg viewBox="0 0 540 195" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="synapsePhish" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#43A85B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="synapseLegit" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#43A85B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Layer 1 to Layer 2 Connections */}
        {inputNodes.map((inNode, i) =>
          hiddenNodes.map((hidNode, j) => {
            const activeWeight = (inNode.w + hidNode.w) / 2;
            return (
              <line
                key={`in-hid-${i}-${j}`}
                x1="95"
                y1={inNode.y}
                x2="260"
                y2={hidNode.y}
                stroke={isPhish ? 'url(#synapsePhish)' : 'url(#synapseLegit)'}
                strokeWidth={Math.max(1, activeWeight * 3)}
                strokeOpacity={Math.max(0.18, activeWeight * 0.75)}
              />
            );
          })
        )}

        {/* Traveling Signal Pulse Animation */}
        <circle r="3" fill="#43A85B" opacity="0.8">
          <animateMotion
            path={`M 95 ${inputNodes[0].y} L 260 ${hiddenNodes[1].y} L 450 ${outputNodes[isPhish ? 0 : 1].y}`}
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3" fill="#82C424" opacity="0.8">
          <animateMotion
            path={`M 95 ${inputNodes[1].y} L 260 ${hiddenNodes[2].y} L 450 ${outputNodes[isPhish ? 0 : 1].y}`}
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Layer 2 to Layer 3 Connections */}
        {hiddenNodes.map((hidNode, i) =>
          outputNodes.map((outNode, j) => (
            <line
              key={`hid-out-${i}-${j}`}
              x1="280"
              y1={hidNode.y}
              x2="445"
              y2={outNode.y}
              stroke={outNode.active ? outNode.color : '#CBD5E1'}
              strokeWidth={outNode.active ? 2.5 : 0.9}
              strokeOpacity={outNode.active ? 0.85 : 0.25}
            />
          ))
        )}

        {/* Input Layer Nodes */}
        {inputNodes.map((node, i) => (
          <g key={`in-node-${i}`}>
            <circle cx="85" cy={node.y} r="15" fill="#FFFFFF" stroke={node.color} strokeWidth="2.5" />
            <text x="85" y={node.y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#26352A">
              x{i + 1}
            </text>
            <text x="62" y={node.y + 3} textAnchor="end" fontSize="10" fontWeight="700" fill="#4A5E4F">
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
              r="13"
              fill={isPhish ? 'rgba(220, 38, 38, 0.1)' : 'rgba(67, 168, 91, 0.12)'}
              stroke={isPhish ? '#DC2626' : '#43A85B'}
              strokeWidth="2"
            />
            <circle cx="270" cy={node.y} r="4" fill={isPhish ? '#DC2626' : '#43A85B'} />
          </g>
        ))}

        {/* Output Layer Nodes */}
        {outputNodes.map((node, k) => (
          <g key={`out-node-${k}`}>
            <circle
              cx="455"
              cy={node.y}
              r="18"
              fill={node.active ? node.color : '#FFFFFF'}
              stroke={node.color}
              strokeWidth={node.active ? 3 : 1.5}
            />
            <text
              x="455"
              y={node.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill={node.active ? '#FFFFFF' : '#64748B'}
            >
              {node.code}
            </text>
            <text
              x="482"
              y={node.y + 4}
              textAnchor="start"
              fontSize="10.5"
              fontWeight="800"
              fill={node.active ? node.color : '#94A3B8'}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ====================================================================
// 2. BLOCKCHAIN INTER-BLOCK HASH CHAIN LINK (Lab T2: Blockchain Builder)
// Integrated with cryptographic hashing machine & tamper detector
// ====================================================================
interface BlockchainChainLinkProps {
  isValid: boolean;
  prevHashPreview: string;
}

export const BlockchainChainLinkSvg: React.FC<BlockchainChainLinkProps> = ({ isValid, prevHashPreview }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0', gap: '12px' }}>
      <div style={{ flex: 1, height: '2px', backgroundColor: isValid ? '#B7E2BA' : '#FECACA' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '100px',
          backgroundColor: isValid ? '#EDF8EE' : '#FEF2F2',
          border: `1.5px solid ${isValid ? '#A4D9A9' : '#FCA5A5'}`,
          fontSize: '0.78rem',
          fontFamily: 'monospace',
          color: isValid ? '#1E652E' : '#991B1B',
          fontWeight: 700,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        {isValid ? <Lock size={13} color="#16A34A" /> : <AlertTriangle size={13} color="#DC2626" />}
        <span>{isValid ? `✓ Hash Verified: ${prevHashPreview}` : `✕ Hash Mismatch: Tampered Chain Link`}</span>
      </div>
      <div style={{ flex: 1, height: '2px', backgroundColor: isValid ? '#B7E2BA' : '#FECACA' }} />
    </div>
  );
};

// ====================================================================
// 3. IOT SENSOR GAUGE & ACTUATOR FAN (Lab T3: IoT Simulator)
// Integrated with rotating cooling fan & telemetry waves
// ====================================================================
interface IotSensorDialProps {
  currentTemp: number;
  threshold: number;
  humidity: number;
}

export const IotSensorDialSvg: React.FC<IotSensorDialProps> = ({ currentTemp, threshold, humidity }) => {
  const isAlarm = currentTemp >= threshold;

  const minTemp = 15;
  const maxTemp = 50;
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, currentTemp));
  const needleAngle = -120 + ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 240;
  const thresholdAngle = -120 + ((threshold - minTemp) / (maxTemp - minTemp)) * 240;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      {/* Gauge Visualizer */}
      <div style={{ textAlign: 'center' }}>
        <svg width="180" height="115" viewBox="0 0 180 115">
          {/* Background Arc */}
          <path d="M 25 100 A 65 65 0 1 1 155 100" fill="none" stroke="#EEF4EC" strokeWidth="12" strokeLinecap="round" />
          {/* Active Progress Arc */}
          <path
            d="M 25 100 A 65 65 0 1 1 155 100"
            fill="none"
            stroke={isAlarm ? '#DC2626' : '#43A85B'}
            strokeWidth="12"
            strokeDasharray="225"
            strokeDashoffset={225 - 225 * ((clampedTemp - minTemp) / (maxTemp - minTemp))}
            strokeLinecap="round"
          />

          {/* Needle */}
          <g transform={`translate(90, 100) rotate(${needleAngle})`}>
            <polygon points="-3,-10 3,-10 1,-58 -1,-58" fill={isAlarm ? '#DC2626' : '#26352A'} />
            <circle cx="0" cy="0" r="7" fill={isAlarm ? '#DC2626' : '#43A85B'} />
          </g>

          {/* Threshold Tick Mark */}
          <g transform={`translate(90, 100) rotate(${thresholdAngle})`}>
            <line x1="0" y1="-66" x2="0" y2="-76" stroke="#D97706" strokeWidth="2.5" />
          </g>

          <text x="90" y="88" textAnchor="middle" fontSize="18" fontWeight="800" fill="#26352A">
            {currentTemp}°C
          </text>
          <text x="90" y="105" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6A7D70">
            Threshold: {threshold}°C
          </text>
        </svg>
        <div style={{ fontSize: '0.78rem', color: '#556D5C', fontWeight: 700, marginTop: '-2px' }}>
          Calibrated Telemetry Sensor
        </div>
      </div>

      {/* Cloud & Radio Link Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: '#F1F8EE',
            border: '1px solid #D6E8CF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#43A85B',
          }}
        >
          <Wifi size={24} className={isAlarm ? 'signal-pulse' : ''} />
        </div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#26352A' }}>MQTT Gateway</div>
        <div style={{ fontSize: '0.72rem', color: '#6A7D70' }}>Humidity: {humidity}%</div>
      </div>

      {/* Actuator Fan State */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: isAlarm ? '#FEF2F2' : '#F4FAF1',
            border: `2px solid ${isAlarm ? '#FCA5A5' : '#D2E8CB'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isAlarm ? '0 0 16px rgba(220, 38, 38, 0.2)' : 'none',
          }}
        >
          <Wind
            size={28}
            className={isAlarm ? 'rotate-fan' : ''}
            color={isAlarm ? '#DC2626' : '#43A85B'}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isAlarm ? '#DC2626' : '#26352A' }}>
            {isAlarm ? 'COOLING ACTUATOR ON' : 'ACTUATOR IDLE'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6A7D70' }}>
            {isAlarm ? 'Emergency fan active' : 'Within safety limits'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 4. FINANCIAL MARKET PRICE TRAJECTORY & DISCOVERY (Lab F1: Market Explorer)
// Integrated with live price tickers & scenario curves
// ====================================================================
interface MarketTrendSvgProps {
  scenario: 'expansion' | 'correction' | 'shock';
  beta: number;
}

export const MarketTrendSvg: React.FC<MarketTrendSvgProps> = ({ scenario, beta }) => {
  const [livePrice, setLivePrice] = useState<number>(142.5);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const prevPriceRef = useRef(livePrice);

  // Base trajectories for 3 scenarios
  const basePoints =
    scenario === 'expansion'
      ? [32, 40, 46, 58, 54, 72, 80, 95, 112]
      : scenario === 'correction'
      ? [82, 88, 76, 60, 52, 46, 52, 58, 66]
      : [110, 102, 90, 42, 35, 38, 36, 44, 48];

  // Scale with beta sensitivity
  const scaledPoints = basePoints.map((p) => {
    const baseline = basePoints[0];
    const diff = p - baseline;
    return Math.max(15, Math.min(135, baseline + diff * beta));
  });

  // Calculate live ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const change = (Math.random() - 0.46) * 1.8 * beta;
      setLivePrice((prev) => {
        const next = Math.max(10, Math.round((prev + change) * 100) / 100);
        setDirection(next >= prevPriceRef.current ? 'up' : 'down');
        prevPriceRef.current = next;
        return next;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [beta]);

  const svgPoints = scaledPoints.map((y, idx) => `${idx * 40 + 20},${145 - y}`).join(' ');
  const areaPoints = `20,145 ${svgPoints} 340,145`;
  const isPositive = scaledPoints[scaledPoints.length - 1] >= scaledPoints[0];

  return (
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      {/* Header with live ticker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em' }}>
            Price Trajectory Simulation (Beta: {beta}x)
          </div>
          <div style={{ fontSize: '0.74rem', color: '#6A7D70', marginTop: '2px' }}>
            Scenario: {scenario === 'expansion' ? 'Steady Growth' : scenario === 'correction' ? 'Sector Correction' : 'Liquidity Shock'}
          </div>
        </div>

        {/* Live Feed Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '100px',
              backgroundColor: direction === 'up' ? '#EDF8EE' : '#FEF2F2',
              border: `1px solid ${direction === 'up' ? '#BCE4C2' : '#FCA5A5'}`,
              color: direction === 'up' ? '#1E652E' : '#991B1B',
              fontSize: '0.86rem',
              fontWeight: 800,
            }}
          >
            {direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>${livePrice.toFixed(2)}</span>
          </div>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: isPositive ? '#E5F0DF' : '#FEF2F2',
              color: isPositive ? '#24592E' : '#991B1B',
              fontSize: '0.74rem',
              fontWeight: 800,
            }}
          >
            {isPositive ? 'Bullish Regime' : 'Bearish Volatility'}
          </span>
        </div>
      </div>

      <svg viewBox="0 0 360 145" style={{ width: '100%', height: '125px', display: 'block' }}>
        <defs>
          <linearGradient id="marketAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#43A85B' : '#DC2626'} stopOpacity="0.25" />
            <stop offset="100%" stopColor={isPositive ? '#43A85B' : '#DC2626'} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="15" y1="35" x2="345" y2="35" stroke="#F0F4EC" strokeDasharray="3 3" />
        <line x1="15" y1="75" x2="345" y2="75" stroke="#F0F4EC" strokeDasharray="3 3" />
        <line x1="15" y1="115" x2="345" y2="115" stroke="#F0F4EC" strokeDasharray="3 3" />

        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#marketAreaGradient)" />

        {/* Price Polyline */}
        <polyline
          fill="none"
          stroke={isPositive ? '#43A85B' : '#DC2626'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={svgPoints}
        />

        {/* Trajectory Milestone Dots */}
        {scaledPoints.map((y, idx) => (
          <circle
            key={idx}
            cx={idx * 40 + 20}
            cy={145 - y}
            r="4.5"
            fill="#FFFFFF"
            stroke={isPositive ? '#43A85B' : '#DC2626'}
            strokeWidth="2.5"
          />
        ))}
      </svg>
    </div>
  );
};

// ====================================================================
// 5. COMPOUND INTEREST GROWTH BREAKDOWN (Lab F2: Compound Interest)
// Integrated with exponential milestone bars & wealth trajectory
// ====================================================================
interface CompoundGrowthSvgProps {
  principal: number;
  monthly: number;
  rate: number;
  years: number;
  currencySymbol?: string;
}

export const CompoundGrowthSvg: React.FC<CompoundGrowthSvgProps> = ({
  principal,
  monthly,
  rate,
  years,
  currencySymbol = '$',
}) => {
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
    return {
      yr,
      deposits: Math.round(deposits),
      interest: Math.max(0, Math.round(interest)),
      total: Math.round(total),
    };
  });

  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em' }}>
          Exponential Compounding (Years 1 to {years})
        </div>
        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#43A85B' }}>
          Final Value: {currencySymbol}{(data[data.length - 1].total).toLocaleString()}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '115px',
          gap: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid #EEF3E9',
        }}
      >
        {data.map((item, idx) => {
          const totalHeightPct = Math.min(100, Math.max(12, (item.total / maxVal) * 100));
          const depositHeightPct = (item.deposits / item.total) * totalHeightPct;
          const interestHeightPct = totalHeightPct - depositHeightPct;

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#26352A', marginBottom: '4px' }}>
                {currencySymbol}
                {(item.total / 1000).toFixed(0)}k
              </div>
              <div
                style={{
                  width: '80%',
                  maxWidth: '46px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: `${totalHeightPct}%`,
                  borderRadius: '4px 4px 0 0',
                  overflow: 'hidden',
                  transition: 'height 0.3s ease',
                }}
              >
                <div
                  style={{ height: `${interestHeightPct}%`, backgroundColor: '#82C424' }}
                  title={`Compounded Wealth: ${currencySymbol}${item.interest.toLocaleString()}`}
                />
                <div
                  style={{ height: `${depositHeightPct}%`, backgroundColor: '#43A85B' }}
                  title={`Deposits: ${currencySymbol}${item.deposits.toLocaleString()}`}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6A7D70', marginTop: '6px', fontWeight: 600 }}>
                Yr {item.yr}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#43A85B' }} />
          <span style={{ color: '#26352A' }}>Principal &amp; Monthly Deposits</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#82C424' }} />
          <span style={{ color: '#3A6310' }}>Compounded Earnings</span>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 6. 50/30/20 BUDGET PIE VISUALIZER (Integrated from Geniusphere-main)
// ====================================================================
interface BudgetPieSvgProps {
  income?: number;
}

export const BudgetPieSvg: React.FC<BudgetPieSvgProps> = ({ income = 5000 }) => {
  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  return (
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em', marginBottom: '12px' }}>
        50/30/20 Budget Allocation Model
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        {/* Circular SVG Donut */}
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            {/* Needs: 50% (dasharray: 157, circum = 314) */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#43A85B" strokeWidth="16" strokeDasharray="125.6 251.2" strokeDashoffset="0" />
            {/* Wants: 30% (dasharray: 75.36) */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#30B2E7" strokeWidth="16" strokeDasharray="75.36 251.2" strokeDashoffset="-125.6" />
            {/* Savings: 20% (dasharray: 50.24) */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D97706" strokeWidth="16" strokeDasharray="50.24 251.2" strokeDashoffset="-200.96" />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={16} color="#43A85B" />
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#26352A' }}>100%</span>
          </div>
        </div>

        {/* Legend Callouts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#43A85B' }} />
            <div>
              <span style={{ fontWeight: 800, color: '#26352A' }}>Needs (50%): </span>
              <span style={{ color: '#556D5C' }}>${needs.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#30B2E7' }} />
            <div>
              <span style={{ fontWeight: 800, color: '#26352A' }}>Wants (30%): </span>
              <span style={{ color: '#556D5C' }}>${wants.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#D97706' }} />
            <div>
              <span style={{ fontWeight: 800, color: '#26352A' }}>Savings (20%): </span>
              <span style={{ color: '#556D5C' }}>${savings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 7. ACTIVE COMMUNICATION & LISTENING (Integrated from Geniusphere-main)
// ====================================================================
interface ConversationSvgProps {
  currentStep?: number;
}

export const ConversationSvg: React.FC<ConversationSvgProps> = ({ currentStep = 2 }) => {
  return (
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em' }}>
          Two-Way Communication &amp; Active Listening Flow
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EDF8EE', color: '#1E652E' }}>
          Phase {currentStep} of 4
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
        {/* Speaker Node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#EDF8EE',
              border: '2px solid #43A85B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#43A85B',
            }}
          >
            <User size={24} />
          </div>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#26352A' }}>Speaker</span>
        </div>

        {/* Transmission Pathway with Pulses */}
        <div style={{ flex: 1, margin: '0 16px', position: 'relative', height: '6px', backgroundColor: '#EEF4EC', borderRadius: '100px' }}>
          <div
            style={{
              width: `${Math.min(100, currentStep * 25)}%`,
              height: '100%',
              backgroundColor: '#43A85B',
              borderRadius: '100px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Listener Node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#F0F9FF',
              border: '2px solid #30B2E7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#30B2E7',
            }}
          >
            <Smile size={24} />
          </div>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#26352A' }}>Active Listener</span>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 8. INTERACTIVE CLASSROOM DISTRIBUTION (Integrated from Geniusphere-main)
// ====================================================================
interface ClassroomSvgProps {
  currentStep?: number;
}

export const ClassroomSvg: React.FC<ClassroomSvgProps> = ({ currentStep = 2 }) => {
  return (
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em' }}>
          Modern Pedagogy Distribution &amp; Collaboration Grid
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#E5F0DF', color: '#26352A' }}>
          Stage {currentStep} Active
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        {/* Educator Node */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#E5F0DF',
              border: '2px solid #43A85B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#43A85B',
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#26352A' }}>Educator Lead</div>
            <div style={{ fontSize: '0.72rem', color: '#6A7D70' }}>Content synthesis active</div>
          </div>
        </div>

        {/* 6-Student Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', width: '100%', maxWidth: '380px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '6px',
                borderRadius: '8px',
                backgroundColor: '#F8FAF6',
                border: '1px solid #E5F0DF',
              }}
            >
              <User size={16} color="#43A85B" />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#556D5C' }}>S{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 9. DIGITAL PRIVACY RADAR (Lab T4: Digital Privacy)
// ====================================================================
interface PrivacyRadarProps {
  exposureScore: number;
  permissions?: {
    location?: boolean;
    contacts?: boolean;
    mic?: boolean;
    adTracking?: boolean;
  };
  location?: boolean;
  contacts?: boolean;
  mic?: boolean;
  adTracking?: boolean;
}

export const PrivacyRadarSvg: React.FC<PrivacyRadarProps> = ({
  exposureScore,
  permissions,
  location,
  contacts,
  mic,
  adTracking,
}) => {
  const perm = {
    location: location ?? permissions?.location ?? true,
    contacts: contacts ?? permissions?.contacts ?? true,
    mic: mic ?? permissions?.mic ?? true,
    adTracking: adTracking ?? permissions?.adTracking ?? true,
  };
  const isSafe = exposureScore < 25;

  return (
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em' }}>
          Real-Time Exposure Assessment
        </div>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '100px',
            backgroundColor: isSafe ? '#EDF8EE' : '#FEF2F2',
            color: isSafe ? '#1E652E' : '#991B1B',
            border: `1px solid ${isSafe ? '#BCE4C2' : '#FCA5A5'}`,
          }}
        >
          {isSafe ? 'Low Exposure Tier' : 'High Exposure Alert'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#EEF4EC" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="35" fill="none" stroke="#EEF4EC" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="#EEF4EC" strokeWidth="1.5" />
          <line x1="10" y1="60" x2="110" y2="60" stroke="#EEF4EC" strokeWidth="1" />
          <line x1="60" y1="10" x2="60" y2="110" stroke="#EEF4EC" strokeWidth="1" />
          {/* Radar Sweep Line */}
          <line x1="60" y1="60" x2="105" y2="40" stroke="#43A85B" strokeWidth="2" strokeOpacity="0.8">
            <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="4s" repeatCount="indefinite" />
          </line>
          <circle cx="60" cy="60" r="5" fill="#43A85B" />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: perm.location ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
              {perm.location ? '✕' : '✓'} Location Telemetry:
            </span>
            <span>{perm.location ? 'Broadcasted' : 'Revoked'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: perm.contacts ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
              {perm.contacts ? '✕' : '✓'} Contact Book:
            </span>
            <span>{perm.contacts ? 'Harvested' : 'Secured'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: perm.mic ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
              {perm.mic ? '✕' : '✓'} Microphone Audio:
            </span>
            <span>{perm.mic ? 'Background Access' : 'Restricted'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: perm.adTracking ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
              {perm.adTracking ? '✕' : '✓'} Ad Profiling ID:
            </span>
            <span>{perm.adTracking ? 'Shared Across Apps' : 'Blocked'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 10. DEFENSIVE SECURITY PIPELINE (Lab T5: Web Defense)
// ====================================================================
export interface SecurityPipelineProps {
  paramQueries: boolean;
  outputEncoding: boolean;
  strictCsp: boolean;
  payload?: string;
  isSimulating?: boolean;
  forceReducedMotion?: boolean;
}

export const SecurityPipelineSvg: React.FC<SecurityPipelineProps> = ({
  paramQueries,
  outputEncoding,
  strictCsp,
  payload = "' OR '1'='1",
  isSimulating = false,
  forceReducedMotion = false,
}) => {
  const isSqlThreat = payload.includes("'") || payload.toLowerCase().includes('select') || payload.toLowerCase().includes('or');
  const isXssThreat = payload.includes('<script>') || payload.toLowerCase().includes('onerror') || payload.toLowerCase().includes('alert');

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(36, 76, 58, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
          Interactive Defense Pipeline Architecture (Defense-in-Depth)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: paramQueries && outputEncoding && strictCsp ? '#16A34A' : '#F59E0B' }} />
          <span>Pipeline Status: {paramQueries && outputEncoding && strictCsp ? 'Hardened (Zero Trust)' : 'Partial Vulnerability Window'}</span>
        </div>
      </div>

      {/* SVG Pipeline Canvas */}
      <div style={{ width: '100%', overflowX: 'auto', backgroundColor: '#F8FAF7', borderRadius: '12px', padding: '8px', border: '1px solid #E5EBE1' }}>
        <svg
          viewBox="0 0 760 160"
          style={{ width: '100%', minWidth: '680px', height: 'auto', display: 'block' }}
          role="img"
          aria-label="Defensive Security Pipeline SVG diagram showing untrusted input traversing SQL parameterization, HTML encoding, and CSP enforcement"
        >
          <defs>
            <linearGradient id="pipeGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#244C3A" />
              <stop offset="100%" stopColor="#A9C86A" />
            </linearGradient>
            <linearGradient id="pipeGradientVulnerable" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#6B7280" />
            </marker>
          </defs>

          {/* Connection Pathways */}
          <path d="M 90 80 L 190 80" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="4 4" markerEnd="url(#arrowhead)" />
          <path d="M 270 80 L 370 80" stroke={paramQueries ? '#86EFAC' : '#FCA5A5'} strokeWidth="4" markerEnd="url(#arrowhead)" />
          <path d="M 450 80 L 550 80" stroke={outputEncoding ? '#86EFAC' : '#FCA5A5'} strokeWidth="4" markerEnd="url(#arrowhead)" />
          <path d="M 630 80 L 700 80" stroke={strictCsp ? '#86EFAC' : '#FCA5A5'} strokeWidth="4" markerEnd="url(#arrowhead)" />

          {/* NODE 1: Untrusted Input Source */}
          <g transform="translate(20, 45)">
            <rect width="80" height="70" rx="10" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
            <text x="40" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">PAYLOAD</text>
            <text x="40" y="44" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748B">
              {payload.length > 9 ? payload.substring(0, 9) + '…' : payload}
            </text>
            <text x="40" y="58" textAnchor="middle" fontSize="7" fontWeight="600" fill={isSqlThreat || isXssThreat ? '#DC2626' : '#16A34A'}>
              {isSqlThreat ? 'SQL PAYLOAD' : isXssThreat ? 'XSS PAYLOAD' : 'BENIGN DATA'}
            </text>
          </g>

          {/* NODE 2: SQL Parameterization Gate */}
          <g transform="translate(190, 40)">
            <rect
              width="86"
              height="80"
              rx="12"
              fill={paramQueries ? '#ECFDF5' : '#FEF2F2'}
              stroke={paramQueries ? '#10B981' : '#EF4444'}
              strokeWidth="2.5"
            />
            <text x="43" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill={paramQueries ? '#065F46' : '#991B1B'}>
              GATE 1
            </text>
            <text x="43" y="38" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
              Parameterized
            </text>
            <text x="43" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
              Query (?)
            </text>
            <rect
              x="12"
              y="58"
              width="62"
              height="16"
              rx="4"
              fill={paramQueries ? '#D1FAE5' : '#FEE2E2'}
            />
            <text
              x="43"
              y="69"
              textAnchor="middle"
              fontSize="8"
              fontWeight="800"
              fill={paramQueries ? '#047857' : '#B91C1C'}
            >
              {paramQueries ? 'PROTECTED' : 'VULNERABLE'}
            </text>
          </g>

          {/* NODE 3: HTML Output Encoding Gate */}
          <g transform="translate(370, 40)">
            <rect
              width="86"
              height="80"
              rx="12"
              fill={outputEncoding ? '#ECFDF5' : '#FEF2F2'}
              stroke={outputEncoding ? '#10B981' : '#EF4444'}
              strokeWidth="2.5"
            />
            <text x="43" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill={outputEncoding ? '#065F46' : '#991B1B'}>
              GATE 2
            </text>
            <text x="43" y="38" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
              HTML Entity
            </text>
            <text x="43" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
              Encoding
            </text>
            <rect
              x="12"
              y="58"
              width="62"
              height="16"
              rx="4"
              fill={outputEncoding ? '#D1FAE5' : '#FEE2E2'}
            />
            <text
              x="43"
              y="69"
              textAnchor="middle"
              fontSize="8"
              fontWeight="800"
              fill={outputEncoding ? '#047857' : '#B91C1C'}
            >
              {outputEncoding ? 'ENCODED' : 'BYPASSED'}
            </text>
          </g>

          {/* NODE 4: Strict CSP Gate */}
          <g transform="translate(550, 40)">
            <rect
              width="86"
              height="80"
              rx="12"
              fill={strictCsp ? '#ECFDF5' : '#FEF2F2'}
              stroke={strictCsp ? '#10B981' : '#EF4444'}
              strokeWidth="2.5"
            />
            <text x="43" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill={strictCsp ? '#065F46' : '#991B1B'}>
              GATE 3
            </text>
            <text x="43" y="38" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
              Strict CSP
            </text>
            <text x="43" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
              script-src
            </text>
            <rect
              x="12"
              y="58"
              width="62"
              height="16"
              rx="4"
              fill={strictCsp ? '#D1FAE5' : '#FEE2E2'}
            />
            <text
              x="43"
              y="69"
              textAnchor="middle"
              fontSize="8"
              fontWeight="800"
              fill={strictCsp ? '#047857' : '#B91C1C'}
            >
              {strictCsp ? 'ENFORCED' : 'DISABLED'}
            </text>
          </g>

          {/* SINK: Database / Execution Sink */}
          <g transform="translate(680, 50)">
            <rect width="60" height="60" rx="8" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
            <text x="30" y="26" textAnchor="middle" fontSize="8" fontWeight="700" fill="#334155">DATABASE</text>
            <text x="30" y="38" textAnchor="middle" fontSize="8" fontWeight="700" fill="#334155">&amp; DOM</text>
            <text
              x="30"
              y="51"
              textAnchor="middle"
              fontSize="7"
              fontWeight="800"
              fill={
                (isSqlThreat && !paramQueries) || (isXssThreat && !outputEncoding && !strictCsp)
                  ? '#DC2626'
                  : '#16A34A'
              }
            >
              {(isSqlThreat && !paramQueries) || (isXssThreat && !outputEncoding && !strictCsp)
                ? 'EXPLOITED'
                : 'SECURE'}
            </text>
          </g>

          {/* Animated Traversal Packet - respects reduced-motion preference */}
          {!forceReducedMotion && (
            <circle cx="100" cy="80" r="6" fill={isSqlThreat || isXssThreat ? '#EF4444' : '#10B981'}>
              <animate
                attributeName="cx"
                values="100;190;370;550;690"
                dur={isSimulating ? "1.6s" : "3.2s"}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;1;0.9;0.8;0"
                dur={isSimulating ? "1.6s" : "3.2s"}
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>
      </div>

      {/* Outcome Diagnostic Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: paramQueries ? '#EDF8EE' : '#FEF2F2',
            border: `1.5px solid ${paramQueries ? '#A4D9A9' : '#FCA5A5'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: paramQueries ? '#1E652E' : '#991B1B' }}>
              1. SQL Parameterization
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: paramQueries ? '#DCFCE7' : '#FEE2E2', color: paramQueries ? '#166534' : '#991B1B' }}>
              {paramQueries ? 'ACTIVE' : 'VULNERABLE'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {paramQueries
              ? 'Input bound as literal bytes; AST parser structure preserved.'
              : 'Direct string concatenation allows WHERE condition breakout.'}
          </div>
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: outputEncoding ? '#EDF8EE' : '#FEF2F2',
            border: `1.5px solid ${outputEncoding ? '#A4D9A9' : '#FCA5A5'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: outputEncoding ? '#1E652E' : '#991B1B' }}>
              2. HTML Entity Encoding
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: outputEncoding ? '#DCFCE7' : '#FEE2E2', color: outputEncoding ? '#166534' : '#991B1B' }}>
              {outputEncoding ? 'ENFORCED' : 'BYPASSED'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {outputEncoding
              ? 'Metacharacters replaced (&lt; &gt; &amp; &quot;); rendered as text.'
              : 'Raw untrusted HTML returned; triggers reflected script execution.'}
          </div>
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: strictCsp ? '#EDF8EE' : '#FEF2F2',
            border: `1.5px solid ${strictCsp ? '#A4D9A9' : '#FCA5A5'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: strictCsp ? '#1E652E' : '#991B1B' }}>
              3. Strict CSP Headers
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: strictCsp ? '#DCFCE7' : '#FEE2E2', color: strictCsp ? '#166534' : '#991B1B' }}>
              {strictCsp ? 'SECURED' : 'UNGUARDED'}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {strictCsp
              ? "Header script-src 'self' prevents inline execution even if injected."
              : 'Inline <script> and eval() permitted without defense-in-depth.'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 11. SETTLEMENT LIFECYCLE NETWORK (Lab F3: Institution Flow)
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
    <div
      style={{
        padding: '18px 20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5F0DF',
        borderRadius: '16px',
        boxShadow: '0 2px 10px rgba(38, 53, 42, 0.03)',
      }}
    >
      <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#26352A', letterSpacing: '0.04em', marginBottom: '16px' }}>
        ACH / Card Network Settlement Pathway
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
        {/* Connecting Track */}
        <div style={{ position: 'absolute', left: '20px', right: '20px', height: '3px', backgroundColor: '#EEF4EC', zIndex: 0 }} />
        <div
          style={{
            position: 'absolute',
            left: '20px',
            width: `${(currentStep / (stations.length - 1)) * 90}%`,
            height: '3px',
            backgroundColor: '#43A85B',
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
                  backgroundColor: isPassed ? '#43A85B' : isCurrent ? '#D9F477' : '#FFFFFF',
                  border: `2px solid ${isPassed || isCurrent ? '#43A85B' : '#DCEADA'}`,
                  color: isPassed ? '#FFFFFF' : '#26352A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isCurrent ? '0 0 10px rgba(67, 168, 91, 0.35)' : 'none',
                }}
              >
                {isPassed ? <Check size={18} /> : <Icon size={17} />}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? '#26352A' : isPassed ? '#43A85B' : '#6A7D70',
                  textAlign: 'center',
                  maxWidth: '70px',
                }}
              >
                {st.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
