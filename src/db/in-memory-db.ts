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
  LearningPath,
  CourseEnrollment,
  StudentResume,
  VideoLesson,
  StudyResource,
  DomainType,
  Certificate,
  UserProgressState,
  LabDefinition,
  LabAttemptRecord,
} from '../types';
import {
  ALL_COURSES,
  LEARNING_PATHS,
  INITIAL_VIDEO_LESSONS,
  INITIAL_STUDY_RESOURCES,
} from '../data/curriculum';
import { APPROVED_LABS } from '../data/approved-labs';

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
  labDefinitions: Map<string, LabDefinition> = new Map();
  labAttempts: Map<string, LabAttemptRecord> = new Map();
  assignments: Map<string, Assignment> = new Map();
  submissions: Map<string, Submission> = new Map();
  auditEvents: Map<string, AuditEvent> = new Map();
  learningPaths: Map<string, LearningPath> = new Map();
  courseEnrollments: Map<string, CourseEnrollment> = new Map();
  studentResumes: Map<string, StudentResume> = new Map();
  videoLessons: Map<string, VideoLesson> = new Map();
  studyResources: Map<string, StudyResource> = new Map();
  certificates: Map<string, Certificate> = new Map();
  userProgress: Map<string, UserProgressState> = new Map();

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
    this.learningPaths.clear();
    this.courseEnrollments.clear();
    this.studentResumes.clear();
    this.videoLessons.clear();
    this.studyResources.clear();
    this.labDefinitions.clear();
    this.labAttempts.clear();

    APPROVED_LABS.forEach((l) => this.labDefinitions.set(l.id, { ...l }));
    INITIAL_VIDEO_LESSONS.forEach((v) => this.videoLessons.set(v.id, { ...v }));
    INITIAL_STUDY_RESOURCES.forEach((r) => this.studyResources.set(r.id, { ...r }));

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

    // 7. Complete Curriculum & Learning Paths
    for (const c of ALL_COURSES) {
      this.courses.set(c.id, c);
    }
    for (const p of LEARNING_PATHS) {
      this.learningPaths.set(p.id, p);
    }

    const lab1: Lab = {
      id: 'lab-sec-101',
      course_id: 'course-web-sec',
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

    // 9. Seed Student Course Enrollment
    this.courseEnrollments.set('user-student-1:course-web-sec', {
      id: 'enr-course-web-sec',
      user_id: student1.id,
      course_id: 'course-web-sec',
      enrolled_at: new Date(Date.now() - 3 * 86400 * 1000).toISOString(),
      completed_lessons: ['les-sec-101'],
      progress_percent: 50,
    });

    // 10. Seed Student Resume & Portfolio
    this.studentResumes.set(student1.id, {
      id: 'resume-student-1',
      user_id: student1.id,
      full_name: student1.full_name,
      email: student1.email,
      headline: 'Aspiring Cybersecurity & Systems Engineer',
      summary: 'High school technologist focusing on practical application security, defensive parameterization, and systems problem-solving. Active contributor to Cyber Defense Cohort 2026.',
      skills: ['Web Security', 'HTTP Headers', 'TypeScript', 'Defensive Architecture', 'Git', 'Linux'],
      education: [
        {
          school: 'Delhi Public Technology School',
          degree: 'Senior Secondary (Science & Computing)',
          graduation_year: '2027',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Web Application Defense Architecture',
          description: 'Engineered security headers, CSP rules, and defense-in-depth mitigations against unauthorized data access with automated test verification.',
          technologies: ['TypeScript', 'CSP', 'Web Standards'],
        },
      ],
      verified_achievements: ['Module: Cybersecurity & Defensive Web Security (Verified 100%)'],
      updated_at: new Date().toISOString(),
    });
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

  // ==================================================================
  // COURSE CATALOGUE & LESSON PROGRESSION
  // ==================================================================

  getCourses(filters?: {
    domain?: string;
    level?: string;
    publishedOnly?: boolean;
    search?: string;
  }): Course[] {
    let result = Array.from(this.courses.values());

    if (filters?.publishedOnly) {
      result = result.filter((c) => c.is_published);
    }
    if (filters?.domain && filters.domain !== 'all') {
      result = result.filter((c) => c.domain === filters.domain);
    }
    if (filters?.level && filters.level !== 'all') {
      result = result.filter((c) => c.level === filters.level);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getCourseById(id: string): Course | null {
    return this.courses.get(id) || null;
  }

  getCourseBySlug(slug: string): Course | null {
    for (const c of this.courses.values()) {
      if (c.slug === slug) return c;
    }
    return null;
  }

  getLearningPaths(): LearningPath[] {
    return Array.from(this.learningPaths.values());
  }

  getLearningPathById(id: string): LearningPath | null {
    return this.learningPaths.get(id) || null;
  }

  enrollInCourse(userId: string, courseId: string): CourseEnrollment {
    const user = this.users.get(userId);
    if (!user) throw new DatabaseError('User not found', '23503', 404);
    const course = this.courses.get(courseId);
    if (!course) throw new DatabaseError('Course not found', '23503', 404);

    const enrollmentKey = `${userId}:${courseId}`;
    const existing = this.courseEnrollments.get(enrollmentKey);
    if (existing) return existing;

    const enrollment: CourseEnrollment = {
      id: crypto.randomUUID(),
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      completed_lessons: [],
      progress_percent: 0,
    };
    this.courseEnrollments.set(enrollmentKey, enrollment);

    this.logAuditEvent({
      organization_id: null,
      actor_id: userId,
      action_type: 'COURSE_ENROLLED',
      resource_type: 'course',
      resource_id: courseId,
      ip_address: null,
      user_agent: null,
      details: { course_title: course.title },
    });

    return enrollment;
  }

  getCourseEnrollment(userId: string, courseId: string): CourseEnrollment | null {
    return this.courseEnrollments.get(`${userId}:${courseId}`) || null;
  }

  getUserEnrollments(userId: string): CourseEnrollment[] {
    const list: CourseEnrollment[] = [];
    for (const enr of this.courseEnrollments.values()) {
      if (enr.user_id === userId) {
        list.push(enr);
      }
    }
    return list;
  }

  completeLesson(userId: string, courseId: string, lessonId: string): CourseEnrollment {
    const course = this.courses.get(courseId);
    if (!course) throw new DatabaseError('Course not found', '23503', 404);

    const enrollmentKey = `${userId}:${courseId}`;
    let enrollment = this.courseEnrollments.get(enrollmentKey);
    if (!enrollment) {
      enrollment = this.enrollInCourse(userId, courseId);
    }

    if (!enrollment.completed_lessons.includes(lessonId)) {
      enrollment.completed_lessons.push(lessonId);

      // Calculate total lessons in course
      let totalLessons = 0;
      for (const m of course.modules) {
        totalLessons += m.lessons.length;
      }
      enrollment.progress_percent =
        totalLessons > 0
          ? Math.round((enrollment.completed_lessons.length / totalLessons) * 100)
          : 100;

      if (enrollment.progress_percent >= 100 && !enrollment.completed_at) {
        enrollment.completed_at = new Date().toISOString();
      }

      this.courseEnrollments.set(enrollmentKey, enrollment);
      this.recordLessonCompletion(userId, courseId, lessonId);

      this.logAuditEvent({
        organization_id: null,
        actor_id: userId,
        action_type: 'LESSON_COMPLETED',
        resource_type: 'lesson',
        resource_id: lessonId,
        ip_address: null,
        user_agent: null,
        details: { course_id: courseId, progress: enrollment.progress_percent },
      });
    }

    return enrollment;
  }

  // ==================================================================
  // STUDENT RESUME & PORTFOLIO BUILDER
  // ==================================================================

  getResume(userId: string): StudentResume | null {
    return this.studentResumes.get(userId) || null;
  }

  saveResume(userId: string, resumeData: Partial<StudentResume>): StudentResume {
    const existing = this.studentResumes.get(userId);
    const user = this.users.get(userId);
    if (!user) throw new DatabaseError('User not found', '23503', 404);

    const updated: StudentResume = {
      id: existing?.id || crypto.randomUUID(),
      user_id: userId,
      full_name: resumeData.full_name || user.full_name,
      email: resumeData.email || user.email,
      headline: resumeData.headline || existing?.headline || '',
      summary: resumeData.summary || existing?.summary || '',
      skills: resumeData.skills || existing?.skills || [],
      education: resumeData.education || existing?.education || [],
      projects: resumeData.projects || existing?.projects || [],
      verified_achievements: resumeData.verified_achievements || existing?.verified_achievements || [],
      updated_at: new Date().toISOString(),
    };

    this.studentResumes.set(userId, updated);

    this.logAuditEvent({
      organization_id: null,
      actor_id: userId,
      action_type: 'RESUME_UPDATED',
      resource_type: 'resume',
      resource_id: updated.id,
      ip_address: null,
      user_agent: null,
      details: { skills_count: updated.skills.length, projects_count: updated.projects.length },
    });

    return updated;
  }

  // ==================================================================
  // CRYPTOGRAPHIC CLASSROOM JOIN CODES & LIFECYCLE
  // ==================================================================

  generateClassroomJoinCode(
    teacherUserId: string,
    classroomId: string,
    expirationDays: number = 14
  ): Classroom {
    const cls = this.classrooms.get(classroomId);
    if (!cls) throw new DatabaseError('Classroom not found', '23503', 404);

    if (cls.teacher_id !== teacherUserId && !this.isPlatformSuperadmin(teacherUserId)) {
      throw new DatabaseError('Permission denied: only classroom teacher can regenerate join codes', '42501', 403);
    }

    // Generate high-entropy 8-character cryptographic alphanumeric string
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[randomBytes[i] % chars.length];
    }

    const expiresAt = new Date(Date.now() + expirationDays * 86400 * 1000).toISOString();
    const updatedClass: Classroom = {
      ...cls,
      join_code: code,
      join_code_expires_at: expiresAt,
      is_active: true,
    };
    this.classrooms.set(classroomId, updatedClass);

    this.logAuditEvent({
      organization_id: cls.organization_id,
      actor_id: teacherUserId,
      action_type: 'CLASSROOM_CODE_REGENERATED',
      resource_type: 'classroom',
      resource_id: classroomId,
      ip_address: null,
      user_agent: null,
      details: { expires_at: expiresAt },
    });

    return updatedClass;
  }

  revokeClassroomJoinCode(teacherUserId: string, classroomId: string): Classroom {
    const cls = this.classrooms.get(classroomId);
    if (!cls) throw new DatabaseError('Classroom not found', '23503', 404);

    if (cls.teacher_id !== teacherUserId && !this.isPlatformSuperadmin(teacherUserId)) {
      throw new DatabaseError('Permission denied: only classroom teacher can revoke join codes', '42501', 403);
    }

    // Expire immediately
    const updatedClass: Classroom = {
      ...cls,
      join_code_expires_at: new Date(Date.now() - 1000).toISOString(),
    };
    this.classrooms.set(classroomId, updatedClass);

    this.logAuditEvent({
      organization_id: cls.organization_id,
      actor_id: teacherUserId,
      action_type: 'CLASSROOM_CODE_REVOKED',
      resource_type: 'classroom',
      resource_id: classroomId,
      ip_address: null,
      user_agent: null,
      details: { revoked_at: new Date().toISOString() },
    });

    return updatedClass;
  }

  validateAndJoinClassroom(studentUserId: string, joinCode: string): { classroom: Classroom; enrollment: ClassroomEnrollment } {
    const cleanCode = joinCode.trim().toUpperCase();
    if (!cleanCode) throw new DatabaseError('Join code cannot be empty', '23514', 400);

    let targetClass: Classroom | null = null;
    for (const c of this.classrooms.values()) {
      if (c.join_code === cleanCode) {
        targetClass = c;
        break;
      }
    }

    if (!targetClass || !targetClass.is_active) {
      throw new DatabaseError('Invalid or inactive classroom join code', '23503', 404);
    }

    if (new Date(targetClass.join_code_expires_at).getTime() < Date.now()) {
      throw new DatabaseError('This classroom join code has expired', '23514', 400);
    }

    for (const enr of this.enrollments.values()) {
      if (enr.classroom_id === targetClass.id && enr.student_id === studentUserId) {
        throw new DatabaseError('Student is already enrolled in this classroom', '23505', 400);
      }
    }

    const newEnr: ClassroomEnrollment = {
      id: crypto.randomUUID(),
      classroom_id: targetClass.id,
      student_id: studentUserId,
      enrolled_at: new Date().toISOString(),
    };
    this.enrollments.set(newEnr.id, newEnr);

    this.logAuditEvent({
      organization_id: targetClass.organization_id,
      actor_id: studentUserId,
      action_type: 'CLASSROOM_ENROLLED',
      resource_type: 'classroom',
      resource_id: targetClass.id,
      ip_address: null,
      user_agent: null,
      details: { join_code: cleanCode },
    });

    return { classroom: targetClass, enrollment: newEnr };
  }

  // ==================================================================
  // VIDEO LESSONS & STUDY RESOURCES
  // ==================================================================

  extractYouTubeId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/i);
    return match ? match[1] : null;
  }

  getVideoLessons(options?: string | { category?: string; search?: string }): VideoLesson[] {
    const list = Array.from(this.videoLessons.values());
    if (!options) return list;
    const category = typeof options === 'string' ? options : options.category;
    const search = typeof options === 'object' ? options.search : undefined;

    return list.filter((v) => {
      const matchCat = !category || category === 'all' || v.category === category;
      const matchSearch =
        !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  getVideoLessonById(id: string): VideoLesson | undefined {
    return this.videoLessons.get(id);
  }

  addVideoLesson(data: {
    title: string;
    description: string;
    youtube_url: string;
    category: DomainType | 'general';
    duration_minutes: number;
    added_by: string;
    instructor_name?: string;
  }): VideoLesson {
    const youtubeId = this.extractYouTubeId(data.youtube_url);
    if (!youtubeId) {
      throw new DatabaseError('Invalid YouTube URL or video ID', 'INVALID_URL', 400);
    }
    const id = `vid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const lesson: VideoLesson = {
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      youtube_url: data.youtube_url.trim(),
      youtube_id: youtubeId,
      category: data.category,
      duration_minutes: data.duration_minutes || 10,
      featured: false,
      instructor_name: data.instructor_name?.trim() || 'Geniusphere Educator',
      added_by: data.added_by,
      created_at: new Date().toISOString(),
    };
    this.videoLessons.set(id, lesson);
    return lesson;
  }

  updateVideoLesson(id: string, updates: Partial<VideoLesson>): VideoLesson {
    const existing = this.videoLessons.get(id);
    if (!existing) {
      throw new DatabaseError(`Video lesson not found: ${id}`, 'NOT_FOUND', 404);
    }
    const updated = { ...existing, ...updates };
    if (updates.youtube_url) {
      const extracted = this.extractYouTubeId(updates.youtube_url);
      if (extracted) {
        updated.youtube_id = extracted;
      }
    }
    this.videoLessons.set(id, updated);
    return updated;
  }

  deleteVideoLesson(id: string): boolean {
    return this.videoLessons.delete(id);
  }

  getStudyResources(options?: string | { category?: string; resourceType?: string; search?: string }): StudyResource[] {
    const list = Array.from(this.studyResources.values());
    if (!options) return list;
    const category = typeof options === 'string' ? options : options.category;
    const resourceType = typeof options === 'object' ? options.resourceType : undefined;
    const search = typeof options === 'object' ? options.search : undefined;

    return list.filter((r) => {
      const matchCat = !category || category === 'all' || r.category === category;
      const matchType = !resourceType || resourceType === 'all' || r.resource_type === resourceType;
      const matchSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchType && matchSearch;
    });
  }

  // ==================================================================
  // GAMIFICATION, XP, STREAKS & CERTIFICATIONS
  // ==================================================================

  getUserProgress(userId: string): UserProgressState {
    let prog = this.userProgress.get(userId);
    if (!prog) {
      prog = {
        xp: 450,
        streak_days: 7,
        last_active_date: new Date().toISOString().split('T')[0],
        completed_lessons: [],
        completed_courses: [],
        certificates: [],
      };
      this.userProgress.set(userId, prog);
    }
    return prog;
  }

  awardXp(userId: string, xpAmount: number, _reason?: string): UserProgressState {
    const prog = this.getUserProgress(userId);
    prog.xp += xpAmount;
    this.userProgress.set(userId, prog);
    return prog;
  }

  recordLessonCompletion(
    userId: string,
    courseId: string,
    lessonId: string
  ): { progress: UserProgressState; completedCourse: boolean; certificate?: Certificate } {
    const prog = this.getUserProgress(userId);
    if (!prog.completed_lessons.includes(lessonId)) {
      prog.completed_lessons.push(lessonId);
      prog.xp += 50; // +50 XP for completing lesson
    }

    // Check course completion
    const course = this.getCourseById(courseId);
    let completedCourse = false;
    let certificate: Certificate | undefined = undefined;

    if (course) {
      const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const hasCompletedAll = allLessonIds.length > 0 && allLessonIds.every((id) => prog.completed_lessons.includes(id));

      if (hasCompletedAll && !prog.completed_courses.includes(courseId)) {
        prog.completed_courses.push(courseId);
        prog.xp += 500; // +500 XP course completion bonus
        completedCourse = true;

        const user = this.users.get(userId);
        const certId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const hash = 'sha256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

        certificate = {
          id: certId,
          user_id: userId,
          course_id: courseId,
          course_title: course.title,
          student_name: user?.full_name || 'Geniusphere Student',
          issue_date: issueDate,
          verification_hash: hash,
          grade: 100,
          skills_acquired: course.learning_objectives.slice(0, 3),
        };

        this.certificates.set(certificate.id, certificate);
        prog.certificates.push(certificate);
      }
    }

    this.userProgress.set(userId, prog);
    return { progress: prog, completedCourse, certificate };
  }

  getCertificates(userId: string): Certificate[] {
    return Array.from(this.certificates.values()).filter((c) => c.user_id === userId);
  }

  // ==================================================================
  // LAB & SIMULATION METHODS (Section 3 & 5)
  // ==================================================================

  getLabDefinitions(filters?: { category?: string; interaction_type?: string; search?: string }): LabDefinition[] {
    let list = Array.from(this.labDefinitions.values()).filter((l) => l.is_published);
    if (filters?.category && filters.category !== 'all') {
      list = list.filter((l) => l.category === filters.category);
    }
    if (filters?.interaction_type && filters.interaction_type !== 'all') {
      list = list.filter((l) => l.interaction_type === filters.interaction_type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) => l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q) || l.learning_objective.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getLabBySlug(slug: string): LabDefinition | undefined {
    return Array.from(this.labDefinitions.values()).find((l) => l.slug === slug);
  }

  getLabById(id: string): LabDefinition | undefined {
    return this.labDefinitions.get(id);
  }

  recordLabAttempt(
    userId: string,
    labId: string,
    result: { passed: boolean; score: number; diagnostics: string; savedState?: any }
  ): LabAttemptRecord {
    const lab = this.labDefinitions.get(labId);
    if (!lab) {
      throw new DatabaseError('Lab definition not found', '23503', 404);
    }

    const user = this.users.get(userId);
    if (!user) {
      throw new DatabaseError('User not found', '23503', 404);
    }

    let existingAttempts = 0;
    for (const att of this.labAttempts.values()) {
      if (att.lab_id === labId && att.user_id === userId) {
        existingAttempts++;
      }
    }

    const record: LabAttemptRecord = {
      id: crypto.randomUUID(),
      lab_id: labId,
      user_id: userId,
      attempt_number: existingAttempts + 1,
      passed: result.passed,
      score: result.score,
      diagnostics: result.diagnostics,
      saved_state: result.savedState,
      sync_status: 'SERVER_CONFIRMED',
      created_at: new Date().toISOString(),
    };

    this.labAttempts.set(record.id, record);

    // If passed, award XP (only once per lab to prevent duplicate inflation)
    if (result.passed) {
      const progress = this.getUserProgress(userId);
      const previouslyPassed = Array.from(this.labAttempts.values()).some(
        (a) => a.lab_id === labId && a.user_id === userId && a.passed && a.id !== record.id
      );
      if (!previouslyPassed) {
        progress.xp += 100;
        this.userProgress.set(userId, progress);
      }
    }

    return record;
  }

  getLabAttempts(userId: string, labId?: string): LabAttemptRecord[] {
    return Array.from(this.labAttempts.values()).filter(
      (a) => a.user_id === userId && (!labId || a.lab_id === labId)
    );
  }

  isLabCompleted(userId: string, labId: string): boolean {
    return Array.from(this.labAttempts.values()).some(
      (a) => a.user_id === userId && a.lab_id === labId && a.passed
    );
  }
}

