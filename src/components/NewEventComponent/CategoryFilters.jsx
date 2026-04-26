import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../Reveal';
import ArtistSelectModal from './ArtistSelectModal';
import { getCategoryStyle } from '../../utils/eventStyles';
import { X } from 'lucide-react';

export default function CategoryFilters({
    categories,
    activeCategory,
    setActiveCategory,
    allArtists = [],
    selectedArtistIds = [],
    setSelectedArtistIds
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Label for the button
    const getButtonLabel = () => {
        if (selectedArtistIds.length === 0) return "Pick Artist";
        if (selectedArtistIds.length === 1) {
            const artist = allArtists.find(a => String(a.id) === String(selectedArtistIds[0]));
            return artist ? artist.artistName : "Pick Artist";
        }
        if (selectedArtistIds.length === 2) {
            const artists = allArtists.filter(a => selectedArtistIds.includes(String(a.id)));
            return artists.map(a => a.artistName).join(", ");
        }
        return `Selected (${selectedArtistIds.length})`;
    };

    return (
        <>
            <Reveal delay={0.2} effect="fade-up">
                <div className="flex flex-col items-center gap-12 px-4 w-full">

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
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={`flex items-center gap-4 px-6 py-3 rounded-full border transition-all duration-300 group shadow-lg ${
                                    selectedArtistIds.length > 0 
                                    ? "bg-[#7000FF] border-[#7000FF] shadow-[#7000FF]/20" 
                                    : "bg-white/5 border-white/10 hover:border-[#00E5FF]/40 shadow-none"
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                    selectedArtistIds.length > 0 
                                    ? "bg-white/20" 
                                    : "bg-white/5 group-hover:bg-[#00E5FF]/20"
                                }`}>
                                    <svg className={`w-3 h-3 ${
                                        selectedArtistIds.length > 0 
                                        ? "text-white" 
                                        : "text-gray-500 group-hover:text-[#00E5FF]"
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                    selectedArtistIds.length > 0 ? "text-white" : "text-gray-400 group-hover:text-white"
                                }`}>
                                    {getButtonLabel()}
                                </span>
                                <svg className={`w-3 h-3 transition-colors ${
                                    selectedArtistIds.length > 0 ? "text-white/60" : "text-gray-600 group-hover:text-white"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {/* ── Clear Button ── */}
                            <AnimatePresence>
                                {selectedArtistIds.length > 0 && (
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        onClick={() => {
                                            // Completely clear artist selection and query params by redirecting to base path
                                            window.location.href = window.location.pathname;
                                        }}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#FF0055]/20 hover:border-[#FF0055]/40 transition-all group"
                                        title="Clear & Refresh"
                                    >
                                        <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </Reveal>

            <ArtistSelectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                allArtists={allArtists}
                selectedArtistIds={selectedArtistIds}
                onConfirm={(ids) => {
                    setSelectedArtistIds(ids);
                    // ── NEW: Auto-switch category based on the first selected artist ──
                    if (ids.length > 0) {
                        const artist = allArtists.find(a => String(a.id) === String(ids[0]));
                        if (artist && artist.genre) {
                            // Find matching category (case-insensitive)
                            const match = categories.find(c => c.toLowerCase().includes(artist.genre.toLowerCase()));
                            if (match) {
                                setActiveCategory(match);
                            } else {
                                // Default back to All if no specific category match, but still keep All
                                setActiveCategory("All");
                            }
                        }
                    }
                }}
            />
        </>
    );
}
