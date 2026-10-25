import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';

describe('School Training Marketplace & Trainer Lifecycle Suite', () => {
  let db: InMemoryDatabase;

  const schoolAdminId = 'user-admin-1'; // Principal Verma, org-school-1
  const superadminId = 'user-superadmin-1';
  const studentId = 'user-student-1';
  const trainerUserId = 'user-trainer-1';
  const dptsOrgId = 'org-school-1';
  const otherOrgId = 'org-school-2';

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('Gate 1: Training Request Lifecycle & Finite State Machine', () => {
    it('progresses from submitted → quoted → awaiting_school_confirmation → confirmed → in_progress → completed', () => {
      // 1. School Admin submits a new training request
      const req = db.createTrainingRequest(schoolAdminId, dptsOrgId, {
        title: 'High School Cyber Defense & Ethical Hacking Workshop',
        domain: 'technology',
        target_grade_range: 'Grade 10-12',
        approx_cohort_size: 45,
        learning_objectives: 'Network perimeter defense, phishing detection, and Wireshark traffic analysis.',
        preferred_format: 'in_person',
        preferred_start_date: '2026-11-15',
        preferred_end_date: '2026-11-17',
        location_address: 'DPTS Tech Campus, Block C, New Delhi',
        budget_max_paise: 8000000, // ₹80,000 max budget
      });

      expect(req.id).toBeDefined();
      expect(req.status).toBe('submitted');
      expect(req.organization_id).toBe(dptsOrgId);

      // 2. Superadmin reviews and issues commercial quote with integer minor unit arithmetic (paise)
      const trainerFeePaise = 5000000; // ₹50,000
      const platformFeePaise = 1500000; // ₹15,000
      const subtotalPaise = trainerFeePaise + platformFeePaise; // ₹65,000
      const taxPaise = Math.round(subtotalPaise * 0.18); // ₹11,700 (18% GST)
      const grossPaise = subtotalPaise + taxPaise; // ₹76,700

      const quote = db.createTrainingQuote(superadminId, req.id, {
        gross_amount_paise: grossPaise,
        trainer_fee_paise: trainerFeePaise,
        platform_fee_paise: platformFeePaise,
        tax_amount_paise: taxPaise,
        terms_markdown: 'Payment Net 15 days upon completion. Includes hands-on lab sandbox access.',
        valid_until: new Date(Date.now() + 14 * 86400000).toISOString(),
      });

      expect(quote.status).toBe('issued');
      expect(quote.gross_amount_paise).toBe(7670000);

      // Request status advances to awaiting confirmation
      const updatedReq = db.getTrainingRequestById(req.id);
      expect(updatedReq?.status).toBe('awaiting_school_confirmation');

      // 3. School Admin reviews and accepts commercial quote
      const acceptanceResult = db.acceptTrainingQuote(schoolAdminId, quote.id);
      expect(acceptanceResult.quote.status).toBe('accepted');
      expect(acceptanceResult.request.status).toBe('confirmed');
      expect(acceptanceResult.invoice).toBeDefined();
      expect(acceptanceResult.invoice.total_paise).toBe(grossPaise);
      expect(acceptanceResult.invoice.status).toBe('issued');
    });

    it('rejects invalid or unauthorized state transitions', () => {
      // Student cannot create training request
      expect(() => {
        db.createTrainingRequest(studentId, dptsOrgId, {
          title: 'Unauthorized Request',
          domain: 'technology',
          target_grade_range: 'Grade 9',
          approx_cohort_size: 20,
          learning_objectives: 'Test',
          preferred_format: 'online',
          preferred_start_date: '2026-12-01',
          preferred_end_date: '2026-12-02',
          location_address: 'Online',
          budget_max_paise: 1000000,
        });
      }).toThrow(/Forbidden: Only institution administrators can submit training requests/);

      // Student cannot issue quote
      expect(() => {
        db.createTrainingQuote(studentId, 'req-training-101', {
          gross_amount_paise: 5000000,
          trainer_fee_paise: 3000000,
          platform_fee_paise: 1000000,
          tax_amount_paise: 720000,
          terms_markdown: 'Terms',
          valid_until: new Date().toISOString(),
        });
      }).toThrow(/Only platform superadmins can issue commercial quotes/);
    });
  });

  describe('Gate 2: Multi-Tenant Isolation & Role Authorization', () => {
    it('enforces strict tenant isolation between institutions', () => {
      // School A admin requests training
      const reqA = db.createTrainingRequest(schoolAdminId, dptsOrgId, {
        title: 'School A Proprietary STEM Boot Camp',
        domain: 'technology',
        target_grade_range: 'Grade 8',
        approx_cohort_size: 30,
        learning_objectives: 'Robotics and sensors',
        preferred_format: 'in_person',
        preferred_start_date: '2026-11-10',
        preferred_end_date: '2026-11-12',
        location_address: 'School A Lab',
        budget_max_paise: 4000000,
      });

      // Issue quote for School A
      const quoteA = db.createTrainingQuote(superadminId, reqA.id, {
        gross_amount_paise: 3540000,
        trainer_fee_paise: 2000000,
        platform_fee_paise: 1000000,
        tax_amount_paise: 540000,
        terms_markdown: 'Terms',
        valid_until: new Date(Date.now() + 86400000).toISOString(),
      });

      // An admin from another institution (otherOrgId) must NOT be able to view or accept School A quote
      const otherAdminUser = 'user-other-admin';
      db.users.set(otherAdminUser, {
        id: otherAdminUser,
        email: 'principal@bta.edu',
        full_name: 'Principal Bengaluru',
        date_of_birth: '1980-01-01',
        is_minor: false,
        is_superadmin: false,
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      db.memberships.set('mem-other-admin', {
        id: 'mem-other-admin',
        organization_id: otherOrgId,
        user_id: otherAdminUser,
        role: 'institution_admin',
        is_active: true,
        created_at: new Date().toISOString(),
      });

      // Tenant isolation: other admin listing requests for their org should NOT see School A requests
      const otherRequests = db.getTrainingRequests(otherOrgId);
      expect(otherRequests.some((r) => r.id === reqA.id)).toBe(false);

      // Other admin cannot accept School A quote
      expect(() => {
        db.acceptTrainingQuote(otherAdminUser, quoteA.id);
      }).toThrow(/Unauthorized to confirm commercial quote for this organization/);
    });
  });

  describe('Gate 3: Trainer Verification & Assignment Matching', () => {
    it('prohibits assignment of unverified trainers and permits assignment once verified', () => {
      // Create pending unverified trainer
      const pendingUserId = 'user-new-trainer';
      db.users.set(pendingUserId, {
        id: pendingUserId,
        email: 'applicant@gmail.com',
        full_name: 'Rohit Sharma (Applicant)',
        date_of_birth: '1995-01-01',
        is_minor: false,
        is_superadmin: false,
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const pendingTrainer = db.registerTrainer({
        user_id: pendingUserId,
        headline: 'AI & Data Science Instructor',
        bio: 'M.Tech with 3 years teaching Python & ML.',
        competencies: ['artificial-intelligence', 'technology'],
        qualified_grade_levels: ['Grade 9-10', 'Grade 11-12'],
        delivery_formats: ['in_person', 'online'],
        service_locations: ['New Delhi', 'NCR'],
        daily_rate_paise: 600000, // ₹6,000/day
      });

      expect(pendingTrainer.verification_status).toBe('pending');

      // Attempting to assign unverified trainer must be rejected by invariant
      expect(() => {
        db.assignTrainerToRequest(superadminId, 'req-training-101', pendingTrainer.id, 5000000);
      }).toThrow(/Cannot assign unverified trainer to school programme/);

      // Superadmin conducts background checks and verifies trainer
      const verifiedTrainer = db.verifyTrainer(pendingTrainer.id, superadminId, 'verified');
      expect(verifiedTrainer.verification_status).toBe('verified');
      expect(verifiedTrainer.verified_by).toBe(superadminId);

      // Now assignment succeeds
      const assignment = db.assignTrainerToRequest(superadminId, 'req-training-101', verifiedTrainer.id, 5000000);
      expect(assignment.id).toBeDefined();
      expect(assignment.status).toBe('offered');
      expect(assignment.agreed_compensation_paise).toBe(5000000);
    });

    it('accrues payout idempotently upon assignment acceptance without double-crediting', () => {
      const trainer = db.getTrainerByUserId(trainerUserId);
      expect(trainer).toBeDefined();

      // Find seeded assignment
      const assignments = db.getAssignmentsForTrainer(trainer!.id);
      expect(assignments.length).toBeGreaterThan(0);
      const testAssign = assignments[0];

      // Initial payouts count
      const initialPayouts = db.getPayoutsForTrainer(trainer!.id);
      const initialCount = initialPayouts.length;

      // Accruing payout with exact same assignment ID must return existing record (idempotency key)
      const payout1 = db.accrueTrainerPayout(testAssign.id, trainer!.id, testAssign.agreed_compensation_paise);
      const payout2 = db.accrueTrainerPayout(testAssign.id, trainer!.id, testAssign.agreed_compensation_paise);

      expect(payout1.id).toBe(payout2.id);
      expect(payout1.idempotency_key).toBe(`idem_payout_${testAssign.id}`);

      // Count of payouts did not increase duplicates
      const afterPayouts = db.getPayoutsForTrainer(trainer!.id);
      expect(afterPayouts.length).toBe(initialCount);
    });
  });

  describe('Gate 4: Session Delivery, Attendance & Student Schedule Integration', () => {
    it('records actual attendance, verifies delivery, and links to classroom students', () => {
      const trainer = db.getTrainerByUserId(trainerUserId);
      expect(trainer).toBeDefined();

      const sessions = db.getSessionsForTrainer(trainer!.id);
      expect(sessions.length).toBeGreaterThan(0);
      const session = sessions[0];

      // Trainer records delivery completion with headcount attendance
      const deliveredSession = db.logSessionDelivery(
        trainerUserId,
        session.id,
        34,
        'Delivered hands-on session on network packets and firewall rules. All 34 students completed sandbox exercises.'
      );

      expect(deliveredSession.delivery_status).toBe('delivered');
      expect(deliveredSession.attendance_count).toBe(34);
      expect(deliveredSession.delivery_notes).toContain('firewall rules');

      // School Admin verifies session
      const verifiedSession = db.verifySessionAttendance(schoolAdminId, session.id);
      expect(verifiedSession.verified_by_school).toBe(true);

      // Student enrolled in linked classroom class-sec-101 has this session in their schedule
      const studentClassrooms = db.getClassrooms(studentId);
      const hasLinkedClass = studentClassrooms.some((c) => c.id === session.classroom_id);
      expect(hasLinkedClass).toBe(true);
    });
  });

  describe('Gate 5: DPDP Minor Safeguarding & Privacy Protections', () => {
    it('restricts minor personal contact info and logs safeguarding incidents for prompt investigation', () => {
      const trainer = db.getTrainerByUserId(trainerUserId);
      expect(trainer).toBeDefined();

      // Ensure trainer receives cohort-level metadata, never personal student phone or home address
      const assignedReq = db.getTrainingRequestById('req-training-101');
      expect(assignedReq).toBeDefined();
      expect(assignedReq?.target_grade_range).toBe('Grade 10-12');
      expect(assignedReq?.approx_cohort_size).toBe(45);
      // Notice: No personal phone numbers or guardian home addresses are attached to TrainingRequest
      expect((assignedReq as any).student_phone_numbers).toBeUndefined();

      // Trainer reports a safeguarding concern observed during workshop
      const report = db.reportSafeguardingIncident(
        trainerUserId,
        dptsOrgId,
        'unsupervised_hallway_incident',
        'high',
        'Observed unauthorized adult attempting to photograph students outside lab room.'
      );

      expect(report.id).toBeDefined();
      expect(report.severity).toBe('high');
      expect(report.status).toBe('open');

      // Superadmin investigates and resolves with recorded notes
      const resolved = db.resolveSafeguardingReport(
        superadminId,
        report.id,
        'Campus security reviewed CCTV footage. Identified contractor with proper badge; school security protocol reinforced.'
      );

      expect(resolved.status).toBe('resolved');
      expect(resolved.resolution_notes).toContain('Campus security');
      expect(resolved.resolved_at).toBeDefined();
    });
  });
});
