import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PasscodeScreen from './components/PasscodeScreen';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Default to null, will be set by PasscodeScreen
  const [userType, setUserType] = useState(null); 

  useEffect(() => {
    const authStatus = sessionStorage.getItem('authenticated');
    const storedType = sessionStorage.getItem('userType');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserType(storedType || 'guest');
    }
  }, []);

  const handleLogin = (type) => {
      setIsAuthenticated(true);
      setUserType(type);
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('userType', type);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <PasscodeScreen 
                setAuthenticated={setIsAuthenticated} 
                setUserType={handleLogin} // Pass this function!
              />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Navigation 
                userType={userType} 
                setAuthenticated={setIsAuthenticated} 
              />
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