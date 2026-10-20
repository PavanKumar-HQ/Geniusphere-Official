import { query, withTransaction } from '../db';
import { UserSessionPayload } from '../auth';

export class DomainService {
  /**
   * Fetch all published courses or all courses if superadmin
   */
  public async getCourses(isSuperadmin: boolean = false) {
    const res = await query(
      isSuperadmin
        ? `SELECT * FROM public.courses ORDER BY created_at DESC`
        : `SELECT * FROM public.courses WHERE is_published = TRUE ORDER BY created_at DESC`
    );
    return res.rows;
  }

  public async getCourseByIdOrSlug(identifier: string) {
    const res = await query(
      `SELECT * FROM public.courses WHERE id::text = $1 OR slug = $1 LIMIT 1`,
      [identifier]
    );
    return res.rows[0] || null;
  }

  /**
   * Enroll a user in a course
   */
  public async enrollInCourse(userId: string, courseId: string) {
    return withTransaction(async (client) => {
      // 1. Check if course exists
      const courseRes = await client.query(
        `SELECT id, title, slug FROM public.courses WHERE id = $1`,
        [courseId]
      );
      if (courseRes.rowCount === 0) {
        throw new Error('Course not found');
      }

      // 2. Insert enrollment
      const res = await client.query(
        `INSERT INTO public.course_enrollments (course_id, user_id, status)
         VALUES ($1, $2, 'active')
         ON CONFLICT (course_id, user_id) DO UPDATE SET status = 'active'
         RETURNING *`,
        [courseId, userId]
      );

      // 3. Insert transactional outbox event
      const eventId = `evt_enroll_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await client.query(
        `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
         VALUES ($1, $2, $3)`,
        [
          eventId,
          'enrollment.created',
          JSON.stringify({
            userId,
            courseId,
            courseTitle: courseRes.rows[0].title,
            courseSlug: courseRes.rows[0].slug,
            enrolledAt: new Date().toISOString(),
          }),
        ]
      );

      return res.rows[0];
    });
  }

  public async getUserEnrollments(userId: string) {
    const res = await query(
      `SELECT e.*, c.title as course_title, c.slug as course_slug, c.domain as course_domain, c.difficulty_level
       FROM public.course_enrollments e
       JOIN public.courses c ON c.id = e.course_id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );
    return res.rows;
  }

  /**
   * Complete a lesson, update XP, update streak, and create outbox event in ONE transaction
   */
  public async completeLesson(
    userId: string,
    courseId: string,
    lessonId: string,
    score: number = 100
  ) {
    return withTransaction(async (client) => {
      // 1. Verify course
      const courseRes = await client.query(
        `SELECT id, title, slug FROM public.courses WHERE id = $1`,
        [courseId]
      );
      if (courseRes.rowCount === 0) {
        throw new Error('Course not found');
      }

      // 2. Insert or update lesson completion
      const compRes = await client.query(
        `INSERT INTO public.lesson_completions (user_id, course_id, lesson_id, score, completed_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, course_id, lesson_id) 
         DO UPDATE SET score = GREATEST(lesson_completions.score, EXCLUDED.score), completed_at = NOW()
         RETURNING *`,
        [userId, courseId, lessonId, score]
      );

      // 3. Mathematical streak calculation & XP attribution
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const xpReward = 50;

      const progressRes = await client.query(
        `SELECT * FROM public.user_progress WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );

      let currentStreak = 1;
      let newXp = xpReward;
      let totalTime = 60;

      if (progressRes.rowCount && progressRes.rowCount > 0) {
        const prog = progressRes.rows[0];
        newXp = prog.xp + xpReward;
        totalTime = prog.total_time_spent_seconds + 60;

        if (prog.streak_last_extended_date) {
          const lastDate = new Date(prog.streak_last_extended_date);
          const diffDays = Math.floor(
            (new Date(todayStr).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 0) {
            // Already extended today, maintain streak
            currentStreak = prog.current_streak;
          } else if (diffDays === 1) {
            // Consecutive day, increment streak
            currentStreak = prog.current_streak + 1;
          } else {
            // Broken streak, reset to 1
            currentStreak = 1;
          }
        }

        await client.query(
          `UPDATE public.user_progress 
           SET xp = $1, current_streak = $2, streak_last_extended_date = $3, last_active_at = NOW(), total_time_spent_seconds = $4, updated_at = NOW()
           WHERE user_id = $5`,
          [newXp, currentStreak, todayStr, totalTime, userId]
        );
      } else {
        await client.query(
          `INSERT INTO public.user_progress 
           (user_id, xp, current_streak, streak_last_extended_date, last_active_at, total_time_spent_seconds)
           VALUES ($1, $2, $3, $4, NOW(), $5)`,
          [userId, newXp, currentStreak, todayStr, totalTime]
        );
      }

      // 4. Insert transactional outbox event
      const eventId = `evt_les_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await client.query(
        `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
         VALUES ($1, $2, $3)`,
        [
          eventId,
          'lesson.completed',
          JSON.stringify({
            userId,
            courseId,
            courseTitle: courseRes.rows[0].title,
            courseSlug: courseRes.rows[0].slug,
            lessonId,
            score,
            xpEarned: xpReward,
            streak: currentStreak,
            completedAt: now.toISOString(),
          }),
        ]
      );

      return {
        completion: compRes.rows[0],
        progress: { xp: newXp, streak: currentStreak },
      };
    });
  }

  /**
   * Get user progress (XP, streaks, completions)
   */
  public async getUserProgress(userId: string) {
    const progRes = await query(
      `SELECT * FROM public.user_progress WHERE user_id = $1`,
      [userId]
    );
    const compsRes = await query(
      `SELECT * FROM public.lesson_completions WHERE user_id = $1 ORDER BY completed_at DESC`,
      [userId]
    );

    return {
      progress: progRes.rows[0] || {
        user_id: userId,
        xp: 0,
        current_streak: 0,
        total_time_spent_seconds: 0,
        last_active_at: new Date().toISOString(),
      },
      completions: compsRes.rows,
    };
  }

  /**
   * Record interactive lab run / attempt
   */
  public async recordLabAttempt(
    userId: string,
    labSlug: string,
    score: number,
    status: 'completed' | 'failed' | 'in_progress',
    details: any = {}
  ) {
    const res = await query(
      `INSERT INTO public.lab_attempts (user_id, lab_slug, score, status, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, labSlug, score, status, JSON.stringify(details)]
    );
    return res.rows[0];
  }

  /**
   * Grade student submission (Teacher authority verified)
   */
  public async gradeSubmission(
    actor: UserSessionPayload,
    submissionId: string,
    grade: number,
    feedback: string
  ) {
    return withTransaction(async (client) => {
      // 1. Fetch submission and classroom
      const subRes = await client.query(
        `SELECT s.*, a.classroom_id, c.teacher_id, c.organization_id, u.full_name as student_name
         FROM public.submissions s
         JOIN public.assignments a ON a.id = s.assignment_id
         JOIN public.classrooms c ON c.id = a.classroom_id
         JOIN public.users u ON u.id = s.student_id
         WHERE s.id = $1`,
        [submissionId]
      );

      if (subRes.rowCount === 0) {
        throw new Error('Submission not found');
      }

      const sub = subRes.rows[0];

      // 2. Authorization: Teacher must own the classroom, or actor must be superadmin
      if (!actor.isSuperadmin && sub.teacher_id !== actor.userId) {
        throw new Error('Unauthorized: only classroom teacher can grade submissions');
      }

      // 3. Update submission
      const updated = await client.query(
        `UPDATE public.submissions 
         SET score = $1, passed = ($1 >= 60), 
             verification_log = jsonb_build_object('feedback', $2::text, 'graded_by', $3::text, 'graded_at', NOW()::text)
         WHERE id = $4
         RETURNING *`,
        [grade, feedback, actor.userId, submissionId]
      );

      // 4. Insert transactional outbox event
      const eventId = `evt_grd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await client.query(
        `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
         VALUES ($1, $2, $3)`,
        [
          eventId,
          'assessment.graded',
          JSON.stringify({
            submissionId,
            studentId: sub.student_id,
            studentName: sub.student_name,
            assignmentId: sub.assignment_id,
            grade,
            feedback,
            gradedBy: actor.userId,
            gradedAt: new Date().toISOString(),
          }),
        ]
      );

      return updated.rows[0];
    });
  }
}

export const domainService = new DomainService();
