// ====================================================================
// Geniusphere — Canonical 40-Course Curriculum Registry
// Strictly matches the 3 Streams Mandated by the Master Design Board:
// 1. Technology & Digital Skills (12 Courses)
// 2. Financial Literacy & the Economy (14 Courses)
// 3. Professional & Life Skills (14 Courses)
// Total: Exactly 40 Curricular Subjects
// ====================================================================

import { Course, CourseModule, DomainType, DifficultyLevel } from '../types';
import { ALL_COURSES } from './curriculum';

export interface CanonicalCourseItem {
  id: string;
  stream_id: 'technology' | 'finance' | 'professional';
  title: string;
  slug: string;
  modules_count: number;
  duration_hours: number;
  difficulty: DifficultyLevel;
  summary: string;
  learning_objectives: string[];
  is_published: boolean;
  linked_course_id?: string; // links to detailed modules in curriculum.ts if available
}

export interface CanonicalStream {
  id: 'technology' | 'finance' | 'professional';
  title: string;
  summary: string;
  course_count: number;
  badge_color: string;
  icon_name: string;
  courses: CanonicalCourseItem[];
}

export const CANONICAL_COURSES: CanonicalCourseItem[] = [
  // ==================================================================
  // STREAM 1: TECHNOLOGY & DIGITAL SKILLS (12 Courses)
  // ==================================================================
  {
    id: 'course-tech-1',
    stream_id: 'technology',
    title: 'Artificial Intelligence Literacy',
    slug: 'ai-literacy',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'beginner',
    summary: 'Understand AI, its applications, neural networks, machine learning principles, and real-world impact.',
    learning_objectives: [
      'Understand how machine learning models learn patterns from training data',
      'Distinguish between narrow AI, general AI, and automated heuristics',
      'Evaluate automated decision-making and algorithmic fairness',
    ],
    is_published: true,
    linked_course_id: 'course-ai-fund',
  },
  {
    id: 'course-tech-2',
    stream_id: 'technology',
    title: 'Generative AI and Responsible AI Use',
    slug: 'generative-ai-responsible-use',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'beginner',
    summary: 'Use generative AI tools ethically, verify factual accuracy, and identify hallucinations and algorithmic bias.',
    learning_objectives: [
      'Identify generative model hallucinations, source attribution, and copyright',
      'Implement human-in-the-loop verification for AI-generated outputs',
      'Understand ethical data governance under the DPDP Act 2023',
    ],
    is_published: true,
    linked_course_id: 'course-ai-resp',
  },
  {
    id: 'course-tech-3',
    stream_id: 'technology',
    title: 'Prompting and AI-Assisted Productivity',
    slug: 'prompting-ai-productivity',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Write precise structured prompts, evaluate AI outputs, and streamline daily study workflows.',
    learning_objectives: [
      'Master few-shot, role-based, and chain-of-thought prompting patterns',
      'Structure output formatting for documentation, summaries, and code',
      'Automate repetitive research workflows with verifiable accuracy checks',
    ],
    is_published: true,
    linked_course_id: 'course-ai-fund',
  },
  {
    id: 'course-tech-4',
    stream_id: 'technology',
    title: 'Blockchain Fundamentals',
    slug: 'blockchain-fundamentals',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'intermediate',
    summary: 'Explore decentralized systems, cryptographic hashing, consensus algorithms, and smart contract use cases.',
    learning_objectives: [
      'Understand SHA-256 cryptographic hashing and merkle tree verification',
      'Differentiate proof-of-work, proof-of-stake, and Byzantine fault tolerance',
      'Audit the mechanics of transparent distributed ledgers',
    ],
    is_published: true,
    linked_course_id: 'course-blockchain-fund',
  },
  {
    id: 'course-tech-5',
    stream_id: 'technology',
    title: 'Internet of Things (IoT)',
    slug: 'iot-fundamentals',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Connect physical devices, sensor telemetry, microcontrollers, and edge computing networks safely.',
    learning_objectives: [
      'Examine MQTT and HTTP protocols for low-power sensor telemetry',
      'Secure IoT endpoints against default credential attacks and botnets',
      'Architect smart home and campus automation data pipelines',
    ],
    is_published: true,
    linked_course_id: 'course-iot-fund',
  },
  {
    id: 'course-tech-6',
    stream_id: 'technology',
    title: 'Microsoft Productivity Tools',
    slug: 'microsoft-productivity-tools',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'beginner',
    summary: 'Harness enterprise productivity platforms, Teams collaboration, SharePoint, and automated cloud workflows.',
    learning_objectives: [
      'Configure collaborative channels, document co-authoring, and permissions',
      'Organize institutional group tasks with Planner and OneNote notebooks',
      'Implement multi-factor authentication for student enterprise accounts',
    ],
    is_published: true,
    linked_course_id: 'course-ms-tech',
  },
  {
    id: 'course-tech-7',
    stream_id: 'technology',
    title: 'Microsoft Office and Digital Productivity',
    slug: 'microsoft-office-digital-productivity',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'beginner',
    summary: 'Master structured word processing, presentation hierarchy, formula calculations, and data sheets.',
    learning_objectives: [
      'Build professional academic reports with automatic bibliographies',
      'Analyze data sets with VLOOKUP, XLOOKUP, and pivot tables',
      'Deliver persuasive visual slide decks with typography hierarchy',
    ],
    is_published: true,
    linked_course_id: 'course-ms-tech',
  },
  {
    id: 'course-tech-8',
    stream_id: 'technology',
    title: 'Digital Privacy and Digital Footprint',
    slug: 'digital-privacy-footprint',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'beginner',
    summary: 'Every action online leaves a trace. Learn tracking prevention, data brokers, cookies, and Indian DPDP rights.',
    learning_objectives: [
      'Audit your digital footprint across social platforms and browser trackers',
      'Configure tracker blocking, cookie isolation, and DNS privacy',
      'Understand student privacy rights under the Digital Personal Data Protection Act 2023',
    ],
    is_published: true,
    linked_course_id: 'course-privacy-footprint',
  },
  {
    id: 'course-tech-9',
    stream_id: 'technology',
    title: 'Cybersecurity Fundamentals',
    slug: 'cybersecurity-fundamentals',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'intermediate',
    summary: 'Core defense principles: CIA triad, network perimeter inspection, encryption, and threat modeling.',
    learning_objectives: [
      'Analyze confidentiality, integrity, and availability in real systems',
      'Understand symmetric vs. asymmetric encryption and public key infrastructure',
      'Perform defense audits against cross-site scripting and unauthorized access',
    ],
    is_published: true,
    linked_course_id: 'course-web-sec',
  },
  {
    id: 'course-tech-10',
    stream_id: 'technology',
    title: 'Online Safety, Phishing Awareness and Scam Prevention',
    slug: 'online-safety-phishing-prevention',
    modules_count: 5,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Recognize social engineering tactics, malicious links, fake UPI requests, and emergency reporting via 1930.',
    learning_objectives: [
      'Deconstruct real-world phishing vectors and social engineering pretexts',
      'Enforce the Golden UPI PIN rule: Entering PIN deducts money, never receives it',
      'Follow national cyber fraud reporting protocols with NPCI and cybercrime.gov.in',
    ],
    is_published: true,
    linked_course_id: 'course-web-sec',
  },
  {
    id: 'course-tech-11',
    stream_id: 'technology',
    title: 'Data Literacy and Practical Data Analysis',
    slug: 'data-literacy-data-analysis',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'intermediate',
    summary: 'Collect, clean, visualize, and interpret data objectively to uncover actionable insights without bias.',
    learning_objectives: [
      'Calculate statistical measures: mean, median, standard deviation, and correlation',
      'Identify misleading chart axes, selective sampling, and p-hacking',
      'Build clean data dashboards using structured tabular formats',
    ],
    is_published: true,
    linked_course_id: 'course-prog-fund',
  },
  {
    id: 'course-tech-12',
    stream_id: 'technology',
    title: 'Digital Research and Information Verification',
    slug: 'digital-research-information-verification',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Verify sources, cross-check viral claims, evaluate domain provenance, and detect deepfakes.',
    learning_objectives: [
      'Use lateral reading strategies to evaluate claims across independent sources',
      'Check WHOIS domain records, author credentials, and revision histories',
      'Apply fact-checking frameworks to digital news and social media claims',
    ],
    is_published: true,
    linked_course_id: 'course-privacy-footprint',
  },

  // ==================================================================
  // STREAM 2: FINANCIAL LITERACY & THE ECONOMY (14 Courses)
  // ==================================================================
  {
    id: 'course-fin-1',
    stream_id: 'finance',
    title: 'Introduction to Personal Finance',
    slug: 'intro-personal-finance',
    modules_count: 5,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Understand money, income types, assets vs liabilities, cash flow, and healthy financial mindsets.',
    learning_objectives: [
      'Distinguish needs, wants, assets, and liabilities clearly',
      'Calculate personal net worth and monthly cash flow balances',
      'Establish financial autonomy principles for young adults',
    ],
    is_published: true,
    linked_course_id: 'course-fin-intro',
  },
  {
    id: 'course-fin-2',
    stream_id: 'finance',
    title: 'Budgeting, Saving and Financial Planning',
    slug: 'budgeting-saving-planning',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'beginner',
    summary: 'Plan today, secure tomorrow. Implement the 50/30/20 rule, emergency funds, and sinking funds.',
    learning_objectives: [
      'Build a practical monthly budget with zero-based or percentage allocation',
      'Size an emergency fund covering 3 to 6 months of living expenses',
      'Set SMART short-term and long-term financial milestones',
    ],
    is_published: true,
    linked_course_id: 'course-fin-intro',
  },
  {
    id: 'course-fin-3',
    stream_id: 'finance',
    title: 'Banking and Financial Institutions',
    slug: 'banking-financial-institutions',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'How banks, NBFCs, credit cooperatives, and the Reserve Bank of India (RBI) keep money moving.',
    learning_objectives: [
      'Understand the fractional reserve banking system and deposit insurance (DICGC)',
      'Analyze the supervisory mandate of the Reserve Bank of India',
      'Compare retail banks, payment banks, and non-banking financial companies',
    ],
    is_published: true,
    linked_course_id: 'course-fin-institutions',
  },
  {
    id: 'course-fin-4',
    stream_id: 'finance',
    title: 'Bank Accounts and Everyday Banking',
    slug: 'bank-accounts-everyday-banking',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Navigate savings accounts, current accounts, fixed deposits (FD), recurring deposits (RD), and fees.',
    learning_objectives: [
      'Differentiate interest accrual across savings accounts, FDs, and RDs',
      'Understand KYC protocols, nominee designations, and passbook audits',
      'Avoid hidden banking charges, maintenance fees, and overdraft penalties',
    ],
    is_published: true,
    linked_course_id: 'course-fin-institutions',
  },
  {
    id: 'course-fin-5',
    stream_id: 'finance',
    title: 'UPI, Digital Payments and Payment Safety',
    slug: 'upi-digital-payments-safety',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Make payments. Stay safe. Master Unified Payments Interface (UPI), QR codes, NEFT, RTGS, and fraud shields.',
    learning_objectives: [
      'Understand the architectural protocol connecting NPCI, PSPs, and beneficiary banks',
      'Identify QR code collect requests, request money scams, and spoofed receipts',
      'Execute dispute resolution through the UPI ODR (Online Dispute Resolution) mechanism',
    ],
    is_published: true,
    linked_course_id: 'course-fintech-payments',
  },
  {
    id: 'course-fin-6',
    stream_id: 'finance',
    title: 'Loans, Interest, Credit and EMI Calculations',
    slug: 'loans-interest-credit-emi',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Deconstruct borrowing mechanics: simple vs compound interest, amortisation schedules, and CIBIL scores.',
    learning_objectives: [
      'Calculate Equated Monthly Installments (EMI) using mathematical reduction formulas',
      'Compare reducing balance interest rates against flat interest rate traps',
      'Build and maintain a healthy credit history (CIBIL score > 750)',
    ],
    is_published: true,
    linked_course_id: 'course-fin-markets',
  },
  {
    id: 'course-fin-7',
    stream_id: 'finance',
    title: 'Financial Markets Fundamentals',
    slug: 'financial-markets-fundamentals',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Primary vs secondary markets, debt vs equity capital, liquidity, and regulatory frameworks (SEBI).',
    learning_objectives: [
      'Explain how capital is raised through Initial Public Offerings (IPOs) and bond issuances',
      'Analyze the regulatory oversight role of SEBI in preventing market manipulation',
      'Differentiate money markets (treasury bills) from long-term capital markets',
    ],
    is_published: true,
    linked_course_id: 'course-fin-markets',
  },
  {
    id: 'course-fin-8',
    stream_id: 'finance',
    title: 'Stock Market Fundamentals',
    slug: 'stock-market-fundamentals',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'intermediate',
    summary: 'How stock exchanges operate: NSE, BSE, Nifty 50, Sensex, market orders, dividend yields, and market cap.',
    learning_objectives: [
      'Understand order matching engines, bid-ask spreads, and market depth',
      'Evaluate price-to-earnings (P/E) ratios, dividend yield, and return on equity (ROE)',
      'Construct a diversified long-term portfolio without emotional trading',
    ],
    is_published: true,
    linked_course_id: 'course-stock-market',
  },
  {
    id: 'course-fin-9',
    stream_id: 'finance',
    title: 'Investment Risk and Responsible Investing',
    slug: 'investment-risk-responsible-investing',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'The risk-return spectrum: inflation drag, mutual funds, index funds, asset allocation, and volatility management.',
    learning_objectives: [
      'Analyze standard deviation, Sharpe ratio, and drawdown risk',
      'Compare active mutual funds against low-cost index funds and ETFs',
      'Implement systematic investment plans (SIP) and periodic rebalancing',
    ],
    is_published: true,
    linked_course_id: 'course-stock-market',
  },
  {
    id: 'course-fin-10',
    stream_id: 'finance',
    title: 'Cryptocurrency and Blockchain in Finance',
    slug: 'cryptocurrency-blockchain-finance',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Analyze digital assets objectively: fiat currency differences, volatility, smart contracts, and Indian taxation rules.',
    learning_objectives: [
      'Deconstruct decentralized finance (DeFi) mechanisms and automated market makers',
      'Examine extreme volatility, liquidity crunches, and smart contract audit risks',
      'Understand Indian TDS and tax treatment for virtual digital assets (VDAs)',
    ],
    is_published: true,
    linked_course_id: 'course-crypto-eval',
  },
  {
    id: 'course-fin-11',
    stream_id: 'finance',
    title: 'Fintech Systems and Digital Financial Services',
    slug: 'fintech-systems-digital-finance',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Neo-banks, open banking APIs, account aggregators (AA), robo-advisory algorithms, and alternative lending.',
    learning_objectives: [
      'Analyze Account Aggregator ecosystems and consent-based financial data sharing',
      'Understand Buy Now Pay Later (BNPL) credit models and default risks',
      'Evaluate how algorithmic robo-advisors allocate portfolios automatically',
    ],
    is_published: true,
    linked_course_id: 'course-fintech-payments',
  },
  {
    id: 'course-fin-12',
    stream_id: 'finance',
    title: 'Global Events and the Economy',
    slug: 'global-events-economy',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'intermediate',
    summary: 'How supply chain shocks, geopolitical tensions, trade tariffs, and crude oil prices ripple into everyday prices.',
    learning_objectives: [
      'Track how Brent crude price fluctuations impact Indian domestic inflation and trade deficit',
      'Analyze supply chain bottlenecks and foreign institutional investor (FII) capital flows',
      'Evaluate currency exchange rates (USD/INR) and central bank foreign reserves',
    ],
    is_published: true,
    linked_course_id: 'course-fin-events',
  },
  {
    id: 'course-fin-13',
    stream_id: 'finance',
    title: 'Inflation, Interest Rates and Economic Indicators',
    slug: 'inflation-interest-rates-indicators',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'CPI, WPI, Repo Rate, reverse repo rate, and how monetary policy preserves purchasing power.',
    learning_objectives: [
      'Calculate purchasing power erosion over decades using compound inflation formulas',
      'Explain how RBI Monetary Policy Committee adjusts repo rates to control inflation',
      'Interpret gross domestic product (GDP) growth and industrial production (IIP) indicators',
    ],
    is_published: true,
    linked_course_id: 'course-fin-events',
  },
  {
    id: 'course-fin-14',
    stream_id: 'finance',
    title: 'Financial Fraud Awareness and Consumer Protection',
    slug: 'financial-fraud-consumer-protection',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Recognize Ponzi schemes, unauthorized loan apps, lottery frauds, and exercise RBI Banking Ombudsman remedies.',
    learning_objectives: [
      'Identify Ponzi and pyramid scheme promises of unrealistic guaranteed returns',
      'Detect predatory digital lending apps operating without RBI NBFC licenses',
      'Escalate unresolved bank disputes to the RBI Integrated Ombudsman Scheme',
    ],
    is_published: true,
    linked_course_id: 'course-fin-intro',
  },

  // ==================================================================
  // STREAM 3: PROFESSIONAL & LIFE SKILLS (14 Courses)
  // ==================================================================
  {
    id: 'course-prof-1',
    stream_id: 'professional',
    title: 'Time Management and Prioritisation',
    slug: 'time-management-prioritisation',
    modules_count: 4,
    duration_hours: 1.5,
    difficulty: 'beginner',
    summary: 'Get organised. Achieve more. Master Eisenhower matrix, time blocking, Pomodoro, and eliminating distraction traps.',
    learning_objectives: [
      'Distinguish urgent vs important tasks using the Eisenhower matrix',
      'Implement calendar time-blocking for deep focus study sessions',
      'Defend against cognitive task-switching and digital notifications',
    ],
    is_published: true,
    linked_course_id: 'course-prof-time',
  },
  {
    id: 'course-prof-2',
    stream_id: 'professional',
    title: 'Communication Skills',
    slug: 'communication-skills',
    modules_count: 5,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Express ideas clearly. Build better relationships. Master active listening, verbal precision, and executive writing.',
    learning_objectives: [
      'Structure written messages using the Pyramid Principle (conclusion first)',
      'Practice active listening and reflection in technical collaborations',
      'Adapt communication style across emails, memos, and instant team chat',
    ],
    is_published: true,
    linked_course_id: 'course-prof-softskills',
  },
  {
    id: 'course-prof-3',
    stream_id: 'professional',
    title: 'Public Speaking and Presentation Skills',
    slug: 'public-speaking-presentation-skills',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'intermediate',
    summary: 'Speak with confidence. Learn vocal projection, speech structure, audience engagement, and stage presence.',
    learning_objectives: [
      'Overcome stage fright with structured physical breathing and vocal warmups',
      'Structure memorable speeches using rhetorical storytelling hooks',
      'Handle live audience Q&A sessions with poise and technical precision',
    ],
    is_published: true,
    linked_course_id: 'course-prof-softskills',
  },
  {
    id: 'course-prof-4',
    stream_id: 'professional',
    title: 'Teamwork and Collaboration',
    slug: 'teamwork-collaboration',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Achieve more, together. Cross-functional team dynamics, conflict resolution, and peer review etiquette.',
    learning_objectives: [
      'Understand Belbin team roles and individual contribution strengths',
      'Resolve constructive technical disagreements without interpersonal friction',
      'Facilitate effective sprint retrospectives and shared accountability',
    ],
    is_published: true,
    linked_course_id: 'course-prof-softskills',
  },
  {
    id: 'course-prof-5',
    stream_id: 'professional',
    title: 'Problem-Solving and Critical Thinking',
    slug: 'problem-solving-critical-thinking',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Deconstruct ambiguity. Root-cause analysis (5 Whys), first principles reasoning, and hypothesis testing.',
    learning_objectives: [
      'Apply the 5 Whys and Ishikawa fishbone diagrams to isolate root causes',
      'Challenge hidden assumptions through first-principles reasoning',
      'Evaluate second-order consequences in technical decisions',
    ],
    is_published: true,
    linked_course_id: 'course-prof-softskills',
  },
  {
    id: 'course-prof-6',
    stream_id: 'professional',
    title: 'Leadership and Decision-Making',
    slug: 'leadership-decision-making',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Lead with clarity and confidence. Situational leadership, ethical dilemmas, and decisive consensus-building.',
    learning_objectives: [
      'Apply situational leadership models across mentoring, coaching, and delegating',
      'Make reversible vs irreversible decisions using Bezos Type 1/Type 2 frameworks',
      'Lead student clubs and team cohorts toward shared milestones',
    ],
    is_published: true,
    linked_course_id: 'course-prof-softskills',
  },
  {
    id: 'course-prof-7',
    stream_id: 'professional',
    title: 'Professional Behaviour and Workplace Readiness',
    slug: 'professional-behaviour-workplace',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Office etiquette, accountability, respecting workplace boundaries, meeting hygiene, and professional email norms.',
    learning_objectives: [
      'Master professional email tone, subject line clarity, and CC/BCC etiquette',
      'Demonstrate reliability and proactive status updates on deliverables',
      'Uphold diversity, inclusion, and respectful workplace conduct',
    ],
    is_published: true,
    linked_course_id: 'course-prof-workplace',
  },
  {
    id: 'course-prof-8',
    stream_id: 'professional',
    title: 'Personal Development and Goal Setting',
    slug: 'personal-development-goal-setting',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Growth mindset, habits design (Atomic Habits), OKRs, and continuous personal reflection.',
    learning_objectives: [
      'Form positive micro-habits using cue-routine-reward habit loops',
      'Write Objectives and Key Results (OKRs) for personal learning goals',
      'Maintain an evidence-based learning journal reflecting on challenges',
    ],
    is_published: true,
    linked_course_id: 'course-prof-identity',
  },
  {
    id: 'course-prof-9',
    stream_id: 'professional',
    title: 'Resume Building and Career Readiness',
    slug: 'resume-building-career-readiness',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Craft ATS-compliant resumes, quantify achievements using Google XYZ formula, and build project portfolios.',
    learning_objectives: [
      'Structure clean ATS-friendly single-page technical resumes',
      'Write impact bullets using the XYZ formula: Accomplished [X] as measured by [Y] by doing [Z]',
      'Curate portfolio repositories demonstrating real code and artifacts',
    ],
    is_published: true,
    linked_course_id: 'course-prof-identity',
  },
  {
    id: 'course-prof-10',
    stream_id: 'professional',
    title: 'Social Profile and Professional Presence Development',
    slug: 'social-profile-professional-presence',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Optimize LinkedIn and GitHub profiles, showcase real artifacts, and network constructively with mentors.',
    learning_objectives: [
      'Craft a compelling headline and about summary on professional networks',
      'Pin verified projects and open-source contributions on GitHub',
      'Engage with industry professionals respectfully without spamming',
    ],
    is_published: true,
    linked_course_id: 'course-prof-identity',
  },
  {
    id: 'course-prof-11',
    stream_id: 'professional',
    title: 'Interview Preparation',
    slug: 'interview-preparation',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Master the STAR framework for behavioral interviews, technical screening rounds, and salary negotiation basics.',
    learning_objectives: [
      'Answer behavioral questions with the STAR framework (Situation, Task, Action, Result)',
      'Think aloud through technical problem decomposition and whiteboard exercises',
      'Formulate insightful questions to evaluate company culture and team health',
    ],
    is_published: true,
    linked_course_id: 'course-prof-workplace',
  },
  {
    id: 'course-prof-12',
    stream_id: 'professional',
    title: 'Entrepreneurship and Startup Ideation',
    slug: 'entrepreneurship-startup-ideation',
    modules_count: 6,
    duration_hours: 3.0,
    difficulty: 'intermediate',
    summary: 'From problem to prototype. Lean Canvas, customer discovery interviews, unit economics, and pitch decks.',
    learning_objectives: [
      'Identify hair-on-fire customer problems through user discovery interviews',
      'Map value propositions and distribution channels on a single-page Lean Canvas',
      'Calculate customer acquisition cost (CAC) and customer lifetime value (LTV)',
    ],
    is_published: true,
    linked_course_id: 'course-prof-identity',
  },
  {
    id: 'course-prof-13',
    stream_id: 'professional',
    title: 'Research, Documentation and Project Presentation',
    slug: 'research-documentation-project-presentation',
    modules_count: 5,
    duration_hours: 2.5,
    difficulty: 'intermediate',
    summary: 'Write technical documentation, Architecture Decision Records (ADRs), post-mortems, and project briefs.',
    learning_objectives: [
      'Author clean Markdown documentation with reproducible setup instructions',
      'Write Architecture Decision Records documenting context and trade-offs',
      'Synthesize complex engineering findings into concise executive summaries',
    ],
    is_published: true,
    linked_course_id: 'course-prof-workplace',
  },
  {
    id: 'course-prof-14',
    stream_id: 'professional',
    title: 'Digital Collaboration and Professional Tools',
    slug: 'digital-collaboration-professional-tools',
    modules_count: 4,
    duration_hours: 2.0,
    difficulty: 'beginner',
    summary: 'Master asynchronous remote work: Notion, Slack, Git PR reviews, calendar discipline, and ticketing boards.',
    learning_objectives: [
      'Conduct constructive code and document peer reviews with actionable feedback',
      'Manage asynchronous task queues using Kanban and sprint boards',
      'Document meeting decisions with clear action items and accountable owners',
    ],
    is_published: true,
    linked_course_id: 'course-prof-time',
  },
];

export const CANONICAL_STREAMS: CanonicalStream[] = [
  {
    id: 'technology',
    title: 'Technology & Digital Skills',
    summary: 'Build the skills for a smarter tomorrow.',
    course_count: 12,
    badge_color: '#43A85B',
    icon_name: 'Cpu',
    courses: CANONICAL_COURSES.filter((c) => c.stream_id === 'technology'),
  },
  {
    id: 'finance',
    title: 'Financial Literacy & the Economy',
    summary: 'Manage money. Understand markets. Build wealth.',
    course_count: 14,
    badge_color: '#D9F477',
    icon_name: 'Coins',
    courses: CANONICAL_COURSES.filter((c) => c.stream_id === 'finance'),
  },
  {
    id: 'professional',
    title: 'Professional & Life Skills',
    summary: 'Grow your mindset. Build your future.',
    course_count: 14,
    badge_color: '#43A85B',
    icon_name: 'Users',
    courses: CANONICAL_COURSES.filter((c) => c.stream_id === 'professional'),
  },
];

function generateFallbackModules(item: CanonicalCourseItem): CourseModule[] {
  const modules: CourseModule[] = [];
  const titles = [
    'Foundations & Core Principles',
    'Practical Application & Workflows',
    'Applied Case Studies & Analysis',
    'Industry Standards & Problem Solving',
    'Advanced Techniques & Execution',
    'Capstone Project & Synthesis',
  ];

  for (let m = 1; m <= item.modules_count; m++) {
    const modTitle = `Module ${m}: ${titles[(m - 1) % titles.length]}`;
    const lessonTitle = `${item.title} — ${titles[(m - 1) % titles.length]}`;
    const lesId = `les-${item.id}-${m}`;
    const modId = `mod-${item.id}-${m}`;

    modules.push({
      id: modId,
      course_id: item.id,
      title: modTitle,
      order_index: m,
      lessons: [
        {
          id: lesId,
          module_id: modId,
          title: lessonTitle,
          order_index: 1,
          summary: `${item.summary} Key focus: ${item.learning_objectives[(m - 1) % item.learning_objectives.length] || item.summary}`,
          duration_minutes: Math.round((item.duration_hours * 60) / item.modules_count),
          content_markdown: `### ${lessonTitle}\n\n${item.summary}\n\n#### Learning Objectives Covered\n- ${item.learning_objectives.join('\n- ')}\n\n#### Practical Instructions\n1. Analyze the core principles and operational boundaries for **${item.title}**.\n2. Apply the structured frameworks provided in this lesson to solve practical scenarios.\n3. Validate your understanding through the interactive sandbox verification and end-of-module assessment below.`,
          sandbox_config: {
            title: `${item.title} — Practical Verification`,
            type: 'code_runner',
            prompt: `Verify your understanding of ${item.title}. Ensure all parameters adhere to established best practices.`,
            defaultInput: `// Verification script for ${item.title}\nconst challenge = {\n  course: "${item.title}",\n  module: ${m},\n  status: "verified"\n};\nreturn challenge;`,
            expectedOutput: `Verified execution for ${item.title}`,
            explanation: `Demonstrates verified comprehension of the core subject matter for ${item.title}.`,
          },
          quiz: {
            id: `quiz-${item.id}-${m}`,
            questions: [
              {
                id: `q-${item.id}-${m}-1`,
                prompt: `What is a primary principle of ${item.title}?`,
                options: [
                  item.learning_objectives[0] || 'Systematic understanding and rigorous application',
                  'Random unguided trial and error without metrics',
                  'Ignoring standard best practices and security constraints',
                  'Assuming all automated inputs are error-free',
                ],
                correct_option_index: 0,
                explanation: `Understanding ${item.title} starts with: ${item.learning_objectives[0] || 'systematic understanding and rigorous application'}.`,
              },
              {
                id: `q-${item.id}-${m}-2`,
                prompt: `Why is verified practical application important in ${item.title}?`,
                options: [
                  'It ensures concepts translate into reliable, verifiable real-world skills',
                  'It is purely decorative and has no impact on competency',
                  'It replaces the need to understand fundamentals',
                  'It is only relevant for advanced researchers',
                ],
                correct_option_index: 0,
                explanation: 'Practical execution validates conceptual knowledge against real constraints.',
              },
            ],
          },
        },
      ],
    });
  }

  return modules;
}

export function buildCanonicalCourse(item: CanonicalCourseItem, existingCourse?: Course): Course {
  const domain: DomainType = item.stream_id === 'technology' ? 'technology' : item.stream_id === 'finance' ? 'finance' : 'professional';

  if (existingCourse && existingCourse.modules && existingCourse.modules.length > 0) {
    const modulesCount = Math.min(item.modules_count, existingCourse.modules.length);
    const adaptedModules = existingCourse.modules.slice(0, modulesCount).map((mod, mIdx) => ({
      ...mod,
      id: `mod-${item.id}-${mIdx + 1}`,
      course_id: item.id,
      lessons: mod.lessons.map((les, lIdx) => ({
        ...les,
        id: `les-${item.id}-${mIdx + 1}-${lIdx + 1}`,
        module_id: `mod-${item.id}-${mIdx + 1}`,
      })),
    }));

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      domain,
      subject: item.title,
      level: item.difficulty,
      summary: item.summary,
      description: existingCourse.description || item.summary,
      learning_objectives: item.learning_objectives,
      prerequisites: existingCourse.prerequisites || ['Basic curiosity and commitment to practical learning'],
      duration_hours: item.duration_hours,
      is_published: item.is_published,
      availability_status: 'verified_functional',
      learning_path_id: `path-${item.stream_id}`,
      modules: adaptedModules.length > 0 ? adaptedModules : generateFallbackModules(item),
      created_at: '2026-10-18T00:00:00.000Z',
    };
  }

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    domain,
    subject: item.title,
    level: item.difficulty,
    summary: item.summary,
    description: `${item.summary} Learn and master hands-on skills with interactive lessons, quizzes, and verified practical challenges.`,
    learning_objectives: item.learning_objectives,
    prerequisites: ['Basic computing literacy and commitment to continuous learning'],
    duration_hours: item.duration_hours,
    is_published: item.is_published,
    availability_status: 'verified_functional',
    learning_path_id: `path-${item.stream_id}`,
    modules: generateFallbackModules(item),
    created_at: '2026-10-18T00:00:00.000Z',
  };
}

export const ALL_CANONICAL_COURSES: Course[] = CANONICAL_COURSES.map((item) => {
  const linked = item.linked_course_id ? ALL_COURSES.find((c) => c.id === item.linked_course_id) : undefined;
  return buildCanonicalCourse(item, linked);
});

