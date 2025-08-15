// src/store/useUserStore.js
import { create } from 'zustand';
import jwtDecode from 'jwt-decode';

export const useUserStore = create((set) => ({
  userId: null,
  loadUserId: () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const decoded = jwtDecode(token);
      set({ userId: decoded.id });
    } catch (err) {
      console.error("Invalid token", err);
      set({ userId: null });
    }
  },
}));
