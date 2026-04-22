import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function HeroSection({ artist, events, embers }) {
    const navigate = useNavigate();
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
                <motion.div
                    className="absolute inset-0 opacity-40 mix-blend-overlay grayscale-[90%]"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2500&auto=format&fit=crop')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-[#D3131F] opacity-20 blur-[120px]"
                    animate={{ x: ['-10%', '20%', '-10%'], y: ['-10%', '10%', '-10%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '0%', left: '10%' }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-[#D3131F] opacity-15 blur-[100px]"
                    animate={{ x: ['20%', '-20%', '20%'], y: ['10%', '-10%', '10%'] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    style={{ bottom: '0%', right: '10%' }}
                />

                {embers.map((ember) => (
                    <motion.div
                        key={ember.id}
                        className="absolute rounded-full bg-[#D3131F]"
                        style={{
                            width: ember.size,
                            height: ember.size,
                            left: `${ember.left}%`,
                            bottom: '-5%',
                            boxShadow: '0 0 8px #D3131F, 0 0 15px #ff4d4d',
                        }}
                        initial={{ y: 0, opacity: 0, x: 0 }}
                        animate={{
                            y: [0, -800, -1200],
                            opacity: [0, 0.8, 1, 0],
                            x: [0, ember.xOffset, ember.xOffset * 1.5]
                        }}
                        transition={{ duration: ember.duration, delay: ember.delay, repeat: Infinity, ease: "linear" }}
                    />
                ))}
            </div>

            <div className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-[#0a0a0a] via-[#050505]/80 to-transparent z-0 pointer-events-none"></div>

            <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center mt-10 z-10">
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.9)] bg-[#0a0a0a] group ring-1 ring-white/5">
                    <img
                        src={artist.profileImage || "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=2000&auto=format&fit=crop"}
                        alt={artist.artistName}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-[10s] ease-out group-hover:scale-105 grayscale-[40%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-95"></div>

                    <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-20">
                        {/* 📌 ใส่ Reveal คลุมชื่อศิลปิน */}
                        <Reveal delay={0.2}>
                            <h1 className="text-5xl md:text-7xl lg:text-[8rem] leading-[0.85] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:from-white group-hover:to-[#D3131F] cursor-default">
                                {artist.artistName}
                            </h1>
                        </Reveal>
                    </div>
                </div>
            </div>

            {/* 📌 ใส่ Reveal คลุมแถบ Upcoming Tour */}
            <Reveal delay={0.4} effect="fade-up">
                <div className="relative z-20 mt-12 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:px-10 md:py-8 shadow-2xl">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 mb-6 md:mb-0">
                        <h2 className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-gray-500">Upcoming Tour</h2>
                        <div className="flex items-center gap-4 mt-2">
                            {events.length > 0 ? (
                                <>
                                    <span className="text-[#D3131F] font-black text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(211,19,31,0.5)]">
                                        {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                    </span>
                                    <span className="w-[2px] h-8 bg-gray-700"></span>
                                    <span className="text-gray-200 font-bold tracking-wide text-sm md:text-lg uppercase line-clamp-1">
                                        {events[0].event?.eventName || events[0].eventName}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-500 font-medium uppercase tracking-widest text-sm">No upcoming tours announced</span>
                            )}
                        </div>
                    </div>
                    <motion.button
                        onClick={() => navigate('/new-event')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-100  from-[#D3131F] to-[#991b1b] text-white px-12 py-4 rounded-full font-black tracking-widest uppercase text-sm md:text-base shadow-[0_10px_30px_rgba(211,19,31,0.4)] border border-[#ff4d4d]/30 hover:border-white transition-all whitespace-nowrap"
                    >
                        Get Tickets
                    </motion.button>
                </div>
            </Reveal>
        </section>
    );
}