'use client'

import React, { useState } from 'react'
import { Plus, Minus, Save, AlertTriangle, CheckCircle2, Package, TrendingUp, Trash2 } from 'lucide-react'
import {
  PlateInventoryItem,
  plateSetPresets,
  calculatePlateLoading,
  getInventoryStats,
  suggestPlateUpgrades,
  getPlateColor,
} from '@/lib/plate-inventory'

interface PlateInventoryManagerProps {
  location?: 'home' | 'gym' | 'default'
  onSave?: (inventory: PlateInventoryItem[]) => void
  initialInventory?: PlateInventoryItem[]
}

export default function PlateInventoryManager({
  location = 'home',
  onSave,
  initialInventory,
}: PlateInventoryManagerProps) {
  const [inventory, setInventory] = useState<PlateInventoryItem[]>(
    initialInventory || plateSetPresets[0].plates
  )
  const [testWeight, setTestWeight] = useState<number>(100)
  const [testBarWeight, setTestBarWeight] = useState<number>(20)
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState(false)

  const stats = getInventoryStats(inventory)

  // Add a new plate weight
  const addPlateWeight = (weight: number) => {
    const existing = inventory.find(p => p.weight === weight)
    if (existing) {
      updatePlateQuantity(weight, existing.quantity + 2)
    } else {
      setInventory([
        ...inventory,
        { weight, quantity: 2, location, unit: 'kg' },
      ])
    }
  }

  // Update plate quantity
  const updatePlateQuantity = (weight: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setInventory(inventory.filter(p => p.weight !== weight))
    } else {
      setInventory(
        inventory.map(p => (p.weight === weight ? { ...p, quantity: newQuantity } : p))
      )
    }
  }

  // Load preset
  const loadPreset = (presetName: string) => {
    const preset = plateSetPresets.find(p => p.name === presetName)
    if (preset) {
      setInventory(preset.plates.map(p => ({ ...p, location })))
      setSelectedPreset(presetName)
    }
  }

  // Save inventory
  const handleSave = () => {
    if (onSave) {
      onSave(inventory)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  // Test loading capability
  const testResult = calculatePlateLoading(
    { weight: testWeight, barWeight: testBarWeight, unit: 'kg' },
    inventory
  )

  // Get upgrade suggestions
  const upgradeSuggestions = suggestPlateUpgrades(inventory, testWeight * 1.5)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Package className="w-4 h-4" />
            <span>Total Plates</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalPlates}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Total Weight</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalWeight}kg</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Max Per Side</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.maxLoadablePerSide}kg</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Package className="w-4 h-4" />
            <span>Smallest Inc.</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.smallestIncrement}kg</div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Load Preset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {plateSetPresets.map(preset => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset.name)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedPreset === preset.name
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <div className="font-semibold text-white text-sm mb-1">{preset.name}</div>
              <div className="text-xs text-gray-400">{preset.description}</div>
              <div className="text-xs text-purple-400 mt-1">{preset.totalWeight}kg total</div>
            </button>
          ))}
        </div>
      </div>

      {/* Plate Inventory List */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Plate Inventory</h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Inventory
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-lg flex items-center gap-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span>Inventory saved successfully!</span>
          </div>
        )}

        <div className="space-y-2">
          {inventory
            .sort((a, b) => b.weight - a.weight)
            .map(plate => (
              <div
                key={plate.weight}
                className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg"
              >
                {/* Plate Color Indicator */}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      getPlateColor(plate.weight) === 'Red'
                        ? '#ef4444'
                        : getPlateColor(plate.weight) === 'Blue'
                        ? '#3b82f6'
                        : getPlateColor(plate.weight) === 'Yellow'
                        ? '#eab308'
                        : getPlateColor(plate.weight) === 'Green'
                        ? '#22c55e'
                        : getPlateColor(plate.weight) === 'White'
                        ? '#f3f4f6'
                        : '#6b7280',
                  }}
                />

                {/* Weight Label */}
                <div className="flex-1">
                  <div className="font-semibold text-white">{plate.weight}kg</div>
                  <div className="text-xs text-gray-400">{getPlateColor(plate.weight)}</div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePlateQuantity(plate.weight, plate.quantity - 2)}
                    className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    disabled={plate.quantity <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono text-white">{plate.quantity}</span>
                  <button
                    onClick={() => updatePlateQuantity(plate.weight, plate.quantity + 2)}
                    className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updatePlateQuantity(plate.weight, 0)}
                    className="p-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors ml-2"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Total Weight for This Plate */}
                <div className="text-sm text-gray-400 w-20 text-right">
                  {plate.weight * plate.quantity}kg
                </div>
              </div>
            ))}
        </div>

        {/* Add Custom Plate Weight */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">Add custom plate weight:</div>
          <div className="flex gap-2 flex-wrap">
            {[0.5, 1.25, 2.5, 5, 10, 15, 20, 25].map(weight => (
              <button
                key={weight}
                onClick={() => addPlateWeight(weight)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
                disabled={inventory.some(p => p.weight === weight)}
              >
                {weight}kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Test */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Test Loading Capability</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Target Weight (kg)</label>
            <input
              type="number"
              value={testWeight}
              onChange={e => setTestWeight(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              step="2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Bar Weight (kg)</label>
            <input
              type="number"
              value={testBarWeight}
              onChange={e => setTestBarWeight(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              step="5"
            />
          </div>
        </div>

        {/* Test Result */}
        <div
          className={`p-4 rounded-lg border-2 ${
            testResult.canLoad
              ? 'bg-green-900/20 border-green-500'
              : 'bg-red-900/20 border-red-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {testResult.canLoad ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-green-400">Can Load {testWeight}kg</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-red-400">Cannot Load {testWeight}kg</span>
              </>
            )}
          </div>

          {testResult.platesPerSide.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-400 mb-2">Plates per side:</div>
              <div className="flex gap-2 flex-wrap">
                {testResult.platesPerSide.map((plate, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-gray-900 rounded text-sm"
                  >
                    {plate.quantity}x {plate.weight}kg
                  </div>
                ))}
              </div>
            </div>
          )}

          {testResult.warnings && testResult.warnings.length > 0 && (
            <div className="text-sm text-yellow-400">
              {testResult.warnings.map((warning, i) => (
                <div key={i}>{warning}</div>
              ))}
            </div>
          )}

          {testResult.missingPlates && testResult.missingPlates.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Suggested purchases:</div>
              {testResult.missingPlates.map((plate, i) => (
                <div key={i} className="text-sm text-purple-400">
                  Add {plate.quantity}x {plate.weight}kg plates
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Suggestions */}
      {upgradeSuggestions.suggestedPlates.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Upgrade Recommendations</h3>
          <p className="text-gray-400 text-sm mb-4">{upgradeSuggestions.recommendation}</p>
          
          <div className="space-y-2">
            {upgradeSuggestions.suggestedPlates.map((plate, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-white">
                    {plate.quantity}x {plate.weight}kg plates
                  </div>
                  <div className="text-sm text-gray-400">
                    Estimated cost: {plate.cost}
                  </div>
                </div>
                <button
                  onClick={() => addPlateWeight(plate.weight)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm"
                >
                  Add to Inventory
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
