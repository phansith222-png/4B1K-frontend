import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();

    // Mock trending rank
    const trendingRank = useMemo(() => (artist.id % 10) + 1, [artist.id]);

    return (
        <section className="relative w-full h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
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

            {/* Background Ambient Glow - PULSING (EXTRA FAINT) */}
            <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#d83bb6] opacity-[0.02] blur-[150px] rounded-full pointer-events-none animate-pulse"></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mt-20 lg:mt-0 flex-1">

                {/* Left Side: Info */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <motion.div 
                            onClick={() => navigate('/home')}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(216, 59, 182, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full w-fit mx-auto lg:mx-0 cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#d83bb6] animate-ping" />
                                <span className="text-[11px] font-black text-[#d83bb6] uppercase tracking-[0.3em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-base">#{trendingRank}</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl xl:text-[110px] font-black italic tracking-tighter leading-[0.85] text-white uppercase drop-shadow-2xl mb-8 pb-4 pr-10 break-words whitespace-normal overflow-visible">
                            {artist.artistName} <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#d83bb6] to-[#7000FF] px-10 py-2 text-glow-purple italic tracking-[0.2em]">ELEGANCE </span>
                        </h1>

                        <p className="max-w-xl text-white/50 text-base md:text-lg leading-relaxed tracking-widest mb-10 border-l-4 border-[#d83bb6] pl-8 font-medium">
                            Elevating the soul with timeless melodies and sophisticated rhythms. Experience the height of R&B elegance.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 mt-6">
                            <div className="flex flex-col">
                                <span className="text-[#d83bb6]/60 text-[10px] uppercase tracking-[0.3em] font-black">Followers</span>
                                <span className="text-3xl lg:text-4xl font-black text-white tracking-tighter">1.2M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-black">Monthly Listeners</span>
                                <span className="text-3xl lg:text-4xl font-black text-white tracking-tighter">6.4M</span>
                            </div>

                            {/* 🔗 Social Icons - Elegant Glass Hub */}
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-3xl shadow-2xl ml-4">
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
                                        whileHover={{ y: -3, scale: 1.1, backgroundColor: 'rgba(216, 59, 182, 0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 flex items-center justify-center transition-all duration-500 rounded-full"
                                        style={{ 
                                            color: social.color,
                                            filter: `drop-shadow(0 0 5px ${social.color}40)` 
                                        }}
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                            {social.icon}
                                        </svg>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Side: Stylized Artist Image */}
                <div className="w-full lg:w-[35%] flex justify-center items-center order-1 lg:order-2">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="relative w-[380px] h-[480px] md:w-[500px] md:h-[650px]"
                    >
                        {/* 💎 Modern Minimalism & Glass - Elegant Frames (3 Layers) */}
                        <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] z-0 scale-[1.02] backdrop-blur-[2px]"></div>
                        <div className="absolute -inset-4 border border-[#d83bb6]/30 rounded-[3rem] z-0 translate-x-2 translate-y-2 opacity-30 backdrop-blur-[1px]"></div>
                        <div className="absolute -inset-8 border border-[#d83bb6]/20 rounded-[3.5rem] z-0 translate-x-4 translate-y-4 opacity-10 backdrop-blur-[0.5px]"></div>
                        
                        {/* ✨ Floating Sparkles around frames */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
                                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                                className="absolute w-1 h-1 bg-white rounded-full blur-[1px] z-20"
                                style={{ 
                                    left: `${-20 + Math.random() * 120}%`, 
                                    top: `${-20 + Math.random() * 120}%` 
                                }}
                            />
                        ))}

                        {/* Soft Ambient Shadow behind image */}
                        <div className="absolute inset-0 bg-[#d83bb6] opacity-10 blur-[60px] rounded-[2.5rem] z-0 scale-90"></div>

                        {/* Main Image Container */}
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden z-10 border border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.9)] bg-[#1c172e] group transition-all duration-1000 hover:shadow-[0_0_80px_rgba(216,59,182,0.3)]">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-[8s] ease-out"
                            />
                        </div>

                        {/* 🎩 Refined Status - Minimalist Glass */}
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -right-10 bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] z-20 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                        >
                            <div className="flex flex-col items-center text-center px-4">
                                <div className="w-8 h-8 rounded-full bg-[#d83bb6] flex items-center justify-center shadow-[0_0_20px_rgba(216,59,182,0.4)] mb-3">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                </div>
                                <p className="text-[9px] text-[#f9c1db] font-black uppercase tracking-[0.3em] mb-1">Soul Class</p>
                                <p className="text-white font-classic font-black text-sm uppercase">Elite Performer</p>
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
                            onClick={() => {
                                const eventId = events.length > 0 ? (events[0].event?.id || events[0].id) : '';
                                const search = artist.artistName || artist.name || "";
                                navigate(`/nearby-events?search=${encodeURIComponent(search)}${eventId ? `&eventId=${eventId}` : ''}`);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#d83bb6] to-[#9b2d96] text-white px-14 py-5 rounded-2xl font-black tracking-widest uppercase text-xs shadow-[0_20px_40px_rgba(216,59,182,0.4)] hover:shadow-[#d83bb6]/50 transition-all"
                        >
                            Join Event
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}
