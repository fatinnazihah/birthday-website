import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../firebase';
import '../styles/PhotoGallery.css';

const PhotoGallery = ({ userType }) => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => { fetchPhotos(); }, []);

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
    } catch (error) { console.error(error); }
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
    } catch (error) { alert('Upload failed'); }
    setUploading(false);
  };

  return (
    <div className="gallery-explorer">
      {/* TOOLBAR */}
      <div className="explorer-toolbar">
         <span>File</span> <span>Edit</span> <span>View</span> <span>Favorites</span> <span>Help</span>
      </div>
      <div className="address-bar-row">
          <span>Address</span>
          <div className="address-input">C:\My Documents\Sonia_Pics</div>
      </div>

      <div className="explorer-body">
        {/* SIDEBAR */}
        <div className="explorer-sidebar">
            <div className="sidebar-item">📁 My Computer</div>
            <div className="sidebar-item">📁 3½ Floppy (A:)</div>
            <div className="sidebar-item open">📂 My Documents</div>
            <div className="sidebar-item sub-item">📷 My Pictures</div>
        </div>

        {/* ICONS GRID */}
        <div className="icons-view">
            <label className="desktop-icon upload-icon">
                <div className="icon-img upload-img">⬆️</div>
                <span className="icon-text">{uploading ? 'Uploading...' : 'Add_New.exe'}</span>
                <input type="file" multiple accept="image/*" onChange={handleUpload} style={{display:'none'}} />
            </label>

             {photos.map((photo, idx) => (
                 <div key={idx} className="desktop-icon" onClick={() => setSelectedPhoto(photo)}>
                     <div className="icon-img">
                         <img src={photo.url} alt="thumbnail" />
                     </div>
                     <span className="icon-text">{photo.name.substring(0, 10)}...jpg</span>
                 </div>
             ))}

             {photos.length === 0 && <p style={{padding: '20px'}}>Folder is empty.</p>}
        </div>
      </div>

      {/* FOOTER */}
      <div className="explorer-status-bar">
          {photos.length} object(s)
      </div>

      {/* POPUP MODAL */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
            <div className="y2k-window modal-win" onClick={e => e.stopPropagation()}>
                <div className="title-bar">
                    <div className="title-text">Image Viewer</div>
                    <div className="title-controls"><div className="control-btn" onClick={() => setSelectedPhoto(null)}>X</div></div>
                </div>
                <div className="window-content" style={{textAlign:'center'}}>
                    <img src={selectedPhoto.url} alt="Full" style={{maxWidth: '100%', maxHeight: '70vh'}} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;