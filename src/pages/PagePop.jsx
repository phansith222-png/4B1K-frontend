import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Hooks
import { useArtists } from '../hooks/useArtists';
import { useArtistDetail } from '../hooks/useArtistDetail';
import { getFilteredRandomArtistId } from '../utils/artistHelper'
import useYouTubePlayer from '../hooks/useYouTubePlayer';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import CategoryBackground from '../components/PageAllArtistComponent/CategoryBackground';
import HeroSection from '../components/PagePopComponent/HeroSection';
import BioSection from '../components/PagePopComponent/BioSection';
import MusicPlayerSection from '../components/PagePopComponent/MusicPlayerSection';
import ConcertSection from '../components/PagePopComponent/ConcertSection';
import StatsSection from '../components/PagePopComponent/StatsSection';
import Reveal from '../components/Reveal';

const PLAYER_ID = 'yt-player-hidden-pop';

export default function PagePop() {
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
    // The hidden div (#PLAYER_ID) below is a stable DOM node — it must never
    // be conditionally rendered or given a changing key. The hook detects
    // when songs change (new artist) and calls cueVideoById() internally.
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

    // ── Render (always render player div first — it must exist before YouTube API fires) ──
    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans selection:bg-[#FF007F] selection:text-white">

            {/* Stable hidden player container — ALWAYS rendered, never conditional */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center text-[#FF007F] relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E5FF] opacity-10 blur-[80px] rounded-full animate-pulse" />
                    <div className="w-16 h-16 border-4 border-white/10 border-t-[#00E5FF] rounded-full animate-spin z-10" />
                    <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Pop Star...</p>
                </div>
            ) : !artist ? (
                <div className="min-h-screen flex flex-col items-center justify-center text-white">
                    <p className="font-bold text-xl text-[#00E5FF]">No Pop Artists Found.</p>
                    <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
                </div>
            ) : (
                <>
                    {/* Animated background */}
                    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-[#0B0C10]" />
                        <CategoryBackground keyword="pop" isPlaying={isPlaying} />
                        <div
                            className="absolute inset-0 opacity-[0.05]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                                backgroundSize: '100px 100px'
                            }}
                        />
                    </div>

                    <style>{`
                        @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        .cd-rotate { animation: rotateCD 12s linear infinite; }
                        @keyframes eqRun { 0%, 100% { height: 15%; } 50% { height: 90%; } }
                        .eq-bar { animation: eqRun 1.5s ease-in-out infinite; }
                        .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
                    `}</style>

                    <Reveal><HeroSection artist={artist} events={events} /></Reveal>
                    <Reveal><BioSection artist={artist} /></Reveal>
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
                    <Reveal><ConcertSection events={events} artist={artist} /></Reveal>
                    <Reveal><StatsSection songs={songs} /></Reveal>
                </>
            )}
        </div>
    );
}
