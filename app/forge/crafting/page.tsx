'use client';

import { useState } from 'react';
import CraftingStation from '@/components/crafting-station';
import { ParticleBackground } from '@/components/particle-background';
import { Card, StatCard, GradientText } from '@/components/ui';

type MaterialTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
type MaterialCategory = 'ore' | 'gem' | 'essence' | 'leather' | 'wood' | 'crystal';
type EquipmentType = 'weapon' | 'armor' | 'accessory' | 'consumable';

interface Material {
  id: string;
  name: string;
  tier: MaterialTier;
  category: MaterialCategory;
  icon: string;
  quantity: number;
  description: string;
}

interface CraftingRequirement {
  materialId: string;
  quantity: number;
}

interface CraftedItem {
  id: string;
  name: string;
  type: EquipmentType;
  tier: number;
  icon: string;
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    speed?: number;
    luck?: number;
  };
  description: string;
}

interface Recipe {
  id: string;
  name: string;
  type: EquipmentType;
  tier: number;
  requirements: CraftingRequirement[];
  result: CraftedItem;
  unlocked: boolean;
  levelRequired: number;
  successRate: number;
  critChance: number;
}

export default function CraftingPage() {
  const [playerLevel] = useState(28);
  const [intelligence] = useState(42);
  const [materials, setMaterials] = useState<Material[]>([
    // Common Ores
    { id: 'iron-ore', name: 'Iron Ore', tier: 'common', category: 'ore', icon: '⛰️', quantity: 145, description: 'Basic ore for crafting weapons and armor' },
    { id: 'copper-ore', name: 'Copper Ore', tier: 'common', category: 'ore', icon: '🟫', quantity: 98, description: 'Malleable ore for basic equipment' },
    
    // Uncommon Ores
    { id: 'steel-ingot', name: 'Steel Ingot', tier: 'uncommon', category: 'ore', icon: '🔩', quantity: 52, description: 'Refined metal for improved gear' },
    { id: 'mithril-ore', name: 'Mithril Ore', tier: 'uncommon', category: 'ore', icon: '⚙️', quantity: 34, description: 'Lightweight yet strong ore' },
    
    // Rare Ores
    { id: 'adamantine', name: 'Adamantine', tier: 'rare', category: 'ore', icon: '💠', quantity: 18, description: 'Extremely durable ore for advanced crafting' },
    
    // Epic Ores
    { id: 'orichalcum', name: 'Orichalcum', tier: 'epic', category: 'ore', icon: '🔸', quantity: 7, description: 'Legendary metal from ancient mines' },
    
    // Common Gems
    { id: 'quartz', name: 'Quartz Crystal', tier: 'common', category: 'gem', icon: '💠', quantity: 76, description: 'Clear crystal for basic enchantments' },
    
    // Uncommon Gems
    { id: 'sapphire', name: 'Sapphire', tier: 'uncommon', category: 'gem', icon: '🔷', quantity: 28, description: 'Blue gem that enhances defense' },
    { id: 'ruby', name: 'Ruby', tier: 'uncommon', category: 'gem', icon: '🔴', quantity: 31, description: 'Red gem that boosts attack power' },
    
    // Rare Gems
    { id: 'emerald', name: 'Emerald', tier: 'rare', category: 'gem', icon: '🟢', quantity: 12, description: 'Green gem that increases health' },
    { id: 'diamond', name: 'Diamond', tier: 'rare', category: 'gem', icon: '💎', quantity: 9, description: 'Precious gem with multiple benefits' },
    
    // Epic Gems
    { id: 'black-diamond', name: 'Black Diamond', tier: 'epic', category: 'gem', icon: '⬛', quantity: 3, description: 'Rare dark gem with immense power' },
    
    // Common Essence
    { id: 'minor-essence', name: 'Minor Essence', tier: 'common', category: 'essence', icon: '✨', quantity: 203, description: 'Basic magical essence' },
    
    // Uncommon Essence
    { id: 'spirit-essence', name: 'Spirit Essence', tier: 'uncommon', category: 'essence', icon: '🌟', quantity: 47, description: 'Concentrated spiritual energy' },
    
    // Rare Essence
    { id: 'arcane-essence', name: 'Arcane Essence', tier: 'rare', category: 'essence', icon: '🔮', quantity: 15, description: 'Pure arcane magic condensed' },
    
    // Epic Essence
    { id: 'divine-essence', name: 'Divine Essence', tier: 'epic', category: 'essence', icon: '✨', quantity: 5, description: 'Sacred essence from celestial beings' },
    
    // Legendary
    { id: 'chaos-shard', name: 'Chaos Shard', tier: 'legendary', category: 'crystal', icon: '🌀', quantity: 2, description: 'Fragment of pure chaos energy' },
    { id: 'phoenix-feather', name: 'Phoenix Feather', tier: 'legendary', category: 'essence', icon: '🪶', quantity: 1, description: 'Feather from an immortal phoenix' },
    
    // Mythic
    { id: 'stardust', name: 'Cosmic Stardust', tier: 'mythic', category: 'crystal', icon: '⭐', quantity: 1, description: 'Dust from fallen stars, incredibly rare' },
    
    // Leather
    { id: 'leather', name: 'Leather Scraps', tier: 'common', category: 'leather', icon: '🦌', quantity: 89, description: 'Basic leather for light armor' },
    { id: 'dragonhide', name: 'Dragon Hide', tier: 'rare', category: 'leather', icon: '🐉', quantity: 6, description: 'Scales from a mighty dragon' },
    
    // Wood
    { id: 'oak-wood', name: 'Oak Wood', tier: 'common', category: 'wood', icon: '🪵', quantity: 112, description: 'Sturdy wood for shields and bows' },
    { id: 'ironwood', name: 'Ironwood', tier: 'uncommon', category: 'wood', icon: '🌲', quantity: 23, description: 'Dense wood as hard as metal' },
  ]);

  const [recipes] = useState<Recipe[]>([
    // Tier 1 Weapons (Common)
    {
      id: 'iron-sword',
      name: 'Iron Sword',
      type: 'weapon',
      tier: 1,
      requirements: [
        { materialId: 'iron-ore', quantity: 10 },
        { materialId: 'oak-wood', quantity: 5 },
      ],
      result: {
        id: 'iron-sword-item',
        name: 'Iron Sword',
        type: 'weapon',
        tier: 1,
        icon: '⚔️',
        stats: { attack: 15, speed: 5 },
        description: 'A basic iron sword for beginners',
      },
      unlocked: true,
      levelRequired: 1,
      successRate: 100,
      critChance: 10,
    },
    {
      id: 'wooden-bow',
      name: 'Wooden Bow',
      type: 'weapon',
      tier: 1,
      requirements: [
        { materialId: 'oak-wood', quantity: 15 },
        { materialId: 'leather', quantity: 5 },
      ],
      result: {
        id: 'wooden-bow-item',
        name: 'Wooden Bow',
        type: 'weapon',
        tier: 1,
        icon: '🏹',
        stats: { attack: 12, speed: 8 },
        description: 'A simple bow for ranged combat',
      },
      unlocked: true,
      levelRequired: 1,
      successRate: 100,
      critChance: 10,
    },
    
    // Tier 2 Weapons (Uncommon)
    {
      id: 'steel-axe',
      name: 'Steel Battle Axe',
      type: 'weapon',
      tier: 2,
      requirements: [
        { materialId: 'steel-ingot', quantity: 12 },
        { materialId: 'ironwood', quantity: 8 },
        { materialId: 'leather', quantity: 10 },
      ],
      result: {
        id: 'steel-axe-item',
        name: 'Steel Battle Axe',
        type: 'weapon',
        tier: 2,
        icon: '🪓',
        stats: { attack: 28, health: 10 },
        description: 'A heavy axe that deals devastating damage',
      },
      unlocked: true,
      levelRequired: 10,
      successRate: 95,
      critChance: 10,
    },
    {
      id: 'mithril-spear',
      name: 'Mithril Spear',
      type: 'weapon',
      tier: 2,
      requirements: [
        { materialId: 'mithril-ore', quantity: 15 },
        { materialId: 'ruby', quantity: 3 },
      ],
      result: {
        id: 'mithril-spear-item',
        name: 'Mithril Spear',
        type: 'weapon',
        tier: 2,
        icon: '🔱',
        stats: { attack: 25, speed: 12 },
        description: 'A lightweight spear with excellent reach',
      },
      unlocked: true,
      levelRequired: 12,
      successRate: 95,
      critChance: 10,
    },
    
    // Tier 3 Weapons (Rare)
    {
      id: 'adamantine-greatsword',
      name: 'Adamantine Greatsword',
      type: 'weapon',
      tier: 3,
      requirements: [
        { materialId: 'adamantine', quantity: 20 },
        { materialId: 'diamond', quantity: 5 },
        { materialId: 'arcane-essence', quantity: 10 },
      ],
      result: {
        id: 'adamantine-greatsword-item',
        name: 'Adamantine Greatsword',
        type: 'weapon',
        tier: 3,
        icon: '⚔️',
        stats: { attack: 45, health: 20, defense: 10 },
        description: 'A massive sword forged from adamantine',
      },
      unlocked: true,
      levelRequired: 20,
      successRate: 90,
      critChance: 10,
    },
    
    // Tier 4 Weapons (Epic)
    {
      id: 'orichalcum-katana',
      name: 'Orichalcum Katana',
      type: 'weapon',
      tier: 4,
      requirements: [
        { materialId: 'orichalcum', quantity: 15 },
        { materialId: 'black-diamond', quantity: 3 },
        { materialId: 'divine-essence', quantity: 8 },
        { materialId: 'dragonhide', quantity: 5 },
      ],
      result: {
        id: 'orichalcum-katana-item',
        name: 'Orichalcum Katana',
        type: 'weapon',
        tier: 4,
        icon: '🗡️',
        stats: { attack: 65, speed: 25, luck: 5 },
        description: 'A legendary blade with unmatched sharpness',
      },
      unlocked: true,
      levelRequired: 30,
      successRate: 85,
      critChance: 10,
    },
    
    // Armor
    {
      id: 'iron-chestplate',
      name: 'Iron Chestplate',
      type: 'armor',
      tier: 1,
      requirements: [
        { materialId: 'iron-ore', quantity: 20 },
        { materialId: 'leather', quantity: 8 },
      ],
      result: {
        id: 'iron-chestplate-item',
        name: 'Iron Chestplate',
        type: 'armor',
        tier: 1,
        icon: '🛡️',
        stats: { defense: 20, health: 15 },
        description: 'Basic iron armor for protection',
      },
      unlocked: true,
      levelRequired: 1,
      successRate: 100,
      critChance: 10,
    },
    {
      id: 'steel-armor-set',
      name: 'Steel Armor Set',
      type: 'armor',
      tier: 2,
      requirements: [
        { materialId: 'steel-ingot', quantity: 35 },
        { materialId: 'sapphire', quantity: 8 },
        { materialId: 'leather', quantity: 15 },
      ],
      result: {
        id: 'steel-armor-set-item',
        name: 'Steel Armor Set',
        type: 'armor',
        tier: 2,
        icon: '🛡️',
        stats: { defense: 40, health: 30 },
        description: 'Complete set of steel armor',
      },
      unlocked: true,
      levelRequired: 15,
      successRate: 95,
      critChance: 10,
    },
    {
      id: 'dragon-scale-armor',
      name: 'Dragon Scale Armor',
      type: 'armor',
      tier: 3,
      requirements: [
        { materialId: 'dragonhide', quantity: 12 },
        { materialId: 'adamantine', quantity: 10 },
        { materialId: 'emerald', quantity: 6 },
        { materialId: 'arcane-essence', quantity: 15 },
      ],
      result: {
        id: 'dragon-scale-armor-item',
        name: 'Dragon Scale Armor',
        type: 'armor',
        tier: 3,
        icon: '🐉',
        stats: { defense: 65, health: 50, attack: 10 },
        description: 'Legendary armor crafted from dragon scales',
      },
      unlocked: true,
      levelRequired: 25,
      successRate: 90,
      critChance: 10,
    },
    
    // Accessories
    {
      id: 'ruby-ring',
      name: 'Ruby Ring of Power',
      type: 'accessory',
      tier: 2,
      requirements: [
        { materialId: 'ruby', quantity: 5 },
        { materialId: 'copper-ore', quantity: 10 },
        { materialId: 'spirit-essence', quantity: 8 },
      ],
      result: {
        id: 'ruby-ring-item',
        name: 'Ruby Ring of Power',
        type: 'accessory',
        tier: 2,
        icon: '💍',
        stats: { attack: 15, luck: 3 },
        description: 'A ring that amplifies your strength',
      },
      unlocked: true,
      levelRequired: 12,
      successRate: 95,
      critChance: 10,
    },
    {
      id: 'diamond-amulet',
      name: 'Diamond Amulet',
      type: 'accessory',
      tier: 3,
      requirements: [
        { materialId: 'diamond', quantity: 8 },
        { materialId: 'mithril-ore', quantity: 12 },
        { materialId: 'arcane-essence', quantity: 10 },
      ],
      result: {
        id: 'diamond-amulet-item',
        name: 'Diamond Amulet',
        type: 'accessory',
        tier: 3,
        icon: '📿',
        stats: { health: 35, defense: 15, luck: 5 },
        description: 'An amulet of exceptional quality',
      },
      unlocked: true,
      levelRequired: 22,
      successRate: 90,
      critChance: 10,
    },
    
    // Consumables
    {
      id: 'healing-potion',
      name: 'Greater Healing Potion',
      type: 'consumable',
      tier: 2,
      requirements: [
        { materialId: 'emerald', quantity: 3 },
        { materialId: 'spirit-essence', quantity: 5 },
        { materialId: 'minor-essence', quantity: 10 },
      ],
      result: {
        id: 'healing-potion-item',
        name: 'Greater Healing Potion',
        type: 'consumable',
        tier: 2,
        icon: '🧪',
        stats: { health: 100 },
        description: 'Restores 100 HP instantly',
      },
      unlocked: true,
      levelRequired: 8,
      successRate: 100,
      critChance: 10,
    },
    {
      id: 'strength-elixir',
      name: 'Elixir of Strength',
      type: 'consumable',
      tier: 3,
      requirements: [
        { materialId: 'ruby', quantity: 4 },
        { materialId: 'divine-essence', quantity: 6 },
        { materialId: 'spirit-essence', quantity: 10 },
      ],
      result: {
        id: 'strength-elixir-item',
        name: 'Elixir of Strength',
        type: 'consumable',
        tier: 3,
        icon: '⚗️',
        stats: { attack: 25 },
        description: 'Grants +25 attack for 30 minutes',
      },
      unlocked: true,
      levelRequired: 18,
      successRate: 95,
      critChance: 10,
    },
    
    // Locked Legendary Recipe
    {
      id: 'phoenix-blade',
      name: 'Phoenix Blade',
      type: 'weapon',
      tier: 5,
      requirements: [
        { materialId: 'chaos-shard', quantity: 2 },
        { materialId: 'phoenix-feather', quantity: 1 },
        { materialId: 'orichalcum', quantity: 25 },
        { materialId: 'divine-essence', quantity: 20 },
      ],
      result: {
        id: 'phoenix-blade-item',
        name: 'Phoenix Blade',
        type: 'weapon',
        tier: 5,
        icon: '🔥',
        stats: { attack: 100, health: 50, speed: 30, luck: 10 },
        description: 'A legendary sword forged in phoenix fire, grants resurrection once per day',
      },
      unlocked: false,
      levelRequired: 45,
      successRate: 80,
      critChance: 10,
    },
  ]);

  const handleCraft = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // Simulate crafting
    const successRate = Math.min(recipe.successRate + Math.floor(intelligence / 10) * 2, 100);
    const critChance = Math.min(recipe.critChance + Math.floor(intelligence / 20), 25);
    
    const roll = Math.random() * 100;
    const critRoll = Math.random() * 100;
    
    if (roll <= successRate) {
      const isCrit = critRoll <= critChance;
      
      // Consume materials
      setMaterials(prev => {
        const updated = [...prev];
        recipe.requirements.forEach(req => {
          const mat = updated.find(m => m.id === req.materialId);
          if (mat) mat.quantity -= req.quantity;
        });
        return updated;
      });
      
      alert(`✅ Crafting Success!${isCrit ? ' 🌟 CRITICAL CRAFT! +20% Bonus Stats!' : ''}\n\nYou crafted: ${recipe.result.name}`);
    } else {
      // Failed craft - return 50% materials
      setMaterials(prev => {
        const updated = [...prev];
        recipe.requirements.forEach(req => {
          const mat = updated.find(m => m.id === req.materialId);
          if (mat) mat.quantity -= Math.floor(req.quantity / 2);
        });
        return updated;
      });
      
      alert(`❌ Crafting Failed!\n\n50% of materials returned.`);
    }
  };

  const handleSalvage = (itemId: string) => {
    alert('Salvage system coming soon!');
  };

  const handleUpgrade = (itemId: string) => {
    alert('Upgrade system coming soon!');
  };

  const totalMaterials = materials.reduce((sum, m) => sum + m.quantity, 0);
  const unlockedRecipes = recipes.filter(r => r.unlocked).length;
  const legendaryMaterials = materials.filter(m => m.tier === 'legendary' || m.tier === 'mythic').reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white p-6">
      <ParticleBackground particleCount={70} colors={['#a855f7', '#ec4899', '#f59e0b']} />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
            🔨 Crafting Station
          </h1>
          <p className="text-white/60">
            Gather materials and forge legendary equipment to enhance your power!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-purple-400">{totalMaterials}</div>
            <div className="text-sm text-white/60">Total Materials</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">📜</div>
            <div className="text-2xl font-bold text-pink-400">{unlockedRecipes}/{recipes.length}</div>
            <div className="text-sm text-white/60">Unlocked Recipes</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-amber-400">{legendaryMaterials}</div>
            <div className="text-sm text-white/60">Legendary Materials</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="text-3xl mb-2">🧠</div>
            <div className="text-2xl font-bold text-blue-400">{intelligence}</div>
            <div className="text-sm text-white/60">Intelligence (Crafting Bonus)</div>
          </div>
        </div>
      </div>

      {/* Crafting Station Component */}
      <div className="max-w-7xl mx-auto">
        <CraftingStation
          materials={materials}
          recipes={recipes}
          playerLevel={playerLevel}
          intelligence={intelligence}
          onCraft={handleCraft}
          onSalvage={handleSalvage}
          onUpgrade={handleUpgrade}
        />
      </div>

      {/* Crafting Guide */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🎓 Crafting Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⛏️</span>
                <h3 className="font-semibold text-white">Material Gathering</h3>
              </div>
              <p className="text-sm text-white/60">
                Collect materials from workouts, boss fights, and world exploration. Higher difficulty challenges yield rarer materials!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔨</span>
                <h3 className="font-semibold text-white">Crafting Success</h3>
              </div>
              <p className="text-sm text-white/60">
                Success rates range from 75-100% based on tier. Failed crafts return 50% of materials. Intelligence increases success rate!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <h3 className="font-semibold text-white">Critical Crafts</h3>
              </div>
              <p className="text-sm text-white/60">
                10% base chance for critical success, granting +20% bonus stats. Intelligence further increases critical chance!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📜</span>
                <h3 className="font-semibold text-white">Recipe Unlocks</h3>
              </div>
              <p className="text-sm text-white/60">
                Unlock recipes through leveling, achievements, boss victories, and special events. Legendary recipes require prestige!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⬆️</span>
                <h3 className="font-semibold text-white">Equipment Upgrades</h3>
              </div>
              <p className="text-sm text-white/60">
                Upgrade existing gear up to +5 tiers using materials. Each upgrade grants +10% stats and preserves enchantments!
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">♻️</span>
                <h3 className="font-semibold text-white">Salvaging</h3>
              </div>
              <p className="text-sm text-white/60">
                Break down unwanted equipment for materials. Higher tier items yield better materials. Great for recycling old gear!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Material Tiers */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">💎 Material Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4">
              <h3 className="font-bold text-white mb-1">Common</h3>
              <p className="text-sm text-white/90 mb-2">Tier 1 • 60% Drop Rate</p>
              <p className="text-xs text-white/80">Basic materials from early workouts. Used for beginner equipment and bulk crafting.</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4">
              <h3 className="font-bold text-white mb-1">Uncommon</h3>
              <p className="text-sm text-white/90 mb-2">Tier 2 • 25% Drop Rate</p>
              <p className="text-xs text-white/80">Improved materials from intermediate challenges. Required for solid mid-tier gear.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4">
              <h3 className="font-bold text-white mb-1">Rare</h3>
              <p className="text-sm text-white/90 mb-2">Tier 3 • 10% Drop Rate</p>
              <p className="text-xs text-white/80">Advanced materials from tough encounters. Needed for powerful equipment upgrades.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4">
              <h3 className="font-bold text-white mb-1">Epic</h3>
              <p className="text-sm text-white/90 mb-2">Tier 4 • 4% Drop Rate</p>
              <p className="text-xs text-white/80">Superior materials from boss fights. Creates exceptional gear with unique properties.</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg p-4">
              <h3 className="font-bold text-white mb-1">Legendary</h3>
              <p className="text-sm text-white/90 mb-2">Tier 5 • 0.9% Drop Rate</p>
              <p className="text-xs text-white/80">Masterwork materials from legendary bosses. Forge items of immense power!</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg p-4">
              <h3 className="font-bold text-white mb-1">Mythic</h3>
              <p className="text-sm text-white/90 mb-2">Tier 6 • 0.1% Drop Rate</p>
              <p className="text-xs text-white/80">Transcendent materials from ultimate challenges. Create legendary artifacts!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
