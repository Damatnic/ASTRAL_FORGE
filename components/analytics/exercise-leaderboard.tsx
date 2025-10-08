"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Repeat, Award, Dumbbell, Target } from "lucide-react";

interface ExerciseRanking {
  exerciseId: string;
  exerciseName: string;
  totalVolume: number;
  maxWeight: number;
  frequency: number;
  avgRPE: number;
  lastPerformed: string;
  volumeTrend: number;
}

interface LeaderboardData {
  byVolume: ExerciseRanking[];
  byStrength: ExerciseRanking[];
  byFrequency: ExerciseRanking[];
  totalExercises: number;
}

export default function ExerciseLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"volume" | "strength" | "frequency">("volume");
  const [period, setPeriod] = useState<"1m" | "3m" | "6m">("3m");

  useEffect(() => {
    fetchLeaderboardData();
  }, [period]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/exercise-leaderboard?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch exercise leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500 to-amber-600"; // Gold
      case 2:
        return "from-slate-300 to-slate-400"; // Silver
      case 3:
        return "from-orange-600 to-orange-700"; // Bronze
      default:
        return "from-slate-600 to-slate-700"; // Default
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "";
      case 2:
        return "";
      case 3:
        return "";
      default:
        return `#${rank}`;
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <span className="text-green-400"> +{trend}%</span>;
    if (trend < -5) return <span className="text-red-400"> {trend}%</span>;
    return <span className="text-slate-400"> {trend}%</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getActiveData = () => {
    if (!leaderboardData) return [];
    switch (activeTab) {
      case "volume":
        return leaderboardData.byVolume;
      case "strength":
        return leaderboardData.byStrength;
      case "frequency":
        return leaderboardData.byFrequency;
      default:
        return leaderboardData.byVolume;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Exercise Leaderboard</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading rankings...</div>
        </div>
      </div>
    );
  }

  if (!leaderboardData || leaderboardData.totalExercises === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Exercise Leaderboard</h2>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Award className="w-12 h-12 text-slate-600 mb-3" />
          <div className="text-slate-400">No exercise data available</div>
          <p className="text-sm text-slate-500 mt-2">Complete workouts to see rankings!</p>
        </div>
      </div>
    );
  }

  const activeData = getActiveData();

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Exercise Leaderboard</h2>
            <p className="text-xs text-slate-400">{leaderboardData.totalExercises} exercises tracked</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("1m")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              period === "1m"
                ? "bg-amber-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setPeriod("3m")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              period === "3m"
                ? "bg-amber-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setPeriod("6m")}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              period === "6m"
                ? "bg-amber-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            6M
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("volume")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "volume"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">By Volume</span>
        </button>
        <button
          onClick={() => setActiveTab("strength")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "strength"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="font-semibold">By Strength</span>
        </button>
        <button
          onClick={() => setActiveTab("frequency")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "frequency"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span className="font-semibold">By Frequency</span>
        </button>
      </div>

      {/* Rankings */}
      <div className="space-y-3">
        {activeData.slice(0, 10).map((exercise, index) => {
          const rank = index + 1;
          return (
            <div
              key={exercise.exerciseId}
              className={`bg-gradient-to-r ${
                rank <= 3 ? getRankColor(rank) + " bg-opacity-10" : "from-slate-800/30 to-slate-800/10"
              } border ${
                rank <= 3 ? "border-amber-500/30" : "border-slate-700/50"
              } rounded-lg p-4 hover:border-slate-600 transition-colors`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${getRankColor(
                    rank
                  )} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">{getRankBadge(rank)}</span>
                </div>

                {/* Exercise Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow min-w-0">
                      <h3 className="text-white font-semibold truncate">{exercise.exerciseName}</h3>
                      <p className="text-xs text-slate-400">Last: {formatDate(exercise.lastPerformed)}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      {activeTab === "volume" && (
                        <>
                          <div className="text-xl font-bold text-amber-400">
                            {Math.round(exercise.totalVolume).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400">kg total</div>
                        </>
                      )}
                      {activeTab === "strength" && (
                        <>
                          <div className="text-xl font-bold text-amber-400">{exercise.maxWeight}</div>
                          <div className="text-xs text-slate-400">kg max</div>
                        </>
                      )}
                      {activeTab === "frequency" && (
                        <>
                          <div className="text-xl font-bold text-amber-400">{exercise.frequency}</div>
                          <div className="text-xs text-slate-400">sessions</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900/50 rounded px-2 py-1">
                      <div className="text-xs text-slate-500">Volume</div>
                      <div className="text-sm font-semibold text-slate-300">
                        {Math.round(exercise.totalVolume / 1000)}k
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded px-2 py-1">
                      <div className="text-xs text-slate-500">Max</div>
                      <div className="text-sm font-semibold text-slate-300">{exercise.maxWeight}kg</div>
                    </div>
                    <div className="bg-slate-900/50 rounded px-2 py-1">
                      <div className="text-xs text-slate-500">Freq</div>
                      <div className="text-sm font-semibold text-slate-300">{exercise.frequency}x</div>
                    </div>
                  </div>

                  {/* Trend & RPE */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Trend:</span>
                      {getTrendIcon(exercise.volumeTrend)}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Avg RPE:</span>
                      <span className="text-slate-300 font-semibold">{exercise.avgRPE.toFixed(1)}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {activeData.length > 10 && (
        <div className="text-xs text-slate-400 text-center mt-4 pt-4 border-t border-slate-700">
          Showing top 10 of {activeData.length} exercises
        </div>
      )}
    </div>
  );
}