import React from 'react';
import { motion } from 'framer-motion';

export default function StatsSection({ songs }) {
    return (
        <section className="relative w-full py-20 px-6 bg-transparent z-10">
            <div className="max-w-5xl mx-auto relative z-10">

                <h3 className="text-center text-2xl md:text-3xl font-black tracking-widest uppercase mb-12 text-white">
                    Streaming <span className="text-[#2B5AE8]">Statistics</span>
                </h3>

                {/* DYNAMIC CHART: Hover Tooltip เพื่อแยกยอด */}
                <div className="max-w-4xl mx-auto bg-[#111]/80 backdrop-blur-xl p-6 md:p-10 rounded-[3rem] border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                    <div className="flex justify-between items-end h-48 md:h-64 gap-2 md:gap-6 border-b border-gray-800 pb-2 relative">
                        {/* เส้น Grid */}
                        <div className="absolute w-full top-1/4 h-px bg-gray-800/50 z-0"></div>
                        <div className="absolute w-full top-2/4 h-px bg-gray-800/50 z-0"></div>
                        <div className="absolute w-full top-3/4 h-px bg-gray-800/50 z-0"></div>

                        {songs.length > 0 ? songs.slice(0, 6).map((song, idx) => {
                            const maxPop = 60000000;
                            const youtubePop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                            const spotifyPop = Math.max(youtubePop - (Math.floor(Math.random() * 20)), 10); 
                            
                            const ytValue = (song.popularity / 1000000).toFixed(1);
                            const spValue = (ytValue * (spotifyPop / youtubePop)).toFixed(1);

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-crosshair z-10">
                                    <div className="flex w-full justify-center gap-1 md:gap-2 items-end h-full px-1 md:px-2">
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-1/2 md:w-6 bg-gradient-to-t from-[#2B5AE8]/40 to-[#2B5AE8] rounded-t-sm transition-all duration-500 group-hover:brightness-125" />
                                        <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-1/2 md:w-6 bg-gradient-to-t from-[#CEFF67]/40 to-[#CEFF67] rounded-t-sm transition-all duration-500 group-hover:brightness-125 shadow-[0_0_10px_rgba(206,255,103,0.2)] relative" />
                                    </div>
                                    <span className="text-gray-500 text-[10px] md:text-xs font-black uppercase mt-4 truncate w-full text-center px-1 group-hover:text-[#CEFF67] transition-colors">{song.title.split(' ')[0]}</span>
                                    
                                    {/* 🎯 Hover Tooltip */}
                                    <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                        <div className="bg-[#050505] border border-gray-700 p-3 rounded-xl shadow-2xl min-w-[140px] text-center">
                                            <p className="text-[10px] font-bold text-white border-b border-gray-800 pb-1.5 mb-1.5 truncate">{song.title}</p>
                                            <div className="flex justify-between items-center text-[10px] font-black">
                                                <span className="text-[#2B5AE8]">YT: {ytValue}M</span>
                                                <span className="text-[#CEFF67]">SP: {spValue}M</span>
                                            </div>
                                        </div>
                                        <div className="w-3 h-3 bg-[#050505] border-b border-r border-gray-700 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="w-full flex items-center justify-center h-full text-gray-600 font-bold uppercase z-10">No data available</div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-[#2B5AE8]"></span>
                            <span className="text-xs md:text-sm text-gray-400 font-bold tracking-wider uppercase">YouTube</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm bg-[#CEFF67] shadow-[0_0_10px_#CEFF67]"></span>
                            <span className="text-xs md:text-sm text-gray-400 font-bold tracking-wider uppercase">Spotify</span>
                        </div>
                    </div>
                </div>

                {/* Auto Sliding Marquee */}
                <div className="mt-24 pt-10 border-t border-gray-900 w-full overflow-hidden">
                    <div className="marquee-container">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex justify-around items-center min-w-full">
                                {['HIP HOP', 'EDM', 'TRAP', 'ELECTRONIC'].map((genre, idx) => (
                                    <span 
                                        key={idx}
                                        className="text-3xl md:text-5xl font-black tracking-tighter text-white opacity-20 hover:opacity-100 hover:text-[#2B5AE8] cursor-default transition-all duration-300 uppercase mx-8"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}