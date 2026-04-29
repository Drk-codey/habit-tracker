const CACHE_NAME = 'habit-tracker-v1'

const SHELL = ['/', '/login', '/signup', '/dashboard']

// ── Install: cache the shell routes 
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .catch((err) => console.warn('[SW] install cache failed:', err))
  )
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting()
})

// ── Activate: delete old caches 
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  )
  // Take control of all open pages right away
  self.clients.claim()
})

// ── Fetch: serve from cache or network 
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Do NOT intercept Next.js static chunks or HMR websocket traffic.
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/__nextjs')
  ) {
    return // fall through — browser fetches as usual, no SW involvement
  }

  // Next.js app router uses RSC payloads for client-side navigation.
  if (
    event.request.headers.has('rsc') ||
    event.request.headers.has('next-router-prefetch') ||
    event.request.headers.has('next-url') ||
    event.request.headers.get('accept')?.includes('text/x-component')
  ) {
    return
  }

  // For the app shell routes: network-first strategy
  if (SHELL.includes(url.pathname)) {
    // Only handle full navigations for the shell
    if (event.request.mode !== 'navigate') {
      return
    }
    
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, update the cache and return response
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request).then((cached) => {
            if (cached) return cached
            
            // If not in cache either, return the offline fallback
            return new Response(
              `<!doctype html>
              <html lang="en">
              <head><meta charset="utf-8"><title>Habit Tracker — Offline</title>
              <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f0fdf4}
              .box{text-align:center;padding:2rem}h1{color:#16a34a}p{color:#6b7280}</style>
              </head>
              <body><div class="box">
                <h1>Habit Tracker</h1>
                <p>You are offline. Open the app once while connected so it can cache itself.</p>
              </div></body></html>`,
              { status: 200, headers: { 'Content-Type': 'text/html' } }
            )
          })
        })
    )
    return
  }

  // For everything else (icons, manifest, API calls, etc.): network-first,
  // fall back to cache, and always return a real Response — never undefined.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets (icons, manifest)
        if (
          response.ok &&
          (url.pathname.startsWith('/icons/') ||
            url.pathname === '/manifest.json')
        ) {
          const clone = response.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() =>
        caches.match(event.request).then(
          (cached) =>
            cached ??
            // (same fix): always return a real Response
            new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable',
            })
        )
      )
  )
})