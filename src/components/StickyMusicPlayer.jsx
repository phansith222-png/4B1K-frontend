import React, { useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { usePlayerStore } from '../stores/playerStore';
import useYouTubePlayer from '../hooks/useYouTubePlayer';
import {
    PLAYER_ID, PLAYER_COLORS as C, PLAYER_Z_INDEX,
    PLAYER_WIDTH, PLAYER_POSITION, MINI_POSITION,
    FALLBACK_COVER, BEAT_KEYFRAMES, BEAT_KEYFRAMES_VARIANTS,
    BEAT_BARS_FULL, BEAT_BARS_MINI,
    BEAT_DURATION_BASE, BEAT_DURATION_STEP, BEAT_DELAY_STEP,
    DEFAULT_VOLUME, VOLUME_LOW_THRESHOLD,
} from '../config/playerConfig';

// ── Icons ───────────────────────────────────────────────────────────────────
const IconPrev = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>;
const IconNext = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5"><path d="M8 5v14l11-7z" /></svg>;
const IconPause = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const IconChevronDown = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 9l-7 7-7-7" /></svg>;
const IconMusic = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/></svg>;
const IconMute = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-3.01-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>;
const IconVolLow = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>;
const IconVolHigh = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/></svg>;

// ── YouTube Container (Frozen to prevent React from touching it after YT API takes over) ──
const YouTubeContainer = React.memo(() => (
    <div id={PLAYER_ID} style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none', zIndex: -1 }} />
), () => true);

const StickyMusicPlayer = () => {
    const { 
        songs, artist, currentSongIndex, isMinimized, isPlaying: storeIsPlaying,
        toggleMinimize, setPlayerState, playNext, playPrevious,
        volume, setVolume: setStoreVolume, _hasHydrated,
        fetchDefaultSongs
    } = usePlayerStore();

    // YouTube Hook Configuration
    const playerOptions = useMemo(() => ({
        autoplay: false,
        onSongEnded: playNext,
        initialIndex: currentSongIndex,
        isPlaying: storeIsPlaying,
        onProgressUpdate: (data) => setPlayerState(data) // 🔥 Sync to global store
    }), [artist, playNext, currentSongIndex, storeIsPlaying, setPlayerState]);
    
    const _progressRequest = usePlayerStore(state => state._progressRequest);

    const {
        isPlaying, progress, currentTime, duration, isPlayerReady, seekTo,
        togglePlayPause, setVolume: setYTVolume
    } = useYouTubePlayer(songs, PLAYER_ID, playerOptions);

    // Sync remote seek requests from page components
    const lastRequestTs = React.useRef(0);
    useEffect(() => {
        if (_progressRequest && _progressRequest.ts > lastRequestTs.current) {
            lastRequestTs.current = _progressRequest.ts;
            seekTo(_progressRequest.percent);
        }
    }, [_progressRequest, seekTo]);

    const handleLocalProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        seekTo(percent);
    };

    // Initial Load Logic
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current && _hasHydrated) {
            initialized.current = true;
            if (!artist || !songs?.length) {
                fetchDefaultSongs();
            }
        }
    }, [_hasHydrated, artist, songs, fetchDefaultSongs]);

    // Sync state back to store only when player is ready to avoid overwriting actions
    useEffect(() => {
        if (isPlayerReady) {
            setPlayerState({ isPlaying, isPlayerReady, progress });
        }
    }, [isPlaying, isPlayerReady, progress, setPlayerState]);

    // Handle Volume Sync
    useEffect(() => {
        if (isPlayerReady) setYTVolume(volume);
    }, [isPlayerReady, volume, setYTVolume]);

    const dragControls = useDragControls();
    const currentSong = songs[currentSongIndex] || null;

    if (!_hasHydrated) return null;

    return createPortal(
        <>
            <YouTubeContainer />
            <AnimatePresence mode="wait">
                {isMinimized ? (
                    <motion.button
                        key="mini"
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -80, opacity: 0 }}
                        onClick={toggleMinimize}
                        style={{ zIndex: PLAYER_Z_INDEX, ...MINI_POSITION }}
                        className="fixed flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer select-none overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="absolute inset-0" style={{ background: C.bgGlass, backdropFilter: 'blur(20px)', border: `1px solid ${C.border}`, borderRadius: '999px' }} />
                        <span className="relative z-10" style={{ color: C.accent }}><IconMusic /></span>
                        {currentSong && <span className="relative z-10 text-[11px] font-bold max-w-[80px] truncate" style={{ color: C.textPrimary }}>{currentSong.title}</span>}
                        <div className="relative z-10 flex items-end gap-[2px] h-3 ml-1">
                            {Array.from({ length: BEAT_BARS_MINI }).map((_, i) => (
                                <motion.div 
                                    key={i} 
                                    animate={isPlaying ? { height: BEAT_KEYFRAMES_VARIANTS[i % BEAT_KEYFRAMES_VARIANTS.length] } : { height: '20%' }} 
                                    transition={{ 
                                        duration: BEAT_DURATION_BASE + (i * 0.05), 
                                        repeat: Infinity, 
                                        delay: i * BEAT_DELAY_STEP,
                                        ease: "easeInOut"
                                    }} 
                                    className="w-[2px] rounded-full shadow-[0_0_8px_rgba(0,245,212,0.5)]" 
                                    style={{ background: `linear-gradient(to top, ${C.accent}, ${C.secondary})` }} 
                                />
                            ))}
                        </div>
                    </motion.button>
                ) : (
                    <motion.div
                        key="expanded"
                        drag dragControls={dragControls} dragMomentum={false} dragElastic={0.05}
                        dragListener={false} 
                        initial={{ y: 40, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.95 }}
                        style={{ zIndex: PLAYER_Z_INDEX, ...PLAYER_POSITION, width: PLAYER_WIDTH, position: 'fixed' }}
                        className="select-none"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: C.bgGlass, backdropFilter: 'blur(32px)', border: `1px solid ${C.border}` }}>
                            {/* Header */}
                            <div onPointerDown={e => dragControls.start(e)} className="w-full flex items-center justify-between px-4 py-2 cursor-grab active:cursor-grabbing border-b border-white/5">
                                <div className="flex items-center gap-2 opacity-60">
                                    <IconMusic /><span className="text-[9px] font-black tracking-widest uppercase">Cyber Player</span>
                                </div>
                                <button onClick={toggleMinimize} className="p-1 hover:text-white transition-colors text-white/40"><IconChevronDown /></button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className="font-black text-base truncate mb-1" style={{ color: C.textPrimary }}>{currentSong?.title || 'No Song Selected'}</h4>
                                        <p className="text-xs font-bold opacity-50 truncate" style={{ color: C.textMuted }}>
                                            {currentSong?.artistContext?.artistName || artist?.artistName || 'Unknown Artist'}
                                        </p>
                                    </div>
                                    <div className="flex items-end gap-[3px] h-8 px-2">
                                        {Array.from({ length: BEAT_BARS_FULL }).map((_, i) => (
                                            <motion.div 
                                                key={i}
                                                className="w-1.5 rounded-t-full shadow-[0_0_12px_rgba(0,245,212,0.3)]"
                                                style={{ background: `linear-gradient(to top, ${C.accent}, ${C.secondary})` }}
                                                animate={isPlaying ? { 
                                                    height: BEAT_KEYFRAMES_VARIANTS[i % BEAT_KEYFRAMES_VARIANTS.length],
                                                    opacity: [0.7, 1, 0.7]
                                                } : { 
                                                    height: '15%',
                                                    opacity: 0.4
                                                }}
                                                transition={{ 
                                                    duration: BEAT_DURATION_BASE + (i * BEAT_DURATION_STEP), 
                                                    repeat: Infinity, 
                                                    delay: i * BEAT_DELAY_STEP, 
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="space-y-1.5 mb-4">
                                    <div 
                                        className="w-full bg-white/10 h-1 rounded-full relative cursor-pointer group"
                                        onClick={handleLocalProgressClick}
                                    >
                                        <motion.div 
                                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                        <div 
                                            className="absolute w-2.5 h-2.5 bg-white rounded-full -translate-y-1/2 top-1/2 shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ left: `${progress}%`, marginLeft: '-5px' }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono text-white/40 tracking-tighter">
                                        <span>{currentTime}</span>
                                        <span>{duration}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-6 mb-4">
                                    <button onClick={playPrevious} className="p-2 hover:text-white transition-colors text-white/40"><IconPrev /></button>
                                    <motion.button onClick={togglePlayPause} whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.accent})`, color: '#000' }}>
                                        {isPlaying ? <IconPause /> : <IconPlay />}
                                    </motion.button>
                                    <button onClick={playNext} className="p-2 hover:text-white transition-colors text-white/40"><IconNext /></button>
                                </div>

                                {/* Volume */}
                                <div className="flex items-center gap-3 px-1 group">
                                    <button onClick={() => setStoreVolume(volume === 0 ? 80 : 0)} className="text-white/40 group-hover:text-white transition-colors">
                                        {volume === 0 ? <IconMute /> : volume < VOLUME_LOW_THRESHOLD ? <IconVolLow /> : <IconVolHigh />}
                                    </button>
                                    <input type="range" min="0" max="100" value={volume} onChange={e => setStoreVolume(Number(e.target.value))} className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400" />
                                    <span className="text-[10px] font-mono opacity-40 w-6 text-right">{volume}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>,
        document.getElementById('music-player-root') || document.body
    );
};

export default StickyMusicPlayer;
