import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import useArtistData from '../hooks/useArtistData';
import useYouTubePlayer from '../hooks/useYouTubePlayer';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import CategoryBackground from '../components/PageAllArtistComponent/CategoryBackground';
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
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#d83bb6] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d83bb6] opacity-20 blur-[80px] rounded-full animate-pulse" />
                <div className="w-16 h-16 border-4 border-white/5 border-t-[#d83bb6] rounded-full animate-spin z-10" />
                <p className="mt-4 font-black tracking-[0.3em] animate-pulse text-white z-10 uppercase text-xs">Loading Classics...</p>
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

            {/* Animated background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#0B0C10]" />
                <CategoryBackground keyword="r&b" isPlaying={isPlaying} />
                
                {/* Digital Grid Overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.05]" 
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
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
