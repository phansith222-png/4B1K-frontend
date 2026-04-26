import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Reveal from '../Reveal';

export default function TopChartsSection({ 
    youtubeSongs, 
    spotifySongs, 
    allChartSongs = [],
    currentSongIndex, 
    isPlaying, 
    handleSongSelect,
    themeColor = '#00E5FF'
}) {
    const navigate = useNavigate();

    const handleArtistClick = (e, artistId) => {
        e.stopPropagation();
        if (artistId) {
            navigate(`/artist/${artistId}`);
        }
    };

    const getTrendingIcon = (idx) => {
        if (idx === 0) return <span className="text-[8px] text-[#00E5FF] font-black animate-pulse px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20 ml-2">▲ HOT</span>;
        if (idx === 1) return <span className="text-[8px] text-green-400 font-black opacity-80 ml-2">▲ UP</span>;
        if (idx === 4) return <span className="text-[8px] text-gray-500 font-black opacity-60 ml-2">● NEW</span>;
        return <span className="text-[8px] text-gray-700 font-black ml-2 opacity-30">● STABLE</span>;
    };
    
    const renderSongItem = (song, idx, realIdx, type) => {
        const isCurrent = currentSongIndex === realIdx;
        const accentColor = type === 'youtube' ? '#FF0000' : '#1DB954';
        
        return (
            <motion.div
                key={song.id || realIdx}
                whileHover={{ x: 8 }}
                onClick={(e) => handleSongSelect(realIdx, e)}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 opacity-100"
            >
                <div className="relative w-12 h-12 flex-shrink-0">
                    <img 
                        src={song.coverImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100&auto=format&fit=crop"} 
                        alt={song.title}
                        className="w-full h-full object-cover rounded-lg ring-1 ring-white/10"
                    />
                    {isCurrent && isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                            <div className="flex gap-0.5 items-end h-4">
                                <div className="w-1 bg-white animate-[bounce_0.6s_infinite]"></div>
                                <div className="w-1 bg-white animate-[bounce_0.8s_infinite]"></div>
                                <div className="w-1 bg-white animate-[bounce_0.7s_infinite]"></div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 overflow-hidden group">
                    <div className="flex items-center">
                        <h4 className="font-bold text-sm md:text-base truncate text-white">
                            {song.title}
                        </h4>
                        {getTrendingIcon(idx)}
                    </div>
                    <p 
                        onClick={(e) => handleArtistClick(e, song.artistId)}
                        className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-0.5 hover:text-[#00E5FF] transition-colors inline-block"
                    >
                        {song.artistName || 'Various Artists'}
                    </p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black font-mono text-gray-500">#{idx + 1}</span>
                    <div className="flex items-center gap-1.5 bg-black/30 px-2 py-0.5 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                            {song.popularity ? (
                                song.popularity >= 1000000 
                                ? (song.popularity / 1000000).toFixed(1) + 'M' 
                                : (song.popularity / 1000).toFixed(1) + 'K'
                            ) : 'HOT'}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <section className="py-32 px-6 md:px-12 relative z-10 w-full">
            <div className="max-w-[1600px] mx-auto">
                <Reveal effect="fade-up">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                        <div>
                            <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block opacity-50">Global Rankings</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                                Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7000FF]">Trending</span> Charts
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                            <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
                                Live Updates
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                        </div>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                    {/* YouTube Column */}
                    <Reveal effect="fade-up" delay={0.1}>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">YouTube Top 5</h3>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Based on Video Views</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                {youtubeSongs.length > 0 ? (
                                    youtubeSongs.map((song, i) => renderSongItem(song, i, i, 'youtube'))
                                ) : (
                                    <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-gray-600 text-xs uppercase tracking-widest font-black">
                                        No Songs Found in Database
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>

                    {/* Spotify Column */}
                    <Reveal effect="fade-up" delay={0.2}>
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.223.367-.703.483-1.07.26-2.736-1.673-6.179-2.052-10.235-1.123-.42.096-.84-.168-.936-.587-.096-.42.168-.84.587-.936 4.444-1.015 8.243-.578 11.31 1.302.366.222.483.702.26 1.07zm1.47-3.257c-.28.455-.878.604-1.332.325-3.13-1.923-7.903-2.48-11.606-1.353-.513.156-1.054-.136-1.21-.65-.156-.514.137-1.055.65-1.21 4.24-1.288 9.51-.656 13.17 1.59.455.28.605.877.325 1.332zm.126-3.415C15.426 8.358 9.355 8.156 5.82 9.228c-.516.156-1.066-.143-1.22-.66-.157-.517.143-1.066.66-1.22 4.072-1.236 10.785-.996 15.01 1.513.465.276.618.877.34 1.342-.276.466-.877.62-1.342.342z"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Spotify Top 5</h3>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Based on Streams</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {spotifySongs.length > 0 ? (
                                    spotifySongs.map((song, i) => renderSongItem(song, i, i + 5, 'spotify'))
                                ) : (
                                    <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-gray-600 text-xs uppercase tracking-widest font-black">
                                        No Songs Found in Database
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
