import React, { useEffect } from 'react'
import { motion, AnimatePresence, aspectRatio } from 'framer-motion';
import usePostStore from '../stores/postStore';
import { Heart, MessageCircle, MoreHorizontal, Share2, Verified } from 'lucide-react';
import { ActionButton } from '../icon/SidebarIcons';
import PostItem from './PostItems';


function PostContainer({ activeTab, selectedArtistIds }) {
    const getAllPosts = usePostStore(state => state.getAllPosts);
    const posts = usePostStore(state => state.posts);
    const [visibleCount, setVisibleCount] = React.useState(5);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);

    useEffect(() => {
        getAllPosts();
    }, [getAllPosts]);

    // Reset count when tab or artist changes
    useEffect(() => {
        setVisibleCount(5);
    }, [activeTab, selectedArtistIds]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Simulate a small network delay for premium feel
        setTimeout(() => {
            setVisibleCount(prev => prev + 5);
            setIsLoadingMore(false);
        }, 800);
    };

    const filteredPosts = React.useMemo(() => {
        if (!posts) return [];

        let result = posts;

        // Filter by selected artist tags if active
        if (selectedArtistIds && selectedArtistIds.length > 0) {
            result = result.filter(post =>
                post.postArtists?.some(pa => selectedArtistIds.includes(pa.artistId))
            );
        }

        switch (activeTab) {
            case 'Reviews':
                result = result.filter(post => post.postArtists && post.postArtists.length > 0);
                break;
            case 'Photos':
                result = result.filter(post => post.postImages && post.postImages.length > 0);
                break;
            case 'All':
            default:
                break;
        }
        return result;
    }, [posts, activeTab, selectedArtistIds]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);

    if (!posts || posts.length === 0) {
        return <div className="text-gray-500 text-center py-10 italic">Loading community vibes...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
                {visiblePosts.map((post, index) => (
                    <PostItem
                        key={post.id || index}
                        post={post}
                        index={index}
                    />
                ))}
            </AnimatePresence>

            {filteredPosts.length > visibleCount && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-4 pb-8 flex justify-center"
                >
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="group relative px-10 py-3 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/[0.08] hover:border-[#00E5FF]/40 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center overflow-hidden"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00E5FF]/10 to-[#7C4DFF]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                        <div className="relative z-10 flex items-center gap-3">
                            {isLoadingMore ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Vibes are Loading...</span>
                                </>
                            ) : (
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                                    Load More Vibes
                                </span>
                            )}
                        </div>
                    </button>
                </motion.div>
            )}

            {filteredPosts.length === 0 && (
                <div className="text-gray-500 text-center py-20 bg-white/[0.02] rounded-[32px] border border-white/5 border-dashed">
                    No posts found in this category.
                </div>
            )}
        </div>
    );
}




export default PostContainer;
