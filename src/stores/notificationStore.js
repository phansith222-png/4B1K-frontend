import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      
      addNotification: (notification) => set((state) => {
        // 🚫 Check if notification for this post already exists to prevent duplicates
        const exists = state.notifications.find(n => n.postId === notification.postId && n.type === notification.type);
        if (exists) return state;

        return {
          notifications: [
            {
              id: Date.now(),
              time: new Date().toISOString(),
              isRead: false,
              ...notification
            },
            ...state.notifications
          ].slice(0, 30) // Keep last 30
        };
      }),
      
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      // 🗑️ Remove by Post ID (Used for Unlike)
      removeNotificationByPostId: (postId, type) => set((state) => ({
        notifications: state.notifications.filter(n => !(n.postId === postId && n.type === type))
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'notification-storage',
    }
  )
);

export default useNotificationStore;
