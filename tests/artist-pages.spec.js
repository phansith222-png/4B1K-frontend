import { test, expect } from '@playwright/test';

const GENRE_PAGES = ['/pop', '/rock', '/rnb', '/edm', '/etc', '/entertainment'];

test.describe('Artist pages', () => {
  test('/artists page renders without crash', async ({ page }) => {
    await page.goto('/artists');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Something went wrong');
  });

  for (const route of GENRE_PAGES) {
    test(`${route} page loads and renders content`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Should not show the generic error fallback
      await expect(page.locator('body')).not.toContainText('Something went wrong');
      // Page should have visible content
      await expect(page.locator('main, [role="main"], body > div')).toBeVisible();
    });
  }
});
