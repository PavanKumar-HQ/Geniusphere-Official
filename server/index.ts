import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
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

export async function createServer() {
  const fastify = Fastify({
    logger: false,
  });

  // 1. Plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(websocket);

  // 2. Health Endpoint
  fastify.get('/health', async () => {
    const dbRes = await query('SELECT NOW() as now');
    return {
      status: 'healthy',
      server: 'geniusphere-backend-production',
      timestamp: dbRes.rows[0].now,
      connectedWebSocketUsers: wsGateway.getConnectedUserCount(),
    };
  });

  // 3. Real-Time WebSocket Gateway
  fastify.register(async function (fastifyInstance) {
    fastifyInstance.get('/ws', { websocket: true }, (socket, req) => {
      wsGateway.handleConnection(socket, req.raw);
    });
  });

  // 4. Authentication Endpoints
  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, userId } = (request.body as any) || {};
    const identifier = email || userId;
    if (!identifier) {
      return reply.status(400).send({ error: 'Email or userId is required' });
    }

    const userRes = await query(
      `SELECT u.*, om.role, om.organization_id 
       FROM public.users u
       LEFT JOIN public.organization_memberships om ON om.user_id = u.id AND om.is_active = TRUE
       WHERE u.email = $1 OR u.id::text = $1 LIMIT 1`,
      [identifier]
    );

    if (userRes.rowCount === 0) {
      return reply.status(404).send({ error: 'User not found in system' });
    }

    const user = userRes.rows[0];
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
    async (request) => {
      const { id, lessonId } = request.params as { id: string; lessonId: string };
      const { score } = (request.body as any) || {};
      return domainService.completeLesson(
        request.user!.userId,
        id,
        lessonId,
        typeof score === 'number' ? score : 100
      );
    }
  );

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
    return domainService.recordLabAttempt(
      request.user!.userId,
      labSlug,
      score || 0,
      status || 'completed',
      details
    );
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

    return app;
  } catch (err) {
    console.error('[Geniusphere Server Boot Error]', err);
    process.exit(1);
  }
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('server/index.ts')) {
  startServer();
}
