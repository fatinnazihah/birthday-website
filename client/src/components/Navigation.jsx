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
  
  // LOGIC: If guest, unlocked immediately. If admin, locked until cake is eaten.
  const [isUnlocked, setIsUnlocked] = useState(userType === 'guest');

  const handleLogOff = () => {
      setAuthenticated(false);
      navigate('/');
  };

  const handleCakeComplete = () => {
      setIsUnlocked(true);
      // Optional: Auto scroll down after unlock
      setTimeout(() => {
          document.getElementById('letter-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
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
      {/* TASKBAR */}
      <nav className="y2k-taskbar">
          <div className="start-button" onClick={() => setShowStartMenu(!showStartMenu)}>
              <span role="img" aria-label="flag">🏁</span> Start
          </div>
          <div className="system-time">
              {userType === 'birthday-girl' ? 'Logged in: Sonia' : 'Logged in: Guest'}
          </div>
      </nav>

      {/* START MENU */}
      {showStartMenu && (
          <div className="start-menu">
              <div className="start-sidebar"><span className="vertical-text">Win98</span></div>
              <div className="start-items">
                  {userType === 'birthday-girl' && !isUnlocked && (
                      <div className="start-item">🎂 Blow Candles First!</div>
                  )}
                  {isUnlocked && (
                    <>
                        <div className="start-item" onClick={() => scrollToSection('wishes-section')}>✉️ Wishes</div>
                        <div className="start-item" onClick={() => scrollToSection('gallery-section')}>📸 Gallery</div>
                    </>
                  )}
                  <div className="divider"></div>
                  <div className="start-item" onClick={handleLogOff}>🔑 Log Off</div>
              </div>
          </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-content">
        
        {/* SECTION 1: CAKE (Only for Birthday Girl) */}
        {userType === 'birthday-girl' && (
            <section id="cake-section">
                {/* Pass the callback function! */}
                <BirthdayCake onComplete={handleCakeComplete} />
            </section>
        )}

        {/* SECTION 2: THE REST (Hidden until unlocked) */}
        {isUnlocked && (
            <div className="unlocked-content">
                
                <div className="y2k-divider">
                    <marquee>*** WELCOME TO THE SONIA'S DIGITAL BIRTHDAY PARTY! ***</marquee>
                </div>

                {/* SECTION 3: LETTER (Only for Birthday Girl) */}
                {userType === 'birthday-girl' && (
                    <section id="letter-section">
                        <HandwrittenLetter />
                    </section>
                )}

                {/* SECTION 4: WISHES WALL (WINDOW STYLE) */}
                <section id="wishes-section">
                    <div className="y2k-window">
                        <div className="title-bar">
                            <div className="title-text">✉️ Inbox - Outlook Express</div>
                            <div className="title-controls"><div className="control-box">X</div></div>
                        </div>
                        <div className="window-content" style={{background: '#fff'}}>
                            <WishesWall userType={userType} />
                        </div>
                    </div>
                </section>

                {/* SECTION 5: GALLERY (WINDOW STYLE) */}
                <section id="gallery-section">
                     <div className="y2k-window">
                        <div className="title-bar">
                            <div className="title-text">📁 My Pictures - C:\Users\Sonia</div>
                            <div className="title-controls"><div className="control-box">X</div></div>
                        </div>
                        <div className="window-content">
                            <PhotoGallery userType={userType} />
                        </div>
                    </div>
                </section>
            </div>
        )}
      </main>
    </div>
  );
};

export default Navigation;