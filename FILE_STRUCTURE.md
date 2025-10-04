# 📁 Astral Power - Complete File Structure

```
astral-power/
│
├── 📄 Configuration Files
│   ├── .gitignore                      # Git ignore rules
│   ├── .npmrc                          # NPM configuration
│   ├── next.config.js                  # Next.js configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── postcss.config.js               # PostCSS configuration
│   ├── package.json                    # Dependencies and scripts
│   ├── vercel.json                     # Vercel deployment config
│   ├── vitest.config.unit.ts           # Unit test configuration
│   └── playwright.config.ts            # E2E test configuration
│
├── 📚 Documentation
│   ├── README.md                       # Main documentation (1,200+ lines)
│   ├── DEPLOYMENT.md                   # Deployment guide (800+ lines)
│   ├── CONTRIBUTING.md                 # Contribution guidelines (400+ lines)
│   ├── PROJECT_SUMMARY.md              # This project summary
│   ├── FILE_STRUCTURE.md               # This file
│   └── LICENSE                         # MIT License
│
├── 🔧 Scripts
│   ├── scripts/
│   │   ├── setup.sh                    # Unix/Linux/macOS setup script
│   │   └── quick-start.bat             # Windows setup script
│
├── 🗄️ Database (Prisma)
│   └── prisma/
│       ├── schema.prisma               # Database schema (11 models)
│       └── seed.ts                     # Seed data script
│
├── 🧠 Core Library
│   └── lib/
│       ├── prisma.ts                   # Prisma client singleton
│       ├── types.ts                    # TypeScript type definitions
│       ├── auth.ts                     # NextAuth configuration
│       └── agents/                     # Multi-Agent System
│           ├── progressive-overload.ts # Progressive overload algorithm
│           ├── autoregulation.ts       # RPE/RIR autoregulation
│           ├── fatigue-management.ts   # ACWR fatigue tracking
│           └── habit-formation.ts      # Streaks & achievements
│
├── 🎨 Components
│   └── components/
│       ├── session-player.tsx          # Workout session UI (500+ lines)
│       └── accountability-dashboard.tsx # Accountability widgets (300+ lines)
│
├── 🌐 App (Next.js 14 App Router)
│   └── app/
│       ├── layout.tsx                  # Root layout
│       ├── page.tsx                    # Landing page
│       ├── globals.css                 # Global styles
│       │
│       ├── 🔐 auth/
│       │   └── signin/
│       │       └── page.tsx            # Sign in page
│       │
│       ├── 📊 dashboard/
│       │   └── page.tsx                # Main dashboard
│       │
│       ├── 💪 workout/
│       │   └── session/
│       │       └── page.tsx            # Active workout session
│       │
│       └── 🔌 api/                     # API Routes
│           ├── auth/
│           │   └── [...nextauth]/
│           │       └── route.ts        # NextAuth handler
│           │
│           ├── user/
│           │   └── route.ts            # User data endpoint
│           │
│           ├── workout/
│           │   └── next/
│           │       └── route.ts        # Next workout endpoint
│           │
│           ├── sessions/
│           │   └── route.ts            # Workout history endpoint
│           │
│           ├── sets/
│           │   └── route.ts            # Set logging endpoint
│           │
│           ├── stats/
│           │   └── route.ts            # User statistics endpoint
│           │
│           ├── accountability/
│           │   ├── streak/
│           │   │   └── route.ts        # Streak tracking
│           │   ├── achievements/
│           │   │   └── route.ts        # Achievements
│           │   ├── milestone/
│           │   │   └── route.ts        # Next milestone
│           │   ├── weekly/
│           │   │   └── route.ts        # Weekly completion
│           │   └── score/
│           │       └── route.ts        # Motivation score
│           │
│           └── agents/
│               └── personalize/
│                   └── route.ts        # Daily workout generation (cron)
│
├── 🧪 Tests
│   └── test/
│       ├── setup.ts                    # Test environment setup
│       ├── unit/
│       │   ├── progressive-overload.test.ts
│       │   └── autoregulation.test.ts
│       └── e2e/
│           └── dashboard.spec.ts
│
├── 📝 Types
│   └── types/
│       └── next-auth.d.ts              # NextAuth type extensions
│
└── ⚙️ CI/CD
    └── .github/
        └── workflows/
            └── ci.yml                  # GitHub Actions pipeline

```

## 📊 Statistics

### File Count by Type

| Category | Count | Description |
|----------|-------|-------------|
| **TypeScript/TSX** | 35+ | Application logic and UI |
| **Configuration** | 10 | Build and deployment config |
| **Documentation** | 6 | Comprehensive guides |
| **Test Files** | 5 | Unit and E2E tests |
| **Database** | 2 | Schema and seed |
| **Scripts** | 2 | Setup automation |
| **CSS** | 1 | Global styles |
| **CI/CD** | 1 | GitHub Actions |
| **Total** | **60+** | Complete application |

### Lines of Code

| Component | Estimated LOC |
|-----------|---------------|
| **Agents** | ~2,000 |
| **Components** | ~800 |
| **API Routes** | ~600 |
| **Pages** | ~500 |
| **Database** | ~400 |
| **Tests** | ~300 |
| **Config** | ~200 |
| **Types** | ~200 |
| **Documentation** | ~2,500 |
| **Total** | **~8,000+** |

## 🎯 Key Directories

### `/lib` - Core Business Logic
The brain of the application. Contains all agent implementations and shared utilities.

**Key Files:**
- `agents/progressive-overload.ts` - Progressive overload calculations
- `agents/autoregulation.ts` - RPE/RIR system
- `agents/fatigue-management.ts` - ACWR tracking
- `agents/habit-formation.ts` - Streaks and achievements

### `/components` - React Components
Reusable UI components used across the application.

**Key Files:**
- `session-player.tsx` - Main workout interface
- `accountability-dashboard.tsx` - Motivation tracking widgets

### `/app` - Next.js App Router
Application pages and API routes.

**Structure:**
- Pages in root directories
- API routes in `/api` subdirectory
- Automatic routing based on file structure

### `/prisma` - Database
Database schema and migrations.

**Key Files:**
- `schema.prisma` - 11 models with relationships
- `seed.ts` - Initial data (exercises, demo user)

### `/test` - Testing Suite
Comprehensive test coverage.

**Structure:**
- `/unit` - Algorithm and logic tests
- `/e2e` - User flow tests with Playwright

## 🔍 Important Files to Review

### For Users
1. `README.md` - Start here!
2. `DEPLOYMENT.md` - How to deploy
3. `.env.example` - Environment setup

### For Developers
1. `lib/types.ts` - Type definitions
2. `prisma/schema.prisma` - Data model
3. `lib/agents/` - Core algorithms
4. `CONTRIBUTING.md` - Development guide

### For DevOps
1. `.github/workflows/ci.yml` - CI/CD pipeline
2. `vercel.json` - Deployment config
3. `DEPLOYMENT.md` - Deployment steps

## 🚀 Quick Navigation

### Want to understand the algorithms?
→ Check `/lib/agents/`

### Want to modify the UI?
→ Check `/components/` and `/app/`

### Want to add API endpoints?
→ Check `/app/api/`

### Want to change the database?
→ Check `/prisma/schema.prisma`

### Want to add tests?
→ Check `/test/`

### Want to deploy?
→ Read `DEPLOYMENT.md`

---

**Every file has a purpose. Every line is intentional.**

*Built with precision for serious lifters.*

