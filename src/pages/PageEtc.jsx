import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import { useArtists } from '../hooks/useArtists';
import { useArtistDetail } from '../hooks/useArtistDetail';
import { getFilteredRandomArtistId } from '../utils/artistHelper'
import useYouTubePlayer from '../hooks/useYouTubePlayer';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import CategoryBackground from '../components/PageAllArtistComponent/CategoryBackground';
import HeroSection from '../components/PageEtcComponent/HeroSection';
import BioSection from '../components/PageEtcComponent/BioSection';
import MusicPlayerSection from '../components/PageEtcComponent/MusicPlayerSection';
import ConcertSection from '../components/PageEtcComponent/ConcertSection';
import StatsSection from '../components/PageEtcComponent/StatsSection';

const PLAYER_ID = 'yt-player-hidden-etc';

export default function PageEtc() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');

    // ── Data ─────────────────────────────────────────────────────────────
    const { artists, loading: loadingAll } = useArtists();

    const targetId = useMemo(() => {
        if (loadingAll) return null;
        return getFilteredRandomArtistId(artists, GENRE_ARTIST_IDS.classic, queryArtistId);
    }, [artists, loadingAll, queryArtistId]);

    const { artist, songs, events, loading: loadingDetail } = useArtistDetail(targetId);

    const loading = loadingAll || loadingDetail;

    // ── Player ────────────────────────────────────────────────────────────
    const {
        isPlaying,
        currentSongIndex,
        progressBarRef,
        currentTimeRef,
        durationRef,
        togglePlayPause,
        changeSong,
        handleSongSelect,
        handleProgressClick,
    } = useYouTubePlayer(songs, PLAYER_ID, {
        autoplay: searchParams.get('autoplay') === 'true'
    });

    // ── Genre Detection ──────────────────────────────────────────────────
    const genreKeyword = useMemo(() => {
        if (!artist?.genres) return 'edm';
        const gNames = artist.genres.map(g => g.genre?.name?.toLowerCase() || "");
        if (gNames.some(n => n.includes('hip') || n.includes('rap'))) return 'hip hop';
        return 'edm';
    }, [artist]);

    // ── Render (player div must always be in DOM from first mount) ────────
    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#2B5AE8] selection:text-white relative">

            {/* Stable hidden player container — ALWAYS rendered, never conditional */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center text-[#00E5FF] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#7000FF] opacity-20 blur-[80px] rounded-full animate-pulse" />
                    <div className="w-16 h-16 border-4 border-white/5 border-t-[#00E5FF] rounded-full animate-spin z-10" />
                    <p className="mt-4 font-black tracking-[0.3em] animate-pulse text-white z-10 uppercase text-xs">Accessing Data...</p>
                </div>
            ) : !artist ? (
                <div className="min-h-screen flex flex-col items-center justify-center text-white">
                    <p className="font-bold text-xl text-[#2B5AE8]">No Artists Found.</p>
                    <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
                </div>
            ) : (
                <>
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
                        .bg-grid-animation { background-size: 100px 100px; background-image: linear-gradient(to right, rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.05) 1px, transparent 1px); animation: panGrid 20s linear infinite; }
                        @keyframes panGrid { 0% { transform: translateY(0); } 100% { transform: translateY(100px); } }
                        .marquee-container { display: flex; width: 200%; animation: marquee 20s linear infinite; }
                        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    `}</style>

                    {/* Animated background */}
                    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-[#0B0C10]" />
                        <CategoryBackground keyword={genreKeyword} isPlaying={isPlaying} />
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={`shimmer-${i}`}
                                className="absolute rotate-45"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: Math.random() * 100 + 50,
                                    height: Math.random() * 100 + 50,
                                    background: i % 2 === 0 ? 'linear-gradient(45deg, #00E5FF10, transparent)' : 'linear-gradient(45deg, #7000FF10, transparent)',
                                    border: `1px solid ${i % 2 === 0 ? '#00E5FF20' : '#7000FF20'}`,
                                    backdropFilter: 'blur(4px)'
                                }}
                                animate={{
                                    x: [0, Math.random() * 50 - 25, 0],
                                    y: [0, Math.random() * 50 - 25, 0],
                                    opacity: isPlaying ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1],
                                    rotate: isPlaying ? [45, 180, 45] : [45, 90, 45],
                                    scale: isPlaying ? [1, 1.1, 1] : [1, 1, 1]
                                }}
                                transition={{
                                    duration: isPlaying ? 6 : Math.random() * 15 + 12,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                        ))}
                        <div className="absolute inset-[-100%] bg-grid-animation z-0 opacity-40" />
                        <div
                            className="absolute inset-0 opacity-[0.05]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px)`,
                                backgroundSize: '100px 100px'
                            }}
                        />
                    </div>

                    <HeroSection artist={artist} events={events} />
                    <BioSection artist={artist} />
                    <MusicPlayerSection
                        artist={artist}
                        songs={songs}
                        currentSongIndex={currentSongIndex}
                        isPlaying={isPlaying}
                        progressBarRef={progressBarRef}
                        currentTimeRef={currentTimeRef}
                        durationRef={durationRef}
                        togglePlayPause={togglePlayPause}
                        changeSong={changeSong}
                        handleSongSelect={handleSongSelect}
                        handleProgressClick={handleProgressClick}
                        currentSong={songs[currentSongIndex]}
                    />
                    <ConcertSection events={events} artist={artist} />
                    <StatsSection songs={songs} />
                </>
            )}
        </div>
    );
}
