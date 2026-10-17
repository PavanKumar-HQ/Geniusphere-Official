// ====================================================================
// Geniusphere — Multi-Tenant In-Memory Database & Authorization Engine
// Emulates PostgreSQL 16 Schema, Column Grants, RLS & Invariant Triggers
// ====================================================================

import {
  User,
  Organization,
  OrganizationMembership,
  ParentGuardianLink,
  Classroom,
  ClassroomEnrollment,
  Course,
  Lab,
  Assignment,
  Submission,
  AuditEvent,
  OrgRole,
} from '../types';

export class DatabaseError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class InMemoryDatabase {
  organizations: Map<string, Organization> = new Map();
  users: Map<string, User> = new Map();
  memberships: Map<string, OrganizationMembership> = new Map();
  parentLinks: Map<string, ParentGuardianLink> = new Map();
  classrooms: Map<string, Classroom> = new Map();
  enrollments: Map<string, ClassroomEnrollment> = new Map();
  courses: Map<string, Course> = new Map();
  labs: Map<string, Lab> = new Map();
  assignments: Map<string, Assignment> = new Map();
  submissions: Map<string, Submission> = new Map();
  auditEvents: Map<string, AuditEvent> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  /**
   * Resets and seeds clean baseline test data
   */
  seedDefaultData() {
    this.organizations.clear();
    this.users.clear();
    this.memberships.clear();
    this.parentLinks.clear();
    this.classrooms.clear();
    this.enrollments.clear();
    this.courses.clear();
    this.labs.clear();
    this.assignments.clear();
    this.submissions.clear();
    this.auditEvents.clear();

    // 1. Organizations
    const org1: Organization = {
      id: 'org-school-1',
      name: 'Delhi Public Technology School',
      slug: 'dpts-delhi',
      org_type: 'school',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    const org2: Organization = {
      id: 'org-school-2',
      name: 'Bengaluru Tech Academy',
      slug: 'bta-bangalore',
      org_type: 'school',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    this.organizations.set(org1.id, org1);
    this.organizations.set(org2.id, org2);

    // 2. Users
    const teacher1: User = {
      id: 'user-teacher-1',
      email: 'teacher1@dpts.edu',
      full_name: 'Dr. Sharma',
      date_of_birth: '1985-05-12',
      is_minor: false,
      is_superadmin: false,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const student1: User = {
      id: 'user-student-1',
      email: 'student1@dpts.edu',
      full_name: 'Aarav Patel',
      date_of_birth: '2010-08-20',
      is_minor: true,
      is_superadmin: false,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const student2Org2: User = {
      id: 'user-student-org2',
      email: 'student@bta.edu',
      full_name: 'Priya Nair',
      date_of_birth: '2009-11-15',
      is_minor: true,
      is_superadmin: false,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const parent1: User = {
      id: 'user-parent-1',
      email: 'parent1@gmail.com',
      full_name: 'Sunita Patel',
      date_of_birth: '1982-03-10',
      is_minor: false,
      is_superadmin: false,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const admin1: User = {
      id: 'user-admin-1',
      email: 'admin@dpts.edu',
      full_name: 'Principal Verma',
      date_of_birth: '1975-01-01',
      is_minor: false,
      is_superadmin: false,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.users.set(teacher1.id, teacher1);
    this.users.set(student1.id, student1);
    this.users.set(student2Org2.id, student2Org2);
    this.users.set(parent1.id, parent1);
    this.users.set(admin1.id, admin1);

    // 3. Memberships
    this.memberships.set('mem-1', {
      id: 'mem-1',
      organization_id: org1.id,
      user_id: teacher1.id,
      role: 'teacher',
      is_active: true,
      created_at: new Date().toISOString(),
    });
    this.memberships.set('mem-2', {
      id: 'mem-2',
      organization_id: org1.id,
      user_id: student1.id,
      role: 'learner',
      is_active: true,
      created_at: new Date().toISOString(),
    });
    this.memberships.set('mem-3', {
      id: 'mem-3',
      organization_id: org2.id,
      user_id: student2Org2.id,
      role: 'learner',
      is_active: true,
      created_at: new Date().toISOString(),
    });
    this.memberships.set('mem-admin-1', {
      id: 'mem-admin-1',
      organization_id: org1.id,
      user_id: admin1.id,
      role: 'institution_admin',
      is_active: true,
      created_at: new Date().toISOString(),
    });

    // 4. Parent Links
    this.parentLinks.set('plink-1', {
      id: 'plink-1',
      student_id: student1.id,
      parent_user_id: parent1.id,
      parent_email: parent1.email,
      verification_token_hash: 'tokenhash123',
      token_expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      consent_status: 'verified',
      consent_granted_at: new Date().toISOString(),
      consent_method: 'email_verification_link',
      created_at: new Date().toISOString(),
    });

    // 5. Classrooms
    const class1: Classroom = {
      id: 'class-sec-101',
      organization_id: org1.id,
      teacher_id: teacher1.id,
      name: 'Cyber Defense Cohort 2026',
      join_code: 'SEC2026A',
      join_code_expires_at: new Date(Date.now() + 14 * 86400 * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
    };
    this.classrooms.set(class1.id, class1);

    // 6. Enrollments
    this.enrollments.set('enr-1', {
      id: 'enr-1',
      classroom_id: class1.id,
      student_id: student1.id,
      enrolled_at: new Date().toISOString(),
    });

    // 7. Course & Lab
    const course1: Course = {
      id: 'course-web-sec',
      title: 'Web Application Defense Fundamentals',
      slug: 'web-defense-101',
      domain: 'cybersecurity',
      is_published: true,
      created_at: new Date().toISOString(),
    };
    this.courses.set(course1.id, course1);

    const lab1: Lab = {
      id: 'lab-sec-101',
      course_id: course1.id,
      title: 'SQL Parameterization & Injection Defense',
      lab_type: 'sqlite_wasm',
      challenge_spec: {
        prompt: 'Rewrite the lookup query using positional parameter placeholder (?)',
        vulnerable_example: "query = f'SELECT * FROM users WHERE username = \"{user_input}\"'",
        target_table: 'challenge_users',
        expected_columns: ['id', 'username', 'role'],
        parameter_placeholder: '?',
      },
      max_score: 100,
      created_at: new Date().toISOString(),
    };
    this.labs.set(lab1.id, lab1);

    // 8. Assignment
    const assign1: Assignment = {
      id: 'assign-lab-101',
      classroom_id: class1.id,
      lab_id: lab1.id,
      due_date: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
      max_score: 100,
      max_attempts: 10,
      created_at: new Date().toISOString(),
    };
    this.assignments.set(assign1.id, assign1);
  }

  // ==================================================================
  // HELPER FUNCTIONS (Corresponds to Migration 003)
  // ==================================================================

  hasOrgRole(userId: string | null, orgId: string, role: OrgRole): boolean {
    if (!userId) return false;
    const org = this.organizations.get(orgId);
    if (!org || !org.is_active) return false;

    for (const mem of this.memberships.values()) {
      if (mem.organization_id === orgId && mem.user_id === userId && mem.role === role && mem.is_active) {
        return true;
      }
    }
    return false;
  }

  isClassroomTeacher(userId: string | null, classId: string): boolean {
    if (!userId) return false;
    const cls = this.classrooms.get(classId);
    return Boolean(cls && cls.teacher_id === userId && cls.is_active);
  }

  isEnrolledStudent(userId: string | null, classId: string): boolean {
    if (!userId) return false;
    const cls = this.classrooms.get(classId);
    if (!cls || !cls.is_active) return false;

    for (const enr of this.enrollments.values()) {
      if (enr.classroom_id === classId && enr.student_id === userId) {
        return true;
      }
    }
    return false;
  }

  isVerifiedParent(parentUserId: string | null, studentId: string): boolean {
    if (!parentUserId) return false;
    for (const link of this.parentLinks.values()) {
      if (link.student_id === studentId && link.parent_user_id === parentUserId && link.consent_status === 'verified') {
        return true;
      }
    }
    return false;
  }

  isTeacherOfStudent(teacherUserId: string | null, studentId: string): boolean {
    if (!teacherUserId) return false;
    for (const enr of this.enrollments.values()) {
      if (enr.student_id === studentId) {
        const cls = this.classrooms.get(enr.classroom_id);
        if (cls && cls.teacher_id === teacherUserId && cls.is_active) {
          return true;
        }
      }
    }
    return false;
  }

  isPlatformSuperadmin(userId: string | null): boolean {
    if (!userId) return false;
    const user = this.users.get(userId);
    return Boolean(user && user.is_superadmin);
  }

  // ==================================================================
  // USER PROFILE OPERATIONS (Column Grants & Self-Promotion Guards)
  // ==================================================================

  getUser(callerUserId: string | null, targetUserId: string): User | null {
    if (!callerUserId) {
      throw new DatabaseError('Authentication required', '42501', 401);
    }
    // RLS: Self, Teacher of student, Verified parent, or Superadmin
    if (
      callerUserId === targetUserId ||
      this.isTeacherOfStudent(callerUserId, targetUserId) ||
      this.isVerifiedParent(callerUserId, targetUserId) ||
      this.isPlatformSuperadmin(callerUserId)
    ) {
      return this.users.get(targetUserId) || null;
    }
    // Cross-tenant / unauthorized -> return null (0 rows)
    return null;
  }

  updateUserProfile(
    callerUserId: string,
    targetUserId: string,
    updates: Partial<User>
  ): User {
    if (callerUserId !== targetUserId && !this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Cannot update another user profile', '42501', 403);
    }

    const user = this.users.get(targetUserId);
    if (!user) {
      throw new DatabaseError('User not found', '23503', 404);
    }

    // Column Grant Enforcements: Regular user can ONLY update full_name
    if (!this.isPlatformSuperadmin(callerUserId)) {
      if (updates.is_superadmin !== undefined) {
        throw new DatabaseError('Permission denied: cannot alter is_superadmin', '42501', 403);
      }
      if (updates.account_status !== undefined) {
        throw new DatabaseError('Permission denied: cannot alter account_status', '42501', 403);
      }
      if (updates.date_of_birth !== undefined) {
        throw new DatabaseError('Permission denied: cannot alter date_of_birth', '42501', 403);
      }
      if (updates.is_minor !== undefined) {
        throw new DatabaseError('Permission denied: cannot alter is_minor', '42501', 403);
      }
      if (updates.email !== undefined) {
        throw new DatabaseError('Permission denied: cannot alter email', '42501', 403);
      }
      if (updates.id !== undefined) {
        throw new DatabaseError('Permission denied: cannot alter id', '42501', 403);
      }
    }

    const updatedUser: User = {
      ...user,
      full_name: updates.full_name !== undefined ? updates.full_name : user.full_name,
      updated_at: new Date().toISOString(),
    };

    this.users.set(targetUserId, updatedUser);
    return updatedUser;
  }

  // ==================================================================
  // INVARIANT TRIGGER 1: PREVENT LAST ADMIN REMOVAL
  // ==================================================================

  removeMembership(callerUserId: string, membershipId: string): void {
    const mem = this.memberships.get(membershipId);
    if (!mem) {
      throw new DatabaseError('Membership not found', '23503', 404);
    }

    // RLS: Self leaving or Org Admin
    const canDelete =
      callerUserId === mem.user_id ||
      this.hasOrgRole(callerUserId, mem.organization_id, 'institution_admin') ||
      this.isPlatformSuperadmin(callerUserId);

    if (!canDelete) {
      throw new DatabaseError('Permission denied to delete membership', '42501', 403);
    }

    // Trigger invariant check: cannot remove or deactivate the last admin
    if (mem.role === 'institution_admin' && mem.is_active) {
      let activeAdmins = 0;
      for (const m of this.memberships.values()) {
        if (
          m.organization_id === mem.organization_id &&
          m.role === 'institution_admin' &&
          m.is_active &&
          m.id !== mem.id
        ) {
          activeAdmins++;
        }
      }
      if (activeAdmins === 0) {
        throw new DatabaseError(
          `Cannot remove or deactivate the last active institution_admin of organization ${mem.organization_id}`,
          '23514', // check_violation
          400
        );
      }
    }

    this.memberships.delete(membershipId);
  }

  // ==================================================================
  // INVARIANT TRIGGER 2: TEACHER-CLASSROOM ORG BINDING
  // ==================================================================

  createClassroom(callerUserId: string, classroom: Omit<Classroom, 'id' | 'created_at'>): Classroom {
    // RLS check: caller must be a teacher or admin in that organization
    const hasRole =
      this.hasOrgRole(callerUserId, classroom.organization_id, 'teacher') ||
      this.hasOrgRole(callerUserId, classroom.organization_id, 'institution_admin') ||
      this.isPlatformSuperadmin(callerUserId);

    if (!hasRole) {
      throw new DatabaseError('Permission denied: must be an active teacher or admin in organization', '42501', 403);
    }

    // Invariant trigger check: teacher_id must belong to organization_id as teacher/admin
    const teacherValid =
      this.hasOrgRole(classroom.teacher_id, classroom.organization_id, 'teacher') ||
      this.hasOrgRole(classroom.teacher_id, classroom.organization_id, 'institution_admin');

    if (!teacherValid) {
      throw new DatabaseError(
        `Classroom teacher ${classroom.teacher_id} must be an active teacher or admin in organization ${classroom.organization_id}`,
        '23514', // check_violation
        400
      );
    }

    const newClass: Classroom = {
      id: crypto.randomUUID(),
      ...classroom,
      created_at: new Date().toISOString(),
    };
    this.classrooms.set(newClass.id, newClass);
    return newClass;
  }

  // ==================================================================
  // CROSS-TENANT CLASSROOM SCOPING (RLS)
  // ==================================================================

  getClassrooms(callerUserId: string): Classroom[] {
    const allowed: Classroom[] = [];
    for (const cls of this.classrooms.values()) {
      if (
        cls.teacher_id === callerUserId ||
        this.isEnrolledStudent(callerUserId, cls.id) ||
        this.hasOrgRole(callerUserId, cls.organization_id, 'institution_admin') ||
        this.isPlatformSuperadmin(callerUserId)
      ) {
        allowed.push(cls);
      }
    }
    return allowed;
  }

  // ==================================================================
  // ASSIGNMENTS & CROSS-TENANT CHECKS
  // ==================================================================

  createAssignment(callerUserId: string, assignment: Omit<Assignment, 'id' | 'created_at'>): Assignment {
    // Only classroom teacher or superadmin can assign labs
    if (!this.isClassroomTeacher(callerUserId, assignment.classroom_id) && !this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Permission denied: only classroom teacher can create assignments', '42501', 403);
    }

    const newAssign: Assignment = {
      id: crypto.randomUUID(),
      ...assignment,
      created_at: new Date().toISOString(),
    };
    this.assignments.set(newAssign.id, newAssign);
    return newAssign;
  }

  // ==================================================================
  // SUBMISSIONS & TAMPER-RESISTANCE (Blocker B)
  // ==================================================================

  createSubmissionDraft(
    callerUserId: string,
    assignmentId: string,
    submittedQuery: string
  ): Submission {
    const assign = this.assignments.get(assignmentId);
    if (!assign) {
      throw new DatabaseError('Assignment not found', '23503', 404);
    }

    // Must be enrolled in the classroom
    if (!this.isEnrolledStudent(callerUserId, assign.classroom_id)) {
      throw new DatabaseError('Permission denied: student not enrolled in assignment classroom', '42501', 403);
    }

    // Count existing attempts
    let attemptCount = 0;
    for (const sub of this.submissions.values()) {
      if (sub.assignment_id === assignmentId && sub.student_id === callerUserId) {
        attemptCount++;
      }
    }

    if (attemptCount >= assign.max_attempts) {
      throw new DatabaseError(`Max attempts limit (${assign.max_attempts}) reached for this assignment`, '23514', 400);
    }

    const submission: Submission = {
      id: crypto.randomUUID(),
      assignment_id: assignmentId,
      student_id: callerUserId,
      attempt_number: attemptCount + 1,
      submitted_query: submittedQuery,
      submission_hash: 'pending_evaluation',
      passed: false,
      score: 0,
      verification_log: {
        execution_time_ms: 0,
        test_results: [],
        details: 'Draft created; awaiting server evaluation',
      },
      sync_status: 'LOCAL_UNSYNCED',
      submitted_at: new Date().toISOString(),
    };

    this.submissions.set(submission.id, submission);
    return submission;
  }

  /**
   * Authoritative grade update: strictly executed by server runner with service_role
   */
  persistServerGrade(
    submissionId: string,
    passed: boolean,
    score: number,
    submissionHash: string,
    verificationLog: any
  ): Submission {
    const sub = this.submissions.get(submissionId);
    if (!sub) {
      throw new DatabaseError('Submission not found', '23503', 404);
    }

    const updated: Submission = {
      ...sub,
      passed,
      score,
      submission_hash: submissionHash,
      verification_log: verificationLog,
      sync_status: 'SERVER_CONFIRMED',
    };

    this.submissions.set(submissionId, updated);
    return updated;
  }

  // Client attempts to alter score directly -> RLS Policy Violation
  updateSubmissionByClient(_callerUserId: string, _submissionId: string): void {
    throw new DatabaseError('RLS Policy Denied: Submissions are immutable to standard clients', '42501', 403);
  }

  // Get Submissions with RLS (Student self, Classroom teacher, Verified parent)
  getSubmissions(callerUserId: string, assignmentId: string): Submission[] {
    const assign = this.assignments.get(assignmentId);
    if (!assign) return [];

    const isTeacher = this.isClassroomTeacher(callerUserId, assign.classroom_id);
    const results: Submission[] = [];

    for (const sub of this.submissions.values()) {
      if (sub.assignment_id === assignmentId) {
        if (
          isTeacher ||
          sub.student_id === callerUserId ||
          this.isVerifiedParent(callerUserId, sub.student_id) ||
          this.isPlatformSuperadmin(callerUserId)
        ) {
          results.push(sub);
        }
      }
    }
    return results;
  }

  // ==================================================================
  // AUDIT EVENTS (Strictly Append-Only)
  // ==================================================================

  logAuditEvent(event: Omit<AuditEvent, 'id' | 'created_at'>): AuditEvent {
    const newEvent: AuditEvent = {
      id: crypto.randomUUID(),
      ...event,
      created_at: new Date().toISOString(),
    };
    this.auditEvents.set(newEvent.id, newEvent);
    return newEvent;
  }

  getAuditEvents(callerUserId: string, orgId?: string): AuditEvent[] {
    const results: AuditEvent[] = [];
    const isSuper = this.isPlatformSuperadmin(callerUserId);

    for (const ev of this.auditEvents.values()) {
      if (isSuper) {
        results.push(ev);
      } else if (ev.organization_id && this.hasOrgRole(callerUserId, ev.organization_id, 'institution_admin')) {
        if (!orgId || ev.organization_id === orgId) {
          results.push(ev);
        }
      }
    }
    return results;
  }

  updateAuditEvent(): void {
    throw new DatabaseError('RLS Policy Denied: Audit events are append-only and cannot be updated', '42501', 403);
  }

  deleteAuditEvent(): void {
    throw new DatabaseError('RLS Policy Denied: Audit events cannot be deleted', '42501', 403);
  }
}
