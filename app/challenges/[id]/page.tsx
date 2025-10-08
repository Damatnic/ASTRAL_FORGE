'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Trophy, Users, Calendar, Target, TrendingUp, Loader2, ArrowLeft } from 'lucide-react';
import { ChallengeLeaderboard } from '@/components/challenges';
import { formatDistanceToNow } from 'date-fns';

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'VOLUME' | 'CONSISTENCY' | 'PR' | 'DISTANCE' | 'TIME' | 'WEIGHT';
  unit: string;
  targetValue: number;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  creatorId: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    participants: number;
  };
  isParticipating?: boolean;
}

export default function ChallengeDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const challengeId = params?.id as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<never[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (challengeId) {
      loadChallenge();
      loadLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengeId]);

  const loadChallenge = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/challenges/${challengeId}`);
      if (!response.ok) throw new Error('Failed to load challenge');

      const data = await response.json();
      setChallenge(data);
    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      setIsLoadingLeaderboard(true);
      const response = await fetch(`/api/challenges/${challengeId}/leaderboard`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardEntries(data);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      const response = await fetch(`/api/challenges/${challengeId}/join`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join challenge');
      }

      // Reload challenge
      await loadChallenge();
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert(error instanceof Error ? error.message : 'Failed to join challenge');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this challenge?')) {
      return;
    }

    try {
      setIsLeaving(true);
      const response = await fetch(`/api/challenges/${challengeId}/leave`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to leave challenge');
      }

      // Reload challenge
      await loadChallenge();
    } catch (error) {
      console.error('Error leaving challenge:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'VOLUME': return 'from-blue-600 to-cyan-600';
      case 'CONSISTENCY': return 'from-green-600 to-emerald-600';
      case 'PR': return 'from-orange-600 to-red-600';
      case 'DISTANCE': return 'from-purple-600 to-pink-600';
      case 'TIME': return 'from-yellow-600 to-orange-600';
      case 'WEIGHT': return 'from-red-600 to-pink-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getChallengeStatus = () => {
    if (!challenge) return 'unknown';
    
    const now = new Date();
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-wider">Challenge Not Found</h1>
          <button
            onClick={() => router.push('/challenges')}
            className="text-amber-400 hover:text-amber-300 font-black uppercase tracking-wider"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const status = getChallengeStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/challenges')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Challenges
        </button>

        {/* Challenge Header */}
        <div className={`bg-gradient-to-r ${getChallengeTypeColor(challenge.type)} rounded-lg p-8 mb-8`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-10 h-10 text-white" />
                <h1 className="text-4xl font-bold text-white">{challenge.name}</h1>
              </div>
              
              <p className="text-white/90 text-lg mb-4">{challenge.description}</p>

              <div className="flex flex-wrap gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{challenge._count?.participants || 0} participants</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {formatDistanceToNow(new Date(challenge.startDate), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span className="capitalize">{challenge.type.toLowerCase()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>
                    Target: {challenge.targetValue} {challenge.unit}
                  </span>
                </div>
              </div>
            </div>

            {session?.user?.id && (
              <div className="ml-4">
                {challenge.isParticipating ? (
                  <button
                    onClick={handleLeave}
                    disabled={isLeaving}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    {isLeaving ? 'Leaving...' : 'Leave Challenge'}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={isJoining || status === 'completed'}
                    className="px-6 py-3 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 rounded-lg font-medium transition-colors"
                  >
                    {isJoining ? 'Joining...' : status === 'completed' ? 'Challenge Ended' : 'Join Challenge'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Challenge Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Start Date</h3>
            <p className="text-gray-300">
              {new Date(challenge.startDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {formatDistanceToNow(new Date(challenge.startDate), { addSuffix: true })}
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">End Date</h3>
            <p className="text-gray-300">
              {new Date(challenge.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true })}
            </p>
          </div>

          <div className="bg-neutral-800/50 p-6 border-2 border-neutral-700">
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wider">Status</h3>
            <span className={`inline-block px-3 py-1 text-sm font-black uppercase tracking-wider ${
              status === 'active' ? 'bg-amber-500/20 border-2 border-amber-500/30 text-amber-400' :
              status === 'upcoming' ? 'bg-amber-500/20 border-2 border-amber-500/30 text-amber-400' :
              'bg-neutral-500/20 border-2 border-neutral-500/30 text-neutral-400'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Leaderboard</h2>
          <ChallengeLeaderboard
            challengeId={challengeId}
            challengeName={challenge.name}
            goal={challenge.targetValue}
            unit={challenge.unit}
            entries={leaderboardEntries}
            isLoading={isLoadingLeaderboard}
          />
        </div>
      </div>
    </div>
  );
}
