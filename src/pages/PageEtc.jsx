import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAllArtists, getArtistById, getSongsByArtist, getEventsByArtist } from '../api/artist';

export default function PageEtc() {
    // ================= STATE สำหรับเก็บข้อมูล =================
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= LOGIC ดึงข้อมูลศิลปิน HIP HOP / EDM =================
    useEffect(() => {
        const fetchHiphopEdmArtist = async () => {
            try {
                setLoading(true);

                // 1. กำหนด ID ของศิลปินแนว HIP HOP และ EDM อ้างอิงจากไฟล์ seed.js
                // Hip Hop: 11-15 | EDM: 21-25
                const targetArtistIds = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25];

                // 2. ดึงรายชื่อศิลปินทั้งหมด
                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];

                // 3. กรองเฉพาะศิลปินเป้าหมาย
                let targetArtists = allArtistsList.filter(a => targetArtistIds.includes(a.id));

                // Fallback: หาจากคำว่า hip hop, rap, edm, electronic
                if (targetArtists.length === 0 && allArtistsList.length > 0) {
                    targetArtists = allArtistsList.filter(a => {
                        if (!a.genres || a.genres.length === 0) return false;
                        return a.genres.some(ag => {
                            const gName = ag.genre?.name?.toLowerCase() || "";
                            return gName.includes('hip hop') || gName.includes('rap') || gName.includes('edm') || gName.includes('electronic');
                        });
                    });
                }

                let ARTIST_ID;

                // สุ่ม 1 คน
                if (targetArtists.length > 0) {
                    const randomIndex = Math.floor(Math.random() * targetArtists.length);
                    ARTIST_ID = targetArtists[randomIndex].id;
                } else if (allArtistsList.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allArtistsList.length);
                    ARTIST_ID = allArtistsList[randomIndex].id;
                } else {
                    setArtist(null);
                    setLoading(false);
                    return;
                }

                // 4. ดึงข้อมูลเชิงลึก
                const [artistData, songsData, eventsData] = await Promise.all([
                    getArtistById(ARTIST_ID).catch(() => null),
                    getSongsByArtist(ARTIST_ID).catch(() => ({ songs: [] })),
                    getEventsByArtist(ARTIST_ID).catch(() => ({ events: [] }))
                ]);

                // 5. บันทึกข้อมูล
                setArtist(artistData?.artist || artistData?.data || artistData);
                setSongs(songsData?.songs || songsData?.data || []);
                setEvents(eventsData?.events || eventsData?.data || []);

            } catch (error) {
                console.error("Error fetching artist data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHiphopEdmArtist();
    }, []);

    // สร้างละอองแสงสีฟ้าอ่อนๆ ลอยไปมา
    const floatingBlobs = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        size: Math.random() * 300 + 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
    })), []);

    // ================= หน้าจอ Loading =================
    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-[#2B5AE8] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2B5AE8] opacity-20 blur-[80px] rounded-full"></div>
                <div className="w-16 h-16 border-4 border-gray-800 border-t-[#2B5AE8] rounded-full animate-spin z-10"></div>
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Beats...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold text-xl text-[#2B5AE8]">No Artists Found.</p>
                <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#2B5AE8] selection:text-white relative">
            
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
                        className="absolute bg-[#2B5AE8] opacity-[0.08] shape-blob"
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
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 z-10 border-b border-gray-900/50">
                <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full md:w-3/4 h-[400px] md:h-[600px]"
                    >
                        {/* Frame ตกแต่ง */}
                        <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-[#2B5AE8] rounded-tl-3xl opacity-50"></div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-[#CEFF67] rounded-br-3xl opacity-50"></div>

                        {/* รูปศิลปิน */}
                        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#111]">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#2B5AE8]/20 to-transparent opacity-90"></div>

                            {/* ชื่อศิลปิน */}
                            <div className="absolute bottom-10 left-10 md:left-14 z-20">
                                <motion.h1 
                                    whileHover={{ skewX: -5 }}
                                    className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(43,90,232,0.8)] cursor-default uppercase line-clamp-2"
                                >
                                    {artist.artistName}
                                </motion.h1>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-20 mt-16 flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl"
                >
                    <div className="flex-1">
                        <h2 className="text-3xl font-black tracking-widest uppercase text-[#2B5AE8]">{artist.agency?.name || 'Exclusive Artist'}</h2>
                        <div className="flex items-center gap-4 mt-3">
                            {events.length > 0 ? (
                                <>
                                    <span className="text-white font-black text-xl">
                                        {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                    </span>
                                    <span className="w-px h-6 bg-gray-600"></span>
                                    <span className="text-gray-400 font-medium">
                                        {events[0].event?.eventName || events[0].eventName}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-500 font-medium">No upcoming tours available</span>
                            )}
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: '#2B5AE8', color: '#FFFFFF' }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#CEFF67] text-black px-12 py-4 rounded-full font-black tracking-widest uppercase text-lg shadow-[0_10px_30px_rgba(206,255,103,0.2)] border border-[#CEFF67]"
                    >
                        Get Tickets
                    </motion.button>
                </motion.div>
            </section>

            {/* ================= 2. BIO SECTION ================= */}
            <section className="relative w-full py-20 px-6 border-b border-gray-900/50">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-3">
                    <motion.h2 
                        whileHover={{ letterSpacing: '0.05em', color: '#2B5AE8' }}
                        className="text-4xl md:text-6xl font-black text-white tracking-tight cursor-default transition-all uppercase"
                    >
                        {artist.artistName}
                    </motion.h2>
                    <h2 className="text-2xl md:text-4xl font-bold text-[#2B5AE8] tracking-tight mt-4 uppercase">
                        BEATS <span className="text-gray-700 mx-2">•</span> RHYTHMS <span className="text-gray-700 mx-2">•</span> ENERGY
                    </h2>
                    <p className="text-sm md:text-base font-medium text-gray-400 tracking-widest leading-relaxed mt-6 max-w-2xl mx-auto">
                        {artist.biography || "No biography available. Drop the beat and let the music speak."}
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MEDIA ================= */}
            <section className="relative w-full py-24 px-6 overflow-hidden">
                <div className="relative z-10 max-w-5xl mx-auto">
                    <h3 className="text-center text-xl md:text-2xl font-bold tracking-[0.5em] uppercase mb-12 text-[#2B5AE8]">Top Chart</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
                        {songs.slice(0, 4).map((item, idx) => (
                            <motion.button 
                                key={idx} 
                                whileHover={{ y: -5, borderColor: '#2B5AE8' }}
                                className="border border-gray-800 bg-[#111] text-white rounded-3xl p-6 transition-all duration-300 group flex items-center gap-5 shadow-lg shadow-black/50 text-left hover:bg-[#1a1a1a]"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#2B5AE8]/20 flex items-center justify-center font-black text-2xl text-[#2B5AE8] group-hover:bg-[#2B5AE8] group-hover:text-white transition-colors">{idx + 1}</div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-xs font-black uppercase text-gray-500">Popular</span>
                                    <span className="font-bold text-lg leading-tight line-clamp-1">{item.title}</span>
                                    <span className="text-xs text-[#2B5AE8] font-bold">{item.popularity || 'Trending'} Score</span>
                                </div>
                            </motion.button>
                        ))}
                        {songs.length === 0 && (
                            <p className="text-gray-500 py-10 col-span-2 text-center border border-gray-800 bg-[#111] rounded-3xl">No songs available for this artist.</p>
                        )}
                    </div>

                    {/* Music Player */}
                    {songs.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-full max-w-3xl mx-auto bg-[#111] border border-gray-800 rounded-[3rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    >
                        <div className="relative w-36 h-36 flex-shrink-0">
                            <div className="absolute inset-0 flex items-end justify-center gap-1.5 opacity-30 overflow-hidden">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="w-full bg-[#2B5AE8] eq-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                            <div className="w-32 h-32 mx-auto rounded-full bg-black border-4 border-gray-800 vinyl-rotate relative z-10 shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden group">
                                <img 
                                    src={songs[0]?.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop"} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    alt="Record"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-[#111] border-2 border-gray-700"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <h4 className="font-black text-2xl text-white line-clamp-1">{songs[0]?.title}</h4>
                            <p className="text-[#2B5AE8] font-bold mt-1 uppercase">{artist.artistName}</p>
                            <div className="w-full bg-gray-800 rounded-full h-2 mt-8 relative">
                                <div className="bg-[#2B5AE8] h-2 rounded-full w-2/5 shadow-[0_0_10px_#2B5AE8]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold uppercase">
                                <span>01:45</span>
                                <span>04:12</span>
                            </div>
                        </div>
                        <button className="bg-[#2B5AE8] text-white p-5 rounded-full hover:scale-110 transition-transform shadow-[0_5px_20px_rgba(43,90,232,0.4)]">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                        </button>
                    </motion.div>
                    )}
                </div>
            </section>

            {/* ================= 4. CONCERT EVENT ================= */}
            <section className="relative w-full py-20 px-6 bg-black/40 border-y border-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12 px-4">
                        <h3 className="text-3xl font-black uppercase text-white">Live <span className="text-[#2B5AE8]">Journey</span></h3>
                        <span className="text-[#2B5AE8] font-bold uppercase cursor-pointer hover:text-white transition-colors text-sm">See all events &rarr;</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.slice(0, 4).map((item, idx) => {
                            const evt = item.event || item; 
                            return (
                            <motion.div 
                                key={idx} 
                                whileHover={{ scale: 1.02 }}
                                className="relative rounded-[2rem] overflow-hidden group bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-gray-800 h-[400px] cursor-pointer"
                            >
                                <img
                                    src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                                    alt="Concert"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent opacity-90"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <span className="bg-[#CEFF67] text-black w-fit px-3 py-1 rounded-full text-[10px] font-black mb-3 tracking-widest uppercase">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    <h4 className="text-2xl font-black text-white line-clamp-2">{evt.eventName}</h4>
                                    <p className="text-gray-400 font-medium text-sm mt-2">{evt.venue?.name || "TBA"}</p>
                                </div>
                            </motion.div>
                        )})}
                        {events.length === 0 && (
                            <p className="text-gray-500 py-10 col-span-4 text-center">No upcoming events scheduled.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATS ================= */}
            <section className="relative w-full py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-center text-2xl font-black uppercase mb-12 text-white tracking-widest">Streaming Stats</h3>
                    <div className="bg-[#111] border border-gray-800 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-end h-64 md:h-80 gap-4">
                        {[
                            { month: 'Jan', s: 40, y: 55 },
                            { month: 'Feb', s: 50, y: 45 },
                            { month: 'Mar', s: 60, y: 75 },
                            { month: 'Apr', s: 80, y: 95 },
                            { month: 'May', s: 70, y: 80 }
                        ].map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                <div className="flex w-full justify-center gap-1 md:gap-3 items-end h-full">
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.s}%` }} className="w-1/3 md:w-8 bg-gray-700 rounded-t-xl" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.y}%` }} className="w-1/3 md:w-8 bg-[#2B5AE8] rounded-t-xl shadow-[0_5px_15px_rgba(43,90,232,0.3)]" />
                                </div>
                                <span className="text-gray-500 text-xs font-black uppercase mt-4">{data.month}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-24 border-t border-gray-800 pt-16 flex flex-wrap justify-center items-center gap-10 md:gap-20">
                        {['HIP HOP', 'EDM', 'TRAP', 'ELECTRONIC'].map((n, i) => (
                            <motion.span 
                                key={i}
                                whileHover={{ scale: 1.1, color: '#2B5AE8' }}
                                className="text-3xl md:text-5xl font-black tracking-tighter text-white opacity-10 hover:opacity-100 cursor-default transition-opacity duration-300"
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
                    className="text-[12vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-[#2B5AE8] to-gray-800 select-none whitespace-nowrap opacity-40 uppercase"
                >
                    {artist.artistName}
                </motion.h1>
            </section>

        </div>
    );
}