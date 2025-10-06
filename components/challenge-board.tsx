'use client'

/**
 * CHALLENGE BOARD COMPONENT
 * 
 * Professional training challenge system with realistic fitness goals.
 * Features clear metrics, progress tracking, and achievement-based rewards.
 * 
 * Features:
 * - Daily challenges (3 slots, 24-hour refresh)
 * - Weekly challenges (3 slots, 7-day refresh)
 * - Long-term progression milestones
 * - Advanced multi-part challenges
 * - Real-time progress tracking
 * - Professional UI without fantasy elements
 */

import { useState, useEffect } from 'react'
import { Challenge, ChallengeDifficulty, ChallengeCategory } from '@/lib/challenge-system'

interface ChallengeBoardProps {
  challenges: Challenge[]
  onChallengeComplete?: (challengeId: string) => void
  onRewardClaim?: (challengeId: string) => void
}

export function ChallengeBoard({ 
  challenges, 
  onChallengeComplete: _onChallengeComplete, 
  onRewardClaim 
}: ChallengeBoardProps) {
  const [timeNow, setTimeNow] = useState(Date.now())

  // Update time every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ============================================================================
  // STYLING HELPERS
  // ============================================================================

  /**
   * Get difficulty color and styling
   */
  function getDifficultyColor(difficulty: ChallengeDifficulty): {
    bg: string
    border: string
    text: string
    gradient: string
  } {
    switch (difficulty) {
      case 'beginner':
        return {
          bg: '#10b98133',
          border: '#10b981',
          text: '#10b981',
          gradient: 'from-green-500 to-emerald-500',
        }
      case 'intermediate':
        return {
          bg: '#3b82f633',
          border: '#3b82f6',
          text: '#3b82f6',
          gradient: 'from-blue-500 to-cyan-500',
        }
      case 'advanced':
        return {
          bg: '#a855f733',
          border: '#a855f7',
          text: '#a855f7',
          gradient: 'from-purple-500 to-violet-500',
        }
      case 'elite':
        return {
          bg: '#ef444433',
          border: '#ef4444',
          text: '#ef4444',
          gradient: 'from-red-500 to-rose-500',
        }
      case 'legendary':
        return {
          bg: '#f59e0b33',
          border: '#f59e0b',
          text: '#f59e0b',
          gradient: 'from-amber-500 to-orange-500',
        }
      default:
        return {
          bg: '#6b728033',
          border: '#6b7280',
          text: '#6b7280',
          gradient: 'from-gray-500 to-slate-500',
        }
    }
  }

  /**
   * Get category icon (professional, fitness-focused)
   */
  function getCategoryIcon(category: ChallengeCategory): string {
    switch (category) {
      case 'strength':
        return '💪'
      case 'volume':
        return '📊'
      case 'consistency':
        return '🔥'
      case 'technique':
        return '🎯'
      case 'progressive-overload':
        return '📈'
      case 'endurance':
        return '🏃'
      default:
        return '🏋️'
    }
  }

  /**
   * Get category color
   */
  function getCategoryColor(category: ChallengeCategory): string {
    switch (category) {
      case 'strength':
        return '#ef4444'
      case 'volume':
        return '#3b82f6'
      case 'consistency':
        return '#f97316'
      case 'technique':
        return '#a855f7'
      case 'progressive-overload':
        return '#10b981'
      case 'endurance':
        return '#06b6d4'
      default:
        return '#6b7280'
    }
  }

  /**
   * Format time remaining
   */
  function formatTimeRemaining(expiresAt: Date | undefined): {
    text: string
    isExpiringSoon: boolean
  } {
    if (!expiresAt) {
      return { text: 'No deadline', isExpiringSoon: false }
    }

    const msRemaining = expiresAt.getTime() - timeNow
    const secondsRemaining = Math.floor(msRemaining / 1000)

    if (secondsRemaining <= 0) {
      return { text: 'EXPIRED', isExpiringSoon: true }
    }

    const hours = Math.floor(secondsRemaining / 3600)
    const minutes = Math.floor((secondsRemaining % 3600) / 60)
    const seconds = secondsRemaining % 60

    const isExpiringSoon = hours < 1

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return { text: `${days}d ${hours % 24}h`, isExpiringSoon: false }
    }

    return {
      text: `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      isExpiringSoon,
    }
  }

  /**
   * Check if challenge is claimable
   */
  function isClaimable(challenge: Challenge): boolean {
    return challenge.status === 'completed'
  }

  // ============================================================================
  // RENDER CHALLENGE CARD
  // ============================================================================

  function renderChallengeCard(challenge: Challenge) {
    const timeRemaining = formatTimeRemaining(challenge.expiresAt)
    const claimable = isClaimable(challenge)
    const difficultyStyle = getDifficultyColor(challenge.difficulty)

    return (
      <div
        key={challenge.id}
        className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 rounded-xl p-5 transition-all duration-300 ${
          claimable
            ? 'border-amber-500 shadow-lg shadow-amber-500/50 animate-pulse'
            : challenge.status === 'completed'
            ? 'border-green-500/50 opacity-75'
            : `border-${difficultyStyle.border}/30 hover:border-${difficultyStyle.border}/50`
        }`}
      >
        {/* Difficulty badge */}
        <div
          className="absolute -top-3 -right-3 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg uppercase tracking-wider"
          style={{
            backgroundColor: difficultyStyle.bg,
            border: `2px solid ${difficultyStyle.border}`,
            color: difficultyStyle.text,
          }}
        >
          <span className="text-sm">⚡</span>
          {challenge.difficulty}
        </div>

        {/* Category badge */}
        <div
          className="absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
          style={{
            backgroundColor: `${getCategoryColor(challenge.category)}33`,
            border: `2px solid ${getCategoryColor(challenge.category)}`,
          }}
        >
          {getCategoryIcon(challenge.category)}
        </div>

        {/* Challenge header */}
        <div className="flex items-start gap-4 mb-4 mt-4">
          <div className="text-5xl">{challenge.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              {challenge.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-4 space-y-3">
          {challenge.requirements.map((requirement, index) => {
            const reqProgress = Math.min(
              (requirement.current / requirement.target) * 100,
              100
            )
            const isComplete = requirement.current >= requirement.target

            return (
              <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={isComplete ? 'text-green-400' : 'text-gray-400'}>
                      {isComplete ? '✅' : '⬜'}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isComplete ? 'text-gray-400 line-through' : 'text-white'
                      }`}
                    >
                      {requirement.description}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    {requirement.current}
                    {requirement.unit && ` ${requirement.unit}`} /{' '}
                    {requirement.target}
                    {requirement.unit && ` ${requirement.unit}`}
                  </span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 bg-gradient-to-r ${
                      isComplete ? 'from-green-500 to-emerald-500' : difficultyStyle.gradient
                    }`}
                    style={{ width: `${reqProgress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Overall progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${difficultyStyle.gradient} transition-all duration-500`}
              style={{ width: `${challenge.progress}%` }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider">
            Rewards:
          </div>
          <div className="flex flex-wrap gap-2">
            {challenge.rewards.map((reward, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full text-sm"
              >
                <span>{reward.icon}</span>
                <span className="text-white font-semibold">
                  {reward.type === 'xp' && reward.amount ? (
                    <span className="text-blue-400">+{reward.amount} Points</span>
                  ) : (
                    <span className="text-purple-400">{reward.name}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Time remaining and actions */}
        <div className="flex items-center justify-between">
          {/* Time remaining */}
          {challenge.expiresAt && (
            <div
              className={`text-sm font-semibold ${
                timeRemaining.isExpiringSoon
                  ? 'text-red-400 animate-pulse'
                  : 'text-gray-400'
              }`}
            >
              {timeRemaining.isExpiringSoon && <span className="mr-1">⏰</span>}
              {timeRemaining.text}
            </div>
          )}
          {!challenge.expiresAt && <div className="text-sm text-gray-500">Long-term goal</div>}

          {/* Actions */}
          <div className="flex gap-2">
            {claimable && (
              <button
                onClick={() => onRewardClaim?.(challenge.id)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/50 animate-pulse touch-manipulation min-h-[44px] flex items-center gap-2"
              >
                CLAIM REWARD 🎁
              </button>
            )}

            {challenge.status === 'active' && challenge.progress < 100 && (
              <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-sm font-semibold rounded-lg">
                In Progress
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // ORGANIZE CHALLENGES BY TYPE
  // ============================================================================

  const dailyChallenges = challenges.filter((c) => c.type === 'daily')
  const weeklyChallenges = challenges.filter((c) => c.type === 'weekly')
  const progressionChallenges = challenges.filter((c) => c.type === 'progression')
  const advancedChallenges = challenges.filter((c) => c.type === 'advanced')

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-8">
      {/* Daily Challenges */}
      {dailyChallenges.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-5">
            <div className="text-5xl">☀️</div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Daily Challenges
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Resets every 24 hours • Build daily habits
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dailyChallenges.map((challenge) => renderChallengeCard(challenge))}
          </div>
        </section>
      )}

      {/* Weekly Challenges */}
      {weeklyChallenges.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-5">
            <div className="text-5xl">📅</div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Weekly Challenges
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Resets every Monday • Consistent progress
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {weeklyChallenges.map((challenge) => renderChallengeCard(challenge))}
          </div>
        </section>
      )}

      {/* Long-Term Goals */}
      {progressionChallenges.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-5">
            <div className="text-5xl">🎯</div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
                Long-Term Goals
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                No deadline • Major milestones
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {progressionChallenges.map((challenge) => renderChallengeCard(challenge))}
          </div>
        </section>
      )}

      {/* Advanced Challenges */}
      {advancedChallenges.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-5">
            <div className="text-5xl">🔥</div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-400 text-transparent bg-clip-text">
                Advanced Challenges
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Multi-part challenges • Elite training
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {advancedChallenges.map((challenge) => renderChallengeCard(challenge))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {challenges.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏋️</div>
          <h3 className="text-2xl font-bold text-gray-400 mb-2">
            No active challenges
          </h3>
          <p className="text-gray-500">
            Complete a workout to generate new challenges!
          </p>
        </div>
      )}
    </div>
  )
}
