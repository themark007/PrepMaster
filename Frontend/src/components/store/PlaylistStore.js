import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlaylistStore = create(
  persist(
    (set) => ({
      // Hardcoded userId
      userId: "1",

      // Multiple playlist IDs (initially empty)
      playlistIds: [],

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
