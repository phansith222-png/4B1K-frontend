import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal'; // 📌 เพิ่ม Import

export default function MusicPlayerSection({ 
    artist, songs, currentSongIndex, isPlaying, progress, 
    currentTime, duration, togglePlayPause, changeSong, handleSongSelect, handleProgressClick 
}) {
    const currentSong = songs[currentSongIndex] || null;

    return (
        <section className="relative w-full py-24 px-6 overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[600px] bg-gradient-to-r from-[#D3131F] via-[#050505] to-gray-500 rounded-[100%] blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <Reveal effect="fade-up">
                    <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
                        <div className="w-10 h-1.5 bg-[#D3131F] shadow-[0_0_10px_#D3131F]"></div>
                        <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white">Top Tracks</h3>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-20">
                    {songs.slice(0, 4).map((item, idx) => (
                        // 📌 ใส่ Reveal คลุมรายชื่อเพลงแต่ละอันให้เด้งเรียงกัน
                        <Reveal key={idx} delay={idx * 0.1} effect="fade-up">
                            <button 
                                onClick={(e) => handleSongSelect(idx, e)}
                                className={`w-full border ${currentSongIndex === idx ? 'border-[#D3131F] bg-[#1a0f0f]' : 'border-white/5 bg-[#111111]'} hover:border-[#D3131F]/50 text-white rounded-xl p-5 md:p-6 transition-all duration-300 group flex items-center gap-6 hover:bg-[#1a1112] text-left shadow-lg`}
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded border ${currentSongIndex === idx ? 'border-[#D3131F] text-[#D3131F] bg-[#D3131F]/10' : 'border-gray-700 text-gray-500 bg-black'} flex items-center justify-center font-black text-xl group-hover:text-[#D3131F] group-hover:border-[#D3131F] transition-all transform group-hover:scale-105 shadow-inner`}>
                                    {currentSongIndex === idx && isPlaying ? (
                                        <div className="flex gap-0.5 items-end h-4">
                                            <div className="w-1 bg-[#D3131F] eq-bar" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-1 bg-[#D3131F] eq-bar" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-1 bg-[#D3131F] eq-bar" style={{ animationDelay: '0.3s' }}></div>
                                        </div>
                                    ) : (
                                        `0${idx + 1}`
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-0.5">
                                    <span className="text-[10px] tracking-widest uppercase text-gray-500 font-bold group-hover:text-[#D3131F] transition-colors">Top Hit</span>
                                    <span className="font-black text-lg md:text-xl leading-tight line-clamp-1 group-hover:text-white transition-colors">{item.title}</span>
                                    <span className="text-xs text-gray-400 font-medium tracking-wider">
                                        {item.popularity ? `${(item.popularity / 1000000).toFixed(1)}M` : 'Trending'} Streams
                                    </span>
                                </div>
                            </button>
                        </Reveal>
                    ))}
                    {songs.length === 0 && (
                        <p className="text-gray-500 py-10 col-span-2 font-bold tracking-widest uppercase text-center border border-white/5 bg-[#111] rounded-xl">No songs available</p>
                    )}
                </div>

                {/* ================= MUSIC PLAYER CONTROLS (UPGRADED UI) ================= */}
                {songs.length > 0 && currentSong && (
                <Reveal delay={0.2} effect="fade-up">
                    <div className="w-full max-w-5xl mx-auto bg-[#111111]/80 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        
                        {/* Red glow behind player */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#D3131F] opacity-10 blur-[80px] pointer-events-none"></div>

                        {/* ฝั่งซ้าย: รูปแผ่นเสียง */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-end justify-center gap-1.5 opacity-30 z-0 overflow-hidden">
                                {[...Array(14)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-gradient-to-t from-[#D3131F] to-gray-500 rounded-t-sm eq-bar"
                                        style={{ 
                                            animationDelay: `${(i % 5) * 0.15}s`, 
                                            animationDuration: `${1 + (i % 4) * 0.2}s`,
                                            animationPlayState: isPlaying ? 'running' : 'paused' 
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <div className="w-full h-full rounded-full bg-[#111111] border-[4px] border-[#222] cd-rotate flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9)] relative z-10 overflow-hidden group ring-2 ring-[#D3131F]/20" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black border-2 border-gray-700 shadow-inner relative flex items-center justify-center z-20">
                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                </div>
                                <div className="absolute inset-0 rounded-full border border-gray-800/50 m-2"></div>
                                <div className="absolute inset-0 rounded-full border border-gray-800/50 m-6"></div>
                                <img 
                                    src={currentSong.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646a?q=80&w=200&auto=format&fit=crop"} 
                                    alt="Album Art" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity grayscale-[50%]"
                                />
                            </div>
                        </div>

                        {/* ฝั่งกลาง: ข้อมูลเพลงและหลอดความคืบหน้า */}
                        <div className="flex-1 w-full flex flex-col justify-center px-2 md:px-6 relative z-10">
                            <div className="flex flex-col items-center lg:items-start mb-6">
                                <span className="text-[#D3131F] text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 inline-block border border-[#D3131F]/40 bg-[#D3131F]/5 px-3 py-1 rounded-md shadow-[0_0_15px_rgba(211,19,31,0.15)]">
                                    Now Playing
                                </span>
                                <h4 className="font-black text-3xl md:text-4xl text-white tracking-tight line-clamp-1 mb-1 text-center lg:text-left drop-shadow-md">
                                    {currentSong.title}
                                </h4>
                                <p className="text-gray-400 text-sm md:text-base font-bold tracking-widest uppercase mt-1 text-center lg:text-left">
                                    {artist.artistName}
                                </p>
                            </div>
                            
                            <div className="w-full mt-2">
                                <div 
                                    className="w-full bg-white/5 rounded-full h-1.5 md:h-2 relative cursor-pointer group"
                                    onClick={handleProgressClick}
                                >
                                    <motion.div 
                                        className="bg-gradient-to-r from-[#D3131F] to-[#ff4d4d] h-full relative rounded-full"
                                        style={{ width: `${progress}%` }}
                                        layout
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_10px_white,_0_0_20px_#D3131F] transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100"></div>
                                    </motion.div>
                                </div>
                                <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mt-3 font-mono font-bold tracking-widest">
                                    <span>{currentTime}</span>
                                    <span>{duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* ฝั่งขวา: ปุ่มควบคุม (Soft & Natural Buttons) */}
                        <div className="flex items-center gap-4 md:gap-6 mt-4 lg:mt-0 relative z-10">
                            {/* Prev Button */}
                            <button onClick={(e) => changeSong(-1, e)} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                            </button>
                            
                            {/* Play/Pause Button (Soft Glow) */}
                            <button 
                                onClick={togglePlayPause} 
                                className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#D3131F] via-[#ff4d4d] to-[#991b1b] text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95 group"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D3131F] to-[#991b1b] blur-[20px] opacity-50 group-hover:opacity-80 transition-opacity duration-300 z-0"></div>
                                <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/30 to-transparent z-10 pointer-events-none"></div>
                                <div className="relative z-20">
                                    {isPlaying ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 ml-1 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    )}
                                </div>
                            </button>

                            {/* Next Button */}
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