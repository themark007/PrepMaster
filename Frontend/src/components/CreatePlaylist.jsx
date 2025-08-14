import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreatePlaylist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePlaylist = async () => {
    if (!name || !playlistUrl) {
      toast.error("Please enter both name and playlist URL");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // Hardcoded user_id for now
          name,
          playlistUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create playlist");
      }

      toast.success(`Playlist "${name}" created with ${data.videos.length} videos!`);
      navigate("/dashboard"); // Navigate to dashboard
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Create Playlist</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="YouTube Playlist URL"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>
      <button
        onClick={handleCreatePlaylist}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}

export default CreatePlaylist;
