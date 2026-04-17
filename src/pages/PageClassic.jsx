import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getAllArtists, getArtistById, getSongsByArtist, getEventsByArtist } from '../api/artist';

export default function PageElliot() {
    // ================= STATE สำหรับเก็บข้อมูล Backend =================
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= LOGIC ดึงข้อมูลศิลปิน R&B =================
    useEffect(() => {
        const fetchRandomRnBArtist = async () => {
            try {
                setLoading(true);

                // 1. กำหนด ID ของศิลปินแนว R&B อ้างอิงจากไฟล์ seed.js
                // 16=The Weeknd, 17=Jeff Satur, 18=SZA, 19=NIKI, 20=BOWKYLION
                const rnbArtistIds = [16, 17, 18, 19, 20];

                // 2. ดึงรายชื่อศิลปินทั้งหมด
                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];

                // 3. กรองเฉพาะศิลปิน R&B
                let rnbArtists = allArtistsList.filter(a => rnbArtistIds.includes(a.id));

                // Fallback: หาจากคำว่า R&B หรือ r&b
                if (rnbArtists.length === 0 && allArtistsList.length > 0) {
                    rnbArtists = allArtistsList.filter(a => {
                        if (!a.genres || a.genres.length === 0) return false;
                        return a.genres.some(ag => {
                            const gName = ag.genre?.name?.toLowerCase() || "";
                            return gName.includes('r&b') || gName.includes('rnb');
                        });
                    });
                }

                let ARTIST_ID;

                // สุ่ม 1 คน
                if (rnbArtists.length > 0) {
                    const randomIndex = Math.floor(Math.random() * rnbArtists.length);
                    ARTIST_ID = rnbArtists[randomIndex].id;
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
                console.error("Error fetching R&B artist data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomRnBArtist();
    }, []);

    // สร้างข้อมูลหิ่งห้อย (Fireflies) 40 ตัว
    const fireflies = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1, // ขนาด 1px - 5px
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 15 + 10, // ความเร็วในการบิน
        delay: Math.random() * 10,
    })), []);

    // ================= หน้าจอ Loading =================
    if (loading) {
        return (
            <div className="bg-[#0F172A] min-h-screen flex flex-col items-center justify-center text-[#D4AF37]">
                <div className="w-16 h-16 border-4 border-[#1e293b] border-t-[#D4AF37] rounded-full animate-spin"></div>
                <p className="mt-4 font-serif italic tracking-widest animate-pulse text-white uppercase">Summoning R&B Soul...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#0F172A] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold font-serif text-xl text-[#D4AF37] uppercase">No R&B Artists Found.</p>
                <p className="text-gray-500 mt-2 font-serif">Please run seed to inject data into database.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0F172A] min-h-screen text-[#FFFFFF] font-serif overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
            
            {/* ================= STYLE: CLASSIC TEXTURES ================= */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Cormorant+Garamond:wght@300;600&display=swap');
                
                .font-classic { font-family: 'Playfair Display', serif; }
                .font-sub { font-family: 'Cormorant Garamond', serif; }

                /* พื้นผิวกระดาษเก่า (Grain Texture) */
                .classic-grain {
                    position: fixed;
                    inset: 0;
                    opacity: 0.04;
                    pointer-events: none;
                    z-index: 1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                .vinyl-record {
                    background: repeating-radial-gradient(circle, #111, #111 2px, #1a1a1a 3px, #111 4px);
                    border: 2px solid #222;
                }

                /* เงาเรืองแสงของหิ่งห้อย */
                .firefly-glow {
                    box-shadow: 0 0 10px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.4);
                }
            `}</style>

            {/* ================= BACKGROUND & FIREFLIES LAYER ================= */}
            <div className="classic-grain" />
            
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Ambient Lights */}
                <motion.div 
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] blur-[150px]"
                />
                
                {/* FIREFLIES ANIMATION */}
                {fireflies.map(f => (
                    <motion.div
                        key={f.id}
                        className="absolute bg-[#D4AF37] rounded-full firefly-glow"
                        style={{ 
                            width: f.size, 
                            height: f.size, 
                            left: `${f.initialX}%`, 
                            top: `${f.initialY}%` 
                        }}
                        animate={{ 
                            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            opacity: [0, 0.7, 0.2, 0.8, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ 
                            duration: f.duration, 
                            delay: f.delay, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    />
                ))}
            </div>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10">
                <div className="relative w-full max-w-7xl mx-auto flex flex-col items-start gap-12">
                    
                    <div className="relative w-full flex flex-col md:flex-row items-center gap-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="w-full md:w-1/2"
                        >
                            <span className="text-[#D4AF37] font-sub tracking-[0.5em] text-sm md:text-lg mb-4 block uppercase">
                                {artist.agency?.name || "The Voice of an Era"}
                            </span>
                            <h1 className="text-5xl md:text-[6rem] lg:text-[7.5rem] font-classic font-black leading-[0.85] text-white uppercase break-words">
                                {artist.artistName}
                            </h1>
                        </motion.div>

                        <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                            <div className="relative w-[70%] aspect-[3/4] border border-[#D4AF37]/20 rounded-sm translate-x-10 translate-y-10 opacity-30" />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-sm overflow-hidden border-[12px] border-[#1e293b] shadow-2xl"
                            >
                                <img
                                    src={artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"}
                                    alt={artist.artistName}
                                    className="w-full h-full object-cover grayscale-[20%] sepia-[10%] brightness-90 hover:scale-105 transition-transform duration-[5s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-full max-w-5xl mt-20 flex flex-col md:flex-row items-center justify-between border-y border-[#D4AF37]/20 py-10 bg-white/[0.02] backdrop-blur-sm px-6 rounded-sm"
                    >
                        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                            <h2 className="font-sub tracking-[0.3em] text-[#D4AF37] text-xl uppercase">UPCOMING TOUR</h2>
                            {events.length > 0 ? (
                                <p className="font-classic italic text-2xl text-gray-300 mt-2">
                                    {events[0].event?.eventName || events[0].eventName} — {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            ) : (
                                <p className="font-classic italic text-2xl text-gray-500 mt-2">More dates to be announced</p>
                            )}
                        </div>
                        <motion.button 
                            whileHover={{ backgroundColor: "#D4AF37", color: "#000" }}
                            className="border border-[#D4AF37] text-[#D4AF37] px-12 py-4 rounded-full font-classic tracking-widest text-sm transition-all"
                        >
                            RESERVE TICKETS
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ================= 2. LINEUP / ARTIST INFO ================= */}
            <section className="relative w-full py-32 px-6 border-y border-[#D4AF37]/10">
                <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-3xl md:text-5xl font-classic italic text-white leading-relaxed"
                    >
                        "{artist.biography ? artist.biography : 'A Voice that Echoes through Time'}"
                    </motion.h2>
                    <p className="font-sub text-xl md:text-3xl text-gray-400 font-light leading-relaxed italic">
                        Classic Soul <span className="text-[#D4AF37] mx-4">|</span> R&B Heritage <span className="text-[#D4AF37] mx-4">|</span> Modern Elegance
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MUSIC PLAYER ================= */}
            <section className="relative w-full py-24 px-6 bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-center font-classic text-3xl md:text-4xl text-[#D4AF37] mb-20 tracking-widest uppercase">The Essential Selection</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                        {songs.slice(0, 4).map((item, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ x: 10 }}
                                className="flex items-center gap-6 border-b border-gray-800 pb-6 group cursor-pointer"
                            >
                                <span className="font-classic text-2xl text-gray-700 group-hover:text-[#D4AF37] transition-colors italic">0{idx + 1}</span>
                                <div>
                                    <h4 className="font-classic text-xl text-white uppercase tracking-wider line-clamp-1">{item.title}</h4>
                                    <p className="font-sub text-[#D4AF37] italic">{item.popularity ? `${item.popularity} Popularity` : 'The Soul Session'}</p>
                                </div>
                            </motion.div>
                        ))}
                        {songs.length === 0 && (
                            <p className="text-gray-500 font-classic italic col-span-2 text-center py-10">No tracks available at the moment.</p>
                        )}
                    </div>

                    {songs.length > 0 && (
                    <div className="w-full max-w-4xl mx-auto bg-[#1e293b]/40 border border-[#D4AF37]/10 p-10 rounded-sm flex flex-col md:flex-row items-center gap-12">
                        <div className="relative">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="w-48 h-48 rounded-full vinyl-record flex items-center justify-center shadow-2xl relative overflow-hidden"
                            >
                                {/* รูปปกแผ่นเสียงไวนิล */}
                                <img 
                                    src={songs[0]?.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=200&auto=format&fit=crop"} 
                                    alt="Vinyl Cover" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                                />
                                <div className="w-16 h-16 rounded-full bg-[#222] border-2 border-[#D4AF37]/40 flex items-center justify-center relative z-10">
                                    <div className="w-3 h-3 rounded-full bg-black" />
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex-1 w-full">
                            <span className="text-[#D4AF37] font-sub tracking-widest uppercase text-xs">Currently Playing</span>
                            <h4 className="font-classic text-3xl text-white mt-2 line-clamp-1">{songs[0]?.title}</h4>
                            <div className="w-full bg-gray-800 h-px mt-8 relative">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '40%' }}
                                    className="absolute inset-0 bg-[#D4AF37]" 
                                />
                            </div>
                            <div className="flex justify-between font-sub text-gray-500 mt-3 text-sm tracking-widest">
                                <span>01:42</span>
                                <span>03:58</span>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* ================= 4. LIVE CONCERTS ================= */}
            <section className="relative w-full py-32 px-6 bg-[#0a0f1d]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                        <h3 className="font-classic text-4xl md:text-6xl text-white">Live <br/> <span className="text-[#D4AF37] italic">Performances</span></h3>
                        <p className="font-sub text-gray-500 max-w-sm mt-6 md:mt-0 italic">Timeless atmosphere live in concert.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                        {events.slice(0, 4).map((item, idx) => {
                            const evt = item.event || item; 
                            return (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="relative aspect-[3/4] overflow-hidden group cursor-pointer bg-black border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors"
                            >
                                <img 
                                    src={evt.posterImage || "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=600&auto=format&fit=crop"} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className="text-[#D4AF37] font-sub text-sm tracking-widest">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                    </span>
                                    <h4 className="font-classic text-2xl text-white uppercase line-clamp-1 mt-1">{evt.eventName}</h4>
                                    <p className="text-gray-400 font-sub italic text-sm mt-1">{evt.venue?.name || "Venue TBA"}</p>
                                </div>
                            </motion.div>
                        )})}
                        {events.length === 0 && (
                            <p className="text-gray-500 font-classic italic col-span-4 text-center py-10">No live performances scheduled.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATISTICS ================= */}
            <section className="relative w-full py-32 px-6 bg-[#111111]">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-center font-classic text-3xl text-white mb-20 tracking-widest uppercase">Digital Reach</h3>
                    <div className="flex justify-between items-end h-64 gap-6 md:gap-12 border-b border-gray-800 pb-4">
                        {[
                            { m: 'JAN', s: 45, y: 30 },
                            { m: 'FEB', s: 65, y: 40 },
                            { m: 'MAR', s: 55, y: 70 },
                            { m: 'APR', s: 85, y: 90 },
                            { m: 'MAY', s: 75, y: 100 }
                        ].map((data, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                                <div className="w-full flex items-end justify-center gap-2 h-full">
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.s}%` }} className="w-full max-w-[15px] bg-gray-700 rounded-t-sm" />
                                    <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.y}%` }} className="w-full max-w-[15px] bg-[#D4AF37] rounded-t-sm shadow-[0_0_15px_#D4AF37]" />
                                </div>
                                <span className="font-sub text-gray-500 text-xs tracking-widest">{data.m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 6. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[40vh] flex items-end justify-center overflow-hidden bg-gradient-to-t from-[#D4AF37]/10 to-transparent">
                <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 0.15 }}
                    className="text-[12vw] font-classic font-black text-white whitespace-nowrap tracking-tighter select-none uppercase"
                >
                    {artist.artistName}
                </motion.h1>
            </section>
        </div>
    );
}