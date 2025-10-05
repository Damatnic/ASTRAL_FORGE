'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Dumbbell,
  Trophy,
  Zap,
  Target,
  Activity,
  Award,
  Clock,
  Flame,
  BarChart3,
} from 'lucide-react';

// Types
interface WorkoutData {
  id: string;
  date: Date;
  name: string;
  duration: number;
  xpEarned: number;
  totalVolume: number;
  exercises: ExerciseData[];
  muscleGroups: string[];
  prCount: number;
}

interface ExerciseData {
  name: string;
  sets: number;
  totalVolume: number;
  category: string;
}

interface InsightData {
  type: 'success' | 'warning' | 'info';
  icon: any;
  title: string;
  description: string;
}

type TimePeriod = '7d' | '30d' | '90d' | '1y' | 'all';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  // Mock workout data - last 90 days
  const mockWorkouts: WorkoutData[] = useMemo(() => {
    const workouts: WorkoutData[] = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip some days randomly for realistic data
      if (Math.random() > 0.6) continue;
      
      const workoutTypes = [
        { name: 'Push Day', muscles: ['Chest', 'Shoulders', 'Triceps'], exercises: 6 },
        { name: 'Pull Day', muscles: ['Back', 'Biceps'], exercises: 6 },
        { name: 'Leg Day', muscles: ['Legs', 'Glutes'], exercises: 5 },
        { name: 'Upper Body', muscles: ['Chest', 'Back', 'Shoulders', 'Arms'], exercises: 8 },
        { name: 'Full Body', muscles: ['Chest', 'Back', 'Legs', 'Shoulders'], exercises: 7 },
      ];
      
      const workout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      const duration = 45 + Math.floor(Math.random() * 45);
      const volume = 8000 + Math.floor(Math.random() * 20000);
      const xp = duration * 15 + Math.floor(Math.random() * 500);
      
      workouts.push({
        id: `workout-${i}`,
        date,
        name: workout.name,
        duration,
        xpEarned: xp,
        totalVolume: volume,
        exercises: Array.from({ length: workout.exercises }, (_, idx) => ({
          name: `Exercise ${idx + 1}`,
          sets: 3 + Math.floor(Math.random() * 2),
          totalVolume: volume / workout.exercises,
          category: workout.muscles[Math.floor(Math.random() * workout.muscles.length)],
        })),
        muscleGroups: workout.muscles,
        prCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
      });
    }
    
    return workouts;
  }, []);

  // Filter workouts by selected period
  const filteredWorkouts = useMemo(() => {
    const today = new Date();
    const cutoffDate = new Date(today);
    
    switch (selectedPeriod) {
      case '7d':
        cutoffDate.setDate(today.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(today.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'all':
        return mockWorkouts;
    }
    
    return mockWorkouts.filter(w => w.date >= cutoffDate);
  }, [mockWorkouts, selectedPeriod]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWorkouts = filteredWorkouts.length;
    const totalVolume = filteredWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const totalXP = filteredWorkouts.reduce((sum, w) => sum + w.xpEarned, 0);
    const totalPRs = filteredWorkouts.reduce((sum, w) => sum + w.prCount, 0);
    const avgDuration = totalWorkouts > 0 
      ? Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts)
      : 0;
    const totalDuration = filteredWorkouts.reduce((sum, w) => sum + w.duration, 0);
    
    return {
      totalWorkouts,
      totalVolume,
      totalXP,
      totalPRs,
      avgDuration,
      totalDuration,
    };
  }, [filteredWorkouts]);

  // Volume trend data
  const volumeTrendData = useMemo(() => {
    const grouped = filteredWorkouts.reduce((acc, workout) => {
      const dateKey = workout.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, volume: 0, xp: 0, duration: 0 };
      }
      acc[dateKey].volume += workout.totalVolume;
      acc[dateKey].xp += workout.xpEarned;
      acc[dateKey].duration += workout.duration;
      return acc;
    }, {} as Record<string, { date: string; volume: number; xp: number; duration: number }>);
    
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredWorkouts]);

  // Muscle group distribution
  const muscleGroupData = useMemo(() => {
    const distribution = filteredWorkouts.reduce((acc, workout) => {
      workout.muscleGroups.forEach(muscle => {
        acc[muscle] = (acc[muscle] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [filteredWorkouts]);

  // Workout frequency by day of week
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const distribution = Array(7).fill(0);
    
    filteredWorkouts.forEach(workout => {
      distribution[workout.date.getDay()]++;
    });
    
    return days.map((day, idx) => ({ day, workouts: distribution[idx] }));
  }, [filteredWorkouts]);

  // Weekly comparison
  const weeklyComparison = useMemo(() => {
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const thisWeek = filteredWorkouts.filter(w => w.date >= thisWeekStart);
    const lastWeek = filteredWorkouts.filter(w => 
      w.date >= lastWeekStart && w.date < thisWeekStart
    );
    
    return {
      thisWeek: {
        workouts: thisWeek.length,
        volume: thisWeek.reduce((sum, w) => sum + w.totalVolume, 0),
        xp: thisWeek.reduce((sum, w) => sum + w.xpEarned, 0),
      },
      lastWeek: {
        workouts: lastWeek.length,
        volume: lastWeek.reduce((sum, w) => sum + w.totalVolume, 0),
        xp: lastWeek.reduce((sum, w) => sum + w.xpEarned, 0),
      },
    };
  }, [filteredWorkouts]);

  // Generate insights
  const insights: InsightData[] = useMemo(() => {
    const insights: InsightData[] = [];
    
    // PR insight
    if (stats.totalPRs > 0) {
      insights.push({
        type: 'success',
        icon: Trophy,
        title: `${stats.totalPRs} Personal Records!`,
        description: `You've hit ${stats.totalPRs} PRs in the selected period. Keep crushing it!`,
      });
    }
    
    // Consistency insight
    const workoutRate = stats.totalWorkouts / (selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90);
    if (workoutRate >= 0.8) {
      insights.push({
        type: 'success',
        icon: Flame,
        title: 'Incredible Consistency!',
        description: `You're averaging ${workoutRate.toFixed(1)} workouts per day. Your dedication is unmatched!`,
      });
    } else if (workoutRate < 0.3) {
      insights.push({
        type: 'warning',
        icon: Calendar,
        title: 'Room for Improvement',
        description: `Try to increase your workout frequency. Consistency is key to progress!`,
      });
    }
    
    // Volume trend
    const volumeChange = weeklyComparison.thisWeek.volume - weeklyComparison.lastWeek.volume;
    if (volumeChange > 0) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Volume Increasing!',
        description: `Your weekly volume is up by ${((volumeChange / weeklyComparison.lastWeek.volume) * 100).toFixed(0)}% compared to last week!`,
      });
    } else if (volumeChange < 0 && weeklyComparison.lastWeek.volume > 0) {
      insights.push({
        type: 'info',
        icon: TrendingDown,
        title: 'Volume Decreased',
        description: 'Consider if you need a deload week or if you should push harder.',
      });
    }
    
    // Average duration
    if (stats.avgDuration > 75) {
      insights.push({
        type: 'info',
        icon: Clock,
        title: 'Long Workouts',
        description: `Average ${stats.avgDuration} min per session. Consider if you can optimize workout efficiency.`,
      });
    }
    
    return insights;
  }, [stats, weeklyComparison, selectedPeriod]);

  // Chart colors
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const formatVolume = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10 text-purple-500" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Track your progress and discover insights about your training
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' },
            { value: 'all', label: 'All Time' },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value as TimePeriod)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedPeriod === period.value
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Workouts</h3>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalWorkouts}</div>
            <div className="text-sm text-gray-400">
              Avg {stats.avgDuration} min per session
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 rounded-lg border border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Volume</h3>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {formatVolume(stats.totalVolume)}
            </div>
            <div className="text-sm text-gray-400">lbs lifted</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-lg border border-yellow-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total XP</h3>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {stats.totalXP.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">experience earned</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-lg border border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Personal Records</h3>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.totalPRs}</div>
            <div className="text-sm text-gray-400">new PRs achieved</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 rounded-lg border border-orange-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Time</h3>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {Math.floor(stats.totalDuration / 60)}
            </div>
            <div className="text-sm text-gray-400">hours trained</div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/20 rounded-lg border border-pink-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Consistency</h3>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round((stats.totalWorkouts / (selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90)) * 100)}%
            </div>
            <div className="text-sm text-gray-400">workout frequency</div>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Insights & Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-6 ${
                    insight.type === 'success'
                      ? 'bg-green-900/20 border-green-500/30'
                      : insight.type === 'warning'
                      ? 'bg-yellow-900/20 border-yellow-500/30'
                      : 'bg-blue-900/20 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        insight.type === 'success'
                          ? 'bg-green-500/20'
                          : insight.type === 'warning'
                          ? 'bg-yellow-500/20'
                          : 'bg-blue-500/20'
                      }`}
                    >
                      <insight.icon
                        className={`w-6 h-6 ${
                          insight.type === 'success'
                            ? 'text-green-400'
                            : insight.type === 'warning'
                            ? 'text-yellow-400'
                            : 'text-blue-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volume Trend Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Volume Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                tickFormatter={formatVolume}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Volume (lbs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* XP Trend Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">XP Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', r: 4 }}
                name="XP Earned"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Muscle Group Distribution */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Muscle Group Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Workout Frequency by Day */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Workout Frequency by Day</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="workouts" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Week-over-Week Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Workouts</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {weeklyComparison.lastWeek.workouts}
                  </div>
                  <div className="text-xs text-gray-500">Last Week</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {weeklyComparison.thisWeek.workouts}
                  </div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
              </div>
              {weeklyComparison.thisWeek.workouts > weeklyComparison.lastWeek.workouts && (
                <div className="mt-2 text-green-400 text-sm flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{weeklyComparison.thisWeek.workouts - weeklyComparison.lastWeek.workouts}
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Volume</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatVolume(weeklyComparison.lastWeek.volume)}
                  </div>
                  <div className="text-xs text-gray-500">Last Week</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatVolume(weeklyComparison.thisWeek.volume)}
                  </div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
              </div>
              {weeklyComparison.thisWeek.volume > weeklyComparison.lastWeek.volume && (
                <div className="mt-2 text-green-400 text-sm flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{Math.round(((weeklyComparison.thisWeek.volume - weeklyComparison.lastWeek.volume) / weeklyComparison.lastWeek.volume) * 100)}%
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">XP Earned</div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {weeklyComparison.lastWeek.xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Last Week</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {weeklyComparison.thisWeek.xp.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
              </div>
              {weeklyComparison.thisWeek.xp > weeklyComparison.lastWeek.xp && (
                <div className="mt-2 text-green-400 text-sm flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{Math.round(((weeklyComparison.thisWeek.xp - weeklyComparison.lastWeek.xp) / weeklyComparison.lastWeek.xp) * 100)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
