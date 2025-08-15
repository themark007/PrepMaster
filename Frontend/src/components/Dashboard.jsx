import React from "react";
import usePlaylistStore from "./store/PlaylistStore";
import usePlaylistDetailsStore from "./store/playlistDetailsStore";
import useFetchUserPlaylists from "./hooks/useFetchUserPlaylists";
import useFetchPlaylistDetails from "./hooks/useFetchPlaylistDetails";
import StudyPlanCard from "./StudyPlanCard";
import Navbar from "./Navbar";
export default function Dashboard() {
 
  const { playlistIds } = usePlaylistStore();          // for playlist IDs

  const { loading: loadingPlaylists, error: playlistsError } = useFetchUserPlaylists();
  const { loading: loadingDetails, error: detailsError } = useFetchPlaylistDetails();

  const loading = loadingPlaylists || loadingDetails;
  const error = playlistsError || detailsError;

  const playlistDetails = usePlaylistDetailsStore(state => state.playlistDetails);


  return (
     <div>
      <Navbar />
      {Object.entries(playlistDetails).map(([playlistId, videos]) => {
        // Get playlist name from the first video object
        const playlistName = videos[0]?.name || "Untitled Playlist";
        //console.log("Playlist ID:", playlistId, "Videos:", videos);

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
