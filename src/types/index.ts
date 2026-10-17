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

export type DomainType = 'technology' | 'coding' | 'finance' | 'professional';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type AvailabilityStatus = 'verified_functional' | 'implemented_in_build' | 'in_development';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export interface LessonQuiz {
  id: string;
  questions: QuizQuestion[];
}

export interface LessonActivity {
  id: string;
  title: string;
  instructions: string;
  starter_code?: string;
}

export interface SandboxConfig {
  title: string;
  type: string;
  prompt: string;
  defaultInput: string;
  expectedOutput?: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  summary: string;
  content_markdown: string;
  duration_minutes: number;
  activities?: LessonActivity[];
  quiz?: LessonQuiz;
  linked_lab_id?: string;
  video_url?: string;
  video_id?: string;
  svg_animation_type?: string;
  sandbox_config?: SandboxConfig;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  student_name: string;
  issue_date: string;
  verification_hash: string;
  grade: number;
  skills_acquired: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  school_name: string;
  xp: number;
  streak: number;
  courses_completed: number;
  badge: string;
  avatar_color: string;
}

export interface UserProgressState {
  xp: number;
  streak_days: number;
  last_active_date: string;
  completed_lessons: string[];
  completed_courses: string[];
  certificates: Certificate[];
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  domain: DomainType;
  subject: string;
  level: DifficultyLevel;
  summary: string;
  description: string;
  learning_objectives: string[];
  prerequisites: string[];
  duration_hours: number;
  is_published: boolean;
  availability_status: AvailabilityStatus;
  learning_path_id?: string;
  modules: CourseModule[];
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_lessons: string[];
  progress_percent: number;
  completed_at?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  domain: DomainType;
  description: string;
  target_audience: string;
  prerequisites: string[];
  course_ids: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
}

export interface StudentResume {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  headline: string;
  summary: string;
  skills: string[];
  education: { school: string; degree: string; graduation_year: string }[];
  projects: ResumeProject[];
  verified_achievements: string[];
  updated_at: string;
}

export type LabInteractionType = 'simulation' | 'sandbox' | 'exercise';
export type LabLifecycleState =
  | 'initial'
  | 'ready'
  | 'running'
  | 'success'
  | 'incorrect'
  | 'error'
  | 'reset'
  | 'saved'
  | 'offline_pending';

export interface LabDefinition {
  id: string;
  slug: string;
  title: string;
  category: DomainType;
  interaction_type: LabInteractionType;
  difficulty: DifficultyLevel;
  duration_minutes: number;
  summary: string;
  learning_objective: string;
  instructions: string[];
  initial_state: Record<string, any>;
  validation_criteria: string[];
  completion_threshold: number;
  course_slug?: string;
  is_published: boolean;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface LabAttemptRecord {
  id: string;
  lab_id: string;
  user_id: string;
  attempt_number: number;
  passed: boolean;
  score: number;
  diagnostics: string;
  saved_state?: Record<string, any>;
  sync_status: SyncStatus;
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

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_id: string;
  category: DomainType | 'general';
  duration_minutes: number;
  featured?: boolean;
  instructor_name?: string;
  added_by: string;
  created_at: string;
}

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  category: DomainType | 'educator' | 'career';
  resource_type: 'guide' | 'cheatsheet' | 'toolkit' | 'curriculum';
  format: 'PDF' | 'Interactive' | 'Markdown';
  duration_or_pages: string;
  action_label: string;
  action_type: 'view_guide' | 'open_tool' | 'download';
  target_view?: string;
  is_verified: boolean;
}

