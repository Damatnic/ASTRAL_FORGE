# 🤖 Agent Workflow & Implementation Guide

## 🎯 Agent Principles

1. **NEVER SIMPLIFY** - Always deliver complete, production-ready implementations
2. **ALWAYS TEST** - Every component must have comprehensive test coverage
3. **FIX ALL ERRORS** - When encountering errors, fix them immediately
4. **FOLLOW THE PLAN** - Work through the todo list systematically
5. **MARK PROGRESS** - Update todo status as you work (pending → in_progress → completed)

---

## 📋 How to Use the Todo List

### Check Current State
```
Use tool: mcp_todos_todo_read
```

### Start Working on a Task
```
1. Read current todos
2. Select next high-priority pending task
3. Mark it as in_progress
4. Begin implementation
5. Mark as completed when done
6. Repeat
```

### Update Task Status
```
Use tool: mcp_todos_todo_write
- Change status from "pending" to "in_progress" BEFORE starting
- Change status from "in_progress" to "completed" AFTER finishing
- Add notes in ADR field about decisions made
```

---

## 🏗️ Implementation Workflow

### For Each Task:

#### 1. **Analysis Phase**
- Read relevant existing files
- Understand current implementation
- Identify what needs to change
- Check for dependencies

#### 2. **Planning Phase**
- Determine component structure
- Plan props/interfaces
- Consider edge cases
- Plan test coverage

#### 3. **Implementation Phase**
- Create/modify files
- Follow design system
- Add TypeScript types
- Include comments
- Handle errors
- Add loading states

#### 4. **Testing Phase**
- Write unit tests
- Write integration tests (if applicable)
- Run tests
- Fix any failures
- Verify coverage

#### 5. **Verification Phase**
- Check for build errors
- Verify visual appearance
- Test interactions
- Check accessibility
- Validate performance

#### 6. **Documentation Phase**
- Update comments
- Add JSDoc
- Update README (if needed)
- Note in ADR

---

## 🎨 Design System Quick Reference

### Colors

```typescript
// Use these Tailwind classes consistently
bg-black         // Pure black (#000000)
bg-gray-900      // Dark gray (#111827)
bg-gray-800      // Medium dark gray (#1f2937)

text-cyan-400    // Neon cyan text
text-cyan-500    // Brighter cyan
border-cyan-500  // Cyan borders

// Gradients
from-cyan-500 to-blue-500
from-yellow-500 to-orange-500
from-purple-500 to-pink-500

// Glows
shadow-lg shadow-cyan-500/50
shadow-xl shadow-blue-500/50
```

### Common Patterns

**Gaming Card:**
```tsx
<div className="
  bg-gray-900/80 
  backdrop-blur-md 
  border-2 border-cyan-500/30 
  rounded-xl 
  p-6 
  shadow-lg shadow-cyan-500/20
  hover:border-cyan-500/60
  hover:shadow-cyan-500/40
  transition-all duration-300
">
  {children}
</div>
```

**Gaming Button:**
```tsx
<button className="
  px-6 py-3 
  bg-gradient-to-r from-cyan-500 to-blue-500 
  hover:from-cyan-400 hover:to-blue-400
  rounded-lg 
  font-bold 
  text-white
  shadow-lg shadow-cyan-500/30
  transition-all duration-200
  active:scale-95
">
  {label}
</button>
```

**Stat Bar:**
```tsx
<div className="w-full h-4 bg-gray-900 border border-cyan-700 rounded-full overflow-hidden">
  <div 
    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
    style={{ width: `${percent}%` }}
  />
</div>
```

---

## 🧪 Testing Patterns

### Component Test Template
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from './component-name'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName {...props} />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles interaction', () => {
    const handleClick = jest.fn()
    render(<ComponentName onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('displays correct state', () => {
    const { rerender } = render(<ComponentName value={50} />)
    expect(screen.getByText('50')).toBeInTheDocument()
    
    rerender(<ComponentName value={75} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })
})
```

### Integration Test Template
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Feature Flow', () => {
  it('completes full workflow', async () => {
    render(<ParentComponent />)
    
    // Step 1
    await userEvent.click(screen.getByText('Start'))
    
    // Step 2
    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument()
    })
    
    // Step 3
    await userEvent.click(screen.getByText('Complete'))
    
    // Verify
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })
})
```

---

## 🚨 Common Pitfalls to Avoid

### ❌ DON'T:
- Skip tests
- Hardcode values that should be dynamic
- Ignore accessibility
- Use inline styles (use Tailwind)
- Leave console.logs in production code
- Simplify implementations
- Skip error handling
- Forget loading states
- Ignore TypeScript errors
- Leave TODOs in code

### ✅ DO:
- Write comprehensive tests
- Use TypeScript types properly
- Add ARIA labels
- Use Tailwind classes
- Handle all error cases
- Add loading states
- Fix all TypeScript errors
- Complete all implementations
- Add proper error boundaries
- Document complex logic

---

## 📁 File Organization

### Component Structure
```typescript
// components/component-name.tsx

'use client' // If client-side

import { useState, useEffect } from 'react'

/**
 * Component Description
 * 
 * @param prop1 - Description
 * @param prop2 - Description
 */

interface ComponentNameProps {
  prop1: string
  prop2: number
  onAction?: () => void
}

export function ComponentName({ 
  prop1, 
  prop2, 
  onAction 
}: ComponentNameProps) {
  // State
  const [state, setState] = useState<Type>(initialValue)

  // Effects
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    }
  }, [dependencies])

  // Handlers
  const handleSomething = () => {
    // Logic
  }

  // Render
  return (
    <div className="gaming-card">
      {/* Content */}
    </div>
  )
}
```

### Page Structure
```typescript
// app/path/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { Component1 } from '@/components/component1'
import { Component2 } from '@/components/component2'

export default function PageName() {
  const [data, setData] = useState<Type | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/endpoint')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingScreen />
  if (error) return <ErrorScreen error={error} />
  if (!data) return <EmptyState />

  return (
    <div className="min-h-screen bg-black">
      {/* Content */}
    </div>
  )
}
```

---

## 🎯 Priority Order

### Phase 1: Critical Foundation (Do First)
1. Remove minimalist theme
2. Remove classic view references
3. Create particle background
4. Create gaming layout
5. Update tailwind config
6. Update globals.css

### Phase 2: Core Transformations (Do Next)
1. Landing page
2. Main dashboard
3. The Forge
4. Workout session
5. Exercises page
6. Programs page

### Phase 3: Supporting Pages (Then)
1. Progress
2. Metrics
3. Goals
4. Settings
5. Templates

### Phase 4: New Features (After)
1. Skill tree
2. Inventory
3. Guild
4. Leaderboard

### Phase 5: Polish (Finally)
1. Animations
2. Sound
3. Notifications
4. Loading screens

---

## 🔍 Quality Checklist

Before marking a task as completed, verify:

- [ ] TypeScript compiles without errors
- [ ] Component renders without errors
- [ ] Props are properly typed
- [ ] Tests written and passing
- [ ] Accessibility labels added
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Responsive design works
- [ ] Gaming aesthetic applied
- [ ] No console errors
- [ ] No hardcoded values
- [ ] Documentation/comments added
- [ ] Follows design system
- [ ] Performance is acceptable

---

## 🚀 Ready to Start?

1. Run: `mcp_todos_todo_read` to see current state
2. Pick the first high-priority "pending" task
3. Mark it "in_progress"
4. Follow the implementation workflow
5. Test thoroughly
6. Mark "completed"
7. Move to next task

**Remember: COMPLETE implementations only. No shortcuts. Full test coverage. Fix all errors.**

Let's forge something legendary! 🔨⚡
