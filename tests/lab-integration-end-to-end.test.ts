import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { query } from '../server/db';
import { generateToken, UserSessionPayload } from '../server/auth';
import { domainService } from '../server/services/domainService';

describe('Lab Integration & Multi-User End-to-End Verification Suite', () => {
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

  it('persists practical lab attempts directly in PostgreSQL database', async () => {
    const labSlug = `ai-neural-perceptron-${Date.now()}`;
    const initialProg = await domainService.getUserProgress(learner1.userId);
    const initialXp = initialProg.progress.xp;

    const res = await fetch('http://localhost:3001/api/labs/attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        labSlug,
        score: 95,
        status: 'completed',
        details: { passedCriteria: 5, totalCriteria: 5 },
      }),
    });

    expect(res.status).toBe(200);
    const attempt = await res.json();
    expect(attempt.lab_slug).toBe(labSlug);
    expect(attempt.score).toBe(95);
    expect(attempt.status).toBe('completed');

    // Verify row in PostgreSQL public.lab_attempts
    const dbAttempt = await query(
      `SELECT * FROM public.lab_attempts WHERE user_id = $1 AND lab_slug = $2`,
      [learner1.userId, labSlug]
    );
    expect(dbAttempt.rowCount).toBe(1);
    expect(dbAttempt.rows[0].score).toBe(95);

    // Verify row in public.xp_ledger (75 XP for practical lab)
    const ledgerRow = await query(
      `SELECT * FROM public.xp_ledger WHERE reward_key = $1`,
      [`lab_complete:${learner1.userId}:${labSlug}`]
    );
    expect(ledgerRow.rowCount).toBe(1);
    expect(ledgerRow.rows[0].amount).toBe(75);

    // Verify user progress XP was authoritatively incremented by 75
    const finalProg = await domainService.getUserProgress(learner1.userId);
    expect(finalProg.progress.xp).toBe(initialXp + 75);
  });

  it('enforces idempotency on replayed labs: zero duplicate XP awarded', async () => {
    const labSlug = `blockchain-pow-consensus-${Date.now()}`;

    // First attempt completes lab with 100%
    const res1 = await fetch('http://localhost:3001/api/labs/attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        labSlug,
        score: 100,
        status: 'completed',
      }),
    });
    expect(res1.status).toBe(200);

    const progAfterFirst = await domainService.getUserProgress(learner1.userId);
    const xpAfterFirst = progAfterFirst.progress.xp;

    // Student replays the lab immediately
    const res2 = await fetch('http://localhost:3001/api/labs/attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        labSlug,
        score: 100,
        status: 'completed',
      }),
    });
    expect(res2.status).toBe(200);

    // Verify no duplicate XP ledger entry was created
    const ledgerCount = await query(
      `SELECT COUNT(*)::int as count FROM public.xp_ledger WHERE reward_key = $1`,
      [`lab_complete:${learner1.userId}:${labSlug}`]
    );
    expect(ledgerCount.rows[0].count).toBe(1);

    // Verify total XP remained unchanged after replay
    const progAfterReplay = await domainService.getUserProgress(learner1.userId);
    expect(progAfterReplay.progress.xp).toBe(xpAfterFirst);
  });

  it('broadcasts lab completion in real-time to student second session while isolating student B', async () => {
    const labSlug = `iot-firmware-defense-${Date.now()}`;

    // Open WebSocket for Student A (Session B)
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

    // Open WebSocket for Student B
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

    // Student A completes lab
    const res = await fetch('http://localhost:3001/api/labs/attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        labSlug,
        score: 100,
        status: 'completed',
      }),
    });
    expect(res.status).toBe(200);

    // Wait for WebSocket event
    await new Promise((r) => setTimeout(r, 400));

    // 1. Session B received lab.completed
    const labEvent = sessionBEvents.find(
      (e) => e.eventType === 'lab.completed' && e.payload?.labSlug === labSlug
    );
    expect(labEvent).toBeDefined();
    expect(labEvent.payload.labSlug).toBe(labSlug);
    expect(labEvent.payload.userId).toBe(learner1.userId);

    // 2. Student B received zero events from Student A
    const leakedEvent = studentBEvents.find((e) => e.eventType === 'lab.completed' && e.payload?.userId === learner1.userId);
    expect(leakedEvent).toBeUndefined();

    wsSessionB.close();
    wsStudentB.close();
  });

  it('rejects unauthenticated lab attempt submission with HTTP 401', async () => {
    const res = await fetch('http://localhost:3001/api/labs/attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        labSlug: 'unauthenticated-lab',
        score: 100,
        status: 'completed',
      }),
    });
    expect(res.status).toBe(401);
  });
});
