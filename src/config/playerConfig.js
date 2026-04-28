/**
 * src/config/playerConfig.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for the global StickyMusicPlayer.
 * Edit values here — StickyMusicPlayer.jsx and playerStore.js consume these.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { FALLBACK_IMAGES } from './constants';

// ── YouTube ───────────────────────────────────────────────────────────────────

/** DOM element id injected by the YouTube IFrame API */
export const PLAYER_ID = 'yt-global-player';

/** Volume the player starts at (0–100) */
export const DEFAULT_VOLUME = 80;

/** Volume threshold below which the "low" icon is shown instead of "high" */
export const VOLUME_LOW_THRESHOLD = 40;

// ── Queue / History ───────────────────────────────────────────────────────────

/** Max entries kept in the "previous songs" history stack */
export const HISTORY_MAX = 30;

/** How many artists to try before giving up in playRandom() */
export const RANDOM_RETRY_LIMIT = 5;

// ── Layout ────────────────────────────────────────────────────────────────────

/** Fixed width of the expanded player card — responsive: max 340px, but shrinks on small screens */
export const PLAYER_WIDTH = 'min(340px, calc(100vw - 2rem))';

/** z-index for the player (above page content, below modals) */
export const PLAYER_Z_INDEX = 200;

/** CSS position for the expanded card */
export const PLAYER_POSITION = { bottom: '1.5rem', right: '1.5rem' };

/** CSS position for the minimized pill */
export const MINI_POSITION = { bottom: '1.5rem', left: '1.5rem' };

// ── Beat Visualizer ───────────────────────────────────────────────────────────

/** Number of bars in the full-size beat visualizer */
export const BEAT_BARS_FULL = 12;

/** Number of bars in the mini (pill) beat visualizer */
export const BEAT_BARS_MINI = 4;

/** Animated height keyframes for each bar (%) - Multiple variants for realism */
export const BEAT_KEYFRAMES_VARIANTS = [
    ['20%', '80%', '40%', '95%', '25%'],
    ['30%', '75%', '55%', '85%', '35%'],
    ['15%', '95%', '35%', '80%', '20%'],
    ['40%', '65%', '30%', '90%', '45%']
];

/** Standard fallback if single keyframe is needed */
export const BEAT_KEYFRAMES = BEAT_KEYFRAMES_VARIANTS[0];

/** Base animation duration per bar (seconds); each bar adds BEAT_DURATION_STEP */
export const BEAT_DURATION_BASE = 0.55;
export const BEAT_DURATION_STEP = 0.06;

/** Delay between each bar (seconds) */
export const BEAT_DELAY_STEP = 0.05;

// ── Theme / Colors ────────────────────────────────────────────────────────────

/**
 * Cyberpunk color palette used throughout the player.
 * All player colors live here — do NOT hardcode hex values in components.
 */
export const PLAYER_COLORS = {
    accent: '#00F5D4',            // electric cyan — primary interactive color
    secondary: '#FF007F',            // hot pink / magenta — gradient partner
    bgDark: '#0D0F17',            // deepest background
    bgCard: '#12141E',            // card fill
    bgGlass: 'rgba(18,20,30,0.85)',// glassmorphism surface
    border: 'rgba(255,255,255,0.07)',
    borderHover: 'rgba(0,245,212,0.35)',
    textPrimary: '#F0F2FF',
    textMuted: '#6B7280',
};

// ── Fallback Media ────────────────────────────────────────────────────────────

/** Cover image shown when no song/artist image is available */
export const FALLBACK_COVER = FALLBACK_IMAGES.COVER;
