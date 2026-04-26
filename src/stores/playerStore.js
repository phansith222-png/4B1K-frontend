import { create } from 'zustand';
import { getAllArtists, getArtistById, getSongsByArtist } from '../api/artist';
import { HISTORY_MAX, RANDOM_RETRY_LIMIT } from '../config/playerConfig';

// ── Module-level caches (session-scoped, cleared on page refresh) ──────────────
let _artistListCache   = null;
let _artistDetailCache = {};  // id → { artist, songs }
let _listPromise       = null;

async function fetchArtistList() {
    if (_artistListCache) return _artistListCache;
    if (_listPromise)     return _listPromise;
    _listPromise = getAllArtists().then(res => {
        const list = res?.artists || res?.data || res || [];
        _artistListCache = list;
        return list;
    });
    return _listPromise;
}

async function fetchArtistWithSongs(artistId) {
    if (_artistDetailCache[artistId]) return _artistDetailCache[artistId];

    const [artistRes, songsRes] = await Promise.all([
        getArtistById(artistId).catch(() => null),
        getSongsByArtist(artistId).catch(() => null),
    ]);

    const artist = artistRes?.artist || artistRes?.data || artistRes;
    const songs = (() => {
        if (Array.isArray(songsRes))        return songsRes;
        if (Array.isArray(songsRes?.data))  return songsRes.data;
        if (Array.isArray(songsRes?.songs)) return songsRes.songs;
        if (Array.isArray(artist?.songs))   return artist.songs;
        return [];
    })();

    const result = { artist, songs };
    if (songs.length > 0) _artistDetailCache[artistId] = result;
    return result;
}

// Fisher-Yates shuffle
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Helper ────────────────────────────────────────────────────────────────────
function playQueueEntry(entry, set) {
    set({
        artist:          entry.artist,
        songs:           entry.songs,
        pendingPlayIndex: entry.songIdx,
    });
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const usePlayerStore = create((set, get) => ({
    // Current playback
    songs:           [],
    artist:          null,
    currentSongIndex: 0,
    isPlaying:       false,
    progress:        0,
    currentTime:     '0:00',
    duration:        '0:00',
    isPlayerReady:   false,
    isMinimized:     false,
    pendingPlayIndex: null,

    // ── Global shuffled queue (YouTube-style) ──────────────────────────────
    queue:      [],   // [{ artist, songs, songIdx }]  — all songs shuffled once
    queueIndex: -1,   // current position in queue (-1 = not in queue)

    // Controls populated by StickyMusicPlayer
    controls: {
        togglePlayPause:    () => {},
        handleSongSelect:   () => {},
        handleProgressClick: () => {}
    },

    setControls:      (controls) => set({ controls }),
    setPlayerState:   (s)        => set((prev) => ({ ...prev, ...s })),
    clearPendingPlay: ()         => set({ pendingPlayIndex: null }),
    toggleMinimize:   ()         => set(state => ({ isMinimized: !state.isMinimized })),

    // Build the global shuffled queue from all backend songs
    buildQueue: async () => {
        try {
            const list = await fetchArtistList();
            if (!list || list.length === 0) return;

            // Fetch all artist songs in parallel
            const results = await Promise.all(
                list.map(a => fetchArtistWithSongs(a.id || a._id).catch(() => null))
            );

            // Flatten every song into one big array
            const flat = [];
            results.forEach(result => {
                if (!result?.songs?.length) return;
                result.songs.forEach((_, songIdx) => {
                    flat.push({ artist: result.artist, songs: result.songs, songIdx });
                });
            });

            if (flat.length === 0) return;

            const shuffledQueue = shuffle(flat);
            set({ queue: shuffledQueue });
            return shuffledQueue;
        } catch (err) {
            console.error('buildQueue failed:', err);
        }
    },

    // Start playing from position 0 of the queue
    playFromQueue: (index = 0) => {
        const { queue } = get();
        if (!queue.length) return;
        const safeIdx = Math.max(0, Math.min(index, queue.length - 1));
        set({ queueIndex: safeIdx });
        playQueueEntry(queue[safeIdx], set);
    },

    // ▶▶ Next — advance in queue (wrap around with reshuffle)
    playNext: async () => {
        const { queue, queueIndex } = get();
        if (!queue.length) {
            await get().buildQueue();
            get().playFromQueue(0);
            return;
        }
        const nextIdx = queueIndex + 1;
        if (nextIdx >= queue.length) {
            // End of queue — reshuffle and start again
            const newQueue = shuffle(queue);
            set({ queue: newQueue, queueIndex: 0 });
            playQueueEntry(newQueue[0], set);
        } else {
            set({ queueIndex: nextIdx });
            playQueueEntry(queue[nextIdx], set);
        }
    },

    // ◀◀ Previous — go back in queue (or reshuffle at beginning)
    playPrevious: () => {
        const { queue, queueIndex } = get();
        if (!queue.length) return;
        if (queueIndex <= 0) {
            // Already at the start — wrap to end
            const lastIdx = queue.length - 1;
            set({ queueIndex: lastIdx });
            playQueueEntry(queue[lastIdx], set);
        } else {
            const prevIdx = queueIndex - 1;
            set({ queueIndex: prevIdx });
            playQueueEntry(queue[prevIdx], set);
        }
    },

    // Play a specific artist's songs (called from artist pages)
    // Tries to align queueIndex with the selected song
    playSongs: (artist, songs, startIndex = 0) => {
        const { queue } = get();

        // Find this song in the queue to keep queue-position in sync
        const foundQueueIdx = queue.findIndex(
            entry => entry.artist?.id === artist?.id && entry.songIdx === startIndex
        );

        set({
            artist,
            songs,
            isMinimized:     false,
            pendingPlayIndex: startIndex,
            queueIndex:       foundQueueIdx >= 0 ? foundQueueIdx : get().queueIndex,
        });
    },
}));
