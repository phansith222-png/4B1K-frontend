import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { getAllArtists } from '../../api/artist';
import { getImageUrl } from '../../utils/imageUtils';

import { ArtistItem } from '../../icon/SidebarIcons';

export default function DiscoverArtists() {
  const [displayArtists, setDisplayArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getGenreColor = (genre) => {
    const g = genre?.toLowerCase();
    if (g?.includes('pop')) return 'text-[#FF00E5] bg-[#FF00E5]/10 border-[#FF00E5]/20';
    if (g?.includes('rock')) return 'text-[#FF4D00] bg-[#FF4D00]/10 border-[#FF4D00]/20';
    if (g?.includes('classic')) return 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20';
    return 'text-[#7C4DFF] bg-[#7C4DFF]/10 border-[#7C4DFF]/20';
  };

  const allArtistsRef = useRef([]);

  const fetchAndShuffle = async () => {
    try {
      const resp = await getAllArtists();
      const data = resp.data?.artists || resp.artists || resp.data || [];
      if (data.length > 0) {
        allArtistsRef.current = data;
        shuffleLocal();
      }
    } catch (error) {
      console.error("Failed to discover artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleLocal = () => {
    if (allArtistsRef.current.length > 0) {
      const shuffled = [...allArtistsRef.current].sort(() => 0.5 - Math.random());
      setDisplayArtists(shuffled.slice(0, 3));
    }
  };

  useEffect(() => {
    fetchAndShuffle();
    // สุ่มจากข้อมูลเดิมทุก 20 วินาที โดยไม่ต้องยิง API ใหม่
    const interval = setInterval(shuffleLocal, 20000);
    return () => clearInterval(interval);
  }, []);

  const getArtistCategory = (id) => {
    const artistId = parseInt(id);
    if (artistId >= 1 && artistId <= 5) return { label: 'Pop', route: 'pop' };
    if (artistId >= 6 && artistId <= 10) return { label: 'Rock', route: 'rock' };
    if (artistId >= 16 && artistId <= 20) return { label: 'R&B / Classic', route: 'rnb' };
    return { label: 'Hip Hop / EDM', route: 'etc' };
  };

  const handleArtistClick = (artist) => {
    const { route } = getArtistCategory(artist.id);
    navigate(`/${route}?artistId=${artist.id}`);
  };



  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00E5FF] rounded-full blur-[80px] opacity-10" />

      <div className="space-y-2 relative z-10">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 px-4 animate-pulse">
              <div className="w-12 h-12 bg-white/5 rounded-xl" />
              <div className="h-4 bg-white/5 rounded w-24" />
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {displayArtists.map((artist, idx) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                onClick={() => handleArtistClick(artist)}
                className="cursor-pointer group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={getImageUrl(artist.profileImage, `https://ui-avatars.com/api/?name=${artist.artistName}`)}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:scale-110 transition-transform"
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-black text-white tracking-tight group-hover:text-[#00E5FF] transition-colors line-clamp-1">{artist.artistName}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border inline-block uppercase tracking-wider mt-1 ${getGenreColor(getArtistCategory(artist.id).route)}`}>
                      {getArtistCategory(artist.id).label}
                    </span>
                  </div>
                </div>

                <div className="text-white/40 group-hover:text-white transition-colors p-2">
                  <Plus size={18} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <button
        onClick={() => navigate('/artists')}
        className="w-full mt-4 py-4 border border-white/10 rounded-2xl text-[11px] font-black text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
      >
        View All Artists
      </button>
    </div>
  );
}





