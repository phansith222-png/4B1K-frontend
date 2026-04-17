import axios from 'axios';

const mainapi = axios.create({
  baseURL: 'http://localhost:5000', // มั่นใจว่าตรงกับ Backend
});

mainapi.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        const token = parsedData.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Token parsing error", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
export default mainapi;
