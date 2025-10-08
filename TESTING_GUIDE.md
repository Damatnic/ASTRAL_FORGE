# Testing Best Practices & Patterns Guide

**ASTRAL POWER Testing Documentation**  
**Date:** October 7, 2025  
**Phase:** Phase 8 - Testing & QA

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Environment Setup](#testing-environment-setup)
3. [Mock Patterns](#mock-patterns)
4. [Component Testing](#component-testing)
5. [API Route Testing](#api-route-testing)
6. [Utility & Algorithm Testing](#utility--algorithm-testing)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### Testing Framework
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **Playwright** - E2E testing (future)

### Test Statistics
```
✅ 213/214 tests passing (99.5%)
✅ 17/17 test suites passing (100%)
⏸️  1 test skipped (intentional)
❌ 0 failures
```

### Coverage Goals
- **Target:** 70%+ overall coverage
- **Critical paths:** 90%+ coverage
- **New features:** 80%+ coverage

---

## Testing Environment Setup

### Jest Configuration

Our Jest setup supports both Node.js and browser environments:

```javascript
// jest.config.js
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom', // Default for components
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
  ],
}
```

### Test Environment Per File

**Components (Browser/jsdom):**
```typescript
// Automatically uses jsdom environment
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
```

**API Routes (Node):**
```typescript
/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/route'
```

---

## Mock Patterns

### 1. Next.js Server Components

**Problem:** `NextResponse` and `Request` not available in Node test environment

**Solution:** Mock at module level before imports

```typescript
// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}))
```

### 2. Request Constructor Mock

**For API route tests that create Request objects:**

```typescript
// Mock Request constructor for Node.js environment
global.Request = class Request {
  url: string
  method: string
  body: any
  
  constructor(url: string, init?: { method?: string; body?: string }) {
    this.url = url
    this.method = init?.method || 'GET'
    this.body = init?.body
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
} as any
```

### 3. Prisma Mock

**Standard pattern for database mocking:**

```typescript
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // Add other models as needed
  },
}))

// In tests
import { prisma } from '@/lib/prisma'

beforeEach(() => {
  jest.clearAllMocks()
})

it('should fetch user', async () => {
  (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
  
  const result = await getUserById('123')
  
  expect(prisma.user.findUnique).toHaveBeenCalledWith({
    where: { id: '123' }
  })
  expect(result).toEqual(mockUser)
})
```

### 4. Fetch Mock

**For client-side API calls:**

```typescript
global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

it('should fetch data', async () => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ data: 'test' })
  })
  
  const result = await fetchData()
  
  expect(global.fetch).toHaveBeenCalledWith('/api/endpoint')
  expect(result).toEqual({ data: 'test' })
})
```

---

## Component Testing

### Basic Component Test Structure

```typescript
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<MyComponent />)
    
    expect(screen.getByText(/expected text/i)).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    render(<MyComponent />)
    
    const button = screen.getByRole('button', { name: /click me/i })
    await userEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
})
```

### Query Selector Best Practices

**Priority (most to least accessible):**

1. **getByRole** - Best for accessibility
```typescript
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })
screen.getByRole('heading', { name: /title/i })
```

2. **getByLabelText** - For form inputs with labels
```typescript
screen.getByLabelText(/email address/i)
```

3. **getByText** - For text content
```typescript
screen.getByText(/welcome/i)
```

4. **getByTestId** - Last resort
```typescript
screen.getByTestId('custom-element')
```

### Handling Multiple Elements

```typescript
// When multiple elements match
const buttons = screen.getAllByRole('button', { name: '9' })
await userEvent.click(buttons[0]) // Click first one
```

### Testing with Providers

```typescript
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ToastProvider>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </ToastProvider>
  )
}

it('should work with providers', () => {
  renderWithProviders(<MyComponent />)
  // ... test
})
```

---

## API Route Testing

### GET Endpoint Test

```typescript
/**
 * @jest-environment node
 */
import { GET } from '@/app/api/users/route'
import { prisma } from '@/lib/prisma'

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return users', async () => {
    const mockUsers = [{ id: '1', name: 'Test' }]
    
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers)

    const request = new Request('http://localhost:3000/api/users')
    const response = await GET(request)
    const data = await response.json()

    expect(data).toEqual(mockUsers)
    expect(response.status).toBe(200)
  })

  it('should handle errors', async () => {
    ;(prisma.user.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    )

    const request = new Request('http://localhost:3000/api/users')
    const response = await GET(request)

    expect(response.status).toBe(500)
  })
})
```

### POST Endpoint Test

```typescript
it('should create user', async () => {
  const newUser = { name: 'Test User', email: 'test@example.com' }
  const createdUser = { id: '1', ...newUser }
  
  ;(prisma.user.create as jest.Mock).mockResolvedValue(createdUser)

  const request = new Request('http://localhost:3000/api/users', {
    method: 'POST',
    body: JSON.stringify(newUser),
  })
  
  const response = await POST(request)
  const data = await response.json()

  expect(prisma.user.create).toHaveBeenCalledWith({
    data: expect.objectContaining(newUser)
  })
  expect(data).toEqual(createdUser)
})
```

---

## Utility & Algorithm Testing

### Pure Function Testing

```typescript
describe('calculateVolume', () => {
  it('should calculate total volume correctly', () => {
    const workouts = [
      { sets: 3, reps: 10, weight: 100 },
      { sets: 4, reps: 8, weight: 120 },
    ]
    
    const result = calculateVolume(workouts)
    
    expect(result).toBe(6840) // (3*10*100) + (4*8*120)
  })

  it('should handle empty input', () => {
    expect(calculateVolume([])).toBe(0)
  })

  it('should handle missing weights', () => {
    const workouts = [{ sets: 3, reps: 10 }]
    expect(calculateVolume(workouts)).toBe(0)
  })
})
```

### Complex Algorithm Testing

```typescript
describe('calculateProgressiveOverload', () => {
  it('should detect volume increase', () => {
    const previous = { totalVolume: 10000 }
    const current = { totalVolume: 11000 }
    
    const result = calculateProgressiveOverload(previous, current)
    
    expect(result.hasProgressiveOverload).toBe(true)
    expect(result.volumeIncrease).toBe(10) // 10%
    expect(result.type).toBe('volume')
  })

  it('should detect intensity increase', () => {
    const previous = { avgIntensity: 70 }
    const current = { avgIntensity: 75 }
    
    const result = calculateProgressiveOverload(previous, current)
    
    expect(result.hasProgressiveOverload).toBe(true)
    expect(result.type).toBe('intensity')
  })

  it('should handle plateau', () => {
    const previous = { totalVolume: 10000 }
    const current = { totalVolume: 10000 }
    
    const result = calculateProgressiveOverload(previous, current)
    
    expect(result.hasProgressiveOverload).toBe(false)
    expect(result.volumeIncrease).toBe(0)
  })
})
```

---

## Best Practices

### 1. Test Organization

**File Structure:**
```
__tests__/
├── api/           # API route tests (Node environment)
├── components/    # Component tests (jsdom)
├── lib/           # Utility/algorithm tests
└── integration/   # Integration tests
```

**Naming Convention:**
- Test files: `{feature}.test.ts(x)`
- Test suites: `describe('{Feature Name}', ...)`
- Test cases: `it('should {expected behavior}', ...)`

### 2. AAA Pattern

```typescript
it('should update user profile', async () => {
  // Arrange
  const userId = '123'
  const updates = { name: 'New Name' }
  ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: userId, ...updates })

  // Act
  const result = await updateUserProfile(userId, updates)

  // Assert
  expect(result.name).toBe('New Name')
  expect(prisma.user.update).toHaveBeenCalledWith({
    where: { id: userId },
    data: updates
  })
})
```

### 3. Test Isolation

```typescript
beforeEach(() => {
  jest.clearAllMocks() // Clear mock call history
})

afterEach(() => {
  jest.restoreAllMocks() // Restore original implementations
})
```

### 4. Descriptive Test Names

**Good:**
```typescript
it('should return 404 when user not found', ...)
it('should calculate progressive overload correctly', ...)
it('should display error message on failed submission', ...)
```

**Bad:**
```typescript
it('works', ...)
it('test user', ...)
it('should pass', ...)
```

### 5. Test Data Factories

```typescript
// test/factories.ts
export const mockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
})

export const mockWorkout = (overrides = {}) => ({
  id: '1',
  userId: '1',
  exercises: [],
  ...overrides
})

// In tests
const user = mockUser({ name: 'Custom Name' })
```

---

## Common Patterns

### Async Testing

```typescript
// Using async/await
it('should fetch data', async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// Using waitFor
it('should show message after delay', async () => {
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  }, { timeout: 3000 })
})
```

### Error Testing

```typescript
it('should throw error on invalid input', () => {
  expect(() => {
    processData(null)
  }).toThrow('Invalid input')
})

it('should handle API errors', async () => {
  ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
  
  await expect(fetchData()).rejects.toThrow('Network error')
})
```

### Snapshot Testing (Use Sparingly)

```typescript
it('should match snapshot', () => {
  const { container } = render(<Component />)
  expect(container).toMatchSnapshot()
})
```

---

## Troubleshooting

### Common Issues

#### 1. "Request is not defined"

**Problem:** Using Request in Node environment

**Solution:** Add Request mock
```typescript
global.Request = class Request { /* ... */ } as any
```

#### 2. "NextResponse is not defined"

**Problem:** Using Next.js server components in tests

**Solution:** Mock next/server before imports
```typescript
jest.mock('next/server', () => ({ /* ... */ }))
```

#### 3. "Cannot find module '@/...'"

**Problem:** Path alias not configured

**Solution:** Check jest.config.js has moduleNameMapper
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

#### 4. "Multiple elements with same query"

**Problem:** Multiple elements match selector

**Solution:** Use getAllBy* and select specific index
```typescript
const buttons = screen.getAllByRole('button', { name: 'Submit' })
await userEvent.click(buttons[0])
```

#### 5. "Test timeout"

**Problem:** Async operation taking too long

**Solution:** Increase timeout or check for hanging promises
```typescript
it('should complete', async () => {
  // ...
}, 10000) // 10 second timeout
```

### Debug Tips

```typescript
// Debug queries
screen.debug() // Print entire DOM
screen.debug(element) // Print specific element

// List all queries
screen.logTestingPlaygroundURL()

// Check available roles
screen.getByRole('') // Will list all available roles in error
```

---

## Examples from ASTRAL POWER

### Analytics Algorithm Test

```typescript
// From: __tests__/lib/analytics.test.ts
describe('Analytics', () => {
  describe('calculateVolume', () => {
    it('should calculate total volume correctly', () => {
      const workouts = [
        {
          exercises: [
            {
              sets: [
                { reps: 10, weight: 100 },
                { reps: 10, weight: 100 },
                { reps: 8, weight: 105 },
              ],
            },
          ],
        },
      ]

      const result = calculateVolume(workouts)

      expect(result.totalVolume).toBe(2840) // (10*100) + (10*100) + (8*105)
    })
  })
})
```

### API Route Test

```typescript
// From: __tests__/api/metrics.test.ts
describe('GET /api/metrics', () => {
  it('should return user metrics successfully', async () => {
    const mockUser = { id: '1', email: 'demo@astralforge.app' }
    const mockMetrics = [
      {
        id: '1',
        date: new Date('2024-01-01'),
        weight: 75,
        bodyFat: 15,
      },
    ]

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(prisma.bodyMetric.findMany as jest.Mock).mockResolvedValue(mockMetrics)

    const request = new Request('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(data).toEqual(mockMetrics)
  })
})
```

### Component Test

```typescript
// From: __tests__/components/workout-notes.test.tsx
describe('WorkoutNotes', () => {
  it('should allow selecting energy level', async () => {
    render(<WorkoutNotes sessionId="test-session" />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    
    const energyButtons = screen.getAllByRole('button', { name: '9' })
    await userEvent.click(energyButtons[0])
    
    expect(screen.getByText(/Excellent/i)).toBeInTheDocument()
  })
})
```

---

## Summary

### Key Takeaways

1. **Mock before import** - Next.js server components must be mocked at module level
2. **Use accessible queries** - Prefer getByRole over getByTestId
3. **Test behavior, not implementation** - Focus on what users see/do
4. **Isolate tests** - Clear mocks between tests
5. **Descriptive names** - Make test intent clear

### Current Test Status

```
✅ 213/214 tests passing (99.5%)
✅ 17/17 test suites passing (100%)
✅ 0 failures
✅ Comprehensive analytics coverage
✅ API route testing established
✅ Component testing patterns defined
```

### Next Steps

1. Generate full coverage report
2. Add E2E tests with Playwright
3. Expand component test coverage
4. Add integration tests
5. Performance testing

---

**Last Updated:** October 7, 2025  
**Maintained By:** ASTRAL POWER Development Team  
**Status:** Living Document - Updated as patterns evolve
