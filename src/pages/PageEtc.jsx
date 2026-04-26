import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import useArtistData from '../hooks/useArtistData';
import { usePlayerStore } from '../stores/playerStore';
import PageLoader from '../components/PageLoader';
import { SkeletonHero } from '../components/Skeleton';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import CategoryBackground from '../components/PageAllArtistComponent/CategoryBackground';
import HeroSection from '../components/PageEtcComponent/HeroSection';
import BioSection from '../components/PageEtcComponent/BioSection';
import MusicPlayerSection from '../components/PageEtcComponent/MusicPlayerSection';
import ConcertSection from '../components/PageEtcComponent/ConcertSection';
import StatsSection from '../components/PageEtcComponent/StatsSection';
import Reveal from '../components/Reveal';

export default function PageEtc() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');

    // ── Data ─────────────────────────────────────────────────────────────
    const { artist, songs, events, loading } = useArtistData(
        GENRE_ARTIST_IDS.etc,
        queryArtistId
    );

    // ── Player ────────────────────────────────────────────────────────────
    // ── Global Player State - Optimized with Selectors ────────────────────
    const isPlaying = usePlayerStore(state => state.isPlaying);
    const currentSongIndex = usePlayerStore(state => state.currentSongIndex);
    const progress = usePlayerStore(state => state.progress);
    const currentTime = usePlayerStore(state => state.currentTime);
    const duration = usePlayerStore(state => state.duration);
    const controls = usePlayerStore(state => state.controls);
    const playSongs = usePlayerStore(state => state.playSongs);
    const globalSongs = usePlayerStore(state => state.songs);

    const isCurrentArtist = globalSongs === songs && songs.length > 0;

    // Auto-play when artist loads if requested
    React.useEffect(() => {
        if (artist && songs.length > 0 && searchParams.get('autoplay') === 'true') {
            playSongs(artist, songs, 0);
        }
    }, [artist, songs, searchParams, playSongs]);

    // ── Genre Detection ──────────────────────────────────────────────────
    const genreKeyword = useMemo(() => {
        if (!artist?.genres) return 'edm';
        const gNames = artist.genres.map(g => g.genre?.name?.toLowerCase() || "");
        if (gNames.some(n => n.includes('hip') || n.includes('rap'))) return 'hip hop';
        return 'edm';
    }, [artist]);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#2B5AE8] selection:text-white relative">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;900&display=swap');
                body { font-family: 'Outfit', sans-serif; }

                .shape-blob { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; filter: blur(90px); }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .vinyl-rotate { animation: spin-slow 12s linear infinite; }
                .cd-rotate { animation: spin-slow 12s linear infinite; }

                .eq-bar { animation: eqRun 1.5s ease-in-out infinite; }
                @keyframes eqRun { 0%, 100% { height: 20%; } 50% { height: 100%; } }

                .tooltip-box { opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }

                .bg-grid-animation {
                    background-size: 100px 100px;
                    background-image: linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
                    animation: panGrid 20s linear infinite;
                }
                @keyframes panGrid { 0% { transform: translateY(0); } 100% { transform: translateY(50px); } }

                .marquee-container { display: flex; width: 200%; animation: marquee 20s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `}</style>

            {/* Animated background - Always renders */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Solid background removed to reveal Layout foundation */}
                <CategoryBackground keyword={genreKeyword} isPlaying={isPlaying} artist={artist} />

                {/* Random Theme Shimmer Boxes - ONLY FOR EDM & REDUCED COUNT */}
                {genreKeyword === 'edm' && [...Array(12)].map((_, i) => (
                    <motion.div
                        key={`shimmer-${i}`}
                        className="absolute rotate-45"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: Math.random() * 120 + 80,
                            height: Math.random() * 120 + 80,
                            background: i % 2 === 0 ? 'linear-gradient(45deg, #00E5FF40, transparent)' : 'linear-gradient(45deg, #FF00FF40, transparent)',
                            border: `2px solid ${i % 2 === 0 ? '#00E5FF80' : '#FF00FF80'}`,
                            backdropFilter: 'blur(8px)',
                            boxShadow: `0 0 50px ${i % 2 === 0 ? '#00E5FF25' : '#FF00FF25'}`
                        }}
                        animate={{
                            x: [0, Math.random() * 30 - 15, 0],
                            y: [0, Math.random() * 30 - 15, 0],
                            opacity: isPlaying ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05],
                            rotate: isPlaying ? [45, 135, 45] : [45, 60, 45],
                            scale: isPlaying ? [1, 1.1, 1] : [1, 1, 1]
                        }}
                        transition={{
                            duration: isPlaying ? 2.0 : Math.random() * 8 + 8,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                ))}

                {/* Original Panning Grid Animation (Updated to theme color) */}
                <div className="absolute inset-[-100%] bg-grid-animation z-0 opacity-40" />

                {/* Digital Grid Overlay (Static layer for depth) */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />
            </div>

            {loading && !artist ? (
                <SkeletonHero />
            ) : !artist && !loading ? (
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
                    <p className="font-bold text-xl text-[#2B5AE8]">No Artists Found.</p>
                    <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
                </div>
            ) : (
                <div key={artist?.id || 'content'}>
                    <Reveal>
                        <HeroSection artist={artist} events={events} />
                    </Reveal>
                    <Reveal>
                        <BioSection artist={artist} />
                    </Reveal>
                    <Reveal>
                        <MusicPlayerSection
                            artist={artist}
                            songs={songs}
                            currentSongIndex={isCurrentArtist ? currentSongIndex : 0}
                            isPlaying={isCurrentArtist ? isPlaying : false}
                            progress={isCurrentArtist ? progress : 0}
                            currentTime={isCurrentArtist ? currentTime : '0:00'}
                            duration={isCurrentArtist ? duration : '0:00'}
                            togglePlayPause={() => {
                                if (!isCurrentArtist) playSongs(artist, songs, 0);
                                else if (controls?.togglePlayPause) controls.togglePlayPause();
                            }}
                            changeSong={(dir) => {
                                if (!isCurrentArtist) playSongs(artist, songs, 0);
                                else if (controls?.changeSong) controls.changeSong(dir);
                            }}
                            handleSongSelect={(idx) => {
                                if (!isCurrentArtist) playSongs(artist, songs, idx);
                                else if (controls?.handleSongSelect) controls.handleSongSelect(idx);
                            }}
                            handleProgressClick={(e) => {
                                if (isCurrentArtist && controls?.handleProgressClick) controls.handleProgressClick(e);
                            }}
                            currentSong={songs[isCurrentArtist ? currentSongIndex : 0]}
                        />
                    </Reveal>
                    <Reveal>
                        <ConcertSection events={events} artist={artist} />
                    </Reveal>
                    <Reveal>
                        <StatsSection songs={songs} />
                    </Reveal>
                </div>
            )}
        </div>
    );
}
