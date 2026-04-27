import React, { useState } from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, MapPin, ExternalLink, Navigation, Flame, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HEX_COLORS } from './constants';

export default function EventPopup({ events = [], onClose }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Reset index when events list changes (e.g. due to filtering)
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [events]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[currentIndex];
  const hasMultiple = events.length > 1;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <Popup
      longitude={currentEvent.lng}
      latitude={currentEvent.lat}
      anchor="top"
      offset={10}
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
      className="custom-popup"
      maxWidth="none"
    >

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-[280px] md:w-[320px] bg-[#12141a]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col"
      >
        {/* 🖼️ Header Image Section */}
        <div className="relative h-44 w-full overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentEvent.image}
              src={currentEvent.image}
              alt={currentEvent.title}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-transparent to-transparent" />
          
          {/* ❌ Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 transition-all hover:bg-red-500/80 z-30"
          >
            <X size={16} />
          </button>

          {/* 🏷️ Genre Badge */}
          <div className="absolute bottom-4 left-4 z-20">
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-black text-black uppercase tracking-widest shadow-lg"
              style={{ backgroundColor: HEX_COLORS[currentEvent.category] || '#00E5FF' }}
            >
              {currentEvent.category}
            </span>
          </div>

          {/* 🔄 Navigation Arrows for Multiple Events */}
          {hasMultiple && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1 z-30">
              <button 
                onClick={handlePrev}
                className="text-white/80 hover:text-white bg-black/50 backdrop-blur-md p-1.5 rounded-lg border border-white/10 transition-all active:scale-90"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 min-w-[45px] text-center">
                <span className="text-[10px] font-black text-[#00E5FF] tracking-tighter">
                  {currentIndex + 1} <span className="text-white/40 mx-0.5">/</span> {events.length}
                </span>
              </div>
              <button 
                onClick={handleNext}
                className="text-white/80 hover:text-white bg-black/50 backdrop-blur-md p-1.5 rounded-lg border border-white/10 transition-all active:scale-90"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* 📝 Content Section */}
        <div className="p-5 pt-2 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-[#00E5FF] leading-none mb-1.5 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] truncate">
                  {currentEvent.artist}
                </h2>
                <h3 className="font-bold text-gray-300 text-sm md:text-base leading-tight mb-3 line-clamp-1">
                  {currentEvent.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin size={12} className="text-[#00E5FF]" />
                  <span className="truncate">{currentEvent.location}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 bg-white/5 border border-white/5 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-gray-500 uppercase text-[9px] font-black">
                    <Calendar size={12} className="text-[#00E5FF]" />
                    Date
                  </div>
                  <span className="text-xs font-bold text-white truncate">{currentEvent.date}</span>
                </div>
                <div className="flex flex-col gap-1 bg-white/5 border border-white/5 p-2.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-gray-500 uppercase text-[9px] font-black">
                    <Clock size={12} className="text-[#d000ff]" />
                    Time
                  </div>
                  <span className="text-xs font-bold text-white">{currentEvent.time}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => window.open(currentEvent.ticketUrl, '_blank')}
                  className="flex-1 bg-[#00E5FF] text-black font-black py-3 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_8px_20px_rgba(0,229,255,0.3)]"
                >
                  Join Event <ExternalLink size={14} />
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${currentEvent.lat},${currentEvent.lng}`, '_blank')}
                  className="px-4 bg-white/5 text-white border border-white/10 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
                  title="Directions"
                >
                  <Navigation size={16} className="text-[#00E5FF]" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </Popup>
  );
}


