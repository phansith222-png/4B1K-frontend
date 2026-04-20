import React from 'react';
import { motion } from 'framer-motion';

export default function StatsSection({ songs }) {
    return (
        <section className="relative w-full py-24 px-6 bg-transparent border-t border-white/5 z-10">
            <div className="max-w-6xl mx-auto relative z-10">

                <h3 className="text-center font-classic text-3xl md:text-5xl font-black tracking-widest uppercase mb-20 text-white font-light">
                    Streaming <span className="text-[#D4AF37] italic font-normal">Statistics</span>
                </h3>

                {/* DYNAMIC CHART */}
                <div className="max-w-4xl mx-auto bg-[#1e293b]/40 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative">
                    <div className="flex justify-between items-end h-56 md:h-72 gap-3 md:gap-8 border-b border-gray-700/50 pb-2 relative">
                        {/* เส้น Grid */}
                        <div className="absolute w-full top-1/4 h-px bg-white/5 z-0"></div>
                        <div className="absolute w-full top-2/4 h-px bg-white/5 z-0"></div>
                        <div className="absolute w-full top-3/4 h-px bg-white/5 z-0"></div>

                        {songs.length > 0 ? songs.slice(0, 6).map((song, idx) => {
                            const maxPop = 60000000;
                            const spotifyPop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                            const youtubePop = Math.max(spotifyPop - (Math.floor(Math.random() * 20)), 10); 
                            
                            const spValue = (song.popularity / 1000000).toFixed(1);
                            const ytValue = (spValue * (youtubePop / spotifyPop)).toFixed(1);

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-crosshair z-10">
                                    <div className="flex w-full justify-center gap-1.5 md:gap-3 items-end h-full px-1">
                                        {/* แท่ง YouTube */}
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-[45%] md:w-6 bg-gradient-to-t from-[#D4AF37]/20 to-[#D4AF37]/60 rounded-t-md transition-all duration-500 group-hover:brightness-125" />
                                        {/* แท่ง Spotify */}
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-[45%] md:w-6 bg-gradient-to-t from-[#D4AF37]/50 to-[#D4AF37] rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-[0_0_15px_rgba(212,175,55,0.3)] relative" />
                                    </div>
                                    <span className="font-sub text-gray-400 text-[10px] md:text-xs font-bold uppercase mt-6 truncate w-full text-center px-1 group-hover:text-white transition-colors">{song.title.split(' ')[0]}</span>
                                    
                                    {/* 🎯 Hover Tooltip */}
                                    <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                        <div className="bg-[#0F172A]/95 backdrop-blur-md border border-[#D4AF37]/30 p-4 rounded-xl shadow-2xl min-w-[150px] text-center">
                                            <p className="text-[11px] font-classic italic text-white border-b border-gray-700 pb-2 mb-2 truncate">{song.title}</p>
                                            <div className="flex justify-between items-center text-[10px] font-sub tracking-widest font-bold">
                                                <span className="text-gray-400">YT: <span className="text-white">{ytValue}M</span></span>
                                                <span className="text-[#D4AF37]">SP: <span className="text-white">{spValue}M</span></span>
                                            </div>
                                        </div>
                                        <div className="w-3 h-3 bg-[#0F172A]/95 border-b border-r border-[#D4AF37]/30 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="w-full flex items-center justify-center h-full text-gray-500 font-classic italic z-10">No data available</div>
                        )}
                    </div>

                    <div className="mt-12 flex justify-center gap-10 font-sub">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-[#D4AF37]/60"></span>
                            <span className="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase">YouTube</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></span>
                            <span className="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase">Spotify</span>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-16 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 md:gap-20">
                    {['VOCALS', 'GUITAR', 'BASS', 'PRODUCER'].map((member, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-500 cursor-default group">
                            <span className="text-2xl md:text-4xl font-classic font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] to-gray-700 opacity-50 select-none group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                                {member}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}