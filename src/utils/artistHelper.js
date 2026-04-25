import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

/**
 * ดึงข้อมูลเส้นทาง สี และ Label ตามประเภทศิลปิน
 * ใช้สำหรับ Navbar, Search และการตกแต่ง UI
 */
export const getArtistInfo = (artist) => {
    if (!artist) return { path: '/pop', color: '#FF007F', label: 'Pop' };

    const id = Number(artist.id);

    // 1. เช็คจาก ID ก่อน (แม่นยำที่สุด)
    if (GENRE_ARTIST_IDS.pop.includes(id))      return { path: '/pop',     color: '#FF007F', label: 'Pop' };
    if (GENRE_ARTIST_IDS.rock.includes(id))     return { path: '/rock',    color: '#D3131F', label: 'Rock' };
    if (GENRE_ARTIST_IDS.classic.includes(id))  return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
    if (GENRE_ARTIST_IDS.etc.includes(id))      return { path: '/etc',     color: '#CEFF67', label: 'Hiphop / EDM' };

    // 2. ถ้าไม่เจอ ID ให้เช็คจากชื่อ Genre (Fallback)
    const gs = artist.genres?.map(g => g.genre?.name?.toLowerCase() ?? '') ?? [];
    if (gs.some(g => g.includes('rock')))                         return { path: '/rock',    color: '#D3131F', label: 'Rock' };
    if (gs.some(g => g.includes('r&b') || g.includes('rnb')))     return { path: '/classic', color: '#d83bb6', label: 'R&B / Classic' };
    if (gs.some(g => g.includes('hip hop') || g.includes('edm'))) return { path: '/etc',     color: '#CEFF67', label: 'Hiphop / EDM' };

    // Default
    return { path: '/pop', color: '#FF007F', label: 'Pop' };
};

/**
 * หา ID ของศิลปินที่จะแสดงผล
 * ลำดับความสำคัญ: Query Param > Genre Filter > Random Fallback
 */
export const getFilteredRandomArtistId = (artists, genreArtistIds, queryArtistId) => {
    if (queryArtistId) return Number(queryArtistId);

    // กรองศิลปินตามกลุ่มที่ส่งมา
    const filtered = artists.filter((a) => genreArtistIds?.includes(a.id));
    
    // Fallback: ถ้ากลุ่มที่กรองมาไม่มีศิลปินเลย ให้เลือกจากทั้งหมด (pool)
    const pool = filtered.length > 0 ? filtered : artists;
    
    if (pool.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex].id;
};