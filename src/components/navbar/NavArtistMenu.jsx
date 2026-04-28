import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * The large "Artist Biology" mega-menu dropdown.
 * Receives all data + state as props — no data-fetching here.
 */
export default function NavArtistMenu({
    isOpen,
    menuRef,
    mainSlides,
    currentSlide,
    setCurrentSlide,
    isHoveringMain,
    setIsHoveringMain,
    topEvents,
    chartOrder,
    onNavigate,
}) {
    const location = useLocation();
    const currentPath = location.pathname;

    if (!isOpen || mainSlides.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="artist-menu"
                    initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -20, scaleY: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-full left-0 right-0 w-full z-40 bg-[#0B0C10]/95 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-b-[2.5rem] border-t border-white/5 pb-12 pt-10 overflow-hidden"
                    ref={menuRef}
                >
                    <section className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

                            {/* ── Genre nav ───────────────────────────────── */}
                            <div className="col-span-1 md:col-span-2 flex flex-col gap-2 text-sm pr-4">
                                <span className="text-white font-extrabold text-base mb-3 border-b-2 border-[#00E5FF] pb-2 inline-block w-max">Artist Hub</span>

                                {/* All Artists — top slot */}
                                <button
                                    onClick={() => onNavigate('/artists')}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all group text-[#00E5FF]"
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        All Artists
                                    </div>
                                </button>

                                {/* Genre links */}
                                {[
                                    { path: '/pop', color: '#FF007F', label: 'Pop' },
                                    { path: '/rock', color: '#D3131F', label: 'Rock' },
                                    { path: '/rnb', color: '#d83bb6', label: 'R&B' },
                                    { path: '/edm', color: '#00E5FF', label: 'EDM' },
                                    { path: '/etc', color: '#CEFF67', label: 'Hiphop' },
                                ].map(({ path, color, label }) => {
                                    const isActive = currentPath === path;
                                    return (
                                        <button
                                            key={path}
                                            onClick={() => onNavigate(path)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all"
                                            style={{
                                                color: isActive ? color : '',
                                                backgroundColor: isActive ? `${color}1a` : '',
                                                transform: isActive ? 'translateX(4px)' : ''
                                            }}
                                            onMouseEnter={e => {
                                                if (!isActive) {
                                                    e.currentTarget.style.color = color;
                                                    e.currentTarget.style.backgroundColor = `${color}1a`;
                                                    e.currentTarget.style.transform = 'translateX(4px)';
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (!isActive) {
                                                    e.currentTarget.style.color = '';
                                                    e.currentTarget.style.backgroundColor = '';
                                                    e.currentTarget.style.transform = '';
                                                }
                                            }}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>


                            {/* ── Featured artist slideshow ─────────────── */}
                            <div
                                className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-center"
                                onMouseEnter={() => setIsHoveringMain(true)}
                                onMouseLeave={() => setIsHoveringMain(false)}
                            >
                                <div
                                    className="relative w-full h-[300px] md:h-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/5 bg-black"
                                    style={{ boxShadow: `0 20px 50px -10px ${mainSlides[currentSlide].color}40` }}
                                    onClick={() => onNavigate(`${mainSlides[currentSlide].path}?artistId=${mainSlides[currentSlide].artistId}`)}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSlide}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="absolute inset-0"
                                        >
                                            <img
                                                src={mainSlides[currentSlide].img}
                                                alt="Featured Artist"
                                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[3s] ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent" />
                                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pb-16">
                                                <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-3 whitespace-pre-line uppercase drop-shadow-lg">
                                                    {mainSlides[currentSlide].title}
                                                </h2>
                                                <p className="text-gray-300 text-sm md:text-base font-medium tracking-wider">
                                                    {mainSlides[currentSlide].desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    <button
                                        className="absolute bottom-8 right-8 z-20 text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-xl hover:scale-105 transition-all duration-300 hover:bg-white"
                                        style={{ backgroundColor: mainSlides[currentSlide].color }}
                                    >
                                        <div className="bg-black/10 p-1.5 rounded-full">
                                            <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4l12 6-12 6z" />
                                            </svg>
                                        </div>
                                        <span className="font-extrabold text-sm">Preview</span>
                                    </button>
                                </div>

                                {/* Dots */}
                                <div className="flex gap-2.5 mt-6">
                                    {mainSlides.map((slide, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300"
                                            style={{
                                                backgroundColor: currentSlide === idx ? slide.color : 'rgba(255,255,255,0.2)',
                                                boxShadow: currentSlide === idx ? `0 0 12px ${slide.color}` : 'none',
                                                transform: currentSlide === idx ? 'scale(1.3)' : 'scale(1)',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* ── Upcoming concerts ─────────────────────── */}
                            <div className="col-span-1 md:col-span-4 lg:col-span-3 pl-0 md:pl-4 overflow-hidden relative min-h-[320px]">
                                <h3 className="text-white font-extrabold mb-5 text-[15px] border-b-2 border-white/5 pb-2 uppercase tracking-widest">
                                    Upcoming Concerts
                                </h3>
                                <div className="flex flex-col gap-3 relative">
                                    {topEvents.length > 0 ? chartOrder.slice(0, 3).map((chartIndex, position) => {
                                        const event = topEvents[chartIndex];
                                        if (!event) return null;
                                        return (
                                            <div
                                                key={chartIndex}
                                                onClick={() => onNavigate('/new-event')}
                                                className="absolute w-full flex gap-4 items-center cursor-pointer group bg-[#1A1C23]/80 backdrop-blur-md hover:bg-[#252830] p-2.5 rounded-2xl border border-white/5 hover:border-[#00E5FF]/40 shadow-lg chart-item-move"
                                                style={{
                                                    top: `${position * 95}px`,
                                                    zIndex: 10 - position,
                                                    boxShadow: '0 4px 20px rgba(0,229,255,0.05)',
                                                    transition: 'top 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                                                }}
                                            >
                                                <div className="w-[85px] h-[65px] rounded-xl overflow-hidden shrink-0 relative bg-black border border-white/5">
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                                                    <img
                                                        src={event.posterImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop'}
                                                        alt="Concert"
                                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500 group-hover:opacity-100"
                                                    />
                                                </div>
                                                <div className="flex-1 pr-2">
                                                    <h4 className="text-[11px] font-black tracking-widest mb-1 uppercase text-[#00E5FF] group-hover:text-white transition-colors line-clamp-1">
                                                        {event.eventName}
                                                    </h4>
                                                    <p className="text-[10px] text-gray-400 font-medium line-clamp-1 group-hover:text-gray-300 transition-colors">
                                                        {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        {event.venue?.name ? ` · ${event.venue.name}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <p className="text-gray-500 text-sm mt-4 italic">No upcoming concerts.</p>
                                    )}
                                </div>

                                <div className="mt-[290px] border-t border-white/5 pt-4">
                                    <button
                                        onClick={() => onNavigate('/entertainment')}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all group overflow-hidden relative ${currentPath === '/entertainment' ? 'text-[#7000FF]' : 'text-white hover:text-[#7000FF]'}`}
                                    >
                                        <div className="absolute inset-0 bg-[#7000FF]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#7000FF] shadow-[0_0_8px_#7000FF]" />
                                            Entertainment Hub
                                        </div>
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </section>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
