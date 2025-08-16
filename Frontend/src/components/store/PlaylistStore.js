// src/store/usePlaylistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useUserStore from "./useUserStore";

const usePlaylistStore = create(
  persist(
    (set, get) => ({
      playlistIds: [],

      // Set playlist IDs from backend for this user
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

      // Example: fetch playlists using userId from useUserStore
      fetchUserPlaylists: async () => {
        const { user } = useUserStore.getState(); 
        if (!user) return;

         const res = await fetch(
          `https://prepmaster-backend-i1sj.onrender.com/api/plans/playlistid/${user.id}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Cache-Control": "no-cache", // 🔹 Prevent browser cache
            },
            cache: "no-store", // 🔹 Another way to force fresh fetch
          }
        );
        const data = await res.json();
        set({ playlistIds: data.map((p) => p.id) });
      },
    }),
    {
      name: "playlist-storage", // key in localStorage
    }
  )
);

export default usePlaylistStore;
