import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../Reveal';
import { getCategoryStyle } from '../../utils/eventStyles';

export default function EventSlider({ sliderItems, featuredIndex, setFeaturedIndex }) {
    if (sliderItems.length === 0) return null;

    const featuredEvent = sliderItems[featuredIndex] || sliderItems[0];
    // console.log(featuredEvent)

    return (
        <Reveal delay={0.3} effect="fade-up">
            <section
                onClick={() => window.open('https://www.thaiticketmajor.com/', '_blank')}
                className="mb-24 bg-[#11131A] border border-white/5 rounded-[3rem] cursor-pointer group hover:border-[#00E5FF]/40 transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden relative"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={featuredEvent.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center h-full"
                    >
                        {/* ฝั่งรูปภาพ */}
                        <div className="lg:col-span-7 relative overflow-hidden aspect-[4/3] md:aspect-[16/10] h-full">
                            <img
                                src={featuredEvent.posterImage || [
                                    "https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2000&auto=format&fit=crop"
                                ][featuredIndex % 3]}
                                alt={featuredEvent.eventName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out opacity-90 group-hover:opacity-100"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#11131A] via-[#11131A]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#11131A]/60 lg:to-[#11131A] z-10" />
                            <div className="absolute inset-0 shadow-[inset_0_-80px_80px_#11131A] lg:shadow-[inset_-120px_0_120px_#11131A] z-10 pointer-events-none"></div>

                            <div className={`absolute top-6 left-6 md:top-8 md:left-8 px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-medium uppercase tracking-[0.2em] backdrop-blur-md border border-white/5 z-20 opacity-50 group-hover:opacity-90 transition-opacity ${getCategoryStyle(featuredEvent.type)}`}>
                                Highlight Event
                            </div>
                        </div>

                        {/* ฝั่งรายละเอียด */}
                        <div className="lg:col-span-5 flex flex-col justify-center p-8 md:p-12 relative z-20 bg-[#11131A]">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${getCategoryStyle(featuredEvent.type)}`}>
                                    {featuredEvent.type || "Concert"}
                                </span>
                            </div>

                            <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] mb-2">
                                {featuredEvent.mainArtistName || "Featured Artist"}
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-6 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#00E5FF] group-hover:to-[#7000FF] transition-all duration-300 line-clamp-3">
                                {featuredEvent.eventName}
                            </h2>

                            <div className="flex flex-wrap items-center gap-6 mb-8 bg-[#1A1C23]/60 backdrop-blur-md border border-white/5 p-5 rounded-3xl w-full">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                        <svg className="w-5 h-5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Date</p>
                                        <p className="text-sm font-black text-white uppercase tracking-wider">{new Date(featuredEvent.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                        <svg className="w-5 h-5 text-[#FF007F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Location</p>
                                        <p className="text-sm font-black text-white uppercase tracking-wider line-clamp-1">{featuredEvent.venue?.name || "TBA"}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); window.open('https://www.thaiticketmajor.com/', '_blank'); }}
                                className="relative overflow-hidden w-full md:w-fit group bg-gradient-to-r from-white to-gray-200 text-black px-10 py-4 rounded-full font-black tracking-widest uppercase text-[11px] transition-all duration-500 hover:scale-105 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.5)] border border-white/50"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    JOIN EVENT
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Dots */}
                {sliderItems.length > 1 && (
                    <div className="absolute bottom-6 right-6 lg:left-1/2 lg:-translate-x-1/2 flex gap-2 z-30">
                        {sliderItems.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === featuredIndex ? 'bg-white w-6 shadow-[0_0_10px_white]' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                )}
            </section>
        </Reveal>
    );
}
