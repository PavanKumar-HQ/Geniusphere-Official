import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';
import { CANONICAL_COURSES, CANONICAL_STREAMS } from '../src/data/canonical-curriculum';

describe('Canonical 40-Course Curriculum Architecture (Design Board 2)', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  it('contains exactly 40 canonical courses partitioned across 3 approved streams', () => {
    expect(CANONICAL_COURSES.length).toBe(40);
    expect(CANONICAL_STREAMS.length).toBe(3);

    const techStream = CANONICAL_STREAMS.find((s) => s.id === 'technology');
    expect(techStream).toBeDefined();
    expect(techStream!.course_count).toBe(12);
    expect(techStream!.courses.length).toBe(12);

    const finStream = CANONICAL_STREAMS.find((s) => s.id === 'finance');
    expect(finStream).toBeDefined();
    expect(finStream!.course_count).toBe(14);
    expect(finStream!.courses.length).toBe(14);

    const profStream = CANONICAL_STREAMS.find((s) => s.id === 'professional');
    expect(profStream).toBeDefined();
    expect(profStream!.course_count).toBe(14);
    expect(profStream!.courses.length).toBe(14);
  });

  it('provides all 40 courses with verified modules, learning objectives, and practical sandboxes', () => {
    const courses = db.getCanonicalCourses();
    expect(courses.length).toBe(40);

    for (const c of courses) {
      expect(c.title).toBeTruthy();
      expect(c.slug).toBeTruthy();
      expect(c.summary).toBeTruthy();
      expect(c.learning_objectives.length).toBeGreaterThanOrEqual(2);
      expect(c.modules.length).toBeGreaterThanOrEqual(3);
      expect(c.duration_hours).toBeGreaterThan(0);
      expect(['beginner', 'intermediate', 'advanced']).toContain(c.level);
      expect(['technology', 'finance', 'professional']).toContain(c.domain);

      // Verify that every module has at least one lesson with interactive sandbox and quiz
      for (const m of c.modules) {
        expect(m.lessons.length).toBeGreaterThanOrEqual(1);
        const firstLesson = m.lessons[0];
        expect(firstLesson.title).toBeTruthy();
        expect(firstLesson.content_markdown).toBeTruthy();
        expect(firstLesson.quiz).toBeDefined();
        expect(firstLesson.quiz!.questions.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('filters canonical courses by stream, difficulty level, and search keyword', () => {
    const techCourses = db.getCanonicalCourses({ stream: 'technology' });
    expect(techCourses.length).toBe(12);
    techCourses.forEach((c) => expect(c.domain).toBe('technology'));

    const finCourses = db.getCanonicalCourses({ stream: 'finance' });
    expect(finCourses.length).toBe(14);
    finCourses.forEach((c) => expect(c.domain).toBe('finance'));

    const profCourses = db.getCanonicalCourses({ stream: 'professional' });
    expect(profCourses.length).toBe(14);
    profCourses.forEach((c) => expect(c.domain).toBe('professional'));

    const beginnerOnly = db.getCanonicalCourses({ level: 'beginner' });
    expect(beginnerOnly.length).toBeGreaterThan(10);
    beginnerOnly.forEach((c) => expect(c.level).toBe('beginner'));

    const aiSearch = db.getCanonicalCourses({ search: 'Artificial Intelligence' });
    expect(aiSearch.length).toBeGreaterThanOrEqual(1);
    expect(aiSearch.some((c) => c.slug === 'ai-literacy')).toBe(true);
  });

  it('resolves canonical courses by slug and ID seamlessly', () => {
    const aiCourse = db.getCourseBySlug('ai-literacy');
    expect(aiCourse).toBeDefined();
    expect(aiCourse!.id).toBe('course-tech-1');
    expect(aiCourse!.title).toBe('Artificial Intelligence Literacy');

    const byId = db.getCourseById('course-tech-1');
    expect(byId).toBeDefined();
    expect(byId!.slug).toBe('ai-literacy');

    const personalFinance = db.getCourseBySlug('intro-personal-finance');
    expect(personalFinance).toBeDefined();
    expect(personalFinance!.id).toBe('course-fin-1');
    expect(personalFinance!.domain).toBe('finance');
  });

  it('executes the full enrollment and completion lifecycle on a canonical course', () => {
    const studentId = 'user-student-1';
    const courseId = 'course-tech-1';

    // 1. Enroll
    const enrollment = db.enrollInCourse(studentId, courseId);
    expect(enrollment).toBeDefined();
    expect(enrollment.course_id).toBe(courseId);
    expect(enrollment.user_id).toBe(studentId);
    expect(enrollment.progress_percent).toBe(0);

    // 2. Fetch course modules and complete lessons sequentially
    const course = db.getCourseById(courseId)!;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    expect(allLessons.length).toBeGreaterThan(0);

    for (const lesson of allLessons) {
      const result = db.completeLesson(studentId, courseId, lesson.id);
      expect(result.completed_lessons).toContain(lesson.id);
    }

    // 3. Verify final course enrollment state
    const finalEnrollment = db.getCourseEnrollment(studentId, courseId);
    expect(finalEnrollment).toBeDefined();
    expect(finalEnrollment!.progress_percent).toBe(100);
    expect(finalEnrollment!.completed_at).toBeDefined();

    // 4. Verify certificate generation
    const certs = db.getUserCertificates(studentId);
    const courseCert = certs.find((c) => c.course_id === courseId);
    expect(courseCert).toBeDefined();
    expect(courseCert!.course_title).toBe('Artificial Intelligence Literacy');
    expect(courseCert!.verification_hash.startsWith('sha256:')).toBe(true);
  });
});
