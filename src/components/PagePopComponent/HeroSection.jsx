import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState(false);

    // Mock trending rank based on artist ID for community feeling
    const trendingRank = useMemo(() => (artist.id % 15) + 1, [artist.id]);

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
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

            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00F5D4] opacity-[0.1] blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#FF007F] opacity-[0.1] blur-[150px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* 📌 Dynamic Composition */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 mt-64 lg:mt-20 lg:min-h-[60vh]">
                
                {/* Left Side: Info & Branding */}
                <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 overflow-visible">
                    <Reveal effect="fade-right" overflow="visible">
                        <div className="flex items-center gap-4 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full w-fit mx-auto lg:mx-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping" />
                                <span className="text-[10px] font-black text-[#00F5D4] uppercase tracking-[0.3em]">Trending in Community</span>
                            </div>
                            <span className="text-white font-black text-sm">#{trendingRank}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl xl:text-[100px] font-black italic tracking-tighter leading-tight text-white uppercase drop-shadow-2xl mb-8 pb-4 pr-10 break-words whitespace-normal overflow-visible">
                            {artist.artistName} <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#00F5D4] px-8 py-2">VIBES </span>
                        </h1>

                        <p className="max-w-md text-gray-400 text-sm md:text-base leading-relaxed tracking-wide mb-10 border-l-2 border-[#FF007F] pl-6 italic">
                            Redefining the sound of modern pop with every beat. Join the movement and experience the energy live.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Followers</span>
                                <span className="text-2xl font-black text-white">2.4M</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 mx-4 hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Monthly Listeners</span>
                                <span className="text-2xl font-black text-white">12.8M</span>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* Right Side: Smaller, More Stylized Image */}
                <div className="w-full lg:w-[35%] flex justify-center items-center order-1 lg:order-2">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px]"
                    >
                        {/* Decorative Frames */}
                        <div className="absolute inset-0 border-2 border-[#00F5D4] rounded-[3rem] rotate-6 z-0 opacity-20"></div>
                        <div className="absolute inset-0 border-2 border-[#FF007F] rounded-[3rem] -rotate-3 z-0 opacity-20"></div>
                        
                        {/* Main Image Shield */}
                        <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden z-10 border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.6)] bg-[#110E1B] group">
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
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[10s] group-hover:scale-110 ${imgLoaded ? 'opacity-90' : 'opacity-0'}`}
                            />
                            {/* Glass Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0C10] via-transparent to-transparent opacity-60"></div>
                        </div>

                        {/* Floating Interaction Element */}
                        <motion.div 
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -right-6 md:bottom-0 md:right-0 bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-3xl z-20 shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00F5D4] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Status</p>
                                    <p className="text-white font-black text-xs uppercase">Touring Now</p>
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
                            onClick={() => navigate('/new-event')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-black px-10 py-4 rounded-full font-black tracking-widest uppercase text-xs shadow-2xl hover:bg-[#00F5D4] transition-colors"
                        >
                            Get Tickets
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}

// 📌 Add these imports if missing at the top
import { useMemo } from 'react';
