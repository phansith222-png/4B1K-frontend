import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, Music4, X, Loader2, Send } from "lucide-react";
import { PostToolButton } from "../icon/SidebarIcons";
import useUserStore from "../stores/userStore";
import usePostStore from "../stores/postStore";
import { uploadToCloudinary } from "../utils/uploadCloud";
import ArtistPickerModal from "./ArtistPickerModal";

export default function PostCreator() {
  const [content, setContent] = useState("");
  // Each entry: { file: File, previewUrl: string }
  const [imageItems, setImageItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const createPost = usePostStore((state) => state.createPost);
  const user = useUserStore((state) => state.user);

  // ── Scroll Lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const closeModal = useCallback(() => {
    if (isUploading) return;
    setContent("");
    imageItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setImageItems([]);
    setSelectedArtists([]);
    setIsModalOpen(false);
  }, [isUploading, imageItems]);

  // ── Images ────────────────────────────────────────────────────────────────
  const hdlFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    const newItems = selected.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageItems((prev) => [...prev, ...newItems]);
    // Reset so the same file(s) can be selected again later if needed
    e.target.value = "";
  };

  const removeImage = useCallback((index) => {
    setImageItems((prev) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const canPost =
    content.trim().length > 0 ||
    imageItems.length > 0 ||
    selectedArtists.length > 0;

  const hdlSubmitPost = async () => {
    if (!canPost || isUploading) return;

    try {
      setIsUploading(true);

      // Upload sequentially to avoid Cloudinary race-condition / rate-limit
      // (parallel Promise.all can cause the first request to be rejected → null)
      const uploadedImageUrls = [];
      for (const item of imageItems) {
        const url = await uploadToCloudinary(item.file);
        if (url) {
          uploadedImageUrls.push(url);
        } else {
          console.warn("Skipping failed upload for:", item.file.name);
        }
      }

      await createPost({
        content,
        image: uploadedImageUrls,
        artistId: selectedArtists.length > 0 ? Number(selectedArtists[0].id || selectedArtists[0]._id) : null,
        artistIds: selectedArtists.map((a) => Number(a.id || a._id)).filter(id => !isNaN(id)),
        // Pass full objects for optimistic UI update
        selectedArtists: selectedArtists
      });

      // Clean up object URLs and reset
      imageItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setContent("");
      setImageItems([]);
      setSelectedArtists([]);
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Create post failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── TRIGGER BAR ── */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#1A1B23] border border-white/10 rounded-2xl md:rounded-[32px] p-4 shadow-xl relative z-20 group/creator cursor-pointer hover:border-[#00E5FF]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-5 px-1">
          {/* Avatar (with glow) */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] rounded-full blur-md opacity-20 group-hover/creator:opacity-40 transition-opacity" />
            <img
              src={
                user?.profileImage || user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random&color=fff`
              }
              className="w-11 h-11 rounded-full border border-white/20 object-cover relative z-10 shadow-lg"
              alt="User Avatar"
            />
            {/* 🛡️ Mini Verified Badge (Bottom-Left) - MOCK: true */}
            {true && (
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-[#0B0C10] rounded-full border border-[#00E5FF] flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.5)] z-20">
                <svg className="w-2.5 h-2.5 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            )}
          </div>

          {/* Trigger Text (Vibrant Gradient) */}
          <div className="flex-1 py-1">
            <span className="text-[16px] font-black bg-gradient-to-r from-[#7C4DFF] via-[#00E5FF] to-[#7C4DFF] bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent opacity-90 group-hover/creator:opacity-100 transition-all tracking-tight">
              Share your concert vibe...
            </span>
          </div>

          {/* Decorative Icons (Colored & Glowing) */}
          <div className="flex items-center gap-4 pr-3">
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-[#00E5FF] blur-lg opacity-0 group-hover/creator:opacity-30 transition-opacity" />
              <ImageIcon size={22} className="text-[#00E5FF] relative z-10 transition-transform group-hover/creator:scale-110" />
            </div>
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-[#7C4DFF] blur-lg opacity-0 group-hover/creator:opacity-30 transition-opacity" />
              <span className="text-[#7C4DFF] text-xl font-black relative z-10 transition-transform group-hover/creator:scale-110 flex items-center justify-center w-8 h-8">#</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULL POST MODAL (Portal) ── */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          {/* Backdrop (Soft Blur) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-[#111218] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-lg font-black bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] bg-clip-text text-transparent uppercase tracking-wider">
                Create New Vibe
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-full transition-all group"
                disabled={isUploading}
              >
                <X size={22} className="text-white group-hover:rotate-90 transition-transform" strokeWidth={3} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={user?.profileImage || user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                    className="w-12 h-12 rounded-full border border-white/10 object-cover"
                    alt=""
                  />
                  {/* 🛡️ Mini Verified Badge (Bottom-Left) - MOCK: true */}
                  {true && (
                    <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 bg-[#0B0C10] rounded-full border border-[#00E5FF] flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.5)] z-20">
                      <svg className="w-2.5 h-2.5 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  )}
                </div>
                <textarea
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening? Share your concert vibes..."
                  className="flex-1 bg-transparent border-none outline-none resize-none py-2 text-lg text-white placeholder:text-gray-600 h-32 custom-scrollbar"
                />
              </div>

              {/* Artist Tags Section */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]">Artist Tags</p>
                  <button
                    onClick={() => setIsArtistModalOpen(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                  >
                    + Tag Artist
                  </button>
                </div>
                <div 
                  onClick={() => setIsArtistModalOpen(true)}
                  className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-[#00E5FF]/30 transition-all group/tags"
                >
                  {selectedArtists.length > 0 ? (
                    selectedArtists.map(artist => (
                      <span key={artist.id} className="text-[#00E5FF] text-[11px] font-black bg-[#7C4DFF]/10 px-3 py-1 rounded-full border border-[#7C4DFF]/20 flex items-center gap-1">
                        # {artist.artistName || artist.name}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArtists(prev => prev.filter(a => a.id !== artist.id));
                          }} 
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-600 italic group-hover/tags:text-gray-400 transition-colors">No artists tagged... Click to add</span>
                  )}
                </div>
              </div>

              {/* Previews (Images) */}
              {imageItems.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {imageItems.map((item, index) => (
                    <div key={item.previewUrl} className="relative w-24 h-24 group">
                      <img src={item.previewUrl} className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg" alt="" />
                      <button 
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer / Tools */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-2xl bg-white/5 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all"
                    title="Add Photo"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <button 
                    onClick={() => setIsArtistModalOpen(true)}
                    className="p-3 rounded-2xl bg-white/5 text-[#7C4DFF] hover:bg-[#7C4DFF]/10 transition-all flex items-center justify-center w-11 h-11"
                    title="Tag Artist"
                  >
                    <span className="text-xl font-black leading-none">#</span>
                  </button>
                </div>

                <button
                  onClick={hdlSubmitPost}
                  disabled={!canPost || isUploading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#00E5FF] text-white font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      POST VIBE
                      <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={hdlFileChange}
      />

      {/* Artist Picker Modal */}
      {isArtistModalOpen && (
        <ArtistPickerModal
          selectedArtists={selectedArtists}
          onSelectionChange={setSelectedArtists}
          onClose={() => setIsArtistModalOpen(false)}
        />
      )}
    </>
  );
}
