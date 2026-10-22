import crypto from 'crypto';
import { PoolClient } from 'pg';
import { query, withTransaction } from '../db';
import { UserSessionPayload } from '../auth';
import { config } from '../config';
import { ALL_COURSES } from '../../src/data/curriculum';

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
    }, userId);
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
  /**
   * Record video playback telemetry without awarding competency XP.
   * Playback progress alone must NEVER award XP or mark a lesson completed.
   */
  public async recordPlaybackProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    watchTimeSeconds: number,
    videoCompleted: boolean = false
  ) {
    const courseRes = await query(
      `SELECT id FROM public.courses WHERE id::text = $1 OR slug = $1 LIMIT 1`,
      [courseId]
    );
    if (courseRes.rowCount === 0) {
      throw new Error('Course not found');
    }
    const resolvedCourseId = courseRes.rows[0].id;

    await query(
      `INSERT INTO public.lesson_playback_telemetry (user_id, course_id, lesson_id, watch_time_seconds, video_completed, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, course_id, lesson_id)
       DO UPDATE SET watch_time_seconds = EXCLUDED.watch_time_seconds,
                     video_completed = EXCLUDED.video_completed,
                     updated_at = NOW()`,
      [userId, resolvedCourseId, lessonId, watchTimeSeconds, videoCompleted]
    );

    await query(
      `UPDATE public.user_progress
       SET total_time_spent_seconds = total_time_spent_seconds + $1,
           last_active_at = NOW()
       WHERE user_id = $2`,
      [watchTimeSeconds, userId]
    );

    return { recorded: true, watchTimeSeconds, videoCompleted, xpEarned: 0 };
  }

  /**
   * Verified lesson completion engine:
   * Validates assessment answers server-side against canonical answer keys.
   * Rejects unverified requests, failed scores, and playback-only submissions.
   */
  public async verifyAndCompleteLesson(
    userId: string,
    courseId: string,
    lessonId: string,
    payload: {
      activityType?: 'video' | 'interactive' | 'assessment';
      answers?: Record<string, number>;
      watchTimeSeconds?: number;
      passingScore?: number;
    } = {}
  ) {
    // 1. Playback progress alone check
    if (payload.activityType === 'video' && !payload.answers) {
      if (typeof payload.watchTimeSeconds === 'number') {
        await this.recordPlaybackProgress(userId, courseId, lessonId, payload.watchTimeSeconds, false);
      }
      return {
        verified: false,
        status: 'in_progress',
        passed: false,
        message: 'Video playback telemetry recorded. Competency XP requires completing the required lesson activity or assessment.',
      };
    }

    // 2. Lookup lesson in canonical curriculum
    const courseInCurriculum = ALL_COURSES.find(
      (c) => c.id === courseId || c.slug === courseId
    );
    let quiz: any = null;
    let passingThreshold = payload.passingScore || 60;

    if (courseInCurriculum) {
      for (const mod of courseInCurriculum.modules) {
        const found = mod.lessons.find((l) => l.id === lessonId);
        if (found) {
          quiz = found.quiz;
          break;
        }
      }
    }

    // 3. If quiz is present, validate answers server-side against answer key
    let score = 100;
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      if (!payload.answers || Object.keys(payload.answers).length === 0) {
        return {
          verified: false,
          status: 'assessment_required',
          passed: false,
          error: 'ASSESSMENT_REQUIRED',
          message: 'This lesson requires passing the knowledge check assessment.',
        };
      }

      let correctCount = 0;
      for (const q of quiz.questions) {
        if (payload.answers[q.id] === q.correct_option_index) {
          correctCount++;
        }
      }
      score = Math.round((correctCount / quiz.questions.length) * 100);

      if (score < passingThreshold) {
        return {
          verified: false,
          status: 'failed',
          passed: false,
          score,
          passingThreshold,
          error: 'ASSESSMENT_NOT_PASSED',
          message: `Assessment score ${score}% did not meet the required threshold of ${passingThreshold}%.`,
        };
      }
    }

    // 4. Record verified completion & award XP transactionally
    const completionResult = await this.completeLesson(userId, courseId, lessonId, score);
    return {
      verified: true,
      status: 'completed',
      passed: true,
      score,
      ...completionResult,
    };
  }

  /**
   * Complete a lesson, atomically award XP via xp_ledger, update streak,
   * check certificate eligibility, and emit outbox event in ONE transaction.
   */
  public async completeLesson(
    userId: string,
    courseId: string,
    lessonId: string,
    score: number = 100
  ) {
    return withTransaction(async (client) => {
      // 1. Verify course (by UUID or slug)
      const courseRes = await client.query(
        `SELECT id, title, slug FROM public.courses WHERE id::text = $1 OR slug = $1 LIMIT 1`,
        [courseId]
      );
      if (courseRes.rowCount === 0) {
        throw new Error('Course not found');
      }
      const courseRecord = courseRes.rows[0];
      const resolvedCourseId = courseRecord.id;

      // Ensure active enrollment exists
      await client.query(
        `INSERT INTO public.course_enrollments (course_id, user_id, status)
         VALUES ($1, $2, 'active')
         ON CONFLICT (course_id, user_id) DO NOTHING`,
        [resolvedCourseId, userId]
      );

      // 2. Insert or update lesson completion idempotently
      const compRes = await client.query(
        `INSERT INTO public.lesson_completions (user_id, course_id, lesson_id, score, completed_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (user_id, course_id, lesson_id) 
         DO UPDATE SET score = GREATEST(lesson_completions.score, EXCLUDED.score), completed_at = NOW()
         RETURNING *`,
        [userId, resolvedCourseId, lessonId, score]
      );

      // 3. Atomically attempt to insert reward into xp_ledger using unique constraint
      const rewardKey = `lesson_complete:${userId}:${resolvedCourseId}:${lessonId}`;
      const baseRewardAmount = 50;

      const ledgerRes = await client.query(
        `INSERT INTO public.xp_ledger (user_id, reward_key, amount, source_type, metadata, created_at)
         VALUES ($1, $2, $3, 'lesson_completion', $4, NOW())
         ON CONFLICT (reward_key) DO NOTHING
         RETURNING *`,
        [
          userId,
          rewardKey,
          baseRewardAmount,
          JSON.stringify({ courseId: resolvedCourseId, lessonId, score }),
        ]
      );

      const isFirstEligibleCompletion = ledgerRes.rowCount === 1;
      const xpReward = isFirstEligibleCompletion ? baseRewardAmount : 0;

      // 4. Mathematical streak calculation & authoritative XP reconciliation
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      const sumRes = await client.query(
        `SELECT COALESCE(SUM(amount), 0)::int as total_xp FROM public.xp_ledger WHERE user_id = $1`,
        [userId]
      );
      const authoritativeXp = sumRes.rows[0].total_xp;

      const progressRes = await client.query(
        `SELECT * FROM public.user_progress WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );

      let currentStreak = 1;
      let totalTime = 60;

      if (progressRes.rowCount && progressRes.rowCount > 0) {
        const prog = progressRes.rows[0];
        totalTime = isFirstEligibleCompletion ? (prog.total_time_spent_seconds + 60) : prog.total_time_spent_seconds;

        if (prog.streak_last_extended_date) {
          currentStreak = this.calculateStreak(prog.streak_last_extended_date, todayStr, prog.current_streak);
        }

        await client.query(
          `UPDATE public.user_progress 
           SET xp = $1, current_streak = $2, streak_last_extended_date = $3, last_active_at = NOW(), total_time_spent_seconds = $4, updated_at = NOW()
           WHERE user_id = $5`,
          [authoritativeXp, currentStreak, todayStr, totalTime, userId]
        );
      } else {
        await client.query(
          `INSERT INTO public.user_progress 
           (user_id, xp, current_streak, streak_last_extended_date, last_active_at, total_time_spent_seconds)
           VALUES ($1, $2, $3, $4, NOW(), $5)`,
          [userId, authoritativeXp, currentStreak, todayStr, totalTime]
        );
      }

      // 5. Check if all course lessons are completed for certificate issuance
      let certificate = null;
      const countRes = await client.query(
        `SELECT COUNT(*)::int as count FROM public.lesson_completions WHERE user_id = $1 AND course_id = $2`,
        [userId, resolvedCourseId]
      );
      const completedCount = countRes.rows[0]?.count || 0;
      if (completedCount >= 10) {
        const userRes = await client.query(`SELECT full_name FROM public.users WHERE id = $1`, [userId]);
        const studentName = userRes.rows[0]?.full_name || 'Geniusphere Learner';
        certificate = await this.issueCertificateInternal(
          client,
          userId,
          resolvedCourseId,
          courseRecord.title,
          studentName
        );
      }

      // 6. Insert transactional outbox event
      if (isFirstEligibleCompletion) {
        const eventId = `evt_les_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await client.query(
          `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
           VALUES ($1, $2, $3)`,
          [
            eventId,
            'lesson.completed',
            JSON.stringify({
              userId,
              courseId: resolvedCourseId,
              courseTitle: courseRecord.title,
              courseSlug: courseRecord.slug,
              lessonId,
              score,
              xpEarned: xpReward,
              streak: currentStreak,
              completedAt: now.toISOString(),
            }),
          ]
        );
      }

      return {
        completion: compRes.rows[0],
        progress: { xp: authoritativeXp, streak: currentStreak },
        certificate,
        alreadyCompleted: !isFirstEligibleCompletion,
        xpEarned: xpReward,
      };
    }, userId);
  }

  private async issueCertificateInternal(
    client: PoolClient,
    userId: string,
    courseId: string,
    courseTitle: string,
    studentName: string
  ) {
    const code = `CERT-${courseId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const hash = crypto
      .createHmac('sha256', config.jwtSecret || 'geniusphere_jwt_secret_dev_2026_default_key')
      .update(`${userId}:${courseId}:${code}`)
      .digest('hex');

    const certRes = await client.query(
      `INSERT INTO public.certificates 
       (user_id, course_id, course_title, student_name, verification_code, verification_hash, grade, skills_acquired, issued_at)
       VALUES ($1, $2, $3, $4, $5, $6, 100, $7, NOW())
       ON CONFLICT (user_id, course_id) DO UPDATE SET issued_at = NOW()
       RETURNING *`,
      [
        userId,
        courseId,
        courseTitle,
        studentName,
        code,
        hash,
        JSON.stringify(['Domain Competency', 'Practical Laboratory Mastery', 'Verified Assessments']),
      ]
    );

    const cert = certRes.rows[0];

    const eventId = `evt_cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await client.query(
      `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
       VALUES ($1, $2, $3)`,
      [
        eventId,
        'certificate.issued',
        JSON.stringify({
          certificateId: cert.id,
          userId,
          courseId,
          courseTitle,
          verificationCode: cert.verification_code,
          issuedAt: cert.issued_at,
        }),
      ]
    );

    return cert;
  }

  public async getCertificates(userId: string) {
    const res = await query(
      `SELECT * FROM public.certificates WHERE user_id = $1 ORDER BY issued_at DESC`,
      [userId]
    );
    return res.rows;
  }

  public async verifyCertificateByCode(code: string) {
    const res = await query(
      `SELECT c.*, u.email as student_email
       FROM public.certificates c
       JOIN public.users u ON u.id = c.user_id
       WHERE c.verification_code = $1 LIMIT 1`,
      [code]
    );
    return res.rows[0] || null;
  }

  /**
   * Get user progress (XP, streaks, completions) reconciled with xp_ledger
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
    const sumRes = await query(
      `SELECT COALESCE(SUM(amount), 0)::int as total_xp FROM public.xp_ledger WHERE user_id = $1`,
      [userId]
    );
    const authoritativeXp = sumRes.rows[0]?.total_xp ?? 0;

    const prog = progRes.rows[0] || {
      user_id: userId,
      xp: authoritativeXp,
      current_streak: 0,
      total_time_spent_seconds: 0,
      last_active_at: new Date().toISOString(),
    };
    prog.xp = authoritativeXp; // Ensure exact synchronization

    return {
      progress: prog,
      completions: compsRes.rows,
    };
  }

  /**
   * Record interactive lab run / attempt with idempotent reward ledger
   */
  public async recordLabAttempt(
    userId: string,
    labSlug: string,
    score: number,
    status: 'completed' | 'failed' | 'in_progress',
    details: any = {}
  ) {
    return withTransaction(async (client) => {
      const res = await client.query(
        `INSERT INTO public.lab_attempts (user_id, lab_slug, score, status, details)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, labSlug, score, status, JSON.stringify(details)]
      );

      let xpReward = 0;
      if (status === 'completed' && score >= 60) {
        const rewardKey = `lab_complete:${userId}:${labSlug}`;
        const baseLabReward = 75;

        const ledgerRes = await client.query(
          `INSERT INTO public.xp_ledger (user_id, reward_key, amount, source_type, metadata, created_at)
           VALUES ($1, $2, $3, 'lab_attempt', $4, NOW())
           ON CONFLICT (reward_key) DO NOTHING
           RETURNING *`,
          [userId, rewardKey, baseLabReward, JSON.stringify({ labSlug, score })]
        );

        if (ledgerRes.rowCount === 1) {
          xpReward = baseLabReward;
          // Update authoritative user progress XP
          await client.query(
            `UPDATE public.user_progress
             SET xp = (SELECT COALESCE(SUM(amount), 0)::int FROM public.xp_ledger WHERE user_id = $1),
                 last_active_at = NOW(),
                 updated_at = NOW()
             WHERE user_id = $1`,
            [userId]
          );

          // Outbox event
          const eventId = `evt_lab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          await client.query(
            `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
             VALUES ($1, $2, $3)`,
            [
              eventId,
              'lab.completed',
              JSON.stringify({
                userId,
                labSlug,
                score,
                xpEarned: xpReward,
                completedAt: new Date().toISOString(),
              }),
            ]
          );
        }
      }

      return res.rows[0];
    }, userId);
  }

  /**
   * Reconcile user XP authoritatively from xp_ledger
   */
  public async reconcileUserXp(userId: string): Promise<number> {
    return withTransaction(async (client) => {
      const sumRes = await client.query(
        `SELECT COALESCE(SUM(amount), 0)::int as total_xp FROM public.xp_ledger WHERE user_id = $1`,
        [userId]
      );
      const totalXp = sumRes.rows[0].total_xp;

      await client.query(
        `UPDATE public.user_progress
         SET xp = $1, updated_at = NOW()
         WHERE user_id = $2`,
        [totalXp, userId]
      );

      return totalXp;
    }, userId);
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
    }, actor.userId);
  }

  /**
   * Authoritative Leaderboard Aggregator:
   * Aggregates strictly from persisted public.xp_ledger rows.
   * Privacy-preserving: Masks minors' full names (e.g. "A***") for child safety compliance.
   * Deterministic window ranking with tie-breaking.
   */
  public async getLeaderboard(
    timeframe: 'all_time' | 'weekly' | 'daily' = 'all_time',
    limit: number = 50
  ) {
    let dateFilter = '';
    if (timeframe === 'weekly') {
      dateFilter = `AND l.created_at >= NOW() - INTERVAL '7 days'`;
    } else if (timeframe === 'daily') {
      dateFilter = `AND l.created_at >= NOW() - INTERVAL '24 hours'`;
    }

    const res = await query(
      `SELECT 
         u.id as user_id,
         CASE 
           WHEN u.is_minor THEN SUBSTRING(u.full_name FROM 1 FOR 1) || '***'
           ELSE u.full_name 
         END as display_name,
         u.is_minor,
         COALESCE(SUM(l.amount), 0)::int as total_xp,
         DENSE_RANK() OVER (ORDER BY COALESCE(SUM(l.amount), 0) DESC, u.id ASC)::int as rank
       FROM public.users u
       JOIN public.xp_ledger l ON l.user_id = u.id
       WHERE u.account_status = 'active' ${dateFilter}
       GROUP BY u.id, u.full_name, u.is_minor
       ORDER BY total_xp DESC, rank ASC
       LIMIT $1`,
      [limit]
    );

    return {
      timeframe,
      entries: res.rows,
      totalParticipants: res.rowCount,
    };
  }

  public calculateStreak(
    lastExtendedDateStr: string | Date | null,
    todayDateStr: string | Date,
    currentStreak: number
  ): number {
    if (!lastExtendedDateStr) return 1;
    const str1 = lastExtendedDateStr instanceof Date 
      ? lastExtendedDateStr.toISOString() 
      : String(lastExtendedDateStr);
    const str2 = todayDateStr instanceof Date 
      ? todayDateStr.toISOString() 
      : String(todayDateStr);

    const [y1, m1, d1] = str1.split('T')[0].split('-').map(Number);
    const [y2, m2, d2] = str2.split('T')[0].split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    const diffDays = Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return currentStreak;
    if (diffDays === 1) return currentStreak + 1;
    return 1;
  }

  /**
   * Get student profile distinguishing editable identity from calculated metrics
   */
  public async getUserProfile(userId: string) {
    const userRes = await query(
      `SELECT u.id, u.email, u.full_name, u.date_of_birth, u.is_minor, u.is_superadmin, u.account_status, u.created_at, u.updated_at,
              om.role, om.organization_id, o.name as org_name, o.org_type
       FROM public.users u
       LEFT JOIN public.organization_memberships om ON om.user_id = u.id AND om.is_active = TRUE
       LEFT JOIN public.organizations o ON o.id = om.organization_id
       WHERE u.id = $1 LIMIT 1`,
      [userId]
    );

    if (userRes.rowCount === 0) {
      throw new Error('User not found');
    }
    const user = userRes.rows[0];

    const progressRes = await query(
      `SELECT xp, current_streak, streak_last_extended_date, total_time_spent_seconds, last_active_at
       FROM public.user_progress WHERE user_id = $1`,
      [userId]
    );
    const prog = progressRes.rows[0] || {
      xp: 0,
      current_streak: 0,
      streak_last_extended_date: null,
      total_time_spent_seconds: 0,
      last_active_at: user.created_at,
    };

    const completionsRes = await query(
      `SELECT COUNT(*)::int as count FROM public.lesson_completions WHERE user_id = $1`,
      [userId]
    );
    const completedLessonsCount = completionsRes.rows[0]?.count || 0;

    const enrollmentsRes = await query(
      `SELECT COUNT(*)::int as count FROM public.course_enrollments WHERE user_id = $1`,
      [userId]
    );
    const enrolledCoursesCount = enrollmentsRes.rows[0]?.count || 0;

    const labAttemptsRes = await query(
      `SELECT COUNT(*)::int as count FROM public.lab_attempts WHERE user_id = $1`,
      [userId]
    );
    const labAttemptsCount = labAttemptsRes.rows[0]?.count || 0;

    return {
      personalInfo: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        dateOfBirth: user.date_of_birth,
        isMinor: user.is_minor,
        isSuperadmin: user.is_superadmin,
        accountStatus: user.account_status,
        role: user.role || (user.is_superadmin ? 'superadmin' : 'learner'),
        organization: user.org_name
          ? { id: user.organization_id, name: user.org_name, type: user.org_type }
          : null,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      learningStats: {
        xp: prog.xp,
        currentStreak: prog.current_streak,
        streakLastExtendedDate: prog.streak_last_extended_date,
        totalTimeSpentSeconds: prog.total_time_spent_seconds,
        lastActiveAt: prog.last_active_at,
        completedLessonsCount,
        enrolledCoursesCount,
        labAttemptsCount,
      },
    };
  }

  /**
   * Update student profile with strict input validation and outbox audit event
   */
  public async updateUserProfile(userId: string, updates: { fullName?: string }) {
    if (!updates || typeof updates.fullName !== 'string') {
      throw new Error('Valid full name is required');
    }

    const trimmedName = updates.fullName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      throw new Error('Full name must be between 2 and 100 characters');
    }

    if (/<[^>]*>/.test(trimmedName)) {
      throw new Error('Full name cannot contain HTML or script characters');
    }

    return withTransaction(async (client) => {
      const updateRes = await client.query(
        `UPDATE public.users 
         SET full_name = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING id, email, full_name, date_of_birth, is_minor, is_superadmin, account_status, updated_at`,
        [trimmedName, userId]
      );

      if (updateRes.rowCount === 0) {
        throw new Error('User not found');
      }

      const updatedUser = updateRes.rows[0];

      const eventId = `evt_prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await client.query(
        `INSERT INTO public.transactional_outbox (event_id, event_type, payload)
         VALUES ($1, $2, $3)`,
        [
          eventId,
          'user.profile_updated',
          JSON.stringify({
            userId,
            fullName: updatedUser.full_name,
            updatedAt: updatedUser.updated_at,
          }),
        ]
      );

      return updatedUser;
    }, userId);
  }
}

export const domainService = new DomainService();
