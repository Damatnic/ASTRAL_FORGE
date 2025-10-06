'use client'

import { TrainingMetrics } from '@/lib/training-metrics'
import { Activity, TrendingUp, Target, Heart, Zap, Award, ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface TrainingMetricsDashboardProps {
  metrics: TrainingMetrics
}

export function TrainingMetricsDashboard({ metrics }: TrainingMetricsDashboardProps) {
  const { totalVolume, estimated1RMs, consistency, recovery, progressionRate, summary } = metrics

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Training Performance</h3>
            <p className="text-sm text-gray-400">Overall Score</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-400">{summary.overallScore}</div>
            <div className="text-sm text-gray-400">/ 100</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${summary.overallScore}%` }}
          />
        </div>

        {/* Strengths & Improvements */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-green-400 mb-2">Strengths</p>
            {summary.strengths.map((strength, i) => (
              <p key={i} className="text-sm text-gray-300">• {strength}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-yellow-400 mb-2">Areas to Improve</p>
            {summary.improvements.map((improvement, i) => (
              <p key={i} className="text-sm text-gray-300">• {improvement}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Volume */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold">Training Volume</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {(totalVolume.weeklyTotal / 1000).toFixed(1)}k <span className="text-sm text-gray-400">kg</span>
              </p>
              <p className="text-xs text-gray-400">This Week</p>
            </div>
            
            <div className="flex items-center gap-2">
              {totalVolume.trend === 'increasing' && <ArrowUp className="w-4 h-4 text-green-400" />}
              {totalVolume.trend === 'decreasing' && <ArrowDown className="w-4 h-4 text-red-400" />}
              {totalVolume.trend === 'stable' && <Minus className="w-4 h-4 text-yellow-400" />}
              <span className={`text-sm ${
                totalVolume.trend === 'increasing' ? 'text-green-400' :
                totalVolume.trend === 'decreasing' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {totalVolume.percentChange > 0 ? '+' : ''}{totalVolume.percentChange}% vs last month
              </span>
            </div>

            {/* Breakdown */}
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Breakdown</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>Push: {(totalVolume.breakdown.push / 1000).toFixed(1)}k kg</div>
                <div>Pull: {(totalVolume.breakdown.pull / 1000).toFixed(1)}k kg</div>
                <div>Legs: {(totalVolume.breakdown.legs / 1000).toFixed(1)}k kg</div>
                <div>Acc: {(totalVolume.breakdown.accessories / 1000).toFixed(1)}k kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1RM Total */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold">Estimated 1RM Total</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-purple-400">
                {estimated1RMs.total} <span className="text-sm text-gray-400">kg</span>
              </p>
              <p className="text-xs text-gray-400">Bench + Squat + Deadlift</p>
            </div>

            {/* Individual lifts */}
            <div className="space-y-1 text-sm">
              {estimated1RMs.benchPress && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Bench:</span>
                  <div className="flex items-center gap-2">
                    <span>{estimated1RMs.benchPress} kg</span>
                    {estimated1RMs.trends.benchPress !== 0 && (
                      <span className={`text-xs ${estimated1RMs.trends.benchPress > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {estimated1RMs.trends.benchPress > 0 ? '+' : ''}{estimated1RMs.trends.benchPress}%
                      </span>
                    )}
                  </div>
                </div>
              )}
              {estimated1RMs.squat && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Squat:</span>
                  <div className="flex items-center gap-2">
                    <span>{estimated1RMs.squat} kg</span>
                    {estimated1RMs.trends.squat !== 0 && (
                      <span className={`text-xs ${estimated1RMs.trends.squat > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {estimated1RMs.trends.squat > 0 ? '+' : ''}{estimated1RMs.trends.squat}%
                      </span>
                    )}
                  </div>
                </div>
              )}
              {estimated1RMs.deadlift && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadlift:</span>
                  <div className="flex items-center gap-2">
                    <span>{estimated1RMs.deadlift} kg</span>
                    {estimated1RMs.trends.deadlift !== 0 && (
                      <span className={`text-xs ${estimated1RMs.trends.deadlift > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {estimated1RMs.trends.deadlift > 0 ? '+' : ''}{estimated1RMs.trends.deadlift}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {estimated1RMs.wilksScore && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400">Wilks Score: <span className="text-white">{estimated1RMs.wilksScore}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Consistency */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold">Consistency</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {consistency.weeklyRate}%
              </p>
              <p className="text-xs text-gray-400">Weekly Adherence</p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Streak:</span>
                <span className="font-semibold">{consistency.currentStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Workouts:</span>
                <span className="font-semibold">{consistency.totalWorkouts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Duration:</span>
                <span className="font-semibold">{consistency.averageSessionDuration} min</span>
              </div>
            </div>

            {consistency.missedWorkouts > 0 && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-yellow-400">
                  {consistency.missedWorkouts} missed workout{consistency.missedWorkouts !== 1 ? 's' : ''} this month
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recovery */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-400" />
            <h4 className="font-semibold">Recovery</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-red-400">
                {recovery.score}
              </p>
              <p className="text-xs text-gray-400">Recovery Score</p>
            </div>

            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  recovery.score >= 80 ? 'bg-green-500' :
                  recovery.score >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${recovery.score}%` }}
              />
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Rest:</span>
                <span className="font-semibold">{recovery.averageRestBetweenSessions}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${recovery.adequateRecovery ? 'text-green-400' : 'text-yellow-400'}`}>
                  {recovery.adequateRecovery ? 'Adequate' : 'Needs Rest'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Overtraining Risk:</span>
                <span className={`font-semibold ${
                  recovery.overtrainingRisk === 'low' ? 'text-green-400' :
                  recovery.overtrainingRisk === 'moderate' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {recovery.overtrainingRisk}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold">Progressive Overload</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {progressionRate.onTrack ? '✓' : '✗'}
              </p>
              <p className="text-xs text-gray-400">
                {progressionRate.onTrack ? 'On Track' : 'Needs Attention'}
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Volume Growth:</span>
                <span className={`font-semibold ${progressionRate.volumeGrowthRate > 0 ? 'text-green-400' : 'text-gray-300'}`}>
                  {progressionRate.volumeGrowthRate > 0 ? '+' : ''}{progressionRate.volumeGrowthRate}%/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Strength Growth:</span>
                <span className={`font-semibold ${progressionRate.strengthGrowthRate > 0 ? 'text-green-400' : 'text-gray-300'}`}>
                  {progressionRate.strengthGrowthRate > 0 ? '+' : ''}{progressionRate.strengthGrowthRate}%/mo
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400">{progressionRate.timeToNextMilestone}</p>
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold">Goal Progress</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Weekly Goal</span>
                <span className="text-sm font-semibold">{summary.weeklyGoalProgress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${summary.weeklyGoalProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Monthly Goal</span>
                <span className="text-sm font-semibold">{summary.monthlyGoalProgress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${summary.monthlyGoalProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
