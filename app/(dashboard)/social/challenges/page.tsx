'use client'

import { useChallenges } from '@/hooks/use-data'
import { useState, useEffect } from 'react'

export default function ChallengesPage() {
  const { data, loading } = useChallenges()
  const [challengeProgress, setChallengeProgress] = useState<{ [key: string]: any }>({})
  const [loadingProgress, setLoadingProgress] = useState<{ [key: string]: boolean }>({})

  // Load progress for each challenge
  useEffect(() => {
    if (data?.challenges) {
      data.challenges.forEach((challenge: any) => {
        loadProgress(challenge.id)
      })
    }
  }, [data])

  const loadProgress = async (challengeId: string) => {
    setLoadingProgress(prev => ({ ...prev, [challengeId]: true }))
    try {
      const response = await fetch(`/api/social?mode=challenge-progress&challengeId=${challengeId}`)
      if (response.ok) {
        const result = await response.json()
        setChallengeProgress(prev => ({ ...prev, [challengeId]: result.progress }))
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    } finally {
      setLoadingProgress(prev => ({ ...prev, [challengeId]: false }))
    }
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(100, Math.round((current / goal) * 100))
  }

  const getChallengeIcon = (type: string) => {
    const icons: any = {
      workout_count: '🏋️',
      volume: '💪',
      streak: '🔥',
      pr_count: '⭐',
      custom: '🏆',
    }
    return icons[type] || '🏆'
  }

  const getChallengeColor = (isActive: boolean, isComplete: boolean) => {
    if (isComplete) return 'from-amber-600/20 to-amber-500/20 border-amber-500/30'
    if (isActive) return 'from-amber-600/20 to-amber-500/20 border-amber-500/30'
    return 'from-neutral-700/20 to-neutral-600/20 border-neutral-600/30'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Challenges
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-800/50 backdrop-blur-sm border-2 border-amber-500/20 p-6">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Active Challenges</div>
          <div className="text-3xl font-black uppercase tracking-wider text-amber-400">
            {loading ? '...' : data?.challenges?.filter((c: any) => c.isActive).length || 0}
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border-2 border-amber-500/20 p-6">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">In Progress</div>
          <div className="text-3xl font-black uppercase tracking-wider text-amber-400">
            {loading ? '...' : Object.values(challengeProgress).filter((p: any) => p?.current > 0 && p?.current < p?.goal).length || 0}
          </div>
        </div>

        <div className="bg-neutral-800/50 backdrop-blur-sm border-2 border-amber-500/20 p-6">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Completed</div>
          <div className="text-3xl font-black uppercase tracking-wider text-amber-400">
            {loading ? '...' : Object.values(challengeProgress).filter((p: any) => p?.current >= p?.goal).length || 0}
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-12 text-center text-slate-400">
            Loading challenges...
          </div>
        ) : !data?.challenges?.length ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-slate-400">No challenges available yet</div>
          </div>
        ) : (
          data.challenges.map((challenge: any) => {
            const progress = challengeProgress[challenge.id]
            const isComplete = progress && progress.current >= progress.goal
            const percentage = progress ? getProgressPercentage(progress.current, progress.goal) : 0

            return (
              <div
                key={challenge.id}
                className={`bg-gradient-to-br ${getChallengeColor(challenge.isActive, isComplete)} backdrop-blur-sm border rounded-xl p-6 transition-all hover:scale-[1.01]`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Challenge Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="text-5xl">{getChallengeIcon(challenge.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-black uppercase tracking-wider text-white">{challenge.title}</h3>
                          {challenge.isActive && (
                            <span className="px-2 py-1 bg-amber-500/20 border-2 border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                              Active
                            </span>
                          )}
                          {isComplete && (
                            <span className="px-2 py-1 bg-amber-500/20 border-2 border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                              ✓ Complete
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-300 mb-2 uppercase tracking-wider font-bold">{challenge.description}</p>
                        
                        {/* Challenge Details */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <div>
                            <span className="text-slate-500">Goal:</span>{' '}
                            <span className="font-semibold text-white">
                              {challenge.goal} {challenge.unit}
                            </span>
                          </div>
                          {challenge.startDate && challenge.endDate && (
                            <div>
                              <span className="text-slate-500">Duration:</span>{' '}
                              <span className="font-semibold text-white">
                                {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-500">Participants:</span>{' '}
                            <span className="font-semibold text-white">
                              {challenge.participants?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {progress && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="text-slate-400">Your Progress</span>
                          <span className="font-semibold text-white">
                            {progress.current} / {progress.goal} {challenge.unit}
                          </span>
                        </div>
                        <div className="relative w-full h-3 bg-neutral-900/50 overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                              isComplete 
                                ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                                : 'bg-gradient-to-r from-amber-600 to-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-right mt-1 text-xs text-neutral-500 uppercase tracking-wider font-bold">
                          {percentage}% complete
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reward Card */}
                  <div className="bg-neutral-900/50 border-2 border-neutral-700/50 p-4 text-center min-w-[140px]">
                    <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Reward</div>
                    <div className="text-3xl font-black uppercase tracking-wider text-amber-400 mb-1">
                      +{challenge.reward}
                    </div>
                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">XP</div>
                    
                    {isComplete ? (
                      <button className="mt-3 w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 font-black uppercase tracking-wider text-black transition-colors text-sm">
                        Claim Reward
                      </button>
                    ) : challenge.isActive ? (
                      <button className="mt-3 w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 font-black uppercase tracking-wider transition-colors text-sm">
                        View Details
                      </button>
                    ) : (
                      <div className="mt-3 text-xs text-neutral-500 uppercase tracking-wider font-bold">Inactive</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Challenge Tips */}
      <div className="bg-neutral-800/50 backdrop-blur-sm border-2 border-amber-500/20 p-6">
        <h3 className="text-xl font-black text-amber-400 mb-3 uppercase tracking-wider">💡 Challenge Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
          <div className="flex gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <div className="font-semibold text-white mb-1">Set Realistic Goals</div>
              <div className="text-slate-400">
                Start with challenges that match your current fitness level and gradually increase difficulty.
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">📅</span>
            <div>
              <div className="font-semibold text-white mb-1">Track Your Progress</div>
              <div className="text-slate-400">
                Monitor your daily progress to stay motivated and on track to complete the challenge.
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">👥</span>
            <div>
              <div className="font-semibold text-white mb-1">Join with Friends</div>
              <div className="text-slate-400">
                Team up with friends to stay accountable and make challenges more enjoyable.
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-semibold text-white mb-1">Claim Your Rewards</div>
              <div className="text-slate-400">
                Don't forget to claim your rewards after completing challenges to level up faster.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
