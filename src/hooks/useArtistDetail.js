import { useState, useEffect } from 'react';
import { getArtistById } from '../api/artist';
import { normalizeArtist } from '../utils/normalizeData';

export const useArtistDetail = (artistId) => {
    const [data, setData] = useState({ artist: null, songs: [], events: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!artistId) return;

        setLoading(true);
        getArtistById(artistId)
            .then(res => setData(normalizeArtist(res)))
            .finally(() => setLoading(false));
    }, [artistId]);

    return { ...data, loading };
};