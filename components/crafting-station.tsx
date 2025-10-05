'use client';

import { useState } from 'react';

// TypeScript Interfaces
type MaterialTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
type MaterialCategory = 'ore' | 'gem' | 'essence' | 'leather' | 'wood' | 'crystal';
type EquipmentType = 'weapon' | 'armor' | 'accessory' | 'consumable';
type RecipeFilter = 'all' | 'weapon' | 'armor' | 'accessory' | 'consumable';

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

interface CraftingStationProps {
  materials: Material[];
  recipes: Recipe[];
  playerLevel: number;
  intelligence: number;
  onCraft: (recipeId: string) => void;
  onSalvage: (itemId: string) => void;
  onUpgrade: (itemId: string) => void;
}

export default function CraftingStation({
  materials,
  recipes,
  playerLevel,
  intelligence,
  onCraft,
  onSalvage,
  onUpgrade,
}: CraftingStationProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterType, setFilterType] = useState<RecipeFilter>('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'craft' | 'materials' | 'upgrade'>('craft');
  const [searchQuery, setSearchQuery] = useState('');

  // Material tier data
  const tierData: Record<MaterialTier, { color: string; gradient: string; label: string; dropRate: string }> = {
    common: { color: 'text-gray-400', gradient: 'from-gray-500 to-gray-600', label: 'Common', dropRate: '60%' },
    uncommon: { color: 'text-green-400', gradient: 'from-green-500 to-green-600', label: 'Uncommon', dropRate: '25%' },
    rare: { color: 'text-blue-400', gradient: 'from-blue-500 to-blue-600', label: 'Rare', dropRate: '10%' },
    epic: { color: 'text-purple-400', gradient: 'from-purple-500 to-purple-600', label: 'Epic', dropRate: '4%' },
    legendary: { color: 'text-orange-400', gradient: 'from-orange-500 to-amber-600', label: 'Legendary', dropRate: '0.9%' },
    mythic: { color: 'text-pink-400', gradient: 'from-pink-500 via-purple-500 to-blue-500', label: 'Mythic', dropRate: '0.1%' },
  };

  // Category icons
  const categoryIcons: Record<MaterialCategory, string> = {
    ore: '⛏️',
    gem: '💎',
    essence: '✨',
    leather: '🦌',
    wood: '🪵',
    crystal: '🔮',
  };

  // Equipment type icons
  const equipmentIcons: Record<EquipmentType, string> = {
    weapon: '⚔️',
    armor: '🛡️',
    accessory: '💍',
    consumable: '🧪',
  };

  // Helper functions
  const getTierColor = (tier: MaterialTier) => tierData[tier].color;
  const getTierGradient = (tier: MaterialTier) => tierData[tier].gradient;
  const getTierLabel = (tier: MaterialTier) => tierData[tier].label;

  const getMaterialById = (id: string): Material | undefined => {
    return materials.find(m => m.id === id);
  };

  const canCraftRecipe = (recipe: Recipe): boolean => {
    if (!recipe.unlocked || playerLevel < recipe.levelRequired) return false;
    return recipe.requirements.every(req => {
      const material = getMaterialById(req.materialId);
      return material && material.quantity >= req.quantity;
    });
  };

  const getSuccessRate = (baseRate: number): number => {
    // Intelligence reduces material cost and increases success rate
    const intBonus = Math.floor(intelligence / 10) * 2; // +2% per 10 INT
    return Math.min(baseRate + intBonus, 100);
  };

  const getCritChance = (baseCrit: number): number => {
    const intBonus = Math.floor(intelligence / 20) * 1; // +1% per 20 INT
    return Math.min(baseCrit + intBonus, 25);
  };

  const filterRecipes = (): Recipe[] => {
    let filtered = recipes;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }

    // Filter by unlocked status
    if (showOnlyUnlocked) {
      filtered = filtered.filter(r => r.unlocked);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const sortedMaterials = [...materials].sort((a, b) => {
    // Sort by tier first, then by category
    const tierOrder: MaterialTier[] = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
    const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    if (tierDiff !== 0) return tierDiff;
    return a.category.localeCompare(b.category);
  });

  const filteredRecipes = filterRecipes();

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {(['craft', 'materials', 'upgrade'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 font-medium transition-all ${
              selectedTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'craft' && '🔨 Crafting'}
            {tab === 'materials' && '📦 Materials'}
            {tab === 'upgrade' && '⬆️ Upgrade'}
          </button>
        ))}
      </div>

      {/* Crafting Tab */}
      {selectedTab === 'craft' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recipe List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filters */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-3">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500"
              />
              
              {/* Type Filter */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'weapon', 'armor', 'accessory', 'consumable'] as RecipeFilter[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      filterType === type
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {type === 'all' && 'All'}
                    {type === 'weapon' && '⚔️ Weapons'}
                    {type === 'armor' && '🛡️ Armor'}
                    {type === 'accessory' && '💍 Accessories'}
                    {type === 'consumable' && '🧪 Consumables'}
                  </button>
                ))}
              </div>

              {/* Unlocked Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyUnlocked}
                  onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-white/80">Show only unlocked</span>
              </label>
            </div>

            {/* Recipe List */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-2 max-h-[600px] overflow-y-auto">
              <h3 className="font-semibold text-purple-400 mb-3">
                Recipes ({filteredRecipes.length})
              </h3>
              {filteredRecipes.length === 0 ? (
                <p className="text-sm text-white/60 text-center py-8">
                  No recipes found. Try adjusting your filters.
                </p>
              ) : (
                filteredRecipes.map((recipe) => {
                  const canCraft = canCraftRecipe(recipe);
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedRecipe?.id === recipe.id
                          ? 'bg-purple-500/30 border border-purple-500'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      } ${!recipe.unlocked ? 'opacity-50' : ''}`}
                      disabled={!recipe.unlocked}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{recipe.result.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{recipe.name}</span>
                            {!recipe.unlocked && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                🔒 Locked
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 text-xs mt-1">
                            <span className="text-white/60">Tier {recipe.tier}</span>
                            <span className="text-white/60">•</span>
                            <span className="text-white/60">Lv {recipe.levelRequired}+</span>
                            {canCraft && (
                              <>
                                <span className="text-white/60">•</span>
                                <span className="text-green-400">✓ Can craft</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column - Recipe Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedRecipe ? (
              <>
                {/* Item Preview */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{selectedRecipe.result.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-1">{selectedRecipe.result.name}</h2>
                      <div className="flex gap-2 mb-3">
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded text-sm">
                          Tier {selectedRecipe.tier}
                        </span>
                        <span className="bg-white/10 text-white/80 px-3 py-1 rounded text-sm">
                          {equipmentIcons[selectedRecipe.type]} {selectedRecipe.type.charAt(0).toUpperCase() + selectedRecipe.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-4">{selectedRecipe.result.description}</p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedRecipe.result.stats.attack && (
                          <div className="bg-red-500/20 border border-red-500/30 rounded px-3 py-2">
                            <div className="text-xs text-red-400">Attack</div>
                            <div className="text-lg font-bold text-white">+{selectedRecipe.result.stats.attack}</div>
                          </div>
                        )}
                        {selectedRecipe.result.stats.defense && (
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded px-3 py-2">
                            <div className="text-xs text-blue-400">Defense</div>
                            <div className="text-lg font-bold text-white">+{selectedRecipe.result.stats.defense}</div>
                          </div>
                        )}
                        {selectedRecipe.result.stats.health && (
                          <div className="bg-green-500/20 border border-green-500/30 rounded px-3 py-2">
                            <div className="text-xs text-green-400">Health</div>
                            <div className="text-lg font-bold text-white">+{selectedRecipe.result.stats.health}</div>
                          </div>
                        )}
                        {selectedRecipe.result.stats.speed && (
                          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded px-3 py-2">
                            <div className="text-xs text-yellow-400">Speed</div>
                            <div className="text-lg font-bold text-white">+{selectedRecipe.result.stats.speed}</div>
                          </div>
                        )}
                        {selectedRecipe.result.stats.luck && (
                          <div className="bg-purple-500/20 border border-purple-500/30 rounded px-3 py-2">
                            <div className="text-xs text-purple-400">Luck</div>
                            <div className="text-lg font-bold text-white">+{selectedRecipe.result.stats.luck}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-purple-400">Required Materials</h3>
                  <div className="space-y-2">
                    {selectedRecipe.requirements.map((req) => {
                      const material = getMaterialById(req.materialId);
                      if (!material) return null;
                      const hasEnough = material.quantity >= req.quantity;
                      return (
                        <div
                          key={req.materialId}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            hasEnough ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{material.icon}</span>
                            <div>
                              <div className={`font-medium ${getTierColor(material.tier)}`}>
                                {material.name}
                              </div>
                              <div className="text-xs text-white/60">{getTierLabel(material.tier)}</div>
                            </div>
                          </div>
                          <div className={`text-lg font-bold ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                            {material.quantity} / {req.quantity}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Craft Info */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-purple-400">Crafting Info</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-white/60 mb-1">Success Rate</div>
                      <div className="text-xl font-bold text-green-400">
                        {getSuccessRate(selectedRecipe.successRate)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Critical Craft</div>
                      <div className="text-xl font-bold text-orange-400">
                        {getCritChance(selectedRecipe.critChance)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Level Required</div>
                      <div className={`text-xl font-bold ${playerLevel >= selectedRecipe.levelRequired ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedRecipe.levelRequired}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-white/60 mb-1">Your Level</div>
                      <div className="text-xl font-bold text-white">
                        {playerLevel}
                      </div>
                    </div>
                  </div>

                  {/* Craft Button */}
                  <button
                    onClick={() => onCraft(selectedRecipe.id)}
                    disabled={!canCraftRecipe(selectedRecipe)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!selectedRecipe.unlocked
                      ? '🔒 Recipe Locked'
                      : playerLevel < selectedRecipe.levelRequired
                      ? `Level ${selectedRecipe.levelRequired} Required`
                      : !canCraftRecipe(selectedRecipe)
                      ? 'Insufficient Materials'
                      : '🔨 Craft Item'}
                  </button>

                  {/* Tips */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-300">
                    <div className="flex gap-2">
                      <span>💡</span>
                      <div>
                        <p><strong>Crafting Tips:</strong></p>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                          <li>Critical crafts grant +20% bonus stats</li>
                          <li>Intelligence stat increases success rate</li>
                          <li>Failed crafts return 50% of materials</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🔨</div>
                <h3 className="text-xl font-bold text-white/60 mb-2">Select a Recipe</h3>
                <p className="text-white/40">
                  Choose a recipe from the list to view details and craft items
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Materials Tab */}
      {selectedTab === 'materials' && (
        <div className="space-y-4">
          {/* Material Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {(['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'] as MaterialTier[]).map((tier) => {
              const count = materials.filter(m => m.tier === tier).reduce((sum, m) => sum + m.quantity, 0);
              return (
                <div
                  key={tier}
                  className={`bg-gradient-to-br ${getTierGradient(tier)} p-4 rounded-lg`}
                >
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-sm text-white/90">{getTierLabel(tier)}</div>
                </div>
              );
            })}
          </div>

          {/* Material Grid */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-purple-400 mb-4">Material Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{material.icon}</span>
                    <div className="flex-1">
                      <div className={`font-medium ${getTierColor(material.tier)}`}>
                        {material.name}
                      </div>
                      <div className="flex gap-2 text-xs mt-1">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white/80">
                          {getTierLabel(material.tier)}
                        </span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white/80">
                          {categoryIcons[material.category]} {material.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-2">{material.description}</p>
                      <div className="text-2xl font-bold text-white mt-2">
                        x{material.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Tab */}
      {selectedTab === 'upgrade' && (
        <div className="text-center space-y-6 py-12">
          <div className="text-6xl">⬆️</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-purple-400">Equipment Upgrade</h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              Upgrade your existing equipment to increase their tier and stats. Each upgrade requires materials and preserves enchantments.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 max-w-2xl mx-auto text-left">
            <h4 className="font-semibold text-purple-400 mb-3">Upgrade System</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Increase equipment tier by +1 (maximum +5 upgrades)</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Material costs scale with current tier</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Preserves all enchantments and sockets</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Each upgrade grants +10% to all stats</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Higher tier upgrades require rare materials</span>
              </li>
            </ul>
          </div>
          <div className="text-white/40 text-sm">
            Equipment upgrade interface coming soon!
          </div>
        </div>
      )}
    </div>
  );
}
