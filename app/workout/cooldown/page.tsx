'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExerciseIntelligence } from '@/lib/exercise-intelligence'

function CooldownContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cooldown, setCooldown] = useState<any>(null)
  const [completedStretches, setCompletedStretches] = useState<Set<string>>(new Set())
  const [timer, setTimer] = useState<number>(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [currentStretch, setCurrentStretch] = useState<string | null>(null)

  useEffect(() => {
    // Get exercises from query params
    const exercisesParam = searchParams.get('exercises')
    if (exercisesParam) {
      const exerciseIds = exercisesParam.split(',')
      const intelligence = new ExerciseIntelligence()
      const cooldownData = intelligence.getCooldownRecommendations(exerciseIds)
      setCooldown(cooldownData)
    }
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false)
            setCurrentStretch(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timer])

  const startStretchTimer = (stretchName: string, duration: string) => {
    // Parse duration (e.g., "30 seconds" -> 30)
    const seconds = parseInt(duration.match(/\d+/)?.[0] || '30')
    setTimer(seconds)
    setCurrentStretch(stretchName)
    setIsTimerActive(true)
  }

  const toggleStretchComplete = (stretchName: string) => {
    const newCompleted = new Set(completedStretches)
    if (newCompleted.has(stretchName)) {
      newCompleted.delete(stretchName)
    } else {
      newCompleted.add(stretchName)
    }
    setCompletedStretches(newCompleted)
  }

  const progress = cooldown ? 
    (completedStretches.size / (cooldown.staticStretches.length + cooldown.dynamicStretches.length)) * 100 : 0

  if (!cooldown) {
    return (
      <div className="min-h-screen bg-astral-dark flex items-center justify-center">
        <div className="text-gray-400">Loading cooldown routine...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white pb-20">
      {/* Header */}
      <div className="bg-astral-gray border-b border-gray-800 p-6 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-2">Cool Down & Stretch</h1>
          <p className="text-gray-400">Recover properly to maximize gains and prevent injury</p>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-astral-blue font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-astral-blue to-astral-purple h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Active Timer */}
        {isTimerActive && currentStretch && (
          <div className="bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl p-8 text-center animate-pulse sticky top-24 z-10">
            <div className="text-sm mb-2">{currentStretch}</div>
            <div className="text-7xl font-bold mb-4">
              {timer}s
            </div>
            <button
              onClick={() => {
                setIsTimerActive(false)
                setTimer(0)
                setCurrentStretch(null)
              }}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Stop Timer
            </button>
          </div>
        )}

        {/* Static Stretches */}
        {cooldown.staticStretches.length > 0 && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🧘 Static Stretches
              <span className="text-sm text-gray-400 font-normal">
                ({completedStretches.size} / {cooldown.staticStretches.length + cooldown.dynamicStretches.length})
              </span>
            </h2>
            <p className="text-sm text-gray-400 mb-4">Hold each stretch without bouncing. Breathe deeply.</p>
            <div className="space-y-4">
              {cooldown.staticStretches.map((stretch: any, index: number) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-colors ${
                    completedStretches.has(stretch.name)
                      ? 'bg-green-900/20 border-green-700'
                      : 'bg-gray-700/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => toggleStretchComplete(stretch.name)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            completedStretches.has(stretch.name)
                              ? 'bg-green-600 border-green-600'
                              : 'border-gray-500'
                          }`}
                        >
                          {completedStretches.has(stretch.name) && (
                            <span className="text-white text-sm">✓</span>
                          )}
                        </button>
                        <h3 className="font-semibold">{stretch.name}</h3>
                      </div>
                      <p className="text-sm text-astral-blue mb-2">{stretch.duration}</p>
                      <p className="text-sm text-gray-300">{stretch.instructions}</p>
                    </div>
                    {!completedStretches.has(stretch.name) && !isTimerActive && (
                      <button
                        onClick={() => startStretchTimer(stretch.name, stretch.duration)}
                        className="px-4 py-2 bg-astral-blue rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
                      >
                        Start Timer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Stretches */}
        {cooldown.dynamicStretches.length > 0 && (
          <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">🔄 Active Recovery</h2>
            <p className="text-sm text-gray-400 mb-4">Gentle movements to promote blood flow.</p>
            <div className="space-y-4">
              {cooldown.dynamicStretches.map((stretch: any, index: number) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-colors ${
                    completedStretches.has(stretch.name)
                      ? 'bg-green-900/20 border-green-700'
                      : 'bg-gray-700/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleStretchComplete(stretch.name)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        completedStretches.has(stretch.name)
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-500'
                      }`}
                    >
                      {completedStretches.has(stretch.name) && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{stretch.name}</h3>
                      <p className="text-sm text-astral-blue mb-2">{stretch.reps}</p>
                      <p className="text-sm text-gray-300">{stretch.instructions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recovery Tips */}
        <div className="bg-gradient-to-br from-astral-blue/10 to-astral-purple/10 border border-astral-blue/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">💡 Recovery Tips</h2>
          <div className="space-y-3">
            {cooldown.recoveryTips.map((tip: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{tip.split(':')[0]}</span>
                <p className="text-gray-300">{tip.split(':').slice(1).join(':').trim()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        {progress === 100 && (
          <div className="bg-green-900/20 border border-green-700 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
            <p className="text-gray-300 mb-6">You've completed your cooldown routine. Your body will thank you!</p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Return to Dashboard
            </Link>
          </div>
        )}

        {/* Skip Button */}
        {progress < 100 && (
          <Link
            href="/dashboard"
            className="block text-center py-3 text-gray-400 hover:text-white transition-colors"
          >
            Skip Cooldown (Not Recommended)
          </Link>
        )}
      </div>
    </div>
  )
}

export default function CooldownPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center"><div className="text-xl">Loading cooldown...</div></div>}>
      <CooldownContent />
    </Suspense>
  )
}
