import { describe, it, expect } from 'vitest';
import {
  ipToNumber,
  matchesCidr,
  evaluatePacket,
  getInitialFirewallRules,
  FIREWALL_CHALLENGES,
  FirewallRule,
  NetworkPacket,
} from '../../src/labs/cybersecurity/firewallSimulationEngine';

describe('Firewall Simulation Engine', () => {
  describe('ipToNumber and CIDR matching', () => {
    it('converts IPv4 addresses to correct 32-bit integer', () => {
      expect(ipToNumber('0.0.0.0')).toBe(0);
      expect(ipToNumber('127.0.0.1')).toBe((127 << 24) | 1);
      expect(ipToNumber('192.168.1.1')).toBe(((192 << 24) | (168 << 16) | (1 << 8) | 1) >>> 0);
    });

    it('matches wildcard 0.0.0.0/0 for any IP', () => {
      expect(matchesCidr('192.168.1.1', '0.0.0.0/0')).toBe(true);
      expect(matchesCidr('10.0.0.1', '0.0.0.0/0')).toBe(true);
      expect(matchesCidr('203.0.113.5', 'ANY')).toBe(true);
    });

    it('correctly matches subnet /24 ranges', () => {
      expect(matchesCidr('203.0.113.15', '203.0.113.0/24')).toBe(true);
      expect(matchesCidr('203.0.113.254', '203.0.113.0/24')).toBe(true);
      expect(matchesCidr('203.0.114.1', '203.0.113.0/24')).toBe(false);
    });

    it('correctly matches single IP /32', () => {
      expect(matchesCidr('192.168.1.50', '192.168.1.50/32')).toBe(true);
      expect(matchesCidr('192.168.1.51', '192.168.1.50/32')).toBe(false);
    });
  });

  describe('evaluatePacket rule precedence and policies', () => {
    const rules: FirewallRule[] = [
      {
        id: 'r1',
        name: 'Block Malicious IP',
        protocol: 'ANY',
        sourceCidr: '203.0.113.99/32',
        destPort: 'ANY',
        action: 'DROP',
        enabled: true,
      },
      {
        id: 'r2',
        name: 'Allow HTTPS',
        protocol: 'TCP',
        sourceCidr: '0.0.0.0/0',
        destPort: 443,
        action: 'ALLOW',
        enabled: true,
      },
      {
        id: 'r3',
        name: 'Disabled Rule',
        protocol: 'TCP',
        sourceCidr: '0.0.0.0/0',
        destPort: 80,
        action: 'ALLOW',
        enabled: false,
      },
    ];

    it('matches first applicable rule in priority order', () => {
      const pkt: NetworkPacket = {
        id: 'p1',
        timestamp: Date.now(),
        sourceIp: '203.0.113.99',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 443,
        payloadDescription: 'Malicious origin targeting HTTPS',
        isMalicious: true,
      };

      const verdict = evaluatePacket(pkt, rules, 'ALLOW');
      expect(verdict.action).toBe('DROP');
      expect(verdict.matchedRule?.id).toBe('r1');
    });

    it('falls through to next rule if earlier rule does not match', () => {
      const pkt: NetworkPacket = {
        id: 'p2',
        timestamp: Date.now(),
        sourceIp: '198.51.100.10',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 443,
        payloadDescription: 'Legitimate HTTPS',
        isMalicious: false,
      };

      const verdict = evaluatePacket(pkt, rules, 'DROP');
      expect(verdict.action).toBe('ALLOW');
      expect(verdict.matchedRule?.id).toBe('r2');
    });

    it('ignores disabled rules and applies default policy', () => {
      const pkt: NetworkPacket = {
        id: 'p3',
        timestamp: Date.now(),
        sourceIp: '198.51.100.10',
        destIp: '10.0.0.10',
        protocol: 'TCP',
        destPort: 80,
        payloadDescription: 'HTTP packet hitting disabled rule',
        isMalicious: false,
      };

      const verdict = evaluatePacket(pkt, rules, 'DROP');
      expect(verdict.action).toBe('DROP');
      expect(verdict.matchedRule).toBeNull();
      expect(verdict.reason).toContain('default firewall policy');
    });
  });

  describe('FIREWALL_CHALLENGES verification logic', () => {
    it('verifies Mission 1 (Neutralize Telnet Port 23) successfully when port 23 is dropped', () => {
      const challenge = FIREWALL_CHALLENGES[0];
      const rules = getInitialFirewallRules();
      // Initially port 23 rule is disabled, so with default DROP it drops, but if default is ALLOW it would allow.
      // Student configures an explicit active drop rule for port 23:
      const solvedRules: FirewallRule[] = [
        {
          id: 'telnet-drop',
          name: 'Drop Telnet',
          protocol: 'TCP',
          sourceCidr: '0.0.0.0/0',
          destPort: 23,
          action: 'DROP',
          enabled: true,
        },
        ...rules,
      ];

      const verdicts = challenge.testPackets.map((p) => evaluatePacket(p, solvedRules, 'DROP'));
      const isSolved = challenge.verifySuccess(verdicts, solvedRules, 'DROP');
      expect(isSolved).toBe(true);
    });

    it('verifies Mission 2 (Quarantine Botnet Subnet) when subnet is blocked', () => {
      const challenge = FIREWALL_CHALLENGES[1];
      const botnetBlockRule: FirewallRule = {
        id: 'block-botnet',
        name: 'Drop Botnet Range',
        protocol: 'ANY',
        sourceCidr: '203.0.113.0/24',
        destPort: 'ANY',
        action: 'DROP',
        enabled: true,
      };

      const rules: FirewallRule[] = [
        botnetBlockRule,
        {
          id: 'allow-https',
          name: 'Allow HTTPS',
          protocol: 'TCP',
          sourceCidr: '0.0.0.0/0',
          destPort: 443,
          action: 'ALLOW',
          enabled: true,
        },
      ];

      const verdicts = challenge.testPackets.map((p) => evaluatePacket(p, rules, 'DROP'));
      const isSolved = challenge.verifySuccess(verdicts, rules, 'DROP');
      expect(isSolved).toBe(true);
    });

    it('verifies Mission 3 (Zero Trust Default Deny) requires default policy DROP', () => {
      const challenge = FIREWALL_CHALLENGES[2];
      const rules: FirewallRule[] = [
        {
          id: 'allow-https',
          name: 'Allow HTTPS',
          protocol: 'TCP',
          sourceCidr: '0.0.0.0/0',
          destPort: 443,
          action: 'ALLOW',
          enabled: true,
        },
      ];

      // With default DROP:
      const verdicts = challenge.testPackets.map((p) => evaluatePacket(p, rules, 'DROP'));
      expect(challenge.verifySuccess(verdicts, rules, 'DROP')).toBe(true);

      // With default ALLOW:
      const failVerdicts = challenge.testPackets.map((p) => evaluatePacket(p, rules, 'ALLOW'));
      expect(challenge.verifySuccess(failVerdicts, rules, 'ALLOW')).toBe(false);
    });
  });
});
