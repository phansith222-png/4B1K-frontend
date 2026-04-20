import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAllArtists, getArtistById, getSongsByArtist, getEventsByArtist } from '../api/artist';
import { useSearchParams } from 'react-router-dom'; // เพิ่มบรรทัดนี้

// นำเข้า Components ย่อย
// import BackgroundEffects from '../components/PageEtcComponent/BackgroundEffects';
import HeroSection from '../components/PageEtcComponent/HeroSection';
import BioSection from '../components/PageEtcComponent/BioSection';
import MusicPlayerSection from '../components/PageEtcComponent/MusicPlayerSection';
import ConcertSection from '../components/PageEtcComponent/ConcertSection';
import StatsSection from '../components/PageEtcComponent/StatsSection';
import BottomTextSection from '../components/PageEtcComponent/BottomTextSection';

export default function PageEtc() {
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

    // ================= LOGIC ดึงข้อมูลศิลปิน HIP HOP / EDM =================
    useEffect(() => {
        const fetchHiphopEdmArtist = async () => {
            try {
                setLoading(true);

                const targetArtistIds = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25];

                let allArtistsRes;
                try {
                    allArtistsRes = await getAllArtists();
                } catch (err) {
                    console.error("Failed to fetch all artists:", err);
                    allArtistsRes = [];
                }
                
                const allArtistsList = allArtistsRes?.artists || allArtistsRes?.data || allArtistsRes || [];

                let targetArtists = allArtistsList.filter(a => targetArtistIds.includes(a.id));

                if (targetArtists.length === 0 && allArtistsList.length > 0) {
                    targetArtists = allArtistsList.filter(a => {
                        if (!a.genres || a.genres.length === 0) return false;
                        return a.genres.some(ag => {
                            const gName = ag.genre?.name?.toLowerCase() || "";
                            return gName.includes('hip hop') || gName.includes('rap') || gName.includes('edm') || gName.includes('electronic');
                        });
                    });
                }

                let ARTIST_ID;

            if (queryArtistId) {
                ARTIST_ID = Number(queryArtistId);
            } 
            else if (targetArtists.length > 0) { // 📌 ต้องเป็น targetArtists ให้ตรงกับในไฟล์
                const randomIndex = Math.floor(Math.random() * targetArtists.length);
                ARTIST_ID = targetArtists[randomIndex].id;
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

                const mainArtist = artistData?.artist || artistData?.data || artistData || targetArtists[0];
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
                console.error("Error fetching artist data:", error);
            } finally {
                setLoading(false);
            }
        };

        // ... โค้ด fetch...
        fetchHiphopEdmArtist();
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

            playerRef.current = new window.YT.Player('yt-player-hidden-etc', {
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

    const floatingBlobs = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        size: Math.random() * 200 + 150,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 5,
        color: i % 2 === 0 ? '#2B5AE8' : '#CEFF67'
    })), []);


    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-[#2B5AE8] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2B5AE8] opacity-20 blur-[80px] rounded-full animate-pulse"></div>
                <div className="w-16 h-16 border-4 border-gray-800 border-t-[#2B5AE8] rounded-full animate-spin z-10"></div>
                <p className="mt-4 font-bold tracking-widest animate-pulse text-white z-10 uppercase text-sm">Loading Beats...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-white">
                <p className="font-bold text-xl text-[#2B5AE8]">No Artists Found.</p>
                <p className="text-gray-500 mt-2">Please run seed to inject data into database.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-[#FFFFFF] font-sans overflow-x-hidden selection:bg-[#2B5AE8] selection:text-white relative">
            
            <div id="yt-player-hidden-etc" className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"></div>

            {/* นำเข้า Style จาก Component หรือใส่ไว้ในหน้าหลัก */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;900&display=swap');
                body { font-family: 'Outfit', sans-serif; }

                .shape-blob { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; filter: blur(90px); }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .vinyl-rotate { animation: spin-slow 12s linear infinite; }
                .eq-bar { animation: eqRun 1.5s ease-in-out infinite; }
                @keyframes eqRun { 0%, 100% { height: 20%; } 50% { height: 100%; } }

                .tooltip-box { opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .group:hover .tooltip-box { opacity: 1; transform: translateY(0); }

                .bg-grid-animation {
                    background-size: 100px 100px;
                    background-image: linear-gradient(to right, rgba(43, 90, 232, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(43, 90, 232, 0.05) 1px, transparent 1px);
                    animation: panGrid 20s linear infinite;
                }
                @keyframes panGrid { 0% { transform: translateY(0); } 100% { transform: translateY(100px); } }

                .marquee-container { display: flex; width: 200%; animation: marquee 20s linear infinite; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            `}</style>

            {/* <BackgroundEffects /> */}

            {/* Background Blobs Layer */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-[-100%] bg-grid-animation z-0"></div>
                {floatingBlobs.map(blob => (
                    <motion.div
                        key={blob.id}
                        className="absolute opacity-[0.06] shape-blob mix-blend-screen z-0"
                        style={{ width: blob.size, height: blob.size, left: `${blob.x}%`, top: `${blob.y}%`, backgroundColor: blob.color }}
                        animate={{ x: [0, 40, -40, 0], y: [0, -60, 60, 0] }}
                        transition={{ duration: blob.duration, delay: blob.delay, repeat: Infinity, ease: "easeInOut" }}
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
                currentSong={songs[currentSongIndex]}
            />
            <ConcertSection events={events} />
            <StatsSection songs={songs} />
            <BottomTextSection artist={artist} />

        </div>
    );
}