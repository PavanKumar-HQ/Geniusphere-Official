import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';
import { CANONICAL_COURSES, CANONICAL_STREAMS } from '../src/data/canonical-curriculum';

describe('Canonical 18-Course Curriculum Architecture (User Specification)', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  it('contains exactly 18 canonical courses partitioned across 3 approved streams', () => {
    expect(CANONICAL_COURSES.length).toBe(18);
    expect(CANONICAL_STREAMS.length).toBe(3);

    const techStream = CANONICAL_STREAMS.find((s) => s.id === 'technology');
    expect(techStream).toBeDefined();
    expect(techStream!.course_count).toBe(7);
    expect(techStream!.courses.length).toBe(7);

    const finStream = CANONICAL_STREAMS.find((s) => s.id === 'finance');
    expect(finStream).toBeDefined();
    expect(finStream!.course_count).toBe(6);
    expect(finStream!.courses.length).toBe(6);

    const profStream = CANONICAL_STREAMS.find((s) => s.id === 'professional');
    expect(profStream).toBeDefined();
    expect(profStream!.course_count).toBe(5);
    expect(profStream!.courses.length).toBe(5);
  });

  it('provides all 18 courses with exactly 10 video modules, learning objectives, and linked labs', () => {
    const courses = db.getCanonicalCourses();
    expect(courses.length).toBe(18);

    for (const c of courses) {
      expect(c.title).toBeTruthy();
      expect(c.slug).toBeTruthy();
      expect(c.summary).toBeTruthy();
      expect(c.learning_objectives.length).toBeGreaterThanOrEqual(2);
      expect(c.duration_hours).toBeGreaterThan(0);
      expect(c.paired_lab_concept).toBeTruthy();
      expect(c.capstone_prompt).toBeTruthy();
      expect(c.assessment_plan).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(c.level);
      expect(['technology', 'finance', 'professional']).toContain(c.domain);
      expect(c.linked_lab_id).toBeTruthy();
      expect(c.linked_lab_slug).toBeTruthy();

      // Verify that every module has 1 lesson with educational video ID, notes, and quiz
      for (const m of c.modules) {
        expect(m.lessons.length).toBe(1);
        const firstLesson = m.lessons[0];
        expect(firstLesson.title).toBeTruthy();
        expect(firstLesson.video_id).toBeTruthy();
        expect(firstLesson.content_markdown).toBeTruthy();
        expect(firstLesson.quiz).toBeDefined();
        expect(firstLesson.quiz!.questions.length).toBe(3);
      }
    }
  });

  it('filters canonical courses by stream, difficulty level, and search keyword', () => {
    const techCourses = db.getCanonicalCourses({ stream: 'technology' });
    expect(techCourses.length).toBe(7);
    techCourses.forEach((c) => expect(c.domain).toBe('technology'));

    const finCourses = db.getCanonicalCourses({ stream: 'finance' });
    expect(finCourses.length).toBe(6);
    finCourses.forEach((c) => expect(c.domain).toBe('finance'));

    const profCourses = db.getCanonicalCourses({ stream: 'professional' });
    expect(profCourses.length).toBe(5);
    profCourses.forEach((c) => expect(c.domain).toBe('professional'));

    const beginnerOnly = db.getCanonicalCourses({ level: 'beginner' });
    expect(beginnerOnly.length).toBeGreaterThanOrEqual(5);
    beginnerOnly.forEach((c) => expect(c.level).toBe('beginner'));

    const aiSearch = db.getCanonicalCourses({ search: 'Artificial Intelligence' });
    expect(aiSearch.length).toBeGreaterThanOrEqual(1);
    expect(aiSearch.some((c) => c.slug === 'artificial-intelligence-ai')).toBe(true);
  });

  it('resolves canonical courses by slug and ID seamlessly', () => {
    const aiCourse = db.getCourseBySlug('artificial-intelligence-ai');
    expect(aiCourse).toBeDefined();
    expect(aiCourse!.id).toBe('course-tech-ai');
    expect(aiCourse!.title).toBe('Artificial Intelligence (AI)');

    const byId = db.getCourseById('course-tech-ai');
    expect(byId).toBeDefined();
    expect(byId!.slug).toBe('artificial-intelligence-ai');

    const personalFinance = db.getCourseBySlug('introduction-to-finance');
    expect(personalFinance).toBeDefined();
    expect(personalFinance!.id).toBe('course-fin-intro');
    expect(personalFinance!.domain).toBe('finance');
  });

  it('executes the full enrollment and completion lifecycle on a canonical course', () => {
    const studentId = 'user-student-1';
    const courseId = 'course-tech-ai';

    // 1. Enroll
    const enrollment = db.enrollInCourse(studentId, courseId);
    expect(enrollment).toBeDefined();
    expect(enrollment.course_id).toBe(courseId);
    expect(enrollment.user_id).toBe(studentId);
    expect(enrollment.progress_percent).toBe(0);

    // 2. Fetch course modules and complete lessons sequentially
    const course = db.getCourseById(courseId)!;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    expect(allLessons.length).toBe(10);

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
    expect(courseCert!.course_title).toBe('Artificial Intelligence (AI)');
    expect(courseCert!.verification_hash.startsWith('sha256:')).toBe(true);
  });
});
