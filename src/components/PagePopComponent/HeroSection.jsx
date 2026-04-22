import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function HeroSection({ artist, events }) {
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState(false);
    // console.log(events)
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#00F5D4] opacity-20 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#FF007F] opacity-20 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* 📌 ส่วนรูปภาพศิลปิน */}
            <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-full md:w-3/4 h-[450px] md:h-[650px]"
                >
                    {/* Blob Animations */}
                    <div className="absolute -top-6 -left-6 md:-top-12 md:-left-12 w-64 h-64 md:w-96 md:h-96 bg-[#00F5D4] shape-blob-1 z-0 mix-blend-screen opacity-50"></div>
                    <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-64 h-64 md:w-96 md:h-96 bg-[#FF007F] shape-blob-2 z-0 mix-blend-screen opacity-50"></div>

                    {/* Main Image Card */}
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden z-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-[#110E1B] group flex items-center justify-center">
                        {/* Placeholder / Skeleton ระหว่างรอโหลดรูป */}
                        {!imgLoaded && (
                            <div className="absolute inset-0 bg-[#1A1C23] animate-pulse flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-white/10 border-t-[#00F5D4] rounded-full animate-spin"></div>
                            </div>
                        )}
                        
                        <img
                            src={artist.profileImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"}
                            alt={artist.artistName}
                            onLoad={() => setImgLoaded(true)}
                            onError={() => setImgLoaded(true)}
                            className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-all duration-[15s] ease-out group-hover:scale-110 ${imgLoaded ? 'opacity-80' : 'opacity-0'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent opacity-90"></div>

                        <div className="absolute bottom-12 left-8 md:left-16 z-20">

                            <motion.h1
                                whileHover={{ skewX: -5 }}
                                // 📌 แก้จาก leading-none เป็น leading-tight ป้องกันตัวหนังสือหางยาวโดนตัดขอบล่าง
                                className="text-4xl md:text-6xl lg:text-[7rem] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#00F5D4]/70 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] cursor-default uppercase leading-tight"
                            >
                                {artist.artistName}
                            </motion.h1>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 📌 แบนเนอร์ด้านล่าง (แก้ Layout ให้บังคับอยู่ตรงกลาง ไม่เบี้ยวซ้าย) */}
            <div className="w-full max-w-6xl mx-auto z-20 mt-16 md:mt-24">
                <Reveal delay={0.2} effect="fade-up">
                    <motion.div
                        whileHover={{ y: -5 }}
                        // เอา max-w-6xl ออกจากตรงนี้ เพราะเราบังคับกรอบจาก div ด้านบนแล้ว
                        className="relative flex flex-col md:flex-row items-center justify-between gap-8 w-full bg-[#1A1C23]/60 backdrop-blur-2xl p-8 md:px-12 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex-1 flex flex-col items-center md:items-start">
                            <h2 className="text-xl md:text-2xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Next Performance</h2>
                            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 text-center md:text-left">
                                {events.length > 0 ? (
                                    <>
                                        <span className="text-[#FF007F] font-black text-2xl md:text-3xl drop-shadow-[0_0_15px_rgba(255,0,127,0.5)]">
                                            {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                        <span className="hidden md:block w-px h-8 bg-gray-600"></span>
                                        <span className="text-gray-200 font-bold tracking-wide text-lg md:text-xl line-clamp-1 uppercase">
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
                            className="bg-gradient-to-r from-[#FF007F] to-[#00F5D4] text-[#110E1B] px-12 py-4 rounded-full font-black tracking-widest uppercase text-sm md:text-base shadow-[0_10px_30px_rgba(0,245,212,0.4)] border border-white/20 hover:border-white transition-all whitespace-nowrap"
                        >
                            Get Tickets
                        </motion.button>
                    </motion.div>
                </Reveal>
            </div>
        </section>
    );
}