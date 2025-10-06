# Phase 4 Task 7: Terminology Cleanup

## Goal
**Global find/replace of remaining gaming terminology to complete Phase 4 "Character Simplification"**

This is the final task of Phase 4 to systematically replace ALL gaming terms with professional fitness language throughout the codebase.

## Current Status

### Gaming Terms Still Present

Based on grep searches, the following gaming terms remain:

#### 1. **XP / Level Up / Level**
- `XP` → `Progress Points`
- `Level Up` → `Tier Up` or `Milestone Reached`
- `levelUp` sound effect
- `xp` reward type
- Total XP tracking

**Files Affected:**
- `lib/sound-system.ts` - `'levelup'`, `'xp'` sound effects
- `lib/quest-system.ts` - XP rewards (50 XP, 75 XP, 100 XP, etc.)
- `lib/challenge-system.ts` - XP rewards in challenges
- `lib/achievement-unlock-system.ts` - XP in reward processing
- `app/api/quests/claim-rewards/route.ts` - XP updates
- `hooks/use-quest-completion.ts` - XP tracking
- `components/social-media-export.tsx` - "XP earned" in workout stats
- Various documentation files (completed tasks)

#### 2. **Character**
- `Character` → `Profile` or `Athlete`
- Character sheet references
- Character stats
- `skillPoints` → remove or replace

**Files Affected:**
- `components/navigation/sidebar.tsx` - "Character" section
- `lib/api/character.ts` - Character system (needs review)
- `lib/api/social.ts` - Character data references
- `app/(dashboard)/character/` - Character pages
- `components/prestige-system.tsx` - Character references

#### 3. **Quest / Quests**
- `Quest` → `Challenge` or `Goal` 
- `quest` types and status
- Quest system references

**Files Affected:**
- `lib/quest-system.ts` - **ENTIRE FILE** still uses Quest terminology
- `app/api/quests/` - Quest API routes
- Quest references in documentation (already completed tasks)

#### 4. **Skill Points**
- `skillPoints` → Remove entirely (replaced by milestones)
- Skill point allocation

**Files Affected:**
- `lib/api/character.ts` - `skillPoints` field
- `components/prestige-system.tsx` - Skill points allocation UI
- `app/(dashboard)/character/page.tsx` - Skill points display
- `app/(dashboard)/character/skills/page.tsx` - Skill point checks

#### 5. **Loot (already removed from most places)**
- Few remaining references in documentation
- Already removed from sound-system and quest-system

#### 6. **Inventory**
- Most references are to `PlateInventory` (legitimate plate tracking - KEEP)
- Old gaming inventory already deleted

**Keep These:**
- `PlateInventory` - Real plate tracking system
- `UserEquipment` - Real equipment ownership
- All equipment-related "inventory" (legitimate use)

#### 7. **Stats** (Context-Dependent)
- Keep: `stats` when referring to training metrics (legitimate)
- Keep: `getInventoryStats()` (equipment statistics)
- Keep: User stats for metrics
- Review: Any "stats" that imply RPG character stats

---

## Implementation Steps

### Step 1: Remove XP/Level Terminology ⏳

**A. Sound System** (`lib/sound-system.ts`)

Remove or rename:
- `'levelup'` sound type → `'tier-up'` or `'milestone-reached'`
- `'xp'` sound type → `'progress'` or `'points-earned'`
- `playLevelUp()` method → `playTierUp()`
- `playXP()` method → `playProgress()`

**B. Quest System** (`lib/quest-system.ts`)

Replace all XP reward descriptions:
- `'50 XP'` → `'+50 Progress Points'`
- `'75 XP'` → `'+75 Progress Points'`
- `'100 XP'` → `'+100 Progress Points'`
- etc. for all XP amounts

Update reward type (already done in some files):
- `type: 'xp'` → `type: 'progress'` or keep as 'xp' but update descriptions

**C. Challenge System** (`lib/challenge-system.ts`)

Already mostly updated to "Progress Points", verify all instances.

**D. Achievement System** (`lib/achievement-unlock-system.ts`)

Check reward processing for XP terminology.

**E. API Routes**

- `app/api/quests/claim-rewards/route.ts` - Update XP update comments

**F. Hooks**

- `hooks/use-quest-completion.ts` - Check for XP references

**G. Social/Export Features**

- `components/social-media-export.tsx` - Replace `"${workout.xpEarned.toLocaleString()} XP earned"` with progress/points

---

### Step 2: Character → Profile/Athlete ⏳

**A. Sidebar Navigation** (`components/navigation/sidebar.tsx`)

```tsx
// FROM:
label: 'Character',
items: [
  { label: 'Character Sheet', href: '/character', icon: User },
]

// TO:
label: 'Profile',
items: [
  { label: 'Athlete Profile', href: '/profile', icon: User },
]
```

**B. Character API** (`lib/api/character.ts`)

Review and decide:
- Keep file (it's core user data)?
- Rename to `lib/api/profile.ts` or `lib/api/athlete.ts`?
- Update all "character" terminology in comments

**C. Character Pages**

- Rename `app/(dashboard)/character/` → `app/(dashboard)/profile/`
- Update all "Character" titles to "Profile" or "Athlete"

**D. Social API** (`lib/api/social.ts`)

Update any `characterClass` or character data references.

---

### Step 3: Remove Skill Points System ⏳

**A. Character API** (`lib/api/character.ts`)

Remove:
- `skillPoints: number` field
- Skill points calculation logic
- `availablePoints` references

**B. Prestige System** (`components/prestige-system.tsx`)

Remove entire skill points tab/section:
- `availableSkillPoints` prop
- Skill point allocation UI
- Skill point bonuses in prestige tiers

**C. Character Page** (`app/(dashboard)/character/page.tsx`)

Remove:
- Skill points display
- Any skill point UI elements

**D. Skills Page** (`app/(dashboard)/character/skills/page.tsx`)

Remove:
- `availablePoints` checks
- Skill point unlock logic

---

### Step 4: Quest → Challenge (Complete Migration) ⏳

**Context:** Phase 4 Task 5 created `lib/challenge-system.ts` as the replacement, but `lib/quest-system.ts` still exists and uses Quest terminology.

**Decision Options:**

**Option A: Keep Both (Deprecated Migration)**
- Mark `lib/quest-system.ts` as deprecated
- Add comments redirecting to challenge-system
- Leave existing quest API routes for backward compatibility
- Update all UI to use challenge-system only

**Option B: Full Migration (Recommended)**
- Delete `lib/quest-system.ts` entirely
- Rename `app/api/quests/` → `app/api/challenges/`
- Update all imports to use challenge-system
- Database migration if needed

**Recommended: Option B** - Complete the migration

**Files to Update:**
1. Delete `lib/quest-system.ts` (already replaced by challenge-system)
2. Rename `app/api/quests/` → `app/api/challenges/`
3. Update any remaining quest imports

---

### Step 5: Verify Stats Usage ⏳

**Keep These (Legitimate):**
- `stats` for training metrics
- `getInventoryStats()` for equipment
- User performance stats
- Workout stats summaries

**Review These:**
- Any "character stats" references
- RPG-style stat displays

---

## Terminology Mapping (Complete Reference)

| Old (Gaming) | New (Professional) |
|--------------|-------------------|
| XP | Progress Points |
| Level Up | Tier Up / Milestone Reached |
| Character | Profile / Athlete |
| Quest | Challenge / Goal |
| Skill Points | (Removed - replaced by milestones) |
| Loot | Achievements ✅ Already done |
| Inventory | Equipment ✅ Already done |
| Stats | Metrics / Performance (context-dependent) |

---

## Files to Modify

### Critical Files (Must Update)

1. ✅ `lib/sound-system.ts` - Remove/rename level-up and XP sounds
2. ✅ `lib/quest-system.ts` - **DELETE** (replaced by challenge-system) OR update all terminology
3. ✅ `lib/challenge-system.ts` - Verify Progress Points usage
4. ✅ `lib/achievement-unlock-system.ts` - Check XP references
5. ✅ `lib/api/character.ts` - Remove skill points, review character terminology
6. ✅ `components/navigation/sidebar.tsx` - Character → Profile
7. ✅ `components/prestige-system.tsx` - Remove skill points system
8. ✅ `components/social-media-export.tsx` - Update XP earned text
9. ✅ `app/(dashboard)/character/` - Rename to profile, update all pages
10. ✅ `app/api/quests/` - Rename to challenges OR delete if obsolete
11. ✅ `hooks/use-quest-completion.ts` - Update XP references

### Documentation (Low Priority)
- Already-completed task documentation can stay as-is (historical record)
- Only update active/future-facing docs

---

## Success Criteria

- [ ] Zero "XP" references in active code (except historical docs)
- [ ] Zero "Level Up" references in active code
- [ ] Zero "Character" references (replaced with Profile/Athlete)
- [ ] Zero "Quest" references (replaced with Challenge/Goal)
- [ ] Zero "Skill Points" references (system removed)
- [ ] All sound effects use professional terminology
- [ ] Sidebar navigation uses professional terms
- [ ] All UI text uses professional fitness language
- [ ] No gaming terminology in user-facing features

---

## Testing Checklist

After completing changes:

1. [ ] Sound effects play correctly with new names
2. [ ] Challenge system works (replacing quests)
3. [ ] Profile pages accessible (if renamed from character)
4. [ ] No broken imports from quest-system
5. [ ] Social media export shows correct text
6. [ ] Prestige system works without skill points
7. [ ] Navigation links work correctly
8. [ ] No TypeScript errors
9. [ ] All user-facing text is professional

---

## Estimated Time

- **Step 1 (XP/Level):** 1 hour
- **Step 2 (Character):** 1-2 hours (depends on file renaming scope)
- **Step 3 (Skill Points):** 30-45 min
- **Step 4 (Quest Migration):** 30 min - 1 hour
- **Step 5 (Verify Stats):** 15-30 min
- **Testing:** 30 min

**Total: 4-6 hours**

---

## Next Steps After Task 7

Once Task 7 is complete:
- **Phase 4 = 100% COMPLETE** ✅
- All fantasy RPG elements removed
- Professional fitness app terminology throughout
- Ready for production deployment

Then move to:
- **Phase 5:** Social features (if not already complete)
- **Phase 6:** Performance optimization
- **Phase 7:** PWA/Offline features
