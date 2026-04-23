import React, { useState, useEffect } from "react";
import { Music4, X, Loader2, Check, Search } from "lucide-react";
import { getAllArtists } from "../api/auth";

/**
 * ArtistPickerModal
 *
 * Props:
 *  - selectedArtists  : Artist[]   — currently selected artists (controlled)
 *  - onSelectionChange: (Artist[]) => void — called with the full updated list
 *  - onClose          : () => void
 */
export default function ArtistPickerModal({ selectedArtists, onSelectionChange, onClose }) {
  const [allArtists, setAllArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch artists once when modal mounts
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
    const already = selectedArtists.some((a) => a.id === artist.id);
    const next = already
      ? selectedArtists.filter((a) => a.id !== artist.id)
      : [...selectedArtists, artist];
    onSelectionChange(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Music4 className="text-[#c6ff00]" size={24} />
            Select Artists
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Close artist picker"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search artist…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500 w-full"
            />
          </div>
        </div>

        {/* Artist list */}
        <div className="px-5 pb-5 overflow-y-auto custom-scrollbar flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
              <Loader2 size={32} className="animate-spin text-[#c6ff00]" />
              <p>Loading artists…</p>
            </div>
          ) : filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredArtists.map((artist) => {
                const isSelected = selectedArtists.some((a) => a.id === artist.id);
                return (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => toggleArtist(artist)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      isSelected
                        ? "bg-[#c6ff00]/10 border-[#c6ff00]/30 text-white"
                        : "bg-white/[0.02] border-transparent text-gray-300 hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="font-medium text-left">
                      {artist.artistName || artist.name}
                    </span>
                    {isSelected && (
                      <div className="bg-[#c6ff00] text-black p-1 rounded-full shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchQuery ? "No matching artists." : "No artists found."}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-black/20">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#c6ff00] text-black font-bold py-3 rounded-xl hover:bg-white transition-colors"
          >
            Done ({selectedArtists.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
}
