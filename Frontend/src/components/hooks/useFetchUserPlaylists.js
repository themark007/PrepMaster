import { useEffect, useState } from "react";
import usePlaylistStore from "../store/PlaylistStore";

export default function useFetchUserPlaylists() {
  const { userId, setPlaylistIds } = usePlaylistStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/plans/playlistid/${userId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch playlists");
        }

        const ids = data.playlists.map((p) => p.playlist_id);
        setPlaylistIds(ids); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId, setPlaylistIds]);

  return { loading, error };
}
