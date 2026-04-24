import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();

    // Mock trending rank
    const trendingRank = useMemo(() => (artist.id % 10) + 1, [artist.id]);

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
            {/* 🔙 Back Button */}
            <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: 5, boxShadow: '0 0 20px rgba(249, 193, 219, 0.3)' }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-3 text-[#f9c1db] hover:text-white transition-colors group bg-[#f9c1db]/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#f9c1db]/20"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-xs font-black uppercase tracking-widest text-[#f9c1db]">Back</span>
            </motion.button>

            {/* Background Ambient Glow */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#d83bb6] opacity-[0.08] blur-[150px] rounded-full pointer-events-none animate-pulse"></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 mt-64 lg:mt-20 lg:min-h-[60vh]">
                
                {/* Left Side: Info */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <div className="flex items-center gap-4 mb-6 bg-[#30294e]/30 backdrop-blur-xl border border-[#b266c5]/20 px-5 py-2.5 rounded-full w-fit mx-auto lg:mx-0 shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#d83bb6] animate-ping" />
                                <span className="text-[10px] font-black text-[#f9c1db] uppercase tracking-[0.4em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-sm">#{trendingRank}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl xl:text-[90px] font-classic font-black leading-tight text-transparent bg-clip-text bg-gradient-to-br from-[#f9c1db] via-[#d83bb6] to-[#9b2d96] uppercase drop-shadow-2xl mb-8 break-words whitespace-normal overflow-visible pr-10 pb-4">
                            {artist.artistName} <br />
                            <span className="inline-block text-white/40 font-sub tracking-widest text-3xl md:text-4xl px-8 py-2">ESSENCE </span>
                        </h1>

                        <p className="max-w-md text-gray-400 text-sm md:text-base leading-relaxed tracking-widest mb-10 border-l-2 border-[#d83bb6] pl-6 italic">
                            Elevating the soul with timeless melodies and sophisticated rhythms. Experience the height of R&B elegance.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
                            <div className="flex flex-col">
                                <span className="text-[#f9c1db]/50 text-[10px] uppercase tracking-widest font-bold">Followers</span>
                                <span className="text-3xl font-black text-white">1.2M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#f9c1db]/50 text-[10px] uppercase tracking-widest font-bold">Monthly Listeners</span>
                                <span className="text-3xl font-black text-white">6.4M</span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Side: Stylized Image */}
                <div className="w-full lg:w-[35%] flex justify-center items-center order-1 lg:order-2">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative w-[280px] h-[380px] md:w-[400px] md:h-[540px]"
                    >
                        {/* Elegant Decorative Frames */}
                        <div className="absolute -inset-4 border border-[#d83bb6]/20 rounded-[2.5rem] z-0 scale-105"></div>
                        <div className="absolute inset-0 border border-white/5 rounded-[2rem] z-0 translate-x-4 translate-y-4 shadow-2xl"></div>
                        
                        {/* Main Image Container */}
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden z-10 border border-[#f9c1db]/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] bg-[#1c172e] group">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-[8s] ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1c172e] via-transparent to-transparent opacity-80"></div>
                        </div>

                        {/* Floating Status */}
                        <motion.div 
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-10 bg-[#30294e] border border-[#d83bb6]/30 p-6 rounded-3xl z-20 shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#d83bb6] flex items-center justify-center shadow-[0_0_15px_#d83bb6]">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[9px] text-[#f9c1db] font-bold uppercase tracking-[0.2em]">Soul Class</p>
                                    <p className="text-white font-black text-sm uppercase italic">Elite Artist</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* 📌 Banner Section */}
            <div className="w-full max-w-7xl mx-auto z-20 mt-20">
                <Reveal delay={0.4} effect="fade-up">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="relative flex flex-col md:flex-row items-center justify-between gap-10 w-full bg-[#30294e]/50 backdrop-blur-3xl p-10 md:px-14 rounded-[3rem] border border-[#b266c5]/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                    >
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h2 className="text-xs font-black tracking-[0.5em] uppercase text-[#f9c1db] mb-3">Featured Event</h2>
                            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                {events.length > 0 ? (
                                    <>
                                        <div className="flex flex-col">
                                            <span className="text-white font-classic font-black text-4xl">
                                                {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden md:block w-px h-12 bg-white/10"></span>
                                        <span className="text-gray-300 font-classic font-bold tracking-tight text-2xl uppercase">
                                            {events[0].event?.eventName || events[0].eventName}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-500 font-classic font-medium tracking-widest uppercase text-xl">New tours coming soon</span>
                                )}
                            </div>
                        </div>
                        <motion.button
                            onClick={() => navigate('/new-event')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#d83bb6] to-[#9b2d96] text-white px-14 py-5 rounded-2xl font-black tracking-widest uppercase text-xs shadow-[0_20px_40px_rgba(216,59,182,0.4)] hover:shadow-[#d83bb6]/50 transition-all"
                        >
                            Get Tickets
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}

// 📌 Add these imports
import { useMemo } from 'react';
