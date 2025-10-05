'use client';

import { useState } from 'react';
import WorldMap from '@/components/world-map';
import { ParticleBackground } from '@/components/particle-background';

type RegionStatus = 'locked' | 'unlocked' | 'current' | 'completed';
type RegionDifficulty = 1 | 2 | 3 | 4 | 5;

interface RegionChallenge {
  id: string;
  name: string;
  type: 'boss' | 'quest' | 'dungeon' | 'trial';
  difficulty: RegionDifficulty;
  completed: boolean;
  reward: string;
}

interface Region {
  id: string;
  name: string;
  description: string;
  lore: string;
  status: RegionStatus;
  levelRequirement: number;
  difficulty: RegionDifficulty;
  completionPercentage: number;
  challenges: RegionChallenge[];
  rewards: string[];
  bonus: string;
  x: number;
  y: number;
  connectsTo: string[];
}

export default function WorldPage() {
  const currentLevel = 47;

  const [regions, setRegions] = useState<Region[]>([
    {
      id: 'starter-plains',
      name: 'Starter Plains',
      description: 'A peaceful meadow where all journeys begin. Master the fundamentals here.',
      lore: 'In these tranquil fields, legends first took their steps toward greatness.',
      status: 'completed',
      levelRequirement: 1,
      difficulty: 1,
      completionPercentage: 100,
      x: 150,
      y: 450,
      connectsTo: ['iron-valley'],
      challenges: [
        {
          id: 'first-steps',
          name: 'First Steps',
          type: 'quest',
          difficulty: 1,
          completed: true,
          reward: '500 XP, Basic Gear',
        },
        {
          id: 'training-dummy',
          name: 'Training Dummy Boss',
          type: 'boss',
          difficulty: 1,
          completed: true,
          reward: '1000 XP, Wooden Sword',
        },
        {
          id: 'beginner-trial',
          name: 'Trial of Beginnings',
          type: 'trial',
          difficulty: 1,
          completed: true,
          reward: '1500 XP, Starter Kit',
        },
      ],
      rewards: ['Foundation Mastery Title', 'Beginner\'s Luck Charm', '5000 Gold'],
      bonus: '+10% XP gain for all activities',
    },
    {
      id: 'iron-valley',
      name: 'Iron Valley',
      description: 'A rugged landscape where warriors forge their strength through discipline.',
      lore: 'The valley where iron wills are tempered by sweat and determination.',
      status: 'completed',
      levelRequirement: 10,
      difficulty: 2,
      completionPercentage: 100,
      x: 300,
      y: 400,
      connectsTo: ['starter-plains', 'obsidian-peaks'],
      challenges: [
        {
          id: 'strength-quest',
          name: 'Path of Strength',
          type: 'quest',
          difficulty: 2,
          completed: true,
          reward: '2500 XP, Iron Gauntlets',
        },
        {
          id: 'iron-golem',
          name: 'Iron Golem Guardian',
          type: 'boss',
          difficulty: 2,
          completed: true,
          reward: '5000 XP, Epic Armor',
        },
        {
          id: 'endurance-dungeon',
          name: 'Cavern of Endurance',
          type: 'dungeon',
          difficulty: 2,
          completed: true,
          reward: '7500 XP, Legendary Boots',
        },
        {
          id: 'iron-trial',
          name: 'Trial of Iron Will',
          type: 'trial',
          difficulty: 2,
          completed: true,
          reward: '10000 XP, Rare Accessory',
        },
      ],
      rewards: ['Iron Warrior Title', 'Valley Champion Medal', '15000 Gold', 'Strength Elixir x5'],
      bonus: '+15% Strength stat gains',
    },
    {
      id: 'obsidian-peaks',
      name: 'Obsidian Peaks',
      description: 'Treacherous mountains where only the dedicated dare to climb.',
      lore: 'Among these black peaks, the worthy separate themselves from the weak.',
      status: 'current',
      levelRequirement: 25,
      difficulty: 3,
      completionPercentage: 65,
      x: 450,
      y: 300,
      connectsTo: ['iron-valley', 'dragon-lair'],
      challenges: [
        {
          id: 'mountain-quest',
          name: 'Ascension Quest',
          type: 'quest',
          difficulty: 3,
          completed: true,
          reward: '15000 XP, Obsidian Blade',
        },
        {
          id: 'frost-titan',
          name: 'Frost Titan',
          type: 'boss',
          difficulty: 3,
          completed: true,
          reward: '25000 XP, Mythic Weapon',
        },
        {
          id: 'peak-dungeon',
          name: 'Summit Fortress',
          type: 'dungeon',
          difficulty: 3,
          completed: false,
          reward: '30000 XP, Legendary Set Piece',
        },
        {
          id: 'altitude-trial',
          name: 'Trial of Altitude',
          type: 'trial',
          difficulty: 3,
          completed: true,
          reward: '20000 XP, Epic Mount',
        },
        {
          id: 'avalanche-challenge',
          name: 'Avalanche Survival',
          type: 'quest',
          difficulty: 3,
          completed: false,
          reward: '18000 XP, Cold Resistance Potion x10',
        },
      ],
      rewards: [
        'Peak Conqueror Title',
        'Obsidian Crown',
        '50000 Gold',
        'Mythic Material x3',
        'Altitude Mastery Skill',
      ],
      bonus: '+20% Endurance and +15% Stamina regeneration',
    },
    {
      id: 'dragon-lair',
      name: "Dragon's Lair",
      description: 'The legendary domain of ancient dragons. Ultimate challenges await.',
      lore: 'Where fire meets fury, and only the mightiest dare to tread.',
      status: 'unlocked',
      levelRequirement: 40,
      difficulty: 4,
      completionPercentage: 15,
      x: 600,
      y: 200,
      connectsTo: ['obsidian-peaks', 'celestial-highlands'],
      challenges: [
        {
          id: 'dragon-hunt',
          name: 'The Dragon Hunt',
          type: 'quest',
          difficulty: 4,
          completed: true,
          reward: '40000 XP, Dragon Scale Armor',
        },
        {
          id: 'elder-dragon',
          name: 'Elder Dragon',
          type: 'boss',
          difficulty: 5,
          completed: false,
          reward: '100000 XP, Mythic Dragonheart Weapon',
        },
        {
          id: 'lair-dungeon',
          name: 'Dragon Hoard Depths',
          type: 'dungeon',
          difficulty: 4,
          completed: false,
          reward: '50000 XP, Legendary Treasure',
        },
        {
          id: 'fire-trial',
          name: 'Trial by Fire',
          type: 'trial',
          difficulty: 4,
          completed: false,
          reward: '45000 XP, Phoenix Feather',
        },
        {
          id: 'whelp-swarm',
          name: 'Dragon Whelp Swarm',
          type: 'quest',
          difficulty: 3,
          completed: false,
          reward: '35000 XP, Dragon Essence x5',
        },
        {
          id: 'flame-gauntlet',
          name: 'Flame Gauntlet',
          type: 'trial',
          difficulty: 4,
          completed: false,
          reward: '55000 XP, Inferno Cape',
        },
      ],
      rewards: [
        'Dragonslayer Title',
        'Wyrm Conqueror Achievement',
        '250000 Gold',
        'Mythic Dragon Egg Pet',
        'Fire Mastery Skill Tree',
        'Dragon Scale Material x50',
      ],
      bonus: '+30% Fire damage, +25% Critical hit chance',
    },
    {
      id: 'celestial-highlands',
      name: 'Celestial Highlands',
      description: 'The realm of legends where mortals ascend to divinity.',
      lore: 'Beyond the clouds, where the gods themselves watch your journey.',
      status: 'locked',
      levelRequirement: 50,
      difficulty: 5,
      completionPercentage: 0,
      x: 650,
      y: 100,
      connectsTo: ['dragon-lair'],
      challenges: [
        {
          id: 'ascension-quest',
          name: 'Path to Ascension',
          type: 'quest',
          difficulty: 5,
          completed: false,
          reward: '100000 XP, Divine Artifact',
        },
        {
          id: 'celestial-guardian',
          name: 'Celestial Guardian',
          type: 'boss',
          difficulty: 5,
          completed: false,
          reward: '250000 XP, Mythic Celestial Weapon',
        },
        {
          id: 'heaven-dungeon',
          name: 'Halls of Eternity',
          type: 'dungeon',
          difficulty: 5,
          completed: false,
          reward: '150000 XP, Godly Armor Set',
        },
        {
          id: 'divinity-trial',
          name: 'Trial of Divinity',
          type: 'trial',
          difficulty: 5,
          completed: false,
          reward: '200000 XP, Prestige Rank Up',
        },
        {
          id: 'angel-boss',
          name: 'Fallen Angel',
          type: 'boss',
          difficulty: 5,
          completed: false,
          reward: '175000 XP, Wings of Valor',
        },
        {
          id: 'starlight-trial',
          name: 'Starlight Crucible',
          type: 'trial',
          difficulty: 5,
          completed: false,
          reward: '225000 XP, Cosmic Power Unlock',
        },
        {
          id: 'final-ascension',
          name: 'Final Ascension',
          type: 'quest',
          difficulty: 5,
          completed: false,
          reward: '500000 XP, Legendary Status',
        },
      ],
      rewards: [
        'Ascended One Title',
        'Celestial Crown',
        '1000000 Gold',
        'Mythic Celestial Mount',
        'Divine Skill Tree Unlock',
        'Prestige Rank: Demigod',
        'Rainbow Particle Effect',
        'Immortal Achievement',
      ],
      bonus: '+50% All Stats, Prestige XP multiplier x2',
    },
  ]);

  const handleRegionClick = (region: Region) => {
    console.log('Region clicked:', region.name);
  };

  const handleFastTravel = (regionId: string) => {
    console.log('Fast traveling to:', regionId);
    
    setRegions((prevRegions) =>
      prevRegions.map((region) => ({
        ...region,
        status:
          region.id === regionId
            ? 'current'
            : region.status === 'current'
            ? 'unlocked'
            : region.status,
      }))
    );

    alert(`Fast traveled to ${regions.find(r => r.id === regionId)?.name}!`);
  };

  const handleChallengeStart = (regionId: string, challengeId: string) => {
    const region = regions.find((r) => r.id === regionId);
    const challenge = region?.challenges.find((c) => c.id === challengeId);
    
    console.log('Starting challenge:', challenge?.name, 'in', region?.name);
    alert(`Starting challenge: ${challenge?.name}\nGood luck, adventurer!`);
  };

  // Calculate exploration stats
  const totalRegions = regions.length;
  const unlockedRegions = regions.filter(r => r.status !== 'locked').length;
  const completedRegions = regions.filter(r => r.status === 'completed').length;
  const totalChallenges = regions.reduce((sum, r) => sum + r.challenges.length, 0);
  const completedChallenges = regions.reduce(
    (sum, r) => sum + r.challenges.filter(c => c.completed).length,
    0
  );
  const overallCompletion = Math.round(
    (regions.reduce((sum, r) => sum + r.completionPercentage, 0) / totalRegions)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground
        particleCount={80}
        colors={['#a855f7', '#ec4899', '#3b82f6']}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🗺️ World Atlas
          </h1>
          <p className="text-slate-300 text-lg">
            Explore the realm of Astral Forge and conquer legendary challenges
          </p>
        </div>

        {/* Exploration Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-purple-400">{unlockedRegions}/{totalRegions}</div>
            <div className="text-slate-400 text-sm">Regions Unlocked</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-blue-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-blue-400">{completedRegions}/{totalRegions}</div>
            <div className="text-slate-400 text-sm">Regions Completed</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-pink-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">⚔️</div>
            <div className="text-2xl font-bold text-pink-400">{completedChallenges}/{totalChallenges}</div>
            <div className="text-slate-400 text-sm">Challenges Done</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-amber-500/20 p-4 backdrop-blur-sm">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-amber-400">{overallCompletion}%</div>
            <div className="text-slate-400 text-sm">Overall Progress</div>
          </div>
        </div>

        {/* World Map */}
        <WorldMap
          regions={regions}
          currentLevel={currentLevel}
          onRegionClick={handleRegionClick}
          onFastTravel={handleFastTravel}
          onChallengeStart={handleChallengeStart}
        />

        {/* Explorer's Guide */}
        <div className="mt-8 bg-slate-900/50 rounded-xl border border-purple-500/20 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📖 Explorer's Guide</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Locked Regions</div>
                <div className="text-slate-400">
                  Reach the required level to unlock new regions. Each region offers unique challenges and rewards.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Difficulty Ratings</div>
                <div className="text-slate-400">
                  Stars indicate difficulty (1-5). Higher difficulty means greater challenges and better rewards.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Complete Challenges</div>
                <div className="text-slate-400">
                  Each region has multiple challenges. Complete them all to earn 100% completion and special bonuses.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Fast Travel</div>
                <div className="text-slate-400">
                  Quickly travel to any unlocked region. Perfect for revisiting previous areas or claiming rewards.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🎁</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Regional Bonuses</div>
                <div className="text-slate-400">
                  Each region provides unique bonuses while you're there. Stack bonuses for maximum efficiency!
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-semibold text-slate-200 mb-1">Legendary Rewards</div>
                <div className="text-slate-400">
                  Complete all challenges in a region to unlock legendary titles, exclusive items, and prestige ranks.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Location Info */}
        {regions.find(r => r.status === 'current') && (
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📍</span>
              <div>
                <div className="text-sm text-purple-400">Current Location</div>
                <div className="text-2xl font-bold text-white">
                  {regions.find(r => r.status === 'current')?.name}
                </div>
              </div>
            </div>
            <p className="text-slate-300 mb-3">
              {regions.find(r => r.status === 'current')?.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Progress:</span>
                <span className="font-semibold text-white">
                  {regions.find(r => r.status === 'current')?.completionPercentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Active Bonus:</span>
                <span className="font-semibold text-amber-300">
                  {regions.find(r => r.status === 'current')?.bonus}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
