import mainapi from './auth';

const TTL = 5 * 60 * 1000; // 5 minutes
const isFresh = (time) => Date.now() - time < TTL;

// ── Caches ───────────────────────────────────────────────────────────────────
let artistsCache = null;
let artistsCacheTime = 0;
let artistsPromise = null;

const artistDetailCache = new Map();
const songsCache = new Map();
const eventsCache = new Map();

const artistDetailPromises = new Map();
const songsPromises = new Map();
const eventsPromises = new Map();

/**
 * We return the RAW response data to maintain compatibility with existing 
 * components that expect a specific structure (e.g., res.data.artist or res.data.result)
 */
export const getAllArtists = async () => {
  if (artistsCache && isFresh(artistsCacheTime)) return artistsCache;
  if (artistsPromise) return artistsPromise;

  artistsPromise = mainapi.get('/artists').then(res => {
    artistsCache = res.data;
    artistsCacheTime = Date.now();
    artistsPromise = null;
    return res.data;
  }).catch(err => {
    artistsPromise = null;
    throw err;
  });

  return artistsPromise;
};

export const getArtistById = async (id) => {
  const cached = artistDetailCache.get(Number(id));
  if (cached && isFresh(cached.time)) return cached.data;
  if (artistDetailPromises.has(id)) return artistDetailPromises.get(id);

  const promise = mainapi.get(`/artists/${id}`).then(res => {
    artistDetailCache.set(id, { data: res.data, time: Date.now() });
    artistDetailPromises.delete(id);
    return res.data;
  }).catch(err => {
    artistDetailPromises.delete(id);
    throw err;
  });

  artistDetailPromises.set(id, promise);
  return promise;
};

export const getSongsByArtist = async (id) => {
  const cached = songsCache.get(Number(id));
  if (cached && isFresh(cached.time)) return cached.data;
  if (songsPromises.has(id)) return songsPromises.get(id);

  const promise = mainapi.get(`/artists/${id}/songs`).then(res => {
    songsCache.set(id, { data: res.data, time: Date.now() });
    songsPromises.delete(id);
    return res.data;
  }).catch(err => {
    songsPromises.delete(id);
    throw err;
  });

  songsPromises.set(id, promise);
  return promise;
};

export const getEventsByArtist = async (id) => {
  const cached = eventsCache.get(Number(id));
  if (cached && isFresh(cached.time)) return cached.data;
  if (eventsPromises.has(id)) return eventsPromises.get(id);

  const promise = mainapi.get(`/artists/${id}/events`).then(res => {
    eventsCache.set(id, { data: res.data, time: Date.now() });
    eventsPromises.delete(id);
    return res.data;
  }).catch(err => {
    eventsPromises.delete(id);
    throw err;
  });

  eventsPromises.set(id, promise);
  return promise;
};