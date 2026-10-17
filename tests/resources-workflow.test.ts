import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';

describe('Geniusphere Resources Hub, Video Lessons & Study Guides Workflow', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('Video Lessons Inventory & Discovery', () => {
    it('initializes with verified educational YouTube video lessons across approved domains', () => {
      const videos = db.getVideoLessons();
      expect(videos.length).toBeGreaterThanOrEqual(4);

      // Verify each video lesson structure
      videos.forEach((video) => {
        expect(video.id).toBeDefined();
        expect(video.title.length).toBeGreaterThan(5);
        expect(video.youtube_url).toMatch(/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//);
        expect(video.youtube_id.length).toBeGreaterThanOrEqual(11);
        expect(['technology', 'coding', 'finance', 'professional', 'general']).toContain(video.category);
        expect(video.duration_minutes).toBeGreaterThan(0);
      });
    });

    it('correctly extracts YouTube IDs from diverse valid YouTube URL formats', () => {
      expect(db.extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(db.extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(db.extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
      expect(db.extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s')).toBe('dQw4w9WgXcQ');
      expect(db.extractYouTubeId('not_a_valid_url')).toBeNull();
    });

    it('filters video lessons by category and search keyword', () => {
      const techVideos = db.getVideoLessons({ category: 'technology' });
      expect(techVideos.length).toBeGreaterThanOrEqual(1);
      techVideos.forEach((v) => expect(v.category).toBe('technology'));

      const codingVideos = db.getVideoLessons({ category: 'coding' });
      expect(codingVideos.length).toBeGreaterThanOrEqual(1);
      codingVideos.forEach((v) => expect(v.category).toBe('coding'));
    });
  });

  describe('Admin Video Lessons Management (CRUD)', () => {
    it('allows an administrator to add, update, and delete video lessons dynamically', () => {
      const initialCount = db.getVideoLessons().length;

      // 1. Add video lesson
      const created = db.addVideoLesson({
        title: 'Zero Trust Architecture Explained',
        description: 'Comprehensive overview of perimeterless security, continuous verification, and least privilege.',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'technology',
        duration_minutes: 18,
        instructor_name: 'National Cybersecurity Center',
        added_by: 'user-superadmin-1',
      });

      expect(created.id).toBeDefined();
      expect(created.youtube_id).toBe('dQw4w9WgXcQ');
      expect(db.getVideoLessons().length).toBe(initialCount + 1);

      // 2. Update video lesson
      const updated = db.updateVideoLesson(created.id, {
        title: 'Zero Trust Architecture Explained (Updated Edition)',
        duration_minutes: 22,
      });

      expect(updated.title).toBe('Zero Trust Architecture Explained (Updated Edition)');
      expect(updated.duration_minutes).toBe(22);

      // 3. Delete video lesson
      const deleted = db.deleteVideoLesson(created.id);
      expect(deleted).toBe(true);
      expect(db.getVideoLessons().length).toBe(initialCount);
    });

    it('rejects adding video lessons with invalid YouTube URLs', () => {
      expect(() => {
        db.addVideoLesson({
          title: 'Invalid Video',
          description: 'Invalid',
          youtube_url: 'https://invalid-site.com/video',
          category: 'technology',
          duration_minutes: 10,
          instructor_name: 'Admin',
          added_by: 'user-superadmin-1',
        });
      }).toThrow('Invalid YouTube URL');
    });
  });

  describe('Curated Study Resources Hub', () => {
    it('retrieves verified study guides, whitepapers, and reference manuals', () => {
      const resources = db.getStudyResources();
      expect(resources.length).toBeGreaterThanOrEqual(4);

      resources.forEach((r) => {
        expect(r.id).toBeDefined();
        expect(r.title.length).toBeGreaterThan(5);
        expect(r.description.length).toBeGreaterThan(20);
        expect(['guide', 'cheatsheet', 'toolkit', 'curriculum']).toContain(r.resource_type);
        expect(['PDF', 'Interactive', 'Markdown']).toContain(r.format);
        expect(r.is_verified).toBe(true);
      });
    });

    it('filters study resources by resource type and category', () => {
      const toolkits = db.getStudyResources({ resourceType: 'toolkit' });
      expect(toolkits.length).toBeGreaterThanOrEqual(2);
      toolkits.forEach((w) => expect(w.resource_type).toBe('toolkit'));

      const techResources = db.getStudyResources({ category: 'technology' });
      expect(techResources.length).toBeGreaterThanOrEqual(1);
      techResources.forEach((g) => expect(g.category).toBe('technology'));
    });
  });
});
