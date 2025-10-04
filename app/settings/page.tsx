'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/toast'

export default function SettingsPage() {
  const [name, setName] = useState('Demo User')
  const [units, setUnits] = useState('kg')
  const [notifications, setNotifications] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [level, setLevel] = useState('intermediate')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          const prefs = typeof data.profile.preferences === 'string'
            ? JSON.parse(data.profile.preferences)
            : data.profile.preferences || {}
          
          setUnits(prefs.units || 'kg')
          setNotifications(prefs.notifications !== false)
          setTheme(prefs.theme || 'dark')
          setLevel(data.profile.level || 'intermediate')
        }
        setName(data.name || 'Demo User')
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          level,
          preferences: {
            units,
            notifications,
            theme,
          },
        }),
      })

      if (response.ok) {
        showToast('Settings saved successfully!', 'success')
      } else {
        showToast('Failed to save settings', 'error')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      showToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-astral-dark text-white">
      <header className="bg-astral-gray border-b border-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-gray-400 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                defaultValue="demo@astralforge.app"
                disabled
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Units</label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-astral-blue text-white"
              >
                <option value="dark">Dark Theme</option>
                <option value="light" disabled>Light Theme (Future Release)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                💡 Dark theme optimized for low-light training environments
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-400">Receive workout reminders</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-astral-blue' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Training Level */}
        <div className="bg-astral-gray border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Training Level</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input 
                type="radio" 
                name="level" 
                value="beginner" 
                checked={level === 'beginner'}
                onChange={(e) => setLevel(e.target.value)}
                className="mr-3" 
              />
              <div>
                <div className="font-medium">Beginner</div>
                <div className="text-sm text-gray-400">Less than 1 year of training</div>
              </div>
            </label>

            <label className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input 
                type="radio" 
                name="level" 
                value="intermediate" 
                checked={level === 'intermediate'}
                onChange={(e) => setLevel(e.target.value)}
                className="mr-3" 
              />
              <div>
                <div className="font-medium">Intermediate</div>
                <div className="text-sm text-gray-400">1-3 years of consistent training</div>
              </div>
            </label>

            <label className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input 
                type="radio" 
                name="level" 
                value="advanced" 
                checked={level === 'advanced'}
                onChange={(e) => setLevel(e.target.value)}
                className="mr-3" 
              />
              <div>
                <div className="font-medium">Advanced</div>
                <div className="text-sm text-gray-400">3+ years of consistent training</div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-astral-blue to-astral-purple rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button className="w-full py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900 transition-colors">
              Export All Data
            </button>
            <button className="w-full py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900 transition-colors">
              Delete All Workout History
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

