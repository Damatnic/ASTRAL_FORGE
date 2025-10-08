'use client';

import React, { useState } from 'react';
import { Search, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  profile?: {
    level: string;
  };
  isFriend?: boolean;
  hasPendingRequest?: boolean;
}

interface FriendSearchProps {
  onSendRequest?: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

export function FriendSearch({ onSendRequest, isLoading = false }: FriendSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequests, setSendingRequests] = useState<Set<string>>(new Set());

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    if (!onSendRequest) return;

    setSendingRequests((prev) => new Set(prev).add(userId));
    try {
      await onSendRequest(userId);
      // Update local state to show request sent
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, hasPendingRequest: true } : user
        )
      );
    } catch (error) {
      console.error('Send request error:', error);
    } finally {
      setSendingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Find Warriors</h2>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="SEARCH BY NAME OR EMAIL..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:border-amber-700 transition-colors uppercase tracking-wider font-bold"
          disabled={isLoading}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400 animate-spin" />
        )}
      </div>

      {/* Search Results */}
      {searchQuery.length > 0 && (
        <div className="bg-neutral-900 backdrop-blur-sm border-2 border-neutral-800 overflow-hidden">
          {isSearching ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-2" />
              <p className="text-neutral-400 uppercase tracking-wider font-bold">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 uppercase tracking-wider font-bold">
                {searchQuery.length < 2
                  ? 'Type at least 2 characters to search'
                  : 'No warriors found'}
              </p>
            </div>
          ) : (
            <div className="divide-y-2 divide-neutral-800">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-neutral-800/30 transition-colors"
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
                      {user.name && (
                        <p className="text-sm text-neutral-400 truncate uppercase tracking-wider font-bold">{user.email}</p>
                      )}
                    </div>

                    {/* Action Button */}
                    {user.isFriend ? (
                      <div className="flex items-center gap-2 text-amber-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-black uppercase tracking-wider">Allied</span>
                      </div>
                    ) : user.hasPendingRequest ? (
                      <div className="px-4 py-2 bg-neutral-800 text-neutral-400 text-sm font-black uppercase tracking-wider">
                        Request Sent
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendingRequests.has(user.id)}
                        className="px-4 py-2 bg-amber-950/20 border-2 border-amber-700 hover:bg-amber-950/40 disabled:bg-neutral-800 text-amber-400 transition-colors text-sm font-black uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      >
                        {sendingRequests.has(user.id) ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Add Ally
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {searchQuery.length === 0 && (
        <div className="bg-neutral-900/50 p-4 border-2 border-neutral-800">
          <p className="text-sm text-neutral-400 uppercase tracking-wider font-bold">
            ⚔️ <span className="font-black">TIP:</span> Search for warriors by their name or email to send alliance request
          </p>
        </div>
      )}
    </div>
  );
}
