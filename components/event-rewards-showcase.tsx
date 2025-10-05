'use client';

import { Gift, Lock, CheckCircle2, Crown, Star, Sparkles, Trophy } from 'lucide-react';

// Types
export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type RewardType = 'title' | 'cosmetic' | 'achievement' | 'item' | 'xp-boost';
export type RewardStatus = 'locked' | 'available' | 'claimed';

export interface EventReward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  rarity: RewardRarity;
  status: RewardStatus;
  icon?: string; // Emoji or icon identifier
  requirement?: string; // e.g., "Reach 1000 event points"
  progress?: number; // 0-100
  claimedDate?: Date;
}

interface EventRewardsShowcaseProps {
  rewards: EventReward[];
  eventName: string;
  eventTheme?: 'summer' | 'winter' | 'spring' | 'fall' | 'newyear' | 'special';
  onClaimReward?: (rewardId: string) => void;
}

export default function EventRewardsShowcase({
  rewards = [],
  eventName,
  eventTheme = 'special',
  onClaimReward,
}: EventRewardsShowcaseProps) {
  // Theme colors
  const themeColors = {
    summer: { primary: 'orange-500', gradient: 'from-orange-600 to-yellow-500' },
    winter: { primary: 'blue-500', gradient: 'from-blue-600 to-cyan-500' },
    spring: { primary: 'green-500', gradient: 'from-green-600 to-emerald-500' },
    fall: { primary: 'red-500', gradient: 'from-red-600 to-orange-500' },
    newyear: { primary: 'purple-500', gradient: 'from-purple-600 to-pink-500' },
    special: { primary: 'yellow-500', gradient: 'from-yellow-600 to-amber-500' },
  };

  const theme = themeColors[eventTheme];

  // Rarity configuration
  const rarityConfig = {
    common: {
      color: 'text-gray-400',
      bg: 'bg-gray-700',
      border: 'border-gray-500',
      gradient: 'from-gray-600 to-gray-700',
      glow: 'shadow-gray-500/20',
      label: 'Common',
    },
    rare: {
      color: 'text-blue-400',
      bg: 'bg-blue-900',
      border: 'border-blue-500',
      gradient: 'from-blue-600 to-blue-700',
      glow: 'shadow-blue-500/30',
      label: 'Rare',
    },
    epic: {
      color: 'text-purple-400',
      bg: 'bg-purple-900',
      border: 'border-purple-500',
      gradient: 'from-purple-600 to-purple-700',
      glow: 'shadow-purple-500/40',
      label: 'Epic',
    },
    legendary: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-900',
      border: 'border-yellow-500',
      gradient: 'from-yellow-600 to-amber-600',
      glow: 'shadow-yellow-500/50',
      label: 'Legendary',
    },
  };

  // Type icons
  const typeIcons = {
    title: Crown,
    cosmetic: Sparkles,
    achievement: Trophy,
    item: Gift,
    'xp-boost': Star,
  };

  // Group rewards by rarity
  const legendaryRewards = rewards.filter((r) => r.rarity === 'legendary');
  const epicRewards = rewards.filter((r) => r.rarity === 'epic');
  const rareRewards = rewards.filter((r) => r.rarity === 'rare');
  const commonRewards = rewards.filter((r) => r.rarity === 'common');

  // Render a single reward card
  const renderRewardCard = (reward: EventReward, featured = false) => {
    const rarity = rarityConfig[reward.rarity];
    const TypeIcon = typeIcons[reward.type];
    const isLocked = reward.status === 'locked';
    const isClaimed = reward.status === 'claimed';
    const canClaim = reward.status === 'available';

    return (
      <div
        key={reward.id}
        className={`relative bg-gradient-to-br ${rarity.gradient} rounded-lg border-2 ${
          rarity.border
        } overflow-hidden transition-all ${
          featured ? 'p-6' : 'p-4'
        } ${isLocked ? 'opacity-60' : `hover:scale-105 ${rarity.glow} shadow-lg`}`}
      >
        {/* Rarity Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 ${rarity.bg} ${rarity.border} border rounded-full text-xs font-bold ${rarity.color}`}
        >
          {rarity.label}
        </div>

        {/* Status Indicator */}
        {isClaimed && (
          <div className="absolute top-2 left-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
        )}
        {isLocked && (
          <div className="absolute top-2 left-2">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
        )}

        {/* Reward Icon */}
        <div className={`${featured ? 'mb-6' : 'mb-4'} flex justify-center`}>
          <div
            className={`${
              featured ? 'w-24 h-24' : 'w-16 h-16'
            } bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm ${
              !isLocked && 'animate-pulse'
            }`}
          >
            {reward.icon ? (
              <span className={`${featured ? 'text-5xl' : 'text-4xl'}`}>{reward.icon}</span>
            ) : (
              <TypeIcon className={`${featured ? 'w-12 h-12' : 'w-8 h-8'} text-white`} />
            )}
          </div>
        </div>

        {/* Reward Info */}
        <div className="text-center mb-4">
          <h3
            className={`${
              featured ? 'text-2xl' : 'text-lg'
            } font-bold text-white mb-2 ${isLocked && 'text-gray-500'}`}
          >
            {reward.name}
          </h3>
          <p className={`text-sm ${isLocked ? 'text-gray-600' : 'text-white/80'} line-clamp-2`}>
            {reward.description}
          </p>
        </div>

        {/* Requirement/Progress */}
        {reward.requirement && (
          <div className="mb-4">
            <p className="text-xs text-white/60 mb-2 text-center">{reward.requirement}</p>
            {reward.progress !== undefined && !isClaimed && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80">
                  <span>Progress</span>
                  <span className="font-bold">{reward.progress}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/80 transition-all duration-500"
                    style={{ width: `${reward.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Claimed Date */}
        {isClaimed && reward.claimedDate && (
          <p className="text-xs text-green-400 text-center mb-2">
            Claimed {reward.claimedDate.toLocaleDateString()}
          </p>
        )}

        {/* Claim Button */}
        {canClaim && (
          <button
            onClick={() => onClaimReward?.(reward.id)}
            className={`w-full px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors font-bold text-gray-900 flex items-center justify-center gap-2`}
          >
            <Gift className="w-4 h-4" />
            Claim Reward
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Gift className={`w-8 h-8 text-${theme.primary}`} />
          {eventName} Rewards
        </h2>
        <p className="text-gray-400">
          Exclusive rewards available only during this event!
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {rewards.filter((r) => r.status === 'claimed').length}
          </div>
          <div className="text-sm text-gray-400">Claimed</div>
        </div>
        <div className={`bg-gradient-to-br from-${theme.primary}/30 to-${theme.primary}/10 rounded-lg border border-${theme.primary}/30 p-4 text-center`}>
          <div className="text-2xl font-bold text-white mb-1">
            {rewards.filter((r) => r.status === 'available').length}
          </div>
          <div className="text-sm text-gray-400">Available</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {rewards.filter((r) => r.status === 'locked').length}
          </div>
          <div className="text-sm text-gray-400">Locked</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 rounded-lg border border-yellow-500/30 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{legendaryRewards.length}</div>
          <div className="text-sm text-gray-400">Legendary</div>
        </div>
      </div>

      {/* Legendary Rewards (Featured) */}
      {legendaryRewards.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Legendary Rewards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legendaryRewards.map((reward) => renderRewardCard(reward, true))}
          </div>
        </div>
      )}

      {/* Epic Rewards */}
      {epicRewards.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Epic Rewards
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {epicRewards.map((reward) => renderRewardCard(reward))}
          </div>
        </div>
      )}

      {/* Rare Rewards */}
      {rareRewards.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Rare Rewards
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {rareRewards.map((reward) => renderRewardCard(reward))}
          </div>
        </div>
      )}

      {/* Common Rewards */}
      {commonRewards.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-400 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Common Rewards
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {commonRewards.map((reward) => renderRewardCard(reward))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Rewards Available</h3>
          <p className="text-gray-500">Complete event quests to unlock exclusive rewards!</p>
        </div>
      )}
    </div>
  );
}
