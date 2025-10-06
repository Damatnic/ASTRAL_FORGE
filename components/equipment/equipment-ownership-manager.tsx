'use client'

import { useState } from 'react'
import { EquipmentLocation, EquipmentItem, EquipmentOwnershipSummary } from '@/lib/equipment-ownership'
import { Package, Home, Building2, Plane, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react'

interface EquipmentOwnershipManagerProps {
  locations: EquipmentLocation
  summary: EquipmentOwnershipSummary
  onRemoveEquipment: (equipmentId: string, location: 'home' | 'gym' | 'travel') => Promise<void>
  onUpdateQuantity: (equipmentId: string, location: 'home' | 'gym' | 'travel', quantity: number) => Promise<void>
}

export function EquipmentOwnershipManager({
  locations,
  summary,
  onRemoveEquipment,
  onUpdateQuantity,
}: EquipmentOwnershipManagerProps) {
  const [selectedLocation, setSelectedLocation] = useState<'home' | 'gym' | 'travel'>('home')

  const locationConfig = {
    home: { icon: Home, label: 'Home Gym', color: 'blue', count: summary.byLocation.home },
    gym: { icon: Building2, label: 'Commercial Gym', color: 'purple', count: summary.byLocation.gym },
    travel: { icon: Plane, label: 'Travel', color: 'green', count: summary.byLocation.travel },
  }

  const currentLocation = locations[selectedLocation]

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Total Equipment</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{summary.totalItems}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Available Exercises</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">{summary.availableExercises}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Home</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400">{summary.byLocation.home}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold">Gym</h3>
          </div>
          <p className="text-3xl font-bold text-cyan-400">{summary.byLocation.gym}</p>
        </div>
      </div>

      {/* Recommendations */}
      {summary.missingRecommendations.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-400 mb-2">💡 Recommended Equipment</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {summary.missingRecommendations.map((rec, i) => (
              <li key={i}>• {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Location Selector */}
      <div className="flex gap-2">
        {Object.entries(locationConfig).map(([key, config]) => {
          const isActive = selectedLocation === key
          const Icon = config.icon
          
          return (
            <button
              key={key}
              onClick={() => setSelectedLocation(key as typeof selectedLocation)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? `border-${config.color}-500 bg-${config.color}-500/20`
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${isActive ? `text-${config.color}-400` : 'text-gray-400'}`} />
                <span className={`font-semibold ${isActive ? `text-${config.color}-400` : 'text-gray-400'}`}>
                  {config.label}
                </span>
              </div>
              <p className={`text-2xl font-bold ${isActive ? `text-${config.color}-400` : 'text-gray-500'}`}>
                {config.count}
              </p>
            </button>
          )
        })}
      </div>

      {/* Equipment List */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="w-5 h-5" />
            {locationConfig[selectedLocation].label} Equipment ({currentLocation.length})
          </h3>
        </div>

        <div className="p-4">
          {currentLocation.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No equipment at this location</p>
              <p className="text-sm mt-1">Add equipment to start tracking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentLocation.map((item) => (
                <EquipmentCard
                  key={`${item.id}-${item.location}`}
                  item={item}
                  location={selectedLocation}
                  onRemove={() => onRemoveEquipment(item.id, selectedLocation)}
                  onUpdateQuantity={(newQty) => onUpdateQuantity(item.id, selectedLocation, newQty)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface EquipmentCardProps {
  item: EquipmentItem
  location: 'home' | 'gym' | 'travel'
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

function EquipmentCard({ item, location, onRemove, onUpdateQuantity }: EquipmentCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleIncrease = async () => {
    setIsUpdating(true)
    await onUpdateQuantity(item.quantity + 1)
    setIsUpdating(false)
  }

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      setIsUpdating(true)
      await onUpdateQuantity(item.quantity - 1)
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (confirm(`Remove ${item.name} from ${location}?`)) {
      setIsUpdating(true)
      await onRemove()
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
          <span className="px-2 py-0.5 bg-gray-600/50 rounded text-xs">{item.category}</span>
          {item.notes && <span>• {item.notes}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={isUpdating || item.quantity <= 1}
            className="p-1.5 rounded bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-12 text-center font-semibold">{item.quantity}</span>
          
          <button
            onClick={handleIncrease}
            disabled={isUpdating}
            className="p-1.5 rounded bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="p-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Remove equipment"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
