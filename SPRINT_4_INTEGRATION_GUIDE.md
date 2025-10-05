# Sprint 4 Integration Guide: Workout Session Enhancements

## Overview
This guide shows how to integrate the workout session enhancement components created in Sprint 4 into your workout session pages. These components work together to create a professional, data-rich workout tracking experience.

## Components

### 1. SetNotes
**Purpose**: Track notes per set during workouts  
**File**: `components/set-notes.tsx`  
**Variants**: SetNotes (full), QuickNotes (templates)

### 2. FailureIndicator
**Purpose**: Track sets taken to failure for progressive overload  
**File**: `components/failure-indicator.tsx`  
**Variants**: FailureIndicator (full), FailureCheckbox (compact), RPEFailureIndicator (with RPE)

### 3. WarmupToggle
**Purpose**: Mark warmup sets to exclude from volume calculations  
**File**: `components/warmup-toggle.tsx`  
**Variants**: WarmupToggle (full), WarmupCheckbox (compact), WarmupBadge (read-only), WarmupSuggester (percentage-based)

### 4. RestTimer
**Purpose**: Comprehensive rest timer with templates and notifications  
**File**: `components/rest-timer.tsx` (already exists - 606 lines)  
**Features**: Templates, custom durations, notifications, keyboard shortcuts, session tracking

---

## Integration Examples

### Basic Workout Session Page

```tsx
'use client'

import { useState } from 'react'
import { SetNotes } from '@/components/set-notes'
import { FailureIndicator } from '@/components/failure-indicator'
import { WarmupToggle } from '@/components/warmup-toggle'
import { RestTimer } from '@/components/rest-timer'

interface Set {
  id: string
  weight: number
  reps: number
  rpe?: number
  notes?: string
  isFailure?: boolean
  isWarmup?: boolean
}

export default function WorkoutSessionPage() {
  const [sets, setSets] = useState<Set[]>([])
  const [activeSetId, setActiveSetId] = useState<string | null>(null)

  const handleSaveNotes = (setId: string, notes: string) => {
    setSets(prev => prev.map(s => 
      s.id === setId ? { ...s, notes } : s
    ))
  }

  const handleToggleFailure = (setId: string) => {
    setSets(prev => prev.map(s => 
      s.id === setId ? { ...s, isFailure: !s.isFailure } : s
    ))
  }

  const handleToggleWarmup = (setId: string) => {
    setSets(prev => prev.map(s => 
      s.id === setId ? { ...s, isWarmup: !s.isWarmup } : s
    ))
  }

  return (
    <div className="space-y-6">
      {/* Rest Timer - Always visible */}
      <div className="fixed top-4 right-4 z-50">
        <RestTimer />
      </div>

      {/* Sets List */}
      <div className="space-y-4">
        {sets.map((set, index) => (
          <div key={set.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Set {index + 1}</h3>
              
              {/* Warmup Toggle */}
              <WarmupToggle
                isWarmup={set.isWarmup || false}
                onChange={() => handleToggleWarmup(set.id)}
                showLabel
              />
            </div>

            {/* Weight and Reps */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label>Weight (lbs)</label>
                <input type="number" value={set.weight} />
              </div>
              <div>
                <label>Reps</label>
                <input type="number" value={set.reps} />
              </div>
            </div>

            {/* Failure Indicator */}
            <div className="mb-4">
              <FailureIndicator
                isFailure={set.isFailure || false}
                rpe={set.rpe}
                onChange={() => handleToggleFailure(set.id)}
                showLabel
              />
            </div>

            {/* Set Notes */}
            <SetNotes
              notes={set.notes || ''}
              onSave={(notes) => handleSaveNotes(set.id, notes)}
              placeholder={`Notes for Set ${index + 1}...`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Compact Set Display (Table View)

```tsx
export function CompactSetTable() {
  const [sets, setSets] = useState<Set[]>([])

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Set</th>
          <th>Weight</th>
          <th>Reps</th>
          <th>Warmup</th>
          <th>Failure</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {sets.map((set, index) => (
          <tr key={set.id}>
            <td>{index + 1}</td>
            <td>
              <input type="number" value={set.weight} className="w-20" />
            </td>
            <td>
              <input type="number" value={set.reps} className="w-20" />
            </td>
            <td>
              <WarmupCheckbox
                isWarmup={set.isWarmup || false}
                onChange={() => handleToggleWarmup(set.id)}
              />
            </td>
            <td>
              <FailureCheckbox
                isFailure={set.isFailure || false}
                onChange={() => handleToggleFailure(set.id)}
              />
            </td>
            <td>
              <SetNotes
                notes={set.notes || ''}
                onSave={(notes) => handleSaveNotes(set.id, notes)}
                compact
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Warmup Suggester Integration

```tsx
export function ExerciseWithWarmupSuggestions() {
  const [workingWeight, setWorkingWeight] = useState(225)
  const [sets, setSets] = useState<Set[]>([])

  const handleSelectWarmup = (weight: number) => {
    const newSet: Set = {
      id: crypto.randomUUID(),
      weight,
      reps: 5,
      isWarmup: true
    }
    setSets([...sets, newSet])
  }

  return (
    <div className="space-y-4">
      {/* Warmup Suggester */}
      <WarmupSuggester
        workingWeight={workingWeight}
        onSelectWarmup={handleSelectWarmup}
      />

      {/* Existing Sets */}
      <div className="space-y-2">
        {sets.map((set, index) => (
          <div key={set.id} className="flex items-center gap-4">
            <span>Set {index + 1}</span>
            <span>{set.weight} lbs × {set.reps}</span>
            {set.isWarmup && <WarmupBadge />}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Quick Notes Templates

```tsx
export function SetWithQuickNotes() {
  const [selectedSet, setSelectedSet] = useState<Set | null>(null)

  return (
    <div className="space-y-4">
      {/* Set display */}
      <div className="border rounded-lg p-4">
        <h3>Bench Press - Set 3</h3>
        <p>225 lbs × 8 reps</p>

        {/* Quick Notes - 16 pre-built templates */}
        <QuickNotes
          onSelectNote={(note) => {
            if (selectedSet) {
              handleSaveNotes(selectedSet.id, note)
            }
          }}
        />

        {/* Or full SetNotes with editing */}
        <SetNotes
          notes={selectedSet?.notes || ''}
          onSave={(notes) => handleSaveNotes(selectedSet.id, notes)}
        />
      </div>
    </div>
  )
}
```

### RPE-Based Failure Tracking

```tsx
export function SetWithRPETracking() {
  const [set, setSet] = useState<Set>({
    id: '1',
    weight: 225,
    reps: 8,
    rpe: 8.5
  })

  return (
    <div className="space-y-4">
      {/* RPE Input */}
      <div>
        <label>RPE (Rate of Perceived Exertion)</label>
        <input
          type="number"
          min="1"
          max="10"
          step="0.5"
          value={set.rpe}
          onChange={(e) => setSet({ ...set, rpe: parseFloat(e.target.value) })}
        />
      </div>

      {/* RPE-Based Failure Indicator */}
      <RPEFailureIndicator
        rpe={set.rpe}
        onChange={(isFailure) => setSet({ ...set, isFailure })}
      />
    </div>
  )
}
```

---

## Volume Calculation with Warmups

```tsx
function calculateWorkingVolume(sets: Set[]): number {
  // Exclude warmup sets from volume calculations
  const workingSets = sets.filter(set => !set.isWarmup)
  
  return workingSets.reduce((total, set) => {
    return total + (set.weight * set.reps)
  }, 0)
}

function getFailureSets(sets: Set[]): number {
  return sets.filter(set => set.isFailure).length
}
```

---

## Progressive Overload Tracking

```tsx
export function ProgressiveOverloadMetrics() {
  const [sets, setSets] = useState<Set[]>([])

  const metrics = {
    totalVolume: calculateWorkingVolume(sets),
    failureSets: getFailureSets(sets),
    averageRPE: sets.filter(s => s.rpe).reduce((sum, s) => sum + s.rpe!, 0) / sets.filter(s => s.rpe).length,
    warmupSets: sets.filter(s => s.isWarmup).length,
    workingSets: sets.filter(s => !s.isWarmup).length
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h4>Total Volume</h4>
        <p className="text-2xl font-bold">{metrics.totalVolume.toLocaleString()} lbs</p>
        <p className="text-sm text-muted-foreground">{metrics.workingSets} working sets</p>
      </div>
      <div>
        <h4>Failure Sets</h4>
        <p className="text-2xl font-bold">{metrics.failureSets}</p>
        <p className="text-sm text-muted-foreground">Taken to failure</p>
      </div>
      <div>
        <h4>Average RPE</h4>
        <p className="text-2xl font-bold">{metrics.averageRPE.toFixed(1)}</p>
        <p className="text-sm text-muted-foreground">Intensity</p>
      </div>
    </div>
  )
}
```

---

## Keyboard Shortcuts

All components support keyboard shortcuts:

```tsx
// SetNotes
- Ctrl/Cmd + Enter: Save notes
- Escape: Cancel editing

// FailureIndicator
- F: Toggle failure
- R: Focus RPE input (if visible)

// WarmupToggle
- W: Toggle warmup status

// RestTimer (already has extensive shortcuts)
- Space: Start/Pause
- R: Reset
- 1-4: Select template
- Escape: Stop timer
```

---

## Best Practices

### 1. **Warmup Sets**
- Always mark warmup sets to exclude them from volume
- Use WarmupSuggester for common percentages (40%, 50%, 60%, 70%)
- Keep warmups visible in the UI with WarmupBadge

### 2. **Failure Tracking**
- Track failure sets for progressive overload analysis
- Use RPE-based tracking for more nuanced intensity data
- Show failure tooltip for education (RIR = Reps In Reserve)

### 3. **Set Notes**
- Use QuickNotes for common patterns (form checks, pain, PRs)
- Allow custom notes for unique situations
- Preserve notes across page refreshes

### 4. **Rest Timer**
- Position fixed in top-right corner
- Use templates for common rest periods (90s, 2m, 3m, 5m)
- Enable notifications for better UX

### 5. **Data Persistence**
```tsx
// Save to localStorage or database
const saveSet = async (set: Set) => {
  await fetch('/api/sets', {
    method: 'POST',
    body: JSON.stringify({
      ...set,
      notes: set.notes || null,
      isFailure: set.isFailure || false,
      isWarmup: set.isWarmup || false,
      rpe: set.rpe || null
    })
  })
}
```

---

## Testing Checklist

- [ ] SetNotes saves and cancels correctly
- [ ] QuickNotes templates insert properly
- [ ] FailureIndicator toggles state
- [ ] RPE input affects failure detection (≥9.5)
- [ ] WarmupToggle marks sets correctly
- [ ] WarmupSuggester calculates percentages accurately
- [ ] Volume calculations exclude warmup sets
- [ ] RestTimer notifications work
- [ ] Keyboard shortcuts function
- [ ] All components are accessible (ARIA labels)
- [ ] Mobile responsiveness

---

## Migration Path

If you have existing workout session pages:

1. **Add imports**
   ```tsx
   import { SetNotes } from '@/components/set-notes'
   import { FailureIndicator } from '@/components/failure-indicator'
   import { WarmupToggle } from '@/components/warmup-toggle'
   import { RestTimer } from '@/components/rest-timer'
   ```

2. **Update Set interface**
   ```tsx
   interface Set {
     // ... existing fields
     notes?: string
     isFailure?: boolean
     isWarmup?: boolean
     rpe?: number
   }
   ```

3. **Add components to UI**
   - Place RestTimer in fixed position
   - Add WarmupToggle to each set
   - Add FailureIndicator after reps
   - Add SetNotes at bottom of set card

4. **Update calculations**
   - Exclude warmup sets from volume
   - Track failure sets for analytics
   - Include notes in API payloads

5. **Test thoroughly**
   - Verify data saves correctly
   - Check keyboard shortcuts
   - Test mobile layout
   - Validate accessibility

---

## Next Steps

1. Integrate into `app/workout/session/page.tsx`
2. Add to exercise detail pages for history view
3. Include in analytics/progress tracking
4. Add to workout templates as default options
5. Document in user guide/onboarding

---

## Support

All components include:
- TypeScript types for type safety
- Accessibility features (ARIA labels, keyboard nav)
- Mobile-responsive design
- Dark mode support
- Loading states where applicable

For questions or issues, refer to the component source code for detailed implementation.
