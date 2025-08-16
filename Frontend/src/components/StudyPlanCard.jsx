import React, { useState, useEffect, useRef } from "react";

export default function StudyPlanCard({ playlistId, videos, playlistName }) {
  const [completed, setCompleted] = useState(
    videos.map((video) => video.is_completed || false)
  );
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [focusedVideo, setFocusedVideo] = useState(null);
  const [fullScreenNotes, setFullScreenNotes] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(
    `https://picsum.photos/seed/${playlistId}/800/300`
  );
  console.log("videos:", videos);
  // Sample tags for organization
  const tags = ["Mathematics", "Computer Science", "Algorithms", playlistName.split(" ")[0]];

  const saveTimeout = useRef(null);

  // Calculate progress
  useEffect(() => {
    const completedCount = completed.filter(status => status).length;
    setProgress(Math.round((completedCount / videos.length) * 100));
  }, [completed, videos.length]);

const toggleCompleted = async (index) => {
  const updated = [...completed];
  updated[index] = !updated[index];
  setCompleted(updated);

  // Use the correct property name from your videos array
  const video = videos[index];

  try {
    const response = await fetch("https://prepmaster-backend-i1sj.onrender.com/api/plans/videos/completion", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_id: video.video_id,  // <-- use video.video_id
        is_completed: updated[index],
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Failed to update video status:", data.message);
    } else {
      console.log("Video status updated:", data.video);
    }
  } catch (err) {
    console.error("Error updating video status:", err);
  }
};
const saveNotes = async (videoId, notesText) => {
  try {
    const response = await fetch("https://prepmaster-backend-i1sj.onrender.com/api/plans/videos/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId, notes: notesText })
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Failed to save notes:", data.message);
    } else {
      console.log("Notes saved:", data.video);
    }
  } catch (err) {
    console.error("Error saving notes:", err);
  }
};





  const toggleExpand = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setFocusedVideo(null);
    }
  };

  const handleVideoClick = (index) => {
    setFocusedVideo(focusedVideo === index ? null : index);
  };

  const toggleFullScreenNotes = () => {
    setFullScreenNotes(!fullScreenNotes);
  };

  // Formatting functions for rich text
  const formatText = (format) => {
    const textarea = document.getElementById('notes-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    
    let formattedText = '';
    
    switch(format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText.replace(/\n/g, '\n- ')}`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'quote':
        formattedText = `> ${selectedText.replace(/\n/g, '\n> ')}`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newNotes = notes.substring(0, start) + formattedText + notes.substring(end);
    setNotes(newNotes);
    
    // Refocus the textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  // Render formatted text in preview
  const renderFormattedText = (text) => {
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/> (.*?)(\n|$)/g, '<blockquote>$1</blockquote>')
      .replace(/\n- (.*?)(\n|$)/g, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`study-plan-card ${expanded ? "expanded" : ""}`}>
      {/* Header with progress */}
      <div className="card-header" onClick={toggleExpand}>
        <div className="header-content">
          <div className="title-wrapper">
            <h2>{playlistName}</h2>
            <div className="tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              <div className="progress-indicator"></div>
            </div>
            <div className="progress-label">{progress}% Completed</div>
          </div>
        </div>
        <div className="toggle-icon">
          <div className={`icon-line ${expanded ? "rotate-45" : ""}`}></div>
          <div className={`icon-line ${expanded ? "-rotate-45" : ""}`}></div>
        </div>
      </div>

      {/* Expanded content */}
      <div className={`card-content ${expanded ? "show" : ""}`}>
        {/* Cover photo */}
        <div className="cover-photo-container">
          <img src={coverPhoto} alt={playlistName} className="cover-photo" />
          <div className="cover-overlay">
            <h2 className="cover-title">{playlistName}</h2>
            <p className="cover-description">Study Plan • {videos.length} Videos</p>
          </div>
          <button 
            className="change-cover-btn"
            onClick={() => setCoverPhoto(`https://picsum.photos/seed/${Date.now()}/800/300`)}
          >
            Change Cover
          </button>
        </div>

        <div className="content-columns">
          {/* Notes section with rich text controls */}
          <section className={`card-notes ${fullScreenNotes ? "fullscreen" : ""}`}>
            <div className="notes-header">
              <h3>
                <svg className="notes-icon" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                Study Notes
              </h3>
              <div className="notes-actions">
                <button className="format-btn" onClick={() => formatText('bold')} title="Bold">
                  <strong>B</strong>
                </button>
                <button className="format-btn" onClick={() => formatText('italic')} title="Italic">
                  <em>I</em>
                </button>
                <button className="format-btn" onClick={() => formatText('underline')} title="Underline">
                  <u>U</u>
                </button>
                <button className="format-btn" onClick={() => formatText('list')} title="Bullet List">
                  <span>• List</span>
                </button>
                <button className="format-btn" onClick={() => formatText('code')} title="Code Block">
                  <code>{'</>'}</code>
                </button>
                <button className="format-btn" onClick={() => formatText('quote')} title="Blockquote">
                  <span>❝</span>
                </button>
                <button 
                  className="fullscreen-btn"
                  onClick={toggleFullScreenNotes}
                  title={fullScreenNotes ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {fullScreenNotes ? "↗" : "⛶"}
                </button>
              </div>
            </div>
            
            <div className="notes-container">
            <textarea
  id="notes-textarea"
  placeholder="Start typing your notes here..."
  value={notes}
  onChange={(e) => {
    setNotes(e.target.value);

    if (focusedVideo === null) return;

    // debounce: clear previous timeout
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    // set new timeout to save after 1.5s of inactivity
    saveTimeout.current = setTimeout(() => {
      saveNotes(videos[focusedVideo].video_id, e.target.value);
    }, 1500);
  }}
  className="notes-textarea"
/>

              <div className="notes-counter">
                {notes.length}/2000 characters
              </div>
            </div>
            
            <div className="notes-preview">
              <h4>Preview:</h4>
              <div 
                className="preview-content" 
                dangerouslySetInnerHTML={{ __html: renderFormattedText(notes) }} 
              />
            </div>
          </section>

          {/* Videos section */}
          <section className="card-videos">
            <div className="section-header">
              <h3>
                <svg className="video-icon" viewBox="0 0 24 24">
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                </svg>
                Video Lessons
              </h3>
              <div className="status-badge">
                {completed.filter(c => c).length} of {videos.length} completed
              </div>
            </div>
            
            <ul className="video-list">
              {videos.map((video, index) => (
                <li 
                  key={video.video_id}
                  className={`video-item ${completed[index] ? "completed" : ""} ${focusedVideo === index ? "focused" : ""}`}
                  onClick={() => handleVideoClick(index)}
                >
                  <div className="video-info">
                    <div className="checkbox-container">
                      <div 
                        className={`custom-checkbox ${completed[index] ? "checked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompleted(index);
                        }}
                      >
                        {completed[index] && (
                          <svg className="check-icon" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="video-details">
                      <div className="video-title-container">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-title"
                        >
                          {video.video_title}
                        </a>
                        {focusedVideo === index && (
                          <div className="video-progress">
                            <div className="progress-bar-mini" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                          </div>
                        )}
                      </div>
                      <div className="video-meta">
                        <div className="video-duration">
                          <svg className="duration-icon" viewBox="0 0 24 24">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                          </svg>
                          {Math.floor(Math.random() * 15) + 5}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                        </div>
                        <div className="video-difficulty">
                          <span className={`difficulty-dot ${index % 3 === 0 ? 'advanced' : index % 3 === 1 ? 'intermediate' : 'beginner'}`}></span>
                          {index % 3 === 0 ? 'Advanced' : index % 3 === 1 ? 'Intermediate' : 'Beginner'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {focusedVideo === index && (
                    <div className="video-actions">
                      <button className="action-btn watch-btn">
                        <svg className="action-icon" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Continue Watching
                      </button>
                      <button className="action-btn notes-btn">
                        <svg className="action-icon" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                        Add Notes
                      </button>
                      <button className="action-btn bookmark-btn">
                        <svg className="action-icon" viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                        </svg>
                        Bookmark
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --primary-dark: #4f46e5;
          --secondary: #10b981;
          --accent: #f59e0b;
          --danger: #ef4444;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-700: #374151;
          --gray-900: #111827;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --border-radius: 16px;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .study-plan-card {
          background: #ffffff;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          margin: 24px auto;
          max-width: 1200px;
          font-family: 'Inter', sans-serif;
          transition: var(--transition);
          border: 1px solid var(--gray-200);
          transform: translateY(0);
        }
        
        .study-plan-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-3px);
        }
        
        .study-plan-card.expanded {
          box-shadow: var(--shadow-xl);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 20px 32px;
          background: linear-gradient(135deg, #f0f4ff 0%, #e6edff 100%);
          transition: var(--transition);
          position: relative;
          z-index: 2;
        }
        
        .card-header:hover {
          background: linear-gradient(135deg, #e6edff 0%, #dbe7ff 100%);
        }
        
        .header-content {
          flex: 1;
        }
        
        .title-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .card-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gray-900);
          letter-spacing: -0.01em;
          font-family: 'Poppins', sans-serif;
        }
        
        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .tag {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .progress-container {
          position: relative;
        }
        
        .progress-bar {
          height: 10px;
          background: linear-gradient(90deg, var(--primary-light), var(--primary-dark));
          border-radius: 5px;
          position: relative;
          transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
        }
        
        .progress-indicator {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 16px;
          background: white;
          border-radius: 50%;
          transform: translateX(50%);
          box-shadow: 0 0 0 3px var(--primary);
        }
        
        .progress-label {
          position: absolute;
          right: 0;
          top: -25px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-dark);
        }
        
        .toggle-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-left: 20px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transition: var(--transition);
        }
        
        .toggle-icon:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: rotate(90deg);
        }
        
        .icon-line {
          position: absolute;
          width: 20px;
          height: 3px;
          background: var(--primary-dark);
          border-radius: 2px;
          transition: var(--transition);
        }
        
        .icon-line:first-child {
          transform: rotate(90deg);
        }
        
        .icon-line.rotate-45 {
          transform: rotate(45deg);
        }
        
        .icon-line.-rotate-45 {
          transform: rotate(-45deg);
        }
        
        .card-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                      opacity 0.4s ease;
        }
        
        .card-content.show {
          max-height: 2000px;
          opacity: 1;
        }
        
        .cover-photo-container {
          position: relative;
          height: 250px;
          overflow: hidden;
          border-bottom: 1px solid var(--gray-200);
        }
        
        .cover-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .cover-photo-container:hover .cover-photo {
          transform: scale(1.03);
        }
        
        .cover-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 30px;
          color: white;
        }
        
        .cover-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 8px;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.5px;
        }
        
        .cover-description {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .change-cover-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        
        .change-cover-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .content-columns {
          display: flex;
          padding: 30px;
          gap: 30px;
        }
        
        .card-notes {
          flex: 1;
          min-width: 0;
          background: var(--gray-100);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          position: relative;
        }
        
        .card-notes.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          background: white;
          border-radius: 0;
          padding: 40px;
          overflow: auto;
        }
        
        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .card-notes h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--gray-900);
        }
        
        .notes-icon {
          width: 24px;
          height: 24px;
          fill: var(--primary);
        }
        
        .notes-actions {
          display: flex;
          gap: 8px;
        }
        
        .format-btn, .fullscreen-btn {
          background: white;
          border: 1px solid var(--gray-300);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .format-btn:hover, .fullscreen-btn:hover {
          background: var(--gray-200);
          border-color: var(--gray-400);
          transform: translateY(-2px);
        }
        
        .format-btn strong, .format-btn em, .format-btn u {
          font-weight: 600;
          font-style: normal;
          text-decoration: none;
        }
        
        .format-btn code {
          font-size: 0.9rem;
        }
        
        .notes-container {
          position: relative;
          margin-bottom: 24px;
        }
        
        .notes-textarea {
          width: 100%;
          min-height: 250px;
          border-radius: 12px;
          border: 1px solid var(--gray-300);
          padding: 20px;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          resize: vertical;
          transition: var(--transition);
          background: white;
          box-shadow: var(--shadow-sm);
        }
        
        .notes-textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        
        .notes-textarea::placeholder {
          color: var(--gray-400);
        }
        
        .notes-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          font-size: 0.8rem;
          color: var(--gray-400);
          background: rgba(255, 255, 255, 0.8);
          padding: 4px 10px;
          border-radius: 10px;
        }
        
        .notes-preview {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-200);
        }
        
        .notes-preview h4 {
          margin-bottom: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--gray-700);
        }
        
        .preview-content {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--gray-800);
        }
        
        .preview-content strong {
          font-weight: 600;
        }
        
        .preview-content em {
          font-style: italic;
        }
        
        .preview-content u {
          text-decoration: underline;
        }
        
        .preview-content code {
          font-family: monospace;
          background: var(--gray-100);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .preview-content blockquote {
          border-left: 3px solid var(--primary);
          padding-left: 16px;
          margin: 12px 0;
          color: var(--gray-700);
          font-style: italic;
        }
        
        .preview-content ul {
          padding-left: 24px;
          margin: 12px 0;
        }
        
        .preview-content li {
          margin-bottom: 8px;
        }
        
        .card-videos {
          flex: 1;
          min-width: 0;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .card-videos h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--gray-900);
        }
        
        .video-icon {
          width: 24px;
          height: 24px;
          fill: var(--primary);
        }
        
        .status-badge {
          background: var(--gray-100);
          color: var(--gray-700);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .video-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .video-item {
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          background: white;
          border: 1px solid var(--gray-200);
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .video-item:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--gray-300);
        }
        
        .video-item.completed {
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.2);
        }
        
        .video-item.completed .video-title {
          color: var(--secondary);
        }
        
        .video-item.focused {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
          background: rgba(99, 102, 241, 0.03);
          z-index: 2;
        }
        
        .video-info {
          display: flex;
          align-items: flex-start;
        }
        
        .checkbox-container {
          margin-right: 16px;
          flex-shrink: 0;
          margin-top: 4px;
        }
        
        .custom-checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid var(--gray-300);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .custom-checkbox.checked {
          background: var(--secondary);
          border-color: var(--secondary);
        }
        
        .check-icon {
          width: 16px;
          height: 16px;
          fill: white;
        }
        
        .video-details {
          flex: 1;
        }
        
        .video-title-container {
          margin-bottom: 12px;
        }
        
        .video-title {
          text-decoration: none;
          color: var(--gray-900);
          font-weight: 500;
          font-size: 1.1rem;
          transition: color 0.2s ease;
          display: block;
        }
        
        .video-title:hover {
          color: var(--primary);
        }
        
        .video-progress {
          height: 4px;
          background: var(--gray-200);
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        }
        
        .progress-bar-mini {
          height: 100%;
          background: var(--primary);
          border-radius: 2px;
        }
        
        .video-meta {
          display: flex;
          gap: 16px;
          font-size: 0.9rem;
          color: var(--gray-600);
        }
        
        .video-duration, .video-difficulty {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .duration-icon {
          width: 16px;
          height: 16px;
          fill: var(--gray-600);
        }
        
        .difficulty-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        
        .difficulty-dot.beginner {
          background: var(--secondary);
        }
        
        .difficulty-dot.intermediate {
          background: var(--accent);
        }
        
        .difficulty-dot.advanced {
          background: var(--danger);
        }
        
        .video-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          animation: fadeIn 0.3s ease;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .watch-btn {
          background: var(--primary);
          color: white;
        }
        
        .watch-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
        }
        
        .notes-btn {
          background: white;
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }
        
        .notes-btn:hover {
          background: var(--gray-100);
          border-color: var(--gray-400);
        }
        
        .bookmark-btn {
          background: var(--gray-100);
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }
        
        .bookmark-btn:hover {
          background: var(--gray-200);
        }
        
        .action-icon {
          width: 18px;
          height: 18px;
        }
        
        .watch-btn .action-icon {
          fill: white;
        }
        
        .notes-btn .action-icon, .bookmark-btn .action-icon {
          fill: var(--gray-700);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 900px) {
          .content-columns {
            flex-direction: column;
          }
          
          .cover-photo-container {
            height: 200px;
          }
          
          .cover-title {
            font-size: 1.8rem;
          }
        }
        
        @media (max-width: 600px) {
          .card-header {
            padding: 16px;
          }
          
          .card-header h2 {
            font-size: 1.3rem;
          }
          
          .content-columns {
            padding: 20px;
          }
          
          .cover-photo-container {
            height: 180px;
          }
          
          .cover-overlay {
            padding: 20px;
          }
          
          .cover-title {
            font-size: 1.5rem;
          }
          
          .card-notes, .card-videos {
            padding: 20px;
          }
          
          .video-actions {
            flex-direction: column;
          }
          
          .notes-actions {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}