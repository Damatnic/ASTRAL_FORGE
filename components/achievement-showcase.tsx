'use client'

/**
 * Achievement & Badge Showcase
 * RPG-style achievement display with rarity tiers
 */

interface Achievement {
  id: string
  title: string
  description: string
  type: 'pr' | 'streak' | 'volume' | 'consistency'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  earnedAt?: Date
  icon: string
  progress?: number
  maxProgress?: number
}

interface AchievementShowcaseProps {
  achievements: Achievement[]
  recentAchievements: Achievement[]
}

export function AchievementShowcase({ achievements, recentAchievements }: AchievementShowcaseProps) {
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 via-orange-500 to-red-500'
      case 'epic':
        return 'from-purple-500 via-pink-500 to-purple-600'
      case 'rare':
        return 'from-blue-400 via-cyan-500 to-blue-600'
      case 'uncommon':
        return 'from-green-400 via-emerald-500 to-green-600'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBorderColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'border-yellow-400 shadow-yellow-500/50'
      case 'epic':
        return 'border-purple-500 shadow-purple-500/50'
      case 'rare':
        return 'border-blue-400 shadow-blue-500/50'
      case 'uncommon':
        return 'border-green-400 shadow-green-500/50'
      default:
        return 'border-gray-600'
    }
  }

  const getRarityLabel = (rarity: Achievement['rarity']) => {
    return rarity.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Recent Unlocks */}
      {recentAchievements.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-astral-blue to-astral-purple mb-4">
            🏆 Recent Achievements
          </h3>

          <div className="space-y-3">
            {recentAchievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className={`relative bg-gray-800/50 rounded-xl p-4 border-2 ${getRarityBorderColor(achievement.rarity)} shadow-lg group hover:scale-105 transition-all duration-300`}
              >
                {/* Rarity shimmer effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(achievement.rarity)} opacity-10 rounded-xl group-hover:opacity-20 transition-opacity`} />

                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-3xl shadow-lg`}>
                    {achievement.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{achievement.title}</span>
                      <span className={`px-2 py-0.5 bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded text-xs font-bold text-white`}>
                        {getRarityLabel(achievement.rarity)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                    {achievement.earnedAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Unlocked {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Achievements Grid */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-astral-blue to-astral-purple">
            🎖️ Achievement Collection
          </h3>
          <span className="text-sm text-gray-400">
            {achievements.filter((a) => a.earnedAt).length} / {achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const isUnlocked = !!achievement.earnedAt

            return (
              <div
                key={achievement.id}
                className={`
                  relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300
                  ${
                    isUnlocked
                      ? `${getRarityBorderColor(achievement.rarity)} shadow-lg hover:scale-110 cursor-pointer`
                      : 'border-gray-700 bg-gray-800/30 grayscale opacity-40 hover:opacity-60'
                  }
                `}
                title={achievement.title}
              >
                {/* Background glow for unlocked */}
                {isUnlocked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-10 rounded-xl`} />
                )}

                {/* Icon */}
                <div className={`text-3xl mb-1 ${!isUnlocked && 'filter grayscale'}`}>
                  {achievement.icon}
                </div>

                {/* Rarity indicator */}
                {isUnlocked && (
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)}`} />
                )}

                {/* Lock for locked achievements */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}

                {/* Progress bar for in-progress achievements */}
                {!isUnlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-700 rounded-b-xl overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-astral-blue to-astral-purple"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

