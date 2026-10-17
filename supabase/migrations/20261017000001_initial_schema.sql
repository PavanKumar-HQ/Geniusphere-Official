-- ====================================================================
-- Geniusphere — Migration 001: Core Relational Schema
-- 10 Core Tables + Audit Events
-- ====================================================================

-- 1. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    org_type VARCHAR(50) NOT NULL CHECK (org_type IN ('school', 'college', 'university', 'independent_learning')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USERS (Profiles - Decoupled Identity)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_minor BOOLEAN NOT NULL DEFAULT FALSE,
    is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
    account_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'pending_parent_consent', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Column-level privilege restriction: users can only update full_name
REVOKE UPDATE ON public.users FROM PUBLIC;
GRANT UPDATE (full_name) ON public.users TO PUBLIC;

-- 3. ORGANIZATION MEMBERSHIPS (Scoped Roles per Institution)
CREATE TABLE IF NOT EXISTS public.organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'teacher', 'institution_admin', 'curriculum_author')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id, role)
);

-- 4. PARENT-GUARDIAN LINKS
CREATE TABLE IF NOT EXISTS public.parent_guardian_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    parent_email VARCHAR(255) NOT NULL,
    verification_token_hash VARCHAR(64),
    token_expires_at TIMESTAMPTZ,
    consent_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (consent_status IN ('pending', 'verified', 'revoked')),
    consent_granted_at TIMESTAMPTZ,
    consent_method VARCHAR(50) CHECK (consent_method IN ('email_verification_link', 'school_proxy_pilot')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, parent_email)
);

-- 5. CLASSROOMS
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    join_code VARCHAR(8) UNIQUE NOT NULL, -- 8-character Crockford Base32
    join_code_expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CLASSROOM ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.classroom_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(classroom_id, student_id)
);

-- 7. COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(50) NOT NULL CHECK (domain IN ('technology', 'cybersecurity', 'finance', 'professional')),
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. LABS
CREATE TABLE IF NOT EXISTS public.labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    lab_type VARCHAR(50) NOT NULL CHECK (lab_type IN ('sqlite_wasm', 'python_wasm', 'conceptual_quiz')),
    challenge_spec JSONB NOT NULL,
    max_score INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    lab_id UUID NOT NULL REFERENCES public.labs(id) ON DELETE RESTRICT,
    due_date TIMESTAMPTZ,
    max_score INTEGER NOT NULL DEFAULT 100,
    max_attempts INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SUBMISSIONS (Server-Authoritative Anti-Tamper)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    submitted_query TEXT NOT NULL,
    submission_hash VARCHAR(64) NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    score INTEGER NOT NULL DEFAULT 0,
    verification_log JSONB NOT NULL DEFAULT '{}'::jsonb,
    sync_status VARCHAR(50) NOT NULL DEFAULT 'SERVER_CONFIRMED' CHECK (sync_status IN ('LOCAL_UNSYNCED', 'SYNCING', 'SERVER_CONFIRMED', 'SYNC_CONFLICT')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(assignment_id, student_id, attempt_number)
);

-- Column grants: regular users cannot alter score, passed, verification_log, or sync_status
REVOKE UPDATE, INSERT ON public.submissions FROM PUBLIC;
GRANT INSERT (assignment_id, student_id, attempt_number, submitted_query, submission_hash) ON public.submissions TO PUBLIC;

-- 11. AUDIT EVENTS (180-Day Domestic Log)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit table is strictly append-only for standard callers
REVOKE UPDATE, DELETE ON public.audit_events FROM PUBLIC;
GRANT INSERT ON public.audit_events TO PUBLIC;
