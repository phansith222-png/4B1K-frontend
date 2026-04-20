import React from 'react';
import { motion } from 'framer-motion';

export default function MusicPlayerSection({ 
    artist, songs, currentSongIndex, isPlaying, progress, 
    currentTime, duration, togglePlayPause, changeSong, handleSongSelect, handleProgressClick 
}) {
    const currentSong = songs[currentSongIndex] || null;

    return (
        <section className="relative w-full py-32 px-6 overflow-hidden z-10">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[800px] bg-gradient-to-r from-[#D4AF37] via-transparent to-[#ffffff] rounded-[100%] blur-[120px] animate-pulse"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <h3 className="text-center font-classic text-2xl md:text-4xl text-[#D4AF37] mb-20 tracking-[0.4em] uppercase font-light">The Essential Selection</h3>
                
                {/* Top Tracks List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
                    {songs.slice(0, 4).map((item, idx) => (
                        <motion.button 
                            key={idx}
                            whileHover={{ x: 10, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                            onClick={(e) => handleSongSelect(idx, e)}
                            className={`flex items-center gap-6 border-b ${currentSongIndex === idx ? 'border-[#D4AF37] bg-[#1e293b]/60' : 'border-gray-800/50 bg-transparent'} p-6 rounded-2xl cursor-pointer transition-all duration-500 w-full text-left backdrop-blur-sm group`}
                        >
                            <span className={`font-classic text-2xl md:text-3xl italic transition-colors ${currentSongIndex === idx && isPlaying ? 'text-[#D4AF37] drop-shadow-[0_0_10px_#D4AF37]' : 'text-gray-600 group-hover:text-[#D4AF37]'}`}>
                                {currentSongIndex === idx && isPlaying ? '►' : `0${idx + 1}`}
                            </span>
                            <div>
                                <h4 className={`font-classic text-xl md:text-2xl uppercase tracking-wider line-clamp-1 transition-colors ${currentSongIndex === idx ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {item.title}
                                </h4>
                                <p className="font-sub text-[#D4AF37]/80 italic mt-2 tracking-widest text-xs md:text-sm">
                                    {item.popularity ? `${(item.popularity / 1000000).toFixed(1)}M Streams` : 'The Soul Session'}
                                </p>
                            </div>
                        </motion.button>
                    ))}
                    {songs.length === 0 && (
                        <p className="text-gray-500 font-classic italic col-span-2 text-center py-16 bg-[#1e293b]/20 rounded-3xl border border-[#D4AF37]/10">No tracks available at the moment.</p>
                    )}
                </div>

                {/* ================= MUSIC PLAYER CONTROLS (UI อัปเกรดตามเรฟ) ================= */}
                {songs.length > 0 && currentSong && (
                <div className="w-full max-w-5xl mx-auto bg-[#0F172A]/80 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.7)] relative overflow-hidden">
                    
                    {/* ส่วนซ้าย: รูปแผ่นเสียง */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-end justify-center gap-2 opacity-30 z-0 overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="w-full bg-gradient-to-t from-[#D4AF37] to-[#ffffff] rounded-t-full eq-bar" 
                                    style={{ animationDelay: `${(i % 6) * 0.2}s`, animationDuration: `${1.2 + (i % 3) * 0.3}s`, animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                </div>
                            ))}
                        </div>

                        <div className="w-full h-full rounded-full bg-[#0B0C10] border-[4px] border-gray-800 cd-rotate flex items-center justify-center shadow-2xl relative z-10 overflow-hidden ring-4 ring-black/40" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black border-2 border-[#D4AF37]/30 shadow-inner relative flex items-center justify-center z-20">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/50"></div>
                            </div>
                            <img 
                                src={currentSong.coverImage || artist.profileImage || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=200&auto=format&fit=crop"} 
                                alt="Vinyl Cover" 
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale-[10%]"
                            />
                            <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* ส่วนกลาง: ข้อมูลเพลงและหลอดความคืบหน้า */}
                    <div className="flex-1 w-full flex flex-col justify-center px-2 md:px-6 relative z-10">
                        <div className="flex flex-col items-center lg:items-start mb-6">
                            <span className="text-[#D4AF37] font-sub text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 inline-block border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                                Currently Playing
                            </span>
                            <h4 className="font-classic text-3xl md:text-4xl text-white tracking-wide line-clamp-1 mb-1 text-center lg:text-left drop-shadow-md">
                                {currentSong.title}
                            </h4>
                            <p className="text-gray-400 font-sub italic text-sm md:text-base tracking-widest mt-1 text-center lg:text-left">
                                {artist.artistName}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full mt-2">
                            <div className="w-full bg-[#1e293b]/60 rounded-full h-1.5 md:h-2 relative cursor-pointer group shadow-inner border border-white/5" onClick={handleProgressClick}>
                                <motion.div 
                                    className="bg-gradient-to-r from-[#8a7322] to-[#D4AF37] h-full relative rounded-full"
                                    style={{ width: `${progress}%` }}
                                    layout
                                >
                                    {/* Glowing Thumb */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_10px_#D4AF37,_0_0_20px_#D4AF37] transition-all duration-300 opacity-0 group-hover:opacity-100 md:opacity-100"></div>
                                </motion.div>
                            </div>
                            <div className="flex justify-between font-sub text-[10px] md:text-xs text-gray-500 mt-3 tracking-widest font-bold">
                                <span>{currentTime}</span>
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* ส่วนขวา: ปุ่มควบคุม (Soft Glow Buttons) */}
                    <div className="flex items-center gap-4 md:gap-6 mt-4 lg:mt-0 relative z-10">
                        {/* Prev Button */}
                        <button onClick={(e) => changeSong(-1, e)} className="text-gray-400 hover:text-[#D4AF37] bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                        </button>
                        
                        {/* Play/Pause Button */}
                        <button 
                            onClick={togglePlayPause} 
                            className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#f3db87] to-[#997a15] text-[#0F172A] transition-all duration-300 ease-out hover:scale-105 active:scale-95 group"
                        >
                            {/* Outer Soft Glow */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#fff3cd] blur-[20px] opacity-50 group-hover:opacity-80 transition-opacity duration-300 z-0"></div>
                            
                            {/* Inner Highlight for 3D feel */}
                            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-white/40 to-transparent z-10 pointer-events-none"></div>
                            
                            <div className="relative z-20">
                                {isPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-[#0F172A]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 ml-1 text-[#0F172A]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                )}
                            </div>
                        </button>

                        {/* Next Button */}
                        <button onClick={(e) => changeSong(1, e)} className="text-gray-400 hover:text-[#D4AF37] bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all duration-300 ease-out active:scale-95">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                        </button>
                    </div>
                </div>
                )}
            </div>
        </section>
    );
}