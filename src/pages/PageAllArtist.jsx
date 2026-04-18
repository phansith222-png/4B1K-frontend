import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllArtists } from '../api/artist';

export default function AllArtist() {
    const [hoveredArtist, setHoveredArtist] = useState(null);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. ดึงข้อมูลศิลปินทั้งหมดจาก Backend
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const response = await getAllArtists();
                const data = response?.artists || response?.data || response || [];
                setArtists(data);
            } catch (error) {
                console.error("Error fetching all artists:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    // 2. จัดหมวดหมู่ศิลปินตามแนวเพลง (รวม R&B, Hip Hop, EDM)
    const sections = useMemo(() => {
        const categories = [
            { 
                title: "POP & IDOLS", 
                keyword: "pop", 
                primary: "#FF007F", 
                secondary: "#00F5D4", 
                desc: "The mainstream phenomenon shaping the sound of modern youth." 
            },
            { 
                title: "ROCK ARENA", 
                keyword: "rock", 
                primary: "#D3131F", 
                secondary: "#8D99AE", 
                desc: "Raw energy, distortion, and the voices that echo through stadiums." 
            },
            { 
                title: "INDIE JOURNEY", 
                keyword: "indie", 
                primary: "#2B5AE8", 
                secondary: "#CEFF67", 
                desc: "Independent spirits exploring uncharted territories of sound." 
            },
            { 
                title: "CLASSIC & R&B", 
                keyword: "r&b", 
                primary: "#D4AF37", 
                secondary: "#FFFFFF", 
                desc: "Smooth soul, timeless melodies, and the golden heritage of R&B artistry." 
            },
            { 
                title: "HIP HOP CULTURE", 
                keyword: "hip hop", 
                primary: "#00E5FF", 
                secondary: "#7000FF", 
                desc: "The rhythm of the streets, poetic flow, and heavy bass beats." 
            },
            { 
                title: "EDM UNIVERSE", 
                keyword: "edm", 
                primary: "#7000FF", 
                secondary: "#FF00FF", 
                desc: "Electronic energy, synthesizer waves, and the future of dance music." 
            }
        ];

        return categories.map(cat => {
            const filtered = artists.filter(artist => {
                const hasKeywordInBio = artist.biography?.toLowerCase().includes(cat.keyword);
                const hasKeywordInGenre = artist.genres?.some(g => g.genre?.name?.toLowerCase().includes(cat.keyword));
                return hasKeywordInBio || hasKeywordInGenre;
            });
            return { ...cat, artists: filtered.slice(0, 6) }; 
        });
    }, [artists]);

    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#00E5FF]">
                <div className="w-16 h-16 border-4 border-white/5 border-t-[#00E5FF] rounded-full animate-spin"></div>
                <p className="mt-4 font-black tracking-[0.3em] uppercase animate-pulse">Archiving Artists...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden relative">
            
            {/* ================= STYLE ================= */}
            <style>{`
                .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
                .mesh-gradient { position: absolute; inset: 0; z-index: 0; filter: blur(60px); animation: mesh-move 20s ease-in-out infinite alternate; background: radial-gradient(circle at var(--x1, 20%) var(--y1, 20%), rgba(255, 0, 127, 0.15) 0%, transparent 40%), radial-gradient(circle at var(--x2, 80%) var(--y2, 80%), rgba(43, 90, 232, 0.15) 0%, transparent 40%), radial-gradient(circle at var(--x3, 50%) var(--y3, 50%), rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at var(--x4, 20%) var(--y4, 80%), rgba(211, 19, 31, 0.15) 0%, transparent 40%); }
                @keyframes mesh-move { 0% { --x1: 20%; --y1: 20%; --x2: 80%; --y2: 80%; --x3: 50%; --y3: 50%; --x4: 20%; --y4: 80%; } 100% { --x1: 80%; --y1: 80%; --x2: 20%; --y2: 20%; --x3: 20%; --y3: 50%; --x4: 50%; --y4: 80%; } }
                .dark-grain { position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 100; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

                /* --- HIP HOP: Laser Streaks --- */
                @keyframes laser-move {
                    0% { transform: translateX(-100%) translateY(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(200%) translateY(20px); opacity: 0; }
                }
                .laser-line {
                    position: absolute; height: 1px; width: 100%;
                    background: linear-gradient(90deg, transparent, #00E5FF, transparent);
                    animation: laser-move 2s infinite linear;
                }

                /* --- EDM: Digital Pulse --- */
                @keyframes digital-pulse {
                    0% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.1); opacity: 0.2; }
                    100% { transform: scale(1); opacity: 0.1; }
                }
                .digital-wave {
                    position: absolute; inset: 0;
                    background: radial-gradient(circle at center, #7000FF15 0%, transparent 70%);
                    animation: digital-pulse 4s infinite ease-in-out;
                }
            `}</style>

            <div className="dark-grain" />

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-24 px-6 overflow-hidden">
                <div className="mesh-gradient"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, letterSpacing: "8px" }} className="text-[#00E5FF] font-black text-sm uppercase block mb-6">The Complete Artists Archive</motion.span>
                    <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-[11rem] font-black italic tracking-tighter text-center leading-[0.85] mb-8">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] via-[#2B5AE8] to-[#00E5FF]">VOICES</span> <br/> OF SIAM
                    </motion.h1>
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-start text-left max-w-4xl mx-auto mt-16 text-gray-400 font-medium">
                        <p className="text-sm md:text-base uppercase tracking-widest border-l-2 border-[#FF007F] pl-4">From the mainstream pop idols dominating the charts to the underground indie bands shaping the subculture.</p>
                        <p className="text-sm md:text-base uppercase tracking-widest border-l-2 border-[#2B5AE8] pl-4">A curated directory featuring over 100+ active artists, bands, and vocalists across all major labels.</p>
                    </div>
                </div>
            </section>

            {/* ================= ARTIST SECTIONS ================= */}
            {sections.map((section, sIdx) => section.artists.length > 0 && (
                <section key={sIdx} className="relative w-full py-24 border-t border-white/5 overflow-hidden">
                    
                    {/* ====== Special Background Effects ====== */}
                    {section.keyword === 'hip hop' && (
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="laser-line" style={{ top: `${i * 25}%`, animationDelay: `${i * 0.4}s` }} />
                            ))}
                        </div>
                    )}
                    {section.keyword === 'edm' && (
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="digital-wave" />
                        </div>
                    )}

                    <div className="relative z-10 px-6 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                            <div className="border-l-8 pl-8" style={{ borderColor: section.primary }}>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase" style={{ color: section.primary, textShadow: `0 0 30px ${section.primary}40` }}>{section.title}</h2>
                                <p className="text-gray-400 font-bold uppercase tracking-widest mt-3 text-sm">{section.desc}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                            {section.artists.map((artist, aIdx) => (
                                <motion.div
                                    key={artist.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    onMouseEnter={() => setHoveredArtist(`${sIdx}-${artist.id}`)}
                                    onMouseLeave={() => setHoveredArtist(null)}
                                    className="flex flex-col gap-5 group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden glass-card transition-all duration-500" 
                                         style={{ borderColor: hoveredArtist === `${sIdx}-${artist.id}` ? `${section.primary}50` : 'rgba(255, 255, 255, 0.05)' }}>
                                        <img 
                                            src={artist.profileImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800"} 
                                            alt={artist.artistName}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-90" />
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 px-3 py-1 rounded-sm w-fit" 
                                                  style={{ backgroundColor: section.primary, color: (section.keyword === 'r&b' || section.keyword === 'hip hop' || section.keyword === 'classic') ? '#0B0C10' : '#FFFFFF' }}>
                                                {artist.agency?.name || "Independent"}
                                            </span>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">{artist.artistName}</h3>
                                        </div>
                                    </div>
                                    <div className="px-2 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Latest Release</span>
                                                <span className="text-sm font-black text-gray-200 uppercase">{artist.songs?.[0]?.title || "Upcoming Track"}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: section.primary }}>
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                                            </div>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div animate={{ width: hoveredArtist === `${sIdx}-${artist.id}` ? "100%" : "20%" }} className="h-full" style={{ backgroundColor: section.primary }} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* ================= ANALYTICS ================= */}
            <section className="relative z-10 py-32 px-6 max-w-5xl mx-auto border-t border-white/5">
                <div className="bg-[#12141a] rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
                    <h3 className="text-center text-3xl md:text-5xl font-black uppercase mb-16 tracking-tighter">Streaming <span className="text-[#00E5FF]">Analytics</span></h3>
                    <div className="flex justify-between items-end h-[300px] gap-2 md:gap-8 border-b border-white/10 pb-4 relative z-10">
                        {[
                            { label: "POP", val: 85, color: "#FF007F" },
                            { label: "ROCK", val: 65, color: "#D3131F" },
                            { label: "INDIE", val: 45, color: "#2B5AE8" },
                            { label: "HIPHOP", val: 75, color: "#00E5FF" },
                            { label: "CLASSIC", val: 35, color: "#D4AF37" }
                        ].map((stat, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${stat.val}%` }} className="w-full md:w-16 rounded-t-xl" style={{ backgroundColor: stat.color }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white text-black text-[10px] font-black px-2 py-1 rounded">{stat.val}%</div>
                                </motion.div>
                                <span className="text-gray-500 text-[10px] font-black uppercase mt-4 tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] flex items-end justify-center overflow-hidden bg-gradient-to-t from-[#00E5FF]/5 to-transparent">
                <motion.h1 whileInView={{ y: 0, opacity: 0.1 }} transition={{ duration: 1.2 }} className="text-[14vw] font-black text-white whitespace-nowrap tracking-tighter leading-none mb-[-3vw]">ARTISTS ARCHIVE</motion.h1>
            </section>

        </div>
    );
}