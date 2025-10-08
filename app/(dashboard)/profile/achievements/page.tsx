'use client'

import { useAchievements } from '@/hooks/use-data'
import { Card, Button } from '@/components/ui'
import Link from 'next/link'
import { ArrowLeft, Trophy, Lock, CheckCircle2 } from 'lucide-react'

export default function AchievementsPage() {
  const { data: achievements, loading } = useAchievements()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-neutral-400 uppercase tracking-wider font-bold">Loading achievements...</p>
          </div>
        </div>
      </div>
    )
  }

  const unlockedCount = achievements?.filter((a: any) => a.isUnlocked).length || 0
  const totalCount = achievements?.length || 0
  const completionPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  // Group achievements by category
  const workoutAchievements = achievements?.filter((a: any) => 
    a.achievementId.startsWith('workout_') || a.achievementId === 'first_workout'
  ) || []
  
  const streakAchievements = achievements?.filter((a: any) => 
    a.achievementId.startsWith('streak_')
  ) || []
  
  const prAchievements = achievements?.filter((a: any) => 
    a.achievementId.startsWith('pr_')
  ) || []
  
  const volumeAchievements = achievements?.filter((a: any) => 
    a.achievementId.startsWith('volume_')
  ) || []
  
  const specialAchievements = achievements?.filter((a: any) => 
    !a.achievementId.startsWith('workout_') &&
    !a.achievementId.startsWith('streak_') &&
    !a.achievementId.startsWith('pr_') &&
    !a.achievementId.startsWith('volume_') &&
    a.achievementId !== 'first_workout'
  ) || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/profile">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-amber-400 to-amber-500 text-transparent bg-clip-text mb-2 uppercase tracking-wider">
          Achievements
        </h1>
        <p className="text-neutral-400 uppercase tracking-wider font-bold">Track your training milestones and accomplishments</p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-wider">Your Progress</h2>
            <p className="text-neutral-400 uppercase tracking-wider font-bold">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-amber-400 uppercase tracking-wider">{Math.round(completionPercent)}%</div>
            <p className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Complete</p>
          </div>
        </div>
        <div className="w-full bg-neutral-700 h-3">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-500 h-3 transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </Card>

      {/* Achievement Categories */}
      <div className="space-y-8">
        {/* Workout Milestones */}
        {workoutAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Trophy className="w-6 h-6 text-amber-400" />
              Workout Milestones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutAchievements.map((achievement: any) => (
                <AchievementCard key={achievement.achievementId} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Streak Achievements */}
        {streakAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🔥 Streak Masters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streakAchievements.map((achievement: any) => (
                <AchievementCard key={achievement.achievementId} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* PR Achievements */}
        {prAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              📈 Personal Records
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prAchievements.map((achievement: any) => (
                <AchievementCard key={achievement.achievementId} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Volume Achievements */}
        {volumeAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🏋️ Volume Kings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volumeAchievements.map((achievement: any) => (
                <AchievementCard key={achievement.achievementId} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Special Achievements */}
        {specialAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              ⭐ Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialAchievements.map((achievement: any) => (
                <AchievementCard key={achievement.achievementId} achievement={achievement} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: any }) {
  const isUnlocked = achievement.isUnlocked
  const hasProgress = achievement.progress !== undefined && achievement.total !== undefined
  const progressPercent = hasProgress ? (achievement.progress / achievement.total) * 100 : 0

  return (
    <Card
      className={`p-4 ${
        isUnlocked
          ? 'bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-2 border-amber-500/50'
          : 'bg-neutral-800/50 border-2 border-neutral-700'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`text-4xl ${
            !isUnlocked ? 'opacity-30 grayscale' : ''
          }`}
        >
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-black uppercase tracking-wider ${isUnlocked ? 'text-amber-300' : 'text-neutral-400'}`}>
              {achievement.title}
            </h3>
            {isUnlocked ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-neutral-600 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-neutral-400 mt-1 uppercase tracking-wider font-bold">{achievement.description}</p>
        </div>
      </div>

      {isUnlocked ? (
        <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      ) : hasProgress ? (
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-500 uppercase tracking-wider font-bold">Progress</span>
            <span className="text-neutral-400 uppercase tracking-wider font-bold">
              {achievement.progress} / {achievement.total}
            </span>
          </div>
          <div className="w-full bg-neutral-700 h-2">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-500 h-2 transition-all"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-neutral-600 uppercase tracking-wider font-bold">Not yet unlocked</p>
      )}
    </Card>
  )
}
