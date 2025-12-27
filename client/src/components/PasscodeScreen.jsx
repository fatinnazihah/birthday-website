import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PasscodeScreen.css';

const PasscodeScreen = ({ setAuthenticated, setUserType }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const VIP_CODE = "281204"; 

  const handleBtnClick = (value) => {
    setError('');
    if (input.length < 6) setInput(prev => prev + value);
  };

  const handleClear = () => setInput('');

  const handleSubmit = () => {
    if (input === VIP_CODE) {
      setAuthenticated(true);
      setUserType('birthday-girl');
      navigate('/dashboard');
    } else {
      setError('WRONG CODE');
      setInput('');
    }
  };

  const handleGuestEntry = () => {
      setAuthenticated(true);
      setUserType('guest');
      navigate('/dashboard');
  };

  const KeypadBtn = ({ val, letters }) => (
    <button className="nokia-key" onClick={() => handleBtnClick(val)}>
      <div className="key-num">{val}</div>
      {letters && <div className="key-letters">{letters}</div>}
    </button>
  );

  return (
    <div className="passcode-container">
      <div className="nokia-3310">
        
        {/* TOP SPEAKER SLITS */}
        <div className="speaker-holes">
            <span></span><span></span><span></span>
        </div>

        {/* SCREEN AREA */}
        <div className="screen-frame">
            <div className="nokia-screen">
                <div className="status-bar">
                    <span>📶</span>
                    <span>🔋</span>
                </div>
                <div className="screen-content">
                    <p style={{fontSize: '14px', marginBottom: '5px'}}>Enter Code:</p>
                    <div className="input-display">
                        {input.split('').map((_, i) => <span key={i}>*</span>)}
                        {input.length === 0 && <span className="blink">_</span>}
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                </div>
                <div className="soft-keys">
                    <span>Menu</span>
                    <span>Back</span>
                </div>
            </div>
        </div>

        {/* LOGO */}
        <div className="nokia-logo">NOKIA</div>

        {/* CONTROLS (Navi Key + C + Arrows) */}
        <div className="control-cluster">
            <button className="c-btn" onClick={handleClear}>C</button>
            <button className="navi-key" onClick={handleSubmit}>
                <div className="navi-line"></div>
            </button>
            <div className="arrows-dummy">
                <div className="arr-up">▲</div>
                <div className="arr-down">▼</div>
            </div>
        </div>

        {/* NUMBER PAD */}
        <div className="keypad-grid">
            <KeypadBtn val="1" letters="" />
            <KeypadBtn val="2" letters="abc" />
            <KeypadBtn val="3" letters="def" />
            <KeypadBtn val="4" letters="ghi" />
            <KeypadBtn val="5" letters="jkl" />
            <KeypadBtn val="6" letters="mno" />
            <KeypadBtn val="7" letters="pqrs" />
            <KeypadBtn val="8" letters="tuv" />
            <KeypadBtn val="9" letters="wxyz" />
            <KeypadBtn val="*" letters="+" />
            <KeypadBtn val="0" letters=" " />
            <KeypadBtn val="#" letters="⇧" />
        </div>

        {/* BOTTOM MIC HOLE */}
        <div className="mic-hole"></div>

      </div>

      <div className="guest-link-container">
         <p className="guest-link" onClick={handleGuestEntry}>
            ( Don't know the code? Enter as Guest )
         </p>
      </div>
    </div>
  );
};

export default PasscodeScreen;