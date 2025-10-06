'use client'

import { useEffect, useState } from 'react'
import type { StreakData, Achievement, Milestone } from '@/lib/types'

interface AccountabilityDashboardProps {
  userId: string
}

export function AccountabilityDashboard({ userId }: AccountabilityDashboardProps) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null)
  const [weeklyCompletion, setWeeklyCompletion] = useState<boolean[]>([])
  const [motivationScore, setMotivationScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccountabilityData()
  }, [userId])

  const loadAccountabilityData = async () => {
    try {
      const [streakRes, achievementsRes, milestoneRes, weeklyRes, scoreRes] = await Promise.all([
        fetch(`/api/accountability/streak?userId=${userId}`),
        fetch(`/api/accountability/achievements?userId=${userId}&recent=true`),
        fetch(`/api/accountability/milestone?userId=${userId}`),
        fetch(`/api/accountability/weekly?userId=${userId}`),
        fetch(`/api/accountability/score?userId=${userId}`),
      ])

      const [streakData, achievementsData, milestoneData, weeklyData, scoreData] = await Promise.all([
        streakRes.json(),
        achievementsRes.json(),
        milestoneRes.json(),
        weeklyRes.json(),
        scoreRes.json(),
      ])

      setStreak(streakData)
      setRecentAchievements(achievementsData)
      setNextMilestone(milestoneData)
      setWeeklyCompletion(weeklyData)
      setMotivationScore(scoreData.score)
    } catch (error) {
      console.error('Failed to load accountability data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <div className="bg-gradient-to-r from-astral-purple via-astral-blue to-astral-purple rounded-xl p-6 card-hover">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 mb-1">Current Streak</p>
            <p className="text-5xl font-bold mb-2">{streak?.current || 0} days</p>
            <p className="text-sm opacity-80">
              Personal Best: {streak?.longest || 0} days
            </p>
          </div>
          <div className="text-6xl">
            {(streak?.current || 0) > 0 ? '🔥' : '💪'}
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-1 text-xs sm:gap-2 sm:text-sm">
          {weekDays.map((day, idx) => (
            <div key={day} className="text-center">
              <div className="text-xs text-gray-400 mb-2">{day}</div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto ${
                  weeklyCompletion[idx]
                    ? 'bg-gradient-to-r from-astral-blue to-astral-purple'
                    : 'bg-gray-700'
                }`}
              >
                {weeklyCompletion[idx] ? '✓' : '·'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Score */}
      <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Motivation Score</h3>
          <span className="text-3xl font-bold text-astral-blue">{motivationScore}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-astral-blue to-astral-purple h-3 rounded-full transition-all duration-1000"
            style={{ width: `${motivationScore}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {motivationScore >= 80
            ? 'You\'re on fire! Keep up the amazing work! 🔥'
            : motivationScore >= 60
            ? 'Great momentum! You\'re building strong habits. 💪'
            : motivationScore >= 40
            ? 'Good start! Keep showing up consistently. 🌱'
            : 'Let\'s build that momentum together! 🚀'}
        </p>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg"
              >
                <div className="text-2xl">
                  {achievement.type === 'pr' && '🏆'}
                  {achievement.type === 'streak' && '🔥'}
                  {achievement.type === 'volume' && '💪'}
                  {achievement.type === 'consistency' && '⭐'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(achievement.earnedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-astral-gray rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Next Milestone</h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400">{nextMilestone.description}</p>
            <p className="text-2xl font-bold text-astral-blue">
              {nextMilestone.progress}/{nextMilestone.target}
            </p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-astral-blue to-astral-purple h-3 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, (nextMilestone.progress / nextMilestone.target) * 100)}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {nextMilestone.target - nextMilestone.progress} more to go!
          </p>
        </div>
      )}
    </div>
  )
}


