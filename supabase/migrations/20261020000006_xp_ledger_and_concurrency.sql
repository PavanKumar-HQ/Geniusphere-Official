-- ====================================================================
-- MIGRATION 006: AUTHORITATIVE XP LEDGER & REWARD IDEMPOTENCY
-- Enforces transactional uniqueness for all reward disbursements (lessons, labs, streak bonuses)
-- Prevents double-spend under concurrency, retries, double-clicks, and network timeouts.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.xp_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reward_key VARCHAR(150) UNIQUE NOT NULL,
    amount INTEGER NOT NULL CHECK (amount >= 0),
    source_type VARCHAR(50) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON public.xp_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_key ON public.xp_ledger(reward_key);

-- Backfill xp_ledger from existing lesson_completions if not already populated
INSERT INTO public.xp_ledger (user_id, reward_key, amount, source_type, metadata, created_at)
SELECT 
    lc.user_id,
    'lesson_complete:' || lc.user_id::text || ':' || lc.course_id::text || ':' || lc.lesson_id as reward_key,
    50 as amount,
    'lesson_completion' as source_type,
    json_build_object('courseId', lc.course_id, 'lessonId', lc.lesson_id)::jsonb as metadata,
    lc.completed_at as created_at
FROM public.lesson_completions lc
ON CONFLICT (reward_key) DO NOTHING;

-- RLS
ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own xp ledger" ON public.xp_ledger;
CREATE POLICY "Users can view own xp ledger"
    ON public.xp_ledger FOR SELECT
    USING (auth.uid() = user_id);

GRANT ALL ON public.xp_ledger TO authenticated, service_role;
GRANT SELECT ON public.xp_ledger TO anon;
