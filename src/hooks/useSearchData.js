import { useState, useEffect, useRef, useCallback } from "react";
import { getAllArtists, getArtistById } from "../api/artist";
import { getAllEvents } from "../api/event";
import { normalizeArtistList, normalizeArtist, normalizeEventList } from "../utils/normalizeData";
import { getArtistInfo } from "../utils/artistHelper";
/**
 * [useSearchData Hook]
 * ทำหน้าที่เป็นหัวใจหลักของระบบค้นหา (Global Search) ใน Navbar
 * 
 * การทำงานแบ่งเป็น 3 ระยะ:
 * 1. [FETCHING]: ดึงข้อมูล Artists และ Events ทั้งหมดมาเก็บไว้ในหน่วยความจำ (Client-side indexing)
 * 2. [INDEXING]: เนื่องจาก API ข้อมูลรวมไม่ให้ลิสต์เพลงมาด้วย เราจึงต้องดึงข้อมูล Artist รายบุคคล
 *    เพื่อเอาเพลงมาจัดเรียงใหม่ (Flat Map) ให้สามารถค้นหาชื่อเพลงได้ทันที
 * 3. [FILTERING]: เมื่อผู้ใช้พิมพ์ (Query) ระบบจะทำการกรองข้อมูลแบบ "Starts With" 
 *    (ขึ้นต้นด้วยคำที่พิมพ์เท่านั้น) เพื่อความแม่นยำตามความต้องการของผู้ใช้
 */

// GET /artists        → basic list (no songs)
// GET /artists/:id    → full detail WITH songs[] and events[]
// Strategy: fetch all IDs first, then batch-fetch details to get songs

export const useSearchData = (navigate) => {
    const [allArtists, setAllArtists] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [allSongs, setAllSongs] = useState([]);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const hasFetched = useRef(false);

    /**
     * ค้นหาและเตรียมข้อมูลเบื้องต้น:
     * 1. ดึงข้อมูล Artists และ Events ทั้งหมดจาก API
     * 2. ดึงข้อมูลรายละเอียดของ Artist แต่ละคนเพื่อเอาลิสต์เพลง (Songs)
     * 3. ทำการเก็บข้อมูลไว้ใน State เพื่อให้ค้นหาได้รวดเร็วแบบ Offline/Live
     */

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const loadAndIndexData = async () => {
            try {
                // Step 1: ดึงรายชื่อทั้งหมด
                const [artistRes, eventRes] = await Promise.allSettled([
                    getAllArtists(),
                    getAllEvents(),
                ]);

                const basicArtists = artistRes.status === "fulfilled" 
                    ? normalizeArtistList(artistRes.value) 
                    : [];
                
                const events = eventRes.status === "fulfilled" 
                    ? normalizeEventList(eventRes.value) 
                    : [];

                setAllArtists(basicArtists);
                setAllEvents(events);

                if (basicArtists.length === 0) return;

                // Step 2: เจาะข้อมูลศิลปินทีละคนเพื่อดึงเพลง
                const detailResults = await Promise.allSettled(
                    basicArtists.map(a => getArtistById(a.id))
                );

                const flatSongs = [];
                detailResults.forEach((res, idx) => {
                    if (res.status !== "fulfilled") return;

                    const { songs } = normalizeArtist(res.value);
                    const basicArtist = basicArtists[idx];
                    
                    // 🌟 ดึงข้อมูล Path หน้าเว็บที่ถูกต้องจาก Helper
                    const artistInfo = getArtistInfo(basicArtist);

                    songs.forEach(s => flatSongs.push({
                        id: s.id,
                        title: s.title || s.name || "",
                        coverImage: s.coverImage || s.cover || null,
                        artistId: basicArtist.id,
                        artistName: basicArtist.artistName,
                        artistPage: artistInfo.path, // นำ Path ไปใช้ทันที
                    }));
                });

                console.log("[useSearchData] Songs indexed:", flatSongs.length);
                setAllSongs(flatSongs);

            } catch (error) {
                console.error("[useSearchData] Indexing failed:", error);
            }
        };

        loadAndIndexData();
    }, []);

    // Build suggestions live as query changes
    useEffect(() => {
        const q = query.trim().toLowerCase();
        
        if (!q) {
            setSuggestions([]);
            return;
        }

        const results = [];

        // 1. ค้นหา ศิลปิน
        allArtists
            .filter(a => a.artistName?.toLowerCase().startsWith(q))
            .slice(0, 5)
            .forEach(a => {
                // 🌟 ดึงข้อมูลจาก Helper เพื่อให้สี, Path และ Label ตรงกันทั้งแอป
                const artistInfo = getArtistInfo(a);
                
                results.push({
                    type: "artist",
                    id: `artist-${a.id}`,
                    label: a.artistName,
                    // ถ้าไม่มี Genre ใน Database ให้ใช้ fallback label จาก Helper (เช่น "Pop", "Rock")
                    sublabel: a.genres?.map(g => g.genre?.name).filter(Boolean).join(" · ") || artistInfo.label,
                    image: a.profileImage || null,
                    navigateTo: `${artistInfo.path}?artistId=${a.id}`,
                });
            });

        // 2. ค้นหา เพลง
        allSongs
            .filter(s => s.title?.toLowerCase().startsWith(q))
            .slice(0, 5)
            .forEach(s => results.push({
                type: "song",
                id: `song-${s.id}-${s.artistId}`,
                label: s.title,
                sublabel: s.artistName,
                image: s.coverImage || null,
                navigateTo: `${s.artistPage}?artistId=${s.artistId}`,
            }));

        // 3. ค้นหา Events
        allEvents
            .filter(e => e.eventName?.toLowerCase().startsWith(q))
            .slice(0, 3)
            .forEach(e => results.push({
                type: "event",
                id: `event-${e.id}`,
                label: e.eventName,
                sublabel: [
                    e.venue?.name,
                    e.startTime ? new Date(e.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null,
                ].filter(Boolean).join(" · "),
                image: e.coverImage || e.posterImage || null,
                navigateTo: "/new-event",
            }));

        // 4. ค้นหา สถานที่ (Venues)
        const seenVenues = new Set();
        allEvents
            .filter(e => e.venue?.name?.toLowerCase().startsWith(q) && !seenVenues.has(e.venue?.name))
            .slice(0, 3)
            .forEach(e => {
                seenVenues.add(e.venue.name);
                results.push({
                    type: "event",
                    id: `venue-${e.venue?.id ?? e.id}`,
                    label: e.venue.name,
                    sublabel: e.venue?.address || "Concert Venue",
                    image: e.coverImage || e.posterImage || null,
                    navigateTo: "/new-event",
                });
            });

        setSuggestions(results.slice(0, 12));
    }, [query, allArtists, allSongs, allEvents]);

    // ฟังก์ชันสำหรับล้างคำค้นหา
    const clearSearch = useCallback(() => {
        setQuery("");
        setSuggestions([]);
    }, []);

    const executeSearch = useCallback(() => {
        const q = query.trim().toLowerCase();
        if (!q) return;

        const genreMap = {
            pop: "/pop", rock: "/rock",
            "r&b": "/classic", classic: "/classic", rnb: "/classic",
            "hip hop": "/etc", hiphop: "/etc", edm: "/etc", rap: "/etc",
        };

        if (genreMap[q]) { 
            navigate(genreMap[q]); 
            clearSearch(); 
            return; 
        }

        if (suggestions.length > 0) {
            const first = suggestions[0];
            if (first.external) window.open(first.external, "_blank");
            else if (first.navigateTo) navigate(first.navigateTo);
            clearSearch();
            return;
        }

        navigate(`/artists?search=${encodeURIComponent(query.trim())}`);
        clearSearch();
    }, [query, suggestions, navigate, clearSearch]);

    const selectSuggestion = useCallback((item) => {
        if (item.external) window.open(item.external, "_blank");
        else if (item.navigateTo) navigate(item.navigateTo);
        clearSearch();
    }, [navigate, clearSearch]);

    return { query, setQuery, suggestions, executeSearch, selectSuggestion, clearSearch };
};
