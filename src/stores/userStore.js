import { create } from "zustand";
import { persist } from "zustand/middleware";
import { editProfile, getProfile } from "../api/auth";
import { toast } from "react-toastify";

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
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      getProfile: async () => {
        try {
          const resp = await getProfile()
          console.log('resp', resp.data.user)
          set({ user: resp.data.user })
        } catch (error) {
          console.error(error);
        }
      },
      editProfile: async (body) => {
        try {
          const resp = await editProfile(body)
          set({ user: resp.data.user });
          toast.success("🚀 Profile updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
          return true;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
          toast.error(`❌ ${errorMessage}`, {
            theme: "dark",
          });
          return false;
        }
      }
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useUserStore;
