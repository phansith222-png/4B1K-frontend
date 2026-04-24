import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Music4, X, Loader2, Check, Search } from "lucide-react";
import { motion } from "framer-motion";
import { getAllArtists } from "../api/auth";

export default function ArtistPickerModal({ selectedArtists, onSelectionChange, onClose }) {
  const [allArtists, setAllArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelection, setLocalSelection] = useState(selectedArtists);

  useEffect(() => {
    let cancelled = false;
    const fetchArtists = async () => {
      try {
        setIsLoading(true);
        const data = await getAllArtists();
        if (!cancelled) setAllArtists(data.data.artists ?? []);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchArtists();
    return () => { cancelled = true; };
  }, []);

  const filteredArtists = allArtists.filter((a) => {
    const name = (a.artistName || a.name || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const toggleArtist = (artist) => {
    const already = localSelection.some((a) => a.id === artist.id);
    const next = already
      ? localSelection.filter((a) => a.id !== artist.id)
      : [...localSelection, artist];
    setLocalSelection(next);
  };

  const handleConfirm = () => {
    onSelectionChange(localSelection);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 w-full h-full bg-black/90 backdrop-blur-xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-[#0B0C10] border border-white/10 rounded-[24px] w-full max-w-[380px] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col max-h-[75vh] overflow-hidden mt-6 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
          <h3 className="text-base font-black text-white flex items-center gap-3 tracking-tight">
            <div className="bg-[#7C4DFF]/20 p-2 rounded-xl">
               <Music4 className="text-[#7C4DFF]" size={16} />
            </div>
            Select Artist
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#7C4DFF]/50 transition-all">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder:text-gray-600 w-full font-medium"
            />
          </div>
        </div>

        {/* Artist list */}
        <div className="px-5 pb-5 overflow-y-auto custom-scrollbar flex-1 space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-[#7C4DFF]" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Scanning...</p>
            </div>
          ) : filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredArtists.map((artist) => {
                const isSelected = localSelection.some((a) => a.id === artist.id);
                return (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => toggleArtist(artist)}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-all border ${
                      isSelected
                        ? "bg-gradient-to-r from-[#7C4DFF]/20 to-[#00E5FF]/5 border-[#7C4DFF]/40 text-white shadow-lg"
                        : "bg-white/[0.01] border-transparent text-gray-400 hover:bg-white/5 hover:border-white/5"
                    }`}
                  >
                    <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : ''}`}>
                      {artist.artistName || artist.name}
                    </span>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] text-white p-1 rounded-full shrink-0 shadow-lg"
                      >
                        <Check size={12} strokeWidth={4} />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600 text-sm italic font-medium">
              No results found.
            </div>
          )}
        </div>

        <div className="p-5 border-t border-white/5 bg-black/40 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] text-white font-black py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(124,77,255,0.25)] uppercase tracking-widest text-[11px]"
          >
            Confirm Selection ({localSelection.length})
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
