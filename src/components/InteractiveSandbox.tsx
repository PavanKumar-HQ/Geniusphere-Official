import React, { useState } from 'react';
import { SandboxConfig } from '../types';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface InteractiveSandboxProps {
  config: SandboxConfig;
  onSuccess?: (xpAwarded: number) => void;
  onComplete?: () => void;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({ config, onSuccess, onComplete }) => {
  const [userInput, setUserInput] = useState<string>(config.defaultInput || '');
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failure'>('idle');
  const [completed, setCompleted] = useState(false);

  const handleRunSimulation = () => {
    setStatus('running');
    setOutput('Initiating sandbox execution environment...\nBinding parameters and parsing logic tree...');

    setTimeout(() => {
      const trimmed = userInput.trim();
      let isSuccess = false;
      let logs = '';

      if (config.type === 'code_runner') {
        if (trimmed.length > 10) {
          isSuccess = true;
          logs = `[SUCCESS] Output compiled: Syntax valid.\nExecuting assertions: \n- Test Case 1: PASS (deterministic output)\n- Test Case 2: PASS (boundary constraints)\nResult: 100% verified.`;
        } else {
          logs = `[ERROR] Incomplete implementation. Please write a complete logic statement.`;
        }
      } else if (config.type === 'logic_simulator') {
        if (trimmed.includes('AND') || trimmed.includes('OR') || trimmed.includes('==') || trimmed.includes('return')) {
          isSuccess = true;
          logs = `[SUCCESS] Logic gate network simulated.\nBoolean truth table matched: 4/4 assertions confirmed.`;
        } else {
          logs = `[INFO] Expression evaluated to standard default. Try inserting conditional operators.`;
        }
      } else {
        // General parameter & logic verification
        if (trimmed.length >= 4) {
          isSuccess = true;
          logs = `[PASSED] Execution completed cleanly in 12ms.\nOutput matches expected sandbox state:\n${config.expectedOutput || 'Simulation verified.'}`;
        } else {
          logs = `[WARN] Input too short. Please supply parameter value.`;
        }
      }

      setOutput(logs);
      if (isSuccess) {
        setStatus('success');
        if (!completed) {
          setCompleted(true);
          onSuccess?.(100);
          onComplete?.();
        }
      } else {
        setStatus('failure');
      }
    }, 600);
  };

  const handleReset = () => {
    setUserInput(config.defaultInput || '');
    setOutput(null);
    setStatus('idle');
  };

  return (
    <div
      style={{
        backgroundColor: '#070D1F',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), var(--glow-green)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--brand-accent-surface)', color: 'var(--brand-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Terminal size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Interactive Sandbox Simulation
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
              {config.title}
            </h4>
          </div>
        </div>

        {completed && (
          <div className="badge badge-accent" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
            <CheckCircle2 size={14} />
            <span>+100 XP Earned</span>
          </div>
        )}
      </div>

      {/* Challenge Prompt */}
      <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--brand-cyan-light)', marginBottom: '4px' }}>
          <Sparkles size={14} />
          <span>Challenge Objective:</span>
        </div>
        {config.prompt}
      </div>

      {/* Interactive Code / Parameter Editor */}
      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Interactive Input Sandbox:
        </label>
        <textarea
          rows={5}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter logic statements, parameters, or code here..."
          className="form-input"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            backgroundColor: '#030612',
            borderColor: status === 'success' ? '#10B981' : 'var(--border-subtle)',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleReset}
          className="btn-secondary"
          style={{ height: '36px', fontSize: '0.82rem' }}
        >
          <RotateCcw size={14} />
          <span>Reset Code</span>
        </button>

        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={status === 'running'}
          className="btn-accent"
          style={{ height: '38px', padding: '0 20px', fontSize: '0.88rem' }}
        >
          <Play size={15} />
          <span>{status === 'running' ? 'Running Simulation...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Terminal Output */}
      {output && (
        <div
          style={{
            backgroundColor: '#02040A',
            border: status === 'success' ? '1px solid #10B981' : '1px solid #334155',
            borderRadius: '10px',
            padding: '14px 18px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: status === 'success' ? '#34D399' : '#94A3B8',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}
        >
          {output}
        </div>
      )}

      {/* Conceptual Explanation */}
      {config.explanation && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <HelpCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{config.explanation}</span>
        </div>
      )}
    </div>
  );
};
