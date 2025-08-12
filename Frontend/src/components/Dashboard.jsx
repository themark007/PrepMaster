import React from "react";
import CreatePlaylist from "./playlist/CreatePlaylist";

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      
      <h1>Welcome to the Dashboard</h1>
      <CreatePlaylist />
    </div>
  );
}
