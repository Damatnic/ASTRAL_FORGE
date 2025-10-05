'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';

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
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold mb-2">{formatDate(payload[0].payload.date)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
              {entry.name.includes('Weight') || entry.name.includes('1RM') ? ' lbs' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-purple-500/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{exerciseName}</h3>
          <p className="text-sm text-gray-400">Performance Trends</p>
        </div>

        {/* Chart Type Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('strength')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              chartType === 'strength'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Strength</span>
          </button>
          <button
            onClick={() => setChartType('volume')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              chartType === 'volume'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Volume</span>
          </button>
          <button
            onClick={() => setChartType('frequency')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              chartType === 'frequency'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Frequency</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {(['7d', '30d', '90d', '1y', 'all'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {range === 'all' ? 'All Time' : range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Max Weight</div>
          <div className="text-lg font-bold text-purple-400">{stats.maxWeight} lbs</div>
          {progress.weightChange !== 0 && (
            <div
              className={`text-xs mt-1 ${
                progress.weightChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {progress.weightChange > 0 ? '+' : ''}
              {progress.weightChange.toFixed(1)} lbs
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Est. 1RM</div>
          <div className="text-lg font-bold text-orange-400">{stats.maxOneRM} lbs</div>
          {progress.oneRMChange !== 0 && (
            <div
              className={`text-xs mt-1 ${
                progress.oneRMChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {progress.oneRMChange > 0 ? '+' : ''}
              {progress.oneRMChange.toFixed(1)} lbs
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Max Volume</div>
          <div className="text-lg font-bold text-blue-400">
            {(stats.maxVolume / 1000).toFixed(1)}K lbs
          </div>
          {progress.volumeChange !== 0 && (
            <div
              className={`text-xs mt-1 ${
                progress.volumeChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {progress.volumeChange > 0 ? '+' : ''}
              {(progress.volumeChange / 1000).toFixed(1)}K lbs
            </div>
          )}
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Total Sets</div>
          <div className="text-lg font-bold text-green-400">{stats.totalSets}</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {(stats.totalSets / (filteredData.length || 1)).toFixed(1)}/session
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="h-[300px]">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for this time period
          </div>
        ) : (
          <>
            {/* Strength Chart */}
            {chartType === 'strength' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#A78BFA"
                    strokeWidth={2}
                    name="Max Weight"
                    dot={{ fill: '#A78BFA', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="estimatedOneRM"
                    stroke="#FB923C"
                    strokeWidth={2}
                    name="Est. 1RM"
                    dot={{ fill: '#FB923C', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* Volume Chart */}
            {chartType === 'volume' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="volume" fill="#60A5FA" name="Total Volume (lbs)" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Frequency Chart */}
            {chartType === 'frequency' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sets" fill="#34D399" name="Sets Performed" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}
