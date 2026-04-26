import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
    getArtistById, getSongsByArtist, getEventsByArtist, getAllArtists
} from '../api/artist';
import { getImageUrl } from '../utils/imageUtils';

/**
 * Hook to fetch artist, songs, and events data from the backend.
 * REVERTED: Removed all custom image fallback logic.
 */
const useArtistData = (genreArtistIds, queryArtistId) => {
    const normalizedId = queryArtistId ? String(queryArtistId) : null;
    
    const [state, setState] = useState({
        artist: null,
        songs: [],
        events: [],
        loading: true,
        error: false
    });

    // Use ref to prevent multiple simultaneous fetches
    const fetchIdRef = useRef(0);

    const fetchData = useCallback(async (isMounted) => {
        const currentFetchId = ++fetchIdRef.current;
        if (isMounted) setState(prev => ({ ...prev, loading: true }));
        
        try {
            const extract = (res, key) => {
                if (!res) return null;
                if (Array.isArray(res)) return res;
                if (res[key] && Array.isArray(res[key])) return res[key];
                if (res[key]) return res[key];
                const nested = res.data || res.result;
                if (nested) {
                    if (Array.isArray(nested)) return nested;
                    if (nested[key]) return nested[key];
                    return nested;
                }
                return res;
            };

            let mainArtist = null;
            let rawSongs = [];
            let rawEvents = [];

            if (normalizedId) {
                const [artRes, sRes, eRes] = await Promise.all([
                    getArtistById(Number(normalizedId)).catch(() => null),
                    getSongsByArtist(Number(normalizedId)).catch(() => null),
                    getEventsByArtist(Number(normalizedId)).catch(() => null),
                ]);

                if (currentFetchId !== fetchIdRef.current) return;

                mainArtist = extract(artRes, 'artist');
                rawSongs = extract(sRes, 'songs') || mainArtist?.songs || [];
                rawEvents = extract(eRes, 'events') || mainArtist?.events || [];
            } else {
                const allArtRes = await getAllArtists().catch(() => null);
                if (currentFetchId !== fetchIdRef.current) return;

                const allList = extract(allArtRes, 'artists') || [];
                const genreIds = (genreArtistIds || []).map(id => Number(id));
                let filtered = allList.filter(a => genreIds.includes(Number(a.id || a._id)));
                
                if (filtered.length === 0 && allList.length > 0) filtered = allList;

                if (filtered.length === 0) {
                    if (isMounted) setState({ artist: null, songs: [], events: [], loading: false, error: false });
                    return;
                }

                const picked = filtered[Math.floor(Math.random() * filtered.length)];
                const [artRes, sRes, eRes] = await Promise.all([
                    getArtistById(Number(picked.id || picked._id)).catch(() => picked),
                    getSongsByArtist(Number(picked.id || picked._id)).catch(() => null),
                    getEventsByArtist(Number(picked.id || picked._id)).catch(() => null),
                ]);

                if (currentFetchId !== fetchIdRef.current) return;

                mainArtist = extract(artRes, 'artist') || picked;
                rawSongs = extract(sRes, 'songs') || mainArtist?.songs || [];
                rawEvents = extract(eRes, 'events') || mainArtist?.events || [];
            }

            if (isMounted && currentFetchId === fetchIdRef.current) {
                setState({
                    artist: mainArtist,
                    songs: rawSongs,
                    events: rawEvents,
                    loading: false,
                    error: false
                });
            }
        } catch (error) {
            console.error('[useArtistData] Error:', error);
            if (isMounted && currentFetchId === fetchIdRef.current) {
                setState(prev => ({ ...prev, loading: false, error: true }));
            }
        }
    }, [normalizedId, JSON.stringify(genreArtistIds)]);

    useEffect(() => {
        let isMounted = true;
        // Keep old data but set loading to true for background fetch
        setState(prev => ({ ...prev, loading: true }));
        fetchData(isMounted);
        return () => { isMounted = false; };
    }, [normalizedId, JSON.stringify(genreArtistIds), fetchData]);

    return state;
};

export default useArtistData;
