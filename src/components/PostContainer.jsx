import React, { useEffect } from 'react'
import { motion, AnimatePresence, aspectRatio } from 'framer-motion';
import usePostStore from '../stores/postStore';
import { Heart, MessageCircle, MoreHorizontal, Share2, Verified } from 'lucide-react';
import { ActionButton } from '../icon/icon';
import PostItem from './PostItems';


function PostContainer() {
    const getAllPosts = usePostStore(state => state.getAllPosts);
    const posts = usePostStore(state => state.posts);


    console.log('post',posts)
    // ดึงโพสต์ทั้งหมดครั้งแรก
    useEffect(() => {
        getAllPosts();
    }, []);


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