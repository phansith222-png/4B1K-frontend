import { useState, useEffect, useRef, useCallback } from 'react';
import { extractYouTubeID, formatTime, loadYouTubeAPI } from '../utils/youtube';

const FALLBACK_VIDEO_ID = 'dQw4w9WgXcQ';

const useYouTubePlayer = (songs = [], playerId = 'yt-player', options = {}) => {
    const { autoplay = false } = options;

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const playerRef = useRef(null);
    const progressBarRef = useRef(null);
    const currentTimeRef = useRef(null);
    const durationRef = useRef(null);
    const songsRef = useRef(songs);
    const idxRef = useRef(0);
    const isPlayingRef = useRef(false); // ใช้ Ref ตามประกบ State เพื่อให้ RAF เข้าถึงค่าล่าสุด

    // Sync Refs
    useEffect(() => { songsRef.current = songs; }, [songs]);
    useEffect(() => { 
        idxRef.current = currentSongIndex; 
        isPlayingRef.current = isPlaying;
    }, [currentSongIndex, isPlaying]);

    const getVideoId = useCallback((index) => {
        const currentSongs = songsRef.current;
        return extractYouTubeID(currentSongs[index]?.streamUrl) || FALLBACK_VIDEO_ID;
    }, []);

    // ── 1. UI Update Loop (60FPS) ───────────────────────────────────────────
    useEffect(() => {
        let requestRef;

        const updateUI = () => {
            const player = playerRef.current;
            // เช็คว่ากำลังเล่นอยู่ และ Player พร้อมใช้งานจริง
            if (isPlayingRef.current && player && typeof player.getCurrentTime === 'function') {
                const current = player.getCurrentTime();
                const total = player.getDuration();

                if (total > 0) {
                    const pct = (current / total) * 100;
                    
                    if (progressBarRef.current) {
                        progressBarRef.current.style.width = `${pct}%`;
                    }
                    if (currentTimeRef.current) {
                        currentTimeRef.current.innerText = formatTime(current);
                    }
                    if (durationRef.current) {
                        durationRef.current.innerText = formatTime(total);
                    }
                }
            }
            requestRef = requestAnimationFrame(updateUI);
        };

        requestRef = requestAnimationFrame(updateUI);
        return () => cancelAnimationFrame(requestRef);
    }, []); // Run ครั้งเดียวตอน mount แล้วใช้ Ref เช็คเงื่อนไขข้างใน

    // ── 2. Player Initialization ──────────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;

        const onPlayerReady = (event) => {
            if (!isMounted) return;
            setIsPlayerReady(true);
            event.target.unMute();
            event.target.setVolume(100);
        };

        const onPlayerStateChange = (event) => {
            if (!isMounted) return;
            const S = window.YT.PlayerState;

            if (event.data === S.PLAYING) {
                setIsPlaying(true);
            } else if (event.data === S.PAUSED || event.data === S.BUFFERING) {
                setIsPlaying(false);
            } else if (event.data === S.ENDED) {
                const nextIdx = (idxRef.current + 1) % songsRef.current.length;
                handleSongSelect(nextIdx);
            }
        };

        const initPlayer = () => {
            if (!isMounted || !window.YT || playerRef.current) return;
            
            const el = document.getElementById(playerId);
            if (!el) return;

            playerRef.current = new window.YT.Player(playerId, {
                height: '1', width: '1',
                videoId: getVideoId(0),
                playerVars: {
                    autoplay: autoplay ? 1 : 0,
                    controls: 0, rel: 0, enablejsapi: 1, origin: window.location.origin
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });
        };

        loadYouTubeAPI(initPlayer);

        return () => {
            isMounted = false;
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [playerId, autoplay, getVideoId]);

    // ── 3. Actions ───────────────────────────────────────────────────────────
    const togglePlayPause = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;

        if (isPlayingRef.current) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, [isPlayerReady]);

    const handleSongSelect = useCallback((index, e) => {
        if (e) e.stopPropagation();
        const player = playerRef.current;
        if (!player || typeof player.loadVideoById !== 'function') return;

        const videoId = getVideoId(index);
        player.loadVideoById(videoId);
        setCurrentSongIndex(index);
        setIsPlaying(true);
    }, [getVideoId]);

    const changeSong = useCallback((direction, e) => {
        if (e) e.stopPropagation();
        const next = (idxRef.current + direction + songsRef.current.length) % songsRef.current.length;
        handleSongSelect(next);
    }, [handleSongSelect]);

    const handleProgressClick = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const total = playerRef.current.getDuration();
        playerRef.current.seekTo(total * percentage, true);
    }, []);

    return {
        isPlaying,
        currentSongIndex,
        isPlayerReady,
        togglePlayPause,
        changeSong,
        handleSongSelect,
        handleProgressClick,
        progressBarRef,
        currentTimeRef,
        durationRef
    };
};

export default useYouTubePlayer;