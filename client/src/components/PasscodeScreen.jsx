import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PasscodeScreen.css';

const PasscodeScreen = ({ setAuthenticated }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const CORRECT_CODE = "1234"; // Change this to your real code

  const handleBtnClick = (value) => {
    setError('');
    if (input.length < 4) {
      setInput(prev => prev + value);
    }
  };

  const handleClear = () => setInput('');

  const handleSubmit = () => {
    if (input === CORRECT_CODE) {
      setAuthenticated(true);
      navigate('/navigation');
    } else {
      setError('ACCESS DENIED');
      setInput('');
    }
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
                <div className="signal-bar">📶 T-Mobile</div>
                <h2 className="enter-code-text">ENTER CODE:</h2>
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
                <KeypadBtn val="1" label="voicemail"/>
                <KeypadBtn val="2" label="abc"/>
                <KeypadBtn val="3" label="def"/>
                <KeypadBtn val="4" label="ghi"/>
                <KeypadBtn val="5" label="jkl"/>
                <KeypadBtn val="6" label="mno"/>
                <KeypadBtn val="7" label="pqrs"/>
                <KeypadBtn val="8" label="tuv"/>
                <KeypadBtn val="9" label="wxyz"/>
                <KeypadBtn val="*" label="+"/>
                <KeypadBtn val="0" label=" "/>
                <KeypadBtn val="#" label="⇧"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PasscodeScreen;