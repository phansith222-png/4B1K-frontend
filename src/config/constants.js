// ─── Storage Keys ───
export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
};

// ─── Default Fallback Images ───
export const FALLBACK_IMAGES = {
  ARTIST: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
  CONCERT: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  MUSIC: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  EVENT: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop',
  COVER: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop',
};

// ─── Event Fallback Images (Carousel) ───
export const EVENT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1533174000228-4f1b802a433a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a1a2a5bb001b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520095972714-909e91b05382?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
];

// ─── Default Social Links ───
export const DEFAULT_SOCIAL_LINKS = {
  SPOTIFY: 'https://spotify.com',
  YOUTUBE: 'https://youtube.com',
  INSTAGRAM: 'https://instagram.com',
  TWITTER: 'https://x.com',
  TICKET: 'https://www.thaiticketmajor.com/',
};

// ─── UI Config ───
export const UI_CONFIG = {
  GLOBAL_LOADER_DURATION: 800,
  PAGE_TRANSITION_DURATION: 500,
  REVEAL_ANIMATION_DURATION: 500,
};

// ─── Avatar Helper ───
export const getAvatarUrl = (name = 'User', options = {}) => {
  const { background = 'random', color = 'fff' } = options;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${background}&color=${color}`;
};
