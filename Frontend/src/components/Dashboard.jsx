import React from "react";
import useUserStore from "./store/useUserStore";
import usePlaylistStore from "./store/PlaylistStore";
import usePlaylistDetailsStore from "./store/playlistDetailsStore";
import useFetchUserPlaylists from "./hooks/useFetchUserPlaylists";
import useFetchPlaylistDetails from "./hooks/useFetchPlaylistDetails";
import StudyPlanCard from "./StudyPlanCard";
import Navbar from "./Navbar";

export default function Dashboard() {
  const { user } = useUserStore();
  const { playlistIds } = usePlaylistStore();
  const { loading: loadingPlaylists, error: playlistsError } = useFetchUserPlaylists();
  const { loading: loadingDetails, error: detailsError } = useFetchPlaylistDetails();
  const playlistDetails = usePlaylistDetailsStore(state => state.playlistDetails);

  // Show loader until userId is fetched
  if (!user) {
    return <div className="loader">Loading user...</div>;
  }

  const loading = loadingPlaylists || loadingDetails;
  const error = playlistsError || detailsError;

  return (
    <div>
      <Navbar />
      {loading && <div className="loader">Loading playlists...</div>}
      {error && <div className="error">{error}</div>}

      {Object.entries(playlistDetails).map(([playlistId, videos]) => {
        const playlistName = videos[0]?.name || "Untitled Playlist";
        return (
          <StudyPlanCard
            key={playlistId}
            playlistId={playlistId}
            playlistName={playlistName}
            videos={videos}
          />
        );
      })}
    </div>
  );
}
