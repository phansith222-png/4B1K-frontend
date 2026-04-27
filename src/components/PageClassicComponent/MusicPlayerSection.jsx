import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function MusicPlayerSection({
    artist, songs, currentSongIndex, isPlaying, progress,
    currentTime, duration, togglePlayPause, changeSong, handleSongSelect, handleProgressClick
}) {
    const currentSong = songs[currentSongIndex] || null;

    return (
        <section className="relative w-full py-32 px-6 overflow-hidden z-10">
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[800px] bg-gradient-to-r from-[#9b2d96] via-transparent to-[#b266c5] rounded-[100%] blur-[80px]" style={{ willChange: 'transform, opacity' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-2 md:px-6">
                <Reveal effect="fade-up">
                    <h3 className="text-center font-classic font-bold text-2xl md:text-4xl text-[#f9c1db] mb-20 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(249,193,219,0.3)]">The Essential Selection</h3>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-28">
                    {songs.slice(0, 5).map((item, idx) => (
                        <Reveal key={idx} delay={idx * 0.1} effect="fade-up">
                            <motion.button
                                whileHover={{ x: 10, backgroundColor: 'rgba(48, 41, 78, 0.8)' }}
                                onClick={(e) => handleSongSelect(idx, e)}
                                className={`flex items-center gap-6 border-b ${currentSongIndex === idx ? 'border-[#d83bb6] bg-[#30294e]/80 shadow-[0_10px_30px_rgba(155,45,150,0.3)]' : 'border-[#9b2d96]/30 bg-transparent'} p-6 rounded-2xl cursor-pointer transition-all duration-500 w-full text-left backdrop-blur-md group`}
                            >
                                <div className={`w-8 flex justify-center transition-colors relative ${currentSongIndex === idx && isPlaying ? 'text-[#d83bb6] drop-shadow-[0_0_10px_#d83bb6]' : 'text-[#b266c5] group-hover:text-[#f9c1db]'}`}>
                                    {currentSongIndex === idx && isPlaying ? (
                                        <div className="flex gap-[2px] items-end h-6 pb-1">
                                            {[...Array(4)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 18, 6, 14, 4] }}
                                                    transition={{ duration: 0.7 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                                                    className="w-1.5 bg-[#d83bb6] rounded-t-sm shadow-[0_0_8px_#d83bb6]"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="font-classic text-2xl md:text-3xl italic relative z-10">0{idx + 1}</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className={`font-classic font-bold text-xl md:text-2xl uppercase tracking-wider line-clamp-1 transition-colors ${currentSongIndex === idx ? 'text-white' : 'text-[#f9c1db]/70 group-hover:text-white'}`}>
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] font-black tracking-wider uppercase mt-1.5">
                                        <span className="text-[#FF0000] flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF0000]"></div>
                                            YouTube
                                        </span>
                                        <span className="w-px h-2 bg-white/10"></span>
                                        <span className="text-[#1DB954] flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></div>
                                            Spotify
                                        </span>
                                        <span className="text-gray-400 ml-1">
                                            {item.popularity 
                                                ? (item.popularity >= 1000000 
                                                    ? `${(item.popularity / 1000000).toFixed(1)}M` 
                                                    : `${(item.popularity / 1000).toFixed(0)}K`)
                                                : 'HOT'} Streams
                                        </span>
                                    </div>
                                </div>
                            </motion.button>
                        </Reveal>
                    ))}
                    {songs.length === 0 && (
                        <p className="text-[#f9c1db]/50 font-classic col-span-2 text-center py-16 bg-[#30294e]/20 rounded-3xl border border-[#9b2d96]/20">No tracks available at the moment.</p>
                    )}
                </div>

                {songs.length > 0 && currentSong && (
                    <Reveal delay={0.2} effect="fade-up">
                        <div className="w-full max-w-5xl mx-auto bg-[#1c172e]/90 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 border border-[#b266c5]/20 shadow-[0_30px_60px_rgba(48,41,78,0.9)] relative overflow-hidden">

                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center">

                                <div className="w-full h-full rounded-full bg-[#1c172e] border-[4px] border-[#30294e] cd-rotate flex items-center justify-center shadow-[0_0_30px_rgba(216,59,182,0.3)] relative z-10 overflow-hidden ring-4 ring-[#9b2d96]/40" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1c172e] border-2 border-[#b266c5]/50 shadow-inner relative flex items-center justify-center z-20">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#f9c1db]/80"></div>
                                    </div>
                                    <img
                                        src={currentSong.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=200&auto=format&fit=crop"}
                                        alt="Vinyl Cover"
                                        className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-overlay"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 w-full flex flex-col justify-center px-2 md:px-6 relative z-10">
                                <div className="flex flex-col items-center lg:items-start mb-6">
                                    <span className="text-[#f9c1db] font-sub text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 inline-block border border-[#d83bb6]/50 bg-[#d83bb6]/10 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(216,59,182,0.3)]">
                                        Currently Playing
                                    </span>
                                    <h4 className="font-classic font-bold text-3xl md:text-4xl text-white tracking-wide line-clamp-1 mb-1 text-center lg:text-left drop-shadow-[0_0_10px_rgba(249,193,219,0.2)]">
                                        {currentSong.title}
                                    </h4>
                                    <p className="text-[#b266c5] font-sub text-sm md:text-base font-semibold tracking-widest mt-1 text-center lg:text-left uppercase">
                                        {artist.artistName}
                                    </p>
                                </div>
                                <div className="w-full mt-2 relative">
                                    {/* Background Beat Bars - Refined for Natural Flow */}
                                    <div className="absolute inset-0 -top-8 -bottom-2 flex items-end justify-around gap-1 opacity-[0.1] pointer-events-none z-0 overflow-hidden px-6">
                                        {[...Array(10)].map((_, i) => {
                                            const variants = [
                                                [25, 65, 35, 80, 25],
                                                [15, 45, 25, 55, 15],
                                                [30, 75, 45, 85, 30],
                                                [20, 55, 30, 65, 20]
                                            ];
                                            const heights = variants[i % variants.length];

                                            return (
                                                <motion.div
                                                    key={i}
                                                    className="w-full max-w-[25px] bg-[#d83bb6] rounded-t-xl"
                                                    animate={{
                                                        height: isPlaying ? heights.map(h => `${h}%`) : '10%'
                                                    }}
                                                    transition={{
                                                        duration: 1 + (i % 3) * 0.25,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: i * 0.08
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div
                                        className="w-full bg-[#30294e]/60 rounded-full h-1.5 md:h-2 relative cursor-pointer group shadow-inner border border-white/5 z-10"
                                        onClick={handleProgressClick}
                                    >
                                        <motion.div
                                            className="bg-gradient-to-r from-[#9b2d96] to-[#d83bb6] h-full relative rounded-full"
                                            style={{ width: `${progress}%` }}
                                            layout
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#f9c1db] rounded-full shadow-[0_0_10px_#d83bb6,_0_0_20px_#d83bb6] transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100"></div>
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between font-sub text-[10px] md:text-xs text-[#b266c5] mt-3 tracking-widest font-bold relative z-10">
                                        <span>{currentTime}</span>
                                        <span>{duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 md:gap-6 mt-4 lg:mt-0 relative z-10">
                                <button onClick={(e) => changeSong(-1, e)} className="text-[#b266c5] hover:text-[#f9c1db] bg-[#30294e]/50 hover:bg-[#9b2d96]/40 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                                </button>

                                <button
                                    onClick={togglePlayPause}
                                    className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#d83bb6] via-[#b266c5] to-[#9b2d96] text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95 group"
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d83bb6] to-[#9b2d96] blur-[20px] opacity-60 group-hover:opacity-90 transition-opacity duration-300 z-0"></div>
                                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/30 to-transparent z-10 pointer-events-none"></div>
                                    <div className="relative z-20">
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 ml-1 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                </button>

                                <button onClick={(e) => changeSong(1, e)} className="text-[#b266c5] hover:text-[#f9c1db] bg-[#30294e]/50 hover:bg-[#9b2d96]/40 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                                </button>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}
