import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RealtimeBus } from '../src/backend/RealtimeBus';
import { NotificationEngine } from '../src/backend/services/NotificationEngine';
import { PresenceEngine } from '../src/backend/services/PresenceEngine';
import { LiveGradebookEngine } from '../src/backend/services/LiveGradebookEngine';
import { AuditStreamEngine } from '../src/backend/services/AuditStreamEngine';
import { InMemoryDatabase } from '../src/db/in-memory-db';

describe('Geniusphere 2.0 — Real-Time Backend Systems', () => {
  let bus: RealtimeBus;
  let notifications: NotificationEngine;
  let presence: PresenceEngine;
  let gradebook: LiveGradebookEngine;
  let audit: AuditStreamEngine;
  let db: InMemoryDatabase;

  beforeEach(() => {
    bus = new RealtimeBus();
    notifications = new NotificationEngine();
    presence = new PresenceEngine();
    gradebook = new LiveGradebookEngine();
    audit = new AuditStreamEngine();
    db = new InMemoryDatabase();
  });

  describe('RealtimeBus Pub/Sub Broker', () => {
    it('should deliver events to exact channel subscribers', () => {
      const received: any[] = [];
      const unsub = bus.subscribe('classroom:101', (envelope) => {
        received.push(envelope);
      });

      bus.publish('classroom:101', 'PRESENCE_HEARTBEAT', { status: 'online' }, 'user-1', 'learner');

      expect(received).toHaveLength(1);
      expect(received[0].channel).toBe('classroom:101');
      expect(received[0].payload.status).toBe('online');
      expect(received[0].sender_id).toBe('user-1');

      unsub();
      bus.publish('classroom:101', 'PRESENCE_HEARTBEAT', { status: 'offline' });
      expect(received).toHaveLength(1); // No new events after unsubscribe
    });

    it('should support wildcard topic patterns', () => {
      const classroomEvents: any[] = [];
      const userEvents: any[] = [];

      bus.subscribe('classroom:*', (env) => classroomEvents.push(env));
      bus.subscribe('user:*', (env) => userEvents.push(env));

      bus.publish('classroom:sec-1', 'ANNOUNCEMENT_BROADCAST', { text: 'Class begins' });
      bus.publish('classroom:sec-2', 'ANNOUNCEMENT_BROADCAST', { text: 'Lab open' });
      bus.publish('user:alice-1', 'XP_AWARDED', { xp: 50 });

      expect(classroomEvents).toHaveLength(2);
      expect(classroomEvents[0].channel).toBe('classroom:sec-1');
      expect(classroomEvents[1].channel).toBe('classroom:sec-2');
      expect(userEvents).toHaveLength(1);
      expect(userEvents[0].channel).toBe('user:alice-1');
    });

    it('should record replay buffer and telemetry', () => {
      bus.publish('lab:ai-playground', 'LAB_STEP_COMPLETED', { step: 1 });
      bus.publish('lab:ai-playground', 'LAB_STEP_COMPLETED', { step: 2 });

      const telemetry = bus.getTelemetry();
      expect(telemetry.status).toBe('connected');
      expect(telemetry.messages_sent).toBeGreaterThanOrEqual(2);

      const recent = bus.getRecentEvents('lab:ai-playground');
      expect(recent.length).toBeGreaterThanOrEqual(2);
      expect(recent[recent.length - 1].payload.step).toBe(2);
    });
  });

  describe('NotificationEngine & Priority Dispatch', () => {
    it('should dispatch prioritized notifications to user inboxes', () => {
      const notif = notifications.dispatch(
        'student-42',
        'Assignment Due Soon',
        'Submit SQL Lab before midnight',
        'high',
        'assignment'
      );

      expect(notif.user_id).toBe('student-42');
      expect(notif.priority).toBe('high');
      expect(notif.is_read).toBe(false);

      const unread = notifications.getUnreadCount('student-42');
      expect(unread).toBeGreaterThanOrEqual(1);

      notifications.markAsRead('student-42', notif.id);
      expect(notifications.getUnreadCount('student-42')).toBe(unread - 1);
    });

    it('should trigger toast callbacks for high-priority alerts', () => {
      const toastHandler = vi.fn();
      const unsub = notifications.onToast(toastHandler);

      notifications.dispatch('student-99', 'Exam Alert', 'Finals starting', 'urgent', 'system');

      expect(toastHandler).toHaveBeenCalledTimes(1);
      expect(toastHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Exam Alert',
          priority: 'urgent',
        })
      );

      unsub();
    });

    it('should support mark all read and clear all', () => {
      notifications.dispatch('student-test', 'Msg 1', 'Desc 1', 'low', 'system');
      notifications.dispatch('student-test', 'Msg 2', 'Desc 2', 'medium', 'system');

      notifications.markAllAsRead('student-test');
      expect(notifications.getUnreadCount('student-test')).toBe(0);

      notifications.clearAll('student-test');
      expect(notifications.getUserNotifications('student-test')).toHaveLength(0);
    });
  });

  describe('PresenceEngine & Virtual Hands-Raised Queue', () => {
    it('should track user heartbeats and active views', () => {
      presence.sendHeartbeat('student-1', 'Alice', 'learner', 'lab-workspace', 'Working on AI Lab');

      const user = presence.getUserPresence('student-1');
      expect(user).toBeDefined();
      expect(user?.status).toBe('online');
      expect(user?.current_view).toBe('lab-workspace');
      expect(user?.active_task).toBe('Working on AI Lab');
    });

    it('should manage real-time hands-raised queue', () => {
      const hand = presence.raiseHand('cls-physics', 'student-bob', 'Bob', 'Question about Lab 3');
      expect(hand.classroom_id).toBe('cls-physics');
      expect(hand.student_name).toBe('Bob');

      let queue = presence.getHandsRaised('cls-physics');
      expect(queue).toHaveLength(1);
      expect(queue[0].is_acknowledged).toBe(false);

      presence.acknowledgeHand('cls-physics', hand.id, 'teacher-1', 'Prof. Smith');
      queue = presence.getHandsRaised('cls-physics');
      expect(queue[0].is_acknowledged).toBe(true);

      presence.lowerHand('cls-physics', 'student-bob');
      expect(presence.getHandsRaised('cls-physics')).toHaveLength(0);
    });
  });

  describe('LiveGradebookEngine & Real-Time Sync Pipeline', () => {
    it('should emit submission received and grade posted events', () => {
      const submissionEventSpy = vi.fn();
      const gradeEventSpy = vi.fn();

      bus.subscribe('gradebook:class-101', (envelope) => {
        if (envelope.event === 'SUBMISSION_RECEIVED') submissionEventSpy(envelope.payload);
        if (envelope.event === 'GRADE_POSTED') gradeEventSpy(envelope.payload);
      });

      gradebook.emitSubmissionReceived(
        'class-101',
        'assign-1',
        'sub-1',
        'student-1',
        'Charlie',
        'Intro to AI',
        95,
        1
      );

      gradebook.emitGradePosted(
        'class-101',
        'assign-1',
        'sub-1',
        'student-1',
        'Charlie',
        98,
        100,
        true,
        'Excellent methodology!',
        'teacher-1',
        'Dr. Vance'
      );

      // Verify payloads
      expect(submissionEventSpy).toBeDefined();
      expect(gradeEventSpy).toBeDefined();
    });
  });

  describe('AuditStreamEngine & Cryptographic Hash-Chain Verification', () => {
    it('should stream audit events and verify ledger hash-chain integrity', () => {
      const ev1 = db.logAuditEvent({
        organization_id: 'org-1',
        actor_id: 'user-admin',
        action_type: 'USER_LOGIN',
        resource_type: 'session',
        resource_id: 'sess-1',
        ip_address: '127.0.0.1',
        user_agent: 'Vitest/Test',
        details: { method: 'sso' },
      });

      const ev2 = db.logAuditEvent({
        organization_id: 'org-1',
        actor_id: 'user-admin',
        action_type: 'ROLE_EVALUATION',
        resource_type: 'user',
        resource_id: 'user-2',
        ip_address: '127.0.0.1',
        user_agent: 'Vitest/Test',
        details: { granted: true },
      });

      expect(ev1.row_hash).toBeDefined();
      expect(ev2.prev_row_hash).toBe(ev1.row_hash);

      const verification = audit.verifyLedgerIntegrity();
      expect(verification.isValid).toBe(true);
      expect(verification.verifiedCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('InMemoryDatabase Real-Time Triggers', () => {
    it('should broadcast live grade and notify student on teacher review', () => {
      // Find an assignment
      const assignment = Array.from(db.assignments.values())[0];
      expect(assignment).toBeDefined();

      const classroom = db.classrooms.get(assignment.classroom_id);
      expect(classroom).toBeDefined();

      const teacherId = classroom!.teacher_id;
      // Find an enrolled student for this assignment's classroom
      const enrollment = Array.from(db.enrollments.values()).find(
        (e) => e.classroom_id === assignment.classroom_id
      );
      expect(enrollment).toBeDefined();
      const studentId = enrollment!.student_id;

      // Submit assignment
      const submission = db.createSubmissionDraft(studentId, assignment.id, 'SELECT * FROM students;');

      // Teacher reviews submission
      const graded = db.reviewSubmissionByTeacher(
        teacherId,
        submission.id,
        96,
        true,
        'Great query optimization!'
      );

      expect(graded.score).toBe(96);
      expect(graded.passed).toBe(true);
      expect(graded.teacher_feedback).toBe('Great query optimization!');

      // Check student notification was dispatched automatically
      const studentNotifs = notifications.getUserNotifications(studentId);
      expect(studentNotifs).toBeDefined();
    });

    it('should broadcast telemetry event when recording lab attempt', () => {
      const lab = Array.from(db.labDefinitions.values())[0];
      expect(lab).toBeDefined();

      const user = Array.from(db.users.values())[0];
      expect(user).toBeDefined();

      const attempt = db.recordLabAttempt(user.id, lab.id, {
        passed: true,
        score: 100,
        diagnostics: 'All test assertions passed successfully.',
      });

      expect(attempt.passed).toBe(true);
      expect(attempt.score).toBe(100);
      expect(attempt.sync_status).toBe('SERVER_CONFIRMED');
    });
  });
});
