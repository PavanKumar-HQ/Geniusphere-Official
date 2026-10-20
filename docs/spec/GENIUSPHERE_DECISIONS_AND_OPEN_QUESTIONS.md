# GENIUSPHERE — DECISIONS, RESOLVED RISKS & OPEN QUESTIONS

**Date:** 2026-10-20  
**Status:** Architecture Discovery Complete  

---

## 1. Key Architectural Decisions Made

1. **Elimination of Fake Mock Seed Data:**
   - *Decision:* Remove hardcoded mock statistics ("Aarav Patel", 8 enrolled courses, 12 completed lessons) from initial learner state. Fresh accounts initialize cleanly at 0 and build progress authentically.
   - *Evidence:* Direct user feedback: *"see there is lot of mockup"*.
2. **Authoritative 17-Topic Canonical Curriculum (170 Lessons, 170 Labs):**
   - *Decision:* Unify all 17 topics into a typed manifest in `src/curriculum/`, pairing each topic with exactly 10 verified video lessons and 10 interactive simulation labs.
   - *Evidence:* `npx tsx` audit confirming 17/170/170 structure with zero unverified synthetic placeholders.
3. **Reusable SVG Simulation Engine (`CurriculumLabRunner.tsx`):**
   - *Decision:* Build a high-performance interactive simulation studio executing parameter-driven algorithms directly in the browser and rendering reactive SVG visualizations at 60 FPS.
   - *Evidence:* Eliminates server compute overhead, supports offline school usage, and maintains mathematical rigor across all domains.
4. **Fastify 5 + PostgreSQL Modular Backend:**
   - *Decision:* Retain the Fastify 5 REST API and PostgreSQL 19-table relational schema with Row Level Security, transactional outbox, and WebSocket gateway.
   - *Evidence:* 15 passing Vitest suites verifying multi-user isolation, cryptographic JWT auth, and WebSocket event distribution.

---

## 2. Open Questions for Future Scaling

1. **School Domain Whitelisting vs. Open Registration:**
   - *Current Design:* Supports open student registration and teacher-generated classroom join codes (Crockford Base32).
   - *Question for Stakeholder:* Should production deployments restrict self-registration to verified school email domains (`.edu`, `.ac.in`, `.k12`)?
2. **Video Embed Fallback Mode for Strict School Firewalls:**
   - *Current Design:* Uses privacy-enhanced `youtube-nocookie.com` iframes.
   - *Question for Stakeholder:* If schools block YouTube at the network firewall level, should Geniusphere support self-hosted WebM/MP4 video storage on AWS S3 / Cloudflare R2?
3. **Teacher Grading Workflow:**
   - *Current Design:* Automated simulation lab evaluation with instant completion criteria verification. Teacher dashboard allows overriding or reviewing lab submissions.
