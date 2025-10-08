# Phase 5: Social Features - Implementation Plan

**Status:** PLANNING  
**Date:** October 6, 2025  
**Priority:** HIGH  
**Estimated Time:** 3-4 hours  

---

## Overview

Phase 5 focuses on building real fitness-focused social features to replace fantasy gaming elements. This includes challenges, leaderboards, friend activities, and community engagement.

**Goal:** Transform gaming-focused PvP/boss battles into real fitness challenges and social motivation tools.

---

## High Priority Features

### 1. Fitness Challenges System
Replace fantasy combat with real fitness challenges that users can participate in.

**Challenge Types:**
- **30-Day Challenges** (Squat challenge, Push-up challenge, etc.)
- **Distance Challenges** (Run 100 miles in a month)
- **Consistency Challenges** (Train 5x/week for a month)
- **Strength Challenges** (Add 50 lbs to your squat)
- **Endurance Challenges** (Improve 5K time by 1 minute)

**Components to Build:**
1. `ChallengeCard` - Display challenge info, progress, participants
2. `ChallengeList` - Browse available challenges
3. `ChallengeParticipation` - Join/leave challenges
4. `ChallengeProgress` - Track user's progress in challenge
5. `ChallengeLeaderboard` - Show rankings within challenge

**Database Schema:**
```typescript
interface Challenge {
  id: string
  name: string
  description: string
  type: '30-day' | 'distance' | 'consistency' | 'strength' | 'endurance'
  startDate: Date
  endDate: Date
  goal: number
  unit: 'reps' | 'miles' | 'workouts' | 'lbs' | 'minutes'
  participants: number
  createdBy: string
  isActive: boolean
}

interface ChallengeParticipation {
  id: string
  challengeId: string
  userId: string
  progress: number
  rank: number
  joinedAt: Date
  completedAt: Date | null
}
```

**API Endpoints:**
- `GET /api/challenges` - List active challenges
- `POST /api/challenges` - Create new challenge
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges/:id/join` - Join challenge
- `DELETE /api/challenges/:id/leave` - Leave challenge
- `PUT /api/challenges/:id/progress` - Update progress
- `GET /api/challenges/:id/leaderboard` - Get rankings

---

### 2. Challenge Leaderboards
Show rankings for challenges and overall fitness metrics.

**Leaderboard Types:**
- **Challenge-Specific** (ranking within a challenge)
- **Strength Leaderboards** (bench press, squat, deadlift)
- **Endurance Leaderboards** (5K time, mile time)
- **Volume Leaderboards** (total weight lifted this week/month)
- **Consistency Leaderboards** (workout streaks)

**Components to Build:**
1. `LeaderboardCard` - Display leaderboard with top 10 + user rank
2. `LeaderboardFilters` - Filter by time period, category
3. `LeaderboardEntry` - Individual user entry with rank, stats
4. `PersonalRank` - Highlight user's current position

**Features:**
- Time period filters (week, month, all-time)
- Category filters (strength, endurance, volume, consistency)
- Friend-only view (compare with friends)
- Pagination for full leaderboard
- Rank change indicators (↑↓)

---

### 3. Friend Activity Feed
Show recent workouts, PRs, and achievements from friends.

**Activity Types:**
- Workout completed (with stats)
- New PR achieved
- Challenge joined/completed
- Streak milestone (7-day, 30-day, etc.)
- Goal achieved

**Components to Build:**
1. `ActivityFeed` - Scrollable list of friend activities
2. `ActivityCard` - Individual activity item
3. `ActivityFilters` - Filter by activity type
4. `ActivityReactions` - Like, comment on activities

**Feed Item Structure:**
```typescript
interface ActivityItem {
  id: string
  userId: string
  username: string
  avatar: string
  type: 'workout' | 'pr' | 'challenge' | 'streak' | 'goal'
  timestamp: Date
  data: {
    exercise?: string
    weight?: number
    reps?: number
    duration?: number
    challengeName?: string
    streakDays?: number
  }
  reactions: {
    likes: number
    comments: number
  }
}
```

---

### 4. Friend System
Follow/unfollow friends, view their profiles.

**Components to Build:**
1. `FriendList` - List of current friends
2. `FriendSearch` - Search and add friends
3. `FriendRequests` - Pending requests (sent/received)
4. `FriendProfile` - View friend's stats and activities

**Features:**
- Send friend request
- Accept/decline requests
- Remove friend
- View friend's public profile
- See friend's recent workouts
- Compare stats with friends

---

## Medium Priority Features

### 5. Social Progress Sharing
Share workouts, PRs, and progress to activity feed.

**Shareable Items:**
- Workout summary (after completion)
- New PR (automatic share option)
- Progress photo comparison (before/after)
- Challenge completion
- Goal achievement

**Components to Build:**
1. `ShareDialog` - Choose what to share
2. `SharePreview` - Preview before sharing
3. `ShareSettings` - Privacy settings (public, friends, private)

---

### 6. Challenge Participation Display
Show user's active challenges on dashboard and profile.

**Components to Build:**
1. `ActiveChallenges` - Widget showing current challenges
2. `ChallengeProgressRing` - Visual progress indicator
3. `ChallengeBadge` - Completed challenge badge

---

### 7. Seasonal & Monthly Challenges
Pre-created challenges that reset monthly or seasonally.

**Monthly Challenges:**
- "January Volume Challenge" - Lift 500,000 lbs total
- "February Cardio Challenge" - Run 50 miles
- "March Consistency Challenge" - Train 20 days

**Seasonal Challenges:**
- "Summer Shred" - 90-day transformation
- "Fall Strength" - Add 100 lbs to total (squat + bench + deadlift)
- "Winter Warrior" - Train 60 days in a row

---

## Low Priority Features

### 8. Community Discussion Features
- Form check requests (upload video, get feedback)
- Workout plan sharing
- Motivation and tips sections
- Community moderation

### 9. Advanced Social Features
- Workout buddies (find training partners)
- Group challenges
- Team competitions
- Social achievements

---

## Implementation Strategy

### Step 1: Database Setup (30 minutes)
1. Create Challenge and ChallengeParticipation models
2. Add Friend and FriendRequest models
3. Add Activity and ActivityReaction models
4. Run migrations

### Step 2: API Development (60 minutes)
1. Challenge endpoints (CRUD, join, progress, leaderboard)
2. Friend endpoints (search, request, accept, remove)
3. Activity feed endpoints (get, create, react)
4. Leaderboard endpoints (get rankings)

### Step 3: Core Components (90 minutes)
1. Build ChallengeCard and ChallengeList
2. Create LeaderboardCard and LeaderboardEntry
3. Implement ActivityFeed and ActivityCard
4. Build FriendList and FriendSearch

### Step 4: Challenge System (45 minutes)
1. Implement challenge participation logic
2. Add progress tracking
3. Build leaderboard calculations
4. Create challenge completion detection

### Step 5: Integration (30 minutes)
1. Add challenges section to dashboard
2. Add friend activity feed to dashboard
3. Add leaderboards page
4. Update navigation

### Step 6: Testing & Polish (30 minutes)
1. Test all challenge flows
2. Test friend system
3. Test activity feed
4. Verify leaderboard calculations
5. Build and verify

---

## Pages to Create/Update

### New Pages
1. `/challenges` - Browse and join challenges
2. `/challenges/[id]` - Challenge details and leaderboard
3. `/leaderboards` - Global fitness leaderboards
4. `/social` - Social hub (feed, friends, challenges)
5. `/friends` - Friend management
6. `/profile/[userId]` - Public user profile

### Pages to Update
1. `/dashboard` - Add challenge widget, activity feed widget
2. `/profile` - Add active challenges, friend stats

---

## Files to Create

### Components
```
components/
  challenges/
    challenge-card.tsx
    challenge-list.tsx
    challenge-participation.tsx
    challenge-progress.tsx
    challenge-leaderboard.tsx
    active-challenges-widget.tsx
  
  leaderboards/
    leaderboard-card.tsx
    leaderboard-filters.tsx
    leaderboard-entry.tsx
    personal-rank.tsx
  
  social/
    activity-feed.tsx
    activity-card.tsx
    activity-filters.tsx
    activity-reactions.tsx
    friend-list.tsx
    friend-search.tsx
    friend-requests.tsx
    friend-profile.tsx
    share-dialog.tsx
```

### API Routes
```
app/api/
  challenges/
    route.ts (GET, POST)
    [id]/
      route.ts (GET, PUT, DELETE)
      join/route.ts (POST)
      leave/route.ts (DELETE)
      progress/route.ts (PUT)
      leaderboard/route.ts (GET)
  
  friends/
    route.ts (GET)
    search/route.ts (GET)
    requests/
      route.ts (GET, POST)
      [id]/
        accept/route.ts (POST)
        decline/route.ts (DELETE)
    [id]/route.ts (DELETE)
  
  activity/
    route.ts (GET, POST)
    [id]/
      react/route.ts (POST)
  
  leaderboards/
    route.ts (GET)
    [category]/route.ts (GET)
```

### Database Migrations
```
prisma/migrations/
  add_challenges/
  add_friends/
  add_activity/
```

---

## Success Metrics

**Functionality:**
- [ ] Users can browse and join challenges
- [ ] Users can track progress in challenges
- [ ] Leaderboards show accurate rankings
- [ ] Friend system works (add, remove, search)
- [ ] Activity feed shows friend activities
- [ ] Share functionality works

**Performance:**
- [ ] Challenges page loads in < 2s
- [ ] Activity feed loads in < 1s
- [ ] Leaderboard calculations are fast
- [ ] No N+1 queries

**Quality:**
- [ ] 0 build errors
- [ ] Full TypeScript coverage
- [ ] Responsive design
- [ ] Clean UI/UX

---

## Next Steps

**Recommended Approach:**

**Option A: Full Phase 5 Implementation** (3-4 hours)
- Implement all high priority features
- Complete challenge system, leaderboards, friend system
- Build activity feed
- Full integration and testing

**Option B: Incremental Implementation** (1-2 hours each)
- **Part 1:** Challenge system only
- **Part 2:** Leaderboards
- **Part 3:** Friend system and activity feed

**Option C: Quick Social Prototype** (1 hour)
- Basic challenge cards
- Simple leaderboard
- Friend list only
- Minimal functionality for testing

**Recommendation:** Option B - Incremental implementation starting with challenges, as they're the most impactful replacement for the gaming features.

---

## Risks & Considerations

**Database Performance:**
- Leaderboard queries could be expensive with many users
- Need proper indexing on challenge participation
- Consider caching for leaderboards

**Real-time Updates:**
- Activity feed should update in real-time (consider WebSockets)
- Leaderboard ranks should refresh periodically
- Challenge progress should be near-instant

**Privacy:**
- Need proper privacy settings for activities
- Friend-only visibility options
- Public vs private profile settings

**Moderation:**
- Need moderation tools for community features (future)
- Report/block functionality (future)
- Content guidelines

---

**Ready to Start Phase 5!**

Would you like to proceed with:
1. **Option A** - Full Phase 5 implementation
2. **Option B Part 1** - Challenge system only
3. **Option C** - Quick prototype
4. **Different approach** - Your preference

Let me know and I'll begin implementation!
