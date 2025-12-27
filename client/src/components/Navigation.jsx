import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BirthdayCake from './BirthdayCake';
import HandwrittenLetter from './HandwrittenLetter';
import WishesWall from './WishesWall';
import PhotoGallery from './PhotoGallery';
import '../styles/Navigation.css';

const Navigation = ({ userType, setAuthenticated }) => {
  const navigate = useNavigate();
  const [showStartMenu, setShowStartMenu] = useState(false);

  const handleLogOff = () => {
      setAuthenticated(false);
      navigate('/');
  };

  const scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setShowStartMenu(false);
      }
  };

  return (
    <div className="dashboard-container">
      {/* --- TASKBAR --- */}
      <nav className="y2k-taskbar">
          <div 
            className={`start-button ${showStartMenu ? 'active' : ''}`} 
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
              <span style={{marginRight: '5px'}}>🏁</span> Start
          </div>
          
          <div className="taskbar-divider"></div>
          
          {/* Quick shortcuts on taskbar */}
          <div className="taskbar-shortcuts">
             <button onClick={() => scrollToSection('wishes-section')}>✉️ Wishes</button>
             <button onClick={() => scrollToSection('gallery-section')}>📸 Photos</button>
          </div>

          <div className="system-time">
              {userType === 'birthday-girl' ? '👑 Admin Mode' : '👤 Guest Mode'}
          </div>
      </nav>

      {/* --- START MENU POPUP --- */}
      {showStartMenu && (
          <div className="start-menu">
              <div className="start-sidebar">
                  <span className="vertical-text">WINDOWS 98</span>
              </div>
              <div className="start-items">
                  <div className="start-item" onClick={() => scrollToSection('cake-section')}>
                      🎂 Blow Candles
                  </div>
                  
                  {/* Only Birthday Girl sees the Letter */}
                  {userType === 'birthday-girl' && (
                    <div className="start-item" onClick={() => scrollToSection('letter-section')}>
                        💌 Read Letter
                    </div>
                  )}

                  <div className="start-item" onClick={() => scrollToSection('wishes-section')}>
                      📝 Guestbook
                  </div>
                  <div className="start-item" onClick={() => scrollToSection('gallery-section')}>
                      🖼️ Gallery
                  </div>
                  <div className="divider"></div>
                  <div className="start-item" onClick={handleLogOff}>
                      🔑 Log Off
                  </div>
              </div>
          </div>
      )}

      {/* --- MAIN CONTENT (SCROLLABLE) --- */}
      <main className="dashboard-content">
        <section id="cake-section">
            <BirthdayCake />
        </section>
        
        <div className="y2k-divider">
            <marquee scrollamount="10">*** HAPPY BIRTHDAY! *** SCROLL DOWN FOR SURPRISES ***</marquee>
        </div>

        {/* The Letter - Protected Content */}
        {userType === 'birthday-girl' ? (
             <section id="letter-section">
                <HandwrittenLetter />
            </section>
        ) : (
            <div style={{textAlign:'center', padding: '20px', opacity: 0.7}}>
                (A secret letter is hidden here for the birthday girl...)
            </div>
        )}

        <section id="wishes-section">
            <WishesWall userType={userType} />
        </section>

        <section id="gallery-section">
            <PhotoGallery userType={userType} />
        </section>
        
        {/* Extra padding at bottom so scrolling doesn't feel tight */}
        <div style={{height: '100px'}}></div>
      </main>
    </div>
  );
};

export default Navigation;