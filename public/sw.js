const CACHE_NAME = 'habit-tracker-v1'

// Files to cache (the "app shell")
const SHELL = ['/', '/login', '/signup', '/dashboard', '/manifest.json']

// Cache the shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  )
})

// Serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => cached)
    })
  )
})