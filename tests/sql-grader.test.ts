import { describe, it, expect } from 'vitest';
import {
  validateStudentQuery,
  gradeSqlSubmission,
  runLocalQuery,
} from '../src/grader/sql-grader';

describe('SQL Injection Defense Grader & Sandbox Test Suite', () => {
  const validParameterizedQuery =
    "SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active'";

  describe('Stage 1 & 2: Static Analysis & Pre-Filtering', () => {
    it('accepts a clean, valid parameterized query template', () => {
      const res = validateStudentQuery(validParameterizedQuery);
      expect(res.isValid).toBe(true);
      if (res.isValid) {
        expect(res.cleanedQuery).toBe(validParameterizedQuery);
      }
    });

    it('rejects queries exceeding 300 characters', () => {
      const longQuery = 'SELECT id, username, role FROM challenge_users WHERE username = ? AND ' + 'a'.repeat(250);
      const res = validateStudentQuery(longQuery);
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.errorCode).toBe('LENGTH_EXCEEDED');
      }
    });

    it('rejects queries with single-line SQL comments (--)', () => {
      const queryWithComment = "SELECT id, username, role FROM challenge_users WHERE username = ? -- bypass check";
      const res = validateStudentQuery(queryWithComment);
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.errorCode).toBe('COMMENTS_FORBIDDEN');
      }
    });

    it('rejects queries with multi-line SQL comments (/* */)', () => {
      const queryWithComment = "SELECT id, username, role FROM challenge_users WHERE username = ? /* inline comment */";
      const res = validateStudentQuery(queryWithComment);
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.errorCode).toBe('COMMENTS_FORBIDDEN');
      }
    });

    it('rejects multi-statement queries with semicolons', () => {
      const stackedQuery = "SELECT id, username, role FROM challenge_users WHERE username = ?; DROP TABLE challenge_users;";
      const res = validateStudentQuery(stackedQuery);
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.errorCode).toBe('MULTIPLE_STATEMENTS');
      }
    });

    it('permits a harmless trailing semicolon at the end of single statement', () => {
      const trailingSemi = validParameterizedQuery + ';';
      const res = validateStudentQuery(trailingSemi);
      expect(res.isValid).toBe(true);
    });

    it('rejects non-SELECT statements (INSERT, UPDATE, DELETE, DROP)', () => {
      expect(validateStudentQuery("DELETE FROM challenge_users WHERE id = ?").isValid).toBe(false);
      expect(validateStudentQuery("DROP TABLE challenge_users").isValid).toBe(false);
      expect(validateStudentQuery("INSERT INTO challenge_users VALUES (?, ?, ?, ?)").isValid).toBe(false);
    });

    it('rejects dangerous keywords (PRAGMA, ATTACH, WITH RECURSIVE)', () => {
      expect(validateStudentQuery("SELECT * FROM challenge_users WHERE username = ? AND PRAGMA table_info").isValid).toBe(false);
      expect(validateStudentQuery("WITH RECURSIVE t AS (SELECT 1) SELECT * FROM challenge_users WHERE username = ?").isValid).toBe(false);
    });

    it('rejects queries missing the positional parameter placeholder (?)', () => {
      const hardcodedQuery = "SELECT id, username, role FROM challenge_users WHERE username = 'alice' AND account_status = 'active'";
      const res = validateStudentQuery(hardcodedQuery);
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.errorCode).toBe('MISSING_PLACEHOLDER');
      }
    });

    it('rejects queries targeting wrong table', () => {
      const wrongTable = "SELECT id, username, role FROM student_profiles WHERE username = ?";
      const res = validateStudentQuery(wrongTable);
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.errorCode).toBe('WRONG_TABLE');
      }
    });
  });

  describe('Stage 3: Server-Authoritative Execution & Parameter Binding Assertions', () => {
    it('awards 100 points and passes all 5 test cases on correct parameterized template', async () => {
      const result = await gradeSqlSubmission(validParameterizedQuery, 'assign-1', 'student-1', 1);

      expect(result.passed).toBe(true);
      expect(result.score).toBe(100);
      expect(result.test_results).toHaveLength(5);

      // Case 1: active user 'alice'
      expect(result.test_results[0].passed).toBe(true);
      expect(result.test_results[0].rows_returned).toBe(1);

      // Case 2: injection payload "' OR '1'='1" -> 0 rows returned
      expect(result.test_results[1].passed).toBe(true);
      expect(result.test_results[1].rows_returned).toBe(0);

      // Case 3: stacked drop attempt -> 0 rows returned, table intact
      expect(result.test_results[2].passed).toBe(true);
      expect(result.test_results[2].rows_returned).toBe(0);

      // Case 4: suspended user 'charlie' -> 0 rows returned (filtered out)
      expect(result.test_results[3].passed).toBe(true);
      expect(result.test_results[3].rows_returned).toBe(0);

      // Case 5: apostrophe safe handling "O'Reilly" -> 0 rows returned
      expect(result.test_results[4].passed).toBe(true);
      expect(result.test_results[4].rows_returned).toBe(0);
    });

    it('detects missing account_status check and fails Case 4 (suspended user check)', async () => {
      const flawedQuery = "SELECT id, username, role FROM challenge_users WHERE username = ?";
      const result = await gradeSqlSubmission(flawedQuery, 'assign-1', 'student-2', 1);

      expect(result.passed).toBe(false);
      expect(result.score).toBeLessThan(100);
      // Case 4 should fail because charlie was returned
      const case4 = result.test_results.find(r => r.case_id === 4);
      expect(case4?.passed).toBe(false);
      expect(case4?.rows_returned).toBe(1);
    });

    it('safely handles malformed syntax during grading', async () => {
      const malformed = "SELECT id, username, role FROM challenge_users WHERE username = ? AND (unbalanced";
      const result = await gradeSqlSubmission(malformed, 'assign-1', 'student-3', 1);

      expect(result.passed).toBe(false);
      expect(result.score).toBe(0);
      expect(result.test_results[0].passed).toBe(false);
    });
  });

  describe('Stage 4: Client-Side Instant Local Execution Runner', () => {
    it('executes parameterized local query and returns matching rows', async () => {
      const localRes = await runLocalQuery(validParameterizedQuery, 'alice');
      expect(localRes.success).toBe(true);
      expect(localRes.rows).toHaveLength(1);
      expect(localRes.rows[0].username).toBe('alice');
      expect(localRes.rows[0].role).toBe('learner');
    });

    it('demonstrates that attack payload returns empty set locally', async () => {
      const localRes = await runLocalQuery(validParameterizedQuery, "' OR '1'='1");
      expect(localRes.success).toBe(true);
      expect(localRes.rows).toHaveLength(0);
    });
  });
});
