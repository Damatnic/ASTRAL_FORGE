# Sprint 3 - Confirmation Dialogs & Loading Skeletons

## How to Use Confirmation Dialog

### Basic Usage

```typescript
import { useState } from 'react'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function YourComponent() {
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteAPI()
      setShowDialog(false)
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setShowDialog(true)}>
        Delete Program
      </button>

      <ConfirmDialog
        isOpen={showDialog}
        title="Delete Program?"
        message="Are you sure you want to delete this program? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDialog(false)}
        loading={loading}
      />
    </>
  )
}
```

### Dialog Variants

- **danger**: Red button for destructive actions (delete, remove, etc.)
- **primary**: Purple gradient for normal confirmations
- **success**: Green button for positive confirmations

## How to Use Loading Skeletons

### Replace Loading Spinners

**Before:**
```typescript
if (loading) {
  return <div>Loading...</div>
}
```

**After:**
```typescript
import { ProgramDetailSkeleton } from '@/components/skeleton'

if (loading) {
  return <ProgramDetailSkeleton />
}
```

### Available Skeleton Components

1. **Skeleton** - Base component for custom skeletons
```typescript
<Skeleton variant="text" width="60%" height={20} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={200} height={100} />
<Skeleton variant="text" count={3} /> // Multiple lines
```

2. **CardSkeleton** - Generic card placeholder
```typescript
<CardSkeleton />
```

3. **TableSkeleton** - Table row placeholders
```typescript
<TableSkeleton rows={10} />
```

4. **WorkoutCardSkeleton** - Workout card placeholder
```typescript
<WorkoutCardSkeleton />
```

5. **ExerciseListSkeleton** - Exercise list placeholder
```typescript
<ExerciseListSkeleton count={5} />
```

6. **ProgramDetailSkeleton** - Full program page placeholder
```typescript
<ProgramDetailSkeleton />
```

## Integration Examples

### Program List Page

```typescript
if (loading) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <WorkoutCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

### Exercise Library

```typescript
if (loading) {
  return <ExerciseListSkeleton count={10} />
}
```

### Workout Session

```typescript
if (loading) {
  return (
    <div className="space-y-6">
      <CardSkeleton />
      <ExerciseListSkeleton count={5} />
    </div>
  )
}
```

## Benefits

### Confirmation Dialogs
- ✅ Prevents accidental destructive actions
- ✅ Consistent UX across the app
- ✅ Built-in loading states
- ✅ Keyboard accessible (ESC to close)
- ✅ Smooth animations

### Loading Skeletons
- ✅ Better perceived performance
- ✅ Shows structure while loading
- ✅ Reduces layout shift
- ✅ More professional than spinners
- ✅ Maintains visual hierarchy

## Next Steps

To complete Sprint 3 integration:

1. **Program Detail Page** (`app/programs/[id]/page.tsx`)
   - Replace window.confirm with ConfirmDialog
   - Replace loading div with ProgramDetailSkeleton

2. **Programs List Page** (`app/programs/page.tsx`)
   - Add loading state
   - Show WorkoutCardSkeleton while loading

3. **Exercise Pages** (`app/exercises/*`)
   - Add ExerciseListSkeleton
   - Add confirmation dialogs for exercise deletion

4. **Workout Session** (`app/workout/session/page.tsx`)
   - Use CardSkeleton for loading state
   - Add confirmation before ending workout early
