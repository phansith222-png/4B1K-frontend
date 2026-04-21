import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getArtistById, getSongsByArtist, getEventsByArtist, getAllArtists } from '../api/artist';
import { useSearchParams } from 'react-router-dom'; 

import HeroSection from '../components/PageClassicComponent/HeroSection';
import BioSection from '../components/PageClassicComponent/BioSection';
import MusicPlayerSection from '../components/PageClassicComponent/MusicPlayerSection';
import ConcertSection from '../components/PageClassicComponent/ConcertSection';
import StatsSection from '../components/PageClassicComponent/StatsSection';
import BottomTextSection from '../components/PageClassicComponent/BottomTextSection';

export default function PageClassic() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    
    const playerRef = useRef(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                setLoading(true);
                const rnbArtistIds = [16, 17, 18, 19, 20];

                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];
                let rnbArtists = allArtistsList.filter(a => rnbArtistIds.includes(a.id));

                if (rnbArtists.length === 0 && allArtistsList.length > 0) {
                    rnbArtists = allArtistsList.filter(a => {
                        if (!a.genres || a.genres.length === 0) return false;
                        return a.genres.some(ag => {
                            const gName = ag.genre?.name?.toLowerCase() || "";
                            return gName.includes('r&b') || gName.includes('rnb');
                        });
                    });
                }

                let ARTIST_ID;

                if (queryArtistId) {
                    ARTIST_ID = Number(queryArtistId);
                } 
                else if (rnbArtists.length > 0) { 
                    const randomIndex = Math.floor(Math.random() * rnbArtists.length);
                    ARTIST_ID = rnbArtists[randomIndex].id;
                } else {
                    setArtist(null);
                    setLoading(false);
                    return;
                }

                const [artistData, songsData, eventsData] = await Promise.all([
                    getArtistById(ARTIST_ID).catch(() => null),
                    getSongsByArtist(ARTIST_ID).catch(() => null), 
                    getEventsByArtist(ARTIST_ID).catch(() => null)
                ]);

                const mainArtist = artistData?.artist || artistData?.data || artistData || rnbArtists[0];
                setArtist(mainArtist);

                let extractedSongs = [];
                if (Array.isArray(songsData)) extractedSongs = songsData;
                else if (songsData?.data && Array.isArray(songsData.data)) extractedSongs = songsData.data;
                else if (songsData?.songs && Array.isArray(songsData.songs)) extractedSongs = songsData.songs;
                else if (mainArtist?.songs && Array.isArray(mainArtist.songs)) extractedSongs = mainArtist.songs;
                
                setSongs(extractedSongs);

                let extractedEvents = [];
                if (Array.isArray(eventsData)) extractedEvents = eventsData;
                else if (eventsData?.data && Array.isArray(eventsData.data)) extractedEvents = eventsData.data;
                else if (eventsData?.events && Array.isArray(eventsData.events)) extractedEvents = eventsData.events;
                else if (mainArtist?.events && Array.isArray(mainArtist.events)) extractedEvents = mainArtist.events;

                setEvents(extractedEvents);

            } catch (error) {
                console.error("Error fetching R&B artist data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [queryArtistId]); 

    const extractYouTubeID = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        if (songs.length === 0) return;

        const initPlayer = () => {
            if (playerRef.current) return;
            const firstVideoId = extractYouTubeID(songs[0].streamUrl) || 'dQw4w9WgXcQ'; 

            playerRef.current = new window.YT.Player('yt-player-hidden-classic', {
                height: '0',
                width: '0',
                videoId: firstVideoId,
                playerVars: { autoplay: 0, controls: 0, showinfo: 0, rel: 0 },
                events: {
                    onReady: () => setIsPlayerReady(true),
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
                        else if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
                        else if (event.data === window.YT.PlayerState.ENDED) changeSong(1);
                    }
                }
            });
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }
    }, [songs]);

    useEffect(() => {
        let interval;
        if (isPlaying && isPlayerReady && playerRef.current?.getCurrentTime) {
            interval = setInterval(() => {
                const current = playerRef.current.getCurrentTime() || 0;
                const total = playerRef.current.getDuration() || 0;
                if (total > 0) {
                    setProgress((current / total) * 100);
                    setCurrentTime(formatTime(current));
                    setDuration(formatTime(total));
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isPlayerReady, currentSongIndex]);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const togglePlayPause = (e) => {
        if(e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
    };

    const changeSong = (directionOrIndex, e, isDirectIndex = false) => {
        if (e) e.stopPropagation();
        if (songs.length === 0 || !playerRef.current || !isPlayerReady) return;

        let next;
        if (isDirectIndex) {
            next = currentSongIndex + directionOrIndex;
        } else {
            next = currentSongIndex + directionOrIndex;
            if (next < 0) next = songs.length - 1;
            if (next >= songs.length) next = 0;
        }
        
        setCurrentSongIndex(next);
        setProgress(0);
        setCurrentTime('0:00');
        
        const nextVideoId = extractYouTubeID(songs[next].streamUrl) || 'dQw4w9WgXcQ';
        playerRef.current.loadVideoById(nextVideoId);
        setIsPlaying(true);
    };

    const handleSongSelect = (idx, e) => {
        e.stopPropagation();
        if (currentSongIndex === idx) {
            togglePlayPause(e);
        } else {
            changeSong(idx - currentSongIndex, e, true);
        }
    };

    const handleProgressClick = (e) => {
        if (!playerRef.current || !isPlayerReady) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        
        const total = playerRef.current.getDuration();
        if (total > 0) {
            playerRef.current.seekTo(percentage * total, true);
            setProgress(percentage * 100);
        }
    };

    const neonDust = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2, 
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 15 + 10, 
        delay: Math.random() * 10,
    })), []);

    if (loading) {
        return (
            <div className="bg-[#221c38] min-h-screen flex flex-col items-center justify-center text-[#d83bb6] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#9b2d96] opacity-30 blur-[80px] rounded-full"></div>
                <div className="w-16 h-16 border-4 border-[#30294e] border-t-[#d83bb6] rounded-full animate-spin z-10 shadow-[0_0_20px_#d83bb6]"></div>
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

    return (
        <div className="bg-[#1c172e] min-h-screen text-[#FFFFFF] overflow-x-hidden selection:bg-[#d83bb6] selection:text-white">
            
            <div id="yt-player-hidden-classic" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;1,400&display=swap');
                
                .font-classic { font-family: 'Outfit', sans-serif; }
                .font-sub { font-family: 'Plus Jakarta Sans', sans-serif; }

                .classic-grain {
                    position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                
                /* CD & Beat Animations */
                @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cd-rotate { animation: rotateCD 8s linear infinite; }

                @keyframes eqPlay { 0%, 100% { height: 15%; } 50% { height: 100%; } }
                .eq-bar { animation: eqPlay 1.2s ease-in-out infinite; }

                .neon-glow { box-shadow: 0 0 10px #d83bb6, 0 0 20px rgba(249, 193, 219, 0.4); }

                .tooltip-box { opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            <div className="classic-grain" />
            
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#9b2d96] blur-[150px]" />
                <motion.div animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity }} className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#30294e] blur-[120px]" />
                
                {neonDust.map(f => (
                    <motion.div
                        key={f.id}
                        className="absolute bg-[#f9c1db] rounded-full neon-glow"
                        style={{ width: f.size, height: f.size, left: `${f.initialX}%`, top: `${f.initialY}%` }}
                        animate={{ 
                            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            opacity: [0, 0.8, 0.2, 0.9, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
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
            <BottomTextSection artist={artist} />

        </div>
    );
}