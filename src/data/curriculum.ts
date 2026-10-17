// ====================================================================
// Geniusphere — Complete 26-Subject Curriculum & Course Catalog Seed
// Technology, Finance, and Professional Skills Foundation
// ====================================================================

import { Course, LearningPath } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-cyber-defense',
    title: 'Cybersecurity & Web Defense',
    slug: 'cybersecurity-defense',
    domain: 'cybersecurity',
    description: 'Master application defense, defensive parameterization, cryptography, and secure architecture from first principles.',
    target_audience: 'Students, independent learners, and developers building secure systems',
    prerequisites: ['Basic computing literacy'],
    course_ids: ['course-web-sec', 'course-cyber-fund', 'course-privacy-footprint'],
  },
  {
    id: 'path-ai-tech',
    title: 'AI & Responsible Technology',
    slug: 'ai-responsible-technology',
    domain: 'technology',
    description: 'Understand how modern machine learning models function, their systemic limitations, ethical safety, and practical automation tools.',
    target_audience: 'High school and college learners navigating artificial intelligence',
    prerequisites: ['Foundational logic'],
    course_ids: ['course-ai-fund', 'course-ai-resp'],
  },
  {
    id: 'path-programming-foundations',
    title: 'Programming & Computing Foundations',
    slug: 'programming-foundations',
    domain: 'technology',
    description: 'Learn computational thinking, variables, algorithmic loops, relational data modeling, and practical software engineering.',
    target_audience: 'Aspiring computer science and engineering students',
    prerequisites: ['None'],
    course_ids: ['course-prog-fund', 'course-data-loops', 'course-db-sql', 'course-comp-systems'],
  },
  {
    id: 'path-financial-literacy',
    title: 'Finance & Financial Literacy',
    slug: 'finance-literacy',
    domain: 'finance',
    description: 'Build grounded financial literacy covering central banking, markets, fintech, digital payments, and risk management.',
    target_audience: 'Learners preparing for financial independence and career economics',
    prerequisites: ['Basic arithmetic'],
    course_ids: ['course-fin-intro', 'course-fin-markets', 'course-fintech-payments', 'course-crypto-eval'],
  },
  {
    id: 'path-professional-identity',
    title: 'Digital Productivity & Professional Identity',
    slug: 'professional-identity',
    domain: 'professional',
    description: 'Develop strong workplace communication, high-performance time management, technical resume crafting, and portfolio evidence.',
    target_audience: 'Students preparing for internships, college admissions, and careers',
    prerequisites: ['None'],
    course_ids: ['course-prof-time', 'course-prof-comm', 'course-prof-portfolio', 'course-resume-prep'],
  },
];

export const ALL_COURSES: Course[] = [
  // ==================================================================
  // DOMAIN 1: TECHNOLOGY & COMPUTING (12 SUBJECTS)
  // ==================================================================
  {
    id: 'course-web-sec',
    title: 'Web Application Defense Fundamentals',
    slug: 'web-defense-101',
    domain: 'cybersecurity',
    subject: 'Web Technologies and Web Application Security',
    level: 'foundational' as any,
    summary: 'Understand web architecture vulnerabilities, SQL injection attack vectors, and authoritative parameter binding defenses.',
    description: 'This flagship course explores web application security by analyzing how untrusted inputs alter database query execution trees. Students learn the distinction between vulnerable string interpolation and native prepared statements through hands-on laboratory exercises.',
    learning_objectives: [
      'Analyze how HTTP requests pass data to backend database drivers',
      'Identify classic SQL injection syntax modification patterns',
      'Write safe parameterized queries using positional parameter placeholders (?)',
      'Defeat SQL injection attacks using SQLite parameter binding in an isolated sandbox',
    ],
    prerequisites: ['Basic understanding of web browsers and relational tables'],
    duration_hours: 6,
    is_published: true,
    learning_path_id: 'path-cyber-defense',
    created_at: new Date('2026-09-01').toISOString(),
    modules: [
      {
        id: 'mod-sec-1',
        course_id: 'course-web-sec',
        title: 'Module 1: Injection Anatomy & Threat Modeling',
        order_index: 1,
        lessons: [
          {
            id: 'les-sec-101',
            module_id: 'mod-sec-1',
            title: 'Lesson 1: The Boundary Between Data and Code',
            order_index: 1,
            summary: 'Why string concatenation creates dangerous ambiguity in interpreted languages and relational engines.',
            duration_minutes: 20,
            content_markdown: `### The Core Vulnerability: Mixing Code and Data

In computer security, almost every injection vulnerability stems from a single fundamental flaw: **treating untrusted input as executable instruction syntax rather than literal data**.

When a software developer concatenates an untrusted input string into an SQL query string:

\`\`\`python
# Vulnerable pattern
user_query = f"SELECT * FROM users WHERE username = '{user_input}' AND account_status = 'active'"
\`\`\`

The relational database engine has no intrinsic way of knowing where the programmer's instructions end and the user's data begins. If an adversary submits:

\`\`\`sql
' OR '1'='1
\`\`\`

The query string is transformed into:

\`\`\`sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND account_status = 'active'
\`\`\`

Because \`'1'='1'\` evaluates to true for every single row in the table, the database returns all user records, bypassing authentication entirely!

#### The Defense: Parameterized Prepared Statements
When using **parameter binding**, the database driver separates query compilation from data binding:
1. The SQL query template (\`SELECT id, username, role FROM challenge_users WHERE username = ? AND account_status = 'active'\`) is compiled into an execution bytecode plan **first**.
2. The user's input is bound to the placeholder slot as a **scalar literal string value**.
3. Even if the user enters \`' OR '1'='1\`, SQLite treats the entire string as a literal username value to search for, rather than altering the relational logic.`,
            quiz: {
              id: 'quiz-sec-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Why does parameterized query execution defeat SQL injection?',
                  options: [
                    'It escapes single quotes by doubling them up before query execution',
                    'The SQL statement is compiled into bytecode before input values are bound to parameter slots',
                    'It converts the SQL database into an encrypted key-value store',
                    'It blocks all users whose names contain special characters',
                  ],
                  correct_option_index: 1,
                  explanation: 'Prepared statements compile the SQL command structure into an execution plan first, ensuring untrusted input is treated exclusively as literal scalar data.',
                },
                {
                  id: 'q2',
                  prompt: 'In SQL parameterization, what character is typically used as a positional placeholder in SQLite?',
                  options: ['#', '$', '?', '%'],
                  correct_option_index: 2,
                  explanation: 'SQLite uses the question mark (?) as the standard positional parameter placeholder.',
                },
              ],
            },
          },
          {
            id: 'les-sec-102',
            module_id: 'mod-sec-1',
            title: 'Lesson 2: Interactive Parameterization Lab',
            order_index: 2,
            summary: 'Defeat SQL injection by implementing native parameter placeholders and testing against 5 attack payloads.',
            duration_minutes: 30,
            content_markdown: `### Hands-On Challenge: SQL Parameterization & Injection Defense

You have arrived at the interactive laboratory. In this exercise, you must defeat an authentication bypass attempt on the \`challenge_users\` table.

#### Challenge Specifications:
- Select only the required columns: \`id, username, role\`
- Target table: \`challenge_users\`
- Filter condition: \`username = ?\`
- Security constraint: Ensure only active accounts are queried using \`account_status = 'active'\`

Launch the interactive laboratory below to test your query in the local SQLite-WASM sandbox and submit it for authoritative grading.`,
            linked_lab_id: 'lab-sec-101',
          },
        ],
      },
    ],
  },
  {
    id: 'course-ai-resp',
    title: 'Responsible AI, Limits & Ethical Verification',
    slug: 'responsible-ai-ethics',
    domain: 'technology',
    subject: 'Responsible AI, limitations, privacy, and practical AI tools',
    level: 'intermediate',
    summary: 'Explore neural network limitations, hallucinations, training biases, and techniques for responsible verification of AI outputs.',
    description: 'This course provides students with a foundational understanding of how large language models and generative AI systems function. Rather than viewing AI as infallible intelligence, students learn the probabilistic nature of token generation, copyright considerations, privacy leakage, and rigorous fact-verification techniques.',
    learning_objectives: [
      'Understand probabilistic token prediction vs deterministic reasoning',
      'Detect automated hallucinations and algorithmic bias',
      'Protect personal and institutional privacy when interacting with AI systems',
      'Implement structured verification workflows for AI-generated code and content',
    ],
    prerequisites: ['Basic computing literacy'],
    duration_hours: 5,
    is_published: true,
    learning_path_id: 'path-ai-tech',
    created_at: new Date('2026-09-10').toISOString(),
    modules: [
      {
        id: 'mod-ai-1',
        course_id: 'course-ai-resp',
        title: 'Module 1: The Anatomy of Generative Models',
        order_index: 1,
        lessons: [
          {
            id: 'les-ai-101',
            module_id: 'mod-ai-1',
            title: 'Lesson 1: Probabilistic Next-Token Prediction',
            order_index: 1,
            summary: 'Why AI models sound confident even when stating complete falsehoods.',
            duration_minutes: 25,
            content_markdown: `### Understanding the Stochastic Nature of AI

Large language models (LLMs) do not possess consciousness, intent, or a verified ground-truth database. They are sophisticated statistical prediction engines trained to calculate the most plausible next token given a preceding context window.

#### What Causes Hallucinations?
Because language models optimize for plausibility rather than truth, they can assemble grammatically flawless, highly persuasive explanations that are completely fabricated. When an AI generates a fake legal citation or a non-existent software API, it is simply matching grammatical patterns.

#### Rule of Responsible AI:
*Never treat an LLM as an authoritative oracle. Always treat AI output as an unverified draft requiring independent verification.*`,
            quiz: {
              id: 'quiz-ai-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What primary task are autoregressive large language models trained to perform?',
                  options: [
                    'Searching verified academic databases for true facts',
                    'Predicting the most statistically probable next token given context',
                    'Executing code securely on server clusters',
                    'Proving mathematical theorems through symbolic logic',
                  ],
                  correct_option_index: 1,
                  explanation: 'LLMs are statistical engines trained to minimize cross-entropy loss by predicting the next token in a sequence.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'course-ai-fund',
    title: 'Artificial Intelligence Fundamentals',
    slug: 'ai-fundamentals',
    domain: 'technology',
    subject: 'Artificial Intelligence Fundamentals',
    level: 'beginner',
    summary: 'Core concepts of machine learning, classification, neural networks, and computer vision.',
    description: 'An accessible introduction to how computers learn patterns from data, distinguishing traditional algorithmic programming from statistical learning systems.',
    learning_objectives: ['Differentiate supervised and unsupervised learning', 'Understand feature vectors', 'Evaluate model accuracy and precision'],
    prerequisites: ['Basic high school mathematics'],
    duration_hours: 8,
    is_published: false,
    learning_path_id: 'path-ai-tech',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-blockchain-fund',
    title: 'Blockchain & Distributed Ledgers',
    slug: 'blockchain-fundamentals',
    domain: 'technology',
    subject: 'Blockchain Fundamentals',
    level: 'intermediate',
    summary: 'Cryptographic hashing, consensus algorithms, peer-to-peer networks, and smart contracts.',
    description: 'Technical evaluation of blockchain systems without speculative hype. Covers Merkle trees, Byzantine fault tolerance, public vs private chains, and energy footprints.',
    learning_objectives: ['Compute SHA-256 block hashes', 'Analyze proof-of-work vs proof-of-stake consensus', 'Audit basic smart contract logic'],
    prerequisites: ['Foundational computing'],
    duration_hours: 6,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-iot-smart',
    title: 'Internet of Things (IoT) & Embedded Computing',
    slug: 'iot-embedded-computing',
    domain: 'technology',
    subject: 'Internet of Things (IoT)',
    level: 'intermediate',
    summary: 'Microcontrollers, sensor telemetry, edge processing, and IoT network security.',
    description: 'Practical exploration of physical computing using ESP32, Arduino, and Raspberry Pi platforms, covering MQTT protocols and device hardening.',
    learning_objectives: ['Read analog and digital sensor telemetry', 'Publish telemetry over MQTT', 'Secure microcontroller firmware'],
    prerequisites: ['Basic electronics and programming'],
    duration_hours: 10,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-msft-productivity',
    title: 'Microsoft Technologies & Cloud Infrastructure',
    slug: 'microsoft-technologies-productivity',
    domain: 'technology',
    subject: 'Microsoft Technologies and Productivity Tools',
    level: 'beginner',
    summary: 'Azure cloud primitives, Active Directory identity architectures, and advanced Excel modeling.',
    description: 'Comprehensive orientation for modern enterprise computing environments, covering role-based access in Microsoft Entra, Azure cloud storage, and automation.',
    learning_objectives: ['Configure cloud identity roles', 'Model complex data in modern Excel', 'Deploy serverless compute functions in Azure'],
    prerequisites: ['General computing'],
    duration_hours: 8,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-privacy-footprint',
    title: 'Digital Privacy, Footprints & Online Safety',
    slug: 'digital-privacy-footprints',
    domain: 'technology',
    subject: 'Digital Privacy and Digital Footprints',
    level: 'beginner',
    summary: 'Protect personal data, understand ad-tracking surveillance, and minimize online footprints.',
    description: 'Vital knowledge for students and young professionals navigating online tracking, data brokers, telemetry collection, and Indian DPDP Act 2023 protections.',
    learning_objectives: ['Inspect browser cookies and tracking beacons', 'Configure multi-factor authentication', 'Exercise statutory data erasure rights'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    learning_path_id: 'path-cyber-defense',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-cyber-fund',
    title: 'Cybersecurity Fundamentals & Defense Principles',
    slug: 'cybersecurity-fundamentals',
    domain: 'cybersecurity',
    subject: 'Cybersecurity Fundamentals',
    level: 'beginner',
    summary: 'The CIA triad, threat vectors, network architecture defense, and social engineering countermeasures.',
    description: 'Comprehensive foundational cybersecurity training covering perimeter defense, least privilege, cryptographic hashing, and incident response.',
    learning_objectives: ['Explain Confidentiality, Integrity, and Availability', 'Identify phishing and credential stuffing', 'Implement defense-in-depth'],
    prerequisites: ['Basic computing'],
    duration_hours: 7,
    is_published: false,
    learning_path_id: 'path-cyber-defense',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-prog-fund',
    title: 'Programming Fundamentals & Algorithmic Logic',
    slug: 'programming-fundamentals',
    domain: 'technology',
    subject: 'Programming Fundamentals',
    level: 'beginner',
    summary: 'Variables, functional decomposition, control flow, and computational problem solving.',
    description: 'The definitive on-ramp to software development. Teaches learners how to break down complex problems into clear, executable algorithms.',
    learning_objectives: ['Decompose problems into algorithmic steps', 'Write functions with explicit parameters and return values', 'Trace code execution mentally'],
    prerequisites: ['None'],
    duration_hours: 10,
    is_published: false,
    learning_path_id: 'path-programming-foundations',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-data-loops',
    title: 'Data Structures, Conditions & Iterative Loops',
    slug: 'data-structures-conditions-loops',
    domain: 'technology',
    subject: 'Data Types, Variables, Conditions, and Loops',
    level: 'beginner',
    summary: 'Deep dive into arrays, dictionaries, nested loops, conditional branching, and memory allocation.',
    description: 'Master the fundamental building blocks of program execution. Understand algorithmic time complexity (Big-O) and data structure trade-offs.',
    learning_objectives: ['Construct and manipulate multi-dimensional arrays', 'Optimize nested loops', 'Prevent memory leaks and infinite loops'],
    prerequisites: ['Programming Fundamentals'],
    duration_hours: 8,
    is_published: false,
    learning_path_id: 'path-programming-foundations',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-db-sql',
    title: 'Databases, Relational Modeling & Authoritative SQL',
    slug: 'databases-relational-modeling-sql',
    domain: 'technology',
    subject: 'Databases and SQL',
    level: 'intermediate',
    summary: 'Relational database schema design, ACID transactions, foreign key constraints, and SQL queries.',
    description: 'Learn the architectural backbone of modern applications. Covers schema normalization (3NF), B-tree indexing strategies, joins, and database triggers.',
    learning_objectives: ['Design normalized relational schemas', 'Write complex multi-table JOINs and aggregations', 'Enforce integrity triggers'],
    prerequisites: ['Programming Fundamentals'],
    duration_hours: 10,
    is_published: false,
    learning_path_id: 'path-programming-foundations',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-comp-systems',
    title: 'Computing Fundamentals & Systems Architecture',
    slug: 'computing-systems-problem-solving',
    domain: 'technology',
    subject: 'Computing Fundamentals and Problem Solving',
    level: 'beginner',
    summary: 'Binary arithmetic, CPU registers, memory hierarchies, operating system processes, and network sockets.',
    description: 'Demystify how computer hardware translates software instructions into physical state changes. Essential engineering foundation.',
    learning_objectives: ['Trace CPU instruction fetch-decode-execute cycles', 'Understand virtual memory and paging', 'Analyze TCP/IP network packets'],
    prerequisites: ['None'],
    duration_hours: 8,
    is_published: false,
    learning_path_id: 'path-programming-foundations',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },

  // ==================================================================
  // DOMAIN 2: FINANCE & FINANCIAL LITERACY (7 SUBJECTS)
  // ==================================================================
  {
    id: 'course-fin-intro',
    title: 'Introduction to Personal & Institutional Finance',
    slug: 'intro-finance-systems',
    domain: 'finance',
    subject: 'Introduction to Finance',
    level: 'beginner',
    summary: 'Budgeting, compound growth, risk-return trade-offs, and economic fundamentals.',
    description: 'Grounding financial education for students. Understand the mechanics of compound interest, emergency reserves, tax fundamentals, and inflation erosion.',
    learning_objectives: ['Calculate compound interest trajectories', 'Build realistic budgeting frameworks', 'Evaluate risk-adjusted returns'],
    prerequisites: ['Basic arithmetic'],
    duration_hours: 5,
    is_published: true,
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-12').toISOString(),
    modules: [
      {
        id: 'mod-fin-1',
        course_id: 'course-fin-intro',
        title: 'Module 1: The Mathematics of Money',
        order_index: 1,
        lessons: [
          {
            id: 'les-fin-101',
            module_id: 'mod-fin-1',
            title: 'Lesson 1: Compound Interest & Inflation Realities',
            order_index: 1,
            summary: 'How time horizon exponentially impacts wealth accumulation and why cash in a savings account loses purchasing power.',
            duration_minutes: 20,
            content_markdown: `### The Power of Compound Returns

Albert Einstein famously described compound interest as the eighth wonder of the world. Compound growth occurs when the earnings generated on an initial principal sum are reinvested, generating further earnings of their own.

#### The Mathematical Formula:
$$A = P(1 + r/n)^{nt}$$
Where:
- $P$ = Initial principal balance
- $r$ = Annual interest rate
- $n$ = Number of compounding intervals per year
- $t$ = Number of years invested

#### The Real Enemy: Inflation
If your savings account yields 3.5% per annum while core consumer price inflation runs at 6.0%, your money is **losing 2.5% in real purchasing power each year**. Understanding this baseline is essential to evaluating investments responsibly.`,
            quiz: {
              id: 'quiz-fin-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'If your savings return is 4% but inflation is 6%, what happens to your purchasing power?',
                  options: [
                    'It grows by 2% per year',
                    'It remains completely constant',
                    'It decreases by approximately 2% in real purchasing power',
                    'It doubles every 12 years',
                  ],
                  correct_option_index: 2,
                  explanation: 'Real return equals nominal return minus inflation. 4% - 6% = -2% real purchasing power loss.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-global',
    title: 'Global Economic Events & Financial Systemic Effects',
    slug: 'global-events-financial-effects',
    domain: 'finance',
    subject: 'Global Events and Their Financial Effects',
    level: 'intermediate',
    summary: 'How geopolitical shifts, supply shocks, central bank interest rate cycles, and trade pacts ripple across markets.',
    description: 'Learn to read macroeconomic indicators, understanding how foreign exchange currency fluctuations, oil prices, and monetary policy decisions affect everyday life.',
    learning_objectives: ['Track central bank interest rate decisions', 'Analyze balance of trade and currency depreciation', 'Understand global supply chain shocks'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 6,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-fin-markets',
    title: 'Financial Markets, Capital Allocation & Instruments',
    slug: 'financial-markets-capital-instruments',
    domain: 'finance',
    subject: 'Financial Markets',
    level: 'intermediate',
    summary: 'Debt markets, equity markets, derivatives, liquidity, and capital formation mechanics.',
    description: 'Examines the mechanisms through which public corporations and governments raise capital. Demystifies bond yields, stock exchanges, and market liquidity.',
    learning_objectives: ['Distinguish primary and secondary markets', 'Analyze bond yields and price inverses', 'Evaluate market capitalization and liquidity'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 8,
    is_published: false,
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-fin-institutions',
    title: 'Financial Institutions, Central Banking & Monetary Policy',
    slug: 'financial-institutions-central-banks',
    domain: 'finance',
    subject: 'Financial Institutions',
    level: 'intermediate',
    summary: 'Commercial banking, reserve ratios, RBI regulatory frameworks, and systemic liquidity.',
    description: 'How commercial banks create credit, fractional reserve mechanisms, deposit insurance, and how the Reserve Bank of India manages price stability and growth.',
    learning_objectives: ['Explain credit creation in commercial banks', 'Understand repo and reverse repo rate transmission', 'Evaluate NBFC and banking balance sheets'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 6,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-crypto-eval',
    title: 'Cryptocurrency, Digital Assets & Systemic Risk Evaluation',
    slug: 'cryptocurrency-risks-evaluation',
    domain: 'finance',
    subject: 'Cryptocurrency Fundamentals, Risks, and Responsible Awareness',
    level: 'intermediate',
    summary: 'Objective analysis of digital assets, volatility risks, smart contract vulnerabilities, and regulatory reality.',
    description: 'A strictly educational, risk-aware exploration of cryptocurrencies. Dissects speculative bubbles, stablecoin architectures, exchange insolvency risks, and taxation without promotional claims.',
    learning_objectives: ['Analyze historical volatility and liquidation spirals', 'Audit custodial vs non-custodial risk profiles', 'Understand anti-money laundering and tax compliance'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 5,
    is_published: false,
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-stocks-fund',
    title: 'Stock Market Fundamentals & Valuation Principles',
    slug: 'stock-market-fundamentals-valuation',
    domain: 'finance',
    subject: 'Stock Market Fundamentals',
    level: 'intermediate',
    summary: 'Reading corporate balance sheets, P/E ratios, cash flows, and index fund investing.',
    description: 'Demystifies publicly listed equity ownership. Focuses on fundamental company valuation, discounted cash flow concepts, diversification, and long-term index investing.',
    learning_objectives: ['Read an income statement and balance sheet', 'Calculate P/E, Debt-to-Equity, and Free Cash Flow', 'Understand market diversification'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 7,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-fintech-payments',
    title: 'FinTech, Open Banking & UPI Digital Payment Systems',
    slug: 'fintech-digital-payments-upi',
    domain: 'finance',
    subject: 'FinTech and Digital Payments',
    level: 'foundational' as any,
    summary: 'The architecture of India Stack, NPCI, UPI protocol rails, payment gateways, and fraud prevention.',
    description: 'Learn how modern digital payment rails work under the hood. Explores payment switches, real-time settlement, two-factor authentication, and payment tokenization.',
    learning_objectives: ['Map out a UPI transaction from client app to settlement bank', 'Analyze payment gateway security and PCI-DSS requirements', 'Identify digital payment phishing vectors'],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: false,
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },

  // ==================================================================
  // DOMAIN 3: PROFESSIONAL & CAREER SKILLS (7 SUBJECTS)
  // ==================================================================
  {
    id: 'course-prof-time',
    title: 'Time Management, Focus & High-Performance Habits',
    slug: 'time-management-focus-habits',
    domain: 'professional',
    subject: 'Time Management',
    level: 'beginner',
    summary: 'Time-blocking, deep work principles, prioritization matrices, and digital distraction defense.',
    description: 'Master personal productivity without burnout. Covers the Eisenhower matrix, Pomodoro techniques, circadian energy management, and resisting algorithmic distractions.',
    learning_objectives: ['Construct priority-based weekly time blocks', 'Implement deep work protocols', 'Conduct daily and weekly productivity reviews'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-prof-skills',
    title: 'Workplace Professionalism & Business Execution',
    slug: 'workplace-professionalism-skills',
    domain: 'professional',
    subject: 'Professional Skills',
    level: 'beginner',
    summary: 'Meeting etiquette, asynchronous project management, stakeholder accountability, and workplace ethics.',
    description: 'Bridge the transition between academic settings and corporate environments. Learn how projects are executed, monitored, and reported in modern organizations.',
    learning_objectives: ['Structure professional asynchronous status updates', 'Manage project timelines using Kanban', 'Navigate workplace accountability'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-soft-skills',
    title: 'Soft Skills Development & Emotional Intelligence',
    slug: 'soft-skills-emotional-intelligence',
    domain: 'professional',
    subject: 'Soft Skills Development',
    level: 'beginner',
    summary: 'Active listening, empathy, conflict resolution, receiving feedback, and emotional regulation.',
    description: 'Develop the interpersonal competencies that distinguish top performers. Learn to navigate difficult feedback constructively and adapt to team dynamics.',
    learning_objectives: ['Practice non-defensive responses to critical feedback', 'Navigate team friction productively', 'Read interpersonal communication cues'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-prof-comm',
    title: 'Technical Communication & Team Collaboration',
    slug: 'communication-collaboration-skills',
    domain: 'professional',
    subject: 'Communication and Collaboration',
    level: 'beginner',
    summary: 'Clear technical writing, executive summaries, cross-functional collaboration, and presentation.',
    description: 'Learn to articulate complex technical ideas clearly to non-technical stakeholders. Covers writing design documentation, peer code review etiquette, and public speaking.',
    learning_objectives: ['Draft a structured Technical Design Document', 'Conduct respectful and actionable peer reviews', 'Deliver concise presentations'],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: false,
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-prof-identity',
    title: 'Professional Identity, Social Profiles & Digital Reputation',
    slug: 'professional-identity-social-profiles',
    domain: 'professional',
    subject: 'Professional Identity and Social Profiles',
    level: 'beginner',
    summary: 'Curating authentic online professional presence, LinkedIn optimization, and open-source contribution visibility.',
    description: 'Build a trustworthy, professional online footprint that communicates your capabilities to recruiters and academic admissions officers responsibly.',
    learning_objectives: ['Audit personal public search footprints', 'Format a professional GitHub and LinkedIn profile', 'Engage constructively in technical communities'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
  {
    id: 'course-prof-portfolio',
    title: 'Evidence-Backed Skill Portfolio Building',
    slug: 'portfolio-project-building',
    domain: 'professional',
    subject: 'Portfolio Building',
    level: 'foundational' as any,
    summary: 'Turning completed coursework, labs, and side projects into verifiable proof of practical capability.',
    description: 'In modern technology and business, proof of work beats credential claims. Learn how to package project code, system architecture diagrams, and test results into a compelling portfolio.',
    learning_objectives: [
      'Structure GitHub READMEs with architecture diagrams and reproduction steps',
      'Document trade-offs and engineering decisions in case studies',
      'Link verified Geniusphere lab achievements to personal portfolio sites',
    ],
    prerequisites: ['Completion of at least one interactive lab or project'],
    duration_hours: 4,
    is_published: true,
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-14').toISOString(),
    modules: [
      {
        id: 'mod-port-1',
        course_id: 'course-prof-portfolio',
        title: 'Module 1: The Proof-of-Work Mindset',
        order_index: 1,
        lessons: [
          {
            id: 'les-port-101',
            module_id: 'mod-port-1',
            title: 'Lesson 1: Transforming Projects into Verifiable Evidence',
            order_index: 1,
            summary: 'Why generic tutorial clones fail to impress and how authentic problem-solving stands out.',
            duration_minutes: 20,
            content_markdown: `### Proof of Work: The Currency of Modern Hiring

Hiring managers and university admissions committees are overwhelmed by generic resumes listing superficial keywords. The learners who stand out are those who can provide **verifiable evidence** of their skills.

#### The 3 Pillars of a Great Project Case Study:
1. **The Concrete Problem:** What real-world constraint or threat were you addressing?
2. **The Architecture Decisions & Trade-offs:** Why did you choose SQLite over PostgreSQL for local sandboxing? Why parameterization over regex sanitization?
3. **The Proof of Verification:** Include automated test runs, anti-tamper hashes, and measurable performance benchmarks.`,
            quiz: {
              id: 'quiz-port-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What makes a technical project portfolio compelling to recruiters?',
                  options: [
                    'Including 20 identical tutorial follow-along repositories',
                    'Demonstrating clear problem-solving, trade-off decisions, and automated test verification',
                    'Using high-contrast colorful graphics without explaining code',
                    'Listing every programming language ever created as an expert skill',
                  ],
                  correct_option_index: 1,
                  explanation: 'Recruiters and senior engineers value authentic problem-solving, architectural rationale, and automated verification evidence.',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'course-resume-prep',
    title: 'Technical Resume Engineering & Interview Preparation',
    slug: 'resume-career-preparation',
    domain: 'professional',
    subject: 'Resume and Career Preparation',
    level: 'beginner',
    summary: 'Crafting ATS-friendly resumes, behavioral STAR responses, technical problem walk-throughs, and salary basics.',
    description: 'Learn the principles of technical resume engineering. Avoid common buzzword traps, quantify engineering impact, and prepare for structured technical interviews.',
    learning_objectives: ['Format ATS-friendly one-page technical resumes', 'Structure interview answers using the STAR method', 'Walk through live code clearly'],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: false,
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [],
  },
];
