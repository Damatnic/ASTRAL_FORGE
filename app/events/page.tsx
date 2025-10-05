'use client';

import { useState } from 'react';
import { Calendar, Trophy, Gift, Target, TrendingUp, Users } from 'lucide-react';
import SeasonalEventCard, { SeasonalEvent } from '@/components/seasonal-event-card';
import EventLeaderboard, { LeaderboardEntry, LeaderboardPeriod } from '@/components/event-leaderboard';
import EventQuestBoard, { EventQuest } from '@/components/event-quest-board';
import EventRewardsShowcase, { EventReward } from '@/components/event-rewards-showcase';

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'leaderboard' | 'rewards'>('overview');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('overall');

  // Mock Data - Seasonal Events
  const mockEvents: SeasonalEvent[] = [
    {
      id: 'summer-shred-2025',
      name: 'Summer Shred Challenge',
      theme: 'summer',
      description: 'Get lean and mean with cardio-focused challenges and conditioning quests. Show off your summer gains!',
      status: 'active',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-08-31'),
      banner: '',
      questCount: 15,
      participantCount: 3847,
      exclusiveRewards: ['Summer Shredder Title', 'Beach Body Aura', 'Sun King Crown'],
      xpMultiplier: 1.5,
      completionPercentage: 67,
    },
    {
      id: 'fall-bulk-2025',
      name: 'Fall Mass Building',
      theme: 'fall',
      description: 'Pack on muscle mass with heavy compound lifts and volume-focused training. Time to grow!',
      status: 'upcoming',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-11-30'),
      banner: '',
      questCount: 18,
      participantCount: 0,
      exclusiveRewards: ['Mass Monster Title', 'Autumn Warrior Armor', 'Harvest King Border'],
      xpMultiplier: 1.75,
    },
    {
      id: 'holiday-bulk-2025',
      name: 'Holiday Bulk Bonanza',
      theme: 'winter',
      description: 'Embrace the gains season! Focus on strength and power during the holidays. Get strong, get festive!',
      status: 'upcoming',
      startDate: new Date('2025-11-15'),
      endDate: new Date('2026-01-15'),
      banner: '',
      questCount: 20,
      participantCount: 0,
      exclusiveRewards: ['Winter Warrior Title', 'Snowflake Aura', 'Holiday Champion Crown'],
      xpMultiplier: 2.0,
    },
    {
      id: 'new-year-resolution-2026',
      name: 'New Year Resolution',
      theme: 'newyear',
      description: 'Start 2026 strong with hypertrophy programs and consistent training habits. New year, new gains!',
      status: 'upcoming',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      banner: '',
      questCount: 12,
      participantCount: 0,
      exclusiveRewards: ['Resolution Keeper Title', 'New Year Sparkles', 'Fresh Start Badge'],
      xpMultiplier: 2.5,
    },
  ];

  // Mock Data - Event Quests
  const mockQuests: EventQuest[] = [
    {
      id: 'quest-1',
      name: 'Cardio Crusher',
      description: 'Complete 30 minutes of cardio in a single session',
      type: 'individual',
      difficulty: 'easy',
      status: 'in-progress',
      progress: 75,
      target: 30,
      current: 22,
      unit: 'minutes',
      xpReward: 500,
      bonusRewards: ['Sprint Master Badge'],
      timeRemaining: '5d 12h',
    },
    {
      id: 'quest-2',
      name: 'Summer Sprint Series',
      description: 'Complete 5 HIIT workouts during the event',
      type: 'individual',
      difficulty: 'medium',
      status: 'in-progress',
      progress: 60,
      target: 5,
      current: 3,
      unit: 'workouts',
      xpReward: 1000,
      bonusRewards: ['HIIT Hero Title', '2x XP Boost (1 day)'],
      timeRemaining: '12d 8h',
    },
    {
      id: 'quest-3',
      name: 'Community Calorie Burn',
      description: 'Burn 1 million calories as a community',
      type: 'community',
      difficulty: 'hard',
      status: 'available',
      progress: 42,
      target: 1000000,
      current: 420000,
      unit: 'calories',
      xpReward: 2000,
      bonusRewards: ['Beach Body Aura', 'Community Champion Badge'],
      timeRemaining: '20d 14h',
      participants: 3847,
    },
    {
      id: 'quest-4',
      name: 'Ultimate Shred Challenge',
      description: 'Complete all summer event quests',
      type: 'individual',
      difficulty: 'extreme',
      status: 'locked',
      progress: 0,
      target: 14,
      current: 0,
      unit: 'quests',
      xpReward: 5000,
      bonusRewards: ['Summer Shredder Title', 'Sun King Crown', '5x XP Boost (3 days)'],
      unlockRequirement: 'Complete 10 other event quests',
    },
    {
      id: 'quest-5',
      name: 'Core Conditioning',
      description: 'Complete 100 ab exercises during the event',
      type: 'individual',
      difficulty: 'medium',
      status: 'available',
      progress: 0,
      target: 100,
      current: 0,
      unit: 'exercises',
      xpReward: 750,
      bonusRewards: ['Six Pack Badge'],
      timeRemaining: '25d 6h',
    },
    {
      id: 'quest-6',
      name: 'Perfect Week',
      description: 'Train 7 consecutive days without missing',
      type: 'individual',
      difficulty: 'hard',
      status: 'completed',
      progress: 100,
      target: 7,
      current: 7,
      unit: 'days',
      xpReward: 1500,
      bonusRewards: ['Consistency King Title', 'Streak Freeze (1)'],
    },
  ];

  // Mock Data - Event Leaderboard
  const mockLeaderboardEntries: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user-1',
      username: 'GymWarrior',
      score: 15420,
      change: 2,
      guild: 'Iron Legion',
      title: 'Summer Shredder',
    },
    {
      rank: 2,
      userId: 'user-2',
      username: 'CardioKing',
      score: 14890,
      change: -1,
      guild: 'Cardio Crew',
      title: 'Sprint Master',
    },
    {
      rank: 3,
      userId: 'user-3',
      username: 'FitnessBeast',
      score: 13750,
      change: 1,
      guild: 'Beast Mode',
      title: 'HIIT Hero',
    },
    {
      rank: 4,
      userId: 'current-user',
      username: 'You',
      score: 12340,
      change: 5,
      guild: 'Astral Warriors',
      title: 'Rising Star',
      isCurrentUser: true,
    },
    {
      rank: 5,
      userId: 'user-5',
      username: 'LeanMachine',
      score: 11920,
      change: -2,
      guild: 'Shred Squad',
    },
    {
      rank: 6,
      userId: 'user-6',
      username: 'SwoleBro',
      score: 10850,
      change: 0,
    },
    {
      rank: 7,
      userId: 'user-7',
      username: 'IronWill',
      score: 9760,
      change: 3,
      guild: 'Iron Legion',
    },
    {
      rank: 8,
      userId: 'user-8',
      username: 'GainzGoblin',
      score: 8920,
      change: -1,
    },
  ];

  // Mock Data - Event Rewards
  const mockRewards: EventReward[] = [
    {
      id: 'reward-1',
      name: 'Summer Shredder',
      description: 'Exclusive title for completing the Summer Shred Challenge',
      type: 'title',
      rarity: 'legendary',
      status: 'available',
      icon: '👑',
      requirement: 'Complete all event quests',
      progress: 67,
    },
    {
      id: 'reward-2',
      name: 'Sun King Crown',
      description: 'Radiant crown that glows with summer energy',
      type: 'cosmetic',
      rarity: 'legendary',
      status: 'locked',
      icon: '☀️',
      requirement: 'Reach #1 on leaderboard',
      progress: 0,
    },
    {
      id: 'reward-3',
      name: 'Beach Body Aura',
      description: 'Shimmering aura effect with wave particles',
      type: 'cosmetic',
      rarity: 'epic',
      status: 'available',
      icon: '🌊',
      requirement: 'Complete Community Calorie Burn quest',
      progress: 42,
    },
    {
      id: 'reward-4',
      name: 'Sprint Master',
      description: 'Achievement for cardio excellence',
      type: 'achievement',
      rarity: 'epic',
      status: 'claimed',
      icon: '⚡',
      claimedDate: new Date('2025-06-15'),
    },
    {
      id: 'reward-5',
      name: '5x XP Boost',
      description: 'Earn 5x XP for 3 days',
      type: 'xp-boost',
      rarity: 'rare',
      status: 'locked',
      icon: '✨',
      requirement: 'Complete Ultimate Shred Challenge',
      progress: 0,
    },
    {
      id: 'reward-6',
      name: 'Streak Freeze',
      description: 'Protect your streak for 1 day',
      type: 'item',
      rarity: 'rare',
      status: 'claimed',
      icon: '❄️',
      claimedDate: new Date('2025-06-20'),
    },
    {
      id: 'reward-7',
      name: 'Cardio Enthusiast',
      description: 'Badge for completing cardio challenges',
      type: 'achievement',
      rarity: 'common',
      status: 'claimed',
      icon: '🏃',
      claimedDate: new Date('2025-06-10'),
    },
    {
      id: 'reward-8',
      name: 'Summer Participant',
      description: 'Participated in Summer Shred Challenge',
      type: 'achievement',
      rarity: 'common',
      status: 'claimed',
      icon: '🏖️',
      claimedDate: new Date('2025-06-01'),
    },
  ];

  // Event handlers
  const handleEventClick = (eventId: string) => {
    setSelectedEvent(eventId);
    setActiveTab('overview');
  };

  const handleJoinEvent = (eventId: string) => {
    console.log('Joining event:', eventId);
    setSelectedEvent(eventId);
  };

  const handleQuestClick = (questId: string) => {
    console.log('Quest clicked:', questId);
  };

  const handleClaimReward = (rewardId: string) => {
    console.log('Claiming reward:', rewardId);
  };

  const handleLeaderboardPeriodChange = (period: LeaderboardPeriod) => {
    setLeaderboardPeriod(period);
    console.log('Leaderboard period changed:', period);
  };

  const currentEvent = mockEvents.find((e) => e.id === selectedEvent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10 text-purple-500" />
            Seasonal Events
          </h1>
          <p className="text-gray-300 text-lg">
            Limited-time challenges with exclusive rewards and epic competitions!
          </p>
        </div>

        {/* Overall Event Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-lg border border-green-500/30 p-4">
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Active Events</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {mockEvents.filter((e) => e.status === 'active' || e.status === 'ending-soon').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 rounded-lg border border-purple-500/30 p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Total Quests</span>
            </div>
            <div className="text-3xl font-bold text-white">{mockQuests.length}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/20 rounded-lg border border-orange-500/30 p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-medium">Rewards Available</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {mockRewards.filter((r) => r.status === 'available').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-lg border border-blue-500/30 p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Participants</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {mockEvents.reduce((sum, event) => sum + event.participantCount, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Event Selection View */}
        {!selectedEvent && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockEvents.map((event) => (
                <SeasonalEventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleEventClick}
                  onJoinEvent={handleJoinEvent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Event Detail View */}
        {selectedEvent && currentEvent && (
          <div className="space-y-6">
            {/* Back Button & Event Header */}
            <div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mb-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white touch-manipulation min-h-[44px] flex items-center"
              >
                ← Back to All Events
              </button>

              <SeasonalEventCard
                event={currentEvent}
                onViewDetails={handleEventClick}
                onJoinEvent={handleJoinEvent}
              />
            </div>

            {/* Event Navigation Tabs */}
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              {[
                { id: 'overview', label: 'Overview', icon: Calendar },
                { id: 'quests', label: 'Quests', icon: Target },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { id: 'rewards', label: 'Rewards', icon: Gift },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 px-4 py-3 rounded-md transition-colors font-medium flex items-center justify-center gap-2 touch-manipulation min-h-[44px] ${
                    activeTab === id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Event Overview</h3>
                  <p className="text-gray-300 mb-6">{currentEvent.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Quick Stats</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• {currentEvent.questCount} unique quests</li>
                        <li>• {currentEvent.exclusiveRewards.length} exclusive rewards</li>
                        <li>• {Math.round((currentEvent.xpMultiplier - 1) * 100)}% XP bonus</li>
                        <li>• {currentEvent.participantCount.toLocaleString()} active participants</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Event Duration</h4>
                      <p className="text-gray-300">
                        {currentEvent.startDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {currentEvent.endDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'quests' && (
                <EventQuestBoard
                  quests={mockQuests}
                  eventTheme={currentEvent.theme}
                  onQuestClick={handleQuestClick}
                  onClaimReward={handleClaimReward}
                />
              )}

              {activeTab === 'leaderboard' && (
                <EventLeaderboard
                  eventName={currentEvent.name}
                  entries={mockLeaderboardEntries}
                  period={leaderboardPeriod}
                  onPeriodChange={handleLeaderboardPeriodChange}
                  scoreLabel="Event Points"
                  showGuildColumn={true}
                />
              )}

              {activeTab === 'rewards' && (
                <EventRewardsShowcase
                  rewards={mockRewards}
                  eventName={currentEvent.name}
                  eventTheme={currentEvent.theme}
                  onClaimReward={handleClaimReward}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
