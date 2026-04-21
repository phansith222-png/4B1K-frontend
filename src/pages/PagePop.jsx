import React, { useState, useEffect, useRef } from 'react';
import { getArtistById, getSongsByArtist, getEventsByArtist, getAllArtists } from '../api/artist';
import { useSearchParams } from 'react-router-dom'; // เพิ่มบรรทัดนี้

// Import Components ที่สร้างไว้
import HeroSection from '../components/PagePopComponent/HeroSection';
import BioSection from '../components/PagePopComponent/BioSection';
import MusicPlayerSection from '../components/PagePopComponent/MusicPlayerSection';
import ConcertSection from '../components/PagePopComponent/ConcertSection';
import StatsSection from '../components/PagePopComponent/StatsSection';
import BottomTextSection from '../components/PagePopComponent/BottomTextSection';
import Reveal from '../components/Reveal';

export default function PagePop() {
    const [searchParams] = useSearchParams();
    const queryArtistId = searchParams.get('artistId');
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

    const playerRef = useRef(null);
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

                // 📌 ถ้ามี ID ส่งมาจากช่องค้นหา ให้ใช้ ID นั้นเลย จะได้ไม่สุ่ม
                if (queryArtistId) {
                    ARTIST_ID = Number(queryArtistId);
                }
                // 📌 ถ้าไม่มี ID ส่งมา (แปลว่ากดเข้าหน้าเว็บมาตรงๆ) ให้สุ่มตามปกติ
                else if (popArtists.length > 0) { // เปลี่ยน popArtists ตามตัวแปรของหน้านั้นๆ (เช่น rockArtists, targetArtists)
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

        // ... โค้ด fetch...
        fetchPopArtist();
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

            playerRef.current = new window.YT.Player('yt-player-hidden-pop', {
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
        if (e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const changeSong = (directionOrIndex, e, isDirectIndex = false) => {
        if (e) e.stopPropagation();
        if (songs.length === 0 || !playerRef.current || !isPlayerReady) return;

        let next;
        if (isDirectIndex) {
            // ถ้ากดเลือกเพลงที่เจาะจง (เปลี่ยนจาก index ปัจจุบัน เป็น index ใหม่)
            next = currentSongIndex + directionOrIndex;
        } else {
            // ถ้ากดปุ่มลูกศร next/prev
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

    const handleSongEnded = () => {
        changeSong(1);
    };

    const handleSongSelect = (idx, e) => {
        e.stopPropagation();
        if (currentSongIndex === idx) {
            togglePlayPause(e);
        } else {
            changeSong(idx - currentSongIndex, e, true); // ส่งระยะห่างเพื่อให้กลายเป็น index นั้นๆ
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

    if (loading) {
        return (
            <div className="bg-[#0B0C10] min-h-screen flex flex-col items-center justify-center text-[#FF007F] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E5FF] opacity-10 blur-[80px] rounded-full animate-pulse"></div>
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

        <div className="bg-[#0B0C10] min-h-screen text-[#FFFFFF] font-sans  selection:bg-[#FF007F] selection:text-white">

            {/* ซ่อนระบบเครื่องเล่น YouTube ไว้ตรงนี้ */}
            <div id="yt-player-hidden-pop" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

            {/* ================= STYLE ================= */}
            <style>{`
                .shape-blob-1 { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; animation: morph 8s ease-in-out infinite; }
                .shape-blob-2 { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; animation: morph 8s ease-in-out infinite reverse; }
                @keyframes morph {
                    0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                    34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
                    67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
                }
                @keyframes rotateCD { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .cd-rotate { animation: rotateCD 12s linear infinite; }
                @keyframes eqRun { 0%, 100% { height: 15%; } 50% { height: 90%; } }
                .eq-bar { animation: eqRun 1.5s ease-in-out infinite; }
                .dark-grain {
                    position: fixed; inset: 0; opacity: 0.04; pointer-events: none; z-index: 100;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                }
                .tooltip-box {
                    opacity: 0; transform: translateY(10px); pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }
            `}</style>

            <div className="dark-grain" />

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
                  currentSong={songs[currentSongIndex]}
              />
            

            <ConcertSection events={events} />
            
            
              <StatsSection songs={songs} />
            
            
            
              <BottomTextSection artist={artist} />
            
        </div>

    );
}