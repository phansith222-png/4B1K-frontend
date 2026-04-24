import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function HeroSection({ artist, events, embers }) {
    const navigate = useNavigate();
    
    // Mock trending rank
    const trendingRank = useMemo(() => (artist.id % 12) + 1, [artist.id]);

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
            {/* 🔙 Back Button */}
            <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: 5, boxShadow: '0 0 20px rgba(211, 19, 31, 0.3)' }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-3 text-[#D3131F] hover:text-white transition-colors group bg-[#D3131F]/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#D3131F]/20"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-xs font-black uppercase tracking-widest">Back</span>
            </motion.button>

            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#D3131F] opacity-[0.08] blur-[150px] rounded-full pointer-events-none animate-pulse"></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 mt-64 lg:mt-20 lg:min-h-[60vh]">
                
                {/* Left Side: Info */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <div className="flex items-center gap-4 mb-6 bg-red-950/20 backdrop-blur-xl border border-red-500/20 px-4 py-2 rounded-full w-fit mx-auto lg:mx-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#D3131F] animate-ping" />
                                <span className="text-[10px] font-black text-[#D3131F] uppercase tracking-[0.3em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-sm">#{trendingRank}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl xl:text-[100px] font-black tracking-tighter leading-tight text-white uppercase drop-shadow-2xl mb-8 pb-4 break-words whitespace-normal overflow-visible pr-10">
                            {artist.artistName} <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D3131F] to-white/60 px-8 py-2">ROCK ON </span>
                        </h1>

                        <p className="max-w-md text-gray-400 text-sm md:text-base leading-relaxed tracking-wide mb-10 border-l-2 border-[#D3131F] pl-6 italic">
                            Unleashing raw energy and legendary riffs. Experience the power of rock that echoes through generations.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Followers</span>
                                <span className="text-2xl font-black text-white">1.8M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Monthly Listeners</span>
                                <span className="text-2xl font-black text-white">8.5M</span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Side: Stylized Artist Image */}
                <div className="w-full lg:w-[35%] flex justify-center items-center order-1 lg:order-2">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, x: 50 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative w-[300px] h-[400px] md:w-[420px] md:h-[560px]"
                    >
                        {/* Decorative Rugged Frames */}
                        <div className="absolute inset-0 border border-white/10 rounded-2xl -rotate-3 z-0"></div>
                        <div className="absolute inset-0 border border-[#D3131F]/30 rounded-2xl rotate-2 z-0"></div>
                        
                        {/* Main Image Container */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden z-10 border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.8)] bg-[#050505] group">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                        </div>

                        {/* Floating Interaction */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 -left-8 bg-[#111] border border-white/10 p-5 rounded-2xl z-20 shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#D3131F] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Stage Mode</p>
                                    <p className="text-white font-black text-sm uppercase italic">Amplified</p>
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
                        className="relative flex flex-col md:flex-row items-center justify-between gap-8 w-full bg-[#111]/60 backdrop-blur-3xl p-8 md:px-12 rounded-3xl border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
                    >
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h2 className="text-xs font-black tracking-[0.4em] uppercase text-[#D3131F] mb-2">Upcoming Show</h2>
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                {events.length > 0 ? (
                                    <>
                                        <span className="text-white font-black text-4xl italic">
                                            {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                        <span className="hidden md:block w-px h-10 bg-white/10"></span>
                                        <span className="text-gray-300 font-bold tracking-tight text-xl uppercase italic">
                                            {events[0].event?.eventName || events[0].eventName}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-500 font-medium tracking-widest uppercase">No tour dates found</span>
                                )}
                            </div>
                        </div>
                        <motion.button
                            onClick={() => navigate('/new-event')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#D3131F] text-white px-12 py-4 rounded-xl font-black tracking-widest uppercase text-xs shadow-[0_15px_40px_rgba(211,19,31,0.4)] hover:bg-[#ff1a1a] transition-all"
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
