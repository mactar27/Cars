const CACHE_NAME = 'maison-auto-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through fetch handler for PWA compliance
  // In a full implementation, you would cache static assets here.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
