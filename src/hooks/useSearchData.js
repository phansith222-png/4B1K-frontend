import { useState, useEffect, useRef, useCallback } from "react";
import { getAllArtists, getArtistById } from "../api/artist";
import { getAllEvents } from "../api/event";
import { normalizeArtistList, normalizeArtist, normalizeEventList } from "../utils/normalizeData";
import { getArtistInfo } from "../utils/artistHelper";
/**
 * [useSearchData Hook]
 * Acts as the core of the Global Search system in the Navbar.
 * 
 * The process is divided into 3 phases:
 * 1. [FETCHING]: Fetch all Artists and Events and store them in memory (Client-side indexing).
 * 2. [INDEXING]: Since the bulk API doesn't return songs, we fetch individual artist details
 *    to map and flatten songs so they can be searched instantly.
 * 3. [FILTERING]: As the user types (Query), the system filters data using "Starts With"
 *    to provide accurate results based on user input.
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
     * Search and prepare basic data:
     * 1. Fetch all Artists and Events from API.
     * 2. Fetch individual Artist details to extract songs.
     * 3. Store data in State for fast Offline/Live search.
     */

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const loadAndIndexData = async () => {
            try {
                // Step 1: Fetch all lists
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

                // Step 2: Fetch individual artist details for songs
                const detailResults = await Promise.allSettled(
                    basicArtists.map(a => getArtistById(a.id))
                );

                const flatSongs = [];
                detailResults.forEach((res, idx) => {
                    if (res.status !== "fulfilled") return;

                    const { songs } = normalizeArtist(res.value);
                    const basicArtist = basicArtists[idx];
                    
                    // 🌟 Get correct page path from Helper
                    const artistInfo = getArtistInfo(basicArtist);

                    songs.forEach(s => flatSongs.push({
                        id: s.id,
                        title: s.title || s.name || "",
                        coverImage: s.coverImage || s.cover || null,
                        artistId: basicArtist.id,
                        artistName: basicArtist.artistName,
                        artistPage: artistInfo.path, // Use path immediately
                    }));
                });

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

        // 1. Search Artists
        allArtists
            .filter(a => a.artistName?.toLowerCase().startsWith(q))
            .slice(0, 5)
            .forEach(a => {
                // 🌟 Fetch data from Helper to align colors, paths, and labels
                const artistInfo = getArtistInfo(a);
                
                results.push({
                    type: "artist",
                    id: `artist-${a.id}`,
                    label: a.artistName,
                    // Fallback label from Helper if no Genre in Database
                    sublabel: a.genres?.map(g => g.genre?.name).filter(Boolean).join(" · ") || artistInfo.label,
                    image: a.profileImage || null,
                    navigateTo: `${artistInfo.path}?artistId=${a.id}`,
                });
            });

        // 2. Search Songs
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

        // 3. Search Events
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

        // 4. Search Venues
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

    // Function to clear search query
    const clearSearch = useCallback(() => {
        setQuery("");
        setSuggestions([]);
    }, []);

    const executeSearch = useCallback(() => {
        const q = query.trim().toLowerCase();
        if (!q) return;

        const genreMap = {
            pop: "/pop", rock: "/rock",
            "r&b": "/rnb", classic: "/rnb", rnb: "/rnb",
            "hip hop": "/etc", hiphop: "/etc", edm: "/edm", rap: "/etc",
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
