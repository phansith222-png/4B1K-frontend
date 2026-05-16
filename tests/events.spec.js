import { test, expect } from '@playwright/test';

test.describe('Events page', () => {
  test('/new-event loads and shows content or empty state', async ({ page }) => {
    await page.goto('/new-event');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Something went wrong');
  });

  test('category filter pills render', async ({ page }) => {
    await page.goto('/new-event');
    // Wait for loading to finish (skeleton disappears)
    await page.waitForFunction(() => !document.querySelector('.animate-pulse'), { timeout: 10000 });
    // At minimum the "All" category pill should exist
    const allPill = page.getByRole('button', { name: /^All$/i });
    await expect(allPill).toBeVisible();
  });
});
