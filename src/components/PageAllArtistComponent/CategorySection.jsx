import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBackground from './CategoryBackground';
import { getImageUrl } from '../../utils/imageUtils';

export default function CategorySection({ section, navigate }) {
    const scrollRef = useRef(null);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftBtn(scrollLeft > 20);
            setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 20);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll();
            // Check again after a short delay to ensure layout is ready
            setTimeout(checkScroll, 500);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full py-24 group/section overflow-hidden">
            <CategoryBackground keyword={section.keyword} artist={section.artists[0]} />

            <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 pr-6 md:pr-12 gap-6">
                    <div className="border-l-[6px] pl-6" style={{ borderColor: section.primary }}>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-lg" style={{ color: section.primary }}>
                            {section.title}
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs md:text-sm max-w-xl">{section.desc}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-gray-500 font-bold tracking-widest text-xs uppercase opacity-40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Scroll to explore
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                </div>

                {/* Slider Container with Netflix Full-Height Buttons */}
                <div className="relative group/slider">
                    {/* Left Button Strip */}
                    <AnimatePresence>
                        {showLeftBtn && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => scroll('left')}
                                className="absolute left-[-1.5rem] md:left-[-3rem] top-0 bottom-16 w-12 md:w-20 z-50 bg-black/5 hover:bg-black/60 transition-all duration-500 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 group/btn rounded-r-xl border-r border-white/5 backdrop-blur-[2px]"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.4 }}
                                    className="text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                >
                                    <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                                </motion.div>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Right Button Strip */}
                    <AnimatePresence>
                        {showRightBtn && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => scroll('right')}
                                className="absolute right-[-1.5rem] md:right-[-3rem] top-0 bottom-16 w-12 md:w-20 z-50 bg-black/5 hover:bg-black/60 transition-all duration-500 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 group/btn rounded-l-xl border-l border-white/5 backdrop-blur-[2px]"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.4 }}
                                    className="text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                >
                                    <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                </motion.div>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div
                        ref={scrollRef}
                        className="w-full overflow-x-auto scroll-smooth hide-scrollbar pb-16 flex gap-6 md:gap-10 pr-12"
                    >
                        {section.artists.map((artist, aIdx) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.05 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: Math.min(aIdx * 0.03, 0.15) }}
                                whileHover={{ y: -15 }}
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    const targetPath =
                                        section.keyword === 'pop' ? '/pop' :
                                            section.keyword === 'rock' ? '/rock' :
                                                section.keyword === 'r&b' ? '/classic' : '/etc';
                                    navigate(`${targetPath}?artistId=${artist.id}`);
                                }}
                                className="flex flex-col gap-5 group w-[280px] md:w-[380px] flex-shrink-0 cursor-pointer"
                            >
                                {/* รูปการ์ดหลัก */}
                                <div
                                    className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500 shadow-2xl"
                                    style={{ boxShadow: `0 20px 40px -10px ${section.primary}30` }}
                                >
                                    <img
                                        src={getImageUrl(artist.profileImage, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800")}
                                        alt={artist.artistName}
                                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800"; }}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent opacity-90" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                        <span
                                            className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-3 py-1.5 rounded w-fit shadow-lg backdrop-blur-md"
                                            style={{ backgroundColor: `${section.primary}CC`, color: ['r&b', 'hip hop', 'pop'].includes(section.keyword) ? '#000' : '#FFF' }}
                                        >
                                            {artist.agency?.name || "Independent"}
                                        </span>
                                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
                                            {artist.artistName}
                                        </h3>
                                    </div>

                                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>

                                {/* แถบข้อมูลด้านล่าง */}
                                <div className="mx-4 mb-4 px-5 py-3.5 rounded-2xl bg-[#0B0C10]/60 backdrop-blur-md border border-white/5 flex justify-between items-center group-hover:bg-[#12141A]/80 group-hover:border-white/20 transition-all duration-500 overflow-hidden relative shadow-lg group-hover:shadow-2xl">
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                                        style={{ background: `linear-gradient(90deg, ${section.primary}, transparent)` }}
                                    />

                                    <div className="flex flex-col relative z-10 flex-1 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">
                                                Latest Release
                                            </span>
                                            <div className="hidden group-hover:flex items-end gap-[2px] h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-[2px] rounded-full" style={{ backgroundColor: section.primary }} />
                                                <motion.div animate={{ height: [5, 11, 5] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.15 }} className="w-[2px] rounded-full" style={{ backgroundColor: section.primary }} />
                                                <motion.div animate={{ height: [4, 7, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.3 }} className="w-[2px] rounded-full" style={{ backgroundColor: section.primary }} />
                                            </div>
                                        </div>

                                        <span className="text-sm md:text-base font-black text-gray-200 uppercase line-clamp-1 transition-all duration-500 group-hover:text-white group-hover:translate-x-1">
                                            {artist.songs?.[0]?.title || "Upcoming Track"}
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex-shrink-0">
                                        <div
                                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-ping"
                                            style={{ backgroundColor: section.primary }}
                                        />
                                        <div
                                            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 relative z-10"
                                            style={{
                                                backgroundColor: section.primary,
                                                boxShadow: `0 4px 15px ${section.primary}60`
                                            }}
                                        >
                                            <svg className="w-4 h-4 text-black ml-0.5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4.018 14L14.22 9 4.018 4v10z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
