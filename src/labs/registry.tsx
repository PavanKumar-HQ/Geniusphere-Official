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
  component: React.ComponentType<{ onClose?: () => void; onExit?: () => void }>;
}

export const STANDALONE_LABS: StandaloneLabMetadata[] = [
  {
    id: 'ai-lab',
    name: 'Geniusphere AI Neural Simulation Lab',
    suiteTitle: 'AI Neural Architecture & Decision Engine',
    courseSlugs: ['artificial-intelligence-ai', 'topic-ai'],
    labSlugs: ['ai-classification-playground', 'lab-t1-ai-classifier'],
    component: AILab,
  },
  {
    id: 'blockchain-lab',
    name: 'TrustLink Decentralized Blockchain Explorer',
    suiteTitle: '19-Module TrustLink Blockchain & Cryptography Suite',
    courseSlugs: ['blockchain-technology', 'cryptocurrency', 'cryptocurrency-digital-assets', 'topic-blockchain', 'topic-cryptocurrency'],
    labSlugs: ['blockchain-block-builder', 'trustlink-blockchain-lab', 'lab-t2-blockchain-builder', 'lab-t7-trustlink-blockchain'],
    component: BlockchainLab,
  },
  {
    id: 'cybersecurity-lab',
    name: 'CyberSphere Junior Attack & Defense Lab',
    suiteTitle: 'CyberSphere Attack Visualizer & Defense Simulation',
    courseSlugs: ['cybersecurity-basics', 'topic-cybersecurity-basics'],
    labSlugs: ['defensive-web-security-lab', 'recognising-digital-payment-scams', 'lab-t5-web-defense', 'lab-sec-scam-defense'],
    component: CyberLab,
  },
  {
    id: 'iot-lab',
    name: 'IoT & Smart Sensors Telemetry Lab',
    suiteTitle: 'IoT Telemetry, MQTT Packets & Actuator State Simulator',
    courseSlugs: ['internet-of-things-iot', 'topic-iot'],
    labSlugs: ['iot-sensor-simulator', 'iot-sensor-threshold-engine', 'lab-t3-iot-sensor'],
    component: IotLab,
  },
  {
    id: 'privacy-lab',
    name: 'Digital Privacy & Footprint Decision Lab',
    suiteTitle: 'Data Broker Tracking & Digital Footprint Audit',
    courseSlugs: ['digital-footprint-privacy', 'topic-social-profile'],
    labSlugs: ['digital-privacy-decision-lab', 'lab-t4-privacy-decision'],
    component: PrivacyLab,
  },
  {
    id: 'banking-lab',
    name: 'Banking Account Types & Settlement Lab',
    suiteTitle: 'Banking Accounts, Interest Compounding & Clearing Rails',
    courseSlugs: ['types-of-banking-accounts', 'banking-account-types', 'topic-banking-accounts'],
    labSlugs: ['financial-institution-flow', 'financial-institution-flow-simulator', 'lab-f3-institution-flow'],
    component: BankingLab,
  },
  {
    id: 'crypto-lab',
    name: 'CryptoLab: How Digital Money Works',
    suiteTitle: 'Ledger Mechanics, Proof-of-Work & Mempool Transactions',
    courseSlugs: ['cryptocurrency', 'cryptocurrency-digital-assets', 'topic-cryptocurrency'],
    labSlugs: ['crypto-ledger-simulator'],
    component: CryptoLab,
  },
  {
    id: 'fintech-lab',
    name: 'FinTech Discovery & Payment Rails Lab',
    suiteTitle: 'Payment Gateways, ISO 20022 & Fraud Shield Architecture',
    courseSlugs: ['financial-technology-fintech', 'topic-fintech'],
    labSlugs: ['fintech-discovery-lab', 'lab-f4-fintech-discovery'],
    component: FinTechLab,
  },
  {
    id: 'economics-lab',
    name: 'Global Economics & Monetary Policy Lab',
    suiteTitle: 'Central Bank Levers, Macro Shocks & Inflation Equilibrium',
    courseSlugs: ['global-economy', 'global-economy-trade', 'topic-global-economy'],
    labSlugs: ['global-economics-simulation-lab', 'global-economics-policy-simulator', 'lab-f5-global-economics'],
    component: EconomicsLab,
  },
  {
    id: 'intro-finance-lab',
    name: 'Personal Finance & Budgeting Lab',
    suiteTitle: '50/30/20 Budgeting & Compound Interest Engine',
    courseSlugs: ['introduction-to-finance', 'topic-intro-finance'],
    labSlugs: ['compound-interest-calculator', 'lab-f2-compound-interest'],
    component: IntroFinanceLab,
  },
  {
    id: 'office-lab',
    name: 'Microsoft Office Real-World Skills Lab',
    suiteTitle: 'Spreadsheet Formula Engine & Productivity Sandbox',
    courseSlugs: ['microsoft-office', 'topic-microsoft-office'],
    labSlugs: ['microsoft-productivity-exercise', 'lab-t6-microsoft-productivity'],
    component: OfficeLab,
  },
  {
    id: 'professional-skills-lab',
    name: 'Professional Skills & Success Engine Lab',
    suiteTitle: 'Eisenhower Time-Matrix & Conflict De-escalation',
    courseSlugs: ['time-management', 'soft-skills', 'topic-time-management', 'topic-soft-skills'],
    labSlugs: ['professional-skills-lab', 'workplace-conflict-simulator', 'lab-p2-professional-skills'],
    component: ProfessionalSkillsLab,
  },
  {
    id: 'social-profile-lab',
    name: 'Social Profile Development & Digital Identity Lab',
    suiteTitle: 'Professional Presence, 2FA Security & Identity Audit',
    courseSlugs: ['social-profile-development', 'topic-social-profile'],
    labSlugs: ['social-profile-lab', 'social-profile-development-lab', 'lab-p3-social-profile'],
    component: SocialProfileLab,
  },
  {
    id: 'stock-market-lab',
    name: 'Stock Market Basics & Order Book Lab',
    suiteTitle: 'Market/Limit Order Matching, Volatility & Risk Modeling',
    courseSlugs: ['stock-market-fundamentals', 'stock-market-investing', 'topic-stock-market'],
    labSlugs: ['financial-market-explorer', 'portfolio-risk-analyzer', 'lab-f1-market-explorer'],
    component: StockMarketLab,
  },
  {
    id: 'communication-lab',
    name: 'Communication Pro Interactive Simulation Lab',
    suiteTitle: 'Executive Email Tone Analyzer & Stakeholder Feedback',
    courseSlugs: ['communication-skills', 'topic-communication'],
    labSlugs: ['communication-pro-interactive-lab', 'workplace-communication-simulator', 'lab-p1-communication-pro'],
    component: CommunicationLab,
  },
];

/**
 * Find standalone lab by course slug, lab slug, or lab ID
 */
export function getStandaloneLab(identifier: string): StandaloneLabMetadata | null {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  return (
    STANDALONE_LABS.find(
      (m) =>
        m.id === clean ||
        m.courseSlugs.some((c) => c === clean || clean.includes(c)) ||
        m.labSlugs.some((l) => l === clean || clean.includes(l))
    ) || null
  );
}

/**
 * Check if a course or lab has a dedicated standalone interactive lab
 */
export function hasStandaloneLab(identifier: string): boolean {
  return getStandaloneLab(identifier) !== null;
}
