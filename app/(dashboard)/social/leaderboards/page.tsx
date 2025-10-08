'use client'

import { useLeaderboard, useUserRank } from '@/hooks/use-data'
import { useState } from 'react'

type LeaderboardType = 'level' | 'total_progress' | 'workouts' | 'streak' | 'volume'

const LEADERBOARD_TABS = [
  { type: 'level' as LeaderboardType, label: 'Level', icon: '⭐', color: 'purple' },
  { type: 'total_progress' as LeaderboardType, label: 'Total Progress', icon: '💎', color: 'blue' },
  { type: 'workouts' as LeaderboardType, label: 'Workouts', icon: '🏋️', color: 'green' },
  { type: 'streak' as LeaderboardType, label: 'Streak', icon: '🔥', color: 'orange' },
  { type: 'volume' as LeaderboardType, label: 'Volume', icon: '💪', color: 'red' },
]

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('level')
  const [limit, setLimit] = useState(50)
  
  const { data: leaderboard, loading: leaderboardLoading } = useLeaderboard(activeTab, limit)
  const { data: rank, loading: rankLoading } = useUserRank(activeTab)

  const getColorClasses = (color: string) => {
    const colors: any = {
      purple: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
      blue: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
      green: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
      orange: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
      red: 'border-red-500/20 bg-red-500/10 text-red-400',
    }
    return colors[color] || colors.purple
  }

  const formatValue = (value: number, type: LeaderboardType) => {
    if (type === 'volume') return `${(value / 1000).toFixed(1)}k kg`
    if (type === 'total_progress') return `${(value / 1000).toFixed(1)}k pts`
    if (type === 'streak') return `${value} days`
    return value.toString()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Leaderboards
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {LEADERBOARD_TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === tab.type
                ? getColorClasses(tab.color)
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* User Rank Card */}
      {rank && !rankLoading && (
        <div className="bg-gradient-to-r from-amber-600/10 to-amber-500/10 border-2 border-amber-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Your Position</div>
              <div className="text-4xl font-black uppercase tracking-wider text-amber-400">#{rank.rank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Percentile</div>
              <div className="text-2xl font-black uppercase tracking-wider text-amber-400">Top {rank.percentile}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Total Warriors</div>
              <div className="text-2xl font-black uppercase tracking-wider text-amber-400">{rank.total}</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {LEADERBOARD_TABS.find(t => t.type === activeTab)?.icon}{' '}
              {LEADERBOARD_TABS.find(t => t.type === activeTab)?.label} Rankings
            </h2>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>
        </div>

        {leaderboardLoading ? (
          <div className="p-12 text-center text-slate-400">
            Loading leaderboard...
          </div>
        ) : !leaderboard?.entries?.length ? (
          <div className="p-12 text-center text-slate-400">
            No entries found
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {leaderboard.entries.map((entry: any) => (
              <div
                key={entry.userId}
                className={`p-4 hover:bg-slate-900/30 transition-colors ${
                  entry.rank <= 3 ? 'bg-slate-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-12 h-12 flex items-center justify-center font-black uppercase tracking-wider text-lg ${
                      entry.rank === 1 ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50' :
                      entry.rank === 2 ? 'bg-neutral-400/20 text-neutral-300 border-2 border-neutral-400/50' :
                      entry.rank === 3 ? 'bg-amber-600/20 text-amber-400 border-2 border-amber-600/50' :
                      'bg-neutral-700/50 text-neutral-400'
                    }`}>
                      {entry.rank === 1 ? '🥇' :
                       entry.rank === 2 ? '🥈' :
                       entry.rank === 3 ? '🥉' :
                       `#${entry.rank}`}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="font-black uppercase tracking-wider text-white text-lg">
                        {entry.userName}
                      </div>
                      <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                        Level {entry.level} {entry.characterClass}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="text-2xl font-black uppercase tracking-wider text-amber-400">
                        {formatValue(entry.value, activeTab)}
                      </div>
                      {entry.change > 0 && (
                        <div className="text-sm text-amber-400 flex items-center justify-end gap-1 uppercase tracking-wider font-bold">
                          <span>↑</span>
                          <span>{entry.change}</span>
                        </div>
                      )}
                      {entry.change < 0 && (
                        <div className="text-sm text-red-400 flex items-center justify-end gap-1">
                          <span>↓</span>
                          <span>{Math.abs(entry.change)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trophy Showcase for Top 3 */}
      {leaderboard?.entries && leaderboard.entries.length >= 3 && (
        <div className="bg-neutral-800/50 backdrop-blur-sm border-2 border-amber-500/20 p-6">
          <h3 className="text-xl font-black uppercase tracking-wider text-amber-400 mb-4 text-center">
            🏆 Hall of Champions 🏆
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Second Place */}
            <div className="text-center pt-8">
              <div className="text-6xl mb-2">🥈</div>
              <div className="font-black uppercase tracking-wider text-white mb-1">
                {leaderboard.entries[1]?.userName}
              </div>
              <div className="text-sm text-neutral-400 mb-2 uppercase tracking-wider font-bold">
                Level {leaderboard.entries[1]?.level}
              </div>
              <div className="text-lg font-black uppercase tracking-wider text-amber-300">
                {formatValue(leaderboard.entries[1]?.value, activeTab)}
              </div>
            </div>

            {/* First Place */}
            <div className="text-center">
              <div className="text-7xl mb-2">🥇</div>
              <div className="font-black uppercase tracking-wider text-amber-400 text-lg mb-1">
                {leaderboard.entries[0]?.userName}
              </div>
              <div className="text-sm text-neutral-400 mb-2 uppercase tracking-wider font-bold">
                Level {leaderboard.entries[0]?.level}
              </div>
              <div className="text-2xl font-black uppercase tracking-wider text-amber-400">
                {formatValue(leaderboard.entries[0]?.value, activeTab)}
              </div>
            </div>

            {/* Third Place */}
            <div className="text-center pt-8">
              <div className="text-6xl mb-2">🥉</div>
              <div className="font-black uppercase tracking-wider text-white mb-1">
                {leaderboard.entries[2]?.userName}
              </div>
              <div className="text-sm text-neutral-400 mb-2 uppercase tracking-wider font-bold">
                Level {leaderboard.entries[2]?.level}
              </div>
              <div className="text-lg font-black uppercase tracking-wider text-amber-400">
                {formatValue(leaderboard.entries[2]?.value, activeTab)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
