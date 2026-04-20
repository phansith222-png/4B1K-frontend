import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../api/event';

export default function EventShowcase() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchRandomEvents = async () => {
      try {
        const res = await getAllEvents();
        let data = res?.events || res?.data?.events || res?.data || res || [];
        // สุ่มและตัดมาแค่ 6 งาน
        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
        setEvents(shuffled);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchRandomEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="relative z-20 py-24 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="flex justify-between items-end mb-12"
      >
        <div>
          <span className="text-[#00E5FF] font-black text-[10px] tracking-[0.3em] uppercase mb-2 block">Trending Now</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#c6ff00]">Events</span></h2>
        </div>
        <button onClick={() => navigate('/new-event')} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest hidden sm:block transition-colors">
          View All →
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => { window.scrollTo(0,0); navigate('/new-event'); }}
            className="group cursor-pointer rounded-[2rem] overflow-hidden bg-[#12141A] border border-white/5 relative aspect-[4/5] hover:border-[#00E5FF]/40 transition-all shadow-xl"
          >
            <img src={event.posterImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop"} alt={event.eventName} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6">
              <span className="bg-[#00E5FF] text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                {event.type || "Concert"}
              </span>
              <h3 className="text-xl font-black text-white leading-tight mb-2 line-clamp-2">{event.eventName}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider line-clamp-1">{event.venue?.name || "Location TBA"}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button onClick={() => navigate('/new-event')} className="mt-8 w-full text-center text-xs font-bold text-[#c6ff00] border border-[#c6ff00]/20 rounded-full py-4 uppercase tracking-widest sm:hidden">
        View All Events
      </button>
    </section>
  );
}