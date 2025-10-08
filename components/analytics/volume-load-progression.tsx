"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Activity, TrendingUp } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const VolumeLoadProgressionRender = lazy(() => import("./volume-load-progression-render"));

interface VolumeDataPoint {
  date: string;
  totalVolume: number;
  trendLine: number;
  workouts: number;
}

interface VolumeLoadData {
  data: VolumeDataPoint[];
  totalVolume: number;
  averagePerWorkout: number;
  trend: "increasing" | "stable" | "decreasing";
  trendPercentage: number;
  slope: number;
}

export default function VolumeLoadProgression() {
  const [volumeData, setVolumeData] = useState<VolumeLoadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("3m");

  useEffect(() => {
    fetchVolumeData();
  }, [period]);

  const fetchVolumeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/volume-load-progression?period=${period}`);
      if (!response.ok) throw new Error("Failed to fetch volume data");
      
      const data = await response.json();
      setVolumeData(data);
    } catch (error) {
      console.error("Error fetching volume data:", error);
      setVolumeData(null);
    } finally {
      setLoading(false);
    }
  };

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

  if (!volumeData || volumeData.data.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Volume Load Progression</h2>
        </div>
        <p className="text-neutral-400 text-center py-8">
          No volume data available. Complete more workouts to track your progress.
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
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Volume Load Progression</h2>
            <p className="text-sm text-neutral-400">Track total training volume over time</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total Volume */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Total Volume</div>
          <div className="text-2xl font-black text-white">
            {(volumeData.totalVolume / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-neutral-500 mt-1">lbs lifted</div>
        </div>

        {/* Average Per Workout */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Avg Per Workout</div>
          <div className="text-2xl font-black text-white">
            {(volumeData.averagePerWorkout / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-neutral-500 mt-1">lbs per session</div>
        </div>

        {/* Trend */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Trend</div>
          <div className={`text-2xl font-black ${getTrendColor(volumeData.trend)}`}>
            {getTrendIcon(volumeData.trend)} {volumeData.trend}
          </div>
        </div>

        {/* Change */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
          <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">Change</div>
          <div className={`text-2xl font-black ${getTrendColor(volumeData.trend)}`}>
            {volumeData.trendPercentage > 0 ? "+" : ""}
            {volumeData.trendPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-neutral-900 border-2 border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-300">
            Volume Load Over Time
          </h3>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <TrendingUp className="w-4 h-4" />
            <span>Linear regression trend line</span>
          </div>
        </div>
        <Suspense fallback={<ChartSkeleton />}>
          <VolumeLoadProgressionRender data={volumeData.data} />
        </Suspense>
      </div>

      {/* Insights */}
      <div className="mt-6 bg-amber-950/10 border-2 border-amber-700/20 p-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-amber-300 mb-2"> Volume Insights</h3>
        <div className="space-y-2 text-sm text-neutral-300">
          {volumeData.trend === "increasing" && (
            <p>
               Your training volume is trending upward! You&apos;re progressively increasing
              your workload, which is great for building strength and muscle.
            </p>
          )}
          {volumeData.trend === "stable" && (
            <p>
              ℹ Your training volume is stable. This could indicate a maintenance phase
              or that you&apos;re focusing on intensity over volume.
            </p>
          )}
          {volumeData.trend === "decreasing" && (
            <p>
               Your training volume is decreasing. This could be intentional (deload, recovery)
              or may indicate reduced training frequency. Consider your goals and adjust accordingly.
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Slope: {volumeData.slope > 0 ? "+" : ""}{volumeData.slope.toFixed(0)} lbs/session
          </p>
        </div>
      </div>
    </div>
  );
}
