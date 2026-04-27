import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllArtists } from '../../api/artist';
import { getImageUrl } from '../../utils/imageUtils';
import { GENRE_ARTIST_IDS } from '../../constants/genreArtistIds';

export default function ArtistShowcase({ artists: initialArtists = [] }) {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (initialArtists && initialArtists.length > 0) {
      setArtists(initialArtists);
      return;
    }

    const fetchRandomArtists = async () => {
      try {
        const res = await getAllArtists();
        let data = res?.artists || res?.data || res || [];
        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
        // Pre-pick a random song for each artist at fetch time (not during render)
        const withRandomSong = shuffled.map(artist => ({
          ...artist,
          _randomSong: artist.songs?.length
            ? artist.songs[Math.floor(Math.random() * artist.songs.length)]
            : null,
        }));
        setArtists(withRandomSong);
      } catch (err) {
        console.error("Failed to load artists", err);
      }
    };
    fetchRandomArtists();
  }, [initialArtists]);

  const getArtistPath = (artist) => {
    const aId = Number(artist.id);

    if (GENRE_ARTIST_IDS.pop.includes(aId)) return '/pop';
    if (GENRE_ARTIST_IDS.rock.includes(aId)) return '/rock';
    if (GENRE_ARTIST_IDS.classic.includes(aId)) return '/classic';
    if (GENRE_ARTIST_IDS.etc.includes(aId)) return '/etc';
    return '/artists';
  };

  if (artists.length === 0) return null;

  return (
    <section className="relative z-20 py-24 px-6 max-w-7xl mx-auto mb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="text-[#d000ff] font-black text-[10px] tracking-[0.3em] uppercase mb-2 block">Discover Music</span>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter mb-4">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d000ff] to-[#FF007F]">Artists</span></h2>
        <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto">
          Explore profiles of trending artists, stream their top tracks, and learn their journey. Click on any artist to dive into their world.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
        {artists.map((artist, idx) => {
          const randomSong = artist._randomSong || artist.randomSong;

          return (
            <motion.div
              key={artist.id}
              // 📌 เอฟเฟกต์ Pop-up เด้งดึ๋ง
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 120, damping: 15, delay: idx * 0.1 }}
              onClick={() => { window.scrollTo(0, 0); navigate(`${getArtistPath(artist)}?artistId=${artist.id}&autoplay=true`); }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1.5 bg-gradient-to-tr from-white/5 to-white/20 group-hover:from-[#d000ff] group-hover:to-[#00E5FF] transition-all duration-500 shadow-xl mb-6 relative group-hover:-translate-y-2">
                <img 
                src={getImageUrl(artist.profileImage, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop")} 
                alt={artist.artistName} 
                loading="lazy"
                className="w-full h-full object-cover rounded-full bg-black"
              />
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 14L14.22 9 4.018 4v10z" /></svg>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wide group-hover:text-[#00E5FF] transition-colors text-center line-clamp-1">
                {artist.artistName}
              </h3>

              {randomSong && (
                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: (idx * 0.1) + 0.3 }}
                  className="mt-2 text-[10px] md:text-xs font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-center line-clamp-1 max-w-[90%]"
                >
                  🎵 {randomSong.title}
                </motion.p>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  );
}
