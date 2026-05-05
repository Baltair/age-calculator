const CACHE_NAME = 'age-calculator-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/favicon.png',
  '/confetti.browser.js',
  '/Sortable.min.js'
];

// Install event: cache basic assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: network first, fallback to cache
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Ignore non-http/https schemes (fixes chrome-extension error)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // 2. Ignore PostHog/Analytics requests (don't cache these)
  if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/i/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful responses of type 'basic' (same-origin)
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(async () => {
        // Network failed, try to serve from cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If it's a navigation request (the main page), and we have nothing, this is a total failure
        if (event.request.mode === 'navigate') {
          return new Response('Offline. Please check your connection.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        }

        // For assets, just return a 404/503 response so the browser doesn't throw a "promise rejected" error
        return new Response('Asset unavailable offline', { status: 503 });
      })
  );
});
