// ====================================================================
// Geniusphere 2.0 — Real-Time Presence & Collaboration Engine
// Real-time heartbeats, live activity status, virtual hands-raised queue
// ====================================================================

import { HandRaisedItem, UserPresence } from '../types';
import { realtimeBus } from '../RealtimeBus';

const HEARTBEAT_TIMEOUT_MS = 30000; // 30s before marked away
const OFFLINE_TIMEOUT_MS = 90000; // 90s before marked offline

export class PresenceEngine {
  private activeUsers: Map<string, UserPresence> = new Map(); // key = userId
  private handsRaised: Map<string, HandRaisedItem[]> = new Map(); // key = classroomId
  private heartbeatInterval: any = null;

  constructor() {
    this.initRealtimeListeners();
    this.startHeartbeatMonitor();
  }

  private initRealtimeListeners(): void {
    // Listen for incoming presence updates
    realtimeBus.subscribe('classroom:*', (envelope) => {
      const classroomId = envelope.channel.replace('classroom:', '');

      if (envelope.event === 'PRESENCE_HEARTBEAT' && envelope.payload) {
        const presence = envelope.payload as UserPresence;
        this.activeUsers.set(presence.user_id, presence);
      } else if (envelope.event === 'HAND_RAISED' && envelope.payload) {
        const item = envelope.payload as HandRaisedItem;
        this.addHandRaisedItem(classroomId, item);
      } else if (envelope.event === 'HAND_LOWERED' && envelope.payload) {
        const { student_id } = envelope.payload;
        this.removeHandRaisedItem(classroomId, student_id);
      } else if (envelope.event === 'HAND_ACKNOWLEDGED' && envelope.payload) {
        const { hand_id } = envelope.payload;
        this.markHandAcknowledged(classroomId, hand_id);
      }
    });
  }

  private startHeartbeatMonitor(): void {
    if (typeof window !== 'undefined') {
      this.heartbeatInterval = setInterval(() => {
        const now = Date.now();
        for (const user of this.activeUsers.values()) {
          const lastTime = new Date(user.last_heartbeat).getTime();
          const elapsed = now - lastTime;
          if (elapsed > OFFLINE_TIMEOUT_MS) {
            user.status = 'offline';
          } else if (elapsed > HEARTBEAT_TIMEOUT_MS) {
            user.status = 'away';
          } else {
            user.status = 'online';
          }
        }
      }, 10000);
    }
  }

  /**
   * Sends heartbeat from the active user
   */
  public sendHeartbeat(
    userId: string,
    userName: string,
    role: string,
    currentView: string,
    activeTask?: string,
    classroomId?: string
  ): void {
    const existing = this.activeUsers.get(userId);
    const presence: UserPresence = {
      user_id: userId,
      user_name: userName,
      role,
      status: 'online',
      current_view: currentView,
      active_task: activeTask,
      last_heartbeat: new Date().toISOString(),
      is_hand_raised: existing ? existing.is_hand_raised : false,
      hand_raised_topic: existing ? existing.hand_raised_topic : undefined,
      hand_raised_at: existing ? existing.hand_raised_at : undefined,
    };

    this.activeUsers.set(userId, presence);

    // Broadcast on classroom channel if associated with a class
    const targetChannel = classroomId ? `classroom:${classroomId}` : 'system:broadcast';
    realtimeBus.publish(targetChannel, 'PRESENCE_HEARTBEAT', presence, userId, role, userName);
  }

  /**
   * Student raises hand in classroom
   */
  public raiseHand(
    classroomId: string,
    studentId: string,
    studentName: string,
    topic: string
  ): HandRaisedItem {
    const handItem: HandRaisedItem = {
      id: `hand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      classroom_id: classroomId,
      student_id: studentId,
      student_name: studentName,
      topic: topic || 'Question about lesson activity',
      raised_at: new Date().toISOString(),
      is_acknowledged: false,
    };

    this.addHandRaisedItem(classroomId, handItem);

    // Update user presence flag
    const user = this.activeUsers.get(studentId);
    if (user) {
      user.is_hand_raised = true;
      user.hand_raised_topic = topic;
      user.hand_raised_at = handItem.raised_at;
    }

    realtimeBus.publish(
      `classroom:${classroomId}`,
      'HAND_RAISED',
      handItem,
      studentId,
      'learner',
      studentName
    );

    return handItem;
  }

  /**
   * Student lowers hand in classroom
   */
  public lowerHand(classroomId: string, studentId: string): void {
    this.removeHandRaisedItem(classroomId, studentId);

    const user = this.activeUsers.get(studentId);
    if (user) {
      user.is_hand_raised = false;
      user.hand_raised_topic = undefined;
      user.hand_raised_at = undefined;
    }

    realtimeBus.publish(
      `classroom:${classroomId}`,
      'HAND_LOWERED',
      { student_id: studentId },
      studentId,
      'learner'
    );
  }

  /**
   * Teacher acknowledges hand request
   */
  public acknowledgeHand(classroomId: string, handId: string, teacherId: string, teacherName: string): void {
    this.markHandAcknowledged(classroomId, handId);

    realtimeBus.publish(
      `classroom:${classroomId}`,
      'HAND_ACKNOWLEDGED',
      { hand_id: handId },
      teacherId,
      'teacher',
      teacherName
    );
  }

  private addHandRaisedItem(classroomId: string, item: HandRaisedItem): void {
    const list = this.handsRaised.get(classroomId) || [];
    if (!list.some((h) => h.student_id === item.student_id)) {
      list.push(item);
      this.handsRaised.set(classroomId, list);
    }
  }

  private removeHandRaisedItem(classroomId: string, studentId: string): void {
    const list = this.handsRaised.get(classroomId) || [];
    this.handsRaised.set(
      classroomId,
      list.filter((h) => h.student_id !== studentId)
    );
  }

  private markHandAcknowledged(classroomId: string, handId: string): void {
    const list = this.handsRaised.get(classroomId) || [];
    const target = list.find((h) => h.id === handId);
    if (target) {
      target.is_acknowledged = true;
    }
  }

  /**
   * Returns list of raised hands in a classroom
   */
  public getHandsRaised(classroomId: string): HandRaisedItem[] {
    return this.handsRaised.get(classroomId) || [];
  }

  /**
   * Returns online presence list for a specific group of user IDs
   */
  public getPresenceList(userIds?: string[]): UserPresence[] {
    const all = Array.from(this.activeUsers.values());
    if (!userIds) return all;
    return all.filter((u) => userIds.includes(u.user_id));
  }

  /**
   * Returns presence of a specific user
   */
  public getUserPresence(userId: string): UserPresence | undefined {
    return this.activeUsers.get(userId);
  }

  public destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.activeUsers.clear();
    this.handsRaised.clear();
  }
}

export const presenceEngine = new PresenceEngine();
