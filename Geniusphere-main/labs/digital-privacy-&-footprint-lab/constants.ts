
import { SimulationStep, Topic } from './types';

export const COLORS = {
  background: '#070B1A',
  userAction: '#3BF0FF', // Cyan
  dataPacket: '#4DA3FF', // Electric Blue
  tracking: '#7C6BFF',   // Purple
  safe: '#00FFA3',       // Neon Green
  risk: '#FF4D4D',       // Red
  text: '#E6E9F0'        // Soft white
};

export const TOPICS: Topic[] = [
  { id: SimulationStep.USER_ONLINE, label: '1. User Online' },
  { id: SimulationStep.FOOTPRINT_CREATED, label: '2. Digital Footprints' },
  { id: SimulationStep.ACTIVE_VS_PASSIVE, label: '3. Active vs Passive' },
  { id: SimulationStep.DATA_TRACKING, label: '4. Data Tracking' },
  { id: SimulationStep.PERMISSIONS, label: '5. App Permissions' },
  { id: SimulationStep.PRIVACY_RISK, label: '6. Privacy Exposure' },
  { id: SimulationStep.DATA_MISUSE, label: '7. Identity Misuse' },
  { id: SimulationStep.DEFENSE_ACTIVATION, label: '8. Privacy Defense' },
];

export const STEP_CONTENT = {
  [SimulationStep.USER_ONLINE]: {
    title: "Step 1: User Goes Online",
    text: "Every interaction begins with a single click. When you access a website, your browser starts exchanging data packets with a remote server.",
    status: "CONNECTION_ESTABLISHED"
  },
  [SimulationStep.FOOTPRINT_CREATED]: {
    title: "Step 2: Digital Footprint Created",
    text: "Every online action leaves a digital footprint. These are permanent records of your digital identity, from search history to login times.",
    status: "RECORDING_DATA"
  },
  [SimulationStep.ACTIVE_VS_PASSIVE]: {
    title: "Step 3: Active vs Passive Footprint",
    text: "Active footprints are data you share intentionally (posts). Passive footprints are collected silently (IP address, device hardware, browser fingerprint).",
    status: "HARVESTING_PASSIVE_DATA"
  },
  [SimulationStep.DATA_TRACKING]: {
    title: "Step 4: Data Collection & Tracking",
    text: "Third-party trackers follow you across websites to build a psychographic profile used for targeted advertising and behavior prediction.",
    status: "TRACKING_ACTIVE"
  },
  [SimulationStep.PERMISSIONS]: {
    title: "Step 5: Location & App Permissions",
    text: "Mobile apps often request unnecessary permissions. Access to GPS, contacts, and microphone can expose your physical location and private life.",
    status: "SENSOR_SCANNING"
  },
  [SimulationStep.PRIVACY_RISK]: {
    title: "Step 6: Digital Privacy Risk",
    text: "Exposed metadata and oversharing make you a target. Public profiles can be 'scraped' by algorithms to find vulnerabilities.",
    status: "VULNERABILITY_CRITICAL"
  },
  [SimulationStep.DATA_MISUSE]: {
    title: "Step 7: Attack Simulation - Data Misuse",
    text: "Stolen or leaked data can lead to identity theft, phishing attacks, and the creation of deepfake or imitation accounts using your photos.",
    status: "BREACH_SIMULATED"
  },
  [SimulationStep.DEFENSE_ACTIVATION]: {
    title: "Step 8: Privacy Defense Activation",
    text: "Taking control! By using VPNs, disabling tracking, managing permissions, and enabling 2FA, you significantly shrink your exposed footprint.",
    status: "SECURITY_HARDENED"
  }
};
