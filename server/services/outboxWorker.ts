import { query, withTransaction } from '../db';
import { wsGateway } from './websocketGateway';
import { notificationService } from './notificationService';
import { pushSender } from './pushSender';

export class OutboxWorker {
  private timer: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;

  public start(intervalMs: number = 2000): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.processBatch().catch((err) => {
        console.error('[OutboxWorker Error]', err);
      });
    }, intervalMs);
    console.log('[OutboxWorker] Started background processing loop');
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[OutboxWorker] Stopped');
    }
  }

  public async processBatch(): Promise<number> {
    if (this.isProcessing) return 0;
    this.isProcessing = true;

    try {
      let processedCount = 0;

      await withTransaction(async (client) => {
        // 1. Claim up to 20 pending events with row-level locks
        const res = await client.query(
          `SELECT * FROM public.transactional_outbox 
           WHERE status = 'pending' 
           ORDER BY created_at ASC 
           LIMIT 20 
           FOR UPDATE SKIP LOCKED`
        );

        if (res.rowCount === 0) return;

        for (const event of res.rows) {
          const payload = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload;

          try {
            // 2. Dispatch real-time WebSocket event
            const targetUser = payload.userId || payload.studentId;
            wsGateway.broadcast({
              event_id: event.event_id,
              event_type: event.event_type,
              payload,
              target_user_id: targetUser,
            });

            // 3. Deliver persistent notification & Web Push
            if (event.event_type === 'lesson.completed' && payload.userId) {
              await notificationService.createNotification(payload.userId, {
                type: 'course',
                title: 'Lesson Completed',
                message: `You completed a lesson in ${payload.courseTitle || 'your course'} (+${payload.xpEarned} XP, Streak: ${payload.streak} days)!`,
                dedupKey: `notif_les_${payload.courseId}_${payload.lessonId}`,
                actionView: 'course-detail',
                actionSlug: payload.courseSlug,
              });

              await pushSender.sendToUser(payload.userId, {
                title: 'Geniusphere Streak Maintained',
                body: `Lesson complete! +${payload.xpEarned} XP earned. Your streak is now ${payload.streak} days.`,
                icon: '/images/sphere-mascot.svg',
                tag: `les_${payload.lessonId}`,
                data: { view: 'course-detail', slug: payload.courseSlug },
              });
            } else if (event.event_type === 'assessment.graded' && payload.studentId) {
              await notificationService.createNotification(payload.studentId, {
                type: 'assessment',
                title: 'Assessment Graded',
                message: `Your teacher graded your submission: ${payload.grade}/100. Feedback: "${payload.feedback || 'Great work'}"`,
                dedupKey: `notif_grade_${payload.submissionId}`,
                actionView: 'student-dashboard',
              });

              await pushSender.sendToUser(payload.studentId, {
                title: 'Assignment Graded',
                body: `You received ${payload.grade}/100 on your assignment!`,
                icon: '/images/sphere-mascot.svg',
                tag: `grade_${payload.submissionId}`,
                data: { view: 'student-dashboard' },
              });
            } else if (event.event_type === 'enrollment.created' && payload.userId) {
              await notificationService.createNotification(payload.userId, {
                type: 'course',
                title: 'Enrolled Successfully',
                message: `You are now enrolled in "${payload.courseTitle}". Happy learning!`,
                dedupKey: `notif_enroll_${payload.courseId}`,
                actionView: 'course-detail',
                actionSlug: payload.courseSlug,
              });
            }

            // 4. Mark published
            await client.query(
              `UPDATE public.transactional_outbox 
               SET status = 'published', processed_at = NOW() 
               WHERE id = $1`,
              [event.id]
            );
            processedCount++;
          } catch (itemErr: any) {
            console.error(`[OutboxWorker] Failed event ${event.event_id}:`, itemErr);
            const newRetry = event.retry_count + 1;
            const newStatus = newRetry >= 5 ? 'failed' : 'pending';
            await client.query(
              `UPDATE public.transactional_outbox 
               SET retry_count = $1, status = $2, last_error = $3 
               WHERE id = $4`,
              [newRetry, newStatus, itemErr?.message || 'Unknown error', event.id]
            );
          }
        }
      });

      return processedCount;
    } finally {
      this.isProcessing = false;
    }
  }
}

export const outboxWorker = new OutboxWorker();
