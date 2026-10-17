// ====================================================================
// Geniusphere — Strictly Scoped Curriculum & Course Catalogue Seed
// Exactly 4 Learning Categories Authorized:
// 1. Technology (8 Subjects)
// 2. Coding & Programming (7 Subjects)
// 3. Finance (7 Subjects)
// 4. Professional Skills (5 Subjects)
// Total: Exactly 27 Curricular Subjects
// Zero Unrequested Business, Sales, Marketing, or Entrepreneurship
// All 27 Courses contain substantive modules, lessons, and learning criteria
// ====================================================================

import { Course, LearningPath } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-tech-cyber',
    title: 'Technology & Cybersecurity Defense',
    slug: 'tech-cyber-defense',
    domain: 'technology',
    description: 'Master application defense, defensive parameterization, IoT, blockchain, and computing architecture.',
    target_audience: 'Students, independent learners, and defenders building secure systems',
    prerequisites: ['Basic computing literacy'],
    course_ids: ['course-web-sec', 'course-ai-fund', 'course-privacy-footprint', 'course-comp-fund'],
  },
  {
    id: 'path-coding',
    title: 'Coding, Algorithms & Databases',
    slug: 'coding-programming',
    domain: 'coding',
    description: 'Learn computational logic, algorithmic loops, relational SQL databases, web development, and debugging.',
    target_audience: 'Aspiring software engineers and technical problem solvers',
    prerequisites: ['None'],
    course_ids: ['course-prog-fund', 'course-prog-variables-loops', 'course-prog-db-sql', 'course-prog-exercises'],
  },
  {
    id: 'path-ai-tech',
    title: 'AI & Responsible Technology',
    slug: 'ai-responsible-technology',
    domain: 'technology',
    description: 'Understand how modern machine learning models function, their systemic limitations, ethical safety, and practical tools.',
    target_audience: 'Learners navigating artificial intelligence tools and ethics',
    prerequisites: ['Foundational logic'],
    course_ids: ['course-ai-fund', 'course-ai-resp'],
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
    title: 'Professional Skills & Portfolio Building',
    slug: 'professional-identity',
    domain: 'professional',
    description: 'Develop high-performance time management, workplace soft skills, social identity, and evidence-backed portfolios.',
    target_audience: 'Students preparing for internships, college admissions, and careers',
    prerequisites: ['None'],
    course_ids: ['course-prof-time', 'course-prof-workplace', 'course-prof-portfolio'],
  },
];

export const ALL_COURSES: Course[] = [
  // ==================================================================
  // CATEGORY 1: TECHNOLOGY (8 SUBJECTS)
  // ==================================================================
  {
    id: 'course-web-sec',
    title: 'Web Application Defense Fundamentals',
    slug: 'web-defense-101',
    domain: 'technology',
    subject: 'Cybersecurity and defensive web security',
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
    availability_status: 'verified_functional',
    learning_path_id: 'path-tech-cyber',
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
        ],
      },
      {
        id: 'mod-sec-2',
        course_id: 'course-web-sec',
        title: 'Module 2: Defensive Parameterization & Lab Execution',
        order_index: 2,
        lessons: [
          {
            id: 'les-sec-102',
            module_id: 'mod-sec-2',
            title: 'Lesson 2: Interactive Parameterization Lab',
            order_index: 1,
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
    subject: 'Responsible AI',
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
    availability_status: 'implemented_in_build',
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
      {
        id: 'mod-ai-2',
        course_id: 'course-ai-resp',
        title: 'Module 2: Ethical Verification & Bias Mitigation',
        order_index: 2,
        lessons: [
          {
            id: 'les-ai-102',
            module_id: 'mod-ai-2',
            title: 'Lesson 2: Systematic Output Auditing & Privacy Leakage',
            order_index: 1,
            summary: 'Practical verification steps for AI code, text, and preventing data leakage.',
            duration_minutes: 25,
            content_markdown: `### Verifying AI Outputs
When working with AI-assisted software generation:
1. Always run automated unit test suites.
2. Inspect for deprecated APIs or non-existent methods.
3. Never input confidential student data, passwords, or private keys into external prompt windows.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-ai-fund',
    title: 'Artificial Intelligence & Modern AI Tools',
    slug: 'ai-fundamentals-tools',
    domain: 'technology',
    subject: 'Artificial intelligence and practical AI tools',
    level: 'beginner',
    summary: 'Core concepts of machine learning, classification, neural networks, and practical generative tools.',
    description: 'Foundational introduction to modern artificial intelligence, machine learning pipelines, prompt engineering, and productivity integration.',
    learning_objectives: ['Define supervised, unsupervised, and reinforcement learning', 'Use AI tools responsibly for research and development'],
    prerequisites: ['Basic computing literacy'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-ai-tech',
    created_at: new Date('2026-09-12').toISOString(),
    modules: [
      {
        id: 'mod-aif-1',
        course_id: 'course-ai-fund',
        title: 'Module 1: Machine Learning Core Paradigms',
        order_index: 1,
        lessons: [
          {
            id: 'les-aif-101',
            module_id: 'mod-aif-1',
            title: 'Lesson 1: Supervised vs Unsupervised Classification',
            order_index: 1,
            summary: 'How machines learn patterns from labeled training data vs cluster discovery.',
            duration_minutes: 20,
            content_markdown: `### Machine Learning Core Concepts
Machine learning shifts programming from writing explicit rules to training statistical models on existing data.
- **Supervised Learning:** Training with labeled inputs and known targets (e.g., spam vs non-spam).
- **Unsupervised Learning:** Finding latent clusters in unlabeled datasets.
- **Neural Networks:** Layered mathematical weights inspired by biological neural connections.`,
          },
        ],
      },
      {
        id: 'mod-aif-2',
        course_id: 'course-ai-fund',
        title: 'Module 2: Practical AI Tools & Workflows',
        order_index: 2,
        lessons: [
          {
            id: 'les-aif-102',
            module_id: 'mod-aif-2',
            title: 'Lesson 2: Prompt Engineering & Automated Assistance',
            order_index: 1,
            summary: 'Structured prompting techniques, few-shot examples, and workflow integration.',
            duration_minutes: 25,
            content_markdown: `### Effective AI Prompting
Learn how to frame context, provide few-shot examples, and establish negative constraints to elicit precise AI outputs.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-blockchain-fund',
    title: 'Blockchain & Distributed Ledger Fundamentals',
    slug: 'blockchain-fundamentals',
    domain: 'technology',
    subject: 'Blockchain',
    level: 'intermediate',
    summary: 'Cryptographic hashing, distributed state machines, consensus protocols, and smart contract principles.',
    description: 'Learn the architectural foundations of decentralized computing without financial speculation or hype.',
    learning_objectives: ['Explain Merkle trees and cryptographic verification', 'Differentiate PoW and PoS consensus mechanisms'],
    prerequisites: ['Computing fundamentals'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [
      {
        id: 'mod-bc-1',
        course_id: 'course-blockchain-fund',
        title: 'Module 1: Cryptographic Foundations & Immutability',
        order_index: 1,
        lessons: [
          {
            id: 'les-bc-101',
            module_id: 'mod-bc-1',
            title: 'Lesson 1: SHA-256 Hashing & Merkle Trees',
            order_index: 1,
            summary: 'How one-way hash functions guarantee data integrity across distributed nodes.',
            duration_minutes: 25,
            content_markdown: `### Cryptographic Hash Functions
A cryptographic hash function maps arbitrary data to a fixed-size 256-bit hash. Any modification to a block alters its hash, breaking the sequential chain.`,
          },
        ],
      },
      {
        id: 'mod-bc-2',
        course_id: 'course-blockchain-fund',
        title: 'Module 2: Consensus & Distributed Networks',
        order_index: 2,
        lessons: [
          {
            id: 'les-bc-102',
            module_id: 'mod-bc-2',
            title: 'Lesson 2: Byzantine Fault Tolerance & Proof Mechanisms',
            order_index: 1,
            summary: 'How peer-to-peer networks agree on canonical ledger state without a central authority.',
            duration_minutes: 25,
            content_markdown: `### Network Consensus
Explore how distributed nodes achieve consensus under network delays and adversarial participants.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-iot-fund',
    title: 'Internet of Things (IoT) & Sensor Architectures',
    slug: 'iot-fundamentals',
    domain: 'technology',
    subject: 'Internet of Things (IoT)',
    level: 'intermediate',
    summary: 'Embedded microcontrollers, sensor telemetry, edge networking, MQTT, and IoT security models.',
    description: 'Understand how physical devices collect and transmit data to networked server applications.',
    learning_objectives: ['Understand sensor reading cycles and analog-to-digital conversion', 'Analyze MQTT lightweight pub/sub protocols'],
    prerequisites: ['Basic networking concepts'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-18').toISOString(),
    modules: [
      {
        id: 'mod-iot-1',
        course_id: 'course-iot-fund',
        title: 'Module 1: Embedded Hardware & Sensors',
        order_index: 1,
        lessons: [
          {
            id: 'les-iot-101',
            module_id: 'mod-iot-1',
            title: 'Lesson 1: Microcontrollers, GPIO & Telemetry Sampling',
            order_index: 1,
            summary: 'Analog-to-digital conversion and physical world sampling.',
            duration_minutes: 20,
            content_markdown: `### Embedded Telemetry
Sensors read physical phenomena (temperature, light, pressure) and convert them to digital signals via GPIO pins.`,
          },
        ],
      },
      {
        id: 'mod-iot-2',
        course_id: 'course-iot-fund',
        title: 'Module 2: IoT Networking Protocols',
        order_index: 2,
        lessons: [
          {
            id: 'les-iot-102',
            module_id: 'mod-iot-2',
            title: 'Lesson 2: Lightweight MQTT Messaging & Edge Security',
            order_index: 1,
            summary: 'Publish/subscribe architectures over constrained mobile data connections.',
            duration_minutes: 25,
            content_markdown: `### MQTT Architecture
MQTT provides low-overhead packet headers suitable for unreliable sensor connections.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-ms-tech',
    title: 'Microsoft Technologies & Productivity Architecture',
    slug: 'microsoft-technologies',
    domain: 'technology',
    subject: 'Microsoft technologies',
    level: 'beginner',
    summary: 'Enterprise cloud services, Azure basics, PowerShell scripting, Active Directory concepts, and Microsoft 365 administration.',
    description: 'Master practical industry standards across modern enterprise software environments and cloud infrastructure.',
    learning_objectives: ['Navigate enterprise directory structures', 'Automate file and system workflows with PowerShell'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-20').toISOString(),
    modules: [
      {
        id: 'mod-ms-1',
        course_id: 'course-ms-tech',
        title: 'Module 1: Enterprise Directory & Cloud Identity',
        order_index: 1,
        lessons: [
          {
            id: 'les-ms-101',
            module_id: 'mod-ms-1',
            title: 'Lesson 1: Active Directory & Azure Cloud Identity',
            order_index: 1,
            summary: 'Identity federation, role-based access, and organizational units.',
            duration_minutes: 20,
            content_markdown: `### Cloud Identity
Enterprise security relies on centralized identity providers to manage permissions across hundreds of systems.`,
          },
        ],
      },
      {
        id: 'mod-ms-2',
        course_id: 'course-ms-tech',
        title: 'Module 2: Automation & Office Systems',
        order_index: 2,
        lessons: [
          {
            id: 'les-ms-102',
            module_id: 'mod-ms-2',
            title: 'Lesson 2: PowerShell Automation & M365 Administration',
            order_index: 1,
            summary: 'Scripting repetitive administrative tasks and policy deployment.',
            duration_minutes: 25,
            content_markdown: `### PowerShell Automation
Object-oriented scripting in PowerShell enables automated account provisioning and configuration auditing.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-privacy-footprint',
    title: 'Digital Privacy & Digital Footprint Protection',
    slug: 'digital-privacy-footprint',
    domain: 'technology',
    subject: 'Digital privacy and digital footprints',
    level: 'beginner',
    summary: 'Telemetry tracking, browser fingerprinting, data broker harvesting, and practical defensive personal security.',
    description: 'Learn how modern digital platforms monitor user behavior and how to defend personal and student data under DPDP standards.',
    learning_objectives: ['Audit personal digital footprints', 'Configure browser isolation and cookie defenses'],
    prerequisites: ['None'],
    duration_hours: 3,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-tech-cyber',
    created_at: new Date('2026-09-22').toISOString(),
    modules: [
      {
        id: 'mod-priv-1',
        course_id: 'course-privacy-footprint',
        title: 'Module 1: Web Tracking Mechanics',
        order_index: 1,
        lessons: [
          {
            id: 'les-priv-101',
            module_id: 'mod-priv-1',
            title: 'Lesson 1: Browser Fingerprinting & Telemetry',
            order_index: 1,
            summary: 'How canvas rendering, fonts, and screen dimensions uniquely identify devices.',
            duration_minutes: 20,
            content_markdown: `### Device Fingerprinting
Even with cookies disabled, combinations of browser extensions, graphics rendering quirks, and headers identify users across websites.`,
          },
        ],
      },
      {
        id: 'mod-priv-2',
        course_id: 'course-privacy-footprint',
        title: 'Module 2: Defensive Personal Security',
        order_index: 2,
        lessons: [
          {
            id: 'les-priv-102',
            module_id: 'mod-priv-2',
            title: 'Lesson 2: Telemetry Isolation & Data Minimization',
            order_index: 1,
            summary: 'Configuring DNS filtering, container tabs, and minimal permissions.',
            duration_minutes: 20,
            content_markdown: `### Practical Privacy Hardening
Adopt the principle of data minimization: never provide unnecessary phone numbers, birthdays, or address details to web services.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-comp-fund',
    title: 'Computing Fundamentals & Hardware Architecture',
    slug: 'computing-fundamentals',
    domain: 'technology',
    subject: 'Computing fundamentals',
    level: 'beginner',
    summary: 'Binary arithmetic, logic gates, memory hierarchies, processor cycles, and operating system kernels.',
    description: 'A ground-up journey through computer engineering, explaining how silicon switches execute machine instructions.',
    learning_objectives: ['Convert between binary, decimal, and hexadecimal', 'Trace CPU fetch-decode-execute cycles'],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-tech-cyber',
    created_at: new Date('2026-09-25').toISOString(),
    modules: [
      {
        id: 'mod-cf-1',
        course_id: 'course-comp-fund',
        title: 'Module 1: Silicon & Machine Architecture',
        order_index: 1,
        lessons: [
          {
            id: 'les-cf-101',
            module_id: 'mod-cf-1',
            title: 'Lesson 1: Binary Logic, Transistors & ALU Operations',
            order_index: 1,
            summary: 'How Boolean algebra is physically realized in silicon chips.',
            duration_minutes: 25,
            content_markdown: `### The Arithmetic Logic Unit
At the physical layer, computers manipulate electrical voltages across billions of microscopic transistors representing 0s and 1s.`,
          },
        ],
      },
      {
        id: 'mod-cf-2',
        course_id: 'course-comp-fund',
        title: 'Module 2: Memory & Execution Cycles',
        order_index: 2,
        lessons: [
          {
            id: 'les-cf-102',
            module_id: 'mod-cf-2',
            title: 'Lesson 2: Fetch-Decode-Execute Cycles & OS Kernels',
            order_index: 1,
            summary: 'How the CPU steps through instructions stored in volatile RAM.',
            duration_minutes: 25,
            content_markdown: `### The Instruction Cycle
The CPU continuously fetches instruction opcodes from memory, decodes their operands, and executes computational state changes.`,
          },
        ],
      },
    ],
  },

  // ==================================================================
  // CATEGORY 2: CODING & PROGRAMMING (7 SUBJECTS)
  // ==================================================================
  {
    id: 'course-prog-fund',
    title: 'Programming Fundamentals & Computational Logic',
    slug: 'programming-fundamentals',
    domain: 'coding',
    subject: 'Programming fundamentals',
    level: 'beginner',
    summary: 'Algorithms, pseudocode, flowchart modeling, execution stacks, memory pointers, and problem decomposition.',
    description: 'Learn computational thinking and algorithmic problem solving from first principles before syntax memorization.',
    learning_objectives: ['Deconstruct complex real-world problems into discrete algorithmic steps', 'Trace program state transitions manually'],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-08').toISOString(),
    modules: [
      {
        id: 'mod-pf-1',
        course_id: 'course-prog-fund',
        title: 'Module 1: Algorithmic Thinking',
        order_index: 1,
        lessons: [
          {
            id: 'les-pf-101',
            module_id: 'mod-pf-1',
            title: 'Lesson 1: Decomposing Problems & Pseudocode Architecture',
            order_index: 1,
            summary: 'Breaking down multifaceted real-world challenges into sequential logic steps.',
            duration_minutes: 25,
            content_markdown: `### Computational Thinking
Before writing syntax, an engineer designs the algorithm: determining inputs, transformations, and output contracts.`,
          },
        ],
      },
      {
        id: 'mod-pf-2',
        course_id: 'course-prog-fund',
        title: 'Module 2: State & Memory Allocation',
        order_index: 2,
        lessons: [
          {
            id: 'les-pf-102',
            module_id: 'mod-pf-2',
            title: 'Lesson 2: Variables, References & Execution Stacks',
            order_index: 1,
            summary: 'How programs store values in memory addresses during execution.',
            duration_minutes: 25,
            content_markdown: `### Memory Allocation
Understand the difference between values stored on the execution stack and dynamic objects allocated on the heap.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-variables-loops',
    title: 'Variables, Data Types, Conditions, and Loops',
    slug: 'variables-conditions-loops',
    domain: 'coding',
    subject: 'Variables, data types, conditions, and loops',
    level: 'beginner',
    summary: 'Scalar and compound types, boolean logic, branching, while/for loops, and algorithmic complexity.',
    description: 'Master the core building blocks of computer programs through hands-on coding exercises, tracing variable states and iterating across data collections.',
    learning_objectives: [
      'Master scalar types (integers, floats, strings, booleans) and memory representation',
      'Construct compound logical expressions using AND, OR, NOT gates',
      'Write optimized iterative loops and prevent infinite loops',
    ],
    prerequisites: ['Programming fundamentals'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'implemented_in_build',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-09').toISOString(),
    modules: [
      {
        id: 'mod-loop-1',
        course_id: 'course-prog-variables-loops',
        title: 'Module 1: Flow of Control & Iteration',
        order_index: 1,
        lessons: [
          {
            id: 'les-loop-101',
            module_id: 'mod-loop-1',
            title: 'Lesson 1: Conditional Branching & Loop Invariants',
            order_index: 1,
            summary: 'How CPU instruction pointers branch based on condition registers and evaluate iterative blocks.',
            duration_minutes: 25,
            content_markdown: `### Conditional Execution & The Loop Cycle

At its core, all software consists of three elementary operations:
1. **Sequence:** Executing statements one after another.
2. **Selection (Conditionals):** Choosing an execution branch based on a boolean predicate.
3. **Iteration (Loops):** Repeating an execution block until a termination invariant is satisfied.

#### The Mechanics of Branching:
\`\`\`javascript
if (user.role === 'teacher') {
  renderGradebook();
} else {
  renderStudentDashboard();
}
\`\`\`

#### Preventing Infinite Loops:
Every loop requires an invariant condition that steadily progresses toward its exit condition on every iteration:

\`\`\`javascript
let attempts = 0;
while (attempts < maxAttempts) {
  processAttempt();
  attempts++; // Monotonic state progression ensures loop terminates!
}
\`\`\``,
            quiz: {
              id: 'quiz-loop-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What guarantees that a while loop terminates and avoids freezing the runtime?',
                  options: [
                    'Using a fast computer with more RAM',
                    'Ensuring the condition expression monotonically moves toward false inside the loop body',
                    'Adding more comments to the code block',
                    'Running the program in an incognito browser window',
                  ],
                  correct_option_index: 1,
                  explanation: 'Loops only terminate when their guarding condition is rendered false by operations inside the loop body.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-loop-2',
        course_id: 'course-prog-variables-loops',
        title: 'Module 2: Compound Types & Collections',
        order_index: 2,
        lessons: [
          {
            id: 'les-loop-102',
            module_id: 'mod-loop-2',
            title: 'Lesson 2: Arrays, Slices & Iteration Mechanics',
            order_index: 1,
            summary: 'Linear data structures, zero-indexed arrays, and traversal complexity.',
            duration_minutes: 25,
            content_markdown: `### Array Memory Layout
Arrays store homogeneous elements in contiguous memory blocks, enabling O(1) constant-time indexing by offset math.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-exercises',
    title: 'Programming Exercises & Problem-Solving',
    slug: 'programming-exercises-problem-solving',
    domain: 'coding',
    subject: 'Programming exercises and problem-solving',
    level: 'intermediate',
    summary: 'Practical algorithmic challenges: string manipulation, array transformations, recursion, and search algorithms.',
    description: 'Build coding fluency and problem-solving resilience by tackling real-world programming challenges with automated unit test suites.',
    learning_objectives: ['Implement classic searching and sorting routines', 'Debug edge cases including null inputs and off-by-one errors'],
    prerequisites: ['Variables, data types, conditions, and loops'],
    duration_hours: 6,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-16').toISOString(),
    modules: [
      {
        id: 'mod-pe-1',
        course_id: 'course-prog-exercises',
        title: 'Module 1: Classic Problem Patterns',
        order_index: 1,
        lessons: [
          {
            id: 'les-pe-101',
            module_id: 'mod-pe-1',
            title: 'Lesson 1: Two-Pointer & Sliding Window Techniques',
            order_index: 1,
            summary: 'Optimizing O(n²) nested loop searches into linear O(n) solutions.',
            duration_minutes: 25,
            content_markdown: `### Two-Pointer Optimization
Techniques for searching pairs and subarrays efficiently without redundant iterations.`,
          },
        ],
      },
      {
        id: 'mod-pe-2',
        course_id: 'course-prog-exercises',
        title: 'Module 2: Search & Sorting Algorithms',
        order_index: 2,
        lessons: [
          {
            id: 'les-pe-102',
            module_id: 'mod-pe-2',
            title: 'Lesson 2: Binary Search & Divide-and-Conquer Strategies',
            order_index: 1,
            summary: 'Logarithmic search across sorted arrays and recursive problem splitting.',
            duration_minutes: 25,
            content_markdown: `### Binary Search Mechanics
Dividing search spaces in half reduces a million elements to just 20 comparisons.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-db-sql',
    title: 'Relational Databases & SQL Foundations',
    slug: 'databases-and-sql',
    domain: 'coding',
    subject: 'Databases and SQL',
    level: 'beginner',
    summary: 'Relational tables, primary & foreign keys, normalization, SELECT queries, JOINs, aggregations, and ACID properties.',
    description: 'Learn how modern enterprise systems organize, query, and preserve structured data safely across relational databases like PostgreSQL and SQLite.',
    learning_objectives: [
      'Design normalized relational table schemas with foreign key integrity',
      'Execute multi-table INNER and LEFT JOIN queries',
      'Aggregate metrics using GROUP BY, COUNT, SUM, and HAVING clauses',
    ],
    prerequisites: ['Basic computing literacy'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'implemented_in_build',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-10').toISOString(),
    modules: [
      {
        id: 'mod-sql-1',
        course_id: 'course-prog-db-sql',
        title: 'Module 1: Relational Architecture & Projections',
        order_index: 1,
        lessons: [
          {
            id: 'les-sql-101',
            module_id: 'mod-sql-1',
            title: 'Lesson 1: The Structure of Relational Tables',
            order_index: 1,
            summary: 'How relational engines store rows and columns with strict schema types and primary keys.',
            duration_minutes: 25,
            content_markdown: `### Relational Foundations: Tables, Rows & Columns

In relational database management systems (RDBMS) such as PostgreSQL and SQLite, data is organized into structured **tables**:
- **Columns (Attributes):** Predefined fields with strict types (\`UUID\`, \`TEXT\`, \`INTEGER\`, \`BOOLEAN\`, \`TIMESTAMPTZ\`).
- **Rows (Tuples):** Individual records conforming to the table schema.
- **Primary Key:** A column (or set of columns) that uniquely identifies every single row in the table.

#### Writing Clean SQL Projections:
Avoid querying \`SELECT *\` in production environments because it wastes network bandwidth and breaks application contracts when columns change. Always specify exact projections:

\`\`\`sql
SELECT id, username, role
FROM challenge_users
WHERE account_status = 'active';
\`\`\``,
            quiz: {
              id: 'quiz-sql-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Why is explicit column selection (e.g. SELECT id, username) preferred over SELECT *?',
                  options: [
                    'It prevents returning unintended confidential fields and preserves stable data contracts',
                    'SELECT * is forbidden by all SQL database engines',
                    'It doubles the speed of hard drives',
                    'It automatically converts all queries to prepared statements',
                  ],
                  correct_option_index: 0,
                  explanation: 'Explicit projections ensure minimum data transfer and protect against accidental leakage of sensitive columns (e.g. password hashes).',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-sql-2',
        course_id: 'course-prog-db-sql',
        title: 'Module 2: Relational Queries & Joins',
        order_index: 2,
        lessons: [
          {
            id: 'les-sql-102',
            module_id: 'mod-sql-2',
            title: 'Lesson 2: Multi-Table Joins & Filter Conditions',
            order_index: 1,
            summary: 'Combining related records across tables using foreign key relationships.',
            duration_minutes: 25,
            content_markdown: `### SQL Joins
INNER JOIN retrieves records that have matching values in both tables, preserving data relational integrity.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-web-fund',
    title: 'Web Development Fundamentals',
    slug: 'web-development-fundamentals',
    domain: 'coding',
    subject: 'Web development fundamentals',
    level: 'beginner',
    summary: 'HTML5 semantic markup, CSS responsive layouts, DOM tree manipulation, events, and fetch API.',
    description: 'Build modern, accessible, and fast web applications using foundational standards without heavy framework abstractions.',
    learning_objectives: ['Structure accessible semantic HTML documents', 'Implement CSS flexbox and grid layouts', 'Handle browser user events'],
    prerequisites: ['None'],
    duration_hours: 6,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-19').toISOString(),
    modules: [
      {
        id: 'mod-web-1',
        course_id: 'course-prog-web-fund',
        title: 'Module 1: Structural Markup & Styling',
        order_index: 1,
        lessons: [
          {
            id: 'les-web-101',
            module_id: 'mod-web-1',
            title: 'Lesson 1: Semantic HTML5 & CSS Box Model Architecture',
            order_index: 1,
            summary: 'Accessible document structure, screen-reader landmarks, and box calculations.',
            duration_minutes: 25,
            content_markdown: `### Semantic Web
Using proper tags (\`<header>\`, \`<main>\`, \`<nav>\`) provides accessibility for assistive technologies and search engines.`,
          },
        ],
      },
      {
        id: 'mod-web-2',
        course_id: 'course-prog-web-fund',
        title: 'Module 2: Dynamic Browser Execution',
        order_index: 2,
        lessons: [
          {
            id: 'les-web-102',
            module_id: 'mod-web-2',
            title: 'Lesson 2: The Document Object Model (DOM) & Event Handlers',
            order_index: 1,
            summary: 'Manipulating elements, listening for clicks, and async API requests.',
            duration_minutes: 25,
            content_markdown: `### Interactive DOM
JavaScript interacts with the browser's parsed HTML tree, enabling dynamic UI updates without full page reloads.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-projects',
    title: 'Applied Coding Projects',
    slug: 'coding-projects',
    domain: 'coding',
    subject: 'Coding projects',
    level: 'intermediate',
    summary: 'Full-cycle project construction: requirement decomposition, Git version control, testing, and deployment.',
    description: 'Synthesize algorithms, databases, and user interfaces into robust standalone software projects with full documentation.',
    learning_objectives: ['Manage feature branches with Git', 'Package software projects with automated test coverage'],
    prerequisites: ['Programming fundamentals', 'Databases and SQL'],
    duration_hours: 8,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-23').toISOString(),
    modules: [
      {
        id: 'mod-cp-1',
        course_id: 'course-prog-projects',
        title: 'Module 1: Project Scaffolding & Git Lifecycle',
        order_index: 1,
        lessons: [
          {
            id: 'les-cp-101',
            module_id: 'mod-cp-1',
            title: 'Lesson 1: Repository Architecture, Commits & Branches',
            order_index: 1,
            summary: 'Setting up clean project structures, linting configurations, and branch workflows.',
            duration_minutes: 25,
            content_markdown: `### Software Repository Hygiene
Maintain clean directory structures separating source code, test suites, and documentation.`,
          },
        ],
      },
      {
        id: 'mod-cp-2',
        course_id: 'course-prog-projects',
        title: 'Module 2: End-to-End Build & Verification',
        order_index: 2,
        lessons: [
          {
            id: 'les-cp-102',
            module_id: 'mod-cp-2',
            title: 'Lesson 2: Modular Architecture & Automated Unit Testing',
            order_index: 1,
            summary: 'Writing test assertions that verify business logic boundaries.',
            duration_minutes: 25,
            content_markdown: `### Automated Verification
A project is not complete until automated tests demonstrate its error handling and happy-path execution.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-debugging',
    title: 'Practical Coding & Debugging Exercises',
    slug: 'practical-coding-debugging',
    domain: 'coding',
    subject: 'Practical coding and debugging exercises',
    level: 'intermediate',
    summary: 'Breakpoints, stack trace reading, memory leak identification, defensive exceptions, and static linting.',
    description: 'Learn the systematic methodology of modern software debugging: isolating reproductions, inspecting state, and fixing root causes.',
    learning_objectives: ['Read and interpret browser and server runtime stack traces', 'Write reproducible unit tests for bug regressions'],
    prerequisites: ['Variables, data types, conditions, and loops'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-24').toISOString(),
    modules: [
      {
        id: 'mod-cd-1',
        course_id: 'course-prog-debugging',
        title: 'Module 1: Error Taxonomy & Stack Traces',
        order_index: 1,
        lessons: [
          {
            id: 'les-cd-101',
            module_id: 'mod-cd-1',
            title: 'Lesson 1: Syntax vs Runtime vs Logical Software Defects',
            order_index: 1,
            summary: 'Categorizing defects and tracing execution back to root cause lines.',
            duration_minutes: 25,
            content_markdown: `### Reading Stack Traces
Learn how to read stack traces from bottom to top to identify the exact origin of runtime exceptions.`,
          },
        ],
      },
      {
        id: 'mod-cd-2',
        course_id: 'course-prog-debugging',
        title: 'Module 2: Systematic Debugging Tools',
        order_index: 2,
        lessons: [
          {
            id: 'les-cd-102',
            module_id: 'mod-cd-2',
            title: 'Lesson 2: Breakpoints, Variable Watches & Regression Testing',
            order_index: 1,
            summary: 'Using debuggers to pause execution and inspect memory state interactively.',
            duration_minutes: 25,
            content_markdown: `### Interactive Debugging
Stop relying on console.log alone. Use debugger breakpoints to inspect scope variables at runtime.`,
          },
        ],
      },
    ],
  },

  // ==================================================================
  // CATEGORY 3: FINANCE & FINANCIAL LITERACY (7 SUBJECTS)
  // ==================================================================
  {
    id: 'course-fin-intro',
    title: 'Introduction to Finance & Economic Foundations',
    slug: 'intro-to-finance',
    domain: 'finance',
    subject: 'Introduction to Finance',
    level: 'beginner',
    summary: 'Core principles of money, compounding interest, inflation, budgeting, and financial risk evaluation.',
    description: 'A grounded, educational exploration of how money functions in society. Learn to evaluate the true time-value of money, budgeting fundamentals, and debt management without speculative promises.',
    learning_objectives: [
      'Calculate compound interest and the impact of inflation over time',
      'Construct a resilient, balanced personal emergency budget',
      'Distinguish between productive asset ownership and predatory liabilities',
    ],
    prerequisites: ['Basic arithmetic'],
    duration_hours: 4,
    is_published: true,
    availability_status: 'implemented_in_build',
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-02').toISOString(),
    modules: [
      {
        id: 'mod-fin-1',
        course_id: 'course-fin-intro',
        title: 'Module 1: Money, Purchasing Power & Time',
        order_index: 1,
        lessons: [
          {
            id: 'les-fin-101',
            module_id: 'mod-fin-1',
            title: 'Lesson 1: The Purchasing Power of Money',
            order_index: 1,
            summary: 'Why cash held in zero-interest accounts silently decays over time due to macroeconomic inflation.',
            duration_minutes: 20,
            content_markdown: `### The Time Value of Money & Inflation

One of the most essential rules in financial literacy is that **a rupee today is worth more than a rupee ten years in the future**.

#### The Hidden Friction: Inflation
Inflation represents the systemic increase in the price of goods and services over time. If a basket of groceries costs ₹1,000 today and annual inflation is 6%, that same basket will cost ₹1,060 next year.

If your savings account earns 3% interest while inflation runs at 6%, your **real purchasing power is decreasing by 3% every year**.

#### Compounding: The Math of Patience
When interest earns interest, growth transitions from linear to exponential:

$$A = P \\left(1 + \\frac{r}{n}\\right)^{nt}$$

Understanding compounding early allows students to build long-term financial security rather than chasing dangerous, speculative short-term schemes.`,
            quiz: {
              id: 'quiz-fin-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'If inflation averages 6% and your savings account yields 2.5%, what happens to your purchasing power?',
                  options: [
                    'It increases by 3.5% annually',
                    'It decreases by approximately 3.5% annually in real terms',
                    'It stays completely identical',
                    'It doubles every 10 years',
                  ],
                  correct_option_index: 1,
                  explanation: 'Real return equals nominal return minus inflation. 2.5% minus 6% equals a -3.5% loss in purchasing power.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-fin-2',
        course_id: 'course-fin-intro',
        title: 'Module 2: Compounding Interest & Inflation Defense',
        order_index: 2,
        lessons: [
          {
            id: 'les-fin-102',
            module_id: 'mod-fin-2',
            title: 'Lesson 2: Constructing a Resilient Budget',
            order_index: 1,
            summary: 'Practical principles for managing emergency funds, debt avoidance, and intentional saving.',
            duration_minutes: 20,
            content_markdown: `### Principles of Personal Budgeting
Build sustainable habits early: allocating fixed needs, funding emergency reserves, and avoiding high-interest consumer credit.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-events',
    title: 'Global Events & Financial Effects',
    slug: 'global-events-finance',
    domain: 'finance',
    subject: 'Global Events and Finance',
    level: 'intermediate',
    summary: 'How supply shocks, central bank interest rate shifts, commodity cycles, and geopolitical crises alter domestic economies.',
    description: 'Learn to analyze international macroeconomic trends, currency fluctuations, and trade policy impacts.',
    learning_objectives: ['Analyze global trade disruptions', 'Understand central bank monetary policy tightening and easing'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-05').toISOString(),
    modules: [
      {
        id: 'mod-fe-1',
        course_id: 'course-fin-events',
        title: 'Module 1: Macroeconomic Shocks & Supply Chains',
        order_index: 1,
        lessons: [
          {
            id: 'les-fe-101',
            module_id: 'mod-fe-1',
            title: 'Lesson 1: Geopolitics, Energy Crises & Inflationary Spirals',
            order_index: 1,
            summary: 'How international supply bottlenecks directly translate into consumer goods inflation.',
            duration_minutes: 25,
            content_markdown: `### Global Supply Shocks
When oil or fertilizer prices surge globally, transportation and food costs increase worldwide, prompting domestic price inflation.`,
          },
        ],
      },
      {
        id: 'mod-fe-2',
        course_id: 'course-fin-events',
        title: 'Module 2: Central Bank Policy Responses',
        order_index: 2,
        lessons: [
          {
            id: 'les-fe-102',
            module_id: 'mod-fe-2',
            title: 'Lesson 2: Interest Rate Hikes & Currency Valuations',
            order_index: 1,
            summary: 'How the US Federal Reserve and RBI raise rates to cool inflation.',
            duration_minutes: 25,
            content_markdown: `### Monetary Policy Tightening
Central banks raise benchmark interest rates to increase the cost of borrowing, slowing down aggregate demand.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-markets',
    title: 'Financial Markets & Asset Classes',
    slug: 'financial-markets',
    domain: 'finance',
    subject: 'Financial Markets',
    level: 'intermediate',
    summary: 'Equity markets, sovereign bond yields, money markets, commodities, and derivatives mechanics.',
    description: 'An objective structural analysis of primary and secondary capital markets, clearing corporations, and price discovery.',
    learning_objectives: ['Understand how exchanges match buyers and sellers', 'Analyze debt market yields vs equity valuations'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-07').toISOString(),
    modules: [
      {
        id: 'mod-fm-1',
        course_id: 'course-fin-markets',
        title: 'Module 1: Capital Market Architecture',
        order_index: 1,
        lessons: [
          {
            id: 'les-fm-101',
            module_id: 'mod-fm-1',
            title: 'Lesson 1: Primary IPOs, Secondary Exchanges & Liquidity',
            order_index: 1,
            summary: 'How companies raise capital and how clearinghouses settle trades.',
            duration_minutes: 25,
            content_markdown: `### Primary vs Secondary Markets
Primary markets allow enterprises to issue new shares to raise funding; secondary exchanges allow investors to trade existing securities.`,
          },
        ],
      },
      {
        id: 'mod-fm-2',
        course_id: 'course-fin-markets',
        title: 'Module 2: Debt, Equity & Commodities',
        order_index: 2,
        lessons: [
          {
            id: 'les-fm-102',
            module_id: 'mod-fm-2',
            title: 'Lesson 2: Risk-Reward Profiles Across Asset Classes',
            order_index: 1,
            summary: 'Government treasury bills vs corporate bonds vs public equities.',
            duration_minutes: 25,
            content_markdown: `### Asset Allocation
Balancing fixed-income stability with long-term equity growth potential according to time horizons.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-institutions',
    title: 'Financial Institutions & Central Banking',
    slug: 'financial-institutions',
    domain: 'finance',
    subject: 'Financial Institutions',
    level: 'intermediate',
    summary: 'Commercial banking operations, reserve requirements, RBI regulations, deposit insurance, and non-banking lenders.',
    description: 'Explore the mechanics of institutional banking, credit creation, and regulatory solvency safeguards.',
    learning_objectives: ['Explain fractional reserve banking and credit multipliers', 'Understand central bank regulatory oversight'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-11').toISOString(),
    modules: [
      {
        id: 'mod-fi-1',
        course_id: 'course-fin-institutions',
        title: 'Module 1: Commercial Banking Systems',
        order_index: 1,
        lessons: [
          {
            id: 'les-fi-101',
            module_id: 'mod-fi-1',
            title: 'Lesson 1: Fractional Reserves, Credit Creation & Solvency',
            order_index: 1,
            summary: 'How banks take customer deposits and originate loans.',
            duration_minutes: 25,
            content_markdown: `### Fractional Reserve Banking
Banks maintain a fraction of deposits in liquid reserve while lending the remainder to stimulate productive enterprise.`,
          },
        ],
      },
      {
        id: 'mod-fi-2',
        course_id: 'course-fin-institutions',
        title: 'Module 2: Central Bank Oversight',
        order_index: 2,
        lessons: [
          {
            id: 'les-fi-102',
            module_id: 'mod-fi-2',
            title: 'Lesson 2: Monetary Policy, Reserve Ratios & Deposit Insurance',
            order_index: 1,
            summary: 'How the Reserve Bank of India audits capital adequacy and protects depositor wealth.',
            duration_minutes: 25,
            content_markdown: `### Depositor Protection
Regulatory frameworks mandate capital buffers and deposit insurance to prevent bank runs.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-crypto-eval',
    title: 'Cryptocurrency Education, Risks & Awareness',
    slug: 'crypto-fundamentals-risks',
    domain: 'finance',
    subject: 'Cryptocurrency education and risks',
    level: 'intermediate',
    summary: 'Cryptographic ledger mechanics, volatility analysis, smart contract exploits, regulatory frameworks, and scam prevention.',
    description: 'Balanced, responsible education examining the technology behind cryptocurrencies while explicitly dissecting severe market risks, liquidity manipulation, and fraud vectors.',
    learning_objectives: ['Recognize common crypto fraud and rug-pull signatures', 'Understand custodial vs non-custodial risk profiles'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-14').toISOString(),
    modules: [
      {
        id: 'mod-cr-1',
        course_id: 'course-crypto-eval',
        title: 'Module 1: Decentralized Ledgers',
        order_index: 1,
        lessons: [
          {
            id: 'les-cr-101',
            module_id: 'mod-cr-1',
            title: 'Lesson 1: Cryptographic Validation vs Traditional Banking',
            order_index: 1,
            summary: 'Public address cryptography, private keys, and transaction broadcasting.',
            duration_minutes: 25,
            content_markdown: `### Public Key Cryptography
Transactions are signed using asymmetric private keys and verified publicly across distributed node networks.`,
          },
        ],
      },
      {
        id: 'mod-cr-2',
        course_id: 'course-crypto-eval',
        title: 'Module 2: Risk Analysis & Scam Prevention',
        order_index: 2,
        lessons: [
          {
            id: 'les-cr-102',
            module_id: 'mod-cr-2',
            title: 'Lesson 2: Market Volatility, Liquidity Traps & Fraud Vectors',
            order_index: 1,
            summary: 'Spotting wash-trading, unregulated exchange insolvencies, and phishing vectors.',
            duration_minutes: 25,
            content_markdown: `### Severe Market Risks
Cryptocurrencies lack sovereign guarantees, exhibit extreme volatility, and expose retail participants to predatory liquidity schemes.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-stock-market',
    title: 'Stock Market Fundamentals & Equity Analysis',
    slug: 'stock-market-fundamentals',
    domain: 'finance',
    subject: 'Stock Market',
    level: 'beginner',
    summary: 'Company ownership, shares, IPOs, index funds, dividends, balance sheet reading, and long-term index investing.',
    description: 'Demystify public equity markets through evidence-based valuation principles rather than speculative day-trading.',
    learning_objectives: ['Read a basic corporate balance sheet', 'Explain diversification through broad-market index funds'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-17').toISOString(),
    modules: [
      {
        id: 'mod-sm-1',
        course_id: 'course-stock-market',
        title: 'Module 1: Equity Ownership & Valuations',
        order_index: 1,
        lessons: [
          {
            id: 'les-sm-101',
            module_id: 'mod-sm-1',
            title: 'Lesson 1: Shares, Market Capitalization & P/E Ratios',
            order_index: 1,
            summary: 'Understanding fractional ownership of corporations and basic valuation multiples.',
            duration_minutes: 25,
            content_markdown: `### What is a Share?
A share represents fractional ownership of a public corporation, entitling the owner to proportional earnings and voting rights.`,
          },
        ],
      },
      {
        id: 'mod-sm-2',
        course_id: 'course-stock-market',
        title: 'Module 2: Long-Term Index Investing',
        order_index: 2,
        lessons: [
          {
            id: 'les-sm-102',
            module_id: 'mod-sm-2',
            title: 'Lesson 2: Diversification, Broad-Market Funds & Compounding',
            order_index: 1,
            summary: 'Why passive low-cost index funds consistently outperform speculative stock pickers.',
            duration_minutes: 25,
            content_markdown: `### The Power of Low-Cost Indexing
Holding hundreds of companies across the entire economy reduces individual company bankruptcy risk while capturing aggregate economic expansion.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fintech-payments',
    title: 'FinTech & Modern Digital Payment Architectures',
    slug: 'fintech-digital-payments',
    domain: 'finance',
    subject: 'FinTech',
    level: 'beginner',
    summary: 'UPI protocol architecture, payment gateways, tokenization, mobile wallets, and financial data encryption.',
    description: 'Analyze how India revolutionized global digital transactions through the Unified Payments Interface (UPI) and open banking protocols.',
    learning_objectives: ['Trace the lifecycle of a 2-factor UPI transaction', 'Understand tokenization and card-on-file safety'],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-financial-literacy',
    created_at: new Date('2026-09-21').toISOString(),
    modules: [
      {
        id: 'mod-ft-1',
        course_id: 'course-fintech-payments',
        title: 'Module 1: UPI & Instant Settlement Protocols',
        order_index: 1,
        lessons: [
          {
            id: 'les-ft-101',
            module_id: 'mod-ft-1',
            title: 'Lesson 1: Virtual Payment Addresses & 2-Factor Auth',
            order_index: 1,
            summary: 'How NPCI orchestrates real-time interbank funds transfer via mobile apps.',
            duration_minutes: 25,
            content_markdown: `### UPI Protocol Lifecycle
Learn how National Payments Corporation of India (NPCI) connects issuing banks and acquiring banks in sub-second round-trips.`,
          },
        ],
      },
      {
        id: 'mod-ft-2',
        course_id: 'course-fintech-payments',
        title: 'Module 2: Payment Gateways & Tokenization',
        order_index: 2,
        lessons: [
          {
            id: 'les-ft-102',
            module_id: 'mod-ft-2',
            title: 'Lesson 2: Card Tokenization, Encryption & Fraud Defenses',
            order_index: 1,
            summary: 'Replacing sensitive 16-digit card numbers with device-specific cryptographic tokens.',
            duration_minutes: 25,
            content_markdown: `### Payment Tokenization
Tokenization prevents merchants from storing actual credit or debit card numbers, dramatically reducing data breach impacts.`,
          },
        ],
      },
    ],
  },

  // ==================================================================
  // CATEGORY 4: PROFESSIONAL SKILLS (5 SUBJECTS)
  // ==================================================================
  {
    id: 'course-prof-time',
    title: 'Time Management & Cognitive Prioritization',
    slug: 'time-management',
    domain: 'professional',
    subject: 'Time Management',
    level: 'beginner',
    summary: 'Eisenhower matrix, deep work cycles, calendar blocking, task batching, and sustainable digital boundary setting.',
    description: 'Build intentional, disciplined daily operating systems designed to eliminate digital distraction and sustain high focus.',
    learning_objectives: ['Apply the Eisenhower decision matrix to daily tasks', 'Structure 90-minute uninterrupted deep work blocks'],
    prerequisites: ['None'],
    duration_hours: 3,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-03').toISOString(),
    modules: [
      {
        id: 'mod-pt-1',
        course_id: 'course-prof-time',
        title: 'Module 1: Priority Frameworks',
        order_index: 1,
        lessons: [
          {
            id: 'les-pt-101',
            module_id: 'mod-pt-1',
            title: 'Lesson 1: Eisenhower Matrix & The Urgent vs Important Paradox',
            order_index: 1,
            summary: 'Distinguishing between reactive urgent noise and proactive high-leverage activities.',
            duration_minutes: 20,
            content_markdown: `### The Eisenhower Framework
Classify tasks into 4 quadrants:
1. Urgent & Important (Handle immediately).
2. Non-Urgent but Important (Schedule proactively — where highest career value is created).
3. Urgent but Unimportant (Delegate or automate).
4. Neither (Eliminate).`,
          },
        ],
      },
      {
        id: 'mod-pt-2',
        course_id: 'course-prof-time',
        title: 'Module 2: Deep Work Routines',
        order_index: 2,
        lessons: [
          {
            id: 'les-pt-102',
            module_id: 'mod-pt-2',
            title: 'Lesson 2: Uninterrupted Focus Blocks & Minimizing Context Switching',
            order_index: 1,
            summary: 'Techniques for guarding 90-minute programming blocks against notification clutter.',
            duration_minutes: 20,
            content_markdown: `### Focus Hygiene
Cognitive switching penalties cost up to 23 minutes after each interruption. Batch emails and messages into defined daily slots.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prof-workplace',
    title: 'Professional Skills & Workplace Readiness',
    slug: 'professional-skills',
    domain: 'professional',
    subject: 'Professional Skills',
    level: 'beginner',
    summary: 'Workplace etiquette, project accountability, meeting hygiene, asynchronous documentation, and conflict resolution.',
    description: 'Transition smoothly from academic environments to high-performing professional engineering and business teams.',
    learning_objectives: ['Write clear, concise technical and status updates', 'Navigate team disagreements constructively'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-06').toISOString(),
    modules: [
      {
        id: 'mod-pw-1',
        course_id: 'course-prof-workplace',
        title: 'Module 1: Team Accountability & Etiquette',
        order_index: 1,
        lessons: [
          {
            id: 'les-pw-101',
            module_id: 'mod-pw-1',
            title: 'Lesson 1: Clear Asynchronous Communication & Updates',
            order_index: 1,
            summary: 'Writing stand-up updates, documenting decisions, and taking ownership of bugs.',
            duration_minutes: 20,
            content_markdown: `### High-Impact Status Updates
Every engineering update should communicate: what was delivered, what is in progress, and any blocking obstacles.`,
          },
        ],
      },
      {
        id: 'mod-pw-2',
        course_id: 'course-prof-workplace',
        title: 'Module 2: Workplace Problem Solving',
        order_index: 2,
        lessons: [
          {
            id: 'les-pw-102',
            module_id: 'mod-pw-2',
            title: 'Lesson 2: Constructive Feedback & Collaborative Alignment',
            order_index: 1,
            summary: 'Code review etiquette and separating personal pride from objective software quality.',
            duration_minutes: 20,
            content_markdown: `### Giving and Receiving Code Feedback
Frame review comments around code behavior, maintainability, and test coverage rather than personal preferences.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prof-softskills',
    title: 'Soft Skills Development & Interpersonal Dynamics',
    slug: 'soft-skills-development',
    domain: 'professional',
    subject: 'Soft Skills Development',
    level: 'beginner',
    summary: 'Active listening, empathy in leadership, constructive feedback delivery, and high-impact presentation delivery.',
    description: 'Master the interpersonal competencies that distinguish exceptional engineers and team leaders.',
    learning_objectives: ['Practice non-defensive reception of critical feedback', 'Structure persuasive verbal presentations'],
    prerequisites: ['None'],
    duration_hours: 3,
    is_published: false,
    availability_status: 'in_development',
    created_at: new Date('2026-09-09').toISOString(),
    modules: [
      {
        id: 'mod-pss-1',
        course_id: 'course-prof-softskills',
        title: 'Module 1: Empathetic Communication',
        order_index: 1,
        lessons: [
          {
            id: 'les-pss-101',
            module_id: 'mod-pss-1',
            title: 'Lesson 1: Active Listening & Non-Defensive Dialogue',
            order_index: 1,
            summary: 'Hearing requirements fully before rushing to implement technical solutions.',
            duration_minutes: 20,
            content_markdown: `### Active Listening in Engineering
Repeat back requirements to ensure mutual understanding before architecting code.`,
          },
        ],
      },
      {
        id: 'mod-pss-2',
        course_id: 'course-prof-softskills',
        title: 'Module 2: Presentation & Persuasion',
        order_index: 2,
        lessons: [
          {
            id: 'les-pss-102',
            module_id: 'mod-pss-2',
            title: 'Lesson 2: Structuring Technical Ideas for Diverse Audiences',
            order_index: 1,
            summary: 'Explaining complex systems to non-technical stakeholders and educators.',
            duration_minutes: 20,
            content_markdown: `### Communicating Across Domains
Translate technical trade-offs into clear outcomes that students, parents, and school administrators understand.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prof-identity',
    title: 'Social Profiles & Professional Identity',
    slug: 'social-profiles-identity',
    domain: 'professional',
    subject: 'Social Profiles and Professional Identity',
    level: 'beginner',
    summary: 'Engineering authentic GitHub profiles, LinkedIn presence, technical writing, and public credibility.',
    description: 'Craft a coherent, credible digital presence that showcases authentic code contributions and technical thinking.',
    learning_objectives: ['Optimize a technical GitHub profile and project READMEs', 'Write substantive technical summaries'],
    prerequisites: ['None'],
    duration_hours: 3,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-13').toISOString(),
    modules: [
      {
        id: 'mod-pi-1',
        course_id: 'course-prof-identity',
        title: 'Module 1: Technical Presence',
        order_index: 1,
        lessons: [
          {
            id: 'les-pi-101',
            module_id: 'mod-pi-1',
            title: 'Lesson 1: Crafting an Impactful GitHub & Portfolio Architecture',
            order_index: 1,
            summary: 'Documenting repositories with clear installation guides, architectures, and tests.',
            duration_minutes: 20,
            content_markdown: `### The GitHub Profile as Technical Portfolio
A clean README with working badges, reproduction instructions, and clear commit messages proves authentic capability.`,
          },
        ],
      },
      {
        id: 'mod-pi-2',
        course_id: 'course-prof-identity',
        title: 'Module 2: Professional Networks',
        order_index: 2,
        lessons: [
          {
            id: 'les-pi-102',
            module_id: 'mod-pi-2',
            title: 'Lesson 2: Authentic LinkedIn Engagement & Industry Networking',
            order_index: 1,
            summary: 'Connecting with engineering mentors and participating in technical discussions.',
            duration_minutes: 20,
            content_markdown: `### Constructive Networking
Share genuine learning breakthroughs and challenges openly rather than posting hollow marketing buzzwords.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prof-portfolio',
    title: 'Evidence-Backed Portfolio Building',
    slug: 'evidence-backed-portfolio',
    domain: 'professional',
    subject: 'Portfolio Building',
    level: 'intermediate',
    summary: 'Transform completed labs, bug bounties, and software builds into verifiable, employer-ready portfolio artifacts.',
    description: 'Move beyond empty buzzwords. Learn to document engineering architecture, provide cryptographic verification hashes, and present working software as indisputable evidence of skill.',
    learning_objectives: [
      'Document software architecture with diagrams and threat models',
      'Integrate automated testing proof and build badges into case studies',
      'Host and maintain live, reproducible interactive project demos',
    ],
    prerequisites: ['Completion of at least one technical course or project'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'implemented_in_build',
    learning_path_id: 'path-professional-identity',
    created_at: new Date('2026-09-04').toISOString(),
    modules: [
      {
        id: 'mod-port-1',
        course_id: 'course-prof-portfolio',
        title: 'Module 1: The Artifact-Driven Portfolio',
        order_index: 1,
        lessons: [
          {
            id: 'les-port-101',
            module_id: 'mod-port-1',
            title: 'Lesson 1: Evidence vs. Assertion in Technical Portfolios',
            order_index: 1,
            summary: 'Why hiring managers ignore skill lists and how to showcase verifiable technical achievements.',
            duration_minutes: 25,
            content_markdown: `### Proving What You Can Build

Most student resumes list generic keywords: *"Python, SQL, Cybersecurity, Teamwork"*. Technical interviewers and admissions officers see hundreds of these identical resumes every day.

#### The Hierarchy of Credibility:
1. **Assertion (Lowest):** *"I know SQL injection defense."* (Anyone can write this).
2. **Certification:** *"I watched a 4-hour video course."* (Shows passive attendance, not mastery).
3. **Evidence (Highest):** *"Here is the repository where I defeated 5 injection attack payloads using positional SQLite parameters, backed by 15 passing Vitest tests and an anti-tamper server hash."*

#### The Case Study Structure:
Every portfolio project in Geniusphere should answer four core engineering questions:
1. **What was the challenge or threat model?**
2. **What architectural approach was chosen and why?**
3. **What trade-offs were made?**
4. **How did you prove correctness through automated tests?**`,
            quiz: {
              id: 'quiz-port-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What constitutes the highest level of credibility in a technical student portfolio?',
                  options: [
                    'A list of 20 programming language keywords',
                    'A certificate proving video watch time',
                    'Working code with reproducible automated tests and architecture documentation',
                    'A glowing recommendation letter without project links',
                  ],
                  correct_option_index: 2,
                  explanation: 'Technical evaluators value verifiable evidence of problem solving: working code, automated test proof, and architectural rationale.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-port-2',
        course_id: 'course-prof-portfolio',
        title: 'Module 2: Case Study Architecture',
        order_index: 2,
        lessons: [
          {
            id: 'les-port-102',
            module_id: 'mod-port-2',
            title: 'Lesson 2: Threat Models, Engineering Trade-offs & Test Proof',
            order_index: 1,
            summary: 'Writing professional project retrospectives that prove technical depth.',
            duration_minutes: 25,
            content_markdown: `### Documenting Engineering Trade-Offs
Discuss what did not work initially, why specific frameworks were chosen, and how your test suite prevents regressions.`,
          },
        ],
      },
    ],
  },
];
