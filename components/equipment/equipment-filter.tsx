'use client'

import { useEffect, useState } from 'react'
import { Check, Package } from 'lucide-react'
import { EquipmentCategory } from '@prisma/client'

interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  description?: string
}

interface UserEquipment {
  equipmentId: string
  equipment: Equipment
}

interface EquipmentFilterProps {
  onFilterChange: (equipmentIds: string[]) => void
  showAvailableOnly: boolean
  onAvailableOnlyChange: (value: boolean) => void
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

export function EquipmentFilter({
  onFilterChange,
  showAvailableOnly,
  onAvailableOnlyChange,
}: EquipmentFilterProps) {
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserEquipment()
  }, [])

  const loadUserEquipment = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/equipment')
      const data = await response.json()
      setUserEquipment(data)
    } catch (error) {
      console.error('Failed to load user equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEquipment = (equipmentId: string) => {
    const newSelection = selectedEquipment.includes(equipmentId)
      ? selectedEquipment.filter(id => id !== equipmentId)
      : [...selectedEquipment, equipmentId]
    
    setSelectedEquipment(newSelection)
    onFilterChange(newSelection)
  }

  const equipmentByCategory = userEquipment.reduce((acc, item) => {
    const category = item.equipment.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<EquipmentCategory, UserEquipment[]>)

  if (loading) {
    return (
      <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-800 w-1/4"></div>
          <div className="h-8 bg-neutral-800"></div>
        </div>
      </div>
    )
  }

  if (userEquipment.length === 0) {
    return (
      <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <Package className="w-5 h-5" />
          <div>
            <p className="font-bold uppercase tracking-wider">No equipment added</p>
            <p className="text-sm">
              <a href="/inventory" className="text-amber-400 hover:text-amber-300">
                Add equipment
              </a>{' '}
              to filter exercises
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Available Only Toggle */}
      <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => onAvailableOnlyChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
          <div>
            <div className="font-black uppercase tracking-wider text-white">Show available exercises only</div>
            <div className="text-xs text-neutral-400">
              Filter to exercises you can do with your equipment
            </div>
          </div>
        </label>
      </div>

      {/* Equipment Selection */}
      <div className="p-4 bg-neutral-900 border-2 border-neutral-800">
        <h3 className="text-sm font-black uppercase tracking-wider text-neutral-400 mb-3">
          Filter by Equipment ({userEquipment.length} available)
        </h3>
        
        <div className="space-y-4">
          {Object.entries(equipmentByCategory).map(([category, items]) => (
            <div key={category}>
              <div className="text-xs font-black uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1">
                <span>{categoryIcons[category as EquipmentCategory]}</span>
                <span className="capitalize">{category.toLowerCase()}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((item) => (
                  <button
                    key={item.equipmentId}
                    onClick={() => toggleEquipment(item.equipmentId)}
                    className={`flex items-center gap-2 p-2 border-2 text-left transition-all ${
                      selectedEquipment.includes(item.equipmentId)
                        ? 'border-amber-700 bg-amber-950/20 text-amber-400'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedEquipment.includes(item.equipmentId)
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-neutral-700'
                    }`}>
                      {selectedEquipment.includes(item.equipmentId) && (
                        <Check className="w-3 h-3 text-amber-400" />
                      )}
                    </div>
                    <span className="text-sm truncate">{item.equipment.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedEquipment.length > 0 && (
          <button
            onClick={() => {
              setSelectedEquipment([])
              onFilterChange([])
            }}
            className="mt-3 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear equipment filters
          </button>
        )}
      </div>
    </div>
  )
}
