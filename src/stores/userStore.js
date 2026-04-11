import { create } from "zustand";
import { persist } from "zustand/middleware";
import Register from "../pages/Register";

const useUserStore = create(
  persist(
    (set,get) => ({
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
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useUserStore;
