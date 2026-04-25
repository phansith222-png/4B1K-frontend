import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // Add Import

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();

    // Mock trending rank
    const trendingRank = useMemo(() => (artist.id % 20) + 1, [artist.id]);

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
            {/* 🔙 Back Button */}
            <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: 5, boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-3 text-[#00E5FF] hover:text-white transition-colors group bg-[#00E5FF]/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#00E5FF]/20"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-xs font-black uppercase tracking-widest text-[#00E5FF]">Back</span>
            </motion.button>

            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#00E5FF] opacity-[0.08] blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#7000FF] opacity-[0.08] blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 mt-64 lg:mt-20 lg:min-h-[60vh]">
                
                {/* Left Side: Info */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <div className="flex items-center gap-4 mb-6 bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/20 px-5 py-2.5 rounded-full w-fit mx-auto lg:mx-0 shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                                <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.4em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-sm">#{trendingRank}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl xl:text-[90px] font-black italic tracking-tighter leading-tight text-white uppercase drop-shadow-2xl mb-8 break-words whitespace-normal overflow-visible pb-4 pr-10">
                            {artist.artistName} <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF] px-8 py-2">EVOLVED </span>
                        </h1>

                        <p className="max-w-md text-gray-400 text-sm md:text-base leading-relaxed tracking-widest mb-10 border-l-2 border-[#00E5FF] pl-6 italic">
                            Breaking boundaries and creating the future of sound. Experience a performance that transcends the ordinary.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
                            <div className="flex flex-col">
                                <span className="text-[#00E5FF]/50 text-[10px] uppercase tracking-widest font-bold">Followers</span>
                                <span className="text-3xl font-black text-white">950K</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#00E5FF]/50 text-[10px] uppercase tracking-widest font-bold">Monthly Listeners</span>
                                <span className="text-3xl font-black text-white">4.2M</span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Side: Stylized Image */}
                <div className="w-full lg:w-[35%] flex justify-center items-center order-1 lg:order-2">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, rotate: -5 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]"
                    >
                        {/* Futuristic Tech Frames */}
                        <div className="absolute -inset-6 border border-[#00E5FF]/20 rounded-full z-0 animate-spin-slow"></div>
                        <div className="absolute -inset-10 border border-[#7000FF]/10 rounded-full z-0 animate-reverse-spin-slow"></div>
                        
                        {/* Main Image Shield */}
                        <div className="relative w-full h-full rounded-full overflow-hidden z-10 border-4 border-white/5 shadow-[0_0_80px_rgba(0,229,255,0.3)] bg-[#050505] group">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 group-hover:scale-110 transition-all duration-10s ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Floating Interaction */}
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 bg-white/5 backdrop-blur-3xl border border-white/10 p-5 rounded-full z-20 shadow-2xl"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7000FF] flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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
                        className="relative flex flex-col md:flex-row items-center justify-between gap-10 w-full bg-white/5 backdrop-blur-3xl p-10 md:px-14 rounded-[3rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h2 className="text-xs font-black tracking-[0.5em] uppercase text-[#00E5FF] mb-3">Live Experience</h2>
                            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                {events.length > 0 ? (
                                    <>
                                        <span className="text-white font-black text-4xl">
                                            {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                        <span className="hidden md:block w-px h-12 bg-white/10"></span>
                                        <span className="text-gray-300 font-bold tracking-tight text-2xl uppercase">
                                            {events[0].event?.eventName || events[0].eventName}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-500 font-medium tracking-widest uppercase text-xl italic opacity-50">Global Tour Pending</span>
                                )}
                            </div>
                        </div>
                        <motion.button
                            onClick={() => navigate('/new-event')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-14 py-5 rounded-2xl font-black tracking-widest uppercase text-xs shadow-[0_20px_40px_rgba(0,229,255,0.4)] hover:shadow-[#00E5FF]/50 transition-all"
                        >
                            Join Experience
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}

// 📌 Add these imports
import { useMemo } from 'react';
