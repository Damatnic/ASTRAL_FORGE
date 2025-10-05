'use client';

import { useState } from 'react';

type DungeonType = 'crypt' | 'cave' | 'tower' | 'ruins' | 'abyss';
type DungeonTier = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'nightmare';
type RoomType = 'combat' | 'treasure' | 'trap' | 'rest' | 'boss' | 'empty';
type EnemyType = 'trash' | 'elite' | 'mini-boss' | 'boss';

interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  icon: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  level: number;
  abilities: string[];
}

interface Room {
  id: string;
  type: RoomType;
  cleared: boolean;
  visited: boolean;
  enemies: Enemy[];
  loot?: string[];
  description: string;
  icon: string;
}

interface DungeonFloor {
  floor: number;
  rooms: Room[];
  currentRoomIndex: number;
  bossDefeated: boolean;
}

interface Dungeon {
  id: string;
  name: string;
  type: DungeonType;
  tier: DungeonTier;
  icon: string;
  description: string;
  minLevel: number;
  maxFloors: number;
  theme: string;
  enemyTypes: string[];
  rewards: string[];
}

interface DungeonExplorerProps {
  playerLevel: number;
  playerHealth: number;
  playerMaxHealth: number;
  playerAttack: number;
  playerDefense: number;
  dungeonKeys: number;
  onEnterDungeon: (dungeonId: string) => void;
  onExitDungeon: () => void;
  onCombatAction: (enemyId: string) => void;
  onOpenChest: (roomId: string) => void;
  onRest: () => void;
}

export default function DungeonExplorer({
  playerLevel,
  playerHealth,
  playerMaxHealth,
  playerAttack,
  playerDefense,
  dungeonKeys,
  onEnterDungeon,
  onExitDungeon,
  onCombatAction,
  onOpenChest,
  onRest,
}: DungeonExplorerProps) {
  const [selectedTab, setSelectedTab] = useState<'browse' | 'active' | 'rewards'>('browse');
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [activeDungeon, setActiveDungeon] = useState<DungeonFloor | null>(null);
  const [filterTier, setFilterTier] = useState<DungeonTier | 'all'>('all');

  // Dungeon type data
  const dungeonTypeData: Record<DungeonType, { name: string; color: string; gradient: string }> = {
    crypt: { name: 'Crypt', color: 'text-gray-400', gradient: 'from-gray-600 to-gray-800' },
    cave: { name: 'Cave', color: 'text-amber-400', gradient: 'from-amber-600 to-amber-800' },
    tower: { name: 'Tower', color: 'text-purple-400', gradient: 'from-purple-600 to-purple-800' },
    ruins: { name: 'Ruins', color: 'text-blue-400', gradient: 'from-blue-600 to-blue-800' },
    abyss: { name: 'Abyss', color: 'text-red-400', gradient: 'from-red-600 to-black' },
  };

  // Tier data
  const tierData: Record<DungeonTier, { name: string; color: string; levelRange: string; keyCost: number }> = {
    novice: { name: 'Novice', color: 'text-gray-400', levelRange: '1-10', keyCost: 1 },
    apprentice: { name: 'Apprentice', color: 'text-green-400', levelRange: '11-20', keyCost: 1 },
    journeyman: { name: 'Journeyman', color: 'text-blue-400', levelRange: '21-30', keyCost: 2 },
    expert: { name: 'Expert', color: 'text-purple-400', levelRange: '31-40', keyCost: 2 },
    master: { name: 'Master', color: 'text-orange-400', levelRange: '41-50', keyCost: 3 },
    nightmare: { name: 'Nightmare', color: 'text-red-400', levelRange: '51+', keyCost: 5 },
  };

  // Available dungeons
  const dungeons: Dungeon[] = [
    {
      id: 'forgotten-crypt-1',
      name: 'Forgotten Crypt',
      type: 'crypt',
      tier: 'novice',
      icon: '⚰️',
      description: 'An ancient burial ground crawling with undead horrors.',
      minLevel: 1,
      maxFloors: 5,
      theme: 'Undead',
      enemyTypes: ['Skeleton Warrior', 'Zombie', 'Ghost', 'Crypt Lord'],
      rewards: ['Bone Fragments', 'Cursed Gems', 'Ancient Armor'],
    },
    {
      id: 'dark-cave-1',
      name: 'Dark Crystal Caves',
      type: 'cave',
      tier: 'novice',
      icon: '🕳️',
      description: 'Twisted caverns filled with savage beasts and glowing crystals.',
      minLevel: 1,
      maxFloors: 5,
      theme: 'Beasts',
      enemyTypes: ['Cave Bat', 'Rock Golem', 'Crystal Spider', 'Cave Troll'],
      rewards: ['Crystal Shards', 'Beast Hide', 'Gemstones'],
    },
    {
      id: 'wizard-tower-1',
      name: 'Arcane Spire',
      type: 'tower',
      tier: 'apprentice',
      icon: '🗼',
      description: 'A mystical tower where rogue mages practice forbidden magic.',
      minLevel: 11,
      maxFloors: 7,
      theme: 'Arcane',
      enemyTypes: ['Apprentice Mage', 'Arcane Construct', 'Fire Elemental', 'Arch Mage'],
      rewards: ['Spell Scrolls', 'Mana Crystals', 'Enchanted Robes'],
    },
    {
      id: 'ancient-ruins-1',
      name: 'Temple of the Fallen',
      type: 'ruins',
      tier: 'apprentice',
      icon: '🏛️',
      description: 'Sacred ruins guarded by elemental spirits and ancient sentinels.',
      minLevel: 11,
      maxFloors: 7,
      theme: 'Elementals',
      enemyTypes: ['Stone Guardian', 'Water Spirit', 'Wind Wraith', 'Ancient Titan'],
      rewards: ['Elemental Essence', 'Relic Fragments', 'Sacred Weapons'],
    },
    {
      id: 'deep-cave-2',
      name: 'Deepstone Mines',
      type: 'cave',
      tier: 'journeyman',
      icon: '⛏️',
      description: 'Abandoned mines now home to dangerous creatures and precious ores.',
      minLevel: 21,
      maxFloors: 8,
      theme: 'Mining',
      enemyTypes: ['Mine Lurker', 'Ore Elemental', 'Giant Worm', 'Forge Demon'],
      rewards: ['Rare Ores', 'Precious Gems', 'Masterwork Materials'],
    },
    {
      id: 'shadow-crypt-2',
      name: 'Necropolis of Shadows',
      type: 'crypt',
      tier: 'journeyman',
      icon: '💀',
      description: 'A massive city of the dead ruled by powerful necromancers.',
      minLevel: 21,
      maxFloors: 8,
      theme: 'Necromancy',
      enemyTypes: ['Death Knight', 'Lich', 'Wraith Lord', 'Necromancer King'],
      rewards: ['Soul Gems', 'Undead Essence', 'Legendary Armor'],
    },
    {
      id: 'chaos-tower-2',
      name: 'Tower of Chaos',
      type: 'tower',
      tier: 'expert',
      icon: '🌀',
      description: 'Reality warps and twists in this dimension-breaking tower.',
      minLevel: 31,
      maxFloors: 10,
      theme: 'Chaos',
      enemyTypes: ['Chaos Spawn', 'Void Walker', 'Reality Bender', 'Chaos Lord'],
      rewards: ['Chaos Shards', 'Void Crystals', 'Mythic Weapons'],
    },
    {
      id: 'demon-ruins-2',
      name: 'Infernal Sanctum',
      type: 'ruins',
      tier: 'expert',
      icon: '🔥',
      description: 'An unholy temple where demons gather to summon their dark gods.',
      minLevel: 31,
      maxFloors: 10,
      theme: 'Demons',
      enemyTypes: ['Imp Swarm', 'Hell Hound', 'Demon Knight', 'Demon Prince'],
      rewards: ['Demonic Essence', 'Hellfire Gems', 'Infernal Artifacts'],
    },
    {
      id: 'void-abyss-1',
      name: 'Endless Abyss',
      type: 'abyss',
      tier: 'master',
      icon: '🕳️',
      description: 'An infinite void where reality breaks down and nightmares dwell.',
      minLevel: 41,
      maxFloors: 15,
      theme: 'Void',
      enemyTypes: ['Void Beast', 'Shadow Horror', 'Abyss Stalker', 'Void Dragon'],
      rewards: ['Void Essence', 'Reality Fragments', 'Transcendent Gear'],
    },
    {
      id: 'nightmare-abyss-2',
      name: 'Nightmare Realm',
      type: 'abyss',
      tier: 'nightmare',
      icon: '👁️',
      description: 'The ultimate challenge. Only the strongest dare to enter.',
      minLevel: 51,
      maxFloors: 20,
      theme: 'Nightmare',
      enemyTypes: ['Terror Spawn', 'Nightmare Lord', 'Eldritch Horror', 'Ancient Evil'],
      rewards: ['Nightmare Essence', 'Cosmic Artifacts', 'Ultimate Power'],
    },
  ];

  // Helper functions
  const getDungeonTypeColor = (type: DungeonType) => dungeonTypeData[type].color;
  const getDungeonTypeGradient = (type: DungeonType) => dungeonTypeData[type].gradient;
  const getTierColor = (tier: DungeonTier) => tierData[tier].color;
  const getTierName = (tier: DungeonTier) => tierData[tier].name;
  const canEnterDungeon = (dungeon: Dungeon) => 
    playerLevel >= dungeon.minLevel && dungeonKeys >= tierData[dungeon.tier].keyCost;

  // Filter dungeons
  const filteredDungeons = dungeons.filter(d => filterTier === 'all' || d.tier === filterTier);

  // Generate procedural floor (simplified version)
  const generateFloor = (floorNumber: number, dungeonType: DungeonType, tier: DungeonTier): DungeonFloor => {
    const roomCount = 5 + Math.floor(Math.random() * 5); // 5-10 rooms
    const rooms: Room[] = [];

    for (let i = 0; i < roomCount; i++) {
      const rand = Math.random();
      let type: RoomType;
      
      if (i === roomCount - 1) {
        type = 'boss';
      } else if (rand < 0.6) {
        type = 'combat';
      } else if (rand < 0.85) {
        type = 'treasure';
      } else if (rand < 0.95) {
        type = 'trap';
      } else {
        type = 'rest';
      }

      rooms.push({
        id: `room-${floorNumber}-${i}`,
        type,
        cleared: false,
        visited: i === 0,
        enemies: type === 'combat' || type === 'boss' ? generateEnemies(type, dungeonType, floorNumber) : [],
        loot: type === 'treasure' ? ['Gold', 'Potion', 'Equipment'] : undefined,
        description: getRoomDescription(type),
        icon: getRoomIcon(type),
      });
    }

    return {
      floor: floorNumber,
      rooms,
      currentRoomIndex: 0,
      bossDefeated: false,
    };
  };

  const generateEnemies = (roomType: RoomType, dungeonType: DungeonType, floor: number): Enemy[] => {
    if (roomType === 'boss') {
      return [{
        id: 'boss-1',
        name: `${dungeonTypeData[dungeonType].name} Lord`,
        type: 'boss',
        icon: '👹',
        health: 500 + floor * 100,
        maxHealth: 500 + floor * 100,
        attack: 50 + floor * 10,
        defense: 30 + floor * 5,
        level: 10 + floor * 5,
        abilities: ['Enrage', 'Phase Shift', 'Ultimate Attack'],
      }];
    }

    const enemyCount = 1 + Math.floor(Math.random() * 3);
    const enemies: Enemy[] = [];

    for (let i = 0; i < enemyCount; i++) {
      const isElite = Math.random() < 0.2;
      enemies.push({
        id: `enemy-${i}`,
        name: isElite ? 'Elite Warrior' : 'Minion',
        type: isElite ? 'elite' : 'trash',
        icon: isElite ? '⚔️' : '🗡️',
        health: isElite ? 150 + floor * 30 : 100 + floor * 20,
        maxHealth: isElite ? 150 + floor * 30 : 100 + floor * 20,
        attack: isElite ? 30 + floor * 6 : 20 + floor * 4,
        defense: isElite ? 20 + floor * 4 : 15 + floor * 3,
        level: 5 + floor * 3,
        abilities: isElite ? ['Power Strike'] : [],
      });
    }

    return enemies;
  };

  const getRoomIcon = (type: RoomType): string => {
    const icons: Record<RoomType, string> = {
      combat: '⚔️',
      treasure: '💎',
      trap: '🪤',
      rest: '🛋️',
      boss: '👑',
      empty: '🚪',
    };
    return icons[type];
  };

  const getRoomDescription = (type: RoomType): string => {
    const descriptions: Record<RoomType, string> = {
      combat: 'Enemies lurk in the shadows, ready to ambush you!',
      treasure: 'A glittering chest awaits, filled with valuable loot.',
      trap: 'Dangerous traps line the walls. Proceed with caution!',
      rest: 'A safe haven where you can recover your strength.',
      boss: 'The final chamber. A powerful boss awaits beyond this door!',
      empty: 'An empty corridor. Nothing of interest here.',
    };
    return descriptions[type];
  };

  const currentRoom = activeDungeon ? activeDungeon.rooms[activeDungeon.currentRoomIndex] : null;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setSelectedTab('browse')}
          className={`px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'browse'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          🗺️ Browse Dungeons
        </button>
        <button
          onClick={() => setSelectedTab('active')}
          className={`px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'active'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          ⚔️ Active Run
        </button>
        <button
          onClick={() => setSelectedTab('rewards')}
          className={`px-6 py-3 font-semibold transition-colors ${
            selectedTab === 'rewards'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-white/60 hover:text-white/80'
          }`}
        >
          🏆 Rewards
        </button>
      </div>

      {/* Browse Dungeons Tab */}
      {selectedTab === 'browse' && (
        <div className="space-y-6">
          {/* Dungeon Keys Display */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🗝️</div>
                <div>
                  <div className="text-xl font-bold text-amber-400">{dungeonKeys} Keys</div>
                  <div className="text-sm text-white/60">1 key regenerates every 6 hours (max 5)</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold hover:scale-105 transition-transform">
                Buy Keys (100g each)
              </button>
            </div>
          </div>

          {/* Tier Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterTier('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterTier === 'all'
                  ? 'bg-purple-500/30 text-purple-400 border border-purple-400'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              All Tiers
            </button>
            {(Object.keys(tierData) as DungeonTier[]).map(tier => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterTier === tier
                    ? 'bg-purple-500/30 border border-purple-400'
                    : 'bg-white/5 hover:bg-white/10'
                } ${getTierColor(tier)}`}
              >
                {getTierName(tier)} ({tierData[tier].levelRange})
              </button>
            ))}
          </div>

          {/* Dungeon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDungeons.map(dungeon => {
              const canEnter = canEnterDungeon(dungeon);
              const keyCost = tierData[dungeon.tier].keyCost;

              return (
                <div
                  key={dungeon.id}
                  className={`bg-white/5 backdrop-blur-sm border rounded-lg p-4 transition-all ${
                    canEnter
                      ? 'border-white/20 hover:border-purple-400/50 hover:bg-white/10 cursor-pointer'
                      : 'border-white/10 opacity-60'
                  }`}
                  onClick={() => canEnter && setSelectedDungeon(dungeon)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{dungeon.icon}</div>
                      <div>
                        <h3 className={`font-bold text-lg ${getDungeonTypeColor(dungeon.type)}`}>
                          {dungeon.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={getTierColor(dungeon.tier)}>{getTierName(dungeon.tier)}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60">Level {dungeon.minLevel}+</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      canEnter ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {keyCost} 🗝️
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/70 mb-3">{dungeon.description}</p>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-white/5 rounded px-2 py-1">
                      <span className="text-white/60">Floors:</span>{' '}
                      <span className="text-white font-semibold">{dungeon.maxFloors}</span>
                    </div>
                    <div className="bg-white/5 rounded px-2 py-1">
                      <span className="text-white/60">Theme:</span>{' '}
                      <span className="text-white font-semibold">{dungeon.theme}</span>
                    </div>
                  </div>

                  {/* Enemies */}
                  <div className="mb-3">
                    <div className="text-xs text-white/60 mb-1">Enemies:</div>
                    <div className="flex flex-wrap gap-1">
                      {dungeon.enemyTypes.map(enemy => (
                        <span key={enemy} className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                          {enemy}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div>
                    <div className="text-xs text-white/60 mb-1">Rewards:</div>
                    <div className="flex flex-wrap gap-1">
                      {dungeon.rewards.map(reward => (
                        <span key={reward} className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enter Button */}
                  {canEnter ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newFloor = generateFloor(1, dungeon.type, dungeon.tier);
                        setActiveDungeon(newFloor);
                        setSelectedTab('active');
                        onEnterDungeon(dungeon.id);
                      }}
                      className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                      Enter Dungeon
                    </button>
                  ) : (
                    <div className="w-full mt-3 px-4 py-2 bg-white/5 rounded-lg text-center text-sm text-white/40">
                      {playerLevel < dungeon.minLevel
                        ? `Level ${dungeon.minLevel} Required`
                        : `Need ${keyCost} Keys`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Run Tab */}
      {selectedTab === 'active' && (
        <div className="space-y-6">
          {activeDungeon && currentRoom ? (
            <>
              {/* Player Status */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">Floor {activeDungeon.floor}</h3>
                    <p className="text-sm text-white/60">
                      Room {activeDungeon.currentRoomIndex + 1} of {activeDungeon.rooms.length}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveDungeon(null);
                      onExitDungeon();
                    }}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
                  >
                    Exit Dungeon
                  </button>
                </div>

                {/* HP Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Health</span>
                    <span className="text-white font-semibold">
                      {playerHealth} / {playerMaxHealth}
                    </span>
                  </div>
                  <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${(playerHealth / playerMaxHealth) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Current Room */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{currentRoom.icon}</div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">
                    {currentRoom.type.charAt(0).toUpperCase() + currentRoom.type.slice(1)} Room
                  </h3>
                  <p className="text-white/70">{currentRoom.description}</p>
                </div>

                {/* Room Content */}
                {currentRoom.type === 'combat' && currentRoom.enemies.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-red-400 text-center">⚔️ Combat Encounter!</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentRoom.enemies.map(enemy => (
                        <div
                          key={enemy.id}
                          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                        >
                          <div className="text-center mb-3">
                            <div className="text-4xl mb-2">{enemy.icon}</div>
                            <div className="font-bold text-red-400">{enemy.name}</div>
                            <div className="text-xs text-white/60">Level {enemy.level}</div>
                          </div>
                          
                          {/* Enemy HP */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>HP</span>
                              <span>{enemy.health}/{enemy.maxHealth}</span>
                            </div>
                            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div className="bg-white/5 rounded px-2 py-1">
                              <span className="text-white/60">ATK:</span> {enemy.attack}
                            </div>
                            <div className="bg-white/5 rounded px-2 py-1">
                              <span className="text-white/60">DEF:</span> {enemy.defense}
                            </div>
                          </div>

                          {/* Abilities */}
                          {enemy.abilities.length > 0 && (
                            <div className="mb-3">
                              <div className="text-xs text-white/60 mb-1">Abilities:</div>
                              <div className="flex flex-wrap gap-1">
                                {enemy.abilities.map(ability => (
                                  <span key={ability} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                    {ability}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => onCombatAction(enemy.id)}
                            className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                          >
                            Attack
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentRoom.type === 'boss' && currentRoom.enemies.length > 0 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-3xl font-bold text-red-400 mb-2">💀 BOSS FIGHT!</h4>
                      <p className="text-white/70">Defeat the dungeon boss to claim ultimate rewards!</p>
                    </div>
                    
                    {currentRoom.enemies.map(boss => (
                      <div key={boss.id} className="bg-gradient-to-br from-red-500/20 to-purple-500/20 border-2 border-red-500/50 rounded-lg p-6">
                        <div className="text-center mb-4">
                          <div className="text-6xl mb-3">{boss.icon}</div>
                          <div className="text-2xl font-bold text-red-400">{boss.name}</div>
                          <div className="text-white/60">Level {boss.level} Boss</div>
                        </div>

                        {/* Boss HP */}
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-red-400">Boss HP</span>
                            <span className="text-white font-semibold">{boss.health}/{boss.maxHealth}</span>
                          </div>
                          <div className="h-6 bg-black/30 rounded-full overflow-hidden border-2 border-red-500/30">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"
                              style={{ width: `${(boss.health / boss.maxHealth) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Boss Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-red-500/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-red-400">{boss.attack}</div>
                            <div className="text-xs text-white/60">Attack</div>
                          </div>
                          <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-400">{boss.defense}</div>
                            <div className="text-xs text-white/60">Defense</div>
                          </div>
                        </div>

                        {/* Boss Abilities */}
                        <div className="mb-4">
                          <div className="text-sm font-bold text-purple-400 mb-2">⚡ Boss Abilities:</div>
                          <div className="flex flex-wrap gap-2">
                            {boss.abilities.map(ability => (
                              <span key={ability} className="bg-purple-500/30 border border-purple-400/50 text-purple-300 px-3 py-1 rounded-lg text-sm font-semibold">
                                {ability}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => onCombatAction(boss.id)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-lg text-lg font-bold hover:scale-105 transition-transform shadow-lg"
                        >
                          ⚔️ FIGHT BOSS
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {currentRoom.type === 'treasure' && (
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-white/70 mb-4">A treasure chest awaits!</p>
                    <button
                      onClick={() => onOpenChest(currentRoom.id)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                      Open Chest
                    </button>
                  </div>
                )}

                {currentRoom.type === 'rest' && (
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🛋️</div>
                    <p className="text-white/70 mb-4">A safe place to rest and recover.</p>
                    <button
                      onClick={onRest}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold hover:scale-105 transition-transform"
                    >
                      Rest (Recover 25% HP)
                    </button>
                  </div>
                )}

                {currentRoom.type === 'trap' && (
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">🪤</div>
                    <p className="text-white/70 mb-4">Dangerous traps detected! Proceed carefully...</p>
                    <div className="flex gap-3 justify-center">
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold hover:scale-105 transition-transform">
                        Disarm (DEX Check)
                      </button>
                      <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold hover:scale-105 transition-transform">
                        Rush Through (Take Damage)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Room Map */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h4 className="font-bold text-purple-400 mb-3">🗺️ Floor Map</h4>
                <div className="flex gap-2 flex-wrap">
                  {activeDungeon.rooms.map((room, index) => (
                    <div
                      key={room.id}
                      className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl transition-all ${
                        index === activeDungeon.currentRoomIndex
                          ? 'bg-purple-500/30 border-2 border-purple-400 scale-110'
                          : room.cleared
                          ? 'bg-green-500/20 border border-green-500/30'
                          : room.visited
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-black/30 border border-white/10 opacity-50'
                      }`}
                    >
                      {room.icon}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-white/80 mb-2">No Active Dungeon</h3>
              <p className="text-white/60 mb-6">Select a dungeon from the Browse tab to begin your adventure!</p>
              <button
                onClick={() => setSelectedTab('browse')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Browse Dungeons
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rewards Tab */}
      {selectedTab === 'rewards' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🏆 Dungeon Rewards</h3>
            
            {/* Reward Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-4">
                <div className="text-3xl mb-2">💰</div>
                <h4 className="font-bold text-amber-400 mb-1">Floor Clear Bonus</h4>
                <p className="text-sm text-white/70">Earn gold and XP for each floor completed</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold text-purple-400 mb-1">Speed Run Rewards</h4>
                <p className="text-sm text-white/70">Complete under 30 min for +50% loot!</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-3xl mb-2">🛡️</div>
                <h4 className="font-bold text-green-400 mb-1">Flawless Victory</h4>
                <p className="text-sm text-white/70">Take no damage for legendary drop chance!</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg p-4">
                <div className="text-3xl mb-2">👑</div>
                <h4 className="font-bold text-red-400 mb-1">Boss Loot</h4>
                <p className="text-sm text-white/70">Guaranteed Epic+ item from boss kills</p>
              </div>
            </div>

            {/* Achievement Rewards */}
            <div>
              <h4 className="font-bold text-purple-400 mb-3">🏅 Dungeon Achievements</h4>
              <div className="space-y-2">
                {[
                  { name: 'First Blood', desc: 'Complete your first dungeon', reward: '100 Gold' },
                  { name: 'Speed Demon', desc: 'Complete a dungeon in under 20 minutes', reward: 'Title: "The Swift"' },
                  { name: 'Flawless Champion', desc: 'Complete without taking damage', reward: 'Legendary Chest' },
                  { name: 'Boss Slayer', desc: 'Defeat 10 dungeon bosses', reward: 'Epic Pet Unlock' },
                  { name: 'Treasure Hunter', desc: 'Find all secret rooms', reward: 'Rare Mount' },
                  { name: 'Nightmare Conqueror', desc: 'Complete Nightmare tier', reward: 'Mythic Weapon' },
                ].map(achievement => (
                  <div key={achievement.name} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{achievement.name}</div>
                      <div className="text-sm text-white/60">{achievement.desc}</div>
                    </div>
                    <div className="text-sm font-semibold text-amber-400">{achievement.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
