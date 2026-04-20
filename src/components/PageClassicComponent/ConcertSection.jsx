import React from 'react';

export default function ConcertSection({ events }) {
    return (
        <section className="relative w-full py-32 px-6 bg-transparent border-t border-white/5 z-10">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#D4AF37]/10 pb-8 gap-6">
                    <h3 className="text-3xl md:text-5xl font-classic font-black tracking-widest uppercase text-white font-light">
                        Live <span className="text-[#D4AF37] italic font-normal">Concerts</span>
                    </h3>
                    <button className="flex items-center gap-2 font-sub text-sm font-bold text-gray-400 hover:text-white transition-colors group bg-[#1e293b]/40 px-8 py-3 rounded-full border border-[#D4AF37]/20 shadow-md">
                        View All Dates
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {events.slice(0, 4).map((item, idx) => {
                        const evt = item.event || item; 
                        return (
                        <div key={idx} className="relative rounded-3xl overflow-hidden group border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-500 cursor-pointer bg-[#1e293b]/30 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                            <div className="aspect-[4/5] relative z-10">
                                <img
                                    src={evt.posterImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"}
                                    alt={evt.eventName}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out opacity-60 grayscale-[20%] group-hover:grayscale-0 group-hover:opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90"></div>
                            </div>
                            <div className="absolute bottom-0 w-full p-8 flex flex-col items-start z-20 pointer-events-none">
                                <span className="text-[#D4AF37] bg-[#0F172A]/80 backdrop-blur-sm font-sub text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#D4AF37]/30 px-3 py-1.5 rounded-md shadow-sm">
                                    {new Date(evt.startTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                <h4 className="font-classic text-2xl leading-snug tracking-wide text-white/90 mb-3 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                    {evt.eventName}
                                </h4>
                                <div className="flex items-center gap-2 text-xs font-sub text-gray-400 font-medium tracking-widest w-full uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0"></span>
                                    <span className="line-clamp-1 italic">{evt.venue?.name || "TBA"}</span>
                                </div>
                            </div>
                        </div>
                    )})}
                    {events.length === 0 && (
                        <div className="col-span-4 bg-[#1e293b]/20 rounded-3xl py-20 flex flex-col items-center justify-center text-gray-500 border border-white/5 shadow-inner">
                            <p className="font-classic italic text-lg tracking-widest">No upcoming events scheduled.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}