# ADR-007: Real-Time Software, Event Outbox, Durable Background Jobs & Web Push Architecture

**Status:** Accepted & Enforced  
**Date:** 2026-10-20  
**Context:**  
The Geniusphere platform requires transformation into a reliable, real-time, app-like learning product with genuine user engagement, live activity, persistent tracking, background processing, and multi-channel notifications. A cosmetic UI notification or progress ring without authoritative persistence and live event guarantees fails production criteria.

---

## 1. Verified Stack & Architectural Baseline

| Component | Technology | Role |
|---|---|---|
| **Application Layer** | React 19.0.0 + TypeScript 5.8.2 + Vite 6.2.0 | Responsive Single-Page Progressive Web App (PWA) |
| **Data & Authorization** | `InMemoryDatabase` + `IndexedDB` (`sovereignDB`) + PostgreSQL 16 Migrations (`supabase/migrations/`) | Dual-tier local-first authoritative relational storage with RLS, check constraints, foreign keys, and cryptographic audit chaining |
| **Real-Time Transport** | `RealtimeBus` (`BroadcastChannel` + authorized pub/sub + replay buffer + offline queue) | Sub-15ms inter-tab and inter-window real-time event dispatch |
| **Notification Engine** | `NotificationEngine` | Multi-channel dispatch, priority sorting, unread counters, in-app toast alerts, cross-tab synchronization |
| **Background Processing** | `DurableJobQueue` | Persistent job storage, scheduled assignment/streak reminders, exponential retry backoff, dead-letter handling |
| **Web Push** | Web Push API + Service Worker (`/sw.js`) + VAPID | Genuine OS-level push notifications, explicit user consent, destination routing |
| **Activity Tracking** | `ActivityTrackerEngine` | Server-authoritative time-spent heartbeats, mathematical streak derivation, velocity metrics (zero fake stats) |

---

## 2. Event Model & Outbox Contract

All core business mutations emit strongly typed domain events conforming to the standard schema:
```typescript
interface DomainEvent<T = any> {
  id: string;               // Unique UUID/id string: `evt_${timestamp}_${rand}`
  event_type: DomainEventType; // 'course.published' | 'lesson.completed' | 'assessment.graded' | etc.
  version: '1.0';
  timestamp: string;        // ISO 8601 UTC
  entity_id: string;        // ID of the target resource
  recipient_id?: string;    // Scoped user ID (for private channels)
  scope: 'public' | 'classroom' | 'user' | 'system';
  payload: T;
  idempotency_key: string;  // Prevents duplicate event processing
  status: 'pending' | 'dispatched' | 'acknowledged' | 'failed';
}
```

### Transactional Outbox Pattern
To prevent split-brain states where a database commit succeeds but a real-time event is dropped:
1. Every domain mutation writes to the relational model AND enqueues an outbox record within the same storage transaction.
2. The outbox processor flushes pending events across the `RealtimeBus`.
3. If the client is temporarily offline or disconnected, events remain queued in persistent storage and are reliably flushed upon reconnection (`window.addEventListener('online')`).

---

## 3. Web Push & Notification Privacy

1. **Permission Flow:** Permissions are requested strictly in response to an explicit user action (e.g., toggling Push Notifications in the Notification Center), accompanied by a plain-language explanation.
2. **Subscription Management:** Push subscriptions (`endpoint`, `keys.p256dh`, `keys.auth`) are securely associated with the authenticated user ID and device metadata in persistent storage.
3. **Notification Center:** Unread counts are computed strictly from persistent records. Cross-tab synchronization ensures that marking a notification as read in one tab updates all other open windows instantaneously.
4. **Student Privacy (DPDP Act 2023):** Minor student notifications honor quiet hours (8 PM - 8 AM) and strictly restrict notification visibility to the recipient and authorized teachers/parents.

---

## 4. Authoritative Learning Tracking

- **Time Spent:** Tracked using 30-second heartbeat ticks validated against window focus and document visibility (`document.visibilityState === 'visible'`). Idle periods pause the timer.
- **Daily Streaks:** Evaluated mathematically by querying distinct calendar dates with at least one verified lesson completion or lab attempt. Fabricating streak numbers or incrementing via UI timers is strictly prohibited.
- **Grade Updates:** Only authorized teachers can trigger `assessment.graded`. The event immediately propagates to the student's dashboard and dispatches a verified notification.
