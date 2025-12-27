const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const multer = require('multer');
require('dotenv').config();
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'birthdaywebsite-d3915.firebasestorage.app' 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Birthday Website API is running! 🎉' });
});

// Catch-all handler for React
app.get('*', (req, res) => {  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));});

// Get all wishes
app.get('/api/wishes', async (req, res) => {
  try {
    const snapshot = await db.collection('wishes')
      .orderBy('timestamp', 'desc')
      .get();
    
    const wishes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(wishes);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
});

// Add new wish
app.post('/api/wishes', async (req, res) => {
  try {
    const { name, message } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    
    const docRef = await db.collection('wishes').add({
      name,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ id: docRef.id, message: 'Wish added successfully!' });
  } catch (error) {
    console.error('Error adding wish:', error);
    res.status(500).json({ error: 'Failed to add wish' });
  }
});

// Upload photo
app.post('/api/photos/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileName = `gallery/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);
    
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });
    
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    res.json({ url: publicUrl, message: 'Photo uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Get all photos
app.get('/api/photos', async (req, res) => {
  try {
    const [files] = await bucket.getFiles({ prefix: 'gallery/' });
    
    const photos = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
          uploaded: metadata.timeCreated
        };
      })
    );
    
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
