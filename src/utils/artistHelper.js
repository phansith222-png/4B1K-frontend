import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';


export const getArtistInfo = (artist) => {
    const id = Number(artist.id);
    if (GENRE_ARTIST_IDS.pop.includes(id))     return { path: '/pop',     color: '#FF007F', label: 'Pop' };
    if (GENRE_ARTIST_IDS.rock.includes(id))    return { path: '/rock',    color: '#D3131F', label: 'Rock' };
    if (GENRE_ARTIST_IDS.classic.includes(id)) return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
    if (GENRE_ARTIST_IDS.etc.includes(id))     return { path: '/etc',     color: '#CEFF67', label: 'Hiphop / EDM' };

    const gs = artist.genres?.map(g => g.genre?.name?.toLowerCase() ?? '') ?? [];
    if (gs.some(g => g.includes('rock')))  return { path: '/rock',    color: '#D3131F', label: 'Rock' };
    if (gs.some(g => g.includes('r&b') || g.includes('rnb'))) return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
    if (gs.some(g => g.includes('hip hop') || g.includes('edm'))) return { path: '/etc', color: '#CEFF67', label: 'Hiphop / EDM' };
    return { path: '/pop', color: '#FF007F', label: 'Pop' };
};