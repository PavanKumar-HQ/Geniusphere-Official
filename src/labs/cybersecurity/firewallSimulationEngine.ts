/**
 * Geniusphere — Cybersecurity Firewall & Packet Filter Simulation Engine
 * 
 * Pure, deterministic educational network filtering model.
 * Evaluates packets against ordered firewall rules, computes verdicts,
 * validates CIDR/port constraints, and checks defensive challenge outcomes.
 */

export type ProtocolType = 'TCP' | 'UDP' | 'ICMP';
export type RuleAction = 'ALLOW' | 'DROP' | 'REJECT';

export interface NetworkPacket {
  id: string;
  timestamp: number;
  sourceIp: string;
  destIp: string;
  protocol: ProtocolType;
  destPort: number;
  payloadDescription: string;
  isMalicious: boolean;
  threatType?: 'TELNET_CLEARTEXT' | 'SSH_BRUTE_FORCE' | 'SQL_INJECTION' | 'BOTNET_SWARM' | 'PORT_SCAN' | 'NONE';
}

export interface FirewallRule {
  id: string;
  name: string;
  protocol: ProtocolType | 'ANY';
  sourceCidr: string; // e.g. "0.0.0.0/0", "203.0.113.0/24", "192.168.1.50/32"
  destPort: number | 'ANY'; // e.g. 80, 443, 22, 23
  action: RuleAction;
  enabled: boolean;
}

export interface PacketVerdict {
  packet: NetworkPacket;
  action: RuleAction;
  matchedRule: FirewallRule | null; // null if matched default policy
  reason: string;
  processedAt: number;
}

export interface FirewallChallenge {
  id: string;
  title: string;
  objective: string;
  hint: string;
  testPackets: NetworkPacket[];
  verifySuccess: (verdicts: PacketVerdict[], rules: FirewallRule[], defaultPolicy: RuleAction) => boolean;
}

/**
 * Parses IPv4 string to 32-bit unsigned integer
 */
export function ipToNumber(ip: string): number {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return 0;
  return (
    ((parseInt(parts[0], 10) & 255) << 24) |
    ((parseInt(parts[1], 10) & 255) << 16) |
    ((parseInt(parts[2], 10) & 255) << 8) |
    (parseInt(parts[3], 10) & 255)
  ) >>> 0;
}

/**
 * Checks if an IPv4 address matches a CIDR block (e.g. "192.168.1.0/24" or "0.0.0.0/0")
 */
export function matchesCidr(ip: string, cidr: string): boolean {
  const trimmed = cidr.trim();
  if (trimmed === '0.0.0.0/0' || trimmed === 'ANY' || trimmed === '*') {
    return true;
  }

  const [rangeIp, prefixStr] = trimmed.split('/');
  const prefixLength = prefixStr ? parseInt(prefixStr, 10) : 32;

  if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
    return false;
  }

  if (prefixLength === 0) return true;

  const mask = prefixLength === 32 ? 0xffffffff : (~((1 << (32 - prefixLength)) - 1)) >>> 0;
  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(rangeIp);

  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * Evaluates a single network packet against ordered firewall rules.
 * Uses first-match semantics. If no rule matches, applies default policy.
 */
export function evaluatePacket(
  packet: NetworkPacket,
  rules: FirewallRule[],
  defaultPolicy: RuleAction = 'DROP'
): PacketVerdict {
  for (const rule of rules) {
    if (!rule.enabled) continue;

    // 1. Protocol match
    if (rule.protocol !== 'ANY' && rule.protocol !== packet.protocol) {
      continue;
    }

    // 2. Port match
    if (rule.destPort !== 'ANY' && rule.destPort !== packet.destPort) {
      continue;
    }

    // 3. Source CIDR match
    if (!matchesCidr(packet.sourceIp, rule.sourceCidr)) {
      continue;
    }

    // Rule matched!
    return {
      packet,
      action: rule.action,
      matchedRule: rule,
      reason: `Matched Rule "${rule.name}" (#${rule.id}): ${rule.action} traffic on port ${rule.destPort}`,
      processedAt: Date.now(),
    };
  }

  // Fallback to default policy
  return {
    packet,
    action: defaultPolicy,
    matchedRule: null,
    reason: `No matching rule. Applied default firewall policy: ${defaultPolicy}`,
    processedAt: Date.now(),
  };
}

/**
 * Default starter rules for the lab environment
 */
export function getInitialFirewallRules(): FirewallRule[] {
  return [
    {
      id: 'rule-1',
      name: 'Allow HTTPS Web Traffic',
      protocol: 'TCP',
      sourceCidr: '0.0.0.0/0',
      destPort: 443,
      action: 'ALLOW',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'Allow DNS Lookups',
      protocol: 'UDP',
      sourceCidr: '0.0.0.0/0',
      destPort: 53,
      action: 'ALLOW',
      enabled: true,
    },
    {
      id: 'rule-3',
      name: 'Allow Standard HTTP',
      protocol: 'TCP',
      sourceCidr: '0.0.0.0/0',
      destPort: 80,
      action: 'ALLOW',
      enabled: true,
    },
    {
      id: 'rule-4',
      name: 'Block Legacy Insecure Telnet',
      protocol: 'TCP',
      sourceCidr: '0.0.0.0/0',
      destPort: 23,
      action: 'DROP',
      enabled: false, // Intentionally disabled initially for student to discover & enable
    },
  ];
}

/**
 * Predefined synthetic packet library for experimentation
 */
export const SAMPLE_PACKETS: Omit<NetworkPacket, 'id' | 'timestamp'>[] = [
  {
    sourceIp: '198.51.100.12',
    destIp: '10.0.0.10',
    protocol: 'TCP',
    destPort: 443,
    payloadDescription: 'TLS v1.3 Handshake ClientHello (Legitimate Web Browsing)',
    isMalicious: false,
    threatType: 'NONE',
  },
  {
    sourceIp: '198.51.100.25',
    destIp: '10.0.0.10',
    protocol: 'UDP',
    destPort: 53,
    payloadDescription: 'DNS Query: A record for api.geniusphere.tech',
    isMalicious: false,
    threatType: 'NONE',
  },
  {
    sourceIp: '203.0.113.88',
    destIp: '10.0.0.10',
    protocol: 'TCP',
    destPort: 23,
    payloadDescription: 'Cleartext Telnet Root Login Attempt (Unencrypted Password Leak)',
    isMalicious: true,
    threatType: 'TELNET_CLEARTEXT',
  },
  {
    sourceIp: '203.0.113.99',
    destIp: '10.0.0.10',
    protocol: 'TCP',
    destPort: 22,
    payloadDescription: 'Automated SSH Dictionary Brute-Force Password Spray (100 req/sec)',
    isMalicious: true,
    threatType: 'SSH_BRUTE_FORCE',
  },
  {
    sourceIp: '203.0.113.15',
    destIp: '10.0.0.10',
    protocol: 'TCP',
    destPort: 80,
    payloadDescription: 'HTTP GET /login?user=admin\' OR 1=1-- (SQL Injection Attack)',
    isMalicious: true,
    threatType: 'SQL_INJECTION',
  },
  {
    sourceIp: '192.168.1.105',
    destIp: '10.0.0.10',
    protocol: 'ICMP',
    destPort: 0,
    payloadDescription: 'ICMP Echo Request (Ping Diagnostics)',
    isMalicious: false,
    threatType: 'NONE',
  },
];

/**
 * Defensive challenges with deterministic win conditions
 */
export const FIREWALL_CHALLENGES: FirewallChallenge[] = [
  {
    id: 'challenge-telnet',
    title: 'Mission 1: Neutralize Cleartext Telnet Vulnerability',
    objective:
      'Legacy Telnet (port 23) transmits passwords unencrypted over the wire. Configure the firewall so all incoming Telnet traffic on Port 23 is dropped while keeping HTTPS (Port 443) and DNS (Port 53) permitted.',
    hint: 'Enable or create an active rule targeting TCP Destination Port 23 with Action DROP.',
    testPackets: [
      {
        id: 'test-pkg-telnet',
        timestamp: 0,
        sourceIp: '203.0.113.44',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 23,
        payloadDescription: 'Telnet authentication packet',
        isMalicious: true,
        threatType: 'TELNET_CLEARTEXT',
      },
      {
        id: 'test-pkg-https',
        timestamp: 0,
        sourceIp: '198.51.100.12',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 443,
        payloadDescription: 'Standard HTTPS request',
        isMalicious: false,
        threatType: 'NONE',
      },
    ],
    verifySuccess: (verdicts: PacketVerdict[]) => {
      const telnetVerdict = verdicts.find((v) => v.packet.destPort === 23);
      const httpsVerdict = verdicts.find((v) => v.packet.destPort === 443);
      return (
        telnetVerdict !== undefined &&
        telnetVerdict.action === 'DROP' &&
        httpsVerdict !== undefined &&
        httpsVerdict.action === 'ALLOW'
      );
    },
  },
  {
    id: 'challenge-subnet-block',
    title: 'Mission 2: Quarantine Hostile Botnet Subnet (203.0.113.0/24)',
    objective:
      'Threat intelligence reports that the IP range 203.0.113.0/24 is generating automated credential attacks. Create a top-priority rule dropping all traffic from CIDR 203.0.113.0/24 across all ports, while continuing to allow legitimate traffic from 198.51.100.0/24.',
    hint: 'Add an active rule with Source CIDR "203.0.113.0/24", Protocol ANY, Port ANY, and Action DROP at the top of your rules list.',
    testPackets: [
      {
        id: 'botnet-1',
        timestamp: 0,
        sourceIp: '203.0.113.55',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 443,
        payloadDescription: 'Botnet HTTPS Flood',
        isMalicious: true,
        threatType: 'BOTNET_SWARM',
      },
      {
        id: 'legit-1',
        timestamp: 0,
        sourceIp: '198.51.100.22',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 443,
        payloadDescription: 'Legitimate Student Browser Session',
        isMalicious: false,
        threatType: 'NONE',
      },
    ],
    verifySuccess: (verdicts: PacketVerdict[]) => {
      const botnetVerdict = verdicts.find((v) => v.packet.sourceIp === '203.0.113.55');
      const legitVerdict = verdicts.find((v) => v.packet.sourceIp === '198.51.100.22');
      return (
        botnetVerdict !== undefined &&
        (botnetVerdict.action === 'DROP' || botnetVerdict.action === 'REJECT') &&
        legitVerdict !== undefined &&
        legitVerdict.action === 'ALLOW'
      );
    },
  },
  {
    id: 'challenge-zero-trust',
    title: 'Mission 3: Enforce Zero-Trust Default Deny Architecture',
    objective:
      'Production servers should never use an open default policy. Change the Default Policy to DROP, and explicitly whitelist only TCP Port 443 and UDP Port 53. Verify that random unapproved ports (such as IRC :6667 or Minecraft :25565) are automatically rejected without individual block rules.',
    hint: 'Set the Default Firewall Policy dropdown to DROP. Ensure there is no wildcard allow rule for all ports.',
    testPackets: [
      {
        id: 'unapproved-port',
        timestamp: 0,
        sourceIp: '198.51.100.99',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 6667,
        payloadDescription: 'Unapproved IRC connection',
        isMalicious: false,
        threatType: 'NONE',
      },
      {
        id: 'approved-https',
        timestamp: 0,
        sourceIp: '198.51.100.99',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 443,
        payloadDescription: 'Approved HTTPS session',
        isMalicious: false,
        threatType: 'NONE',
      },
    ],
    verifySuccess: (verdicts: PacketVerdict[], _rules: FirewallRule[], defaultPolicy: RuleAction) => {
      const unapproved = verdicts.find((v) => v.packet.destPort === 6667);
      const approved = verdicts.find((v) => v.packet.destPort === 443);
      return (
        defaultPolicy === 'DROP' &&
        unapproved !== undefined &&
        unapproved.action === 'DROP' &&
        approved !== undefined &&
        approved.action === 'ALLOW'
      );
    },
  },
];
