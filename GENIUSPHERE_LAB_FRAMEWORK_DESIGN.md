# GENIUSPHERE — REUSABLE LAB FRAMEWORK DESIGN SPECIFICATION

**Date:** 2026-10-20  
**Scope:** Architecture of 170 Interactive SVG Simulation Labs across 17 Canonical Topics  

---

## 1. Simulation Engine Architecture

Rather than building 170 disconnected, hardcoded components, Geniusphere uses a **deterministic parameter-driven simulation engine** (`src/components/CurriculumLabRunner.tsx`).

```
                    +--------------------------------+
                    |    SimulationLab Definition    |
                    | (Formula, InitialState, Spec)  |
                    +---------------+----------------+
                                    |
                                    v
+-----------------------+   +------------------------+   +----------------------+
| Reactive Controls     |-->| Realtime Math Engine   |-->| Dynamic SVG Renderer |
| (Sliders, Selects)    |   | (Algorithm Evaluation) |   | (Declarative Visual) |
+-----------------------+   +-----------+------------+   +----------------------+
                                        |
                                        v
                            +------------------------+
                            | Validation & Mastery   |
                            | (Completion Criteria)  |
                            +------------------------+
```

---

## 2. Dynamic SVG Visualization Categories

All 170 labs map into 8 core visualization topologies:

1. **Coordinate Plane & Decision Hyperplane (AI & Machine Learning):**
   - Visualizes classification vectors, separating lines ($w_1 x_1 + w_2 x_2 + b = 0$), and colored data point clusters.
2. **Cryptographic Block Chain & Node Mesh (Blockchain & Cybersecurity):**
   - Visualizes linked block nodes with hash values, previous hash pointers, tamper indicators, and nonce miners.
3. **Exponential & Compounding Financial Curves (Finance, Stock Market, Economy):**
   - Visualizes dual-growth curves: nominal balance vs. real inflation-adjusted purchasing power, portfolio asset allocations, and amortization curves.
4. **Interactive Hardware Dials & Sensor Gauges (IoT & Robotics):**
   - Visualizes rotary dials, threshold cutoffs, sensor readings (temperature, humidity), and rule-triggered actuator relays.
5. **Flowcharts & State Transition Diagrams (Coding Basics & Algorithms):**
   - Visualizes variable registries, memory pointers, execution call stacks, and branch decision paths.
6. **Task Matrix & Time Quadrants (Time Management & Productivity):**
   - Visualizes Eisenhower matrix quadrants, schedule conflicts, and deep work blocks.
7. **Business Canvas & Funnel Sizers (Startup Ideation & FinTech):**
   - Visualizes unit economics payback horizons, TAM/SAM/SOM market tiers, and conversion funnels.
8. **Digital Radar & Reputation Polygons (Communication & Social Profile):**
   - Visualizes multi-axis competency radars, ATS keyword match gauges, and network tie topologies.

---

## 3. Mathematical Integrity & Automated Testing

Every simulation calculation is a pure function that can be tested in isolation without rendering a browser DOM.

### Example: LTV/CAC Unit Economics Test (Topic 16, Lab 3)
```typescript
function calculateUnitEconomics(arpu: number, grossMarginPct: number, churnPct: number, cac: number) {
  const ltv = (arpu * (grossMarginPct / 100)) / (churnPct / 100);
  const ratio = ltv / cac;
  const paybackMonths = cac / (arpu * (grossMarginPct / 100));
  return { ltv, ratio, paybackMonths, isSustainable: ratio >= 3.0 && paybackMonths <= 12 };
}

// Verified by automated unit test:
const result = calculateUnitEconomics(50, 80, 3, 350);
expect(result.ltv).toBeCloseTo(1333.33, 2);
expect(result.ratio).toBeCloseTo(3.81, 2);
expect(result.paybackMonths).toBeCloseTo(8.75, 2);
expect(result.isSustainable).toBe(true);
```
