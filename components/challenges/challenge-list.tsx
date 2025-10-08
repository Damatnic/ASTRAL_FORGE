'use client';

import React, { useState } from 'react';
import { ChallengeCard } from './challenge-card';
import { 
  Filter, Search, TrendingUp, Calendar, 
  Target, Clock, Zap, CheckCircle2, Star 
} from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'THIRTY_DAY' | 'DISTANCE' | 'CONSISTENCY' | 'STRENGTH' | 'ENDURANCE' | 'VOLUME' | 'CUSTOM';
  startDate: string;
  endDate: string;
  goal: number;
  unit: 'REPS' | 'MILES' | 'KILOMETERS' | 'WORKOUTS' | 'POUNDS' | 'KILOGRAMS' | 'MINUTES' | 'HOURS' | 'DAYS';
  isPremade: boolean;
  isActive: boolean;
  participantCount?: number;
  userProgress?: number;
  userRank?: number;
  isJoined?: boolean;
}

interface ChallengeListProps {
  challenges: Challenge[];
  onJoin?: (challengeId: string) => void;
  onLeave?: (challengeId: string) => void;
  onViewDetails?: (challengeId: string) => void;
  isLoading?: boolean;
  compact?: boolean;
}

type FilterType = 'all' | 'active' | 'upcoming' | 'joined' | 'featured';
type ChallengeTypeFilter = 'all' | 'THIRTY_DAY' | 'DISTANCE' | 'CONSISTENCY' | 'STRENGTH' | 'ENDURANCE' | 'VOLUME' | 'CUSTOM';

const filterOptions: { value: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'all', label: 'All Challenges', icon: Target },
  { value: 'active', label: 'Active Now', icon: Zap },
  { value: 'upcoming', label: 'Starting Soon', icon: Calendar },
  { value: 'joined', label: 'My Challenges', icon: CheckCircle2 },
  { value: 'featured', label: 'Featured', icon: Star },
];

const typeFilterOptions: { value: ChallengeTypeFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'all', label: 'All Types', icon: Target },
  { value: 'THIRTY_DAY', label: '30-Day', icon: Calendar },
  { value: 'DISTANCE', label: 'Distance', icon: TrendingUp },
  { value: 'CONSISTENCY', label: 'Consistency', icon: CheckCircle2 },
  { value: 'STRENGTH', label: 'Strength', icon: Zap },
  { value: 'ENDURANCE', label: 'Endurance', icon: Clock },
  { value: 'VOLUME', label: 'Volume', icon: Target },
  { value: 'CUSTOM', label: 'Custom', icon: Star },
];

export function ChallengeList({ 
  challenges, 
  onJoin, 
  onLeave, 
  onViewDetails,
  isLoading = false,
  compact = false 
}: ChallengeListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<ChallengeTypeFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredChallenges = challenges.filter(challenge => {
    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);
    const isUpcoming = startDate > now;
    const isExpired = endDate < now;
    const isOngoing = !isUpcoming && !isExpired && challenge.isActive;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !challenge.name.toLowerCase().includes(query) &&
        !challenge.description.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Status filter
    if (activeFilter === 'active' && !isOngoing) return false;
    if (activeFilter === 'upcoming' && !isUpcoming) return false;
    if (activeFilter === 'joined' && !challenge.isJoined) return false;
    if (activeFilter === 'featured' && !challenge.isPremade) return false;

    // Type filter
    if (activeTypeFilter !== 'all' && challenge.type !== activeTypeFilter) return false;

    return true;
  });

  const groupedChallenges = {
    featured: filteredChallenges.filter(c => c.isPremade && c.isActive),
    joined: filteredChallenges.filter(c => c.isJoined),
    active: filteredChallenges.filter(c => {
      const now = new Date();
      const startDate = new Date(c.startDate);
      const endDate = new Date(c.endDate);
      return startDate <= now && endDate >= now && c.isActive && !c.isJoined;
    }),
    upcoming: filteredChallenges.filter(c => {
      const now = new Date();
      const startDate = new Date(c.startDate);
      return startDate > now && !c.isJoined;
    }),
  };

  const shouldGroupChallenges = activeFilter === 'all' && !searchQuery && activeTypeFilter === 'all';

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-2/3 mb-3" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:border-gray-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
          {(activeFilter !== 'all' || activeTypeFilter !== 'all') && (
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
          )}
        </button>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
            {/* Status Filters */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = activeFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setActiveFilter(option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <label className="text-sm font-medium text-gray-400 mb-2 block">Type</label>
              <div className="flex flex-wrap gap-2">
                {typeFilterOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = activeTypeFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setActiveTypeFilter(option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear Filters */}
            {(activeFilter !== 'all' || activeTypeFilter !== 'all') && (
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setActiveTypeFilter('all');
                }}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {filteredChallenges.length} {filteredChallenges.length === 1 ? 'challenge' : 'challenges'}
        </span>
      </div>

      {/* Challenge Groups or Flat List */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No challenges found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : shouldGroupChallenges ? (
        <div className="space-y-8">
          {/* Featured Challenges */}
          {groupedChallenges.featured.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Featured Challenges
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedChallenges.featured.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={onJoin}
                    onLeave={onLeave}
                    onViewDetails={onViewDetails}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          )}

          {/* My Challenges */}
          {groupedChallenges.joined.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                My Challenges
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedChallenges.joined.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={onJoin}
                    onLeave={onLeave}
                    onViewDetails={onViewDetails}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Challenges */}
          {groupedChallenges.active.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Active Now
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedChallenges.active.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={onJoin}
                    onLeave={onLeave}
                    onViewDetails={onViewDetails}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Challenges */}
          {groupedChallenges.upcoming.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Starting Soon
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupedChallenges.upcoming.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={onJoin}
                    onLeave={onLeave}
                    onViewDetails={onViewDetails}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={onJoin}
              onLeave={onLeave}
              onViewDetails={onViewDetails}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}
