import React from 'react';
import '../styles/Navigation.css';

const Navigation = ({ currentPage, setCurrentPage, userType }) => {
  return (
    <nav className="navigation">
      <button 
        className={currentPage === 'cake' ? 'active' : ''}
        onClick={() => setCurrentPage('cake')}
      >
        🎂 Cake
      </button>
      
      <button 
        className={currentPage === 'wishes' ? 'active' : ''}
        onClick={() => setCurrentPage('wishes')}
      >
        💌 Wishes
      </button>
      
      {userType === 'birthday-girl' && (
        <>
          <button 
            className={currentPage === 'letter' ? 'active' : ''}
            onClick={() => setCurrentPage('letter')}
          >
            📝 Letter
          </button>
          
          <button 
            className={currentPage === 'photos' ? 'active' : ''}
            onClick={() => setCurrentPage('photos')}
          >
            📸 Photos
          </button>
        </>
      )}
    </nav>
  );
};

export default Navigation;
