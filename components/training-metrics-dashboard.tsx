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
      <div className="bg-amber-950/30 border-2 border-amber-800/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black mb-1 uppercase tracking-wider">Battle Performance</h3>
            <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Overall Score</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-amber-400">{summary.overallScore}</div>
            <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold">/ 100</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-neutral-900 border-2 border-neutral-800 overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all duration-500"
            style={{ width: `${summary.overallScore}%` }}
          />
        </div>

        {/* Strengths & Improvements */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-black text-amber-400 mb-2 uppercase tracking-wider">Strengths</p>
            {summary.strengths.map((strength, i) => (
              <p key={i} className="text-sm text-neutral-300">• {strength}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-black text-amber-400 mb-2 uppercase tracking-wider">Areas to Improve</p>
            {summary.improvements.map((improvement, i) => (
              <p key={i} className="text-sm text-neutral-300">• {improvement}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Volume */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-amber-400" />
            <h4 className="font-black uppercase tracking-wider">Battle Volume</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-black text-amber-400">
                {(totalVolume.weeklyTotal / 1000).toFixed(1)}k <span className="text-sm text-neutral-400 uppercase tracking-wider font-bold">kg</span>
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">This Week</p>
            </div>
            
            <div className="flex items-center gap-2">
              {totalVolume.trend === 'increasing' && <ArrowUp className="w-4 h-4 text-amber-400" />}
              {totalVolume.trend === 'decreasing' && <ArrowDown className="w-4 h-4 text-amber-400" />}
              {totalVolume.trend === 'stable' && <Minus className="w-4 h-4 text-amber-400" />}
              <span className="text-sm text-amber-400 uppercase tracking-wider font-bold">
                {totalVolume.percentChange > 0 ? '+' : ''}{totalVolume.percentChange}% vs last month
              </span>
            </div>

            {/* Breakdown */}
            <div className="pt-2 border-t-2 border-neutral-800">
              <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Breakdown</p>
              <div className="grid grid-cols-2 gap-1 text-xs uppercase tracking-wider font-bold">
                <div>Push: {(totalVolume.breakdown.push / 1000).toFixed(1)}k kg</div>
                <div>Pull: {(totalVolume.breakdown.pull / 1000).toFixed(1)}k kg</div>
                <div>Legs: {(totalVolume.breakdown.legs / 1000).toFixed(1)}k kg</div>
                <div>Acc: {(totalVolume.breakdown.accessories / 1000).toFixed(1)}k kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1RM Total */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="font-black uppercase tracking-wider">Estimated 1RM Total</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-black text-amber-400">
                {estimated1RMs.total} <span className="text-sm text-neutral-400 uppercase tracking-wider font-bold">kg</span>
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Bench + Squat + Deadlift</p>
            </div>

            {/* Individual lifts */}
            <div className="space-y-1 text-sm">
              {estimated1RMs.benchPress && (
                <div className="flex justify-between">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">Bench:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{estimated1RMs.benchPress} kg</span>
                    {estimated1RMs.trends.benchPress !== 0 && (
                      <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">
                        {estimated1RMs.trends.benchPress > 0 ? '+' : ''}{estimated1RMs.trends.benchPress}%
                      </span>
                    )}
                  </div>
                </div>
              )}
              {estimated1RMs.squat && (
                <div className="flex justify-between">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">Squat:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{estimated1RMs.squat} kg</span>
                    {estimated1RMs.trends.squat !== 0 && (
                      <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">
                        {estimated1RMs.trends.squat > 0 ? '+' : ''}{estimated1RMs.trends.squat}%
                      </span>
                    )}
                  </div>
                </div>
              )}
              {estimated1RMs.deadlift && (
                <div className="flex justify-between">
                  <span className="text-neutral-400 uppercase tracking-wider font-bold">Deadlift:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{estimated1RMs.deadlift} kg</span>
                    {estimated1RMs.trends.deadlift !== 0 && (
                      <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">
                        {estimated1RMs.trends.deadlift > 0 ? '+' : ''}{estimated1RMs.trends.deadlift}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {estimated1RMs.wilksScore && (
              <div className="pt-2 border-t-2 border-neutral-800">
                <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Wilks Score: <span className="text-white font-black">{estimated1RMs.wilksScore}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Consistency */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-amber-400" />
            <h4 className="font-semibold">Consistency</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-black text-amber-400 uppercase tracking-wider">
                {consistency.weeklyRate}%
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Weekly Adherence</p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Current Streak:</span>
                <span className="font-black">{consistency.currentStreak} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Total Workouts:</span>
                <span className="font-black">{consistency.totalWorkouts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Avg Duration:</span>
                <span className="font-black">{consistency.averageSessionDuration} min</span>
              </div>
            </div>

            {consistency.missedWorkouts > 0 && (
              <div className="pt-2 border-t-2 border-neutral-700">
                <p className="text-xs text-amber-400 font-black uppercase tracking-wider">
                  {consistency.missedWorkouts} MISSED BATTLE{consistency.missedWorkouts !== 1 ? 'S' : ''} THIS MONTH
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recovery */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-400" />
            <h4 className="font-black uppercase tracking-wider">RECOVERY</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-black text-red-400 uppercase tracking-wider">
                {recovery.score}
              </p>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">RECOVERY SCORE</p>
            </div>

            <div className="h-2 bg-neutral-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  recovery.score >= 80 ? 'bg-amber-500' :
                  recovery.score >= 60 ? 'bg-amber-600' :
                  'bg-red-500'
                }`}
                style={{ width: `${recovery.score}%` }}
              />
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Avg Rest:</span>
                <span className="font-black">{recovery.averageRestBetweenSessions}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Status:</span>
                <span className={`font-black ${recovery.adequateRecovery ? 'text-amber-400' : 'text-amber-400'}`}>
                  {recovery.adequateRecovery ? 'Adequate' : 'Needs Rest'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 uppercase tracking-wider font-bold">Overtraining Risk:</span>
                <span className={`font-black ${
                  recovery.overtrainingRisk === 'low' ? 'text-amber-400' :
                  recovery.overtrainingRisk === 'moderate' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {recovery.overtrainingRisk}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h4 className="font-black uppercase tracking-wider">PROGRESSIVE OVERLOAD</h4>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-black text-amber-400 uppercase tracking-wider">
                {progressionRate.onTrack ? '✓' : '✗'}
              </p>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                {progressionRate.onTrack ? 'ON TRACK' : 'NEEDS ATTENTION'}
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider">VOLUME GROWTH:</span>
                <span className={`font-black uppercase tracking-wider ${progressionRate.volumeGrowthRate > 0 ? 'text-amber-400' : 'text-neutral-300'}`}>
                  {progressionRate.volumeGrowthRate > 0 ? '+' : ''}{progressionRate.volumeGrowthRate}%/MO
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider">STRENGTH GROWTH:</span>
                <span className={`font-black uppercase tracking-wider ${progressionRate.strengthGrowthRate > 0 ? 'text-amber-400' : 'text-neutral-300'}`}>
                  {progressionRate.strengthGrowthRate > 0 ? '+' : ''}{progressionRate.strengthGrowthRate}%/MO
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-700">
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{progressionRate.timeToNextMilestone}</p>
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h4 className="font-black uppercase tracking-wider">GOAL PROGRESS</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-400 font-bold uppercase tracking-wider">WEEKLY GOAL</span>
                <span className="text-sm font-black uppercase tracking-wider">{summary.weeklyGoalProgress}%</span>
              </div>
              <div className="h-2 bg-neutral-700 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${summary.weeklyGoalProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-neutral-400 font-bold uppercase tracking-wider">MONTHLY GOAL</span>
                <span className="text-sm font-black uppercase tracking-wider">{summary.monthlyGoalProgress}%</span>
              </div>
              <div className="h-2 bg-neutral-700 overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-500"
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
