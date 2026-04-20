import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadSlim } from "@tsparticles/slim";
import { getAllArtists, getArtistById, getSongsByArtist, getEventsByArtist } from '../api/artist';
import { useSearchParams } from 'react-router-dom'; // เพิ่มบรรทัดนี้

// นำเข้า Components ย่อย
import HeroSection from '../components/PageRockComponent/HeroSection';
import LineupSection from '../components/PageRockComponent/LineupSection';
import MusicPlayerSection from '../components/PageRockComponent/MusicPlayerSection';
import ConcertSection from '../components/PageRockComponent/ConcertSection';
import StatsSection from '../components/PageRockComponent/StatsSection';
import BottomTextSection from '../components/PageRockComponent/BottomTextSection';

export default function PageRock() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= STATE สำหรับ Music Player (YouTube) =================
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    
    const playerRef = useRef(null); 

    // ================= LOGIC ดึงข้อมูลศิลปิน ROCK =================
    useEffect(() => {
        const fetchRandomRockArtist = async () => {
            try {
                setLoading(true);

                const rockArtistIds = [6, 7, 8, 9, 10];

                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];

                let rockArtists = allArtistsList.filter(a => rockArtistIds.includes(a.id));

                if (rockArtists.length === 0 && allArtistsList.length > 0) {
                    rockArtists = allArtistsList.filter(a => {
                        if (!a.genres || a.genres.length === 0) return false;
                        return a.genres.some(ag => ag.genre?.name?.toLowerCase().includes('rock'));
                    });
                }

                let ARTIST_ID;

            if (queryArtistId) {
                ARTIST_ID = Number(queryArtistId); // ถ้าค้นหามา ให้ใช้ ID นั้น
            } 
            else if (rockArtists.length > 0) { // 📌 ต้องเป็น rockArtists (เช็คชื่อให้ดี)
                const randomIndex = Math.floor(Math.random() * rockArtists.length);
                ARTIST_ID = rockArtists[randomIndex].id;
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

                const mainArtist = artistData?.artist || artistData?.data || artistData || rockArtists[0];
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
                console.error("Error fetching rock artist data:", error);
            } finally {
                setLoading(false);
            }
        };

        // ... โค้ด fetch...
        fetchRandomRockArtist();
    }, [queryArtistId]); // 📌 เพิ่ม queryArtistId เข้าไปในวงเล็บนี้
    // ================= LOGIC ระบบเล่นเพลงจาก YOUTUBE =================
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

            playerRef.current = new window.YT.Player('yt-player-hidden-rock', {
                height: '0',
                width: '0',
                videoId: firstVideoId,
                playerVars: { autoplay: 0, controls: 0, showinfo: 0, rel: 0 },
                events: {
                    onReady: () => setIsPlayerReady(true),
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
                        else if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
                        else if (event.data === window.YT.PlayerState.ENDED) handleSongEnded();
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

    const handleSongEnded = () => changeSong(1);

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
    
    // โหลด Engine สำหรับ Particles
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    // สร้างข้อมูลสะเก็ดไฟ (Embers) 
    const embers = React.useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1.5,
        left: Math.random() * 100, 
        delay: Math.random() * 5, 
        duration: Math.random() * 5 + 5, 
        xOffset: Math.random() * 100 - 50, 
    })), []);

    if (loading) {
        return (
            <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-[#D3131F]">
                <div className="w-16 h-16 border-4 border-[#222] border-t-[#D3131F] rounded-full animate-spin shadow-[0_0_15px_#D3131F]"></div>
                <p className="mt-4 font-black tracking-[0.3em] animate-pulse text-white uppercase text-sm">Loading Rock...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-black text-2xl text-[#D3131F] uppercase tracking-widest drop-shadow-[0_0_10px_#D3131F]">No Rock Artists Found</p>
                <p className="text-gray-500 mt-2 font-medium tracking-wider">Please run seed to inject data into database.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#D3131F] selection:text-white">
            
            {/* ซ่อน YouTube Player ไว้ตรงนี้ */}
            <div id="yt-player-hidden-rock" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

            {/* ================= STYLE กำหนดเอฟเฟกต์พิเศษ ================= */}
            <style>{`
                /* --- แผ่น CD หมุน --- */
                @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cd-rotate { animation: rotateCD 8s linear infinite; }

                /* --- Beat เสียงรอบ CD --- */
                @keyframes beatRun { 0% { height: 10px; } 50% { height: 35px; } 100% { height: 10px; } }
                .beat-bar { animation: beatRun 1.2s ease-in-out infinite; }
                .beat-bar:nth-child(2) { animation-delay: 0.1s; }
                .beat-bar:nth-child(3) { animation-delay: 0.2s; }
                .beat-bar:nth-child(4) { animation-delay: 0.3s; }
                .beat-bar:nth-child(5) { animation-delay: 0.4s; }

                /* --- พื้นผิวแบบ Noise --- */
                .noise-bg {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
                }

                /* --- รูปทรงของไหล --- */
                .shape-blob-1 { border-radius: 30% 70% 50% 50% / 30% 40% 60% 70%; animation: morphRock 10s ease-in-out infinite; }
                .shape-blob-2 { border-radius: 50% 50% 30% 70% / 50% 60% 40% 50%; animation: morphRock 10s ease-in-out infinite reverse; }
                @keyframes morphRock {
                    0%, 100% { border-radius: 30% 70% 50% 50% / 30% 40% 60% 70%; }
                    34% { border-radius: 60% 40% 70% 30% / 60% 30% 70% 40%; }
                    67% { border-radius: 40% 60% 30% 70% / 40% 70% 30% 60%; }
                }

                /* --- กราฟแท่งแบบ 3D สมจริง --- */
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

                /* --- Tooltip กราฟ --- */
                .tooltip-box {
                    opacity: 0; transform: translateY(10px); pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            <HeroSection artist={artist} events={events} embers={embers} />
            <LineupSection artist={artist} />
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