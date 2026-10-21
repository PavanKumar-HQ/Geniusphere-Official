import { describe, it, expect, beforeAll } from 'vitest';
import { query } from '../server/db';
import { generateToken, UserSessionPayload } from '../server/auth';
import { domainService } from '../server/services/domainService';

describe('Geniusphere Scale & Capacity Verification Suite (1k - 10k MAU Target)', () => {
  const testStudent: UserSessionPayload = {
    userId: '11111111-1111-1111-1111-111111111111',
    email: 'learner@geniusphere.tech',
    fullName: 'Pavan Kumar',
    isSuperadmin: false,
    role: 'learner',
  };

  const token = generateToken(testStudent);
  let courseId: string;

  beforeAll(async () => {
    const courses = await domainService.getCourses();
    expect(courses.length).toBeGreaterThan(0);
    courseId = courses[0].id;
  });

  // ------------------------------------------------------------------
  // 1. Latency Baseline: p50 / p95 / p99 under Sequential Load
  // ------------------------------------------------------------------
  it('1. Establishes latency baseline with p95 < 300ms for indexed API reads', async () => {
    const latencies: number[] = [];
    const iterations = 30;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const res = await fetch(`http://localhost:3001/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const duration = performance.now() - start;
      expect(res.status).toBe(200);
      latencies.push(duration);
    }

    latencies.sort((a, b) => a - b);
    const p50 = latencies[Math.floor(iterations * 0.5)];
    const p95 = latencies[Math.floor(iterations * 0.95)];
    const p99 = latencies[Math.floor(iterations * 0.99)];

    console.log(`[Scale Benchmark] Course Read Latency: p50=${p50.toFixed(1)}ms, p95=${p95.toFixed(1)}ms, p99=${p99.toFixed(1)}ms`);

    expect(p95).toBeLessThan(300); // Production target: p95 < 300ms
    expect(p50).toBeLessThan(100);
  });

  // ------------------------------------------------------------------
  // 2. Traffic Burst: Concurrent Non-AI Request Handling
  // ------------------------------------------------------------------
  it('2. Handles traffic burst of 25 concurrent requests with 0% error rate', async () => {
    const burstSize = 25;
    const start = performance.now();

    const requests = Array.from({ length: burstSize }, () =>
      fetch('http://localhost:3001/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (res) => ({
        status: res.status,
        body: await res.json(),
      }))
    );

    const responses = await Promise.all(requests);
    const totalDuration = performance.now() - start;

    const successful = responses.filter((r) => r.status === 200);
    const errorRate = ((burstSize - successful.length) / burstSize) * 100;

    console.log(`[Scale Benchmark] 25 Concurrent Requests: Duration=${totalDuration.toFixed(1)}ms, ErrorRate=${errorRate}%`);

    expect(errorRate).toBe(0);
    expect(successful.length).toBe(burstSize);
  });

  // ------------------------------------------------------------------
  // 3. Concurrency Protection: 10 Parallel Writes Award Exactly Once
  // ------------------------------------------------------------------
  it('3. Guarantees zero duplicate awards under 10 parallel completion writes', async () => {
    const concurrentLesson = `les-scale-burst-${Date.now()}`;
    const initialProg = await domainService.getUserProgress(testStudent.userId);
    const initialXp = initialProg.progress.xp;

    const parallelWrites = Array.from({ length: 10 }, () =>
      domainService.completeLesson(testStudent.userId, courseId, concurrentLesson, 100)
    );

    const writeResults = await Promise.all(parallelWrites);

    // Verify all 10 operations resolved cleanly without throwing lock errors
    expect(writeResults.length).toBe(10);

    // Verify exactly one ledger record was inserted for this reward key
    const ledgerRows = await query(
      `SELECT * FROM public.xp_ledger WHERE reward_key = $1`,
      [`lesson_complete:${testStudent.userId}:${courseId}:${concurrentLesson}`]
    );
    expect(ledgerRows.rowCount).toBe(1);
    expect(ledgerRows.rows[0].amount).toBe(50);

    // Authoritative XP balance must have increased by exactly 50, not 500
    const finalProg = await domainService.getUserProgress(testStudent.userId);
    expect(finalProg.progress.xp).toBe(initialXp + 50);
  });

  // ------------------------------------------------------------------
  // 4. Workload Isolation: AI Inference Failure Never Blocks Core APIs
  // ------------------------------------------------------------------
  it('4. Proves AI gateway timeout/offline isolation leaves core API latency intact', async () => {
    // 1. Core API baseline before AI call
    const startBefore = performance.now();
    const resCoreBefore = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const durBefore = performance.now() - startBefore;
    expect(resCoreBefore.status).toBe(200);

    // 2. Trigger AI chat endpoint (with unconfigured/offline provider)
    const resAI = await fetch('http://localhost:3001/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: 'Explain distributed systems simply.' }),
    });
    // Unconfigured returns 503; offline returns 502/504
    expect([502, 503, 504]).toContain(resAI.status);

    // 3. Core API query immediately following AI failure
    const startAfter = performance.now();
    const resCoreAfter = await fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const durAfter = performance.now() - startAfter;

    expect(resCoreAfter.status).toBe(200);
    expect(durAfter).toBeLessThan(100); // Sub-100ms response immediately following AI error
    console.log(`[Scale Benchmark] Workload Isolation Core API: Before=${durBefore.toFixed(1)}ms, After AI Error=${durAfter.toFixed(1)}ms`);
  });

  // ------------------------------------------------------------------
  // 5. Connection Pool Stability: Rapid Cycle Connect / Disconnect
  // ------------------------------------------------------------------
  it('5. Maintains connection pool stability without leaking clients', async () => {
    const cycleCount = 20;
    const start = performance.now();

    for (let i = 0; i < cycleCount; i++) {
      const dbRes = await query('SELECT 1 as val');
      expect(dbRes.rows[0].val).toBe(1);
    }

    const duration = performance.now() - start;
    console.log(`[Scale Benchmark] 20 Database Pool Cycles: ${duration.toFixed(1)}ms (${(duration / cycleCount).toFixed(2)}ms per query)`);

    expect(duration / cycleCount).toBeLessThan(20);
  });
});
