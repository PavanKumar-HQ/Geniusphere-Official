import { describe, it, expect } from 'vitest';
import { ALL_CANONICAL_17_TOPICS, getAll170Lessons, getAll170Labs } from '../src/curriculum';
import { CANONICAL_COURSES } from '../src/data/canonical-curriculum';

describe('Phase 3 — Canonical Topic & Video Lesson Inventory Integrity Regression Suite', () => {
  it('verifies the 17-topic simulation curriculum inventory has exactly 17 topics, 170 lessons, and 170 labs', () => {
    expect(ALL_CANONICAL_17_TOPICS.length).toBe(17);

    const lessons = getAll170Lessons();
    expect(lessons.length).toBe(170);

    const labs = getAll170Labs();
    expect(labs.length).toBe(170);

    // Verify each topic has exactly 10 lessons and 10 labs
    for (const topic of ALL_CANONICAL_17_TOPICS) {
      expect(topic.lessons.length).toBe(10);
      expect(topic.labs.length).toBe(10);

      // Verify no placeholder rickroll video IDs remain
      for (const lesson of topic.lessons) {
        expect(lesson.youtubeVideoId).not.toBe('dQw4w9WgXcQ');
        expect(lesson.youtubeVideoId.length).toBeGreaterThanOrEqual(11);
        expect(lesson.channelTitle.trim().length).toBeGreaterThan(0);
        expect(lesson.durationMinutes).toBeGreaterThan(0);
      }
    }
  });

  it('verifies the 18-course canonical curriculum inventory has exactly 18 courses and 180 lessons', () => {
    expect(CANONICAL_COURSES.length).toBe(18);

    let totalLessons = 0;
    const courseSlugs: string[] = [];

    for (const course of CANONICAL_COURSES) {
      courseSlugs.push(course.slug);
      expect(course.video_modules.length).toBe(10);
      totalLessons += course.video_modules.length;

      for (const lesson of course.video_modules) {
        expect(lesson.video_id).toBeDefined();
        expect(lesson.video_id).not.toBe('dQw4w9WgXcQ');
        expect(lesson.video_id.length).toBeGreaterThanOrEqual(11);
        expect(lesson.duration_minutes).toBeGreaterThan(0);
        expect(lesson.title.trim().length).toBeGreaterThan(0);
      }
    }

    expect(totalLessons).toBe(180);

    // Verify 18th course existence:
    // The 18th course is 'digital-footprint-privacy'
    expect(courseSlugs).toContain('digital-footprint-privacy');
    expect(courseSlugs).toContain('social-profile-development');
    expect(courseSlugs).toContain('cybersecurity-basics');
  });

  it('verifies the reconciliation between the 17-topic interactive simulation syllabus and 18-course curriculum', () => {
    // 17 topics have full interactive lab suites; 18 courses provide full video curricula
    const topics17Slugs = new Set(ALL_CANONICAL_17_TOPICS.map((t) => t.slug));
    const courses18Slugs = new Set(CANONICAL_COURSES.map((c) => c.slug));

    // Expected 18 courses count vs 17 simulation topics count
    expect(CANONICAL_COURSES.length).toBe(18);
    expect(ALL_CANONICAL_17_TOPICS.length).toBe(17);

    // Specifically verify the 18th course "digital-footprint-privacy" exists in CANONICAL_COURSES
    expect(courses18Slugs.has('digital-footprint-privacy')).toBe(true);
    // And its linked lab slug is digital-privacy-decision-lab
    const privacyCourse = CANONICAL_COURSES.find((c) => c.slug === 'digital-footprint-privacy');
    expect(privacyCourse).toBeDefined();
    expect(privacyCourse?.linked_lab_slug).toBe('digital-privacy-decision-lab');
  });
});
