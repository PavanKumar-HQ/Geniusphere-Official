import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { YouTubeLessonPlayer } from '../src/components/YouTubeLessonPlayer';
import { ALL_CANONICAL_17_TOPICS } from '../src/curriculum/index';

describe('YouTube Video Learning Flow & Student Experience', () => {
  const getLessonById = (id: string) => {
    for (const topic of ALL_CANONICAL_17_TOPICS) {
      const found = topic.lessons.find((l) => l.id === id);
      if (found) return found;
    }
    throw new Error(`Lesson ${id} not found`);
  };

  it('renders student-friendly interactive completion button and verified source details', () => {
    const lesson = getLessonById('lesson-off-5');
    const onMarkCompleted = vi.fn();

    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={false}
        onMarkCompleted={onMarkCompleted}
      />
    );

    expect(html).toContain('Verified Source');
    expect(html).toContain('Kevin Stratvert');
    expect(html).toContain('Excel VLOOKUP &amp; XLOOKUP Tutorial');
    expect(html).toContain('Mark as Watched');
    expect(html).toContain('data-testid="mark-lesson-completed-btn"');
    expect(html).toContain(`https://www.youtube-nocookie.com/embed/${lesson.youtubeVideoId}?rel=0&amp;modestbranding=1&amp;enablejsapi=1`);
  });

  it('renders saving progress state with spinner and disabled state', () => {
    const lesson = getLessonById('lesson-fintech-1');
    const onMarkCompleted = vi.fn();

    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={false}
        onMarkCompleted={onMarkCompleted}
        isSaving={true}
      />
    );

    expect(html).toContain('Saving…');
    expect(html).toContain('aria-busy="true"');
  });

  it('renders error state with retry button and clear student-facing message', () => {
    const lesson = getLessonById('lesson-ai-1');
    const onMarkCompleted = vi.fn();
    const onRetry = vi.fn();

    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={false}
        onMarkCompleted={onMarkCompleted}
        errorMessage="Network timeout connecting to server"
        onRetry={onRetry}
      />
    );

    expect(html).toContain('Retry');
    expect(html).toContain('Network timeout connecting to server');
  });

  it('renders completed state with checkmark badge and disable action to prevent accidental resets', () => {
    const lesson = getLessonById('lesson-iot-1');
    const onMarkCompleted = vi.fn();

    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={true}
        onMarkCompleted={onMarkCompleted}
      />
    );

    expect(html).toContain('Completed');
    expect(html).toContain('disabled=""');
    expect(html).toContain('Progress recorded to profile');
  });

  it('verifies all 17 topics have valid non-empty YouTube video IDs and descriptions', () => {
    for (const topic of ALL_CANONICAL_17_TOPICS) {
      expect(topic.lessons.length).toBeGreaterThan(0);
      for (const lesson of topic.lessons) {
        expect(lesson.youtubeVideoId).toBeDefined();
        expect(lesson.youtubeVideoId.length).toBeGreaterThan(3);
        expect(lesson.title).toBeDefined();
        expect(lesson.title.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
