'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Copy,
  Heart,
  MessageCircle,
  Calendar,
  Dumbbell,
  Clock,
  Trophy,
  Users,
} from 'lucide-react';

// Types
export interface PublicWorkout {
  id: string;
  name: string;
  description?: string;
  author: {
    username: string;
    level: number;
    avatar?: string;
    title?: string;
  };
  stats: {
    duration: number; // minutes
    exercises: number;
    totalVolume: number; // lbs
    xpEarned: number;
  };
  metrics: {
    likes: number;
    clones: number; // Times saved/copied
    views: number;
    comments: number;
  };
  rating: number; // 0-5
  ratingCount: number;
  tags: string[];
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  createdAt: Date;
  isFeatured?: boolean;
  isTrending?: boolean;
}

type SortOption = 'trending' | 'popular' | 'recent' | 'highest-rated';
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

interface PublicWorkoutLibraryProps {
  onWorkoutClick?: (workout: PublicWorkout) => void;
  onCloneWorkout?: (workoutId: string) => void;
  onLikeWorkout?: (workoutId: string) => void;
}

export default function PublicWorkoutLibrary({
  onWorkoutClick,
  onCloneWorkout,
  onLikeWorkout,
}: PublicWorkoutLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterDifficulty>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - would come from API in production
  const mockWorkouts: PublicWorkout[] = [
    {
      id: '1',
      name: 'PPL - Push Day Hypertrophy',
      description: 'High-volume push workout focusing on chest, shoulders, and triceps for maximum growth',
      author: {
        username: 'GymWarrior',
        level: 42,
        title: 'Mass Monster',
      },
      stats: {
        duration: 75,
        exercises: 6,
        totalVolume: 18500,
        xpEarned: 1250,
      },
      metrics: {
        likes: 847,
        clones: 423,
        views: 3241,
        comments: 52,
      },
      rating: 4.8,
      ratingCount: 156,
      tags: ['push', 'chest', 'hypertrophy', 'PPL'],
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      difficulty: 'intermediate',
      equipment: ['barbell', 'dumbbells', 'cables'],
      createdAt: new Date('2025-09-28'),
      isFeatured: true,
      isTrending: true,
    },
    {
      id: '2',
      name: 'Full Body Beginner Strength',
      description: 'Perfect starter program for building foundational strength with compound movements',
      author: {
        username: 'CoachMike',
        level: 56,
        title: 'Iron Mentor',
      },
      stats: {
        duration: 45,
        exercises: 5,
        totalVolume: 8200,
        xpEarned: 850,
      },
      metrics: {
        likes: 1234,
        clones: 892,
        views: 5621,
        comments: 89,
      },
      rating: 4.9,
      ratingCount: 287,
      tags: ['beginner', 'full-body', 'strength', 'compound'],
      muscleGroups: ['chest', 'back', 'legs', 'shoulders'],
      difficulty: 'beginner',
      equipment: ['barbell', 'bench'],
      createdAt: new Date('2025-09-25'),
      isFeatured: true,
      isTrending: true,
    },
    {
      id: '3',
      name: 'Leg Day Annihilation',
      description: 'Brutal leg workout for advanced lifters. Not for the faint of heart!',
      author: {
        username: 'SquatKing',
        level: 73,
        title: 'Legendary Lifter',
      },
      stats: {
        duration: 90,
        exercises: 8,
        totalVolume: 42000,
        xpEarned: 2100,
      },
      metrics: {
        likes: 623,
        clones: 287,
        views: 2134,
        comments: 76,
      },
      rating: 4.7,
      ratingCount: 93,
      tags: ['legs', 'quads', 'hamstrings', 'glutes', 'advanced'],
      muscleGroups: ['legs'],
      difficulty: 'advanced',
      equipment: ['barbell', 'leg-press', 'leg-curl'],
      createdAt: new Date('2025-09-30'),
      isTrending: true,
    },
    {
      id: '4',
      name: 'Upper Body Pump',
      description: 'Get that epic pump with this high-rep upper body session',
      author: {
        username: 'PumpChaser',
        level: 38,
        title: 'Hypertrophy Hero',
      },
      stats: {
        duration: 60,
        exercises: 7,
        totalVolume: 14200,
        xpEarned: 980,
      },
      metrics: {
        likes: 412,
        clones: 198,
        views: 1567,
        comments: 34,
      },
      rating: 4.6,
      ratingCount: 67,
      tags: ['upper-body', 'pump', 'volume'],
      muscleGroups: ['chest', 'back', 'shoulders', 'arms'],
      difficulty: 'intermediate',
      equipment: ['dumbbells', 'cables', 'machines'],
      createdAt: new Date('2025-10-01'),
    },
  ];

  // Filter and sort workouts
  const filteredWorkouts = mockWorkouts
    .filter((workout) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = workout.name.toLowerCase().includes(query);
        const matchesTags = workout.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesAuthor = workout.author.username.toLowerCase().includes(query);
        if (!matchesName && !matchesTags && !matchesAuthor) return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && workout.difficulty !== selectedDifficulty) {
        return false;
      }

      // Muscle group filter
      if (
        selectedMuscleGroup !== 'all' &&
        !workout.muscleGroups.includes(selectedMuscleGroup)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.metrics.views + b.metrics.clones * 2) - (a.metrics.views + a.metrics.clones * 2);
        case 'popular':
          return b.metrics.likes - a.metrics.likes;
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'highest-rated':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Render difficulty badge
  const renderDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-900/30 border-green-500/30 text-green-400',
      intermediate: 'bg-blue-900/30 border-blue-500/30 text-blue-400',
      advanced: 'bg-red-900/30 border-red-500/30 text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded border text-xs font-semibold ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    );
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-purple-500" />
          Public Workout Library
        </h2>
        <p className="text-gray-400">Discover and clone workouts from the community</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts, tags, or authors..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-white flex items-center gap-2 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="trending">🔥 Trending</option>
            <option value="popular">❤️ Most Popular</option>
            <option value="recent">🕒 Most Recent</option>
            <option value="highest-rated">⭐ Highest Rated</option>
          </select>

          {showFilters && (
            <>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as FilterDifficulty)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Muscle Groups</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="legs">Legs</option>
                <option value="shoulders">Shoulders</option>
                <option value="arms">Arms</option>
                <option value="core">Core</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-500/30 p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-1">
            <Dumbbell className="w-5 h-5" />
            <span className="text-sm font-medium">Total Workouts</span>
          </div>
          <div className="text-2xl font-bold text-white">{mockWorkouts.length}</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-lg border border-green-500/30 p-4">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Trending</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {mockWorkouts.filter((w) => w.isTrending).length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-lg border border-yellow-500/30 p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-1">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">Featured</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {mockWorkouts.filter((w) => w.isFeatured).length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-lg border border-blue-500/30 p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Contributors</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {new Set(mockWorkouts.map((w) => w.author.username)).size}
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-lg overflow-hidden cursor-pointer"
            onClick={() => onWorkoutClick?.(workout)}
          >
            {/* Badges */}
            {(workout.isFeatured || workout.isTrending) && (
              <div className="flex gap-2 p-3 bg-gray-900/50">
                {workout.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded text-xs font-semibold text-yellow-400 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                )}
                {workout.isTrending && (
                  <span className="px-2 py-1 bg-red-900/30 border border-red-500/30 rounded text-xs font-semibold text-red-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </span>
                )}
              </div>
            )}

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{workout.name}</h3>
                  {renderDifficultyBadge(workout.difficulty)}
                </div>
              </div>

              {/* Description */}
              {workout.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{workout.description}</p>
              )}

              {/* Author */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                  {workout.author.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{workout.author.username}</div>
                  <div className="text-xs text-gray-500">Level {workout.author.level}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-4 h-4" />
                  {workout.stats.duration} min
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Dumbbell className="w-4 h-4" />
                  {workout.stats.exercises} exercises
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Trophy className="w-4 h-4" />
                  {workout.stats.xpEarned} XP
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  {(workout.stats.totalVolume / 1000).toFixed(1)}K lbs
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                {renderStars(workout.rating)}
                <span className="text-sm text-gray-400">
                  {workout.rating.toFixed(1)} ({workout.ratingCount})
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {workout.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
                {workout.tags.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                    +{workout.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloneWorkout?.(workout.id);
                  }}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium text-white text-sm flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Clone
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLikeWorkout?.(workout.id);
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{workout.metrics.likes}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{workout.metrics.comments}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Workouts Found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
