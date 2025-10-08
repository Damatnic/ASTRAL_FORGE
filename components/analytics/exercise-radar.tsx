"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Target, TrendingUp } from "lucide-react";
import { ChartSkeleton } from "@/components/charts/chart-loading";

const ExerciseRadarRender = lazy(() => import("./exercise-radar-render"));

interface ExerciseMetrics {
  metric: string;
  value: number;
  fullMark: number;
}

interface ExerciseRadarData {
  exerciseName: string;
  muscleGroup: string;
  metrics: ExerciseMetrics[];
  summary: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
  };
}

export default function ExerciseRadar() {
  const { data: session } = useSession();
  const [radarData, setRadarData] = useState<ExerciseRadarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  useEffect(() => {
    if (session?.user) {
      loadExerciseList();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user && selectedExercise) {
      loadRadarData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, selectedExercise]);

  const loadExerciseList = async () => {
    try {
      const response = await fetch('/api/exercises');
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
        if (data.length > 0) {
          setSelectedExercise(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load exercise list:', error);
    }
  };

  const loadRadarData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/exercise-radar?exerciseId=${selectedExercise}`);
      
      if (response.ok) {
        const data = await response.json();
        setRadarData(data);
      } else {
        console.error('Failed to fetch radar data');
        // Fallback to mock data
        const mockData = generateMockRadarData();
        setRadarData(mockData);
      }
    } catch (error) {
      console.error("Failed to load radar data:", error);
      // Fallback to mock data
      const mockData = generateMockRadarData();
      setRadarData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockRadarData = (): ExerciseRadarData => {
    return {
      exerciseName: "Bench Press",
      muscleGroup: "Chest",
      metrics: [
        { metric: "Strength", value: 85, fullMark: 100 },
        { metric: "Volume", value: 75, fullMark: 100 },
        { metric: "Consistency", value: 90, fullMark: 100 },
        { metric: "Progression", value: 70, fullMark: 100 },
        { metric: "Intensity", value: 80, fullMark: 100 },
        { metric: "Technique", value: 65, fullMark: 100 },
      ],
      summary: {
        overallScore: 77.5,
        strengths: ["Consistency", "Strength"],
        weaknesses: ["Technique", "Progression"],
      },
    };
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-950/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Exercise Performance Radar</h2>
            <p className="text-neutral-400 text-sm">Multi-dimensional analysis</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-neutral-800"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-neutral-800"></div>
            <div className="h-16 bg-neutral-800"></div>
            <div className="h-16 bg-neutral-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!radarData) {
    return (
      <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
        <p className="text-neutral-400">No radar data available</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white">Exercise Performance Radar</h2>
            <p className="text-neutral-400 text-sm">
              {radarData.exerciseName} • {radarData.muscleGroup}
            </p>
          </div>
        </div>

        {/* Exercise Selector */}
        {exercises.length > 0 && (
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border-2 border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-black uppercase tracking-wider"
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        <Suspense fallback={<ChartSkeleton />}>
          <ExerciseRadarRender metrics={radarData.metrics} />
        </Suspense>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Score */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Overall Score</span>
          </div>
          <p className="text-3xl font-black text-white">
            {radarData.summary.overallScore.toFixed(1)}
            <span className="text-lg text-neutral-400">/100</span>
          </p>
        </div>

        {/* Strengths */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Strengths</span>
          </div>
          <div className="space-y-1">
            {radarData.summary.strengths.map((strength, idx) => (
              <p key={idx} className="text-sm text-amber-400">
                ✓ {strength}
              </p>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-950/10 border-2 border-amber-700/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-black">Areas to Improve</span>
          </div>
          <div className="space-y-1">
            {radarData.summary.weaknesses.map((weakness, idx) => (
              <p key={idx} className="text-sm text-amber-400">
                → {weakness}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
