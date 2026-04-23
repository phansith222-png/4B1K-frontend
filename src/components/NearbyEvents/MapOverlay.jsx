import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Navigation } from 'lucide-react';
import { CATEGORY_COLORS, HEX_COLORS } from './constants';

export default function MapOverlay({ activeCategory, setActiveCategory, onFlyToUser, searchQuery, setSearchQuery }) {
  return (
    <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
      {/* Gradient backdrop ด้านบน: มือถือมืดสนิทตามสั่ง / หน้าเว็ปหลักจางลงเหมือนตอนแรก */}
      <div className="absolute top-0 left-0 w-full h-64 md:h-32 bg-gradient-to-b from-black via-black/95 md:via-black/40 to-transparent -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-4 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">

          {/* Left Side: Title & Search */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-5xl font-black mb-1 flex items-center gap-2 md:gap-3 drop-shadow-lg"
              >
                <MapPin className="text-[#00E5FF] w-7 h-7 md:w-10 md:h-10" />
                Nearby Events
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 drop-shadow-md font-medium text-[12px] md:text-base"
              >
                Discover live events happening around you.
              </motion.p>
            </div>

            {/* 🔍 Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative max-w-sm"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city or venue..."
                className="w-full bg-[#1a1d24]/60 border border-white/10 text-white text-xs md:text-sm rounded-full pl-9 pr-4 py-2 md:py-2.5 focus:outline-none focus:border-[#00E5FF] focus:bg-[#1a1d24]/80 transition-all backdrop-blur-md placeholder:text-gray-500 shadow-lg"
              />
            </motion.div>
          </div>

          {/* Right Side: Categories & Location Button (Top Right Stack) */}
          <div className="flex flex-col items-start md:items-end gap-3 mt-1 md:mt-2 w-full md:w-auto">
            
            {/* 7 Categories (2 Rows on Mobile, Single line on Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.9, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap md:flex-nowrap items-center justify-start md:justify-end gap-2 md:gap-2 py-2 md:py-3 w-full md:w-auto"
            >
              {Object.keys(CATEGORY_COLORS).map(cat => {
                const isActive = activeCategory === cat;
                const catColor = HEX_COLORS[cat] || '#00E5FF';
                
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all duration-300 border flex-shrink-0 ${
                      isActive 
                        ? 'text-white border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
                        : 'text-gray-300 border-transparent hover:border-white/20'
                    }`}
                    style={{ 
                      backgroundColor: isActive ? catColor : `${catColor}22`,
                      borderColor: isActive ? 'white' : `${catColor}44`,
                      boxShadow: isActive ? `0 0 20px ${catColor}88` : `0 0 10px ${catColor}33`
                    }}
                  >
                    {cat}
                  </button>
                );
              })}

              {/* 📍 My Location Button (Mobile: Inline-right, Desktop: Hidden) */}
              <button
                onClick={onFlyToUser}
                className="flex md:hidden items-center gap-2 bg-[#1a1d24]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black text-white hover:bg-[#00E5FF] hover:text-black hover:border-[#00E5FF] transition-all shadow-xl active:scale-95 group ml-auto"
              >
                <Navigation size={12} className="text-[#00E5FF] group-hover:text-black transition-colors" />
                MY LOCATION
              </button>
            </motion.div>

            {/* 📍 My Location Button (Desktop only) */}
            <motion.button
              onClick={onFlyToUser}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-2 bg-[#1a1d24]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-black text-white hover:bg-[#00E5FF] hover:text-black hover:border-[#00E5FF] transition-all shadow-xl active:scale-95 group"
            >
              <Navigation size={14} className="text-[#00E5FF] group-hover:text-black transition-colors" />
              MY LOCATION
            </motion.button>

          </div>
        </div>
      </div>
    </div>
  );
}