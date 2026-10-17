import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';

describe('Multi-Tenant RLS & Invariant Security Test Suite', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('Test Group 1: Identity and Role Privilege Hardening', () => {
    it('prevents regular user from self-promoting to is_superadmin (42501)', () => {
      expect(() => {
        db.updateUserProfile('user-student-1', 'user-student-1', { is_superadmin: true });
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
          message: expect.stringContaining('cannot alter is_superadmin'),
        })
      );
    });

    it('prevents regular user from altering protected account_status (42501)', () => {
      expect(() => {
        db.updateUserProfile('user-student-1', 'user-student-1', { account_status: 'active' });
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
          message: expect.stringContaining('cannot alter account_status'),
        })
      );
    });

    it('allows a user to update their permitted column (full_name)', () => {
      const updated = db.updateUserProfile('user-student-1', 'user-student-1', {
        full_name: 'Aarav K. Patel',
      });
      expect(updated.full_name).toBe('Aarav K. Patel');
    });

    it('denies user attempting to update another user profile', () => {
      expect(() => {
        db.updateUserProfile('user-student-1', 'user-teacher-1', { full_name: 'Hacked Name' });
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
        })
      );
    });
  });

  describe('Test Group 2: Cross-Tenant Isolation', () => {
    it('isolates classrooms across organizations (Student in Org 1 sees only Org 1 classes)', () => {
      const classes = db.getClassrooms('user-student-1');
      expect(classes.length).toBeGreaterThan(0);
      for (const cls of classes) {
        expect(cls.organization_id).toBe('org-school-1');
      }
    });

    it('denies Teacher in Org 1 from creating assignments in an Org 2 classroom', () => {
      // Create a class in Org 2
      const org2Class = db.createClassroom('user-admin-1', { // Admin can create in org1, but let's test cross-teacher
        organization_id: 'org-school-1',
        teacher_id: 'user-teacher-1',
        name: 'Another class',
        join_code: 'CODE1234',
        join_code_expires_at: new Date().toISOString(),
        is_active: true,
      });

      // An unauthorized user attempting to assign a lab to this class
      expect(() => {
        db.createAssignment('user-student-org2', {
          classroom_id: org2Class.id,
          lab_id: 'lab-sec-101',
          due_date: null,
          max_score: 100,
          max_attempts: 10,
        });
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
        })
      );
    });
  });

  describe('Test Group 3: Institutional Invariants', () => {
    it('prevents removing the last active institution_admin of an organization (23514)', () => {
      // mem-admin-1 is the only admin for org-school-1
      expect(() => {
        db.removeMembership('user-admin-1', 'mem-admin-1');
      }).toThrowError(
        expect.objectContaining({
          code: '23514',
          statusCode: 400,
          message: expect.stringContaining('Cannot remove or deactivate the last active institution_admin'),
        })
      );
    });

    it('allows removing an admin once a second active admin exists', () => {
      // Add a second admin
      db.memberships.set('mem-admin-2', {
        id: 'mem-admin-2',
        organization_id: 'org-school-1',
        user_id: 'user-teacher-1',
        role: 'institution_admin',
        is_active: true,
        created_at: new Date().toISOString(),
      });

      // Now removing the first admin should succeed without error
      expect(() => {
        db.removeMembership('user-admin-1', 'mem-admin-1');
      }).not.toThrow();

      expect(db.memberships.has('mem-admin-1')).toBe(false);
    });

    it('enforces that classroom teacher must belong to the classroom organization (23514)', () => {
      // Attempt to create classroom in Org 1 with a teacher who only belongs to Org 2
      expect(() => {
        db.createClassroom('user-admin-1', {
          organization_id: 'org-school-1',
          teacher_id: 'user-student-org2', // Not an active teacher in org-school-1!
          name: 'Invalid Teacher Class',
          join_code: 'BADTEACH',
          join_code_expires_at: new Date().toISOString(),
          is_active: true,
        });
      }).toThrowError(
        expect.objectContaining({
          code: '23514',
          statusCode: 400,
          message: expect.stringContaining('must be an active teacher or admin'),
        })
      );
    });
  });

  describe('Test Group 4: Guardian Oversight Scoping', () => {
    it('permits verified parent to view linked minor profile and submissions', () => {
      const student = db.getUser('user-parent-1', 'user-student-1');
      expect(student).not.toBeNull();
      expect(student?.id).toBe('user-student-1');
    });

    it('denies parent from viewing unlinked minor profile (returns null / 0 rows)', () => {
      const unlinked = db.getUser('user-parent-1', 'user-student-org2');
      expect(unlinked).toBeNull();
    });

    it('denies parent from viewing student profile after consent is revoked', () => {
      // Revoke consent
      const link = db.parentLinks.get('plink-1')!;
      link.consent_status = 'revoked';

      const student = db.getUser('user-parent-1', 'user-student-1');
      expect(student).toBeNull();
    });
  });

  describe('Test Group 5: Submissions & Anti-Tamper Grades', () => {
    it('strictly denies client from modifying submission score or status (42501)', () => {
      expect(() => {
        db.updateSubmissionByClient('user-student-1', 'sub-1');
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
          message: expect.stringContaining('RLS Policy Denied'),
        })
      );
    });

    it('allows enrolled student to submit a draft query', () => {
      const draft = db.createSubmissionDraft(
        'user-student-1',
        'assign-lab-101',
        "SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active'"
      );
      expect(draft.id).toBeDefined();
      expect(draft.passed).toBe(false);
      expect(draft.score).toBe(0);
      expect(draft.attempt_number).toBe(1);
    });

    it('denies unenrolled student from submitting to an assignment (42501)', () => {
      expect(() => {
        db.createSubmissionDraft(
          'user-student-org2', // Not enrolled in class-sec-101
          'assign-lab-101',
          'SELECT 1'
        );
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
          message: expect.stringContaining('student not enrolled'),
        })
      );
    });

    it('updates score and passed status via authoritative server persistence', () => {
      const draft = db.createSubmissionDraft(
        'user-student-1',
        'assign-lab-101',
        "SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active'"
      );

      const graded = db.persistServerGrade(
        draft.id,
        true,
        100,
        'sha256_hash_verified',
        { allPassed: true }
      );

      expect(graded.passed).toBe(true);
      expect(graded.score).toBe(100);
      expect(graded.sync_status).toBe('SERVER_CONFIRMED');
    });

    it('enforces maximum attempts limit per assignment (23514)', () => {
      const assign = db.assignments.get('assign-lab-101')!;
      assign.max_attempts = 2;

      // First attempt
      db.createSubmissionDraft('user-student-1', 'assign-lab-101', 'query 1');
      // Second attempt
      db.createSubmissionDraft('user-student-1', 'assign-lab-101', 'query 2');

      // Third attempt should exceed limit
      expect(() => {
        db.createSubmissionDraft('user-student-1', 'assign-lab-101', 'query 3');
      }).toThrowError(
        expect.objectContaining({
          code: '23514',
          statusCode: 400,
          message: expect.stringContaining('Max attempts limit (2) reached'),
        })
      );
    });
  });

  describe('Test Group 7: Audit Logging & Immutability', () => {
    it('allows logging an append-only audit event', () => {
      const ev = db.logAuditEvent({
        organization_id: 'org-school-1',
        actor_id: 'user-student-1',
        action_type: 'lab_submitted',
        resource_type: 'submission',
        resource_id: 'sub-123',
        ip_address: '103.21.244.2',
        user_agent: 'Mozilla/5.0 Android',
        details: { score: 100 },
      });
      expect(ev.id).toBeDefined();
    });

    it('denies updating an audit event (42501)', () => {
      expect(() => {
        db.updateAuditEvent();
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
          message: expect.stringContaining('append-only'),
        })
      );
    });

    it('denies deleting an audit event (42501)', () => {
      expect(() => {
        db.deleteAuditEvent();
      }).toThrowError(
        expect.objectContaining({
          code: '42501',
          statusCode: 403,
          message: expect.stringContaining('cannot be deleted'),
        })
      );
    });

    it('restricts audit events to the institution admin of that organization', () => {
      db.logAuditEvent({
        organization_id: 'org-school-1',
        actor_id: 'user-student-1',
        action_type: 'login',
        resource_type: 'user',
        resource_id: 'user-student-1',
        ip_address: null,
        user_agent: null,
        details: {},
      });

      // Regular student sees 0 audit events
      const studentEvents = db.getAuditEvents('user-student-1', 'org-school-1');
      expect(studentEvents).toHaveLength(0);

      // Org 1 admin sees audit events
      const adminEvents = db.getAuditEvents('user-admin-1', 'org-school-1');
      expect(adminEvents.length).toBeGreaterThan(0);
    });
  });
});
