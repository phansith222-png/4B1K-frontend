import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../Reveal';
import { getCategoryStyle } from '../../utils/eventStyles';

export default function CategoryFilters({
    categories,
    activeCategory,
    setActiveCategory,
    allArtists = [],
    selectedArtistId,
    setSelectedArtistId
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const selectedArtist = allArtists.find(a => String(a.id) === String(selectedArtistId));

    return (
        <>
            <Reveal delay={0.2} effect="fade-up">
                <div className="flex flex-col items-center mb-16 gap-12 px-4 w-full">

                    {/* ── Filter Controls Container ── */}
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-white/[0.02] p-4 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl">
                        {/* ── Genre Tabs ── */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {categories.map((cat, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`relative px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group ${activeCategory === cat
                                        ? "scale-105 z-10"
                                        : "text-gray-500 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className={`relative z-10 transition-colors duration-500 ${activeCategory === cat
                                        ? (cat.toLowerCase().includes('hip') || cat.toLowerCase().includes('edm') || !['pop', 'rock', 'r&b', 'classic', 'all'].some(k => cat.toLowerCase().includes(k)) ? 'text-black' : 'text-white')
                                        : ''
                                        }`}>
                                        {cat}
                                    </span>
                                    {activeCategory === cat && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 rounded-full -z-0 ${getCategoryStyle(cat)}`}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ── Divider ── */}
                        <div className="hidden md:block w-[1px] h-8 bg-white/10" />

                        {/* ── Artist Filter Trigger ── */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={`flex items-center gap-4 px-6 py-3 rounded-full border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-300 group ${selectedArtistId !== "All" ? "bg-[#7000FF]/10 border-[#7000FF]/30" : "bg-white/5"}`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${selectedArtistId !== "All" ? "bg-[#7000FF]/20" : "bg-white/5 group-hover:bg-[#00E5FF]/20"}`}>
                                <svg className={`w-3 h-3 ${selectedArtistId !== "All" ? "text-[#7000FF]" : "text-gray-500 group-hover:text-[#00E5FF]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                {selectedArtist ? selectedArtist.artistName : "Pick Artist"}
                            </span>
                            <svg className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* ── Artist Selection Modal (Portal) ── Moved outside Reveal ── */}
            <AnimatePresence>
                {isModalOpen && createPortal(
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-[#0B0C10] border border-white/10 w-full max-w-lg max-h-[85vh] rounded-[3.5rem] shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden flex flex-col z-[100000]"
                        >
                            <div className="p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">Select <span className="text-[#00E5FF]">Artist</span></h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Personalize your journey</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-transparent to-black/30">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => { setSelectedArtistId("All"); setIsModalOpen(false); }}
                                        className={`p-6 rounded-[2rem] border text-left transition-all duration-500 flex items-center justify-between group ${selectedArtistId === "All" ? "bg-[#00E5FF] border-[#00E5FF] text-black shadow-[0_15px_40px_rgba(0,229,255,0.4)] scale-105" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"}`}
                                    >
                                        <span className="font-black uppercase tracking-widest text-[11px]">All Artists</span>
                                        {selectedArtistId === "All" && <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />}
                                    </button>

                                    {allArtists.map(artist => (
                                        <button
                                            key={artist.id}
                                            onClick={() => { setSelectedArtistId(String(artist.id)); setIsModalOpen(false); }}
                                            className={`p-6 rounded-[2rem] border text-left transition-all duration-500 flex items-center justify-between group ${String(selectedArtistId) === String(artist.id) ? "bg-[#7000FF] border-[#7000FF] text-white shadow-[0_15px_40px_rgba(112,0,255,0.4)] scale-105" : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-black uppercase tracking-widest text-[11px]">{artist.artistName}</span>
                                                <span className="text-[9px] font-bold opacity-40 uppercase tracking-tighter mt-1">{artist.genre || "Global Artist"}</span>
                                            </div>
                                            {String(selectedArtistId) === String(artist.id) && <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full bg-gradient-to-r from-[#7000FF] to-[#00E5FF] text-white font-black py-5 rounded-[2rem] hover:opacity-90 transition-all uppercase tracking-[0.3em] text-[11px] shadow-2xl"
                                >
                                    Return to Events
                                </button>
                            </div>
                        </motion.div>
                    </div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
}
