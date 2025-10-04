'use client'

/**
 * Achievement Tier System
 * Rare, Epic, Legendary achievements with trophy room
 */

export type AchievementTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'

export interface TieredAchievement {
  id: string
  name: string
  description: string
  tier: AchievementTier
  icon: string
  points: number
  unlocked: boolean
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
  secret?: boolean
  category: 'strength' | 'endurance' | 'consistency' | 'milestone' | 'special'
}

interface AchievementTiersProps {
  achievements: TieredAchievement[]
  onSelect?: (achievement: TieredAchievement) => void
}

export function AchievementTiers({ achievements, onSelect }: AchievementTiersProps) {
  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case 'mythic':
        return {
          bg: 'from-red-600 via-orange-500 to-yellow-400',
          border: 'border-red-500',
          text: 'text-red-400',
          glow: 'shadow-red-500/50',
          particle: 'bg-red-400',
        }
      case 'legendary':
        return {
          bg: 'from-yellow-500 via-orange-500 to-red-500',
          border: 'border-yellow-500',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/50',
          particle: 'bg-yellow-400',
        }
      case 'epic':
        return {
          bg: 'from-purple-600 via-pink-500 to-purple-600',
          border: 'border-purple-500',
          text: 'text-purple-400',
          glow: 'shadow-purple-500/50',
          particle: 'bg-purple-400',
        }
      case 'rare':
        return {
          bg: 'from-blue-600 via-cyan-500 to-blue-600',
          border: 'border-blue-500',
          text: 'text-blue-400',
          glow: 'shadow-blue-500/50',
          particle: 'bg-blue-400',
        }
      case 'uncommon':
        return {
          bg: 'from-green-600 via-emerald-500 to-green-600',
          border: 'border-green-500',
          text: 'text-green-400',
          glow: 'shadow-green-500/50',
          particle: 'bg-green-400',
        }
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          border: 'border-gray-500',
          text: 'text-gray-400',
          glow: 'shadow-gray-500/30',
          particle: 'bg-gray-400',
        }
    }
  }

  const getTierLabel = (tier: AchievementTier) => {
    return tier.toUpperCase()
  }

  const groupByTier = (achs: TieredAchievement[]) => {
    const groups: Record<AchievementTier, TieredAchievement[]> = {
      mythic: [],
      legendary: [],
      epic: [],
      rare: [],
      uncommon: [],
      common: [],
    }
    
    achs.forEach((ach) => {
      groups[ach.tier].push(ach)
    })
    
    return groups
  }

  const grouped = groupByTier(achievements)
  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="space-y-6">
      {/* Trophy Room Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse-slow" />
        <div className="relative bg-black/80 border-2 border-cyan-500 rounded-lg p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
                🏆 TROPHY ROOM
              </h2>
              <p className="text-gray-400 font-mono">
                Achievement Points: <span className="text-cyan-400 font-bold">{totalPoints}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-cyan-400">
                {achievements.filter((a) => a.unlocked).length}
              </div>
              <div className="text-sm text-gray-400">/ {achievements.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements by Tier */}
      {(['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'] as AchievementTier[]).map((tier) => {
        const tieredAchs = grouped[tier]
        if (tieredAchs.length === 0) return null

        const colors = getTierColor(tier)

        return (
          <div key={tier} className="space-y-3">
            {/* Tier Header */}
            <div className={`flex items-center gap-3 px-4 py-2 bg-black/80 border-l-4 ${colors.border} rounded`}>
              <div className={`px-3 py-1 bg-gradient-to-r ${colors.bg} rounded font-bold text-black text-sm`}>
                {getTierLabel(tier)}
              </div>
              <div className="text-gray-400 font-mono text-sm">
                {tieredAchs.filter((a) => a.unlocked).length} / {tieredAchs.length}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tieredAchs.map((achievement) => {
                const isLocked = !achievement.unlocked
                const isSecret = achievement.secret && isLocked

                return (
                  <button
                    key={achievement.id}
                    onClick={() => onSelect?.(achievement)}
                    className={`
                      group relative aspect-square rounded-lg border-2 overflow-hidden transition-all duration-300
                      ${isLocked ? 'bg-gray-900/50 border-gray-700 grayscale opacity-60' : `bg-black/80 ${colors.border} ${colors.glow} hover:scale-105`}
                    `}
                    title={isSecret ? '???' : achievement.name}
                  >
                    {/* Background glow */}
                    {!isLocked && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    )}

                    {/* Particles for unlocked */}
                    {!isLocked && (
                      <>
                        <div className={`absolute top-2 left-2 w-1 h-1 ${colors.particle} rounded-full animate-ping`} />
                        <div className={`absolute top-4 right-3 w-1 h-1 ${colors.particle} rounded-full animate-ping delay-75`} />
                        <div className={`absolute bottom-3 left-4 w-1 h-1 ${colors.particle} rounded-full animate-ping delay-150`} />
                      </>
                    )}

                    {/* Content */}
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                      {/* Icon */}
                      <div className={`text-4xl md:text-5xl mb-2 ${isLocked && !isSecret ? 'filter grayscale' : ''}`}>
                        {isSecret ? '❓' : achievement.icon}
                      </div>

                      {/* Name */}
                      <div className={`text-xs md:text-sm font-bold text-center ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        {isSecret ? '???' : achievement.name}
                      </div>

                      {/* Points */}
                      <div className={`text-xs mt-1 ${isLocked ? 'text-gray-600' : colors.text}`}>
                        {achievement.points} pts
                      </div>

                      {/* Progress bar for locked with progress */}
                      {isLocked && !isSecret && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800">
                          <div
                            className={`h-full bg-gradient-to-r ${colors.bg}`}
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      )}

                      {/* Lock icon */}
                      {isLocked && !isSecret && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                          <span className="text-3xl">🔒</span>
                        </div>
                      )}

                      {/* Unlock date */}
                      {!isLocked && achievement.unlockedAt && (
                        <div className="absolute top-1 right-1 text-xs text-gray-400 font-mono">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .delay-75 {
          animation-delay: 0.075s;
        }

        .delay-150 {
          animation-delay: 0.15s;
        }
      `}</style>
    </div>
  )
}

