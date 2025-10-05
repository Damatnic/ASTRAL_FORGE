'use client'

/**
 * INVENTORY PAGE
 * 
 * Complete inventory and equipment management interface.
 * Features comprehensive item system with rarities, stats, and set bonuses.
 */

import { useState } from 'react'
import { InventoryManager, Item, EquippedItems, EquipSlot } from '@/components/inventory-manager'
import { ParticleBackground } from '@/components/particle-background'

export default function InventoryPage() {
  // Sample equipped items
  const [equipped, setEquipped] = useState<EquippedItems>({
    weapon: {
      id: 'equipped-weapon',
      name: 'Titanforged Barbell',
      rarity: 'legendary',
      type: 'weapon',
      slot: 'weapon',
      icon: '⚔️',
      level: 45,
      stats: {
        attack: 125,
        strength: 45,
        critChance: 15,
        critDamage: 50
      },
      setName: 'Titan\'s Might',
      setBonus: '2-piece: +25% strength gains, 4-piece: +50% PR potential',
      flavorText: 'Forged in the fires of determination, this barbell has lifted champions to glory.'
    },
    armor: {
      id: 'equipped-armor',
      name: 'Bulwark Plate',
      rarity: 'epic',
      type: 'armor',
      slot: 'armor',
      icon: '🛡️',
      level: 42,
      stats: {
        defense: 85,
        hp: 350,
        endurance: 30
      },
      flavorText: 'Impenetrable defense for those who dare to push their limits.'
    },
    accessory: {
      id: 'equipped-accessory',
      name: 'Champion\'s Ring',
      rarity: 'rare',
      type: 'accessory',
      slot: 'accessory',
      icon: '💍',
      level: 38,
      stats: {
        critChance: 8,
        agility: 15,
        stamina: 25
      },
      flavorText: 'Worn by legends, this ring channels the power of perseverance.'
    }
  })

  // Sample inventory items
  const [items, setItems] = useState<Item[]>([
    // Weapons
    {
      id: 'weapon-1',
      name: 'Mythic Deadlift Chains',
      rarity: 'mythic',
      type: 'weapon',
      slot: 'weapon',
      icon: '⚔️',
      level: 50,
      stats: {
        attack: 175,
        strength: 65,
        critChance: 20,
        critDamage: 75,
        endurance: 20
      },
      setName: 'Titan\'s Might',
      setBonus: '2-piece: +25% strength gains, 4-piece: +50% PR potential',
      flavorText: 'Legendary chains said to have bound ancient titans. Now they fuel your ascent to greatness.'
    },
    {
      id: 'weapon-2',
      name: 'Venomstrike Dumbbells',
      rarity: 'epic',
      type: 'weapon',
      slot: 'weapon',
      icon: '⚔️',
      level: 40,
      stats: {
        attack: 95,
        agility: 30,
        critChance: 18
      },
      flavorText: 'Swift and deadly, these dumbbells strike with precision.'
    },
    {
      id: 'weapon-3',
      name: 'Ironclad Kettlebell',
      rarity: 'rare',
      type: 'weapon',
      slot: 'weapon',
      icon: '⚔️',
      level: 35,
      stats: {
        attack: 65,
        strength: 25,
        endurance: 20
      },
      flavorText: 'A reliable companion for building functional strength.'
    },

    // Armor
    {
      id: 'armor-1',
      name: 'Mythic Exoskeleton',
      rarity: 'mythic',
      type: 'armor',
      slot: 'armor',
      icon: '🛡️',
      level: 50,
      stats: {
        defense: 150,
        hp: 500,
        endurance: 50,
        stamina: 75
      },
      flavorText: 'Biomechanical armor that adapts to your body, maximizing protection and performance.'
    },
    {
      id: 'armor-2',
      name: 'Dragon Scale Vest',
      rarity: 'legendary',
      type: 'armor',
      slot: 'armor',
      icon: '🛡️',
      level: 48,
      stats: {
        defense: 120,
        hp: 425,
        endurance: 40,
        critDamage: 25
      },
      setName: 'Titan\'s Might',
      setBonus: '2-piece: +25% strength gains, 4-piece: +50% PR potential',
      flavorText: 'Scales from an ancient dragon, imbued with legendary resilience.'
    },
    {
      id: 'armor-3',
      name: 'Reinforced Training Gear',
      rarity: 'uncommon',
      type: 'armor',
      slot: 'armor',
      icon: '🛡️',
      level: 25,
      stats: {
        defense: 45,
        hp: 150,
        endurance: 15
      },
      flavorText: 'Standard issue for serious athletes beginning their journey.'
    },

    // Accessories
    {
      id: 'accessory-1',
      name: 'Amulet of Infinite Stamina',
      rarity: 'legendary',
      type: 'accessory',
      slot: 'accessory',
      icon: '💍',
      level: 47,
      stats: {
        stamina: 100,
        endurance: 35,
        hp: 200
      },
      flavorText: 'Legend says this amulet grants boundless energy to those worthy of wielding it.'
    },
    {
      id: 'accessory-2',
      name: 'Bracers of Precision',
      rarity: 'epic',
      type: 'accessory',
      slot: 'accessory',
      icon: '💍',
      level: 43,
      stats: {
        critChance: 15,
        agility: 25,
        attack: 30
      },
      flavorText: 'Perfect form in every movement, guaranteed.'
    },
    {
      id: 'accessory-3',
      name: 'Lucky Charm',
      rarity: 'common',
      type: 'accessory',
      slot: 'accessory',
      icon: '💍',
      level: 10,
      stats: {
        critChance: 3
      },
      flavorText: 'A simple charm that occasionally brings good fortune.'
    },

    // Consumables
    {
      id: 'consumable-1',
      name: 'Mega XP Boost',
      rarity: 'legendary',
      type: 'consumable',
      slot: 'consumable',
      icon: '🧪',
      level: 1,
      flavorText: '+200% XP for 24 hours. The ultimate growth accelerator.',
      quantity: 3
    },
    {
      id: 'consumable-2',
      name: 'Strength Elixir',
      rarity: 'epic',
      type: 'consumable',
      slot: 'consumable',
      icon: '🧪',
      level: 1,
      flavorText: '+50 strength for 1 hour. Feel the power surge through your muscles.',
      quantity: 12
    },
    {
      id: 'consumable-3',
      name: 'Stamina Potion',
      rarity: 'rare',
      type: 'consumable',
      slot: 'consumable',
      icon: '🧪',
      level: 1,
      flavorText: 'Restore 50 stamina instantly. Never run out of energy mid-workout.',
      quantity: 25
    },
    {
      id: 'consumable-4',
      name: 'Health Potion',
      rarity: 'uncommon',
      type: 'consumable',
      slot: 'consumable',
      icon: '🧪',
      level: 1,
      flavorText: 'Restore 100 HP. Quick recovery for battles ahead.',
      quantity: 50
    },

    // Mounts
    {
      id: 'mount-1',
      name: 'Celestial Pegasus',
      rarity: 'mythic',
      type: 'mount',
      slot: 'mount',
      icon: '🐴',
      level: 50,
      stats: {
        agility: 100,
        stamina: 150
      },
      flavorText: 'A majestic winged steed from the heavens. Ride in style and prestige.'
    },
    {
      id: 'mount-2',
      name: 'War Rhino',
      rarity: 'legendary',
      type: 'mount',
      slot: 'mount',
      icon: '🐴',
      level: 45,
      stats: {
        strength: 60,
        defense: 40,
        hp: 200
      },
      flavorText: 'Unstoppable force of nature. Charge into battle with confidence.'
    },
    {
      id: 'mount-3',
      name: 'Swift Stallion',
      rarity: 'rare',
      type: 'mount',
      slot: 'mount',
      icon: '🐴',
      level: 30,
      stats: {
        agility: 40,
        stamina: 30
      },
      flavorText: 'Fast and reliable transportation for your fitness journey.'
    },

    // Materials
    {
      id: 'material-1',
      name: 'Titan Essence',
      rarity: 'mythic',
      type: 'material',
      icon: '⚒️',
      level: 1,
      flavorText: 'Concentrated power of ancient titans. Used to forge legendary equipment.',
      quantity: 5
    },
    {
      id: 'material-2',
      name: 'Dragon Scale Fragment',
      rarity: 'legendary',
      type: 'material',
      icon: '⚒️',
      level: 1,
      flavorText: 'Rare material from dragon armor. Essential for high-tier crafting.',
      quantity: 15
    },
    {
      id: 'material-3',
      name: 'Enchanted Ore',
      rarity: 'epic',
      type: 'material',
      icon: '⚒️',
      level: 1,
      flavorText: 'Magical ore with special properties. Useful for enhancements.',
      quantity: 45
    },
    {
      id: 'material-4',
      name: 'Iron Ingot',
      rarity: 'common',
      type: 'material',
      icon: '⚒️',
      level: 1,
      flavorText: 'Basic crafting material. Foundation of all equipment.',
      quantity: 250
    }
  ])

  const [gold, setGold] = useState(47500)
  const [gems, setGems] = useState(1250)
  const [materials, setMaterials] = useState(315)

  // Handle equip item
  const handleEquip = (item: Item) => {
    if (!item.slot) return

    // Unequip current item in that slot if exists
    const currentItem = equipped[item.slot]
    if (currentItem) {
      setItems(prev => [...prev, currentItem])
    }

    // Equip new item
    setEquipped(prev => ({
      ...prev,
      [item.slot!]: item
    }))

    // Remove from inventory
    setItems(prev => prev.filter(i => i.id !== item.id))
  }

  // Handle unequip item
  const handleUnequip = (slot: EquipSlot) => {
    const item = equipped[slot]
    if (!item) return

    // Add back to inventory
    setItems(prev => [...prev, item])

    // Remove from equipped
    setEquipped(prev => {
      const updated = { ...prev }
      delete updated[slot]
      return updated
    })
  }

  // Handle use consumable
  const handleUse = (item: Item) => {
    console.log(`Used ${item.name}!`)
    
    // Decrease quantity or remove
    setItems(prev => prev.map(i => {
      if (i.id === item.id) {
        if (i.quantity && i.quantity > 1) {
          return { ...i, quantity: i.quantity - 1 }
        }
        return null
      }
      return i
    }).filter(Boolean) as Item[])
  }

  // Handle destroy item
  const handleDestroy = (item: Item) => {
    const confirmed = window.confirm(`Destroy ${item.name}? This action cannot be undone.`)
    if (!confirmed) return

    setItems(prev => prev.filter(i => i.id !== item.id))
    
    // Could add materials gained
    if (item.rarity === 'legendary' || item.rarity === 'mythic') {
      setMaterials(prev => prev + 10)
    }
  }

  // Handle sell item
  const handleSell = (item: Item) => {
    const sellPrice = Math.floor(item.level * 10 * (item.rarity === 'mythic' ? 10 : item.rarity === 'legendary' ? 5 : item.rarity === 'epic' ? 3 : item.rarity === 'rare' ? 2 : 1))
    
    const confirmed = window.confirm(`Sell ${item.name} for ${sellPrice} gold?`)
    if (!confirmed) return

    setItems(prev => prev.filter(i => i.id !== item.id))
    setGold(prev => prev + sellPrice)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <ParticleBackground
        particleCount={60}
        colors={['rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(245, 158, 11, 0.6)']}
        speed={0.3}
      />

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl">🎒</div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 text-transparent bg-clip-text">
              INVENTORY
            </h1>
            <div className="text-6xl">⚔️</div>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage your equipment, consumables, and materials. Equip the best gear to maximize your stats and dominate every challenge.
          </p>
        </div>

        {/* Inventory Manager */}
        <InventoryManager
          items={items}
          equipped={equipped}
          gold={gold}
          gems={gems}
          materials={materials}
          onEquip={handleEquip}
          onUnequip={handleUnequip}
          onUse={handleUse}
          onDestroy={handleDestroy}
          onSell={handleSell}
        />

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Inventory Tips
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-lg">⭐</span>
              <div>
                <div className="font-semibold text-white">Rarity Matters</div>
                <div>Higher rarity items have better stats and special effects. Aim for legendary and mythic gear!</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔗</span>
              <div>
                <div className="font-semibold text-white">Set Bonuses</div>
                <div>Equip multiple items from the same set to unlock powerful bonus effects.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📊</span>
              <div>
                <div className="font-semibold text-white">Stat Comparison</div>
                <div>Select an item to see how it compares to your currently equipped gear.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🧪</span>
              <div>
                <div className="font-semibold text-white">Consumables</div>
                <div>Use potions and elixirs for temporary buffs during tough challenges.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">💰</span>
              <div>
                <div className="font-semibold text-white">Sell Wisely</div>
                <div>Sell unwanted items for gold. Higher level and rarity = more gold!</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">⚒️</span>
              <div>
                <div className="font-semibold text-white">Salvage Materials</div>
                <div>Destroy items to gain crafting materials for future upgrades.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
