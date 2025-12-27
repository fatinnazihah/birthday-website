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
      alert('🎉 Wish sent successfully!');
    } catch (error) {
      alert('❌ Error sending wish. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="wishes-container">
      <h1 className="wishes-title">💌 Birthday Wishes Wall 💌</h1>

      {userType === 'guest' && (
        <form onSubmit={handleSubmit} className="wish-form">
          <input
            type="text"
            placeholder="Your Name"
            value={newWish.name}
            onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Write your birthday wish..."
            value={newWish.message}
            onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
            rows="4"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Sending...' : '🎁 Send Wish'}
          </button>
        </form>
      )}

      <div className="wishes-grid">
        {wishes.map((wish, idx) => (
          <div key={wish.id} className="wish-card" style={{ animationDelay: `${idx * 0.1}s` }}>
            <p className="wish-message">"{wish.message}"</p>
            <p className="wish-author">— {wish.name}</p>
            <span className="wish-emoji">💝</span>
          </div>
        ))}
        
        {wishes.length === 0 && (
          <p className="no-wishes">No wishes yet! Be the first to send one 🎉</p>
        )}
      </div>
    </div>
  );
};

export default WishesWall;
