import { describe, it, expect } from 'vitest';
import { getStandaloneLab, STANDALONE_LABS } from '../src/labs/registry';

describe('Standalone Interactive Labs 1-to-1 Mapping Suite', () => {
  it('contains all 15 standalone interactive labs', () => {
    expect(STANDALONE_LABS.length).toBe(15);
  });

  const testCases: { query: string; expectedLabId: string }[] = [
    { query: 'stock market', expectedLabId: 'stock-market-lab' },
    { query: 'social profile development', expectedLabId: 'social-profile-lab' },
    { query: 'professional skills lab', expectedLabId: 'professional-skills-lab' },
    { query: 'digital privacy and footprint', expectedLabId: 'privacy-lab' },
    { query: 'microsoft office', expectedLabId: 'office-lab' },
    { query: 'iot', expectedLabId: 'iot-lab' },
    { query: 'intro to finance', expectedLabId: 'intro-finance-lab' },
    { query: 'global events and impact', expectedLabId: 'economics-lab' },
    { query: 'fintech', expectedLabId: 'fintech-lab' },
    { query: 'cybersecurity', expectedLabId: 'cybersecurity-lab' },
    { query: 'cybersecurtiy', expectedLabId: 'cybersecurity-lab' },
    { query: 'cryptocurrency', expectedLabId: 'crypto-lab' },
    { query: 'communication skills', expectedLabId: 'communication-lab' },
    { query: 'blockchain', expectedLabId: 'blockchain-lab' },
    { query: 'financial institutions', expectedLabId: 'banking-lab' },
    { query: 'ai', expectedLabId: 'ai-lab' },
  ];

  testCases.forEach(({ query, expectedLabId }) => {
    it(`correctly resolves '${query}' to standalone lab '${expectedLabId}'`, () => {
      const result = getStandaloneLab(query);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(expectedLabId);
      expect(result?.component).toBeDefined();
    });
  });
});
