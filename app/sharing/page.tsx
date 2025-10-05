'use client';

import { useState } from 'react';
import { Share2, Library, TrendingUp, Users } from 'lucide-react';
import WorkoutShareModal from '@/components/workout-share-modal';
import PublicWorkoutLibrary, { PublicWorkout } from '@/components/public-workout-library';
import { WorkoutCardData } from '@/components/workout-share-card';

export default function SharingPage() {
  const [selectedTab, setSelectedTab] = useState<'my-shares' | 'library'>('my-shares');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedWorkoutForShare, setSelectedWorkoutForShare] = useState<WorkoutCardData | null>(
    null
  );

  // Mock data - would come from API
  const mockMyWorkouts: WorkoutCardData[] = [
    {
      id: 'workout-1',
      name: 'Push Day Hypertrophy',
      date: new Date('2025-10-03'),
      duration: 75,
      xpEarned: 1250,
      totalVolume: 18500,
      exercises: [
        {
          name: 'Bench Press',
          sets: 4,
          bestSet: { weight: 225, reps: 8, isPR: true },
          totalVolume: 7200,
        },
        {
          name: 'Incline Dumbbell Press',
          sets: 4,
          bestSet: { weight: 80, reps: 10 },
          totalVolume: 3200,
        },
        {
          name: 'Cable Flyes',
          sets: 3,
          bestSet: { weight: 50, reps: 15 },
          totalVolume: 2250,
        },
        {
          name: 'Overhead Press',
          sets: 4,
          bestSet: { weight: 135, reps: 6 },
          totalVolume: 3240,
        },
        {
          name: 'Lateral Raises',
          sets: 3,
          bestSet: { weight: 25, reps: 12 },
          totalVolume: 900,
        },
        {
          name: 'Tricep Pushdowns',
          sets: 3,
          bestSet: { weight: 70, reps: 15 },
          totalVolume: 3150,
        },
      ],
      notes: 'Great session! Hit a new bench PR and feeling strong on shoulders.',
      template: 'PPL - Push',
      prCount: 1,
      user: {
        username: 'You',
        level: 42,
        title: 'Iron Warrior',
      },
    },
    {
      id: 'workout-2',
      name: 'Leg Day Strength',
      date: new Date('2025-10-01'),
      duration: 90,
      xpEarned: 1580,
      totalVolume: 35200,
      exercises: [
        {
          name: 'Back Squat',
          sets: 5,
          bestSet: { weight: 315, reps: 5, isPR: true },
          totalVolume: 7875,
        },
        {
          name: 'Romanian Deadlift',
          sets: 4,
          bestSet: { weight: 275, reps: 8 },
          totalVolume: 8800,
        },
        {
          name: 'Leg Press',
          sets: 4,
          bestSet: { weight: 450, reps: 12 },
          totalVolume: 21600,
        },
        {
          name: 'Leg Curl',
          sets: 3,
          bestSet: { weight: 120, reps: 10 },
          totalVolume: 3600,
        },
        {
          name: 'Calf Raises',
          sets: 4,
          bestSet: { weight: 225, reps: 15 },
          totalVolume: 13500,
        },
      ],
      notes: 'Squats felt heavy but hit a PR!',
      template: 'Lower Body Strength',
      prCount: 1,
      user: {
        username: 'You',
        level: 42,
        title: 'Iron Warrior',
      },
    },
  ];

  const handleShareWorkout = (workout: WorkoutCardData) => {
    setSelectedWorkoutForShare(workout);
    setIsShareModalOpen(true);
  };

  const handleWorkoutClick = (workout: PublicWorkout) => {
    console.log('Workout clicked:', workout.id);
    // Navigate to workout detail page
  };

  const handleCloneWorkout = (workoutId: string) => {
    console.log('Cloning workout:', workoutId);
    // Clone workout to user's templates
  };

  const handleLikeWorkout = (workoutId: string) => {
    console.log('Liked workout:', workoutId);
    // Toggle like on workout
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Share2 className="w-10 h-10 text-purple-500" />
            Workout Sharing
          </h1>
          <p className="text-gray-300 text-lg">
            Share your achievements and discover workouts from the community
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-500/30 p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">My Shared Workouts</span>
            </div>
            <div className="text-3xl font-bold text-white">{mockMyWorkouts.length}</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-lg border border-green-500/30 p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Total Likes Received</span>
            </div>
            <div className="text-3xl font-bold text-white">1,247</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/20 rounded-lg border border-orange-500/30 p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Library className="w-5 h-5" />
              <span className="text-sm font-medium">Saved from Library</span>
            </div>
            <div className="text-3xl font-bold text-white">8</div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-lg border border-blue-500/30 p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Following</span>
            </div>
            <div className="text-3xl font-bold text-white">23</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setSelectedTab('my-shares')}
            className={`flex-1 px-4 py-3 rounded-md transition-colors font-medium flex items-center justify-center gap-2 ${
              selectedTab === 'my-shares'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Share2 className="w-4 h-4" />
            My Workouts
          </button>
          <button
            onClick={() => setSelectedTab('library')}
            className={`flex-1 px-4 py-3 rounded-md transition-colors font-medium flex items-center justify-center gap-2 ${
              selectedTab === 'library'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Library className="w-4 h-4" />
            Community Library
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {selectedTab === 'my-shares' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Shareable Workouts</h2>
                <p className="text-gray-400 text-sm">Click any workout to share</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockMyWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    onClick={() => handleShareWorkout(workout)}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 transition-all hover:shadow-lg cursor-pointer p-6"
                  >
                    {/* Workout Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{workout.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {workout.template && (
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                            {workout.template}
                          </span>
                        )}
                        {workout.prCount > 0 && (
                          <span className="px-2 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded text-xs text-yellow-400 font-semibold">
                            {workout.prCount} PR{workout.prCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-lg font-bold text-purple-400">{workout.duration}</div>
                        <div className="text-xs text-gray-400">Minutes</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {workout.xpEarned}
                        </div>
                        <div className="text-xs text-gray-400">XP</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {(workout.totalVolume / 1000).toFixed(1)}K
                        </div>
                        <div className="text-xs text-gray-400">lbs</div>
                      </div>
                      <div className="bg-gray-800/50 rounded p-2 text-center">
                        <div className="text-lg font-bold text-purple-400">
                          {workout.exercises.length}
                        </div>
                        <div className="text-xs text-gray-400">Exercises</div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-400">
                      {workout.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareWorkout(workout);
                      }}
                      className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium text-white flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Workout
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'library' && (
            <PublicWorkoutLibrary
              onWorkoutClick={handleWorkoutClick}
              onCloneWorkout={handleCloneWorkout}
              onLikeWorkout={handleLikeWorkout}
            />
          )}
        </div>
      </div>

      {/* Share Modal */}
      {selectedWorkoutForShare && (
        <WorkoutShareModal
          workout={selectedWorkoutForShare}
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedWorkoutForShare(null);
          }}
        />
      )}
    </div>
  );
}
