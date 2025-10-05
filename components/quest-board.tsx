'use client'

/**
 * QUEST BOARD COMPONENT
 * 
 * Epic quest system with daily/weekly quests, progress tracking, and reward chains.
 * Features lore-rich descriptions, difficulty tiers, and time-based resets.
 * 
 * Features:
 * - Daily quests (3 slots, 24-hour refresh)
 * - Weekly quests (3 slots, 7-day refresh)
 * - Story progression chain quests
 * - Difficulty tiers (Easy → Legendary)
 * - Progress tracking with visual bars
 * - Reward chains and bonus objectives
 * - Real-time countdown timers
 * - Quest reroll system
 * - Epic lore-based descriptions
 */

import { useState, useEffect } from 'react'

// TypeScript interfaces
export type QuestType = 'daily' | 'weekly' | 'story'
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'legendary'
export type QuestCategory = 'strength' | 'endurance' | 'technique' | 'consistency' | 'social' | 'exploration'

export interface QuestObjective {
  description: string
  current: number
  max: number
  completed: boolean
}

export interface QuestReward {
  xp: number
  gold: number
  items?: string[]
  special?: string
}

export interface Quest {
  id: string
  type: QuestType
  difficulty: QuestDifficulty
  category: QuestCategory
  title: string
  description: string
  lore: string
  icon: string
  objectives: QuestObjective[]
  rewards: QuestReward
  expiresAt: Date
  completed: boolean
  claimed: boolean
  bonusObjective?: QuestObjective
}

interface QuestBoardProps {
  quests: Quest[]
  onQuestComplete?: (questId: string) => void
  onRewardClaim?: (questId: string) => void
  onQuestReroll?: (questId: string, cost: number) => void
}

export function QuestBoard({ quests, onQuestComplete, onRewardClaim, onQuestReroll }: QuestBoardProps) {
  const [timeNow, setTimeNow] = useState(Date.now())

  // Update time every second for countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Get difficulty color
  function getDifficultyColor(difficulty: QuestDifficulty): string {
    switch (difficulty) {
      case 'easy': return '#10b981' // green-500
      case 'medium': return '#3b82f6' // blue-500
      case 'hard': return '#a855f7' // purple-500
      case 'extreme': return '#ef4444' // red-500
      case 'legendary': return '#f59e0b' // amber-500
      default: return '#6b7280'
    }
  }

  // Get difficulty stars
  function getDifficultyStars(difficulty: QuestDifficulty): number {
    switch (difficulty) {
      case 'easy': return 1
      case 'medium': return 2
      case 'hard': return 3
      case 'extreme': return 4
      case 'legendary': return 5
      default: return 1
    }
  }

  // Get category icon
  function getCategoryIcon(category: QuestCategory): string {
    switch (category) {
      case 'strength': return '💪'
      case 'endurance': return '🏃'
      case 'technique': return '🎯'
      case 'consistency': return '🔥'
      case 'social': return '👥'
      case 'exploration': return '🗺️'
      default: return '⚔️'
    }
  }

  // Get category color
  function getCategoryColor(category: QuestCategory): string {
    switch (category) {
      case 'strength': return '#ef4444' // red-500
      case 'endurance': return '#3b82f6' // blue-500
      case 'technique': return '#a855f7' // purple-500
      case 'consistency': return '#f97316' // orange-500
      case 'social': return '#ec4899' // pink-500
      case 'exploration': return '#10b981' // green-500
      default: return '#6b7280'
    }
  }

  // Format time remaining
  function formatTimeRemaining(expiresAt: Date): { text: string; isExpiringSoon: boolean } {
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
      text: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      isExpiringSoon
    }
  }

  // Calculate quest completion percentage
  function getQuestProgress(quest: Quest): number {
    if (quest.completed) return 100
    
    const totalObjectives = quest.objectives.length
    const completedObjectives = quest.objectives.filter(obj => obj.completed).length
    
    return Math.round((completedObjectives / totalObjectives) * 100)
  }

  // Check if quest is claimable
  function isQuestClaimable(quest: Quest): boolean {
    return quest.completed && !quest.claimed
  }

  // Render quest card
  function renderQuestCard(quest: Quest) {
    const timeRemaining = formatTimeRemaining(quest.expiresAt)
    const progress = getQuestProgress(quest)
    const claimable = isQuestClaimable(quest)

    return (
      <div
        key={quest.id}
        className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 rounded-xl p-4 transition-all duration-300 ${
          claimable
            ? 'border-amber-500 shadow-lg shadow-amber-500/50 animate-pulse'
            : quest.completed
            ? 'border-green-500/50 opacity-75'
            : 'border-purple-500/30 hover:border-purple-500/50'
        }`}
      >
        {/* Difficulty badge */}
        <div
          className="absolute -top-2 -right-2 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg"
          style={{
            backgroundColor: `${getDifficultyColor(quest.difficulty)}33`,
            border: `2px solid ${getDifficultyColor(quest.difficulty)}`,
            color: getDifficultyColor(quest.difficulty)
          }}
        >
          {Array.from({ length: getDifficultyStars(quest.difficulty) }, (_, i) => (
            <span key={i}>⭐</span>
          ))}
          {quest.difficulty.toUpperCase()}
        </div>

        {/* Category icon */}
        <div className="absolute -top-2 -left-2 text-3xl">
          {getCategoryIcon(quest.category)}
        </div>

        {/* Quest icon and header */}
        <div className="flex items-start gap-4 mb-3 mt-2">
          <div className="text-5xl">{quest.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
            <p className="text-xs italic text-purple-400">&quot;{quest.lore}&quot;</p>
          </div>
        </div>

        {/* Objectives */}
        <div className="mb-3 space-y-2">
          {quest.objectives.map((objective, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={objective.completed ? 'text-green-400' : 'text-gray-400'}>
                    {objective.completed ? '✅' : '⬜'}
                  </span>
                  <span className={`text-sm ${objective.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {objective.description}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {objective.current}/{objective.max}
                </span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min((objective.current / objective.max) * 100, 100)}%`,
                    backgroundColor: objective.completed ? '#10b981' : getCategoryColor(quest.category)
                  }}
                />
              </div>
            </div>
          ))}

          {/* Bonus objective */}
          {quest.bonusObjective && (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">🌟</span>
                  <span className={`text-sm font-semibold ${quest.bonusObjective.completed ? 'text-gray-500 line-through' : 'text-amber-400'}`}>
                    BONUS: {quest.bonusObjective.description}
                  </span>
                </div>
                <span className="text-xs text-amber-400">
                  {quest.bonusObjective.current}/{quest.bonusObjective.max}
                </span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${Math.min((quest.bonusObjective.current / quest.bonusObjective.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Overall progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="text-xs font-semibold text-yellow-400 mb-2">REWARDS:</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <span className="text-blue-400 font-bold">+{quest.rewards.xp} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span className="text-yellow-400 font-bold">+{quest.rewards.gold} Gold</span>
            </div>
            {quest.rewards.items && quest.rewards.items.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <span>🎁</span>
                <span className="text-purple-400 font-bold">{item}</span>
              </div>
            ))}
            {quest.rewards.special && (
              <div className="flex items-center gap-1">
                <span>✨</span>
                <span className="text-pink-400 font-bold">{quest.rewards.special}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Time remaining and actions */}
        <div className="flex items-center justify-between">
          {/* Time remaining */}
          <div className={`text-sm font-semibold ${timeRemaining.isExpiringSoon ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
            {timeRemaining.isExpiringSoon && <span className="mr-1">⏰</span>}
            {timeRemaining.text}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {claimable && (
              <button
                onClick={() => onRewardClaim?.(quest.id)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/50 animate-pulse touch-manipulation min-h-[44px] flex items-center gap-2"
              >
                CLAIM REWARD 🎁
              </button>
            )}
            
            {!quest.completed && !quest.claimed && quest.type !== 'story' && (
              <button
                onClick={() => onQuestReroll?.(quest.id, quest.type === 'daily' ? 1 : 5)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all touch-manipulation min-h-[44px] flex items-center gap-1"
              >
                🔄 Reroll ({quest.type === 'daily' ? '1' : '5'} 💰)
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Separate quests by type
  const dailyQuests = quests.filter(q => q.type === 'daily')
  const weeklyQuests = quests.filter(q => q.type === 'weekly')
  const storyQuests = quests.filter(q => q.type === 'story')

  return (
    <div className="space-y-6">
      {/* Daily Quests */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">☀️</div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
              Daily Quests
            </h2>
            <p className="text-sm text-gray-400">Resets every 24 hours</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {dailyQuests.map(quest => renderQuestCard(quest))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">📅</div>
          <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Weekly Quests
            </h2>
            <p className="text-sm text-gray-400">Resets every 7 days</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {weeklyQuests.map(quest => renderQuestCard(quest))}
        </div>
      </div>

      {/* Story Quests */}
      {storyQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">📖</div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                Story Progression
              </h2>
              <p className="text-sm text-gray-400">Epic narrative challenges</p>
            </div>
          </div>
          <div className="space-y-4">
            {storyQuests.map(quest => renderQuestCard(quest))}
          </div>
        </div>
      )}
    </div>
  )
}
