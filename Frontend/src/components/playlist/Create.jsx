import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function CreatePlaylist() {
  const [name, setName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
 
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !playlistUrl) {
      toast.error("Please fill in all fields");
      return;
    }
    const userId = 1;

    try {
      const res = await fetch("http://localhost:3000/api/plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name,
          playlistUrl: playlistUrl
        })
      });

      if (res.ok) {
        toast.success("Playlist created successfully!");
        setName("");
        setPlaylistUrl("");
      } else {
        toast.error("Failed to create playlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="create-playlist-container">
      <h2>Create a New Playlist</h2>
      <form onSubmit={handleSubmit} className="playlist-form">
        <input
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Playlist Link"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
        />
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
}
