import webpush from 'web-push';
import { config } from '../config';
import { query } from '../db';

webpush.setVapidDetails(
  config.vapid.subject,
  config.vapid.publicKey,
  config.vapid.privateKey
);

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    view?: string;
    slug?: string;
    url?: string;
  };
}

export class PushSender {
  public async sendToUser(userId: string, payload: PushPayload): Promise<{
    attempted: number;
    successful: number;
    failed: number;
  }> {
    const subsResult = await query(
      `SELECT id, endpoint, p256dh, auth FROM public.push_subscriptions WHERE user_id = $1`,
      [userId]
    );

    let attempted = 0;
    let successful = 0;
    let failed = 0;

    const payloadString = JSON.stringify(payload);

    for (const sub of subsResult.rows) {
      attempted++;
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payloadString);
        successful++;
        await query(
          `UPDATE public.push_subscriptions SET last_used_at = NOW() WHERE id = $1`,
          [sub.id]
        );
      } catch (err: any) {
        failed++;
        console.warn(`[PushSender] Delivery error for subscription ${sub.id}:`, err?.statusCode || err?.message);
        // Clean up expired or unregistered endpoints (HTTP 404 or 410)
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          console.log(`[PushSender] Deleting expired push subscription ${sub.id}`);
          await query(`DELETE FROM public.push_subscriptions WHERE id = $1`, [sub.id]);
        }
      }
    }

    return { attempted, successful, failed };
  }
}

export const pushSender = new PushSender();
