import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadSlim } from "@tsparticles/slim";
import { getAllArtists, getArtistById, getSongsByArtist, getEventsByArtist } from '../api/artist';

export default function PageRock() {
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
    
    const playerRef = useRef(null); // ใช้สำหรับอ้างอิง YouTube Player

    // ================= LOGIC ดึงข้อมูลศิลปิน ROCK =================
    useEffect(() => {
        const fetchRandomRockArtist = async () => {
            try {
                setLoading(true);

                // 1. กำหนด ID ของศิลปินแนว ROCK อ้างอิงจากไฟล์ seed.js 
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
                if (rockArtists.length > 0) {
                    const randomIndex = Math.floor(Math.random() * rockArtists.length);
                    ARTIST_ID = rockArtists[randomIndex].id;
                } else if (allArtistsList.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allArtistsList.length);
                    ARTIST_ID = allArtistsList[randomIndex].id;
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

        fetchRandomRockArtist();
    }, []);

    // ================= LOGIC ระบบเล่นเพลงจาก YOUTUBE =================
    const currentSong = songs[currentSongIndex] || null;

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

            playerRef.current = new window.YT.Player('yt-player-hidden', {
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
        e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
    };

    const changeSong = (direction, e) => {
        if (e) e.stopPropagation();
        if (songs.length === 0 || !playerRef.current || !isPlayerReady) return;

        let next = currentSongIndex + direction;
        if (next < 0) next = songs.length - 1;
        if (next >= songs.length) next = 0;
        
        setCurrentSongIndex(next);
        setProgress(0);
        setCurrentTime('0:00');
        
        const nextVideoId = extractYouTubeID(songs[next].streamUrl) || 'dQw4w9WgXcQ';
        playerRef.current.loadVideoById(nextVideoId);
        setIsPlaying(true);
    };

    const handleSongEnded = () => changeSong(1);

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
            <div className="bg-[#111111] min-h-screen flex flex-col items-center justify-center text-[#D3131F]">
                <div className="w-16 h-16 border-4 border-[#333] border-t-[#D3131F] rounded-full animate-spin"></div>
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white uppercase">Loading Rock...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#111111] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold text-xl text-[#D3131F] uppercase">No Rock Artists Found.</p>
                <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#111111] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#D3131F] selection:text-white">
            
            {/* ซ่อน YouTube Player ไว้ตรงนี้ */}
            <div id="yt-player-hidden" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

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
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
                }

                /* --- รูปทรงของไหล --- */
                .shape-blob-1 { border-radius: 30% 70% 50% 50% / 30% 40% 60% 70%; animation: morphRock 10s ease-in-out infinite; }
                .shape-blob-2 { border-radius: 50% 50% 30% 70% / 50% 60% 40% 50%; animation: morphRock 10s ease-in-out infinite reverse; }
                @keyframes morphRock {
                    0%, 100% { border-radius: 30% 70% 50% 50% / 30% 40% 60% 70%; }
                    34% { border-radius: 60% 40% 70% 30% / 60% 30% 70% 40%; }
                    67% { border-radius: 40% 60% 30% 70% / 40% 70% 30% 60%; }
                }

                /* --- แอนิเมชั่นพื้นหลัง Hero Section --- */
                @keyframes cinematicPan {
                    0% { transform: scale(1.05) translate(0%, 0%); }
                    50% { transform: scale(1.15) translate(-1%, 1%); }
                    100% { transform: scale(1.05) translate(0%, 0%); }
                }
                .hero-bg-texture {
                    background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop');
                    background-size: cover; background-position: center; animation: cinematicPan 25s ease-in-out infinite;
                }

                /* --- กราฟแท่งแบบ 3D สมจริงตามเรฟ --- */
                .bar-spotify-v3 {
                    background: linear-gradient(180deg, #9ca3af 0%, #4b5563 100%);
                    border-radius: 4px 4px 0 0;
                    box-shadow: inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.5);
                    transition: all 0.3s ease;
                }
                .bar-youtube-v3 {
                    background: linear-gradient(180deg, #ef4444 0%, #991b1b 100%);
                    border-radius: 4px 4px 0 0;
                    box-shadow: inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.5), 0px 10px 20px rgba(211,19,31,0.4);
                    transition: all 0.3s ease;
                }

                /* --- Tooltip กราฟ --- */
                .tooltip-box {
                    opacity: 0; transform: translateY(10px); pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden bg-[#050505]">

                <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
                    <motion.div 
                        className="absolute inset-0 opacity-40 mix-blend-overlay grayscale-[80%]"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2500&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <motion.div
                        className="absolute w-[600px] h-[600px] rounded-full bg-[#D3131F] opacity-20 blur-[120px]"
                        animate={{ x: ['-10%', '20%', '-10%'], y: ['-10%', '10%', '-10%'] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        style={{ top: '0%', left: '10%' }}
                    />
                    <motion.div
                        className="absolute w-[500px] h-[500px] rounded-full bg-[#D3131F] opacity-15 blur-[100px]"
                        animate={{ x: ['20%', '-20%', '20%'], y: ['10%', '-10%', '10%'] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        style={{ bottom: '0%', right: '10%' }}
                    />

                    {embers.map((ember) => (
                        <motion.div
                            key={ember.id}
                            className="absolute rounded-full bg-[#D3131F]"
                            style={{
                                width: ember.size, height: ember.size, left: `${ember.left}%`, bottom: '-5%',
                                boxShadow: '0 0 8px #D3131F, 0 0 15px #ff4d4d',
                            }}
                            initial={{ y: 0, opacity: 0, x: 0 }}
                            animate={{
                                y: [0, -800, -1200], 
                                opacity: [0, 0.8, 1, 0], 
                                x: [0, ember.xOffset, ember.xOffset * 1.5] 
                            }}
                            transition={{ duration: ember.duration, delay: ember.delay, repeat: Infinity, ease: "linear" }}
                        />
                    ))}
                </div>

                <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-[#111111] to-transparent z-0 pointer-events-none"></div>

                <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center mt-10 z-10">
                    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-gray-800 shadow-[0_30px_60px_rgba(0,0,0,0.9)] bg-black group">
                        <img
                            src={artist.profileImage || "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=2000&auto=format&fit=crop"}
                            alt={artist.artistName}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[10s] ease-out group-hover:scale-105 grayscale-[30%]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-95"></div>

                        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-20">
                            <h1 className="text-4xl md:text-7xl lg:text-[7rem] leading-[0.85] font-black uppercase tracking-tighter text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] transition-colors duration-500 group-hover:text-[#D3131F] group-hover:drop-shadow-[0_0_40px_rgba(211,19,31,0.8)] cursor-default">
                                {artist.artistName}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 mt-12 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl border-t border-gray-800 pt-8 px-4">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 mb-6 md:mb-0">
                        <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase text-gray-500">UPCOMING TOUR</h2>
                        <div className="flex items-center gap-3 mt-1">
                            {events.length > 0 ? (
                                <>
                                    <span className="text-[#D3131F] font-black text-2xl">
                                        {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                    </span>
                                    <span className="w-[1px] h-6 bg-gray-700"></span>
                                    <span className="text-gray-200 font-medium tracking-wide text-sm md:text-base uppercase line-clamp-1">
                                        {events[0].event?.eventName || events[0].eventName}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-400 font-medium uppercase">No upcoming tours announced</span>
                            )}
                        </div>
                    </div>
                    <button className="bg-[#D3131F] text-white px-10 py-3.5 rounded font-black tracking-widest uppercase text-sm hover:bg-red-700 transition-colors shadow-[0_5px_20px_rgba(211,19,31,0.3)] hover:shadow-[0_8px_25px_rgba(211,19,31,0.5)] border border-[#D3131F] hover:border-red-500">
                        GET TICKETS
                    </button>
                </div>
            </section>

            {/* ================= 2. LINEUP SECTION ================= */}
            <section className="relative w-full py-24 px-6 bg-gradient-to-b from-[#111111] via-[#1a1213] to-[#111111] overflow-hidden border-y border-gray-900">
                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col gap-4">
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter hover:text-[#D3131F] hover:drop-shadow-[0_0_25px_rgba(211,19,31,0.6)] transition-all duration-300 cursor-default uppercase">
                        {artist.artistName}
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-400 tracking-tighter hover:text-white hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 cursor-default uppercase">
                        {artist.agency?.name || 'ROCK ICON'}
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-500 tracking-tighter hover:text-[#8D99AE] hover:drop-shadow-[0_0_25px_rgba(141,153,174,0.6)] transition-all duration-300 cursor-default uppercase">
                        ROCK MUSIC
                    </h2>
                    
                    <div className="mt-10 pt-10 border-t border-gray-800 max-w-3xl mx-auto">
                        <p className="text-sm md:text-lg font-bold text-[#8D99AE] tracking-widest leading-loose uppercase">
                            {artist.biography || "Biography not available at the moment. Keep streaming and supporting the artist!"}
                        </p>
                        <p className="text-xl md:text-2xl font-black text-white mt-8 tracking-widest border-l-4 border-[#D3131F] pl-4 inline-block uppercase">
                            {artist.agency?.name || 'ROCK'} RECORDS <span className="text-[#D3131F]">/</span> THAI ROCK
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MEDIA SECTION ================= */}
            <section className="relative w-full py-24 px-6 overflow-hidden noise-bg">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[600px] bg-gradient-to-r from-[#D3131F] via-[#111111] to-[#8D99AE] rounded-[100%] blur-[120px] animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
                        <div className="w-10 h-1 bg-[#D3131F]"></div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-widest uppercase text-white">Top Tracks</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-20">
                        {songs.slice(0, 4).map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (currentSongIndex === idx) {
                                        togglePlayPause(e);
                                    } else {
                                        setCurrentSongIndex(idx);
                                        setProgress(0);
                                        setCurrentTime('0:00');
                                        if (playerRef.current && isPlayerReady) {
                                            const ytId = extractYouTubeID(songs[idx].streamUrl) || 'dQw4w9WgXcQ';
                                            playerRef.current.loadVideoById(ytId);
                                            setIsPlaying(true);
                                        }
                                    }
                                }}
                                className={`border ${currentSongIndex === idx ? 'border-[#D3131F] bg-[#1a1112]' : 'border-gray-800 bg-[#151515]'} hover:border-[#D3131F] text-white rounded-lg p-5 md:p-6 transition-all duration-300 group flex items-center gap-6 hover:bg-[#1a1112] text-left shadow-lg`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded border ${currentSongIndex === idx ? 'border-[#D3131F] text-[#D3131F]' : 'border-gray-700 text-gray-600'} bg-black flex items-center justify-center font-black text-xl group-hover:text-[#D3131F] group-hover:border-[#D3131F] transition-all transform group-hover:scale-105 shadow-inner`}>
                                    {currentSongIndex === idx && isPlaying ? (
                                        <div className="flex gap-0.5 items-end h-4">
                                            <div className="w-1 bg-[#D3131F] eq-bar" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1 bg-[#D3131F] eq-bar" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-1 bg-[#D3131F] eq-bar" style={{ animationDelay: '0.3s' }}></div>
                                        </div>
                                    ) : (
                                        `0${idx + 1}`
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-0.5">
                                    <span className="text-[10px] tracking-widest uppercase text-gray-500 font-bold">Top Hit</span>
                                    <span className="font-black text-lg md:text-xl leading-tight line-clamp-1 group-hover:text-white transition-colors">{item.title}</span>
                                    <span className="text-xs text-[#D3131F] font-bold tracking-wider">
                                        {item.popularity ? `${(item.popularity / 1000000).toFixed(1)}M` : 'Trending'} Streams
                                    </span>
                                </div>
                            </button>
                        ))}
                        {songs.length === 0 && (
                            <p className="text-gray-500 py-10 col-span-2">No songs available for this artist.</p>
                        )}
                    </div>

                    {/* MUSIC PLAYER CONTROLS (ROCK THEME) */}
                    {songs.length > 0 && currentSong && (
                    <div className="w-full max-w-4xl mx-auto bg-[#0a0a0a] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10 border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D3131F] opacity-10 blur-[80px] pointer-events-none"></div>

                        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-end justify-center gap-1.5 opacity-30 z-0 overflow-hidden">
                                {[...Array(14)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-gradient-to-t from-[#D3131F] to-[#8D99AE] rounded-t-sm eq-bar"
                                        style={{ 
                                            animationDelay: `${(i % 5) * 0.15}s`, 
                                            animationDuration: `${1 + (i % 4) * 0.2}s`,
                                            animationPlayState: isPlaying ? 'running' : 'paused' 
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <div className="absolute inset-0 flex items-end justify-center gap-1.5 opacity-50 z-0 overflow-hidden">
                                {[...Array(14)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-gradient-to-t from-[#D3131F] to-[#8D99AE] rounded-t-sm beat-bar"
                                        style={{ 
                                            animationDuration: `${0.8 + Math.random() * 0.5}s`,
                                            animationPlayState: isPlaying ? 'running' : 'paused' 
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <div className="w-36 h-36 rounded-full bg-[#111111] border-[5px] border-[#222] cd-rotate flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden group" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                <div className="w-10 h-10 rounded-full bg-black border-2 border-gray-700 shadow-inner relative flex items-center justify-center z-20">
                                    <div className="w-2 h-2 rounded-full bg-[#333]"></div>
                                </div>
                                <div className="absolute inset-0 rounded-full border border-gray-800/50 m-2"></div>
                                <div className="absolute inset-0 rounded-full border border-gray-800/50 m-6"></div>
                                <img 
                                    src={currentSong.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646a?q=80&w=200&auto=format&fit=crop"} 
                                    alt="Album Art" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity grayscale"
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            <div className="flex justify-between items-end mb-4 gap-4 border-b border-gray-800 pb-4">
                                <div className="flex-1 pr-2">
                                    <span className="text-[#D3131F] text-[10px] font-bold tracking-widest uppercase">Now Playing</span>
                                    <h4 className="font-black text-2xl text-white tracking-tight mt-1 line-clamp-1">{currentSong.title}</h4>
                                    <p className="text-gray-400 text-sm font-medium tracking-wider mt-1">{artist.artistName}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Prev Button */}
                                    <button onClick={(e) => changeSong(-1, e)} className="text-gray-500 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                                    </button>
                                    
                                    {/* Play/Pause Button */}
                                    <button onClick={togglePlayPause} className="flex-shrink-0 bg-black border border-gray-700 text-gray-300 p-4 rounded-full hover:bg-[#D3131F] hover:text-white hover:border-[#D3131F] transition-all duration-300 shadow-lg">
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>

                                    {/* Next Button */}
                                    <button onClick={(e) => changeSong(1, e)} className="text-gray-500 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div 
                                className="w-full bg-gray-900 h-1.5 mt-6 relative rounded-full cursor-pointer"
                                onClick={handleProgressClick}
                            >
                                <motion.div 
                                    className="bg-[#D3131F] h-full relative rounded-full shadow-[0_0_10px_#D3131F] pointer-events-none"
                                    style={{ width: `${progress}%` }}
                                    layout
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                </motion.div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-2 font-mono font-medium tracking-widest">
                                <span>{currentTime}</span>
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* ================= 4. CONCERT EVENT SECTION ================= */}
            <section className="relative w-full py-24 px-6 bg-[#0a0a0a] overflow-hidden border-y border-gray-900">
                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-14">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white">
                                LIVE <span className="text-[#D3131F]">CONCERTS</span>
                            </h3>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors group">
                            VIEW ALL SHOWS
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {events.slice(0, 4).map((item, idx) => {
                            const evt = item.event || item; 
                            return (
                            <div key={idx} className="flex flex-col group cursor-pointer">
                                <div className="aspect-[4/5] relative rounded-xl overflow-hidden border border-gray-800 group-hover:border-gray-600 transition-colors duration-500 shadow-lg mb-4 bg-[#111]">
                                    <img
                                        src={evt.posterImage || "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=600&auto=format&fit=crop"}
                                        alt={evt.eventName}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-70 grayscale-[30%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-4 left-4 bg-[#D3131F] text-white px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded shadow-md z-20">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-start px-1">
                                    <h4 className="font-bold text-lg leading-tight tracking-wide text-white group-hover:text-[#D3131F] transition-colors line-clamp-2">{evt.eventName}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-[#8D99AE] font-medium uppercase tracking-widest mt-1.5">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="line-clamp-1">{evt.venue?.name || "TBA"}</span>
                                    </div>
                                </div>
                            </div>
                        )})}
                        {events.length === 0 && (
                            <p className="text-gray-500 py-10 col-span-4 text-center">No upcoming events for this artist.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATS & MEMBERS SECTION ================= */}
            <section className="relative w-full py-24 px-6 bg-[#111111]">
                <div className="max-w-6xl mx-auto relative z-10">

                    <div className="flex flex-col items-center mb-16">
                        <h3 className="text-center text-2xl md:text-3xl font-black tracking-widest uppercase text-white">
                            STREAMING <span className="text-[#D3131F]">STATISTICS</span>
                        </h3>
                        <div className="w-24 h-[2px] bg-gray-700 mt-4 rounded"></div>
                    </div>

                    <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-xl border border-gray-800/50 shadow-2xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            
                            {/* Legend */}
                            <div className="flex justify-center gap-8 mb-12">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-500 rounded-sm shadow-inner"></div>
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400">Spotify</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#D3131F] rounded-sm shadow-[0_0_8px_#D3131F]"></div>
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400">YouTube</span>
                                </div>
                            </div>

                            {/* พื้นที่แสดงแท่งกราฟ Dynamic */}
                            <div className="flex justify-between items-end h-64 md:h-80 gap-2 md:gap-6 border-b border-gray-700/50 pb-0 relative">
                                <div className="absolute w-full top-1/4 h-px bg-gray-800/50 z-0"></div>
                                <div className="absolute w-full top-2/4 h-px bg-gray-800/50 z-0"></div>
                                <div className="absolute w-full top-3/4 h-px bg-gray-800/50 z-0"></div>

                                {songs.length > 0 ? songs.slice(0, 6).map((song, idx) => {
                                    const maxPop = 60000000;
                                    const spotifyPop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                                    const youtubePop = Math.max(spotifyPop - (Math.floor(Math.random() * 20)), 10); 
                                    
                                    const spValue = (song.popularity / 1000000).toFixed(1);
                                    const ytValue = (spValue * (youtubePop / spotifyPop)).toFixed(1);

                                    return (
                                        <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end relative z-10 group">
                                            
                                            <div className="flex w-full justify-center gap-1.5 md:gap-2.5 items-end h-full px-1">
                                                {/* แท่ง Spotify */}
                                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-[40%] md:w-8 bar-spotify-v3 relative group-hover:brightness-110" />
                                                
                                                {/* แท่ง YouTube */}
                                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-[40%] md:w-8 bar-youtube-v3 relative group-hover:brightness-110" />
                                            </div>
                                            
                                            <div className="mt-4 text-center w-full">
                                                <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase truncate w-full block">{song.title.split(' ')[0]}</span>
                                            </div>

                                            {/* Tooltip Hover (Rock Theme) */}
                                            <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                                <div className="bg-[#111111] border border-gray-700 p-3 rounded shadow-xl min-w-[140px] text-center">
                                                    <p className="text-[10px] font-bold text-white border-b border-gray-700 pb-1.5 mb-1.5 truncate">{song.title}</p>
                                                    <div className="flex justify-between items-center text-[10px] font-black">
                                                        <span className="text-[#D3131F]">YT: {ytValue}M</span>
                                                        <span className="text-gray-400">SP: {spValue}M</span>
                                                    </div>
                                                </div>
                                                <div className="w-3 h-3 bg-[#111111] border-b border-r border-gray-700 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                            </div>

                                        </div>
                                    )
                                }) : (
                                    <div className="w-full flex items-center justify-center h-full text-gray-500 z-10">No data available</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-32 pt-16 border-t border-gray-900 flex flex-wrap justify-center items-center gap-10 md:gap-20 transition-all duration-500">
                        {[
                            { name: 'VOCALS', role: 'MAIN' },
                            { name: 'GUITAR', role: 'LEAD' },
                            { name: 'BASS', role: 'RHYTHM' },
                            { name: 'DRUMS', role: 'BEAT' },
                        ].map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                                <span className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-t from-gray-700 to-[#111111] opacity-90 select-none transition-all duration-500 group-hover:from-[#D3131F] group-hover:to-white group-hover:opacity-100">
                                    {member.name}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#8D99AE] uppercase group-hover:text-white transition-colors">
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ================= 6. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#D3131F]/10 to-[#111111]">
                <h1 className="text-[11vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-gray-700 to-[#111111] tracking-tighter select-none whitespace-nowrap hover:from-white transition-all duration-700 cursor-default uppercase pb-4">
                    {artist.artistName}
                </h1>
            </section>

        </div>
    );
}