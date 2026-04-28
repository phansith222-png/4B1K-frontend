import { create } from "zustand";
import { createCommentApi, createPostApi, deleteCommentApi, deletePostApi, editCommentApi, editPostApi, getAllLikePostApi, getAllPostsApi, likePostApi, unlikePostApi } from "../api/auth";
import useUserStore from "./userStore";

// ─── Helper: merge updated post into list without full refetch ────────────────
const updatePostInList = (posts, postId, updater) =>
    posts.map((p) => (p.id === postId || p._id === postId ? updater(p) : p));

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
        try {
            const resp = await likePostApi(postId);
            // Fetch fresh to get accurate likes array with userIds
            const fresh = await getAllPostsApi();
            if (fresh.data.posts) {
                set({ posts: fresh.data.posts });
            }
            return resp;
        } catch (error) {
            console.error("Like failed:", error);
        }
    },

    unlikePost: async (postId) => {
        try {
            const resp = await unlikePostApi(postId);
            const fresh = await getAllPostsApi();
            if (fresh.data.posts) {
                set({ posts: fresh.data.posts });
            }
            return resp;
        } catch (error) {
            console.error("Unlike failed:", error);
        }
    },

    // ── Create post — optimistic prepend ────────────────────────────────────
    createPost: async (body) => {
        // Optimistic prepend
        const tempId = `temp-post-${Date.now()}`;
        const optimisticPost = {
            id: tempId,
            content: body.content,
            userId: useUserStore.getState().user?.id || useUserStore.getState().user?._id,
            user: useUserStore.getState().user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            postImages: body.image ? body.image.map((url, i) => ({ id: `temp-img-${i}`, url })) : [],
            postArtists: body.selectedArtists
                ? body.selectedArtists.map(a => ({ artistId: Number(a.id), artist: a }))
                : (body.artistIds ? body.artistIds.map(id => ({ artistId: Number(id), artist: { id: Number(id), artistName: 'Loading...' } })) : []),
            likes: [],
            comments: [],
            totalLikes: 0
        };


        set((state) => ({
            posts: [optimisticPost, ...state.posts]
        }));

        try {
            const resp = await createPostApi(body);
            // Refetch to get real IDs and relations
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
                // Optimistically update structures that the UI depends on
                postImages: body.image ? body.image.map((url, i) => ({ id: `temp-${i}`, url })) : p.postImages,
                postArtists: body.selectedArtists
                    ? body.selectedArtists.map(a => ({ artistId: Number(a.id || a._id), artist: a }))
                    : (body.artistIds ? body.artistIds.map(id => ({ artistId: Number(id), artist: { id: Number(id), artistName: 'Loading...' } })) : p.postArtists),
                updatedAt: new Date().toISOString(),
            })),
        }));
        try {
            const resp = await editPostApi(postId, body);
            // Give the backend a moment to process relations before refetching
            // This prevents the "flicker" where tags disappear because the refetch was too fast
            setTimeout(() => {
                get().getAllPosts();
            }, 500);
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