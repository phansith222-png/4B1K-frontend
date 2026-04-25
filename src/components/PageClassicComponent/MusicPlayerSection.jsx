import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';

export default function MusicPlayerSection({ 
    artist, 
    songs, 
    currentSongIndex, 
    isPlaying, 
    progressBarRef, 
    currentTimeRef, 
    durationRef, 
    togglePlayPause, 
    changeSong, 
    handleSongSelect, 
    handleProgressClick 
}) {
    const currentSong = songs[currentSongIndex] || null;

    return (
        <section className="relative w-full py-32 px-6 overflow-hidden z-10">
            {/* Background Glow */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[800px] bg-gradient-to-r from-[#9b2d96] via-transparent to-[#b266c5] rounded-[100%] blur-[80px] animate-pulse"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Reveal effect="fade-up">
                    <h3 className="text-center font-classic font-bold text-2xl md:text-4xl text-[#f9c1db] mb-20 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(249,193,219,0.3)]">
                        The Essential Selection
                    </h3>
                </Reveal>
                
                {/* Song List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
                    {songs.slice(0, 4).map((item, idx) => (
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
                                    <h4 className={`font-classic font-bold text-xl md:text-2xl uppercase tracking-wider line-clamp-1 ${currentSongIndex === idx ? 'text-white' : 'text-[#f9c1db]/70 group-hover:text-white'}`}>
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] font-black tracking-wider uppercase mt-1.5">
                                        <span className="text-[#FF0000] flex items-center gap-1">YouTube</span>
                                        <span className="w-px h-2 bg-white/10"></span>
                                        <span className="text-[#1DB954] flex items-center gap-1">Spotify</span>
                                        <span className="text-gray-400 ml-1">{item.popularity ? `${(item.popularity / 1000000).toFixed(1)}M` : '1.2M'} Streams</span>
                                    </div>
                                </div>
                            </motion.button>
                        </Reveal>
                    ))}
                </div>

                {/* Main Player */}
                {songs.length > 0 && currentSong && (
                    <Reveal delay={0.2} effect="fade-up">
                        <div className="w-full max-w-5xl mx-auto bg-[#1c172e]/90 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 border border-[#b266c5]/20 shadow-[0_30px_60px_rgba(48,41,78,0.9)] relative overflow-hidden">
                            
                            {/* CD Circle */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                                <div 
                                    className="w-full h-full rounded-full bg-[#1c172e] border-[4px] border-[#30294e] flex items-center justify-center shadow-[0_0_30px_rgba(216,59,182,0.3)] relative z-10 overflow-hidden ring-4 ring-[#9b2d96]/40 transition-transform duration-1000"
                                    style={{ 
                                        animation: isPlaying ? 'spin 3s linear infinite' : 'none',
                                    }}
                                >
                                    <img 
                                        src={currentSong.coverImage || artist.profileImage} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                        alt="disc"
                                    />
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1c172e] border-2 border-[#b266c5]/50 z-20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#f9c1db]"></div>
                                    </div>
                                </div>
                                {/* สไตล์หมุน CD */}
                                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col items-center lg:items-start mb-6">
                                    <span className="text-[#f9c1db] text-[10px] font-bold tracking-widest uppercase mb-2 border border-[#d83bb6]/50 px-3 py-1 rounded-full">
                                        Currently Playing
                                    </span>
                                    <h4 className="font-classic font-bold text-3xl md:text-4xl text-white mb-1 text-center lg:text-left">
                                        {currentSong.title}
                                    </h4>
                                    <p className="text-[#b266c5] font-sub text-sm font-semibold tracking-[0.3em] uppercase">
                                        {artist.artistName}
                                    </p>
                                </div>

                                {/* Progress Bar - แก้ไขตรงนี้ 🌟 */}
                                <div className="w-full mt-2">
                                    <div 
                                        className="w-full bg-[#30294e]/60 rounded-full h-2 relative cursor-pointer group" 
                                        onClick={handleProgressClick}
                                    >
                                        {/* เราจะใช้ Ref คุมตัวนี้ ห้ามใส่ width ล็อคไว้ในสไตล์ถ้า Ref ไม่ขยับ */}
                                        <div 
                                            ref={progressBarRef}
                                            className="bg-gradient-to-r from-[#9b2d96] to-[#d83bb6] h-full rounded-full relative transition-[width] duration-150 ease-linear"
                                            style={{ width: '0%' }} 
                                        >
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#d83bb6] scale-0 group-hover:scale-100 transition-transform"></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-[#b266c5] mt-3 font-black tracking-widest uppercase">
                                        <span ref={currentTimeRef}>0:00</span>
                                        <span ref={durationRef}>0:00</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex items-center gap-6">
                                <button onClick={(e) => changeSong(-1, e)} className="text-[#b266c5] hover:text-white transition-colors">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                                </button>
                                
                                <button 
                                    onClick={togglePlayPause} 
                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d83bb6] to-[#9b2d96] flex items-center justify-center text-white shadow-[0_0_20px_rgba(216,59,182,0.5)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isPlaying ? (
                                        <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg className="h-10 w-10 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    )}
                                </button>

                                <button onClick={(e) => changeSong(1, e)} className="text-[#b266c5] hover:text-white transition-colors">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                                </button>
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}