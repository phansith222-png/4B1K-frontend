import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function StatsSection({ songs }) {
    return (
        <section className="relative w-full py-24 px-6 bg-transparent">
            <div className="max-w-6xl mx-auto relative z-10">

                <Reveal effect="fade-up">
                    <div className="flex flex-col items-center mb-16">
                        <h3 className="text-center text-2xl md:text-4xl font-black tracking-tighter uppercase text-white">
                            STREAMING <span className="text-[#D3131F]">STATISTICS</span>
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D3131F] to-transparent mt-4 rounded-full"></div>
                    </div>
                </Reveal>

                <Reveal delay={0.2} effect="fade-up" overflow="visible">
                    <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-2xl border border-white/5 shadow-2xl p-8 md:p-12 relative">
                        <div className="relative z-10">

                            <div className="flex justify-center gap-8 mb-12">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#1DB954] rounded-sm shadow-[0_0_8px_rgba(29,185,84,0.4)]"></div>
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400">Spotify</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-[#FF0000] rounded-sm shadow-[0_0_8px_rgba(255,0,0,0.4)]"></div>
                                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-400">YouTube</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end h-64 md:h-80 gap-2 md:gap-6 border-b border-white/5 pb-0 relative">
                                <div className="absolute w-full top-1/4 h-px bg-white/5 z-0"></div>
                                <div className="absolute w-full top-2/4 h-px bg-white/5 z-0"></div>
                                <div className="absolute w-full top-3/4 h-px bg-white/5 z-0"></div>

                                {(() => {
                                    const chartData = useMemo(() => {
                                        return songs.slice(0, 6).map(song => {
                                            const maxPop = 60000000;
                                            const spotifyPop = Math.min(Math.round((song.popularity / maxPop) * 100), 100) || Math.floor(Math.random() * 50) + 30;
                                            const youtubePop = Math.max(spotifyPop - (Math.floor(Math.random() * 20)), 10);
                                            const spValue = (song.popularity / 1000000).toFixed(1);
                                            const ytValue = (spValue * (youtubePop / spotifyPop)).toFixed(1);
                                            const maxHeight = Math.max(spotifyPop, youtubePop);
                                            return { song, spotifyPop, youtubePop, spValue, ytValue, maxHeight };
                                        });
                                    }, [songs]);

                                    return chartData.length > 0 ? chartData.map((data, idx) => (
                                        <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end relative z-10 group cursor-crosshair">
                                            <div className="flex w-full justify-center gap-1.5 md:gap-2.5 items-end h-full px-1">
                                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.spotifyPop}%` }} className="w-[40%] md:w-8 bg-[#1DB954] rounded-t-sm relative group-hover:brightness-125 shadow-[0_0_15px_rgba(29,185,84,0.2)]" />
                                                <motion.div initial={{ height: 0 }} whileInView={{ height: `${data.youtubePop}%` }} className="w-[40%] md:w-8 bg-[#FF0000] rounded-t-sm relative group-hover:brightness-125 shadow-[0_0_15px_rgba(255,0,0,0.2)]" />
                                            </div>

                                            <div className="mt-4 text-center w-full">
                                                <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase truncate w-full block group-hover:text-white transition-colors">{data.song.title.split(' ')[0]}</span>
                                            </div>

                                            <div
                                                className="tooltip-box absolute left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:-translate-y-2"
                                                style={{ bottom: `calc(${data.maxHeight}% + 60px)` }}
                                            >
                                                <div className="bg-black border border-[#D3131F]/30 p-3 rounded shadow-2xl min-w-[140px] text-center">
                                                    <p className="text-[10px] font-bold text-white border-b border-white/10 pb-1.5 mb-1.5 truncate">{data.song.title}</p>
                                                    <div className="flex justify-between items-center text-[10px] font-black">
                                                        <span className="text-[#FF0000]">YT: {data.ytValue}M</span>
                                                        <span className="text-[#1DB954]">SP: {data.spValue}M</span>
                                                    </div>
                                                </div>
                                                <div className="w-3 h-3 bg-black border-b border-r border-[#D3131F]/30 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="w-full flex items-center justify-center h-full text-gray-600 font-bold uppercase z-10">No data available</div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </Reveal>

            </div>
        </section>
    );
}
