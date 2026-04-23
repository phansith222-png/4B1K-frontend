import React from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, ExternalLink, Navigation, Flame, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HEX_COLORS } from './constants';

export default function EventPopup({ event, onClose }) {
  const navigate = useNavigate();

  return (
    <Popup
      longitude={event.lng}
      latitude={event.lat}
      anchor="top"
      onClose={onClose}
      closeOnClick={false}
      closeButton={false}
      className="custom-popup"
      maxWidth="320px"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="w-64 bg-[#1a1c23]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col gap-3">
          
          {/* ❌ Custom Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full z-20"
          >
            <X size={16} />
          </button>

          {/* Header Info (No redundant image) */}
          <div className="flex items-start justify-between gap-2 pr-6">
            <div>
              <span 
                className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black text-black mb-2"
                style={{ backgroundColor: HEX_COLORS[event.category] || '#00E5FF' }}
              >
                {event.category}
              </span>
              <h3 className="font-black text-white text-base leading-tight">{event.title}</h3>
            </div>
            
            {event.hot && (
              <div className="flex items-center gap-1 bg-red-500/20 text-red-500 px-2 py-1 rounded-full border border-red-500/30 shrink-0">
                <Flame size={12} />
                <span className="text-[10px] font-bold">HOT</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 p-2 rounded-lg">
              <Calendar size={14} className="text-[#00E5FF]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase">Date</span>
                <span className="text-xs font-bold">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 p-2 rounded-lg">
              <Users size={14} className="text-[#d000ff]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase">Going</span>
                <span className="text-xs font-bold">{event.attendees}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/new-event')}
              className="flex-1 bg-[#00E5FF] text-black font-black py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-[0_4px_15px_rgba(0,229,255,0.3)]"
            >
              Details <ExternalLink size={14} />
            </button>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`, '_blank')}
              className="px-4 bg-white/10 text-white border border-white/10 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
              title="Get Directions"
            >
              <Navigation size={14} className="text-[#00E5FF]" />
            </button>
          </div>
        </div>
      </motion.div>
    </Popup>
  );
}
