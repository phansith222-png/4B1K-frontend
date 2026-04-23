import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEvents } from "../api/event";

// 📌 Import Components
import HeroSection from "../components/NewEventComponent/HeroSection";
import CategoryFilters from "../components/NewEventComponent/CategoryFilters";
import EventSlider from "../components/NewEventComponent/EventSlider";
import EventCard from "../components/NewEventComponent/EventCard";
import Pagination from "../components/NewEventComponent/Pagination";

export default function NewEventPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [featuredIndex, setFeaturedIndex] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await getAllEvents();

                let eventData = [];
                if (Array.isArray(res)) {
                    eventData = res;
                } else if (res?.data?.events && Array.isArray(res.data.events)) {
                    eventData = res.data.events;
                } else if (res?.data?.data && Array.isArray(res.data.data)) {
                    eventData = res.data.data;
                } else if (res?.events && Array.isArray(res.events)) {
                    eventData = res.events;
                } else if (res?.data && Array.isArray(res.data)) {
                    eventData = res.data;
                }

                eventData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                setEvents(eventData);
            } catch (error) {
                console.error("❌ Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = new Set(events.map(e => e.type || "Concert"));
        return ["All", ...Array.from(uniqueCategories)];
    }, [events]);

    useEffect(() => {
        setCurrentPage(1);
        setFeaturedIndex(0);
    }, [activeCategory]);

    const filteredEvents = activeCategory === "All"
        ? events
        : events.filter(event => (event.type || "Concert") === activeCategory);

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

    const sliderItems = currentEvents.slice(0, Math.min(3, currentEvents.length));
    const otherEvents = currentEvents.slice(sliderItems.length);

    useEffect(() => {
        if (sliderItems.length > 1) {
            const timer = setInterval(() => {
                setFeaturedIndex((prev) => (prev + 1) % sliderItems.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [sliderItems.length]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#00E5FF] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#7000FF] opacity-20 blur-[100px] rounded-full animate-pulse"></div>
                <div className="w-16 h-16 border-4 border-white/5 border-t-[#00E5FF] rounded-full animate-spin z-10"></div>
                <p className="mt-6 font-black tracking-[0.3em] animate-pulse text-white z-10 uppercase text-xs">Loading Events...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0C10] font-sans text-white relative selection:bg-[#00E5FF] selection:text-black overflow-x-hidden pb-24">
            <style>{`
                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
            `}</style>
            <div className="dark-grain" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[0%] left-[10%] w-[600px] h-[600px] bg-[#00E5FF] opacity-[0.06] blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-[#7000FF] opacity-[0.06] blur-[150px] rounded-full"
                />
            </div>

            <main className="max-w-7xl mx-auto px-6 md:px-10 pt-24 relative z-10">
                <HeroSection />

                <CategoryFilters 
                    categories={categories} 
                    activeCategory={activeCategory} 
                    setActiveCategory={setActiveCategory} 
                />

                <AnimatePresence mode="wait">
                    {currentEvents.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-32 bg-[#1A1C23]/30 backdrop-blur-2xl border border-white/5 rounded-[3rem] shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <p className="text-gray-400 font-bold text-base md:text-lg uppercase tracking-[0.2em]">No events found in this category.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`${activeCategory}-${currentPage}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <EventSlider 
                                sliderItems={sliderItems} 
                                featuredIndex={featuredIndex} 
                                setFeaturedIndex={setFeaturedIndex} 
                            />

                            {otherEvents.length > 0 && (
                                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
        </div>
    );
}