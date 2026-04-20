import axios from 'axios';

const API_URL = 'http://localhost:5000'; // ปรับใหตรงกับ Backend ของคุณ

export const getAllEvents = async () => {
    try {
        // ดึง Token จาก LocalStorage (เช็คชื่อ Key ให้ตรงกับที่คุณเซฟไว้ เช่น 'token' หรือ 'accessToken')
        const token = localStorage.getItem('token'); 

        const response = await axios.get(`${API_URL}/events`, {
            headers: {
                Authorization: `Bearer ${token}` // 📌 แนบ Token ไปด้วย
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all events:", error);
        throw error;
    }
};

export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        throw error;
    }
};