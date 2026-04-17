import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getArtistById, getSongsByArtist, getEventsByArtist, getAllArtists } from '../api/artist';

export default function PagePop() {
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= STATE สำหรับ Music Player (YouTube) =================
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    
    const playerRef = useRef(null); // ใช้สำหรับอ้างอิง YouTube Player
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    useEffect(() => {
        const fetchPopArtist = async () => {
            try {
                setLoading(true);

                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];
                const popArtistIds = [1, 2, 3, 4, 5]; 

                let popArtists = allArtistsList.filter(a => popArtistIds.includes(a.id));
                if (popArtists.length === 0 && allArtistsList.length > 0) {
                    popArtists = allArtistsList; 
                }

                let ARTIST_ID;
                if (popArtists.length > 0) {
                    const randomIndex = Math.floor(Math.random() * popArtists.length);
                    ARTIST_ID = popArtists[randomIndex].id;
                } else {
                    setArtist(null);
                    setLoading(false);
                    return;
                }

                const [artistRes, songsRes, eventsRes] = await Promise.all([
                    getArtistById(ARTIST_ID).catch(() => null),
                    getSongsByArtist(ARTIST_ID).catch(() => null), 
                    getEventsByArtist(ARTIST_ID).catch(() => null)
                ]);

                const mainArtist = artistRes?.artist || artistRes?.data || artistRes || popArtists[0];
                setArtist(mainArtist);
                
                let extractedSongs = [];
                if (Array.isArray(songsRes)) extractedSongs = songsRes;
                else if (songsRes?.data && Array.isArray(songsRes.data)) extractedSongs = songsRes.data;
                else if (songsRes?.songs && Array.isArray(songsRes.songs)) extractedSongs = songsRes.songs;
                else if (mainArtist?.songs && Array.isArray(mainArtist.songs)) extractedSongs = mainArtist.songs;
                
                setSongs(extractedSongs);

                let extractedEvents = [];
                if (Array.isArray(eventsRes)) extractedEvents = eventsRes;
                else if (eventsRes?.data && Array.isArray(eventsRes.data)) extractedEvents = eventsRes.data;
                else if (eventsRes?.events && Array.isArray(eventsRes.events)) extractedEvents = eventsRes.events;
                else if (mainArtist?.events && Array.isArray(mainArtist.events)) extractedEvents = mainArtist.events;

                setEvents(extractedEvents);

            } catch (error) {
                console.error("Error fetching pop artist data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopArtist();
    }, []);

    // ================= LOGIC ระบบเล่นเพลงจาก YOUTUBE =================
    const currentSong = songs[currentSongIndex] || null;

    // ฟังก์ชันดึง Video ID จากลิงก์ YouTube ที่มาจาก Backend
    const extractYouTubeID = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // โหลด YouTube IFrame API
    useEffect(() => {
        if (songs.length === 0) return;

        const initPlayer = () => {
            if (playerRef.current) return;
            const firstVideoId = extractYouTubeID(songs[0].streamUrl) || 'dQw4w9WgXcQ'; // Fallback ถ้าไม่มีลิงก์

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

    // อัปเดตเวลาและ Progress Bar
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
        
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
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
        
        // สั่งให้ YouTube โหลดเพลงใหม่จากลิงก์ Backend แล้วเล่นทันที
        const nextVideoId = extractYouTubeID(songs[next].streamUrl) || 'dQw4w9WgXcQ';
        playerRef.current.loadVideoById(nextVideoId);
        setIsPlaying(true);
    };

    const handleSongEnded = () => {
        changeSong(1); // เล่นจบให้ข้ามไปเพลงถัดไปอัตโนมัติ
    };

    // คลิกข้ามเวลา
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


    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#FF007F] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E5FF] opacity-10 blur-[80px] rounded-full"></div>
                <div className="w-16 h-16 border-4 border-white/10 border-t-[#00E5FF] rounded-full animate-spin z-10"></div>
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Pop Star...</p>
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

    return (
        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#FF007F] selection:text-white">
            
            {/* ซ่อนระบบเครื่องเล่น YouTube ไว้ตรงนี้ */}
            <div id="yt-player-hidden" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

            {/* ================= STYLE ต้นฉบับ + Tooltip ================= */}
            <style>{`
                .shape-blob-1 { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; animation: morph 8s ease-in-out infinite; }
                .shape-blob-2 { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; animation: morph 8s ease-in-out infinite reverse; }
                @keyframes morph {
                    0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                    34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
                    67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
                }
                @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cd-rotate { animation: rotateCD 10s linear infinite; }
                @keyframes eqRun { 0%, 100% { height: 15%; } 50% { height: 90%; } }
                .eq-bar { animation: eqRun 1.5s ease-in-out infinite; }
                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.03; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                /* สไตล์สำหรับ Tooltip ของกราฟสถิติ */
                .tooltip-box {
                    opacity: 0;
                    transform: translateY(10px);
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .tooltip-box {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
            
            <div className="dark-grain" />

            {/* ================= 1. HERO SECTION ================= */}
            <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center py-20 px-6 overflow-hidden">
                <div className="absolute top-10 left-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#00F5D4] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#FF007F] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
                    <div className="relative w-full md:w-3/4 h-[400px] md:h-[600px]">
                        <div className="absolute -top-6 -left-6 md:-top-12 md:-left-12 w-64 h-64 md:w-96 md:h-96 bg-[#00F5D4] shape-blob-1 z-0 mix-blend-screen opacity-60"></div>
                        <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-64 h-64 md:w-96 md:h-96 bg-[#FF007F] shape-blob-2 z-0 mix-blend-screen opacity-60"></div>

                        <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden z-10 border border-white/5 shadow-[0_0_50px_rgba(255,0,127,0.2)] bg-[#110E1B]">
                            <img
                                src={artist.profileImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop"}
                                alt={artist.artistName}
                                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-black/20 to-transparent opacity-90"></div>

                            <div className="absolute bottom-10 left-10 md:left-14 z-20">
                                <span className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">
                                    Pop Sensation
                                </span>
                                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] hover:text-[#00F5D4] hover:drop-shadow-[0_0_30px_rgba(0,245,212,0.6)] transition-all duration-300 cursor-default uppercase">
                                    {artist.artistName}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-20 mt-12 flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl bg-[#1A1C23]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold tracking-widest uppercase">Tour Dates</h2>
                        <div className="flex items-center gap-4 mt-2">
                            {events.length > 0 ? (
                                <>
                                    <span className="text-[#FF007F] font-black text-xl">
                                        {new Date(events[0].event?.startTime || events[0].startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                    </span>
                                    <span className="w-px h-6 bg-gray-600"></span>
                                    <span className="text-gray-300 font-medium line-clamp-1">
                                        {artist.artistName}, {events[0].event?.eventName || events[0].eventName}
                                    </span>
                                </>
                            ) : (
                                <span className="text-gray-400 font-medium">No upcoming tours available</span>
                            )}
                        </div>
                    </div>
                    <button className="bg-gradient-to-r from-[#FF007F] to-[#00F5D4] text-[#110E1B] px-12 py-4 rounded-full font-black tracking-widest uppercase text-lg hover:scale-105 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,245,212,0.3)]">
                        Buy Tickets
                    </button>
                </div>
            </section>

            {/* ================= 2. LINEUP / BIO SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-gradient-to-b from-transparent to-[#1a1528]/30 overflow-hidden border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-2 md:gap-4">
                    <h2 className="text-5xl md:text-7xl font-black text-[#FFFFFF] tracking-tight hover:text-[#00F5D4] hover:drop-shadow-[0_0_25px_rgba(0,245,212,0.8)] transition-all duration-300 cursor-default uppercase">
                        {artist.artistName}
                    </h2>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-500 tracking-tight hover:text-[#FF007F] hover:drop-shadow-[0_0_25px_rgba(255,0,127,0.8)] transition-all duration-300 cursor-default uppercase">
                        {artist.agency?.name || 'POP ICON'}
                    </h2>
                    <h2 className="text-3xl md:text-5xl font-bold text-[#FF007F] tracking-tight mt-4 hover:drop-shadow-[0_0_20px_rgba(255,0,127,0.8)] transition-all duration-300 cursor-default">
                        OFFICIAL ARTIST <span className="text-[#00F5D4] px-2 hover:drop-shadow-none">•</span> POP MUSIC
                    </h2>
                    <p className="text-sm md:text-lg font-medium text-gray-400 tracking-widest leading-relaxed mt-6 max-w-3xl mx-auto whitespace-pre-line">
                        {artist.biography || "Biography not available at the moment. Keep streaming and supporting the artist!"}
                    </p>
                </div>
            </section>

            {/* ================= 3. TOP CHART & MUSIC PLAYER SECTION ================= */}
            <section className="relative w-full py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[800px] bg-gradient-to-r from-[#FF007F] via-transparent to-[#00F5D4] rounded-[100%] blur-[100px] animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    <h3 className="text-center text-xl md:text-2xl font-bold tracking-widest uppercase mb-12 text-[#FF007F]">Top Chart song</h3>

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
                                className={`border ${currentSongIndex === idx ? 'border-[#00F5D4]' : 'border-white/5'} hover:border-[#00F5D4] text-white rounded-2xl p-6 transition-all duration-300 group flex items-center gap-5 backdrop-blur-md bg-[#1A1C23]/60 hover:bg-[#252830]/80 text-left shadow-lg`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full border ${currentSongIndex === idx ? 'border-[#00F5D4] bg-[#00F5D4]/10 text-[#00F5D4]' : 'border-white/10 text-gray-500'} flex items-center justify-center font-black text-2xl group-hover:text-[#00F5D4] group-hover:bg-[#00F5D4]/10 transition-colors`}>
                                    {currentSongIndex === idx && isPlaying ? (
                                        <div className="flex gap-0.5 items-end h-4">
                                            <div className="w-1 bg-[#00F5D4] eq-bar" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1 bg-[#00F5D4] eq-bar" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-1 bg-[#00F5D4] eq-bar" style={{ animationDelay: '0.3s' }}></div>
                                        </div>
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <span className="text-xs tracking-widest uppercase text-[#FF007F] font-bold">Top Song</span>
                                    <span className="font-bold text-lg leading-tight line-clamp-1">{item.title}</span>
                                    <span className="text-xs text-gray-400 font-bold tracking-wider">
                                        {item.popularity ? `${(item.popularity / 1000000).toFixed(1)}M` : 'Trending'} Streams
                                    </span>
                                </div>
                            </button>
                        ))}
                        {songs.length === 0 && (
                            <p className="text-center col-span-2 text-gray-500 py-10 bg-[#1A1C23] rounded-2xl border border-white/5">No songs available for this artist.</p>
                        )}
                    </div>

                    {/* MUSIC PLAYER CONTROLS */}
                    {songs.length > 0 && currentSong && (
                    <div className="w-full max-w-3xl mx-auto bg-[#1A1C23] rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-end justify-center gap-1 md:gap-1.5 opacity-40 z-0 overflow-hidden">
                                {[...Array(12)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="w-full bg-gradient-to-t from-[#FF007F] to-[#00F5D4] rounded-t-md eq-bar" 
                                        style={{ 
                                            animationDelay: `${(i % 6) * 0.2}s`, 
                                            animationDuration: `${1.2 + (i % 3) * 0.3}s`,
                                            animationPlayState: isPlaying ? 'running' : 'paused' // หยุดขยับถ้าไม่ได้เล่น
                                        }}>
                                    </div>
                                ))}
                            </div>
                            <div className="w-32 h-32 rounded-full bg-[#0B0C10] border-4 border-gray-700 cd-rotate flex items-center justify-center shadow-lg relative z-10 overflow-hidden group" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                <div className="w-8 h-8 rounded-full bg-black border-2 border-gray-600 shadow-inner relative flex items-center justify-center z-20">
                                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                                </div>
                                <img 
                                    src={currentSong.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop"} 
                                    alt="Album Art" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full relative z-10">
                            <div className="flex justify-between items-start mb-3 gap-4">
                                <div className="flex-1 pr-4">
                                    <span className="text-[#FF007F] text-[10px] font-bold tracking-widest uppercase">Now Playing</span>
                                    <h4 className="font-black text-2xl md:text-3xl text-white tracking-tight line-clamp-1 mt-1">
                                        {currentSong.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm font-medium tracking-wider mt-1">{artist.artistName}</p>
                                </div>
                                
                                {/* Controller Buttons */}
                                <div className="flex items-center gap-3">
                                    <button onClick={(e) => changeSong(-1, e)} className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                                    </button>
                                    
                                    <button onClick={togglePlayPause} className="flex-shrink-0 bg-white text-black p-4 rounded-full hover:scale-105 hover:bg-[#00F5D4] transition-all shadow-[0_5px_20px_rgba(0,245,212,0.3)]">
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>

                                    <button onClick={(e) => changeSong(1, e)} className="text-gray-400 hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar (Clickable) */}
                            <div 
                                className="w-full bg-[#0B0C10] rounded-full h-2 mt-8 relative border border-white/5 overflow-hidden cursor-pointer"
                                onClick={handleProgressClick}
                            >
                                <motion.div 
                                    className="bg-gradient-to-r from-[#FF007F] to-[#00F5D4] h-2 rounded-full relative shadow-[0_0_10px_#00F5D4] pointer-events-none"
                                    style={{ width: `${progress}%` }}
                                    layout
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono tracking-widest">
                                <span>{currentTime}</span>
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </section>

            {/* ================= 4. CONCERT EVENT SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-transparent border-t border-white/5">
                <div className="max-w-7xl mx-auto relative z-10">

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-12 border-b border-white/10 pb-8">
                        <h3 className="text-xl md:text-3xl font-black tracking-widest uppercase text-white">Live <span className="text-[#FF007F]">Concerts</span></h3>
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors group bg-[#1A1C23] px-6 py-2 rounded-full border border-white/10">
                            View All Dates
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.slice(0, 4).map((item, idx) => {
                            const evt = item.event || item; 
                            return (
                            <div key={idx} className="relative rounded-3xl overflow-hidden group border border-white/5 hover:border-[#00F5D4]/50 transition-all duration-500 cursor-pointer bg-[#1A1C23]">
                                <div className="aspect-[4/3] relative z-10">
                                    <img
                                        src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                        alt={evt.eventName}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-70"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C23] via-transparent to-transparent opacity-100"></div>
                                </div>
                                <div className="p-6 flex flex-col items-start z-20 bg-[#1A1C23] relative">
                                    <span className="text-[#00F5D4] text-[10px] font-bold uppercase tracking-widest mb-2">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <h4 className="font-black text-lg leading-snug tracking-tight text-white mb-4 group-hover:text-[#FF007F] transition-colors line-clamp-2">
                                        {evt.eventName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide w-full">
                                        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="line-clamp-1">{evt.venue?.name || "TBA"}</span>
                                    </div>
                                </div>
                            </div>
                        )})}
                        {events.length === 0 && (
                            <div className="col-span-4 bg-[#1A1C23] rounded-3xl py-16 flex flex-col items-center justify-center text-gray-500 border border-white/5">
                                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <p className="font-bold tracking-widest uppercase">No upcoming events</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ================= 5. STATS & MEMBERS SECTION ================= */}
            <section className="relative w-full py-20 px-6 bg-transparent border-t border-white/5">
                <div className="max-w-5xl mx-auto relative z-10">

                    <h3 className="text-center text-2xl md:text-3xl font-black tracking-widest uppercase mb-12 text-white">
                        Streaming <span className="text-[#00F5D4]">Statistics</span>
                    </h3>

                    {/* DYNAMIC CHART: Hover Tooltip เพื่อแยกยอด */}
                    <div className="max-w-4xl mx-auto bg-[#1A1C23] p-6 md:p-10 rounded-[2rem] border border-white/5 shadow-2xl relative">
                        <div className="flex justify-between items-end h-48 md:h-64 gap-2 md:gap-6 border-b border-gray-700/50 pb-2">
                            {songs.length > 0 ? songs.slice(0, 6).map((song, idx) => {
                                // แปลง Popularity เป็นเปอร์เซ็นต์
                                const maxPop = 60000000;
                                const spotifyPop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                                const youtubePop = Math.max(spotifyPop - (Math.floor(Math.random() * 20)), 10); 
                                
                                // ตัวเลขสำหรับแสดงใน Tooltip (จำลองให้ดูเป็นตัวเลขยอดวิว)
                                const spValue = (song.popularity / 1000000).toFixed(1);
                                const ytValue = (spValue * (youtubePop / spotifyPop)).toFixed(1);

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-crosshair">
                                        <div className="flex w-full justify-center gap-1 md:gap-2 items-end h-full px-1 md:px-2">
                                            {/* แท่ง YouTube */}
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-1/2 md:w-6 bg-gradient-to-t from-[#FF007F]/20 to-[#FF007F] rounded-t-md transition-all duration-500 group-hover:brightness-125" />
                                            {/* แท่ง Spotify */}
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-1/2 md:w-6 bg-gradient-to-t from-[#00F5D4]/20 to-[#00F5D4] rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-[0_0_10px_rgba(0,245,212,0.3)] relative">
                                            </motion.div>
                                        </div>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase mt-4 truncate w-full text-center px-1">{song.title.split(' ')[0]}</span>
                                        
                                        {/* 🎯 Hover Tooltip แยกข้อมูล */}
                                        <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                            <div className="bg-[#0B0C10] border border-white/10 p-3 rounded-xl shadow-xl min-w-[140px] text-center">
                                                <p className="text-[10px] font-bold text-white border-b border-white/10 pb-1.5 mb-1.5 truncate">{song.title}</p>
                                                <div className="flex justify-between items-center text-[10px] font-black">
                                                    <span className="text-[#FF007F]">YT: {ytValue}M</span>
                                                    <span className="text-[#00F5D4]">SP: {spValue}M</span>
                                                </div>
                                            </div>
                                            {/* ลูกศรชี้ลง */}
                                            <div className="w-3 h-3 bg-[#0B0C10] border-b border-r border-white/10 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="w-full flex items-center justify-center h-full text-gray-500">No data available</div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#FF007F] shadow-[0_0_10px_#FF007F]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-wider uppercase">YouTube</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#00F5D4] shadow-[0_0_10px_#00F5D4]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-wider uppercase">Spotify</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {['VOCALS', 'GUITAR', 'BASS'].map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                                <span className="text-xl md:text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-t from-[#0B0C10] to-[#FFFFFF] opacity-80 select-none group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                                    {member}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ================= 6. BIG BOTTOM TEXT ================= */}
            <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden flex items-end justify-center bg-gradient-to-t from-[#FF007F]/10 to-transparent pointer-events-none">
                <h1 className="text-[13vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-t from-white to-[#0B0C10] tracking-tighter opacity-40 select-none whitespace-nowrap uppercase mb-[-2vw]">
                    {artist.artistName}
                </h1>
            </section>

        </div>
    );
}