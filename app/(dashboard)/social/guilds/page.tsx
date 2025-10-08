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
        <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent uppercase tracking-wider">
          GUILDS
        </h1>
        
        {!myGuildData?.guild && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 font-black uppercase tracking-wider transition-colors border-2 border-amber-700"
          >
            CREATE GUILD
          </button>
        )}
      </div>

      {/* My Guild */}
      {myGuildData?.guild && (
        <div className="bg-gradient-to-br from-amber-600/10 to-amber-500/10 border-2 border-amber-700/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black uppercase tracking-wider text-amber-400">MY GUILD</h2>
            {myGuildData.role && (
              <span className="px-3 py-1 bg-amber-600/20 border-2 border-amber-700/30 text-amber-400 text-sm font-black uppercase tracking-wider">
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
                  <h3 className="text-3xl font-black uppercase tracking-wider text-white mb-1">
                    {myGuildData.guild.name}
                  </h3>
                  <p className="text-neutral-400">{myGuildData.guild.description}</p>
                </div>
              </div>

              {myGuildData.guild.requirements && (
                <div className="flex gap-4 text-sm text-neutral-400 uppercase tracking-wider font-bold">
                  {myGuildData.guild.requirements.minLevel > 1 && (
                    <div>MIN LEVEL: {myGuildData.guild.requirements.minLevel}</div>
                  )}
                  {myGuildData.guild.requirements.minWorkouts > 0 && (
                    <div>MIN WORKOUTS: {myGuildData.guild.requirements.minWorkouts}</div>
                  )}
                </div>
              )}
            </div>

            {/* Guild Stats */}
            <div className="space-y-3">
              <div className="p-4 bg-neutral-900/50">
                <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">MEMBERS</div>
                <div className="text-2xl font-black text-amber-400">
                  {myGuildData.guild.memberCount}
                </div>
              </div>
              <div className="p-4 bg-neutral-900/50">
                <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">GUILD LEVEL</div>
                <div className="text-2xl font-black text-amber-400">
                  {myGuildData.guild.level}
                </div>
              </div>
              <div className="p-4 bg-neutral-900/50">
                <div className="text-sm text-neutral-400 mb-1 uppercase tracking-wider font-bold">TOTAL PROGRESS</div>
                <div className="text-2xl font-black text-amber-400">
                  {(myGuildData.guild.totalXP / 1000).toFixed(1)}k
                </div>
              </div>
            </div>
          </div>

          {/* Guild Members */}
          {myGuildData.members && myGuildData.members.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">MEMBERS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {myGuildData.members.map((member: any) => (
                  <div
                    key={member.userId}
                    className="p-3 bg-neutral-900/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-600/20 flex items-center justify-center text-sm">
                        ⚔️
                      </div>
                      <div>
                        <div className="font-black uppercase tracking-wider text-white text-sm">
                          {member.userName}
                        </div>
                        <div className="text-xs text-neutral-400 uppercase tracking-wider font-bold">
                          LEVEL {member.level}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-amber-600/20 text-amber-400 font-black uppercase tracking-wider">
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
        <div className="bg-neutral-900/50 backdrop-blur-sm border-2 border-amber-700/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black uppercase tracking-wider text-amber-400">CREATE NEW GUILD</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateGuild} className="space-y-4">
            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-neutral-300 mb-2">
                GUILD NAME *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900/50 border-2 border-neutral-700 focus:outline-none focus:border-amber-500 text-white"
                placeholder="Enter guild name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-neutral-300 mb-2">
                DESCRIPTION *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900/50 border-2 border-neutral-700 focus:outline-none focus:border-amber-500 text-white"
                placeholder="Describe your guild..."
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-wider text-neutral-300 mb-2">
                GUILD ICON
              </label>
              <div className="grid grid-cols-10 gap-2">
                {GUILD_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`text-3xl p-2 transition-colors ${
                      formData.icon === icon
                        ? 'bg-amber-600/20 border-2 border-amber-700/50'
                        : 'bg-neutral-900/50 hover:bg-neutral-800'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-wider text-neutral-300 mb-2">
                  MINIMUM LEVEL
                </label>
                <input
                  type="number"
                  value={formData.minLevel}
                  onChange={(e) => setFormData({ ...formData, minLevel: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-neutral-900/50 border-2 border-neutral-700 focus:outline-none focus:border-amber-500 text-white"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-wider text-neutral-300 mb-2">
                  MINIMUM WORKOUTS
                </label>
                <input
                  type="number"
                  value={formData.minWorkouts}
                  onChange={(e) => setFormData({ ...formData, minWorkouts: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-neutral-900/50 border-2 border-neutral-700 focus:outline-none focus:border-amber-500 text-white"
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
              <label htmlFor="isPublic" className="text-sm text-neutral-300 uppercase tracking-wider font-bold">
                MAKE GUILD PUBLIC (VISIBLE TO EVERYONE)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-700 disabled:text-neutral-500 font-black uppercase tracking-wider transition-colors border-2 border-amber-700"
              >
                {creating ? 'CREATING...' : 'CREATE GUILD'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 font-black uppercase tracking-wider transition-colors border-2 border-neutral-800"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Public Guilds */}
      <div className="bg-neutral-900/50 backdrop-blur-sm border-2 border-amber-700/20 p-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-amber-400 mb-4">PUBLIC GUILDS</h2>

        {guildsLoading ? (
          <div className="text-neutral-400 text-center py-8 uppercase tracking-wider font-bold">LOADING GUILDS...</div>
        ) : !guildsData?.guilds?.length ? (
          <div className="text-neutral-400 text-center py-8">
            <div className="text-6xl mb-4">🏰</div>
            <p className="uppercase tracking-wider font-bold">NO PUBLIC GUILDS AVAILABLE YET. BE THE FIRST TO CREATE ONE!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guildsData.guilds.map((guild: any) => (
              <div
                key={guild.id}
                className="p-4 bg-neutral-900/50 hover:bg-neutral-900/70 transition-colors border-2 border-neutral-700/50"
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{guild.icon}</div>
                  <h3 className="font-black uppercase tracking-wider text-white mb-1">{guild.name}</h3>
                  <p className="text-sm text-neutral-400">{guild.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                  <div className="p-2 bg-neutral-800/50">
                    <div className="text-amber-400 font-black">{guild.memberCount}</div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">MEMBERS</div>
                  </div>
                  <div className="p-2 bg-neutral-800/50">
                    <div className="text-amber-400 font-black">{guild.level}</div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">LEVEL</div>
                  </div>
                  <div className="p-2 bg-neutral-800/50">
                    <div className="text-amber-400 font-black">
                      {(guild.totalXP / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold">PROGRESS</div>
                  </div>
                </div>

                {guild.requirements && (
                  <div className="text-xs text-neutral-500 mb-3 text-center uppercase tracking-wider font-bold">
                    {guild.requirements.minLevel > 1 && `MIN LV. ${guild.requirements.minLevel}`}
                    {guild.requirements.minLevel > 1 && guild.requirements.minWorkouts > 0 && ' • '}
                    {guild.requirements.minWorkouts > 0 && `${guild.requirements.minWorkouts} WORKOUTS`}
                  </div>
                )}

                <button
                  disabled={!!myGuildData?.guild}
                  className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-700 disabled:text-neutral-500 font-black uppercase tracking-wider transition-colors text-sm border-2 border-amber-700"
                >
                  {myGuildData?.guild ? 'ALREADY IN GUILD' : 'REQUEST TO JOIN'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
