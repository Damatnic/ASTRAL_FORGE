'use client';

import { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Lock,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Gift,
  Star,
  Flame,
  Clock,
} from 'lucide-react';

// Types
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';
export type QuestStatus = 'locked' | 'available' | 'in-progress' | 'completed';
export type QuestType = 'individual' | 'community';

export interface EventQuest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  progress: number; // 0-100
  target: number; // Goal value
  current: number; // Current value
  unit: string; // 'workouts', 'lbs', 'sets', 'minutes'
  xpReward: number;
  bonusRewards?: string[]; // Extra rewards
  timeRemaining?: string; // e.g., "2d 14h"
  participants?: number; // For community quests
  unlockRequirement?: string; // e.g., "Complete Quest: Beast Mode"
}

interface EventQuestBoardProps {
  quests: EventQuest[];
  eventTheme?: 'summer' | 'winter' | 'spring' | 'fall' | 'newyear' | 'special';
  onQuestClick?: (questId: string) => void;
  onClaimReward?: (questId: string) => void;
}

export default function EventQuestBoard({
  quests = [],
  eventTheme = 'special',
  onQuestClick,
  onClaimReward,
}: EventQuestBoardProps) {
  const [filter, setFilter] = useState<'all' | QuestDifficulty>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  // Theme colors
  const themeColors = {
    summer: { primary: 'orange-500', secondary: 'yellow-500', gradient: 'from-orange-600 to-yellow-500' },
    winter: { primary: 'blue-500', secondary: 'cyan-500', gradient: 'from-blue-600 to-cyan-500' },
    spring: { primary: 'green-500', secondary: 'emerald-500', gradient: 'from-green-600 to-emerald-500' },
    fall: { primary: 'red-500', secondary: 'orange-500', gradient: 'from-red-600 to-orange-500' },
    newyear: { primary: 'purple-500', secondary: 'pink-500', gradient: 'from-purple-600 to-pink-500' },
    special: { primary: 'yellow-500', secondary: 'amber-500', gradient: 'from-yellow-600 to-amber-500' },
  };

  const theme = themeColors[eventTheme];

  // Difficulty configuration
  const difficultyConfig = {
    easy: { color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-500/30', icon: '⭐' },
    medium: { color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-500/30', icon: '⭐⭐' },
    hard: { color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-500/30', icon: '⭐⭐⭐' },
    extreme: { color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-500/30', icon: '⭐⭐⭐⭐' },
  };

  // Filter quests
  const filteredQuests = quests.filter((quest) => {
    if (!showCompleted && quest.status === 'completed') return false;
    if (filter !== 'all' && quest.difficulty !== filter) return false;
    return true;
  });

  // Group quests by status
  const availableQuests = filteredQuests.filter(
    (q) => q.status === 'available' || q.status === 'in-progress'
  );
  const completedQuests = filteredQuests.filter((q) => q.status === 'completed');
  const lockedQuests = filteredQuests.filter((q) => q.status === 'locked');

  // Render a single quest card
  const renderQuestCard = (quest: EventQuest) => {
    const difficulty = difficultyConfig[quest.difficulty];
    const isCompleted = quest.status === 'completed';
    const isLocked = quest.status === 'locked';
    const canClaim = isCompleted && quest.progress >= 100;

    return (
      <div
        key={quest.id}
        className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border ${
          isLocked ? 'border-gray-700 opacity-60' : difficulty.border
        } p-5 hover:shadow-lg transition-all ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !isLocked && onQuestClick?.(quest.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {quest.type === 'community' ? (
                <Users className={`w-5 h-5 text-${theme.primary}`} />
              ) : (
                <Target className={`w-5 h-5 text-${theme.primary}`} />
              )}
              <h3 className={`font-bold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                {quest.name}
              </h3>
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isLocked && <Lock className="w-5 h-5 text-gray-600" />}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{quest.description}</p>
          </div>

          {/* Difficulty Badge */}
          <div className={`ml-3 px-3 py-1 ${difficulty.bg} ${difficulty.border} border rounded-full`}>
            <span className="text-xs font-semibold">{difficulty.icon}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {!isLocked && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">
                {quest.current.toLocaleString()} / {quest.target.toLocaleString()} {quest.unit}
              </span>
              <span className={`font-bold ${difficulty.color}`}>{quest.progress}%</span>
            </div>
            <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 ${
                  isCompleted ? 'animate-pulse' : ''
                }`}
                style={{ width: `${Math.min(quest.progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Quest Details */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* XP Reward */}
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">
              <span className="font-bold text-purple-400">+{quest.xpReward.toLocaleString()}</span> XP
            </span>
          </div>

          {/* Time Remaining */}
          {quest.timeRemaining && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-gray-300">{quest.timeRemaining}</span>
            </div>
          )}

          {/* Community Participants */}
          {quest.type === 'community' && quest.participants && (
            <div className="flex items-center gap-2 text-sm col-span-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">
                <span className="font-bold text-blue-400">{quest.participants.toLocaleString()}</span>{' '}
                participating
              </span>
            </div>
          )}
        </div>

        {/* Bonus Rewards */}
        {quest.bonusRewards && quest.bonusRewards.length > 0 && !isLocked && (
          <div className="mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Gift className="w-3 h-3" />
              Bonus Rewards
            </div>
            <div className="flex flex-wrap gap-2">
              {quest.bonusRewards.map((reward, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 bg-gradient-to-r ${theme.gradient} bg-opacity-20 border ${difficulty.border} rounded text-xs text-white`}
                >
                  {reward}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unlock Requirement */}
        {isLocked && quest.unlockRequirement && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Lock className="w-4 h-4" />
            <span>{quest.unlockRequirement}</span>
          </div>
        )}

        {/* Action Button */}
        {canClaim && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaimReward?.(quest.id);
            }}
            className={`w-full px-4 py-2 bg-gradient-to-r ${theme.gradient} hover:opacity-90 rounded-lg transition-opacity font-medium text-white flex items-center justify-center gap-2`}
          >
            <Trophy className="w-4 h-4" />
            Claim Rewards
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className={`w-7 h-7 text-${theme.primary}`} />
            Event Quests
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Complete quests to earn XP and exclusive rewards!
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-3 items-center">
          {/* Difficulty Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">⭐ Easy</option>
            <option value="medium">⭐⭐ Medium</option>
            <option value="hard">⭐⭐⭐ Hard</option>
            <option value="extreme">⭐⭐⭐⭐ Extreme</option>
          </select>

          {/* Show Completed Toggle */}
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showCompleted
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </button>
        </div>
      </div>

      {/* Quest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-lg border border-green-500/30 p-4">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="text-2xl font-bold text-white">{completedQuests.length}</div>
        </div>

        <div className={`bg-gradient-to-br from-${theme.primary}/30 to-${theme.secondary}/20 rounded-lg border border-${theme.primary}/30 p-4`}>
          <div className={`flex items-center gap-2 text-${theme.primary} mb-1`}>
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {quests.filter((q) => q.status === 'in-progress').length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-lg border border-blue-500/30 p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Available</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {quests.filter((q) => q.status === 'available').length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-medium">Locked</span>
          </div>
          <div className="text-2xl font-bold text-white">{lockedQuests.length}</div>
        </div>
      </div>

      {/* Active Quests */}
      {availableQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Flame className={`w-5 h-5 text-${theme.primary}`} />
            Active Quests
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availableQuests.map(renderQuestCard)}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {showCompleted && completedQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Completed Quests
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedQuests.map(renderQuestCard)}
          </div>
        </div>
      )}

      {/* Locked Quests */}
      {lockedQuests.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            Locked Quests
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {lockedQuests.map(renderQuestCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredQuests.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Quests Found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later for new quests!</p>
        </div>
      )}
    </div>
  );
}
