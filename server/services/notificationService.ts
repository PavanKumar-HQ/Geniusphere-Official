import { query } from '../db';

export interface NotificationRecord {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  dedup_key?: string;
  is_read: boolean;
  action_view?: string;
  action_slug?: string;
  created_at: string;
  read_at?: string;
}

export class NotificationService {
  public async getNotifications(userId: string): Promise<NotificationRecord[]> {
    const res = await query<NotificationRecord>(
      `SELECT * FROM public.notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [userId]
    );
    return res.rows;
  }

  public async getUnreadCount(userId: string): Promise<number> {
    const res = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM public.notifications WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return parseInt(res.rows[0]?.count || '0', 10);
  }

  public async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const res = await query(
      `UPDATE public.notifications 
       SET is_read = TRUE, read_at = NOW() 
       WHERE id = $1 AND user_id = $2`,
      [notificationId, userId]
    );
    return (res.rowCount ?? 0) > 0;
  }

  public async markAllAsRead(userId: string): Promise<number> {
    const res = await query(
      `UPDATE public.notifications 
       SET is_read = TRUE, read_at = NOW() 
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return res.rowCount ?? 0;
  }

  public async createNotification(
    userId: string,
    notif: {
      type: string;
      title: string;
      message: string;
      dedupKey?: string;
      actionView?: string;
      actionSlug?: string;
    }
  ): Promise<NotificationRecord> {
    // If dedupKey exists and already exists within the last hour, avoid spamming
    if (notif.dedupKey) {
      const existing = await query<NotificationRecord>(
        `SELECT * FROM public.notifications 
         WHERE user_id = $1 AND dedup_key = $2 AND created_at > NOW() - INTERVAL '1 hour'
         LIMIT 1`,
        [userId, notif.dedupKey]
      );
      if (existing.rowCount && existing.rowCount > 0) {
        return existing.rows[0];
      }
    }

    const res = await query<NotificationRecord>(
      `INSERT INTO public.notifications 
       (user_id, type, title, message, dedup_key, action_view, action_slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        notif.type,
        notif.title,
        notif.message,
        notif.dedupKey || null,
        notif.actionView || null,
        notif.actionSlug || null,
      ]
    );
    return res.rows[0];
  }

  public async savePushSubscription(
    userId: string,
    sub: { endpoint: string; p256dh: string; auth: string; deviceName?: string }
  ): Promise<void> {
    await query(
      `INSERT INTO public.push_subscriptions (user_id, endpoint, p256dh, auth, device_name)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (endpoint) DO UPDATE 
       SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, last_used_at = NOW()`,
      [userId, sub.endpoint, sub.p256dh, sub.auth, sub.deviceName || 'Web Browser']
    );
  }

  public async removePushSubscription(userId: string, endpoint: string): Promise<boolean> {
    const res = await query(
      `DELETE FROM public.push_subscriptions WHERE user_id = $1 AND endpoint = $2`,
      [userId, endpoint]
    );
    return (res.rowCount ?? 0) > 0;
  }
}

export const notificationService = new NotificationService();
