'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Dumbbell, 
  Home,
  Building2,
  Plane,
  Plus,
  Search,
  Trash2,
  Edit,
  Package
} from 'lucide-react'
import { AppLayout, PageContainer } from '@/components/layout'
import { EquipmentCategory } from '@prisma/client'

interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  description?: string
  weight?: number
  isWeighted: boolean
}

interface UserEquipment {
  userId: string
  equipmentId: string
  location: string
  quantity: number
  notes?: string
  equipment: Equipment
}

const locationConfig = {
  default: { icon: Package, label: 'General', color: 'blue' },
  home: { icon: Home, label: 'Home Gym', color: 'green' },
  gym: { icon: Building2, label: 'Commercial Gym', color: 'purple' },
  travel: { icon: Plane, label: 'Travel', color: 'orange' },
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

export default function InventoryPage() {
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([])
  const [location, setLocation] = useState('default')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'ALL'>('ALL')

  const loadEquipment = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/equipment?location=${location}`)
      const data = await response.json()
      setUserEquipment(data)
    } catch (error) {
      console.error('Failed to load equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEquipment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const filteredEquipment = userEquipment.filter(item => {
    const matchesSearch = item.equipment.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || item.equipment.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const equipmentByCategory = filteredEquipment.reduce((acc, item) => {
    const category = item.equipment.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, UserEquipment[]>)

  const totalItems = userEquipment.length

  return (
    <AppLayout>
      <PageContainer>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Arsenal Inventory</h1>
              <p className="text-neutral-400 font-medium">Manage your weapons of war</p>
            </div>
            <Link
              href="/settings/equipment"
              className="px-4 py-2 bg-amber-950/50 border-2 border-amber-700 hover:bg-amber-900/50 font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 text-amber-400 hover:text-amber-300"
            >
              <Plus className="w-4 h-4" />
              Manage Arsenal
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(locationConfig).map(([key, config]) => {
              const Icon = config.icon
              const count = userEquipment.filter(e => e.location === key).length
              return (
                <div
                  key={key}
                  onClick={() => setLocation(key)}
                  className={`p-4 bg-neutral-900 border-2 cursor-pointer transition-all ${
                    location === key
                      ? `border-amber-700 bg-amber-950/50`
                      : 'border-neutral-800 hover:border-amber-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${location === key ? 'text-amber-400' : 'text-neutral-400'}`} />
                    <span className="text-sm font-bold uppercase tracking-wider">{config.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${location === key ? 'text-amber-400' : 'text-neutral-300'}`}>{count}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search arsenal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-800 focus:outline-none focus:border-amber-700 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 border-2 font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
              }`}
            >
              All ({totalItems})
            </button>
            {Object.values(EquipmentCategory).map(category => {
              const count = userEquipment.filter(e => e.equipment.category === category).length
              if (count === 0) return null
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 border-2 font-bold tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-amber-950/50 border-amber-700 text-amber-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-700'
                  }`}
                >
                  <span>{categoryIcons[category]}</span>
                  <span className="capitalize">{category.toLowerCase()}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-900 border-2 border-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-16">
            <Dumbbell className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">No Arsenal Found</h3>
            <p className="text-neutral-400 mb-6">
              {userEquipment.length === 0
                ? 'Start by adding weapons to your arsenal'
                : 'Try adjusting your search or filters'}
            </p>
            {userEquipment.length === 0 && (
              <Link
                href="/settings/equipment"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-950/50 border-2 border-amber-700 hover:bg-amber-900/50 font-bold uppercase tracking-wider transition-all duration-200 text-amber-400"
              >
                <Plus className="w-5 h-5" />
                Add Equipment
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(equipmentByCategory).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-amber-400">
                  <span className="text-2xl">{categoryIcons[category as EquipmentCategory]}</span>
                  <span className="capitalize">{category.toLowerCase()}</span>
                  <span className="text-sm text-neutral-500">({items.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div
                      key={`${item.equipmentId}-${item.location}`}
                      className="group p-4 bg-neutral-900 border-2 border-neutral-800 hover:border-amber-700 transition-all hover:shadow-lg hover:shadow-amber-700/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold uppercase tracking-wide text-sm mb-1 text-amber-100 group-hover:text-amber-400 transition-colors">{item.equipment.name}</h3>
                          {item.equipment.description && (
                            <p className="text-xs text-neutral-500 line-clamp-2">{item.equipment.description}</p>
                          )}
                        </div>
                        <span className="text-2xl flex-shrink-0 ml-2">
                          {categoryIcons[item.equipment.category]}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          {item.equipment.isWeighted && item.equipment.weight && (
                            <span className="px-2 py-1 bg-amber-950/50 border border-amber-800/50 text-amber-400 uppercase tracking-wider font-bold">
                              {item.equipment.weight}kg
                            </span>
                          )}
                          {item.quantity > 1 && (
                            <span className="px-2 py-1 bg-neutral-950 border border-neutral-800 text-neutral-400 uppercase tracking-wider font-bold">
                              ×{item.quantity}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100">
                            <Edit className="w-3.5 h-3.5 text-neutral-400" />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </AppLayout>
  )
}
