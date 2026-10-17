// ====================================================================
// Geniusphere — Server-Authoritative SQL Grader
// Isolated SQLite-WASM Sandbox & Genuine Parameter Binding
// ====================================================================

import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { GraderResult, TestCaseResult } from '../types';

let SQLInstance: SqlJsStatic | null = null;

export async function getSqlJsInstance(): Promise<SqlJsStatic> {
  if (!SQLInstance) {
    SQLInstance = await initSqlJs();
  }
  return SQLInstance;
}

export interface ValidationError {
  isValid: false;
  errorCode: 'LENGTH_EXCEEDED' | 'MULTIPLE_STATEMENTS' | 'COMMENTS_FORBIDDEN' | 'INVALID_STATEMENT' | 'FORBIDDEN_KEYWORD' | 'MISSING_PLACEHOLDER' | 'WRONG_TABLE';
  errorMessage: string;
}

export interface ValidationSuccess {
  isValid: true;
  cleanedQuery: string;
}

export type QueryValidationResult = ValidationSuccess | ValidationError;

/**
 * Stage 1 & 2: Static Analysis, Lexical & Grammar Pre-Filtering
 */
export function validateStudentQuery(rawQuery: string): QueryValidationResult {
  const trimmed = rawQuery.trim();

  // 1. Length constraint (max 300 characters)
  if (trimmed.length === 0) {
    return {
      isValid: false,
      errorCode: 'INVALID_STATEMENT',
      errorMessage: 'Query cannot be empty.',
    };
  }

  if (trimmed.length > 300) {
    return {
      isValid: false,
      errorCode: 'LENGTH_EXCEEDED',
      errorMessage: `Query length (${trimmed.length} chars) exceeds the maximum limit of 300 characters.`,
    };
  }

  // 2. Reject SQL comments (-- or /* */) to prevent obfuscation
  if (trimmed.includes('--') || trimmed.includes('/*') || trimmed.includes('*/')) {
    return {
      isValid: false,
      errorCode: 'COMMENTS_FORBIDDEN',
      errorMessage: 'SQL comments (-- or /* */) are forbidden in lab submissions.',
    };
  }

  // 3. Reject multiple statements (semicolon followed by non-whitespace)
  const semicolonIndex = trimmed.indexOf(';');
  if (semicolonIndex !== -1 && semicolonIndex < trimmed.length - 1) {
    const trailing = trimmed.slice(semicolonIndex + 1).trim();
    if (trailing.length > 0) {
      return {
        isValid: false,
        errorCode: 'MULTIPLE_STATEMENTS',
        errorMessage: 'Multiple statements are forbidden. Only a single SELECT query template is allowed.',
      };
    }
  }

  // Normalize query for keyword checks (remove trailing semicolon)
  const clean = trimmed.endsWith(';') ? trimmed.slice(0, -1).trim() : trimmed;

  // 4. Must begin with SELECT
  if (!/^SELECT\s+/i.test(clean)) {
    return {
      isValid: false,
      errorCode: 'INVALID_STATEMENT',
      errorMessage: 'Only single SELECT statement query templates are permitted.',
    };
  }

  // 5. Forbidden DDL / DML / Dangerous keywords
  const forbiddenKeywords = [
    /\bINSERT\b/i,
    /\bUPDATE\b/i,
    /\bDELETE\b/i,
    /\bDROP\b/i,
    /\bALTER\b/i,
    /\bCREATE\b/i,
    /\bATTACH\b/i,
    /\bDETACH\b/i,
    /\bPRAGMA\b/i,
    /\bWITH\s+RECURSIVE\b/i,
    /\bUNION\b/i,
    /\bINTO\b/i,
    /\bEXEC\b/i,
    /\bEXECUTE\b/i,
  ];

  for (const pattern of forbiddenKeywords) {
    if (pattern.test(clean)) {
      return {
        isValid: false,
        errorCode: 'FORBIDDEN_KEYWORD',
        errorMessage: `Query contains forbidden operation or keyword matching ${pattern}.`,
      };
    }
  }

  // 6. Must target challenge_users table
  if (!/\bFROM\s+challenge_users\b/i.test(clean)) {
    return {
      isValid: false,
      errorCode: 'WRONG_TABLE',
      errorMessage: 'Query must select from the "challenge_users" table.',
    };
  }

  // 7. Must contain positional parameter placeholder '?'
  if (!clean.includes('?')) {
    return {
      isValid: false,
      errorCode: 'MISSING_PLACEHOLDER',
      errorMessage: 'Query must use a positional parameter placeholder (?) for safe value binding.',
    };
  }

  return {
    isValid: true,
    cleanedQuery: clean,
  };
}

/**
 * Creates and seeds a clean, isolated in-memory SQLite sandbox database
 */
export async function createSeededSandbox(): Promise<Database> {
  const SQL = await getSqlJsInstance();
  const db = new SQL.Database();

  db.run(`
    CREATE TABLE challenge_users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      account_status TEXT NOT NULL
    );
    INSERT INTO challenge_users VALUES
    (1, 'alice', 'learner', 'active'),
    (2, 'bob', 'teacher', 'active'),
    (3, 'charlie', 'learner', 'suspended');
  `);

  return db;
}

/**
 * Stage 3: Server-Authoritative Grader Engine
 * Executes 5 challenge test cases using genuine SQLite parameter binding
 */
export async function gradeSqlSubmission(
  rawQuery: string,
  assignmentId: string,
  studentId: string,
  attemptNumber: number = 1,
  timeoutMs: number = 1000
): Promise<GraderResult> {
  const startTime = performance.now();
  const submissionId = crypto.randomUUID();

  // Step 1: Pre-execution validation
  const validation = validateStudentQuery(rawQuery);
  if (!validation.isValid) {
    return {
      submission_id: submissionId,
      submission_hash: `sha256:err-${submissionId.slice(0, 8)}`,
      passed: false,
      score: 0,
      attempt_number: attemptNumber,
      execution_time_ms: Math.round(performance.now() - startTime),
      details: validation.errorMessage,
      test_results: [
        {
          case_id: 0,
          description: 'Static query validation & AST pre-filtering',
          input_value: 'N/A',
          passed: false,
          diagnostic: validation.errorMessage,
        },
      ],
    };
  }

  const query = validation.cleanedQuery;
  const db = await createSeededSandbox();

  // Test definitions
  const testCases = [
    {
      case_id: 1,
      description: 'Legitimate active user lookup (username: "alice")',
      input: 'alice',
      assertion: (rows: any[]) => {
        if (rows.length !== 1) return { passed: false, msg: `Expected 1 row, got ${rows.length}` };
        const row = rows[0];
        const hasAlice = (row.username === 'alice' || row[1] === 'alice');
        return {
          passed: hasAlice,
          msg: hasAlice ? 'Verified active lookup' : 'Row does not contain alice',
        };
      },
    },
    {
      case_id: 2,
      description: 'Classic SQL injection attempt (payload: "\' OR \'1\'=\'1")',
      input: "' OR '1'='1",
      assertion: (rows: any[]) => {
        // Parameter binding treats "' OR '1'='1" as literal username. No such user exists -> 0 rows.
        const passed = rows.length === 0;
        return {
          passed,
          msg: passed
            ? 'Injection defeated: payload treated as literal string, returned 0 rows.'
            : `Vulnerability detected: injection bypassed logic, returning ${rows.length} rows!`,
        };
      },
    },
    {
      case_id: 3,
      description: 'Stacked query & drop table attempt (payload: "alice\'; DROP TABLE challenge_users; --")',
      input: "alice'; DROP TABLE challenge_users; --",
      assertion: (rows: any[], currentDb: Database) => {
        // Assert table is still intact and query returned 0 rows
        let tableIntact = false;
        try {
          const check = currentDb.exec('SELECT COUNT(*) FROM challenge_users');
          tableIntact = check.length > 0 && check[0].values[0][0] === 3;
        } catch {
          tableIntact = false;
        }
        const passed = rows.length === 0 && tableIntact;
        return {
          passed,
          msg: passed
            ? 'Defense verified: stacked drop treated as literal string; database intact.'
            : 'Integrity compromised or query returned unexpected rows.',
        };
      },
    },
    {
      case_id: 4,
      description: 'Suspended user status enforcement (username: "charlie")',
      input: 'charlie',
      assertion: (rows: any[]) => {
        // Charlie is suspended. Query must have `account_status = 'active'`, so 0 rows returned.
        const passed = rows.length === 0;
        return {
          passed,
          msg: passed
            ? 'Account status enforcement verified: suspended user filtered out.'
            : 'Suspended user was improperly returned; ensure account_status = "active" is checked.',
        };
      },
    },
    {
      case_id: 5,
      description: 'Special character and apostrophe safety (username: "O\'Reilly")',
      input: "O'Reilly",
      assertion: (rows: any[]) => {
        // Executes without SQL syntax crash; returns 0 rows.
        const passed = rows.length === 0;
        return {
          passed,
          msg: passed
            ? 'Parameter binding safely handled literal apostrophe without syntax error.'
            : 'Apostrophe caused unexpected row match.',
        };
      },
    },
  ];

  const results: TestCaseResult[] = [];
  let allPassed = true;

  try {
    for (const tc of testCases) {
      // Check execution time against timeout watchdog
      const elapsed = performance.now() - startTime;
      if (elapsed > timeoutMs) {
        db.close();
        return {
          submission_id: submissionId,
          submission_hash: 'sha256:timeout-watchdog',
          passed: false,
          score: 0,
          attempt_number: attemptNumber,
          execution_time_ms: Math.round(elapsed),
          details: 'Execution timed out after 1,000ms. Watchdog terminated grading process.',
          test_results: results,
        };
      }

      let rows: any[] = [];
      try {
        const stmt = db.prepare(query);
        // Bind the challenge input parameter safely using native SQLite parameter binding
        stmt.bind([tc.input]);
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();

        const outcome = tc.assertion(rows, db);
        results.push({
          case_id: tc.case_id,
          description: tc.description,
          input_value: tc.input,
          passed: outcome.passed,
          diagnostic: outcome.msg,
          rows_returned: rows.length,
        });

        if (!outcome.passed) {
          allPassed = false;
        }
      } catch (err: any) {
        allPassed = false;
        results.push({
          case_id: tc.case_id,
          description: tc.description,
          input_value: tc.input,
          passed: false,
          diagnostic: `Execution Error: ${err.message || String(err)}`,
          rows_returned: 0,
        });
      }
    }
  } finally {
    db.close();
  }

  const durationMs = Math.round(performance.now() - startTime);
  const score = allPassed ? 100 : Math.round((results.filter(r => r.passed).length / testCases.length) * 100);
  const submissionHash = `sha256:${Buffer.from(`${assignmentId}:${studentId}:${rawQuery}:${durationMs}:${score}`).toString('base64').slice(0, 32)}`;

  return {
    submission_id: submissionId,
    submission_hash: submissionHash,
    passed: allPassed,
    score,
    attempt_number: attemptNumber,
    execution_time_ms: durationMs,
    details: allPassed
      ? 'All 5 server-controlled challenge assertions PASSED. SQL parameterization verified.'
      : 'One or more assertions failed. Review diagnostic hints to correct query parameterization.',
    test_results: results,
  };
}

/**
 * Convenient evaluation wrapper for interactive playground
 */
export async function evaluateSqlChallenge(query: string): Promise<GraderResult> {
  return gradeSqlSubmission(query, 'assign-lab-101', 'sandbox-student', 1);
}

/**
 * Client-Side Instant Local Runner
 * Used in the interactive browser editor for zero-network instantaneous feedback.
 */
export async function runLocalQuery(
  rawQuery: string,
  paramValue: string
): Promise<{ success: boolean; columns: string[]; rows: any[]; error?: string; executionTimeMs: number }> {
  const start = performance.now();
  try {
    const db = await createSeededSandbox();
    const clean = rawQuery.trim().endsWith(';') ? rawQuery.trim().slice(0, -1).trim() : rawQuery.trim();
    const stmt = db.prepare(clean);
    stmt.bind([paramValue]);
    const columns = stmt.getColumnNames();
    const rows: any[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    db.close();
    return {
      success: true,
      columns,
      rows,
      executionTimeMs: Math.round(performance.now() - start),
    };
  } catch (err: any) {
    return {
      success: false,
      columns: [],
      rows: [],
      error: err.message || String(err),
      executionTimeMs: Math.round(performance.now() - start),
    };
  }
}
