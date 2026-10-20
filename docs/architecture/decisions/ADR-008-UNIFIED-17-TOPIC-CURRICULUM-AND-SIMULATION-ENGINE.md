# ADR-008: Unified 17-Topic Canonical Curriculum & Parameterized Simulation Engine

## Context
Geniusphere requires 17 canonical learning topics across Technology, Finance, and Professional Skills, each containing 10 verified video lessons and 10 interactive simulation labs (170 lessons and 170 labs total). Earlier implementations suffered from disconnected components, missing topics, and hardcoded mock stats in the learner workspace.

## Decision
1. Unify all 17 topics into a typed manifest in `src/curriculum/` (`ALL_CANONICAL_17_TOPICS`).
2. Implement a reusable simulation engine `CurriculumLabRunner.tsx` that binds reactive parameter controls (sliders, select dropdowns, toggles) to domain algorithms and renders dynamic, scalable SVG visualizations at 60 FPS.
3. Eliminate all fake learner stats. Learner state starts clean (0 enrollments, 0 completed lessons) and updates only through verified user interaction.

## Status
Accepted and Implemented.
