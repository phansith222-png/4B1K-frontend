import { create } from "zustand";
import { createCommentApi, createPostApi, deleteCommentApi, deletePostApi, editCommentApi, editPostApi, getAllLikePostApi, getAllPostsApi, likePostApi, unlikePostApi } from "../api/auth";

// ─── Helper: merge updated post into list without full refetch ────────────────
const updatePostInList = (posts, postId, updater) =>
    posts.map((p) => (p.id === postId ? updater(p) : p));

const usePostStore = create((set, get) => ({
    posts: [],
    comments: [],
    currentPost: null,
    currentLikes: [],

    // ── Full fetch (initial load only) ──────────────────────────────────────
    getAllPosts: async () => {
        try {
            const resp = await getAllPostsApi();
            set({ posts: resp.data.posts });
            return resp;
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    },

    getAllLikes: async (postId) => {
        try {
            const resp = await getAllLikePostApi(postId);
            set((state) => ({
                posts: updatePostInList(state.posts, postId, (p) => ({
                    ...p,
                    totalLikes: resp.data.totalLikes || 0,
                })),
            }));
            return resp;
        } catch (error) {
            console.error("Failed to get likes:", error);
        }
    },

    // ── Optimistic like/unlike — no full refetch ─────────────────────────────
    likePost: async (postId) => {
        const userId = get().currentLikes?.userId;
        // Optimistic update: add like immediately
        set((state) => ({
            posts: updatePostInList(state.posts, postId, (p) => ({
                ...p,
                likes: [...(p.likes || []), { userId: state._userId }],
            })),
        }));
        try {
            const resp = await likePostApi(postId);
            set({ currentLikes: resp.data });
            // Sync accurate data silently
            const fresh = await getAllPostsApi();
            set({ posts: fresh.data.posts });
            return resp;
        } catch (error) {
            console.error("Like failed:", error);
            // Rollback optimistic update
            get().getAllPosts();
        }
    },

    unlikePost: async (postId) => {
        // Optimistic update: remove like immediately
        set((state) => ({
            posts: updatePostInList(state.posts, postId, (p) => ({
                ...p,
                likes: (p.likes || []).slice(0, -1),
            })),
        }));
        try {
            const resp = await unlikePostApi(postId);
            set({ currentLikes: resp.data });
            const fresh = await getAllPostsApi();
            set({ posts: fresh.data.posts });
            return resp;
        } catch (error) {
            console.error("Unlike failed:", error);
            get().getAllPosts();
        }
    },

    // ── Create post — optimistic prepend ────────────────────────────────────
    createPost: async (body) => {
        try {
            const resp = await createPostApi(body);
            // Fetch to get full post with relations
            const fresh = await getAllPostsApi();
            set({ posts: fresh.data.posts });
            return resp;
        } catch (error) {
            console.error("Create post failed:", error);
        }
    },

    // ── Edit post — optimistic local update ─────────────────────────────────
    editPost: async (postId, body) => {
        // Optimistic update
        set((state) => ({
            posts: updatePostInList(state.posts, postId, (p) => ({
                ...p,
                ...body,
                updatedAt: new Date().toISOString(),
            })),
        }));
        try {
            const resp = await editPostApi(postId, body);
            return resp;
        } catch (error) {
            console.error("Edit post failed:", error);
            get().getAllPosts(); // rollback
        }
    },

    // ── Delete post — optimistic local removal ───────────────────────────────
    deletePost: async (postId) => {
        // Optimistic remove
        set((state) => ({
            posts: state.posts.filter((p) => p.id !== postId),
        }));
        try {
            const resp = await deletePostApi(postId);
            return resp;
        } catch (error) {
            console.error("Delete post failed:", error);
            get().getAllPosts(); // rollback
        }
    },

    // ── Comments ─────────────────────────────────────────────────────────────
    createComment: async (postId, body) => {
        try {
            const resp = await createCommentApi(postId, body);
            // Fetch fresh to get comment with user data
            const fresh = await getAllPostsApi();
            set({ posts: fresh.data.posts });
            return resp;
        } catch (error) {
            console.error("Create comment failed:", error);
        }
    },

    editComment: async (postId, commentId, body) => {
        // Optimistic update
        set((state) => ({
            posts: updatePostInList(state.posts, postId, (p) => ({
                ...p,
                comments: p.comments.map((c) =>
                    c.id === commentId ? { ...c, ...body } : c
                ),
            })),
        }));
        try {
            const resp = await editCommentApi(postId, commentId, body);
            return resp;
        } catch (error) {
            console.error("Edit comment failed:", error);
            get().getAllPosts();
        }
    },

    deleteComment: async (postId, commentId) => {
        // Optimistic remove
        set((state) => ({
            posts: updatePostInList(state.posts, postId, (p) => ({
                ...p,
                comments: p.comments.filter((c) => c.id !== commentId),
            })),
        }));
        try {
            const resp = await deleteCommentApi(postId, commentId);
            return resp;
        } catch (error) {
            console.error("Delete comment failed:", error);
            get().getAllPosts();
        }
    },
}));

export default usePostStore;