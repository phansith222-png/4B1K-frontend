import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState(false);

    // Mock trending rank based on artist ID for community feeling
    const trendingRank = useMemo(() => (artist.id % 15) + 1, [artist.id]);

    return (
        <section className="relative w-full h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
            {/* 🔙 Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: 5, boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)' }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-3 text-[#00F5D4] hover:text-white transition-colors group bg-[#00F5D4]/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#00F5D4]/20"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span className="text-xs font-black uppercase tracking-widest">Back</span>
            </motion.button>

            {/* Background Ambient Glow - PULSING ALTERNATELY (EXTRA FAINT) */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00F5D4] opacity-[0.02] blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#FF007F] opacity-[0.02] blur-[150px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 mt-20 lg:mt-0 flex-1">

                {/* Left Side: Info & Branding */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <motion.div 
                            onClick={() => navigate('/home')}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full w-fit mx-auto lg:mx-0 cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-ping" />
                                <span className="text-[11px] font-black text-[#00F5D4] uppercase tracking-[0.3em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-base">#{trendingRank}</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl xl:text-[110px] font-black italic tracking-tighter leading-[0.85] text-white uppercase drop-shadow-2xl mb-8 pb-4 pr-10 break-words whitespace-normal overflow-visible">
                            {artist.artistName} <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#FF007F] px-10 py-2 text-glow-cyan">VIBES </span>
                        </h1>

                        <p className="max-w-xl text-white/60 text-base md:text-lg leading-relaxed tracking-widest mb-10 border-l-4 border-[#00F5D4] pl-8 font-medium">
                            Redefining the sound of modern pop with every beat. Join the movement and experience the energy live.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 mt-6">
                            <div className="flex flex-col">
                                <span className="text-[#00F5D4]/60 text-[10px] uppercase tracking-[0.3em] font-black">Followers</span>
                                <span className="text-3xl lg:text-4xl font-black text-white">2.4M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#FF007F]/60 text-[10px] uppercase tracking-[0.3em] font-black">Monthly Listeners</span>
                                <span className="text-3xl lg:text-4xl font-black text-white">12.8M</span>
                            </div>

                            {/* 🔗 Social Icons - Glassy Hub */}
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-xl ml-4">
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
                                        whileHover={{ y: -3, scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 rounded-xl"
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
                        initial={{ scale: 0.9, opacity: 0, x: 50 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative w-[320px] h-[320px] md:w-[550px] md:h-[550px]"
                    >
                        {/* 🌀 The Digital Portal - Concentric Rings */}
                        <div className="absolute inset-0 border-2 border-[#00F5D4] rounded-full rotate-6 z-0 opacity-20 animate-spin-slow"></div>
                        <div className="absolute inset-0 border-2 border-[#FF007F] rounded-full -rotate-3 z-0 opacity-20 animate-reverse-spin-slow"></div>
                        <div className="absolute -inset-12 border border-white/5 rounded-full z-0 animate-spin-slow opacity-10" style={{ animationDuration: '15s' }}></div>
                        <div className="absolute -inset-20 border border-white/5 rounded-full z-0 animate-reverse-spin-slow opacity-5" style={{ animationDuration: '25s' }}></div>

                        {/* Main Image Shield - Optimized Blur */}
                        <div className="relative w-full h-full rounded-full overflow-hidden z-10 border-2 border-white/20 shadow-[0_0_80px_rgba(0,245,212,0.3)] bg-[#110E1B] group transition-all duration-500 hover:shadow-[0_0_120px_rgba(0,245,212,0.5)] will-change-transform">
                            {!imgLoaded && (
                                <div className="absolute inset-0 bg-[#1A1C23] animate-pulse flex items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-white/10 border-t-[#00F5D4] rounded-full animate-spin"></div>
                                </div>
                            )}
                            <img
                                src={(artist.profileImage && typeof artist.profileImage === 'string' && artist.profileImage.startsWith('http'))
                                    ? artist.profileImage
                                    : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                onLoad={() => setImgLoaded(true)}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[10s] group-hover:scale-110 group-hover:rotate-2 ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
                            />
                        </div>

                        {/* 💊 Floating Status Pill - Glassmorphism */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] will-change-transform"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#FF007F] flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-[#00F5D4] font-black uppercase tracking-[0.2em]">Live Session</p>
                                    <p className="text-white font-black text-sm uppercase">Available Now</p>
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
                        className="relative flex flex-col md:flex-row items-center justify-between gap-8 w-full bg-[#1A1C23]/40 backdrop-blur-3xl p-8 md:px-12 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h2 className="text-sm font-black tracking-[0.4em] uppercase text-[#00F5D4] mb-2">Next Performance</h2>
                            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                {events.length > 0 ? (
                                    <>
                                        <span className="text-white font-black text-3xl">
                                            {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                        <span className="hidden md:block w-px h-6 bg-white/10"></span>
                                        <span className="text-gray-300 font-bold tracking-tight text-xl uppercase">
                                            {events[0].event?.eventName || events[0].eventName}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-gray-500 font-medium tracking-widest uppercase">No upcoming tours available</span>
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
                            className="bg-white text-black px-10 py-4 rounded-full font-black tracking-widest uppercase text-xs shadow-2xl hover:bg-[#00F5D4] transition-colors"
                        >
                            Join Event
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}
