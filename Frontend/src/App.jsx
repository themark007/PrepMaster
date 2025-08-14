import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './components/Signup.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './components/Login.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './components/Dashboard.jsx'
import NotFound from './components/NotFound.jsx'
import useAuthStore from './components/store/authStore.js'
import { Navigate } from 'react-router-dom'
import GoogleSuccess from './components/google-success.jsx'
import CreatePlaylist from './components/CreatePlaylist.jsx'


function App() {
  

  return (
   <>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/google-success" element={<GoogleSuccess />} />

          {/* Protected Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />


           {/* Protected Dashboard */}
          <Route path="/create-plan" element={
            <ProtectedRoute>
              <CreatePlaylist />
            </ProtectedRoute>
          } />

          

          {/* 404 Page */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
