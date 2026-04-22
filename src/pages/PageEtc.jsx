import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import useArtistData from '../hooks/useArtistData';
import useYouTubePlayer from '../hooks/useYouTubePlayer';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
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
    const { artist, songs, events, loading } = useArtistData(
        GENRE_ARTIST_IDS.etc,
        queryArtistId
    );

    // ── Player ────────────────────────────────────────────────────────────
    const {
        isPlaying,
        currentSongIndex,
        progress,
        currentTime,
        duration,
        togglePlayPause,
        changeSong,
        handleSongSelect,
        handleProgressClick,
    } = useYouTubePlayer(songs, PLAYER_ID);

    // ── Background blobs (stable random values) ───────────────────────────
    const floatingBlobs = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        size: Math.random() * 200 + 150,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 5,
        color: i % 2 === 0 ? '#2B5AE8' : '#CEFF67',
    })), []);

    // ── States ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-[#2B5AE8] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2B5AE8] opacity-20 blur-[80px] rounded-full animate-pulse" />
                <div className="w-16 h-16 border-4 border-gray-800 border-t-[#2B5AE8] rounded-full animate-spin z-10" />
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Beats...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold text-xl text-[#2B5AE8]">No Artists Found.</p>
                <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#2B5AE8] selection:text-white relative">

            {/* Stable hidden player container — DO NOT add key or conditional render */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

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
                    background-image: linear-gradient(to right, rgba(43, 90, 232, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(43, 90, 232, 0.05) 1px, transparent 1px);
                    animation: panGrid 20s linear infinite;
                }
                @keyframes panGrid { 0% { transform: translateY(0); } 100% { transform: translateY(100px); } }

                .marquee-container { display: flex; width: 200%; animation: marquee 20s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `}</style>

            {/* Animated background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-[-100%] bg-grid-animation z-0" />
                {floatingBlobs.map(blob => (
                    <motion.div
                        key={blob.id}
                        className="absolute opacity-[0.06] shape-blob z-0"
                        style={{ 
                            width: blob.size, height: blob.size, left: `${blob.x}%`, top: `${blob.y}%`, backgroundColor: blob.color,
                            willChange: 'transform, opacity'
                        }}
                        animate={{ x: [0, 40, -40, 0], y: [0, -60, 60, 0] }}
                        transition={{ duration: blob.duration, delay: blob.delay, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <HeroSection artist={artist} events={events} />
            <BioSection artist={artist} />
            <MusicPlayerSection
                artist={artist}
                songs={songs}
                currentSongIndex={currentSongIndex}
                isPlaying={isPlaying}
                progress={progress}
                currentTime={currentTime}
                duration={duration}
                togglePlayPause={togglePlayPause}
                changeSong={changeSong}
                handleSongSelect={handleSongSelect}
                handleProgressClick={handleProgressClick}
                currentSong={songs[currentSongIndex]}
            />
            <ConcertSection events={events} />
            <StatsSection songs={songs} />
        </div>
    );
}