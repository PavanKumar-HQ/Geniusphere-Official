-- ====================================================================
-- Geniusphere — Migration 009: School Training Marketplace,
-- Verified Trainers, Cohort Scheduling, Invoicing, Payouts & Safeguarding
-- ====================================================================

-- 1. VERIFIED TRAINERS
CREATE TABLE IF NOT EXISTS public.trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
    headline VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    competencies JSONB NOT NULL DEFAULT '[]'::jsonb,
    qualified_grade_levels JSONB NOT NULL DEFAULT '[]'::jsonb,
    delivery_formats JSONB NOT NULL DEFAULT '["in_person", "online"]'::jsonb,
    service_locations JSONB NOT NULL DEFAULT '[]'::jsonb,
    daily_rate_paise INTEGER NOT NULL DEFAULT 500000, -- ₹5,000 / day in paise
    completed_assignments_count INTEGER NOT NULL DEFAULT 0,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trainers_user ON public.trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON public.trainers(verification_status);

-- 2. SCHOOL TRAINING REQUESTS
CREATE TABLE IF NOT EXISTS public.training_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(50) NOT NULL CHECK (domain IN ('technology', 'coding', 'finance', 'cybersecurity', 'professional')),
    target_grade_range VARCHAR(100) NOT NULL,
    approx_cohort_size INTEGER NOT NULL CHECK (approx_cohort_size > 0),
    learning_objectives TEXT NOT NULL,
    preferred_format VARCHAR(50) NOT NULL CHECK (preferred_format IN ('in_person', 'online', 'hybrid')),
    preferred_start_date DATE NOT NULL,
    preferred_end_date DATE NOT NULL,
    location_address TEXT NOT NULL,
    budget_max_paise INTEGER NOT NULL CHECK (budget_max_paise >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'quoted', 'awaiting_school_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_training_requests_org ON public.training_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_training_requests_status ON public.training_requests(status);

-- 3. COMMERCIAL TRAINING QUOTES
CREATE TABLE IF NOT EXISTS public.training_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE NOT NULL REFERENCES public.training_requests(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    gross_amount_paise INTEGER NOT NULL CHECK (gross_amount_paise > 0),
    trainer_fee_paise INTEGER NOT NULL CHECK (trainer_fee_paise > 0),
    platform_fee_paise INTEGER NOT NULL CHECK (platform_fee_paise >= 0),
    tax_amount_paise INTEGER NOT NULL DEFAULT 0,
    terms_markdown TEXT NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_training_quotes_request ON public.training_quotes(request_id);

-- 4. TRAINER ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.training_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.training_requests(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'offered' CHECK (status IN ('proposed', 'offered', 'accepted', 'declined', 'confirmed', 'completed', 'cancelled')),
    agreed_compensation_paise INTEGER NOT NULL CHECK (agreed_compensation_paise >= 0),
    assigned_by UUID NOT NULL REFERENCES public.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE(request_id, trainer_id)
);
CREATE INDEX IF NOT EXISTS idx_training_assignments_trainer ON public.training_assignments(trainer_id);

-- 5. TRAINING SESSIONS & LMS INTEGRATION
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.training_assignments(id) ON DELETE CASCADE,
    request_id UUID NOT NULL REFERENCES public.training_requests(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    session_number INTEGER NOT NULL,
    topic VARCHAR(255) NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    format VARCHAR(50) NOT NULL CHECK (format IN ('in_person', 'online', 'hybrid')),
    meeting_or_room VARCHAR(255) NOT NULL,
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (delivery_status IN ('scheduled', 'in_progress', 'delivered', 'rescheduled', 'cancelled')),
    attendance_count INTEGER NOT NULL DEFAULT 0,
    delivery_notes TEXT,
    verified_by_school BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_training_sessions_classroom ON public.training_sessions(classroom_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_assignment ON public.training_sessions(assignment_id);

-- 6. COMMERCIAL INVOICES
CREATE TABLE IF NOT EXISTS public.training_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    request_id UUID UNIQUE NOT NULL REFERENCES public.training_requests(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    subtotal_paise INTEGER NOT NULL,
    tax_paise INTEGER NOT NULL,
    total_paise INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'void')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_at TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_training_invoices_org ON public.training_invoices(organization_id);

-- 7. AUDITABLE TRAINER PAYOUT LEDGER
CREATE TABLE IF NOT EXISTS public.trainer_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES public.training_assignments(id) ON DELETE CASCADE,
    amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'accrued' CHECK (status IN ('accrued', 'approved', 'processing', 'settled')),
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMPTZ,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trainer_payouts_trainer ON public.trainer_payouts(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_payouts_idem ON public.trainer_payouts(idempotency_key);

-- 8. SAFEGUARDING & CHILD PROTECTION INCIDENT LOG
CREATE TABLE IF NOT EXISTS public.safeguarding_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES public.users(id),
    subject_user_id UUID REFERENCES public.users(id),
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved')),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_safeguarding_org ON public.safeguarding_reports(organization_id);
