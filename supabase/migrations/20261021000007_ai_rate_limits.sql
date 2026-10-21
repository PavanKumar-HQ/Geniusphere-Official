-- ====================================================================
-- Geniusphere — Migration 007: Durable AI Rate Limiting
-- Supports atomic distributed sliding window rate limiting across
-- serverless function instances and clustered servers.
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.ai_rate_limits (
    key VARCHAR(255) PRIMARY KEY,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_count INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_window ON public.ai_rate_limits(window_start);

ALTER TABLE public.ai_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow authenticated backend queries to manage rate limit counters
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_rate_limits TO authenticated, service_role;
