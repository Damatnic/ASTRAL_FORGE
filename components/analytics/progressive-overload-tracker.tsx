"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { TrendingUp, ChevronDown } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const ProgressiveOverloadTrackerRender = lazy(() => import("./progressive-overload-tracker-render"));

interface ProgressionData {
  date: string;
  weight: number;
  reps: number;
  estimatedMax: number;
}

interface ExerciseProgression {
  exerciseId: string;
  exerciseName: string;
  data: ProgressionData[];
  trend: "increasing" | "stable" | "decreasing";
  percentChange: number;
  currentMax: number;
  startingMax: number;
}

export default function ProgressiveOverloadTracker() {
  const [progressionData, setProgressionData] = useState<ExerciseProgression[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("3m");

  useEffect(() => {
    fetchProgressionData();
  }, [period]);

  const fetchProgressionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/progressive-overload?period=${period}`);
      if (!response.ok) throw new Error("Failed to fetch progression data");
      
      const data = await response.json();
      setProgressionData(data.exercises);
      
      if (data.exercises.length > 0 && !selectedExercise) {
        setSelectedExercise(data.exercises[0].exerciseId);
      }
    } catch (error) {
      console.error("Error fetching progression data:", error);
      setProgressionData([]);
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = progressionData.find((e) => e.exerciseId === selectedExercise);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-amber-400";
      case "stable":
        return "text-amber-400";
      case "decreasing":
        return "text-red-400";
      default:
        return "text-neutral-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "";
      case "stable":
        return "";
      case "decreasing":
        return "";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-700 w-1/3"></div>
          <div className="h-64 bg-neutral-700"></div>
        </div>
      </div>
    );
  }

  if (progressionData.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Progressive Overload Tracker</h2>
        </div>
        <p className="text-neutral-400 text-center py-8">
          No progression data available. Complete more workouts to track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Progressive Overload Tracker</h2>
            <p className="text-sm text-neutral-400">Monitor strength progression over time</p>
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2">
          {["1m", "3m", "6m", "1y"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-bold transition-all border-2 ${
                period === p
                  ? "bg-amber-950/20 text-amber-400 border-amber-700/30"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Selector */}
      <div className="mb-6">
        <label className="block text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Select Exercise
        </label>
        <div className="relative">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full bg-neutral-900 border-2 border-neutral-800 px-4 py-2.5 text-white appearance-none cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            {progressionData.map((exercise) => (
              <option key={exercise.exerciseId} value={exercise.exerciseId}>
                {exercise.exerciseName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {currentExercise && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Starting Max */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Starting Est. 1RM</div>
              <div className="text-2xl font-black text-white">
                {currentExercise.startingMax.toFixed(1)} lbs
              </div>
            </div>

            {/* Current Max */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Current Est. 1RM</div>
              <div className="text-2xl font-black text-white">
                {currentExercise.currentMax.toFixed(1)} lbs
              </div>
            </div>

            {/* Change */}
            <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
              <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Total Change</div>
              <div className={`text-2xl font-black ${getTrendColor(currentExercise.trend)}`}>
                {getTrendIcon(currentExercise.trend)} {currentExercise.percentChange > 0 ? "+" : ""}
                {currentExercise.percentChange.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-300 mb-4">
              Estimated 1RM Progression
            </h3>
            <Suspense fallback={<ChartSkeleton />}>
              <ProgressiveOverloadTrackerRender data={currentExercise.data} />
            </Suspense>
          </div>

          {/* Recent Sessions Table */}
          <div className="mt-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-300 mb-3">Recent Sessions</h3>
            <div className="bg-neutral-900 border-2 border-neutral-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-900">
                  <tr>
                    <th className="text-left text-xs font-black uppercase tracking-wider text-neutral-400 px-4 py-3">Date</th>
                    <th className="text-right text-xs font-black uppercase tracking-wider text-neutral-400 px-4 py-3">Weight</th>
                    <th className="text-right text-xs font-black uppercase tracking-wider text-neutral-400 px-4 py-3">Reps</th>
                    <th className="text-right text-xs font-black uppercase tracking-wider text-neutral-400 px-4 py-3">Est. 1RM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {currentExercise.data.slice(-10).reverse().map((session, index) => (
                    <tr key={index} className="hover:bg-neutral-800 transition-colors">
                      <td className="text-sm text-neutral-300 px-4 py-3">{session.date}</td>
                      <td className="text-sm text-white text-right px-4 py-3">{session.weight} lbs</td>
                      <td className="text-sm text-white text-right px-4 py-3">{session.reps}</td>
                      <td className="text-sm font-black text-amber-400 text-right px-4 py-3">
                        {session.estimatedMax.toFixed(1)} lbs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
