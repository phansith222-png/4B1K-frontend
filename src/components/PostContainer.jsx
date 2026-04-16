import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import usePostStore from '../stores/postStore';
import { Heart, MessageCircle, MoreHorizontal, Share2, Verified } from 'lucide-react';
import { ActionButton } from '../icon/icon';


function PostContainer() {

    const getAllPosts = usePostStore(state => state.getAllPosts) || null
    const posts = usePostStore(state => state.posts)

    useEffect(() => {
        getAllPosts()
    },[])

    if (!posts || posts.length === 0) {
        return <div className="text-gray-500 text-center py-10">กำลังโหลดข้อมูล...</div>;
    }

  return (
    <>
<div className="flex flex-col gap-6">
            <AnimatePresence>
                {/* วนลูป posts.map ตรงนี้ 
                  และ return หน้าตาการ์ด <motion.div> ออกมาทันที 
                */}
                {posts.map((post, index) => (
                    <motion.div 
                        key={post.id || index} // อย่าลืมใส่ key ให้ element ตัวแรกสุดในลูปเสมอ
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
                                <ActionButton icon={<Heart size={18} />} label={post.likes?.toLocaleString()} hoverColor="hover:text-red-500" />
                                <ActionButton icon={<MessageCircle size={18} />} label={post.comments?.toLocaleString()} hoverColor="hover:text-[#c6ff00]" />
                            </div>
                            <ActionButton icon={<Share2 size={18} />} hoverColor="hover:text-blue-400" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
     
    </>
  )
}

export default PostContainer