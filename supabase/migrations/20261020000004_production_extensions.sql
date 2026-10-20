-- ====================================================================
-- Geniusphere — Migration 004: Production Operations & Real-Time Extensions
-- Centralized Course Enrollments, Lesson Progress, Lab Attempts,
-- Notifications, Web Push Subscriptions, Transactional Outbox, and Jobs
-- ====================================================================

-- 1. COURSE ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(course_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON public.course_enrollments(course_id);

-- 2. LESSON COMPLETIONS
CREATE TABLE IF NOT EXISTS public.lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL DEFAULT 100,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON public.lesson_completions(user_id);

-- 3. USER PROGRESS & MATHEMATICAL STREAKS
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    xp INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    streak_last_extended_date DATE,
    total_time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LAB ATTEMPTS
CREATE TABLE IF NOT EXISTS public.lab_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lab_slug VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed')),
    score INTEGER NOT NULL DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lab_attempts_user ON public.lab_attempts(user_id);

-- 5. PERSISTENT NOTIFICATIONS & RECEIPTS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    dedup_key VARCHAR(100),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_view VARCHAR(100),
    action_slug VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_dedup ON public.notifications(user_id, dedup_key);

-- 6. PUSH SUBSCRIPTIONS (VAPID Registry)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions(user_id);

-- 7. TRANSACTIONAL OUTBOX
CREATE TABLE IF NOT EXISTS public.transactional_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON public.transactional_outbox(status);

-- 8. DURABLE BACKGROUND JOBS
CREATE TABLE IF NOT EXISTS public.durable_background_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'dead_letter')),
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_jobs_status_run ON public.durable_background_jobs(status, run_at);

-- ====================================================================
-- RLS POLICIES FOR EXTENSION TABLES
-- ====================================================================

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactional_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.durable_background_jobs ENABLE ROW LEVEL SECURITY;

-- Course Enrollments
DROP POLICY IF EXISTS "Users can view own course enrollments" ON public.course_enrollments;
CREATE POLICY "Users can view own course enrollments"
    ON public.course_enrollments FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS "Users can create own course enrollments" ON public.course_enrollments;
CREATE POLICY "Users can create own course enrollments"
    ON public.course_enrollments FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_platform_superadmin());

-- Lesson Completions
DROP POLICY IF EXISTS "Users can view own lesson completions" ON public.lesson_completions;
CREATE POLICY "Users can view own lesson completions"
    ON public.lesson_completions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS "Users can record own lesson completions" ON public.lesson_completions;
CREATE POLICY "Users can record own lesson completions"
    ON public.lesson_completions FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_platform_superadmin());

-- User Progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress"
    ON public.user_progress FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin());

-- Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin());

DROP POLICY IF EXISTS "Users can update own notification read status" ON public.notifications;
CREATE POLICY "Users can update own notification read status"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin())
    WITH CHECK (user_id = auth.uid() OR public.is_platform_superadmin());

-- Push Subscriptions
DROP POLICY IF EXISTS "Users manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users manage own push subscriptions"
    ON public.push_subscriptions FOR ALL
    TO authenticated
    USING (user_id = auth.uid() OR public.is_platform_superadmin());

-- Outbox & Jobs: Restricted to service_role and superadmin
DROP POLICY IF EXISTS "Service role manages outbox" ON public.transactional_outbox;
CREATE POLICY "Service role manages outbox"
    ON public.transactional_outbox FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role manages jobs" ON public.durable_background_jobs;
CREATE POLICY "Service role manages jobs"
    ON public.durable_background_jobs FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);
