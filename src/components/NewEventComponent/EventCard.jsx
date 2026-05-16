import React from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../Reveal';
import { getCategoryStyle } from '../../utils/eventStyles';

export default function EventCard({ event, index }) {
    const navigate = useNavigate();
    
    // Curated high-quality music/concert images ไม่ได้ใช้ แต่เก็บไว้ก่อน
    const FALLBACK_IMAGES = [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540039120624-973056ce7ca6?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop"
    ];

    // Strictly use mocked images based on index
    const displayImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
   
    // console.log(event.posterImage)

    // console.log('EventCard',event.posterImage)

    // Robust field extraction
    const eventName = event.eventName || event.title || event.name || "Untitled Event";
    const startTime = event.startTime || event.date;
    const venueName = event.venue?.name || event.location?.name || event.location || "Location TBA";
    const rawEventType = event.type || event.category || event.genre || "Concert";
    const eventType = (rawEventType.toLowerCase().includes('classic') || rawEventType.toLowerCase().includes('r&b')) ? 'R&B' : rawEventType;
    const artistName = event.mainArtistName || event.artistName || event.artist?.artistName || "Artist";


    return (
        <Reveal key={index} delay={(index % 5) * 0.1} effect="fade-up">
            <div
                id={`event-item-${event.id}`}
                onClick={() => navigate(`/nearby-events?search=${encodeURIComponent(artistName)}&eventId=${event.id}`)}
                className="group cursor-pointer flex flex-col bg-[#12141A]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-4 hover:bg-[#1A1C23]/60 hover:border-[#7000FF]/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(112,0,255,0.1)] hover:-translate-y-3 h-full relative overflow-hidden"
            >
                {/* Subtle Glow behind card on hover */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#00E5FF]/0 via-[#7000FF]/0 to-[#FF007F]/0 group-hover:from-[#00E5FF]/5 group-hover:via-[#7000FF]/5 group-hover:to-[#FF007F]/5 blur-2xl transition-all duration-700 opacity-0 group-hover:opacity-100" />

                <div className="rounded-[1.8rem] overflow-hidden mb-6 aspect-[4/3] relative bg-[#0B0C10] shadow-2xl">
                    <img
                        src={event.posterImage}
                        alt={eventName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-70 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent z-10" />
                    
                    {/* Animated Edge Light */}
                    <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition-colors z-20 rounded-[1.8rem]" />

                    <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest z-20 ${getCategoryStyle(eventType)} shadow-lg`}>
                        {eventType}
                    </div>
                </div>

                <div className="px-2 pb-2 flex flex-col flex-1 relative z-20">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 truncate group-hover:text-[#7000FF] transition-colors">
                        {artistName}
                    </p>
                    
                    <h3 className="text-xl lg:text-2xl font-black leading-tight tracking-tighter mb-4 group-hover:text-white transition-colors text-gray-100 line-clamp-2 h-[3.5rem] lg:h-[4rem]">
                        {eventName}
                    </h3>

                    <div className="mt-auto pt-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] shrink-0 border border-[#00E5FF]/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black text-gray-300 uppercase tracking-widest truncate">
                                {startTime ? new Date(startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBA"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[#FF007F]/10 flex items-center justify-center text-[#FF007F] shrink-0 border border-[#FF007F]/20 shadow-[0_0_10px_rgba(255,0,127,0.1)]">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <span className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest truncate">
                                {venueName}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div 
                            className="w-full bg-white/5 group-hover:bg-white text-white group-hover:text-black py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 text-center border border-white/10 group-hover:border-white shadow-xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                        >
                            JOIN EVENT
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
