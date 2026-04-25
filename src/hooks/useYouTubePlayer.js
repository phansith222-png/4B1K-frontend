import { useState, useEffect, useRef, useCallback } from 'react';
import { extractYouTubeID, formatTime, loadYouTubeAPI } from '../utils/youtube';

const FALLBACK_VIDEO_ID = 'dQw4w9WgXcQ';

/**
 * useYouTubePlayer
 * Manages the YouTube IFrame Player API lifecycle, playback, and progress.
 */
const useYouTubePlayer = (songs = [], playerId = 'yt-player', options = {}) => {
    const { autoplay = false } = options;

    // --- State ---
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);

    // --- Refs ---
    const playerRef = useRef(null);
    const progressBarRef = useRef(null);
    const currentTimeRef = useRef(null);
    const durationRef = useRef(null);

    // Single stable ref object — always up-to-date, safe inside closures
    const stableRef = useRef({
        songs,
        index: 0,
        isPlaying: false,
        isReady: false,
        getVideoId: null,
        handleSongSelect: null,
    });

    // Keep stable ref in sync every render
    stableRef.current.songs = songs;
    stableRef.current.index = currentSongIndex;
    stableRef.current.isPlaying = isPlaying;
    stableRef.current.isReady = isPlayerReady;

    // --- Helpers ---
    const getVideoId = useCallback((index) => {
        const song = stableRef.current.songs[index];
        return extractYouTubeID(song?.streamUrl) || FALLBACK_VIDEO_ID;
    }, []);
    stableRef.current.getVideoId = getVideoId;

    // --- Actions (defined early so they can be referenced in init) ---
    const handleSongSelect = useCallback((index, e) => {
        if (e) e.stopPropagation();
        const player = playerRef.current;
        if (!player || typeof player.loadVideoById !== 'function') return;
        player.loadVideoById(stableRef.current.getVideoId(index));
        setCurrentSongIndex(index);
        setIsPlaying(true);
    }, []);
    stableRef.current.handleSongSelect = handleSongSelect;

    const togglePlayPause = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || !stableRef.current.isReady) return;
        if (stableRef.current.isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    }, []);

    const changeSong = useCallback((direction, e) => {
        if (e) e.stopPropagation();
        const total = stableRef.current.songs.length;
        if (total === 0) return;
        stableRef.current.handleSongSelect(
            (stableRef.current.index + direction + total) % total
        );
    }, []);

    const handleProgressClick = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const dur = playerRef.current.getDuration();
        if (dur > 0) playerRef.current.seekTo(dur * pct, true);
    }, []);

    // --- RAF Progress Update Loop (DOM-only, no state = no lag) ---
    useEffect(() => {
        let rafId;
        const update = () => {
            const player = playerRef.current;
            if (stableRef.current.isPlaying && player && typeof player.getCurrentTime === 'function') {
                const cur = player.getCurrentTime();
                const dur = player.getDuration();
                if (dur > 0) {
                    const pct = (cur / dur) * 100;
                    // Direct DOM manipulation — no React re-render
                    if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
                    if (currentTimeRef.current) currentTimeRef.current.innerText = formatTime(cur);
                    if (durationRef.current) durationRef.current.innerText = formatTime(dur);
                }
            }
            rafId = requestAnimationFrame(update);
        };
        rafId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // --- Player Initialization ---
    useEffect(() => {
        let isMounted = true;

        const onPlayerReady = (event) => {
            if (!isMounted) return;
            event.target.unMute();
            event.target.setVolume(100);
            setIsPlayerReady(true);
            stableRef.current.isReady = true; // Immediate update for same-tick access
            if (autoplay) event.target.playVideo();
        };

        const onPlayerStateChange = (event) => {
            if (!isMounted) return;
            const S = window.YT.PlayerState;
            if (event.data === S.PLAYING) {
                setIsPlaying(true);
                stableRef.current.isPlaying = true;
            } else if (event.data === S.PAUSED || event.data === S.BUFFERING) {
                setIsPlaying(false);
                stableRef.current.isPlaying = false;
            } else if (event.data === S.ENDED) {
                const nextIdx = (stableRef.current.index + 1) % stableRef.current.songs.length;
                stableRef.current.handleSongSelect(nextIdx); // Use stable ref — no stale closure
            }
        };

        const init = () => {
            if (!isMounted || !window.YT || playerRef.current) return;
            const el = document.getElementById(playerId);
            if (!el) return;

            playerRef.current = new window.YT.Player(playerId, {
                height: '1',
                width: '1',
                videoId: stableRef.current.getVideoId(0),
                playerVars: {
                    autoplay: autoplay ? 1 : 0,
                    controls: 0,
                    rel: 0,
                    enablejsapi: 1,
                    origin: window.location.origin,
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        };

        loadYouTubeAPI(init);

        return () => {
            isMounted = false;
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch (_) {}
                playerRef.current = null;
            }
        };
    }, [playerId, autoplay]);

    return {
        isPlaying,
        currentSongIndex,
        isPlayerReady,
        currentTime,
        duration,
        progress,
        progressBarRef,
        currentTimeRef,
        durationRef,
        playerRef,
        togglePlayPause,
        changeSong,
        handleSongSelect,
        handleProgressClick,
    };
};

export default useYouTubePlayer;