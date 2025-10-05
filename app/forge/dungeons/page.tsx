'use client';

import { useState } from 'react';
import DungeonExplorer from '@/components/dungeon-explorer';
import { ParticleBackground } from '@/components/particle-background';
import { Card, StatCard, GradientText } from '@/components/ui';

export default function DungeonsPage() {
  const [playerLevel] = useState(32);
  const [playerHealth, setPlayerHealth] = useState(850);
  const [playerMaxHealth] = useState(1000);
  const [playerAttack] = useState(125);
  const [playerDefense] = useState(85);
  const [dungeonKeys, setDungeonKeys] = useState(3);
  const [totalDungeonsCleared, setTotalDungeonsCleared] = useState(17);
  const [bossesDefeated, setBossesDefeated] = useState(12);
  const [fastestClear, setFastestClear] = useState('23:45');
  const [totalLootFound, setTotalLootFound] = useState(243);

  const handleEnterDungeon = (dungeonId: string) => {
    console.log('Entering dungeon:', dungeonId);
    // Consume a key based on dungeon tier
    // This would be calculated based on the dungeon tier
    setDungeonKeys(prev => Math.max(0, prev - 1));
  };

  const handleExitDungeon = () => {
    console.log('Exiting dungeon');
    // Save progress, award rewards, etc.
  };

  const handleCombatAction = (enemyId: string) => {
    console.log('Attacking enemy:', enemyId);
    // Simulate combat
    const damage = Math.floor(Math.random() * 50) + 20;
    setPlayerHealth(prev => Math.max(0, prev - damage));
    
    alert(`⚔️ Combat!\n\nYou dealt ${playerAttack} damage!\nEnemy dealt ${damage} damage to you!\n\nYour HP: ${playerHealth - damage}/${playerMaxHealth}`);
  };

  const handleOpenChest = (roomId: string) => {
    console.log('Opening chest in room:', roomId);
    const lootRoll = Math.random();
    let loot: string;
    
    if (lootRoll < 0.05) {
      loot = '🌟 LEGENDARY ITEM!';
    } else if (lootRoll < 0.15) {
      loot = '💜 Epic Weapon!';
    } else if (lootRoll < 0.40) {
      loot = '💎 Rare Gem!';
    } else {
      loot = '💰 500 Gold!';
    }
    
    setTotalLootFound(prev => prev + 1);
    alert(`📦 Treasure Found!\n\n${loot}`);
  };

  const handleRest = () => {
    const healAmount = Math.floor(playerMaxHealth * 0.25);
    setPlayerHealth(prev => Math.min(playerMaxHealth, prev + healAmount));
    alert(`🛋️ Rest Complete!\n\nRecovered ${healAmount} HP!\nCurrent HP: ${Math.min(playerMaxHealth, playerHealth + healAmount)}/${playerMaxHealth}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white p-6">
      <ParticleBackground particleCount={80} colors={['#a855f7', '#ec4899', '#f59e0b', '#ef4444']} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
            🗝️ Dungeon Explorer
          </h1>
          <p className="text-white/60">
            Venture into procedurally generated dungeons, battle fierce enemies, and claim legendary rewards!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <StatCard icon="⚔️" value={playerAttack} label="Attack Power" color="red" />
          <StatCard icon="🛡️" value={playerDefense} label="Defense" color="blue" />
          <StatCard icon="✅" value={totalDungeonsCleared} label="Cleared" color="green" />
          <StatCard icon="👑" value={bossesDefeated} label="Bosses Slain" color="purple" />
          <StatCard icon="⚡" value={fastestClear} label="Best Time" color="amber" />
          <StatCard icon="💎" value={totalLootFound} label="Loot Found" color="pink" />
        </div>
      </div>

      {/* Dungeon Explorer Component */}
      <div className="max-w-7xl mx-auto">
        <DungeonExplorer
          playerLevel={playerLevel}
          playerHealth={playerHealth}
          playerMaxHealth={playerMaxHealth}
          playerAttack={playerAttack}
          playerDefense={playerDefense}
          dungeonKeys={dungeonKeys}
          onEnterDungeon={handleEnterDungeon}
          onExitDungeon={handleExitDungeon}
          onCombatAction={handleCombatAction}
          onOpenChest={handleOpenChest}
          onRest={handleRest}
        />
      </div>

      {/* Dungeon Guide */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🎓 Dungeon Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🗝️</span>
                <h3 className="font-semibold text-white">Dungeon Keys</h3>
              </div>
              <p className="text-sm text-white/60">
                Keys are required to enter dungeons. You regenerate 1 key every 6 hours (max 5). Higher tier dungeons cost more keys!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚔️</span>
                <h3 className="font-semibold text-white">Combat Encounters</h3>
              </div>
              <p className="text-sm text-white/60">
                Face groups of enemies in combat rooms. Elite enemies drop better loot but hit harder. Use strategy to survive!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <h3 className="font-semibold text-white">Boss Fights</h3>
              </div>
              <p className="text-sm text-white/60">
                Every dungeon ends with an epic boss fight! Bosses have unique abilities and phases. Defeat them for guaranteed epic+ loot!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <h3 className="font-semibold text-white">Treasure Rooms</h3>
              </div>
              <p className="text-sm text-white/60">
                Find chests filled with gold, equipment, and crafting materials. Higher tier dungeons have better treasure!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛋️</span>
                <h3 className="font-semibold text-white">Rest Rooms</h3>
              </div>
              <p className="text-sm text-white/60">
                Safe havens where you can recover 25% of your HP. Use them strategically before tough battles!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪤</span>
                <h3 className="font-semibold text-white">Trap Rooms</h3>
              </div>
              <p className="text-sm text-white/60">
                Dangerous traps await! Disarm them with skill or rush through and take damage. Choose wisely!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <h3 className="font-semibold text-white">Speed Runs</h3>
              </div>
              <p className="text-sm text-white/60">
                Complete dungeons under 30 minutes for +50% bonus loot! Race against time for maximum rewards!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <h3 className="font-semibold text-white">Flawless Victory</h3>
              </div>
              <p className="text-sm text-white/60">
                Complete without taking damage for legendary drop chance! Master combat mechanics for the ultimate challenge!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌀</span>
                <h3 className="font-semibold text-white">Procedural Generation</h3>
              </div>
              <p className="text-sm text-white/60">
                Every dungeon run is unique! Random room layouts, enemy encounters, and loot keep every run fresh and exciting!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dungeon Types */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🏰 Dungeon Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg p-4 border border-gray-500/30">
              <div className="text-4xl mb-2">⚰️</div>
              <h3 className="font-bold text-white mb-1">Crypt</h3>
              <p className="text-sm text-white/90 mb-2">Undead Theme</p>
              <p className="text-xs text-white/80">Ancient burial grounds filled with skeletons, zombies, ghosts, and necromancers. Find cursed gems and bone fragments!</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg p-4 border border-amber-500/30">
              <div className="text-4xl mb-2">🕳️</div>
              <h3 className="font-bold text-white mb-1">Cave</h3>
              <p className="text-sm text-white/90 mb-2">Beast Theme</p>
              <p className="text-xs text-white/80">Dark caverns with savage beasts, rock golems, and crystal spiders. Mine precious crystals and gemstones!</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-4 border border-purple-500/30">
              <div className="text-4xl mb-2">🗼</div>
              <h3 className="font-bold text-white mb-1">Tower</h3>
              <p className="text-sm text-white/90 mb-2">Arcane Theme</p>
              <p className="text-xs text-white/80">Mystical spires inhabited by rogue mages and arcane constructs. Collect spell scrolls and mana crystals!</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-4 border border-blue-500/30">
              <div className="text-4xl mb-2">🏛️</div>
              <h3 className="font-bold text-white mb-1">Ruins</h3>
              <p className="text-sm text-white/90 mb-2">Elemental Theme</p>
              <p className="text-xs text-white/80">Sacred temples guarded by elemental spirits and ancient titans. Harvest elemental essence and relics!</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-black rounded-lg p-4 border border-red-500/30">
              <div className="text-4xl mb-2">👁️</div>
              <h3 className="font-bold text-white mb-1">Abyss</h3>
              <p className="text-sm text-white/90 mb-2">Nightmare Theme</p>
              <p className="text-xs text-white/80">The ultimate challenge! Face void beasts, shadow horrors, and eldritch nightmares. Ultimate rewards await the brave!</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-700 rounded-lg p-4 border border-orange-500/30">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-bold text-white mb-1">Daily Dungeons</h3>
              <p className="text-sm text-white/90 mb-2">Special Modifiers</p>
              <p className="text-xs text-white/80">Unique daily dungeons with special rules and bonus loot. Compete on leaderboards for the fastest clear times!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Tiers */}
      <div className="max-w-7xl mx-auto mt-8">
        <Card variant="surface">
          <h2 className="text-2xl font-bold text-astral-accent mb-4">⚡ Difficulty Tiers</h2>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🌟</div>
                <div>
                  <div className="font-bold text-gray-400">Novice</div>
                  <div className="text-sm text-white/60">Level 1-10 • 5 Floors • 1 Key</div>
                </div>
              </div>
              <div className="text-sm text-white/60">Perfect for beginners learning the basics</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">⭐</div>
                <div>
                  <div className="font-bold text-green-400">Apprentice</div>
                  <div className="text-sm text-white/60">Level 11-20 • 7 Floors • 1 Key</div>
                </div>
              </div>
              <div className="text-sm text-white/60">Moderate challenge with decent rewards</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">💫</div>
                <div>
                  <div className="font-bold text-blue-400">Journeyman</div>
                  <div className="text-sm text-white/60">Level 21-30 • 8 Floors • 2 Keys</div>
                </div>
              </div>
              <div className="text-sm text-white/60">Tough battles with great loot</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">✨</div>
                <div>
                  <div className="font-bold text-purple-400">Expert</div>
                  <div className="text-sm text-white/60">Level 31-40 • 10 Floors • 2 Keys</div>
                </div>
              </div>
              <div className="text-sm text-white/60">Serious challenge for skilled players</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🌠</div>
                <div>
                  <div className="font-bold text-orange-400">Master</div>
                  <div className="text-sm text-white/60">Level 41-50 • 15 Floors • 3 Keys</div>
                </div>
              </div>
              <div className="text-sm text-white/60">Elite content with legendary rewards</div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">💀</div>
                <div>
                  <div className="font-bold text-red-400">Nightmare</div>
                  <div className="text-sm text-white/60">Level 51+ • 20 Floors • 5 Keys</div>
                </div>
              </div>
              <div className="text-sm text-white/60">Ultimate challenge - only for the strongest!</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pro Tips */}
      <div className="max-w-7xl mx-auto mt-8">
        <Card variant="accent">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">💡 Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <div className="font-semibold text-white mb-1">Know Your Enemy</div>
                <div className="text-sm text-white/70">Study enemy abilities and plan your attacks. Elite enemies telegraph their powerful moves!</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">💚</span>
              <div>
                <div className="font-semibold text-white mb-1">Save Rest Rooms</div>
                <div className="text-sm text-white/70">Don't use rest rooms immediately. Save them for right before boss fights for maximum efficiency!</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">⏱️</span>
              <div>
                <div className="font-semibold text-white mb-1">Speed vs Safety</div>
                <div className="text-sm text-white/70">Balance speed running for bonus loot with staying alive. Sometimes slow and steady wins the race!</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🎲</span>
              <div>
                <div className="font-semibold text-white mb-1">RNG is Your Friend</div>
                <div className="text-sm text-white/70">Procedural generation means every run is different. Learn to adapt to what the dungeon throws at you!</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
