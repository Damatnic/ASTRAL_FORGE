'use client';

import { useState } from 'react';
import PrestigeSystem from '@/components/prestige-system';
import { ParticleBackground } from '@/components/particle-background';

type PrestigeRank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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

export default function PrestigePage() {
  const [currentPrestige, setCurrentPrestige] = useState<PrestigeRank>(3);
  const [currentLevel, setCurrentLevel] = useState(47);
  const [totalXP, setTotalXP] = useState(2847350);
  const [availableSkillPoints, setAvailableSkillPoints] = useState(62);
  const [currentStats, setCurrentStats] = useState<StatAllocation>({
    strength: 35,
    endurance: 28,
    agility: 22,
    intelligence: 18,
    willpower: 25,
    charisma: 15,
  });

  const [prestigeHistory, setPrestigeHistory] = useState<PrestigeHistory[]>([
    {
      prestigeNumber: 3,
      date: 'Oct 1, 2025',
      levelAchieved: 50,
      timeSpent: '28d 14h',
    },
    {
      prestigeNumber: 2,
      date: 'Sep 3, 2025',
      levelAchieved: 50,
      timeSpent: '25d 8h',
    },
    {
      prestigeNumber: 1,
      date: 'Aug 9, 2025',
      levelAchieved: 50,
      timeSpent: '32d 2h',
    },
  ]);

  const handlePrestigeReset = () => {
    console.log('Prestiging to rank:', currentPrestige + 1);
    
    // Calculate new skill points bonus
    const prestigeBonus = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60][currentPrestige + 1];
    
    // Add prestige history entry
    const newEntry: PrestigeHistory = {
      prestigeNumber: currentPrestige + 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      levelAchieved: currentLevel,
      timeSpent: '18d 6h', // Would calculate from actual play time
    };
    
    setPrestigeHistory([newEntry, ...prestigeHistory]);
    setCurrentPrestige((currentPrestige + 1) as PrestigeRank);
    setCurrentLevel(1);
    setAvailableSkillPoints(availableSkillPoints + prestigeBonus);
    
    alert(`🎉 Congratulations! You've reached Prestige Rank ${currentPrestige + 1}!\n\nYou gained +${prestigeBonus} Skill Points!`);
  };

  const handleStatAllocate = (stats: StatAllocation) => {
    console.log('Allocating stats:', stats);
    setCurrentStats(stats);
    
    // Calculate points spent
    const pointsSpent = Object.values(stats).reduce((sum, val) => sum + val, 0) -
                       Object.values(currentStats).reduce((sum, val) => sum + val, 0);
    
    setAvailableSkillPoints(availableSkillPoints - pointsSpent);
    alert(`✓ Stats allocated successfully! Spent ${pointsSpent} skill points.`);
  };

  const handleStatReset = () => {
    console.log('Resetting stats');
    
    // Refund all allocated points (minus base starting points)
    const basePoints = 60; // Starting points at level 1
    const allocatedPoints = Object.values(currentStats).reduce((sum, val) => sum + val, 0);
    const pointsToRefund = allocatedPoints - basePoints;
    
    // Reset to base stats
    setCurrentStats({
      strength: 10,
      endurance: 10,
      agility: 10,
      intelligence: 10,
      willpower: 10,
      charisma: 10,
    });
    
    setAvailableSkillPoints(availableSkillPoints + pointsToRefund);
    alert(`🔄 Stats reset! ${pointsToRefund} skill points refunded.\n\nCost: 1000 Gold`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground
        particleCount={90}
        colors={['#a855f7', '#ec4899', '#f59e0b']}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            🌟 Prestige & Progression
          </h1>
          <p className="text-slate-300 text-lg">
            Ascend beyond mortal limits and unlock legendary power
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-purple-400">Rank {currentPrestige}</div>
            <div className="text-sm text-slate-400">Prestige Level</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-blue-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-blue-400">{currentLevel}/50</div>
            <div className="text-sm text-slate-400">Current Level</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-pink-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-2xl font-bold text-pink-400">{availableSkillPoints}</div>
            <div className="text-sm text-slate-400">Skill Points</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-amber-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-amber-400">{totalXP.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total XP</div>
          </div>
        </div>

        {/* Prestige System Component */}
        <div className="bg-slate-900/30 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
          <PrestigeSystem
            currentPrestige={currentPrestige}
            currentLevel={currentLevel}
            totalXP={totalXP}
            availableSkillPoints={availableSkillPoints}
            currentStats={currentStats}
            prestigeHistory={prestigeHistory}
            onPrestigeReset={handlePrestigeReset}
            onStatAllocate={handleStatAllocate}
            onStatReset={handleStatReset}
          />
        </div>

        {/* Progression Guide */}
        <div className="mt-8 bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📖 Progression Guide</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Prestige System</div>
                <div className="text-slate-400">
                  Reach level 50 to prestige and gain permanent bonuses. Each prestige rank increases XP/Gold multipliers and grants bonus skill points.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💎</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Skill Points</div>
                <div className="text-slate-400">
                  Earn 1 skill point per level, plus bonus points from prestige. Allocate them wisely to enhance your primary stats.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Diminishing Returns</div>
                <div className="text-slate-400">
                  Stats become more expensive as they increase. Plan your build carefully or use respec to reallocate.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Stat Respec</div>
                <div className="text-slate-400">
                  Reset all your stat allocations for 1000 Gold. Experiment with different builds to find your perfect playstyle.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Cosmetic Rewards</div>
                <div className="text-slate-400">
                  Each prestige rank unlocks exclusive cosmetics, auras, and visual effects that persist through resets.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Strategic Planning</div>
                <div className="text-slate-400">
                  Balance your stats based on your playstyle. Strength for damage, Endurance for survival, Agility for speed, etc.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Descriptions */}
        <div className="mt-8 bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📊 Stat Descriptions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-900/20 to-red-900/10 rounded-lg p-4 border border-red-500/30">
              <div className="text-3xl mb-2">💪</div>
              <div className="font-bold text-red-400 mb-2">Strength</div>
              <div className="text-sm text-slate-300">
                Increases physical damage, carry weight, and lifting capacity. Essential for power-based builds.
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 rounded-lg p-4 border border-blue-500/30">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="font-bold text-blue-400 mb-2">Endurance</div>
              <div className="text-sm text-slate-300">
                Boosts max HP, stamina regeneration, and damage resistance. Crucial for survival and long sessions.
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 rounded-lg p-4 border border-green-500/30">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-green-400 mb-2">Agility</div>
              <div className="text-sm text-slate-300">
                Enhances movement speed, attack speed, and critical hit chance. Perfect for fast-paced gameplay.
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/10 rounded-lg p-4 border border-purple-500/30">
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-bold text-purple-400 mb-2">Intelligence</div>
              <div className="text-sm text-slate-300">
                Improves XP gain, skill unlock speed, and technique mastery. Great for efficient progression.
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-orange-900/10 rounded-lg p-4 border border-orange-500/30">
              <div className="text-3xl mb-2">🔥</div>
              <div className="font-bold text-orange-400 mb-2">Willpower</div>
              <div className="text-sm text-slate-300">
                Increases max stamina, consistency bonuses, and mental fortitude. Key for maintaining streaks.
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-900/20 to-pink-900/10 rounded-lg p-4 border border-pink-500/30">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-bold text-pink-400 mb-2">Charisma</div>
              <div className="text-sm text-slate-300">
                Boosts guild bonuses, social rewards, and rare item drop rates. Excellent for collectors.
              </div>
            </div>
          </div>
        </div>

        {/* Prestige Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-purple-400 mb-3">💡 Prestige Tips</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Complete all achievements and collect cosmetics before prestiging to maximize rewards.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Higher prestige ranks dramatically speed up leveling with increased XP multipliers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Plan your stat build around your preferred workout style - there's no wrong choice!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Respec costs stay the same regardless of how many points you've allocated - experiment freely!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>Each prestige unlocks exclusive cosmetics that show off your dedication and progress.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              <span>The journey to Demigod (Rank 10) takes dedication, but the rewards are legendary!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
