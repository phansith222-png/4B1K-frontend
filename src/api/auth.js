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

// User store
export const getProfile = () => mainapi.get('/users/me')
export const editProfile = (body) => mainapi.patch('/users/me',body)

// Artist store
export const getAllArtists = () => mainapi.get('/artists')
export const getArtistsById = (id) => mainapi.get(`/artists/${id}`)