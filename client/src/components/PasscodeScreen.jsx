import React, { useState } from 'react';
import '../styles/PasscodeScreen.css';

const PasscodeScreen = ({ onAuthenticate }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showGuestOption, setShowGuestOption] = useState(false);

  const correctPasscode = '281204';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === correctPasscode) {
      onAuthenticate('birthday-girl');
    } else {
      setError('❌ Incorrect passcode! Try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleGuestAccess = () => {
    onAuthenticate('guest');
  };

  return (
    <div className="passcode-container">
      <div className="passcode-box">
        <h1 className="birthday-title">🎉 Happy Birthday! 🎂</h1>
        
        {!showGuestOption ? (
          <>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                className="passcode-input"
                placeholder="Enter Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                maxLength={6}
              />
              <button type="submit" className="submit-btn">
                🎁 Enter
              </button>
            </form>
            
            {error && <p className="error-message">{error}</p>}
            
            <p className="guest-link" onClick={() => setShowGuestOption(true)}>
              Don't know the passcode? Click here
            </p>
          </>
        ) : (
          <div className="guest-access">
            <h3>Want to leave a birthday wish? 💌</h3>
            <button onClick={handleGuestAccess} className="guest-btn">
              Continue as Guest
            </button>
            <p className="back-link" onClick={() => setShowGuestOption(false)}>
              ← Back
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasscodeScreen;
