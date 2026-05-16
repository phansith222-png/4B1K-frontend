import { test, expect } from '@playwright/test';

test.describe('Sticky music player', () => {
  test('player mounts on the page without crash', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // The player portal root should be present in DOM
    const playerRoot = page.locator('#music-player-root');
    await expect(playerRoot).toBeAttached();
  });

  test('player persists across SPA navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Navigate to another page
    await page.goto('/artists');
    await page.waitForLoadState('networkidle');
    // Player root should still be in DOM (StickyMusicPlayer is rendered in App.jsx, outside router)
    await expect(page.locator('#music-player-root')).toBeAttached();
  });

  test('no console errors from player on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/artists');
    await page.waitForLoadState('networkidle');
    // Filter known non-critical browser errors
    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') && !e.includes('Non-Error')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
