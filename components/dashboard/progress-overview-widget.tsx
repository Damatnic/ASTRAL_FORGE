'use client'

/**
 * Progress Overview Widget
 * Shows weekly/monthly stats and trends
 */

import React from 'react'
import Link from 'next/link'
import { Widget } from './widget'

interface ProgressOverviewProps {
  weeklyWorkouts?: number
  currentStreak?: number
  totalVolume?: number // in kg
  personalRecords?: number
  className?: string
}

export function ProgressOverviewWidget({
  weeklyWorkouts = 0,
  currentStreak = 0,
  totalVolume = 0,
  personalRecords = 0,
  className,
}: ProgressOverviewProps) {
  const stats = [
    {
      label: 'Workouts',
      value: weeklyWorkouts,
      unit: 'this week',
      icon: '💪',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      label: 'Streak',
      value: currentStreak,
      unit: 'days',
      icon: '🔥',
      color: 'from-orange-400 to-red-400',
    },
    {
      label: 'Volume',
      value: totalVolume.toLocaleString(),
      unit: 'kg total',
      icon: '📊',
      color: 'from-purple-400 to-pink-400',
    },
    {
      label: 'PRs',
      value: personalRecords,
      unit: 'this month',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-400',
    },
  ]

  return (
    <Widget
      title="Progress Overview"
      icon="📈"
      variant="default"
      className={className}
      actions={
        <Link
          href="/analytics"
          className="text-sm text-astral-blue hover:text-astral-purple transition-colors"
        >
          View All →
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-astral-dark/50 rounded-lg p-4 border border-astral-light/30 hover:border-astral-light/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-xs text-gray-400 uppercase font-semibold">
                {stat.label}
              </span>
            </div>
            <div className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stat.unit}</div>
          </div>
        ))}
      </div>

      {/* Trend Indicator */}
      <div className="mt-4 pt-4 border-t border-astral-light/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Weekly Trend</span>
          <div className="flex items-center gap-2 text-green-400">
            <span>↗</span>
            <span className="font-semibold">+12%</span>
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default ProgressOverviewWidget
