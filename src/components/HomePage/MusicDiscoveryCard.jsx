import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, Music2, RefreshCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllArtists, getArtistById } from '../../api/artist';
import useYouTubePlayer from '../../hooks/useYouTubePlayer';
import { normalizeArtist, normalizeArtistList } from '../../utils/normalizeData';

export default function MusicDiscoveryCard() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const [countdown, setCountdown] = useState(15);

  // Stable ID to prevent re-initialization on every render
  const PLAYER_ID = React.useMemo(() => `music-discovery-player-${Math.floor(Math.random() * 10000)}`, []);
  
  // 1. Fetch Artists
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[MusicCard] STAGE 1: Fetching all artists...');
        const resp = await getAllArtists();

        const list = normalizeArtistList(resp)

        console.log(`[MusicCard] STAGE 1 SUCCESS: Found ${list.length} artists`);

        if (list.length > 0) {
          setArtists(list);
          const randomIdx = Math.floor(Math.random() * list.length);
          const firstArtist = list[randomIdx];

          // เปลี่ยนมาใช้ฟังก์ชันดึงข้อมูลเต็มตัวแทนการเรียกแยกเส้น
          await loadFullArtistData(firstArtist.id);
        } else {
          setLoading(false);
          setError('No artists found in DB');
        }
      } catch (err) {
        console.error('[MusicCard] STAGE 1 ERROR:', err);
        setError('Artist fetch failed');
        setLoading(false);
      }
    };
    init();
  }, [retryCount]);

  const loadFullArtistData = async (artistId, artistName) => {
    try {
      setLoading(true);
      // เรียก getArtistById ซึ่ง Backend จะ include songs มาให้แล้ว
      const resp = await getArtistById(artistId);
      const { artist, songs: artistSongs } = normalizeArtist(resp);

      if (artist) {
        setCurrentArtist(artist);
        // ถ้ามีเพลง ให้เก็บเพลงไว้เล่น ถ้าไม่มีเพลง ให้สุ่มใหม่
        if (artistSongs.length > 0) {
          setSongs(artistSongs);
          setCountdown(15);
        } else {
          console.warn(`[MusicCard] ${artist.artistName} has no songs, shuffling next...`);
          // ถ้าไม่มีเพลง ให้ข้ามไปสุ่มคนใหม่
          setTimeout(() => pickRandomArtist(), 500);
          return;
        }
      }
    } catch (err) {
      console.error('[MusicCard] STAGE 2 ERROR:', err);
      setSongs([]);
      setLoading(false);
    }
  };

  const pickRandomArtist = async () => {
    if (artists.length === 0) return;

    let filtered = artists;
    if (currentArtist) {
      filtered = artists.filter(a => a.id !== currentArtist.id);
      if (filtered.length === 0) filtered = artists;
    }

    const randomArtist = filtered[Math.floor(Math.random() * filtered.length)];
    // เรียกโหลดข้อมูลใหม่ (ซึ่งรวมเพลงมาด้วย)
    await loadFullArtistData(randomArtist.id);
  };

  const { isPlaying, togglePlayPause, isPlayerReady } = useYouTubePlayer(songs, PLAYER_ID, {
    autoplay: false
  });

  const currentSong = songs[0];

  useEffect(() => {
    if (isPlaying || loading) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          pickRandomArtist();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isPlaying, artists, currentArtist, loading]);

  return (
    <div className="bg-[#1A1C23]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-7 relative overflow-hidden group shadow-2xl min-h-[250px]">
      {/* YT Player Mount Point */}
      <div className="absolute top-0 left-0 opacity-0 pointer-events-none">
        <div id={PLAYER_ID}></div>
      </div>

      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'bg-[#00E5FF]/30 animate-pulse' : 'bg-[#FF007F]/20'}`} />

      <div className="relative z-10 flex flex-col h-full gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Music2 size={14} className={isPlaying ? 'text-[#00E5FF] animate-bounce' : 'text-gray-500'} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {loading ? 'SYNCING DATA...' : isPlaying ? 'ON AIR' : `NEXT SHUFFLE: ${countdown}S`}
            </span>
          </div>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 text-gray-500 hover:text-[#00E5FF] transition-all"
          >
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-2 text-red-400/60">
                <AlertTriangle size={24} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{error}</span>
              </motion.div>
            ) : (
              <motion.div
                key={currentArtist?.id || 'loading'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-5"
              >
                <div className="relative shrink-0 group/img cursor-pointer" onClick={() => navigate(`/pop?artistId=${currentArtist?.id}`)}>
                  {currentArtist?.profileImage ? (
                    <img
                      src={currentArtist.profileImage}
                      className={`w-16 h-16 rounded-[1.25rem] object-cover border-2 transition-all duration-700 ${isPlaying ? 'border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.4)] scale-110' : 'border-white/10 scale-100'}`}
                      alt=""
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-black text-lg text-gray-600">
                      {currentArtist?.artistName?.slice(0, 1) || '?'}
                    </div>
                  )}
                  {isPlaying && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-lg">
                      <div className="flex gap-[1px] items-end h-2.5">
                        {[1, 2, 3].map(i => (
                          <motion.div key={i} animate={{ height: [2, 10, 2] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-[1.5px] bg-black" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-lg leading-tight truncate uppercase tracking-tight group-hover:text-[#00E5FF] transition-colors">
                    {currentSong?.title || (loading ? 'Scanning...' : 'No Music')}
                  </h4>
                  <p className="text-[#00E5FF] text-xs font-bold truncate opacity-80 uppercase tracking-[0.1em] mt-1">
                    {currentArtist?.artistName || '4B1K UNIVERSE'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={togglePlayPause}
            disabled={!isPlayerReady || songs.length === 0}
            className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs tracking-[0.15em] uppercase transition-all ${isPlaying
              ? 'bg-white/10 text-white border border-white/10 shadow-inner'
              : 'bg-[#00E5FF] text-black shadow-[0_10px_30px_rgba(0,229,255,0.25)] hover:scale-[1.02] active:scale-95 disabled:opacity-50'}`}
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button
            onClick={() => pickRandomArtist()}
            disabled={loading || artists.length === 0}
            className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30"
          >
            <SkipForward size={16} />
            <span className="font-black text-xs tracking-[0.15em] uppercase">SKIP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
