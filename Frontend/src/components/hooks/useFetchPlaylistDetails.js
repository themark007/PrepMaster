import { useEffect, useState } from "react";
import usePlaylistStore from "../store/PlaylistStore";
import usePlaylistDetailsStore from "../store/playlistDetailsStore";

export default function useFetchPlaylistDetails() {
 const { playlistIds } = usePlaylistStore();          // for playlist IDs
const { setPlaylistDetails } = usePlaylistDetailsStore(); // for setting details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Safely check if playlistIds is defined and non-empty
    if (!Array.isArray(playlistIds) || playlistIds.length === 0) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const detailsArray = [];

        for (const playlistId of playlistIds) {
          const res = await fetch(`https://prepmaster-backend-i1sj.onrender.com/api/plans/view/${playlistId}`, {
  method: "GET",
  headers: { "Accept": "application/json" },
});

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to fetch playlist details");

          detailsArray.push({ playlistId, ...data });
           setPlaylistDetails(playlistId, data.data); 
        }

       // setPlaylistDetails(playlistId, data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [playlistIds, setPlaylistDetails]);

  return { loading, error };
}
