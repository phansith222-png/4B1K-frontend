import { useState, useEffect, useRef } from 'react';
import { extractYouTubeID, formatTime } from '../utils/youtube';

/**
 * Manages a hidden YouTube IFrame player.
 *
 * Fix for "wrong songs playing":
 *   Original code had `if (playerRef.current) return` which skipped updating
 *   when a new artist's songs arrived. Now, if the player already exists we
 *   call cueVideoById(songs[0]) to swap tracks without destroying the player.
 *
 * No key tricks, no destroy(), no DOM manipulation — just swap the video.
 */
const useYouTubePlayer = (songs, playerId = 'yt-player-hidden', config = {}) => {
    const { 
        previewMode = false, 
        startOffset = 60, 
        previewDuration = 10 
    } = config;

    const [isPlaying, setIsPlaying]               = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress]                 = useState(0);
    const [currentTime, setCurrentTime]           = useState('0:00');
    const [duration, setDuration]                 = useState('0:00');
    const [isPlayerReady, setIsPlayerReady]       = useState(false);

    const playerRef = useRef(null);
    const songsRef  = useRef(songs);
    const idxRef    = useRef(0);

    // Always keep refs pointing at latest values (safe inside YT callbacks)
    useEffect(() => { songsRef.current = songs; }, [songs]);
    useEffect(() => { idxRef.current = currentSongIndex; }, [currentSongIndex]);

    // ── Player init / artist-change handler ───────────────────────────────
    useEffect(() => {
        if (songs.length === 0) return;

        const firstVideoId = extractYouTubeID(songs[0]?.streamUrl) || 'dQw4w9WgXcQ';

        // ✅ KEY FIX: if player already exists, just swap the video — no crash
        if (playerRef.current && isPlayerReady) {
            playerRef.current.cueVideoById(firstVideoId); // ready but not auto-playing
            idxRef.current = 0;
            setCurrentSongIndex(0);
            setProgress(0);
            setCurrentTime('0:00');
            setDuration('0:00');
            setIsPlaying(false);
            return;
        }

        // Player doesn't exist yet — create it
        const initPlayer = () => {
            if (playerRef.current || !document.getElementById(playerId)) return;

            playerRef.current = new window.YT.Player(playerId, {
                height: '0',
                width: '0',
                videoId: firstVideoId,
                playerVars: { autoplay: 0, controls: 0, showinfo: 0, rel: 0 },
                events: {
                    onReady: () => setIsPlayerReady(true),
                    onStateChange: (event) => {
                        const S = window.YT.PlayerState;
                        if (event.data === S.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === S.PAUSED) {
                            setIsPlaying(false);
                        } else if (event.data === S.ENDED) {
                            // Auto-advance using refs to avoid stale closures
                            const next = (idxRef.current + 1) % songsRef.current.length;
                            const nextId =
                                extractYouTubeID(songsRef.current[next]?.streamUrl) ||
                                'dQw4w9WgXcQ';
                            playerRef.current?.loadVideoById(nextId);
                            idxRef.current = next;
                            setCurrentSongIndex(next);
                            setProgress(0);
                            setCurrentTime('0:00');
                        }
                    },
                },
            });
        };

        if (!window.YT || !window.YT.Player) {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
            }
            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }
    }, [songs, playerId, isPlayerReady]);

    // ── Progress ticker ───────────────────────────────────────────────────
    useEffect(() => {
        if (!isPlaying || !isPlayerReady) return;

        const interval = setInterval(() => {
            if (!playerRef.current?.getCurrentTime) return;
            const current = playerRef.current.getCurrentTime() || 0;
            const total   = playerRef.current.getDuration()   || 0;
            
            // Check for preview mode end
            if (previewMode && current >= (startOffset + previewDuration)) {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
                return;
            }

            if (total > 0) {
                setProgress((current / total) * 100);
                setCurrentTime(formatTime(current));
                setDuration(formatTime(total));
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isPlaying, isPlayerReady, currentSongIndex]);

    // ── Controls ──────────────────────────────────────────────────────────
    const loadSong = (index) => {
        const s = songsRef.current;
        if (!playerRef.current || !isPlayerReady || index < 0 || index >= s.length) return;
        const videoId = extractYouTubeID(s[index]?.streamUrl) || 'dQw4w9WgXcQ';
        
        if (previewMode) {
            playerRef.current.loadVideoById({
                videoId: videoId,
                startSeconds: startOffset
            });
        } else {
            playerRef.current.loadVideoById(videoId);
        }
        idxRef.current = index;
        setCurrentSongIndex(index);
        setProgress(0);
        setCurrentTime('0:00');
        setIsPlaying(true);
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

    const changeSong = (direction, e) => {
        if (e) e.stopPropagation();
        const s = songsRef.current;
        if (!s.length || !isPlayerReady) return;
        let next = idxRef.current + direction;
        if (next < 0) next = s.length - 1;
        if (next >= s.length) next = 0;
        loadSong(next);
    };

    const handleSongSelect = (idx, e) => {
        console.log("Song selected at index:", idx);
        if (e) e.stopPropagation();
        
        // In preview mode, always reload to ensure we start at the chorus (restart)
        if (previewMode) {
            loadSong(idx);
            return;
        }

        if (idxRef.current === idx) {
            togglePlayPause(e);
        } else {
            loadSong(idx);
        }
    };

    const handleProgressClick = (e) => {
        if (!playerRef.current || !isPlayerReady) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        const total = playerRef.current.getDuration();
        if (total > 0) {
            playerRef.current.seekTo(pct * total, true);
            setProgress(pct * 100);
        }
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
        handleProgressClick,
    };
};

export default useYouTubePlayer;
