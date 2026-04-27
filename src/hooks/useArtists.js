import { useState, useEffect } from 'react';
import { getAllArtists } from '../api/artist';
import { normalizeArtistList } from '../utils/normalizeData';

export const useArtists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllArtists()
            .then(res => setArtists(normalizeArtistList(res)))
            .finally(() => setLoading(false));
    }, []);

    return { artists, loading };
};