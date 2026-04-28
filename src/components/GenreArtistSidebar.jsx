import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { getArtistInfo } from '../utils/artistHelper';
import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

export default function GenreArtistSidebar({ artists, currentArtistId, side = 'left', genre = 'pop' }) {
  const navigate = useNavigate();
  
  // Filter by Genre
  const sidebarArtists = React.useMemo(() => {
    // 1. Get IDs for this genre from centralized constants
    const allowedIds = GENRE_ARTIST_IDS[genre] || [];

    // 2. Perform the filter
    const filtered = artists.filter(a => {
      // Skip current artist
      if (String(a.id) === String(currentArtistId)) return false;

      const id = Number(a.id);
      const gs = a.genres?.map(g => g.genre?.name?.toLowerCase() ?? '') ?? [];

      // Match by ID
      if (allowedIds.includes(id)) return true;

      // Match by Keyword
      if (genre === 'pop') return gs.some(g => g.includes('pop'));
      if (genre === 'rock') return gs.some(g => g.includes('rock'));
      if (genre === 'classic' || genre === 'rnb') return gs.some(g => g.includes('classic') || g.includes('r&b') || g.includes('rnb'));
      if (genre === 'edm') return gs.some(g => g.includes('edm') || g.includes('electronic'));
      if (genre === 'hiphop') return gs.some(g => g.includes('hip') || g.includes('rap'));

      return false;
    });

    // 3. Split equally for sides
    const half = Math.ceil(filtered.length / 2);
    const limit = 5; // Max per side
    
    if (side === 'left') {
      return filtered.slice(0, Math.min(half, limit));
    } else {
      return filtered.slice(half, half + limit);
    }
  }, [artists, currentArtistId, genre, side]);

  const themeColor = {
    pop: '#FF007F',
    rock: '#D3131F',
    classic: '#00E5FF',
    rnb: '#00E5FF',
    edm: '#7000FF',
    hiphop: '#CEFF67'
  }[genre] || '#00E5FF';

  return (
    <div className={`fixed top-0 bottom-0 ${side === 'left' ? 'left-6 md:left-12' : 'right-6 md:right-12'} z-40 hidden xl:flex flex-col items-center justify-center pointer-events-none`}>
      <div className="flex flex-col gap-12 relative">
        {sidebarArtists.map((artist, idx) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
            className="pointer-events-auto group relative"
          >
            {/* Theme Glow behind avatar */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{ backgroundColor: themeColor }}
            />

            {/* Corner Brackets / Decorative Frame */}
            <div className="absolute -inset-3 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: themeColor }} />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: themeColor }} />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: themeColor }} />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: themeColor }} />
            </div>

          {/* Circular Artist Image */}
          <div 
            onClick={() => {
              const info = getArtistInfo(artist);
              navigate(`${info.path}?artistId=${artist.id}`);
            }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full cursor-pointer relative overflow-hidden border-2 border-white/10 group-hover:border-white transition-all duration-300 shadow-2xl z-10 group-hover:scale-105"
            style={{ 
              '--glow-color': themeColor,
            }}
          >
              {/* Internal Glow Overlay */}
              <div className="absolute inset-0 rounded-full group-hover:shadow-[inset_0_0_20px_var(--glow-color)] transition-shadow duration-500 z-20 pointer-events-none opacity-0 group-hover:opacity-100" />
              
              {/* External Shadow Glow (via CSS class for cleaner hover) */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_25px_var(--glow-color)] z-0" />

              <img 
                src={getImageUrl(artist.profileImage, `https://ui-avatars.com/api/?name=${artist.artistName}`)} 
                alt={artist.artistName}
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 relative z-10"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Name Label (Floating) */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-full ml-6' : 'right-full mr-6'} opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50`}>
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{artist.artistName}</span>
              </div>
            </div>

            {/* Decorative Spinning Ring */}
            <div 
              className="absolute -inset-2 rounded-full border border-dashed opacity-10 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 animate-spin-slow"
              style={{ borderColor: themeColor, animationDuration: '15s' }}
            />
          </motion.div>
        ))}
      </div>
      
    </div>
  );
}
