'use client'

import { useFriends } from '@/hooks/use-data'
import { useState } from 'react'

export default function FriendsPage() {
  const { data, loading, refetch } = useFriends()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [sendingRequest, setSendingRequest] = useState<string | null>(null)
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setSearching(true)
    try {
      const response = await fetch(`/api/social?mode=search&query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error('Search failed')
      const result = await response.json()
      setSearchResults(result.users || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleSendRequest = async (toEmail: string) => {
    setSendingRequest(toEmail)
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-friend-request', toEmail })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send request')
      }

      alert('Friend request sent!')
      setSearchResults([])
      setSearchQuery('')
    } catch (error: any) {
      alert(error.message || 'Failed to send friend request')
    } finally {
      setSendingRequest(null)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    setAcceptingRequest(requestId)
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept-friend-request', requestId })
      })
      
      if (!response.ok) throw new Error('Failed to accept request')
      
      await refetch()
    } catch (error) {
      console.error('Accept request error:', error)
      alert('Failed to accept friend request')
    } finally {
      setAcceptingRequest(null)
    }
  }

  const handleRemoveFriend = async (friendUserId: string) => {
    if (!confirm('Are you sure you want to remove this friend?')) return

    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-friend', friendUserId })
      })
      
      if (!response.ok) throw new Error('Failed to remove friend')
      
      await refetch()
    } catch (error) {
      console.error('Remove friend error:', error)
      alert('Failed to remove friend')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Friends
      </h1>

      {/* Search Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">Find Friends</h2>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by name or email..."
            className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors font-semibold"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-400">Search Results</h3>
            {searchResults.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">⚔️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{user.userName}</div>
                    <div className="text-sm text-slate-400">
                      Level {user.level} {user.characterClass}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSendRequest(user.email)}
                  disabled={sendingRequest === user.email}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors text-sm font-semibold"
                >
                  {sendingRequest === user.email ? 'Sending...' : 'Add Friend'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {data?.pendingRequests && data.pendingRequests.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">
            Pending Requests ({data.pendingRequests.length})
          </h2>
          
          <div className="space-y-2">
            {data.pendingRequests.map((request: any) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{request.fromUserName}</div>
                    <div className="text-sm text-slate-400">
                      Level {request.fromUserLevel}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={acceptingRequest === request.id}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors text-sm font-semibold"
                  >
                    {acceptingRequest === request.id ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-purple-400 mb-4">
          My Friends {data?.friends ? `(${data.friends.length})` : ''}
        </h2>

        {loading ? (
          <div className="text-slate-400 text-center py-8">Loading friends...</div>
        ) : !data?.friends?.length ? (
          <div className="text-slate-400 text-center py-8">
            <div className="text-6xl mb-4">🤝</div>
            <p>No friends yet. Search above to find warriors to connect with!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.friends.map((friend: any) => (
              <div
                key={friend.userId}
                className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚔️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        {friend.userName}
                        {friend.isFavorite && <span className="text-yellow-400">⭐</span>}
                      </div>
                      <div className="text-sm text-slate-400">
                        Level {friend.level} {friend.characterClass}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.userId)}
                    className="text-slate-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-slate-800/50 rounded">
                    <div className="text-slate-400 text-xs">Workouts</div>
                    <div className="font-semibold text-purple-400">{friend.totalWorkouts}</div>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded">
                    <div className="text-slate-400 text-xs">Streak</div>
                    <div className="font-semibold text-orange-400">{friend.currentStreak} days</div>
                  </div>
                </div>

                {friend.lastActive && (
                  <div className="mt-2 text-xs text-slate-500">
                    Last active: {new Date(friend.lastActive).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
