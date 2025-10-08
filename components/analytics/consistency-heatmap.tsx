"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar, TrendingUp, Flame, Award } from "lucide-react";

interface DayData {
  date: string;
  workouts: number;
  volume: number;
  intensity: "rest" | "light" | "moderate" | "intense" | "max";
}

interface ConsistencyStats {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  averagePerWeek: number;
}

export default function ConsistencyHeatmap() {
  const { data: session } = useSession();
  const [heatmapData, setHeatmapData] = useState<DayData[]>([]);
  const [stats, setStats] = useState<ConsistencyStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    averagePerWeek: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<"3M" | "6M" | "1Y">("3M");
  const [_isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadHeatmapData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, selectedPeriod]);

  const loadHeatmapData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/consistency?period=${selectedPeriod}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setHeatmapData(result.data);
      setStats(result.stats);
    } catch (error) {
      console.error("Failed to load heatmap data:", error);
      // Fallback to mock data on error
      const mockData = generateMockHeatmapData(selectedPeriod);
      setHeatmapData(mockData);
      setStats(calculateStats(mockData));
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockHeatmapData = (period: string): DayData[] => {
    const days = period === "3M" ? 90 : period === "6M" ? 180 : 365;
    const data: DayData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate realistic training patterns (3-5 days/week)
      const isTrainingDay = Math.random() > 0.4;
      const workouts = isTrainingDay ? (Math.random() > 0.7 ? 2 : 1) : 0;
      const volume = isTrainingDay ? Math.floor(Math.random() * 10000 + 2000) : 0;
      
      const intensity = workouts === 0 ? "rest" : 
                       volume < 3000 ? "light" :
                       volume < 5000 ? "moderate" :
                       volume < 7000 ? "intense" : "max";

      data.push({
        date: date.toISOString().split("T")[0],
        workouts,
        volume,
        intensity,
      });
    }

    return data;
  };

  const calculateStats = (data: DayData[]): ConsistencyStats => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalWorkouts = 0;

    // Calculate from most recent backwards
    const reversedData = [...data].reverse();
    
    for (const day of reversedData) {
      totalWorkouts += day.workouts;
      
      if (day.workouts > 0) {
        tempStreak++;
        if (currentStreak === 0 || currentStreak === tempStreak) {
          currentStreak = tempStreak;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (currentStreak === tempStreak) {
          // Streak broken
          currentStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }

    const weeks = data.length / 7;
    const averagePerWeek = totalWorkouts / weeks;

    return {
      currentStreak,
      longestStreak,
      totalWorkouts,
      averagePerWeek: parseFloat(averagePerWeek.toFixed(1)),
    };
  };

  const getIntensityColor = (intensity: string): string => {
    const colors = {
      rest: "bg-slate-800/50",
      light: "bg-green-900/40",
      moderate: "bg-green-700/60",
      intense: "bg-green-500/80",
      max: "bg-green-400",
    };
    return colors[intensity as keyof typeof colors] || colors.rest;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Group data by weeks for heatmap display
  const getWeeksData = () => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    // Add empty days at start to align with Sunday
    const firstDate = new Date(heatmapData[0]?.date || new Date());
    const firstDayOfWeek = firstDate.getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: "",
        workouts: 0,
        volume: 0,
        intensity: "rest",
      });
    }

    heatmapData.forEach((day) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Fill last week if incomplete
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({
        date: "",
        workouts: 0,
        volume: 0,
        intensity: "rest",
      });
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = getWeeksData();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Consistency Tracker</h3>
            <p className="text-sm text-gray-400">Your training frequency heatmap</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(["3M", "6M", "1Y"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-slate-800/50 text-gray-400 hover:text-gray-300 border border-slate-700/30"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.currentStreak}</p>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Best Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.longestStreak}</p>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Total Workouts</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
          <p className="text-xs text-gray-500">sessions</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Weekly Average</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averagePerWeek}</p>
          <p className="text-xs text-gray-500">days/week</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 overflow-x-auto">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2">
            <div className="h-4 text-[10px] text-gray-500"></div>
            {dayLabels.map((day) => (
              <div key={day} className="h-3 text-[10px] text-gray-500 flex items-center">
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${
                      day.date ? getIntensityColor(day.intensity) : "bg-transparent"
                    } transition-all hover:ring-2 hover:ring-purple-400/50 cursor-pointer group relative`}
                    title={day.date ? `${formatDate(day.date)}: ${day.workouts} workout(s), ${day.volume}kg` : ""}
                  >
                    {day.date && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap border border-slate-700">
                          <p className="font-medium">{formatDate(day.date)}</p>
                          <p className="text-gray-400">{day.workouts} workout(s)</p>
                          <p className="text-gray-400">{day.volume.toLocaleString()}kg</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
          <span className="text-xs text-gray-400">Less</span>
          <div className="flex gap-1">
            {["rest", "light", "moderate", "intense", "max"].map((intensity) => (
              <div
                key={intensity}
                className={`w-4 h-4 rounded-sm ${getIntensityColor(intensity)}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          {stats.currentStreak > 7 ? (
            <> Amazing! You&apos;re on a <span className="text-purple-400 font-semibold">{stats.currentStreak}-day streak</span>. Keep it up!</>
          ) : stats.averagePerWeek >= 4 ? (
            <> Great consistency! You&apos;re averaging <span className="text-purple-400 font-semibold">{stats.averagePerWeek} workouts/week</span>.</>
          ) : stats.averagePerWeek >= 3 ? (
            <> Good progress! Try adding one more session per week to maximize gains.</>
          ) : (
            <> Let&apos;s build momentum! Aim for 3-4 sessions per week for optimal results.</>
          )}
        </p>
      </div>
    </div>
  );
}
