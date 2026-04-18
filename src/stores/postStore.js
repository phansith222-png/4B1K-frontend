import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllLikePostApi, getAllPostsApi } from "../api/auth";

const usePostStore = create(
    persist(
        (set,get) => ({
            posts : [],
            currentPost : null,
            likes : [],
    
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

        console.log('get all like',resp)
        set ((state) => ({
            posts : state.posts.map((post) => post.id === postId ? 
            {...post,totalLikes: resp.data.totalLikes || 0 } : post
        )
        }))

        return resp
        }catch(error) {
        console.error("Failed to get like", error)
        }
    }
}),
    {
        name : "post-storage"
    }

))

export default usePostStore