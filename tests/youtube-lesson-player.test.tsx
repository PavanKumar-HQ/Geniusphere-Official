import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { YouTubeLessonPlayer } from '../src/components/YouTubeLessonPlayer';
import { ALL_CANONICAL_17_TOPICS } from '../src/curriculum/index';

describe('YouTubeLessonPlayer Student Experience & Component Verification', () => {
  const getLessonById = (id: string) => {
    for (const topic of ALL_CANONICAL_17_TOPICS) {
      const found = topic.lessons.find((l) => l.id === id);
      if (found) return found;
    }
    throw new Error(`Lesson ${id} not found`);
  };

  it('renders verified source badge, channel title, duration, and iframe embed for repaired lessons', () => {
    // Test sample repaired lesson from Microsoft Office (Lesson 5: XLOOKUP)
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
    expect(html).toContain(`https://www.youtube-nocookie.com/embed/${lesson.youtubeVideoId}?rel=0&amp;modestbranding=1&amp;enablejsapi=1`);
    expect(html).toContain('Mark as Watched');
    expect(html).toContain('Student-confirmed completion');
  });

  it('renders completed state properly with badge and text', () => {
    const lesson = getLessonById('lesson-fintech-1');
    const onMarkCompleted = vi.fn();

    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={true}
        onMarkCompleted={onMarkCompleted}
      />
    );

    expect(html).toContain('Completed');
    expect(html).toContain('Progress recorded to profile');
  });

  it('verifies representative lessons from all 8 heavily repaired topics render without errors', () => {
    const representativeLessonIds = [
      'lesson-bc-9',        // Blockchain
      'lesson-off-5',       // MS Office
      'lesson-cyber-7',     // Cybersecurity Basics
      'lesson-iot-4',       // IoT
      'lesson-fin-5',       // Intro to Finance
      'lesson-stock-3',     // Stock Market
      'lesson-crypto-1',    // Cryptocurrency
      'lesson-fintech-1',   // FinTech
      'lesson-econ-2',      // Global Economy
      'lesson-bank-1',      // Banking Accounts
      'lesson-comm-4',      // Communication
      'lesson-time-6',      // Time Management
      'lesson-soft-2',      // Soft Skills
      'lesson-startup-1',   // Startup Ideation
      'lesson-social-1',    // Social Profile
    ];

    for (const lid of representativeLessonIds) {
      const lesson = getLessonById(lid);
      const html = renderToString(
        <YouTubeLessonPlayer
          lesson={lesson}
          isCompleted={false}
          onMarkCompleted={() => {}}
        />
      );

      expect(html).toContain(lesson.title.replace(/&/g, '&amp;'));
      expect(html).toContain('Verified Source');
      expect(html).toContain(lesson.youtubeVideoId);
      expect(html).toContain(lesson.channelTitle.replace(/&/g, '&amp;'));
    }
  });

  it('renders saving state with accessible spinner and disables button', () => {
    const lesson = getLessonById('lesson-ai-1');
    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={false}
        isSaving={true}
        onMarkCompleted={() => {}}
      />
    );

    expect(html).toContain('Saving…');
    expect(html).toContain('disabled');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Synchronizing with server…');
  });

  it('renders recoverable error state with retry action', () => {
    const lesson = getLessonById('lesson-ai-1');
    const onRetry = vi.fn();
    const html = renderToString(
      <YouTubeLessonPlayer
        lesson={lesson}
        isCompleted={false}
        isSaving={false}
        errorMessage="Network error: failed to persist progress"
        onRetry={onRetry}
        onMarkCompleted={() => {}}
      />
    );

    expect(html).toContain('Retry');
    expect(html).toContain('Network error: failed to persist progress');
    expect(html).not.toContain('Progress recorded to profile');
  });
});
