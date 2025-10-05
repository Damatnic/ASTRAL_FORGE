'use client';

import { useState, useEffect } from 'react';
import PetCompanion from '@/components/pet-companion';
import { ParticleBackground } from '@/components/particle-background';

type PetSpecies = 'phoenix' | 'dragon' | 'wolf' | 'unicorn' | 'griffin' | 'hydra' | 'cosmic';
type EvolutionStage = 'egg' | 'baby' | 'adult' | 'elder';
type AbilityType = 'combat' | 'utility' | 'passive';

interface PetStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

interface PetAbility {
  id: string;
  name: string;
  type: AbilityType;
  description: string;
  icon: string;
  cooldown: number;
  unlockBondLevel: number;
  effect: string;
}

interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  stage: EvolutionStage;
  level: number;
  xp: number;
  xpToNext: number;
  happiness: number;
  bondLevel: number;
  bondXp: number;
  bondXpToNext: number;
  stats: PetStats;
  abilities: PetAbility[];
  isActive: boolean;
  timeSinceLastFed: number;
  cosmetics: string[];
  color: string;
}

export default function PetsPage() {
  const [gold, setGold] = useState(5000);
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 'pet-1',
      name: 'Ember',
      species: 'phoenix',
      stage: 'adult',
      level: 18,
      xp: 2450,
      xpToNext: 3000,
      happiness: 85,
      bondLevel: 6,
      bondXp: 340,
      bondXpToNext: 600,
      stats: {
        health: 65,
        attack: 72,
        defense: 48,
        speed: 68,
      },
      abilities: [
        {
          id: 'fireball',
          name: 'Fireball',
          type: 'combat',
          description: 'Unleash a blazing fireball dealing 150% attack damage',
          icon: '🔥',
          cooldown: 8,
          unlockBondLevel: 2,
          effect: '+150% damage',
        },
        {
          id: 'phoenix-heal',
          name: 'Phoenix Regeneration',
          type: 'utility',
          description: 'Restore 30% of max HP over 5 seconds',
          icon: '❤️‍🔥',
          cooldown: 15,
          unlockBondLevel: 4,
          effect: '+30% HP',
        },
        {
          id: 'flame-aura',
          name: 'Flame Aura',
          type: 'passive',
          description: 'Permanently increases attack by 15%',
          icon: '✨',
          cooldown: 0,
          unlockBondLevel: 5,
          effect: '+15% ATK',
        },
      ],
      isActive: true,
      timeSinceLastFed: 2,
      cosmetics: ['Flame Crown', 'Ember Wings', 'Fire Trail'],
      color: 'from-red-500 to-orange-500',
    },
    {
      id: 'pet-2',
      name: 'Frostbite',
      species: 'wolf',
      stage: 'baby',
      level: 8,
      xp: 850,
      xpToNext: 1200,
      happiness: 92,
      bondLevel: 3,
      bondXp: 180,
      bondXpToNext: 300,
      stats: {
        health: 45,
        attack: 38,
        defense: 52,
        speed: 58,
      },
      abilities: [
        {
          id: 'ice-fang',
          name: 'Ice Fang',
          type: 'combat',
          description: 'Bite with frozen fangs, dealing damage and slowing enemy',
          icon: '🧊',
          cooldown: 6,
          unlockBondLevel: 2,
          effect: '+100% damage + slow',
        },
      ],
      isActive: false,
      timeSinceLastFed: 1,
      cosmetics: ['Frost Collar'],
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'pet-3',
      name: 'Sparkle',
      species: 'unicorn',
      stage: 'adult',
      level: 22,
      xp: 3100,
      xpToNext: 4000,
      happiness: 78,
      bondLevel: 7,
      bondXp: 520,
      bondXpToNext: 700,
      stats: {
        health: 70,
        attack: 55,
        defense: 62,
        speed: 75,
      },
      abilities: [
        {
          id: 'healing-light',
          name: 'Healing Light',
          type: 'utility',
          description: 'Heal yourself and nearby allies for 40% max HP',
          icon: '💫',
          cooldown: 12,
          unlockBondLevel: 3,
          effect: '+40% HP AoE',
        },
        {
          id: 'blessing',
          name: 'Unicorn Blessing',
          type: 'passive',
          description: 'Increase XP gain by 20%',
          icon: '🌟',
          cooldown: 0,
          unlockBondLevel: 5,
          effect: '+20% XP',
        },
        {
          id: 'rainbow-shield',
          name: 'Rainbow Shield',
          type: 'combat',
          description: 'Create a magical barrier absorbing 200 damage',
          icon: '🌈',
          cooldown: 10,
          unlockBondLevel: 6,
          effect: '200 shield',
        },
      ],
      isActive: false,
      timeSinceLastFed: 3,
      cosmetics: ['Rainbow Horn', 'Sparkle Mane', 'Star Hooves', 'Magic Aura'],
      color: 'from-pink-500 to-purple-500',
    },
  ]);
  const [activePetId, setActivePetId] = useState<string | null>('pet-1');

  // Sample abilities database (for unlocking new abilities)
  const allAbilities: Record<string, PetAbility[]> = {
    phoenix: [
      {
        id: 'inferno',
        name: 'Inferno Blast',
        type: 'combat',
        description: 'Massive AoE fire explosion dealing 250% damage',
        icon: '💥',
        cooldown: 20,
        unlockBondLevel: 8,
        effect: '+250% AoE damage',
      },
      {
        id: 'rebirth',
        name: 'Rebirth',
        type: 'utility',
        description: 'Revive once per battle with 50% HP',
        icon: '🔄',
        cooldown: 60,
        unlockBondLevel: 9,
        effect: 'Auto-revive',
      },
    ],
    wolf: [
      {
        id: 'pack-leader',
        name: 'Pack Leader',
        type: 'passive',
        description: 'Increase all stats by 10% when in a guild',
        icon: '🐺',
        cooldown: 0,
        unlockBondLevel: 5,
        effect: '+10% all stats',
      },
    ],
    unicorn: [
      {
        id: 'purify',
        name: 'Purify',
        type: 'utility',
        description: 'Remove all debuffs from yourself',
        icon: '✨',
        cooldown: 18,
        unlockBondLevel: 8,
        effect: 'Cleanse all debuffs',
      },
    ],
  };

  // Handle feeding pet
  const handleFeedPet = (petId: string, foodId: string) => {
    const foodCosts = { berry: 50, meat: 100, nectar: 200, elixir: 500 };
    const foodHappiness = { berry: 10, meat: 15, nectar: 25, elixir: 40 };

    const cost = foodCosts[foodId as keyof typeof foodCosts];
    if (gold < cost) return;

    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            ...pet,
            happiness: Math.min(pet.happiness + foodHappiness[foodId as keyof typeof foodHappiness], 100),
            timeSinceLastFed: 0,
          };
        }
        return pet;
      })
    );
    setGold((prev) => prev - cost);
  };

  // Handle playing mini-game
  const handlePlayGame = (petId: string, gameId: string) => {
    const bondRewards = { fetch: 10, puzzle: 12, strength: 8, rhythm: 15 };
    const statBoosts: Record<string, keyof PetStats> = {
      fetch: 'speed',
      puzzle: 'attack',
      strength: 'defense',
      rhythm: 'health',
    };

    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          const newBondXp = pet.bondXp + bondRewards[gameId as keyof typeof bondRewards];
          const bondLevelUp = newBondXp >= pet.bondXpToNext;

          return {
            ...pet,
            bondXp: bondLevelUp ? newBondXp - pet.bondXpToNext : newBondXp,
            bondLevel: bondLevelUp ? pet.bondLevel + 1 : pet.bondLevel,
            bondXpToNext: bondLevelUp ? pet.bondXpToNext + 100 : pet.bondXpToNext,
            happiness: Math.min(pet.happiness + 5, 100),
            stats: {
              ...pet.stats,
              [statBoosts[gameId]]: pet.stats[statBoosts[gameId]] + 1,
            },
          };
        }
        return pet;
      })
    );
  };

  // Handle stat training
  const handleTrainStat = (petId: string, stat: keyof PetStats) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            ...pet,
            stats: {
              ...pet.stats,
              [stat]: pet.stats[stat] + 2,
            },
            xp: pet.xp + 50,
          };
        }
        return pet;
      })
    );
  };

  // Handle evolution
  const handleEvolvePet = (petId: string) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          const stages: EvolutionStage[] = ['egg', 'baby', 'adult', 'elder'];
          const currentIndex = stages.indexOf(pet.stage);
          const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : pet.stage;

          // Stat boost on evolution
          const statBoost = 10;

          return {
            ...pet,
            stage: nextStage,
            stats: {
              health: pet.stats.health + statBoost,
              attack: pet.stats.attack + statBoost,
              defense: pet.stats.defense + statBoost,
              speed: pet.stats.speed + statBoost,
            },
            cosmetics: [...pet.cosmetics, `${nextStage.charAt(0).toUpperCase() + nextStage.slice(1)} Form`],
          };
        }
        return pet;
      })
    );
  };

  // Set active pet
  const handleSetActivePet = (petId: string) => {
    setPets((prev) =>
      prev.map((pet) => ({
        ...pet,
        isActive: pet.id === petId,
      }))
    );
    setActivePetId(petId);
  };

  // Rename pet
  const handleRenamePet = (petId: string, newName: string) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return { ...pet, name: newName };
        }
        return pet;
      })
    );
  };

  // Simulate happiness decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPets((prev) =>
        prev.map((pet) => ({
          ...pet,
          happiness: Math.max(pet.happiness - 0.5, 0),
          timeSinceLastFed: pet.timeSinceLastFed + 0.1,
        }))
      );
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const activePet = pets.find((p) => p.id === activePetId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white p-6">
      <ParticleBackground particleCount={80} colors={['#a855f7', '#ec4899', '#f59e0b']} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
              🐾 Companion Pets
            </h1>
            <p className="text-white/60">
              Raise loyal companions to fight alongside you and boost your training!
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-3">
            <div className="text-sm text-white/60 mb-1">Gold</div>
            <div className="text-2xl font-bold text-yellow-400">{gold.toLocaleString()} 💰</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">🐾</div>
            <div className="text-2xl font-bold text-purple-400">{pets.length}</div>
            <div className="text-sm text-white/60">Total Pets</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-pink-400">
              {activePet?.bondLevel || 0}
            </div>
            <div className="text-sm text-white/60">Active Pet Bond</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">😊</div>
            <div className="text-2xl font-bold text-green-400">
              {Math.round(pets.reduce((sum, p) => sum + p.happiness, 0) / pets.length)}%
            </div>
            <div className="text-sm text-white/60">Avg Happiness</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-amber-400">
              {pets.reduce((sum, p) => sum + p.abilities.length, 0)}
            </div>
            <div className="text-sm text-white/60">Total Abilities</div>
          </div>
        </div>
      </div>

      {/* Pet Companion Component */}
      <div className="max-w-7xl mx-auto">
        <PetCompanion
          pets={pets}
          activePetId={activePetId}
          gold={gold}
          onFeedPet={handleFeedPet}
          onPlayGame={handlePlayGame}
          onTrainStat={handleTrainStat}
          onEvolvePet={handleEvolvePet}
          onSetActivePet={handleSetActivePet}
          onRenamePet={handleRenamePet}
        />
      </div>

      {/* Pet Care Guide */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🎓 Pet Care Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍖</span>
                <h3 className="font-semibold text-white">Feeding</h3>
              </div>
              <p className="text-sm text-white/60">
                Keep your pet happy by feeding them regularly. Different foods provide different happiness boosts. Happiness affects combat effectiveness!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <h3 className="font-semibold text-white">Mini-Games</h3>
              </div>
              <p className="text-sm text-white/60">
                Play mini-games to increase bond level and boost specific stats. Each game targets a different attribute. Bond unlocks new abilities!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <h3 className="font-semibold text-white">Evolution</h3>
              </div>
              <p className="text-sm text-white/60">
                Pets evolve naturally at specific levels (15 and 35). Evolution dramatically increases all stats and unlocks new visual forms!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💪</span>
                <h3 className="font-semibold text-white">Training</h3>
              </div>
              <p className="text-sm text-white/60">
                Train individual stats to customize your pet's build. Focus on stats that complement your playstyle and the pet's natural strengths!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <h3 className="font-semibold text-white">Bond System</h3>
              </div>
              <p className="text-sm text-white/60">
                Higher bond levels unlock powerful abilities. Earn bond XP by playing games, feeding, and completing workouts with your active pet!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏡</span>
                <h3 className="font-semibold text-white">Sanctuary</h3>
              </div>
              <p className="text-sm text-white/60">
                Inactive pets rest in the sanctuary, generating passive gold and resources. They stay happy and well-fed automatically while resting!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Species Information */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">📚 Pet Species</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Starter Pets */}
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-lg p-4">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-bold text-white mb-1">Phoenix</h3>
              <p className="text-xs text-white/90 mb-2">Fire Element • Starter</p>
              <p className="text-sm text-white/80">
                High attack, fast XP gain. Specializes in fire damage and regeneration abilities. Perfect for aggressive playstyles!
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-4">
              <div className="text-4xl mb-2">🐉</div>
              <h3 className="font-bold text-white mb-1">Dragon</h3>
              <p className="text-xs text-white/90 mb-2">Lightning Element • Starter</p>
              <p className="text-sm text-white/80">
                Balanced stats, versatile abilities. Can adapt to any situation with lightning attacks and defensive skills!
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-4">
              <div className="text-4xl mb-2">🐺</div>
              <h3 className="font-bold text-white mb-1">Wolf</h3>
              <p className="text-xs text-white/90 mb-2">Ice Element • Starter</p>
              <p className="text-sm text-white/80">
                High defense and speed. Excels at crowd control with ice abilities and pack bonuses. Great for endurance builds!
              </p>
            </div>

            {/* Rare Pets */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg p-4">
              <div className="text-4xl mb-2">🦄</div>
              <h3 className="font-bold text-white mb-1">Unicorn</h3>
              <p className="text-xs text-white/90 mb-2">Light Element • Rare</p>
              <p className="text-sm text-white/80">
                Support specialist with healing and XP boost abilities. Unlocked through completing 50 achievements!
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg p-4">
              <div className="text-4xl mb-2">🦅</div>
              <h3 className="font-bold text-white mb-1">Griffin</h3>
              <p className="text-xs text-white/90 mb-2">Wind Element • Rare</p>
              <p className="text-sm text-white/80">
                Extremely fast with critical strike bonuses. Unlocked by reaching level 30 in any prestige rank!
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-4">
              <div className="text-4xl mb-2">🐲</div>
              <h3 className="font-bold text-white mb-1">Hydra</h3>
              <p className="text-xs text-white/90 mb-2">Poison Element • Rare</p>
              <p className="text-sm text-white/80">
                Multi-hit damage over time specialist. Unlocked by defeating 10 boss encounters!
              </p>
            </div>

            {/* Legendary Pet */}
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg p-4 md:col-span-2 lg:col-span-3">
              <div className="text-5xl mb-2">🌌</div>
              <h3 className="font-bold text-white text-xl mb-1">Cosmic Entity</h3>
              <p className="text-sm text-white/90 mb-2">Cosmic Element • Legendary</p>
              <p className="text-white/80">
                The ultimate companion. Possesses abilities from all elements and provides massive stat bonuses. 
                Unlocked only by reaching Prestige Rank 7 (Divine) or higher. This ethereal being transcends normal pet limitations!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">💡 Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Strategic Evolution</h3>
                <p className="text-sm text-white/60">
                  Don't rush evolution! Higher bond levels before evolving unlock better abilities in the next stage.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Ability Synergy</h3>
                <p className="text-sm text-white/60">
                  Combine combat and utility abilities for maximum effectiveness. Passive abilities are always active!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Food Economy</h3>
                <p className="text-sm text-white/60">
                  Buy food in bulk when you have excess gold. Higher-tier foods are more cost-effective per happiness point!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Active Companion Benefits</h3>
                <p className="text-sm text-white/60">
                  Your active pet gains XP from all workouts and challenges. Switch pets regularly to level them all!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Cosmetic Collection</h3>
                <p className="text-sm text-white/60">
                  Cosmetics are permanent rewards for evolution and high bond levels. Show off your dedication!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Rare Pet Unlocks</h3>
                <p className="text-sm text-white/60">
                  Complete specific achievements to unlock rare and legendary pets. Each has unique abilities!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
