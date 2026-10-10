// Service Worker for Jon.Branding PWA
const CACHE_NAME = 'jonbranding-v3-recovery';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192-v2.png',
  '/icon-512-v2.png',
  '/icon-maskable-192-v2.png',
  '/icon-maskable-512-v2.png',
  '/icon-v2.svg',
  '/apple-touch-icon-v2.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => {
        // Precaching failure should not break the install
        console.warn('[PWA SW] Pre-cache failed', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const current = await caches.open(CACHE_NAME);
      for (const key of await caches.keys()) {
        if (key === CACHE_NAME || !key.startsWith('jonbranding-')) continue;
        const previous = await caches.open(key);
        // An already-open app can still need immutable chunks from its build.
        for (const request of await previous.keys()) {
          if (new URL(request.url).pathname.startsWith('/_next/static/')) {
            const response = await previous.match(request);
            if (response) await current.put(request, response);
          }
        }
        await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass non-http, API, analytics, Sanity and dynamic backend endpoints
  if (
    !url.protocol.startsWith('http') ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('sanity.io') ||
    url.hostname.includes('google') ||
    url.hostname.includes('amplitude') ||
    url.hostname.includes('yandex') ||
    url.hostname.includes('facebook')
  ) {
    return;
  }

  // Navigation (HTML pages): Network-First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(event.request);
          if (cached) return cached;
          const fallback = await cache.match('/');
          return fallback || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // Build-hashed chunks are immutable. Keep them available across SW updates.
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        // Storage quota must never turn a successful network load into an error.
        if (response.status === 200) await cache.put(event.request, response.clone()).catch(() => {});
        return response;
      } catch {
        return new Response('Asset unavailable', { status: 503 });
      }
    })());
    return;
  }

  // Other static assets: Stale-While-Revalidate
  if (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return networkResponse;
          })
          .catch(() => cached || new Response('Asset unavailable', { status: 503 }));

        return cached || fetchPromise;
      })
    );
  }
});
