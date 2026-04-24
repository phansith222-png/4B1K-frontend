import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CategoryBackground from './CategoryBackground';

export default function CategorySection({ section, navigate }) {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <section className="relative w-full py-24 overflow-hidden">
            <CategoryBackground keyword={section.keyword} artist={section.artists[0]} />

            <div className="relative z-10 w-full max-w-[100rem] mx-auto pl-6 md:pl-12">

                {/* Header ของแต่ละหมวด */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 pr-6 md:pr-12 gap-6">
                    <div className="border-l-[6px] pl-6" style={{ borderColor: section.primary }}>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-lg" style={{ color: section.primary }}>
                            {section.title}
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs md:text-sm max-w-xl">{section.desc}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-gray-500 font-bold tracking-widest text-xs uppercase animate-pulse">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Drag to explore
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                </div>

                {/* Slider Container แบบ Framer Motion Drag */}
                <motion.div ref={sliderRef} className="w-full overflow-hidden cursor-grab active:cursor-grabbing pb-16">
                    <motion.div
                        drag="x"
                        dragConstraints={sliderRef}
                        dragElastic={0.1}
                        onDragStart={() => setIsDragging(true)}
                        onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
                        className="flex gap-6 md:gap-10 w-max pr-12"
                    >
                        {section.artists.map((artist, aIdx) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: aIdx * 0.05 }}
                                whileHover={{ y: -15 }}
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    // พาไปที่ Path ของหมวดหมู่นั้นๆ (เช่น /pop, /rock) พร้อมแนบ ?artistId=
                                    const targetPath =
                                        section.keyword === 'pop' ? '/pop' :
                                            section.keyword === 'rock' ? '/rock' :
                                                section.keyword === 'r&b' ? '/classic' : '/etc';

                                    navigate(`${targetPath}?artistId=${artist.id}`);
                                }}
                                className="flex flex-col gap-5 group w-[280px] md:w-[380px] flex-shrink-0"
                            >
                                {/* รูปการ์ดหลัก */}
                                <div
                                    className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500"
                                    style={{ boxShadow: `0 20px 40px -10px ${section.primary}30` }}
                                >
                                    <img
                                        src={artist.profileImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800"}
                                        alt={artist.artistName}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0 pointer-events-none"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent opacity-90 pointer-events-none" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-20 pointer-events-none">
                                        <span
                                            className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-3 py-1.5 rounded w-fit shadow-lg backdrop-blur-md"
                                            style={{ backgroundColor: `${section.primary}CC`, color: ['r&b', 'hip hop', 'pop'].includes(section.keyword) ? '#000' : '#FFF' }}
                                        >
                                            {artist.agency?.name || "Independent"}
                                        </span>
                                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
                                            {artist.artistName}
                                        </h3>
                                    </div>

                                    {/* Hover Overlay Icon */}
                                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>

                                {/* แถบข้อมูลด้านล่าง */}
                                <div className="mx-4 mb-4 px-5 py-3.5 rounded-2xl bg-[#0B0C10]/60 backdrop-blur-md border border-white/5 flex justify-between items-center group-hover:bg-[#12141A]/80 group-hover:border-white/20 transition-all duration-500 overflow-hidden relative shadow-lg group-hover:shadow-2xl">

                                    {/* 1. แสง Gradient วิ่งพื้นหลัง (อิงตามสีประจำหมวดหมู่) */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                                        style={{ background: `linear-gradient(90deg, ${section.primary}, transparent)` }}
                                    />

                                    <div className="flex flex-col relative z-10 flex-1 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">
                                                Latest Release
                                            </span>

                                            {/* 2. ลูกเล่นคลื่นเสียง (Equalizer) เด้งตอน Hover */}
                                            <div className="hidden group-hover:flex items-end gap-[2px] h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-[2px] rounded-full" style={{ backgroundColor: section.primary }} />
                                                <motion.div animate={{ height: [5, 11, 5] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.15 }} className="w-[2px] rounded-full" style={{ backgroundColor: section.primary }} />
                                                <motion.div animate={{ height: [4, 7, 4] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.3 }} className="w-[2px] rounded-full" style={{ backgroundColor: section.primary }} />
                                            </div>
                                        </div>

                                        {/* 3. ชื่อเพลง เลื่อนขวาเบาๆ ตอน Hover */}
                                        <span className="text-sm md:text-base font-black text-gray-200 uppercase line-clamp-1 transition-all duration-500 group-hover:text-white group-hover:translate-x-1">
                                            {artist.songs?.[0]?.title || "Upcoming Track"}
                                        </span>
                                    </div>

                                    {/* 4. ปุ่ม Play Button พร้อมเอฟเฟกต์แสงกระจาย (Glow & Pulse) */}
                                    <div className="relative z-10 flex-shrink-0">
                                        {/* วงแหวนกระจายแสงด้านหลัง */}
                                        <div
                                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-ping"
                                            style={{ backgroundColor: section.primary }}
                                        />

                                        {/* ตัวปุ่มหลัก */}
                                        <div
                                            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 relative z-10"
                                            style={{
                                                backgroundColor: section.primary,
                                                boxShadow: `0 4px 15px ${section.primary}60` // สร้างเงาสะท้อนตามสีหมวด
                                            }}
                                        >
                                            <svg className="w-4 h-4 text-black ml-0.5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4.018 14L14.22 9 4.018 4v10z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
