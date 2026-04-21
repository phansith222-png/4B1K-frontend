import React from 'react';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function ConcertSection({ events }) {
    return (
        <section className="relative w-full py-24 px-6 bg-[#0a0a0a] overflow-hidden border-y border-white/5">
            <div className="max-w-7xl mx-auto relative z-10">

                <Reveal effect="fade-up">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-14">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">
                                LIVE <span className="text-[#D3131F]">CONCERTS</span>
                            </h3>
                        </div>
                        <button onClick={() => window.open('https://www.thaiticketmajor.com/', '_blank')} className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors mt-4 md:mt-0 group bg-[#111] px-5 py-2.5 rounded border border-white/5">
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
                                onClick={() => window.open('https://www.thaiticketmajor.com/', '_blank')}
                                className="flex flex-col group cursor-pointer"
                            >
                                <div className="aspect-[4/5] relative rounded-xl overflow-hidden border border-white/5 group-hover:border-[#D3131F]/50 transition-colors duration-500 shadow-xl mb-4 bg-[#111]">
                                    <img
                                        src={evt.posterImage || "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=600&auto=format&fit=crop"}
                                        alt={evt.eventName}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-60 grayscale-[50%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                                    
                                    <div className="absolute top-4 left-4 bg-[#D3131F] text-white px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded shadow-md z-20">
                                        {new Date(evt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-start px-2">
                                    <h4 className="font-bold text-lg leading-tight tracking-wide text-white group-hover:text-[#D3131F] transition-colors line-clamp-2">{evt.eventName}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-widest mt-2">
                                        <svg className="w-3.5 h-3.5 shrink-0 text-[#D3131F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="line-clamp-1">{evt.venue?.name || "TBA"}</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )})}
                    {events.length === 0 && (
                        <p className="text-gray-500 py-10 col-span-4 text-center font-bold tracking-widest uppercase border border-white/5 bg-[#111] rounded-2xl">No upcoming events for this artist.</p>
                    )}
                </div>
            </div>
        </section>
    );
}