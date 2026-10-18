// ====================================================================
// Geniusphere — Approved Lab & Simulation Catalogue (Section 5)
// Strictly functional, evidence-backed educational labs
// ====================================================================

import { LabDefinition } from '../types';

export const APPROVED_LABS: LabDefinition[] = [
  // ------------------------------------------------------------------
  // TECHNOLOGY LABS
  // ------------------------------------------------------------------
  {
    id: 'lab-t1-ai-classifier',
    slug: 'ai-classification-playground',
    title: 'AI Classification Playground',
    category: 'technology',
    interaction_type: 'simulation',
    difficulty: 'beginner',
    duration_minutes: 15,
    summary: 'Demonstrate how input features and weight thresholds influence an educational classification model.',
    learning_objective: 'Understand feature weighting, classification thresholds, and model confidence in automated decision systems.',
    instructions: [
      'Adjust feature inputs: Spam keyword density, Urgency score, and Sender reputation score.',
      'Observe the predicted category (Legitimate, Suspicious, or Phishing) and model confidence score.',
      'Observe how crossing the classification boundary alters decision thresholds without fabricating real-world AI perfection.',
      'Complete the verification check by testing safe, borderline, and high-risk feature configurations.',
    ],
    initial_state: {
      keywordDensity: 15,
      urgencyScore: 20,
      senderReputation: 85,
    },
    validation_criteria: [
      'Configure inputs to produce a verified Legitimate classification (Reputation > 70, Low keywords).',
      'Configure inputs to cross the boundary into a Phishing classification (Keywords > 60, High urgency).',
      'Analyze the resulting model confidence percentage and classification boundary explanation.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-t2-blockchain-builder',
    slug: 'blockchain-block-builder',
    title: 'Blockchain Block Builder',
    category: 'technology',
    interaction_type: 'simulation',
    difficulty: 'intermediate',
    duration_minutes: 20,
    summary: 'Explore cryptographic hashing, proof-of-work nonce mining, and tamper detection across chained blocks.',
    learning_objective: 'Compute genuine SHA-256 block hashes and observe downstream verification failure when historical data is altered.',
    instructions: [
      'Review Block 1, Block 2, and Block 3 in the demonstration chain.',
      'Enter transaction records into Block 1 and observe how its SHA-256 hash updates.',
      'Use the Nonce slider or click "Mine Block" to compute a valid hash meeting the difficulty target (leading zeros).',
      'Click "Simulate Tamper" on Block 1 to witness chain invalidation and broken links across subsequent blocks.',
    ],
    initial_state: {
      difficulty: 2,
      currentNonce: 0,
      chainValid: true,
      block1Data: 'Alice pays Bob 10 GEN; Charlie pays Dave 5 GEN',
      block2Data: 'Dave pays Eve 2 GEN; Bob pays Frank 8 GEN',
      block3Data: 'Frank pays Grace 3 GEN',
    },
    validation_criteria: [
      'Mine a valid block using browser SHA-256 cryptography with target leading zeros.',
      'Simulate tampering to observe cryptographic chain invalidation.',
      'Re-mine the chain to restore cryptographic integrity and valid links.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-t3-iot-sensor',
    slug: 'iot-sensor-simulator',
    title: 'IoT Sensor Simulator',
    category: 'technology',
    interaction_type: 'simulation',
    difficulty: 'beginner',
    duration_minutes: 15,
    summary: 'Simulate temperature and humidity telemetry, threshold triggers, and automated actuator states.',
    learning_objective: 'Observe real-time sensor event handling and automated device state transitions with deterministic logic.',
    instructions: [
      'Set the Alert Temperature Threshold (e.g., 38°C) using the threshold control.',
      'Adjust the live Temperature and Humidity sliders to simulate changing ambient conditions.',
      'Observe the device state transition from NORMAL to ALERT and automated FAN ACTIVATION.',
      'Review the structured event log recording state transition timestamps and MQTT JSON packets.',
    ],
    initial_state: {
      temperature: 24,
      humidity: 45,
      threshold: 38,
      relayState: 'IDLE',
    },
    validation_criteria: [
      'Set an operational trigger threshold.',
      'Induce a state transition by exceeding the threshold to trigger the cooling relay.',
      'Inspect the generated JSON telemetry log.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-t4-privacy-decision',
    slug: 'digital-privacy-decision-lab',
    title: 'Digital Privacy Decision Lab',
    category: 'technology',
    interaction_type: 'simulation',
    difficulty: 'beginner',
    duration_minutes: 15,
    summary: 'Analyze digital footprint exposure and permission risks across modern web and mobile applications.',
    learning_objective: 'Evaluate how configurable sharing settings and permissions impact personal data exposure score.',
    instructions: [
      'Review the fictional student profile and default application permission settings.',
      'Toggle permissions: Geolocation, Contact List, Background Audio, and Third-Party Ad Profiling.',
      'Observe the calculated Privacy Exposure Score and exposed metadata attributes in real time.',
      'Minimize unnecessary permissions to achieve a safe exposure score below 25%.',
    ],
    initial_state: {
      locationShared: true,
      contactsShared: true,
      micShared: true,
      adTracking: true,
    },
    validation_criteria: [
      'Reduce privacy exposure score to safe tier (< 25%).',
      'Identify and revoke high-risk background permissions.',
      'Verify minimized metadata sharing configuration.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-t5-web-defense',
    slug: 'defensive-web-security-lab',
    title: 'Defensive Web Security Lab',
    category: 'technology',
    interaction_type: 'sandbox',
    difficulty: 'intermediate',
    duration_minutes: 20,
    summary: 'Test SQL parameterization, output encoding, and CSP headers to neutralize common web attack vectors.',
    learning_objective: 'Apply defense-in-depth measures against SQL injection and cross-site scripting in a safe sandbox.',
    instructions: [
      'Test the vulnerable query form with sample payload: \' OR \'1\'=\'1.',
      'Toggle "Parameterized Queries" to encapsulate inputs and prevent query structure manipulation.',
      'Test XSS script payload and toggle "Context-Aware HTML Entity Encoding".',
      'Inspect the diagnostic security log and verify that exploits are safely neutralized.',
    ],
    initial_state: {
      parameterizedQueries: false,
      outputEncoding: false,
      cspEnabled: false,
      userQueryInput: "' OR '1'='1",
    },
    validation_criteria: [
      'Neutralize SQL injection attempt using parameterized queries.',
      'Neutralize XSS attempt using HTML entity output encoding.',
      'Achieve 100% defensive security test suite pass rate.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-t6-microsoft-productivity',
    slug: 'microsoft-productivity-exercise',
    title: 'Microsoft Productivity Exercise',
    category: 'technology',
    interaction_type: 'sandbox',
    difficulty: 'beginner',
    duration_minutes: 15,
    summary: 'Practice spreadsheet data manipulation, conditional aggregation formulas, and table formatting.',
    learning_objective: 'Execute structured business calculation formulas in an educational spreadsheet workspace.',
    instructions: [
      'Review the quarterly department sales data table (Q1-Q4).',
      'Enter formula =SUM(C2:C5) to calculate Total Annual Revenue.',
      'Enter formula =AVERAGE(D2:D5) to calculate Average Acquisition Cost.',
      'Apply currency formatting and verify objective validation passing.',
    ],
    initial_state: {
      formulaSum: '',
      formulaAvg: '',
      currencyFormatted: false,
    },
    validation_criteria: [
      'Correctly compute Total Revenue with SUM formula (=SUM(C2:C5)).',
      'Correctly compute Average CAC with AVERAGE formula (=AVERAGE(D2:D5)).',
      'Pass all automated spreadsheet validation checks.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },

  // ------------------------------------------------------------------
  // FINANCE LABS
  // ------------------------------------------------------------------
  {
    id: 'lab-f1-market-explorer',
    slug: 'financial-market-explorer',
    title: 'Financial Market Explorer',
    category: 'finance',
    interaction_type: 'simulation',
    difficulty: 'intermediate',
    duration_minutes: 20,
    summary: 'Analyze price action, volatility regimes, and risk-adjusted metrics using educational market scenarios.',
    learning_objective: 'Calculate drawdown, volatility, and returns across documented market scenarios.',
    instructions: [
      'Select an educational scenario: Steady Expansion, Tech Correction, or High Volatility Shock.',
      'Adjust the portfolio beta slider (0.5 to 2.0) to model conservative vs leveraged portfolios.',
      'Observe the calculated trajectory, Max Drawdown percentage, and Sharpe ratio.',
      'Identify the mathematical relationship between volatility and downside capital preservation.',
    ],
    initial_state: {
      scenario: 'expansion',
      beta: 1.0,
      timeHorizonMonths: 12,
    },
    validation_criteria: [
      'Simulate at least 2 distinct volatility scenarios.',
      'Analyze portfolio drawdown under high volatility.',
      'Identify risk-adjusted return trade-offs.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-f2-compound-interest',
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    category: 'finance',
    interaction_type: 'simulation',
    difficulty: 'beginner',
    duration_minutes: 15,
    summary: 'Demonstrate the mathematical exponential impact of compounding frequency, time horizons, and rate.',
    learning_objective: 'Apply compound interest mathematics: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)].',
    instructions: [
      'Enter Initial Principal ($P) and Monthly Contribution ($PMT).',
      'Set Annual Interest Rate (r) and Time Horizon in years (t).',
      'Select Compounding Frequency (Annual, Monthly, Daily).',
      'Compare the compounding curve against a non-compounding linear deposit baseline.',
    ],
    initial_state: {
      principal: 5000,
      monthlyContribution: 250,
      annualRate: 8,
      years: 10,
      frequency: 12,
    },
    validation_criteria: [
      'Calculate future value with monthly compounding frequency.',
      'Compare 10-year vs 20-year exponential compounding curves.',
      'Identify the proportion of total wealth derived from interest vs contributions.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-f3-institution-flow',
    slug: 'financial-institution-flow-simulator',
    title: 'Financial Institution Flow Simulator',
    category: 'finance',
    interaction_type: 'simulation',
    difficulty: 'intermediate',
    duration_minutes: 20,
    summary: 'Step through the lifecycle of a digital payment transaction from buyer to merchant settlement.',
    learning_objective: 'Understand the roles of payment gateways, card networks, clearing houses, and merchant accounts.',
    instructions: [
      'Initiate a simulated $150 credit purchase in the educational payment simulator.',
      'Step 1: Payment Gateway tokenizes card data and sends auth request.',
      'Step 2: Card Network routes authorization to the Customer Issuing Bank.',
      'Step 3: Issuing Bank validates available balance and places funds hold.',
      'Step 4: Clearing House aggregates daily batch for multi-party net settlement.',
      'Step 5: Merchant Acquiring Bank credits net merchant funds after interchange fee.',
    ],
    initial_state: {
      currentStep: 0,
      status: 'IDLE',
      amount: 150,
      feeRate: 0.02,
    },
    validation_criteria: [
      'Complete all 5 stages of payment settlement.',
      'Observe the interchange fee deduction ($3.00 on $150 transaction).',
      'Identify the role of the clearing house in multi-party net settlement.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },

  // ------------------------------------------------------------------
  // CODING & PROGRAMMING LABS
  // ------------------------------------------------------------------
  {
    id: 'lab-c1-programming-fundamentals',
    slug: 'programming-fundamentals',
    title: 'Programming Fundamentals',
    category: 'coding',
    interaction_type: 'sandbox',
    difficulty: 'beginner',
    duration_minutes: 20,
    summary: 'Write and execute JavaScript logic using variables, arithmetic operators, and string template literals.',
    learning_objective: 'Implement a function that computes total purchase cost including tax and shipping discounts.',
    instructions: [
      'Review the starter code function calculateTotal(subtotal, taxRate, discount).',
      'Calculate subtotal after discount, apply tax rate, and return formatted total rounded to 2 decimals.',
      'Click "Run Code" to execute in the isolated browser runtime.',
      'Pass all 3 automated test cases to verify correct calculations.',
    ],
    initial_state: {
      code: `function calculateTotal(subtotal, taxRate, discount) {
  // Apply discount first
  const discountedSubtotal = subtotal - discount;
  // Apply tax rate
  const totalWithTax = discountedSubtotal * (1 + taxRate);
  // Return rounded to 2 decimal places
  return Number(totalWithTax.toFixed(2));
}

console.log('Test Run:', calculateTotal(100, 0.08, 10));`,
    },
    validation_criteria: [
      'Run code in the isolated execution sandbox.',
      'Pass Test 1: calculateTotal(100, 0.08, 10) === 97.20.',
      'Pass Test 2: calculateTotal(50, 0.05, 0) === 52.50.',
      'Pass Test 3: calculateTotal(200, 0.10, 50) === 165.00.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-c2-conditions-loops',
    slug: 'conditions-and-loops',
    title: 'Conditions and Loops',
    category: 'coding',
    interaction_type: 'sandbox',
    difficulty: 'intermediate',
    duration_minutes: 25,
    summary: 'Implement iterative control flow algorithms with conditional branch evaluation.',
    learning_objective: 'Build an algorithm that processes a list of student test scores and returns statistical metrics.',
    instructions: [
      'Implement analyzeScores(scores) to find the highest score, lowest score, and class average.',
      'Filter out invalid scores (negative numbers or scores > 100).',
      'Run automated tests against diverse array inputs including edge cases.',
    ],
    initial_state: {
      code: `function analyzeScores(scores) {
  const valid = scores.filter(s => s >= 0 && s <= 100);
  if (valid.length === 0) return { max: 0, min: 0, avg: 0 };
  const max = Math.max(...valid);
  const min = Math.min(...valid);
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  const avg = Number((sum / valid.length).toFixed(1));
  return { max, min, avg };
}

console.log('Result:', analyzeScores([85, 92, -5, 78, 105, 90]));`,
    },
    validation_criteria: [
      'Filter out out-of-range scores (< 0 or > 100).',
      'Accurately compute max, min, and average score.',
      'Pass all automated unit test assertions.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-c3-debugging-workshop',
    slug: 'debugging-workshop',
    title: 'Debugging Workshop',
    category: 'coding',
    interaction_type: 'sandbox',
    difficulty: 'intermediate',
    duration_minutes: 25,
    summary: 'Isolate, diagnose, and fix logical bugs and edge-case errors in existing code.',
    learning_objective: 'Debug a binary search function containing off-by-one errors and integer division bugs.',
    instructions: [
      'Inspect the provided buggy binarySearch(arr, target) function.',
      'Identify why it fails when the target is at index 0 or when the target is absent.',
      'Fix the mid index calculation and boundary updates (left = mid + 1, right = mid - 1).',
      'Run test cases to confirm termination and correct index returns.',
    ],
    initial_state: {
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

console.log('Search 7 in [1,3,5,7,9]:', binarySearch([1, 3, 5, 7, 9], 7));`,
    },
    validation_criteria: [
      'Diagnose and correct off-by-one loop boundary condition.',
      'Return correct index for existing elements and -1 for absent elements.',
      'Pass all regression test cases.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'lab-sec-scam-defense',
    slug: 'recognising-digital-payment-scams',
    title: 'Recognising Digital Payment Scams',
    category: 'technology',
    interaction_type: 'simulation',
    difficulty: 'beginner',
    duration_minutes: 20,
    summary: 'Master practical defense against digital payment fraud, impersonation links, and UPI collect scams.',
    learning_objective: 'Understand common scam warning signs, analyze educational suspicious messages, identify red flags, and demonstrate safe response protocols.',
    instructions: [
      'Stage 1 (Understand): Learn common warning signs in payment requests, links, and impersonation attempts.',
      'Stage 2 (Examine): Analyze clearly identified educational case studies of suspicious messages.',
      'Stage 3 (Apply): Identify red flags, explain risks, and select an appropriate safe response.',
      'Stage 4 (Get Feedback): Receive explanations linked to the decisions made, referencing NPCI and 1930 guidelines.',
      'Stage 5 (Demonstrate): Save completed work and its assessment result to the learner portfolio record.',
    ],
    initial_state: {
      stage: 'understand',
      scenariosReviewed: 0,
      accuracyScore: 0,
    },
    validation_criteria: [
      'Evaluate all 3 educational case studies (Lottery Collect, Urgent KYC SMS, Verified Merchant QR).',
      'Correctly distinguish fraudulent collect requests requiring a PIN from legitimate payment requests.',
      'Select safe response actions and demonstrate verifiable competency in digital payment threat defense.',
    ],
    completion_threshold: 100,
    is_published: true,
    version: '1.0.0',
    created_at: '2026-10-17T00:00:00.000Z',
    updated_at: '2026-10-17T00:00:00.000Z',
  },
];

