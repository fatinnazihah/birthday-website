import React from 'react';
import { useNavigate } from 'react-router-dom';
import BirthdayCake from './BirthdayCake';
import HandwrittenLetter from './HandwrittenLetter';
import WishesWall from './WishesWall';
import PhotoGallery from './PhotoGallery';
import '../styles/Navigation.css';

const Navigation = ({ userType, setAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogOff = () => {
      setAuthenticated(false);
      navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar - styled like a Windows taskbar element */}
      <nav className="y2k-taskbar">
          <div className="start-button">🏁 Start</div>
          <div className="taskbar-divider"></div>
          <button className="retro-btn logoff-btn" onClick={handleLogOff}>
            ⬅ Log Off / Back to Passcode
          </button>
          <div className="system-time">11:59 PM</div>
      </nav>

      <main className="dashboard-content">
        {/* Wrap components in sections for spacing */}
        <section id="cake-section">
            <BirthdayCake />
        </section>
        
        <div className="y2k-divider">
            <marquee scrollamount="5">*** Welcome to the Birthday Zone *** Scrolls down for more surprises ***</marquee>
        </div>

        <section id="letter-section">
            <HandwrittenLetter />
        </section>

        <section id="wishes-section">
            <WishesWall userType={userType} />
        </section>

        <section id="gallery-section">
            <PhotoGallery />
        </section>
      </main>
    </div>
  );
};

export default Navigation;