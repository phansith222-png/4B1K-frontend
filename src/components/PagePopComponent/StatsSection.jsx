import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function StatsSection({ songs }) {
    return (
        <section className="relative w-full py-24 px-6 bg-[#050508] border-t border-white/5">
            <div className="max-w-5xl mx-auto relative z-10">

                <Reveal effect="fade-up">
                    <h3 className="text-center text-3xl md:text-5xl font-black tracking-tighter uppercase mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F5D4]">
                        Streaming <span className="text-[#FF007F]">Statistics</span>
                    </h3>
                </Reveal>

                {/* DYNAMIC CHART */}
                <Reveal delay={0.2} effect="fade-up">
                    <div className="max-w-4xl mx-auto bg-[#1A1C23]/80 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative">
                        <div className="flex justify-between items-end h-64 md:h-80 gap-3 md:gap-8 border-b border-gray-700/50 pb-2 relative">
                            {/* เส้น Grid แนวนอน */}
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
                                        <div className="flex w-full justify-center gap-1 md:gap-2 items-end h-full px-1">
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-1/2 md:w-8 bg-gradient-to-t from-[#FF007F]/30 to-[#FF007F] rounded-t-full transition-all duration-500 group-hover:brightness-125 shadow-[0_0_15px_rgba(255,0,127,0.3)]" />
                                            <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-1/2 md:w-8 bg-gradient-to-t from-[#00F5D4]/30 to-[#00F5D4] rounded-t-full transition-all duration-500 group-hover:brightness-125 shadow-[0_0_15px_rgba(0,245,212,0.3)] relative" />
                                        </div>
                                        <span className="text-gray-500 text-[10px] md:text-xs font-bold uppercase mt-6 truncate w-full text-center px-1 group-hover:text-white transition-colors">{song.title.split(' ')[0]}</span>
                                        
                                        {/* 🎯 Hover Tooltip */}
                                        <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                            <div className="bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl min-w-[150px] text-center">
                                                <p className="text-[10px] font-bold text-white border-b border-white/10 pb-2 mb-2 truncate">{song.title}</p>
                                                <div className="flex justify-between items-center text-[10px] font-black">
                                                    <span className="text-[#FF007F]">YT: {ytValue}M</span>
                                                    <span className="text-[#00F5D4]">SP: {spValue}M</span>
                                                </div>
                                            </div>
                                            <div className="w-3 h-3 bg-black/90 border-b border-r border-white/20 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="w-full flex items-center justify-center h-full text-gray-500 z-10 font-bold uppercase tracking-widest">No data available</div>
                            )}
                        </div>

                        <div className="mt-12 flex justify-center gap-10">
                            <div className="flex items-center gap-3">
                                <span className="w-4 h-4 rounded-full bg-[#FF007F] shadow-[0_0_10px_#FF007F]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase">YouTube</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-4 h-4 rounded-full bg-[#00F5D4] shadow-[0_0_10px_#00F5D4]"></span>
                                <span className="text-xs md:text-sm text-gray-400 font-bold tracking-widest uppercase">Spotify</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.4} effect="fade-up">
                    <div className="mt-32 pt-12 border-t border-white/10 flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {['VOCALS', 'GUITAR', 'BASS', 'PRODUCER'].map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                                <span className="text-2xl md:text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-t from-[#0B0C10] to-gray-500 opacity-40 select-none group-hover:opacity-100 group-hover:to-white group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all">
                                    {member}
                                </span>
                            </div>
                        ))}
                    </div>
                </Reveal>

            </div>
        </section>
    );
}