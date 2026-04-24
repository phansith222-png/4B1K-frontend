import React, { useState } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { motion } from 'framer-motion';
import { Flame, MapPin } from 'lucide-react';
import { HEX_COLORS } from './constants';

const EventMarker = React.memo(function EventMarker({ event, onClick, isActive, isZoomedIn, count = 1 }) {

  const [isHovered, setIsHovered] = useState(false);

  // Show detailed card if zoomed in enough OR if it is actively selected OR if hovered
  const showDetailedCard = isZoomedIn || isActive || isHovered;

  return (
    <Marker
      longitude={event.lng}
      latitude={event.lat}
      anchor="bottom"
      onClick={onClick}
      style={{ zIndex: showDetailedCard ? 50 : 20 }}
    >
      {/* 🛡️ Static Container: รับ Event เมาส์แบบนิ่งๆ ขยายพื้นที่รับ (Hitbox) ป้องกันการกระตุก (Flickering) */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="p-3 -m-3 relative flex flex-col items-center justify-end"
      >
        <motion.div 
          initial={{ scale: 0, opacity: 0, y: showDetailedCard ? 20 : 0 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="cursor-pointer relative group flex flex-col items-center origin-bottom"
        >
          {showDetailedCard ? (
            <>
              {/* 🎫 Industry Standard Event Marker (Card Style) */}
              <div className={`bg-[#1a1c23] border-2 rounded-2xl p-1.5 flex items-center gap-2 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                isActive ? 'border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'border-white/10 group-hover:border-[#00E5FF]/50'
              }`}>
                {/* Small Event Image */}
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/5">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>

                {/* Label & Price */}
                <div className="pr-3 flex flex-col justify-center min-w-[80px]">
                  <span className="text-[11px] font-black text-white truncate max-w-[120px]">{event.title}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-black" style={{ backgroundColor: HEX_COLORS[event.category] || '#00E5FF' }}>
                      {event.category}
                    </span>
                    <span className="text-[10px] font-black text-[#00E5FF]">{event.price}</span>
                  </div>
                </div>

                {/* Hot Badge or Count Badge */}
                {count > 1 ? (
                  <div className="absolute -top-2 -right-2 bg-[#d000ff] text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-[0_0_10px_rgba(208,0,255,0.5)] text-[9px] font-black z-30">
                    +{count - 1}
                  </div>
                ) : event.hot && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-30">
                    <Flame size={12} fill="white" />
                  </div>
                )}
              </div>


              {/* Arrow Tail */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#1a1c23] rotate-180 -mt-[1px] filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
            </>
          ) : (
            /* 🟢 Compact Dot (For zoomed out view to prevent overlapping) */
            <div className="flex flex-col items-center relative">
              {/* Radar Ping for Hot Events (Like User Location but smaller/fainter) */}
              {event.hot && (
                <div className="absolute top-0.5 w-4 h-4 bg-[#d000ff] rounded-full animate-ping opacity-25" />
              )}
              
              <div 
                className={`relative z-10 w-5 h-5 rounded-full shadow-lg border-2 flex items-center justify-center ${
                  event.hot ? 'border-[#d000ff] shadow-[#d000ff]/50' : 'border-black shadow-black/30'
                }`}
                style={{ backgroundColor: HEX_COLORS[event.category] || '#00E5FF' }}
              >
                {count > 1 && (
                  <span className="text-[8px] font-black text-black">
                    {count}
                  </span>
                )}
              </div>

              {/* 🛡️ Invisible Tail to precisely match the card's height shift */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-transparent" />
            </div>
          )}
        </motion.div>
      </div>
    </Marker>
  );
});

export default EventMarker;
