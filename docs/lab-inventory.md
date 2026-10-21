# Geniusphere Canonical Lab Inventory & Architecture Registry

> **Operating Standard**: Complete Topic-to-Lesson-to-Lab Traceability, Mathematical Models, and Component Manifest  
> **Repository Baseline**: `main` | 17 Canonical Simulation Topics • 170 Interactive Labs • Standalone Laboratory Suites  
> **Last Updated**: 2026-10-21  

---

## 1. Canonical Curriculum Reconciliation

Geniusphere structures its practical STEM & Financial curriculum through two coordinated registries:
1. **17-Topic Interactive Simulation Curriculum** (`src/curriculum/`):
   - 6 Technology Topics (60 Lessons, 60 Interactive Labs)
   - 6 Finance Topics (60 Lessons, 60 Interactive Labs)
   - 5 Professional Skills Topics (50 Lessons, 50 Interactive Labs)
   - **Total**: Exactly 17 Topics, 170 Video Lessons, and 170 Algorithmic SVG Simulation Labs.
2. **18-Course Video Track Registry** (`src/data/canonical-curriculum.ts`):
   - 18 Course Tracks (180 video modules).
   - The 18th course is `"digital-footprint-privacy"` (*"Digital Footprint & Online Privacy"*), whose practical requirements link directly to the interactive cybersecurity simulation lab (`"digital-privacy-decision-lab"`).
3. **Automated Inventory Integrity**:
   - Enforced by `tests/canonical-topic-inventory-integrity.test.ts` (3/3 passing tests).

---

## 2. Topic-to-Lab Mapping (17 Topics / 170 Labs)

### Technology Stream (Topics 1 to 6 • 60 Labs)

| Topic ID & Title | Canonical Index | Lab Count | Dedicated Standalone Lab Component | Primary Practical Focus |
|---|---|---|---|---|
| **Topic 1**: Artificial Intelligence (AI) | 1 | 10 | `src/labs/ai-lab/AILabFull.tsx` | Neural perceptrons, weights, backpropagation, decision boundaries, NLP embeddings |
| **Topic 2**: Blockchain Technology | 2 | 10 | `src/labs/blockchain-lab/App.tsx` | Merkle tree validation, proof-of-work difficulty, nonce hashing, wallet signing |
| **Topic 3**: Microsoft Office & Productivity | 3 | 10 | `src/labs/office-lab/App.tsx` | Spreadsheet cell formulas, pivot table aggregation, document formatting, presentation slides |
| **Topic 4**: Cybersecurity Basics | 4 | 10 | `src/labs/cyber-lab/CyberLab.tsx` | Phishing detection, SQL parameter binding, firewall ACL rules, cryptographic hashing |
| **Topic 5**: Coding Basics & Algorithms | 5 | 10 | `src/components/LessonCodingSandbox.tsx` | Binary search, recursion, state machines, algorithmic complexity $O(n \log n)$ |
| **Topic 6**: Internet of Things (IoT) | 6 | 10 | `src/labs/iot-lab/App.tsx` | Sensor telemetry thresholds, MQTT broker topics, circuit voltage division, firmware security |

### Finance Stream (Topics 7 to 12 • 60 Labs)

| Topic ID & Title | Canonical Index | Lab Count | Dedicated Standalone Lab Component | Primary Practical Focus |
|---|---|---|---|---|
| **Topic 7**: Personal Finance & Budgeting | 7 | 10 | `src/labs/intro-finance-lab/App.tsx` | 50/30/20 budget allocations, emergency fund runway, debt snowball vs avalanche |
| **Topic 8**: Banking Account Types & Operations | 8 | 10 | `src/labs/banking-lab/App.tsx` | Checking liquidity vs savings APY, compound interest formulas, wire settlement ledger |
| **Topic 9**: Credit & Debt Management | 9 | 10 | `src/labs/banking-lab/App.tsx` | Credit utilization ratios, interest rate amortization, debt-to-income (DTI) ceilings |
| **Topic 10**: Stock Market Fundamentals | 10 | 10 | `src/labs/stock-market-lab/App.tsx` | Order book bids/asks, P/E ratio valuation, portfolio beta, dollar-cost averaging |
| **Topic 11**: Real Estate Investment | 11 | 10 | `src/labs/real-estate-lab/App.tsx` | Capitalization rate (Cap Rate), cash-on-cash yield, mortgage amortization, NOI |
| **Topic 12**: Cryptocurrency & Digital Assets | 12 | 10 | `src/labs/crypto-lab/App.tsx` | Public/private key pairs, automated market maker (AMM) constant product $x \cdot y = k$, gas fees |

### Professional Skills Stream (Topics 13 to 17 • 50 Labs)

| Topic ID & Title | Canonical Index | Lab Count | Dedicated Standalone Lab Component | Primary Practical Focus |
|---|---|---|---|---|
| **Topic 13**: Digital Communication & Email | 13 | 10 | `src/labs/professional-skills-lab/App.tsx` | Professional tone analysis, subject line clarity, executive summaries |
| **Topic 14**: Resume & Profile Building | 14 | 10 | `src/labs/professional-skills-lab/App.tsx` | ATS keyword optimization, STAR interview method, metric-driven bullet points |
| **Topic 15**: Public Speaking & Presentations | 15 | 10 | `src/labs/professional-skills-lab/App.tsx` | Slide cognitive load, speech pacing (words/min), Q&A defense framing |
| **Topic 16**: Project Management Fundamentals | 16 | 10 | `src/labs/professional-skills-lab/App.tsx` | Critical Path Method (CPM), Gantt chart dependencies, risk matrix scoring |
| **Topic 17**: Workplace Ethics & Teamwork | 17 | 10 | `src/labs/professional-skills-lab/App.tsx` | Conflict resolution frameworks, confidentiality ethics, DEI equity matrix |

---

## 3. End-to-End Lab Execution Mapping

For each lab interaction, the platform maintains deterministic execution:

`Topic Selection -> Lesson Navigation -> Lab Tab/View -> Simulation Logic Execution -> Validation Criteria Check -> apiClient.recordLabAttempt -> PostgreSQL Persistence -> xp_ledger Atomic Insert -> WebSocket Broadcast -> UI Update & Certificate Unlocking`
