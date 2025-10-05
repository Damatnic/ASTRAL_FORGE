'use client';

import React, { useState } from 'react';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface Title {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'endurance' | 'consistency' | 'competition' | 'achievement' | 'prestige';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  unlocked: boolean;
  equipped: boolean;
  unlockedAt?: Date;
  icon: string; // Emoji
  color: string;
  animated?: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'milestone' | 'event' | 'seasonal' | 'secret';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  unlocked: boolean;
  unlockedAt?: Date;
  icon: string; // Emoji
  color: string;
  progress?: number;
  maxProgress?: number;
  setBonus?: string;
}

interface TitleCategory {
  id: string;
  name: string;
  icon: string; // Emoji
  count: number;
  totalCount: number;
}

interface BadgeSet {
  id: string;
  name: string;
  description: string;
  badges: string[];
  bonus: string;
  completed: boolean;
}

interface TitleBadgeSystemProps {
  currentUser: {
    id: string;
    username: string;
    level: number;
    totalXP: number;
    prestige: number;
  };
  titles: Title[];
  badges: Badge[];
  badgeSets: BadgeSet[];
  onEquipTitle: (titleId: string) => void;
}

// ============================================================================
// RARITY CONFIGURATIONS
// ============================================================================

const RARITY_CONFIG = {
  common: {
    color: 'from-gray-400 to-gray-500',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    glowColor: 'shadow-gray-500/50',
  },
  rare: {
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    glowColor: 'shadow-blue-500/50',
  },
  epic: {
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    glowColor: 'shadow-purple-500/50',
  },
  legendary: {
    color: 'from-amber-400 to-orange-600',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    glowColor: 'shadow-amber-500/50',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TitleBadgeSystem({
  currentUser,
  titles,
  badges,
  badgeSets,
  onEquipTitle,
}: TitleBadgeSystemProps) {
  const [activeTab, setActiveTab] = useState<'titles' | 'badges' | 'sets'>('titles');
  const [titleFilter, setTitleFilter] = useState<'all' | Title['category']>('all');
  const [badgeFilter, setBadgeFilter] = useState<'all' | Badge['category']>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'common' | 'rare' | 'epic' | 'legendary'>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Calculate statistics
  const unlockedTitles = titles.filter(t => t.unlocked).length;
  const totalTitles = titles.length;
  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;
  const equippedTitle = titles.find(t => t.equipped);
  const completedSets = badgeSets.filter(s => s.completed).length;

  // Filter titles
  const filteredTitles = titles.filter(title => {
    if (showUnlockedOnly && !title.unlocked) return false;
    if (titleFilter !== 'all' && title.category !== titleFilter) return false;
    if (rarityFilter !== 'all' && title.rarity !== rarityFilter) return false;
    return true;
  });

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    if (showUnlockedOnly && !badge.unlocked) return false;
    if (badgeFilter !== 'all' && badge.category !== badgeFilter) return false;
    if (rarityFilter !== 'all' && badge.rarity !== rarityFilter) return false;
    return true;
  });

  // Group titles by category
  const titleCategories: TitleCategory[] = [
    {
      id: 'strength',
      name: 'Strength',
      icon: '💪',
      count: titles.filter(t => t.category === 'strength' && t.unlocked).length,
      totalCount: titles.filter(t => t.category === 'strength').length,
    },
    {
      id: 'endurance',
      name: 'Endurance',
      icon: '🏃',
      count: titles.filter(t => t.category === 'endurance' && t.unlocked).length,
      totalCount: titles.filter(t => t.category === 'endurance').length,
    },
    {
      id: 'consistency',
      name: 'Consistency',
      icon: '📅',
      count: titles.filter(t => t.category === 'consistency' && t.unlocked).length,
      totalCount: titles.filter(t => t.category === 'consistency').length,
    },
    {
      id: 'competition',
      name: 'Competition',
      icon: '⚔️',
      count: titles.filter(t => t.category === 'competition' && t.unlocked).length,
      totalCount: titles.filter(t => t.category === 'competition').length,
    },
    {
      id: 'achievement',
      name: 'Achievement',
      icon: '🏆',
      count: titles.filter(t => t.category === 'achievement' && t.unlocked).length,
      totalCount: titles.filter(t => t.category === 'achievement').length,
    },
    {
      id: 'prestige',
      name: 'Prestige',
      icon: '👑',
      count: titles.filter(t => t.category === 'prestige' && t.unlocked).length,
      totalCount: titles.filter(t => t.category === 'prestige').length,
    },
  ];

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderTitleCard = (title: Title) => {
    const rarityConfig = RARITY_CONFIG[title.rarity];
    
    return (
      <div
        key={title.id}
        onClick={() => setSelectedTitle(title)}
        className={`
          relative p-4 rounded-lg border-2 transition-all cursor-pointer
          ${title.unlocked ? rarityConfig.borderColor : 'border-gray-800'}
          ${title.unlocked ? rarityConfig.bgColor : 'bg-gray-900/50'}
          ${title.equipped ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-950' : ''}
          ${title.unlocked ? `hover:shadow-lg ${rarityConfig.glowColor}` : 'opacity-40'}
          ${title.animated ? 'animate-pulse' : ''}
        `}
      >
        {/* Equipped Badge */}
        {title.equipped && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            ⭐ EQUIPPED
          </div>
        )}

        {/* Lock Icon for Locked Titles */}
        {!title.unlocked && (
          <div className="absolute top-2 right-2 text-2xl">
            🔒
          </div>
        )}

        {/* Rarity Indicator */}
        <div className={`text-xs font-bold ${rarityConfig.textColor} uppercase mb-2`}>
          {title.rarity}
        </div>

        {/* Title Icon & Name */}
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">
            {title.icon}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold ${title.unlocked ? 'text-white' : 'text-gray-600'}`}>
              {title.name}
            </h3>
            <p className="text-xs text-gray-500 capitalize">{title.category}</p>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm mb-2 ${title.unlocked ? 'text-gray-400' : 'text-gray-700'}`}>
          {title.description}
        </p>

        {/* Unlock Condition */}
        <div className={`text-xs ${title.unlocked ? 'text-green-400' : 'text-gray-500'} flex items-center gap-1`}>
          {title.unlocked ? (
            <>
              ✅ Unlocked {title.unlockedAt && new Date(title.unlockedAt).toLocaleDateString()}
            </>
          ) : (
            <>
              🎯 {title.unlockCondition}
            </>
          )}
        </div>

        {/* Equip Button */}
        {title.unlocked && !title.equipped && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEquipTitle(title.id);
            }}
            className="mt-3 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded font-semibold text-sm transition-all"
          >
            Equip Title
          </button>
        )}
      </div>
    );
  };

  const renderBadgeCard = (badge: Badge) => {
    const rarityConfig = RARITY_CONFIG[badge.rarity];
    const progress = badge.progress || 0;
    const maxProgress = badge.maxProgress || 1;
    const progressPercentage = (progress / maxProgress) * 100;
    
    return (
      <div
        key={badge.id}
        onClick={() => setSelectedBadge(badge)}
        className={`
          relative p-4 rounded-lg border-2 transition-all cursor-pointer
          ${badge.unlocked ? rarityConfig.borderColor : 'border-gray-800'}
          ${badge.unlocked ? rarityConfig.bgColor : 'bg-gray-900/50'}
          ${badge.unlocked ? `hover:shadow-lg ${rarityConfig.glowColor}` : 'opacity-40'}
        `}
      >
        {/* Lock Icon for Locked Badges */}
        {!badge.unlocked && (
          <div className="absolute top-2 right-2 text-xl">
            🔒
          </div>
        )}

        {/* Set Bonus Indicator */}
        {badge.setBonus && (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            SET
          </div>
        )}

        {/* Rarity Indicator */}
        <div className={`text-xs font-bold ${rarityConfig.textColor} uppercase mb-2`}>
          {badge.rarity}
        </div>

        {/* Badge Icon & Name */}
        <div className="flex flex-col items-center gap-2 mb-3">
          <div className="text-4xl">
            {badge.icon}
          </div>
          <h3 className={`font-bold text-center ${badge.unlocked ? 'text-white' : 'text-gray-600'}`}>
            {badge.name}
          </h3>
          <p className="text-xs text-gray-500 capitalize">{badge.category}</p>
        </div>

        {/* Description */}
        <p className={`text-sm text-center mb-2 ${badge.unlocked ? 'text-gray-400' : 'text-gray-700'}`}>
          {badge.description}
        </p>

        {/* Progress Bar (if applicable) */}
        {!badge.unlocked && badge.maxProgress && badge.maxProgress > 1 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}/{maxProgress}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${rarityConfig.color}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Unlock Condition */}
        <div className={`text-xs ${badge.unlocked ? 'text-green-400' : 'text-gray-500'} flex items-center justify-center gap-1`}>
          {badge.unlocked ? (
            <>
              ✅ Unlocked {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}
            </>
          ) : (
            <>
              🎯 {badge.unlockCondition}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderBadgeSet = (set: BadgeSet) => {
    const setBadges = badges.filter(b => set.badges.includes(b.id));
    const unlockedInSet = setBadges.filter(b => b.unlocked).length;
    const progressPercentage = (unlockedInSet / set.badges.length) * 100;

    return (
      <div
        key={set.id}
        className={`
          p-6 rounded-lg border-2 transition-all
          ${set.completed ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-gray-900/50'}
        `}
      >
        {/* Set Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold mb-1 ${set.completed ? 'text-purple-400' : 'text-white'}`}>
              {set.name}
            </h3>
            <p className="text-sm text-gray-400">{set.description}</p>
          </div>
          {set.completed && (
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              ✅ COMPLETED
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Set Progress</span>
            <span>{unlockedInSet}/{set.badges.length} Badges</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Set Bonus */}
        <div className={`p-3 rounded ${set.completed ? 'bg-purple-500/20' : 'bg-gray-800/50'} mb-4`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xl ${set.completed ? '' : 'grayscale'}`}>💎</span>
            <span className={`text-sm font-bold ${set.completed ? 'text-purple-400' : 'text-gray-500'}`}>
              Set Bonus
            </span>
          </div>
          <p className={`text-sm ${set.completed ? 'text-white' : 'text-gray-600'}`}>
            {set.bonus}
          </p>
        </div>

        {/* Badges in Set */}
        <div className="grid grid-cols-3 gap-3">
          {setBadges.map(badge => {
            const rarityConfig = RARITY_CONFIG[badge.rarity];
            return (
              <div
                key={badge.id}
                className={`
                  p-3 rounded-lg border-2 transition-all cursor-pointer
                  ${badge.unlocked ? rarityConfig.borderColor : 'border-gray-800'}
                  ${badge.unlocked ? rarityConfig.bgColor : 'bg-gray-900/50'}
                  ${badge.unlocked ? 'opacity-100' : 'opacity-40'}
                `}
                onClick={() => setSelectedBadge(badge)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-2xl">
                    {badge.icon}
                  </div>
                  <span className={`text-xs text-center font-medium ${badge.unlocked ? 'text-white' : 'text-gray-600'}`}>
                    {badge.name}
                  </span>
                  {badge.unlocked && (
                    <span className="text-green-400">✅</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Titles & Badges
            </h1>
            <p className="text-gray-400">Showcase your achievements and accomplishments</p>
          </div>
          
          {/* User Info */}
          <div className="text-right">
            <div className="text-2xl font-bold">{currentUser.username}</div>
            <div className="text-sm text-gray-400">Level {currentUser.level} • Prestige {currentUser.prestige}</div>
          </div>
        </div>

        {/* Currently Equipped Title */}
        {equippedTitle && (
          <div className="p-6 rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500">
            <div className="flex items-center gap-4">
              <div className="text-4xl">
                👑
              </div>
              <div className="flex-1">
                <div className="text-sm text-purple-400 font-semibold mb-1">CURRENTLY EQUIPPED</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {equippedTitle.name}
                  {equippedTitle.animated && <span className="text-yellow-400 animate-pulse">⭐</span>}
                </div>
                <div className="text-sm text-gray-400">{equippedTitle.description}</div>
              </div>
              <div className={`px-4 py-2 rounded font-bold ${RARITY_CONFIG[equippedTitle.rarity].textColor}`}>
                {equippedTitle.rarity.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="text-2xl font-bold">{unlockedTitles}/{totalTitles}</div>
                <div className="text-sm text-gray-400">Titles Unlocked</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <div className="text-2xl font-bold">{unlockedBadges}/{totalBadges}</div>
                <div className="text-sm text-gray-400">Badges Earned</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💎</span>
              <div>
                <div className="text-2xl font-bold">{completedSets}/{badgeSets.length}</div>
                <div className="text-sm text-gray-400">Sets Completed</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📈</span>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(((unlockedTitles + unlockedBadges) / (totalTitles + totalBadges)) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Total Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('titles')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'titles'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              👑 Titles ({unlockedTitles}/{totalTitles})
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              🛡️ Badges ({unlockedBadges}/{totalBadges})
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('sets')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'sets'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              💎 Badge Sets ({completedSets}/{badgeSets.length})
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-800">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Category Filter (Titles) */}
            {activeTab === 'titles' && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                <select
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="strength">Strength</option>
                  <option value="endurance">Endurance</option>
                  <option value="consistency">Consistency</option>
                  <option value="competition">Competition</option>
                  <option value="achievement">Achievement</option>
                  <option value="prestige">Prestige</option>
                </select>
              </div>
            )}

            {/* Category Filter (Badges) */}
            {activeTab === 'badges' && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Category</label>
                <select
                  value={badgeFilter}
                  onChange={(e) => setBadgeFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="performance">Performance</option>
                  <option value="milestone">Milestone</option>
                  <option value="event">Event</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="secret">Secret</option>
                </select>
              </div>
            )}

            {/* Rarity Filter */}
            {(activeTab === 'titles' || activeTab === 'badges') && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Rarity</label>
                <select
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
            )}

            {/* Show Unlocked Only */}
            {(activeTab === 'titles' || activeTab === 'badges') && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Display</label>
                <label className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-4 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUnlockedOnly}
                    onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Unlocked Only</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'titles' && (
          <div>
            {/* Category Breakdown */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {titleCategories.map(category => (
                <div
                  key={category.id}
                  onClick={() => setTitleFilter(category.id as any)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${titleFilter === category.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'}
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-sm font-semibold text-center">{category.name}</div>
                    <div className="text-xs text-gray-400">{category.count}/{category.totalCount}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Titles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTitles.map(renderTitleCard)}
            </div>

            {filteredTitles.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No titles match your filters
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBadges.map(renderBadgeCard)}
            </div>

            {filteredBadges.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No badges match your filters
              </div>
            )}
          </div>
        )}

        {activeTab === 'sets' && (
          <div className="space-y-6">
            {badgeSets.map(renderBadgeSet)}
          </div>
        )}
      </div>

      {/* Title Detail Modal */}
      {selectedTitle && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedTitle(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full border-2 border-purple-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {selectedTitle.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedTitle.name}</h2>
                  <p className={`text-sm ${RARITY_CONFIG[selectedTitle.rarity].textColor} font-bold uppercase`}>
                    {selectedTitle.rarity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTitle(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Description</div>
                <p className="text-white">{selectedTitle.description}</p>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Category</div>
                <p className="text-white capitalize">{selectedTitle.category}</p>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Unlock Requirement</div>
                <p className="text-white">{selectedTitle.unlockCondition}</p>
              </div>

              {selectedTitle.unlocked && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Unlocked</div>
                  <p className="text-green-400">
                    {selectedTitle.unlockedAt && new Date(selectedTitle.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedTitle.unlocked && !selectedTitle.equipped && (
                <button
                  onClick={() => {
                    onEquipTitle(selectedTitle.id);
                    setSelectedTitle(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold transition-all"
                >
                  Equip This Title
                </button>
              )}

              {selectedTitle.equipped && (
                <div className="w-full py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold text-center">
                  Currently Equipped
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full border-2 border-purple-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center mb-4">
              <div className="text-5xl mb-3">
                {selectedBadge.icon}
              </div>
              <h2 className="text-2xl font-bold text-center">{selectedBadge.name}</h2>
              <p className={`text-sm ${RARITY_CONFIG[selectedBadge.rarity].textColor} font-bold uppercase`}>
                {selectedBadge.rarity}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Description</div>
                <p className="text-white">{selectedBadge.description}</p>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Category</div>
                <p className="text-white capitalize">{selectedBadge.category}</p>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Unlock Requirement</div>
                <p className="text-white">{selectedBadge.unlockCondition}</p>
              </div>

              {selectedBadge.setBonus && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Part of Set</div>
                  <p className="text-purple-400">{selectedBadge.setBonus}</p>
                </div>
              )}

              {!selectedBadge.unlocked && selectedBadge.maxProgress && selectedBadge.maxProgress > 1 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Progress</div>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${RARITY_CONFIG[selectedBadge.rarity].color}`}
                      style={{ width: `${((selectedBadge.progress || 0) / selectedBadge.maxProgress) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-center text-gray-400">
                    {selectedBadge.progress}/{selectedBadge.maxProgress}
                  </div>
                </div>
              )}

              {selectedBadge.unlocked && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Unlocked</div>
                  <p className="text-green-400">
                    {selectedBadge.unlockedAt && new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-6 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
