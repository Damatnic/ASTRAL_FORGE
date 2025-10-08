'use client'

/**
 * Equipment Settings Page
 * Manage available equipment for workouts
 */

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Save, Check } from 'lucide-react'
import { ChartSkeleton } from '@/components/chart-skeleton'

const EquipmentSelector = dynamic(
  () => import('@/components/equipment/equipment-selector').then(mod => ({ default: mod.EquipmentSelector })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
)

export default function EquipmentSettingsPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [location, setLocation] = useState('default')
  const [locations, setLocations] = useState(['default', 'home', 'gym'])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadUserEquipment()
  }, [location])

  const loadUserEquipment = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/equipment?location=${location}`)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        const equipmentNames = data.map(item => item.equipment.name)
        setSelectedEquipment(equipmentNames)
      }
    } catch (error) {
      console.error('Failed to load equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaved(false)

      const response = await fetch('/api/user/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipmentNames: selectedEquipment,
          location,
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save equipment:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      {/* Header */}
      <header className="bg-astral-gray border-b border-astral-light p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/settings"
              className="p-2 hover:bg-astral-light rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Equipment Settings</h1>
              <p className="text-sm text-gray-400">
                Select the equipment you have access to
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Location Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-400 uppercase mb-2">
            Equipment Location
          </label>
          <div className="flex items-center gap-2">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2 bg-astral-gray border border-astral-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-astral-blue"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Equipment
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Manage equipment for different locations (home gym, commercial gym, etc.)
          </p>
        </div>

        {/* Equipment Selector */}
        {loading ? (
          <div className="bg-astral-gray rounded-xl border border-astral-light p-12 text-center">
            <div className="text-gray-400">Loading equipment...</div>
          </div>
        ) : (
          <EquipmentSelector
            selectedEquipment={selectedEquipment}
            onSelectionChange={setSelectedEquipment}
            location={location}
          />
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-astral-gray rounded-lg border border-astral-light p-4">
            <div className="text-2xl font-bold text-astral-blue mb-1">
              {selectedEquipment.length}
            </div>
            <div className="text-sm text-gray-400">Equipment Selected</div>
          </div>
          <div className="bg-astral-gray rounded-lg border border-astral-light p-4">
            <div className="text-2xl font-bold text-astral-purple mb-1">
              🏋️
            </div>
            <div className="text-sm text-gray-400">
              Exercises will be filtered by your equipment
            </div>
          </div>
          <div className="bg-astral-gray rounded-lg border border-astral-light p-4">
            <div className="text-2xl font-bold text-astral-blue mb-1">
              ⚡
            </div>
            <div className="text-sm text-gray-400">
              Get personalized workout recommendations
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-amber-500/10 border-2 border-amber-500/30 p-4">
          <h3 className="font-black uppercase tracking-wider text-amber-400 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-neutral-300 space-y-1 uppercase tracking-wider font-bold">
            <li>• Use presets for quick setup (Home Gym, Commercial Gym, etc.)</li>
            <li>• Create multiple locations if you train at different gyms</li>
            <li>• Exercises will automatically filter based on your equipment</li>
            <li>• Update your equipment as you acquire new items</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
