import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import
import { getImageUrl } from '../../utils/imageUtils';

export default function MusicPlayerSection({
    artist, songs, currentSongIndex, isPlaying, progress,
    currentTime, duration, togglePlayPause, changeSong, handleSongSelect, handleProgressClick
}) {
    const currentSong = songs[currentSongIndex] || null;

    return (
        <section className="relative w-full py-32 px-6 bg-transparent overflow-hidden z-10">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[800px] bg-gradient-to-r from-[#FF007F] via-transparent to-[#00F5D4] rounded-[100%] blur-[80px]" style={{ willChange: 'transform, opacity' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-2 md:px-6">
                <Reveal effect="fade-up">
                    <h3 className="text-center text-2xl md:text-4xl font-black tracking-[0.3em] uppercase mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#00F5D4]">
                        Top Chart Songs
                    </h3>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-24">
                    {songs.slice(0, 5).map((item, idx) => (
                        <Reveal key={idx} delay={idx * 0.1} effect="fade-up">
                            <button
                                onClick={(e) => handleSongSelect(idx, e)}
                                className={`w-full border ${currentSongIndex === idx ? 'border-[#00F5D4] shadow-[0_0_20px_rgba(0,245,212,0.15)] bg-[#1A1C23]/90' : 'border-white/5 shadow-lg bg-[#1A1C23]/40'} hover:border-[#00F5D4]/50 hover:bg-[#1A1C23]/90 text-white rounded-[2rem] p-6 md:p-8 transition-all duration-300 group flex items-center gap-6 backdrop-blur-xl text-left`}
                            >
                                <div className={`flex-shrink-0 w-14 h-14 rounded-full border ${currentSongIndex === idx ? 'border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4]' : 'border-white/10 text-gray-500'} flex items-center justify-center font-black text-2xl group-hover:text-[#00F5D4] group-hover:bg-[#00F5D4]/10 transition-colors shadow-inner`}>
                                    {currentSongIndex === idx && isPlaying ? (
                                        <div className="flex gap-1 items-end h-5">
                                            <div className="w-1.5 bg-[#00F5D4] rounded-t-sm eq-bar" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1.5 bg-[#00F5D4] rounded-t-sm eq-bar" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-1.5 bg-[#00F5D4] rounded-t-sm eq-bar" style={{ animationDelay: '0.3s' }}></div>
                                        </div>
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <span className="text-[10px] tracking-widest uppercase text-[#FF007F] font-black">Top Track</span>
                                    <span className="font-black text-xl leading-tight line-clamp-1 group-hover:text-[#00F5D4] transition-colors">{item.title}</span>
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
                            </button>
                        </Reveal>
                    ))}
                    {songs.length === 0 && (
                        <p className="text-center col-span-2 text-gray-500 py-12 bg-[#1A1C23]/40 rounded-[2rem] border border-white/5 font-bold tracking-widest uppercase">No songs available for this artist.</p>
                    )}
                </div>

                {/* ================= MUSIC PLAYER CONTROLS ================= */}
                {songs.length > 0 && currentSong && (
                    <Reveal delay={0.2} effect="fade-up">
                        <div className="w-full max-w-5xl mx-auto bg-[#181a20]/80 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.7)] relative overflow-hidden">

                            {/* ส่วนซ้าย: รูปแผ่นเสียง */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center">

                                <div className="w-full h-full rounded-full bg-[#0B0C10] border-[4px] border-gray-800 cd-rotate flex items-center justify-center shadow-2xl relative z-10 overflow-hidden ring-4 ring-black/40" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black border-2 border-gray-600 shadow-inner relative flex items-center justify-center z-20">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/50"></div>
                                    </div>
                                    <img
                                        src={getImageUrl(currentSong.coverImage || artist.profileImage, "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop")}
                                        alt="Album Art"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 rounded-full border border-white/10"></div>
                                </div>
                            </div>

                            {/* ส่วนกลาง: ข้อมูลเพลงและหลอดความคืบหน้า */}
                            <div className="flex-1 w-full flex flex-col justify-center px-2 md:px-6 relative z-10">
                                <div className="flex flex-col items-center lg:items-start mb-6">
                                    <span className="text-[#FF007F] text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 inline-block border border-[#FF007F]/40 bg-[#FF007F]/5 px-3 py-1 rounded-md shadow-[0_0_15px_rgba(255,0,127,0.15)]">
                                        Now Playing
                                    </span>
                                    <h4 className="font-black text-3xl md:text-4xl text-white tracking-tight line-clamp-1 mb-1 text-center lg:text-left drop-shadow-md">
                                        {currentSong.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm md:text-base font-bold tracking-widest uppercase mt-1 text-center lg:text-left">
                                        {artist.artistName}
                                    </p>
                                </div>

                                {/* Progress Bar with Beats */}
                                <div className="w-full mt-2 relative">
                                    {/* Background Beat Bars - Refined for Natural Flow */}
                                    <div className="absolute inset-0 -top-6 -bottom-2 flex items-end justify-around gap-1 opacity-[0.12] pointer-events-none z-0 overflow-hidden px-4">
                                        {[...Array(14)].map((_, i) => {
                                            const variants = [
                                                [30, 80, 40, 90, 30],
                                                [20, 60, 30, 70, 20],
                                                [40, 75, 50, 85, 40],
                                                [25, 55, 35, 65, 25]
                                            ];
                                            const heights = variants[i % variants.length];

                                            return (
                                                <motion.div
                                                    key={i}
                                                    className="w-full max-w-[18px] bg-gradient-to-t from-[#FF007F] to-[#00F5D4] rounded-t-lg"
                                                    animate={{
                                                        height: isPlaying ? heights.map(h => `${h}%`) : '15%'
                                                    }}
                                                    transition={{
                                                        duration: 0.7 + (i % 4) * 0.15,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: i * 0.04
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="w-full bg-white/5 rounded-full h-1.5 md:h-2 relative cursor-pointer group z-10" onClick={handleProgressClick}>
                                        <motion.div
                                            className="bg-gradient-to-r from-[#FF007F] to-[#00F5D4] h-full relative rounded-full"
                                            style={{ width: `${progress}%` }}
                                            layout
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_10px_#00F5D4,_0_0_20px_#00F5D4] transition-all duration-300 z-20"></div>
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mt-3 font-mono font-bold tracking-widest relative z-10">
                                        <span>{currentTime}</span>
                                        <span>{duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ส่วนขวา: ปุ่มควบคุม */}
                            <div className="flex items-center gap-4 md:gap-6 mt-4 lg:mt-0 relative z-10">
                                <button onClick={(e) => changeSong(-1, e)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                                </button>

                                <button
                                    onClick={togglePlayPause}
                                    className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FF007F] via-[#ff6ba5] to-[#00F5D4] text-black transition-all duration-300 ease-out hover:scale-105 active:scale-95 group"
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF007F] to-[#00F5D4] blur-[20px] opacity-50 group-hover:opacity-80 transition-opacity duration-300 z-0"></div>
                                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/40 to-transparent z-10 pointer-events-none"></div>
                                    <div className="relative z-20">
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-[#0a0a0a]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 ml-1 text-[#0a0a0a]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                </button>

                                <button onClick={(e) => changeSong(1, e)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
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
