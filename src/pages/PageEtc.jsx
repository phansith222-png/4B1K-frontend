import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function PageEtc() {
    // สร้างละอองแสงสีฟ้าอ่อนๆ ลอยไปมา (Indie Vibe)
    const floatingBlobs = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        size: Math.random() * 300 + 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
    })), []);

    return (
        <div className="bg-[#F9F8F3] min-h-screen text-[#000000] font-sans overflow-x-hidden selection:bg-[#2B5AE8] selection:text-white relative">
            
            {/* ================= STYLE: CUSTOM ANIMATIONS ================= */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;900&display=swap');
                body { font-family: 'Outfit', sans-serif; }

                .shape-blob {
                    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
                    filter: blur(80px);
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .vinyl-rotate {
                    animation: spin-slow 12s linear infinite;
                }

                .eq-bar {
                    animation: eqRun 1.5s ease-in-out infinite;
                }
                @keyframes eqRun {
                    0%, 100% { height: 20%; }
                    50% { height: 100%; }
                }
            `}</style>

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {floatingBlobs.map(blob => (
                    <motion.div
                        key={blob.id}
                        className="absolute bg-[#2B5AE8] opacity-5 shape-blob"
                        style={{ 
                            width: blob.size, 
                            height: blob.size, 
                            left: `${blob.x}%`, 
                            top: `${blob.y}%` 
                        }}
                        animate={{
                            x: [0, 30, -30, 0],
                            y: [0, -50, 50, 0],
                        }}
                        transition={{ duration: blob.duration, delay: blob.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 z-10">
                <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full md:w-3/4 h-[400px] md:h-[600px]"
                    >
                        {/* Frame ตกแต่ง */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-[#2B5AE8] rounded-tl-3xl opacity-30"></div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-[#CEFF67] rounded-br-3xl opacity-50"></div>

                        {/* รูปศิลปิน */}
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-[#E5E7EB]">
                            <img
                                src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"
                                alt="Safeplanet"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2B5AE8]/40 via-transparent to-transparent opacity-60"></div>

                            {/* ชื่อศิลปิน */}
                            <div className="absolute bottom-10 left-10 z-20">
                                <motion.h1 
                                    whileHover={{ skewX: -5 }}
                                    className="text-6xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(43,90,232,0.4)] cursor-default"
                                >
                                    SAFEPLANET
                                </motion.h1>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-20 mt-12 flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl"
                >
                    <div className="flex-1">
                        <h2 className="text-3xl font-black tracking-widest uppercase text-[#2B5AE8]">Indie Dream Pop</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-black font-black text-xl">DEC 20</span>
                            <span className="w-px h-6 bg-gray-400"></span>
                            <span className="text-gray-600 font-medium">Safeplanet Live, Moonstar Studio</span>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: '#2B5AE8', color: '#FFFFFF' }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#CEFF67] text-black px-12 py-4 rounded-full font-black tracking-widest uppercase text-lg shadow-xl"
                    >
                        Get Tickets
                    </motion.button>
                </motion.div>
            </section>

            {/* ================= 2. LINEUP SECTION ================= */}
            <section className="relative w-full py-20 px-6 border-y border-gray-200">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-3">
                    {['ALI (VOCALS)', 'DOI (DRUMS)', 'YEE (BASS)'].map((name, i) => (
                        <motion.h2 
                            key={i}
                            whileHover={{ letterSpacing: '0.1em', color: '#2B5AE8' }}
                            className="text-5xl md:text-7xl font-black text-black tracking-tight cursor-default transition-all"
                        >
                            {name}
                        </motion.h2>
                    ))}
                    <h2 className="text-3xl md:text-5xl font-bold text-[#2B5AE8] tracking-tight mt-4 uppercase">
                        Independent <span className="text-gray-300 mx-2">•</span> Dreamy Pop
                    </h2>
                    <p className="text-sm md:text-base font-medium text-gray-500 tracking-widest leading-relaxed mt-6 max-w-2xl mx-auto">
                        คำตอบ • ห้องกระจก • เพียงเธอ • กอดความเจ็บช้ำ • ตัดสินใจ <br />
                        ข้างกาย • พริบตา • ดินแดน • นอนไม่หลับ
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MEDIA ================= */}
            <section className="relative w-full py-24 px-6 overflow-hidden">
                <div className="relative z-10 max-w-5xl mx-auto">
                    <h3 className="text-center text-xl md:text-2xl font-bold tracking-[0.5em] uppercase mb-12 text-[#2B5AE8]">Planet's Top Chart</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
                        {[
                            { song: 'ห้องกระจก (Mirror Room)', views: '45M+ Streams' },
                            { song: 'คำตอบ (Answer)', views: '38M+ Streams' },
                            { song: 'กอดความเจ็บช้ำ', views: '32M+ Streams' },
                            { song: 'ข้างกาย (With You)', views: '29M+ Streams' }
                        ].map((item, idx) => (
                            <motion.button 
                                key={idx} 
                                whileHover={{ y: -5, borderColor: '#2B5AE8' }}
                                className="border-2 border-white bg-white/80 text-black rounded-3xl p-6 transition-all duration-300 group flex items-center gap-5 shadow-lg shadow-gray-200/50 text-left"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#2B5AE8]/10 flex items-center justify-center font-black text-2xl text-[#2B5AE8]">{idx + 1}</div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-xs font-black uppercase text-gray-400">Popular</span>
                                    <span className="font-bold text-lg leading-tight line-clamp-1">{item.song}</span>
                                    <span className="text-xs text-[#2B5AE8] font-bold">{item.views}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Music Player */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-full max-w-3xl mx-auto bg-white rounded-[3rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl border border-gray-100"
                    >
                        <div className="relative w-36 h-36 flex-shrink-0">
                            <div className="absolute inset-0 flex items-end justify-center gap-1.5 opacity-20 overflow-hidden">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="w-full bg-[#2B5AE8] eq-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                            <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 vinyl-rotate relative z-10 border-4 border-white shadow-xl overflow-hidden group">
                                <img 
                                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    alt="Indie Record"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-white border-4 border-gray-100"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <h4 className="font-black text-2xl text-black">Mirror Room - Single</h4>
                            <p className="text-[#2B5AE8] font-bold">Safeplanet</p>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-8 relative">
                                <div className="bg-[#2B5AE8] h-2 rounded-full w-2/5 shadow-[0_0_10px_#2B5AE8]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold uppercase">
                                <span>01:45</span>
                                <span>04:12</span>
                            </div>
                        </div>
                        <button className="bg-[#2B5AE8] text-white p-5 rounded-full hover:scale-110 transition-transform shadow-lg">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ================= 4. CONCERT EVENT ================= */}
            <section className="relative w-full py-20 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12 px-4">
                        <h3 className="text-3xl font-black uppercase text-black">Indie <span className="text-[#2B5AE8]">Journey</span></h3>
                        <span className="text-[#2B5AE8] font-bold uppercase cursor-pointer hover:underline">See all world tour &rarr;</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { event: 'Safeplanet Odyssey', date: 'DEC 20', loc: 'Moonstar Studio', img: '1470229722913-7c090be5c57d' },
                            { event: 'Big Mountain Music', date: 'DEC 12', loc: 'Khao Yai', img: '1533174072545-e68f8ba81232' },
                            { event: 'Indie Night', date: 'JAN 05', loc: 'Voice Space', img: '1506157786151-b8491531f063' },
                            { event: 'Chiang Mai Fest', date: 'JAN 18', loc: 'Lanna House', img: '1514525253161-7a46d19cd819' }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx} 
                                whileHover={{ scale: 1.02 }}
                                className="relative rounded-[2rem] overflow-hidden group bg-white shadow-xl h-[400px] cursor-pointer"
                            >
                                <img
                                    src={`https://images.unsplash.com/photo-${item.img}?q=80&w=600&auto=format&fit=crop`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Concert"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2B5AE8] to-transparent opacity-40"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <span className="bg-[#CEFF67] text-black w-fit px-3 py-1 rounded-full text-xs font-black mb-3">{item.date}</span>
                                    <h4 className="text-2xl font-black text-white">{item.event}</h4>
                                    <p className="text-white/80 font-medium text-sm">{item.loc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATS ================= */}
            <section className="relative w-full py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-center text-2xl font-black uppercase mb-12 text-black">Indie Listening Stats</h3>
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl flex justify-between items-end h-64 md:h-80 gap-4 border border-gray-100">
                        {[
                            { month: 'Jan', s: 40, y: 55 },
                            { month: 'Feb', s: 50, y: 45 },
                            { month: 'Mar', s: 60, y: 75 },
                            { month: 'Apr', s: 80, y: 95 },
                            { month: 'May', s: 70, y: 80 }
                        ].map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                <div className="flex w-full justify-center gap-1 md:gap-3 items-end h-full">
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.s}%` }} className="w-1/3 md:w-8 bg-gray-200 rounded-t-xl" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.y}%` }} className="w-1/3 md:w-8 bg-[#2B5AE8] rounded-t-xl shadow-[0_5px_15px_rgba(43,90,232,0.3)]" />
                                </div>
                                <span className="text-gray-400 text-xs font-black uppercase mt-4">{data.month}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-24 border-t border-gray-100 pt-16 flex flex-wrap justify-center items-center gap-10 md:gap-20">
                        {['SAFEPLANET', 'DEPT', 'ANATOMY RABBIT'].map((n, i) => (
                            <motion.span 
                                key={i}
                                whileHover={{ scale: 1.1, color: '#2B5AE8' }}
                                className="text-3xl md:text-5xl font-black tracking-tighter text-black opacity-10 hover:opacity-100 cursor-default"
                            >
                                {n}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 6. BOTTOM TEXT ================= */}
            <section className="relative w-full h-[40vh] flex items-end justify-center overflow-hidden">
                <motion.h1 
                    initial={{ y: 100 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[14vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-[#2B5AE8] to-gray-200 select-none whitespace-nowrap opacity-20"
                >
                    SAFEPLANET INDIE
                </motion.h1>
            </section>

        </div>
    );
}