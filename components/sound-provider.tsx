'use client'

/**
 * Sound Provider
 * Manages sound effects and audio feedback throughout the app
 */

import React, { createContext, useContext, useState, useCallback } from 'react'

type SoundType = 'click' | 'success' | 'error' | 'levelUp' | 'achievement' | 'notification'

interface SoundContextType {
  enabled: boolean
  volume: number
  toggleSound: () => void
  setVolume: (volume: number) => void
  playSound: (sound: SoundType) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Sound file URLs - these would be actual audio files in production
const soundFiles: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  levelUp: '/sounds/level-up.mp3',
  achievement: '/sounds/achievement.mp3',
  notification: '/sounds/notification.mp3',
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolumeState] = useState(0.5)

  const toggleSound = useCallback(() => {
    setEnabled(prev => !prev)
    localStorage.setItem('soundEnabled', (!enabled).toString())
  }, [enabled])

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume)
    localStorage.setItem('soundVolume', newVolume.toString())
  }, [])

  const playSound = useCallback((sound: SoundType) => {
    if (!enabled) return

    try {
      const audio = new Audio(soundFiles[sound])
      audio.volume = volume
      audio.play().catch(err => {
        // Silently fail if audio playback is not allowed
        console.debug('Audio playback failed:', err)
      })
    } catch (error) {
      console.debug('Sound playback error:', error)
    }
  }, [enabled, volume])

  // Load preferences on mount
  React.useEffect(() => {
    const savedEnabled = localStorage.getItem('soundEnabled')
    const savedVolume = localStorage.getItem('soundVolume')
    
    if (savedEnabled !== null) {
      setEnabled(savedEnabled === 'true')
    }
    if (savedVolume !== null) {
      setVolumeState(parseFloat(savedVolume))
    }
  }, [])

  return (
    <SoundContext.Provider value={{ enabled, volume, toggleSound, setVolume, playSound }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}
