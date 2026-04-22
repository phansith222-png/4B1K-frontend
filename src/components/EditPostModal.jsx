// ไฟล์: src/components/EditPostModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import usePostStore from '../stores/postStore';
// import usePostStore from '../stores/postStore';

function EditPostModal({ post, onClose }) {
    // กำหนดค่าเริ่มต้นในช่อง textarea ให้เป็นข้อความเดิมของโพสต์
    const [editContent, setEditContent] = useState(post.content);
    const editPost = usePostStore(state => state.editPost)

    const handleSave = async () => {
        if (!editContent.trim()) return;

        try {
            await editPost(post.id,{content : editContent})
            console.log(post.id,editContent)
            onClose(); // บันทึกเสร็จให้ปิด Modal
        } catch (error) {
            console.error("แก้ไขไม่สำเร็จ", error);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* พื้นหลังคลิกเพื่อปิด */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-xl rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold text-white px-4">Edit Post</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Textarea) */}
                <div className="p-6">
                    <textarea 
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#c6ff00]/50 transition-all resize-none h-32"
                        placeholder="What's on your mind?"
                    />
                </div>

                {/* Footer (Action Buttons) */}
                <div className="p-4 border-t border-white/5 flex justify-end gap-3 bg-white/[0.01]">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-full font-bold text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!editContent.trim() || editContent === post.content} // ปิดปุ่มถ้าไม่ได้พิมพ์อะไร หรือข้อความเหมือนเดิมเป๊ะ
                        className="bg-[#c6ff00] text-black px-6 py-2 rounded-full font-black text-sm hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default EditPostModal;