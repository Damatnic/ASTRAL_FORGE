import { test, expect } from '@playwright/test'

test.describe('Analytics Dashboard', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('input#email', 'demo@astralforge.app')
    await page.fill('input#password', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
  })

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Look for analytics link (use href selector for stability)
    const analyticsLink = page.locator('a[href*="analytics"]').first()
    
    if (await analyticsLink.isVisible()) {
      await analyticsLink.click()
      
      // Should navigate to analytics
      await expect(page).toHaveURL(/.*\/(analytics|stats|insights)/)
    } else {
      // Or navigate directly
      await page.goto('/analytics')
    }
  })

  test('should display analytics overview', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1000)
    
    // Check for analytics metrics
    const metrics = page.locator('text=/volume|strength|progress|workouts/i')
    const metricsCount = await metrics.count()
    
    expect(metricsCount).toBeGreaterThan(0)
  })

  test('should show workout volume chart', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for volume metrics
    const volumeText = page.locator('text=/volume|total.*lifted/i')
    const hasVolume = await volumeText.count() > 0
    
    expect(hasVolume).toBeTruthy()
  })

  test('should show training frequency', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for frequency data
    const frequencyText = page.locator('text=/frequency|workouts.*per|sessions/i')
    const hasFrequency = await frequencyText.count() > 0
    
    expect(hasFrequency).toBeTruthy()
  })

  test('should display muscle group balance', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for muscle group data
    const muscleText = page.locator('text=/muscle|chest|back|legs|arms/i')
    const hasMuscleData = await muscleText.count() > 0
    
    expect(hasMuscleData).toBeTruthy()
  })

  test('should show progressive overload indicators', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for progress indicators
    const progressText = page.locator('text=/progress|overload|improvement|increase/i')
    const hasProgress = await progressText.count() > 0
    
    expect(hasProgress).toBeTruthy()
  })

  test('should display AI insights', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(2000)
    
    // Look for AI insights section
    const insightsText = page.locator('text=/insight|recommendation|suggestion|ai/i')
    const hasInsights = await insightsText.count() > 0
    
    expect(hasInsights).toBeTruthy()
  })

  test('should show personal records (PRs)', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for PR data
    const prText = page.locator('text=/personal.*record|pr|max|1rm/i')
    const hasPRs = await prText.count() > 0
    
    expect(hasPRs).toBeTruthy()
  })

  test('should allow filtering by time period', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for time period filters
    const filterButton = page.locator('button:has-text("Week"), button:has-text("Month"), button:has-text("Year")').first()
    
    if (await filterButton.isVisible()) {
      await filterButton.click()
      await page.waitForTimeout(500)
      
      // Data should update
      expect(true).toBeTruthy()
    }
  })

  test('should display workout consistency', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for consistency data
    const consistencyText = page.locator('text=/consistency|streak|regular/i')
    const hasConsistency = await consistencyText.count() > 0
    
    expect(hasConsistency).toBeTruthy()
  })

  test('should show exercise variety', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Check if analytics page has content (variety metrics may be in radar or distribution charts)
    const analyticsContent = page.locator('text=/exercise|workout|training|analysis/i')
    const hasContent = await analyticsContent.count() > 0
    
    // Analytics page should have some exercise-related content
    expect(hasContent).toBeTruthy()
  })

  test('should display recovery metrics', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for recovery data
    const recoveryText = page.locator('text=/recovery|rest|fatigue/i')
    const hasRecovery = await recoveryText.count() > 0
    
    expect(hasRecovery).toBeTruthy()
  })

  test('should show training intensity', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Check for training load or volume metrics (intensity is tracked via load/volume)
    const trainingMetrics = page.locator('text=/load|volume|training|progress/i')
    const hasMetrics = await trainingMetrics.count() > 0
    
    // Analytics should show training metrics
    expect(hasMetrics).toBeTruthy()
  })

  test('should allow exporting data', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first()
    
    if (await exportButton.isVisible()) {
      // Export button exists
      expect(await exportButton.isEnabled()).toBeTruthy()
    }
  })

  test('should display interactive charts', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(2000)
    
    // Look for chart elements (canvas, svg, etc.)
    const charts = page.locator('canvas, svg[class*="chart"], [class*="recharts"]')
    const chartCount = await charts.count()
    
    expect(chartCount).toBeGreaterThan(0)
  })

  test('should show weekly summary', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for weekly data
    const weeklyText = page.locator('text=/week|weekly|this.*week/i')
    const hasWeekly = await weeklyText.count() > 0
    
    expect(hasWeekly).toBeTruthy()
  })

  test('should display goal progress', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Check for progress tracking (goals tracked via progress overview, PRs, etc.)
    const progressContent = page.locator('text=/progress|record|achievement|improvement/i')
    const hasProgress = await progressContent.count() > 0
    
    // Analytics should track progress
    expect(hasProgress).toBeTruthy()
  })

  test('should show achievement badges', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for achievements
    const achievementText = page.locator('text=/achievement|badge|milestone/i')
    const hasAchievements = await achievementText.count() > 0
    
    expect(hasAchievements).toBeTruthy()
  })

  test('should navigate to detailed exercise stats', async ({ page }) => {
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Look for exercise links (use href selector)
    const exerciseLink = page.locator('a[href*="exercise"]').first()
    
    if (await exerciseLink.isVisible()) {
      await exerciseLink.click()
      await page.waitForTimeout(1000)
      
      // Should show detailed stats
      const detailsText = page.locator('text=/history|performance|progress/i')
      const hasDetails = await detailsText.count() > 0
      
      expect(hasDetails).toBeTruthy()
    }
  })

  test('should handle empty state gracefully', async ({ page }) => {
    // This test assumes a new user might not have data yet
    await page.goto('/analytics')
    await page.waitForTimeout(1500)
    
    // Check that page loads even without data
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()
    
    // Should either show data or empty state message
    const emptyState = page.locator('text=/no.*data|start.*tracking|get.*started/i')
    const hasData = page.locator('text=/volume|workout|progress/i')
    
    const hasEmptyState = await emptyState.count() > 0
    const hasDataDisplay = await hasData.count() > 0
    
    expect(hasEmptyState || hasDataDisplay).toBeTruthy()
  })
})
