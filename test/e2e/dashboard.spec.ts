import { test, expect } from '@playwright/test'

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('/forge')
  
  // Check for dashboard sections (forge is the main dashboard)
  const totalWorkouts = page.locator('text=/total.*workout/i')
  const streak = page.locator('text=/streak/i')
  
  // At least one of these should be visible
  const hasContent = await totalWorkouts.count() > 0 || await streak.count() > 0
  expect(hasContent).toBeTruthy()
})

test('can navigate to workout session', async ({ page }) => {
  await page.goto('/forge')
  
  // Click start workout button if it exists
  const startButton = page.locator('text=Start Workout')
  if (await startButton.isVisible()) {
    await startButton.click()
    await expect(page).toHaveURL('/workout/session')
  }
})


