# GENIUSPHERE — INTERACTIVE LABS SIMULATION AUDIT & OVERHAUL PLAN

**Audit Date:** 2026-10-22  
**Auditor:** Autonomous Systems & Simulation Engineering Lead  
**Scope:** Complete inventory of all 15 registered standalone labs in `src/labs/registry.tsx`  
**Constitution Authority:** `docs/PRODUCT_CONSTITUTION.md` (Sections 1, 4, 5)  

---

## 1. Executive Summary & Inventory Status

Geniusphere features 15 registered standalone lab environments spanning Technology, Finance, and Professional Development. 

The audit reveals a stark divergence in technical maturity across the inventory:
- **State-of-the-art Mathematical Simulators (e.g. `ai-lab`):** Contains genuine educational mathematics (tokenization, 2D vector projections, scaled dot-product attention, forward pass with activation functions, softmax temperature sampling, prompt shield pattern matching).
- **Recent Hologram 3D Engineering (e.g. `iot-lab` Hologram mode):** Incorporates real isometric 3D layer exploded views, electrical power budget equations ($I_{\text{active}}$, $I_{\text{sleep}}$, duty cycles, battery longevity), and verified telemetry.
- **Outdated Slideshow / Decorative Demonstrations (e.g. `blockchain-lab`, `stock-market-lab`, `cybersecurity-lab` SimulatePage, `crypto-lab`, `office-lab`):** Primarily timer-driven animations (`setInterval` advancing `step`), displaying pre-baked SVG charts or static log strings without allowing students to manipulate parameters, observe mathematical cause-and-effect, test edge cases, or solve verifiable engineering challenges.

---

## 2. Rigorous Audit of All 15 Registered Labs

Each lab was evaluated against the 8 mandatory engineering criteria:
1. **User Interaction:** Live controls available to student.
2. **State Modification:** Do inputs actually mutate simulation state or merely toggle UI frames?
3. **Output Calculation:** Are displayed values calculated by genuine equations or hardcoded/mocked?
4. **Cause and Effect:** Can the student observe immediate, predictable changes resulting from actions?
5. **Experiments & Challenges:** Are there measurable problem-solving challenges with clear completion conditions?
6. **Visual & Diagram Quality:** Are diagrams informative and truthful, or decorative with superficial animations?
7. **Cross-Platform Support:** Responsive layout for mobile (touch) and desktop (mouse/keyboard).
8. **Lifecycle & Governance:** Safe cleanup of timers, event listeners, frame loops, and zero memory leaks.

| Lab ID | Name & Module Location | Interaction & State Fidelity | Output Nature | Key Deficiencies Identified | Upgrade Priority |
|:---|:---|:---|:---|:---|:---|
| **`ai-lab`** | AI Neural Simulation (`src/labs/ai-lab/`) | **High**. Interactive sliders for neural weights ($w_{11}, w_{12}, b$), inputs, temperature, prompt text. | **Calculated**. Real vector math, dot product attention, softmax. | Lacks an interactive Challenge Mode with verifiable target metrics (e.g. minimize loss below threshold or adjust weights to classify test points). | **Medium** |
| **`blockchain-lab`** | TrustLink Explorer (`src/labs/blockchain-lab/`) | **Low**. Timer-driven slideshow (`step = 0..maxSteps`). Auto-advances every 2.8s. | **Decorative**. Hardcoded block hashes (`000a1b2...`), static SVG animations. | Zero live hash calculation, no difficulty adjustment, no nonce brute-force mining simulator, no tamper-and-detect experiment. | **High** |
| **`cybersecurity-lab`** | CyberSphere Attack/Defense (`src/labs/cybersecurity/`) | **Medium-Low**. Selects scenarios in `SimulatePage` to read pre-written logs. `DefendPage` is tool quiz. | **Decorative / Static strings**. Pre-baked log entries. | No live packet inspector, no interactive firewall rule builder (CIDR, port, protocol), no cause-and-effect packet drop/allow pipeline. | **Highest** |
| **`iot-lab`** | IoT & Smart Sensors (`src/labs/iot-lab/`) | **High in 3D, Low in 2D**. 3D mode has layer explosion and battery life calculator; 2D canvas is passive timer. | **Calculated in 3D**, mock timer in 2D (`temp < 32 ? temp + 0.1 : 32.1`). | 2D network view does not allow adjusting sensor values (lux, temperature, humidity) to trigger actuator relays or MQTT payloads. | **High** |
| **`privacy-lab`** | Digital Privacy & Footprint (`src/labs/privacy-lab/`) | **Low**. 8-step linear sequence displaying tracker cards. | **Static mock data**. Predefined tracker strings (`IP: 192.168.1.45`). | No interactive Cookie/Permission toggles, no re-identification risk calculator, no browser fingerprint entropy gauge. | **Medium** |
| **`banking-lab`** | Banking Accounts & Settlement (`src/labs/banking-lab/`) | **Medium**. Switch account types; auto-running interest calculation. | **Semi-calculated**. Hardcoded random transactions (`Math.random() > 0.4`). | Lacks interactive deposit/tenure inputs, compound frequency levers, loan amortisation schedules, and inflation comparison. | **Medium** |
| **`crypto-lab`** | CryptoLab: Digital Money (`src/labs/crypto-lab/`) | **Low**. Linear 8-step slideshow with "Did You Know" boxes. | **Static text**. | No interactive mempool transaction builder, UTXO ledger calculation, or mining fee auction simulator. | **Medium** |
| **`fintech-lab`** | FinTech Discovery (`src/labs/fintech-lab/`) | **Low**. 10 slideshow modules with SVG payment flow icons. | **Decorative**. Animated SVG circles representing packets. | No interactive payment gateway state machine, fraud scoring engine, or ISO 20022 message payload inspector. | **Medium** |
| **`economics-lab`** | Global Economics (`src/labs/economics-lab/`) | **Low**. Selects global event (War, Pandemic) and reads 5 text steps. | **Static text**. | No interactive monetary policy levers (central bank rate, money supply, tariff %) affecting inflation, GDP, and employment. | **High** |
| **`intro-finance-lab`** | Personal Finance (`src/labs/intro-finance-lab/`) | **Medium-High**. Good 50/30/20 slider with live math. | **Calculated** for budgeting; static for other 8 modules. | Modules 1, 4, 5, 9, 10 are passive text animations. Needs debt payoff calculator (Snowball vs Avalanche) and compound growth simulator. | **Medium** |
| **`office-lab`** | Microsoft Office Lab (`src/labs/office-lab/`) | **Low**. Typing animation showing office productivity tips. | **Static text**. | No interactive spreadsheet grid, no real formula calculation engine (`=SUM`, `=AVERAGE`, `=IF`), no chart generator from table data. | **High** |
| **`professional-skills-lab`**| Professional Skills (`src/labs/professional-skills-lab/`) | **Medium**. Multiple-choice scenarios modifying radar gauges. | **Calculated scores** based on decision impact weights. | Lacks Eisenhower Time-Matrix drag-and-drop prioritization challenge. | **Medium** |
| **`social-profile-lab`** | Social Profile Lab (`src/labs/social-profile-lab/`) | **Medium**. Form inputs customize profile and calculate safety score. | **Calculated score** from selected checklist items. | Lacks interactive privacy risk scanner with simulated public audience visibility. | **Medium** |
| **`stock-market-lab`** | Stock Market & Order Book (`src/labs/stock-market-lab/`) | **Low**. Step-by-step viewer with sine-wave mock stock charts. | **Decorative math**. `Math.sin(i / 2) * 5 + i * 1.5`. | No real order book matching engine (bids/asks), no limit vs market order execution, no bid-ask spread or slippage calculation. | **Highest** |
| **`communication-lab`** | Communication Pro (`src/labs/communication-lab/`) | **Medium**. Scenario choices update clarity/respect scores. | **Calculated scores**. | Lacks interactive email tone analyzer with real-time heuristic keyword scoring. | **Medium** |

---

## 3. High-Value Priority Upgrade Targets

Based on educational impact, architectural feasibility, and core curriculum relevance, we prioritize three flagship laboratories for comprehensive overhaul:

### Priority 1: Cybersecurity Laboratory (`cybersecurity-lab`)
- **Root Problem:** Currently a static log reader and simple flashcard quiz. Students cannot observe how network defenses actually operate.
- **Overhaul Target:** Contained, Educational Interactive Firewall & Packet Filter Simulator (`InteractiveFirewallSimulator`):
  - Visual network topology: External Internet $\leftrightarrow$ Edge Firewall Gateway $\leftrightarrow$ Protected Intranet / Web Server / DB.
  - Live Rule Engine: Students create, edit, reorder, toggle, and delete firewall rules (Protocol: TCP/UDP/ICMP, Source CIDR, Dest Port, Action: ALLOW/DROP/REJECT).
  - Packet Generator & Traffic Injector: Inject legitimate web traffic (HTTP GET :80, HTTPS :443, DNS :53) vs malicious payloads (SSH brute force :22, SQL injection string, Syn flood, Port scan).
  - Real-Time Inspection & Trace Log: Live packet pipeline showing exact rule matched, default policy evaluation, verdict (Allowed / Dropped), and security alert notifications.
  - Guided Defensive Challenges: 3 verifiable missions (Stop Telnet Leakage, Block Malicious Subnet, Defeat Port Scanning) with automated win conditions.

### Priority 2: Stock Market & Order Book Laboratory (`stock-market-lab`)
- **Root Problem:** Currently renders arbitrary synthetic sine waves. Students do not learn how market prices are actually discovered.
- **Overhaul Target:** Continuous Double Auction & Order Book Simulator (`InteractiveOrderBookSimulator`):
  - Live Bid/Ask Order Book with depth visualizer (market depth bars).
  - Order entry engine: Limit Orders and Market Orders with user-defined price, quantity, and side (Buy/Sell).
  - Deterministic Order Matching Engine: Crossing orders match at the book price, execute trades, update the Last Price, and record trade history.
  - Spread & Slippage Telemetry: Live spread, mid-market price, order fill latency, and market impact calculation.
  - Challenge Mode: Execute a liquidity-providing strategy or absorb order volume without exceeding 2% price slippage.

### Priority 3: IoT & Electronics Circuit Laboratory (`iot-lab`)
- **Root Problem:** The 2D canvas view only shows passive numerical increments without student control.
- **Overhaul Target:** Interactive Circuit & Telemetry Controller (`InteractiveCircuitWorkbench`):
  - Visual circuit schematic: Microcontroller (ESP32), Ambient Light Sensor (LDR), Temperature Sensor (NTC), Relay Switch, LED indicator.
  - Live Slider Controls: Lux, Temperature (°C), Supply Voltage, Relay Sensitivity Threshold.
  - Genuine Electrical Math: Sensor voltage divider calculation ($V_{\text{out}} = V_{\text{in}} \cdot \frac{R}{R + R_{\text{sensor}}}$), ADC integer reading ($0-4095$), transistor switching logic, and actuator relay state.
  - Diagnostic Circuit Faults: Simulates short circuits, open circuits, or brownout conditions when voltage drops below 2.7V.
  - Verifiable Challenge: Calibrate threshold to automate nocturnal street-lamp activation without flickering.

---

## 4. Reusable Simulation Infrastructure Plan

To avoid brittle, ad-hoc implementations, all upgraded simulations share clean architectural abstractions:
1. **Separation of Physics/Model Logic from UI Presentation:**
   - Pure TypeScript domain functions (`simulateFirewallRuleEvaluation`, `matchOrderBook`, `calculateVoltageDivider`).
   - 100% unit-testable without React rendering or DOM overhead.
2. **Explicit State & Parameter Validation:**
   - Guarded inputs with strict boundaries (clamped voltages, validated CIDRs, positive quantities).
3. **Deterministic Reset & State Recovery:**
   - Every simulator provides a zero-leak `resetToDefaults()` restoring initial clean state.
4. **Lifecycle & Resource Governance:**
   - Automatic teardown of all intervals, requestAnimationFrame loops, and keyboard listeners on component unmount.
5. **Verifiable Challenge Contracts:**
   - Formal interface: `{ id, title, description, constraints, isComplete: (state) => boolean, hint }`.
6. **Accessibility & Responsive Geometry:**
   - ARIA live regions for state updates, high contrast color coding (cyan/emerald/amber/rose), full mobile touch support with scalable SVG viewports.

---

## 5. Implementation Roadmap & Execution Order

- **Phase 1 (Complete):** Repository audit and publication of this audit document (`docs/LABS_SIMULATION_AUDIT.md`).
- **Phase 2 (Immediate):** Implement the flagship Reference Experience: **Cybersecurity Interactive Firewall & Packet Filter Simulator**.
- **Phase 3:** Implement Flagship Experience 2: **Interactive Stock Market Order Book & Continuous Double Auction Simulator**.
- **Phase 4:** Upgrade IoT 2D Canvas with **Interactive Circuit & Sensor Workbench**.
- **Phase 5:** Automated Test Suite: Calculations, boundary tests, challenge solvers, reset behavior, and unmount cleanup.
- **Phase 6:** Full verification: `npm test`, `npm run build`, zero TypeScript errors, and final release reporting.
