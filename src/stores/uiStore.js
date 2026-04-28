import { create } from 'zustand';

const useUIStore = create((set) => ({
    isNavbarVisible: true,
    setNavbarVisible: (visible) => set({ isNavbarVisible: visible }),
    lightboxImages: [], // Array of image URLs
    currentLightboxIndex: 0,
    setLightboxImage: (images, index = 0) => set({ 
        lightboxImages: Array.isArray(images) ? images : [images], 
        currentLightboxIndex: index 
    }),
    nextLightboxImage: () => set((state) => ({
        currentLightboxIndex: (state.currentLightboxIndex + 1) % state.lightboxImages.length
    })),
    prevLightboxImage: () => set((state) => ({
        currentLightboxIndex: (state.currentLightboxIndex - 1 + state.lightboxImages.length) % state.lightboxImages.length
    })),
    closeLightbox: () => set({ lightboxImages: [], currentLightboxIndex: 0 }),
}));

export default useUIStore;
