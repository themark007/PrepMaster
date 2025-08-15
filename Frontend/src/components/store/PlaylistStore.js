// src/store/usePlaylistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";;

const usePlaylistStore = create(
  persist(
    (set) => ({
      // Initially null, will be loaded from token
      userId: null,

      // Playlists
      playlistIds: [],

      // Decode token and set userId
      loadUserIdFromToken: () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const decoded = jwtDecode(token);
          set({ userId: decoded.id });
        } catch (err) {
          console.error("Invalid token", err);
          set({ userId: null });
        }
      },

      // Set playlist IDs from backend
      setPlaylistIds: (ids) => set({ playlistIds: ids }),

      // Add one playlist ID
      addPlaylistId: (id) =>
        set((state) => ({
          playlistIds: [...state.playlistIds, id],
        })),

      // Remove a playlist ID
      removePlaylistId: (id) =>
        set((state) => ({
          playlistIds: state.playlistIds.filter((pid) => pid !== id),
        })),
    }),
    {
      name: "playlist-storage", // key in localStorage
    }
  )
);

export default usePlaylistStore;
