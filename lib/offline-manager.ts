// Offline Data Manager - IndexedDB utilities for offline mode
const DB_NAME = 'astral-power-db'
const DB_VERSION = 1

export interface PendingWorkout {
  id: string
  userId: string
  date: string
  name: string
  exercises: any[]
  completed: boolean
  synced: boolean
  createdAt: string
}

export interface CachedWorkout {
  id: string
  data: any
  cachedAt: string
}

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Pending workouts store (for offline creation)
      if (!db.objectStoreNames.contains('pending-workouts')) {
        const pendingStore = db.createObjectStore('pending-workouts', { keyPath: 'id' })
        pendingStore.createIndex('synced', 'synced', { unique: false })
        pendingStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Cached workouts store (for offline viewing)
      if (!db.objectStoreNames.contains('cached-workouts')) {
        db.createObjectStore('cached-workouts', { keyPath: 'id' })
      }

      // Cached exercises store
      if (!db.objectStoreNames.contains('cached-exercises')) {
        db.createObjectStore('cached-exercises', { keyPath: 'id' })
      }

      // Settings cache
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    }
  })
}

// Save workout for offline sync
export async function savePendingWorkout(workout: PendingWorkout): Promise<void> {
  const db = await openDB()
  const tx = db.transaction('pending-workouts', 'readwrite')
  const store = tx.objectStore('pending-workouts')
  
  await store.put({
    ...workout,
    synced: false,
    createdAt: new Date().toISOString()
  })
}

// Get all pending workouts
export async function getPendingWorkouts(): Promise<PendingWorkout[]> {
  const db = await openDB()
  const tx = db.transaction('pending-workouts', 'readonly')
  const store = tx.objectStore('pending-workouts')
  
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Get unsynced pending workouts
export async function getUnsyncedWorkouts(): Promise<PendingWorkout[]> {
  const db = await openDB()
  const tx = db.transaction('pending-workouts', 'readonly')
  const store = tx.objectStore('pending-workouts')
  
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => {
      const all = request.result as PendingWorkout[]
      resolve(all.filter(w => !w.synced))
    }
    request.onerror = () => reject(request.error)
  })
}

// Mark workout as synced
export async function markWorkoutSynced(id: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction('pending-workouts', 'readwrite')
  const store = tx.objectStore('pending-workouts')
  
  const workout = await new Promise<PendingWorkout>((resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  if (workout) {
    workout.synced = true
    await store.put(workout)
  }
}

// Delete synced workout
export async function deleteSyncedWorkout(id: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction('pending-workouts', 'readwrite')
  const store = tx.objectStore('pending-workouts')
  
  await store.delete(id)
}

// Cache workout for offline viewing
export async function cacheWorkout(id: string, data: any): Promise<void> {
  const db = await openDB()
  const tx = db.transaction('cached-workouts', 'readwrite')
  const store = tx.objectStore('cached-workouts')
  
  await store.put({
    id,
    data,
    cachedAt: new Date().toISOString()
  })
}

// Get cached workout
export async function getCachedWorkout(id: string): Promise<any | null> {
  const db = await openDB()
  const tx = db.transaction('cached-workouts', 'readonly')
  const store = tx.objectStore('cached-workouts')
  
  return new Promise((resolve, reject) => {
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result?.data || null)
    request.onerror = () => reject(request.error)
  })
}

// Cache exercises for offline use
export async function cacheExercises(exercises: any[]): Promise<void> {
  const db = await openDB()
  const tx = db.transaction('cached-exercises', 'readwrite')
  const store = tx.objectStore('cached-exercises')
  
  for (const exercise of exercises) {
    await store.put(exercise)
  }
}

// Get cached exercises
export async function getCachedExercises(): Promise<any[]> {
  const db = await openDB()
  const tx = db.transaction('cached-exercises', 'readonly')
  const store = tx.objectStore('cached-exercises')
  
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Save setting
export async function saveSetting(key: string, value: any): Promise<void> {
  const db = await openDB()
  const tx = db.transaction('settings', 'readwrite')
  const store = tx.objectStore('settings')
  
  await store.put({ key, value, updatedAt: new Date().toISOString() })
}

// Get setting
export async function getSetting(key: string): Promise<any | null> {
  const db = await openDB()
  const tx = db.transaction('settings', 'readonly')
  const store = tx.objectStore('settings')
  
  return new Promise((resolve, reject) => {
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result?.value || null)
    request.onerror = () => reject(request.error)
  })
}

// Sync pending workouts with server
export async function syncPendingWorkouts(): Promise<{
  success: number
  failed: number
  errors: string[]
}> {
  const pending = await getUnsyncedWorkouts()
  let success = 0
  let failed = 0
  const errors: string[] = []

  for (const workout of pending) {
    try {
      const response = await fetch('/api/workout/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout)
      })

      if (response.ok) {
        await deleteSyncedWorkout(workout.id)
        success++
      } else {
        failed++
        errors.push(`Workout ${workout.id}: ${response.statusText}`)
      }
    } catch (error) {
      failed++
      errors.push(`Workout ${workout.id}: ${error}`)
    }
  }

  return { success, failed, errors }
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine
}

// Register online/offline event listeners
export function registerOnlineListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}

// Request persistent storage
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist()
    console.log(`Persistent storage: ${isPersisted}`)
    return isPersisted
  }
  return false
}

// Estimate storage usage
export async function estimateStorage(): Promise<{
  usage: number
  quota: number
  percent: number
}> {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate()
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percent: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0
    }
  }
  return { usage: 0, quota: 0, percent: 0 }
}

// Clear old cached data (older than 30 days)
export async function clearOldCache(): Promise<void> {
  const db = await openDB()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Clear old cached workouts
  const tx = db.transaction('cached-workouts', 'readwrite')
  const store = tx.objectStore('cached-workouts')
  const allCached = await new Promise<CachedWorkout[]>((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  for (const cached of allCached) {
    if (new Date(cached.cachedAt) < thirtyDaysAgo) {
      await store.delete(cached.id)
    }
  }
}
