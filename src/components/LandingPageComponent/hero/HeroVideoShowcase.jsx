import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllArtists } from '../../../api/artist';
import { getArtistPathById, getGenreColorByName } from '../../../utils/genreHelpers';

// ── Configuration Constants ───────────────────────────────────────────────────
const MOCK_ARTISTS = Array.from({ length: 7 }).map((_, i) => ({
    id: `mock-${i}`,
    artistName: `Loading...`,
    profileImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop'
}));

const getMockArtists = () => MOCK_ARTISTS;

const FAN_LAYOUT_CONFIG = {
    // scale: [center, abs=1, abs=2]
    scaleMap: [1, 0.85, 0.7],
    // Y offset: [center, abs=1, abs=2]
    yMap: [-40, 20, 90],
    // X spread (desktop): [center, abs=1, abs=2]
    xMapDesktop: [0, 340, 640],
    // X spread (mobile): [center, abs=1, abs=2]
    xMapMobile: [0, 140, 0], // mobile only shows abs=1
    // rotation degrees: [center, abs=1, abs=2]
    rotateMap: [0, 15, 35]
};

export default function HeroVideoShowcase({ artists = [] }) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => { setIsMobile(window.innerWidth < 768); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Filter out mock artists if they exist in the passed list
    const displayArtists = artists.length > 0 ? artists : getMockArtists();

    // ระบบเล่นอัตโนมัติ (Pop ขึ้นมาทีละคนช้าๆ แบบเป็นธรรมชาติ)
    useEffect(() => {
        if (displayArtists.length === 0 || isHovered) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayArtists.length);
        }, 3500); // เปลี่ยนศิลปินทุกๆ 3.5 วินาที
        return () => clearInterval(timer);
    }, [artists, isHovered]);

    const getGenreName = (genresArray) => {
        if (!genresArray || !genresArray.length) return "Featured Artist";
        return genresArray[0]?.genre?.name || "Featured Artist";
    };

    if (displayArtists.length === 0) return <div className="h-[40vh] w-full"></div>;

    // คำนวณตำแหน่งให้เรียงเป็น "เส้นโค้งสายรุ้ง" แบบมีองศาการเอียง
    const getLayout = (distance) => {
        const mobile = isMobile;
        const abs = Math.abs(distance);
        const sign = Math.sign(distance);

        // ซ่อนตัวที่อยู่ไกลๆ เพื่อไม่ให้รกบนมือถือ
        if (mobile && abs > 1) return { opacity: 0, scale: 0.5, x: sign * 150, y: 80, rotate: sign * 20, zIndex: 0 };

        const { scaleMap, yMap, xMapDesktop, xMapMobile, rotateMap } = FAN_LAYOUT_CONFIG;

        return {
            x: sign * (isMobile ? xMapMobile[abs] : xMapDesktop[abs]),
            y: yMap[abs],
            scale: scaleMap[abs],
            rotate: sign * rotateMap[abs],
            zIndex: 10 - abs,
            opacity: abs === 0 ? 1 : abs === 1 ? 0.9 : 0.5
        };
    };

    return (
        <div className="w-full relative z-10 pt-4 flex justify-center items-start h-[280px] md:h-[400px] lg:h-[450px] perspective-1000">

            {/* แสงสว่างด้านหลัง */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[700px] h-[300px] bg-gradient-to-tr from-[#00E5FF]/10 via-[#7000FF]/15 to-[#FF007F]/10 blur-[90px] rounded-full pointer-events-none"></div>

            <div className="relative w-full flex justify-center items-center h-full">
                <AnimatePresence mode="popLayout">
                    {displayArtists.map((artist, idx) => {
                        // คำนวณระยะห่างจากตัวตรงกลางแบบวงกลม
                        let distance = idx - currentIndex;
                        const half = Math.floor(displayArtists.length / 2);
                        if (distance > half) distance -= displayArtists.length;
                        if (distance < -half) distance += displayArtists.length;

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
                                // กลับมาใช้ขนาดรูปสี่เหลี่ยมจัตุรัสแบบเดิม และปรับการ์ดด้านหลังให้พอดี
                                className={`absolute w-40 h-40 md:w-56 md:h-56 lg:w-[20rem] lg:h-[20rem] cursor-pointer ${isCenter ? 'shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2rem] lg:rounded-[2.5rem]' : 'rounded-[1.5rem] lg:rounded-[2rem]'}`}
                                style={{ transformStyle: "preserve-3d" }}
                                onClick={() => {
                                    if (isCenter) {
                                        const path = getArtistPathById(artist.id);
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
                                            loading="lazy"
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center pb-4 md:pb-6 pointer-events-none">
                                            <span className="text-white font-black text-lg md:text-2xl tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center px-4">
                                                {artist.artistName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ด้านหลัง: ข้อมูลศิลปิน */}
                                    <div
                                        className="absolute inset-0 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border-2 border-[#00E5FF]/40 bg-[#0B0C10] flex flex-col p-3 md:p-4 lg:p-5 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]"
                                        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                                    >
                                        {/* พื้นหลังเบลอจากรูปศิลปิน */}
                                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                                            <img src={artist.profileImage} alt="" className="w-full h-full object-cover blur-2xl scale-125" />
                                            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10]/40 via-[#0B0C10]/80 to-[#0B0C10]"></div>
                                        </div>

                                        {/* เนื้อหาด้านหลัง */}
                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                            
                                            {/* ส่วนบน: รูปโปรไฟล์และชื่อ */}
                                            <div className="flex flex-col items-center mt-1">
                                                <div
                                                    className="hidden md:block w-12 h-12 lg:w-16 lg:h-16 rounded-full p-0.5 lg:p-1 bg-gradient-to-tr shadow-lg mb-1 lg:mb-2 flex-shrink-0"
                                                    style={{
                                                        backgroundImage: `linear-gradient(to top right, ${getGenreColorByName(artist.genres)}, #111)`,
                                                        boxShadow: `0 0 15px ${getGenreColorByName(artist.genres)}60`
                                                    }}
                                                >
                                                    <img src={artist.profileImage} alt={artist.artistName} className="w-full h-full object-cover rounded-full border border-black" />
                                                </div>
                                                <h3 className="text-base md:text-lg lg:text-xl font-black text-white text-center leading-tight mb-0 line-clamp-1 w-full px-1">{artist.artistName}</h3>
                                                <span
                                                    className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.2em] flex-shrink-0 mt-0.5"
                                                    style={{ color: getGenreColorByName(artist.genres) }}
                                                >
                                                    {getGenreName(artist.genres)}
                                                </span>
                                            </div>

                                            {/* ส่วนกลาง: ข้อมูลเพลง / อีเวนต์ (ซ่อนบนมือถือที่จอเล็กเกินไป w-40 h-40) */}
                                            <div className="hidden md:flex flex-grow flex-col justify-center gap-1.5 lg:gap-2 w-full mt-2 lg:mt-3">
                                                <div className="bg-white/5 border border-white/10 rounded-lg lg:rounded-xl p-1.5 lg:p-2 backdrop-blur-md flex items-center gap-2 transition-colors hover:bg-white/10">
                                                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg bg-gradient-to-br from-[#d000ff]/20 to-[#d000ff]/10 border border-[#d000ff]/30 flex items-center justify-center text-[#d000ff] text-[10px] lg:text-xs flex-shrink-0">🎵</div>
                                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                                        <span className="text-[6px] lg:text-[7px] text-gray-400 uppercase tracking-widest font-bold">Top Track</span>
                                                        <span className="text-[10px] lg:text-xs text-white font-medium line-clamp-1">{artist.songs?.[0]?.title || "Explore Music"}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 border border-white/10 rounded-lg lg:rounded-xl p-1.5 lg:p-2 backdrop-blur-md flex items-center gap-2 transition-colors hover:bg-white/10">
                                                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg bg-gradient-to-br from-[#00E5FF]/20 to-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] text-[10px] lg:text-xs flex-shrink-0">🎫</div>
                                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                                        <span className="text-[6px] lg:text-[7px] text-gray-400 uppercase tracking-widest font-bold">Live Events</span>
                                                        <span className="text-[10px] lg:text-xs text-white font-medium line-clamp-1">{artist.events?.[0]?.eventName || "Upcoming Concerts"}</span>
                                                    </div>
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
