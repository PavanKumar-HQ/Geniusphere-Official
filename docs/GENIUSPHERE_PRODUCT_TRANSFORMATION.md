# GENIUSPHERE — PRODUCT TRANSFORMATION ARCHITECTURE & DELIVERY AUDIT
**Mobile-First LMS, School Training Marketplace & Safeguarded Minor Learning Product**

*Document Version:* 2.0.0-TRANSFORM  
*Audit Date:* October 25, 2026  
*Status:* Authoritative Implementation & Forensic Audit Log  
*Authors:* Autonomous Principal Product Engineer & Technical Delivery Owner  

---

## 1. Executive Summary & Transformation Directive

Geniusphere is undergoing a full product transformation from an isolated course website into an integrated, mobile-first education business platform combining:
1. **Student Learning Application:** Hands-on practical technology, finance, and security courses with 17 canonical topic labs, interactive coding sandboxes, gamified streak habits, and verified certificates.
2. **School Training Marketplace:** On-demand workshop and training engagement requests, transparent commercial quoting, cohort scheduling, and delivery tracking for educational institutions.
3. **Verified Trainer Onboarding & Matching System:** Competency verification, eligibility checks, assignment offering, acceptance, session delivery, and auditable compensation ledgers.
4. **Institutional Learning Management System (LMS):** Automatic cohort provisioning, classroom enrollment, curriculum assignment, and progress reporting scoped to strict multi-tenant boundaries.
5. **Administrative Operations & Revenue Management:** School and trainer verification queues, commercial quote generation, invoice tracking, payout reconciliation (integer paise calculations), and safeguarding controls.

---

## 2. Phase 1 Audit: Forensic Repository Findings

### 2.1. Existing Roles and Capabilities
| Role | Existing Implementation | Audit Findings & Identified Gaps |
|---|---|---|
| **Learner (`learner`)** | Implemented in `App.tsx`, `StudentDashboard.tsx`, `LessonPlayer.tsx` | Strong foundations for course viewing, lessons, and labs. Needed upcoming school-assigned training session visibility and cohort tracking. |
| **School Admin (`institution_admin`)** | Partial in `InstitutionAdminWorkspace.tsx` | Had member and classroom lists. **Lacked** training request creation, quote review, commercial confirmation, and cohort training session monitoring. |
| **Teacher (`teacher`)** | Implemented in `TeacherGradebook.tsx`, `ClassroomManager.tsx` | Capable of grading assignments and managing classes. Needed session attendance verification for marketplace training. |
| **Trainer (`trainer`)** | **Absent as dedicated persona** | Trainers were not modeled as distinct verified marketplace actors. No assignment acceptance, delivery check-in, or earnings ledger existed. |
| **Platform Admin (`superadmin`)** | Implemented in `PlatformAdminWorkspace.tsx` | Handled health, users, and content. **Lacked** school onboarding review, trainer verification queue, quote generation, and marketplace assignment matching. |
| **Parent/Guardian (`guardian`)** | Implemented in `ParentPortal.tsx` | Supported parental consent links under DPDP compliance. |

### 2.2. Multi-Tenant Isolation & Authorization
- **Database Layer:** Multi-tenant isolation is enforced through `public.organization_memberships` and foreign keys on `organization_id`.
- **Existing Security Policies:** RLS rules restrict queries to the caller's organization.
- **Requirement:** School training requests, quotes, invoices, and cohort data must strictly respect `organization_id` boundaries. A school must never see another school's requests, invoices, or student information.

### 2.3. Financial Tracking & Calculations
- **Existing State:** No financial ledger or payment tracking existed in the repository.
- **Requirement:** All monetary values must be stored in integer minor units (**paise**), with explicit gross fee, platform service fee (take rate), trainer compensation, and taxes (e.g. GST 18%).
- **Rules:** No fake credit card transactions or simulated payment gateways. Ledger records must be immutable, idempotent, and auditable.

### 2.4. Safeguarding & Minor Protection
- **Compliance Baseline:** India's Digital Personal Data Protection (DPDP) Act 2023.
- **Principle:** Minors must never be exposed to direct, unvetted private contact with trainers.
- **Access Rule:** Trainers receive only cohort-level context (e.g. "Grade 9-10, 45 students, Python Foundations, DPS Bangalore Auditorium") and never minor phone numbers, personal emails, or home addresses.
- **Verification Rule:** Trainer profiles must not display verified badges until identity and subject competency checks are explicitly recorded.

### 2.5. Mobile & Android Packaging Audit
- **PWA Configuration:** `public/manifest.json` specifies `display: standalone`, `orientation: portrait-primary`, and `sw.js` cache worker.
- **Viewport Layout:** `platform-main-content` includes `padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px))` and fixed `.mobile-app-bottom-bar` with 44px+ touch targets on $\le 768\text{px}$.
- **Android Native Strategy:** Can be built as an Android TWA (Trusted Web Activity) via Bubblewrap or packaged with Capacitor. Full instructions and build logs will be documented honestly.

---

## 3. Product Architecture & State Machine Specifications

### 3.1. Training Request Lifecycle State Machine
```
[draft] 
   │ (School staff drafts requirements)
   ▼
[submitted]
   │ (Validated server submission, organization boundary checked)
   ▼
[under_review]
   │ (Platform operator reviews cohort, dates, feasibility)
   ▼
[quoted]
   │ (Operator generates pricing: gross paise, trainer fee, tax)
   ▼
[awaiting_school_confirmation]
   │ (School reviews quote, schedule, and assigned trainer)
   ├──────────────────────────┐
   ▼                          ▼
[confirmed]               [cancelled]
   │ (Commercial terms agreed, LMS cohort linked)
   ▼
[in_progress]
   │ (Sessions actively conducted and attendance logged)
   ▼
[completed]
   │ (All sessions delivered, feedback recorded, payout approved)
```

### 3.2. Trainer Assignment State Machine
```
[proposed] ──> [offered] ──> [accepted] ──> [confirmed] ──> [completed]
                   │              │
                   ▼              ▼
               [declined]     [cancelled]
```

### 3.3. Trainer Compensation & Financial Ledger States
- **Training Invoice:** `draft` $\rightarrow$ `issued` $\rightarrow$ `paid` $\rightarrow$ `overdue` / `refunded`
- **Trainer Payout:** `accrued` $\rightarrow$ `approved` $\rightarrow$ `processing` $\rightarrow$ `settled`
- **Unit of Account:** 1 INR = 100 paise. All computations use integer arithmetic without floating-point rounding errors.

---

## 4. Implementation Log & Evidence

*(Updated in real-time as stages are implemented and verified.)*
