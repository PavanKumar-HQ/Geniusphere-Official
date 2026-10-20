# GENIUSPHERE — CONTROLLED FRONTEND REBUILD AUDIT & DECISION

**Document ID:** `REBUILD-AUDIT-2026-F1`  
**Date:** October 17, 2026  
**Status:** Approved & Adopted  
**Scope:** Frontend Architecture, Design System, Lab Engine Consolidation, and Codebase Modernization  

---

## 1. Executive Summary

Geniusphere has a fully working, secure, and compliant backend foundation: an in-memory transactional database (`InMemoryDatabase`), PostgreSQL 16 migrations with Row-Level Security, multi-tenant RBAC workspaces (Learner, Teacher, Institution Admin, Platform Admin, Parent), 27 curriculum courses, 12 approved lab engines, and 60 passing Vitest tests.

However, the user-facing frontend suffered from:
1. **Component Duplication:** Three competing lab implementations existed simultaneously (`SharedLabWorkspace.tsx` [80 KB], `SimulationLabModal.tsx` [75 KB], and `WorkableSandboxLab.tsx` [41 KB]), resulting in duplicate buttons, conflicting visual themes, and confusing navigation.
2. **Simulated / Fake Execution:** Legacy components (such as `InteractiveSandbox.tsx`) used naive string length checks (`if (trimmed.length > 10) isSuccess = true`) masquerading as real code compilation.
3. **Design System Disconnect:** While the brand identity specifies a light, clean, human-first aesthetic (Mikado Black, Causten Round, IBM Plex Mono, `#FBF9F5` warm canvas, `#30B2E7` Qurious Sky, `#FDB913` Joy of Quest, `#75B543` Always Questioning), certain prototype modals retained a dark/neon cyan cyber-hacker aesthetic.
4. **Excessive & Redundant Copy:** Pages contained verbose descriptive blocks, duplicate section headings, and promotional placeholders.

This document establishes the inventory, architecture decision, and phased execution plan for a controlled rebuild of the frontend.

---

## 2. Inventory of the Current Codebase

### 2.1 Working Functionality Worth Preserving (P0 - Non-Negotiable)
* **Authoritative In-Memory Database (`src/db/in-memory-db.ts`):** 
  - Complete relational schemas for users, courses, modules, lessons, quizzes, lab definitions, lab attempts, submissions, classrooms, certificates, and audit events.
  - Deterministic SHA-256 certificate hashes, RLS row evaluation, and XP progression.
* **Production Database Migrations & Schemas (`supabase/migrations/`):**
  - Migration 001: Core multi-tenancy schemas and RBAC roles.
  - Migration 002: Comprehensive Row-Level Security policies.
* **Unified Canonical Lab Workspace (`src/components/SharedLabWorkspace.tsx`):**
  - 3-panel responsive layout (Instructions & Checklist, Interactive Engine Canvas, Results & Audit Telemetry).
  - 12 real educational simulation engines (T1–T6, F1–F3, C1–C3) with real state machines, mathematical models, parameter inputs, and database persistence.
* **Accessible SVG Visualizers (`src/components/LabSvgVisualizers.tsx`):**
  - 8 state-driven SVG diagrams (Neural network activations, blockchain cryptographic chain, IoT sensor dial & spinning fan, privacy radar, security sanitization pipeline, market volatility bands, compound growth curves, ACH payment rail token).
* **Code Editor Integration (`src/components/CodeEditor.tsx`):**
  - Lightweight CodeMirror 6 with SQL language extensions and theme integration.
* **Role-Enforced Workspaces:**
  - `StudentDashboard.tsx`, `TeacherGradebook.tsx`, `ClassroomManager.tsx`, `InstitutionAdminWorkspace.tsx`, `PlatformAdminWorkspace.tsx`, `ParentPortal.tsx`, `AuditLogViewer.tsx`.
* **Automated Test Suite:**
  - 60 passing tests in Vitest executing in <350ms across 7 test suites (`sanity`, `curriculum-workflow`, `e2e-workflow`, `labs-workflow`, `migrations`, `resources-workflow`, `rls-authorization`).

### 2.2 Broken, Misleading, or Duplicated Functionality (To Be Eliminated / Replaced)
* **`SimulationLabModal.tsx` (75,709 bytes):**
  - **Issue:** Duplicate modal created during early cyber-threat prototyping. Uses dark/neon styling that violates the brand guideline. Disconnected from database lab records and progress tracking.
  - **Action:** Delete and route all course/lesson lab triggers directly to `SharedLabWorkspace.tsx`.
* **`WorkableSandboxLab.tsx` (41,303 bytes):**
  - **Issue:** Duplicate sandbox logic embedded inside `SimulationLabModal`. Re-implements SHA-256 and IoT sliders without database persistence.
  - **Action:** Delete. All functional capabilities are natively provided in `SharedLabWorkspace.tsx`.
* **`InteractiveSandbox.tsx` (7,282 bytes):**
  - **Issue:** Contains fake simulated execution (`if (trimmed.length > 10) isSuccess = true`).
  - **Action:** Replace with genuine CodeMirror 6 runner or integrate into canonical lab lifecycle.
* **`CourseDetailView.tsx` & `CourseCatalogue.tsx` Duplicate Buttons:**
  - **Issue:** Contained dual buttons ("SVG Visualizer Lab" opening modal vs "Launch Interactive Lab" navigating to workspace).
  - **Action:** Unify into a single, prominent "Launch Interactive Lab" action that routes to the canonical workspace.
* **`FunZoneSection.tsx` Visual Clutter:**
  - **Issue:** Contained emojis, dense auto-scroll cards, and excessive text competing with core curriculum.
  - **Action:** Streamline into concise, brand-aligned challenge cards with clean typography and zero emojis.

---

## 3. Architecture Decision: Refactor vs Replace

### 3.1 Candidate Frameworks Re-Evaluation
* **SvelteKit 2:** Evaluated in ADR-14. Discarding 100,000+ lines of working React 19 code, 12 simulation engines, CodeMirror 6 bindings, and 60 passing tests would delay the project by 6–8 weeks with zero pedagogical benefit.
* **Astro 5:** Wrapping dynamic, stateful simulation engines and authenticated workspaces in `client:only="react"` reproduces an SPA inside Astro with added operational tax.
* **React 19 + Vite 6 (Current):** Delivers sub-second production builds (1.09s), 198 KB gzipped bundle, seamless WebAssembly (`sql.js`) and CodeMirror 6 support, and zero server runtime cost on Cloudflare Pages.

### 3.2 Formal Decision: Controlled In-Place Rebuild & Consolidation
**Decision:** **Refactor and consolidate the existing React 19 + Vite 6 frontend.**  
Do not migrate frameworks. Do not touch backend database models or migrations.  
Rebuild the user experience by:
1. Creating a cohesive shared UI component system (`src/components/ui/`).
2. Consolidating all lab execution into `SharedLabWorkspace.tsx`.
3. Eliminating duplicate, obsolete components (`SimulationLabModal.tsx`, `WorkableSandboxLab.tsx`, `InteractiveSandbox.tsx`).
4. Enforcing concise, purpose-driven copy across all views.
5. Standardizing on the 2026 Light Design System.

---

## 4. Component Refactoring & Implementation Plan

| Phase | Target Components | Action / Goal |
|---|---|---|
| **Phase 1: UI Foundation** | `src/components/ui/` (`Button`, `Card`, `Badge`, `Modal`, `Input`, `FeedbackAlert`, `LoadingState`, `EmptyState`) | Create accessible, reusable, brand-tokenized primitives. |
| **Phase 2: Labs Consolidation** | `CourseDetailView`, `CourseCatalogue`, `LessonPlayer`, `App.tsx` | Wire all lab launchers to `SharedLabWorkspace.tsx`. Remove `SimulationLabModal`, `WorkableSandboxLab`, and `InteractiveSandbox`. |
| **Phase 3: Editorial & Copy Pruning** | `Homepage.tsx`, `FunZoneSection.tsx`, `AboutPage.tsx` | Eliminate excessive copy, remove emoji icons, ensure clear purpose per section. |
| **Phase 4: Cohesive Navigation** | `App.tsx` header and mobile drawer | Unify navigation with clean brand logo, responsive breakpoints, and role personas. |
| **Phase 5: Verification & Testing** | Vitest suite, TypeScript compilation, Vite production build | Verify 60/60 tests pass, 0 type errors, sub-second build. |
