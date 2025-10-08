'use client';

import { useState, lazy, Suspense } from 'react';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import { ChartSkeleton } from '@/components/charts/chart-loading';

const ChartRender = lazy(() => import('./exercise-performance-chart-render'));

// Types
type ChartType = 'strength' | 'volume' | 'frequency';
type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

interface ExerciseDataPoint {
  date: string;
  weight: number;
  volume: number;
  reps: number;
  estimatedOneRM: number;
  sets: number;
}

interface ExercisePerformanceChartProps {
  exerciseName: string;
  data: ExerciseDataPoint[];
}

export default function ExercisePerformanceChart({
  exerciseName,
  data = [],
}: ExercisePerformanceChartProps) {
  const [chartType, setChartType] = useState<ChartType>('strength');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Filter data by time range
  const filterDataByTimeRange = (data: ExerciseDataPoint[]): ExerciseDataPoint[] => {
    const now = new Date();
    const ranges: Record<TimeRange, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
      'all': Infinity,
    };

    const daysToFilter = ranges[timeRange];
    if (daysToFilter === Infinity) return data;

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToFilter);

    return data.filter((point) => new Date(point.date) >= cutoffDate);
  };

  const filteredData = filterDataByTimeRange(data);

  // Calculate statistics
  const stats = {
    maxWeight: Math.max(...filteredData.map((d) => d.weight), 0),
    maxVolume: Math.max(...filteredData.map((d) => d.volume), 0),
    maxOneRM: Math.max(...filteredData.map((d) => d.estimatedOneRM), 0),
    totalSets: filteredData.reduce((sum, d) => sum + d.sets, 0),
    avgWeight:
      filteredData.reduce((sum, d) => sum + d.weight, 0) / (filteredData.length || 1),
    avgVolume:
      filteredData.reduce((sum, d) => sum + d.volume, 0) / (filteredData.length || 1),
  };

  // Calculate progress (comparing first vs last data point)
  const firstPoint = filteredData[0];
  const lastPoint = filteredData[filteredData.length - 1];
  const progress = {
    weightChange: lastPoint && firstPoint ? lastPoint.weight - firstPoint.weight : 0,
    volumeChange: lastPoint && firstPoint ? lastPoint.volume - firstPoint.volume : 0,
    oneRMChange:
      lastPoint && firstPoint ? lastPoint.estimatedOneRM - firstPoint.estimatedOneRM : 0,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border-2 border-neutral-800 p-3 shadow-lg">
          <p className="text-sm font-black mb-2 uppercase tracking-wider">{formatDate(payload[0].payload.date)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm uppercase tracking-wider font-bold" style={{ color: entry.color }}>
              {entry.name}: <span className="font-black">{entry.value}</span>
              {entry.name.includes('Weight') || entry.name.includes('1RM') ? ' lbs' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-neutral-900 border-2 border-amber-700/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-white mb-1 uppercase tracking-wider">{exerciseName}</h3>
          <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">Performance Trends</p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('strength')}
            className={`px-3 py-2 transition-colors touch-manipulation min-h-[44px] flex items-center gap-2 border-2 uppercase tracking-wider font-black ${
              chartType === 'strength'
                ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-wider">Strength</span>
          </button>
          <button
            onClick={() => setChartType('volume')}
            className={`px-3 py-2 transition-colors touch-manipulation min-h-[44px] flex items-center gap-2 border-2 uppercase tracking-wider font-black ${
              chartType === 'volume'
                ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-wider">Volume</span>
          </button>
          <button
            onClick={() => setChartType('frequency')}
            className={`px-3 py-2 transition-colors touch-manipulation min-h-[44px] flex items-center gap-2 border-2 uppercase tracking-wider font-black ${
              chartType === 'frequency'
                ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-wider">Frequency</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-sm transition-colors border-2 font-black uppercase tracking-wider ${
              timeRange === range
                ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {range === 'all' ? 'All Time' : range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900 p-3 border-2 border-neutral-800">
          <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Max Weight</div>
          <div className="text-lg font-black text-amber-400 uppercase tracking-wider">{stats.maxWeight} lbs</div>
          {progress.weightChange !== 0 && (
            <div
              className={`text-xs mt-1 uppercase tracking-wider font-bold ${
                progress.weightChange > 0 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {progress.weightChange > 0 ? '+' : ''}
              {progress.weightChange.toFixed(1)} lbs
            </div>
          )}
        </div>

        <div className="bg-neutral-900 p-3 border-2 border-neutral-800">
          <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Est. 1RM</div>
          <div className="text-lg font-black text-amber-400 uppercase tracking-wider">{stats.maxOneRM} lbs</div>
          {progress.oneRMChange !== 0 && (
            <div
              className={`text-xs mt-1 uppercase tracking-wider font-bold ${
                progress.oneRMChange > 0 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {progress.oneRMChange > 0 ? '+' : ''}
              {progress.oneRMChange.toFixed(1)} lbs
            </div>
          )}
        </div>

        <div className="bg-neutral-900 p-3 border-2 border-neutral-800">
          <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Max Volume</div>
          <div className="text-lg font-black text-amber-400 uppercase tracking-wider">
            {(stats.maxVolume / 1000).toFixed(1)}K lbs
          </div>
          {progress.volumeChange !== 0 && (
            <div
              className={`text-xs mt-1 uppercase tracking-wider font-bold ${
                progress.volumeChange > 0 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {progress.volumeChange > 0 ? '+' : ''}
              {(progress.volumeChange / 1000).toFixed(1)}K lbs
            </div>
          )}
        </div>

        <div className="bg-neutral-900 p-3 border-2 border-neutral-800">
          <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Total Sets</div>
          <div className="text-lg font-black text-amber-400 uppercase tracking-wider">{stats.totalSets}</div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
            Avg: {(stats.totalSets / (filteredData.length || 1)).toFixed(1)}/session
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="h-[300px]">
        <Suspense fallback={<ChartSkeleton />}>
          <ChartRender
            chartType={chartType}
            filteredData={filteredData}
            formatDate={formatDate}
            CustomTooltip={CustomTooltip}
          />
        </Suspense>
      </div>
    </div>
  );
}
