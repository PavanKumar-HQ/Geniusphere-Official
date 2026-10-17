// ====================================================================
// Geniusphere — Approved Curriculum & Course Catalogue Seed
// Strictly Scoped to the 4 Approved Learning Categories:
// 1. Technology (8 Subjects)
// 2. Finance (7 Subjects)
// 3. Professional Skills (4 Subjects)
// 4. Coding & Programming (8 Subjects)
// Total: Exactly 27 Curricular Subjects
// Zero unapproved standalone SQL lab or course.
// ====================================================================

import { Course, LearningPath, VideoLesson, StudyResource } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-technology',
    title: 'Technology & Cybersecurity Defense',
    slug: 'technology-cybersecurity',
    domain: 'technology',
    description: 'Master application defense, AI systems, cloud architecture, IoT, blockchain, and computing fundamentals.',
    target_audience: 'Students and independent learners building secure, modern technology systems',
    prerequisites: ['Basic computing literacy'],
    course_ids: [
      'course-ai-fund',
      'course-ai-resp',
      'course-blockchain-fund',
      'course-iot-fund',
      'course-ms-tech',
      'course-privacy-footprint',
      'course-web-sec',
      'course-comp-fund',
    ],
  },
  {
    id: 'path-coding',
    title: 'Coding, Logic & Software Engineering',
    slug: 'coding-programming',
    domain: 'coding',
    description: 'Learn computational logic, syntax structures, condition branching, loops, web development, and practical debugging.',
    target_audience: 'Aspiring software engineers, students, and technical problem solvers',
    prerequisites: ['None'],
    course_ids: [
      'course-prog-fund',
      'course-prog-variables',
      'course-prog-loops',
      'course-prog-comp-thinking',
      'course-prog-exercises',
      'course-prog-web-fund',
      'course-prog-debugging',
      'course-prog-projects',
    ],
  },
  {
    id: 'path-finance',
    title: 'Finance, Markets & FinTech',
    slug: 'finance-literacy',
    domain: 'finance',
    description: 'Build grounded financial literacy covering central banking, public markets, institutions, digital payments, and risk analysis.',
    target_audience: 'Learners preparing for financial independence, investments, and economic fluency',
    prerequisites: ['Basic arithmetic'],
    course_ids: [
      'course-fin-intro',
      'course-fin-events',
      'course-fin-markets',
      'course-fin-institutions',
      'course-crypto-eval',
      'course-stock-market',
      'course-fintech-payments',
    ],
  },
  {
    id: 'path-professional',
    title: 'Professional Skills & Career Identity',
    slug: 'professional-skills-identity',
    domain: 'professional',
    description: 'Develop time management, workplace soft skills, asynchronous communication, and credible professional profiles.',
    target_audience: 'Students preparing for internships, college admissions, and modern professional environments',
    prerequisites: ['None'],
    course_ids: [
      'course-prof-time',
      'course-prof-workplace',
      'course-prof-softskills',
      'course-prof-identity',
    ],
  },
];

export const ALL_COURSES: Course[] = [
  // ==================================================================
  // CATEGORY 1: TECHNOLOGY (8 SUBJECTS)
  // ==================================================================
  {
    id: 'course-ai-fund',
    title: 'Artificial Intelligence and Practical AI Tools',
    slug: 'ai-tools',
    domain: 'technology',
    subject: 'Artificial Intelligence and practical AI tools',
    level: 'beginner',
    summary: 'Machine learning fundamentals, neural networks, prompting heuristics, generative tooling, and cognitive workflow automation.',
    description: 'Deconstruct how modern AI models operate from first principles. Students evaluate transformer architectures, implement practical prompting patterns, and explore real-world AI applications.',
    learning_objectives: [
      'Understand training data, weights, inference, and probabilistic token generation',
      'Construct deterministic prompts using few-shot heuristics and system constraints',
      'Integrate AI productivity tools into software engineering and research workflows',
    ],
    prerequisites: ['Basic computing literacy'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-02').toISOString(),
    modules: [
      {
        id: 'mod-ai-1',
        course_id: 'course-ai-fund',
        title: 'Module 1: Machine Learning Core Mechanics',
        order_index: 1,
        lessons: [
          {
            id: 'les-ai-101',
            module_id: 'mod-ai-1',
            title: 'Lesson 1: Vectors, Embeddings & Probabilistic Tokens',
            order_index: 1,
            summary: 'How text is tokenized, mapped into multi-dimensional vector space, and processed by attention heads.',
            duration_minutes: 25,
            content_markdown: `### How Modern Language Models Process Text

At its foundation, an AI language model does not "understand" language in the biological sense; it performs **next-token probability estimation** across high-dimensional semantic spaces.

\`\`\`
Text -> Tokenizer -> Input Tokens -> High-Dimensional Embedding -> Transformer Layers -> Output Logits -> Next Token
\`\`\`

1. **Tokenization:** Sentences are decomposed into sub-word tokens (~4 characters per token in English).
2. **Vector Embeddings:** Each token is projected into a dense semantic vector (often 4,096 to 12,288 dimensions).
3. **Self-Attention:** The transformer measures relational relevance between tokens across the entire input sequence.`,
            quiz: {
              id: 'quiz-ai-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What mathematical entity represents a word or concept in modern transformer models?',
                  options: [
                    'A scalar integer counter',
                    'A high-dimensional numerical vector (embedding)',
                    'An alphabetical index pointer',
                    'A single relational database table key',
                  ],
                  correct_option_index: 1,
                  explanation: 'Tokens are mapped into high-dimensional geometric spaces where proximity corresponds to semantic relationship.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-ai-2',
        course_id: 'course-ai-fund',
        title: 'Module 2: Practical Engineering with AI Tools',
        order_index: 2,
        lessons: [
          {
            id: 'les-ai-102',
            module_id: 'mod-ai-2',
            title: 'Lesson 2: Few-Shot Prompting, Constraints & Tool Calling',
            order_index: 1,
            summary: 'Structuring prompts with explicit constraints, negative examples, and structured JSON output formats.',
            duration_minutes: 25,
            content_markdown: `### Structuring High-Reliability AI Prompts
When integrating AI assistants into production workflows, vague natural language yields non-deterministic results. High-reliability prompting relies on three core tenets:
1. **Explicit Role & Boundary Constraints**
2. **Few-Shot Exemplars (Demonstrating Target Transformations)**
3. **Structured Output Schemas (e.g. JSON or Markdown Tables)**`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-ai-resp',
    title: 'Responsible AI',
    slug: 'responsible-ai',
    domain: 'technology',
    subject: 'Responsible AI',
    level: 'intermediate',
    summary: 'Algorithmic bias, hallucination mitigation, intellectual property, safety guardrails, and transparency in automated decision systems.',
    description: 'Examine the ethical, societal, and security implications of deploying artificial intelligence at scale. Learn to detect training set skew, evaluate fairness metrics, and construct robust human-in-the-loop validation checkpoints.',
    learning_objectives: [
      'Identify dataset distribution skew and systemic algorithmic bias',
      'Implement prompt injection defenses and automated safety guardrails',
      'Design human-in-the-loop workflows for high-stakes decision domains',
    ],
    prerequisites: ['Artificial Intelligence and practical AI tools'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-05').toISOString(),
    modules: [
      {
        id: 'mod-air-1',
        course_id: 'course-ai-resp',
        title: 'Module 1: Bias, Skew & Representation',
        order_index: 1,
        lessons: [
          {
            id: 'les-air-101',
            module_id: 'mod-air-1',
            title: 'Lesson 1: Measuring Bias in Training Corpus Distributions',
            order_index: 1,
            summary: 'How historical inequalities are encoded into web-scale text corpora and amplified during fine-tuning.',
            duration_minutes: 25,
            content_markdown: `### Training Corpus Skew
Machine learning models reflect the statistical distribution of their training datasets. If historical data encodes biases or underrepresents specific populations, the unconstrained model will reproduce and amplify those patterns in automated scoring.`,
            quiz: {
              id: 'quiz-air-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Why do automated machine learning models frequently replicate historical bias?',
                  options: [
                    'Because computers inherently hold personal preferences',
                    'Because models learn the statistical patterns of historical training corpora without moral judgment',
                    'Because of hardware overheating during training loops',
                    'Because of network latency in API calls',
                  ],
                  correct_option_index: 1,
                  explanation: 'Models minimize statistical loss against training data; if that data reflects historical disparities, the model reproduces them.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-air-2',
        course_id: 'course-ai-resp',
        title: 'Module 2: Hallucination & Prompt Injection',
        order_index: 2,
        lessons: [
          {
            id: 'les-air-102',
            module_id: 'mod-air-2',
            title: 'Lesson 2: Indirect Prompt Injections & Jailbreak Vectors',
            order_index: 1,
            summary: 'Understanding adversarial input payloads that subvert system instructions and model alignment.',
            duration_minutes: 25,
            content_markdown: `### Adversarial Attacks on LLMs
Indirect prompt injection occurs when an untrusted external text (such as an email, PDF, or scraped website) contains instructions designed to hijack the agentic model execution loop.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-blockchain-fund',
    title: 'Blockchain',
    slug: 'blockchain-fundamentals',
    domain: 'technology',
    subject: 'Blockchain',
    level: 'intermediate',
    summary: 'Cryptographic hashing, Merkle trees, distributed consensus, immutability, smart contract architectures, and security trade-offs.',
    description: 'Demystify distributed ledger technology by dissecting its core computer science components: cryptographic hashes, asymmetric signatures, peer-to-peer gossip networks, and consensus protocols.',
    learning_objectives: [
      'Calculate SHA-256 block hashes and construct verified Merkle proof trees',
      'Compare Proof-of-Work, Proof-of-Stake, and BFT consensus models',
      'Analyze smart contract vulnerabilities and state transition constraints',
    ],
    prerequisites: ['Computing fundamentals'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-12').toISOString(),
    modules: [
      {
        id: 'mod-bc-1',
        course_id: 'course-blockchain-fund',
        title: 'Module 1: Cryptographic Primitives',
        order_index: 1,
        lessons: [
          {
            id: 'les-bc-101',
            module_id: 'mod-bc-1',
            title: 'Lesson 1: SHA-256, Merkle Trees & Cryptographic Linking',
            order_index: 1,
            summary: 'How linked cryptographic hashes create tamper-evident sequential chains.',
            duration_minutes: 25,
            content_markdown: `### Hash Pointer Immutability
Each block in a blockchain contains a cryptographic hash of the entire preceding block. Altering a historical transaction changes its hash, invalidating every subsequent block in the chain.`,
          },
        ],
      },
      {
        id: 'mod-bc-2',
        course_id: 'course-blockchain-fund',
        title: 'Module 2: Consensus Protocols',
        order_index: 2,
        lessons: [
          {
            id: 'les-bc-102',
            module_id: 'mod-bc-2',
            title: 'Lesson 2: Byzantine Fault Tolerance & Sybil Resistance',
            order_index: 1,
            summary: 'Reaching distributed agreement across untrusted network participants without central authorities.',
            duration_minutes: 25,
            content_markdown: `### Distributed Consensus
Solving the Byzantine Generals Problem allows independent nodes to achieve absolute state consensus across unreliable internet networks.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-iot-fund',
    title: 'Internet of Things (IoT)',
    slug: 'iot-fundamentals',
    domain: 'technology',
    subject: 'Internet of Things (IoT)',
    level: 'intermediate',
    summary: 'Microcontrollers, sensor telemetry, MQTT publish-subscribe protocols, edge processing, and hardware security.',
    description: 'Explore how physical computing bridges digital software with physical reality. Analyze embedded architectures (ESP32, Raspberry Pi), telemetry pipelines, low-latency protocols, and device authentication.',
    learning_objectives: [
      'Configure lightweight MQTT publish/subscribe messaging topologies',
      'Process analog and digital sensor telemetry with noise filtering',
      'Implement device authentication and secure over-the-air (OTA) updates',
    ],
    prerequisites: ['Computing fundamentals'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-14').toISOString(),
    modules: [
      {
        id: 'mod-iot-1',
        course_id: 'course-iot-fund',
        title: 'Module 1: Telemetry & Protocol Stacks',
        order_index: 1,
        lessons: [
          {
            id: 'les-iot-101',
            module_id: 'mod-iot-1',
            title: 'Lesson 1: MQTT Architecture vs HTTP for Low-Power Devices',
            order_index: 1,
            summary: 'Why pub/sub socket architectures outperform request/response on battery-constrained microcontrollers.',
            duration_minutes: 25,
            content_markdown: `### MQTT Protocol Efficiency
MQTT uses an extremely lightweight 2-byte fixed header, making it orders of magnitude more bandwidth-efficient than HTTP for sensor bursts.`,
          },
        ],
      },
      {
        id: 'mod-iot-2',
        course_id: 'course-iot-fund',
        title: 'Module 2: Edge Computing & Hardware Security',
        order_index: 2,
        lessons: [
          {
            id: 'les-iot-102',
            module_id: 'mod-iot-2',
            title: 'Lesson 2: Hardware Root of Trust & Secure Device Boot',
            order_index: 1,
            summary: 'Protecting connected smart devices against unauthorized firmware flashing and physical bus sniffing.',
            duration_minutes: 25,
            content_markdown: `### Securing Edge Devices
Embedded devices deployed in public environments must encrypt flash memory and verify cryptographic signatures during boot cycles.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-ms-tech',
    title: 'Microsoft technologies',
    slug: 'microsoft-technologies',
    domain: 'technology',
    subject: 'Microsoft technologies',
    level: 'intermediate',
    summary: 'Azure cloud architecture, Active Directory, C# and .NET runtime, PowerShell automation, and enterprise governance.',
    description: 'Analyze enterprise technology foundations powered by Microsoft ecosystems. Learn cloud compute scaling on Azure, role-based access control with Entra ID, and scalable backend services.',
    learning_objectives: [
      'Design cloud topologies using Azure App Services, Blob Storage, and Virtual Networks',
      'Manage enterprise identities and zero-trust policies in Microsoft Entra ID',
      'Automate administrative workflows using structured PowerShell scripting',
    ],
    prerequisites: ['Computing fundamentals'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-15').toISOString(),
    modules: [
      {
        id: 'mod-ms-1',
        course_id: 'course-ms-tech',
        title: 'Module 1: Enterprise Cloud & Identity',
        order_index: 1,
        lessons: [
          {
            id: 'les-ms-101',
            module_id: 'mod-ms-1',
            title: 'Lesson 1: Azure Resource Hierarchies & Entra ID Zero-Trust',
            order_index: 1,
            summary: 'Subscriptions, resource groups, managed identities, and conditional access policies.',
            duration_minutes: 25,
            content_markdown: `### Azure Enterprise Governance
Azure organizes assets into Management Groups -> Subscriptions -> Resource Groups -> Resources, applying RBAC policies deterministically down the hierarchy.`,
          },
        ],
      },
      {
        id: 'mod-ms-2',
        course_id: 'course-ms-tech',
        title: 'Module 2: Modern .NET Runtime & Automation',
        order_index: 2,
        lessons: [
          {
            id: 'les-ms-102',
            module_id: 'mod-ms-2',
            title: 'Lesson 2: Cross-Platform .NET Core & PowerShell Automation',
            order_index: 1,
            summary: 'High-performance CLR runtime compilation and object-pipeline administrative automation.',
            duration_minutes: 25,
            content_markdown: `### Object-Oriented Scripting
Unlike Bash which pipes unstructured plain text, PowerShell passes rich typed .NET objects down its pipeline.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-privacy-footprint',
    title: 'Digital Privacy and Digital Footprint',
    slug: 'digital-privacy-footprint',
    domain: 'technology',
    subject: 'Digital Privacy and Digital Footprint',
    level: 'beginner',
    summary: 'Browser fingerprinting, telemetry collection, third-party cookies, data broker ecosystems, DPDP Act 2023, and defensive posture.',
    description: 'Understand how personal data is harvested across web platforms, and learn actionable methods to audit, restrict, and safeguard your online footprint in accordance with Indian and global privacy regulations.',
    learning_objectives: [
      'Inspect canvas fingerprinting, WebRTC IP leakage, and HTTP tracking headers',
      'Exercise rights under India\'s Digital Personal Data Protection (DPDP) Act 2023',
      'Deploy password managers, multi-factor authentication, and encrypted communications',
    ],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-07').toISOString(),
    modules: [
      {
        id: 'mod-dp-1',
        course_id: 'course-privacy-footprint',
        title: 'Module 1: Passive Web Telemetry & Tracking',
        order_index: 1,
        lessons: [
          {
            id: 'les-dp-101',
            module_id: 'mod-dp-1',
            title: 'Lesson 1: Device Fingerprinting Beyond Cookies',
            order_index: 1,
            summary: 'How fonts, screen resolution, audio context, and GPU renderer create unique tracking hashes.',
            duration_minutes: 20,
            content_markdown: `### Modern Passive Fingerprinting
Even when cookies and local storage are cleared, websites can compute a unique entropy hash from your browser environment.`,
            quiz: {
              id: 'quiz-dp-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Why is device fingerprinting more invasive than standard HTTP cookies?',
                  options: [
                    'It consumes more battery power on mobile phones',
                    'It operates statelessly without storing files on the user machine, making simple cookie clearing ineffective',
                    'It only works when connected to public Wi-Fi networks',
                    'It requires root administrative access to your computer',
                  ],
                  correct_option_index: 1,
                  explanation: 'Fingerprinting uses inherent device characteristics rather than client-stored state, making it resilient to cookie clearing.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-dp-2',
        course_id: 'course-privacy-footprint',
        title: 'Module 2: Indian DPDP Act 2023 & Defensive Posture',
        order_index: 2,
        lessons: [
          {
            id: 'les-dp-102',
            module_id: 'mod-dp-2',
            title: 'Lesson 2: Citizen Rights, Consent Managers & Minor Safeguards',
            order_index: 1,
            summary: 'Navigating statutory rights: right to access, right to correction, and mandatory verifiable parental consent.',
            duration_minutes: 20,
            content_markdown: `### Digital Personal Data Protection Act 2023
The DPDP Act establishes strict obligations on Data Fiduciaries in India, including verifiable parental consent for individuals under 18 years of age.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-web-sec',
    title: 'Cybersecurity and Defensive Web Security',
    slug: 'cybersecurity-defensive-web',
    domain: 'technology',
    subject: 'Cybersecurity and Defensive Web Security',
    level: 'beginner',
    summary: 'Defensive web security, HTTP security headers, authentication protocols, XSS and CSRF mitigations, and defense-in-depth architecture.',
    description: 'Explore modern web application defense mechanisms. Students learn to implement Content Security Policy (CSP), secure session authentication, Cross-Origin Resource Sharing (CORS) rules, and rigorous server-side input validation.',
    learning_objectives: [
      'Analyze how HTTP requests and response headers protect client-server communication',
      'Identify and remediate Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)',
      'Implement robust password hashing with modern algorithms like Argon2 and bcrypt',
      'Apply defense-in-depth principles across frontend, API gateway, and database layers',
    ],
    prerequisites: ['Basic understanding of web browsers and HTTP fundamentals'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-01').toISOString(),
    modules: [
      {
        id: 'mod-sec-1',
        course_id: 'course-web-sec',
        title: 'Module 1: Web Threat Modeling & Browser Security Controls',
        order_index: 1,
        lessons: [
          {
            id: 'les-sec-101',
            module_id: 'mod-sec-1',
            title: 'Lesson 1: Same-Origin Policy & HTTP Defense Headers',
            order_index: 1,
            summary: 'How modern browsers enforce origin isolation and how headers like CSP and HSTS mitigate attacks.',
            duration_minutes: 25,
            content_markdown: `### The Same-Origin Policy & Defense in Depth

In web security, the **Same-Origin Policy (SOP)** is the fundamental security model of web browsers:
- Two URLs have the same origin if the **protocol**, **host**, and **port** are identical.
- Without SOP, any malicious website you visit could issue authenticated background requests to your bank or email!

#### Essential HTTP Defense Headers:
1. **Content-Security-Policy (CSP):** Restricts the sources of scripts, styles, and images that the browser is permitted to execute.
2. **Strict-Transport-Security (HSTS):** Enforces HTTPS encrypted transport exclusively.
3. **X-Content-Type-Options:** Prevents MIME-type sniffing attacks.
4. **X-Frame-Options / frame-ancestors:** Prevents clickjacking by forbidding unauthorized framing.`,
            quiz: {
              id: 'quiz-sec-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What three components must match for two web URLs to share the Same Origin?',
                  options: [
                    'Protocol, Host, and Port',
                    'Domain, Top-Level Domain, and Path',
                    'IP Address, MAC Address, and Browser',
                    'User Agent, Operating System, and Cookie',
                  ],
                  correct_option_index: 0,
                  explanation: 'Same-Origin Policy requires the exact same protocol (e.g. https), hostname (e.g. geniusphere.tech), and port (e.g. 443).',
                },
                {
                  id: 'q2',
                  prompt: 'Which HTTP response header actively prevents clickjacking attacks?',
                  options: ['X-Frame-Options', 'Accept-Encoding', 'Content-Encoding', 'User-Agent'],
                  correct_option_index: 0,
                  explanation: 'X-Frame-Options (or CSP frame-ancestors) instructs the browser whether the page can be embedded in an iframe.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-sec-2',
        course_id: 'course-web-sec',
        title: 'Module 2: Authentication & Input Sanitization',
        order_index: 2,
        lessons: [
          {
            id: 'les-sec-102',
            module_id: 'mod-sec-2',
            title: 'Lesson 2: Token-Based Authentication & Defense Against Attacks',
            order_index: 1,
            summary: 'Secure session tokens, HTTP-only cookies, password hashing with salt, and strict input validation schemas.',
            duration_minutes: 25,
            content_markdown: `### Secure Session Management & Input Validation

Storing passwords in plaintext or using outdated hash algorithms (like MD5 or SHA1) is fatal. Modern applications use **slow, memory-hard key derivation functions**:
- **Argon2id** (current gold standard)
- **bcrypt** (battle-tested with adaptive cost work factors)

#### Securing Session Tokens:
1. Store session identifiers in **HttpOnly, Secure, SameSite=Strict** cookies.
2. HttpOnly prevents client-side JavaScript from reading the cookie, mitigating credential theft via Cross-Site Scripting (XSS).
3. Always validate untrusted input strictly on the server against an explicit allowlist schema.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-comp-fund',
    title: 'Computing Fundamentals',
    slug: 'computing-fundamentals',
    domain: 'technology',
    subject: 'Computing Fundamentals',
    level: 'beginner',
    summary: 'Von Neumann architecture, binary logic gates, CPU fetch-decode-execute cycles, memory hierarchies, and OS fundamentals.',
    description: 'Ground your technical education in the bedrock of computer science. Dissect binary representations, CPU registers, cache tiers (L1/L2/L3), RAM, storage persistence, and operating system process scheduling.',
    learning_objectives: [
      'Translate numerical and character data into binary, octal, and hexadecimal encodings',
      'Trace the CPU instruction fetch-decode-execute cycle and register state updates',
      'Compare memory hierarchy latencies from L1 CPU cache to NVMe storage',
    ],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-technology',
    created_at: new Date('2026-09-08').toISOString(),
    modules: [
      {
        id: 'mod-cf-1',
        course_id: 'course-comp-fund',
        title: 'Module 1: Binary Representation & Logic',
        order_index: 1,
        lessons: [
          {
            id: 'les-cf-101',
            module_id: 'mod-cf-1',
            title: 'Lesson 1: Bits, Bytes, Two\'s Complement & Boolean Gates',
            order_index: 1,
            summary: 'How microscopic transistors implement AND, OR, NOT, and XOR gates to perform integer arithmetic.',
            duration_minutes: 25,
            content_markdown: `### The Transistor as a Binary Switch
All modern digital computing emerges from billions of microscopic field-effect transistors acting as electrical switches:
- **Voltage High (1)** represents True.
- **Voltage Low (0)** represents False.

Combining transistors creates boolean logic gates: AND, OR, NOT, and XOR. Chaining these gates creates full adders that perform arithmetic.`,
            quiz: {
              id: 'quiz-cf-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'How many distinct values can be represented by a single standard 8-bit byte?',
                  options: ['128', '256', '512', '1024'],
                  correct_option_index: 1,
                  explanation: '2 raised to the 8th power equals 256 distinct combinations (0 through 255 in unsigned integer notation).',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-cf-2',
        course_id: 'course-comp-fund',
        title: 'Module 2: CPU Execution & Memory Hierarchy',
        order_index: 2,
        lessons: [
          {
            id: 'les-cf-102',
            module_id: 'mod-cf-2',
            title: 'Lesson 2: The Fetch-Decode-Execute Cycle & Cache Latencies',
            order_index: 1,
            summary: 'How instruction pointers retrieve opcodes from memory and execute operations in arithmetic logic units.',
            duration_minutes: 25,
            content_markdown: `### The Von Neumann Cycle
1. **Fetch:** CPU retrieves the instruction at the memory address stored in the Program Counter (PC).
2. **Decode:** Control unit decodes opcode and registers.
3. **Execute:** Arithmetic Logic Unit (ALU) performs computation and stores result.`,
          },
        ],
      },
    ],
  },

  // ==================================================================
  // CATEGORY 2: FINANCE (7 SUBJECTS)
  // ==================================================================
  {
    id: 'course-fin-intro',
    title: 'Introduction to Finance',
    slug: 'intro-to-finance',
    domain: 'finance',
    subject: 'Introduction to Finance',
    level: 'beginner',
    summary: 'Time value of money, compound growth, inflation metrics, budgeting frameworks, debt mechanics, and financial sovereignty.',
    description: 'Learn the foundational laws of economics and personal financial security. Dissect the mathematical power of compound interest, understand how inflation diminishes purchasing power, and implement resilient zero-based budgeting.',
    learning_objectives: [
      'Calculate compound interest and analyze nominal vs. real returns adjusted for inflation',
      'Implement the 50/30/20 budget framework adapted for Indian household expenditures',
      'Compare high-interest debt amortization schedules to minimize financing costs',
    ],
    prerequisites: ['Basic arithmetic'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-finance',
    created_at: new Date('2026-09-02').toISOString(),
    modules: [
      {
        id: 'mod-fi-1',
        course_id: 'course-fin-intro',
        title: 'Module 1: The Mathematics of Compounding',
        order_index: 1,
        lessons: [
          {
            id: 'les-fi-101',
            module_id: 'mod-fi-1',
            title: 'Lesson 1: Compound Interest, Inflation & Purchasing Power',
            order_index: 1,
            summary: 'How exponential compounding builds long-term wealth, and how inflation silently erodes idle cash.',
            duration_minutes: 25,
            content_markdown: `### Compound Interest: The Exponential Multiplier

The formula for compound interest demonstrates why early savings yield disproportionate financial outcomes:

$$A = P \\times (1 + r/n)^{nt}$$

- **A:** Final accrued balance
- **P:** Initial principal investment
- **r:** Annual interest rate
- **n:** Compounding periods per year
- **t:** Number of years invested

#### The Destructive Impact of Inflation:
If inflation averages 6% annually in India, your money loses half its purchasing power in approximately 12 years (Rule of 72). Money parked in low-interest accounts loses purchasing power every single day!`,
            quiz: {
              id: 'quiz-fi-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'According to the Rule of 72, approximately how many years does it take for money to double at an 8% annual return?',
                  options: ['4 years', '9 years', '12 years', '16 years'],
                  correct_option_index: 1,
                  explanation: '72 divided by 8 equals 9 years.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-fi-2',
        course_id: 'course-fin-intro',
        title: 'Module 2: Practical Budgeting & Liquidity Reserves',
        order_index: 2,
        lessons: [
          {
            id: 'les-fi-102',
            module_id: 'mod-fi-2',
            title: 'Lesson 2: Emergency Funds, Debt Elimination & Liquid Reserves',
            order_index: 1,
            summary: 'Constructing 6-month living expense buffers and deploying the avalanche debt reduction method.',
            duration_minutes: 25,
            content_markdown: `### The Emergency Reserve
Before allocating capital to speculative assets, a prudent individual establishes a 6-month liquid buffer in high-liquidity instruments to weather unexpected disruptions.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-events',
    title: 'Global Events and Finance',
    slug: 'global-events-finance',
    domain: 'finance',
    subject: 'Global Events and Finance',
    level: 'intermediate',
    summary: 'Geopolitics, supply chain disruptions, energy crises, trade tariffs, central bank interest rate shocks, and currency swings.',
    description: 'Explore how international conflicts, trade sanctions, shipping chokepoint closures, and pandemic shocks ripple across global bond, equity, and commodity markets.',
    learning_objectives: [
      'Trace macroeconomic feedback loops from supply shocks to domestic inflation',
      'Analyze the impact of Federal Reserve and Reserve Bank of India policy shifts',
      'Understand currency exchange rate fluctuations and foreign reserve dynamics',
    ],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-finance',
    created_at: new Date('2026-09-11').toISOString(),
    modules: [
      {
        id: 'mod-fe-1',
        course_id: 'course-fin-events',
        title: 'Module 1: Macro Shocks & Commodity Cycles',
        order_index: 1,
        lessons: [
          {
            id: 'les-fe-101',
            module_id: 'mod-fe-1',
            title: 'Lesson 1: Oil Shocks, Maritime Bottlenecks & Cost-Push Inflation',
            order_index: 1,
            summary: 'How crude oil price spikes increase transport costs across every segment of consumer goods.',
            duration_minutes: 25,
            content_markdown: `### Supply-Side Macro Shocks
Because energy is an input cost for manufacturing, agriculture, and logistics, an energy shock quickly transmits into aggregate consumer price indices.`,
          },
        ],
      },
      {
        id: 'mod-fe-2',
        course_id: 'course-fin-events',
        title: 'Module 2: Central Bank Contagion',
        order_index: 2,
        lessons: [
          {
            id: 'les-fe-102',
            module_id: 'mod-fe-2',
            title: 'Lesson 2: Interest Rate Differentials & Emerging Market Capital Flows',
            order_index: 1,
            summary: 'Why rising interest rates in developed markets pull capital out of developing economies.',
            duration_minutes: 25,
            content_markdown: `### Global Capital Flight
When central banks in reserve currency nations raise rates, global capital flows toward safe sovereign yields, putting pressure on emerging market currencies.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-markets',
    title: 'Financial Markets',
    slug: 'financial-markets',
    domain: 'finance',
    subject: 'Financial Markets',
    level: 'intermediate',
    summary: 'Primary and secondary markets, bond markets, equity indices, liquidity order books, bid-ask spreads, and clearing houses.',
    description: 'Uncover the infrastructure that powers global capital exchange. Learn how companies raise equity and debt, how order matching engines execute trades in microseconds, and the role of clearing institutions.',
    learning_objectives: [
      'Explain the difference between primary capital issuance (IPOs) and secondary market trading',
      'Read depth-of-market order books and calculate bid-ask spread friction',
      'Understand bond yields, coupon payments, and inverse price relationships',
    ],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-finance',
    created_at: new Date('2026-09-04').toISOString(),
    modules: [
      {
        id: 'mod-fm-1',
        course_id: 'course-fin-markets',
        title: 'Module 1: Market Structure & Order Mechanics',
        order_index: 1,
        lessons: [
          {
            id: 'les-fm-101',
            module_id: 'mod-fm-1',
            title: 'Lesson 1: Limit Orders, Market Orders & Clearing Houses',
            order_index: 1,
            summary: 'How central limit order books (CLOB) pair buyers with sellers and settle trades safely.',
            duration_minutes: 25,
            content_markdown: `### Market Microstructure
1. **Limit Orders:** Specify a price and wait for matching volume.
2. **Market Orders:** Cross the spread immediately to execute at current prices.
3. **Clearing Corporations:** Act as the central counterparty to eliminate bilateral default risk.`,
            quiz: {
              id: 'quiz-fm-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What role does a central clearing corporation play in financial exchanges like NSE or BSE?',
                  options: [
                    'It guarantees settlement of trades by acting as buyer to every seller and seller to every buyer',
                    'It determines the daily share price of all stocks arbitrarily',
                    'It lends money directly to retail day traders',
                    'It prevents foreign investors from purchasing shares',
                  ],
                  correct_option_index: 0,
                  explanation: 'Clearing corporations remove counterparty risk by guaranteeing that trades settle even if one participant defaults.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-fm-2',
        course_id: 'course-fin-markets',
        title: 'Module 2: Fixed Income & Debt Instruments',
        order_index: 2,
        lessons: [
          {
            id: 'les-fm-102',
            module_id: 'mod-fm-2',
            title: 'Lesson 2: Sovereign Bonds, Yield Curves & Duration Risk',
            order_index: 1,
            summary: 'Why bond prices move inversely to interest rates and what an inverted yield curve signals.',
            duration_minutes: 25,
            content_markdown: `### The Bond Mathematics
When prevailing interest rates rise, newly issued bonds pay higher yields. Consequently, older existing bonds with lower fixed coupons become less attractive, driving their market prices down.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-fin-institutions',
    title: 'Financial Institutions',
    slug: 'financial-institutions',
    domain: 'finance',
    subject: 'Financial Institutions',
    level: 'intermediate',
    summary: 'Commercial banks, central banks (RBI/Fed), fractional reserve banking, monetary transmission, insurance, and NBFCs.',
    description: 'Explore the institutional architecture of financial stability. Analyze how the Reserve Bank of India modulates liquidity via the repo rate, how commercial banks create deposits through lending, and how NBFCs expand credit.',
    learning_objectives: [
      'Trace the money creation process under fractional reserve banking systems',
      'Explain RBI policy levers: Cash Reserve Ratio (CRR), Statutory Liquidity Ratio (SLR), and Repo Rate',
      'Analyze the systemic risks of shadow banking and non-banking financial companies (NBFCs)',
    ],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-finance',
    created_at: new Date('2026-09-07').toISOString(),
    modules: [
      {
        id: 'mod-finst-1',
        course_id: 'course-fin-institutions',
        title: 'Module 1: The Central Banking Mandate',
        order_index: 1,
        lessons: [
          {
            id: 'les-finst-101',
            module_id: 'mod-finst-1',
            title: 'Lesson 1: The Repo Rate & Liquidity Adjustment Facility',
            order_index: 1,
            summary: 'How central bank overnight lending rates dictate the cost of capital across the commercial economy.',
            duration_minutes: 25,
            content_markdown: `### Monetary Policy Levers
When inflation exceeds target tolerance bands (e.g. 4% +/- 2% in India), the central bank raises the repo rate. Commercial banks raise loan interest rates, cooling demand and inflation.`,
            quiz: {
              id: 'quiz-finst-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What happens to commercial borrowing rates when the central bank increases its policy repo rate?',
                  options: [
                    'Loan interest rates typically rise across the banking system',
                    'Loan interest rates drop to zero automatically',
                    'All outstanding bank loans are forgiven',
                    'Commercial banks cease taking savings deposits',
                  ],
                  correct_option_index: 0,
                  explanation: 'A higher repo rate increases borrowing costs for banks, which pass the higher rates onto consumer and corporate borrowers.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-finst-2',
        course_id: 'course-fin-institutions',
        title: 'Module 2: Fractional Reserves & Bank Runs',
        order_index: 2,
        lessons: [
          {
            id: 'les-finst-102',
            module_id: 'mod-finst-2',
            title: 'Lesson 2: Liquidity Coverage Ratios & Deposit Insurance (DICGC)',
            order_index: 1,
            summary: 'How deposit insurance schemes protect retail savers against commercial bank insolvency.',
            duration_minutes: 25,
            content_markdown: `### Deposit Insurance
In India, the Deposit Insurance and Credit Guarantee Corporation (DICGC) insures bank deposits up to Rs 5 lakh per depositor per bank, maintaining retail trust.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-crypto-eval',
    title: 'Cryptocurrency Education and Risks',
    slug: 'cryptocurrency-education-risks',
    domain: 'finance',
    subject: 'Cryptocurrency Education and Risks',
    level: 'intermediate',
    summary: 'Decentralized assets, cryptographic keys, market volatility, liquidity risks, regulatory status, and scam recognition.',
    description: 'An evidence-based, critical evaluation of cryptocurrencies and decentralized finance. Learn the underlying cryptographic mechanics while objectively analyzing extreme volatility, lack of sovereign backing, liquidity traps, and predatory fraud vectors.',
    learning_objectives: [
      'Contrast custodial centralized exchanges with non-custodial cryptographic hardware wallets',
      'Analyze liquidity concentration, wash trading, and market manipulation in crypto markets',
      'Recognize high-yield Ponzi mechanisms, phishing schemes, and rug-pull smart contracts',
    ],
    prerequisites: ['Introduction to Finance'],
    duration_hours: 4,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-finance',
    created_at: new Date('2026-09-10').toISOString(),
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
Transactions are signed using asymmetric private keys and verified publicly across distributed node networks without sovereign backing.`,
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
Cryptocurrencies lack sovereign guarantees, exhibit extreme volatility, and expose retail participants to predatory liquidity schemes and irreversible transaction losses.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-stock-market',
    title: 'Stock Market',
    slug: 'stock-market',
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
    learning_path_id: 'path-finance',
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
    title: 'FinTech',
    slug: 'fintech',
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
    learning_path_id: 'path-finance',
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
  // CATEGORY 3: PROFESSIONAL SKILLS (4 SUBJECTS)
  // ==================================================================
  {
    id: 'course-prof-time',
    title: 'Time Management',
    slug: 'time-management',
    domain: 'professional',
    subject: 'Time Management',
    level: 'beginner',
    summary: 'Eisenhower matrix, deep work cycles, calendar blocking, task batching, and sustainable digital boundary setting.',
    description: 'Build intentional, disciplined daily operating systems designed to eliminate digital distraction and sustain high focus.',
    learning_objectives: ['Apply the Eisenhower decision matrix to daily tasks', 'Structure 90-minute uninterrupted deep work blocks'],
    prerequisites: ['None'],
    duration_hours: 3,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-professional',
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
1. **Urgent & Important:** Handle immediately.
2. **Non-Urgent but Important:** Schedule proactively — where highest career value is created.
3. **Urgent but Unimportant:** Delegate or automate.
4. **Neither:** Eliminate.`,
            quiz: {
              id: 'quiz-pt-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'In which quadrant of the Eisenhower Matrix is the highest long-term professional value created?',
                  options: [
                    'Urgent & Unimportant',
                    'Non-Urgent but Important (Quadrant 2)',
                    'Neither Urgent nor Important',
                    'Crisis Management only',
                  ],
                  correct_option_index: 1,
                  explanation: 'Quadrant 2 contains high-leverage proactive activities: skill acquisition, architecture planning, and relationship building.',
                },
              ],
            },
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
    title: 'Professional Skills',
    slug: 'professional-skills',
    domain: 'professional',
    subject: 'Professional Skills',
    level: 'beginner',
    summary: 'Workplace etiquette, project accountability, meeting hygiene, asynchronous documentation, and conflict resolution.',
    description: 'Transition smoothly from academic environments to high-performing professional engineering and business teams.',
    learning_objectives: ['Write clear, concise technical and status updates', 'Navigate team disagreements constructively'],
    prerequisites: ['None'],
    duration_hours: 4,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-professional',
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
            quiz: {
              id: 'quiz-pw-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What are the three essential components of an effective engineering standup update?',
                  options: [
                    'Personal opinions, lunch plans, and complaints',
                    'Completed deliverables, current work in progress, and active blockers',
                    'Code lines written, keyboard typing speed, and CPU temperature',
                    'Marketing summaries and company stock valuations',
                  ],
                  correct_option_index: 1,
                  explanation: 'Clear team communication focuses on what was shipped, what is actively progressing, and any blockers.',
                },
              ],
            },
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
    title: 'Soft Skills Development',
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
    learning_path_id: 'path-professional',
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
    title: 'Social Profiles and Professional Identity',
    slug: 'social-profiles-identity',
    domain: 'professional',
    subject: 'Social Profiles and Professional Identity',
    level: 'beginner',
    summary: 'Engineering authentic GitHub profiles, LinkedIn presence, technical writing, and public credibility.',
    description: 'Craft a coherent, credible digital presence that showcases authentic code contributions and technical thinking.',
    learning_objectives: ['Optimize a technical GitHub profile and project READMEs', 'Write substantive technical summaries'],
    prerequisites: ['None'],
    duration_hours: 3,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-professional',
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
            quiz: {
              id: 'quiz-pi-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What is the most effective element in a student technical project README on GitHub?',
                  options: [
                    'A 500-word autobiography of the author',
                    'A concise architecture overview, setup instructions, and reproducible automated test commands',
                    'A collection of colorful animated GIFs without explanation',
                    'An unedited copy of a tutorial with no attribution',
                  ],
                  correct_option_index: 1,
                  explanation: 'Technical evaluators look for architectural clarity, clear setup steps, and testable code.',
                },
              ],
            },
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

  // ==================================================================
  // CATEGORY 4: CODING AND PROGRAMMING (8 SUBJECTS)
  // ==================================================================
  {
    id: 'course-prog-fund',
    title: 'Programming Fundamentals',
    slug: 'programming-fundamentals',
    domain: 'coding',
    subject: 'Programming Fundamentals',
    level: 'beginner',
    summary: 'Algorithms, pseudocode, flowchart modeling, execution stacks, memory pointers, and problem decomposition.',
    description: 'Learn computational thinking and algorithmic problem solving from first principles before syntax memorization.',
    learning_objectives: ['Deconstruct complex real-world problems into discrete algorithmic steps', 'Trace program state transitions manually'],
    prerequisites: ['None'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'verified_functional',
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
            quiz: {
              id: 'quiz-pf-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'What is the primary objective of writing pseudocode before typing executable code?',
                  options: [
                    'To satisfy compiler optimization flags',
                    'To validate logical steps and problem decomposition independently of language syntax quirks',
                    'To test CPU clock frequency',
                    'To encrypt the program logic',
                  ],
                  correct_option_index: 1,
                  explanation: 'Pseudocode allows engineers to rigorously design and debug algorithms before implementing concrete syntax.',
                },
              ],
            },
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
    id: 'course-prog-variables',
    title: 'Variables and Data Types',
    slug: 'variables-data-types',
    domain: 'coding',
    subject: 'Variables and Data Types',
    level: 'beginner',
    summary: 'Scalar types, strings, numbers, booleans, arrays, type coercion, immutability, and memory representations.',
    description: 'Master the fundamental units of information in software systems. Explore static versus dynamic typing, memory layouts, primitives, references, and type conversion traps.',
    learning_objectives: [
      'Differentiate primitive value types from reference types and understand pointer mutation',
      'Prevent common type-coercion bugs and precision truncation in floating-point math',
      'Design clean, readable variable naming conventions that reflect domain semantics',
    ],
    prerequisites: ['Programming Fundamentals'],
    duration_hours: 4,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-09').toISOString(),
    modules: [
      {
        id: 'mod-pv-1',
        course_id: 'course-prog-variables',
        title: 'Module 1: Primitives & Memory Representation',
        order_index: 1,
        lessons: [
          {
            id: 'les-pv-101',
            module_id: 'mod-pv-1',
            title: 'Lesson 1: Integers, Floats, Strings, and Booleans',
            order_index: 1,
            summary: 'How computer memories store numbers and characters in IEEE 754 and UTF-8 encodings.',
            duration_minutes: 25,
            content_markdown: `### Primitive Data Types in Memory
1. **Integers:** Fixed bit-width whole numbers (8, 16, 32, 64-bit signed/unsigned).
2. **Floats:** IEEE 754 representations prone to rounding quirks (e.g. 0.1 + 0.2 != 0.3).
3. **Strings:** Byte sequences encoded in UTF-8.
4. **Booleans:** Single-bit logic flags (stored as a byte for address alignment).`,
            quiz: {
              id: 'quiz-pv-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Why does 0.1 + 0.2 not always equal 0.3 exactly in standard floating-point arithmetic?',
                  options: [
                    'Because computer processors make frequent arithmetic mistakes',
                    'Because fractional base-10 decimals like 0.1 become recurring fractions in base-2 binary floating point representation',
                    'Because the internet connection causes packet loss',
                    'Because variables are converted to strings automatically',
                  ],
                  correct_option_index: 1,
                  explanation: 'Just as 1/3 cannot be represented finitely in base 10, 1/10 cannot be represented finitely in base 2 floating point notation.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-pv-2',
        course_id: 'course-prog-variables',
        title: 'Module 2: References & Immutability',
        order_index: 2,
        lessons: [
          {
            id: 'les-pv-102',
            module_id: 'mod-pv-2',
            title: 'Lesson 2: Value vs Reference Semantics',
            order_index: 1,
            summary: 'Why modifying an array or object through a reference updates the original data structure.',
            duration_minutes: 25,
            content_markdown: `### References and Mutability
When you pass an object or array to a function, the reference pointer is passed, not a full deep copy. Mutating the object alters it everywhere that reference is held!`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-loops',
    title: 'Conditions and Loops',
    slug: 'conditions-and-loops',
    domain: 'coding',
    subject: 'Conditions and Loops',
    level: 'beginner',
    summary: 'Branching logic, boolean truth tables, short-circuit evaluation, while loops, for loops, and loop invariants.',
    description: 'Master the flow of execution in computer programs. Learn to write precise conditional branches, avoid nested if-else anti-patterns, and construct provably terminating loops.',
    learning_objectives: [
      'Evaluate complex boolean expressions with AND, OR, NOT and short-circuit evaluation',
      'Construct deterministic loops and establish loop invariants that guarantee termination',
      'Refactor deep nested conditional pyramids into clean guard clauses',
    ],
    prerequisites: ['Variables and Data Types'],
    duration_hours: 5,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-10').toISOString(),
    modules: [
      {
        id: 'mod-loop-1',
        course_id: 'course-prog-loops',
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
        course_id: 'course-prog-loops',
        title: 'Module 2: Iteration Across Data Structures',
        order_index: 2,
        lessons: [
          {
            id: 'les-loop-102',
            module_id: 'mod-loop-2',
            title: 'Lesson 2: Traversal, Early Exits & Break/Continue',
            order_index: 1,
            summary: 'Linear scans, finding matches, early termination with break, and skipping iterations with continue.',
            duration_minutes: 25,
            content_markdown: `### Loop Optimization & Guard Clauses
When searching for a needle in a haystack array of 10,000 items, break out of the loop the instant the target is found to avoid unnecessary iterations.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-comp-thinking',
    title: 'Computational Thinking and Problem Solving',
    slug: 'computational-thinking',
    domain: 'coding',
    subject: 'Computational Thinking and Problem Solving',
    level: 'intermediate',
    summary: 'Decomposition, pattern recognition, abstraction, algorithm design, edge-case analysis, and algorithmic complexity.',
    description: 'Cultivate the fundamental mental models that top software engineers use to transform ambiguous real-world requirements into elegant, efficient, and resilient computational solutions.',
    learning_objectives: [
      'Apply the four pillars of computational thinking: decomposition, pattern recognition, abstraction, algorithms',
      'Analyze asymptotic time and space complexity using Big-O notation',
      'Identify edge cases including empty inputs, boundary values, and integer overflows',
    ],
    prerequisites: ['Conditions and Loops'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-12').toISOString(),
    modules: [
      {
        id: 'mod-ct-1',
        course_id: 'course-prog-comp-thinking',
        title: 'Module 1: The Four Pillars of Computational Thinking',
        order_index: 1,
        lessons: [
          {
            id: 'les-ct-101',
            module_id: 'mod-ct-1',
            title: 'Lesson 1: Decomposition & Pattern Abstraction',
            order_index: 1,
            summary: 'Isolating independent sub-problems and building reusable abstractions.',
            duration_minutes: 25,
            content_markdown: `### The Four Pillars

1. **Decomposition:** Breaking a complex system into manageable sub-components.
2. **Pattern Recognition:** Observing recurring similarities across problems.
3. **Abstraction:** Focusing on essential properties while ignoring irrelevant details.
4. **Algorithm Design:** Formulating step-by-step instructions to solve any instance of the problem.`,
            quiz: {
              id: 'quiz-ct-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Which pillar of computational thinking involves filtering out specific details to create a generalized model?',
                  options: ['Decomposition', 'Pattern Recognition', 'Abstraction', 'Algorithm Design'],
                  correct_option_index: 2,
                  explanation: 'Abstraction removes non-essential details so the core logic can apply across multiple scenarios.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-ct-2',
        course_id: 'course-prog-comp-thinking',
        title: 'Module 2: Big-O Complexity & Efficiency',
        order_index: 2,
        lessons: [
          {
            id: 'les-ct-102',
            module_id: 'mod-ct-2',
            title: 'Lesson 2: Evaluating Time & Space Complexity',
            order_index: 1,
            summary: 'Understanding O(1), O(log n), O(n), and O(n²) scaling as inputs grow.',
            duration_minutes: 25,
            content_markdown: `### Asymptotic Analysis
Big-O measures how computational steps grow as input size N increases toward infinity. An algorithm that runs in O(n^2) will grind to a halt on large datasets, while an O(n log n) algorithm completes effortlessly.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-exercises',
    title: 'Programming Exercises',
    slug: 'programming-exercises',
    domain: 'coding',
    subject: 'Programming Exercises',
    level: 'intermediate',
    summary: 'Practical algorithmic challenges: string manipulation, array transformations, recursion, and search algorithms.',
    description: 'Build coding fluency and problem-solving resilience by tackling real-world programming challenges with automated unit test suites.',
    learning_objectives: ['Implement classic searching and sorting routines', 'Debug edge cases including null inputs and off-by-one errors'],
    prerequisites: ['Conditions and Loops'],
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
    id: 'course-prog-web-fund',
    title: 'Web Development Fundamentals',
    slug: 'web-development-fundamentals',
    domain: 'coding',
    subject: 'Web Development Fundamentals',
    level: 'beginner',
    summary: 'HTML5 semantic architecture, CSS flexbox/grid layouts, responsive design, JavaScript DOM manipulation, and HTTP clients.',
    description: 'Build modern, accessible, and fast web interfaces from scratch. Master semantic markup, responsive CSS architectures, event bubbling, and fetch API asynchronous networking.',
    learning_objectives: [
      'Author accessible HTML5 layouts adhering to WCAG 2.2 AA standards',
      'Create responsive flexbox and CSS grid layouts with fluid typography',
      'Manipulate browser DOM nodes and handle asynchronous fetch responses',
    ],
    prerequisites: ['Programming Fundamentals'],
    duration_hours: 6,
    is_published: true,
    availability_status: 'verified_functional',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-11').toISOString(),
    modules: [
      {
        id: 'mod-wdf-1',
        course_id: 'course-prog-web-fund',
        title: 'Module 1: Semantic HTML & Responsive CSS',
        order_index: 1,
        lessons: [
          {
            id: 'les-wdf-101',
            module_id: 'mod-wdf-1',
            title: 'Lesson 1: Document Trees, Semantic Tags & Flexbox Models',
            order_index: 1,
            summary: 'Constructing robust semantic page outlines with proper heading levels and responsive CSS.',
            duration_minutes: 25,
            content_markdown: `### The Semantic Web & CSS Layouts
Semantic elements (<main>, <nav>, <article>, <header>) communicate document hierarchy to screen readers and search crawlers.`,
            quiz: {
              id: 'quiz-wdf-101',
              questions: [
                {
                  id: 'q1',
                  prompt: 'Why should a web developer prefer semantic tags like <nav> or <button> over generic <div> tags?',
                  options: [
                    'They make web pages download faster from the server',
                    'They provide native accessibility, keyboard navigation, and screen-reader semantics out of the box',
                    'They are required by the CSS compiler to display color',
                    'They prevent users from copying text',
                  ],
                  correct_option_index: 1,
                  explanation: 'Semantic elements provide built-in keyboard accessibility, ARIA role mappings, and screen-reader tree integration.',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-wdf-2',
        course_id: 'course-prog-web-fund',
        title: 'Module 2: Client-Side Logic & Event Listeners',
        order_index: 2,
        lessons: [
          {
            id: 'les-wdf-102',
            module_id: 'mod-wdf-2',
            title: 'Lesson 2: Event Delegation, Forms & Async Fetch Requests',
            order_index: 1,
            summary: 'Handling user input, preventing default form submissions, and fetching JSON from APIs.',
            duration_minutes: 25,
            content_markdown: `### Asynchronous Web Communication
The Fetch API allows web pages to request data from REST servers without requiring a disruptive full-page browser refresh.`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-debugging',
    title: 'Practical Coding and Debugging',
    slug: 'practical-coding-debugging',
    domain: 'coding',
    subject: 'Practical Coding and Debugging',
    level: 'intermediate',
    summary: 'Chrome DevTools, breakpoints, stack trace inspection, memory leak diagnostics, unit testing with Vitest, and regression isolation.',
    description: 'Learn the diagnostic discipline that defines senior software engineers. Master browser breakpoints, conditional logpoints, stack unwinding, git bisect, and automated regression testing.',
    learning_objectives: [
      'Set interactive breakpoints and inspect scope chains and call stacks',
      'Diagnose and resolve common runtime exceptions (null pointer, off-by-one, race condition)',
      'Write repeatable unit tests in Vitest that isolate regressions',
    ],
    prerequisites: ['Web Development Fundamentals'],
    duration_hours: 5,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-18').toISOString(),
    modules: [
      {
        id: 'mod-debug-1',
        course_id: 'course-prog-debugging',
        title: 'Module 1: Diagnostic Breakpoints & DevTools',
        order_index: 1,
        lessons: [
          {
            id: 'les-debug-101',
            module_id: 'mod-debug-1',
            title: 'Lesson 1: Call Stack Unwinding & Scope Inspection',
            order_index: 1,
            summary: 'Pausing JavaScript execution to inspect lexical closures and variable values.',
            duration_minutes: 25,
            content_markdown: `### Professional Debugging vs console.log
Using interactive debugger breakpoints allows step-into, step-over, and step-out navigation across the live execution stack.`,
          },
        ],
      },
      {
        id: 'mod-debug-2',
        course_id: 'course-prog-debugging',
        title: 'Module 2: Automated Regression Testing',
        order_index: 2,
        lessons: [
          {
            id: 'les-debug-102',
            module_id: 'mod-debug-2',
            title: 'Lesson 2: Test-Driven Bug Fixing & Regression Proofs',
            order_index: 1,
            summary: 'Writing a failing test that reproduces a defect before applying the fix.',
            duration_minutes: 25,
            content_markdown: `### The Regression Test Cycle
1. Write a test asserting desired behavior (it fails).
2. Fix the underlying bug (it passes).
3. The test remains in CI forever to guarantee the bug never returns!`,
          },
        ],
      },
    ],
  },
  {
    id: 'course-prog-projects',
    title: 'Coding Projects',
    slug: 'coding-projects',
    domain: 'coding',
    subject: 'Coding Projects',
    level: 'advanced',
    summary: 'End-to-end full stack architecture, API contracts, local persistence, build tools (Vite/Rollup), and deploy pipelines.',
    description: 'Synthesize your programming skills by building comprehensive, production-grade applications with clean modular architecture, rigorous testing, and deployable builds.',
    learning_objectives: [
      'Architect full-stack web applications with clear domain layer separation',
      'Implement multi-tenant data isolation and client-side caching',
      'Bundle and optimize assets for low latency and zero layout shifts',
    ],
    prerequisites: ['Practical Coding and Debugging'],
    duration_hours: 8,
    is_published: false,
    availability_status: 'in_development',
    learning_path_id: 'path-coding',
    created_at: new Date('2026-09-20').toISOString(),
    modules: [
      {
        id: 'mod-cp-1',
        course_id: 'course-prog-projects',
        title: 'Module 1: Architecture & Domain Modeling',
        order_index: 1,
        lessons: [
          {
            id: 'les-cp-101',
            module_id: 'mod-cp-1',
            title: 'Lesson 1: Separation of Concerns & Clean Code Patterns',
            order_index: 1,
            summary: 'Decoupling database access, business rules, and UI presentations.',
            duration_minutes: 25,
            content_markdown: `### Clean Architectural Separation
Keeping business logic independent from UI frameworks ensures your core software remains testable and durable over decades.`,
          },
        ],
      },
      {
        id: 'mod-cp-2',
        course_id: 'course-prog-projects',
        title: 'Module 2: Production Readiness & Deployment',
        order_index: 2,
        lessons: [
          {
            id: 'les-cp-102',
            module_id: 'mod-cp-2',
            title: 'Lesson 2: CI/CD Pipelines, Linting & Production Bundles',
            order_index: 1,
            summary: 'Automating linting, type checks, and static asset minification.',
            duration_minutes: 25,
            content_markdown: `### Automated Continuous Integration
Production deployments must pass automated tests, linting gates, and type checks before shipping to users.`,
          },
        ],
      },
    ],
  },
];

export const INITIAL_VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'vid-comp-1',
    title: 'How Computers Work: Binary & Data Representation',
    description: 'Discover how electrical switches and logic gates represent text, images, and numbers inside modern microprocessors.',
    youtube_url: 'https://www.youtube.com/watch?v=mCq8-xTH7jA',
    youtube_id: 'mCq8-xTH7jA',
    category: 'technology',
    duration_minutes: 6,
    featured: true,
    instructor_name: 'Khan Academy & Code.org',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-15').toISOString(),
  },
  {
    id: 'vid-ai-1',
    title: 'Artificial Intelligence Explained Simply in 5 Minutes',
    description: 'Understand the difference between machine learning algorithms, deep neural networks, and generative language models.',
    youtube_url: 'https://www.youtube.com/watch?v=ad79nYk2keg',
    youtube_id: 'ad79nYk2keg',
    category: 'technology',
    duration_minutes: 7,
    featured: true,
    instructor_name: 'Simplilearn Engineering',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-18').toISOString(),
  },
  {
    id: 'vid-internet-1',
    title: 'How the Internet & Web Actually Work',
    description: 'Trace the path of packets, routers, DNS lookups, and TCP handshakes from your browser to remote servers.',
    youtube_url: 'https://www.youtube.com/watch?v=7_LPdttKXPc',
    youtube_id: '7_LPdttKXPc',
    category: 'technology',
    duration_minutes: 5,
    featured: false,
    instructor_name: 'Aaron CS Explorations',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-20').toISOString(),
  },
  {
    id: 'vid-cyber-1',
    title: 'Web Application Security & OWASP Top 10 Defenses',
    description: 'Comprehensive overview of web security controls: Content Security Policy, XSS prevention, and secure authentication.',
    youtube_url: 'https://www.youtube.com/watch?v=0pmfD8Nsz8c',
    youtube_id: '0pmfD8Nsz8c',
    category: 'technology',
    duration_minutes: 18,
    featured: true,
    instructor_name: 'freeCodeCamp Security',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-22').toISOString(),
  },
  {
    id: 'vid-ct-1',
    title: 'Introduction to Computational Thinking',
    description: 'Learn the core problem-solving framework: decomposition, pattern recognition, abstraction, and algorithms.',
    youtube_url: 'https://www.youtube.com/watch?v=qYZF6qVvQW0',
    youtube_id: 'qYZF6qVvQW0',
    category: 'coding',
    duration_minutes: 8,
    featured: true,
    instructor_name: 'BBC Learning & MIT Media Lab',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-16').toISOString(),
  },
  {
    id: 'vid-vars-1',
    title: 'Variables, Data Types and Memory Allocation',
    description: 'A deep dive into how variables reference values in memory and how different data types behave in code.',
    youtube_url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    youtube_id: 'kqtD5dpn9C8',
    category: 'coding',
    duration_minutes: 12,
    featured: false,
    instructor_name: 'freeCodeCamp Engineering',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-24').toISOString(),
  },
  {
    id: 'vid-loops-1',
    title: 'Conditions, Boolean Logic and Control Flow',
    description: 'Master if-else conditional branches and learn to prevent infinite while loops with invariant termination conditions.',
    youtube_url: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM',
    youtube_id: 'IsG4Xd6LlsM',
    category: 'coding',
    duration_minutes: 15,
    featured: false,
    instructor_name: 'CS Dojo Programming',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-25').toISOString(),
  },
  {
    id: 'vid-debug-1',
    title: 'How to Debug Code Like a Professional Engineer',
    description: 'Learn how to use Chrome DevTools breakpoints, inspect call stacks, and systematically isolate software bugs.',
    youtube_url: 'https://www.youtube.com/watch?v=j_25vLqB35Q',
    youtube_id: 'j_25vLqB35Q',
    category: 'coding',
    duration_minutes: 14,
    featured: true,
    instructor_name: 'Fireship Tech Insights',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-26').toISOString(),
  },
  {
    id: 'vid-fin-1',
    title: 'Introduction to Financial Markets and Banking Systems',
    description: 'An intuitive breakdown of fractional reserve banking, central bank interest rates, and liquidity flows.',
    youtube_url: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo',
    youtube_id: 'p7HKvqRI_Bo',
    category: 'finance',
    duration_minutes: 10,
    featured: true,
    instructor_name: 'Khan Academy Finance',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-17').toISOString(),
  },
  {
    id: 'vid-stock-1',
    title: 'Understanding the Stock Market & Long-Term Index Investing',
    description: 'Why broad-market index funds outperform speculative stock picking through the mathematical power of diversification.',
    youtube_url: 'https://www.youtube.com/watch?v=fwe_PbrP7e8',
    youtube_id: 'fwe_PbrP7e8',
    category: 'finance',
    duration_minutes: 12,
    featured: false,
    instructor_name: 'PBS Two Cents',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-28').toISOString(),
  },
  {
    id: 'vid-upi-1',
    title: 'FinTech & Digital Payments: The Architecture of UPI',
    description: 'How India built the world\'s fastest real-time payment protocol connecting millions of daily transactions.',
    youtube_url: 'https://www.youtube.com/watch?v=h07H2h5J9t8',
    youtube_id: 'h07H2h5J9t8',
    category: 'finance',
    duration_minutes: 9,
    featured: true,
    instructor_name: 'FinTech Insights India',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-29').toISOString(),
  },
  {
    id: 'vid-time-1',
    title: 'Time Management & The Eisenhower Decision Matrix',
    description: 'Eliminate reactive noise and protect your deep focus hours for high-impact creative and technical work.',
    youtube_url: 'https://www.youtube.com/watch?v=VUk6LZEHN3w',
    youtube_id: 'VUk6LZEHN3w',
    category: 'professional',
    duration_minutes: 8,
    featured: true,
    instructor_name: 'LifeCraft Leadership',
    added_by: 'user-superadmin-1',
    created_at: new Date('2026-09-19').toISOString(),
  },
  {
    id: 'vid-comm-1',
    title: 'Clear Technical Communication & Async Team Etiquette',
    description: 'Techniques for writing concise status updates, documenting engineering decisions, and handling constructive code reviews.',
    youtube_url: 'https://www.youtube.com/watch?v=F6Zg65erDsk',
    youtube_id: 'F6Zg65erDsk',
    category: 'professional',
    duration_minutes: 11,
    featured: false,
    instructor_name: 'Google TechTalks',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-27').toISOString(),
  },
  {
    id: 'vid-git-1',
    title: 'Building an Authentic Technical Profile & GitHub Presence',
    description: 'How to structure project READMEs, commit histories, and code repositories to demonstrate genuine problem solving.',
    youtube_url: 'https://www.youtube.com/watch?v=javbYOFj1b0',
    youtube_id: 'javbYOFj1b0',
    category: 'professional',
    duration_minutes: 13,
    featured: false,
    instructor_name: 'Traversy Media',
    added_by: 'user-teacher-1',
    created_at: new Date('2026-09-30').toISOString(),
  },
];

export const INITIAL_STUDY_RESOURCES: StudyResource[] = [
  {
    id: 'res-comp-guide',
    title: 'Computing Fundamentals & Computer Architecture Reference Manual',
    description: 'A comprehensive study guide explaining CPU instruction cycles, memory hierarchies, binary logic, and operating system scheduling.',
    category: 'technology',
    resource_type: 'guide',
    format: 'PDF',
    duration_or_pages: '24 pages',
    action_label: 'View Guide',
    action_type: 'view_guide',
    is_verified: true,
  },
  {
    id: 'res-web-sec-checklist',
    title: 'Defensive Web Security Checklist (OWASP Defense-in-Depth)',
    description: 'Actionable audit checklist covering Content Security Policy, secure session tokens, CORS rules, and input validation schemas.',
    category: 'technology',
    resource_type: 'cheatsheet',
    format: 'Markdown',
    duration_or_pages: '12 pages',
    action_label: 'View Checklist',
    action_type: 'view_guide',
    is_verified: true,
  },
  {
    id: 'res-comp-thinking-wb',
    title: 'Computational Thinking & Algorithm Design Workbook',
    description: 'Structured exercises in problem decomposition, pattern recognition, and Big-O efficiency calculations for software students.',
    category: 'coding',
    resource_type: 'toolkit',
    format: 'Interactive',
    duration_or_pages: '18 pages',
    action_label: 'Explore Workbook',
    action_type: 'view_guide',
    is_verified: true,
  },
  {
    id: 'res-web-dev-primer',
    title: 'Modern Web Development Primer (HTML5, CSS & JS)',
    description: 'Syntax and layout reference guide covering accessible semantic tags, CSS flexbox/grid models, and DOM event listeners.',
    category: 'coding',
    resource_type: 'guide',
    format: 'PDF',
    duration_or_pages: '15 pages',
    action_label: 'View Primer',
    action_type: 'view_guide',
    is_verified: true,
  },
  {
    id: 'res-fin-framework',
    title: 'Personal Financial Literacy & Budgeting Framework',
    description: 'Step-by-step framework for calculating inflation-adjusted compounding, emergency reserves, and the 50/30/20 budget method.',
    category: 'finance',
    resource_type: 'guide',
    format: 'PDF',
    duration_or_pages: '16 pages',
    action_label: 'View Framework',
    action_type: 'view_guide',
    is_verified: true,
  },
  {
    id: 'res-upi-whitepaper',
    title: 'Indian FinTech & UPI Architectural Breakdown',
    description: 'Technical whitepaper analyzing how National Payments Corporation of India (NPCI) processes sub-second real-time settlements.',
    category: 'finance',
    resource_type: 'guide',
    format: 'PDF',
    duration_or_pages: '14 pages',
    action_label: 'Read Whitepaper',
    action_type: 'view_guide',
    is_verified: true,
  },
  {
    id: 'res-schoolkit-tool',
    title: 'Educator SchoolKit: Syllabi, Lesson Plans & Rubrics',
    description: 'Comprehensive pedagogical tools for teachers, including curriculum mapping, assessment rubrics, and DPDP compliance templates.',
    category: 'educator',
    resource_type: 'toolkit',
    format: 'Interactive',
    duration_or_pages: 'Verified Hub',
    action_label: 'Launch SchoolKit',
    action_type: 'open_tool',
    target_view: 'schoolkit',
    is_verified: true,
  },
  {
    id: 'res-resume-builder-tool',
    title: 'Student Resume & Evidence-Backed Portfolio Builder',
    description: 'Interactive portfolio engineering tool allowing learners to compile verified course achievements and projects into professional resumes.',
    category: 'career',
    resource_type: 'toolkit',
    format: 'Interactive',
    duration_or_pages: 'Verified Tool',
    action_label: 'Open Resume Builder',
    action_type: 'open_tool',
    target_view: 'resume-builder',
    is_verified: true,
  },
];
