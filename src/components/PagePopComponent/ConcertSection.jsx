import React from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import Reveal

export default function ConcertSection({ events }) {
    const navigate = useNavigate();
    return (
        <section className="relative w-full py-24 px-6 bg-transparent border-t border-white/5">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* 📌 ครอบส่วนหัวด้วย Reveal */}
                <Reveal effect="fade-up">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-6">
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#00F5D4]">Concerts</span></h3>
                        <button onClick={() => navigate('/new-event')} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors group bg-[#1A1C23] px-6 py-3 rounded-full border border-white/10 shadow-lg mt-4 md:mt-0">
                            View All Dates
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
                                onClick={() => navigate('/new-event')}
                                className="relative rounded-[2.5rem] overflow-hidden group border border-white/10 hover:border-[#00F5D4]/50 transition-all duration-500 cursor-pointer bg-[#1A1C23] shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                            >
                                <div className="aspect-[4/5] relative z-10">
                                    <img
                                        src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                        alt={evt.eventName}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-70 group-hover:opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent opacity-90"></div>
                                </div>
                                <div className="absolute bottom-0 w-full p-8 flex flex-col items-start z-20 pointer-events-none">
                                    <span className="bg-gradient-to-r from-[#FF007F] to-[#00F5D4] text-black px-4 py-1.5 rounded font-black uppercase tracking-widest shadow-lg mb-4 text-[10px]">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <h4 className="font-black text-2xl leading-tight tracking-tight text-white mb-2 group-hover:text-[#00F5D4] transition-colors line-clamp-2">
                                        {evt.eventName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold tracking-wide w-full uppercase mt-2">
                                        <svg className="w-4 h-4 text-[#FF007F] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="line-clamp-1">{evt.venue?.name || "TBA"}</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )})}
                    {events.length === 0 && (
                        <div className="col-span-4 bg-[#1A1C23]/50 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-gray-500 border border-white/5 shadow-inner">
                            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <p className="font-black tracking-widest uppercase text-sm">No upcoming events</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}