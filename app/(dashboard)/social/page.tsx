'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ActivityFeed } from '@/components/social/activity-feed'
import { ActivityFilters } from '@/components/social/activity-filters'
import { FriendList } from '@/components/social/friend-list'
import { FriendSearch } from '@/components/social/friend-search'
import { FriendRequests } from '@/components/social/friend-requests'

export default function SocialHubPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'requests'>('feed')
  const [activityFilter, setActivityFilter] = useState<'all' | 'friends' | 'personal'>('friends')
  const [activityType, setActivityType] = useState<'all' | 'WORKOUT_COMPLETED' | 'PR_ACHIEVED' | 'CHALLENGE_JOINED' | 'CHALLENGE_COMPLETED' | 'STREAK_MILESTONE' | 'GOAL_ACHIEVED' | 'PROGRAM_COMPLETED'>('all')
  const [friends, setFriends] = useState<never[]>([])
  const [requests, setRequests] = useState<never[]>([])
  const [isLoadingFriends, setIsLoadingFriends] = useState(false)
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [stats, setStats] = useState({
    totalFriends: 0,
    pendingRequests: 0,
    recentActivities: 0
  })

  // Load friends
  const loadFriends = async () => {
    if (!session?.user?.id) return
    setIsLoadingFriends(true)
    try {
      const response = await fetch('/api/friends')
      if (response.ok) {
        const data = await response.json()
        setFriends(data)
        setStats(prev => ({ ...prev, totalFriends: data.length }))
      }
    } catch (error) {
      console.error('Failed to load friends:', error)
    } finally {
      setIsLoadingFriends(false)
    }
  }

  // Load friend requests
  const loadRequests = async () => {
    if (!session?.user?.id) return
    setIsLoadingRequests(true)
    try {
      const response = await fetch('/api/friends/requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
        setStats(prev => ({ ...prev, pendingRequests: data.length }))
      }
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setIsLoadingRequests(false)
    }
  }

  // Load data when tab changes
  useEffect(() => {
    if (session?.user?.id) {
      if (activeTab === 'friends') {
        loadFriends()
      } else if (activeTab === 'requests') {
        loadRequests()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, activeTab])

  // Send friend request
  const handleSendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: userId }),
      })
      if (response.ok) {
        // Reload requests to update UI
        loadRequests()
      }
    } catch (error) {
      console.error('Failed to send friend request:', error)
    }
  }

  // Accept friend request
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/requests/${requestId}/accept`, {
        method: 'POST',
      })
      if (response.ok) {
        loadRequests()
        loadFriends()
      }
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  // Decline friend request
  const handleDeclineRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/requests/${requestId}/decline`, {
        method: 'POST',
      })
      if (response.ok) {
        loadRequests()
      }
    } catch (error) {
      console.error('Failed to decline request:', error)
    }
  }

  // Unfriend
  const handleUnfriend = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        loadFriends()
      }
    } catch (error) {
      console.error('Failed to unfriend:', error)
    }
  }

  // React to activity
  const handleReact = async (activityId: string, type: 'LIKE' | 'CELEBRATE' | 'STRONG' | 'FIRE') => {
    try {
      await fetch(`/api/activity/${activityId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
    } catch (error) {
      console.error('Failed to react:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Social Hub
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Friends</div>
          <div className="text-3xl font-bold text-purple-400">{stats.totalFriends}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Pending Requests</div>
          <div className="text-3xl font-bold text-yellow-400">{stats.pendingRequests}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Recent Activities</div>
          <div className="text-3xl font-bold text-blue-400">{stats.recentActivities}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'feed'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Activity Feed
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'friends'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Friends ({stats.totalFriends})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'requests'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Requests
          {stats.pendingRequests > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              {stats.pendingRequests}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'feed' && (
            <div className="space-y-6">
              <ActivityFilters
                selectedFilter={activityFilter}
                selectedType={activityType}
                onFilterChange={setActivityFilter}
                onTypeChange={setActivityType}
              />
              <ActivityFeed
                currentUserId={session?.user?.id || ''}
                filterType={activityFilter}
                onReact={handleReact}
              />
            </div>
          )}

          {activeTab === 'friends' && (
            <FriendList
              friends={friends}
              onUnfriend={handleUnfriend}
              isLoading={isLoadingFriends}
            />
          )}

          {activeTab === 'requests' && (
            <FriendRequests
              requests={requests}
              currentUserId={session?.user?.id || ''}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
              isLoading={isLoadingRequests}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Friend Search */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Find Friends</h3>
              <FriendSearch onSendRequest={handleSendFriendRequest} />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="/challenges"
                  className="block p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors text-sm"
                >
                  <div className="font-semibold text-white">🏆 Browse Challenges</div>
                  <div className="text-slate-400 text-xs">Compete with friends</div>
                </a>
                <a
                  href="/leaderboards"
                  className="block p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors text-sm"
                >
                  <div className="font-semibold text-white">📊 Leaderboards</div>
                  <div className="text-slate-400 text-xs">See top rankings</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
