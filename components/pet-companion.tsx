'use client';

import { useState } from 'react';

// TypeScript Interfaces
type PetSpecies = 'phoenix' | 'dragon' | 'wolf' | 'unicorn' | 'griffin' | 'hydra' | 'cosmic';
type EvolutionStage = 'egg' | 'baby' | 'adult' | 'elder';
type AbilityType = 'combat' | 'utility' | 'passive';
type MoodState = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'depressed';

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
  timeSinceLastFed: number; // hours
  cosmetics: string[];
  color: string;
}

interface FoodItem {
  id: string;
  name: string;
  icon: string;
  happiness: number;
  health: number;
  cost: number;
}

interface MiniGame {
  id: string;
  name: string;
  icon: string;
  description: string;
  bondReward: number;
  statBoost: keyof PetStats;
}

interface PetCompanionProps {
  pets: Pet[];
  activePetId: string | null;
  gold: number;
  onFeedPet: (petId: string, foodId: string) => void;
  onPlayGame: (petId: string, gameId: string) => void;
  onTrainStat: (petId: string, stat: keyof PetStats) => void;
  onEvolvePet: (petId: string) => void;
  onSetActivePet: (petId: string) => void;
  onRenamePet: (petId: string, newName: string) => void;
}

export default function PetCompanion({
  pets,
  activePetId,
  gold,
  onFeedPet,
  onPlayGame,
  onTrainStat,
  onEvolvePet,
  onSetActivePet,
  onRenamePet,
}: PetCompanionProps) {
  const [selectedTab, setSelectedTab] = useState<'active' | 'collection' | 'sanctuary'>('active');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(activePetId);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);

  // Get selected pet
  const selectedPet = pets.find(p => p.id === selectedPetId) || pets.find(p => p.id === activePetId);

  // Pet species data
  const speciesData: Record<PetSpecies, { name: string; emoji: string; element: string; rarity: string; color: string }> = {
    phoenix: { name: 'Phoenix', emoji: '🔥', element: 'Fire', rarity: 'Starter', color: 'from-red-500 to-orange-500' },
    dragon: { name: 'Dragon', emoji: '🐉', element: 'Lightning', rarity: 'Starter', color: 'from-purple-500 to-blue-500' },
    wolf: { name: 'Wolf', emoji: '🐺', element: 'Ice', rarity: 'Starter', color: 'from-cyan-500 to-blue-500' },
    unicorn: { name: 'Unicorn', emoji: '🦄', element: 'Light', rarity: 'Rare', color: 'from-pink-500 to-purple-500' },
    griffin: { name: 'Griffin', emoji: '🦅', element: 'Wind', rarity: 'Rare', color: 'from-yellow-500 to-amber-500' },
    hydra: { name: 'Hydra', emoji: '🐲', element: 'Poison', rarity: 'Rare', color: 'from-green-500 to-emerald-500' },
    cosmic: { name: 'Cosmic Entity', emoji: '🌌', element: 'Cosmic', rarity: 'Legendary', color: 'from-purple-500 via-pink-500 to-blue-500' },
  };

  // Evolution stage data
  const stageData: Record<EvolutionStage, { name: string; emoji: string; sizeClass: string; levelReq: number }> = {
    egg: { name: 'Egg', emoji: '🥚', sizeClass: 'text-6xl', levelReq: 0 },
    baby: { name: 'Baby', emoji: '👶', sizeClass: 'text-8xl', levelReq: 1 },
    adult: { name: 'Adult', emoji: '💪', sizeClass: 'text-9xl', levelReq: 15 },
    elder: { name: 'Elder', emoji: '👑', sizeClass: 'text-9xl', levelReq: 35 },
  };

  // Food items
  const foodItems: FoodItem[] = [
    { id: 'berry', name: 'Magic Berry', icon: '🫐', happiness: 10, health: 5, cost: 50 },
    { id: 'meat', name: 'Prime Meat', icon: '🥩', happiness: 15, health: 10, cost: 100 },
    { id: 'nectar', name: 'Divine Nectar', icon: '🍯', happiness: 25, health: 20, cost: 200 },
    { id: 'elixir', name: 'Elixir of Joy', icon: '🧪', happiness: 40, health: 30, cost: 500 },
  ];

  // Mini-games
  const miniGames: MiniGame[] = [
    { id: 'fetch', name: 'Fetch', icon: '🎾', description: 'Play fetch to boost Speed', bondReward: 10, statBoost: 'speed' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩', description: 'Solve puzzles to boost Attack', bondReward: 12, statBoost: 'attack' },
    { id: 'strength', name: 'Strength Test', icon: '🏋️', description: 'Lift weights to boost Defense', bondReward: 8, statBoost: 'defense' },
    { id: 'rhythm', name: 'Rhythm Dance', icon: '💃', description: 'Dance together to boost Health', bondReward: 15, statBoost: 'health' },
  ];

  // Helper functions
  const getMoodState = (happiness: number): MoodState => {
    if (happiness >= 90) return 'ecstatic';
    if (happiness >= 70) return 'happy';
    if (happiness >= 40) return 'neutral';
    if (happiness >= 20) return 'sad';
    return 'depressed';
  };

  const getMoodEmoji = (mood: MoodState): string => {
    const moods = { ecstatic: '😍', happy: '😊', neutral: '😐', sad: '😢', depressed: '😭' };
    return moods[mood];
  };

  const getMoodColor = (mood: MoodState): string => {
    const colors = {
      ecstatic: 'text-pink-400',
      happy: 'text-green-400',
      neutral: 'text-yellow-400',
      sad: 'text-orange-400',
      depressed: 'text-red-400',
    };
    return colors[mood];
  };

  const canEvolve = (pet: Pet): boolean => {
    if (pet.stage === 'elder') return false;
    const stages: EvolutionStage[] = ['egg', 'baby', 'adult', 'elder'];
    const currentIndex = stages.indexOf(pet.stage);
    const nextStage = stages[currentIndex + 1];
    return pet.level >= stageData[nextStage].levelReq;
  };

  const getNextEvolutionStage = (currentStage: EvolutionStage): EvolutionStage | null => {
    const stages: EvolutionStage[] = ['egg', 'baby', 'adult', 'elder'];
    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  };

  const getAbilityColor = (type: AbilityType): string => {
    const colors = {
      combat: 'from-red-500 to-red-600',
      utility: 'from-blue-500 to-blue-600',
      passive: 'from-purple-500 to-purple-600',
    };
    return colors[type];
  };

  const handleFeedPet = (foodId: string) => {
    if (!selectedPet) return;
    const food = foodItems.find(f => f.id === foodId);
    if (!food || gold < food.cost) return;
    onFeedPet(selectedPet.id, foodId);
  };

  const handlePlayGame = (gameId: string) => {
    if (!selectedPet) return;
    onPlayGame(selectedPet.id, gameId);
  };

  const handleTrainStat = (stat: keyof PetStats) => {
    if (!selectedPet) return;
    onTrainStat(selectedPet.id, stat);
  };

  const handleEvolvePet = () => {
    if (!selectedPet || !canEvolve(selectedPet)) return;
    onEvolvePet(selectedPet.id);
    setShowEvolutionModal(false);
  };

  const handleRename = () => {
    if (!selectedPet || !newPetName.trim()) return;
    onRenamePet(selectedPet.id, newPetName.trim());
    setShowRenameModal(false);
    setNewPetName('');
  };

  const activePet = pets.find(p => p.id === activePetId);
  const inactivePets = pets.filter(p => p.id !== activePetId);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {(['active', 'collection', 'sanctuary'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 font-medium transition-all touch-manipulation min-h-[44px] ${
              selectedTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'active' && '🎮 Active Companion'}
            {tab === 'collection' && '📚 Pet Collection'}
            {tab === 'sanctuary' && '🏡 Sanctuary'}
          </button>
        ))}
      </div>

      {/* Active Companion Tab */}
      {selectedTab === 'active' && selectedPet && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pet Display */}
          <div className="lg:col-span-1 space-y-4">
            {/* Pet Card */}
            <div className={`bg-gradient-to-br ${speciesData[selectedPet.species].color} p-6 rounded-lg`}>
              <div className="text-center space-y-4">
                {/* Pet Visual */}
                <div className="relative">
                  <div className={`${stageData[selectedPet.stage].sizeClass} animate-bounce`}>
                    {speciesData[selectedPet.species].emoji}
                  </div>
                  {selectedPet.isActive && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Active
                    </div>
                  )}
                  {/* Mood indicator */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <span className={`text-3xl ${getMoodColor(getMoodState(selectedPet.happiness))}`}>
                      {getMoodEmoji(getMoodState(selectedPet.happiness))}
                    </span>
                  </div>
                </div>

                {/* Pet Info */}
                <div className="bg-black/20 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{selectedPet.name}</h3>
                    <button
                      onClick={() => {
                        setNewPetName(selectedPet.name);
                        setShowRenameModal(true);
                      }}
                      className="text-white/60 hover:text-white text-sm"
                    >
                      ✏️
                    </button>
                  </div>
                  <p className="text-white/80 text-sm">
                    {speciesData[selectedPet.species].name} • {stageData[selectedPet.stage].name}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <span className="bg-black/30 px-2 py-1 rounded text-xs text-white/90">
                      {speciesData[selectedPet.species].element}
                    </span>
                    <span className="bg-black/30 px-2 py-1 rounded text-xs text-white/90">
                      Lv {selectedPet.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-400">Stats</h4>
              {(Object.keys(selectedPet.stats) as Array<keyof PetStats>).map((stat) => (
                <div key={stat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 capitalize">{stat}</span>
                    <span className="text-white font-medium">{selectedPet.stats[stat]}</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((selectedPet.stats[stat] / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Evolution Progress */}
            {selectedPet.stage !== 'elder' && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-purple-400">Evolution Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">
                      {stageData[selectedPet.stage].name} → {getNextEvolutionStage(selectedPet.stage) && stageData[getNextEvolutionStage(selectedPet.stage)!].name}
                    </span>
                    <span className="text-white">
                      Lv {selectedPet.level}/{getNextEvolutionStage(selectedPet.stage) && stageData[getNextEvolutionStage(selectedPet.stage)!].levelReq}
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (selectedPet.level / (getNextEvolutionStage(selectedPet.stage) ? stageData[getNextEvolutionStage(selectedPet.stage)!].levelReq : 50)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  {canEvolve(selectedPet) && (
                    <button
                      onClick={() => setShowEvolutionModal(true)}
                      className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
                    >
                      ⚡ Evolve Now!
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Interactions */}
          <div className="lg:col-span-1 space-y-4">
            {/* XP & Bond Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4">
              {/* XP Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Experience</span>
                  <span className="text-purple-400">
                    {selectedPet.xp}/{selectedPet.xpToNext} XP
                  </span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                    style={{ width: `${(selectedPet.xp / selectedPet.xpToNext) * 100}%` }}
                  />
                </div>
              </div>

              {/* Bond Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Bond Level {selectedPet.bondLevel}</span>
                  <span className="text-pink-400">
                    {selectedPet.bondXp}/{selectedPet.bondXpToNext} Bond
                  </span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${(selectedPet.bondXp / selectedPet.bondXpToNext) * 100}%` }}
                  />
                </div>
              </div>

              {/* Happiness Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Happiness</span>
                  <span className={getMoodColor(getMoodState(selectedPet.happiness))}>
                    {selectedPet.happiness}% {getMoodEmoji(getMoodState(selectedPet.happiness))}
                  </span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${
                      selectedPet.happiness >= 70
                        ? 'from-green-500 to-emerald-500'
                        : selectedPet.happiness >= 40
                        ? 'from-yellow-500 to-orange-500'
                        : 'from-red-500 to-red-600'
                    } h-3 rounded-full transition-all`}
                    style={{ width: `${selectedPet.happiness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Feeding */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-400">🍖 Feed Your Pet</h4>
              <div className="grid grid-cols-2 gap-2">
                {foodItems.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleFeedPet(food.id)}
                    disabled={gold < food.cost}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-3xl mb-1">{food.icon}</div>
                    <div className="text-sm font-medium text-white">{food.name}</div>
                    <div className="text-xs text-white/60 space-y-1">
                      <div>+{food.happiness}% 😊 +{food.health} ❤️</div>
                      <div className="text-yellow-400">{food.cost} 💰</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mini-Games */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-400">🎮 Play Together</h4>
              <div className="space-y-2">
                {miniGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{game.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-white">{game.name}</div>
                        <div className="text-xs text-white/60">{game.description}</div>
                        <div className="text-xs text-pink-400 mt-1">+{game.bondReward} Bond Points</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Abilities & Training */}
          <div className="lg:col-span-1 space-y-4">
            {/* Abilities */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-400">⚡ Abilities</h4>
              <div className="space-y-2">
                {selectedPet.abilities.length === 0 ? (
                  <p className="text-sm text-white/60 text-center py-4">
                    Increase bond level to unlock abilities!
                  </p>
                ) : (
                  selectedPet.abilities.map((ability) => (
                    <div
                      key={ability.id}
                      className={`bg-gradient-to-r ${getAbilityColor(ability.type)} p-3 rounded-lg`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{ability.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-white">{ability.name}</div>
                            <span className="text-xs bg-black/30 px-2 py-1 rounded text-white/90">
                              {ability.type}
                            </span>
                          </div>
                          <p className="text-xs text-white/80 mt-1">{ability.description}</p>
                          <div className="flex gap-2 mt-2 text-xs">
                            <span className="bg-black/30 px-2 py-1 rounded text-white/90">
                              CD: {ability.cooldown}s
                            </span>
                            <span className="bg-black/30 px-2 py-1 rounded text-white/90">
                              Bond {ability.unlockBondLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Training */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-400">💪 Stat Training</h4>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(selectedPet.stats) as Array<keyof PetStats>).map((stat) => (
                  <button
                    key={stat}
                    onClick={() => handleTrainStat(stat)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-center transition-all"
                  >
                    <div className="text-2xl mb-1">
                      {stat === 'health' && '❤️'}
                      {stat === 'attack' && '⚔️'}
                      {stat === 'defense' && '🛡️'}
                      {stat === 'speed' && '⚡'}
                    </div>
                    <div className="text-sm font-medium text-white capitalize">{stat}</div>
                    <div className="text-xs text-purple-400 mt-1">+1 {stat}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/60 text-center">
                Training costs stamina and increases stats
              </p>
            </div>

            {/* Cosmetics */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-purple-400">✨ Cosmetics</h4>
              {selectedPet.cosmetics.length === 0 ? (
                <p className="text-sm text-white/60 text-center py-4">
                  No cosmetics unlocked yet!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedPet.cosmetics.map((cosmetic, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-xs text-purple-300"
                    >
                      {cosmetic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Set as Active */}
            {!selectedPet.isActive && (
              <button
                onClick={() => onSetActivePet(selectedPet.id)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
              >
                🎯 Set as Active Companion
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collection Tab */}
      {selectedTab === 'collection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => {
            const mood = getMoodState(pet.happiness);
            return (
              <div
                key={pet.id}
                onClick={() => {
                  setSelectedPetId(pet.id);
                  setSelectedTab('active');
                }}
                className={`bg-gradient-to-br ${speciesData[pet.species].color} p-4 rounded-lg cursor-pointer hover:scale-105 transition-all ${
                  pet.isActive ? 'ring-2 ring-green-400' : ''
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="relative">
                    <div className={stageData[pet.stage].sizeClass}>
                      {speciesData[pet.species].emoji}
                    </div>
                    {pet.isActive && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Active
                      </div>
                    )}
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 space-y-1">
                    <h3 className="font-bold text-white">{pet.name}</h3>
                    <p className="text-xs text-white/80">
                      {speciesData[pet.species].name} • {stageData[pet.stage].name}
                    </p>
                    <div className="flex gap-1 justify-center flex-wrap">
                      <span className="bg-black/30 px-2 py-0.5 rounded text-xs text-white/90">
                        Lv {pet.level}
                      </span>
                      <span className="bg-black/30 px-2 py-0.5 rounded text-xs text-white/90">
                        Bond {pet.bondLevel}
                      </span>
                      <span className={`bg-black/30 px-2 py-0.5 rounded text-xs ${getMoodColor(mood)}`}>
                        {getMoodEmoji(mood)} {pet.happiness}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sanctuary Tab */}
      {selectedTab === 'sanctuary' && (
        <div className="text-center space-y-6 py-12">
          <div className="text-6xl">🏡</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-purple-400">Pet Sanctuary</h3>
            <p className="text-white/60">
              Your inactive pets rest here, generating passive resources and staying happy!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {inactivePets.length === 0 ? (
              <div className="col-span-full text-white/60">
                No pets in sanctuary yet. All your pets are active!
              </div>
            ) : (
              inactivePets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3"
                >
                  <div className="text-4xl">{speciesData[pet.species].emoji}</div>
                  <div className="space-y-1">
                    <div className="font-medium text-white">{pet.name}</div>
                    <div className="text-xs text-white/60">
                      {speciesData[pet.species].name} • Lv {pet.level}
                    </div>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 rounded px-2 py-1 text-xs text-green-400">
                    😌 Resting peacefully
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedPet && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-purple-400">Rename Pet</h3>
            <input
              type="text"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              maxLength={20}
              placeholder="Enter new name..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleRename}
                disabled={!newPetName.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowRenameModal(false);
                  setNewPetName('');
                }}
                className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evolution Modal */}
      {showEvolutionModal && selectedPet && canEvolve(selectedPet) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-2xl font-bold text-center text-purple-400">⚡ Evolution Time!</h3>
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="text-center">
                <div className={stageData[selectedPet.stage].sizeClass}>
                  {speciesData[selectedPet.species].emoji}
                </div>
                <p className="text-sm text-white/60 mt-2">{stageData[selectedPet.stage].name}</p>
              </div>
              <div className="text-4xl">→</div>
              <div className="text-center">
                <div className={getNextEvolutionStage(selectedPet.stage) ? stageData[getNextEvolutionStage(selectedPet.stage)!].sizeClass : ''}>
                  {speciesData[selectedPet.species].emoji}
                </div>
                <p className="text-sm text-white/60 mt-2">
                  {getNextEvolutionStage(selectedPet.stage) && stageData[getNextEvolutionStage(selectedPet.stage)!].name}
                </p>
              </div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 space-y-2 text-sm">
              <p className="text-white/80">
                ✨ Your {selectedPet.name} is ready to evolve!
              </p>
              <p className="text-white/60">
                Evolution will increase all stats and may unlock new abilities.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEvolvePet}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
              >
                ⚡ Evolve!
              </button>
              <button
                onClick={() => setShowEvolutionModal(false)}
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-all"
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
