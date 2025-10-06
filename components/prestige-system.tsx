'use client';

import { useState } from 'react';

// TypeScript Interfaces
type PrestigeRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type StatType = 'strength' | 'endurance' | 'agility' | 'intelligence' | 'willpower' | 'charisma';

interface PrestigeTier {
  rank: PrestigeRank;
  name: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  xpMultiplier: number;
  goldMultiplier: number;
  skillPointBonus: number;
  levelRequired: number;
  benefits: string[];
  cosmetics: string[];
}

interface StatAllocation {
  strength: number;
  endurance: number;
  agility: number;
  intelligence: number;
  willpower: number;
  charisma: number;
}

interface PrestigeHistory {
  prestigeNumber: number;
  date: string;
  levelAchieved: number;
  timeSpent: string;
}

interface PrestigeSystemProps {
  currentPrestige: PrestigeRank;
  currentLevel: number;
  totalXP: number;
  availableSkillPoints: number;
  currentStats: StatAllocation;
  prestigeHistory: PrestigeHistory[];
  onPrestigeReset: () => void;
  onStatAllocate: (stats: StatAllocation) => void;
  onStatReset: () => void;
}

export default function PrestigeSystem({
  currentPrestige,
  currentLevel,
  totalXP,
  availableSkillPoints,
  currentStats,
  prestigeHistory,
  onPrestigeReset,
  onStatAllocate,
  onStatReset,
}: PrestigeSystemProps) {
  // State
  const [pendingStats, setPendingStats] = useState<StatAllocation>(currentStats);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRespecModal, setShowRespecModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [selectedTab, setSelectedTab] = useState<'prestige' | 'stats' | 'history'>('prestige');

  // Prestige Tier Definitions
  const prestigeTiers: PrestigeTier[] = [
    {
      rank: 0,
      name: 'Initiate',
      icon: '🔰',
      color: '#9ca3af',
      gradientFrom: '#6b7280',
      gradientTo: '#9ca3af',
      xpMultiplier: 1.0,
      goldMultiplier: 1.0,
      skillPointBonus: 0,
      levelRequired: 1,
      benefits: ['Base progression', 'Standard rewards'],
      cosmetics: [],
    },
    {
      rank: 1,
      name: 'Ascendant',
      icon: '⚡',
      color: '#60a5fa',
      gradientFrom: '#3b82f6',
      gradientTo: '#60a5fa',
      xpMultiplier: 1.2,
      goldMultiplier: 1.2,
      skillPointBonus: 5,
      levelRequired: 50,
      benefits: ['+20% XP gain', '+20% Gold gain', '+5 Skill Points', 'Blue aura effect'],
      cosmetics: ['Blue Prestige Aura', 'Ascendant Title'],
    },
    {
      rank: 2,
      name: 'Veteran',
      icon: '🛡️',
      color: '#34d399',
      gradientFrom: '#10b981',
      gradientTo: '#34d399',
      xpMultiplier: 1.5,
      goldMultiplier: 1.5,
      skillPointBonus: 10,
      levelRequired: 50,
      benefits: ['+50% XP gain', '+50% Gold gain', '+10 Skill Points', 'Green shield effect'],
      cosmetics: ['Emerald Prestige Aura', 'Veteran Title', 'Shield Emblem'],
    },
    {
      rank: 3,
      name: 'Champion',
      icon: '👑',
      color: '#a855f7',
      gradientFrom: '#9333ea',
      gradientTo: '#a855f7',
      xpMultiplier: 2.0,
      goldMultiplier: 2.0,
      skillPointBonus: 15,
      levelRequired: 50,
      benefits: ['+100% XP gain', '+100% Gold gain', '+15 Skill Points', 'Purple crown effect'],
      cosmetics: ['Royal Prestige Aura', 'Champion Title', 'Crown Emblem', 'Purple Particle Trail'],
    },
    {
      rank: 4,
      name: 'Legend',
      icon: '⭐',
      color: '#f59e0b',
      gradientFrom: '#d97706',
      gradientTo: '#f59e0b',
      xpMultiplier: 2.5,
      goldMultiplier: 2.5,
      skillPointBonus: 20,
      levelRequired: 50,
      benefits: ['+150% XP gain', '+150% Gold gain', '+20 Skill Points', 'Gold star effect', 'Rare item drop boost'],
      cosmetics: ['Golden Prestige Aura', 'Legend Title', 'Star Emblem', 'Gold Particle Trail', 'Legendary Frame'],
    },
    {
      rank: 5,
      name: 'Mythic',
      icon: '💎',
      color: '#ec4899',
      gradientFrom: '#db2777',
      gradientTo: '#ec4899',
      xpMultiplier: 3.0,
      goldMultiplier: 3.0,
      skillPointBonus: 25,
      levelRequired: 50,
      benefits: ['+200% XP gain', '+200% Gold gain', '+25 Skill Points', 'Diamond effect', 'Epic item drop boost'],
      cosmetics: ['Diamond Prestige Aura', 'Mythic Title', 'Diamond Emblem', 'Pink Particle Trail', 'Mythic Frame', 'Crystal Wings'],
    },
    {
      rank: 6,
      name: 'Transcendent',
      icon: '🌟',
      color: '#06b6d4',
      gradientFrom: '#0891b2',
      gradientTo: '#06b6d4',
      xpMultiplier: 3.5,
      goldMultiplier: 3.5,
      skillPointBonus: 30,
      levelRequired: 50,
      benefits: ['+250% XP gain', '+250% Gold gain', '+30 Skill Points', 'Cosmic effect', 'Legendary item drop boost'],
      cosmetics: ['Cosmic Prestige Aura', 'Transcendent Title', 'Cosmic Emblem', 'Cyan Particle Trail', 'Transcendent Frame', 'Ethereal Wings', 'Halo Effect'],
    },
    {
      rank: 7,
      name: 'Divine',
      icon: '✨',
      color: '#fbbf24',
      gradientFrom: '#f59e0b',
      gradientTo: '#fbbf24',
      xpMultiplier: 4.0,
      goldMultiplier: 4.0,
      skillPointBonus: 35,
      levelRequired: 50,
      benefits: ['+300% XP gain', '+300% Gold gain', '+35 Skill Points', 'Divine glow', 'Mythic item drop boost', 'Bonus quest rewards'],
      cosmetics: ['Divine Prestige Aura', 'Divine Title', 'Holy Emblem', 'Golden Particle Trail', 'Divine Frame', 'Angelic Wings', 'Divine Halo', 'Radiant Glow'],
    },
    {
      rank: 8,
      name: 'Eternal',
      icon: '🔥',
      color: '#ef4444',
      gradientFrom: '#dc2626',
      gradientTo: '#ef4444',
      xpMultiplier: 4.5,
      goldMultiplier: 4.5,
      skillPointBonus: 40,
      levelRequired: 50,
      benefits: ['+350% XP gain', '+350% Gold gain', '+40 Skill Points', 'Eternal flame', 'Guaranteed rare drops', 'Double quest XP'],
      cosmetics: ['Infernal Prestige Aura', 'Eternal Title', 'Flame Emblem', 'Fire Particle Trail', 'Eternal Frame', 'Phoenix Wings', 'Flame Halo', 'Infernal Glow', 'Flame Cloak'],
    },
    {
      rank: 9,
      name: 'Immortal',
      icon: '💫',
      color: '#8b5cf6',
      gradientFrom: '#7c3aed',
      gradientTo: '#8b5cf6',
      xpMultiplier: 5.0,
      goldMultiplier: 5.0,
      skillPointBonus: 50,
      levelRequired: 50,
      benefits: ['+400% XP gain', '+400% Gold gain', '+50 Skill Points', 'Immortal essence', 'Maximum drop rates', 'Triple quest XP', 'Prestige shop access'],
      cosmetics: ['Celestial Prestige Aura', 'Immortal Title', 'Galaxy Emblem', 'Rainbow Particle Trail', 'Immortal Frame', 'Galaxy Wings', 'Cosmic Halo', 'Nebula Glow', 'Starlight Cloak', 'Immortal Crown'],
    },
    {
      rank: 10,
      name: 'Demigod',
      icon: '🌌',
      color: '#ffffff',
      gradientFrom: '#c084fc',
      gradientTo: '#ffffff',
      xpMultiplier: 5.0,
      goldMultiplier: 5.0,
      skillPointBonus: 60,
      levelRequired: 50,
      benefits: ['+400% XP gain', '+400% Gold gain', '+60 Skill Points', 'Demigod power', 'Perfect drop rates', 'Triple quest XP', 'Full prestige shop', 'Ultimate title'],
      cosmetics: ['Omnipotent Prestige Aura', 'Demigod Title', 'Universe Emblem', 'Prismatic Particle Trail', 'Demigod Frame', 'Ethereal Wings', 'Prismatic Halo', 'Reality Glow', 'Dimensional Cloak', 'Demigod Crown', 'Reality Distortion Effect'],
    },
  ];

  // Helper Functions
  const getCurrentTier = (): PrestigeTier => {
    return prestigeTiers.find((t) => t.rank === currentPrestige) || prestigeTiers[0];
  };

  const getNextTier = (): PrestigeTier | null => {
    if (currentPrestige >= 10) return null;
    return prestigeTiers.find((t) => t.rank === currentPrestige + 1) || null;
  };

  const canPrestige = (): boolean => {
    return currentLevel >= 50 && currentPrestige < 10;
  };

  const getStatCost = (currentValue: number): number => {
    // Diminishing returns: cost increases with value
    if (currentValue < 20) return 1;
    if (currentValue < 40) return 2;
    if (currentValue < 60) return 3;
    if (currentValue < 80) return 4;
    return 5;
  };

  const getTotalAllocated = (): number => {
    return Object.values(pendingStats).reduce((sum, val) => sum + val, 0);
  };

  const getTotalAllocatedCurrent = (): number => {
    return Object.values(currentStats).reduce((sum, val) => sum + val, 0);
  };

  const getPointsSpent = (): number => {
    let spent = 0;
    Object.keys(pendingStats).forEach((key) => {
      const statKey = key as StatType;
      const currentVal = currentStats[statKey];
      const pendingVal = pendingStats[statKey];
      
      for (let i = currentVal; i < pendingVal; i++) {
        spent += getStatCost(i);
      }
    });
    return spent;
  };

  const getPointsRemaining = (): number => {
    return availableSkillPoints - getPointsSpent();
  };

  const getStatIcon = (stat: StatType): string => {
    const icons = {
      strength: '💪',
      endurance: '🛡️',
      agility: '⚡',
      intelligence: '🧠',
      willpower: '🔥',
      charisma: '✨',
    };
    return icons[stat];
  };

  const getStatColor = (stat: StatType): string => {
    const colors = {
      strength: 'from-red-500 to-red-600',
      endurance: 'from-blue-500 to-blue-600',
      agility: 'from-green-500 to-green-600',
      intelligence: 'from-purple-500 to-purple-600',
      willpower: 'from-orange-500 to-orange-600',
      charisma: 'from-pink-500 to-pink-600',
    };
    return colors[stat];
  };

  const handleStatIncrease = (stat: StatType) => {
    const cost = getStatCost(pendingStats[stat]);
    if (getPointsRemaining() >= cost) {
      setPendingStats({
        ...pendingStats,
        [stat]: pendingStats[stat] + 1,
      });
    }
  };

  const handleStatDecrease = (stat: StatType) => {
    if (pendingStats[stat] > currentStats[stat]) {
      setPendingStats({
        ...pendingStats,
        [stat]: pendingStats[stat] - 1,
      });
    }
  };

  const handleApplyStats = () => {
    onStatAllocate(pendingStats);
  };

  const handleCancelStats = () => {
    setPendingStats(currentStats);
  };

  const handlePrestigeReset = () => {
    if (confirmText.toLowerCase() === 'prestige') {
      onPrestigeReset();
      setShowResetModal(false);
      setConfirmText('');
    }
  };

  const handleRespec = () => {
    onStatReset();
    setPendingStats(currentStats);
    setShowRespecModal(false);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const hasStatChanges = JSON.stringify(pendingStats) !== JSON.stringify(currentStats);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-900/50 rounded-lg p-1 border border-purple-500/20">
        <button
          onClick={() => setSelectedTab('prestige')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedTab === 'prestige'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🌟 Prestige Ranks
        </button>
        <button
          onClick={() => setSelectedTab('stats')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedTab === 'stats'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📊 Skill Points
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedTab === 'history'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📜 History
        </button>
      </div>

      {/* Prestige Ranks Tab */}
      {selectedTab === 'prestige' && (
        <div className="space-y-6">
          {/* Current Rank Display */}
          <div
            className="bg-slate-900/50 rounded-xl border-2 p-6 backdrop-blur-sm"
            style={{
              borderColor: currentTier.color,
              background: `linear-gradient(135deg, ${currentTier.gradientFrom}15, ${currentTier.gradientTo}15)`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{currentTier.icon}</div>
                <div>
                  <div className="text-sm text-slate-400">Current Prestige</div>
                  <div className="text-3xl font-bold" style={{ color: currentTier.color }}>
                    {currentTier.name}
                  </div>
                  <div className="text-sm text-slate-400">Rank {currentTier.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">{currentLevel}/50</div>
                <div className="text-sm text-slate-400">Level</div>
              </div>
            </div>

            {/* Current Benefits */}
            <div className="mb-4">
              <div className="text-sm font-semibold text-slate-300 mb-2">Active Benefits:</div>
              <div className="grid grid-cols-2 gap-2">
                {currentTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-green-400">✓</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Cosmetics */}
            {currentTier.cosmetics.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-2">Unlocked Cosmetics:</div>
                <div className="flex flex-wrap gap-2">
                  {currentTier.cosmetics.map((cosmetic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${currentTier.gradientFrom}, ${currentTier.gradientTo})`,
                        color: '#fff',
                      }}
                    >
                      {cosmetic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Rank Preview */}
          {nextTier && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl opacity-60">{nextTier.icon}</div>
                  <div>
                    <div className="text-sm text-slate-400">Next Prestige</div>
                    <div className="text-2xl font-bold text-slate-300">{nextTier.name}</div>
                    <div className="text-sm text-slate-500">Rank {nextTier.rank}</div>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    canPrestige()
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer hover:from-purple-700 hover:to-pink-700'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  onClick={() => canPrestige() && setShowResetModal(true)}
                >
                  {canPrestige() ? '🚀 Prestige Now' : `Reach Level ${nextTier.levelRequired}`}
                </div>
              </div>

              {/* Next Tier Benefits */}
              <div>
                <div className="text-sm font-semibold text-slate-400 mb-2">Unlocks:</div>
                <div className="grid grid-cols-2 gap-2">
                  {nextTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="text-purple-400">➤</span>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prestige Ladder */}
          <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Prestige Ladder</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {prestigeTiers.map((tier) => (
                <div
                  key={tier.rank}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    tier.rank === currentPrestige
                      ? 'border-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30'
                      : tier.rank < currentPrestige
                      ? 'border-green-500/30 bg-green-900/10'
                      : 'border-slate-700 bg-slate-800/30 opacity-60'
                  }`}
                  style={tier.rank === currentPrestige ? { borderColor: tier.color } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tier.icon}</div>
                    <div>
                      <div className="font-bold text-slate-200">{tier.name}</div>
                      <div className="text-xs text-slate-400">
                        {tier.xpMultiplier}x XP • {tier.goldMultiplier}x Gold • +{tier.skillPointBonus} SP
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: tier.color }}>
                      Rank {tier.rank}
                    </div>
                    {tier.rank === currentPrestige && (
                      <div className="text-xs text-purple-400">Current</div>
                    )}
                    {tier.rank < currentPrestige && (
                      <div className="text-xs text-green-400">Completed</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skill Points Tab */}
      {selectedTab === 'stats' && (
        <div className="space-y-6">
          {/* Points Available */}
          <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-slate-400">Available Skill Points</div>
                <div className="text-4xl font-bold text-purple-400">{getPointsRemaining()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Total Earned</div>
                <div className="text-2xl font-bold text-slate-300">{availableSkillPoints}</div>
              </div>
            </div>

            {hasStatChanges && (
              <div className="flex gap-2">
                <button
                  onClick={handleApplyStats}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all"
                >
                  ✓ Apply Changes
                </button>
                <button
                  onClick={handleCancelStats}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>

          {/* Stat Allocation */}
          <div className="space-y-4">
            {(Object.keys(pendingStats) as StatType[]).map((stat) => {
              const currentValue = pendingStats[stat];
              const originalValue = currentStats[stat];
              const cost = getStatCost(currentValue);
              const hasChanged = currentValue !== originalValue;

              return (
                <div
                  key={stat}
                  className={`bg-slate-900/50 rounded-xl border p-4 backdrop-blur-sm ${
                    hasChanged ? 'border-purple-500/50' : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getStatIcon(stat)}</div>
                      <div>
                        <div className="font-bold text-slate-200 capitalize">{stat}</div>
                        <div className="text-xs text-slate-400">
                          Next point costs: {cost} {cost === 1 ? 'point' : 'points'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatDecrease(stat)}
                        disabled={currentValue <= originalValue}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold transition-colors"
                      >
                        -
                      </button>
                      <div className="text-2xl font-bold text-purple-400 w-12 text-center">
                        {currentValue}
                      </div>
                      <button
                        onClick={() => handleStatIncrease(stat)}
                        disabled={getPointsRemaining() < cost}
                        className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Stat Bar */}
                  <div className="relative w-full bg-slate-800 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${getStatColor(stat)} transition-all duration-300`}
                      style={{ width: `${Math.min((currentValue / 100) * 100, 100)}%` }}
                    ></div>
                  </div>

                  {hasChanged && (
                    <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                      <span>➤</span>
                      Changed from {originalValue} to {currentValue} (+{currentValue - originalValue})
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset Stats Button */}
          <button
            onClick={() => setShowRespecModal(true)}
            className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors border border-slate-600"
          >
            🔄 Reset All Stats (Cost: 1000 Gold)
          </button>
        </div>
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="space-y-6">
          {/* Lifetime Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-2xl font-bold text-purple-400">{prestigeHistory.length}</div>
              <div className="text-sm text-slate-400">Total Prestiges</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-blue-500/20 p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-blue-400">{currentLevel}</div>
              <div className="text-sm text-slate-400">Highest Level</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-pink-500/20 p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-pink-400">{totalXP.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total XP Earned</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl border border-amber-500/20 p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-amber-400">
                {prestigeHistory.length > 0 ? prestigeHistory[0].timeSpent : '0d'}
              </div>
              <div className="text-sm text-slate-400">Play Time</div>
            </div>
          </div>

          {/* Prestige History Log */}
          <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Prestige History</h3>
            {prestigeHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {prestigeHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌟</div>
                      <div>
                        <div className="font-semibold text-slate-200">
                          Prestige {entry.prestigeNumber}
                        </div>
                        <div className="text-xs text-slate-400">{entry.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-400">
                        Level {entry.levelAchieved}
                      </div>
                      <div className="text-xs text-slate-400">{entry.timeSpent}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <div className="text-4xl mb-2">📜</div>
                <div>No prestige history yet</div>
                <div className="text-sm">Reach level 50 to prestige for the first time!</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prestige Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border-2 border-purple-500 p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">⚠️ Prestige Reset</h3>
            <div className="mb-4 space-y-3">
              <p className="text-slate-300">You are about to reset your profile and gain prestige!</p>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <div className="text-sm font-semibold text-red-400 mb-2">You will LOSE:</div>
                <ul className="text-xs text-red-300 space-y-1">
                  <li>• All levels (reset to 1)</li>
                  <li>• All XP progress</li>
                  <li>• Current items (excluding cosmetics)</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <div className="text-sm font-semibold text-green-400 mb-2">You will KEEP:</div>
                <ul className="text-xs text-green-300 space-y-1">
                  <li>• All achievements</li>
                  <li>• All cosmetic items</li>
                  <li>• Skill point allocations</li>
                  <li>• Prestige history</li>
                </ul>
              </div>

              {nextTier && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-sm font-semibold text-purple-400 mb-2">You will GAIN:</div>
                  <ul className="text-xs text-purple-300 space-y-1">
                    <li>• {nextTier.name} rank ({nextTier.icon})</li>
                    <li>• {nextTier.xpMultiplier}x XP multiplier</li>
                    <li>• {nextTier.goldMultiplier}x Gold multiplier</li>
                    <li>• +{nextTier.skillPointBonus} Skill Points</li>
                    <li>• {nextTier.cosmetics.length} new cosmetics</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="text-sm text-slate-400 mb-2 block">
                Type "PRESTIGE" to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="PRESTIGE"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrestigeReset}
                disabled={confirmText.toLowerCase() !== 'prestige'}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-all"
              >
                Confirm Prestige
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setConfirmText('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Respec Modal */}
      {showRespecModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border-2 border-purple-500 p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🔄 Reset Stats</h3>
            <p className="text-slate-300 mb-4">
              Reset all allocated skill points for 1000 Gold? This will refund all your points so you can reallocate them.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRespec}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowRespecModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
