import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Layers,
  Activity,
  Play,
  RotateCcw,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import {
  NeuralNetworkSvg,
  BlockchainChainLinkSvg,
  IotSensorDialSvg,
  SecurityPipelineSvg,
} from './LabSvgVisualizers';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

export interface HeroAnimationSandboxProps {
  onLaunchLab: (slug: string) => void;
}

export type SandboxMode = 'ai' | 'blockchain' | 'iot' | 'security';

export const HeroAnimationSandbox: React.FC<HeroAnimationSandboxProps> = ({ onLaunchLab }) => {
  const [activeMode, setActiveMode] = useState<SandboxMode>('ai');

  // -------------------------------------------------------------
  // Mode 1: AI Neural Network Classifier State
  // -------------------------------------------------------------
  const [aiKeywordDensity, setAiKeywordDensity] = useState<number>(35);
  const [aiUrgency, setAiUrgency] = useState<number>(60);
  const [aiReputation, setAiReputation] = useState<number>(75);

  const rawAiScore = Math.round(
    aiKeywordDensity * 0.45 + aiUrgency * 0.4 - (100 - aiReputation) * 0.15
  );
  const aiConfidence = Math.max(10, Math.min(99, rawAiScore));
  const aiLabel: 'Phishing' | 'Suspicious' | 'Legitimate' =
    aiConfidence >= 70 ? 'Phishing' : aiConfidence >= 45 ? 'Suspicious' : 'Legitimate';

  // -------------------------------------------------------------
  // Mode 2: Blockchain Block Builder State
  // -------------------------------------------------------------
  const [blockNonce, setBlockNonce] = useState<number>(142);
  const [blockData, setBlockData] = useState<string>('Genesis: Aarav -> DPTS 10 GEN');
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

  const handleTamperBlock = async () => {
    const tamperedData = blockData + ' [TAMPERED]';
    setBlockData(tamperedData);
    setIsTampered(true);
    const h = await calculateHash(tamperedData, blockNonce);
    setBlockHash('ff9c' + h.slice(4));
  };

  // -------------------------------------------------------------
  // Mode 3: IoT Sensor Telemetry State
  // -------------------------------------------------------------
  const [iotTemperature, setIotTemperature] = useState<number>(32);
  const iotThreshold = 38;
  const isFanSpinning = iotTemperature >= iotThreshold;

  // -------------------------------------------------------------
  // Mode 4: Defensive Security Pipeline State
  // -------------------------------------------------------------
  const [secParamQueries, setSecParamQueries] = useState<boolean>(true);
  const [secOutputEncoding, setSecOutputEncoding] = useState<boolean>(true);
  const [secCsp, setSecCsp] = useState<boolean>(true);

  const getActiveLabSlug = () => {
    switch (activeMode) {
      case 'ai':
        return 'ai-classification-playground';
      case 'blockchain':
        return 'blockchain-block-builder';
      case 'iot':
        return 'iot-sensor-simulator';
      case 'security':
        return 'defensive-web-security';
    }
  };

  return (
    <Card
      variant="elevated"
      padding="none"
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--brand-border)',
        boxShadow: '0 20px 40px -15px rgba(48, 178, 231, 0.15)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header & Simulation Selector */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--brand-surface)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              LIVE INTERACTIVE SANDBOX
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Real-time in-browser computational engine
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--success)',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}
          />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-text)' }}>
            ACTIVE ENGINE
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          padding: '0 8px',
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveMode('ai')}
          style={{
            padding: '10px 14px',
            border: 'none',
            borderBottom: activeMode === 'ai' ? '2.5px solid var(--brand-primary)' : '2.5px solid transparent',
            backgroundColor: 'transparent',
            color: activeMode === 'ai' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontWeight: activeMode === 'ai' ? 700 : 500,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Cpu size={14} />
          <span>AI Neural Net</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('blockchain')}
          style={{
            padding: '10px 14px',
            border: 'none',
            borderBottom: activeMode === 'blockchain' ? '2.5px solid var(--brand-accent)' : '2.5px solid transparent',
            backgroundColor: 'transparent',
            color: activeMode === 'blockchain' ? 'var(--brand-accent)' : 'var(--text-secondary)',
            fontWeight: activeMode === 'blockchain' ? 700 : 500,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Layers size={14} />
          <span>Blockchain Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('iot')}
          style={{
            padding: '10px 14px',
            border: 'none',
            borderBottom: activeMode === 'iot' ? '2.5px solid var(--brand-secondary)' : '2.5px solid transparent',
            backgroundColor: 'transparent',
            color: activeMode === 'iot' ? 'var(--brand-secondary)' : 'var(--text-secondary)',
            fontWeight: activeMode === 'iot' ? 700 : 500,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Activity size={14} />
          <span>IoT Sensor Dial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('security')}
          style={{
            padding: '10px 14px',
            border: 'none',
            borderBottom: activeMode === 'security' ? '2.5px solid #2563EB' : '2.5px solid transparent',
            backgroundColor: 'transparent',
            color: activeMode === 'security' ? '#2563EB' : 'var(--text-secondary)',
            fontWeight: activeMode === 'security' ? 700 : 500,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          <Shield size={14} />
          <span>Web Defense</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* ========================================================= */}
        {/* MODE 1: AI CLASSIFIER                                     */}
        {/* ========================================================= */}
        {activeMode === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Perceptron Activation Weights
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Drag parameters to recalculate hidden activations & threat confidence
                </p>
              </div>
              <Badge variant={aiLabel === 'Phishing' ? 'danger' : aiLabel === 'Suspicious' ? 'warning' : 'success'} size="sm">
                {aiLabel === 'Phishing' ? 'THREAT DETECTED' : aiLabel === 'Suspicious' ? 'SUSPICIOUS' : 'VERIFIED SAFE'}
              </Badge>
            </div>

            {/* SVG Visualizer */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <NeuralNetworkSvg
                keywordDensity={aiKeywordDensity}
                urgencyScore={aiUrgency}
                senderReputation={aiReputation}
                predictedLabel={aiLabel}
                confidenceScore={aiConfidence}
              />
            </div>

            {/* Live Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Keyword Density</span>
                  <strong style={{ color: 'var(--brand-primary)' }}>{aiKeywordDensity}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiKeywordDensity}
                  onChange={(e) => setAiKeywordDensity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Urgency Indicator</span>
                  <strong style={{ color: 'var(--brand-accent)' }}>{aiUrgency}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiUrgency}
                  onChange={(e) => setAiUrgency(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand-accent)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sender Trust</span>
                  <strong style={{ color: 'var(--brand-secondary)' }}>{aiReputation}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiReputation}
                  onChange={(e) => setAiReputation(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brand-secondary)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: BLOCKCHAIN BLOCK BUILDER                          */}
        {/* ========================================================= */}
        {activeMode === 'blockchain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Cryptographic Block Verification
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Proof-of-Work: Nonce iteration to discover SHA-256 target starting with '00'
                </p>
              </div>
              <Badge variant={isTampered ? 'danger' : 'accent'} size="sm">
                {isTampered ? 'TAMPER ALERT' : 'HASH VALID'}
              </Badge>
            </div>

            {/* SVG Visualizer */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <BlockchainChainLinkSvg
                isValid={!isTampered && blockHash.startsWith('00')}
                prevHashPreview={blockHash.slice(0, 16) + '...'}
              />
            </div>

            {/* Blockchain Controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="accent"
                size="sm"
                leftIcon={<Play size={13} />}
                isLoading={isMining}
                onClick={handleMineBlock}
              >
                Mine Valid Nonce
              </Button>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<AlertTriangle size={13} />}
                onClick={handleTamperBlock}
              >
                Simulate Tamper
              </Button>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw size={13} />}
                onClick={() => {
                  setBlockNonce(142);
                  setBlockData('Genesis: Aarav -> DPTS 10 GEN');
                  setBlockHash('00a4b73f8e12c9d8e7a6b5c4d3e2f1a0');
                  setIsTampered(false);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 3: IOT SENSOR SIMULATOR                              */}
        {/* ========================================================= */}
        {activeMode === 'iot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Edge Sensor Telemetry & Cooling Fan
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Threshold trigger at 38°C automatically engages high-speed cooling fan
                </p>
              </div>
              <Badge variant={isFanSpinning ? 'warning' : 'success'} size="sm">
                {isFanSpinning ? 'COOLING ACTIVE' : 'NOMINAL AMBIENT'}
              </Badge>
            </div>

            {/* SVG Visualizer */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <IotSensorDialSvg
                currentTemp={iotTemperature}
                threshold={iotThreshold}
                humidity={48}
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ambient Temperature Sensor</span>
                <strong style={{ color: isFanSpinning ? 'var(--warning-text)' : 'var(--brand-secondary)' }}>
                  {iotTemperature}°C {isFanSpinning ? '(Threshold Exceeded)' : '(Safe)'}
                </strong>
              </div>
              <input
                type="range"
                min="18"
                max="50"
                value={iotTemperature}
                onChange={(e) => setIotTemperature(Number(e.target.value))}
                style={{ width: '100%', accentColor: isFanSpinning ? 'var(--warning-text)' : 'var(--brand-secondary)' }}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 4: DEFENSIVE WEB SECURITY                            */}
        {/* ========================================================= */}
        {activeMode === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Three-Stage Defense Sanitizer Pipeline
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Toggle defensive filters to neutralize SQL injection and XSS payloads
                </p>
              </div>
              <Badge variant={secParamQueries && secOutputEncoding ? 'success' : 'danger'} size="sm">
                {secParamQueries && secOutputEncoding ? 'IMMUNE TO INJECTION' : 'VULNERABLE'}
              </Badge>
            </div>

            {/* SVG Visualizer */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-lg)',
                padding: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <SecurityPipelineSvg
                paramQueries={secParamQueries}
                outputEncoding={secOutputEncoding}
                strictCsp={secCsp}
              />
            </div>

            {/* Toggle Filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSecParamQueries((v) => !v)}
                className={secParamQueries ? 'btn-primary' : 'btn-outline'}
                style={{ height: '32px', fontSize: '0.75rem', padding: '0 10px' }}
              >
                <Lock size={12} />
                <span>Parameterized SQL ({secParamQueries ? 'ON' : 'OFF'})</span>
              </button>

              <button
                type="button"
                onClick={() => setSecOutputEncoding((v) => !v)}
                className={secOutputEncoding ? 'btn-accent' : 'btn-outline'}
                style={{ height: '32px', fontSize: '0.75rem', padding: '0 10px' }}
              >
                <span>Output Encoding ({secOutputEncoding ? 'ON' : 'OFF'})</span>
              </button>

              <button
                type="button"
                onClick={() => setSecCsp((v) => !v)}
                className={secCsp ? 'btn-secondary' : 'btn-outline'}
                style={{ height: '32px', fontSize: '0.75rem', padding: '0 10px' }}
              >
                <span>CSP Headers ({secCsp ? 'ON' : 'OFF'})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA: Launch Full Lab */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Part of the 12 Approved Curricular Simulation Engines
        </div>

        <Button
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight size={14} />}
          onClick={() => onLaunchLab(getActiveLabSlug())}
        >
          Open Full Lab Workspace
        </Button>
      </div>
    </Card>
  );
};
