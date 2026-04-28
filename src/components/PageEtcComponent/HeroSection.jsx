import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // Add Import

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();

    // Mock trending rank
    const trendingRank = useMemo(() => (artist.id % 20) + 1, [artist.id]);

    return (
        <section className="relative w-full min-h-screen lg:h-screen flex flex-col justify-center items-center px-4 md:px-6 overflow-hidden pt-44 md:pt-52 pb-12">
            {/* 🔙 Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: 5, boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}
                onClick={() => navigate(-1)}
                className="absolute top-24 md:top-28 left-6 md:left-12 z-50 flex items-center gap-3 text-[#00E5FF] hover:text-white transition-colors group bg-[#00E5FF]/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#00E5FF]/20"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-xs font-black uppercase tracking-widest">Back</span>
            </motion.button>

            {/* Background Ambient Glow - PULSING ALTERNATELY (EXTRA FAINT) */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#00E5FF] opacity-[0.02] blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#7000FF] opacity-[0.02] blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mt-20 lg:mt-0 flex-1">

                {/* Left Side: Info */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <motion.div 
                            onClick={() => navigate('/home')}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 229, 255, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-4 mb-6 bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/20 px-6 py-3 rounded-full w-fit mx-auto lg:mx-0 cursor-pointer transition-all group shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
                                <span className="text-[11px] font-black text-[#00E5FF] uppercase tracking-[0.4em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-base">#{trendingRank}</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl xl:text-[110px] font-black italic tracking-tighter leading-[0.85] text-white uppercase drop-shadow-2xl mb-8 pb-4 pr-10 break-words whitespace-normal overflow-visible">
                            {artist.artistName} <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF007F] px-10 py-2 text-glow-cyan">EVOLVED </span>
                        </h1>

                        <p className="max-w-xl text-white/50 text-base md:text-lg leading-relaxed tracking-widest mb-10 border-l-4 border-cyan-500 pl-8 font-medium">
                            Breaking boundaries and creating the future of sound. Experience a performance that transcends the ordinary.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 mt-6">
                            <div className="flex flex-col">
                                <span className="text-cyan-500/60 text-[10px] uppercase tracking-[0.3em] font-black">Followers</span>
                                <span className="text-3xl lg:text-4xl font-black text-white">950K</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-purple-500/60 text-[10px] uppercase tracking-[0.3em] font-black">Monthly Listeners</span>
                                <span className="text-3xl lg:text-4xl font-black text-white">4.2M</span>
                            </div>

                            {/* 🔗 Social Icons - Cyber Hub */}
                            <div className="flex items-center gap-2 bg-cyan-950/10 backdrop-blur-3xl border border-cyan-500/20 p-2 rounded-xl shadow-2xl ml-4">
                                {[
                                    { id: 'spotify', url: 'https://spotify.com', color: '#1DB954', icon: <path d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.232-1.283 11.288-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.708-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.306-3.156-1.938-7.967-2.502-11.706-1.367-.503.152-1.03-.135-1.182-.638-.152-.503.135-1.03.638-1.182 4.288-1.302 9.609-.67 13.245 1.562.44.272.578.847.306 1.287zm-1.583 3.258c-.215.35-.67.463-1.02.247-2.76-1.687-6.236-2.067-10.33-1.127-.4.091-.803-.16-.893-.56-.091-.4.16-.803.56-.893 4.475-1.023 8.324-.593 11.435 1.306.35.215.463.67.247 1.02zm-5.389-13.3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/> },
                                    { id: 'youtube', url: 'https://youtube.com', color: '#FF0000', icon: <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/> },
                                    { id: 'instagram', url: 'https://instagram.com', color: '#E4405F', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
                                    { id: 'x', url: 'https://x.com', color: '#FFFFFF', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> }
                                ].map((social) => (
                                    <motion.a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -3, scale: 1.1, backgroundColor: 'rgba(0, 229, 255, 0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 rounded-lg"
                                        style={{ 
                                            color: social.color,
                                            filter: `drop-shadow(0 0 5px ${social.color}40)` 
                                        }}
                                    >
                                        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                                            {social.icon}
                                        </svg>
                                    </motion.a>
                                ))}
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
                        className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] aspect-square flex-shrink-0"
                    >
                         {/* 🚀 Evolved Tech - Complex Portal */}
                        <div className="absolute -inset-4 border border-[#00E5FF]/30 rounded-full z-0 animate-spin-slow"></div>
                        <div className="absolute -inset-12 border border-[#7000FF]/20 rounded-full z-0 animate-reverse-spin-slow" style={{ animationDuration: '12s' }}></div>
                        <div className="absolute -inset-24 border border-white/5 rounded-full z-0 animate-spin-slow opacity-10" style={{ animationDuration: '20s' }}></div>
                        
                        {/* Digital HUD Segments - Broken Circular Arcs with Labels */}
                        <div className="absolute -inset-10 border-t-2 border-l-2 border-cyan-500/30 rounded-full z-0 opacity-50">
                            <span className="absolute -top-6 left-1/4 text-[8px] text-cyan-400 font-mono animate-pulse">SCAN_MODE_V2</span>
                        </div>
                        <div className="absolute -inset-10 border-b-2 border-r-2 border-purple-500/30 rounded-full z-0 opacity-50">
                            <span className="absolute -bottom-6 right-1/4 text-[8px] text-purple-400 font-mono">LINK_STATE: ACTIVE</span>
                        </div>
                        <div className="absolute -inset-16 border-t-2 border-r-2 border-cyan-500/10 rounded-full z-0 opacity-20 animate-spin-slow"></div>
                        <div className="absolute -inset-16 border-b-2 border-l-2 border-purple-500/10 rounded-full z-0 opacity-20 animate-reverse-spin-slow"></div>

                        {/* Main Image Shield */}
                        <div className="relative w-full h-full rounded-full overflow-hidden z-10 border-4 border-white/10 shadow-[0_0_100px_rgba(0,229,255,0.4)] bg-[#050505] group transition-all duration-700 hover:shadow-[0_0_150px_rgba(0,229,255,0.6)]">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop"}
                                alt={artist.artistName}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-[15s] ease-out group-hover:rotate-1"
                            />
                            {/* 🔮 Spherical "Ball" Effect - Shadows and Highlights */}
                            <div className="absolute inset-0 rounded-full shadow-[inset_0_20px_50px_rgba(255,255,255,0.2),inset_0_-30px_60px_rgba(0,0,0,0.8)] z-20 pointer-events-none"></div>
                            <div className="absolute top-10 left-20 w-32 h-20 bg-white/10 blur-3xl rounded-full -rotate-45 z-20 pointer-events-none"></div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-60"></div>

                            {/* Digital Interference on Hover */}
                            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-30 pointer-events-none mix-blend-overlay"></div>
                        </div>

                        {/* 🛰️ Floating Tech Interaction - Enhanced */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 bg-black/80 backdrop-blur-3xl border border-cyan-500/30 p-6 rounded-full z-30 shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:border-cyan-400 transition-colors duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7000FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.5)]">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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
                            onClick={() => {
                                const eventId = events.length > 0 ? (events[0].event?.id || events[0].id) : '';
                                const search = artist.artistName || artist.name || "";
                                navigate(`/nearby-events?search=${encodeURIComponent(search)}${eventId ? `&eventId=${eventId}` : ''}`);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-14 py-5 rounded-2xl font-black tracking-widest uppercase text-xs shadow-[0_20px_40px_rgba(0,229,255,0.4)] hover:shadow-[#00E5FF]/50 transition-all"
                        >
                            Join Event
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}
