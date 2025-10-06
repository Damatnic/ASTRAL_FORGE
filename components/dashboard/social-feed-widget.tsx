'use client'

/**
 * Social Feed Widget
 * Shows recent activity from guild/friends
 */

import React from 'react'
import Link from 'next/link'
import { Widget } from './widget'

interface SocialActivity {
  id: string
  userName: string
  userAvatar?: string
  action: string
  details: string
  timestamp: Date
  type: 'workout' | 'achievement' | 'pr' | 'challenge'
}

interface SocialFeedWidgetProps {
  activities?: SocialActivity[]
  className?: string
}

const activityIcons = {
  workout: '💪',
  achievement: '🏆',
  pr: '⭐',
  challenge: '🎯',
}

const activityColors = {
  workout: 'text-blue-400',
  achievement: 'text-yellow-400',
  pr: 'text-purple-400',
  challenge: 'text-green-400',
}

export function SocialFeedWidget({
  activities = [],
  className,
}: SocialFeedWidgetProps) {
  // Show most recent 4 activities
  const recentActivities = activities.slice(0, 4)

  // Format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <Widget
      title="Guild Activity"
      icon="👥"
      variant="default"
      className={className}
      actions={
        <Link
          href="/guild"
          className="text-sm text-astral-blue hover:text-astral-purple transition-colors"
        >
          View All →
        </Link>
      }
    >
      {recentActivities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">👋</div>
          <p className="text-gray-400 text-sm mb-2">No recent activity</p>
          <p className="text-gray-500 text-xs mb-4">
            Join a guild to see your friends' progress
          </p>
          <Link
            href="/guild"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Find a Guild
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-astral-dark/50 rounded-lg p-3 border border-astral-light/30 hover:border-astral-light/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-astral-blue to-astral-purple flex items-center justify-center text-white font-bold text-sm">
                  {activity.userAvatar || activity.userName.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {activity.userName}
                      </span>
                      <span className={`text-lg ${activityColors[activity.type]}`}>
                        {activityIcons[activity.type]}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Online Members Count */}
      {recentActivities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-astral-light/30">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-400">5 members online</span>
            </div>
            <Link
              href="/guild/chat"
              className="text-astral-blue hover:text-astral-purple transition-colors font-semibold"
            >
              Chat →
            </Link>
          </div>
        </div>
      )}
    </Widget>
  )
}

export default SocialFeedWidget
