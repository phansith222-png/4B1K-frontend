/**
 * Normalizes a single artist's data to ensure consistent structure (artist, songs, events).
 * 
 * @param {Object} res - API response containing artist data.
 * @returns {{ artist: Object|null, songs: Array, events: Array }} Normalized artist object.
 */
export const normalizeArtist = (res) => {
    // Extract main data object regardless of backend payload wrapper
    const data = res?.artist || res?.data || res || null;

    if (!data) return { artist: null, songs: [], events: [] };

    return {
        artist: {
            id: data.id,
            artistName: data.artistName,
            biography: data.biography,
            profileImage: data.profileImage,
            agency: data.agency || null,
            genres: data.genres || [],
        },
        // Ensure arrays to prevent .map() errors
        songs: Array.isArray(data.songs) ? data.songs : [],
        events: Array.isArray(data.events) ? data.events : []
    };
};

/**
 * Normalizes an artist list to always return an array.
 * 
 * @param {Object|Array} res - API response.
 * @returns {Array} Array of artists.
 */
export const normalizeArtistList = (res) => {
    const list = res?.artists || res?.data || res || [];
    return Array.isArray(list) ? list : [];
};


/**
 * Normalizes a single event's data.
 * 
 * @param {Object} res - API response.
 * @returns {{ event: Object|null, artists: Array, venue: Object|null }} Normalized event object.
 */
export const normalizeEvent = (res) => {
    // Extract main data object
    const data = res?.event || res?.data || res || null;

    if (!data) return { event: null, artists: [], venue: null };

    return {
        event: {
            id: data.id,
            eventName: data.eventName,
            description: data.description,
            coverImage: data.coverImage,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location, // Simple string location
            status: data.status,
        },
        // Handle included relationships
        artists: Array.isArray(data.artists) ? data.artists : [],
        venue: data.venue || null // For separate Venue tables
    };
};

/**
 * Normalizes an event list to always return an array.
 * 
 * @param {Object|Array} res - API response.
 * @returns {Array} Array of events.
 */
export const normalizeEventList = (res) => {
    // Support various payload structures (res.events, res.data.events, res.data)
    const list = res?.events || res?.data?.events || res?.data || res || [];
    return Array.isArray(list) ? list : [];
};