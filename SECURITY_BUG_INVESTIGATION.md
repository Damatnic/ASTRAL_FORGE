# SECURITY BUG INVESTIGATION: Invalid Credentials Allow Login

**Priority:** P0 - CRITICAL SECURITY VULNERABILITY  
**Bug ID:** BUG-P1-002  
**Discovery Date:** October 7, 2025  
**Status:** 🔴 UNDER INVESTIGATION

---

## 🚨 Problem Summary

**Issue:** Invalid credentials successfully authenticate and grant access to the application.

**Test That Failed:**
```typescript
test('should show error for invalid credentials', async ({ page }) => {
  await page.goto('/auth/signin')
  await page.fill('input#email', 'invalid@example.com')
  await page.fill('input#password', 'wrongpassword')
  await page.click('button[type="submit"]')
  
  // Expected: Error message or stay on /auth/signin
  // Actual: Redirects to /forge (successful login!)
})
```

**Test Error:**
```
Expected pattern: /.*\/auth\/signin/
Received string:  "http://localhost:4001/forge"
```

**Impact:**
- 🚨 **Complete authentication bypass**
- 🚨 **Any credentials allow access**
- 🚨 **Production deployment BLOCKED**
- 🚨 **User data at risk**

---

## 🔍 Evidence Collected

### 1. Test Execution Results

**Test Run Output:**
```
× should show error for invalid credentials (10.1s)

  1) [chromium] › test/e2e/auth.spec.ts:63:7 › Authentication › should show error for invalid credentials

     Error: expect(page).toHaveURL(expected)

     Expected pattern: /.*\/auth\/signin/
     Received string:  "http://localhost:4001/forge"

     Call log:
       - expect.toHaveURL with timeout 5000ms
       - waiting for locator('body')
       -   locator resolved to <body>…</body>
       - page.url() = "http://localhost:4001/forge"
```

**What This Tells Us:**
- Invalid credentials (`invalid@example.com` / `wrongpassword`)
- Form submission successful (no error thrown)
- Redirected to `/forge` (authenticated user destination)
- No error message shown to user
- Authentication completely bypassed

---

### 2. Backend Authentication Code Review

**File:** `lib/auth.ts`

**Code:**
```typescript
async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Invalid credentials')
  }
  
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    include: { profile: true },
  })
  
  if (!user || !user.passwordHash) {
    throw new Error('Invalid credentials')
  }
  
  const isValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  )
  
  if (!isValid) {
    throw new Error('Invalid credentials')
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}
```

**Analysis:**
- ✅ Validates credentials exist
- ✅ Looks up user in database
- ✅ Checks passwordHash exists
- ✅ Uses bcrypt to compare passwords
- ✅ Throws error if password doesn't match
- ✅ **LOGIC APPEARS CORRECT**

---

### 3. Frontend Signin Code Review

**File:** `app/auth/signin/page.tsx`

**Code:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/forge')
    }
  } catch (_err) {
    setError('Something went wrong')
  } finally {
    setLoading(false)
  }
}
```

**Analysis:**
- ✅ Calls NextAuth `signIn()` with credentials
- ✅ Sets `redirect: false` (correct)
- ✅ Checks `result?.error` for errors
- ✅ Shows error message if error exists
- ✅ Only redirects if no error
- ✅ **LOGIC APPEARS CORRECT**

---

### 4. NextAuth Configuration Review

**File:** `app/api/auth/[...nextauth]/route.ts`

**Code:**
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

**Analysis:**
- ✅ Standard NextAuth setup
- ✅ Delegates to `authOptions` from `lib/auth.ts`
- ✅ Exports GET and POST handlers
- ✅ **CONFIGURATION APPEARS CORRECT**

---

## 🤔 Hypotheses

### Hypothesis 1: Test User Actually Exists in Database ⚠️

**Theory:**  
The user `invalid@example.com` with password `wrongpassword` actually exists in the database.

**How to Test:**
1. Check database for user with email `invalid@example.com`
2. If exists, verify password hash matches `wrongpassword`
3. If exists, this is a test data issue, not a security bug

**Commands:**
```bash
# Using Prisma Studio
npx prisma studio

# Or direct SQL query
psql -d astral_power -c "SELECT email, passwordHash FROM users WHERE email = 'invalid@example.com';"
```

**Likelihood:** 🟡 MEDIUM
- Possible demo/test users created
- May have been seeded
- Easy to verify

---

### Hypothesis 2: Development Mode Auth Bypass 🟡

**Theory:**  
There's a development mode environment variable that bypasses authentication.

**How to Test:**
1. Check `.env` files for auth bypass flags
2. Look for `NODE_ENV=development` auth shortcuts
3. Search codebase for development mode checks

**Search Patterns:**
```typescript
// Look for these patterns
if (process.env.NODE_ENV === 'development')
if (process.env.SKIP_AUTH)
if (process.env.DEV_MODE)
```

**Commands:**
```bash
# Search for development mode auth bypasses
grep -r "NODE_ENV.*development" lib/auth.ts
grep -r "SKIP_AUTH" .
grep -r "bypass" lib/auth.ts
```

**Likelihood:** 🟢 HIGH
- Common in development
- Would explain behavior
- Easy to check

---

### Hypothesis 3: Middleware Auth Bypass 🟡

**Theory:**  
There's middleware that allows unauthenticated access in development.

**How to Test:**
1. Check if `middleware.ts` exists
2. Look for auth bypass logic
3. Verify protected routes

**Files to Check:**
- `middleware.ts`
- `app/middleware.ts`
- Any route middleware

**Likelihood:** 🟡 MEDIUM
- Middleware can bypass auth
- Common pattern
- Need to verify

---

### Hypothesis 4: NextAuth Session Strategy Issue 🔴

**Theory:**  
Session strategy (JWT) has issue with error handling.

**How to Test:**
1. Check session configuration in `lib/auth.ts`
2. Verify JWT callbacks
3. Test with session strategy changes

**Likelihood:** 🔴 LOW
- Would affect all auth
- Demo credentials work correctly
- Unlikely root cause

---

### Hypothesis 5: Bcrypt Compare Always Returns True 🔴

**Theory:**  
The bcrypt.compare() function is not working correctly.

**How to Test:**
1. Add console.log to auth.ts
2. Log bcrypt compare result
3. Verify actual comparison happening

**Likelihood:** 🔴 VERY LOW
- bcrypt is battle-tested
- Would break all auth
- Demo login works fine

---

### Hypothesis 6: Error Not Propagating to Frontend 🟢

**Theory:**  
Backend throws error, but NextAuth swallows it and returns success.

**How to Test:**
1. Add console.log to `authorize()` function
2. Check if error is thrown
3. Verify error makes it to frontend

**Likelihood:** 🟢 HIGH
- Error handling is complex
- NextAuth may catch errors
- Worth investigating

---

## 🔬 Investigation Plan

### Phase 1: Quick Checks (15 minutes)

**Priority:** Verify most likely causes first

1. **Check Database for Test User** ⭐ START HERE
   ```bash
   npx prisma studio
   # Or
   npm run db:studio
   ```
   - Search for `invalid@example.com`
   - If exists: This is the issue!
   - If not: Continue investigation

2. **Check Environment Variables**
   ```bash
   # View .env files
   cat .env
   cat .env.local
   cat .env.development
   ```
   - Look for `SKIP_AUTH`, `DEV_MODE`, etc.
   - Check `NODE_ENV` value

3. **Add Logging to Auth Flow**
   - Add console.log to `lib/auth.ts` authorize()
   - Log: credentials, user lookup, bcrypt result
   - Re-run test and check terminal output

---

### Phase 2: Deep Investigation (30 minutes)

**If Phase 1 doesn't find root cause:**

4. **Network Tab Analysis**
   - Run test with `--headed` flag
   - Open browser DevTools
   - Watch network tab during login
   - Check `/api/auth/callback/credentials` response

5. **Check Middleware**
   ```bash
   # Find middleware files
   find . -name "middleware.ts"
   ```
   - Read middleware code
   - Look for auth bypasses
   - Check route protection logic

6. **Add Extensive Logging**
   ```typescript
   // In lib/auth.ts authorize()
   console.log('🔐 Auth attempt:', {
     email: credentials.email,
     passwordProvided: !!credentials.password,
   })
   
   console.log('👤 User found:', {
     exists: !!user,
     hasPassword: !!user?.passwordHash,
   })
   
   const isValid = await bcrypt.compare(
     credentials.password,
     user.passwordHash
   )
   console.log('🔑 Password valid:', isValid)
   
   if (!isValid) {
     console.log('❌ Throwing error: Invalid credentials')
     throw new Error('Invalid credentials')
   }
   ```

---

### Phase 3: Systematic Testing (1 hour)

**If still not found:**

7. **Create Minimal Test Case**
   - Create standalone auth test
   - Bypass E2E framework
   - Direct API call to `/api/auth/callback/credentials`

8. **Test with Different Credentials**
   - Try: `test@test.com` / `wrong`
   - Try: `random@random.com` / `asdf`
   - Try: Demo credentials (should work)
   - Document which work/fail

9. **Check NextAuth Documentation**
   - Review error handling docs
   - Check common pitfalls
   - Verify credential provider setup

---

## 📋 Action Items

### Immediate (Next 30 minutes):

- [ ] **🔍 CHECK DATABASE** - Verify `invalid@example.com` doesn't exist
- [ ] **🔍 CHECK ENV VARS** - Look for auth bypass flags
- [ ] **🔍 ADD LOGGING** - Add console.log to auth.ts
- [ ] **🔍 RUN TEST AGAIN** - See what gets logged

### Short-term (Next 1-2 hours):

- [ ] **🔍 NETWORK ANALYSIS** - Check actual API responses
- [ ] **🔍 MIDDLEWARE CHECK** - Look for auth bypasses
- [ ] **🔍 ERROR PROPAGATION** - Verify errors reach frontend
- [ ] **🔍 MANUAL TESTING** - Try login in browser manually

### Once Fixed:

- [ ] **✅ UPDATE TEST** - Ensure test passes
- [ ] **✅ ADD REGRESSION TEST** - Prevent future issues
- [ ] **✅ DOCUMENT FIX** - Record root cause
- [ ] **✅ SECURITY REVIEW** - Full auth flow review

---

## 🎯 Success Criteria

**Fix is complete when:**

1. ✅ Invalid credentials (`invalid@example.com` / `wrongpassword`) **fail**
2. ✅ Error message shown to user
3. ✅ User stays on `/auth/signin` page
4. ✅ Valid credentials (demo@astralforge.app) still work
5. ✅ Test "should show error for invalid credentials" **passes**
6. ✅ All 11 auth tests pass (100%)
7. ✅ Root cause documented
8. ✅ Prevention measures in place

---

## 📊 Investigation Log

### Entry 1: Initial Discovery
**Date:** October 7, 2025  
**Discovered by:** E2E test suite  
**Test:** `test/e2e/auth.spec.ts` - "should show error for invalid credentials"

**Observation:**
- Invalid credentials redirect to `/forge`
- Expected to stay on `/auth/signin` or show error
- Test fails consistently

**Next Step:** Code review

---

### Entry 2: Code Review
**Date:** October 7, 2025

**Findings:**
- Backend auth logic: ✅ Correct
- Frontend error handling: ✅ Correct
- NextAuth config: ✅ Correct

**Mystery:** All code appears correct, but bug exists!

**Next Step:** Check database and environment

---

### Entry 3: [TO BE FILLED DURING INVESTIGATION]

---

## 🔗 Related Files

- `lib/auth.ts` - Authentication configuration
- `app/auth/signin/page.tsx` - Signin page
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `test/e2e/auth.spec.ts` - E2E authentication tests
- `.env` - Environment variables

---

## 📞 Escalation Path

**If investigation stalls:**

1. ✅ Review NextAuth documentation
2. ✅ Search GitHub issues for similar problems
3. ✅ Check Stack Overflow for credential provider issues
4. ✅ Ask in NextAuth Discord/community
5. ✅ Consider alternative auth approaches

---

**Status:** 🔴 Investigation in progress  
**Assigned:** Development team  
**Next Update:** After Phase 1 checks complete  
**Blocking:** Production deployment, Milestone 2 completion
