// ====================================================================
// Geniusphere — Core Domain Types
// Strictly mirrors 10 Core Tables + Audit Logs
// ====================================================================

export type OrgType = 'school' | 'college' | 'university' | 'independent_learning';
export type OrgRole = 'learner' | 'teacher' | 'institution_admin' | 'curriculum_author';
export type AccountStatus = 'active' | 'pending_parent_consent' | 'suspended';
export type ConsentStatus = 'pending' | 'verified' | 'revoked';
export type SyncStatus = 'LOCAL_UNSYNCED' | 'SYNCING' | 'SERVER_CONFIRMED' | 'SYNC_CONFLICT';

export interface User {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string; // YYYY-MM-DD
  is_minor: boolean;
  is_superadmin: boolean;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  org_type: OrgType;
  is_active: boolean;
  created_at: string;
}

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  is_active: boolean;
  created_at: string;
}

export interface ParentGuardianLink {
  id: string;
  student_id: string;
  parent_user_id: string | null;
  parent_email: string;
  verification_token_hash: string | null;
  token_expires_at: string | null;
  consent_status: ConsentStatus;
  consent_granted_at: string | null;
  consent_method: string | null;
  created_at: string;
}

export interface Classroom {
  id: string;
  organization_id: string;
  teacher_id: string;
  name: string;
  join_code: string;
  join_code_expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface ClassroomEnrollment {
  id: string;
  classroom_id: string;
  student_id: string;
  enrolled_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  domain: 'technology' | 'cybersecurity' | 'finance' | 'professional';
  is_published: boolean;
  created_at: string;
}

export interface Lab {
  id: string;
  course_id: string;
  title: string;
  lab_type: 'sqlite_wasm' | 'python_wasm' | 'conceptual_quiz';
  challenge_spec: {
    prompt: string;
    vulnerable_example: string;
    target_table: string;
    expected_columns: string[];
    parameter_placeholder: string;
  };
  max_score: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  classroom_id: string;
  lab_id: string;
  due_date: string | null;
  max_score: number;
  max_attempts: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  attempt_number: number;
  submitted_query: string;
  submission_hash: string;
  passed: boolean;
  score: number;
  verification_log: {
    execution_time_ms: number;
    test_results: TestCaseResult[];
    details: string;
  };
  sync_status: SyncStatus;
  submitted_at: string;
}

export interface AuditEvent {
  id: string;
  organization_id: string | null;
  actor_id: string | null;
  action_type: string;
  resource_type: string;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

// Grader Contract Types
export interface TestCaseResult {
  case_id: number;
  description: string;
  input_value: string;
  passed: boolean;
  diagnostic: string;
  rows_returned?: number;
}

export interface GraderResult {
  submission_id: string;
  submission_hash: string;
  passed: boolean;
  score: number;
  attempt_number: number;
  execution_time_ms: number;
  details: string;
  test_results: TestCaseResult[];
}
