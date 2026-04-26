import React, { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadSlim } from '@tsparticles/slim';

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
import HeroSection from '../components/PageRockComponent/HeroSection';
import LineupSection from '../components/PageRockComponent/LineupSection';
import MusicPlayerSection from '../components/PageRockComponent/MusicPlayerSection';
import ConcertSection from '../components/PageRockComponent/ConcertSection';
import StatsSection from '../components/PageRockComponent/StatsSection';
import Reveal from '../components/Reveal';

export default function PageRock() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');

    // ── Data ─────────────────────────────────────────────────────────────
    const { artist, songs, events, loading } = useArtistData(
        GENRE_ARTIST_IDS.rock,
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

    // ── Particles init (stable callback) ──────────────────────────────────
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    // ── Embers (stable random values) ─────────────────────────────────────
    const embers = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1.5,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5,
        xOffset: Math.random() * 100 - 50,
    })), []);

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#D3131F] selection:text-white">

            {/* Animated background - Always renders */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <CategoryBackground keyword="rock" isPlaying={isPlaying} artist={artist} />
            </div>

            {loading && !artist ? (
                <SkeletonHero />
            ) : !artist && !loading ? (
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
                    <p className="font-black text-2xl text-[#D3131F] uppercase tracking-widest drop-shadow-[0_0_10px_#D3131F]">No Rock Artists Found</p>
                    <p className="text-gray-500 mt-2 font-medium tracking-wider">Please run seed to inject data into database.</p>
                </div>
            ) : (
                <div key={artist?.id || 'content'}>
                    <style>{`
                        @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        .cd-rotate { animation: rotateCD 8s linear infinite; }

                        @keyframes beatRun { 0% { height: 10px; } 50% { height: 35px; } 100% { height: 10px; } }
                        .beat-bar { animation: beatRun 1.2s ease-in-out infinite; }
                        .beat-bar:nth-child(2) { animation-delay: 0.1s; }
                        .beat-bar:nth-child(3) { animation-delay: 0.2s; }
                        .beat-bar:nth-child(4) { animation-delay: 0.3s; }
                        .beat-bar:nth-child(5) { animation-delay: 0.4s; }

                        .noise-bg {
                            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
                        }

                        .shape-blob-1 { animation: floatRock 15s ease-in-out infinite; will-change: transform, opacity; }
                        .shape-blob-2 { animation: floatRock 15s ease-in-out infinite reverse; will-change: transform, opacity; }
                        @keyframes floatRock {
                            0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
                            33% { transform: translate(40px, -60px) scale(1.1) rotate(5deg); }
                            66% { transform: translate(-30px, 30px) scale(0.9) rotate(-5deg); }
                        }

                        .bar-spotify-v3 {
                            background: linear-gradient(180deg, #6b7280 0%, #374151 100%);
                            border-radius: 6px 6px 0 0;
                            box-shadow: inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px 0 2px rgba(0,0,0,0.8);
                            transition: all 0.3s ease;
                        }
                        .bar-youtube-v3 {
                            background: linear-gradient(180deg, #ef4444 0%, #b91c1c 100%);
                            border-radius: 6px 6px 0 0;
                            box-shadow: inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.6), 0px 10px 20px rgba(211,19,31,0.2);
                            transition: all 0.3s ease;
                        }

                        @keyframes eqPlay { 0%, 100% { height: 15%; } 50% { height: 100%; } }
                        .eq-bar { animation: eqPlay 1.2s ease-in-out infinite; }

                        .firefly-glow { box-shadow: 0 0 10px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.4); }

                        .tooltip-box { opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                        .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
                    `}</style>

                    <Reveal>
                        <HeroSection artist={artist} events={events} embers={embers} />
                    </Reveal>
                    <Reveal>
                        <LineupSection artist={artist} />
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
