import { test, expect, Page } from '@playwright/test'

// Helper: signs up and lands on dashboard
async function signUp(page: Page, email: string, password = 'password123') {
  await page.goto('/signup')
  await page.getByTestId('auth-signup-email').fill(email)
  await page.getByTestId('auth-signup-password').fill(password)
  await page.getByTestId('auth-signup-submit').click()
  await page.waitForURL('/dashboard')
}

// Helper: clears localStorage before each test
async function clearStorage(page: Page) {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await page.waitForURL('/login')
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await signUp(page, 'user@test.com')
    await page.goto('/')
    await page.waitForURL('/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('/login')
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await signUp(page, 'newuser@test.com')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('empty-state')).toBeVisible()
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Create two users with separate habits
    await signUp(page, 'user1@test.com')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('User1 Habit')
    await page.getByTestId('habit-save-button').click()
    await page.getByTestId('auth-logout-button').click()

    await signUp(page, 'user2@test.com')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('User2 Habit')
    await page.getByTestId('habit-save-button').click()
    await page.getByTestId('auth-logout-button').click()

    // Log back in as user1
    await page.getByTestId('auth-login-email').fill('user1@test.com')
    await page.getByTestId('auth-login-password').fill('password123')
    await page.getByTestId('auth-login-submit').click()
    await page.waitForURL('/dashboard')

    await expect(page.getByTestId('habit-card-user1-habit')).toBeVisible()
    await expect(page.getByTestId('habit-card-user2-habit')).not.toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await signUp(page, 'create@test.com')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await signUp(page, 'complete@test.com')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Exercise')
    await page.getByTestId('habit-save-button').click()

    const streakEl = page.getByTestId('habit-streak-exercise')
    await expect(streakEl).toContainText('0')

    await page.getByTestId('habit-complete-exercise').click()
    await expect(streakEl).toContainText('1')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await signUp(page, 'persist@test.com')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Read Books')
    await page.getByTestId('habit-save-button').click()

    await page.reload()
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await signUp(page, 'logout@test.com')
    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('/login')
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Load the app first (caches the shell)
    await signUp(page, 'offline@test.com')
    await page.waitForTimeout(2000) // let service worker install

    // Go offline
    await context.setOffline(true)

    // Try to navigate — should not hard crash
    await page.goto('/')
    const body = await page.locator('body').textContent()
    expect(body).not.toBeNull()
    expect(body!.length).toBeGreaterThan(0)
  })
})