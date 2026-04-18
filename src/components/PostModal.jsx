import React from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';

function PostModal({ post, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* พื้นหลังสำหรับกดปิดเมื่อคลิกข้างนอก */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[32px] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header Modal */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-bold text-white px-2">Post</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* เนื้อหาโพสต์ย่อๆ และรายการคอมเมนต์ */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* ต้นฉบับโพสต์ */}
                    <div className="flex gap-4 border-b border-white/5 pb-6">
                        <img src={post.user?.avatar} className="w-10 h-10 rounded-full" alt="" />
                        <div>
                            <span className="font-bold text-sm text-[#c6ff00]">{post.user?.username}</span>
                            <p className="text-gray-300 text-sm mt-1">{post.content}</p>
                        </div>
                    </div>

                    {/* รายการคอมเมนต์ (วนลูปตรงนี้) */}
                    <h3 className="font-bold text-white px-2">Comments</h3>
                    <div className="space-y-4">
                        {post.comments?.length > 0 ? (
                            post.comments.map((comment, id) => (
                                <div key={id} className="flex gap-3 items-start animate-fadeIn">
                                    <img src={comment.user?.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                    <div className="bg-white/5 rounded-2xl p-3 flex-1">
                                        <span className="font-bold text-xs text-pink-300">{comment.user?.username}</span>
                                        <p className="text-gray-200 text-sm mt-0.5">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">ยังไม่มีความคิดเห็น มาเริ่มกันเลย!</div>
                        )}
                    </div>
                </div>

                {/* ช่องกรอกคอมเมนต์ด้านล่าง */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            placeholder="เขียนความคิดเห็นของคุณ..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm text-white focus:outline-none focus:border-pink-500/50 transition-all"
                        />
                        <button className="absolute right-2 p-2 text-pink-500 hover:text-pink-400 transition-colors">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default PostModal;