import React, { useState, useEffect } from 'react';
import PasscodeScreen from './components/PasscodeScreen';
import BirthdayCake from './components/BirthdayCake';
import WishesWall from './components/WishesWall';
import HandwrittenLetter from './components/HandwrittenLetter';
import PhotoGallery from './components/PhotoGallery';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'birthday-girl' or 'guest'
  const [currentPage, setCurrentPage] = useState('cake');

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('authenticated');
    const type = sessionStorage.getItem('userType');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserType(type);
    }
  }, []);

  const handleAuthentication = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('userType', type);
  };

  if (!isAuthenticated) {
    return <PasscodeScreen onAuthenticate={handleAuthentication} />;
  }

  return (
    <div className="app">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        userType={userType}
      />
      
      <div className="content">
        {currentPage === 'cake' && <BirthdayCake />}
        {currentPage === 'wishes' && <WishesWall userType={userType} />}
        {currentPage === 'letter' && userType === 'birthday-girl' && <HandwrittenLetter />}
        {currentPage === 'photos' && userType === 'birthday-girl' && <PhotoGallery />}
      </div>
    </div>
  );
}

export default App;
