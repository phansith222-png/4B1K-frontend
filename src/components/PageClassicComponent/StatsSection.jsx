import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; 
import FeaturedArtists from '../FeaturedArtists';
export default function StatsSection({ songs }) {
    return (
        <section className="relative w-full py-24 px-6 bg-transparent border-t border-[#30294e]/50 z-10">
            <div className="max-w-6xl mx-auto relative z-10">

                <Reveal effect="fade-up">
                    <h3 className="text-center font-classic text-3xl md:text-5xl font-black tracking-widest uppercase mb-20 text-white">
                        Streaming <span className="text-[#d83bb6]">Statistics</span>
                    </h3>
                </Reveal>

                <Reveal delay={0.2} effect="fade-up" overflow="visible">
                    <div className="max-w-4xl mx-auto bg-[#30294e]/30 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border border-[#b266c5]/20 shadow-[0_30px_60px_rgba(48,41,78,0.8)] relative">
                        <div className="flex justify-between items-end h-56 md:h-72 gap-3 md:gap-8 border-b border-[#b266c5]/30 pb-2 relative">
                            <div className="absolute w-full top-1/4 h-px bg-white/5 z-0"></div>
                            <div className="absolute w-full top-2/4 h-px bg-white/5 z-0"></div>
                            <div className="absolute w-full top-3/4 h-px bg-white/5 z-0"></div>

                            {songs.length > 0 ? songs.slice(0, 6).map((song, idx) => {
                                const maxPop = 60000000;
                                const spotifyPop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                                const youtubePop = Math.max(spotifyPop - (Math.floor(Math.random() * 20)), 10); 
                                
                                const spValue = (song.popularity / 1000000).toFixed(1);
                                const ytValue = (spValue * (youtubePop / spotifyPop)).toFixed(1);

                                const maxHeight = Math.max(spotifyPop, youtubePop);

                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-crosshair z-10">
                                        <div className="flex w-full justify-center gap-1.5 md:gap-3 items-end h-full px-1">
                                            {/* แท่ง YouTube */}
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-[45%] md:w-6 bg-[#FF0000] rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-[0_0_15px_rgba(255,0,0,0.3)]" />
                                            {/* แท่ง Spotify */}
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-[45%] md:w-6 bg-[#1DB954] rounded-t-md transition-all duration-500 group-hover:brightness-125 shadow-[0_0_15px_rgba(29,185,84,0.3)] relative" />
                                        </div>
                                        <span className="font-sub text-[#b266c5] text-[10px] md:text-xs font-bold uppercase mt-6 truncate w-full text-center px-1 group-hover:text-[#f9c1db] transition-colors">{song.title.split(' ')[0]}</span>
                                        
                                        <div 
                                            className="tooltip-box absolute left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:-translate-y-2"
                                            style={{ bottom: `calc(${maxHeight}% + 55px)` }}
                                        >
                                            <div className="bg-[#1c172e]/95 backdrop-blur-md border border-[#d83bb6]/50 p-4 rounded-xl shadow-[0_10px_30px_rgba(155,45,150,0.5)] min-w-[150px] text-center">
                                                <p className="text-[11px] font-classic font-bold text-white border-b border-[#b266c5]/30 pb-2 mb-2 truncate">{song.title}</p>
                                                <div className="flex justify-between items-center text-[10px] font-sub tracking-widest font-bold">
                                                    <span className="text-[#FF0000]">YT: <span className="text-white">{ytValue}M</span></span>
                                                    <span className="text-[#1DB954]">SP: <span className="text-white">{spValue}M</span></span>
                                                </div>
                                            </div>
                                            <div className="w-3 h-3 bg-[#1c172e]/95 border-b border-r border-[#d83bb6]/50 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="w-full flex items-center justify-center h-full text-[#b266c5] font-classic z-10">No data available</div>
                            )}
                        </div>

                        <div className="mt-12 flex justify-center gap-10 font-sub">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.4)]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase">YouTube</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-[#1DB954] shadow-[0_0_10px_rgba(29,185,84,0.4)]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase">Spotify</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* 🎯 FEATURED ARTISTS SECTION */}
                <FeaturedArtists genre="classic" />

            </div>
        </section>
    );
}
