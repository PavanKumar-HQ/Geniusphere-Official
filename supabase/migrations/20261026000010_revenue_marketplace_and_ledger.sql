-- ====================================================================
-- Geniusphere — Migration 010: Revenue Marketplace Integration
-- Packages, Materials, Bookings, Payment Records, Allocations & Ledger
-- ====================================================================

-- 1. STANDARD COURSE PACKAGES
CREATE TABLE IF NOT EXISTS public.marketplace_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(50) NOT NULL CHECK (domain IN ('technology', 'coding', 'finance', 'cybersecurity', 'professional')),
    target_grade_range VARCHAR(100) NOT NULL,
    session_count INTEGER NOT NULL CHECK (session_count > 0),
    duration_hours_per_session NUMERIC(4, 2) NOT NULL CHECK (duration_hours_per_session > 0),
    max_cohort_size INTEGER NOT NULL CHECK (max_cohort_size > 0),
    delivery_mode VARCHAR(50) NOT NULL CHECK (delivery_mode IN ('in_person', 'online', 'hybrid')),
    base_price_paise BIGINT NOT NULL CHECK (base_price_paise >= 0),
    trainer_allocation_paise BIGINT NOT NULL CHECK (trainer_allocation_paise >= 0),
    platform_fee_paise BIGINT NOT NULL CHECK (platform_fee_paise >= 0),
    learning_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
    included_services JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_packages_domain ON public.marketplace_packages(domain);
CREATE INDEX IF NOT EXISTS idx_packages_published ON public.marketplace_packages(is_published);

-- 2. MATERIALS & HARDWARE KITS CATALOG
CREATE TABLE IF NOT EXISTS public.marketplace_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise >= 0),
    unit_cost_paise BIGINT NOT NULL CHECK (unit_cost_paise >= 0),
    unit_type VARCHAR(50) NOT NULL DEFAULT 'kit', -- kit, book, license, hardware
    supplier_name VARCHAR(255) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    delivery_terms TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_materials_sku ON public.marketplace_materials(sku);
CREATE INDEX IF NOT EXISTS idx_materials_avail ON public.marketplace_materials(is_available);

-- 3. TRAINER PROPOSALS FOR OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.trainer_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.training_requests(id) ON DELETE CASCADE,
    trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
    proposed_daily_rate_paise BIGINT NOT NULL CHECK (proposed_daily_rate_paise > 0),
    cover_note TEXT NOT NULL,
    availability_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'shortlisted', 'accepted', 'declined', 'withdrawn')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(request_id, trainer_id)
);
CREATE INDEX IF NOT EXISTS idx_proposals_request ON public.trainer_proposals(request_id);
CREATE INDEX IF NOT EXISTS idx_proposals_trainer ON public.trainer_proposals(trainer_id);

-- 4. CONFIRMED COMMERCIAL BOOKINGS & CONTRACT SNAPSHOTS
CREATE TABLE IF NOT EXISTS public.training_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE NOT NULL REFERENCES public.training_requests(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES public.training_quotes(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.marketplace_packages(id) ON DELETE SET NULL,
    booking_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'requested' CHECK (
        status IN ('requested', 'quoted', 'awaiting_school_approval', 'confirmed', 'scheduled', 'in_progress', 'delivered', 'accepted', 'completed', 'disputed', 'cancelled')
    ),
    -- Immutable Financial Snapshot upon Confirmation
    training_fee_paise BIGINT NOT NULL DEFAULT 0,
    materials_fee_paise BIGINT NOT NULL DEFAULT 0,
    platform_fee_paise BIGINT NOT NULL DEFAULT 0,
    trainer_compensation_paise BIGINT NOT NULL DEFAULT 0,
    tax_paise BIGINT NOT NULL DEFAULT 0,
    gross_total_paise BIGINT NOT NULL DEFAULT 0,
    terms_markdown TEXT NOT NULL,
    confirmed_at TIMESTAMPTZ,
    school_accepted_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_org ON public.training_bookings(organization_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.training_bookings(status);

-- 5. BOOKING SELECTED MATERIALS
CREATE TABLE IF NOT EXISTS public.booking_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.training_bookings(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.marketplace_materials(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise >= 0),
    total_price_paise BIGINT NOT NULL CHECK (total_price_paise >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(booking_id, material_id)
);
CREATE INDEX IF NOT EXISTS idx_booking_materials_bk ON public.booking_materials(booking_id);

-- 6. RECORDED PAYMENTS & BANK RECEIPTS (MANUAL MODE NOW, PROVIDER CONTRACT-READY)
CREATE TABLE IF NOT EXISTS public.recorded_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'cheque', 'neft_rtgs', 'manual_cash', 'provider_gateway_contract')),
    transaction_reference VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255),
    notes TEXT,
    evidence_url TEXT,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID NOT NULL REFERENCES public.users(id),
    reconciled_by UUID REFERENCES public.users(id),
    reconciled_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'recorded' CHECK (status IN ('recorded', 'reconciled', 'disputed', 'reversed')),
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_org ON public.recorded_payments(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.recorded_payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_ref ON public.recorded_payments(transaction_reference);

-- 7. PAYMENT ALLOCATIONS TO INVOICES
CREATE TABLE IF NOT EXISTS public.payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.recorded_payments(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.training_invoices(id) ON DELETE CASCADE,
    allocated_amount_paise BIGINT NOT NULL CHECK (allocated_amount_paise > 0),
    allocated_by UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_allocations_payment ON public.payment_allocations(payment_id);
CREATE INDEX IF NOT EXISTS idx_allocations_invoice ON public.payment_allocations(invoice_id);

-- 8. DOUBLE-ENTRY FINANCIAL LEDGER
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_number BIGSERIAL,
    booking_id UUID REFERENCES public.training_bookings(id) ON DELETE SET NULL,
    invoice_id UUID REFERENCES public.training_invoices(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES public.recorded_payments(id) ON DELETE SET NULL,
    payout_id UUID REFERENCES public.trainer_payouts(id) ON DELETE SET NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('accounts_receivable', 'bank_cash', 'trainer_payable', 'platform_revenue', 'tax_payable', 'materials_cogs')),
    entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('debit', 'credit')),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    description TEXT NOT NULL,
    actor_id UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ledger_acct ON public.financial_ledger(account_type);
CREATE INDEX IF NOT EXISTS idx_ledger_booking ON public.financial_ledger(booking_id);
CREATE INDEX IF NOT EXISTS idx_ledger_invoice ON public.financial_ledger(invoice_id);
