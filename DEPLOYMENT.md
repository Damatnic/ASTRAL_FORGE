# 🚀 Astral Power Deployment Guide

Complete step-by-step guide to deploy Astral Power from zero to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Cron Job Setup](#cron-job-setup)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- [x] Node.js 18+ installed
- [x] Git installed
- [x] GitHub account
- [x] Vercel account (free tier is fine)
- [x] Code pushed to GitHub

## Database Setup

### Option 1: Neon (Recommended - Free Tier)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub
   - Create a new project

2. **Get Connection String**
   ```
   Navigate to: Dashboard → Connection Details → Connection String
   Copy the PostgreSQL connection string
   ```

3. **Save Connection String**
   ```
   Format: postgresql://user:password@host/database?sslmode=require
   You'll need this for Vercel environment variables
   ```

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string from Variables tab

### Option 3: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the URI connection string

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? astral-power (or your choice)
# - Directory? ./
# - Override settings? No
```

### Step 4: Get Project IDs

After first deployment:

```bash
# Get Vercel Project ID
vercel project ls

# Note down:
# - Project ID
# - Org ID (from project details)
```

## Environment Configuration

### Step 1: Add Environment Variables to Vercel

Go to your Vercel project → Settings → Environment Variables

Add the following:

1. **DATABASE_URL** (Required)
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```
   *Use the connection string from your database provider*

2. **NEXTAUTH_SECRET** (Required)
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```
   Copy the output and paste as NEXTAUTH_SECRET value

3. **NEXTAUTH_URL** (Required)
   ```
   https://your-project.vercel.app
   ```
   *Replace with your actual Vercel deployment URL*

4. **NODE_ENV** (Optional)
   ```
   production
   ```

### Step 2: Redeploy with Environment Variables

```bash
vercel --prod
```

## Database Migration

### Step 1: Set Local Environment

```bash
# Set your DATABASE_URL temporarily
export DATABASE_URL="your-production-database-url"
```

### Step 2: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Deploy migrations to production database
npx prisma migrate deploy

# Seed the database
npm run db:seed
```

### Step 3: Verify Database

```bash
# Open Prisma Studio to verify data
npm run db:studio
```

You should see:
- Demo user created
- 12 exercises in the library
- Sample workout session
- Achievements and streaks

## Cron Job Setup

Astral Power uses cron jobs to generate personalized workouts daily.

### Vercel Cron (Automatic)

The `vercel.json` file already configures this:

```json
{
  "crons": [
    {
      "path": "/api/agents/personalize",
      "schedule": "0 6 * * *"  // 6 AM daily
    }
  ]
}
```

**Vercel will automatically run this cron job in production.**

To verify:
1. Go to Vercel Dashboard → Your Project → Cron Jobs
2. You should see the `/api/agents/personalize` cron listed
3. Check execution logs after 6 AM (your timezone)

### Alternative: External Cron Service

If not using Vercel cron, use an external service:

#### Using Cron-job.org

1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Add new cron job:
   - **URL**: `https://your-app.vercel.app/api/agents/personalize`
   - **Schedule**: Every day at 6:00 AM
   - **Method**: POST
   - **Headers**: None needed

#### Using EasyCron

1. Go to [easycron.com](https://easycron.com)
2. Create free account (limited to 1 job)
3. Add cron job with same settings as above

## Post-Deployment

### Step 1: Test the Application

1. **Visit your deployment URL**
   ```
   https://your-project.vercel.app
   ```

2. **Test authentication**
   - Go to Sign In page
   - Use demo credentials:
     - Email: `demo@astralpower.app`
     - Password: `demo123`

3. **Test dashboard**
   - Verify stats display correctly
   - Check accountability widgets
   - Confirm streak and achievements load

4. **Test workout session**
   - Click "Start Workout"
   - Complete a set with RPE
   - Verify autoregulation works

### Step 2: Create Your Own Account

For production use, create a secure admin account:

```typescript
// Use Prisma Studio or create a script
const bcrypt = require('bcryptjs')

const hash = await bcrypt.hash('your-secure-password', 10)

// Then insert into database:
// Email: your-email@example.com
// PasswordHash: the hash from above
```

### Step 3: Monitor Performance

Use Vercel Analytics:

1. Go to Vercel Dashboard → Your Project → Analytics
2. Monitor:
   - Page load times
   - API response times
   - Error rates

### Step 4: Set Up GitHub Integration

For automatic deployments on push:

1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Connect your GitHub repository
3. Configure:
   - **Production Branch**: `main`
   - **Deploy Previews**: Enabled for all branches

Now every push to `main` automatically deploys!

## GitHub Secrets Configuration

For CI/CD with GitHub Actions:

1. Go to your GitHub repo → Settings → Secrets and Variables → Actions

2. Add the following secrets:

   - **VERCEL_TOKEN**: Get from [Vercel Settings → Tokens](https://vercel.com/account/tokens)
   - **VERCEL_ORG_ID**: From `vercel project ls` or project settings
   - **VERCEL_PROJECT_ID**: From `vercel project ls` or project settings

## Troubleshooting

### Issue: Build Fails on Vercel

**Solution:**
```bash
# Ensure dependencies are correctly listed
npm install

# Check for TypeScript errors
npm run type-check

# Test build locally
npm run build
```

### Issue: Database Connection Error

**Solution:**
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Ensure connection string includes `?sslmode=require`
3. Check database is accessible from external connections
4. Run migrations: `npx prisma migrate deploy`

### Issue: NextAuth Session Error

**Solution:**
1. Verify `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your deployment URL
3. Clear cookies and try again

### Issue: Cron Job Not Running

**Solution:**
1. Check Vercel Dashboard → Cron Jobs for execution logs
2. Manually test endpoint:
   ```bash
   curl -X POST https://your-app.vercel.app/api/agents/personalize
   ```
3. Check API route logs in Vercel → Functions

### Issue: Prisma Client Not Found

**Solution:**
```bash
# Ensure Prisma generates client during build
# Add to package.json scripts:
"postinstall": "prisma generate"
```

Then redeploy:
```bash
vercel --prod
```

## Performance Optimization

### Enable Edge Caching

Add to `next.config.js`:

```javascript
module.exports = {
  // ... existing config
  experimental: {
    serverActions: true,
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' },
      ],
    },
  ],
}
```

### Database Connection Pooling

For Prisma with serverless:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: for migrations
}
```

## Security Checklist

- [x] `NEXTAUTH_SECRET` is a strong random string (32+ chars)
- [x] Database credentials are secure
- [x] Environment variables are set in Vercel (not in code)
- [x] `.env` is in `.gitignore`
- [x] Demo account password changed for production
- [x] CORS is properly configured
- [x] Rate limiting considered for API routes

## Monitoring & Maintenance

### Weekly Tasks

1. Check Vercel Analytics for errors
2. Review cron job execution logs
3. Monitor database size (Neon free tier: 10 GB)

### Monthly Tasks

1. Review and optimize database queries
2. Check for Prisma/Next.js updates
3. Review user feedback (if applicable)

### Backup Strategy

**Database Backups:**

1. Neon: Automatic daily backups (retained 7 days on free tier)
2. Manual backups:
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

---

## 🎉 You're Live!

Your Astral Power app is now deployed and running in production!

**Next Steps:**
- Share the URL with users
- Monitor performance metrics
- Collect feedback
- Iterate and improve

**Support:**
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Prisma Docs: [prisma.io/docs](https://prisma.io/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

---

*Happy deploying! 🚀*

