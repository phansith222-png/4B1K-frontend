import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 z-10">
            <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full md:w-3/4 h-[400px] md:h-[600px]"
                >
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-[#00E5FF] rounded-tl-3xl"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-[#7000FF] rounded-br-3xl"
                    />

                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#111]">
                        <img
                            src={artist.profileImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"}
                            alt={artist.artistName}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#00E5FF]/10 to-transparent opacity-90"></div>

                        <div className="absolute bottom-10 left-10 md:left-14 z-20">
                            {/* 📌 ครอบด้วย Reveal */}

                            <Reveal delay={0.4}>
                                <motion.h1
                                    whileHover={{ skewX: -5 }}
                                    className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,229,255,0.8)] cursor-default uppercase line-clamp-2"
                                >
                                    {artist.artistName}
                                </motion.h1>
                            </Reveal>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 📌 ครอบส่วน Banner ด้วย Reveal */}
            <Reveal delay={0.6} effect="fade-up">
                <motion.div
                    className="relative z-20 mt-16 flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl bg-gray-900/30 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-800"
                >
                    <div className="flex-1">
                        <h2 className="text-3xl font-black tracking-widest uppercase text-[#00E5FF]">{artist.agency?.name || 'Exclusive Artist'}</h2>
                        <div className="flex items-center gap-4 mt-3">
                            {events.length > 0 ? (
                                <>
                                    <span className="text-[#7000FF] font-black text-xl">
                                        {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                    </span>
                                    <span className="w-px h-6 bg-gray-600"></span>
                                    <span className="text-gray-300 font-medium">
                                        {events[0].event?.eventName || events[0].eventName}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-500 font-medium uppercase">No upcoming tours available</span>
                            )}
                        </div>
                    </div>
                    <motion.button
                        onClick={() => navigate('/new-event')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-50 bg-gradient-to-r from-[#00E5FF] to-[#7000FF] text-white px-12 py-4 rounded-full font-black tracking-widest uppercase text-sm md:text-base shadow-[0_10px_30px_rgba(0,229,255,0.3)] border border-white/20 hover:border-black transition-all whitespace-nowrap"
                    >
                        Join Event
                    </motion.button>
                </motion.div>
            </Reveal>
        </section>
    );
}
