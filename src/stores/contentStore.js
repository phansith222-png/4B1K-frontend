import { create } from "zustand";
import axios from 'axios';
import { getAllArtists, getArtistsById } from "../api/auth";
import { toast } from "react-toastify";

const useContentStore = create((set, get) => ({
  // --- States ---
  artists: [],
  currentArtist: null,
  
  loading: false,
  error: null,

  // --- Actions for Artists ---
  getAllArtists: async () => {
    set({ loading: true , error: null});
    try {
      const res = await getAllArtists();
      // console.log('res', res.data.artists)
      set({ artists: res.data.artists, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error("Failed to load artists data"); // Alert if API fails
    }
  },

  getArtistsById: async (artistId) => {
    set({ loading: true, error: null });
    try {
      const res = await getArtistsById(artistId);
      console.log('res', res)
      // const artistData = res.data.artist || res.data.result || res.data;
      // set({ currentArtist: artistData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  // Helper: Clear Error or Reset Data
  clearError: () => set({ error: null }),
  resetCurrents: () => set({ currentArtist: null, currentEvent: null, currentNews: null })
}));

export default useContentStore;