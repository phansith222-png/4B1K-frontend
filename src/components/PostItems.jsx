import React, { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Verified,
} from "lucide-react";
import { ActionButton } from "../icon/SidebarIcons";
import usePostStore from "../stores/postStore";
import useUserStore from "../stores/userStore";
import { useState } from "react";
import PostModal from "./PostModal";
import EditPostModal from "./EditPostModal";
import TimeAgo from 'react-timeago'

function PostItemInner({ post, index }) {
  const user = useUserStore((state) => state.user);
  const likePost = usePostStore((state) => state.likePost);
  const unlikePost = usePostStore((state) => state.unlikePost);
  const deletePost = usePostStore((state) => state.deletePost);

//   console.log(post)
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  // const currentLikes = usePostStore(state => state.currentLikes) || []

  const myId = user?.id || user?._id;
  const haveLiked = post.likes?.some((el) => el.userId === myId);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isEdited = post.createdAt !== post.updatedAt;

  const hdlLikeClick = async () => {
    // console.log('Post Id',post.id)

    if (haveLiked) {
      await unlikePost(post.id);
    } else {
      await likePost(post.id);
    }
  };

  const hdlDeletePost = async () => {
    await deletePost(post.id);
  };

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
  // Result: "22 Apr 2026, 17:35"
};

  return (
    <>
      <motion.div
        key={post.id}
        layout={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
        className="bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all group shadow-xl"
      >
        {/* Post Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  post.user?.profileImage ||
                  post.user?.avatar ||
                  `https://ui-avatars.com/api/?name=${post.user?.username || "User"}&background=random&color=fff`
                }
                className="w-10 h-10 rounded-full border border-white/10 object-cover shrink-0 shadow-sm"
                alt={post.user?.username || "User Avatar"}
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base group-hover:text-[#00E5FF] transition-colors">
                    {post.user?.username}
                  </span>
                  {post.user?.verified && (
                    <Verified size={16} className="text-[#00E5FF]" />
                  )}
                </div>

          {/* 👇 Adjust time display here 👇 */}
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  {isEdited ? (
                    // If edited, show updatedAt as date and time
                    <span className="italic">
                      Edited : {formatDateTime(post.updatedAt)}
                    </span>
                  ) : (
                    // If not edited, show createdAt
                    <span className="italic">
                      {formatDateTime(post.createdAt)}
                    </span>
                  )}
                </span>

              </div>
            </div>

            {/* ปุ่ม จุด 3 จุด */}
            {(user?.id === post.userId || user?._id === post.userId) && (
            {/* 3-dot menu button */}
            {user?.id === post.userId && (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu
                  className="text-gray-500 group-hover:text-[#00E5FF] transition p-2 rounded-full bg-white/5 hover:scale-110"
                >
                  <MoreHorizontal size={20} />
                </button>

                {/* --- Dropdown Menu --- */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setIsEditPostOpen(true); // Open Edit Modal
                          setIsMenuOpen(false); // Close menu after click
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        Edit Post
                      </button>

                      <button
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setIsMenuOpen(false); // Open confirm modal
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        Delete Post
                      </button>

                      <AnimatePresence>
                        {isModalOpen && (
                          <PostModal
                            post={post}
                            onClose={() => setIsModalOpen(false)}
                          />
                        )}
                      </AnimatePresence>

                      {/* 👇 Add Modal for Edit here 👇 */}
                      <AnimatePresence>
                        {isEditPostOpen && (
                          <EditPostModal
                            post={post}
                            onClose={() => setIsEditPostOpen(false)}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Post Content */}
          <p className="text-gray-200 mb-4 leading-relaxed font-light text-[15px]">
            {post.content?.split("*").map((part, i) =>
              i % 2 === 1 ? (
                <b key={i} className="font-bold text-white">
                  {part}
                </b>
              ) : (
                part
              ),
            )}
          </p>

          {post.tag && (
            <span className="text-[#d000ff] text-xs font-bold bg-[#d000ff]/10 px-3 py-1 rounded-full border border-[#d000ff]/20">
              #{post.tag}
            </span>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Artist Tags (from postArtists) */}
            {post.postArtists?.map((item) => (
              <span
                key={item.artistId}
                className="text-[#00E5FF] text-xs w-fit font-bold bg-[#7C4DFF]/10 px-3 py-1 rounded-full border border-[#7C4DFF]/20 flex items-center gap-1"
              >
                🎤 {item.artist?.artistName}
              </span>
            ))}
          </div>
        </div>

        {/* Post Images (Multiple) */}
        {post.postImages && post.postImages.length > 0 && (
          <div
            className={`px-6 mb-4 grid gap-2 ${
              post.postImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {post.postImages.map((el, idx) => (
              <div
                key={el.id || idx}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${
                  post.postImages.length === 1 ? 'min-h-[200px] max-h-[500px]' : 'h-[150px] sm:h-[200px]'
                }`}
              >
                <img
                  src={el.url}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                  alt={`Post content ${idx}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Post Actions */}
        <div className="px-6 py-4 flex justify-between items-center text-gray-400 border-t border-white/5 bg-white/[0.01]">
          <div className="flex gap-6">
            {/* Like Button */}
            <button
              type="button"
              onClick={hdlLikeClick}
              className="relative z-30 cursor-pointer flex items-center gap-2.5 transition-colors hover:text-red-500 group border-none bg-transparent p-1"
            >
              <div className="group-hover:scale-110 transition-transform pointer-events-none">
                <Heart
                  size={18}
                  className={haveLiked ? "fill-red-500 text-red-500" : ""}
                />
              </div>
              <span className="text-sm font-bold group-hover:text-white pointer-events-none">
                {likeCount.toLocaleString()}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="relative z-30 cursor-pointer flex items-center gap-2.5 transition-colors hover:text-[#00E5FF] group border-none bg-transparent p-1"
            >
              <div className="group-hover:scale-110 transition-transform pointer-events-none">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm font-bold group-hover:text-white pointer-events-none">
                {commentCount.toLocaleString()}
              </span>
            </button>
          </div>

        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <PostModal post={post} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditPostOpen && (
          <EditPostModal post={post} onClose={() => setIsEditPostOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#1a1a1a] border border-white/10 p-8 rounded-[32px] max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-red-500 fill-red-500" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Delete Post?
              </h3>
              <p className="text-gray-400 mb-8 font-light">
                Are you sure you want to delete this post?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-2xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await hdlDeletePost();
                    setIsDeleteModalOpen(false);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Custom comparator: only re-render when the post's own data changes
const PostItem = memo(PostItemInner, (prev, next) => {
    return (
        prev.post.id === next.post.id &&
        prev.post.likes?.length === next.post.likes?.length &&
        prev.post.comments?.length === next.post.comments?.length &&
        prev.post.content === next.post.content &&
        prev.post.updatedAt === next.post.updatedAt
    );
});

export default PostItem;
