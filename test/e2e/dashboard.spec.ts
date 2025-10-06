import { test, expect } from '@playwright/test'

test('dashboard loads correctly', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Check that the main heading is visible
  await expect(page.locator('text=Astral Power')).toBeVisible()
  
  // Check for dashboard sections
  await expect(page.locator('text=Total Workouts')).toBeVisible()
  await expect(page.locator('text=Today\'s Workout')).toBeVisible()
  await expect(page.locator('text=Current Streak')).toBeVisible()
})

test('can navigate to workout session', async ({ page }) => {
  await page.goto('/dashboard')
  
  // Click start workout button if it exists
  const startButton = page.locator('text=Start Workout')
  if (await startButton.isVisible()) {
    await startButton.click()
    await expect(page).toHaveURL('/workout/session')
  }
})


