import mainapi from './auth';

export const getAllArtists = async () => {
  const response = await mainapi.get('/artists');
  return response.data;
};

export const getArtistById = async (id) => {
  const response = await mainapi.get(`/artists/${id}`);
  return response.data;
};

export const getSongsByArtist = async (id) => {
  const response = await mainapi.get(`/artists/${id}/songs`);
  return response.data;
};

export const getEventsByArtist = async (id) => {
  const response = await mainapi.get(`/artists/${id}/events`);
  return response.data;
};