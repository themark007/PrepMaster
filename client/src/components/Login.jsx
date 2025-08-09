import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    } else if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1500); // Navigate after toast
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    }
  };

  const handleGoogleLogin = () => {
    // Replace this with actual Google login logic
    toast.success("Google login successful!");
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div
       style={{
        height: "100vh",
        width: "100vh",
       
        
        fontFamily: "'Poppins', sans-serif",
        backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
       <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.6)",
        }}
      />

      {/* Centered Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "600px",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          marginLeft: '800px',
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1,
          color: "#fff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#fff",
            fontWeight: "600",
            letterSpacing: "1px",
            fontSize: "28px",
          }}
        >
          Login to Your Account
        </h2>

        {["email", "password"].map((field) => (
          <div key={field} style={{ marginBottom: "20px" }}>
            <input
                 type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={
                field.charAt(0).toUpperCase() + field.slice(1)
              }
              style={{
                width: "100%",
                padding: "14px 18px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.background = "rgba(0, 0, 0, 0.6)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
              onBlur={(e) => {
                e.target.style.background = "rgba(0, 0, 0, 0.4)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
            />
          </div>
        ))}

        {/* Login Button */}
        <button
           type="submit"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(45deg, #0095ff, #0066ff)",
            color: "white",
            fontWeight: "600",
            fontSize: "17px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginTop: "10px",
            letterSpacing: "0.5px",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "linear-gradient(45deg, #0085ff, #0055ff)";
            e.target.style.transform = "scale(1.02)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "linear-gradient(45deg, #0095ff, #0066ff)";
            e.target.style.transform = "scale(1)";
          }}
        >
          Login
        </button>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "white",
            color: "black",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: "20px", marginRight: "8px", verticalAlign: "middle" }}
          />
          Continue with Google
        </button>

        {/* Signup Link */}
        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Not registered?{" "}
          <a
            href="/signup"
            style={{ color: "#4da3ff", textDecoration: "none" }}
          >
            Sign up
          </a>
        </p>
      </form>

      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        style={{ marginTop: "60px" }}
      />
    </div>
  );
}
