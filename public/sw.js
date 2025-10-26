const CACHE_NAME = 'churchcontentai-v2' // Updated version
const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v2'

// Only cache essential static assets, not pages
const STATIC_FILES = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Install event - cache only essential static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching essential static files only')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Essential files cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - network first strategy for better UX
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip API requests (let them go to network)
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // For HTML pages, always try network first
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseToCache = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache)
              })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache only if network fails
          return caches.match(request)
        })
    )
    return
  }

  // For other resources, try cache first but with shorter TTL
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Check if cache is fresh (less than 1 hour old)
          const cacheTime = cachedResponse.headers.get('sw-cache-time')
          if (cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
            console.log('Serving fresh cache:', request.url)
            return cachedResponse
          }
        }

        console.log('Fetching from network:', request.url)
        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response and add cache timestamp
            const responseToCache = response.clone()
            const headers = new Headers(responseToCache.headers)
            headers.set('sw-cache-time', Date.now().toString())

            // Cache with timestamp
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, new Response(responseToCache.body, {
                  status: responseToCache.status,
                  statusText: responseToCache.statusText,
                  headers: headers
                }))
              })

            return response
          })
          .catch(() => {
            // Return cached version if available
            return cachedResponse || new Response('Offline', { status: 503 })
          })
      })
  )
})

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    event.waitUntil(
      // Handle offline form submissions here
      handleOfflineSubmissions()
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received')
  
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('ChurchContentAI', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action)
  
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Helper function for offline submissions
async function handleOfflineSubmissions() {
  try {
    // Get offline submissions from IndexedDB
    const submissions = await getOfflineSubmissions()
    
    for (const submission of submissions) {
      try {
        await fetch(submission.url, {
          method: submission.method,
          headers: submission.headers,
          body: submission.body
        })
        
        // Remove from offline storage if successful
        await removeOfflineSubmission(submission.id)
      } catch (error) {
        console.error('Failed to sync submission:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// IndexedDB helpers (simplified)
async function getOfflineSubmissions() {
  // Implementation would go here
  return []
}

async function removeOfflineSubmission(id) {
  // Implementation would go here
}




