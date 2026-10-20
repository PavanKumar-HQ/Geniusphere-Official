import { describe, it, expect } from 'vitest';
import { ALL_CANONICAL_17_TOPICS } from '../src/curriculum/index';

const RUN_LIVE = process.env.RUN_LIVE_OEMBED_TEST === 'true';

describe.skipIf(!RUN_LIVE)('Live YouTube oEmbed External Verification Test Suite', () => {
  const allLessons = ALL_CANONICAL_17_TOPICS.flatMap((topic) =>
    topic.lessons.map((lesson) => ({
      ...lesson,
      topicId: topic.id,
      topicTitle: topic.title,
    }))
  );

  it('verifies all 170 lessons return HTTP 200 via live YouTube oEmbed endpoint', async () => {
    let passed = 0;
    const failures: { lessonId: string; videoId: string; status: any }[] = [];

    for (const lesson of allLessons) {
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${lesson.youtubeVideoId}&format=json`;
        const res = await fetch(url);
        if (res.ok) {
          passed++;
        } else {
          failures.push({ lessonId: lesson.id, videoId: lesson.youtubeVideoId, status: res.status });
        }
      } catch (err: any) {
        failures.push({ lessonId: lesson.id, videoId: lesson.youtubeVideoId, status: err.message });
      }
      // Polite rate-limit delay
      await new Promise((r) => setTimeout(r, 60));
    }

    expect(failures).toHaveLength(0);
    expect(passed).toBe(170);
  }, 120000);
});
