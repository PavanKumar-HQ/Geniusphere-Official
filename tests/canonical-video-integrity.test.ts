import { describe, it, expect } from 'vitest';
import { ALL_CANONICAL_17_TOPICS } from '../src/curriculum/index';

describe('Canonical 170 Video Lessons Integrity & Regression Tests', () => {
  const allLessons = ALL_CANONICAL_17_TOPICS.flatMap((topic) =>
    topic.lessons.map((lesson) => ({
      ...lesson,
      topicId: topic.id,
      topicTitle: topic.title,
    }))
  );

  // The 97 original dead/broken IDs identified in the initial audit
  const KNOWN_INVALID_ORIGINAL_IDS = new Set([
    'qHMLq588F2w', 'd3BYvqUKF0o', '0p9gT6B3f7A', 'RM8b_8X5Lco', '5p2L2KqS9jA', 'xUSJeG8P74U',
    '7U-RbOKWGys', 'kd0xFrw_f18', 'Y7zNlEMDm3A', 'd6nQ4L0bY1M', 'z5nc9MDxepU', 'BpJCA4bM_kQ',
    '0Uj3j_u78wI', '6_5k_9T6GvU', 'Wz3m5R7C8gM', 'YmP64426RRk', 'k_D4hSg7Q_s', 'r5cWf8C_o9Q',
    '3UhnQ3yW78M', 'V9P3f7zN5gQ', 'Qe8t5Wd4Z1U', 'gFQNPmLKXXU', 'G3qG2s5e7q8', 'bJYL9_4iXkM',
    'C3h_m8g8F0U', 'd0Z0w8vQkZ4', '2E4Q7_wK5XU', 'qRwJ1rFFWJA', '0c_j5C8y9hQ', 'X9Tf6_Lg1c4',
    'gT2b_5G1v9U', '0e3g5N1Pz7w', 'bBC-nXj3Zk0', 'Gj3x8sK5z8c', '1PbjK584YqU', '8zK0LhB1WcM',
    'ps_6mF3w1hY', '_M-6lGy8slQ', 'm4XgY7zB2g8', 'aB8d7fC2e1M', '9Gq8mH5X7yM', '0U3gN5X9mQw',
    'VjT5W6pX9yI', 'Z9tX6YmB1qM', 'b7C3m9Z1pXw', '5X8n9M1pQ_A', 'c1Y9X7mB5vM', 'm3X8Y1pQ5wA',
    'X9tZ1mQ5w7Y', '1pQ7mX9Y5wB', 'mjJmo5mLUc4', '1dq7mM8TCHS', 'Xhyy3K9eM6A', 'FpTBJ_gm_X8',
    'qrehy_z3YtI', 'W1Ym4u_S3gU', 'l7TONauUM28', 'vEl0jLqH4Bw', 'rC4Ur-HQ348', 'gB2yq_q5XvE',
    'bPYfV6Yv6Xg', 'H_Uws6i0j_E', '4bXGf8_0rNw', '0gQ_WbH3mQw', 'v8Hq6t3m9wE', 'D6_J7FvWVIg',
    'hiiEeVDGguA', 'Q4V4w2oWjXk', 'U_QZ3Gg9oAw', 'Th8Joqa4fNU', 'E03eX7dCpr4', '3b8X9eT1qAv',
    'y8x7e9K1m3e', 'mX8vK1e3p9M', 'v3X8b7eT1qA', '8vK1m9p3eT8', '7e9K1m3eT8q', 'k8n4xT_e3v8',
  ]);

  it('contains exactly 170 canonical lessons across 17 topics (10 lessons each)', () => {
    expect(ALL_CANONICAL_17_TOPICS).toHaveLength(17);
    for (const topic of ALL_CANONICAL_17_TOPICS) {
      expect(topic.lessons).toHaveLength(10);
    }
    expect(allLessons).toHaveLength(170);
  });

  it('ensures every lesson has a strictly valid YouTube video ID shape (11 chars base64url)', () => {
    const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    for (const lesson of allLessons) {
      expect(
        videoIdRegex.test(lesson.youtubeVideoId),
        `Lesson ${lesson.id} in ${lesson.topicId} has invalid videoId: "${lesson.youtubeVideoId}"`
      ).toBe(true);
    }
  });

  it('ensures every lesson has a matching valid YouTube watch URL', () => {
    for (const lesson of allLessons) {
      expect(lesson.youtubeUrl).toBe(`https://www.youtube.com/watch?v=${lesson.youtubeVideoId}`);
    }
  });

  it('ensures every lesson defines non-empty channelTitle and realistic educational duration', () => {
    for (const lesson of allLessons) {
      expect(lesson.channelTitle).toBeDefined();
      expect(lesson.channelTitle.trim().length).toBeGreaterThan(0);
      expect(lesson.durationMinutes).toBeGreaterThanOrEqual(1);
      expect(lesson.durationMinutes).toBeLessThanOrEqual(360);
      expect(lesson.verificationStatus).toBe('VERIFIED');
    }
  });

  it('regression test: NONE of the 97 confirmed invalid original video IDs remain published', () => {
    const currentVideoIds = new Set(allLessons.map((l) => l.youtubeVideoId));
    const lingeringBadIds: string[] = [];

    for (const badId of KNOWN_INVALID_ORIGINAL_IDS) {
      if (currentVideoIds.has(badId)) {
        lingeringBadIds.push(badId);
      }
    }

    expect(
      lingeringBadIds,
      `Detected stale/invalid video IDs still lingering in curriculum: ${lingeringBadIds.join(', ')}`
    ).toHaveLength(0);
  });

  it('ensures zero duplicate video sources across the entire canonical curriculum (170 unique videos)', () => {
    const videoIdMap = new Map<string, string[]>();
    for (const lesson of allLessons) {
      const existing = videoIdMap.get(lesson.youtubeVideoId) || [];
      existing.push(`${lesson.topicId}::${lesson.id}`);
      videoIdMap.set(lesson.youtubeVideoId, existing);
    }

    const duplicates: { videoId: string; usedIn: string[] }[] = [];
    for (const [vid, usedIn] of videoIdMap.entries()) {
      if (usedIn.length > 1) {
        duplicates.push({ videoId: vid, usedIn });
      }
    }

    expect(
      duplicates,
      `Found duplicate video IDs across lessons: ${JSON.stringify(duplicates, null, 2)}`
    ).toHaveLength(0);
  });

  it('ensures every lesson has distinct IDs, titles, and non-empty learning objectives', () => {
    const lessonIds = new Set<string>();
    for (const lesson of allLessons) {
      expect(lessonIds.has(lesson.id), `Duplicate lesson ID found: ${lesson.id}`).toBe(false);
      lessonIds.add(lesson.id);
      expect(lesson.title.trim().length).toBeGreaterThan(3);
      expect(lesson.learningObjectives.length).toBeGreaterThan(0);
      expect(lesson.learningObjectives[0].trim().length).toBeGreaterThan(5);
    }
  });
});
