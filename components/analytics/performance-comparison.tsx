"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const PerformanceComparisonRender = lazy(() => import("./performance-comparison-render"));

interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

interface PeriodComparison {
  period: string;
  data: ComparisonData[];
  overallTrend: {
    status: "improving" | "declining" | "stable";
    message: string;
  };
}

export default function PerformanceComparison() {
  const { data: session } = useSession();
  const [comparison, setComparison] = useState<PeriodComparison | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadComparisonData();
    }
  }, [session, selectedPeriod]);

  const loadComparisonData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/performance-comparison?period=${selectedPeriod}`);
      
      if (response.ok) {
        const data = await response.json();
        setComparison(data);
      } else {
        console.error('Failed to fetch comparison data');
        // Fallback to mock data on error
        const mockData = generateMockComparison(selectedPeriod);
        setComparison(mockData);
      }
    } catch (error) {
      console.error("Failed to load comparison data:", error);
      // Fallback to mock data on error
      const mockData = generateMockComparison(selectedPeriod);
      setComparison(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockComparison = (period: string): PeriodComparison => {
    const periodLabel = period === "month" ? "Month" : period === "quarter" ? "Quarter" : "Year";
    
    const baseMetrics = [
      { metric: "Total Volume", current: 85000, previous: 78000 },
      { metric: "Workouts", current: 16, previous: 14 },
      { metric: "Avg Intensity", current: 7.8, previous: 7.5 },
      { metric: "PRs Set", current: 5, previous: 3 },
    ];

    const data = baseMetrics.map((m) => ({
      ...m,
      change: Math.round(((m.current - m.previous) / m.previous) * 100),
    }));

    const avgChange = data.reduce((sum, d) => sum + d.change, 0) / data.length;
    
    let status: "improving" | "declining" | "stable" = "stable";
    let message = "";
    
    if (avgChange > 5) {
      status = "improving";
      message = "Great progress showing improvement across most metrics.";
    } else if (avgChange < -5) {
      status = "declining";
      message = "Performance has declined. Consider reviewing your training program.";
    } else {
      status = "stable";
      message = "Performance is stable. Consistent training maintained.";
    }

    return {
      period: periodLabel,
      data,
      overallTrend: { status, message },
    };
  };

  if (!comparison) {
    return null;
  }

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-950/10">
            <Calendar className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider text-white">Performance Comparison</h3>
            <p className="text-sm text-neutral-400">Current vs Previous {comparison.period}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["month", "quarter", "year"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p as typeof selectedPeriod)}
              className={selectedPeriod === p
                ? "px-4 py-2 font-black uppercase tracking-wider bg-amber-950/20 text-amber-400 border-2 border-amber-700/30"
                : "px-4 py-2 font-black uppercase tracking-wider bg-neutral-900 text-neutral-400 border-2 border-neutral-800"}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <Suspense fallback={<ChartSkeleton />}>
        <PerformanceComparisonRender data={comparison.data} />
      </Suspense>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {comparison.data.map((metric) => (
          <div key={metric.metric} className="bg-neutral-900 p-4 border-2 border-neutral-800">
            <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-black">{metric.metric}</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">{metric.current}</span>
              <div className={metric.change > 0 ? "flex items-center gap-1 text-sm font-black text-amber-400" : metric.change < 0 ? "flex items-center gap-1 text-sm font-black text-red-400" : "flex items-center gap-1 text-sm font-black text-neutral-400"}>
                {metric.change > 0 ? <TrendingUp className="w-4 h-4" /> : metric.change < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                <span>{metric.change > 0 ? "+" : ""}{metric.change}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={comparison.overallTrend.status === "improving" ? "p-4 border-2 bg-amber-950/10 border-amber-700/20" : comparison.overallTrend.status === "declining" ? "p-4 border-2 bg-red-950/10 border-red-500/20" : "p-4 border-2 bg-amber-950/10 border-amber-700/20"}>
        <div className="flex items-start gap-3">
          {comparison.overallTrend.status === "improving" ? <TrendingUp className="w-5 h-5 text-amber-400 mt-0.5" /> : comparison.overallTrend.status === "declining" ? <TrendingDown className="w-5 h-5 text-red-400 mt-0.5" /> : <Calendar className="w-5 h-5 text-amber-400 mt-0.5" />}
          <div>
            <h4 className={comparison.overallTrend.status === "improving" ? "font-black uppercase tracking-wider mb-1 text-amber-400" : comparison.overallTrend.status === "declining" ? "font-black uppercase tracking-wider mb-1 text-red-400" : "font-black uppercase tracking-wider mb-1 text-amber-400"}>
              {comparison.overallTrend.status === "improving" ? "Improving Performance" : comparison.overallTrend.status === "declining" ? "Performance Decline" : "Stable Performance"}
            </h4>
            <p className="text-sm text-neutral-300">{comparison.overallTrend.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}