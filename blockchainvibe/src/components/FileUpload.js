import React, { useState, useRef } from 'react';
import { useUser } from '../hooks/useUser';

const FileUpload = ({ type = 'profile', onUploadSuccess, className = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useUser();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('userId', user.id);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (onUploadSuccess) {
          onUploadSuccess(result.url);
        }
        setPreview(null);
        fileInputRef.current.value = '';
        // Show success message
        alert('File uploaded successfully!');
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      <div className="upload-container">
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-actions">
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="upload-btn"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="file-input"
              id={`file-upload-${type}`}
            />
            <label htmlFor={`file-upload-${type}`} className="file-label">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                Click to select {type} image
              </div>
              <div className="upload-hint">
                JPEG, PNG, WebP (max 5MB)
              </div>
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <style jsx>{`
        .file-upload {
          width: 100%;
          max-width: 400px;
        }

        .upload-container {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: #f9f9f9;
          transition: border-color 0.3s ease;
        }

        .upload-container:hover {
          border-color: #007bff;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .preview-image {
          max-width: 200px;
          max-height: 200px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .preview-actions {
          display: flex;
          gap: 10px;
        }

        .upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .file-input {
          display: none;
        }

        .file-label {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
        }

        .upload-icon {
          font-size: 48px;
          opacity: 0.6;
        }

        .upload-text {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .upload-hint {
          font-size: 12px;
          color: #666;
        }

        .upload-btn, .remove-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .upload-btn {
          background: #007bff;
          color: white;
        }

        .upload-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .upload-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
        }

        .remove-btn:hover {
          background: #c82333;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
