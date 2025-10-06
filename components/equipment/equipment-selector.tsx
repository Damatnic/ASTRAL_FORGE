'use client'

/**
 * Equipment Selector Component
 * Allows users to select their available equipment
 */

import React, { useState } from 'react'
import { EquipmentCategory } from '@prisma/client'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { equipmentSeedData, equipmentPresets } from '@/lib/equipment-data'

interface EquipmentSelectorProps {
  selectedEquipment: string[]
  onSelectionChange: (equipment: string[]) => void
  location?: string
  className?: string
}

const categoryIcons: Record<EquipmentCategory, string> = {
  BARBELL: '🏋️',
  DUMBBELL: '💪',
  MACHINE: '⚙️',
  RACK: '🔲',
  BENCH: '🛋️',
  BODYWEIGHT: '🤸',
  CARDIO: '🏃',
  ACCESSORY: '🎒',
  PLATFORM: '📐',
}

const categoryDescriptions: Record<EquipmentCategory, string> = {
  BARBELL: 'Olympic barbells, EZ bars, specialty bars',
  DUMBBELL: 'Fixed and adjustable dumbbells',
  MACHINE: 'Cable machines, leg press, smith machine',
  RACK: 'Power racks, squat racks, stands',
  BENCH: 'Flat, incline, decline benches',
  BODYWEIGHT: 'Pull-up bars, dip stations, rings',
  CARDIO: 'Treadmills, bikes, rowers',
  ACCESSORY: 'Bands, kettlebells, medicine balls',
  PLATFORM: 'Lifting platforms and deadlift platforms',
}

export function EquipmentSelector({
  selectedEquipment,
  onSelectionChange,
  location = 'default',
  className,
}: EquipmentSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<EquipmentCategory>>(
    new Set(Object.values(EquipmentCategory))
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Group equipment by category
  const equipmentByCategory = equipmentSeedData.reduce((acc, equipment) => {
    if (!acc[equipment.category]) {
      acc[equipment.category] = []
    }
    acc[equipment.category].push(equipment)
    return acc
  }, {} as Record<EquipmentCategory, typeof equipmentSeedData>)

  // Filter by search query
  const filteredEquipment = Object.entries(equipmentByCategory).reduce((acc, [category, items]) => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[category as EquipmentCategory] = filtered
    }
    return acc
  }, {} as Record<EquipmentCategory, typeof equipmentSeedData>)

  const toggleCategory = (category: EquipmentCategory) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleEquipment = (equipmentName: string) => {
    const newSelection = selectedEquipment.includes(equipmentName)
      ? selectedEquipment.filter(e => e !== equipmentName)
      : [...selectedEquipment, equipmentName]
    onSelectionChange(newSelection)
  }

  const selectAll = (category: EquipmentCategory) => {
    const categoryEquipment = equipmentByCategory[category].map(e => e.name)
    const allSelected = categoryEquipment.every(e => selectedEquipment.includes(e))
    
    if (allSelected) {
      // Deselect all in category
      onSelectionChange(selectedEquipment.filter(e => !categoryEquipment.includes(e)))
    } else {
      // Select all in category
      const newSelection = [...new Set([...selectedEquipment, ...categoryEquipment])]
      onSelectionChange(newSelection)
    }
  }

  const applyPreset = (presetKey: keyof typeof equipmentPresets) => {
    onSelectionChange(equipmentPresets[presetKey])
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  return (
    <div className={cn('bg-astral-gray rounded-xl border border-astral-light p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Select Your Equipment
        </h2>
        <p className="text-sm text-gray-400">
          Choose the equipment you have access to at {location}
        </p>
      </div>

      {/* Quick Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
          Quick Presets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('homeGymMinimal')}
            className="px-3 py-2 bg-astral-dark border border-astral-light rounded-lg text-sm hover:bg-astral-light transition-colors"
          >
            🏠 Home Gym (Minimal)
          </button>
          <button
            onClick={() => applyPreset('homeGymComplete')}
            className="px-3 py-2 bg-astral-dark border border-astral-light rounded-lg text-sm hover:bg-astral-light transition-colors"
          >
            🏠 Home Gym (Complete)
          </button>
          <button
            onClick={() => applyPreset('commercialGym')}
            className="px-3 py-2 bg-astral-dark border border-astral-light rounded-lg text-sm hover:bg-astral-light transition-colors"
          >
            🏢 Commercial Gym
          </button>
          <button
            onClick={() => applyPreset('bodyweightOnly')}
            className="px-3 py-2 bg-astral-dark border border-astral-light rounded-lg text-sm hover:bg-astral-light transition-colors"
          >
            🤸 Bodyweight Only
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-astral-dark border border-astral-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-astral-blue"
        />
      </div>

      {/* Selection Count */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-astral-light">
        <span className="text-sm text-gray-400">
          {selectedEquipment.length} items selected
        </span>
        <button
          onClick={clearAll}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Equipment Categories */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {Object.entries(filteredEquipment).map(([category, items]) => {
          const cat = category as EquipmentCategory
          const isExpanded = expandedCategories.has(cat)
          const allSelected = items.every(item => selectedEquipment.includes(item.name))
          const someSelected = items.some(item => selectedEquipment.includes(item.name))

          return (
            <div
              key={category}
              className="bg-astral-dark rounded-lg border border-astral-light overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-astral-light/50 transition-colors">
                <div
                  className="flex items-center gap-3 flex-1"
                  onClick={() => toggleCategory(cat)}
                >
                  <span className="text-2xl">{categoryIcons[cat]}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{category}</h4>
                    <p className="text-xs text-gray-400">
                      {categoryDescriptions[cat]}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {items.filter(item => selectedEquipment.includes(item.name)).length}/{items.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    selectAll(cat)
                  }}
                  className={cn(
                    'ml-3 px-3 py-1 rounded text-xs font-semibold transition-colors',
                    allSelected
                      ? 'bg-astral-blue text-white hover:bg-astral-blue/80'
                      : someSelected
                      ? 'bg-astral-purple text-white hover:bg-astral-purple/80'
                      : 'bg-astral-light text-gray-400 hover:bg-astral-light/80'
                  )}
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Equipment Items */}
              {isExpanded && (
                <div className="border-t border-astral-light bg-astral-dark/50 p-2">
                  <div className="space-y-1">
                    {items.map((equipment) => {
                      const isSelected = selectedEquipment.includes(equipment.name)

                      return (
                        <button
                          key={equipment.name}
                          onClick={() => toggleEquipment(equipment.name)}
                          className={cn(
                            'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                            isSelected
                              ? 'bg-astral-blue/20 border border-astral-blue/50'
                              : 'hover:bg-astral-light border border-transparent'
                          )}
                        >
                          <div
                            className={cn(
                              'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                              isSelected
                                ? 'bg-astral-blue border-astral-blue'
                                : 'border-gray-500'
                            )}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white text-sm">
                              {equipment.name}
                            </div>
                            {equipment.description && (
                              <div className="text-xs text-gray-400 mt-0.5">
                                {equipment.description}
                              </div>
                            )}
                          </div>
                          {equipment.weight && (
                            <div className="text-xs text-gray-400 font-mono">
                              {equipment.weight}kg
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
