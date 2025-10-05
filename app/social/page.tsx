'use client';

import { useState } from 'react';
import SocialHub from '@/components/social-hub';

export default function SocialPage() {
  const [notification, setNotification] = useState<string | null>(null);

  // Mock current user (would come from auth session in production)
  const currentUser = {
    id: 'current-user',
    name: 'You',
    level: 42,
    prestigeLevel: 1,
    totalXP: 115000,
    title: 'Gym Warrior',
  };

  // Event handlers
  const handleSendFriendRequest = (userId: string, message?: string) => {
    console.log('Sending friend request to:', userId, 'Message:', message);
    setNotification('Friend request sent!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAcceptFriendRequest = (requestId: string) => {
    console.log('Accepting friend request:', requestId);
    setNotification('Friend request accepted!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeclineFriendRequest = (requestId: string) => {
    console.log('Declining friend request:', requestId);
    setNotification('Friend request declined');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemoveFriend = (friendId: string) => {
    console.log('Removing friend:', friendId);
    setNotification('Friend removed');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBlockUser = (userId: string) => {
    console.log('Blocking user:', userId);
    setNotification('User blocked');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLikeWorkout = (workoutId: string) => {
    console.log('Liking workout:', workoutId);
  };

  const handleCommentWorkout = (workoutId: string, comment: string) => {
    console.log('Commenting on workout:', workoutId, 'Comment:', comment);
    setNotification('Comment posted!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShareWorkout = (workout: any) => {
    console.log('Sharing workout:', workout);
    setNotification('Workout shared!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <span className="text-xl">✓</span>
            <span className="font-semibold">{notification}</span>
          </div>
        </div>
      )}

      {/* Social Hub Component */}
      <SocialHub
        currentUser={currentUser}
        onSendFriendRequest={handleSendFriendRequest}
        onAcceptFriendRequest={handleAcceptFriendRequest}
        onDeclineFriendRequest={handleDeclineFriendRequest}
        onRemoveFriend={handleRemoveFriend}
        onBlockUser={handleBlockUser}
        onLikeWorkout={handleLikeWorkout}
        onCommentWorkout={handleCommentWorkout}
        onShareWorkout={handleShareWorkout}
      />

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🌟 Social Features Guide</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">👥 Friends System</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Send friend requests with optional messages</li>
                  <li>• Accept or decline incoming requests</li>
                  <li>• View friend profiles with stats and activity</li>
                  <li>• See mutual friends and shared gyms</li>
                  <li>• Real-time online status indicators</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">📰 Activity Feed</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• See friends' workout completions</li>
                  <li>• Celebrate achievement unlocks together</li>
                  <li>• Track level-ups and milestones</li>
                  <li>• View personal record celebrations</li>
                  <li>• Filter by all activities, friends, or your own</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">💬 Workout Sharing</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Share completed workouts with friends</li>
                  <li>• Like and comment on shared workouts</li>
                  <li>• View detailed exercise breakdowns</li>
                  <li>• Celebrate PRs with the community</li>
                  <li>• Export workouts to external platforms</li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">⚔️ Competitive Features</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Challenge friends to workout battles</li>
                  <li>• Compare stats side-by-side</li>
                  <li>• View friend leaderboards</li>
                  <li>• Track mutual personal records</li>
                  <li>• Earn social achievements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">🎯 Privacy Controls</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Set workout sharing to public/friends/private</li>
                  <li>• Control who can send friend requests</li>
                  <li>• Block users if needed</li>
                  <li>• Hide activity from specific users</li>
                  <li>• Manage notification preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">🏆 Social Achievements</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Social Butterfly: Add 10/25/50 friends</li>
                  <li>• Motivator: Give 100/500/1000 likes</li>
                  <li>• Commentator: Post 50/200/500 comments</li>
                  <li>• Supporter: Cheer on friends' achievements</li>
                  <li>• Community Leader: Most active in friend group</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="mt-8 pt-8 border-t border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">💡 Pro Tips</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="text-purple-400 font-bold mb-2">🤝 Build Your Network</div>
                <p className="text-sm text-gray-300">
                  Add friends from your gym to stay motivated and accountable. Train together, share tips, and celebrate victories!
                </p>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-blue-400 font-bold mb-2">💪 Stay Active</div>
                <p className="text-sm text-gray-300">
                  Share your best workouts and PRs. Positive feedback from friends boosts motivation and keeps you consistent.
                </p>
              </div>

              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="text-green-400 font-bold mb-2">🎯 Friendly Competition</div>
                <p className="text-sm text-gray-300">
                  Challenge friends to push each other. Healthy competition drives improvement and makes training more fun!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
