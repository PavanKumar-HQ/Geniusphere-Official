// ====================================================================
// Geniusphere 2.0 — Real-Time Notification Engine
// Multi-channel dispatch, priority sorting, persistent user inboxes,
// cross-tab synchronization, preferences, and deduplication
// ====================================================================

import {
  AppNotification,
  NotificationCategory,
  NotificationPriority,
  NotificationPreferences,
} from '../types';
import { realtimeBus } from '../RealtimeBus';

const NOTIFICATIONS_STORAGE_PREFIX = 'geniusphere_notifications_';
const PREFERENCES_STORAGE_PREFIX = 'geniusphere_notif_prefs_';

export class NotificationEngine {
  private notifications: Map<string, AppNotification[]> = new Map(); // key = userId
  private preferences: Map<string, NotificationPreferences> = new Map(); // key = userId
  private toastSubscribers: Set<(notification: AppNotification) => void> = new Set();
  private pushSubscriber: ((userId: string, notification: AppNotification) => void) | null = null;

  constructor() {
    this.initRealtimeListener();
  }

  private initRealtimeListener(): void {
    // Listen for notification events broadcast on user channels
    realtimeBus.subscribe('user:*', (envelope) => {
      const channelUserId = envelope.channel.startsWith('user:') ? envelope.channel.slice(5) : '';

      if (envelope.event === 'NOTIFICATION_DISPATCHED' && envelope.payload) {
        const notif = envelope.payload as AppNotification;
        this.storeNotificationInMemory(notif);
        // Alert toast subscribers if priority allows and not in quiet hours
        if (notif.priority === 'high' || notif.priority === 'urgent' || notif.priority === 'medium') {
          const prefs = this.getUserPreferences(notif.user_id);
          const inQuietHours = prefs.quiet_hours_enabled && this.isQuietHour();
          
          if (!inQuietHours && prefs.in_app_enabled) {
            for (const sub of this.toastSubscribers) {
              try {
                sub(notif);
              } catch (err) {
                console.error('[NotificationEngine] Toast subscriber error:', err);
              }
            }
          }
        }
      } else if (envelope.event === 'NOTIFICATION_READ' && envelope.payload) {
        const targetUserId = channelUserId || envelope.sender_id;
        if (targetUserId) {
          const list = this.notifications.get(targetUserId);
          if (list) {
            if (envelope.payload.all) {
              for (const n of list) {
                n.is_read = true;
                n.read_at = n.read_at || new Date().toISOString();
              }
            } else if (envelope.payload.id) {
              const item = list.find((n) => n.id === envelope.payload.id);
              if (item) {
                item.is_read = true;
                item.read_at = envelope.payload.read_at || new Date().toISOString();
              }
            }
            this.persistUserNotifications(targetUserId);
          }
        }
      } else if (envelope.event === 'NOTIFICATION_CLEARED') {
        const targetUserId = channelUserId || envelope.sender_id;
        if (targetUserId) {
          this.notifications.set(targetUserId, []);
          this.persistUserNotifications(targetUserId);
        }
      } else if (envelope.event === 'NOTIFICATION_PREFERENCES_UPDATED' && envelope.payload) {
        const targetUserId = channelUserId || envelope.payload.user_id;
        if (targetUserId) {
          this.preferences.set(targetUserId, envelope.payload);
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
   * Hooks Web Push dispatcher into notification engine
   */
  public registerPushDispatcher(dispatcher: (userId: string, notification: AppNotification) => void): void {
    this.pushSubscriber = dispatcher;
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
    const prefs = this.getUserPreferences(userId);

    // Honor category preferences
    if (category === 'assignment' && !prefs.assignment_reminders) {
      // Suppressed per user preference
    }
    if (category === 'grade' && !prefs.grade_alerts) {
      // Suppressed per user preference
    }

    // Deduplication check
    const dedupKey = metadata?.dedup_key || (metadata?.assignment_id ? `assignment_${metadata.assignment_id}_${category}` : undefined);
    if (dedupKey) {
      const existing = this.getUserNotifications(userId).find((n) => n.dedup_key === dedupKey);
      if (existing) {
        return existing;
      }
    }

    const notification: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      user_id: userId,
      title,
      message,
      priority,
      category,
      is_read: false,
      dedup_key: dedupKey,
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

    // Trigger Web Push if enabled
    if (prefs.push_enabled && this.pushSubscriber) {
      this.pushSubscriber(userId, notification);
    }

    return notification;
  }

  /**
   * Dispatches a broadcast notification to multiple users
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
   * Retrieves notifications for a specific user with optional filters
   */
  public getUserNotifications(
    userId: string,
    options?: { category?: NotificationCategory; unreadOnly?: boolean; limit?: number }
  ): AppNotification[] {
    if (!this.notifications.has(userId)) {
      this.hydrateUserNotifications(userId);
    }
    let list = this.notifications.get(userId) || [];

    if (options?.category) {
      list = list.filter((n) => n.category === options.category);
    }
    if (options?.unreadOnly) {
      list = list.filter((n) => !n.is_read);
    }
    if (options?.limit && options.limit > 0) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  /**
   * Gets unread notifications count for a user
   */
  public getUnreadCount(userId: string): number {
    const list = this.getUserNotifications(userId);
    return list.filter((n) => !n.is_read).length;
  }

  /**
   * Marks a specific notification as read and synchronizes cross-tab
   */
  public markAsRead(userId: string, notificationId: string): void {
    const list = this.getUserNotifications(userId);
    const item = list.find((n) => n.id === notificationId);
    if (item && !item.is_read) {
      item.is_read = true;
      item.read_at = new Date().toISOString();
      this.persistUserNotifications(userId);
      realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_READ', {
        id: notificationId,
        read_at: item.read_at,
        userId,
      });
    }
  }

  /**
   * Marks all notifications as read for a user and synchronizes cross-tab
   */
  public markAllAsRead(userId: string): void {
    const list = this.getUserNotifications(userId);
    const now = new Date().toISOString();
    for (const item of list) {
      item.is_read = true;
      item.read_at = item.read_at || now;
    }
    this.persistUserNotifications(userId);
    realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_READ', { all: true, userId });
  }

  /**
   * Clears all notifications for a user
   */
  public clearAll(userId: string): void {
    this.notifications.set(userId, []);
    this.persistUserNotifications(userId);
    realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_CLEARED', { all: true, userId });
  }

  /**
   * Retrieves notification preferences for a user
   */
  public getUserPreferences(userId: string): NotificationPreferences {
    if (!this.preferences.has(userId)) {
      this.hydrateUserPreferences(userId);
    }
    return (
      this.preferences.get(userId) || {
        user_id: userId,
        push_enabled: false,
        email_enabled: true,
        in_app_enabled: true,
        assignment_reminders: true,
        grade_alerts: true,
        streak_reminders: true,
        quiet_hours_enabled: false,
        updated_at: new Date().toISOString(),
      }
    );
  }

  /**
   * Updates notification preferences for a user
   */
  public updateUserPreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): NotificationPreferences {
    const current = this.getUserPreferences(userId);
    const updated: NotificationPreferences = {
      ...current,
      ...updates,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    this.preferences.set(userId, updated);
    this.persistUserPreferences(userId);

    realtimeBus.publish(`user:${userId}`, 'NOTIFICATION_PREFERENCES_UPDATED', updated);
    return updated;
  }

  private isQuietHour(): boolean {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 8; // 8 PM to 8 AM
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

    // Genuine fresh user starts with clean empty notification inbox
    const defaultList: AppNotification[] = [];
    this.notifications.set(userId, defaultList);
  }

  private persistUserPreferences(userId: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const prefs = this.preferences.get(userId);
      if (prefs) {
        window.localStorage.setItem(`${PREFERENCES_STORAGE_PREFIX}${userId}`, JSON.stringify(prefs));
      }
    } catch {
      // ignore
    }
  }

  private hydrateUserPreferences(userId: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const raw = window.localStorage.getItem(`${PREFERENCES_STORAGE_PREFIX}${userId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user_id) {
          this.preferences.set(userId, parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
  }
}

export const notificationEngine = new NotificationEngine();
