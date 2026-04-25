/**
 * จัดระเบียบข้อมูล Artist รายคน (ให้มี artist, songs, events เสมอ)
 */
export const normalizeArtist = (res) => {
    // ดึงก้อนข้อมูลหลักออกมา ไม่ว่า Backend จะส่งมาในชื่ออะไร
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
        // ดึงเพลงและอีเวนต์ออกมา ถ้าไม่มีให้เป็น Array ว่างป้องกัน Error .map()
        songs: Array.isArray(data.songs) ? data.songs : [],
        events: Array.isArray(data.events) ? data.events : []
    };
};

/**
 * จัดระเบียบรายชื่อศิลปิน (ให้เป็น Array เสมอ)
 */
export const normalizeArtistList = (res) => {
    const list = res?.artists || res?.data || res || [];
    return Array.isArray(list) ? list : [];
};