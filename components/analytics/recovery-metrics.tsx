"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Activity, Moon, TrendingUp, Heart, AlertTriangle } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const RecoveryMetricsRender = lazy(() => import("./recovery-metrics-render"));

interface RecoveryData {
  date: string;
  sleepQuality: number;
  sorenessLevel: number;
  hrvScore: number;
  recoveryScore: number;
}

interface RecoveryMetrics {
  data: RecoveryData[];
  averageRecovery: number;
  averageSleep: number;
  averageHRV: number;
  averageSoreness: number;
  trend: "improving" | "stable" | "declining";
  recommendation: string;
}

export default function RecoveryMetrics() {
  const [recoveryData, setRecoveryData] = useState<RecoveryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"1m" | "3m" | "6m">("3m");

  useEffect(() => {
    fetchRecoveryData();
  }, [period]);

  const fetchRecoveryData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/recovery-metrics?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setRecoveryData(data);
      }
    } catch (error) {
      console.error("Failed to fetch recovery metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-amber-400";
      case "stable":
        return "text-amber-400";
      case "declining":
        return "text-red-400";
      default:
        return "text-neutral-400";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return "";
      case "stable":
        return "";
      case "declining":
        return "";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Recovery Metrics</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-400">Loading recovery data...</div>
        </div>
      </div>
    );
  }

  if (!recoveryData || recoveryData.data.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Recovery Metrics</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-400">No recovery data available</div>
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
            <Heart className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Recovery Metrics</h2>
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
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Recovery Score</span>
            </div>
            <div className="text-2xl font-black text-white">
              {Math.round(recoveryData.averageRecovery)}
              <span className="text-sm text-neutral-400 ml-1">/100</span>
            </div>
          </div>

          <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Avg Sleep</span>
            </div>
            <div className="text-2xl font-black text-white">
              {Math.round(recoveryData.averageSleep * 10) / 10}
              <span className="text-sm text-neutral-400 ml-1">/10</span>
            </div>
          </div>

          <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Avg HRV</span>
            </div>
            <div className="text-2xl font-black text-white">
              {Math.round(recoveryData.averageHRV)}
              <span className="text-sm text-neutral-400 ml-1">ms</span>
            </div>
          </div>

          <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Trend</span>
            </div>
            <div className={`text-xl font-black ${getTrendColor(recoveryData.trend)}`}>
              {getTrendIcon(recoveryData.trend)} {recoveryData.trend}
            </div>
          </div>
        </div>

        <Suspense fallback={<ChartSkeleton />}>
          <RecoveryMetricsRender data={recoveryData.data} />
        </Suspense>

        {/* Recommendation Card */}
        {recoveryData.recommendation && (
          <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black uppercase tracking-wider text-amber-300 mb-1">Recovery Recommendation</h4>
                <p className="text-sm text-neutral-300">{recoveryData.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-xs text-neutral-400 border-t-2 border-neutral-800 pt-4">
          <p className="mb-2">
            <strong className="text-neutral-300 uppercase tracking-wider font-black">Recovery Score:</strong> Composite metric based on sleep
            quality (40%), HRV (30%), and inverse soreness (30%). Higher scores indicate better recovery.
          </p>
          <p>
            <strong className="text-neutral-300 uppercase tracking-wider font-black">HRV (Heart Rate Variability):</strong> Simulated metric
            representing autonomic nervous system balance. Higher values indicate better recovery capacity.
          </p>
        </div>
      </div>
    </div>
  );
}