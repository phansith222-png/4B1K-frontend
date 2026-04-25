import { useState, useEffect } from 'react';
import { getAllArtists } from '../api/artist';
import { getAllEvents } from '../api/event';
import { normalizeArtistList, normalizeEventList } from '../utils/normalizeData';
import { formatArtistsToSlides, formatTopEvents } from '../utils/navbarHelpers';

export const useNavbarData = () => {
    const [mainSlides, setMainSlides] = useState([]);
    const [topEvents, setTopEvents] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHoveringMain, setIsHoveringMain] = useState(false);
    const [chartOrder, setChartOrder] = useState([0, 1, 2, 3, 4, 5]);

    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            try {
                // ใช้ Promise.allSettled เหมือนเดิม (ดีอยู่แล้ว)
                const [artistRes, eventRes] = await Promise.allSettled([
                    getAllArtists(),
                    getAllEvents(),
                ]);

                if (isCancelled) return;

                // จัดการข้อมูล Artists
                if (artistRes.status === 'fulfilled') {
                    const rawArtists = normalizeArtistList(artistRes.value);
                    const slides = formatArtistsToSlides(rawArtists);
                    setMainSlides(slides);
                    setChartOrder(slides.map((_, i) => i));
                }

                // จัดการข้อมูล Events
                if (eventRes.status === 'fulfilled') {
                    // สมมติว่ามี normalizeEventList หรือใช้ logic คล้ายกัน
                    const rawEvents = normalizeEventList(eventRes.value);
                    setTopEvents(formatTopEvents(rawEvents));
                }

            } catch (err) {
                console.error('useNavbarData Error:', err);
            }
        };

        fetchData();
        return () => { isCancelled = true; };
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