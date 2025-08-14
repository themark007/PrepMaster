import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfileForm.css"; // Import CSS file

export default function ProfileForm({ userId }) {
  const [profile, setProfile] = useState({
    photo_url: "",
    bio: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const confettiRef = useRef(null);

  // Social media icons
  const socialIcons = {
    website: "🌐",
    linkedin: "🔗",
    twitter: "🐦",
    instagram: "📸"
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = ["photo_url", "bio", "website", "linkedin", "twitter", "instagram"];
    const completed = fields.filter(field => {
      if (field === "photo_url") return !!previewUrl;
      return !!profile[field] && profile[field].trim() !== "";
    }).length;
    
    return Math.round((completed / fields.length) * 100);
  };

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/profile/${userId}`);
        const data = await res.json();
        if (data) {
          setProfile(data);
          setPreviewUrl(data.photo_url || "");
        }
      } catch (err) {
        toast.error("Failed to load profile data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  // Update completion percentage
  useEffect(() => {
    setCompletionPercentage(calculateCompletion());
  }, [profile, previewUrl]);

  // Confetti effect
  const triggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.style.display = "block";
      setTimeout(() => {
        if (confettiRef.current) {
          confettiRef.current.style.display = "none";
        }
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Upload photo first if exists
    let photoUrl = profile.photo_url;
    if (photoFile) {
      const formData = new FormData();
      formData.append("photo", photoFile);

      try {
        const res = await fetch("http://localhost:3000/api/upload-photo", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          photoUrl = data.url;
        } else {
          toast.error(data.message || "Photo upload failed");
          return;
        }
      } catch (err) {
        toast.error("Error uploading photo");
        return;
      }
    }

    // Save profile data
    try {
      const res = await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...profile, photo_url: photoUrl }),
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile saved successfully!");
        setProfile(data);
        setPreviewUrl(data.photo_url || "");
        triggerConfetti();
      } else {
        toast.error(data.message || "Error saving profile");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setIsSaving(false);
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    const segments = 6;
    const segmentAngle = 360 / segments;
    const radius = 70;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;
    
    return (
      <div className="progress-indicator">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e0e0e0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={completionPercentage === 100 ? "#4ade80" : "#3b82f6"}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy=".3em" 
            fontSize="24" 
            fontWeight="bold"
            fill={completionPercentage === 100 ? "#4ade80" : "#3b82f6"}
          >
            {completionPercentage}%
          </text>
        </svg>
      </div>
    );
  };

  // Render social links preview
  const renderSocialPreview = () => {
    return (
      <div className="social-preview">
        {Object.entries(socialIcons).map(([platform, icon]) => (
          profile[platform] && (
            <a 
              key={platform}
              href={profile[platform]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              <span className="social-icon">{icon}</span>
              <span className="social-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </a>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="profile-container">
      {/* Confetti effect */}
      <div ref={confettiRef} className="confetti-container">
        {Array.from({ length: 150 }).map((_, i) => (
          <div key={i} className="confetti" />
        ))}
      </div>
      
      <div className="glass-card">
        <div className="header">
          <h1 className="title">Your Professional Profile</h1>
          <p className="subtitle">Complete your profile to increase visibility</p>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button 
            className={`tab ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
        
        {activeTab === "profile" ? (
          <form onSubmit={handleSubmit} ref={formRef} className="profile-form">
            <div className="profile-section">
              <div className="avatar-container">
                <div 
                  className="avatar-wrapper"
                  onClick={triggerFileInput}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <div className="camera-icon">📷</div>
                      <div className="upload-text">Upload Photo</div>
                    </div>
                  )}
                  <div className="avatar-overlay">
                    <div className="camera-icon-large">📷</div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    ref={fileInputRef}
                    className="file-input"
                  />
                </div>
                
                <div className="progress-container">
                  {renderProgressIndicator()}
                  <div className="progress-label">
                    {completionPercentage === 100 ? (
                      <span className="complete">Profile Complete! 🎉</span>
                    ) : (
                      <span>{completionPercentage}% Complete</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="input-label">
                  Bio <span className="char-count">{profile.bio?.length || 0}/200</span>
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="bio-input"
                  rows="3"
                  maxLength={200}
                />
              </div>
            </div>
            
            <div className="social-section">
              <h3 className="section-title">Social Links</h3>
              
              {Object.keys(socialIcons).map((field) => (
                <div key={field} className="form-group">
                  <div className="input-with-icon">
                    <span className="input-icon">{socialIcons[field]}</span>
                    <input
                      name={field}
                      value={profile[field]}
                      onChange={handleChange}
                      placeholder={`https://${field}.com/yourusername`}
                      className="social-input"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="submit"
              className={`save-button ${isSaving ? "saving" : ""}`}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="button-spinner"></div>
              ) : (
                <>
                  <span>Save Profile</span>
                  <span className="save-icon">💾</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="profile-preview">
            <div className="preview-header">
              <div className="preview-avatar">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="preview-image" />
                ) : (
                  <div className="preview-placeholder">No Image</div>
                )}
              </div>
              <div className="preview-info">
                <h2 className="preview-name">John Doe</h2>
                <p className="preview-title">Senior Designer at TechCorp</p>
                <div className="preview-badges">
                  <span className="badge verified">Verified</span>
                  <span className="badge pro">Pro Member</span>
                </div>
              </div>
            </div>
            
            <div className="preview-bio">
              <h3>About Me</h3>
              <p>{profile.bio || "No bio added yet"}</p>
            </div>
            
            <div className="preview-social">
              <h3>Connect With Me</h3>
              {renderSocialPreview()}
            </div>
            
            <div className="preview-stats">
              <div className="stat">
                <div className="stat-value">1.2K</div>
                <div className="stat-label">Connections</div>
              </div>
              <div className="stat">
                <div className="stat-value">98%</div>
                <div className="stat-label">Profile Strength</div>
              </div>
              <div className="stat">
                <div className="stat-value">24</div>
                <div className="stat-label">Endorsements</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}