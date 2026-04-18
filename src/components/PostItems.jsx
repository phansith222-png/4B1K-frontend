import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Share2, Verified } from 'lucide-react';
import { ActionButton } from '../icon/icon';
import usePostStore from '../stores/postStore';
import useUserStore from '../stores/userStore';


function PostItem({post,index}) {
    const user = useUserStore(state => state.user)
    const likePost = usePostStore(state => state.likePost)
    const unlikePost = usePostStore(state => state.unlikePost)
    const likeCount = post.likes?.length || 0
    // const currentLikes = usePostStore(state => state.currentLikes) || []
    
    const haveLiked = post.likes?.some(el => el.userId === user.id);
    
    // --- Logic สำหรับเช็คว่าเรา Like หรือยัง ---
    // หมายเหตุ: ตรงนี้ต้องดูว่า Backend ส่งข้อมูลคน Like มาในรูปแบบไหน 
    // ตัวอย่าง: post.Likes คือ array ของคนที่กด like
    // const user = useAuthStore(state => state.user);
    // const haveLiked = post.Like?.some(el => el.userId === user?.id);
   

    const hdlLikeClick = async () => {
        console.log('Post Id',post.id)

        if (haveLiked) {
            await unlikePost(post.id);
        } else {
            await likePost(post.id);
        }
    };

    return (
        <motion.div
            key={post.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden hover:border-white/20 transition-all group shadow-xl"
        >
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <img src={post.user?.avatar} className="w-12 h-12 rounded-full border-2 border-white/10 shadow-md" alt={post.user?.name} />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-base group-hover:text-[#c6ff00] transition-colors">{post.user?.name}</span>
                                {post.user?.verified && <Verified size={16} className="text-[#c6ff00]" />}
                            </div>
                            <span className="text-xs text-gray-500">{post.time}</span>
                        </div>
                    </div>
                    <button className="text-gray-600 hover:text-white p-2 rounded-full hover:bg-white/5">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Post Content */}
                <p className="text-gray-200 mb-4 leading-relaxed font-light text-[15px]">
                    {post.content?.split('*').map((part, i) => i % 2 === 1 ? <b key={i} className="font-bold text-white">{part}</b> : part)}
                </p>

                {post.tag && (
                    <span className="text-[#d000ff] text-xs font-bold bg-[#d000ff]/10 px-3 py-1 rounded-full border border-[#d000ff]/20">
                        #{post.tag}
                    </span>
                )}
            </div>

            {/* Post Image */}
            {post.image && (
                <div className="px-6 mb-4">
                    <img src={post.image} className="w-full h-[350px] object-cover rounded-2xl border border-white/10 shadow-inner" alt="Post content" />
                </div>
            )}

            {/* Post Actions */}
<div className="px-6 py-4 flex justify-between items-center text-gray-400 border-t border-white/5 bg-white/[0.01]">
    <div className="flex gap-6">
        
        {/* ปุ่ม Like (Heart) */}
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

        {/* ปุ่ม Comment */}
        <button 
            type="button"
            className="relative z-30 cursor-pointer flex items-center gap-2.5 transition-colors hover:text-[#c6ff00] group border-none bg-transparent p-1"
        >
            <div className="group-hover:scale-110 transition-transform pointer-events-none">
                <MessageCircle size={18} />
            </div>
            <span className="text-sm font-bold group-hover:text-white pointer-events-none">0</span>
        </button>

    </div>

    {/* ปุ่ม Share */}
    <button 
        type="button"
        className="relative z-30 cursor-pointer flex items-center gap-2.5 transition-colors hover:text-blue-400 group border-none bg-transparent p-1"
    >
        <Share2 size={18} />
    </button>
</div>

        </motion.div>
    );
}

export default PostItem;