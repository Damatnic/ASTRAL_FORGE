// Service Worker for Offline Mode and Performance
const CACHE_NAME = 'astral-power-v1'
const RUNTIME_CACHE = 'astral-power-runtime'

// Core files to cache on install
const CORE_CACHE_FILES = [
  '/',
  '/dashboard',
  '/workout',
  '/character',
  '/skills',
  '/achievements',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Cache strategies
const CACHE_FIRST = ['/images/', '/icons/', '/fonts/', '/sounds/']
const NETWORK_FIRST = ['/api/']
const STALE_WHILE_REVALIDATE = ['/_next/static/', '/_next/image/']

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching core files')
        return cache.addAll(CORE_CACHE_FILES)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map(name => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // API requests - Network First with offline fallback
  if (NETWORK_FIRST.some(path => url.pathname.startsWith(path))) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets - Cache First
  if (CACHE_FIRST.some(path => url.pathname.includes(path))) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Next.js static files - Stale While Revalidate
  if (STALE_WHILE_REVALIDATE.some(path => url.pathname.startsWith(path))) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Default - Network First
  event.respondWith(networkFirst(request))
})

// Cache First Strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('[SW] Cache first failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

// Network First Strategy
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE)

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network failed, using cache:', request.url)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/')
      if (offlinePage) {
        return offlinePage
      }
    }

    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  })

  return cached || fetchPromise
}

// Background Sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'sync-workout-data') {
    event.waitUntil(syncWorkoutData())
  }
})

async function syncWorkoutData() {
  try {
    // Open IndexedDB and get pending workouts
    const db = await openDB()
    const tx = db.transaction('pending-workouts', 'readonly')
    const store = tx.objectStore('pending-workouts')
    const pendingWorkouts = await store.getAll()

    // Sync each pending workout
    for (const workout of pendingWorkouts) {
      try {
        const response = await fetch('/api/workout/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workout)
        })

        if (response.ok) {
          // Remove from pending after successful sync
          const deleteTx = db.transaction('pending-workouts', 'readwrite')
          const deleteStore = deleteTx.objectStore('pending-workouts')
          await deleteStore.delete(workout.id)
        }
      } catch (error) {
        console.error('[SW] Failed to sync workout:', error)
      }
    }

    console.log('[SW] Sync completed')
  } catch (error) {
    console.error('[SW] Sync failed:', error)
  }
}

// Helper to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('astral-power-db', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      if (!db.objectStoreNames.contains('pending-workouts')) {
        db.createObjectStore('pending-workouts', { keyPath: 'id' })
      }
      
      if (!db.objectStoreNames.contains('cached-workouts')) {
        db.createObjectStore('cached-workouts', { keyPath: 'id' })
      }
    }
  })
}

// Push notification handling
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/'
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'ASTRAL POWER', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data)
  )
})
