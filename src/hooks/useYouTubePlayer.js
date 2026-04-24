import { useState, useEffect, useRef } from 'react';
import { extractYouTubeID } from '../utils/youtube';

/**
 * useYouTubePlayer Hook
 * Manages a single YouTube IFrame API player instance for a given set of songs.
 */
const useYouTubePlayer = (songs = [], playerId = 'yt-player', options = {}) => {
    const { autoplay = false } = options;

    const [isPlaying, setIsPlaying]               = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress]                 = useState(0);
    const [currentTime, setCurrentTime]           = useState('0:00');
    const [duration, setDuration]                 = useState('0:00');
    const [isPlayerReady, setIsPlayerReady]       = useState(false);

    const playerRef = useRef(null);
    const songsRef  = useRef(songs);
    const idxRef    = useRef(0);
    const pendingVideoIdRef = useRef(null);

    // Always keep refs pointing at latest values
    useEffect(() => { songsRef.current = songs; }, [songs]);
    useEffect(() => { idxRef.current = currentSongIndex; }, [currentSongIndex]);

    // ── Player init / artist-change handler ───────────────────────────────
    useEffect(() => {
        if (songs.length === 0) return;

        const firstVideoId = extractYouTubeID(songs[0]?.streamUrl) || 'dQw4w9WgXcQ';
        pendingVideoIdRef.current = firstVideoId;

        if (playerRef.current) {
            if (isPlayerReady) {
                if (autoplay) {
                    playerRef.current.loadVideoById(firstVideoId);
                    setIsPlaying(true);
                } else {
                    playerRef.current.cueVideoById(firstVideoId);
                    setIsPlaying(false);
                }
                idxRef.current = 0;
                setCurrentSongIndex(0);
                setProgress(0);
                pendingVideoIdRef.current = null;
            }
            return;
        }

        const initPlayer = () => {
            const el = document.getElementById(playerId);
            if (!el) return;
            if (playerRef.current || !window.YT || !window.YT.Player) return;

            console.log(`YouTube Player: Init #${playerId} with ${firstVideoId}`);

            playerRef.current = new window.YT.Player(playerId, {
                height: '1',
                width: '1',
                videoId: firstVideoId,
                playerVars: { 
                    autoplay: autoplay ? 1 : 0, 
                    controls: 0, 
                    showinfo: 0, 
                    rel: 0,
                    mute: 0,
                    origin: window.location.origin,
                    enablejsapi: 1
                },
                events: {
                    onReady: (event) => {
                        setIsPlayerReady(true);
                        console.log(`YouTube Player Ready: #${playerId}`);
                        
                        // Force Unmute and Max Volume
                        event.target.unMute();
                        event.target.setVolume(100);
                        
                        if (pendingVideoIdRef.current) {
                            if (autoplay) {
                                event.target.loadVideoById(pendingVideoIdRef.current);
                                setIsPlaying(true);
                            } else {
                                event.target.cueVideoById(pendingVideoIdRef.current);
                            }
                            pendingVideoIdRef.current = null;
                        }
                    },
                    onStateChange: (event) => {
                        const S = window.YT.PlayerState;
                        if (event.data === S.PLAYING) {
                            setIsPlaying(true);
                            event.target.unMute();
                            event.target.setVolume(100);
                        } else if (event.data === S.PAUSED) {
                            setIsPlaying(false);
                        } else if (event.data === S.ENDED) {
                            const next = (idxRef.current + 1) % songsRef.current.length;
                            const nextId = extractYouTubeID(songsRef.current[next]?.streamUrl) || 'dQw4w9WgXcQ';
                            playerRef.current?.loadVideoById(nextId);
                            idxRef.current = next;
                            setCurrentSongIndex(next);
                        }
                    },
                    onError: (err) => {
                        console.error(`YouTube Player #${playerId} Error:`, err.data);
                        setIsPlaying(false);
                    }
                },
            });
        };

        if (!window.YT || !window.YT.Player) {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
            }
            const previousOnReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (previousOnReady) previousOnReady();
                initPlayer();
            };
            const checkInterval = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    initPlayer();
                    clearInterval(checkInterval);
                }
            }, 500);
            return () => clearInterval(checkInterval);
        } else {
            initPlayer();
        }
    }, [songs, playerId]);

    // ── Time/Progress Updates ─────────────────────────────────────────────
    useEffect(() => {
        let interval;
        if (isPlaying && isPlayerReady && playerRef.current) {
            interval = setInterval(() => {
                const current = playerRef.current.getCurrentTime();
                const total = playerRef.current.getDuration();
                if (total > 0) {
                    setProgress((current / total) * 100);
                    setCurrentTime(formatTime(current));
                    setDuration(formatTime(total));
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isPlayerReady]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = (e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;
        
        try {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                if (typeof playerRef.current.unMute === 'function') {
                    playerRef.current.unMute();
                    playerRef.current.setVolume(100);
                }
                playerRef.current.playVideo();
            }
        } catch (err) {
            console.error("Playback Error:", err);
        }
    };

    const changeSong = (direction, e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || songs.length === 0) return;
        const next = (currentSongIndex + direction + songs.length) % songs.length;
        const nextId = extractYouTubeID(songs[next]?.streamUrl) || 'dQw4w9WgXcQ';
        playerRef.current.loadVideoById(nextId);
        setCurrentSongIndex(next);
        idxRef.current = next;
    };

    const handleSongSelect = (index, e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || songs.length === 0) return;
        const nextId = extractYouTubeID(songs[index]?.streamUrl) || 'dQw4w9WgXcQ';
        playerRef.current.loadVideoById(nextId);
        setCurrentSongIndex(index);
        idxRef.current = index;
        setIsPlaying(true);
    };

    const handleProgressClick = (e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const total = playerRef.current.getDuration();
        playerRef.current.seekTo(total * percentage, true);
    };

    return {
        isPlaying,
        currentSongIndex,
        progress,
        currentTime,
        duration,
        isPlayerReady,
        togglePlayPause,
        changeSong,
        handleSongSelect,
        handleProgressClick
    };
};

export default useYouTubePlayer;
