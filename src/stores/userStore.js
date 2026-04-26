import { create } from "zustand";
import { persist } from "zustand/middleware";
import { editProfile, getProfile } from "../api/auth";
import { STORAGE_KEYS } from "../config/constants";
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
          isAuthenticated: false, // ยังไม่เปิดสถานะจนกว่าจะดึง Profile สำเร็จ เพื่อมาใหม่******
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),


      getProfile: async () => {
        try {
          // ดึง Profile จาก Backend (ต้องแนบ Token ไปที่ Header ด้วยใน API ของคุณ)
          const resp = await getProfile()

          if (resp.data.user) {
            set({
              user: resp.data.user,
              isAuthenticated: true // ดึง Profile สำเร็จ ค่อยเปิดสถานะ
            })
          }
        } catch (error) {
          console.error("Failed to get profile:", error);
          // ถ้าดึงไม่ได้ (เช่น Token หมดอายุ หรือไม่ถูกต้อง) ให้เตะออก
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
      name: STORAGE_KEYS.AUTH,
    }
  )
);

export default useUserStore;
