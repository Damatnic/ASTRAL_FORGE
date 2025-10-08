'use client';

import React, { useState } from 'react';
import { 
  Trophy, Calendar, TrendingUp, Users, 
  Target, Clock, CheckCircle2, Star,
  ArrowRight, Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChallengeCardProps {
  challenge: {
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
  };
  onJoin?: (challengeId: string) => void;
  onLeave?: (challengeId: string) => void;
  onViewDetails?: (challengeId: string) => void;
  compact?: boolean;
}

const challengeTypeIcons = {
  THIRTY_DAY: Calendar,
  DISTANCE: TrendingUp,
  CONSISTENCY: CheckCircle2,
  STRENGTH: Zap,
  ENDURANCE: Clock,
  VOLUME: Target,
  CUSTOM: Star,
};

const challengeTypeColors = {
  THIRTY_DAY: 'from-purple-500 to-pink-500',
  DISTANCE: 'from-blue-500 to-cyan-500',
  CONSISTENCY: 'from-green-500 to-emerald-500',
  STRENGTH: 'from-red-500 to-orange-500',
  ENDURANCE: 'from-yellow-500 to-orange-500',
  VOLUME: 'from-indigo-500 to-purple-500',
  CUSTOM: 'from-gray-500 to-slate-500',
};

const challengeTypeLabels = {
  THIRTY_DAY: '30-Day Challenge',
  DISTANCE: 'Distance Goal',
  CONSISTENCY: 'Consistency Streak',
  STRENGTH: 'Strength Goal',
  ENDURANCE: 'Endurance Challenge',
  VOLUME: 'Volume Goal',
  CUSTOM: 'Custom Challenge',
};

const unitLabels = {
  REPS: 'reps',
  MILES: 'miles',
  KILOMETERS: 'km',
  WORKOUTS: 'workouts',
  POUNDS: 'lbs',
  KILOGRAMS: 'kg',
  MINUTES: 'min',
  HOURS: 'hrs',
  DAYS: 'days',
};

export function ChallengeCard({ 
  challenge, 
  onJoin, 
  onLeave, 
  onViewDetails,
  compact = false 
}: ChallengeCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = challengeTypeIcons[challenge.type];
  const gradientColor = challengeTypeColors[challenge.type];
  const typeLabel = challengeTypeLabels[challenge.type];
  const unitLabel = unitLabels[challenge.unit];

  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const now = new Date();
  const isUpcoming = startDate > now;
  const isExpired = endDate < now;
  const isOngoing = !isUpcoming && !isExpired && challenge.isActive;

  const daysRemaining = isOngoing 
    ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const progressPercentage = challenge.userProgress 
    ? Math.min(100, (challenge.userProgress / challenge.goal) * 100)
    : 0;

  const handleJoin = async () => {
    if (!onJoin || isJoining) return;
    setIsJoining(true);
    try {
      await onJoin(challenge.id);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!onLeave || isLeaving) return;
    setIsLeaving(true);
    try {
      await onLeave(challenge.id);
    } finally {
      setIsLeaving(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{challenge.name}</h3>
              <p className="text-sm text-gray-400">{typeLabel}</p>
            </div>
          </div>
          {challenge.isPremade && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded">
              Featured
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{challenge.goal} {unitLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participantCount || 0}</span>
          </div>
          {isOngoing && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{daysRemaining}d left</span>
            </div>
          )}
        </div>

        {challenge.isJoined && challenge.userProgress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">
                {challenge.userProgress} / {challenge.goal} {unitLabel}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-300`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => onViewDetails?.(challenge.id)}
          className="w-full py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${gradientColor} p-6`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{challenge.name}</h2>
              <p className="text-white/80 text-sm">{typeLabel}</p>
            </div>
          </div>
          {challenge.isPremade && (
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg flex items-center gap-1">
              <Star className="w-4 h-4" />
              Featured
            </span>
          )}
        </div>

        <p className="text-white/90 text-sm leading-relaxed">{challenge.description}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Goal</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {challenge.goal} {unitLabel}
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Participants</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {challenge.participantCount || 0}
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">
                {isUpcoming ? 'Starts' : isOngoing ? 'Started' : 'Ended'}
              </span>
            </div>
            <p className="text-sm font-medium text-white">
              {formatDistanceToNow(isUpcoming ? startDate : isOngoing ? startDate : endDate, { addSuffix: true })}
            </p>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-400">
                {isOngoing ? 'Time Left' : 'Duration'}
              </span>
            </div>
            <p className="text-sm font-medium text-white">
              {isOngoing 
                ? `${daysRemaining} days`
                : `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
              }
            </p>
          </div>
        </div>

        {/* User Progress (if joined) */}
        {challenge.isJoined && challenge.userProgress !== undefined && (
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-white">Your Progress</span>
              </div>
              {challenge.userRank && (
                <span className="text-sm text-gray-400">
                  Rank #{challenge.userRank}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {challenge.userProgress} / {challenge.goal} {unitLabel}
                </span>
                <span className="text-white font-medium">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isExpired && (
            <>
              {challenge.isJoined ? (
                <button
                  onClick={handleLeave}
                  disabled={isLeaving}
                  className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isLeaving ? 'Leaving...' : 'Leave Challenge'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={isJoining || !challenge.isActive}
                  className={`flex-1 py-3 bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white rounded-lg transition-opacity font-medium disabled:opacity-50`}
                >
                  {isJoining ? 'Joining...' : isUpcoming ? 'Join Challenge' : 'Join Now'}
                </button>
              )}
            </>
          )}
          
          <button
            onClick={() => onViewDetails?.(challenge.id)}
            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        {isExpired && (
          <div className="text-center py-2 bg-gray-700/30 rounded-lg">
            <span className="text-sm text-gray-400">This challenge has ended</span>
          </div>
        )}
      </div>
    </div>
  );
}
