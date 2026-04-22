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

                // Fetch all artists and filter by genre
                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error('Failed to fetch all artists:', err);
                    allArtistsRes = [];
                }

                const allArtistsList =
                    allArtistsRes?.artists ||
                    allArtistsRes?.data ||
                    allArtistsRes ||
                    [];

                let filteredArtists = allArtistsList.filter((a) =>
                    genreArtistIds.includes(a.id)
                );

                // Fallback: use all artists if genre filter returns nothing
                if (filteredArtists.length === 0 && allArtistsList.length > 0) {
                    filteredArtists = allArtistsList;
                }

                // Determine which artist ID to load
                let artistId;
                if (queryArtistId) {
                    // Specific artist requested via URL param
                    artistId = Number(queryArtistId);
                } else if (filteredArtists.length > 0) {
                    // Pick a random artist from the genre
                    const randomIndex = Math.floor(Math.random() * filteredArtists.length);
                    artistId = filteredArtists[randomIndex].id;
                } else {
                    setArtist(null);
                    setLoading(false);
                    return;
                }

                // Fetch artist details, songs, and events in parallel
                const [artistRes, songsRes, eventsRes] = await Promise.all([
                    getArtistById(artistId).catch(() => null),
                    getSongsByArtist(artistId).catch(() => null),
                    getEventsByArtist(artistId).catch(() => null),
                ]);

                const mainArtist =
                    artistRes?.artist ||
                    artistRes?.data ||
                    artistRes ||
                    filteredArtists[0];
                setArtist(mainArtist);

                // Normalize songs response
                const extractedSongs = (() => {
                    if (Array.isArray(songsRes)) return songsRes;
                    if (Array.isArray(songsRes?.data)) return songsRes.data;
                    if (Array.isArray(songsRes?.songs)) return songsRes.songs;
                    if (Array.isArray(mainArtist?.songs)) return mainArtist.songs;
                    return [];
                })();
                setSongs(extractedSongs);

                // Normalize events response
                const extractedEvents = (() => {
                    if (Array.isArray(eventsRes)) return eventsRes;
                    if (Array.isArray(eventsRes?.data)) return eventsRes.data;
                    if (Array.isArray(eventsRes?.events)) return eventsRes.events;
                    if (Array.isArray(mainArtist?.events)) return mainArtist.events;
                    return [];
                })();
                setEvents(extractedEvents);
            } catch (error) {
                console.error('Error fetching artist data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
    }, [queryArtistId]); // re-fetch when URL query changes

    return { artist, songs, events, loading };
};

export default useArtistData;
