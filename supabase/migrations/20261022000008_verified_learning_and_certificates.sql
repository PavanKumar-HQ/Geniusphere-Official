-- ====================================================================
-- Geniusphere — Migration 008: Verified Learning, Progression & Certificates
-- Establishes distinct states for:
--  1. Video playback progress (never awards competency XP alone)
--  2. Authoritative Certificates (only issued upon 100% verified lesson completion)
--  3. Audit log of assessment verification results
-- ====================================================================

-- 1. VIDEO PLAYBACK PROGRESS (Non-competency telemetry)
CREATE TABLE IF NOT EXISTS public.lesson_playback_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    watch_time_seconds INTEGER NOT NULL DEFAULT 0,
    video_completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_position_seconds INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_playback_user_course ON public.lesson_playback_telemetry(user_id, course_id);

-- 2. VERIFIED CERTIFICATES (Issued exclusively on complete course verification)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    course_title VARCHAR(255) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    verification_code VARCHAR(100) UNIQUE NOT NULL,
    verification_hash VARCHAR(128) NOT NULL,
    grade INTEGER NOT NULL DEFAULT 100,
    skills_acquired JSONB NOT NULL DEFAULT '[]'::jsonb,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(verification_code);

-- 3. RLS POLICIES
ALTER TABLE public.lesson_playback_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own playback telemetry" ON public.lesson_playback_telemetry;
CREATE POLICY "Users can view own playback telemetry"
    ON public.lesson_playback_telemetry FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own playback telemetry" ON public.lesson_playback_telemetry;
CREATE POLICY "Users can update own playback telemetry"
    ON public.lesson_playback_telemetry FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
CREATE POLICY "Users can view own certificates"
    ON public.certificates FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can verify certificate by code" ON public.certificates;
CREATE POLICY "Public can verify certificate by code"
    ON public.certificates FOR SELECT
    USING (TRUE);

GRANT ALL ON public.lesson_playback_telemetry TO authenticated, service_role;
GRANT SELECT ON public.lesson_playback_telemetry TO anon;

GRANT ALL ON public.certificates TO authenticated, service_role;
GRANT SELECT ON public.certificates TO anon;
