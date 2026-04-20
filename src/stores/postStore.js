import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPostApi, deletePostApi, editPostApi, getAllLikePostApi, getAllPostsApi, likePostApi, unlikePostApi } from "../api/auth";

const usePostStore = create(
    persist(
        (set,get) => ({
            posts : [],
            currentPost : null,
            currentLikes : [],
    
    getAllPosts : async () => {
        try {
        const resp = await getAllPostsApi()
        set ({ posts : resp.data.posts})
        // console.log('get all poststore',resp)
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
            set (state => ({
            posts : [{...resp.data.post,
                user:useUserStore.getState().user,
                likes:[],
                comments:[],
                postArtists:[]
                },...state.posts]
        }))

        }catch(error) {
            console.dir('unlike Post fail',error)
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
    }
}),
    {
        name : "post-storage"
    }

))

export default usePostStore