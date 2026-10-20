import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryDatabase, DatabaseError } from '../src/db/in-memory-db';
import { DomainService } from '../server/services/domainService';

describe('Student Profile, Authorization & Real-Time Sync Semantics', () => {
  let db: InMemoryDatabase;
  const domainService = new DomainService();

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  describe('1. Student Profile Data Truthfulness & Distinction', () => {
    it('retrieves student profile distinguishing personal info from calculated learning stats', () => {
      const studentId = 'user-student-1';
      const profile = db.getStudentProfile(studentId, studentId);

      expect(profile).toBeDefined();
      expect(profile.personalInfo).toBeDefined();
      expect(profile.learningStats).toBeDefined();

      // Personal info
      expect(profile.personalInfo.id).toBe(studentId);
      expect(profile.personalInfo.email).toBe('student1@dpts.edu');
      expect(profile.personalInfo.fullName).toBe('Aarav Patel');
      expect(profile.personalInfo.isMinor).toBe(true);

      // Learning stats are authoritative numbers, not mock strings
      expect(typeof profile.learningStats.xp).toBe('number');
      expect(typeof profile.learningStats.currentStreak).toBe('number');
      expect(typeof profile.learningStats.completedLessonsCount).toBe('number');
      expect(typeof profile.learningStats.enrolledCoursesCount).toBe('number');
      expect(typeof profile.learningStats.labAttemptsCount).toBe('number');
    });

    it('prevents a student from reading another student private profile', () => {
      const student1 = 'user-student-1';
      const student2 = 'user-student-org2';

      expect(() => {
        db.getStudentProfile(student1, student2);
      }).toThrowError(DatabaseError);

      try {
        db.getStudentProfile(student1, student2);
      } catch (err: any) {
        expect(err.statusCode).toBe(403);
        expect(err.message).toContain('Cannot access another student profile');
      }
    });

    it('allows platform superadmin to inspect any student profile', () => {
      const superadminId = 'user-superadmin-1';
      const studentId = 'user-student-org2';

      const profile = db.getStudentProfile(superadminId, studentId);
      expect(profile).toBeDefined();
      expect(profile.personalInfo.id).toBe(studentId);
    });
  });

  describe('2. Profile Modification & Column-Level Privilege Restrictions', () => {
    it('allows a student to update their full name and persists the change', () => {
      const studentId = 'user-student-1';
      const newName = 'Pavan Kumar Srinivasan';

      const updated = db.updateUserProfile(studentId, studentId, {
        full_name: newName,
      });

      expect(updated.full_name).toBe(newName);

      // Verify persistent retrieval
      const fetched = db.getStudentProfile(studentId, studentId);
      expect(fetched.personalInfo.fullName).toBe(newName);
    });

    it('forbids a student from elevating privileges or altering account_status', () => {
      const studentId = 'user-student-1';

      expect(() => {
        db.updateUserProfile(studentId, studentId, {
          is_superadmin: true,
        });
      }).toThrowError(/Permission denied: cannot alter is_superadmin/);

      expect(() => {
        db.updateUserProfile(studentId, studentId, {
          account_status: 'active',
        });
      }).toThrowError(/Permission denied: cannot alter account_status/);
    });

    it('forbids updating another student profile', () => {
      const student1 = 'user-student-1';
      const student2 = 'user-student-2';

      expect(() => {
        db.updateUserProfile(student1, student2, {
          full_name: 'Hacked Name',
        });
      }).toThrowError(DatabaseError);
    });
  });

  describe('3. Mathematical Streak Calculation Semantics', () => {
    it('initializes streak to 1 on first learning activity of the day', () => {
      const streak = domainService.calculateStreak(null, '2026-10-20', 0);
      expect(streak).toBe(1);
    });

    it('maintains streak on multiple qualifying activities on the SAME day (idempotent)', () => {
      const streak1 = domainService.calculateStreak('2026-10-20', '2026-10-20', 3);
      expect(streak1).toBe(3);
    });

    it('increments streak by exactly 1 on consecutive calendar days', () => {
      const streakConsecutive = domainService.calculateStreak('2026-10-19', '2026-10-20', 4);
      expect(streakConsecutive).toBe(5);
    });

    it('resets streak to 1 if one or more calendar days are missed', () => {
      // Missed 2 days (Oct 17 to Oct 20)
      const streakBroken = domainService.calculateStreak('2026-10-17', '2026-10-20', 12);
      expect(streakBroken).toBe(1);
    });

    it('in-memory DB resets streak to 0 if decayed past 1 day without activity', () => {
      const studentId = 'user-student-1';
      const prog = db.getUserProgress(studentId);

      // Simulate last active 5 days ago
      prog.last_active_date = '2026-10-10';
      prog.streak_days = 7;
      db.userProgress.set(studentId, prog);

      const refreshedProg = db.getUserProgress(studentId);
      expect(refreshedProg.streak_days).toBe(0);
    });
  });

  describe('4. Input Validation & Injection Resistance', () => {
    it('validates name constraints in backend domain service', async () => {
      // Name too short (< 2 chars)
      await expect(
        domainService.updateUserProfile('user-student-1', { fullName: 'A' })
      ).rejects.toThrow('Full name must be between 2 and 100 characters');

      // Name with script injection
      await expect(
        domainService.updateUserProfile('user-student-1', { fullName: '<script>alert(1)</script>' })
      ).rejects.toThrow('Full name cannot contain HTML or script characters');
    });
  });
});
