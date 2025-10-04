# 🔨 Astral Forge

**Forge your strength. Temper your discipline. Craft your ultimate physique.**

Astral Forge is a progressive, adaptive personal workout forge where science meets iron. Built on research-backed progressive overload algorithms, RIR-based RPE autoregulation, and proven habit-building mechanics - your personal smithy for strength.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## ✨ Features of the Forge

### 🔥 The Forge Core (Multi-Agent Intelligence)

- **Progressive Tempering System**: Research-backed algorithms that automatically adjust your training based on performance
- **Real-Time Anvil Feedback**: Live workout adjustments using RIR-based RPE scale (6-10)
- **Fatigue Management Crucible**: Monitors Acute:Chronic Workload Ratio (ACWR) to prevent overtraining
- **Master Craftsman Tracker**: Streaks, achievements, and badges for forging consistency

### ⚒️ Smithing Tools

- **Smart Progression Forge**: Automatically increases weight, reps, or sets based on your RPE feedback
- **Adaptive Tempering**: Adjusts your workout mid-session if you're having an off day
- **Recovery Monitoring**: Uses ACWR (sweet spot: 0.8-1.3) to optimize recovery between forging sessions
- **Exercise Smithy**: Pre-loaded with compound and isolation movements + create your own
- **Form Cues Library**: Master craftsman-level technique guidance
- **Custom Exercise Forge**: Create unlimited custom exercises with your personal technique notes
- **Rest Timer Anvil**: Set custom rest periods for each exercise
- **Plate Calculator**: Visualize barbell loading for every lift

### 📊 The Forgemaster's Record

- **Forging Streak**: Track your consistency with visual streak counter
- **Achievement Anvils**: Unlock badges for PRs, streaks, and volume milestones
- **Progress Charts**: Watch your strength being forged over time
- **Training Heatmap**: GitHub-style visualization of your forging frequency
- **RPE Trends**: Analyze effort patterns across lifts
- **Volume Distribution**: See which muscle groups are getting tempered most
- **Personal Record Timeline**: Your strongest lifts, forged in fire
- **Progress Photo Forge**: Upload and compare transformation photos

### 🛡️ Safety & Recovery Forge

- **Injury Tracker**: Log injuries and get exercise modifications
- **Mobility Forge**: 6 pre-built mobility and flexibility routines
- **Nutrition Smithy**: Calculate BMR, TDEE, and macros
- **Daily Nutrition Anvil**: Track calories, protein, carbs, fats, water
- **Sleep Quality Monitor**: Track how rest impacts your forging

### 🎯 Master Goals System

- **Personal Goal Forge**: Set and track 5 types of goals
  - Strength Goals (forge max lifts)
  - Weight Goals (craft your physique)
  - Body Composition (temper your form)
  - Performance Goals (refine technique)
  - Habit Goals (master consistency)
- **Progress Tracking**: Visual progress bars with percentages
- **Milestone System**: Mark your journey milestones
- **Deadline Tracking**: Stay accountable with countdown timers

### 🎵 The Forge Atmosphere

- **Spotify Integration**: Control your training music without breaking flow
- **Voice Notes**: Record insights during your forging sessions
- **Workout Templates**: Quick-start templates (15-60 min)
- **Keyboard Shortcuts**: Desktop power user shortcuts

## 🚀 Forge Startup

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+ (or use [Neon](https://neon.tech) for managed Postgres)
- Git

### Installation

1. **Clone the forge**

```bash
git clone https://github.com/yourusername/astral-forge.git
cd astral-forge
```

2. **Install the anvils**

```bash
npm install
```

3. **Light the forge (environment variables)**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/astral_forge"

# NextAuth
NEXTAUTH_URL="http://localhost:4001"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

# Spotify (Optional - for music integration)
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# App Configuration
NODE_ENV="development"
```

4. **Prepare the smithy (database setup)**

```bash
# Generate Prisma client
npx prisma generate

# Forge the database structure
npx prisma db push

# Seed with exercises and demo forgemaster
npm run db:seed
```

5. **Ignite the forge**

```bash
npm run dev
```

Open [http://localhost:4001](http://localhost:4001) and start forging!

### Forgemaster Demo Access

- **Email**: `demo@astralforge.app`
- **Password**: `demo123`

## 📁 The Forge Structure

```
astral-forge/
├── app/                        # Next.js 14 App Router
│   ├── api/                    # Forge API endpoints
│   │   ├── agents/             # Intelligence systems
│   │   ├── custom-exercises/   # Exercise creation
│   │   ├── goals/              # Goal tracking
│   │   ├── spotify/            # Music integration
│   │   └── metrics/            # Body tracking
│   ├── dashboard/              # Forgemaster's hub
│   ├── workout/                # Active forging sessions
│   ├── exercises/              # Exercise smithy
│   ├── programs/               # Training program forge
│   ├── progress/               # The record keeper
│   ├── goals/                  # Personal goal tracker
│   └── settings/               # Forge preferences
├── lib/                        # Core forge systems
│   ├── agents/                 # Multi-agent intelligence
│   │   ├── progressive-overload.ts
│   │   ├── autoregulation.ts
│   │   ├── fatigue.ts
│   │   └── habits.ts
│   ├── exercise-intelligence.ts
│   └── types.ts
├── components/                 # React forge tools
│   ├── session-player.tsx      # Live workout tracker
│   ├── plate-calculator.tsx    # Barbell loading aid
│   ├── voice-recorder.tsx      # Voice note system
│   └── training-heatmap.tsx    # Frequency visualization
├── prisma/                     # Database forge
│   ├── schema.prisma           # 21 models
│   └── seed.ts                 # Initial data
└── __tests__/                  # Quality forge (74 tests)
    ├── lib/agents/             # Agent tests
    ├── components/             # Component tests
    └── api/                    # API tests
```

## 🧪 Testing the Forge

```bash
# Test the forge integrity
npm test

# Watch mode for development
npm run test:watch

# Full coverage report
npm run test:coverage
```

## 📦 Deploy Your Forge

### Deploy to Vercel (Recommended)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Set up your forge database**
   - Create a PostgreSQL database on [Neon](https://neon.tech)
   - Copy the connection string

3. **Deploy the forge**

```bash
npm install -g vercel
vercel login
vercel
```

4. **Configure forge environment** in Vercel dashboard:
   - `DATABASE_URL`: PostgreSQL connection
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your Vercel URL
   - `SPOTIFY_CLIENT_ID` (optional)
   - `SPOTIFY_CLIENT_SECRET` (optional)

5. **Initialize the forge**

```bash
npx prisma migrate deploy
npx prisma db seed
```

## 🔬 The Science of Forging

### Progressive Tempering Algorithm

Evidence-based progression forged through research:

- **RPE ≤ 7**: Increase load by 2.5-5% (ready to be tempered)
- **RPE 7-8**: Maintain load, add volume (strengthen the metal)
- **RPE > 8.5**: Hold or deload 5-10% (prevent the crack)

### Rate of Perceived Exertion (RPE/RIR)

Based on validated forging intensity scale:

- **RPE 10**: Maximal forge - 0 RIR
- **RPE 9**: 1 rep left in the crucible - 1 RIR
- **RPE 8**: 2 reps in reserve - 2 RIR
- **RPE 7**: 3 reps in reserve - 3 RIR

### Fatigue Management Crucible

Uses Acute:Chronic Workload Ratio (ACWR):

- **Sweet spot**: 0.8-1.3 (optimal tempering)
- **Risk zone**: >1.5 (overheating the forge) or <0.8 (cooling too much)
- **Deload protocol**: Triggered when ACWR > 1.4 or every 4-6 weeks

### Master Craftsman Habits

Based on research showing 89% enhanced accountability:

- **Forging Streaks**: Visual feedback increases adherence
- **Achievement Anvils**: Milestone-based rewards
- **Smart Reminders**: Contextual based on your patterns
- **Progress Visibility**: Clear graphs showing your tempering

## 🛠️ Forge Development

### Database Smithing

```bash
# Open Prisma Studio (visual forge editor)
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset the forge (warning: full restart)
npx prisma migrate reset
```

### Forge Quality Control

```bash
# Type checking
npm run type-check

# Code linting
npm run lint
```

## 🤝 Contributing to the Forge

Master smiths welcome! To contribute:

1. Fork the forge
2. Create a feature branch: `git checkout -b forge/amazing-feature`
3. Commit your tempering: `git commit -m 'Add amazing feature'`
4. Push to the anvil: `git push origin forge/amazing-feature`
5. Open a Pull Request

## 📄 Forge License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Forged with research-backed principles from:

- Progressive overload algorithms from evidence-based strength training research
- RPE/RIR scales validated by sports science literature
- Fatigue management using ACWR methodology from elite athletic performance
- Habit formation based on behavioral psychology research

## 📧 Forgemaster Support

For questions or forge issues:

1. Check the [Issues](https://github.com/yourusername/astral-forge/issues) page
2. Create a new issue if your problem isn't listed
3. Include details (error messages, steps to reproduce, forge conditions)

---

**Forged with 🔨 for serious lifters who value science and strength.**

*Astral Forge - Where strength is tempered, discipline is forged, and legends are smithed.*

## 🏆 What Your Forge Includes (27 Complete Features)

✅ Progressive Overload Engine  
✅ RPE/Autoregulation System  
✅ Fatigue Management  
✅ Habit Formation & Streaks  
✅ Real-Time Session Tracking  
✅ Personal Record Detection  
✅ Exercise Intelligence (form cues)  
✅ Cool-down/Stretching System  
✅ Exercise Substitutions  
✅ Exercise-Specific Notes  
✅ Training Frequency Heatmap  
✅ RPE Trends Analysis  
✅ Workout Duration Trends  
✅ Progress Photo Comparison  
✅ Keyboard Shortcuts  
✅ Voice Notes During Workout  
✅ Quick Workout Templates  
✅ Exercise Rating & Favorites  
✅ Injury Tracking  
✅ Sleep Quality Impact  
✅ Nutrition Calculator  
✅ Nutrition Logging  
✅ Mobility/Flexibility Routines  
✅ **Custom Exercise Creation**  
✅ **Spotify Music Integration**  
✅ **Custom Rest Timers**  
✅ **Personal Goals Tracking**

**100% Complete. Zero Placeholders. Production Ready.**
