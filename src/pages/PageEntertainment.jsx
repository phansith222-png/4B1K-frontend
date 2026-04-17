import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAllArtists } from '../api/artist';

export default function PageEntertainment() {
    // ================= STATE สำหรับข้อมูล Backend =================
    const [agencies, setAgencies] = useState([]);
    const [totalArtists, setTotalArtists] = useState(0);
    const [loading, setLoading] = useState(true);

    // ================= LOGIC จัดกลุ่มค่ายเพลง =================
    useEffect(() => {
        const fetchAgenciesData = async () => {
            try {
                setLoading(true);

                // 1. ดึงข้อมูลศิลปินทั้งหมด
                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];

                // 2. จัดกลุ่มศิลปินตามค่าย (Agency)
                const agencyMap = {};
                let countWithAgency = 0;

                allArtistsList.forEach(artist => {
                    if (artist.agency) {
                        countWithAgency++;
                        const agId = artist.agency.id;
                        if (!agencyMap[agId]) {
                            agencyMap[agId] = {
                                id: agId,
                                name: artist.agency.name,
                                artists: []
                            };
                        }
                        agencyMap[agId].artists.push(artist);
                    }
                });

                // 3. เรียงลำดับค่ายที่มีศิลปินเยอะที่สุดไปน้อยที่สุด
                const sortedAgencies = Object.values(agencyMap).sort((a, b) => b.artists.length - a.artists.length);

                setAgencies(sortedAgencies);
                setTotalArtists(countWithAgency);

            } catch (error) {
                console.error("Error organizing agency data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgenciesData();
    }, []);

    // ข้อมูลละอองแสง (Glow Particles) สำหรับบรรยากาศ
    const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 400 + 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        color: i % 2 === 0 ? '#00E5FF' : '#7000FF',
    })), []);

    // สีประจำหมวดหมู่เพื่อให้ UI สวยงามเหมือนเดิม
    const cardColors = ['#FF007F', '#CEFF67', '#00E5FF', '#D4AF37', '#D3131F', '#7000FF'];

    // ================= หน้าจอ Loading =================
    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#00E5FF] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7000FF] opacity-20 blur-[80px] rounded-full"></div>
                <div className="w-16 h-16 border-4 border-gray-800 border-t-[#00E5FF] rounded-full animate-spin z-10"></div>
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Labels...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#00E5FF] selection:text-black relative">
            
            {/* ================= STYLE: SHARED TEXTURES & FONTS ================= */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@300;400;700;900&display=swap');
                
                body { font-family: 'Inter', sans-serif; }
                .font-display { font-family: 'Syncopate', sans-serif; }

                /* พื้นผิว Noise แบบ Dark Theme */
                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .vinyl-record {
                    background: repeating-radial-gradient(circle, #111, #111 2px, #1a1a1a 3px, #111 4px);
                    border: 2px solid #222;
                    animation: spin-slow 15s linear infinite;
                }
            `}</style>

            <div className="dark-grain" />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full blur-[120px] opacity-[0.08]"
                        style={{
                            width: p.size,
                            height: p.size,
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            backgroundColor: p.color,
                        }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -30, 30, 0],
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:col-span-7 flex flex-col items-start"
                    >
                        <motion.span 
                            initial={{ letterSpacing: "0.2em", opacity: 0 }}
                            animate={{ letterSpacing: "0.5em", opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="text-[#00E5FF] font-bold tracking-[0.5em] text-sm md:text-lg mb-6 block uppercase"
                        >
                            Thailand Entertainment Hub
                        </motion.span>
                        
                        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] text-white tracking-tighter mb-10 font-display">
                            THAILAND <br/> MUSIC <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7000FF] to-[#FF00FF]">LABELS</span>
                        </h1>
                        
                        <p className="mt-8 text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
                            ศูนย์รวมค่ายเพลงและศิลปินไทยทุกแนวทาง รวบรวมสถิติ ศิลปินในสังกัด และภาพรวมของอุตสาหกรรมดนตรี
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#00E5FF] text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                            >
                                Explore Hub
                            </motion.button>
                            <motion.button 
                                whileHover={{ color: "#00E5FF", borderColor: "#00E5FF" }}
                                className="px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm border border-white/20 transition-colors"
                            >
                                View Artists
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="w-full md:col-span-5 relative flex justify-center md:justify-end">
                        <div className="relative w-[70%] aspect-[3/4] border border-[#00E5FF]/20 rounded-sm translate-x-10 translate-y-10 opacity-30" />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-sm overflow-hidden border-[12px] border-[#12141a] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop"
                                alt="Recording Studio"
                                className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-[5s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-80" />
                        </motion.div>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-7xl mx-auto mt-20 flex flex-col md:flex-row items-center justify-between border-y border-white/10 py-10 bg-white/[0.02] backdrop-blur-sm px-10"
                >
                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                        <h2 className="tracking-[0.3em] text-[#00E5FF] text-xl font-bold uppercase">Top Labels Network</h2>
                        <p className="text-xl md:text-2xl text-gray-300 mt-2 font-black italic uppercase tracking-tight text-center md:text-left line-clamp-1">
                            {agencies.slice(0, 6).map(ag => ag.name).join(' • ') || 'Loading Labels...'}
                        </p>
                    </div>
                    <motion.button 
                        whileHover={{ backgroundColor: "#00E5FF", color: "#000" }}
                        className="border-2 border-[#00E5FF] text-[#00E5FF] px-12 py-4 rounded-full font-black tracking-widest text-sm transition-all whitespace-nowrap"
                    >
                        Explore More
                    </motion.button>
                </motion.div>
            </section>

            {/* ================= 2. QUOTE / TAGLINE ================= */}
            <section className="relative w-full py-32 px-6 border-y border-white/5 bg-black/20 z-10">
                <div className="max-w-5xl mx-auto text-center flex flex-col gap-8">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter"
                    >
                        "Unity in Diversity of Sounds"
                    </motion.h2>
                    <p className="text-xl md:text-3xl text-gray-500 font-bold tracking-widest leading-relaxed uppercase">
                        Major Players <span className="text-[#00E5FF] mx-4">|</span> Indie Spirit <span className="text-[#00E5FF] mx-4">|</span> T-Pop Idols
                    </p>
                    <div className="w-24 h-1 bg-[#7000FF] mx-auto mt-4" />
                </div>
            </section>

            {/* ================= 3. LABELS CATEGORIES (DYNAMIC DATA) ================= */}
            <section className="relative w-full py-24 px-6 bg-[#0B0C10] z-10">
                <div className="max-w-6xl mx-auto z-10 relative">
                    <h3 className="text-center text-3xl md:text-4xl font-black text-[#00E5FF] mb-20 tracking-widest uppercase">The Industry Leaders</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {agencies.length > 0 ? agencies.map((agency, idx) => {
                            const themeColor = cardColors[idx % cardColors.length];
                            return (
                            <motion.div 
                                key={agency.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 4) * 0.15 }}
                                whileHover={{ y: -10, borderColor: themeColor, backgroundColor: 'rgba(255,255,255,0.01)' }}
                                className="flex flex-col p-10 bg-[#12141a] border-l-4 border-gray-800 rounded-lg hover:border-[#D4AF37] transition-all duration-300 cursor-default group shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tight group-hover:text-white transition-colors leading-none" style={{ color: themeColor }}>
                                        {agency.name}
                                    </h4>
                                    <span className="bg-white/5 text-gray-400 px-3 py-1 rounded text-xs font-bold border border-white/10 group-hover:border-white/30 transition-colors">
                                        {agency.artists.length} Artists
                                    </span>
                                </div>
                                <p className="text-gray-500 font-bold text-sm mb-6 uppercase tracking-wider">Top talents and artists</p>
                                
                                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-gray-800 group-hover:border-gray-700 transition-colors">
                                    {agency.artists.slice(0, 8).map(artist => (
                                        <span key={artist.id} className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors uppercase">
                                            {artist.artistName}
                                        </span>
                                    ))}
                                    {agency.artists.length > 8 && (
                                        <span className="text-xs font-bold text-gray-600 uppercase">+{agency.artists.length - 8} MORE</span>
                                    )}
                                </div>
                            </motion.div>
                        )}) : (
                            <div className="col-span-1 md:col-span-2 text-center py-20 bg-[#12141a] border border-gray-800 rounded-2xl">
                                <p className="text-gray-500 uppercase font-bold tracking-widest">No Agencies Found in Database.</p>
                            </div>
                        )}
                    </div>

                    {/* Music Visualization (Dominance Stats) */}
                    <div className="w-full max-w-4xl mx-auto mt-32 bg-[#12141a] border border-white/5 p-10 rounded-2xl flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF] opacity-[0.03] blur-3xl rounded-full" />
                        
                        <div className="relative flex-shrink-0">
                            <div className="w-48 h-48 rounded-full vinyl-record flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                                <div className="absolute inset-0 rounded-full border border-white/5 m-4 animate-pulse"></div>
                                <div className="w-16 h-16 rounded-full bg-[#0B0C10] border-2 border-[#00E5FF]/40 flex items-center justify-center z-10 shadow-inner">
                                    <div className="w-3 h-3 rounded-full bg-[#00E5FF]" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full relative z-10">
                            <span className="text-[#00E5FF] tracking-widest uppercase text-xs font-black">Labels Engagement Analysis</span>
                            <h4 className="text-4xl font-black text-white mt-2 tracking-tight uppercase">Thai Industry Dominance</h4>
                            
                            <div className="w-full bg-gray-800 h-2 mt-10 relative rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#7000FF]" 
                                />
                            </div>

                            <div className="flex justify-between text-gray-400 mt-4 text-[10px] md:text-sm font-black tracking-widest uppercase flex-wrap gap-2">
                                {agencies.slice(0, 3).map((ag, idx) => {
                                    const percentage = totalArtists > 0 ? Math.round((ag.artists.length / totalArtists) * 100) : 0;
                                    return (
                                        <span key={idx} className={idx === 0 ? "text-white" : ""}>
                                            {ag.name} {percentage}%
                                        </span>
                                    )
                                })}
                                {agencies.length === 0 && <span>No Data Available</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 4. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#00E5FF]/5 to-transparent z-0">
                <motion.h1 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 0.15 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="text-[14vw] font-black font-display text-white whitespace-nowrap tracking-tighter select-none leading-none mb-[-2vw]"
                >
                    ENTERTAINMENT HUB
                </motion.h1>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="w-full py-20 px-6 bg-black text-center border-t border-white/5 relative z-10">
                <div className="flex justify-center gap-8 md:gap-12 text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] flex-wrap">
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Facebook</a>
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Instagram</a>
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Spotify</a>
                    <a href="#" className="hover:text-[#00E5FF] transition-colors">Contact</a>
                </div>
            </footer>
        </div>
    );
}