import React from "react";

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Dashboard</h1>
      <p>This is a protected route, accessible only when logged in.</p>
    </div>
  );
}
