import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

/**
 * Retrieves route path, color, and label based on an artist's genre.
 * Used for Navbar, Search, and UI decorations.
 * 
 * @param {Object} artist - The artist object.
 * @returns {{ path: string, color: string, label: string }} Styling and route info.
 */
export const getArtistInfo = (artist) => {
    if (!artist) return { path: '/pop', color: '#FF007F', label: 'Pop' };

    const id = Number(artist.id);

    // 1. Check by exact ID first (most accurate)
    if (GENRE_ARTIST_IDS.pop.includes(id))      return { path: '/pop',     color: '#FF007F', label: 'Pop' };
    if (GENRE_ARTIST_IDS.rock.includes(id))     return { path: '/rock',    color: '#D3131F', label: 'Rock' };
    if (GENRE_ARTIST_IDS.classic.includes(id))  return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
    if (GENRE_ARTIST_IDS.etc.includes(id))      return { path: '/etc',     color: '#CEFF67', label: 'Hiphop / EDM' };

    // 2. Fallback to genre names if ID not found
    const gs = artist.genres?.map(g => g.genre?.name?.toLowerCase() ?? '') ?? [];
    if (gs.some(g => g.includes('rock')))                         return { path: '/rock',    color: '#D3131F', label: 'Rock' };
    if (gs.some(g => g.includes('r&b') || g.includes('rnb')))     return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
    if (gs.some(g => g.includes('hip hop') || g.includes('edm'))) return { path: '/etc',     color: '#CEFF67', label: 'Hiphop / EDM' };

    // Default fallback
    return { path: '/pop', color: '#FF007F', label: 'Pop' };
};

/**
 * Selects a random artist ID from a specific genre or fallback to any artist.
 * Priority: Query Param > Genre Filter > Random Fallback
 * 
 * @param {Array} artists - List of all artists.
 * @param {Array} genreArtistIds - List of allowed artist IDs for a genre.
 * @param {string|number} queryArtistId - Specific artist ID from query params.
 * @returns {number|null} The selected artist ID.
 */
export const getFilteredRandomArtistId = (artists, genreArtistIds, queryArtistId) => {
    if (queryArtistId) return Number(queryArtistId);

    // Filter by allowed genre IDs
    const filtered = artists.filter((a) => genreArtistIds?.includes(a.id));
    
    // Fallback: If no match, select from the entire pool
    const pool = filtered.length > 0 ? filtered : artists;
    
    if (pool.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex].id;
};