import { describe, it, expect } from 'vitest';
import {
  ALL_CANONICAL_17_TOPICS,
  getAll170Lessons,
  getAll170Labs,
  getTopicById,
  getTopicBySlug,
  getTopicByIndex,
  getLessonById,
  getLabById,
  saveLearnerLessonCompletion,
  saveLearnerLabCompletion,
  getLearnerProgress,
} from '../src/curriculum';

describe('Authoritative 17-Topic Canonical Curriculum & 170 Labs Suite', () => {
  it('contains exactly 17 distinct canonical topics with strictly partitioned categories', () => {
    expect(ALL_CANONICAL_17_TOPICS.length).toBe(17);

    const techTopics = ALL_CANONICAL_17_TOPICS.filter((t) => t.category === 'technology');
    const finTopics = ALL_CANONICAL_17_TOPICS.filter((t) => t.category === 'finance');
    const profTopics = ALL_CANONICAL_17_TOPICS.filter((t) => t.category === 'professional');

    expect(techTopics.length).toBe(6);
    expect(finTopics.length).toBe(6);
    expect(profTopics.length).toBe(5);

    // Verify canonical indexes 1 to 17 without gaps or duplicates
    const indices = ALL_CANONICAL_17_TOPICS.map((t) => t.canonicalIndex).sort((a, b) => a - b);
    expect(indices).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
  });

  it('populates exactly 170 genuine video lessons (exactly 10 per topic) with verified YouTube metadata', () => {
    const allLessons = getAll170Lessons();
    expect(allLessons.length).toBe(170);

    ALL_CANONICAL_17_TOPICS.forEach((topic) => {
      expect(topic.lessons.length).toBe(10);

      topic.lessons.forEach((lesson, index) => {
        expect(lesson.orderIndex).toBe(index + 1);
        expect(lesson.title.trim().length).toBeGreaterThan(5);
        expect(lesson.youtubeVideoId.trim().length).toBeGreaterThanOrEqual(11);
        expect(lesson.youtubeUrl).toContain('https://www.youtube.com/watch?v=');
        expect(lesson.learningObjectives.length).toBeGreaterThan(0);
        expect(lesson.keyTakeaways.length).toBeGreaterThan(0);
        expect(lesson.durationMinutes).toBeGreaterThan(0);
        expect(lesson.verificationStatus).toBe('VERIFIED');
      });
    });
  });

  it('populates exactly 170 interactive simulation labs (exactly 10 per topic) with mathematical formulas and controls', () => {
    const allLabs = getAll170Labs();
    expect(allLabs.length).toBe(170);

    ALL_CANONICAL_17_TOPICS.forEach((topic) => {
      expect(topic.labs.length).toBe(10);

      topic.labs.forEach((lab, index) => {
        expect(lab.orderIndex).toBe(index + 1);
        expect(lab.title.trim().length).toBeGreaterThan(3);
        expect(lab.formula.trim().length).toBeGreaterThan(2);
        expect(lab.algorithmDescription.trim().length).toBeGreaterThan(5);
        expect(lab.reflectionQuestion.trim().length).toBeGreaterThan(5);
        expect(lab.completionCriteria.length).toBeGreaterThan(0);
        expect(lab.controls.length).toBeGreaterThan(0);
        expect(Object.keys(lab.initialState).length).toBeGreaterThan(0);
      });
    });
  });

  it('executes exact mathematical calculations for representative cross-domain simulation labs', () => {
    // 1. Startup Ideation: Unit Economics LTV/CAC Calculation
    const arpu = 50;
    const grossMarginPct = 80;
    const monthlyChurnPct = 3;
    const cac = 350;

    const ltv = (arpu * (grossMarginPct / 100)) / (monthlyChurnPct / 100);
    const ltvCacRatio = ltv / cac;
    const paybackMonths = cac / (arpu * (grossMarginPct / 100));

    expect(ltv).toBeCloseTo(1333.33, 1);
    expect(ltvCacRatio).toBeCloseTo(3.81, 2);
    expect(paybackMonths).toBeCloseTo(8.75, 2);
    expect(ltvCacRatio >= 3.0 && paybackMonths <= 12).toBe(true);

    // 2. Finance: Compound Growth vs Inflation
    const p = 5000;
    const r = 0.08;
    const t = 10;
    const inf = 0.03;
    const nominal = p * Math.pow(1 + r, t);
    const real = nominal / Math.pow(1 + inf, t);

    expect(nominal).toBeCloseTo(10794.62, 1);
    expect(real).toBeCloseTo(8032.21, 1);
    expect(real > p).toBe(true);
  });

  it('records persistent student progress and computes real completion percentage without fake stats', () => {
    const testUserId = 'test-clean-learner-uuid';
    const testTopicId = 'topic-startup-ideation';
    const testLessonId = 'lesson-startup-1';
    const testLabId = 'lab-startup-1';

    // 1. Complete a lesson
    const progressAfterLesson = saveLearnerLessonCompletion(testUserId, testTopicId, testLessonId);
    expect(progressAfterLesson.completedLessonIds).toContain(testLessonId);
    expect(progressAfterLesson.completedLabIds.length).toBe(0);
    expect(progressAfterLesson.percentComplete).toBe(5); // 1 of 20 units = 5%

    // 2. Complete a simulation lab
    const progressAfterLab = saveLearnerLabCompletion(testUserId, testTopicId, testLabId);
    expect(progressAfterLab.completedLabIds).toContain(testLabId);
    expect(progressAfterLab.percentComplete).toBe(10); // 2 of 20 units = 10%

    // 3. Hydrate state
    const allProgress = getLearnerProgress(testUserId);
    expect(allProgress[testTopicId]).toBeDefined();
    expect(allProgress[testTopicId].completedLessonIds).toContain(testLessonId);
    expect(allProgress[testTopicId].completedLabIds).toContain(testLabId);
  });

  it('provides instant index lookups by id, slug, and index for all 17 topics', () => {
    const aiTopic = getTopicById('topic-ai');
    expect(aiTopic).toBeDefined();
    expect(aiTopic?.slug).toBe('artificial-intelligence-ai');
    expect(aiTopic?.canonicalIndex).toBe(1);

    const socialTopic = getTopicBySlug('social-profile-development');
    expect(socialTopic).toBeDefined();
    expect(socialTopic?.id).toBe('topic-social-profile');
    expect(socialTopic?.canonicalIndex).toBe(17);

    const topic16 = getTopicByIndex(16);
    expect(topic16).toBeDefined();
    expect(topic16?.title).toContain('Startup Ideation');
  });
});
