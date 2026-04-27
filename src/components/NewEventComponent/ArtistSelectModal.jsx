import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Search, X, Music, CheckCircle2 } from 'lucide-react';

export default function ArtistSelectModal({ 
    isOpen, 
    onClose, 
    allArtists = [], 
    selectedArtistIds = [], // Array of IDs
    onConfirm 
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [tempSelected, setTempSelected] = useState([]);

    // Sync temp state when modal opens
    useEffect(() => {
        if (isOpen) {
            setTempSelected(Array.isArray(selectedArtistIds) ? selectedArtistIds : []);
        }
    }, [isOpen, selectedArtistIds]);

    const filteredArtists = useMemo(() => {
        return allArtists.filter(artist => 
            artist.artistName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allArtists, searchQuery]);

    const toggleArtist = (id) => {
        const sId = String(id);
        setTempSelected(prev => 
            prev.includes(sId) 
                ? prev.filter(i => i !== sId) 
                : [...prev, sId]
        );
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-[#0B0C10] border border-white/10 w-full max-w-[440px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#7000FF]/20 rounded-xl flex items-center justify-center text-[#7000FF]">
                            <Music size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Select Artist</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {tempSelected.length > 0 && (
                            <button 
                                onClick={() => setTempSelected([])}
                                className="text-[10px] font-black uppercase tracking-widest text-[#FF0055] hover:text-[#FF0055]/80 px-3 py-2 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                        <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-6 pt-6 pb-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search artist..."
                            className="w-full bg-[#1A1C23] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 outline-none focus:border-white/10 transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-3">
                    {filteredArtists.map(artist => {
                        const isSelected = tempSelected.includes(String(artist.id));
                        return (
                            <button
                                key={artist.id}
                                onClick={() => toggleArtist(artist.id)}
                                className={`w-full p-5 rounded-2xl text-left transition-all flex items-center justify-between group border ${
                                    isSelected 
                                    ? "bg-[#7000FF]/10 border-[#7000FF]/50" 
                                    : "bg-transparent border-transparent hover:bg-white/5"
                                }`}
                            >
                                <span className={`font-bold uppercase tracking-widest text-sm ${
                                    isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                                }`}>
                                    {artist.artistName}
                                </span>
                                {isSelected && (
                                    <div className="flex items-center justify-center text-[#00E5FF]">
                                        <CheckCircle2 size={24} fill="#00E5FF" className="text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5">
                    <button
                        onClick={() => { onConfirm(tempSelected); onClose(); }}
                        className="w-full bg-gradient-to-r from-[#7000FF] to-[#00E5FF] text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all uppercase tracking-[0.2em] text-xs shadow-lg"
                    >
                        Confirm Selection ({tempSelected.length})
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
