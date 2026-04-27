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
import HeroSection from '../components/PageClassicComponent/HeroSection';
import BioSection from '../components/PageClassicComponent/BioSection';
import MusicPlayerSection from '../components/PageClassicComponent/MusicPlayerSection';
import ConcertSection from '../components/PageClassicComponent/ConcertSection';
import StatsSection from '../components/PageClassicComponent/StatsSection';
import ArtistPageSkeleton from '../components/Skeleton/ArtistPageSkeleton';

const PLAYER_ID = 'yt-player-hidden-classic';

export default function PageClassic() {
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
        progress,
        currentTime,
        duration,
        togglePlayPause,
        changeSong,
        handleSongSelect,
        handleProgressClick,
        progressBarRef,
        currentTimeRef,
        durationRef
    } = useYouTubePlayer(songs, PLAYER_ID, {
        autoplay: searchParams.get('autoplay') === 'true'
    });

    // ── Neon dust particles (stable random values) ────────────────────────
    const neonDust = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
    })), []);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#1c172e] min-h-screen text-[#FFFFFF] overflow-x-hidden selection:bg-[#d83bb6] selection:text-white">

            {/* Stable hidden player container — DO NOT add key or conditional render */}
            <div id={PLAYER_ID} className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" />

            {/* ── จัดการ State การแสดงผลตรงนี้แทน ── */}
            {loading ? (
                <ArtistPageSkeleton />
            ) : !artist ? (
                <div className="min-h-[80vh] flex flex-col items-center justify-center text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <p className="font-bold text-xl text-[#d83bb6] uppercase">No Artists Found.</p>
                    <p className="text-[#f9c1db]/60 mt-2 tracking-widest">Please run seed to inject data into database.</p>
                </div>
            ) : (
                <>
                    {/* Animated background */}
                    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                        <CategoryBackground keyword="r&b" isPlaying={isPlaying} artist={artist} />
                    </div>

                    <HeroSection artist={artist} events={events} />
                    <BioSection artist={artist} />
                    <MusicPlayerSection
                        artist={artist}
                        songs={songs}
                        currentSongIndex={currentSongIndex}
                        isPlaying={isPlaying}
                        // 🌟 ส่ง Refs ไปแทน State
                        progressBarRef={progressBarRef}
                        currentTimeRef={currentTimeRef}
                        durationRef={durationRef}
                        togglePlayPause={togglePlayPause}
                        changeSong={changeSong}
                        handleSongSelect={handleSongSelect}
                        handleProgressClick={handleProgressClick}
                    />
                    <ConcertSection events={events} artist={artist} />
                    <StatsSection songs={songs} />
                </>
            )}
        </div>
    );
}
