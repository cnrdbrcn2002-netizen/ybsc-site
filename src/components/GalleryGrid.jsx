import React, { useState } from 'react';
import VideoModal from './VideoModal';
import { archiveData } from '../data/photos';
import { useOperative } from '../context/OperativeContext';

const GalleryGrid = ({ items = archiveData }) => {
  const { currentUser } = useOperative();
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadedImages, setUploadedImages] = useState({});
  const [comments, setComments] = useState({}); // Store comments per item ID
  const [commentInputs, setCommentInputs] = useState({}); // Track input values
  const [editingTitle, setEditingTitle] = useState(null); // Track which title is being edited
  const [customTitles, setCustomTitles] = useState({}); // Store custom titles

  /* Handle file upload and store in React state */
  const handleFileUpload = (event, id) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImages(prev => ({ ...prev, [id]: url }));
    }
  };

  /* Helper to get the correct source for an item */
  const getItemSrc = (item) => {
    return uploadedImages[item.id] || item.src;
  };

  /* Handle Adding Comment */
  const handleAddComment = (itemId, text) => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now(),
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    };

    setComments(prev => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), newComment]
    }));

    // Clear input after adding
    setCommentInputs(prev => ({ ...prev, [itemId]: '' }));
  };

  /* Handle input change */
  const handleInputChange = (itemId, value) => {
    setCommentInputs(prev => ({ ...prev, [itemId]: value }));
  };

  /* Handle title edit */
  const handleTitleEdit = (itemId, newTitle) => {
    if (newTitle.trim()) {
      setCustomTitles(prev => ({ ...prev, [itemId]: newTitle.trim() }));
    }
    setEditingTitle(null);
  };

  /* Get display title */
  const getDisplayTitle = (item) => {
    return customTitles[item.id] || item.title;
  };

  return (
    <section className="container" style={{ paddingBottom: '150px' }}>

      {/* Brutalist Grid Layout */}
      <div className="brutalist-grid">
        {items.map((item) => {
          const activeSrc = getItemSrc(item);
          const isFilled = !!activeSrc;

          return (
            <div
              key={item.id}
              className={`media-card ${item.span ? 'span-col' : ''}`}
            >
              {/* Hidden Input for Upload */}
              <input
                type="file"
                id={`file-${item.id}`}
                style={{ display: 'none' }}
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e, item.id)}
              />

              {/* CARD HEADER (Only visible if filled, or keep consistent?) 
                  Request says: Angular, thick bordered cards.
              */}

              {/* MEDIA PREVIEW SECTION */}
              <div
                className="media-preview-area"
                onClick={() => {
                  if (isFilled) {
                    setSelectedItem({ ...item, src: activeSrc });
                  } else {
                    // Start of Change: Restrict upload for guests
                    if (currentUser?.idName !== 'GUEST') {
                      document.getElementById(`file-${item.id}`).click();
                    }
                    // End of Change
                  }
                }}
              >
                {/* Background Image/Video Thumb */}
                <div
                  className={`bg-image ${isFilled ? 'filled' : ''}`}
                  style={{ backgroundImage: isFilled ? `url(${activeSrc})` : 'none' }}
                ></div>

                {/* Empty State */}
                {/* Empty State - Conditional for Guest */}
                {!isFilled && (
                  <div className="empty-slot-indicator">
                    <div className="big-plus">{currentUser?.idName === 'GUEST' ? 'Ø' : '+'}</div>
                    <div className="upload-text">{currentUser?.idName === 'GUEST' ? 'ACCESS_DENIED' : 'UPLOAD_MEDIA'}</div>
                  </div>
                )}

                {/* Overlay Icons & Hover Glow */}
                {isFilled && (
                  <div className="media-overlay">
                    {/* Type Icon */}
                    <div className="type-icon">
                      {item.type === 'video' ? '▶' : '🔍'}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD DETAILS Section (Below Preview) */}
              <div className="card-details">

                {/* Metadata Line */}
                <div className="meta-line">
                  <span className="meta-id">ID: {item.id.toString().padStart(3, '0')}</span>
                  <span className="meta-date">{item.date || '2026.01.29'}</span>
                </div>

                <div className="title-row">
                  {editingTitle === item.id ? (
                    <input
                      type="text"
                      className="title-edit-input"
                      defaultValue={getDisplayTitle(item)}
                      autoFocus
                      onBlur={(e) => handleTitleEdit(item.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTitleEdit(item.id, e.target.value);
                        } else if (e.key === 'Escape') {
                          setEditingTitle(null);
                        }
                      }}
                    />
                  ) : (
                    <>
                      <h3 className="card-title">{getDisplayTitle(item)}</h3>
                      <button
                        className="edit-title-btn"
                        onClick={() => setEditingTitle(item.id)}
                        title="Edit title"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                <p className="card-desc">ARCHIVE_REF // {item.tag}</p>

                {/* Comment Section (Integrated) */}
                <div className="card-comments">
                  {/* Display existing comments */}
                  {comments[item.id] && comments[item.id].length > 0 && (
                    <div className="comments-list">
                      {comments[item.id].map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <span className="comment-time">[{comment.timestamp}]</span>
                          <span className="comment-text">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input row */}
                  <div className="comment-input-row">
                    <input
                      type="text"
                      placeholder="ADD_COMMENT..."
                      className="comment-input"
                      value={commentInputs[item.id] || ''}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(item.id, commentInputs[item.id]);
                        }
                      }}
                    />
                    <button
                      className="add-comment-btn"
                      onClick={() => handleAddComment(item.id, commentInputs[item.id])}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {selectedItem && <VideoModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <style>{`
        .brutalist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          grid-auto-flow: dense;
        }
        
        .span-col { grid-column: span 2; }
        @media (max-width: 768px) { .span-col { grid-column: span 1; } }

        /* CARD CONTAINER */
        .media-card {
            background: rgba(5, 5, 5, 0.8);
            border: 2px solid #333;
            /* angular aesthetic via clip-path or just borders? User said "angular". */
            /* Let's use specific border radii for angular look */
            border-top-left-radius: 0px;
            border-bottom-right-radius: 20px; 
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(5px);
        }

        .media-card:hover {
            border-color: var(--color-red);
            box-shadow: 0 0 15px rgba(255, 0, 51, 0.2);
        }

        /* PREVIEW AREA */
        .media-preview-area {
            height: 250px;
            position: relative;
            cursor: pointer;
            border-bottom: 2px solid #333;
            overflow: hidden;
        }
        .media-card:hover .media-preview-area {
            border-bottom-color: var(--color-red);
        }

        .bg-image {
            width: 100%; height: 100%;
            background-size: cover;
            background-position: center;
            transition: transform 0.5s;
        }
        .media-card:hover .bg-image {
             transform: scale(1.1);
        }

        .empty-slot-indicator {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }
        .big-plus {
            font-size: 60px;
            font-weight: 100;
            color: #555;
            transition: color 0.3s;
        }
        .media-card:hover .big-plus { color: var(--color-red); }
        .upload-text {
            font-family: var(--font-tech);
            font-size: 10px;
            letter-spacing: 2px;
            color: #555;
        }

        /* OVERLAY ICONS */
        .media-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .media-card:hover .media-overlay { opacity: 1; }

        .type-icon {
            font-size: 40px;
            color: var(--color-white);
            text-shadow: 0 0 10px var(--color-red);
            transform: scale(0.8);
            transition: transform 0.3s;
        }
        .media-card:hover .type-icon { transform: scale(1); }


        /* DETAILS AREA */
        .card-details {
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .meta-line {
            display: flex;
            justify-content: space-between;
            font-family: var(--font-tech);
            font-size: 10px;
            color: var(--color-red);
            letter-spacing: 1px;
        }

        .title-row {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            max-width: 100%;
        }

        .card-title {
            font-family: var(--font-main);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 1.5rem;
            color: var(--color-white);
            margin: 0;
            text-transform: uppercase;
            letter-spacing: -1px;
            transition: text-shadow 0.3s;
            flex: 1;
        }
        .media-card:hover .card-title {
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
        }

        .edit-title-btn {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s;
            filter: drop-shadow(0 0 3px white);
            flex-shrink: 0;
            z-index: 10;
        }
        .media-card:hover .edit-title-btn {
            opacity: 1;
        }
        .edit-title-btn:hover {
            color: var(--color-red);
            filter: drop-shadow(0 0 5px var(--color-red));
            transform: scale(1.1);
        }

        .title-edit-input {
            background: #000;
            border: none;
            border-bottom: 2px solid var(--color-red);
            color: white;
            font-family: var(--font-main);
            font-size: 1.5rem;
            text-transform: uppercase;
            letter-spacing: -1px;
            padding: 5px 0;
            width: 100%;
            outline: none;
            box-shadow: 0 0 10px rgba(255, 0, 51, 0.3);
        }

        .card-desc {
            font-family: var(--font-tech);
            font-size: 12px;
            color: #888;
            margin: 0;
        }

        /* COMMENT SECTION */
        .card-comments {
            margin-top: auto;
            border-top: 1px solid #333;
            padding-top: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .comments-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 120px;
            overflow-y: auto;
            padding-right: 5px;
        }

        .comments-list::-webkit-scrollbar {
            width: 3px;
        }
        .comments-list::-webkit-scrollbar-thumb {
            background: #555;
        }
        .comments-list::-webkit-scrollbar-thumb:hover {
            background: var(--color-red);
        }

        .comment-item {
            font-family: var(--font-tech);
            font-size: 11px;
            color: #aaa;
            display: flex;
            gap: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #222;
        }

        .comment-time {
            color: var(--color-red);
            flex-shrink: 0;
            font-size: 9px;
        }

        .comment-text {
            color: #ccc;
            word-break: break-word;
        }

        .comment-input-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .comment-input {
            background: transparent;
            border: none;
            border-bottom: 1px solid #555;
            color: #ccc;
            font-family: var(--font-tech);
            font-size: 12px;
            width: 100%;
            padding: 5px 0;
            transition: border-color 0.3s;
        }
        .comment-input:focus {
            outline: none;
            border-bottom-color: var(--color-red);
        }

        .add-comment-btn {
            background: transparent;
            border: 1px solid #555;
            color: #555;
            width: 25px; height: 25px;
            display: flex;
            align-items: center; justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 18px;
            line-height: 1;
        }
        .media-card:hover .add-comment-btn {
            border-color: var(--color-red);
            color: var(--color-red);
        }
        .add-comment-btn:hover {
            background: var(--color-red) !important;
            color: black !important;
        }

      `}</style>
    </section>
  );
};

export default GalleryGrid;
