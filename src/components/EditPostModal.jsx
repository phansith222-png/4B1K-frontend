import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Plus, Loader2, Music4 } from 'lucide-react';
import usePostStore from '../stores/postStore';
import { uploadToCloudinary } from '../utils/uploadCloud';
import ArtistPickerModal from './ArtistPickerModal';

function EditPostModal({ post, onClose }) {
    // ── Scroll Lock ──
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const [editContent, setEditContent] = useState(post.content);

    // Map postImages to extract only URLs
    // Existing images from backend (URL strings)
    const [existingImages, setExistingImages] = useState(
        post.postImages ? post.postImages.map((img) => img.url) : []
    );

    const [selectedArtists, setSelectedArtists] = useState(
        post.postArtists ? post.postArtists.map(pa => {
            if (pa.artist) return pa.artist;
            // Robust Fallback: If relation is missing, use the ID we have. 
            // We'll look for the artist name in the global context if possible, 
            // but for now we reconstruct a minimal object so it's not "lost" during edit.
            return { id: pa.artistId, artistName: `Artist #${pa.artistId}` };
        }).filter(Boolean) : []
    );
    const [isArtistPickerOpen, setIsArtistPickerOpen] = useState(false);

    // Missing states restored
    const [newFiles, setNewFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    const editPost = usePostStore(state => state.editPost);

    // Helper to compare artist tag arrays (ignoring order, normalizing types)
    const tagsChanged = () => {
        const currentIds = selectedArtists.map(a => String(a.id || a._id || '')).filter(Boolean).sort();
        const originalIds = (post.postArtists || []).map(pa => String(pa.artistId || '')).filter(Boolean).sort();
        return JSON.stringify(currentIds) !== JSON.stringify(originalIds);
    };

    // Check if there are changes to enable/disable Save button
    const hasChanges =
        (editContent || '').trim() !== (post.content || '').trim() ||
        newFiles.length > 0 ||
        existingImages.length !== (post.postImages || []).length ||
        tagsChanged();

    // Handle new file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        setNewFiles(prev => [...prev, ...selectedFiles]);
        const previews = selectedFiles.map(f => URL.createObjectURL(f));
        setNewPreviews(prev => [...prev, ...previews]);
        e.target.value = null;
    };

    // Remove unuploaded new image
    const removeNewImage = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing image (URL)
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!editContent.trim() && existingImages.length === 0 && newFiles.length === 0) return;

        try {
            setIsUploading(true);

            let uploadedUrls = [];

            // Upload new images to Cloudinary if any
            if (newFiles.length > 0) {
                const results = await Promise.all(newFiles.map(f => uploadToCloudinary(f)));
                uploadedUrls = results.filter(url => url !== null);
            }

            // Combine remaining existing URLs with new URLs
            const allImages = [...existingImages, ...uploadedUrls];

            // Send data back to store to update
            await editPost(post.id || post._id, {
                content: editContent,
                image: allImages,
                // Match the working PostCreator.jsx structure exactly
                // artistId: selectedArtists.length > 0 ? Number(selectedArtists[0].id || selectedArtists[0]._id) : null,
                artistIds: selectedArtists.map(a => Number(a.id || a._id)).filter(id => !isNaN(id)),
                // Pass full objects for optimistic UI update
                selectedArtists: selectedArtists
            });
            onClose();
        } catch (error) {
            console.error('Edit failed', error);
        } finally {
            setIsUploading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Background click to close */}
            <div className="absolute inset-0" onClick={!isUploading ? onClose : undefined} />

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="relative bg-[#1a1a1a] border border-white/10 w-full md:max-w-xl max-h-[90vh] md:max-h-[85vh] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-3 md:p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                    <h3 className="font-bold text-white px-2 md:px-4 text-sm md:text-base">Edit Post</h3>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        disabled={isUploading}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm md:text-base text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E5FF]/50 transition-all resize-none h-32 md:h-40 disabled:opacity-60"
                        placeholder="What's on your mind?"
                    />

                    {/* Artist Tags Section */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#00E5FF]">Artist Tags</p>
                            <button
                                onClick={() => setIsArtistPickerOpen(true)}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                            >
                                + Edit Tags
                            </button>
                        </div>
                        <div
                            onClick={() => setIsArtistPickerOpen(true)}
                            className="flex flex-wrap gap-2 min-h-[40px] p-2 md:p-3 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-[#00E5FF]/30 transition-all group/tags"
                        >
                            {selectedArtists.length > 0 ? (
                                selectedArtists.map(artist => (
                                    <span key={artist.id} className="text-[#00E5FF] text-[10px] md:text-[11px] font-black bg-[#7C4DFF]/10 px-2 md:px-3 py-1 rounded-full border border-[#7C4DFF]/20 flex items-center gap-1">
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
                                <span className="text-xs text-gray-600 italic group-hover/tags:text-gray-400 transition-colors">No artists tagged...</span>
                            )}
                        </div>
                    </div>

                    {/* Existing images from post */}
                    {existingImages.length > 0 && (
                        <div>
                            <p className="text-[10px] md:text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Current Images</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square group">
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
                                            alt={`existing-${index}`}
                                        />
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-1 -right-1 bg-red-500/90 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New preview images */}
                    {newPreviews.length > 0 && (
                        <div>
                            <p className="text-[10px] md:text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">New Images</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
                                {newPreviews.map((url, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square group">
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover rounded-xl border border-[#00E5FF]/30 shadow-lg"
                                            alt={`new-${index}`}
                                        />
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-1 -right-1 bg-red-500/90 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 md:p-4 border-t border-white/5 flex flex-col md:flex-row gap-3 justify-between items-center bg-white/[0.01] shrink-0">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                        {/* Add image button */}
                        <button
                            type="button"
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                            <Plus size={14} />
                            <span>Image</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => !isUploading && setIsArtistPickerOpen(true)}
                            disabled={isUploading}
                            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm text-gray-400 hover:text-[#7C4DFF] hover:bg-[#7C4DFF]/5 border border-white/5 transition-colors disabled:opacity-40 whitespace-nowrap"
                        >
                            <span className="font-black">#</span>
                            <span>Tags</span>
                        </button>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={onClose}
                            disabled={isUploading}
                            className="flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-full font-bold text-xs md:text-sm text-gray-500 hover:text-white transition-colors disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isUploading}
                            className="flex-1 md:flex-none bg-[#00E5FF] text-black px-4 md:px-8 py-2.5 rounded-full font-black text-xs md:text-sm hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} />
                                    <span className="hidden md:inline">Saving...</span>
                                    <span className="md:hidden">...</span>
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Artist Selection Modal */}
            {isArtistPickerOpen && (
                <ArtistPickerModal
                    selectedArtists={selectedArtists}
                    onSelectionChange={setSelectedArtists}
                    onClose={() => setIsArtistPickerOpen(false)}
                />
            )}
        </div>,
        document.body
    );
}

export default EditPostModal;
