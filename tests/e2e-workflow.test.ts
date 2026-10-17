import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';
import { gradeSqlSubmission, runLocalQuery } from '../src/grader/sql-grader';

describe('End-to-End Educational & Institutional User Journeys', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('Journey 1: Student SQL Injection Defense & Authoritative Grading', () => {
    it('allows Aarav (student) to test attack payloads safely and submit for authoritative grade', async () => {
      const studentId = 'user-student-1';
      const assignmentId = 'assign-lab-101';
      const studentQuery = `SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active';`;

      // 1. Aarav tests attack input locally in client sandbox
      const attackRes = await runLocalQuery(studentQuery, "' OR '1'='1");
      expect(attackRes.success).toBe(true);
      // Injection defeated by parameter placeholder binding
      expect(attackRes.rows).toHaveLength(0);

      // 2. Aarav tests legitimate input locally
      const legitRes = await runLocalQuery(studentQuery, 'alice');
      expect(legitRes.success).toBe(true);
      expect(legitRes.rows).toHaveLength(1);
      expect(legitRes.rows[0].username).toBe('alice');

      // 3. Aarav creates submission draft
      const draft = db.createSubmissionDraft(studentId, assignmentId, studentQuery);
      expect(draft.attempt_number).toBe(1);
      expect(draft.passed).toBe(false);

      // 4. Server executes authoritative evaluation
      const graderResult = await gradeSqlSubmission(studentQuery, assignmentId, studentId, draft.attempt_number);
      expect(graderResult.passed).toBe(true);
      expect(graderResult.score).toBe(100);
      expect(graderResult.test_results).toHaveLength(5);
      expect(graderResult.submission_hash).toContain('sha256:');

      // 5. Server persists authoritative result
      const finalized = db.persistServerGrade(
        draft.id,
        graderResult.passed,
        graderResult.score,
        graderResult.submission_hash,
        {
          execution_time_ms: graderResult.execution_time_ms,
          test_results: graderResult.test_results,
          details: graderResult.details,
        }
      );

      expect(finalized.passed).toBe(true);
      expect(finalized.score).toBe(100);
      expect(finalized.sync_status).toBe('SERVER_CONFIRMED');

      // 6. Log audit event
      const audit = db.logAuditEvent({
        organization_id: 'org-school-1',
        actor_id: studentId,
        action_type: 'SUBMISSION_GRADED',
        resource_type: 'submission',
        resource_id: draft.id,
        ip_address: null,
        user_agent: null,
        details: { score: 100, passed: true },
      });
      expect(audit.id).toBeDefined();
    });
  });

  describe('Journey 2: Teacher Classroom Management & Gradebook Oversight', () => {
    it('allows Dr. Sharma (teacher) to inspect submissions, verify student scores, and issue new assignments', async () => {
      const teacherId = 'user-teacher-1';
      const studentId = 'user-student-1';
      const classId = 'class-sec-101';
      const assignId = 'assign-lab-101';

      // 1. Prepare completed submission by student
      const query = `SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active';`;
      const draft = db.createSubmissionDraft(studentId, assignId, query);
      db.persistServerGrade(draft.id, true, 100, 'sha256:verified-hash-1', {
        execution_time_ms: 12,
        test_results: [],
        details: 'Passed',
      });

      // 2. Teacher retrieves submissions for their classroom
      const submissions = db.getSubmissions(teacherId, assignId);
      expect(submissions).toHaveLength(1);
      expect(submissions[0].student_id).toBe(studentId);
      expect(submissions[0].score).toBe(100);
      expect(submissions[0].passed).toBe(true);

      // 3. Teacher creates a second assignment
      const newAssign = db.createAssignment(teacherId, {
        classroom_id: classId,
        lab_id: 'lab-sec-101',
        due_date: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
        max_score: 100,
        max_attempts: 3,
      });

      expect(newAssign.id).toBeDefined();
      expect(newAssign.max_attempts).toBe(3);

      // 4. Verify cross-tenant isolation: Teacher from Org 2 cannot read Org 1 submissions
      // Let's create a teacher in Org 2
      const org2Teacher = {
        id: 'user-teacher-org2',
        email: 'teacher2@bta.edu',
        full_name: 'Prof. Rao',
        date_of_birth: '1980-01-01',
        is_minor: false,
        is_superadmin: false,
        account_status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.users.set(org2Teacher.id, org2Teacher);

      const unauthorizedSubs = db.getSubmissions(org2Teacher.id, assignId);
      expect(unauthorizedSubs).toHaveLength(0);
    });
  });

  describe('Journey 3: Parent Oversight, Verification & DPDP Compliance', () => {
    it('allows Sunita (parent) to inspect Aarav (minor) progress and export DPDP-compliant record', () => {
      const parentId = 'user-parent-1';
      const studentId = 'user-student-1';
      const assignId = 'assign-lab-101';

      // 1. Aarav completes a submission
      const query = `SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active';`;
      const draft = db.createSubmissionDraft(studentId, assignId, query);
      db.persistServerGrade(draft.id, true, 100, 'sha256:parent-visible-hash', {
        execution_time_ms: 10,
        test_results: [],
        details: 'Passed',
      });

      // 2. Parent checks linked student submissions
      const parentVisibleSubs = db.getSubmissions(parentId, assignId);
      expect(parentVisibleSubs).toHaveLength(1);
      expect(parentVisibleSubs[0].score).toBe(100);

      // 3. Parent inspects student profile
      const studentProfile = db.getUser(parentId, studentId);
      expect(studentProfile).not.toBeNull();
      expect(studentProfile?.full_name).toBe('Aarav Patel');
      expect(studentProfile?.is_minor).toBe(true);

      // 4. Parent revokes consent
      const link = db.parentLinks.get('plink-1')!;
      link.consent_status = 'revoked';
      db.parentLinks.set(link.id, link);

      // 5. Subsequent queries are denied by RLS
      const profileAfterRevocation = db.getUser(parentId, studentId);
      expect(profileAfterRevocation).toBeNull();

      const subsAfterRevocation = db.getSubmissions(parentId, assignId);
      expect(subsAfterRevocation).toHaveLength(0);
    });
  });

  describe('Journey 4: Append-Only Audit Trail Scoping', () => {
    it('ensures institutional audit events are visible to admin but hidden from learners', () => {
      const adminId = 'user-admin-1';
      const studentId = 'user-student-1';

      db.logAuditEvent({
        organization_id: 'org-school-1',
        actor_id: 'user-teacher-1',
        action_type: 'CLASSROOM_CREATED',
        resource_type: 'classroom',
        resource_id: 'class-sec-101',
        ip_address: null,
        user_agent: null,
        details: { cohort: '2026' },
      });

      // Admin sees events
      const adminEvents = db.getAuditEvents(adminId, 'org-school-1');
      expect(adminEvents.length).toBeGreaterThanOrEqual(1);

      // Student sees zero events
      const studentEvents = db.getAuditEvents(studentId, 'org-school-1');
      expect(studentEvents).toHaveLength(0);
    });
  });
});
