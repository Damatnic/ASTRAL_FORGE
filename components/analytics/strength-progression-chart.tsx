'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TrendingUp, Dumbbell } from 'lucide-react';
import { ChartSkeleton } from '@/components/charts/chart-loading';

// Lazy load the chart rendering component
const StrengthChart = lazy(() => import('./strength-progression-chart-render'));

interface ExerciseData {
  date: string;
  estimated1RM: number;
  actualWeight: number;
  reps: number;
}

interface StrengthProgressionChartProps {
  userId?: string;
  exerciseId?: string;
}

export function StrengthProgressionChart({ userId: _userId, exerciseId }: StrengthProgressionChartProps) {
  const [data, setData] = useState<ExerciseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(exerciseId || '');
  const [exercises, setExercises] = useState<Array<{ id: string; name: string }>>([]);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');

  useEffect(() => {
    loadExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadProgressionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExercise, timeRange]);

  const loadExercises = async () => {
    try {
      const response = await fetch('/api/exercises/favorites');
      if (response.ok) {
        const data = await response.json();
        setExercises(data.exercises || getMockExercises());
        if (data.exercises?.length > 0 && !selectedExercise) {
          setSelectedExercise(data.exercises[0].id);
        }
      } else {
        setExercises(getMockExercises());
        if (!selectedExercise) {
          setSelectedExercise('squat');
        }
      }
    } catch (_error) {
      setExercises(getMockExercises());
      if (!selectedExercise) {
        setSelectedExercise('squat');
      }
    }
  };

  const loadProgressionData = async () => {
    setIsLoading(true);
    try {
      // Map time range to period format
      const periodMap = { '3m': '3M', '6m': '6M', '1y': '1Y', 'all': 'ALL' };
      const period = periodMap[timeRange];
      
      const response = await fetch(
        `/api/analytics/strength-progression?exerciseId=${selectedExercise}&period=${period}`
      );
      if (response.ok) {
        const result = await response.json();
        // Map API response to component data format
        const mappedData = result.data.map((point: { date: string; estimated1RM: number; weight: number; reps: number }) => ({
          date: point.date,
          estimated1RM: point.estimated1RM,
          actualWeight: point.weight,
          reps: point.reps,
        }));
        setData(mappedData);
      } else {
        setData(getMockData());
      }
    } catch (_error) {
      setData(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockExercises = () => [
    { id: 'squat', name: 'Barbell Squat' },
    { id: 'bench', name: 'Barbell Bench Press' },
    { id: 'deadlift', name: 'Deadlift' },
    { id: 'ohp', name: 'Overhead Press' },
  ];

  const getMockData = (): ExerciseData[] => {
    const baseData = [
      { date: '2025-07-06', estimated1RM: 140, actualWeight: 120, reps: 5 },
      { date: '2025-07-13', estimated1RM: 142, actualWeight: 122, reps: 5 },
      { date: '2025-07-20', estimated1RM: 145, actualWeight: 125, reps: 5 },
      { date: '2025-07-27', estimated1RM: 147, actualWeight: 127, reps: 5 },
      { date: '2025-08-03', estimated1RM: 150, actualWeight: 130, reps: 5 },
      { date: '2025-08-10', estimated1RM: 152, actualWeight: 132, reps: 5 },
      { date: '2025-08-17', estimated1RM: 155, actualWeight: 135, reps: 5 },
      { date: '2025-08-24', estimated1RM: 157, actualWeight: 137, reps: 5 },
      { date: '2025-08-31', estimated1RM: 160, actualWeight: 140, reps: 5 },
      { date: '2025-09-07', estimated1RM: 162, actualWeight: 142, reps: 5 },
      { date: '2025-09-14', estimated1RM: 165, actualWeight: 145, reps: 5 },
      { date: '2025-09-21', estimated1RM: 167, actualWeight: 147, reps: 5 },
      { date: '2025-09-28', estimated1RM: 170, actualWeight: 150, reps: 5 },
      { date: '2025-10-05', estimated1RM: 172, actualWeight: 152, reps: 5 },
    ];

    // Filter based on time range
    const now = new Date();
    const cutoffDate = new Date();
    switch (timeRange) {
      case '3m':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return baseData;
    }

    return baseData.filter(d => new Date(d.date) >= cutoffDate);
  };

  const calculateStats = () => {
    if (data.length === 0) return { trend: 0, current: 0, peak: 0 };

    const current = data[data.length - 1]?.estimated1RM || 0;
    const peak = Math.max(...data.map(d => d.estimated1RM));
    const first = data[0]?.estimated1RM || 0;
    const trend = first > 0 ? ((current - first) / first) * 100 : 0;

    return { trend, current, peak };
  };

  const stats = calculateStats();

  if (isLoading && data.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-800 w-1/3"></div>
          <div className="h-64 bg-neutral-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950/20 border-2 border-amber-700 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">STRENGTH PROGRESSION</h3>
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">TRACK YOUR ESTIMATED 1RM OVER TIME</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Exercise Selector */}
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border-2 border-neutral-700 text-white text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-700"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-neutral-900 border-2 border-neutral-700 p-1">
            {[
              { value: '3m' as const, label: '3M' },
              { value: '6m' as const, label: '6M' },
              { value: '1y' as const, label: '1Y' },
              { value: 'all' as const, label: 'All' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm font-black uppercase tracking-wider transition-colors ${
                  timeRange === range.value
                    ? 'bg-amber-950/20 text-amber-400 border-2 border-amber-700'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">CURRENT 1RM</div>
          <div className="text-2xl font-black text-white">{stats.current} KG</div>
        </div>
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">PEAK 1RM</div>
          <div className="text-2xl font-black text-white">{stats.peak} KG</div>
        </div>
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-1">PROGRESS</div>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-5 h-5 ${stats.trend > 0 ? 'text-amber-400' : 'text-neutral-400'}`} />
            <div className={`text-2xl font-black ${stats.trend > 0 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {stats.trend > 0 ? '+' : ''}{stats.trend.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <StrengthChart data={data} />
      </Suspense>

      {/* Insights */}
      {data.length > 0 && (
        <div className="bg-amber-950/20 border-2 border-amber-700 p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <div className="font-black uppercase tracking-wider text-amber-400 mb-1">STRENGTH ANALYSIS</div>
              <div className="text-sm font-bold text-neutral-300">
                {stats.trend > 0 ? (
                  <>
                    YOU&apos;VE INCREASED YOUR ESTIMATED 1RM BY {stats.trend.toFixed(1)}% OVER THIS PERIOD.
                    {stats.current < stats.peak && (
                      <> YOUR PEAK WAS {stats.peak} KG - YOU&apos;RE {((stats.peak - stats.current) / stats.peak * 100).toFixed(1)}% AWAY FROM MATCHING IT.</>
                    )}
                    {stats.current === stats.peak && (
                      <> YOU&apos;RE CURRENTLY AT YOUR PEAK STRENGTH! KEEP UP THE GREAT WORK.</>
                    )}
                  </>
                ) : (
                  <>
                    YOUR STRENGTH HAS REMAINED STABLE. CONSIDER PROGRESSIVE OVERLOAD STRATEGIES TO CONTINUE MAKING GAINS.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
