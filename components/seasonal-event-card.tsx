'use client';

import { useState } from 'react';
import { Calendar, Clock, Trophy, Gift, Users, ChevronRight, Flame, Snowflake, Sun, Sparkles } from 'lucide-react';

// Types
export type EventTheme = 'summer' | 'winter' | 'spring' | 'fall' | 'newyear' | 'special';
export type EventStatus = 'upcoming' | 'active' | 'ending-soon' | 'ended';

export interface SeasonalEvent {
  id: string;
  name: string;
  theme: EventTheme;
  description: string;
  status: EventStatus;
  startDate: Date;
  endDate: Date;
  banner: string;
  questCount: number;
  participantCount: number;
  exclusiveRewards: string[];
  xpMultiplier: number; // 1.5 = 50% bonus
  completionPercentage?: number; // User's progress 0-100
}

interface SeasonalEventCardProps {
  event: SeasonalEvent;
  onViewDetails?: (eventId: string) => void;
  onJoinEvent?: (eventId: string) => void;
  compact?: boolean;
}

export default function SeasonalEventCard({
  event,
  onViewDetails,
  onJoinEvent,
  compact = false,
}: SeasonalEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Theme configurations
  const themeConfig = {
    summer: {
      icon: Sun,
      gradient: 'from-orange-600 to-yellow-500',
      bgGradient: 'from-orange-900/30 to-yellow-900/20',
      borderColor: 'border-orange-500/30',
      accentColor: 'text-orange-400',
      iconColor: 'text-orange-500',
    },
    winter: {
      icon: Snowflake,
      gradient: 'from-blue-600 to-cyan-500',
      bgGradient: 'from-blue-900/30 to-cyan-900/20',
      borderColor: 'border-blue-500/30',
      accentColor: 'text-blue-400',
      iconColor: 'text-blue-500',
    },
    spring: {
      icon: Sparkles,
      gradient: 'from-green-600 to-emerald-500',
      bgGradient: 'from-green-900/30 to-emerald-900/20',
      borderColor: 'border-green-500/30',
      accentColor: 'text-green-400',
      iconColor: 'text-green-500',
    },
    fall: {
      icon: Flame,
      gradient: 'from-red-600 to-orange-500',
      bgGradient: 'from-red-900/30 to-orange-900/20',
      borderColor: 'border-red-500/30',
      accentColor: 'text-red-400',
      iconColor: 'text-red-500',
    },
    newyear: {
      icon: Sparkles,
      gradient: 'from-purple-600 to-pink-500',
      bgGradient: 'from-purple-900/30 to-pink-900/20',
      borderColor: 'border-purple-500/30',
      accentColor: 'text-purple-400',
      iconColor: 'text-purple-500',
    },
    special: {
      icon: Trophy,
      gradient: 'from-yellow-600 to-amber-500',
      bgGradient: 'from-yellow-900/30 to-amber-900/20',
      borderColor: 'border-yellow-500/30',
      accentColor: 'text-yellow-400',
      iconColor: 'text-yellow-500',
    },
  };

  const theme = themeConfig[event.theme];
  const ThemeIcon = theme.icon;

  // Status badge configuration
  const statusConfig = {
    upcoming: { text: 'Coming Soon', color: 'bg-gray-600 text-gray-200' },
    active: { text: 'Active Now', color: 'bg-green-600 text-white animate-pulse' },
    'ending-soon': { text: 'Ending Soon', color: 'bg-red-600 text-white animate-pulse' },
    ended: { text: 'Ended', color: 'bg-gray-700 text-gray-400' },
  };

  const statusBadge = statusConfig[event.status];

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const targetDate = event.status === 'upcoming' ? event.startDate : event.endDate;
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) return 'Event ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (compact) {
    return (
      <div
        className={`bg-gradient-to-br ${theme.bgGradient} rounded-lg border ${theme.borderColor} p-4 cursor-pointer hover:scale-[1.02] transition-transform`}
        onClick={() => onViewDetails?.(event.id)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-br ${theme.gradient} rounded-lg`}>
            <ThemeIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{event.name}</h3>
            <p className="text-sm text-gray-400">{getTimeRemaining()}</p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${theme.bgGradient} rounded-lg border ${theme.borderColor} overflow-hidden transition-all ${
        isHovered ? 'shadow-xl scale-[1.02]' : 'shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Event Banner */}
      <div className={`h-32 bg-gradient-to-r ${theme.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Decorative background pattern */}
            <div className="grid grid-cols-8 gap-4 p-4">
              {[...Array(24)].map((_, i) => (
                <ThemeIcon key={i} className="w-6 h-6 text-white opacity-10" />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <ThemeIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{event.name}</h2>
              <p className="text-white/90 text-sm">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 space-y-4">
        {/* Description */}
        <p className="text-gray-300">{event.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Duration</span>
            </div>
            <div className="text-lg font-bold text-white">{getTimeRemaining()}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Quests</span>
            </div>
            <div className="text-lg font-bold text-white">{event.questCount}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Participants</span>
            </div>
            <div className="text-lg font-bold text-white">
              {event.participantCount.toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">XP Bonus</span>
            </div>
            <div className={`text-lg font-bold ${theme.accentColor}`}>
              +{Math.round((event.xpMultiplier - 1) * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar (if user is participating) */}
        {event.completionPercentage !== undefined && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Your Progress</span>
              <span className={`font-bold ${theme.accentColor}`}>
                {event.completionPercentage}%
              </span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                style={{ width: `${event.completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Exclusive Rewards Preview */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Exclusive Rewards
          </h4>
          <div className="flex flex-wrap gap-2">
            {event.exclusiveRewards.slice(0, 3).map((reward, index) => (
              <span
                key={index}
                className={`px-3 py-1 bg-gradient-to-r ${theme.gradient} bg-opacity-20 border ${theme.borderColor} rounded-full text-sm text-white`}
              >
                {reward}
              </span>
            ))}
            {event.exclusiveRewards.length > 3 && (
              <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-400">
                +{event.exclusiveRewards.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {event.status === 'upcoming' && (
            <button
              onClick={() => onJoinEvent?.(event.id)}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-white"
            >
              Set Reminder
            </button>
          )}

          {(event.status === 'active' || event.status === 'ending-soon') && (
            <button
              onClick={() => onJoinEvent?.(event.id)}
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${theme.gradient} hover:opacity-90 rounded-lg transition-opacity font-medium text-white`}
            >
              {event.completionPercentage !== undefined ? 'Continue Event' : 'Join Event'}
            </button>
          )}

          <button
            onClick={() => onViewDetails?.(event.id)}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors font-medium text-white flex items-center gap-2"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
