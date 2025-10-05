'use client';

import { useState } from 'react';
import WorkoutCalendar from '@/components/workout-calendar';
import WorkoutDetailCard from '@/components/workout-detail-card';
import ExercisePerformanceChart from '@/components/exercise-performance-chart';
import {
  Calendar,
  TrendingUp,
  Dumbbell,
  Clock,
  Flame,
  Award,
  BarChart3,
  Filter,
  Download,
} from 'lucide-react';

// Mock data (in real app, fetch from API)
const mockWorkouts = [
  {
    id: 'w1',
    name: 'Push Day A',
    date: new Date(2025, 9, 1, 14, 30),
    duration: 65,
    xpEarned: 450,
    totalVolume: 15240,
    exerciseCount: 5,
    setCount: 18,
    templateName: 'PPL Split',
    averageRPE: 7.8,
    exercises: [
      {
        id: 'e1',
        name: 'Barbell Bench Press',
        muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
        equipment: 'Barbell',
        sets: [
          { setNumber: 1, weight: 185, reps: 8, rpe: 7, isPR: false },
          { setNumber: 2, weight: 185, reps: 8, rpe: 8, isPR: false },
          { setNumber: 3, weight: 185, reps: 7, rpe: 8, isPR: false },
          { setNumber: 4, weight: 185, reps: 6, rpe: 9, isPR: false },
        ],
        notes: 'Felt strong today, next time try 190 lbs',
      },
      {
        id: 'e2',
        name: 'Incline Dumbbell Press',
        muscleGroups: ['Chest', 'Shoulders'],
        equipment: 'Dumbbell',
        sets: [
          { setNumber: 1, weight: 70, reps: 10, rpe: 7 },
          { setNumber: 2, weight: 70, reps: 9, rpe: 8 },
          { setNumber: 3, weight: 70, reps: 8, rpe: 8 },
        ],
      },
      {
        id: 'e3',
        name: 'Cable Fly',
        muscleGroups: ['Chest'],
        equipment: 'Cable',
        sets: [
          { setNumber: 1, weight: 40, reps: 12, rpe: 6 },
          { setNumber: 2, weight: 40, reps: 12, rpe: 7 },
          { setNumber: 3, weight: 40, reps: 11, rpe: 7 },
        ],
      },
      {
        id: 'e4',
        name: 'Overhead Press',
        muscleGroups: ['Shoulders', 'Triceps'],
        equipment: 'Barbell',
        sets: [
          { setNumber: 1, weight: 115, reps: 8, rpe: 8 },
          { setNumber: 2, weight: 115, reps: 7, rpe: 8 },
          { setNumber: 3, weight: 115, reps: 6, rpe: 9 },
        ],
      },
      {
        id: 'e5',
        name: 'Tricep Pushdown',
        muscleGroups: ['Triceps'],
        equipment: 'Cable',
        sets: [
          { setNumber: 1, weight: 60, reps: 12, rpe: 7 },
          { setNumber: 2, weight: 60, reps: 11, rpe: 7 },
          { setNumber: 3, weight: 60, reps: 10, rpe: 8 },
        ],
      },
    ],
    notes: 'Great workout, felt very pumped. Shoulder feels 100% recovered.',
  },
];

const mockExerciseData = [
  { date: '2025-09-01', weight: 185, volume: 5365, reps: 8, estimatedOneRM: 231, sets: 4 },
  { date: '2025-09-08', weight: 185, volume: 5550, reps: 8, estimatedOneRM: 231, sets: 4 },
  { date: '2025-09-15', weight: 190, volume: 5890, reps: 8, estimatedOneRM: 237, sets: 4 },
  { date: '2025-09-22', weight: 190, volume: 6080, reps: 8, estimatedOneRM: 237, sets: 4 },
  { date: '2025-09-29', weight: 195, volume: 6240, reps: 8, estimatedOneRM: 243, sets: 4 },
];

export default function WorkoutHistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('Barbell Bench Press');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate overall statistics
  const totalWorkouts = mockWorkouts.length;
  const totalXP = mockWorkouts.reduce((sum, w) => sum + w.xpEarned, 0);
  const totalVolume = mockWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
  const totalDuration = mockWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const avgDuration = totalDuration / (totalWorkouts || 1);
  const prCount = mockWorkouts.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce(
        (s, e) => s + e.sets.filter((set) => 'isPR' in set && set.isPR).length,
        0
      ),
    0
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const handleWorkoutClick = (workoutId: string) => {
    setSelectedWorkout(workoutId);
    console.log('Selected workout:', workoutId);
  };

  const handleCopyWorkout = (workoutId: string) => {
    console.log('Copy workout:', workoutId);
    // TODO: Implement copy workout functionality
  };

  const handleShareWorkout = (workoutId: string) => {
    console.log('Share workout:', workoutId);
    // TODO: Implement share workout functionality
  };

  const handleExportData = () => {
    console.log('Export data');
    // TODO: Implement data export functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="w-10 h-10 text-purple-400" />
              Workout History
            </h1>
            <p className="text-gray-400">
              Track your training progress and analyze performance trends
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 border border-gray-700"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date Range
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Muscle Group
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  <option>All muscle groups</option>
                  <option>Chest</option>
                  <option>Back</option>
                  <option>Legs</option>
                  <option>Shoulders</option>
                  <option>Arms</option>
                  <option>Core</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Template
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  <option>All templates</option>
                  <option>PPL Split</option>
                  <option>Upper/Lower</option>
                  <option>5x5 Strength</option>
                  <option>Custom workouts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Sort By
                </label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  <option>Most recent</option>
                  <option>Highest XP</option>
                  <option>Highest volume</option>
                  <option>Longest duration</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Overall Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-4 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Total Workouts</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalWorkouts}</div>
            <div className="text-xs text-gray-400 mt-1">All time</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Total XP</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalXP.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">
              Avg: {Math.round(totalXP / totalWorkouts)} per workout
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-4 rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Dumbbell className="w-5 h-5" />
              <span className="text-sm font-medium">Total Volume</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {(totalVolume / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-gray-400 mt-1">lbs lifted</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Training Time</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {Math.round(totalDuration / 60)}h
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Avg: {Math.round(avgDuration)}m per workout
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-4 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="text-3xl font-bold text-white">7</div>
            <div className="text-xs text-gray-400 mt-1">days in a row</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 p-4 rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Total PRs</span>
            </div>
            <div className="text-3xl font-bold text-white">{prCount}</div>
            <div className="text-xs text-gray-400 mt-1">Personal records</div>
          </div>
        </div>

        {/* Calendar View */}
        <WorkoutCalendar
          workouts={mockWorkouts}
          onDateClick={handleDateClick}
          onWorkoutClick={handleWorkoutClick}
        />

        {/* Exercise Performance Trends */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-purple-400" />
              Exercise Performance Trends
            </h2>

            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option>Barbell Bench Press</option>
              <option>Barbell Squat</option>
              <option>Barbell Deadlift</option>
              <option>Overhead Press</option>
              <option>Barbell Row</option>
            </select>
          </div>

          <ExercisePerformanceChart
            exerciseName={selectedExercise}
            data={mockExerciseData}
          />
        </div>

        {/* Recent Workouts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-purple-400" />
            Recent Workouts
          </h2>

          <div className="space-y-4">
            {mockWorkouts.map((workout) => (
              <WorkoutDetailCard
                key={workout.id}
                workout={workout}
                onCopyWorkout={handleCopyWorkout}
                onShareWorkout={handleShareWorkout}
              />
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium">
            Load More Workouts
          </button>
        </div>
      </div>
    </div>
  );
}
