import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { runLocalQuery, evaluateSqlChallenge } from '../grader/sql-grader';
import { InMemoryDatabase } from '../db/in-memory-db';
import { Shield, Play, Send, CheckCircle2, XCircle, AlertTriangle, Terminal, Lock, Info } from 'lucide-react';
import { GraderResult, TestCaseResult } from '../types';

interface SqlLabProps {
  db: InMemoryDatabase;
  currentUserId: string;
  assignmentId?: string;
  onSubmissionComplete?: () => void;
}

export const SqlLab: React.FC<SqlLabProps> = ({
  db,
  currentUserId,
  assignmentId = 'assign-lab-101',
  onSubmissionComplete,
}) => {
  // Default template demonstrating the secure pattern
  const defaultQuery = `SELECT id, username, role \nFROM challenge_users \nWHERE username = ? \n  AND account_status = 'active';`;

  const [query, setQuery] = useState(defaultQuery);
  const [testParam, setTestParam] = useState<string>("alice");
  const [localRunning, setLocalRunning] = useState(false);
  const [localResult, setLocalResult] = useState<{ columns: string[]; rows: any[]; error?: string } | null>(null);

  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GraderResult | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Run in local sandbox
  const handleRunLocal = async () => {
    setLocalRunning(true);
    setErrorBanner(null);
    try {
      const res = await runLocalQuery(query, testParam);
      if (res.success) {
        setLocalResult({
          columns: res.columns,
          rows: res.rows,
        });
      } else {
        setLocalResult({ columns: [], rows: [], error: res.error || 'Execution failed' });
      }
    } catch (err: any) {
      setLocalResult({ columns: [], rows: [], error: err.message || 'Error executing query' });
    } finally {
      setLocalRunning(false);
    }
  };

  // Submit to authoritative server grading
  const handleSubmitGrading = async () => {
    setGrading(true);
    setErrorBanner(null);
    try {
      // 1. Create submission draft in database (enforcing enrollment & attempt limit)
      const draft = db.createSubmissionDraft(currentUserId, assignmentId, query);

      // 2. Execute authoritative server-side challenge evaluation
      const evalResult = await evaluateSqlChallenge(query);

      // 3. Persist authoritative score and audit log
      db.persistServerGrade(
        draft.id,
        evalResult.passed,
        evalResult.score,
        evalResult.submission_hash,
        {
          execution_time_ms: evalResult.execution_time_ms,
          test_results: evalResult.test_results,
          details: evalResult.details,
        }
      );

      db.logAuditEvent({
        organization_id: 'org-school-1',
        actor_id: currentUserId,
        action_type: 'SUBMISSION_GRADED',
        resource_type: 'submission',
        resource_id: draft.id,
        ip_address: null,
        user_agent: null,
        details: {
          assignment_id: assignmentId,
          score: evalResult.score,
          passed: evalResult.passed,
          attempt: draft.attempt_number,
        },
      });

      setGradeResult(evalResult);
      if (onSubmissionComplete) {
        onSubmissionComplete();
      }
    } catch (err: any) {
      setErrorBanner(err.message || 'Submission failed');
    } finally {
      setGrading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Learning Objectives */}
      <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} color="var(--brand-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Lab 101: SQL Parameterization & Injection Defense</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Course: Web Application Defense Fundamentals • Level: Foundational
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-brand">Authoritative Grading</span>
            <span className="badge badge-neutral">SQLite-WASM</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.6' }}>
          <strong>The Vulnerability:</strong> When developers build SQL queries by concatenating raw strings (e.g.{' '}
          <code style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '2px 6px', borderRadius: '4px' }}>
            SELECT * FROM users WHERE name = '{`{input}`}'
          </code>
          ), malicious input like <code style={{ color: 'var(--danger-text)', fontWeight: 600 }}>' OR '1'='1</code> changes the query structure and bypasses authorization.
        </p>

        <div style={{ backgroundColor: 'var(--bg-surface-subdued)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>
            <Info size={16} color="var(--brand-primary)" />
            <span>Mission Objective:</span>
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            <li>Write a parameterized query using the positional parameter placeholder <code style={{ fontWeight: 600 }}>?</code>.</li>
            <li>Select only the columns <code style={{ fontWeight: 600 }}>id, username, role</code> from <code style={{ fontWeight: 600 }}>challenge_users</code>.</li>
            <li>Filter by <code style={{ fontWeight: 600 }}>username = ?</code> and ensure <code style={{ fontWeight: 600 }}>account_status = 'active'</code>.</li>
            <li>Pass all 5 automated server-authoritative defense assertions to earn 100 points.</li>
          </ul>
        </div>
      </div>

      {/* Error Banner */}
      {errorBanner && (
        <div style={{
          backgroundColor: 'var(--danger-bg)',
          border: '1px solid var(--danger-border)',
          color: 'var(--danger-text)',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={20} />
          <span>{errorBanner}</span>
        </div>
      )}

      {/* Editor & Local Test Bench */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--brand-primary)" />
            <span style={{ fontWeight: 600 }}>SQL Template Query Editor</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Positional parameter placeholder: <code style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>?</code>
          </span>
        </div>

        <CodeEditor value={query} onChange={setQuery} minHeight="160px" />

        {/* Local Sandbox Runner Bar */}
        <div style={{
          marginTop: '16px',
          padding: '14px',
          backgroundColor: 'var(--bg-surface-subdued)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px' }}>
              <label htmlFor="test-input" style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Test Value (?):
              </label>
              <input
                id="test-input"
                type="text"
                value={testParam}
                onChange={(e) => setTestParam(e.target.value)}
                placeholder="e.g. alice or ' OR '1'='1"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-surface)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleRunLocal}
                disabled={localRunning}
                style={{ height: '40px', padding: '0 14px' }}
                aria-label="Run query locally with test value"
              >
                <Play size={16} />
                <span>{localRunning ? 'Running...' : 'Run in Sandbox'}</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmitGrading}
                disabled={grading}
                style={{ height: '40px', padding: '0 16px' }}
                aria-label="Submit query for authoritative grading"
              >
                <Send size={16} />
                <span>{grading ? 'Evaluating...' : 'Submit to Server'}</span>
              </button>
            </div>
          </div>

          {/* Quick Attack Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Quick Payloads:</span>
            <button
              type="button"
              onClick={() => setTestParam("alice")}
              style={{ minHeight: '28px', height: '28px', padding: '0 8px', fontSize: '0.78rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
            >
              Legitimate ("alice")
            </button>
            <button
              type="button"
              onClick={() => setTestParam("' OR '1'='1")}
              style={{ minHeight: '28px', height: '28px', padding: '0 8px', fontSize: '0.78rem', backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: '4px' }}
            >
              Injection ("' OR '1'='1")
            </button>
            <button
              type="button"
              onClick={() => setTestParam("eve_suspended")}
              style={{ minHeight: '28px', height: '28px', padding: '0 8px', fontSize: '0.78rem', backgroundColor: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', borderRadius: '4px' }}
            >
              Suspended User ("eve_suspended")
            </button>
            <button
              type="button"
              onClick={() => setTestParam("o'connor")}
              style={{ minHeight: '28px', height: '28px', padding: '0 8px', fontSize: '0.78rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}
            >
              Apostrophe ("o'connor")
            </button>
          </div>
        </div>

        {/* Local Sandbox Results */}
        {localResult && (
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={15} /> Sandbox Execution Output:
            </h4>
            {localResult.error ? (
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: '6px', fontSize: '0.85rem' }}>
                {localResult.error}
              </div>
            ) : (
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-surface-subdued)', textAlign: 'left' }}>
                      {localResult.columns?.map((col) => (
                        <th key={col} style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {localResult.rows && localResult.rows.length > 0 ? (
                      localResult.rows.map((row: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          {localResult.columns.map((col: string, cIdx: number) => (
                            <td key={cIdx} style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)' }}>
                              {String(row[col] !== undefined ? row[col] : '')}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={localResult.columns?.length || 1} style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          (0 rows returned — Safe parameter binding successfully prevented injection expansion!)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Authoritative Server Grading Report */}
      {gradeResult && (
        <div className="card-elevated" style={{ border: gradeResult.passed ? '2px solid var(--success)' : '2px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {gradeResult.passed ? (
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={26} color="var(--success)" />
                </div>
              ) : (
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={26} color="var(--warning)" />
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>
                  {gradeResult.passed ? 'Assessment Passed: SQL Injection Defeated!' : 'Assessment Incomplete'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Authoritative score: <strong>{gradeResult.score} / 100</strong> • Evaluated in {gradeResult.execution_time_ms.toFixed(1)}ms
                </p>
              </div>
            </div>

            <span className={`badge ${gradeResult.passed ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
              {gradeResult.passed ? 'VERIFIED PASSED' : 'RETRY REQUIRED'}
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            {gradeResult.details}
          </p>

          {/* Test Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Server Test Suite Assertions:
            </h4>
            {gradeResult.test_results.map((tr: TestCaseResult) => (
              <div
                key={tr.case_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: tr.passed ? 'var(--success-bg)' : 'var(--danger-bg)',
                  border: `1px solid ${tr.passed ? 'var(--success-border)' : 'var(--danger-border)'}`,
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {tr.passed ? <CheckCircle2 size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
                  <span style={{ fontWeight: 600, color: tr.passed ? 'var(--success-text)' : 'var(--danger-text)' }}>
                    {tr.description}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {tr.diagnostic}
                </span>
              </div>
            ))}
          </div>

          {/* Anti-tamper Hash */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Lock size={14} />
            <span>Submission Integrity Hash: <code>{gradeResult.submission_hash}</code></span>
          </div>
        </div>
      )}
    </div>
  );
};
