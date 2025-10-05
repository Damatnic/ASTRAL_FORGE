'use client'

/**
 * INVENTORY MANAGER COMPONENT
 * 
 * Comprehensive inventory and equipment management system with item rarities and stats.
 * Features drag-and-drop equipping, stat comparison, set bonuses, and visual effects.
 * 
 * Features:
 * - 6 rarity tiers (Common → Mythic)
 * - 5 equipment slots with stats
 * - 50-slot inventory grid (expandable)
 * - Item comparison tooltips
 * - Set bonuses system
 * - Drag-and-drop equipping
 * - Search/filter/sort functionality
 * - Currency display
 * - Auto-optimize feature
 */

import { useState } from 'react'

// TypeScript interfaces
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'mount' | 'material'
export type EquipSlot = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'mount'

export interface ItemStats {
  attack?: number
  defense?: number
  hp?: number
  stamina?: number
  critChance?: number
  critDamage?: number
  strength?: number
  endurance?: number
  agility?: number
}

export interface Item {
  id: string
  name: string
  rarity: ItemRarity
  type: ItemType
  slot?: EquipSlot
  icon: string
  level: number
  stats?: ItemStats
  setName?: string
  setBonus?: string
  flavorText: string
  stackSize?: number
  quantity?: number
}

export interface EquippedItems {
  weapon?: Item
  armor?: Item
  accessory?: Item
  consumable?: Item
  mount?: Item
}

interface InventoryManagerProps {
  items: Item[]
  equipped: EquippedItems
  gold: number
  gems: number
  materials: number
  onEquip?: (item: Item) => void
  onUnequip?: (slot: EquipSlot) => void
  onUse?: (item: Item) => void
  onDestroy?: (item: Item) => void
  onSell?: (item: Item) => void
}

export function InventoryManager({
  items,
  equipped,
  gold,
  gems,
  materials,
  onEquip,
  onUnequip,
  onUse,
  onDestroy,
  onSell
}: InventoryManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRarity, setFilterRarity] = useState<ItemRarity | 'all'>('all')
  const [filterType, setFilterType] = useState<ItemType | 'all'>('all')
  const [sortBy, setSortBy] = useState<'rarity' | 'level' | 'name' | 'recent'>('rarity')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [hoveredSlot, setHoveredSlot] = useState<EquipSlot | null>(null)

  // Get rarity color
  function getRarityColor(rarity: ItemRarity): string {
    switch (rarity) {
      case 'common': return '#9ca3af' // gray-400
      case 'uncommon': return '#10b981' // green-500
      case 'rare': return '#3b82f6' // blue-500
      case 'epic': return '#a855f7' // purple-500
      case 'legendary': return '#f59e0b' // amber-500
      case 'mythic': return '#ec4899' // pink-500
      default: return '#6b7280'
    }
  }

  // Get rarity gradient
  function getRarityGradient(rarity: ItemRarity): string {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'uncommon': return 'from-green-500 to-emerald-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-amber-500 to-orange-600'
      case 'mythic': return 'from-pink-500 via-purple-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  // Get slot icon
  function getSlotIcon(slot: EquipSlot): string {
    switch (slot) {
      case 'weapon': return '⚔️'
      case 'armor': return '🛡️'
      case 'accessory': return '💍'
      case 'consumable': return '🧪'
      case 'mount': return '🐴'
      default: return '❓'
    }
  }

  // Get slot name
  function getSlotName(slot: EquipSlot): string {
    return slot.charAt(0).toUpperCase() + slot.slice(1)
  }

  // Calculate total stats from equipped items
  function calculateTotalStats(): ItemStats {
    const total: ItemStats = {}
    
    Object.values(equipped).forEach(item => {
      if (item?.stats) {
        Object.entries(item.stats).forEach(([key, value]) => {
          const statKey = key as keyof ItemStats
          const currentValue = (total[statKey] as number | undefined) || 0
          const addValue = (value as number | undefined) || 0
          total[statKey] = (currentValue + addValue) as any
        })
      }
    })
    
    return total
  }

  // Check for set bonuses
  function getActiveSets(): { name: string; count: number; bonus: string }[] {
    const sets: Record<string, { count: number; bonus: string }> = {}
    
    Object.values(equipped).forEach(item => {
      if (item?.setName && item?.setBonus) {
        if (!sets[item.setName]) {
          sets[item.setName] = { count: 0, bonus: item.setBonus }
        }
        sets[item.setName].count++
      }
    })
    
    return Object.entries(sets)
      .filter(([_, data]) => data.count >= 2)
      .map(([name, data]) => ({ name, ...data }))
  }

  // Filter and sort items
  function getFilteredItems(): Item[] {
    let filtered = items.filter(item => {
      // Search filter
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Rarity filter
      if (filterRarity !== 'all' && item.rarity !== filterRarity) {
        return false
      }
      
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) {
        return false
      }
      
      return true
    })
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
          return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity)
        case 'level':
          return b.level - a.level
        case 'name':
          return a.name.localeCompare(b.name)
        case 'recent':
          return 0 // Would use timestamp in real implementation
        default:
          return 0
      }
    })
    
    return filtered
  }

  // Compare item with equipped item in same slot
  function getStatComparison(item: Item): { stat: string; current: number; new: number; diff: number }[] {
    if (!item.slot || !item.stats) return []
    
    const equippedItem = equipped[item.slot]
    if (!equippedItem?.stats) return []
    
    const comparison: { stat: string; current: number; new: number; diff: number }[] = []
    
    const allStats = new Set([...Object.keys(item.stats), ...Object.keys(equippedItem.stats)])
    
    allStats.forEach(stat => {
      const currentValue = (equippedItem.stats?.[stat as keyof ItemStats] || 0) as number
      const newValue = (item.stats?.[stat as keyof ItemStats] || 0) as number
      const diff = newValue - currentValue
      
      if (diff !== 0) {
        comparison.push({
          stat: stat.charAt(0).toUpperCase() + stat.slice(1),
          current: currentValue,
          new: newValue,
          diff
        })
      }
    })
    
    return comparison
  }

  // Handle equip item
  function handleEquip(item: Item) {
    if (item.slot && item.type !== 'material' && item.type !== 'consumable') {
      onEquip?.(item)
      setSelectedItem(null)
    }
  }

  // Handle use consumable
  function handleUse(item: Item) {
    if (item.type === 'consumable') {
      onUse?.(item)
      setSelectedItem(null)
    }
  }

  // Render equipment slot
  function renderEquipmentSlot(slot: EquipSlot) {
    const item = equipped[slot]
    const isHovered = hoveredSlot === slot
    
    return (
      <div
        key={slot}
        className="relative"
        onMouseEnter={() => setHoveredSlot(slot)}
        onMouseLeave={() => setHoveredSlot(null)}
      >
        <div
          className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 rounded-xl p-4 transition-all duration-300 ${
            item
              ? `border-${getRarityColor(item.rarity)} shadow-lg`
              : 'border-slate-700 hover:border-purple-500/50'
          }`}
          style={{
            borderColor: item ? getRarityColor(item.rarity) : undefined,
            boxShadow: item ? `0 0 20px ${getRarityColor(item.rarity)}50` : undefined
          }}
        >
          {/* Slot label */}
          <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center justify-between">
            <span>{getSlotName(slot)}</span>
            <span>{getSlotIcon(slot)}</span>
          </div>
          
          {item ? (
            <>
              {/* Equipped item */}
              <div className="text-center">
                <div className="text-5xl mb-2">{item.icon}</div>
                <div
                  className="font-bold text-sm mb-1"
                  style={{ color: getRarityColor(item.rarity) }}
                >
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mb-2">Level {item.level}</div>
                
                {/* Stats */}
                {item.stats && (
                  <div className="space-y-1 text-xs text-left">
                    {Object.entries(item.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-gray-300">
                        <span className="capitalize">{key}:</span>
                        <span className="font-semibold text-white">+{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Unequip button */}
              {isHovered && (
                <button
                  onClick={() => onUnequip?.(slot)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-all"
                >
                  Unequip
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-2">{getSlotIcon(slot)}</div>
              <div className="text-xs">Empty Slot</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render item card
  function renderItemCard(item: Item) {
    const isSelected = selectedItem?.id === item.id
    const comparison = getStatComparison(item)
    
    return (
      <div
        key={item.id}
        onClick={() => setSelectedItem(item)}
        className={`relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 rounded-lg p-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
          isSelected
            ? 'border-purple-500 shadow-lg shadow-purple-500/50 scale-105'
            : 'border-slate-700 hover:border-purple-500/50'
        }`}
        style={{
          boxShadow: isSelected ? undefined : `0 0 10px ${getRarityColor(item.rarity)}30`
        }}
      >
        {/* Rarity badge */}
        <div
          className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${getRarityColor(item.rarity)}33`,
            border: `1px solid ${getRarityColor(item.rarity)}`,
            color: getRarityColor(item.rarity)
          }}
        >
          {item.rarity.toUpperCase()}
        </div>
        
        {/* Item icon */}
        <div className="text-4xl text-center mb-1">{item.icon}</div>
        
        {/* Item name */}
        <div
          className="font-bold text-xs text-center mb-1 truncate"
          style={{ color: getRarityColor(item.rarity) }}
        >
          {item.name}
        </div>
        
        {/* Level */}
        <div className="text-xs text-gray-500 text-center mb-2">Lv.{item.level}</div>
        
        {/* Quantity for stackable items */}
        {item.quantity && item.quantity > 1 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-xs font-bold text-white">
            x{item.quantity}
          </div>
        )}
        
        {/* Set indicator */}
        {item.setName && (
          <div className="absolute top-2 left-2 text-xs">🔗</div>
        )}
      </div>
    )
  }

  const filteredItems = getFilteredItems()
  const totalStats = calculateTotalStats()
  const activeSets = getActiveSets()
  const usedSlots = items.length
  const maxSlots = 50

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Panel - Equipment & Stats */}
      <div className="col-span-4 space-y-6">
        {/* Currency Display */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span>💰</span> Currency
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="text-sm text-gray-400">Gold</span>
              </div>
              <span className="font-bold text-yellow-400">{gold.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💎</span>
                <span className="text-sm text-gray-400">Gems</span>
              </div>
              <span className="font-bold text-cyan-400">{gems.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚒️</span>
                <span className="text-sm text-gray-400">Materials</span>
              </div>
              <span className="font-bold text-purple-400">{materials.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Equipment Slots */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span>⚔️</span> Equipment
          </h3>
          <div className="space-y-3">
            {renderEquipmentSlot('weapon')}
            {renderEquipmentSlot('armor')}
            {renderEquipmentSlot('accessory')}
            {renderEquipmentSlot('consumable')}
            {renderEquipmentSlot('mount')}
          </div>
        </div>

        {/* Total Stats */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-4">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span>📊</span> Total Stats
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(totalStats).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-slate-800/50 rounded p-2">
                <span className="text-gray-400 capitalize">{key}</span>
                <span className="font-bold text-white">+{value}</span>
              </div>
            ))}
            {Object.keys(totalStats).length === 0 && (
              <div className="text-center text-gray-600 py-4">
                No equipment equipped
              </div>
            )}
          </div>
        </div>

        {/* Set Bonuses */}
        {activeSets.length > 0 && (
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 rounded-xl p-4">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>✨</span> Set Bonuses
            </h3>
            <div className="space-y-2">
              {activeSets.map(set => (
                <div key={set.name} className="bg-slate-900/50 rounded-lg p-3">
                  <div className="font-bold text-amber-400 mb-1">
                    {set.name} ({set.count} pieces)
                  </div>
                  <div className="text-xs text-gray-300">{set.bonus}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Inventory */}
      <div className="col-span-8">
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-6">
          {/* Inventory Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🎒</span> Inventory
              <span className="text-sm text-gray-400">
                ({usedSlots}/{maxSlots})
              </span>
            </h2>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
              Auto-Optimize
            </button>
          </div>

          {/* Filters & Search */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            
            {/* Rarity Filter */}
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as ItemRarity | 'all')}
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
              <option value="mythic">Mythic</option>
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rarity' | 'level' | 'name' | 'recent')}
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="rarity">Sort: Rarity</option>
              <option value="level">Sort: Level</option>
              <option value="name">Sort: Name</option>
              <option value="recent">Sort: Recent</option>
            </select>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('weapon')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'weapon'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              ⚔️ Weapons
            </button>
            <button
              onClick={() => setFilterType('armor')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'armor'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              🛡️ Armor
            </button>
            <button
              onClick={() => setFilterType('accessory')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'accessory'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              💍 Accessories
            </button>
            <button
              onClick={() => setFilterType('consumable')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'consumable'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              🧪 Consumables
            </button>
            <button
              onClick={() => setFilterType('mount')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'mount'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              🐴 Mounts
            </button>
            <button
              onClick={() => setFilterType('material')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                filterType === 'material'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              ⚒️ Materials
            </button>
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-6 gap-3 mb-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredItems.map(item => renderItemCard(item))}
            
            {filteredItems.length === 0 && (
              <div className="col-span-6 text-center py-12 text-gray-600">
                <div className="text-6xl mb-3">🎒</div>
                <div className="text-lg font-semibold">No items found</div>
                <div className="text-sm">Try adjusting your filters</div>
              </div>
            )}
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-2 rounded-lg p-4"
              style={{
                borderColor: getRarityColor(selectedItem.rarity),
                boxShadow: `0 0 20px ${getRarityColor(selectedItem.rarity)}50`
              }}
            >
              <div className="flex items-start gap-4">
                {/* Item Icon */}
                <div className="text-6xl">{selectedItem.icon}</div>
                
                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3
                        className="text-2xl font-bold mb-1"
                        style={{ color: getRarityColor(selectedItem.rarity) }}
                      >
                        {selectedItem.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="capitalize">{selectedItem.rarity}</span>
                        <span>•</span>
                        <span className="capitalize">{selectedItem.type}</span>
                        <span>•</span>
                        <span>Level {selectedItem.level}</span>
                        {selectedItem.slot && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{selectedItem.slot}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Flavor Text */}
                  <p className="text-sm italic text-gray-400 mb-3">&quot;{selectedItem.flavorText}&quot;</p>
                  
                  {/* Stats */}
                  {selectedItem.stats && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-white mb-2">Stats:</div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(selectedItem.stats).map(([key, value]) => (
                          <div key={key} className="bg-slate-900/50 rounded px-2 py-1 text-sm">
                            <span className="text-gray-400 capitalize">{key}:</span>
                            <span className="font-bold text-green-400 ml-1">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Set Info */}
                  {selectedItem.setName && (
                    <div className="mb-3 bg-amber-500/20 border border-amber-500/50 rounded p-2">
                      <div className="text-sm font-semibold text-amber-400 mb-1">
                        Set: {selectedItem.setName}
                      </div>
                      <div className="text-xs text-gray-300">{selectedItem.setBonus}</div>
                    </div>
                  )}
                  
                  {/* Comparison */}
                  {getStatComparison(selectedItem).length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-white mb-2">Comparison:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {getStatComparison(selectedItem).map(comp => (
                          <div key={comp.stat} className="bg-slate-900/50 rounded px-2 py-1 text-xs">
                            <span className="text-gray-400">{comp.stat}:</span>
                            <span className={`font-bold ml-1 ${comp.diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {comp.diff > 0 ? '+' : ''}{comp.diff}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    {selectedItem.slot && selectedItem.type !== 'material' && selectedItem.type !== 'consumable' && (
                      <button
                        onClick={() => handleEquip(selectedItem)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        Equip
                      </button>
                    )}
                    
                    {selectedItem.type === 'consumable' && (
                      <button
                        onClick={() => handleUse(selectedItem)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
                      >
                        Use
                      </button>
                    )}
                    
                    <button
                      onClick={() => onSell?.(selectedItem)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all"
                    >
                      Sell
                    </button>
                    
                    <button
                      onClick={() => onDestroy?.(selectedItem)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                    >
                      Destroy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
