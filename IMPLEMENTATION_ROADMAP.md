# 🚀 Astral Power - Full Implementation Roadmap

## Current Status Analysis

### ✅ What's Actually Working (Real Data)
- ✅ Database schema (11 models)
- ✅ Authentication system (NextAuth with bcrypt)
- ✅ Database seeding (demo user, 12 exercises)
- ✅ Prisma ORM integration
- ✅ Core agent algorithms (coded but not fully integrated)

### ⚠️ What's Mock/Fake Data
- ❌ Dashboard stats (hardcoded)
- ❌ Next workout (static JSON)
- ❌ Recent sessions (fake data)
- ❌ Accountability API endpoints (not connected to real data)
- ❌ Session player (not persisting to database)
- ❌ No workout creation interface
- ❌ No exercise selection
- ❌ No program customization

### 🔴 Missing Critical Features
- ❌ Workout program builder
- ❌ Custom workout creation
- ❌ Exercise library browser
- ❌ Real-time workout tracking with DB persistence
- ❌ Historical data viewing
- ❌ Progress charts/graphs
- ❌ Settings page
- ❌ Profile editing
- ❌ Program templates

---

## 📋 Phase 1: Fix Core Functionality (Priority 1)

### 1.1 Real Data Integration
**Goal:** Replace all mock data with real database queries

**Tasks:**
- [ ] Fix `/api/stats/route.ts` - Query actual user statistics
- [ ] Fix `/api/workout/next/route.ts` - Generate from database
- [ ] Fix `/api/sessions/route.ts` - Query real workout history
- [ ] Connect accountability endpoints to Habit Formation Agent
- [ ] Fix session player to persist sets to database

**Files to Update:**
```
app/api/stats/route.ts
app/api/workout/next/route.ts
app/api/sessions/route.ts
app/api/accountability/*/route.ts
components/session-player.tsx
```

### 1.2 Workout Session Persistence
**Goal:** Make workout logging actually work

**Tasks:**
- [ ] Create proper workout session initialization
- [ ] Connect session player to real session ID
- [ ] Ensure sets save to database
- [ ] Update session completion status
- [ ] Calculate session duration
- [ ] Update streak on completion
- [ ] Check for PRs after each set

**New API Endpoints:**
```
POST /api/sessions/create - Create new workout session
PATCH /api/sessions/:id - Update session
POST /api/sessions/:id/complete - Mark session complete
```

---

## 📋 Phase 2: Workout Management (Priority 1)

### 2.1 Exercise Library Browser
**Goal:** Let users browse and select exercises

**Files to Create:**
```
app/exercises/page.tsx - Exercise library page
app/exercises/[id]/page.tsx - Exercise detail page
components/exercise-card.tsx
components/exercise-filter.tsx
```

**Features:**
- Filter by muscle group
- Filter by equipment
- Search by name
- View exercise details
- Video/animation (future)

### 2.2 Workout Program Builder
**Goal:** Create custom workout programs

**Files to Create:**
```
app/programs/page.tsx - List programs
app/programs/new/page.tsx - Create program
app/programs/[id]/page.tsx - View/edit program
app/programs/[id]/edit/page.tsx - Edit program
components/program-builder.tsx
components/exercise-selector.tsx
```

**Features:**
- Create named programs (e.g., "Push Day", "Pull Day", "Legs")
- Add exercises to program
- Set default sets/reps/RPE targets
- Save multiple programs
- Assign programs to days of week
- Program templates (PPL, Upper/Lower, Full Body)

### 2.3 Quick Workout Creation
**Goal:** Start a workout without pre-planning

**Files to Create:**
```
app/workout/quick-start/page.tsx
components/quick-workout-builder.tsx
```

**Features:**
- Select exercises on-the-fly
- Start tracking immediately
- Save as program for future use

---

## 📋 Phase 3: Enhanced Tracking (Priority 2)

### 3.1 Real Progressive Overload
**Goal:** Actually use the Progressive Overload Agent

**Tasks:**
- [ ] Run agent daily (cron job or manual trigger)
- [ ] Generate personalized workout based on history
- [ ] Display progression suggestions
- [ ] Show "Last Time" data during workout
- [ ] Automatic load recommendations

**Files to Update:**
```
app/api/agents/personalize/route.ts - Make it work
components/session-player.tsx - Show recommendations
app/dashboard/page.tsx - Display generated workout
```

### 3.2 Advanced Set Logging
**Goal:** Capture more training data

**Features to Add:**
- Warmup sets (don't count toward volume)
- Drop sets
- Rest pause sets
- Tempo specification
- Notes per set
- Failure indicator
- Assisted reps

### 3.3 Exercise History
**Goal:** View progress over time

**Files to Create:**
```
app/exercises/[id]/history/page.tsx
components/exercise-progress-chart.tsx
components/set-history-table.tsx
```

**Features:**
- Graph weight progression
- Graph volume progression
- PR indicators
- Best sets table
- Estimated 1RM progression

---

## 📋 Phase 4: Analytics & Insights (Priority 2)

### 4.1 Progress Dashboard
**Goal:** Visualize training data

**Files to Create:**
```
app/progress/page.tsx
components/charts/volume-chart.tsx
components/charts/strength-chart.tsx
components/charts/frequency-chart.tsx
```

**Charts:**
- Weekly volume (total kg lifted)
- Strength progression by exercise
- Training frequency
- Muscle group volume distribution
- RPE trends
- Fatigue score (ACWR)

### 4.2 Reports & Summaries
**Goal:** Weekly/monthly insights

**Features:**
- Weekly summary email/notification
- Personal records achieved
- Volume PR's
- Consistency metrics
- Recommendations

---

## 📋 Phase 5: User Experience (Priority 3)

### 5.1 Settings & Customization

**Files to Create:**
```
app/settings/page.tsx
app/settings/profile/page.tsx
app/settings/preferences/page.tsx
app/settings/notifications/page.tsx
```

**Settings:**
- Profile info (name, email, password)
- Units (kg/lbs)
- Default rest timers
- Notification preferences
- Training level (beginner/intermediate/advanced)
- Training goals (strength/hypertrophy/endurance)
- Dark/light mode
- Export data

### 5.2 Rest Timer
**Goal:** Built-in rest timer between sets

**Features:**
- Auto-start after set completion
- Customizable duration
- Sound/vibration alert
- Pause/resume
- Quick adjust (+30s, -30s)

### 5.3 Plate Calculator
**Goal:** Help users load the bar

**Features:**
- Input target weight
- Shows plate configuration
- Accounts for bar weight (20kg/45lbs)
- One-sided display

---

## 📋 Phase 6: Program Templates (Priority 3)

### 6.1 Built-in Programs

**Programs to Add:**
- **Beginner:**
  - Starting Strength (3×5 linear progression)
  - StrongLifts 5×5
  - GZCLP
  
- **Intermediate:**
  - 5/3/1 (multiple variations)
  - Texas Method
  - PPL (Push/Pull/Legs)
  
- **Hypertrophy:**
  - High-volume PPL
  - Upper/Lower split
  - Bro split

- **Bodyweight:**
  - Your requested routine!
  - Calisthenics progression
  
### 6.2 Program Marketplace (Future)
- Community-submitted programs
- Ratings & reviews
- Filter by goal/level/equipment

---

## 📋 Phase 7: Mobile Optimization (Priority 3)

### 7.1 PWA Features
- [ ] Add manifest.json
- [ ] Service worker for offline
- [ ] Install prompt
- [ ] Push notifications
- [ ] Background sync

### 7.2 Mobile-First UI
- [ ] Touch-optimized controls
- [ ] Swipe gestures
- [ ] Haptic feedback
- [ ] Screen wake lock during workout
- [ ] Landscape mode support

---

## 📋 Phase 8: Advanced Features (Priority 4)

### 8.1 Video Analysis (Planned)
- Record sets
- Form analysis AI
- Rep counting
- Bar velocity tracking

### 8.2 Social Features (Optional)
- Share workouts
- Follow friends
- Leaderboards
- Challenges

### 8.3 Integrations
- Apple Health
- Google Fit
- Strava
- MyFitnessPal

---

## 🎯 Immediate Action Plan (Next 2-3 Hours)

### Step 1: Add Your Bodyweight Routine ✅
```typescript
// Will create this workout program in the database
```

### Step 2: Fix Mock Data → Real Data
**Priority endpoints to fix:**
1. `/api/stats` - Real user statistics
2. `/api/workout/next` - Pull from programs
3. `/api/sessions` - Real history
4. Session player persistence

### Step 3: Create Program Builder
- Simple UI to create workout programs
- Add exercises from library
- Set default parameters

### Step 4: Fix Workout Flow
1. User selects a program
2. Starts workout session
3. Logs sets (saves to DB)
4. Completes workout
5. Agents run to update progression
6. Next workout generated

---

## 📊 Implementation Timeline

### Week 1: Core Functionality
- ✅ Day 1-2: Fix all mock data endpoints
- ✅ Day 3-4: Workout session persistence
- ✅ Day 5-7: Program builder MVP

### Week 2: Workout Management
- Day 1-3: Exercise library browser
- Day 4-5: Program templates
- Day 6-7: Quick workout start

### Week 3: Analytics
- Day 1-3: Progress charts
- Day 4-5: Exercise history
- Day 6-7: Weekly reports

### Week 4: Polish
- Day 1-2: Settings page
- Day 3-4: Rest timer
- Day 5-6: Mobile optimization
- Day 7: Testing & bug fixes

---

## 🔧 Technical Debt to Address

1. **Type Safety:** Some API responses lack proper TypeScript types
2. **Error Handling:** Many endpoints lack try-catch blocks
3. **Validation:** Need Zod schemas for all API inputs
4. **Loading States:** Add skeleton loaders
5. **Optimistic Updates:** Improve UX with optimistic rendering
6. **Caching:** Add SWR or React Query for data fetching
7. **Testing:** Expand test coverage to 80%+

---

## 📝 Database Changes Needed

### New Tables
```prisma
model WorkoutProgram {
  id          String   @id @default(cuid())
  userId      String
  name        String   // "Push Day", "Pull Day", etc.
  description String?
  exercises   ProgramExercise[]
  schedule    Json?    // Which days to run
  active      Boolean  @default(true)
  user        User     @relation(fields: [userId], references: [id])
}

model ProgramExercise {
  id          String   @id @default(cuid())
  programId   String
  exerciseId  String
  order       Int      // Exercise order in program
  sets        Int
  reps        Int
  targetRPE   Float?
  restSeconds Int?
  notes       String?
  program     WorkoutProgram @relation(fields: [programId], references: [id])
  exercise    Exercise @relation(fields: [exerciseId], references: [id])
}

model RestTimer {
  id          String   @id @default(cuid())
  userId      String
  duration    Int      // seconds
  default     Boolean  @default(false)
  exerciseId  String?  // Optional: timer per exercise
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## 🎨 UI/UX Improvements Needed

1. **Better Navigation:** Sidebar or bottom nav
2. **Breadcrumbs:** Show current location
3. **Empty States:** Helpful messages when no data
4. **Onboarding:** First-time user tutorial
5. **Loading Skeletons:** Better than spinners
6. **Toast Notifications:** Success/error feedback
7. **Confirmation Dialogs:** Before destructive actions
8. **Search:** Global search for exercises/programs
9. **Keyboard Shortcuts:** Power user features

---

## 💡 Quick Wins (Do First)

1. **Add your bodyweight routine** ✅ (I'll do this now)
2. **Fix `/api/stats` to show real data**
3. **Fix session completion to update streak**
4. **Add "Create Program" button**
5. **Add exercise library page**
6. **Show last workout data during training**

---

## 🚨 Critical Bugs to Fix

1. ❌ Session player doesn't save to database properly
2. ❌ Streak doesn't update after workout
3. ❌ PRs not detected
4. ❌ Achievement system not working
5. ❌ Dashboard shows fake data
6. ❌ Can't create new workouts
7. ❌ No way to view exercise history

---

## 📚 Resources & References

- **Progressive Overload Science:** Already implemented in agents
- **RPE Scale:** Validated in autoregulation agent
- **ACWR:** Implemented in fatigue management agent
- **UI Inspiration:** Strong App, Hevy, FitNotes
- **Design System:** Continue with Tailwind + shadcn/ui (optional)

---

## ✅ Success Criteria

**MVP Complete When:**
- [ ] Users can create custom workout programs
- [ ] Workouts save to database properly
- [ ] Progress charts show real data
- [ ] Streak and achievements work
- [ ] Progressive overload agent generates workouts
- [ ] Can view exercise history
- [ ] Mobile responsive and PWA-ready

**Production Ready When:**
- [ ] All mock data replaced
- [ ] Full test coverage
- [ ] Error handling complete
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Documentation complete

---

**Let's start by implementing the immediate fixes and adding your bodyweight routine!**

