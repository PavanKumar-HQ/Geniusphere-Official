# GENIUSPHERE — ISSUE REGISTER
**File Path:** `REPORTS/ISSUE_REGISTER.md`  
**Execution Date:** 2026-10-18  
**Auditor:** Principal Software Architect & QA Engineering  
**Standard:** ISO/IEC 25010 Software Quality & OWASP Top 10 Security

---

## Issue Summary Matrix

| Issue ID | Severity | Category | Status | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **ISSUE-001** | **CRITICAL** | Data Durability | Open | In-memory persistence and partial localStorage synchronization risks student data loss. |
| **ISSUE-002** | **HIGH** | Product & Curriculum | Open | 27 legacy courses mismatch the 40-course structure mandated by Master Design Boards. |
| **ISSUE-003** | **HIGH** | Security & Auth | Open | Client-side persona switching lacks authoritative server-side session token enforcement. |
| **ISSUE-004** | **HIGH** | Deployment & Ops | Open | Production domain `geniusphere.tech` serves legacy dark Tailwind prototype instead of modern build. |
| **ISSUE-005** | **MEDIUM** | Credentials & Integrity | Open | Certificate issuance modal must enforce strict prerequisite completion verification. |
| **ISSUE-006** | **MEDIUM** | UX & Identity | Open | Official "Sphere" mascot SVGs missing from interactive onboarding, hint, and error states. |
| **ISSUE-007** | **MEDIUM** | Accessibility | Open | System requires explicit `prefers-reduced-motion` overrides across interactive animation components. |

---

## Detailed Issue Records

### ISSUE-001: In-Memory Storage & Data Loss Risk
- **Severity:** CRITICAL
- **Evidence:** `src/db/in-memory-db.ts` (lines 50–70) initializes Maps for all entities. `persistState()` only serializes a subset (`submissions`, `assignments`, `classrooms`, `enrollments`, `labAttempts`) to `window.localStorage`. If cache is cleared or a learner switches school lab PCs, enrollments and progress are lost.
- **Affected Files:** `src/db/in-memory-db.ts`, `src/App.tsx`, `src/components/StudentDashboard.tsx`.
- **Root Cause:** Client-side prototype architecture without an authoritative persistent database tier.
- **Proposed Fix:** Implement a persistent browser storage engine (IndexedDB via Dexie or standard IndexedDB API) coupled with the existing PostgreSQL migration schema. Provide an automated migration and 1-click sovereign JSON export/import bridge.
- **Regression Risk:** Low if repository interfaces (`getCourses`, `getSubmissions`, `recordSubmission`) remain identical.
- **Verification Method:** Create a submission, reload browser in incognito, verify data survives reload via automated integration test.

---

### ISSUE-002: Curriculum Stream & 40-Course Catalogue Mismatch
- **Severity:** HIGH
- **Evidence:** `src/data/curriculum.ts` defines 27 courses across 4 domains (`technology`, `coding`, `finance`, `professional`), whereas Master Design Boards (`media_1792296386206.jpg` and `media_1792296532547.jpg`) explicitly establish **40 courses** across **3 Schools of Learning**:
  - Technology & Digital Skills: 12 courses
  - Financial Literacy & the Economy: 14 courses
  - Professional & Life Skills: 14 courses
- **Affected Files:** `src/data/curriculum.ts`, `src/components/CourseCatalogue.tsx`, `src/types/index.ts`.
- **Root Cause:** Evolutionary divergence between early technical prototype seed data and final brand design system boards.
- **Proposed Fix:** Re-seed `curriculum.ts` with all 40 courses, complete with module breakdowns, duration, difficulty, learning outcomes, and practical task rubrics. Update `CourseCatalogue.tsx` to display the exact 3-stream cards shown in the design reference.
- **Regression Risk:** Existing lesson references in tests must be updated to valid 40-course IDs.
- **Verification Method:** `npm test` passes `tests/curriculum-workflow.test.ts` with 40 validated courses.

---

### ISSUE-003: Client-Side Persona Switching Lacks Authoritative Session Boundary
- **Severity:** HIGH
- **Evidence:** `src/App.tsx` allows switching between `user-student-1`, `user-teacher-1`, and `user-admin-1` by updating React state. Authorization checks in `src/db/in-memory-db.ts` inspect the client-provided `currentUser.id`.
- **Affected Files:** `src/App.tsx`, `src/components/AuthModal.tsx`, `src/db/in-memory-db.ts`.
- **Root Cause:** Rapid prototyping artifact.
- **Proposed Fix:** Structure a genuine session-based auth bridge with persistent session tokens, login credentials validation, email registration, and multi-tenant school access boundaries that reject unauthorized cross-school requests.
- **Regression Risk:** Medium; test suites simulate auth through `db` calls and must remain supported.
- **Verification Method:** Unit tests verifying an unauthenticated or student token cannot query teacher gradebook or admin audit logs.

---

### ISSUE-004: Production Domain (`geniusphere.tech`) Serves Legacy Prototype
- **Severity:** HIGH
- **Evidence:** `curl -s https://www.geniusphere.tech/` returns an old HTML page with dark mode, electric blue `#0047FF`, and neon glowing animations, directly contradicting the approved Botanical Light theme.
- **Affected Files:** External deployment target / DNS / GitHub Pages or Vercel hosting config.
- **Root Cause:** The live domain is pointing to an old build/repository instead of the updated `Geniusphere-Official` repository.
- **Proposed Fix:** Document production deployment cutover steps in `REPORTS/ARCHITECTURE_DECISIONS.md` and `READY.md` so the user can authorize updating DNS/hosting to point to this production build.
- **Regression Risk:** Zero risk to local codebase; critical for public brand consistency.
- **Verification Method:** `curl -I https://www.geniusphere.tech/` serves the new production bundle.

---

### ISSUE-005: Certificate Issuance Lacks Explicit Prerequisite Rule Gate
- **Severity:** MEDIUM
- **Evidence:** `src/components/CertificateModal.tsx` renders a certificate if passed an object, but `LessonPlayer.tsx` did not strictly check that all 10 modules were marked complete before generating the certificate record.
- **Affected Files:** `src/components/LessonPlayer.tsx`, `src/components/CertificateModal.tsx`, `src/db/in-memory-db.ts`.
- **Root Cause:** Missing guard condition in the course player completion handler.
- **Proposed Fix:** Enforce a strict invariant: `completedModulesCount === totalModulesCount` before issuing a certificate. Store the certificate record with sha256 hash in the database.
- **Regression Risk:** Low.
- **Verification Method:** Attempt certificate generation with 5/10 modules complete (must fail); complete 10/10 modules (must succeed and generate verifiable hash).

---

### ISSUE-006: Official "Sphere" Mascot SVGs Missing from Interface Touchpoints
- **Severity:** MEDIUM
- **Evidence:** The Master Design System Board (`media_1792296386206.jpg`) defines the "Sphere" mascot in 6 distinct emotional poses (Happy, Thinking, Celebrating, Encouraging, Guidance, Loading). Currently, the codebase has no vector SVG components for these states.
- **Affected Files:** `src/components/`, new component `src/components/MascotSphere.tsx`.
- **Root Cause:** Visual assets remained in external Figma/mockup images.
- **Proposed Fix:** Implement a clean, responsive, accessible SVG component `MascotSphere.tsx` supporting the 6 canonical states, and integrate into dashboard greeting, quiz hints, empty states, error guidance, and completion modals.
- **Regression Risk:** Zero logic risk; improves UX warmth and brand alignment.
- **Verification Method:** Visual inspection in browser; all 6 states render crisp vectors at small and large scales.

---

### ISSUE-007: Reduced Motion Accessibility Guardrails
- **Severity:** MEDIUM
- **Evidence:** Some CSS animations (e.g., pulse dots, transitions) do not include `@media (prefers-reduced-motion: reduce)` overrides.
- **Affected Files:** `src/index.css`.
- **Root Cause:** Standard CSS animations defined without accessibility media query fallbacks.
- **Proposed Fix:** Add comprehensive `@media (prefers-reduced-motion: reduce)` block in `src/index.css` to disable transforms, scale changes, and infinite loops when user prefers reduced motion.
- **Regression Risk:** Zero.
- **Verification Method:** Emulate `prefers-reduced-motion: reduce` in browser DevTools and verify animations gracefully disable.

---
*Issue Register documented and prioritized by severity.*
