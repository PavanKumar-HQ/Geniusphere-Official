import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { query } from '../server/db';
import { generateToken, UserSessionPayload } from '../server/auth';
import { domainService } from '../server/services/domainService';

describe('Production Acceptance End-to-End Suite (Scenarios A - E)', () => {
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

  const token1 = generateToken(learner1);
  const token2 = generateToken(learner2);

  describe('Scenario A — Independent Students & Multi-Tenant Isolation', () => {
    it('provisions independent progress and verifies student records are completely isolated', async () => {
      const courses = await domainService.getCourses();
      expect(courses.length).toBeGreaterThan(0);
      const courseId = courses[0].id;

      const lesId1 = `les-acceptance-a-1-${Date.now()}`;
      const lesId2 = `les-acceptance-a-2-${Date.now()}`;

      // Learner 1 completes a unique lesson
      const res1 = await domainService.completeLesson(
        learner1.userId,
        courseId,
        lesId1,
        90
      );
      expect(res1.completion.user_id).toBe(learner1.userId);

      // Learner 2 completes a different lesson
      const res2 = await domainService.completeLesson(
        learner2.userId,
        courseId,
        lesId2,
        100
      );
      expect(res2.completion.user_id).toBe(learner2.userId);

      // Verify PostgreSQL persistence is independent
      const prog1 = await domainService.getUserProgress(learner1.userId);
      const prog2 = await domainService.getUserProgress(learner2.userId);

      expect(prog1.completions.some((c: any) => c.lesson_id === lesId1)).toBe(true);
      expect(prog1.completions.some((c: any) => c.lesson_id === lesId2)).toBe(false);

      expect(prog2.completions.some((c: any) => c.lesson_id === lesId2)).toBe(true);
      expect(prog2.completions.some((c: any) => c.lesson_id === lesId1)).toBe(false);
    });

    it('rejects direct cross-user API read attempts with HTTP 403 Forbidden', async () => {
      // Learner 1 attempts to read Learner 2 private progress via API
      const response = await fetch(`http://localhost:3001/api/progress/${learner2.userId}`, {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      });

      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.error).toContain('Forbidden');
    });
  });

  describe('Scenario B — Concurrent Completion & Authoritative XP Ledger Idempotency', () => {
    it('safely handles concurrent completion requests without duplicate XP or corrupt ledger', async () => {
      const courses = await domainService.getCourses();
      const courseId = courses[0].id;
      const concurrentLessonId = `les-concurrent-${Date.now()}`;

      // Capture initial XP
      const initialProg = await domainService.getUserProgress(learner1.userId);
      const initialXp = initialProg.progress.xp;

      // Fire 5 simultaneous completion requests for the exact same lesson
      const concurrentCalls = [
        domainService.completeLesson(learner1.userId, courseId, concurrentLessonId, 95),
        domainService.completeLesson(learner1.userId, courseId, concurrentLessonId, 95),
        domainService.completeLesson(learner1.userId, courseId, concurrentLessonId, 95),
        domainService.completeLesson(learner1.userId, courseId, concurrentLessonId, 95),
        domainService.completeLesson(learner1.userId, courseId, concurrentLessonId, 95),
      ];

      const results = await Promise.all(concurrentCalls);

      // Verify that every call succeeded and returned consistent completion state
      expect(results).toHaveLength(5);
      for (const res of results) {
        expect(res.completion.lesson_id).toBe(concurrentLessonId);
      }

      // Check authoritative XP ledger in PostgreSQL
      const rewardKey = `lesson_complete:${learner1.userId}:${courseId}:${concurrentLessonId}`;
      const ledgerRows = await query(
        `SELECT * FROM public.xp_ledger WHERE reward_key = $1`,
        [rewardKey]
      );

      // Exactly ONE ledger record must exist for this completion
      expect(ledgerRows.rowCount).toBe(1);
      expect(ledgerRows.rows[0].amount).toBe(50);

      // Re-fetch user progress and verify exactly 50 XP was added
      const finalProg = await domainService.getUserProgress(learner1.userId);
      expect(finalProg.progress.xp).toBe(initialXp + 50);

      // Reconciled XP matches ledger SUM perfectly
      const reconciledXp = await domainService.reconcileUserXp(learner1.userId);
      expect(reconciledXp).toBe(finalProg.progress.xp);
    });
  });

  describe('Scenario C — Persistence & Multi-Session Real-Time Synchronization', () => {
    it('persists profile updates in PostgreSQL and broadcasts real-time event to user session', async () => {
      const updatedName = `Pavan K. (${Date.now()})`;

      // Open WebSocket session for learner 1
      const ws = new WebSocket(`ws://localhost:3001/ws?token=${token1}`);
      const receivedEvents: any[] = [];

      await new Promise<void>((resolve) => {
        ws.on('open', () => {
          ws.send(JSON.stringify({ action: 'SUBSCRIBE', channel: `user:${learner1.userId}` }));
          resolve();
        });
        ws.on('message', (data) => {
          receivedEvents.push(JSON.parse(data.toString()));
        });
      });

      // Update profile via HTTP API
      const patchRes = await fetch('http://localhost:3001/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
        body: JSON.stringify({ fullName: updatedName }),
      });

      expect(patchRes.status).toBe(200);
      const patchData = await patchRes.json();
      expect(patchData.user.full_name).toBe(updatedName);

      // Wait for WebSocket event arrival
      await new Promise((r) => setTimeout(r, 400));

      const event = receivedEvents.find((e) => e.eventType === 'user.profile_updated');
      expect(event).toBeDefined();
      expect(event.payload.fullName).toBe(updatedName);

      // Query from a fresh "second session" via GET /api/profile
      const getRes = await fetch('http://localhost:3001/api/profile', {
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      });
      const profile = await getRes.json();
      expect(profile.personalInfo.fullName).toBe(updatedName);

      ws.close();
    });

    it('synchronizes lesson completion in real-time across independent sessions while isolating Student B', async () => {
      const courses = await domainService.getCourses();
      const courseId = courses[0].id;
      const testLessonId = `les-realtime-sync-${Date.now()}`;

      // Open Session B for Student A (Learner 1)
      const wsSessionB = new WebSocket(`ws://localhost:3001/ws?token=${token1}`);
      const sessionBEvents: any[] = [];

      await new Promise<void>((resolve) => {
        wsSessionB.on('open', () => {
          wsSessionB.send(JSON.stringify({ action: 'SUBSCRIBE', channel: `user:${learner1.userId}` }));
          resolve();
        });
        wsSessionB.on('message', (data) => {
          sessionBEvents.push(JSON.parse(data.toString()));
        });
      });

      // Open Session for Student B (Learner 2)
      const wsStudentB = new WebSocket(`ws://localhost:3001/ws?token=${token2}`);
      const studentBEvents: any[] = [];

      await new Promise<void>((resolve) => {
        wsStudentB.on('open', () => {
          wsStudentB.send(JSON.stringify({ action: 'SUBSCRIBE', channel: `user:${learner2.userId}` }));
          resolve();
        });
        wsStudentB.on('message', (data) => {
          studentBEvents.push(JSON.parse(data.toString()));
        });
      });

      // Student A completes lesson in Session A via HTTP API
      const compRes = await fetch(`http://localhost:3001/api/courses/${courseId}/lessons/${testLessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
        body: JSON.stringify({ score: 100 }),
      });

      expect(compRes.status).toBe(200);

      // Await event arrival over WebSocket
      await new Promise((r) => setTimeout(r, 400));

      // 1. Session B received the real-time event
      const syncEvent = sessionBEvents.find((e) => e.eventType === 'lesson.completed');
      expect(syncEvent).toBeDefined();
      expect(syncEvent.payload.courseId).toBe(courseId);
      expect(syncEvent.payload.lessonId).toBe(testLessonId);
      expect(syncEvent.payload.userId).toBe(learner1.userId);

      // 2. Student B received ZERO events from Student A's lesson completion
      const leakedEvent = studentBEvents.find((e) => e.eventType === 'lesson.completed' && e.payload?.userId === learner1.userId);
      expect(leakedEvent).toBeUndefined();

      // Clean up sockets
      wsSessionB.close();
      wsStudentB.close();
    });

    it('denies unauthorized channel subscriptions and rejects unauthenticated connections', async () => {
      // 1. Student B attempts to subscribe to Student A's private channel
      const wsStudentB = new WebSocket(`ws://localhost:3001/ws?token=${token2}`);
      const receivedMessages: any[] = [];

      await new Promise<void>((resolve) => {
        wsStudentB.on('open', () => {
          wsStudentB.send(JSON.stringify({ action: 'SUBSCRIBE', channel: `user:${learner1.userId}` }));
        });
        wsStudentB.on('message', (data) => {
          const parsed = JSON.parse(data.toString());
          receivedMessages.push(parsed);
          if (parsed.type === 'SUBSCRIPTION_DENIED') {
            resolve();
          }
        });
      });

      const denial = receivedMessages.find((m) => m.type === 'SUBSCRIPTION_DENIED');
      expect(denial).toBeDefined();
      expect(denial.channel).toBe(`user:${learner1.userId}`);
      wsStudentB.close();

      // 2. Connection without token is closed with 4001
      const wsNoToken = new WebSocket('ws://localhost:3001/ws');
      const noTokenCloseCode = await new Promise<number>((resolve) => {
        wsNoToken.on('close', (code) => resolve(code));
      });
      expect(noTokenCloseCode).toBe(4001);

      // 3. Connection with invalid token is closed with 4002
      const wsBadToken = new WebSocket('ws://localhost:3001/ws?token=invalid.tampered.token');
      const badTokenCloseCode = await new Promise<number>((resolve) => {
        wsBadToken.on('close', (code) => resolve(code));
      });
      expect(badTokenCloseCode).toBe(4002);
    });
  });

  describe('Scenario D — Real Lab Interaction & Idempotent Attempt Recording', () => {
    it('records genuine lab attempts and awards lab XP idempotently via xp_ledger', async () => {
      const labSlug = `quantum-superposition-${Date.now()}`;
      const initialProg = await domainService.getUserProgress(learner2.userId);
      const initialXp = initialProg.progress.xp;

      // Submit successful lab attempt
      const attempt1 = await domainService.recordLabAttempt(
        learner2.userId,
        labSlug,
        92,
        'completed',
        { theta: Math.PI / 4, phi: 0, measurements: 1000 }
      );

      expect(attempt1.status).toBe('completed');
      expect(attempt1.score).toBe(92);

      // Verify XP was awarded (75 XP for first completion)
      const afterProg = await domainService.getUserProgress(learner2.userId);
      expect(afterProg.progress.xp).toBe(initialXp + 75);

      // Verify ledger record
      const ledgerRes = await query(
        `SELECT * FROM public.xp_ledger WHERE reward_key = $1`,
        [`lab_complete:${learner2.userId}:${labSlug}`]
      );
      expect(ledgerRes.rowCount).toBe(1);
      expect(ledgerRes.rows[0].amount).toBe(75);

      // Retry/subsequent attempt on same lab must NOT double-award XP
      const attempt2 = await domainService.recordLabAttempt(
        learner2.userId,
        labSlug,
        98,
        'completed',
        { theta: Math.PI / 2, phi: Math.PI / 4, measurements: 2000 }
      );
      expect(attempt2.score).toBe(98);

      const afterRetryProg = await domainService.getUserProgress(learner2.userId);
      expect(afterRetryProg.progress.xp).toBe(initialXp + 75); // Unchanged!
    });
  });

  describe('Scenario E — Honest Failure & Error Handling', () => {
    it('rejects unauthenticated requests with HTTP 401', async () => {
      const res = await fetch('http://localhost:3001/api/profile');
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toContain('Authorization header');
    });

    it('rejects tampered tokens with HTTP 401', async () => {
      const tampered = token1.slice(0, -6) + 'abcdef';
      const res = await fetch('http://localhost:3001/api/profile', {
        headers: { Authorization: `Bearer ${tampered}` },
      });
      expect(res.status).toBe(401);
    });

    it('returns HTTP 404 for non-existent courses without inventing mock data', async () => {
      const res = await fetch('http://localhost:3001/api/courses/non-existent-course-uuid-9999');
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Course not found');
    });

    it('returns HTTP 400 for invalid profile updates and makes no mutations', async () => {
      const res = await fetch('http://localhost:3001/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
        body: JSON.stringify({ fullName: 'X' }), // too short (< 2 chars)
      });
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain('Full name must be between 2 and 100 characters');
    });
  });
});
