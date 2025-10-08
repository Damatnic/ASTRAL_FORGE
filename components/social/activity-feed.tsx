import React, { useState, useEffect } from 'react';
import { ActivityCard } from './activity-card';
import { Loader2, AlertCircle } from 'lucide-react';

interface ActivityFeedItem {
  id: string;
  userId: string;
  type: 'WORKOUT_COMPLETED' | 'PR_ACHIEVED' | 'CHALLENGE_JOINED' | 'CHALLENGE_COMPLETED' | 'STREAK_MILESTONE' | 'GOAL_ACHIEVED' | 'PROGRAM_COMPLETED';
  data: Record<string, unknown>;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profile?: {
      level?: string;
    } | null;
  };
  reactions?: {
    id: string;
    type: 'LIKE' | 'CELEBRATE' | 'STRONG' | 'FIRE';
    userId: string;
  }[];
}

interface ActivityFeedProps {
  currentUserId: string;
  filterType?: 'all' | 'friends' | 'personal';
  limit?: number;
  onReact?: (activityId: string, type: 'LIKE' | 'CELEBRATE' | 'STRONG' | 'FIRE') => Promise<void>;
  onComment?: (activityId: string) => void;
}

export function ActivityFeed({
  currentUserId,
  filterType = 'all',
  limit = 20,
  onReact,
  onComment,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const loadActivities = async (cursor?: string) => {
    try {
      setIsLoading(!cursor);
      setIsLoadingMore(!!cursor);

      const params = new URLSearchParams({
        filter: filterType,
        limit: limit.toString(),
        ...(cursor && { cursor }),
      });

      const response = await fetch(`/api/activity?${params}`);
      if (!response.ok) throw new Error('Failed to load activities');

      const data = await response.json();

      if (cursor) {
        setActivities((prev) => [...prev, ...data.activities]);
      } else {
        setActivities(data.activities);
      }

      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleReact = async (activityId: string, type: 'LIKE' | 'CELEBRATE' | 'STRONG' | 'FIRE') => {
    try {
      // Optimistic update
      setActivities((prev) =>
        prev.map((activity) => {
          if (activity.id !== activityId) return activity;

          const reactions = activity.reactions || [];
          const existingReaction = reactions.find((r) => r.userId === currentUserId);

          let newReactions;
          if (existingReaction) {
            if (existingReaction.type === type) {
              // Remove reaction
              newReactions = reactions.filter((r) => r.userId !== currentUserId);
            } else {
              // Change reaction type
              newReactions = reactions.map((r) =>
                r.userId === currentUserId ? { ...r, type } : r
              );
            }
          } else {
            // Add new reaction
            newReactions = [
              ...reactions,
              { id: `temp-${Date.now()}`, type, userId: currentUserId },
            ];
          }

          return { ...activity, reactions: newReactions };
        })
      );

      // Call parent callback
      await onReact?.(activityId, type);
    } catch (err) {
      console.error('Failed to react:', err);
      // Reload activities to revert optimistic update
      loadActivities();
    }
  };

  const handleLoadMore = () => {
    if (activities.length > 0) {
      const lastActivity = activities[activities.length - 1];
      loadActivities(lastActivity.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => loadActivities()}
          className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-8 text-center">
        <p className="text-gray-400">No activities yet</p>
        {filterType === 'friends' && (
          <p className="text-sm text-gray-500 mt-2">
            Add friends to see their workout activities
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          currentUserId={currentUserId}
          onReact={handleReact}
          onComment={onComment}
        />
      ))}

      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="w-full py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
        >
          {isLoadingMore ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading more...
            </span>
          ) : (
            'Load more'
          )}
        </button>
      )}
    </div>
  );
}
