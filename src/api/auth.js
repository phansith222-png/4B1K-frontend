import axios from 'axios';
import useUserStore from '../stores/userStore';
import { id } from 'zod/v4/locales';

const mainapi = axios.create({
  baseURL: 'http://localhost:5000', // ตรวจสอบว่าตรงกับ Backend port 5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor: ใส่ Token ก่อนส่ง Request ---
mainapi.interceptors.request.use(
  (config) => {
    // ดึง token จาก Zustand Store โดยตรง (วิธีที่ปลอดภัยและแม่นยำที่สุด)
    const token = useUserStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor: จัดการ Error เช่น Token หมดอายุ ---
mainapi.interceptors.response.use(
  (response) => response,
  (error) => {
    // ถ้า Backend ตอบกลับมาว่า 401 (Unauthorized) 
    // อาจหมายถึง Token หมดอายุ หรือไม่ถูกต้อง
    if (error.response && error.response.status === 401) {
      console.error("Session expired or unauthorized. Logging out...");
      // คุณสามารถเรียก function logout จาก store ตรงนี้ได้เลย
      // useUserStore.getState().logout(); 
    }
    return Promise.reject(error);
  }
);

// --- API Methods ---
// get all post
export const getAllPostsApi = () => mainapi.get('/posts')
// get all like
export const getAllLikePostApi = (postId) => mainapi.get(`/posts/${postId}/like`)
// like post
export const likePostApi = (postId) => mainapi.post(`/posts/${postId}/like`)
// unlike post
export const unlikePostApi = (postId) => mainapi.delete(`/posts/${postId}/like`)

// User store
export const getProfile = () => mainapi.get('/users/me')
export const editProfile = (body) => mainapi.patch('/users/me',body)
// Artist 관련 (Artist Store)
export const getAllArtists = () => mainapi.get('/artists');
export const getArtistsById = (id) => mainapi.get(`/artists/${id}`);

export default mainapi;