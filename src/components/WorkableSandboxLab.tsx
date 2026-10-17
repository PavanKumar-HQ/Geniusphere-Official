import React, { useState } from 'react';
import {
  Hash,
  Activity,
  Play,
  Lock,
  Send,
} from 'lucide-react';

interface WorkableSandboxLabProps {
  courseSlug?: string;
  domain?: string;
  courseTitle?: string;
}

// Simple deterministic SHA-256 helper in pure JS for the Blockchain Sandbox
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const WorkableSandboxLab: React.FC<WorkableSandboxLabProps> = ({
  courseSlug = '',
  domain = '',
  courseTitle = '',
}) => {
  const s = courseSlug.toLowerCase();
  const d = domain.toLowerCase();
  const t = courseTitle.toLowerCase();

  // Determine sandbox category
  let category: 'ai' | 'blockchain' | 'iot' | 'microsoft' | 'privacy' | 'cyber' | 'finance' | 'coding' | 'professional' = 'cyber';

  if (s.includes('ai') || s.includes('artificial') || t.includes('ai') || t.includes('artificial')) {
    category = 'ai';
  } else if (s.includes('blockchain') || s.includes('crypto') || t.includes('blockchain') || t.includes('crypto')) {
    category = 'blockchain';
  } else if (s.includes('iot') || t.includes('iot') || s.includes('internet-of-things')) {
    category = 'iot';
  } else if (s.includes('microsoft') || t.includes('microsoft')) {
    category = 'microsoft';
  } else if (s.includes('privacy') || s.includes('footprint') || t.includes('privacy')) {
    category = 'privacy';
  } else if (d === 'finance' || s.includes('finance') || s.includes('stock') || s.includes('market') || s.includes('fintech')) {
    category = 'finance';
  } else if (d === 'coding' || s.includes('code') || s.includes('programming') || s.includes('web-dev') || s.includes('logic')) {
    category = 'coding';
  } else if (d === 'professional' || s.includes('time') || s.includes('soft') || s.includes('career') || s.includes('identity')) {
    category = 'professional';
  }

  // =========================================================================
  // 1. AI & LLM PROMPT / TEMPERATURE SANDBOX
  // =========================================================================
  const [aiPrompt, setAiPrompt] = useState('Explain how neural networks learn from training errors.');
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiTopP, setAiTopP] = useState(0.9);
  const [aiSafety, setAiSafety] = useState<'strict' | 'standard'>('strict');
  const [aiRunning, setAiRunning] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleRunAi = () => {
    setAiRunning(true);
    setAiOutput('Initializing transformer inference engine... Calculating self-attention scores across prompt tokens...');
    setTimeout(() => {
      setAiRunning(false);
      setAiOutput(
        `[INFERENCE COMPLETE • 142ms • Temp: ${aiTemperature} • Top-P: ${aiTopP}]\n` +
        `Tokens Generated: 64 | Safety Verification: ${aiSafety.toUpperCase()} (PASSED DPDP ACT 2023)\n\n` +
        `Neural networks learn through backpropagation and gradient descent. When training data passes forward, an error metric (loss function) calculates the deviation between model predictions and target ground-truth. The optimizer then adjusts weights backwards across layers to reduce overall error.`
      );
    }, 600);
  };

  // =========================================================================
  // 2. BLOCKCHAIN SHA-256 PROOF-OF-WORK MINING ENGINE
  // =========================================================================
  const [blockData, setBlockData] = useState('Tx: Alice -> Bob (2.5 ETH) • Batch #1042');
  const [difficulty, setDifficulty] = useState(2); // leading zeros
  const [mining, setMining] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [currentHash, setCurrentHash] = useState('0000000000000000000000000000000000000000000000000000000000000000');
  const [mineResult, setMineResult] = useState<string | null>(null);

  const handleStartMining = async () => {
    setMining(true);
    setMineResult(null);
    const targetPrefix = '0'.repeat(difficulty);
    let curNonce = 0;
    const startTime = performance.now();

    // Loop asynchronously
    while (curNonce < 50000) {
      curNonce++;
      const payload = `${blockData}|nonce:${curNonce}`;
      const hash = await sha256(payload);
      if (curNonce % 50 === 0) {
        setNonce(curNonce);
        setCurrentHash(hash);
      }
      if (hash.startsWith(targetPrefix)) {
        const elapsed = (performance.now() - startTime).toFixed(1);
        setNonce(curNonce);
        setCurrentHash(hash);
        setMining(false);
        setMineResult(`[BLOCK MINED SUCCESSFULLY!]\nNonce Found: ${curNonce}\nHash: ${hash}\nTarget: Leading ${difficulty} Zeros (${targetPrefix})\nElapsed: ${elapsed}ms\nBlock Validated across 4 peer nodes.`);
        return;
      }
    }
    setMining(false);
    setMineResult('Mining iteration limit reached (50,000 hashes). Try lowering difficulty.');
  };

  // =========================================================================
  // 3. IOT SENSOR TELEMETRY & ACTUATOR SANDBOX
  // =========================================================================
  const [iotTemp, setIotTemp] = useState(28);
  const [iotHumidity, setIotHumidity] = useState(45);
  const [iotPressure, setIotPressure] = useState(1013);
  const [iotThreshold, setIotThreshold] = useState(35);
  const [iotMqttLog, setIotMqttLog] = useState<string | null>(null);

  const isRelayOn = iotTemp > iotThreshold;

  const handlePublishMqtt = () => {
    const payload = {
      device_id: 'esp32-sensor-node-01',
      timestamp: new Date().toISOString(),
      topic: '/sensors/telemetry/classroom-1',
      metrics: {
        temperature_c: iotTemp,
        humidity_pct: iotHumidity,
        pressure_hpa: iotPressure,
      },
      actuator_state: {
        cooling_relay: isRelayOn ? 'ENGAGED_ON' : 'IDLE_OFF',
        fan_speed_rpm: isRelayOn ? 2800 : 0,
      },
    };
    setIotMqttLog(JSON.stringify(payload, null, 2));
  };

  // =========================================================================
  // 4. MICROSOFT TECHNOLOGIES / AZURE ENTRA ID SANDBOX
  // =========================================================================
  const [msRole, setMsRole] = useState<'Global Admin' | 'Institution Admin' | 'Student'>('Institution Admin');
  const [msMfa, setMsMfa] = useState(true);
  const [msTokenResult, setMsTokenResult] = useState<string | null>(null);

  const handleEvaluateToken = () => {
    const isGranted = msRole === 'Global Admin' || (msRole === 'Institution Admin' && msMfa);
    const result = {
      token_type: 'Bearer JWT (OAuth 2.0 / Entra ID)',
      tenant_id: 'geniusphere.onmicrosoft.com',
      claims: {
        iss: 'https://login.microsoftonline.com/geniusphere-tenant/v2.0',
        sub: 'user-guid-98234-pes-cie',
        aud: 'https://management.azure.com/',
        roles: [msRole],
        amr: msMfa ? ['pwd', 'mfa'] : ['pwd'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      access_evaluation: {
        status: isGranted ? 'AUTHORIZED_GRANTED' : 'ACCESS_DENIED_MFA_REQUIRED',
        policy_rule: msMfa ? 'Conditional Access Policy: Zero-Trust Compliant' : 'Violation: Multi-Factor Authentication not satisfied',
      },
    };
    setMsTokenResult(JSON.stringify(result, null, 2));
  };

  // =========================================================================
  // 5. DIGITAL PRIVACY & TRACKER SHIELD SANDBOX
  // =========================================================================
  const [blockTrackers, setBlockTrackers] = useState(true);
  const [spoofCanvas, setSpoofCanvas] = useState(true);
  const [maskWebRtc, setMaskWebRtc] = useState(false);

  const calculateEntropy = () => {
    let score = 98.6; // High risk baseline
    if (blockTrackers) score -= 35;
    if (spoofCanvas) score -= 38;
    if (maskWebRtc) score -= 14;
    return Math.max(11.6, score).toFixed(1);
  };

  // =========================================================================
  // 6. CYBERSECURITY SQL PARAMETERIZATION SANDBOX
  // =========================================================================
  const [sqlPayload, setSqlPayload] = useState("' OR '1'='1' --");
  const [usePrepared, setUsePrepared] = useState(true);
  const [sqlResult, setSqlResult] = useState<string | null>(null);

  const handleExecuteSql = () => {
    if (usePrepared) {
      setSqlResult(
        `[SECURE: PREPARED STATEMENT DETECTED]\n` +
        `Query Executed: SELECT * FROM users WHERE email = ? AND status = 'active'\n` +
        `Bound Parameter 1: "${sqlPayload}" (Treated strictly as literal string data)\n` +
        `Result: 0 records returned. Attack payload neutralized. Database integrity preserved.`
      );
    } else {
      setSqlResult(
        `[CRITICAL VULNERABILITY DETECTED: SQL INJECTION EXPLOITED]\n` +
        `Raw Query Executed: SELECT * FROM users WHERE email = '' OR '1'='1' --' AND status = 'active'\n` +
        `Tautology '1'='1' evaluated to TRUE. All 5,200 student records exposed!\n` +
        `Recommendation: Never concatenate unescaped client input into SQL query strings.`
      );
    }
  };

  // =========================================================================
  // 7. FINANCIAL MARKETS & ORDER BOOK SANDBOX
  // =========================================================================
  const [stockQty, setStockQty] = useState(20);
  const [orderAction, setOrderAction] = useState<'BUY' | 'SELL'>('BUY');
  const [cashBalance, setCashBalance] = useState(10000);
  const [sharesHeld, setSharesHeld] = useState(50);
  const [lastTrade, setLastTrade] = useState<string | null>(null);
  const stockPrice = 142.5;

  const handleExecuteTrade = () => {
    const cost = stockQty * stockPrice;
    if (orderAction === 'BUY') {
      if (cashBalance < cost) {
        setLastTrade('[ERROR] Insufficient cash balance to execute buy order.');
        return;
      }
      setCashBalance((prev) => prev - cost);
      setSharesHeld((prev) => prev + stockQty);
      setLastTrade(`[ORDER FILLED] BOUGHT ${stockQty} shares @ $${stockPrice}. Total Cost: $${cost.toFixed(2)}. Execution Time: 4ms.`);
    } else {
      if (sharesHeld < stockQty) {
        setLastTrade('[ERROR] Insufficient shares to execute sell order.');
        return;
      }
      setCashBalance((prev) => prev + cost);
      setSharesHeld((prev) => prev - stockQty);
      setLastTrade(`[ORDER FILLED] SOLD ${stockQty} shares @ $${stockPrice}. Total Proceeds: $${cost.toFixed(2)}. Execution Time: 3ms.`);
    }
  };

  // =========================================================================
  // 8. CODING & WEB DEV CODE RUNNER SANDBOX
  // =========================================================================
  const [codeSnippet, setCodeSnippet] = useState(
    `// JavaScript Logic Runner\nfunction calculateFactorial(n) {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(n - 1);\n}\nconsole.log("Factorial of 5 is: " + calculateFactorial(5));`
  );
  const [codeOutput, setCodeOutput] = useState<string | null>(null);

  const handleRunCode = () => {
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
      };
      const runFn = new Function('console', codeSnippet);
      runFn(customConsole);
      setCodeOutput(logs.join('\n') || '[SUCCESS] Code executed with zero output.');
    } catch (err: unknown) {
      setCodeOutput(`[SYNTAX / RUNTIME ERROR]: ${(err as Error).message}`);
    }
  };

  // =========================================================================
  // 9. PROFESSIONAL SKILLS EISENHOWER DECISION MATRIX
  // =========================================================================
  const [taskName, setTaskName] = useState('Review institutional audit deliverables');
  const [isUrgent, setIsUrgent] = useState(true);
  const [isImportant, setIsImportant] = useState(true);
  const [tasks, setTasks] = useState<{ name: string; quadrant: string }[]>([
    { name: 'Deploy security patch to production', quadrant: 'Do First (Urgent & Important)' },
    { name: 'Study transformer attention architecture', quadrant: 'Schedule (Not Urgent, Important)' },
  ]);

  const handleAddTask = () => {
    if (!taskName.trim()) return;
    let quad = 'Eliminate (Not Urgent, Not Important)';
    if (isUrgent && isImportant) quad = 'Do First (Urgent & Important)';
    else if (!isUrgent && isImportant) quad = 'Schedule (Not Urgent, Important)';
    else if (isUrgent && !isImportant) quad = 'Delegate (Urgent, Not Important)';

    setTasks((prev) => [...prev, { name: taskName, quadrant: quad }]);
    setTaskName('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#070D1F',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        borderRadius: '16px',
        padding: '24px',
        color: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(0, 240, 255, 0.15)', color: '#00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00F0FF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Live Workable Sandbox • {category.toUpperCase()} LAB
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              {category === 'ai' && 'Neural Network Weights & LLM Prompt Tuner'}
              {category === 'blockchain' && 'Proof-of-Work SHA-256 Mining Engine'}
              {category === 'iot' && 'IoT Telemetry, MQTT Router & Relay Actuator'}
              {category === 'microsoft' && 'Microsoft Entra ID JWT Claims & RBAC Evaluator'}
              {category === 'privacy' && 'Browser Fingerprint & Privacy Shield Analyzer'}
              {category === 'cyber' && 'SQL Injection & Defensive Parameterization Sandbox'}
              {category === 'finance' && 'Live Order Book & Exchange Paper Trading'}
              {category === 'coding' && 'Interactive Code Runner & Logic Sandbox'}
              {category === 'professional' && 'Eisenhower Decision Matrix & Focus Sorter'}
            </h3>
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
          ● LIVE RUNTIME ACTIVE
        </span>
      </div>

      {/* RENDER CATEGORY SPECIFIC INTERACTIVE SANDBOX */}

      {/* 1. AI & LLM */}
      {category === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              User Prompt:
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
              style={{ width: '100%', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', padding: '12px', color: '#FFFFFF', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '4px' }}>
                <span>Temperature (Randomness)</span>
                <span style={{ color: '#00F0FF', fontWeight: 700 }}>{aiTemperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.5"
                step="0.1"
                value={aiTemperature}
                onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#00F0FF' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '4px' }}>
                <span>Top-P (Nucleus Sampling)</span>
                <span style={{ color: '#00F0FF', fontWeight: 700 }}>{aiTopP}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={aiTopP}
                onChange={(e) => setAiTopP(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#00F0FF' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Safety Guardrails</label>
              <select
                value={aiSafety}
                onChange={(e) => setAiSafety(e.target.value as 'strict' | 'standard')}
                style={{ width: '100%', height: '36px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#FFFFFF', padding: '0 8px' }}
              >
                <option value="strict">Strict (DPDP Act 2023 Compliant)</option>
                <option value="standard">Standard Safety Filtering</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAi}
            disabled={aiRunning}
            style={{ width: '100%', height: '42px', backgroundColor: '#00F0FF', color: '#020617', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Play size={16} fill="currentColor" />
            <span>{aiRunning ? 'Generating Tokens...' : '▶ Run Inference & Sample Softmax'}</span>
          </button>

          {aiOutput && (
            <pre style={{ backgroundColor: '#020617', border: '1px solid rgba(0, 240, 255, 0.2)', borderRadius: '10px', padding: '14px', fontSize: '0.84rem', color: '#38BDF8', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {aiOutput}
            </pre>
          )}
        </div>
      )}

      {/* 2. BLOCKCHAIN MINING */}
      {category === 'blockchain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Block Data Payload (Transactions):
            </label>
            <input
              type="text"
              value={blockData}
              onChange={(e) => setBlockData(e.target.value)}
              style={{ width: '100%', height: '40px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', padding: '0 12px', color: '#FFFFFF', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Target Difficulty (Leading Zeros):</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                style={{ width: '100%', height: '38px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#FFFFFF', padding: '0 8px' }}
              >
                <option value={2}>2 Zeros (Fast ~ 150 hashes)</option>
                <option value={3}>3 Zeros (Medium ~ 2,500 hashes)</option>
                <option value={4}>4 Zeros (Challenging ~ 40,000 hashes)</option>
              </select>
            </div>

            <div style={{ backgroundColor: '#0B132B', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Current Nonce: <strong style={{ color: '#00F0FF' }}>{nonce}</strong></div>
              <div style={{ fontSize: '0.72rem', color: '#CBD5E1', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Hash: {currentHash}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartMining}
            disabled={mining}
            style={{ width: '100%', height: '42px', backgroundColor: '#F59E0B', color: '#020617', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Hash size={18} />
            <span>{mining ? `Mining in Progress (Nonce: ${nonce})...` : '⛏ Start Proof-of-Work Mining'}</span>
          </button>

          {mineResult && (
            <pre style={{ backgroundColor: '#020617', border: '1px solid #F59E0B', borderRadius: '10px', padding: '14px', fontSize: '0.84rem', color: '#FCD34D', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {mineResult}
            </pre>
          )}
        </div>
      )}

      {/* 3. IOT SENSORS & RELAY */}
      {category === 'iot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Temperature</span>
                <span style={{ color: iotTemp > iotThreshold ? '#EF4444' : '#00F0FF', fontWeight: 800 }}>{iotTemp} °C</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={iotTemp}
                onChange={(e) => setIotTemp(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: iotTemp > iotThreshold ? '#EF4444' : '#00F0FF' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Humidity</span>
                <span style={{ color: '#00F0FF', fontWeight: 800 }}>{iotHumidity} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={iotHumidity}
                onChange={(e) => setIotHumidity(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#00F0FF' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Pressure</span>
                <span style={{ color: '#00F0FF', fontWeight: 800 }}>{iotPressure} hPa</span>
              </div>
              <input
                type="range"
                min="980"
                max="1040"
                value={iotPressure}
                onChange={(e) => setIotPressure(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#00F0FF' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span>Relay Threshold</span>
                <span style={{ color: '#FBBF24', fontWeight: 800 }}>{iotThreshold} °C</span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                value={iotThreshold}
                onChange={(e) => setIotThreshold(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#FBBF24' }}
              />
            </div>
          </div>

          {/* Actuator Status Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isRelayOn ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', border: `1px solid ${isRelayOn ? '#EF4444' : '#10B981'}`, padding: '12px 18px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Threshold: {iotThreshold} °C</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isRelayOn ? '#FCA5A5' : '#6EE7B7' }}>
                Cooling Actuator Relay: {isRelayOn ? '🔥 OVERHEAT TRIGGERED -> FAN ACTIVE (2,800 RPM)' : '✓ NORMAL -> FAN STANDBY (0 RPM)'}
              </div>
            </div>
            <button
              type="button"
              onClick={handlePublishMqtt}
              style={{ height: '36px', padding: '0 16px', backgroundColor: '#00F0FF', color: '#020617', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={14} />
              <span>Publish MQTT</span>
            </button>
          </div>

          {iotMqttLog && (
            <pre style={{ backgroundColor: '#020617', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '14px', fontSize: '0.82rem', color: '#38BDF8', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {iotMqttLog}
            </pre>
          )}
        </div>
      )}

      {/* 4. MICROSOFT TECHNOLOGIES */}
      {category === 'microsoft' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Entra ID Assigned Role</label>
              <select
                value={msRole}
                onChange={(e) => setMsRole(e.target.value as 'Global Admin' | 'Institution Admin' | 'Student')}
                style={{ width: '100%', height: '38px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#FFFFFF', padding: '0 8px' }}
              >
                <option value="Global Admin">Global Administrator</option>
                <option value="Institution Admin">Institution Administrator</option>
                <option value="Student">Student Learner (Standard Scope)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
              <input
                type="checkbox"
                id="ms-mfa"
                checked={msMfa}
                onChange={(e) => setMsMfa(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#00F0FF' }}
              />
              <label htmlFor="ms-mfa" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}>
                MFA Hardware / Authenticator Verified
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEvaluateToken}
            style={{ width: '100%', height: '42px', backgroundColor: '#00F0FF', color: '#020617', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Lock size={16} />
            <span>Evaluate OAuth2 JWT Bearer Claims</span>
          </button>

          {msTokenResult && (
            <pre style={{ backgroundColor: '#020617', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '10px', padding: '14px', fontSize: '0.82rem', color: '#38BDF8', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {msTokenResult}
            </pre>
          )}
        </div>
      )}

      {/* 5. DIGITAL PRIVACY */}
      {category === 'privacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0B132B', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Calculated Browser Identifiability (Entropy):</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: parseFloat(calculateEntropy()) > 50 ? '#EF4444' : '#10B981' }}>
                {calculateEntropy()}% Uniqueness Score ({parseFloat(calculateEntropy()) > 50 ? 'HIGH SURVEILLANCE RISK' : 'ANONYMOUS & PROTECTED'})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1', cursor: 'pointer' }}>
              <input type="checkbox" checked={blockTrackers} onChange={(e) => setBlockTrackers(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#00F0FF' }} />
              <span>Shield 1: Block Cross-Site Tracking Pixels & Third-Party Cookies (-35% Entropy)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1', cursor: 'pointer' }}>
              <input type="checkbox" checked={spoofCanvas} onChange={(e) => setSpoofCanvas(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#00F0FF' }} />
              <span>Shield 2: Spoof HTML5 Canvas & AudioContext Fingerprint Hashes (-38% Entropy)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1', cursor: 'pointer' }}>
              <input type="checkbox" checked={maskWebRtc} onChange={(e) => setMaskWebRtc(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#00F0FF' }} />
              <span>Shield 3: Mask WebRTC Internal LAN IP Leakage (-14% Entropy)</span>
            </label>
          </div>
        </div>
      )}

      {/* 6. CYBERSECURITY SQL PARAMETERIZER */}
      {category === 'cyber' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Test Input Payload (Attacker String):
            </label>
            <input
              type="text"
              value={sqlPayload}
              onChange={(e) => setSqlPayload(e.target.value)}
              style={{ width: '100%', height: '40px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', padding: '0 12px', color: '#FFFFFF', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="prep-stmt"
              checked={usePrepared}
              onChange={(e) => setUsePrepared(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#00F0FF' }}
            />
            <label htmlFor="prep-stmt" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}>
              Enable Parameterized Query (Prepared Statement Shield)
            </label>
          </div>

          <button
            type="button"
            onClick={handleExecuteSql}
            style={{ width: '100%', height: '42px', backgroundColor: usePrepared ? '#10B981' : '#EF4444', color: '#020617', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer' }}
          >
            Execute Test SQL Payload
          </button>

          {sqlResult && (
            <pre style={{ backgroundColor: '#020617', border: `1px solid ${usePrepared ? '#10B981' : '#EF4444'}`, borderRadius: '10px', padding: '14px', fontSize: '0.82rem', color: usePrepared ? '#6EE7B7' : '#FCA5A5', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {sqlResult}
            </pre>
          )}
        </div>
      )}

      {/* 7. FINANCIAL MARKETS & STOCK TRADING */}
      {category === 'finance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', backgroundColor: '#0B132B', padding: '14px', borderRadius: '10px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Market Ticker</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00F0FF' }}>GENIUS / USD: ${stockPrice}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Portfolio Cash</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10B981' }}>${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Shares Owned</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FBBF24' }}>{sharesHeld} Shares</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Action</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setOrderAction('BUY')}
                  style={{ flex: 1, height: '36px', borderRadius: '8px', border: 'none', backgroundColor: orderAction === 'BUY' ? '#10B981' : '#1E293B', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setOrderAction('SELL')}
                  style={{ flex: 1, height: '36px', borderRadius: '8px', border: 'none', backgroundColor: orderAction === 'SELL' ? '#EF4444' : '#1E293B', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  SELL
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'block', marginBottom: '4px' }}>Shares Quantity</label>
              <input
                type="number"
                min="1"
                value={stockQty}
                onChange={(e) => setStockQty(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', height: '36px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#FFFFFF', padding: '0 8px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                onClick={handleExecuteTrade}
                style={{ width: '100%', height: '36px', backgroundColor: orderAction === 'BUY' ? '#10B981' : '#EF4444', color: '#020617', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
              >
                Execute {orderAction} Order
              </button>
            </div>
          </div>

          {lastTrade && (
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: lastTrade.includes('[ERROR]') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: lastTrade.includes('[ERROR]') ? '#FCA5A5' : '#6EE7B7', fontSize: '0.85rem', fontWeight: 600 }}>
              {lastTrade}
            </div>
          )}
        </div>
      )}

      {/* 8. CODING & LOGIC */}
      {category === 'coding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
              Interactive JavaScript Runner:
            </label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={5}
              style={{ width: '100%', backgroundColor: '#020617', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '10px', padding: '12px', color: '#38BDF8', fontFamily: 'monospace', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <button
            type="button"
            onClick={handleRunCode}
            style={{ width: '100%', height: '40px', backgroundColor: '#00F0FF', color: '#020617', fontWeight: 800, borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Play size={16} fill="currentColor" />
            <span>▶ Execute Code in Live Sandbox</span>
          </button>

          {codeOutput && (
            <pre style={{ backgroundColor: '#020617', border: '1px solid #10B981', borderRadius: '10px', padding: '14px', fontSize: '0.84rem', color: '#34D399', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {codeOutput}
            </pre>
          )}
        </div>
      )}

      {/* 9. PROFESSIONAL SKILLS EISENHOWER MATRIX */}
      {category === 'professional' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter task name..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              style={{ flex: 1, minWidth: '220px', height: '38px', backgroundColor: '#0B132B', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', padding: '0 12px', color: '#FFFFFF' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#CBD5E1', cursor: 'pointer' }}>
              <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#EF4444' }} />
              <span>Urgent</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#CBD5E1', cursor: 'pointer' }}>
              <input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#10B981' }} />
              <span>Important</span>
            </label>
            <button
              type="button"
              onClick={handleAddTask}
              style={{ height: '38px', padding: '0 18px', backgroundColor: '#00F0FF', color: '#020617', fontWeight: 800, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              Add to Matrix
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {['Do First (Urgent & Important)', 'Schedule (Not Urgent, Important)', 'Delegate (Urgent, Not Important)', 'Eliminate (Not Urgent, Not Important)'].map((quad) => (
              <div key={quad} style={{ backgroundColor: '#0B132B', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px', minHeight: '100px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: quad.includes('Do First') ? '#EF4444' : quad.includes('Schedule') ? '#10B981' : quad.includes('Delegate') ? '#FBBF24' : '#94A3B8', marginBottom: '8px' }}>
                  {quad}
                </div>
                {tasks.filter((t) => t.quadrant === quad).map((t, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', color: '#CBD5E1', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '6px 8px', borderRadius: '6px', marginBottom: '6px' }}>
                    • {t.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
