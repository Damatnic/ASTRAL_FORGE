'use client'

/**
 * Recent Achievements Widget
 * Shows latest unlocked achievements and upcoming milestones
 */

import React from 'react'
import Link from 'next/link'
import { Widget } from './widget'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface RecentAchievementsWidgetProps {
  achievements?: Achievement[]
  className?: string
}

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-cyan-500',
  epic: 'from-purple-400 to-pink-500',
  legendary: 'from-yellow-400 to-orange-500',
}

const rarityBorders = {
  common: 'border-gray-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-yellow-500/50',
}

export function RecentAchievementsWidget({
  achievements = [],
  className,
}: RecentAchievementsWidgetProps) {
  // Show most recent 3 achievements
  const recentAchievements = achievements.slice(0, 3)

  // Calculate days since unlock
  const getDaysSince = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <Widget
      title="Recent Achievements"
      icon="🏆"
      variant="default"
      className={className}
      actions={
        <Link
          href="/achievements"
          className="text-sm text-astral-blue hover:text-astral-purple transition-colors"
        >
          View All →
        </Link>
      }
    >
      {recentAchievements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-gray-400 text-sm mb-2">No achievements yet</p>
          <p className="text-gray-500 text-xs">
            Complete workouts to unlock achievements
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-astral-dark/50 rounded-lg p-3 border ${rarityBorders[achievement.rarity]} hover:border-opacity-100 transition-all group`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {achievement.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white text-sm truncate">
                      {achievement.name}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {getDaysSince(achievement.unlockedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {achievement.description}
                  </p>
                  {/* Rarity Badge */}
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r ${rarityColors[achievement.rarity]}`}
                    >
                      {achievement.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress to Next Achievement */}
      <div className="mt-4 pt-4 border-t border-astral-light/30">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Next Milestone</span>
          <span className="text-astral-blue font-semibold">75%</span>
        </div>
        <div className="h-2 bg-astral-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-astral-blue to-astral-purple rounded-full transition-all duration-500"
            style={{ width: '75%' }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Complete 3 more workouts to unlock <span className="text-astral-blue">Week Warrior</span>
        </p>
      </div>
    </Widget>
  )
}

export default RecentAchievementsWidget
