import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../api/event';
import { getGenreColorByArtistId } from '../../utils/genreHelpers';

export default function EventShowcase({ events = [] }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchRandomEvents = async () => {
      try {
        const res = await getAllEvents();
        let data = res?.events || res?.data?.events || res?.data || res || [];
        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
        setEvents(shuffled);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    };
    fetchRandomEvents();
  }, []);

  const getEventColor = (event) => {
    try {
      let aId = null;
      if (event.artistId) aId = event.artistId;
      else if (event.artist?.id) aId = event.artist.id;
      else if (event.artists && event.artists.length > 0) {
        aId = event.artists[0].artistId || event.artists[0].artist?.id;
      }
      return getGenreColorByArtistId(aId);
    } catch (err) {
      return getGenreColorByArtistId(null); // returns DEFAULT
    }
  };

  if (events.length === 0) return null;

  return (
    <section className="relative z-20 py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring" }}
        className="flex justify-between items-end mb-12"
      >
        <div>
          <span className="text-[#00E5FF] font-black text-[10px] tracking-[0.3em] uppercase mb-2 block">Live Experiences</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter mb-3">Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00E5FF]">Events</span></h2>
          <p className="text-gray-400 text-sm md:text-base font-medium max-w-md">
            Discover the hottest upcoming concerts and festivals. Grab your tickets before they sell out!
          </p>
        </div>
        <button onClick={() => navigate('/new-event')} className="text-xs font-bold text-gray-400 hover:text-[#00E5FF] uppercase tracking-widest hidden sm:block transition-colors">
          View All →
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <motion.div
            key={event.id}
            // 📌 การ์ดเด้งขึ้นมาจากด้านล่างแบบนุ่มๆ
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{
              y: -8,
              borderColor: `${event.color}60`,
              boxShadow: `0 20px 40px ${event.color}20`
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.1 }}
            onClick={() => {
              const artistName = event.mainArtistName || event.artistName || (event.artist && (event.artist.artistName || event.artist.name)) || "";
              navigate(`/nearby-events?search=${encodeURIComponent(artistName)}&eventId=${event.id}`);
            }}
            className="group cursor-pointer rounded-[2rem] overflow-hidden bg-[#12141A] border border-white/5 relative aspect-[4/5] transition-all shadow-xl"
          >
            <img src={event.posterImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop"} alt={event.eventName} loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent"></div>

            <div className="absolute bottom-0 left-0 w-full p-6">
              <span
                className="text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block"
                style={{ backgroundColor: event.color, boxShadow: `0 0 10px ${event.color}80` }}
              >
                {event.type || "Concert"}
              </span>
              <h3 className="text-xl font-black text-white leading-tight mb-2 line-clamp-2">{event.eventName}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider line-clamp-1">{event.venue?.name || "Location TBA"}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button onClick={() => navigate('/new-event')} className="mt-8 w-full text-center text-xs font-bold text-[#00E5FF] border border-[#00E5FF]/20 hover:bg-[#00E5FF]/10 rounded-full py-4 uppercase tracking-widest sm:hidden transition-colors">
        View All Events
      </button>
    </section>
  );
}
