'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Dumbbell, Target, Flame, Award } from 'lucide-react';

interface ProgressMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ProgressOverviewProps {
  userId?: string;
  timePeriod?: '7d' | '30d' | '90d' | '1y' | 'all';
}

export function ProgressOverview({ userId, timePeriod = '30d' }: ProgressOverviewProps) {
  const [metrics, setMetrics] = useState<ProgressMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(timePeriod);

  const periods = [
    { value: '7d' as const, label: '7 Days' },
    { value: '30d' as const, label: '30 Days' },
    { value: '90d' as const, label: '90 Days' },
    { value: '1y' as const, label: '1 Year' },
    { value: 'all' as const, label: 'All Time' },
  ];

  useEffect(() => {
    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, userId]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/progress-overview?period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        
        // Map API response to metrics format
        const apiMetrics: ProgressMetric[] = [
          {
            label: 'Total Volume',
            value: `${data.current.totalVolume.toLocaleString()} kg`,
            change: data.trends.volume,
            trend: data.trends.volume > 0 ? 'up' : data.trends.volume < 0 ? 'down' : 'stable',
            icon: <Dumbbell className="w-6 h-6" />,
            color: 'blue',
          },
          {
            label: 'Workouts Completed',
            value: data.current.totalWorkouts.toString(),
            change: data.trends.workouts,
            trend: data.trends.workouts > 0 ? 'up' : data.trends.workouts < 0 ? 'down' : 'stable',
            icon: <Target className="w-6 h-6" />,
            color: 'green',
          },
          {
            label: 'Avg Intensity (RPE)',
            value: data.current.averageIntensity.toString(),
            change: data.trends.intensity,
            trend: data.trends.intensity > 0 ? 'up' : data.trends.intensity < 0 ? 'down' : 'stable',
            icon: <Flame className="w-6 h-6" />,
            color: 'orange',
          },
          {
            label: 'Training Days',
            value: data.current.trainingDays.toString(),
            change: data.trends.trainingDays,
            trend: data.trends.trainingDays > 0 ? 'up' : data.trends.trainingDays < 0 ? 'down' : 'stable',
            icon: <Award className="w-6 h-6" />,
            color: 'purple',
          },
        ];
        
        setMetrics(apiMetrics);
      } else {
        setMetrics(getMockMetrics());
      }
    } catch (_error) {
      setMetrics(getMockMetrics());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockMetrics = (): ProgressMetric[] => [
    {
      label: 'Total Volume',
      value: '145,230 kg',
      change: 12.5,
      trend: 'up',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'blue',
    },
    {
      label: 'Workouts Completed',
      value: '24',
      change: 8.3,
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'green',
    },
    {
      label: 'Avg Intensity (RPE)',
      value: '7.8',
      change: -2.1,
      trend: 'down',
      icon: <Flame className="w-6 h-6" />,
      color: 'orange',
    },
    {
      label: 'Training Days',
      value: '18',
      change: 20.0,
      trend: 'up',
      icon: <Award className="w-6 h-6" />,
      color: 'purple',
    },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'stable':
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      case 'stable':
        return 'text-gray-400';
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      },
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
      },
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
      },
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
      },
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-800/50 rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-slate-800/50 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 animate-pulse">
              <div className="h-12 w-12 bg-slate-800 rounded-lg mb-4"></div>
              <div className="h-4 w-24 bg-slate-800 rounded mb-2"></div>
              <div className="h-8 w-32 bg-slate-800 rounded mb-2"></div>
              <div className="h-4 w-20 bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Progress Overview</h2>
        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const colors = getColorClasses(metric.color);
          return (
            <div
              key={index}
              className={`bg-slate-900/50 border ${colors.border} rounded-xl p-6 hover:bg-slate-900/70 transition-colors`}
            >
              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4 ${colors.text}`}>
                {metric.icon}
              </div>

              <div className="text-sm text-gray-400 mb-1">{metric.label}</div>

              <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>

              <div className={`flex items-center gap-1 text-sm ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                <span className="font-medium">
                  {Math.abs(metric.change)}% vs previous period
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Insights</h3>
        <div className="space-y-3">
          {metrics.filter((m) => m.trend === 'up').length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="mt-0.5">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-green-400 mb-1">Great Progress!</div>
                <div className="text-sm text-gray-300">
                  You&apos;re trending up in {metrics.filter((m) => m.trend === 'up').length} key metrics.
                  Keep up the momentum!
                </div>
              </div>
            </div>
          )}

          {metrics.filter((m) => m.trend === 'down').length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="mt-0.5">
                <TrendingDown className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-orange-400 mb-1">Areas for Improvement</div>
                <div className="text-sm text-gray-300">
                  Focus on {metrics.filter((m) => m.trend === 'down')[0]?.label.toLowerCase()} to
                  balance your progress.
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="mt-0.5">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-blue-400 mb-1">Next Milestone</div>
              <div className="text-sm text-gray-300">
                You&apos;re on track to reach 150,000 kg total volume in the next {selectedPeriod === '7d' ? '2 weeks' : '4 weeks'}.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
