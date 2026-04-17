import axios from 'axios';

const API_URL = 'http://localhost:5000'; // เปลี่ยนพอร์ตให้ตรงกับ Backend

export const getAllArtists = async () => {
  const response = await axios.get(`${API_URL}/artists`);
  return response.data;
};

export const getArtistById = async (id) => {
  const response = await axios.get(`${API_URL}/artists/${id}`);
  return response.data;
};

export const getSongsByArtist = async (id) => {
  const response = await axios.get(`${API_URL}/artists/${id}/songs`);
  return response.data;
};

export const getEventsByArtist = async (id) => {
  const response = await axios.get(`${API_URL}/artists/${id}/events`);
  return response.data;
};