"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Target, TrendingUp, AlertCircle } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const TrainingDistributionRender = lazy(() => import("./training-distribution-render"));

interface MuscleDistribution {
  name: string;
  volume: number;
  percentage: number;
  color: string;
}

interface DistributionStats {
  totalVolume: number;
  mostTrained: string;
  leastTrained: string;
  balance: "excellent" | "good" | "unbalanced";
}

export default function TrainingDistribution() {
  const { data: session } = useSession();
  const [distribution, setDistribution] = useState<MuscleDistribution[]>([]);
  const [stats, setStats] = useState<DistributionStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"30d" | "90d" | "1y">("30d");
  const [_isLoading, setIsLoading] = useState(true);

  const muscleColors = {
    Chest: "#d97706",
    Back: "#E5A155",
    Legs: "#f59e0b",
    Shoulders: "#d97706",
    Arms: "#E5A155",
    Core: "#f59e0b",
  };

  const loadDistribution = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/distribution?period=${selectedPeriod}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setDistribution(result.distribution);
      setStats(result.stats);
    } catch (error) {
      console.error("Failed to load distribution:", error);
      // Fallback to mock data on error
      const mockData = generateMockDistribution();
      setDistribution(mockData);
      setStats(calculateStats(mockData));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadDistribution();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, selectedPeriod]);

  const generateMockDistribution = (): MuscleDistribution[] => {
    const baseDistribution = {
      Legs: 30 + Math.random() * 10,
      Back: 25 + Math.random() * 8,
      Chest: 20 + Math.random() * 8,
      Shoulders: 12 + Math.random() * 6,
      Arms: 8 + Math.random() * 5,
      Core: 5 + Math.random() * 3,
    };

    const total = Object.values(baseDistribution).reduce((sum, val) => sum + val, 0);

    return Object.entries(baseDistribution).map(([name, volume]) => ({
      name,
      volume: Math.round(volume * 100),
      percentage: Math.round((volume / total) * 100),
      color: muscleColors[name as keyof typeof muscleColors],
    }));
  };

  const calculateStats = (data: MuscleDistribution[]): DistributionStats => {
    const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
    
    const sorted = [...data].sort((a, b) => b.volume - a.volume);
    const mostTrained = sorted[0].name;
    const leastTrained = sorted[sorted.length - 1].name;

    // Calculate balance score based on standard deviation
    const mean = totalVolume / data.length;
    const variance = data.reduce((sum, item) => sum + Math.pow(item.volume - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / mean) * 100;

    let balance: "excellent" | "good" | "unbalanced";
    if (coefficientOfVariation < 30) balance = "excellent";
    else if (coefficientOfVariation < 50) balance = "good";
    else balance = "unbalanced";

    return {
      totalVolume,
      mostTrained,
      leastTrained,
      balance,
    };
  };

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: MuscleDistribution }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900 border-2 border-neutral-800 p-3">
          <p className="font-black uppercase tracking-wider text-white mb-1">{data.name}</p>
          <p className="text-sm text-neutral-300">{data.volume.toLocaleString()} kg</p>
          <p className="text-sm text-neutral-400">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if too small

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-black"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getBalanceColor = (balance: string) => {
    if (balance === "excellent") return "text-amber-400";
    if (balance === "good") return "text-amber-400";
    return "text-red-400";
  };

  const getBalanceIcon = (balance: string) => {
    if (balance === "excellent") return "";
    if (balance === "good") return "~";
    return "!";
  };

  const getRecommendations = (): string[] => {
    if (!stats) return [];

    const recommendations: string[] = [];
    
    if (stats.balance === "unbalanced") {
      recommendations.push(` Consider increasing ${stats.leastTrained} volume for better balance`);
    }

    const leastTrainedItem = distribution.find(d => d.name === stats.leastTrained);
    if (leastTrainedItem && leastTrainedItem.percentage < 10) {
      recommendations.push(` ${stats.leastTrained} is undertrained - aim for at least 15% of total volume`);
    }

    const mostTrainedItem = distribution.find(d => d.name === stats.mostTrained);
    if (mostTrainedItem && mostTrainedItem.percentage > 40) {
      recommendations.push(` ${stats.mostTrained} volume is very high - ensure recovery is adequate`);
    }

    if (recommendations.length === 0) {
      recommendations.push(" Great training balance! Keep up the excellent work.");
    }

    return recommendations;
  };

  return (
    <div className="bg-neutral-900 backdrop-blur-sm p-6 border-2 border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-950/10">
            <Target className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Training Distribution</h3>
            <p className="text-sm text-neutral-400">Volume breakdown by muscle group</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(["30d", "90d", "1y"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-sm font-black uppercase tracking-wider transition-colors ${
                selectedPeriod === period
                  ? "bg-amber-950/20 text-amber-400 border-2 border-amber-700/30"
                  : "bg-neutral-900 text-neutral-400 hover:text-neutral-300 border-2 border-neutral-800"
              }`}
            >
              {period === "30d" ? "30 Days" : period === "90d" ? "90 Days" : "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-900 p-4 border-2 border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Total Volume</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.totalVolume.toLocaleString()}</p>
            <p className="text-xs text-neutral-500">kg lifted</p>
          </div>

          <div className="bg-neutral-900 p-4 border-2 border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Most Trained</span>
            </div>
            <p className="text-2xl font-black text-white">{stats.mostTrained}</p>
            <p className="text-xs text-neutral-500">
              {distribution.find(d => d.name === stats.mostTrained)?.percentage}% of total
            </p>
          </div>

          <div className="bg-neutral-900 p-4 border-2 border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-black ${getBalanceColor(stats.balance)}`}>
                {getBalanceIcon(stats.balance)}
              </span>
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Balance</span>
            </div>
            <p className={`text-2xl font-black capitalize ${getBalanceColor(stats.balance)}`}>
              {stats.balance}
            </p>
            <p className="text-xs text-neutral-500">distribution score</p>
          </div>
        </div>
      )}

      {/* Donut Chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <TrainingDistributionRender distribution={distribution} />
      </Suspense>

      {/* Volume Breakdown Table */}
      <div className="bg-neutral-900 p-4 border-2 border-neutral-800 mb-6">
        <h4 className="text-sm font-black uppercase tracking-wider text-neutral-300 mb-3">Detailed Breakdown</h4>
        <div className="space-y-2">
          {distribution.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm text-white font-black">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-400">{item.volume.toLocaleString()} kg</span>
                  <span className="text-sm text-neutral-500 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-32 bg-neutral-800 h-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            {getRecommendations().map((rec, index) => (
              <p key={index} className="text-sm text-neutral-300">{rec}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
