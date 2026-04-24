import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Send, ImageIcon, Loader2 } from "lucide-react";
import usePostStore from "../stores/postStore";
import useUserStore from "../stores/userStore";
import { uploadToCloudinary } from "../utils/uploadCloud";
import CommentItem from "./CommentItem";

// ── PostModal ──
function PostModal({ post, onClose }) {
  // ดึง post แบบ live จาก store เพื่อให้ comments อัปเดตทันที
  const livePost = usePostStore(
    (state) => state.posts.find((p) => p.id === post.id) || post
  );
  const createComment = usePostStore((state) => state.createComment);
  const currentUser = useUserStore((state) => state.user);

  const [commentText, setCommentText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const isEdited = post.createdAt !== post.updatedAt;

    const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }); 
  // ผลลัพธ์: "22 Apr 2026, 17:35"
};

  // Cleanup ObjectURL เมื่อปิด Modal
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ขนาดรูปภาพต้องไม่เกิน 5MB");
        return;
      }
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
    e.target.value = null;
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!commentText.trim() && !selectedFile) return;
    try {
      setIsSubmitting(true);
      let uploadedImageUrl = null;
      if (selectedFile) {
        uploadedImageUrl = await uploadToCloudinary(selectedFile);
        if (!uploadedImageUrl) throw new Error("อัปโหลดรูปภาพไม่สำเร็จ");
      }
      await createComment(livePost.id, {
        content: commentText.trim(),
        image: uploadedImageUrl,
      });
      setCommentText("");
      handleRemoveImage();
    } catch (error) {
      console.error("Comment failed:", error);
      alert("เกิดข้อผิดพลาดในการส่งคอมเมนต์");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* พื้นหลังสำหรับกดปิดเมื่อคลิกข้างนอก */}
      <div className="absolute inset-0" onClick={!isSubmitting ? onClose : undefined} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
          <h3 className="font-bold text-white px-2">Post</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>


        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* ต้นฉบับโพสต์ */}
          <div className="flex gap-4 border-b border-white/5 pb-6">
            <img
              src={
                livePost.user?.profileImage ||
                livePost.user?.avatar ||
                `https://ui-avatars.com/api/?name=${livePost.user?.username || "User"}&background=random&color=fff`
              }
              className="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0"
              alt={livePost.user?.username || "User Avatar"}
            />
            <div>
              <span className="font-bold text-sm text-[#00E5FF]">
                {livePost.user?.username}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                  {isEdited ? (
                    // ถ้าถูก Edit ให้โชว์ updatedAt เป็นวันและเวลา
                    <span className="italic">
                      Edited : {formatDateTime(post.updatedAt)}
                    </span>
                  ) : (
                    // ถ้ายังไม่ถูก Edit ให้โชว์ createdAt เป็น TimeAgo เหมือนเดิม
                    <span className="italic">
                      {formatDateTime(post.createdAt)}
                    </span>
                  )}
                </span>
              <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap break-words">
                {livePost.content}
              </p>
            </div>

          
          </div>


          {/* รูปภาพของโพสต์ */}
          {livePost.postImages && livePost.postImages.length > 0 && (
            <div
              className={`grid gap-2 ${
                livePost.postImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {livePost.postImages.map((el, idx) => (
                <img
                  key={el.id || idx}
                  src={el.url}
                  className={`w-full object-contain bg-black/20 rounded-2xl border border-white/10 shadow-inner ${
                    livePost.postImages.length === 1
                      ? "h-auto max-h-[500px]"
                      : "h-[150px] sm:h-[200px]"
                  }`}
                  alt={`Post content ${idx}`}
                />
              ))}

            </div>
          )}

          {/* รายการ Comments */}
          <h3 className="font-bold text-white px-2">
            Comments{" "}
            {livePost.comments?.length > 0 && (
              <span className="text-gray-500 font-normal text-sm">
                ({livePost.comments.length})
              </span>
            )}
          </h3>
          <div className="space-y-4">
            {livePost.comments?.length > 0 ? (
              livePost.comments.map((comment, idx) => (
                <CommentItem
                  key={comment.id || idx}
                  comment={comment}
                  postId={livePost.id}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                ยังไม่มีความคิดเห็น มาเริ่มกันเลย! 💬
              </div>
            )}
          </div>
        </div>

        {/* ช่องกรอกคอมเมนต์ */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex flex-col gap-3 shrink-0">

          {/* Preview รูปที่แนบ */}
          {imagePreview && (
            <div className="relative w-20 h-20 ml-2">
              <img src={imagePreview} className="w-full h-full object-cover rounded-xl border border-white/10" alt="preview" />
              <button
                onClick={handleRemoveImage}
                disabled={isSubmitting}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10 disabled:opacity-50"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            {/* ปุ่มเลือกรูปภาพ */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className={`p-2.5 rounded-full transition-colors shrink-0 ${
                imagePreview
                  ? "text-[#00E5FF] bg-[#00E5FF]/10"
                  : "text-gray-400 hover:text-[#00E5FF] hover:bg-white/5"
              } disabled:opacity-50`}
              title="แนบรูปภาพ (สูงสุด 5MB)"
            >
              <ImageIcon size={20} />
            </button>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="เขียนความคิดเห็นของคุณ..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all disabled:opacity-50"
            />

            {/* ปุ่มส่ง */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!commentText.trim() && !selectedFile)}
              className="absolute right-2 p-2 text-pink-500 hover:text-pink-400 transition-colors disabled:opacity-50 disabled:hover:text-pink-500"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PostModal;
