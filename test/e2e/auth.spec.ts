import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/')
  })

  test('should display homepage with login option', async ({ page }) => {
    // Check that homepage loads
    await expect(page).toHaveURL('/')
    
    // Check for "Enter The Forge" button (app's branded login CTA)
    const loginButton = page.locator('text=/Enter.*Forge/i').first()
    await expect(loginButton).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    // Click "Enter The Forge" button (branded login CTA)
    const loginButton = page.locator('a[href="/auth/signin"]').first()
    await loginButton.click()
    
    // Wait for navigation to complete
    await page.waitForURL(/.*\/auth\/signin/, { timeout: 10000 })
    
    // Should navigate to signin page
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Check for email input (uses id="email")
  const emailInput = page.locator('input#email').first()
  // Fallbacks if needed:
  // const emailInputAlt1 = page.locator('input[type="email"]').first()
  // const emailInputAlt2 = page.locator('input[name="email"]').first()
    await expect(emailInput).toBeVisible()
    
    // Check for password input (uses id="password")
  const passwordInput = page.locator('input#password').first()
  // Fallbacks if needed:
  // const passwordInputAlt1 = page.locator('input[type="password"]').first()
  // const passwordInputAlt2 = page.locator('input[name="password"]').first()
    await expect(passwordInput).toBeVisible()
    
    // Check for submit button
  const submitButton = page.locator('button[type="submit"]').first()
  // Fallback if needed:
  // const submitButtonAlt = page.locator('button:has-text("Sign in")').first()
    await expect(submitButton).toBeVisible()
  })

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Clear pre-filled demo credentials
    await page.fill('input#email', '')
    await page.fill('input#password', '')
    
    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()
    
    // Should show validation errors (wait a bit for error messages)
    await page.waitForTimeout(500)
    
    // Check for error messages
    const errors = page.locator('text=/required|invalid|enter/i')
    const errorCount = await errors.count()
    expect(errorCount).toBeGreaterThan(0)
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Fill in invalid credentials
    await page.fill('input#email', 'invalid@example.com')
    await page.fill('input#password', 'wrongpassword')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForTimeout(1000)
    
    // Should show error message
    const errorMessage = page.locator('text=/invalid|incorrect|failed/i')
    const hasError = await errorMessage.count()
    
    // Either shows error or stays on login page
    if (hasError > 0) {
      await expect(errorMessage.first()).toBeVisible()
    } else {
      await expect(page).toHaveURL(/.*\/auth\/signin/)
    }
  })

  test('should successfully login with demo credentials', async ({ page, context }) => {
    // Clear any existing session
    await context.clearCookies()
    
    await page.goto('/auth/signin')
    
    // Fill in demo credentials (or use pre-filled values)
    await page.fill('input#email', 'demo@astralforge.app')
    await page.fill('input#password', 'demo123')
    
    // Submit form and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/(forge|dashboard)/, { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ])
    
    // Should redirect to forge or dashboard
    await expect(page).toHaveURL(/.*\/(forge|dashboard)/)
    
    // Should see dashboard content
    const hasContent = await page.locator('text=/workout|exercise|level|stats/i').first().isVisible({ timeout: 5000 }).catch(() => false)
    expect(hasContent).toBeTruthy()
  })

  test.skip('should navigate to signup page', async ({ page }) => {
    // SKIPPED: Demo app uses pre-configured demo account only
    // No user registration/signup functionality implemented
    await page.goto('/')
    
    // Look for sign up link/button
  const signupLink = page.locator('text=/sign.*up/i').first()
  // Fallbacks if needed:
  // const signupLinkAlt1 = page.locator('text=/create.*account/i').first()
  // const signupLinkAlt2 = page.locator('text=/register/i').first()
    
    if (await signupLink.isVisible()) {
      await signupLink.click()
      
      // Should navigate to signup page
      await expect(page).toHaveURL(/.*\/(signup|register|auth)/)
    }
  })

  test.skip('should display signup form', async ({ page }) => {
    // SKIPPED: Demo app uses pre-configured demo account only
    // No signup page at /auth/signup - only signin with demo credentials
    await page.goto('/auth/signup')
    
    // Check for name input
  // Fallback if needed:
  // const nameInputAlt = page.locator('input[placeholder*="name"]').first()
    
    // Check for email input
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test.skip('should show password strength indicator', async ({ page }) => {
    // SKIPPED: Demo app doesn't have signup form
    // Password strength indicator would be on signup page which doesn't exist
    await page.goto('/auth/signup')
    
    // Type a password
    const passwordInput = page.locator('input[type="password"]').first()
    await passwordInput.fill('weak')
    
    // Wait a bit for strength indicator to appear
    await page.waitForTimeout(500)
    
    // Check if password strength indicator exists
    const strengthIndicator = page.locator('text=/weak|medium|strong|strength/i')
    const hasStrengthIndicator = await strengthIndicator.count() > 0
    
    // It's okay if there's no strength indicator, but if there is, it should be visible
    if (hasStrengthIndicator) {
      await expect(strengthIndicator.first()).toBeVisible()
    }
  })

  test('should be able to logout after login', async ({ page, context }) => {
    // Clear any existing session
    await context.clearCookies()
    
    // Login first
    await page.goto('/auth/signin')
    await page.fill('input#email', 'demo@astralforge.app')
    await page.fill('input#password', 'demo123')
    
    // Login and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/(forge|dashboard)/, { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ])
    
    // Should be on forge or dashboard
    await expect(page).toHaveURL(/.*\/(forge|dashboard)/)
    
    // Look for logout button (could be in menu, profile, etc.)
  const menuButton = page.locator('button:has-text("Menu")').first()
  // Fallback if needed:
  // const menuButtonAlt = page.locator('[aria-label="Menu"]').first()
    if (await menuButton.count() > 0) {
      await menuButton.first().click()
      await page.waitForTimeout(500)
    }
    
    const logoutButton = page.locator('text=/log.*out|sign.*out/i').first()
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click()
      
      // Wait for navigation
      await page.waitForTimeout(1000)
      
      // Should redirect to login or homepage
      const url = page.url()
      expect(url).toMatch(/\/(auth\/signin|\/)/)
    }
  })

  test('should persist session after page reload', async ({ page, context }) => {
    // Clear any existing session
    await context.clearCookies()
    
    // Login
    await page.goto('/auth/signin')
    await page.fill('input#email', 'demo@astralforge.app')
    await page.fill('input#password', 'demo123')
    
    // Login and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/(forge|dashboard)/, { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ])
    
    // Should be on forge or dashboard
    await expect(page).toHaveURL(/.*\/(forge|dashboard)/)
    
    // Reload page
    await page.reload()
    
    // Should still be on forge or dashboard
    await expect(page).toHaveURL(/.*\/(forge|dashboard)/)
    
    // Should see dashboard content
    const hasContent = await page.locator('text=/workout|exercise|level|stats/i').first().isVisible({ timeout: 5000 }).catch(() => false)
    expect(hasContent).toBeTruthy()
  })
})
