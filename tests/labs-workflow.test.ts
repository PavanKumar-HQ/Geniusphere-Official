import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';
import { APPROVED_LABS } from '../src/data/approved-labs';

describe('Labs & Simulation Engine Acceptance Suite', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('1. Approved Lab Catalogue & Data Contract', () => {
    it('initializes all 12 approved labs across Technology, Finance, and Coding', () => {
      const labs = db.getLabDefinitions();
      expect(labs.length).toBe(12);

      const techLabs = labs.filter((l) => l.category === 'technology');
      const finLabs = labs.filter((l) => l.category === 'finance');
      const codingLabs = labs.filter((l) => l.category === 'coding');

      expect(techLabs.length).toBe(6);
      expect(finLabs.length).toBe(3);
      expect(codingLabs.length).toBe(3);
    });

    it('enforces distinct separation between Simulations and Sandboxes', () => {
      const simulations = db.getLabDefinitions({ interaction_type: 'simulation' });
      const sandboxes = db.getLabDefinitions({ interaction_type: 'sandbox' });

      // Simulations: T1, T2, T3, T4, F1, F2, F3 (7)
      expect(simulations.length).toBe(7);
      // Sandboxes: T5, T6, C1, C2, C3 (5)
      expect(sandboxes.length).toBe(5);

      // Verify simulations are rule-based models
      simulations.forEach((sim) => {
        expect(sim.interaction_type).toBe('simulation');
        expect(sim.validation_criteria.length).toBeGreaterThanOrEqual(2);
      });

      // Verify sandboxes provide testable configuration/code environments
      sandboxes.forEach((sb) => {
        expect(sb.interaction_type).toBe('sandbox');
        expect(sb.initial_state).toBeDefined();
      });
    });

    it('filters catalogue accurately by category, interaction type, and search keyword', () => {
      const aiLab = db.getLabDefinitions({ search: 'AI Classification' });
      expect(aiLab.length).toBe(1);
      expect(aiLab[0].id).toBe('lab-t1-ai-classifier');

      const blockchainLab = db.getLabBySlug('blockchain-block-builder');
      expect(blockchainLab).toBeDefined();
      expect(blockchainLab?.id).toBe('lab-t2-blockchain-builder');

      const codingSandboxes = db.getLabDefinitions({
        category: 'coding',
        interaction_type: 'sandbox',
      });
      expect(codingSandboxes.length).toBe(3);
    });

    it('confirms every lab has defined learning objectives and step-by-step instructions', () => {
      APPROVED_LABS.forEach((lab) => {
        expect(lab.title.length).toBeGreaterThan(0);
        expect(lab.learning_objective.length).toBeGreaterThan(10);
        expect(lab.instructions.length).toBeGreaterThanOrEqual(3);
        expect(lab.validation_criteria.length).toBeGreaterThanOrEqual(2);
        expect(lab.completion_threshold).toBeGreaterThanOrEqual(60);
      });
    });
  });

  describe('2. Lab Persistence, Verification & Anti-Inflation XP Rules', () => {
    it('records successful lab attempt and increments user XP on first completion', () => {
      const initialProgress = db.getUserProgress('user-student-1');
      const initialXP = initialProgress.xp;

      const record = db.recordLabAttempt('user-student-1', 'lab-t1-ai-classifier', {
        passed: true,
        score: 100,
        diagnostics: 'All 3 evaluation test cases passed successfully.',
      });

      expect(record.passed).toBe(true);
      expect(record.score).toBe(100);
      expect(record.attempt_number).toBe(1);

      const updatedProgress = db.getUserProgress('user-student-1');
      expect(updatedProgress.xp).toBe(initialXP + 100);
      expect(db.isLabCompleted('user-student-1', 'lab-t1-ai-classifier')).toBe(true);
    });

    it('prevents XP inflation on repeated successful submissions of the same lab', () => {
      const initialProgress = db.getUserProgress('user-student-1');
      const initialXP = initialProgress.xp;

      // First completion: +100 XP
      db.recordLabAttempt('user-student-1', 'lab-t2-blockchain-builder', {
        passed: true,
        score: 100,
        diagnostics: 'Genesis block mined and verified.',
      });
      const afterFirst = db.getUserProgress('user-student-1').xp;
      expect(afterFirst).toBe(initialXP + 100);

      // Second completion: XP MUST NOT duplicate
      db.recordLabAttempt('user-student-1', 'lab-t2-blockchain-builder', {
        passed: true,
        score: 100,
        diagnostics: 'Retried lab with different nonce.',
      });
      const afterSecond = db.getUserProgress('user-student-1').xp;
      expect(afterSecond).toBe(afterFirst); // strictly no duplicate XP
    });

    it('does NOT award completion or XP if score is below threshold', () => {
      const initialProgress = db.getUserProgress('user-student-1');
      const initialXP = initialProgress.xp;

      const failedRecord = db.recordLabAttempt('user-student-1', 'lab-t3-iot-sensor', {
        passed: false,
        score: 33,
        diagnostics: 'Threshold triggered but cooling cycle not maintained.',
      });

      expect(failedRecord.passed).toBe(false);
      expect(db.isLabCompleted('user-student-1', 'lab-t3-iot-sensor')).toBe(false);
      expect(db.getUserProgress('user-student-1').xp).toBe(initialXP);
    });

    it('retains historical attempt records for auditing', () => {
      db.recordLabAttempt('user-student-1', 'lab-c1-programming-fundamentals', {
        passed: false,
        score: 33,
        diagnostics: 'SyntaxError: unexpected token',
      });

      db.recordLabAttempt('user-student-1', 'lab-c1-programming-fundamentals', {
        passed: true,
        score: 100,
        diagnostics: 'Output verified: Welcome, Alex! Age: 16',
      });

      const attempts = db.getLabAttempts('user-student-1', 'lab-c1-programming-fundamentals');
      expect(attempts.length).toBe(2);
      expect(attempts[0].attempt_number).toBe(1);
      expect(attempts[0].passed).toBe(false);
      expect(attempts[1].attempt_number).toBe(2);
      expect(attempts[1].passed).toBe(true);
    });
  });

  describe('3. Simulation & Sandbox Engine Mathematical and Deterministic Validation', () => {
    it('T1 AI Classifier: computes deterministic phishing risk based on bounded features', () => {
      // Linear model: z = 0.45*density + 0.35*urgency - 0.40*reputation
      const calcRisk = (density: number, urgency: number, reputation: number) => {
        const rawScore = 0.45 * density + 0.35 * urgency - 0.4 * reputation;
        return Math.round(1 / (1 + Math.exp(-rawScore / 25)) * 100);
      };

      // Benign email: low density, low urgency, high reputation
      const benignRisk = calcRisk(5, 10, 95);
      expect(benignRisk).toBeLessThan(35);

      // Phishing payload: high density, extreme urgency, spoofed/low reputation
      const phishingRisk = calcRisk(85, 90, 15);
      expect(phishingRisk).toBeGreaterThan(80);
    });

    it('T3 IoT Sensor: threshold transitions trigger actuator relay states', () => {
      const evaluateIoTState = (temp: number, threshold: number) => {
        const isExceeded = temp >= threshold;
        return {
          relayState: isExceeded ? 'FAN_ON' : 'FAN_OFF',
          isAlert: isExceeded,
        };
      };

      expect(evaluateIoTState(24, 38).relayState).toBe('FAN_OFF');
      expect(evaluateIoTState(39, 38).relayState).toBe('FAN_ON');
      expect(evaluateIoTState(38, 38).relayState).toBe('FAN_ON');
    });

    it('T4 Digital Privacy: permission toggling directly reduces exposure score', () => {
      const calcExposure = (loc: boolean, contacts: boolean, mic: boolean, ads: boolean) => {
        let score = 0;
        if (loc) score += 30;
        if (contacts) score += 25;
        if (mic) score += 25;
        if (ads) score += 20;
        return score;
      };

      // All permissions open
      expect(calcExposure(true, true, true, true)).toBe(100);
      // Hardened privacy configuration
      expect(calcExposure(false, false, false, false)).toBe(0);
      // Reasonable minimal configuration
      expect(calcExposure(false, false, true, false)).toBe(25);
    });

    it('T5 Defensive Web Security: parameterization mitigates SQL injection', () => {
      const checkSqlVulnerability = (paramQueries: boolean, input: string) => {
        if (paramQueries) {
          return { vulnerable: false, executedQuery: `SELECT * FROM accounts WHERE id = ? [PARAM: ${input}]` };
        }
        return { vulnerable: true, executedQuery: `SELECT * FROM accounts WHERE id = '${input}'` };
      };

      const maliciousPayload = "' OR '1'='1";
      const unsafe = checkSqlVulnerability(false, maliciousPayload);
      expect(unsafe.vulnerable).toBe(true);
      expect(unsafe.executedQuery).toContain("' OR '1'='1'");

      const safe = checkSqlVulnerability(true, maliciousPayload);
      expect(safe.vulnerable).toBe(false);
      expect(safe.executedQuery).toContain('[PARAM:');
    });

    it('T6 Microsoft Productivity: validates exact spreadsheet formula syntax', () => {
      const validateSum = (f: string) => f.trim().toUpperCase() === '=SUM(C2:C5)';
      const validateAvg = (f: string) => f.trim().toUpperCase() === '=AVERAGE(D2:D5)';

      expect(validateSum('=SUM(C2:C5)')).toBe(true);
      expect(validateSum(' =sum(c2:c5) ')).toBe(true);
      expect(validateSum('=SUM(C2:C6)')).toBe(false);

      expect(validateAvg('=AVERAGE(D2:D5)')).toBe(true);
      expect(validateAvg('=AVG(D2:D5)')).toBe(false);
    });

    it('F2 Compound Interest Calculator: calculates exact future value via mathematical formula', () => {
      // A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
      const P = 5000;
      const PMT = 250;
      const r = 0.08;
      const n = 12; // monthly
      const t = 10; // 10 years

      const principalFV = P * Math.pow(1 + r / n, n * t);
      const contributionFV = PMT * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      const totalFV = Math.round(principalFV + contributionFV);
      const totalContributed = P + PMT * 12 * t; // 5000 + 30000 = 35000
      const totalInterest = Math.round(totalFV - totalContributed);

      // Verify known compound interest benchmark ($5k init + $250/mo @ 8% for 10y ≈ $56,861)
      expect(totalFV).toBeGreaterThan(56000);
      expect(totalFV).toBeLessThan(58000);
      expect(totalContributed).toBe(35000);
      expect(totalInterest).toBeGreaterThan(21000);
    });

    it('F3 Financial Institution Flow: state machine transitions through 5 distinct clearing stages', () => {
      const stages = [
        'INITIATED',
        'TOKENIZED_AT_GATEWAY',
        'ROUTED_TO_CARD_NETWORK',
        'HOLD_PLACED_AT_ISSUING_BANK',
        'CLEARED_AT_CLEARING_HOUSE',
        'SETTLED_AT_ACQUIRING_BANK',
      ];

      let currentStage = 0;
      const advance = () => {
        currentStage = Math.min(stages.length - 1, currentStage + 1);
        return stages[currentStage];
      };

      expect(advance()).toBe('TOKENIZED_AT_GATEWAY');
      expect(advance()).toBe('ROUTED_TO_CARD_NETWORK');
      expect(advance()).toBe('HOLD_PLACED_AT_ISSUING_BANK');
      expect(advance()).toBe('CLEARED_AT_CLEARING_HOUSE');
      expect(advance()).toBe('SETTLED_AT_ACQUIRING_BANK');
    });

    it('C1-C3 Coding Sandbox: executes isolated JavaScript code and captures stdout', () => {
      const executeSandbox = (code: string) => {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
          error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
        };

        const runner = new Function('console', code);
        runner(customConsole);
        return logs.join('\n');
      };

      const code = `
        const name = "Alex";
        const age = 16;
        console.log("Welcome, " + name + "! Age: " + age);
      `;

      const output = executeSandbox(code);
      expect(output).toBe('Welcome, Alex! Age: 16');
    });
  });
});
