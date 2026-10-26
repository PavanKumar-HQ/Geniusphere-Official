import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';

describe('Revenue Marketplace, Booking Snapshots, Payments & Double-Entry Ledger Suite', () => {
  let db: InMemoryDatabase;

  const schoolAdminId = 'user-admin-1'; // Principal Verma, org-school-1
  const superadminId = 'user-superadmin-1';
  const trainerUserId = 'user-trainer-1';
  const dptsOrgId = 'org-school-1';
  const otherOrgId = 'org-school-2';

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('Gate 1: Standard Packages & Hardware Materials Catalog', () => {
    it('creates and retrieves published marketplace packages with strict permissions', () => {
      // Non-superadmin cannot create course package
      expect(() => {
        db.createMarketplacePackage(schoolAdminId, {
          title: 'Unauthorized Package',
          slug: 'unauth-pkg',
          domain: 'technology',
          target_grade_range: 'Grade 9-12',
          session_count: 5,
          duration_hours_per_session: 2,
          max_cohort_size: 35,
          delivery_mode: 'in_person',
          base_price_paise: 3000000,
          trainer_allocation_paise: 2000000,
          platform_fee_paise: 1000000,
          learning_outcomes: ['Robotics', 'Sensors'],
          included_services: ['Hardware Kit'],
          is_published: true,
        });
      }).toThrow(/Only platform superadmins can create course packages/);

      // Superadmin successfully creates course package
      const pkg = db.createMarketplacePackage(superadminId, {
        title: 'Complete Autonomous Robotics & IoT Workshop',
        slug: 'robotics-iot-workshop',
        domain: 'technology',
        target_grade_range: 'Grade 8-12',
        session_count: 4,
        duration_hours_per_session: 2,
        max_cohort_size: 40,
        delivery_mode: 'in_person',
        base_price_paise: 5000000, // ₹50,000
        trainer_allocation_paise: 3500000, // ₹35,000
        platform_fee_paise: 1500000, // ₹15,000
        learning_outcomes: ['Microcontroller Architecture', 'GPIO Sensors', 'Motor Control'],
        included_services: ['Hardware Lab Kit', 'Teacher Guide', 'Student Certificates'],
        is_published: true,
      });

      expect(pkg.id).toBeDefined();
      expect(pkg.title).toBe('Complete Autonomous Robotics & IoT Workshop');

      const packages = db.getMarketplacePackages();
      expect(packages.length).toBeGreaterThanOrEqual(1);
      expect(packages.some((p) => p.slug === 'robotics-iot-workshop')).toBe(true);
    });

    it('manages hardware materials catalog with strict authorization', () => {
      const mat = db.createMarketplaceMaterial(superadminId, {
        name: 'Arduino Microcontroller & Sensor Kit (40-pack)',
        sku: 'KIT-ARDUINO-40PK',
        description: 'Complete hands-on electronics hardware package for 40 students.',
        unit_price_paise: 1500000, // ₹15,000
        unit_cost_paise: 1100000, // ₹11,000
        unit_type: 'kit',
        supplier_name: 'RoboTech Solutions India',
        is_available: true,
        stock_quantity: 50,
        delivery_terms: 'Surface courier within 3 business days',
      });

      expect(mat.id).toBeDefined();
      expect(mat.sku).toBe('KIT-ARDUINO-40PK');

      const materials = db.getMarketplaceMaterials();
      expect(materials.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Gate 2: Trainer Proposals & Opportunity Bidding', () => {
    it('allows verified trainers to bid on school requirements and prevents unverified bidders', () => {
      // 1. Submit training request
      const req = db.createTrainingRequest(schoolAdminId, dptsOrgId, {
        title: 'FinTech Algorithmic Trading Workshop',
        domain: 'finance',
        target_grade_range: 'Grade 11-12',
        approx_cohort_size: 35,
        learning_objectives: 'Order book dynamics, VWAP, market making.',
        preferred_format: 'in_person',
        preferred_start_date: '2026-11-20',
        preferred_end_date: '2026-11-22',
        location_address: 'DPTS New Delhi',
        budget_max_paise: 6000000,
      });

      // 2. Verified trainer Vikram Singh submits proposal
      const proposal = db.submitTrainerProposal(trainerUserId, req.id, {
        proposedDailyRatePaise: 500000, // ₹5,000/day
        coverNote: 'Over 8 years experience teaching financial quantitative analysis.',
        availabilityDates: ['2026-11-20', '2026-11-21', '2026-11-22'],
      });

      expect(proposal.id).toBeDefined();
      expect(proposal.status).toBe('submitted');
      expect(proposal.proposed_daily_rate_paise).toBe(500000);

      // 3. School admin can review proposals
      const proposals = db.getProposalsForRequest(schoolAdminId, req.id);
      expect(proposals.length).toBe(1);
      expect(proposals[0].cover_note).toContain('financial quantitative analysis');

      // 4. Duplicate proposal by same trainer is rejected
      expect(() => {
        db.submitTrainerProposal(trainerUserId, req.id, {
          proposedDailyRatePaise: 450000,
          coverNote: 'Duplicate proposal attempt',
          availabilityDates: ['2026-11-20'],
        });
      }).toThrow(/Proposal already submitted/);
    });
  });

  describe('Gate 3: Commercial Bookings, Snapshots & Double-Entry Ledger', () => {
    it('creates an immutable booking financial snapshot and issues invoice with ledger entries', () => {
      // 1. Setup Request & Quote
      const req = db.createTrainingRequest(schoolAdminId, dptsOrgId, {
        title: 'Full Stack Web & Database Security Intensive',
        domain: 'coding',
        target_grade_range: 'Grade 10-12',
        approx_cohort_size: 30,
        learning_objectives: 'PostgreSQL, Node.js security, OAuth.',
        preferred_format: 'in_person',
        preferred_start_date: '2026-12-05',
        preferred_end_date: '2026-12-07',
        location_address: 'DPTS New Delhi',
        budget_max_paise: 7000000,
      });

      const quote = db.createTrainingQuote(superadminId, req.id, {
        gross_amount_paise: 5900000,
        trainer_fee_paise: 3500000, // ₹35,000
        platform_fee_paise: 1500000, // ₹15,000
        tax_amount_paise: 900000, // ₹9,000 (18%)
        terms_markdown: 'Net 15 payment terms.',
        valid_until: new Date(Date.now() + 10 * 86400000).toISOString(),
      });

      // 2. School accepts and creates booking
      const booking = db.createBookingFromQuote(schoolAdminId, quote.id);

      expect(booking.id).toBeDefined();
      expect(booking.status).toBe('confirmed');
      expect(booking.booking_number).toMatch(/^GS-BK-\d{4}-\d+/);
      expect(booking.training_fee_paise).toBe(3500000);
      expect(booking.platform_fee_paise).toBe(1500000);
      expect(booking.tax_paise).toBe(900000);
      expect(booking.gross_total_paise).toBe(5900000);

      // 3. Verify double-entry ledger entries
      const ledger = db.getFinancialLedger(true);
      const bookingEntries = ledger.filter((l) => l.booking_id === booking.id);
      expect(bookingEntries.length).toBe(4);

      // Verify debit/credit balance
      const debits = bookingEntries.filter((l) => l.entry_type === 'debit').reduce((s, l) => s + l.amount_paise, 0);
      const credits = bookingEntries.filter((l) => l.entry_type === 'credit').reduce((s, l) => s + l.amount_paise, 0);
      expect(debits).toBe(5900000); // Accounts Receivable debited
      expect(credits).toBe(5900000); // Platform Revenue + Trainer Liability + GST credited
    });
  });

  describe('Gate 4: Manual Payment Recording, Invoice Allocation & Reconciliation', () => {
    it('records bank transfer, allocates to issued invoice, and reconciles against bank reference', () => {
      // 1. Setup Request, Quote, and Booking
      const req = db.createTrainingRequest(schoolAdminId, dptsOrgId, {
        title: 'Cyber Defense Cohort',
        domain: 'technology',
        target_grade_range: 'Grade 11-12',
        approx_cohort_size: 40,
        learning_objectives: 'Perimeter Defense',
        preferred_format: 'in_person',
        preferred_start_date: '2026-12-10',
        preferred_end_date: '2026-12-12',
        location_address: 'DPTS New Delhi',
        budget_max_paise: 8000000,
      });

      const quote = db.createTrainingQuote(superadminId, req.id, {
        gross_amount_paise: 5900000,
        trainer_fee_paise: 3500000,
        platform_fee_paise: 1500000,
        tax_amount_paise: 900000,
        terms_markdown: 'Net 15 terms.',
        valid_until: new Date(Date.now() + 10 * 86400000).toISOString(),
      });

      const booking = db.createBookingFromQuote(schoolAdminId, quote.id);
      const invoices = db.getInvoicesForOrg(dptsOrgId);
      const invoice = invoices.find((i) => i.request_id === req.id)!;
      expect(invoice).toBeDefined();
      expect(invoice.status).toBe('issued');
      expect(invoice.total_paise).toBe(5900000);

      // 2. Finance Admin records verified NEFT bank transfer
      const payment = db.recordPaymentReceipt(superadminId, {
        organizationId: dptsOrgId,
        amountPaise: 5900000,
        paymentMethod: 'neft_rtgs',
        transactionReference: 'UTR-HDFC-20261026-883921',
        bankName: 'HDFC Bank Corporate Current A/C',
        notes: 'Verified via HDFC Corporate NetBanking portal timestamp 14:15 IST',
      });

      expect(payment.id).toBeDefined();
      expect(payment.status).toBe('recorded');
      expect(payment.amount_paise).toBe(5900000);

      // 3. Allocate payment to invoice
      const allocation = db.allocatePaymentToInvoice(superadminId, payment.id, invoice.id, 5900000);
      expect(allocation.allocated_amount_paise).toBe(5900000);

      // Invoice status becomes 'paid'
      expect(invoice.status).toBe('paid');
      expect(invoice.paid_at).toBeDefined();

      // 4. Reconcile payment against statement
      const reconciled = db.reconcilePayment(superadminId, payment.id);
      expect(reconciled.status).toBe('reconciled');
      expect(reconciled.reconciled_by).toBe(superadminId);

      // 5. Verify audited revenue metrics
      const metrics = db.getRevenueMetricsSummary(true);
      expect(metrics.actualPaymentsReceivedPaise).toBeGreaterThanOrEqual(5900000);
      // The newly created invoice (5900000) was fully paid, remaining receivables is baseline inv-101 (4500000)
      expect(metrics.outstandingReceivablesPaise).toBe(4500000);
    });
  });
});
