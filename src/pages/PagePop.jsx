import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Hooks
import useArtistData from '../hooks/useArtistData';
import useYouTubePlayer from '../hooks/useYouTubePlayer';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import HeroSection from '../components/PagePopComponent/HeroSection';
import BioSection from '../components/PagePopComponent/BioSection';
import MusicPlayerSection from '../components/PagePopComponent/MusicPlayerSection';
import ConcertSection from '../components/PagePopComponent/ConcertSection';
import StatsSection from '../components/PagePopComponent/StatsSection';
import BottomTextSection from '../components/PagePopComponent/BottomTextSection';
import Reveal from '../components/Reveal';

const PLAYER_ID = 'yt-player-hidden-pop';

export default function PagePop() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');

    // ── Data ─────────────────────────────────────────────────────────────
    const { artist, songs, events, loading } = useArtistData(
        GENRE_ARTIST_IDS.pop,
        queryArtistId
    );

    // ── Player ────────────────────────────────────────────────────────────
    // The hidden div (#PLAYER_ID) below is a stable DOM node — it must never
    // be conditionally rendered or given a changing key. The hook detects
    // when songs change (new artist) and calls cueVideoById() internally.
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

    // ── States ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#FF007F] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E5FF] opacity-10 blur-[80px] rounded-full animate-pulse" />
                <div className="w-16 h-16 border-4 border-white/10 border-t-[#00E5FF] rounded-full animate-spin z-10" />
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">
                    Loading Pop Star...
                </p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold text-xl text-[#00E5FF]">No Pop Artists Found.</p>
                <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans selection:bg-[#FF007F] selection:text-white">

            {/* Stable hidden player container — DO NOT add key or conditional render */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

            <style>{`
                .shape-blob-1 { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; animation: morph 8s ease-in-out infinite; }
                .shape-blob-2 { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; animation: morph 8s ease-in-out infinite reverse; }
                @keyframes morph {
                    0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                    34%       { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
                    67%       { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
                }
                @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cd-rotate { animation: rotateCD 12s linear infinite; }
                @keyframes eqRun { 0%, 100% { height: 15%; } 50% { height: 90%; } }
                .eq-bar { animation: eqRun 1.5s ease-in-out infinite; }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            <Reveal>
                <HeroSection artist={artist} events={events} />
            </Reveal>
            <Reveal>
                <BioSection artist={artist} />
            </Reveal>
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
            <Reveal>
                <ConcertSection events={events} />
            </Reveal>
            <Reveal>
                <StatsSection songs={songs} />
            </Reveal>
            <Reveal>
                <BottomTextSection artist={artist} />
            </Reveal>
        </div>
    );
}