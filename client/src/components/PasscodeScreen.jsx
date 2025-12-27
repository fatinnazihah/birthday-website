import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PasscodeScreen.css';

const PasscodeScreen = ({ setAuthenticated, setUserType }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // THE MASTER CODE
  const VIP_CODE = "281204"; 

  const handleBtnClick = (value) => {
    setError('');
    if (input.length < 6) { // Increased to 6 digits
      setInput(prev => prev + value);
    }
  };

  const handleClear = () => setInput('');

  const handleSubmit = () => {
    if (input === VIP_CODE) {
      setAuthenticated(true);
      setUserType('birthday-girl'); // Full Access
      navigate('/dashboard');
    } else {
      setError('ACCESS DENIED');
      setInput('');
    }
  };

  const handleGuestEntry = () => {
      setAuthenticated(true);
      setUserType('guest'); // Limited Access
      navigate('/dashboard');
  };

  const KeypadBtn = ({ val, label }) => (
    <button className="nokia-btn" onClick={() => handleBtnClick(val)}>
      <span className="btn-val">{val}</span>
      {label && <span className="btn-label">{label}</span>}
    </button>
  );

  return (
    <div className="passcode-container center-screen">
      <div className="nokia-phone">
        <div className="nokia-screen-bezel">
            <div className="nokia-screen">
                <div className="signal-bar">📶 T-Mobile <span style={{float:'right'}}>🔋</span></div>
                <h2 className="enter-code-text">ENTER PASSWORD:</h2>
                <div className="code-display">
                    {input.split('').map((_, i) => <span key={i}>*</span>)}
                    {input.length === 0 && <span className="blink-cursor">_</span>}
                </div>
                {error && <div className="error-msg blink-text">{error}</div>}
            </div>
        </div>
        
        <div className="nokia-keypad">
            <div className="control-row">
                <button className="nokia-control-btn clear-btn" onClick={handleClear}>C</button>
                <button className="nokia-control-btn enter-btn" onClick={handleSubmit}>OK</button>
            </div>
            <div className="num-pad-grid">
                {[1,2,3,4,5,6,7,8,9].map(n => <KeypadBtn key={n} val={n} />)}
                <KeypadBtn val="*" />
                <KeypadBtn val="0" />
                <KeypadBtn val="#" />
            </div>
            
            {/* Guest Link */}
            <div style={{marginTop: '20px', textAlign: 'center'}}>
                <p className="guest-link" onClick={handleGuestEntry}>
                    Don't know the code? <br/>
                    <span style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}}>
                        Click here to enter as Guest
                    </span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PasscodeScreen;