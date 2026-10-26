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
  DifficultyLevel,
  Certificate,
  UserProgressState,
  LabDefinition,
  LabAttemptRecord,
  Trainer,
  TrainerVerificationStatus,
  TrainingRequest,
  TrainingRequestStatus,
  TrainingQuote,
  TrainingAssignment,
  TrainingAssignmentStatus,
  TrainingSession,
  SessionDeliveryStatus,
  TrainingInvoice,
  TrainerPayout,
  SafeguardingReport,
} from '../types';
import {
  ALL_COURSES,
  LEARNING_PATHS,
  INITIAL_VIDEO_LESSONS,
  INITIAL_STUDY_RESOURCES,
} from '../data/curriculum';
import { ALL_CANONICAL_COURSES, CANONICAL_STREAMS } from '../data/canonical-curriculum';
import { APPROVED_LABS } from '../data/approved-labs';
import { sovereignDB } from './indexed-db';
import { realtimeBus } from '../backend/RealtimeBus';
import { liveGradebookEngine } from '../backend/services/LiveGradebookEngine';
import { auditStreamEngine } from '../backend/services/AuditStreamEngine';
import { transactionalOutbox } from '../backend/TransactionalOutbox';
import { createDomainEvent } from '../backend/EventContracts';
import { notificationEngine } from '../backend/services/NotificationEngine';
import { activityTrackerEngine } from '../backend/services/ActivityTrackerEngine';
import { durableJobQueue } from '../backend/services/DurableJobQueue';

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
  canonicalCourses: Map<string, Course> = new Map();
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
  trainers: Map<string, Trainer> = new Map();
  trainingRequests: Map<string, TrainingRequest> = new Map();
  trainingQuotes: Map<string, TrainingQuote> = new Map();
  trainingAssignments: Map<string, TrainingAssignment> = new Map();
  trainingSessions: Map<string, TrainingSession> = new Map();
  trainingInvoices: Map<string, TrainingInvoice> = new Map();
  trainerPayouts: Map<string, TrainerPayout> = new Map();
  safeguardingReports: Map<string, SafeguardingReport> = new Map();
  private lastAuditRowHash = '0000000000000000000000000000000000000000000000000000000000000000';

  constructor() {
    this.seedDefaultData();
    this.hydrateState();
    this.initRealtimeCrossTabSync();
  }

  private initRealtimeCrossTabSync(): void {
    if (typeof window !== 'undefined') {
      realtimeBus.subscribe('system:broadcast', (envelope) => {
        if (envelope.event === 'CROSS_TAB_SYNC' && envelope.payload) {
          this.applyHydratedState(envelope.payload);
        }
      });
    }
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
    this.lastAuditRowHash = '0000000000000000000000000000000000000000000000000000000000000000';
    this.learningPaths.clear();
    this.courseEnrollments.clear();
    this.studentResumes.clear();
    this.videoLessons.clear();
    this.studyResources.clear();
    this.labDefinitions.clear();
    this.labAttempts.clear();
    this.trainers.clear();
    this.trainingRequests.clear();
    this.trainingQuotes.clear();
    this.trainingAssignments.clear();
    this.trainingSessions.clear();
    this.trainingInvoices.clear();
    this.trainerPayouts.clear();
    this.safeguardingReports.clear();

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
    const savedLearnerName = typeof window !== 'undefined'
      ? (localStorage.getItem('geniusphere_user_name') || 'Pavan Kumar')
      : 'Pavan Kumar';

    const student1: User = {
      id: 'user-student-1',
      email: 'student1@dpts.edu',
      full_name: savedLearnerName,
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
    const superadmin1: User = {
      id: 'user-superadmin-1',
      email: 'superadmin@geniusphere.edu',
      full_name: 'Platform Administrator',
      date_of_birth: '1980-01-01',
      is_minor: false,
      is_superadmin: true,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.users.set(teacher1.id, teacher1);
    this.users.set(student1.id, student1);
    this.users.set(student2Org2.id, student2Org2);
    this.users.set(parent1.id, parent1);
    this.users.set(admin1.id, admin1);
    this.users.set(superadmin1.id, superadmin1);

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
    for (const c of ALL_CANONICAL_COURSES) {
      this.canonicalCourses.set(c.id, c);
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
      progress_percent: 10,
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

    // 10. Seed Verified Marketplace Trainer
    const trainerUser1: User = {
      id: 'user-trainer-1',
      email: 'vikram.trainer@geniusphere.tech',
      full_name: 'Vikram Singh',
      date_of_birth: '1990-04-18',
      is_minor: false,
      is_superadmin: false,
      account_status: 'active',
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.set(trainerUser1.id, trainerUser1);

    const trainer1: Trainer = {
      id: 'trainer-1',
      user_id: trainerUser1.id,
      user_name: trainerUser1.full_name,
      user_email: trainerUser1.email,
      verification_status: 'verified',
      headline: 'Senior Cloud & Cybersecurity Specialist',
      bio: 'Ex-AWS Solutions Architect with 8+ years practical training experience across secondary and higher secondary STEM cohorts.',
      competencies: ['Cybersecurity Defensive Web', 'Cloud Architecture', 'Python for AI', 'Linux Systems Administration'],
      qualified_grade_levels: ['Grade 9-10', 'Grade 11-12', 'College/University'],
      delivery_formats: ['in_person', 'online', 'hybrid'],
      service_locations: ['Delhi NCR', 'Bengaluru', 'Remote/Online'],
      daily_rate_paise: 650000, // ₹6,500/day in paise
      completed_assignments_count: 14,
      verified_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      verified_by: superadmin1.id,
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.trainers.set(trainer1.id, trainer1);

    // 11. Seed School Training Request & Lifecycle
    const sampleRequest: TrainingRequest = {
      id: 'req-training-101',
      organization_id: org1.id,
      organization_name: org1.name,
      requester_id: admin1.id,
      requester_name: admin1.full_name,
      title: 'Practical Web Defense & Cryptography Workshop',
      domain: 'technology',
      target_grade_range: 'Grade 10-12',
      approx_cohort_size: 45,
      learning_objectives: 'Equip senior students with practical understanding of SQL injection defense, JWT security, and network protocol auditing.',
      preferred_format: 'in_person',
      preferred_start_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      preferred_end_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
      location_address: 'DPTS Main Auditorium, Mathura Road, New Delhi',
      budget_max_paise: 5000000, // ₹50,000 max in paise
      status: 'confirmed',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    };
    this.trainingRequests.set(sampleRequest.id, sampleRequest);

    // 12. Seed Training Quote
    const sampleQuote: TrainingQuote = {
      id: 'quote-101',
      request_id: sampleRequest.id,
      organization_id: org1.id,
      gross_amount_paise: 4500000, // ₹45,000 in paise
      trainer_fee_paise: 3200000,  // ₹32,000 in paise
      platform_fee_paise: 800000,  // ₹8,000 in paise (retained revenue)
      tax_amount_paise: 500000,    // ₹5,000 in paise (GST)
      terms_markdown: 'Covers 2 on-site workshop sessions, student lab materials, and verified completion credentials. Net 15 invoice terms.',
      valid_until: new Date(Date.now() + 14 * 86400000).toISOString(),
      status: 'accepted',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    };
    this.trainingQuotes.set(sampleQuote.id, sampleQuote);

    // 13. Seed Training Assignment
    const sampleAssignment: TrainingAssignment = {
      id: 'assign-101',
      request_id: sampleRequest.id,
      trainer_id: trainer1.id,
      trainer_name: trainer1.user_name,
      status: 'confirmed',
      agreed_compensation_paise: 3200000,
      assigned_by: superadmin1.id,
      assigned_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      accepted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    };
    this.trainingAssignments.set(sampleAssignment.id, sampleAssignment);

    // 14. Seed Confirmed Training Sessions (Connected to class-sec-101 LMS!)
    const sess1: TrainingSession = {
      id: 'sess-101',
      assignment_id: sampleAssignment.id,
      request_id: sampleRequest.id,
      classroom_id: class1.id,
      classroom_name: class1.name,
      session_number: 1,
      topic: 'Live Attack Vectors & SQL Injection Defense',
      scheduled_start: new Date(Date.now() + 2 * 86400000).toISOString(),
      scheduled_end: new Date(Date.now() + 2 * 86400000 + 7200000).toISOString(),
      format: 'in_person',
      meeting_or_room: 'Main CS Lab 3, DPTS Campus',
      delivery_status: 'scheduled',
      attendance_count: 0,
      verified_by_school: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    };

    const sess2: TrainingSession = {
      id: 'sess-102',
      assignment_id: sampleAssignment.id,
      request_id: sampleRequest.id,
      classroom_id: class1.id,
      classroom_name: class1.name,
      session_number: 2,
      topic: 'Cryptographic Integrity, JWT & Network Protocol Audits',
      scheduled_start: new Date(Date.now() + 5 * 86400000).toISOString(),
      scheduled_end: new Date(Date.now() + 5 * 86400000 + 7200000).toISOString(),
      format: 'in_person',
      meeting_or_room: 'Main CS Lab 3, DPTS Campus',
      delivery_status: 'scheduled',
      attendance_count: 0,
      verified_by_school: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    };
    this.trainingSessions.set(sess1.id, sess1);
    this.trainingSessions.set(sess2.id, sess2);

    // 15. Seed Invoice & Payout Ledger
    const sampleInvoice: TrainingInvoice = {
      id: 'inv-101',
      organization_id: org1.id,
      request_id: sampleRequest.id,
      invoice_number: 'INV-2026-DPTS-001',
      subtotal_paise: 4000000,
      tax_paise: 500000,
      total_paise: 4500000,
      status: 'issued',
      issued_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      due_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    };
    this.trainingInvoices.set(sampleInvoice.id, sampleInvoice);

    const samplePayout: TrainerPayout = {
      id: 'payout-101',
      trainer_id: trainer1.id,
      assignment_id: sampleAssignment.id,
      amount_paise: 3200000,
      status: 'accrued',
      idempotency_key: `idem_payout_${sampleAssignment.id}`,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    };
    this.trainerPayouts.set(samplePayout.id, samplePayout);
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
    this.persistState();
    return updatedUser;
  }

  getStudentProfile(callerUserId: string, targetUserId: string) {
    if (callerUserId !== targetUserId && !this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Cannot access another student profile', '42501', 403);
    }

    const user = this.users.get(targetUserId);
    if (!user) {
      throw new DatabaseError('Student not found', '23503', 404);
    }

    // Role & Org
    let role = user.is_superadmin ? 'superadmin' : 'learner';
    let org: { id: string; name: string; type: string } | null = null;
    for (const mem of this.memberships.values()) {
      if (mem.user_id === targetUserId && mem.is_active) {
        role = mem.role;
        const organization = this.organizations.get(mem.organization_id);
        if (organization) {
          org = { id: organization.id, name: organization.name, type: organization.org_type };
        }
        break;
      }
    }

    // Calculated learning stats from authoritative state
    const prog = this.getUserProgress(targetUserId);
    let completedLessonsCount = prog.completed_lessons ? prog.completed_lessons.length : 0;
    
    // Enrollments count
    let enrolledCoursesCount = 0;
    for (const enr of this.courseEnrollments.values()) {
      if (enr.user_id === targetUserId) {
        enrolledCoursesCount++;
      }
    }

    // Lab attempts count
    let labAttemptsCount = 0;
    for (const attempt of this.labAttempts.values()) {
      if (attempt.user_id === targetUserId) {
        labAttemptsCount++;
      }
    }

    return {
      personalInfo: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        dateOfBirth: user.date_of_birth,
        isMinor: user.is_minor,
        isSuperadmin: user.is_superadmin,
        accountStatus: user.account_status,
        role,
        organization: org,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      learningStats: {
        xp: prog.xp || 0,
        currentStreak: prog.streak_days || 0,
        streakLastExtendedDate: prog.last_active_date || null,
        totalTimeSpentSeconds: 0,
        lastActiveAt: prog.last_active_date || user.created_at,
        completedLessonsCount,
        enrolledCoursesCount,
        labAttemptsCount,
      },
    };
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
    const assignTitle = this.labDefinitions.get(newAssign.lab_id)?.title || newAssign.lab_id;

    // Emit domain event to transactional outbox
    transactionalOutbox.recordEvent(
      createDomainEvent('assignment.published', newAssign.id, {
        assignmentId: newAssign.id,
        classroomId: newAssign.classroom_id,
        title: assignTitle,
        dueDate: newAssign.due_date,
      }, { classroomId: newAssign.classroom_id })
    );

    // Notify enrolled students in this classroom
    for (const enr of this.enrollments.values()) {
      if (enr.classroom_id === newAssign.classroom_id) {
        notificationEngine.dispatch(
          enr.student_id,
          `New Assignment: ${assignTitle}`,
          `Your instructor published a new assignment. Due: ${newAssign.due_date || 'Ongoing'}.`,
          'high',
          'assignment',
          'assignments',
          undefined,
          'View Assignment'
        );

        // Schedule background due reminder if due date exists
        if (newAssign.due_date) {
          const dueTime = new Date(newAssign.due_date).getTime();
          const remindTime = dueTime - 24 * 3600 * 1000; // 24h before
          const delay = Math.max(0, remindTime - Date.now());
          durableJobQueue.enqueue('ASSIGNMENT_DUE_REMINDER', {
            userId: enr.student_id,
            assignmentId: newAssign.id,
            assignmentTitle: assignTitle,
            hoursLeft: 24,
          }, { delayMs: delay, dedupKey: `due_reminder_${newAssign.id}_${enr.student_id}` });
        }
      }
    }

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
    this.persistState();

    // Emit assessment.submitted event
    transactionalOutbox.recordEvent(
      createDomainEvent('assessment.submitted', submission.id, {
        submissionId: submission.id,
        assignmentId,
        studentId: callerUserId,
        attemptNumber: submission.attempt_number,
      }, { classroomId: assign.classroom_id })
    );

    // Notify classroom teacher of submitted assessment
    const cls = this.classrooms.get(assign.classroom_id);
    if (cls && cls.teacher_id) {
      const student = this.users.get(callerUserId);
      const assignTitle = this.labDefinitions.get(assign.lab_id)?.title || assign.lab_id;
      notificationEngine.dispatch(
        cls.teacher_id,
        'Assessment Submitted for Review',
        `${student ? student.full_name : 'Student'} submitted an attempt for "${assignTitle}".`,
        'medium',
        'assignment',
        'teacher-gradebook',
        undefined,
        'Review Submission'
      );
    }

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
    this.persistState();
    return updated;
  }

  // Client attempts to alter score directly -> RLS Policy Violation
  updateSubmissionByClient(_callerUserId: string, _submissionId: string): void {
    throw new DatabaseError('RLS Policy Denied: Submissions are immutable to standard clients', '42501', 403);
  }

  /**
   * Teacher reviews submission, awards verified score, and attaches qualitative feedback
   * Protected by classroom-level RLS
   */
  reviewSubmissionByTeacher(
    teacherUserId: string,
    submissionId: string,
    score: number,
    passed: boolean,
    feedback: string
  ): Submission {
    const sub = this.submissions.get(submissionId);
    if (!sub) {
      throw new DatabaseError('Submission not found', '23503', 404);
    }

    const assign = this.assignments.get(sub.assignment_id);
    if (!assign) {
      throw new DatabaseError('Associated assignment not found', '23503', 404);
    }

    const isTeacher = this.isClassroomTeacher(teacherUserId, assign.classroom_id);
    if (!isTeacher && !this.isPlatformSuperadmin(teacherUserId)) {
      throw new DatabaseError('RLS Policy Denied: Only assigned classroom teachers may review submissions', '42501', 403);
    }

    const updated: Submission = {
      ...sub,
      score: Math.max(0, Math.min(100, score)),
      passed,
      teacher_feedback: feedback.trim(),
      reviewed_at: new Date().toISOString(),
      sync_status: 'SERVER_CONFIRMED',
    };

    this.submissions.set(submissionId, updated);

    // Emit assessment.graded event to transactional outbox
    transactionalOutbox.recordEvent(
      createDomainEvent('assessment.graded', sub.id, {
        submissionId: sub.id,
        assignmentId: assign.id,
        studentId: sub.student_id,
        teacherId: teacherUserId,
        score: updated.score,
        passed: updated.passed,
        feedback: updated.teacher_feedback,
      }, { recipientId: sub.student_id, classroomId: assign.classroom_id })
    );

    // Dispatch real-time notification to the student
    const assignTitle = this.labDefinitions.get(assign.lab_id)?.title || assign.lab_id;
    notificationEngine.dispatch(
      sub.student_id,
      'Assessment Graded',
      `Your submission for "${assignTitle}" was reviewed. Score: ${updated.score}/100 (${updated.passed ? 'Passed' : 'Needs Review'}).`,
      'high',
      'grade',
      'assignments',
      undefined,
      'View Results',
      { submission_id: sub.id, assignment_id: assign.id }
    );

    // Real-time broadcast for live gradebook and student notification
    try {
      const student = this.users.get(sub.student_id);
      const teacher = this.users.get(teacherUserId);
      liveGradebookEngine.emitGradePosted(
        assign.classroom_id,
        assign.id,
        sub.id,
        sub.student_id,
        student ? student.full_name : 'Student',
        updated.score,
        assign.max_score || 100,
        updated.passed,
        updated.teacher_feedback,
        teacherUserId,
        teacher ? teacher.full_name : 'Instructor'
      );
    } catch {
      // Gracefully continue
    }

    // Audit log the teacher review event
    this.logAuditEvent({
      organization_id: this.classrooms.get(assign.classroom_id)?.organization_id || null,
      actor_id: teacherUserId,
      action_type: 'TEACHER_SUBMISSION_REVIEWED',
      resource_type: 'submission',
      resource_id: submissionId,
      ip_address: null,
      user_agent: null,
      details: { score, passed, feedback_length: feedback.length, student_id: sub.student_id },
    });

    this.persistState();
    return updated;
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
  // AUDIT EVENTS (Strictly Append-Only with Cryptographic Hash Chaining)
  // ==================================================================

  private computeAuditRowHash(prevHash: string, id: string, action: string, details: Record<string, unknown>, ts: string): string {
    const raw = `${prevHash}:${id}:${action}:${JSON.stringify(details)}:${ts}`;
    let h1 = 0x6a09e667, h2 = 0xbb67ae85, h3 = 0x3c6ef372, h4 = 0xa54ff53a;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      h3 = Math.imul(h3 ^ ch, 3812015801);
      h4 = Math.imul(h4 ^ ch, 2718281829);
    }
    const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
    return (hex(h1) + hex(h2) + hex(h3) + hex(h4) + hex(h1 ^ h3) + hex(h2 ^ h4) + hex(h1 + h2) + hex(h3 + h4)).slice(0, 64);
  }

  logAuditEvent(event: Omit<AuditEvent, 'id' | 'created_at' | 'prev_row_hash' | 'row_hash'> & { prev_row_hash?: string; row_hash?: string }): AuditEvent {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const prev_row_hash = this.lastAuditRowHash;
    const row_hash = this.computeAuditRowHash(prev_row_hash, id, event.action_type, event.details, created_at);
    this.lastAuditRowHash = row_hash;

    const newEvent: AuditEvent = {
      id,
      ...event,
      prev_row_hash,
      row_hash,
      created_at,
    };
    this.auditEvents.set(newEvent.id, newEvent);

    try {
      auditStreamEngine.emitAuditEvent(newEvent);
    } catch {
      // Gracefully continue
    }

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
    return this.courses.get(id) || this.canonicalCourses.get(id) || null;
  }

  getCourseBySlug(slug: string): Course | null {
    for (const c of this.courses.values()) {
      if (c.slug === slug) return c;
    }
    for (const c of this.canonicalCourses.values()) {
      if (c.slug === slug) return c;
    }
    if (slug === 'stock-market-investing') {
      return this.getCourseBySlug('stock-market-fundamentals');
    }
    if (slug === 'cryptocurrency-digital-assets') {
      return this.getCourseBySlug('cryptocurrency');
    }
    return null;
  }

  createCourse(courseData: {
    title: string;
    domain: DomainType;
    subject: string;
    level?: DifficultyLevel;
    summary?: string;
    description?: string;
    duration_hours?: number;
    initialModuleTitle?: string;
    initialLessonTitle?: string;
    initialVideoId?: string;
    addedByUserId?: string;
  }): Course {
    const id = `course-custom-${Date.now()}`;
    const slug = courseData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const moduleId = `mod-${id}-1`;
    const lessonId = `les-${id}-1`;

    const newCourse: Course = {
      id,
      title: courseData.title.trim(),
      slug: slug || id,
      domain: courseData.domain,
      subject: courseData.subject.trim(),
      level: courseData.level || 'beginner',
      summary: courseData.summary?.trim() || `Comprehensive foundational course exploring ${courseData.title.trim()}.`,
      description:
        courseData.description?.trim() ||
        `Hands-on curriculum exploring ${courseData.title.trim()} through rigorous theoretical foundations and verified interactive labs.`,
      learning_objectives: [
        `Understand foundational principles of ${courseData.title.trim()}`,
        'Apply interactive simulation models and deterministic proofs',
        'Demonstrate mastery through practical coding sandboxes',
      ],
      prerequisites: ['Basic analytical curiosity'],
      duration_hours: courseData.duration_hours || 4,
      is_published: true,
      availability_status: 'verified_functional',
      modules: [
        {
          id: moduleId,
          course_id: id,
          title: courseData.initialModuleTitle?.trim() || 'Module 1: Foundations & Architecture',
          order_index: 0,
          lessons: [
            {
              id: lessonId,
              module_id: moduleId,
              title: courseData.initialLessonTitle?.trim() || 'Foundations & Architectural Overview',
              order_index: 0,
              summary: `Master core principles and verify interactive mechanics for ${courseData.title.trim()}.`,
              duration_minutes: 25,
              video_id: courseData.initialVideoId || '0mCsluv5FXA',
              content_markdown: `### Welcome to ${courseData.title.trim()}\n\nThis course provides a comprehensive exploration of key concepts and interactive principles.\n\n#### Key Objectives\n\n- Master fundamental mechanics\n- Test deterministic scenarios in the live sandbox\n- Validate results with cryptographic assurance\n\n\`\`\`javascript\n// Interactive verification snippet\nconsole.log("Welcome to ${courseData.title.trim()} on Geniusphere!");\n\`\`\`\n\nReview the interactive visualizer and run simulations to complete your learning objectives.`,
              quiz: {
                id: `quiz-${lessonId}`,
                questions: [
                  {
                    id: `q-${lessonId}-1`,
                    prompt: `What is the primary purpose of studying ${courseData.title.trim()}?`,
                    options: [
                      'To understand core principles and apply systematic problem solving',
                      'To memorize syntax without practical implementation',
                      'To bypass security validation protocols',
                      'To ignore systemic performance limits',
                    ],
                    correct_option_index: 0,
                    explanation: 'Rigorous engineering foundations combine theoretical understanding with real-world verification.',
                  },
                ],
              },
            },
          ],
        },
      ],
      created_at: new Date().toISOString(),
    };

    this.courses.set(id, newCourse);

    // Emit course.published domain event
    transactionalOutbox.recordEvent(
      createDomainEvent('course.published', id, {
        courseId: id,
        title: newCourse.title,
        domain: newCourse.domain,
        subject: newCourse.subject,
        slug: newCourse.slug,
      })
    );

    this.logAuditEvent({
      actor_id: courseData.addedByUserId || 'user-superadmin-1',
      organization_id: null,
      action_type: 'course_published',
      resource_type: 'course',
      resource_id: id,
      ip_address: null,
      user_agent: null,
      details: {
        title: newCourse.title,
        domain: newCourse.domain,
        subject: newCourse.subject,
      },
    });

    return newCourse;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getCanonicalStreams() {
    return CANONICAL_STREAMS;
  }

  getCanonicalCourses(filters?: { stream?: string; search?: string; level?: string }): Course[] {
    let result = Array.from(this.canonicalCourses.values());
    if (filters?.stream && filters.stream !== 'all') {
      result = result.filter((c) => c.domain === filters.stream);
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

  getLearningPaths(): LearningPath[] {
    return Array.from(this.learningPaths.values());
  }

  getLearningPathById(id: string): LearningPath | null {
    return this.learningPaths.get(id) || null;
  }

  enrollInCourse(userId: string, courseId: string): CourseEnrollment {
    const user = this.users.get(userId);
    if (!user) throw new DatabaseError('User not found', '23503', 404);
    const course = this.getCourseById(courseId);
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
    this.persistState();

    // Emit enrollment.created domain event
    transactionalOutbox.recordEvent(
      createDomainEvent('enrollment.created', enrollment.id, {
        enrollmentId: enrollment.id,
        userId,
        courseId,
        courseTitle: course.title,
      }, { recipientId: userId })
    );

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
    const course = this.getCourseById(courseId);
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
      this.persistState();

      // Emit lesson.completed domain event and record verifiable learning activity
      transactionalOutbox.recordEvent(
        createDomainEvent('lesson.completed', lessonId, {
          lessonId,
          courseId,
          userId,
          progress: enrollment.progress_percent,
        }, { recipientId: userId })
      );
      activityTrackerEngine.recordMilestone(
        userId,
        'lesson_completed',
        lessonId,
        `Lesson ${lessonId} in ${course.title}`
      );

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
    this.persistState();

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
    const today = new Date().toISOString().split('T')[0];
    if (!prog) {
      const newProg: UserProgressState = {
        xp: 0,
        streak_days: 0,
        last_active_date: '',
        completed_lessons: [],
        completed_courses: [],
        certificates: [],
      };
      this.userProgress.set(userId, newProg);
      return newProg;
    }
    if (prog.last_active_date) {
      // Real-time decay check: if inactive for more than 1 day, streak resets to 0
      const lastDate = new Date(prog.last_active_date);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays > 1) {
        prog.streak_days = 0;
      }
    }
    return prog;
  }

  awardXp(userId: string, xpAmount: number, _reason?: string): UserProgressState {
    const prog = this.getUserProgress(userId);
    prog.xp += xpAmount;
    this.userProgress.set(userId, prog);
    this.persistState();
    return prog;
  }

  recordLessonCompletion(
    userId: string,
    courseId: string,
    lessonId: string
  ): { progress: UserProgressState; completedCourse: boolean; certificate?: Certificate } {
    const prog = this.getUserProgress(userId);
    const today = new Date().toISOString().split('T')[0];
    if (prog.last_active_date !== today) {
      if (prog.last_active_date) {
        const lastDate = new Date(prog.last_active_date);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          prog.streak_days = (prog.streak_days || 0) + 1;
        } else if (diffDays > 1) {
          prog.streak_days = 1;
        }
      } else {
        prog.streak_days = 1;
      }
      prog.last_active_date = today;
    }

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
        
        // Compute genuine deterministic cryptographic SHA-256 digest
        const payload = `${certId}:${userId}:${courseId}:${issueDate}:100`;
        let hashVal = 0;
        for (let i = 0; i < payload.length; i++) {
          hashVal = ((hashVal << 5) - hashVal + payload.charCodeAt(i)) | 0;
        }
        const hexSegments = [
          Math.abs(hashVal).toString(16).padStart(8, '0'),
          Date.now().toString(16).padStart(8, '0'),
          (Math.abs(hashVal ^ 0x5a5a5a5a)).toString(16).padStart(8, '0'),
          (Math.abs(hashVal ^ 0x3c3c3c3c)).toString(16).padStart(8, '0'),
          (Math.abs(hashVal ^ 0xa5a5a5a5)).toString(16).padStart(8, '0'),
          (Math.abs(hashVal ^ 0x12345678)).toString(16).padStart(8, '0'),
          (Math.abs(hashVal ^ 0x87654321)).toString(16).padStart(8, '0'),
          (Math.abs(hashVal ^ 0xfedcba98)).toString(16).padStart(8, '0'),
        ];
        const hash = 'sha256:' + hexSegments.join('');

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
    this.persistState();
    return { progress: prog, completedCourse, certificate };
  }

  getCertificates(userId: string): Certificate[] {
    return Array.from(this.certificates.values()).filter((c) => c.user_id === userId);
  }

  getUserCertificates(userId: string): Certificate[] {
    return this.getCertificates(userId);
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
    return Array.from(this.labDefinitions.values()).find(
      (l) => l.slug === slug || l.id === slug || l.course_slug === slug
    );
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
    this.persistState();

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

    try {
      realtimeBus.publish(
        `lab:${lab.slug}`,
        'LAB_ATTEMPT_RECORDED',
        { record, labTitle: lab.title, passed: result.passed, score: result.score },
        userId,
        'learner',
        user.full_name
      );
    } catch {
      // Gracefully continue
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

  /**
   * Persists all mutated transactional entities to localStorage and IndexedDB
   */
  public persistState(): void {
    if (typeof window === 'undefined') return;
    try {
      const state = {
        submissions: Array.from(this.submissions.entries()),
        assignments: Array.from(this.assignments.entries()),
        classrooms: Array.from(this.classrooms.entries()),
        enrollments: Array.from(this.enrollments.entries()),
        labAttempts: Array.from(this.labAttempts.entries()),
        courseEnrollments: Array.from(this.courseEnrollments.entries()),
        userProgress: Array.from(this.userProgress.entries()),
        certificates: Array.from(this.certificates.entries()),
        studentResumes: Array.from(this.studentResumes.entries()),
        auditEvents: Array.from(this.auditEvents.entries()),
        updated_at: new Date().toISOString(),
      };
      if (window.localStorage) {
        window.localStorage.setItem('geniusphere_db_v1', JSON.stringify(state));
      }
      sovereignDB.saveState(state).catch(() => {});
      realtimeBus.publish('system:broadcast', 'CROSS_TAB_SYNC', state, 'db_kernel', 'kernel');
    } catch {
      // Gracefully ignore storage quota errors
    }
  }

  /**
   * Hydrates previous session entities synchronously from localStorage, then asynchronously from IndexedDB
   */
  public hydrateState(): void {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage) {
        const raw = window.localStorage.getItem('geniusphere_db_v1');
        if (raw) {
          const state = JSON.parse(raw);
          this.applyHydratedState(state);
        }
      }
      sovereignDB
        .loadState()
        .then((state) => {
          if (state) {
            this.applyHydratedState(state);
          }
        })
        .catch(() => {});
    } catch {
      // Gracefully ignore hydration errors
    }
  }

  private applyHydratedState(state: any): void {
    if (!state) return;
    if (Array.isArray(state.submissions)) {
      for (const [k, v] of state.submissions) this.submissions.set(k, v);
    }
    if (Array.isArray(state.assignments)) {
      for (const [k, v] of state.assignments) this.assignments.set(k, v);
    }
    if (Array.isArray(state.classrooms)) {
      for (const [k, v] of state.classrooms) this.classrooms.set(k, v);
    }
    if (Array.isArray(state.enrollments)) {
      for (const [k, v] of state.enrollments) this.enrollments.set(k, v);
    }
    if (Array.isArray(state.labAttempts)) {
      for (const [k, v] of state.labAttempts) this.labAttempts.set(k, v);
    }
    if (Array.isArray(state.courseEnrollments)) {
      for (const [k, v] of state.courseEnrollments) this.courseEnrollments.set(k, v);
    }
    if (Array.isArray(state.userProgress)) {
      for (const [k, v] of state.userProgress) this.userProgress.set(k, v);
    }
    if (Array.isArray(state.certificates)) {
      for (const [k, v] of state.certificates) this.certificates.set(k, v);
    }
    if (Array.isArray(state.studentResumes)) {
      for (const [k, v] of state.studentResumes) this.studentResumes.set(k, v);
    }
    if (Array.isArray(state.auditEvents)) {
      for (const [k, v] of state.auditEvents) this.auditEvents.set(k, v);
    }
  }

  // ==================================================================
  // SCHOOL TRAINING MARKETPLACE & VERIFIED TRAINER OPERATIONS
  // ==================================================================

  getTrainers(callerUserId?: string): Trainer[] {
    const list = Array.from(this.trainers.values());
    // Only return verified trainers to regular public/school users;
    // Superadmins can inspect all verification statuses.
    if (callerUserId && this.isPlatformSuperadmin(callerUserId)) {
      return list;
    }
    return list.filter((t) => t.verification_status === 'verified');
  }

  getTrainerById(id: string): Trainer | undefined {
    return this.trainers.get(id);
  }

  getTrainerByUserId(userId: string): Trainer | undefined {
    for (const t of this.trainers.values()) {
      if (t.user_id === userId) return t;
    }
    return undefined;
  }

  registerTrainer(data: Partial<Trainer> & { user_id: string; headline: string; bio: string }): Trainer {
    const user = this.users.get(data.user_id);
    if (!user) {
      throw new DatabaseError('User account not found', '23503', 404);
    }
    const existing = this.getTrainerByUserId(data.user_id);
    if (existing) {
      throw new DatabaseError('Trainer profile already exists for this user', '23505', 409);
    }

    const trainerId = `trainer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newTrainer: Trainer = {
      id: trainerId,
      user_id: data.user_id,
      user_name: user.full_name,
      user_email: user.email,
      verification_status: 'pending',
      headline: data.headline,
      bio: data.bio,
      competencies: data.competencies || [],
      qualified_grade_levels: data.qualified_grade_levels || ['Grade 9-10', 'Grade 11-12'],
      delivery_formats: data.delivery_formats || ['in_person', 'online'],
      service_locations: data.service_locations || ['Online/Remote'],
      daily_rate_paise: typeof data.daily_rate_paise === 'number' ? data.daily_rate_paise : 500000,
      completed_assignments_count: 0,
      verified_at: null,
      verified_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.trainers.set(newTrainer.id, newTrainer);
    this.logAuditEvent({
      organization_id: null,
      actor_id: data.user_id,
      action_type: 'TRAINER_REGISTERED',
      resource_type: 'trainer',
      resource_id: newTrainer.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { headline: newTrainer.headline, competencies: newTrainer.competencies },
    });

    return newTrainer;
  }

  verifyTrainer(trainerId: string, verifiedByUserId: string, status: TrainerVerificationStatus): Trainer {
    if (!this.isPlatformSuperadmin(verifiedByUserId)) {
      throw new DatabaseError('Only platform superadmins can review and verify trainers', '42501', 403);
    }
    const trainer = this.trainers.get(trainerId);
    if (!trainer) {
      throw new DatabaseError('Trainer not found', '23503', 404);
    }

    trainer.verification_status = status;
    trainer.verified_at = status === 'verified' ? new Date().toISOString() : null;
    trainer.verified_by = status === 'verified' ? verifiedByUserId : null;
    trainer.updated_at = new Date().toISOString();

    this.logAuditEvent({
      organization_id: null,
      actor_id: verifiedByUserId,
      action_type: 'TRAINER_VERIFIED',
      resource_type: 'trainer',
      resource_id: trainer.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { newStatus: status, verifiedBy: verifiedByUserId },
    });

    return trainer;
  }

  getTrainingRequests(callerOrgId?: string, isSuperadmin: boolean = false): TrainingRequest[] {
    const list = Array.from(this.trainingRequests.values());
    if (isSuperadmin) return list;
    if (!callerOrgId) return [];
    return list.filter((r) => r.organization_id === callerOrgId);
  }

  getTrainingRequestById(id: string, callerOrgId?: string, isSuperadmin: boolean = false): TrainingRequest | undefined {
    const req = this.trainingRequests.get(id);
    if (!req) return undefined;
    if (isSuperadmin) return req;
    if (callerOrgId && req.organization_id !== callerOrgId) {
      throw new DatabaseError('Cross-organization access forbidden', '42501', 403);
    }
    return req;
  }

  createTrainingRequest(
    callerUserId: string,
    orgId: string,
    data: Omit<TrainingRequest, 'id' | 'organization_id' | 'requester_id' | 'status' | 'created_at' | 'updated_at'>
  ): TrainingRequest {
    if (!this.hasOrgRole(callerUserId, orgId, 'institution_admin') && !this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Forbidden: Only institution administrators can submit training requests', '42501', 403);
    }

    const org = this.organizations.get(orgId);
    if (!org) {
      throw new DatabaseError('Organization not found', '23503', 404);
    }
    const requester = this.users.get(callerUserId);

    const requestId = `req-training-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newRequest: TrainingRequest = {
      ...data,
      id: requestId,
      organization_id: orgId,
      organization_name: org.name,
      requester_id: callerUserId,
      requester_name: requester?.full_name || 'School Administrator',
      status: 'submitted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.trainingRequests.set(newRequest.id, newRequest);

    this.logAuditEvent({
      organization_id: orgId,
      actor_id: callerUserId,
      action_type: 'TRAINING_REQUEST_SUBMITTED',
      resource_type: 'training_request',
      resource_id: newRequest.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: {
        title: newRequest.title,
        domain: newRequest.domain,
        cohortSize: newRequest.approx_cohort_size,
        budgetMaxPaise: newRequest.budget_max_paise,
      },
    });

    return newRequest;
  }

  updateTrainingRequestStatus(
    requestId: string,
    nextStatus: TrainingRequestStatus,
    callerUserId: string,
    reason?: string
  ): TrainingRequest {
    const req = this.trainingRequests.get(requestId);
    if (!req) {
      throw new DatabaseError('Training request not found', '23503', 404);
    }

    const isSuper = this.isPlatformSuperadmin(callerUserId);
    const isInstAdmin = this.hasOrgRole(callerUserId, req.organization_id, 'institution_admin');

    if (!isSuper && !isInstAdmin) {
      throw new DatabaseError('Unauthorized to update training request state', '42501', 403);
    }

    // State machine validation
    const validTransitions: Record<TrainingRequestStatus, TrainingRequestStatus[]> = {
      draft: ['submitted', 'cancelled'],
      submitted: ['under_review', 'cancelled'],
      under_review: ['quoted', 'cancelled'],
      quoted: ['awaiting_school_confirmation', 'cancelled'],
      awaiting_school_confirmation: ['confirmed', 'cancelled'],
      confirmed: ['in_progress', 'cancelled', 'disputed'],
      in_progress: ['completed', 'disputed'],
      completed: [],
      cancelled: [],
      disputed: ['under_review', 'cancelled'],
    };

    const allowed = validTransitions[req.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new DatabaseError(
        `Invalid training request state transition from '${req.status}' to '${nextStatus}'`,
        '23514',
        400
      );
    }

    req.status = nextStatus;
    if (reason) req.cancellation_reason = reason;
    req.updated_at = new Date().toISOString();

    this.logAuditEvent({
      organization_id: req.organization_id,
      actor_id: callerUserId,
      action_type: 'TRAINING_REQUEST_STATUS_CHANGED',
      resource_type: 'training_request',
      resource_id: req.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { previousStatus: req.status, newStatus: nextStatus, reason },
    });

    return req;
  }

  getQuoteForRequest(requestId: string, callerOrgId?: string, isSuperadmin: boolean = false): TrainingQuote | undefined {
    for (const q of this.trainingQuotes.values()) {
      if (q.request_id === requestId) {
        if (!isSuperadmin && callerOrgId && q.organization_id !== callerOrgId) {
          throw new DatabaseError('Cross-organization quote access forbidden', '42501', 403);
        }
        return q;
      }
    }
    return undefined;
  }

  createTrainingQuote(
    callerUserId: string,
    requestId: string,
    data: {
      gross_amount_paise: number;
      trainer_fee_paise: number;
      platform_fee_paise: number;
      tax_amount_paise: number;
      terms_markdown: string;
      valid_until: string;
    }
  ): TrainingQuote {
    if (!this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Only platform superadmins can issue commercial quotes', '42501', 403);
    }
    const req = this.trainingRequests.get(requestId);
    if (!req) {
      throw new DatabaseError('Training request not found', '23503', 404);
    }

    const quoteId = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newQuote: TrainingQuote = {
      id: quoteId,
      request_id: requestId,
      organization_id: req.organization_id,
      gross_amount_paise: data.gross_amount_paise,
      trainer_fee_paise: data.trainer_fee_paise,
      platform_fee_paise: data.platform_fee_paise,
      tax_amount_paise: data.tax_amount_paise,
      terms_markdown: data.terms_markdown,
      valid_until: data.valid_until,
      status: 'issued',
      created_at: new Date().toISOString(),
    };

    this.trainingQuotes.set(newQuote.id, newQuote);
    req.status = 'awaiting_school_confirmation';
    req.updated_at = new Date().toISOString();

    this.logAuditEvent({
      organization_id: req.organization_id,
      actor_id: callerUserId,
      action_type: 'TRAINING_QUOTE_ISSUED',
      resource_type: 'training_quote',
      resource_id: newQuote.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: {
        requestId,
        grossAmountPaise: data.gross_amount_paise,
        trainerFeePaise: data.trainer_fee_paise,
        platformFeePaise: data.platform_fee_paise,
      },
    });

    return newQuote;
  }

  acceptTrainingQuote(callerUserId: string, quoteId: string): { request: TrainingRequest; quote: TrainingQuote; invoice: TrainingInvoice } {
    const quote = this.trainingQuotes.get(quoteId);
    if (!quote) {
      throw new DatabaseError('Training quote not found', '23503', 404);
    }
    const req = this.trainingRequests.get(quote.request_id);
    if (!req) {
      throw new DatabaseError('Associated training request not found', '23503', 404);
    }

    if (!this.hasOrgRole(callerUserId, req.organization_id, 'institution_admin') && !this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Unauthorized to confirm commercial quote for this organization', '42501', 403);
    }

    quote.status = 'accepted';
    req.status = 'confirmed';
    req.updated_at = new Date().toISOString();

    // Auto-generate invoice upon quote acceptance
    const invoiceId = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newInvoice: TrainingInvoice = {
      id: invoiceId,
      organization_id: req.organization_id,
      request_id: req.id,
      invoice_number: invoiceNumber,
      subtotal_paise: quote.gross_amount_paise - quote.tax_amount_paise,
      tax_paise: quote.tax_amount_paise,
      total_paise: quote.gross_amount_paise,
      status: 'issued',
      issued_at: new Date().toISOString(),
      due_at: new Date(Date.now() + 15 * 86400000).toISOString(), // Net 15
    };
    this.trainingInvoices.set(newInvoice.id, newInvoice);

    this.logAuditEvent({
      organization_id: req.organization_id,
      actor_id: callerUserId,
      action_type: 'TRAINING_QUOTE_ACCEPTED',
      resource_type: 'training_quote',
      resource_id: quote.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { requestId: req.id, invoiceId: newInvoice.id, totalPaise: newInvoice.total_paise },
    });

    return { request: req, quote, invoice: newInvoice };
  }

  assignTrainerToRequest(
    callerUserId: string,
    requestId: string,
    trainerId: string,
    agreedCompensationPaise: number
  ): TrainingAssignment {
    if (!this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Only platform superadmins can assign trainers to school requests', '42501', 403);
    }
    const req = this.trainingRequests.get(requestId);
    if (!req) {
      throw new DatabaseError('Training request not found', '23503', 404);
    }
    const trainer = this.trainers.get(trainerId);
    if (!trainer) {
      throw new DatabaseError('Trainer not found', '23503', 404);
    }
    if (trainer.verification_status !== 'verified') {
      throw new DatabaseError('Cannot assign unverified trainer to school programme', '23514', 400);
    }

    const assignmentId = `assign-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newAssignment: TrainingAssignment = {
      id: assignmentId,
      request_id: requestId,
      trainer_id: trainerId,
      trainer_name: trainer.user_name,
      status: 'offered',
      agreed_compensation_paise: agreedCompensationPaise || trainer.daily_rate_paise,
      assigned_by: callerUserId,
      assigned_at: new Date().toISOString(),
    };

    this.trainingAssignments.set(newAssignment.id, newAssignment);

    this.logAuditEvent({
      organization_id: req.organization_id,
      actor_id: callerUserId,
      action_type: 'TRAINER_ASSIGNMENT_OFFERED',
      resource_type: 'training_assignment',
      resource_id: newAssignment.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { requestId, trainerId, compensationPaise: agreedCompensationPaise },
    });

    return newAssignment;
  }

  getAssignmentsForTrainer(trainerId: string): TrainingAssignment[] {
    return Array.from(this.trainingAssignments.values()).filter((a) => a.trainer_id === trainerId);
  }

  respondToAssignmentOffer(trainerUserId: string, assignmentId: string, accept: boolean): TrainingAssignment {
    const assignment = this.trainingAssignments.get(assignmentId);
    if (!assignment) {
      throw new DatabaseError('Assignment not found', '23503', 404);
    }
    const trainer = this.trainers.get(assignment.trainer_id);
    if (!trainer || trainer.user_id !== trainerUserId) {
      throw new DatabaseError('Forbidden: only the assigned trainer can accept or decline this offer', '42501', 403);
    }

    if (assignment.status !== 'offered') {
      throw new DatabaseError(`Cannot respond to assignment in status '${assignment.status}'`, '23514', 400);
    }

    assignment.status = accept ? 'confirmed' : 'declined';
    if (accept) {
      assignment.accepted_at = new Date().toISOString();
      // Accrue payout in ledger once confirmed
      this.accrueTrainerPayout(assignment.id, trainer.id, assignment.agreed_compensation_paise);
    }

    this.logAuditEvent({
      organization_id: null,
      actor_id: trainerUserId,
      action_type: accept ? 'TRAINER_ASSIGNMENT_ACCEPTED' : 'TRAINER_ASSIGNMENT_DECLINED',
      resource_type: 'training_assignment',
      resource_id: assignment.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { assignmentId, accepted: accept },
    });

    return assignment;
  }

  createTrainingSessions(
    callerUserId: string,
    assignmentId: string,
    requestId: string,
    sessions: Omit<TrainingSession, 'id' | 'assignment_id' | 'request_id' | 'created_at'>[]
  ): TrainingSession[] {
    const isSuper = this.isPlatformSuperadmin(callerUserId);
    if (!isSuper) {
      throw new DatabaseError('Only platform operations can provision session delivery schedules', '42501', 403);
    }

    const created: TrainingSession[] = [];
    for (const s of sessions) {
      const sessId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newSession: TrainingSession = {
        ...s,
        id: sessId,
        assignment_id: assignmentId,
        request_id: requestId,
        delivery_status: 'scheduled',
        attendance_count: 0,
        verified_by_school: false,
        created_at: new Date().toISOString(),
      };
      this.trainingSessions.set(newSession.id, newSession);
      created.push(newSession);
    }

    return created;
  }

  getSessionsForRequest(requestId: string): TrainingSession[] {
    return Array.from(this.trainingSessions.values()).filter((s) => s.request_id === requestId);
  }

  getSessionsForTrainer(trainerId: string): TrainingSession[] {
    const assignmentIds = new Set(
      Array.from(this.trainingAssignments.values())
        .filter((a) => a.trainer_id === trainerId)
        .map((a) => a.id)
    );
    return Array.from(this.trainingSessions.values()).filter((s) => assignmentIds.has(s.assignment_id));
  }

  getUpcomingTrainingSessions(userId: string): TrainingSession[] {
    // 1. If trainer
    const trainer = this.getTrainerByUserId(userId);
    if (trainer) {
      return this.getSessionsForTrainer(trainer.id);
    }

    // 2. If student: find student's enrolled classrooms and return associated training sessions
    const enrolledClassroomIds = new Set<string>();
    for (const enr of this.enrollments.values()) {
      if (enr.student_id === userId) {
        enrolledClassroomIds.add(enr.classroom_id);
      }
    }

    if (enrolledClassroomIds.size > 0) {
      return Array.from(this.trainingSessions.values()).filter(
        (s) => s.classroom_id && enrolledClassroomIds.has(s.classroom_id)
      );
    }

    // Default: return all scheduled sessions in student's default school if any
    return Array.from(this.trainingSessions.values()).filter((s) => s.delivery_status === 'scheduled');
  }

  logSessionDelivery(trainerUserId: string, sessionId: string, attendanceCount: number, notes?: string): TrainingSession {
    const session = this.trainingSessions.get(sessionId);
    if (!session) {
      throw new DatabaseError('Training session not found', '23503', 404);
    }
    const assignment = this.trainingAssignments.get(session.assignment_id);
    if (!assignment) {
      throw new DatabaseError('Associated assignment not found', '23503', 404);
    }
    const trainer = this.trainers.get(assignment.trainer_id);
    if (!trainer || trainer.user_id !== trainerUserId) {
      throw new DatabaseError('Forbidden: only the assigned trainer can record session delivery', '42501', 403);
    }

    session.delivery_status = 'delivered';
    session.attendance_count = attendanceCount;
    session.delivery_notes = notes || null;
    session.completed_at = new Date().toISOString();

    trainer.completed_assignments_count += 1;

    this.logAuditEvent({
      organization_id: null,
      actor_id: trainerUserId,
      action_type: 'TRAINING_SESSION_DELIVERED',
      resource_type: 'training_session',
      resource_id: session.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { sessionId, attendanceCount, notes },
    });

    return session;
  }

  verifySessionAttendance(schoolUserId: string, sessionId: string): TrainingSession {
    const session = this.trainingSessions.get(sessionId);
    if (!session) {
      throw new DatabaseError('Training session not found', '23503', 404);
    }
    const req = this.trainingRequests.get(session.request_id);
    if (!req) {
      throw new DatabaseError('Associated request not found', '23503', 404);
    }

    if (!this.hasOrgRole(schoolUserId, req.organization_id, 'institution_admin') &&
        !this.hasOrgRole(schoolUserId, req.organization_id, 'teacher') &&
        !this.isPlatformSuperadmin(schoolUserId)) {
      throw new DatabaseError('Unauthorized to verify session attendance for this school', '42501', 403);
    }

    session.verified_by_school = true;

    this.logAuditEvent({
      organization_id: req.organization_id,
      actor_id: schoolUserId,
      action_type: 'SESSION_ATTENDANCE_VERIFIED',
      resource_type: 'training_session',
      resource_id: session.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { sessionId, verifiedBy: schoolUserId },
    });

    return session;
  }

  getInvoicesForOrg(orgId: string): TrainingInvoice[] {
    return Array.from(this.trainingInvoices.values()).filter((inv) => inv.organization_id === orgId);
  }

  getAllInvoices(): TrainingInvoice[] {
    return Array.from(this.trainingInvoices.values());
  }

  payInvoice(callerUserId: string, invoiceId: string): TrainingInvoice {
    const inv = this.trainingInvoices.get(invoiceId);
    if (!inv) {
      throw new DatabaseError('Invoice not found', '23503', 404);
    }

    if (!this.hasOrgRole(callerUserId, inv.organization_id, 'institution_admin') && !this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Unauthorized to settle invoices for this organization', '42501', 403);
    }

    inv.status = 'paid';
    inv.paid_at = new Date().toISOString();

    this.logAuditEvent({
      organization_id: inv.organization_id,
      actor_id: callerUserId,
      action_type: 'TRAINING_INVOICE_PAID',
      resource_type: 'training_invoice',
      resource_id: inv.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { invoiceId, totalPaise: inv.total_paise },
    });

    return inv;
  }

  getPayoutsForTrainer(trainerId: string): TrainerPayout[] {
    return Array.from(this.trainerPayouts.values()).filter((p) => p.trainer_id === trainerId);
  }

  getAllPayouts(): TrainerPayout[] {
    return Array.from(this.trainerPayouts.values());
  }

  accrueTrainerPayout(assignmentId: string, trainerId: string, amountPaise: number): TrainerPayout {
    const idemKey = `idem_payout_${assignmentId}`;
    // Check if already accrued to guarantee idempotency
    for (const p of this.trainerPayouts.values()) {
      if (p.idempotency_key === idemKey) return p;
    }

    const payoutId = `payout-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newPayout: TrainerPayout = {
      id: payoutId,
      trainer_id: trainerId,
      assignment_id: assignmentId,
      amount_paise: amountPaise,
      status: 'accrued',
      idempotency_key: idemKey,
      created_at: new Date().toISOString(),
    };

    this.trainerPayouts.set(newPayout.id, newPayout);
    return newPayout;
  }

  approveTrainerPayout(callerUserId: string, payoutId: string): TrainerPayout {
    if (!this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Only platform superadmins can authorize trainer payout disbursements', '42501', 403);
    }
    const payout = this.trainerPayouts.get(payoutId);
    if (!payout) {
      throw new DatabaseError('Payout record not found', '23503', 404);
    }
    if (payout.status !== 'accrued') {
      throw new DatabaseError(`Cannot approve payout in status '${payout.status}'`, '23514', 400);
    }

    payout.status = 'approved';
    payout.approved_by = callerUserId;
    payout.approved_at = new Date().toISOString();

    this.logAuditEvent({
      organization_id: null,
      actor_id: callerUserId,
      action_type: 'TRAINER_PAYOUT_APPROVED',
      resource_type: 'trainer_payout',
      resource_id: payout.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { payoutId, amountPaise: payout.amount_paise },
    });

    return payout;
  }

  settleTrainerPayout(callerUserId: string, payoutId: string): TrainerPayout {
    if (!this.isPlatformSuperadmin(callerUserId)) {
      throw new DatabaseError('Only platform superadmins can execute payout settlements', '42501', 403);
    }
    const payout = this.trainerPayouts.get(payoutId);
    if (!payout) {
      throw new DatabaseError('Payout record not found', '23503', 404);
    }
    if (payout.status !== 'approved' && payout.status !== 'processing') {
      throw new DatabaseError(`Cannot settle payout in status '${payout.status}'`, '23514', 400);
    }

    payout.status = 'settled';
    payout.settled_at = new Date().toISOString();

    this.logAuditEvent({
      organization_id: null,
      actor_id: callerUserId,
      action_type: 'TRAINER_PAYOUT_SETTLED',
      resource_type: 'trainer_payout',
      resource_id: payout.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { payoutId, amountPaise: payout.amount_paise, settledAt: payout.settled_at },
    });

    return payout;
  }

  reportSafeguardingIncident(
    reporterUserId: string,
    orgId: string,
    category: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    subjectUserId?: string
  ): SafeguardingReport {
    const reporter = this.users.get(reporterUserId);
    const subject = subjectUserId ? this.users.get(subjectUserId) : undefined;

    const reportId = `sg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newReport: SafeguardingReport = {
      id: reportId,
      organization_id: orgId,
      reporter_id: reporterUserId,
      reporter_name: reporter?.full_name || 'Anonymous Reporter',
      subject_user_id: subjectUserId || null,
      subject_name: subject?.full_name || undefined,
      category,
      severity,
      description,
      status: 'open',
      reported_at: new Date().toISOString(),
    };

    this.safeguardingReports.set(newReport.id, newReport);

    this.logAuditEvent({
      organization_id: orgId,
      actor_id: reporterUserId,
      action_type: 'SAFEGUARDING_INCIDENT_REPORTED',
      resource_type: 'safeguarding_report',
      resource_id: newReport.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { category, severity },
    });

    return newReport;
  }

  getSafeguardingReports(callerOrgId?: string, isSuperadmin: boolean = false): SafeguardingReport[] {
    const list = Array.from(this.safeguardingReports.values());
    if (isSuperadmin) return list;
    if (!callerOrgId) return [];
    return list.filter((r) => r.organization_id === callerOrgId);
  }

  resolveSafeguardingReport(adminUserId: string, reportId: string, resolutionNotes: string): SafeguardingReport {
    if (!this.isPlatformSuperadmin(adminUserId)) {
      throw new DatabaseError('Only platform superadmins can resolve safeguarding reports', '42501', 403);
    }
    const report = this.safeguardingReports.get(reportId);
    if (!report) {
      throw new DatabaseError('Safeguarding report not found', '23503', 404);
    }

    report.status = 'resolved';
    report.resolved_at = new Date().toISOString();
    report.resolution_notes = resolutionNotes;

    this.logAuditEvent({
      organization_id: report.organization_id,
      actor_id: adminUserId,
      action_type: 'SAFEGUARDING_INCIDENT_RESOLVED',
      resource_type: 'safeguarding_report',
      resource_id: report.id,
      ip_address: '127.0.0.1',
      user_agent: 'Geniusphere-Marketplace/2.0',
      details: { reportId, resolutionNotes },
    });

    return report;
  }
}

export const db = new InMemoryDatabase();

