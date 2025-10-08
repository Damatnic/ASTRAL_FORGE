import React from 'react';
import { Users, User, Dumbbell, TrendingUp, Award, Trophy } from 'lucide-react';

interface ActivityFiltersProps {
  selectedFilter: 'all' | 'friends' | 'personal';
  selectedType?: 'all' | 'WORKOUT_COMPLETED' | 'PR_ACHIEVED' | 'CHALLENGE_JOINED' | 'CHALLENGE_COMPLETED' | 'STREAK_MILESTONE' | 'GOAL_ACHIEVED' | 'PROGRAM_COMPLETED';
  onFilterChange: (filter: 'all' | 'friends' | 'personal') => void;
  onTypeChange?: (type: 'all' | 'WORKOUT_COMPLETED' | 'PR_ACHIEVED' | 'CHALLENGE_JOINED' | 'CHALLENGE_COMPLETED' | 'STREAK_MILESTONE' | 'GOAL_ACHIEVED' | 'PROGRAM_COMPLETED') => void;
}

export function ActivityFilters({
  selectedFilter,
  selectedType = 'all',
  onFilterChange,
  onTypeChange,
}: ActivityFiltersProps) {
  const filters = [
    { value: 'all' as const, label: 'All Activity', icon: Users },
    { value: 'friends' as const, label: 'Friends', icon: Users },
    { value: 'personal' as const, label: 'My Activity', icon: User },
  ];

  const activityTypes = [
    { value: 'all' as const, label: 'All Types', icon: Dumbbell },
    { value: 'WORKOUT_COMPLETED' as const, label: 'Workouts', icon: Dumbbell },
    { value: 'PR_ACHIEVED' as const, label: 'PRs', icon: TrendingUp },
    { value: 'STREAK_MILESTONE' as const, label: 'Streaks', icon: Award },
    { value: 'GOAL_ACHIEVED' as const, label: 'Goals', icon: Trophy },
    { value: 'CHALLENGE_COMPLETED' as const, label: 'Challenges', icon: Users },
    { value: 'PROGRAM_COMPLETED' as const, label: 'Programs', icon: Trophy },
  ];

  return (
    <div className="space-y-4">
      {/* Source Filters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Source</h3>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Type Filters */}
      {onTypeChange && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Activity Type</h3>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => onTypeChange(type.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    selectedType === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
