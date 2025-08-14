// src/store/playlistDetailsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlaylistDetailsStore = create(
  persist(
    (set) => ({
      playlistDetails: {},
      setPlaylistDetails: (playlist_id, details) =>
        set((state) => ({
          playlistDetails: {
            ...state.playlistDetails,
            [playlist_id]: details,
          },
        })),
      clearPlaylistDetails: () => set({ playlistDetails: {} }),
    }),
    { name: "playlist-details-storage" }
  )
);

export default usePlaylistDetailsStore;
