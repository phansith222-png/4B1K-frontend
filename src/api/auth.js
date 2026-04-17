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

export default mainapi;