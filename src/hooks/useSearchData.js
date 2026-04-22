import { useState, useEffect, useRef, useCallback } from "react";
import { getAllArtists, getArtistById } from "../api/artist";
import { getAllEvents } from "../api/event";

// GET /artists        → basic list (no songs)
// GET /artists/:id    → full detail WITH songs[] and events[]
// Strategy: fetch all IDs first, then batch-fetch details to get songs

const GENRE_IDS = {
    pop:     [1, 2, 3, 4, 5],
    rock:    [6, 7, 8, 9, 10],
    classic: [16, 17, 18, 19, 20],
    etc:     [11, 12, 13, 14, 15, 21, 22, 23, 24, 25],
};

const getArtistPage = (artist) => {
    const id = Number(artist.id);
    if (GENRE_IDS.pop.includes(id))     return "/pop";
    if (GENRE_IDS.rock.includes(id))    return "/rock";
    if (GENRE_IDS.classic.includes(id)) return "/classic";
    if (GENRE_IDS.etc.includes(id))     return "/etc";
    const gs = artist.genres?.map(g => g.genre?.name?.toLowerCase() ?? "") ?? [];
    if (gs.some(g => g.includes("rock")))  return "/rock";
    if (gs.some(g => g.includes("r&b") || g.includes("rnb"))) return "/classic";
    if (gs.some(g => g.includes("hip hop") || g.includes("edm"))) return "/etc";
    return "/pop";
};

export const useSearchData = (navigate) => {
    const [allArtists,  setAllArtists]  = useState([]);
    const [allEvents,   setAllEvents]   = useState([]);
    const [allSongs,    setAllSongs]    = useState([]);
    const [query,       setQuery]       = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const load = async () => {
            // Step 1: basic list + events
            const [artistRes, eventRes] = await Promise.allSettled([
                getAllArtists(),
                getAllEvents(),
            ]);

            let basicArtists = [];
            if (artistRes.status === "fulfilled") {
                const r = artistRes.value;
                basicArtists = r?.artists || r?.data || r || [];
                setAllArtists(basicArtists);
            }

            if (eventRes.status === "fulfilled") {
                const r = eventRes.value;
                let list = [];
                if (Array.isArray(r))       list = r;
                else if (r?.data?.events)   list = r.data.events;
                else if (r?.events)         list = r.events;
                else if (r?.data)           list = r.data;
                setAllEvents(list);
            }

            if (basicArtists.length === 0) return;

            // Step 2: batch fetch full artist details (which include songs[])
            // Use Promise.allSettled so one failure won't block the rest
            const detailResults = await Promise.allSettled(
                basicArtists.map(a => getArtistById(a.id))
            );

            const flatSongs = [];
            detailResults.forEach((res, idx) => {
                if (res.status !== "fulfilled") return;
                const r = res.value;
                const artist = r?.artist || r?.data || r;
                const basicArtist = basicArtists[idx];
                const songs = Array.isArray(artist?.songs) ? artist.songs : [];
                songs.forEach(s => flatSongs.push({
                    id:         s.id,
                    title:      s.title || s.name || "",
                    coverImage: s.coverImage || s.cover || null,
                    artistId:   basicArtist.id,
                    artistName: basicArtist.artistName,
                    artistPage: getArtistPage(basicArtist),
                }));
            });

            console.log("[useSearchData] Songs indexed:", flatSongs.length,
                flatSongs.slice(0, 3).map(s => s.title));
            setAllSongs(flatSongs);
        };

        load().catch(console.error);
    }, []);

    // Build suggestions live as query changes
    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 1) { setSuggestions([]); return; }

        const results = [];

        // 1. Artists
        allArtists
            .filter(a => a.artistName?.toLowerCase().includes(q))
            .slice(0, 5)
            .forEach(a => {
                const page = getArtistPage(a);
                results.push({
                    type:       "artist",
                    id:         `artist-${a.id}`,
                    label:      a.artistName,
                    sublabel:   a.genres?.map(g => g.genre?.name).filter(Boolean).join(" · ") || "Artist",
                    image:      a.profileImage || null,
                    navigateTo: `${page}?artistId=${a.id}`,
                    external:   null,
                });
            });

        // 2. Songs
        allSongs
            .filter(s => s.title?.toLowerCase().includes(q))
            .slice(0, 5)
            .forEach(s => results.push({
                type:       "song",
                id:         `song-${s.id}-${s.artistId}`,
                label:      s.title,
                sublabel:   s.artistName,
                image:      s.coverImage || null,
                navigateTo: `${s.artistPage}?artistId=${s.artistId}`,
                external:   null,
            }));

        // 3. Events
        allEvents
            .filter(e => e.eventName?.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach(e => results.push({
                type:       "event",
                id:         `event-${e.id}`,
                label:      e.eventName,
                sublabel:   [
                    e.venue?.name,
                    e.startTime ? new Date(e.startTime).toLocaleDateString("en-US", {month:"short",day:"numeric",year:"numeric"}) : null,
                ].filter(Boolean).join(" · "),
                image:      e.posterImage || null,
                navigateTo: "/new-event",
                external:   null,
            }));

        // 4. Venues
        const seenVenues = new Set();
        allEvents
            .filter(e => e.venue?.name?.toLowerCase().includes(q) && !seenVenues.has(e.venue?.name))
            .slice(0, 3)
            .forEach(e => {
                seenVenues.add(e.venue.name);
                results.push({
                    type:       "event",
                    id:         `venue-${e.venue?.id ?? e.id}`,
                    label:      e.venue.name,
                    sublabel:   e.venue?.address || "Concert Venue",
                    image:      e.posterImage || null,
                    navigateTo: "/new-event",
                    external:   null,
                });
            });

        // 5. Labels
        const seenLabels = new Set();
        allArtists
            .filter(a => a.label?.name?.toLowerCase().includes(q) && !seenLabels.has(a.label?.name))
            .slice(0, 3)
            .forEach(a => {
                seenLabels.add(a.label.name);
                results.push({
                    type:       "label",
                    id:         `label-${a.label?.id ?? a.label.name}`,
                    label:      a.label.name,
                    sublabel:   "Record Label",
                    image:      a.label?.logo || null,
                    navigateTo: `/artists?label=${encodeURIComponent(a.label.name)}`,
                    external:   null,
                });
            });

        setSuggestions(results.slice(0, 12));
    }, [query, allArtists, allSongs, allEvents]);

    const clearSearch = useCallback(() => {
        setQuery("");
        setSuggestions([]);
    }, []);

    const executeSearch = useCallback(() => {
        const q = query.trim().toLowerCase();
        if (!q) return;
        const genreMap = {
            pop:"/pop", rock:"/rock",
            "r&b":"/classic", classic:"/classic", rnb:"/classic",
            "hip hop":"/etc", hiphop:"/etc", edm:"/etc", rap:"/etc",
        };
        if (genreMap[q]) { navigate(genreMap[q]); clearSearch(); return; }
        if (suggestions.length > 0) {
            const first = suggestions[0];
            if (first.external)        window.open(first.external, "_blank");
            else if (first.navigateTo) navigate(first.navigateTo);
            clearSearch();
            return;
        }
        navigate(`/artists?search=${encodeURIComponent(query.trim())}`);
        clearSearch();
    }, [query, suggestions, navigate, clearSearch]);

    const selectSuggestion = useCallback((item) => {
        if (item.external)        window.open(item.external, "_blank");
        else if (item.navigateTo) navigate(item.navigateTo);
        clearSearch();
    }, [navigate, clearSearch]);

    return { query, setQuery, suggestions, executeSearch, selectSuggestion, clearSearch };
};
