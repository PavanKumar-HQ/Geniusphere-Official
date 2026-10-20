import { describe, it, expect } from 'vitest';
import { ALL_CANONICAL_17_TOPICS, SimulationLab } from '../src/curriculum';

describe('Deep Individual Audit of All 170 Canonical Simulation Labs', () => {
  it('contains exactly 17 canonical topics with exactly 10 labs each (170 total)', () => {
    expect(ALL_CANONICAL_17_TOPICS).toHaveLength(17);
    let total = 0;
    ALL_CANONICAL_17_TOPICS.forEach((t) => {
      expect(t.labs).toHaveLength(10);
      total += t.labs.length;
    });
    expect(total).toBe(170);
  });

  describe('Auditing each individual lab specification and behavior', () => {
    ALL_CANONICAL_17_TOPICS.forEach((topic) => {
      describe(`Topic ${topic.canonicalIndex}: ${topic.title} (${topic.category})`, () => {
        topic.labs.forEach((lab: SimulationLab, idx: number) => {
          it(`Lab #${idx + 1} [${lab.slug}]: has valid pedagogical spec, controls, and formula`, () => {
            // 1. Learning Objective & Concept Modelled
            expect(lab.title).toBeTruthy();
            expect(lab.learningObjective.length).toBeGreaterThan(15);
            expect(lab.conceptModelled.length).toBeGreaterThan(10);
            expect(lab.algorithmDescription.length).toBeGreaterThan(15);

            // 2. Underlying Algorithm or Formula
            expect(lab.formula).toBeTruthy();
            expect(lab.formula.length).toBeGreaterThan(3);

            // 3. Student-controlled Inputs
            expect(lab.controls.length).toBeGreaterThanOrEqual(1);
            lab.controls.forEach((ctrl) => {
              expect(ctrl.id).toBeTruthy();
              expect(ctrl.label).toBeTruthy();
              expect(ctrl.defaultValue).toBeDefined();

              if (ctrl.type === 'slider') {
                expect(typeof ctrl.min).toBe('number');
                expect(typeof ctrl.max).toBe('number');
                expect(ctrl.min).toBeLessThanOrEqual(ctrl.max!);
                expect(Number(ctrl.defaultValue)).toBeGreaterThanOrEqual(ctrl.min!);
                expect(Number(ctrl.defaultValue)).toBeLessThanOrEqual(ctrl.max!);
              }

              if (ctrl.type === 'select') {
                expect(ctrl.options).toBeDefined();
                expect(ctrl.options!.length).toBeGreaterThanOrEqual(2);
              }
            });

            // 4. Initial State Alignment
            expect(lab.initialState).toBeDefined();
            lab.controls.forEach((ctrl) => {
              expect(lab.initialState[ctrl.id]).toBeDefined();
            });

            // 5. Completion Criteria & Reflection
            expect(lab.completionCriteria.length).toBeGreaterThanOrEqual(1);
            expect(lab.reflectionQuestion).toBeTruthy();
            expect(lab.reflectionQuestion.endsWith('?')).toBe(true);
          });
        });
      });
    });
  });
});
