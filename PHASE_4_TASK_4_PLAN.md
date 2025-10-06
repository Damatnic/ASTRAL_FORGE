# Phase 4 Task 4: Rewards System Redesign - PLAN

**Status:** Ready to Start  
**Goal:** Remove RNG loot mechanics and create deterministic achievement-based rewards  
**Estimated Time:** 1-2 hours

---

## 🎯 Objectives

1. **Remove Loot Sounds** - Delete fantasy loot sound effects from sound system
2. **Create Achievement Unlock System** - Build deterministic reward claiming
3. **Design Reward Progression** - Clear paths from actions to unlocks
4. **Update Reward UI** - Show what you get for completing tasks

---

## 📋 Implementation Steps

### Step 1: Sound System Cleanup (15 min)

**File:** `lib/sound-system.ts`

**Remove Loot Sound Types:**
- `'loot'` 
- `'loot_common'`
- `'loot_rare'`
- `'loot_epic'`
- `'loot_legendary'`

**Remove Loot Sound Methods:**
- `playLoot()` (~line 508)
- `playLootRare()` (~line 956)
- `playLootEpic()` (~line 976)
- `playLootLegendary()` (~line 996)

**Remove Loot Sound Cases:**
- Switch cases in main sound handler (~lines 321-333)

**Keep Reward Sounds:**
- `'achievement'` - For unlocking achievements
- `'achievement_rare'` - For tier advancements
- `'achievement_legendary'` - For major milestones
- `'chest_open'` - Repurpose for template unlocks
- `'gold_gained'` - Repurpose for unlock notifications

---

### Step 2: Achievement Unlock System (30 min)

**New File:** `lib/achievement-unlock-system.ts`

**Purpose:** Handle deterministic reward claiming after completing quests/challenges

**Core Functions:**
```typescript
class AchievementUnlockSystem {
  // Check if achievement is unlocked
  static async isAchievementUnlocked(prisma, userId, achievementId): Promise<boolean>
  
  // Unlock an achievement
  static async unlockAchievement(prisma, userId, achievementId): Promise<UnlockResult>
  
  // Get all unlocked achievements
  static async getUnlockedAchievements(prisma, userId): Promise<Achievement[]>
  
  // Unlock a workout template
  static async unlockTemplate(prisma, userId, templateId): Promise<UnlockResult>
  
  // Check if template is unlocked
  static async isTemplateUnlocked(prisma, userId, templateId): Promise<boolean>
  
  // Unlock a feature/metric
  static async unlockFeature(prisma, userId, featureId): Promise<UnlockResult>
  
  // Grant a title
  static async grantTitle(prisma, userId, titleId): Promise<UnlockResult>
  
  // Get all unlocks for user
  static async getUserUnlocks(prisma, userId): Promise<UserUnlocks>
}

interface UnlockResult {
  success: boolean
  alreadyUnlocked?: boolean
  unlocked?: Achievement | Template | Feature | Title
  message: string
}

interface UserUnlocks {
  achievements: Achievement[]
  templates: Template[]
  features: Feature[]
  titles: Title[]
  stats: {
    totalAchievements: number
    totalTemplates: number
    totalFeatures: number
    totalTitles: number
  }
}
```

**Database Tables to Use:**
- `UserAchievement` (already exists from Phase 3)
- `UserTemplate` (may need to create)
- `UserUnlock` (may need to create)
- `UserTitle` (may need to create)

---

### Step 3: Reward Progression Design (20 min)

**New File:** `lib/reward-progression.ts`

**Purpose:** Define clear paths from actions to rewards

**Reward Categories:**

1. **Achievements** (Badges/Trophies)
   - Unlocked by: Completing quests, hitting milestones
   - Examples: "Daily Warrior", "Volume Crusher", "PR Breaker"
   - Visual: Badge with icon and description
   - Benefit: Profile display, bragging rights

2. **Workout Templates** (Program Unlocks)
   - Unlocked by: Tier advancement, quest completion
   - Examples: "PPL Program", "German Volume Training", "5/3/1"
   - Visual: Program card with details
   - Benefit: New training programs to follow

3. **Feature Unlocks** (Metric/Tool Access)
   - Unlocked by: Achievements, tier advancement
   - Examples: "Advanced Metrics", "Cardio Tracker", "1RM Calculator"
   - Visual: Feature card with description
   - Benefit: New tools and tracking capabilities

4. **Titles** (Name Flair)
   - Unlocked by: Major accomplishments, streaks
   - Examples: "The Relentless", "Iron Warrior", "Strength Seeker"
   - Visual: Special text with styling
   - Benefit: Profile customization, status

**Progression Paths:**

```
Tier 1 (Novice) → Beginner Template Access
↓
Complete 10 Workouts → "Getting Started" Achievement
↓
Tier 2 (Beginner) → Advanced Metrics Unlock
↓
Complete 50 Workouts → "Dedicated" Achievement
↓
Tier 3 (Intermediate) → PPL Program Template
↓
7-Day Streak → "The Consistent" Title
↓
Tier 4 (Advanced) → Competition Prep Template
↓
Complete 250 Workouts → "Veteran" Achievement
↓
Tier 5 (Elite) → "Elite Athlete" Title
↓
Tier 6 (Master) → "Master of Iron" Title + All Features
```

---

### Step 4: Reward UI Components (30 min)

**New File:** `components/rewards/reward-unlock-card.tsx`

**Purpose:** Display unlocked rewards with celebration

**Features:**
- Animated unlock reveal
- Reward icon/image
- Reward name and description
- Benefit explanation
- "Claim" button or auto-claim with animation
- Sound effect on unlock

**New File:** `components/rewards/reward-tree.tsx`

**Purpose:** Show available and locked rewards

**Features:**
- Tree/path visualization
- Locked rewards (grayed out with lock icon)
- Unlocked rewards (colored with checkmark)
- Next available rewards highlighted
- Requirements shown on hover
- Progress bars for partial completion

**New File:** `components/rewards/unlocked-rewards-gallery.tsx`

**Purpose:** Browse all unlocked rewards

**Features:**
- Filter by type (achievements/templates/features/titles)
- Search functionality
- Grid layout with cards
- Click to view details
- Share buttons

---

### Step 5: Integration Points (15 min)

**Update:** `app/achievements/page.tsx`
- Use new achievement unlock system
- Show unlock progress
- Display locked vs unlocked

**Update:** `app/templates/page.tsx` (may need to create)
- Show unlocked templates
- Lock unavailable templates
- Clear unlock requirements

**Update:** `components/quest-board.tsx`
- Show deterministic rewards preview
- Remove loot chest icons
- Add achievement/template icons

**Update:** Quest completion flow
- Call achievement unlock system
- Show reward unlock animation
- Play appropriate sound

---

## 🗄️ Database Schema Changes

### Option 1: Minimal (Use Existing)
Use existing `UserAchievement` table for all unlocks, differentiate by type field.

### Option 2: Comprehensive (New Tables)

```prisma
model UserTemplate {
  id         String   @id @default(cuid())
  userId     String
  templateId String
  unlockedAt DateTime @default(now())
  source     String?  // "quest", "tier", "achievement"
  
  user       User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, templateId])
}

model UserUnlock {
  id         String   @id @default(cuid())
  userId     String
  featureId  String
  unlockedAt DateTime @default(now())
  source     String?
  
  user       User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, featureId])
}

model UserTitle {
  id         String   @id @default(cuid())
  userId     String
  titleId    String
  grantedAt  DateTime @default(now())
  isActive   Boolean  @default(false)
  source     String?
  
  user       User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, titleId])
}
```

---

## ✅ Success Criteria

- [ ] All loot sounds removed from sound system
- [ ] Achievement unlock system created with full CRUD
- [ ] Reward progression paths documented
- [ ] Reward unlock UI components built
- [ ] Quest completion triggers unlock system
- [ ] Locked/unlocked states shown clearly
- [ ] TypeScript compiles with no errors
- [ ] No RNG/random reward mechanics remain

---

## 🚀 Quick Start

1. Remove loot sounds from sound-system.ts
2. Create achievement-unlock-system.ts
3. Create reward UI components
4. Integrate with quest completion
5. Test unlock flow
6. Mark Task 4 complete

---

## 📝 Notes

- Keep it simple: Use existing UserAchievement table if possible
- Clear > Complex: Users should know exactly what they'll unlock
- Visual feedback: Animations and sounds for unlocks
- Progression visible: Show what's next to unlock

**Estimated Completion:** 1-2 hours  
**Dependencies:** None (Phase 3 schema sufficient)  
**Risk:** Low - mostly frontend + deterministic logic
