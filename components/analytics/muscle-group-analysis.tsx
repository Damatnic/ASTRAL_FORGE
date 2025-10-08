"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Target, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const MuscleGroupAnalysisRender = lazy(() => import("./muscle-group-analysis-render"));

interface MuscleGroupData {
  muscleGroup: string;
  volume: number;
  sets: number;
  percentage: number;
  color: string;
}

interface BalanceAnalysis {
  status: "balanced" | "minor-imbalance" | "major-imbalance";
  imbalances: Array<{
    primary: string;
    secondary: string;
    ratio: number;
    recommendation: string;
  }>;
}

interface MuscleGroupAnalysisData {
  muscleGroups: MuscleGroupData[];
  totalVolume: number;
  totalSets: number;
  balanceAnalysis: BalanceAnalysis;
}

const MUSCLE_GROUP_COLORS: Record<string, string> = {
  Chest: "#E5A155",
  Back: "#d97706",
  Shoulders: "#f59e0b",
  Legs: "#E5A155",
  Arms: "#d97706",
  Core: "#f59e0b",
  Other: "#737373",
};

export default function MuscleGroupAnalysis() {
  const [analysisData, setAnalysisData] = useState<MuscleGroupAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"1m" | "3m" | "6m">("3m");

  useEffect(() => {
    fetchAnalysisData();
  }, [period]);

  const fetchAnalysisData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/muscle-group-analysis?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data);
      }
    } catch (error) {
      console.error("Failed to fetch muscle group analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBalanceStatusColor = (status: string) => {
    switch (status) {
      case "balanced":
        return "text-amber-400 border-amber-700/20 from-amber-950/10";
      case "minor-imbalance":
        return "text-amber-400 border-amber-700/20 from-amber-950/10";
      case "major-imbalance":
        return "text-red-400 border-red-500/20 from-red-950/10";
      default:
        return "text-neutral-400 border-neutral-800 from-neutral-950/10";
    }
  };

  const getBalanceStatusIcon = (status: string) => {
    switch (status) {
      case "balanced":
        return <CheckCircle className="h-5 w-5" />;
      case "minor-imbalance":
        return <AlertTriangle className="h-5 w-5" />;
      case "major-imbalance":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getBalanceStatusLabel = (status: string) => {
    switch (status) {
      case "balanced":
        return "Well Balanced";
      case "minor-imbalance":
        return "Minor Imbalance";
      case "major-imbalance":
        return "Major Imbalance";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Muscle Group Analysis</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-400">Loading analysis...</div>
        </div>
      </div>
    );
  }

  if (!analysisData || analysisData.muscleGroups.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-950/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">Muscle Group Analysis</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Target className="w-12 h-12 text-neutral-600 mb-3" />
          <div className="text-neutral-400">No muscle group data available</div>
          <p className="text-sm text-neutral-500 mt-2">Complete workouts to see distribution!</p>
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
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">Muscle Group Analysis</h2>
            <p className="text-xs text-neutral-400">
              {analysisData.totalSets} sets • {Math.round(analysisData.totalVolume).toLocaleString()}kg total
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("1m")}
            className={`px-3 py-1 text-sm transition-colors font-black uppercase tracking-wider ${
              period === "1m"
                ? "bg-amber-950/20 text-amber-400 border-2 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-2 border-neutral-800"
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setPeriod("3m")}
            className={`px-3 py-1 text-sm transition-colors font-black uppercase tracking-wider ${
              period === "3m"
                ? "bg-amber-950/20 text-amber-400 border-2 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-2 border-neutral-800"
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setPeriod("6m")}
            className={`px-3 py-1 text-sm transition-colors font-black uppercase tracking-wider ${
              period === "6m"
                ? "bg-amber-950/20 text-amber-400 border-2 border-amber-700/30"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border-2 border-neutral-800"
            }`}
          >
            6M
          </button>
        </div>
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <MuscleGroupAnalysisRender muscleGroups={analysisData.muscleGroups} />
      </Suspense>

      {/* Balance Status */}
      <div className={`mt-6 bg-gradient-to-r border-2 p-4 ${getBalanceStatusColor(analysisData.balanceAnalysis.status)}`}>
        <div className="flex items-start gap-3">
          {getBalanceStatusIcon(analysisData.balanceAnalysis.status)}
          <div className="flex-grow">
            <h3 className="font-black uppercase tracking-wider mb-1">
              Training Balance: {getBalanceStatusLabel(analysisData.balanceAnalysis.status)}
            </h3>
            {analysisData.balanceAnalysis.imbalances.length === 0 ? (
              <p className="text-sm opacity-90">
                Your training is well balanced across muscle groups. Continue with current programming.
              </p>
            ) : (
              <div className="space-y-2">
                {analysisData.balanceAnalysis.imbalances.map((imbalance, index) => (
                  <div key={index} className="text-sm opacity-90">
                    <strong>
                      {imbalance.primary} vs {imbalance.secondary}
                    </strong>{" "}
                    ({imbalance.ratio.toFixed(1)}:1 ratio) - {imbalance.recommendation}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Muscle Group Breakdown */}
      <div className="mt-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-300 mb-3">Detailed Breakdown</h3>
        <div className="space-y-2">
          {analysisData.muscleGroups.map((group) => (
            <div key={group.muscleGroup} className="bg-neutral-900 p-3 border-2 border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4" style={{ backgroundColor: group.color }} />
                  <span className="font-black text-white">{group.muscleGroup}</span>
                </div>
                <span className="text-sm text-neutral-400">{group.percentage}% of total</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Volume:</span>{" "}
                  <span className="text-neutral-300 font-black">{Math.round(group.volume).toLocaleString()} kg</span>
                </div>
                <div>
                  <span className="text-neutral-500">Sets:</span>{" "}
                  <span className="text-neutral-300 font-black">{group.sets}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Avg/Set:</span>{" "}
                  <span className="text-neutral-300 font-black">
                    {Math.round(group.volume / group.sets).toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <div className="text-xs text-neutral-400 border-t-2 border-neutral-800 pt-4 mt-6">
        <p>
          <strong className="text-neutral-300 uppercase tracking-wider font-black">Balance Recommendations:</strong> Aim for relatively even distribution
          across opposing muscle groups (e.g., chest/back, quads/hamstrings). A 1.5:1 ratio or less is ideal for most
          muscle group pairings.
        </p>
      </div>
    </div>
  );
}