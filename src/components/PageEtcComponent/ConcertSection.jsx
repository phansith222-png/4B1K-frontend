import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function ConcertSection({ events, artist }) {
    const navigate = useNavigate();
    return (
        <section className="relative w-full py-24 px-6">
            <div className="max-w-7xl mx-auto relative z-10">

                <Reveal effect="fade-up">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-14">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">
                                LIVE <span className="text-[#00E5FF]">JOURNEY</span>
                            </h3>
                        </div>
                        <button onClick={() => navigate(`/new-event?artistId=${artist?.id}`)} className="flex items-center gap-2 text-xs font-bold text-[#7000FF] hover:text-white uppercase tracking-widest transition-colors mt-4 md:mt-0 group">
                            VIEW ALL SHOWS
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </button>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {events.slice(0, 4).map((item, idx) => {
                        const evt = item.event || item; 
                        return (
                        <Reveal key={idx} delay={idx * 0.1} effect="fade-up">
                            <div 
                                onClick={() => navigate(`/new-event?artistId=${artist?.id}`)}
                                className="relative rounded-[2rem] overflow-hidden group bg-[#050505] shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-[400px] cursor-pointer transition-colors duration-500"
                            >
                                <img
                                    src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                                    alt={evt.eventName}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent opacity-90"></div>
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                    <span className="bg-[#7000FF] text-white w-fit px-3 py-1 rounded-full text-[10px] font-black mb-3 tracking-widest uppercase shadow-[0_0_10px_#7000FF]">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <h4 className="text-2xl font-black text-white line-clamp-2 group-hover:text-[#00E5FF] transition-colors">{evt.eventName}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-3">
                                        <svg className="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="line-clamp-1 uppercase">{evt.venue?.name || "TBA"}</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )})}
                    {events.length === 0 && (
                        <p className="text-gray-500 py-10 col-span-4 text-center border border-gray-800 bg-[#111] rounded-[2rem]">No upcoming events scheduled.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
