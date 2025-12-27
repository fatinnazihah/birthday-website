import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebase';
import '../styles/PhotoGallery.css';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const photosRef = ref(storage, 'gallery/');
      const photosList = await listAll(photosRef);
      
      const photoURLs = await Promise.all(
        photosList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        })
      );
      
      setPhotos(photoURLs);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of files) {
        const photoRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(photoRef, file);
      }
      
      await fetchPhotos();
      alert('🎉 Photos uploaded successfully!');
    } catch (error) {
      alert('❌ Error uploading photos');
      console.error(error);
    }
    
    setUploading(false);
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">📸 Our Memories Together 📸</h1>

      <div className="upload-section">
        <label className="upload-btn">
          {uploading ? '⏳ Uploading...' : '📤 Upload Photos'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="photos-grid">
        {photos.map((photo, idx) => (
          <div 
            key={idx} 
            className="photo-card"
            onClick={() => setSelectedPhoto(photo)}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <img src={photo.url} alt={`Memory ${idx + 1}`} />
            <div className="photo-overlay">
              <span className="like-icon">❤️</span>
            </div>
          </div>
        ))}
        
        {photos.length === 0 && (
          <p className="no-photos">No photos yet! Upload your first memory 📸</p>
        )}
      </div>

      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.url} alt="Full size" />
            <button onClick={() => setSelectedPhoto(null)} className="close-modal">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
