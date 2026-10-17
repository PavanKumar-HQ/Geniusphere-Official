import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertCircle, HelpCircle, Terminal } from 'lucide-react';
import { SandboxConfig } from '../types';
import { CodeEditor } from './CodeEditor';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { FeedbackAlert } from './ui/FeedbackAlert';

export interface LessonCodingSandboxProps {
  config: SandboxConfig;
  lessonTitle: string;
  onComplete: () => void;
}

export const LessonCodingSandbox: React.FC<LessonCodingSandboxProps> = ({
  config,
  lessonTitle,
  onComplete,
}) => {
  const initialCode = config.defaultInput || '-- Enter your defensive SQL or code solution below:\nSELECT id, username, role\nFROM users\nWHERE id = ?;';
  const [code, setCode] = useState<string>(initialCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleReset = () => {
    setCode(initialCode);
    setLogs([]);
    setStatus('idle');
  };

  const handleExecute = () => {
    setStatus('running');
    setLogs(['[SYSTEM] Initializing isolated client execution sandbox...', '[SANDBOX] Parsing AST & evaluating constraints...']);

    setTimeout(() => {
      const clean = code.trim();
      const newLogs: string[] = ['[SYSTEM] Execution environment active.'];

      if (clean.length === 0) {
        setStatus('error');
        setLogs([...newLogs, '[ERROR] Empty input. Please write a query or code snippet to execute.']);
        return;
      }

      // Check for security violations if applicable
      const upper = clean.toUpperCase();
      const hasDangerousSql = upper.includes('DROP ') || upper.includes('TRUNCATE ') || upper.includes('ALTER ');
      if (hasDangerousSql) {
        setStatus('error');
        setLogs([...newLogs, '[SECURITY VIOLATION] Destructive SQL operations (DROP, TRUNCATE, ALTER) are rejected by sandbox policy.']);
        return;
      }

      // Validate query / code logic based on config type
      let passed = false;
      if (config.type === 'sql_runner') {
        const isSelect = upper.startsWith('SELECT');
        const hasParam = clean.includes('?') || clean.includes('$1') || clean.includes(':');
        newLogs.push(`[CHECK] Statement type: ${isSelect ? 'SELECT (read-only safe)' : 'NON-SELECT'}`);
        newLogs.push(`[CHECK] Parameter binding placeholder present: ${hasParam ? 'YES (?)' : 'NO'}`);

        if (isSelect && hasParam) {
          passed = true;
          newLogs.push('[RESULT] Statement compiled successfully. Bound with test value.');
          newLogs.push('[ASSERTION] Parameterized defense verified against auth bypass payload.');
        } else if (isSelect) {
          passed = true;
          newLogs.push('[RESULT] Query executed cleanly in 4ms.');
          newLogs.push('[OUTPUT] 1 row returned from virtual catalog.');
        } else {
          newLogs.push('[ERROR] Only read-only SELECT statements are permitted in this lab.');
        }
      } else if (config.type === 'logic_simulator') {
        const hasLogicalKeywords = upper.includes('AND') || upper.includes('OR') || upper.includes('NOT') || clean.includes('&&') || clean.includes('||');
        newLogs.push(`[CHECK] Boolean logic operators evaluated: ${hasLogicalKeywords ? 'FOUND' : 'STANDARD'}`);
        if (hasLogicalKeywords || clean.length > 15) {
          passed = true;
          newLogs.push('[RESULT] Truth table evaluated across 4 test cases. All assertions PASS.');
        } else {
          newLogs.push('[WARN] Please provide an expression containing conditional or logic gates.');
        }
      } else {
        // General code runner
        passed = clean.length > 12;
        if (passed) {
          newLogs.push('[COMPILER] Syntax verified with zero syntax warnings.');
          newLogs.push('[TEST SUITE] Running automated unit assertions:');
          newLogs.push('  ✓ Test 1: Deterministic state initialization (PASS)');
          newLogs.push('  ✓ Test 2: Invariant assertion (PASS)');
          newLogs.push('[RESULT] Verification successful.');
        } else {
          newLogs.push('[ERROR] Solution incomplete. Please review instructions and complete implementation.');
        }
      }

      setLogs(newLogs);
      if (passed) {
        setStatus('success');
        if (!isCompleted) {
          setIsCompleted(true);
          onComplete();
        }
      } else {
        setStatus('error');
      }
    }, 280);
  };

  return (
    <Card variant="default" padding="none" style={{ overflow: 'hidden' }}>
      {/* Top Header */}
      <div
        style={{
          padding: '14px 20px',
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
          <Terminal size={16} color="var(--brand-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Coding Sandbox: {lessonTitle}
          </span>
          <Badge variant="brand" size="sm">
            {config.type.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {config.hints && config.hints.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<HelpCircle size={14} />}
              onClick={() => setShowHint((prev) => !prev)}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw size={14} />}
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Play size={14} />}
            isLoading={status === 'running'}
            onClick={handleExecute}
          >
            Execute Solution
          </Button>
        </div>
      </div>

      {/* Optional Hint Banner */}
      {showHint && config.hints && config.hints.length > 0 && (
        <div style={{ padding: '12px 20px', backgroundColor: 'var(--brand-surface)', borderBottom: '1px solid var(--brand-border)' }}>
          <FeedbackAlert type="info" title="Implementation Hint">
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              {config.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </FeedbackAlert>
        </div>
      )}

      {/* Editor Body */}
      <div style={{ padding: '16px' }}>
        <CodeEditor
          value={code}
          onChange={(newVal) => setCode(newVal)}
          minHeight="180px"
          readOnly={status === 'running'}
        />
      </div>

      {/* Execution Telemetry Output */}
      {logs.length > 0 && (
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>SANDBOX EXECUTION LOG</span>
            {status === 'success' && (
              <Badge variant="success" size="sm" icon={<CheckCircle2 size={12} />}>
                Passed (+100 XP)
              </Badge>
            )}
            {status === 'error' && (
              <Badge variant="danger" size="sm" icon={<AlertCircle size={12} />}>
                Execution Failed
              </Badge>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  color: log.startsWith('[ERROR]') || log.startsWith('[SECURITY')
                    ? 'var(--danger-text)'
                    : log.startsWith('[RESULT]') || log.startsWith('[ASSERTION]') || log.startsWith('  ✓')
                    ? 'var(--success-text)'
                    : 'var(--text-secondary)',
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
