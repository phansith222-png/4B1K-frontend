import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllArtists } from '../api/artist';

import HeroSection from '../components/PageAllArtistComponent/HeroSection';
import CategorySection from '../components/PageAllArtistComponent/CategorySection';
import BottomTextSection from '../components/PageAllArtistComponent/BottomTextSection';
import Reveal from '../components/Reveal';

export default function PageAllArtist() {
    const navigate = useNavigate();
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

    // 2. จัดหมวดหมู่ศิลปินแบบ "เจาะจงเป๊ะๆ" (ป้องกันการซ้ำ)
    const sections = useMemo(() => {
        const categories = [
            {
                title: "POP & IDOLS", keyword: "pop", targetIds: [1, 2, 3, 4, 5],
                primary: "#FF00FF", secondary: "#00E5FF",
                desc: "The mainstream phenomenon shaping the sound of modern youth."
            },
            {
                title: "ROCK ARENA", keyword: "rock", targetIds: [6, 7, 8, 9, 10],
                primary: "#D3131F", secondary: "#b91c1c",
                desc: "Raw energy, distortion, and the voices that echo through stadiums."
            },
            {
                title: "CLASSIC & R&B", keyword: "r&b", targetIds: [16, 17, 18, 19, 20],
                primary: "#d83bb6", secondary: "#f9c1db",
                desc: "Smooth soul, timeless melodies, and the golden heritage of R&B artistry."
            },
            {
                title: "HIP HOP CULTURE", keyword: "hip hop", targetIds: [11, 12, 13, 14, 15],
                primary: "#FF00FF", secondary: "#7000FF",
                desc: "The rhythm of the streets, poetic flow, and heavy bass beats."
            },
            {
                title: "EDM UNIVERSE", keyword: "edm", targetIds: [21, 22, 23, 24, 25],
                primary: "#7000FF", secondary: "#00E5FF",
                desc: "Electronic energy, synthesizer waves, and the future of dance music."
            }
        ];

        // ใช้ Set เก็บ ID ที่ถูกจัดหมวดหมู่ไปแล้ว เพื่อไม่ให้ไปโผล่ซ้ำในหมวดอื่น
        const assignedArtistIds = new Set();

        return categories.map(cat => {
            const filtered = artists.filter(artist => {
                const aId = Number(artist.id);

                if (assignedArtistIds.has(aId)) return false;

                const isMatchId = cat.targetIds.includes(aId);
                const isMatchGenre = artist.genres?.some(g => {
                    const gName = g.genre?.name?.toLowerCase() || "";
                    if (cat.keyword === 'r&b') return gName.includes('r&b') || gName.includes('rnb');
                    if (cat.keyword === 'hip hop') return gName.includes('hip') || gName.includes('rap');
                    return gName.includes(cat.keyword);
                });

                if (isMatchId || isMatchGenre) {
                    assignedArtistIds.add(aId);
                    return true;
                }
                return false;
            });

            return { ...cat, artists: filtered };
        });
    }, [artists]);

    // สร้างข้อมูลตัวโน้ตดนตรีลอยๆ
    const floatingNotes = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        symbol: ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)],
        size: Math.random() * 20 + 15,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
    })), []);


    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#00E5FF]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7000FF] opacity-20 blur-[80px] rounded-full"></div>
                <div className="w-16 h-16 border-4 border-white/5 border-t-[#00E5FF] rounded-full animate-spin z-10"></div>
                <p className="mt-4 font-black tracking-[0.3em] uppercase animate-pulse z-10">Archiving Artists...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden relative">

            {/* ================= STYLE ================= */}
            <style>{`
                .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); }
                .mesh-gradient { position: absolute; inset: 0; z-index: 0; filter: blur(80px); animation: mesh-move 20s ease-in-out infinite alternate; background: radial-gradient(circle at var(--x1, 20%) var(--y1, 20%), rgba(255, 0, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at var(--x2, 80%) var(--y2, 80%), rgba(0, 229, 255, 0.1) 0%, transparent 40%), radial-gradient(circle at var(--x3, 50%) var(--y3, 50%), rgba(112, 0, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at var(--x4, 20%) var(--y4, 80%), rgba(255, 0, 255, 0.05) 0%, transparent 40%); }
                @keyframes mesh-move { 0% { --x1: 20%; --y1: 20%; --x2: 80%; --y2: 80%; --x3: 50%; --y3: 50%; --x4: 20%; --y4: 80%; } 100% { --x1: 80%; --y1: 80%; --x2: 20%; --y2: 20%; --x3: 20%; --y3: 50%; --x4: 50%; --y4: 80%; } }
                .dark-grain { position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 100; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
                
                /* ซ่อน Scrollbar ของ Slider */
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                /* แอนิเมชันแผ่นเสียงหมุน */
                @keyframes spin-vinyl {
                    100% { transform: rotate(360deg); }
                }
                .hero-vinyl {
                    background: repeating-radial-gradient(circle, #0B0C10, #0B0C10 3px, #1A1C23 4px, #0B0C10 5px);
                    border: 10px solid #050505;
                    box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.1);
                    animation: spin-vinyl 10s linear infinite;
                }
            `}</style>

            <div className="dark-grain" />

            <Reveal>
                <HeroSection floatingNotes={floatingNotes} />
            </Reveal>

            {/* ================= ARTIST SECTIONS (CAROUSEL) ================= */}
            {sections.map((section, sIdx) => section.artists.length > 0 && (
                <Reveal key={sIdx}>
                    <CategorySection section={section} navigate={navigate} />
                </Reveal>
            ))}

            <Reveal>
                <BottomTextSection />
            </Reveal>

        </div>
    );
}