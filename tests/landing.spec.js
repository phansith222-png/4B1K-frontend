import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('loads without unhandled JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors.filter(e => !e.includes('ResizeObserver'))).toHaveLength(0);
  });

  test('hero headline is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
  });

  test('auth CTA navigates to login or register', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /get started|sign in|join|login/i }).first();
    await cta.click();
    await expect(page).toHaveURL(/\/(login|register|auth)/);
  });

  test('video elements are muted (copyright safety)', async ({ page }) => {
    await page.goto('/');
    const videos = page.locator('video');
    const count = await videos.count();
    for (let i = 0; i < count; i++) {
      const muted = await videos.nth(i).evaluate((el) => el.muted);
      expect(muted).toBe(true);
    }
  });
});
