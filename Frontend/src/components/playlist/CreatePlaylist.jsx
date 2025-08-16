import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwtDecode from "jwt-decode";

export default function CreatePlaylist() {
  const [name, setName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !playlistUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    // 1️⃣ Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in");
      return;
    }

    // 2️⃣ Decode token to get user_id
    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id; // must match backend JWT payload key
    } catch (err) {
      toast.error("Invalid token");
      return;
    }

    try {
      const res = await fetch("https://prepmaster-backend-i1sj.onrender.com/api/plans/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // optional if backend validates token
        },
        body: JSON.stringify({
          user_id: userId,
          name,
          playlistUrl
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
