import React from 'react';
import { Dumbbell, TrendingUp, Award, Trophy, Users, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface ActivityCardProps {
  activity: ActivityFeedItem;
  currentUserId: string;
  onReact?: (activityId: string, type: 'LIKE' | 'CELEBRATE' | 'STRONG' | 'FIRE') => void;
  onComment?: (activityId: string) => void;
}

export function ActivityCard({ activity, currentUserId, onReact, onComment }: ActivityCardProps) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'WORKOUT_COMPLETED':
        return <Dumbbell className="w-5 h-5 text-amber-400" />;
      case 'PR_ACHIEVED':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'STREAK_MILESTONE':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'GOAL_ACHIEVED':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'CHALLENGE_COMPLETED':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'CHALLENGE_JOINED':
        return <Users className="w-5 h-5 text-amber-400" />;
      case 'PROGRAM_COMPLETED':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      default:
        return <Dumbbell className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getActivityMessage = () => {
    const userName = activity.user.name || activity.user.email;
    const data = activity.data as Record<string, string | number | boolean>;

    switch (activity.type) {
      case 'WORKOUT_COMPLETED':
        return (
          <>
            <span className="font-black">{userName}</span> completed a battle
            {data.name && ` - ${String(data.name)}`}
            {data.duration && typeof data.duration === 'number' && ` (${Math.round(data.duration / 60)} min)`}
          </>
        );
      case 'PR_ACHIEVED':
        return (
          <>
            <span className="font-black">{userName}</span> achieved a new PR
            {data.exerciseName && ` in ${String(data.exerciseName)}`}
            {data.value && ` - ${String(data.value)}${data.unit || ''}`}
          </>
        );
      case 'STREAK_MILESTONE':
        return (
          <>
            <span className="font-black">{userName}</span> reached a{' '}
            <span className="text-amber-400">{String(data.days)}-day streak</span>!
          </>
        );
      case 'GOAL_ACHIEVED':
        return (
          <>
            <span className="font-black">{userName}</span> achieved goal{' '}
            <span className="text-amber-400">{String(data.goalName)}</span>
          </>
        );
      case 'CHALLENGE_COMPLETED':
        return (
          <>
            <span className="font-black">{userName}</span> completed challenge{' '}
            <span className="text-amber-400">{String(data.challengeName)}</span>
          </>
        );
      case 'CHALLENGE_JOINED':
        return (
          <>
            <span className="font-black">{userName}</span> joined challenge{' '}
            <span className="text-amber-400">{String(data.challengeName)}</span>
          </>
        );
      case 'PROGRAM_COMPLETED':
        return (
          <>
            <span className="font-black">{userName}</span> completed program{' '}
            <span className="text-amber-400">{String(data.programName)}</span>
          </>
        );
      default:
        return <span className="font-black">{userName}</span>;
    }
  };

  const userReaction = activity.reactions?.find((r) => r.userId === currentUserId);
  const reactionCounts = activity.reactions?.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
            <span className="text-sm font-black text-white">
              {(activity.user.name || activity.user.email).charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getActivityIcon()}
            <p className="text-neutral-200 text-sm uppercase tracking-wider font-bold">{getActivityMessage()}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
            {activity.user.profile?.level && (
              <>
                <span>•</span>
                <span className="capitalize">{activity.user.profile.level}</span>
              </>
            )}
          </div>

          {/* Stats Grid */}
          {(activity.data.sets !== undefined || activity.data.reps !== undefined || activity.data.volume !== undefined) && (
            <div className="mt-2 flex gap-4 text-xs text-gray-400">
              {activity.data.sets !== undefined && <span>{String(activity.data.sets)} sets</span>}
              {activity.data.reps !== undefined && <span>{String(activity.data.reps)} reps</span>}
              {activity.data.volume !== undefined && <span>{String(activity.data.volume)} total volume</span>}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-700">
        <button
          onClick={() => onReact?.(activity.id, 'LIKE')}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            userReaction?.type === 'LIKE'
              ? 'text-red-400'
              : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${userReaction?.type === 'LIKE' ? 'fill-current' : ''}`} />
          {reactionCounts?.LIKE && <span>{reactionCounts.LIKE}</span>}
        </button>

        <button
          onClick={() => onReact?.(activity.id, 'CELEBRATE')}
          className={`flex items-center gap-1.5 text-sm transition-colors font-black uppercase tracking-wider ${
            userReaction?.type === 'CELEBRATE'
              ? 'text-amber-400'
              : 'text-neutral-400 hover:text-amber-400'
          }`}
        >
          <Trophy className={`w-4 h-4 ${userReaction?.type === 'CELEBRATE' ? 'fill-current' : ''}`} />
          {reactionCounts?.CELEBRATE && <span>{reactionCounts.CELEBRATE}</span>}
        </button>

        <button
          onClick={() => onReact?.(activity.id, 'STRONG')}
          className={`flex items-center gap-1.5 text-sm transition-colors font-black uppercase tracking-wider ${
            userReaction?.type === 'STRONG'
              ? 'text-amber-400'
              : 'text-neutral-400 hover:text-amber-400'
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${userReaction?.type === 'STRONG' ? 'fill-current' : ''}`} />
          {reactionCounts?.STRONG && <span>{reactionCounts?.STRONG}</span>}
        </button>

        <button
          onClick={() => onComment?.(activity.id)}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-amber-400 transition-colors ml-auto font-black uppercase tracking-wider"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
}
