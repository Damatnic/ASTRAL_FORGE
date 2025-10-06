# ASTRAL FORGE - COMPLETE REDESIGN MASTER PLAN

## Project Overview
Astral Forge is a comprehensive fitness and RPG gamification platform built with Next.js, TypeScript, Prisma, and Tailwind CSS. This plan outlines the complete redesign and enhancement of all system components to create a cohesive, production-ready application.

## Current Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js
- **Components**: Custom UI library with unified design system
- **Testing**: Jest, Playwright, React Testing Library

## Design Philosophy
- **Dark Theme First**: Astral dark (#0a0a0a) with astral gray (#1a1a1a) surfaces
- **Gradient Accents**: Blue (#3b82f6) to purple (#8b5cf6) gradients
- **RPG Aesthetic**: Gaming-inspired UI with forge/crafting themes
- **Mobile-First**: Responsive design with touch-friendly interactions
- **Performance**: Optimized loading, smooth animations, efficient rendering

---

# PHASE 0: FOUNDATION & DESIGN SYSTEM

## Task 0.1: Enhanced Color System
**File**: `tailwind.config.ts`
**Objective**: Expand color palette with semantic color tokens

```typescript
// Extended color system
colors: {
  // Base colors
  'astral-dark': '#0a0a0a',
  'astral-gray': '#1a1a1a',
  'astral-light': '#2a2a2a',
  
  // Primary gradients
  'astral-blue': '#3b82f6',
  'astral-purple': '#8b5cf6',
  'astral-cyan': '#06b6d4',
  
  // Semantic colors
  'success': '#10b981',
  'warning': '#f59e0b',
  'error': '#ef4444',
  'info': '#3b82f6',
  
  // Gaming tiers
  'tier-common': '#9ca3af',
  'tier-uncommon': '#10b981',
  'tier-rare': '#3b82f6',
  'tier-epic': '#8b5cf6',
  'tier-legendary': '#f59e0b',
  'tier-mythic': '#ef4444',
  
  // Status indicators
  'health': '#ef4444',
  'mana': '#3b82f6',
  'energy': '#f59e0b',
  'xp': '#10b981'
}
```

## Task 0.2: Typography Scale
**File**: `app/globals.css`
**Objective**: Implement comprehensive typography system

```css
/* Typography Scale */
.text-display-xl { font-size: 4.5rem; line-height: 1; font-weight: 800; }
.text-display-lg { font-size: 3.75rem; line-height: 1; font-weight: 700; }
.text-display-md { font-size: 3rem; line-height: 1.1; font-weight: 700; }
.text-display-sm { font-size: 2.25rem; line-height: 1.2; font-weight: 600; }

.text-heading-xl { font-size: 1.875rem; line-height: 1.3; font-weight: 600; }
.text-heading-lg { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
.text-heading-md { font-size: 1.25rem; line-height: 1.4; font-weight: 500; }
.text-heading-sm { font-size: 1.125rem; line-height: 1.4; font-weight: 500; }

.text-body-xl { font-size: 1.125rem; line-height: 1.5; font-weight: 400; }
.text-body-lg { font-size: 1rem; line-height: 1.5; font-weight: 400; }
.text-body-md { font-size: 0.875rem; line-height: 1.5; font-weight: 400; }
.text-body-sm { font-size: 0.75rem; line-height: 1.4; font-weight: 400; }
```

## Task 0.3: Spacing & Layout System
**File**: `/design/foundation.md` (new)
**Objective**: Document consistent spacing and layout principles

## Task 0.4: Base Layout Primitives
**File**: `components/ui/layout.tsx` (new)
**Objective**: Create reusable layout components (Grid, Stack, Section, Container)

## Task 0.5: Enhanced Animation System
**File**: `tailwind.config.ts` + `app/globals.css`
**Objective**: Expand animation library with RPG-themed effects

---

# PHASE 1: CORE SHELL & NAVIGATION

## Task 1.1: Global Layout Architecture
**File**: `app/layout.tsx`
**Objective**: Enhanced root layout with providers and global features

```typescript
// Enhanced layout with:
// - Theme provider
// - Session provider
// - Toast system
// - PWA features
// - Keyboard shortcuts
// - Sound system
// - Achievement notifications
```

## Task 1.2: Dashboard Layout System
**File**: `app/(dashboard)/layout.tsx` (new)
**Objective**: Create dashboard wrapper with sidebar and header

## Task 1.3: Primary Sidebar Navigation
**File**: `components/navigation/sidebar.tsx` (new)
**Objective**: Collapsible sidebar with grouped navigation items

```typescript
// Navigation groups:
// - Dashboard
// - Training (Programs, Exercises, History)
// - Progress (Analytics, Photos, Measurements, Goals)
// - Character (Sheet, Skills, Inventory, Achievements)
// - Social (Clans, Leaderboards, PvP, Events)
// - Health (Injuries, Sleep, Nutrition, Habits)
// - Settings
```

## Task 1.4: Enhanced Top Bar
**File**: `components/navigation/header.tsx` (new)
**Objective**: Status indicators, notifications, quick actions, profile menu

## Task 1.5: Mobile Navigation
**File**: `components/navigation/mobile-nav.tsx` (new)
**Objective**: Bottom tab bar for mobile with gesture support

## Task 1.6: Responsive Breakpoints
**File**: Global CSS updates
**Objective**: Consistent responsive behavior across all components

---

# PHASE 2: WORKOUT EXPERIENCE

## Task 2.1: Programs Hub
**File**: `app/programs/page.tsx`
**Objective**: Browse, search, and manage workout programs

Features:
- Program library with filtering
- Custom program creation
- Program templates
- Difficulty ratings
- Progress tracking per program

## Task 2.2: Program Detail View
**File**: `app/programs/[id]/page.tsx`
**Objective**: Detailed program view with week breakdown

Features:
- Week-by-week progression
- Exercise substitution options
- Progress visualization
- Program statistics
- Social sharing

## Task 2.3: Workout Session Interface
**File**: `app/workouts/[id]/page.tsx`
**Objective**: In-workout interface with real-time tracking

Features:
- Set-by-set logging
- Rest timer with notifications
- RPE tracking
- Weight recommendations
- Progress validation
- Voice notes
- Emergency exit

## Task 2.4: Exercise Library
**File**: `app/exercises/page.tsx`
**Objective**: Comprehensive exercise database with search

Features:
- Exercise catalog with videos/images
- Muscle group filtering
- Equipment filtering
- Difficulty levels
- Alternative exercises
- Performance history
- Custom exercise creation

## Task 2.5: Exercise Detail View
**File**: `app/exercises/[id]/page.tsx`
**Objective**: Single exercise view with analytics

Features:
- Exercise instructions
- Form tips and videos
- Personal records
- Volume progression charts
- Strength curve analysis
- Related exercises

## Task 2.6: Workout History
**File**: `app/history/page.tsx`
**Objective**: Complete workout history with analytics

Features:
- Calendar view
- List view with filters
- Volume trends
- PR celebrations
- Session replays
- Export capabilities

---

# PHASE 3: PROGRESS & ANALYTICS

## Task 3.1: Analytics Dashboard
**File**: `app/analytics/page.tsx`
**Objective**: Comprehensive training analytics

Features:
- Volume progression charts
- Strength progression by lift
- Frequency analysis
- RPE trends
- Recovery metrics
- Goal progress tracking

## Task 3.2: Progress Hub
**File**: `app/progress/page.tsx`
**Objective**: Central progress tracking dashboard

Features:
- Quick stats overview
- Recent achievements
- Goal progress
- Photo comparisons
- Measurement trends

## Task 3.3: Progress Photos
**File**: `app/progress/photos/page.tsx`
**Objective**: Photo timeline with comparison tools

Features:
- Photo upload with poses
- Side-by-side comparisons
- Timeline view
- Privacy controls
- Sharing options

## Task 3.4: Measurements Tracking
**File**: `app/progress/measurements/page.tsx`
**Objective**: Body measurement logging and trends

Features:
- Body part measurements
- Weight tracking
- Body fat percentage
- Trend visualization
- Goal setting

## Task 3.5: Goals Management
**File**: `app/goals/page.tsx`
**Objective**: Goal setting and tracking system

Features:
- SMART goal creation
- Progress tracking
- Milestone celebrations
- Goal categories
- Achievement integration

## Task 3.6: Goal Detail View
**File**: `app/goals/[id]/page.tsx`
**Objective**: Individual goal tracking with action plans

---

# PHASE 4: CHARACTER & GAMIFICATION

## Task 4.1: Character Sheet
**File**: `app/character/page.tsx`
**Objective**: RPG-style character profile

Features:
- Avatar customization
- Stat display (STR, END, etc.)
- Level progression
- Class/build selection
- Equipment display
- Title system

## Task 4.2: Skill Tree System
**File**: `app/character/skills/page.tsx`
**Objective**: Unlock skills through training

Features:
- Branching skill trees
- Skill points allocation
- Passive bonuses
- Active abilities
- Prestige system

## Task 4.3: Inventory Management
**File**: `app/inventory/page.tsx`
**Objective**: Equipment and item management

Features:
- Equipment slots
- Item categories
- Rarity system
- Item effects
- Trading system

## Task 4.4: Shop System
**File**: `app/shop/page.tsx`
**Objective**: Purchase equipment and consumables

Features:
- Currency system
- Daily/weekly deals
- Equipment upgrades
- Cosmetic items
- Bundle packages

## Task 4.5: Quest System
**File**: `app/quests/page.tsx`
**Objective**: Training-based quest completion

Features:
- Daily/weekly/monthly quests
- Story quests
- Achievement quests
- Seasonal events
- Reward system

## Task 4.6: Achievements Gallery
**File**: `app/achievements/page.tsx`
**Objective**: Achievement tracking and display

Features:
- Achievement categories
- Progress tracking
- Rare achievements
- Leaderboards
- Social sharing

## Task 4.7: Battle Log
**File**: `app/battles/page.tsx`
**Objective**: PvP and challenge history

Features:
- Battle history
- Win/loss records
- Ranking progression
- Replay system
- Statistics

---

# PHASE 5: SOCIAL & COMPETITION

## Task 5.1: Clans Hub
**File**: `app/clans/page.tsx`
**Objective**: Join and manage fitness clans

Features:
- Clan browser
- Join requests
- Clan leaderboards
- Group challenges
- Communication tools

## Task 5.2: Clan Detail View
**File**: `app/clans/[id]/page.tsx`
**Objective**: Individual clan management

Features:
- Member list
- Clan statistics
- Group workouts
- Clan wars
- Administration tools

## Task 5.3: Leaderboards
**File**: `app/leaderboards/page.tsx`
**Objective**: Global and friend leaderboards

Features:
- Multiple categories
- Seasonal rankings
- Friend comparisons
- Achievement boards
- Reward systems

## Task 5.4: PvP Arena
**File**: `app/compete/pvp/page.tsx`
**Objective**: One-on-one fitness challenges

Features:
- Challenge creation
- Real-time battles
- Betting system
- Ranking system
- Spectator mode

## Task 5.5: Events System
**File**: `app/events/page.tsx`
**Objective**: Seasonal and special events

Features:
- Event calendar
- Participation tracking
- Special rewards
- Community goals
- Event leaderboards

## Task 5.6: Notifications Center
**File**: `app/notifications/page.tsx`
**Objective**: All notifications management

Features:
- Notification categories
- Read/unread status
- Action buttons
- Notification history
- Preferences

## Task 5.7: Messages System
**File**: `app/messages/page.tsx`
**Objective**: Direct messaging between users

Features:
- Message threads
- Friend requests
- Group chats
- Media sharing
- Message encryption

---

# PHASE 6: HEALTH & WELLNESS

## Task 6.1: Health Hub
**File**: `app/health/page.tsx`
**Objective**: Overall health tracking dashboard

Features:
- Health score
- Recovery metrics
- Sleep quality
- Stress levels
- Nutrition overview

## Task 6.2: Injury Tracking
**File**: `app/health/injuries/page.tsx`
**Objective**: Injury prevention and recovery

Features:
- Injury logging
- Recovery protocols
- Exercise modifications
- Pain tracking
- Medical notes

## Task 6.3: Sleep Tracking
**File**: `app/health/sleep/page.tsx`
**Objective**: Sleep quality monitoring

Features:
- Sleep duration logging
- Quality ratings
- Sleep trends
- Recovery correlation
- Sleep goals

## Task 6.4: Nutrition Logging
**File**: `app/health/nutrition/page.tsx`
**Objective**: Food intake tracking

Features:
- Meal logging
- Macro tracking
- Calorie goals
- Nutrition trends
- Meal planning

## Task 6.5: Habit Tracker
**File**: `app/health/habits/page.tsx`
**Objective**: Daily habit formation

Features:
- Habit creation
- Streak tracking
- Habit categories
- Progress visualization
- Habit suggestions

---

# PHASE 7: SETTINGS & ADMINISTRATION

## Task 7.1: Settings Hub
**File**: `app/settings/page.tsx`
**Objective**: Central settings dashboard

## Task 7.2: Account Settings
**File**: `app/settings/account/page.tsx`
**Objective**: Profile and account management

## Task 7.3: Appearance Settings
**File**: `app/settings/appearance/page.tsx`
**Objective**: Theme and UI customization

## Task 7.4: Notification Settings
**File**: `app/settings/notifications/page.tsx`
**Objective**: Notification preferences

## Task 7.5: Privacy Settings
**File**: `app/settings/privacy/page.tsx`
**Objective**: Privacy and security controls

## Task 7.6: Data Management
**File**: `app/settings/data/page.tsx`
**Objective**: Data export and deletion

## Task 7.7: Integrations
**File**: `app/settings/integrations/page.tsx`
**Objective**: Third-party app connections

## Task 7.8: Admin Dashboard
**File**: `app/admin/page.tsx`
**Objective**: System administration overview

## Task 7.9: Admin User Management
**File**: `app/admin/users/page.tsx`
**Objective**: User administration tools

## Task 7.10: Admin Reports
**File**: `app/admin/reports/page.tsx`
**Objective**: System reports and analytics

## Task 7.11: Admin Analytics
**File**: `app/admin/analytics/page.tsx`
**Objective**: Platform usage analytics

## Task 7.12: Admin Settings
**File**: `app/admin/settings/page.tsx`
**Objective**: System configuration

---

# PHASE 8: SHARED COMPONENTS & STATES

## Task 8.1: Enhanced Modal System
**File**: `components/ui/modal.tsx`
**Objective**: Flexible modal framework

## Task 8.2: Toast & Alert Components
**File**: `components/ui/notifications.tsx`
**Objective**: Enhanced notification system

## Task 8.3: Table System
**File**: `components/ui/table.tsx`
**Objective**: Data tables with sorting, filtering, pagination

## Task 8.4: Form Components
**File**: `components/ui/forms.tsx`
**Objective**: Complete form input library

## Task 8.5: Enhanced Buttons
**File**: `components/ui/buttons.tsx`
**Objective**: Button variants and states

## Task 8.6: Card System
**File**: `components/ui/cards.tsx`
**Objective**: Standardized card components

## Task 8.7: Loading States
**File**: `components/ui/loading.tsx`
**Objective**: Skeleton and loading components

## Task 8.8: Empty States
**File**: `components/ui/empty-states.tsx`
**Objective**: Empty and error state illustrations

---

# PHASE 9: CONTENT & MICRO-INTERACTIONS

## Task 9.1: Content Strategy
**Objective**: Rewrite all user-facing copy

## Task 9.2: Helper Text & Tooltips
**Objective**: Standardize instructional content

## Task 9.3: Call-to-Action Optimization
**Objective**: Optimize button and link text

## Task 9.4: Motion Guidelines
**Objective**: Define animation standards

## Task 9.5: Haptic Feedback
**Objective**: Subtle interaction feedback

---

# PHASE 10: FINAL QA & POLISH

## Task 10.1: Cross-Browser Testing
**Objective**: Ensure compatibility across browsers

## Task 10.2: Mobile/Tablet Optimization
**Objective**: Perfect mobile experience

## Task 10.3: Accessibility Audit
**Objective**: WCAG compliance and keyboard navigation

## Task 10.4: Performance Optimization
**Objective**: Lighthouse score optimization

## Task 10.5: Production Assets
**Objective**: Update screenshots and marketing materials

## Task 10.6: Launch Preparation
**Objective**: Deployment checklist and rollback procedures

---

# IMPLEMENTATION GUIDELINES

## Code Quality Standards
- TypeScript strict mode
- ESLint/Prettier configuration
- Component testing with Jest
- E2E testing with Playwright
- Comprehensive error handling
- Performance monitoring

## Database Schema Updates
- Enhanced user profiles
- Gaming system tables
- Social features schema
- Health tracking tables
- Achievement system
- Notification system

## API Routes Enhancement
- RESTful API design
- Authentication middleware
- Rate limiting
- Input validation
- Error handling
- Documentation

## Security Considerations
- Input sanitization
- XSS prevention
- CSRF protection
- Rate limiting
- Session management
- Data encryption

## Performance Targets
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms
- Overall Lighthouse score > 90

---

# COMPLETION CRITERIA

Each phase must meet the following criteria before proceeding:
1. ✅ All components implemented with TypeScript
2. ✅ Responsive design tested on all devices
3. ✅ Accessibility compliance verified
4. ✅ Unit tests written and passing
5. ✅ Integration tests covering main flows
6. ✅ Performance benchmarks met
7. ✅ Code review completed
8. ✅ Documentation updated

This master plan provides the complete roadmap for transforming Astral Forge into a production-ready, comprehensive fitness and gaming platform. Each task is designed to build upon previous work while maintaining system consistency and user experience quality.