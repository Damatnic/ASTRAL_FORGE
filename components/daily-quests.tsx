'use client'

import { useState } from 'react'

/**
 * Daily & Weekly Quests System
 * Gives players daily objectives for XP and rewards
 */

interface Quest {
  id: string
  type: 'daily' | 'weekly'
  title: string
  description: string
  progress: number
  goal: number
  xpReward: number
  completed: boolean
  icon: string
}

interface DailyQuestsProps {
  dailyQuests: Quest[]
  weeklyQuests: Quest[]
  onClaimReward?: (questId: string) => void
}

export function DailyQuests({ dailyQuests = [], weeklyQuests = [], onClaimReward }: DailyQuestsProps) {
  const [claimedQuests, setClaimedQuests] = useState<Set<string>>(new Set())

  const handleClaim = (questId: string) => {
    setClaimedQuests((prev) => new Set(prev).add(questId))
    onClaimReward?.(questId)
  }

  const QuestCard = ({ quest }: { quest: Quest }) => {
    const progressPercent = (quest.progress / quest.goal) * 100
    const isClaimed = claimedQuests.has(quest.id)

    return (
      <div className="bg-gray-800/50 rounded-xl p-4 border-2 border-gray-700 hover:border-astral-blue transition-all duration-300">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-astral-blue to-astral-purple flex items-center justify-center text-2xl shrink-0">
            {quest.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-white">{quest.title}</h4>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold shrink-0">
                <span>+{quest.xpReward}</span>
                <span>XP</span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-3">{quest.description}</p>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {quest.progress} / {quest.goal}
                </span>
                <span className="text-astral-blue font-bold">{Math.round(progressPercent)}%</span>
              </div>

              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-astral-blue to-astral-purple transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Claim Button */}
            {quest.completed && !isClaimed && (
              <button
                onClick={() => handleClaim(quest.id)}
                className="mt-3 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>🎁</span>
                <span>Claim Reward</span>
              </button>
            )}

            {isClaimed && (
              <div className="mt-3 w-full py-2 bg-gray-700 rounded-lg font-bold text-gray-400 text-center">
                ✓ Claimed
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Daily Quests */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-blue-500 shadow-2xl shadow-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            ☀️ Daily Quests
          </h3>
          <div className="text-sm text-gray-400">
            Resets in: <span className="text-blue-400 font-bold">12h 34m</span>
          </div>
        </div>

        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl p-6 border-2 border-purple-500 shadow-2xl shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            📅 Weekly Challenges
          </h3>
          <div className="text-sm text-gray-400">
            Resets in: <span className="text-purple-400 font-bold">5d 12h</span>
          </div>
        </div>

        <div className="space-y-3">
          {weeklyQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  )
}

