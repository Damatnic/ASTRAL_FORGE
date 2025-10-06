'use client'

import { useGuilds, useMyGuild } from '@/hooks/use-data'
import { useState } from 'react'

const GUILD_ICONS = ['🏰', '⚔️', '🛡️', '👑', '🔱', '⚡', '🌟', '🔥', '💎', '🦁']

export default function GuildsPage() {
  const { data: guildsData, loading: guildsLoading } = useGuilds()
  const { data: myGuildData, loading: myGuildLoading, refetch: refetchMyGuild } = useMyGuild()
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏰',
    isPublic: true,
    minLevel: 1,
    minWorkouts: 0,
  })

  const handleCreateGuild = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-guild',
          ...formData
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create guild')
      }

      alert('Guild created successfully!')
      setShowCreateForm(false)
      setFormData({
        name: '',
        description: '',
        icon: '🏰',
        isPublic: true,
        minLevel: 1,
        minWorkouts: 0,
      })
      await refetchMyGuild()
    } catch (error: any) {
      alert(error.message || 'Failed to create guild')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Guilds
        </h1>
        
        {!myGuildData?.guild && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
          >
            Create Guild
          </button>
        )}
      </div>

      {/* My Guild */}
      {myGuildData?.guild && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-400">My Guild</h2>
            {myGuildData.role && (
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-semibold">
                {myGuildData.role.charAt(0).toUpperCase() + myGuildData.role.slice(1)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guild Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{myGuildData.guild.icon}</div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {myGuildData.guild.name}
                  </h3>
                  <p className="text-slate-400">{myGuildData.guild.description}</p>
                </div>
              </div>

              {myGuildData.guild.requirements && (
                <div className="flex gap-4 text-sm text-slate-400">
                  {myGuildData.guild.requirements.minLevel > 1 && (
                    <div>Min Level: {myGuildData.guild.requirements.minLevel}</div>
                  )}
                  {myGuildData.guild.requirements.minWorkouts > 0 && (
                    <div>Min Workouts: {myGuildData.guild.requirements.minWorkouts}</div>
                  )}
                </div>
              )}
            </div>

            {/* Guild Stats */}
            <div className="space-y-3">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Members</div>
                <div className="text-2xl font-bold text-blue-400">
                  {myGuildData.guild.memberCount}
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Guild Level</div>
                <div className="text-2xl font-bold text-purple-400">
                  {myGuildData.guild.level}
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <div className="text-sm text-slate-400 mb-1">Total Progress</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {(myGuildData.guild.totalXP / 1000).toFixed(1)}k
                </div>
              </div>
            </div>
          </div>

          {/* Guild Members */}
          {myGuildData.members && myGuildData.members.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-3">Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {myGuildData.members.map((member: any) => (
                  <div
                    key={member.userId}
                    className="p-3 bg-slate-900/50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm">
                        ⚔️
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {member.userName}
                        </div>
                        <div className="text-xs text-slate-400">
                          Level {member.level}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-400">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Guild Form */}
      {showCreateForm && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-400">Create New Guild</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateGuild} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Guild Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Enter guild name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Describe your guild..."
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Guild Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {GUILD_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`text-3xl p-2 rounded-lg transition-colors ${
                      formData.icon === icon
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'bg-slate-900/50 hover:bg-slate-800'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Minimum Level
                </label>
                <input
                  type="number"
                  value={formData.minLevel}
                  onChange={(e) => setFormData({ ...formData, minLevel: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Minimum Workouts
                </label>
                <input
                  type="number"
                  value={formData.minWorkouts}
                  onChange={(e) => setFormData({ ...formData, minWorkouts: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-300">
                Make guild public (visible to everyone)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg font-semibold transition-colors"
              >
                {creating ? 'Creating...' : 'Create Guild'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Public Guilds */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Public Guilds</h2>

        {guildsLoading ? (
          <div className="text-slate-400 text-center py-8">Loading guilds...</div>
        ) : !guildsData?.guilds?.length ? (
          <div className="text-slate-400 text-center py-8">
            <div className="text-6xl mb-4">🏰</div>
            <p>No public guilds available yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guildsData.guilds.map((guild: any) => (
              <div
                key={guild.id}
                className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors border border-slate-700/50"
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{guild.icon}</div>
                  <h3 className="font-bold text-white mb-1">{guild.name}</h3>
                  <p className="text-sm text-slate-400">{guild.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                  <div className="p-2 bg-slate-800/50 rounded">
                    <div className="text-blue-400 font-bold">{guild.memberCount}</div>
                    <div className="text-xs text-slate-500">Members</div>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded">
                    <div className="text-purple-400 font-bold">{guild.level}</div>
                    <div className="text-xs text-slate-500">Level</div>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded">
                    <div className="text-yellow-400 font-bold">
                      {(guild.totalXP / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-slate-500">Progress</div>
                  </div>
                </div>

                {guild.requirements && (
                  <div className="text-xs text-slate-500 mb-3 text-center">
                    {guild.requirements.minLevel > 1 && `Min Lv. ${guild.requirements.minLevel}`}
                    {guild.requirements.minLevel > 1 && guild.requirements.minWorkouts > 0 && ' • '}
                    {guild.requirements.minWorkouts > 0 && `${guild.requirements.minWorkouts} workouts`}
                  </div>
                )}

                <button
                  disabled={!!myGuildData?.guild}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg font-semibold transition-colors text-sm"
                >
                  {myGuildData?.guild ? 'Already in Guild' : 'Request to Join'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
