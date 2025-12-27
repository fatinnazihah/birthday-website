import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/WishesWall.css';

const WishesWall = ({ userType }) => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const q = query(collection(db, 'wishes'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const wishesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWishes(wishesData);
    } catch (error) {
      console.error('Error fetching wishes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newWish.name || !newWish.message) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'wishes'), {
        ...newWish,
        timestamp: new Date().toISOString()
      });
      setNewWish({ name: '', message: '' });
      fetchWishes();
      alert('Success: Wish recorded in database!');
    } catch (error) {
      alert('Error: Could not write to disk.');
    }
    setLoading(false);
  };

  return (
    <div className="wishes-wrapper">
      {/* 1. Guest Form (Hidden for admin usually, but shown here for testing) */}
      <div className="guestbook-form-container">
        <div className="y2k-fieldset">
            <legend>✍️ Sign the Guestbook</legend>
            <form onSubmit={handleSubmit} className="guestbook-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={newWish.name} 
                        onChange={(e) => setNewWish({ ...newWish, name: e.target.value })} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Message:</label>
                    <textarea 
                        rows="3"
                        value={newWish.message}
                        onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                        required
                    />
                </div>
                <div style={{textAlign: 'right'}}>
                    <button type="submit" className="retro-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Send to Server'}
                    </button>
                </div>
            </form>
        </div>
      </div>

      {/* 2. List of Wishes */}
      <div className="guestbook-entries">
        <p style={{borderBottom: '1px dotted black', paddingBottom: '5px'}}>
            Total Entries: {wishes.length}
        </p>
        
        {wishes.map((wish) => (
            <div key={wish.id} className="gb-entry">
                <div className="gb-header">
                    <span className="gb-name">From: {wish.name}</span>
                    <span className="gb-date">
                        {wish.timestamp ? new Date(wish.timestamp).toLocaleDateString() : 'Unknown Date'}
                    </span>
                </div>
                <div className="gb-body">
                    "{wish.message}"
                </div>
            </div>
        ))}
        
        {wishes.length === 0 && <p>No entries found. Be the first!</p>}
      </div>
    </div>
  );
};

export default WishesWall;