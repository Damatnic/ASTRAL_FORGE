'use client'

import { useEffect, useState } from 'react'
import {
  isOnline,
  registerOnlineListeners,
  syncPendingWorkouts,
  getUnsyncedWorkouts,
  estimateStorage,
  requestPersistentStorage
} from '@/lib/offline-manager'

export function useOfflineMode() {
  const [online, setOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [storage, setStorage] = useState({ usage: 0, quota: 0, percent: 0 })

  useEffect(() => {
    // Check initial online status
    setOnline(isOnline())

    // Register online/offline listeners
    const cleanup = registerOnlineListeners(
      () => {
        setOnline(true)
        // Auto-sync when coming back online
        handleSync()
      },
      () => setOnline(false)
    )

    // Check pending workouts
    checkPending()

    // Check storage
    checkStorage()

    // Request persistent storage
    requestPersistentStorage()

    return cleanup
  }, [])

  const checkPending = async () => {
    try {
      const pending = await getUnsyncedWorkouts()
      setPendingCount(pending.length)
    } catch (error) {
      console.error('Failed to check pending workouts:', error)
    }
  }

  const checkStorage = async () => {
    try {
      const estimate = await estimateStorage()
      setStorage(estimate)
    } catch (error) {
      console.error('Failed to estimate storage:', error)
    }
  }

  const handleSync = async () => {
    if (!online) {
      console.log('Cannot sync while offline')
      return
    }

    setSyncing(true)
    try {
      const result = await syncPendingWorkouts()
      console.log('Sync result:', result)
      await checkPending()
      return result
    } catch (error) {
      console.error('Sync failed:', error)
      throw error
    } finally {
      setSyncing(false)
    }
  }

  return {
    online,
    pendingCount,
    syncing,
    storage,
    sync: handleSync,
    refresh: checkPending
  }
}

// Service Worker registration component
export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
          setSwRegistration(registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  const handleUpdate = () => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  return (
    <>
      {children}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="font-bold mb-2">Update Available</div>
          <div className="text-sm mb-3">A new version of ASTRAL POWER is available.</div>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all"
          >
            Update Now
          </button>
        </div>
      )}
    </>
  )
}

// Offline indicator component
export function OfflineIndicator() {
  const { online, pendingCount, syncing, sync } = useOfflineMode()

  if (online && pendingCount === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      {!online && (
        <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold">Offline Mode</span>
          </div>
          <div className="text-xs opacity-90 mt-1">
            Your data will sync when you're back online
          </div>
        </div>
      )}

      {online && pendingCount > 0 && (
        <div className="bg-yellow-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">{pendingCount} Pending Workouts</div>
              <div className="text-xs opacity-90">Ready to sync</div>
            </div>
            <button
              onClick={sync}
              disabled={syncing}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
