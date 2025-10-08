# Milestone 4 Session 4: Dependency Optimization

**Date:** October 7, 2025  
**Duration:** 90 minutes (estimated)  
**Status:** 🔄 IN PROGRESS  
**Target:** Reduce shared chunks (53.6 KB + 31.9 KB = 85.5 KB)

---

## 📦 Dependency Analysis

### Current Dependencies (package.json)

**Production Dependencies:**
```
@prisma/client: ^5.7.1        → Database ORM client
bcryptjs: ^2.4.3              → Password hashing
clsx: ^2.1.0                  → Conditional classNames (~1 KB)
date-fns: ^3.0.6              → Date utilities (HEAVY ~15-20 KB)
html2canvas: ^1.4.1           → Screenshot generation (HEAVY ~30-40 KB)
lucide-react: ^0.544.0        → Icons (~43 KB with tree-shaking)
next: ^14.0.4                 → Framework
next-auth: ^4.24.5            → Authentication (HEAVY ~20-30 KB)
react: ^18.2.0                → Core library
react-dom: ^18.2.0            → DOM renderer
recharts: ^2.15.4             → Charts (NOW LAZY-LOADED ✅)
tailwind-merge: ^2.2.0        → Tailwind utilities (~2 KB)
zod: ^3.22.4                  → Validation (~10-12 KB)
```

---

## 🎯 Optimization Targets

### 🔴 HIGH PRIORITY: Heavy Dependencies

#### 1. html2canvas (30-40 KB) - HIGHEST IMPACT

**Current Usage:** Workout sharing feature (screenshot generation)

**Problem:**
- Large library (~30-40 KB)
- Used on ONE feature (workout sharing)
- Bundled in shared chunk (affects all 92 pages)
- 99% of users never use this feature

**Solution: Lazy Loading**
```typescript
// BEFORE (bad - bundles in shared chunk)
import html2canvas from 'html2canvas'

// AFTER (good - loads only when needed)
const html2canvas = await import('html2canvas')
```

**Expected Savings:** 30-40 KB × 92 pages = **2,760-3,680 KB total**  
**Effort:** Low (one file change)  
**Risk:** Low (feature-specific, easily testable)

**Action Items:**
- [ ] Find all html2canvas imports
- [ ] Convert to dynamic import
- [ ] Test workout sharing feature
- [ ] Verify bundle reduction

---

#### 2. date-fns (15-20 KB) - HIGH IMPACT

**Current Usage:** Date formatting, manipulation throughout app

**Problem:**
- Large library even with tree-shaking
- Modern browsers have Intl.DateTimeFormat
- Alternative: date-fns-tz (lighter) or native methods

**Solution Options:**

**Option A: Replace with Native JS (Best)**
```typescript
// BEFORE
import { format, addDays } from 'date-fns'
format(date, 'MMM dd, yyyy')

// AFTER (native)
new Intl.DateTimeFormat('en-US', { 
  month: 'short', day: 'numeric', year: 'numeric' 
}).format(date)
```

**Option B: Use date-fns-tz (lighter subset)**
```
npm install date-fns-tz
```

**Expected Savings:** 10-15 KB  
**Effort:** Medium-High (many files to refactor)  
**Risk:** Medium (need thorough testing)

**Action Items:**
- [ ] Audit all date-fns usage
- [ ] Determine if native JS can replace
- [ ] Create utility functions for common date operations
- [ ] Gradual migration with testing

**ROI:** Medium (good savings but high effort)

---

#### 3. next-auth (20-30 KB) - MEDIUM IMPACT

**Current Usage:** Authentication system

**Problem:**
- Essential dependency (can't remove)
- Version 4.24.5 (not latest)
- NextAuth v5 has better tree-shaking

**Solution: Upgrade to NextAuth v5**
```
npm install next-auth@latest
```

**Expected Savings:** 5-10 KB (better tree-shaking)  
**Effort:** Medium (breaking changes to handle)  
**Risk:** Medium-High (auth is critical)

**Action Items:**
- [ ] Review NextAuth v5 migration guide
- [ ] Test authentication flows
- [ ] Update auth configuration
- [ ] Verify session handling

**ROI:** Medium (savings with risk)

---

### 🟡 MEDIUM PRIORITY: Moderate Dependencies

#### 4. Prisma Client (Unknown size - investigate)

**Current Usage:** Database queries

**Concern:**
- Should be SERVER-SIDE ONLY
- If bundled in client = major problem
- Need to verify it's not in client bundle

**Investigation Needed:**
```powershell
# Check if Prisma is in client bundle
npm run analyze
# Look for @prisma/client in bundle analyzer
```

**Expected Findings:**
- Should NOT be in client bundle
- If it is: BIG PROBLEM (50+ KB waste)

**Action Items:**
- [ ] Verify Prisma is server-side only
- [ ] If in client bundle: add to next.config.js exclude
- [ ] Document findings

---

#### 5. zod (10-12 KB) - LOW-MEDIUM IMPACT

**Current Usage:** Form validation, API validation

**Problem:**
- Essential for type safety
- Size is reasonable for value provided

**Solution:** Keep (good ROI)

**No action needed** - zod provides strong typing and runtime validation. The 10-12 KB is justified.

---

### 🟢 LOW PRIORITY: Small/Optimized Dependencies

#### 6. clsx (1 KB) ✅
**Status:** Optimal - tiny utility, essential for conditional classes

#### 7. tailwind-merge (2 KB) ✅
**Status:** Optimal - prevents Tailwind class conflicts

#### 8. bcryptjs (Server-side only) ✅
**Status:** Should not be in client bundle

---

## 🚀 Next.js Upgrade Analysis

### Current: Next.js 14.0.4 → Target: 14.2.x or 15.x

**Benefits:**
- Improved tree-shaking algorithms
- Better code splitting
- Optimized runtime
- Bug fixes and security updates

**Risks:**
- Breaking changes (need migration guide)
- Potential for regressions
- Time investment for testing

**Recommendation:** Dedicate separate session (Session 5)

---

## 📊 Optimization Priority Matrix

| Dependency | Size | Effort | Risk | Savings | Priority |
|------------|------|--------|------|---------|----------|
| html2canvas | 30-40 KB | Low | Low | 30-40 KB | 🔴 HIGHEST |
| date-fns | 15-20 KB | High | Med | 10-15 KB | 🟡 Medium |
| next-auth upgrade | 20-30 KB | Med | Med | 5-10 KB | 🟡 Medium |
| Prisma (if bundled) | 50+ KB | Low | Low | 50+ KB | 🔴 HIGH |
| Next.js upgrade | N/A | High | Med | 5-10 KB | 🟡 Session 5 |

---

## 🎯 Session 4 Action Plan

### Phase 1: Quick Wins (30 min)

**1. html2canvas Lazy Loading** (15 min)
- Find usage in workout-share components
- Convert to dynamic import
- Test feature
- **Expected:** 30-40 KB savings

**2. Prisma Client Check** (15 min)
- Run bundle analyzer
- Verify Prisma is server-side only
- Document findings
- **Expected:** Confirm no issue OR fix major problem

### Phase 2: Careful Optimizations (40 min)

**3. date-fns Audit** (20 min)
- Count usage across codebase
- Identify replaceable instances
- Create migration plan
- **Expected:** Roadmap for future optimization

**4. NextAuth Upgrade Research** (20 min)
- Review v5 changelog
- Assess breaking changes
- Estimate migration effort
- **Decision:** Go/no-go for this session

### Phase 3: Implementation (20 min)

**5. Implement Top Priority** (20 min)
- Execute html2canvas lazy load
- Test thoroughly
- Measure bundle impact
- **Expected:** 30-40 KB reduction

---

## 📈 Success Metrics

**Target:** Reduce shared baseline from 88.4 KB to ≤70 KB (-18.4 KB)

**Session 4 Goals:**
- [ ] html2canvas lazy-loaded: -30 KB minimum
- [ ] Prisma verified as server-side only
- [ ] date-fns migration plan documented
- [ ] NextAuth upgrade decision made

**If Achieved:**
- **Savings:** 30 KB × 92 pages = **2,760 KB total**
- **New Baseline:** ~58 KB (exceeds goal!)

---

## 🔧 Tools & Commands

**Bundle Analysis:**
```powershell
$env:ANALYZE='true'; npm run build
```

**Find html2canvas usage:**
```powershell
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String "html2canvas"
```

**Find date-fns usage:**
```powershell
Get-ChildItem -Recurse -Include *.tsx,*.ts | Select-String "from 'date-fns'"
```

**Dependency sizes:**
```powershell
npx bundlephobia <package-name>
```

---

**Session Status:** 🔄 IN PROGRESS  
**Next Action:** Find and lazy-load html2canvas

