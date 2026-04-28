import React, { useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
    Play, Pause, SkipForward, SkipBack, Minimize2, 
    Volume2, VolumeX, Volume1, ChevronDown, Music as IconMusic
} from 'lucide-react';
import { usePlayerStore } from '../stores/playerStore';
import useYouTubePlayer from '../hooks/useYouTubePlayer';
import useUIStore from '../stores/uiStore';

// --- Constants & Style Helpers ---
const PLAYER_ID = 'sticky-youtube-player';
const PLAYER_Z_INDEX = 1000;
const VOLUME_LOW_THRESHOLD = 30;
const PLAYER_WIDTH = 340;
const MINI_POSITION = { bottom: '2rem', left: '2rem' };
const PLAYER_POSITION = { bottom: '2rem', left: '2rem' };

const C = {
    accent: '#00F5D4',
    secondary: '#FF007F',
    bgGlass: 'rgba(11, 12, 16, 0.9)',
    border: 'rgba(0, 245, 212, 0.2)',
    textPrimary: '#FFFFFF',
    textMuted: '#94A3B8'
};

const BEAT_BARS_MINI = 4;
const BEAT_BARS_FULL = 12;
const BEAT_DURATION_BASE = 0.5;
const BEAT_DURATION_STEP = 0.1;
const BEAT_DELAY_STEP = 0.1;
const BEAT_KEYFRAMES_VARIANTS = ['40%', '100%', '60%', '85%', '45%', '90%', '55%', '70%'];

// Icons Wrapper
const IconPlay = () => <Play size={20} fill="currentColor" />;
const IconPause = () => <Pause size={20} fill="currentColor" />;
const IconNext = () => <SkipForward size={18} fill="currentColor" />;
const IconPrev = () => <SkipBack size={18} fill="currentColor" />;
const IconChevronDown = () => <ChevronDown size={18} />;
const IconVolHigh = () => <Volume2 size={16} />;
const IconVolLow = () => <Volume1 size={16} />;
const IconMute = () => <VolumeX size={16} />;

const YouTubeContainer = () => (
    <div id={PLAYER_ID} style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }} />
);

const StickyMusicPlayer = () => {
    const { 
        songs, artist, currentSongIndex, isMinimized, isPlaying: storeIsPlaying,
        toggleMinimize, setPlayerState, playNext, playPrevious,
        volume, setVolume: setStoreVolume, _hasHydrated,
        fetchDefaultSongs
    } = usePlayerStore();

    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const { isNavbarVisible } = useUIStore();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        animate={{ 
                            x: 0, 
                            opacity: 1,
                            y: isNavbarVisible ? 0 : 150
                        }}
                        exit={{ x: -80, opacity: 0 }}
                        onClick={toggleMinimize}
                        style={{ 
                            zIndex: PLAYER_Z_INDEX, 
                            position: 'fixed',
                            ...(isMobile 
                                ? { bottom: 'calc(5rem + env(safe-area-inset-bottom))', left: '1rem' } 
                                : MINI_POSITION) 
                        }}
                        className="fixed flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer select-none overflow-hidden transition-all duration-500"
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
                        animate={{ 
                            y: isNavbarVisible ? 0 : 400, 
                            opacity: 1, 
                            scale: 1 
                        }}
                        exit={{ y: 40, opacity: 0, scale: 0.95 }}
                        style={{ 
                            zIndex: PLAYER_Z_INDEX, 
                            ...(isMobile 
                                ? { bottom: 'calc(5rem + env(safe-area-inset-bottom))', left: '1rem', right: '1rem' } 
                                : PLAYER_POSITION), 
                            width: isMobile ? 'calc(100% - 2rem)' : PLAYER_WIDTH, 
                            position: 'fixed' 
                        }}
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
                                                className="w-1.5 rounded-t-full shadow-[0_0_12px_rgba(0,245,212,0.4)]"
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
                                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00F5D4] to-[#FF007F] rounded-full"
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
                                    <input type="range" min="0" max="100" value={volume} onChange={e => setStoreVolume(Number(e.target.value))} className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00F5D4]" />
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
