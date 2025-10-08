'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, SkipForward, Plus, X } from 'lucide-react'

interface RestTimerWidgetProps {
  isActive: boolean
  onClose: () => void
  initialDuration?: number
}

export function RestTimerWidget({ isActive, onClose, initialDuration = 90 }: RestTimerWidgetProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration)
  const [isPaused, setIsPaused] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(initialDuration)
      setIsPaused(false)
      setHasStarted(false)
      return
    }

    setHasStarted(true)

    if (isPaused) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer complete - play sound
          playCompletionSound()
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isPaused, initialDuration])

  const playCompletionSound = () => {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('Audio not supported')
    }
  }

  const addTime = (seconds: number) => {
    setTimeRemaining((prev) => prev + seconds)
  }

  const skip = () => {
    setTimeRemaining(0)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((initialDuration - timeRemaining) / initialDuration) * 100
  const isComplete = timeRemaining === 0
  const isWarning = timeRemaining <= 10 && timeRemaining > 0

  if (!isActive) return null

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div
        className={`bg-gradient-to-br ${
          isComplete
            ? 'from-amber-950/20 to-amber-900/20 border-amber-500'
            : isWarning
            ? 'from-amber-950/20 to-amber-800/20 border-amber-500 animate-pulse'
            : 'from-amber-950/20 to-amber-900/20 border-amber-500'
        } border-2 backdrop-blur-xl p-6 shadow-2xl min-w-[280px]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-sm text-neutral-300 uppercase tracking-wider">RECOVERY TIMER</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-6">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-neutral-800"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${
                  isComplete ? 'text-amber-400' : isWarning ? 'text-amber-400' : 'text-amber-400'
                }`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Time Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-black tabular-nums uppercase tracking-wider ${
                isComplete ? 'text-amber-400' : isWarning ? 'text-amber-400' : 'text-white'
              }`}>
                {isComplete ? '✓' : formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {isComplete && (
          <div className="text-center mb-4">
            <p className="text-amber-400 font-black uppercase tracking-wider">RECOVERY COMPLETE!</p>
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-wider">READY FOR NEXT SET</p>
          </div>
        )}

        {/* Controls */}
        {!isComplete && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 font-black uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  RESUME
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  PAUSE
                </>
              )}
            </button>
            
            <button
              onClick={skip}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 font-black uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              SKIP
            </button>
          </div>
        )}

        {/* Quick Add Time */}
        {!isComplete && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => addTime(15)}
              className="px-3 py-1.5 bg-amber-950/20 border-2 border-amber-700 hover:bg-amber-900/30 text-sm font-black uppercase tracking-wider transition-colors text-amber-400"
            >
              +15S
            </button>
            <button
              onClick={() => addTime(30)}
              className="px-3 py-1.5 bg-amber-950/20 border-2 border-amber-700 hover:bg-amber-900/30 text-sm font-black uppercase tracking-wider transition-colors text-amber-400"
            >
              +30S
            </button>
            <button
              onClick={() => addTime(60)}
              className="px-3 py-1.5 bg-amber-950/20 border-2 border-amber-700 hover:bg-amber-900/30 text-sm font-black uppercase tracking-wider transition-colors text-amber-400"
            >
              +1M
            </button>
          </div>
        )}

        {/* Complete Button */}
        {isComplete && (
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 font-black uppercase tracking-wider transition-colors"
          >
            START NEXT SET
          </button>
        )}
      </div>
    </div>
  )
}
