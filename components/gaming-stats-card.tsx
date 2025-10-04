'use client'

/**
 * Gaming-Style Stats Display
 * RPG-inspired stat cards with visual flair
 */

interface GamingStatsCardProps {
  stats: {
    strength: number // Based on max lifts
    endurance: number // Based on workout duration/volume
    discipline: number // Based on streak
    power: number // Overall combat rating
  }
}

export function GamingStatsCard({ stats = { strength: 0, endurance: 0, discipline: 0, power: 0 } }: GamingStatsCardProps) {
  const getStatColor = (value: number) => {
    if (value >= 90) return 'from-yellow-400 to-orange-500'
    if (value >= 70) return 'from-purple-400 to-pink-500'
    if (value >= 50) return 'from-blue-400 to-cyan-500'
    return 'from-gray-400 to-gray-500'
  }

  const getStatRank = (value: number) => {
    if (value >= 95) return 'SSS'
    if (value >= 90) return 'SS'
    if (value >= 85) return 'S'
    if (value >= 75) return 'A'
    if (value >= 65) return 'B'
    if (value >= 50) return 'C'
    if (value >= 35) return 'D'
    return 'E'
  }

  const statData = [
    { name: 'STR', label: 'Strength', value: stats.strength, icon: '⚔️' },
    { name: 'END', label: 'Endurance', value: stats.endurance, icon: '🛡️' },
    { name: 'DIS', label: 'Discipline', value: stats.discipline, icon: '🔥' },
    { name: 'PWR', label: 'Power Level', value: stats.power, icon: '⚡' },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-astral-blue to-astral-purple">
          ⚔️ Battle Stats
        </h3>
        <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">
          COMBAT READY
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        {statData.map((stat) => (
          <div key={stat.name} className="group">
            {/* Stat Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <div className={`px-2 py-1 bg-gradient-to-r ${getStatColor(stat.value)} rounded font-bold text-xs text-white`}>
                  {getStatRank(stat.value)}
                </div>
              </div>
            </div>

            {/* Stat Bar */}
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div
                className={`h-full bg-gradient-to-r ${getStatColor(stat.value)} transition-all duration-1000 ease-out relative overflow-hidden`}
                style={{ width: `${stat.value}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Combat Rating */}
      <div className="mt-6 pt-6 border-t-2 border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">COMBAT RATING</span>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            {Math.round((stats.strength + stats.endurance + stats.discipline + stats.power) / 4)}
          </span>
        </div>
      </div>
    </div>
  )
}

