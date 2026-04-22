import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import useArtistData from '../hooks/useArtistData';
import useYouTubePlayer from '../hooks/useYouTubePlayer';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import HeroSection from '../components/PageClassicComponent/HeroSection';
import BioSection from '../components/PageClassicComponent/BioSection';
import MusicPlayerSection from '../components/PageClassicComponent/MusicPlayerSection';
import ConcertSection from '../components/PageClassicComponent/ConcertSection';
import StatsSection from '../components/PageClassicComponent/StatsSection';

const PLAYER_ID = 'yt-player-hidden-classic';

export default function PageClassic() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');

    // ── Data ─────────────────────────────────────────────────────────────
    const { artist, songs, events, loading } = useArtistData(
        GENRE_ARTIST_IDS.classic,
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

    // ── Neon dust particles (stable random values) ────────────────────────
    const neonDust = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
    })), []);

    // ── States ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-[#221c38] min-h-screen flex flex-col items-center justify-center text-[#d83bb6] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#9b2d96] opacity-30 blur-[80px] rounded-full" />
                <div className="w-16 h-16 border-4 border-[#30294e] border-t-[#d83bb6] rounded-full animate-spin z-10 shadow-[0_0_20px_#d83bb6]" />
                <p className="mt-4 font-bold tracking-widest animate-pulse text-[#f9c1db] uppercase z-10 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Vibing...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#221c38] min-h-screen flex flex-col items-center justify-center text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <p className="font-bold text-xl text-[#d83bb6] uppercase">No Artists Found.</p>
                <p className="text-[#f9c1db]/60 mt-2 tracking-widest">Please run seed to inject data into database.</p>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#1c172e] min-h-screen text-[#FFFFFF] overflow-x-hidden selection:bg-[#d83bb6] selection:text-white">

            {/* Stable hidden player container — DO NOT add key or conditional render */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;1,400&display=swap');

                .font-classic { font-family: 'Outfit', sans-serif; }
                .font-sub { font-family: 'Plus Jakarta Sans', sans-serif; }

                .classic-grain {
                    position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cd-rotate { animation: rotateCD 8s linear infinite; }

                @keyframes eqPlay { 0%, 100% { height: 15%; } 50% { height: 100%; } }
                .eq-bar { animation: eqPlay 1.2s ease-in-out infinite; }

                .neon-glow { box-shadow: 0 0 10px #d83bb6, 0 0 20px rgba(249, 193, 219, 0.4); }

                .tooltip-box { opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            <div className="classic-grain" />

            {/* Animated background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#9b2d96] blur-[150px]" />
                <motion.div animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity }} className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#30294e] blur-[120px]" />
                {neonDust.map(f => (
                    <motion.div
                        key={f.id}
                        className="absolute bg-[#f9c1db] rounded-full neon-glow"
                        style={{ 
                            width: f.size, height: f.size, left: `${f.initialX}%`, top: `${f.initialY}%`,
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            x: [0, Math.random() * 150 - 75, 0],
                            y: [0, Math.random() * 150 - 75, 0],
                            opacity: [0, 0.7, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
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
            />
            <ConcertSection events={events} />
            <StatsSection songs={songs} />
        </div>
    );
}