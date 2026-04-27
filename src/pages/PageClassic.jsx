import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Hooks
import useArtistData from '../hooks/useArtistData';
import { getImageUrl } from '../utils/imageUtils';
import PageLoader from '../components/PageLoader';
import { usePlayerStore } from '../stores/playerStore';
import { SkeletonHero } from '../components/Skeleton';

// Constants
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

// Components
import CategoryBackground from '../components/PageAllArtistComponent/CategoryBackground';
import HeroSection from '../components/PageClassicComponent/HeroSection';
import BioSection from '../components/PageClassicComponent/BioSection';
import MusicPlayerSection from '../components/PageClassicComponent/MusicPlayerSection';
import ConcertSection from '../components/PageClassicComponent/ConcertSection';
import StatsSection from '../components/PageClassicComponent/StatsSection';
import Reveal from '../components/Reveal';

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

    // ── Global Player State - Optimized with Selectors ────────────────────
    const isPlaying = usePlayerStore(state => state.isPlaying);
    const currentSongIndex = usePlayerStore(state => state.currentSongIndex);
    const progress = usePlayerStore(state => state.progress);
    const currentTime = usePlayerStore(state => state.currentTime);
    const duration = usePlayerStore(state => state.duration);
    const controls = usePlayerStore(state => state.controls);
    const playSongs = usePlayerStore(state => state.playSongs);
    const globalArtist = usePlayerStore(state => state.artist);
    const isCurrentArtist = React.useMemo(() => {
        if (!globalArtist || !artist) return false;
        const gId = String(globalArtist.id || globalArtist._id || '');
        const aId = String(artist.id || artist._id || '');
        const gName = String(globalArtist.artistName || '').toLowerCase().trim();
        const aName = String(artist.artistName || '').toLowerCase().trim();
        
        return (gId !== '' && gId === aId) || (gName !== '' && gName === aName);
    }, [globalArtist, artist]);

    // Auto-play when artist loads if requested
    React.useEffect(() => {
        if (artist && songs.length > 0 && searchParams.get('autoplay') === 'true') {
            playSongs(artist, songs, 0);
        }
    }, [artist, songs, searchParams, playSongs]);

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

            {/* Animated background - Always renders */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <CategoryBackground keyword="r&b" isPlaying={isPlaying} artist={artist} />
            </div>

            {loading && !artist ? (
                <SkeletonHero />
            ) : !artist && !loading ? (
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <p className="font-bold text-xl text-[#d83bb6] uppercase">No Artists Found.</p>
                    <p className="text-[#f9c1db]/60 mt-2 tracking-widest">Please run seed to inject data into database.</p>
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
