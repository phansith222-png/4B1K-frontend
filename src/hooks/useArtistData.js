import { useState, useEffect } from 'react';
import { getArtistById, getSongsByArtist, getEventsByArtist, getAllArtists } from '../api/artist';

/**
 * Custom hook to fetch artist, songs, and events data.
 *
 * @param {number[]|null} genreArtistIds - Array of artist IDs for this genre (used for random selection)
 * @param {string|null} queryArtistId - Specific artist ID from URL query param (overrides random)
 * @returns {{ artist, songs, events, loading }}
 */

const useArtistData = (genreArtistIds, queryArtistId) => {
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                setLoading(true);

                // 1. ดึงรายชื่อศิลปินทั้งหมดเพื่อมาทำ Filter หรือสุ่ม (ถ้าจำเป็น)
                let allArtistsRes = await getAllArtists().catch(() => []);
                const allArtistsList = 
                    allArtistsRes?.artists || 
                    allArtistsRes?.data || 
                    allArtistsRes || [];

                let filteredArtists = allArtistsList.filter((a) =>
                    genreArtistIds?.includes(a.id)
                );

                // Fallback: ถ้า filter แล้วไม่เจออะไรเลย ให้ใช้รายชื่อทั้งหมด
                if (filteredArtists.length === 0 && allArtistsList.length > 0) {
                    filteredArtists = allArtistsList;
                }

                // 2. กำหนดว่าเราจะดึงข้อมูลของ Artist ID ไหน
                let artistId;
                if (queryArtistId) {
                    artistId = Number(queryArtistId);
                } else if (filteredArtists.length > 0) {
                    const randomIndex = Math.floor(Math.random() * filteredArtists.length);
                    artistId = filteredArtists[randomIndex].id;
                } else {
                    setArtist(null);
                    setLoading(false);
                    return;
                }

                // 3. ดึงข้อมูลจาก API แค่เส้นเดียว (Single Point of Truth)
                // เพราะ Backend include: { songs: true, events: true } มาให้แล้ว
                const artistRes = await getArtistById(artistId);

                // Normalize ข้อมูลที่ได้รับมา
                const mainArtist = 
                    artistRes?.artist || 
                    artistRes?.data || 
                    artistRes;

                if (mainArtist) {
                    // เก็บข้อมูลศิลปิน
                    setArtist(mainArtist);

                    // ดึงข้อมูลเพลงจาก mainArtist.songs
                    setSongs(Array.isArray(mainArtist.songs) ? mainArtist.songs : []);

                    // ดึงข้อมูลอีเวนต์จาก mainArtist.events
                    setEvents(Array.isArray(mainArtist.events) ? mainArtist.events : []);
                }

            } catch (error) {
                console.error('Error fetching artist data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
        // เพิ่ม genreArtistIds เข้าไปใน Dependency เผื่อมีการเปลี่ยนหมวดหมู่
    }, [queryArtistId, genreArtistIds]); 

    return { artist, songs, events, loading };
};

export default useArtistData;
