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
    <div className="bg-neutral-900 border-2 border-neutral-800 overflow-hidden shadow-lg">
      {/* Card Header */}
      <div
        className="p-4 cursor-pointer hover:bg-amber-900/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-black uppercase tracking-wider text-white">{workout.name}</h3>
              {workout.templateName && (
                <span className="px-2 py-1 bg-amber-950/50 text-amber-400 text-xs border-2 border-amber-800/50 uppercase tracking-wider font-bold">
                  {workout.templateName}
                </span>
              )}
              {prCount > 0 && (
                <span className="px-2 py-1 bg-amber-950/50 text-amber-400 text-xs border-2 border-amber-800/50 flex items-center gap-1 uppercase tracking-wider font-bold">
                  <Award className="w-3 h-3" />
                  {prCount} PR{prCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(workout.date)}</span>
                <span className="ml-1 text-neutral-500">at {formatTime(workout.date)}</span>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-amber-900/20 border-2 border-amber-800/50 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center">
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
            <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold">{workout.duration}m</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Duration</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-amber-400">{workout.xpEarned}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">XP Earned</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-amber-400">
              {(workout.totalVolume / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Total Volume</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-amber-400">{workout.exercises.length}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Techniques</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-amber-400">{totalSets}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Total Sets</div>
          </div>
        </div>

        {workout.averageRPE && (
          <div className="mt-3 p-2 bg-neutral-900 border-2 border-neutral-800 text-sm text-center">
            <span className="uppercase tracking-wider font-bold">Average RPE:</span> <span className="font-bold text-amber-400">{workout.averageRPE.toFixed(1)}</span> / 10
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t-2 border-neutral-800">
          {/* Workout Notes */}
          {workout.notes && (
            <div className="p-4 bg-amber-950/20 border-b-2 border-neutral-800">
              <h4 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-wider">Battle Notes</h4>
              <p className="text-sm text-neutral-300">{workout.notes}</p>
            </div>
          )}

          {/* Exercises */}
          <div className="p-4 space-y-3">
            <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
              Techniques ({workout.exercises.length})
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
                  className="bg-neutral-900 border-2 border-neutral-800 overflow-hidden"
                >
                  {/* Exercise Header */}
                  <div
                    className="p-3 cursor-pointer hover:bg-amber-900/10 transition-colors"
                    onClick={() => toggleExercise(exercise.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-amber-950/50 text-amber-400 px-2 py-0.5 border-2 border-amber-800/50 font-bold uppercase tracking-wider">
                            {index + 1}
                          </span>
                          <h5 className="font-bold uppercase tracking-wider">{exercise.name}</h5>
                          {exercise.sets.some((s) => s.isPR) && (
                            <span className="text-xs bg-amber-950/50 text-amber-400 px-2 py-0.5 border-2 border-amber-800/50 font-bold uppercase tracking-wider">
                              PR!
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
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

                      <button className="p-1 hover:bg-amber-900/20 border-2 border-amber-800/50 transition-colors">
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
                    <div className="border-t-2 border-neutral-800 p-3 bg-neutral-950">
                      {/* Sets Table Header */}
                      <div className="grid grid-cols-5 gap-2 mb-2 text-xs font-bold text-neutral-400 uppercase tracking-wider overflow-x-auto">
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
                          className={`grid grid-cols-5 gap-2 py-2 text-sm border-t-2 border-neutral-900 ${
                            set.isPR ? 'bg-amber-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{set.setNumber}</span>
                            {set.isPR && <Award className="w-3 h-3 text-amber-400" />}
                          </div>
                          <div className="text-right font-bold">{set.weight} lbs</div>
                          <div className="text-right font-bold">{set.reps}</div>
                          <div className="text-right text-neutral-400">
                            {(set.weight * set.reps).toLocaleString()} lbs
                          </div>
                          <div className="text-right">
                            {set.rpe ? (
                              <span
                                className={`
                                px-2 py-0.5 text-xs font-bold uppercase tracking-wider
                                ${set.rpe >= 9 ? 'bg-amber-950/50 border-2 border-amber-700 text-amber-400' : ''}
                                ${set.rpe >= 7 && set.rpe < 9 ? 'bg-amber-950/50 border-2 border-amber-600 text-amber-400' : ''}
                                ${set.rpe < 7 ? 'bg-amber-950/50 border-2 border-amber-500 text-amber-400' : ''}
                              `}
                              >
                                {set.rpe}
                              </span>
                            ) : (
                              <span className="text-neutral-600">-</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Exercise Notes */}
                      {exercise.notes && (
                        <div className="mt-3 p-2 bg-amber-950/20 border-2 border-amber-800/50 text-xs text-neutral-300">
                          <span className="font-bold text-amber-400 uppercase tracking-wider">Notes:</span> {exercise.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t-2 border-neutral-800 bg-neutral-950 flex gap-2">
            <button
              onClick={() => onCopyWorkout?.(workout.id)}
              className="flex-1 px-4 py-2 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-2 font-black uppercase tracking-wider"
            >
              <Copy className="w-4 h-4" />
              Copy Battle
            </button>
            <button
              onClick={() => onShareWorkout?.(workout.id)}
              className="flex-1 px-4 py-2 bg-amber-950/50 hover:bg-amber-900/50 border-2 border-amber-700 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center gap-2 font-black uppercase tracking-wider"
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
