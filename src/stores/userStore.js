import { create } from "zustand";
import { persist } from "zustand/middleware";
import { editProfile, getProfile } from "../api/auth";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,


      setUser: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: !!user,
        }),
      setTokenOnly: (token) =>
        set({
          token,
          isAuthenticated: false, // Don't enable auth status until Profile is successfully fetched
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),


      getProfile: async () => {
        try {
          // Fetch Profile from Backend
          const resp = await getProfile()

          if (resp.data.user) {
            set({
              user: resp.data.user,
              isAuthenticated: true // Enable auth status on successful fetch
            })
          }
        } catch (error) {
          console.error("Failed to get profile:", error);
          // If fetch fails (e.g. invalid/expired Token), force logout
          get().logout();
        }
      },

      editProfile: async (body) => {
        try {
          const resp = await editProfile(body)
          set({ user: resp.data.user });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
          return { success: false, error: errorMessage };
        }
      }

    }),
    {
      name: "auth-storage",
    }
  )
);

export default useUserStore;
