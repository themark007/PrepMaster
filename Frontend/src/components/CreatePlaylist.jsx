import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "./store/useUserStore";

function CreatePlaylist() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [step, setStep] = useState(1);
  const nameInputRef = useRef(null);
  const urlInputRef = useRef(null);
   const { user } = useUserStore();

     if (!user) {
    return <p>Loading user...</p>;
  }


  useEffect(() => {
    nameInputRef.current.focus();
    const timer = setTimeout(() => {
      document.querySelector(".card-container").classList.add("animate-in");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handlePreview = async () => {
    setNameError(false);
    setUrlError(false);
    
    let valid = true;
    
    if (!name) {
      setNameError(true);
      valid = false;
    }
    
    if (!playlistUrl) {
      setUrlError(true);
      valid = false;
    } else if (!validateUrl(playlistUrl)) {
      setUrlError(true);
      valid = false;
    }
    
    if (!valid) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call to get playlist preview
      // In a real app, you would use:
      // const res = await fetch("/api/playlists/preview", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ url: playlistUrl })
      // });
      // const data = await res.json();
      
      // Mock data for demonstration
      const mockPreviewData = {
        title: name,
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        videoCount: 12,
        duration: "1h 24m",
        owner: "Music Channel",
        videos: Array.from({ length: 12 }, (_, i) => ({
          id: `video${i + 1}`,
          title: `Video ${i + 1} - ${name} Playlist`,
          duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }))
      };
      
      setPreviewData(mockPreviewData);
      setStep(2);
    } catch (err) {
      toast.error("Failed to fetch playlist preview. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    setLoading(true);

    try {
      
      const res = await fetch("https://prepmaster-backend-i1sj.onrender.com/api/plans/create", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           user_id: user.id, 
           name,
           playlistUrl,
         }),
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.message || "Failed to create playlist");
      
   
      
      toast.success(`Playlist "${name}" created !`);
      setStep(3);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      toast.error(err.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPlaylistUrl("");
    setPreviewData(null);
    setStep(1);
  };

  return (
    <div className="create-playlist-container">
      <div className={`card-container ${step === 3 ? 'success-card' : ''}`}>
        <div className="card-content">
          <div className="card-header">
            <h1 className="card-title">Create YouTube Playlist</h1>
            <p className="card-subtitle">
              Organize your favorite YouTube content into playlists
            </p>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className={`progress-bar ${
                step === 1 ? "step-1" : step === 2 ? "step-2" : "step-3"
              }`}
            />
          </div>
          
          <div className="form-content">
            {step === 1 && (
              <div className="form-step animate-fadeIn">
                <div className="form-group">
                  <label className="form-label">Playlist Name</label>
                  <div className="input-container">
                    <input
                      ref={nameInputRef}
                      type="text"
                      placeholder="My Awesome Playlist"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError(false);
                      }}
                      className={`form-input ${nameError ? "input-error" : ""}`}
                    />
                    {nameError && (
                      <div className="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {nameError && <p className="error-message">Please enter a playlist name</p>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">YouTube Playlist URL</label>
                  <div className="input-container">
                    <input
                      ref={urlInputRef}
                      type="text"
                      placeholder="https://www.youtube.com/playlist?list=..."
                      value={playlistUrl}
                      onChange={(e) => {
                        setPlaylistUrl(e.target.value);
                        setUrlError(false);
                      }}
                      className={`form-input ${urlError ? "input-error" : ""}`}
                    />
                    {urlError && (
                      <div className="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {urlError && <p className="error-message">Please enter a valid YouTube playlist URL</p>}
                </div>
                
                <button
                  onClick={handlePreview}
                  disabled={loading}
                  className="primary-button"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Validating...
                    </>
                  ) : (
                    "Preview Playlist"
                  )}
                </button>
              </div>
            )}
            
            {step === 2 && previewData && (
              <div className="preview-step animate-fadeIn">
                <div className="preview-container">
                  <h2 className="preview-title">Playlist Preview</h2>
                  
                  <div className="preview-content">
                    <div className="preview-thumbnail">
                      <div className="thumbnail-wrapper">
                        <img 
                          src={previewData.thumbnail} 
                          alt="Playlist thumbnail" 
                          className="thumbnail-image"
                        />
                        <div className="thumbnail-overlay">
                          <h3 className="thumbnail-title">{previewData.title}</h3>
                        </div>
                        <div className="video-count">
                          {previewData.videoCount} videos
                        </div>
                      </div>
                    </div>
                    
                    <div className="preview-details">
                      <div className="detail-group">
                        <h4 className="detail-label">Details</h4>
                        <div className="detail-items">
                          <span className="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Duration: {previewData.duration}
                          </span>
                          <span className="detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            By {previewData.owner}
                          </span>
                        </div>
                      </div>
                      
                      <div className="sample-videos">
                        <h4 className="detail-label">Sample Videos</h4>
                        <div className="video-list">
                          {previewData.videos.slice(0, 5).map((video, index) => (
                            <div key={video.id} className="video-item">
                              <div className="video-thumb-placeholder"></div>
                              <div className="video-info">
                                <div className="video-title">{video.title}</div>
                                <div className="video-duration">{video.duration}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="button-group">
                  <button
                    onClick={() => setStep(1)}
                    className="secondary-button"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    disabled={loading}
                    className="primary-button"
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Playlist"
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="success-step animate-fadeIn">
                <div className="success-animation">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h2 className="success-title">Playlist Created!</h2>
                <p className="success-message">
                  Your playlist <span className="playlist-name">"{name}"</span> has been successfully created.
                </p>
                <p className="redirect-message">
                  You'll be redirected to your dashboard shortly...
                </p>
                <button
                  onClick={resetForm}
                  className="primary-button"
                >
                  Create Another Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Base styles */
        .create-playlist-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .card-container {
          max-width: 700px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transform: scale(0.95);
          opacity: 0;
          transition: all 0.5s ease;
        }
        
        .card-container.animate-in {
          transform: scale(1);
          opacity: 1;
        }
        
        .card-header {
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          padding: 24px;
          color: white;
          text-align: center;
        }
        
        .card-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        
        .card-subtitle {
          font-size: 16px;
          color: #c7d2fe;
          margin-top: 8px;
        }
        
        /* Progress bar */
        .progress-bar-container {
          height: 4px;
          background-color: #e5e7eb;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #4f46e5;
          transition: width 0.5s ease-in-out;
        }
        
        .step-1 {
          width: 33.33%;
        }
        
        .step-2 {
          width: 66.66%;
        }
        
        .step-3 {
          width: 100%;
        }
        
        /* Form content */
        .form-content {
          padding: 30px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .input-container {
          position: relative;
        }
        
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }
        
        .input-error {
          border-color: #ef4444;
        }
        
        .error-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #ef4444;
          width: 20px;
          height: 20px;
        }
        
        .error-message {
          color: #ef4444;
          font-size: 14px;
          margin-top: 8px;
        }
        
        /* Buttons */
        .primary-button {
          width: 100%;
          padding: 14px;
          background-color: #4f46e5;
          color: white;
          font-weight: 500;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .primary-button:hover {
          background-color: #4338ca;
          transform: scale(1.02);
        }
        
        .primary-button:active {
          transform: scale(0.98);
        }
        
        .primary-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .secondary-button {
          flex: 1;
          padding: 14px;
          background-color: #e5e7eb;
          color: #374151;
          font-weight: 500;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .secondary-button:hover {
          background-color: #d1d5db;
        }
        
        /* Spinner */
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Preview styles */
        .preview-container {
          background-color: #f9fafb;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }
        
        .preview-title {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }
        
        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        @media (min-width: 768px) {
          .preview-content {
            flex-direction: row;
          }
        }
        
        .preview-thumbnail {
          flex-shrink: 0;
        }
        
        .thumbnail-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          width: 260px;
          height: 150px;
        }
        
        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .thumbnail-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 15px;
        }
        
        .thumbnail-title {
          color: white;
          font-weight: 600;
          margin: 0;
          font-size: 16px;
        }
        
        .video-count {
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 12px;
          padding: 4px 8px;
          border-bottom-left-radius: 12px;
        }
        
        .preview-details {
          flex: 1;
        }
        
        .detail-group {
          margin-bottom: 20px;
        }
        
        .detail-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .detail-items {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #374151;
        }
        
        .detail-item svg {
          width: 16px;
          height: 16px;
          color: #4f46e5;
          margin-right: 6px;
        }
        
        .sample-videos {
          margin-top: 20px;
        }
        
        .video-list {
          max-height: 160px;
          overflow-y: auto;
          padding-right: 10px;
        }
        
        .video-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 8px;
          transition: border-color 0.3s ease;
        }
        
        .video-item:hover {
          border-color: #c7d2fe;
        }
        
        .video-thumb-placeholder {
          width: 50px;
          height: 35px;
          background-color: #e5e7eb;
          border-radius: 4px;
          flex-shrink: 0;
        }
        
        .video-info {
          min-width: 0;
        }
        
        .video-title {
          font-size: 14px;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .video-duration {
          font-size: 12px;
          color: #6b7280;
        }
        
        .button-group {
          display: flex;
          gap: 12px;
        }
        
        /* Success step */
        .success-step {
          text-align: center;
          padding: 30px 20px;
        }
        
        .success-animation {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }
        
        .success-title {
          font-size: 26px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .success-message {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 6px;
          line-height: 1.6;
        }
        
        .playlist-name {
          font-weight: 600;
          color: #4f46e5;
        }
        
        .redirect-message {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 30px;
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Checkmark animation */
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4F46E5;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke: #fff;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #4F46E5;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
          background-color: #4F46E5;
        }
        
        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 40px #4F46E5;
          }
        }
      `}</style>
    </div>
  );
}

export default CreatePlaylist;