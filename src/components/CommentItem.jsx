import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2, Loader2, ImageIcon, X } from 'lucide-react';
import usePostStore from '../stores/postStore';
import useUserStore from '../stores/userStore';
import DeleteConfirmModal from './DeleteConfirmModal';
import { uploadToCloudinary } from '../utils/uploadCloud';

// ── CommentItem ──
function CommentItem({ comment, postId }) {
  const editComment = usePostStore((state) => state.editComment);
  const deleteComment = usePostStore((state) => state.deleteComment);
  const currentUser = useUserStore((state) => state.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editText, setEditText] = useState(comment.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // image state สำหรับ edit mode
  const [editImageFile, setEditImageFile] = useState(null);       // ไฟล์ใหม่ที่เลือก
  const [editImagePreview, setEditImagePreview] = useState(null); // preview URL
  const [keepExistingImage, setKeepExistingImage] = useState(true); // เก็บรูปเดิมไว้ไหม

  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // เปรียบเทียบเป็น String เพื่อแก้ปัญหา type mismatch (number vs string)
  const commentUserId = comment.user?.id ?? comment.user?._id ?? comment.userId;
  const myId = currentUser?.id ?? currentUser?._id;
  const isOwner = Boolean(myId && commentUserId && String(commentUserId) === String(myId));

  const isEdited = comment.createdAt !== comment.updatedAt;

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // cleanup ObjectURL
  useEffect(() => {
    return () => {
      if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    };
  }, [editImagePreview]);

  // เปิด edit mode → reset state ให้ตรงกับค่าเดิมของ comment
  const openEditMode = () => {
    setEditText(comment.content || '');
    setEditImageFile(null);
    setEditImagePreview(null);
    setKeepExistingImage(true);
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดรูปภาพต้องไม่เกิน 5MB');
      return;
    }
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
    e.target.value = null;
  };

  const removeNewImage = () => {
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEdit = async () => {
    if (!editText.trim() && !editImageFile && !keepExistingImage) return;
    try {
      setIsSaving(true);

      let finalImageUrl = null;

      if (editImageFile) {
        // อัปโหลดรูปใหม่ไป Cloudinary
        finalImageUrl = await uploadToCloudinary(editImageFile);
        if (!finalImageUrl) throw new Error('อัปโหลดรูปภาพไม่สำเร็จ');
      } else if (keepExistingImage && comment.image) {
        // คงรูปเดิมไว้
        finalImageUrl = comment.image;
      }
      // ถ้า keepExistingImage = false และไม่มีรูปใหม่ → finalImageUrl = null (ลบรูปออก)

      await editComment(postId, comment.id, {
        content: editText.trim(),
        image: finalImageUrl,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Edit comment failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(postId, comment.id);
      console.log(postId,comment.id)

      setShowDeleteModal(false);
    } catch (err) {
      console.error('Delete comment failed:', err);
      setIsDeleting(false);
    }
  };

  // ตรวจว่ามีการเปลี่ยนแปลงจริง เพื่อ enable ปุ่ม Save
  const hasChanges =
    editText.trim() !== (comment.content || '') ||
    editImageFile !== null ||
    (comment.image && !keepExistingImage);


    //เอาเวลาออกมา
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

  return (
    <>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmModal
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>

      <div className="flex gap-3 items-start group">
        <img
          src={
            comment.user?.profileImage ||
            comment.user?.avatar ||
            `https://ui-avatars.com/api/?name=${comment.user?.username || 'User'}&background=random&color=fff`
          }
          className="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0 mt-1"
          alt={comment.user?.username || 'User Avatar'}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            // ── Edit mode ──
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-[#00E5FF]/20 rounded-2xl px-4 py-3"
            >
              <span className="font-bold text-xs text-pink-300 block mb-2">
                {comment.user?.username || 'Anonymous'}
              </span>

              {/* Textarea */}
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                disabled={isSaving}
                rows={2}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEdit(); }
                  if (e.key === 'Escape') { setIsEditing(false); }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]/50 resize-none disabled:opacity-50 transition-all"
                placeholder="แก้ไขความคิดเห็น..."
              />

              {/* รูปเดิม (ถ้ามี) */}
              {comment.image && keepExistingImage && !editImageFile && (
                <div className="relative mt-2 w-24 h-24">
                  <img
                    src={comment.image}
                    alt="current"
                    className="w-full h-full object-cover rounded-xl border border-white/10"
                  />
                  {!isSaving && (
                    <button
                      type="button"
                      onClick={() => setKeepExistingImage(false)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}

              {/* Preview รูปใหม่ */}
              {editImagePreview && (
                <div className="relative mt-2 w-24 h-24">
                  <img
                    src={editImagePreview}
                    alt="new preview"
                    className="w-full h-full object-cover rounded-xl border border-[#00E5FF]/40"
                  />
                  {!isSaving && (
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )}

              {/* Input file ซ่อน */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {/* Actions row */}
              <div className="flex items-center justify-between mt-3">
                {/* ปุ่มเพิ่มรูป */}
                <button
                  type="button"
                  onClick={() => !isSaving && fileInputRef.current?.click()}
                  disabled={isSaving}
                  title="แนบรูปภาพ (สูงสุด 5MB)"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors disabled:opacity-40 ${
                    editImageFile
                      ? 'text-[#00E5FF] bg-[#00E5FF]/10'
                      : 'text-gray-400 hover:text-[#00E5FF] hover:bg-white/5'
                  }`}
                >
                  <ImageIcon size={14} />
                  {editImageFile ? 'Change image' : 'Add image'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsEditing(false); }}
                    disabled={isSaving}
                    className="px-4 py-1.5 text-xs text-gray-400 hover:text-white rounded-full border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={isSaving || !hasChanges}
                    className="px-4 py-1.5 text-xs bg-[#00E5FF] text-black font-bold rounded-full hover:bg-white transition-colors disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {isSaving && <Loader2 size={12} className="animate-spin" />}
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // ── Normal mode ──
            <div className="relative">
              <div className="bg-white/5 rounded-2xl p-3 pr-8">
                <span className="font-bold text-xs text-pink-300">
                  {comment.user?.username || 'Anonymous'}
                </span>

                {/* 👇 2. นำโค้ดเวลามาวางตรงนี้ (แทรกระหว่าง ชื่อ กับ ข้อความ) 👇 */}
              <span className="text-[10px] text-gray-500 flex items-center gap-1 mb-1.5 mt-0.5">
                {isEdited ? (
                  // ถ้าถูก Edit ให้โชว์ updatedAt เป็นวันและเวลา
                  <span className="italic">
                    Edited : {formatDateTime(comment.updatedAt)}
                  </span>
                ) : (
                  // ถ้ายังไม่ถูก Edit ให้โชว์ createdAt เป็น TimeAgo หรือ วันและเวลา
                  <span className="italic">
                    {formatDateTime(comment.createdAt)}
                  </span>
                )}
              </span>

                {comment.content && (
                  <p className="text-gray-200 text-sm mt-0.5 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                )}
                {comment.image && (
                  <img
                    src={comment.image}
                    alt="comment attachment"
                    className="mt-2 rounded-xl border border-white/10 max-h-96 object-contain bg-black/10 w-full"
                  />
                )}
              </div>

              {/* ── 3-dot button (owner only) ── */}
              {isOwner && (
                <div className="absolute top-2 right-2" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className={`p-1.5 rounded-full transition-colors ${
                      menuOpen
                        ? 'text-white bg-white/15'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title="More options"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.88, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: -6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-8 z-50 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-44 py-1"
                      >
                        {/* Edit */}
                        <button
                          onClick={openEditMode}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-white/5 hover:text-[#00E5FF] transition-colors"
                        >
                          <div className="p-1 bg-white/5 rounded-lg">
                            <Pencil size={13} />
                          </div>
                          Edit
                        </button>

                        <div className="mx-3 border-t border-white/5" />

                        {/* Delete */}
                        <button
                          onClick={() => { setMenuOpen(false); setShowDeleteModal(true); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <div className="p-1 bg-red-500/10 rounded-lg">
                            <Trash2 size={13} />
                          </div>
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CommentItem;
