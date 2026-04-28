import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function ConcertSection({ events, artist }) {
    const navigate = useNavigate();
    return (
        <section className="relative w-full py-32 px-6 bg-transparent border-t border-[#30294e] z-10">
            <div className="max-w-[1440px] mx-auto relative z-10">
                <Reveal effect="fade-up">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#b266c5]/20 pb-8 gap-6">
                        <h3 className="text-3xl md:text-5xl font-classic font-black tracking-widest uppercase text-white font-light">
                            CONCERT <span className="text-[#d83bb6] font-bold">EVENT</span>
                        </h3>
                        <motion.button 
                            onClick={() => {
                                const eventId = events.length > 0 ? (events[0].event?.id || events[0].id) : '';
                                const search = artist?.artistName || artist?.name || "";
                                navigate(`/nearby-events?search=${encodeURIComponent(search)}${eventId ? `&eventId=${eventId}` : ''}`);
                            }}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 text-[10px] font-black text-[#f9c1db] hover:text-white uppercase tracking-[0.3em] transition-all bg-[#f9c1db]/5 hover:bg-[#f9c1db]/20 px-7 py-3.5 rounded-full border border-[#f9c1db]/20"
                        >
                            VIEW ALL RECITALS
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </motion.button>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6">
                    {events.slice(0, 5).map((item, idx) => {
                        const evt = item.event || item;
                        return (
                            <Reveal key={idx} delay={idx * 0.1} effect="fade-up">
                                <div
                                    onClick={() => {
                                        const search = artist?.artistName || artist?.name || "";
                                        const eventId = evt.id || evt._id;
                                        navigate(`/nearby-events?search=${encodeURIComponent(search)}&eventId=${eventId}`);
                                    }}
                                    className="relative rounded-3xl overflow-hidden group border border-[#b266c5]/20 hover:border-[#d83bb6]/60 transition-all duration-500 cursor-pointer bg-[#30294e]/40 shadow-[0_15px_40px_rgba(48,41,78,0.8)]"
                                >
                                    <div className="aspect-[4/5] relative z-10">
                                        <img
                                            src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                            alt={evt.eventName}
                                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-70 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c172e] via-[#1c172e]/40 to-transparent opacity-90"></div>
                                    </div>
                                    <div className="absolute bottom-0 w-full p-8 flex flex-col items-start z-20 pointer-events-none">
                                        <span className="text-[#f9c1db] bg-[#9b2d96]/80 backdrop-blur-md font-sub text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#d83bb6]/50 px-3 py-1.5 rounded-md shadow-sm">
                                            {new Date(evt.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                        <h4 className="font-classic text-2xl font-bold leading-snug tracking-wide text-white/90 mb-3 group-hover:text-[#f9c1db] transition-colors line-clamp-2">
                                            {evt.eventName}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs font-sub text-[#b266c5] font-semibold tracking-widest w-full uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#d83bb6] shrink-0"></span>
                                            <span className="line-clamp-1">{evt.venue?.name || "TBA"}</span>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        )
                    })}
                    {events.length === 0 && (
                        <div className="col-span-5 bg-[#30294e]/20 rounded-3xl py-20 flex flex-col items-center justify-center text-[#b266c5] border border-[#9b2d96]/20 shadow-inner">
                            <p className="font-classic italic text-lg tracking-widest">No upcoming events scheduled.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
