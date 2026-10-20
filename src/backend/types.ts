// ====================================================================
// Geniusphere 2.0 — Real-Time Backend Type System & Message Schemas
// ====================================================================

export type RealtimeChannel =
  | `classroom:${string}`
  | `gradebook:${string}`
  | `user:${string}`
  | `lab:${string}`
  | 'system:audit'
  | 'system:broadcast'
  | string;

export type RealtimeEventType =
  // Presence & Classroom
  | 'PRESENCE_HEARTBEAT'
  | 'HAND_RAISED'
  | 'HAND_LOWERED'
  | 'HAND_ACKNOWLEDGED'
  | 'ANNOUNCEMENT_BROADCAST'
  | 'LESSON_FOCUS_CHANGED'
  // Gradebook & Submissions
  | 'SUBMISSION_RECEIVED'
  | 'GRADE_POSTED'
  | 'FEEDBACK_UPDATED'
  | 'GRADEBOOK_RECALCULATED'
  // User & Progression
  | 'NOTIFICATION_DISPATCHED'
  | 'NOTIFICATION_READ'
  | 'NOTIFICATION_CLEARED'
  | 'NOTIFICATION_PREFERENCES_UPDATED'
  | 'XP_AWARDED'
  | 'CERTIFICATE_ISSUED'
  // Labs & Telemetry
  | 'LAB_STEP_COMPLETED'
  | 'LAB_ATTEMPT_RECORDED'
  | 'LAB_TELEMETRY_STREAM'
  // System & Security
  | 'AUDIT_EVENT_APPENDED'
  | 'SECURITY_ALERT'
  | 'CROSS_TAB_SYNC'
  | 'ADMIN_TELEMETRY_PING';

export interface RealtimeEnvelope<T = any> {
  id: string;
  channel: RealtimeChannel;
  event: RealtimeEventType;
  sender_id: string;
  sender_role: string;
  sender_name?: string;
  timestamp: string;
  payload: T;
  client_latency_ms?: number;
}

export type RealtimeListener<T = any> = (envelope: RealtimeEnvelope<T>) => void;

export type PresenceStatus = 'online' | 'away' | 'offline';

export interface UserPresence {
  user_id: string;
  user_name: string;
  role: string;
  avatar_url?: string;
  status: PresenceStatus;
  current_view: string;
  active_task?: string;
  last_heartbeat: string;
  is_hand_raised?: boolean;
  hand_raised_topic?: string;
  hand_raised_at?: string;
}

export interface HandRaisedItem {
  id: string;
  classroom_id: string;
  student_id: string;
  student_name: string;
  topic: string;
  raised_at: string;
  is_acknowledged: boolean;
}

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationCategory = 'grade' | 'assignment' | 'certificate' | 'classroom' | 'system' | 'security';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  is_read: boolean;
  read_at?: string;
  dedup_key?: string;
  action_view?: string;
  action_slug?: string;
  action_label?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  user_id: string;
  push_enabled: boolean;
  email_enabled: boolean;
  in_app_enabled: boolean;
  assignment_reminders: boolean;
  grade_alerts: boolean;
  streak_reminders: boolean;
  quiet_hours_enabled: boolean;
  updated_at: string;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  device_name?: string;
  created_at: string;
  last_used_at: string;
}

export interface RealtimeTelemetry {
  status: 'connected' | 'reconnecting' | 'offline';
  rtt_ms: number;
  messages_sent: number;
  messages_received: number;
  active_channels_count: number;
  connected_peers_count: number;
  last_sync_timestamp: string;
  offline_queue_length: number;
}
