import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your EXACT file names
import PasscodeScreen from './components/PasscodeScreen';
import Navigation from './components/Navigation';

// Make sure your App.css is empty or just has global styles, 
// otherwise old styles might clash with the new Y2K theme.
import './App.css'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Keep your session storage logic so refreshing doesn't lock you out!
  useEffect(() => {
    const authStatus = sessionStorage.getItem('authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('authenticated', 'true');
  };

  return (
    <Router>
      <Routes>
        {/* Route 1: The Lock Screen */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <PasscodeScreen setAuthenticated={handleAuthentication} />
            )
          } 
        />

        {/* Route 2: The Main Dashboard (Your Navigation component) */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Navigation userType="guest" setAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;