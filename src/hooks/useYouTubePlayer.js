import { useState, useEffect, useRef, useCallback } from 'react';
import { extractYouTubeID } from '../utils/youtube';

const FALLBACK_YOUTUBE_ID = 'dQw4w9WgXcQ';

/**
 * useYouTubePlayer Hook
 * Manages a single YouTube IFrame API player instance for a given set of songs.
 */
const useYouTubePlayer = (songs = [], playerId = 'yt-player', options = {}) => {
    const { 
        autoplay = false, 
        previewMode = false, 
        startOffset = 45, 
        previewDuration = 10,
        onSongEnded = null,
        initialIndex = 0
    } = options;

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

        const targetIdx = initialIndex ?? 0;
        const firstVideoId = extractYouTubeID(songs[targetIdx]?.streamUrl) || extractYouTubeID(songs[0]?.streamUrl) || FALLBACK_YOUTUBE_ID;
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
                idxRef.current = targetIdx;
                setCurrentSongIndex(targetIdx);
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
                        } else if (event.data === S.PAUSED || event.data === S.CUED || event.data === S.UNSTARTED) {
                            setIsPlaying(false);
                        } else if (event.data === S.ENDED) {
                            if (onSongEnded) {
                                onSongEnded();
                            } else {
                                const next = (idxRef.current + 1) % songsRef.current.length;
                                const nextId = extractYouTubeID(songsRef.current[next]?.streamUrl) || FALLBACK_YOUTUBE_ID;
                                playerRef.current?.loadVideoById(nextId);
                                idxRef.current = next;
                                setCurrentSongIndex(next);
                            }
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
            
            // ใช้ Callback Queue เพื่อรองรับหลาย Player พร้อมกันโดยไม่ต้องใช้ Polling (setInterval)
            window.YTCallbacks = window.YTCallbacks || [];
            window.YTCallbacks.push(initPlayer);

            const previousOnReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof previousOnReady === 'function') previousOnReady();
                window.YTCallbacks.forEach(cb => cb());
                window.YTCallbacks = [];
            };
        } else {
            initPlayer();
        }
    }, [songs, playerId]);

    // ── Preview Mode Logic ────────────────────────────────────────────────
    useEffect(() => {
        if (previewMode && isPlaying && isPlayerReady && playerRef.current) {
            const player = playerRef.current;
            // Seek to start offset when playback begins
            if (typeof player.seekTo === 'function') {
                player.seekTo(startOffset, true);
            }
            
            const timer = setTimeout(() => {
                setIsPlaying(false);
                if (typeof player.pauseVideo === 'function') {
                    player.pauseVideo();
                }
            }, previewDuration * 1000);

            return () => clearTimeout(timer);
        }
    }, [isPlaying, currentSongIndex, isPlayerReady]);

    // ── Time/Progress Updates ─────────────────────────────────────────────
    useEffect(() => {
        let interval;
        if (isPlaying && isPlayerReady && playerRef.current) {
            interval = setInterval(() => {
                const player = playerRef.current;
                if (!player || typeof player.getCurrentTime !== 'function') return;

                const current = player.getCurrentTime();
                const total = player.getDuration();
                
                if (previewMode) {
                    // Calculate progress based on the preview window
                    const elapsed = current - startOffset;
                    const percent = Math.min(Math.max((elapsed / previewDuration) * 100, 0), 100);
                    setProgress(percent);
                    setCurrentTime(formatTime(Math.max(elapsed, 0)));
                    setDuration(formatTime(previewDuration));
                } else if (total > 0) {
                    setProgress((current / total) * 100);
                    setCurrentTime(formatTime(current));
                    setDuration(formatTime(total));
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isPlayerReady, previewMode, startOffset, previewDuration]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;
        
        try {
            const state = playerRef.current.getPlayerState();
            // 1 = PLAYING
            if (state === 1) {
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
    }, [isPlaying, isPlayerReady]);

    const changeSong = useCallback((direction, e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || songs.length === 0) return;
        const next = (currentSongIndex + direction + songs.length) % songs.length;
        const nextId = extractYouTubeID(songs[next]?.streamUrl) || FALLBACK_YOUTUBE_ID;
        playerRef.current.loadVideoById(nextId);
        setCurrentSongIndex(next);
        idxRef.current = next;
    }, [songs, currentSongIndex]);

    const handleSongSelect = useCallback((index, e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || songs.length === 0) return;
        const nextId = extractYouTubeID(songs[index]?.streamUrl) || FALLBACK_YOUTUBE_ID;
        playerRef.current.loadVideoById(nextId);
        setCurrentSongIndex(index);
        idxRef.current = index;
        setIsPlaying(true);
    }, [songs]);

    const handleProgressClick = useCallback((e) => {
        if (e) e.stopPropagation();
        if (!playerRef.current || !isPlayerReady) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const total = playerRef.current.getDuration();
        playerRef.current.seekTo(total * percentage, true);
    }, [isPlayerReady]);

    const setVolume = useCallback((vol) => {
        // vol: 0–100
        if (!playerRef.current || !isPlayerReady) return;
        playerRef.current.setVolume(Math.max(0, Math.min(100, vol)));
        if (vol === 0) {
            playerRef.current.mute();
        } else {
            playerRef.current.unMute();
        }
    }, [isPlayerReady]);

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
        handleProgressClick,
        setVolume,
    };
};

export default useYouTubePlayer;
