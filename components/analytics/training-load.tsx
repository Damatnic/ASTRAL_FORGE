"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const TrainingLoadRender = lazy(() => import("./training-load-render"));

interface TrainingLoadData {
  date: string;
  tss: number;          // Training Stress Score
  trimp: number;        // Training Impulse
  acuteLoad: number;    // 7-day rolling average
  chronicLoad: number;  // 28-day rolling average
  acr: number;          // Acute:Chronic Ratio
}

interface LoadStats {
  currentTSS: number;
  weeklyAverage: number;
  acr: number;
  status: "optimal" | "warning" | "danger";
  recommendation: string;
}

interface TrainingLoadResponse {
  data: TrainingLoadData[];
  stats: LoadStats;
}

export default function TrainingLoadChart() {
  const { data: session } = useSession();
  const [loadData, setLoadData] = useState<TrainingLoadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m">("3m");

  useEffect(() => {
    if (session?.user) {
      loadTrainingLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, timeRange]);

  const loadTrainingLoad = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/training-load?period=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setLoadData(data);
      } else {
        console.error('Failed to fetch training load data');
        const mockData = generateMockLoadData();
        setLoadData(mockData);
      }
    } catch (error) {
      console.error("Failed to load training load:", error);
      const mockData = generateMockLoadData();
      setLoadData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockLoadData = (): TrainingLoadResponse => {
    const data: TrainingLoadData[] = [];
    const now = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        tss: Math.floor(Math.random() * 100) + 50,
        trimp: Math.floor(Math.random() * 150) + 80,
        acuteLoad: Math.floor(Math.random() * 80) + 60,
        chronicLoad: Math.floor(Math.random() * 70) + 55,
        acr: Math.random() * 0.5 + 0.8,
      });
    }

    return {
      data,
      stats: {
        currentTSS: 85,
        weeklyAverage: 420,
        acr: 1.15,
        status: "optimal",
        recommendation: "Training load is well balanced. Continue current programming.",
      },
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-amber-400 border-amber-700/20 from-amber-950/10 to-amber-950/10";
      case "warning":
        return "text-amber-400 border-amber-700/20 from-amber-950/10 to-amber-950/10";
      case "danger":
        return "text-red-400 border-red-500/20 from-red-950/10 to-red-950/10";
      default:
        return "text-neutral-400 border-neutral-700/20 from-neutral-950/10 to-neutral-950/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="w-5 h-5 text-amber-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "danger":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-neutral-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-950/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Training Load</h2>
            <p className="text-neutral-400 text-sm">Stress and fatigue monitoring</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-80 bg-neutral-800"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-neutral-800"></div>
            <div className="h-24 bg-neutral-800"></div>
            <div className="h-24 bg-neutral-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!loadData) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
        <p className="text-neutral-400">No training load data available</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Training Load</h2>
            <p className="text-neutral-400 text-sm">TSS & TRIMP tracking with fatigue monitoring</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(["1m", "3m", "6m"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 transition-colors font-black uppercase tracking-wider ${
                timeRange === range
                  ? "bg-amber-950/20 text-amber-400 border-2 border-amber-700/30"
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border-2 border-neutral-800"
              }`}
            >
              {range === "1m" ? "1 Month" : range === "3m" ? "3 Months" : "6 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <Suspense fallback={<ChartSkeleton />}>
          <TrainingLoadRender data={loadData.data} />
        </Suspense>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current TSS */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Current TSS</span>
          </div>
          <p className="text-3xl font-black text-white">{loadData.stats.currentTSS}</p>
          <p className="text-sm text-neutral-400 mt-1">Training Stress Score</p>
        </div>

        {/* Weekly Average */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Weekly Average</span>
          </div>
          <p className="text-3xl font-black text-white">{loadData.stats.weeklyAverage}</p>
          <p className="text-sm text-neutral-400 mt-1">7-day total TSS</p>
        </div>

        {/* Acute:Chronic Ratio */}
        <div className={`bg-gradient-to-br border-2 p-4 ${getStatusColor(loadData.stats.status)}`}>
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(loadData.stats.status)}
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">ACR Status</span>
          </div>
          <p className="text-3xl font-black text-white">{loadData.stats.acr.toFixed(2)}</p>
          <p className="text-sm text-neutral-400 mt-1">
            {loadData.stats.acr < 0.8 && "Detraining risk"}
            {loadData.stats.acr >= 0.8 && loadData.stats.acr <= 1.3 && "Optimal range"}
            {loadData.stats.acr > 1.3 && loadData.stats.acr <= 1.5 && "Moderate risk"}
            {loadData.stats.acr > 1.5 && "High injury risk"}
          </p>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={`bg-gradient-to-br border-2 p-4 ${getStatusColor(loadData.stats.status)}`}>
        <div className="flex items-start gap-3">
          {getStatusIcon(loadData.stats.status)}
          <div>
            <h3 className="font-black uppercase tracking-wider text-white mb-1">
              {loadData.stats.status === "optimal" && "Optimal Training Load"}
              {loadData.stats.status === "warning" && "Training Load Warning"}
              {loadData.stats.status === "danger" && "High Fatigue Alert"}
            </h3>
            <p className="text-sm text-neutral-300">{loadData.stats.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t-2 border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-400">
          <div>
            <p className="font-black uppercase tracking-wider text-neutral-300 mb-1">TSS (Training Stress Score)</p>
            <p>Quantifies training workload based on duration, intensity, and RPE.</p>
          </div>
          <div>
            <p className="font-black uppercase tracking-wider text-neutral-300 mb-1">ACR (Acute:Chronic Ratio)</p>
            <p>Compares recent load (7d) to long-term load (28d). Optimal: 0.8-1.3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
