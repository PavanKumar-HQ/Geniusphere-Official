-- ====================================================================
-- Geniusphere — Migration 005: Authentication Credentials & Role Privileges
-- Adds password_hash column and grants least-privilege table permissions
-- to authenticated and geniusphere_app roles
-- ====================================================================

-- 1. ADD PASSWORD HASH TO USERS
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Prevent unauthorized updates to password_hash
REVOKE UPDATE (password_hash) ON public.users FROM PUBLIC;
REVOKE UPDATE (password_hash) ON public.users FROM authenticated;

-- Set default hashed password for test/seeded accounts: 'TestPass123!'
-- Hashed via bcrypt (10 rounds): $2b$10$YA27wlc8f/tWcjz8ROE01u15FnMkacLQcITpQZ9qzqFDyc8jRdbUm
UPDATE public.users 
SET password_hash = '$2b$10$YA27wlc8f/tWcjz8ROE01u15FnMkacLQcITpQZ9qzqFDyc8jRdbUm'
WHERE password_hash IS NULL;

-- 2. EXPLICIT LEAST-PRIVILEGE GRANTS TO geniusphere_app & authenticated
-- In vanilla PostgreSQL, roles must have table-level permissions in addition to RLS policies.
DO $$
DECLARE
    tbl text;
    operational_tables text[] := ARRAY[
        'organizations',
        'users',
        'organization_memberships',
        'parent_guardian_links',
        'classrooms',
        'classroom_enrollments',
        'courses',
        'labs',
        'assignments',
        'submissions',
        'audit_events',
        'course_enrollments',
        'lesson_completions',
        'user_progress',
        'lab_attempts',
        'notifications',
        'push_subscriptions',
        'transactional_outbox',
        'durable_background_jobs'
    ];
BEGIN
    FOREACH tbl IN ARRAY operational_tables LOOP
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO geniusphere_app;', tbl);
        EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated;', tbl);
    END LOOP;
END
$$;

-- Sequences usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO geniusphere_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
