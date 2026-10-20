import WebSocket from 'ws';

const BASE_URL = 'http://localhost:3001';
const WS_URL = 'ws://localhost:3001/ws';

async function main() {
  console.log('[Sync Test] 1. Logging in as Pavan (Session A)...');
  const resA = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'learner@geniusphere.tech', password: 'TestPass123!' }),
  });
  const dataA = await resA.json();
  const tokenA = dataA.token;
  const userId = dataA.user.userId;

  console.log('[Sync Test] 2. Logging in as Pavan (Session B - Independent Session)...');
  const resB = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'learner@geniusphere.tech', password: 'TestPass123!' }),
  });
  const dataB = await resB.json();
  const tokenB = dataB.token;

  console.log('[Sync Test] 3. Logging in as Aarav (Session C - Cross-student tenant)...');
  const resC = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav.student@dpts.edu', password: 'TestPass123!' }),
  });
  const dataC = await resC.json();
  const tokenC = dataC.token;

  // Connect WebSocket for Session B
  console.log('[Sync Test] 4. Opening WebSocket connection for Session B...');
  const wsB = new WebSocket(`${WS_URL}?token=${tokenB}`);
  const sessionBEvents: any[] = [];

  await new Promise<void>((resolve, reject) => {
    wsB.on('open', () => {
      console.log('[Sync Test] Session B WebSocket connected.');
      resolve();
    });
    wsB.on('error', reject);
  });

  wsB.on('message', (msg) => {
    const parsed = JSON.parse(msg.toString());
    sessionBEvents.push(parsed);
  });

  // Connect WebSocket for Session C (Aarav)
  console.log('[Sync Test] 5. Opening WebSocket connection for Session C (Aarav)...');
  const wsC = new WebSocket(`${WS_URL}?token=${tokenC}`);
  const sessionCEvents: any[] = [];
  await new Promise<void>((resolve, reject) => {
    wsC.on('open', () => resolve());
    wsC.on('error', reject);
  });
  wsC.on('message', (msg) => {
    sessionCEvents.push(JSON.parse(msg.toString()));
  });

  // Fetch initial profile for Session A
  const initProf = await fetch(`${BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  }).then((r) => r.json());
  console.log('[Sync Test] Session A Initial Stats:', {
    xp: initProf.learningStats.xp,
    streak: initProf.learningStats.currentStreak,
    completions: initProf.learningStats.completedLessonsCount,
  });

  // Session A completes a real lesson: course "cybersecurity-defensive-web", lesson "les-sync-test-1"
  console.log('[Sync Test] 6. Session A completes a qualifying learning activity...');
  const courses = await fetch(`${BASE_URL}/api/courses`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  }).then((r) => r.json());
  const courseId = courses[0].id;
  const lessonId = `les_sync_${Date.now()}`;

  const completeRes = await fetch(`${BASE_URL}/api/courses/${courseId}/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score: 100 }),
  });

  const completeData = await completeRes.json();
  console.log('[Sync Test] Session A Completion Committed to DB:', completeData);

  // Wait 2.5 seconds for outbox worker to poll and dispatch WebSocket event to Session B
  console.log('[Sync Test] 7. Waiting for Outbox Worker dispatch to Session B...');
  await new Promise((r) => setTimeout(r, 2600));

  // Check Session B events
  const lessonEventB = sessionBEvents.find(
    (e) => e.eventType === 'lesson.completed' || e.type === 'DOMAIN_EVENT' && e.payload?.lessonId === lessonId
  );

  console.log('[Sync Test] 8. Session B Received Real-Time Domain Event:', lessonEventB ? 'YES (VERIFIED)' : 'NO');
  if (lessonEventB) {
    console.log('[Sync Test] Event Payload Delivered to Session B:', {
      userId: lessonEventB.payload?.userId,
      lessonId: lessonEventB.payload?.lessonId,
      xpEarned: lessonEventB.payload?.xpEarned,
      streak: lessonEventB.payload?.streak,
    });
  }

  // Verify Session C (Aarav) did NOT receive Pavan's private lesson event
  const aaravLeaked = sessionCEvents.some(
    (e) => e.payload?.userId === userId && e.eventType === 'lesson.completed'
  );
  console.log('[Sync Test] 9. Tenant Isolation: Aarav did NOT receive Pavan private data:', !aaravLeaked ? 'PASSED (VERIFIED)' : 'FAILED (LEAK)');

  // Session B fetches refreshed profile
  const refreshedProfB = await fetch(`${BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  }).then((r) => r.json());
  console.log('[Sync Test] 10. Session B Refreshed Profile from DB:', {
    xp: refreshedProfB.learningStats.xp,
    streak: refreshedProfB.learningStats.currentStreak,
    completions: refreshedProfB.learningStats.completedLessonsCount,
  });

  const xpIncreased = refreshedProfB.learningStats.xp > initProf.learningStats.xp;
  console.log('[Sync Test] 11. Authoritative XP Incremented Across Sessions:', xpIncreased ? 'PASSED' : 'FAILED');

  wsB.close();
  wsC.close();

  if (!lessonEventB || aaravLeaked || !xpIncreased) {
    process.exit(1);
  } else {
    console.log('[Sync Test] ALL CROSS-SESSION SYNCHRONIZATION CHECKS PASSED.');
  }
}

main().catch((err) => {
  console.error('[Sync Test Error]', err);
  process.exit(1);
});
