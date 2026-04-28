import { create } from 'zustand';

const useUIStore = create((set) => ({
    isNavbarVisible: true,
    setNavbarVisible: (visible) => set({ isNavbarVisible: visible }),
}));

export default useUIStore;
