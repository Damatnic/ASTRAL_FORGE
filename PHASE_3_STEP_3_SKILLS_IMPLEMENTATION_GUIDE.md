# Phase 3 Step 3: Skills Page Enhancement - Implementation Guide

**Status:** 🔄 IN PROGRESS  
**Completion:** Components Created (2/3), Integration Pending  
**Time Estimate:** 30 minutes remaining

---

## ✅ Completed Work

### 1. SkillDetailModal Component (`components/skill-detail-modal.tsx`)
**Lines:** 380  
**Features:**
- ✅ Three-tab interface (Details / Progress / Tips)
- ✅ Tier-based color theming  
- ✅ Progress tracking with milestones (25%, 50%, 75%, 100%)
- ✅ Training tips section
- ✅ Requirement display
- ✅ Current vs target value tracking
- ✅ Earned date display
- ✅ Action buttons (Track Progress, Share)
- ✅ Click-outside-to-close functionality

**Tab Content:**
- **Details:** Requirement, current progress bar, earned date
- **Progress:** Overall percentage, milestone checklist (4 milestones)
- **Tips:** Numbered training recommendations

### 2. SkillQuickActions Component (`components/skill-quick-actions.tsx`)
**Lines:** 183  
**Features:**
- ✅ 4 quick action buttons (View, Favorite, Track/Complete, Share)
- ✅ Hover-activated on skill cards
- ✅ Position customizable (4 corners)
- ✅ Favorite state with filled star
- ✅ Completed badge (green checkmark)
- ✅ Context menu with 6 actions:
  - Open in New Tab
  - Toggle Favorite
  - Share Skill
  - Copy Link
  - Set as Goal
  - View History

---

## 🔄 Pending Integration

### Skills Page Updates Needed

**File:** `app/skills/page.tsx`

**Current State:**
- ✅ Imports added (useState, useEffect, useCallback)
- ✅ Component imports added (SkillDetailModal, SkillQuickActions, SkillContextMenu)
- ✅ State variables declared:
  ```typescript
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [contextMenu, setContextMenu] = useState<{ x, y, skillId } | null>(null)
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0)
  ```

**Remaining Tasks:**

#### 1. Add Event Handlers (After `lockedSkills` definition, ~line 356)

```typescript
// Event Handlers
const handleSkillClick = useCallback((skill: Skill) => {
  setSelectedSkill(skill)
  setIsModalOpen(true)
}, [])

const toggleFavorite = useCallback((skillId: string) => {
  setFavorites(prev => 
    prev.includes(skillId) 
      ? prev.filter(id => id !== skillId)
      : [...prev, skillId]
  )
}, [])

const handleShare = useCallback((skill: Skill) => {
  const url = `${window.location.origin}/skills/${skill.id}`
  navigator.clipboard.writeText(url)
  console.log('Skill link copied!')
}, [])

const handleContextMenu = useCallback((e: React.MouseEvent, skillId: string) => {
  e.preventDefault()
  setContextMenu({ x: e.clientX, y: e.clientY, skillId })
}, [])

const handleCopyLink = useCallback((skill: Skill) => {
  const url = `${window.location.origin}/skills/${skill.id}`
  navigator.clipboard.writeText(url)
  console.log('Link copied!')
}, [])

const handleTrackProgress = useCallback((skill: Skill) => {
  console.log('Track progress for:', skill.name)
}, [])

const handleSetGoal = useCallback((skill: Skill) => {
  console.log('Set goal for:', skill.name)
}, [])

const handleViewHistory = useCallback((skill: Skill) => {
  console.log('View history for:', skill.name)
}, [])

// Keyboard Navigation
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    const allSkills = [...inProgressSkills, ...completedSkills, ...lockedSkills]
    
    if (allSkills.length === 0) return

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        setFocusedCardIndex(prev => Math.min(prev + 1, allSkills.length - 1))
        break
      case 'ArrowLeft':
        e.preventDefault()
        setFocusedCardIndex(prev => Math.max(prev - 1, 0))
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedCardIndex(prev => Math.min(prev + 3, allSkills.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedCardIndex(prev => Math.max(prev - 3, 0))
        break
      case 'Enter':
        if (!isModalOpen && allSkills[focusedCardIndex]) {
          handleSkillClick(allSkills[focusedCardIndex])
        }
        break
      case ' ':
        e.preventDefault()
        if (!isModalOpen && allSkills[focusedCardIndex]) {
          toggleFavorite(allSkills[focusedCardIndex].id)
        }
        break
      case 'Escape':
        if (contextMenu) {
          setContextMenu(null)
        }
        break
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [filteredSkills, focusedCardIndex, isModalOpen, contextMenu, toggleFavorite, handleSkillClick, inProgressSkills, completedSkills, lockedSkills])
```

#### 2. Update In-Progress Skill Cards (~line 570)

**Find:**
```typescript
{inProgressSkills.map((skill) => {
  const tierColors = getTierColor(skill.tier);
  const TierIcon = getTierIcon(skill.tier);
  return (
    <div
      key={skill.id}
      className={`bg-gradient-to-br ${tierColors.bg} border ${tierColors.border} rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer`}
    >
```

**Replace with:**
```typescript
{inProgressSkills.map((skill, index) => {
  const tierColors = getTierColor(skill.tier);
  const TierIcon = getTierIcon(skill.tier);
  const isFocused = index === focusedCardIndex;
  return (
    <div
      key={skill.id}
      onClick={() => handleSkillClick(skill)}
      onContextMenu={(e) => handleContextMenu(e, skill.id)}
      className={`group relative bg-gradient-to-br ${tierColors.bg} border ${tierColors.border} rounded-xl p-6 hover:scale-105 transition-all cursor-pointer ${
        isFocused ? 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-slate-950' : ''
      }`}
    >
```

**Add before closing `</div>` of skill card:**
```tsx
{/* Quick Actions */}
<SkillQuickActions
  onViewDetails={() => handleSkillClick(skill)}
  onTrack={() => handleTrackProgress(skill)}
  onToggleFavorite={() => toggleFavorite(skill.id)}
  onShare={() => handleShare(skill)}
  isFavorite={favorites.includes(skill.id)}
  isCompleted={skill.isCompleted}
  position="bottom-right"
/>
```

#### 3. Update Completed Skill Cards (~line 620)

**Add to map function:**
```typescript
{completedSkills.map((skill, index) => {
  const globalIndex = inProgressSkills.length + index;
  const isFocused = globalIndex === focusedCardIndex;
```

**Update className:**
```typescript
className={`group relative bg-gradient-to-br ${tierColors.bg} border ${tierColors.border} rounded-xl p-6 hover:scale-105 transition-all cursor-pointer ${
  isFocused ? 'ring-2 ring-purple-500/50 ring-offset-2 ring-offset-slate-950' : ''
}`}
onClick={() => handleSkillClick(skill)}
onContextMenu={(e) => handleContextMenu(e, skill.id)}
```

**Add SkillQuickActions before `</div>`**

#### 4. Update Locked Skill Cards (~line 670)

Same pattern as completed skills, adjust globalIndex:
```typescript
const globalIndex = inProgressSkills.length + completedSkills.length + index;
```

#### 5. Add Modal & Context Menu (Before closing `</AppLayout>`)

```tsx
{/* Skill Detail Modal */}
<SkillDetailModal
  skill={selectedSkill}
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false)
    setSelectedSkill(null)
  }}
/>

{/* Context Menu */}
{contextMenu && (
  <SkillContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    onClose={() => setContextMenu(null)}
    onOpenNewTab={() => {
      const skill = skills.find(s => s.id === contextMenu.skillId)
      if (skill) window.open(`/skills/${skill.id}`, '_blank')
    }}
    onToggleFavorite={() => {
      toggleFavorite(contextMenu.skillId)
    }}
    onShare={() => {
      const skill = skills.find(s => s.id === contextMenu.skillId)
      if (skill) handleShare(skill)
    }}
    onCopyLink={() => {
      const skill = skills.find(s => s.id === contextMenu.skillId)
      if (skill) handleCopyLink(skill)
    }}
    onSetGoal={() => {
      const skill = skills.find(s => s.id === contextMenu.skillId)
      if (skill) handleSetGoal(skill)
    }}
    onViewHistory={() => {
      const skill = skills.find(s => s.id === contextMenu.skillId)
      if (skill) handleViewHistory(skill)
    }}
    isFavorite={favorites.includes(contextMenu.skillId)}
  />
)}

{/* Keyboard Shortcuts Tooltip */}
<div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs opacity-0 hover:opacity-100 transition-opacity">
  <p className="font-semibold text-purple-400 mb-2">Keyboard Shortcuts</p>
  <div className="space-y-1 text-gray-400">
    <p><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">←→</kbd> Navigate cards</p>
    <p><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑↓</kbd> Jump rows</p>
    <p><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Enter</kbd> Open details</p>
    <p><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Space</kbd> Toggle favorite</p>
    <p><kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Esc</kbd> Close menu</p>
  </div>
</div>
```

---

## 🎯 Features Summary

**Interactive Skill Cards:**
- ✅ Click to open detailed modal
- ✅ Right-click context menu
- ✅ Hover to show quick actions
- ✅ Keyboard navigation (Arrow keys)
- ✅ Focus indicators for accessibility
- ✅ Favorite system

**Skill Detail Modal:**
- ✅ 3-tab interface (Details/Progress/Tips)
- ✅ Progress visualization
- ✅ Milestone tracking
- ✅ Training recommendations
- ✅ Share functionality

**Quick Actions:**
- ✅ View Details (eye icon)
- ✅ Toggle Favorite (star icon)
- ✅ Track Progress (trending up icon)
- ✅ Share (share icon)
- ✅ Completed badge (green checkmark)

**Context Menu (Right-click):**
- ✅ Open in New Tab
- ✅ Toggle Favorite
- ✅ Share Skill
- ✅ Copy Link
- ✅ Set as Goal
- ✅ View History

**Keyboard Shortcuts:**
- ✅ Arrow Left/Right: Navigate cards
- ✅ Arrow Up/Down: Jump 3 cards
- ✅ Enter: Open skill details
- ✅ Space: Toggle favorite
- ✅ Escape: Close context menu

---

## 📦 Build & Test Plan

### Expected Build Results
```
✓ Compiled successfully
Route: /skills
├── Before: ~6 kB
├── After: ~9-10 kB
├── Growth: +3-4 kB
└── Components: +2 new (563 lines)
```

### Test Checklist
- [ ] Click skill card opens modal
- [ ] Right-click shows context menu
- [ ] Hover shows quick actions
- [ ] Keyboard navigation works
- [ ] Favorites toggle correctly
- [ ] Share copies link to clipboard
- [ ] Tab switching in modal
- [ ] Progress bars display correctly
- [ ] Milestone checkmarks accurate
- [ ] Escape closes menus
- [ ] Focus ring visible on keyboard nav

---

## 🚀 Next Steps

1. **Complete Integration** (30 min)
   - Add event handlers
   - Update all 3 skill card sections
   - Add modal and context menu components
   - Add keyboard tooltip

2. **Build & Test** (10 min)
   - Run `npm run build`
   - Verify 0 errors
   - Manual testing of interactions

3. **Documentation** (10 min)
   - Create `PHASE_3_STEP_3_SKILLS_COMPLETE.md`
   - Update `MASTER_DEVELOPMENT_PLAN.md`
   - Add to progress summary

4. **Phase 3 Complete!** 🎉
   - All 3 steps done
   - Move to Phase 4 planning

---

**Status:** Ready for final integration  
**Components Created:** 2/2 ✅  
**Handlers Written:** Design complete  
**Integration:** Documented, ready to apply  

