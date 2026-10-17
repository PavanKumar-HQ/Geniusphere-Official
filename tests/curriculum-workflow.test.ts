import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase } from '../src/db/in-memory-db';
import { ALL_COURSES, LEARNING_PATHS } from '../src/data/curriculum';

describe('Geniusphere Curriculum, Enrollment, Quiz & Classroom Join Code Workflow', () => {
  let db: InMemoryDatabase;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('Curriculum Inventory & Discovery', () => {
    it('contains exactly 27 curricular subjects strictly mapped to the 4 authorized categories', () => {
      expect(ALL_COURSES.length).toBe(27);

      const techCourses = ALL_COURSES.filter((c) => c.domain === 'technology');
      const codingCourses = ALL_COURSES.filter((c) => c.domain === 'coding');
      const financeCourses = ALL_COURSES.filter((c) => c.domain === 'finance');
      const profCourses = ALL_COURSES.filter((c) => c.domain === 'professional');

      // Category A: Technology (8 subjects)
      expect(techCourses.length).toBe(8);
      // Category B: Coding & Programming (8 subjects)
      expect(codingCourses.length).toBe(8);
      // Category C: Finance (7 subjects)
      expect(financeCourses.length).toBe(7);
      // Category D: Professional Skills (4 subjects)
      expect(profCourses.length).toBe(4);

      expect(techCourses.length + codingCourses.length + financeCourses.length + profCourses.length).toBe(27);

      // Verify ZERO unrequested subject categories exist
      const unrequested = ALL_COURSES.filter((c) =>
        ['business', 'sales', 'marketing', 'entrepreneurship', 'accounting'].includes(c.domain as string)
      );
      expect(unrequested.length).toBe(0);

      // Verify all 4 approved Learning Paths
      expect(LEARNING_PATHS.length).toBe(4);
      const pathSlugs = LEARNING_PATHS.map((p) => p.slug);
      expect(pathSlugs).toContain('technology-cybersecurity');
      expect(pathSlugs).toContain('coding-programming');
      expect(pathSlugs).toContain('finance-literacy');
      expect(pathSlugs).toContain('professional-skills-identity');
    });

    it('filters courses by domain, level, and published status through database querying', () => {
      const all = db.getCourses();
      expect(all.length).toBe(27);

      const published = db.getCourses({ publishedOnly: true });
      expect(published.length).toBeGreaterThanOrEqual(4);
      published.forEach((c) => expect(c.is_published).toBe(true));

      const financeOnly = db.getCourses({ domain: 'finance' });
      expect(financeOnly.length).toBe(7);
      financeOnly.forEach((c) => expect(c.domain).toBe('finance'));

      const codingOnly = db.getCourses({ domain: 'coding' });
      expect(codingOnly.length).toBe(8);
      codingOnly.forEach((c) => expect(c.domain).toBe('coding'));

      const techOnly = db.getCourses({ domain: 'technology' });
      expect(techOnly.length).toBe(8);
      techOnly.forEach((c) => expect(c.domain).toBe('technology'));

      const profOnly = db.getCourses({ domain: 'professional' });
      expect(profOnly.length).toBe(4);
      profOnly.forEach((c) => expect(c.domain).toBe('professional'));

      const searchResult = db.getCourses({ search: 'Cybersecurity' });
      expect(searchResult.length).toBeGreaterThanOrEqual(1);
      expect(
        searchResult.some(
          (c) => c.title.toLowerCase().includes('cybersecurity') || c.summary.toLowerCase().includes('cybersecurity')
        )
      ).toBe(true);
    });

    it('retrieves detailed course structure, learning objectives, and quiz definitions', () => {
      const course = db.getCourseBySlug('cybersecurity-defensive-web');
      expect(course).toBeDefined();
      expect(course!.id).toBe('course-web-sec');
      expect(course!.learning_objectives.length).toBeGreaterThan(0);
      expect(course!.prerequisites.length).toBeGreaterThan(0);
      expect(course!.modules.length).toBeGreaterThan(0);

      const firstModule = course!.modules[0];
      expect(firstModule.lessons.length).toBeGreaterThan(0);

      const firstLesson = firstModule.lessons[0];
      expect(firstLesson.quiz).toBeDefined();
      expect(firstLesson.quiz!.questions.length).toBe(2);
      expect(firstLesson.quiz!.questions[0].options.length).toBe(4);
      expect(firstLesson.quiz!.questions[0].correct_option_index).toBe(0);
    });
  });

  describe('Student Enrollment & Lesson Progress', () => {
    it('allows a student to enroll in a course and tracks progress authentically', () => {
      const studentId = 'user-student-org2';
      const courseId = 'course-web-sec';

      // Initially not enrolled
      let enrollment = db.getCourseEnrollment(studentId, courseId);
      expect(enrollment).toBeNull();

      // Enroll student
      enrollment = db.enrollInCourse(studentId, courseId);
      expect(enrollment.user_id).toBe(studentId);
      expect(enrollment.course_id).toBe(courseId);
      expect(enrollment.progress_percent).toBe(0);
      expect(enrollment.completed_lessons).toEqual([]);

      // Complete first lesson (course has 10 lessons -> 10% progress)
      const updated1 = db.completeLesson(studentId, courseId, 'les-sec-101');
      expect(updated1.completed_lessons).toContain('les-sec-101');
      expect(updated1.progress_percent).toBe(10);

      // Re-completing the same lesson does not duplicate or artificially inflate progress
      const duplicateComplete = db.completeLesson(studentId, courseId, 'les-sec-101');
      expect(duplicateComplete.completed_lessons.length).toBe(1);
      expect(duplicateComplete.progress_percent).toBe(10);

      // Complete all remaining lessons in the 10-module course -> 100% progress
      for (let i = 2; i <= 10; i++) {
        db.completeLesson(studentId, courseId, `les-course-web-sec-${i}`);
      }
      const allDone = db.getCourseEnrollment(studentId, courseId);
      expect(allDone!.completed_lessons.length).toBe(10);
      expect(allDone!.progress_percent).toBe(100);
      expect(allDone!.completed_at).toBeDefined();
    });
  });

  describe('Classroom Join Code Generation, Revocation, and Membership', () => {
    it('generates high-entropy cryptographic join codes with valid expiration', () => {
      const teacherId = 'user-teacher-1';
      const classroomId = 'class-sec-101';

      const code1 = db.generateClassroomJoinCode(teacherId, classroomId);
      expect(code1.join_code).toMatch(/^[A-Z0-9]{8}$/);
      expect(code1.id).toBe(classroomId);
      expect(code1.is_active).toBe(true);

      const expDate = new Date(code1.join_code_expires_at).getTime();
      const now = Date.now();
      // Should expire approximately 14 days in the future (within 10 seconds tolerance)
      const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
      expect(expDate - now).toBeGreaterThan(fourteenDaysMs - 10000);
      expect(expDate - now).toBeLessThanOrEqual(fourteenDaysMs + 1000);

      // Generating a second code should produce a different unpredictable random code
      const code2 = db.generateClassroomJoinCode(teacherId, classroomId);
      expect(code2.join_code).not.toBe(code1.join_code);
    });

    it('allows students to join with valid codes and prevents duplicate or unauthorized memberships', () => {
      const studentId = 'user-student-org2';
      const classroomId = 'class-sec-101';

      // Generate a fresh active code (teacherId, classroomId)
      const updatedClass = db.generateClassroomJoinCode('user-teacher-1', classroomId);

      // Join classroom (studentUserId, joinCode)
      const joinResult = db.validateAndJoinClassroom(studentId, updatedClass.join_code);
      expect(joinResult.classroom.id).toBe(classroomId);
      expect(joinResult.enrollment.student_id).toBe(studentId);

      // Verify membership exists in DB
      expect(db.isEnrolledStudent(studentId, classroomId)).toBe(true);

      // Attempting to join the same classroom again throws a duplicate error
      expect(() => {
        db.validateAndJoinClassroom(studentId, updatedClass.join_code);
      }).toThrow('already enrolled');
    });

    it('rejects invalid, revoked, or expired join codes', () => {
      const studentId = 'user-student-org2';
      const classroomId = 'class-sec-101';

      // 1. Invalid code
      expect(() => {
        db.validateAndJoinClassroom(studentId, 'NONEXIST');
      }).toThrow('Invalid or inactive');

      // 2. Revoked code (teacherUserId, classroomId)
      const codeObj = db.generateClassroomJoinCode('user-teacher-1', classroomId);
      db.revokeClassroomJoinCode('user-teacher-1', classroomId);

      expect(() => {
        db.validateAndJoinClassroom(studentId, codeObj.join_code);
      }).toThrow('expired');

      // 3. Expired code simulation
      const expiredObj = db.generateClassroomJoinCode('user-teacher-1', classroomId);
      expiredObj.join_code_expires_at = new Date(Date.now() - 1000).toISOString(); // set in the past
      db.classrooms.set(classroomId, expiredObj);

      expect(() => {
        db.validateAndJoinClassroom(studentId, expiredObj.join_code);
      }).toThrow('expired');
    });
  });

  describe('Student Resume Builder & Verified Credentials', () => {
    it('retrieves and updates student resumes with persistent skills and projects', () => {
      const studentId = 'user-student-1';
      const resume = db.getResume(studentId);
      expect(resume).toBeDefined();
      expect(resume!.full_name).toBe('Aarav Patel');
      expect(resume!.skills.length).toBeGreaterThan(0);

      // Update resume with new skills and project
      db.saveResume(studentId, {
        full_name: 'Aarav Patel',
        email: 'student1@dpts.edu',
        headline: 'Aspiring Cybersecurity Defender & Full Stack Engineer',
        summary: 'Focused on application security and defensive software architectures.',
        skills: ['Web Security', 'TypeScript', 'Defensive Parameterization', 'PostgreSQL RLS'],
        projects: [
          {
            id: 'proj-def-1',
            title: 'Defensive Web Application Architecture',
            description: 'Implemented defensive parameterization and token integrity validation with authoritative server assertions.',
            technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
          },
        ],
      });

      const updated = db.getResume(studentId);
      expect(updated!.skills).toContain('PostgreSQL RLS');
      expect(updated!.projects.length).toBe(1);
      expect(updated!.projects[0].title).toBe('Defensive Web Application Architecture');
    });

    it('reflects verified database credentials from authoritative lab submissions', () => {
      const studentId = 'user-student-1';

      // Create and grade an authentic submission
      const draft = db.createSubmissionDraft(
        studentId,
        'assign-lab-101',
        `defensive_input_sanitizer_and_token_validator`
      );

      const graded = db.persistServerGrade(
        draft.id,
        true,
        100,
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        {
          all_passed: true,
          score: 100,
          execution_region: 'ap-south-1',
          details: 'All 5 server-authoritative defense assertions passed',
        }
      );

      expect(graded.passed).toBe(true);
      expect(graded.score).toBe(100);
      expect(graded.submission_hash).toBeDefined();
      expect(graded.submission_hash.length).toBe(64);

      // Submissions in DB for student1 are confirmed
      const studentSubmissions = Array.from(db.submissions.values()).filter(
        (s) => s.student_id === studentId && s.passed
      );
      expect(studentSubmissions.length).toBeGreaterThan(0);
      expect(studentSubmissions[0].score).toBe(100);
    });
  });
});
