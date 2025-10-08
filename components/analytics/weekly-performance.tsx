"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar, TrendingUp, Trophy, Dumbbell } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const WeeklyPerformanceRender = lazy(() => import("./weekly-performance-render"));

interface DailyPerformance {
  date: string;
  dayOfWeek: string;
  volume: number;
  workouts: number;
  sets: number;
  avgIntensity: number;
}

interface WeeklyStats {
  totalVolume: number;
  totalWorkouts: number;
  totalSets: number;
  avgIntensity: number;
  peakDay: string;
  peakVolume: number;
  restDays: number;
}

interface WeeklyPerformanceData {
  days: DailyPerformance[];
  stats: WeeklyStats;
  weekStart: string;
  weekEnd: string;
}

export default function WeeklyPerformance() {
  const { data: session } = useSession();
  const [weeklyData, setWeeklyData] = useState<WeeklyPerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, etc.

  useEffect(() => {
    if (session?.user) {
      loadWeeklyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, weekOffset]);

  const loadWeeklyData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/weekly-performance?weekOffset=${weekOffset}`);
      
      if (response.ok) {
        const data = await response.json();
        setWeeklyData(data);
      } else {
        console.error('Failed to fetch weekly performance data');
        // Fallback to mock data
        const mockData = generateMockWeeklyData();
        setWeeklyData(mockData);
      }
    } catch (error) {
      console.error("Failed to load weekly performance:", error);
      // Fallback to mock data
      const mockData = generateMockWeeklyData();
      setWeeklyData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockWeeklyData = (): WeeklyPerformanceData => {
    const days: DailyPerformance[] = [
      { date: "2024-01-01", dayOfWeek: "Mon", volume: 12000, workouts: 1, sets: 12, avgIntensity: 7.5 },
      { date: "2024-01-02", dayOfWeek: "Tue", volume: 0, workouts: 0, sets: 0, avgIntensity: 0 },
      { date: "2024-01-03", dayOfWeek: "Wed", volume: 15000, workouts: 1, sets: 15, avgIntensity: 8.0 },
      { date: "2024-01-04", dayOfWeek: "Thu", volume: 0, workouts: 0, sets: 0, avgIntensity: 0 },
      { date: "2024-01-05", dayOfWeek: "Fri", volume: 18000, workouts: 1, sets: 16, avgIntensity: 8.5 },
      { date: "2024-01-06", dayOfWeek: "Sat", volume: 0, workouts: 0, sets: 0, avgIntensity: 0 },
      { date: "2024-01-07", dayOfWeek: "Sun", volume: 14000, workouts: 1, sets: 14, avgIntensity: 7.8 },
    ];

    return {
      days,
      stats: {
        totalVolume: 59000,
        totalWorkouts: 4,
        totalSets: 57,
        avgIntensity: 7.95,
        peakDay: "Friday",
        peakVolume: 18000,
        restDays: 3,
      },
      weekStart: "Jan 1, 2024",
      weekEnd: "Jan 7, 2024",
    };
  };

  const navigateWeek = (direction: number) => {
    setWeekOffset(weekOffset + direction);
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-950/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Weekly Performance</h2>
            <p className="text-neutral-400 text-sm">Day-by-day breakdown</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-neutral-800"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-20 bg-neutral-800"></div>
            <div className="h-20 bg-neutral-800"></div>
            <div className="h-20 bg-neutral-800"></div>
            <div className="h-20 bg-neutral-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weeklyData) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
        <p className="text-neutral-400">No weekly data available</p>
      </div>
    );
  }

  const avgVolume = weeklyData.stats.totalVolume / 7;

  return (
    <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
      {/* Header with week navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Weekly Performance</h2>
            <p className="text-neutral-400 text-sm">
              {weeklyData.weekStart} - {weeklyData.weekEnd}
            </p>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border-2 border-neutral-800 transition-colors font-black uppercase tracking-wider"
          >
            ← Previous
          </button>
          <button
            onClick={() => navigateWeek(1)}
            disabled={weekOffset >= 0}
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border-2 border-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-wider"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <Suspense fallback={<ChartSkeleton />}>
          <WeeklyPerformanceRender days={weeklyData.days} avgVolume={avgVolume} />
        </Suspense>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Total Volume</span>
          </div>
          <p className="text-2xl font-black text-white">
            {weeklyData.stats.totalVolume.toLocaleString()} kg
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {weeklyData.stats.totalSets} total sets
          </p>
        </div>

        {/* Workouts */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Workouts</span>
          </div>
          <p className="text-2xl font-black text-white">{weeklyData.stats.totalWorkouts}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {weeklyData.stats.restDays} rest days
          </p>
        </div>

        {/* Peak Day */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Peak Day</span>
          </div>
          <p className="text-2xl font-black text-white">{weeklyData.stats.peakDay}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {weeklyData.stats.peakVolume.toLocaleString()} kg
          </p>
        </div>

        {/* Avg Intensity */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Avg Intensity</span>
          </div>
          <p className="text-2xl font-black text-white">
            {weeklyData.stats.avgIntensity.toFixed(1)} RPE
          </p>
          <p className="text-xs text-neutral-400 mt-1">Training intensity</p>
        </div>
      </div>
    </div>
  );
}
