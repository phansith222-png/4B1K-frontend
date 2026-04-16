import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useContentStore from '../stores/contentStore';

export default function AllArtist() {
    const [hoveredArtist, setHoveredArtist] = useState(null);
    const { artists, getAllArtists } = useContentStore();

    console.log('artists', artists)
    useEffect(()=>{
        getAllArtists()
    },[getAllArtists])

    const sections = useMemo(() => {
        if (!artists || artists.length === 0) return [];

        // 1. แปลงข้อมูลจาก Backend ให้เข้ากับ Format ของ UI Card
        const formattedArtists = artists.map(a => ({
            id: a.id,
            name: a.artistName,
            // ดึงชื่อค่ายจาก Agency Object ที่ include มา
            sub: a.agency?.name || "Independent", 
            // ดึงชื่อเพลงที่ฮิตที่สุดจาก Songs Array (ที่เราเอามาแค่ 1 เพลง)
            song: a.songs?.[0]?.title || "Listen Now", 
            // ดึงรายชื่อแนวเพลงออกมาเป็น Array ของ String เช่น ["Pop", "R&B"]
            genres: a.genres ? a.genres.map(g => g.genre.name) : [],
            // รูปโปรไฟล์ (พร้อม Fallback)
            img: a.profileImage || `https://picsum.photos/seed/${a.id}/800/1000` 
        }));

        // 2. จัดกลุ่มศิลปินลงหมวดหมู่ตามข้อมูล Genre จริงใน Database
        return [
            {
                title: "POP & R&B",
                primary: "#FF007F",
                secondary: "#00F5D4",
                desc: "The mainstream phenomenon shaping the sound of modern youth.",
                // กรองศิลปินที่มีแนวเพลง Pop หรือ R&B อยู่ในตัว
                artists: formattedArtists.filter(a => 
                    a.genres.includes("Pop") || a.genres.includes("R&B")
                ).slice(0, 6)
            },
            {
                title: "ROCK ARENA",
                primary: "#D3131F",
                secondary: "#8D99AE",
                desc: "Raw energy, distortion, and the voices that echo through stadiums.",
                artists: formattedArtists.filter(a => a.genres.includes("Rock")).slice(0, 6)
            },
            {
                title: "HIP HOP & RAP",
                primary: "#2B5AE8",
                secondary: "#CEFF67",
                desc: "Independent spirits exploring uncharted territories of sound.",
                artists: formattedArtists.filter(a => a.genres.includes("Hip Hop")).slice(0, 6)
            },
            {
                title: "EDM FESTIVAL",
                primary: "#D4AF37",
                secondary: "#FFFFFF",
                desc: "Timeless melodies and the golden heritage of musical artistry.",
                artists: formattedArtists.filter(a => a.genres.includes("EDM")).slice(0, 6)
            }
        ];
    }, [artists]);
    // ข้อมูลศิลปิน พร้อมโทนสีที่แยกตามแนวเพลง
    // const sections = [
    //     {
    //         title: "POP & IDOLS",
    //         primary: "#FF007F",
    //         secondary: "#00F5D4",
    //         desc: "The mainstream phenomenon shaping the sound of modern youth.",
    //         artists: [
    //             { name: "4EVE", sub: "XOXO Entertainment", song: "Hot 2 Hot", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800" },
    //             { name: "Ink Waruntorn", sub: "Boxx Music", song: "Last Train", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800" },
    //             { name: "No One Else", sub: "SpicyDisc", song: "I Think They Call This Love", img: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646a?q=80&w=800" },
    //             { name: "Atlas", sub: "XOXO Entertainment", song: "Lola", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800" },
    //             { name: "PiXXiE", sub: "LIT Entertainment", song: "De Javu", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800" },
    //             { name: "Jeff Satur", sub: "Wayfer Records", song: "Ghost", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800" }
    //         ]
    //     },
    //     {
    //         title: "ROCK ARENA",
    //         primary: "#D3131F",
    //         secondary: "#8D99AE",
    //         desc: "Raw energy, distortion, and the voices that echo through stadiums.",
    //         artists: [
    //             { name: "Three Man Down", sub: "Gene Lab", song: "ฝนตกไหม", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=800" },
    //             { name: "Tilly Birds", sub: "Gene Lab", song: "ถ้าเราเจอกันอีก", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800" },
    //             { name: "Cocktail", sub: "Gene Lab", song: "เธอ", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800" },
    //             { name: "Lomosonic", sub: "Me Records", song: "ขอ", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800" },
    //             { name: "Potato", sub: "Genie Records", song: "รักเธอไปทุกวัน", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800" },
    //             { name: "Bodyslam", sub: "Genie Records", song: "ขอบฟ้า", img: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646a?q=80&w=800" }
    //         ]
    //     },
    //     {
    //         title: "INDIE JOURNEY",
    //         primary: "#2B5AE8",
    //         secondary: "#CEFF67",
    //         desc: "Independent spirits exploring uncharted territories of sound.",
    //         artists: [
    //             { name: "Safeplanet", sub: "Independent", song: "ห้องกระจก", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800" },
    //             { name: "Dept", sub: "Smallroom", song: "17", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800" },
    //             { name: "Anatomy Rabbit", sub: "Independent", song: "ธรรมดาแสนพิเศษ", img: "https://images.unsplash.com/photo-1533174072545-e68f8ba81232?q=80&w=800" },
    //             { name: "Tattoo Colour", sub: "Smallroom", song: "จำทำไม", img: "https://images.unsplash.com/photo-1470229722913-7c090be5c57d?q=80&w=800" },
    //             { name: "Polycat", sub: "Smallroom", song: "พบกันใหม่?", img: "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=800" },
    //             { name: "Scrubb", sub: "Independent", song: "ทุกอย่าง", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800" }
    //         ]
    //     },
    //     {
    //         title: "CLASSIC & SOUL",
    //         primary: "#D4AF37",
    //         secondary: "#FFFFFF",
    //         desc: "Timeless melodies and the golden heritage of musical artistry.",
    //         artists: [
    //             { name: "Stamp Apiwat", sub: "123Records", song: "ความคิด", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800" },
    //             { name: "Burin Boonvisut", sub: "Muzik Move", song: "หยุด", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800" },
    //             { name: "Singto Numchok", sub: "Independent", song: "อยู่ต่อเลยได้ไหม", img: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646a?q=80&w=800" },
    //             { name: "Atom", sub: "White Music", song: "อ้าว", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800" },
    //             { name: "Pop Pongkool", sub: "White Music", song: "ปล่อย", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=800" },
    //             { name: "Lula", sub: "White Music", song: "เรื่องที่ขอ", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800" }
    //         ]
    //     }
    // ];

    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden relative">
            
            {/* เรียกใช้ Class พื้นหลังกระดาษที่อยู่ใน index.css */}
            <div className="dark-grain" />

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-24 px-6 overflow-hidden">
                {/* เรียกใช้ Class แสงฟุ้งๆ ที่อยู่ใน index.css */}
                <div className="mesh-gradient"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        className="w-full flex justify-between items-end mb-16 border-b border-white/10 pb-6 hidden md:flex"
                    >
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Issue 04 • Vol 2026</span>
                        <div className="flex gap-4">
                            <span className="bg-[#2B5AE8]/10 text-[#2B5AE8] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-[#2B5AE8]/30">Exclusive</span>
                            <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-[#D4AF37]/30">Directory</span>
                        </div>
                    </motion.div>
                    
                    <div className="text-center">
                        <motion.span 
                            initial={{ opacity: 0, letterSpacing: "0px" }} animate={{ opacity: 1, letterSpacing: "8px" }} transition={{ duration: 1, delay: 0.2 }}
                            className="text-[#00E5FF] font-black text-sm uppercase block mb-6"
                        >
                            The Complete Artists Archive
                        </motion.span>

                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-6xl md:text-[11rem] font-black italic tracking-tighter leading-[0.85] mb-8"
                        >
                            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] via-[#2B5AE8] to-[#00E5FF] relative">VOICES<div className="absolute bottom-2 left-0 w-full h-3 bg-[#FF007F]/40 -z-10 blur-md"></div></span> <br/> OF SIAM
                        </motion.h1>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-start text-left max-w-4xl mx-auto mt-16">
                            <motion.p 
                                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.7, x: 0 }} transition={{ delay: 0.6 }}
                                className="text-sm md:text-base font-medium uppercase tracking-widest border-l-2 border-[#FF007F] pl-4"
                            >
                                From the mainstream pop idols dominating the charts to the underground indie bands shaping the subculture.
                            </motion.p>
                            <motion.p 
                                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 0.7, x: 0 }} transition={{ delay: 0.8 }}
                                className="text-sm md:text-base font-medium uppercase tracking-widest border-l-2 border-[#2B5AE8] pl-4"
                            >
                                A curated directory featuring over 100+ active artists, bands, and vocalists across all major labels.
                            </motion.p>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Scroll to Explore</span>
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-12 bg-gradient-to-b from-[#FFFFFF] to-transparent"></motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Loading State ถ้าข้อมูลยังไม่มา */}
            {sections.length === 0 && (
                <div className="min-h-[50vh] flex items-center justify-center">
                    <span className="w-12 h-12 border-4 border-white/20 border-t-[#00E5FF] rounded-full animate-spin"></span>
                </div>
            )}

            {/* ================= ARTIST SECTIONS ================= */}
            {sections.map((section, sIdx) => (
                <section key={sIdx} className="relative w-full py-24 border-t border-white/5 overflow-hidden">
                    
                    {/* ====== SECTION BACKGROUND ANIMATIONS ====== */}
                    {sIdx === 0 && (
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                            <motion.div animate={{ y: [-40, 40, -40], x: [0, 60, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full blur-[100px]" style={{ backgroundColor: section.primary }} />
                            <motion.div animate={{ y: [40, -40, 40], x: [0, -60, 0], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full blur-[120px] opacity-70" style={{ backgroundColor: section.secondary }} />
                        </div>
                    )}
                    {sIdx === 1 && (
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                            {[...Array(10)].map((_, i) => (
                                <motion.div 
                                    key={i} animate={{ x: ['-100%', '200%'], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: Math.random() * 1 + 0.5, delay: Math.random() * 2, ease: "linear" }} 
                                    className="absolute h-[3px] w-1/2" style={{ top: `${(i + 1) * 10}%`, background: `linear-gradient(90deg, transparent, ${i%2===0 ? section.primary : section.secondary}, transparent)` }} 
                                />
                            ))}
                            <motion.div animate={{ opacity: [0.05, 0.2, 0.05] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${section.primary}30 0%, transparent 70%)` }} />
                        </div>
                    )}
                    {sIdx === 2 && (
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                            <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-[20%] right-[20%] w-[500px] h-[500px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[120px]" style={{ backgroundColor: section.primary }} />
                            <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-[100px]" style={{ backgroundColor: section.secondary }} />
                        </div>
                    )}
                    {sIdx === 3 && (
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                            {[...Array(30)].map((_, i) => (
                                <motion.div 
                                    key={i} animate={{ y: [0, -300], opacity: [0, 0.8, 0], x: Math.sin(i) * 50 }} transition={{ repeat: Infinity, duration: Math.random() * 6 + 4, delay: Math.random() * 5, ease: "linear" }} 
                                    className="absolute w-2 h-2 rounded-full" style={{ top: `${Math.random() * 100 + 50}%`, left: `${Math.random() * 100}%`, backgroundColor: section.primary, boxShadow: `0 0 10px ${section.primary}` }} 
                                />
                            ))}
                            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom, ${section.primary}10 0%, transparent 60%)` }} />
                        </div>
                    )}

                    <div className="relative z-10 px-6 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                            <div className="border-l-8 pl-8 transition-all" style={{ borderColor: section.primary }}>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase" style={{ color: section.primary, textShadow: `0 0 30px ${section.primary}40` }}>
                                    {section.title}
                                </h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest mt-3 text-sm">{section.desc}</p>
                            </div>
                            <motion.button whileHover={{ scale: 1.05, backgroundColor: section.primary, color: '#0B0C10', borderColor: section.primary }} className="text-white text-xs font-black border border-white/20 px-8 py-3 rounded-full uppercase tracking-[0.2em] transition-all hidden md:block">
                                Explore Category
                            </motion.button>
                        </div>

                        {/* Grid 3 Columns x 2 Rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                            {section.artists.map((artist, aIdx) => (
                                <motion.div
                                    key={artist.id}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (aIdx % 3) * 0.1 }}
                                    onMouseEnter={() => setHoveredArtist(artist.id)}
                                    onMouseLeave={() => setHoveredArtist(null)}
                                    className="flex flex-col gap-5 group"
                                >
                                    {/* Card Frame */}
                                    <div 
                                        className="relative aspect-[4/5] rounded-[2rem] overflow-hidden glass-card transition-all duration-500" 
                                        style={{ 
                                            boxShadow: hoveredArtist === artist.id ? `0 20px 50px ${section.primary}30` : 'none',
                                            borderColor: hoveredArtist === artist.id ? `${section.primary}50` : 'rgba(255, 255, 255, 0.05)'
                                        }}
                                    >
                                        <img 
                                            src={artist.img} 
                                            alt={artist.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/40 to-transparent opacity-90" />
                                        
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-20 pointer-events-none">
                                            <span 
                                                className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 px-3 py-1 rounded-sm w-fit backdrop-blur-md" 
                                                style={{ color: (sIdx === 2 || sIdx === 3) ? '#0B0C10' : '#FFFFFF', backgroundColor: section.primary }}
                                            >
                                                {artist.sub}
                                            </span>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white line-clamp-2">{artist.name}</h3>
                                        </div>

                                        {/* Hover Play Overlay */}
                                        <AnimatePresence>
                                            {hoveredArtist === artist.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10"
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl bg-white/10 border border-white/20 backdrop-blur-lg cursor-pointer hover:bg-white/30 transition-colors"
                                                    >
                                                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" transform="rotate(-90 10 10)"/></svg>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Mini Player UI */}
                                    <div className="px-2 flex flex-col gap-3 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Featured Info</span>
                                                <span className="text-sm font-black text-gray-200 uppercase tracking-tight">{artist.song}</span>
                                            </div>
                                            <button 
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors"
                                                style={{ 
                                                    backgroundColor: hoveredArtist === artist.id ? section.primary : 'rgba(255,255,255,0.05)',
                                                    color: hoveredArtist === artist.id && (sIdx === 2 || sIdx === 3) ? '#0B0C10' : '#FFFFFF'
                                                }}
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                                            </button>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }} whileInView={{ width: hoveredArtist === artist.id ? "80%" : "20%" }}
                                                className="h-full rounded-full transition-all duration-500" 
                                                style={{ backgroundColor: section.primary }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* ================= INDUSTRY STATS ================= */}
            <section className="relative z-10 py-32 px-6 max-w-5xl mx-auto border-t border-white/5">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    className="bg-[#12141a] rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#2B5AE810] blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF007F10] blur-[80px]" />
                    
                    <h3 className="text-center text-3xl md:text-5xl font-black uppercase mb-16 tracking-tighter">
                        Streaming <span className="text-[#00E5FF]">Analytics</span>
                    </h3>

                    <div className="flex justify-between items-end h-[300px] gap-2 md:gap-8 border-b border-white/10 pb-4 relative z-10">
                        {[
                            { label: "POP", val: 85, color: "#FF007F" },
                            { label: "ROCK", val: 65, color: "#D3131F" },
                            { label: "INDIE", val: 45, color: "#2B5AE8" },
                            { label: "HIPHOP", val: 75, color: "#00E5FF" },
                            { label: "CLASSIC", val: 35, color: "#D4AF37" }
                        ].map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                                <motion.div
                                    initial={{ height: 0 }} whileInView={{ height: `${stat.val}%` }} viewport={{ once: true }}
                                    className="w-full md:w-16 rounded-t-xl relative cursor-crosshair transition-all"
                                    style={{ backgroundColor: stat.color, boxShadow: `0 0 20px ${stat.color}20` }}
                                    whileHover={{ brightness: 1.2, scaleY: 1.05, transformOrigin: 'bottom' }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-white text-black px-2 py-1 rounded shadow-lg">
                                        {stat.val}%
                                    </div>
                                </motion.div>
                                <span className="text-gray-500 text-[10px] font-black uppercase mt-4 tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ================= BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] flex items-end justify-center overflow-hidden pointer-events-none bg-gradient-to-t from-[#00E5FF]/5 to-transparent">
                <motion.h1 
                    initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 0.1 }} transition={{ duration: 1.2, ease: "circOut" }}
                    className="text-[14vw] font-black text-white whitespace-nowrap tracking-tighter leading-none mb-[-3vw]"
                >
                    ARTISTS ARCHIVE
                </motion.h1>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="relative z-10 py-16 text-center border-t border-white/5 bg-black">
                <div className="flex justify-center gap-12 text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                    <motion.a whileHover={{ color: "#00E5FF", y: -2 }} href="#" className="transition-all">Labels</motion.a>
                    <motion.a whileHover={{ color: "#7000FF", y: -2 }} href="#" className="transition-all">Charts</motion.a>
                    <motion.a whileHover={{ color: "#FF00FF", y: -2 }} href="#" className="transition-all">Tickets</motion.a>
                </div>
            </footer>
        </div>
        // <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden relative">
            
        //     {/* ================= STYLE ================= */}
        //     <style>{`
        //         .glass-card {
        //             background: rgba(255, 255, 255, 0.02);
        //             backdrop-filter: blur(10px);
        //             border: 1px solid rgba(255, 255, 255, 0.05);
        //         }
                
        //         /* Main Hero Mesh Gradient (รวมทุกสี) */
        //         .mesh-gradient {
        //             position: absolute; inset: 0; z-index: 0;
        //             background: 
        //                 radial-gradient(circle at var(--x1, 20%) var(--y1, 20%), rgba(255, 0, 127, 0.15) 0%, transparent 40%),
        //                 radial-gradient(circle at var(--x2, 80%) var(--y2, 80%), rgba(43, 90, 232, 0.15) 0%, transparent 40%),
        //                 radial-gradient(circle at var(--x3, 50%) var(--y3, 50%), rgba(212, 175, 55, 0.1) 0%, transparent 50%),
        //                 radial-gradient(circle at var(--x4, 20%) var(--y4, 80%), rgba(211, 19, 31, 0.15) 0%, transparent 40%);
        //             filter: blur(60px);
        //             animation: mesh-move 20s ease-in-out infinite alternate;
        //         }

        //         @keyframes mesh-move {
        //             0% { --x1: 20%; --y1: 20%; --x2: 80%; --y2: 80%; --x3: 50%; --y3: 50%; --x4: 20%; --y4: 80%; }
        //             33% { --x1: 80%; --y1: 20%; --x2: 20%; --y2: 80%; --x3: 50%; --y3: 20%; --x4: 80%; --y4: 20%; }
        //             66% { --x1: 80%; --y1: 80%; --x2: 20%; --y2: 20%; --x3: 20%; --y3: 50%; --x4: 50%; --y4: 80%; }
        //             100% { --x1: 20%; --y1: 20%; --x2: 80%; --y2: 80%; --x3: 50%; --y3: 50%; --x4: 20%; --y4: 80%; }
        //         }

        //         /* Noise Texture พื้นหลังดำ */
        //         .dark-grain {
        //             position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 100;
        //             background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        //         }
        //     `}</style>

        //     <div className="dark-grain" />

        //     {/* ================= 1. HERO SECTION ================= */}
        //     <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-24 px-6 overflow-hidden">
        //         <div className="mesh-gradient"></div>

        //         <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    
        //             <motion.div
        //                 initial={{ opacity: 0, y: 20 }}
        //                 animate={{ opacity: 1, y: 0 }}
        //                 transition={{ duration: 0.8 }}
        //                 className="w-full flex justify-between items-end mb-16 border-b border-white/10 pb-6 hidden md:flex"
        //             >
        //                 <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Issue 04 • Vol 2026</span>
        //                 <div className="flex gap-4">
        //                     <span className="bg-[#2B5AE8]/10 text-[#2B5AE8] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-[#2B5AE8]/30">Exclusive</span>
        //                     <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-[#D4AF37]/30">Directory</span>
        //                 </div>
        //             </motion.div>
                    
        //             <div className="text-center">
        //                 <motion.span 
        //                     initial={{ opacity: 0, letterSpacing: "0px" }}
        //                     animate={{ opacity: 1, letterSpacing: "8px" }}
        //                     transition={{ duration: 1, delay: 0.2 }}
        //                     className="text-[#00E5FF] font-black text-sm uppercase block mb-6"
        //                 >
        //                     The Complete Artists Archive
        //                 </motion.span>

        //                 <motion.h1 
        //                     initial={{ opacity: 0, scale: 0.9 }}
        //                     animate={{ opacity: 1, scale: 1 }}
        //                     transition={{ duration: 0.8, ease: "easeOut" }}
        //                     className="text-6xl md:text-[11rem] font-black italic tracking-tighter leading-[0.85] mb-8"
        //                 >
        //                     THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] via-[#2B5AE8] to-[#00E5FF] relative">VOICES<div className="absolute bottom-2 left-0 w-full h-3 bg-[#FF007F]/40 -z-10 blur-md"></div></span> <br/> OF SIAM
        //                 </motion.h1>

        //                 <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-start text-left max-w-4xl mx-auto mt-16">
        //                     <motion.p 
        //                         initial={{ opacity: 0, x: -30 }}
        //                         animate={{ opacity: 0.7, x: 0 }}
        //                         transition={{ delay: 0.6 }}
        //                         className="text-sm md:text-base font-medium uppercase tracking-widest border-l-2 border-[#FF007F] pl-4"
        //                     >
        //                         From the mainstream pop idols dominating the charts to the underground indie bands shaping the subculture.
        //                     </motion.p>
        //                     <motion.p 
        //                         initial={{ opacity: 0, x: 30 }}
        //                         animate={{ opacity: 0.7, x: 0 }}
        //                         transition={{ delay: 0.8 }}
        //                         className="text-sm md:text-base font-medium uppercase tracking-widest border-l-2 border-[#2B5AE8] pl-4"
        //                     >
        //                         A curated directory featuring over 100+ active artists, bands, and vocalists across all major labels.
        //                     </motion.p>
        //                 </div>
        //             </div>

        //             <motion.div 
        //                 initial={{ opacity: 0 }}
        //                 animate={{ opacity: 1 }}
        //                 transition={{ delay: 1.5, duration: 1 }}
        //                 className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        //             >
        //                 <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">Scroll to Explore</span>
        //                 <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-12 bg-gradient-to-b from-[#FFFFFF] to-transparent"></motion.div>
        //             </motion.div>
        //         </div>
        //     </section>

        //     {/* ================= ARTIST SECTIONS (4 Genres x 6 Artists) ================= */}
        //     {sections.map((section, sIdx) => (
        //         <section key={sIdx} className="relative w-full py-24 border-t border-white/5 overflow-hidden">
                    
        //             {/* ====== SECTION BACKGROUND ANIMATIONS ====== */}
        //             {sIdx === 0 && ( /* POP - Floating Neon Orbs */
        //                 <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        //                     <motion.div animate={{ y: [-40, 40, -40], x: [0, 60, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full blur-[100px]" style={{ backgroundColor: section.primary }} />
        //                     <motion.div animate={{ y: [40, -40, 40], x: [0, -60, 0], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full blur-[120px] opacity-70" style={{ backgroundColor: section.secondary }} />
        //                 </div>
        //             )}
        //             {sIdx === 1 && ( /* ROCK - Fast Laser Streaks & Pulse */
        //                 <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        //                     {[...Array(10)].map((_, i) => (
        //                         <motion.div 
        //                             key={i} 
        //                             animate={{ x: ['-100%', '200%'], opacity: [0, 1, 0] }} 
        //                             transition={{ repeat: Infinity, duration: Math.random() * 1 + 0.5, delay: Math.random() * 2, ease: "linear" }} 
        //                             className="absolute h-[3px] w-1/2" 
        //                             style={{ top: `${(i + 1) * 10}%`, background: `linear-gradient(90deg, transparent, ${i%2===0 ? section.primary : section.secondary}, transparent)` }} 
        //                         />
        //                     ))}
        //                     <motion.div animate={{ opacity: [0.05, 0.2, 0.05] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${section.primary}30 0%, transparent 70%)` }} />
        //                 </div>
        //             )}
        //             {sIdx === 2 && ( /* INDIE - Morphing Soft Blobs */
        //                 <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        //                     <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-[20%] right-[20%] w-[500px] h-[500px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[120px]" style={{ backgroundColor: section.primary }} />
        //                     <motion.div animate={{ rotate: -360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-[100px]" style={{ backgroundColor: section.secondary }} />
        //                 </div>
        //             )}
        //             {sIdx === 3 && ( /* CLASSIC - Golden Dust Rising */
        //                 <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        //                     {[...Array(30)].map((_, i) => (
        //                         <motion.div 
        //                             key={i} 
        //                             animate={{ y: [0, -300], opacity: [0, 0.8, 0], x: Math.sin(i) * 50 }} 
        //                             transition={{ repeat: Infinity, duration: Math.random() * 6 + 4, delay: Math.random() * 5, ease: "linear" }} 
        //                             className="absolute w-2 h-2 rounded-full" 
        //                             style={{ top: `${Math.random() * 100 + 50}%`, left: `${Math.random() * 100}%`, backgroundColor: section.primary, boxShadow: `0 0 10px ${section.primary}` }} 
        //                         />
        //                     ))}
        //                     <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at bottom, ${section.primary}10 0%, transparent 60%)` }} />
        //                 </div>
        //             )}
        //             {/* ========================================= */}

        //             <div className="relative z-10 px-6 max-w-7xl mx-auto">
        //                 <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        //                     <div className="border-l-8 pl-8 transition-all" style={{ borderColor: section.primary }}>
        //                         <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase" style={{ color: section.primary, textShadow: `0 0 30px ${section.primary}40` }}>
        //                             {section.title}
        //                         </h2>
        //                         <p className="text-gray-400 font-bold uppercase tracking-widest mt-3 text-sm">{section.desc}</p>
        //                     </div>
        //                     <motion.button whileHover={{ scale: 1.05, backgroundColor: section.primary, color: '#0B0C10', borderColor: section.primary }} className="text-white text-xs font-black border border-white/20 px-8 py-3 rounded-full uppercase tracking-[0.2em] transition-all hidden md:block">
        //                         Explore Category
        //                     </motion.button>
        //                 </div>

        //                 {/* Grid 3 Columns x 2 Rows */}
        //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
        //                     {section.artists.map((artist, aIdx) => (
        //                         <motion.div
        //                             key={aIdx}
        //                             initial={{ opacity: 0, y: 30 }}
        //                             whileInView={{ opacity: 1, y: 0 }}
        //                             viewport={{ once: true }}
        //                             transition={{ delay: (aIdx % 3) * 0.1 }}
        //                             onMouseEnter={() => setHoveredArtist(`${sIdx}-${aIdx}`)}
        //                             onMouseLeave={() => setHoveredArtist(null)}
        //                             className="flex flex-col gap-5 group"
        //                         >
        //                             {/* Card Frame */}
        //                             <div 
        //                                 className="relative aspect-[4/5] rounded-[2rem] overflow-hidden glass-card transition-all duration-500" 
        //                                 style={{ 
        //                                     boxShadow: hoveredArtist === `${sIdx}-${aIdx}` ? `0 20px 50px ${section.primary}30` : 'none',
        //                                     borderColor: hoveredArtist === `${sIdx}-${aIdx}` ? `${section.primary}50` : 'rgba(255, 255, 255, 0.05)'
        //                                 }}
        //                             >
        //                                 <img 
        //                                     src={artist.img} 
        //                                     alt={artist.name}
        //                                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
        //                                 />
        //                                 <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/40 to-transparent opacity-90" />
                                        
        //                                 <div className="absolute inset-0 p-8 flex flex-col justify-end z-20 pointer-events-none">
        //                                     <span 
        //                                         className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 px-3 py-1 rounded-sm w-fit backdrop-blur-md" 
        //                                         style={{ color: (sIdx === 2 || sIdx === 3) ? '#0B0C10' : '#FFFFFF', backgroundColor: section.primary }}
        //                                     >
        //                                         {artist.sub}
        //                                     </span>
        //                                     <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">{artist.name}</h3>
        //                                 </div>

        //                                 {/* Hover Play Overlay */}
        //                                 <AnimatePresence>
        //                                     {hoveredArtist === `${sIdx}-${aIdx}` && (
        //                                         <motion.div
        //                                             initial={{ opacity: 0 }}
        //                                             animate={{ opacity: 1 }}
        //                                             exit={{ opacity: 0 }}
        //                                             className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10"
        //                                         >
        //                                             <motion.div
        //                                                 initial={{ scale: 0.8 }}
        //                                                 animate={{ scale: 1 }}
        //                                                 className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl bg-white/10 border border-white/20 backdrop-blur-lg"
        //                                             >
        //                                                 <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 01-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z" transform="rotate(-90 10 10)"/></svg>
        //                                             </motion.div>
        //                                         </motion.div>
        //                                     )}
        //                                 </AnimatePresence>
        //                             </div>

        //                             {/* Mini Player UI (Below Card) */}
        //                             <div className="px-2 flex flex-col gap-3 relative z-10">
        //                                 <div className="flex justify-between items-start">
        //                                     <div className="flex flex-col">
        //                                         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Featured Track</span>
        //                                         <span className="text-sm font-black text-gray-200 uppercase tracking-tight">{artist.song}</span>
        //                                     </div>
        //                                     <button 
        //                                         className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors"
        //                                         style={{ 
        //                                             backgroundColor: hoveredArtist === `${sIdx}-${aIdx}` ? section.primary : 'rgba(255,255,255,0.05)',
        //                                             color: hoveredArtist === `${sIdx}-${aIdx}` && (sIdx === 2 || sIdx === 3) ? '#0B0C10' : '#FFFFFF'
        //                                         }}
        //                                     >
        //                                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
        //                                     </button>
        //                                 </div>
        //                                 {/* Progress Bar */}
        //                                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        //                                     <motion.div 
        //                                         initial={{ width: 0 }}
        //                                         whileInView={{ width: hoveredArtist === `${sIdx}-${aIdx}` ? "80%" : "20%" }}
        //                                         className="h-full rounded-full transition-all duration-500" 
        //                                         style={{ backgroundColor: section.primary }}
        //                                     />
        //                                 </div>
        //                             </div>
        //                         </motion.div>
        //                     ))}
        //                 </div>
        //             </div>
        //         </section>
        //     ))}

        //     {/* ================= INDUSTRY STATS ================= */}
        //     <section className="relative z-10 py-32 px-6 max-w-5xl mx-auto border-t border-white/5">
        //         <motion.div 
        //             initial={{ opacity: 0, scale: 0.95 }}
        //             whileInView={{ opacity: 1, scale: 1 }}
        //             viewport={{ once: true }}
        //             className="bg-[#12141a] rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden"
        //         >
        //             <div className="absolute top-0 right-0 w-64 h-64 bg-[#2B5AE810] blur-[80px]" />
        //             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF007F10] blur-[80px]" />
                    
        //             <h3 className="text-center text-3xl md:text-5xl font-black uppercase mb-16 tracking-tighter">
        //                 Streaming <span className="text-[#00E5FF]">Analytics</span>
        //             </h3>

        //             <div className="flex justify-between items-end h-[300px] gap-2 md:gap-8 border-b border-white/10 pb-4 relative z-10">
        //                 {[
        //                     { label: "POP", val: 85, color: "#FF007F" },
        //                     { label: "ROCK", val: 65, color: "#D3131F" },
        //                     { label: "INDIE", val: 45, color: "#2B5AE8" },
        //                     { label: "HIPHOP", val: 75, color: "#00E5FF" },
        //                     { label: "CLASSIC", val: 35, color: "#D4AF37" }
        //                 ].map((stat, i) => (
        //                     <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
        //                         <motion.div
        //                             initial={{ height: 0 }}
        //                             whileInView={{ height: `${stat.val}%` }}
        //                             viewport={{ once: true }}
        //                             className="w-full md:w-16 rounded-t-xl relative cursor-crosshair transition-all"
        //                             style={{ backgroundColor: stat.color, boxShadow: `0 0 20px ${stat.color}20` }}
        //                             whileHover={{ brightness: 1.2, scaleY: 1.05, transformOrigin: 'bottom' }}
        //                         >
        //                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black bg-white text-black px-2 py-1 rounded shadow-lg">
        //                                 {stat.val}%
        //                             </div>
        //                         </motion.div>
        //                         <span className="text-gray-500 text-[10px] font-black uppercase mt-4 tracking-widest">{stat.label}</span>
        //                     </div>
        //                 ))}
        //             </div>
        //         </motion.div>
        //     </section>

        //     {/* ================= BIG BOTTOM TEXT ================= */}
        //     <section className="relative w-full h-[30vh] md:h-[40vh] flex items-end justify-center overflow-hidden pointer-events-none bg-gradient-to-t from-[#00E5FF]/5 to-transparent">
        //         <motion.h1 
        //             initial={{ y: 150, opacity: 0 }}
        //             whileInView={{ y: 0, opacity: 0.1 }}
        //             transition={{ duration: 1.2, ease: "circOut" }}
        //             className="text-[14vw] font-black text-white whitespace-nowrap tracking-tighter leading-none mb-[-3vw]"
        //         >
        //             ARTISTS ARCHIVE
        //         </motion.h1>
        //     </section>

        //     {/* ================= FOOTER ================= */}
        //     <footer className="relative z-10 py-16 text-center border-t border-white/5 bg-black">
        //         <div className="flex justify-center gap-12 text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
        //             <motion.a whileHover={{ color: "#00E5FF", y: -2 }} href="#" className="transition-all">Labels</motion.a>
        //             <motion.a whileHover={{ color: "#7000FF", y: -2 }} href="#" className="transition-all">Charts</motion.a>
        //             <motion.a whileHover={{ color: "#FF00FF", y: -2 }} href="#" className="transition-all">Tickets</motion.a>
        //         </div>
        //     </footer>
        // </div>
    );
}