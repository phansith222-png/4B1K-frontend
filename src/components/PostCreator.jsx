import React, { useRef, useState, useCallback } from "react";
import { Plus, Music4, X, Loader2 } from "lucide-react";
import { PostToolButton } from "../icon/icon";
import useUserStore from "../stores/userStore";
import usePostStore from "../stores/postStore";
import { uploadToCloudinary } from "../utils/uploadCloud";
import ArtistPickerModal from "./ArtistPickerModal";

export default function PostCreator() {
  const [content, setContent] = useState("");
  // Each entry: { file: File, previewUrl: string }
  const [imageItems, setImageItems] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const fileInputRef = useRef(null);
  const createPost = usePostStore((state) => state.createPost);
  const user = useUserStore((state) => state.user);

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
        artistIds: selectedArtists.map((a) => a.id),
      });

      // Clean up object URLs and reset
      imageItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setContent("");
      setImageItems([]);
      setSelectedArtists([]);
    } catch (error) {
      console.error("Create post failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative z-10">
        {/* Hidden file input */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={hdlFileChange}
        />

        <div className="flex gap-4">
          {/* Avatar */}
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random&color=fff`
            }
            className="w-12 h-12 rounded-full border border-white/10 object-cover shrink-0"
            alt="User Avatar"
          />

          <div className="flex-1">
            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your concert vibes, ask questions, or find squad mates…"
              className="w-full bg-transparent border-none outline-none resize-none pt-2 text-lg text-white placeholder:text-gray-600 h-20 custom-scrollbar"
            />

            {/* Selected artist tags */}
            {selectedArtists.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {selectedArtists.map((artist) => (
                  <span
                    key={artist.id}
                    className="flex items-center gap-1.5 text-sm font-bold bg-[#c6ff00]/10 text-[#c6ff00] px-3 py-1.5 rounded-full border border-[#c6ff00]/20"
                  >
                    🎤 {artist.artistName || artist.name}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedArtists((prev) =>
                          prev.filter((a) => a.id !== artist.id)
                        )
                      }
                      className="hover:text-red-400 transition-colors ml-1"
                      aria-label={`Remove ${artist.artistName || artist.name}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Image previews */}
            {imageItems.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {imageItems.map((item, index) => (
                  <div key={item.previewUrl} className="relative w-24 h-24 group">
                    <img
                      src={item.previewUrl}
                      className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
                      alt={`preview-${index}`}
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center mt-5 pt-5 border-t border-white/5">
          <div className="flex gap-2">
            {/* Media button */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PostToolButton
                icon={<Plus size={18} />}
                label={imageItems.length > 0 ? `Images (${imageItems.length})` : "Media"}
              />
            </button>

            {/* Artist picker button */}
            <button
              type="button"
              onClick={() => setIsArtistModalOpen(true)}
            >
              <PostToolButton icon={<Music4 size={18} />} label="Artist" />
            </button>
          </div>

          {/* Post button */}
          <button
            type="button"
            onClick={hdlSubmitPost}
            disabled={!canPost || isUploading}
            className="bg-[#c6ff00] text-black px-8 py-3 rounded-full font-black text-sm hover:bg-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Posting…
              </span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>

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