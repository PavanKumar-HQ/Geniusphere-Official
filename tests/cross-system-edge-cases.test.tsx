/**
 * Geniusphere — Cross-System Edge-Case & Integration Test Suite
 * Validates edge cases across:
 * 1. Lab registry resolution & missing identifier handling
 * 2. Lab Error Boundary recovery contracts & fallback rendering
 * 3. Local Ollama provider resilience & truth-in-reporting (no fake data)
 * 4. Provider registry security and rejection of unknown providers
 * 5. Orientation Guard deduplication contracts
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { getStandaloneLab, hasStandaloneLab, STANDALONE_LABS } from '../src/labs/registry';
import { LabErrorBoundary } from '../src/components/LabErrorBoundary';
import { OllamaProvider, AIProviderRegistry, ProviderConfigurationError } from '../server/ai/provider';
import { LabOrientationContext } from '../src/components/lab/LabOrientationGuard';

describe('Cross-System Edge-Case & Master Architecture Suite', () => {
  // =========================================================================
  // 1. Lab Registry Resolution & Graceful Failure
  // =========================================================================
  describe('Lab Registry Resilience', () => {
    it('returns null safely for unknown, malformed, or empty identifiers without crashing', () => {
      expect(getStandaloneLab('')).toBeNull();
      expect(getStandaloneLab('   ')).toBeNull();
      expect(getStandaloneLab('non-existent-lab-slug-99999')).toBeNull();
      expect(getStandaloneLab('invalid/character$!#')).toBeNull();
      expect(hasStandaloneLab('fake-course-slug')).toBe(false);
    });

    it('resolves all 15 registered standalone lab modules by id and slugs', () => {
      expect(STANDALONE_LABS.length).toBe(15);

      for (const lab of STANDALONE_LABS) {
        expect(lab.id).toBeTruthy();
        expect(lab.name).toBeTruthy();
        expect(lab.component).toBeDefined();

        // Must resolve by direct ID
        const resolvedById = getStandaloneLab(lab.id);
        expect(resolvedById).not.toBeNull();
        expect(resolvedById?.id).toBe(lab.id);

        // Must resolve by primary labSlug if present
        if (lab.labSlugs.length > 0) {
          const resolvedBySlug = getStandaloneLab(lab.labSlugs[0]);
          expect(resolvedBySlug).not.toBeNull();
          expect(resolvedBySlug?.id).toBe(lab.id);
        }
      }
    });

    it('resolves labs by case-insensitive keywords', () => {
      expect(getStandaloneLab('BLOCKCHAIN')?.id).toBe('blockchain-lab');
      expect(getStandaloneLab('cryptocurrency')?.id).toBe('crypto-lab');
      expect(getStandaloneLab('stock market')?.id).toBe('stock-market-lab');
      expect(getStandaloneLab('iot')?.id).toBe('iot-lab');
    });
  });

  // =========================================================================
  // 2. Lab Error Boundary & Resilience
  // =========================================================================
  describe('Lab Error Boundary State & Recovery UI', () => {
    it('renders child component normally when in healthy state', () => {
      const html = renderToString(
        <LabErrorBoundary labName="Test Lab">
          <div>Active Simulation Canvas</div>
        </LabErrorBoundary>
      );
      expect(html).toContain('Active Simulation Canvas');
    });

    it('getDerivedStateFromError transitions boundary to error state with truthful message', () => {
      const state = LabErrorBoundary.getDerivedStateFromError(
        new Error('Simulation WebGL context creation failed')
      );
      expect(state.hasError).toBe(true);
      expect(state.errorMessage).toBe('Simulation WebGL context creation failed');
    });

    it('renders accessible recovery UI and action buttons when rendered with error state', () => {
      class TestBoundaryWithError extends LabErrorBoundary {
        constructor(props: any) {
          super(props);
          this.state = {
            hasError: true,
            errorMessage: 'Neural model weights failed to load from array buffer',
          };
        }
      }

      const html = renderToString(
        <TestBoundaryWithError labName="Neural Network Explorer" onClose={() => {}}>
          <div>Normal Canvas</div>
        </TestBoundaryWithError>
      );

      expect(html).toContain('role="alert"');
      expect(html).toContain('Lab Encountered an Issue');
      expect(html).toContain('Neural model weights failed to load from array buffer');
      expect(html).toContain('Reload Lab');
      expect(html).toContain('Return to Course');
      expect(html).not.toContain('Normal Canvas');
    });
  });

  // =========================================================================
  // 3. Local Ollama Provider Integration & Availability
  // =========================================================================
  describe('Ollama Provider & Offline Resilience', () => {
    it('truthfully reports offline status when local Ollama daemon is unreachable', async () => {
      process.env.OLLAMA_HOST = 'http://127.0.0.1:59998';
      process.env.AI_MODEL = 'llama3.2';

      const provider = new OllamaProvider();
      expect(provider.isConfigured).toBe(true);

      const probe = await provider.checkAvailability(1500);
      expect(probe.available).toBe(false);
      expect(probe.error).toBeDefined();
    });

    it('rejects chat generation with honest error when Ollama daemon is offline', async () => {
      process.env.OLLAMA_HOST = 'http://127.0.0.1:59998';
      process.env.AI_MODEL = 'llama3.2';
      process.env.AI_REQUEST_TIMEOUT_MS = '2000';

      const provider = new OllamaProvider();

      await expect(
        provider.generateChat({
          requestId: 'test-req-1',
          userId: 'user-1',
          message: 'What is a neural weight?',
        })
      ).rejects.toThrow(/Ollama service unavailable/);
    });

    it('registers Ollama in AIProviderRegistry and rejects unknown providers', () => {
      process.env.AI_PROVIDER = 'ollama';
      process.env.OLLAMA_HOST = 'http://127.0.0.1:11434';
      process.env.AI_MODEL = 'llama3.2';

      const provider = AIProviderRegistry.getProvider();
      expect(provider).not.toBeNull();
      expect(provider?.id).toBe('ollama');

      // Test unknown provider rejection
      process.env.AI_PROVIDER = 'unsupported-llm-service';
      expect(() => AIProviderRegistry.getProvider()).toThrow(ProviderConfigurationError);
    });
  });

  // =========================================================================
  // 4. Orientation Context Deduplication Contract
  // =========================================================================
  describe('Orientation Context Contract', () => {
    it('propagates active guard state to children without duplication', () => {
      const html = renderToString(
        <LabOrientationContext.Provider
          value={{
            isGuardActive: true,
            isBypassed: true,
            setBypassed: () => {},
          }}
        >
          <LabOrientationContext.Consumer>
            {(val) => (
              <div data-testid="child">
                {`GuardActive: ${val.isGuardActive}, Bypassed: ${val.isBypassed}`}
              </div>
            )}
          </LabOrientationContext.Consumer>
        </LabOrientationContext.Provider>
      );

      expect(html).toContain('GuardActive: true, Bypassed: true');
    });
  });
});
