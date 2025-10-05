'use client'

/**
 * ACHIEVEMENT GALLERY COMPONENT
 * 
 * Epic achievement showcase with rarity tiers, unlock animations, and collection tracking.
 * Features animated notifications, filterable gallery, and progress visualization.
 * 
 * Features:
 * - Rarity tier system (Common/Rare/Epic/Legendary/Mythic)
 * - Animated unlock notifications with particle effects
 * - Achievement card design with progress tracking
 * - Filterable gallery (rarity/category/completion)
 * - Visual states (locked/in-progress/completed/recently unlocked)
 * - Showcase mode with detailed stats
 * - Collection stats and milestone rewards
 * - Interactive tooltips and sharing
 */

import { useState, useEffect } from 'react'

// TypeScript interfaces
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type AchievementCategory = 'combat' | 'training' | 'social' | 'exploration' | 'mastery' | 'special'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: AchievementRarity
  category: AchievementCategory
  unlocked: boolean
  unlockedAt?: Date
  progress: number
  maxProgress: number
  requirements: string[]
  reward?: string
  recentlyUnlocked?: boolean
}

export interface AchievementNotification {
  achievement: Achievement
  timestamp: number
}

interface AchievementGalleryProps {
  achievements: Achievement[]
  onAchievementClick?: (achievement: Achievement) => void
}

export function AchievementGallery({ achievements, onAchievementClick }: AchievementGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'locked' | 'unlocked'>('all')
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | 'all'>('all')
  const [rarityFilter, setRarityFilter] = useState<AchievementRarity | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'rarity' | 'progress'>('date')
  const [notifications, setNotifications] = useState<AchievementNotification[]>([])

  // Get rarity color
  function getRarityColor(rarity: AchievementRarity): string {
    switch (rarity) {
      case 'common': return '#9ca3af' // gray-400
      case 'rare': return '#3b82f6' // blue-500
      case 'epic': return '#a855f7' // purple-500
      case 'legendary': return '#f59e0b' // amber-500
      case 'mythic': return '#ec4899' // pink-500
      default: return '#6b7280'
    }
  }

  // Get rarity gradient
  function getRarityGradient(rarity: AchievementRarity): string {
    switch (rarity) {
      case 'common': return 'from-gray-500/20 to-gray-600/20'
      case 'rare': return 'from-blue-500/20 to-cyan-500/20'
      case 'epic': return 'from-purple-500/20 to-pink-500/20'
      case 'legendary': return 'from-amber-500/20 to-orange-500/20'
      case 'mythic': return 'from-pink-500/20 via-purple-500/20 to-blue-500/20'
      default: return 'from-gray-500/20 to-gray-600/20'
    }
  }

  // Get category icon
  function getCategoryIcon(category: AchievementCategory): string {
    switch (category) {
      case 'combat': return '⚔️'
      case 'training': return '💪'
      case 'social': return '👥'
      case 'exploration': return '🗺️'
      case 'mastery': return '🎯'
      case 'special': return '✨'
      default: return '🏆'
    }
  }

  // Get category color
  function getCategoryColor(category: AchievementCategory): string {
    switch (category) {
      case 'combat': return '#ef4444' // red-500
      case 'training': return '#10b981' // green-500
      case 'social': return '#3b82f6' // blue-500
      case 'exploration': return '#f59e0b' // amber-500
      case 'mastery': return '#a855f7' // purple-500
      case 'special': return '#ec4899' // pink-500
      default: return '#6b7280'
    }
  }

  // Add notification
  function addNotification(achievement: Achievement) {
    const notification: AchievementNotification = {
      achievement,
      timestamp: Date.now()
    }
    setNotifications(prev => [notification, ...prev])
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.timestamp !== notification.timestamp))
    }, 5000)
  }

  // Filter and sort achievements
  const filteredAchievements = achievements
    .filter(a => {
      if (filter === 'locked' && a.unlocked) return false
      if (filter === 'unlocked' && !a.unlocked) return false
      if (categoryFilter !== 'all' && a.category !== categoryFilter) return false
      if (rarityFilter !== 'all' && a.rarity !== rarityFilter) return false
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        if (!a.unlockedAt && !b.unlockedAt) return 0
        if (!a.unlockedAt) return 1
        if (!b.unlockedAt) return -1
        return b.unlockedAt.getTime() - a.unlockedAt.getTime()
      } else if (sortBy === 'rarity') {
        const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 }
        return rarityOrder[b.rarity] - rarityOrder[a.rarity]
      } else { // progress
        const aProgress = a.unlocked ? 100 : (a.progress / a.maxProgress) * 100
        const bProgress = b.unlocked ? 100 : (b.progress / b.maxProgress) * 100
        return bProgress - aProgress
      }
    })

  // Calculate collection stats
  const totalAchievements = achievements.length
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100)
  const rarityBreakdown = {
    common: achievements.filter(a => a.rarity === 'common' && a.unlocked).length,
    rare: achievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
    epic: achievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
    legendary: achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
    mythic: achievements.filter(a => a.rarity === 'mythic' && a.unlocked).length
  }

  return (
    <div className="relative">
      {/* Unlock Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <div
            key={notification.timestamp}
            className="achievement-notification animate-slide-in-right"
            style={{
              background: `linear-gradient(135deg, ${getRarityColor(notification.achievement.rarity)}33, ${getRarityColor(notification.achievement.rarity)}11)`,
              border: `2px solid ${getRarityColor(notification.achievement.rarity)}`,
              boxShadow: `0 0 20px ${getRarityColor(notification.achievement.rarity)}66`
            }}
          >
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 flex items-center gap-4">
              {/* Icon with glow */}
              <div className="relative">
                <div
                  className="absolute -inset-2 rounded-full blur-md animate-pulse"
                  style={{ backgroundColor: `${getRarityColor(notification.achievement.rarity)}66` }}
                />
                <div className="relative text-5xl">{notification.achievement.icon}</div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="text-xs font-semibold mb-1" style={{ color: getRarityColor(notification.achievement.rarity) }}>
                  ACHIEVEMENT UNLOCKED!
                </div>
                <div className="font-bold text-white mb-1">{notification.achievement.name}</div>
                <div className="text-sm text-gray-400">{notification.achievement.description}</div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.timestamp !== notification.timestamp))}
                className="text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Particle burst effect */}
            <div className="achievement-particles" />
          </div>
        ))}
      </div>

      {/* Collection Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-sm text-purple-400 mb-1">Total Progress</div>
          <div className="text-3xl font-black text-white mb-2">{completionPercentage}%</div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-sm text-blue-400 mb-1">Unlocked</div>
          <div className="text-3xl font-black text-white">
            {unlockedCount}/{totalAchievements}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
          <div className="text-sm text-amber-400 mb-1">Legendary</div>
          <div className="text-3xl font-black text-white">{rarityBreakdown.legendary}</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-4">
          <div className="text-sm text-pink-400 mb-1">Mythic</div>
          <div className="text-3xl font-black text-white">{rarityBreakdown.mythic}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
        {/* Completion filter */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation min-h-[44px] ${
              filter === 'all'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            All ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation min-h-[44px] ${
              filter === 'unlocked'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation min-h-[44px] ${
              filter === 'locked'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Locked ({totalAchievements - unlockedCount})
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all touch-manipulation min-h-[44px] flex items-center ${
              categoryFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {(['combat', 'training', 'social', 'exploration', 'mastery', 'special'] as AchievementCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                categoryFilter === cat
                  ? 'text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: categoryFilter === cat ? `${getCategoryColor(cat)}33` : undefined,
                border: categoryFilter === cat ? `2px solid ${getCategoryColor(cat)}` : undefined
              }}
            >
              {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setRarityFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all touch-manipulation min-h-[44px] flex items-center ${
              rarityFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            All Rarities
          </button>
          {(['common', 'rare', 'epic', 'legendary', 'mythic'] as AchievementRarity[]).map(rarity => (
            <button
              key={rarity}
              onClick={() => setRarityFilter(rarity)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all touch-manipulation min-h-[44px] flex items-center ${
                rarityFilter === rarity
                  ? 'text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: rarityFilter === rarity ? `${getRarityColor(rarity)}33` : undefined,
                border: rarityFilter === rarity ? `2px solid ${getRarityColor(rarity)}` : undefined
              }}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>

        {/* Search and sort */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="date">Sort by Date</option>
            <option value="rarity">Sort by Rarity</option>
            <option value="progress">Sort by Progress</option>
          </select>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const progressPercentage = achievement.unlocked
            ? 100
            : Math.round((achievement.progress / achievement.maxProgress) * 100)

          return (
            <div
              key={achievement.id}
              onClick={() => onAchievementClick?.(achievement)}
              className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden group ${
                achievement.unlocked ? 'hover:scale-105' : 'opacity-60'
              } ${
                achievement.recentlyUnlocked ? 'animate-pulse' : ''
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(achievement.rarity)}`} />

              {/* Border glow */}
              {achievement.unlocked && (
                <div
                  className="absolute -inset-[2px] rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                />
              )}

              {/* Card content */}
              <div className="relative bg-slate-900/90 backdrop-blur-sm border rounded-xl p-4"
                style={{ borderColor: `${getRarityColor(achievement.rarity)}66` }}
              >
                {/* Icon */}
                <div className="relative mb-3">
                  {achievement.unlocked && (
                    <div
                      className="absolute -inset-2 rounded-full blur-md"
                      style={{ backgroundColor: `${getRarityColor(achievement.rarity)}44` }}
                    />
                  )}
                  <div className={`relative text-5xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                </div>

                {/* Rarity badge */}
                <div
                  className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${getRarityColor(achievement.rarity)}33`,
                    color: getRarityColor(achievement.rarity),
                    border: `1px solid ${getRarityColor(achievement.rarity)}`
                  }}
                >
                  {achievement.rarity.toUpperCase()}
                </div>

                {/* Category icon */}
                <div className="absolute top-2 left-2 text-2xl opacity-50">
                  {getCategoryIcon(achievement.category)}
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white mb-2">{achievement.name}</h3>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{achievement.description}</p>

                {/* Progress bar */}
                {!achievement.unlocked && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: getRarityColor(achievement.rarity)
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Unlock date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-gray-500">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}

                {/* Reward */}
                {achievement.reward && achievement.unlocked && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
                    <span>🎁</span>
                    <span>{achievement.reward}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <div className="text-xl font-bold text-white mb-2">No achievements found</div>
          <div className="text-gray-400">Try adjusting your filters</div>
        </div>
      )}

      {/* Custom styles */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }

        .achievement-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255,215,0,0.3), transparent);
          animation: particle-burst 1s ease-out;
        }

        @keyframes particle-burst {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
