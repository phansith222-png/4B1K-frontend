import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function StatsSection({ songs }) {
    return (
        <section className="relative w-full py-24 px-6 bg-[#050505]">
            <div className="max-w-6xl mx-auto relative z-10">

                <Reveal effect="fade-up">
                    <div className="flex flex-col items-center mb-16">
                        <h3 className="text-center text-2xl md:text-4xl font-black tracking-tighter uppercase text-white">
                            STREAMING <span className="text-[#D3131F]">STATISTICS</span>
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D3131F] to-transparent mt-4 rounded-full"></div>
                    </div>
                </Reveal>

                <Reveal delay={0.2} effect="fade-up">
                    <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-2xl border border-white/5 shadow-2xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            
                            <div className="flex justify-center gap-8 mb-12">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400">Spotify</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#D3131F] rounded-sm shadow-[0_0_8px_#D3131F]"></div>
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400">YouTube</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end h-64 md:h-80 gap-2 md:gap-6 border-b border-white/5 pb-0 relative">
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
                                        <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end relative z-10 group cursor-crosshair">
                                            
                                            <div className="flex w-full justify-center gap-1.5 md:gap-2.5 items-end h-full px-1">
                                                {/* แท่ง Spotify */}
                                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${spotifyPop}%` }} className="w-[40%] md:w-8 bar-spotify-v3 relative group-hover:brightness-125" />
                                                {/* แท่ง YouTube */}
                                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${youtubePop}%` }} className="w-[40%] md:w-8 bar-youtube-v3 relative group-hover:brightness-125" />
                                            </div>
                                            
                                            <div className="mt-4 text-center w-full">
                                                <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase truncate w-full block group-hover:text-white transition-colors">{song.title.split(' ')[0]}</span>
                                            </div>

                                            <div className="tooltip-box absolute -top-16 left-1/2 -translate-x-1/2 z-50">
                                                <div className="bg-black border border-[#D3131F]/30 p-3 rounded shadow-2xl min-w-[140px] text-center">
                                                    <p className="text-[10px] font-bold text-white border-b border-white/10 pb-1.5 mb-1.5 truncate">{song.title}</p>
                                                    <div className="flex justify-between items-center text-[10px] font-black">
                                                        <span className="text-[#D3131F]">YT: {ytValue}M</span>
                                                        <span className="text-gray-400">SP: {spValue}M</span>
                                                    </div>
                                                </div>
                                                <div className="w-3 h-3 bg-black border-b border-r border-[#D3131F]/30 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                            </div>

                                        </div>
                                    )
                                }) : (
                                    <div className="w-full flex items-center justify-center h-full text-gray-600 font-bold uppercase z-10">No data available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.4} effect="fade-up">
                    <div className="mt-32 pt-16 border-t border-white/5 flex flex-wrap justify-center items-center gap-10 md:gap-20 transition-all duration-500">
                        {[
                            { name: 'VOCALS', role: 'MAIN' },
                            { name: 'GUITAR', role: 'LEAD' },
                            { name: 'BASS', role: 'RHYTHM' },
                            { name: 'DRUMS', role: 'BEAT' },
                        ].map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-default group">
                                <span className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-t from-gray-700 to-[#111111] opacity-90 select-none transition-all duration-500 group-hover:from-[#D3131F] group-hover:to-white group-hover:opacity-100">
                                    {member.name}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-600 uppercase group-hover:text-white transition-colors">
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </Reveal>

            </div>
        </section>
    );
}