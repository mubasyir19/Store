import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string | null, isAuthenticated: boolean, user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (accessToken, isAuthenticated, user) => set({ accessToken, isAuthenticated, user }),

      clearAuth: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    // {
    //   name: 'auth-storage', // Nama key di localStorage
    //   // Optional: hanya simpan field tertentu
    //   // partialize: (state) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }),
    // }
  ),
);
