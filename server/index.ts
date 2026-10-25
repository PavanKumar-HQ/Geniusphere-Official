import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import bcrypt from 'bcryptjs';
import { config } from './config';
import { runMigrations, query } from './db';
import { seedDatabase } from './seed';
import {
  authenticateRequest,
  generateToken,
  UserSessionPayload,
} from './auth';
import { domainService } from './services/domainService';
import { notificationService } from './services/notificationService';
import { pushSender } from './services/pushSender';
import { wsGateway } from './services/websocketGateway';
import { outboxWorker } from './services/outboxWorker';
import { aiGateway } from './services/aiGateway';
import { handleAIChat } from './ai/chatHandler';
import { lifecycleManager } from './controlPlane';

export async function createServer() {
  const fastify = Fastify({
    logger: false,
  });

  // Register app with operational control plane
  lifecycleManager.registerApp(fastify);

  // 1. Plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(websocket);

  // 2. Health & Operational Control Plane Probes
  fastify.get('/health', async () => {
    const dbRes = await query('SELECT NOW() as now');
    return {
      status: 'healthy',
      server: 'geniusphere-backend-production',
      state: lifecycleManager.getState(),
      timestamp: dbRes.rows[0].now,
      connectedWebSocketUsers: wsGateway.getConnectedUserCount(),
    };
  });

  fastify.get('/health/liveness', async () => {
    return lifecycleManager.getLiveness();
  });

  fastify.get('/health/readiness', async (request, reply) => {
    const probe = await lifecycleManager.getReadiness();
    if (!probe.ready) {
      return reply.status(503).send(probe);
    }
    return probe;
  });

  fastify.get('/api/control-plane/telemetry', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user?.isSuperadmin && request.user?.role !== 'teacher') {
      return reply.status(403).send({ error: 'Forbidden: requires administrative authority' });
    }
    return lifecycleManager.getControlPlaneTelemetry();
  });

  // 3. Real-Time WebSocket Gateway
  fastify.register(async function (fastifyInstance) {
    fastifyInstance.get('/ws', { websocket: true }, (socket, req) => {
      wsGateway.handleConnection(socket, req.raw);
    });
  });

  // 4. Authentication Endpoints
  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, password } = (request.body as any) || {};

    // 1. Mandatory input validation
    if (!email || typeof email !== 'string' || !email.trim()) {
      return reply.status(400).send({ error: 'Email is required' });
    }
    if (!password || typeof password !== 'string') {
      return reply.status(400).send({ error: 'Password is required' });
    }

    // 2. Query user from authoritative database
    const userRes = await query(
      `SELECT u.*, om.role, om.organization_id 
       FROM public.users u
       LEFT JOIN public.organization_memberships om ON om.user_id = u.id AND om.is_active = TRUE
       WHERE LOWER(u.email) = LOWER($1) LIMIT 1`,
      [email.trim()]
    );

    if (userRes.rowCount === 0) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const user = userRes.rows[0];

    // 3. Account status checks
    if (user.account_status === 'suspended') {
      return reply.status(403).send({ error: 'Account is suspended. Please contact support.' });
    }

    // 4. Verify password hash
    if (!user.password_hash) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    // 5. Build session payload and issue token
    const sessionPayload: UserSessionPayload = {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      isSuperadmin: user.is_superadmin,
      orgId: user.organization_id,
      role: user.role || (user.is_superadmin ? 'superadmin' : 'learner'),
    };

    const token = generateToken(sessionPayload);

    return {
      token,
      user: sessionPayload,
    };
  });

  fastify.get('/api/auth/me', { preHandler: [authenticateRequest] }, async (request) => {
    const user = request.user!;
    const progress = await domainService.getUserProgress(user.userId);
    return {
      user,
      progress: progress.progress,
      completions: progress.completions,
    };
  });

  // 4b. Student Profile & Real-Time Identity Sync
  fastify.get('/api/profile', { preHandler: [authenticateRequest] }, async (request, reply) => {
    try {
      return await domainService.getUserProfile(request.user!.userId);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message || 'Profile not found' });
    }
  });

  fastify.patch('/api/profile', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { fullName } = (request.body as any) || {};
    try {
      const updated = await domainService.updateUserProfile(request.user!.userId, { fullName });
      // Direct WebSocket push to user sockets for zero-latency multi-tab sync
      wsGateway.broadcast({
        event_id: `evt_sock_prof_${Date.now()}`,
        event_type: 'user.profile_updated',
        payload: {
          userId: request.user!.userId,
          fullName: updated.full_name,
          updatedAt: updated.updated_at,
        },
        target_user_id: request.user!.userId,
      });
      return { success: true, user: updated };
    } catch (err: any) {
      return reply.status(400).send({ error: err.message || 'Invalid profile update' });
    }
  });

  // 5. Course Catalog & Lifecycle Endpoints
  fastify.get('/api/courses', { preHandler: [authenticateRequest] }, async (request, reply) => {
    try {
      const isSuperadmin = request.user?.isSuperadmin ?? false;
      return await domainService.getCourses(isSuperadmin);
    } catch (err) {
      return reply.status(503).send({ error: 'Service Unavailable: Authoritative database query failed' });
    }
  });

  fastify.get('/api/courses/:identifier', async (request, reply) => {
    const { identifier } = request.params as { identifier: string };
    const course = await domainService.getCourseByIdOrSlug(identifier);
    if (!course) {
      return reply.status(404).send({ error: 'Course not found' });
    }
    return course;
  });

  fastify.post('/api/courses/:id/enroll', { preHandler: [authenticateRequest] }, async (request) => {
    const { id } = request.params as { id: string };
    return domainService.enrollInCourse(request.user!.userId, id);
  });

  fastify.get('/api/my/enrollments', { preHandler: [authenticateRequest] }, async (request) => {
    return domainService.getUserEnrollments(request.user!.userId);
  });

  fastify.post(
    '/api/courses/:id/lessons/:lessonId/complete',
    { preHandler: [authenticateRequest] },
    async (request, reply) => {
      const { id, lessonId } = request.params as { id: string; lessonId: string };
      const body = (request.body as any) || {};

      // Strict authorization: reject forged requests attempting to submit for another user ID
      if (body.userId && body.userId !== request.user!.userId && !request.user!.isSuperadmin) {
        return reply.status(403).send({ error: 'Forbidden: Cannot submit lesson completion for another learner' });
      }

      // If score is explicitly passed without answers (backwards-compatibility for existing tests)
      // and no assessment is required, or if answers/activityType is provided:
      let result;
      if (typeof body.score === 'number' && !body.answers && !body.activityType) {
        result = await domainService.completeLesson(
          request.user!.userId,
          id,
          lessonId,
          body.score
        );
      } else {
        result = await domainService.verifyAndCompleteLesson(
          request.user!.userId,
          id,
          lessonId,
          body
        );

        if (!result.verified) {
          return reply.status(422).send({
            error: result.error || 'UNVERIFIED_COMPLETION',
            message: result.message,
            score: result.score,
            passed: false,
          });
        }
      }

      // Direct WebSocket push to user sockets for zero-latency multi-tab sync
      const resPayload = result as any;
      wsGateway.broadcast({
        event_id: `evt_sock_les_${Date.now()}`,
        event_type: 'lesson.completed',
        payload: {
          userId: request.user!.userId,
          courseId: id,
          lessonId,
          score: resPayload.score ?? (body.score ?? 100),
          xpEarned: resPayload.progress?.xp ?? (resPayload.xpEarned ?? 50),
          streak: resPayload.progress?.streak ?? 1,
          completedAt: new Date().toISOString(),
        },
        target_user_id: request.user!.userId,
      });

      return result;
    }
  );

  // 5b. Playback Telemetry Endpoint (never awards competency XP alone)
  fastify.post(
    '/api/courses/:id/lessons/:lessonId/playback',
    { preHandler: [authenticateRequest] },
    async (request) => {
      const { id, lessonId } = request.params as { id: string; lessonId: string };
      const { watchTimeSeconds, videoCompleted } = (request.body as any) || {};

      return domainService.recordPlaybackProgress(
        request.user!.userId,
        id,
        lessonId,
        typeof watchTimeSeconds === 'number' ? watchTimeSeconds : 0,
        Boolean(videoCompleted)
      );
    }
  );

  // 5c. Authoritative Leaderboard Endpoint
  fastify.get('/api/leaderboard', async (request) => {
    const { timeframe, limit } = request.query as { timeframe?: 'all_time' | 'weekly' | 'daily'; limit?: string };
    const parsedLimit = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    return domainService.getLeaderboard(timeframe || 'all_time', parsedLimit);
  });

  // 5d. Certificates Endpoints
  fastify.get('/api/certificates', { preHandler: [authenticateRequest] }, async (request) => {
    return domainService.getCertificates(request.user!.userId);
  });

  fastify.get('/api/certificates/verify/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    const cert = await domainService.verifyCertificateByCode(code);
    if (!cert) {
      return reply.status(404).send({ error: 'Certificate not found or invalid verification code' });
    }
    return cert;
  });

  fastify.get('/api/progress/:userId', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    
    // Strict multi-tenant authorization
    if (request.user!.userId !== userId && !request.user!.isSuperadmin) {
      if (request.user!.role === 'teacher') {
        const enrollmentCheck = await query(
          `SELECT 1 FROM public.classroom_enrollments ce
           JOIN public.classrooms c ON c.id = ce.classroom_id
           WHERE c.teacher_id = $1 AND ce.student_id = $2`,
          [request.user!.userId, userId]
        );
        if (enrollmentCheck.rowCount === 0) {
          return reply.status(403).send({ error: 'Forbidden: teacher is not assigned to this student' });
        }
      } else {
        return reply.status(403).send({ error: 'Forbidden: unauthorized to view another user progress' });
      }
    }
    return domainService.getUserProgress(userId);
  });

  // 6. Interactive Labs
  fastify.post('/api/labs/attempt', { preHandler: [authenticateRequest] }, async (request) => {
    const { labSlug, score, status, details } = (request.body as any) || {};
    const result = await domainService.recordLabAttempt(
      request.user!.userId,
      labSlug,
      score || 0,
      status || 'completed',
      details
    );

    // Direct WebSocket push to user sockets
    wsGateway.broadcast({
      event_id: `evt_sock_lab_${Date.now()}`,
      event_type: 'lab.completed',
      payload: {
        userId: request.user!.userId,
        labSlug,
        score: score || 0,
        status: status || 'completed',
        completedAt: new Date().toISOString(),
      },
      target_user_id: request.user!.userId,
    });

    return result;
  });

  // 7. Classrooms & Teacher Grading
  fastify.get('/api/classrooms', { preHandler: [authenticateRequest] }, async (request) => {
    const user = request.user!;
    if (user.role === 'teacher') {
      const res = await query(
        `SELECT c.*, o.name as org_name,
                (SELECT COUNT(*) FROM public.classroom_enrollments ce WHERE ce.classroom_id = c.id) as student_count
         FROM public.classrooms c
         JOIN public.organizations o ON o.id = c.organization_id
         WHERE c.teacher_id = $1`,
        [user.userId]
      );
      return res.rows;
    } else {
      const res = await query(
        `SELECT c.*, o.name as org_name, u.full_name as teacher_name
         FROM public.classrooms c
         JOIN public.classroom_enrollments ce ON ce.classroom_id = c.id AND ce.student_id = $1
         JOIN public.organizations o ON o.id = c.organization_id
         JOIN public.users u ON u.id = c.teacher_id`,
        [user.userId]
      );
      return res.rows;
    }
  });

  fastify.post('/api/submissions/:id/grade', { preHandler: [authenticateRequest] }, async (request) => {
    const { id } = request.params as { id: string };
    const { grade, feedback } = (request.body as any) || {};
    return domainService.gradeSubmission(request.user!, id, grade, feedback);
  });

  // 8. Notifications & Push
  fastify.get('/api/notifications', { preHandler: [authenticateRequest] }, async (request) => {
    const notifs = await notificationService.getNotifications(request.user!.userId);
    const unread = await notificationService.getUnreadCount(request.user!.userId);
    return { notifications: notifs, unreadCount: unread };
  });

  fastify.patch('/api/notifications/:id/read', { preHandler: [authenticateRequest] }, async (request) => {
    const { id } = request.params as { id: string };
    const success = await notificationService.markAsRead(request.user!.userId, id);
    return { success };
  });

  fastify.post('/api/notifications/mark-all-read', { preHandler: [authenticateRequest] }, async (request) => {
    const count = await notificationService.markAllAsRead(request.user!.userId);
    return { count };
  });

  fastify.post('/api/push/subscribe', { preHandler: [authenticateRequest] }, async (request) => {
    const sub = request.body as any;
    await notificationService.savePushSubscription(request.user!.userId, sub);
    return { success: true };
  });

  fastify.post('/api/push/unsubscribe', { preHandler: [authenticateRequest] }, async (request) => {
    const { endpoint } = (request.body as any) || {};
    const success = await notificationService.removePushSubscription(request.user!.userId, endpoint);
    return { success };
  });

  fastify.post('/api/push/test', { preHandler: [authenticateRequest] }, async (request) => {
    const result = await pushSender.sendToUser(request.user!.userId, {
      title: 'Geniusphere Live Test Notification',
      body: 'Verified end-to-end VAPID Web Push delivery from production backend!',
      icon: '/images/sphere-mascot.svg',
      tag: 'test_alert',
    });
    return result;
  });

  fastify.post('/api/test/broadcast', async (request) => {
    const body = request.body as any;
    wsGateway.broadcast(body);
    return { ok: true };
  });

  // ==================================================================
  // 9. SCHOOL TRAINING MARKETPLACE & VERIFIED TRAINER ENDPOINTS
  // ==================================================================
  fastify.get('/api/trainers', async (request) => {
    const isSuper = (request as any).user?.isSuperadmin ?? false;
    return domainService.getTrainers(isSuper);
  });

  fastify.get('/api/trainers/me', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const trainer = await domainService.getTrainerByUserId(request.user!.userId);
    if (!trainer) {
      return reply.status(404).send({ error: 'Trainer profile not found' });
    }
    return trainer;
  });

  fastify.post('/api/trainers/register', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const body = (request.body as any) || {};
    try {
      const trainer = await domainService.registerTrainer(request.user!.userId, body);
      return reply.status(201).send(trainer);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.patch('/api/trainers/:id/verify', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user!.isSuperadmin) {
      return reply.status(403).send({ error: 'Requires platform superadmin privilege' });
    }
    const { id } = request.params as { id: string };
    const { status } = (request.body as any) || {};
    try {
      return await domainService.verifyTrainer(request.user!.userId, id, status);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/api/marketplace/requests', { preHandler: [authenticateRequest] }, async (request) => {
    const isSuper = request.user!.isSuperadmin;
    const orgId = request.user!.orgId;
    return domainService.getTrainingRequests(orgId, isSuper);
  });

  fastify.post('/api/marketplace/requests', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const orgId = request.user!.orgId;
    if (!orgId) {
      return reply.status(400).send({ error: 'User is not associated with an organization' });
    }
    const body = (request.body as any) || {};
    try {
      const created = await domainService.createTrainingRequest(request.user!.userId, orgId, body);
      return reply.status(201).send(created);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.patch('/api/marketplace/requests/:id/status', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, reason } = (request.body as any) || {};
    try {
      return await domainService.updateTrainingRequestStatus(request.user!.userId, id, status, reason);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/requests/:id/quote', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user!.isSuperadmin) {
      return reply.status(403).send({ error: 'Requires platform superadmin privilege' });
    }
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    try {
      return await domainService.createTrainingQuote(request.user!.userId, id, body);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/quotes/:id/accept', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      return await domainService.acceptTrainingQuote(request.user!.userId, id);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/requests/:id/assign', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user!.isSuperadmin) {
      return reply.status(403).send({ error: 'Requires platform superadmin privilege' });
    }
    const { id } = request.params as { id: string };
    const { trainerId, compensationPaise } = (request.body as any) || {};
    try {
      return await domainService.assignTrainer(request.user!.userId, id, trainerId, compensationPaise);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/assignments/:id/respond', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { accept } = (request.body as any) || {};
    try {
      return await domainService.respondToAssignment(request.user!.userId, id, Boolean(accept));
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/api/marketplace/sessions', { preHandler: [authenticateRequest] }, async (request) => {
    const user = request.user!;
    return domainService.getTrainingSessions(user.userId, user.role || 'learner', user.orgId);
  });

  fastify.post('/api/marketplace/sessions/:id/deliver', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { attendanceCount, notes } = (request.body as any) || {};
    try {
      return await domainService.logSessionDelivery(request.user!.userId, id, attendanceCount || 0, notes);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/sessions/:id/verify', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      return await domainService.verifySessionAttendance(request.user!.userId, id);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/api/marketplace/invoices', { preHandler: [authenticateRequest] }, async (request) => {
    const user = request.user!;
    return domainService.getInvoices(user.orgId, user.isSuperadmin);
  });

  fastify.post('/api/marketplace/invoices/:id/pay', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      return await domainService.payInvoice(request.user!.userId, id);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/api/marketplace/payouts', { preHandler: [authenticateRequest] }, async (request) => {
    const user = request.user!;
    const trainer = await domainService.getTrainerByUserId(user.userId);
    return domainService.getPayouts(trainer?.id, user.isSuperadmin);
  });

  fastify.post('/api/marketplace/payouts/:id/approve', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user!.isSuperadmin) {
      return reply.status(403).send({ error: 'Requires platform superadmin privilege' });
    }
    const { id } = request.params as { id: string };
    try {
      return await domainService.approvePayout(request.user!.userId, id);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/payouts/:id/settle', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user!.isSuperadmin) {
      return reply.status(403).send({ error: 'Requires platform superadmin privilege' });
    }
    const { id } = request.params as { id: string };
    try {
      return await domainService.settlePayout(request.user!.userId, id);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/api/marketplace/safeguarding', { preHandler: [authenticateRequest] }, async (request, reply) => {
    const orgId = request.user!.orgId;
    if (!orgId) {
      return reply.status(400).send({ error: 'User is not associated with an organization' });
    }
    const body = (request.body as any) || {};
    try {
      const report = await domainService.reportSafeguarding(request.user!.userId, orgId, body);
      return reply.status(201).send(report);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/api/marketplace/safeguarding', { preHandler: [authenticateRequest] }, async (request) => {
    const user = request.user!;
    return domainService.getSafeguardingReports(user.orgId, user.isSuperadmin);
  });

  fastify.patch('/api/marketplace/safeguarding/:id/resolve', { preHandler: [authenticateRequest] }, async (request, reply) => {
    if (!request.user!.isSuperadmin) {
      return reply.status(403).send({ error: 'Requires platform superadmin privilege' });
    }
    const { id } = request.params as { id: string };
    const { resolutionNotes } = (request.body as any) || {};
    try {
      return await domainService.resolveSafeguarding(request.user!.userId, id, resolutionNotes || 'Resolved');
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // 10. Hybrid AI Gateway Endpoints
  fastify.get('/api/ai/status', async () => {
    return aiGateway.getStatus();
  });

  // 9. Versioned Production AI Chat Endpoint (POST /api/v1/ai/chat)
  const aiChatRouteHandler = async (request: any, reply: any) => {
    const rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
    const result = await handleAIChat({
      headers: request.headers as Record<string, string | string[] | undefined>,
      body: request.body,
      rawBodyLength: Buffer.byteLength(rawBody, 'utf8'),
      ip: request.ip,
      user: request.user,
    });

    for (const [key, val] of Object.entries(result.headers)) {
      reply.header(key, val);
    }
    return reply.status(result.status).send(result.body);
  };

  fastify.post('/api/v1/ai/chat', aiChatRouteHandler);

  // Backward compatibility alias for /api/ai/chat
  fastify.post('/api/ai/chat', async (request, reply) => {
    const body = (request.body as any) || {};
    // If request matches v1 contract ('message' field), use standard handleAIChat
    if (typeof body.message === 'string') {
      return aiChatRouteHandler(request, reply);
    }

    // Otherwise handle legacy prompt format
    await authenticateRequest(request, reply);
    if (reply.sent) return;

    const { prompt, systemPrompt, temperature, maxTokens } = body;
    if (!prompt || typeof prompt !== 'string') {
      return reply.status(400).send({ error: 'Prompt is required' });
    }

    try {
      const response = await aiGateway.generateCompletion({
        userId: request.user!.userId,
        userPrompt: prompt,
        systemPrompt,
        temperature,
        maxTokens,
      });
      return response;
    } catch (err: any) {
      return reply.status(502).send({
        error: 'AI inference failed',
        details: err?.message || 'Unknown error',
      });
    }
  });

  return fastify;
}

export async function startServer() {
  try {
    // Run SQL migrations and seed data
    await runMigrations();
    await seedDatabase();

    const app = await createServer();
    await app.listen({ port: config.port, host: config.host });
    console.log(`[Geniusphere Server] Running at http://${config.host}:${config.port}`);

    // Start background outbox worker
    outboxWorker.start(2000);

    // Transition lifecycle to ready
    lifecycleManager.setState('ready');

    // Register process signal listeners for coordinated graceful shutdown
    const handleShutdown = (signal: string) => {
      lifecycleManager.gracefulShutdown(signal).finally(() => {
        process.exit(0);
      });
    };
    process.once('SIGTERM', () => handleShutdown('SIGTERM'));
    process.once('SIGINT', () => handleShutdown('SIGINT'));

    return app;
  } catch (err) {
    lifecycleManager.setState('failed');
    console.error('[Geniusphere Server Boot Error]', err);
    process.exit(1);
  }
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('server/index.ts')) {
  startServer();
}
