import { create } from "zustand";
import axios from 'axios';
import { getAllArtists, getArtistById } from "../api/artist";
import { toast } from "react-toastify";

const useContentStore = create((set, get) => ({
  // --- States ---
  artists: [],
  currentArtist: null,
  
  loading: false,
  error: null,

  // --- Actions for Artists (ข้อ 17-23) ---
  getAllArtists: async () => {
    set({ loading: true , error: null});
    try {
      const res = await getAllArtists();
      // console.log('res', res.data.artists)
      set({ artists: res.data.artists, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error("ไม่สามารถโหลดข้อมูลศิลปินได้"); // แจ้งเตือนถ้า API พัง
    }
  },

  getArtistsById: async (artistId) => {
    set({ loading: true, error: null });
    try {
      const res = await getArtistById(artistId);
      console.log('res', res)
      // const artistData = res.data.artist || res.data.result || res.data;
      // set({ currentArtist: artistData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  // Helper: ล้างค่า Error หรือ Reset ข้อมูล
  clearError: () => set({ error: null }),
  resetCurrents: () => set({ currentArtist: null, currentEvent: null, currentNews: null })
}));

export default useContentStore;