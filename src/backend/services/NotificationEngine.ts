// ====================================================================
// Geniusphere 2.0 — Real-Time Notification Engine
// Multi-channel dispatch, priority sorting, persistent user inboxes
// ====================================================================

import { AppNotification, NotificationCategory, NotificationPriority } from '../types';
import { realtimeBus } from '../RealtimeBus';

const NOTIFICATIONS_STORAGE_PREFIX = 'geniusphere_notifications_';

export class NotificationEngine {
  private notifications: Map<string, AppNotification[]> = new Map(); // key = userId
  private toastSubscribers: Set<(notification: AppNotification) => void> = new Set();

  constructor() {
    this.initRealtimeListener();
  }

  private initRealtimeListener(): void {
    // Listen for notification events broadcast on user channels
    realtimeBus.subscribe('user:*', (envelope) => {
      if (envelope.event === 'NOTIFICATION_DISPATCHED' && envelope.payload) {
        const notif = envelope.payload as AppNotification;
        this.storeNotificationInMemory(notif);
        // Alert toast subscribers if high or urgent priority
        if (notif.priority === 'high' || notif.priority === 'urgent' || notif.priority === 'medium') {
          for (const sub of this.toastSubscribers) {
            try {
              sub(notif);
            } catch (err) {
              console.error('[NotificationEngine] Toast subscriber error:', err);
            }
          }
        }
      }
    });
  }

  /**
   * Registers a callback for real-time floating toast alerts
   */
  public onToast(callback: (notification: AppNotification) => void): () => void {
    this.toastSubscribers.add(callback);
    return () => this.toastSubscribers.delete(callback);
  }

  /**
   * Dispatches a notification to a specific user and broadcasts it in real-time
   */
  public dispatch(
    userId: string,
    title: string,
    message: string,
    priority: NotificationPriority = 'medium',
    category: NotificationCategory = 'system',
    actionView?: string,
    actionSlug?: string,
    actionLabel?: string,
    metadata?: Record<string, any>
  ): AppNotification {
    const notification: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      user_id: userId,
      title,
      message,
      priority,
      category,
      is_read: false,
      action_view: actionView,
      action_slug: actionSlug,
      action_label: actionLabel,
      created_at: new Date().toISOString(),
      metadata,
    };

    // Store in memory & persist
    this.storeNotificationInMemory(notification);
    this.persistUserNotifications(userId);

    // Broadcast across realtime bus to the user's dedicated channel
    realtimeBus.publish(
      `user:${userId}`,
      'NOTIFICATION_DISPATCHED',
      notification,
      'notification_engine',
      'system'
    );

    return notification;
  }

  /**
   * Dispatches a broadcast notification to multiple users (e.g. all students in a classroom)
   */
  public dispatchBatch(
    userIds: string[],
    title: string,
    message: string,
    priority: NotificationPriority = 'medium',
    category: NotificationCategory = 'system',
    actionView?: string
  ): void {
    for (const uid of userIds) {
      this.dispatch(uid, title, message, priority, category, actionView);
    }
  }

  private storeNotificationInMemory(notif: AppNotification): void {
    const list = this.notifications.get(notif.user_id) || [];
    // Prevent duplicate entries by id
    if (!list.some((n) => n.id === notif.id)) {
      list.unshift(notif); // new on top
      this.notifications.set(notif.user_id, list.slice(0, 50)); // keep max 50
    }
  }

  /**
   * Retrieves all notifications for a specific user, hydrating from storage if needed
   */
  public getUserNotifications(userId: string): AppNotification[] {
    if (!this.notifications.has(userId)) {
      this.hydrateUserNotifications(userId);
    }
    return this.notifications.get(userId) || [];
  }

  /**
   * Gets unread notifications count for a user
   */
  public getUnreadCount(userId: string): number {
    const list = this.getUserNotifications(userId);
    return list.filter((n) => !n.is_read).length;
  }

  /**
   * Marks a specific notification as read
   */
  public markAsRead(userId: string, notificationId: string): void {
    const list = this.getUserNotifications(userId);
    const item = list.find((n) => n.id === notificationId);
    if (item && !item.is_read) {
      item.is_read = true;
      this.persistUserNotifications(userId);
      realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_READ', { id: notificationId });
    }
  }

  /**
   * Marks all notifications as read for a user
   */
  public markAllAsRead(userId: string): void {
    const list = this.getUserNotifications(userId);
    for (const item of list) {
      item.is_read = true;
    }
    this.persistUserNotifications(userId);
    realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_READ', { all: true });
  }

  /**
   * Clears all notifications for a user
   */
  public clearAll(userId: string): void {
    this.notifications.set(userId, []);
    this.persistUserNotifications(userId);
    realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_CLEARED', { all: true });
  }

  private persistUserNotifications(userId: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const list = this.notifications.get(userId) || [];
      window.localStorage.setItem(`${NOTIFICATIONS_STORAGE_PREFIX}${userId}`, JSON.stringify(list));
    } catch {
      // ignore quota
    }
  }

  private hydrateUserNotifications(userId: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const raw = window.localStorage.getItem(`${NOTIFICATIONS_STORAGE_PREFIX}${userId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.notifications.set(userId, parsed);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default seed notifications for fresh users
    const defaultList: AppNotification[] = [
      {
        id: `seed_1_${userId}`,
        user_id: userId,
        title: 'Real-Time Sync Activated',
        message: 'Your workspace is connected to the Geniusphere high-throughput event bus.',
        priority: 'medium',
        category: 'system',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: `seed_2_${userId}`,
        user_id: userId,
        title: 'Tamper-Proof Verification Ready',
        message: 'All course completions and lab attempts are signed with SHA-256 integrity hashes.',
        priority: 'low',
        category: 'certificate',
        is_read: false,
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
    this.notifications.set(userId, defaultList);
  }
}

export const notificationEngine = new NotificationEngine();
