import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";




export default function GoogleSuccess() {
  const navigate = useNavigate();
  
const login = useAuthStore((state) => state.login);
const token = true;

 useEffect(() => {
  //const params = new URLSearchParams(window.location.search);
  

  if (token) {
    localStorage.setItem("auth_token", token);
    login(); // sets Zustand isLoggedIn = true
    navigate("/dashboard");
  } else {
    navigate("/login");
  }
}, [login, navigate]);

  return <p>Logging you in...</p>;
}