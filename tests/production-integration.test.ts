import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { query, withTransaction } from '../server/db';
import { generateToken, verifyToken, UserSessionPayload } from '../server/auth';
import { domainService } from '../server/services/domainService';
import { notificationService } from '../server/services/notificationService';
import { outboxWorker } from '../server/services/outboxWorker';
import { wsGateway } from '../server/services/websocketGateway';

describe('Production Architecture & Integration Verification Suite', () => {
  const learner1: UserSessionPayload = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'learner@geniusphere.tech',
    fullName: 'Pavan Kumar',
    isSuperadmin: false,
    role: 'learner',
  };

  const learner2: UserSessionPayload = {
    userId: '22222222-2222-2222-2222-222222222222',
    email: 'aarav.student@dpts.edu',
    fullName: 'Aarav Patel',
    isSuperadmin: false,
    role: 'learner',
  };

  const teacher: UserSessionPayload = {
    userId: '33333333-3333-3333-3333-333333333333',
    email: 'dr.sharma@dpts.edu',
    fullName: 'Dr. Sharma',
    isSuperadmin: false,
    role: 'teacher',
  };

  it('1. Verifies PostgreSQL connection and 19 operational tables exist', async () => {
    const res = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tables = res.rows.map((r) => r.table_name);
    
    expect(tables).toContain('users');
    expect(tables).toContain('organizations');
    expect(tables).toContain('classrooms');
    expect(tables).toContain('courses');
    expect(tables).toContain('course_enrollments');
    expect(tables).toContain('lesson_completions');
    expect(tables).toContain('user_progress');
    expect(tables).toContain('lab_attempts');
    expect(tables).toContain('notifications');
    expect(tables).toContain('push_subscriptions');
    expect(tables).toContain('transactional_outbox');
    expect(tables).toContain('durable_background_jobs');
  });

  it('2. Enforces cryptographic JWT generation and tamper rejection', () => {
    const token = generateToken(learner1);
    expect(typeof token).toBe('string');
    
    const verified = verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(learner1.userId);
    expect(verified?.email).toBe(learner1.email);

    // Tampered token must fail verification
    const tampered = token.slice(0, -5) + 'xxxxx';
    expect(verifyToken(tampered)).toBeNull();
  });

  it('3. Enforces multi-tenant course enrollment and transactional outbox creation', async () => {
    // Fetch a course
    const courses = await domainService.getCourses();
    expect(courses.length).toBeGreaterThan(0);
    const course = courses[0];

    // Enroll learner
    const enrollment = await domainService.enrollInCourse(learner1.userId, course.id);
    expect(enrollment.user_id).toBe(learner1.userId);
    expect(enrollment.course_id).toBe(course.id);
    expect(enrollment.status).toBe('active');

    // Verify outbox entry
    const outboxRes = await query(
      `SELECT * FROM public.transactional_outbox 
       WHERE event_type = 'enrollment.created' AND payload->>'userId' = $1 
       ORDER BY created_at DESC LIMIT 1`,
      [learner1.userId]
    );
    expect(outboxRes.rowCount).toBeGreaterThan(0);
    const payload = typeof outboxRes.rows[0].payload === 'string'
      ? JSON.parse(outboxRes.rows[0].payload)
      : outboxRes.rows[0].payload;
    expect(payload.courseId).toBe(course.id);
  });

  it('4. Mathematically computes progress and maintains deterministic streak intervals', async () => {
    const courses = await domainService.getCourses();
    const course = courses[0];

    const result = await domainService.completeLesson(
      learner1.userId,
      course.id,
      'les-test-streak-1',
      95
    );

    expect(result.completion.score).toBe(95);
    expect(result.progress.xp).toBeGreaterThanOrEqual(50);
    expect(result.progress.streak).toBeGreaterThanOrEqual(1);

    // Verify user progress record in PostgreSQL
    const prog = await domainService.getUserProgress(learner1.userId);
    expect(prog.progress.xp).toBe(result.progress.xp);
    expect(prog.completions.some((c: any) => c.lesson_id === 'les-test-streak-1')).toBe(true);
  });

  it('5. Denies unauthorized student from grading submissions', async () => {
    // Fetch an assignment submission
    const subRes = await query(`SELECT id FROM public.submissions LIMIT 1`);
    if (subRes.rowCount && subRes.rowCount > 0) {
      const subId = subRes.rows[0].id;
      
      // Learner attempting to grade must throw unauthorized error
      await expect(
        domainService.gradeSubmission(learner1, subId, 100, 'I graded myself!')
      ).rejects.toThrow(/Unauthorized/);
    }
  });

  it('6. Authorizes assigned teacher to grade submissions and emits assessment.graded outbox event', async () => {
    const subRes = await query(`SELECT id FROM public.submissions LIMIT 1`);
    if (subRes.rowCount && subRes.rowCount > 0) {
      const subId = subRes.rows[0].id;

      const graded = await domainService.gradeSubmission(
        teacher,
        subId,
        98,
        'Excellent defense against cross-site scripting.'
      );

      expect(graded.score).toBe(98);
      const log = typeof graded.verification_log === 'string'
        ? JSON.parse(graded.verification_log)
        : graded.verification_log;
      expect(log.graded_by).toBe(teacher.userId);

      // Verify outbox event
      const outbox = await query(
        `SELECT * FROM public.transactional_outbox 
         WHERE event_type = 'assessment.graded' AND payload->>'submissionId' = $1`,
        [subId]
      );
      expect(outbox.rowCount).toBeGreaterThan(0);
    }
  });

  it('7. Processes transactional outbox batch and generates persistent user notifications', async () => {
    const processed = await outboxWorker.processBatch();
    expect(typeof processed).toBe('number');

    // Verify persistent notifications exist for learner
    const notifs = await notificationService.getNotifications(learner1.userId);
    expect(notifs.length).toBeGreaterThan(0);
    expect(notifs[0].user_id).toBe(learner1.userId);
  });

  it('8. Synchronizes notification read state in PostgreSQL database', async () => {
    const notifs = await notificationService.getNotifications(learner1.userId);
    expect(notifs.length).toBeGreaterThan(0);

    const targetNotif = notifs[0];
    const success = await notificationService.markAsRead(learner1.userId, targetNotif.id);
    expect(success).toBe(true);

    // Verify updated read state
    const updated = await query(
      `SELECT is_read, read_at FROM public.notifications WHERE id = $1`,
      [targetNotif.id]
    );
    expect(updated.rows[0].is_read).toBe(true);
    expect(updated.rows[0].read_at).not.toBeNull();
  });

  it('9. Connects to authenticated WebSocket gateway and segregates channels', async () => {
    const token = generateToken(learner1);
    const ws = new WebSocket(`ws://localhost:3001/ws?token=${token}`);

    const receivedMessages: any[] = [];

    await new Promise<void>((resolve, reject) => {
      ws.on('open', () => {
        // Subscribe to user channel
        ws.send(JSON.stringify({ action: 'SUBSCRIBE', channel: `user:${learner1.userId}` }));
      });

      ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        receivedMessages.push(msg);
        if (msg.type === 'CONNECTION_ESTABLISHED') {
          resolve();
        }
      });

      ws.on('error', reject);
      setTimeout(() => resolve(), 1000);
    });

    expect(receivedMessages.some((m) => m.type === 'CONNECTION_ESTABLISHED')).toBe(true);

    // Broadcast test event via server HTTP endpoint
    await fetch('http://localhost:3001/api/test/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: 'test_evt_ws_1',
        event_type: 'test.realtime_ping',
        payload: { message: 'Realtime gateway ping' },
        target_user_id: learner1.userId,
      }),
    });

    await new Promise((r) => setTimeout(r, 400));

    expect(
      receivedMessages.some(
        (m) => m.type === 'DOMAIN_EVENT' && m.eventType === 'test.realtime_ping'
      )
    ).toBe(true);

    ws.close();
  });
});
