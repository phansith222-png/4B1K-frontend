import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../api/event"; 

export default function NewEventPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    // 📌 เพิ่ม State สำหรับจัดการ Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // แสดง 10 งานต่อหน้า (1 ใหญ่ + 9 เล็ก)

    // ดึงข้อมูล Events จาก Backend
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

                // 📌 เรียงข้อมูลจากใหม่ไปเก่า (Descending) ตามเวลา startTime
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

    // ดึงหมวดหมู่แบบ Dynamic
    const categories = useMemo(() => {
        const uniqueCategories = new Set(events.map(e => e.type || "Concert"));
        return ["All", ...Array.from(uniqueCategories)];
    }, [events]);

    // 📌 ทุกครั้งที่เปลี่ยนหมวดหมู่ ให้เด้งกลับไปหน้า 1
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    // 1. กรองข้อมูลตาม Category
    const filteredEvents = activeCategory === "All" 
        ? events 
        : events.filter(event => (event.type || "Concert") === activeCategory);

    // 📌 2. คำนวณข้อมูลสำหรับการแบ่งหน้า (Pagination)
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

    // 3. แบ่ง Featured (ตัวแรกในหน้านั้นๆ) และ Other (ตัวที่เหลือในหน้านั้นๆ)
    const featuredEvent = currentEvents.length > 0 ? currentEvents[0] : null;
    const otherEvents = currentEvents.length > 1 ? currentEvents.slice(1) : [];

    // ฟังก์ชันเปลี่ยนหน้า
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
            
            {/* Background Textures & Smooth Glows */}
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
                
                {/* Header Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center md:text-left"
                >
                    <span className="text-[#00E5FF] font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-4 block">Live Experiences</span>
                    <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter mb-6 text-white uppercase leading-[0.9]">
                        Tours & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF007F]">Events</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-sm md:text-lg font-medium leading-relaxed tracking-wide mx-auto md:mx-0 border-l-[3px] border-[#7000FF] pl-5">
                        Discover upcoming concerts, exclusive fan meetings, and immersive festivals. Secure your tickets and be part of the journey.
                    </p>
                </motion.section>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-16 border-b border-white/5 pb-8">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                activeCategory === cat
                                    ? "bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white shadow-[0_5px_20px_rgba(0,229,255,0.3)] border-transparent scale-105"
                                    : "bg-[#1A1C23]/60 backdrop-blur-md text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/20"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

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
                            {/* ================= Featured Event (งานหลัก 1 งาน) ================= */}
                            {featuredEvent && (
                                <section 
                                    onClick={() => navigate(`/events/${featuredEvent.id}`)}
                                    className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16 items-center bg-[#11131A]/80 backdrop-blur-2xl border border-white/5 rounded-[3rem] cursor-pointer group hover:border-[#00E5FF]/40 transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
                                >
                                    {/* ฝั่งรูปภาพ */}
                                    <div className="lg:col-span-7 relative overflow-hidden aspect-[4/3] md:aspect-[16/10] h-full">
                                        <img
                                            src={featuredEvent.posterImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"}
                                            alt={featuredEvent.eventName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-[#11131A] opacity-90" />
                                        
                                        <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-[#FF007F] text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,127,0.6)] backdrop-blur-md">
                                            Highlight Event
                                        </div>
                                    </div>

                                    {/* ฝั่งรายละเอียด */}
                                    <div className="lg:col-span-5 flex flex-col justify-center p-8 md:p-12 relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="text-[#00E5FF] border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                                                {featuredEvent.type || "Concert"}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] mb-2">
                                            {featuredEvent.mainArtistName || "Featured Artist"}
                                        </p>
                                        
                                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-6 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00E5FF] group-hover:to-[#7000FF] transition-all duration-300 line-clamp-3">
                                            {featuredEvent.eventName}
                                        </h2>
                                        
                                        <div className="flex flex-col gap-4 mb-8">
                                            <div className="flex items-center gap-4 text-xs font-bold text-white uppercase tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5">
                                                <div className="w-8 h-8 rounded-full bg-[#00E5FF]/20 flex items-center justify-center border border-[#00E5FF]/30 text-[#00E5FF]">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                                {new Date(featuredEvent.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-300 uppercase tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5">
                                                <div className="w-8 h-8 rounded-full bg-[#7000FF]/20 flex items-center justify-center border border-[#7000FF]/30 text-[#7000FF]">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                </div>
                                                <span className="line-clamp-1">{featuredEvent.venue?.name || "Venue TBA"}</span>
                                            </div>
                                        </div>

                                        <button className="w-full md:w-fit bg-white text-black px-8 py-3 rounded-full font-black tracking-widest uppercase text-xs hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                                            View Details
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* ================= Other Events (งานรองสูงสุด 9 งาน) ================= */}
                            {otherEvents.length > 0 && (
                                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                    {otherEvents.map((event, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => navigate(`/events/${event.id}`)}
                                            className="group cursor-pointer flex flex-col bg-[#12141A]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-5 hover:bg-[#1A1C23] hover:border-[#7000FF]/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(112,0,255,0.15)] hover:-translate-y-2"
                                        >
                                            <div className="rounded-[1.5rem] overflow-hidden mb-6 aspect-[4/3] shadow-inner relative bg-black">
                                                <img
                                                    src={event.posterImage || "https://images.unsplash.com/photo-1514525253344-f81f50592667?q=80&w=500&auto=format&fit=crop"}
                                                    alt={event.eventName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-transparent opacity-90" />
                                                
                                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#00E5FF]">
                                                    {event.type || "Concert"}
                                                </div>
                                            </div>
                                            
                                            <div className="px-2 pb-2 flex flex-col flex-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 truncate">
                                                    {event.mainArtistName || "Artist"}
                                                </p>
                                                <h3 className="text-xl lg:text-2xl font-black leading-snug tracking-tight mb-4 group-hover:text-[#00E5FF] transition-colors text-white line-clamp-2">
                                                    {event.eventName}
                                                </h3>
                                                
                                                <div className="mt-auto pt-5 border-t border-white/5 flex flex-col gap-3">
                                                    <span className="text-[11px] lg:text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[#FF007F]">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        </div>
                                                        {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[9px] lg:text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-3 line-clamp-1">
                                                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 shrink-0">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                        </div>
                                                        {event.venue?.name || "TBA"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* ================= Pagination Controls (ส่วนเปลี่ยนหน้า) ================= */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12 pb-12">
                                    <button 
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === 1 ? 'border-white/5 text-gray-600 cursor-not-allowed bg-transparent' : 'border-white/20 text-white hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-white/5 bg-[#1A1C23]/60 backdrop-blur-md'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    
                                    <div className="flex gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => paginate(i + 1)}
                                                className={`w-10 h-10 rounded-full text-xs font-black transition-all duration-300 ${currentPage === i + 1 ? 'bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-[#1A1C23]/60 border border-white/5 text-gray-400 hover:text-white hover:border-white/20'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${currentPage === totalPages ? 'border-white/5 text-gray-600 cursor-not-allowed bg-transparent' : 'border-white/20 text-white hover:border-[#00E5FF] hover:text-[#00E5FF] hover:bg-white/5 bg-[#1A1C23]/60 backdrop-blur-md'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}