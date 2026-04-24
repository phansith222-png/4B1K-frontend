import { useState, useEffect } from 'react';
import { getAllArtists } from '../api/artist';
import { getAllEvents } from '../api/event';
import { getArtistInfo } from '../utils/artistHelper';

/**
 * Fetches artists + events for the navbar mega-menu.
 * Returns stable slide data, event list, and animation state helpers.
 */
export const useNavbarData = () => {
    const [mainSlides, setMainSlides] = useState([]);
    const [topEvents,  setTopEvents]  = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHoveringMain, setIsHoveringMain] = useState(false);
    const [chartOrder, setChartOrder] = useState([0, 1, 2, 3, 4, 5]);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [artistRes, eventRes] = await Promise.allSettled([
                    getAllArtists(),
                    getAllEvents(),
                ]);

                if (cancelled) return;

                // Artists → slides
                if (artistRes.status === 'fulfilled') {
                    const r = artistRes.value;
                    const list = r?.artists || r?.data || r || [];

                    const shuffled = [...list].sort(() => 0.5 - Math.random()).slice(0, 6);
                    const slides = shuffled.map(a => {
                        const info = getArtistInfo(a);
                        return {
                            img:        a.profileImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
                            title:      `${a.artistName}\nTop in ${info.label}`,
                            desc:       `View the latest from our ${info.label} collection.`,
                            path:       info.path,
                            color:      info.color,
                            artistId:   a.id,
                            artistName: a.artistName,
                        };
                    });
                    setMainSlides(slides);
                    setChartOrder(slides.map((_, i) => i));
                }

                // Events
                if (eventRes.status === 'fulfilled') {
                    const r = eventRes.value;
                    let list = [];
                    if (Array.isArray(r))        list = r;
                    else if (r?.data?.events)    list = r.data.events;
                    else if (r?.events)          list = r.events;
                    else if (r?.data)            list = r.data;

                    list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                    let valid = list.slice(0, 6);
                    // Pad to 6 for chart animation
                    while (valid.length > 0 && valid.length < 6) {
                        valid = [...valid, ...valid].slice(0, 6);
                    }
                    setTopEvents(valid);
                }
            } catch (err) {
                console.error('useNavbarData:', err);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    return {
        mainSlides,
        topEvents,
        currentSlide,
        setCurrentSlide,
        isHoveringMain,
        setIsHoveringMain,
        chartOrder,
        setChartOrder,
    };
};
