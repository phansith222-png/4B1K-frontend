/**
 * 4B1K Video Showcase — Playwright Recording Script
 *
 * Records a cinematic walkthrough of all 6 features then saves
 * raw_showcase.webm + timestamps.json + recording_meta.json to ./videos/
 *
 * Usage:
 *   DEMO_USERNAME=youruser DEMO_PASS=yourpassword node scripts/showcase.js
 *
 * Then run:
 *   node scripts/split-video.js
 */

import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CONFIG = {
  BASE_URL: process.env.APP_URL || 'http://localhost:5173',
  USERNAME: process.env.DEMO_USERNAME || '',
  PASSWORD: process.env.DEMO_PASS || '',
  VIEWPORT: { width: 1920, height: 1080 },
  SLOW_MO: 30,
  VIDEO_DIR: path.join(ROOT, 'videos'),
};

if (!CONFIG.USERNAME || !CONFIG.PASSWORD) {
  console.error('\n  [ERROR] Set DEMO_USERNAME and DEMO_PASS before running.\n');
  process.exit(1);
}

// ─── TEST IMAGE (for post creator upload) ────────────────────────────────────
const TEST_IMAGE_PATH = path.join(CONFIG.VIDEO_DIR, 'showcase_img.png');

// ─── TIMESTAMP TRACKER ───────────────────────────────────────────────────────
const t0 = Date.now();
const timestamps = {};

function mark(label) {
  timestamps[label] = parseFloat(((Date.now() - t0) / 1000).toFixed(2));
  console.log(`  [MARK] ${label.padEnd(12)} = ${timestamps[label]}s`);
}

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────
// Uses setTimeout steps inside the browser — rAF is throttled in Playwright's
// recording context on Windows and can silently drop all frames.
async function smoothScroll(page, totalY, durationMs = 1200, containerId = null, forceWindow = false) {
  const steps = Math.max(40, Math.ceil(durationMs / 16));
  const stepDelay = Math.max(16, Math.floor(durationMs / steps));

  await page.evaluate(async ([totalY, steps, stepDelay, containerId, forceWindow]) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    function findScrollable(id) {
      if (id) {
        const byId = document.getElementById(id);
        if (byId && byId.scrollHeight > byId.clientHeight + 4) return byId;
      }
      const candidates = [
        ...document.querySelectorAll('main, [class*="scroll"], [class*="Scroll"], [class*="content"], [class*="Content"]'),
        document.documentElement,
        document.body,
      ];
      for (const el of candidates) {
        if (el && el.scrollHeight > el.clientHeight + 4) return el;
      }
      return null;
    }

    // forceWindow=true skips container detection and always scrolls the window.
    // Use this for pages that call window.scrollTo() themselves (e.g. /new-event).
    const el = forceWindow ? null : findScrollable(containerId);
    const startTop = el ? el.scrollTop : window.scrollY;

    for (let i = 1; i <= steps; i++) {
      await sleep(stepDelay);
      const pos = startTop + totalY * ease(i / steps);
      if (el) el.scrollTop = pos;
      else window.scrollTo(0, pos);
    }
  }, [totalY, steps, stepDelay, containerId, forceWindow]);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(CONFIG.VIDEO_DIR, { recursive: true });

  // Create a small valid PNG for image upload in post creator
  fs.writeFileSync(
    TEST_IMAGE_PATH,
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGBgIIAL' +
      'MBIYDhQKAAcCAAH/AY8pAAAAAElFTkSuQmCC',
      'base64'
    )
  );

  console.log('\n══════════════════════════════════════════');
  console.log('  4B1K VIDEO SHOWCASE — Starting Recording');
  console.log('══════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: CONFIG.SLOW_MO,
    args: ['--disable-web-security', '--allow-running-insecure-content'],
  });

  const context = await browser.newContext({
    viewport: CONFIG.VIEWPORT,
    recordVideo: {
      dir: CONFIG.VIDEO_DIR,
      size: CONFIG.VIEWPORT,
    },
  });

  const page = await context.newPage();

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  console.log('[LOGIN] Authenticating…');
  await page.goto(`${CONFIG.BASE_URL}/login`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500);

  // Click username field and type character-by-character (human pacing)
  await page.click('input[name="username"]');
  await page.waitForTimeout(500);
  await page.keyboard.type(CONFIG.USERNAME, { delay: 110 });
  await page.waitForTimeout(700);

  // Click password field and type
  await page.click('input[name="password"]');
  await page.waitForTimeout(500);
  await page.keyboard.type(CONFIG.PASSWORD, { delay: 110 });
  await page.waitForTimeout(900);

  await page.click('button[type="submit"]');

  try {
    await page.waitForURL(`${CONFIG.BASE_URL}/`, { timeout: 15000 });
  } catch {
    await page.waitForURL(`${CONFIG.BASE_URL}/home`, { timeout: 8000 });
  }
  await page.waitForTimeout(600);
  console.log('[LOGIN] Success\n');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 — LANDING PAGE + MUSIC PLAYER
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[SECTION 1] Landing Page');
  await page.goto(`${CONFIG.BASE_URL}/landing`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);

  mark('01_start');

  // Linger on hero
  await page.waitForTimeout(4000);

  // Scroll to Event Showcase
  await smoothScroll(page, 900, 1800);
  await page.waitForTimeout(3500);

  // Scroll to Artist Showcase
  await smoothScroll(page, 950, 1800);
  await page.waitForTimeout(3500);

  // Scroll to Feature Section
  await smoothScroll(page, 1000, 1800);
  await page.waitForTimeout(3000);

  // Slow scroll back to top
  await smoothScroll(page, -2900, 2200);
  await page.waitForTimeout(2500);

  // ── MUSIC PLAYER INTERACTION ────────────────────────────────────────────────
  console.log('  [MUSIC] Opening player…');

  // Wait for mini player button
  const miniPlayerBtn = page.locator('button:has(svg.lucide-music)').first();
  const miniVisible = await miniPlayerBtn.isVisible({ timeout: 8000 }).catch(() => false);

  if (miniVisible) {
    await miniPlayerBtn.click();
    await page.waitForTimeout(1500); // expand animation

    // Wait for expanded player header text
    await page.locator('span', { hasText: /Cyber Player/i }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
    await page.waitForTimeout(2000); // let songs load and layout settle

    // Controls: Previous | Play/Pause | Next
    const playPauseBtn = page.locator('button.w-12.h-12').first();
    // Assuming icons are within buttons
    const prevBtn = page.locator('button:has(svg.lucide-skip-back)').first();
    const nextBtn = page.locator('button:has(svg.lucide-skip-forward)').first();

    if (await playPauseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Play
      await playPauseBtn.click();
      console.log('    ▶ Play');
      await page.waitForTimeout(4000);

      // Forward (next)
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        console.log('    ⏭ Next');
        await page.waitForTimeout(3500);
      }

      // Pause
      await playPauseBtn.click();
      console.log('    ⏸ Pause');
      await page.waitForTimeout(1500);

      // Previous
      if (await prevBtn.isVisible()) {
        await prevBtn.click();
        console.log('    ⏮ Previous');
        await page.waitForTimeout(2500);
      }

      // Minimize — the header row has the chevron button
      const minimizeBtn = page.locator('button:has(svg.lucide-chevron-down)').first();
      if (await minimizeBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await minimizeBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  } else {
    console.log('    ⚠️ Mini player not found on landing page.');
  }

  mark('01_end');
  console.log('  ✓ Done\n');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2 — COMMUNITY (full walkthrough)
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[SECTION 2] Community');
  await page.goto(`${CONFIG.BASE_URL}/home`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500);

  mark('02_start');

  // ── 2a: Admire the layout ──────────────────────────────────────────────────
  await page.waitForTimeout(1500);
  await smoothScroll(page, 400, 1000, 'main-scroll-container');
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1000);

  // ── 2b: Create a post ──────────────────────────────────────────────────────
  console.log('  [POST] Opening post creator…');
  await page.locator('text=Share your concert vibe...').click();
  await page.waitForTimeout(1200);

  // Type content
  const textarea = page.locator('textarea[placeholder*="concert vibes"]');
  if (await textarea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await textarea.click();
    await page.keyboard.type('🎵 Amazing show tonight! The energy was off the charts! #4B1K #Concert', { delay: 30 });
    await page.waitForTimeout(1000);
  }

  // Upload image via hidden file input
  const fileInput = page.locator('input[type="file"][accept="image/*"]');
  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
    await page.waitForTimeout(1200);
    console.log('    📷 Image attached');
  }

  // Tag an artist — click the "+ Tag Artist" button
  const tagArtistBtn = page.locator('button').filter({ hasText: /\+\s*Tag Artist/i }).first();
  if (await tagArtistBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await tagArtistBtn.click();
    await page.waitForTimeout(1200);

    // Artist picker modal
    const pickerInput = page.locator('input[placeholder*="Search artist"]');
    if (await pickerInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pickerInput.fill('');
      await page.waitForTimeout(800);

      // Click first artist in the scrollable list
      const artistList = page.locator('div.fixed.z-\\[10000\\] .overflow-y-auto button');
      const artistCount = await artistList.count();
      if (artistCount > 0) {
        await artistList.first().click();
        await page.waitForTimeout(800);
        console.log('    🎤 Artist tagged');
      }

      // Confirm selection
      const confirmBtn = page.locator('button').filter({ hasText: /Confirm Selection/i });
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(1000);
      }
    }
  }

  // Submit the post
  const postVibeBtn = page.locator('button').filter({ hasText: /POST VIBE/i });
  if (await postVibeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await postVibeBtn.click();
    await page.waitForTimeout(3000); // Wait for upload and UI update
    console.log('    ✓ Post submitted');
  }

  // Scroll down through the feed to see posts after submitting
  await smoothScroll(page, 700, 1800, 'main-scroll-container');
  await page.waitForTimeout(2000);
  await smoothScroll(page, 700, 1800, 'main-scroll-container');
  await page.waitForTimeout(2000);
  await smoothScroll(page, 600, 1800, 'main-scroll-container');
  await page.waitForTimeout(1500);
  // Scroll back to top
  await smoothScroll(page, -2100, 2000, 'main-scroll-container');
  await page.waitForTimeout(1200);

  // ── 2c: Concert Event sidebar → back ───────────────────────────────────────
  console.log('  [NAV] Concert Event');
  const leftAside = page.locator('aside').first();
  const concertEventLink = leftAside.locator('text=Concert Event');
  if (await concertEventLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await concertEventLink.click();
    await page.waitForURL('**/new-event', { timeout: 6000 }).catch(() => null);
    await page.waitForTimeout(1500);
  }

  await page.goto(`${CONFIG.BASE_URL}/home`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);

  // ── 2d: All Artist sidebar → back ──────────────────────────────────────────
  console.log('  [NAV] All Artist');
  const allArtistLink = page.locator('aside').first().locator('text=All Artist');
  if (await allArtistLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await allArtistLink.click();
    await page.waitForURL('**/artists', { timeout: 6000 }).catch(() => null);
    await page.waitForTimeout(1500);
    // Quick scroll on artists page
    await smoothScroll(page, 400, 1000);
    await page.waitForTimeout(800);
  }

  await page.goto(`${CONFIG.BASE_URL}/home`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);

  // ── 2e: Map Event → click 1 marker → back ─────────────────────────────────
  console.log('  [NAV] Map Event');
  const mapEventLink = page.locator('aside').first().locator('text=Map Event');
  if (await mapEventLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await mapEventLink.click();
    await page.waitForURL('**/nearby-events', { timeout: 6000 }).catch(() => null);
    // Wait for Mapbox canvas to render
    await page.locator('.mapboxgl-canvas').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(2500);

    // Click the first event marker on the map
    const mapMarker = page.locator('.mapboxgl-marker').first();
    if (await mapMarker.isVisible({ timeout: 4000 }).catch(() => false)) {
      await mapMarker.click();
      await page.waitForTimeout(2000);
      console.log('    📍 Marker clicked');
    }
  }

  await page.goto(`${CONFIG.BASE_URL}/home`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);

  // ── 2f: Click 2 Trending Artists in right sidebar ──────────────────────────
  console.log('  [FILTER] Trending Artists (×2)');
  const rightAside = page.locator('aside').nth(1);
  const trendingItems = rightAside.locator('div[class*="cursor-pointer"][class*="rounded-2xl"]');
  const trendingCount = await trendingItems.count().catch(() => 0);
  for (let i = 0; i < Math.min(2, trendingCount); i++) {
    const item = trendingItems.nth(i);
    if (await item.isVisible({ timeout: 2000 }).catch(() => false)) {
      await item.click();
      await page.waitForTimeout(1000);
      console.log(`    🔥 Artist ${i + 1} selected`);
    }
  }

  // Scroll down to see filtered results
  await page.waitForTimeout(800);
  await smoothScroll(page, 500, 1000, 'main-scroll-container');
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(600);

  mark('02_end');
  console.log('  ✓ Done\n');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3 — EDIT PROFILE
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[SECTION 3] Edit Profile');
  await page.goto(`${CONFIG.BASE_URL}/editprofile`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500);

  mark('03_start');

  // Hover avatar upload area
  const avatarArea = page.locator('[class*="avatar"], [class*="Avatar"]').first();
  if (await avatarArea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await avatarArea.hover();
    await page.waitForTimeout(700);
  }

  // First name
  const firstNameInput = page.locator('input[name="firstName"]');
  if (await firstNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await firstNameInput.click();
    await page.waitForTimeout(150);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('Showcase', { delay: 40 });
    await page.waitForTimeout(350);
  }

  // Last name
  const lastNameInput = page.locator('input[name="lastName"]');
  if (await lastNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await lastNameInput.click();
    await page.waitForTimeout(150);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('Demo', { delay: 40 });
    await page.waitForTimeout(350);
  }

  // National ID — 13 digits triggers verified checkmark
  const nationalIdInput = page.locator('input[name="nationalId"]');
  if (await nationalIdInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await nationalIdInput.click();
    await page.waitForTimeout(150);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('1234567890123', { delay: 40 });
    await page.waitForTimeout(450);
  }

  // Scroll down to reveal more fields
  await smoothScroll(page, 300, 800);
  await page.waitForTimeout(700);

  // Hover Save button to show gradient glow
  const saveBtn = page
    .locator('button[type="submit"], button')
    .filter({ hasText: /save|Save/i })
    .first();
  if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await saveBtn.hover();
    await page.waitForTimeout(800);
  }

  mark('03_end');
  console.log('  ✓ Done\n');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4 — ARTIST BIOGRAPHY & SONG
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[SECTION 4] Artist Bio & Song');
  await page.goto(`${CONFIG.BASE_URL}/pop`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500);

  mark('04_start');

  // Linger on hero banner
  await page.waitForTimeout(2500);

  // Scroll to Bio Section
  await smoothScroll(page, 750, 2000);
  await page.waitForTimeout(2000);

  // Scroll to Music Player Section
  await smoothScroll(page, 800, 2000);
  await page.waitForTimeout(1500);

  // Click song 1 — triggers StickyMusicPlayer
  const allSongBtns = page.locator('section button, [class*="song"] button, [class*="track"] button, [class*="Song"] button, [class*="Track"] button');
  const songCard = page.locator('button').filter({ hasText: /Top Track/i }).first();

  const clickSong = async (idx) => {
    const byIdx = allSongBtns.nth(idx);
    if (await byIdx.isVisible({ timeout: 1500 }).catch(() => false)) {
      await byIdx.click();
      return true;
    }
    return false;
  };

  if (await songCard.isVisible({ timeout: 2000 }).catch(() => false)) {
    await songCard.click();
  } else {
    await clickSong(0);
  }
  await page.waitForTimeout(3000); // StickyMusicPlayer slides in

  // Click song 2
  console.log('  [SONG] Click song 2');
  await clickSong(1);
  await page.waitForTimeout(3000);

  // Click song 3
  console.log('  [SONG] Click song 3');
  await clickSong(2);
  await page.waitForTimeout(2500);

  // Scroll to Concert Section
  await smoothScroll(page, 950, 2000);
  await page.waitForTimeout(2000);

  // Scroll to Stats Section
  await smoothScroll(page, 800, 2000);
  await page.waitForTimeout(1500);

  mark('04_end');
  console.log('  ✓ Done\n');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5a — CONCERT EVENTS (with random filter + random event click)
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[SECTION 5a] Concert Events');
  await page.goto(`${CONFIG.BASE_URL}/new-event`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);

  mark('05_start');

  // Admire the hero / event slider
  await page.waitForTimeout(1200);

  // Hover featured slider area
  const sliderArea = page
    .locator('[class*="slider"], [class*="Slider"], [class*="featured"], [class*="hero"]')
    .first();
  if (await sliderArea.isVisible({ timeout: 2000 }).catch(() => false)) {
    await sliderArea.hover();
    await page.waitForTimeout(800);
  }

  // ── Click a random non-"All" category filter ────────────────────────────────
  const knownCategories = ['Concert', 'Festival', 'Pop', 'Rock', 'R&B', 'EDM', 'Live', 'Show'];
  let clickedFilter = false;
  const filterBtns = page.locator('button.rounded-full.text-\\[10px\\]');
  const filterCount = await filterBtns.count().catch(() => 0);

  // Scroll to filter pills: rect.top is already viewport-relative, so it IS the
  // scroll delta — adding window.scrollY here would double-count and cause a jump.
  const filterScrollDelta = await page.evaluate(() => {
    const pill = document.querySelector('button.rounded-full');
    if (!pill) return 380;
    return pill.getBoundingClientRect().top - 120;
  });
  await smoothScroll(page, filterScrollDelta, 1800, null, true);
  await page.waitForTimeout(1200);

  if (filterCount > 1) {
    // Pick a random filter (not 'All', which is usually index 0)
    const randomFilterIdx = Math.floor(Math.random() * (filterCount - 1)) + 1;
    const randomBtn = filterBtns.nth(randomFilterIdx);
    if (await randomBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await randomBtn.click();
      await page.waitForTimeout(1200);
      console.log(`  [FILTER] Clicked random category filter`);
      clickedFilter = true;
    }
  }

  if (!clickedFilter) {
    // Fallback logic
    for (const cat of knownCategories) {
      const btn = page.locator('button').filter({ hasText: new RegExp(`^${cat}$`, 'i') }).first();
      if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1200);
        console.log(`  [FILTER] Category fallback: ${cat}`);
        break;
      }
    }
  }

  // Scroll to first event card — same pattern: use rect.top (viewport-relative) as delta
  const cardScrollDelta = await page.evaluate(() => {
    const card = document.querySelector('[id^="event-item-"]');
    if (!card) return 350;
    return card.getBoundingClientRect().top - 140;
  });
  await smoothScroll(page, cardScrollDelta, 1800, null, true);
  await page.waitForTimeout(1200);

  // Slow scroll through event list to showcase cards
  await smoothScroll(page, 400, 1800, null, true);
  await page.waitForTimeout(1000);
  await smoothScroll(page, 400, 1800, null, true);
  await page.waitForTimeout(1200);

  // ── Click a random event card ───────────────────────────────────────────────
  const eventCards = page.locator('[id^="event-item-"]');
  const cardCount = await eventCards.count().catch(() => 0);
  if (cardCount > 0) {
    const idx = Math.floor(Math.random() * Math.min(cardCount, 8));
    const card = eventCards.nth(idx);
    if (await card.isVisible({ timeout: 2000 }).catch(() => false)) {
      await card.hover();
      await page.waitForTimeout(1000);
      await card.click();
      await page.waitForTimeout(2500);
      console.log(`  [EVENT] Clicked random card #${idx + 1}`);

      // If navigated to event detail, scroll a bit then go back
      if (!page.url().includes('/new-event')) {
        await smoothScroll(page, 400, 1600, null, true);
        await page.waitForTimeout(1200);
        await page.goBack();
        await page.waitForTimeout(1500);
      }
    }
  } else {
    console.log('  [EVENT] No event cards found to click.');
  }

  // Smooth scroll back to top after event interaction
  await smoothScroll(page, -900, 1800, null, true);
  await page.waitForTimeout(1000);

  mark('05_end');

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5b — CHAT ROOM
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[SECTION 5b] Chat Room');
  await page.goto(`${CONFIG.BASE_URL}/chat`);
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500);

  mark('06_start');

  // Let socket connect and sidebar populate
  await page.waitForTimeout(2000);

  // Ensure the Community tab is active so we land in a group chat room
  const communityTabChat = page.locator('button').filter({ hasText: /^community$/i }).first();
  if (await communityTabChat.isVisible({ timeout: 2000 }).catch(() => false)) {
    await communityTabChat.click();
    await page.waitForTimeout(1500);
  }

  // Click the first existing community group chat room.
  // ChatSidebar renders each room as a motion.button (=> <button>) inside a
  // flex-1 overflow-y-auto div. We target buttons with the known base classes.
  let groupRoomClicked = false;
  const roomBtnSelectors = [
    'div.overflow-y-auto button',          // room list container → button
    'button[class*="rounded-2xl"][class*="w-full"]', // motion.button classes
    'button[class*="p-3"]',               // padding class present on room items
  ];
  for (const sel of roomBtnSelectors) {
    const rooms = page.locator(sel);
    const count = await rooms.count().catch(() => 0);
    if (count > 0) {
      const room = rooms.first();
      if (await room.isVisible({ timeout: 1500 }).catch(() => false)) {
        await room.click();
        await page.waitForTimeout(2000);
        console.log(`    💬 Group room opened (${sel})`);
        groupRoomClicked = true;
        break;
      }
    }
  }
  if (!groupRoomClicked) console.log('    ⚠️ No group room found in sidebar');

  // Type and send message 1
  const chatInput = page
    .locator(
      'input[placeholder*="message"], input[placeholder*="Message"], ' +
      'input[placeholder*="Type"], textarea[placeholder*="message"]'
    )
    .first();
  if (await chatInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await chatInput.click();
    await page.waitForTimeout(400);
    await page.keyboard.type('Hello everyone! 🎵 Welcome to 4B1K — your concert community!', { delay: 70 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter'); // send
    console.log('    ✉ Message 1 sent');
    await page.waitForTimeout(1800);

    // Type and send message 2 with emoji
    await chatInput.click();
    await page.waitForTimeout(400);
    await page.keyboard.type('Who\'s going to the next concert? 🎶🔥 Drop your plans below!', { delay: 70 });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter'); // send
    console.log('    ✉ Message 2 sent');
    await page.waitForTimeout(2000);
  }

  // Switch to Personal tab
  const personalTab = page.locator('button').filter({ hasText: /personal|Personal/i }).first();
  if (await personalTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    await personalTab.click();
    await page.waitForTimeout(1500);
  }

  // Switch back to Community tab
  const communityTab = page.locator('button').filter({ hasText: /community|Community/i }).first();
  if (await communityTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    await communityTab.click();
    await page.waitForTimeout(1200);
  }

  mark('06_end');
  console.log('  ✓ Done\n');

  // ════════════════════════════════════════════════════════════════════════════
  // FINALIZE
  // ════════════════════════════════════════════════════════════════════════════
  console.log('[FINALIZE] Closing browser and saving recording…');
  const rawVideoPath = await page.video().path();
  await context.close();
  await browser.close();

  // Rename raw video to a stable name
  const stablePath = path.join(CONFIG.VIDEO_DIR, 'raw_showcase.webm');
  if (fs.existsSync(rawVideoPath)) {
    fs.renameSync(rawVideoPath, stablePath);
  }

  fs.writeFileSync(
    path.join(CONFIG.VIDEO_DIR, 'recording_meta.json'),
    JSON.stringify({ videoPath: stablePath }, null, 2)
  );
  fs.writeFileSync(
    path.join(CONFIG.VIDEO_DIR, 'timestamps.json'),
    JSON.stringify(timestamps, null, 2)
  );

  // Print summary table
  const sections = [
    ['Landing + Music', '01_start', '01_end'],
    ['Community', '02_start', '02_end'],
    ['Edit Profile', '03_start', '03_end'],
    ['Artist Bio & Song', '04_start', '04_end'],
    ['Concert + Chat', '05_start', '06_end'],
  ];

  const fmt = (t) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  console.log('\n══════════════════════════════════════════');
  console.log('  RECORDING COMPLETE');
  console.log('══════════════════════════════════════════');
  sections.forEach(([name, s, e]) => {
    const start = timestamps[s] ?? 0;
    const end = timestamps[e] ?? 0;
    const dur = (end - start).toFixed(1);
    console.log(`  ${name.padEnd(22)} ${fmt(start)} → ${fmt(end)}  (${dur}s)`);
  });
  console.log('──────────────────────────────────────────');
  console.log(`  Raw video : ${stablePath}`);
  console.log(`  Timestamps: ${path.join(CONFIG.VIDEO_DIR, 'timestamps.json')}`);
  console.log('\n  Next step : node scripts/split-video.js\n');
}

main().catch((err) => {
  console.error('\n[FATAL ERROR]', err.message);
  process.exit(1);
});
