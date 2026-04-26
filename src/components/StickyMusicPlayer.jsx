import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { usePlayerStore } from '../stores/playerStore';
import useYouTubePlayer from '../hooks/useYouTubePlayer';
import {
    PLAYER_ID, PLAYER_COLORS as C, PLAYER_Z_INDEX,
    PLAYER_WIDTH, PLAYER_POSITION, MINI_POSITION,
    FALLBACK_COVER, BEAT_KEYFRAMES,
    BEAT_BARS_FULL, BEAT_BARS_MINI,
    BEAT_DURATION_BASE, BEAT_DURATION_STEP, BEAT_DELAY_STEP,
    DEFAULT_VOLUME, VOLUME_LOW_THRESHOLD,
} from '../config/playerConfig';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconPrev = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
);
const IconNext = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
);
const IconPlay = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
        <path d="M8 5v14l11-7z" />
    </svg>
);
const IconPause = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);
const IconChevronDown = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
const IconMusic = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/>
    </svg>
);
const IconVolume = ({ level }) => {
    if (level === 0) return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-3.01-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
    );
    if (level < VOLUME_LOW_THRESHOLD) return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
    );
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>
        </svg>
    );
};

// ── Beat Visualizer ────────────────────────────────────────────────────────────
function BeatVisualizer({ isPlaying, color = C.accent, bars = BEAT_BARS_FULL, size = 'md' }) {
    const h = size === 'sm' ? 'h-3' : 'h-5';
    const w = size === 'sm' ? 'w-0.5' : 'w-1';
    return (
        <div className={`flex items-end gap-[3px] ${h}`}>
            {Array.from({ length: bars }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`${w} rounded-sm`}
                    style={{ backgroundColor: color }}
                    animate={isPlaying ? { height: BEAT_KEYFRAMES } : { height: '15%' }}
                    transition={{
                        repeat: Infinity,
                        duration: BEAT_DURATION_BASE + i * BEAT_DURATION_STEP,
                        delay:    i * BEAT_DELAY_STEP,
                        ease:     'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StickyMusicPlayer() {
    // Store
    const songs           = usePlayerStore(s => s.songs);
    const artist          = usePlayerStore(s => s.artist);
    const isMinimized     = usePlayerStore(s => s.isMinimized);
    const toggleMinimize  = usePlayerStore(s => s.toggleMinimize);
    const setPlayerState  = usePlayerStore(s => s.setPlayerState);
    const setControls     = usePlayerStore(s => s.setControls);
    const playNext        = usePlayerStore(s => s.playNext);
    const playPrevious    = usePlayerStore(s => s.playPrevious);
    const buildQueue      = usePlayerStore(s => s.buildQueue);
    const playFromQueue   = usePlayerStore(s => s.playFromQueue);
    const pendingPlayIndex = usePlayerStore(s => s.pendingPlayIndex);
    const clearPendingPlay = usePlayerStore(s => s.clearPendingPlay);

    // YouTube hook
    const {
        isPlaying, currentSongIndex, progress, currentTime, duration,
        isPlayerReady, togglePlayPause, handleSongSelect, handleProgressClick, setVolume
    } = useYouTubePlayer(songs, PLAYER_ID, {
        autoplay: true,
        onSongEnded: playNext,
        initialIndex: pendingPlayIndex ?? 0,
    });

    // Volume state
    const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
    const handleVolumeChange = (val) => {
        const v = Number(val);
        setVolumeState(v);
        setVolume(v);
    };

    const handleNext = e => { e?.stopPropagation(); playNext(); };
    const handlePrev = e => { e?.stopPropagation(); playPrevious(); };

    // Sync to store
    useEffect(() => {
        setPlayerState({ isPlaying, currentSongIndex, progress, currentTime, duration, isPlayerReady });
    }, [isPlaying, currentSongIndex, progress, currentTime, duration, isPlayerReady, setPlayerState]);

    useEffect(() => {
        setControls({ togglePlayPause, handleSongSelect, handleProgressClick });
    }, [togglePlayPause, handleSongSelect, handleProgressClick, setControls]);

    useEffect(() => {
        if (pendingPlayIndex !== null && songs.length > 0) clearPendingPlay();
    }, [songs, pendingPlayIndex]); // eslint-disable-line

    // Init queue on mount
    const initialized = useRef(false);
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        buildQueue().then(q => { if (q?.length) playFromQueue(0); });
    }, []); // eslint-disable-line

    // Draggable state for expanded player
    const dragControls = useDragControls();
    const constraintsRef = useRef(null);

    const currentSong = songs[currentSongIndex] || null;
    const isLoaded    = !!(currentSong && artist);
    const coverSrc    = currentSong?.coverImage || artist?.profileImage || FALLBACK_COVER;

    return (
        <>
            {/* Invisible drag constraint layer */}
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }} />

            {/* YouTube player — outside React tree to avoid DOM conflicts */}
            {createPortal(
                <div id={PLAYER_ID} style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} />,
                document.body
            )}

            <AnimatePresence mode="wait">
                {isMinimized ? (
                    /* ════════════════════════════════════════════════
                       MINIMIZED — Cyberpunk pill, no image, beats only
                       ════════════════════════════════════════════════ */
                    <motion.button
                        key="mini"
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -80, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        onClick={toggleMinimize}
                    style={{ zIndex: PLAYER_Z_INDEX, ...MINI_POSITION }}
                        className="fixed flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer select-none"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Glassmorphism pill background */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: C.bgGlass,
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: `1px solid ${C.border}`,
                                boxShadow: `0 0 20px rgba(0,245,212,0.12), 0 8px 32px rgba(0,0,0,0.4)`,
                            }}
                        />

                        {/* Music icon */}
                        <span className="relative z-10" style={{ color: C.accent }}>
                            <IconMusic />
                        </span>

                        {/* Song title (when loaded) */}
                        {isLoaded && (
                            <span
                                className="relative z-10 text-xs font-bold max-w-[100px] truncate"
                                style={{ color: C.textPrimary }}
                            >
                                {currentSong.title}
                            </span>
                        )}

                        {/* Beat bars */}
                        <span className="relative z-10">
                            <BeatVisualizer isPlaying={isPlaying} size="sm" bars={BEAT_BARS_MINI} />
                        </span>
                    </motion.button>
                ) : (
                    /* ════════════════════════════════════════════════
                       EXPANDED — Draggable cyberpunk player card
                       ════════════════════════════════════════════════ */
                    <motion.div
                        key="expanded"
                        drag
                        dragControls={dragControls}
                        dragMomentum={false}
                        dragConstraints={constraintsRef}
                        dragElastic={0.05}
                        initial={{ y: 40, opacity: 0, scale: 0.92 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                         style={{
                            zIndex: PLAYER_Z_INDEX,
                            ...PLAYER_POSITION,
                            width: PLAYER_WIDTH,
                            position: 'fixed',
                        }}
                        className="select-none"
                    >
                        {/* Card shell */}
                        <div
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                                background: C.bgGlass,
                                backdropFilter: 'blur(32px)',
                                WebkitBackdropFilter: 'blur(32px)',
                                border: `1px solid ${C.border}`,
                                boxShadow: `0 0 0 1px rgba(0,245,212,0.06), 0 24px 60px rgba(0,0,0,0.7), 0 0 80px rgba(0,245,212,0.05)`,
                            }}
                        >
                            {/* Drag handle strip */}
                            <div
                                onPointerDown={e => dragControls.start(e)}
                                className="w-full flex items-center justify-between px-4 pt-3 pb-1 cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-2">
                                    <span style={{ color: C.accent }}><IconMusic /></span>
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: C.textMuted }}>
                                        Now Playing
                                    </span>
                                </div>
                                <button
                                    onClick={toggleMinimize}
                                    onPointerDown={e => e.stopPropagation()}
                                    className="rounded-full p-1 transition-colors"
                                    style={{ color: C.textMuted }}
                                    onMouseEnter={e => e.currentTarget.style.color = C.textPrimary}
                                    onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                                >
                                    <IconChevronDown />
                                </button>
                            </div>

                            {/* Accent line */}
                            <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.accent}50, transparent)` }} />

                            {/* Content */}
                            <div className="px-4 pb-4 pt-3">
                                {!isLoaded ? (
                                    /* Loading skeleton */
                                    <div className="flex gap-4 animate-pulse">
                                        <div className="w-16 h-16 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="h-3 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                            <div className="h-2 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
                                            <div className="h-1 rounded-full w-full mt-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Song info row — title/artist left, beat right */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-base truncate mb-0.5" style={{ color: C.textPrimary }}>
                                                    {currentSong.title}
                                                </h4>
                                                <p className="text-xs font-semibold truncate" style={{ color: C.textMuted }}>
                                                    {artist.artistName}
                                                </p>
                                            </div>
                                            {/* Beat visualizer pinned to the right */}
                                            <div className="flex-shrink-0">
                                                <BeatVisualizer isPlaying={isPlaying} bars={BEAT_BARS_FULL} />
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div
                                            className="relative w-full h-1 rounded-full mb-1 cursor-pointer group"
                                            style={{ background: 'rgba(255,255,255,0.06)' }}
                                            onClick={handleProgressClick}
                                        >
                                            <div
                                                className="h-full rounded-full transition-all relative"
                                                style={{
                                                    width: `${progress}%`,
                                                    background: `linear-gradient(90deg, ${C.secondary}, ${C.accent})`,
                                                }}
                                            >
                                                <div
                                                    className="absolute right-0 top-1/2 w-2.5 h-2.5 rounded-full transition-all"
                                                    style={{
                                                        background: '#fff',
                                                        boxShadow: `0 0 10px ${C.accent}, 0 0 5px #fff`,
                                                        transform: 'translate(50%, -50%)',
                                                        zIndex: 20
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between mb-3">
                                            <span className="text-[10px] font-mono" style={{ color: C.textMuted }}>{currentTime}</span>
                                            <span className="text-[10px] font-mono" style={{ color: C.textMuted }}>{duration}</span>
                                        </div>
                                    </>
                                )}

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-5 mb-3">
                                    {/* Prev */}
                                    <motion.button
                                        onClick={handlePrev}
                                        onPointerDown={e => e.stopPropagation()}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{ color: C.textMuted }}
                                        onMouseEnter={e => e.currentTarget.style.color = C.textPrimary}
                                        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                                        className="transition-colors"
                                    >
                                        <IconPrev />
                                    </motion.button>

                                    {/* Play / Pause */}
                                    <motion.button
                                        onClick={togglePlayPause}
                                        onPointerDown={e => e.stopPropagation()}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(135deg, ${C.secondary}, ${C.accent})`,
                                            boxShadow: `0 0 20px ${C.accent}50, 0 0 40px ${C.secondary}20`,
                                            color: '#000',
                                        }}
                                    >
                                        {isPlaying ? <IconPause /> : <IconPlay />}
                                    </motion.button>

                                    {/* Next */}
                                    <motion.button
                                        onClick={handleNext}
                                        onPointerDown={e => e.stopPropagation()}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{ color: C.textMuted }}
                                        onMouseEnter={e => e.currentTarget.style.color = C.textPrimary}
                                        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                                        className="transition-colors"
                                    >
                                        <IconNext />
                                    </motion.button>
                                </div>

                                {/* Volume row */}
                                <div className="flex items-center gap-3 px-1">
                                    <button
                                        onClick={() => handleVolumeChange(volume === 0 ? DEFAULT_VOLUME : 0)}
                                        onPointerDown={e => e.stopPropagation()}
                                        style={{ color: C.textMuted, flexShrink: 0 }}
                                        onMouseEnter={e => e.currentTarget.style.color = C.accent}
                                        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
                                        className="transition-colors"
                                    >
                                        <IconVolume level={volume} />
                                    </button>

                                    {/* Volume slider */}
                                    <div className="flex-1 relative h-1 group">
                                        <div
                                            className="absolute inset-0 rounded-full"
                                            style={{ background: 'rgba(255,255,255,0.07)' }}
                                        />
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full"
                                            style={{
                                                width: `${volume}%`,
                                                background: `linear-gradient(90deg, ${C.secondary}, ${C.accent})`,
                                            }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={e => handleVolumeChange(e.target.value)}
                                            onPointerDown={e => e.stopPropagation()}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
                                            style={{ accentColor: C.accent }}
                                        />
                                    </div>

                                    <span
                                        className="text-[10px] font-mono w-6 text-right"
                                        style={{ color: C.textMuted }}
                                    >
                                        {volume}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
