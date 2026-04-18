import React, { useEffect } from 'react'
import { motion, AnimatePresence, aspectRatio } from 'framer-motion';
import usePostStore from '../stores/postStore';
import { Heart, MessageCircle, MoreHorizontal, Share2, Verified } from 'lucide-react';
import { ActionButton } from '../icon/icon';
import PostItem from './PostItems';


function PostContainer() {
    const getAllPosts = usePostStore(state => state.getAllPosts);
    const posts = usePostStore(state => state.posts);
    const getAllLikes = usePostStore(state => state.getAllLikes);

    console.log('post',posts)
    // ดึงโพสต์ทั้งหมดครั้งแรก
    useEffect(() => {
        getAllPosts();
    }, []);

    // เมื่อมีโพสต์มาแล้ว ให้ไปดึง Like ของแต่ละอัน
    useEffect(() => {
        if (posts && posts.length > 0) {
            posts.forEach((post) => {
                // ดึง Like เฉพาะอันที่ยังไม่ได้ดึง totalLikes มา
                if (post.id && post.totalLikes === undefined) {
                    getAllLikes(post.id);
                }
            });
        }
    }, []); // รันเมื่อจำนวนโพสต์เปลี่ยน

    if (!posts || posts.length === 0) {
        return <div className="text-gray-500 text-center py-10">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <AnimatePresence>
                {posts.map((post, index) => (
                    <PostItem
                        key={post.id || index} 
                        post={post} 
                        index={index} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default PostContainer;