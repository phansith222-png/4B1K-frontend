import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Hooks
import { useArtists } from '../hooks/useArtists';
import { useArtistDetail } from '../hooks/useArtistDetail';
import { getFilteredRandomArtistId } from '../utils/artistHelper';
import { usePlayerStore } from '../stores/playerStore';
import PageLoader from '../components/PageLoader';
import { SkeletonHero } from '../components/Skeleton';

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
import GenreArtistSidebar from '../components/GenreArtistSidebar';

export default function PagePop() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');

    // ── Data ─────────────────────────────────────────────────────────────
    const { artists, loading: loadingAll } = useArtists();

    const targetId = useMemo(() => {
        if (loadingAll) return null;
        return getFilteredRandomArtistId(artists, 'pop', queryArtistId);
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
        
        // Match by ID or Name for maximum reliability
        return (gId !== '' && gId === aId) || (gName !== '' && gName === aName);
    }, [globalArtist, artist]);

    // Auto-play when artist loads if requested
    React.useEffect(() => {
        if (artist && songs.length > 0 && searchParams.get('autoplay') === 'true') {
            playSongs(artist, songs, 0);
        }
    }, [artist, songs, searchParams, playSongs]);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans selection:bg-[#FF007F] selection:text-white">

            {/* Animated background - Always renders */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <CategoryBackground keyword="pop" isPlaying={isPlaying} artist={artist} />

                {/* Digital Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}
                />
            </div>

            {loading && !artist ? (
                <SkeletonHero />
            ) : !artist && !loading ? (
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
                    <p className="font-bold text-xl text-[#00E5FF]">No Pop Artists Found.</p>
                    <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
                </div>
            ) : (
                <>
                    {/* Sidebars for Artist Discovery */}
                    <GenreArtistSidebar artists={artists} currentArtistId={artist?.id} side="left" genre="pop" />
                    <GenreArtistSidebar artists={artists} currentArtistId={artist?.id} side="right" genre="pop" />

                    <div key={artist?.id || 'content'} className="relative z-10">
                    <style>{`
                        @keyframes panGrid { 0% { transform: translateY(0); } 100% { transform: translateY(50px); } }
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
                                if (isCurrentArtist && controls?.handleProgressClick) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                                    controls.handleProgressClick(percent);
                                }
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
                </>
            )}
        </div>
    );
}
