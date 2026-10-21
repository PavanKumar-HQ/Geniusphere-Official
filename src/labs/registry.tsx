import React from 'react';
import AILab from './ai-lab/AILabFull';
import BlockchainLab from './blockchain-lab/App';
import CyberLab from './cybersecurity/CyberLabFull';
import IotLab from './iot-lab/App';
import BankingLab from './banking-lab/App';
import CryptoLab from './crypto-lab/App';
import PrivacyLab from './privacy-lab/App';
import FinTechLab from './fintech-lab/App';
import EconomicsLab from './economics-lab/App';
import IntroFinanceLab from './intro-finance-lab/App';
import OfficeLab from './office-lab/App';
import ProfessionalSkillsLab from './professional-skills-lab/App';
import SocialProfileLab from './social-profile-lab/App';
import StockMarketLab from './stock-market-lab/App';
import CommunicationLab from './communication-lab/App';

export interface StandaloneLabMetadata {
  id: string;
  name: string;
  suiteTitle: string;
  courseSlugs: string[];
  labSlugs: string[];
  keywords: string[];
  component: React.ComponentType<{ onClose?: () => void; onExit?: () => void }>;
}

export const STANDALONE_LABS: StandaloneLabMetadata[] = [
  {
    id: 'ai-lab',
    name: 'Geniusphere AI Neural Simulation Lab',
    suiteTitle: 'AI Neural Architecture & Decision Engine',
    courseSlugs: ['artificial-intelligence-ai', 'topic-ai'],
    labSlugs: ['ai-classification-playground', 'lab-t1-ai-classifier'],
    keywords: ['ai', 'artificial intelligence', 'neural', 'classifier', 'machine learning', 'feature weights'],
    component: AILab,
  },
  {
    id: 'blockchain-lab',
    name: 'TrustLink Decentralized Blockchain Explorer',
    suiteTitle: '19-Module TrustLink Blockchain & Cryptography Suite',
    courseSlugs: ['blockchain-technology', 'topic-blockchain'],
    labSlugs: ['blockchain-block-builder', 'trustlink-blockchain-lab', 'lab-t2-blockchain-builder', 'lab-t7-trustlink-blockchain'],
    keywords: ['blockchain', 'trustlink', 'hash', 'sha-256', 'proof of work', 'block builder'],
    component: BlockchainLab,
  },
  {
    id: 'cybersecurity-lab',
    name: 'CyberSphere Junior Attack & Defense Lab',
    suiteTitle: 'CyberSphere Attack Visualizer & Defense Simulation',
    courseSlugs: ['cybersecurity-basics', 'topic-cybersecurity-basics'],
    labSlugs: ['defensive-web-security-lab', 'recognising-digital-payment-scams', 'lab-t5-web-defense', 'lab-sec-scam-defense'],
    keywords: ['cybersecurity', 'cybersecurtiy', 'cyber security', 'cyber', 'security', 'defense', 'attack', 'phishing', 'scam', 'web defense', 'firewall'],
    component: CyberLab,
  },
  {
    id: 'iot-lab',
    name: 'IoT & Smart Sensors Telemetry Lab',
    suiteTitle: 'IoT Telemetry, MQTT Packets & Actuator State Simulator',
    courseSlugs: ['internet-of-things-iot', 'topic-iot'],
    labSlugs: ['iot-sensor-simulator', 'iot-sensor-threshold-engine', 'lab-t3-iot-sensor'],
    keywords: ['iot', 'sensor', 'sensors', 'telemetry', 'actuator', 'mqtt', 'smart sensor', 'threshold'],
    component: IotLab,
  },
  {
    id: 'privacy-lab',
    name: 'Digital Privacy & Footprint Decision Lab',
    suiteTitle: 'Data Broker Tracking & Digital Footprint Audit',
    courseSlugs: ['digital-footprint-privacy', 'topic-social-profile', 'digital-privacy-and-footprint'],
    labSlugs: ['digital-privacy-decision-lab', 'lab-t4-privacy-decision'],
    keywords: ['digital privacy and footprint', 'digital privacy', 'privacy', 'footprint', 'broker', 'permission', 'tracking', 'digital footprint', 'data broker'],
    component: PrivacyLab,
  },
  {
    id: 'banking-lab',
    name: 'Banking Account Types & Settlement Lab',
    suiteTitle: 'Banking Accounts, Interest Compounding & Clearing Rails',
    courseSlugs: ['types-of-banking-accounts', 'banking-account-types', 'financial-institutions', 'topic-banking-accounts'],
    labSlugs: ['financial-institution-flow', 'financial-institution-flow-simulator', 'lab-f3-institution-flow'],
    keywords: ['financial institutions', 'financial institution', 'banking', 'bank', 'interest', 'settlement', 'account', 'banking accounts', 'clearing'],
    component: BankingLab,
  },
  {
    id: 'crypto-lab',
    name: 'CryptoLab: How Digital Money Works',
    suiteTitle: 'Ledger Mechanics, Proof-of-Work & Mempool Transactions',
    courseSlugs: ['cryptocurrency', 'cryptocurrency-digital-assets', 'topic-cryptocurrency'],
    labSlugs: ['crypto-ledger-simulator'],
    keywords: ['cryptocurrency', 'crypto', 'digital money', 'token', 'bitcoin', 'mempool', 'ledger'],
    component: CryptoLab,
  },
  {
    id: 'fintech-lab',
    name: 'FinTech Discovery & Payment Rails Lab',
    suiteTitle: 'Payment Gateways, ISO 20022 & Fraud Shield Architecture',
    courseSlugs: ['financial-technology-fintech', 'topic-fintech'],
    labSlugs: ['fintech-discovery-lab', 'lab-f4-fintech-discovery'],
    keywords: ['fintech', 'payment', 'rail', 'gateway', 'payment rails', 'iso 20022', 'financial technology'],
    component: FinTechLab,
  },
  {
    id: 'economics-lab',
    name: 'Global Economics & Monetary Policy Lab',
    suiteTitle: 'Central Bank Levers, Macro Shocks & Inflation Equilibrium',
    courseSlugs: ['global-economy', 'global-economy-trade', 'global-events-and-impact', 'topic-global-economy'],
    labSlugs: ['global-economics-simulation-lab', 'global-economics-policy-simulator', 'lab-f5-global-economics'],
    keywords: ['global events and impact', 'global events', 'economics', 'global economy', 'economy', 'monetary', 'inflation', 'central bank', 'macro'],
    component: EconomicsLab,
  },
  {
    id: 'intro-finance-lab',
    name: 'Personal Finance & Budgeting Lab',
    suiteTitle: '50/30/20 Budgeting & Compound Interest Engine',
    courseSlugs: ['introduction-to-finance', 'intro-to-finance', 'topic-intro-finance'],
    labSlugs: ['compound-interest-calculator', 'lab-f2-compound-interest'],
    keywords: ['intro to finance', 'intro finance', 'introduction to finance', 'personal finance', 'budget', 'budgeting', 'compound interest', 'finance', '50/30/20'],
    component: IntroFinanceLab,
  },
  {
    id: 'office-lab',
    name: 'Microsoft Office Real-World Skills Lab',
    suiteTitle: 'Spreadsheet Formula Engine & Productivity Sandbox',
    courseSlugs: ['microsoft-office', 'topic-microsoft-office'],
    labSlugs: ['microsoft-productivity-exercise', 'lab-t6-microsoft-productivity'],
    keywords: ['microsoft office', 'office', 'microsoft', 'spreadsheet', 'excel', 'productivity', 'formulas'],
    component: OfficeLab,
  },
  {
    id: 'professional-skills-lab',
    name: 'Professional Skills & Success Engine Lab',
    suiteTitle: 'Eisenhower Time-Matrix & Conflict De-escalation',
    courseSlugs: ['time-management', 'soft-skills', 'professional-skills', 'topic-time-management', 'topic-soft-skills'],
    labSlugs: ['professional-skills-lab', 'workplace-conflict-simulator', 'lab-p2-professional-skills'],
    keywords: ['professional skills lab', 'professional skills', 'time management', 'soft skills', 'conflict', 'workplace', 'eisenhower'],
    component: ProfessionalSkillsLab,
  },
  {
    id: 'social-profile-lab',
    name: 'Social Profile Development & Digital Identity Lab',
    suiteTitle: 'Professional Presence, 2FA Security & Identity Audit',
    courseSlugs: ['social-profile-development', 'topic-social-profile'],
    labSlugs: ['social-profile-lab', 'social-profile-development-lab', 'lab-p3-social-profile'],
    keywords: ['social profile development', 'social profile', 'social media', 'digital identity', 'linkedin', 'identity'],
    component: SocialProfileLab,
  },
  {
    id: 'stock-market-lab',
    name: 'Stock Market Basics & Order Book Lab',
    suiteTitle: 'Market/Limit Order Matching, Volatility & Risk Modeling',
    courseSlugs: ['stock-market-fundamentals', 'stock-market-investing', 'topic-stock-market'],
    labSlugs: ['financial-market-explorer', 'portfolio-risk-analyzer', 'lab-f1-market-explorer'],
    keywords: ['stock market', 'stock', 'market', 'order book', 'trading', 'shares', 'investing', 'volatility'],
    component: StockMarketLab,
  },
  {
    id: 'communication-lab',
    name: 'Communication Pro Interactive Simulation Lab',
    suiteTitle: 'Executive Email Tone Analyzer & Stakeholder Feedback',
    courseSlugs: ['communication-skills', 'topic-communication'],
    labSlugs: ['communication-pro-interactive-lab', 'workplace-communication-simulator', 'lab-p1-communication-pro'],
    keywords: ['communication skills', 'communication', 'email', 'tone', 'stakeholder', 'verbal'],
    component: CommunicationLab,
  },
];

/**
 * Find standalone lab by course slug, lab slug, lab ID, or keyword
 */
export function getStandaloneLab(identifier: string): StandaloneLabMetadata | null {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  if (!clean) return null;

  // 1. Direct ID exact match
  const idMatch = STANDALONE_LABS.find((m) => m.id === clean);
  if (idMatch) return idMatch;

  // 2. Exact courseSlug match
  const courseMatch = STANDALONE_LABS.find((m) => m.courseSlugs.includes(clean));
  if (courseMatch) return courseMatch;

  // 3. Exact labSlug match
  const labSlugMatch = STANDALONE_LABS.find((m) => m.labSlugs.includes(clean));
  if (labSlugMatch) return labSlugMatch;

  // 4. Exact keyword match
  const exactKeywordMatch = STANDALONE_LABS.find((m) => m.keywords.includes(clean));
  if (exactKeywordMatch) return exactKeywordMatch;

  // 5. Clean contains courseSlug or labSlug
  const slugContainedMatch = STANDALONE_LABS.find(
    (m) =>
      m.courseSlugs.some((c) => clean.includes(c)) ||
      m.labSlugs.some((l) => clean.includes(l))
  );
  if (slugContainedMatch) return slugContainedMatch;

  // 6. Longest keyword substring match (prioritizes multi-word phrases like 'financial institutions' or 'global events and impact')
  const matchingByKeyword: { lab: StandaloneLabMetadata; matchLength: number }[] = [];
  for (const lab of STANDALONE_LABS) {
    for (const keyword of lab.keywords) {
      if (clean.includes(keyword) || (keyword.length > 3 && keyword.includes(clean))) {
        matchingByKeyword.push({ lab, matchLength: keyword.length });
      }
    }
  }

  if (matchingByKeyword.length > 0) {
    matchingByKeyword.sort((a, b) => b.matchLength - a.matchLength);
    return matchingByKeyword[0].lab;
  }

  return null;
}

/**
 * Check if a course or lab has a dedicated standalone interactive lab
 */
export function hasStandaloneLab(identifier: string): boolean {
  return getStandaloneLab(identifier) !== null;
}
