import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#0f172a",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Left - Brand */}
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "600" }}>
        <Link
          to="/"
          style={{
            color: "#fff",
            textDecoration: "none",
          }}
        >
          PrepMaster
        </Link>
      </div>

      {/* Right - Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/create-plan" style={linkStyle}>
          Create Plan
        </Link>
        <Link to="/pro-features" style={linkStyle}>
          Pro Features
        </Link>
        <Link to="/profile" style={linkStyle}>
          Profile
        </Link>
        <Link to="/login" style={linkStyle}>
          logout
        </Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: "16px",
  transition: "color 0.3s ease",
};

export default Navbar;
