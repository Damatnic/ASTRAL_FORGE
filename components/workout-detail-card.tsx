'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  TrendingUp,
  Dumbbell,
  Activity,
  Award,
  Copy,
  Share2,
} from 'lucide-react';

// Types
interface WorkoutExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  muscleGroups: string[];
  equipment: string;
  notes?: string;
}

interface ExerciseSet {
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  isPR?: boolean;
}

interface WorkoutDetailCardProps {
  workout: {
    id: string;
    name: string;
    date: Date;
    duration: number; // minutes
    xpEarned: number;
    totalVolume: number;
    exercises: WorkoutExercise[];
    notes?: string;
    templateName?: string;
    averageRPE?: number;
  };
  onCopyWorkout?: (workoutId: string) => void;
  onShareWorkout?: (workoutId: string) => void;
}

export default function WorkoutDetailCard({
  workout,
  onCopyWorkout,
  onShareWorkout,
}: WorkoutDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const toggleExercise = (exerciseId: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedExercises(newExpanded);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const prCount = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.isPR).length,
    0
  );

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-purple-500/20 overflow-hidden shadow-lg">
      {/* Card Header */}
      <div
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{workout.name}</h3>
              {workout.templateName && (
                <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded border border-blue-500/30">
                  {workout.templateName}
                </span>
              )}
              {prCount > 0 && (
                <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded border border-yellow-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {prCount} PR{prCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(workout.date)}</span>
                <span className="ml-1 text-gray-500">at {formatTime(workout.date)}</span>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold">{workout.duration}m</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-purple-400">{workout.xpEarned}</div>
            <div className="text-xs text-gray-500">XP Earned</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-orange-400">
              {(workout.totalVolume / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-gray-500">Total Volume</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-blue-400">{workout.exercises.length}</div>
            <div className="text-xs text-gray-500">Exercises</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-green-400">{totalSets}</div>
            <div className="text-xs text-gray-500">Total Sets</div>
          </div>
        </div>

        {workout.averageRPE && (
          <div className="mt-3 p-2 bg-gray-700/30 rounded text-sm text-center">
            Average RPE: <span className="font-bold text-yellow-400">{workout.averageRPE.toFixed(1)}</span> / 10
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700">
          {/* Workout Notes */}
          {workout.notes && (
            <div className="p-4 bg-blue-900/10 border-b border-gray-700">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Workout Notes</h4>
              <p className="text-sm text-gray-300">{workout.notes}</p>
            </div>
          )}

          {/* Exercises */}
          <div className="p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Exercises ({workout.exercises.length})
            </h4>

            {workout.exercises.map((exercise, index) => {
              const isExerciseExpanded = expandedExercises.has(exercise.id);
              const exerciseVolume = exercise.sets.reduce(
                (sum, set) => sum + set.weight * set.reps,
                0
              );
              const avgRPE =
                exercise.sets.filter((s) => s.rpe).length > 0
                  ? exercise.sets.reduce((sum, s) => sum + (s.rpe || 0), 0) /
                    exercise.sets.filter((s) => s.rpe).length
                  : null;

              return (
                <div
                  key={exercise.id}
                  className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
                >
                  {/* Exercise Header */}
                  <div
                    className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExercise(exercise.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-bold">
                            {index + 1}
                          </span>
                          <h5 className="font-semibold">{exercise.name}</h5>
                          {exercise.sets.some((s) => s.isPR) && (
                            <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30">
                              PR!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{exercise.equipment}</span>
                          <span>•</span>
                          <span>{exercise.muscleGroups.join(', ')}</span>
                          <span>•</span>
                          <span>{exercise.sets.length} sets</span>
                          <span>•</span>
                          <span>{(exerciseVolume / 1000).toFixed(1)}K lbs</span>
                          {avgRPE && (
                            <>
                              <span>•</span>
                              <span>Avg RPE: {avgRPE.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        {isExerciseExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Exercise Sets */}
                  {isExerciseExpanded && (
                    <div className="border-t border-gray-700 p-3 bg-gray-900/30">
                      {/* Sets Table Header */}
                      <div className="grid grid-cols-5 gap-2 mb-2 text-xs font-semibold text-gray-400 uppercase overflow-x-auto">
                        <div>Set</div>
                        <div className="text-right">Weight</div>
                        <div className="text-right">Reps</div>
                        <div className="text-right">Volume</div>
                        <div className="text-right">RPE</div>
                      </div>

                      {/* Sets Data */}
                      {exercise.sets.map((set) => (
                        <div
                          key={set.setNumber}
                          className={`grid grid-cols-5 gap-2 py-2 text-sm border-t border-gray-800 ${
                            set.isPR ? 'bg-yellow-900/10' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{set.setNumber}</span>
                            {set.isPR && <Award className="w-3 h-3 text-yellow-500" />}
                          </div>
                          <div className="text-right font-medium">{set.weight} lbs</div>
                          <div className="text-right font-medium">{set.reps}</div>
                          <div className="text-right text-gray-400">
                            {(set.weight * set.reps).toLocaleString()} lbs
                          </div>
                          <div className="text-right">
                            {set.rpe ? (
                              <span
                                className={`
                                px-2 py-0.5 rounded text-xs font-medium
                                ${set.rpe >= 9 ? 'bg-red-900/30 text-red-400' : ''}
                                ${set.rpe >= 7 && set.rpe < 9 ? 'bg-orange-900/30 text-orange-400' : ''}
                                ${set.rpe < 7 ? 'bg-green-900/30 text-green-400' : ''}
                              `}
                              >
                                {set.rpe}
                              </span>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Exercise Notes */}
                      {exercise.notes && (
                        <div className="mt-3 p-2 bg-blue-900/10 rounded text-xs text-gray-300">
                          <span className="font-semibold text-blue-400">Notes:</span> {exercise.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/30 flex gap-2">
            <button
              onClick={() => onCopyWorkout?.(workout.id)}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Workout
            </button>
            <button
              onClick={() => onShareWorkout?.(workout.id)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
