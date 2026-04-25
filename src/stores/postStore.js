import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createCommentApi, createPostApi, deleteCommentApi, deletePostApi, editCommentApi, editPostApi, getAllLikePostApi, getAllPostsApi, likePostApi, unlikePostApi } from "../api/auth";

const usePostStore = create(
    persist(
        (set,get) => ({
            posts : [],
            comments : [],
            currentPost : null,
            currentLikes : [],
    
    getAllPosts : async () => {
        try {
            console.log('get all posts')
        const resp = await getAllPostsApi()
        set ({ posts : resp.data.posts})
        // console.log('get all poststore',resp)
        console.log('get all posts',resp)
        return resp
        
        }catch(error) {
            console.error("Failed to fetch posts:", error)
        }
    },

    getAllLikes : async (postId) => {
        try {
        const resp = await getAllLikePostApi(postId)

        // console.log('get all like',resp)
        set ((state) => ({
            posts : state.posts.map((post) => post.id === postId ? 
            {...post,totalLikes: resp.data.totalLikes || 0 } : post
        )
        }))

        return resp
        }catch(error) {
        console.dir("Failed to get like", error)
        }
    },

    likePost : async (postId) => {
        try {
            const resp = await likePostApi(postId)
            set ({currentLikes : resp.data})
            get().getAllPosts()

            // console.log(resp)
            return resp

        }catch(error) {
            console.dir('like post fail',error)
        }
    },
    unlikePost : async (postId) => {
        try {
            const resp = await unlikePostApi(postId)
            set ({currentLikes : resp.data})
            get().getAllPosts()
            return resp
        }catch(error) {
            console.dir('unlike Post fail',error)
        }
    },
    createPost : async (body) => {
        try {
            const resp = await createPostApi(body)
            console.log(resp)
            get().getAllPosts()
            return resp
        }catch(error) {
            console.log('create Post fail',error)
        }
    },
    editPost : async (postId,body) => {
        try {
            const resp = await editPostApi(postId,body)
            get().getAllPosts()
            return resp
        }catch(error) {
            console.dir('edit post fail',error)
        }
    },
    deletePost : async (postId) => {
        try {
            const resp = await deletePostApi(postId)
            get().getAllPosts()
            return resp
        }catch(error) {
            console.dir('delete Post fail',error)
        }
    },
    createComment : async (postId,body) => {
        try {
            const resp = await createCommentApi(postId,body)
            get().getAllPosts()
            return resp
        }catch(error) {
            console.log('create post fail',error)
        }
    },
    editComment : async (postId, commentId, body) => {
        try {
            const resp = await editCommentApi(postId, commentId, body)

            // Optimistic update: Update comment in local store immediately
            // So that images and text display without waiting for getAllPosts()
            set((state) => ({
                posts: state.posts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((c) =>
                                c.id === commentId ? { ...c, ...body } : c
                            ),
                          }
                        : post
                ),
            }))

            get().getAllPosts()
            return resp
        }catch (error) {
            console.log('edit comment fail',error)
        }
    },
    deleteComment : async (postId, commentId) => {
        try {
            const resp = await deleteCommentApi(postId, commentId)
            console.log(resp)
            get().getAllPosts()
            return resp
        }catch(error) {
            console.log('delete comment fail',error)
        }
    }
}),

    {
        name : "post-storage"
    }

))

export default usePostStore