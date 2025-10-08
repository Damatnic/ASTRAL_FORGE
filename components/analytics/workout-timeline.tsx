"use client";

import { useEffect, useState } from "react";
import { Calendar, Dumbbell, TrendingUp, Clock, Target, Award } from "lucide-react";

interface WorkoutSummary {
  id: string;
  date: string;
  duration: number;
  totalSets: number;
  totalVolume: number;
  exerciseCount: number;
  avgIntensity: number;
  exercises: string[];
}

interface WorkoutTimelineData {
  workouts: WorkoutSummary[];
  totalWorkouts: number;
  totalVolume: number;
  avgDuration: number;
}

export default function WorkoutTimeline() {
  const [timelineData, setTimelineData] = useState<WorkoutTimelineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"1m" | "3m" | "6m" | "all">("3m");

  useEffect(() => {
    fetchTimelineData();
  }, [period]);

  const fetchTimelineData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/workout-timeline?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setTimelineData(data);
      }
    } catch (error) {
      console.error("Failed to fetch workout timeline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = date.toISOString().split("T")[0];
    const todayOnly = today.toISOString().split("T")[0];
    const yesterdayOnly = yesterday.toISOString().split("T")[0];

    if (dateOnly === todayOnly) return "Today";
    if (dateOnly === yesterdayOnly) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return "text-red-400 bg-red-950/10 border-red-500/20";
    if (intensity >= 6) return "text-amber-400 bg-amber-950/10 border-amber-700/20";
    if (intensity >= 4) return "text-amber-400 bg-amber-950/10 border-amber-700/20";
    return "text-amber-400 bg-amber-950/10 border-amber-700/20";
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 8) return "High";
    if (intensity >= 6) return "Moderate";
    if (intensity >= 4) return "Light";
    return "Easy";
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Workout Timeline</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-400">Loading workout history...</div>
        </div>
      </div>
    );
  }

  if (!timelineData || timelineData.workouts.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Workout Timeline</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Dumbbell className="w-12 h-12 text-neutral-600 mb-3" />
          <div className="text-neutral-400">No workouts found for this period</div>
          <p className="text-sm text-neutral-500 mt-2">Complete a workout to see it here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Workout Timeline</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("1m")}
            className={`px-3 py-1 text-sm font-bold transition-colors border-2 ${
              period === "1m"
                ? "bg-amber-950/20 text-amber-400 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-neutral-800"
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setPeriod("3m")}
            className={`px-3 py-1 text-sm font-bold transition-colors border-2 ${
              period === "3m"
                ? "bg-amber-950/20 text-amber-400 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-neutral-800"
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setPeriod("6m")}
            className={`px-3 py-1 text-sm font-bold transition-colors border-2 ${
              period === "6m"
                ? "bg-amber-950/20 text-amber-400 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-neutral-800"
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setPeriod("all")}
            className={`px-3 py-1 text-sm font-bold transition-colors border-2 ${
              period === "all"
                ? "bg-amber-950/20 text-amber-400 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-neutral-800"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Dumbbell className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Workouts</span>
          </div>
          <div className="text-2xl font-black text-white">{timelineData.totalWorkouts}</div>
        </div>

        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Volume</span>
          </div>
          <div className="text-2xl font-black text-white">
            {Math.round(timelineData.totalVolume).toLocaleString()}
            <span className="text-sm text-neutral-400 ml-1">kg</span>
          </div>
        </div>

        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-bold uppercase tracking-wider">Avg Duration</span>
          </div>
          <div className="text-2xl font-black text-white">
            {Math.round(timelineData.avgDuration)}
            <span className="text-sm text-neutral-400 ml-1">min</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {timelineData.workouts.map((workout, index) => (
          <div
            key={workout.id}
            className="bg-neutral-900 border-2 border-neutral-800 p-4 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-950/10 border-2 border-amber-700/30 flex items-center justify-center">
                  <span className="text-sm font-black text-amber-400">#{timelineData.totalWorkouts - index}</span>
                </div>
                <div>
                  <div className="text-white font-black uppercase tracking-wider">{formatDate(workout.date)}</div>
                  <div className="text-xs text-neutral-400">
                    {new Date(workout.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div
                className={`px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${getIntensityColor(
                  workout.avgIntensity
                )}`}
              >
                {getIntensityLabel(workout.avgIntensity)} Intensity
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="bg-neutral-900 border-2 border-neutral-800 p-2">
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Duration</div>
                <div className="text-sm font-black text-white">{workout.duration} min</div>
              </div>
              <div className="bg-neutral-900 border-2 border-neutral-800 p-2">
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Exercises</div>
                <div className="text-sm font-black text-white">{workout.exerciseCount}</div>
              </div>
              <div className="bg-neutral-900 border-2 border-neutral-800 p-2">
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Total Sets</div>
                <div className="text-sm font-black text-white">{workout.totalSets}</div>
              </div>
              <div className="bg-neutral-900 border-2 border-neutral-800 p-2">
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider font-bold">Volume</div>
                <div className="text-sm font-black text-white">
                  {Math.round(workout.totalVolume).toLocaleString()} kg
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {workout.exercises.slice(0, 5).map((exercise, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 bg-amber-950/10 border-2 border-amber-700/20 text-xs text-amber-300"
                >
                  {exercise}
                </div>
              ))}
              {workout.exercises.length > 5 && (
                <div className="px-2 py-1 bg-neutral-900 border-2 border-neutral-800 text-xs text-neutral-400">
                  +{workout.exercises.length - 5} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-xs text-neutral-400 border-t-2 border-neutral-800 pt-4 mt-4">
        <p>
          Showing {timelineData.workouts.length} workout{timelineData.workouts.length !== 1 ? "s" : ""} from{" "}
          {period === "1m"
            ? "the last month"
            : period === "3m"
            ? "the last 3 months"
            : period === "6m"
            ? "the last 6 months"
            : "all time"}
        </p>
      </div>
    </div>
  );
}