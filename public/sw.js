// ====================================================================
// Geniusphere — Service Worker & Web Push Notification Handler
// High-reliability offline caching, push notifications, and route navigation
// ====================================================================

const CACHE_NAME = 'geniusphere_shell_cache_v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/sphere-mascot.svg',
];

// Install & Cache Core Shell Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-caching warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate & Prune Obsolete Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate Network Fetch Strategy for App Shell
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Ignore WebAssembly binary chunks and data URLs from strict caching
  if (url.pathname.endsWith('.wasm') || url.protocol === 'data:' || url.pathname.startsWith('/@')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Real-Time Web Push Notification Event Listener
self.addEventListener('push', (event) => {
  let data = {
    title: 'Geniusphere Alert',
    message: 'New learning activity or evaluation recorded.',
    priority: 'medium',
    action_view: 'dashboard',
    action_slug: undefined,
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.message = event.data.text();
    }
  }

  const notificationOptions = {
    body: data.message,
    icon: '/images/sphere-mascot.svg',
    badge: '/images/sphere-mascot.svg',
    tag: data.dedup_key || `geniusphere_${Date.now()}`,
    renotify: true,
    data: {
      action_view: data.action_view || 'dashboard',
      action_slug: data.action_slug,
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Open in Workspace' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

// Notification Click Routing
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetView = event.notification.data?.action_view || 'dashboard';
  const targetSlug = event.notification.data?.action_slug;
  const targetUrl = targetSlug ? `/?view=${targetView}&slug=${targetSlug}` : `/?view=${targetView}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'GENIUSPHERE_NAVIGATE',
            view: targetView,
            slug: targetSlug,
          });
          return client.focus();
        }
      }
      // Otherwise open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle direct message events from application main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_DIRECT_NOTIFICATION') {
    const payload = event.data.payload;
    self.registration.showNotification(payload.title, {
      body: payload.message,
      icon: '/images/sphere-mascot.svg',
      tag: payload.dedup_key || `direct_${Date.now()}`,
      data: {
        action_view: payload.action_view,
        action_slug: payload.action_slug,
      },
    });
  }
});
