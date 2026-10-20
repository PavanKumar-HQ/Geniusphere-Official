
import { LabStep, StepInfo } from './types';

export interface ExtendedStepInfo extends StepInfo {
  insight: string;
}

export const STEPS: ExtendedStepInfo[] = [
  {
    id: LabStep.ACTIVATION,
    title: 'Physical Sensing',
    description: 'Hardware modules detect real-world signals.',
    insight: 'IoT begins with physical transducers. A DHT11 sensor converts air temperature into electrical resistance, which we read as data.',
    statusText: 'SCANNING_ENVIRONMENT',
    statusColor: 'text-[#3BF0FF]'
  },
  {
    id: LabStep.DATA_COLLECTION,
    title: 'Data Digitzation',
    description: 'Analog signals are converted into digital data packets.',
    insight: 'Computers cannot understand raw heat. Sensors like the LDR (Light Dependent Resistor) convert brightness into numbers the processor can handle.',
    statusText: 'DIGITIZING_SIGNALS',
    statusColor: 'text-[#3BF0FF]'
  },
  {
    id: LabStep.CONNECTIVITY,
    title: 'Edge Connectivity',
    description: 'The device connects to the internet via a gateway.',
    insight: 'The ESP32 is a powerful microcontroller that acts as a bridge. It uses radio waves to send your data packets to a local Wi-Fi router.',
    statusText: 'UPLINK_ESTABLISHED',
    statusColor: 'text-[#FACC15]'
  },
  {
    id: LabStep.CLOUD_PROCESSING,
    title: 'Cloud Analytics',
    description: 'Remote servers analyze the data using programmed logic.',
    insight: 'Processing happens in data centers. Here, "If-Then" logic determines if the temperature is too high or the room is too dark.',
    statusText: 'CLOUD_SYNCHRONIZING',
    statusColor: 'text-[#7C6BFF]'
  },
  {
    id: LabStep.AUTOMATION,
    title: 'Feedback Loop',
    description: 'The cloud sends a command back to take action.',
    insight: 'This is the "Act" phase. The cloud sends a signal back to a Relay module, which physically flips a switch to turn on a fan or light.',
    statusText: 'COMMAND_EXECUTED',
    statusColor: 'text-[#00FFA3]'
  },
  {
    id: LabStep.SMART_HOME,
    title: 'IoT Ecosystem',
    description: 'Multiple devices working together in one network.',
    insight: 'In a real Smart Home, dozens of sensors communicate through a single hub. This creates a coordinated, smart environment.',
    statusText: 'NETWORK_OPTIMIZED',
    statusColor: 'text-[#4DA3FF]'
  },
  {
    id: LabStep.SECURITY_RISK,
    title: 'Vulnerability Probe',
    description: 'Unsecured ports and weak passwords expose the system.',
    insight: 'Many IoT devices use "admin/admin" passwords. Hackers use automated tools to scan for these open doors and take control.',
    statusText: 'THREAT_DETECTED',
    statusColor: 'text-[#FF4D4D]'
  },
  {
    id: LabStep.SECURITY_DEFENSE,
    title: 'Security Hardening',
    description: 'Encryption and firewalls block unauthorized access.',
    insight: 'By updating firmware and using unique passwords, we close the gaps. Secure devices use encryption to scramble data so only you can read it.',
    statusText: 'DEFENSE_REINFORCED',
    statusColor: 'text-[#00FFA3]'
  }
];

export const COLORS = {
  bg: '#070B1A',
  sensor: '#3BF0FF',
  packet: '#4DA3FF',
  cloud: '#7C6BFF',
  success: '#00FFA3',
  risk: '#FF4D4D',
  text: '#E6E9F0'
};
