import { getArtistInfo } from './artistHelper';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop';

/**
 * Formats a list of artists into a randomized selection of 6 for carousel slides.
 * 
 * @param {Array} artists - The original array of artists.
 * @returns {Array} Array of formatted slide objects.
 */
export const formatArtistsToSlides = (artists) => {
    return [...artists]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map(a => {
            const info = getArtistInfo(a);
            return {
                img: a.profileImage || DEFAULT_IMG,
                title: `${a.artistName}\nTop in ${info.label}`,
                desc: `View the latest from our ${info.label} collection.`,
                path: info.path,
                color: info.color,
                artistId: a.id,
                artistName: a.artistName,
            };
        });
};

/**
 * Formats events into a chronologically sorted list, padding up to 6 items if necessary.
 * 
 * @param {Array} events - The original array of events.
 * @returns {Array} Array of sorted and padded events.
 */
export const formatTopEvents = (events) => {
    if (!events.length) return [];
    
    // Sort by date (ascending)
    const sorted = [...events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    // Pad to exactly 6 items by repeating if necessary
    let valid = sorted.slice(0, 6);
    while (valid.length > 0 && valid.length < 6) {
        valid = [...valid, ...valid].slice(0, 6);
    }
    return valid;
};