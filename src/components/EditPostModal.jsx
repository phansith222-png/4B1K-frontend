// ไฟล์: src/components/EditPostModal.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import usePostStore from '../stores/postStore';
import { uploadToCloudinary } from '../utils/uploadCloud';

function EditPostModal({ post, onClose }) {
const [editContent, setEditContent] = useState(post.content);
    
    // 👉 จุดที่แก้ไข 1: เปลี่ยนจากดึง post.image เป็นดึง post.postImages แล้ว map เอาเฉพาะ url ออกมา
    // รูปที่มีอยู่เดิม (จาก Backend) — เก็บเป็น URL string[]
    const [existingImages, setExistingImages] = useState(
        post.postImages ? post.postImages.map((img) => img.url) : []
    );

    // ไฟล์รูปใหม่ที่ผู้ใช้เพิ่ม
    const [newFiles, setNewFiles] = useState([]);
    // Preview URL ของรูปใหม่
    const [newPreviews, setNewPreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    const editPost = usePostStore(state => state.editPost);

    // 👉 จุดที่แก้ไข 2: เปลี่ยนตัวเปรียบเทียบใน hasChanges จาก post.image เป็น post.postImages
    // ตรวจสอบว่ามีการเปลี่ยนแปลงจริง เพื่อ enable/disable ปุ่ม Save
    const hasChanges =
        editContent.trim() !== post.content ||
        newFiles.length > 0 ||
        existingImages.length !== (post.postImages || []).length;

    // เลือกรูปใหม่
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        setNewFiles(prev => [...prev, ...selectedFiles]);
        const previews = selectedFiles.map(f => URL.createObjectURL(f));
        setNewPreviews(prev => [...prev, ...previews]);
        e.target.value = null;
    };

    // ลบรูปใหม่ที่ยังไม่ได้อัปโหลด
    const removeNewImage = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ลบรูปเดิม (URL)
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!editContent.trim() && existingImages.length === 0 && newFiles.length === 0) return;

        try {
            setIsUploading(true);

            let uploadedUrls = [];

            // อัปโหลดรูปใหม่ไป Cloudinary ถ้ามี
            if (newFiles.length > 0) {
                const results = await Promise.all(newFiles.map(f => uploadToCloudinary(f)));
                uploadedUrls = results.filter(url => url !== null);
            }
                
            // รวม URL รูปเดิมที่ยังเหลือ + รูปใหม่
            const allImages = [...existingImages, ...uploadedUrls];

            // ส่งข้อมูลกลับไปให้ store อัปเดต
            await editPost(post.id, { content: editContent, image: allImages });
            onClose();
        } catch (error) {
            console.error('แก้ไขไม่สำเร็จ', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* พื้นหลังคลิกเพื่อปิด */}
            <div className="absolute inset-0" onClick={!isUploading ? onClose : undefined} />

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-xl rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold text-white px-4">Edit Post</h3>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        disabled={isUploading}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E5FF]/50 transition-all resize-none h-32 disabled:opacity-60"
                        placeholder="What's on your mind?"
                    />

                    {/* รูปเดิมจาก post */}
                    {existingImages.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Current Images</p>
                            <div className="flex flex-wrap gap-3">
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative w-24 h-24 group">
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg"
                                            alt={`existing-${index}`}
                                        />
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* รูปใหม่ที่เพิ่ง preview */}
                    {newPreviews.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-500 mb-2">New Images</p>
                            <div className="flex flex-wrap gap-3">
                                {newPreviews.map((url, index) => (
                                    <div key={`new-${index}`} className="relative w-24 h-24 group">
                                        <img
                                            src={url}
                                            className="w-full h-full object-cover rounded-xl border border-[#00E5FF]/30 shadow-lg"
                                            alt={`new-${index}`}
                                        />
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                    {/* ปุ่มเพิ่มรูป */}
                    <button
                        type="button"
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
                    >
                        <Plus size={16} />
                        <span>
                            {newFiles.length > 0 ? `Images (${newFiles.length})` : 'Add Image'}
                        </span>
                    </button>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isUploading}
                            className="px-6 py-2 rounded-full font-bold text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isUploading}
                            className="bg-[#00E5FF] text-black px-6 py-2 rounded-full font-black text-sm hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default EditPostModal;
