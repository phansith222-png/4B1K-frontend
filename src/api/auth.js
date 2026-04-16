import axios from "axios";
import useUserStore from "../stores/userStore";

export const mainapi = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type' : 'application/json'
    }
})

mainapi.interceptors.request.use( config => {
  const token = useUserStore.getState().token
  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const getAllPostsApi = () => mainapi.get('/posts')