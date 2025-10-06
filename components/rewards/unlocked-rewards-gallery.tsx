'use client'

import { useState } from 'react'
import { Trophy, Book, Unlock, Award, Search, Filter, X, Calendar, CheckCircle2 } from 'lucide-react'

interface UnlockedReward {
  id: string
  type: 'achievement' | 'template' | 'feature' | 'title'
  name: string
  description: string
  unlockedAt: Date
  source?: string // 'quest' | 'tier' | 'achievement'
}

interface UnlockedRewardsGalleryProps {
  rewards: UnlockedReward[]
  onRewardClick?: (reward: UnlockedReward) => void
}

export function UnlockedRewardsGallery({ rewards, onRewardClick }: UnlockedRewardsGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<UnlockedReward['type'] | 'all'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'type'>('recent')

  // Filter rewards
  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      searchQuery === '' ||
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || reward.type === filterType

    return matchesSearch && matchesType
  })

  // Sort rewards
  const sortedRewards = [...filteredRewards].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.unlockedAt.getTime() - a.unlockedAt.getTime()
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else {
      return a.type.localeCompare(b.type)
    }
  })

  // Stats
  const stats = {
    total: rewards.length,
    achievements: rewards.filter((r) => r.type === 'achievement').length,
    templates: rewards.filter((r) => r.type === 'template').length,
    features: rewards.filter((r) => r.type === 'feature').length,
    titles: rewards.filter((r) => r.type === 'title').length,
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          icon={CheckCircle2}
          color="text-gray-400"
          active={filterType === 'all'}
          onClick={() => setFilterType('all')}
        />
        <StatCard
          label="Achievements"
          value={stats.achievements}
          icon={Trophy}
          color="text-yellow-400"
          active={filterType === 'achievement'}
          onClick={() => setFilterType('achievement')}
        />
        <StatCard
          label="Templates"
          value={stats.templates}
          icon={Book}
          color="text-blue-400"
          active={filterType === 'template'}
          onClick={() => setFilterType('template')}
        />
        <StatCard
          label="Features"
          value={stats.features}
          icon={Unlock}
          color="text-purple-400"
          active={filterType === 'feature'}
          onClick={() => setFilterType('feature')}
        />
        <StatCard
          label="Titles"
          value={stats.titles}
          icon={Award}
          color="text-pink-400"
          active={filterType === 'title'}
          onClick={() => setFilterType('title')}
        />
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              sortBy === 'recent'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Recent</span>
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              sortBy === 'name'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Name</span>
          </button>
          <button
            onClick={() => setSortBy('type')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              sortBy === 'type'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Type</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {sortedRewards.length} of {rewards.length} rewards
        {filterType !== 'all' && ` (${filterType}s only)`}
      </div>

      {/* Rewards grid */}
      {sortedRewards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg mb-2">No rewards found</div>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} onClick={onRewardClick} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
        active
          ? 'bg-gray-900 border-purple-500/50 ring-2 ring-purple-500/20'
          : 'bg-gray-950 border-gray-800 hover:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <div className="text-xs text-gray-500 text-left">{label}</div>
    </button>
  )
}

function RewardCard({
  reward,
  onClick,
}: {
  reward: UnlockedReward
  onClick?: (reward: UnlockedReward) => void
}) {
  const getTypeConfig = (type: UnlockedReward['type']) => {
    switch (type) {
      case 'achievement':
        return {
          icon: Trophy,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          hoverBorder: 'hover:border-yellow-500/60',
        }
      case 'template':
        return {
          icon: Book,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          hoverBorder: 'hover:border-blue-500/60',
        }
      case 'feature':
        return {
          icon: Unlock,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/30',
          hoverBorder: 'hover:border-purple-500/60',
        }
      case 'title':
        return {
          icon: Award,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          borderColor: 'border-pink-500/30',
          hoverBorder: 'hover:border-pink-500/60',
        }
    }
  }

  const config = getTypeConfig(reward.type)
  const Icon = config.icon

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <button
      onClick={() => onClick?.(reward)}
      className={`p-4 rounded-lg border-2 ${config.borderColor} ${config.bgColor} ${
        onClick ? config.hoverBorder + ' hover:scale-105' : ''
      } transition-all text-left w-full`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3 className="font-semibold text-white truncate">{reward.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{reward.description}</p>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className={`px-2 py-0.5 rounded ${config.bgColor} ${config.color} border ${config.borderColor}`}>
              {reward.type}
            </span>
            <span className="text-gray-500">{formatDate(reward.unlockedAt)}</span>
          </div>

          {reward.source && (
            <div className="text-xs text-gray-600">
              Unlocked via: <span className="text-gray-500">{reward.source}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
