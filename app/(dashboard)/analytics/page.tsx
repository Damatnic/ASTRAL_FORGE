'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ChartSkeleton } from '@/components/chart-skeleton';
import { ProgressOverview } from '@/components/analytics/progress-overview';

// Dynamic imports for chart components (performance optimization)
const PerformanceComparison = dynamic(() => import('@/components/analytics/performance-comparison'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const WeeklyPerformance = dynamic(() => import('@/components/analytics/weekly-performance'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const TrainingLoadChart = dynamic(() => import('@/components/analytics/training-load'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const RecoveryMetrics = dynamic(() => import('@/components/analytics/recovery-metrics'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const WorkoutTimeline = dynamic(() => import('@/components/analytics/workout-timeline'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const ExerciseLeaderboard = dynamic(() => import('@/components/analytics/exercise-leaderboard'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const ExerciseRadar = dynamic(() => import('@/components/analytics/exercise-radar'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const MuscleGroupAnalysis = dynamic(() => import('@/components/analytics/muscle-group-analysis'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const ProgressiveOverloadTracker = dynamic(() => import('@/components/analytics/progressive-overload-tracker'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const VolumeLoadProgression = dynamic(() => import('@/components/analytics/volume-load-progression'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const AIInsights = dynamic(() => import('@/components/analytics/ai-insights'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const StrengthProgressionChart = dynamic(
  () => import('@/components/analytics/strength-progression-chart').then(mod => ({ default: mod.StrengthProgressionChart })),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const VolumeAnalysis = dynamic(
  () => import('@/components/analytics/volume-analysis').then(mod => ({ default: mod.VolumeAnalysis })),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const ConsistencyHeatmap = dynamic(() => import('@/components/analytics/consistency-heatmap'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const PersonalRecordsTimeline = dynamic(() => import('@/components/analytics/personal-records-timeline'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

const TrainingDistribution = dynamic(() => import('@/components/analytics/training-distribution'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Advanced Analytics</h1>
              <p className="text-gray-400 mt-1">Deep insights into your training progress</p>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">
                Track your strength gains, volume trends, and consistency patterns to optimize your training
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Sections */}
        <div className="space-y-8">
          {/* Progress Overview */}
          <section>
            <ProgressOverview />
          </section>

          {/* Performance Comparison */}
          <section>
            <PerformanceComparison />
          </section>

          {/* Strength & Volume Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Strength Progression */}
            <section>
              <StrengthProgressionChart />
            </section>

            {/* Volume Analysis */}
            <section>
              <VolumeAnalysis />
            </section>
          </div>

          {/* Consistency Heatmap - Full Width */}
          <section>
            <ConsistencyHeatmap />
          </section>

          {/* Weekly Performance - Full Width */}
          <section>
            <WeeklyPerformance />
          </section>

          {/* Personal Records Timeline and Training Distribution - 2 Column Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Personal Records */}
            <section>
              <PersonalRecordsTimeline />
            </section>

            {/* Training Distribution */}
            <section>
              <TrainingDistribution />
            </section>
          </div>

          {/* Exercise Radar - Full Width */}
          <section>
            <ExerciseRadar />
          </section>

          {/* Training Load Chart - Full Width */}
          <section>
            <TrainingLoadChart />
          </section>

          {/* Recovery Metrics - Full Width */}
          <section>
            <RecoveryMetrics />
          </section>

          {/* Workout Timeline - Full Width */}
          <section>
            <WorkoutTimeline />
          </section>

          {/* Exercise Leaderboard - Full Width */}
          <section>
            <ExerciseLeaderboard />
          </section>

          {/* Muscle Group Analysis - Full Width */}
          <section>
            <MuscleGroupAnalysis />
          </section>

          {/* Progressive Overload Tracker - Full Width */}
          <section>
            <ProgressiveOverloadTracker />
          </section>

          {/* Volume Load Progression - Full Width */}
          <section>
            <VolumeLoadProgression />
          </section>

          {/* AI-Powered Insights - Full Width */}
          <section>
            <AIInsights />
          </section>

          {/* Coming Soon - Placeholder for future features */}
          <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 mb-2">More Analytics Coming Soon</h3>
              <p className="text-slate-500">
                We&apos;re working on additional analytics features including AI-powered recommendations,
                performance predictions, and advanced reporting capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
