import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllArtists, getArtistById, getSongsByArtist, getEventsByArtist } from '../api/artist';

export default function PageElliot() {
    // ================= STATE สำหรับเก็บข้อมูล Backend =================
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

    // ================= LOGIC ดึงข้อมูลศิลปิน R&B =================
    useEffect(() => {
        const fetchRandomRnBArtist = async () => {
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

                if (rnbArtists.length > 0) {
                    const randomIndex = Math.floor(Math.random() * rnbArtists.length);
                    ARTIST_ID = rnbArtists[randomIndex].id;
                } else if (allArtistsList.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allArtistsList.length);
                    ARTIST_ID = allArtistsList[randomIndex].id;
                } else {
                    setArtist(null);
                    setLoading(false);
                    return;
                }

                // 📌 แก้ไขตรงนี้ให้เป็น .catch(() => null) เพื่อให้ Fallback ทำงานได้ถูกต้อง
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

        fetchRandomRnBArtist();
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

            playerRef.current = new window.YT.Player('yt-player-hidden-elliot', {
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

    // สร้างข้อมูลหิ่งห้อย (Fireflies) 40 ตัว
    const fireflies = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 1, 
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 15 + 10, 
        delay: Math.random() * 10,
    })), []);

    // ================= หน้าจอ Loading =================
    if (loading) {
        return (
            <div className="bg-[#0F172A] min-h-screen flex flex-col items-center justify-center text-[#D4AF37]">
                <div className="w-16 h-16 border-4 border-[#1e293b] border-t-[#D4AF37] rounded-full animate-spin"></div>
                <p className="mt-4 font-serif italic tracking-widest animate-pulse text-white uppercase">Summoning R&B Soul...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#0F172A] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold font-serif text-xl text-[#D4AF37] uppercase">No R&B Artists Found.</p>
                <p className="text-gray-500 mt-2 font-serif">Please run seed to inject data into database.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#0F172A] min-h-screen text-[#FFFFFF] font-serif overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
            
            {/* ซ่อน YouTube Player ไว้ตรงนี้ */}
            <div id="yt-player-hidden-elliot" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

            {/* ================= STYLE: CLASSIC TEXTURES ================= */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=Cormorant+Garamond:wght@300;600&display=swap');
                
                .font-classic { font-family: 'Playfair Display', serif; }
                .font-sub { font-family: 'Cormorant Garamond', serif; }

                /* พื้นผิวกระดาษเก่า (Grain Texture) */
                .classic-grain {
                    position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }

                .vinyl-record {
                    background: repeating-radial-gradient(circle, #111, #111 2px, #1a1a1a 3px, #111 4px);
                    border: 2px solid #222;
                }
                @keyframes spinVinyl { 100% { transform: rotate(360deg); } }
                .vinyl-spin { animation: spinVinyl 6s linear infinite; }

                /* เงาเรืองแสงของหิ่งห้อย */
                .firefly-glow { box-shadow: 0 0 10px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.4); }

                /* Tooltip กราฟ */
                .tooltip-box {
                    opacity: 0; transform: translateY(10px); pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            {/* ================= BACKGROUND & FIREFLIES LAYER ================= */}
            <div className="classic-grain" />
            
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Ambient Lights */}
                <motion.div 
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] blur-[150px]"
                />
                
                {/* FIREFLIES ANIMATION */}
                {fireflies.map(f => (
                    <motion.div
                        key={f.id}
                        className="absolute bg-[#D4AF37] rounded-full firefly-glow"
                        style={{ width: f.size, height: f.size, left: `${f.initialX}%`, top: `${f.initialY}%` }}
                        animate={{ 
                            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                            opacity: [0, 0.7, 0.2, 0.8, 0],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-screen flex flex-col justify-center items-center py-20 px-6 z-10">
                <div className="relative w-full max-w-7xl mx-auto flex flex-col items-start gap-12">
                    <div className="relative w-full flex flex-col md:flex-row items-center gap-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="w-full md:w-1/2"
                        >
                            <span className="text-[#D4AF37] font-sub tracking-[0.5em] text-sm md:text-lg mb-4 block uppercase">
                                {artist.agency?.name || "The Voice of an Era"}
                            </span>
                            <h1 className="text-5xl md:text-[6rem] lg:text-[7.5rem] font-classic font-black leading-[0.85] text-white uppercase break-words">
                                {artist.artistName}
                            </h1>
                        </motion.div>

                        <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
                            <div className="relative w-[70%] aspect-[3/4] border border-[#D4AF37]/20 rounded-sm translate-x-10 translate-y-10 opacity-30" />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="absolute top-0 right-0 w-[90%] aspect-[3/4] rounded-sm overflow-hidden border-[12px] border-[#1e293b] shadow-2xl"
                            >
                                <img
                                    src={artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"}
                                    alt={artist.artistName}
                                    className="w-full h-full object-cover grayscale-[20%] sepia-[10%] brightness-90 hover:scale-105 transition-transform duration-[5s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </motion.div>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-full max-w-5xl mt-20 flex flex-col md:flex-row items-center justify-between border-y border-[#D4AF37]/20 py-10 bg-[#1e293b]/20 backdrop-blur-sm px-6 rounded-sm"
                    >
                        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                            <h2 className="font-sub tracking-[0.3em] text-[#D4AF37] text-xl uppercase">UPCOMING TOUR</h2>
                            {events.length > 0 ? (
                                <p className="font-classic italic text-2xl text-gray-300 mt-2">
                                    {events[0].event?.eventName || events[0].eventName} — {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            ) : (
                                <p className="font-classic italic text-2xl text-gray-500 mt-2">More dates to be announced</p>
                            )}
                        </div>
                        <motion.button 
                            whileHover={{ backgroundColor: "#D4AF37", color: "#000" }}
                            className="border border-[#D4AF37] text-[#D4AF37] px-12 py-4 rounded-full font-classic tracking-widest text-sm transition-all"
                        >
                            RESERVE TICKETS
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ================= 2. LINEUP / BIO SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-gradient-to-b from-transparent to-[#1e293b]/30 overflow-hidden border-b border-[#D4AF37]/10 z-10">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-2 md:gap-4">
                    <h2 className="text-5xl md:text-7xl font-classic font-black text-[#FFFFFF] tracking-tight hover:text-[#D4AF37] hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.8)] transition-all duration-300 cursor-default uppercase">
                        {artist.artistName}
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-classic font-black text-gray-500 tracking-tight hover:text-white hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-default uppercase">
                        {artist.agency?.name || 'R&B ICON'}
                    </h2>
                    <h2 className="text-3xl md:text-5xl font-sub font-bold text-white tracking-tight mt-4 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-default">
                        OFFICIAL ARTIST <span className="text-[#D4AF37] px-2 hover:drop-shadow-none">•</span> R&B MUSIC
                    </h2>
                    <p className="text-sm md:text-lg font-sub font-medium text-gray-400 tracking-widest leading-relaxed mt-6 max-w-3xl mx-auto whitespace-pre-line italic">
                        {artist.biography || "A Voice that Echoes through Time. Keep streaming and supporting the artist!"}
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MUSIC PLAYER SECTION ================= */}
            <section className="relative w-full py-24 px-6 overflow-hidden z-10">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[800px] bg-gradient-to-r from-[#D4AF37] via-transparent to-white rounded-[100%] blur-[100px] animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    <h3 className="text-center text-xl md:text-2xl font-classic font-bold tracking-widest uppercase mb-12 text-[#D4AF37]">Top Chart song</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-20">
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
                                className={`border ${currentSongIndex === idx ? 'border-[#D4AF37]' : 'border-[#D4AF37]/10'} hover:border-[#D4AF37] text-white rounded-sm p-6 transition-all duration-300 group flex items-center gap-5 backdrop-blur-md bg-[#1e293b]/40 hover:bg-[#1e293b]/80 text-left shadow-lg`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-sm border ${currentSongIndex === idx ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/10 text-gray-500'} flex items-center justify-center font-classic font-black text-2xl group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors`}>
                                    {currentSongIndex === idx && isPlaying ? (
                                        <span className="animate-pulse">►</span>
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-xs font-sub tracking-widest uppercase text-[#D4AF37] font-bold">Top Song</span>
                                    <span className="font-classic font-bold text-lg leading-tight line-clamp-1">{item.title}</span>
                                    <span className="text-xs font-sub text-gray-400 font-bold tracking-wider">
                                        {item.popularity ? `${(item.popularity / 1000000).toFixed(1)}M` : 'Trending'} Streams
                                    </span>
                                </div>
                            </button>
                        ))}
                        {songs.length === 0 && (
                            <p className="text-center font-classic col-span-2 text-gray-500 py-10 bg-[#1e293b]/40 rounded-sm border border-[#D4AF37]/10">No songs available for this artist.</p>
                        )}
                    </div>

                    {/* MUSIC PLAYER CONTROLS */}
                    {songs.length > 0 && currentSong && (
                    <div className="w-full max-w-3xl mx-auto bg-[#1e293b]/60 backdrop-blur-md rounded-sm p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 border border-[#D4AF37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        
                        <div className="relative w-36 h-36 md:w-48 md:h-48 flex-shrink-0 flex items-center justify-center">
                            <div 
                                className={`w-full h-full rounded-full vinyl-record flex items-center justify-center shadow-2xl relative overflow-hidden vinyl-spin`}
                                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                            >
                                <img 
                                    src={currentSong?.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop"} 
                                    alt="Album Art" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay grayscale-[20%]"
                                />
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#222] border-2 border-[#D4AF37]/40 flex items-center justify-center relative z-10">
                                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-black shadow-inner" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    <span className="text-[#D4AF37] font-sub text-xs font-bold tracking-widest uppercase border border-[#D4AF37]/30 px-2 py-1 rounded-sm">Now Playing</span>
                                    <h4 className="font-classic font-black text-2xl md:text-3xl text-white tracking-tight line-clamp-1 mt-4">{currentSong.title}</h4>
                                    <p className="font-sub text-gray-400 italic text-lg mt-1">{artist.artistName}</p>
                                </div>

                                <div className="flex items-center gap-4 md:gap-6 mt-2">
                                    <button onClick={(e) => changeSong(-1, e)} className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                                    </button>
                                    <button onClick={togglePlayPause} className="w-12 h-12 flex items-center justify-center border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-[#0F172A] transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                        {isPlaying ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                    <button onClick={(e) => changeSong(1, e)} className="text-gray-500 hover:text-[#D4AF37] transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="w-full bg-gray-800/60 h-1 mt-10 relative cursor-pointer group" onClick={handleProgressClick}>
                                <motion.div className="absolute inset-0 bg-[#D4AF37] pointer-events-none" style={{ width: `${progress}%` }} layout>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#D4AF37] transition-opacity"></div>
                                </motion.div>
                            </div>
                            <div className="flex justify-between font-sub text-gray-500 mt-3 text-sm tracking-widest">
                                <span>{currentTime}</span>
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* ================= 4. CONCERT EVENT SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-transparent border-t border-[#D4AF37]/10 z-10">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-12 border-b border-[#D4AF37]/10 pb-8">
                        <h3 className="text-xl md:text-3xl font-classic font-black tracking-widest uppercase text-white">Live <span className="text-[#D4AF37] italic">Concerts</span></h3>
                        <button className="flex items-center gap-2 font-sub text-sm font-bold text-gray-400 hover:text-white transition-colors group bg-[#1e293b]/40 px-6 py-2 rounded-full border border-[#D4AF37]/20">
                            View All Dates
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.slice(0, 4).map((item, idx) => {
                            const evt = item.event || item; 
                            return (
                            <div key={idx} className="relative rounded-sm overflow-hidden group border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-500 cursor-pointer bg-[#1e293b]/40 shadow-lg">
                                <div className="aspect-[4/3] relative z-10">
                                    <img
                                        src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                        alt={evt.eventName}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-60 grayscale-[30%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-100"></div>
                                </div>
                                <div className="p-6 flex flex-col items-start z-20 bg-[#1e293b]/40 relative">
                                    <span className="text-[#D4AF37] font-sub text-[10px] font-bold uppercase tracking-widest mb-2 border-b border-[#D4AF37]/30 pb-1">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <h4 className="font-classic font-black text-lg leading-snug tracking-tight text-white mb-4 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                        {evt.eventName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs font-sub text-gray-400 font-medium tracking-wide w-full">
                                        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="line-clamp-1 italic">{evt.venue?.name || "TBA"}</span>
                                    </div>
                                </div>
                            </div>
                        )})}
                        {events.length === 0 && (
                            <div className="col-span-4 bg-[#1e293b]/40 rounded-sm py-16 flex flex-col items-center justify-center text-gray-500 border border-[#D4AF37]/10 font-classic italic">
                                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <p className="font-bold tracking-widest uppercase">No upcoming events</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATS & MEMBERS SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-transparent border-t border-[#D4AF37]/10 z-10">
                <div className="max-w-5xl mx-auto relative z-10">

                    <h3 className="text-center font-classic text-2xl md:text-3xl font-black tracking-widest uppercase mb-12 text-white">
                        Streaming <span className="text-[#D4AF37] italic">Statistics</span>
                    </h3>

                    {/* DYNAMIC CHART: Hover Tooltip เพื่อแยกยอด */}
                    <div className="max-w-4xl mx-auto bg-[#1e293b]/40 backdrop-blur-md p-6 md:p-10 rounded-sm border border-[#D4AF37]/20 shadow-2xl relative">
                        <div className="flex justify-between items-end h-48 md:h-64 gap-2 md:gap-6 border-b border-gray-700/50 pb-2 relative">
                            {/* เส้น Grid */}
                            <div className="absolute w-full top-1/4 h-px bg-gray-700/30 z-0"></div>
                            <div className="absolute w-full top-2/4 h-px bg-gray-700/30 z-0"></div>
                            <div className="absolute w-full top-3/4 h-px bg-gray-700/30 z-0"></div>

                            {songs.length > 0 ? songs.slice(0, 6).map((song, idx) => {
                                const maxPop = 60000000;
                                const spotifyPop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                                const youtubePop = Math.max(spotifyPop - (Math.floor(Math.random() * 20)), 10); 
                                
                                const spValue = (song.popularity / 1000000).toFixed(1);
                                const ytValue = (spValue * (youtubePop / spotifyPop)).toFixed(1);

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-crosshair z-10">
                                        <div className="flex w-full justify-center gap-1 md:gap-2 items-end h-full px-1 md:px-2">
                                            {/* แท่ง YouTube (สีทองอ่อน) */}
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-[45%] md:w-4 bg-gradient-to-t from-[#D4AF37]/20 to-[#D4AF37]/70 rounded-t-sm transition-all duration-500 group-hover:brightness-125" />
                                            {/* แท่ง Spotify (สีทองเข้ม) */}
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-[45%] md:w-4 bg-gradient-to-t from-[#D4AF37]/40 to-[#D4AF37] rounded-t-sm transition-all duration-500 group-hover:brightness-125 shadow-[0_0_10px_rgba(212,175,55,0.3)] relative" />
                                        </div>
                                        <span className="font-sub text-gray-400 text-[10px] md:text-xs font-bold uppercase mt-4 truncate w-full text-center px-1">{song.title.split(' ')[0]}</span>
                                        
                                        {/* 🎯 Hover Tooltip แยกข้อมูล */}
                                        <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                            <div className="bg-[#0F172A] border border-[#D4AF37]/30 p-3 rounded-sm shadow-2xl min-w-[140px] text-center">
                                                <p className="text-[11px] font-classic italic text-white border-b border-gray-700 pb-1.5 mb-1.5 truncate">{song.title}</p>
                                                <div className="flex justify-between items-center text-[10px] font-sub tracking-widest">
                                                    <span className="text-[#D4AF37]">YT: {ytValue}M</span>
                                                    <span className="text-gray-300">SP: {spValue}M</span>
                                                </div>
                                            </div>
                                            <div className="w-3 h-3 bg-[#0F172A] border-b border-r border-[#D4AF37]/30 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="w-full flex items-center justify-center h-full font-classic italic text-gray-500">No data available</div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center gap-8 font-sub">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#D4AF37]/70"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-wider uppercase">YouTube</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-wider uppercase">Spotify</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 pt-10 border-t border-[#D4AF37]/10 flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {['VOCALS', 'GUITAR', 'BASS'].map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                                <span className="text-xl md:text-3xl font-classic font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-t from-gray-700 to-[#FFFFFF] opacity-80 select-none group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                                    {member}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ================= 6. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#D4AF37]/10 to-transparent pointer-events-none z-10">
                <h1 className="text-[13vw] leading-none font-classic font-black text-transparent bg-clip-text bg-gradient-to-t from-white to-[#0F172A] tracking-tighter opacity-40 select-none whitespace-nowrap uppercase mb-[-2vw]">
                    {artist.artistName}
                </h1>
            </section>

        </div>
    );
}