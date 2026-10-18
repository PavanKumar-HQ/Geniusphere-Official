# GENIUSPHERE — ACCEPTANCE CRITERIA REGISTER
**File Path:** `REPORTS/ACCEPTANCE_CRITERIA.md`  
**Execution Date:** 2026-10-18  
**Author:** Principal Software Architect & QA Engineering  
**Standard:** Behavior-Driven Development (BDD) & End-to-End Verification

---

## 1. Core Learning Workflows

### AC-001: Course Discovery & Enrolment
1. **Public Discovery:** Any visitor or unauthenticated user can browse the 40-course catalogue, inspect course summaries, learning outcomes, and module lists.
2. **Eligibility Validation:** The system validates course publication status before enrolling.
3. **Idempotent Enrolment:** Duplicate enrolment requests for an already-enrolled course are detected and gracefully handled without duplicate database records.
4. **Data Persistence:** Successful enrolment persists across browser reloads, private windows, and device restarts.
5. **Dashboard Reflection:** Enrolled courses immediately appear on the student dashboard with progress initialized to 0%.
6. **Privacy Boundary:** One user's enrolment records are strictly inaccessible to other unlinked users.
7. **Offline Durability:** Enrolment state is stored in the local-first persistent engine if connectivity is intermittent.
8. **Automated Verification:** Verified by unit and integration tests in `tests/curriculum-workflow.test.ts`.

---

### AC-002: Lesson Progression & Quiz Completion
1. **Module Sequence:** Modules are presented in ordered sequence with clear learning objectives.
2. **Interactive Exercises:** Quizzes validate answers on submission and provide immediate, pedagogical feedback explaining why options are correct or incorrect.
3. **Progress Calculation:** Course completion percentage is mathematically derived: `(completedModules / totalModules) * 100`. No hardcoded percentages.
4. **Resumption:** Returning to a course restores the learner to their last uncompleted module.
5. **Real Milestones:** 100% completion unlocks certificate generation; partial completion prevents certificate generation.

---

### AC-003: Practical Lab Execution & Submissions
1. **Deterministic Execution:** Labs (e.g. UPI Scam Analysis, SQL Sandbox, Diagram Studio) execute locally or via sandboxed evaluation with zero untrusted remote code execution.
2. **Evidence Attachment:** Submissions store student outputs (code, diagram DSL, reflection text, or quiz answers).
3. **Submission Timestamps:** Submissions record ISO 8601 timestamps and student identity.
4. **State Transition:** Assignment status updates from `Pending` to `Submitted`, visible to both student and assigned teacher.

---

## 2. Institutional & Teacher Review Workflows

### AC-004: Classroom Management & Enrollment Codes
1. **Classroom Provisioning:** Verified teachers and school admins can create classrooms bound to their `organization_id`.
2. **Secure Join Codes:** Join codes are generated with expiration dates; expired or invalid codes return clear, accessible error messages.
3. **Multi-Tenant Boundary:** A student enrolling with School A's code is bound to School A; they cannot be added to School B without a valid School B code.
4. **Roster Visibility:** Teachers can view all students enrolled in their assigned classrooms.

---

### AC-005: Qualitative Grading & Feedback
1. **Submission Review:** Teachers can inspect student submitted work alongside rubrics.
2. **Grade & Qualitative Feedback Input:** Teachers can submit numerical scores (0 to max_score) and written feedback.
3. **Feedback Delivery:** Published feedback is immediately visible on the student's dashboard and assignment detail view.
4. **Audit Trail:** Every grade change generates a cryptographically hashed audit event in `audit_events`.

---

### AC-006: Institutional CSV/XLSX Bulk Import
1. **Schema Validation:** File imports validate required headers (`full_name`, `email`, `date_of_birth`, `grade_level`).
2. **Row-Level Error Reporting:** Malformed emails or missing required fields are flagged with specific line numbers without aborting valid rows.
3. **Duplicate Prevention:** Existing emails within the organization are identified and skipped or updated according to user confirmation.
4. **Tenant Enclosure:** Imported students are strictly enrolled into the target school's organization; cross-tenant injection is rejected.

---

## 3. Security, Privacy & Compliance Workflows

### AC-007: DPDP Act 2023 Minor Protection & Guardian Verification
1. **Minor Detection:** Accounts with DOB indicating age < 18 are flagged as `is_minor: true`.
2. **Guardian Consent:** Minor accounts require a parent/guardian email link; public community features and unmoderated sharing remain disabled until status is `verified`.
3. **Quiet Hours:** Automated notifications are suppressed between 8:00 PM and 8:00 AM IST.
4. **Zero Ad Tracking:** No external behavioral trackers, marketing pixels, or third-party advertising scripts are loaded.

---

### AC-008: Verifiable Certificate Integrity
1. **Issuance Gate:** Certificates can only be generated when all course completion criteria are 100% satisfied.
2. **Cryptographic Hash:** Every certificate generates an immutable SHA-256 verification hash: `SHA256(student_id + course_id + issue_date + salt)`.
3. **Verification Dialog:** Entering the certificate ID or verification hash confirms authenticity against database records; fake or tampered hashes return "Invalid Certificate".
4. **Printability:** The certificate modal renders cleanly in standard A4 landscape for printing or saving to PDF.

---

## 4. Accessibility & UI Quality

### AC-009: Visual Hierarchy & Design Tokens
1. **Palette Compliance:** Uses Warm Ivory (`#FAFAF4`), Soft Sage (`#E5F0DF`), Fresh Green (`#43A85B`), Lime (`#D9F477`), and Charcoal (`#26352A`).
2. **WCAG Contrast:** All text achieves minimum 4.5:1 contrast; buttons achieve WCAG AA; Lime badges achieve WCAG AAA with Charcoal text.
3. **Responsive Breakpoints:** Layouts adapt seamlessly from 390px mobile view to 1440px desktop screens.
4. **Reduced Motion:** When `prefers-reduced-motion` is detected, animations and transitions are disabled or minimized to instant opacity changes.

---
*Acceptance Criteria registered and active as baseline for Phase C through G.*
