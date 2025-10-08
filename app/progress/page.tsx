'use client'

import { useProgress } from '@/hooks/use-data'
import Link from 'next/link'
import { AppLayout, PageContainer, PageHeader } from '@/components/layout'
import {
  Trophy,
  TrendingUp,
  Target,
  Camera,
  Ruler,
  Dumbbell,
  Calendar,
  Award,
  ChevronRight,
  Loader2,
  BarChart3,
  Activity,
  Flame,
  Image as ImageIcon,
} from 'lucide-react'

export default function ProgressPage() {
  const { data, loading, error } = useProgress()

  if (loading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  if (error || !data) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <div className="text-red-400 font-semibold mb-2">Failed to load progress data</div>
            <p className="text-sm text-gray-400">Please try refreshing the page</p>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  const {
    quickStats,
    recentAchievements,
    goalProgress,
    progressPhotos,
    measurementTrends: _measurementTrends,
    recentWorkouts,
  } = data

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="Progress Hub"
          description="Track your journey, celebrate achievements, and reach your goals"
          action={
            <Link
              href="/progress/photos"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Add Photo
            </Link>
          }
        />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Workouts */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Dumbbell className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {quickStats.totalWorkouts}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Total Battles</div>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {quickStats.currentStreak}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
                  Day Streak • Best: {quickStats.longestStreak}
                </div>
              </div>
            </div>
          </div>

          {/* Total Volume */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {(quickStats.totalVolume / 1000).toFixed(1)}k
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Volume (90d) lbs</div>
              </div>
            </div>
          </div>

          {/* Recent PRs */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-950/50 border-2 border-amber-800/50">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                  {quickStats.recentPRs}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">PRs (30 days)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Achievements & Workouts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Achievements */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold">Recent Achievements</h2>
                </div>
                <Link
                  href="/achievements"
                  className="text-sm text-blue-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {recentAchievements.map((achievement: any) => (
                    <div
                      key={achievement.id}
                      className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500/50 transition-colors"
                    >
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {achievement.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                          <span className="capitalize">{achievement.type}</span>
                          <span>•</span>
                          <span>
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No recent achievements</p>
                  <p className="text-sm mt-2">Keep training to earn more trophies!</p>
                </div>
              )}
            </div>

            {/* Recent Workouts */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Recent Workouts</h2>
                </div>
                <Link
                  href="/history"
                  className="text-sm text-blue-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  View History
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {recentWorkouts.length > 0 ? (
                <div className="space-y-3">
                  {recentWorkouts.map((workout: any) => (
                    <Link
                      key={workout.id}
                      href={`/history/${workout.id}`}
                      className="block p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">
                          {workout.name || 'Untitled Workout'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          {workout.exercises} exercises
                        </span>
                        <span>•</span>
                        <span>{workout.totalSets} sets</span>
                        <span>•</span>
                        <span>
                          {(workout.totalVolume / 1000).toFixed(1)}k lbs
                        </span>
                        {workout.avgRPE && (
                          <>
                            <span>•</span>
                            <span className="text-orange-400 font-medium">
                              RPE {workout.avgRPE.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No workouts yet</p>
                  <p className="text-sm mt-2">Start your fitness journey today!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Goals, Photos, Measurements */}
          <div className="space-y-8">
            {/* Active Goals */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold">Active Goals</h2>
                </div>
                <Link
                  href="/goals"
                  className="text-sm text-blue-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  Manage
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {goalProgress.length > 0 ? (
                <div className="space-y-4">
                  {goalProgress.slice(0, 3).map((goal: any) => (
                    <div
                      key={goal.id}
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">
                            {goal.title}
                          </h3>
                          <p className="text-xs text-gray-400 capitalize">
                            {goal.goalType.replace('_', ' ')}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            goal.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {goal.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>
                            {goal.currentValue || 0} / {goal.targetValue}{' '}
                            {goal.unit}
                          </span>
                          <span className="font-medium text-blue-400">
                            {goal.progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${Math.min(goal.progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {goal.daysRemaining !== null && (
                        <div className={`text-xs ${
                          goal.daysRemaining < 0 
                            ? 'text-red-400' 
                            : goal.daysRemaining < 30 
                            ? 'text-orange-400' 
                            : 'text-gray-500'
                        }`}>
                          {goal.daysRemaining > 0
                            ? `${goal.daysRemaining} days remaining`
                            : goal.daysRemaining === 0
                            ? 'Due today!'
                            : `${Math.abs(goal.daysRemaining)} days overdue`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No active goals</p>
                  <Link
                    href="/goals"
                    className="text-sm text-blue-400 hover:text-purple-400 mt-3 inline-block"
                  >
                    Create your first goal →
                  </Link>
                </div>
              )}
            </div>

            {/* Progress Photos */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold">Progress Photos</h2>
                </div>
                <Link
                  href="/progress/photos"
                  className="text-sm text-blue-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {progressPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {progressPhotos.slice(0, 6).map((photo: any) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-lg overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-colors relative group"
                    >
                      <img
                        src={photo.photoUrl}
                        alt={`Progress ${photo.photoType}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-xs text-white p-2">
                          <div className="font-medium mb-1">
                            {new Date(photo.date).toLocaleDateString()}
                          </div>
                          {photo.weight && (
                            <div className="text-gray-300">
                              {photo.weight} lbs
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No photos yet</p>
                  <Link
                    href="/progress/photos"
                    className="text-sm text-blue-400 hover:text-purple-400 mt-3 inline-block"
                  >
                    Add your first photo →
                  </Link>
                </div>
              )}
            </div>

            {/* Latest Measurements */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold">Measurements</h2>
                </div>
                <Link
                  href="/measurements"
                  className="text-sm text-blue-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  View Trends
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {quickStats.latestWeight || quickStats.latestBodyFat ? (
                <div className="space-y-3">
                  {quickStats.latestWeight && (
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-400">Weight</span>
                      </div>
                      <span className="text-white font-semibold">
                        {quickStats.latestWeight} lbs
                      </span>
                    </div>
                  )}
                  {quickStats.latestBodyFat && (
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="text-gray-400">Body Fat</span>
                      </div>
                      <span className="text-white font-semibold">
                        {quickStats.latestBodyFat}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Ruler className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No measurements yet</p>
                  <Link
                    href="/measurements"
                    className="text-sm text-blue-400 hover:text-purple-400 mt-3 inline-block"
                  >
                    Track your progress →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
