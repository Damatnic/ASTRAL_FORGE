'use client'

/**
 * ACTIVITY FEED - Phase 2
 * Live feed showing recent PRs, achievements, friend activities, and guild updates
 * Gaming-style notifications with icons and animations
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  Trophy, 
  Users, 
  Swords, 
  Zap,
  Award,
  Target,
  Heart,
  Clock
} from 'lucide-react'

export type ActivityType = 'pr' | 'achievement' | 'friend' | 'guild' | 'milestone' | 'challenge'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  userId?: string
  userName?: string
  metadata?: Record<string, unknown>
}

interface ActivityFeedProps {
  activities?: Activity[]
  maxItems?: number
  className?: string
}

export function ActivityFeed({ 
  activities = [],
  maxItems = 10,
  className = '' 
}: ActivityFeedProps) {
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Animate activities in one by one
    if (activities.length > 0) {
      const sorted = [...activities].sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      ).slice(0, maxItems)
      
      setVisibleActivities(sorted)
    } else {
      // Mock data for demo
      setVisibleActivities(generateMockActivities())
    }
  }, [activities, maxItems])

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'pr':
        return <TrendingUp className="w-5 h-5" />
      case 'achievement':
        return <Trophy className="w-5 h-5" />
      case 'friend':
        return <Users className="w-5 h-5" />
      case 'guild':
        return <Swords className="w-5 h-5" />
      case 'milestone':
        return <Award className="w-5 h-5" />
      case 'challenge':
        return <Target className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'pr':
        return 'text-green-400 bg-green-500/20 border-green-500/50'
      case 'achievement':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/50'
      case 'friend':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/50'
      case 'guild':
        return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'milestone':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/50'
      case 'challenge':
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-gray-700 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Activity Feed</h3>
        </div>
        <Link 
          href="/social"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {visibleActivities.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-gray-600 text-sm">Start working out to see updates!</p>
          </div>
        ) : (
          visibleActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="group relative bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-800/70 transition-all cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg border ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {activity.description}
                  </p>

                  {/* User info if available */}
                  {activity.userName && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {activity.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-500">{activity.userName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
          ))
        )}
      </div>

      {/* Footer - Quick Actions */}
      {visibleActivities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex gap-2">
            <Link
              href="/achievements"
              className="flex-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-2 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition-colors text-center"
            >
              🏆 Achievements
            </Link>
            <Link
              href="/social"
              className="flex-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors text-center"
            >
              👥 Friends
            </Link>
            <Link
              href="/guild"
              className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors text-center"
            >
              ⚔️ Guild
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Generate mock activities for demo
function generateMockActivities(): Activity[] {
  const now = new Date()
  return [
    {
      id: '1',
      type: 'pr',
      title: 'New Personal Record! 🔥',
      description: 'Bench Press: 225 lbs x 5 reps (+10 lbs)',
      timestamp: new Date(now.getTime() - 1000 * 60 * 5), // 5 min ago
      userName: 'You'
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: '"Iron Warrior" - Complete 100 total workouts',
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 min ago
    },
    {
      id: '3',
      type: 'friend',
      title: 'Friend Activity',
      description: 'Alex completed "Leg Day Destroyer" workout',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
      userName: 'Alex'
    },
    {
      id: '4',
      type: 'milestone',
      title: 'Milestone Reached! 🎯',
      description: 'Hit 50,000 total pounds lifted this month',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
    {
      id: '5',
      type: 'guild',
      title: 'Guild Challenge',
      description: 'Iron Brotherhood is ranked #3 in weekly leaderboard',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      userName: 'Guild Leader'
    },
  ]
}
