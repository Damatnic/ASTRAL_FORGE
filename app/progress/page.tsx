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
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  if (error || !data) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="bg-red-500/10 border-2 border-red-500/30 p-6 text-center">
            <div className="text-red-400 font-black uppercase tracking-wider mb-2">Failed to load progress data</div>
            <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Please try refreshing the page</p>
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
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 font-black uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
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
            <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-black uppercase tracking-wider">Recent Achievements</h2>
                </div>
                <Link
                  href="/achievements"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
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
                      className="flex items-start gap-4 p-4 bg-neutral-800/50 border-2 border-neutral-700 hover:border-amber-500/50 transition-colors"
                    >
                      <div className="p-2 bg-amber-500/10 border-2 border-amber-700/20">
                        <Trophy className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-black uppercase tracking-wider mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-neutral-400 line-clamp-2 uppercase tracking-wider font-bold">
                          {achievement.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-wider font-bold">
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
                <div className="text-center py-12 text-neutral-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-black uppercase tracking-wider">No recent achievements</p>
                  <p className="text-sm mt-2 uppercase tracking-wider font-bold">Keep training to earn more trophies!</p>
                </div>
              )}
            </div>

            {/* Recent Workouts */}
            <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-black uppercase tracking-wider">Recent Workouts</h2>
                </div>
                <Link
                  href="/history"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
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
                      className="block p-4 bg-neutral-800/50 border-2 border-neutral-700 hover:border-amber-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-black uppercase tracking-wider">
                          {workout.name || 'Untitled Workout'}
                        </h3>
                        <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold">
                          {new Date(workout.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-neutral-400 flex-wrap uppercase tracking-wider font-bold">
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
                            <span className="text-amber-400 font-black">
                              RPE {workout.avgRPE.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-black uppercase tracking-wider">No workouts yet</p>
                  <p className="text-sm mt-2 uppercase tracking-wider font-bold">Start your fitness journey today!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Goals, Photos, Measurements */}
          <div className="space-y-8">
            {/* Active Goals */}
            <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-black uppercase tracking-wider">Active Goals</h2>
                </div>
                <Link
                  href="/goals"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
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
                      className="p-4 bg-neutral-800/50 border-2 border-neutral-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white font-black uppercase tracking-wider mb-1">
                            {goal.title}
                          </h3>
                          <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">
                            {goal.goalType.replace('_', ' ')}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 border-2 font-black uppercase tracking-wider ${
                            goal.status === 'completed'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {goal.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">
                          <span>
                            {goal.currentValue || 0} / {goal.targetValue}{' '}
                            {goal.unit}
                          </span>
                          <span className="font-black text-amber-400">
                            {goal.progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500"
                            style={{ width: `${Math.min(goal.progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {goal.daysRemaining !== null && (
                        <div className={`text-xs uppercase tracking-wider font-bold ${
                          goal.daysRemaining < 0 
                            ? 'text-red-400' 
                            : goal.daysRemaining < 30 
                            ? 'text-amber-400' 
                            : 'text-neutral-500'
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
                <div className="text-center py-12 text-neutral-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-black uppercase tracking-wider">No active goals</p>
                  <Link
                    href="/goals"
                    className="text-sm text-amber-400 hover:text-amber-300 mt-3 inline-block font-bold uppercase tracking-wider"
                  >
                    Create your first goal →
                  </Link>
                </div>
              )}
            </div>

            {/* Progress Photos */}
            <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-black uppercase tracking-wider">Progress Photos</h2>
                </div>
                <Link
                  href="/progress/photos"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
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
                      className="aspect-square overflow-hidden border-2 border-neutral-700 hover:border-amber-500/50 transition-colors relative group"
                    >
                      <img
                        src={photo.photoUrl}
                        alt={`Progress ${photo.photoType}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-xs text-white p-2">
                          <div className="font-black uppercase tracking-wider mb-1">
                            {new Date(photo.date).toLocaleDateString()}
                          </div>
                          {photo.weight && (
                            <div className="text-neutral-300 uppercase tracking-wider font-bold">
                              {photo.weight} lbs
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-black uppercase tracking-wider">No photos yet</p>
                  <Link
                    href="/progress/photos"
                    className="text-sm text-amber-400 hover:text-amber-300 mt-3 inline-block font-bold uppercase tracking-wider"
                  >
                    Add your first photo →
                  </Link>
                </div>
              )}
            </div>

            {/* Latest Measurements */}
            <div className="bg-neutral-900/50 border-2 border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-black uppercase tracking-wider">Measurements</h2>
                </div>
                <Link
                  href="/measurements"
                  className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider"
                >
                  View Trends
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {quickStats.latestWeight || quickStats.latestBodyFat ? (
                <div className="space-y-3">
                  {quickStats.latestWeight && (
                    <div className="flex items-center justify-between p-3 bg-neutral-800/50 border-2 border-neutral-700">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-amber-400" />
                        <span className="text-neutral-400 uppercase tracking-wider font-bold">Weight</span>
                      </div>
                      <span className="text-white font-black uppercase tracking-wider">
                        {quickStats.latestWeight} lbs
                      </span>
                    </div>
                  )}
                  {quickStats.latestBodyFat && (
                    <div className="flex items-center justify-between p-3 bg-neutral-800/50 border-2 border-neutral-700">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-400" />
                        <span className="text-neutral-400 uppercase tracking-wider font-bold">Body Fat</span>
                      </div>
                      <span className="text-white font-black uppercase tracking-wider">
                        {quickStats.latestBodyFat}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  <Ruler className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-black uppercase tracking-wider">No measurements yet</p>
                  <Link
                    href="/measurements"
                    className="text-sm text-amber-400 hover:text-amber-300 mt-3 inline-block font-bold uppercase tracking-wider"
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
