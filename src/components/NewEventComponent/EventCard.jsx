import React from 'react';
import Reveal from '../Reveal';
import { getCategoryStyle } from '../../utils/eventStyles';

export default function EventCard({ event, index }) {
    return (
        <Reveal key={index} delay={(index % 3) * 0.1} effect="fade-up">
            <div
                onClick={() => window.open('https://www.thaiticketmajor.com/', '_blank')}
                className="group cursor-pointer flex flex-col bg-[#12141A]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-5 hover:bg-[#1A1C23] hover:border-[#7000FF]/50 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(112,0,255,0.15)] hover:-translate-y-2 h-full"
            >
                <div className="rounded-[1.5rem] overflow-hidden mb-6 aspect-[4/3] relative bg-[#12141A]">
                    <img
                        src={event.posterImage || [
                            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1533174000228-4f1b802a433a?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1493225457124-a1a2a5bb001b?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=500&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1520095972714-909e91b05382?q=80&w=500&auto=format&fit=crop"
                        ][index % 9]}
                        alt={event.eventName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-[#12141A]/50 to-transparent z-10 opacity-90" />
                    <div className="absolute inset-0 shadow-[inset_0_-40px_50px_#12141A] z-10 pointer-events-none"></div>

                    <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest z-20 ${getCategoryStyle(event.type)}`}>
                        {event.type || "Concert"}
                    </div>
                </div>

                <div className="px-2 pb-2 flex flex-col flex-1 relative z-20">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 truncate">
                        {event.mainArtistName || "Artist"}
                    </p>
                    {/* 📌 บังคับความสูงของ Title ให้เท่ากันด้วย h-[3.5rem] และ line-clamp-2 */}
                    <h3 className="text-xl lg:text-2xl font-black leading-snug tracking-tight mb-4 group-hover:text-[#00E5FF] transition-colors text-white line-clamp-2 h-[3.5rem] lg:h-[4rem]">
                        {event.eventName}
                    </h3>

                    <div className="mt-auto pt-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                            <div className="w-6 h-6 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black text-gray-200 uppercase tracking-widest truncate">
                                {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                            <div className="w-6 h-6 rounded-full bg-[#FF007F]/20 flex items-center justify-center text-[#FF007F] shrink-0">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black text-gray-300 uppercase tracking-widest truncate">
                                {event.venue?.name || "Location TBA"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="w-full bg-white/10 group-hover:bg-white text-white group-hover:text-black py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 text-center border border-white/10 group-hover:border-white shadow-lg">
                            JOIN EVENT
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
