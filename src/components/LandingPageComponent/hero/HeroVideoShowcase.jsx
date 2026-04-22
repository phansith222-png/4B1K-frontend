import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllArtists } from '../../../api/artist';

// ข้อมูลจำลองเผื่อ API โหลดช้า
const getMockArtists = () => Array.from({ length: 7 }).map((_, i) => ({
    id: `mock-${i}`,
    artistName: `Loading...`,
    profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop'
}));

export default function HeroVideoShowcase() {
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await getAllArtists();
                let data = res?.artists || res?.data || res || [];
                // สุ่มลำดับศิลปินให้ไม่ซ้ำเดิม
                const shuffled = [...data].sort(() => 0.5 - Math.random());
                setArtists(shuffled.length > 5 ? shuffled : getMockArtists());
            } catch (err) {
                console.error("Failed to load artists", err);
                setArtists(getMockArtists());
            }
        };
        fetchArtists();
    }, []);

    // ระบบเล่นอัตโนมัติ (Pop ขึ้นมาทีละคนช้าๆ แบบเป็นธรรมชาติ)
    useEffect(() => {
        if (artists.length === 0 || isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % artists.length);
        }, 3500); // เปลี่ยนศิลปินทุกๆ 3.5 วินาที
        return () => clearInterval(timer);
    }, [artists, isHovered]);

    const getArtistPath = (artist) => {
        if (!artist.id || artist.id.toString().startsWith('mock')) return '#';
        const aId = Number(artist.id);
        const popIds = [1, 2, 3, 4, 5];
        const rockIds = [6, 7, 8, 9, 10];
        const classicIds = [16, 17, 18, 19, 20];
        const etcIds = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25];
        if (popIds.includes(aId)) return '/pop';
        if (rockIds.includes(aId)) return '/rock';
        if (classicIds.includes(aId)) return '/classic';
        if (etcIds.includes(aId)) return '/etc';
        return '/artists';
    };

    const getGenreColor = (genresArray) => {
        if (!genresArray || !genresArray.length) return "#00E5FF";
        const gName = (genresArray[0]?.genre?.name || "").toLowerCase();

        if (gName.includes("pop")) return "#FF007F";
        if (gName.includes("rock")) return "#D3131F";
        if (gName.includes("r&b") || gName.includes("classic")) return "#da45ffff";
        if (gName.includes("hip hop") || gName.includes("rap")) return "#00E5FF";
        if (gName.includes("edm") || gName.includes("electronic")) return "#7000FF";
        return "#00E5FF"; // default
    };

    const getGenreName = (genresArray) => {
        if (!genresArray || !genresArray.length) return "Featured Artist";
        return genresArray[0]?.genre?.name || "Featured Artist";
    };

    if (artists.length === 0) return <div className="h-[40vh] w-full"></div>;

    // คำนวณตำแหน่งให้เรียงเป็น "เส้นโค้งสายรุ้ง" แบบมีองศาการเอียง (ตามภาพตัวอย่าง JoyJam)
    const getLayout = (distance) => {
        const isMobile = window.innerWidth < 768;
        const abs = Math.abs(distance);
        const sign = Math.sign(distance);

        // ซ่อนตัวที่อยู่ไกลๆ เพื่อไม่ให้รกบนมือถือ
        if (isMobile && abs > 1) return { opacity: 0, scale: 0.5, x: sign * 150, y: 80, rotate: sign * 20, zIndex: 0 };

        // ขนาด: ปรับให้เล็กลงเพื่อให้มีพื้นที่ตรงกลางสำหรับข้อความ
        const scale = abs === 0 ? 1 : abs === 1 ? 0.8 : 0.65;

        // แกน Y: โค้งแบบกว้างๆ ให้ตรงกลางอยู่สูงขึ้น
        const y = abs === 0 ? -40 : abs === 1 ? 30 : 100;

        // แกน X: ระยะห่างซ้ายขวากว้างขึ้น
        let x = 0;
        if (abs === 1) x = sign * (isMobile ? 130 : 280);
        if (abs === 2) x = sign * 520;

        // องศาการเอียง (Rotate Z)
        const rotate = sign * (abs === 1 ? 15 : abs === 2 ? 35 : 0);

        return {
            x,
            y,
            scale,
            rotate,
            zIndex: 10 - abs,
            opacity: abs === 0 ? 1 : abs === 1 ? 0.9 : 0.5
        };
    };

    return (
        <div className="w-full relative z-10 pt-4 flex justify-center items-start h-[280px] md:h-[400px] lg:h-[450px] perspective-1000">

            {/* แสงสว่างด้านหลัง */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[700px] h-[300px] bg-gradient-to-tr from-[#00E5FF]/10 via-[#7000FF]/15 to-[#FF007F]/10 blur-[90px] rounded-full pointer-events-none"></div>

            <div className="relative w-full max-w-6xl flex justify-center items-center h-full">
                <AnimatePresence mode="popLayout">
                    {artists.map((artist, idx) => {
                        // คำนวณระยะห่างจากตัวตรงกลางแบบวงกลม
                        let distance = idx - currentIndex;
                        const half = Math.floor(artists.length / 2);
                        if (distance > half) distance -= artists.length;
                        if (distance < -half) distance += artists.length;

                        if (Math.abs(distance) > 2) return null; // ไม่เรนเดอร์ตัวที่อยู่ไกลเกินไป

                        const isCenter = distance === 0;
                        const layout = getLayout(distance);

                        return (
                            <motion.div
                                key={artist.id || idx}
                                initial={{ opacity: 0, scale: 0.5, x: Math.sign(distance) * 200, y: 100, rotate: Math.sign(distance) * 30 }}
                                animate={{
                                    x: layout.x,
                                    y: layout.y,
                                    scale: layout.scale,
                                    rotate: layout.rotate, // รับค่าการเอียง
                                    opacity: layout.opacity,
                                    zIndex: layout.zIndex,
                                }}
                                exit={{ opacity: 0, scale: 0.5, x: Math.sign(distance) * -200, y: 100, rotate: Math.sign(distance) * -30 }}
                                transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1 }}
                                // ปรับให้ภาพมีความกว้าง/สูง สมส่วน เล็กลงเพื่อโชว์ข้อความด้านล่าง
                                className={`absolute w-40 h-40 md:w-56 md:h-56 lg:w-[18rem] lg:h-[18rem] cursor-pointer ${isCenter ? 'shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2rem] lg:rounded-[2.5rem]' : 'rounded-[1.5rem] lg:rounded-[2rem]'}`}
                                style={{ transformStyle: "preserve-3d" }}
                                onClick={() => {
                                    if (isCenter) {
                                        const path = getArtistPath(artist);
                                        if (path !== '#') navigate(`${path}?artistId=${artist.id}`);
                                    } else {
                                        // ถ้าคลิกตัวข้างๆ ให้เลื่อนมาตรงกลาง
                                        setCurrentIndex(idx);
                                    }
                                }}
                                onMouseEnter={() => isCenter && setIsHovered(true)}
                                onMouseLeave={() => isCenter && setIsHovered(false)}
                            >
                                {/* Effect พลิกรูป (Flip Card 3D) เมื่อ Hover */}
                                <motion.div
                                    animate={{ rotateY: isCenter && isHovered ? 180 : 0 }}
                                    transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 15 }}
                                    className="w-full h-full relative"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* ด้านหน้า: รูปศิลปิน */}
                                    <div
                                        className="absolute inset-0 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-2 border-white/5 bg-black"
                                        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                                    >
                                        <img
                                            src={artist.profileImage}
                                            alt={artist.artistName}
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center pb-6 pointer-events-none">
                                            <span className="text-white font-black text-xl md:text-2xl tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center px-4">
                                                {artist.artistName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ด้านหลัง: ข้อมูลศิลปิน (พลิกมาเจออันนี้ออกแบบใหม่ให้สวยขึ้น) */}
                                    <div
                                        className="absolute inset-0 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-2 border-[#00E5FF]/40 bg-[#0B0C10] flex flex-col p-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]"
                                        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                                    >
                                        {/* พื้นหลังเบลอจากรูปศิลปิน */}
                                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                                            <img src={artist.profileImage} alt="" className="w-full h-full object-cover blur-2xl scale-125" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10]/40 via-[#0B0C10]/80 to-[#0B0C10]"></div>
                                        </div>

                                        {/* เนื้อหาด้านหลัง */}
                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* รูปโปรไฟล์วงกลมและชื่อ */}
                                            <div className="flex flex-col items-center mt-2">
                                                <div
                                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr shadow-lg mb-3"
                                                    style={{
                                                        backgroundImage: `linear-gradient(to top right, ${getGenreColor(artist.genres)}, #111)`,
                                                        boxShadow: `0 0 20px ${getGenreColor(artist.genres)}60`
                                                    }}
                                                >
                                                    <img src={artist.profileImage} alt={artist.artistName} className="w-full h-full object-cover rounded-full border-2 border-black" />
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-black text-white text-center leading-tight mb-1 line-clamp-1 w-full px-2">{artist.artistName}</h3>
                                                <span
                                                    className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]"
                                                    style={{ color: getGenreColor(artist.genres) }}
                                                >
                                                    {getGenreName(artist.genres)}
                                                </span>
                                            </div>

                                            {/* ข้อมูลเพลง / อีเวนต์ */}
                                            <div className="flex-grow flex flex-col justify-center gap-3 w-full mt-4">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3 transition-colors hover:bg-white/10">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d000ff]/20 to-[#d000ff]/10 border border-[#d000ff]/30 flex items-center justify-center text-[#d000ff] text-lg">🎵</div>
                                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Top Track</span>
                                                        <span className="text-sm md:text-base text-white font-medium line-clamp-1">{artist.songs?.[0]?.title || "Explore Music"}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3 transition-colors hover:bg-white/10">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] text-lg">🎫</div>
                                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Live Events</span>
                                                        <span className="text-sm md:text-base text-white font-medium line-clamp-1">{artist.events?.[0]?.eventName || "Upcoming Concerts"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ปุ่มกด */}
                                            <div className="mt-auto pt-4">
                                                <div className="w-full py-3 md:py-4 bg-gradient-to-r from-[#00E5FF] to-[#d000ff] rounded-2xl text-white font-black text-xs md:text-sm uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all flex justify-center items-center gap-2 group-hover:scale-[1.02]">
                                                    Explore Profile
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
