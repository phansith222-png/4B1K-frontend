import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAllPostsApi } from "../api/auth";

const usePostStore = create(
    persist(
        (set,get) => ({
            posts : [],
            currentPost : null,
    
    getAllPosts : async () => {
        try {
        const resp = await getAllPostsApi()
        set ({ posts : resp.data.posts})
        console.log('get all poststore',resp)
        return resp
        
        }catch(error) {
            console.error("Failed to fetch posts:", error)
        }
    }
}),
    {
        name : "post-storage"
    }

))

export default usePostStore