import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEvents } from "../api/event";

// 📌 Import Components
import HeroSection from "../components/NewEventComponent/HeroSection";
import CategoryFilters from "../components/NewEventComponent/CategoryFilters";
import EventSlider from "../components/NewEventComponent/EventSlider";
import EventCard from "../components/NewEventComponent/EventCard";
import Pagination from "../components/NewEventComponent/Pagination";
import BackButton from "../components/BackButton";

import { useSearchParams } from "react-router-dom";
import { getAllArtists } from "../api/artist";

export default function NewEventPage() {
    const [searchParams] = useSearchParams();
    const initialArtistId = searchParams.get('artistId');

    const [events, setEvents] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedArtistId, setSelectedArtistId] = useState(initialArtistId || "All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Show 15 items (5 for slider + 10 for grid/2 rows of 5)
    const gridRef = useRef(null);

    const [featuredIndex, setFeaturedIndex] = useState(0);

    const handleArtistSelect = (artistId) => {
        setSelectedArtistId(artistId);
        setActiveCategory("All"); // Reset category when picking a specific artist
        setCurrentPage(1);
        setFeaturedIndex(0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [eventRes, artistRes] = await Promise.all([
                    getAllEvents(),
                    getAllArtists()
                ]);

                // Logs removed

                const extractArray = (res, key) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (res[key] && Array.isArray(res[key])) return res[key];
                    if (res.data) return extractArray(res.data, key);
                    return [];
                };

                // Robust Events Extraction
                const eventData = extractArray(eventRes, 'events');
                eventData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                setEvents(eventData);

                // Robust Artists Extraction
                const artistData = extractArray(artistRes, 'artists');
                setAllArtists(artistData);

                // Logs removed

            } catch (error) {
                console.error("❌ Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(events.map(e => e.type || "Concert"));
        return ["All", ...Array.from(uniqueCategories)];
    }, [events]);

    useEffect(() => {
        setCurrentPage(1);
        setFeaturedIndex(0);
    }, [activeCategory, selectedArtistId]);

    const filteredEvents = useMemo(() => {
        let result = events;

        // Apply Category Filter
        if (activeCategory !== "All") {
            result = result.filter(event => (event.type || "Concert") === activeCategory);
        }

        // Apply Artist Filter
        if (selectedArtistId !== "All") {
            result = result.filter(event => {
                const eArtistId = event.artistId || event.mainArtistId || event.mainArtist?.id || event.artist?.id;
                return String(eArtistId) === String(selectedArtistId);
            });
        }

        return result;
    }, [events, activeCategory, selectedArtistId]);

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

    const sliderItems = currentEvents.slice(0, Math.min(5, currentEvents.length));
    const otherEvents = currentEvents.slice(sliderItems.length);

    useEffect(() => {
        if (sliderItems.length > 1) {
            const timer = setInterval(() => {
                setFeaturedIndex((prev) => (prev + 1) % sliderItems.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [sliderItems.length]);

    const smoothScrollTo = (targetY, duration = 1000) => {
        const startY = window.pageYOffset;
        const diff = targetY - startY;
        let startTime = null;

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);

            window.scrollTo(0, startY + diff * easeProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (gridRef.current) {
            const yOffset = -120; // Offset for better visual alignment
            const targetY = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            smoothScrollTo(targetY, 1500); // 1.5 seconds for extra smoothness
        }
    };

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center text-[#00E5FF] z-50">
            <div className="w-16 h-16 border-4 border-white/5 border-t-[#00E5FF] rounded-full animate-spin"></div>
            <p className="mt-6 font-black tracking-[0.3em] animate-pulse text-white uppercase text-xs">Loading Events...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B0C10] font-sans text-white relative selection:bg-[#00E5FF] selection:text-black overflow-x-hidden pb-24">
            <BackButton color="#00E5FF" glowColor="rgba(0, 229, 255, 0.3)" />
            <style>{`
                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
            `}</style>
            <div className="dark-grain" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Large Background Text */}
                <div className="absolute top-[15%] left-[-5%] text-[20vw] font-black text-white opacity-[0.02] select-none leading-none tracking-tighter">
                    EVENTS
                </div>
                <div className="absolute bottom-[5%] right-[-5%] text-[20vw] font-black text-white opacity-[0.02] select-none leading-none tracking-tighter">
                    ARCHIVE
                </div>


                {/* Digital Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                ></div>

                <motion.div
                    animate={{ x: [0, 60, -60, 0], y: [0, -60, 60, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[20%] w-[800px] h-[800px] bg-[#00E5FF] opacity-[0.08] blur-[180px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -70, 40, 0], y: [0, 70, -40, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-15%] right-[15%] w-[900px] h-[900px] bg-[#7000FF] opacity-[0.08] blur-[180px] rounded-full"
                />
            </div>

            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center w-full relative z-50">
                    {renderLoading()}
                </div>
            ) : (
                <main className="max-w-[110rem] mx-auto px-8 md:px-12 pt-16 relative z-10 w-full flex flex-col gap-24">
                    <HeroSection />

                    <EventSlider
                        sliderItems={sliderItems}
                        featuredIndex={featuredIndex}
                        setFeaturedIndex={setFeaturedIndex}
                    />

                    <CategoryFilters
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        allArtists={allArtists}
                        selectedArtistId={selectedArtistId}
                        setSelectedArtistId={handleArtistSelect}
                    />

                    <AnimatePresence mode="wait">
                        {currentEvents.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-40 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[4rem]"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <p className="text-gray-400 font-bold text-lg uppercase tracking-[0.3em]">No events found in this category.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${activeCategory}-${currentPage}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col gap-16"
                            >

                                {otherEvents.length > 0 && (
                                    <section ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-4 scroll-mt-24">
                                        {otherEvents.map((event, index) => (
                                            <EventCard key={event.id || index} event={event} index={index} />
                                        ))}
                                    </section>
                                )}

                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    paginate={paginate}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            )}
        </div>
    );
}
