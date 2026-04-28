import { useState, useEffect, useRef, useCallback } from 'react';

const FALLBACK_YOUTUBE_ID = 'dQw4w9WgXcQ';

const extractYouTubeID = (url) => {
    if (!url) return null;
    // Enhanced regex to handle shorts, embeds, and various param orders
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
};

const useYouTubePlayer = (songs = [], playerId = 'yt-player', options = {}) => {
    const { 
        autoplay = false,
        artist = null,
        onSongEnded = null,
        initialIndex = 0,
        isPlaying: externalIsPlaying = false,
        onProgressUpdate = null // New callback to sync with store
    } = options;

    const [isPlaying, setIsPlaying]         = useState(false);
    const [progress, setProgress]           = useState(0);
    const [currentTime, setCurrentTime]     = useState('0:00');
    const [duration, setDuration]           = useState('0:00');
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    // --- Refs ---
    const playerRef = useRef(null);
    const lastVideoIdRef = useRef(null);
    const lastArtistIdRef = useRef(null);

    // Guarded setStates to prevent loops
    const safeSetIsPlaying = (val) => setIsPlaying(prev => prev !== val ? val : prev);

    // ── 1. API & Player Initialization ──
    useEffect(() => {
        const init = () => {
            if (window.YT && window.YT.Player && !playerRef.current) {
                initPlayer();
            }
        };

        const interval = setInterval(() => {
            if (window.YT && window.YT.Player) {
                init();
                clearInterval(interval);
            }
        }, 300);

        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        return () => clearInterval(interval);
    }, []);

    // ── 2. Artist Change Logic ──
    useEffect(() => {
        const currentId = artist?.id || artist?._id;
        if (lastArtistIdRef.current !== currentId) {
            lastArtistIdRef.current = currentId;
            lastVideoIdRef.current = null; // Reset tracking
        }
    }, [artist]);

    // ── 3. Video Loading Logic ──
    useEffect(() => {
        if (!songs?.length || !isPlayerReady || !playerRef.current) return;

        // Safety: ensure index is within bounds
        const targetIdx = (initialIndex >= 0 && initialIndex < songs.length) ? initialIndex : 0;
        const song = songs[targetIdx];
        if (!song) return;

        const videoId = extractYouTubeID(song.streamUrl) || FALLBACK_YOUTUBE_ID;

        // If same video, just restart it for responsiveness
        if (lastVideoIdRef.current === videoId) {
            if (playerRef.current.seekTo) playerRef.current.seekTo(0, true);
            if (playerRef.current.playVideo) playerRef.current.playVideo();
            return;
        }

        try {
            if (playerRef.current.loadVideoById) {
                if (externalIsPlaying) {
                    playerRef.current.loadVideoById(videoId);
                    lastVideoIdRef.current = videoId;
                    
                    // Aggressive autoplay: attempt immediate play + a small delayed play
                    if (playerRef.current.unMute) playerRef.current.unMute();
                    if (playerRef.current.playVideo) playerRef.current.playVideo();
                    
                    setTimeout(() => {
                        if (playerRef.current && playerRef.current.playVideo) {
                            playerRef.current.playVideo();
                        }
                    }, 150);
                    
                    safeSetIsPlaying(true);
                } else {
                    // Just cue the video if we are not supposed to be playing
                    if (playerRef.current.cueVideoById) {
                        playerRef.current.cueVideoById(videoId);
                    } else {
                        playerRef.current.loadVideoById(videoId);
                        playerRef.current.pauseVideo();
                    }
                    lastVideoIdRef.current = videoId;
                    safeSetIsPlaying(false);
                }
            }
        } catch (err) {
            console.error("YouTube Load Error:", err);
        }
    }, [songs, isPlayerReady, initialIndex, artist]);

    // ── 4. Global Play/Pause Sync ──
    useEffect(() => {
        if (!playerRef.current || !isPlayerReady) return;

        try {
            const pState = typeof playerRef.current.getPlayerState === 'function' 
                ? playerRef.current.getPlayerState() 
                : -1;

            if (externalIsPlaying) {
                // If store says PLAYING but player is not playing (1) or buffering (3)
                if (pState !== 1 && pState !== 3) {
                    playerRef.current.playVideo();
                }
            } else {
                // If store says PAUSED but player is not paused (2)
                if (pState !== 2) {
                    playerRef.current.pauseVideo();
                }
            }
        } catch (e) {
            console.warn("YouTube Sync Error:", e);
        }
    }, [externalIsPlaying, isPlayerReady]);

    // ── 5. Periodic Sync Guard (Fixes "stuck" play button) ──
    useEffect(() => {
        if (!playerRef.current || !isPlayerReady) return;

        const interval = setInterval(() => {
            try {
                const pState = typeof playerRef.current.getPlayerState === 'function' 
                    ? playerRef.current.getPlayerState() 
                    : -1;
                
                // If store says playing, but player is idle/ended/paused
                if (externalIsPlaying && (pState === 2 || pState === 5 || pState === 0)) {
                    playerRef.current.playVideo();
                }
            } catch (e) {}
        }, 1000);

        return () => clearInterval(interval);
    }, [externalIsPlaying, isPlayerReady]);

    // ── Interaction Listener ──
    useEffect(() => {
        if (!isPlayerReady) return;
        const handleInteraction = () => {
            if (playerRef.current && isPlaying) {
                if (playerRef.current.unMute) playerRef.current.unMute();
                if (playerRef.current.playVideo) playerRef.current.playVideo();
            }
            window.removeEventListener('mousedown', handleInteraction);
        };
        window.addEventListener('mousedown', handleInteraction);
        return () => window.removeEventListener('mousedown', handleInteraction);
    }, [isPlayerReady, isPlaying]);

    const initPlayer = () => {
        if (!window.YT || !window.YT.Player) return;
        
        playerRef.current = new window.YT.Player(playerId, {
            height: '0', width: '0',
            playerVars: { 
                autoplay: 1, controls: 0, disablekb: 1, fs: 0, 
                iv_load_policy: 3, modestbranding: 1, rel: 0, showinfo: 0,
                origin: window.location.origin,
                enablejsapi: 1
            },
            events: {
                onReady: () => setIsPlayerReady(true),
                onStateChange: (event) => {
                    const state = event.data;
                    if (state === window.YT.PlayerState.PLAYING) safeSetIsPlaying(true);
                    else if (state === window.YT.PlayerState.PAUSED) safeSetIsPlaying(false);
                    else if (state === window.YT.PlayerState.ENDED) {
                        safeSetIsPlaying(false);
                        if (onSongEnded) onSongEnded();
                    }
                },
                onError: (e) => console.error("YT Player Error:", e)
            },
        });
    };

    const togglePlayPause = useCallback(() => {
        if (!playerRef.current || !isPlayerReady) return;
        if (isPlaying) {
            if (playerRef.current.pauseVideo) playerRef.current.pauseVideo();
        } else {
            if (playerRef.current.playVideo) playerRef.current.playVideo();
            if (playerRef.current.unMute) playerRef.current.unMute();
        }
    }, [isPlaying, isPlayerReady]);

    const handleProgressClick = useCallback((percent) => {
        if (!playerRef.current || !isPlayerReady || !playerRef.current.getDuration) return;
        const time = (percent / 100) * playerRef.current.getDuration();
        if (playerRef.current.seekTo) playerRef.current.seekTo(time, true);
    }, [isPlayerReady]);

    const setVolume = useCallback((val) => {
        if (playerRef.current && isPlayerReady && playerRef.current.setVolume) {
            playerRef.current.setVolume(val);
        }
    }, [isPlayerReady]);

    // Time update loop
    useEffect(() => {
        let interval;
        if (isPlaying && isPlayerReady) {
            interval = setInterval(() => {
                if (playerRef.current?.getCurrentTime) {
                    const current = playerRef.current.getCurrentTime();
                    const total   = playerRef.current.getDuration();
                    if (total > 0) {
                        const pct = (current / total) * 100;
                        const fmt = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
                        const fCur = fmt(current);
                        const fDur = fmt(total);
                        setProgress(pct);
                        setCurrentTime(fCur);
                        setDuration(fDur);
                        if (onProgressUpdate) {
                            onProgressUpdate({
                                progress: pct,
                                currentTime: fCur,
                                duration: fDur
                            });
                        }
                    }
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isPlayerReady]);

    // ── 8. Seek Function ──
    const seekTo = useCallback((percent) => {
        if (!playerRef.current || !isPlayerReady) return;
        try {
            const duration = playerRef.current.getDuration();
            if (duration > 0) {
                const targetTime = (percent / 100) * duration;
                playerRef.current.seekTo(targetTime, true);
                // Also update local state immediately for responsiveness
                setProgress(percent);
            }
        } catch (e) {
            console.error("Seek Error:", e);
        }
    }, [isPlayerReady]);

    return {
        isPlaying, progress, currentTime, duration,
        isPlayerReady, togglePlayPause, handleProgressClick, setVolume, seekTo
    };
};

export default useYouTubePlayer;