"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Trophy, TrendingUp, Calendar, Award, Filter } from "lucide-react";

interface PersonalRecord {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
  isAllTime: boolean;
}

export default function PersonalRecordsTimeline() {
  const { data: session } = useSession();
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PersonalRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "recent" | "alltime">("all");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  const [_isLoading, setIsLoading] = useState(true);

  const muscleGroups = ["all", "Chest", "Back", "Legs", "Shoulders", "Arms"];

  useEffect(() => {
    if (session?.user) {
      loadPersonalRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    filterRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, selectedFilter, selectedMuscle]);

  const loadPersonalRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analytics/personal-records');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      setRecords(result.records);
    } catch (error) {
      console.error("Failed to load personal records:", error);
      // Fallback to mock data on error
      const mockRecords = generateMockRecords();
      setRecords(mockRecords);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockRecords = (): PersonalRecord[] => {
    const exercises = [
      { name: "Bench Press", muscle: "Chest", baseWeight: 100 },
      { name: "Squat", muscle: "Legs", baseWeight: 140 },
      { name: "Deadlift", muscle: "Back", baseWeight: 160 },
      { name: "Overhead Press", muscle: "Shoulders", baseWeight: 60 },
      { name: "Barbell Row", muscle: "Back", baseWeight: 90 },
      { name: "Pull-ups", muscle: "Back", baseWeight: 0 },
      { name: "Dips", muscle: "Chest", baseWeight: 0 },
      { name: "Bicep Curl", muscle: "Arms", baseWeight: 30 },
    ];

    const records: PersonalRecord[] = [];
    const today = new Date();

    exercises.forEach((exercise, exIndex) => {
      // Generate 3-5 PRs per exercise over the past year
      const prCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < prCount; i++) {
        const daysAgo = Math.floor(Math.random() * 365);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        
        const progression = 1 + (i * 0.1); // 10% progression per PR
        const weight = Math.round(exercise.baseWeight * progression);
        const reps = Math.floor(Math.random() * 3) + 4; // 4-6 reps
        const estimated1RM = Math.round(weight * (1 + reps / 30));

        records.push({
          id: `${exIndex}-${i}`,
          exerciseName: exercise.name,
          weight,
          reps,
          estimated1RM,
          date: date.toISOString().split("T")[0],
          isAllTime: i === prCount - 1, // Last one is all-time PR
        });
      }
    });

    // Sort by date descending
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filterRecords = () => {
    let filtered = [...records];

    // Filter by time period
    if (selectedFilter === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(r => new Date(r.date) >= thirtyDaysAgo);
    } else if (selectedFilter === "alltime") {
      filtered = filtered.filter(r => r.isAllTime);
    }

    // Filter by muscle group
    if (selectedMuscle !== "all") {
      filtered = filtered.filter(r => {
        const exercise = r.exerciseName.toLowerCase();
        const muscle = selectedMuscle.toLowerCase();
        
        if (muscle === "chest") return exercise.includes("bench") || exercise.includes("dip") || exercise.includes("chest");
        if (muscle === "back") return exercise.includes("row") || exercise.includes("pull") || exercise.includes("deadlift");
        if (muscle === "legs") return exercise.includes("squat") || exercise.includes("leg");
        if (muscle === "shoulders") return exercise.includes("press") || exercise.includes("shoulder");
        if (muscle === "arms") return exercise.includes("curl") || exercise.includes("tricep") || exercise.includes("bicep");
        
        return true;
      });
    }

    setFilteredRecords(filtered);
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const getDaysAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getRecordStats = () => {
    const allTimeRecords = records.filter(r => r.isAllTime).length;
    const recentRecords = records.filter(r => {
      const date = new Date(r.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= thirtyDaysAgo;
    }).length;
    
    return { allTimeRecords, recentRecords, totalRecords: records.length };
  };

  const stats = getRecordStats();

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Personal Records</h3>
            <p className="text-sm text-gray-400">Your strength milestones over time</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === "all"
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                : "bg-slate-800/50 text-gray-400 hover:text-gray-300 border border-slate-700/30"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter("recent")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === "recent"
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                : "bg-slate-800/50 text-gray-400 hover:text-gray-300 border border-slate-700/30"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSelectedFilter("alltime")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === "alltime"
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                : "bg-slate-800/50 text-gray-400 hover:text-gray-300 border border-slate-700/30"
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">All-Time PRs</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.allTimeRecords}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Last 30 Days</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.recentRecords}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Total PRs</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalRecords}</p>
        </div>
      </div>

      {/* Muscle Group Filter */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <div className="flex gap-2 flex-wrap">
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedMuscle === muscle
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-slate-800/50 text-gray-400 hover:text-gray-300 border border-slate-700/30"
              }`}
            >
              {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Records Timeline */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No personal records found for selected filters</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 hover:border-yellow-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {record.isAllTime && (
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      {record.exerciseName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(record.date)}</span>
                      <span className="text-gray-600"></span>
                      <span>{getDaysAgo(record.date)}</span>
                    </div>
                  </div>
                </div>
                
                {record.isAllTime && (
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                    All-Time PR
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-6 mt-3 ml-11">
                <div>
                  <p className="text-2xl font-bold text-white">{record.weight}kg</p>
                  <p className="text-xs text-gray-500">x{record.reps} reps</p>
                </div>
                <div className="h-12 w-px bg-slate-700"></div>
                <div>
                  <p className="text-sm text-gray-400">Est. 1RM</p>
                  <p className="text-lg font-semibold text-blue-400">{record.estimated1RM}kg</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  );
}
