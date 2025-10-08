'use client';

import React, { useState } from 'react';
import { UserPlus, UserCheck, UserX, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  fromUser?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      level: string;
    };
  };
  toUser?: {
    id: string;
    name: string;
    email: string;
    profile?: {
      level: string;
    };
  };
}

interface FriendRequestsProps {
  requests: FriendRequest[];
  currentUserId: string;
  onAccept?: (requestId: string) => Promise<void>;
  onDecline?: (requestId: string) => Promise<void>;
  isLoading?: boolean;
}

export function FriendRequests({
  requests,
  currentUserId,
  onAccept,
  onDecline,
  isLoading = false,
}: FriendRequestsProps) {
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const receivedRequests = pendingRequests.filter((r) => r.toUserId === currentUserId);
  const sentRequests = pendingRequests.filter((r) => r.fromUserId === currentUserId);

  const handleAccept = async (requestId: string) => {
    if (!onAccept) return;

    setProcessingRequests((prev) => new Set(prev).add(requestId));
    try {
      await onAccept(requestId);
    } catch (error) {
      console.error('Accept error:', error);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    if (!onDecline) return;

    setProcessingRequests((prev) => new Set(prev).add(requestId));
    try {
      await onDecline(requestId);
    } catch (error) {
      console.error('Decline error:', error);
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            Received Requests ({receivedRequests.length})
          </h2>
        </div>

        {receivedRequests.length === 0 ? (
          <div className="text-center py-8 bg-neutral-900 border-2 border-neutral-800">
            <UserPlus className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 uppercase tracking-wider font-bold">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {receivedRequests.map((request) => {
              const user = request.fromUser!;
              const isProcessing = processingRequests.has(request.id);

              return (
                <div
                  key={request.id}
                  className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-4 hover:border-amber-700/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-xl font-black text-white">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-black truncate uppercase tracking-wider">
                          {user.name || user.email}
                        </h3>
                        {user.profile?.level && (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-black uppercase tracking-wider">
                            {user.profile.level}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-400 uppercase tracking-wider font-bold">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-amber-950/20 border-2 border-amber-700 hover:bg-amber-950/40 disabled:bg-neutral-800 text-amber-400 transition-colors text-sm font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4" />
                        Accept
                      </button>

                      <button
                        onClick={() => handleDecline(request.id)}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-red-950/20 border-2 border-red-700 hover:bg-red-950/40 disabled:bg-neutral-800 text-red-400 transition-colors text-sm font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      >
                        <UserX className="w-4 h-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              Sent Requests ({sentRequests.length})
            </h2>
          </div>

          <div className="space-y-3">
            {sentRequests.map((request) => {
              const user = request.toUser!;

              return (
                <div
                  key={request.id}
                  className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-xl font-black text-white">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-black truncate uppercase tracking-wider">
                          {user.name || user.email}
                        </h3>
                        {user.profile?.level && (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs font-black uppercase tracking-wider">
                            {user.profile.level}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-400 uppercase tracking-wider font-bold">
                        <Clock className="w-3 h-3" />
                        <span>
                          Sent {formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="px-4 py-2 bg-amber-950/20 border-2 border-amber-700 text-amber-400 text-sm font-black uppercase tracking-wider">
                      Pending
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
