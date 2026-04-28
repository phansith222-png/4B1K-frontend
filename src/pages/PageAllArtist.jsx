import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllArtists } from '../api/artist';

import HeroSection from '../components/PageAllArtistComponent/HeroSection';
import CategorySection from '../components/PageAllArtistComponent/CategorySection';
import BottomTextSection from '../components/PageAllArtistComponent/BottomTextSection';
import Reveal from '../components/Reveal';
import BackButton from '../components/BackButton';
import PageLoader from '../components/PageLoader';
import { SkeletonHero, SkeletonGrid } from '../components/Skeleton';

export default function PageAllArtist() {
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spotlightArtist, setSpotlightArtist] = useState(null);

    // 1. ดึงข้อมูลศิลปินทั้งหมดจาก Backend
    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const res = await getAllArtists();
                const data = res?.artists || res?.data?.artists || res?.data || (Array.isArray(res) ? res : []);
                const finalData = Array.isArray(data) ? data : [];
                setArtists(finalData);

                // Pick a random spotlight artist
                if (data.length > 0) {
                    const randomArtist = data[Math.floor(Math.random() * data.length)];
                    setSpotlightArtist(randomArtist);
                }
            } catch (error) {
                console.error("Error fetching all artists:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    // 2. สุ่ม Spotlight Artist ทุกๆ 5 วินาที
    useEffect(() => {
        if (artists.length > 0) {
            const interval = setInterval(() => {
                const randomArtist = artists[Math.floor(Math.random() * artists.length)];
                setSpotlightArtist(randomArtist);
            }, 20000); // Increased from 5s to 20s to reduce re-renders
            return () => clearInterval(interval);
        }
    }, [artists]);

    // 3. จัดหมวดหมู่ศิลปินแบบ "เจาะจงเป๊ะๆ" (ป้องกันการซ้ำ)
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

    // Optimized floating notes (Reduced count from 20 to 8 for performance)
    const floatingNotes = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        symbol: ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)],
        size: Math.random() * 20 + 15,
        left: (Math.random() - 1) * 800,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10, // Slower duration for better performance
        color: ['#FF00FF', '#00E5FF', '#7000FF', '#FFFFFF'][Math.floor(Math.random() * 4)],
        blur: Math.random() * 1,
        sway: (Math.random() - 0.5) * 80,
        swaySpeed: Math.random() * 3 + 1,
    })), []);


    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden relative">
            <BackButton />

            {/* ================= STYLE ================= */}
            <style>{`
                .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); }
                .bg-noise { 
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    filter: contrast(150%) brightness(100%);
                }
            `}</style>

            {/* Unified Foundation Layer - Always Renders */}
            <div className="fixed inset-0 bg-[#0B0C10] z-[-1]" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Large Background Text */}
                <div className="absolute top-[10%] left-[-2%] text-[18vw] font-black text-white opacity-[0.02] select-none leading-none tracking-tighter uppercase font-heading">
                    Discover
                </div>
                <div className="absolute bottom-[15%] right-[-2%] text-[18vw] font-black text-white opacity-[0.02] select-none leading-none tracking-tighter uppercase font-heading">
                    Legends
                </div>

                <div className="mesh-gradient opacity-20" />
            </div>

            <div className="dark-grain" />

            {loading ? (
                <div className="pt-20">
                    <SkeletonHero />
                    <div className="px-6 md:px-12">
                        <SkeletonGrid count={5} />
                    </div>
                </div>
            ) : (
                <>
                    <Reveal>
                        <HeroSection floatingNotes={floatingNotes} spotlightArtist={spotlightArtist} />
                    </Reveal>

                    {/* ================= CONTENT ================= */}
                    <div id="artists-content" className="relative z-10">
                        {sections.map((section, sIdx) => section.artists.length > 0 && (
                            <Reveal key={sIdx}>
                                <CategorySection section={section} navigate={navigate} />
                            </Reveal>
                        ))}
                    </div>

                    <Reveal>
                        <BottomTextSection />
                    </Reveal>
                </>
            )}
        </div>
    );
}
